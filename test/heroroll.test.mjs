// A new hero's roll and name (GDD §6.1 v1.64): six born attribute points against the class build's share, a trait from
// the sellswords' own perks, one roll per (seed, class, n) and re-rolled as often as you like; a roll on the build is the
// class table exactly; createHero rolls it again and saves it (v38); the names the sim won't take.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { CLASSES, makeHero, rollHero, statsFor, NOT_BORN, ROLL_MAX, cleanName } from '../src/sim/party.js';
import { BORN_POINTS, ATTRS, bornBaseline, attrsOf } from '../src/sim/attributes.js';
import { PERKS } from '../src/sim/companions.js';
import { nameRefusal, REFUSE_RUDE, REFUSE_STAFF } from '../src/sim/names.js';

const SEED = 20260807;
const town = () => { const s = createSim(SEED, undefined, { scene: 'town' }); s.state.counters.gold = 10000; return s; };
const refusals = (sim) => { const out = []; sim.bus.on('refused', (r) => out.push(r.reason)); return out; };
const make = (sim, o) => { sim.commands.push({ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'thornwick_born', name: 'Tam', ...o }); sim.tick(); };

test('a roll: six points over the four, a trait from the companions\' perks, the same roll for the same n', () => {
  for (const cls of Object.keys(CLASSES)) {
    const seen = new Set(), spreads = new Set();
    for (let n = 0; n < 300; n++) {
      const r = rollHero(SEED, cls, n);
      assert.equal(ATTRS.reduce((t, k) => t + r.born[k], 0), BORN_POINTS, `${cls} #${n}: six points`);
      assert.ok(r.perks.length >= 1 && r.perks.length <= 2, `${cls} #${n}: a trait (and now and then a quirk)`);
      for (const p of r.perks) { assert.ok(PERKS[p], p); assert.ok(!NOT_BORN.has(p), `${p}: not a hero's`); assert.ok(!PERKS[p].cls || PERKS[p].cls.includes(cls), `${p} fits ${cls}`); seen.add(p); }
      spreads.add(ATTRS.map((k) => r.born[k]).join(','));
    }
    assert.ok(seen.size >= 5, `${cls}: traits vary (${[...seen]})`); assert.ok(spreads.size >= 15, `${cls}: spreads vary (${spreads.size})`);
    assert.deepEqual(rollHero(SEED, cls, 42), rollHero(SEED, cls, 42), 'the same n, the same roll');
  }
  assert.notDeepEqual(rollHero(SEED, 'rogue', 0), rollHero(SEED + 1, 'rogue', 0), 'another game, another roll');
});

test('a roll on the build is the class table exactly; others trade one strength for another', () => {
  for (const cls of Object.keys(CLASSES)) {
    const plain = statsFor(makeHero({ cls })), onBuild = statsFor(makeHero({ cls, born: bornBaseline(cls) }));
    for (const k of ['maxHp', 'maxMp', 'atk', 'def', 'crit', 'dodge']) assert.equal(onBuild[k], plain[k], `${cls} ${k}`);
  }
  const all = { might: 6, grit: 0, finesse: 0, focus: 0 }, f = statsFor(makeHero({ cls: 'fighter', born: all })), p = statsFor(makeHero({ cls: 'fighter' }));
  assert.ok(f.atk > p.atk && f.maxHp < p.maxHp, 'all in Might: more ATK, less HP');
});

test('createHero rolls it again from the seed and the n; a roll that is not one is refused', () => {
  const sim = town(), no = refusals(sim);
  make(sim, { roll: -1 }); make(sim, { roll: 1.5 }); make(sim, { roll: ROLL_MAX }); make(sim, { roll: 'x' });
  assert.equal(no.length, 4); assert.equal(sim.state.created, false);
  make(sim, { cls: 'rogue', look: 'hero_rogue', roll: 17 });
  const h = sim.state.party[0], r = rollHero(sim.seed, 'rogue', 17);
  assert.deepEqual(h.born, r.born); assert.deepEqual(h.perks, r.perks);
  assert.equal(h.hp, statsFor(h).maxHp, 'full');
  const old = town(); make(old, {}); assert.equal(old.state.party[0].born, undefined, 'no roll: the class table, as before');
});

test('the roll is saved (v38), kept through a respec, and a bad one dropped on load', () => {
  const sim = town(); make(sim, { roll: 3 });
  const h = sim.state.party[0], snap = JSON.parse(JSON.stringify(sim.snapshot()));
  const b = createSim(1); b.restore(snap);
  assert.deepEqual(b.state.party[0].born, h.born); assert.deepEqual(b.state.party[0].perks, h.perks);
  assert.deepEqual(statsFor(b.state.party[0]), statsFor(h));
  sim.state.party[0].level = 4; sim.state.party[0].attrs = { might: 9, grit: 0, finesse: 0, focus: 0 };
  sim.commands.push({ type: 'respec', id: 'you' }); sim.tick();
  assert.deepEqual(attrsOf(sim.state.party[0]), { might: 0, grit: 0, finesse: 0, focus: 0 }, 'the spent points back'); assert.deepEqual(sim.state.party[0].born, h.born, 'what it was born with stays');
  for (const bad of [{ might: 7, grit: 0, finesse: 0, focus: 0 }, { might: 6 }, { might: 3, grit: 3, finesse: 0, focus: 0, luck: 0 }, { might: 2.5, grit: 3.5, finesse: 0, focus: 0 }]) {
    const s2 = JSON.parse(JSON.stringify(snap)); s2.party[0].born = bad;
    const c = createSim(1); c.restore(s2); assert.equal(c.state.party[0].born, undefined, JSON.stringify(bad));
  }
});

test('names the sim will not take: the rude, the staff and the game; honest names that only look it pass', () => {
  for (const n of ['Fuuuck', 'Shi-t', 'Bigshitter', 'Ass', 'Dick', 'Tits Mcgee', 'Fück', 'Bitchy', 'Nazi Tam']) assert.equal(nameRefusal(cleanName(n)), REFUSE_RUDE, n);
  for (const n of ['GM Tam', 'Admin', 'Adminbob', 'Emberfall', 'Mod', 'Dev', 'Moderator Pell']) assert.equal(nameRefusal(cleanName(n)), REFUSE_STAFF, n);
  for (const n of ['Bob', 'Cassia', 'Hancock', 'Dickon', 'Grape', 'Titus', 'Analise', 'Scathe', 'Modric', 'Devlin', 'Assunta', 'Peacock', 'Sussex', 'Kirk', 'Hester']) assert.equal(nameRefusal(cleanName(n)), null, n);
  const sim = town(), no = refusals(sim); make(sim, { name: 'Shitface' }); make(sim, { name: 'GM Hale' });
  assert.deepEqual(no, [REFUSE_RUDE, REFUSE_STAFF]); assert.equal(sim.state.created, false);
});

test('every name creation suggests passes the sim: the lists are long, and none is refused', () => {
  const c = JSON.parse(readFileSync(new URL('../content/creation.json', import.meta.url), 'utf8'));
  for (const [origin, list] of Object.entries(c.names)) {
    assert.ok(list.length >= 30, `${origin}: ${list.length} names`);
    assert.equal(new Set(list).size, list.length, `${origin}: no repeats`);
    for (const n of list) { assert.equal(cleanName(n), n, `${n}: as typed`); assert.equal(nameRefusal(n), null, n); }
  }
});
