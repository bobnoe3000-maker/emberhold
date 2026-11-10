// gear.js — what a member has equipped, worn on their figure (docs/character-look-plan.md §6–7; the owner, 2026-11-10:
// "characters should show what they have equipped… gear should have more variability - color, shimmering/lighting/
// glowing - that better indicates rarity or different types"). Shared, as figure.js is, by the bake and the game's
// Luminati renderer (world.js, and its preview).
//
// A variant's `gear` ({ weapon, off, helm }: each { base, r, up } or null, src/sim/items.js's) takes the place of the
// variant's own piece on that bone: the weapon in the right hand, the off-hand in the left, the helm on the head (the
// face's hair under it). A slot left out of `gear` keeps the variant's own; a null one is empty. Each base is a piece
// KayKit has (on any of the Adventurers: one skeleton, one set of hand slots, so a knight can hold a barbarian's axe), a
// skeleton's weapon (its own file) or one of ours (props.js). Armour and boots stay the model's own body for now (§6).
//
// The look by what it is (§7), from fields the item already has: nothing new saved, nothing drawn:
//   · common: the piece as made; fine: a little brighter;
//   · rare: a faint light of the rarity's own colour that breathes (the word is on the card as well, never the colour alone);
//   · heirloom: a warm glow of its own, breathing too;
//   · the smith's +1…+5: a little more light each step, warm, up to a rare's at +5.
// Kept dusky: under the figure's own light, the world's bloom carrying the heirloom's. A piece with a light keeps a
// material of its own (userData.glow: compact leaves it out, world.js doesn't relight it): one draw more, no more.
import * as THREE from 'three';
import { PROPS } from './props.js';

/** where each base hangs and what it is: mesh: [model, node] in assets/models, file: a skeleton's weapon, prop: props.js */
export const GEAR = {
  // the fighter's
  sword: { mesh: ['Knight', '1H_Sword'] }, axe: { mesh: ['Barbarian', '1H_Axe'] }, greatsword: { mesh: ['Knight', '2H_Sword'] }, greataxe: { mesh: ['Barbarian', '2H_Axe'] },
  falx: { file: 'Skeleton_Blade.gltf' }, cleaver: { file: 'Skeleton_Axe.gltf' },
  roundshield: { mesh: ['Knight', 'Round_Shield'] }, kite: { mesh: ['Knight', 'Badge_Shield'] }, tower: { mesh: ['Knight', 'Rectangle_Shield'] },
  spiked: { mesh: ['Knight', 'Spike_Shield'] }, targe: { mesh: ['Barbarian', 'Barbarian_Round_Shield'] }, bonebuckler: { file: 'Skeleton_Shield_Small_A.gltf' },
  greathelm: { mesh: ['Knight', 'Knight_Helmet'] }, furhood: { mesh: ['Barbarian', 'Barbarian_Hat'] },
  // the rogue's (a bow is a figure of its own, the bake's: hero_rogue_bow…; here its prop)
  dagger: { mesh: ['Rogue', 'Knife'] }, handbow: { mesh: ['Rogue', '1H_Crossbow'] }, heavybow: { mesh: ['Rogue', '2H_Crossbow'] }, bonebow: { file: 'Skeleton_Crossbow.gltf' },
  huntbow: { prop: 'huntbow' }, longbow: { prop: 'longbow' }, offdagger: { mesh: ['Rogue', 'Knife_Offhand'] },
  hood: { keep: true },                                       // (the hood is the hooded rogue's own head: worn as it is)
  // the mage's
  wand: { mesh: ['Mage', '1H_Wand'] }, staff: { mesh: ['Mage', '2H_Staff'] }, bonestaff: { file: 'Skeleton_Staff.gltf' }, tome: { mesh: ['Mage', 'Spellbook'] },
  witchhat: { mesh: ['Mage', 'Mage_Hat'] },
  // the cleric's and the shaman's (pieces of their own to come: §8; until then the nearest)
  mace: { prop: 'mace' }, chapelsword: { mesh: ['Knight', '1H_Sword'] }, psalter: { prop: 'book' }, hours: { mesh: ['Mage', 'Spellbook'] },
  spiritstaff: { mesh: ['Mage', '2H_Staff'] }, antlerrod: { mesh: ['Mage', '1H_Wand'] }, fetish: { keep: true }, hidecowl: { keep: true },
};
const SLOT_BONE = { weapon: 'handslot.r', off: 'handslot.l', helm: 'head' };
/** the light each rarity gives its piece: [colour, intensity] (heirloom the most; fine and common none) */
export const RARITY_LIGHT = { common: null, fine: null, rare: ['#5aa8ff', 0.14], heirloom: ['#f2a33c', 0.3] };   // (rare 0.2 drowned a helm in blue at a dungeon's dusk)
const UP_LIGHT = '#ffd28a', UP_STEP = 0.03;

