// Raids (GDD §18 v1.97, sim/raid.js, docs/party-up-raids-proposal.md; the owner, 2026-11-14: "3 per hero, when set out,
// dungeon as is, no penalty for loss, start with what we have, use the term Raid"): who may set out and where, the
// stand-ins and the seats they fill, a room held its six waves and won, the gate dropped for the run only, a run played to
// its end and its coffer, a wipe that costs nothing, the company given back, a save made on a raid, and the record saved.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { statsFor } from '../src/sim/party.js';
import { DAY_S } from '../src/sim/heroes.js';
import { RAID, RAID_SITES, standIns, cofferOf, restoreRaid, raidOf } from '../src/sim/raid.js';
import { makeRival } from '../src/sim/rivals.js';
import { BASES } from '../src/sim/items.js';

const SEED = 20261114;
/** a made hero at a level, two hires, in Thornwick's square */
function company(level = 3, cls = 'fighter', hires = [1, 3]) {
  const s = createSim(SEED, undefined, { scene: 'town' });
  s.commands.push({ type: 'createHero', cls, look: cls === 'fighter' ? 'hero_knight' : 'hero_rogue', origin: 'thornwick_born', name: 'Ada' }); s.tick();
  for (const i of hires) { s.state.counters.gold = 1e9; s.commands.push({ type: 'hire', idx: i }); s.tick(); }
  s.state.counters.gold = 500;
  const H = s.state.party[0], twin = makeRival({ id: 'h', name: 'Ada', cls, level, grade: RAID.grade });
  H.level = level; H.gear = twin.gear; H.skills = twin.skills; s.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1 };
  for (const m of s.state.party) { m.level = level; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; }
  return s;
}
const events = (s) => { const out = { refused: [], end: [], room: [] }; s.bus.on('refused', (e) => out.refused.push(e.reason)); s.bus.on('raidEnd', (e) => out.end.push(e)); s.bus.on('raidRoom', (e) => out.room.push(e)); return out; };
const go = (s, site = 'barrows', seats = ['any', 'any']) => { s.commands.push({ type: 'raidOut', site, seats }); s.tick(); };
/** play the run as a player would (tools/balance/raid.mjs): rest in the corridors, the gate's room, then the way on */
function play(s, mins = 40) {
  const t0 = s.state.t;
  while (s.raid && !s.raid.done && s.state.t - t0 < mins * 60) {
    const p = s.state.player, b = s.battle;
    if (!b && s.state.party.some((m) => !m.down && (m.hp < statsFor(m).maxHp * 0.9 || m.mp < statsFor(m).maxMp * 0.6))) { if (p.path) s.commands.push({ type: 'cancelWalk' }); s.tick(); continue; }
    if (!(b && !b.quiet) && !p.path) {
      const r = s.destinations(), q = ['gate', 'stairs-down', 'last-hall', 'next-room'].map((k) => r.find((x) => x.id === k && !x.off)).find(Boolean);
      if (q) s.commands.push({ type: 'goto', tx: q.tx, ty: q.ty, near: q.near, then: q.then || null, label: q.label, room: q.room });
    }
    s.tick();
  }
}

test('the dungeons a raid goes to: the band dungeons, in band order', () => {
  assert.deepEqual(RAID_SITES, ['barrows', 'wickham_keep', 'sunken_chapel', 'toadking_mound', 'canal_locks', 'drowned_abbey']);
});

test('setting out: refused below the band, in a land not open, mid-fight; three a day, spent on setting out', () => {
  const s = company(3), ev = events(s);
  go(s, 'wickham_keep'); assert.equal(s.raid, null); assert.match(ev.refused.pop(), /level 4/);
  go(s, 'toadking_mound'); assert.equal(s.raid, null);                         // (the Fens aren't open yet; and level 10)
  go(s, 'nowhere'); assert.equal(s.raid, null);
  const home = s.state.party.map((m) => m.id);
  for (let i = 0; i < RAID.perDay; i++) {
    go(s, 'barrows'); assert.ok(s.raid, `raid ${i + 1} set out`);
    assert.equal(raidOf(s.state).used, i + 1);
    s.commands.push({ type: 'raidLeave' }); s.tick();
    assert.equal(s.raid, null); assert.deepEqual(s.state.party.map((m) => m.id), home, 'the company back as it was');
    assert.equal(s.world.kind, 'town', 'back where it set out');
  }
  go(s, 'barrows'); assert.equal(s.raid, null); assert.match(ev.refused.pop(), /3 raids for today/);
  s.state.t += DAY_S; go(s, 'barrows'); assert.ok(s.raid, 'a new day: three again');
});

