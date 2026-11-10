// The vermin (GDD v1.58, world doc v1.36; docs/creatures-proposal.md): the grave rat, the giant spider, the spinner and
// Old Gutter, the Vale's first beasts. Each mirrors a role's strength, so the difficulty contract holds whoever fills a
// wave; none is undead; Wickham Keep's Old Cellars fill with the spiders and the rats, the Old Barrows' Cutting with the
// Redhand's diggers and the grave rats, Old Gutter leading.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { statsFor } from '../src/sim/party.js';
import { FAMILIES, ENEMY_KINDS, ENEMIES } from '../src/sim/battle.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const read = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');

test('the vermin: every kind is the sim\'s and named for the defeat screen, none undead; the cellars\' elite the spider, the Cutting\'s Old Gutter', () => {
  const foes = JSON.parse(read('../content/foes.json')).foes;
  for (const id of ['cellar', 'cutting']) {
    const F = FAMILIES[id];
    for (const k of [...F.melee, ...F.ranged, F.elite]) {
      assert.ok(ENEMY_KINDS.includes(k), `${id}: ${k}`); assert.ok(foes[k] && foes[k].a, `the defeat screen names ${k}`);
      if (['rat', 'spider', 'spinner', 'gutter'].includes(k)) assert.equal(F.undead(k), false, `${id}: ${k} is no undead`);
    }
  }
  assert.equal(FAMILIES.cellar.elite, 'spider'); assert.equal(FAMILIES.cutting.elite, 'gutter');
  assert.equal(ENEMIES.spinner.bolt, 'web', 'the spinner spits its web at range');
});

test('each of the vermin mirrors a role (HP and ATK within 15 % of it), so the contract holds whoever fills a wave', () => {
  const MIRROR = { rat: 'minion', spider: 'warrior', spinner: 'rogue', gutter: 'warrior' };
  for (const [k, role] of Object.entries(MIRROR)) {
    const e = ENEMIES[k], r = ENEMIES[role];
    assert.ok(Math.abs(e.hp / r.hp - 1) <= 0.15 && Math.abs(e.atk / r.atk - 1) <= 0.15, `${k} (${e.hp}/${e.atk}) against ${role} (${r.hp}/${r.atk})`);
  }
  assert.ok(ENEMIES.rat.speed > ENEMIES.minion.speed && ENEMIES.rat.dodge > ENEMIES.minion.dodge, 'the rat quicker and harder to hit than the minion');
  assert.ok(ENEMIES.spider.def >= ENEMIES.warrior.def, 'the spider\'s chitin');
});

// a room fills with its own and nothing else (fought by the right party kept on its feet, a minute and a half)
for (const [site, depth, part, kinds] of [['wickham_keep', 1, 'old_cellars', ['rat', 'spider', 'spinner']], ['barrows', 0, 'the_cutting', ['cutthroat', 'rat', 'crossbow', 'rogue', 'gutter']]])
  test(`${site}'s ${part.replace('_', ' ')} fills with its own: ${kinds.join(', ')}`, () => {
    const sim = createSim(SEED, undefined, { scene: 'dungeon', site }); sim.tick();
    if (depth) { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth, floors: [] }); assert.equal(sim.world.depth, depth); }
    const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [1, 3]);
    sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m }))); for (const m of sim.state.party) { m.level = 6; m.hp = statsFor(m).maxHp; }
    const L = sim.world.level, r = L.rooms.find((q) => q.part === part), p = sim.state.player; assert.ok(r, part);
    p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
    const seen = new Set();
    for (let i = 0; i < 20 * 90; i++) { for (const m of sim.state.party) if (!m.down) m.hp = statsFor(m).maxHp; sim.tick(); for (const e of sim.world.enemies || []) seen.add(e.kind); }
    assert.ok(seen.size >= 2, [...seen].join(','));
    for (const k of seen) assert.ok(kinds.includes(k), `${k} in ${part}`);
    assert.ok(seen.has('rat'), 'grave rats among them');
  });
