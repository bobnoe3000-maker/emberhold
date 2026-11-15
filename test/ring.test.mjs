// The Kingstone (GDD §19 v1.105–v1.106, src/sim/ring.js; docs/region-boss-proposal.md; the owner, 2026-11-15: "Ok go with
// your proposal, except world boss at the top of each hour for now (24x)", then "Can we spawn the region boss directly in
// the map?"): standing at the old stones in the Fens' own map in a window, its fight begun by walking into their reach,
// every hit of its 70 % of max HP ("a level 15 char down to about 30%... the second... should knock me out"), its own
// walk and turn, the company at the Ring's level, the AI companies coming in and the Kingstone's HP stepping up for each, its tells landing only on who's
// still in them, a Downed member up again at no cost, the pay once a window at the hero's own level, and the record saved.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { CAMP_BY } from '../src/sim/camps.js';
import { statsFor } from '../src/sim/party.js';
import * as items from '../src/sim/items.js';
import * as attrs from '../src/sim/attributes.js';
import { RING, isWindowId, windowDraw, windowAt, hpStepOf, tierOf, payOf, restoreRing } from '../src/sim/ring.js';
import { inTell, tellAt } from '../src/sim/hazards.js';
import { MODES, modeOf } from '../src/sim/modes.js';
import { pendingSkillPoints } from '../src/sim/skills.js';

const SEED = 20261115;
/** a window whose draw brings `n` AI companies */
function windowFor(n) {
  for (let d = 1; d < 29; d++) for (let h = 0; h < 24; h++) { const id = `2026-11-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}`; if (windowDraw(SEED, id).n === n) return id; }
  throw new Error('no window');
}
const C = CAMP_BY[RING.camp];
/** the right party (fighter, rogue, cleric) at `level` in the Fens, `at` tiles south of the old stones' middle (out of
 *  their reach by default) */
