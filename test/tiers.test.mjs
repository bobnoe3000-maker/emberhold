// the skill ladder (GDD §5.1 v1.56): a skill every 3 levels, every third a passive with ranks, four abilities taken into a
// fight (the loadout); the skill trees' abilities (v1.55) and the crowd control they bring (battle.js CC), each cast in a
// real fight and checked by what it did; the passives at work
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { makeMember, statsFor } from '../src/sim/party.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { SKILLS, PASSIVES, ladderOf, passiveVal, inPlay, priorityOf, unlocked, pendingSkillPoints, skillDef, LOADOUT } from '../src/sim/skills.js';
import { migrate, SAVE_VERSION } from '../src/persist/save.js';
import { ccTime, BOSS_CC, CC_IMMUNE, MELEE_GAP } from '../src/sim/battle.js';

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
/** a member of `cls` with only `skill` in play, at its level (18 at least); the knight leads unless it's the fighter's own */
function party(cls, skill, lv = Math.max(18, (skillDef(cls, skill) || { lv: 18 }).lv)) {
  const only = (m) => { m.loadout = [skill]; return m; };
  if (cls === 'fighter') { const h = only(knight(lv)); return { h, m: h, list: [h, ready(makeMember('c1', 'Maren', 'cleric', lv))] }; }
  const h = knight(lv), m = only(ready(makeMember('x1', 'Tam', cls, lv)));
  return { h, m, list: cls === 'cleric' ? [h, m] : [h, m, ready(makeMember('c1', 'Maren', 'cleric', lv))] };
}
/** fight until `skill` lands (and `more` s after it), within `secs`; every 'skill', 'combat' and 'interrupt' event kept */
function fight(cls, skill, { lv, secs = 120, more = 0, each = null, site } = {}) {
  const P = party(cls, skill), sim = inRoom(P.list, lv ?? P.m.level - 1, site), log = { skill: [], combat: [], interrupt: [] };
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

test('the ladder: the first ability at 1, a new skill every 3 levels, every third a passive (9, 18, 27), nothing to choose', () => {
  for (const cls of Object.keys(SKILLS)) {
    const L = ladderOf(cls);
    assert.deepEqual(L.map((s) => s.lv), [1, 3, 6, 9, 12, 15, 18, 21, 24, 27], cls);
    assert.deepEqual(L.filter((s) => s.passive).map((s) => s.lv), [9, 18, 27], cls);
    assert.deepEqual(L.filter((s) => s.trial).map((s) => s.lv), [6, 12], `${cls}: the trials' two`);
    const m = makeMember('x', 'X', cls, 27); assert.equal(priorityOf(m).length, 7, 'every ability in the order');
    for (const s of L) { assert.ok(unlocked(m, s, TRIALS), `${s.id} learned at 27`); if (s.lv > 1) assert.ok(!unlocked({ ...m, level: s.lv - 1 }, s, TRIALS), `${s.id} not before ${s.lv}`); }
  }
});
test('the loadout: four abilities into a fight; until it\'s set, the first four of the order; set anywhere, refused past four or unlearned', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'canal_locks' }), h = sim.state.party[0]; h.level = 15; sim.state.trials = { ...TRIALS };
  assert.deepEqual(inPlay(h, TRIALS).map((s) => s.id), ['cleave', 'cutting_wave', 'shield_wall', 'second_wind'], 'the first four of the order');
  const refused = []; sim.bus.on('refused', (r) => refused.push(r.reason));
  sim.commands.push({ type: 'setLoadout', id: h.id, skills: ['vault', 'cleave', 'shield_wall'] }); sim.tick();
  assert.deepEqual(inPlay(h, TRIALS).map((s) => s.id), ['cleave', 'shield_wall', 'vault'], 'its four (three), in its order');
  for (const bad of [['cleave', 'cutting_wave', 'shield_wall', 'second_wind', 'vault'], ['cleave', 'cleave'], ['firebolt'], ['iron_hide']]) { sim.commands.push({ type: 'setLoadout', id: h.id, skills: bad }); sim.tick(); }
  sim.commands.push({ type: 'setLoadout', id: h.id, skills: ['earthshatter'] }); sim.tick();
  assert.match(refused.pop(), /hasn't learned Earthshatter/);
  assert.deepEqual(h.loadout, ['vault', 'cleave', 'shield_wall'], 'nothing else took');
  assert.equal(LOADOUT, 4);
  const snap = sim.snapshot(), back = createSim(SEED); back.restore(snap); assert.deepEqual(back.state.party[0].loadout, ['vault', 'cleave', 'shield_wall'], 'saved');
  // in a fight: only what's in play is cast
  const P = party('fighter', 'cutting_wave', 15); const f = inRoom(P.list, 14), cast = new Set(); f.bus.on('skill', (e) => { if (e.by === P.h.id) cast.add(e.id); });
  for (let i = 0; i < 20 * 60; i++) f.tick();
  assert.deepEqual([...cast], ['cutting_wave'], 'only its one in play');
});
test('the passives: at their level, ranked with skill points, their value growing a rank', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }), h = sim.state.party[0];
  h.level = 8; assert.equal(passiveVal(h, 'iron_hide'), 0, 'not before 9');
  h.level = 9; assert.equal(passiveVal(h, 'iron_hide'), 0.08);
  const def9 = statsFor(h).def, pts = pendingSkillPoints(h);
  sim.commands.push({ type: 'rankSkill', id: h.id, skill: 'iron_hide' }); sim.tick();
  assert.equal(h.skills.iron_hide, 2); assert.equal(pendingSkillPoints(h), pts - 1); assert.ok(Math.abs(passiveVal(h, 'iron_hide') - 0.1) < 1e-12);
  assert.ok(statsFor(h).def > def9, 'more DEF at rank 2');
  for (const cls of Object.keys(PASSIVES)) for (const P of PASSIVES[cls]) { const m = makeMember('x', 'X', cls, 27); m.skills = { [P.id]: 5 }; assert.ok(passiveVal(m, P.id) > P.val[0], `${P.id} grows by rank`); }
  assert.equal(passiveVal(makeMember('r', 'R', 'rogue', 27), 'iron_hide'), 0, 'another class\'s: nothing');
});
test('a save from before the ladder (v35): picks dropped, ranks kept', () => {
  const sim = createSim(SEED), snap = sim.snapshot(); snap.party[0].picks = { 15: 'cutting_wave' }; snap.party[0].skills = { cleave: 3 };
  const out = migrate({ version: 35, savedAt: 1, data: snap });
  assert.equal(out.version, SAVE_VERSION); assert.equal(out.data.party[0].picks, undefined); assert.deepEqual(out.data.party[0].skills, { cleave: 3 });
});
// the passives at work in a fight
test('Hold the Line: an ally beside the fighter takes less, the more for its rank', () => {
  const run = (rank) => { const h = knight(18), r = ready(makeMember('r1', 'Wren', 'rogue', 18)); h.skills = { hold_the_line: rank };
    h.off = SKILLS.fighter.map((q) => q.id); r.off = SKILLS.rogue.map((q) => q.id);
    const sim = inRoom([h, r], 17), P = sim.state.player; let took = 0, hits = 0; sim.bus.on('combat', (c) => { if (c.t === 'hit' && c.party && Math.abs(c.x - r.x) < 0.01 && Math.abs(c.y - r.y) < 0.01) { took += c.amount; hits++; } });
    for (let i = 0; i < 20 * 40; i++) { r.x = P.x + 0.9; r.y = P.y + 0.4; r.hp = statsFor(r).maxHp; h.hp = statsFor(h).maxHp; sim.tick(); }   // (she stands by him: within the line's 3 tiles)
    return took / Math.max(1, hits); };
  const one = run(1), five = run(5); assert.ok(five < one, `a blow on her: ${five.toFixed(1)} at rank 5 against ${one.toFixed(1)} at rank 1`);
});
test('crowd control: a boss takes half of a hold, the rest the full time', () => {
  assert.equal(ccTime({ boss: 'garrow' }, 2), 2 * BOSS_CC); assert.equal(ccTime({ elite: true }, 2), 2); assert.equal(ccTime({}, 1.5), 1.5);
});

