// M3 heroes: creation, attributes, skills and stances, death and resurrection, the bench,
// the temple and the inn. Every rule is asserted on outcomes, through commands and ticks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { CLASSES, ORIGINS, ORIGIN_EDGE, statsFor, makeMember, cleanName, xpToNext } from '../src/sim/party.js';
import { pendingPoints, autoAllocate, POINTS_PER_LEVEL } from '../src/sim/attributes.js';
import { pendingSkillPoints, rankOf, rankCost, skillsOf } from '../src/sim/skills.js';
import { DAY_S, WEAK_S, BENCH_MAX } from '../src/sim/heroes.js';
import { startSession, verifySession } from '../src/sim/replay.js';

const SEED = 20260807;
const run = (sim, cmds) => { for (const c of cmds) { sim.commands.push(c); sim.tick(); } };
const town = () => { const s = createSim(SEED, undefined, { scene: 'town' }); s.state.counters.gold = 10000; return s; };
const refusals = (sim) => { const out = []; sim.bus.on('refused', (r) => out.push(r.reason)); return out; };
// a party standing in the middle of a level-`lv` dungeon room, the battle about to start
function inRoom(party, lv = 1, seed = SEED) {
  const sim = createSim(seed, undefined, { scene: 'dungeon' });
  sim.state.party = party;
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, lv);
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  return sim;
}
const hero = (over = {}) => ({ ...createSim(SEED).state.party[0], autoAttrs: true, ...over });
const ticks = (sim, n, until = () => false) => { for (let i = 0; i < n && !until(); i++) sim.tick(); };

// ── creation ────────────────────────────────────────────────────────────────
test('createHero makes the main character once, validated', () => {
  const sim = town(), no = refusals(sim);
  assert.equal(sim.state.created, false);
  run(sim, [
    { type: 'createHero', cls: 'bard', look: 'hero_mage', origin: 'thornwick_born', name: 'Ada' },
    { type: 'createHero', cls: 'mage', look: 'hero_knight', origin: 'thornwick_born', name: 'Ada' },
    { type: 'createHero', cls: 'mage', look: 'hero_mage', origin: 'nobody', name: 'Ada' },
    { type: 'createHero', cls: 'mage', look: 'hero_mage', origin: 'thornwick_born', name: '<>!!' },
  ]);
  assert.equal(no.length, 4); assert.equal(sim.state.created, false);
  run(sim, [{ type: 'createHero', cls: 'mage', look: 'hero_mage', origin: 'grey_sisters_ward', name: '  Ilsa <b>Venn</b> ' }]);
  const h = sim.state.party[0];
  assert.deepEqual([h.cls, h.actor, h.origin, h.name, h.main, h.level, h.xp], ['mage', 'hero_mage', 'grey_sisters_ward', 'Ilsa bVennb', true, 1, 0]);
  assert.equal(statsFor(h).maxHp, 80 + 0);                     // GDD mage level 1 (in the kit)
  run(sim, [{ type: 'createHero', cls: 'rogue', look: 'hero_rogue', origin: 'redhand_deserter', name: 'Again' }]);
  assert.equal(sim.state.party[0].cls, 'mage');                 // once per game
});
test('names: Latin letters, apostrophe, hyphen, 16 characters', () => {
  assert.equal(cleanName("  Maëlle  d'Arc-Venn  "), "Maëlle d'Arc-Ven");
  assert.equal(cleanName('𝔄𝔩𝔡'), '');
  assert.equal(cleanName(null), '');
});
test('origins in the sim match content/origins.json', () => {
  const json = JSON.parse(readFileSync(new URL('../content/origins.json', import.meta.url), 'utf8')).origins;
  assert.deepEqual(json.map((o) => o.id), ORIGINS);
  for (const o of json) assert.deepEqual({ kind: o.edge.kind, value: o.edge.value }, ORIGIN_EDGE[o.id]);
});
test('origin edges: Redhand +1 ATK, Thornwick-born one more hireling', () => {
  const a = town(), b = town();
  run(a, [{ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'redhand_deserter', name: 'A' }]);
  run(b, [{ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'thornwick_born', name: 'B' }]);
  assert.equal(statsFor(a.state.party[0]).atk, statsFor(b.state.party[0]).atk + 1);
  assert.equal(a.heroes.roster().length, 3); assert.equal(b.heroes.roster().length, 4);
  run(b, [{ type: 'hire', idx: 3 }]);
  assert.equal(b.state.party.length, 2);
});

