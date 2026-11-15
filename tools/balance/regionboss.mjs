// regionboss.mjs — the Kingstone headless (GDD §19 v1.105, src/sim/ring.js; docs/region-boss-proposal.md §4): the right
// party (fighter, rogue, cleric) walks into the old stones in a window and fights the Ring to its end, with as many AI
// companies as the window draws (1–4 offline: picked windows give 2–5 parties). Prints, per run and in sum: won or lost,
// how long (the targets: 5–7 minutes at any head count), how often each of the party went down, the hero's tier and pay.
//   node tools/balance/regionboss.mjs [--parties 2,3,4,5] [--lv 18] [--seeds 3] [--pilot | --blind] [--src dir]
// --pilot: the hero is moved out of a tell as a player would (a 0.5 s look, then away to the nearest open ground);
// without it the hero is left to its own autobattle, which steps out late (RING.heroReact). --blind: nobody steps out of
// a tell, the AI companies included (the target: down several times, never a wipe).
import path from 'node:path';
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const SRC = path.resolve(opt('--src', path.resolve(import.meta.dirname, '../../src')));
const { createSim } = await import(path.join(SRC, 'sim/core.js'));
const { CAMP_BY } = await import(path.join(SRC, 'sim/camps.js'));
const { statsFor } = await import(path.join(SRC, 'sim/party.js'));
const items = await import(path.join(SRC, 'sim/items.js'));
const attrs = await import(path.join(SRC, 'sim/attributes.js'));
const { windowDraw, RING } = await import(path.join(SRC, 'sim/ring.js'));
const { openGround, tellAt } = await import(path.join(SRC, 'sim/hazards.js'));
const { isWalkable } = await import(path.join(SRC, 'sim/world.js'));

if (args.includes('--blind')) { RING.react = [999, 999]; RING.heroReact = 999; }   // (nobody steps out of a tell: §4's "a party that never moves")
const PARTIES = opt('--parties', '2,3,4,5').split(',').map(Number), LV = +opt('--lv', 18), SEEDS = +opt('--seeds', 3), PILOT = args.includes('--pilot');
const want = ['fighter', 'rogue', 'cleric'];

/** a window whose draw brings `n` AI companies @param {number} seed @param {number} n */
function windowFor(seed, n) {
  for (let d = 1; d < 29; d++) for (let h = 0; h < 24; h++) { const id = `2026-11-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}`; if (windowDraw(seed, id).n === n) return id; }
  return null;
}
function run(seed, parties) {
  const t = createSim(seed, undefined, { scene: 'town' }); for (const i of [0, 2]) { t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  const sim = createSim(seed, undefined, { scene: 'overland', region: 'fens' });
  sim.state.created = true; sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1 };
  sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  sim.state.party.forEach((m, i) => { m.cls = want[i]; m.level = LV; m.xp = 0; m.attrs = null; attrs.autoAllocate(m); m.gear = items.starterKit(m); m.fallen = false; m.down = false; m.weakUntil = 0; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; for (const p of m.perks || []) void p; if (i) { m.perks = []; m.hidden = null; } });
  const C = CAMP_BY.fens_stones, p = sim.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y + RING.near - 4;
  const id = windowFor(seed, parties - 1); if (!id) return null;
  let res = null; sim.bus.on('ringResult', (e) => { res = e; });
  sim.commands.push({ type: 'ringEnter', window: id, left: RING.window }); sim.tick();
  if (!sim.battle || !sim.battle.ring) return { refused: true };
  for (let i = 0; i < 20 * (RING.window + 30) && !res; i++) {
    const b = sim.battle;
    if (PILOT && b && b.ring && !sim.state.party[0].down) {                 // the player's eye: out of a tell after a look
      const w = sim.world, tl = tellAt(b, p.x, p.y, (q) => sim.state.t - q.from >= 0.5);
      const inRing = (x, y) => { const c = w.level.cells.get(Math.floor(x) + ',' + Math.floor(y)); return isWalkable(w, x, y) && !!c && c.room === b.room; };   // (not out of the gap: that's walking out)
      if (tl) { const o = openGround(b, p.x, p.y, b.ring.cx, b.ring.cy, inRing); if (o) sim.commands.push({ type: 'move', x: o[0] - p.x, y: o[1] - p.y }); }
    }
    sim.tick();
  }
  if (!res) return { unfinished: true };
  const ours = res.parts.filter((q) => q.company === 0);
  return { won: res.how === 'won', how: `${res.how}/${res.why}`, secs: res.secs, parties: res.parties, downs: ours.map((q) => q.downs), tier: res.tier, pay: res.pay };
}
console.log(`the Kingstone · the right party at ${LV} · ${args.includes('--blind') ? 'blind' : PILOT ? 'piloted' : 'autobattle'} · ${SEEDS} seeds a head count`);
for (const n of PARTIES) {
  const rs = [];
  for (let s = 1; s <= SEEDS; s++) { const r = run(20261115 + s, n); if (r) { rs.push(r); console.log(`  ${n} parties seed ${s}: ${r.won ? "won" : r.refused ? "refused" : r.how || "lost"} ${r.secs ?? '-'} s · downs ${(r.downs || []).join('/')} · ${r.tier || '-'}${r.pay ? ` · ${r.pay.gold} g ${r.pay.xp} xp ${r.pay.item ? r.pay.item.r : ''}` : ''}`); } }
  const ok = rs.filter((r) => r.won), med = (a) => { const q = [...a].sort((x, y) => x - y); return q[Math.floor(q.length / 2)]; };
  console.log(`${n} parties: won ${ok.length}/${rs.length} · median ${ok.length ? (med(ok.map((r) => r.secs)) / 60).toFixed(1) : '-'} min · our downs a run ${(rs.reduce((a, r) => a + (r.downs || []).reduce((x, y) => x + y, 0), 0) / Math.max(1, rs.length)).toFixed(1)}`);
}
