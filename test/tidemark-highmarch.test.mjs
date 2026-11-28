// Highmarch (GDD v1.154; docs/tidemark-plan.md, step 6): the Tidemark's third band, 41–45, two floors (the walls on the
// ramparts kit, the Seventh's Palace on the new `palace` kit), its door at the gate on the Highmarch road. The
// legionaries' tower shields and the engineers' pitch; the Seventh's Champion's wall; Lucan's Canticle, and Lucan beaten,
// not killed: he sits down on his steps, is spoken to there, and walks north. The Seventh Voice ends Act IV and opens the
// Heights.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { SITES, levelBand, bossAt } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { ENEMIES, FAMILIES, BOSSES, shieldShare, SHIELD_K, SHIELD_LOCK, WALL_K, WALL_N, WALL_FIRST, CANT_FIRST, CANT_T, CANT_BREAK, SPARE_AT, PITCH_MAX } from '../src/sim/battle.js';
import { statsFor } from '../src/sim/party.js';
import { NPCS } from '../src/sim/npcs.js';
import { QUESTS } from '../src/sim/quests.js';
import { LANDS } from '../src/sim/regions.js';
import { HEIRLOOMS, starterKit } from '../src/sim/items.js';
import { isWalkable, DRESS } from '../src/sim/world.js';
import { autoAllocate } from '../src/sim/attributes.js';

const down = (sim) => { const s = sim.world.stairsAt, p = sim.state.player; p.x = p.px = s.x + 0.5; p.y = p.py = s.y + 1.5; sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick(); };
/** a boss's hall on its floor (0 the walls, 1 the palace), a hero at its level who'll stand through it, in its middle */
function hall(depth, lv, seed = 20260807) {
  const sim = createSim(seed, undefined, { scene: 'dungeon', site: 'highmarch' });
  const H = sim.state.party[0]; H.level = lv; H.attrs = null; autoAllocate(H); H.gear = starterKit(H); H.hp = statsFor(H).maxHp;
  sim.tick();
  for (let d = 0; d < depth; d++) down(sim);
  const L = sim.world.level, r = L.descentRoom, p = sim.state.player;
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number), d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  return { sim, H, max: statsFor(H).maxHp };
}
const bossOf = (sim) => (sim.world.enemies || []).find((e) => e.boss);

test('Highmarch: a band of five on the Tidemark, its plan to the rules, the walls then the Seventh Tower, the Champion and Lucan', () => {
  const S = SITES.highmarch, P = PLANS.highmarch;
  assert.equal(S.region, 'tidemark'); assert.equal(levelBand('highmarch'), '41–45');
  assert.equal(bossAt('highmarch', 0), 'champion'); assert.equal(bossAt('highmarch', 1), 'lucan');
  assert.deepEqual(checkPlan(P), []);
  assert.deepEqual(P.floors.map((f) => [...new Set(f.spaces.map((s) => s.kit))]), [['ramparts'], ['ramparts', 'barracks', 'quota', 'crypt']]);   // (v1.166: the tower, not the palace: its yard and roof the walls' ramparts, its hall and counting room, its chapel)
  assert.deepEqual(P.floors.map((f) => [Math.min(...f.spaces.map((s) => s.lv)), Math.max(...f.spaces.map((s) => s.lv))]), [[0, 2], [3, 4]]);
  assert.ok(P.floors[1].spaces.some((s) => s.id === 'the_stewards_room' && s.role === 'offshoot'), 'the Kindler\'s letters');
  assert.ok(DRESS.palace, 'the palace kit'); assert.ok(DRESS.tower, 'the tower\'s');
  assert.equal(P.floors[1].name, 'The Seventh Tower'); assert.equal(P.floors[1].spaces.find((s) => s.boss === 'lucan').id, 'the_roof');
});

test('the palace kept for the end of the game: the Glass Keep, parked, its plan the palace floor that was Highmarch\'s', () => {
  const S = SITES.glass_keep, P = PLANS.glass_keep;
  assert.equal(S.region, 'heights'); assert.ok(S.parked, 'on no land yet'); assert.deepEqual(checkPlan(P), []);
  assert.deepEqual([...new Set(P.floors[0].spaces.map((s) => s.kit))], ['palace']); assert.ok(P.floors[0].spaces.every((s) => !s.boss), 'nobody on the throne');
});

