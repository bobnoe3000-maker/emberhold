// figure.js — a KayKit character dressed as one of our variants (variants.json), shared by the bake (lab.js, which draws
// it into the atlases) and the game's Luminati renderer (tools/render3d/world.js, which stands it in the world as a model:
// docs/dungeon-kit-proposal.md §9, 4b). One builder, so a figure in the world is the figure in its atlas.
//
// Variant knobs: which accessory meshes to show (loadout), weapons parented onto hand bones, code-built props for a hand
// slot and swatch repaints (props.js: the cleric's mace and vestments), a CSS-filter texture recolour (enemy NPCs reuse
// hero models), glowing-eye colour, and stock vs HEROIC proportions. Heroic = a smaller head and joints pushed outward to
// lengthen legs, arms and torso without thickening them; applied AFTER each pose is sampled, because the clips key scale
// and translation on every bone.
//
// Gotcha: GLTFLoader strips '.' from node names ('handslot.r' → 'handslotr', 'lowerleg.l' → 'lowerlegl'); findNode()
// and applyHeroic() match both spellings.
import * as THREE from 'three';
import { PROPS, repaint } from './props.js';
import { buildFace } from './faces.js';
import { buildBody } from './body.js';
import { buildCreature, applyFit } from './creatures.js';
import { dressGear } from './gear.js';

