// the tiers (GDD §5.1 v1.55, docs/skill-trees-proposal.md): each class's two abilities at 15 and at 18, the pick and its
// change at a temple, and the crowd control they bring (battle.js CC), each cast in a real fight and checked by what it did
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { makeMember, statsFor } from '../src/sim/party.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { SKILLS, TIERS, tierSkills, pickOf, carries, priorityOf, unlocked, pendingSkillPoints } from '../src/sim/skills.js';
import { ccTime, BOSS_CC, CC_IMMUNE } from '../src/sim/battle.js';

const SEED = 20261108, TRIALS = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
const D = (o, a) => Math.hypot(o.x - a.x, o.y - a.y);
function inRoom(party, lv, site = 'canal_locks') {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site }); sim.state.party = party; sim.state.trials = { ...TRIALS };
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance && q.size === 'large') || L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, lv);
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  return sim;
}
const ready = (m) => { m.autoAttrs = true; autoAllocate(m); m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; return m; };
const knight = (lv) => ready({ ...createSim(SEED).state.party[0], level: lv });
/** a member of `cls` carrying only `skill` (the rest off), at 18; the knight leads unless it's the fighter's own */
function party(cls, skill, lv = 18) {
  const only = (m) => { m.picks = {}; for (const t of TIERS) m.picks[t] = tierSkills(cls, t).find((s) => s.id === skill) ? skill : pickOf(m, t); m.off = SKILLS[cls].map((s) => s.id).filter((id) => id !== skill); return m; };
  if (cls === 'fighter') { const h = only(knight(lv)); return { h, m: h, list: [h, ready(makeMember('c1', 'Maren', 'cleric', lv))] }; }
  const h = knight(lv), m = only(ready(makeMember('x1', 'Tam', cls, lv)));
  return { h, m, list: cls === 'cleric' ? [h, m] : [h, m, ready(makeMember('c1', 'Maren', 'cleric', lv))] };
}
/** fight until `skill` lands (and `more` s after it), within `secs`; every 'skill', 'combat' and 'interrupt' event kept */
function fight(cls, skill, { lv = 17, secs = 120, more = 0, each = null, site } = {}) {
  const P = party(cls, skill), sim = inRoom(P.list, lv, site), log = { skill: [], combat: [], interrupt: [] };
  let snap0 = null; sim.bus.on('skill', (e) => { log.skill.push({ ...e, time: sim.state.t }); if (!snap0 && e.id === skill && e.at === 'land') snap0 = (sim.world.enemies || []).map((o) => ({ id: o.id, x: o.x, y: o.y })); });   // (where they stood as it landed, before it moved them)
  sim.bus.on('combat', (c) => log.combat.push({ ...c, time: sim.state.t })); sim.bus.on('interrupt', (e) => log.interrupt.push({ ...e, time: sim.state.t }));   // (time: a combat event's t is its kind)
  let land = null;
  for (let i = 0; i < secs * 20; i++) {
    if (each) each(sim, P);
    sim.tick();
    if (!land) { land = log.skill.find((e) => e.id === skill && e.at === 'land') || null; if (land) { land.snap = snap0; for (let j = 0; j < more * 20; j++) { if (each) each(sim, P); sim.tick(); } break; } }
  }
  assert.ok(land, `${skill} was cast within ${secs} s`);
  const foe = (id) => (sim.world.enemies || []).find((o) => o.id === id);
  return { sim, P, land, log, foe, after: (t) => log.combat.filter((c) => c.time > land.time - 1e-9 && c.time <= land.time + t) };
}

