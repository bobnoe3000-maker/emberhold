// The hill goblins (world doc v1.19): the goblin family (not undead: Turn Undead does nothing to them), and Old Skarn,
// who drums more goblins out of the tunnels while he stands. Hedda's errand is to put him down. (v1.48, one dungeon a
// level: GDD §3, world doc v1.32) Skarn holds Wickham Keep's first-floor hall now, selling her hens to the Redhand in
// the bailey; the Scrag Warren, their burrow, is parked for the Cinder Reach: kept whole, with no way in.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { BOSSES, FAMILIES, ENEMY_KINDS, SWARM_MAX } from '../src/sim/battle.js';
import { SITES, levelBand, bossAt, siteOpen } from '../src/sim/sites.js';
import { THEME_KEYS } from '../src/sim/level.js';
import { QS } from '../src/sim/quests.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
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

test('the Scrag Warren: parked for the Reach, no way in; its look and the goblin family kept; Old Skarn in the Keep\'s first hall', () => {
  const S = SITES.scrag_warren;
  assert.equal(levelBand('scrag_warren'), '2–5');
  assert.equal(S.family, 'goblin'); assert.ok(S.parked); assert.equal(S.region, 'reach');
  assert.ok(!siteOpen('scrag_warren', new Set()) && !siteOpen('scrag_warren', new Set(['scrag_warren'])), 'no way in, found or not');
  assert.deepEqual([0, 1].map((d) => bossAt('scrag_warren', d)), [null, null], 'no chief of its own');
  assert.deepEqual([0, 1, 2].map((d) => bossAt('wickham_keep', d)), ['goblin_chief', null, 'redhand_captain'], 'Skarn holds the Keep\'s first hall');
  assert.ok(!THEME_KEYS.includes('warren'), 'the Old Barrows never draw the warren\'s look');
  const F = FAMILIES.goblin;
  for (const k of [...F.melee, ...F.ranged, F.elite]) { assert.ok(ENEMY_KINDS.includes(k), k); assert.equal(F.undead(k), false, `${k} is no undead`); }
  const foes = JSON.parse(readFileSync(new URL('../content/foes.json', import.meta.url), 'utf8')).foes;
  for (const k of ['goblin', 'bruiser', 'archer', 'hexer']) assert.ok(foes[k] && foes[k].a, `the defeat screen names ${k}`);
  const site = JSON.parse(readFileSync(new URL('../content/sites/scrag_warren.json', import.meta.url), 'utf8'));
  assert.equal(site.levels, '2–5'); assert.equal(site.name, S.name); assert.equal(site.region, 'reach');
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'scrag_warren' }); sim.tick();
  assert.equal(sim.world.theme, 'warren');
});

test('a warren room (kept for the Reach) fills with goblins, and nothing else', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'scrag_warren' }); party(sim, 6); sim.tick();
  const L = sim.world.level, r = L.rooms.find((q) => q.id !== L.entrance.id && (!L.descentRoom || q.id !== L.descentRoom.id)), p = sim.state.player;
  p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  const kinds = new Set();
  for (let i = 0; i < 20 * 60; i++) { for (const m of sim.state.party) if (!m.down) m.hp = statsFor(m).maxHp; sim.tick(); for (const e of sim.world.enemies || []) kinds.add(e.kind); }
  assert.ok(kinds.size >= 2, [...kinds].join(','));
  for (const k of kinds) assert.ok(['goblin', 'bruiser', 'archer', 'hexer'].includes(k), k);
  assert.ok((sim.world.enemies || []).every((e) => !e.undead));
});

test('Old Skarn, in the Keep\'s first hall, drums goblins out (never more than SWARM_MAX up), falls, leaves his drum; Hedda\'s errand is done', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'wickham_keep' }); party(sim); sim.tick();
  sim.quests.begin('vale_hens_under_the_hill');
  assert.equal(sim.state.quests.vale_hens_under_the_hill.st, QS.ACTIVE);
  assert.equal(sim.state.depth, 0); assert.ok(sim.world.stairsAt, 'the first floor: its hall is the way down');
  const ev = []; for (const k of ['bossWave', 'bossSwarm', 'bossDown']) sim.bus.on(k, (e) => ev.push([k, e]));
  intoHall(sim);
  let most = 0; const drummed = new Set();
  for (let i = 0; i < 300 * 20 && !ev.some(([k]) => k === 'bossDown'); i++) {
    for (const m of sim.state.party) if (!m.down) m.hp = Math.max(m.hp, statsFor(m).maxHp * 0.6);
    sim.tick();
    const skarn = (sim.world.enemies || []).find((e) => e.boss === 'goblin_chief');
    if (skarn) { const up = sim.world.enemies.filter((e) => e.swarm === skarn.id && e.hp > 0 && !e.dead); most = Math.max(most, up.length); for (const e of up) drummed.add(e.kind); }
  }
  assert.deepEqual(ev.filter(([k]) => k === 'bossWave').map(([, e]) => e.id), ['goblin_chief']);
  assert.ok(ev.some(([k]) => k === 'bossSwarm'), 'he drummed at least once');
  assert.ok(most >= 1 && most <= SWARM_MAX, `his swarm peaked at ${most}`);
  for (const k of drummed) assert.ok(['goblin', 'bruiser', 'archer', 'hexer'].includes(k), `goblins out of the tunnels, in a Redhand keep (${k})`);
  const bd = ev.find(([k]) => k === 'bossDown'); assert.ok(bd, 'Skarn falls'); assert.ok(bd[1].first);
  assert.ok(sim.state.bag.some((it) => it.name === "Skarn's Drum" && it.r === 'heirloom'), 'his heirloom');
  assert.equal(sim.state.quests.vale_hens_under_the_hill.st, QS.READY, 'go back to Hedda');
  assert.ok(!BOSSES.goblin_chief.once, 'he is back on the next visit (the goblins always have a chief)');
});

test('on the Vale: the warren\'s adit is boarded (no door, no label); the Keep\'s door, Skarn\'s now, leads in from the start, its arrival walkable', () => {
  const sim = createSim(SEED, undefined, { scene: 'overland' }), o = sim.world;
  assert.ok(!o.exits.some((e) => e.site === 'scrag_warren'), 'no way in to the warren');
  assert.ok(!o.labels.some((l) => l.site === 'scrag_warren'), 'no site label for it');
  assert.ok(o.structs.some((s) => s.id === 'warren_0'), 'the adit stays on the map');
  const ex = o.exits.find((e) => e.site === 'wickham_keep'); assert.ok(ex, 'the Keep\'s way in');
  assert.ok(o.labels.some((l) => l.site === 'wickham_keep' && l.text === 'Wickham Keep'));
  assert.ok(!SITES.wickham_keep.hidden && siteOpen('wickham_keep', new Set()), 'open from the start');
  const a = o.arrivals.wickham_keep; assert.ok(isWalkable(o, a.x, a.y), 'you come out onto open ground');
  const p = sim.state.player; p.x = p.px = (ex.x0 + ex.x1) / 2; p.y = p.py = (ex.y0 + ex.y1) / 2;
  for (let i = 0; i < 5 && sim.world.kind !== 'dungeon'; i++) sim.tick();
  assert.equal(sim.world.kind, 'dungeon', 'walking into its door takes you in'); assert.equal(sim.state.site, 'wickham_keep');
});
