// stone.test.mjs — the stone-and-mine track of the dungeons' looks (docs/dungeon-looks-plan.md items 6, 8, 9, 11;
// docs/art-critic-pass-stone.md): the Reedholm Undercroft in its own kits with the crypt's fights, the Cold Seam's mine
// pieces (rails walked over, never standing for an obstacle), the quota office's counting-house look, and a generated
// floor's look by its land.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, isWalkable, FLAT_PROPS, DRESS } from '../src/sim/world.js';
import { convertWorld } from '../src/render3d/convert.js';
import { SITES } from '../src/sim/sites.js';

const SEED = 20260807;
const pieces = (r) => r.sprites.filter((q) => q.tavern).flatMap((q) => q.tavern.pieces);

test('the Undercroft: the fen kits dress as the crypt\'s and draw in fen brick, eel traps and nets in its bays, reed mats on its floor', () => {
  assert.equal(DRESS.fenbrick, DRESS.crypt); assert.equal(DRESS.fenbones, DRESS.ossuary);
  const w = createWorld(SEED, undefined, 0, 'reedholm_undercroft'), r = convertWorld(w, { region: 'fens' }), t = new Set(r.level.tiles.join(''));
  for (const ch of ['ж', 'б', 'п', 'т']) assert.ok(t.has(ch), `its tile '${ch}'`);
  for (const ch of ['!', '*', ':']) assert.ok(!t.has(ch), `no crypt limestone '${ch}'`);
  const ks = new Set(pieces(r).map((p) => p.k));
  for (const k of ['eeltraps', 'nets', 'reedmat', 'ledger', 'pier', 'skullniche']) assert.ok(ks.has(k), k);
  assert.ok(pieces(r).filter((p) => p.k === 'pier').every((p) => p.fen), 'its arcade in fen brick');
});

test('the Cold Seam: rails down the galleries, walked over and no obstacle; shoring, carts and hook lamps in 3D; the warren\'s robbed', () => {
  assert.ok(FLAT_PROPS.has('rail'));
  const w0 = createWorld(SEED, undefined, 0, 'cold_seam'), rails = [...w0.props].filter(([, v]) => v === 'rail');
  assert.ok(rails.length > 40, 'the rails');
  for (const [k] of rails) { const [x, y] = k.split(',').map(Number); assert.ok(isWalkable(w0, x + 0.5, y + 0.5), `a rail at ${k} is walked over`); }
  const p0 = pieces(convertWorld(w0, { region: 'reach' })), k0 = new Set(p0.map((p) => p.k));
  for (const k of ['rails', 'shoringset', 'orecart', 'hooklamp']) assert.ok(k0.has(k), k);
  assert.ok(p0.some((p) => p.k === 'orecart' && p.rail), 'a cart on the rails');
  const w1 = createWorld(SEED, undefined, 1, 'cold_seam'), p1 = pieces(convertWorld(w1, { region: 'reach' }));
  assert.ok(p1.some((p) => p.k === 'shoringset' && p.broken), 'the warren\'s shoring robbed');
  assert.ok(p1.some((p) => p.k === 'orecart' && p.tipped), 'a cart on its side');
});

test('the quota office a counting house: its kit stays quota, its look counting; ledger shelves, tally boards, chained desks, cool lamps', () => {
  const w = createWorld(SEED, undefined, 1, 'assay_yards');
  assert.ok(w.level.rooms.every((r) => r.kit === 'quota'));
  const r = convertWorld(w, { region: 'reach' }), t = new Set(r.level.tiles.join('')), ks = pieces(r).map((p) => p.k);
  for (const ch of ['с', 'к']) assert.ok(t.has(ch), `its tile '${ch}'`);
  for (const k of ['cpilaster', 'tally', 'cbook', 'chainring', 'clampstand']) assert.ok(ks.includes(k), k);
  assert.ok(pieces(r).some((p) => p.k === 'furn' && p.opts?.kind === 'books'), 'the ledger shelves');
  assert.ok(r.ambient.sky[2] > r.ambient.sky[0], 'a cool fill');
});

test('a generated floor follows its land: the Mere Tower in the Fens\' stone, the same for the same seed, the Vale\'s as before', () => {
  assert.ok(!SITES.mere_tower.plan);
  const looks = new Set();
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    const w = createWorld(seed, undefined, 0, 'mere_tower'), a = convertWorld(w, { region: 'fens' }), b = convertWorld(createWorld(seed, undefined, 0, 'mere_tower'), { region: 'fens' });
    assert.deepEqual(a.level.tiles, b.level.tiles, 'deterministic from the floor\'s seed');
    const t = new Set(a.level.tiles.join(''));
    assert.ok(t.has('w') || t.has('p'), `seed ${seed}: the locks' or the abbey's flags`);
    assert.ok(!t.has('k'), `seed ${seed}: not the Vale's barracks (its stone tiles)`);
    looks.add(t.has('w') ? 'locks' : 'abbey');
  }
  assert.equal(looks.size, 2, 'both of the land\'s looks among six seeds');
  // a mire floor in the Fens draws the Toadking's mud
  const mire = convertWorld(createWorld(7, 'mire', 0, 'mere_tower'), { region: 'fens' });
  assert.ok(new Set(mire.level.tiles.join('')).has('t'), 'the mound\'s mud');
});
