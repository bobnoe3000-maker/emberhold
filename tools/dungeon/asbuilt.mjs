// asbuilt.mjs — the Hollow Vale's authored dungeon floors as the sim builds them (sim/world.js createWorld from
// sim/plans.js), top-down at one scale: the floor, the rooms named with their levels, the halls, the standing water, and
// every prop the dressing stood, coloured by what it is, with a legend. The plans (tools/dungeon/vale-plans.mjs) say what
// a room should hold; this shows what it does: where the pieces landed, what was pruned to keep the ways open, and how
// much open floor each fight has. For the dressing pass's level-design critique (docs/vale-dungeon-dressing.md).
//
//   node tools/dungeon/asbuilt.mjs [site …] [--seed N] [--out dir]   → <out>/asbuilt-<site>.png (default tools/capture/out/)
//
// Also prints, a room at a time: its size, its props by kind, and its open floor (the share of its floor neither
// furniture nor water, and the largest open square, where the fight happens).
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PLANS } from '../../src/sim/plans.js';
import { createWorld, FLAT_PROPS } from '../../src/sim/world.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const SEED = +opt('--seed', 20260807), OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out')));
const want = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const sites = want.length ? want : Object.keys(PLANS);
const K = 5, PAD = 24, GAP = 40, HEAD = 40;
// a colour a family of pieces: what stands at the walls, what burns, the stone, the dead, the finds
const FAM = [
  [/^(brazier|lantern|candles|torch|light_shaft|hearth)$/, '#ffb347'],
  [/^(chest|chestOpen|vault_chest|pay_chest)$/, '#ffd700'],
  [/^(shrine.*)$/, '#5fd7ff'],
  [/^(stair.*|exit)$/, '#b08cff'],
  [/^(pillar|brokenpillar|boulder|stalagmite|monolith|rubble|broken_floor)$/, '#c8c8c8'],
  [/^(bones|bound|sarcophagus|urnshelf|urns|saint|guardian|niche)$/, '#e8dcc0'],
  [/^(circle|altar|font|chains|gibbet|cage)$/, '#d080ff'],
];
const OTHER = ['#a0703c', '#7fa060', '#b05a48', '#6a8cc0', '#c09a60', '#8a7a9a', '#60a0a0', '#c07890', '#9aa040', '#d09040'];
const colorOf = (() => { const m = new Map(); let n = 0; return (k) => { if (!m.has(k)) m.set(k, (FAM.find(([re]) => re.test(k)) || [null, OTHER[n++ % OTHER.length]])[1]); return m.get(k); }; })();

