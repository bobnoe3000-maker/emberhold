// reachfx.test.mjs — the Cinder Reach's bosses' looks (docs/art-critic-pass-reach-fx.md): Oruth at his anvil, a wight
// re-armed, a spoiled piece, the Weighmaster's weighing and his pan landing, the Stoker's vents letting go each draw a
// moment of their own; Oruth's work ends when the sim says so; the Reach's camps pitch a tent of their own canvas; the
// Reach's kit pieces have baked cards and no footprint of their own; Furnace Nine's atlas has a still of its smoke.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createSkillFX, FIGHT_MOMENTS, FORGE_BEAT } from '../src/render/skillfx.js';
import { buildProps } from '../src/render/gsprite.js';
import { ENV_FOOT } from '../src/sim/envfoot.js';
import { ANVIL_T } from '../src/sim/battle.js';

const REACH = ['boss_forge', 'boss_arm', 'boss_spoil', 'boss_scales', 'boss_pan', 'boss_vent'];
const drawn = (id, ms = [60, 160, 400, 900], more = {}) => {
  const pts = [], P = { depth() {}, flush() {}, mark: (x, y, a) => { if (a > 0.01) pts.push(`${Math.round(x)},${Math.round(y)}`); }, disc: (x, y, r, a) => { if (a > 0.01) pts.push(`${Math.round(x)},${Math.round(y)}`); }, seg: (x0, y0, x1, y1, a0, a1) => { if (Math.max(a0, a1) > 0.01) pts.push(`${Math.round(x0)},${Math.round(y0)}-${Math.round(x1)},${Math.round(y1)}`); }, star: (x, y, r, a) => { if (a > 0.01) pts.push(`*${Math.round(x)},${Math.round(y)}`); } };
  const fx = createSkillFX(P), proj = (x, y) => ({ sx: 200 + (x - y) * 8, sy: 200 + (x + y) * 4, h: 0, key: x + y });
  fx.moment({ id, by: 7, foeBy: true, tid: null, ally: id === 'boss_scales', x: 5, y: 5, tx: 8, ty: 4, r: 1.7, reached: [], ...more }, 0);
  for (const t of ms) fx.draw(t, proj, []);
  return { pts, fx, proj };
};

test("the Reach's bosses' moments each draw, and no two alike", () => {
  const sig = new Map();
  for (const id of REACH) {
    assert.ok(FIGHT_MOMENTS.includes(id), `${id} is a fight moment`);
    const { pts } = drawn(id, [60, 160, 400, 900], id === 'boss_forge' ? { life: ANVIL_T } : {});
    assert.ok(pts.length >= 20, `${id} draws: ${pts.length}`);
    const s = pts.join('|'); assert.ok(!sig.has(s), `${id} draws as ${sig.get(s)} does`); sig.set(s, id);
  }
});

test("Oruth's work lasts the event's t, hammers on its beat, and ends when the work does", () => {
  assert.ok(FORGE_BEAT.first > 0 && FORGE_BEAT.every > 0 && FORGE_BEAT.first + 4 * FORGE_BEAT.every < ANVIL_T, 'a few blows in his work');
  const { fx, proj } = drawn('boss_forge', [100], { life: ANVIL_T });
  fx.draw(3000, proj, []); assert.equal(fx.live, 1, 'still at it 3 s in (the event says 4)');
  fx.end('boss_forge', 7); assert.equal(fx.live, 0, "the sim's 'bossAnvil' ends it");
});

test("the Reach's camps pitch canvas grey with ash, not the Vale's", () => {
  const P = buildProps(1), a = P.tent[0], b = P.tent_reach[0];
  assert.ok(b && b.w === a.w && b.h === a.h, 'the same tent');
  const sat = (sp) => { let s = 0, n = 0; for (let i = 0; i < sp.w * sp.h; i++) if (sp.mask[i]) { const r = sp.alb[i * 3], g = sp.alb[i * 3 + 1], bl = sp.alb[i * 3 + 2]; s += Math.max(r, g, bl) - Math.min(r, g, bl); n++; } return s / n; };
  assert.ok(sat(b) < sat(a) * 0.6, `greyer: ${sat(b).toFixed(1)} against ${sat(a).toFixed(1)}`);
});

test("the Reach's kit pieces have cards, and no footprint of their own", () => {
  const T = JSON.parse(readFileSync(new URL('../tools/actor-lab/town.json', import.meta.url), 'utf8')).reach;
  const A = JSON.parse(readFileSync(new URL('../assets/env/town-reach.json', import.meta.url), 'utf8')).sprites;
  const kit = ['gatewheel', 'stack', 'works', 'pithead', 'assayhouse', 'forgedoor', 'ninthdoor', 'vaultmouth', 'slagheap'].map((b) => 'reach_' + b);
  for (const id of kit) {
    const e = T.find((q) => q.id === id);
    assert.ok(e && e.build && e.nofoot, `${id} in town.json, built, nofoot`);
    assert.ok(A[id] && A[id].w > 0 && A[id].h > 0, `${id} baked (town-reach)`);
    assert.ok(!(id in ENV_FOOT), `${id}: no footprint the sim collides with`);
  }
});

// Furnace Nine's still smoke (docs/art-critic-pass-reach-fx.md, the furnace's round 4): its atlas a moment of the world's
// puffs, translucent, under the old blobs' top (the figure as big as it was); the game's model none (its smoke is the
// world's particles). (The kit needs the lab's three: tools/actor-lab `npm i`; without it this check is skipped.)
const lab = (() => { try { createRequire(new URL('../tools/actor-lab/package.json', import.meta.url)).resolve('three'); return true; } catch { return false; } })();
test('Furnace Nine\'s still smoke: the bake\'s alone, translucent puffs inside the figure\'s old box', { skip: !lab && 'the actor lab isn\'t installed' }, async () => {
  const bake = JSON.parse(readFileSync(new URL('../tools/actor-lab/bake.json', import.meta.url), 'utf8')).actors.find((a) => a.out === 'boss_furnace_nine');
  const cast = JSON.parse(readFileSync(new URL('../assets/models/cast.json', import.meta.url), 'utf8')).actors.boss_furnace_nine;
  assert.equal(bake.creature && bake.creature.smoke, true, 'the bake asks for it');
  assert.ok(!('smoke' in cast.v.creature), 'the game\'s model is built without it');
  const { buildCreature } = await import('../tools/actor-lab/creatures.js');
  const meshes = (m) => { const n = []; m.root.traverse((o) => { if (o.isSkinnedMesh) n.push(o); }); return n; };
  const top = (m) => Math.max(...meshes(m).map((o) => { o.geometry.computeBoundingBox(); return o.geometry.boundingBox.max.y; }));
  const plain = await buildCreature({ kind: 'furnace' }), still = await buildCreature({ kind: 'furnace', smoke: true });
  assert.ok(!meshes(plain).some((o) => o.userData.soft), 'no smoke mesh in the world\'s');
  const smoke = meshes(still).find((o) => o.userData.soft);
  assert.ok(smoke && smoke.material.transparent && !smoke.material.depthWrite, 'a translucent mesh of its own');
  const C = smoke.geometry.attributes.color, a = new Set(); for (let i = 0; i < C.count; i++) a.add(Math.round(C.getW(i) * 100));
  assert.equal(C.itemSize, 4); assert.ok([...a].every((v) => v > 0 && v < 100) && a.size === 3, `three puffs, each its own opacity (${[...a]})`);
  assert.equal(top(still), top(plain), 'the same top: fitted to its box, the figure as big as it was');
});
