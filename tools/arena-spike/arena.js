// arena.js — a spike: three looks for the Bowl as an outdoor arena (the owner, 2026-11-13: "Redesign the pvp arena..
// outdoor, single room, like a gladiator arena, lighter, sandstone colors... give me 3 options"). Built in three.js in
// metres (Luminati's units: two of the sim's tiles to a metre; a person 1.8 m), seen from the game's own camera (yaw 45°,
// pitch 30°, near orthographic) and lit as daylight. The sand is the sim's Sand, 26 × 20 m (52 × 40 tiles). Following the
// level-design rules (docs/level-design-rules.md §1.1), what stands between the camera and the sand (the near, south-east
// half) is cut low. Not the game: a picture to choose from. Rendered by tools/arena-spike/shoot.mjs.
import * as THREE from 'three';

const RX = 13, RZ = 10;                                   // the sand's half-axes (m)
const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

// ── textures: the sand raked, sandstone in courses, canvas in stripes ─────────────────────────────────────────────
function canvasTex(w, h, draw, repeat = [1, 1]) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = 4; return t;
}
const sandTex = (base, rake) => canvasTex(512, 512, (x, w, h) => {
  const r = rng(7); x.fillStyle = base; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 9000; i++) { const v = r(); x.fillStyle = v < 0.5 ? 'rgba(120,90,50,0.10)' : 'rgba(255,248,230,0.16)'; x.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
  if (rake) { x.strokeStyle = 'rgba(140,105,60,0.13)'; x.lineWidth = 2; for (let y = 0; y < h; y += 9) { x.beginPath(); for (let X = 0; X <= w; X += 16) x.lineTo(X, y + Math.sin(X / 40 + y) * 1.5); x.stroke(); } }
}, [6, 6]);
const stoneTex = (base, joint, seed = 3, course = 32, block = [48, 90]) => canvasTex(256, 256, (x, w, h) => {
  const r = rng(seed); x.fillStyle = base; x.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += course) {
    let X = -r() * 40;
    while (X < w) { const bw = block[0] + r() * (block[1] - block[0]), k = 0.9 + r() * 0.2;
      x.fillStyle = `rgba(${k > 1 ? '255,245,225' : '120,80,40'},${Math.abs(k - 1) * 0.9})`; x.fillRect(X, y, bw, course);
      x.fillStyle = joint; x.fillRect(X, y, 2, course); X += bw; }
    x.fillStyle = joint; x.fillRect(0, y, w, 2);
  }
  for (let i = 0; i < 1500; i++) { x.fillStyle = r() < 0.5 ? 'rgba(90,60,30,0.10)' : 'rgba(255,250,235,0.12)'; x.fillRect(r() * w, r() * h, 2, 2); }
}, [1, 1]);
const strataTex = (bands, seed = 5) => canvasTex(256, 256, (x, w, h) => {
  const r = rng(seed); let y = 0, i = 0;
  while (y < h) { const bh = 8 + r() * 26; x.fillStyle = bands[i++ % bands.length]; x.fillRect(0, y, w, bh); y += bh; }
  for (let k = 0; k < 2500; k++) { x.fillStyle = r() < 0.5 ? 'rgba(80,50,30,0.12)' : 'rgba(255,240,220,0.14)'; x.fillRect(r() * w, r() * h, 3, 1 + r() * 2); }
  x.strokeStyle = 'rgba(80,50,30,0.25)'; for (let k = 0; k < 14; k++) { x.beginPath(); const X = r() * w; x.moveTo(X, 0); x.lineTo(X + (r() - 0.5) * 30, h); x.stroke(); }
}, [1, 1]);
const stripeTex = (a, b) => canvasTex(64, 64, (x, w, h) => { x.fillStyle = a; x.fillRect(0, 0, w, h); x.fillStyle = b; for (let X = 0; X < w; X += 16) x.fillRect(X, 0, 8, h); }, [1, 1]);

const mat = (o) => new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0, ...o });

