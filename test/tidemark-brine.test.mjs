// Brine Cross (GDD v1.151; docs/tidemark-plan.md, step 5): a held position, not a dungeon. The east barricade at the
// bridge's east foot is a STAND (camps.js): up only while *Brine Cross* is in hand; its waves come up the Highmarch road;
// three of the League fight beside the company (battle.js standAllies, battle.side); the eighth wave falls, Old Gannet
// breaks his lamp on the barricade and the drowned lie down (standHeld, flags.brine_held, campCleared for the chapter).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim, TICK_DT } from '../src/sim/core.js';
import { CAMP_BY, campUp } from '../src/sim/camps.js';
import { FAMILIES } from '../src/sim/battle.js';
import { QUESTS, QS } from '../src/sim/quests.js';
import { statsFor, makeHero, makeMember } from '../src/sim/party.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { makeItem, STARTER } from '../src/sim/items.js';
import { isWalkable } from '../src/sim/world.js';

const C = CAMP_BY.brine_cross;
function atBarricade(seed = 1, lv = 40) {
  const sim = createSim(seed, undefined, { scene: 'overland', region: 'tidemark' }); sim.tick();
  sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, fighter24: 1, rogue24: 1, mage24: 1, cleric24: 1 };
  sim.state.party = ['fighter', 'rogue', 'cleric'].map((c, i) => {
    const m = i ? makeMember('c' + i, 'C' + i, c, lv) : makeHero({ cls: c }); m.level = lv; m.attrs = null; m.autoAttrs = true; autoAllocate(m);
    for (const sl of Object.keys(m.gear)) if (STARTER[c][sl]) m.gear[sl] = makeItem(STARTER[c][sl], lv, 'common', { uid: `${i}${sl}` });
    m.hp = statsFor(m).maxHp; return m;
  });
  return sim;
}
const inHand = (sim) => { sim.state.quests.ch4_brine_cross = { st: QS.ACTIVE, step: 0, n: [0] }; };
const walkUp = (sim) => { const p = sim.state.player; p.x = p.px = C.x - 7.5; p.y = p.py = C.y + 0.5; sim.tick(); };

test('the east barricade: a stand on the Highmarch road, at 40, the drowned fleet\'s crews; up only while Brine Cross is in hand', () => {
  assert.equal(C.kind, 'stand'); assert.equal(C.region, 'tidemark'); assert.equal(C.level, 40); assert.equal(C.stand.waves, 8);
  assert.ok(Object.values(FAMILIES.drowned_fleet).filter(Array.isArray).flat().every((k) => FAMILIES.drowned_fleet.undead(k)), 'all of them drowned');
  const sim = atBarricade();
  assert.ok(isWalkable(sim.world, C.x, C.y), 'on the road');
  assert.equal(campUp(sim.state, C), false, 'quiet before the chapter');
  walkUp(sim); assert.ok(!sim.battle, 'no fight at the barricade before it');
  inHand(sim); assert.equal(campUp(sim.state, C), true);
  sim.state.flags.brine_held = 1; assert.equal(campUp(sim.state, C), false, 'and never again once held');
  assert.deepEqual(QUESTS.ch4_brine_cross.after, ['ch4_letters_of_marque', 'ch4_keepers_light']);
  assert.deepEqual(QUESTS.ch4_brine_cross.steps[0].objectives[0], { type: 'camp', camp: 'brine_cross', count: 1 });
});

test('walked up to with the chapter in hand: three of the League on the company\'s side, the first wave coming up the road from the east', () => {
  const sim = atBarricade(); inHand(sim); walkUp(sim);
  assert.ok(sim.battle && sim.battle.camp === C, 'the stand begun');
  assert.equal(sim.battle.allies.length, 3); assert.deepEqual(sim.battle.allies.map((m) => m.cls), C.stand.allies);
  assert.ok(sim.battle.allies.every((m) => m.ally && m.hp > 0 && m.x < C.x), 'at the barricade, west of the middle');
  assert.equal(sim.world.allies, sim.battle.allies, 'drawn as allies are');
  const foes = sim.world.enemies.filter((e) => e.hp > 0);
  assert.ok(foes.length >= 4 && foes.every((e) => e.x > C.x + 5), `the wave east of it: ${foes.map((e) => e.x.toFixed(0))}`);
  // walk out: the stand's off, the League stays at its barricade
  const p = sim.state.player; p.x = p.px = C.x - C.arena - 6; for (let i = 0; i < 5; i++) sim.tick();
  assert.ok(!sim.battle); assert.deepEqual(sim.world.allies, []);
});

test('held: eight waves fall, Gannet\'s lamp is broken on the barricade (standHeld), the chapter counts it, and the stand never comes back', () => {
  const sim = atBarricade(1); inHand(sim);
  const held = [], cleared = []; sim.bus.on('standHeld', (e) => held.push(e)); sim.bus.on('campCleared', (e) => cleared.push(e));
  let waves = 0; sim.bus.on('wave', (d) => { if (d.cleared) waves++; });
  walkUp(sim);
  for (let i = 0; i < 400 / TICK_DT && !held.length; i++) sim.tick();
  assert.equal(held.length, 1, `held (${waves} waves)`); assert.equal(waves, 8);
  assert.equal(cleared.filter((e) => e.id === 'brine_cross').length, 1, 'campCleared once, at the end');
  assert.equal(sim.state.flags.brine_held, 1);
  assert.equal(sim.state.quests.ch4_brine_cross.st, QS.READY, 'the chapter ready to hand in');
  for (let i = 0; i < 40 / TICK_DT; i++) sim.tick();
  assert.ok(!sim.world.enemies.some((e) => e.hp > 0 && !e.idle), 'no ninth wave');
  assert.equal(campUp(sim.state, C), false);
});

test('a stand is lost when the company is down, whoever of the League still stands; an ally down is only an ally down', () => {
  const sim = atBarricade(2); inHand(sim);
  let lost = 0; sim.bus.on('defeat', () => { lost++; });
  walkUp(sim);
  const ally = sim.battle.allies[0]; ally.hp = 0; ally.down = true;
  for (let i = 0; i < 40; i++) sim.tick();
  assert.equal(lost, 0, 'an ally down loses nothing'); assert.ok(sim.battle, 'the stand goes on');
  for (const m of sim.state.party.slice(1)) { m.hp = 0; m.down = true; }
  const H = sim.state.party[0];
  for (let i = 0; i < 2000 && !lost; i++) { if (H.hp > 1 && !H.down) H.hp = 1; sim.tick(); }
  assert.equal(lost, 1, 'the company down: the stand lost');
});
