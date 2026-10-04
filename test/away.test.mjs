// Offline progress (GDD §12 v1.32; the owner, 2026-10-04: "offline progress", exact, with a progress screen): the time
// away is played through on the same rules. `away` { secs } is checked (a made hero, one at a time, at least a minute,
// at most four hours counted); the sim counts it down and says when it's done; in town the company is on retainer (the
// party at the bench's half wage); and the bus's quiet mode (presentation sits it out) changes nothing the sim does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim, AWAY_MAX, AWAY_MIN, TICK_HZ } from '../src/sim/core.js';
import { makeMember, statsFor } from '../src/sim/party.js';
import { wageOf } from '../src/sim/companions.js';
import { DAY_S } from '../src/sim/heroes.js';

const SEED = 20260807;
const made = (sim) => { sim.state.created = true; return sim; };
const run = (sim, cmd) => { sim.commands.push(cmd); sim.tick(); };

test('away is checked: a made hero, at least a minute, once at a time; four hours at most count; it counts down and ends', () => {
  const ev = [], s = createSim(SEED, undefined, { scene: 'town' });
  for (const k of ['awayStarted', 'awayEnded']) s.bus.on(k, (e) => ev.push([k, e]));
  run(s, { type: 'away', secs: 600 }); assert.equal(s.state.away, null, 'no hero made yet: nothing');
  made(s); run(s, { type: 'away', secs: AWAY_MIN - 1 }); assert.equal(s.state.away, null, 'under a minute: nothing');
  run(s, { type: 'away', secs: 'x' }); assert.equal(s.state.away, null);
  run(s, { type: 'away', secs: 30 * 3600 }); assert.equal(s.state.away.secs, AWAY_MAX, 'four hours count');
  assert.deepEqual(ev[0], ['awayStarted', { secs: AWAY_MAX, asked: 30 * 3600 }]);
  run(s, { type: 'away', secs: 600 }); assert.equal(s.state.away.secs, AWAY_MAX, 'one at a time');
  run(s, { type: 'awayStop' }); assert.equal(s.state.away, null); assert.equal(ev[1][0], 'awayEnded'); assert.equal(ev[1][1].stopped, true);
  run(s, { type: 'away', secs: 90 }); let n = 0; while (s.state.away) { s.tick(); n++; }
  assert.equal(n, 90 * TICK_HZ - 1, 'counted down in ticks (the command\'s own tick was the first)'); assert.deepEqual(ev[3], ['awayEnded', { secs: 90, stopped: false }]);
  const snap = s.snapshot(); assert.ok(!('away' in snap), 'never saved');
});

test('in town while away, the company is on retainer: the party is paid the bench\'s half at dawn', () => {
  const pay = (away) => {
    const s = made(createSim(SEED, undefined, { scene: 'town' })); s.state.counters.gold = 100000;
    s.commands.push({ type: 'hire', idx: 1 }); s.tick();
    const m = s.state.party[1], waged = []; s.bus.on('wages', (e) => waged.push(e.paid));
    s.state.t = (Math.floor(s.state.t / DAY_S) + 1) * DAY_S - 2;   // two seconds to dawn
    if (away) run(s, { type: 'away', secs: 120 });
    for (let i = 0; i < 20 * 5; i++) s.tick();
    return { paid: waged[0], full: wageOf(m, false), half: wageOf(m, true) };
  };
  const at = pay(false), off = pay(true);
  assert.equal(at.paid, at.full); assert.equal(off.paid, off.half); assert.ok(off.half < off.full);
});

test('quiet changes nothing the sim does: the same fight, the same result, heard or not; only the sealed listeners and scene changes hear', () => {
  const fight = (quiet) => {
    const s = made(createSim(SEED, undefined, { scene: 'dungeon', site: 'wickham_keep' }));
    s.state.party.push(makeMember('c1', 'Osk', 'rogue', 3));
    const L = s.world.level, r = L.rooms.find((q) => q !== L.entrance), p = s.state.player; p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
    s.bus.seal();
    const heard = []; for (const k of ['combat', 'wave', 'levelChanged', 'defeat']) s.bus.on(k, () => heard.push(k));
    s.bus.quiet = quiet; run(s, { type: 'away', secs: 900 });
    while (s.state.away) s.tick();
    s.bus.quiet = false;
    return { snap: JSON.stringify(s.snapshot()), heard };
  };
  const a = fight(false), b = fight(true);
  assert.equal(b.snap, a.snap, 'the same game either way');
  assert.ok(a.heard.includes('combat') && a.heard.includes('defeat'), 'a level-1 company is beaten up there, and travels');
  assert.ok(!b.heard.includes('combat') && !b.heard.includes('wave'), 'presentation sat it out');
  assert.ok(b.heard.includes('levelChanged'), 'but followed the scene change');
});

test('left grinding a room, the time away fights it on the online rules: XP, gold and waves, as if you\'d watched', () => {
  const s = made(createSim(SEED, undefined, { scene: 'dungeon', site: 'barrows' }));
  for (const m of s.state.party) { m.level = 6; m.hp = statsFor(m).maxHp; }
  s.state.party.push(makeMember('c1', 'Osk', 'rogue', 6), makeMember('c2', 'Manic', 'cleric', 6));
  const L = s.world.level, r = L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom), p = s.state.player; p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  const xp0 = s.state.party[0].xp, g0 = s.state.counters.gold || 0; let waves = 0; s.bus.on('wave', (e) => { if (e.cleared) waves++; });
  run(s, { type: 'away', secs: 300 }); while (s.state.away) s.tick();
  assert.ok(waves >= 3 && s.state.party[0].xp > xp0 && (s.state.counters.gold || 0) > g0, `${waves} waves, xp ${xp0} → ${s.state.party[0].xp}`);
});
