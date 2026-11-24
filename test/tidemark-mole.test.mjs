// The Drowned Mole (GDD v1.150; docs/tidemark-plan.md, step 3): the Tidemark's first band, 31–35, two floors (the
// wharf on the docks kit, the moles at low water on the mole kit), its door at the end of Gullwick's ferry jetty; the
// Harbourmaster's tide on the outer mole; the Mole's foes and families; Maren found when he falls; Act IV's first two
// chapters; and the heroes' lift past 30 (party.js liftOf), held to the foes' premium (battle.js premiumOf).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { SITES, levelBand, bossAt } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { ENEMIES, FAMILIES, BOSSES, premiumOf, TIDE_S, TIDE_T } from '../src/sim/battle.js';
import { liftOf, statsFor, makeMember } from '../src/sim/party.js';
import { FOUND } from '../src/sim/heroes.js';
import { QUESTS } from '../src/sim/quests.js';
import { HEIRLOOMS, starterKit } from '../src/sim/items.js';
import { isWalkable } from '../src/sim/world.js';
import { autoAllocate } from '../src/sim/attributes.js';

test('the Drowned Mole: a band of five on the Tidemark, its plan to the rules, three levels on its first floor and two on its second', () => {
  const S = SITES.drowned_mole, P = PLANS.drowned_mole;
  assert.equal(S.region, 'tidemark'); assert.equal(levelBand('drowned_mole'), '31–35'); assert.equal(bossAt('drowned_mole', 1), 'harbourmaster');
  assert.deepEqual(checkPlan(P), []);
  assert.deepEqual(P.floors.map((f) => [...new Set(f.spaces.map((s) => s.kit))]), [['docks'], ['mole']]);
  assert.deepEqual(P.floors.map((f) => [Math.min(...f.spaces.map((s) => s.lv)), Math.max(...f.spaces.map((s) => s.lv))]), [[0, 2], [3, 4]]);
  assert.ok(P.floors[1].spaces.some((s) => s.id === 'the_harbour_office' && s.role === 'offshoot'), 'Maren\'s office');
});

test('its door at the end of Gullwick\'s ferry jetty walks into the wharf, and the stair down to the moles', () => {
  const sim = createSim(7, undefined, { scene: 'overland', region: 'tidemark' }); sim.tick();
  const door = sim.world.exits.find((e) => e.site === 'drowned_mole'), p = sim.state.player;
  p.x = p.px = (door.x0 + door.x1) / 2; p.y = p.py = (door.y0 + door.y1) / 2; for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.world.kind, 'dungeon'); assert.equal(sim.world.site, 'drowned_mole'); assert.equal(sim.state.region, 'tidemark');
  assert.ok(isWalkable(sim.world, p.x, p.y), 'in on the ferry stage');
  const s = sim.world.stairsAt; p.x = p.px = s.x + 0.5; p.y = p.py = s.y + 1.5; sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick();
  assert.equal(sim.state.depth, 1, 'down the sea-wall stair');
});

test('the Mole\'s foes: four kinds in two families, the drowned among them undead, the Harbourmaster\'s tide and his heirloom', () => {
  for (const k of ['sailor', 'corsair', 'gunner', 'bosun']) assert.ok(ENEMIES[k], k);
  for (const f of ['wharf', 'mole']) { const F = FAMILIES[f]; for (const k of [...F.melee, ...F.ranged, F.elite]) assert.ok(ENEMIES[k], `${f}: ${k}`); }
  assert.ok(FAMILIES.wharf.undead('sailor') && !FAMILIES.wharf.undead('corsair') && FAMILIES.mole.undead('bosun') && !FAMILIES.mole.undead('gunner'));
  assert.equal(BOSSES.harbourmaster.mech, 'tide'); assert.ok(HEIRLOOMS[BOSSES.harbourmaster.heirloom], 'The Berths\' Book');
});

test('the tide: told, then in over the hall\'s edge, then out again; it drains when he falls', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'drowned_mole' });
  const H = sim.state.party[0]; H.level = 60; H.attrs = null; autoAllocate(H); H.gear = starterKit(H); H.hp = statsFor(H).maxHp;   // (one who'll stand through a tide or two)
  sim.tick();
  const s = sim.world.stairsAt, p = sim.state.player; p.x = p.px = s.x + 0.5; p.y = p.py = s.y + 1.5; sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick();
  const L = sim.world.level, r = L.descentRoom;
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  const told = [], levels = []; sim.bus.on('bossTide', (e) => told.push(sim.state.t)); sim.bus.on('bossFlood', (e) => levels.push([sim.state.t, e.level]));
  const max = statsFor(H).maxHp;   // (kept standing: the test watches the tide, not the fight)
  for (let i = 0; i < 20 * (TIDE_S + TIDE_T + 3) && levels.length < 2; i++) { H.hp = max; sim.tick(); }
  assert.ok(told.length >= 1, 'the tide told'); assert.ok(levels.length >= 2 && levels[0][1] > 0 && levels[1][1] === 0, `in, then out: ${JSON.stringify(levels)}`);
  assert.ok(levels[0][0] > told[0], 'told before it comes in'); assert.ok(Math.abs(levels[1][0] - levels[0][0] - TIDE_T) < 0.2, 'in for TIDE_T');
});

test('Maren is found when the Harbourmaster falls; Act IV opens on Quota and runs Consigned, then Low Water', () => {
  assert.equal(FOUND.maren.freedBy, 'harbourmaster'); assert.equal(FOUND.maren.cls, 'cleric');
  assert.deepEqual(QUESTS.ch4_consigned.after, ['ch3_quota']); assert.equal(QUESTS.ch4_consigned.turnin, 'hester_quaile');
  assert.deepEqual(QUESTS.ch4_low_water.after, ['ch4_consigned']);
  assert.deepEqual(QUESTS.ch4_low_water.steps[0].objectives[0], { type: 'boss', site: 'drowned_mole', boss: 'harbourmaster', count: 1 });
});

test('past 30 a hero grows as the foes\' premium does: HP and ATK lifted by premiumOf(L) / premiumOf(30), nothing under 31', () => {
  for (const L of [1, 18, 30]) assert.equal(liftOf(L), 1);
  for (const L of [31, 33, 45, 75]) assert.ok(Math.abs(liftOf(L) - premiumOf(L) / premiumOf(30)) < 1e-12, `${L}`);
  const a = makeMember('a', 'A', 'fighter', 33), b = makeMember('b', 'B', 'fighter', 33);
  b.level = 30; a.attrs = b.attrs = null; autoAllocate(a); autoAllocate(b);
  assert.ok(statsFor(a).maxHp > statsFor(b).maxHp * 1.1, 'a level-33 hero stands up to a level-33 room');
});

test('the Journal\'s leads on the Tidemark: the Harbourmaster, then Maren until she walks with the company', async () => {
  const { openLeads } = await import('../src/ui/storystatus.js');
  const story = JSON.parse((await import('node:fs')).readFileSync(new URL('../content/story.json', import.meta.url), 'utf8'));
  const st = { party: [{ id: 'hero' }], bench: [], bosses: {} }, none = () => 0;
  assert.deepEqual(openLeads(st, none, 'tidemark').map((l) => l.id), ['harbourmaster']);
  st.bosses.harbourmaster = 1; assert.deepEqual(openLeads(st, none, 'tidemark').map((l) => l.id), ['maren']);
  st.party.push({ id: 'maren' }); assert.deepEqual(openLeads(st, none, 'tidemark'), []);
  for (const id of ['harbourmaster', 'maren']) assert.ok(story.leads[id], id);
  assert.ok(story.leadsTitle.tidemark);
});
