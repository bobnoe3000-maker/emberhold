// The count (M8 slice 5; GDD §17, world doc §2.1 and §7; sim/lamps.js): lamps broken and souls freed, two durable
// integers added to only by sim rules. An Ashbound put down frees one soul; the living never count. The Standard of the
// Third Legion carries his legion's lamp: when he falls it breaks (once: 240 souls, the legion's muster), and the bound
// still standing in his hall lie down. A harvester drops its cage where it falls; a touch in reach breaks it (a lamp
// and a soul). Save v19 credits a save that already put the Standard down; no command sets the count.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable, propAt } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { LAMPS, restoreCount } from '../src/sim/lamps.js';
import { migrate, countFrom } from '../src/persist/save.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const party = (sim, lv) => { const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [1, 3]); sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m }))); for (const m of sim.state.party) { m.level = lv; m.hp = statsFor(m).maxHp; } };
const down = (sim) => { const t = sim.world.stairsAt, p = sim.state.player; p.x = p.px = t.x + 0.5; p.y = p.py = t.y + 1.5; sim.commands.push({ type: 'harvest', tx: t.x, ty: t.y }); sim.tick(); };
const intoHall = (sim) => {
  const L = sim.world.level, r = L.descentRoom, S = sim.world.stairwell, p = sim.state.player; let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); if (S && x >= S.x0 - 1 && x <= S.x1 && y >= S.y0 - 1 && y <= S.y1) continue; const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5; sim.state.party.forEach((m, i) => { if (i) { m.x = m.px = p.x + (i === 1 ? -0.9 : 0.9); m.y = m.py = p.y + 0.9; } });
};
const fight = (sim, secs, until) => { for (let i = 0; i < secs * 20 && !until(); i++) { for (const m of sim.state.party) if (!m.down) m.hp = Math.max(m.hp, statsFor(m).maxHp * 0.6); sim.tick(); } };
const room = (sim) => { const L = sim.world.level, r = L.rooms.find((q) => q.id !== L.entrance.id && (!L.descentRoom || q.id !== L.descentRoom.id)), p = sim.state.player; p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5; };

test('an Ashbound put down frees a soul; the living never count', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'barrows' }); party(sim, 6); sim.tick(); room(sim);
  const slain = []; sim.bus.on('slain', (e) => slain.push(e.kind));
  fight(sim, 60, () => slain.length >= 6);
  assert.equal(sim.state.count.souls, slain.length, `the barrows' dead: ${slain.join(',')}`); assert.equal(sim.state.count.lamps, 0);
  const keep = createSim(SEED, undefined, { scene: 'dungeon', site: 'tithe_mill' }); party(keep, 4); keep.tick(); room(keep);
  const living = []; keep.bus.on('slain', (e) => living.push(e.kind));
  fight(keep, 60, () => living.length >= 4);
  assert.ok(living.length >= 4); assert.deepEqual(keep.state.count, { lamps: 0, souls: 0 }, 'the Redhand were never bound');
});

test('the Standard falls: his lamp breaks once (240 souls), and the bound still standing in his hall lie down', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'barrows' }); party(sim, 12); sim.tick();
  down(sim); down(sim); assert.equal(sim.state.depth, 2);
  const ev = []; for (const k of ['bossWave', 'lampBroken', 'bossDown']) sim.bus.on(k, (e) => ev.push([k, e]));
  intoHall(sim);
  let before = null;
  sim.bus.on('bossDown', () => { before = { ...sim.state.count }; });
  fight(sim, 300, () => ev.some(([k]) => k === 'lampBroken'));
  const lb = ev.find(([k]) => k === 'lampBroken'); assert.ok(lb, 'the lamp broke'); const L = lb[1];
  assert.equal(L.id, 'third_legion'); assert.ok(L.first); assert.equal(L.held, LAMPS.third_legion.souls);
  assert.equal(sim.state.count.lamps, 1); assert.deepEqual(sim.state.lampsBroken, ['third_legion']);
  assert.equal(sim.state.count.souls - before.souls, 1 + L.freed + 240, 'his own soul (he is Ashbound too), the line he held, and the 240 in the lamp');
  assert.ok((sim.world.enemies || []).every((e) => !e.undead || e.hp <= 0), 'every bound foe in the hall lies down');
  // a second time (his echo, the next visit): the line lies down again, but the lamp counts once
  const again = createSim(1); again.restore(JSON.parse(JSON.stringify(sim.snapshot())));
  assert.deepEqual(again.state.count, sim.state.count, 'the count survives a save'); assert.deepEqual(again.state.lampsBroken, ['third_legion']);
});

