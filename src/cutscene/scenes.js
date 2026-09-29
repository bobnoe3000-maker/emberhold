// @ts-check
// scenes.js — the intro's six painted scenes (development plan §2.1; approved as docs/intro-mockup.html,
// direction C revision 4). Canvas 2D silhouettes on a 120 × 246 portrait stage, in four or five
// parallax layers fading into the sky, rim-lit toward the light, finished with a colour grade, paper
// texture, a vignette and grain. Presentation only: nothing here reads or writes the sim.
//
// paint(canvas, sceneId, t, text) draws one frame of a scene at time t (seconds since the card
// began); `text` darkens the lower ground so the card's words read over it. Math.random is fine
// here (grain, crackle); the scenes' shapes come from seeded rng() so they're the same every time.

// ── the kit: silhouettes on a 120 × 246 portrait stage ─────────────────────────
export const W = 120, H = 246;
const GROUND = 160, LIFT = 24;
let T = 0;                                                  // the frame's clock, for layers that drift on their own
const BLACK = '#070508';
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hex = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mix = (a, b, t) => { const x = hex(a), y = hex(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const rgba = (h, a) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
const ridgeCache = new Map();
function ridge(seed, y0, amp, rough = 0.55, n = 64, lo = -10, hi = 130) {   // midpoint displacement, cached per seed
  const key = [seed, y0, amp, rough, n].join(); if (ridgeCache.has(key)) return ridgeCache.get(key);
  const r = rng(seed), pts = new Array(n + 1).fill(0); pts[0] = (r() - 0.5) * amp; pts[n] = (r() - 0.5) * amp;
  (function sub(a, b, s) { if (b - a < 2) return; const m = (a + b) >> 1; pts[m] = (pts[a] + pts[b]) / 2 + (r() - 0.5) * s; sub(a, m, s * rough); sub(m, b, s * rough); })(0, n, amp);
  const out = pts.map((v, i) => [lo + ((hi - lo) * i) / n, y0 + v]); ridgeCache.set(key, out); return out;
}
function fillRidge(c, pts, color, bottom = H) { c.fillStyle = color; c.beginPath(); c.moveTo(pts[0][0], bottom); for (const [x, y] of pts) c.lineTo(x, y); c.lineTo(pts[pts.length - 1][0], bottom); c.closePath(); c.fill(); }
function fog(c, y, h, color, a) {                            // a mist band: a soft gradient plus drifting wisps
  const r = rng(Math.round(y * 13 + h));
  for (let i = 0; i < 7; i++) { const cx = ((r() * 170 + T * (0.6 + r())) % 170) - 25, cy = y + (r() - 0.5) * h, rx = 14 + r() * 26, ry = 1.2 + r() * h * 0.35;
    c.save(); c.translate(cx, cy); c.scale(1, ry / rx); const g = c.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba(color, a * 0.7)); g.addColorStop(1, rgba(color, 0)); c.fillStyle = g; c.beginPath(); c.arc(0, 0, rx, 0, 7); c.fill(); c.restore(); }
  fogBand(c, y, h, color, a); }
function fogBand(c, y, h, color, a) { const g = c.createLinearGradient(0, y - h, 0, y + h); g.addColorStop(0, rgba(color, 0)); g.addColorStop(0.5, rgba(color, a)); g.addColorStop(1, rgba(color, 0)); c.fillStyle = g; c.fillRect(-20, y - h, W + 40, h * 2); }
function glow(c, x, y, r, color, a = 0.7) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(color, a)); g.addColorStop(0.35, rgba(color, a * 0.35)); g.addColorStop(1, rgba(color, 0)); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore(); }
function sky(c, stops) { const g = c.createLinearGradient(0, 0, 0, GROUND + 10); for (const [p, col] of stops) g.addColorStop(p, col); c.fillStyle = g; c.fillRect(-20, -20, W + 40, H + 40); }
function stars(c, seed, n, ymax, t) { const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = r() * W, y = r() * ymax * (0.4 + 0.6 * r()), s = r(), tw = 0.55 + 0.45 * Math.sin(t * (1 + s * 2) + i), a = (0.2 + s * 0.6) * tw * (1 - y / (ymax * 1.3));
    c.fillStyle = `rgba(255,244,225,${a})`; const z = s > 0.93 ? 0.7 : 0.35; c.fillRect(x, y, z, z);
    if (s > 0.965) { c.fillStyle = `rgba(255,236,210,${a * 0.5})`; c.fillRect(x - 1.4, y + 0.3, 3.5, 0.12); c.fillRect(x + 0.3, y - 1.4, 0.12, 3.5); glow(c, x + 0.35, y + 0.35, 2.2, '#fff0d8', a * 0.4); } } }
