// The Bowl (GDD §17 v1.85, docs/bowl-arena-proposal.md; the owner, 2026-11-13: "Menu fine at min level 6, in brackets, lets
// test and simulate healing for the right balance, for marks only, company locked for the tournament, yes a hero only
// option. Tournament are daily reset for now"): a bout against a rival company through the commands, its pay, the world
// given back as it was, the day's tourney, and the record saved. (v1.86; the owner: "choose from 5 opponents, refresh 3x per
// day. I can have up to 10 fights per day. The game simulates similar rules for ai opponents. Lets assume 100 teams")
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { statsFor } from '../src/sim/party.js';
import { DAY_S } from '../src/sim/heroes.js';
import { BOUT, ccTime } from '../src/sim/battle.js';
import { ROSTER, ROSTER_IDS, makeCompany, GRADES } from '../src/sim/rivals.js';
import { BOWL, picksOf, bracketOf, rate, expected, restoreBowl, companyOn, fieldOn, teamOf } from '../src/sim/bowl.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';

const SEED = 20260807;
const arena = JSON.parse(readFileSync(new URL('../content/arena.json', import.meta.url), 'utf8'));

/** a made hero at a level, two hires at it too, in the Old Barrows' first floor (its way in: no fight) */
function company(level = 7, hires = [1, 3]) {
  const s = createSim(SEED, undefined, { scene: 'town' });
  s.commands.push({ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'thornwick_born', name: 'Ada' }); s.tick();
  for (const i of hires) { s.state.counters.gold = 1e9; s.commands.push({ type: 'hire', idx: i }); s.tick(); }
  s.state.counters.gold = 0;
  for (const m of s.state.party) { m.level = level; m.hp = statsFor(m).maxHp; }
  s.commands.push({ type: 'bowlOpen' }); s.tick();                 // (the board looked at: the day's five drawn)
  return s;
}
const run = (s, n = 20 * 200) => { for (let i = 0; i < n && s.battle; i++) s.tick(); };
const events = (s) => { const out = { refused: [], result: [] }; s.bus.on('refused', (e) => out.refused.push(e.reason)); s.bus.on('bowlResult', (e) => out.result.push(e)); return out; };

test('the roster: its words (content) and its make-up (rivals.js) in step, every company three, ids stable', () => {
  assert.deepEqual(arena.companies.map((c) => c.id), ROSTER_IDS);
  for (const c of arena.companies) {
    const row = ROSTER[c.id];
    assert.equal(row[0], c.manner, c.id);
    assert.deepEqual(row.slice(1).map((t) => t.split(':')[0]), c.members.map((m) => m.cls), c.id);
  }
  assert.ok(ROSTER_IDS.includes('widow_brack') && ROSTER_IDS.includes('coalbrook_boys') && ROSTER_IDS.includes('hesks_cousins'), 'canon\'s three');
  assert.ok(ROSTER_IDS.length >= BOWL.field, 'enough for a tourney');
});

test('the Sand (v1.88, the Quarry Ring): one space, to the plan rules, open from wall to wall; no chest, no shrine; the gate in its north face', () => {
  assert.deepEqual(checkPlan(PLANS.bowl), []);
  assert.ok(checkPlan({ ...PLANS.bowl, floors: [{ ...PLANS.bowl.floors[0], spaces: [...PLANS.bowl.floors[0].spaces, { ...PLANS.bowl.floors[0].spaces[0], id: 'x', x: 60 }] }] }).some((e) => /one space/.test(e)), 'an arena is its one sand');
  const s = company();
  s.commands.push({ type: 'bowlBout', id: picksOf(s.state)[0].id }); s.tick();
  const w = s.world, L = w.level, sand = L.descentRoom;
  assert.equal(w.site, 'bowl'); assert.ok(w.arena && sand.part === 'the_sand');
  assert.equal(L.rooms.length, 1); assert.equal(L.entrance, sand, 'the sand is the way in too');
  assert.ok(w.exitAt && w.exitAt.y < sand.cy - sand.rh * 0.6, 'the gate (the stair up) in the north face');
  for (const [k, p] of w.props) { assert.ok(p !== 'chest' && p !== 'shrine', `${p} at ${k}`); const c = L.cells.get(k); if (c && c.room === sand.id) assert.ok(Math.abs(+k.split(',')[0] - sand.cx) > sand.rw * 0.6 || Math.abs(+k.split(',')[1] - sand.cy) > sand.rh * 0.6, `${p} out on the sand at ${k}`); }
});

