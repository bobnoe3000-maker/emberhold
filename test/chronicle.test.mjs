// The Vale Chronicle, whole (M5, docs/m5-plan.md §7; world doc §7 v1.7–v1.8): ten fragments across the
// Old Barrows, the Tithe Mill, Wickham Keep and the Sunken Chapel; three are carried by bosses (Garrow's
// Last Dispatch, the Chaplain's Last Page under the Stranger, the Standard's Ribbon). The last found
// reveals the Ninth Milestone, whose hall keeps The Last Order in a vault chest, once.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { FRAGMENTS, SETS, HALL_WAVES, holderOf, SET_REVEALS } from '../src/sim/lore.js';
import { SITES } from '../src/sim/sites.js';
import { isWalkable } from '../src/sim/world.js';
import { createStoryBook } from '../src/story/adapter.js';

const SEED = 20260807;
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const at = (sim, site, depth) => sim.restore({ ...snap(sim), scene: 'dungeon', site, depth, floors: [] });
const events = (sim, names) => { const out = []; for (const n of names) sim.bus.on(n, (e) => out.push({ n, ...e })); return out; };

test('ten in reading order; every one lies somewhere on its floor, for any seed', () => {
  assert.equal(SETS.vale.length, 10); assert.deepEqual(SETS.vale.map((id) => FRAGMENTS[id].order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.deepEqual(Object.keys(SET_REVEALS), ['vale']); assert.equal(SITES[SET_REVEALS.vale].hidden, true);
  for (const seed of [SEED, 7, 99991]) for (const id of SETS.vale) {
    const f = FRAGMENTS[id], sim = createSim(seed, undefined, { scene: 'dungeon', site: f.site });
    at(sim, f.site, f.floor - 1);
    const h = holderOf(seed, id, sim.world, {});
    assert.ok(h, `${id} on ${f.site} floor ${f.floor}`);
    if (h.key) assert.equal(sim.world.props.get(h.key), h.via, `${id}: its ${h.via} is there`);
    if (f.via === 'boss') assert.equal(h.via, 'boss');
    at(sim, f.site, f.floor === 1 ? 1 : 0);
    assert.equal(holderOf(seed, id, sim.world, {}), null, `${id}: not on another floor`);
  }
});

test('the bosses carry theirs: found when they fall on their floor; one who fell in an older save left it in his hall', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }), ev = events(sim, ['fragmentFound']);
  at(sim, 'wickham_keep', 1);
  sim.bus.emit('bossDown', { id: 'robed_stranger' }); assert.equal(ev.length, 0, 'the wrong boss');
  sim.state.bosses.redhand_captain = 1; sim.bus.emit('bossDown', { id: 'redhand_captain', first: true });
  assert.deepEqual(ev.map((e) => e.id), ['frag_vale_last_dispatch']);
  at(sim, 'barrows', 2); sim.bus.emit('bossDown', { id: 'standard' }); assert.equal(ev.at(-1).id, 'frag_vale_standards_ribbon');
  // an older save: the Stranger already fell before his page was in the table
  const old = createSim(SEED, undefined, { scene: 'town' }), oev = events(old, ['fragmentFound']);
  old.state.bosses.robed_stranger = 1; at(old, 'sunken_chapel', 1);
  assert.deepEqual(old.lore.holder('frag_vale_chaplains_last_page'), { via: 'hall' });
  const hall = old.world.level.descentRoom.id; old.bus.emit('battle', { on: true, room: hall });
  for (let i = 0; i < HALL_WAVES; i++) old.bus.emit('wave', { cleared: true, room: hall });
  // his page, and whatever else this floor keeps in its hall (a shrine's fragment, on a floor drawn without a shrine)
  assert.ok(oev.some((e) => e.id === 'frag_vale_chaplains_last_page'));
  for (const e of oev) assert.deepEqual(old.lore.holder(e.id), { via: 'hall' }, e.id);
});

