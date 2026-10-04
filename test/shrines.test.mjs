// Shrines (GDD §3.6, 2026-10-01): one use each. A shrine raises the first of the Fallen at half health,
// or mends everyone standing (HP and MP), and says which. With nobody Fallen and everyone whole it isn't
// spent: it keeps its light for later and says so (a tap at full health used to spend it for nothing).
// (v1.14) A touch only offers it ('shrineOffer': what it would do); the popup's Use sends `useShrine`,
// which the sim checks: unspent, in reach, needed.
// A fragment written on a shrine is read at the first touch either way. A spent shrine stays on the
// floor (drawn dark), out of the way.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { propAt } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { shrineKind, boonK } from '../src/sim/shrines.js';

const SEED = 20260807;
// a floor with a shrine of that kind (v1.30: green mends, red lifts ATK, blue DEF), the hero beside it
function nearShrine(kind = 'mend') {
  let s = null, key = null;
  for (const site of ['barrows', 'wickham_keep', 'sunken_chapel', 'scrag_warren']) for (const seed of [SEED, 104729, 209458, 314187, 419,  523]) for (const depth of [0, 1]) {
    if (key) break;
    const t = createSim(seed, undefined, { scene: 'dungeon', site }); if (depth) t.restore({ ...JSON.parse(JSON.stringify(t.snapshot())), depth, floors: [] });
    const f = [...t.world.props].find(([k, v]) => { if (v !== 'shrine') return false; const [a, b] = k.split(',').map(Number); return shrineKind(t.world, a, b) === kind; });
    if (f) { s = t; key = f[0]; }
  }
  const [x, y] = key.split(',').map(Number), p = s.state.player;
  p.x = p.px = x + 1.5; p.y = p.py = y + 0.5;
  const ev = [], offers = []; s.bus.on('shrine', (e) => ev.push(e)); s.bus.on('shrineOffer', (e) => offers.push(e));
  const touch = () => { s.commands.push({ type: 'harvest', tx: x, ty: y }); s.tick(); s.commands.push({ type: 'useShrine', tx: x, ty: y }); s.tick(); };   // touch, then Use
  const whole = () => { for (const m of s.state.party) { const st = statsFor(m); m.hp = st.maxHp; m.mp = st.maxMp; m.fallen = false; m.down = false; } };
  return { s, key, x, y, ev, offers, touch, whole };
}

test('everyone whole: the shrine keeps its light, and says so', () => {
  const { s, key, x, y, ev, touch, whole } = nearShrine();
  whole(); touch();
  assert.deepEqual(ev.map((e) => e.did), ['none']);
  assert.equal(propAt(s.world, x, y), 'shrine', 'still there to use'); assert.ok(!s.world.mods.get(key));
});

test('someone hurt: it mends everyone standing, HP and MP, and is spent (drawn, out of the way)', () => {
  const { s, key, x, y, ev, touch, whole } = nearShrine();
  whole(); const h = s.state.party[0]; h.hp = 5; touch();
  assert.deepEqual(ev.map((e) => e.did), ['mended']);
  assert.equal(h.hp, statsFor(h).maxHp);
  assert.equal(propAt(s.world, x, y), null); assert.equal(s.world.props.get(key), 'shrine', 'spent, still on the floor');
  touch(); assert.equal(ev.length, 1, 'once');
});

test('one of the Fallen: it raises them at half health, by name', () => {
  const { s, ev, touch, whole } = nearShrine();
  s.state.party.push({ ...JSON.parse(JSON.stringify(s.state.party[0])), id: 'tam', name: 'Tam', main: false }); whole();   // (no tavern down here)
  const m = s.state.party[1]; m.fallen = true; m.hp = 0; touch();
  assert.equal(ev[0].did, 'raised'); assert.equal(ev[0].name, m.name);
  assert.ok(!m.fallen && Math.abs(m.hp - Math.round(statsFor(m).maxHp * 0.5)) <= 1, `${m.hp} of ${statsFor(m).maxHp}`);
});

test('a fragment on a shrine is read at the first touch, even at full health (the shrine kept)', () => {
  const s = createSim(SEED, undefined, { scene: 'dungeon', site: 'barrows' }); s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), depth: 1, floors: [] });
  const h = s.lore.holder('frag_vale_muster_roll'); assert.equal(h.via, 'shrine', 'this seed\'s second floor has its shrine');
  const [x, y] = h.key.split(',').map(Number), p = s.state.player, found = [];
  s.bus.on('fragmentFound', (e) => found.push(e.id));
  for (const m of s.state.party) { const st = statsFor(m); m.hp = st.maxHp; m.mp = st.maxMp; }
  p.x = p.px = x + 1.5; p.y = p.py = y + 0.5; s.commands.push({ type: 'harvest', tx: x, ty: y }); s.tick();
  assert.deepEqual(found, ['frag_vale_muster_roll']); assert.equal(propAt(s.world, x, y), 'shrine');
});

test('a touch only offers the blessing (what it would do), and spends nothing; Use spends it', () => {
  const { s, key, x, y, ev, offers, whole } = nearShrine();
  whole(); const h = s.state.party[0]; h.hp = 5;
  s.commands.push({ type: 'harvest', tx: x, ty: y }); s.tick();
  assert.deepEqual(offers.map((o) => o.will), ['mend']); assert.equal(ev.length, 0, 'not used on the touch');
  assert.ok(h.hp < 6, 'still hurt (only a breath of regen)'); assert.equal(propAt(s.world, x, y), 'shrine'); assert.ok(!s.world.mods.get(key));
  s.commands.push({ type: 'useShrine', tx: x, ty: y }); s.tick();
  assert.deepEqual(ev.map((e) => e.did), ['mended']); assert.equal(h.hp, statsFor(h).maxHp); assert.equal(propAt(s.world, x, y), null);
});

