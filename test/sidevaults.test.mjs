// The one-floor dungeons in the quest line (GDD v1.145; the owner, 2026-11-23: "Fit in the one floor dungeons into the
// existing quest line we can replace an existing dungeon in favor of the better dungeon if its the right style"):
// the cleric's trial at 6 is said in the Haddow Crypt (6), Hob's price in Paid by Weight is his box in the Shuttered Inn
// (23, the Yards' band), and the Fens' secret, the Reedholm Undercroft, is a designed floor on the crypt kit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { QUESTS } from '../src/sim/quests.js';
import { SITES } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { createWorld } from '../src/sim/world.js';
import { createSim } from '../src/sim/core.js';

const json = (id) => JSON.parse(readFileSync(new URL(`../content/quests/${id}.json`, import.meta.url), 'utf8'));
const objs = (q) => q.steps.flatMap((s) => s.objectives.map((o) => ({ type: o.type, site: o.site, count: o.count })));

test('the cleric\'s trial at 6 is said in the Haddow Crypt, at its level; the sim\'s and the content\'s agree', () => {
  const q = QUESTS.trial_last_rites, o = q.steps[0].objectives[0];
  assert.equal(o.site, 'haddow_crypt'); assert.equal(o.type, 'waves'); assert.equal(o.count, 5);
  assert.equal(SITES.haddow_crypt.base, q.rewards.lv, 'the crypt at the trial\'s level');
  assert.deepEqual(objs(json('trial_last_rites')), objs(q));
});

test('Paid by Weight ends at the Shuttered Inn, Hob\'s price, appended so a save mid-chapter keeps its step', () => {
  const q = QUESTS.ch3_paid_by_weight;
  assert.deepEqual(q.steps.map((s) => s.id), ['pass', 'weighmaster', 'price'], 'the new step last: an old save\'s step index still means the same');
  assert.deepEqual(q.steps[2].objectives[0], { type: 'loot', site: 'shuttered_inn', count: 1 });
  assert.deepEqual(objs(json('ch3_paid_by_weight')), objs(q));
  assert.ok(SITES.shuttered_inn.base >= q.level[0] && SITES.shuttered_inn.base <= SITES.assay_yards.base + SITES.assay_yards.span - 1, 'the inn inside the Yards\' band');
});

test('a chest in the Shuttered Inn pays Hob\'s price, once the Weighmaster is down', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'shuttered_inn' }); sim.tick();
  sim.state.quests.ch3_paid_by_weight = { st: 1, step: 2, n: [0] };
  sim.bus.emit('looted', { tx: 1, ty: 1, kind: 'chest' });
  assert.equal(sim.state.quests.ch3_paid_by_weight.st, 2, 'ready: the rolls go to Dagny');
});

test('the Reedholm Undercroft: a designed floor on the crypt kit, its vault in the end room\'s chest, a secret still', () => {
  const S = SITES.reedholm_undercroft, P = PLANS.reedholm_undercroft;
  assert.ok(S.plan && S.secret && S.hidden && S.vault === 'the_fair_copy'); assert.equal(P.base, S.base);
  assert.deepEqual(checkPlan(P), []);
  const w = createWorld(7, undefined, 0, 'reedholm_undercroft'), L = w.level;
  assert.deepEqual(L.rooms.map((r) => r.kit), ['crypt', 'crypt', 'crypt', 'ossuary', 'crypt']);
  const end = L.rooms.find((r) => r.role === 'end'), c = L.cells.get(w.vault.key);
  assert.ok(c && c.room === end.id, 'the vault\'s chest in the Fair Copy');
  assert.equal(w.props.get(w.vault.key), 'chest');
  let desks = 0; for (const v of w.props.values()) if (v === 'desk') desks++;
  assert.ok(desks >= 1, 'the copyists\' desks');
});
