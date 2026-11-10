// dress-audit.mjs — what stands in each authored room (docs/level-design-rules.md §4): every dressing piece counted by
// kind, room by room, beside the room's size class and the caps the rules allow it, so a room that repeats a piece past
// its size (six torches in a small room, a dozen banners) shows. Reads the sim's own built floors (world.js), seeds as
// given (the dressing is seeded: the rules must hold on any).
//   node tools/dungeon/dress-audit.mjs [site…] [--seed N] [--over]   (--over: only the rooms over a cap, and the count)
//   node tools/dungeon/dress-audit.mjs --clear [site…] [--seeds N]   (§4.4, keepclear.js: every site's floors, authored or
//   generated, over N seeds: what stands on the stairs, in a doorway, or a light out in the open; the count by rule)
import { createWorld } from '../../src/sim/world.js';
import { PLANS } from '../../src/sim/plans.js';
import { capOf, REPEAT } from '../../src/sim/dresscaps.js';
import { dressingFaults } from '../../src/sim/keepclear.js';
import { SITES } from '../../src/sim/sites.js';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const SEED = +opt('--seed', 20260807), OVER = args.includes('--over'), sites = args.filter((a) => !a.startsWith('--'));
let over = 0, rooms = 0;
if (args.includes('--clear')) {
  const N = +opt('--seeds', 5), by = {}, want = sites.filter((q) => SITES[q]); let floors = 0, faults = 0;
  for (const [site, S] of Object.entries(SITES)) {
    if (want.length && !want.includes(site)) continue;
    const n = S.floors || 3; if (S.parked) continue;
    for (let depth = 0; depth < n; depth++) for (let s = 0; s < N; s++) {
      let w; try { w = createWorld((SEED + s * 1013 ^ depth * 7919) >>> 0, undefined, depth, site); } catch { continue; }
      const f = dressingFaults(w); floors++; faults += f.length;
      for (const q of f) { const key = `${q.why}: ${q.kind}`; by[key] = (by[key] || 0) + 1; }
      if (f.length && args.includes('--list')) console.log(`${site} f${depth + 1} s${s}: ${f.map((q) => `${q.kind}@${q.key} (${q.why})`).join(', ')}`);
    }
  }
  for (const [k, v] of Object.entries(by).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
  console.log(`${floors} floors, ${faults} pieces where §4.4 says no`);
  process.exit(0);
}
for (const pl of Object.values(PLANS)) {
  if (sites.length && !sites.includes(pl.site)) continue;
  pl.floors.forEach((f, depth) => {
    const w = createWorld((SEED ^ depth * 7919) >>> 0, undefined, depth, pl.site), L = w.level;
    for (const r of L.rooms) {
      const n = new Map();
      for (const [k, kind] of w.props) { const c = L.cells.get(k); if (c && c.room === r.id && !c.corridor) n.set(kind, (n.get(kind) || 0) + 1); }
      const bad = [...n].filter(([kind, c]) => REPEAT.has(kind) && c > capOf(kind, r.size));
      rooms++; over += bad.length ? 1 : 0;
      if (OVER && !bad.length) continue;
      const list = [...n].sort((a, b) => b[1] - a[1]).map(([k, c]) => (REPEAT.has(k) && c > capOf(k, r.size) ? `${k} ${c}>${capOf(k, r.size)}!` : `${k} ${c}`)).join(', ');
      console.log(`${pl.site} f${depth + 1} ${r.part.padEnd(20)} ${r.size.padEnd(7)} ${list}`);
    }
  });
}
console.log(`${rooms} rooms, ${over} over a cap (seed ${SEED})`);