test('a bout through the commands: from level 6, the day\'s picks only, never mid-fight; it pays marks only and gives the world back', () => {
  const low = company(5), ev0 = events(low);
  low.commands.push({ type: 'bowlBout', id: picksOf(low.state)[0]?.id || 'widow_brack' }); low.tick();
  assert.ok(!low.battle && ev0.refused.length === 1, 'level 5: refused');

  const s = company(7), ev = events(s), before = { site: s.world.site, scene: s.state.scene, x: s.state.player.x, y: s.state.player.y };
  const hp0 = s.state.party.map((m) => (m.hp = Math.round(statsFor(m).maxHp * 0.6))), gold0 = s.state.counters.gold, xp0 = s.state.party.map((m) => m.xp), bag0 = s.state.bag.length;
  s.commands.push({ type: 'bowlBout', id: 'nobody_at_all' }); s.tick();
  assert.ok(!s.battle && ev.refused.length === 1, 'not on today\'s board');
  const pick = picksOf(s.state)[1];
  let hpOut = null; s.bus.on('bowlResult', () => { hpOut = s.state.party.map((m) => m.hp); });
  s.commands.push({ type: 'bowlBout', id: pick.id }); s.tick();
  assert.ok(s.battle && s.battle.bout, 'on the sand');
  const cameIn = s.battle.bout.kept.map((k) => k.hp);
  assert.ok(cameIn.every((h, i) => h >= hp0[i] && h < statsFor(s.state.party[i]).maxHp * 0.7), 'as it came in (a breath of regen on the way)');
  assert.ok(s.state.party.every((m) => m.hp === statsFor(m).maxHp), 'full HP in');
  assert.equal(s.world.enemies.filter((e) => e.rival).length, 3);
  s.commands.push({ type: 'bowlBout', id: pick.id }); s.tick();
  assert.ok(ev.refused.at(-1).includes('fight'), 'never mid-fight');
  run(s);
  assert.equal(ev.result.length, 1); const r = ev.result[0];
  assert.ok(['won', 'lost', 'draw'].includes(r.how));
  assert.equal(r.marks, r.how === 'won' ? GRADES[pick.grade].marks : 1);
  assert.equal(s.state.bowl.marks, r.marks); assert.equal(s.state.bowl.paid, 1); assert.deepEqual(s.state.bowl.fought, [pick.id]);
  assert.deepEqual(hpOut, cameIn, 'leaves with the HP it came in with');
  assert.ok(s.state.party.every((m) => !m.down && !m.fallen), 'nobody Fallen in the Bowl');
  assert.equal(s.state.counters.gold, gold0); assert.deepEqual(s.state.party.map((m) => m.xp), xp0); assert.equal(s.state.bag.length, bag0, 'no gold, XP or loot');
  assert.ok(!picksOf(s.state).some((c) => c.id === pick.id), 'one try a pairing a day');
  s.commands.push({ type: 'bowlLeave' }); s.tick();
  assert.deepEqual({ site: s.world.site, scene: s.state.scene, x: s.state.player.x, y: s.state.player.y }, before, 'back exactly where it was');
});

// walked onto (not tapped), the Bowl's gate is the way back where you were, as the menu's Leave: it took you to the land
// the Bowl stands on before (a bug fix: core.js tick)
test('walking out through the gate after a bout gives the world back, never the land', () => {
  const s = company(), at = { site: s.world.site, scene: s.state.scene };
  s.commands.push({ type: 'bowlBout', id: picksOf(s.state)[0].id }); s.tick(); run(s);
  assert.ok(!s.battle && s.world.site === 'bowl');
  const ex = s.world.exitAt; s.state.player.x = ex.x; s.state.player.y = ex.y + 0.5; s.tick(); s.tick();
  assert.equal(s.world.site, at.site); assert.equal(s.state.scene, at.scene);
});

