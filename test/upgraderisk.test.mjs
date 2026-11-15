// The upgrade's risk (GDD §8 v1.114, sim/smith.js upgradeOdds; the owner: "gear upgrades: add chance of failure, and possible
// destruction. Lets also require at least 1 piece of gear along with embers. Higher rarity gear lowers the failure/destruction
// change. Same gear slot even further", and on the prototype: heirlooms never break, a failure drops a level, a lower-level
// piece helps less, upgrades already made are kept, +9 the top): every attempt takes its gold, cinders and a piece of gear from
// the bag; it takes, fails or breaks the piece on the odds; the roll is the same for everyone who does the same.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { makeItem } from '../src/sim/items.js';
import { upgradeOdds, UP_RISK, OFFER_K, SAME_SLOT_K, DROP_FROM } from '../src/sim/smith.js';
import { UP_MAX } from '../src/sim/items.js';

const SEED = 20260807;
const town = () => { const s = createSim(SEED, undefined, { scene: 'town' }); Object.assign(s.state.counters, { gold: 1e12, embers: 1e9 }); s.tick(); return s; };
const run = (s, cmd) => { s.commands.push(cmd); s.tick(); };
let n = 0;
const piece = (r = 'common', base = 'ring', ilv = 10, more = {}) => Object.assign(makeItem(base, ilv, r, { uid: 'p' + ++n, aff: r === 'common' ? undefined : [['hp', 3]] }), more);

test('the odds: the base with a Common from another slot; rarer safer, the same slot safer still, a lower piece helping less', () => {
  const it = { ...piece('fine', 'sword'), up: 4 };
  const base = upgradeOdds(it, piece('common', 'ring')), [f, d] = UP_RISK[4];
  assert.ok(Math.abs(base.fail - f) < 1e-12 && Math.abs(base.broke - d) < 1e-12 && Math.abs(base.ok + base.fail + base.broke - 1) < 1e-12);
  const rare = upgradeOdds(it, piece('rare', 'ring')), same = upgradeOdds(it, piece('rare', 'sword'));
  assert.ok(Math.abs(rare.broke - d * OFFER_K.rare) < 1e-12, 'rarity scales the risk');
  assert.ok(Math.abs(same.broke - d * OFFER_K.rare * SAME_SLOT_K) < 1e-12, 'the same slot further');
  assert.ok(base.ok < rare.ok && rare.ok < same.ok);
  const low = upgradeOdds(it, piece('rare', 'sword', 5)), lower = upgradeOdds({ ...it, ilv: 11 }, piece('rare', 'sword', 1));
  assert.ok(same.ok > low.ok && low.ok > base.ok, 'five levels under: half the help');
  assert.ok(Math.abs(lower.ok - base.ok) < 1e-12, 'ten or more under: none, the base');
  assert.equal(upgradeOdds({ ...it, up: 9 }, piece()), null, 'nothing past +9');
  const H = upgradeOdds({ ...piece('heirloom', 'sword'), up: 8 }, piece()); assert.equal(H.broke, 0, 'an heirloom never breaks'); assert.ok(H.fail > 0);
  assert.equal(upgradeOdds({ ...it, up: DROP_FROM - 2 }, piece()).drop, false); assert.equal(upgradeOdds({ ...it, up: DROP_FROM - 1 }, piece()).drop, true);
});

test('an attempt: needs a piece from the bag (not the one upgraded, not a worn one); refused without, nothing spent', () => {
  const s = town(), no = []; s.bus.on('refused', (e) => no.push(e.reason));
  const w = s.state.party[0].gear.weapon, C = s.state.counters, g0 = C.gold;
  run(s, { type: 'upgrade', uid: w.uid }); assert.match(no.at(-1), /piece of gear/);
  run(s, { type: 'upgrade', uid: w.uid, offer: s.state.party[0].gear.armor.uid }); assert.match(no.at(-1), /piece of gear/, 'a worn piece: not from the bag');
  const b = piece(); s.state.bag.push(b); run(s, { type: 'upgrade', uid: b.uid, offer: b.uid }); assert.match(no.at(-1), /piece of gear/, 'not itself');
  assert.equal(C.gold, g0); assert.ok(!w.up);
});

