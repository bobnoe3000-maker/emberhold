// bowl.mjs — the Bowl's balance harness (docs/bowl-arena-proposal.md §7, GDD §17.2 v1.85): company against company,
// headless, both sides on the one member AI (battle.js memberTurn), each pairing fought from both ends of the sand (A as
// the party and B the rivals, then B as the party) over N seeds, so the side you start on is measured too.
//
//   node tools/balance/bowl.mjs [A] [B] [--lv 6] [--grade steady] [--vs steady] [--n 20] [--heal 0.75] [--dmg 1] [--cc 0.5] [--secs 120] [--src dir] [--site bowl] [--all] [--alone]
//
// A, B: manners (rivals.js MAKEUP: balanced brawlers stalkers wall spellbinders), default balanced balanced (the mirror).
// --grade / --vs: A's and B's grades (green steady seasoned hardened champion). --heal k: healing received × k in a bout
// (BOUT.heal); --dmg k: blows between companies × k (BOUT.dmg); --cc k: crowd control × k on a member (BOUT.cc). --all: every manner against every manner, at A's grade.
// --alone: one against one, each side its company's first member (the hero-alone bout). --src: a before checkout's src/.
// Prints: A's wins, draws, B's wins (each side), the bout's length, how many the Crier called on the clock, HP left.
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const flag = (k) => { const i = args.indexOf(k); return i >= 0 ? (args.splice(i, 1), true) : false; };
const SRC = path.resolve(opt('--src', path.resolve(import.meta.dirname, '../../src')));
const LV = +opt('--lv', 6), GA = opt('--grade', 'steady'), GB = opt('--vs', GA), N = +opt('--n', 20), SITE = opt('--site', 'bowl');
const HEAL = opt('--heal', null), DMG = opt('--dmg', null), CC = opt('--cc', null), SECS = opt('--secs', null), ALL = flag('--all'), ALONE = flag('--alone');
const [A = 'balanced', B = 'balanced'] = args;
const load = (f) => import(pathToFileURL(path.join(SRC, f)).href);
const { createSim } = await load('sim/core.js'), { isWalkable } = await load('sim/world.js'), { createBus } = await load('sim/bus.js');
const { createBattle, BOUT } = await load('sim/battle.js'), { makeCompany, MAKEUP } = await load('sim/rivals.js');
if (HEAL !== null) BOUT.heal = +HEAL;
if (DMG !== null) BOUT.dmg = +DMG;
if (CC !== null) BOUT.cc = +CC;
if (SECS !== null) BOUT.secs = +SECS;

/** one bout: company a as the party, b as the rivals; → { how, why, t, ours, theirs } */
function bout(a, ga, b, gb, seed) {
  const sim = createSim(seed, undefined, { scene: 'dungeon', site: SITE }), w = sim.world, st = sim.state, p = st.player;
  const L = w.level, room = L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom && (!q.size || q.size === 'large')) || L.rooms.find((q) => q !== L.entrance);
  const ours = makeCompany({ id: 'us', manner: a }, LV, ga);
  let theirs = makeCompany({ id: 'them', manner: b }, LV, gb);
  if (ALONE) theirs = theirs.slice(0, 1);
  ours.forEach((m, i) => { m.id = 'p' + i; m.main = i === 0; delete m.trials; });
  st.party = ours; st.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
  p.x = p.px = room.cx + 0.5; p.y = p.py = room.cy + 0.5;
  const bus = createBus();
  const battle = createBattle({ state: st, bus, getWorld: () => w, seed, isWalkable, onDefeat() {}, moveHero(dx, dy) { if (isWalkable(w, p.x + dx, p.y + dy)) { p.x += dx; p.y += dy; } } });
  let res = null; bus.on('boutEnd', (r) => { res = r; });
  battle.startBout(w, room.id, theirs, { salt: seed, alone: ALONE });
  for (let i = 0; i < 20 * 400 && !res; i++) { st.t += 0.05; battle.step(0.05); }
  return res || { how: 'stuck', why: 'stuck', t: 400, ours: 0, theirs: 0 };
}

function pairing(a, ga, b, gb) {
  const r = { aw: 0, d: 0, bw: 0, t: 0, clock: 0, left: 0, n: 0, sideA: 0, sideB: 0 };
  for (let s = 1; s <= N; s++) for (const swap of [false, true]) {
    const x = swap ? bout(b, gb, a, ga, s * 7919) : bout(a, ga, b, gb, s * 7919);
    const won = x.how === 'won', lost = x.how === 'lost', aWon = swap ? lost : won, bWon = swap ? won : lost;
    if (aWon) { r.aw++; if (swap) r.sideB++; else r.sideA++; } else if (bWon) r.bw++; else r.d++;
    r.t += x.t; r.clock += x.why === 'time' ? 1 : 0; r.left += Math.max(x.ours, x.theirs); r.n++;
  }
  const pc = (v) => Math.round((100 * v) / r.n) + '%';
  console.log(`${(a + ' ' + ga).padEnd(22)} vs ${(b + ' ' + gb).padEnd(22)} L${LV}${ALONE ? ' alone' : ''}: A ${pc(r.aw).padStart(4)} (as party ${Math.round((200 * r.sideA) / r.n)}%, as rivals ${Math.round((200 * r.sideB) / r.n)}%) · draw ${pc(r.d)} · B ${pc(r.bw).padStart(4)} · ${(r.t / r.n).toFixed(0)} s · clock ${pc(r.clock)} · winner's HP ${pc(r.left)}`);
  return r;
}

console.log(`dmg ×${BOUT.dmg} · heal ×${BOUT.heal} · cc ×${BOUT.cc} · ${BOUT.secs} s · ${N} seeds × both ends`);
if (ALL) { const ms = Object.keys(MAKEUP); for (const a of ms) for (const b of ms) if (a <= b) pairing(a, GA, b, GA); }
else pairing(A, GA, B, GB);