const pieces = new Map();                                   // [model, node] → the node, once (its copies share its geometry)
async function pieceOf(G, load) {
  if (G.prop) { const p = PROPS[G.prop](); p.position.y = 0.033; p.userData.held = true; return p; }   // (sits like the kits' 1H weapons)
  if (G.file) return (await load(`./models/${G.file}`)).scene;
  const k = G.mesh.join('/'); let n = pieces.get(k);
  if (!n) { n = load(`./models/${G.mesh[0]}.glb`).then((g) => g.scene.getObjectByName(G.mesh[1]) || null); pieces.set(k, n); }
  const src = await n; if (!src) return null;
  const c = src.clone(); c.visible = true; c.position.copy(src.position); c.quaternion.copy(src.quaternion); c.scale.copy(src.scale);
  return c;
}
/** an item's look on its piece: brighter for fine, a light of the rarity's colour for rare and heirloom, a warm edge per
 * smith's step @param {THREE.Object3D} piece @param {{ r?: string, up?: number }} it */
export function lookOn(piece, it) {
  const L = RARITY_LIGHT[it.r] || null, up = Math.max(0, Math.min(5, it.up || 0));
  if (!L && !up && it.r !== 'fine') return;
  piece.traverse((o) => {
    if (!o.isMesh || !o.material) return;
    const m = o.material = o.material.clone();
    if (it.r === 'fine' && m.color) m.color.multiplyScalar(1.1);
    if ((L || up) && m.emissive) {
      const c = new THREE.Color(L ? L[0] : UP_LIGHT), k = (L ? L[1] : 0) + up * UP_STEP;
      if (L && up) c.lerp(new THREE.Color(UP_LIGHT), 0.25);
      m.emissive = c; m.emissiveIntensity = k; m.emissiveMap = null;     // (an even light of its colour over the piece: through the texture it was lost on a dark one)
      if (L) m.userData.shine = k;                                       // (rare and heirloom shimmer: world.js and the preview breathe it, ±25 %)
      o.userData.glow = true;
    }
  });
}
/** a key for what's worn (a template a look: world.js) @param {any} gear */
export const gearKey = (gear) => !gear ? '' : Object.keys(SLOT_BONE).map((s) => (s in gear ? (gear[s] ? `${gear[s].base}.${gear[s].r || 'common'}.${gear[s].up || 0}` : '-') : '')).join('|');

/** dress the figure in its gear: each slot given, the variant's own piece on that bone off and the gear's on
 * @param {THREE.Object3D} root @param {any} gear @param {(u: string) => Promise<any>} load @param {(r: THREE.Object3D, n: string) => THREE.Object3D|undefined} findNode */
export async function dressGear(root, gear, load, findNode) {
  for (const [slot, bone] of Object.entries(SLOT_BONE)) {
    if (!(slot in gear)) continue;
    const it = gear[slot], G = it && GEAR[it.base];
    if (G && G.keep) continue;                               // (worn as the model is: the hood, the cowl, a fetish)
    const B = findNode(root, bone); if (!B) continue;
    for (const c of B.children) if (!c.userData.face && c.name !== 'Face') c.visible = false;   // the variant's own piece off (the face stays)
    if (slot === 'helm') { const hair = root.getObjectByName('Hair'); if (hair && G) hair.visible = false; }   // (the hair under a helm)
    if (!G) continue;
    const p = await pieceOf(G, load); if (!p) continue;
    lookOn(p, it); B.add(p);
  }
}
