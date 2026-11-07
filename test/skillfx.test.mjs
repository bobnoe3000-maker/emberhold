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