// ── helpers on the ellipse ────────────────────────────────────────────────────────────────────────────────────────
const ell = (t, k = 0) => [Math.cos(t) * (RX + k), Math.sin(t) * (RZ + k)];
// the camera looks from +x +z: a point on the ring is "near" (between the camera and the sand) when its direction has
// a positive share toward the camera; `near(t)` 1 at the nearest, 0 at the sides and behind
const near = (t) => Math.max(0, (Math.cos(t) + Math.sin(t)) / Math.SQRT2);
/** a ring of boxes round the ellipse at offset k, n segments, each h high (or h(t)), d deep, standing from y0 */
function ring(group, { k = 0, n = 96, h = 2, d = 1, y0 = 0, m, skip = () => false, hOf = null, gap = 0 }) {
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * Math.PI * 2, t1 = ((i + 1) / n) * Math.PI * 2, tm = (t0 + t1) / 2;
    if (skip(tm)) continue;
    const hh = hOf ? hOf(tm) : h; if (hh <= 0.02) continue;
    const [x0, z0] = ell(t0, k + d / 2), [x1, z1] = ell(t1, k + d / 2), len = Math.hypot(x1 - x0, z1 - z0) - gap;
    const b = new THREE.Mesh(new THREE.BoxGeometry(len + 0.02, hh, d), m); b.position.set((x0 + x1) / 2, y0 + hh / 2, (z0 + z1) / 2);
    b.rotation.y = -Math.atan2(z1 - z0, x1 - x0); b.castShadow = b.receiveShadow = true; group.add(b);
  }
}
/** a crowd on a tier: little seated figures, a dot of colour each */
function crowd(group, { k, y, n = 140, cols, skip, seed = 1, depthRow = 0.6 }) {
  const r = rng(seed), body = new THREE.CapsuleGeometry(0.17, 0.32, 3, 6), head = new THREE.SphereGeometry(0.13, 8, 6);
  const ms = cols.map((c) => mat({ color: c })), skin = [mat({ color: '#c99a76' }), mat({ color: '#9a6e4f' }), mat({ color: '#e0b896' })];
  for (let i = 0; i < n; i++) {
    const t = r() * Math.PI * 2; if (skip(t) || r() < 0.15) continue;
    const [x, z] = ell(t, k + r() * depthRow);
    const b = new THREE.Mesh(body, ms[Math.floor(r() * ms.length)]); b.position.set(x, y + 0.33, z); b.castShadow = true; group.add(b);
    const hd = new THREE.Mesh(head, skin[Math.floor(r() * 3)]); hd.position.set(x, y + 0.72, z); group.add(hd);
  }
}
/** the fighters for scale: six, two companies at their marks, a ring under each (gold yours, red theirs) */
function fighters(group) {
  const body = new THREE.CapsuleGeometry(0.28, 1.0, 4, 10), head = new THREE.SphereGeometry(0.22, 12, 10);
  const team = (cx, col, ringCol, face) => [[0, 0], [-1.4, 1.6], [-1.4, -1.6]].forEach(([u, v]) => {
    const x = cx + u * face, z = v;
    const b = new THREE.Mesh(body, mat({ color: col })); b.position.set(x, 0.78, z); b.castShadow = true; group.add(b);
    const h = new THREE.Mesh(head, mat({ color: '#d9ad86' })); h.position.set(x, 1.6, z); h.castShadow = true; group.add(h);
    const rg = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.55, 28), new THREE.MeshBasicMaterial({ color: ringCol })); rg.rotation.x = -Math.PI / 2; rg.position.set(x, 0.02, z); group.add(rg);
  });
  team(-4.5, '#5d6f8a', '#e6c05a', 1); team(4.5, '#7a3a32', '#d2463a', -1);
}
function sandFloor(group, base, rake = true) {
  const g = new THREE.CircleGeometry(1, 96); g.scale(RX + 0.3, RZ + 0.3, 1);
  const m = new THREE.Mesh(g, mat({ map: sandTex(base, rake), roughness: 1 })); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; group.add(m);
}
function groundOutside(group, col) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), mat({ map: sandTex(col, false), roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.y = -0.02; m.receiveShadow = true; group.add(m);
}
/** an archway (two piers and a rounded head) facing along t on the ring, w wide, h high */
function arch(group, t, k, w, h, d, m, { door = '#3a2a1c' } = {}) {
  const [x, z] = ell(t, k + d / 2), g = new THREE.Group(); g.position.set(x, 0, z);
  const tx = -Math.sin(t) * RX, tz = Math.cos(t) * RZ; g.rotation.y = -Math.atan2(tz, tx);
  const pier = new THREE.BoxGeometry(0.8, h, d);
  for (const s of [-1, 1]) { const p = new THREE.Mesh(pier, m); p.position.set(s * (w / 2 + 0.4), h / 2, 0); p.castShadow = p.receiveShadow = true; g.add(p); }
  const top = new THREE.Mesh(new THREE.BoxGeometry(w + 1.6, 0.9, d), m); top.position.y = h + 0.45; top.castShadow = true; g.add(top);
  const curve = new THREE.Mesh(new THREE.CylinderGeometry(w / 2, w / 2, d * 0.98, 16, 1, false, 0, Math.PI), m); curve.rotation.z = Math.PI / 2; curve.rotation.y = Math.PI / 2; curve.position.y = h - w / 2; g.add(curve);
  // the way through: dark on both faces, an opening under the arch head
  const dm = mat({ color: door, side: THREE.DoubleSide });
  for (const s of [-1, 1]) { const dark = new THREE.Mesh(new THREE.PlaneGeometry(w, h - w / 2), dm); dark.position.set(0, (h - w / 2) / 2, s * (d / 2 + 0.02)); g.add(dark);
    const half = new THREE.Mesh(new THREE.CircleGeometry(w / 2, 16, 0, Math.PI), dm); half.position.set(0, h - w / 2, s * (d / 2 + 0.02)); g.add(half); }
  group.add(g); return g;
}
function banner(group, x, z, y, cols, h = 2.2) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, h + 1, 6), mat({ color: '#5a4630' })); pole.position.set(x, y + (h + 1) / 2, z); pole.castShadow = true; group.add(pole);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(0.9, h * 0.7), mat({ map: stripeTex(cols[0], cols[1]), side: THREE.DoubleSide })); f.position.set(x + 0.47, y + h + 0.2 - h * 0.35, z); f.rotation.y = Math.PI / 4; f.castShadow = true; group.add(f);
}

