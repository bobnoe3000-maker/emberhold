// landmarks.js — the Vale's dungeon doors as built pieces in Luminati's world (docs/vale-landmarks-proposal.md;
// the owner, 2026-11-10: "the entrances to the dungeons dont look good and are not up to the new art standards (old
// barrow, keep, sunken chapel) - propose updated art"). They were our baked sprites stood up as cards (convert.js
// `sprites`): flat, pixel-sized, unlit by the world's sun and lamps, no shadow. These are built as Thornwick's houses are,
// with Luminati's own mesh builder, textures, ambient occlusion and shadows (its PropFactory), at the people's scale (a
// figure stands 1.75 units), on the sim's footprints (envfoot.js: nothing the sim walks changes), each door on the side
// the sim's exit is (+Z, toward the camera).
//
// A spike for the proposal: drawn with ?landmarks=3d (hybrid.js), the sprites otherwise.
// Units: Luminati's (one = two of our tiles); the origin is the struct's anchor on the ground, +Z its front.

const TAU = Math.PI * 2;
const smooth = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
const groundAO = (h = 0.9, k = 0.55) => (px, py) => k + (1 - k) * smooth(-0.05, h, py);
// a deterministic jitter (the same piece every load)
const jit = (seed) => { let s = seed >>> 0 || 1; return () => { s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) >>> 0; s = Math.imul(s ^ (s >>> 12), 0x297a2d39) >>> 0; return ((s ^ (s >>> 15)) >>> 0) / 4294967296; }; };
const DARK = [0.06, 0.05, 0.07], MOSS = [0.62, 0.72, 0.52];

/** a doorway's dark: a recess you can't see the back of */
function hole(b, w, h, d, at) { b.tinted(DARK, () => b.box('stone_wall', [w, h, d], { at, faces: { pz: true, ny: false } })); }
/** a lantern on a post (its glass the world's: it lights at dusk with the town's) */
function lantern(b, glass, x, z, h = 1.7) {
  b.box('wood_planks_dark', [0.12, h, 0.12], { at: [x, h / 2, z] });
  b.box('wood_planks_dark', [0.5, 0.08, 0.08], { at: [x + 0.2, h - 0.05, z] });
  b.box('metal', [0.22, 0.05, 0.22], { at: [x + 0.4, h - 0.2, z] });
  b.box(glass, [0.16, 0.24, 0.16], { at: [x + 0.4, h - 0.36, z] });
  b.box('metal', [0.2, 0.04, 0.2], { at: [x + 0.4, h - 0.5, z] });
}