test('the gate walks into the walls, the bastion stair down into the tower; its chapel\'s empty stand, no throne', () => {
  const sim = createSim(7, undefined, { scene: 'overland', region: 'tidemark' }); sim.tick();
  const door = sim.world.exits.find((e) => e.site === 'highmarch'), p = sim.state.player;
  p.x = p.px = (door.x0 + door.x1) / 2; p.y = p.py = (door.y0 + door.y1) / 2; for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.world.kind, 'dungeon'); assert.equal(sim.world.site, 'highmarch');
  assert.ok(isWalkable(sim.world, sim.state.player.x, sim.state.player.y), 'in at the breach');
  down(sim); assert.equal(sim.state.depth, 1, 'down into the tower');
  const props = [...sim.world.props.values()];
  assert.equal(props.filter((k) => k === 'throne').length, 0, 'no throne: Lucan sings from the stand'); assert.equal(props.filter((k) => k === 'reliquary').length, 1, 'where the box stood');
});

test('the march\'s foes: legionaries with tower shields, siege engineers with pitch; the palace\'s drowned are the dead', () => {
  assert.ok(ENEMIES.legionary.shield); assert.equal(ENEMIES.engineer.bolt, 'pitch');
  const W = FAMILIES.siege, P = FAMILIES.palace;
  assert.deepEqual([W.melee, W.ranged, W.elite], [['legionary', 'warhound'], ['engineer', 'crossbow'], 'legionary']);
  for (const k of [...W.melee, ...W.ranged, ...P.melee, ...P.ranged]) assert.ok(ENEMIES[k], k);
  assert.equal(W.undead('legionary'), false); assert.equal(P.undead('drowned'), true); assert.equal(P.undead('legionary'), false);
  assert.equal(BOSSES.champion.mech, 'shieldwall'); assert.equal(BOSSES.lucan.mech, 'canticle'); assert.ok(BOSSES.lucan.once);
  for (const b of ['champion', 'lucan']) assert.ok(HEIRLOOMS[BOSSES[b].heirloom], BOSSES[b].heirloom);
});

test('a tower shield turns a blow from in front, more beside another; none from behind, and none while he\'s held', () => {
  const leg = { shield: true, fx: 1, fy: 0, x: 0, y: 0, hp: 1 }, front = { x: 2, y: 0.5 }, behind = { x: -2, y: 0 }, flank = { x: 0, y: 2 };
  assert.equal(shieldShare(leg, front, [leg]), SHIELD_K);
  assert.equal(shieldShare(leg, front, [leg, { shield: true, hp: 1, x: 0, y: 1.6 }]), SHIELD_LOCK, 'shoulder to shoulder');
  assert.equal(shieldShare(leg, front, [leg, { shield: true, hp: 1, x: 0, y: 1.6, stun: 1 }]), SHIELD_K, 'a held neighbour locks nothing');
  assert.equal(shieldShare(leg, behind, [leg]), 1); assert.equal(shieldShare(leg, flank, [leg]), 1, 'from the side');
  for (const k of ['stun', 'frozen', 'knocked']) assert.equal(shieldShare({ ...leg, [k]: 1 }, front, [leg]), 1, k);
  // the Champion's front while two of his wall stand unheld
  const ch = { boss: 'champion', id: 9, fx: 1, fy: 0, x: 0, y: 0, hp: 1 }, wall = (o = {}) => ({ wallOf: 9, hp: 1, x: 2, y: 0, ...o });
  assert.equal(shieldShare(ch, front, [ch, wall(), wall()]), WALL_K);
  assert.equal(shieldShare(ch, front, [ch, wall(), wall({ knocked: 1 })]), 1, 'one knocked down: the line is broken');
  assert.equal(shieldShare(ch, behind, [ch, wall(), wall()]), 1, 'round it');
});

