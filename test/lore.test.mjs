// The Chronicle of the Fall (world doc §7, v1.6–v1.8): the Vale set's ten fragments, placed from
// the world seed, found by opening their chest or shrine or holding their hall; paid once; in the
// save; read by Ink (Sister Ilse, her errand); the words in content/lore/ match the sim and canon.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { createWorld } from '../src/sim/world.js';
import { FRAGMENTS, SETS, HALL_WAVES, holderOf } from '../src/sim/lore.js';
import { QS } from '../src/sim/quests.js';

const dungeon = (seed = 20260807) => createSim(seed, undefined, { scene: 'dungeon' });
const at = (sim, x, y) => { const p = sim.state.player; p.x = p.px = x; p.y = p.py = y; };
const open = (sim, key) => { const [x, y] = key.split(',').map(Number); at(sim, x + 1.5, y + 0.5); sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick(); };
const goDown = (sim) => { let s; for (const [k, v] of sim.world.props) if (v === 'stairs') s = k; open(sim, s); };
const events = (sim, names) => { const ev = []; for (const e of names) sim.bus.on(e, (d) => ev.push({ e, ...d })); return ev; };

test('placement is the world seed\'s: the same chest every time, a different one for another seed, and only on its floor', () => {
  const a = dungeon(), b = dungeon(), id = 'frag_vale_standing_order';
  const h = a.lore.holder(id); assert.ok(h); assert.deepEqual(b.lore.holder(id), h);
  if (h.via === 'chest') assert.equal(a.world.props.get(h.key), 'chest');
  assert.equal(a.lore.holder('frag_vale_centurion_tablet'), null, 'not the first floor\'s');
  const kinds = new Set(); for (const seed of [1, 2, 3, 7, 99991, 12345, 555]) { const s = dungeon(seed), q = s.lore.holder(id); kinds.add(q.via === 'chest' ? `${seed}:${q.key}` : `${seed}:hall`); }
  assert.ok(kinds.size >= 5, 'seeds differ');
  assert.equal(holderOf(1, id, createSim(1, undefined, { scene: 'town' }).world), null);
});

// Ilse's errand says the first floor's chests are a start: a floor whose dressing drew no chest, or whose last one the
// stairs or the pruning took, hid Standing Order 14 in the hall instead (8 Barrows first floors in 200; a
// third floor in 6, a quarter to half of the Sunken Chapel's). Every floor now keeps a chest you can walk to.
test('every floor keeps a chest, so the Barrows\' first floor always holds Standing Order 14 in one', () => {
  const at = (s) => s * 7919 + 13;   // (the seeds the count above was made on: the listed ones had no chest before)
  for (const [site, d, bad] of [['barrows', 0, [11, 17, 45, 71, 81, 107, 129, 173]], ['barrows', 2, [5, 17, 45]], ['sunken_chapel', 0, [4, 7, 9]], ['sunken_chapel', 1, [1, 2, 4]], ['tithe_mill', 0, [48, 99, 109]]]) {
    for (const s of [...bad, 1, 3, 6, 10, 12]) {
      const w = createWorld(at(s), undefined, d, site);
      assert.ok([...w.props.values()].includes('chest'), `${site} floor ${d + 1}, seed ${at(s)}: no chest`);
      if (site === 'barrows' && d === 0) assert.equal(holderOf(at(s), 'frag_vale_standing_order', w).via, 'chest', `seed ${at(s)}`);
    }
  }
});

test('opening its chest finds Standing Order 14: once, paid a little XP; another chest finds nothing', () => {
  const sim = dungeon(), ev = events(sim, ['fragmentFound']), h = sim.lore.holder('frag_vale_standing_order');
  assert.equal(h.via, 'chest', 'this seed\'s first floor has chests (the hall case is below)');
  const other = [...sim.world.props].find(([k, v]) => v === 'chest' && k !== h.key);
  if (other) { open(sim, other[0]); assert.equal(ev.length, 0); }
  const xp0 = sim.state.party[0].xp, lv0 = sim.state.party[0].level;
  open(sim, h.key); open(sim, h.key);
  assert.deepEqual(sim.state.fragments, ['frag_vale_standing_order']);
  assert.equal(ev.length, 1); assert.deepEqual([ev[0].found, ev[0].of, ev[0].xp], [1, 10, 20]);
  assert.ok(sim.state.party[0].xp > xp0 || sim.state.party[0].level > lv0);
});

test('the centurion\'s tablet: hold the second floor\'s stairs-down hall three waves in one visit', () => {
  const sim = dungeon(), ev = events(sim, ['fragmentFound']);
  goDown(sim); assert.equal(sim.state.depth, 1);
  assert.equal(sim.lore.holder('frag_vale_centurion_tablet').via, 'hall');
  const hall = sim.world.level.descentRoom.id, other = sim.world.level.rooms.find((r) => r !== sim.world.level.descentRoom && r !== sim.world.level.entrance).id;
  for (let i = 0; i < 5; i++) sim.bus.emit('wave', { cleared: true, room: other });
  assert.equal(ev.length, 0, 'not another room');
  sim.bus.emit('battle', { on: true, room: hall }); sim.bus.emit('wave', { cleared: true, room: hall }); sim.bus.emit('wave', { cleared: true, room: hall });
  sim.bus.emit('battle', { on: true, room: hall }); sim.bus.emit('wave', { cleared: true, room: hall });   // a new visit starts the count again
  assert.equal(ev.length, 0);
  for (let i = 1; i < HALL_WAVES; i++) sim.bus.emit('wave', { cleared: true, room: hall });
  assert.deepEqual(ev.map((e) => e.id), ['frag_vale_centurion_tablet']);
});