function moon(c, x, y, r, color, crescent = 0) {
  const lx = x + crescent * 0.4; glow(c, lx, y, r * 5, color, crescent ? 0.09 : 0.16); glow(c, lx, y, r * 1.8, color, crescent ? 0.14 : 0.25);
  c.save(); c.beginPath(); c.arc(x, y, r, 0, 7); c.clip();
  if (crescent) { c.fillStyle = rgba(color, 0.08); c.fillRect(x - r, y - r, r * 2, r * 2); c.beginPath(); c.rect(x - r - 1, y - r - 1, r * 2 + 2, r * 2 + 2); c.arc(x - crescent, y - crescent * 0.4, r * 0.92, 0, 7); c.clip('evenodd'); }   // earthshine, then only the lit sliver
  c.fillStyle = color; c.fillRect(x - r, y - r, r * 2, r * 2);
  const mr = rng(77); for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(80,70,90,0.12)'; c.beginPath(); c.arc(x + (mr() - 0.5) * r * 1.6, y + (mr() - 0.5) * r * 1.6, r * (0.1 + mr() * 0.25), 0, 7); c.fill(); }
  const sh = c.createLinearGradient(x - r, y - r, x + r, y + r); sh.addColorStop(0, 'rgba(255,255,255,0.12)'); sh.addColorStop(1, 'rgba(40,30,60,0.25)'); c.fillStyle = sh; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
}
function clouds(c, seed, y, n, color, a, t, drift = 0.6, light = null) {   // painted cloud banks: soft puffs, lit from above
  const r = rng(seed), lit = light || mix(color, '#ffffff', 0.22);
  for (let i = 0; i < n; i++) {
    const cx = ((r() * 160 + t * drift * (0.5 + r())) % 180) - 30, cy = y + r() * 16, w = 16 + r() * 30, puffs = [];
    for (let k = 0; k < 9; k++) puffs.push([cx + (r() - 0.5) * w, cy - Math.abs(r() - 0.5) * w * 0.22, w * (0.14 + r() * 0.14)]);
    for (const [px, py, pr] of puffs) { const g = c.createRadialGradient(px, py - pr * 0.35, 0, px, py - pr * 0.35, pr); g.addColorStop(0, rgba(lit, a * 0.55)); g.addColorStop(1, rgba(lit, 0)); c.fillStyle = g; c.fillRect(px - pr, py - pr * 1.35, pr * 2, pr * 2); }
    for (const [px, py, pr] of puffs) { const g = c.createRadialGradient(px, py + pr * 0.15, 0, px, py + pr * 0.15, pr * 1.05); g.addColorStop(0, rgba(color, a)); g.addColorStop(0.6, rgba(color, a * 0.6)); g.addColorStop(1, rgba(color, 0)); c.fillStyle = g; c.fillRect(px - pr * 1.1, py - pr, pr * 2.2, pr * 2.3); }
  }
}
function rays(c, x, y, len, spread, n, color, a, t, dir = -Math.PI / 2) {   // god rays: soft wedges that breathe
  c.save(); c.globalCompositeOperation = 'lighter'; const r = rng(Math.round(x * 7 + y));
  for (let i = 0; i < n; i++) { const ang = dir + (i / (n - 1) - 0.5) * spread + Math.sin(t * 0.3 + i) * 0.02, w = 0.03 + r() * 0.05, L = len * (0.6 + r() * 0.4), aa = a * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.5 + i * 1.7)));
    const ex = x + Math.cos(ang) * L, ey = y + Math.sin(ang) * L, g = c.createLinearGradient(x, y, ex, ey); g.addColorStop(0, rgba(color, aa)); g.addColorStop(1, rgba(color, 0)); c.fillStyle = g;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(ang - w) * L, y + Math.sin(ang - w) * L); c.lineTo(x + Math.cos(ang + w) * L, y + Math.sin(ang + w) * L); c.closePath(); c.fill(); }
  c.restore();
}
function tufts(c, pts, seed, col, h = 1.8) {                  // grass, weeds and stones along a silhouette's edge
  const r = rng(seed); c.fillStyle = col;
  for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    for (let k = 0; k < 5; k++) { const u = r(), x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u + 0.3;
      if (r() < 0.12) { c.beginPath(); c.ellipse(x, y, 0.8 + r() * 1.4, 0.5 + r() * 0.7, 0, Math.PI, 0); c.fill(); continue; }
      const bh = h * (0.4 + r()), lean = (r() - 0.5) * 1.2 + Math.sin(T * 1.2 + x * 0.3) * 0.25; c.beginPath(); c.moveTo(x - 0.22, y); c.quadraticCurveTo(x + lean * 0.4, y - bh * 0.6, x + lean, y - bh); c.lineTo(x + 0.22, y); c.fill(); } }
}
function smoke(c, x, y, t, color, under = null, n = 9, lean = 0.5, size = 1) {
  for (let i = 0; i < n; i++) { const k = (((t * 0.07 + i / n) % 1) + 1) % 1, px = x + Math.sin(k * 5 + i) * 2 * size + k * 22 * lean, py = y - k * 60 * size, rr = (2.5 + k * 11) * size, a = Math.min(1, k * 6) * (1 - k);
    c.save(); c.translate(px, py); c.scale(1.35, 1); const pg = c.createRadialGradient(0, 0, 0, 0, 0, rr); pg.addColorStop(0, rgba(color, 0.3 * a)); pg.addColorStop(0.5, rgba(color, 0.17 * a)); pg.addColorStop(1, rgba(color, 0));
    c.fillStyle = pg; c.fillRect(-rr, -rr, rr * 2, rr * 2); c.restore();
    if (under && k < 0.5) glow(c, px, py + rr * 0.4, rr, under, 0.22 * (1 - k * 2)); }
}
function embers(c, seed, n, x0, x1, yb, t, rise = 70, color = '#ffb050', dir = -1) {
  const r = rng(seed); c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const sp = 5 + r() * 9, ph = r() * rise, k = ((t * sp + ph) % rise) / rise, x = x0 + r() * (x1 - x0) + Math.sin(t * 1.3 + i) * 3 + k * 8, y = yb + dir * k * rise;
    const a = (1 - k) * (0.5 + r() * 0.5); const hg = c.createRadialGradient(x + 0.25, y + 0.25, 0, x + 0.25, y + 0.25, 1.3); hg.addColorStop(0, rgba(color, a * 0.35)); hg.addColorStop(1, rgba(color, 0)); c.fillStyle = hg; c.fillRect(x - 1.1, y - 1.1, 2.7, 2.7); c.fillStyle = rgba('#fff0d0', a * 0.9); c.fillRect(x, y, 0.5, 0.5); }
  c.restore();
}
function flame(c, x, y, s, t) {
  glow(c, x, y - 4 * s, 55 * s, '#ff7a2a', 0.5); glow(c, x, y - 3 * s, 16 * s, '#ffd08a', 0.6);
  const tongue = (dx, w, h, col, k, a) => { const fl = 1 + 0.18 * Math.sin(t * (7 + k) + k * 3) + 0.08 * Math.sin(t * 19 + k * 5), hh = h * s * fl, bx = x + dx * s, sway = Math.sin(t * 4 + k * 2) * s * 0.9;
    const g = c.createLinearGradient(0, y, 0, y - hh); g.addColorStop(0, rgba(col, a)); g.addColorStop(0.55, rgba(col, a * 0.75)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g;
    c.beginPath(); c.moveTo(bx - w * s, y); c.bezierCurveTo(bx - w * s, y - hh * 0.45, bx - w * 0.3 * s + sway * 0.5, y - hh * 0.75, bx + sway, y - hh); c.bezierCurveTo(bx + w * 0.3 * s + sway * 0.5, y - hh * 0.7, bx + w * s, y - hh * 0.4, bx + w * s, y); c.closePath(); c.fill(); };
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 7; i++) tongue((i - 3) * 0.75, 1.5 + (i % 3) * 0.5, 7 + ((i * 5) % 7), '#ff5a14', i, 0.5);
  for (let i = 0; i < 5; i++) tongue((i - 2) * 0.55, 1.2 + (i % 2) * 0.4, 6 + ((i * 3) % 4), '#ffa040', i + 9, 0.55);
  c.restore(); tongue(0, 1.1, 5.5, '#fff1c8', 20, 0.95); tongue(0.3, 0.6, 3.5, '#ffffff', 21, 0.8);
}
function hooded(c, x, y, s, t, o = {}) {
  const d = o.face || 1, k = 1, wind = Math.sin(t * 1.7 + x) * 0.04 * s;
  c.save(); c.translate(x, y); c.scale(d, 1);
  if (o.kneel) { c.rotate(0.3); c.scale(1.05, 0.7); }          // kneeling: lower, leaning into the light
  const body = () => { c.beginPath(); c.moveTo(-0.3 * s - wind, 0);
    c.quadraticCurveTo(-0.27 * s - wind * 2, -0.42 * s, -0.2 * s, -0.7 * s);                     // the robe's back, blown
    c.quadraticCurveTo(-0.16 * s, -0.9 * s, 0.04 * s, -1.07 * s);                                 // the hood's back, up to a peak leaning forward
    c.quadraticCurveTo(0.13 * s, -1.0 * s, 0.17 * s, -0.88 * s); c.lineTo(0.1 * s, -0.86 * s); c.lineTo(0.11 * s, -0.77 * s);   // the hood's lip, the dark of the face
    c.lineTo(0.19 * s, -0.7 * s); c.lineTo(0.33 * s, -0.6 * s); c.lineTo(0.33 * s, -0.53 * s); c.lineTo(0.18 * s, -0.56 * s);  // a sleeve reaching forward
    c.quadraticCurveTo(0.21 * s, -0.3 * s, 0.3 * s, 0);                                          // the robe's front
    for (let i = 0; i <= 9; i++) c.lineTo(0.3 * s - (0.6 * s * i) / 9, (i % 2 ? -0.045 * s : 0.005 * s));   // a ragged hem
    c.closePath(); c.fill(); };
  if (o.rim) { c.fillStyle = o.rim; c.save(); c.translate(o.rimDx || 0.35, -0.2); body(); c.restore(); }
  c.fillStyle = o.color || BLACK; body();
  if (o.staff) { c.strokeStyle = o.color || BLACK; c.lineWidth = 0.045 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(0.32 * s, 0); c.lineTo(0.27 * s, -1.18 * s * k); c.stroke();
    if (o.lantern) { c.beginPath(); c.moveTo(0.27 * s, -1.18 * s * k); c.lineTo(0.36 * s, -1.1 * s * k); c.stroke(); c.fillStyle = '#ffc070'; c.fillRect(0.33 * s, -1.08 * s * k, 0.08 * s, 0.1 * s); glow(c, 0.37 * s, -1.03 * s * k, 0.9 * s, '#ffb050', 0.55); } }
  if (o.point) { c.strokeStyle = o.color || BLACK; c.lineWidth = 0.05 * s; c.beginPath(); c.moveTo(0.12 * s, -0.7 * s * k); c.lineTo(0.42 * s, -0.86 * s * k); c.stroke(); }
  c.restore();
}
function skeleton(c, x, y, s, t, o = {}) {       // the Ashbound: rib cage, skull, lit eyes (canon: eye glow reads rank)
  const d = o.face || 1, pose = o.pose || 'stand', col = o.color || BLACK, step = pose === 'march' ? Math.sin(t * 6 + (o.phase || 0)) : 0;
  if (o.rim) { skeleton(c, x + (o.rimDx ?? 0.35), y - 0.25, s, t, { ...o, rim: null, eyes: null, color: o.rim }); }
  c.save(); c.translate(x, y); c.scale(d, 1);
  if (pose === 'fallen') { c.rotate(-Math.PI / 2 + (o.tilt || 0.08)); c.translate(0.1 * s, 0.05 * s); }
  const crouch = pose === 'rise' ? (o.rise ?? 0.6) : 1, bob = pose === 'march' ? Math.abs(step) * 0.03 * s : 0;
  c.translate(0, -bob);
  c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
  const hip = -0.46 * s * (0.55 + 0.45 * crouch), neck = hip - 0.36 * s;
  c.lineWidth = 0.055 * s;                                     // legs
  for (const side of [-1, 1]) { const sw = step * side * 0.12 * s, knee = crouch < 1 ? 0.14 * s * (1 - crouch) * 2 : 0; c.beginPath(); c.moveTo(0.02 * s * side, hip); c.lineTo(sw + knee * side * 0.4 + 0.04 * s, hip * 0.5 - knee * 0.3); c.lineTo(sw * 1.2 + 0.02 * s * side, 0); c.stroke(); }
  c.lineWidth = 0.045 * s; c.beginPath(); c.moveTo(0, hip); c.lineTo(0, neck); c.stroke();          // spine
  c.save(); c.lineWidth = 0.035 * s; for (let i = 0; i < 4; i++) { const ry = neck + 0.06 * s + i * 0.065 * s, rw = 0.13 * s - i * 0.012 * s; c.beginPath(); c.ellipse(0, ry, rw, 0.035 * s, 0, Math.PI * 0.05, Math.PI * 0.95); c.stroke(); } c.restore();   // ribs
  c.beginPath(); c.ellipse(0, hip + 0.02 * s, 0.09 * s, 0.035 * s, 0, 0, Math.PI * 2); c.fill();   // pelvis
  c.lineWidth = 0.04 * s;                                      // arms
  const armUp = pose === 'rise' && (o.reach ?? 0) > 0;
  c.beginPath(); c.moveTo(-0.12 * s, neck + 0.04 * s); c.lineTo(-0.16 * s - step * 0.05 * s, neck + 0.2 * s); c.lineTo(-0.12 * s, neck + 0.36 * s); c.stroke();
  c.beginPath(); c.moveTo(0.12 * s, neck + 0.04 * s); if (armUp) { c.lineTo(0.22 * s, neck - 0.12 * s); c.lineTo(0.26 * s, neck - 0.32 * s); } else { c.lineTo(0.17 * s, neck + 0.18 * s); c.lineTo(0.2 * s, neck + 0.3 * s); } c.stroke();
  c.beginPath(); c.arc(0.02 * s, neck - 0.1 * s, 0.1 * s, 0, Math.PI * 2); c.fill(); c.fillRect(-0.03 * s, neck - 0.04 * s, 0.1 * s, 0.05 * s);   // skull, jaw
  if (o.spear) { c.lineWidth = 0.03 * s; const tip = pose === 'fallen' ? [0.9 * s, -0.2 * s] : [0.26 * s + 0.1 * s, -1.25 * s]; c.beginPath(); c.moveTo(0.2 * s, neck + 0.3 * s); c.lineTo(tip[0], tip[1]); c.stroke(); c.beginPath(); c.moveTo(tip[0], tip[1] - 0.1 * s); c.lineTo(tip[0] - 0.04 * s, tip[1] + 0.04 * s); c.lineTo(tip[0] + 0.04 * s, tip[1] + 0.04 * s); c.closePath(); c.fill(); }
  if (o.shield) { c.beginPath(); c.ellipse(-0.18 * s, neck + 0.22 * s, 0.07 * s, 0.15 * s, 0, 0, Math.PI * 2); c.fill(); }
  if (o.eyes) { const e = o.eyes; c.save(); c.globalCompositeOperation = 'lighter'; for (const ex of [-0.01, 0.06]) { c.fillStyle = '#fff0c8'; c.fillRect((ex - 0.012) * s, neck - 0.118 * s, 0.024 * s, 0.02 * s); glow(c, ex * s, neck - 0.11 * s, Math.min(1.6, 0.06 * s), e, 0.85); } c.restore(); }
  c.restore();
}
function hero(c, kind, x, y, s, t, rim) {           // the three who got Emberfall: knight, rogue, mage
  const paths = {
    knight: () => { c.beginPath(); c.moveTo(-0.24 * s, 0); c.lineTo(-0.2 * s, -0.46 * s); c.lineTo(-0.3 * s, -0.62 * s); c.lineTo(-0.26 * s, -0.7 * s); c.lineTo(-0.12 * s, -0.74 * s);   // cape hem, pauldron
        c.lineTo(-0.11 * s, -0.8 * s); c.quadraticCurveTo(-0.12 * s, -0.98 * s, 0, -0.99 * s); c.quadraticCurveTo(0.12 * s, -0.98 * s, 0.11 * s, -0.8 * s);   // the helm
        c.lineTo(0.12 * s, -0.74 * s); c.lineTo(0.26 * s, -0.7 * s); c.lineTo(0.3 * s, -0.62 * s); c.lineTo(0.2 * s, -0.46 * s); c.lineTo(0.2 * s, 0); c.lineTo(0.06 * s, 0); c.lineTo(0.03 * s, -0.24 * s); c.lineTo(-0.03 * s, -0.24 * s); c.lineTo(-0.08 * s, 0); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(0, -0.99 * s); c.quadraticCurveTo(-0.14 * s, -1.14 * s, -0.24 * s, -1.02 * s); c.quadraticCurveTo(-0.12 * s, -1.06 * s, -0.02 * s, -0.95 * s); c.fill();   // the crest
        c.beginPath(); c.ellipse(-0.3 * s, -0.44 * s, 0.15 * s, 0.22 * s, 0.1, 0, 7); c.fill();                        // the shield
        c.fillRect(0.285 * s, -0.54 * s, 0.035 * s, 0.56 * s); c.fillRect(0.2 * s, -0.54 * s, 0.21 * s, 0.035 * s); c.fillRect(0.29 * s, -0.66 * s, 0.025 * s, 0.12 * s); },   // the sword, point down
    rogue: () => { c.beginPath(); c.moveTo(-0.26 * s, 0); c.quadraticCurveTo(-0.24 * s, -0.5 * s, -0.14 * s, -0.74 * s); c.quadraticCurveTo(-0.12 * s, -1.04 * s, 0.04 * s, -1.06 * s); c.lineTo(0.15 * s, -0.86 * s); c.quadraticCurveTo(0.2 * s, -0.5 * s, 0.24 * s, 0); for (let i = 0; i <= 6; i++) c.lineTo(0.24 * s - (0.5 * s * i) / 6, i % 2 ? -0.04 * s : 0); c.closePath(); c.fill();
      c.lineWidth = 0.04 * s; c.strokeStyle = c.fillStyle; c.beginPath(); c.moveTo(-0.2 * s, -0.95 * s); c.lineTo(0.28 * s, -0.55 * s); c.stroke(); },
    mage: () => { c.beginPath(); c.moveTo(-0.26 * s, 0); c.quadraticCurveTo(-0.2 * s, -0.5 * s, -0.14 * s, -0.8 * s); c.lineTo(-0.34 * s, -0.84 * s); c.lineTo(-0.06 * s, -0.92 * s); c.quadraticCurveTo(0.02 * s, -1.2 * s, 0.24 * s, -1.26 * s); c.quadraticCurveTo(0.08 * s, -1.08 * s, 0.1 * s, -0.94 * s); c.lineTo(0.34 * s, -0.86 * s); c.lineTo(0.14 * s, -0.8 * s); c.quadraticCurveTo(0.2 * s, -0.5 * s, 0.26 * s, 0); c.closePath(); c.fill();
      c.lineWidth = 0.035 * s; c.strokeStyle = c.fillStyle; c.beginPath(); c.moveTo(0.34 * s, 0); c.lineTo(0.3 * s, -1.1 * s); c.stroke(); },
  };
  c.save(); c.translate(x, y); if (rim) { c.fillStyle = rim; c.strokeStyle = rim; c.save(); c.translate(-0.35, -0.25); paths[kind](); c.restore(); } c.fillStyle = BLACK; c.strokeStyle = BLACK; paths[kind](); c.restore();
  if (kind === 'mage') { glow(c, x + 0.3 * s, y - 1.12 * s, 0.35 * s, '#9ab8ff', 0.8); c.fillStyle = '#dfe8ff'; c.fillRect(x + 0.29 * s, y - 1.13 * s, 0.03 * s, 0.03 * s); }
}
function throne(c, cx, base, col, lit, t) {             // the Ember Throne: stepped, buttressed, a brazier crown
  const tiers = [[34, 22], [25, 17], [17, 16], [11, 15], [5, 14]], wr = rng(91); let y = base;
  c.fillStyle = col;
  for (const [hw, h] of tiers) { c.beginPath(); c.moveTo(cx - hw - 3, y); c.lineTo(cx - hw, y - h); c.lineTo(cx + hw, y - h); c.lineTo(cx + hw + 3, y); c.closePath(); c.fill();
    for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(cx + sx * (hw + 3), y); c.lineTo(cx + sx * (hw + 7), y); c.lineTo(cx + sx * hw, y - h * 0.8); c.closePath(); c.fill(); }
    c.fillStyle = 'rgba(0,0,0,0.22)'; c.beginPath(); c.moveTo(cx + hw * 0.15, y - h); c.lineTo(cx + hw, y - h); c.lineTo(cx + hw + 3, y); c.lineTo(cx + hw * 0.2, y); c.fill();   // the shadowed side
    c.fillStyle = lit ? 'rgba(255,150,70,0.45)' : 'rgba(150,170,200,0.3)'; c.fillRect(cx - hw, y - h, hw * 1.2, 0.5);                                // light along each ledge
    if (lit !== null) for (let wx = -hw + 3 + wr() * 3; wx <= hw - 3; wx += 3.5 + wr() * 5) { if (wr() < 0.25) continue; const tall = wr() < 0.7, wh = tall ? h * (0.28 + wr() * 0.1) : 1.4, wy = y - h * 0.3;
      const wc = ['#ff9a3a', '#ffb050', '#ff7a2a', '#ffc870', '#e0602a'][(wr() * 5) | 0], dim = wr() < 0.3 ? 0.45 : 1, fl = 0.8 + 0.2 * Math.sin(t * (2 + wx * 0.3) + wx);
      c.fillStyle = lit ? rgba(wc, dim * fl) : rgba('#000000', 0.35); c.beginPath(); c.moveTo(cx + wx - 0.7, wy); c.lineTo(cx + wx - 0.7, wy - wh); c.arc(cx + wx, wy - wh, 0.7, Math.PI, 0); c.lineTo(cx + wx + 0.7, wy); c.fill(); if (lit && dim === 1) glow(c, cx + wx, wy - wh * 0.5, 3.2, wc, 0.3 * fl); c.fillStyle = col; }
    c.fillStyle = col; y -= h; }
  c.fillStyle = col; for (const sx of [-1, 1]) {                                                         // statues at the foot, arms raised to the flame
    const bx = cx + sx * 30; c.fillRect(bx - 2.5, base - 4, 5, 4); c.beginPath(); c.moveTo(bx - 1.6, base - 4); c.lineTo(bx - 1.2, base - 13); c.lineTo(bx + 1.2, base - 13); c.lineTo(bx + 1.6, base - 4); c.fill();
    c.beginPath(); c.arc(bx, base - 14.2, 1.3, 0, 7); c.fill(); c.lineWidth = 0.7; c.strokeStyle = col; c.beginPath(); c.moveTo(bx - 1, base - 12); c.lineTo(bx - 2.6 * sx - 0.6, base - 17); c.moveTo(bx + 1, base - 12); c.lineTo(bx + 1.6 - sx, base - 17.5); c.stroke(); }
  for (const [tx, ty, h] of [[-14, base - 38, 11], [14, base - 38, 11], [-8, base - 54, 8], [8, base - 54, 8]]) {   // banners down the tiers
    c.fillStyle = lit ? '#6a1a10' : '#1c222c'; c.beginPath(); c.moveTo(cx + tx - 1.6, ty); c.lineTo(cx + tx + 1.6, ty); c.lineTo(cx + tx + 1.6, ty + h); c.lineTo(cx + tx, ty + h - 1.6); c.lineTo(cx + tx - 1.6, ty + h); c.fill();
    if (lit) { c.fillStyle = '#d88a3a'; c.fillRect(cx + tx - 0.5, ty + 2, 1, 1); } }
  if (lit) for (const sx of [-1, 1]) { const bx = cx + sx * 37; c.fillStyle = col; c.fillRect(bx - 0.6, base - 10, 1.2, 10); c.fillRect(bx - 1.6, base - 11, 3.2, 1.2); flame(c, bx, base - 11, 0.35, T + sx); }
  c.fillStyle = col;
  c.beginPath(); c.moveTo(cx - 3, y); c.lineTo(cx, y - 14); c.lineTo(cx + 3, y); c.fill();             // spire
  c.beginPath(); c.moveTo(cx - 7, y - 12); c.quadraticCurveTo(cx, y - 7, cx + 7, y - 12); c.lineTo(cx + 5, y - 15); c.lineTo(cx - 5, y - 15); c.closePath(); c.fill();   // brazier bowl
  return y - 15;
}
function skyline(c, seed, y, col) { const r = rng(seed); c.fillStyle = col; let x = -12; while (x < 132) { const w = 5 + r() * 9, h = 4 + r() * 12; c.fillRect(x, y - h, w, h + 40); if (r() < 0.35) { c.beginPath(); c.arc(x + w / 2, y - h, w / 2, Math.PI, 0); c.fill(); } else if (r() < 0.4) { c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + w / 2, y - h - 7); c.lineTo(x + w, y - h); c.fill(); } x += w + r() * 3; } }
function chimney(c, x, base, h, w, col) { c.fillStyle = col; c.beginPath(); c.moveTo(x - w, base); c.lineTo(x - w * 0.7, base - h); c.lineTo(x + w * 0.7, base - h); c.lineTo(x + w, base); c.fill(); c.fillRect(x - w * 0.9, base - h - 1.5, w * 1.8, 1.5); }
function house(c, x, base, w, h, col, lit, t, o = {}) {
  c.fillStyle = col; c.fillRect(x, base - h, w, h); c.beginPath(); c.moveTo(x - 2.5, base - h); c.lineTo(x + w / 2, base - h - w * 0.62); c.lineTo(x + w + 2.5, base - h); c.closePath(); c.fill();
  if (o.chimney) { c.fillRect(x + w * 0.7, base - h - w * 0.5, 2.4, w * 0.35); smoke(c, x + w * 0.7 + 1.2, base - h - w * 0.5, t + x, '#3a2a30', null, 6, 0.4, 0.5); }
  if (lit) for (const [wx, wy] of o.windows || [[0.25, 0.4], [0.62, 0.4]]) { const px = x + w * wx, py = base - h + h * wy; c.fillStyle = '#ffc36a'; c.fillRect(px, py, 2.6, 3.2); glow(c, px + 1.3, py + 1.6, 7, '#ffb050', 0.35); c.fillStyle = col; c.fillRect(px + 1.15, py, 0.3, 3.2); c.fillRect(px, py + 1.45, 2.6, 0.3); }
}
function ground(c, seed, y, amp = 3) { const pts = ridge(seed, y, amp, 0.55, 64); fillRidge(c, pts, BLACK); tufts(c, pts, seed + 1, BLACK, 2.2); }

