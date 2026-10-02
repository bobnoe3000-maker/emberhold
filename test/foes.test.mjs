// The foes (art critic pass 9): every enemy kind's look draws its weapon effects and its own sparks (the
// Redhand, the Cult and the bosses swung with nothing drawn, and their blows raised the default sparks),
// no foe wears a hero's face, and the bosses are baked tall rather than nearest-upscaled at load.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FX_STYLES, styleOfSrc } from '../src/render/fx.js';

const lab = (f) => JSON.parse(readFileSync(`tools/actor-lab/${f}`, 'utf8'));
// the renderer's kind → atlas table (renderer.js can't load under node: it needs WebGL)
const src = readFileSync('src/render/renderer.js', 'utf8'), body = src.slice(src.indexOf('const ENEMY_ACTOR = {') + 20, src.indexOf('};', src.indexOf('const ENEMY_ACTOR = {')) + 1);
const ENEMY_ACTOR = Object.fromEntries([...body.matchAll(/(\w+): '(\w+)'/g)].map((m) => [m[1], m[2]]));

test('every enemy kind has a baked look with weapon effects and its own sparks', () => {
  const baked = new Set(lab('bake.json').actors.map((a) => a.out));
  assert.ok(Object.keys(ENEMY_ACTOR).length >= 11);
  for (const [kind, atlas] of Object.entries(ENEMY_ACTOR)) {
    assert.ok(baked.has(atlas), `${kind}: ${atlas} isn't baked`);
    assert.ok(FX_STYLES[atlas], `${atlas}: no weapon effect style`);
    assert.equal(styleOfSrc(kind, true, ENEMY_ACTOR), FX_STYLES[atlas], `${kind}: its blows don't find its sparks`);
  }
});

test("no foe wears a hero's face, and no two kinds of foe share one", () => {
  const vars = lab('variants.json'), bake = lab('bake.json').actors;
  const used = (re) => new Map(bake.filter((a) => re.test(a.out)).map((a) => [a.out, vars.find((v) => v.id === a.variant).face]));
  const heroFaces = new Set([...used(/^hero_/).values()].filter(Boolean)), foes = used(/^(redhand_|cinder_|boss_)/);
  const seen = new Map();
  for (const [out, face] of foes) {
    if (!face) continue;                                              // (the Standard is a skeleton)
    assert.ok(!heroFaces.has(face), `${out} wears a hero's face (${face})`);
    assert.ok(!seen.has(face), `${out} and ${seen.get(face)} share the face ${face}`); seen.set(face, out);
  }
  assert.ok(seen.size >= 6);
});

test('the bosses are baked tall (73 px, 114 × 133 cells), so they load without a nearest-neighbour upscale', () => {
  for (const a of lab('bake.json').actors.filter((x) => x.out.startsWith('boss_'))) {
    assert.equal(a.px, 73, a.out);
    const m = JSON.parse(readFileSync(`assets/actors/${a.out}.json`, 'utf8'));
    assert.deepEqual([m.cw, m.ch], [114, 133], a.out);
    assert.ok(Math.abs(1.3 * 88 / m.cw - 1) <= 0.04, `${a.out}: would still be upscaled at load`);
  }
});
