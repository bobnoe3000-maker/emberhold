// The Proving Pens (GDD v1.60, world doc v1.38; the owner: "Add a test dungeon to thornvale, one room with each of the new
// creatures.. level 4"): a trial site on the Vale behind the Scrag Warren's old adit. Flat at 4 (no band: the Keep keeps
// 4–6), two authored floors; each of the bestiary in a pen of its own and nothing else there, the vermin together, all
// four new together; the Rat King in the first floor's hall, the Spider Queen in the last. In from the Vale and out to it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { statsFor } from '../src/sim/party.js';
import { FAMILIES, ENEMY_KINDS } from '../src/sim/battle.js';
import { SITES, bossAt, levelBand, siteOpen } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { isWalkable } from '../src/sim/world.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const PENS = { beetle_pen: ['firebeetle'], goblin_pen: ['gob'], wraith_pen: ['wraith'], golem_pen: ['golem'] };

test('the Pens: a Vale site flat at 4, open, two authored floors, the Rat King and the Spider Queen in its halls', () => {
  const S = SITES.proving_pens;
  assert.equal(S.region, 'vale'); assert.ok(S.flat && !S.band && !S.hidden && !S.parked, 'flat, no band, open');
  assert.equal(levelBand('proving_pens'), '4'); assert.equal(S.floors, 2); assert.ok(siteOpen('proving_pens', []));
  assert.deepEqual(checkPlan(PLANS.proving_pens), []);
  assert.equal(bossAt('proving_pens', 0), 'rat_king'); assert.equal(bossAt('proving_pens', 1), 'spider_queen');
  const rooms = PLANS.proving_pens.floors.flatMap((f) => f.spaces);
  for (const [part, kinds] of Object.entries(PENS)) {
    const r = rooms.find((s) => s.id === part); assert.ok(r, part);
    const F = FAMILIES[r.foes]; assert.ok(F, `${part}: ${r.foes}`);
    assert.deepEqual([...new Set([...F.melee, ...F.ranged, F.elite])], kinds, `${part} holds ${kinds} alone`);
  }
  const mixed = FAMILIES[rooms.find((s) => s.id === 'mixed_pen').foes];
  assert.deepEqual([...new Set([...mixed.melee, ...mixed.ranged, mixed.elite])].sort(), ['firebeetle', 'gob', 'golem', 'wraith'], 'all four new together');
  for (const id of ['beetles', 'gobs', 'wraiths', 'golems', 'vermin', 'bestiary']) for (const k of [...FAMILIES[id].melee, ...FAMILIES[id].ranged, FAMILIES[id].elite]) assert.ok(ENEMY_KINDS.includes(k), `${id}: ${k}`);
  assert.equal(FAMILIES.wraiths.undead('wraith'), true, 'Turn Undead reaches the wraiths');
});

// a pen fills with its own and nothing else, at 4 (fought by the right party kept on its feet, a minute and a half)
for (const [part, kinds] of Object.entries(PENS))
  test(`the Pens: the ${part.replace('_', ' ')} fills with ${kinds.join(', ')} alone, at level 4`, () => {
    const depth = part === 'golem_pen' ? 1 : 0;
    const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'proving_pens' }); sim.tick();
    if (depth) { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth, floors: [] }); assert.equal(sim.world.depth, depth); }
    const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [1, 3]);
    sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m }))); for (const m of sim.state.party) { m.level = 4; m.hp = statsFor(m).maxHp; }
    const L = sim.world.level, r = L.rooms.find((q) => q.part === part), p = sim.state.player; assert.ok(r, part);
    assert.equal(sim.world.roomLevels.get(r.id), 4, `${part} at 4`);
    p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
    const seen = new Set();
    for (let i = 0; i < 20 * 90; i++) { for (const m of sim.state.party) if (!m.down) m.hp = statsFor(m).maxHp; sim.tick(); for (const e of sim.world.enemies || []) seen.add(e.kind); }
    assert.deepEqual([...seen], kinds, `${part}: ${[...seen]}`);
  });

test('the Pens: the Rat King opens the first floor\'s hall, the Spider Queen the second\'s', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'proving_pens' }); sim.tick();
  const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [0, 2]);
  sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m }))); for (const m of sim.state.party) { m.level = 12; m.hp = statsFor(m).maxHp; }
  const waves = []; sim.bus.on('bossWave', (e) => waves.push(e.id));
  const intoHall = () => {
    const L = sim.world.level, r = L.descentRoom, S = sim.world.stairwell, p = sim.state.player; let best = null, bd = 1e9;
    for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); if (S && x >= S.x0 - 1 && x <= S.x1 && y >= S.y0 - 1 && y <= S.y1) continue; const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
    p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5; sim.state.party.forEach((m, i) => { if (i) { m.x = m.px = p.x + (i === 1 ? -0.9 : 0.9); m.y = m.py = p.y + 0.9; } });
    for (let i = 0; i < 20 * 5 && waves.length < (sim.world.depth + 1); i++) sim.tick();
  };
  intoHall(); assert.deepEqual(waves, ['rat_king']);
  sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth: 1, floors: [] }); assert.equal(sim.world.depth, 1);
  intoHall(); assert.deepEqual(waves, ['rat_king', 'spider_queen']);
});

test('the Pens: in by the old adit on the Vale, and out to it by the stair up', () => {
  const v = createSim(SEED, undefined, { scene: 'overland' }); v.tick();
  const ex = v.world.exits.find((e) => e.site === 'proving_pens'); assert.ok(ex, 'its way in on the Vale');
  assert.ok(v.world.labels.some((l) => l.site === 'proving_pens' && l.text === 'The Proving Pens'), 'its name over it');
  const p = v.state.player, a = v.world.arrivals.proving_pens; assert.ok(isWalkable(v.world, a.x, a.y), 'its arrival stands on open ground');
  p.x = p.px = (ex.x0 + ex.x1) / 2; p.y = p.py = (ex.y0 + ex.y1) / 2; v.tick();
  assert.equal(v.world.kind, 'dungeon'); assert.equal(v.world.site, 'proving_pens');
  const q = v.state.player; q.x = q.px = v.world.exitAt.x; q.y = q.py = v.world.exitAt.y; v.tick();
  assert.equal(v.world.kind, 'overland'); assert.ok(Math.abs(q.x - a.x) < 2 && Math.abs(q.y - a.y) < 2, 'out at its door');
});
