// Chests are a find (GDD §8, 2026-10-01): about one a floor, never none on a floor that drew any (the Tithe
// Mill's single floor holds Brannoc's paymaster's coin); every chest gives gold, and says what else it
// held, or that it held no gear; an opened chest stays where it was (drawn open), out of the way.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { propAt } from '../src/sim/world.js';
import { hasFloorBelow } from '../src/sim/sites.js';
import { DROP } from '../src/sim/loot.js';

function floors(n = 12) {
  const out = [];
  for (const site of ['barrows', 'tithe_mill', 'wickham_keep', 'sunken_chapel']) for (let i = 1; i <= n; i++) for (const depth of [0, 1, 2]) {
    if (depth && !hasFloorBelow(site, depth - 1)) continue;
    const s = createSim(i * 7919, undefined, { scene: 'dungeon', site }); if (depth) s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), depth, floors: [] });
    out.push({ site, s, chests: [...s.world.props].filter(([, k]) => k === 'chest').map(([k]) => k) });
  }
  return out;
}

test('about one chest a floor (it was about three); the Tithe Mill never has none', () => {
  const all = floors(), avg = (a) => a.reduce((x, y) => x + y.chests.length, 0) / a.length;
  const vale = all.filter((f) => f.site !== 'sunken_chapel');
  assert.ok(avg(vale) >= 0.9 && avg(vale) <= 1.6, `${avg(vale).toFixed(2)} a floor in the Barrows, the Mill and the Keep`);
  assert.ok(all.filter((f) => f.site === 'tithe_mill').every((f) => f.chests.length >= 1), 'every Tithe Mill floor has a chest');
});

test('a chest gives gold, every time, and says what else it held (or that it held no gear); it stays where it was, opened', () => {
  let seen = 0, gear = 0;
  for (const f of floors(6)) for (const k of f.chests) {
    const s = f.s, [x, y] = k.split(',').map(Number), p = s.state.player, ev = [];
    s.bus.on('chestOpened', (e) => ev.push(e));
    p.x = p.px = x + 1.5; p.y = p.py = y + 0.5; const g = s.state.counters.gold;
    s.commands.push({ type: 'harvest', tx: x, ty: y }); s.tick();
    if (!ev.length) continue;                                  // (out of reach where it stands: the walk's a different test)
    seen++; const e = ev[0]; if (e.item) gear++;
    assert.ok(e.gold > 0 && s.state.counters.gold === g + e.gold, `${e.gold} gold`);
    assert.ok(e.item === null || (typeof e.item.name === 'string' && e.item.r), JSON.stringify(e.item));
    assert.equal(s.world.props.get(k), 'chest', 'still there, to be drawn open'); assert.equal(propAt(s.world, x, y), null, 'and out of the way');
  }
  assert.ok(seen >= 20, `${seen} chests opened`);
  assert.ok(gear >= 1 && gear < seen, `${gear} of ${seen} held gear`);
  assert.equal(DROP.chest.chance, 0.15);
});
