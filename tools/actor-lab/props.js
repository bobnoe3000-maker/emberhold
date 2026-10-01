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
  // (body mock-up: our own weapons in the kits' slot conventions — +y from the grip, a blade's
  // flat facing ±z, a shield's face +z — so the KayKit clips carry them as they do the kits')
  sword: () => {
    const g = new THREE.Group(); g.name = 'Sword';
    const steel = mat(0xc8ccd2, 0.9, 0.3), brass = mat(0xb8903c, 0.8, 0.35), leather = mat(0x3a2418, 0, 0.9);
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.1, 1.2, 4, 1), steel); blade.scale.set(1, 1, 0.3); blade.rotation.y = Math.PI / 4; blade.position.y = 0.78; blade.name = 'Sword_Blade'; g.add(blade);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.1), brass); guard.position.y = 0.16; g.add(guard);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.3, 8), leather); grip.position.y = 0; g.add(grip);
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), brass); pom.position.y = -0.2; g.add(pom);
    return g;
  },
  dagger: () => {
    const g = new THREE.Group(); g.name = 'Dagger';
    const steel = mat(0xc0c4ca, 0.9, 0.3), dark = mat(0x2a2020, 0.2, 0.7);
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.07, 0.62, 4, 1), steel); blade.scale.set(1, 1, 0.3); blade.rotation.y = Math.PI / 4; blade.position.y = 0.45; g.add(blade);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.05, 0.08), dark); guard.position.y = 0.12; g.add(guard);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.24, 8), dark); g.add(grip);
    return g;
  },
  staff: () => {
    const g = new THREE.Group(); g.name = 'Staff';
    const wood = mat(0x5a3a22, 0, 0.85), brass = mat(0xb8903c, 0.8, 0.35), orb = new THREE.MeshStandardMaterial({ color: 0x7ad0ff, emissive: 0x2a7ab0, emissiveIntensity: 1.2, roughness: 0.2 });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.1, 8), wood); shaft.position.y = 0.2; g.add(shaft);
    for (const y of [1.18, -0.8]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 10), brass); b.position.y = y; g.add(b); }
    const claw = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 6, 12), brass); claw.position.y = 1.36; g.add(claw);
    const o = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 1), orb); o.position.y = 1.36; g.add(o);
    return g;
  },
  shield: () => {
    const g = new THREE.Group(); g.name = 'Shield';
    const wood = mat(0x7a2e22, 0, 0.8), iron = mat(0x9aa0a6, 0.85, 0.35), brass = mat(0xc89a40, 0.8, 0.35);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 20), wood); face.rotation.x = Math.PI / 2; face.position.z = 0.16; g.add(face);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 6, 24), iron); rim.position.z = 0.2; g.add(rim);
    const boss = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), brass); boss.rotation.x = Math.PI / 2; boss.position.z = 0.2; g.add(boss);
    return g;
  },
  book: () => {
    const g = new THREE.Group(); g.name = 'Book';
    const cover = mat(0x5a2020, 0, 0.8), pages = mat(0xe8dcc0, 0, 0.9), brass = mat(0xc89a40, 0.8, 0.35);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.46), cover); b.position.y = 0.27; g.add(b);
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.47), pages); p.position.y = 0.27; p.position.x = 0.012; g.add(p);
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.08, 0.08), brass); c.position.set(0, 0.27, 0.2); g.add(c);
    return g;
  },
  // the Standard of the Third Legion (world doc §10.2): a tall pole, a crossbar, a legion-red banner
  // gone to tatters and an ember-gold boss at its heart, a bronze finial on top. Held like a spear.
  standard: () => {
    const g = new THREE.Group(); g.name = 'Standard';
    const wood = mat(0x3a2a1c, 0, 0.9), bronze = mat(0xa8803a, 0.8, 0.4), cloth = mat(0x7a2418, 0, 0.95), ember = new THREE.MeshStandardMaterial({ color: 0xf0b050, emissive: 0xa05010, emissiveIntensity: 1.0, roughness: 0.4 });
    // (it runs along −y from the grip: a hand at rest points its weapon down, and a standard is carried
    // upright, so its banner goes on the grip's other side)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 3.0, 8), wood); pole.position.y = -0.9; g.add(pole);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 8), bronze); bar.rotation.z = Math.PI / 2; bar.position.y = -2.2; g.add(bar);
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.34, 6), bronze); fin.rotation.z = Math.PI; fin.position.y = -2.56; g.add(fin);
    // the banner hangs from the bar (toward the grip) in three tattered tongues
    for (const [x, len] of [[-0.28, 1.0], [0, 1.2], [0.28, 0.9]]) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.28, len, 0.02), cloth); t.position.set(x, -2.2 + len / 2, 0.04); g.add(t); }
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 14), ember); disc.rotation.x = Math.PI / 2; disc.position.set(0, -1.78, 0.07); g.add(disc);
    return g;
  },
  // a pewter ale mug, held by its handle (Maudry Fenn's, the Tired Mule): body along +y above the grip
  mug: () => {
    const g = new THREE.Group(); g.name = 'Mug';
    const pewter = mat(0x9a9c9e, 0.7, 0.45), ale = mat(0xc8902a, 0.1, 0.35), foam = mat(0xf2ead8, 0, 0.9);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.4, 14, 1, true), pewter); body.position.set(0.22, 0.22, 0); body.name = 'Mug_Body'; g.add(body);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.04, 14), pewter); base.position.set(0.22, 0.03, 0); base.name = 'Mug_Base'; g.add(base);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.02, 14), ale); top.position.set(0.22, 0.38, 0); top.name = 'Mug_Ale'; g.add(top);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), foam); head.scale.y = 0.4; head.position.set(0.22, 0.4, 0); head.name = 'Mug_Foam'; g.add(head);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.035, 8, 16, Math.PI), pewter); handle.rotation.z = Math.PI / 2; handle.position.set(0.02, 0.22, 0); handle.name = 'Mug_Handle'; g.add(handle);
    return g;
  },
  // the Vale's bows (world doc §3.1 v1.10), held the way the kit holds its crossbows: gripped in
  // the right hand slot, shooting along +x, the limbs up and down (±y) bending back toward the
  // archer, the string behind (−x). The hunting bow is short and dark with a recurve at the tips;
  // the yew longbow is taller and pale, with horn nocks.
  huntbow: () => bow({ name: 'Hunting_Bow', half: 0.7, draw: 0.2, curl: 0.08, wood: 0x8a5a32, nock: 0x2e1f18, r: 0.045 }),
  longbow: () => bow({ name: 'Yew_Longbow', half: 1.0, draw: 0.24, curl: 0, wood: 0xb07a40, nock: 0xe8dcc0, r: 0.042 }),
};

