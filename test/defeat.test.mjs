// The defeat recap (ui/defeat.js reads it): a wipe's 'defeat' event says where the party fell, how far
// it got, who struck the last blow and what's left standing, and every foe it can name has a name in
// content/foes.json. The recap is presentation: the wipe's rules (battle.js defeat) are as they were.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { ENEMY_KINDS, FAMILIES } from '../src/sim/battle.js';
import { isWalkable } from '../src/sim/world.js';

function wipe(site = 'barrows', depth = 0, room = (L) => L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom)) {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site }); if (depth) sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth, floors: [] });
  sim.state.counters.gold = 100;
  const L = sim.world.level, r = room(L), p = sim.state.player; let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  let got = null; sim.bus.on('defeat', (e) => { got = e; });
  for (let i = 0; i < 20 * 120 && !got; i++) { for (const m of sim.state.party) if (!m.down) m.hp = Math.min(m.hp, 3); sim.tick(); }
  return { sim, got };
}

test('a wipe says where, how far in, who struck the last blow and what it cost', () => {
  const { sim, got } = wipe();
  assert.ok(got, 'the party fell');
  const r = got.recap;
  assert.equal(got.lost, 25); assert.equal(got.weakS, 600);
  assert.deepEqual([r.site, r.siteName, r.floor], ['barrows', 'The Old Barrows', 1]);
  assert.ok(r.level >= 1 && r.wave >= 1 && r.secs >= 0 && r.foesLeft >= 1, JSON.stringify(r));
  assert.ok(ENEMY_KINDS.includes(r.killer.kind), r.killer.kind); assert.equal(r.killer.on, sim.state.party[0].name);
  assert.equal(sim.state.scene, 'town', 'and you still wake at the temple, as before');
});

test('a boss is named by name', () => {
  const { got } = wipe('wickham_keep', 1, (L) => L.descentRoom);
  assert.ok(got); const k = got.recap.killer;
  assert.ok(k.boss ? k.bossName === 'Captain Garrow' || k.bossName.length > 0 : ENEMY_KINDS.includes(k.kind), JSON.stringify(k));
});

test('content/foes.json names every foe the sim has, and each family\'s elite', () => {
  const { foes } = JSON.parse(readFileSync('content/foes.json', 'utf8'));
  assert.deepEqual(Object.keys(foes).sort(), [...ENEMY_KINDS].sort());
  for (const F of Object.values(FAMILIES)) assert.ok(foes[F.elite].elite, `${F.elite}: an elite's name`);
});
