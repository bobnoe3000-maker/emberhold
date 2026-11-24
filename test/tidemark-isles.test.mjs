// The Gull Isles and the Lamp Fort (GDD v1.151; docs/tidemark-plan.md, step 4): the Tidemark's second band, 36–40, two
// floors (the sea cave on the `seacave` kit, the hulks on the `hulk` kit), its door at the landing jetty past the salt
// marsh; the Gull Fleet's family (the war-hound and the mate new); Admiral Hesk's boarding; the Lamp Fort, the land's
// side vault at 38, Old Gannet at its gate; and the side vaults' keepsakes (the owner's yes): a side vault's chest gives
// its keepsake once, then seals for SECRET_REST, unless an errand still sends the company there.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { SITES, levelBand, bossAt, SECRET_REST } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { ENEMIES, FAMILIES, BOSSES, BOARD_S, BOARD_WIND } from '../src/sim/battle.js';
import { statsFor } from '../src/sim/party.js';
import { NPCS } from '../src/sim/npcs.js';
import { QUESTS, QS } from '../src/sim/quests.js';
import { HEIRLOOMS, starterKit } from '../src/sim/items.js';
import { isWalkable } from '../src/sim/world.js';
import { autoAllocate } from '../src/sim/attributes.js';

const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const at = (sim, site, depth) => sim.restore({ ...snap(sim), scene: 'dungeon', site, depth, floors: [] });
const walkIn = (sim, site) => {
  const door = sim.world.exits.find((e) => e.site === site), p = sim.state.player;
  p.x = p.px = (door.x0 + door.x1) / 2; p.y = p.py = (door.y0 + door.y1) / 2; for (let i = 0; i < 5; i++) sim.tick();
};
const loot = (sim) => { const [x, y] = sim.world.vault.key.split(',').map(Number), p = sim.state.player; p.x = p.px = x + 0.5; p.y = p.py = y + 1.5; if (!isWalkable(sim.world, p.x, p.y)) p.y = p.py = y - 0.5; sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick(); };

test('the Gull Isles: a band of five on the Tidemark, its plan to the rules, the sea cave then the hulks, Hesk in the great cabin', () => {
  const S = SITES.gull_isles, P = PLANS.gull_isles;
  assert.equal(S.region, 'tidemark'); assert.equal(levelBand('gull_isles'), '36–40'); assert.equal(bossAt('gull_isles', 1), 'hesk');
  assert.deepEqual(checkPlan(P), []);
  assert.deepEqual(P.floors.map((f) => [...new Set(f.spaces.map((s) => s.kit))]), [['seacave'], ['hulk']]);
  assert.deepEqual(P.floors.map((f) => [Math.min(...f.spaces.map((s) => s.lv)), Math.max(...f.spaces.map((s) => s.lv))]), [[0, 2], [3, 4]]);
  assert.ok(P.floors[1].spaces.some((s) => s.id === 'the_wardroom' && s.role === 'offshoot'), 'Hesk\'s commission');
});

test('the landing jetty walks into the sea cave, and its way down to the hulks; the Lamp Fort\'s door into its gate, Gannet there', () => {
  const sim = createSim(7, undefined, { scene: 'overland', region: 'tidemark' }); sim.tick();
  walkIn(sim, 'gull_isles');
  assert.equal(sim.world.kind, 'dungeon'); assert.equal(sim.world.site, 'gull_isles');
  assert.ok(isWalkable(sim.world, sim.state.player.x, sim.state.player.y), 'in on the boat landing');
  const s = sim.world.stairsAt, p = sim.state.player; p.x = p.px = s.x + 0.5; p.y = p.py = s.y + 1.5; sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick();
  assert.equal(sim.state.depth, 1, 'down to the hulks');
  const out = createSim(7, undefined, { scene: 'overland', region: 'tidemark' }); out.tick();
  walkIn(out, 'lamp_fort');
  assert.equal(out.world.kind, 'dungeon'); assert.equal(out.world.site, 'lamp_fort');
  assert.deepEqual(NPCS.old_gannet.found, { site: 'lamp_fort', depth: 0, entrance: true });
});

