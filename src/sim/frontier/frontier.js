// @ts-check
// frontier.js — the Frontier's sim (docs/frontier-proposal.md): a party on the Old Provinces as one land, exploring
// with the stick and holding a spot to autobattle the camps around it. Headless and deterministic as the game's sim
// is: a fixed 20 Hz tick, commands in (validated, an invalid one does nothing), events out on its bus, every draw from
// one seeded stream in tick order, the land itself from position hashes (land.js). It's a sandbox for the proof of
// concept: it reads and writes no save, and nothing in it reaches a game slot.
//
// Commands:
//   { type: 'stick', x, y }   the stick held: run that way (world axes, |v| ≤ 1); lifts any lock
//   { type: 'release' }       the stick let go: lock a ring where the hero stands, and autobattle in it (§5)
//   { type: 'jump', town }    (proof of concept) stand in a town's square: every band within a minute's reach
//   { type: 'level', n }      (proof of concept) the party at level n, 1–75
// Events: 'hit' 'miss' 'heal' 'kill' 'respawn' 'aggro' 'evade' 'level' 'down' 'rise' 'wipe' 'lock' 'unlock'
//
// Only near the party lives (§4): the camps within BUBBLE of the hero are awake, their foes standing and fighting;
// the rest are when each of their foes may stand again (`respawnAt`, a tick). A camp that wakes has every foe whose
// time has come standing at home, so the land is the same whether anyone watched it or not.
//
// The fight is the dungeon's numbers (battle.js: the foes' stats and their scaling, a blow's dodge, mitigation and
// crit, the XP a kill pays and its share) with a simpler party: basic attacks, and the cleric's mending (no abilities,
// no stances). That's the proof of concept's line; §8 says what the game's battle would add.

import { createLand, CH, G, WALK, PACE, RESPAWN, ELITE_S, RARE_S, WARDEN_S } from './land.js';
import { TOWNS, K } from './geo.js';
import { ENEMIES, fightOf } from '../battle.js';
import { makeMember, statsFor, gainXp } from '../party.js';
import { mulberry32, streamSeed, hash2 } from '../rng.js';
import { hypot, sin, cos } from '../detmath.js';

export const TICK_HZ = 20, DT = 1 / TICK_HZ;
export const SPEED = 8.8;                                       // the hero's run, tiles/s (core.js PLAYER_SPEED)
export const BUBBLE = 64, LOCK_R = 12, LEASH = 26, CALM_S = 3, RISE_S = 5, LINK_R = 7;
const XP_SHARE = [1, 1, 0.65, 0.5];                              // battle.js: a kill's XP to each living member
// the con's edge (§3): a foe two or more over the party hits harder, is harder to hit and lasts longer, a step a level
// past the first (the dungeon's room premium does this for its waves; a camp is two or three, not five, and the party
// mends between pulls, so the overland needs its own): orange one step, red two, and so on
export const GAP_ATK = 0.45, GAP_DODGE = 6, GAP_HP = 0.2;
// a camp's foe stands for more than a wave's: a camp is two or three where a wave is five at up to twice the strength
// (battle.js TIDES), and the party mends between pulls. Measured to the contract's shape (proposal §6)
export const FIELD_HP = 1.5, FIELD_ATK = 1.35;
// the cleric's Mend (skills.js: 22 % of the most hurt ally's max HP, the cleric's heals +20 %), for its 12 MP
const MEND = 0.22 * 1.2, MEND_MP = 12;
const S_FIGHT = 0xf20f;

/** a foe's con colour against the party's level (§3) @param {number} foeLv @param {number} partyLv */
export function conOf(foeLv, partyLv) { const d = foeLv - partyLv; return d <= -6 ? 'grey' : d <= -3 ? 'green' : d <= 1 ? 'gold' : d === 2 ? 'orange' : 'red'; }
/** how near a foe notices the party: 5 tiles, ½ a tile more a level over, 3 to 9 @param {number} foeLv @param {number} partyLv */
export const aggroR = (foeLv, partyLv) => Math.max(3, Math.min(9, 5 + 0.5 * (foeLv - partyLv)));

