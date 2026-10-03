// The Scrag Warren (world doc v1.19): the hill goblins' burrow under the north range. A site of its own band (2–5),
// filled by the goblin family (not undead: Turn Undead does nothing to them), with Old Skarn in the second floor's
// hall, who drums more goblins out of the tunnels while he stands. Hedda's errand is to put him down.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { BOSSES, FAMILIES, ENEMY_KINDS, SWARM_MAX } from '../src/sim/battle.js';
import { SITES, levelBand } from '../src/sim/sites.js';
import { THEME_KEYS } from '../src/sim/level.js';
import { QS } from '../src/sim/quests.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const down = (sim) => { const t = sim.world.stairsAt, p = sim.state.player; p.x = p.px = t.x + 0.5; p.y = p.py = t.y + 1.5; sim.commands.push({ type: 'harvest', tx: t.x, ty: t.y }); sim.tick(); };
const intoHall = (sim) => {
  const L = sim.world.level, r = L.descentRoom, S = sim.world.stairwell, p = sim.state.player; let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); if (S && x >= S.x0 - 1 && x <= S.x1 && y >= S.y0 - 1 && y <= S.y1) continue; const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5; sim.state.party.forEach((m, i) => { if (i) { m.x = m.px = p.x + (i === 1 ? -0.9 : 0.9); m.y = m.py = p.y + 0.9; } });
};
function party(sim, lv = 12) {
  const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [0, 2]);
  sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  for (const m of sim.state.party) { m.level = lv; m.hp = statsFor(m).maxHp; }
}

test('the Scrag Warren: a goblin site at 2–5 on two floors, its own look, the goblin family, Old Skarn in the last hall', () => {
  const S = SITES.scrag_warren;
  assert.equal(levelBand('scrag_warren'), '2–5');
  assert.equal(S.family, 'goblin'); assert.equal(S.bosses[2], 'goblin_chief'); assert.ok(!S.hidden, 'open from the start');
  assert.ok(!THEME_KEYS.includes('warren'), 'the Old Barrows never draw the warren\'s look');
  const F = FAMILIES.goblin;
  for (const k of [...F.melee, ...F.ranged, F.elite]) { assert.ok(ENEMY_KINDS.includes(k), k); assert.equal(F.undead(k), false, `${k} is no undead`); }
  const foes = JSON.parse(readFileSync(new URL('../content/foes.json', import.meta.url), 'utf8')).foes;
  for (const k of ['goblin', 'bruiser', 'archer', 'hexer']) assert.ok(foes[k] && foes[k].a, `the defeat screen names ${k}`);
  const site = JSON.parse(readFileSync(new URL('../content/sites/scrag_warren.json', import.meta.url), 'utf8'));
  assert.equal(site.levels, '2–5'); assert.equal(site.name, S.name);
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'scrag_warren' }); sim.tick();
  assert.equal(sim.world.theme, 'warren');
});

test('a warren room fills with goblins, and nothing else', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'scrag_warren' }); party(sim, 6); sim.tick();
  const L = sim.world.level, r = L.rooms.find((q) => q.id !== L.entrance.id && (!L.descentRoom || q.id !== L.descentRoom.id)), p = sim.state.player;
  p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  const kinds = new Set();
  for (let i = 0; i < 20 * 60; i++) { for (const m of sim.state.party) if (!m.down) m.hp = statsFor(m).maxHp; sim.tick(); for (const e of sim.world.enemies || []) kinds.add(e.kind); }
  assert.ok(kinds.size >= 2, [...kinds].join(','));
  for (const k of kinds) assert.ok(['goblin', 'bruiser', 'archer', 'hexer'].includes(k), k);
  assert.ok((sim.world.enemies || []).every((e) => !e.undead));
});

test('Old Skarn drums goblins out of the tunnels (never more than SWARM_MAX up), falls, leaves his drum; Hedda\'s errand is done', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'scrag_warren' }); party(sim); sim.tick();
  sim.quests.begin('vale_hens_under_the_hill');
  assert.equal(sim.state.quests.vale_hens_under_the_hill.st, QS.ACTIVE);
  down(sim); assert.equal(sim.state.depth, 1); assert.ok(!sim.world.stairsAt, 'two floors: no way down from the second');
  const ev = []; for (const k of ['bossWave', 'bossSwarm', 'bossDown']) sim.bus.on(k, (e) => ev.push([k, e]));
  intoHall(sim);
  let most = 0;
  for (let i = 0; i < 300 * 20 && !ev.some(([k]) => k === 'bossDown'); i++) {
    for (const m of sim.state.party) if (!m.down) m.hp = Math.max(m.hp, statsFor(m).maxHp * 0.6);
    sim.tick();
    const skarn = (sim.world.enemies || []).find((e) => e.boss === 'goblin_chief');
    if (skarn) most = Math.max(most, sim.world.enemies.filter((e) => e.swarm === skarn.id && e.hp > 0 && !e.dead).length);
  }
  assert.deepEqual(ev.filter(([k]) => k === 'bossWave').map(([, e]) => e.id), ['goblin_chief']);
  assert.ok(ev.some(([k]) => k === 'bossSwarm'), 'he drummed at least once');
  assert.ok(most >= 1 && most <= SWARM_MAX, `his swarm peaked at ${most}`);
  const bd = ev.find(([k]) => k === 'bossDown'); assert.ok(bd, 'Skarn falls'); assert.ok(bd[1].first);
  assert.ok(sim.state.bag.some((it) => it.name === "Skarn's Drum" && it.r === 'heirloom'), 'his heirloom');
  assert.equal(sim.state.quests.vale_hens_under_the_hill.st, QS.READY, 'go back to Hedda');
  assert.ok(!BOSSES.goblin_chief.once, 'he is back on the next visit (a warren always has a chief)');
});

test('the warren on the Vale: its door leads in, its arrival is walkable', () => {
  const sim = createSim(SEED, undefined, { scene: 'overland' }), o = sim.world;
  const ex = o.exits.find((e) => e.site === 'scrag_warren'); assert.ok(ex, 'a way in');
  assert.ok(o.labels.some((l) => l.site === 'scrag_warren' && l.text === 'The Scrag Warren'));
  const a = o.arrivals.scrag_warren; assert.ok(isWalkable(o, a.x, a.y), 'you come out onto open ground');
  assert.ok(o.structs.some((s) => s.id === 'warren_0'));
});
