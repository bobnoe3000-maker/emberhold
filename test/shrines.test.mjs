// Shrines (GDD §3.6, 2026-10-01): one use each. A shrine raises the first of the Fallen at half health,
// or mends everyone standing (HP and MP), and says which. With nobody Fallen and everyone whole it isn't
// spent: it keeps its light for later and says so (a tap at full health used to spend it for nothing).
// A fragment written on a shrine is read at the first touch either way. A spent shrine stays on the
// floor (drawn dark), out of the way.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { propAt } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';

const SEED = 20260807;
function nearShrine(site = 'barrows', depth = 0) {
  const s = createSim(SEED, undefined, { scene: 'dungeon', site }); if (depth) s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), depth, floors: [] });
  const key = [...s.world.props].find(([, v]) => v === 'shrine')[0], [x, y] = key.split(',').map(Number), p = s.state.player;
  p.x = p.px = x + 1.5; p.y = p.py = y + 0.5;
  const ev = []; s.bus.on('shrine', (e) => ev.push(e));
  const touch = () => { s.commands.push({ type: 'harvest', tx: x, ty: y }); s.tick(); };
  const whole = () => { for (const m of s.state.party) { const st = statsFor(m); m.hp = st.maxHp; m.mp = st.maxMp; m.fallen = false; m.down = false; } };
  return { s, key, x, y, ev, touch, whole };
}

test('everyone whole: the shrine keeps its light, and says so', () => {
  const { s, key, x, y, ev, touch, whole } = nearShrine();
  whole(); touch();
  assert.deepEqual(ev.map((e) => e.did), ['none']);
  assert.equal(propAt(s.world, x, y), 'shrine', 'still there to use'); assert.ok(!s.world.mods.get(key));
});

test('someone hurt: it mends everyone standing, HP and MP, and is spent (drawn, out of the way)', () => {
  const { s, key, x, y, ev, touch, whole } = nearShrine();
  whole(); const h = s.state.party[0]; h.hp = 5; touch();
  assert.deepEqual(ev.map((e) => e.did), ['mended']);
  assert.equal(h.hp, statsFor(h).maxHp);
  assert.equal(propAt(s.world, x, y), null); assert.equal(s.world.props.get(key), 'shrine', 'spent, still on the floor');
  touch(); assert.equal(ev.length, 1, 'once');
});

test('one of the Fallen: it raises them at half health, by name', () => {
  const { s, ev, touch, whole } = nearShrine();
  s.state.party.push({ ...JSON.parse(JSON.stringify(s.state.party[0])), id: 'tam', name: 'Tam', main: false }); whole();   // (no tavern down here)
  const m = s.state.party[1]; m.fallen = true; m.hp = 0; touch();
  assert.equal(ev[0].did, 'raised'); assert.equal(ev[0].name, m.name);
  assert.ok(!m.fallen && Math.abs(m.hp - Math.round(statsFor(m).maxHp * 0.5)) <= 1, `${m.hp} of ${statsFor(m).maxHp}`);
});

test('a fragment on a shrine is read at the first touch, even at full health (the shrine kept)', () => {
  const s = createSim(SEED, undefined, { scene: 'dungeon', site: 'barrows' }); s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), depth: 1, floors: [] });
  const h = s.lore.holder('frag_vale_muster_roll'); assert.equal(h.via, 'shrine', 'this seed\'s second floor has its shrine');
  const [x, y] = h.key.split(',').map(Number), p = s.state.player, found = [];
  s.bus.on('fragmentFound', (e) => found.push(e.id));
  for (const m of s.state.party) { const st = statsFor(m); m.hp = st.maxHp; m.mp = st.maxMp; }
  p.x = p.px = x + 1.5; p.y = p.py = y + 0.5; s.commands.push({ type: 'harvest', tx: x, ty: y }); s.tick();
  assert.deepEqual(found, ['frag_vale_muster_roll']); assert.equal(propAt(s.world, x, y), 'shrine');
});
