// pace.mjs — a dungeon walked through headless, as a player plays it (the owner, 2026-11-16, after the gates before
// every room, GDD v1.118, and the boss rooms fighting on, v1.117: "do 2", a pacing check). A company (a fighter, a
// rogue and a cleric, each built as a seasoned stand-in is, rivals.js) sets out from a site's first floor in a new
// slot (every gate shut) and is played on: rested in the corridors between rooms; each room fought until its wave
// falls, then on; a room that wins a gate still up held until the gate drops; a boss fought until he falls; then the
// stairs down, until the site's last boss falls. The company's level is the floor's (its hall's room level), held.
// Prints, per seed: done or not, minutes, waves fought, gates dropped, the XP the fights paid an hour, wipes; then the
// medians. With --src pointing at an older checkout, the same walk there: a before and an after.
//
//   node tools/balance/pace.mjs [site,site…] [--seeds N] [--mins 240] [--src dir]
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const SRC = path.resolve(opt('--src', path.resolve(import.meta.dirname, '../../src')));
const N = +opt('--seeds', 3), MINS = +opt('--mins', 240);
const load = (f) => import(pathToFileURL(path.join(SRC, f)).href);
const { createSim } = await load('sim/core.js'), { statsFor } = await load('sim/party.js'), attrs = await load('sim/attributes.js');
const { makeRival } = await load('sim/rivals.js'), { RAID } = await load('sim/raid.js'), { SITES, bossAt } = await load('sim/sites.js');
const { LANDS } = await load('sim/regions.js'), { QS } = await load('sim/quests.js');
const SITE_LIST = (args[0] || 'barrows,wickham_keep,sunken_chapel,toadking_mound,canal_locks,drowned_abbey').split(',');
const CLS = ['fighter', 'rogue', 'cleric'];

