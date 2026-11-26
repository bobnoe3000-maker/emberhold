// Downed with no fight (the owner, 2026-11-26: "2 down, but temple says i dont have anyone down"). `down` is saved
// (MEMBER_KEYS) and the fight isn't, so a save made mid-fight, reloaded, left members at 0 HP and Downed in town: the
// temple raises only the Fallen, and no fight's end was left to get them up. A reload or a trip gets them up at 20 %.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { statsFor } from '../src/sim/party.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const downed = (sim) => sim.state.party.filter((m) => m.down);

test('a save with members Downed and no fight loads with them on their feet at 20 %, the Fallen still Fallen', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); hire(sim, [0, 1]);
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  snap.party[0].down = true; snap.party[0].hp = 0;          // (as the report: the hero and a companion Downed, in town)
  snap.party[2].down = true; snap.party[2].hp = 0;
  snap.party[1].fallen = true; snap.party[1].hp = 0;
  const back = createSim(SEED, undefined, { scene: 'town' }); back.tick(); back.restore(snap); back.tick();
  assert.deepEqual(downed(back), [], 'nobody left Downed out of a fight');
  for (const i of [0, 2]) { const m = back.state.party[i], max = statsFor(m).maxHp; assert.ok(m.hp >= Math.round(max * 0.2) && m.hp < max * 0.25, `${m.name}: up at a fifth (${m.hp}/${max})`); }
  assert.equal(back.state.party[1].fallen, true, 'the Fallen are the temple\'s, as before');
});

test('the same for a save made mid-fight in a dungeon: reloaded, the fight is gone and so is the Downed', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); hire(sim, [0]);
  const snap = { ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'dungeon', site: 'barrows', depth: 0, floors: [] };
  snap.party[1].down = true; snap.party[1].hp = 0;
  const back = createSim(SEED, undefined, { scene: 'town' }); back.tick(); back.restore(snap); back.tick();
  const m = back.state.party[1]; assert.equal(m.down, false); assert.ok(m.hp >= 1); assert.ok(!m.fallen);
});

test('the owner\'s road: reloaded mid-fight at an overland spawn point, the hero Downed: up and walking, and a scroll home after brings nobody Downed', async () => {
  const { CAMP_BY } = await import('../src/sim/camps.js');
  const { makeHero, makeMember } = await import('../src/sim/party.js');
  const { autoAllocate } = await import('../src/sim/attributes.js'), { starterKit } = await import('../src/sim/items.js');
  const c = CAMP_BY.vale_spit, a = Math.PI / 4, sim = createSim(1000, undefined, { scene: 'overland', region: c.region }); sim.tick();
  const ms = ['fighter', 'shaman', 'mage'].map((cls, i) => (i ? makeMember(`c${i}`, `Mate${i}`, cls, 60) : makeHero({ cls, name: 'Hero' })));
  ms.forEach((m) => { m.level = 20; m.attrs = null; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = undefined; });
  sim.state.party.splice(0, 3, ...ms); sim.state.created = true;
  sim.state.bag.push({ uid: 'sc1', base: 'homeward', r: 'common', ilv: 1, name: 'Homeward Scroll', st: {}, aff: [] });
  const p = sim.state.player; p.x = p.px = c.x + Math.cos(a) * (c.reach - 0.5); p.y = p.py = c.y + Math.sin(a) * (c.reach - 0.5);
  for (let t = 0; t < 50; t++) sim.tick();
  ms[0].hp = 0; ms[0].down = true; ms[2].hp = 0; ms[2].down = true;   // (as the report: the hero and the mage Downed)
  const back = createSim(1000, undefined, { scene: 'overland', region: c.region }); back.tick(); back.restore(JSON.parse(JSON.stringify(sim.snapshot())));
  const x0 = back.state.player.x; back.commands.push({ type: 'move', x: 1, y: 0 }); for (let t = 0; t < 20; t++) back.tick();
  assert.ok(Math.abs(back.state.player.x - x0) > 0.1, 'the hero can move (before: stuck, Downed with no fight)');
  back.commands.push({ type: 'useItem', uid: 'sc1' }); back.tick(); back.tick();
  assert.equal(back.world.kind, 'town'); assert.deepEqual(downed(back), [], 'nobody Downed in town');
});