const b = await chromium.launch();
mkdirSync(OUT, { recursive: true });
for (const site of sites) {
  const P = PLANS[site]; if (!P) { console.log(`no plan: ${site}`); continue; }
  const floors = P.floors.map((_, d) => createWorld(SEED, null, d, site));
  const boxes = floors.map((w) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const k of w.level.cells.keys()) { const [x, y] = k.split(',').map(Number); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return { x0, y0, x1, y1 }; });
  const W = PAD * 2 + boxes.reduce((a, q) => a + (q.x1 - q.x0 + 1) * K, 0) + GAP * (floors.length - 1);
  const H = PAD * 2 + HEAD + Math.max(...boxes.map((q) => (q.y1 - q.y0 + 1) * K)) + 150;
  const draw = { W, H, title: `${P.name} — as built (seed ${SEED})`, floors: [] }, kinds = new Set();
  let ox = PAD;
  floors.forEach((w, d) => {
    const q = boxes[d], L = w.level, cells = [], props = [], pools = [], rooms = [];
    for (const [k, c] of L.cells) { if (c.kind !== 'floor') continue; const [x, y] = k.split(',').map(Number); cells.push([x - q.x0, y - q.y0, c.room >= 0 ? 1 : 0]); }
    for (const k of w.pools) { const [x, y] = k.split(',').map(Number); pools.push([x - q.x0, y - q.y0]); }
    for (const [k, kind] of w.props) { const [x, y] = k.split(',').map(Number); if (kind === 'stairwell') { pools.push([x - q.x0, y - q.y0, 1]); continue; } kinds.add(kind); props.push([x - q.x0, y - q.y0, colorOf(kind), FLAT_PROPS.has(kind) ? 1 : 0]); }
    console.log(`\n${site} floor ${d + 1}: ${P.floors[d].name}`);
    for (const r of L.rooms) {
      const lv = w.roomLevels.get(r.id), own = [...L.cells].filter(([, c]) => c.kind === 'floor' && c.room === r.id && !c.corridor).map(([k]) => k);
      const by = {}, free = new Set();
      for (const k of own) { const p = w.props.get(k); if (p && p !== 'stairwell') by[p] = (by[p] || 0) + 1; else if (!w.pools.has(k) && p !== 'stairwell') free.add(k); }
      // the largest open square (dynamic programming over the room's box): where a fight has room to move
      let best = 0; const dp = new Map();
      for (let y = Math.floor(r.cy - r.rh / 2) - 2; y <= r.cy + r.rh / 2 + 2; y++) for (let x = Math.floor(r.cx - r.rw / 2) - 2; x <= r.cx + r.rw / 2 + 2; x++) {
        const v = free.has(x + ',' + y) ? 1 + Math.min(dp.get((x - 1) + ',' + y) || 0, dp.get(x + ',' + (y - 1)) || 0, dp.get((x - 1) + ',' + (y - 1)) || 0) : 0;
        dp.set(x + ',' + y, v); if (v > best) best = v;
      }
      const name = r.name || `room ${r.id}`;
      console.log(`  ${name.padEnd(30)} ${String(r.rw).padStart(2)}×${String(r.rh).padEnd(2)} lv ${String(lv).padStart(2)}  open ${Math.round((free.size / Math.max(1, own.length)) * 100)}% (square ${best})  ${Object.entries(by).map(([k, n]) => `${k} ${n}`).join(', ')}`);
      rooms.push({ x: r.cx - q.x0, y: r.cy - q.y0, name, lv, part: r.part });
    }
    draw.floors.push({ ox, oy: PAD + HEAD, w: (q.x1 - q.x0 + 1) * K, h: (q.y1 - q.y0 + 1) * K, name: `Floor ${d + 1}: ${P.floors[d].name}`, cells, props, pools, rooms });
    ox += (q.x1 - q.x0 + 1) * K + GAP;
  });
  draw.legend = [...kinds].sort().map((k) => [k, colorOf(k)]);
  const p = await b.newPage({ viewport: { width: Math.min(W, 4000), height: Math.min(H, 4000) } });
  const png = await p.evaluate((D) => {
    const K = 5, c = document.createElement('canvas'); c.width = D.W; c.height = D.H; const g = c.getContext('2d');
    g.fillStyle = '#0c0a10'; g.fillRect(0, 0, D.W, D.H);
    g.fillStyle = '#efe4cf'; g.font = '600 18px Georgia'; g.fillText(D.title, 24, 30);
    for (const F of D.floors) {
      g.fillStyle = '#c8baa2'; g.font = '13px Georgia'; g.fillText(F.name, F.ox, F.oy - 8);
      for (const [x, y, room] of F.cells) { g.fillStyle = room ? '#3a3542' : '#2a2730'; g.fillRect(F.ox + x * K, F.oy + y * K, K, K); }
      for (const [x, y, well] of F.pools) { g.fillStyle = well ? '#2a1640' : '#24485a'; g.fillRect(F.ox + x * K, F.oy + y * K, K, K); }
      for (const [x, y, col, flat] of F.props) { g.fillStyle = col; if (flat) { g.globalAlpha = 0.5; } g.fillRect(F.ox + x * K, F.oy + y * K, K, K); g.globalAlpha = 1; g.strokeStyle = '#000'; g.strokeRect(F.ox + x * K + 0.5, F.oy + y * K + 0.5, K - 1, K - 1); }
      for (const r of F.rooms) { g.font = '600 12px Georgia'; g.textAlign = 'center'; g.fillStyle = 'rgba(0,0,0,.6)'; const t = `${r.name} · ${r.lv || 'safe'}`, tw = g.measureText(t).width; g.fillRect(F.ox + r.x * K - tw / 2 - 4, F.oy + r.y * K - 11, tw + 8, 16); g.fillStyle = '#f0c880'; g.fillText(t, F.ox + r.x * K, F.oy + r.y * K + 1); g.textAlign = 'left'; }
    }
    let lx = 24, ly = D.H - 130; g.font = '12px ui-monospace, monospace';
    for (const [k, col] of D.legend) { g.fillStyle = col; g.fillRect(lx, ly - 9, 10, 10); g.fillStyle = '#d8ccb4'; g.fillText(k, lx + 14, ly); lx += 150; if (lx > D.W - 160) { lx = 24; ly += 18; } }
    g.fillStyle = '#24485a'; g.fillRect(lx, ly - 9, 10, 10); g.fillStyle = '#d8ccb4'; g.fillText('water', lx + 14, ly);
    return c.toDataURL('image/png');
  }, draw);
  const file = join(OUT, `asbuilt-${site}.png`);
  writeFileSync(file, Buffer.from(png.split(',')[1], 'base64'));
  console.log(`→ ${file}`);
  await p.close();
}
await b.close();