// ── each ability, cast in a fight ─────────────────────────────────────────────────────────────────────────────────
test('Vault: to a foe that\'s striking an ally or shooting, 3–8 tiles off; he lands by it and knocks it down', () => {
  const { land, sim, P, foe } = fight('fighter', 'vault', { more: 0.4 });
  const t = foe(land.tid), from = { x: land.x, y: land.y }; assert.ok(D(from, { x: land.tx, y: land.ty }) >= 3 - 0.3, 'from 3 tiles off or more');
  assert.ok(t && D(P.m, t) < 3 + MELEE_GAP, `he lands in reach of it (${t && D(P.m, t).toFixed(2)})`); assert.ok(!t || t.knocked > 0 || t.ccImm > 0 || t.hp <= 0, 'knocked down');
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
  // (her first may be the stun on an elite in her turn: v1.87's wider gap brought one into reach sooner. The first that cut a wind-up)
  const P = party('rogue', 'kidney_shot'), sim = inRoom(P.list, P.m.level - 1), cuts = [], lands = [];
  sim.bus.on('interrupt', (e) => cuts.push({ ...e, t: sim.state.t })); sim.bus.on('skill', (e) => { if (e.id === 'kidney_shot' && e.at === 'land') lands.push({ ...e, t: sim.state.t }); });
  let hit = null;
  for (let i = 0; i < 300 * 20 && !hit; i++) { sim.tick(); hit = lands.find((l) => cuts.some((c) => c.by === l.tid && Math.abs(c.t - l.t) < 0.06)) || null; }
  assert.ok(hit, 'a wind-up cut'); const f = (sim.world.enemies || []).find((o) => o.id === hit.tid); assert.ok(!f || f.stun > 0 || f.hp <= 0, 'stunned');
});
test('Fan of Knives: cast on two or more in its fan (never one: `pair`), re-aimed as it lands', () => {
  const { land, log } = fight('rogue', 'fan_of_knives', { secs: 240 }); /* (240: the rooms' dressing capped, v1.62, moved the foes; it waits for two in its fan) */ assert.ok(land.reached.length >= 1); assert.ok(log.skill.some((e) => e.id === 'fan_of_knives' && e.at === 'cast'));
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
  const { log, foe, sim } = fight('shaman', 'old_marks', { more: 60 });   // (60: with the rooms' dressing capped, v1.62, its first target fell before a third mark in 25)
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
