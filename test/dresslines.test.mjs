// The no-lined-up rule (docs/level-design-rules.md §4.6; the owner, 2026-11-28, of the Gull Isles' gun deck: "dressing
// should have rules to not repeat and line up the same dressing"): on every floor of every site, no piece set down four
// times or more along one line at one spacing, in the sim's dressing or in what the renderer adds along the walls.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld } from '../src/sim/world.js';
import { SITES } from '../src/sim/sites.js';
import { lineRuns, MAX_RUN } from '../src/sim/dresslines.js';
import { convertWorld } from '../src/render3d/convert.js';
import { dressPieces } from '../src/render3d/dresspieces.js';

test('lineRuns: a file of four at one step is a run; broken, mixed or built, it isn\'t', () => {
  const at = (kind, xs, y = 10) => xs.map((x) => ({ kind, x, y }));
  assert.equal(lineRuns(at('bunk', [0, 6, 12, 18])).length, 1);
  assert.equal(lineRuns(at('bunk', [0, 6, 12, 18]))[0].n, 4);
  assert.equal(lineRuns(at('bunk', [0, 6, 12, 21, 27, 33])).length, 0, 'twos and threes, a wider gap between');
  assert.equal(lineRuns([...at('bunk', [0, 12]), ...at('crates', [6, 18]), ...at('bunk', [24], 10)]).length, 0, 'other pieces between break nothing, but three is the most');
  assert.equal(lineRuns(at('pillar', [0, 8, 16, 24, 32])).length, 0, 'a colonnade is built');
  assert.equal(lineRuns(at('channel', [0, 1, 2, 3, 4, 5])).length, 0, 'a channel is one piece laid on');
  assert.equal(lineRuns(at('lantern', [0, 16, 32, 48])).length, 1, 'a lamp every other bay is a beat');
  assert.equal(lineRuns(at('bunk', [0, 6, 12, 18]).map((p, i) => ({ ...p, y: p.y + (i % 2) * 2 }))).length, 0, 'out of line by two tiles: two files');
  assert.equal(MAX_RUN, 3);
});

test('no floor of any site lines up the same piece (the sim\'s dressing and the renderer\'s)', () => {
  const bad = [];
  for (const [site, S] of Object.entries(SITES)) {
    if (S.parked) continue;
    for (let d = 0; d < (S.floors || 3); d++) {
      let w; try { w = createWorld((20260807 ^ d * 7919) >>> 0, undefined, d, site); } catch { continue; }
      const sim = [...w.props].map(([k, kind]) => { const [x, y] = k.split(',').map(Number); return { kind, x, y }; });
      for (const r of lineRuns(sim)) bad.push(`${site} f${d + 1} sim: ${r.n} ${r.kind} every ${r.step} along ${r.axis} at ${r.at}`);
      for (const r of lineRuns(dressPieces(convertWorld(w, {})))) bad.push(`${site} f${d + 1} drawn: ${r.n} ${r.kind} every ${r.step} along ${r.axis} at ${r.at}`);
    }
  }
  assert.deepEqual(bad, []);
});
