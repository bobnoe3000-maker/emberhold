// gear.js — what a member has equipped, worn on their figure (docs/character-look-plan.md §6–7; the owner, 2026-11-10:
// "characters should show what they have equipped… gear should have more variability - color, shimmering/lighting/
// glowing - that better indicates rarity or different types"). Shared, as figure.js is, by the bake and the game's
// Luminati renderer (world.js, and its preview).
//
// A variant's `gear` ({ weapon, off, helm }: each { base, r, up } or null, src/sim/items.js's) takes the place of the
// variant's own piece on that bone: the weapon in the right hand, the off-hand in the left, the helm on the head (the
// face's hair under it). A slot left out of `gear` keeps the variant's own; a null one is empty. Each base is a piece
// KayKit has (on any of the Adventurers: one skeleton, one set of hand slots, so a knight can hold a barbarian's axe), a
// skeleton's weapon (its own file) or one of ours (props.js).
// Armour and boots (§6, the owner, 2026-11-10: "do the armour and boots on the body next"): the Adventurers share one
// skeleton, 41 joints in one order, so any kit's body is bound to any figure's bones. Armour is the torso and arms of
// the kit it's made like (plate the Knight's, fur the Barbarian's, leathers the Rogue's, robes the Mage's; the cleric's
// vestments and the shaman's hide the Mage's in their own colours), boots the legs. A piece the figure already wears in
// its own colours (the class's own kit) is left as built, so every class's look is as it was until it changes clothes.
//
// The look by what it is (§7), from fields the item already has: nothing new saved, nothing drawn. Never a colour of
// its own (the owner, 2026-11-10: "gear doesn't need to be a different color… the rarer an item, there is a faint to
// slightly stronger glow"): the piece in its own colours, lit a little from within (RARITY_GLOW):
//   · common: as made; fine: a faint glow; rare: a little more; heirloom: the most, and a slight pulse;
//   · the smith's +1…+5: a little more each step.
// The rarity's colour is the bag's and the card's (the slot's border and its glow, and the word). Kept dusky: in play
// the glow is added over the figure's own fill, so a lit piece is never darker than the rest. A piece with a light keeps
// a material of its own (userData.glow: compact leaves it out): one draw more, no more.
import * as THREE from 'three';
import { PROPS, repaint } from './props.js';
const repaintOne = (m, list) => repaint(m, list);