// ── option A: the Sun Bowl, a classical amphitheatre ──────────────────────────────────────────────────────────────
function optionA(group) {
  const honey = mat({ map: stoneTex('#d9b98a', 'rgba(140,100,60,0.55)', 3) }), pale = mat({ map: stoneTex('#e8d3ac', 'rgba(150,115,75,0.5)', 9, 24, [40, 70]) });
  groundOutside(group, '#c9ab7d'); sandFloor(group, '#e9d2a6');
  const far = (t) => near(t) > 0.35;                                   // (the near arc: the podium alone, cut low)
  ring(group, { k: 0, h: 2.2, d: 0.9, m: honey, hOf: (t) => (near(t) > 0.35 ? 0.9 : 2.2) });              // the podium wall
  ring(group, { k: 0, y0: 0, h: 0.25, d: 1.1, m: pale, hOf: (t) => (near(t) > 0.35 ? 1.05 : 2.45), n: 96 });  // its coping
  for (let tier = 0; tier < 5; tier++) ring(group, { k: 0.9 + tier * 1.2, y0: 0, d: 1.2, m: tier % 2 ? pale : honey, h: 2.4 + tier * 0.9, skip: far });   // the tiers, stepped
  ring(group, { k: 6.9, h: 7.4, d: 0.8, m: honey, skip: far, n: 120 });                                                // the outer wall
  for (let i = 0; i < 26; i++) { const t = (i / 26) * Math.PI * 2; if (far(t)) continue; const [x, z] = ell(t, 7.3);   // its arcade, a pilaster a bay
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7.6, 0.5), pale); p.position.set(x, 3.8, z); p.castShadow = true; group.add(p); }
  for (let tier = 0; tier < 5; tier++) crowd(group, { k: 1.1 + tier * 1.2, y: 2.4 + tier * 0.9, n: 120, cols: ['#b8463a', '#3f6a8a', '#d9c07a', '#6a8a4a', '#e8e0d0', '#8a5a8a'], skip: far, seed: tier + 1 });
  // the Sun's Box on the far long side, under a canopy, and the velarium's sails on masts
  const t0 = -Math.PI * 0.75, [bx, bz] = ell(t0, 2.4);
  const box = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 2.2), pale); box.position.set(bx, 3.4, bz); box.rotation.y = -t0 - Math.PI / 2; box.castShadow = true; group.add(box);
  const can = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.12, 2.8), mat({ map: stripeTex('#e9e1cf', '#b8463a') })); can.position.set(bx, 6.2, bz); can.rotation.copy(box.rotation); can.castShadow = true; group.add(can);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.9, 24), mat({ color: '#e6b84a', metalness: 0.6, roughness: 0.35, emissive: '#5a3a08' })); disc.position.set(bx, 7.4, bz); disc.lookAt(0, 7.4, 0); group.add(disc);
  for (let i = 0; i < 14; i++) { const t = (i / 14) * Math.PI * 2 + 0.11; if (far(t)) continue; const [x, z] = ell(t, 7.6);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4, 6), mat({ color: '#6a5236' })); mast.position.set(x, 9.4, z); group.add(mast);
    const [x2, z2] = ell(t, 3.5), sail = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4.4), mat({ map: stripeTex(i % 2 ? '#efe6d2' : '#e9d9b8', '#c0563f'), side: THREE.DoubleSide, transparent: true, opacity: 0.96 }));
    sail.position.set((x + x2) / 2, 9.6, (z + z2) / 2); sail.lookAt(0, 30, 0); sail.castShadow = true; group.add(sail); }
  arch(group, Math.PI, 0, 2.6, 3.2, 1.2, pale);                      // the Dust Gate (yours, west)
  arch(group, -Math.PI / 2, 0, 2.6, 3.2, 1.2, pale);                 // the Sun Gate (theirs, north)
  for (const t of [Math.PI * 0.9, Math.PI * 1.1, -Math.PI * 0.4, -Math.PI * 0.6]) { const [x, z] = ell(t, -0.5); banner(group, x, z, 0, ['#b8463a', '#e9d2a6']); }
  fighters(group);
}

