// roomlv.mjs — the room-level balance harness (AGENTS.md rule 6). Puts a party of a given
// level in a room of a given level and lets it autobattle, reporting HP cost per wave.
//
//   node tools/balance/roomlv.mjs <secs> <roomLv> <heroLv> [hires e.g. 0,2] [seed] [--src dir] [--site id] [--no-trials] [--hero cls] [--rogue base] [--perks keep|a,b/c,d] [--fresh] [--up N]
//
// Every member is on its class's recommended build (attributes.js) and wears its class kit at its
// level (common), so the numbers compare with the class-table curve (gear carries a real share of
// power since 2026-09-30: a level-1 kit on a level-6 hero measures the kit, not the level).
// --src points at another checkout's src/ for before/after runs. --site fights in that site's first
// fighting room, against its family (sim/sites.js; default the Old Barrows). The class trials count as
// done (the contract's assumption, M5); --no-trials measures a company that hasn't done them yet.
// --hero makes the main character that class (default the knight); --rogue arms every rogue with that
// weapon base instead of the dagger (huntbow, longbow, handbow, heavybow: a two-handed one frees the off-hand).
import { pathToFileURL } from 'node:url';
import path from 'node:path';
// --fresh: hires at their hire level (half the hero's), not the hero's. --up N: everyone's kit at the smith's +N.
// --perks keep: the hires keep the perks the tavern rolled them; --perks a,b/c,d: the first hire fights
// with a and b, the second with c and d (companions.js ids). Without it, no perks: the contract's runs.
const pki = process.argv.indexOf('--perks'), PERKS = pki >= 0 ? process.argv.splice(pki, 2)[1] : null;
const GIVE = PERKS && PERKS !== 'keep' ? PERKS.split('/').map((s) => s.split(',').filter(Boolean)) : null;

const args = process.argv.slice(2), si = args.indexOf('--src');
const SRC = si >= 0 ? path.resolve(args.splice(si, 2)[1]) : path.resolve(import.meta.dirname, '../../src');
const ti = args.indexOf('--site'), SITE = ti >= 0 ? args.splice(ti, 2)[1] : 'barrows';
const ni = args.indexOf('--no-trials'), TRIALS = ni >= 0 ? (args.splice(ni, 1), {}) : { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
const hi = args.indexOf('--hero'), HERO = hi >= 0 ? args.splice(hi, 2)[1] : null;
const ri = args.indexOf('--rogue'), ROGUE = ri >= 0 ? args.splice(ri, 2)[1] : null;
// --fresh: the hires fight at the level they're hired at (half the hero's, rounded up: GDD §6.2 v1.11), not
// levelled up to the hero's as the contract measures them; with their kit at that level
const fi = args.indexOf('--fresh'), FRESH = fi >= 0 ? (args.splice(fi, 1), true) : false;
// --up N: every member's kit at the smith's +N (items.js UP_STEP a step on the base stats)
const ui = args.indexOf('--up'), UP = ui >= 0 ? +args.splice(ui, 2)[1] : 0;
const load = (f) => import(pathToFileURL(path.join(SRC, f)).href);
const { createSim } = await load('sim/core.js'), { isWalkable } = await load('sim/world.js'), { statsFor } = await load('sim/party.js');
const attrs = await load('sim/attributes.js').catch(() => null);
const items = await load('sim/items.js').catch(() => null);

const [secs, RL, HL] = args.slice(0, 3).map(Number), hire = (args[3] || '').split(',').filter(Boolean).map(Number), seed = +(args[4] || 20260807);
const s = createSim(seed, undefined, { scene: 'town' }); for (const i of hire) { s.state.counters.gold = 1e9; s.commands.push({ type: 'hire', idx: i }); s.tick(); } s.state.counters.gold = 0; s.state.party.slice(1).forEach((m, i) => { if (PERKS !== 'keep') { m.perks = GIVE ? GIVE[i] || [] : []; m.hidden = null; } });   // (the contract: hires without perks)
const sim = createSim(seed, undefined, { scene: 'dungeon', site: SITE }); sim.state.trials = TRIALS;   // (older checkouts ignore it)
sim.state.party.push(...s.state.party.slice(1).map((m) => ({ ...m })));
if (HERO) sim.state.party[0].cls = HERO;
for (const m of sim.state.party) {
  m.level = FRESH && !m.main ? Math.max(1, Math.ceil(HL / 2)) : HL; if (attrs) { m.attrs = null; attrs.autoAllocate(m); } if (items && items.starterKit) m.gear = items.starterKit(m); if (UP) for (const it of Object.values(m.gear || {})) if (it) it.up = UP;
  if (ROGUE && m.cls === 'rogue') { m.gear.weapon = items.makeItem(ROGUE, HL, 'common', { uid: m.id + ':bow' }); if (items.isTwoHanded(m.gear.weapon)) m.gear.off = null; }
  m.hp = statsFor(m).maxHp; m.mp = undefined;
}
const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, RL);
{ let best = null, bd = 1e9; for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } } p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5; }
const frac = () => { let a = 0, b = 0; for (const m of sim.state.party) { if (m.fallen) continue; a += m.down ? 0 : m.hp; b += statsFor(m).maxHp; } return a / b; };
let def = false, low = 1, start = 1, fallen = 0; const costs = [], lows = [];
sim.bus.on('wave', (d) => { if (d.cleared) { costs.push(start - low); lows.push(low); } else { low = start = frac(); } });
let downs = 0; sim.bus.on('combat', (c) => { if (c.t === 'down') downs++; });
sim.bus.on('defeat', () => (def = true));
// DMG=1: damage dealt and taken by each party member, and how much of the fight each spent shooting / swinging
const dealt = {}, taken = {}; if (process.env.DMG) sim.bus.on('combat', (c) => { if (c.t !== 'hit') return; if (c.party) { const m = sim.state.party.find((q) => Math.abs(q.x - c.x) < 0.01 && Math.abs(q.y - c.y) < 0.01); if (m) taken[m.cls] = (taken[m.cls] || 0) + c.amount; } else dealt[c.src] = (dealt[c.src] || 0) + c.amount; }); sim.bus.on('fallen', () => fallen++);
for (let t = 0; t < 20 * secs && !def; t++) { sim.tick(); if (sim.world.enemies.length) low = Math.min(low, frac()); }
const avg = (a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
console.log(`${SITE === 'barrows' ? '' : SITE + ' '}${GIVE ? `{${GIVE.map((g) => g.join('+') || '-').join(' / ')}} ` : ''}${HERO || ROGUE ? `[${sim.state.party.map((m) => m.cls + (m.cls === 'rogue' ? ':' + m.gear.weapon.base : '')).join(' ')}] ` : ''}room L${RL} hero L${HL}${hire.length ? ' +' + hire.length : ''}: ${def ? 'DEFEAT' : 'held'} ${sim.state.t.toFixed(0)}s · ${costs.length} waves · end lv ${sim.state.party.map((m) => m.level).join('/')} · cost/wave first10 ${Math.round(100 * avg(costs.slice(0, 10)))}% · lowest ${Math.round(100 * Math.min(1, ...lows))}% · downs ${downs} · fallen ${fallen} · gold ${sim.state.counters.gold}`);
if (process.env.DMG) console.log('  dealt', JSON.stringify(dealt), '· taken', JSON.stringify(taken));
