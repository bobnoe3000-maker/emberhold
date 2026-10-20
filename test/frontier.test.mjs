// The Frontier (docs/frontier-proposal.md): the Old Provinces as one land, a proof of concept. Its land is the same
// whatever order it's walked in; its roads go through (bridges, passes); its towns are safe; its levels keep their
// bands; its camps stand again on their timers whether anyone watched; the stick explores, letting go locks a ring the
// party fights in; and the same commands play the same game.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createLand, G, WALK, CH, CAMP_GRID } from '../src/sim/frontier/land.js';
import { createFrontier, conOf, aggroR, inLock, LOCK_HW, LOCK_HH, LOCK_MAX, LEASH, DT } from '../src/sim/frontier/frontier.js';
import { K, TOWNS, REGIONS, SAFE } from '../src/sim/frontier/geo.js';
import { xpToNext } from '../src/sim/party.js';

const SEED = 20260807;
const coast = JSON.parse(readFileSync(new URL('../assets/maps/old-provinces.json', import.meta.url), 'utf8')).coast;
const land = createLand(SEED, coast);

test('the land is 100× the Vale, and the same whichever chunk is made first', () => {
  let cells = 0; for (const r of land.region) if (r) cells++;
  const tiles = cells * K * K;
  assert.ok(tiles > 6.5e6 && tiles < 7.0e6, `land: ${Math.round(tiles)} tiles`);
  assert.ok(Math.abs(tiles / (260 * 260) - 100) < 3, `${(tiles / 67600).toFixed(1)}× the Vale`);
  const a = createLand(SEED, coast), b = createLand(SEED, coast);
  const order = [[10, 55], [11, 55], [10, 56], [11, 56]];
  for (const [x, y] of order) a.chunk(x, y);
  for (const [x, y] of [...order].reverse()) b.chunk(x, y);
  for (const [x, y] of order) {
    const ca = a.chunk(x, y), cb = b.chunk(x, y);
    assert.deepEqual([...ca.ground], [...cb.ground]); assert.deepEqual([...ca.solid], [...cb.solid]);
    assert.deepEqual(ca.camps, cb.camps); assert.deepEqual(ca.feats, cb.feats);
  }
  assert.notDeepEqual(createLand(7, coast).chunk(10, 55).camps, a.chunk(10, 55).camps, 'another seed, another land');
});

test('every road goes through: bridges where it crosses a river, passes where it crosses a range', () => {
  let bridges = 0, passes = 0;
  for (const r of land.roads) for (let i = 0; i + 1 < r.line.length; i++) {
    const [ax, ay] = r.line[i], [bx, by] = r.line[i + 1], n = Math.ceil(Math.hypot(bx - ax, by - ay) / 1.5);
    for (let k = 0; k <= n; k++) {
      const x = ax + (bx - ax) * k / n, y = ay + (by - ay) * k / n, g = land.groundAt(x, y);
      if (g === G.SEA) continue;                                             // (a road's end may stand at the shore)
      assert.ok(WALK[g], `${r.kind} at ${Math.round(x)},${Math.round(y)}: ${g}`);
      if (g === G.BRIDGE) bridges++;
      if (land.lines(x, y).ridge < 0) passes++;
    }
  }
  assert.ok(bridges > 20, `bridges: ${bridges}`); assert.ok(passes > 5, `passes: ${passes}`);
});

test('the towns stand on land in their own region, and nothing camps within their walls and safe ring', () => {
  for (const t of TOWNS) {
    const x = t.x * K, y = t.y * K;
    assert.ok(WALK[land.groundAt(x, y)], `${t.name} on walkable ground`);
    for (let cy = Math.floor((y - t.r - SAFE) / CH); cy <= Math.floor((y + t.r + SAFE) / CH); cy++)
      for (let cx = Math.floor((x - t.r - SAFE) / CH); cx <= Math.floor((x + t.r + SAFE) / CH); cx++)
        for (const k of land.chunk(cx, cy).camps) assert.ok(Math.hypot(k.x - x, k.y - y) >= t.r + SAFE || k.kind === 'lair', `${t.name}: a camp at ${Math.round(Math.hypot(k.x - x, k.y - y))} tiles`);
  }
});

