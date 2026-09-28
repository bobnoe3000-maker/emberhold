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
  fighter: { interval: 1.3, range: 3.0, speed: 6.2, ability: { name: 'Cleave', mp: 10, power: 1.3, splash: 0.65 } },
  rogue:   { interval: 0.9, range: 2.8, speed: 6.8, ability: { name: 'Backstab', mp: 10, power: 1.6, crit: 25 } },
  mage:    { interval: 1.6, range: 7.0,  speed: 5.8, ability: { name: 'Firebolt', mp: 12, power: 1.8 }, bolt: 'fire', keepAway: 3.2 },
};
// Ashbound archetypes at level 1 (GDD §7: × (1 + 0.14 × (level − 1)); elites on top)
const ENEMIES = {
  minion:  { hp: 36, atk: 7,   def: 4, crit: 5, dodge: 5,  interval: 1.2, range: 2.8, speed: 3.3, xp: 10, gold: 1 },
  warrior: { hp: 54, atk: 9.5, def: 6, crit: 5, dodge: 3,  interval: 1.4, range: 3.0, speed: 2.9, xp: 14, gold: 2 },
  rogue:   { hp: 36, atk: 8,   def: 3, crit: 10, dodge: 10, interval: 1.6, range: 6.0, speed: 3.5, xp: 12, gold: 2, bolt: 'bolt' },
  mage:    { hp: 34, atk: 10.5, def: 2, crit: 5, dodge: 5,  interval: 2.0, range: 7.0, speed: 2.7, xp: 14, gold: 3, bolt: 'soul' },
};
export const ENEMY_KINDS = Object.keys(ENEMIES);
const LULL = 4, OUT_OF_BATTLE_REGEN = 5, BOLT_SPEED = 13, AUTO_DELAY = 0.5;
// Animation timing the sim honours so hits land on the swing: a blow (or a bolt's release)
// comes WINDUP s after the attack starts (the baked attack clip's impact frame); a slain
// skeleton lies DEATH_T s (death clip, then a fade) before it's cleared.
export const WINDUP = 0.18, DEATH_T = 1.1;
const SEP_XB = 32, SEP_YB = 16, SEP_X = SEP_XB, SEP_Y = SEP_YB;   // personal space on screen (px): a 56 px figure with shield and blade spans ~32 px
// Melee stations around a target, as SCREEN directions (x right, y down): a 56 px figure is
// far taller than a tile is deep, so fighters stacked along the screen's vertical overlap
// badly while side-by-side ones don't. Attackers take the left/right stations first, then
// the four diagonals; a second ring waits further out when all six are held.
const STATIONS = [[1, 0], [-1, 0], [0.8, 0.6], [-0.8, 0.6], [0.8, -0.6], [-0.8, -0.6]].map(([a, b]) => {
  const wx = (a / 8 + b / 4) / 2, wy = (b / 4 - a / 8) / 2, l = Math.hypot(wx, wy); return [wx / l, wy / l];   // screen → world unit vector
});
// The lull is 4 s, stretched (up to 15 s) while the party is under half HP, so a bad wave
// is followed by a breather. Companions who fell during a wave get back up at 25 % HP
// when it's cleared.
const LULL_MAX = 15, LULL_READY = 0.5, REVIVE = 0.25;

