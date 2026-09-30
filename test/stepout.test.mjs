// The way out of a fight (GDD §7.1): a room never gives up, so a visit ends when you walk out. The
// compass offers "Step out" only in a fight, to a corridor tile past a doorway; walking there ends
// the fight, the corridor restores the party at 5×, and going back in starts a fresh visit (the
// tide back at the start). So farming is leaving and returning: a lone level-1 hero who steps out
// when low clears more waves over a few visits than one stubborn visit, and never wipes. The
// board says which jobs want company.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { boardOffers, companyFor } from '../src/sim/board.js';

const SEED = 20260807;
const inRoom = (seed = SEED) => {
  const sim = createSim(seed, undefined, { scene: 'dungeon' }), L = sim.world.level;
  const r = L.rooms.find((q) => sim.world.roomLevels.get(q.id) === 1), p = sim.state.player;
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  return { sim, room: r, spot: { x: p.x, y: p.y } };
};
const hpFrac = (sim) => { const h = sim.state.party[0]; return h.hp / statsFor(h).maxHp; };
const stepOut = (sim) => { const row = sim.destinations().find((r) => r.id === 'step-out'); assert.ok(row, 'a way out'); sim.commands.push({ type: 'goto', tx: row.tx, ty: row.ty, near: row.near, then: null, label: 'Step out' }); return row; };
const cellOf = (sim, x, y) => sim.world.level.cells.get(Math.floor(x) + ',' + Math.floor(y));

test('"Step out" is offered only in a fight, and leads to a corridor past the room\'s doorway', () => {
  const { sim, room } = inRoom();
  const e = sim.world.level.entrance, p = sim.state.player, keep = { x: p.x, y: p.y };
  p.x = p.px = e.cx + 0.5; p.y = p.py = e.cy + 0.5; sim.tick();
  assert.ok(!sim.destinations().some((r) => r.id === 'step-out'), 'not outside a fight');
  p.x = p.px = keep.x; p.y = p.py = keep.y;
  for (let i = 0; i < 40 && !sim.battle; i++) sim.tick();
  assert.ok(sim.battle); assert.equal(sim.battle.room, room.id);
  const row = sim.destinations().find((r) => r.id === 'step-out');
  assert.ok(row && row.steps > 0 && sim.destinations()[0].id === 'step-out', 'first in the list');
  assert.ok(cellOf(sim, row.tx + 0.5, row.ty + 0.5).room < 0, 'outside the room');
});

test('stepping out when low ends the fight, the corridor restores you, and going back in is a fresh visit', () => {
  const { sim, spot } = inRoom(), ev = []; for (const k of ['battle', 'defeat', 'wave']) sim.bus.on(k, (d) => ev.push({ k, ...d }));
  for (let i = 0; i < 20 * 300 && hpFrac(sim) > 0.45 && !ev.some((x) => x.k === 'defeat'); i++) sim.tick();
  assert.ok(hpFrac(sim) <= 0.45 && sim.battle, 'low, mid-fight');
  const waves = sim.battle.wave; assert.ok(waves >= 2, `${waves} waves in`);
  stepOut(sim);
  for (let i = 0; i < 20 * 20 && sim.battle; i++) sim.tick();
  assert.equal(sim.battle, null, 'out'); assert.ok(ev.some((x) => x.k === 'battle' && !x.on && x.why === 'left'));
  assert.ok(!ev.some((x) => x.k === 'defeat'));
  const low = hpFrac(sim);
  for (let i = 0; i < 20 * 40 && hpFrac(sim) < 1; i++) sim.tick();
  assert.ok(hpFrac(sim) >= 0.999 && low < 0.6, `restored from ${Math.round(low * 100)} % in the corridor`);
  const p = sim.state.player; p.x = p.px = spot.x; p.y = p.py = spot.y;
  const n = ev.length; for (let i = 0; i < 60 && !sim.battle?.wave; i++) sim.tick();
  assert.ok(sim.battle && sim.battle.wave === 1, 'a fresh visit: wave 1 again, the tide back at the start');
  assert.ok(ev.slice(n).some((x) => x.k === 'battle' && x.on));
});

test('farming is leaving and returning: a lone level-1 hero who steps out when low clears more than one stubborn visit, and never wipes', () => {
  const stubborn = inRoom(); let w0 = 0, lost = false;
  stubborn.sim.bus.on('wave', (d) => { if (d.cleared) w0++; }); stubborn.sim.bus.on('defeat', () => (lost = true));
  for (let i = 0; i < 20 * 600 && !lost; i++) stubborn.sim.tick();
  assert.ok(lost, 'the stubborn visit ends in defeat');
  const { sim, spot } = inRoom(); let waves = 0, defeats = 0, visits = 0;
  sim.bus.on('wave', (d) => { if (d.cleared) waves++; }); sim.bus.on('defeat', () => defeats++);
  for (let v = 0; v < 4; v++) {
    const p = sim.state.player; p.x = p.px = spot.x; p.y = p.py = spot.y; visits++;
    for (let i = 0; i < 20 * 300 && !(sim.battle && hpFrac(sim) < 0.45); i++) sim.tick();
    stepOut(sim);
    for (let i = 0; i < 20 * 20 && sim.battle; i++) sim.tick();
    for (let i = 0; i < 20 * 40 && hpFrac(sim) < 1; i++) sim.tick();
  }
  assert.equal(defeats, 0, 'never wiped');
  assert.ok(waves > w0, `${waves} waves over ${visits} visits vs ${w0} in one stubborn visit`);
});

test('the board says which jobs want company: a Warden or Delve room of level 4+ near or above your level', () => {
  assert.equal(companyFor('warden', 4, 3), true); assert.equal(companyFor('delve', 4, 2), true);
  assert.equal(companyFor('delve', 4, 8), false, 'well below you: fine alone');
  assert.equal(companyFor('hold', 9, 9), false, 'you pick the room');
  assert.equal(companyFor('warden', 3, 1), false, 'a level-3 hall: a lone hero can manage');
  for (let d = 0; d < 20; d++) for (const j of boardOffers(SEED, d, 3)) if (j.tpl === 'warden' || j.tpl === 'delve') assert.equal(j.company, true, j.id);
});