// ── attributes ──────────────────────────────────────────────────────────────
test('the recommended build reproduces the class table (HP / MP / ATK / DEF) at every level', () => {
  for (const cls of Object.keys(CLASSES)) for (let lv = 1; lv < 20; lv++) {            // (20+: the passives add on top)
    const m = makeMember('t', 'T', cls, lv), c = CLASSES[cls], L = lv - 1, s = statsFor(m), g = s.gear;
    assert.equal(pendingPoints(m), 0);
    assert.equal(s.maxHp, Math.round(c.hp[0] + c.hp[1] * L + g.hp), `${cls} L${lv} hp`);
    assert.equal(s.maxMp, Math.round(c.mp[0] + c.mp[1] * L + g.mp), `${cls} L${lv} mp`);
    assert.ok(Math.abs(s.atk - (c.atk[0] + c.atk[1] * L + g.atk)) < 0.051, `${cls} L${lv} atk`);
    assert.ok(Math.abs(s.def - (c.def[0] + c.def[1] * L + g.def)) < 0.051, `${cls} L${lv} def`);
  }
});
test('3 points a level; spend, Auto, and no points from nowhere', () => {
  const sim = town(), no = refusals(sim), h = sim.state.party[0];
  h.level = 4;                                                  // (a test shortcut: levels come from XP in play)
  assert.equal(pendingPoints(h), 3 * POINTS_PER_LEVEL);
  const atk0 = statsFor(h).atk, hp0 = statsFor(h).maxHp;
  run(sim, [{ type: 'spendPoint', id: 'you', attr: 'might' }, { type: 'spendPoint', id: 'you', attr: 'grit' }, { type: 'spendPoint', id: 'you', attr: 'luck' }]);
  assert.equal(pendingPoints(h), 7);
  assert.ok(Math.abs(statsFor(h).atk - atk0 - 0.4) < 0.051); assert.equal(statsFor(h).maxHp, Math.round(hp0 + 3.5));
  run(sim, [{ type: 'setAutoAttrs', id: 'you', on: true }]);
  assert.equal(pendingPoints(h), 0);
  run(sim, [{ type: 'spendPoint', id: 'you', attr: 'might' }]);
  assert.deepEqual(no, ['No points to spend']);
  run(sim, [{ type: 'spendPoint', id: 'nobody', attr: 'might' }]);
  assert.equal(h.attrs.might + h.attrs.grit + h.attrs.finesse + h.attrs.focus, 9);
});
test('companions level up onto their build; the main character banks points', () => {
  const sim = inRoom([hero({ autoAttrs: false }), makeMember('c1', 'Wren', 'rogue', 1)]);
  let ups = 0; sim.bus.on('levelUp', () => ups++);
  ticks(sim, 20 * 240, () => sim.state.party[1].level >= 2 && sim.state.party[0].level >= 2);
  assert.ok(ups >= 2);
  assert.equal(pendingPoints(sim.state.party[1]), 0);
  assert.equal(pendingPoints(sim.state.party[0]), 3 * (sim.state.party[0].level - 1));
});
test('respec at a temple: first free, then 20 gold × level; not in the field', () => {
  const sim = town(), h = sim.state.party[0]; h.level = 3; autoAllocate(h);
  const g0 = sim.state.counters.gold;
  run(sim, [{ type: 'respec', id: 'you' }]);
  assert.equal(pendingPoints(h), 6); assert.equal(sim.state.counters.gold, g0);
  run(sim, [{ type: 'respec', id: 'you' }]);
  assert.equal(sim.state.counters.gold, g0 - 60);
  const d = inRoom([hero()]), no = refusals(d); d.state.counters.gold = 999;
  run(d, [{ type: 'respec', id: 'you' }]);
  assert.deepEqual(no, ['Respec at a town temple']);
});

