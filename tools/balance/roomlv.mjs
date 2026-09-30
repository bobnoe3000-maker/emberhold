// roomlv.mjs — the room-level balance harness (AGENTS.md rule 6). Puts a party of a given
// level in a room of a given level and lets it autobattle, reporting HP cost per wave.
//
//   node tools/balance/roomlv.mjs <secs> <roomLv> <heroLv> [hires e.g. 0,2] [seed] [--src dir] [--site id] [--no-trials]
//
// Every member is on its class's recommended build (attributes.js) and wears its class kit at its
// level (common), so the numbers compare with the class-table curve (gear carries a real share of
// power since 2026-09-30: a level-1 kit on a level-6 hero measures the kit, not the level).
// --src points at another checkout's src/ for before/after runs. --site fights in that site's first
// fighting room, against its family (sim/sites.js; default the Old Barrows). The class trials count as
// done (the contract's assumption, M5); --no-trials measures a company that hasn't done them yet.
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2), si = args.indexOf('--src');
const SRC = si >= 0 ? path.resolve(args.splice(si, 2)[1]) : path.resolve(import.meta.dirname, '../../src');
const ti = args.indexOf('--site'), SITE = ti >= 0 ? args.splice(ti, 2)[1] : 'barrows';
const ni = args.indexOf('--no-trials'), TRIALS = ni >= 0 ? (args.splice(ni, 1), {}) : { fighter: 1, rogue: 1, mage: 1, cleric: 1 };
const load = (f) => import(pathToFileURL(path.join(SRC, f)).href);
const { createSim } = await load('sim/core.js'), { isWalkable } = await load('sim/world.js'), { statsFor } = await load('sim/party.js');
const attrs = await load('sim/attributes.js').catch(() => null);
const items = await load('sim/items.js').catch(() => null);

const [secs, RL, HL] = args.slice(0, 3).map(Number), hire = (args[3] || '').split(',').filter(Boolean).map(Number), seed = +(args[4] || 20260807);
const s = createSim(seed, undefined, { scene: 'town' }); for (const i of hire) { s.commands.push({ type: 'hire', idx: i }); s.tick(); }
const sim = createSim(seed, undefined, { scene: 'dungeon', site: SITE }); sim.state.trials = TRIALS;   // (older checkouts ignore it)
sim.state.party.push(...s.state.party.slice(1).map((m) => ({ ...m })));
for (const m of sim.state.party) { m.level = HL; if (attrs) { m.attrs = null; attrs.autoAllocate(m); } if (items && items.starterKit) m.gear = items.starterKit(m); m.hp = statsFor(m).maxHp; m.mp = undefined; }
const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, RL);
{ let best = null, bd = 1e9; for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } } p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5; }
const frac = () => { let a = 0, b = 0; for (const m of sim.state.party) { if (m.fallen) continue; a += m.down ? 0 : m.hp; b += statsFor(m).maxHp; } return a / b; };
let def = false, low = 1, start = 1, fallen = 0; const costs = [], lows = [];
sim.bus.on('wave', (d) => { if (d.cleared) { costs.push(start - low); lows.push(low); } else { low = start = frac(); } });
let downs = 0; sim.bus.on('combat', (c) => { if (c.t === 'down') downs++; });
sim.bus.on('defeat', () => (def = true)); sim.bus.on('fallen', () => fallen++);
for (let t = 0; t < 20 * secs && !def; t++) { sim.tick(); if (sim.world.enemies.length) low = Math.min(low, frac()); }
const avg = (a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
console.log(`${SITE === 'barrows' ? '' : SITE + ' '}room L${RL} hero L${HL}${hire.length ? ' +' + hire.length : ''}: ${def ? 'DEFEAT' : 'held'} ${sim.state.t.toFixed(0)}s · ${costs.length} waves · end lv ${sim.state.party.map((m) => m.level).join('/')} · cost/wave first10 ${Math.round(100 * avg(costs.slice(0, 10)))}% · lowest ${Math.round(100 * Math.min(1, ...lows))}% · downs ${downs} · fallen ${fallen} · gold ${sim.state.counters.gold}`);