test('the rolls: as often as the odds say, the same for the same item and try; a failure from +3 up drops a step; a break takes it', () => {
  const tally = { ok: 0, fail: 0, broke: 0 }, N = 1500;
  let o = null;
  for (let i = 0; i < N; i++) {
    const s = town(), it = piece('fine', 'sword', 10, { up: 4 }), off = piece('common', 'ring'); s.state.bag.push(it, off);
    const ev = []; s.bus.on('forged', (e) => ev.push(e)); o = upgradeOdds(it, off);
    run(s, { type: 'upgrade', uid: it.uid, offer: off.uid });
    const e = ev[0]; tally[e.result]++;
    if (e.result === 'ok') assert.equal(it.up, 5);
    if (e.result === 'fail') { assert.equal(it.up, 3, 'dropped a step'); assert.ok(s.state.bag.includes(it)); }
    if (e.result === 'broke') assert.ok(!s.state.bag.includes(it), 'gone');
    assert.ok(!s.state.bag.includes(off), 'the piece given up spent whatever came of it');
  }
  for (const k of ['ok', 'fail', 'broke']) assert.ok(Math.abs(tally[k] / N - o[k]) < 0.04, `${k}: ${tally[k]} of ${N}, the odds ${o[k].toFixed(3)}`);
  // the same item, tried the same way, comes out the same
  const once = () => { const s = town(), it = piece('fine', 'sword', 10, { uid: 'same', up: 6 }); s.state.bag.push(it, piece('common', 'ring', 10, { uid: 'o' })); const ev = []; s.bus.on('forged', (e) => ev.push(e.result)); run(s, { type: 'upgrade', uid: 'same', offer: 'o' }); return ev[0]; };
  assert.equal(once(), once());
});

test('a failure under +4 keeps the piece where it was; a worn piece that breaks leaves its slot empty; an heirloom never breaks', () => {
  // a failure at the step to +2 (no drop): found on the first uid whose roll fails
  for (let i = 0; i < 200; i++) {
    const s = town(), it = piece('common', 'sword', 10, { up: 1 }); s.state.bag.push(it); const off = piece(); s.state.bag.push(off);
    const ev = []; s.bus.on('forged', (e) => ev.push(e)); run(s, { type: 'upgrade', uid: it.uid, offer: off.uid });
    if (ev[0].result === 'fail') { assert.equal(it.up, 1); break; }
  }
  let broke = false;
  for (let i = 0; i < 400 && !broke; i++) {
    const s = town(), m = s.state.party[0], w = { ...piece('common', m.gear.weapon.base, 10), up: 8 }; m.gear.weapon = w; s.state.bag.push(piece());
    const ev = []; s.bus.on('forged', (e) => ev.push(e)); run(s, { type: 'upgrade', uid: w.uid, offer: s.state.bag.at(-1).uid });
    if (ev[0].result === 'broke') { broke = true; assert.equal(m.gear.weapon, null, 'its slot empty'); }
  }
  assert.ok(broke, 'a worn piece broke in 400 tries at +8 → +9');
  for (let i = 0; i < 300; i++) {
    const s = town(), h = piece('heirloom', 'ring', 10, { up: 8 }); s.state.bag.push(h, piece());
    const ev = []; s.bus.on('forged', (e) => ev.push(e)); run(s, { type: 'upgrade', uid: h.uid, offer: s.state.bag.at(-1).uid });
    assert.notEqual(ev[0].result, 'broke'); assert.ok(s.state.bag.includes(h));
  }
});

// (v1.115, the owner: "Already upgraded items also improve upgrade chance. Fail rate no more that 10, but using good items can
// get this under 5%")
test('never more than 10 % goes wrong, failing and breaking together; good pieces bring it under 5 %; an upgraded piece helps more', () => {
  for (let up = 0; up < UP_MAX; up++) {
    const it = { ...piece('rare', 'sword', 20), up }, worst = upgradeOdds(it, piece('common', 'ring', 1)), good = upgradeOdds(it, piece('rare', 'sword', 20));
    assert.ok(worst.fail + worst.broke <= 0.10 + 1e-12, `+${up} → +${up + 1}: ${(100 * (worst.fail + worst.broke)).toFixed(1)} % at worst`);
    assert.ok(good.fail + good.broke < 0.05, `+${up + 1} with a Rare for the same slot: ${(100 * (good.fail + good.broke)).toFixed(1)} %`);
  }
  const it = { ...piece('fine', 'sword', 20), up: 8 }, plain = upgradeOdds(it, piece('fine', 'sword', 20)), upped = upgradeOdds(it, piece('fine', 'sword', 20, { up: 5 }));
  assert.ok(upped.ok > plain.ok, `a +5 piece helps more: ${upped.ok.toFixed(4)} > ${plain.ok.toFixed(4)}`);
});
