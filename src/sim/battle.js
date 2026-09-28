// battle.js — room battles with respawning waves (GDD §3). Headless, deterministic,
// stepped by core.js at 20 Hz.
//
// Enter any dungeon room but the entrance (a sanctuary) and its battle starts: a wave
// spawns away from the party, the party fights on its own, a lull follows each cleared
// wave, then the next wave comes — for as long as you stay. Every room has a fixed
// level (world.roomLevels: deeper from the entrance and deeper floors are harder), and
// its waves never escalate: wave 40 is as hard as wave 1. Enemies are leashed to their
// room. Walk out of the room to end it (the room resets). If the whole party falls,
// you're carried to town.
//
// Control (GDD §3.4): steer the hero and it goes where you say, striking whatever is
// in reach when you stop; let go of the stick for a moment and it fights on its own
// (chasing within the room — it never walks out by itself). Companions always act on
// their own (fighter guards you, rogue hunts the weakest, mage keeps distance and
// casts). Tap an enemy to focus the party on it.

import { mulberry32, streamSeed } from './rng.js';
import { CLASSES, statsFor, xpToNext } from './party.js';

// class combat traits (stats are in party.js / the GDD tables)
const CLASS_FIGHT = {
  fighter: { interval: 1.3, range: 1.45, speed: 6.2, ability: { name: 'Cleave', mp: 10, power: 1.3, splash: 0.65 } },
  rogue:   { interval: 0.9, range: 1.35, speed: 6.8, ability: { name: 'Backstab', mp: 10, power: 1.6, crit: 25 } },
  mage:    { interval: 1.6, range: 7.0,  speed: 5.8, ability: { name: 'Firebolt', mp: 12, power: 1.8 }, bolt: 'fire', keepAway: 3.2 },
};
// Ashbound archetypes at level 1 (GDD §7: × (1 + 0.14 × (level − 1)); elites on top)
const ENEMIES = {
  minion:  { hp: 36, atk: 7,   def: 4, crit: 5, dodge: 5,  interval: 1.2, range: 1.35, speed: 3.3, xp: 10, gold: 1 },
  warrior: { hp: 54, atk: 9.5, def: 6, crit: 5, dodge: 3,  interval: 1.4, range: 1.45, speed: 2.9, xp: 14, gold: 2 },
  rogue:   { hp: 36, atk: 8,   def: 3, crit: 10, dodge: 10, interval: 1.6, range: 6.0, speed: 3.5, xp: 12, gold: 2, bolt: 'bolt' },
  mage:    { hp: 34, atk: 10.5, def: 2, crit: 5, dodge: 5,  interval: 2.0, range: 7.0, speed: 2.7, xp: 14, gold: 3, bolt: 'soul' },
};
export const ENEMY_KINDS = Object.keys(ENEMIES);
const LULL = 4, OUT_OF_BATTLE_REGEN = 5, BOLT_SPEED = 13, AUTO_DELAY = 0.5;
// The lull is 4 s, stretched (up to 15 s) while the party is under half HP, so a bad wave
// is followed by a breather. Companions who fell during a wave get back up at 25 % HP
// when it's cleared.
const LULL_MAX = 15, LULL_READY = 0.5, REVIVE = 0.25;

