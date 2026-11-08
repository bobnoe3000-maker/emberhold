// skillfx.test.mjs — every class skill has an effect of its own (docs/combat-fx.md; the owner, 2026-11-07: "Unique
// effects for each spell and skill"), the sim tells the renderer when one is cast and lands, and telling it changes
// nothing the sim does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/sim/skills.js';
import { createSkillFX, SKILL_MOMENTS } from '../src/render/skillfx.js';
import { createSim } from '../src/sim/core.js';
import { makeHero, makeMember, statsFor } from '../src/sim/party.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { starterKit } from '../src/sim/items.js';
import { stateHash } from '../src/sim/replay.js';

const ALL = Object.values(SKILLS).flat().map((s) => s.id);

test('every class skill has a moment of its own, and no two draw alike', () => {
  assert.deepEqual([...SKILL_MOMENTS].sort(), [...ALL].sort());
  const sig = {};
  for (const id of ALL) {
    const pts = [];
    const P = { depth() {}, flush() {}, mark: (x, y, a) => { if (a > 0.01) pts.push(`${Math.round(x)},${Math.round(y)}`); }, disc: (x, y, r, a) => { if (a > 0.01) pts.push(`${Math.round(x)},${Math.round(y)}`); }, seg: (x0, y0, x1, y1, a0, a1) => { if (Math.max(a0, a1) > 0.01) pts.push(`${Math.round(x0)},${Math.round(y0)}-${Math.round(x1)},${Math.round(y1)}`); }, star: (x, y, r, a) => { if (a > 0.01) pts.push(`*${Math.round(x)},${Math.round(y)}`); } };
    const fx = createSkillFX(P), proj = (x, y) => ({ sx: 200 + (x - y) * 8, sy: 200 + (x + y) * 4, h: 0, key: x + y });
    const ev = { id, at: 'land', cls: 'x', by: null, x: 5, y: 5, tid: null, ally: false, tx: 6, ty: 4, r: 3, reached: [{ id: null, x: 7, y: 5 }, { id: null, x: 5, y: 3 }], crit: true };
    fx.event(ev, 0); for (const t of [60, 160, 320]) fx.draw(t, proj, []);
    assert.ok(pts.length >= 6, `${id} draws: ${pts.length}`);
    sig[id] = pts.join('|');
  }
  const seen = new Map(); for (const [id, s] of Object.entries(sig)) { assert.ok(!seen.has(s), `${id} draws as ${seen.get(s)} does`); seen.set(s, id); }
});

// the fight the capture tool stages (tools/capture/skills.mjs): a party of 15 with every skill, in a level-15 room
function fight(classes, listen) {
  const sim = createSim(20260807, undefined, { scene: 'dungeon' }), got = [];
  sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
  sim.state.party = classes.map((c, i) => { const m = i ? makeMember('c' + i, 'C' + i, c, 15) : makeHero({ cls: c }); m.level = 15; m.attrs = null; m.autoAttrs = true; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; return m; });
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom && q.size === 'large'), P = sim.state.player;
  sim.world.roomLevels.set(r.id, 15); P.x = P.px = r.cx + 0.5; P.y = P.py = r.cy + 0.5;
  if (listen) sim.bus.on('skill', (e) => got.push(e));
  for (let t = 0; t < 20 * 60; t++) sim.tick();
  return { got, hash: stateHash(sim.snapshot()) };
}

test('the sim says when a skill is cast and where it lands, with who it reached; and saying so changes nothing', () => {
  const a = fight(['cleric', 'shaman', 'fighter'], true), b = fight(['cleric', 'shaman', 'fighter'], false);
  assert.equal(a.hash, b.hash, 'the same fight, heard or not');
  const ids = new Set(a.got.filter((e) => e.at === 'land').map((e) => e.id));
  for (const id of ['bless', 'hex', 'spirit_drain', 'cleave']) assert.ok(ids.has(id), `${id} landed: ${[...ids]}`);
  const hex = a.got.find((e) => e.id === 'hex' && e.at === 'land');
  assert.ok(hex.reached.length >= 1 && hex.reached.every((o) => typeof o.id === 'number'), 'a Hex names the foes it took');
  const bless = a.got.find((e) => e.id === 'bless' && e.at === 'land');
  assert.equal(bless.reached.length, 3, 'Bless reaches the whole party');
});