// scenes: draw(c, t, pan) — pan shifts each layer by its depth
const L = (c, pan, depth, fn) => { c.save(); c.translate(pan * depth, 0); fn(); c.restore(); };
const SCENES = [
  // 1 · the Kindling: a crater in the Pale Heights, a fire on nothing, pilgrims kneeling
  (c, t, pan) => {
    const HZ = '#6a3450';
    sky(c, [[0, '#07061a'], [0.45, '#1c1840'], [0.78, '#4a2848'], [1, HZ]]); stars(c, 11, 170, 120, t);
    L(c, pan, 0.05, () => { moon(c, 80, 44, 5, '#f4ead4', 3.5); clouds(c, 3, 70, 5, '#1c1638', 0.6, t, 0.3); });
    L(c, pan, 0.15, () => { fillRidge(c, ridge(2, 118, 34, 0.58), mix(HZ, BLACK, 0.45)); fog(c, 124, 10, '#6a3a5a', 0.35); });
    L(c, pan, 0.3, () => { fillRidge(c, ridge(5, 134, 18, 0.55), mix(HZ, BLACK, 0.72)); fog(c, 140, 7, '#8a4a4a', 0.3); });
    L(c, pan, 0.5, () => {
      glow(c, 60, 150, 90, '#ff6a20', 0.5); rays(c, 60, 148, 120, 0.9, 9, '#ffa860', 0.16, t);
      flame(c, 60, 151, 1.9, t); embers(c, 3, 56, 44, 76, 146, t, 130);
      const lip = [[-10, 156], [10, 152], [30, 148], [44, 147], [52, 151], [60, 153], [68, 151], [76, 147], [90, 148], [110, 152], [130, 156]];
      c.save(); c.fillStyle = '#ffb060'; c.beginPath(); c.moveTo(-10, H); for (const [x, y] of lip) c.lineTo(x, y - 1.1 * Math.max(0, 1 - Math.abs(x - 60) / 34)); c.lineTo(130, H); c.fill(); c.restore();
      c.fillStyle = BLACK; c.beginPath(); c.moveTo(-10, H); for (const [x, y] of lip) c.lineTo(x, y); c.lineTo(130, H); c.fill(); });
    L(c, pan, 1, () => { ground(c, 7, GROUND, 4);
      hooded(c, 13, 164, 27, t, { staff: true, lantern: true, rim: '#ff8a3a', rimDx: 0.5 }); hooded(c, 32, 161, 22, t, { kneel: true, rim: '#ff8a3a', rimDx: 0.5 });
      hooded(c, 86, 161, 22, t, { face: -1, kneel: true, rim: '#ff8a3a', rimDx: -0.5 }); hooded(c, 106, 165, 28, t, { face: -1, staff: true, point: true, rim: '#ff8a3a', rimDx: -0.5 }); });
  },
  // 2 · the Solmere Empire: the Ember Throne ablaze, forges at full blast, the Third Legion on the march
  (c, t, pan) => { empire(c, t, pan, true); },
  // 3 · the Fall: the same frame, after. The flame out, the forges cold, the legion down.
  (c, t, pan) => { empire(c, t, pan, false); },
  // 4 · the Long Dim: a broken arch, a fallen emperor's head, one cart on the Wickham road, rain
  (c, t, pan) => {
    sky(c, [[0, '#1a1e22'], [0.5, '#3a4444'], [0.85, '#76827a'], [1, '#98a092']]);
    L(c, pan, 0.05, () => { clouds(c, 12, 30, 8, '#20262a', 0.7, t, 0.5); clouds(c, 13, 58, 7, '#2a3232', 0.5, t, 0.8); });
    L(c, pan, 0.15, () => { fillRidge(c, ridge(14, 128, 10, 0.5), '#5a6660'); fog(c, 132, 8, '#8a9690', 0.4); });
    L(c, pan, 0.25, () => { c.fillStyle = '#4a5452'; c.beginPath(); c.moveTo(64, 142); c.lineTo(65, 110); c.lineTo(66.5, 106); c.lineTo(68, 108.5); c.lineTo(69.5, 104.5); c.lineTo(71, 107.5); c.lineTo(72, 142); c.fill();   // a watchtower, its top gone
      c.fillStyle = '#66706c'; c.fillRect(67.3, 116, 1.3, 2.6); c.fillRect(67.3, 126, 1.3, 2.2); fog(c, 128, 6, '#8a9690', 0.3); });
    L(c, pan, 0.35, () => { fillRidge(c, ridge(15, 140, 8, 0.5), '#3a4440'); fog(c, 146, 6, '#7a8680', 0.35);
      const tree = (x, y, len, a, d) => { if (d === 0) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; c.lineWidth = d * 0.35; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke(); tree(x2, y2, len * 0.72, a - 0.45, d - 1); tree(x2, y2, len * 0.68, a + 0.38, d - 1); };
      c.strokeStyle = '#242a28'; c.lineCap = 'round'; tree(104, 150, 11, -Math.PI / 2 - 0.1, 6); });
    L(c, pan, 0.08, () => { c.strokeStyle = '#1a1e20'; c.lineWidth = 0.5; c.lineCap = 'round'; for (let i = 0; i < 5; i++) { const x = ((t * 3 + i * 23) % 150) - 15, y = 44 + i * 5 + Math.sin(t + i) * 2, f = Math.sin(t * 6 + i) * 0.8; c.beginPath(); c.moveTo(x - 2, y - f); c.quadraticCurveTo(x - 1, y - 1, x, y); c.quadraticCurveTo(x + 1, y - 1, x + 2, y - f); c.stroke(); } });
    L(c, pan, 0.6, () => { const col = '#161a1a'; c.fillStyle = col;
      c.fillRect(2, 84, 9, 72); c.fillRect(0.5, 81, 12, 3.5); c.fillRect(1, 151, 11, 5);                                                  // a Solmere gate: the left pillar whole
      c.beginPath(); c.moveTo(31, 156); c.lineTo(31, 100); c.lineTo(32.5, 97); c.lineTo(34, 99); c.lineTo(36, 95.5); c.lineTo(38, 98.5); c.lineTo(40, 96.8); c.lineTo(40, 156); c.fill(); c.fillRect(30, 151, 11, 5);   // the right, snapped
      const ax = 21, ay = 81, R = 19, r0 = 10, a0 = Math.PI, a1 = Math.PI * 1.43;                                                       // the arch, broken before its keystone
      c.beginPath(); c.arc(ax, ay, R, a0, a1); c.lineTo(ax + Math.cos(a1 - 0.05) * (r0 + 6), ay + Math.sin(a1 - 0.05) * (r0 + 6)); c.lineTo(ax + Math.cos(a1 + 0.03) * (r0 + 3), ay + Math.sin(a1 + 0.03) * (r0 + 3)); c.arc(ax, ay, r0, a1 - 0.09, a0, true); c.closePath(); c.fill();
      c.strokeStyle = '#262c2c'; c.lineWidth = 0.3; for (let k = 1; k < 5; k++) { const a = a0 + k * 0.1 * Math.PI; c.beginPath(); c.moveTo(ax + Math.cos(a) * r0, ay + Math.sin(a) * r0); c.lineTo(ax + Math.cos(a) * R, ay + Math.sin(a) * R); c.stroke(); }
      c.strokeStyle = col; c.lineWidth = 0.35; for (const [vx, vl] of [[7, 9], [12.5, 14], [16, 6]]) { const vy = ay - Math.sqrt(Math.max(0, r0 * r0 - (vx - ax) * (vx - ax))) + 0.5, sw = Math.sin(t * 0.9 + vx) * 0.8; c.beginPath(); c.moveTo(vx, vy); c.quadraticCurveTo(vx + sw * 0.4, vy + vl * 0.5, vx + sw, vy + vl); c.stroke(); }   // ivy hanging from the soffit
      for (const [x, y] of [[4, 80.5], [8, 80], [34.6, 95.1]]) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 0.7, y - 1.4); c.lineTo(x + 1.6, y - 0.9); c.lineTo(x + 1.3, y); c.fill(); }   // crows at rest
      for (const [x, y, w, h, a] of [[45, 154, 6, 3.6, 0.25], [52, 155.5, 4, 2.6, -0.4], [17, 154.5, 5, 3, -0.15]]) { c.save(); c.translate(x, y); c.rotate(a); c.fillRect(-w / 2, -h / 2, w, h); c.restore(); }   // fallen voussoirs
      c.save(); c.translate(98, 156); c.fillStyle = col;                                                   // a Solmere emperor, headless, his sword broken, on a cracked plinth
      c.fillRect(-7, -5, 14, 5); c.fillRect(-5.5, -8, 11, 3);                                              // the plinth
      c.beginPath(); c.moveTo(-3.6, -8); c.lineTo(-3, -22); c.lineTo(-4.6, -30); c.lineTo(-2, -33); c.lineTo(2, -33); c.lineTo(4.4, -30); c.lineTo(3, -22); c.lineTo(3.6, -8); c.closePath(); c.fill();   // robed body
      c.beginPath(); c.moveTo(2, -32); c.lineTo(8, -40); c.lineTo(9, -39); c.lineTo(3.8, -30); c.fill(); c.fillRect(7.6, -45, 1.1, 6); c.fillRect(6.4, -40.6, 3.6, 0.9);   // raised arm, a broken sword
      c.beginPath(); c.moveTo(-1.5, -33); c.lineTo(-0.6, -34.4); c.lineTo(0.8, -34); c.lineTo(1.5, -33); c.fill();                       // the neck's stump
      c.beginPath(); c.arc(-12, -2.4, 2.6, 0, Math.PI * 2); c.fill(); c.beginPath(); c.moveTo(-14.6, -2.6); c.lineTo(-15.8, -1.8); c.lineTo(-14.4, -1.4); c.fill();   // his head, in the grass
      c.strokeStyle = '#5a6660'; c.lineWidth = 0.3; c.beginPath(); c.moveTo(-1, -26); c.lineTo(0.6, -20); c.lineTo(-0.4, -14); c.stroke(); c.restore(); });
    L(c, pan, 1, () => { ground(c, 16, GROUND - 4, 3);
      const rg = c.createLinearGradient(0, GROUND - 5, 0, 212); rg.addColorStop(0, '#4a5450'); rg.addColorStop(0.35, '#262c2a'); rg.addColorStop(1, rgba(BLACK, 0));   // the Wickham road, wet, running into the dark
      c.fillStyle = rg; c.beginPath(); c.moveTo(56, GROUND - 5); c.lineTo(62, GROUND - 5); c.quadraticCurveTo(84, 188, 78, 212); c.lineTo(22, 212); c.quadraticCurveTo(48, 188, 56, GROUND - 5); c.fill();
      c.strokeStyle = 'rgba(7,5,8,0.45)'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(58, GROUND - 5); c.quadraticCurveTo(54, 186, 40, 210); c.moveTo(60, GROUND - 5); c.quadraticCurveTo(68, 186, 62, 210); c.stroke();   // ruts
      for (const [px, py, pr, i] of [[58, 172, 3.5, 0], [51, 186, 5.5, 1], [64, 194, 4.5, 2]]) { const fade = 1 - (py - 160) / 50, pg = c.createRadialGradient(px, py, 0, px, py, pr);   // puddles holding the sky
        pg.addColorStop(0, rgba('#9aa69e', 0.35 * fade)); pg.addColorStop(1, rgba('#9aa69e', 0)); c.save(); c.translate(0, py); c.scale(1, 0.3); c.translate(0, -py); c.fillStyle = pg; c.beginPath(); c.arc(px, py, pr, 0, 7); c.fill();
        const k = (t * 0.9 + i * 0.37) % 1; c.strokeStyle = rgba('#c8d2cc', 0.35 * (1 - k) * fade); c.lineWidth = 0.5; c.beginPath(); c.arc(px + (i - 1) * 1.2, py, pr * 0.7 * k, 0, 7); c.stroke(); c.restore(); }
      c.save(); const cx = 42 + Math.min(t, 40) * 0.35, k = '#0c0b0c', gait = t * 5; c.translate(cx, GROUND - 7); c.scale(1.9, 1.9);   // a carter and his mule, going nowhere quickly
      c.fillStyle = k; c.strokeStyle = k; c.lineCap = 'round'; c.lineJoin = 'round';
      c.fillRect(-4, -3.6, 8, 2.2); c.beginPath(); c.moveTo(-3.6, -3.6); c.quadraticCurveTo(-1, -6.4, 2.8, -3.6); c.fill();                      // the cart, its load under a sheet
      c.lineWidth = 0.35; c.beginPath(); c.moveTo(3.5, -2.2); c.lineTo(7, -2); c.stroke();                                                         // the shafts
      c.beginPath(); c.arc(-0.8, -0.2, 1.8, 0, 7); c.stroke(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 - t * 1.2; c.beginPath(); c.moveTo(-0.8, -0.2); c.lineTo(-0.8 + Math.cos(a) * 1.8, -0.2 + Math.sin(a) * 1.8); c.stroke(); }   // a spoked wheel, turning
      c.lineWidth = 0.45; for (const [lx, ph] of [[6.9, 0], [7.5, Math.PI], [10, Math.PI], [10.6, 0]]) { const sw = Math.sin(gait + ph) * 0.5; c.beginPath(); c.moveTo(lx, -1.8); c.lineTo(lx + sw * 0.5, -0.1); c.lineTo(lx + sw, 1.6); c.stroke(); }
      c.beginPath(); c.ellipse(8.7, -2.3, 2.5, 1.2, 0, 0, 7); c.fill();                                                                           // the mule: barrel, neck, long head, ears, tail
      c.beginPath(); c.moveTo(10.2, -3.2); c.lineTo(11.5, -5); c.lineTo(13.5, -3.6); c.lineTo(13.2, -3); c.lineTo(11.9, -3.5); c.lineTo(11, -1.8); c.fill();
      c.beginPath(); c.moveTo(11.3, -4.8); c.lineTo(10.9, -6.5); c.lineTo(11.8, -5); c.moveTo(11.8, -4.8); c.lineTo(11.9, -6.4); c.lineTo(12.3, -4.7); c.fill();
      c.lineWidth = 0.3; c.beginPath(); c.moveTo(6.3, -2.7); c.quadraticCurveTo(5.6, -1.7, 5.9, -0.3); c.stroke();
      hooded(c, -1.4, -3.6, 4.8, t, { color: k }); c.restore();
      c.strokeStyle = 'rgba(200,210,215,0.28)'; c.lineWidth = 0.25; const r = rng(4); for (let i = 0; i < 70; i++) { const x = r() * 140 - 10, y = ((t * 90 + r() * 260) % 260) - 10; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 1.2, y + 5); c.stroke(); } });
  },
  // 5 · Year 301: forges smoking again, a barrow cracked open, the Third Legion standing up
  (c, t, pan) => {
    sky(c, [[0, '#08040e'], [0.45, '#241030'], [0.75, '#6a2034'], [1, '#e2602a']]); stars(c, 33, 60, 70, t);
    L(c, pan, 0.08, () => { clouds(c, 21, 44, 6, '#1a0a1a', 0.7, t, 0.4); });
    L(c, pan, 0.18, () => { fillRidge(c, ridge(22, 124, 12, 0.5), '#3a1628');
      for (const [x, h] of [[78, 22], [88, 30], [99, 20], [108, 26]]) { chimney(c, x, 126, h, 2.2, '#3a1628'); glow(c, x, 126 - h, 9, '#ff7a2a', 0.5); smoke(c, x, 126 - h, t + x, '#2a1420', '#ff7a2a', 9, 0.6, 0.9); } embers(c, 8, 14, 74, 112, 100, t, 50); fog(c, 130, 8, '#a03a30', 0.35); });
    L(c, pan, 0.4, () => { fillRidge(c, ridge(23, 142, 9, 0.5), '#1c0c16'); for (const x of [14, 22, 40]) { c.fillStyle = '#1c0c16'; c.fillRect(x, 128, 2.5, 12); } });
    L(c, pan, 1, () => {
      c.fillStyle = BLACK; c.beginPath(); c.moveTo(-10, H); c.lineTo(-10, 136); c.quadraticCurveTo(24, 118, 58, 150); c.lineTo(130, 156); c.lineTo(130, H); c.fill();
      c.fillRect(20, 128, 3, 16); c.fillRect(33, 128, 3, 16); c.fillRect(18, 125, 20, 3.5);
      glow(c, 28, 138, 34, '#ff6a20', 0.55); rays(c, 28, 136, 60, 1.1, 7, '#ff9a4a', 0.12, t, -Math.PI / 2 - 0.2); c.fillStyle = '#ff8a3a'; c.fillRect(23, 128.5, 10, 15.5); c.fillStyle = '#ffd08a'; c.fillRect(25, 133, 6, 11);
      skeleton(c, 28, 144, 12, t, { eyes: '#ffb050', color: BLACK });
      ground(c, 24, GROUND, 3);
      c.fillStyle = BLACK; c.beginPath(); c.moveTo(100, GROUND); c.lineTo(100, GROUND - 8); c.quadraticCurveTo(103, GROUND - 11, 106, GROUND - 8); c.lineTo(106, GROUND); c.fill();
      const rise = (k) => Math.min(1, Math.max(0.25, 0.25 + (t * 0.08 + k) % 1.2));
      skeleton(c, 50, GROUND + 2, 24, t, { pose: 'rise', rise: rise(0.1), reach: 1, eyes: '#ffb050', rim: '#ff7a3a' });
      skeleton(c, 70, GROUND + 3, 32, t, { spear: true, shield: true, eyes: '#ff9a3a', rim: '#ff7a3a' });
      skeleton(c, 90, GROUND + 2, 25, t, { pose: 'rise', rise: rise(0.5), eyes: '#ffb050', face: -1, rim: '#ff7a3a', rimDx: -0.35 });
      skeleton(c, 110, GROUND + 2, 20, t, { pose: 'rise', rise: rise(0.8), eyes: '#ff8a3a', rim: '#ff7a3a' });
      c.fillStyle = BLACK; c.lineCap = 'round'; c.strokeStyle = BLACK; c.lineWidth = 0.8; c.beginPath(); c.moveTo(91, GROUND + 1); c.lineTo(92, GROUND - 5); c.lineTo(90, GROUND - 8); c.moveTo(92, GROUND - 5); c.lineTo(94, GROUND - 8); c.stroke();
      embers(c, 12, 16, 10, 110, GROUND, t, 60); });
  },
  // 6 · Thornwick at dusk: lit windows, the well, three silhouettes who are, apparently, it
  (c, t, pan) => {
    sky(c, [[0, '#0a0a1e'], [0.4, '#28224a'], [0.75, '#8a4a3e'], [1, '#e89a52']]); stars(c, 51, 50, 60, t);
    L(c, pan, 0.1, () => { clouds(c, 31, 70, 5, '#2a1a30', 0.45, t, 0.3); fillRidge(c, ridge(32, 132, 8, 0.5), '#3a2a3a'); fog(c, 136, 6, '#c07050', 0.3); });
    L(c, pan, 0.3, () => { const col = '#1a1420'; c.fillStyle = col; c.fillRect(56, 104, 7, 34); c.beginPath(); c.moveTo(55, 104); c.lineTo(59.5, 88); c.lineTo(64, 104); c.fill(); glow(c, 59.5, 110, 6, '#ffb050', 0.5); c.fillStyle = '#ffc36a'; c.fillRect(58.5, 108, 2, 3);
      house(c, 40, 140, 12, 14, col, true, t); house(c, 70, 140, 13, 12, col, true, t, { chimney: true }); fog(c, 142, 5, '#a06048', 0.25); });
    L(c, pan, 0.6, () => { const col = '#0e0b12'; house(c, -4, 152, 26, 34, col, true, t, { chimney: true, windows: [[0.2, 0.3], [0.6, 0.3], [0.62, 0.66]] }); house(c, 96, 152, 28, 38, col, true, t, { chimney: true, windows: [[0.2, 0.3], [0.58, 0.3], [0.2, 0.66]] });
      c.fillStyle = col; c.fillRect(94, 118, 6, 1); c.fillRect(94, 118, 0.6, 3); c.fillRect(89, 121, 9, 6); c.fillStyle = '#3a2a24'; c.fillRect(90, 122, 7, 4); c.fillStyle = col; c.beginPath(); c.ellipse(93.5, 124, 2, 1, 0, 0, 7); c.fill(); });
    L(c, pan, 1, () => { ground(c, 41, GROUND, 2);
      c.fillStyle = BLACK; c.beginPath(); c.ellipse(60, GROUND - 3, 7, 2.5, 0, 0, 7); c.fill(); c.fillRect(53, GROUND - 7, 14, 5); c.fillRect(54, GROUND - 19, 1.2, 13); c.fillRect(65, GROUND - 19, 1.2, 13); c.beginPath(); c.moveTo(51, GROUND - 18); c.lineTo(60, GROUND - 24); c.lineTo(69, GROUND - 18); c.fill();
      c.fillRect(22, GROUND - 26, 1, 26); c.fillRect(22, GROUND - 26, 4, 0.8); c.fillStyle = '#ffd08a'; c.fillRect(24.6, GROUND - 25, 1.6, 2.2); glow(c, 25.4, GROUND - 24, 26, '#ffb050', 0.5); rays(c, 25.4, GROUND - 24, 30, 1.6, 6, '#ffc070', 0.08, t, Math.PI / 2);
      hero(c, 'rogue', 36, GROUND + 1, 21, t, '#ffb060'); hero(c, 'knight', 84, GROUND + 1, 23, t, '#ffb060'); hero(c, 'mage', 99, GROUND + 1, 22, t, '#ffb060');
      embers(c, 44, 10, 0, 120, GROUND - 10, t, 50, '#ffd08a'); });
  },
];
function empire(c, t, pan, alive) {
  const HZ = alive ? '#ff7a30' : '#7a8a98';
  sky(c, alive ? [[0, '#140404'], [0.35, '#4a0e0a'], [0.7, '#b0381a'], [1, HZ]] : [[0, '#04060a'], [0.4, '#121a26'], [0.75, '#34445a'], [1, HZ]]);
  if (!alive) { stars(c, 21, 60, 90, t); L(c, pan, 0.03, () => moon(c, 60, 56, 17, '#e6e4dc', 0)); }
  L(c, pan, 0.08, () => { clouds(c, 6, 26, 7, alive ? '#1a0806' : '#0a0e14', alive ? 0.75 : 0.5, t, alive ? 0.9 : 0.3); });
  L(c, pan, 0.18, () => { skyline(c, 7, 132, alive ? '#5a1a10' : '#26303c'); fog(c, 134, 7, alive ? '#ff7a3a' : '#8a9aa8', 0.3); });
  L(c, pan, 0.35, () => {
    const col = alive ? '#240806' : '#141a22'; c.fillStyle = col; c.fillRect(-20, 146, W + 40, 30); for (let x = -18; x < W + 20; x += 4) c.fillRect(x, 144, 2, 2);   // the city wall
    const top = throne(c, 60, 150, col, alive ? true : false, t);
    if (alive) { rays(c, 60, top + 1, 90, 2.4, 12, '#ffb060', 0.12, t, -Math.PI / 2); flame(c, 60, top + 3, 1.25, t); embers(c, 5, 22, 48, 72, top, t, 60, '#ffb050', 1); }
    else { smoke(c, 60, top + 2, t * 0.5, '#8a96a4', null, 6, 0.3, 0.6); }
    for (const [x, h] of [[12, 38], [22, 30], [98, 34], [108, 40]]) { chimney(c, x, 152, h, 2.6, col);
      if (alive) { smoke(c, x, 152 - h, t + x, '#1a0806', '#ff6a20', 10, 0.5, 1.1); glow(c, x, 152 - h + 2, 6, '#ff7a2a', 0.5); } }
    fog(c, 150, 3, alive ? '#ff6a2a' : '#6a7a8a', 0.18); });
  L(c, pan, 1, () => { ground(c, 9, GROUND, 2);
    if (alive) {
      for (let row = 0; row < 2; row++) { const s = row ? 19 : 14, y = row ? GROUND + 2 : GROUND - 3, n = row ? 7 : 9, gap = row ? 22 : 16, sp = row ? 4 : 3;
        for (let i = 0; i < n; i++) { const x = ((i * gap + t * sp) % (n * gap)) - 12; skeleton(c, x, y, s, t, { pose: 'march', phase: i * 1.7 + row, spear: true, shield: row === 1, eyes: row ? '#ffb050' : '#ff8a3a', color: row ? BLACK : '#120606' }); } }
    } else {
      const r = rng(17); for (let i = 0; i < 9; i++) { const x = 6 + i * 13 + r() * 5; skeleton(c, x, GROUND - 1 + r() * 3, 15, t, { pose: 'fallen', tilt: (r() - 0.5) * 0.3, spear: r() < 0.6, face: r() < 0.5 ? 1 : -1 }); }
      c.strokeStyle = BLACK; c.lineWidth = 0.5; c.beginPath(); c.moveTo(78, GROUND + 1); c.lineTo(80, GROUND - 26); c.stroke();
      const wave = Math.sin(t * 1.2) * 0.8; c.fillStyle = BLACK; c.beginPath(); c.moveTo(80, GROUND - 25); c.lineTo(87, GROUND - 24 + wave); c.lineTo(85, GROUND - 21 + wave); c.lineTo(88, GROUND - 18 + wave); c.lineTo(79.5, GROUND - 19); c.fill();
      embers(c, 29, 40, -10, 130, -10, t, GROUND + 20, '#b8c0c8', 1); }
  });
}

