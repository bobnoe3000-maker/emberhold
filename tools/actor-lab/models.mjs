// @ts-check
// models.mjs — the cast as models for the game's Luminati renderer (docs/dungeon-kit-proposal.md §9, 4b; the owner,
// 2026-11-09: "Lets do just the character and npc model change to 4b at 3x"). Writes assets/models/:
//   · each KayKit model our variants use (tools/actor-lab/models/, fetch-assets.sh), its meshes, skin and textures as
//     they are, and only the animations bake.json plays on it (each pack's file carries 76–95; we play 7–23): the
//     glTF's JSON and binary pruned, nothing re-encoded, so a model in the world is the model the atlases are baked from;
//   · the weapons the variants attach (the skeletons' blades, shields, staff, crossbow, axe), copied;
//   · cast.json: every baked actor's variant (variants.json), its figure height in px, its clips (key → the KayKit clip,
//     its frames and their span, as bake.json bakes them) and the face presets they wear (faces.json).
// Never edit assets/models by hand: change the variants or bake.json, and run this again (with the bake).
//   node tools/actor-lab/models.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = join(HERE, '..', '..'), SRC = join(HERE, 'models'), OUT = join(ROOT, 'assets', 'models');
const bake = JSON.parse(readFileSync(join(HERE, 'bake.json'), 'utf8')), variants = Object.fromEntries(JSON.parse(readFileSync(join(HERE, 'variants.json'), 'utf8')).map((v) => [v.id, v]));
const facesAll = JSON.parse(readFileSync(join(HERE, 'faces.json'), 'utf8'));

/** a .glb's JSON and binary chunks @param {Buffer} b */
function readGlb(b) {
  if (b.readUInt32LE(0) !== 0x46546c67) throw new Error('not a glb');
  const jl = b.readUInt32LE(12), json = JSON.parse(b.subarray(20, 20 + jl).toString('utf8'));
  const bo = 20 + jl, bin = bo < b.length ? b.subarray(bo + 8, bo + 8 + b.readUInt32LE(bo)) : Buffer.alloc(0);
  return { json, bin };
}
/** @param {any} json @param {Buffer} bin */
function writeGlb(json, bin) {
  const pad = (n) => (4 - (n % 4)) % 4;
  let js = Buffer.from(JSON.stringify(json), 'utf8'); js = Buffer.concat([js, Buffer.alloc(pad(js.length), 0x20)]);
  const bn = Buffer.concat([bin, Buffer.alloc(pad(bin.length))]);
  const head = Buffer.alloc(12), jh = Buffer.alloc(8), bh = Buffer.alloc(8);
  head.writeUInt32LE(0x46546c67, 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + js.length + 8 + bn.length, 8);
  jh.writeUInt32LE(js.length, 0); jh.writeUInt32LE(0x4e4f534a, 4); bh.writeUInt32LE(bn.length, 0); bh.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([head, jh, js, bh, bn]);
}
/** keep only the animations named in `keep`, then drop every accessor and buffer view nothing uses any more @param {any} json @param {Buffer} bin @param {Set<string>} keep */
function prune(json, bin, keep) {
  json.animations = (json.animations || []).filter((a) => keep.has(a.name));
  const acc = new Set(), use = (i) => { if (i !== undefined) acc.add(i); };
  for (const m of json.meshes || []) for (const p of m.primitives) { for (const v of Object.values(p.attributes)) use(v); use(p.indices); for (const t of p.targets || []) for (const v of Object.values(t)) use(v); }
  for (const s of json.skins || []) use(s.inverseBindMatrices);
  for (const a of json.animations) for (const s of a.samplers) { use(s.input); use(s.output); }
  const accMap = new Map(), accessors = [];
  (json.accessors || []).forEach((a, i) => { if (acc.has(i)) { accMap.set(i, accessors.length); accessors.push(a); } });
  const views = new Set(accessors.map((a) => a.bufferView).filter((v) => v !== undefined));
  for (const im of json.images || []) if (im.bufferView !== undefined) views.add(im.bufferView);
  if (accessors.some((a) => a.sparse)) throw new Error('sparse accessors: not handled');
  const viewMap = new Map(), bufferViews = [], parts = []; let off = 0;
  (json.bufferViews || []).forEach((v, i) => {
    if (!views.has(i)) return;
    const pad = (4 - (off % 4)) % 4; if (pad) { parts.push(Buffer.alloc(pad)); off += pad; }
    parts.push(bin.subarray(v.byteOffset || 0, (v.byteOffset || 0) + v.byteLength));
    viewMap.set(i, bufferViews.length); bufferViews.push({ ...v, buffer: 0, byteOffset: off }); off += v.byteLength;
  });
  for (const a of accessors) if (a.bufferView !== undefined) a.bufferView = viewMap.get(a.bufferView);
  for (const im of json.images || []) if (im.bufferView !== undefined) im.bufferView = viewMap.get(im.bufferView);
  const re = (i) => accMap.get(i);
  for (const m of json.meshes || []) for (const p of m.primitives) { for (const k of Object.keys(p.attributes)) p.attributes[k] = re(p.attributes[k]); if (p.indices !== undefined) p.indices = re(p.indices); for (const t of p.targets || []) for (const k of Object.keys(t)) t[k] = re(t[k]); }
  for (const s of json.skins || []) if (s.inverseBindMatrices !== undefined) s.inverseBindMatrices = re(s.inverseBindMatrices);
  for (const a of json.animations) for (const s of a.samplers) { s.input = re(s.input); s.output = re(s.output); }
  json.accessors = accessors; json.bufferViews = bufferViews;
  const out = Buffer.concat(parts); json.buffers = [{ byteLength: out.length }];
  return out;
}

