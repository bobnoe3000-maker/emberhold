// vale-plans.mjs — the Hollow Vale's dungeons drawn from their authored plans (src/sim/plans.js; docs/vale-dungeons-plan.md):
// each dungeon's floors side by side, top-down at one scale (4 px a tile), the spaces filled by what they're built of,
// the halls with their widths, the levels, the bosses, the stairs, and the dressing each space names drawn in place
// as plan glyphs (niches, pews, bunks, tents, pools, pillars ...). An SVG, then a PNG through Chromium (no image library
// in the repo). Also runs the plan's rules (checkPlan) and refuses to draw a plan that breaks them.
//
//   node tools/dungeon/vale-plans.mjs [site …]   → docs/img/dungeon/vale-<site>.png (+ .svg)
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PLANS, checkPlan, sizeOf } from '../../src/sim/plans.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url)), OUT = join(ROOT, 'docs/img/dungeon');
const K = 4, PAD = 30, GAP = 70, HEAD = 92, FOOT = 44;
const want = process.argv.slice(2).filter((a) => !a.startsWith('--'));
// what a space is built of, by its dungeon's kind and its shape: floor, wall (the outline), and a palette strip per kind
const LOOK = {
  crypt: { rect: ['#4a4652', '#8e8798'], cave: ['#4c4033', '#7d6a52'], round: ['#4a4652', '#8e8798'], light: '#9fb4d8', strip: [['#4a4652', 'cold limestone flags'], ['#4c4033', 'dug earth, timber'], ['#9fb4d8', 'candle and cold light'], ['#d08a3a', 'the Redhand\'s fires']] },
  keep: { rect: ['#4e4a40', '#9a9078'], cave: ['#33403f', '#5f7a76'], round: ['#4e4a40', '#9a9078'], light: '#e8a456', strip: [['#4e4a40', 'cobbles, flags'], ['#6b4a2e', 'timber, straw'], ['#33403f', 'wet cave rock'], ['#e8a456', 'firelight']] },
  temple: { rect: ['#46504c', '#a3aca2'], cave: ['#3d3646', '#6e6280'], round: ['#3f3a4a', '#9a8fae'], light: '#c9d6b0', strip: [['#46504c', 'pale stone, moss'], ['#2f4a52', 'standing water'], ['#3d3646', 'the cult\'s cut'], ['#c9a0ff', 'the binding\'s glow']] },
  vault: { rect: ['#44464e', '#8a8e9a'], cave: ['#44464e', '#8a8e9a'], round: ['#44464e', '#8a8e9a'], light: '#d8c890', strip: [['#44464e', 'dry ashlar'], ['#d8c890', 'lamp light'], ['#8a6a3a', 'iron and oak']] },
};
const ROLE = { entrance: '#6fae7a', room: '#d8c39a', offshoot: '#a8c8e8', descent: '#e0905a', end: '#e06a5a' };
const hash = (...a) => { let h = 2166136261; for (const c of a.join('|')) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// a cave's outline: a blob inside its box, its edge wandering by the hash (the same every draw)
function blob(s, x0, y0) {
  const cx = x0 + (s.x + s.w / 2) * K, cy = y0 + (s.y + s.h / 2) * K, rx = (s.w / 2) * K, ry = (s.h / 2) * K, n = 28, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, k = 0.86 + 0.14 * hash(s.id, i), sq = 1.18;   // (squarer than an ellipse: a dug room fills its box)
    const c = Math.cos(a), sn = Math.sin(a), e = (v) => Math.sign(v) * Math.pow(Math.abs(v), 1 / sq);
    pts.push(`${(cx + e(c) * rx * k).toFixed(1)},${(cy + e(sn) * ry * k).toFixed(1)}`);
  }
  return pts.join(' ');
}