test('the seats: the classes asked for, an Any rounding the three out, at the hero\'s level; the same two every time', () => {
  const H = { cls: 'fighter', level: 6, name: 'Ada' };
  const a = standIns(SEED, 1, H, ['rogue', 'any']);
  assert.equal(a[0].cls, 'rogue'); assert.ok(['cleric', 'shaman'].includes(a[1].cls), 'no healer asked for: Any brings one');
  assert.ok(a.every((m) => m.level === 6 && m.standin && m.name && m.name !== 'Ada'));
  assert.notEqual(a[0].name, a[1].name);
  assert.deepEqual(standIns(SEED, 1, H, ['rogue', 'any']).map((m) => [m.name, m.cls]), a.map((m) => [m.name, m.cls]), 'a pure function of the seed and the raid');
  const b = standIns(SEED, 2, { cls: 'cleric', level: 6, name: 'Ada' }, ['any', 'any']);
  assert.ok(b.some((m) => m.cls === 'fighter'), 'a healer leads: Any brings a front line');
  assert.deepEqual(standIns(SEED, 3, H, ['mage', 'shaman']).map((m) => m.cls), ['mage', 'shaman']);
  // the sim fields the two the lobby showed (ui/partyup.js: the raid's number next)
  const s = company(3), next = standIns(SEED, raidOf(s.state).n + 1, s.state.party[0], ['cleric', 'any']);
  go(s, 'barrows', ['cleric', 'any']);
  assert.deepEqual(s.state.party.slice(1).map((m) => m.name), next.map((m) => m.name));
});

test('a stand-in isn\'t the company\'s: nothing given it, nobody hired or benched on a raid', () => {
  const s = company(3), ev = events(s);
  const it = { ...s.state.party[0].gear.weapon, uid: 'x1' }; s.state.bag.push(it);
  go(s, 'barrows');
  const st = s.state.party[1];
  s.commands.push({ type: 'equip', member: st.id, uid: 'x1' }); s.tick();
  assert.ok(s.state.bag.some((q) => q.uid === 'x1'), 'still in the bag'); assert.match(ev.refused.pop(), /raid/);
  s.commands.push({ type: 'swap', slot: 1, id: 'nobody' }); s.tick(); assert.match(ev.refused.pop(), /raid/);
});

test('a room holds its six waves and is won, quiet for the run; the gate drops for the run only', () => {
  const s = company(3), ev = events(s);
  go(s, 'barrows');
  let won = 0; s.bus.on('raidRoom', () => won++);
  const gates = [...s.state.gates];
  for (let i = 0; i < 20 * 60 * 20 && !(s.world.gate && !s.world.gateShut); i++) {
    const p = s.state.player, b = s.battle;
    if (!(b && !b.quiet) && !p.path) { const r = s.destinations(), q = r.find((x) => x.id === 'gate' && !x.off) || r.find((x) => x.id === 'next-room' && !x.off); if (q) s.commands.push({ type: 'goto', tx: q.tx, ty: q.ty, near: q.near, room: q.room }); }
    for (const m of s.state.party) if (!m.down) m.hp = Math.max(m.hp, statsFor(m).maxHp * 0.8);   // (kept on their feet: this is about the count)
    s.tick();
  }
  assert.ok(won >= 1, 'a room won'); assert.ok(ev.room.every((e) => e.wave === RAID.waves), 'at its sixth wave');
  assert.ok(s.world.gate && !s.world.gateShut, 'the gate is down for the run');
  assert.deepEqual([...s.state.gates], gates, 'the slot\'s gates as they were (20 waves, out of a raid)');
  // the won room is quiet: walking back in starts nothing
  const room = ev.room[0].room, R = s.world.level.rooms.find((r) => r.id === room);
  s.commands.push({ type: 'goto', tx: Math.floor(R.cx), ty: Math.floor(R.cy) }); for (let i = 0; i < 600; i++) s.tick();
  assert.ok(!s.battle || s.battle.room !== room || s.battle.quiet);
});

test('a run played to its end: won, its coffer paid, the boss not the story\'s, back where it set out', () => {
  const s = company(3), ev = events(s);
  const gold0 = s.state.counters.gold, cin0 = s.state.counters.embers || 0, bosses = { ...s.state.bosses }, H = s.state.party[0];
  const hp0 = H.hp, home = s.state.party.map((m) => m.id);
  let mine = 0, theirs = 0; s.bus.on('loot', (l) => { if (!s.raid) return; const c = BASES[l.item.base].cls; if (c === H.cls || c === 'any' || l.item.r === 'heirloom') mine++; else theirs++; });
  go(s, 'barrows');
  play(s);
  assert.equal(ev.end.length, 1); const e = ev.end[0];
  assert.equal(e.won, true, 'the right company at the band\'s top wins it');
  assert.ok(e.coffer && e.coffer.gold === RAID.cofferGold * 3 && e.coffer.cinders === RAID.cofferCinders && e.coffer.item);
  assert.ok(['fine', 'rare', 'heirloom'].includes(e.coffer.item.r));
  assert.ok(s.state.counters.gold >= gold0 + e.coffer.gold && (s.state.counters.embers || 0) >= cin0 + RAID.cofferCinders);
  assert.equal(raidOf(s.state).won, 1);
  assert.deepEqual(s.state.bosses, bosses, 'a raid\'s boss isn\'t the story\'s');
  assert.ok(mine > 0 && theirs === 0, `what the hero finds is for the hero's class (${mine} / ${theirs})`);
  s.commands.push({ type: 'raidLeave' }); s.tick();
  assert.equal(s.raid, null); assert.equal(s.world.kind, 'town');
  assert.deepEqual(s.state.party.map((m) => m.id), home); assert.equal(H.hp, hp0);
});