/** where each base hangs and what it is: mesh: [model, node] in assets/models, file: a skeleton's weapon, prop: props.js */
export const GEAR = {
  // the fighter's
  sword: { mesh: ['Knight', '1H_Sword'] }, axe: { mesh: ['Barbarian', '1H_Axe'] }, greatsword: { mesh: ['Knight', '2H_Sword'] }, greataxe: { mesh: ['Barbarian', '2H_Axe'] },
  falx: { file: 'Skeleton_Blade.gltf' }, cleaver: { file: 'Skeleton_Axe.gltf' },
  roundshield: { mesh: ['Knight', 'Round_Shield'] }, kite: { mesh: ['Knight', 'Badge_Shield'] }, tower: { mesh: ['Knight', 'Rectangle_Shield'] },
  spiked: { mesh: ['Knight', 'Spike_Shield'] }, targe: { mesh: ['Barbarian', 'Barbarian_Round_Shield'] }, bonebuckler: { file: 'Skeleton_Shield_Small_A.gltf' },
  greathelm: { mesh: ['Knight', 'Knight_Helmet'] }, furhood: { mesh: ['Barbarian', 'Barbarian_Hat'] },
  // the rogue's (a bow is a figure of its own, the bake's: hero_rogue_bow…; here its prop)
  dagger: { mesh: ['Rogue', 'Knife'] }, handbow: { mesh: ['Rogue', '1H_Crossbow'], quiver: 'boltcase' }, heavybow: { mesh: ['Rogue', '2H_Crossbow'], quiver: 'boltcase' }, bonebow: { file: 'Skeleton_Crossbow.gltf', quiver: 'boltcase' },
  huntbow: { prop: 'huntbow', quiver: 'quiver' }, longbow: { prop: 'longbow', quiver: 'quiver' }, offdagger: { mesh: ['Rogue', 'Knife_Offhand'] },
  hood: { prop: 'hood', keepOn: 'Rogue_Hooded' },            // (the hooded rogue's hood is their own head: worn as it is; on any other, ours)
  // the mage's
  wand: { mesh: ['Mage', '1H_Wand'], hang: 'up', scale: 1.35 }, staff: { mesh: ['Mage', '2H_Staff'], hang: 'up', lift: 0.32 }, bonestaff: { file: 'Skeleton_Staff.gltf', hang: 'up', lift: 0.32 }, tome: { mesh: ['Mage', 'Spellbook'] },
  witchhat: { mesh: ['Mage', 'Mage_Hat'] },
  // the cleric's and the shaman's, their own (props.js; character-look-plan §8, built 2026-11-10)
  mace: { prop: 'mace' }, chapelsword: { prop: 'chapelsword' }, psalter: { prop: 'psalter' }, hours: { prop: 'hours' }, coif: { prop: 'coif' },
  spiritstaff: { prop: 'spiritstaff' }, antlerrod: { prop: 'antlerrod', hang: 'up', scale: 1.3 }, fetish: { prop: 'fetish' }, hidecowl: { prop: 'hidecowl' },
  // worn on the body: the amulet round the neck, the charm at the belt (a ring is too small to be seen)
  amulet: { prop: 'amulet', bone: 'chest' }, charm: { prop: 'charm', bone: 'hips' },
};
const SLOT_BONE = { weapon: 'handslot.r', off: 'handslot.l', helm: 'head' };
// the cleric's and the shaman's cloth (variants.json hero_cleric, hero_shaman: their own swatches, kept in step by
// test/gearlook.test.mjs), worn by whoever wears their vestments, hide and boots
const CLERIC = [{ tile: [0, 1], to: ['#f2ecdd', '#a39883'] }, { tile: [7, 1], to: ['#cfa65c', '#6a5022'] }, { tile: [2, 1], to: ['#b6bec9', '#5c6474'] }, { tile: [2, 2], to: ['#ecd07a', '#8a6424'] }, { tile: [1, 2], to: ['#8a5a3a', '#3a2016'] }];
const SHAMAN = [{ tile: [0, 1], to: ['#8a7a5e', '#2e2618'] }, { tile: [1, 1], to: ['#7a6a50', '#262016'] }, { tile: [2, 1], to: ['#6a5034', '#22160c'] }, { tile: [1, 2], to: ['#cfc3a4', '#5a5040'] }, { tile: [7, 1], to: ['#4a5a3a', '#16200e'] }, { tile: [2, 2], to: ['#4a5a3a', '#16200e'] }];
/** the body each armour and the legs each pair of boots are: a kit's parts, and the colours they're worn in */
export const BODY = {
  plate: { kit: 'Knight' }, furmail: { kit: 'Barbarian' }, leathers: { kit: 'Rogue' }, robes: { kit: 'Mage' },
  vestments: { kit: 'Mage', swatches: CLERIC }, hiderobes: { kit: 'Mage', swatches: SHAMAN },
  sabatons: { kit: 'Knight' }, furboots: { kit: 'Barbarian' }, softboots: { kit: 'Rogue' }, slippers: { kit: 'Mage' },
  pilgrimboots: { kit: 'Mage', swatches: CLERIC }, wrapboots: { kit: 'Mage', swatches: SHAMAN },
};
export const BODY_SWATCHES = { CLERIC, SHAMAN };
const PARTS = { armor: ['Body', 'ArmLeft', 'ArmRight'], boots: ['LegLeft', 'LegRight'] };
const kitOf = (model) => model.replace(/_Hooded$/, '');   // (the hooded rogue's body is the rogue's)
/** the light each rarity gives its piece, in the piece's own colours (the owner, 2026-11-10: "gear doesn't need to be a
 * different color… the rarer an item, there is a faint to slightly stronger glow"): none for common, faint for fine, a
 * little more for rare, the most for heirloom, where a slight pulse is added */
export const RARITY_GLOW = { common: 0, fine: 0.07, rare: 0.13, heirloom: 0.21 };
const SHIMMER = { heirloom: true }, UP_STEP = 0.02;   // (the owner: "heirloom is where the slight pulse is added")

const pieces = new Map();                                   // [model, node] → the node, once (its copies share its geometry)
async function pieceOf(G, load) {
  if (G.prop) { const p = PROPS[G.prop](); if (!G.bone && !G.head) { p.position.y = 0.033; p.userData.held = true; } return p; }   // (in a hand: sits like the kits' 1H weapons)
  if (G.file) return (await load(`./models/${G.file}`)).scene;
  const k = G.mesh.join('/'); let n = pieces.get(k);
  if (!n) { n = load(`./models/${G.mesh[0]}.glb`).then((g) => g.scene.getObjectByName(G.mesh[1]) || null); pieces.set(k, n); }
  const src = await n; if (!src) return null;
  const c = src.clone(); c.visible = true; c.position.copy(src.position); c.quaternion.copy(src.quaternion); c.scale.copy(src.scale);
  return c;
}
/** an item's look on its piece: its own colours, lit a little from within by its rarity and the smith's steps (never
 * tinted: the rarity's colour is the card's and the slot's, with its word) @param {THREE.Object3D} piece
 * @param {{ r?: string, up?: number }} it */
