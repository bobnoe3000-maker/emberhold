// The forge and the shop (GDD §8 v1.13, sim/smith.js): upgrades +1…+5 on base stats for gold, cinders and
// (from +3) wood and stone; a reforge rerolls one affix into a different kind, the same for everyone;
// salvage gives back half an upgrade's cinders; the shop's day stock, selling and buying back; cinders from
// elites and bosses; every command checked (the town, the purse, the bag) and kept in the save.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { makeItem, itemStats, UP_MAX } from '../src/sim/items.js';
import { upgradeCost, reforgeCost, salvageOf, sellPrice, buyPrice, shopStock, UP_GOLD, UP_CINDERS, UP_MATS, BUYBACK_N } from '../src/sim/smith.js';
import { ELITE_CINDERS, BOSS_CINDERS } from '../src/sim/battle.js';

const SEED = 20260807;
const town = (gold = 1e6) => { const s = createSim(SEED, undefined, { scene: 'town' }); Object.assign(s.state.counters, { gold, embers: 500, wood: 500, stone: 500 }); s.tick(); return s; };
const run = (s, cmd) => { s.commands.push(cmd); s.tick(); };
const refusals = (s) => { const r = []; s.bus.on('refused', (e) => r.push(e.reason)); return r; };

test('an upgrade: +8 % a step on the base stats (not the traits), its price by step, wood and stone from +3, to +5', () => {
  const it = makeItem('sword', 6, 'fine', { uid: 'x', aff: [['crit', 2]] }), base = itemStats(it);
  const at5 = itemStats({ ...it, up: 5 });
  assert.ok(at5.atk > base.atk && at5.atk <= Math.round(it.st.atk * 1.4) + 1, `${base.atk} → ${at5.atk}`);
  assert.equal(at5.crit - itemStats({ ...it, up: 0 }).crit, Math.round(it.st.crit * 1.4) - it.st.crit, 'the affix crit is not scaled');
  assert.deepEqual([0, 1, 2, 3, 4].map((up) => upgradeCost({ ...it, up })), [0, 1, 2, 3, 4].map((n) => ({ gold: UP_GOLD[n] * 6, cinders: UP_CINDERS[n], wood: UP_MATS[n], stone: UP_MATS[n] })));
  assert.equal(upgradeCost({ ...it, up: UP_MAX }), null);
  const s = town(), w = s.state.party[0].gear.weapon, C = s.state.counters, g0 = C.gold, c0 = C.embers;
  for (let i = 0; i < 6; i++) run(s, { type: 'upgrade', uid: w.uid });
  assert.equal(w.up, 5); assert.equal(g0 - C.gold, UP_GOLD.reduce((a, b) => a + b, 0) * w.ilv); assert.equal(c0 - C.embers, 23);
  assert.equal(C.wood, 500 - 36); assert.equal(C.stone, 500 - 36);
});

test('upgrades and reforges only in town, and only when you can pay; nothing changes otherwise', () => {
  const s = town(0), no = refusals(s), w = s.state.party[0].gear.weapon;
  run(s, { type: 'upgrade', uid: w.uid }); assert.ok(!w.up); assert.match(no.at(-1), /Not enough gold/);
  const d = createSim(SEED, undefined, { scene: 'dungeon' }); d.state.counters.gold = 1e6; d.state.counters.embers = 99; const dw = d.state.party[0].gear.weapon, dn = refusals(d);
  d.commands.push({ type: 'upgrade', uid: dw.uid }); d.tick(); assert.ok(!dw.up); assert.match(dn.at(-1), /forge in town/);
  run(s, { type: 'upgrade', uid: 'nobody' }); run(s, { type: 'reforge', uid: w.uid, aff: 0 });   // (a kit Common has no traits)
  assert.equal(s.state.counters.gold, 0);
});

test('a reforge rerolls the chosen trait into a different kind, the same for everyone; each costs double the last', () => {
  const mk = () => { const s = town(); s.state.bag.push(makeItem('ring', 5, 'rare', { uid: 'r1', aff: [['atk', 2], ['def', 2]] })); return s; };
  const a = mk(), b = mk(), C = a.state.counters, g0 = C.gold;
  run(a, { type: 'reforge', uid: 'r1', aff: 0 }); run(b, { type: 'reforge', uid: 'r1', aff: 0 });
  const ra = a.state.bag.at(-1), rb = b.state.bag.at(-1);
  assert.deepEqual(ra.aff, rb.aff, 'deterministic'); assert.ok(!['atk', 'def'].includes(ra.aff[0][0]), JSON.stringify(ra.aff)); assert.equal(ra.aff[1][0], 'def');
  assert.equal(g0 - C.gold, reforgeCost({ ilv: 5, rf: 0 }).gold); assert.equal(reforgeCost(ra).gold, 2 * reforgeCost({ ilv: 5, rf: 0 }).gold);
  run(a, { type: 'reforge', uid: 'r1', aff: 9 }); assert.equal(ra.rf, 1, 'no such trait: nothing');
});

