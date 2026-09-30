// boss.mjs — the boss balance harness (M5, docs/m5-plan.md §3). Puts a fighter + rogue + cleric at a
// level, in their class kit at that level (common, as roomlv.mjs), into a site's boss hall and lets
// the fight run: did the boss fall, how long, the lowest party HP, downs and Fallen. Trials counted as
// done (their level-6 abilities), as the difficulty contract assumes.
//
//   node tools/balance/boss.mjs <site> <heroLv> [seeds e.g. 1,2,3] [--src dir]
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2), si = args.indexOf('--src');
const SRC = si >= 0 ? path.resolve(args.splice(si, 2)[1]) : path.resolve(import.meta.dirname, '../../src');
const load = (f) => import(pathToFileURL(path.join(SRC, f)).href);
const { createSim } = await load('sim/core.js'), { isWalkable } = await load('sim/world.js'), { statsFor } = await load('sim/party.js');
const attrs = await load('sim/attributes.js'), items = await load('sim/items.js');
const [site, HL] = [args[0], +args[1]], seeds = (args[2] || '20260807,777,4242').split(',').map(Number);

for (const seed of seeds) {
  const t = createSim(seed, undefined, { scene: 'town' }); for (const i of [0, 2]) { t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  const sim = createSim(seed, undefined, { scene: 'dungeon', site });
  sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  sim.state.party[0].cls = 'fighter'; const want = ['fighter', 'rogue', 'cleric'];
  sim.state.party.forEach((m, i) => { m.cls = want[i]; m.level = HL; m.attrs = null; attrs.autoAllocate(m); m.gear = items.starterKit(m); m.hp = statsFor(m).maxHp; m.mp = undefined; });
  if (sim.state.trials) for (const c of want) sim.state.trials[c] = 1;
  sim.tick();
  while (sim.world.stairsAt) { const s = sim.world.stairsAt, p = sim.state.player; p.x = p.px = s.x + 0.5; p.y = p.py = s.y + 1.5; sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick(); if (site === 'barrows' && sim.state.depth >= 2) break; }
  // into the hall: the tile nearest its middle within its largest open stretch (some halls are mostly
  // pools; you walk in along open ground, you don't land in a pocket)
  const L = sim.world.level, r = L.descentRoom, p = sim.state.player, K = (x, y) => x + ',' + y;
  const open = (x, y) => { const c = L.cells.get(K(x, y)); return c && c.kind === 'floor' && c.room === r.id && isWalkable(sim.world, x + 0.5, y + 0.5); };
  const comp = new Map(); let big = -1, bigN = 0;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id || comp.has(k)) continue; const [x0, y0] = k.split(',').map(Number); if (!open(x0, y0)) continue;
    const id = comp.size ? Math.max(...comp.values()) + 1 : 0, q = [[x0, y0]]; comp.set(k, id);
    for (let h = 0; h < q.length; h++) { const [x, y] = q[h]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nk = K(x + dx, y + dy); if (!comp.has(nk) && open(x + dx, y + dy)) { comp.set(nk, id); q.push([x + dx, y + dy]); } } }
    if (q.length > bigN) { bigN = q.length; big = id; } }
  let best = null, bd = 1e9;
  for (const [k, id] of comp) { if (id !== big) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  // the company walks in together: each companion on an open tile of the same stretch, beside the hero
  const beside = [...comp].filter(([, id]) => id === big).map(([k]) => k.split(',').map(Number)).filter(([x, y]) => (x !== best[0] || y !== best[1])).sort((a, c) => Math.hypot(a[0] - best[0], a[1] - best[1]) - Math.hypot(c[0] - best[0], c[1] - best[1]));
  sim.state.party.forEach((m, i) => { if (i) { const [x, y] = beside[i * 2 - 1] || best; m.x = m.px = x + 0.5; m.y = m.py = y + 0.5; } });
  let fell = false, defeat = false, downs = 0, fallen = 0, low = 1, calls = 0;
  sim.bus.on('bossDown', () => { fell = true; }); sim.bus.on('defeat', () => { defeat = true; }); sim.bus.on('bossCall', () => calls++);
  sim.bus.on('combat', (c) => { if (c.t === 'down') downs++; }); sim.bus.on('fallen', () => fallen++);
  let bossHp = 1; sim.bus.on('bossWave', () => {}); const bossLeft = () => { const b = (sim.world.enemies || []).find((e) => e.boss); if (b) bossHp = b.hp / b.maxHp; };
  const frac = () => { let a = 0, b = 0; for (const m of sim.state.party) { if (m.fallen) continue; a += m.down ? 0 : m.hp; b += statsFor(m).maxHp; } return a / b; };
  const t0 = sim.state.t, hall = sim.world.roomLevels.get(r.id);
  for (let i = 0; i < 20 * 300 && !fell && !defeat; i++) { sim.tick(); if (!defeat) { low = Math.min(low, frac()); bossLeft(); }
    if (process.env.TRACE && i % 60 === 0 && !defeat) console.log('  ', (i / 20).toFixed(0) + 's', 'foes', (sim.world.enemies || []).filter((e) => e.hp > 0).map((e) => `${e.kind}${e.boss ? '*' : ''}:${Math.round(100 * e.hp / e.maxHp)}%@${e.x.toFixed(0)},${e.y.toFixed(0)}`).join(' '), '| party', sim.state.party.map((m) => `${m.cls}:${m.down ? 'D' : Math.round(100 * m.hp / statsFor(m).maxHp) + '%'}@${(m.x || 0).toFixed(0)},${(m.y || 0).toFixed(0)}`).join(' ')); }
  console.log(`${site} hall L${hall} · party L${HL} seed ${seed}: ${fell ? 'BOSS DOWN' : defeat ? `DEFEAT (boss at ${Math.round(bossHp * 100)}%)` : 'still fighting'} ${(sim.state.t - t0).toFixed(0)}s · lowest ${Math.round(low * 100)}% · downs ${downs} · fallen ${fallen}${calls ? ' · calls ' + calls : ''}`);
}