// every toggleable accessory per model (anything not listed in a variant's `show` is hidden)
export const ACC = {
  Knight: ['1H_Sword_Offhand', 'Badge_Shield', 'Rectangle_Shield', 'Round_Shield', 'Spike_Shield', '1H_Sword', '2H_Sword', 'Knight_Helmet', 'Knight_Cape'],
  Barbarian: ['1H_Axe_Offhand', 'Barbarian_Round_Shield', '1H_Axe', '2H_Axe', 'Mug', 'Barbarian_Hat', 'Barbarian_Cape'],
  Rogue: ['Knife_Offhand', '1H_Crossbow', '2H_Crossbow', 'Knife', 'Throwable', 'Rogue_Cape'],
  Rogue_Hooded: ['Knife_Offhand', '1H_Crossbow', '2H_Crossbow', 'Knife', 'Throwable', 'Rogue_Cape'],
  Mage: ['Spellbook', 'Spellbook_open', '1H_Wand', '2H_Staff', 'Mage_Hat', 'Mage_Cape'],
};
// "heroic" proportions: shrink the head, push joints outward to lengthen limbs/torso (moving a child joint along its
// parent lengthens the segment without thickening it). The head's scale is the bake's knob (BAKE_HEAD: setHeroicHead).
export const HEROIC = { scale: { head: 0.62 }, reach: { spine: 1.2, chest: 1.18, head: 1.1, lowerleg: 1.5, foot: 1.45, lowerarm: 1.3, wrist: 1.3 } };
/** @param {number} k */
export const setHeroicHead = (k) => { HEROIC.scale.head = k; };
export function applyHeroic(root) {
  root.traverse((b) => { if (!b.isBone) return;
    const base = b.name.replace(/\.?(l|r)$/, '');   // three sanitizes 'lowerleg.l' → 'lowerlegl'
    if (HEROIC.scale[base]) b.scale.multiplyScalar(HEROIC.scale[base]);
    if (HEROIC.reach[base]) b.position.multiplyScalar(HEROIC.reach[base]); });
}
// pixels per world unit: the figure, props and all, fills `px`. A variant with `height` (art pass 8: the townsfolk, so
// they aren't all one size) is fitted by its body alone, held things left out (a sword or a book raised overhead shrank
// the person under it), to px × height.
const HELD = /Sword|Axe|Shield|Crossbow|Knife|Throwable|Spellbook|Wand|Staff|Mug/;
/** @returns {{ box: THREE.Box3, ppu: number }} */
export function fitPpu(root, v, px) {
  if (!v.height) { const box = new THREE.Box3().setFromObject(root); return { box, ppu: px / (box.max.y - box.min.y) }; }
  const box = new THREE.Box3(), held = (o) => { for (let q = o; q; q = q.parent) if (q.userData.held || (q !== o && HELD.test(q.name)) || HELD.test(o.name)) return true; return false; };
  root.updateMatrixWorld(true); root.traverse((o) => { if (o.isMesh && o.visible && !held(o)) box.expandByObject(o); });
  return { box, ppu: px * v.height / (box.max.y - box.min.y) };
}
// GLTFLoader strips '.' from node names; match either spelling
export const findNode = (root, n) => root.getObjectByName(n) || root.getObjectByName(n.replace(/\./g, ''));
function recolor(root, filter) {
  const done = new Map();
  root.traverse((o) => { if (!o.isMesh || /Eyes/.test(o.name) || !o.material.map) return;
    let m = done.get(o.material);
    if (!m) { const img = o.material.map.image, cv = document.createElement('canvas');
      cv.width = img.width; cv.height = img.height; const x = cv.getContext('2d'); x.filter = filter; x.drawImage(img, 0, 0);
      const t = new THREE.CanvasTexture(cv); t.flipY = o.material.map.flipY; t.colorSpace = o.material.map.colorSpace;
      t.magFilter = o.material.map.magFilter; t.minFilter = o.material.map.minFilter; t.wrapS = o.material.map.wrapS; t.wrapT = o.material.map.wrapT;
      m = o.material.clone(); m.map = t; done.set(o.material, m); }
    o.material = m; });
}
// A member's own look (GDD §6.1 v1.65, src/sim/appearance.js `appearance`): its face's parts laid over the variant's face
// (so a hood stays a hood), its build as the figure's girth (the root wider in x and z, the head kept to its own width,
// a broad one's shoulders out) and its height as its stature. Scales on the whole and on KayKit's own bones only, so
// every clip and every model's kit still fits.
export const BUILDS = { thin: { w: 0.9, arm: 0.97 }, normal: { w: 1, arm: 1 }, broad: { w: 1.08, arm: 1.12 }, heavy: { w: 1.17, arm: 1.07 } };
export const HEIGHTS = { short: 0.94, average: 1, tall: 1.06 };
const FACE_PARTS = ['shape', 'skin', 'eyes', 'iris', 'brows', 'nose', 'mouth', 'ears', 'hair', 'hairColor', 'beard', 'marks', 'frame', 'expression'];
/** the figure's girth and stature for an appearance (none: as built) @param {any} a */
export function lookScale(a) { const b = (a && BUILDS[a.build]) || BUILDS.normal; return { w: b.w, h: (a && HEIGHTS[a.height]) || 1, arm: b.arm }; }
/** the build on the bones, after each pose: the head back to its own width, the shoulders out @param {THREE.Object3D} root @param {{ w: number, arm: number }} L */
export function applyLook(root, L) {
  if (L.w === 1 && L.arm === 1) return;
  root.traverse((b) => { if (!b.isBone) return; const base = b.name.replace(/\.?(l|r)$/, '');
    if (base === 'head') { b.scale.x /= L.w; b.scale.z /= L.w; }
    else if (base === 'upperarm') b.position.x *= L.arm; });
}
/** faces.json presets (faces.js): a variant's `face` is a preset name or an inline face @param {() => Promise<any>} faces the presets */
export async function facePreset(f, faces) {
  if (typeof f !== 'string') return f;
  const table = await faces(); if (!table[f]) throw new Error(`no face preset "${f}"`); return table[f];
}
/**
 * the variant built: its model with the loadout shown, its face, weapons, props, repaints and eyes
 * @param {any} v a variant (variants.json)
 * @param {{ far?: boolean, load: (url: string) => Promise<any>, faces: () => Promise<any> }} o  load: a GLTF loader taking
 *   `./models/<file>` (the bake's paths; the game maps them to its assets); faces: the presets
 * @returns {Promise<{ root: THREE.Object3D, mixer: THREE.AnimationMixer, clips: THREE.AnimationClip[], frame: any }>}
 */
