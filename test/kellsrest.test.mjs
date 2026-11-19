// Kell's Rest is a place on the Reach, not a town (GDD v1.132, world doc v1.57; the owner: "Why two town centers with
// services kells rest and ash gate. Shouldnt kells rest just be a regular overworld area?"). The Assay's depot stands on
// the overland by the Kell road with its name on the land; there's no way in, no square, no services and no coach stop;
// its people are met at the Assay Yards' gate (test/act3.test.mjs). A save made in its square (v54) loads on the Reach by
// the depot (save v55, persist/save.js depotFor55); home from the Yards is Ashgate. Save v56 drops `town` (one town a
// land: it was always the land's own; dropTown56).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { createOutdoor, oIsWalkable, REACH } from '../src/sim/outdoor.js';
import { COACH } from '../src/sim/coach.js';
import { NPCS } from '../src/sim/npcs.js';
import { QUESTS } from '../src/sim/quests.js';
import { SHOPKEEP } from '../src/sim/smith.js';
import { makeItem } from '../src/sim/items.js';
import { migrate, depotFor55, dropTown56, SAVE_VERSION } from '../src/persist/save.js';

const SEED = 20260807;
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const standAt = (sim, e) => { const p = sim.state.player; p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; };

test("Kell's Rest is a place on the Reach: its name on the land, the depot standing, and Ashgate the only way into a town", () => {
  const o = createOutdoor(SEED, 'overland', 'reach'), k = REACH.kells;
  const lab = o.labels.find((l) => l.text === "Kell's Rest"); assert.ok(lab, 'its name on the land');
  assert.ok(Math.hypot(lab.x - k[0], lab.y - k[1]) < 1);
  assert.ok(o.structs.filter((s) => Math.hypot(s.x - k[0], s.y - k[1]) < 18 && /^reach_/.test(s.id)).length >= 4, 'the depot\'s houses stand');
  const towns = o.exits.filter((e) => e.to === 'town'); assert.equal(towns.length, 1, 'one way into a town');
  assert.ok(o.arrivals.kells_rest && oIsWalkable(o, o.arrivals.kells_rest.x, o.arrivals.kells_rest.y), 'by the depot: where a save from its square comes back');
  // the Reach's town is Ashgate (one town a land); and the coach has no stop at the depot
  assert.equal(createOutdoor(SEED, 'town', 'reach').name, 'Ashgate');
  assert.ok(!('kells_rest' in COACH));
  assert.ok(!('kells_rest' in SHOPKEEP), 'nobody keeps a Company Store');
  assert.ok(['nan_ruddock', 'assay_clerk'].every((id) => NPCS[id].found && NPCS[id].found.site === 'assay_yards'), "Kell's Rest's two at the Yards' gate");
  const pass = QUESTS.ch3_paid_by_weight.steps[0].objectives[0]; assert.deepEqual([pass.type, pass.npc, pass.site], ['meet', 'assay_clerk', 'assay_yards'], "Davy Pruett's word, at the Yards' gate");
});

test("the coach won't go to Kell's Rest, and takes nothing for the asking", () => {
  const s = createSim(SEED, undefined, { scene: 'town', region: 'reach' }); s.tick();
  const h = s.world.hub, p = s.state.player; p.x = p.px = h.x + 0.5; p.y = p.py = h.y + 4.5; s.state.counters.gold = 100;
  s.commands.push({ type: 'coach', to: 'kells_rest' }); s.tick();
  assert.equal(s.world.name, 'Ashgate'); assert.equal(s.state.counters.gold, 100);
});

test('home from the Assay Yards is Ashgate: a Homeward Scroll, and a wipe', () => {
  const into = () => { const s = createSim(SEED, undefined, { scene: 'overland', region: 'reach' }); s.tick(); standAt(s, s.world.exits.find((e) => e.to === 'dungeon' && e.site === 'assay_yards')); s.tick(); assert.equal(s.state.site, 'assay_yards'); return s; };
  const a = into(), it = makeItem('homeward', 1, 'common', { uid: 'hw1' }); a.state.bag.push(it); a.commands.push({ type: 'useItem', uid: it.uid }); a.tick();
  assert.equal(a.world.name, 'Ashgate');
  const b = into(), L = b.world.level, r = L.rooms.find((q) => q !== L.entrance), p = b.state.player; p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  let got = null; b.bus.on('defeat', (e) => { got = e; });
  for (let i = 0; i < 20 * 180 && !got; i++) { for (const m of b.state.party) if (!m.down) m.hp = Math.min(m.hp, 3); b.tick(); }
  assert.ok(got, 'the party fell'); assert.equal(b.world.name, 'Ashgate');
});

test("save v55: a save in Kell's Rest's square loads on the Reach by the depot; its stop and shelves forgotten; elsewhere it reads as Ashgate", () => {
  const base = snap((() => { const s = createSim(SEED, undefined, { scene: 'overland', region: 'reach' }); s.tick(); return s; })());
  const inSquare = { ...base, scene: 'town', town: 'kells_rest', reached: ['thornwick', 'ashgate', 'kells_rest'], shops: { ashgate: { day: 1, lv: 20, bought: [] }, kells_rest: { day: 1, lv: 20, bought: [] } }, player: { x: 60, y: 60, dir: 'down' } };
  const m = migrate({ version: 54, savedAt: 1, data: inSquare });
  assert.equal(m.version, SAVE_VERSION);
  assert.deepEqual([m.data.scene, m.data.region], ['overland', 'reach']); assert.ok(!('town' in m.data), 'v56: no town');
  assert.deepEqual(m.data.reached, ['thornwick', 'ashgate']); assert.deepEqual(Object.keys(m.data.shops), ['ashgate']);
  const t = createSim(SEED); t.restore(m.data);
  assert.equal(t.world.kind, 'overland'); assert.equal(t.world.region, 'reach');
  const q = t.world.arrivals.kells_rest; assert.ok(Math.hypot(t.state.player.x - q.x, t.state.player.y - q.y) < 1, 'by the depot');
  // in the Yards, or on the land, with Kell's Rest the town last stood in: where it was, its town Ashgate
  const yards = depotFor55({ ...base, scene: 'dungeon', site: 'assay_yards', town: 'kells_rest' });
  assert.deepEqual([yards.scene, yards.site, yards.town], ['dungeon', 'assay_yards', 'ashgate']);
  // a save that never stood there: as it was
  assert.deepEqual(depotFor55({ ...base, town: 'ashgate' }), { ...base, town: 'ashgate' });
});

test('save v56: `town` dropped (one town a land, so it was always the land\'s own); a save without one as it was', () => {
  assert.equal(SAVE_VERSION, 56);
  const base = snap((() => { const s = createSim(SEED, undefined, { scene: 'town', region: 'reach' }); s.tick(); return s; })());
  assert.ok(!('town' in base), 'the snapshot has none');
  assert.deepEqual(dropTown56({ ...base, town: 'ashgate' }), base); assert.deepEqual(dropTown56(base), base);
  const m = migrate({ version: 55, savedAt: 1, data: { ...base, town: 'ashgate' } });
  assert.equal(m.version, 56); assert.ok(!('town' in m.data)); assert.ok(!('town' in m.meta));
  const t = createSim(SEED); t.restore(m.data); assert.equal(t.world.name, 'Ashgate');
});
