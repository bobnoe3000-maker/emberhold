// hires.js — a SPIKE (the owner, 2026-11-15, of a reference: "Why are these tile assets so smooth and hi res, what can we do
// to improve the quality of our assets", then "show me before and after for our dungeon with b, c and b+c"): option B,
// the dungeon's ground and walls in painted textures at 128 texels a unit (Luminati's own are 16, pixel art, drawn NEAREST),
// filtered smooth and mipmapped, each with a normal map from its own height. Behind ?dlook=b|bc (hybrid.js); nothing ships
// on it until the owner chooses (docs/dungeon-look-spike.md).
//
// Painted in a canvas at load, from a seed, tileable: flagstones (Voronoi cells, grout, a bevel's light and shade, cracks),
// earth (mottle and pebbles), moss over stone, a wall's coursed blocks and a raw rock face. Each texture covers the same
// world area as Luminati's own (the TileMap's `units` for that name), so its world UVs land as they did.
import * as THREE from 'three';

const TEXELS = 128;               // a world unit's texels (Luminati's PPU is 16)
const MAX = 512;
const cache = new Map();

function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const mix = (a, b, t) => a + (b - a) * t;

// a tileable value noise (a lattice of n cells across the texture), fbm of it
function noiseField(W, H, n, r) {
  const g = new Float32Array(n * n); for (let i = 0; i < g.length; i++) g[i] = r();
  return (x, y) => {
    const fx = (x / W) * n, fy = (y / H) * n, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty), at = (a, b) => g[(((b % n) + n) % n) * n + (((a % n) + n) % n)];
    return mix(mix(at(ix, iy), at(ix + 1, iy), sx), mix(at(ix, iy + 1), at(ix + 1, iy + 1), sx), sy);
  };
}
function fbm(W, H, r, base = 4, oct = 4) {
  const L = []; for (let o = 0; o < oct; o++) L.push(noiseField(W, H, base << o, r));
  return (x, y) => { let v = 0, a = 0.5, s = 0; for (const f of L) { v += f(x, y) * a; s += a; a *= 0.5; } return v / s; };
}
// tileable Voronoi: cells on a jittered grid of n × n (wrapping), F1, F2 and the nearest cell's id
function voronoi(W, H, n, r, jitter = 0.8) {
  const pts = []; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) pts.push([(i + 0.5 + (r() - 0.5) * jitter) * (W / n), (j + 0.5 + (r() - 0.5) * jitter) * (H / n), r()]);
  const cw = W / n, ch = H / n;
  return (x, y) => {
    const ci = Math.floor(x / cw), cj = Math.floor(y / ch); let f1 = 1e9, f2 = 1e9, id = 0;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const ii = ci + di, jj = cj + dj, wi = ((ii % n) + n) % n, wj = ((jj % n) + n) % n, p = pts[wj * n + wi];
      const px = p[0] + (ii - wi) * cw, py = p[1] + (jj - wj) * ch, d = Math.hypot(px - x, py - y);
      if (d < f1) { f2 = f1; f1 = d; id = wj * n + wi; } else if (d < f2) f2 = d;
    }
    return [f1, f2, id, pts[id][2]];
  };
}

/** which painter a Luminati surface takes, or null (left as it is) @param {string} name */
export function painterOf(name) {
  if (/riverbed|water|lava/.test(name)) return null;
  if (/moss/.test(name)) return 'moss';
  if (/tile|cobble|flag|paving/.test(name)) return 'flags';
  if (/dirt|earth|mud|sand/.test(name)) return 'earth';
  if (/brick|wall|ashlar|plaster/.test(name)) return 'blocks';
  if (/crag|cliff|rock|stone|basalt/.test(name)) return 'rock';
  return null;
}