// ── finishing: grade, paper texture, vignette and grain over every frame ─────────
export const SCENE_IDS = ['kindling', 'empire', 'fall', 'long_dim', 'year301', 'thornwick'];
const GRADE = [['#ffcf9a', '#3a4a7a'], ['#ffb070', '#2a0a14'], ['#b8c8ff', '#0a1020'], ['#c8d8c0', '#1a2226'], ['#ff9a70', '#1a0a24'], ['#ffc890', '#1a1440']];
/** @type {HTMLCanvasElement | null} */ let tex = null;
/** @type {HTMLCanvasElement | null} */ let grain = null;
function finishes() {                                        // made once, on the first frame
  tex = document.createElement('canvas'); tex.width = tex.height = 256;                     // a painted surface: low, soft mottling
  const small = document.createElement('canvas'); small.width = small.height = 24; const sg = small.getContext('2d'), sd = sg.createImageData(24, 24), r = rng(99);
  for (let i = 0; i < sd.data.length; i += 4) { const v = 96 + r() * 64; sd.data[i] = sd.data[i + 1] = sd.data[i + 2] = v; sd.data[i + 3] = 255; } sg.putImageData(sd, 0, 0);
  const tg = tex.getContext('2d'); tg.imageSmoothingEnabled = true; tg.drawImage(small, 0, 0, 256, 256);
  grain = document.createElement('canvas'); grain.width = grain.height = 160;
  const gg = grain.getContext('2d'), gd = gg.createImageData(160, 160); for (let i = 0; i < gd.data.length; i += 4) { const v = Math.random() * 255; gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v; gd.data[i + 3] = 22; } gg.putImageData(gd, 0, 0);
}
/**
 * One frame of a scene. The camera leans in and pans over the first 14 s.
 * @param {HTMLCanvasElement} cv @param {string} id one of SCENE_IDS @param {number} t seconds @param {boolean} [text]
 */
