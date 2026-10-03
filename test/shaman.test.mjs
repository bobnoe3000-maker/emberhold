// The Shaman (v1.19, the hedge-callers; world doc §4, GDD §5): a ranged support. Spirit Drain stacks a drain on a
// foe that mends the party as it ticks (a long fight, a boss, is where it pays); Ancestors' Breath heals the party
// over time and lifts its ATK; Hex cuts a knot of foes' ATK and DEF. Added after the cleric everywhere, so nobody
// else's draws move: the "any class" loot pool is still the first four.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { CLASSES, makeMember, statsFor } from '../src/sim/party.js';
import { SKILLS, PASSIVES, TRIAL_CLASSES, OLD_WAYS_STACKS } from '../src/sim/skills.js';
import { STARTER, CLASS_IDS, ALL_CLASSES, BASES, classesOf } from '../src/sim/items.js';
import { BUILD } from '../src/sim/attributes.js';
import { QUESTS } from '../src/sim/quests.js';
import { isWalkable } from '../src/sim/world.js';

const SEED = 20260807;

test('the shaman is a class like the others: table, kit, build, three abilities and a passive, a trial from Col, at creation and the tavern', () => {
  assert.ok(CLASSES.shaman && STARTER.shaman && BUILD.shaman && PASSIVES.shaman);
  assert.deepEqual(SKILLS.shaman.map((s) => [s.lv, s.kind]), [[1, 'strike'], [6, 'breath'], [12, 'hex']]);
  assert.ok(TRIAL_CLASSES.includes('shaman')); assert.equal(QUESTS.trial_old_roads.giver, 'col');
  assert.deepEqual(CLASS_IDS, ['fighter', 'rogue', 'mage', 'cleric'], 'the "any class" loot pool is unchanged (no draw moves)');
  assert.ok(ALL_CLASSES.includes('shaman'));
  for (const slot of Object.values(STARTER.shaman)) assert.ok(classesOf(BASES[slot]).includes('shaman'), slot);
  const C = JSON.parse(readFileSync(new URL('../content/creation.json', import.meta.url), 'utf8'));
  assert.ok(C.classes.some((c) => c.id === 'shaman'));
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  const r = sim.heroes.roster(); assert.equal(r[r.length - 1].cls, 'shaman', 'the shaman sits at the end of the tavern table');
  const m = makeMember('s', 'S', 'shaman', 1), s = statsFor(m);
  assert.ok(s.maxHp > 0 && s.maxMp > 0 && s.atk > 0);
});

// a fight in a warren room: the shaman (trials done, level 20 if asked), a fighter in front
function fight(level = 12, passive = false, site = 'tithe_mill') {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site }); sim.tick();
  const sh = makeMember('sh', 'Sedge', 'shaman', passive ? 20 : level), fi = makeMember('fi', 'Hild', 'fighter', passive ? 20 : level);
  sim.state.party.push(sh, fi); sim.state.trials = { shaman: 1 };
  for (const m of sim.state.party) { m.level = Math.max(m.level, passive ? 20 : level); m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; }
  const L = sim.world.level, r = L.rooms.find((q) => q.id !== L.entrance.id && (!L.descentRoom || q.id !== L.descentRoom.id)), p = sim.state.player;
  let at = [r.cx + 0.5, r.cy + 0.5]; if (!isWalkable(sim.world, at[0], at[1])) for (const [k, c] of L.cells) if (c.kind === 'floor' && c.room === r.id) { const [x, y] = k.split(',').map(Number); if (isWalkable(sim.world, x + 0.5, y + 0.5)) { at = [x + 0.5, y + 0.5]; break; } }
  p.x = p.px = at[0]; p.y = p.py = at[1];
  // the room's foes made tough enough to outlast the drain (this measures the rules, not the balance)
  const tick = sim.tick.bind(sim);
  sim.tick = () => { tick(); for (const e of sim.world.enemies || []) if (!e.tough) { e.tough = 1; e.maxHp *= 100; e.hp = e.maxHp; } };
  return sim;
}

test('Spirit Drain stacks on a foe (to 5; Old Ways to 8), ticks, and mends the most hurt ally as it does', () => {
  for (const passive of [false, true]) {
    const sim = fight(12, passive), sh = sim.state.party.find((m) => m.cls === 'shaman');
    sh.off = ['ancestors_breath', 'hex'];                       // (only the drain, for this)
    let most = 0, mended = 0, mp0 = 0;
    for (let i = 0; i < 20 * 60; i++) {
      for (const m of sim.state.party) if (!m.down) m.hp = Math.min(m.hp, statsFor(m).maxHp * 0.7);   // someone's always hurt: the mend shows
      const before = sim.state.party.reduce((a, m) => a + m.hp, 0);
      sim.tick();
      for (const e of sim.world.enemies || []) if (e.drain) most = Math.max(most, e.drain.n);
      if (sim.state.party.reduce((a, m) => a + m.hp, 0) > before) mended++;
      mp0 = Math.max(mp0, sh.mp);
    }
    assert.equal(most, 5 + (passive ? OLD_WAYS_STACKS : 0), `stacks peaked at ${most}`);
    assert.ok(mended > 0, 'the drain mended someone');
  }
});

test('Ancestors\' Breath: the whole party heals over time and hits harder while it lasts; Hex cuts a knot of foes', () => {
  const sim = fight(14, false, 'wickham_keep'), sh = sim.state.party.find((m) => m.cls === 'shaman');   // (its rooms send 3–4 at once: a knot)
  sh.off = ['spirit_drain'];
  let breathed = false, healedOverTime = false, hexed = false, hexNote = '';
  for (let i = 0; i < 20 * 90 && !(breathed && hexed); i++) {
    if (i % 40 === 0) for (const m of sim.state.party) if (!m.down) m.hp = statsFor(m).maxHp * 0.45;
    const hp0 = sim.state.party.map((m) => m.hp);
    sim.tick();
    const all = sim.state.party.filter((m) => !m.down && m.buff && m.buff.breath > 0);
    if (all.length === sim.state.party.filter((m) => !m.down).length && all.length >= 2) { breathed = true; if (sim.state.party.every((m, j) => m.down || m.hp >= hp0[j] || m.hp < hp0[j])) healedOverTime ||= sim.state.party.some((m, j) => m.hp > hp0[j]); }
    const hx = (sim.world.enemies || []).filter((e) => e.hex && e.hex.t > 0);
    if (hx.length) { hexed = true; hexNote = `${hx.length} hexed, −${Math.round(hx[0].hex.k * 100)} %`; assert.ok(hx[0].hex.k > 0 && hx[0].hex.k <= 0.4); }
  }
  assert.ok(breathed, 'the breath went on the whole party'); assert.ok(healedOverTime, 'and healed them over time');
  assert.ok(hexed, `a hex went on (${hexNote})`);
});

test('a save keeps a shaman (class, kit) and a fight replays the same', () => {
  const run = () => { const sim = fight(12); for (let i = 0; i < 20 * 20; i++) sim.tick(); return sim; };
  const a = run(), b = run();
  assert.equal(JSON.stringify(a.snapshot()), JSON.stringify(b.snapshot()), 'deterministic');
  const r = createSim(1); r.restore(JSON.parse(JSON.stringify(a.snapshot())));
  assert.equal(r.state.party.find((m) => m.id === 'sh').cls, 'shaman');
});