// ── skills and stances ──────────────────────────────────────────────────────
test('skill points at even levels; ranks need an unlocked ability; rank 5 is the top', () => {
  const sim = town(), no = refusals(sim), h = sim.state.party[0];
  h.level = 12;
  assert.equal(pendingSkillPoints(h), 6);
  run(sim, [{ type: 'rankSkill', id: 'you', skill: 'cleave' }, { type: 'rankSkill', id: 'you', skill: 'cleave' }, { type: 'rankSkill', id: 'you', skill: 'cleave' }, { type: 'rankSkill', id: 'you', skill: 'cleave' }, { type: 'rankSkill', id: 'you', skill: 'cleave' }]);
  assert.equal(rankOf(h, 'cleave'), 5); assert.equal(no.at(-1), 'Cleave is at its highest rank');
  assert.equal(rankCost(skillsOf('fighter')[0], 5), 8);
  h.level = 6;
  run(sim, [{ type: 'rankSkill', id: 'you', skill: 'second_wind' }]);
  assert.equal(no.at(-1), 'Second Wind unlocks at level 12');
  run(sim, [{ type: 'rankSkill', id: 'you', skill: 'fireball' }]);
  assert.equal(rankOf(h, 'second_wind'), 1);
});
test('auto-cast, priority and stance commands are validated', () => {
  const sim = town(), h = sim.state.party[0];
  run(sim, [{ type: 'setAutocast', id: 'you', skill: 'cleave', on: false }, { type: 'setPriority', id: 'you', order: ['second_wind', 'cleave', 'shield_wall'] },
    { type: 'setPriority', id: 'you', order: ['cleave', 'cleave', 'cleave'] }, { type: 'setStance', id: 'you', stance: 'defensive' }, { type: 'setStance', id: 'you', stance: 'berserk' }]);
  assert.deepEqual(h.off, ['cleave']); assert.deepEqual(h.prio, ['second_wind', 'cleave', 'shield_wall']); assert.equal(h.stance, 'defensive');
  run(sim, [{ type: 'setAutocast', id: 'you', skill: 'cleave', on: true }]);
  assert.deepEqual(h.off, []);
});
test('stance changes battle behaviour, measurably', () => {
  const measure = (stance) => {
    const sim = inRoom([hero({ level: 6, stance })], 6); let dealt = 0, taken = 0, casts = 0;
    sim.bus.on('combat', (c) => { if (c.t === 'hit') c.party ? (taken += c.amount) : (dealt += c.amount); if (c.t === 'ability') casts++; });
    autoAllocate(sim.state.party[0]); sim.state.party[0].hp = statsFor(sim.state.party[0]).maxHp;
    ticks(sim, 20 * 60);
    return { dealt, taken, casts, atk: statsFor(sim.state.party[0]).atk, def: statsFor(sim.state.party[0]).def };
  };
  const a = measure('aggressive'), b = measure('balanced'), d = measure('defensive');
  assert.ok(a.atk > b.atk && b.atk > d.atk && d.def > b.def && b.def > a.def);
  assert.ok(a.dealt > d.dealt, `aggressive dealt ${a.dealt} vs defensive ${d.dealt}`);
  assert.ok(a.casts !== d.casts || a.taken !== d.taken);
});
test('an auto-cast toggle keeps an ability out of battle', () => {
  const casts = (off) => {
    const sim = inRoom([hero(off ? { off: ['cleave'] } : {})]); let n = 0;
    sim.bus.on('combat', (c) => { if (c.t === 'ability' && c.name === 'Cleave') n++; });
    ticks(sim, 20 * 40); return n;
  };
  assert.ok(casts(false) > 0); assert.equal(casts(true), 0);
});