test('the whole set: setComplete; the save keeps them; unknown ids are dropped; older saves have none', () => {
  const sim = dungeon(), ev = events(sim, ['setComplete']);
  sim.state.fragments = SETS.vale.filter((id) => id !== 'frag_vale_centurion_tablet');
  goDown(sim); const hall = sim.world.level.descentRoom.id; sim.bus.emit('battle', { on: true, room: hall });
  for (let i = 0; i < HALL_WAVES; i++) sim.bus.emit('wave', { cleared: true, room: hall });
  assert.deepEqual(ev.map((e) => e.set), ['vale']);
  const data = JSON.parse(JSON.stringify(sim.snapshot())); assert.equal(data.fragments.length, 10);
  const b = dungeon(); b.restore({ ...data, fragments: ['frag_vale_muster_roll', 'frag_nope', 'frag_vale_muster_roll', 7] }); assert.deepEqual(b.state.fragments, ['frag_vale_muster_roll']);
  const old = { ...data }; delete old.fragments; b.restore(old); assert.deepEqual(b.state.fragments, []);
});

test('a ward of the Grey Sisters is paid a fifth more for lore', () => {
  const sim = dungeon(), ev = events(sim, ['fragmentFound']); sim.state.party[0].origin = 'grey_sisters_ward';
  goDown(sim); const hall = sim.world.level.descentRoom.id; sim.bus.emit('battle', { on: true, room: hall });
  for (let i = 0; i < HALL_WAVES; i++) sim.bus.emit('wave', { cleared: true, room: hall });
  assert.equal(ev[0].xp, 24);
});

test('Ink reads the fragments; Sister Ilse\'s errand counts one found in the Barrows and is hers alone', () => {
  const town = createSim(20260807, undefined, { scene: 'town' }), ev = events(town, ['dialogue']);
  const talk = (sim, id) => { const n = sim.world.npcs.find((q) => q.id === id), p = sim.state.player; p.x = p.px = n.x + 1; p.y = p.py = n.y - 1; sim.commands.push({ type: 'endTalk' }); sim.tick(); sim.commands.push({ type: 'talk', npc: id }); sim.tick(); };
  town.state.fragments = ['frag_vale_muster_roll'];
  talk(town, 'sister_ilse'); const v = ev.at(-1).vars;
  assert.deepEqual([v.frag_vale_muster_roll, v.frag_vale_standing_order, v.frag_vale_count, v.q_vale_first_page], [1, 0, 1, QS.AVAILABLE]);
  const accept = (sim) => { sim.commands.push({ type: 'dialogueEffect', tag: 'quest', args: ['accept', 'vale_first_page'] }); sim.tick(); };
  accept(town);
  assert.equal(town.quests.status('vale_first_page'), QS.READY, 'a Barrows fragment found before the errand counts: it can\'t be found twice');
  const fresh = createSim(20260807, undefined, { scene: 'town' }); fresh.state.fragments = ['frag_vale_tithe_ledger']; talk(fresh, 'sister_ilse'); accept(fresh);
  assert.equal(fresh.quests.status('vale_first_page'), QS.ACTIVE, 'the Tithe Mill\'s ledger isn\'t from the barrows');
  const data = JSON.parse(JSON.stringify(fresh.snapshot())), d = dungeon(); d.restore({ ...data, scene: 'dungeon', depth: 0, player: { x: 0, y: 0 } });
  // a save from before the fix: the errand taken after the first floor's chest was opened, stuck at 0 of 1
  const stuck = dungeon(); stuck.restore({ ...data, fragments: ['frag_vale_tithe_ledger', 'frag_vale_standing_order'] });
  assert.equal(stuck.quests.status('vale_first_page'), QS.READY, 'an old save with the fragment already held loads ready');
  d.state.fragments = []; goDown(d); const hall = d.world.level.descentRoom.id; d.bus.emit('battle', { on: true, room: hall });
  for (let i = 0; i < HALL_WAVES; i++) d.bus.emit('wave', { cleared: true, room: hall });
  assert.equal(d.quests.status('vale_first_page'), QS.READY);
});

// ── the words: the sim's table against content/lore and the world doc (canon) ─
const world = readFileSync('docs/emberfall-world.md', 'utf8').replace(/\s+/g, ' ');
test('content/lore matches the sim table, in reading order, and every text is canon', () => {
  const defs = readdirSync('content/lore').filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`content/lore/${f}`, 'utf8')));
  assert.deepEqual(defs.map((d) => d.id).sort(), Object.keys(FRAGMENTS).sort());
  for (const d of defs) {
    const f = FRAGMENTS[d.id]; assert.equal(d.set, f.set); assert.equal(d.order, f.order); assert.equal(SETS[f.set][f.order - 1], d.id);
    const core = d.text.replace(/^Standing order 14: /, '').split(' — ')[0].replace(/\s+/g, ' ');
    assert.ok(world.includes(core), `${d.id}: "${core}" isn't in the world doc`);
  }
  for (const ink of ['ilse', 'maudry', 'osric']) assert.match(readFileSync(`content/dialogue/${ink}.ink`, 'utf8'), /frag_vale_count == 10/, `${ink}: a line for the whole Vale set`);
  const ilse = readFileSync('content/dialogue/ilse.ink', 'utf8');
  for (const id of Object.keys(FRAGMENTS)) assert.match(ilse, new RegExp(`\\{ ${id} == 1:`), `Ilse reads ${id}`);
});
