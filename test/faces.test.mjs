// Faces (art critic pass 4): every variant's face is a preset in tools/actor-lab/faces.json, and
// every actor the bake marks `portrait` has its head-and-shoulders portrait baked at 96 × 112
// (the windows draw <actor>.face.png, and fall back to an atlas crop only when it's missing), and
// every actor with a `figure` its lit, posed character-window figure.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const lab = (f) => JSON.parse(readFileSync(`tools/actor-lab/${f}`, 'utf8'));
const pngSize = (f) => { const b = readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

test('every variant face is a faces.json preset', () => {
  const faces = lab('faces.json');
  for (const v of lab('variants.json').filter((x) => x.face)) assert.ok(typeof v.face !== 'string' || faces[v.face], `${v.id}: no face preset "${v.face}"`);
});

test('every portrait actor has its 96 × 112 portrait, and a face', () => {
  const vars = Object.fromEntries(lab('variants.json').map((v) => [v.id, v]));
  const actors = lab('bake.json').actors.filter((a) => a.portrait);
  assert.ok(actors.length >= 6);
  for (const a of actors) {
    const f = `assets/actors/${a.out}.face.png`;
    assert.ok(existsSync(f), `${a.out}: no portrait`); assert.deepEqual(pngSize(f), [96, 112], a.out);
    assert.ok(vars[a.variant].face, `${a.out}: its variant has no face`);
  }
});

test('every figure actor has its 352 × 408 character-window figure, posed with a real clip', () => {
  const actors = lab('bake.json').actors.filter((a) => a.figure);
  assert.ok(actors.length >= 6);
  for (const a of actors) {
    const f = `assets/actors/${a.out}.fig.png`;
    assert.ok(existsSync(f), `${a.out}: no figure`); assert.deepEqual(pngSize(f), [352, 408], a.out);
    assert.ok(Array.isArray(a.figure.pose) && typeof a.figure.pose[0] === 'string' && a.figure.pose[1] >= 0 && a.figure.pose[1] <= 1, `${a.out}: pose`);
  }
});

test('the playable looks and the named NPCs all have portraits', async () => {
  const { LOOKS } = await import('../src/sim/party.js');
  for (const look of Object.values(LOOKS).flat()) { assert.ok(existsSync(`assets/actors/${look}.face.png`), look); assert.ok(existsSync(`assets/actors/${look}.fig.png`), look); }
  for (const f of ['maudry_fenn']) { const d = JSON.parse(readFileSync(`content/npcs/${f}.json`, 'utf8')); assert.ok(existsSync(`assets/actors/${d.portrait || d.look}.face.png`), f); }
});