test('the hero alone: one against one, the companions watch; a save in the Bowl is the world you came from', () => {
  const s = company(8), ev = events(s);
  const pick = picksOf(s.state)[0];
  s.commands.push({ type: 'bowlBout', id: pick.id, alone: true }); s.tick();
  const B = s.battle.bout;
  assert.ok(B.alone && B.ours.length === 1 && B.ours[0] === s.state.party[0] && B.rivals.length === 1);
  for (let i = 0; i < 20 * 10; i++) s.tick();
  assert.ok(s.state.party.slice(1).every((m) => m.hp === statsFor(m).maxHp), 'the companions take no part');
  const snap = s.snapshot();
  assert.equal(snap.scene, 'town'); assert.notEqual(snap.site, 'bowl');
  run(s); assert.equal(ev.result.length, 1); assert.ok(ev.result[0].alone);
});

test('the day\'s tourney: once a day, eight companies, the company locked, the purse by the round reached', () => {
  const s = company(9), ev = events(s);
  s.commands.push({ type: 'tourneyEnter' }); s.tick();
  const T = s.state.bowl.tourney;
  assert.equal(T.slots.length, 8); assert.ok(T.slots.includes('you'));
  s.commands.push({ type: 'tourneyEnter' }); s.tick();
  assert.ok(ev.refused.length === 1, 'once a day');
  const hire = s.state.party.pop();                              // (a member left behind: the company isn't the one entered)
  s.commands.push({ type: 'tourneyBout' }); s.tick();
  assert.ok(!s.battle && ev.refused.at(-1).includes('locked'));
  s.state.party.push(hire);
  let rounds = 0;
  while (s.state.bowl.tourney && rounds < 4) { s.commands.push({ type: 'tourneyBout' }); s.tick(); assert.ok(s.battle && s.battle.bout); run(s); rounds++; }
  const last = ev.result.at(-1), purse = last.champion ? 16 : BOWL.purse[last.round];
  assert.equal(last.purse, purse); assert.equal(s.state.bowl.lastTourney.purse, purse);
  assert.equal(s.state.bowl.marks, ev.result.reduce((a, r) => a + r.marks, 0) + purse, 'tourney bouts pay only the purse');
  s.state.t += DAY_S;                                           // a new day: a new tourney
  s.commands.push({ type: 'tourneyEnter' }); s.tick();
  assert.ok(s.state.bowl.tourney && s.state.bowl.tourney.day === Math.floor(s.state.t / DAY_S));
});

test('the bout\'s rules: crowd control halved and healing at 0.75 on a company\'s member; blows at 0.5; ordinary fights untouched', () => {
  assert.equal(ccTime({ ccK: BOUT.cc }, 2), 1); assert.equal(ccTime({}, 2), 2);
  assert.equal(BOUT.heal, 0.75); assert.equal(BOUT.dmg, 0.5); assert.equal(BOUT.secs, 120);
});

test('the rating: Glicko, a win up and a loss down, more for an upset; companies drawn the same for everyone on a day', () => {
  const up = rate(1200, 250, 1200, 1), down = rate(1200, 250, 1200, 0), upset = rate(1200, 250, 1450, 1);
  assert.ok(up.r > 1200 && down.r < 1200 && upset.r - 1200 > up.r - 1200 && up.rd < 250);
  assert.ok(Math.abs(expected(1200, 1200, 80) - 0.5) < 1e-9);
  assert.deepEqual(companyOn('widow_brack', 3), companyOn('widow_brack', 3));
  assert.equal(bracketOf(6), 0); assert.equal(bracketOf(11), 0); assert.equal(bracketOf(12), 1); assert.equal(bracketOf(15), 2);
  const c = makeCompany('coalbrook_boys', 9, 'champion');
  assert.ok(c.every((m) => m.level === 9 && m.gear.weapon.r === GRADES.champion.rarity && m.gear.weapon.up === GRADES.champion.up && m.rival === undefined), 'a champion\'s kit at the hero\'s level');
});

