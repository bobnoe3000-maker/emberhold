// loot.mjs — the headless farm (development plan §2.7, M5 tune): how much gear an hour of active play
// finds. A fighter + rogue + cleric at a level, in their class kit at that level, trials done, work a
// floor of the Old Barrows whose rooms are about their level: walk into the next unexplored room, hold it
// STAY waves (a room keeps sending them; a player moves on), open every chest and shrine the compass shows, and when the floor's done, go round again (a
// fresh visit: its chests are full again). Between fights they're patched up, as a player steps out and
// rests; their level is held, so the hour is an hour at that level. Counts drops by source and rarity
// per hour of play (sim time).
//
//   node tools/balance/loot.mjs <heroLv> [hours] [seed] [--src dir]
// Floors: level 1–4 the first, 5–7 the second, 8+ the third (room levels base 1 + 3 a floor).
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const PERKS = process.argv.includes('--perks'); if (PERKS) process.argv.splice(process.argv.indexOf('--perks'), 1);   // --perks: the hires keep the perks the tavern rolled them (without it: none, as the contract measures)

const args = process.argv.slice(2), si = args.indexOf('--src');
const SRC = si >= 0 ? path.resolve(args.splice(si, 2)[1]) : path.resolve(import.meta.dirname, '../../src');
const load = (f) => import(pathToFileURL(path.join(SRC, f)).href);
const { createSim } = await load('sim/core.js'), { statsFor } = await load('sim/party.js');
const attrs = await load('sim/attributes.js'), items = await load('sim/items.js');
const HL = +args[0], HOURS = +(args[1] || 1), seed = +(args[2] || 20260807), DEPTH = HL <= 4 ? 0 : HL <= 7 ? 1 : 2;

const t = createSim(seed, undefined, { scene: 'town' }); for (const i of [0, 2]) { t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: i }); t.tick(); } t.state.counters.gold = 0; for (const m of t.state.party) if (!m.main && !PERKS) { m.perks = []; m.hidden = null; }   // (the contract: hires without rolled perks; --perks keeps them)
const sim = createSim(seed, undefined, { scene: 'dungeon' });
sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1 };
sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
const want = ['fighter', 'rogue', 'cleric'];
const fresh = (m, i) => { m.cls = want[i]; m.level = HL; m.xp = 0; m.attrs = null; attrs.autoAllocate(m); m.gear = items.starterKit(m); m.fallen = false; m.down = false; m.weakUntil = 0; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; };
sim.state.party.forEach(fresh);
const patch = () => { for (const m of sim.state.party) { m.level = HL; m.xp = 0; m.fallen = false; m.down = false; m.weakUntil = 0; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; } };
// a fresh visit: the floor as new (chests full, nothing explored), from its entrance
const enter = () => { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'dungeon', site: 'barrows', depth: DEPTH, floors: [], bag: [], mods: [], hp: [], discovered: [], visited: [], player: { x: -1, y: -1 } }); patch(); };
enter();

const got = {}, add = (src, r) => { got[src] ||= { common: 0, fine: 0, rare: 0, heirloom: 0 }; got[src][r] = (got[src][r] || 0) + 1; };
sim.bus.on('loot', (l) => add(l.src, l.item.r));
const STAY = 4;
let waves = 0, here = 0, chests = 0, visits = 1, wipes = 0, wasBattle = false;
sim.bus.on('wave', (w) => { if (w.cleared) { waves++; here++; } });
sim.bus.on('battle', (e) => { if (e.on) here = 0; });
sim.bus.on('looted', (e) => { if (e.kind === 'chest') chests++; });
sim.bus.on('defeat', () => { wipes++; });
sim.bus.on('shrineOffer', (o) => { if (o.will !== 'none') sim.commands.push({ type: 'useShrine', tx: o.tx, ty: o.ty }); });   // the popup's Use, when it would help (GDD §3.6 v1.14)
const END = HOURS * 3600;
let idle = 0;
while (sim.state.t < END) {
  if (sim.world.kind !== 'dungeon' || sim.state.depth !== DEPTH) { enter(); visits++; }
  const b = !!sim.battle;
  if (wasBattle && !b) patch();                                              // stepped out and rested
  wasBattle = b;
  sim.state.bag.length = 0;                                                  // (the bag never fills: every drop is counted)
  const p = sim.state.player;
  if (b && (here >= STAY || sim.battle.quiet) && !p.path) {                                        // held it long enough: on to the next
    const rows = sim.destinations(), r = ['loot', 'next-room'].map((k) => rows.find((q) => q.id === k && !q.off)).find(Boolean);
    if (r) sim.commands.push({ type: 'goto', tx: r.tx, ty: r.ty, near: r.near, then: r.then || null, label: r.label, room: r.room });
    else { enter(); visits++; }
  }
  if (!b && !p.path) {
    if (p.resume) sim.commands.push({ type: 'resume' });
    else {
      const rows = sim.destinations(), r = ['loot', 'next-room'].map((k) => rows.find((q) => q.id === k && !q.off)).find(Boolean);
      if (r) { sim.commands.push({ type: 'goto', tx: r.tx, ty: r.ty, near: r.near, then: r.then || null, label: r.label, room: r.room }); idle = 0; }
      else if (++idle > 20) { enter(); visits++; idle = 0; }                // the floor's done: round again
    }
  }
  sim.tick();
}
const per = (n) => (n / HOURS).toFixed(1), tot = { common: 0, fine: 0, rare: 0, heirloom: 0 };
for (const g of Object.values(got)) for (const k of Object.keys(tot)) tot[k] += g[k] || 0;
console.log(`L${HL} · floor ${DEPTH + 1} · ${HOURS} h · seed ${seed}: per hour ${per(tot.common)} common, ${per(tot.fine)} fine, ${per(tot.rare)} rare`
  + ` · by source ${Object.entries(got).map(([s, g]) => `${s} ${per(g.common + g.fine + g.rare)}`).join(', ')} · ${per(waves)} waves, ${per(chests)} chests, ${visits} visits, ${wipes} wipes`);