// what each model plays (every clip bake.json bakes on a variant of it) and what the cast attaches and wears
const plays = new Map(), attach = new Set(), presets = new Set(), actors = {};
for (const a of bake.actors) {
  const v = variants[a.variant]; if (!v) throw new Error(`${a.out}: no variant ${a.variant}`);
  if (v.body) throw new Error(`${a.out}: a body mock-up (body.js) isn't shipped as a model`);
  const set = plays.get(v.model) || new Set(['Idle']); plays.set(v.model, set);
  const clips = {};
  for (const k of a.clips) { set.add(k.clip); clips[k.key] = { clip: k.clip, frames: k.frames, ...(k.once ? { once: true } : {}), ...(k.from != null ? { from: k.from } : {}), ...(k.to != null ? { to: k.to } : {}) }; }
  for (const f of Object.values(v.attach || {})) attach.add(f);
  if (typeof v.face === 'string') presets.add(v.face);
  actors[a.out] = { v, px: a.px || bake.px, clips };
}
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });
let before = 0, after = 0;
for (const [model, keep] of plays) {
  const src = readFileSync(join(SRC, `${model}.glb`)), { json, bin } = readGlb(src);
  const names = new Set((json.animations || []).map((a) => a.name)), missing = [...keep].filter((n) => !names.has(n));
  if (missing.length) throw new Error(`${model}: no clip ${missing.join(', ')}`);
  const nAll = json.animations.length, b = prune(json, bin, keep), glb = writeGlb(json, b);
  writeFileSync(join(OUT, `${model}.glb`), glb); before += src.length; after += glb.length;
  console.log(`${model.padEnd(17)} ${String(keep.size).padStart(2)} of ${nAll} clips  ${(src.length / 1024).toFixed(0).padStart(5)} KB → ${(glb.length / 1024).toFixed(0).padStart(4)} KB`);
}
for (const f of attach) {
  const g = JSON.parse(readFileSync(join(SRC, f), 'utf8'));
  for (const u of [...(g.buffers || []), ...(g.images || [])].map((x) => x.uri).filter(Boolean)) { copyFileSync(join(SRC, u), join(OUT, u)); after += statSync(join(OUT, u)).size; }
  copyFileSync(join(SRC, f), join(OUT, f)); after += statSync(join(OUT, f)).size;
}
const faces = Object.fromEntries([...presets].sort().map((n) => { if (!facesAll[n]) throw new Error(`no face preset ${n}`); return [n, facesAll[n]]; }));
const cast = { _: 'Built by tools/actor-lab/models.mjs from bake.json, variants.json and faces.json: never edit, rebuild.', px: bake.px, actors, faces };
writeFileSync(join(OUT, 'cast.json'), JSON.stringify(cast) + '\n'); after += statSync(join(OUT, 'cast.json')).size;
console.log(`assets/models: ${plays.size} models, ${attach.size} weapons, ${Object.keys(actors).length} actors, ${Object.keys(faces).length} faces; ${(before / 1048576).toFixed(1)} MB of packs → ${(after / 1048576).toFixed(2)} MB`);
