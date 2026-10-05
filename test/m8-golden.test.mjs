// The M8 golden path (docs/m8-plan.md slice 11): Act II in one game after Act I, through the sim's own rules. The
// fights are real (a strong company, topped up: the path is the test, not the balance); talking is the commands the
// dialogue window sends; a cage is broken with a tap, as a player would. Ilse → Dace → the Toadking → Wren joins →
// the Kindler heard at the Locks → the Sluice → Pim's cages → Teague → the rolls to Agnes → the Abbess → back to
// Ilse; Wren's chain and The Receipt; the fighters' level-12 trial in the Sluice, where the Fens set's last page lies;
// the Reedholm Undercroft's vault. Then the save round-trips it all.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';
import { SETS } from '../src/sim/lore.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { unlocked, SKILLS } from '../src/sim/skills.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const go = (sim, scene, site = 'barrows', depth = 0, region) => sim.restore({ ...snap(sim), scene, site, depth, floors: [], mods: [], hp: [], ...(region ? { region } : {}), ...(scene === 'town' ? { player: { x: 0, y: 0 } } : {}) });
const LAND = { maudry_fenn: 'vale', osric_hale: 'vale', sister_ilse: 'vale', dace_pike: 'fens', pim_rushlight: 'fens', sister_orla: 'fens', mother_agnes: 'fens' };
function talk(sim, npc) {
  if (sim.world.kind !== 'town' || sim.world.region !== LAND[npc]) go(sim, 'town', 'barrows', 0, LAND[npc]);
  const n = sim.world.npcs.find((q) => q.id === npc), p = sim.state.player;
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  p.x = p.px = n.x + 1; p.y = p.py = n.y - 1; sim.commands.push({ type: 'talk', npc }); sim.tick();
}
const here = (sim, npc) => { const n = sim.world.npcs.find((q) => q.id === npc), p = sim.state.player; sim.commands.push({ type: 'endTalk' }); sim.tick(); p.x = p.px = n.x + 1; p.y = p.py = n.y; sim.commands.push({ type: 'talk', npc }); sim.tick(); };
const card = (sim, npc) => { sim.commands.push({ type: 'endTalk' }); sim.tick(); sim.commands.push({ type: 'talk', npc }); sim.tick(); };
const effect = (sim, tag, ...args) => { sim.commands.push({ type: 'dialogueEffect', tag, args }); sim.tick(); };
const st = (sim, id) => sim.quests.status(id);
const strong = (sim) => { for (const m of [...sim.state.party, ...sim.state.bench]) { m.level = Math.max(m.level, 15); m.hp = Math.max(m.hp, statsFor(m).maxHp); } };
// stand in a room (the hall by default) and fight until `until`; a cage the harvesters drop is tapped, as a player would
function fightIn(sim, until, room = (L) => L.descentRoom, secs = 900) {
  strong(sim);
  const L = sim.world.level, r = room(L), p = sim.state.player; let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  for (let i = 0; i < secs * 20 && !until(); i++) {
    for (const m of sim.state.party) if (!m.down) m.hp = Math.max(m.hp, statsFor(m).maxHp * 0.7);
    if (i % 20 === 0) for (const [k, m] of sim.world.mods) if (m && m.cage && !m.opened) { const [x, y] = k.split(',').map(Number); sim.commands.push({ type: 'harvest', tx: x, ty: y }); }
    sim.tick();
  }
  return until();
}
const firstRoom = (L) => L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom);
function openAt(sim, key) { const [x, y] = key.split(',').map(Number), p = sim.state.player; p.x = p.px = x + 0.5; p.y = p.py = y + 1.5; if (!isWalkable(sim.world, p.x, p.y)) { p.y = p.py = y - 0.5; } sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick(); }
const down = (sim) => { const s = sim.world.stairsAt, p = sim.state.player; p.x = p.px = s.x + 0.5; p.y = p.py = s.y + 1.5; sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick(); };
// open chests over fresh visits to a floor (about one a floor) until `until`
function chests(sim, site, depth, until) { for (let v = 0; v < 8 && !until(); v++) { go(sim, 'dungeon', site, depth); for (const [k, kind] of [...sim.world.props]) if (kind === 'chest' && !until()) openAt(sim, k); } return until(); }