// ── option B: the Quarry Ring, cut into banded sandstone ──────────────────────────────────────────────────────────
function optionB(group) {
  const cliff = mat({ map: strataTex(['#e2b88a', '#d49f74', '#ecc9a0', '#c98f66', '#e6c296', '#d8aa80']) }), cliffTop = mat({ map: sandTex('#d9c08c', false), roughness: 1 });
  groundOutside(group, '#cfae84'); sandFloor(group, '#efd9b0');
  const far = (t) => near(t) > 0.3;
  // the cut: three ledges of rock stepping back and up, rough-edged; the near side a low lip of rubble and a fence
  const r = rng(11);
  for (let L = 0; L < 3; L++) ring(group, { k: L * 2.4, n: 70, d: 2.4, m: cliff, skip: far, hOf: () => 2.6 + L * 2.6 + r() * 0.9 });
  ring(group, { k: 0, n: 70, d: 1.4, m: cliff, hOf: (t) => (near(t) > 0.3 ? 0.5 + r() * 0.4 : 0) });
  ring(group, { k: 7.2, n: 70, d: 4, m: cliffTop, skip: far, hOf: () => 8.2 + r() * 0.25 });
  // a timber fence along the sand's edge, posts and two rails
  const wood = mat({ color: '#8a6a44' });
  for (let i = 0; i < 70; i++) { const t = (i / 70) * Math.PI * 2, [x, z] = ell(t, -0.4); const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.1, 0.16), wood); p.position.set(x, 0.55, z); p.castShadow = true; group.add(p); }
  ring(group, { k: -0.45, n: 70, d: 0.1, h: 0.1, y0: 0.9, m: wood }); ring(group, { k: -0.45, n: 70, d: 0.1, h: 0.1, y0: 0.5, m: wood });
  // the crowd on the ledges, and up top, scrub and olive trees, a crane left from the quarrying
  for (let L = 0; L < 3; L++) crowd(group, { k: L * 2.4 + 0.3, y: 2.6 + L * 2.6, n: 90, cols: ['#a34a32', '#3a6a7a', '#d8c27a', '#6a7a3a', '#efe4cc'], skip: far, seed: 20 + L, depthRow: 1.6 });
  const leaf = mat({ color: '#7f8f4e' }), trunk = mat({ color: '#6a5236' });
  for (let i = 0; i < 18; i++) { const t = r() * Math.PI * 2; if (far(t)) continue; const [x, z] = ell(t, 9 + r() * 4);
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 2, 6), trunk); tr.position.set(x, 9.4, z); tr.castShadow = true; group.add(tr);
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1 + r() * 0.6, 0), leaf); c.position.set(x, 10.8, z); c.scale.y = 0.7; c.castShadow = true; group.add(c); }
  const [cx, cz] = ell(-Math.PI * 0.62, 4); const boom = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 7), wood); boom.position.set(cx, 11, cz); boom.rotation.y = 0.7; boom.rotation.x = -0.3; boom.castShadow = true; group.add(boom);
  const mastC = new THREE.Mesh(new THREE.BoxGeometry(0.3, 6, 0.3), wood); mastC.position.set(cx, 8.6, cz); group.add(mastC);
  // the gates: a ramp cut down from the west (yours), a timber door in the north face (theirs)
  arch(group, Math.PI, 0, 3, 3.4, 2.4, cliff, { door: '#2c1e14' });
  arch(group, -Math.PI / 2, 0, 3, 3.4, 2.4, cliff, { door: '#2c1e14' });
  // the Sun's Box: a ledge with a striped awning and the disc on a pole
  const [bx, bz] = ell(-Math.PI * 0.8, 2.6); const aw = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 2.4), mat({ map: stripeTex('#efe6d2', '#d07a3a') })); aw.position.set(bx, 7.6, bz); aw.rotation.y = 0.9; aw.castShadow = true; group.add(aw);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.8, 24), mat({ color: '#e6b84a', metalness: 0.6, roughness: 0.35, emissive: '#5a3a08' })); disc.position.set(bx, 8.9, bz); disc.lookAt(0, 8.9, 0); group.add(disc);
  for (const t of [Math.PI * 0.92, Math.PI * 1.08]) { const [x, z] = ell(t, -0.9); banner(group, x, z, 0, ['#d07a3a', '#efe6d2']); }
  fighters(group);
}