test('a raid lost costs nothing: no gold lost, not Weakened, nobody Fallen, the company back', () => {
  const s = company(3), ev = events(s);
  let defeat = 0; s.bus.on('defeat', () => defeat++);
  go(s, 'barrows');
  const gold0 = s.state.counters.gold, home = 'town';
  for (let i = 0; i < 20 * 600 && s.raid; i++) {
    const p = s.state.player;
    if (!s.battle && !p.path) { const r = s.destinations(), q = r.find((x) => x.id === 'next-room' && !x.off); if (q) s.commands.push({ type: 'goto', tx: q.tx, ty: q.ty, near: q.near, room: q.room }); }
    if (s.battle && s.state.t - s.battle.t0 > 6) for (const e of s.world.enemies || []) e.atk = 9999;   // (foes past bearing, once all three are in)
    s.tick();
  }
  assert.equal(s.raid, null); assert.equal(ev.end[0].won, false); assert.equal(ev.end[0].why, 'wipe');
  assert.equal(defeat, 0, 'not a wipe\'s defeat');
  assert.ok(s.state.counters.gold >= gold0, 'no gold lost (what the kills paid is kept)');
  assert.ok(s.state.party.every((m) => !m.fallen && !m.down && !(m.weakUntil > s.state.t)), 'nobody Fallen or Weakened');
  assert.equal(s.world.kind, home); assert.equal(s.state.party.length, 3); assert.ok(s.state.party.every((m) => !m.standin));
});

test('a save made on a raid is the world and the company it set out from; the record is kept, an old save reads fresh', () => {
  const s = company(3);
  const H = s.state.party[0], hp0 = H.hp, home = s.state.party.map((m) => m.id);
  go(s, 'barrows'); H.hp = 5;
  const snap = JSON.parse(JSON.stringify(s.snapshot()));
  assert.equal(snap.scene, 'town'); assert.deepEqual(snap.party.map((m) => m.id), home); assert.equal(snap.party[0].hp, hp0);
  assert.deepEqual(snap.raid, { ...raidOf(s.state) }); assert.equal(snap.raid.used, 1);
  assert.ok(s.raid && s.state.party.length === 3 && s.state.party[1].standin, 'the run goes on after the save');
  const t = createSim(SEED, undefined, { scene: 'town' }); t.restore(snap);
  assert.equal(t.raid, null); assert.equal(t.world.kind, 'town'); assert.equal(raidOf(t.state).used, 1);
  delete snap.raid; t.restore(snap); assert.deepEqual(t.state.raid, restoreRaid(undefined));
  assert.deepEqual(restoreRaid({ day: 3, used: 99, n: 7, dry: 2, won: 4 }), { day: 3, used: RAID.perDay, n: 7, dry: 2, won: 4 });
});

test('the coffer: a pure function of the raid; an heirloom only one the company doesn\'t hold; each dry coffer nearer a Rare', () => {
  const a = cofferOf(SEED, 5, 'wickham_keep', 0, () => false);
  assert.deepEqual(cofferOf(SEED, 5, 'wickham_keep', 0, () => false), a);
  assert.equal(a.gold, RAID.cofferGold * 6); assert.equal(a.ilv, 6);
  let heir = 0, rare = 0, rareDry = 0;
  for (let n = 0; n < 2000; n++) { const c = cofferOf(SEED, n, 'wickham_keep', 0, () => false); if (c.heirloom) heir++; if (c.rarity === 'rare') rare++; if (cofferOf(SEED, n, 'wickham_keep', 6, () => false).rarity === 'rare') rareDry++; }
  assert.ok(heir > 20 && heir < 120, `heirlooms ${heir} in 2000`); assert.ok(rare > 440 && rare < 640, `rares ${rare}`); assert.ok(rareDry > rare + 400, `dry ${rareDry}`);
  for (let n = 0; n < 400; n++) assert.equal(cofferOf(SEED, n, 'wickham_keep', 0, () => true).heirloom, null, 'held: a Rare instead');
  for (let n = 0; n < 400; n++) assert.equal(cofferOf(SEED, n, 'barrows', 0, () => false).heirloom, null, 'a dungeon whose bosses carry none');
});
