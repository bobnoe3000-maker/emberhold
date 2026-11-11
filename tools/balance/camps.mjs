// camps.mjs — the spawn points' fights (GDD §10.3, src/sim/camps.js): each fought N times by a lone hero and by the
// contract's party (fighter, rogue, cleric), in kit at a level, from the edge of its reach; how often it's won, how long
// it takes, the lowest the party's health went. A spawn point is one band, flat, no tide (§10.3: not the §7.1 contract),
// so the measure is that its level's party wins it comfortably and a lone hero of its level can, at a cost.
//   node tools/balance/camps.mjs [--camp id,id] [--n 8] [--dl -1,0,1] [--src dir]
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const SRC = path.resolve(opt('--src', path.resolve(import.meta.dirname, '../../src'))), load = (f) => import(pathToFileURL(path.join(SRC, f)).href);
const { createSim } = await load('sim/core.js'), { CAMPS, campState } = await load('sim/camps.js'), { makeHero, makeMember, statsFor } = await load('sim/party.js');
const { autoAllocate } = await load('sim/attributes.js'), { starterKit } = await load('sim/items.js'), { isWalkable } = await load('sim/world.js');
const N = +opt('--n', 8), DL = opt('--dl', '0').split(',').map(Number), ONLY = opt('--camp', null);
function fight(c, level, party, seed) {
  const sim = createSim(seed, undefined, { scene: 'overland', region: c.region }); sim.tick();
  const ms = party.map((cls, i) => (i ? makeMember(`c${i}`, `Mate${i}`, cls, level) : makeHero({ cls, name: 'Hero' })));
  for (const m of ms) { m.level = level; m.attrs = null; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = undefined; }
  sim.state.party.splice(0, sim.state.party.length, ...ms); sim.state.created = true;
  let at = null;   // from the edge of its reach, the first way round that's open ground
  for (let k = 0; k < 16 && !at; k++) { const a = k * Math.PI / 8, x = c.x + Math.cos(a) * (c.reach - 0.5), y = c.y + Math.sin(a) * (c.reach - 0.5); if (isWalkable(sim.world, x, y)) at = [x, y]; }
  const p = sim.state.player; p.x = p.px = at[0]; p.y = p.py = at[1]; ms.forEach((m, i) => { if (i) { m.x = m.px = at[0] + (i === 1 ? -0.9 : 0.9); m.y = m.py = at[1] + 0.9; } });
  let won = false, lost = false, low = 1; sim.bus.on('campCleared', () => (won = true)); sim.bus.on('defeat', () => (lost = true));
  const frac = () => { let a = 0, b = 0; for (const m of sim.state.party) { a += m.down || m.fallen ? 0 : m.hp; b += statsFor(m).maxHp; } return a / b; };
  let t = 0; for (; t < 20 * 120 && !won && !lost; t++) { sim.tick(); if (sim.battle) low = Math.min(low, frac()); }
  return { won, secs: t / 20, low, elite: campState(sim.state, c.id).n >= 0 };
}
for (const c of CAMPS.filter((q) => !ONLY || ONLY.split(',').includes(q.id))) {
  for (const dl of DL) for (const [who, party] of [['lone fighter', ['fighter']], ['party', ['fighter', 'rogue', 'cleric']]]) {
    const L = Math.max(1, c.level + dl), r = []; for (let i = 0; i < N; i++) r.push(fight(c, L, party, 1000 + i * 7919));
    const w = r.filter((q) => q.won), avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
    console.log(`${c.id.padEnd(15)} L${String(c.level).padEnd(3)} ${who.padEnd(13)} at L${String(L).padEnd(3)} won ${w.length}/${N} · ${avg(w.map((q) => q.secs)).toFixed(0)} s · lowest ${Math.round(100 * avg(r.map((q) => q.low)))} %`);
  }
}