test('the Gull Fleet: corsairs and war-hounds, gunners and the Redhand\'s crossbows, its mates; none of them undead', () => {
  for (const k of ['warhound', 'mate']) assert.ok(ENEMIES[k], k);
  const F = FAMILIES.fleet;
  assert.deepEqual([F.melee, F.ranged, F.elite], [['corsair', 'warhound'], ['gunner', 'crossbow'], 'mate']);
  for (const k of [...F.melee, ...F.ranged, F.elite]) { assert.ok(ENEMIES[k], k); assert.equal(F.undead(k), false, k); }
  assert.equal(BOSSES.hesk.mech, 'boarding'); assert.ok(HEIRLOOMS[BOSSES.hesk.heirloom], 'The Letter of Marque');
  assert.equal(SITES.lamp_fort.family, 'fleet'); assert.equal(SITES.gull_isles.family, 'fleet');
});

// Hesk's hall: a hero who'll stand through it, the boss's fight on the manual tick
function cabin(seed = 20260807) {
  const sim = createSim(seed, undefined, { scene: 'dungeon', site: 'gull_isles' });
  const H = sim.state.party[0]; H.level = 40; H.attrs = null; autoAllocate(H); H.gear = starterKit(H); H.hp = statsFor(H).maxHp;   // (the hall's level: kept standing below)
  sim.tick();
  const s = sim.world.stairsAt, p = sim.state.player; p.x = p.px = s.x + 0.5; p.y = p.py = s.y + 1.5; sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick();
  const L = sim.world.level, r = L.descentRoom;
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  return { sim, H, max: statsFor(H).maxHp };
}

test('boarding: two grapples told from the cabin\'s edge, his boarders swinging in where they land', () => {
  const { sim, H, max } = cabin(), told = [], boarded = [];
  sim.bus.on('tell', (e) => { if (e.kind === 'grapple') told.push({ t: sim.state.t, ...e }); });
  sim.bus.on('bossBoard', (e) => boarded.push({ t: sim.state.t, ...e }));
  for (let i = 0; i < 20 * (BOARD_S + BOARD_WIND + 2) && boarded.length < 2; i++) { H.hp = max; sim.tick(); }   // (kept standing: the test watches the grapples)
  assert.equal(told.length, 2, 'two grapples a call'); assert.ok(told.every((g) => g.wind === BOARD_WIND && g.land && g.r >= 4), JSON.stringify(told[0]));
  assert.equal(boarded.length, 2); assert.ok(boarded.every((b) => b.t - told[0].t >= BOARD_WIND - 0.06), 'they land when told');
  assert.ok(boarded.some((b) => !b.cut && b.n > 0 && b.reached.length === b.n), `boarders came: ${JSON.stringify(boarded.map((b) => [b.cut, b.n]))}`);
  for (const b of boarded) for (const u of b.reached) assert.ok(sim.world.enemies.find((o) => o.id === u.id && ['corsair', 'gunner'].includes(o.kind)), 'his escort\'s kinds');
});

test('boarding: whoever stands where a grapple lands cuts its line, and nobody comes along it', () => {
  const { sim, H, max } = cabin(), boarded = []; let mark = null;
  sim.bus.on('tell', (e) => { if (e.kind === 'grapple' && !mark) mark = e.land; });
  sim.bus.on('bossBoard', (e) => boarded.push(e));
  const p = sim.state.player;
  for (let i = 0; i < 20 * (BOARD_S + BOARD_WIND + 2) && !boarded.length; i++) { H.hp = max; if (mark) { p.x = p.px = mark.x; p.y = p.py = mark.y; } sim.tick(); }
  assert.ok(boarded.length >= 1); const first = boarded.find((b) => Math.abs(b.x - mark.x) < 1e-9 && Math.abs(b.y - mark.y) < 1e-9);
  assert.ok(first && first.cut && first.n === 0, JSON.stringify(boarded));
});