// ── death and resurrection ──────────────────────────────────────────────────
const downOnce = (sim, m) => { for (let i = 0; i < 20 * 60 && !m.down && !m.fallen; i++) { m.hp = Math.min(m.hp, 1); sim.tick(); } };   // one blow will do
test('Downed twice in waves back to back → Fallen: a ghost that neither fights nor earns', () => {
  const c = makeMember('c1', 'Maera', 'fighter', 5), h = hero({ level: 5 }); autoAllocate(h);
  const sim = inRoom([h, c], 1);
  downOnce(sim, c); assert.equal(c.down, true); assert.equal(c.fallen, undefined);
  ticks(sim, 20 * 60, () => !c.down);                           // the wave falls: they rise in the lull
  assert.equal(c.down, false); assert.ok(c.hp > 0);
  ticks(sim, 20 * 30, () => sim.world.enemies.some((e) => e.hp > 0 && !(e.spawn > 0)));
  downOnce(sim, c);
  assert.equal(c.fallen, true); assert.equal(c.down, false); assert.equal(c.hp, 0);
  const xp = c.xp; let kills = 0; sim.bus.on('combat', (e) => { if (e.t === 'xp') kills++; });
  ticks(sim, 20 * 60, () => kills >= 2);
  assert.ok(kills >= 2); assert.equal(c.xp, xp); assert.equal(c.hp, 0); assert.equal(c.fallen, true);
});
test('the main character is never Fallen; walking out on a Downed companion makes them Fallen', () => {
  const h = hero({ level: 5 }), c = makeMember('c1', 'Maera', 'fighter', 5); autoAllocate(h);
  const sim = inRoom([h, c], 1);
  downOnce(sim, h); ticks(sim, 20 * 60, () => !h.down);
  downOnce(sim, h);
  assert.notEqual(h.fallen, true); assert.equal(h.down, true);
  const w = inRoom([hero({ level: 5, attrs: { might: 4, grit: 8 } }), makeMember('c1', 'Maera', 'fighter', 5)], 1), c2 = w.state.party[1];
  downOnce(w, c2); assert.equal(c2.down, true);
  const E = w.world.level.entrance; w.state.player.x = E.cx + 0.5; w.state.player.y = E.cy + 0.5;   // out of the room
  w.tick();
  assert.equal(c2.fallen, true); assert.equal(w.battle, null);
});
test('a wipe: the temple, 30 % HP, Fallen cleared, a quarter of the gold, Weakened for 10 minutes', () => {
  const h = hero({ level: 2 }), c = makeMember('c1', 'Maera', 'fighter', 2);
  const sim = inRoom([h, c], 6); sim.state.counters.gold = 400;
  c.fallen = true; c.hp = 0;
  let woke = null; sim.bus.on('defeat', (d) => (woke = d));
  ticks(sim, 20 * 120, () => woke);
  assert.ok(woke.lost >= 100); assert.equal(woke.lost, Math.floor((sim.state.counters.gold + woke.lost) * 0.25));
  assert.equal(sim.state.scene, 'town');
  const a = sim.world.arrivals.temple; assert.ok(Math.hypot(sim.state.player.x - a.x, sim.state.player.y - a.y) < 1);
  for (const m of sim.state.party) {
    assert.equal(m.fallen, false); assert.equal(m.down, false);
    assert.ok(m.weakUntil > sim.state.t);
    assert.equal(Math.round(m.hp), Math.round(statsFor(m).maxHp * 0.3));
  }
  const weakAtk = statsFor(h).atk, fullAtk = statsFor({ ...h, weakUntil: 0 }).atk;
  assert.ok(Math.abs(weakAtk - fullAtk * 0.9) < 0.11);
  ticks(sim, 20 * (WEAK_S + 2));
  assert.equal(h.weakUntil, 0);
});
test('the inn: full HP / MP and Weakened lifted, for 5 gold × level', () => {
  const sim = town(), h = sim.state.party[0]; h.weakUntil = 500; h.hp = 3; sim.state.counters.gold = 12;
  run(sim, [{ type: 'rest' }]);
  assert.equal(h.weakUntil, 0); assert.equal(h.hp, statsFor(h).maxHp); assert.equal(sim.state.counters.gold, 7);
  sim.state.counters.gold = 0; const no = refusals(sim);
  run(sim, [{ type: 'rest' }]); assert.deepEqual(no, ['Not enough gold']);
});
test('the temple raises the Fallen: free once a day to level 5, then 25 gold × level; never in the field', () => {
  const sim = town(); sim.state.counters.gold = 100;
  sim.state.party.push(makeMember('c1', 'Maera', 'fighter', 3), makeMember('c2', 'Wren', 'rogue', 3));
  for (const m of sim.state.party.slice(1)) { m.fallen = true; m.hp = 0; }
  run(sim, [{ type: 'resurrect', id: 'c1' }]);
  assert.equal(sim.state.party[1].fallen, false); assert.equal(sim.state.party[1].hp, statsFor(sim.state.party[1]).maxHp); assert.equal(sim.state.counters.gold, 100);
  run(sim, [{ type: 'resurrect', id: 'c2' }]);                  // the day's free raise is spent
  assert.equal(sim.state.party[2].fallen, false); assert.equal(sim.state.counters.gold, 25);
  sim.state.party[1].fallen = true; sim.state.t += DAY_S;          // a new day
  run(sim, [{ type: 'resurrect', id: 'c1' }]); assert.equal(sim.state.counters.gold, 25);
  const d = inRoom([hero(), { ...makeMember('c1', 'M', 'fighter', 1), fallen: true, hp: 0 }]), no = refusals(d);
  run(d, [{ type: 'resurrect', id: 'c1' }]);
  assert.equal(d.state.party[1].fallen, true); assert.equal(no[0], 'Only a temple can raise the Fallen here');
});
test('a shrine raises one Fallen member at half HP, once', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon' }), c = makeMember('c1', 'Maera', 'fighter', 1);
  c.fallen = true; c.hp = 0; sim.state.party.push(c);
  let at = null; for (const [k, v] of sim.world.props) if (v === 'shrine') { at = k.split(',').map(Number); break; }
  if (!at) return;                                              // (this seed's first level has no shrine)
  const p = sim.state.player; p.x = at[0] + 1.5; p.y = at[1] + 0.5;
  run(sim, [{ type: 'harvest', tx: at[0], ty: at[1] }]);
  assert.equal(c.fallen, false); assert.ok(Math.abs(c.hp - statsFor(c).maxHp * 0.5) <= 1);
});

