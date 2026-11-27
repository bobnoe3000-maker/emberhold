// The Tidemark, step 7 (GDD v1.156, docs/tidemark-plan.md's build sheet, world doc v1.74): the Chronicle's Tidemark set
// (the Lady Aurelle's twelve letters to Livia), the last of which finds the Sister's Cabin, the wreck of Aurelle's Grace,
// whose vault is Livia's cabin; Tollhaven's side work from two townsfolk (Mistress Fane's errands; Maren's chain, The
// Names, Josse Wether's to give and take in, never hers); the Paid Toll's board posting the Tidemark's own jobs; and the
// land's four spawn points.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { FRAGMENTS, SETS, SET_REVEALS } from '../src/sim/lore.js';
import { SITES, siteOpen } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { QUESTS, QS } from '../src/sim/quests.js';
import { NPCS } from '../src/sim/npcs.js';
import { FOUND } from '../src/sim/heroes.js';
import { HEIRLOOMS } from '../src/sim/items.js';
import { CAMPS } from '../src/sim/camps.js';
import { offersIn, jobOf } from '../src/sim/board.js';
import { openLeads } from '../src/ui/storystatus.js';

const SEED = 20260807;
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const at = (sim, site, depth) => sim.restore({ ...snap(sim), scene: 'dungeon', site, depth, floors: [] });
const events = (sim, names) => { const out = []; for (const n of names) sim.bus.on(n, (e) => out.push({ n, ...e })); return out; };
const effect = (sim, tag, ...args) => { sim.commands.push({ type: 'dialogueEffect', tag, args }); sim.tick(); };

test('the Tidemark set: twelve, four in each band dungeon; it reveals the Sister\'s Cabin', () => {
  assert.equal(SETS.tidemark.length, 12); assert.equal(SET_REVEALS.tidemark, 'sisters_cabin');
  for (const site of ['drowned_mole', 'gull_isles', 'highmarch']) assert.equal(SETS.tidemark.filter((id) => FRAGMENTS[id].site === site).length, 4, site);
  assert.equal(SETS.tidemark.at(-1), 'frag_tide_take_the_grace', 'the last letter is Lucan\'s');
});

test('the bosses carry theirs, Lucan\'s when he sits down; the last found reveals the Cabin, its door on the east beach', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }), ev = events(sim, ['fragmentFound', 'siteRevealed']); sim.tick(); sim.state.party[0].level = 45;
  at(sim, 'drowned_mole', 1); sim.state.bosses.harbourmaster = 1; sim.bus.emit('bossDown', { id: 'harbourmaster', first: true });
  at(sim, 'gull_isles', 1); sim.state.bosses.hesk = 1; sim.bus.emit('bossDown', { id: 'hesk', first: true });
  at(sim, 'highmarch', 0); sim.state.bosses.champion = 1; sim.bus.emit('bossDown', { id: 'champion', first: true });
  assert.deepEqual(ev.filter((e) => e.n === 'fragmentFound').map((e) => e.id), ['frag_tide_the_toll', 'frag_tide_the_commission', 'frag_tide_the_voices']);
  sim.state.fragments.push(...SETS.tidemark.filter((id) => !sim.state.fragments.includes(id) && id !== 'frag_tide_take_the_grace'));
  assert.ok(!sim.state.revealed.has('sisters_cabin')); assert.ok(!siteOpen('sisters_cabin', sim.state.revealed), 'shut before the set is whole');
  at(sim, 'highmarch', 1); sim.state.bosses.lucan = 1; sim.bus.emit('bossDown', { id: 'lucan', first: true, spared: true });   // (beaten, not killed: battle.js `canticle`)
  assert.equal(ev.at(-1).n, 'siteRevealed'); assert.equal(ev.at(-1).site, 'sisters_cabin', 'Take the Grace, last: the Cabin revealed');
  sim.restore({ ...snap(sim), scene: 'overland', region: 'tidemark', floors: [] }); sim.tick();
  const door = sim.world.exits.find((x) => x.site === 'sisters_cabin'); assert.ok(door, 'its way in on the Tidemark');
  assert.ok(sim.world.arrivals.sisters_cabin, 'and somewhere to come out');
  const p = sim.state.player; p.x = p.px = (door.x0 + door.x1) / 2; p.y = p.py = (door.y0 + door.y1) / 2;
  for (let i = 0; i < 5 && sim.world.kind === 'overland'; i++) sim.tick();
  assert.equal(sim.world.kind, 'dungeon'); assert.equal(sim.world.site, 'sisters_cabin');
});