test('Frost Nova is thrown onto a knot of foes in the mage\'s reach (GDD v1.53: cast round her, who keeps her distance, it never went off)', () => {
  const { got } = fight(['fighter', 'rogue', 'mage'], true);
  const novas = got.filter((e) => e.id === 'frost_nova' && e.at === 'land');
  assert.ok(novas.length >= 1, `Frost Nova in a minute: ${novas.length}`);
  for (const e of novas) {
    assert.ok(e.reached.length >= 1, 'it bursts on foes (two or more when thrown: the knot moves and dies in the wind-up)');
    for (const o of e.reached) assert.ok(Math.hypot(o.x - e.tx, o.y - e.ty) < e.r + 1e-9, 'each within its reach of where it burst');
  }
  assert.ok(novas.some((e) => Math.hypot(e.tx - e.x, e.ty - e.y) > e.r), 'thrown: at least one bursts beyond the ring it would have had round her');
});

// (the boss pass) the fight's other moments: a ward breaking, a level gained, each boss's mechanic
test('the fight\'s other moments each draw, and no two alike; the bosses\' holds read off their state', async () => {
  const { FIGHT_MOMENTS } = await import('../src/render/skillfx.js');
  const sig = new Map();
  for (const id of FIGHT_MOMENTS) {
    const pts = [];
    const P = { depth() {}, flush() {}, mark: (x, y, a) => { if (a > 0.01) pts.push(`${Math.round(x)},${Math.round(y)}`); }, disc: (x, y, r, a) => { if (a > 0.01) pts.push(`${Math.round(x)},${Math.round(y)}`); }, seg: (x0, y0, x1, y1, a0, a1) => { if (Math.max(a0, a1) > 0.01) pts.push(`${Math.round(x0)},${Math.round(y0)}-${Math.round(x1)},${Math.round(y1)}`); }, star: (x, y, r, a) => { if (a > 0.01) pts.push(`*${Math.round(x)},${Math.round(y)}`); } };
    const fx = createSkillFX(P), proj = (x, y) => ({ sx: 200 + (x - y) * 8, sy: 200 + (x + y) * 4, h: 0, key: x + y });
    fx.moment({ id, by: null, foeBy: true, tid: null, ally: false, x: 5, y: 5, tx: 7, ty: 4, reached: [{ id: null, x: 7, y: 6 }, { id: null, x: 3, y: 4 }] }, 0);
    for (const t of [60, 200, 420]) fx.draw(t, proj, []);
    assert.ok(pts.length >= 6, `${id} draws: ${pts.length}`);
    const s = pts.join('|'); assert.ok(!sig.has(s), `${id} draws as ${sig.get(s)} does`); sig.set(s, id);
  }
  // the holds: nothing without the state, something with it
  const count = (units) => { let n = 0; const P = { depth() {}, flush() {}, mark: () => n++, disc: () => n++, seg: () => n++, star: () => n++ }; createSkillFX(P).draw(500, (x, y) => ({ sx: x * 8, sy: y * 4, h: 0, key: x + y }), units); return n; };
  const at = (u) => ({ u, foe: true, sx: u.x * 8, sy: u.y * 4, h: 0, key: u.x + u.y });
  const std = { id: 1, boss: 'standard', hp: 9, maxHp: 9, x: 10, y: 10 }, near = { id: 2, undead: true, hp: 5, maxHp: 5, x: 11, y: 10 };
  assert.ok(count([at(std), at(near)]) > count([at(std)]), 'the Standard\'s line marks the dead it covers');
  const teague = { id: 3, boss: 'teague', hp: 5, maxHp: 9, x: 10, y: 10 }, cage = { id: 4, kind: 'lantern', owner: 3, hp: 3, maxHp: 3, x: 10.7, y: 10 };
  assert.ok(count([at(teague), at(cage)]) > count([at({ ...teague, hp: 9 }), at(cage)]), 'the cage\'s light runs into Teague while he\'s hurt');
  const g1 = { id: 6, hp: 4, maxHp: 4, x: 9, y: 11 }, garrow = { id: 5, boss: 'redhand_captain', guards: [6], hp: 9, maxHp: 9, x: 10, y: 10 };
  assert.ok(count([at(garrow), at(g1)]) > count([at(garrow), at({ ...g1, hp: 0 })]), 'Garrow\'s shield while his men stand');
  const choir = { id: 7, boss: 'drowned_choir', undead: true, hp: 9, maxHp: 9, x: 10, y: 10 }, sing = { id: 8, singer: 7, undead: true, hp: 4, maxHp: 4, x: 11, y: 9 };
  assert.ok(count([at(choir), at(sing)]) > count([at(choir)]), 'the Choir\'s singers sing');
});