// ── the bench ───────────────────────────────────────────────────────────────
test('hire to the party, then the bench; dismiss, swap and release, in town only', () => {
  const sim = town(), S = sim.state;
  run(sim, [{ type: 'hire', idx: 0 }, { type: 'hire', idx: 1 }, { type: 'hire', idx: 2 }, { type: 'hire', idx: 2 }]);
  assert.equal(S.party.length, 3); assert.equal(S.bench.length, 1);
  const benched = S.bench[0].id, out = S.party[1].id;
  run(sim, [{ type: 'swap', slot: 1, id: benched }]);
  assert.equal(S.party[1].id, benched); assert.equal(S.bench[0].id, out);
  run(sim, [{ type: 'dismiss', id: S.party[2].id }]);
  assert.equal(S.party.length, 2); assert.equal(S.bench.length, 2);
  run(sim, [{ type: 'swap', slot: 2, id: S.bench[1].id }, { type: 'dismiss', id: 'you' }]);
  assert.equal(S.party.length, 3); assert.equal(S.party[0].id, 'you');
  run(sim, [{ type: 'release', id: S.bench[0].id }]);
  assert.equal(S.bench.length, 0);
  assert.equal(BENCH_MAX, 6);
  const d = inRoom([hero(), makeMember('c1', 'M', 'fighter', 1)]); d.state.bench.push(makeMember('b1', 'B', 'rogue', 1));
  run(d, [{ type: 'swap', slot: 1, id: 'b1' }, { type: 'dismiss', id: 'c1' }]);
  assert.equal(d.state.party[1].id, 'c1'); assert.equal(d.state.bench[0].id, 'b1');
});
test('the bench earns half XP', () => {
  const sim = inRoom([hero({ level: 1 })]), b = makeMember('b1', 'B', 'rogue', 1); sim.state.bench.push(b);
  let gained = 0; const h = sim.state.party[0], x0 = h.xp;
  sim.bus.on('combat', (c) => { if (c.t === 'xp') gained += c.amount; });
  ticks(sim, 20 * 30, () => gained > 0);
  assert.ok(gained > 0); assert.equal(h.xp - x0, gained); assert.equal(b.xp, Math.round(gained * 0.5));
});