export async function build(v, o) {
  if (v.creature) return buildCreature(v.creature, o.load);   // a beast KayKit has no model for, built in code (creatures.js, docs/creatures-proposal.md); a humanoid on KayKit's rig
  const { far = false, load, lod = 'full' } = o, g = await load(`./models/${v.model}.glb`), root = g.scene;
  const acc = ACC[v.model] || [];
  root.traverse((m) => { if (m.isMesh) { m.frustumCulled = false; if (acc.includes(m.name) && !(v.show || []).includes(m.name)) m.visible = false; } });
  if (v.body) {                                          // mock-up: our own body, clothes and head on the KayKit rig (body.js)
    const b = { ...v.body, face: await facePreset(v.body.face, o.faces) };
    if (v.body.shape) b.face = { ...b.face, shape: v.body.shape };
    await buildBody(load, root, b, { far, findNode });
  } else if (v.face || v.appearance) {                   // a modular face replaces the KayKit head (faces.js); a member's own parts over it
    const f0 = v.face ? await facePreset(v.face, o.faces) : {}, f = v.appearance ? { ...f0, ...Object.fromEntries(FACE_PARTS.map((k) => [k, v.appearance[k]])) } : f0;
    const { head, replaces } = await buildFace(load, v.model, f, { far, lod });
    root.traverse((m) => { if (m.isMesh && replaces.includes(m.name)) m.visible = false; });
    findNode(root, 'head').add(head);
  }
  for (const [bone, file] of Object.entries(v.attach || {})) { const w = await load(`./models/${file}`); findNode(root, bone)?.add(w.scene); }
  for (const [bone, name] of Object.entries(v.hold || {})) { const p = PROPS[name](); p.position.y = 0.033; p.userData.held = true; findNode(root, bone)?.add(p); }   // sits like the kits' 1H weapons
  for (const [bone, name] of Object.entries(v.wear || {})) findNode(root, bone)?.add(PROPS[name]());   // worn on a body bone (the smith's apron)
  for (const n of v.hide || []) root.traverse((m) => { if (m.name === n) m.visible = false; });   // a kit mesh left off (the minion's cloak: skeleton-skull proposal)
  // a skeleton's skull (skeleton-skull proposal): its eyes, cranium and jaw tagged for the part pass, so albSkull can
  // draw the sockets the 4 × 4 average washed into the bone (the face kit's tags: eye red, skull as skin, jaw as hair)
  if (v.skull) root.traverse((m) => { if (!m.isMesh) return; if (/_Eyes$/.test(m.name)) m.userData.part = 'eye'; else if (/_Head$/.test(m.name)) m.userData.part = 'skin'; else if (/_Jaw$/.test(m.name)) m.userData.part = 'hair'; });
  if (v.gear) await dressGear(root, v.gear, load, findNode, v);   // what a member has equipped, worn (gear.js: GDD v1.65)
  if (v.swatches) repaint(root, v.swatches);
  if (v.recolor) recolor(root, v.recolor);
  if (v.eyes) root.traverse((m) => { if (m.isMesh && /Eyes/.test(m.name)) { m.material = m.material.clone(); m.material.emissive = new THREE.Color(v.eyes); m.material.emissiveIntensity = 3; } });
  return { root, mixer: new THREE.AnimationMixer(root), clips: g.animations, frame: v.frame || null, look: v.appearance ? lookScale(v.appearance) : null };
}
// a variant's own frame (M8, the fen ghoul; `body` is the body-kit mock-up's): `frame: { reach: { bone: k }, scale: { bone: k }, bend: { bone: [x, y, z] } }`,
// after the heroic pass: reach lengthens a segment as the heroic pass does, scale grows a bone (and what hangs off it),
// bend turns a bone by radians on top of the clip's pose (a hunch: the spine and chest bowed forward)
export function applyFrame(root, body) {
  root.traverse((b) => { if (!b.isBone) return;
    const base = b.name.replace(/\.?(l|r)$/, '');
    if (body.scale && body.scale[base]) b.scale.multiplyScalar(body.scale[base]);
    if (body.reach && body.reach[base]) b.position.multiplyScalar(body.reach[base]);
    if (body.bend && body.bend[base]) { const [x, y, z] = body.bend[base]; b.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z))); } });
}
/** the figure at `t` (0..1) through a clip (Idle if it hasn't the clip), heroic or stock @param {{ root: THREE.Object3D, mixer: THREE.AnimationMixer, clips: THREE.AnimationClip[], frame: any }} c */
export function pose(c, clipName, t, heroic) {
  c.mixer.stopAllAction();
  const clip = c.clips.find((a) => a.name === clipName) || c.clips.find((a) => a.name === 'Idle');
  c.mixer.clipAction(clip).play(); c.mixer.setTime(t * clip.duration);
  if (c.creature) applyFit(c.root);                      // (a creature on KayKit's rig: the clip's pose on its own joints)
  if (heroic && !c.creature) applyHeroic(c.root);        // after sampling: clips key scale+translation (a creature's own proportions: no man's)
  if (heroic && c.frame) applyFrame(c.root, c.frame);
  if (heroic && c.look && !c.creature) applyLook(c.root, c.look);   // (a member's build: GDD v1.65)
  c.root.updateMatrixWorld(true);
  plumb(c.root);
}
// carried things hang plumb (art pass 6): a lantern, a basket or a hammer held at the side hangs from
// the grip whatever the hand's angle, where a rigid prop stuck out like a pole. A prop with
// userData.hang turns, every sampled pose, so its +y points straight down (a prop built along −y, the
// whip, stands upright); it keeps the figure's yaw so it faces the way they do. hang: 'up' (art pass 9) stands it
// on end instead: a staff carried upright, its head above the hand, where the rest pose held it head-down.
const _q = new THREE.Quaternion(), _qp = new THREE.Quaternion(), _down = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI), _y = new THREE.Vector3(0, 1, 0);
export function plumb(root) {
  const hung = []; root.traverse((o) => { if (o.userData.hang) hung.push(o); });
  if (!hung.length) return;
  const yaw = new THREE.Quaternion().setFromAxisAngle(_y, root.rotation.y);
  for (const o of hung) {
    o.parent.getWorldQuaternion(_qp);
    _q.copy(yaw); if (o.userData.hang !== 'up') _q.multiply(_down);
    o.quaternion.copy(_qp.invert().multiply(_q));
  }
  root.updateMatrixWorld(true);
}