test('a spent ward says it broke; the bosses name who did it and to whom; and saying so changes nothing', () => {
  // (a ward spent: battle.js applyHit, wardBreak before the blow lands through)
  const sim = createSim(7, undefined, { scene: 'dungeon', site: 'drowned_abbey' });
  sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'dungeon', site: 'drowned_abbey', depth: 1 }); sim.tick();
  const hall = sim.world.level.descentRoom, lv = sim.world.roomLevels.get(hall.id), run = (listen) => {
    const s = createSim(7, undefined, { scene: 'dungeon', site: 'drowned_abbey' });
    s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), scene: 'dungeon', site: 'drowned_abbey', depth: 1 }); s.tick();
    s.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
    s.state.party = ['fighter', 'mage', 'cleric'].map((c, i) => { const m = i ? makeMember('c' + i, 'C' + i, c, lv) : makeHero({ cls: c }); m.level = lv; m.attrs = null; m.autoAttrs = true; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; return m; });
    const P = s.state.player; P.x = P.px = hall.cx + 0.5; P.y = P.py = hall.cy + 0.5;
    const got = [];
    if (listen) { s.bus.on('combat', (e) => { if (e.t === 'wardBreak') got.push(e); }); s.bus.on('bossVespers', (e) => got.push({ t: 'vespers', ...e })); }
    for (let t = 0; t < 20 * 40; t++) s.tick();
    return { got, hash: stateHash(s.snapshot()) };
  };
  const a = run(true), b = run(false);
  assert.equal(a.hash, b.hash, 'the same fight, heard or not');
  const vs = a.got.find((e) => e.t === 'vespers'); assert.ok(vs && typeof vs.by === 'number' && typeof vs.tid === 'number', 'the Choir names herself and the singer she raised');
  const wb = a.got.filter((e) => e.t === 'wardBreak'); assert.ok(wb.length >= 1 && wb.every((e) => e.id != null && typeof e.x === 'number'), `a ward broke, on someone: ${wb.length}`);
});

// the telegraph grammar (docs/combat-fx.md, attack warnings): a foe's heavy blow or shot is said before it comes, with its
// timing, for the renderers to mark on the ground; a light blow isn't; and saying so changes nothing
test('a foe says what\'s coming: its heavy blows and shots, to whom and when; and saying so changes nothing', async () => {
  const { WINDUP, WINDUP_HEAVY } = await import('../src/sim/battle.js');
  const run = (listen) => {
    const sim = createSim(7, undefined, { scene: 'dungeon', site: 'wickham_keep' });   // (Skarn's hall: his heavy blows, his archers' shots)
    sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'dungeon', site: 'wickham_keep', depth: 0 }); sim.tick();
    const hall = sim.world.level.descentRoom, lv = sim.world.roomLevels.get(hall.id);
    sim.state.party = ['fighter', 'mage', 'cleric'].map((c, i) => { const m = i ? makeMember('c' + i, 'C' + i, c, lv) : makeHero({ cls: c }); m.level = lv; m.attrs = null; m.autoAttrs = true; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; return m; });
    const P = sim.state.player; P.x = P.px = hall.cx + 0.5; P.y = P.py = hall.cy + 0.5;
    const got = [], hits = [];
    if (listen) { sim.bus.on('windup', (e) => got.push({ ...e, t: sim.state.t })); sim.bus.on('combat', (e) => { if (e.t === 'hit' && e.party) hits.push({ ...e, at: sim.state.t }); }); }
    for (let t = 0; t < 20 * 30; t++) sim.tick();
    return { got, hits, sim, hash: stateHash(sim.snapshot()) };
  };
  const a = run(true), b = run(false);
  assert.equal(a.hash, b.hash, 'the same fight, warned or not');
  const heavy = a.got.filter((e) => e.heavy && !e.bolt), shots = a.got.filter((e) => e.bolt);
  assert.ok(heavy.length >= 3 && heavy.every((e) => e.boss), `Skarn's heavy blows are warned: ${heavy.length}`);
  assert.ok(shots.length >= 3, `the archers' shots are warned: ${shots.length}`);
  assert.ok(a.got.every((e) => e.heavy || e.bolt), 'a light blow says nothing');
  const party = new Set(a.sim.state.party.map((m) => m.id));
  for (const e of a.got) {
    assert.ok(party.has(e.tid) && typeof e.by === 'number', 'from a foe, at one of the party');
    assert.equal(e.wind, e.heavy ? WINDUP_HEAVY : WINDUP);
    assert.ok(e.bolt ? e.fly > 0 : e.fly === 0, 'a shot says how long it flies');
  }
  // a heavy blow lands when it said it would (a hit on the one it named, wind s later, unless it missed or was cut down)
  const landed = heavy.filter((e) => a.hits.some((h) => Math.abs(h.at - e.t - e.wind) < 0.06 && h.heavy));
  assert.ok(landed.length >= 1, `a warned blow lands on time: ${landed.length} of ${heavy.length}`);
});