function bow({ name, half, draw, curl, wood, nock, r }) {
  const g = new THREE.Group(); g.name = name;
  const W = mat(wood, 0, 0.75), N = mat(nock, 0.1, 0.5), leather = mat(0x2e1f18, 0, 0.9), string = mat(0xe6dcc8, 0, 0.8);
  // one limb, grip to tip, as a tapering tube: back toward the archer as it goes out, the tip flicked forward by `curl`
  const limb = (s) => {
    const pts = [0, 0.25, 0.5, 0.75, 1].map((t) => new THREE.Vector3(-draw * t * t + curl * Math.max(0, t - 0.75) * 4, s * half * t, 0));
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, r, 6, false), pos = tube.attributes.position;
    for (let i = 0; i < pos.count; i++) {                       // taper: full at the grip, 45 % at the tip
      const y = pos.getY(i), t = Math.min(1, Math.abs(y) / half), k = 1 - 0.55 * t, c = pts[Math.round(t * 4)];
      pos.setX(i, c.x + (pos.getX(i) - c.x) * k); pos.setZ(i, pos.getZ(i) * k);
    }
    const m = new THREE.Mesh(tube, W); m.name = name + '_Limb'; g.add(m);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(r * 0.9, 8, 6), N); tip.position.copy(pts[4]); tip.name = name + '_Nock'; g.add(tip);
    return pts[4];
  };
  const top = limb(1), bot = limb(-1);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.5, r * 1.5, 0.24, 8), leather); grip.name = name + '_Grip'; g.add(grip);
  const s = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, top.distanceTo(bot), 4), string);
  s.position.set((top.x + bot.x) / 2, 0, 0); s.name = name + '_String'; g.add(s);
  return g;
}

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