test('a harvester drops its cage where it falls; a touch in reach breaks it, once: a lamp and a soul', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'sickpools' }); party(sim, 13); sim.tick(); room(sim);
  const cages = []; sim.bus.on('cageDropped', (c) => cages.push(c));
  fight(sim, 240, () => cages.length > 0);
  assert.ok(cages.length, 'a harvester fell and dropped its cage'); const c = cages[0];
  assert.equal(propAt(sim.world, c.tx, c.ty), 'cage'); assert.ok(isWalkable(sim.world, c.tx + 0.5, c.ty + 0.5), 'underfoot, never in the way');
  const n0 = { ...sim.state.count }, p = sim.state.player;
  p.x = p.px = c.tx + 8.5; p.y = p.py = c.ty + 0.5; sim.commands.push({ type: 'harvest', tx: c.tx, ty: c.ty }); sim.tick();
  assert.deepEqual(sim.state.count, n0, 'out of reach: nothing');
  p.x = p.px = c.tx + 1.5; p.y = p.py = c.ty + 0.5; sim.commands.push({ type: 'harvest', tx: c.tx, ty: c.ty }); sim.tick();
  assert.equal(sim.state.count.lamps, n0.lamps + 1); assert.equal(sim.state.count.souls, n0.souls + 1);
  assert.equal(propAt(sim.world, c.tx, c.ty), null, 'broken');
  sim.commands.push({ type: 'harvest', tx: c.tx, ty: c.ty }); sim.tick();
  assert.equal(sim.state.count.lamps, n0.lamps + 1, 'a broken cage breaks once');
  const back = createSim(1); back.restore(JSON.parse(JSON.stringify(sim.snapshot()))); assert.deepEqual(back.state.count, sim.state.count);
});

test('save v19: an older save is credited the Standard\'s lamp if he fell; bad counts are refused; no command sets it', () => {
  const data = JSON.parse(JSON.stringify(createSim(SEED, undefined, { scene: 'town' }).snapshot())); delete data.count; delete data.lampsBroken;
  const fell = migrate({ version: 18, savedAt: 1, data: { ...data, bosses: { standard: 2 } } }).data;
  assert.deepEqual(fell.count, { lamps: 1, souls: 240 }); assert.deepEqual(fell.lampsBroken, ['third_legion']);
  assert.deepEqual(migrate({ version: 18, savedAt: 1, data }).data.count, { lamps: 0, souls: 0 }, 'he never fell: nothing');
  assert.deepEqual(countFrom({ ...data, count: { lamps: 3, souls: 9 } }).count, { lamps: 3, souls: 9 }, 'a v19 count is left alone');
  assert.deepEqual(restoreCount({ count: { lamps: -1, souls: 2.5 }, lampsBroken: ['third_legion', 'nope', 'third_legion'] }), { count: { lamps: 0, souls: 0 }, lampsBroken: ['third_legion'] });
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  for (const cmd of [{ type: 'count', lamps: 99 }, { type: 'setCount', souls: 99 }, { type: 'harvest', tx: 0, ty: 0 }, { type: 'credit', souls: 5 }]) { sim.commands.push(cmd); sim.tick(); }
  assert.deepEqual(sim.state.count, { lamps: 0, souls: 0 });
});