test('M8 golden path: Act II with Wren, her chain, a level-12 trial, the Fens set and the Undercroft\'s vault; saved and loaded', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  for (const id of ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist']) sim.state.quests[id] = { st: QS.DONE, step: 0, n: [] };
  sim.state.trials = { fighter: 1, cleric: 1 };                                     // (Act I's company had done its first trials)
  hire(sim, [0, 3]); strong(sim);
  assert.deepEqual(sim.state.party.map((m) => m.cls), ['fighter', 'fighter', 'cleric']);
  const paid = [], ev = []; sim.bus.on('questReward', (r) => paid.push(r.id));
  for (const n of ['siteRevealed', 'companionJoined', 'trialDone', 'setComplete', 'vaultOpened']) sim.bus.on(n, (e) => ev.push(n + ':' + (e.site || e.id || e.cls || e.set)));

  // 1. Fog on the Canal: Ilse → Dace; the Toadking in the Boat Hall; Wren reads his berth-book, and joins (the bench)
  talk(sim, 'sister_ilse'); effect(sim, 'quest', 'accept', 'ch2_fog_on_the_canal');
  talk(sim, 'dace_pike'); assert.equal(sim.state.quests.ch2_fog_on_the_canal.step, 1, 'a word with Dace');
  go(sim, 'dungeon', 'toadking_mound', 1); assert.ok(fightIn(sim, () => !!sim.state.bosses.toadking), 'the Toadking falls');
  assert.ok(sim.state.fragments.includes('frag_fens_tithe_plate'), 'he carried the tithe-boat\'s plate');
  here(sim, 'wren'); assert.equal(st(sim, 'ch2_fog_on_the_canal'), QS.READY, 'Wren\'s word');
  effect(sim, 'companion', 'join'); sim.commands.push({ type: 'endTalk' }); sim.tick();
  assert.equal(sim.state.bench.at(-1).id, 'wren');
  talk(sim, 'dace_pike'); effect(sim, 'quest', 'turnin', 'ch2_fog_on_the_canal');
  sim.commands.push({ type: 'swap', slot: 1, id: 'wren' }); sim.tick(); assert.equal(sim.state.party[1].id, 'wren', 'into the party in town');

  // 2. The Locks: the Kindler heard by the way in, and gone; the Sluice held five waves
  talk(sim, 'dace_pike'); effect(sim, 'quest', 'accept', 'ch2_the_locks');
  go(sim, 'dungeon', 'canal_locks', 0); here(sim, 'kindler'); effect(sim, 'flag', 'set', 'met_kindler'); sim.commands.push({ type: 'endTalk' }); sim.tick(); sim.tick();
  assert.equal(sim.state.quests.ch2_the_locks.step, 1); assert.ok(!sim.world.npcs.some((n) => n.id === 'kindler'), 'gone on the boat');
  go(sim, 'dungeon', 'canal_locks', 1); assert.ok(fightIn(sim, () => st(sim, 'ch2_the_locks') === QS.READY), 'the Sluice');
  talk(sim, 'dace_pike'); effect(sim, 'quest', 'turnin', 'ch2_the_locks');

  // Wren's chain, from her card: the marker off three of the Locks' leaders; two of her caches in the Sickpools
  card(sim, 'wren'); effect(sim, 'quest', 'accept', 'wren_the_marker');
  go(sim, 'dungeon', 'canal_locks', 0); assert.ok(fightIn(sim, () => st(sim, 'wren_the_marker') === QS.READY, firstRoom, 1500), 'the marker');
  card(sim, 'wren'); effect(sim, 'quest', 'turnin', 'wren_the_marker'); card(sim, 'wren'); effect(sim, 'quest', 'accept', 'wren_night_boats');
  assert.ok(chests(sim, 'sickpools', 0, () => st(sim, 'wren_night_boats') === QS.READY), 'her caches');
  card(sim, 'wren'); effect(sim, 'quest', 'turnin', 'wren_night_boats');

  // 3. The Sickpools: three full cages broken
  talk(sim, 'pim_rushlight'); effect(sim, 'quest', 'accept', 'ch2_the_sickpools');
  go(sim, 'dungeon', 'sickpools', 0); assert.ok(fightIn(sim, () => st(sim, 'ch2_the_sickpools') === QS.READY, firstRoom, 1500), 'three cages');
  talk(sim, 'pim_rushlight'); effect(sim, 'quest', 'turnin', 'ch2_the_sickpools');

  // 4. The Bells: Brother Teague at the choir's door; then Wren's Settled, in his hall
  talk(sim, 'sister_orla'); effect(sim, 'quest', 'accept', 'ch2_the_bells');
  go(sim, 'dungeon', 'drowned_abbey', 0); assert.ok(fightIn(sim, () => st(sim, 'ch2_the_bells') === QS.READY), 'Teague');
  talk(sim, 'sister_orla'); effect(sim, 'quest', 'turnin', 'ch2_the_bells');
  card(sim, 'wren'); effect(sim, 'quest', 'accept', 'wren_settled');
  go(sim, 'dungeon', 'drowned_abbey', 0); assert.ok(fightIn(sim, () => st(sim, 'wren_settled') === QS.READY), 'the hall held while she burns the boat');
  card(sim, 'wren'); effect(sim, 'quest', 'turnin', 'wren_settled');
  assert.equal(sim.state.bag.filter((it) => it.name === 'The Receipt').length, 1);

  // 5. The Rolls: down to the Abbey's third floor by its stairs, two chests there, to Agnes
  talk(sim, 'sister_orla'); effect(sim, 'quest', 'accept', 'ch2_the_rolls');
  go(sim, 'dungeon', 'drowned_abbey', 0); down(sim); down(sim);
  assert.equal(sim.state.depth, 2); assert.equal(sim.state.quests.ch2_the_rolls.step, 1, 'the third floor reached');
  assert.ok(chests(sim, 'drowned_abbey', 2, () => st(sim, 'ch2_the_rolls') === QS.READY), 'what\'s left of the rolls');
  talk(sim, 'mother_agnes'); effect(sim, 'quest', 'turnin', 'ch2_the_rolls');

  // 6. The Last Office: the Abbess Below, and her ledger to Ilse in Thornwick
  talk(sim, 'mother_agnes'); effect(sim, 'quest', 'accept', 'ch2_the_last_office');
  go(sim, 'dungeon', 'drowned_abbey', 2); assert.ok(fightIn(sim, () => st(sim, 'ch2_the_last_office') === QS.READY), 'the Abbess');
  assert.ok(sim.state.lampsBroken.includes('choir_lamp') || sim.state.count.lamps > 0, 'the choir-lamp breaks with her');
  assert.ok(sim.state.fragments.includes('frag_fens_last_hour'), 'she carried the last hour');
  talk(sim, 'sister_ilse'); effect(sim, 'quest', 'turnin', 'ch2_the_last_office');

  // the fighters' level-12 trial in the Sluice, where (the rest of the set found: the test's shortcut) its page lies
  const wind = SKILLS.fighter.find((s) => s.lv === 12);
  assert.ok(!unlocked(sim.state.party[0], wind, sim.state.trials));
  assert.ok(sim.state.fragments.includes('frag_fens_sluice_book'), 'found holding the Sluice in chapter 2');
  sim.state.fragments = [...sim.state.fragments.filter((id) => id !== 'frag_fens_sluice_book'), ...SETS.fens.filter((id) => !sim.state.fragments.includes(id))];   // (the shortcut: every page but the Sluice's)
  talk(sim, 'osric_hale'); effect(sim, 'quest', 'accept', 'trial_the_long_watch');
  go(sim, 'dungeon', 'canal_locks', 1); assert.ok(fightIn(sim, () => st(sim, 'trial_the_long_watch') === QS.READY), 'ten waves in the Sluice');
  assert.ok(sim.state.revealed.has('reedholm_undercroft'), 'the Sluice-Book, the set\'s last');
  talk(sim, 'osric_hale'); effect(sim, 'quest', 'turnin', 'trial_the_long_watch');
  assert.ok(unlocked(sim.state.party[0], wind, sim.state.trials), 'Second Wind');
  go(sim, 'dungeon', 'reedholm_undercroft', 0); openAt(sim, sim.world.vault.key);
  assert.equal(sim.state.bag.filter((it) => it.name === 'The Fair Copy').length, 1);

  assert.deepEqual(paid, ['ch2_fog_on_the_canal', 'ch2_the_locks', 'wren_the_marker', 'wren_night_boats', 'ch2_the_sickpools', 'ch2_the_bells', 'wren_settled', 'ch2_the_rolls', 'ch2_the_last_office', 'trial_the_long_watch']);
  assert.deepEqual(ev, ['companionJoined:wren', 'siteRevealed:reedholm_undercroft', 'setComplete:fens', 'trialDone:trial_the_long_watch', 'vaultOpened:reedholm_undercroft']);
  for (const k of ['toadking', 'teague', 'abbess_below']) assert.ok(sim.state.bosses[k] >= 1, k);

  // the save keeps it all
  const back = createSim(SEED, undefined, { scene: 'town' }); back.restore(snap(sim));
  assert.ok(back.state.revealed.has('reedholm_undercroft')); assert.equal(back.state.trials.fighter12, 1);
  assert.equal(back.state.fragments.filter((f) => f.startsWith('frag_fens_')).length, 10); assert.equal(back.state.flags.met_kindler, 1);
  assert.ok(back.state.party.some((m) => m.id === 'wren')); assert.equal(back.state.flags.vault_reedholm_undercroft, 1);
  for (const id of paid) assert.equal(back.quests.status(id), QS.DONE, id);
});
