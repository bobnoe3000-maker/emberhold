// Your hero Downed, the first companion standing is yours (the owner, 2026-11-26: "When my main char dies i cannot
// control my companions movement", "You should let party movement still work if the main char is down", "Scroll home
// also will not work in this scenario"; battle.js steerLead, core.js leadWalk). The stick, a tap and the compass's Step
// out move it; walked out of the fight, the fight ends as a step-out does and the hero is carried out with it, up at
// 20 %, a Downed companion Fallen; let go, it fights on its own. A Homeward Scroll is read by anyone standing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { CAMP_BY } from '../src/sim/camps.js';
import { makeMember, statsFor } from '../src/sim/party.js';
import { isWalkable } from '../src/sim/world.js';
import { hypot } from '../src/sim/detmath.js';

const SEED = 20260807, SPIT = CAMP_BY.vale_spit;
const company = (sim, lv, ...cls) => { cls.forEach((c, i) => { const m = makeMember(`c${i + 1}`, `Mate${i + 1}`, c, lv); m.hp = statsFor(m).maxHp; sim.state.party.push(m); }); };
const place = (sim, x, y) => { const p = sim.state.player; p.x = p.px = x; p.y = p.py = y; sim.state.party.forEach((m, i) => { m.x = m.px = x + (i ? (i === 1 ? -0.9 : 0.9) : 0); m.y = m.py = y + (i ? 0.9 : 0); }); };
/** the Spit's fight on, a fighter and a cleric beside the hero, the hero and the fighter then Downed */
function spitFight() {
  const sim = createSim(SEED, undefined, { scene: 'overland', region: 'vale' }); sim.tick();
  company(sim, 30, 'fighter', 'cleric');
  place(sim, SPIT.x - SPIT.reach + 0.5, SPIT.y);
  for (let i = 0; i < 40 && !sim.battle; i++) sim.tick();
  assert.ok(sim.battle && sim.battle.camp === SPIT, 'the Spit is on');
  const [H, F] = sim.state.party; for (const m of [H, F]) { m.hp = 0; m.down = true; }
  return { sim, H, F, C: sim.state.party[2] };
}
const keepUp = (sim, m) => { m.hp = statsFor(m).maxHp; };   // (the one steered isn't worn down while it walks)

test('your hero Downed, the stick moves the first companion standing; walked out of the arena, the hero is carried out', () => {
  const { sim, H, F, C } = spitFight(), ev = []; sim.bus.on('carriedOut', (d) => ev.push(d));
  assert.equal(sim.lead, C, 'the cleric is the one you steer (the fighter is Downed)');
  const lay = { x: sim.state.player.x, y: sim.state.player.y }, from = { x: C.x, y: C.y };
  let t = 0; for (; t < 20 * 30 && sim.battle; t++) { keepUp(sim, C); const dx = C.x - SPIT.x, dy = C.y - SPIT.y, d = hypot(dx, dy) || 1; sim.commands.push({ type: 'move', x: dx / d, y: dy / d }); sim.tick(); }
  assert.equal(sim.battle, null, `walked out, the fight is over (${(t / 20).toFixed(1)} s)`);
  assert.ok(hypot(C.x - from.x, C.y - from.y) > 3, 'the cleric walked');
  assert.equal(ev.length, 1, 'carried out once'); assert.equal(ev[0].by, C.name);
  const p = sim.state.player;
  assert.ok(hypot(p.x - lay.x, p.y - lay.y) > 3 && hypot(p.x - C.x, p.y - C.y) < 1.5, 'the hero is where the cleric stands, not where it lay');
  assert.ok(hypot(p.x - SPIT.x, p.y - SPIT.y) > SPIT.arena, 'outside the arena');
  assert.ok(!H.down && H.hp > 0, 'the hero up'); assert.ok(F.fallen, 'the Downed fighter walked out on: Fallen');
  for (let i = 0; i < 40; i++) sim.tick();
  assert.equal(sim.battle, null, "and the Spit doesn't start again round the hero");
});

test('let go, the one you steer fights on its own; nobody to steer once the hero is up', () => {
  const { sim, H, C } = spitFight();
  for (let i = 0; i < 10; i++) { sim.commands.push({ type: 'move', x: 1, y: 0 }); sim.tick(); }
  const at = { x: C.x, y: C.y };
  for (let i = 0; i < 4; i++) sim.tick();
  assert.ok(hypot(C.x - at.x, C.y - at.y) < 0.05, 'just let go: it holds a moment, as the hero does');
  sim.state.party[0].down = false; H.hp = 10;
  assert.equal(sim.lead, null, 'the hero up: the stick is the hero\'s again');
});

test('your hero Downed, Step out walks the one you steer out of a dungeon room, and the hero with it', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon' }), L = sim.world.level, p = sim.state.player;
  company(sim, 30, 'cleric');
  const r = L.rooms.find((q) => sim.world.roomLevels.get(q.id) === 1); let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  place(sim, best[0] + 0.5, best[1] + 0.5);
  for (let i = 0; i < 40 && !sim.battle; i++) sim.tick();
  assert.ok(sim.battle, 'a room fight'); const H = sim.state.party[0], C = sim.state.party[1]; H.hp = 0; H.down = true;
  const row = sim.destinations().find((q) => q.id === 'step-out'); assert.ok(row, 'Step out offered with the hero Downed');
  sim.commands.push({ type: 'goto', tx: row.tx, ty: row.ty, near: row.near, then: null, label: 'Step out' });
  let t = 0; for (; t < 20 * 40 && sim.battle; t++) { keepUp(sim, C); sim.tick(); }
  assert.equal(sim.battle, null, `out (${(t / 20).toFixed(1)} s)`);
  const cell = L.cells.get(Math.floor(p.x) + ',' + Math.floor(p.y));
  assert.ok(!H.down && cell && cell.room !== r.id, 'the hero up, carried out of the room');
});

test('a Homeward Scroll is read with the hero Downed while anyone stands: home, the hero up', async () => {
  const { BASES } = await import('../src/sim/items.js');
  const { sim, H } = spitFight();
  const base = Object.keys(BASES).find((k) => BASES[k].use === 'homeward'), uid = 'scroll-test';
  sim.state.bag.push({ uid, base, name: BASES[base].name, r: 'common', ilv: 1 });
  sim.commands.push({ type: 'useItem', uid }); sim.tick();
  assert.equal(sim.world.kind, 'town', 'home'); assert.equal(sim.battle, null);
  assert.ok(!H.down && H.hp > 0, 'the hero up'); assert.ok(!sim.state.bag.some((it) => it && it.uid === uid), 'the scroll used');
});

test('nobody standing, there is nobody to steer and no scroll to read', async () => {
  const { BASES } = await import('../src/sim/items.js');
  const { sim, C } = spitFight(); C.hp = 0; C.down = true;
  assert.equal(sim.lead, null);
  const base = Object.keys(BASES).find((k) => BASES[k].use === 'homeward'), uid = 'scroll-test';
  sim.state.bag.push({ uid, base, name: BASES[base].name, r: 'common', ilv: 1 });
  sim.commands.push({ type: 'useItem', uid }); sim.commands.push({ type: 'move', x: 1, y: 0 }); sim.tick();
  assert.equal(sim.world.kind, 'overland'); assert.ok(sim.state.bag.some((it) => it && it.uid === uid), 'the scroll kept');
});
