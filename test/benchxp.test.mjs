// The bench earns no XP (GDD v1.80; the owner, 2026-11-12: "im getting notifications that companions not in my party
// (benched) are leveling up - they should not be"). Before, a benched companion took half of every kill's share and of
// every quest's; now only the party in the field gains, and a benched companion levels only on the road (expeditions,
// test/expeditions.test.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';

test('a fight pays the party and not the bench: no XP, no level-up for anyone benched', () => {
  const s = createSim(20260807, undefined, { scene: 'dungeon' }); s.state.created = true;
  const P = s.state.player, H = s.state.party[0], b = { ...JSON.parse(JSON.stringify(H)), id: 'bench-test', name: 'Benched', xp: 0 };
  s.state.bench = [b];
  const ups = []; s.bus.on('levelUp', (e) => ups.push(e.id));
  const xp0 = H.xp || 0, lv0 = H.level, L = s.world.level;
  const rooms = L.rooms.filter((r) => r !== L.entrance).sort((a, c) => Math.hypot(a.cx - P.x, a.cy - P.y) - Math.hypot(c.cx - P.x, c.cy - P.y));
  for (const r of rooms) { s.commands.push({ type: 'tap', tx: Math.floor(r.cx), ty: Math.floor(r.cy) }); for (let i = 0; i < 1200 && !s.battle; i++) s.tick(); if (s.battle) break; }
  assert.ok(s.battle, 'a fight began');
  for (let i = 0; i < 20 * 90 && (H.xp || 0) === xp0 && H.level === lv0; i++) s.tick();
  assert.ok((H.xp || 0) > xp0 || H.level > lv0, 'the party gained from the fight');
  assert.equal(b.xp, 0, 'the bench gained no XP');
  assert.ok(!ups.includes('bench-test'), 'no level-up for the bench');
});