/** the walk through one site on one seed */
function walk(site, seed) {
  const S0 = SITES[site], last = S0.floors - 1, lastBoss = bossAt(site, last);
  const t = createSim(seed, undefined, { scene: 'town' }); for (const i of [0, 2]) { t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  const sim = createSim(seed, undefined, { scene: 'dungeon', site }), S = sim.state;
  S.created = true; S.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
  for (const L of Object.values(LANDS)) if (L.opens) S.quests[L.opens] = { st: QS.DONE, step: 0, n: [] };
  S.party.push(...t.state.party.slice(1).map((m) => ({ ...m, perks: [], hidden: null })));
  const lvOf = (d) => { const w = sim.world, L = w.level; return (L && L.descentRoom && w.roomLevels.get(L.descentRoom.id)) || S0.base + d; };
  const build = (lv) => S.party.forEach((m, i) => {
    m.cls = CLS[i]; m.level = lv; m.xp = 0; m.attrs = null; attrs.autoAllocate(m);
    const twin = makeRival({ id: 'p' + i, name: m.name, cls: CLS[i], level: lv, grade: RAID.grade }); m.gear = twin.gear; m.skills = twin.skills;
    m.fallen = false; m.down = false; m.weakUntil = 0; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp;
  });
  let lv = lvOf(0); build(lv);
  let waves = 0, gates = 0, xp = 0, wipes = 0, done = false, here = 0, fought = 0;
  sim.bus.on('wave', (e) => { if (e.cleared) { waves++; here++; } });
  sim.bus.on('battle', (e) => { if (e.on) here = 0; });
  sim.bus.on('gateOpened', () => gates++);
  sim.bus.on('combat', (c) => { if (c.t === 'xp') xp += c.amount || 0; });
  sim.bus.on('bossDown', (e) => { if (e.id === lastBoss && S.depth === last) done = true; });
  sim.bus.on('defeat', () => wipes++);
  let scrolls = 0; sim.bus.on('loot', (l) => { if (l.item && l.item.base === 'homeward') scrolls++; });   // (Homeward Scrolls found: items.js SCROLL_DROP)
  sim.bus.on('shrineOffer', (o) => { if (o.will !== 'none') sim.commands.push({ type: 'useShrine', tx: o.tx, ty: o.ty }); });
  sim.bus.on('levelChanged', () => { if (sim.world.kind === 'dungeon') { lv = lvOf(S.depth); build(lv); } });
  // the gate a room wins, still up (this checkout's gates: a floor's several, or its one)
  const gatesHere = () => { const w = sim.world; return w.gates ? w.gates.filter((g) => w.gateShut && g.cells.some((c) => w.gateShut.has(c))) : w.gate && w.gateShut ? [w.gate] : []; };
  let deepest = 0, stuck = 0, lx = 0, ly = 0;
  const back = () => { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'dungeon', site, depth: deepest, floors: [], player: { x: -1, y: -1 } }); lv = lvOf(deepest); build(lv); };
  while (!done && S.t < MINS * 60) {
    if (sim.world.kind !== 'dungeon') back();                                   // a wipe: back in where the company had got to
    deepest = Math.max(deepest, S.depth);
    for (const m of S.party) { m.level = lv; m.xp = 0; }
    const p = S.player, b = sim.battle;
    if (b) fought += 0.05;
    // between rooms, as a player does: wait in the corridor until the company is back on its feet
    const worn = !b && S.party.some((m) => !m.down && (m.hp < statsFor(m).maxHp * 0.9 || m.mp < statsFor(m).maxMp * 0.6));
    if (worn) { if (p.path) sim.commands.push({ type: 'cancelWalk' }); sim.tick(); continue; }
    const hold = b && !b.quiet && (gatesHere().some((g) => g.rooms.includes(b.room)) || (sim.world.enemies || []).some((e) => e.boss && e.hp > 0 && !e.dead) || here < 1);
    if (!hold && !p.path) {
      const r = sim.destinations(), pick = (...ids) => ids.map((k) => r.find((q) => q.id === k && !q.off)).find(Boolean);
      const go = pick('gate', 'stairs-down', 'last-hall', 'next-room');
      if (go && !(b && go.room === b.room)) sim.commands.push({ type: 'goto', tx: go.tx, ty: go.ty, near: go.near, then: go.then || null, label: go.label, room: go.room });
    }
    sim.tick();
    if (S.tick % 200 === 0) { stuck = Math.abs(p.x - lx) + Math.abs(p.y - ly) < 0.5 && !sim.battle ? stuck + 1 : 0; lx = p.x; ly = p.y; if (stuck > 30) break; }
  }
  const mins = S.t / 60;
  return { done, why: done ? 'done' : stuck > 30 ? 'stuck' : 'time', mins, waves, gates, xpHour: Math.round(xp / (S.t / 3600)), wipes, floor: deepest + 1, fightShare: fought / S.t, scrolls };
}

const med = (a) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : 0; };
for (const site of SITE_LIST) {
  if (!SITES[site]) { console.log(`${site}: no such site here`); continue; }
  const rows = [];
  for (let s = 0; s < N; s++) {
    const r = walk(site, 20261116 + s * 7919); rows.push(r);
    console.log(`${site} seed ${s}: ${r.why.padEnd(5)} ${r.mins.toFixed(1).padStart(6)} min · floor ${r.floor} · ${r.waves} waves · ${r.gates} gates · ${r.xpHour} XP/h · fighting ${Math.round(100 * r.fightShare)} % · wipes ${r.wipes} · scrolls ${r.scrolls}`);
  }
  const ok = rows.filter((r) => r.done);
  console.log(`${site} (${SITES[site].floors} floors, levels ${SITES[site].base}+): done ${ok.length}/${rows.length} · median ${med(ok.map((r) => r.mins)).toFixed(1)} min · ${med(rows.map((r) => r.waves))} waves · ${med(rows.map((r) => r.gates))} gates · ${med(rows.map((r) => r.xpHour))} XP/h · wipes ${rows.reduce((n, r) => n + r.wipes, 0)}`);
}