// the dressing, as plan glyphs inside the space's box (px)
function glyphs(s, x0, y0) {
  const X = x0 + s.x * K, Y = y0 + s.y * K, W = s.w * K, H = s.h * K, out = [], r = (i) => hash(s.id, 'g', i);
  const long = W >= H, along = (n, f) => { for (let i = 0; i < n; i++) f(i, (i + 0.5) / n); };
  const rect = (x, y, w, h, fill, extra = '') => out.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}" ${extra}/>`);
  const dot = (x, y, rr, fill, extra = '') => out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr}" fill="${fill}" ${extra}/>`);
  const tri = (x, y, w, h, fill) => out.push(`<path d="M${x - w / 2},${y + h / 2} L${x},${y - h / 2} L${x + w / 2},${y + h / 2} Z" fill="${fill}"/>`);
  const T = 1.5 * K;                                             // a wall's inner margin
  for (const d of s.dress) {
    if (d === 'niches') {                                        // alcoves cut into the long walls, a candle in each
      const n = Math.floor((long ? s.w : s.h) / 6);
      along(n, (i, t) => { if (long) { rect(X + t * W - 1.5 * K, Y - 2.5 * K, 3 * K, 2.5 * K, '#2a2630'); dot(X + t * W, Y - 1.2 * K, 2, '#ffd27a'); if (s.id === 'long_gallery') { rect(X + t * W - 1.5 * K, Y + H, 3 * K, 2.5 * K, '#2a2630'); dot(X + t * W, Y + H + 1.2 * K, 2, '#ffd27a'); } }
        else { rect(X - 2.5 * K, Y + t * H - 1.5 * K, 2.5 * K, 3 * K, '#2a2630'); dot(X - 1.2 * K, Y + t * H, 2, '#ffd27a'); } });
    } else if (d === 'colonnade') {
      const n = Math.floor((long ? s.w : s.h) / 9);
      along(n, (i, t) => { for (const f of [0.28, 0.72]) dot(long ? X + t * W : X + f * W, long ? Y + f * H : Y + t * H, 1.1 * K, '#b9b2c4'); });
    } else if (d === 'ring_of_pillars') {
      for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; dot(X + W / 2 + Math.cos(a) * W * 0.36, Y + H / 2 + Math.sin(a) * H * 0.36, 1.2 * K, '#b9b2c4'); }
    } else if (d === 'circle') {
      out.push(`<circle cx="${X + W / 2}" cy="${Y + H / 2}" r="${Math.min(W, H) * 0.18}" fill="none" stroke="#c9a0ff" stroke-width="3" stroke-dasharray="6 4"/>`); dot(X + W / 2, Y + H / 2, 4, '#c9a0ff');
    } else if (d === 'pews') {                                    // two blocks either side of the aisle
      for (let i = 0; i < 7; i++) for (const side of [0.22, 0.62]) rect(X + (0.12 + i * 0.11) * W, Y + side * H, 1.2 * K, 0.16 * H, '#7a5a3c');
    } else if (d === 'bunks') {
      along(Math.floor(s.w / 6), (i, t) => { rect(X + t * W - 1.5 * K, Y + T, 3 * K, 4 * K, '#7a5a3c'); rect(X + t * W - 1.5 * K, Y + H - T - 4 * K, 3 * K, 4 * K, '#7a5a3c'); });
    } else if (d === 'tents') {
      along(Math.max(2, Math.floor((long ? s.w : s.h) / 14)), (i, t) => tri(long ? X + t * W : X + 0.25 * W, long ? Y + 0.22 * H : Y + t * H, 6 * K, 5 * K, '#a08a64'));
    } else if (d === 'pools') {
      for (let i = 0; i < 3; i++) out.push(`<ellipse cx="${X + (0.25 + 0.25 * i) * W}" cy="${Y + (0.35 + 0.3 * r(i)) * H}" rx="${(3 + 3 * r(i + 9)) * K}" ry="${(2 + 2 * r(i + 5)) * K}" fill="#2f5a6a" opacity="0.85"/>`);
    } else if (d === 'stalagmites') {
      for (let i = 0; i < 9; i++) tri(X + (0.1 + 0.8 * r(i)) * W, Y + (0.12 + 0.76 * r(i + 20)) * H, 2.4 * K, 3 * K, '#8a9a96');
    } else if (d === 'drips') {
      for (let i = 0; i < 6; i++) dot(X + (0.1 + 0.8 * r(i + 40)) * W, Y + (0.1 + 0.8 * r(i + 50)) * H, 2, '#7fc4e0');
    } else if (d === 'bound') {                                   // the legion's bound, standing in rows
      for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) dot(X + (0.18 + i * 0.16) * W, Y + (j ? 0.82 : 0.18) * H, 0.9 * K, '#9a92a8');
    } else if (d === 'racks') {
      along(Math.floor(s.w / 7), (i, t) => rect(X + t * W - 2 * K, Y + T, 4 * K, 1 * K, '#9a8a70'));
    } else if (d === 'standards') {
      for (const f of [0.3, 0.7]) { rect(X + f * W, Y + 2 * T, 0.6 * K, 4 * K, '#c8b070'); rect(X + f * W + 0.6 * K, Y + 2 * T, 2.4 * K, 1.6 * K, '#a83a32'); }
    } else if (d === 'banners') {
      for (const f of [0.25, 0.5, 0.75]) rect(X + f * W - K, Y, 2 * K, 2.4 * K, '#a83a32');
    } else if (d === 'braziers') {
      for (const [fx, fy] of [[0.12, 0.15], [0.88, 0.15]]) dot(X + fx * W, Y + fy * H, 1.3 * K, '#ff9a3a', 'stroke="#ffd27a" stroke-width="1.5"');
    } else if (d === 'cookfires' || d === 'camp') {
      for (let i = 0; i < (d === 'camp' ? 1 : 3); i++) dot(X + (0.25 + 0.25 * i) * W, Y + 0.6 * H, 1.2 * K, '#ff9a3a', 'stroke="#ffd27a" stroke-width="1.5"');
    } else if (d === 'candles' || d === 'lanterns') {
      for (let i = 0; i < 6; i++) dot(X + (0.08 + 0.84 * r(i + 60)) * W, Y + (i % 2 ? 0.1 : 0.9) * H, 1.8, '#ffd27a');
    } else if (d === 'spoil' || d === 'rubble') {
      for (let i = 0; i < 5; i++) out.push(`<ellipse cx="${X + (0.1 + 0.8 * r(i + 70)) * W}" cy="${Y + (0.15 + 0.7 * r(i + 80)) * H}" rx="${2.6 * K}" ry="${1.8 * K}" fill="#6a5640"/>`);
    } else if (d === 'timbers' || d === 'scaffold' || d === 'ladders') {
      for (let i = 0; i < 4; i++) { const x = X + (0.15 + 0.22 * i) * W; out.push(`<path d="M${x},${Y + T} l${2 * K},${3 * K} M${x + 2 * K},${Y + T} l${-2 * K},${3 * K}" stroke="#9a7a50" stroke-width="2"/>`); }
    } else if (d === 'crates' || d === 'casks' || d === 'barrows' || d === 'carts' || d === 'hay' || d === 'sacks') {
      const c = { crates: '#8a6a44', casks: '#6a4a2e', barrows: '#7a6a50', carts: '#7a5a3c', hay: '#c8a850', sacks: '#a89070' }[d];
      for (let i = 0; i < 4; i++) rect(X + (0.06 + 0.88 * r(i + 90)) * W - K, Y + H - T - (2 + 3 * r(i + 99)) * K, 2.4 * K, 2.4 * K, c);
    } else if (d === 'stalls') {
      along(Math.floor(s.w / 6), (i, t) => rect(X + t * W, Y + T, 0.5 * K, 6 * K, '#9a7a50'));
    } else if (d === 'troughs') {
      rect(X + 0.2 * W, Y + 0.45 * H, 0.25 * W, 1.2 * K, '#5a7a8a');
    } else if (d === 'hen_cart') {
      rect(X + 0.6 * W, Y + 0.55 * H, 7 * K, 4 * K, '#7a5a3c'); dot(X + 0.6 * W + K, Y + 0.55 * H + 4 * K, 3, '#3a2a1e'); dot(X + 0.6 * W + 6 * K, Y + 0.55 * H + 4 * K, 3, '#3a2a1e');
    } else if (d === 'cage') {
      rect(X + W - 6 * K, Y + 0.4 * H, 4 * K, 4 * K, 'none', 'stroke="#c0c0c0" stroke-width="2" stroke-dasharray="2 2"');
    } else if (d === 'well' || d === 'font') {
      out.push(`<circle cx="${X + 0.4 * W}" cy="${Y + 0.4 * H}" r="${2.4 * K}" fill="#2f5a6a" stroke="#a3aca2" stroke-width="3"/>`);
    } else if (d === 'light_shaft') {
      out.push(`<circle cx="${X + 0.55 * W}" cy="${Y + 0.55 * H}" r="${0.22 * W}" fill="#fff6c8" opacity="0.13"/>`);
    } else if (d === 'altar' || d === 'altar_small' || d === 'garrows_table' || d === 'desks') {
      const big = d === 'altar' ? 1.6 : 1;
      rect(X + W - T - 3 * K * big, Y + H / 2 - 4 * K * big, 3 * K * big, 8 * K * big, d === 'altar' || d === 'altar_small' ? '#d8d0c0' : '#7a5a3c');
    } else if (d === 'chest' || d === 'chests' || d === 'vault_chest' || d === 'pay_chests' || d === 'grave_goods') {
      const n = d === 'chests' ? 2 : d === 'pay_chests' ? 5 : 1;
      for (let i = 0; i < n; i++) rect(X + (d === 'pay_chests' ? (0.1 + i * 0.2) * W : W - T - 4 * K), Y + (d === 'pay_chests' ? T : T + i * 4 * K), 3 * K, 2 * K, '#8a5a2a', 'stroke="#e8c060" stroke-width="1.5"');
    } else if (d === 'shrine') {
      out.push(`<path d="M${X + W / 2},${Y + T} l${2 * K},${2 * K} l${-2 * K},${2 * K} l${-2 * K},${-2 * K} Z" fill="#6aa0e8"/>`);
    } else if (d === 'sarcophagi' || d === 'sarcophagus_open') {
      const n = d === 'sarcophagi' ? Math.floor(s.w / 12) : 1;
      along(n, (i, t) => rect(X + t * W - 2 * K, Y + (d === 'sarcophagi' ? 0.42 : 0.4) * H, 4 * K, 2.4 * K, '#8e8798', d === 'sarcophagus_open' ? 'stroke="#e8c060" stroke-width="1.5"' : ''));
    } else if (d === 'guardians') {
      for (const f of [0.3, 0.7]) rect(X + f * W - 2 * K, Y + 0.3 * H, 4 * K, 4 * K, '#9a92a8');
    } else if (d === 'chains' || d === 'gibbets') {
      for (let i = 0; i < 3; i++) out.push(`<path d="M${X + (0.2 + 0.3 * i) * W},${Y + T} v${3 * K}" stroke="#a0a0a8" stroke-width="2" stroke-dasharray="3 2"/>`);
    } else if (d === 'bedrolls' || d === 'benches' || d === 'ledgers' || d === 'ledger' || d === 'rolls' || d === 'hives') {
      const c = { bedrolls: '#6a5a4a', benches: '#7a5a3c', ledgers: '#d8d0c0', ledger: '#d8d0c0', rolls: '#d8d0c0', hives: '#d8b040' }[d];
      for (let i = 0; i < 4; i++) rect(X + (0.12 + i * 0.2) * W, Y + H - T - 3 * K, d === 'hives' ? 2 * K : 4 * K, 1.6 * K, c);
    } else if (d === 'broken_floor') {
      out.push(`<ellipse cx="${X + 0.5 * W}" cy="${Y + 0.72 * H}" rx="${0.28 * W}" ry="${0.16 * H}" fill="#1c1a20"/>`);
    } else if (d === 'bars') {
      along(Math.floor(s.w / 6), (i, t) => rect(X + t * W, Y, 0.4 * K, 3 * K, '#a0a0a8'));
    } else if (d === 'windlass') {
      out.push(`<circle cx="${X + 0.3 * W}" cy="${Y + 0.5 * H}" r="${1.6 * K}" fill="none" stroke="#9a7a50" stroke-width="3"/>`);
    }
  }
  // the stairs, last, on top: up against the back (north) wall, down as a 6 × 6 well
  if (s.dress.includes('stair_up') || s.role === 'entrance') {
    const sx = X + W / 2 - 3 * K, sy = Y + T;
    rect(sx, sy, 6 * K, 4 * K, '#cfc8b8'); for (let i = 1; i < 4; i++) out.push(`<path d="M${sx},${sy + i * K} h${6 * K}" stroke="#6a6458" stroke-width="1"/>`);
    out.push(`<text x="${sx + 3 * K}" y="${sy + 4 * K + 13}" font-size="11" text-anchor="middle" fill="#e8e0d0">▲ up</text>`);
  }
  if (s.dress.includes('stair_down')) {
    const sx = X + W / 2 - 3 * K, sy = Y + H - T - 7 * K;
    rect(sx, sy, 6 * K, 6 * K, '#121016', 'stroke="#c9a0ff" stroke-width="2"'); for (let i = 1; i < 6; i++) out.push(`<path d="M${sx},${sy + i * K} h${6 * K}" stroke="#3a3446" stroke-width="1"/>`);
    out.push(`<text x="${sx + 3 * K}" y="${sy - 4}" font-size="11" text-anchor="middle" fill="#e8d8ff">▼ down</text>`);
  }
  return out.join('');
}

