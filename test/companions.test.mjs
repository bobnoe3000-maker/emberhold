// The Lantern Guild's sellswords (GDD §6.2 v1.9, world doc §4 v1.11, sim/companions.js): ranks and
// perks rolled from the seed, a fee to hire, wages at dawn (owed: perks dark), loyalty that shows a
// hidden perk and makes a sellsword Sworn, Ask around and Retrain, the gold perks, and v13 saves.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createSim } from '../src/sim/core.js';
import { statsFor, tavernRoster } from '../src/sim/party.js';
import { DAY_S } from '../src/sim/heroes.js';
import { RANKS, RANK_IDS, PERKS, PERK_IDS, LOYALTY, rollPerks, wageOf, loyaltyOf, has, FOUND_PERKS } from '../src/sim/companions.js';
import { mulberry32 } from '../src/sim/rng.js';
import { isWalkable } from '../src/sim/world.js';

const SEED = 20260807;
const town = (gold = 100000, lv = 6) => { const s = createSim(SEED, undefined, { scene: 'town' }); s.state.counters.gold = gold; s.state.party[0].level = lv; s.tick(); return s; };
const run = (sim, ...cmds) => { for (const c of cmds) { sim.commands.push(c); sim.tick(); } };
const told = (sim, names) => { const ev = []; for (const n of names) sim.bus.on(n, (e) => ev.push([n, e])); return ev; };
const refusals = (sim) => { const r = []; sim.bus.on('refused', (e) => r.push(e.reason)); return r; };
// to the next dawn, in town (the wage is paid wherever the company is; town is where we can look)
const dawn = (sim) => { sim.state.t = (Math.floor(sim.state.t / DAY_S) + 1) * DAY_S; sim.tick(); };

test('a roster a day: every sellsword has a rank and perks to its rank\'s budget, the same for the same day', () => {
  const tally = Object.fromEntries(RANK_IDS.map((r) => [r, 0]));
  let n = 0;
  for (let d = 0; d < 400; d++) for (const m of tavernRoster(SEED, 'vale', d, 6)) {
    n++; tally[m.rank]++;
    const R = RANKS[m.rank], shown = m.perks.filter((p) => PERKS[p].fam !== 'quirk'), quirks = m.perks.length - shown.length;
    assert.equal(shown.length, R.perks, `${m.id}: ${m.perks}`);
    assert.ok(m.perks.reduce((c, p) => c + Math.max(0, PERKS[p].cost), 0) <= R.budget + quirks, `${m.id} over budget: ${m.perks}`);
    assert.equal(!!m.hidden, R.hidden, m.id);
    if (R.aura) assert.ok(m.perks.some((p) => PERKS[p].fam === 'aura'), `${m.id}: a Beacon has its aura`);
    for (const p of m.perks) assert.ok(!PERKS[p].cls || PERKS[p].cls.includes(m.cls), `${m.cls} can't ${p}`);
  }
  for (const r of RANK_IDS) assert.ok(Math.abs((100 * tally[r]) / n - RANKS[r].odds) < 3, `${r}: ${(100 * tally[r] / n).toFixed(1)} % of ${n}`);
  assert.deepEqual(tavernRoster(SEED, 'vale', 7, 6), tavernRoster(SEED, 'vale', 7, 6));
  assert.notDeepEqual(tavernRoster(SEED, 'vale', 7, 6).map((m) => m.id), tavernRoster(SEED, 'vale', 8, 6).map((m) => m.id));
});

test('hiring pays the Guild its fee; without it, nothing happens', () => {
  const sim = town(0), no = refusals(sim), c = sim.heroes.roster()[0];
  run(sim, { type: 'hire', idx: 0 });
  assert.equal(sim.state.party.length, 1); assert.match(no[0], /The Guild wants \d+ gold/);
  sim.state.counters.gold = RANKS[c.rank].fee * c.level;
  run(sim, { type: 'hire', idx: 0 });
  assert.equal(sim.state.party.length, 2); assert.equal(sim.state.counters.gold, 0);
  assert.equal(sim.state.party[1].rank, c.rank); assert.deepEqual(sim.state.party[1].perks, c.perks);
});