export function paint(cv, id, t, text = true) {
  if (!tex) finishes();
  const i = Math.max(0, SCENE_IDS.indexOf(id)), c = cv.getContext('2d'), k = cv.width / W; T = t;
  c.setTransform(k, 0, 0, k, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  const push = 1 + Math.min(1, t / 14) * 0.045, pan = (Math.min(1, t / 14) - 0.5) * 5;
  c.fillStyle = BLACK; c.fillRect(0, 0, W, H);
  c.save(); c.translate(0, -LIFT); c.translate(W / 2, H * 0.55); c.scale(push, push); c.translate(-W / 2, -H * 0.55);   // the horizon sits high: the words need the lower 40 %
  SCENES[i](c, t, pan); c.restore();
  c.fillStyle = BLACK; c.fillRect(0, H - LIFT - 8, W, LIFT + 8);                    // the lifted scene's lower edge: solid ground
  if (text) { const g = c.createLinearGradient(0, GROUND - LIFT - 4, 0, H); g.addColorStop(0, 'rgba(7,5,8,0)'); g.addColorStop(0.25, 'rgba(7,5,8,0.7)'); g.addColorStop(1, 'rgba(7,5,8,0.95)'); c.fillStyle = g; c.fillRect(0, GROUND - LIFT - 4, W, H); }
  c.save(); c.globalCompositeOperation = 'soft-light'; const [gt, gb] = GRADE[i], gg = c.createLinearGradient(0, 0, 0, H); gg.addColorStop(0, rgba(gt, 0.45)); gg.addColorStop(0.7, rgba(gb, 0.4)); gg.addColorStop(1, rgba(gb, 0)); c.fillStyle = gg; c.fillRect(0, 0, W, H);
  c.globalAlpha = 0.5; c.drawImage(tex, 0, 0, W, H); c.restore();
  const v = c.createRadialGradient(W / 2, H * 0.45, H * 0.25, W / 2, H * 0.5, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
  c.setTransform(1, 0, 0, 1, 0, 0); const ox = (Math.random() * 160) | 0, oy = (Math.random() * 160) | 0; c.fillStyle = c.createPattern(grain, 'repeat'); c.save(); c.translate(-ox, -oy); c.fillRect(ox, oy, cv.width, cv.height); c.restore();
}