test('the level map: every camp in its region\'s band; low by the towns, rising into the wild; the roads safer', () => {
  const byRegion = {};
  for (let cy = 0; cy < land.CHN; cy += 2) for (let cx = 0; cx < land.CW; cx += 2) for (const k of land.chunk(cx, cy).camps) {
    const R = REGIONS.find((q) => q.id === k.region);
    assert.ok(k.lv >= R.band[0] && k.lv <= R.band[1], `${k.region} camp at ${k.lv}`);
    (byRegion[k.region] ||= []).push(k.lv);
  }
  for (const R of REGIONS) assert.ok((byRegion[R.id] || []).length > 20, `${R.id}: ${(byRegion[R.id] || []).length} camps sampled`);
  const th = TOWNS.find((t) => t.id === 'thornwick');
  assert.ok(land.baseLevel(th.x * K, th.y * K) < 3, 'Thornwick is where the levels begin');
  assert.ok(land.baseLevel(600 * K, 522 * K) > 72, 'the Throne is where they end');
  // the same spot, a road's −2: the level map at an imperial road against 60 tiles off it, in the same open country
  let lower = 0, n = 0;
  for (const r of land.roads.filter((q) => q.kind === 'imperial')) for (let i = 0; i + 1 < r.line.length; i++) {
    const [ax, ay] = r.line[i], [bx, by] = r.line[i + 1], L = Math.hypot(bx - ax, by - ay), mx = (ax + bx) / 2, my = (ay + by) / 2, nx = -(by - ay) / L, ny = (bx - ax) / L;
    const ox = mx + nx * 60, oy = my + ny * 60; if (!land.regionAt(ox, oy) || land.regionAt(ox, oy) !== land.regionAt(mx, my)) continue;
    const g = G.MEADOW; n++; if (land.levelAt(mx + nx * 8, my + ny * 8, g) <= land.levelAt(ox, oy, g)) lower++;
  }
  assert.ok(n > 8 && lower / n > 0.75, `by the road no harder in ${lower} of ${n}`);
});

test('con colours and aggro: grey pays nothing and starts nothing; a level over notices from further', () => {
  assert.deepEqual([conOf(1, 7), conOf(3, 7), conOf(7, 7), conOf(9, 7), conOf(10, 7)], ['grey', 'green', 'gold', 'orange', 'red']);
  assert.ok(aggroR(10, 7) > aggroR(7, 7) && aggroR(7, 7) > aggroR(4, 7) && aggroR(40, 7) === 9 && aggroR(1, 70) === 3);
});

/** a fresh party at a camp of the level, `off` tiles east of it */
function atCamp(lv, areaLv, off = 6) {
  const fr = createFrontier(SEED, coast, { level: lv });
  let k = null;
  for (let cy = 50; cy < fr.land.CHN && !k; cy++) for (let cx = 0; cx < fr.land.CW && !k; cx++) k = fr.land.chunk(cx, cy).camps.find((q) => q.lv === areaLv && q.kind === 'pack') || null;
  fr.state.party.forEach((m, i) => { m.x = k.x + off + i * 0.5; m.y = k.y + 0.5; });
  fr.commands.push({ type: 'stick', x: -0.01, y: 0 }); fr.tick();
  return { fr, k };
}

test('the stick explores; letting go locks the screen\'s area; the stick again lifts it', () => {
  const fr = createFrontier(SEED, coast, { level: 3 }), H = fr.state.party[0], x0 = H.x;
  const seen = []; for (const e of ['lock', 'unlock']) fr.bus.on(e, () => seen.push(e));
  for (let i = 0; i < 20; i++) { fr.commands.push({ type: 'stick', x: 1, y: 0 }); fr.tick(); }
  assert.ok(H.x - x0 > 6, `ran ${(H.x - x0).toFixed(1)} tiles in a second`);
  fr.commands.push({ type: 'release', hw: 12.2, hh: 26.4, ox: 0, oy: 0.8 }); fr.tick();      // (a phone's screen at the game's scale)
  const L = fr.state.lock;
  assert.equal(fr.state.mode, 'lock'); assert.deepEqual([Math.round(L.x), +(L.y - H.y).toFixed(1), L.hw, L.hh], [Math.round(H.x), 0.8, 12.2, 26.4]);
  for (let i = 0; i < 20 * 30; i++) fr.tick();
  for (const m of fr.state.party) assert.ok(inLock(L, m.x, m.y, 4.01), 'nobody leaves the screen\'s area');
  fr.commands.push({ type: 'stick', x: 0, y: 1 }); fr.tick();
  assert.equal(fr.state.mode, 'explore'); assert.equal(fr.state.lock, null); assert.deepEqual(seen, ['lock', 'unlock']);
});