test('perks are real: Stubborn is +10 % DEF, and dark while the sellsword is owed', () => {
  const sim = town(), m = sim.heroes.roster()[0]; run(sim, { type: 'hire', idx: 0 });
  const c = sim.state.party[1]; c.perks = []; const base = statsFor(c).def;
  c.perks = ['stubborn']; assert.ok(Math.abs(statsFor(c).def - base * 1.1) < 0.11, `${statsFor(c).def} vs ${base}`);
  c.owed = 10; assert.equal(statsFor(c).def, base); assert.equal(has(c, 'stubborn'), false);
  assert.ok(m);
});

test('wages at dawn: the party in full, the bench at half; unpaid, it\'s owed and its perks go dark until settled', () => {
  const sim = town(), ev = told(sim, ['wages']);
  run(sim, { type: 'hire', idx: 0 }, { type: 'hire', idx: 1 }, { type: 'hire', idx: 2 });   // two in the party, one on the bench
  const [a, b] = [sim.state.party[1], sim.state.party[2]], c = sim.state.bench[0];
  const due = wageOf(a, false) + wageOf(b, false) + wageOf(c, true);
  assert.equal(wageOf(c, true), Math.round(RANKS[c.rank].wage * c.level * 0.5 * (c.perks.includes('thrifty') ? 0.7 : 1) * (c.perks.includes('greedy') ? 1.5 : 1)));
  const g0 = sim.state.counters.gold; dawn(sim);
  assert.equal(sim.state.counters.gold, g0 - due); assert.equal(ev[0][1].paid, due); assert.deepEqual(ev[0][1].unpaid, []);
  assert.equal(a.bond, 1); assert.equal(c.bond, 0, 'the bench draws a wage, not loyalty');
  // broke: everyone is owed a day; perks dark; loyalty falls
  sim.state.counters.gold = 0; a.perks = ['stubborn']; dawn(sim);
  assert.ok(a.owed > 0 && b.owed > 0 && c.owed > 0); assert.equal(has(a, 'stubborn'), false); assert.equal(a.bond, 0);
  assert.equal(ev[1][1].unpaid.length, 3);
  // settled at the tavern
  sim.state.counters.gold = 100000; run(sim, { type: 'payWages' });
  assert.equal(a.owed + b.owed + c.owed, 0); assert.equal(has(a, 'stubborn'), true);
});

test('loyalty: paid dawns in the party show a Lantern\'s hidden perk at 3, and make it Sworn at 5 (a quarter off its wage)', () => {
  const sim = town(1e7), ev = told(sim, ['perkRevealed', 'sworn']);
  let d = 0; while (!tavernRoster(SEED, 'vale', d, 6).some((m) => m.rank === 'lantern' || m.rank === 'beacon')) d++;
  sim.state.t = d * DAY_S + 1; sim.tick();
  const idx = sim.heroes.roster().findIndex((m) => m.rank === 'lantern' || m.rank === 'beacon');
  run(sim, { type: 'hire', idx }); const c = sim.state.party[1], hidden = c.hidden, w0 = wageOf(c, false);
  assert.ok(hidden && !c.perks.includes(hidden));
  for (let i = 0; i < LOYALTY[3]; i++) dawn(sim);
  assert.equal(loyaltyOf(c), 3); assert.ok(c.perks.includes(hidden) && !c.hidden); assert.deepEqual(ev[0], ['perkRevealed', { id: c.id, name: c.name, perk: hidden }]);
  for (let i = LOYALTY[3]; i < LOYALTY[5]; i++) dawn(sim);
  assert.equal(loyaltyOf(c), 5); assert.equal(ev[1][0], 'sworn'); assert.equal(wageOf(c, false), Math.round(w0 * 0.75 / 1) || 0);
});

