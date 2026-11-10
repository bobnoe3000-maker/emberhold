// Where a dungeon floor's dressing may not go (docs/level-design-rules.md §4.4, src/sim/keepclear.js; the owner,
// 2026-11-10: "need rules to prevent things like barrels blocking the stairway, or a torch in the middle of a hallway or
// entrance to another room"): on every site's floors, authored or generated, over several seeds, nothing on the stairs or
// their approach, nothing in a doorway's mouth, no light out in the open; the stairs' own lights and set piece kept; the
// doorways still lit about as often as before.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld } from '../src/sim/world.js';
import { SITES } from '../src/sim/sites.js';
import { dressingFaults, stairZone, mouths, againstWall } from '../src/sim/keepclear.js';
import { LIGHT } from '../src/sim/dresscaps.js';

const floors = (seeds = 2) => {
  const out = [];
  for (const [site, S] of Object.entries(SITES)) { if (S.parked) continue; for (let d = 0; d < (S.floors || 3); d++) for (let s = 0; s < seeds; s++) out.push([site, d, (20260807 + s * 1013 ^ d * 7919) >>> 0]); }
  return out;
};

test('every floor: nothing on the stairs, in a doorway, or a light out in the open', () => {
  let n = 0;
  for (const [site, d, seed] of floors()) {
    let w; try { w = createWorld(seed, undefined, d, site); } catch { continue; }
    n++;
    const f = dressingFaults(w);
    assert.deepEqual(f, [], `${site} floor ${d + 1} seed ${seed}: ${f.map((q) => `${q.kind}@${q.key} (${q.why})`).join(', ')}`);
  }
  assert.ok(n >= 30, `floors checked: ${n}`);
});

test("the stairs keep their own: the stairwell's two lights, and the stairs themselves", () => {
  for (const [site, d, seed] of floors(1)) {
    let w; try { w = createWorld(seed, undefined, d, site); } catch { continue; }
    if (!w.stairwell) continue;
    const S = w.stairwell, own = [`${S.x0 - 1},${S.y1 - 1}`, `${S.x1},${S.y1 - 1}`];
    for (const k of own) if (w.level.cells.get(k)?.kind === 'floor') assert.equal(w.props.get(k), 'brazier', `${site} f${d + 1}: the well's light at ${k}`);
    assert.equal(w.props.get(`${w.stairsAt.x},${w.stairsAt.y}`), 'stairs');
    assert.ok(stairZone(w).size > 0);
  }
});

test('the rules themselves: a light by a wall passes, one in the open and one in a mouth do not', () => {
  const w = createWorld(20260807, undefined, 0, 'barrows'), L = w.level, M = mouths(L);
  let open = null, wall = null;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room < 0 || M.has(k)) continue; const [x, y] = k.split(',').map(Number); if (!open && !againstWall(L, x, y)) open = k; if (!wall && againstWall(L, x, y)) wall = k; if (open && wall) break; }
  assert.ok(open && wall);
  const tryAt = (k, kind) => { const w2 = createWorld(20260807, undefined, 0, 'barrows'); w2.props.set(k, kind); return dressingFaults(w2).some((q) => q.key === k); };
  assert.equal(tryAt(open, 'brazier'), true, 'a brazier out in the open'); assert.equal(tryAt(wall, 'brazier'), false, 'a brazier by a wall');
  assert.equal(tryAt([...M][0], 'barrels'), [...M][0] && L.cells.get([...M][0])?.kind === 'floor', 'barrels in a doorway');
  assert.ok(LIGHT.has('torch') && LIGHT.has('candles'));
});