test("salvage gives half an upgrade's cinders back; every plain Common goes, upgraded ones stay", () => {
  const s = town(), C = s.state.counters;
  const up = { ...makeItem('dagger', 4, 'common', { uid: 'u1' }), up: 3 };   // 1 + 2 + 4 cinders went in
  s.state.bag.push(up, makeItem('dagger', 4, 'common', { uid: 'c1' }), makeItem('hood', 4, 'common', { uid: 'c2' }), makeItem('ring', 4, 'fine', { uid: 'f1', aff: [['hp', 5]] }));
  const e0 = C.embers; run(s, { type: 'salvageCommons' });
  assert.deepEqual(s.state.bag.map((it) => it.uid), ['u1', 'f1']); assert.equal(C.embers - e0, 2);
  assert.equal(salvageOf(up), 1 + 3); run(s, { type: 'salvage', uid: 'u1' }); assert.equal(C.embers - e0, 2 + 4);
});

test("the shop: a day's stock at the hero's level, bought once each; sell for gold (not heirlooms), buy back what you sold", () => {
  const s = town(), C = s.state.counters, st = s.smith.stock();
  assert.equal(st.length, 4); assert.ok(st.every((it) => it.r === 'common' && it.ilv === s.state.party[0].level));
  assert.deepEqual(shopStock(SEED, 0, 1, ['fighter']).map((it) => it.base), shopStock(SEED, 0, 1, ['fighter']).map((it) => it.base), 'the same for the same day');
  const g0 = C.gold; run(s, { type: 'buy', idx: 1 }); run(s, { type: 'buy', idx: 1 });
  assert.equal(g0 - C.gold, buyPrice(st[1])); assert.equal(s.state.bag.filter((it) => it.base === st[1].base).length, 1); assert.deepEqual(s.state.shop.bought, [1]);
  const bought = s.state.bag.at(-1), g1 = C.gold; run(s, { type: 'sell', uid: bought.uid });
  assert.equal(C.gold - g1, sellPrice(bought)); assert.equal(s.state.buyback[0].uid, bought.uid);
  run(s, { type: 'buyBack', uid: bought.uid }); assert.equal(C.gold, g1); assert.ok(s.state.bag.some((it) => it.uid === bought.uid));
  s.state.bag.push({ ...makeItem('amulet', 3, 'heirloom', { uid: 'h1', name: 'The Relief' }) }); const no = refusals(s); run(s, { type: 'sell', uid: 'h1' });
  assert.ok(s.state.bag.some((it) => it.uid === 'h1')); assert.match(no.at(-1), /heirloom/);
  for (let i = 0; i < 8; i++) { s.state.bag.push(makeItem('hood', 2, 'common', { uid: 'z' + i })); run(s, { type: 'sell', uid: 'z' + i }); }
  assert.equal(s.state.buyback.length, BUYBACK_N);
});

test("the forge and the shop keep: upgrades, the day's stock and the buyback round-trip through a save", () => {
  const s = town(); const w = s.state.party[0].gear.weapon; run(s, { type: 'upgrade', uid: w.uid }); run(s, { type: 'buy', idx: 0 });
  const sold = s.state.bag.at(-1); run(s, { type: 'sell', uid: sold.uid });
  const data = JSON.parse(JSON.stringify(s.snapshot())), r = createSim(SEED, undefined, { scene: 'town' }); r.restore(data);
  assert.equal(r.state.party[0].gear.weapon.up, 1); assert.deepEqual(r.state.shop, s.state.shop); assert.deepEqual(r.state.buyback.map((it) => it.uid), [sold.uid]);
  const old = { ...data }; delete old.shop; delete old.shops; delete old.buyback; r.restore(old); assert.equal(r.state.shop.day, -1); assert.deepEqual(r.state.buyback, []);
});

test('elites give a cinder and bosses five, when they fall', () => {
  assert.equal(ELITE_CINDERS, 1); assert.equal(BOSS_CINDERS, 5);
  const s = createSim(SEED, undefined, { scene: 'dungeon' }), C = s.state.counters, got = [];
  s.bus.on('combat', (c) => { if (c.t === 'cinders') got.push(c.amount); });
  for (const m of s.state.party) m.level = 12;
  const L = s.world.level, r = L.rooms.find((q) => q !== L.entrance), pl = s.state.player; pl.x = pl.px = r.cx + 0.5; pl.y = pl.py = r.cy + 0.5;
  for (let i = 0; i < 20 * 240 && !got.length; i++) { for (const m of s.state.party) m.hp = Math.max(m.hp, 300); s.tick(); }
  assert.deepEqual(got.slice(0, 1), [1], 'an elite (every fifth wave)'); assert.ok(C.embers >= 1);
});

test('a Deepdelver-fostered hero pays 10 % less gold for an upgrade (origin edge), the cinders the same', () => {
  const it = makeItem('sword', 6, 'common', { uid: 'x' });
  assert.deepEqual(upgradeCost(it, 'deepdelver_fostered'), { ...upgradeCost(it), gold: Math.round(UP_GOLD[0] * 6 * 0.9) });
  assert.deepEqual(upgradeCost(it, 'thornwick_born'), upgradeCost(it));
  const s = town(); s.state.party[0].origin = 'deepdelver_fostered'; const w = s.state.party[0].gear.weapon, g0 = s.state.counters.gold;
  run(s, { type: 'upgrade', uid: w.uid }); assert.equal(g0 - s.state.counters.gold, Math.round(UP_GOLD[0] * w.ilv * 0.9));
});