// the palettes: a cool slate stone (the reference's blue-grey floor), a warm earth, moss, the walls a shade darker; at
// Luminati's own textures' brightness (a first pass 40 % darker lost the floor in the dark: measured in the captures)
const PAL = {
  flags: { base: [134, 140, 150], vary: 30, grout: [42, 44, 52], cells: 5 },
  moss: { base: [122, 132, 120], vary: 26, grout: [40, 48, 40], cells: 6, moss: [98, 132, 70] },
  earth: { base: [150, 114, 80], vary: 26, grout: [86, 66, 48] },
  blocks: { base: [124, 126, 136], vary: 26, grout: [40, 40, 48], rows: 6 },
  rock: { base: [114, 116, 124], vary: 28, grout: [44, 44, 50] },
};

/** paint one surface: an albedo and a height, W × H texels @param {string} kind @param {number} W @param {number} H @param {number} seed */
function paint(kind, W, H, seed) {
  const r = rng(seed), P = PAL[kind], col = new Uint8ClampedArray(W * H * 4), hgt = new Float32Array(W * H);
  const n1 = fbm(W, H, r, 4, 4), n2 = fbm(W, H, r, 16, 3), speck = fbm(W, H, r, 64, 2);
  const cellN = Math.max(2, Math.round((P.cells || 5) * W / 256));
  const vor = kind === 'flags' || kind === 'moss' ? voronoi(W, H, cellN, r, 0.75) : kind === 'rock' ? voronoi(W, H, Math.max(2, Math.round(3 * W / 256)), r, 1) : null;
  const crack = fbm(W, H, r, 8, 3);
  const rows = Math.max(2, Math.round((P.rows || 6) * H / 256)), rowH = H / rows, rowOff = []; for (let j = 0; j < rows; j++) rowOff.push(r());
  const blockW = []; for (let j = 0; j < rows; j++) blockW.push(Math.max(2, Math.round((2 + r() * 2) * W / 256)));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; let h = 0.5, tone = 0, gr = 0, shade = (n1(x, y) - 0.5) * 2;
    if (vor) {
      const [f1, f2, , cv] = vor(x, y), edge = f2 - f1, gw = kind === 'rock' ? 10 : 5;
      gr = clamp(1 - edge / gw, 0, 1);                             // the grout (or a rock's fissure)
      const dome = clamp(edge / (W / cellN) * 2.2, 0, 1);           // the stone's swell, highest at its middle
      h = 0.3 + 0.55 * Math.sqrt(dome) - 0.35 * gr + (n2(x, y) - 0.5) * 0.18;
      tone = (cv - 0.5) * 1.4;
    } else if (kind === 'blocks') {
      const j = Math.floor(y / rowH), ry = (y - j * rowH) / rowH, bw = W / blockW[j], bx = ((x / bw + rowOff[j] * 3) % 1 + 1) % 1, bi = Math.floor(x / bw + rowOff[j] * 3);
      const ex = Math.min(bx, 1 - bx) * bw, ey = Math.min(ry, 1 - ry) * rowH, e = Math.min(ex, ey);
      gr = clamp(1 - e / 4.5, 0, 1);
      h = 0.35 + 0.5 * clamp(e / 14, 0, 1) - 0.3 * gr + (n2(x, y) - 0.5) * 0.22;
      tone = ((Math.sin(bi * 12.9898 + j * 78.233) * 43758.5453) % 1 + 1) % 1 - 0.5;
    } else {                                                       // earth: soft mottle and pebbles
      const pb = speck(x, y); h = 0.45 + (n2(x, y) - 0.5) * 0.5 + (pb > 0.72 ? (pb - 0.72) * 2.4 : 0);
      tone = (n1(x, y) - 0.5) * 1.2;
    }
    // cracks: thin dark lines where the crack noise crosses its middle, on stone only
    const ck = kind !== 'earth' ? clamp(1 - Math.abs(crack(x, y) - 0.5) * 60, 0, 1) * (n1(x * 1.7, y * 1.3) > 0.55 ? 1 : 0) : 0;
    h -= ck * 0.15;
    let c = P.base.map((v) => v + tone * P.vary + shade * 10 + (speck(x, y) - 0.5) * 14);
    if (kind === 'moss') { const m = clamp((n1(x + 37, y + 11) - 0.48) * 4, 0, 1) * (0.5 + 0.5 * gr); c = c.map((v, k) => mix(v, P.moss[k] + (n2(x, y) - 0.5) * 24, m)); }
    c = c.map((v, k) => mix(v, P.grout[k], gr * 0.85));
    c = c.map((v) => v * (1 - ck * 0.45) * (0.82 + 0.36 * clamp(h, 0, 1)));   // the cavities darker (ambient occlusion painted in)
    col[i * 4] = c[0]; col[i * 4 + 1] = c[1]; col[i * 4 + 2] = c[2]; col[i * 4 + 3] = 255; hgt[i] = h;
  }
  return { col, hgt };
}

