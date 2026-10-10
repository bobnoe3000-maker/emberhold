// The quests re-pointed (GDD §9 v1.49, world doc v1.33; docs/quest-progression-critique.md): every quest pays at the level
// its dungeon asks when it's done; Act I's fourth chapter, The Standard, comes before Act II; Tobin Hask's errand, The
// Last Chit, is taken and handed in at the barrow mouth, and the compass leads back to him there.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QUESTS, QS } from '../src/sim/quests.js';
import { SITES, bossAt } from '../src/sim/sites.js';
import { NPCS } from '../src/sim/npcs.js';

const SEED = 20260807;
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const go = (sim, scene, site = 'barrows', depth = 0) => sim.restore({ ...snap(sim), scene, site, depth, floors: [], ...(scene === 'town' ? { player: { x: 0, y: 0 } } : {}) });
const effect = (sim, tag, ...args) => { sim.commands.push({ type: 'dialogueEffect', tag, args }); sim.tick(); };
const talkTo = (sim, npc) => { const n = sim.world.npcs.find((q) => q.id === npc), p = sim.state.player; sim.commands.push({ type: 'endTalk' }); sim.tick(); p.x = p.px = n.x + 1; p.y = p.py = n.y - 1; sim.commands.push({ type: 'talk', npc }); sim.tick(); };

// the level a quest is done at, the hardest thing it asks: a boss's hall, a floor's waves or chests, the floor reached; the site's
// first floor where it names none; a companion's chain, no sooner than where the companion is found (Brannoc at 6)
function doneAt(d) {
  const f = d.companion && NPCS[d.companion] && NPCS[d.companion].found, joins = f ? SITES[f.site].base + f.depth : 0;
  return Math.max(joins, placeOf(d));
}
function placeOf(d) {
  const all = d.steps.flatMap((st) => st.objectives);   // (the hardest thing it asks, over its steps)
  return Math.max(...all.filter((o) => o.site && SITES[o.site] && SITES[o.site].band).map((o) => {
    const S = SITES[o.site], f = o.type === 'meet' && NPCS[o.npc] && NPCS[o.npc].found;
    if (f) return S.base + f.depth;                                             // (someone found on a floor: Wren in the Boat Hall)
    if (o.type === 'boss') { const b = Object.entries(S.bosses || {}).find(([, x]) => x === o.boss); return S.base + (b ? +b[0] - 1 : 0); }
    return S.base + (o.type === 'reach' ? o.count : o.floor || 1) - 1;
  }), 0);
}

test('every quest pays at the level its dungeon asks when it\'s done (they kept the old map\'s levels, and paid 40–56 %)', () => {
  for (const [id, d] of Object.entries(QUESTS)) {
    if (d.trial) { assert.equal(d.rewards.lv, d.trialLv || 6, `${id}: a trial pays at its tier`); continue; }
    const at = doneAt(d); if (!at) continue;
    assert.ok(Math.abs(d.rewards.lv - at) <= 1, `${id}: pays as if at ${d.rewards.lv}, done at ${at}`);
  }
  assert.equal(bossAt('barrows', 2), 'quartermaster'); assert.equal(doneAt(QUESTS.tobin_last_chit), 3);
  assert.equal(doneAt(QUESTS.ch1_the_standard), 9); assert.equal(doneAt(QUESTS.ch2_the_last_office), 18);
});