test('Ask around: new faces for 10 g × level, doubling each time that day; a new day starts again', () => {
  const sim = town(1000, 6), r0 = sim.heroes.roster().map((m) => m.id);
  run(sim, { type: 'askAround' }); assert.equal(sim.state.counters.gold, 940);
  assert.notDeepEqual(sim.heroes.roster().map((m) => m.id), r0);
  run(sim, { type: 'askAround' }); assert.equal(sim.state.counters.gold, 820);
  assert.equal(sim.heroes.askCost(), 240);
  dawn(sim); assert.equal(sim.heroes.askCost(), 60);
});

test('Retrain: a perk for another of its family, dearer each time; never a quirk, never in the field', () => {
  const sim = town(1e7), no = refusals(sim); run(sim, { type: 'hire', idx: 0 });
  const c = sim.state.party[1]; c.perks = ['stubborn', 'greedy']; c.hidden = null;
  const g0 = sim.state.counters.gold; run(sim, { type: 'retrain', id: c.id, idx: 0 });
  assert.notEqual(c.perks[0], 'stubborn'); assert.equal(PERKS[c.perks[0]].fam, 'stat'); assert.equal(g0 - sim.state.counters.gold, 60 * c.level);
  const g1 = sim.state.counters.gold; run(sim, { type: 'retrain', id: c.id, idx: 0 }); assert.equal(g1 - sim.state.counters.gold, 120 * c.level);
  run(sim, { type: 'retrain', id: c.id, idx: 1 }); assert.equal(c.perks[1], 'greedy'); assert.match(no.at(-1), /won't be trained out of that/);
});

test('a Haggler takes 15 % off the inn; Greedy wants half again', () => {
  const sim = town(); run(sim, { type: 'hire', idx: 0 });
  const c = sim.state.party[1]; c.perks = []; const inn = sim.heroes.restCost(), w = wageOf(c, false);
  c.perks = ['haggler']; assert.equal(sim.heroes.restCost(), Math.round(inn * 0.85));
  c.perks = ['greedy']; assert.equal(wageOf(c, false), Math.round(w * 1.5));
});

test('a v13 save: tavern hires become Wicks whose old trait is a real perk, wages from the next dawn; Brannoc his own', () => {
  const sim = town(); run(sim, { type: 'hire', idx: 0 });
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  const old = snap.party[1]; for (const k of ['rank', 'perks', 'hidden', 'bond', 'owed', 'retrains']) delete old[k]; old.trait = ['Stubborn', '+10% DEF'];
  snap.bench = [{ ...old, id: 'brannoc', name: 'Brannoc', trait: ['Redhand deserter', 'found in Wickham Keep'] }];
  for (const k of ['tavern', 'wageDay', 'innDay']) delete snap[k];
  snap.t = 3 * DAY_S + 100;
  const b = createSim(SEED, undefined, { scene: 'town' }); b.restore(snap);
  const c = b.state.party[1];
  assert.equal(c.rank, 'wick'); assert.deepEqual(c.perks, ['stubborn']); assert.equal(c.trait, undefined); assert.equal(c.owed, 0);
  assert.equal(b.state.bench[0].rank, 'found'); assert.deepEqual(b.state.bench[0].perks, FOUND_PERKS.brannoc);
  const g = b.state.counters.gold; b.tick(); assert.equal(b.state.counters.gold, g, 'no back pay');
  // and v14 round-trips
  c.bond = 4; c.owed = 7; c.retrains = 1; c.hidden = 'finisher';
  const r = createSim(SEED, undefined, { scene: 'town' }); r.restore(JSON.parse(JSON.stringify(b.snapshot())));
  const q = r.state.party[1]; assert.deepEqual([q.rank, q.perks, q.hidden, q.bond, q.owed, q.retrains], ['wick', ['stubborn'], 'finisher', 4, 7, 1]);
});

test('content/companions.json names every rank and perk the sim has', () => {
  const C = JSON.parse(readFileSync('content/companions.json', 'utf8'));
  assert.deepEqual(Object.keys(C.perks).sort(), [...PERK_IDS].sort());
  for (const r of [...RANK_IDS, 'found']) assert.ok(C.ranks[r], r);
  for (const id of PERK_IDS) assert.ok(C.families[PERKS[id].fam], PERKS[id].fam);
});

test('rolls never repeat a perk and stay in the class', () => {
  const rng = mulberry32(42);
  for (let i = 0; i < 2000; i++) for (const cls of ['fighter', 'rogue', 'mage', 'cleric']) for (const rank of RANK_IDS) {
    const { perks, hidden } = rollPerks(rng, cls, rank);
    assert.equal(new Set(perks).size, perks.length); assert.ok(!hidden || !perks.includes(hidden));
  }
});

// a fighter hero and two hires (perks as given) in a level-room of the Old Barrows
function fight(perks, roomLv = 3, lv = 3) {
  const t = town(1e7, lv); run(t, { type: 'hire', idx: 1 }, { type: 'hire', idx: 2 });   // a rogue and a mage
  const sim = createSim(SEED, undefined, { scene: 'dungeon' }); sim.state.party[0].level = lv;
  sim.state.party.push(...t.state.party.slice(1).map((m, i) => ({ ...JSON.parse(JSON.stringify(m)), perks: perks[i] || [], hidden: null })));
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, roomLv);
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  return sim;
}