test('the record saved (v45) and cleaned on load', () => {
  const s = company(7); const pick = picksOf(s.state)[0];
  s.commands.push({ type: 'bowlBout', id: pick.id }); s.tick(); run(s);
  const snap = JSON.parse(JSON.stringify(s.snapshot()));
  const t = createSim(SEED); t.restore(snap);
  assert.deepEqual(t.state.bowl, s.state.bowl);
  assert.deepEqual(restoreBowl({ r: 'x', fought: ['widow_brack', 'nobody'], marks: -4 }).fought, ['widow_brack']);
  assert.equal(restoreBowl({ marks: -4 }).marks, 0); assert.equal(restoreBowl(null).r, BOWL.start);
});

test('the board: five near your rating, easiest first; three new draws a day, then no more; a new day, a new five', () => {
  const s = company(8), ev = events(s), b = s.state.bowl;
  const five = picksOf(s.state);
  assert.equal(five.length, BOWL.picks);
  assert.deepEqual(five.map((c) => c.rating), [...five.map((c) => c.rating)].sort((x, y) => x - y));
  const seen = new Set(five.map((c) => c.id));
  for (let i = 0; i < BOWL.refreshes; i++) {
    s.commands.push({ type: 'bowlRefresh' }); s.tick();
    const now = picksOf(s.state); assert.equal(now.length, BOWL.picks);
    for (const c of now) { assert.ok(!seen.has(c.id), `${c.id}: new faces each time`); seen.add(c.id); }
  }
  s.commands.push({ type: 'bowlRefresh' }); s.tick();
  assert.equal(ev.refused.length, 1, 'three a day'); assert.equal(b.refresh, BOWL.refreshes);
  s.state.t += DAY_S; s.commands.push({ type: 'bowlOpen' }); s.tick();
  assert.equal(b.refresh, 0); assert.equal(picksOf(s.state).length, BOWL.picks);
});

test('ten bouts a day, every one paid; the eleventh refused', () => {
  const s = company(7), ev = events(s);
  for (let n = 0; n < BOWL.fights; n++) {
    if (!picksOf(s.state).length) { s.commands.push({ type: 'bowlRefresh' }); s.tick(); }
    s.commands.push({ type: 'bowlBout', id: picksOf(s.state)[0].id, alone: true }); s.tick();
    assert.ok(s.battle && s.battle.bout, `bout ${n + 1}`); run(s);
  }
  assert.equal(ev.result.length, BOWL.fights); assert.ok(ev.result.every((r) => r.marks >= 1), 'each paid');
  assert.equal(s.state.bowl.marks, ev.result.reduce((a, r) => a + r.marks, 0));
  if (!picksOf(s.state).length) { s.commands.push({ type: 'bowlRefresh' }); s.tick(); }
  s.commands.push({ type: 'bowlBout', id: picksOf(s.state)[0].id }); s.tick();
  assert.ok(!s.battle && ev.refused.at(-1).includes(String(BOWL.fights)), 'the eleventh');
});

test('the hundred: a league of their own, ten bouts a day each on the same rules, the same for everyone; the strong rise', () => {
  assert.equal(ROSTER_IDS.length, 100);
  const d0 = fieldOn(0), d1 = fieldOn(1);
  const games = (f) => f.reduce((a, c) => a + c.won + c.lost + c.drawn, 0);
  assert.equal(games(d1) - games(d0), 100 * BOWL.fights, 'every team, ten bouts a day');
  assert.deepEqual(fieldOn(5), fieldOn(5));
  const avg = (g) => { const r = d0.filter((c) => c.grade === g).map((c) => c.rating); return r.reduce((a, x) => a + x, 0) / r.length; };
  assert.ok(avg('champion') > avg('hardened') && avg('hardened') > avg('seasoned') && avg('seasoned') > avg('green'), 'ratings find the grades out');
  assert.deepEqual(d0.map((c) => c.rank), d0.map((_, i) => i + 1));
  assert.equal(teamOf('widow_brack').manner, 'wall');
});
