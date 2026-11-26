// The Grace (GDD v1.157, sim/ring.js GRACE; docs/tidemark-plan.md step 8; the owner, 2026-11-24: "the top of the hour"):
// the Tidemark's region boss, at the top of the hour as the Kingstone is, told apart by its tag (':00g'), from 40 and only
// once Low Water is done. At the hour the tide lifts Aurelle's Grace off her reef and she stands in to the wreckers' beach
// (camps.js tide_wreckers), her master comes up the sand; the ship's broadside, lanes of shot from the sea, and her
// boarders, a boat's worth up out of the surf, are hers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { CAMP_BY } from '../src/sim/camps.js';
import { statsFor } from '../src/sim/party.js';
import * as items from '../src/sim/items.js';
import * as attrs from '../src/sim/attributes.js';
import { inTell } from '../src/sim/hazards.js';
import { isWalkable } from '../src/sim/world.js';
import { RING, GRACE, RINGS, isWindowId, windowAt, ringForId, ringByCamp, restoreRing } from '../src/sim/ring.js';
import { QS } from '../src/sim/quests.js';

const SEED = 20261126, C = CAMP_BY[GRACE.camp], ID = '2026-11-26T14:00g';
/** the right party at `level` on the Tidemark's overland, south of the beach's arena; Low Water done unless `story` is false */
function company(level = 45, story = true) {
  const t = createSim(SEED, undefined, { scene: 'town' }); for (const i of [0, 2]) { t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  const s = createSim(SEED, undefined, { scene: 'overland', region: 'tidemark' });
  s.state.created = true; if (story) s.state.quests.ch4_low_water = { st: QS.DONE, step: 0, n: [] };
  s.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  s.state.party.forEach((m, i) => { m.cls = ['fighter', 'rogue', 'cleric'][i]; m.level = level; m.xp = 0; m.attrs = null; attrs.autoAllocate(m); m.gear = items.starterKit(m); m.fallen = false; m.down = false; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; if (i) { m.perks = []; m.hidden = null; } });
  const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y - C.reach - 4;
  return s;
}
const enter = (s, id = ID) => { s.commands.push({ type: 'ringOpen', window: id, left: GRACE.window }); s.tick(); const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y - C.reach + 2; s.tick(); s.tick(); };

test('her window is the top of the hour, as the Kingstone\'s, told apart by its tag; a save keeps it', () => {
  const at = (h, m) => ({ y: 2026, mo: 11, d: 26, h, m, s: 0 });
  assert.deepEqual(windowAt(at(14, 1), GRACE), { id: ID, open: true, left: 840, soon: false, until: 0 });
  assert.equal(windowAt(at(14, 1), RING).id, '2026-11-26T14');
  assert.ok(isWindowId(ID) && !isWindowId('2026-11-26T14:00h') && !isWindowId('2026-11-26T14g'));
  assert.equal(ringForId(ID), GRACE); assert.equal(ringForId('2026-11-26T14'), RING);
  assert.equal(ringByCamp('tide_wreckers'), GRACE); assert.equal(RINGS.the_grace, GRACE);
  assert.deepEqual(restoreRing({ paid: [ID, '2026-11-26T14'], won: 1, best: 200 }).paid, [ID, '2026-11-26T14']);
  assert.equal(GRACE.heirloom, 'until_recalled'); assert.equal(items.HEIRLOOMS.until_recalled.name, 'Until Recalled');
});

test('the wreckers\' beach is open ground on the Tidemark\'s overland', () => {
  const s = createSim(SEED, undefined, { scene: 'overland', region: 'tidemark' });
  let open = 0, all = 0;
  for (let dy = -C.reach; dy <= C.reach; dy++) for (let dx = -C.reach; dx <= C.reach; dx++) { if (dx * dx + dy * dy > C.reach * C.reach) continue; all++; if (isWalkable(s.world, C.x + dx + 0.5, C.y + dy + 0.5)) open++; }
  assert.ok(open / all > 0.75, `${Math.round((open / all) * 100)} % open`);
});

test('she comes in at her hour and fights at 45; not under 40, not before Low Water, not in the Kingstone\'s window', () => {
  const s = company(); enter(s);
  assert.ok(s.battle && s.battle.ring, 'her fight'); assert.equal(s.battle.ring.cfg, GRACE);
  const k = s.world.enemies.find((e) => e.id === s.battle.ring.boss); assert.equal(k.kind, 'the_grace'); assert.equal(k.lvl, 45);
  const f = company(); enter(f, '2026-11-26T14');
  assert.ok(!(f.battle && f.battle.ring), 'the hour without the tag is the Fens\'');
  const lo = company(36), said = []; lo.bus.on('refused', (e) => said.push(e.reason)); enter(lo);
  assert.ok(!(lo.battle && lo.battle.ring)); assert.ok(said.some((r) => /Grace/.test(r) && /40/.test(r)), said.join(' | '));
  const early = company(45, false); enter(early);
  assert.ok(!(early.battle && early.battle.ring), 'before Low Water the beach keeps its wreckers');
});

test('the broadside: lanes from the sea toward the companies, landing as told; then her boarders come up the sand', () => {
  const s = company(); enter(s);
  const tells = [], landed = [], said = []; s.bus.on('tell', (e) => { if (e.sea) tells.push(e); }); s.bus.on('tellLand', (e) => { if (e.kind === 'gaze') landed.push(e); });
  s.bus.on('ring', (e) => said.push(e.t));
  for (let i = 0; i < 20 * 25 && !said.includes('boarders'); i++) s.tick();
  assert.ok(tells.length >= 1, `${tells.length} broadside tells`);
  assert.ok(tells.every((e) => e.lane === GRACE.broadside.lane && Math.abs(e.wind - GRACE.broadside.wind) < 0.06));
  const R = s.battle.ring; assert.ok(tells.every((e) => Math.hypot(e.x - R.cx, e.y - R.cy) > R.R), 'fired from past the arena\'s edge: the sea');
  assert.ok(landed.length >= 1); assert.ok(said.includes('broadside') && said.includes('boarders'));
  const up = s.world.enemies.filter((e) => e.boarder); assert.ok(up.length >= 1 && up.length <= GRACE.boarders.max);
  assert.ok(up.every((e) => e.kind === 'sailor' && e.xp === 0), 'her crew pays nothing: the window pays by tier');
  assert.ok(GRACE.broadside.wind * 4.5 > GRACE.broadside.lane, 'a member at a walk clears half a lane in its wind');
  const t = { x: 0, y: 0, r: GRACE.broadside.len, dir: 0, lane: GRACE.broadside.lane }; assert.ok(inTell(t, 20, 0.9) && !inTell(t, 20, 1.1));
});
