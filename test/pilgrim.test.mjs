// The First Pilgrim (GDD v1.147, sim/ring.js PILGRIM; the owner, 2026-11-24: "New overworld boss for the heights..
// Appears at the bottom of every hour"): the Pale Heights' region boss, at half past as Furnace Nine is, at the head of
// the Pilgrims' Stair under the Lip (camps.js heights_lip). His own blow is the gaze: two lanes from his feet to the two
// furthest of the companies, filling till they burn. His window's id carries a tag (':30p') so it's never Furnace Nine's.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { CAMP_BY } from '../src/sim/camps.js';
import { statsFor } from '../src/sim/party.js';
import * as items from '../src/sim/items.js';
import * as attrs from '../src/sim/attributes.js';
import { inTell } from '../src/sim/hazards.js';
import { isWalkable } from '../src/sim/world.js';
import { FURNACE, PILGRIM, RINGS, isWindowId, windowAt, ringForId, ringByCamp } from '../src/sim/ring.js';

const SEED = 20261124, C = CAMP_BY[PILGRIM.camp], ID = '2026-11-16T14:30p';
/** the right party at `level` on the Heights' overland, south of the Lip's arena */
function company(level = 75) {
  const t = createSim(SEED, undefined, { scene: 'town' }); for (const i of [0, 2]) { t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  const s = createSim(SEED, undefined, { scene: 'overland', region: 'heights' });
  s.state.created = true;
  s.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  s.state.party.forEach((m, i) => { m.cls = ['fighter', 'rogue', 'cleric'][i]; m.level = level; m.xp = 0; m.attrs = null; attrs.autoAllocate(m); m.gear = items.starterKit(m); m.fallen = false; m.down = false; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; if (i) { m.perks = []; m.hidden = null; } });
  const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y + C.reach + 4;
  return s;
}
const enter = (s, id = ID) => { s.commands.push({ type: 'ringOpen', window: id, left: PILGRIM.window }); s.tick(); const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y + C.reach - 2; s.tick(); s.tick(); };

test('his window is the half hour, as Furnace Nine\'s, told apart by its tag', () => {
  const at = (h, m) => ({ y: 2026, mo: 11, d: 16, h, m, s: 0 });
  assert.deepEqual(windowAt(at(14, 31), PILGRIM), { id: ID, open: true, left: 840, soon: false, until: 0 });
  assert.equal(windowAt(at(14, 31), FURNACE).id, '2026-11-16T14:30');
  assert.ok(isWindowId(ID) && !isWindowId('2026-11-16T14:30q') && !isWindowId('2026-11-16T14p'));
  assert.equal(ringForId(ID), PILGRIM); assert.equal(ringForId('2026-11-16T14:30'), FURNACE);
  assert.equal(ringByCamp('heights_lip'), PILGRIM); assert.equal(RINGS.first_pilgrim, PILGRIM);
  assert.equal(PILGRIM.heirloom, 'first_light'); assert.equal(items.HEIRLOOMS.first_light.name, 'First Light');
});

test('the Lip\'s arena is open ground on the Heights\' overland', () => {
  const s = createSim(SEED, undefined, { scene: 'overland', region: 'heights' });
  let open = 0, all = 0;
  for (let dy = -C.reach; dy <= C.reach; dy++) for (let dx = -C.reach; dx <= C.reach; dx++) { if (dx * dx + dy * dy > C.reach * C.reach) continue; all++; if (isWalkable(s.world, C.x + dx + 0.5, C.y + dy + 0.5)) open++; }
  assert.ok(open / all > 0.75, `${Math.round((open / all) * 100)} % open`);
});

test('he stands at the Lip in his window and fights at 75; Furnace Nine\'s window does nothing here', () => {
  const s = company(); enter(s);
  assert.ok(s.battle && s.battle.ring, 'his fight'); assert.equal(s.battle.ring.cfg, PILGRIM);
  const k = s.world.enemies.find((e) => e.id === s.battle.ring.boss);
  assert.equal(k.kind, 'first_pilgrim'); assert.equal(k.lvl, 75);
  const f = company(); enter(f, '2026-11-16T14:30');
  assert.ok(!(f.battle && f.battle.ring), 'the half hour without the tag is the Reach\'s');
  const lo = company(60), said = []; lo.bus.on('refused', (e) => said.push(e.reason)); enter(lo);
  assert.ok(!(lo.battle && lo.battle.ring)); assert.ok(said.some((r) => /First Pilgrim/.test(r) && /61/.test(r)), said.join(' | '));
});

test('a lane tell: along its line and inside its width, not behind its start or past its end', () => {
  const t = { x: 0, y: 0, r: 10, dir: 0, lane: 2 };
  assert.ok(inTell(t, 5, 0.9)); assert.ok(!inTell(t, 5, 1.1)); assert.ok(!inTell(t, -0.5, 0)); assert.ok(!inTell(t, 10.5, 0));
  const u = { ...t, dir: Math.PI / 2 }; assert.ok(inTell(u, 0.2, 6)); assert.ok(!inTell(u, 6, 0.2));
});

test('the gaze: two lanes to the two furthest, landing as told, hurting whoever stays in them', () => {
  const s = company(); enter(s);
  const tells = [], landed = []; s.bus.on('tell', (e) => { if (e.kind === 'gaze') tells.push(e); }); s.bus.on('tellLand', (e) => { if (e.kind === 'gaze') landed.push(e); });
  for (let i = 0; i < 20 * 30 && landed.length < 2; i++) s.tick();
  assert.equal(tells.length >= 2, true, `${tells.length} gaze tells`);
  assert.ok(tells.every((e) => e.lane === PILGRIM.gaze.lane && Math.abs(e.wind - PILGRIM.gaze.wind) < 0.06));
  assert.ok(landed.length >= 2);
  assert.ok(PILGRIM.gaze.wind * 4.5 > PILGRIM.gaze.lane, 'a member at a walk (4.5 tiles/s) clears half a lane in its wind');
});
