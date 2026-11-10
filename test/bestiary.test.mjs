// The bestiary (GDD v1.59; docs/creatures-proposal.md "The bestiary"): the red fire beetle, the goblin, the graveyard
// wraith, the stone golem, and the Rat King and the Spider Queen as bosses. Built in code (tools/actor-lab/creatures.js)
// and not yet given a place: each mirrors a role's strength (a boss: the boss whose mechanic it takes), so the
// difficulty contract holds wherever it's put.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ENEMIES, ENEMY_KINDS, BOSSES } from '../src/sim/battle.js';

const read = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));

test('the bestiary: each kind is the sim\'s, named for the defeat screen, mirroring a role (HP and ATK within 15 %)', () => {
  const foes = read('../content/foes.json').foes, MIRROR = { firebeetle: 'rogue', gob: 'minion', wraith: 'warrior', golem: 'warrior' };
  for (const [k, role] of Object.entries(MIRROR)) {
    assert.ok(ENEMY_KINDS.includes(k) && foes[k] && foes[k].a, k);
    const e = ENEMIES[k], r = ENEMIES[role];
    assert.ok(Math.abs(e.hp / r.hp - 1) <= 0.15 && Math.abs(e.atk / r.atk - 1) <= 0.15, `${k} (${e.hp}/${e.atk}) against ${role} (${r.hp}/${r.atk})`);
  }
  assert.equal(ENEMIES.firebeetle.bolt, 'firespit', 'the beetle spits fire');
  assert.ok(ENEMIES.golem.def > ENEMIES.warrior.def && ENEMIES.golem.speed < ENEMIES.warrior.speed, 'the golem stone: harder and slower');
});

test('the Rat King and the Spider Queen: bosses on the mechanics they mirror, their HP, ATK and DEF those bosses\' at a level', () => {
  for (const [id, like, mech] of [['rat_king', 'goblin_chief', 'swarm'], ['spider_queen', 'redhand_captain', 'call']]) {
    const B = BOSSES[id], M = BOSSES[like], b = ENEMIES[B.like], m = ENEMIES[M.like];
    assert.equal(B.mech, mech, id); assert.equal(M.mech, mech, like);
    for (const s of ['hp', 'atk', 'def']) assert.ok(Math.abs((b[s] * B[s]) / (m[s] * M[s]) - 1) < 0.02, `${id} ${s}: ${b[s] * B[s]} against ${like}'s ${m[s] * M[s]}`);
    for (const k of B.escort) assert.ok(ENEMY_KINDS.includes(k), `${id}'s ${k}`);
  }
  assert.deepEqual(BOSSES.rat_king.escort, ['rat', 'rat'], 'his swarm: rats');
});

test('every bestiary actor is baked and cast as a creature built in code (no KayKit model), its clips the kit\'s', () => {
  const cast = read('../assets/models/cast.json').actors;
  for (const a of ['creature_firebeetle', 'creature_goblin', 'creature_wraith', 'creature_golem', 'boss_ratking', 'boss_spiderqueen']) {
    assert.ok(cast[a] && cast[a].v.creature && !cast[a].v.model, a);
    const atlas = read(`../assets/actors/${a}.json`);
    for (const k of ['idle', 'walk', 'attack', 'heavy', 'hit', 'death']) assert.ok(atlas.clips[k], `${a} ${k}`);
  }
  assert.equal(cast.creature_golem.v.height, 2, 'the golem twice a man'); assert.equal(cast.creature_wraith.v.height, 1.5, 'the wraith a man and a half');
});
