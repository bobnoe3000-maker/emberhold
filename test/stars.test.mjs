// A dungeon's stars (sim/stars.js; GDD v1.143; the owner, 2026-11-23: "one star completed, two stars if under a
// reasonable time and 3 stars if completed quickly including the boss without dying"). A run starts at a site's door
// and ends at its end (the last floor's boss, a secret's vault, a boss-less site's end-room chest) without leaving; the
// record keeps the best; it rides the save; a raid's run doesn't count; nothing is granted.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { PAR, starsFor, endOf, starsOf } from '../src/sim/stars.js';
import { SITES } from '../src/sim/sites.js';
import { migrate } from '../src/persist/save.js';

const SEED = 20260807;
/** a company walked in at the Old Barrows' door from the Vale's overland */
function atDoor(site = 'barrows') {
  const sim = createSim(SEED, undefined, { scene: 'overland', region: SITES[site].region }); sim.tick();
  const ex = sim.world.exits.find((e) => e.to === 'dungeon' && e.site === site), p = sim.state.player;
  p.x = p.px = (ex.x0 + ex.x1) / 2; p.y = p.py = (ex.y0 + ex.y1) / 2; sim.tick();
  assert.equal(sim.state.scene, 'dungeon'); assert.equal(sim.state.site, site);
  return sim;
}
const heard = (sim) => { const out = []; sim.bus.on('dungeonStars', (e) => out.push(e)); return out; };
/** play `secs` of sim time passing (the clock alone) */
const pass = (sim, secs) => { sim.state.t += secs; };
/** the site's last boss down on its last floor (the event battle.js sends) */
const endBoss = (sim, site = 'barrows') => { sim.state.depth = SITES[site].floors - 1; sim.bus.emit('bossDown', { id: endOf(site).boss, name: 'x', first: true, x: 0, y: 0, lvl: 3 }); };

/** a prop of that kind on the floor, the hero beside it, and a tap on it (the harvest command, as the UI sends it) */
function use(sim, kind) {
  if (kind === 'exit') { const e = sim.world.exitAt, p = sim.state.player; for (let i = 0; i < 10 && sim.state.scene === 'dungeon'; i++) { p.x = p.px = e.x; p.y = p.py = e.y; sim.tick(); } return; }   // (the way out: walked onto, core.js exitAt)
  let at = null; for (const [k, v] of sim.world.props) if (v === kind) { at = k.split(',').map(Number); break; }
  assert.ok(at, `a ${kind} on the floor`);
  const p = sim.state.player; p.x = p.px = at[0] + 0.5; p.y = p.py = at[1] + 1.5; sim.commands.push({ type: 'harvest', tx: at[0], ty: at[1] }); sim.tick();
}

test('the rules: three for quick and clean, two for a reasonable time, one for the end reached', () => {
  const [q, r] = PAR.barrows;
  assert.equal(starsFor('barrows', q * 60, 0), 3);
  assert.equal(starsFor('barrows', q * 60, 1), 2, 'quick, but somebody went down: two');
  assert.equal(starsFor('barrows', q * 60 + 1, 0), 2);
  assert.equal(starsFor('barrows', r * 60, 3), 2);
  assert.equal(starsFor('barrows', r * 60 + 1, 0), 1);
  assert.equal(starsFor('mere_tower', 1, 0), 0, 'no end, no stars');
  for (const [k, [a, b]] of Object.entries(PAR)) { assert.ok(SITES[k], k); assert.ok(a > 0 && b > a, `${k}: quick under reasonable`); }
  for (const k of Object.keys(SITES)) if (!SITES[k].parked && !['mere_tower', 'bowl', 'proving_pens'].includes(k)) assert.ok(PAR[k], `${k} has a par`);
  assert.equal(endOf('barrows').boss, 'quartermaster'); assert.equal(endOf('cinderworks').boss, 'stoker');
  assert.deepEqual(endOf('ninth_milestone'), { boss: null, secret: true }); assert.deepEqual(endOf('haddow_crypt'), { boss: null, secret: false });
});

test('a run from the door to the Quartermaster: its stars, its time, the record', () => {
  const sim = atDoor(), ev = heard(sim);
  assert.equal(sim.state.starRun.site, 'barrows'); assert.equal(sim.state.starRun.downs, 0);
  pass(sim, PAR.barrows[0] * 60 - 30); endBoss(sim);
  assert.equal(ev.length, 1); assert.equal(ev[0].n, 3); assert.equal(ev[0].site, 'barrows'); assert.equal(ev[0].was, 0);
  assert.equal(sim.state.starRun, null, 'the run is over');
  assert.equal(sim.state.stars.barrows.n, 3); assert.equal(sim.state.stars.barrows.runs, 1); assert.ok(sim.state.stars.barrows.clean);
  // the boss again, the same visit: no second run
  endBoss(sim); assert.equal(ev.length, 1);
});

