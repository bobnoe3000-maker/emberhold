// Bosses (M5, docs/m5-plan.md §3): a floor's stairs-down hall opens with its boss; each has one
// signature mechanic; once the boss falls the room goes quiet for the visit; a story boss falls for
// good (the save keeps it), the Standard comes back every visit; a first fall leaves its heirloom.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { BOSSES, halved } from '../src/sim/battle.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const down = (sim) => { const t = sim.world.stairsAt, p = sim.state.player; p.x = p.px = t.x + 0.5; p.y = p.py = t.y + 1.5; sim.commands.push({ type: 'harvest', tx: t.x, ty: t.y }); sim.tick(); };
const intoHall = (sim) => {
  const L = sim.world.level, r = L.descentRoom, S = sim.world.stairwell, p = sim.state.player; let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); if (S && x >= S.x0 - 1 && x <= S.x1 && y >= S.y0 - 1 && y <= S.y1) continue; const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5; sim.state.party.forEach((m, i) => { if (i) { m.x = m.px = p.x + (i === 1 ? -0.9 : 0.9); m.y = m.py = p.y + 0.9; } });   // (the company walks in together)
};
// a strong party (so the fight ends), kept on its feet: this measures the rules, not the balance
function party(sim, lv = 12) {
  const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [0, 2]);
  sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  for (const m of sim.state.party) { m.level = lv; m.hp = statsFor(m).maxHp; }
}
function fight(sim, until, secs = 240) {
  for (let i = 0; i < secs * 20 && !until(); i++) { for (const m of sim.state.party) if (!m.down) m.hp = Math.max(m.hp, statsFor(m).maxHp * 0.6); sim.tick(); }
}

test('Wickham Keep: Captain Garrow opens his hall, calls his men twice, falls once and for good', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'wickham_keep' }); party(sim); sim.tick();
  down(sim); assert.equal(sim.state.depth, 1); assert.ok(!sim.world.stairsAt, 'the last floor: no way down');
  const ev = []; for (const k of ['bossWave', 'bossCall', 'bossDown', 'loot']) sim.bus.on(k, (e) => ev.push([k, e]));
  intoHall(sim); fight(sim, () => ev.some(([k]) => k === 'bossDown'));
  assert.deepEqual(ev.filter(([k]) => k === 'bossWave').map(([, e]) => e.id), ['redhand_captain']);
  assert.equal(ev.filter(([k]) => k === 'bossCall').length, 2, 'he calls his men at 2/3 and 1/3');
  const bd = ev.find(([k]) => k === 'bossDown')[1]; assert.equal(bd.id, 'redhand_captain'); assert.ok(bd.first);
  assert.ok(sim.state.bag.some((it) => it.name === "Garrow's Due" && it.r === 'heirloom'), 'his heirloom');
  assert.ok(ev.some(([k, e]) => k === 'loot' && e.src === 'boss' && !e.heirloom && e.item.r !== 'common'), 'and a boss drop, Fine or better');
  // the room goes quiet: no more waves this visit
  const waves = sim.battle.wave; fight(sim, () => false, 30); assert.ok(!sim.battle || sim.battle.wave === waves, 'quiet');
  assert.equal(sim.state.bosses.redhand_captain, 1);
  // a new visit: his hall fights as any other (he fell for good), and a reload keeps that
  const back = createSim(1); back.restore(JSON.parse(JSON.stringify(sim.snapshot()))); assert.equal(back.state.bosses.redhand_captain, 1);
  const again = createSim(SEED, undefined, { scene: 'dungeon', site: 'wickham_keep' }); again.restore(JSON.parse(JSON.stringify(sim.snapshot())));
  let spawned = false; again.bus.on('bossWave', () => { spawned = true; });
  const p = again.state.player, a = again.world.level.entrance; p.x = p.px = a.cx + 0.5; p.y = p.py = a.cy + 0.5; again.tick();
  intoHall(again); fight(again, () => again.battle && again.battle.wave >= 2, 60);
  assert.ok(!spawned, 'no Garrow the second time');
});

test('half damage: Garrow while his called men stand; the Ashbound near a standing Standard', () => {
  const g = { id: 1, boss: 'redhand_captain', guards: [2, 3], hp: 100, x: 0, y: 0 }, m1 = { id: 2, hp: 10, x: 1, y: 0 }, m2 = { id: 3, hp: 0, dead: 1, x: 1, y: 1 };
  assert.ok(halved(g, [g, m1, m2]), 'one of his men still stands'); m1.hp = 0;
  assert.ok(!halved(g, [g, m1, m2]), 'both down: full damage');
  const std = { id: 9, boss: 'standard', undead: true, hp: 50, x: 0, y: 0 }, near = { id: 10, undead: true, hp: 5, x: 3, y: 0 }, far = { id: 11, undead: true, hp: 5, x: 6, y: 0 }, man = { id: 12, undead: false, hp: 5, x: 1, y: 0 };
  assert.ok(halved(near, [std, near]) && !halved(far, [std, far]) && !halved(man, [std, man]) && !halved(std, [std]), 'the line holds for the Ashbound close by, not for itself');
  std.hp = 0; assert.ok(!halved(near, [std, near]), 'the Standard down: the line breaks');
});

test('the Standard comes back every visit; the Stranger kindles the slain', () => {
  assert.ok(!BOSSES.standard.once && BOSSES.redhand_captain.once && BOSSES.robed_stranger.once);
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'sunken_chapel' }); party(sim); sim.tick(); down(sim);
  const ev = []; for (const k of ['bossWave', 'bossKindle', 'bossDown']) sim.bus.on(k, (e) => ev.push(k));
  intoHall(sim); fight(sim, () => ev.includes('bossDown'), 300);
  assert.ok(ev.includes('bossWave') && ev.includes('bossDown'));
  assert.ok(ev.includes('bossKindle'), 'the fallen rose again at least once');
});