test('the last one found reveals the Ninth Milestone', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }), ev = events(sim, ['setComplete', 'siteRevealed']);
  sim.state.fragments = SETS.vale.filter((id) => id !== 'frag_vale_tithe_ledger');
  assert.ok(!sim.state.revealed.has('ninth_milestone'));
  at(sim, 'tithe_mill', 0);
  const h = sim.lore.holder('frag_vale_tithe_ledger');
  if (h.via === 'chest') { const [x, y] = h.key.split(',').map(Number); sim.bus.emit('looted', { tx: x, ty: y, kind: 'chest' }); }
  else { const hall = sim.world.level.descentRoom.id; sim.bus.emit('battle', { on: true, room: hall }); for (let i = 0; i < HALL_WAVES; i++) sim.bus.emit('wave', { cleared: true, room: hall }); }
  assert.deepEqual(ev.map((e) => e.n).sort(), ['setComplete', 'siteRevealed']); assert.equal(ev.find((e) => e.n === 'siteRevealed').site, 'ninth_milestone');
  assert.ok(sim.state.revealed.has('ninth_milestone'));
});

test('the Ninth Milestone\'s vault: a chest in its hall with The Last Order, once', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); sim.state.party[0].level = 8;
  sim.state.revealed.add('ninth_milestone'); at(sim, 'ninth_milestone', 0);
  const v = sim.world.vault, L = sim.world.level; assert.ok(v, 'a vault');
  const [x, y] = v.key.split(',').map(Number);
  assert.equal(v.heirloom, 'last_order'); assert.equal(L.cells.get(v.key).room, L.descentRoom.id, 'in the hall');
  assert.equal(sim.world.props.get(v.key), 'chest'); assert.ok(isWalkable(sim.world, x + 0.5, y + 1.5), 'you can walk up to it');
  const p = sim.state.player; p.x = p.px = x + 0.5; p.y = p.py = y + 1.5;
  sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick();
  const got = () => sim.state.bag.filter((it) => it.name === 'The Last Order');
  assert.equal(got().length, 1); assert.equal(got()[0].r, 'heirloom'); assert.equal(sim.state.flags.vault_ninth_milestone, 1);
  const back = createSim(SEED, undefined, { scene: 'town' }); back.restore(snap(sim)); at(back, 'ninth_milestone', 0);
  const q = back.state.player; q.x = q.px = x + 0.5; q.y = q.py = y + 1.5;
  back.commands.push({ type: 'harvest', tx: x, ty: y }); back.tick();
  assert.equal(back.state.bag.filter((it) => it.name === 'The Last Order').length, 1, 'a later visit: an ordinary chest');
  const none = createSim(SEED, undefined, { scene: 'dungeon', site: 'wickham_keep' }); at(none, 'wickham_keep', 1); assert.equal(none.world.vault, undefined, 'only a vault site');
});

test('content: each new fragment\'s words are canon; Ilse reads the whole set and sends you to the milestone', async () => {
  const world = readFileSync('docs/emberfall-world.md', 'utf8').replace(/\s+/g, ' ');
  for (const id of SETS.vale.slice(3)) { const d = JSON.parse(readFileSync(`content/lore/${id}.json`, 'utf8')); assert.ok(world.includes(d.text), `${id}: canon`); }
  const book = createStoryBook(async (f) => JSON.parse(readFileSync(`content/dialogue/${f}.json`, 'utf8')));
  const all = Object.fromEntries(SETS.vale.map((id) => [id, 1]));
  const c = await book.open('ilse', 'ilse_hub', { hero_name: 'Tam', flag_met_ilse: 1, fallen_name: '', frag_vale_count: 10, ...all }, () => {});
  const b = c.choose(c.first.choices.find((x) => x.text.startsWith('Read me the Chronicle')).index);
  const text = b.lines.join(' ');
  assert.match(text, /Stand down/); assert.match(text, /ninth milestone of the Wickham road/); assert.match(text, /It's on your map now/);
});
