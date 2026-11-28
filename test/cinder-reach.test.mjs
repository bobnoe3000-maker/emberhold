// The Cinder Reach as a land (GDD v1.124, world doc v1.53; docs/reach-plan.md, the owner: "Act 3, go with your
// recommendation"): it opens when Act II does, by the Wickham road north out of the Vale and back; Ashgate is its town,
// on the coach; its first band, the Cold Seam (19–21), is two authored floors with the Foreman in the tally cave, whose
// whistle brings a load of slag down onto a cross under each of the company, landing as a share of max HP on whoever's
// still standing on it; and past level 18 foes carry the high premium the contract asked for.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';
import { SITES, bossAt, levelBand } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { BOSSES, BOSS_TUNE, CHUTE_S, CHUTE_WIND, CHUTE_HURT, premiumOf, PREMIUM } from '../src/sim/battle.js';
import { days, townOf } from '../src/sim/coach.js';
import { statsFor } from '../src/sim/party.js';
import { isWalkable } from '../src/sim/world.js';
import { openAllGates } from './gates.mjs';

const actIIDone = (sim) => { sim.state.quests.ch2_the_last_office = { st: QS.DONE, step: 0, n: [] }; };
const standIn = (sim, e) => { const p = sim.state.player; p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; };

test('the Wickham road: shut until Act II is done, then north into the Reach and home again; Ashgate on the coach', () => {
  const sim = createSim(11, undefined, { scene: 'overland', region: 'vale' }); sim.tick();
  const said = []; sim.bus.on('landShut', (e) => said.push(e));
  const north = sim.world.exits.find((e) => e.region === 'reach');
  standIn(sim, north); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.state.region, 'vale', 'you stay'); assert.equal(said.length, 1); assert.match(said[0].line, /Wickham road/);
  actIIDone(sim); standIn(sim, north); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.state.region, 'reach'); assert.equal(sim.world.name, 'The Cinder Reach');
  assert.ok(isWalkable(sim.world, sim.state.player.x, sim.state.player.y), 'you arrive on open ground');
  const home = sim.world.exits.find((e) => e.region === 'vale' && !e.closed);
  standIn(sim, home); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.state.region, 'vale'); assert.ok(Math.abs(sim.state.player.y - sim.world.arrivals.reach.y) < 2, 'back at the Vale\'s north edge');
  assert.equal(townOf('reach'), 'ashgate'); assert.equal(days('thornwick', 'ashgate'), 2);
});

test('the Cold Seam: a band of 19–22 (v1.144), two authored floors that keep the plan rules, its door on the Reach, the Foreman in the tally cave', () => {
  assert.equal(levelBand('cold_seam'), '19–22'); assert.equal(SITES.cold_seam.region, 'reach');
  assert.deepEqual(checkPlan(PLANS.cold_seam), []);
  assert.equal(bossAt('cold_seam', 1), 'foreman'); assert.equal(BOSSES.foreman.mech, 'chutes');
  const sim = createSim(5, undefined, { scene: 'overland', region: 'reach' }); sim.tick();
  const door = sim.world.exits.find((e) => e.to === 'dungeon' && e.site === 'cold_seam');
  assert.ok(door, 'a door'); standIn(sim, door); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.state.scene, 'dungeon'); assert.equal(sim.state.site, 'cold_seam');
  const levels = [...sim.world.roomLevels.values()].filter((v) => v > 0);
  assert.ok(levels.every((v) => v >= 19 && v <= 20), `floor 1: ${levels}`);
});

test('the Foreman\'s whistle: a load comes down on a cross under each of the company, and lands on whoever stays on it', () => {
  // (the mechanic, not the balance: a lone hero against the Foreman at his blow before the 2026-11-28 tuning, BOSS_TUNE;
  // at his tuned blow he dropped the hero inside a tick before his first whistle, and the visit ended)
  const tune = BOSS_TUNE.atk; BOSS_TUNE.atk = 1 / (BOSS_TUNE.by.foreman ? BOSS_TUNE.by.foreman[1] : 1);
  try { foremanWhistle(); } finally { BOSS_TUNE.atk = tune; }
});
function foremanWhistle() {
  const sim = openAllGates(createSim(20260807, undefined, { scene: 'dungeon', site: 'cold_seam' })); sim.tick();
  sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth: 1, floors: [] }); openAllGates(sim);
  const L = sim.world.level, r = L.descentRoom; let at = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; at = [x + 0.5, y + 0.5]; } }
  const h = sim.state.party[0], p = sim.state.player; h.level = 21; p.x = p.px = at[0]; p.y = p.py = at[1];
  const tells = [], lands = [], whistles = [];
  sim.bus.on('tell', (e) => tells.push(e)); sim.bus.on('tellLand', (e) => lands.push(e)); sim.bus.on('bossChutes', (e) => whistles.push(e));
  // the hero held where he stands (as if you'd let go of the stick and he froze), kept standing: the load lands on him
  const hits = []; sim.bus.on('combat', (c) => { if (c.t === 'hit' && c.party && tells.length && !lands.length) hits.push(c.amount); });
  for (let i = 0; i < 20 * (CHUTE_S + CHUTE_WIND + 3) && !lands.length; i++) {
    h.hp = statsFor(h).maxHp; h.down = false;
    if (tells.length) { p.x = p.px = tells[0].x; p.y = p.py = tells[0].y; }
    sim.tick();
  }
  assert.ok(whistles.length >= 1, 'he whistled'); assert.equal(whistles[0].id, 'foreman');
  assert.ok(tells.length >= 1 && tells.every((t) => t.kind === 'load' && Math.abs(t.wind - CHUTE_WIND) < 1e-9), 'a cross under the company, filling over the wind');
  assert.ok(lands.length >= 1 && lands[0].hit >= 1, `it landed on him (${JSON.stringify(lands[0])}, he at ${p.x.toFixed(1)},${p.y.toFixed(1)})`);
  assert.ok(hits.includes(Math.round(statsFor(h).maxHp * CHUTE_HURT)), `a share of his max HP (${hits})`);
}

test('past level 18 foes carry the high premium; at 18 and under, nothing changes', () => {
  for (const lv of [1, 3, 9, 15, 18]) assert.equal(premiumOf(lv), 1 + PREMIUM * Math.max(0, lv - 3));
  assert.ok(premiumOf(21) > 1 + PREMIUM * 18, 'more than the plain premium at 21');
});

test('a save in the Reach comes back in the Reach', () => {
  const sim = createSim(9, undefined, { scene: 'overland', region: 'reach' }); sim.tick();
  actIIDone(sim);
  const snap = JSON.parse(JSON.stringify(sim.snapshot())), back = createSim(9, undefined, { scene: 'town' }); back.restore(snap); back.tick();
  assert.equal(back.state.region, 'reach'); assert.equal(back.world.name, 'The Cinder Reach');
});
