// Every boss mechanic the sim has a line in the renderer's boss banner (renderer.js bossLine). The Foreman's `chutes`
// (v1.124) had none, and his hall's first wave threw in the renderer (the art capture of the Cold Seam's tally cave,
// 2026-11-16): the banner read bossLine[mech][1]. The renderer needs a page to load, so its table is read as text here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BOSSES } from '../src/sim/battle.js';

test('every boss mechanic has its banner line in the renderer', () => {
  const src = readFileSync(new URL('../src/render/renderer.js', import.meta.url), 'utf8');
  const table = src.slice(src.indexOf('const bossLine = {'), src.indexOf('};', src.indexOf('const bossLine = {')));
  const missing = [...new Set(Object.values(BOSSES).map((b) => b.mech))].filter((m) => !new RegExp(`\\b${m}: \\[`).test(table));
  assert.deepEqual(missing, [], `no banner line for: ${missing.join(', ')}`);
});