test('a down on the way: quick but not clean, two stars; slow, one; the record keeps the best', () => {
  const a = atDoor(), ea = heard(a);
  a.bus.emit('combat', { t: 'down', x: 0, y: 0, name: 'A', rival: false });
  a.bus.emit('combat', { t: 'down', x: 0, y: 0, name: 'Rival', rival: true });   // (a rival's down in the Bowl isn't ours)
  pass(a, 60); endBoss(a);
  assert.equal(ea[0].n, 2); assert.equal(ea[0].downs, 1); assert.equal(a.state.stars.barrows.clean, false);
  // a slower one after: one star, the record stays at two and its best time stays the quick one
  const best = a.state.stars.barrows.best, p = a.state.player;
  a.state.depth = 0; use(a, 'exit'); assert.equal(a.state.scene, 'overland');
  const ex = a.world.exits.find((e) => e.to === 'dungeon' && e.site === 'barrows');
  for (let i = 0; i < 40 && a.state.scene !== 'dungeon'; i++) { p.x = p.px = (ex.x0 + ex.x1) / 2; p.y = p.py = (ex.y0 + ex.y1) / 2; a.tick(); }
  assert.equal(a.state.starRun.site, 'barrows', 'in again: a new run');
  pass(a, PAR.barrows[1] * 60 + 60); endBoss(a);
  assert.equal(ea[1].n, 1); assert.equal(ea[1].was, 2);
  assert.equal(a.state.stars.barrows.n, 2); assert.equal(a.state.stars.barrows.best, best); assert.equal(a.state.stars.barrows.runs, 2);
});


test('the stairs keep the run; the way out ends it, and a boss with no run gives nothing', () => {
  const sim = atDoor(), ev = heard(sim);
  pass(sim, 60); use(sim, 'stairs');
  assert.equal(sim.state.depth, 1, 'down the stairs'); assert.equal(sim.state.starRun.site, 'barrows', 'the run goes on down');
  const out = atDoor(), ev2 = heard(out);
  use(out, 'exit'); assert.notEqual(out.state.scene, 'dungeon'); assert.equal(out.state.starRun, null, 'out of the door: no run');
  endBoss(out); assert.equal(ev2.length + ev.length, 0, 'a boss with no run under way gives nothing');
});

test('a boss-less site ends at its end room\'s chest; a secret at its vault', () => {
  const sim = atDoor('haddow_crypt'), ev = heard(sim), L = sim.world.level, end = L.rooms.find((r) => r.role === 'end');
  assert.ok(end, 'an end room');
  let cell = null; for (const [k, c] of L.cells) if (c.room === end.id) { cell = k.split(',').map(Number); break; }
  const other = L.rooms.find((r) => r.role !== 'end'); let oc = null; for (const [k, c] of L.cells) if (c.room === other.id) { oc = k.split(',').map(Number); break; }
  sim.bus.emit('looted', { tx: oc[0], ty: oc[1], kind: 'chest' }); assert.equal(ev.length, 0, 'a chest elsewhere is just a chest');
  pass(sim, 60); sim.bus.emit('looted', { tx: cell[0], ty: cell[1], kind: 'chest' });
  assert.equal(ev.length, 1); assert.equal(ev[0].site, 'haddow_crypt'); assert.equal(ev[0].n, 3);
});

test('a raid\'s run doesn\'t count; the stars ride the save; an older save has none', () => {
  const sim = atDoor(), ev = heard(sim);
  pass(sim, 60); endBoss(sim);
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  assert.equal(snap.stars.barrows.n, 3);
  const r = createSim(SEED); r.restore(snap); assert.deepEqual(r.state.stars, sim.state.stars);
  r.restore({ ...snap, stars: { barrows: { n: 9, best: 'x', clean: 1 }, nowhere: { n: 3 } } });
  assert.deepEqual(r.state.stars, { barrows: { n: 3, best: null, clean: true, runs: 0 } }, 'junk read back sanely');
  assert.deepEqual(starsOf({}), {});
  const old = { ...snap }; delete old.stars; delete old.starRun;
  const m = migrate({ version: 56, savedAt: 1, data: old }); assert.deepEqual(m.data.stars, {}); assert.equal(m.data.starRun, null);
  // a run under way rides the save too
  const s2 = atDoor(); pass(s2, 30); const sn = JSON.parse(JSON.stringify(s2.snapshot()));
  const r2 = createSim(SEED); r2.restore(sn); assert.equal(r2.state.starRun.site, 'barrows');
  assert.equal(ev.length, 1);
});

test('every run can end: a site with no last boss has a chest in its end room, or its vault (v1.146: the Shuttered Inn had neither)', async () => {
  const { createWorld } = await import('../src/sim/world.js');
  for (const site of Object.keys(PAR)) {
    const end = endOf(site); if (end.boss) continue;
    const w = createWorld(SEED, undefined, SITES[site].floors - 1, site), L = w.level, room = L.rooms.find((r) => r.role === 'end') || L.descentRoom;
    assert.ok(room, `${site}: an end room`);
    let chest = false; for (const [k, v] of w.props) { const c = L.cells.get(k); if (v === 'chest' && c && c.room === room.id) chest = true; }
    assert.ok(chest, `${site}: a chest in ${room.name || room.id}`);
  }
});