function toNormal(hgt, W, H, strength) {
  const out = new Uint8Array(W * H * 4), at = (x, y) => hgt[((y + H) % H) * W + ((x + W) % W)];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength, dy = (at(x, y + 1) - at(x, y - 1)) * strength, l = Math.hypot(dx, dy, 1), i = (y * W + x) * 4;
    out[i] = (-dx / l * 0.5 + 0.5) * 255; out[i + 1] = (dy / l * 0.5 + 0.5) * 255; out[i + 2] = (1 / l * 0.5 + 0.5) * 255; out[i + 3] = 255;
  }
  return out;
}

/** a surface's textures for `units` (world units a repeat covers) @param {string} name @param {[number, number]} units */
export function hiresTextures(name, units, renderer) {
  const kind = painterOf(name); if (!kind) return null;
  const key = `${name}|${units[0]}x${units[1]}`;
  if (cache.has(key)) return cache.get(key);
  const W = Math.min(MAX, Math.max(64, Math.round(units[0] * TEXELS))), H = Math.min(MAX, Math.max(64, Math.round(units[1] * TEXELS)));
  const { col, hgt } = paint(kind, W, H, hashStr(name));
  const aniso = renderer?.capabilities?.getMaxAnisotropy?.() || 1;
  const map = new THREE.DataTexture(col, W, H, THREE.RGBAFormat);
  const nrm = new THREE.DataTexture(toNormal(hgt, W, H, kind === 'earth' ? 2.5 : 5), W, H, THREE.RGBAFormat);
  for (const t of [map, nrm]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = Math.min(8, aniso); t.flipY = false; t.needsUpdate = true; }
  map.colorSpace = THREE.SRGBColorSpace;
  const out = { map, normalMap: nrm, kind, size: [W, H] };
  cache.set(key, out);
  return out;
}

/** swap a built TileMap's surfaces for the painted ones (its materials, by name) @param {any} tileMap @param {any} renderer
 *  @returns {{ swapped: string[], kept: string[], bytes: number }} */
export function applyHires(tileMap, renderer) {
  const swapped = [], kept = []; let bytes = 0;
  for (const m of tileMap?._materials?.values() || []) {
    const name = String(m.name || '').replace(/^TileMap:(decal:)?/, '').replace(/:var$/, '');
    if (m.userData.hires) { swapped.push(name); continue; }
    let units = [2, 2]; try { units = tileMap.textures.meta(name).units || units; } catch { /* (a name the library doesn't size: two units) */ }
    const t = hiresTextures(name, units, renderer);
    if (!t) { kept.push(name); continue; }
    m.userData.hires = true; m.userData.lowMap = m.map; m.userData.lowNormal = m.normalMap;
    m.map = t.map; m.normalMap = t.normalMap; m.normalScale = new THREE.Vector2(1, 1); m.needsUpdate = true;
    swapped.push(name); bytes += t.size[0] * t.size[1] * 4 * 2 * 1.33;
  }
  return { swapped, kept, bytes: Math.round(bytes) };
}