test('the offer names who it would raise; whole, it offers nothing to do', () => {
  const { s, x, y, offers, whole } = nearShrine();
  s.state.party.push({ ...JSON.parse(JSON.stringify(s.state.party[0])), id: 'tam', name: 'Tam', main: false }); whole();
  s.commands.push({ type: 'harvest', tx: x, ty: y }); s.tick();
  s.state.party[1].fallen = true; s.state.party[1].hp = 0;
  s.commands.push({ type: 'harvest', tx: x, ty: y }); s.tick();
  assert.deepEqual(offers.map((o) => [o.kind, o.will, o.name || null]), [['mend', 'none', null], ['mend', 'raise', 'Tam']]);
});

test('useShrine is checked: out of reach, nobody in need, not a shrine, already spent: nothing happens', () => {
  const { s, key, x, y, ev, whole } = nearShrine(), p = s.state.player, h = s.state.party[0], far = [];
  s.bus.on('outOfReach', () => far.push(1));
  whole(); h.hp = 5; p.x = p.px = x + 6.5;
  s.commands.push({ type: 'useShrine', tx: x, ty: y }); s.tick();
  assert.equal(far.length, 1); assert.equal(ev.length, 0); assert.ok(!s.world.mods.get(key));
  p.x = p.px = x + 1.5; whole();
  s.commands.push({ type: 'useShrine', tx: x, ty: y }); s.tick();
  assert.deepEqual(ev.map((e) => e.did), ['none'], 'whole: kept'); assert.equal(propAt(s.world, x, y), 'shrine');
  h.hp = 5; s.commands.push({ type: 'useShrine', tx: x + 3, ty: y + 3 }); s.tick(); assert.ok(h.hp < 6, 'not a shrine there');
  s.commands.push({ type: 'useShrine', tx: x, ty: y }); s.tick(); h.hp = 5;
  s.commands.push({ type: 'useShrine', tx: x, ty: y }); s.tick();
  assert.deepEqual(ev.map((e) => e.did), ['none', 'mended'], 'once'); assert.ok(h.hp < 6);
});

// ── v1.30: three kinds (the owner, 2026-10-04: "Green is current HP and MP replaced. Red gives a 2 min attack boost and
// the current blue gives a 2 min defense boost") ─────────────────────────────────────────────────────────────────
test('a shrine\'s kind is its tile\'s, by the floor\'s seed: about 40 % green, 30 % red, 30 % blue, the same every time', () => {
  const n = { mend: 0, might: 0, ward: 0 }, w = { seed: 12345 };
  for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) n[shrineKind(w, x, y)]++;
  assert.ok(Math.abs(n.mend - 4000) < 300 && Math.abs(n.might - 3000) < 300 && Math.abs(n.ward - 3000) < 300, JSON.stringify(n));
  assert.equal(shrineKind(w, 7, 9), shrineKind({ seed: 12345 }, 7, 9));
});

for (const [kind, stat] of [['might', 'atk'], ['ward', 'def']]) test(`a ${kind === 'might' ? 'red' : 'blue'} shrine: the whole party's ${stat.toUpperCase()} +25 % for 2 minutes, then it ends; once`, () => {
  const { s, x, y, ev, offers, touch, whole } = nearShrine(kind);
  whole();                                                             // (whole: a red or blue one is still worth using)
  touch();
  assert.deepEqual(offers.map((o) => [o.kind, o.will]), [[kind, kind]]);
  assert.deepEqual(ev.map((e) => [e.kind, e.did, e.secs, e.k]), [[kind, kind, 120, 0.25]]);
  assert.equal(propAt(s.world, x, y), null, 'spent');
  assert.ok(Math.abs(s.state.boons[stat] - (s.state.t + 120)) < 0.2, `until ${s.state.boons[stat]} at ${s.state.t}`);
  assert.equal(boonK(s.state, stat), 1.25); assert.equal(boonK(s.state, stat === 'atk' ? 'def' : 'atk'), 1, 'only its own stat');
  for (let i = 0; i < 20 * 121; i++) s.tick();
  assert.equal(boonK(s.state, stat), 1, 'over after 2 minutes');
  touch(); assert.equal(ev.length, 1, 'once');
});

test('a red shrine\'s boon lands harder in a fight: the same fight, more damage dealt', () => {
  const dealt = (boon) => {
    const s = createSim(SEED, undefined, { scene: 'dungeon', site: 'barrows' }), L = s.world.level, r = L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom), p = s.state.player;
    p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5; if (boon) s.state.boons = { atk: 1e9, def: 0 };
    let n = 0; s.bus.on('combat', (c) => { if (c.t === 'hit' && !c.party) n += c.amount || 0; });
    for (let i = 0; i < 20 * 20; i++) { s.state.party[0].hp = Math.max(s.state.party[0].hp, 60); s.tick(); }
    return n;
  };
  const a = dealt(false), b = dealt(true);
  assert.ok(b > a * 1.1, `${a} → ${b}`);
});

test('a boon is saved and read back; a bad one reads as none', () => {
  const s = createSim(SEED, undefined, { scene: 'dungeon' }); s.state.boons = { atk: s.state.t + 90, def: 0 };
  const snap = JSON.parse(JSON.stringify(s.snapshot())), t = createSim(SEED); t.restore(snap);
  assert.deepEqual(t.state.boons, s.state.boons);
  t.restore({ ...snap, boons: { atk: 'x', def: -4 } }); assert.deepEqual(t.state.boons, { atk: 0, def: 0 });
  t.restore({ ...snap, boons: undefined }); assert.deepEqual(t.state.boons, { atk: 0, def: 0 });
});