test('The Standard: Ilse\'s after An Ember in the Fist, from 9; a Standard already fallen counts; Act II waits for it', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  for (const id of ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist']) sim.state.quests[id] = { st: QS.DONE, step: 0, n: [] };
  const st = (id) => sim.quests.status(id);
  sim.state.party[0].level = 8; assert.equal(st('ch1_the_standard'), QS.LOCKED, 'from 9');
  sim.state.party[0].level = 11; assert.equal(st('ch1_the_standard'), QS.AVAILABLE);
  assert.equal(st('ch2_fog_on_the_canal'), QS.LOCKED, 'Act II waits for Act I\'s last chapter');
  talkTo(sim, 'osric_hale'); effect(sim, 'quest', 'accept', 'ch1_the_standard'); assert.equal(st('ch1_the_standard'), QS.AVAILABLE, 'not Osric\'s to give');
  sim.state.bosses.standard = 1;                                                         // (he fell before it was asked: settle)
  talkTo(sim, 'sister_ilse'); effect(sim, 'quest', 'accept', 'ch1_the_standard'); assert.equal(st('ch1_the_standard'), QS.READY);
  effect(sim, 'quest', 'turnin', 'ch1_the_standard'); assert.equal(st('ch1_the_standard'), QS.DONE);
  assert.equal(st('ch2_fog_on_the_canal'), QS.AVAILABLE, 'then Ilse sends you south');
  const fresh = createSim(SEED, undefined, { scene: 'dungeon', site: 'sunken_chapel' }); fresh.state.quests.ch1_the_standard = { st: QS.ACTIVE, step: 0, n: [0] };
  fresh.bus.emit('bossDown', { id: 'standard' }); assert.equal(fresh.quests.status('ch1_the_standard'), QS.READY, 'his fall counts');
});

test('The Last Chit: Tobin\'s, at the barrow mouth, from 3; the Quartermaster down; the compass leads back to him, and he takes it in', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  const st = () => sim.quests.status('tobin_last_chit');
  sim.state.party[0].level = 2; go(sim, 'dungeon', 'barrows', 0); assert.equal(st(), QS.LOCKED, 'from 3');
  sim.state.party[0].level = 3; go(sim, 'dungeon', 'barrows', 0); assert.equal(st(), QS.AVAILABLE);
  assert.equal(sim.quests.marks().tobin_hask, 'new', 'his mark says so');
  talkTo(sim, 'tobin_hask'); effect(sim, 'quest', 'accept', 'tobin_last_chit'); assert.equal(st(), QS.ACTIVE);
  go(sim, 'dungeon', 'wickham_keep', 0); sim.bus.emit('bossDown', { id: 'quartermaster' }); assert.equal(st(), QS.ACTIVE, 'only in the Barrows');
  go(sim, 'dungeon', 'barrows', 2); sim.bus.emit('bossDown', { id: 'quartermaster' }); assert.equal(st(), QS.READY);
  sim.state.tracked = 'tobin_last_chit';
  const row = () => sim.destinations().find((r) => r.id === 'quest');
  assert.ok(row(), 'a deeper floor: up and out (its exit is the stairs up)');
  go(sim, 'town'); assert.ok(row(), 'in town: out on the road');
  go(sim, 'overland'); assert.equal(row().tx, sim.destinations().find((r) => r.id === 'site:barrows').tx, 'on the Vale: to the Old Barrows, not to town');
  go(sim, 'dungeon', 'barrows', 0); const t = row(), n = sim.world.npcs.find((q) => q.id === 'tobin_hask');
  assert.deepEqual([t.then, t.tx, t.ty], [{ type: 'talk', npc: 'tobin_hask' }, Math.floor(n.x), Math.floor(n.y)], 'at the barrow mouth: to him');
  talkTo(sim, 'tobin_hask'); effect(sim, 'quest', 'turnin', 'tobin_last_chit'); assert.equal(st(), QS.DONE);
});

test('the Barrows\' errands are among the dead: the Ledger\'s elites and the Long Way Round\'s waves count from the Long Gallery down', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); sim.state.party[0].level = 3;
  for (const id of ['vale_captains_ledger', 'vale_long_way_round']) sim.quests.begin(id);
  go(sim, 'dungeon', 'barrows', 0);
  sim.bus.emit('slain', { elite: true }); sim.bus.emit('wave', { cleared: true, room: sim.world.level.rooms[1].id });
  assert.deepEqual([sim.state.quests.vale_captains_ledger.n, sim.state.quests.vale_long_way_round.n], [[0], [0, 0]], 'the Barrow Mouth is the Redhand\'s: not these');
  go(sim, 'dungeon', 'barrows', 1);
  sim.bus.emit('slain', { elite: true }); sim.bus.emit('wave', { cleared: true, room: sim.world.level.rooms[1].id });
  assert.deepEqual([sim.state.quests.vale_captains_ledger.n, sim.state.quests.vale_long_way_round.n], [[1], [1, 0]]);
});