function company(level = 14, at = C.reach + 4) {
  const t = createSim(SEED, undefined, { scene: 'town' }); for (const i of [0, 2]) { t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  const s = createSim(SEED, undefined, { scene: 'overland', region: 'fens' });
  s.state.created = true;
  s.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  s.state.party.forEach((m, i) => { m.cls = ['fighter', 'rogue', 'cleric'][i]; m.level = level; m.xp = 0; m.attrs = null; attrs.autoAllocate(m); m.gear = items.starterKit(m); m.fallen = false; m.down = false; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; if (i) { m.perks = []; m.hidden = null; } });
  const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y + at;
  return s;
}
const open = (s, id, left = RING.window) => { s.commands.push({ type: 'ringOpen', window: id, left }); s.tick(); };
const walkIn = (s) => { const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y + C.reach - 2; s.tick(); s.tick(); };
/** the window told, and the company walked into the stones' reach */
const enter = (s, id, left = RING.window) => { open(s, id, left); walkIn(s); };
const walkOut = (s) => { const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y + C.arena + 3; s.tick(); };
const refusals = (s) => { const r = []; s.bus.on('refused', (e) => r.push(e.reason)); return r; };
const boss = (s) => s.world.enemies.find((e) => e.id === s.battle.ring.boss);

test('a window is the hour it opens; its draw is the same for anyone in it, one to four companies', () => {
  for (const id of ['2026-11-15T14', '2026-01-01T00']) assert.ok(isWindowId(id), id);
  for (const id of ['2026-11-15', '2026-11-15T4', '2026-11-15T14:00', 14, null, '']) assert.ok(!isWindowId(id), String(id));
  const ns = new Set();
  for (let h = 0; h < 24; h++) { const id = `2026-11-15T${String(h).padStart(2, '0')}`, a = windowDraw(SEED, id); assert.deepEqual(windowDraw(SEED, id), a); assert.ok(a.n >= 1 && a.n <= 4); assert.equal(new Set(a.ids).size, a.n); ns.add(a.n); }
  assert.ok(ns.size >= 3, 'the head count varies by the hour');
  assert.equal(hpStepOf(1), 1); for (let n = 2; n <= RING.maxParties; n++) assert.ok(hpStepOf(n) > hpStepOf(n - 1), `more HP for ${n}`);
});

test('the top of every hour (the owner: 24 a day): open for its first 15 minutes, announced from ten to', () => {
  const at = (h, m, s = 0) => windowAt({ y: 2026, mo: 11, d: 15, h, m, s });
  assert.deepEqual(at(14, 0), { id: '2026-11-15T14', open: true, left: 900, soon: false, until: 0 });
  assert.equal(at(14, 14, 59).left, 1); assert.ok(at(14, 14, 59).open);
  assert.ok(!at(14, 15).open && !at(14, 15).soon, 'shut, not yet announced');
  const w = at(14, 50); assert.ok(!w.open && w.soon); assert.equal(w.until, 600); assert.equal(w.id, '2026-11-15T15');
  assert.ok(at(14, 49, 59).until > RING.announce && !at(14, 49, 59).soon);
  for (let h = 0; h < 24; h++) assert.ok(isWindowId(at(h, 3).id) && at(h, 3).open, `the ${h}:00 window`);
});

test('in a window the old stones hold the Kingstone, in the map; walking into their reach is its fight, from level 10, once a window', () => {
  const id = windowFor(1), kingAt = (s) => s.world.enemies.find((e) => e.kind === 'kingstone'), golems = (s) => s.world.enemies.filter((e) => e.idle === C.id && e.kind !== 'kingstone');
  let s = company(14); s.tick();
  assert.ok(!kingAt(s) && golems(s).length, 'out of a window: the golems at the stones');
  open(s, 'soon'); assert.ok(!kingAt(s), 'a bad window id does nothing');
  open(s, id); s.tick();
  const k = kingAt(s); assert.ok(k && !golems(s).length, 'in one: the Kingstone stands there, its golems gone');
  assert.ok(Math.hypot(k.x - C.x, k.y - C.y) < 0.01, 'at their middle'); assert.equal(s.world.kind, 'overland');
  let no = refusals(s); const lo = company(9); const nl = refusals(lo); enter(lo, id);
  assert.ok(!lo.battle, 'under level 10: nothing starts'); assert.match(nl[0], /level 10/); void no;
  walkIn(s);
  assert.ok(s.battle && s.battle.ring, 'walked in: its fight'); assert.equal(modeOf(s.battle, null), MODES.event); assert.equal(s.world.kind, 'overland', 'there, in the map');
  for (const m of s.state.party) { assert.equal(m.level, RING.level, 'synced to the Ring'); assert.equal(m.hp, statsFor(m).maxHp); }
  s.commands.push({ type: 'spendPoint', id: s.state.party[0].id, stat: 'str' }); s.tick();
  no = refusals(s); s.commands.push({ type: 'rest' }); s.tick(); assert.match(no[0] || '', /Not in the Ring/);
  walkOut(s);
  assert.ok(!s.battle, 'out of the stones: walked out on it'); for (const m of s.state.party) assert.equal(m.level, 14, 'the levels given back');
  for (let i = 0; i < 4; i++) s.tick();
  assert.ok(!kingAt(s) && golems(s).length, 'that window spent: the golems back'); walkIn(s);
  assert.ok(!s.battle || !s.battle.ring, 'not the Kingstone again this hour');
});

test('every hit of its takes 70 % of max HP: a hero left at 30 %, a second unhealed Downs them; it walks and turns as a giant', () => {
  const s = company(15); enter(s, windowFor(1));
  const H = s.state.party[0], k = s.world.enemies.find((e) => e.id === s.battle.ring.boss), mx = statsFor(H).maxHp;
  for (const kind of ['slam', 'stamp', 'sweep', 'stones']) assert.equal(RING[kind].hurt, 0.7, kind);
  const p = s.state.player, land = () => { s.battle.tells.push({ id: 999, kind: 'slam', x: p.x, y: p.y, r: 2.4, from: s.state.t, at: s.state.t, hurt: 0.7, done: false }); s.tick(); };
  for (const m of s.battle.ring.all) if (m !== H) m.cd = 99;   // (nobody casts a heal between the two: 'not healed')
  s.battle.lifeline = true;                                      // (a cleric's Lifeline, once a fight, spent: it would catch the second)
  H.hp = mx; land(); assert.ok(Math.abs(H.hp / mx - 0.3) < 0.05, `one hit: ${Math.round(H.hp / mx * 100)} %`);
  land(); assert.ok(H.down, 'a second, unhealed: Downed');
  // its own walk: it moves, turns no faster than RING.king.turn a second, and never plays a plain blow
  let walked = 0, lx = k.x, ly = k.y, lf = k.face, worst = 0;
  for (let i = 0; i < 20 * 60; i++) { s.tick(); walked += Math.hypot(k.x - lx, k.y - ly); lx = k.x; ly = k.y; let d = k.face - lf; d -= 2 * Math.PI * Math.round(d / (2 * Math.PI)); worst = Math.max(worst, Math.abs(d)); lf = k.face; }
  assert.ok(walked > 8, `it walks (${walked.toFixed(1)} tiles in a minute)`); assert.ok(worst <= RING.king.turn / 20 + 1e-9, 'it turns slowly');
  assert.ok(Math.hypot(k.x - C.x, k.y - C.y) <= C.arena - RING.king.edge, 'and keeps inside the stones');
});

test('the AI companies come in, and the Kingstone\'s HP steps up for each; nobody is Fallen, a Downed member is up in 8 s', () => {
  const s = company(); enter(s, windowFor(2));
  const R = s.battle.ring, base = R.base; assert.equal(boss(s).maxHp, base);
  for (let i = 0; i < 20 * (RING.arrive[0] + 1); i++) s.tick();
  assert.equal(R.parties, 2); assert.equal(boss(s).maxHp, Math.round(base * hpStepOf(2)));
  for (let i = 0; i < 20 * (RING.arrive[1] - RING.arrive[0]); i++) s.tick();
  assert.equal(R.parties, 3); assert.equal(s.world.allies.length, 6, 'two companies of three'); assert.equal(boss(s).maxHp, Math.round(base * hpStepOf(3)));
  const m = s.state.party[1]; m.hp = 0; m.down = true; m.downT = 0;
  for (let i = 0; i < 20 * (RING.respawn - 1); i++) s.tick(); assert.ok(m.down, 'still down');
  for (let i = 0; i < 20 * 2; i++) s.tick();
  assert.ok(!m.down && !m.fallen, 'up again'); assert.ok(m.hp > statsFor(m).maxHp * 0.5);
  assert.ok(s.state.party.every((q) => !q.fallen));
});

test('a tell lands only on who\'s still in it, and the companies step out of what they\'ve seen', () => {
  const stamp = { kind: 'stamp', x: 10, y: 10, r: 4 }, sweep = { kind: 'sweep', x: 0, y: 0, r: 9, dir: 0, arc: (2 * Math.PI) / 3 };
  assert.ok(inTell(stamp, 12, 11)); assert.ok(!inTell(stamp, 15, 10));
  assert.ok(inTell(sweep, 5, 1)); assert.ok(!inTell(sweep, -5, 0), 'behind it'); assert.ok(!inTell(sweep, 10, 0), 'past its reach');
  const b = { tells: [{ ...stamp, from: 0, at: 1.6, done: false }] };
  assert.ok(tellAt(b, 11, 10, () => true)); assert.equal(tellAt(b, 11, 10, () => false), null, 'not yet seen');
  // in a fight: who's hurt by a landing tell stood in it as it landed
  const s = company(); enter(s, windowFor(1));
  let lands = 0, inAtStart = 0, inAtLand = 0; const was = new Map();
  s.bus.on('tellLand', () => { lands++; });
  for (let i = 0; i < 20 * 60; i++) {
    s.tick();
    const allies = s.battle.ring.all.filter((m) => m.ally && !m.down);
    for (const t of s.battle.tells) {
      if (t.done || t.kind !== 'stamp') continue;
      const n = allies.filter((m) => inTell(t, m.x, m.y)).length;
      if (!was.has(t.id)) { was.set(t.id, n); inAtStart += n; } else if (s.state.t + 0.051 >= t.at) { inAtLand += n; t.kind = 'stamp '; }   // (counted once, as it lands)
    }
  }
  assert.ok(lands >= 5, `tells landed (${lands})`);
  assert.ok(inAtStart > 0 && inAtLand < inAtStart / 2, `the AI out of the stamps it's seen (${inAtStart} in as they came, ${inAtLand} as they landed)`);
});

test('the pay: by the company\'s tier, at the hero\'s own level, once; a minute there at least; walking out pays nothing', () => {
  assert.equal(tierOf({ score: 100, stood: 30 }, 100), null, 'under a minute');
  assert.equal(tierOf({ score: 120, stood: 90 }, 100), 'gold'); assert.equal(tierOf({ score: 90, stood: 90 }, 100), 'silver'); assert.equal(tierOf({ score: 50, stood: 90 }, 100), 'bronze');
  const P = payOf('gold', 14, 1000, SEED, 7, false); assert.equal(P.tier, 'bronze', 'it stood: a minute there pays Bronze'); assert.equal(P.gold, RING.pay.bronze.gold * 14);
  // the window's time runs out with the Kingstone standing: Bronze, at the hero's own level, the levels given back first
  const s = company(); const H = s.state.party[0], gold0 = s.state.counters.gold || 0, xp0 = H.xp;
  let res = null; s.bus.on('ringResult', (e) => { res = e; });
  enter(s, windowFor(1), 70);
  for (let i = 0; i < 20 * 80 && !res; i++) s.tick();
  assert.ok(res, 'the end card'); assert.equal(res.how, 'lost'); assert.equal(res.tier, 'bronze');
  assert.equal(res.pay.gold, RING.pay.bronze.gold * 14, 'gold × the hero\'s own level'); assert.equal(s.state.counters.gold - gold0, res.pay.gold);
  assert.ok(H.xp > xp0 || H.level > 14); assert.ok(s.state.party.every((m) => m.level >= 14 && m.level < RING.level));
  assert.ok(res.parts.some((q) => q.heal > 0), 'the cleric\'s healing counted');
  assert.deepEqual(s.state.ring.paid, [res.window]);
  assert.equal(s.world.kind, 'overland');
  // walked out on: nothing
  const w = company(); let r2 = null; w.bus.on('ringResult', (e) => { r2 = e; });
  enter(w, windowFor(1)); for (let i = 0; i < 20 * 70; i++) w.tick();
  walkOut(w);
  assert.equal(r2.how, 'left'); assert.equal(r2.pay, null); assert.equal(w.world.kind, 'overland');
});

test('its fall pays its tier, and it\'s counted', () => {
  const s = company(); let res = null; s.bus.on('ringResult', (e) => { res = e; });
  enter(s, windowFor(1));
  for (let i = 0; i < 20 * 65; i++) s.tick();
  boss(s).hp = 1;
  for (let i = 0; i < 20 * 30 && !res; i++) s.tick();
  assert.ok(res && res.how === 'won', 'it fell'); assert.ok(['gold', 'silver', 'bronze'].includes(res.tier));
  assert.equal(s.state.ring.won, 1); assert.equal(s.state.ring.best, res.secs);
  if (res.pay.item) assert.ok(['fine', 'rare', 'heirloom'].includes(res.pay.item.r));
});

test('saved mid-fight, a game is at its own levels; the record round-trips', () => {
  const s = company(); enter(s, windowFor(3));
  for (let i = 0; i < 20 * 10; i++) s.tick();
  const snap = JSON.parse(JSON.stringify(s.snapshot()));
  assert.equal(snap.scene, 'overland'); assert.equal(snap.region, 'fens');
  assert.ok(snap.party.every((m) => m.level === 14)); assert.equal(s.state.party[0].level, RING.level, 'still synced in play');
  assert.deepEqual(snap.ring.paid, [windowFor(3)]);
  const b = createSim(SEED); b.restore(snap); assert.deepEqual(b.state.ring, s.state.ring);
  assert.deepEqual(restoreRing({ paid: ['x', '2026-11-15T03'], won: -2, best: 'q' }), { paid: ['2026-11-15T03'], won: 0, best: 0 });
  assert.deepEqual(restoreRing(undefined), { paid: [], won: 0, best: 0 }, 'an older save: a fresh record');
});

// (the owner, 2026-11-15: "starting the region boss battle - flagged for all upgrades - even there were no actual upgrades
// or points to be spent"): the fight holds the company at level 18, but points are earned at one's own level; none are
// shown or can be spent that the fight lent, and the level comes back as it was
test('in the Kingstone\'s fight no attribute or skill points are lent: none shown, none spent; the own level back after', () => {
  const s = company(14), H = s.state.party[0], skills = (m) => pendingSkillPoints(m);
  const pts0 = s.state.party.map((m) => attrs.pendingPoints(m)), sk0 = s.state.party.map((m) => skills(m));
  enter(s, windowFor(1));
  assert.ok(s.battle && s.battle.ring, 'in the fight'); assert.equal(H.level, RING.level);
  assert.deepEqual(s.state.party.map((m) => attrs.pendingPoints(m)), pts0, 'no attribute points lent');
  assert.deepEqual(s.state.party.map((m) => skills(m)), sk0, 'no skill points lent');
  const r = refusals(s), a0 = { ...(H.attrs || {}) };
  s.commands.push({ type: 'spendPoint', id: H.id, attr: 'might' }); s.tick();
  assert.deepEqual(H.attrs, a0, 'a point the fight lent can\'t be spent'); void r;
  walkOut(s); for (let i = 0; i < 40 && s.battle && s.battle.ring; i++) s.tick();
  assert.equal(H.level, 14); assert.equal(H.syncFrom, undefined);
});

// (the owner, 2026-11-15: "The region boss wont show even if it is time if i am already fighting the stone giant NPCs, i have to
// exit the ring for the boss to show")
test('the hour comes while the company fights the old stones\' golems: they go, and the Kingstone\'s fight starts there', () => {
  const s = company(14); s.tick(); walkIn(s);
  assert.ok(s.battle && s.battle.camp && s.battle.camp.id === C.id && !s.battle.ring, 'fighting the golems');
  assert.ok(!s.world.enemies.some((e) => e.kind === 'kingstone'), 'no Kingstone yet');
  open(s, windowFor(1)); s.tick();
  assert.ok(s.battle && s.battle.ring, 'the Kingstone\'s fight, without walking out');
  assert.ok(s.world.enemies.some((e) => e.kind === 'kingstone' && e.hp > 0), 'it stands'); assert.ok(!s.world.enemies.some((e) => e.kind === 'golem' && e.hp > 0), 'its golems gone');
  for (const m of s.state.party) assert.equal(m.level, RING.level, 'synced to the Ring');
  // under level 10: the golems' fight goes on, nothing taken from it
  const lo = company(9); lo.tick(); walkIn(lo); open(lo, windowFor(1)); lo.tick();
  assert.ok(lo.battle && lo.battle.camp && !lo.battle.ring, 'no Kingstone for a company under 10: its golems\' fight goes on');
});