// ── compact: the figure in as few draws as it can be (the game's renderer: one figure was 30 meshes, most of them its
// face's parts, and each a draw and a shadow draw; a town square of twenty, a thousand) ─────────────────────────────
// Once, on a built figure at rest: its skinned parts that share a material become one skinned mesh; on each bone, the
// rigid parts become one mesh a kind: the untextured lit ones (a face's skin, eyes, brows, mouth, beard) by vertex
// colour, the textured ones by their texture, the unlit ones (an eye's glint) by vertex colour. Left as they are: what
// moves or glows on its own (a prop that hangs plumb, a lantern's glass, the skeletons' eyes) and what isn't shown.
// The look is the same; the draws are fewer.
const _m = new THREE.Matrix4();
function geoFor(o, toBone, withUv, colour) {
  let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  if (!g.attributes.normal) g.computeVertexNormals();
  if (!withUv && g.attributes.uv) g.deleteAttribute('uv');
  if (withUv && !g.attributes.uv) return null;
  g.applyMatrix4(toBone);
  if (colour) { const n = g.attributes.position.count, c = new Float32Array(n * 3), col = o.material.color || new THREE.Color(1, 1, 1); for (let i = 0; i < n; i++) { c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b; } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); }
  return g;
}
/** @param {THREE.Object3D} root a built figure at rest @param {(geos: THREE.BufferGeometry[]) => THREE.BufferGeometry | null} merge BufferGeometryUtils.mergeGeometries @returns {{ before: number, after: number }} */
export function compact(root, merge) {
  root.updateMatrixWorld(true);
  const shown = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const fixed = (o) => { for (let q = o; q && !q.isBone; q = q.parent) if (q.userData.hang || q.userData.glow) return false; return !/Eyes/.test(o.name); };
  const meshes = []; root.traverse((o) => { if (o.isMesh) meshes.push(o); });
  const before = meshes.filter(shown).length;
  for (const o of meshes) if (!shown(o)) o.parent?.remove(o);   // (the loadout's hidden kit: never drawn)
  // the skinned parts, by texture (or material) and bones: KayKit's parts each have a material of their own, one texture,
  // and the loader a skeleton object each, on the same bones
  const skins = new Map();
  for (const o of meshes) if (o.isSkinnedMesh && shown(o) && o.parent) { const k = `${o.material.map ? o.material.map.uuid : o.material.uuid}|${o.material.type}|${o.skeleton.bones.map((b) => b.uuid).join(',')}`; (skins.get(k) || skins.set(k, []).get(k)).push(o); }
  for (const list of skins.values()) {
    if (list.length < 2 || list.some((o) => !o.bindMatrix.equals(list[0].bindMatrix) || !o.matrix.equals(list[0].matrix))) continue;
    const geos = list.map((o) => { const g = o.geometry.clone(); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'skinIndex', 'skinWeight'].includes(k)) g.deleteAttribute(k); return g; });
    const g = merge(geos); if (!g) continue;
    const m = new THREE.SkinnedMesh(g, list[0].material); m.castShadow = list[0].castShadow; m.name = list.map((o) => o.name).join('+');
    (root.userData.ownGeos ||= []).push(g);                     // (its own: let go with the figure's template, world.js)
    m.position.copy(list[0].position); m.quaternion.copy(list[0].quaternion); m.scale.copy(list[0].scale); m.frustumCulled = false;
    list[0].parent.add(m); m.bind(list[0].skeleton, list[0].bindMatrix);
    for (const o of list) o.parent.remove(o);
  }
  // the rigid parts, by bone and kind
  const groups = new Map();
  for (const o of meshes) {
    if (o.isSkinnedMesh || !o.parent || !shown(o) || !fixed(o)) continue;
    let bone = o.parent; while (bone && !bone.isBone && bone !== root) bone = bone.parent;
    if (!bone) continue;
    const mat = o.material, kind = mat.map ? `map|${mat.map.uuid}|${mat.type}` : mat.isMeshBasicMaterial ? 'basic' : mat.isMeshStandardMaterial ? 'lit' : null;
    if (!kind) continue;
    const k = `${bone.uuid}|${kind}`; if (!groups.has(k)) groups.set(k, { bone, kind, list: [] }); groups.get(k).list.push(o);
  }
  for (const { bone, kind, list } of groups.values()) {
    if (list.length < 2 && kind.startsWith('map')) continue;
    const inv = _m.copy(bone.matrixWorld).invert(), textured = kind.startsWith('map');
    const geos = list.map((o) => geoFor(o, new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld), textured, !textured));
    if (geos.some((g) => !g)) continue;
    const g = merge(geos); if (!g) continue;
    const src = list[0].material;
    const mat = textured ? src.clone() : kind === 'basic' ? new THREE.MeshBasicMaterial({ vertexColors: true, transparent: src.transparent, opacity: src.opacity })
      : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: src.roughness ?? 1, metalness: src.metalness ?? 0 });
    const m = new THREE.Mesh(g, mat); m.name = `${bone.name}:${kind.split('|')[0]}`; m.frustumCulled = false;
    if (list.some((o) => o.userData.face)) m.userData.face = true;   // (the head's parts merged: still the head, world.js's shadow pass)
    (root.userData.ownGeos ||= []).push(g);
    bone.add(m);
    for (const o of list) o.parent.remove(o);
  }
  let after = 0; root.traverse((o) => { if (o.isMesh && shown(o)) after++; });
  return { before, after };
}
