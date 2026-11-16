// Furnace Nine (GDD v1.126, sim/ring.js FURNACE; the owner: "Furnace Nine at 30 after on the hour"): the Cinder Reach's
// region boss, the Kingstone's event a half hour on, at the Vault's mouth (camps.js reach_mouth). It burns only once the
// company has broken it (the Stoker's lamp); it feeds on the fallen; it pays its own heirloom, Quota. And the level-24
// trials' migration (save v52).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { CAMP_BY } from '../src/sim/camps.js';
import { statsFor } from '../src/sim/party.js';
import * as items from '../src/sim/items.js';
import * as attrs from '../src/sim/attributes.js';
import { RING, FURNACE, RINGS, isWindowId, windowAt, ringForId, ringByCamp } from '../src/sim/ring.js';
import { trials24For, migrate, SAVE_VERSION } from '../src/persist/save.js';

const SEED = 20261115, C = CAMP_BY[FURNACE.camp];
/** the right party at `level` in the Reach, `at` tiles south of the mouth's middle; the lamp broken or not */
function company(level = 30, broken = true, at = C.reach + 4) {
  const t = createSim(SEED, undefined, { scene: 'town' }); for (const i of [0, 2]) { t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  const s = createSim(SEED, undefined, { scene: 'overland', region: 'reach' });
  s.state.created = true; if (broken) s.state.lampsBroken = ['furnace_nine'];
  s.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  s.state.party.forEach((m, i) => { m.cls = ['fighter', 'rogue', 'cleric'][i]; m.level = level; m.xp = 0; m.attrs = null; attrs.autoAllocate(m); m.gear = items.starterKit(m); m.fallen = false; m.down = false; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; if (i) { m.perks = []; m.hidden = null; } });
  const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y + at;
  return s;
}
const ID = '2026-11-16T14:30';
const enter = (s, id = ID) => { s.commands.push({ type: 'ringOpen', window: id, left: FURNACE.window }); s.tick(); const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y + C.reach - 2; s.tick(); s.tick(); };

test('its window is the half hour: open from :30 for 15 minutes, its id ending :30; the Kingstone\'s stays the hour\'s top', () => {
  const at = (h, m, s = 0) => ({ y: 2026, mo: 11, d: 16, h, m, s });
  assert.deepEqual(windowAt(at(14, 31), FURNACE), { id: '2026-11-16T14:30', open: true, left: 840, soon: false, until: 0 });
  assert.equal(windowAt(at(14, 46), FURNACE).open, false);
  const before = windowAt(at(14, 22), FURNACE); assert.equal(before.id, '2026-11-16T14:30'); assert.equal(before.soon, true); assert.equal(before.until, 480);
  assert.equal(windowAt(at(14, 10), FURNACE).soon, false);
  assert.equal(windowAt(at(14, 5)).id, '2026-11-16T14');   // (the Kingstone's, as it was)
  assert.equal(windowAt(at(14, 5)).open, true); assert.equal(windowAt(at(14, 5), FURNACE).open, false, 'never both at once');
  assert.ok(isWindowId(ID) && isWindowId('2026-11-16T14') && !isWindowId('2026-11-16T14:15'));
  assert.equal(ringForId(ID), FURNACE); assert.equal(ringForId('2026-11-16T14'), RING);
  assert.equal(ringByCamp('reach_mouth'), FURNACE); assert.equal(ringByCamp('fens_stones'), RING); assert.equal(ringByCamp('reach_den'), null);
  assert.deepEqual(Object.keys(RINGS), ['kingstone', 'furnace_nine']);
});

test('it burns only once broken: before, the mouth is its furnace-priests\' fight; after, Furnace Nine\'s, at level 30', () => {
  const s0 = company(30, false); enter(s0);
  assert.ok(s0.battle && !s0.battle.ring, 'unbroken: the camp fights as a camp');
  assert.ok(s0.world.enemies.every((e) => e.kind !== 'furnace_nine'));
  const s = company(30, true), ev = []; s.bus.on('ringStarted', (e) => ev.push(e));
  s.commands.push({ type: 'ringOpen', window: ID, left: FURNACE.window }); s.tick();
  assert.ok(s.world.enemies.some((e) => e.idle === 'reach_mouth' && e.kind === 'furnace_nine'), 'it stands at the mouth before you walk in');
  const p = s.state.player; p.x = p.px = C.x + 0.5; p.y = p.py = C.y + C.reach - 2; s.tick(); s.tick();
  assert.ok(s.battle && s.battle.ring, 'its fight'); assert.equal(s.battle.ring.cfg, FURNACE); assert.equal(ev.length, 1);
  const k = s.world.enemies.find((e) => e.id === s.battle.ring.boss);
  assert.equal(k.kind, 'furnace_nine'); assert.equal(k.boss, 'furnace_nine'); assert.equal(k.lvl, 30);
  assert.ok(s.state.party.every((m) => m.level === 30));
});

test('under 25 it doesn\'t stir; a Kingstone window does nothing at the mouth', () => {
  const lo = company(24); const said = []; lo.bus.on('refused', (e) => said.push(e.reason)); enter(lo);
  assert.ok(!(lo.battle && lo.battle.ring)); assert.ok(said.some((r) => /Furnace Nine/.test(r) && /25/.test(r)), said.join(' | '));
  const s = company(30); enter(s, '2026-11-16T14');
  assert.ok(!(s.battle && s.battle.ring), 'the hour\'s top is the Kingstone\'s, in the Fens');
});

test('it feeds on the fallen: one who gets up at the edge, not raised, gives it its share back', () => {
  const s = company(30); enter(s);
  const R = s.battle.ring, k = s.world.enemies.find((e) => e.id === R.boss), fed = []; s.bus.on('ring', (e) => { if (e.t === 'fed') fed.push(e); });
  k.hp = Math.round(k.maxHp * 0.5);
  const m = s.state.party[1]; m.x = k.x + (k.body || 0) + 1; m.y = k.y; m.hp = 0; m.down = true; m.downT = FURNACE.respawn - 0.01;
  const was = k.hp; s.tick();
  assert.equal(fed.length, 1, 'fed once'); assert.equal(fed[0].n, Math.round(k.maxHp * FURNACE.feeds));
  assert.ok(k.hp > was, `${was} → ${k.hp}`);
  assert.ok(!m.down, 'up at the edge');
});

test('the Kingstone doesn\'t feed', () => { assert.ok(!RING.feeds); assert.equal(FURNACE.heirloom, 'quota'); assert.ok(items.HEIRLOOMS.quota); });

test('save v52: a class anyone had at 24 keeps its level-24 trial; the rest as they were', () => {
  assert.equal(SAVE_VERSION, 52);
  const data = { trials: ['fighter', 'fighter12'], party: [{ cls: 'fighter', level: 26 }, { cls: 'cleric', level: 20 }], bench: [{ cls: 'rogue', level: 24 }] };
  assert.deepEqual(trials24For(data).trials, ['fighter', 'fighter12', 'fighter24', 'rogue24']);
  assert.deepEqual(trials24For({ party: [] }).trials, []);
  const s = createSim(SEED, undefined, { scene: 'town' }); const snap = JSON.parse(JSON.stringify(s.snapshot()));
  snap.party[0].level = 25; snap.trials = []; const m = migrate({ version: 51, savedAt: 1, data: snap });
  assert.equal(m.version, 52); assert.ok(m.data.trials.includes(snap.party[0].cls + '24'));
});