test('the locked area is the screen\'s: a lock made zoomed out holds only the awake land; a bad one does nothing', () => {
  const fr = createFrontier(SEED, coast, { level: 3 });
  fr.commands.push({ type: 'release', hw: 'wide', hh: 20 }); fr.tick(); assert.equal(fr.state.mode, 'explore', 'not a number: nothing');
  fr.commands.push({ type: 'release', hw: 900, hh: 1800, ox: 400, oy: -400 }); fr.tick();
  const L = fr.state.lock, H = fr.state.party[0];
  assert.deepEqual([L.hw, L.hh, +(L.x - H.x).toFixed(1), +(L.y - H.y).toFixed(1)], [LOCK_MAX, LOCK_MAX, 8, -8]);
  const g = createFrontier(SEED, coast, { level: 3 }); g.commands.push({ type: 'release' }); g.tick();
  assert.deepEqual([g.state.lock.hw, g.state.lock.hh], [LOCK_HW, LOCK_HH], 'no size given: a phone\'s screen');
});

test('commands are checked: a bad one does nothing', () => {
  const fr = createFrontier(SEED, coast, { level: 3 }), H = fr.state.party[0], snap = () => JSON.stringify([H.x, H.y, fr.state.mode, fr.state.lock, fr.state.party.map((m) => [m.level, m.xp])]);
  const before = snap();
  for (const c of [null, {}, { type: 'stick', x: 5, y: 0 }, { type: 'stick', x: NaN, y: 0 }, { type: 'jump', town: 'atlantis' }, { type: 'level', n: 0 }, { type: 'level', n: 76 }, { type: 'level', n: 2.5 }, { type: 'grant', xp: 1e9 }])
    fr.commands.push(c);
  fr.tick();
  assert.equal(snap(), before);
  fr.commands.push({ type: 'jump', town: 'ashgate' }); fr.tick();
  const t = TOWNS.find((q) => q.id === 'ashgate'); assert.ok(Math.hypot(fr.state.party[0].x - t.x * K, fr.state.party[0].y - t.y * K) < 3);
});

test('a camp fights as one, and stands again on its timer, whether anyone watched or not', () => {
  const { fr, k } = atCamp(6, 4, 3);
  const kills = []; fr.bus.on('kill', (e) => { if (e.camp === k.id) kills.push(fr.state.tick); });
  fr.commands.push({ type: 'release' });
  for (let i = 0; i < 20 * 40 && kills.length < k.foes.length; i++) fr.tick();
  assert.equal(kills.length, k.foes.length, 'the party clears the camp');
  const at = fr.state.respawnAt.get(k.id), first = Math.min(...at);
  assert.ok(at.every((t) => t > fr.state.tick), 'each one waits its time');
  assert.ok((first - kills[0]) * DT >= 50 * 0.84 && (first - kills[0]) * DT <= 50 * 1.16, `a pack's 50 s ± 15 %: ${((first - kills[0]) * DT).toFixed(1)} s`);
  // walk out of the bubble, wait past every timer, walk back: they're standing at home
  fr.commands.push({ type: 'jump', town: 'thornwick' });
  const back = Math.max(...at) + 20; while (fr.state.tick < back) fr.tick();
  assert.ok(!fr.awake.has(k.id), 'asleep while nobody\'s near');
  fr.state.party.forEach((m, i) => { m.x = k.x + 30 + i; m.y = k.y; });
  for (let i = 0; i < 12; i++) { fr.commands.push({ type: 'stick', x: 0, y: 0 }); fr.tick(); }
  const a = fr.awake.get(k.id);
  assert.ok(a && a.foes.length === k.foes.length && a.foes.every((f) => Math.hypot(f.x - k.x, f.y - k.y) < 4), 'all of it, at home');
});