test('the Sister\'s Cabin: one floor of five on the hulk kit, the drowned fleet at 45, no boss; Livia\'s cabin keeps The Grace\'s Manifest, once', () => {
  const S = SITES.sisters_cabin; assert.deepEqual([S.region, S.base, S.floors, S.family, S.hidden, S.secret, S.vault], ['tidemark', 45, 1, 'drowned_fleet', true, true, 'the_graces_manifest']);
  const plan = PLANS.sisters_cabin; assert.equal(plan.floors.length, 1); assert.equal(plan.floors[0].spaces.length, 5);
  assert.deepEqual(checkPlan(plan), [], 'the plan keeps the rules');
  assert.ok(plan.floors[0].spaces.every((q) => q.kit === (q.role === 'entrance' ? 'strand' : 'hulk') && !q.boss), 'the reef before her, the hulk aboard');
  assert.ok(HEIRLOOMS.the_graces_manifest);
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); sim.state.party[0].level = 45; sim.state.revealed.add('sisters_cabin');
  at(sim, 'sisters_cabin', 0);
  const v = sim.world.vault; assert.ok(v); assert.equal(v.heirloom, 'the_graces_manifest');
  const [x, y] = v.key.split(',').map(Number), p = sim.state.player; p.x = p.px = x + 0.5; p.y = p.py = y + 1.5;
  sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick(); sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick();
  assert.equal(sim.state.bag.filter((it) => it.name === "The Grace's Manifest").length, 1);
  assert.ok(sim.state.secrets.sisters_cabin > sim.state.t, 'it seals behind you, as every secret does');
});

test('Tollhaven\'s side work: Fane\'s two and Maren\'s three from townsfolk in Tollhaven, after Low Water, in order; The Name Bell paid once', () => {
  const ids = ['fane_the_chain_ward', 'fane_signal_powder', 'maren_the_harbour_roll', 'maren_the_prize_crews', 'maren_said_aloud'];
  for (const id of ids) {
    const q = QUESTS[id]; assert.equal(q.kind, 'errand', id); assert.equal(q.region, 'tidemark', id);
    assert.ok(['fane', 'josse_wether'].includes(q.giver), id); assert.ok(!FOUND[q.giver], `${id}: not a companion's`);
    assert.equal(NPCS[q.giver].region, 'tidemark'); assert.ok(NPCS[q.giver].spots.length, `${q.giver} stands in Tollhaven`);
  }
  assert.ok(HEIRLOOMS.the_name_bell); assert.equal(QUESTS.maren_said_aloud.rewards.item, 'the_name_bell');
  const sim = createSim(SEED, undefined, { scene: 'town', region: 'tidemark' }); sim.tick(); sim.state.party[0].level = 45;
  const st = (id) => sim.quests.status(id);
  assert.equal(st('maren_the_harbour_roll'), QS.LOCKED, 'not before Low Water'); assert.equal(st('fane_the_chain_ward'), QS.LOCKED);
  sim.state.quests.ch4_low_water = { st: QS.DONE, step: 0, n: [] };
  assert.equal(st('maren_the_harbour_roll'), QS.AVAILABLE, 'Maren nowhere in the company: Josse has it');
  assert.ok(![...sim.state.party, ...(sim.state.bench || [])].some((m) => m.id === 'maren'));
  assert.equal(st('maren_the_prize_crews'), QS.LOCKED, 'in order');
  const talk = (npc) => { const n = sim.world.npcs.find((q) => q.id === npc), p = sim.state.player; sim.commands.push({ type: 'endTalk' }); sim.tick(); p.x = p.px = n.x + 1; p.y = p.py = n.y - 1; sim.commands.push({ type: 'talk', npc }); sim.tick(); };
  const home = () => sim.restore({ ...snap(sim), scene: 'town', region: 'tidemark', site: 'barrows', depth: 0, floors: [], player: { x: 0, y: 0 } });
  const paid = events(sim, ['questReward']);
  const run = (id, site, depth, fire) => {
    home(); talk(QUESTS[id].giver); effect(sim, 'quest', 'accept', id); assert.equal(st(id), QS.ACTIVE, id);
    at(sim, site, depth); fire(); assert.equal(st(id), QS.READY, id);
    home(); talk(QUESTS[id].giver); effect(sim, 'quest', 'turnin', id); effect(sim, 'quest', 'turnin', id); assert.equal(st(id), QS.DONE, id);
  };
  const elites = (n) => () => { for (let i = 0; i < n; i++) sim.bus.emit('slain', { elite: true }); };
  const chests = (n) => () => { for (let i = 0; i < n; i++) sim.bus.emit('looted', { kind: 'chest' }); };
  const waves = (n) => () => { for (let i = 0; i < n; i++) sim.bus.emit('wave', { cleared: true, room: -1 }); };
  run('fane_the_chain_ward', 'drowned_mole', 0, elites(3));
  run('fane_signal_powder', 'gull_isles', 0, chests(2));
  run('maren_the_harbour_roll', 'drowned_mole', 0, chests(2));
  run('maren_the_prize_crews', 'gull_isles', 1, waves(6));
  run('maren_said_aloud', 'highmarch', 1, waves(5));
  assert.deepEqual(paid.map((e) => e.id), ids);
  assert.equal(sim.state.bag.filter((it) => it.name === 'The Name Bell').length, 1, 'the bell, once');
});