// ── option C: the Broken Circus, a two-storey arcade, its near half fallen ────────────────────────────────────────
function optionC(group) {
  const cream = mat({ map: stoneTex('#efe0c0', 'rgba(160,125,85,0.45)', 13, 28, [52, 96]) }), sand = mat({ map: stoneTex('#dcb784', 'rgba(140,100,60,0.5)', 17) });
  groundOutside(group, '#d6bb8e'); sandFloor(group, '#f0dfba');
  const far = (t) => near(t) > 0.3, r = rng(31);
  ring(group, { k: 0, h: 1.4, d: 0.8, m: sand, hOf: (t) => (near(t) > 0.3 ? 0.7 + r() * 0.5 : 1.4) });   // the barrier, broken low on the near side
  // two storeys of arches round the far half: piers, arch heads, an entablature between and a cornice on top
  const n = 30, col = new THREE.CylinderGeometry(0.32, 0.36, 3.4, 10);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2; const [x, z] = ell(t, 3.2);
    if (far(t)) {                                                        // fallen: a stump or a drum on its side, rubble
      if (r() < 0.6) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.5 + r() * 1.2, 10), cream); s.position.set(x, 0.4, z); s.castShadow = true; group.add(s); }
      if (r() < 0.5) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.9, 10), cream); d.rotation.z = Math.PI / 2; d.rotation.y = r() * 3; d.position.set(x + (r() - 0.5) * 2, 0.34, z + (r() - 0.5) * 2); d.castShadow = true; group.add(d); }
      for (let k = 0; k < 3; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.4 + r() * 0.6, 0.3 + r() * 0.3, 0.4 + r() * 0.5), sand); b.position.set(x + (r() - 0.5) * 3, 0.15, z + (r() - 0.5) * 3); b.rotation.y = r() * 3; b.castShadow = true; group.add(b); }
      continue;
    }
    for (const st of [0, 1]) { const c = new THREE.Mesh(col, cream); c.position.set(x, 1.7 + st * 4.2, z); c.castShadow = c.receiveShadow = true; group.add(c); }
  }
  ring(group, { k: 2.9, n: 60, d: 0.9, h: 0.8, y0: 3.4, m: sand, skip: far });          // the first storey's entablature
  ring(group, { k: 2.9, n: 60, d: 0.9, h: 0.9, y0: 7.6, m: cream, skip: far });          // the cornice
  for (let i = 0; i < n; i++) { const t = ((i + 0.5) / n) * Math.PI * 2; if (far(t) || r() < 0.15) continue;   // arch heads between the columns
    for (const st of [0, 1]) { const [x, z] = ell(t, 3.2), a = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.18, 6, 12, Math.PI), cream); a.position.set(x, 3.4 + st * 4.2 - 0.05, z); a.lookAt(0, a.position.y, 0); group.add(a); } }
  // behind the arcade, the seating banked up to its top, the crowd on it; a gilded sun on the Sun's Box
  for (let tier = 0; tier < 4; tier++) ring(group, { k: 4.1 + tier * 1.1, d: 1.1, h: 1.2 + tier * 1.8, m: tier % 2 ? cream : sand, skip: far });
  for (let tier = 0; tier < 4; tier++) crowd(group, { k: 4.3 + tier * 1.1, y: 1.2 + tier * 1.8, n: 110, cols: ['#c0563f', '#356a8a', '#e3c46a', '#efe8d8', '#7a5a8a'], skip: far, seed: 40 + tier });
  const [bx, bz] = ell(-Math.PI * 0.75, 3.2);
  const ped = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1, 1.6), cream); ped.position.set(bx, 8.5, bz); ped.lookAt(0, 8.5, 0); group.add(ped);
  const sun = new THREE.Mesh(new THREE.CircleGeometry(1.4, 24), mat({ color: '#f0c050', metalness: 0.7, roughness: 0.3, emissive: '#6a4808' })); sun.position.set(bx, 10.6, bz); sun.lookAt(0, 10.6, 0); group.add(sun);
  for (let i = 0; i < 12; i++) { const ray = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.08), sun.material); const a = (i / 12) * Math.PI * 2; ray.position.set(Math.cos(a) * 1.9, Math.sin(a) * 1.9, 0); ray.rotation.z = a - Math.PI / 2; sun.add(ray); }
  // banners on the cornice, the two gates in the barrier, palms outside
  for (let i = 0; i < 8; i++) { const t = -Math.PI * 0.95 + i * 0.36; if (far(t)) continue; const [x, z] = ell(t, 3.1); banner(group, x, z, 8.5, i % 2 ? ['#c0563f', '#efe0c0'] : ['#356a8a', '#efe0c0'], 1.6); }
  arch(group, Math.PI, 0, 2.6, 3, 0.9, cream); arch(group, -Math.PI / 2, 0, 2.6, 3, 0.9, cream);
  const frond = mat({ color: '#7c9150' }), bark = mat({ color: '#8a6a44' }), fg = new THREE.ConeGeometry(0.28, 2.6, 4);
  for (let i = 0; i < 9; i++) { const t = r() * Math.PI * 2; if (far(t)) continue; const [x, z] = ell(t, 11 + r() * 3);
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 6, 6), bark); tr.position.set(x, 3, z); tr.rotation.z = (r() - 0.5) * 0.2; tr.castShadow = true; group.add(tr);
    for (let k = 0; k < 7; k++) { const a = (k / 7) * Math.PI * 2, f = new THREE.Mesh(fg, frond); f.scale.set(1, 1, 0.35);   // (a frond: a flattened cone, drooping out from the crown)
      f.position.set(x + Math.cos(a) * 1.1, 5.7, z + Math.sin(a) * 1.1); f.lookAt(x + Math.cos(a) * 4, 4.6, z + Math.sin(a) * 4); f.rotateX(Math.PI / 2); f.castShadow = true; group.add(f); } }
  fighters(group);
}