test('the Champion calls his wall: his legionaries in a line in front of him, between him and the company', () => {
  const { sim, H, max } = hall(0, 43), walls = [];
  sim.bus.on('bossWall', (e) => walls.push(e));
  for (let i = 0; i < 20 * (WALL_FIRST + 3) && !walls.length; i++) { H.hp = max; sim.tick(); }
  assert.equal(walls.length, 1, 'called'); const e = walls[0], ch = bossOf(sim);
  assert.equal(e.n, WALL_N); assert.equal(e.reached.length, WALL_N);
  const line = sim.world.enemies.filter((o) => o.wallOf === ch.id && o.hp > 0);
  assert.equal(line.length, WALL_N, 'his legionaries in it'); assert.ok(line.every((o) => o.kind === 'legionary' && o.wallAt));
  const p = sim.state.player, toUs = Math.hypot(p.x - ch.x, p.y - ch.y);
  assert.ok(e.reached.every((q) => Math.hypot(q.x - p.x, q.y - p.y) < toUs + 0.5), 'on the company\'s side of him');
});

test('Lucan sings: a ring goes out from him, and unbroken, the hall\'s fallen stand up again as his', () => {
  const { sim, H, max } = hall(1, 45), tells = [], songs = [];
  sim.bus.on('tell', (e) => { if (e.kind === 'canticle') tells.push(e); });
  sim.bus.on('bossCanticle', (e) => songs.push(e));
  const keep = () => { H.hp = max; const L = bossOf(sim); if (L && !L.fled) L.hp = L.maxHp; };   // (nobody hurts him: the song runs its course)
  for (let i = 0; i < 20 * (CANT_FIRST + CANT_T + 2) && !songs.length; i++) { keep(); for (const o of sim.world.enemies) if (!o.boss && o.hp > 0 && !o.issued && sim.state.t > CANT_FIRST - 2) { o.hp = 0; o.dead = 1; } sim.tick(); }
  assert.ok(tells.length >= 1 && tells[0].wind === CANT_T, 'the ring, told');
  assert.equal(songs.length, 1); assert.equal(songs[0].broken, false);
});

test('a song breaks when he\'s hurt enough while he sings', () => {
  const { sim, H, max } = hall(1, 45), songs = []; let singing = false;
  sim.bus.on('bossSing', () => { singing = true; }); sim.bus.on('bossCanticle', (e) => songs.push(e));
  for (let i = 0; i < 20 * (CANT_FIRST + CANT_T + 2) && !songs.length; i++) {
    H.hp = max; const L = bossOf(sim);
    if (singing && L && L.singing > 0 && L.hp > L.maxHp * 0.5) L.hp -= Math.ceil(L.maxHp * CANT_BREAK) + 1;   // (as if struck hard)
    sim.tick();
  }
  assert.equal(songs.length, 1); assert.equal(songs[0].broken, true);
});

test('beaten, not killed: at a tenth of his life Lucan sits down on his steps, his fall for the story; spoken to there, he goes north', () => {
  const { sim, H, max } = hall(1, 45), ev = [];
  for (const k of ['bossSpared', 'bossDown']) sim.bus.on(k, (e) => ev.push({ k, ...e }));
  for (let i = 0; i < 40; i++) { H.hp = max; sim.tick(); }
  const L = bossOf(sim); assert.equal(L.boss, 'lucan');
  L.hp = Math.floor(L.maxHp * SPARE_AT); for (let i = 0; i < 5; i++) { H.hp = max; sim.tick(); }
  assert.deepEqual(ev.map((e) => e.k), ['bossSpared', 'bossDown']);
  assert.ok(ev[1].fled && ev[1].spared, 'his fall, for the story'); assert.equal(sim.state.bosses.lucan, 1);
  const npc = sim.world.npcs.find((n) => n.id === 'lucan'); assert.ok(npc && npc.found && npc.visitor, 'on his steps, to be spoken to');
  assert.ok(sim.battle.quiet, 'the throne room goes quiet');
  // the next visit he's still there (npcs.js `after`), until he's said his piece
  const again = createSim(1); again.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())) });
  assert.ok(again.world.npcs.some((n) => n.id === 'lucan'), 'still on his steps');
  const s = JSON.parse(JSON.stringify(sim.snapshot())); s.flags = { ...(s.flags || {}), lucan_gone: 1 };
  const gone = createSim(1); gone.restore(s); assert.ok(!gone.world.npcs.some((n) => n.id === 'lucan'), 'gone north');
  // and never before he's beaten
  const fresh = hall(1, 45).sim; assert.ok(!fresh.world.npcs.some((n) => n.id === 'lucan'));
});