test('a foe pulled past its leash goes home, mending, and won\'t be hurt on the way', () => {
  const { fr, k } = atCamp(20, 4, 4);                       // (the party far over it: it will run, not fight)
  fr.commands.push({ type: 'release' }); fr.tick();
  const f = fr.awake.get(k.id).foes[0];
  f.state = 'fight'; f.tgt = fr.state.party[0]; f.x = k.x + LEASH + 2; f.y = k.y; f.hp = 1;
  const ev = []; fr.bus.on('evade', (e) => ev.push(e.id));
  fr.tick();
  assert.deepEqual(ev, [f.id]); assert.equal(f.state, 'evade');
  for (let i = 0; i < 20 * 20 && f.state === 'evade'; i++) fr.tick();
  assert.equal(f.state, 'idle'); assert.equal(f.hp, f.maxHp); assert.ok(Math.hypot(f.x - f.hx, f.y - f.hy) < 1);
});

test('a same-level party holds the screen; on red ground it pulls nothing, and a red camp that comes at it wears it down (proposal §6)', () => {
  const run = (lv, area, off, pullThem = false) => {
    const { fr, k } = atCamp(lv, area, off); fr.commands.push({ type: 'release' }); fr.tick();
    if (pullThem) for (const f of fr.awake.get(k.id).foes) { f.state = 'fight'; f.tgt = fr.state.party[0]; }
    let low = 1; for (let i = 0; i < 20 * 120; i++) { fr.tick(); for (const m of fr.state.party) low = Math.min(low, m.hp / m.st.maxHp); }
    return { low: +low.toFixed(2), wipes: fr.state.wipes, kills: fr.state.kills };
  };
  const same = run(6, 6, 6), red = run(6, 9, 6), redAtUs = run(6, 9, 3, true);
  assert.ok(same.wipes === 0 && same.low > 0.3 && same.kills >= 4, `L6 on 6: ${JSON.stringify(same)}`);
  assert.ok(red.kills < same.kills / 2, `L6 on 9, held: it starts no red fight: ${JSON.stringify(red)}`);
  assert.ok(redAtUs.wipes > 0 || redAtUs.low < 0.2, `L6 on 9, the camp at it: ${JSON.stringify(redAtUs)}`);
});

test('a kill that carries the party over a level says the new level, and the party fights on at it', () => {
  const { fr } = atCamp(3, 3, 4);
  for (const m of fr.state.party) m.xp = xpToNext(m.level) - 1;
  const ups = []; fr.bus.on('level', (e) => ups.push(e));
  fr.commands.push({ type: 'release' });
  for (let i = 0; i < 20 * 30 && !ups.length; i++) fr.tick();
  assert.ok(ups.length && ups.every((e) => e.level === 4 && typeof e.name === 'string'), JSON.stringify(ups));
  assert.ok(fr.state.party.every((m) => m.level === 4 && m.st.maxHp > 0), 'their stats follow');
});

test('the same commands play the same game', () => {
  const play = () => {
    const fr = createFrontier(SEED, coast, { level: 5 }), log = [];
    fr.bus.on('kill', (e) => log.push(['k', e.id, fr.state.tick])); fr.bus.on('hit', (e) => log.push(['h', e.amount]));
    for (let i = 0; i < 20 * 50; i++) { fr.commands.push(i < 20 * 20 ? { type: 'stick', x: 0.6, y: 0.8 } : i === 20 * 20 ? { type: 'release' } : { type: 'noop' }); fr.tick(); }
    return JSON.stringify([log, fr.state.party.map((m) => [m.x, m.y, m.hp, m.xp]), [...fr.state.respawnAt]]);
  };
  assert.equal(play(), play());
});

test('camps: thousands over the land, the kinds in their shares, the grid as the proposal says', () => {
  let camps = 0, foes = 0; const kinds = {};
  for (let cy = 0; cy < land.CHN; cy += 3) for (let cx = 0; cx < land.CW; cx += 3) { const c = land.chunk(cx, cy); for (const k of c.camps) { camps++; foes += k.foes.length; kinds[k.kind] = (kinds[k.kind] || 0) + 1; } }
  const all = camps * 9, n = camps - (kinds.lair || 0);
  assert.ok(all > 8000 && all < 20000, `≈ ${all} camps over the land`);
  assert.ok(kinds.pack / n > 0.35 && kinds.wanderer / n > 0.2 && kinds.camp / n > 0.12, JSON.stringify(kinds));
  assert.equal(CAMP_GRID, 20);
  console.log(`FRONTIER camps ≈ ${all}, foes ≈ ${foes * 9}, ${JSON.stringify(kinds)} (a ninth of the chunks)`);
});
