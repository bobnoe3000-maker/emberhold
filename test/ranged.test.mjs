// Ranged party members hold a stand-off (battle.js `ranged`, 2026-10-03): a bow rogue spent 26–29 % of a level-6
// fight within 3.5 tiles of a foe and a mage companion 18 %, backing off only once a foe was nearly in reach. Now
// they keep clear of every foe and shoot from near their range.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { starterKit, makeItem } from '../src/sim/items.js';

// the room-level harness's setup (tools/balance/roomlv.mjs): a fighter hero, a rogue with a hunting bow and a mage
// hired, all at level 6, in a level-6 room
function fight(secs) {
  const seed = 20260807, t = createSim(seed, undefined, { scene: 'town' });
  for (const i of [1, 3]) { t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  const sim = createSim(seed, undefined, { scene: 'dungeon' }); sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1 };
  sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m, perks: [], hidden: null })));
  sim.state.party[2].cls = 'mage';
  for (const m of sim.state.party) {
    m.level = 6; m.attrs = null; autoAllocate(m); m.gear = starterKit(m);
    if (m.cls === 'rogue') { m.gear.weapon = makeItem('huntbow', 6, 'common', { uid: m.id + ':bow' }); m.gear.off = null; }
    m.hp = statsFor(m).maxHp; m.mp = undefined;
  }
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, 6);
  let best = null, bd = 1e9; for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number), d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  const close = {}, n = {}, shots = {};
  sim.bus.on('combat', (c) => { if (c.t === 'shot' || c.t === 'bolt') shots[c.src] = (shots[c.src] || 0) + 1; });
  for (let i = 0; i < 20 * secs; i++) {
    sim.tick();
    const foes = sim.world.enemies.filter((e) => e.hp > 0 && !e.dead && !(e.spawn > 0)); if (!foes.length) continue;
    for (const m of sim.state.party.slice(1)) {
      if (m.down || m.fallen) continue;
      const d = Math.min(...foes.map((e) => Math.hypot(e.x - m.x, e.y - m.y)));
      n[m.cls] = (n[m.cls] || 0) + 1; if (d < 3.5) close[m.cls] = (close[m.cls] || 0) + 1;
    }
  }
  return { rogue: (close.rogue || 0) / n.rogue, mage: (close.mage || 0) / n.mage, sim };
}

test('a bow rogue and a mage keep clear of the foes: within 3.5 tiles under 10 % of a level-6 fight', () => {
  const f = fight(120);
  assert.ok(f.rogue < 0.1, `the bow rogue ${(f.rogue * 100).toFixed(0)} % of the fight within 3.5 tiles`);
  assert.ok(f.mage < 0.1, `the mage ${(f.mage * 100).toFixed(0)} %`);
  assert.ok(f.sim.state.party.every((m) => !m.fallen), 'and nobody Fallen');
});
