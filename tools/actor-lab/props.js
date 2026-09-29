// props.js — what the KayKit packs don't have, shared by the figure bake (lab.js) and the icon
// bake (iconlab.js) so the weapon in a hand and its icon are one object:
//   PROPS      small code-built meshes a variant can put in a hand slot (`hold` in variants.json)
//   swatches() repaint whole colour swatches of a KayKit texture (`swatches` in variants.json)
// Our own models, so no licence beyond the repo's.
import * as THREE from 'three';

const mat = (color, metalness, roughness) => new THREE.MeshStandardMaterial({ color, metalness, roughness });

// Each prop runs along +y from the grip (the hand slot's origin), like the kits' one-handed
// weapons (the 1H sword: −0.37 … 1.41), so the swing clips carry it the same way.
export const PROPS = {
  // a flanged mace: dark ash haft, leather grip, brass bands, an iron head of six flanges
  mace: () => {
    const g = new THREE.Group(); g.name = 'Mace';
    const wood = mat(0x4a3322, 0, 0.85), leather = mat(0x2e1f18, 0, 0.9), brass = mat(0xb8903c, 0.8, 0.35), iron = mat(0x9aa0a6, 0.85, 0.35);
    const add = (geo, m, y, name) => { const o = new THREE.Mesh(geo, m); o.position.y = y; o.name = name; g.add(o); return o; };
    add(new THREE.CylinderGeometry(0.062, 0.07, 1.02, 10), wood, 0.28, 'Mace_Haft');
    add(new THREE.CylinderGeometry(0.08, 0.08, 0.34, 10), leather, -0.02, 'Mace_Grip');
    add(new THREE.SphereGeometry(0.1, 12, 8), brass, -0.25, 'Mace_Pommel');
    for (const y of [0.17, 0.7]) add(new THREE.CylinderGeometry(0.085, 0.085, 0.06, 12), brass, y, 'Mace_Band');
    add(new THREE.CylinderGeometry(0.12, 0.1, 0.38, 12), iron, 0.92, 'Mace_Head');
    // the flanges: six pointed blades standing out from the head (a diamond profile, so the
    // silhouette is a star, not a block)
    const blade = new THREE.Shape([[0, -0.22], [0.13, -0.06], [0.14, 0.06], [0, 0.22]].map(([x, y]) => new THREE.Vector2(x, y)));
    const fg = new THREE.ExtrudeGeometry(blade, { depth: 0.05, bevelEnabled: false }); fg.translate(0, 0, -0.025);
    for (let k = 0; k < 6; k++) {
      const f = new THREE.Mesh(fg, iron), a = k * Math.PI / 3;
      f.position.set(Math.cos(a) * 0.1, 0.92, Math.sin(a) * 0.1); f.rotation.y = -a; f.name = 'Mace_Flange'; g.add(f);
    }
    add(new THREE.ConeGeometry(0.1, 0.16, 10), iron, 1.18, 'Mace_Cap');
    add(new THREE.SphereGeometry(0.065, 10, 8), brass, 1.28, 'Mace_Knop');
    return g;
  },
};

// KayKit textures are an 8 × 4 grid of gradient swatches; a mesh's colour is the swatch its UVs
// sit in. swatches(image, [{ tile: [col, row], to: [light, dark] }]) repaints each listed swatch
// between two colours by the swatch's own luminance, so its gradient and highlight stripe survive.
export function swatches(img, list) {
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const x = cv.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
  const tw = img.width / 8, th = img.height / 4, hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  for (const { tile: [c, r], to: [light, dark] } of list) {
    const d = x.getImageData(c * tw, r * th, tw, th), p = d.data, L = hex(light), D = hex(dark);
    let lo = 255, hi = 0; const lum = (i) => 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2];
    for (let i = 0; i < p.length; i += 4) { const l = lum(i); lo = Math.min(lo, l); hi = Math.max(hi, l); }
    for (let i = 0; i < p.length; i += 4) { const t = hi > lo ? (lum(i) - lo) / (hi - lo) : 1; for (let k = 0; k < 3; k++) p[i + k] = D[k] + (L[k] - D[k]) * t; }
    x.putImageData(d, c * tw, r * th);
  }
  return cv;
}

// swap every textured material under `root` for one whose map has the swatches repainted
export function repaint(root, list) {
  const done = new Map();
  root.traverse((o) => { if (!o.isMesh || !o.material.map || /Eyes/.test(o.name)) return;
    let m = done.get(o.material);
    if (!m) { const src = o.material.map, t = new THREE.CanvasTexture(swatches(src.image, list));
      t.flipY = src.flipY; t.colorSpace = src.colorSpace; t.magFilter = src.magFilter; t.minFilter = src.minFilter; t.wrapS = src.wrapS; t.wrapT = src.wrapT;
      m = o.material.clone(); m.map = t; done.set(o.material, m); }
    o.material = m; });
}