// ── the Old Barrows: a long barrow of the Third Legion's dead, turfed over; a stone portal at its mouth (two uprights and
// a lintel), the kerb of the mound's revetment either side, the passage going down dark into it; the Redhand's dig at
// the door (shoring, a spoil heap, planks) and Tobin's lantern on its post ─────────────────────────────────────────────
function barrow(f, b, glass) {
  const r = jit(7);
  // the mound: long (along X), its front cut back where the portal stands
  b.push([0, 0, -0.9], null, [1.32, 1, 0.8]);
  b.tinted([0.55, 0.62, 0.45], () => b.lathe('grass_dark', [{ y: -0.1, r: 3.95 }, { y: 0.55, r: 3.75 }, { y: 1.15, r: 3.25 }, { y: 1.6, r: 2.5 }, { y: 1.88, r: 1.5 }, { y: 1.98, r: 0.05 }], { segments: 20, smooth: true, normalUp: 2 }));
  b.pop();
  // the kerbstones round its foot, half sunk
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * TAU, cx = Math.cos(a) * 4.65, cz = -0.9 + Math.sin(a) * 3.12;
    if (cz > 1.6 && Math.abs(cx) < 2.2) continue;                 // (the forecourt)
    b.tinted(MOSS, () => b.box('stone_wall', [0.55 + r() * 0.3, 0.35 + r() * 0.3, 0.45], { at: [cx, 0.12, cz], rot: -a + Math.PI / 2 + (r() - 0.5) * 0.3 }));
  }
  // the forecourt: a dry-stone wall each side, curving back into the mound, stepping down
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const t = i / 3, x = s * (1.25 + t * 1.8), z = 1.9 - t * t * 1.1, h = 1.35 - t * 0.8;
    b.tinted([1.1, 1.12, 1.0], () => b.box('stone_wall', [0.95, h, 0.6], { at: [x, h / 2, z], rot: -s * (0.25 + t * 0.55) }));
  }
  // the portal: two uprights and a lintel, weathered stone
  for (const s of [-1, 1]) b.tinted([1.35, 1.32, 1.2], () => b.box('well_stone', [0.6, 2.15, 0.62], { at: [s * 0.92, 1.07, 2.05], rot: s * 0.04 }));
  b.tinted([1.3, 1.28, 1.16], () => b.box('well_stone', [2.8, 0.5, 0.82], { at: [0, 2.37, 2.05], rot: 0.02 }));
  hole(b, 1.25, 1.95, 1.4, [0, 0.97, 1.5]);
  b.box('stone_tiles', [1.3, 0.1, 1.2], { at: [0, 0.02, 2.75] });                   // the threshold, worn
  // the Redhand's shoring in the door: two props and a cap
  for (const s of [-1, 1]) b.box('wood_planks', [0.14, 1.85, 0.14], { at: [s * 0.52, 0.93, 2.05], rot: s * 0.05 });
  b.box('wood_planks', [1.25, 0.14, 0.18], { at: [0, 1.88, 2.05] });
  // their spoil heap, and planks laid over the mud
  b.tinted([0.7, 0.62, 0.52], () => b.lathe('dirt', [{ y: -0.05, r: 1.25 }, { y: 0.35, r: 0.95 }, { y: 0.65, r: 0.45 }, { y: 0.75, r: 0.05 }], { segments: 10, smooth: true, at: [2.7, 0, 3.0] }));
  for (let i = 0; i < 3; i++) b.box('wood_planks_dark', [0.32, 0.05, 1.7], { at: [-0.35 + i * 0.36, 0.04, 3.7], rot: (r() - 0.5) * 0.12 });
  // a standing stone on the ridge, leaning
  b.tinted(MOSS, () => b.box('stone_wall', [0.5, 1.4, 0.4], { at: [-1.6, 2.0, -1.1], rot: [0.08, 0.3, 0.14, 'YXZ'] }));
  // Tobin's lantern at the barrow mouth
  lantern(b, glass, -1.85, 3.2);
}