test('the Paid Toll\'s board posts the Tidemark\'s jobs at its band dungeons (it posted the Vale\'s), each rebuilt from its id', () => {
  for (const lv of [31, 36, 41, 45]) {
    const jobs = offersIn(SEED, 3, lv, 0, 'tidemark'); assert.ok(jobs.length >= 3, `${lv}`);
    for (const j of jobs) {
      assert.match(j.id, /_tidemark$/); assert.equal(j.region, 'tidemark'); assert.equal(SITES[j.site].region, 'tidemark', `${lv}: ${j.site}`);
      assert.deepEqual(jobOf(SEED, j.id), j, 'from its id alone');
    }
  }
  assert.ok(offersIn(SEED, 3, 12, 0, 'vale').every((j) => !/_tidemark$/.test(j.id)), 'the Vale\'s as before');
  const sim = createSim(SEED, undefined, { scene: 'town', region: 'tidemark' }); sim.tick(); sim.state.party[0].level = 36;
  sim.commands.push({ type: 'boardView' }); sim.tick();
  assert.ok(sim.board.offers().every((j) => /_tidemark$/.test(j.id)), 'posted in Tollhaven: the Tidemark\'s');
});

test('the four spawn points: one at each band (the Mole\'s two), each of its band\'s foes', () => {
  const mine = CAMPS.filter((c) => c.region === 'tidemark' && c.kind !== 'stand');
  assert.deepEqual(mine.map((c) => [c.id, c.level, c.family]), [['tide_wreckers', 31, 'wharf'], ['tide_marsh', 35, 'mole'], ['tide_kennels', 39, 'siege'], ['tide_siege', 43, 'siege']]);
});

test('the Journal: Josse\'s errand on offer, the Tidemark\'s Chronicle counted, the Cabin once found, the board', () => {
  const st = { party: [{ id: 'hero' }], bench: [], bosses: { harbourmaster: 1, hesk: 1, champion: 1, lucan: 1 }, fragments: [], revealed: new Set(), sitesEntered: new Set(), flags: {} };
  const ids = (s) => openLeads(st, s, 'tidemark').map((l) => l.id);
  assert.deepEqual(ids((q) => (q === 'maren_the_harbour_roll' ? QS.AVAILABLE : QS.DONE)), ['maren', 'names', 'tidechronicle', 'tideboard']);
  st.party.push({ id: 'maren' }); st.fragments = SETS.tidemark.slice(0, 5);
  assert.deepEqual(openLeads(st, () => QS.DONE, 'tidemark').find((l) => l.id === 'tidechronicle'), { id: 'tidechronicle', n: 5, of: 12 });
  st.revealed.add('sisters_cabin'); assert.deepEqual(ids(() => QS.DONE), ['cabin', 'tideboard']);
  st.sitesEntered.add('sisters_cabin'); assert.deepEqual(ids(() => QS.DONE), ['tideboard']);
});