/** a foe's stats at its level: the dungeon's scaling (battle.js foe()), at the field's strength @param {string} kind @param {number} lvl @param {boolean} elite @param {boolean} warden */
export function foeStats(kind, lvl, elite, warden = false) {
  const E = /** @type {any} */ (ENEMIES)[kind] || ENEMIES.minion, scale = 1 + 0.14 * (lvl - 1), atkScale = 1 + 0.12 * (lvl - 1);
  const hp = Math.round(E.hp * scale * (elite ? 2.5 : 1) * (warden ? 1.6 : 1) * FIELD_HP);
  return { hp, maxHp: hp, atk: E.atk * atkScale * (elite ? 1.3 : 1) * FIELD_ATK, def: E.def * scale, crit: E.crit, dodge: E.dodge, interval: E.interval,
    range: Math.min(E.range, 9), speed: E.speed, xp: E.xp * (elite ? 3 : 1) * (warden ? 2 : 1), bolt: E.bolt || null };
}

/** @param {number} seed @param {number[][]} coast the wall map's coast @param {{ level?: number, town?: string }} [o] */
export function createFrontier(seed, coast, { level = 1, town = 'thornwick' } = {}) {
  seed >>>= 0;
  const land = createLand(seed, coast);
  const rng = mulberry32(streamSeed(seed, S_FIGHT));
  /** @type {Map<string, Array<(e: any) => void>>} */
  const subs = new Map();
  const bus = { on: (/** @type {string} */ ev, /** @type {(e: any) => void} */ fn) => { if (!subs.has(ev)) subs.set(ev, []); /** @type {any} */ (subs.get(ev)).push(fn); },
    emit: (/** @type {string} */ ev, /** @type {any} */ e) => { for (const fn of subs.get(ev) || []) fn(e); } };

  const state = {
    tick: 0, mode: 'explore', /** @type {{ x: number, y: number, r: number } | null} */ lock: null, want: { x: 0, y: 0 },
    /** @type {any[]} */ party: [], /** @type {Map<number, number[]>} the camps' foes' respawn ticks (0: standing) */ respawnAt: new Map(),
    seen: new Set(), kills: 0, xp: 0, wipes: 0, lockSince: 0, lockKills: 0, lockXp: 0, lastFight: 0,
  };
  /** @type {Map<number, any>} the awake camps: { camp, foes } */
  const awake = new Map();
  let nextId = 1;

  // ── the party ───────────────────────────────────────────────────────────────────────────────────────────────────────
  function makeParty(lv) {
    const hero = { ...makeMember('you', 'Aldric', 'fighter', lv), main: true };   // (each in the Common kit of their level)
    return [hero, makeMember('c1', 'Pell', 'rogue', lv), makeMember('c2', 'Maren', 'cleric', lv)].map((m, i) => {
      const st = statsFor(m), F = fightOf(m);
      return Object.assign(m, { x: 0, y: 0, fx: 0, fy: 1, hp: st.maxHp, mp: st.maxMp, st, F, cd: 0.3 * i, tgt: 0, down: false, moving: false, act: 0, actor: i === 0 ? 'hero_knight' : i === 1 ? 'hero_rogue' : 'hero_cleric' });
    });
  }
  const partyLv = () => Math.round(state.party.reduce((s, m) => s + m.level, 0) / state.party.length);
  const hero = () => state.party[0];
  const alive = (/** @type {any} */ m) => !m.down && m.hp > 0;
  function place(x, y) {
    state.party.forEach((m, i) => { m.x = x + (i === 0 ? 0 : i === 1 ? -1.6 : 1.6); m.y = y + (i === 0 ? 0 : 1.8); if (!land.walkable(m.x, m.y)) { m.x = x; m.y = y; } });
  }
  function toTown(id) {
    const t = TOWNS.find((q) => q.id === id) || TOWNS[0];
    place(t.x * K, t.y * K);
    state.lock = null; state.mode = 'explore'; state.want = { x: 0, y: 0 };
    for (const a of awake.values()) for (const f of a.foes) if (f.state === 'fight') evade(f);
    refreshBubble();
  }

  // ── the bubble: the camps near the hero awake, the rest a row of respawn ticks ─────────────────────────────────────
  function respawnTicks(camp, i) {
    const f = camp.foes[i], base = f.warden ? WARDEN_S : camp.kind === 'elite' && i === 0 ? RARE_S : f.elite ? ELITE_S : /** @type {any} */ (RESPAWN)[camp.kind] || 60;
    return Math.round(base * (0.85 + 0.3 * hash2(camp.id, i * 131 + state.tick % 7, seed ^ 0x5e5)) * TICK_HZ);
  }
  function spawnFoe(camp, i) {
    const m = camp.foes[i], a = (i / Math.max(1, camp.foes.length)) * 6.2832, ox = i ? cosT(a) * 1.6 : 0, oy = i ? sinT(a) * 1.6 : 0;
    const x = land.walkable(camp.x + ox, camp.y + oy) ? camp.x + ox : camp.x, y = land.walkable(camp.x + ox, camp.y + oy) ? camp.y + oy : camp.y;
    const st = foeStats(m.kind, m.lvl, !!m.elite, !!m.warden), g = Math.max(0, m.lvl - partyLv() - 1);
    if (g) { st.hp = st.maxHp = Math.round(st.hp * (1 + GAP_HP * g)); }
    return { id: nextId++, camp: camp.id, idx: i, kind: m.kind, lvl: m.lvl, elite: !!m.elite, warden: !!m.warden, ...st,
      x, y, hx: x, hy: y, fx: 0, fy: 1, state: 'idle', tgt: null, cd: 0.6 + rng() * 0.8, wanderT: rng() * 4, wx: x, wy: y, dead: 0, rise: 1, moving: false, act: 0, flash: 0 };
  }
  function wake(camp) {
    let at = state.respawnAt.get(camp.id);
    if (!at) { at = camp.foes.map(() => 0); state.respawnAt.set(camp.id, at); }
    const foes = [];
    camp.foes.forEach((_, i) => { if (/** @type {number[]} */ (at)[i] <= state.tick) { /** @type {number[]} */ (at)[i] = 0; foes.push(spawnFoe(camp, i)); } });   // (standing: no fade, it was there all along)
    awake.set(camp.id, { camp, foes });
  }
  function refreshBubble() {
    const H = hero(), near = new Set();
    for (let cy = Math.floor((H.y - BUBBLE) / CH); cy <= Math.floor((H.y + BUBBLE) / CH); cy++) for (let cx = Math.floor((H.x - BUBBLE) / CH); cx <= Math.floor((H.x + BUBBLE) / CH); cx++) {
      if (cx < 0 || cy < 0 || cx >= land.CW || cy >= land.CHN) continue;
      for (const k of land.chunk(cx, cy).camps) if (hypot(k.x - H.x, k.y - H.y) <= BUBBLE) { near.add(k.id); if (!awake.has(k.id)) wake(k); }
    }
    for (const id of [...awake.keys()]) if (!near.has(id)) awake.delete(id);   // (its standing foes simply stand at home again)
  }

  // ── moving ──────────────────────────────────────────────────────────────────────────────────────────────────────────
  const pace = (x, y) => PACE[land.ground(x, y)];
  /** a step toward (dx, dy), sliding along what's solid @param {any} u */
  function step(u, dx, dy) {
    const nx = u.x + dx, ny = u.y + dy;
    if (land.walkable(nx, ny)) { u.x = nx; u.y = ny; return true; }
    if (land.walkable(nx, u.y)) { u.x = nx; return true; }
    if (land.walkable(u.x, ny)) { u.y = ny; return true; }
    return false;
  }
  /** toward a point at a speed (tiles/s), stopping `stop` short; faces the way it goes @param {any} u */
  function moveTo(u, tx, ty, speed, stop = 0) {
    const dx = tx - u.x, dy = ty - u.y, d = hypot(dx, dy);
    if (d <= stop + 0.05) { u.moving = false; return true; }
    const s = Math.min(d - stop, speed * pace(u.x, u.y) * DT);
    u.fx = dx / d; u.fy = dy / d; u.moving = step(u, (dx / d) * s, (dy / d) * s);
    return false;
  }

  // ── fighting ────────────────────────────────────────────────────────────────────────────────────────────────────────
  /** a blow, as battle.js resolve(): dodge, then def / (def + 25 + 5L) off the ATK, crits × 1.75 */
  function resolve(att, def, lvl) {
    if (rng() * 100 < Math.min(50, def.dodge)) return { miss: true, dmg: 0, crit: false };
    const mit = def.def / (def.def + 25 + 5 * lvl);
    let dmg = Math.max(1, att.atk * (1 - mit));
    const crit = rng() * 100 < Math.min(60, att.crit);
    if (crit) dmg *= 1.75;
    return { miss: false, dmg: Math.round(dmg), crit };
  }
  function evade(f) { f.state = 'evade'; f.tgt = null; bus.emit('evade', { id: f.id, x: f.x, y: f.y }); }
  // a camp fights as one; and a camp within LINK_R of one that's fighting joins it (linked camps: pull one, and its
  // neighbours come too, the overland's real danger)
  function pull(campId, tgt, link = true) {
    const a = awake.get(campId); if (!a) return;
    let woke = false;
    for (const f of a.foes) if (!f.dead && f.state === 'idle' && f.rise >= 1) { f.state = 'fight'; f.tgt = tgt; woke = true; }
    if (!woke) return;
    bus.emit('aggro', { camp: campId, x: a.camp.x, y: a.camp.y });
    if (link) for (const b of awake.values()) if (b !== a && hypot(b.camp.x - a.camp.x, b.camp.y - a.camp.y) <= LINK_R && conOf(b.camp.lv, partyLv()) !== 'grey') pull(b.camp.id, tgt, false);
  }
  const gap = (f) => Math.max(0, f.lvl - partyLv() - 1);
  function strikeFoe(m, f) {
    if (f.dead) return;                                                    // (two blows in one tick: the second finds it fallen)
    const g = gap(f), r = resolve(m.st, g ? { ...f, dodge: f.dodge + GAP_DODGE * g } : f, m.level); m.act = 0.35; m.fx = f.x - m.x; m.fy = f.y - m.y;
    if (f.state === 'idle') pull(f.camp, m);
    if (r.miss) { bus.emit('miss', { x: f.x, y: f.y, party: false }); return; }
    f.hp = Math.max(0, f.hp - r.dmg); f.flash = 0.12;
    bus.emit('hit', { x: f.x, y: f.y, ax: m.x, ay: m.y, amount: r.dmg, crit: r.crit, party: false, ranged: m.F.range > 4, by: m.cls });
    if (f.hp <= 0) kill(f);
  }
  function kill(f) {
    f.dead = 1.2; f.state = 'dead';
    const a = awake.get(f.camp), at = state.respawnAt.get(f.camp);
    if (a && at) at[f.idx] = state.tick + respawnTicks(a.camp, f.idx);
    const lv = partyLv(), grey = conOf(f.lvl, lv) === 'grey', live = state.party.filter(alive);
    const xp = grey ? 0 : Math.round(f.xp * f.lvl * XP_SHARE[Math.min(3, live.length)]);
    for (const m of live) if (xp) gainXp(m, xp, () => { m.st = statsFor(m); bus.emit('level', { name: m.name, level: m.level }); });
    state.kills++; state.xp += xp * live.length;
    if (state.lock) { state.lockKills++; state.lockXp += xp; }
    bus.emit('kill', { id: f.id, x: f.x, y: f.y, kind: f.kind, lvl: f.lvl, elite: f.elite, xp, camp: f.camp });
  }
  function strikeParty(f, m) {
    const g = gap(f), r = resolve(g ? { ...f, atk: f.atk * (1 + GAP_ATK * g) } : f, m.st, f.lvl); f.act = 0.35; f.fx = m.x - f.x; f.fy = m.y - f.y;
    if (r.miss) { bus.emit('miss', { x: m.x, y: m.y, party: true }); return; }
    m.hp = Math.max(0, m.hp - r.dmg); m.flash = 0.12;
    bus.emit('hit', { x: m.x, y: m.y, ax: f.x, ay: f.y, amount: r.dmg, crit: r.crit, party: true, ranged: f.range > 4, by: f.kind });
    if (m.hp <= 0) { m.down = true; m.downAt = state.tick; bus.emit('down', { name: m.name, x: m.x, y: m.y }); }
  }
  const foesAwake = () => { const out = []; for (const a of awake.values()) for (const f of a.foes) if (!f.dead) out.push(f); return out; };

  /** what a member goes for: in a lock, a foe in the ring (or one at the party); exploring, only what's in reach */
  function targetFor(m, foes, locked) {
    const L = state.lock;
    const ok = (f) => !f.dead && f.state !== 'evade' && f.rise >= 1 && (!locked || !L ? true : hypot(f.x - L.x, f.y - L.y) <= L.r + 2 || (f.state === 'fight' && hypot(f.x - L.x, f.y - L.y) <= L.r + 9));
    let best = null, bd = Infinity;
    for (const f of foes) {
      if (!ok(f)) continue;
      const d = hypot(f.x - m.x, f.y - m.y);
      if (!locked && d > m.F.range + 0.5) continue;
      if (!locked && conOf(f.lvl, partyLv()) === 'grey' && f.state !== 'fight') continue;   // exploring: no picking on the grey
      const score = m.cls === 'rogue' && locked ? f.hp + d * 4 : d;                             // the rogue goes for the weakest near
      if (score < bd) { bd = score; best = f; }
    }
    return best;
  }
  function partyStep(foes) {
    const H = hero(), L = state.lock, locked = state.mode === 'lock' && !!L;
    // the hero: the stick, or the lock's AI
    if (!locked && alive(H)) {
      const v = state.want, mag = hypot(v.x, v.y);
      if (mag > 0.05) { const s = SPEED * Math.min(1, mag) * pace(H.x, H.y) * DT; H.fx = v.x / mag; H.fy = v.y / mag; H.moving = step(H, (v.x / mag) * s, (v.y / mag) * s); } else H.moving = false;
    }
    state.party.forEach((m, i) => {
      m.flash = Math.max(0, (m.flash || 0) - DT);
      if (!alive(m)) { m.moving = false; return; }
      m.cd -= DT; m.act = Math.max(0, m.act - DT);
      // the cleric mends whoever's lowest under 65 %, before anything else
      if (m.cls === 'cleric') {
        const low = state.party.filter((q) => alive(q) && q.hp < q.st.maxHp * 0.65).sort((a, b) => a.hp / a.st.maxHp - b.hp / b.st.maxHp)[0];
        if (low && m.mp >= MEND_MP && hypot(low.x - m.x, low.y - m.y) < 9) {
          if (m.cd <= 0) { const amt = Math.round(low.st.maxHp * MEND); low.hp = Math.min(low.st.maxHp, low.hp + amt); m.mp -= MEND_MP; m.cd = m.F.interval; m.act = 0.4; bus.emit('heal', { x: low.x, y: low.y, amount: amt, ax: m.x, ay: m.y }); }
          if (locked) { m.moving = false; return; }
        }
      }
      const f = targetFor(m, foes, locked);
      if (locked) {
        if (f) {
          const d = hypot(f.x - m.x, f.y - m.y), reach = m.F.range;
          if (d > reach) moveTo(m, f.x, f.y, m.F.speed * 1.2, reach * 0.85); else m.moving = false;
          const lx = m.x - L.x, ly = m.y - L.y, ld = hypot(lx, ly), cap = L.r + (f.state === 'fight' ? 4 : 1);
          if (ld > cap) { m.x = L.x + lx / ld * cap; m.y = L.y + ly / ld * cap; }   // never out of the ring (and only a little, after one at us)
          if (d <= reach + 0.3 && m.cd <= 0) { strikeFoe(m, f); m.cd = m.F.interval; }
        } else {
          const ox = i === 0 ? 0 : i === 1 ? -1.6 : 1.6, oy = i === 0 ? 0 : 1.6;
          moveTo(m, L.x + ox, L.y + oy, m.F.speed, 0.4);
        }
        return;
      }
      // exploring: the hero runs where the stick says; the others keep their places behind, and catch up if lost
      if (i > 0) {
        const fx = H.fx || 0, fy = H.fy || 1, back = 2.2, side = i === 1 ? -1.6 : 1.6;
        const tx = H.x - fx * back - fy * side, ty = H.y - fy * back + fx * side;
        if (hypot(tx - m.x, ty - m.y) > 30) { m.x = H.x; m.y = H.y; }
        else moveTo(m, tx, ty, SPEED * 1.15, 0.3);
      }
      if (f && m.cd <= 0) { strikeFoe(m, f); m.cd = m.F.interval; }      // and strike whatever's in reach, without stopping
    });
  }
  function foeStep(foes) {
    const lv = partyLv(), live = state.party.filter(alive);
    for (const f of foes) {
      if (f.dead) continue;
      f.cd -= DT; f.act = Math.max(0, f.act - DT); f.flash = Math.max(0, f.flash - DT);
      if (f.rise < 1) { f.rise = Math.min(1, f.rise + DT); continue; }   // standing back up at home
      const home = hypot(f.x - f.hx, f.y - f.hy);
      if (f.state === 'evade') {                                         // home, mending, untouchable
        f.hp = Math.min(f.maxHp, f.hp + f.maxHp * 0.25 * DT);
        if (moveTo(f, f.hx, f.hy, f.speed * 1.5, 0.3)) { f.state = 'idle'; f.hp = f.maxHp; }
        continue;
      }
      if (f.state === 'idle') {
        if (conOf(f.lvl, lv) !== 'grey') for (const m of live) if (hypot(m.x - f.x, m.y - f.y) < aggroR(f.lvl, lv)) { pull(f.camp, m); break; }
        if (f.state === 'idle') {                                          // a few steps about its camp
          f.wanderT -= DT;
          if (f.wanderT <= 0) { f.wanderT = 3 + rng() * 4; const a = rng() * 6.2832, r = rng() * 2.5; f.wx = f.hx + cosT(a) * r; f.wy = f.hy + sinT(a) * r; }
          moveTo(f, f.wx, f.wy, f.speed * 0.4, 0.2);
          continue;
        }
      }
      // fighting: the nearest of the party standing; too far from home, it goes back
      if (home > LEASH || !live.length) { evade(f); continue; }
      let t = f.tgt && alive(f.tgt) ? f.tgt : null, td = t ? hypot(t.x - f.x, t.y - f.y) : Infinity;
      for (const m of live) { const d = hypot(m.x - f.x, m.y - f.y); if (d < td - 1.5) { t = m; td = d; } }
      f.tgt = t;
      if (!t) continue;
      if (td > f.range) moveTo(f, t.x, t.y, f.speed, f.range * 0.85); else { f.moving = false; f.fx = t.x - f.x; f.fy = t.y - f.y; }
      if (td <= f.range + 0.3 && f.cd <= 0) { strikeParty(f, t); f.cd = f.interval; }
    }
  }
  function upkeep(foes) {
    // the fallen fade, and their camp keeps the time
    for (const a of awake.values()) {
      a.foes = a.foes.filter((f) => !(f.dead && (f.dead -= DT) <= 0));
      const at = state.respawnAt.get(a.camp.id);
      if (at) at.forEach((t, i) => { if (t && state.tick >= t && !a.foes.some((f) => f.idx === i)) { at[i] = 0; const f = spawnFoe(a.camp, i); f.rise = 0; a.foes.push(f); bus.emit('respawn', { x: f.x, y: f.y, kind: f.kind, camp: a.camp.id }); } });
    }
    const fighting = foes.some((f) => f.state === 'fight');
    if (fighting) state.lastFight = state.tick;
    const calm = (state.tick - state.lastFight) * DT;
    for (const m of state.party) {
      if (m.down) { if (calm >= RISE_S) { m.down = false; m.hp = Math.round(m.st.maxHp * 0.25); bus.emit('rise', { name: m.name, x: m.x, y: m.y }); } continue; }
      const rate = calm >= CALM_S ? m.st.maxHp * 0.05 : m.st.hpr;
      m.hp = Math.min(m.st.maxHp, m.hp + rate * DT);
      m.mp = Math.min(m.st.maxMp, m.mp + (calm >= CALM_S ? m.st.maxMp * 0.05 : m.st.mpr) * DT);
    }
    if (!state.party.some(alive)) {                                       // a wipe: the nearest town's square, at 30 %
      state.wipes++;
      const H = hero(); let best = TOWNS[0], bd = Infinity;
      for (const t of TOWNS) { const d = hypot(t.x * K - H.x, t.y * K - H.y); if (d < bd) { bd = d; best = t; } }
      bus.emit('wipe', { town: best.id, name: best.name });
      for (const m of state.party) { m.down = false; m.hp = Math.round(m.st.maxHp * 0.3); }
      if (state.lock) bus.emit('unlock', {});
      toTown(best.id);
    }
    // what's been seen: the chunks round the hero
    const H = hero();
    for (let cy = Math.floor((H.y - 40) / CH); cy <= Math.floor((H.y + 40) / CH); cy++) for (let cx = Math.floor((H.x - 40) / CH); cx <= Math.floor((H.x + 40) / CH); cx++) state.seen.add(cy * land.CW + cx);
  }

  // ── commands ────────────────────────────────────────────────────────────────────────────────────────────────────────
  /** @type {any[]} */
  const commands = [];
  const num = (v) => typeof v === 'number' && Number.isFinite(v);
  function apply(c) {
    if (!c || typeof c !== 'object') return;
    if (c.type === 'stick') {
      if (!num(c.x) || !num(c.y) || hypot(c.x, c.y) > 1.01) return;
      state.want = { x: c.x, y: c.y };
      if (state.mode === 'lock') { state.mode = 'explore'; state.lock = null; bus.emit('unlock', {}); }
    } else if (c.type === 'release') {
      state.want = { x: 0, y: 0 };
      const H = hero();
      if (state.mode === 'explore' && alive(H) && land.walkable(H.x, H.y)) {
        state.mode = 'lock'; state.lock = { x: H.x, y: H.y, r: LOCK_R }; state.lockSince = state.tick; state.lockKills = 0; state.lockXp = 0;
        bus.emit('lock', { ...state.lock });
      }
    } else if (c.type === 'jump') {
      if (typeof c.town === 'string' && TOWNS.some((t) => t.id === c.town)) toTown(c.town);
    } else if (c.type === 'level') {
      if (!Number.isInteger(c.n) || c.n < 1 || c.n > 75) return;
      const H = hero(), at = state.party.map((m) => ({ x: m.x, y: m.y })), p = makeParty(c.n);
      p.forEach((m, i) => { m.x = at[i].x; m.y = at[i].y; });
      state.party = p; bus.emit('level', { name: H.name, level: c.n });
    }
  }

  function tick() {
    state.tick++;
    while (commands.length) apply(commands.shift());
    if (state.tick % 10 === 1) refreshBubble();
    const foes = foesAwake();
    partyStep(foes);
    foeStep(foes);
    upkeep(foes);
  }

  // ── reads, for the view and the tests ───────────────────────────────────────────────────────────────────────────────
  /** what the ring holds: its camps, their levels, the next to stand again, and what it's paid */
  function lockInfo() {
    const L = state.lock; if (!L) return null;
    const camps = [...awake.values()].filter((a) => hypot(a.camp.x - L.x, a.camp.y - L.y) <= L.r + 2);
    let next = Infinity, lo = Infinity, hi = 0, standing = 0;
    for (const a of camps) {
      for (const f of a.camp.foes) { lo = Math.min(lo, f.lvl); hi = Math.max(hi, f.lvl); }
      standing += a.foes.filter((f) => !f.dead).length;
      const at = state.respawnAt.get(a.camp.id); if (at) for (const t of at) if (t) next = Math.min(next, t);
    }
    const mins = Math.max(1 / 60, (state.tick - state.lockSince) * DT / 60);
    return { camps: camps.length, lo: camps.length ? lo : 0, hi, standing, next: next < Infinity ? Math.max(0, (next - state.tick) * DT) : null,
      kills: state.lockKills, xpMin: Math.round(state.lockXp / mins), mins };
  }
  /** a spot's region, level and nearest camp (a tap on the map) */
  function inspect(x, y) {
    const R = land.regionAt(x, y); if (!R) return null;
    const g = land.groundAt(x, y);
    return { region: R.name, band: R.band, ground: g, level: land.levelAt(x, y, g), walk: WALK[g] };
  }

  state.party = makeParty(Math.max(1, Math.min(75, Math.round(level))));
  toTown(town);

  return { land, state, bus, commands, tick, awake, foes: foesAwake, partyLv, lockInfo, inspect, conOf, TOWNS };
}

const sinT = sin, cosT = cos;
export { G };
