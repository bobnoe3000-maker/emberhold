// dress-audit.mjs — what stands in each authored room (docs/level-design-rules.md §4): every dressing piece counted by
// kind, room by room, beside the room's size class and the caps the rules allow it, so a room that repeats a piece past
// its size (six torches in a small room, a dozen banners) shows. Reads the sim's own built floors (world.js), seeds as
// given (the dressing is seeded: the rules must hold on any).
//   node tools/dungeon/dress-audit.mjs [site…] [--seed N] [--over]   (--over: only the rooms over a cap, and the count)
import { createWorld } from '../../src/sim/world.js';
import { PLANS } from '../../src/sim/plans.js';
import { capOf, REPEAT } from '../../src/sim/dresscaps.js';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const SEED = +opt('--seed', 20260807), OVER = args.includes('--over'), sites = args.filter((a) => !a.startsWith('--'));
let over = 0, rooms = 0;
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
