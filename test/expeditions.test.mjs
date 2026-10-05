// Expeditions (GDD §6.3 v1.33, sim/expeditions.js; the owner, 2026-10-04: "let me send my benched companions on timed
// adventures to level up and bring some gold and possibly one looted item back"): from an inn, a bench member goes out
// for 15 min, an hour or four; they're away until it's done, then back on their own with XP (a share of their next
// level), gold (by level and time) and maybe one item on the expedition's own stream; all of it checked and replayable.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { EXPEDITIONS, expeditionPay } from '../src/sim/expeditions.js';
import { xpToNext, xpRate } from '../src/sim/party.js';

const SEED = 20260807;
// Thornwick with a full party and one on the bench
function town() {
  const s = createSim(SEED, undefined, { scene: 'town' }); s.state.created = true; s.state.counters.gold = 1e6;
  for (const idx of [0, 1, 2]) { s.commands.push({ type: 'hire', idx }); s.tick(); }
  const ev = [], no = []; for (const k of ['expeditionSent', 'expeditionBack', 'levelUp', 'loot']) s.bus.on(k, (e) => ev.push([k, e])); s.bus.on('refused', (e) => no.push(e.reason));
  return { s, b: s.state.bench[0], ev, no };
}
const run = (s, cmd) => { s.commands.push(cmd); s.tick(); };
const until = (s, secs) => { for (let i = 0; i < secs * 20; i++) s.tick(); };

test('sent from an inn, a bench member is out until it\'s done, then back with XP, gold and maybe an item', () => {
  const { s, b, ev } = town(), lv = b.level, xp0 = b.xp, g0 = s.state.counters.gold;
  run(s, { type: 'expeditionSend', id: b.id, kind: 'day' });
  assert.ok(b.exp && b.exp.kind === 'day' && Math.abs(b.exp.until - b.exp.from - 3600) < 1e-6);
  until(s, 3590); assert.ok(b.exp, 'still out');
  let g1 = s.state.counters.gold; for (let i = 0; i < 20 * 15 && b.exp; i++) { g1 = s.state.counters.gold; s.tick(); }   // (the gold just before the tick they're back: a dawn's wages fell in the hour)
  assert.equal(b.exp, null, 'back');
  const back = ev.find(([k]) => k === 'expeditionBack')[1], pay = expeditionPay('day', lv);
  assert.equal(back.xp, pay.xp); assert.equal(back.gold, pay.gold);
  assert.equal(s.state.counters.gold - g1, pay.gold, 'the gold is the company\'s');
  assert.ok(b.level > lv || b.xp === xp0 + pay.xp, 'the XP is theirs');
  assert.ok(s.state.counters.gold > g0 - 1e5);
});

// (GDD v1.38) XP by the minute out, a share of active play's (xpRate), less the longer the job: never more than playing
test('XP is a share of active play\'s a minute (less the longer the job); gold by level and time', () => {
  assert.equal(expeditionPay('long', 6).xp, Math.round(xpRate(6) * 240 * 0.2));
  assert.ok(expeditionPay('short', 6).xp < expeditionPay('day', 6).xp && expeditionPay('day', 6).xp < expeditionPay('long', 6).xp);
  for (const L of [3, 9, 17, 25]) for (const k of ['short', 'day', 'long']) assert.ok(expeditionPay(k, L).xp <= xpRate(L) * EXPEDITIONS[k].secs / 60 * 0.3 + 1, `${k} at ${L} pays under active play's`);
  assert.ok(expeditionPay('long', 6).xp > xpToNext(6) * 0.9, 'a long one is still about a level at 6');
  assert.equal(expeditionPay('day', 10).gold, 2 * expeditionPay('day', 5).gold);
  assert.deepEqual(Object.keys(EXPEDITIONS), ['short', 'day', 'long']);
});

test('checked: only from a town inn, only the bench, a known kind, one at a time, not the slain', () => {
  const { s, b, no } = town(), p1 = s.state.party[1];
  run(s, { type: 'expeditionSend', id: p1.id, kind: 'short' }); assert.equal(p1.exp, undefined, 'the party isn\'t the bench');
  run(s, { type: 'expeditionSend', id: b.id, kind: 'forever' }); assert.ok(!b.exp);
  b.fallen = true; run(s, { type: 'expeditionSend', id: b.id, kind: 'short' }); assert.ok(!b.exp); b.fallen = false;
  run(s, { type: 'expeditionSend', id: b.id, kind: 'short' }); const was = b.exp.until;
  run(s, { type: 'expeditionSend', id: b.id, kind: 'long' }); assert.equal(b.exp.until, was, 'already out');
  assert.ok(no.some((r) => /slain/.test(r)) && no.some((r) => /already out/.test(r)));
  const d = createSim(SEED, undefined, { scene: 'dungeon' }); d.state.bench = [{ ...JSON.parse(JSON.stringify(b)), exp: null }];
  run(d, { type: 'expeditionSend', id: b.id, kind: 'short' }); assert.equal(d.state.bench[0].exp, null, 'not out of town');
});

test('while out they can\'t be swapped in, released or retrained', () => {
  const { s, b, no } = town();
  run(s, { type: 'expeditionSend', id: b.id, kind: 'short' });
  run(s, { type: 'swap', slot: 1, id: b.id }); assert.ok(s.state.bench.includes(b), 'still on the bench');
  run(s, { type: 'release', id: b.id }); assert.ok(s.state.bench.includes(b));
  run(s, { type: 'retrain', id: b.id, idx: 0 });
  assert.ok(no.filter((r) => /out on the road/.test(r)).length >= 2, no.join(' | '));
});

test('the item comes off the expedition\'s own stream: the room drops\' counter doesn\'t move; the same expedition finds the same', () => {
  const found = () => {
    const { s, b, ev } = town(); const n0 = s.state.counters.lootN || 0;
    run(s, { type: 'expeditionSend', id: b.id, kind: 'long' }); until(s, 4 * 3600 + 2);
    const back = ev.find(([k]) => k === 'expeditionBack')[1];
    return { lootN: (s.state.counters.lootN || 0) - n0, item: back.item && { base: back.item.base, r: back.item.r, ilv: back.item.ilv }, levels: back.levels };
  };
  const a = found(), b = found();
  assert.equal(a.lootN, 0); assert.deepEqual(a, b);
  assert.ok(a.levels >= 1, 'a long one is a level or so');
});

test('saved while out, it comes back at the same time with the same pay', () => {
  const { s, b } = town();
  run(s, { type: 'expeditionSend', id: b.id, kind: 'short' }); until(s, 300);
  const snap = JSON.parse(JSON.stringify(s.snapshot())); assert.ok(snap.bench[0].exp);
  const r = createSim(SEED); r.restore(snap); const got = []; r.bus.on('expeditionBack', (e) => got.push(e));
  const left = snap.bench[0].exp.until - r.state.t; until(r, left - 2); assert.equal(got.length, 0);
  until(r, 4); assert.equal(got.length, 1); assert.equal(got[0].gold, expeditionPay('short', snap.bench[0].level).gold);
});