export function createBattle({ state, bus, getWorld, seed, isWalkable, onDefeat, moveHero }) {
  let rng = mulberry32(streamSeed(seed, 0xb477));
  let battle = null, nextId = 1, focusId = 0;

  // a room tile keeps its room id even where a corridor was carved through it
  const roomAt = (w, x, y) => { const c = w.level && w.level.cells.get(Math.floor(x) + ',' + Math.floor(y)); return c && c.kind === 'floor' && c.room >= 0 ? c.room : -1; };
  const hero = () => state.party[0];
  const alive = (u) => u && !u.down && u.hp > 0;
  const partyHp = () => state.party.reduce((a, m) => a + (m.down ? 0 : m.hp), 0) / state.party.reduce((a, m) => a + statsFor(m).maxHp, 0);

  // runtime fields on party members (positions for companions; the hero is the player)
  function ensureRuntime() {
    const p = state.player;
    state.party.forEach((m, i) => {
      if (m.mp === undefined) m.mp = statsFor(m).maxMp;
      if (i === 0) { m.x = p.x; m.y = p.y; }
      else if (m.x === undefined || Math.hypot(m.x - p.x, m.y - p.y) > 14) { m.x = p.x - 0.8 * i; m.y = p.y + 0.8; }
      m.cd = m.cd || 0; m.act = m.act || 0;
    });
  }
  function placeCompanions() { const p = state.player; state.party.forEach((m, i) => { if (i) { m.x = p.x + (i === 1 ? -1 : 1) * 0.9; m.y = p.y + 0.9; } }); }

  // ── spawning ────────────────────────────────────────────────────────────────
  function spawnWave(w) {
    const b = battle, lvl = b.level, scale = 1 + 0.14 * (lvl - 1), atkScale = 1 + 0.12 * (lvl - 1);
    // 2 for a lone hero, 5 for two, 7 for three (companions pull their weight); the room's level sets stats and the mix (archers and mages
    // from level 2, at most a third of a wave). Every fifth wave an elite takes one slot.
    const party = state.party.filter(alive).length;
    const eliteWave = (b.wave + 1) % 5 === 0;
    const n = Math.max(1, Math.min(7, 3 * party - 1) - (eliteWave ? 1 : 0));
    const ranged = lvl >= 2 ? Math.floor(n / 3) : 0;
    const kinds = Array.from({ length: n }, (_, i) => i < ranged ? (rng() < 0.5 ? 'rogue' : 'mage') : rng() < 0.55 ? 'minion' : 'warrior');
    const cells = b.cells, p = state.player, g = b.grid, reach = field(p.x, p.y);
    const reachable = (c) => reach[(c[1] - g.y0) * g.gw + (c[0] - g.x0)] < 65535;       // never behind a pool or pillar ring
    for (let i = 0; i < n; i++) {
      const kind = kinds[i], E = ENEMIES[kind];
      let x = 0, y = 0;
      for (let t = 0; t < 60; t++) { const c = cells[(rng() * cells.length) | 0]; x = c[0] + 0.5; y = c[1] + 0.5; if (Math.hypot(x - p.x, y - p.y) > 9 && reachable(c)) break; }
      const elite = eliteWave && i === n - 1;
      const hp = Math.round(E.hp * scale * (elite ? 2.5 : 1));
      w.enemies.push({ id: nextId++, kind: elite ? 'warrior' : kind, elite, lvl, x, y, hp, maxHp: hp, atk: E.atk * atkScale * (elite ? 1.3 : 1), def: E.def * scale,
        crit: E.crit, dodge: E.dodge, interval: E.interval, range: E.range, speed: E.speed, bolt: E.bolt,
        xp: E.xp * (elite ? 3 : 1), gold: E.gold * (elite ? 4 : 1), cd: 0.6 + rng() * 0.8, act: 0, flash: 0, dead: 0, dir: 2, moving: false, spawn: 0.5 });
    }
    b.wave += 1;
    bus.emit('wave', { wave: b.wave, level: lvl });
  }

  function startBattle(w, room) {
    const cells = [];
    for (const [k, c] of w.level.cells) if (c.kind === 'floor' && c.room === room) { const [x, y] = k.split(',').map(Number); cells.push([x, y]); }
    // walkable room grid for the flow fields that route units around pillars and pools
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [x, y] of cells) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const gw = x1 - x0 + 1, gh = y1 - y0 + 1, walk = new Uint8Array(gw * gh);
    for (const [x, y] of cells) if (isWalkable(w, x + 0.5, y + 0.5)) walk[(y - y0) * gw + (x - x0)] = 1;
    battle = { room, level: (w.roomLevels && w.roomLevels.get(room)) || 1 + (w.depth || 0), wave: 0, lull: 1.2, cells, grid: { x0, y0, gw, gh, walk }, fields: new Map() };
    w.enemies = []; w.projectiles = [];
    rng = mulberry32(streamSeed(seed ^ (room * 7919 + (w.depth || 0) * 104729), 0xb477));
    bus.emit('battle', { on: true, room, level: battle.level });
  }
  function endBattle(w, why) {
    battle = null; focusId = 0;
    if (w) { w.enemies = []; w.projectiles = []; }
    for (const m of state.party) if (m.down) { m.down = false; m.hp = Math.max(1, Math.round(statsFor(m).maxHp * 0.2)); }
    bus.emit('battle', { on: false, why });
    bus.emit('partyChanged', state.party);
  }

  // ── combat ──────────────────────────────────────────────────────────────────
  function resolve(att, def, power, bonusCrit = 0) {
    const w = getWorld();
    if (rng() * 100 < Math.min(50, def.dodge)) return { miss: true };
    const lvl = att.lvl || att.level || 1, mit = def.def / (def.def + 25 + 5 * lvl);
    let dmg = Math.max(1, att.atk * power * (1 - mit));
    const crit = rng() * 100 < Math.min(60, att.crit + bonusCrit);
    if (crit) dmg *= 1.75;
    return { dmg: Math.round(dmg), crit };
  }
  function applyHit(att, tgt, r, isParty, w) {
    if (r.miss) { bus.emit('combat', { t: 'miss', x: tgt.x, y: tgt.y, party: isParty }); return; }
    tgt.hp = Math.max(0, tgt.hp - r.dmg); tgt.flash = 0.12;
    bus.emit('combat', { t: 'hit', x: tgt.x, y: tgt.y, amount: r.dmg, crit: r.crit, party: isParty });
    if (tgt.hp > 0) return;
    if (isParty) { tgt.down = true; bus.emit('combat', { t: 'down', x: tgt.x, y: tgt.y, name: tgt.name }); if (!state.party.some(alive)) defeat(w); }
    else { tgt.dead = 0.6; reward(tgt); if (focusId === tgt.id) focusId = 0; }
  }
  function reward(e) {
    const living = state.party.filter(alive);
    const xp = Math.round(e.xp * e.lvl), share = Math.max(1, Math.round(xp / Math.max(1, living.length)));
    for (const m of living) {
      m.xp += share;
      while (m.xp >= xpToNext(m.level)) {
        m.xp -= xpToNext(m.level); const before = statsFor(m).maxHp; m.level += 1;
        m.hp += statsFor(m).maxHp - before; bus.emit('levelUp', { name: m.name, level: m.level });
      }
    }
    state.counters.gold = (state.counters.gold || 0) + Math.round(e.gold * e.lvl);
    bus.emit('countersChanged', { ...state.counters });
    bus.emit('combat', { t: 'xp', x: e.x, y: e.y, amount: share });
  }
  function defeat(w) {
    const lost = Math.floor((state.counters.gold || 0) * 0.25);
    state.counters.gold = (state.counters.gold || 0) - lost;
    endBattle(w, 'defeat');
    for (const m of state.party) { m.down = false; m.hp = Math.max(1, Math.round(statsFor(m).maxHp * 0.3)); }
    bus.emit('defeat', { lost });
    onDefeat();
  }
  function attack(att, tgt, isPartyAtt, w, fight) {
    let power = 1, bonus = 0, ab = null;
    const A = isPartyAtt && fight.ability;
    if (A && att.mp >= A.mp) { att.mp -= A.mp; power = A.power; bonus = A.crit || 0; ab = A; }
    att.act = 0.18; att.cd = fight.interval;
    const aStats = isPartyAtt ? { ...statsFor(att), lvl: att.level } : att;
    const dStats = isPartyAtt ? tgt : statsFor(tgt);
    const hit = () => {
      if (!(isPartyAtt ? tgt.hp > 0 && !tgt.dead : alive(tgt))) return;
      applyHit(aStats, tgt, resolve(aStats, dStats, power, bonus), !isPartyAtt, w);
      if (ab && ab.splash) for (const o of w.enemies) if (o !== tgt && !o.dead && o.hp > 0 && Math.hypot(o.x - tgt.x, o.y - tgt.y) < 1.8) applyHit(aStats, o, resolve(aStats, o, ab.splash), false, w);
    };
    if (ab) bus.emit('combat', { t: 'ability', x: att.x, y: att.y, name: ab.name });
    const bolt = isPartyAtt ? fight.bolt : att.bolt;
    if (bolt) { const d = Math.hypot(tgt.x - att.x, tgt.y - att.y); w.projectiles.push({ x: att.x, y: att.y, sx: att.x, sy: att.y, tgt, t: 0, dur: d / BOLT_SPEED, kind: ab ? 'fire' : bolt, hit }); }
    else hit();
  }

  // ── movement ────────────────────────────────────────────────────────────────
  function stepToward(u, tx, ty, speed, dt, w, room) {
    const dx = tx - u.x, dy = ty - u.y, d = Math.hypot(dx, dy); if (d < 0.05) { u.moving = false; return; }
    const s = Math.min(d, speed * dt), nx = u.x + (dx / d) * s, ny = u.y + (dy / d) * s;
    const ok = (x, y) => isWalkable(w, x, y) && (room === undefined || roomAt(w, x, y) === room);
    if (ok(nx, ny)) { u.x = nx; u.y = ny; } else if (ok(nx, u.y)) u.x = nx; else if (ok(u.x, ny)) u.y = ny;
    u.moving = true; u.fx = dx; u.fy = dy;
  }
  // Distance field (BFS, 8-way, no corner cutting) to a target cell over the room grid.
  function field(tx, ty) {
    const b = battle, g = b.grid, cx = Math.floor(tx) - g.x0, cy = Math.floor(ty) - g.y0, key = cy * g.gw + cx;
    let f = b.fields.get(key); if (f) return f;
    if (b.fields.size > 48) b.fields.clear();
    f = new Uint16Array(g.gw * g.gh).fill(65535);
    if (cx < 0 || cy < 0 || cx >= g.gw || cy >= g.gh) { b.fields.set(key, f); return f; }
    const q = new Int32Array(g.gw * g.gh); let h = 0, t = 0; f[key] = 0; q[t++] = key;
    while (h < t) {
      const i = q[h++], x = i % g.gw, y = (i / g.gw) | 0, d = f[i] + 1;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= g.gw || ny >= g.gh) continue;
        const j = ny * g.gw + nx; if (!g.walk[j] || f[j] !== 65535) continue;
        if (dx && dy && (!g.walk[y * g.gw + nx] || !g.walk[ny * g.gw + x])) continue;
        f[j] = d; q[t++] = j;
      }
    }
    b.fields.set(key, f); return f;
  }
  const clearLine = (w, ax, ay, bx, by, room) => {
    const d = Math.hypot(bx - ax, by - ay), n = Math.ceil(d / 0.4);
    for (let k = 1; k < n; k++) { const x = ax + ((bx - ax) * k) / n, y = ay + ((by - ay) * k) / n; if (!isWalkable(w, x, y) || roomAt(w, x, y) !== room) return false; }
    return true;
  };
  // Move toward (tx, ty) inside the battle room: straight when the way is clear, else down the flow field.
  function chase(u, tx, ty, speed, dt, w) {
    const b = battle, room = b.room;
    if (roomAt(w, u.x, u.y) !== room) return stepToward(u, tx, ty, speed, dt, w);   // still in the doorway: walk in
    if (clearLine(w, u.x, u.y, tx, ty, room)) return stepToward(u, tx, ty, speed, dt, w, room);
    const g = b.grid, f = field(tx, ty), cx = Math.floor(u.x) - g.x0, cy = Math.floor(u.y) - g.y0;
    let best = -1, bd = cx >= 0 && cy >= 0 && cx < g.gw && cy < g.gh ? f[cy * g.gw + cx] : 65535;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = cx + dx, ny = cy + dy; if ((!dx && !dy) || nx < 0 || ny < 0 || nx >= g.gw || ny >= g.gh) continue;
      if (dx && dy && (!g.walk[cy * g.gw + nx] || !g.walk[ny * g.gw + cx])) continue;
      const j = ny * g.gw + nx; if (f[j] < bd) { bd = f[j]; best = j; }
    }
    if (best < 0) return stepToward(u, tx, ty, speed, dt, w, room);
    stepToward(u, g.x0 + (best % g.gw) + 0.5, g.y0 + ((best / g.gw) | 0) + 0.5, speed, dt, w, room);
  }
  function separate(units, w) {
    for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) {
      const a = units[i], b = units[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01;
      if (d < 0.75) { const push = (0.75 - d) * 0.5, px = (dx / d) * push, py = (dy / d) * push;
        if (!a.isHero && isWalkable(w, a.x - px, a.y - py)) { a.x -= px; a.y -= py; }
        if (!b.isHero && isWalkable(w, b.x + px, b.y + py)) { b.x += px; b.y += py; } }
    }
  }
  const nearest = (u, list, pred = () => true) => { let best = null, bd = 1e9; for (const o of list) { if (!pred(o)) continue; const d = Math.hypot(o.x - u.x, o.y - u.y); if (d < bd) { bd = d; best = o; } } return best; };

  // ── the step ────────────────────────────────────────────────────────────────
  function step(dt) {
    const w = getWorld(), p = state.player, H = hero();
    p.steer = (p.steer ?? 1e9) + dt;
    ensureRuntime();
    const inDungeon = w.kind === 'dungeon';
    const room = inDungeon ? roomAt(w, p.x, p.y) : -1;
    if (battle && room !== battle.room) endBattle(w, 'left');
    if (!battle && inDungeon && room >= 0 && w.level.entrance && room !== w.level.entrance.id && alive(H)) startBattle(w, room);

    // regen (×5 out of battle and during lulls)
    const calm = !battle || battle.between || (battle.wave === 0 && !w.enemies.length);
    for (const m of state.party) {
      if (m.down) continue;
      const c = CLASSES[m.cls], s = statsFor(m), k = calm ? OUT_OF_BATTLE_REGEN : 1;
      m.hp = Math.min(s.maxHp, m.hp + c.hpr * (s.maxHp / c.hp[0]) * k * dt); m.mp = Math.min(s.maxMp, m.mp + c.mpr * (s.maxMp / c.mp[0]) * k * dt);   // regen grows with the pool
      m.cd = Math.max(0, m.cd - dt); m.act = Math.max(0, m.act - dt); m.flash = Math.max(0, (m.flash || 0) - dt);
    }
    // companions: follow (formation behind the hero) out of battle
    const foes = battle ? w.enemies.filter((e) => !e.dead && e.hp > 0 && e.spawn <= 0) : [];
    state.party.forEach((m, i) => {
      if (i === 0 || m.down) return;
      if (!foes.length) {
        const fx = p.x - (p.fx || 0) * 1.4 + (i === 1 ? -1 : 1) * 1.0, fy = p.y - (p.fy || 1) * 1.4 + 0.4;
        if (Math.hypot(fx - m.x, fy - m.y) > 1.2) stepToward(m, fx, fy, 8.4, dt, w); else m.moving = false;
      }
    });
    if (battle) {
      // waves
      if (!foes.length && !w.enemies.some((e) => e.dead > 0 || e.spawn > 0)) {
        if (battle.wave > 0 && !battle.between) {               // a wave just fell: start the lull
          battle.between = true; battle.lull = LULL; battle.waited = 0;
          bus.emit('wave', { wave: battle.wave, level: battle.level, cleared: true });
          for (const m of state.party) if (m.down) {                // the fallen get back up in the lull
            m.down = false; m.hp = Math.max(1, Math.round(statsFor(m).maxHp * REVIVE));
            bus.emit('combat', { t: 'rise', x: m.x, y: m.y, name: m.name });
          }
        }
        battle.lull -= dt; battle.waited = (battle.waited || 0) + dt;
        // the next wave comes when the lull is over and the party has caught its breath (or waited long enough)
        if (battle.lull <= 0 && (battle.wave === 0 || partyHp() >= LULL_READY || battle.waited >= LULL_MAX)) { battle.between = false; spawnWave(w); }
      }
      const focus = focusId && foes.find((e) => e.id === focusId);
      // party AI
      state.party.forEach((m, i) => {
        if (!alive(m) || !foes.length) return;
        const F = CLASS_FIGHT[m.cls];
        let tgt = focus || (m.cls === 'rogue' ? foes.reduce((a, b) => (b.hp < a.hp ? b : a)) : m.cls === 'fighter' && i > 0 ? nearest(H, foes) : nearest(m, foes));
        if (!tgt) return;
        const d = Math.hypot(tgt.x - m.x, tgt.y - m.y);
        m.fx = tgt.x - m.x; m.fy = tgt.y - m.y;
        if (i === 0) {                                          // the hero: yours while you steer, autobattles when you let go
          if (p.moving) return;
          if (d <= F.range + 0.2) { if (m.cd <= 0) attack(m, tgt, true, w, F); return; }
          if ((p.steer ?? 1e9) < AUTO_DELAY || !moveHero) return;
          const q = { x: p.x, y: p.y };                         // step toward the target, leashed to the room
          chase(q, tgt.x, tgt.y, F.speed, dt, w);
          if (q.x !== p.x || q.y !== p.y) { moveHero(q.x - p.x, q.y - p.y); m.x = p.x; m.y = p.y; }
          return;
        }
        const close = nearest(m, foes);
        if (F.keepAway && close && Math.hypot(close.x - m.x, close.y - m.y) < F.keepAway * 0.7) {        // mage: back off
          stepToward(m, m.x - (close.x - m.x), m.y - (close.y - m.y), F.speed, dt, w);
        } else if (d > F.range) chase(m, tgt.x, tgt.y, F.speed, dt, w);
        else { m.moving = false; if (m.cd <= 0) attack(m, tgt, true, w, F); }
      });
      // enemy AI (leashed to the room)
      const targets = state.party.filter(alive);
      for (const e of w.enemies) {
        e.act = Math.max(0, e.act - dt); e.flash = Math.max(0, e.flash - dt);
        if (e.spawn > 0) { e.spawn -= dt; continue; }
        if (e.dead > 0 || e.hp <= 0) { e.moving = false; continue; }
        e.cd = Math.max(0, e.cd - dt);
        const t = nearest(e, targets); if (!t) { e.moving = false; continue; }
        const d = Math.hypot(t.x - e.x, t.y - e.y); e.fx = t.x - e.x; e.fy = t.y - e.y;
        if (d > e.range) chase(e, t.x, t.y, e.speed, dt, w);
        else { e.moving = false; if (e.cd <= 0) attack(e, t, false, w, e); }
      }
      separate([{ ...H, x: p.x, y: p.y, isHero: true }, ...state.party.slice(1).filter(alive), ...w.enemies.filter((e) => !e.dead && e.spawn <= 0)], w);
    }
    // projectiles
    if (w.projectiles) for (const b of w.projectiles) { b.t += dt; const k = Math.min(1, b.t / b.dur); b.x = b.sx + (b.tgt.x - b.sx) * k; b.y = b.sy + (b.tgt.y - b.sy) * k; if (k >= 1 && !b.done) { b.done = true; b.hit(); } }
    if (w.projectiles) w.projectiles = w.projectiles.filter((b) => !b.done);
    // the dead fade, then go
    if (w.enemies && battle) for (const e of w.enemies) if (e.dead > 0) e.dead -= dt;
    if (w.enemies && battle) w.enemies = w.enemies.filter((e) => !(e.hp <= 0 && e.dead <= 0));
  }

  return {
    step,
    get battle() { return battle; },
    focus(id) { focusId = id; },
    reset() { battle = null; focusId = 0; placeCompanions(); },
    placeCompanions,
  };
}