export function createBattle({ state, bus, getWorld, seed, isWalkable, onDefeat, moveHero }) {
  let rng = mulberry32(streamSeed(seed, 0xb477));
  let battle = null, nextId = 1, focusId = 0, pending = [];   // pending: blows and releases waiting on their wind-up

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
    pending = [];
    battle = { room, level: (w.roomLevels && w.roomLevels.get(room)) || 1 + (w.depth || 0), wave: 0, lull: 1.2, cells, grid: { x0, y0, gw, gh, walk }, fields: new Map() };
    w.enemies = []; w.projectiles = [];
    rng = mulberry32(streamSeed(seed ^ (room * 7919 + (w.depth || 0) * 104729), 0xb477));
    bus.emit('battle', { on: true, room, level: battle.level });
  }
  function endBattle(w, why) {
    battle = null; focusId = 0; pending = [];
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
    tgt.hp = Math.max(0, tgt.hp - r.dmg); tgt.flash = 0.12; tgt.hitN = (tgt.hitN || 0) + 1;
    bus.emit('combat', { t: 'hit', x: tgt.x, y: tgt.y, amount: r.dmg, crit: r.crit, party: isParty });
    if (tgt.hp > 0) return;
    if (isParty) { tgt.down = true; bus.emit('combat', { t: 'down', x: tgt.x, y: tgt.y, name: tgt.name }); if (!state.party.some(alive)) defeat(w); }
    else { tgt.dead = DEATH_T; reward(tgt); if (focusId === tgt.id) focusId = 0; }
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
    att.act = 0.35; att.cd = fight.interval; att.atkN = (att.atkN || 0) + 1;   // atkN: the renderer starts the attack clip
    const aStats = isPartyAtt ? { ...statsFor(att), lvl: att.level } : att;
    const dStats = isPartyAtt ? tgt : statsFor(tgt);
    const hit = () => {
      if (!(isPartyAtt ? tgt.hp > 0 && !tgt.dead : alive(tgt))) return;
      applyHit(aStats, tgt, resolve(aStats, dStats, power, bonus), !isPartyAtt, w);
      if (ab && ab.splash) for (const o of w.enemies) if (o !== tgt && !o.dead && o.hp > 0 && Math.hypot(o.x - tgt.x, o.y - tgt.y) < 1.8) applyHit(aStats, o, resolve(aStats, o, ab.splash), false, w);
    };
    if (ab) bus.emit('combat', { t: 'ability', x: att.x, y: att.y, name: ab.name });
    const bolt = isPartyAtt ? fight.bolt : att.bolt;
    const standing = () => (isPartyAtt ? !att.down : att.hp > 0 && !att.dead);
    pending.push({ t: WINDUP, fn: () => {
      if (!standing()) return;                               // cut down mid-swing
      if (bolt) { const d = Math.hypot(tgt.x - att.x, tgt.y - att.y); w.projectiles.push({ x: att.x, y: att.y, px: att.x, py: att.y, sx: att.x, sy: att.y, tgt, t: 0, dur: d / BOLT_SPEED, kind: ab ? 'fire' : bolt, hit }); }
      else hit();
    } });
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
  // Personal space, measured ON SCREEN: an ellipse SEP_X px wide × SEP_Y px deep (half
  // extents). World-round spacing leaves figures stacked on the screen's vertical (a tile
  // front-to-back is only 4 px), so the push runs in screen space and maps back to the world.
  function separate(units, w, SEP_X = SEP_XB, SEP_Y = SEP_YB) {
    for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) {
      const a = units[i], b = units[j], dx = b.x - a.x, dy = b.y - a.y;
      let u = ((dx - dy) * 8) / SEP_X, v = ((dx + dy) * 4) / SEP_Y, e = Math.hypot(u, v);
      if (e >= 1) continue;
      if (e < 1e-3) { u = (a.id || i) < (b.id || j) ? -1 : 1; v = 0; e = 1; }       // coincident: part sideways
      const k = ((1 - Math.min(1, e)) * (a.isHero || b.isHero ? 1 : 0.5)) / e, pu = u * k * SEP_X, pv = v * k * SEP_Y;   // half the gap each, in px
      const px = (pu / 8 + pv / 4) / 2, py = (pv / 4 - pu / 8) / 2;                   // screen px → world tiles
      if (!a.isHero && isWalkable(w, a.x - px, a.y - py)) { a.x -= px; a.y -= py; }
      if (!b.isHero && isWalkable(w, b.x + px, b.y + py)) { b.x += px; b.y += py; }
    }
  }
  const nearest = (u, list, pred = () => true) => { let best = null, bd = 1e9; for (const o of list) { if (!pred(o)) continue; const d = Math.hypot(o.x - u.x, o.y - u.y); if (d < bd) { bd = d; best = o; } } return best; };

  // Claim (or keep) a melee station around tgt for u this tick; returns its world point.
  let claims = new Map();
  function station(u, tgt, range, w) {
    const r = range - 0.25, taken = claims.get(tgt) || claims.set(tgt, new Set()).get(tgt);
    let best = -1, bd = 1e9;
    for (let k = 0; k < STATIONS.length * 2; k++) {
      if (taken.has(k)) continue;
      const ring = k < STATIONS.length ? 1 : 1.75, [ux, uy] = STATIONS[k % STATIONS.length];
      const x = tgt.x + ux * r * ring, y = tgt.y + uy * r * ring;
      if (!isWalkable(w, x, y) || roomAt(w, x, y) !== battle.room) continue;
      if (crowded(x, y, u, tgt)) continue;                                   // someone else already stands there (on screen)
      const cost = Math.hypot(x - u.x, y - u.y) + (k % STATIONS.length < 2 ? 0 : 0.8) + (ring > 1 ? 6 : 0) - (u.slotTgt === tgt && u.slotK === k ? 1.5 : 0);
      if (cost < bd) { bd = cost; best = k; }
    }
    if (best < 0) return null;
    taken.add(best); u.slotTgt = tgt; u.slotK = best;
    const ring = best < STATIONS.length ? 1 : 1.75, [ux, uy] = STATIONS[best % STATIONS.length];
    return { x: tgt.x + ux * r * ring, y: tgt.y + uy * r * ring, inner: ring === 1 };
  }
  // is (x, y) inside another live unit's on-screen personal space? (u and its target excepted)
  let bodies = [];
  const crowded = (x, y, u, tgt) => bodies.some((o) => o !== u && o !== tgt && o.src !== u && o.src !== tgt && Math.hypot(((o.x - x - (o.y - y)) * 8) / SEP_X, ((o.x - x + (o.y - y)) * 4) / SEP_Y) < 0.9);
  const freeStations = (tgt) => STATIONS.length - ((claims.get(tgt) || { size: 0 }).size);
  // Melee: hold a station beside the target and swing when in reach; never slide mid-swing.
  function melee(u, tgt, F, dt, w, isParty, move) {
    const d = Math.hypot(tgt.x - u.x, tgt.y - u.y), st = station(u, tgt, F.range, w);
    const inReach = d <= F.range + 0.25;
    if (inReach && u.cd <= 0) { u.moving = false; attack(u, tgt, isParty, w, F); return; }
    if (u.act > 0.12) { u.moving = false; return; }                     // finishing the swing
    const goal = st || tgt;
    if (Math.hypot(goal.x - u.x, goal.y - u.y) > 0.4 && !(inReach && !st)) move(goal.x, goal.y);
    else u.moving = false;
  }

  // ── companions at ease (critic: they huddled on the hero) ────────────────────
  // Formation: a station behind the hero on each side — FORM_BACK tiles back along its heading,
  // FORM_SIDE out to the side, plus a personal offset so the two never mirror each other.
  // Once the hero has stood still a moment they loosen up: each strolls to a spot of its own
  // near its station every few seconds, glances about or fidgets (clips the renderer plays
  // from lookN / fidgetN), and after a longer wait sits down; the hero moving brings them up.
  // The hero fidgets too. Screen-space personal space keeps everyone apart throughout.
  // Stations are laid out in SCREEN pixels (behind the hero's on-screen heading, one to each
  // side) and mapped back to the world: world-space stations put one companion straight
  // above the hero on screen whenever it walked along a world axis.
  const FORM_BACK = 26, FORM_SIDE = 38, EASE_AFTER = 1.5, SIT_AFTER = 15, STROLL = 1.9;
  const scr2w = (sx, sy) => [(sx / 8 + sy / 4) / 2, (sy / 4 - sx / 8) / 2];      // screen px → world tiles
  const idleRng = mulberry32(streamSeed(seed, 0x1d1e));
  let heroStill = 0, clock = 0;
  function atEase(dt, w, p, H) {
    clock += dt;
    heroStill = p.moving ? 0 : heroStill + dt;
    const wx0 = p.fx ?? 0.7, wy0 = p.fy ?? 0.7;                          // heading, on screen
    let hx = (wx0 - wy0) * 8, hy = (wx0 + wy0) * 4; const hl = Math.hypot(hx, hy) || 1; hx /= hl; hy /= hl;
    const px_ = -hy, py_ = hx;
    state.party.forEach((m, i) => {
      if (i === 0) {                                                     // the hero: an occasional fidget or glance when idle
        if (heroStill > 4 && clock >= (H.nextFidget ?? 0)) { H.nextFidget = clock + 7 + idleRng() * 8; if (heroStill > 5) (idleRng() < 0.5 ? (H.fidgetN = (H.fidgetN || 0) + 1) : (H.lookN = (H.lookN || 0) + 1)); }
        if (p.moving) H.nextFidget = clock + 5;
        return;
      }
      if (m.down) return;
      const side = i === 1 ? -1 : 1, j = ((m.id || '').length * 7 + i * 13) % 10 / 10 - 0.5;   // a personal offset, stable per companion
      const [ox, oy] = scr2w(-hx * (FORM_BACK + j * 8) + px_ * side * (FORM_SIDE + j * 6), -hy * (FORM_BACK + j * 8) + py_ * side * (FORM_SIDE + j * 6));
      const sx = p.x + ox, sy = p.y + oy;
      if (heroStill < EASE_AFTER) {                                      // on the move: keep station
        m.sitting = false; m.ease = null;
        const d = Math.hypot(sx - m.x, sy - m.y);
        if (d > 0.8) stepToward(m, sx, sy, d > 6 ? 10 : 8.4, dt, w); else m.moving = false;
        return;
      }
      if (m.sitting) { m.moving = false; return; }
      const e = m.ease || (m.ease = { next: clock + idleRng() * 2, gx: m.x, gy: m.y });
      if (clock >= e.next) {                                             // a new spot, and maybe a gesture
        const [dx, dy] = scr2w((idleRng() - 0.5) * 30, (idleRng() - 0.5) * 16);   // a spot near the station, mostly sideways on screen
        const gx = sx + dx, gy = sy + dy;
        if (isWalkable(w, gx, gy)) { e.gx = gx; e.gy = gy; }
        e.next = clock + 4 + idleRng() * 6;
        const k = idleRng();
        if (k < 0.3) m.fidgetN = (m.fidgetN || 0) + 1;
        else if (k < 0.6) { m.lookN = (m.lookN || 0) + 1; const la = idleRng() * Math.PI * 2; m.fx = Math.cos(la); m.fy = Math.sin(la); }
        else { m.fx = p.x - m.x; m.fy = p.y - m.y; }                    // turn to the hero
      }
      const d = Math.hypot(e.gx - m.x, e.gy - m.y);
      if (d > 0.3) stepToward(m, e.gx, e.gy, STROLL, dt, w); else m.moving = false;
      if (heroStill > SIT_AFTER + i * 2.5 && !m.moving) { m.sitting = true; m.fx = p.x - m.x; m.fy = p.y - m.y; }   // settle down, facing the hero
    });
    separate([{ ...H, x: p.x, y: p.y, isHero: true }, ...state.party.slice(1).filter((m) => !m.down)], w, 36, 24);   // roomier than in a melee
  }

  // ── the step ────────────────────────────────────────────────────────────────
  function step(dt) {
    const w = getWorld(), p = state.player, H = hero();
    p.steer = (p.steer ?? 1e9) + dt;
    ensureRuntime();
    // last tick's positions, so the renderer can interpolate every unit between 20 Hz steps
    for (const m of state.party) { m.px = m.x; m.py = m.y; }
    for (const e of w.enemies || []) { e.px = e.x; e.py = e.y; }
    for (const b of w.projectiles || []) { b.px = b.x; b.py = b.y; }
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
    // companions out of battle: follow in formation, loosen up when the hero stands still
    const foes = battle ? w.enemies.filter((e) => !e.dead && e.hp > 0 && e.spawn <= 0) : [];
    if (!foes.length) atEase(dt, w, p, H);
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
      claims = new Map();
      bodies = [{ x: p.x, y: p.y, src: H }, ...state.party.slice(1).filter(alive), ...w.enemies.filter((e) => e.hp > 0 && !e.dead && !(e.spawn > 0))];
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
          if ((p.steer ?? 1e9) < AUTO_DELAY || !moveHero) { if (d <= F.range + 0.25 && m.cd <= 0) attack(m, tgt, true, w, F); return; }
          melee(m, tgt, F, dt, w, true, (gx, gy) => {               // autobattle: take a station, leashed to the room
            const q = { x: p.x, y: p.y }; chase(q, gx, gy, F.speed, dt, w);
            if (q.x !== p.x || q.y !== p.y) { moveHero(q.x - p.x, q.y - p.y); m.x = p.x; m.y = p.y; }
          });
          return;
        }
        const close = nearest(m, foes);
        if (F.keepAway && close && Math.hypot(close.x - m.x, close.y - m.y) < F.keepAway * 0.7) {        // mage: back off
          stepToward(m, m.x - (close.x - m.x), m.y - (close.y - m.y), F.speed, dt, w);
        } else if (F.bolt) { if (d > F.range) chase(m, tgt.x, tgt.y, F.speed, dt, w); else { m.moving = false; if (m.cd <= 0) attack(m, tgt, true, w, F); } }
        else melee(m, tgt, F, dt, w, true, (gx, gy) => chase(m, gx, gy, F.speed, dt, w));
      });
      // enemy AI (leashed to the room)
      const targets = state.party.filter(alive);
      for (const e of w.enemies) {
        e.act = Math.max(0, e.act - dt); e.flash = Math.max(0, e.flash - dt);
        if (e.spawn > 0) { e.spawn -= dt; continue; }
        if (e.dead > 0 || e.hp <= 0) { e.moving = false; continue; }
        e.cd = Math.max(0, e.cd - dt);
        // melee skeletons pick the nearest party member with a free station (else the nearest)
        const t = e.bolt ? nearest(e, targets) : nearest(e, targets, (q) => freeStations(q) > 0 || e.slotTgt === q) || nearest(e, targets);
        if (!t) { e.moving = false; continue; }
        const d = Math.hypot(t.x - e.x, t.y - e.y); e.fx = t.x - e.x; e.fy = t.y - e.y;
        if (e.bolt) { if (d > e.range) chase(e, t.x, t.y, e.speed, dt, w); else { e.moving = false; if (e.cd <= 0) attack(e, t, false, w, e); } }
        else melee(e, t, e, dt, w, false, (gx, gy) => chase(e, gx, gy, e.speed, dt, w));
      }
      separate([{ ...H, x: p.x, y: p.y, isHero: true }, ...state.party.slice(1).filter(alive), ...w.enemies.filter((e) => !e.dead && e.spawn <= 0)], w);
    }
    // wind-ups: blows land and bolts leave on the attack clip's impact frame
    if (pending.length) { const due = []; pending = pending.filter((q) => ((q.t -= dt) > 0 ? true : (due.push(q), false))); if (battle) for (const q of due) q.fn(); }
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
    reset() { battle = null; focusId = 0; pending = []; placeCompanions(); },
    placeCompanions,
  };
}