test('a warning\'s marks: a ring filling under a heavy blow, a lane filling along a shot that holds its start from the release, gone after its flash', () => {
  const draw = (e, times) => {
    const out = times.map(() => 0); let i = 0;
    const P = { depth() {}, flush() {}, mark: () => out[i]++, disc: () => out[i]++, seg: () => out[i]++, star: () => out[i]++ };
    const fx = createSkillFX(P), foe = { id: 1, x: 4, y: 4, hp: 5 }, hero = { id: 9, x: 9, y: 6, hp: 5 };
    const units = [{ u: foe, foe: true, sx: 100, sy: 100, h: 0, key: 8 }, { u: hero, foe: false, sx: 140, sy: 120, h: 0, key: 15 }];
    fx.moment({ id: 'warn', by: 1, foeBy: true, tid: 9, ally: true, x: 4, y: 4, tx: 9, ty: 6, reached: [], life: e.wind + e.fly + 0.16, ...e }, 0);
    for (; i < times.length; i++) { if (e.move && times[i] > e.wind * 1000) units[0].sx += 30; fx.draw(times[i], (x, y) => ({ sx: x * 8, sy: y * 4, h: 0, key: x + y }), units); }
    return { out, live: fx.live };
  };
  const ring = draw({ heavy: true, bolt: null, wind: 0.38, fly: 0 }, [50, 300, 450, 600]);
  assert.ok(ring.out[0] > 0 && ring.out[1] > ring.out[0], `the ring fills: ${ring.out}`);
  assert.equal(ring.out[3], 0, 'gone after its flash'); assert.equal(ring.live, 0);
  const lane = draw({ heavy: false, bolt: 'soul', wind: 0.18, fly: 0.3 }, [60, 300, 460]);
  assert.ok(lane.out[0] > 0 && lane.out[1] > lane.out[0], `the lane fills: ${lane.out}`);
  const held = draw({ heavy: false, bolt: 'soul', wind: 0.18, fly: 0.3, move: true }, [60, 300]), free = draw({ heavy: false, bolt: 'soul', wind: 0.18, fly: 0.3 }, [60, 300]);
  assert.equal(held.out[1], free.out[1], 'the shooter stepping off after the release moves nothing: the lane holds its start');
});

// the proposed skills (docs/skill-trees-proposal.md): each has a moment of its own, drawn for the owner's review
test('the proposed skills each draw a moment of their own, and no two alike', async () => {
  const { PROPOSED_MOMENTS } = await import('../src/render/skillfx.js');
  assert.equal(PROPOSED_MOMENTS.length, 20);
  const sig = new Map();
  for (const id of PROPOSED_MOMENTS) {
    const pts = [];
    const P = { depth() {}, flush() {}, mark: (x, y, a) => { if (a > 0.01) pts.push(`${Math.round(x)},${Math.round(y)}`); }, disc: (x, y, r, a) => { if (a > 0.01) pts.push(`${Math.round(x)},${Math.round(y)}`); }, seg: (x0, y0, x1, y1, a0, a1) => { if (Math.max(a0, a1) > 0.01) pts.push(`${Math.round(x0)},${Math.round(y0)}-${Math.round(x1)},${Math.round(y1)}`); }, star: (x, y, r, a) => { if (a > 0.01) pts.push(`*${Math.round(x)},${Math.round(y)}`); } };
    const fx = createSkillFX(P), proj = (x, y) => ({ sx: 200 + (x - y) * 8, sy: 200 + (x + y) * 4, h: 0, key: x + y });
    fx.event({ id, at: 'land', cls: 'x', by: null, x: 3, y: 5, tid: null, ally: false, tx: 6, ty: 4, r: 3, reached: [{ id: null, x: 7, y: 5 }, { id: null, x: 5, y: 3 }], crit: false, marks: 3 }, 0);
    for (const t of [60, 200, 420, 900, 1300]) fx.draw(t, proj, []);
    assert.ok(pts.length >= 6, `${id} draws: ${pts.length}`);
    const s = pts.join('|'); assert.ok(!sig.has(s), `${id} draws as ${sig.get(s)} does`); sig.set(s, id);
  }
});
