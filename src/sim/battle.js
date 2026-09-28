// battle.js — room battles with respawning waves (GDD §3). Headless, deterministic,
// stepped by core.js at 20 Hz.
//
// Enter any dungeon room but the entrance (a sanctuary) and its battle starts: a wave
// spawns away from the party, the party fights on its own, a 4 s lull follows each
// cleared wave, and every wave survived in a row raises the room's Heat (+4 % enemy
// stats, +10 % rewards, up to 10). Enemies are leashed to their room. Walk out of the
// room to end it (the room resets). If the whole party falls, you're carried to town.
//
// Control (GDD §3.4): the hero is yours to move and attacks only while you stand
// still; companions act on their own (fighter guards you, rogue hunts the weakest,
// mage keeps distance and casts). Tap an enemy to focus the party on it.

import { mulberry32, streamSeed } from './rng.js';
import { CLASSES, statsFor, xpToNext } from './party.js';

// class combat traits (stats are in party.js / the GDD tables)
const CLASS_FIGHT = {
  fighter: { interval: 1.3, range: 1.45, speed: 6.2, ability: { name: 'Cleave', mp: 10, power: 1.3, splash: 0.65 } },
  rogue:   { interval: 0.9, range: 1.35, speed: 6.8, ability: { name: 'Backstab', mp: 10, power: 1.6, crit: 25 } },
  mage:    { interval: 1.6, range: 7.0,  speed: 5.8, ability: { name: 'Firebolt', mp: 12, power: 1.8 }, bolt: 'fire', keepAway: 3.2 },
};
// Ashbound archetypes at level 1 (GDD §7: × (1 + 0.14 × (level − 1)); Heat and elites on top)
const ENEMIES = {
  minion:  { hp: 40, atk: 6,  def: 4, crit: 5, dodge: 5,  interval: 1.2, range: 1.35, speed: 3.3, xp: 10, gold: 1 },
  warrior: { hp: 62, atk: 9,  def: 8, crit: 5, dodge: 3,  interval: 1.4, range: 1.45, speed: 2.9, xp: 14, gold: 2 },
  rogue:   { hp: 38, atk: 8,  def: 3, crit: 10, dodge: 10, interval: 1.6, range: 6.0, speed: 3.5, xp: 12, gold: 2, bolt: 'bolt', keepAway: 4 },
  mage:    { hp: 34, atk: 10, def: 2, crit: 5, dodge: 5,  interval: 2.0, range: 7.0, speed: 2.7, xp: 14, gold: 3, bolt: 'soul', keepAway: 5 },
};
export const ENEMY_KINDS = Object.keys(ENEMIES);
const HEAT_MAX = 10, LULL = 4, OUT_OF_BATTLE_REGEN = 5, BOLT_SPEED = 13;