export function lookOn(piece, it) {
  const up = Math.max(0, Math.min(5, it.up || 0)), k = (RARITY_GLOW[it.r] || 0) + up * UP_STEP;
  if (!k) return;
  piece.traverse((o) => {
    if (!o.isMesh || !o.material || !o.material.emissive) return;
    const m = o.material = o.material.clone();
    if (m.map) { m.emissive = new THREE.Color(1, 1, 1); m.emissiveMap = m.map; }   // (its own texture as its light: the same colours, brighter)
    else m.emissive = (m.color || new THREE.Color(1, 1, 1)).clone();
    m.emissiveIntensity = k; m.userData.rarity = k;                  // (world.js adds it over a figure's fill, so a lit piece is never darker)
    if (SHIMMER[it.r]) m.userData.shine = k;                          // (world.js and the preview breathe it, ±25 %)
    o.userData.glow = true;
  });
}
/** a key for what's worn (a template a look: world.js) @param {any} gear */
export const gearKey = (gear) => !gear ? '' : [...Object.keys(SLOT_BONE), 'armor', 'boots', 'trinket'].map((s) => (s in gear ? (gear[s] ? `${gear[s].base}.${gear[s].r || 'common'}.${gear[s].up || 0}` : '-') : '')).join('|');

/** dress the figure in its gear: each slot given, the variant's own piece on that bone off and the gear's on
 * @param {THREE.Object3D} root @param {any} gear @param {(u: string) => Promise<any>} load @param {(r: THREE.Object3D, n: string) => THREE.Object3D|undefined} findNode */
export async function dressGear(root, gear, load, findNode, v = {}) {
  for (const slot of ['armor', 'boots']) if (slot in gear) await dressBody(root, slot, gear[slot], load, v);
  for (const [slot, bone] of Object.entries(SLOT_BONE)) {
    if (!(slot in gear)) continue;
    const it = gear[slot], G = it && GEAR[it.base];
    if (G && (G.keep || (G.keepOn && v.model === G.keepOn))) continue;   // (worn as the model is: the hooded rogue's hood)
    const B = findNode(root, bone); if (!B) continue;
    for (const c of B.children) if (!c.userData.face && c.name !== 'Face') c.visible = false;   // the variant's own piece off (the face stays)
    if (slot === 'helm') { const hair = root.getObjectByName('Hair'); if (hair && G) hair.visible = false; }   // (the hair under a helm)
    if (!G) continue;
    let p = await pieceOf(slot === 'helm' ? { ...G, head: true } : G, load); if (!p) continue;
    if (G.scale) p.scale.multiplyScalar(G.scale);            // (a wand that read as a nub at the knee: the critic's pass)
    if (G.hang) {                                            // carried upright (figure.js plumb): a staff, a wand, a rod
      const w = new THREE.Group(); w.position.copy(p.position); p.position.set(0, G.lift || 0, 0); w.add(p); w.userData.hang = G.hang; p = w;   // (lift: its foot at the soles, not through the floor)
    }
    lookOn(p, it); B.add(p);
  }
  // what's worn on the body: a trinket (the amulet at the neck, the charm at the belt), and a quiver for a bow, a bolt
  // case for a crossbow. Each its own small piece on its bone, the rarity's light on a trinket as on any piece
  const extra = [];
  if ('trinket' in gear && gear.trinket && GEAR[gear.trinket.base] && GEAR[gear.trinket.base].bone) extra.push([GEAR[gear.trinket.base], gear.trinket]);
  const W = gear.weapon && GEAR[gear.weapon.base];
  if (W && W.quiver) extra.push([{ prop: W.quiver, bone: W.quiver === 'quiver' ? 'chest' : 'hips' }, { r: 'common' }]);
  for (const [G, it] of extra) {
    const B = findNode(root, G.bone); if (!B) continue;
    const p = await pieceOf(G, load); if (!p) continue;
    lookOn(p, it); B.add(p);
  }
}

/** a body slot worn: the kit's parts bound to the figure's own skeleton in place of its own (or its own left, when it's
 * the same kit in the same colours) @param {THREE.Object3D} root @param {'armor'|'boots'} slot @param {any} it @param {(u: string) => Promise<any>} load @param {any} v the variant */
async function dressBody(root, slot, it, load, v) {
  const B = it && BODY[it.base]; if (!B || !v.model) return;
  const own = kitOf(v.model), same = B.kit === own && JSON.stringify(B.swatches || null) === JSON.stringify(v.swatches || null);
  if (same) return;
  const mine = new Map(); root.traverse((o) => { if (o.isSkinnedMesh) mine.set(o.name, o); });
  const ref = [...mine.values()][0]; if (!ref) return;
  const src = (await load(`./models/${B.kit}.glb`)).scene;
  for (const part of PARTS[slot]) {
    const theirs = src.getObjectByName(`${B.kit}_${part}`), ours = mine.get(`${own}_${part}`);
    if (!theirs || !theirs.isSkinnedMesh || !ours) continue;
    const m = new THREE.SkinnedMesh(theirs.geometry, theirs.material); m.name = theirs.name;
    m.position.copy(theirs.position); m.quaternion.copy(theirs.quaternion); m.scale.copy(theirs.scale);
    m.castShadow = ours.castShadow; m.frustumCulled = false; m.userData.foreign = true;   // (the variant's own swatches aren't for it: props.js repaint)
    ours.parent.add(m); m.bind(new THREE.Skeleton(ref.skeleton.bones, theirs.skeleton.boneInverses), theirs.bindMatrix.clone());
    ours.visible = false;
    if (B.swatches) { m.userData.foreign = false; repaintOne(m, B.swatches); m.userData.foreign = true; }
  }
}