export const OPTIONS = { a: optionA, b: optionB, c: optionC };

/** render one option into the canvas: 'wide' the whole arena, 'play' a phone's frame at the game's zoom */
export function render(canvas, which, view) {
  const W = canvas.width, H = canvas.height;
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; R.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#cfe2ee');
  const g = new THREE.Group(); OPTIONS[which](g); scene.add(g);
  scene.add(new THREE.HemisphereLight('#dceefc', '#c8a878', 1.4));
  const sun = new THREE.DirectionalLight('#fff1d6', 2.6); sun.position.set(-18, 30, 14); sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 90 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; scene.add(sun);
  // the game's camera: yaw 45° (looking from +x +z), pitch 30°, orthographic. 'play': 22 px a metre (the game's zoom),
  // centred on the sand a little behind your company; 'wide': the whole ring in frame
  const span = view === 'play' ? H / 22 : 46, aspect = W / H;
  const cam = new THREE.OrthographicCamera(-span * aspect / 2, span * aspect / 2, span / 2, -span / 2, 0.1, 400);
  const yaw = Math.PI / 4, pitch = Math.PI / 6, D = 120, fx = view === 'play' ? -1 : -1.5, fz = view === 'play' ? 0 : -2.5;
  cam.position.set(fx + Math.sin(yaw) * Math.cos(pitch) * D, Math.sin(pitch) * D, fz + Math.cos(yaw) * Math.cos(pitch) * D); cam.lookAt(fx, 1.5, fz);
  R.render(scene, cam);
}