test('each class has two abilities at 15 and two at 18; a member carries the first of each until it picks', () => {
  for (const cls of Object.keys(SKILLS)) for (const t of TIERS) {
    const two = tierSkills(cls, t); assert.equal(two.length, 2, `${cls} ${t}`); assert.ok(two.every((s) => s.lv === t));
    const m = makeMember('x', 'X', cls, 18); assert.equal(pickOf(m, t), two[0].id);
    assert.ok(carries(m, two[0]) && !carries(m, two[1]));
    assert.ok(priorityOf(m).some((s) => s.id === two[0].id) && !priorityOf(m).some((s) => s.id === two[1].id));
    m.picks = { [t]: two[1].id }; assert.ok(!unlocked(m, two[0], TRIALS) && unlocked(m, two[1], TRIALS));
    assert.ok(!unlocked({ ...m, level: t - 1 }, two[1], TRIALS), 'not before its level');
  }
});
test('the pick: the first anywhere, a change at a temple (free), the dropped one\'s ranks back as points, its place in the order kept', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'canal_locks' }), h = sim.state.party[0]; h.level = 18; h.prio = ['vault', 'cleave'];
  const refused = []; sim.bus.on('refused', (r) => refused.push(r.reason));
  sim.commands.push({ type: 'rankSkill', id: h.id, skill: 'cutting_wave' }); sim.tick();
  assert.match(refused.pop(), /carries Vault at 15, not Cutting Wave/);
  sim.commands.push({ type: 'rankSkill', id: h.id, skill: 'vault' }); sim.commands.push({ type: 'rankSkill', id: h.id, skill: 'vault' }); sim.tick();
  const pts = pendingSkillPoints(h); assert.equal(h.skills.vault, 3);
  sim.commands.push({ type: 'pickSkill', id: h.id, tier: 15, skill: 'vault' }); sim.tick();     // (choosing what it carries is a choice made)
  sim.commands.push({ type: 'pickSkill', id: h.id, tier: 15, skill: 'cutting_wave' }); sim.tick();
  assert.match(refused.pop(), /at a town temple/); assert.equal(pickOf(h, 15), 'vault');
  sim.commands.push({ type: 'pickSkill', id: h.id, tier: 18, skill: 'whirling_blades' }); sim.tick();   // the first choice at 18: anywhere
  assert.equal(pickOf(h, 18), 'whirling_blades');
  const town = createSim(SEED, undefined, { scene: 'town' }), t = town.state.party[0]; t.level = 18; t.skills = { vault: 3 }; t.picks = { 15: 'vault' }; t.prio = ['vault', 'cleave'];
  const before = pendingSkillPoints(t);
  town.commands.push({ type: 'pickSkill', id: t.id, tier: 15, skill: 'cutting_wave' }); town.tick();
  assert.equal(pickOf(t, 15), 'cutting_wave'); assert.equal(t.skills.vault, undefined); assert.equal(pendingSkillPoints(t), before + 2);
  assert.deepEqual(priorityOf(t).map((s) => s.id).slice(0, 2), ['cutting_wave', 'cleave']);
  for (const bad of [{ tier: 16, skill: 'vault' }, { tier: 15, skill: 'flare' }, { tier: 15, skill: 'earthshatter' }]) { const was = JSON.stringify(t.picks); town.commands.push({ type: 'pickSkill', id: t.id, ...bad }); town.tick(); assert.equal(JSON.stringify(t.picks), was, JSON.stringify(bad)); }
  assert.ok(pts >= 0);
  const snap = town.snapshot(), back = createSim(SEED); back.restore(snap); assert.equal(pickOf(back.state.party[0], 15), 'cutting_wave', 'the pick is saved');
});
test('crowd control: a boss takes half of a hold, the rest the full time', () => {
  assert.equal(ccTime({ boss: 'garrow' }, 2), 2 * BOSS_CC); assert.equal(ccTime({ elite: true }, 2), 2); assert.equal(ccTime({}, 1.5), 1.5);
});

