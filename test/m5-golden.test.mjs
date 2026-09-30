// The M5 golden path (docs/m5-plan.md §8): the Hollow Vale from the first chapter to the hidden site, in one
// game, through the sim's own rules. The fights are real (a strong company, so the path is the test, not
// the balance); talking is the commands the dialogue window sends. Act I → Brannoc joins in the Keep → his
// chain → the fighter's trial → the Chronicle's last fragment off the Standard → the Ninth Milestone's
// vault. Then the save round-trips it all.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';
import { SETS } from '../src/sim/lore.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { unlocked, SKILLS } from '../src/sim/skills.js';

const SEED = 20260807;
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const go = (sim, scene, site = 'barrows', depth = 0) => sim.restore({ ...snap(sim), scene, site, depth, floors: [], ...(scene === 'town' ? { player: { x: 0, y: 0 } } : {}) });
function talk(sim, npc) {
  if (sim.world.kind !== 'town') go(sim, 'town');
  const n = sim.world.npcs.find((q) => q.id === npc), p = sim.state.player;
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  p.x = p.px = n.x + 1; p.y = p.py = n.y - 1; sim.commands.push({ type: 'talk', npc }); sim.tick();
}
const effect = (sim, tag, ...args) => { sim.commands.push({ type: 'dialogueEffect', tag, args }); sim.tick(); };
const st = (sim, id) => sim.quests.status(id);
const strong = (sim) => { for (const m of sim.state.party) { m.level = Math.max(m.level, 12); m.hp = Math.max(m.hp, statsFor(m).maxHp); } };
// stand in a room (the hall by default) and fight until `until` (a strong company, topped up)
function fightIn(sim, until, room = (L) => L.descentRoom, secs = 600) {
  strong(sim);
  const L = sim.world.level, r = room(L), p = sim.state.player; let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  for (let i = 0; i < secs * 20 && !until(); i++) { for (const m of sim.state.party) if (!m.down) m.hp = Math.max(m.hp, statsFor(m).maxHp * 0.7); sim.tick(); }
  return until();
}
const firstRoom = (L) => L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom);
function openAt(sim, key) { const [x, y] = key.split(',').map(Number), p = sim.state.player; p.x = p.px = x + 0.5; p.y = p.py = y + 1.5; if (!isWalkable(sim.world, p.x, p.y)) { p.y = p.py = y - 0.5; } sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick(); }