// ── the Sunken Chapel: an imperial chapel the river marsh has half swallowed, standing in black water to the sills and
// leaning; the near end roofed in slate, the far end open to its rafters; the dry porch at the front, up out of the water
// on its steps, where Hester keeps her bees ────────────────────────────────────────────────────────────────────────
function chapel(f, b, glass, water) {
  const r = jit(5), W = 3.6, L = 6.2, H = 3.4, sink = 1.05, cz = -0.2;
  // the marsh round it: black water, reeds
  b.tinted([1.4, 1.6, 1.75], () => b.lathe(water, [{ y: 0.05, r: 4.1 }, { y: 0.05, r: 0.01 }], { segments: 16, smooth: true, normalUp: 5, at: [0, 0.08, cz - 0.4], scale: [1.05, 1, 1.15] }));
  for (let i = 0; i < 26; i++) {
    const a = r() * TAU, d = 2.6 + r() * 1.6, x = Math.cos(a) * d * 1.05, z = cz - 0.4 + Math.sin(a) * d * 1.15;
    if (z > 2.2 && Math.abs(x) < 1.6) continue;
    b.tinted([0.45, 0.55, 0.3], () => b.box('wood_planks', [0.05, 0.5 + r() * 0.6, 0.05], { at: [x, 0.3, z], rot: [(r() - 0.5) * 0.3, r() * 3, (r() - 0.5) * 0.3, 'YXZ'] }));
  }
  // the nave, sunk and leaning
  b.push([0, -sink, cz], [0.05, 0, -0.075, 'YXZ']);
  b.tinted([0.95, 0.92, 0.82], () => b.box('stone_brick', [W, H, L], { at: [0, H / 2, 0], faces: { ny: false } }));
  b.tinted(MOSS, () => b.box('moss_stone', [W + 0.06, 0.95, L + 0.06], { at: [0, 0.75, 0], faces: { ny: false, py: false } }));   // (the water line's slime)
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) b.box('stone_brick', [0.4, H - 0.4, 0.5], { at: [s * (W / 2 + 0.18), (H - 0.4) / 2, -L / 2 + 1 + i * 2] });   // buttresses
  // the tall windows down the sides, the round one over the door
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) b.push([s * (W / 2 + 0.01), 2.1, -L / 2 + 2 + i * 1.6], [0, s * Math.PI / 2, 0]), hole(b, 0.45, 1.1, 0.2, [0, 0, 0]), b.pop();
  // the gable over the front, a bell-cote on it, empty
  b.tinted([0.92, 0.9, 0.8], () => b.poly('stone_brick', [[-W / 2, H, L / 2], [W / 2, H, L / 2], [0, H + 1.6, L / 2]], { uAxis: [1, 0, 0], vAxis: [0, 1, 0] }));
  hole(b, 0.7, 0.7, 0.2, [0, H + 0.55, L / 2 + 0.01]);
  b.box('stone_brick', [0.7, 1.0, 0.45], { at: [0, H + 1.9, L / 2 - 0.1] }); hole(b, 0.36, 0.5, 0.5, [0, H + 1.95, L / 2 - 0.1]);
  b.box('stone_wall', [0.85, 0.15, 0.6], { at: [0, H + 2.45, L / 2 - 0.1] });
  // the roof: slate over the near half, the far half fallen in to its rafters
  for (const side of [-1, 1]) {
    b.push([side * W / 4, H + 0.8, L / 4], [0, 0, side * -0.73]);
    b.box('roof_slate', [W / 2 / Math.cos(0.73) + 0.35, 0.12, L / 2 + 0.2]);
    b.pop();
    for (let i = 0; i < 4; i++) { b.push([side * W / 4, H + 0.8, -L / 2 + 0.4 + i * 0.75], [0, 0, side * -0.73]); b.box('wood_planks_dark', [W / 2 / Math.cos(0.73) + 0.2, 0.14, 0.14]); b.pop(); }
  }
  b.box('wood_planks_dark', [0.16, 0.16, L], { at: [0, H + 1.6, 0] });
  b.pop();
  // the dry porch: up out of the water on its steps, a little roof, the door in the dark behind it
  const pz = cz + L / 2 + 0.6;
  for (let i = 0; i < 3; i++) b.box('stone_tiles', [2.2, 0.22, 0.5], { at: [0, 0.11 + i * 0.12, pz + 1.3 - i * 0.4] });
  b.box('stone_tiles', [2.2, 0.4, 1.2], { at: [0, 0.3, pz] });
  for (const s of [-1, 1]) b.box('stone_brick', [0.3, 1.9, 1.3], { at: [s * 0.95, 1.4, pz] });
  b.push([0, 2.55, pz], [0, 0, 0]);
  for (const s of [-1, 1]) { b.push([s * 0.6, 0, 0], [0, 0, s * -0.6]); b.box('roof_slate', [1.45, 0.1, 1.6]); b.pop(); }
  b.pop();
  hole(b, 1.0, 1.9, 0.6, [0, 1.45, cz + L / 2 - 0.05]);
  // Hester's skeps, on a bench in the dry, and her lantern
  b.box('wood_planks', [1.6, 0.1, 0.45], { at: [1.85, 0.75, pz + 0.6] });
  for (const s of [-1, 1]) b.box('wood_planks_dark', [0.1, 0.7, 0.1], { at: [1.85 + s * 0.65, 0.35, pz + 0.6] });
  for (let i = 0; i < 3; i++) b.lathe('roof_thatch', [{ y: 0, r: 0.24 }, { y: 0.22, r: 0.22 }, { y: 0.4, r: 0.12 }, { y: 0.46, r: 0.02 }], { segments: 8, smooth: true, at: [1.35 + i * 0.5, 0.8, pz + 0.6] });
  lantern(b, glass, -1.6, pz + 1.0, 1.6);
}

const BUILD = { barrow, chapel };
export const LANDMARK_OF = { ruin: 'barrow', chapelruin_0: 'chapel' };   // (Wickham Keep keeps its design: our kit's own model, stood in 3D: world.js KIT_PIECES)

/** a landmark of the Vale built at (x, y, z) in Luminati's units, its door toward +Z
 * @param {any} f the world's PropFactory @param {'barrow'|'chapel'} kind @param {any} glass the world's lantern glass */
export function buildLandmark(f, kind, x, y, z, glass) {
  const b = f.builder(groundAO());
  const water = f.textures.material('riverbed', { vertexColors: true, color: 0x8fb4cc });
  BUILD[kind](f, b, glass || f.glassMaterial(), water);
  const group = f.finish(b, `ember:landmark:${kind}`, x, y, z, 0);
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return group;
}