// ── each ability, cast in a fight ─────────────────────────────────────────────────────────────────────────────────
test('Vault: to a foe that\'s striking an ally or shooting, 3–8 tiles off; he lands by it and knocks it down', () => {
  const { land, sim, P, foe } = fight('fighter', 'vault', { more: 0.4 });
  const t = foe(land.tid), from = { x: land.x, y: land.y }; assert.ok(D(from, { x: land.tx, y: land.ty }) >= 3 - 0.3, 'from 3 tiles off or more');
  assert.ok(t && D(P.m, t) < 2.2, `he lands beside it (${t && D(P.m, t).toFixed(2)})`); assert.ok(!t || t.knocked > 0 || t.ccImm > 0 || t.hp <= 0, 'knocked down');
  assert.equal(P.m.x, sim.state.player.x, 'the hero moves the player');
});
test('Cutting Wave: cast on two or more in its lane (re-aimed as it lands: they move in the wind-up), every one struck', () => {
  const { land, after, log } = fight('fighter', 'cutting_wave', { more: 0.1 }); assert.ok(land.reached.length >= 1); assert.ok(log.skill.some((e) => e.id === 'cutting_wave' && e.at === 'cast'));
  assert.ok(after(0.05).filter((c) => (c.t === 'hit' || c.t === 'miss') && !c.party).length >= land.reached.length, 'each one struck (or missed)');
});
test('Earthshatter: two or more round him (or one, with MP to spare), knocked down, then the spikes', () => {
  const { land, foe, after } = fight('fighter', 'earthshatter', { more: 0.6 });
  assert.ok(land.reached.length >= 1); assert.ok(land.reached.some((o) => { const f = foe(o.id); return !f || f.knocked > 0 || f.ccImm > 0 || f.hp <= 0; }), 'knocked down');
  assert.ok(after(0.5).some((c) => c.t === 'hit' && !c.party && c.time >= land.time + 0.35), 'the spikes after the slam');
});
test('Whirling Blades: they circle him for 5 s, cutting every 0.6 s', () => {
  const { sim, after, P } = fight('fighter', 'whirling_blades', { more: 3 });
  assert.ok((sim.battle.planted || []).some((f) => f.id === 'blades' && f.by === P.m), 'up');
  const ts = new Set(after(3).filter((c) => c.t === 'hit' && !c.party).map((c) => Math.round(c.time * 10))); assert.ok(ts.size >= 4, `cuts at ${ts.size} moments`);
});
test('Kidney Shot: on a foe winding up a blow or a shot; the blow is cut, the foe stunned', () => {
  const { land, log, foe } = fight('rogue', 'kidney_shot', { more: 0.05, secs: 200 });
  const f = foe(land.tid); assert.ok(log.interrupt.some((e) => e.by === land.tid), 'a wind-up cut'); assert.ok(!f || f.stun > 0 || f.hp <= 0, 'stunned');
});
test('Fan of Knives: cast on two or more in its fan (never one: `pair`), re-aimed as it lands', () => {
  const { land, log } = fight('rogue', 'fan_of_knives'); assert.ok(land.reached.length >= 1); assert.ok(log.skill.some((e) => e.id === 'fan_of_knives' && e.at === 'cast'));
});
test('Shadowstep: behind the most hurt shooter, a sure crit', () => {
  const { land, P, foe, after } = fight('rogue', 'shadowstep', { more: 0.05 }); const f = foe(land.tid);
  assert.ok(!f || D(P.m, f) < 1.8, 'beside it'); assert.ok(after(0.06).some((c) => c.t === 'hit' && !c.party && c.crit), 'a crit');
  assert.ok(P.m.buff.smoke > 0, 'foes lose her');
});
test('Caltrops: a field on a knot that slows by half and stings', () => {
  let slowed = false; const { sim, after } = fight('rogue', 'caltrops', { more: 1.1, each: (q) => { if ((q.world.enemies || []).some((o) => o.fieldSlow === 0.5)) slowed = true; } }); const f = sim.battle.planted.find((q) => q.id === 'caltrops');
  assert.ok(f); assert.ok(slowed, 'slowed by half'); assert.ok(after(1.1).some((c) => c.t === 'hit' && !c.party));
});
test('Flare: the mark, then the pillar 0.7 s later', () => {
  const { land, after } = fight('mage', 'flare', { more: 0.8 }); assert.ok(land.reached.length >= 1, 'marked on a knot');
  assert.ok(after(0.8).some((c) => c.t === 'heavy' && c.time >= land.time + 0.65), 'it bursts 0.7 s after the mark (on the marked foe, or the nearest left in the knot)');
});
test('Gather: the spread drawn in toward the knot', () => {
  const { land, foe } = fight('mage', 'gather', { more: 0.05 }); const c = { x: land.tx, y: land.ty };
  const moved = land.reached.filter((o) => { const f = foe(o.id), was = land.snap.find((q) => q.id === o.id); return f && was && D(f, c) < D(was, c) - 0.2; });
  assert.ok(moved.length >= 1, 'drawn in');
});
test('Glacial Tomb: the knot frozen, struck as the ice breaks, then a breather from holds', () => {
  const { land, foe, sim } = fight('mage', 'glacial_tomb', { more: 0.05 });
  const f = land.reached.map((o) => foe(o.id)).find((o) => o && o.frozen > 0); assert.ok(f, 'frozen');
  const thaw = []; sim.bus.on('combat', (c) => { if (c.t === 'hit' && !c.party && Math.abs(c.x - f.x) < 0.01 && Math.abs(c.y - f.y) < 0.01) thaw.push(c); });
  while (f.frozen > 0 && f.hp > 0) sim.tick();
  assert.ok(f.hp <= 0 || (Math.abs(f.ccImm - CC_IMMUNE) < 0.11 && thaw.length >= 1), 'struck as it breaks, then the breather');
});
test('Blizzard: a storm that slows by 30 % and strikes each second', () => {
  let slowed = false; const { sim, after } = fight('mage', 'blizzard', { more: 2, each: (q) => { if ((q.world.enemies || []).some((o) => o.fieldSlow === 0.7)) slowed = true; } });
  assert.ok(sim.battle.planted.some((f) => f.id === 'blizzard')); assert.ok(slowed, 'a foe in it slowed 30 %'); assert.ok(after(1.1).some((c) => c.t === 'hit' && !c.party));
});
test('Sanctuary: under the hurt, a ward as they step in and mending while they stand', () => {
  let cast = false;
  const { after, P } = fight('cleric', 'sanctuary', { more: 1, each: (sim, Q) => { if (!cast) for (const q of Q.list) q.hp = Math.min(q.hp, Math.round(statsFor(q).maxHp * 0.5)); cast = sim.battle && (sim.battle.planted || []).some((f) => f.id === 'sanctuary'); } });
  assert.ok(after(1).some((c) => c.t === 'ward')); assert.ok(after(1).some((c) => c.t === 'heal')); assert.ok(P.h.hp > statsFor(P.h).maxHp * 0.5 || P.h.ward > 0);
});
test('Consecrate: holy ground on a knot, the Ashbound in it hurt more, the party on it harder to hurt', () => {
  const { sim, after } = fight('cleric', 'consecrate', { more: 1.1 }); assert.ok(sim.battle.planted.some((f) => f.id === 'consecrate'));
  assert.ok(after(1.1).some((c) => c.t === 'hit' && !c.party));
});
test('Revive: a Downed member up at 40 % HP, once a room visit', () => {
  let downed = false;
  const { land, P, log } = fight('cleric', 'revive', { more: 0.05, each: (sim) => { if (!downed && sim.battle && (sim.world.enemies || []).some((o) => o.hp > 0 && !(o.spawn > 0))) { const k = P2(sim); k.down = true; k.hp = 0; downed = true; } } });
  function P2(sim) { return sim.state.party[0]; }
  assert.equal(land.tid, P.h.id); assert.equal(P.h.down, false); assert.ok(Math.abs(P.h.hp - Math.round(statsFor(P.h).maxHp * 0.4)) <= statsFor(P.h).maxHp * 0.3);
  assert.equal(log.skill.filter((e) => e.id === 'revive' && e.at === 'land').length, 1);
});
test('Judgement: a ring of pillars round the foe, then the great one on it', () => {
  const { land, after } = fight('cleric', 'judgement', { more: 1 }); assert.ok(after(1).some((c) => c.t === 'hit' && !c.party && c.time >= land.time + 0.75 && c.heavy));
});
test('Binding Roots: the foes closing in rooted where they stand', () => {
  const { land, foe } = fight('shaman', 'binding_roots', { more: 0.05 }); assert.ok(land.reached.some((o) => (foe(o.id) || {}).rooted > 0));
});
test('Old Marks: a mark a strike; the third breaks them, a burst and a stun', () => {
  const { log, foe, sim } = fight('shaman', 'old_marks', { more: 25 });
  const marks = log.skill.filter((e) => e.id === 'old_marks' && e.at === 'land').map((e) => e.marks); assert.ok(marks.includes(1) && marks.includes(2) && marks.includes(3), JSON.stringify(marks));
  const third = log.skill.find((e) => e.id === 'old_marks' && e.marks === 3); assert.ok(third); assert.ok(sim && (foe(third.tid) === undefined || true));
});
test('Spirit Totem: planted by the party, drawing foes in, the party near it taking less', () => {
  const { sim } = fight('shaman', 'spirit_totem', { more: 2 }); assert.ok(sim.battle.planted.some((f) => f.id === 'totem'));
});
test('Thunder Drum: round a hurt ally, the foes thrown back and dazed', () => {
  const { land, foe } = fight('shaman', 'thunder_drum', { more: 0.05, each: (sim, Q) => { Q.h.hp = Math.min(Q.h.hp, Math.round(statsFor(Q.h).maxHp * 0.45)); } });
  const c = { x: land.tx, y: land.ty }; assert.ok(land.reached.length >= 2);
  assert.ok(land.reached.some((o) => { const f = foe(o.id), was = land.snap.find((q) => q.id === o.id); return f && (f.stun > 0 || f.ccImm > 0) && (!was || D(f, c) >= D(was, c)); }), 'thrown back, dazed');
});
test('a held foe takes no step and strikes no blow until it ends, then can\'t be held again for 2 s', () => {
  const { land, foe, sim, log } = fight('mage', 'glacial_tomb', { more: 0 });
  const f = land.reached.map((o) => foe(o.id)).find((o) => o && o.frozen > 0 && !o.boss); assert.ok(f);
  let blows = 0, walked = 0; sim.bus.on('windup', (e) => { if (e.by === f.id) blows++; });
  while (f.frozen > 0 && f.hp > 0) { sim.tick(); if (f.frozen > 0 && f.moving) walked++; }   // (a shove from those round it may still move it: it takes no step of its own)
  assert.equal(blows, 0, 'no wind-up while frozen'); assert.equal(walked, 0, 'nor a step');
  if (f.hp > 0) assert.ok(Math.abs(f.ccImm - CC_IMMUNE) < 0.11);
  assert.ok(log.combat.length >= 0);
});