test('a blow that would kill Lucan leaves him standing to sit down', () => {
  const { sim, H, max } = hall(1, 45); let spared = 0; sim.bus.on('bossSpared', () => spared++);
  for (let i = 0; i < 40; i++) { H.hp = max; sim.tick(); }
  const L = bossOf(sim); L.hp = 1; for (let i = 0; i < 3; i++) { H.hp = max; sim.tick(); }
  assert.equal(spared, 1);
});

test('the engineers\' pitch burns where it lands, a few patches at once', () => {
  const { sim, H, max } = hall(0, 43);
  for (let i = 0; i < 20 * 60 && !(sim.battle && sim.battle.hazards.some((h) => h.kind === 'pitch')); i++) { H.hp = max; sim.tick(); }
  const pitch = sim.battle.hazards.filter((h) => h.kind === 'pitch');
  assert.ok(pitch.length >= 1 && pitch.length <= PITCH_MAX, `pitch: ${pitch.length}`);
});

test('The Seventh Voice: Hester\'s, after Brine Cross; the Champion, Lucan, a word with him; Hester takes it in, and the Heights open', () => {
  const Q = QUESTS.ch4_seventh_voice;
  assert.equal(Q.giver, 'hester_quaile'); assert.ok(!Q.turnin || Q.turnin === 'hester_quaile'); assert.deepEqual(Q.after, ['ch4_brine_cross']);
  assert.deepEqual(Q.steps.map((s) => s.objectives[0]), [
    { type: 'boss', site: 'highmarch', boss: 'champion', count: 1 }, { type: 'boss', site: 'highmarch', boss: 'lucan', count: 1 },
    { type: 'meet', npc: 'lucan', site: 'highmarch', count: 1 }]);
  assert.equal(LANDS.heights.opens, 'ch4_seventh_voice');
  assert.deepEqual(NPCS.lucan.found, { site: 'highmarch', depth: 1, boss: 'lucan', after: true }); assert.equal(NPCS.lucan.visitor, 'lucan_gone');
});

test('the Journal\'s leads: Highmarch once Brine Cross is held, the Champion then Lucan', async () => {
  const { openLeads } = await import('../src/ui/storystatus.js');
  const st = (bosses) => ({ party: [], bench: [], bosses: { harbourmaster: 1, hesk: 1, ...bosses }, flags: { brine_held: 1 } }), status = () => 3;
  assert.ok(openLeads(st({}), status, 'tidemark').some((l) => l.id === 'champion'));
  assert.ok(openLeads(st({ champion: 1 }), status, 'tidemark').some((l) => l.id === 'lucan'));
  assert.ok(!openLeads(st({ champion: 1, lucan: 1 }), status, 'tidemark').some((l) => l.id === 'lucan' || l.id === 'champion'));
  assert.ok(!openLeads({ party: [], bench: [], bosses: { harbourmaster: 1, hesk: 1 }, flags: {} }, status, 'tidemark').some((l) => l.id === 'champion'), 'not before Brine Cross');
});

test('the chapter follows it through: Lucan beaten, a word with him on his steps, he goes north, and it\'s ready for Hester', () => {
  const { sim, H, max } = hall(1, 45);
  sim.state.bosses = { ...(sim.state.bosses || {}), champion: 1 };
  sim.state.quests.ch4_seventh_voice = { st: 1, step: 1, n: [0] };
  for (let i = 0; i < 40; i++) { H.hp = max; sim.tick(); }
  const L = bossOf(sim); L.hp = Math.floor(L.maxHp * SPARE_AT); for (let i = 0; i < 5; i++) { H.hp = max; sim.tick(); }
  assert.equal(sim.state.quests.ch4_seventh_voice.step, 2, 'on to the word with him');
  const n = sim.world.npcs.find((q) => q.id === 'lucan'), p = sim.state.player;
  p.x = p.px = n.x + 1; p.y = p.py = n.y; sim.commands.push({ type: 'talk', npc: 'lucan' }); sim.tick();
  sim.commands.push({ type: 'dialogueEffect', tag: 'flag', args: ['set', 'lucan_gone'] }); sim.tick();   // (lucan.ink's last tag)
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  assert.equal(sim.state.flags.lucan_gone, 1);
  assert.ok(!sim.world.npcs.some((q) => q.id === 'lucan'), 'gone north');
  assert.equal(sim.state.quests.ch4_seventh_voice.st, 2, 'ready to hand in');
});
