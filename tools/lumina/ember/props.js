// props.js — Emberfall's world art standing in Luminati's world (docs/lumina-prototype.md §10). The owner: "Put them all
// into the catalog": every piece of the game's baked world art (assets/env: the env atlas and the four town sets) and
// every item icon (assets/items), in the catalogue's second wing.
//
// Luminati has no object type for a picture (its catalogue builds 3D props), so a level that wants ours carries a
// sidecar beside it, `levels/<level>.ember.json` (written by tools/lumina/levels.mjs): a list of { src, id, x, z } (where
// it stands) with each sprite's rectangle and foot in its atlas (`sx sy w h ax ay`, the atlas's own numbers), or an item
// by its name. Each one is cut from its
// atlas once its image is in and stood in the world as a Sprite3D, as our characters stand (sheets.js): turned to the
// camera, lit by Luminati's sprite lighting, at the actors' scale (32 baked pixels to a unit: our art is baked at one
// scale), its foot on the ground. An item icon is 96 px across: two units. Nothing collides with them, and no light is added
// (Luminati's lamp count is fixed).
// The art is drawn from the game's camera (30° down, turned 45°), so it lines up in Emberfall's view (view.js) and only
// there; the buildings were drawn as footprints, and standing up they're flat cut-outs (§10 says which fit).
import * as THREE from 'three';
import { Sprite3D } from '../src/engine/sprite/Sprite3D.js';
import { PROP_LEVELS } from './actors.js';

const ASSETS = new URL('../assets/', document.baseURI).href;
const PPU = 32, ITEM_PX = 48;                                // (an icon 96 px across: two units, easy to see by a hero)
// (as Luminati lights its villagers, config.js CHARACTER_SPRITE_OPTS, a little flatter and with a little more of its warm
// fill: our art was baked to be relit by its normals, which aren't used here, and reads dark without)
const OPTS = { normalUp: 0.6, wrap: 0.6, roundness: 0.35, emissive: '#ffe9d2', emissiveIntensity: 0.12 };

const images = new Map();
function image(url) {
  let p = images.get(url);
  if (!p) { p = new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = url; }); images.set(url, p); }
  return p;
}
/** one picture cut from its image into a canvas texture, and the sheet Sprite3D plays (one frame) */
function sheetOf(img, r, ppu, label) {
  const c = document.createElement('canvas'); c.width = r.w; c.height = r.h;
  const g = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d')); g.imageSmoothingEnabled = false;
  g.drawImage(img, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
  const tex = new THREE.CanvasTexture(c);
  tex.name = label; tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return { texture: tex, frameWidth: r.w, frameHeight: r.h, columns: 1, rows: 1, pixelsPerUnit: ppu, anchor: [r.ax / r.w, 1 - r.ay / r.h],
    animations: { idle_down: { frames: [{ col: 0, row: 0 }], fps: 1, loop: false } }, name: label, dispose() { tex.dispose(); } };
}

const placed = [];
let level = null, yaw = NaN;
async function load(G) {
  const slug = new URLSearchParams(location.search).get('level');
  if (!slug || !PROP_LEVELS.includes(slug)) return;          // (the build lists the levels with a sidecar: no 404 for the others)
  let list;
  try { const r = await fetch(`levels/${slug}.ember.json`); if (!r.ok) return; list = await r.json(); } catch { return; }
  const scene = G.engine.scene, tm = G.tileMap;
  for (const p of list.sprites || []) {
    try {
      const item = p.src === 'item', img = await image(item ? `${ASSETS}items/${p.id}.png` : `${ASSETS}env/${p.src}.alb.png`);
      const r = item ? { x: 0, y: 0, w: img.width, h: img.height, ax: img.width / 2, ay: img.height } : { x: p.sx, y: p.sy, w: p.w, h: p.h, ax: p.ax, ay: p.ay };
      const s = new Sprite3D(sheetOf(img, r, item ? ITEM_PX : PPU, `emberfall:${p.src}:${p.id}`), { ...OPTS });
      s.name = `ember:${p.src}:${p.id}`;
      s.position.set(p.x, tm.getHeight(p.x, p.z), p.z);
      scene.add(s);
      placed.push(s);
    } catch (err) { console.warn(`[ember] ${p.src}/${p.id}:`, err); }
  }
  yaw = NaN;
}
// (turned to the camera when it turns: Q / E, a framing; Sprite3D.update orients the billboard and its shadow card)
function frame() {
  const G = /** @type {any} */ (window).__game;
  if (G?.world?.level && G.world.level !== level) { level = G.world.level; load(G); }
  const cam = G?.engine?.camera, y = G?.rig?.yaw;
  if (cam && placed.length && y !== yaw) { yaw = y; for (const s of placed) s.update(0, cam); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
/** (for checks) */
Object.assign(globalThis, { __emberProps: { get placed() { return placed.length; }, get ids() { return placed.map((s) => s.name.slice(6)); } } });