function floorSvg(p, f, fi, x0, y0) {
  const L = LOOK[p.kind], out = [];
  const w = Math.max(...f.spaces.map((s) => s.x + s.w)) * K, h = Math.max(...f.spaces.map((s) => s.y + s.h)) * K;
  const lvs = f.spaces.filter((s) => s.role !== 'entrance').map((s) => p.base + s.lv);
  out.push(`<text x="${x0}" y="${y0 - 26}" font-size="17" font-weight="600" fill="#f0e6d2">Floor ${fi + 1} · ${esc(f.name)}</text>`);
  out.push(`<text x="${x0}" y="${y0 - 9}" font-size="12" fill="#a89f90">${f.spaces.length} spaces · level ${p.flat ? p.base : `${Math.min(...lvs)}–${Math.max(...lvs)}`} · ${Math.round(w / K)} × ${Math.round(h / K)} tiles</text>`);
  for (const hl of f.halls) {                                     // the halls under the rooms' walls
    out.push(`<rect x="${x0 + hl.x * K}" y="${y0 + hl.y * K}" width="${hl.w * K}" height="${hl.h * K}" fill="${hl.rough ? '#5a4c3c' : '#6a6458'}"/>`);
    const v = hl.h > hl.w, cx = x0 + (hl.x + hl.w / 2) * K, cy = y0 + (hl.y + hl.h / 2) * K;
    out.push(`<text x="${cx}" y="${cy + 4}" font-size="10" text-anchor="middle" fill="#e8e0d0" ${v ? '' : ''}>${Math.min(hl.w, hl.h)}w</text>`);
  }
  for (const s of f.spaces) {
    const [fill, wall] = L[s.shape], X = x0 + s.x * K, Y = y0 + s.y * K, W = s.w * K, H = s.h * K;
    const stroke = `stroke="${wall}" stroke-width="${s.shape === 'cave' ? 5 : 6}" ${s.role === 'offshoot' ? 'stroke-dasharray="10 6"' : ''}`;
    if (s.shape === 'cave') out.push(`<polygon points="${blob(s, x0, y0)}" fill="${fill}" ${stroke} stroke-linejoin="round"/>`);
    else if (s.shape === 'round') out.push(`<ellipse cx="${X + W / 2}" cy="${Y + H / 2}" rx="${W / 2}" ry="${H / 2}" fill="${fill}" ${stroke}/>`);
    else out.push(`<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${fill}" ${stroke}/>`);
    out.push(glyphs(s, x0, y0));
  }
  for (const s of f.spaces) {                                     // the labels, over everything
    const X = x0 + s.x * K, Y = y0 + s.y * K, W = s.w * K, H = s.h * K, cx = X + W / 2, cy = Y + H / 2 - (s.boss ? 12 : 4);
    const lv = s.role === 'entrance' ? 'safe' : `LV ${p.base + s.lv}`;
    const lines = [[esc(s.name), W < 110 ? 11.5 : 13, '#fff8ea', 700], [`${lv} · ${sizeOf(s)} ${s.w}×${s.h}`, 10.5, ROLE[s.role], 600]];
    if (s.boss) lines.push([`☠ ${esc(BOSS[s.boss] || s.boss)}`, 11.5, '#ff8a7a', 700]);
    lines.forEach(([t, fs, c, wgt], i) => out.push(`<text x="${cx}" y="${cy + i * 15}" font-size="${fs}" font-weight="${wgt}" text-anchor="middle" fill="${c}" paint-order="stroke" stroke="#14121a" stroke-width="3.5">${t}</text>`));
  }
  return { svg: out.join(''), w, h };
}
const BOSS = { quartermaster: 'The Quartermaster', goblin_chief: 'Old Skarn', redhand_captain: 'Captain Garrow', robed_stranger: 'The Robed Stranger', standard: 'The Standard of the Third Legion' };

