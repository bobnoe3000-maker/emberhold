// The Toadking's toads (GDD v1.83, world doc v1.43; the owner, 2026-11-13: "take a strong pass at creating toad NPCs for
// the toad king dungeon"): the mire toad and the gulper, built in code (tools/actor-lab/creatures.js toad), on the Mound's
// floors among his men, the gulper at his side in the Boat Hall. Each mirrors a role's strength, so the difficulty
// contract holds wherever a wave puts them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { ENEMIES, ENEMY_KINDS, FAMILIES, BOSSES } from '../src/sim/battle.js';
import { SITES, familyAt } from '../src/sim/sites.js';

const read = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));

test('the toads: the sim\'s kinds, named, mirroring a role; a toad doesn\'t get out of the way; the gulper\'s tongue the longest melee reach', () => {
  const foes = read('../content/foes.json').foes;
  for (const [k, role] of [['mudtoad', 'minion'], ['gulper', 'warrior']]) {
    assert.ok(ENEMY_KINDS.includes(k) && foes[k] && foes[k].a && foes[k].elite, k);
    const e = ENEMIES[k], r = ENEMIES[role];
    assert.ok(Math.abs(e.hp / r.hp - 1) <= 0.15 && Math.abs(e.atk / r.atk - 1) <= 0.15, `${k} (${e.hp}/${e.atk}) against ${role} (${r.hp}/${r.atk})`);
    assert.ok(e.dodge < r.dodge && !e.bolt, `${k}: heavy, and it bites`);
  }
  const melee = ENEMY_KINDS.filter((k) => !ENEMIES[k].bolt && k !== 'gulper').map((k) => ENEMIES[k].range);
  assert.ok(ENEMIES.gulper.range > Math.max(...melee), `the gulper's tongue (${ENEMIES.gulper.range}) out-reaches every bite and blade (${Math.max(...melee)})`);
});

test('Toadking\'s Mound: mire toads among his men on every floor, a gulper the elite below the first; Dumpling at his side', () => {
  assert.deepEqual([0, 1, 2].map((d) => familyAt('toadking_mound', d)), ['toadmen', 'boathall', 'boathall']);
  for (const id of ['toadmen', 'boathall']) {
    const F = FAMILIES[id];
    assert.ok(F.melee.includes('mudtoad') && F.melee.includes('reedcutter'), id);
    assert.deepEqual(F.ranged, ['fowler', 'bogwitch'], `${id}: his fowlers and the witches`);
    assert.equal(F.undead('mudtoad') || F.undead('gulper'), false, 'not undead: Turn Undead does nothing to them');
  }
  assert.equal(FAMILIES.toadmen.elite, 'reedcutter'); assert.equal(FAMILIES.boathall.elite, 'gulper');
  assert.deepEqual(BOSSES.toadking.escort, ['gulper', 'fowler']);
  assert.equal(SITES.toadking_mound.family, 'reedmen', 'the family the site falls back to: the Fens\' own reed-cutters');
});

test('the toads baked and cast as creatures built in code, at their sizes (hip-high, chest-high)', () => {
  const cast = read('../assets/models/cast.json').actors;
  for (const [a, h] of [['creature_toad', 0.55], ['creature_gulper', 0.9]]) {
    assert.ok(cast[a] && cast[a].v.creature && !cast[a].v.model, a);
    assert.equal(cast[a].v.height, h, a);
    const atlas = read(`../assets/actors/${a}.json`);
    for (const k of ['idle', 'walk', 'attack', 'attack2', 'heavy', 'hit', 'death']) assert.ok(atlas.clips[k], `${a} ${k}`);
    assert.ok(existsSync(new URL(`../assets/actors/${a}.alb.png`, import.meta.url)), a);
  }
  assert.equal(cast.creature_toad.v.creature.kind, 'toad'); assert.equal(cast.creature_gulper.v.creature.kind, 'gulper');
});

// (the kit needs the lab's three: tools/actor-lab `npm i`, as for a bake; without it this check is skipped)
const lab = (() => { try { createRequire(new URL('../tools/actor-lab/package.json', import.meta.url)).resolve('three'); return true; } catch { return false; } })();
test('every creature\'s clips are whole: each track a value for every time (a frame that didn\'t name a bone left a hole that hung the mixer: the toad\'s tongue)', { skip: !lab && 'the actor lab isn\'t installed' }, async () => {
  const { buildCreature, CREATURE_KINDS } = await import('../tools/actor-lab/creatures.js');
  assert.ok(CREATURE_KINDS.includes('toad') && CREATURE_KINDS.includes('gulper'));
  for (const kind of CREATURE_KINDS) {
    const m = await buildCreature({ kind });
    for (const c of m.clips) for (const t of c.tracks) {
      const w = t.name.endsWith('.quaternion') ? 4 : 3;
      assert.equal(t.values.length, t.times.length * w, `${kind} ${c.name} ${t.name}`);
    }
  }
});
