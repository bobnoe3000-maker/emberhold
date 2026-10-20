// frontier.mjs — the Frontier's difficulty, headless (docs/frontier-proposal.md §6): a party (fighter, rogue, cleric in
// the Common kit of their level) locked at camps of a level, N spots over the land, each a few minutes; how often it
// wipes, how often someone's Downed, its lowest HP, kills and XP a minute (the hero's, as the smoke test reports a
// room's).
//   node tools/balance/frontier.mjs <party level> <ground level> [minutes 5] [spots 8] [seed]
import { readFileSync } from 'node:fs';
import { createFrontier } from '../../src/sim/frontier/frontier.js';

const [lv, areaLv, mins = 5, N = 8, seed = 20260807] = process.argv.slice(2).map(Number);
if (!lv || !areaLv) { console.log('usage: node tools/balance/frontier.mjs <party level> <ground level> [minutes] [spots] [seed]'); process.exit(1); }
const coast = JSON.parse(readFileSync(new URL('../../assets/maps/old-provinces.json', import.meta.url), 'utf8')).coast;
const L = createFrontier(seed, coast, { level: lv }).land, spots = [];
for (let cy = 0; cy < L.CHN && spots.length < 400; cy++) for (let cx = 0; cx < L.CW; cx++) {
  const R = L.regionAt(cx * 64 + 32, cy * 64 + 32); if (!R || areaLv < R.band[0] || areaLv > R.band[1]) continue;
  for (const k of L.chunk(cx, cy).camps) if (k.lv === areaLv && k.kind !== 'lair' && spots.every((s) => Math.hypot(s.x - k.x, s.y - k.y) > 200)) spots.push(k);
}
const pick = spots.filter((_, i) => i % Math.max(1, Math.floor(spots.length / N)) === 0).slice(0, N);
if (!pick.length) { console.log(`no camp at ${areaLv} on this seed`); process.exit(0); }
let downs = 0, low = 0, xpm = 0, kills = 0, wiped = 0;
for (const k of pick) {
  const fr = createFrontier(seed, coast, { level: lv }), p = fr.state.party; let d = 0; fr.bus.on('down', () => d++);
  p.forEach((m, i) => { m.x = k.x + 6 + i * 0.5; m.y = k.y + 0.5; });
  fr.commands.push({ type: 'stick', x: -0.01, y: 0 }); fr.tick(); fr.commands.push({ type: 'release' });
  let lowest = 1, xp = 0, kl = 0;
  for (let s = 0; s < 20 * 60 * mins; s++) { fr.tick(); for (const m of p) lowest = Math.min(lowest, m.hp / m.st.maxHp); const I = fr.lockInfo(); if (I) { xp = I.xpMin; kl = I.kills; } }
  wiped += fr.state.wipes ? 1 : 0; downs += d; low += lowest; xpm += xp; kills += kl;
}
const n = pick.length;
console.log(`FRONTIER L${lv} on ${areaLv}: ${n} spots × ${mins} min · wiped at ${wiped}/${n} · Downed ${(downs / n).toFixed(1)} a spot · lowest ${(low / n * 100).toFixed(0)} % · ${(kills / n / mins).toFixed(1)} kills/min · XP/min ${Math.round(xpm / n)}`);
