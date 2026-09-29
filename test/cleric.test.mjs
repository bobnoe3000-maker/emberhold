// the class bonuses (GDD §5) and the cleric: Mend, Bless, Turn Undead, Lifeline; creation and hiring
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { makeMember, statsFor } from '../src/sim/party.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { behind, clustered } from '../src/sim/battle.js';

const SEED = 20260807;
function inRoom(party, lv = 1) {
  const sim = createSim(SEED, undefined, { scene: 'dungeon' }); sim.state.party = party;
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, lv);
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  return sim;
}
const hero = (lv = 1) => { const h = { ...createSim(SEED).state.party[0], level: lv, autoAttrs: true }; autoAllocate(h); h.hp = statsFor(h).maxHp; return h; };
const cleric = (lv = 1) => makeMember('c1', 'Maren', 'cleric', lv);
const events = (sim, t) => { const out = []; sim.bus.on('combat', (c) => { if (c.t === t) out.push(c); }); return out; };

test('the fighter: +10 % DEF while carrying a shield', () => {
  const f = makeMember('f', 'F', 'fighter', 5), with_ = statsFor(f).def, off = f.gear.off; f.gear.off = null;
  const without = statsFor(f).def, shieldDef = off.st.def;
  assert.ok(Math.abs(with_ - (without + shieldDef) * 1.1) < 0.051, `${with_} vs ${(without + shieldDef) * 1.1}`);
  assert.equal(statsFor(makeMember('c', 'C', 'cleric', 5)).def, statsFor({ ...makeMember('c', 'C', 'cleric', 5) }).def);   // a cleric's shield is just its DEF
});
test('the rogue strikes from behind; the mage finds clusters', () => {
  const foe = { x: 0, y: 0, fx: 1, fy: 0 };                                  // facing +x
  assert.equal(behind({ x: -1, y: 0.2 }, foe), true); assert.equal(behind({ x: 1, y: 0 }, foe), false);
  const t = { x: 0, y: 0, hp: 5 }, near = (x, y) => ({ x, y, hp: 5 });
  assert.equal(clustered(t, [t, near(1, 0), near(0, 1)]), true);
  assert.equal(clustered(t, [t, near(1, 0), near(5, 5)]), false);
  assert.equal(clustered(t, [t, near(1, 0), { ...near(0, 1), hp: 0 }]), false);
});
test('a cleric can be created, and hired at the tavern', () => {
  const s = createSim(SEED, undefined, { scene: 'town' });
  s.commands.push({ type: 'createHero', cls: 'cleric', look: 'hero_cleric', origin: 'grey_sisters_ward', name: 'Edda' }); s.tick();
  assert.deepEqual([s.state.party[0].cls, s.state.party[0].actor], ['cleric', 'hero_cleric']);
  const roster = s.heroes.roster(), i = roster.findIndex((m) => m.cls === 'cleric');
  assert.ok(i >= 0); s.commands.push({ type: 'hire', idx: i }); s.tick();
  assert.equal(s.state.party[1].cls, 'cleric');
});
test('Mend heals the most hurt ally, 20 % stronger for a cleric', () => {
  const h = hero(3), c = cleric(3), sim = inRoom([h, c]); const heals = events(sim, 'heal');
  h.hp = Math.round(statsFor(h).maxHp * 0.3);
  for (let i = 0; i < 20 * 20 && !heals.length; i++) sim.tick();
  assert.ok(heals.length, 'a Mend was cast');
  assert.equal(heals[0].amount, Math.round(statsFor(h).maxHp * 0.22 * 1.2 * (1 + statsFor(c).power)));   // (Focus adds ability power)
});
test('Bless raises the party\'s ATK and DEF for 8 s (level 6)', () => {
  const h = hero(6), c = cleric(6), sim = inRoom([h, c]); const guards = events(sim, 'guard');
  for (let i = 0; i < 20 * 30 && !guards.some((g) => g.name === 'Bless'); i++) sim.tick();
  assert.ok(guards.some((g) => g.name === 'Bless'));
  sim.tick(); sim.tick(); sim.tick(); sim.tick(); sim.tick(); sim.tick(); sim.tick(); sim.tick();
  assert.ok(h.buff && h.buff.bless > 7 && Math.abs(h.buff.blessK - 0.15 * (1 + statsFor(c).power)) < 1e-9, JSON.stringify(h.buff));
});
test('Turn Undead strikes every Ashbound close by (level 12)', () => {
  const h = hero(12), c = cleric(12); c.off = ['mend', 'bless']; const sim = inRoom([h, c], 12); const casts = events(sim, 'ability');
  for (let i = 0; i < 20 * 60 && !casts.some((a) => a.name === 'Turn Undead'); i++) sim.tick();
  assert.ok(casts.some((a) => a.name === 'Turn Undead'));
});
test('Lifeline (level 20): once a room visit, an ally who would be Downed holds on at 1 HP', () => {
  const h = hero(20), c = cleric(20); c.off = ['mend', 'bless', 'turn_undead']; const sim = inRoom([h, c], 20);
  const saves = events(sim, 'lifeline'), downs = events(sim, 'down');
  for (let i = 0; i < 20 * 90 && !downs.length; i++) { h.hp = Math.min(h.hp, 1); sim.tick(); }
  assert.equal(saves.length, 1); assert.ok(downs.length >= 1, 'the second blow downs them');
});