test('a side vault: the Lamp Fort\'s lamp room gives Gannet\'s Spare Wick once, then seals for two hours; the Haddow Crypt\'s and the Shuttered Inn\'s keep theirs', () => {
  assert.deepEqual(Object.keys(SITES).filter((k) => SITES[k].side), ['lamp_fort', 'shuttered_inn', 'haddow_crypt']);
  assert.deepEqual(['lamp_fort', 'haddow_crypt', 'shuttered_inn'].map((k) => SITES[k].vault), ['gannets_spare_wick', 'the_haddow_roll', 'hobs_spare_key']);
  for (const k of ['gannets_spare_wick', 'the_haddow_roll', 'hobs_spare_key']) assert.ok(HEIRLOOMS[k], k);
  for (const k of ['haddow_crypt', 'shuttered_inn']) { const sim = createSim(7, undefined, { scene: 'dungeon', site: k }); sim.tick(); assert.ok(sim.world.vault, `${k}: a chest in its end room`); }
  const sim = createSim(20260807, undefined, { scene: 'town' }); sim.tick(); sim.state.party[0].level = 38;
  const sealed = []; sim.bus.on('secretSealed', (e) => sealed.push(e));
  at(sim, 'lamp_fort', 0); loot(sim);
  assert.equal(sim.state.bag.filter((it) => it.name === "Gannet's Spare Wick").length, 1, 'the keepsake');
  assert.equal(sealed.length, 1); assert.equal(sim.state.secrets.lamp_fort, sealed[0].until); assert.equal(sealed[0].until - sim.state.t <= SECRET_REST, true);
  const back = createSim(1); back.restore(snap(sim)); assert.deepEqual(back.state.secrets, { lamp_fort: sim.state.secrets.lamp_fort }, 'a save keeps the seal');
  sim.state.t = sim.state.secrets.lamp_fort + 1; at(sim, 'lamp_fort', 0); loot(sim);
  assert.equal(sim.state.bag.filter((it) => it.name === "Gannet's Spare Wick").length, 1, 'once');
});

test('a side vault\'s seal waits while an errand still sends the company there', () => {
  const sim = createSim(20260807, undefined, { scene: 'town' }); sim.tick(); sim.state.party[0].level = 38;
  sim.state.quests.ch4_keepers_light = { st: QS.ACTIVE, step: 0, n: [0] };
  at(sim, 'lamp_fort', 0); loot(sim);
  assert.equal(sim.state.bag.filter((it) => it.name === "Gannet's Spare Wick").length, 1, 'the keepsake still');
  assert.deepEqual(sim.state.secrets, {}, 'not sealed while The Keeper\'s Light is on');
});

test('Act IV runs on: Letters of Marque (Hester) and The Keeper\'s Light (Gannet), both after Low Water', () => {
  assert.deepEqual(QUESTS.ch4_letters_of_marque.after, ['ch4_low_water']); assert.equal(QUESTS.ch4_letters_of_marque.giver, 'hester_quaile');
  assert.deepEqual(QUESTS.ch4_letters_of_marque.steps[0].objectives[0], { type: 'boss', site: 'gull_isles', boss: 'hesk', count: 1 });
  assert.deepEqual(QUESTS.ch4_keepers_light.after, ['ch4_low_water']); assert.equal(QUESTS.ch4_keepers_light.giver, 'old_gannet');
  assert.deepEqual(QUESTS.ch4_keepers_light.steps[0].objectives[0], { type: 'waves', site: 'lamp_fort', count: 6 });
});

test('the Journal sends the company to Gannet at the Lamp Fort\'s gate, not to Tollhaven, and a chapter waits on its own `after`', async () => {
  const { storyStatus, CHAPTERS } = await import('../src/ui/storystatus.js');
  const status = (id) => (CHAPTERS.indexOf(id) < CHAPTERS.indexOf('ch4_keepers_light') ? QS.DONE : id === 'ch4_keepers_light' ? QS.AVAILABLE : QS.LOCKED);
  const ss = storyStatus({ party: [], bench: [] }, status);
  assert.equal(ss.kind, 'next'); assert.equal(ss.id, 'ch4_keepers_light'); assert.equal(ss.giver, 'old_gannet'); assert.equal(ss.at, 'lamp_fort');
  const story = JSON.parse((await import('node:fs')).readFileSync(new URL('../content/story.json', import.meta.url), 'utf8'));
  assert.match(story.nextAt, /\{place\}/);
});