export function createBattle({ state, bus, getWorld, seed, isWalkable, onDefeat }) {
  let rng = mulberry32(streamSeed(seed, 0xb477));
  let battle = null, nextId = 1, focusId = 0;

  // a room tile keeps its room id even where a corridor was carved through it
  const roomAt = (w, x, y) => { const c = w.level && w.level.cells.get(Math.floor(x) + ',' + Math.floor(y)); return c && c.kind === 'floor' && c.room >= 0 ? c.room : -1; };
  const hero = () => state.party[0];
  const alive = (u) => u && !u.down && u.hp > 0;

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
    const b = battle, lvl = 1 + (w.depth || 0), scale = (1 + 0.14 * (lvl - 1)) * (1 + 0.04 * b.heat);
    // size scales with the living party; ranged skeletons join from wave 5, at most a third of a wave
    const party = state.party.filter(alive).length;
    const n = Math.min(7, party + 1 + Math.floor(b.wave / 3) + (w.depth || 0) + Math.floor(b.heat / 4));
    const ranged = b.wave >= 4 ? Math.floor(n / 3) : 0;
    const kinds = Array.from({ length: n }, (_, i) => i < ranged ? (rng() < 0.5 ? 'rogue' : 'mage') : b.wave < 2 || rng() < 0.55 ? 'minion' : 'warrior');
    const cells = b.cells, p = state.player;
    for (let i = 0; i < n; i++) {
      const kind = kinds[i], E = ENEMIES[kind];
      let x = 0, y = 0;
      for (let t = 0; t < 40; t++) { const c = cells[(rng() * cells.length) | 0]; x = c[0] + 0.5; y = c[1] + 0.5; if (Math.hypot(x - p.x, y - p.y) > 9 && isWalkable(w, x, y)) break; }
      const elite = (b.wave + 1) % 5 === 0 && i === n - 1;
      const hp = Math.round(E.hp * scale * (elite ? 2.5 : 1));
      w.enemies.push({ id: nextId++, kind: elite ? 'warrior' : kind, elite, lvl, x, y, hp, maxHp: hp, atk: E.atk * scale * (elite ? 1.3 : 1), def: E.def * scale,
        crit: E.crit, dodge: E.dodge, interval: E.interval, range: E.range, speed: E.speed, bolt: E.bolt, keepAway: E.keepAway || 0,
        xp: E.xp * (elite ? 3 : 1), gold: E.gold * (elite ? 4 : 1), cd: 0.6 + rng() * 0.8, act: 0, flash: 0, dead: 0, dir: 2, moving: false, spawn: 0.5 });
    }
    b.wave += 1;
    bus.emit('wave', { wave: b.wave, heat: b.heat });
  }

  function startBattle(w, room) {
    const cells = [];
    for (const [k, c] of w.level.cells) if (c.kind === 'floor' && c.room === room) { const [x, y] = k.split(',').map(Number); cells.push([x, y]); }
    battle = { room, wave: 0, heat: 0, lull: 1.2, cells };
    w.enemies = []; w.projectiles = [];
    rng = mulberry32(streamSeed(seed ^ (room * 7919 + (w.depth || 0) * 104729), 0xb477));
    bus.emit('battle', { on: true, room });
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
    const heatK = 1 + 0.1 * (battle ? battle.heat : 0), living = state.party.filter(alive);
    const xp = Math.round(e.xp * e.lvl * heatK), share = Math.max(1, Math.round(xp / Math.max(1, living.length)));
    for (const m of living) {
      m.xp += share;
      while (m.xp >= xpToNext(m.level)) {
        m.xp -= xpToNext(m.level); const before = statsFor(m).maxHp; m.level += 1;
        m.hp += statsFor(m).maxHp - before; bus.emit('levelUp', { name: m.name, level: m.level });
      }
    }
    state.counters.gold = (state.counters.gold || 0) + Math.round(e.gold * e.lvl * heatK);
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
    ensureRuntime();
    const inDungeon = w.kind === 'dungeon';
    const room = inDungeon ? roomAt(w, p.x, p.y) : -1;
    if (battle && room !== battle.room) endBattle(w, 'left');
    if (!battle && inDungeon && room >= 0 && w.level.entrance && room !== w.level.entrance.id && alive(H)) startBattle(w, room);

    // regen (×5 out of battle and during lulls)
    const calm = !battle || (battle.lull > 0 && !w.enemies.some((e) => !e.dead));
    for (const m of state.party) {
      if (m.down) continue;
      const c = CLASSES[m.cls], s = statsFor(m), k = calm ? OUT_OF_BATTLE_REGEN : 1;
      m.hp = Math.min(s.maxHp, m.hp + c.hpr * k * dt); m.mp = Math.min(s.maxMp, m.mp + c.mpr * k * dt);
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
        if (battle.lull <= 0) { battle.lull = battle.wave === 0 ? 0.01 : LULL; if (battle.wave > 0) { battle.heat = Math.min(HEAT_MAX, battle.heat + 1); bus.emit('wave', { wave: battle.wave, heat: battle.heat, cleared: true }); } }
        battle.lull -= dt;
        if (battle.lull <= 0) spawnWave(w);
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
        if (i === 0) {                                          // the hero: yours to move; attacks while you stand still
          if (!p.moving && d <= F.range + 0.2 && m.cd <= 0) attack(m, tgt, true, w, F);
          return;
        }
        const close = nearest(m, foes);
        if (F.keepAway && close && Math.hypot(close.x - m.x, close.y - m.y) < F.keepAway * 0.7) {        // mage: back off
          stepToward(m, m.x - (close.x - m.x), m.y - (close.y - m.y), F.speed, dt, w);
        } else if (d > F.range) stepToward(m, tgt.x, tgt.y, F.speed, dt, w);
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
        if (e.keepAway && d < e.keepAway * 0.6) stepToward(e, e.x - (t.x - e.x), e.y - (t.y - e.y), e.speed, dt, w, battle.room);
        else if (d > e.range) stepToward(e, t.x, t.y, e.speed, dt, w, battle.room);
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