test('in a fight: a Field Medic patches up the most hurt every 12 s; a Sworn sellsword gets up once a visit', () => {
  const a = fight([[], ['field_medic']]), heals = []; a.bus.on('combat', (c) => { if (c.t === 'heal') heals.push(a.state.t); });
  for (let i = 0; i < 20 * 60; i++) a.tick();
  assert.ok(heals.length >= 4, `${heals.length} heals in a minute`);
  const b = fight([[], []]), none = []; b.bus.on('combat', (c) => { if (c.t === 'heal') none.push(1); });
  for (let i = 0; i < 20 * 60; i++) b.tick();
  assert.equal(none.length, 0, 'no medic, no patching (a fighter, a rogue and a mage)');
  // Sworn: the blow that would Down it once doesn't
  const s = fight([[], []], 6), rose = []; const c = s.state.party[1]; c.bond = LOYALTY[5]; s.bus.on('combat', (e) => { if (e.t === 'rise') rose.push(e.name); });
  for (let i = 0; i < 20 * 120 && !rose.length; i++) { c.hp = Math.min(c.hp, 2); s.tick(); }
  assert.deepEqual(rose, [c.name]); assert.ok(c.hp > 2 && !c.down);
});

test('a Bodyguard beside the hero takes a share of the blows aimed at the hero', () => {
  const taken = (perks) => {
    const sim = fight(perks, 4); const h = sim.state.party[0], g = sim.state.party[1]; let lost = 0;
    for (let i = 0; i < 20 * 45; i++) { const hp = g.hp; g.x = sim.state.player.x + 0.8; g.y = sim.state.player.y; sim.tick(); if (g.hp < hp) lost += hp - g.hp; g.hp = statsFor(g).maxHp; h.hp = Math.max(h.hp, 50); }
    return lost;
  };
  // the rogue as a Bodyguard (the perk's rule, whoever carries it): it bleeds for the hero's blows too
  assert.ok(taken([['bodyguard'], []]) > taken([[], []]) * 1.1);
});

// the balance gate for perks (GDD §6.2): the best Beacon company we measured still loses a room
// three levels up at level 9 (the contract's runs, §7.1, are perk-less, as before)
test('gate: a Beacon company (two auras, the best fighting perks) still falls in a level-9 room three up', () => {
  for (const seed of ['20260807', '777']) {
    const out = execFileSync('node', ['tools/balance/roomlv.mjs', '300', '12', '9', '1,3', seed, '--perks', 'drillmaster,finisher,grave_warden,skirmisher/banner_man,steady_hands,field_medic,hardy'], { encoding: 'utf8' });
    assert.match(out, /DEFEAT/, out);
  }
});
