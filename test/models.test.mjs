// models.test.mjs — the cast as models (tools/actor-lab/models.mjs → assets/models; docs/dungeon-kit-proposal.md §9, 4b):
// every baked actor has its variant, size and clips in cast.json; every clip it plays is in its model's .glb and nothing
// else is (the packs' other animations pruned); the weapons and faces it needs are shipped. A bake or variant change
// without `node tools/actor-lab/models.mjs` fails here.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const at = (p) => new URL(`../${p}`, import.meta.url);
const read = (p) => JSON.parse(readFileSync(at(p), 'utf8'));
const glbJson = (p) => { const b = readFileSync(at(p)); assert.equal(b.readUInt32LE(0), 0x46546c67, `${p} is a glb`); const n = b.readUInt32LE(12); return JSON.parse(b.subarray(20, 20 + n).toString('utf8')); };

test('cast.json holds every baked actor with its variant, its size and the clips its atlas has', () => {
  const cast = read('assets/models/cast.json'), bake = read('tools/actor-lab/bake.json');
  const variants = Object.fromEntries(read('tools/actor-lab/variants.json').map((v) => [v.id, v]));
  assert.deepEqual(Object.keys(cast.actors).sort(), bake.actors.map((a) => a.out).sort());
  for (const a of bake.actors) {
    const c = cast.actors[a.out];
    assert.deepEqual(c.v, variants[a.variant], `${a.out}: its variant as variants.json has it`);
    assert.equal(c.px, a.px || bake.px, `${a.out}: its height in px`);
    for (const k of a.clips) assert.equal(c.clips[k.key]?.clip, k.clip, `${a.out}: ${k.key} plays ${k.clip}`);
    if (typeof c.v.face === 'string') assert.ok(cast.faces[c.v.face], `${a.out}: its face ${c.v.face}`);
  }
});

test('each model carries exactly the clips its actors play, and the weapons they attach are shipped', () => {
  const cast = read('assets/models/cast.json'), plays = new Map();
  for (const c of Object.values(cast.actors)) {
    const s = plays.get(c.v.model) || new Set(['Idle']); plays.set(c.v.model, s);
    for (const k of Object.values(c.clips)) s.add(k.clip);
    for (const f of Object.values(c.v.attach || {})) assert.ok(existsSync(at(`assets/models/${f}`)), `${f} is shipped`);
  }
  for (const [model, want] of plays) {
    const j = glbJson(`assets/models/${model}.glb`), have = new Set((j.animations || []).map((a) => a.name));
    assert.deepEqual([...have].sort(), [...want].sort(), `${model}: its clips`);
    assert.ok(j.skins?.length && j.meshes?.length, `${model}: its skin and meshes kept`);
    assert.equal(j.buffers.length, 1); assert.equal(j.accessors.every((a) => a.bufferView < j.bufferViews.length), true, `${model}: every accessor's view is in it`);
  }
});