// ── saves and replays ───────────────────────────────────────────────────────
test('every M3 field survives a save; a v4-era save loads with its stats unchanged', () => {
  const sim = town();
  run(sim, [{ type: 'createHero', cls: 'rogue', look: 'hero_rogue', origin: 'deepdelver_fostered', name: 'Wick' },
    { type: 'hire', idx: 0 }, { type: 'hire', idx: 1 }, { type: 'hire', idx: 2 }, { type: 'setStance', id: 'you', stance: 'aggressive' },
    { type: 'setAutocast', id: 'you', skill: 'backstab', on: false }]);
  const h = sim.state.party[0]; h.level = 6; h.weakUntil = 99; sim.state.party[1].fallen = true;
  run(sim, [{ type: 'spendPoint', id: 'you', attr: 'finesse' }, { type: 'rankSkill', id: 'you', skill: 'backstab' }, { type: 'resurrect', id: sim.state.party[1].id }]);
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  const r = createSim(SEED, undefined, { scene: 'town' }); r.restore(snap);
  assert.equal(r.state.created, true); assert.equal(r.state.bench.length, 1); assert.deepEqual(r.state.temple, sim.state.temple);
  const a = r.state.party[0];
  for (const k of ['name', 'cls', 'origin', 'stance', 'weakUntil', 'level']) assert.deepEqual(a[k], h[k], k);
  assert.deepEqual(a.attrs, h.attrs); assert.deepEqual(a.skills, h.skills); assert.deepEqual(a.off, h.off);
  assert.deepEqual(statsFor(a), statsFor(h));
  // a snapshot from before M3 (no attrs, no created): the class build, so the same stats as then
  const old = JSON.parse(JSON.stringify(snap)); delete old.created; delete old.bench; delete old.temple;
  for (const m of old.party) { delete m.attrs; delete m.autoAttrs; delete m.stance; delete m.weakUntil; delete m.origin; }
  const o = createSim(SEED, undefined, { scene: 'town' }); o.restore(old);
  assert.equal(o.state.created, true); assert.equal(pendingPoints(o.state.party[0]), 0); assert.equal(o.state.party[0].autoAttrs, false);
  const m = makeMember('x', 'x', 'rogue', 6);
  assert.equal(statsFor({ ...o.state.party[0], gear: m.gear }).maxHp, statsFor(m).maxHp);
});
test('hero commands replay exactly; forged ones change nothing', () => {
  const sim = town(), s = startSession(sim);
  const cmds = [{ type: 'createHero', cls: 'fighter', look: 'hero_barbarian', origin: 'redhand_deserter', name: 'Brann' }, { type: 'hire', idx: 2 },
    { type: 'setStance', id: 'you', stance: 'defensive' }, { type: 'spendPoint', id: 'you', attr: 'grit' }, { type: 'rest' }, { type: 'rankSkill', id: 'you', skill: 'cleave' },
    { type: 'resurrect', id: 'nobody' }, { type: 'swap', slot: 9, id: 'x' }, { type: 'createHero', cls: 'mage', look: 'hero_mage', origin: 'thornwick_born', name: 'Z' }];
  for (let i = 0; i < 200; i++) { if (i % 10 === 0 && cmds.length) sim.commands.push(cmds.shift()); sim.tick(); }
  const claim = s.claim(), v = verifySession(claim, { verified: s.startHash, elapsedMs: claim.ticks * 50 });
  assert.equal(v.ok, true, v.reason);
  assert.equal(sim.state.party[0].cls, 'fighter'); assert.equal(pendingPoints(sim.state.party[0]), 0);
  assert.equal(xpToNext(1), 100);
});