test('M5 golden path: Act I, Brannoc and his chain, a trial, the whole Chronicle and the Ninth Milestone\'s vault; saved and loaded', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  const paid = [], ev = []; sim.bus.on('questReward', (r) => paid.push(r.id));
  for (const n of ['siteRevealed', 'companionJoined', 'trialDone', 'setComplete', 'vaultOpened']) sim.bus.on(n, (e) => ev.push(n + ':' + (e.site || e.id || e.cls || e.set)));
  for (const i of [0, 3]) { sim.commands.push({ type: 'hire', idx: i }); sim.tick(); }   // a fighter and a cleric (the tavern's order)
  assert.deepEqual(sim.state.party.map((m) => m.cls), ['fighter', 'fighter', 'cleric']);

  // Act I, 1: the Tithe Mill for Maudry, handed in to Osric; the Keep is revealed
  talk(sim, 'maudry_fenn'); effect(sim, 'quest', 'accept', 'ch1_smoke_over_the_vale');
  go(sim, 'dungeon', 'tithe_mill'); assert.ok(fightIn(sim, () => st(sim, 'ch1_smoke_over_the_vale') === QS.READY, firstRoom));
  talk(sim, 'osric_hale'); effect(sim, 'quest', 'turnin', 'ch1_smoke_over_the_vale');
  assert.ok(sim.state.revealed.has('wickham_keep'));

  // Act I, 2: Wickham Keep's second floor and Garrow; Brannoc waits in the hall and joins (the party's full: the bench)
  talk(sim, 'osric_hale'); effect(sim, 'quest', 'accept', 'ch1_the_diggers');
  go(sim, 'dungeon', 'wickham_keep', 0); const s0 = sim.world.stairsAt, p = sim.state.player; p.x = p.px = s0.x + 0.5; p.y = p.py = s0.y + 1.5; sim.commands.push({ type: 'harvest', tx: s0.x, ty: s0.y }); sim.tick();
  assert.equal(sim.state.depth, 1); assert.ok(fightIn(sim, () => st(sim, 'ch1_the_diggers') === QS.READY));
  assert.equal(sim.state.bosses.redhand_captain, 1);
  assert.ok(sim.state.fragments.includes('frag_vale_last_dispatch'), 'Garrow carried the Last Dispatch');
  const b = sim.world.npcs.find((n) => n.id === 'brannoc'); p.x = p.px = b.x + 1; p.y = p.py = b.y; sim.commands.push({ type: 'endTalk' }); sim.tick();
  sim.commands.push({ type: 'talk', npc: 'brannoc' }); sim.tick(); effect(sim, 'companion', 'join'); sim.commands.push({ type: 'endTalk' }); sim.tick();
  assert.equal(sim.state.bench.at(-1).id, 'brannoc');
  talk(sim, 'osric_hale'); effect(sim, 'quest', 'turnin', 'ch1_the_diggers');
  sim.commands.push({ type: 'swap', slot: 1, id: 'brannoc' }); sim.tick(); assert.equal(sim.state.party[1].id, 'brannoc', 'into the party in town');

  // Act I, 3: the Sunken Chapel and the Robed Stranger; the shard goes to Ilse
  talk(sim, 'osric_hale'); effect(sim, 'quest', 'accept', 'ch1_ember_in_the_fist');
  go(sim, 'dungeon', 'sunken_chapel', 1); assert.ok(fightIn(sim, () => st(sim, 'ch1_ember_in_the_fist') === QS.READY));
  talk(sim, 'sister_ilse'); effect(sim, 'quest', 'turnin', 'ch1_ember_in_the_fist');

  // Brannoc's chain, from his card: 3 sergeants in the Keep, 2 of the paymaster's chests in the mill, 5 waves in a Barrows hall
  const card = () => { sim.commands.push({ type: 'endTalk' }); sim.tick(); sim.commands.push({ type: 'talk', npc: 'brannoc' }); sim.tick(); };
  card(); effect(sim, 'quest', 'accept', 'brannoc_old_debts');
  go(sim, 'dungeon', 'wickham_keep', 0); assert.ok(fightIn(sim, () => st(sim, 'brannoc_old_debts') === QS.READY, firstRoom, 900), 'three sergeants');
  card(); effect(sim, 'quest', 'turnin', 'brannoc_old_debts'); card(); effect(sim, 'quest', 'accept', 'brannoc_paymasters_box');
  for (let v = 0; v < 6 && st(sim, 'brannoc_paymasters_box') !== QS.READY; v++) {
    go(sim, 'dungeon', 'tithe_mill', 0);
    for (const [k, kind] of [...sim.world.props]) if (kind === 'chest' && st(sim, 'brannoc_paymasters_box') !== QS.READY) openAt(sim, k);
  }
  assert.equal(st(sim, 'brannoc_paymasters_box'), QS.READY, 'two chests in the mill');
  card(); effect(sim, 'quest', 'turnin', 'brannoc_paymasters_box'); card(); effect(sim, 'quest', 'accept', 'brannoc_standing_down');
  go(sim, 'dungeon', 'barrows', 1); assert.ok(fightIn(sim, () => st(sim, 'brannoc_standing_down') === QS.READY));
  card(); effect(sim, 'quest', 'turnin', 'brannoc_standing_down');
  assert.equal(sim.state.bag.filter((it) => it.name === 'The Broken Chain').length, 1);

  // the fighters' trial: Osric, 8 waves in the Keep; Shield Wall for every fighter
  const wall = SKILLS.fighter.find((s) => s.trial);
  assert.ok(!unlocked(sim.state.party[0], wall, sim.state.trials));
  talk(sim, 'osric_hale'); effect(sim, 'quest', 'accept', 'trial_hold_the_keep_gate');
  go(sim, 'dungeon', 'wickham_keep', 0); assert.ok(fightIn(sim, () => st(sim, 'trial_hold_the_keep_gate') === QS.READY, firstRoom));
  talk(sim, 'osric_hale'); effect(sim, 'quest', 'turnin', 'trial_hold_the_keep_gate');
  assert.ok(sim.state.party.filter((m) => m.cls === 'fighter').every((m) => unlocked(m, wall, sim.state.trials)), 'the hero and Brannoc both');

  // the Chronicle: the rest found (the test's shortcut), the last off the Standard; the Ninth Milestone opens
  sim.state.fragments = SETS.vale.filter((id) => id !== 'frag_vale_standards_ribbon');
  go(sim, 'dungeon', 'barrows', 2); assert.ok(fightIn(sim, () => sim.state.fragments.length === 10), 'the Standard falls: its ribbon');
  assert.ok(sim.state.revealed.has('ninth_milestone'));
  go(sim, 'dungeon', 'ninth_milestone', 0); openAt(sim, sim.world.vault.key);
  assert.equal(sim.state.bag.filter((it) => it.name === 'The Last Order').length, 1);

  assert.deepEqual(paid, ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist', 'brannoc_old_debts', 'brannoc_paymasters_box', 'brannoc_standing_down', 'trial_hold_the_keep_gate']);
  assert.deepEqual(ev, ['siteRevealed:wickham_keep', 'companionJoined:brannoc', 'trialDone:trial_hold_the_keep_gate', 'siteRevealed:ninth_milestone', 'setComplete:vale', 'vaultOpened:ninth_milestone']);
  for (const k of ['redhand_captain', 'robed_stranger', 'standard']) assert.ok(sim.state.bosses[k] >= 1, k);

  // the save keeps it all
  const back = createSim(SEED, undefined, { scene: 'town' }); back.restore(snap(sim));
  assert.deepEqual([...back.state.revealed].sort(), ['ninth_milestone', 'wickham_keep']);
  assert.deepEqual(back.state.trials, { fighter: 1 }); assert.equal(back.state.fragments.length, 10);
  assert.ok(back.state.party.some((m) => m.id === 'brannoc')); assert.equal(back.state.flags.vault_ninth_milestone, 1);
  for (const id of paid) assert.equal(back.quests.status(id), QS.DONE, id);
});