function planSvg(p) {
  const parts = [];
  let x = PAD, H = 0;
  for (const [fi, f] of p.floors.entries()) {
    const fw = Math.max(...f.spaces.map((s) => s.x + s.w)) * K + 3 * K, fh = Math.max(...f.spaces.map((s) => s.y + s.h)) * K + 3 * K;
    parts.push(floorSvg(p, f, fi, x + 3 * K, HEAD + 3 * K).svg); x += fw + GAP; H = Math.max(H, fh);
  }
  const W = Math.max(x - GAP + PAD, 760), L = LOOK[p.kind];
  const strip = L.strip.map(([c, t], i) => `<rect x="${PAD + i * 190}" y="44" width="16" height="16" fill="${c}" stroke="#000" stroke-width="1"/><text x="${PAD + i * 190 + 22}" y="57" font-size="12" fill="#cfc6b6">${esc(t)}</text>`).join('');
  const legend = Object.entries(ROLE).map(([k, c], i) => `<rect x="${PAD + i * 120}" y="${HEAD + H + 10}" width="12" height="12" fill="${c}"/><text x="${PAD + i * 120 + 17}" y="${HEAD + H + 21}" font-size="11" fill="#cfc6b6">${{ entrance: 'entrance (safe)', room: 'room', offshoot: 'offshoot (dashed)', descent: 'descent room', end: 'last hall' }[k]}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${HEAD + H + FOOT + 10}" font-family="Georgia, 'DejaVu Serif', serif">
<rect width="100%" height="100%" fill="#14121a"/>
<text x="${PAD}" y="30" font-size="22" font-weight="700" fill="#f6ecd6">${esc(p.name)} · ${p.flat ? `secret, level ${p.base}` : `levels ${p.base}–${p.base + 2}`} · a ${esc(p.kind)}</text>${strip}
${parts.join('\n')}${legend}<text x="${PAD}" y="${HEAD + H + 42}" font-size="11" fill="#8a8274">4 px a tile · halls marked with their width · src/sim/plans.js</text></svg>`;
}

mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(), page = await b.newPage();
for (const p of Object.values(PLANS)) {
  if (want.length && !want.includes(p.site)) continue;
  const bad = checkPlan(p);
  if (bad.length) { console.error(`${p.site}: the plan breaks its rules:\n  ${bad.join('\n  ')}`); process.exitCode = 1; continue; }
  const svg = planSvg(p), w = +svg.match(/width="(\d+(?:\.\d+)?)"/)[1], h = +svg.match(/height="(\d+(?:\.\d+)?)"/)[1];
  writeFileSync(join(OUT, `vale-${p.site}.svg`), svg);
  await page.setViewportSize({ width: Math.ceil(w), height: Math.ceil(h) });
  await page.setContent(`<html><body style="margin:0;background:#14121a">${svg}</body></html>`);
  await page.locator('svg').screenshot({ path: join(OUT, `vale-${p.site}.png`) });
  console.log(`${p.site}: ${p.floors.map((f) => f.spaces.length).join(' + ')} spaces → docs/img/dungeon/vale-${p.site}.png`);
}
await b.close();
