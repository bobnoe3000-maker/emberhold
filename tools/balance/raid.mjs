// raid.mjs — raids headless (GDD §18 v1.97, sim/raid.js, docs/party-up-raids-proposal.md §9): a hero at a level sets out
// on a dungeon's raid with two stand-ins and is played as a player would: fight each room as it comes (the run holds it
// its six waves), make for the gate's room while the gate is up, then the stairs down or the last hall, until the band's
// boss falls (won), the company is wiped (lost) or the time runs out. Prints, per seed: won, minutes, rooms won, the
// hero's lowest HP, downs, and what was found; then the share won, the median time and the gear a run found.
//
//   node tools/balance/raid.mjs <site> <heroLv> [seeds] [--hero cls] [--seats any,any] [--mins 60] [--src dir]
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const SRC = path.resolve(opt('--src', path.resolve(import.meta.dirname, '../../src')));
const HERO = opt('--hero', 'fighter'), SEATS = opt('--seats', 'any,any').split(','), MINS = +opt('--mins', 60);
const load = (f) => import(pathToFileURL(path.join(SRC, f)).href);
const { createSim } = await load('sim/core.js'), { statsFor } = await load('sim/party.js');
const attrs = await load('sim/attributes.js'), { makeRival } = await load('sim/rivals.js'), { RAID } = await load('sim/raid.js'), { LANDS } = await load('sim/regions.js'), { QS } = await load('sim/quests.js');
const SITE = args[0] || 'wickham_keep', HL = +(args[1] || 6), N = +(args[2] || 6);

const rows = [];
for (let s = 0; s < N; s++) {
  const seed = 20261114 + s * 7919;
  const sim = createSim(seed, undefined, { scene: 'town' }), S = sim.state, H = S.party[0];
  S.created = true; S.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
  for (const L of Object.values(LANDS)) if (L.opens) S.quests[L.opens] = { st: QS.DONE, step: 0, n: [] };   // (every land open)
  H.cls = HERO; H.level = HL; H.xp = 0; H.attrs = null; attrs.autoAllocate(H);
  { const twin = makeRival({ id: 'hero', name: H.name, cls: HERO, level: HL, grade: RAID.grade }); H.gear = twin.gear; H.skills = twin.skills; }   // (the hero built as a stand-in is: kit and skills by the raid's grade)
  H.hp = statsFor(H).maxHp; H.mp = statsFor(H).maxMp;
  let end = null, low = 1, downs = 0; const found = { common: 0, fine: 0, rare: 0, heirloom: 0 };
  sim.bus.on('raidEnd', (e) => { end = e; });
  sim.bus.on('loot', (l) => { if (sim.raid && l.src !== 'raidCoffer' && l.src !== 'coffer') found[l.item.r]++; });
  sim.bus.on('combat', (c) => { if (c.t === 'down' && c.name === H.name) downs++; });
  sim.bus.on('shrineOffer', (o) => { if (o.will !== 'none') sim.commands.push({ type: 'useShrine', tx: o.tx, ty: o.ty }); });
  sim.commands.push({ type: 'raidOut', site: SITE, seats: SEATS }); sim.tick();
  if (!sim.raid) { console.log(`seed ${s}: refused`); continue; }
  const t0 = S.t; let stuck = 0, lx = 0, ly = 0;
  while (!end && S.t - t0 < MINS * 60) {
    const p = S.player, b = sim.battle;
    // between rooms, as a player does: wait in the corridor until the company is back on its feet (regen ×5 out of a fight)
    const worn = !b && S.party.some((m) => !m.down && (m.hp < statsFor(m).maxHp * 0.9 || m.mp < statsFor(m).maxMp * 0.6));
    if (worn) { if (p.path) sim.commands.push({ type: 'cancelWalk' }); sim.tick(); continue; }
    if (!(b && !b.quiet) && !p.path) {
      const r = sim.destinations(), pick = (...ids) => ids.map((k) => r.find((q) => q.id === k && !q.off)).find(Boolean);
      const go = pick('gate', 'stairs-down', 'last-hall', 'next-room');
      if (go) sim.commands.push({ type: 'goto', tx: go.tx, ty: go.ty, near: go.near, then: go.then || null, label: go.label, room: go.room });
    }
    sim.tick();
    low = Math.min(low, H.hp / statsFor(H).maxHp);
    if (S.tick % 200 === 0) { stuck = Math.abs(p.x - lx) + Math.abs(p.y - ly) < 0.5 && !sim.battle ? stuck + 1 : 0; lx = p.x; ly = p.y; if (stuck > 6) break; }
  }
  const r = sim.raid || {};
  rows.push({ seed: s, won: !!(end && end.won), why: end ? (end.won ? 'won' : end.why) : stuck > 6 ? 'stuck' : 'time', mins: +((S.t - t0) / 60).toFixed(1), rooms: end ? end.rooms : r.rooms, depth: end ? '' : r.depth, low: Math.round(low * 100), downs, found, coffer: end && end.coffer ? end.coffer.item && end.coffer.item.r : '' });
}
for (const r of rows) console.log(`seed ${r.seed}: ${r.why.padEnd(5)} ${String(r.mins).padStart(5)} min · rooms ${r.rooms}${r.depth !== '' ? ` (floor ${r.depth + 1})` : ''} · low ${r.low} % · downs ${r.downs} · found C${r.found.common} F${r.found.fine} R${r.found.rare} H${r.found.heirloom}${r.coffer ? ` · coffer ${r.coffer}` : ''}`);
const won = rows.filter((r) => r.won), med = (a) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : 0; };
const g = (k) => (rows.reduce((n, r) => n + r.found[k], 0) / Math.max(1, rows.length)).toFixed(2);
console.log(`${SITE} · a level-${HL} ${HERO} with ${SEATS.join(' + ')}: won ${won.length}/${rows.length} · median ${med(won.map((r) => r.mins))} min · a run found C${g('common')} F${g('fine')} R${g('rare')} (before its coffer)`);
