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
//
// Abilities (skills.js): on its turn a member casts the first ability in its priority order
// that is unlocked, on auto-cast, affordable and worth it under its stance — a guard, heal,
// ward or nova first, else a strike in place of the basic attack. Stances also move the AI:
// Defensive keeps companions near the leader and half the MP in reserve for guards and
// heals; Aggressive lets them chase anything and heals late.
//
// Death (GDD §3.6): 0 HP is Downed; the Downed rise in the lull when the wave is cleared.
// Downed a second time in one room visit, or still Downed when the party walks out, a
// companion is Fallen: a ghost that follows, doesn't fight and earns nothing until a temple
// or a shrine raises it (heroes.js, core.js). The main character is never Fallen. If nobody stands, it's a wipe: the party wakes at the town temple at 30 % HP,
// Fallen cleared, a quarter of the gold gone, and everyone Weakened for 10 minutes.

import { mulberry32, streamSeed } from './rng.js';
import { statsFor, gainXp } from './party.js';
import { abilityMods } from './items.js';
import { priorityOf, unlocked, autocastOn, rankOf, rankPower, rankCost, stanceOf, hasPassive } from './skills.js';
import { WEAK_S } from './heroes.js';
import { hypot, sin, cos, exp } from './detmath.js';

// class combat traits (stats are in party.js / the GDD tables; abilities in skills.js)
const CLASS_FIGHT = {
  fighter: { interval: 1.3, range: 3.0, speed: 6.8 },
  rogue:   { interval: 0.9, range: 2.8, speed: 7.5 },
  mage:    { interval: 1.6, range: 7.0,  speed: 6.4, bolt: 'fire', keepAway: 3.2 },
};
// stance: the HP fraction under which heals / guards go up, and whether MP is held back for them
const STANCE_AI = { aggressive: { low: 0.3, reserve: 0 }, balanced: { low: 0.5, reserve: 0 }, defensive: { low: 0.65, reserve: 0.5 } };
const BENCH_XP = 0.5, WIPE_HP = 0.3, DEF_LEASH = 5;
// a room holds for as long as you stay, so "downed twice in one visit" is measured over a
// stretch: stand through WIND waves in a row and a member's downs are forgotten
const WIND = 1;
// foes of a full party (three standing) have this much more HP: with the hero moving at its real
// battle speed (it had been stuck at 2 tiles/s) parties cleared same-level waves for ~17 % HP.
// Tougher, not harder-hitting: harder hits turned into burst downs and Fallen companions.
const FULL_PARTY_HP = 1.25;
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
export const WINDUP = 0.18, WINDUP_HEAVY = 0.38, DEATH_T = 1.1;
// Swings: light attacks alternate two baked clips (A / B); abilities (Cleave, Backstab,
// Firebolt) and every elite blow are HEAVY — a bigger clip whose impact frame comes later,
// so the blow lands WINDUP_HEAVY into it. atkKind tells the renderer which clip to play.
const MAX_SHOVE = 0.3;   // tiles per tick a personal-space push may move a unit
const SEP_XB = 32, SEP_YB = 16, SEP_X = SEP_XB, SEP_Y = SEP_YB;   // personal space on screen (px): a 56 px figure with shield and blade spans ~32 px
// Melee stations around a target, as SCREEN directions (x right, y down): a 56 px figure is
// far taller than a tile is deep, so fighters stacked along the screen's vertical overlap
// badly while side-by-side ones don't. Attackers take the left/right stations first, then
// the four diagonals; a second ring waits further out when all six are held.
const STATIONS = [[1, 0], [-1, 0], [0.8, 0.6], [-0.8, 0.6], [0.8, -0.6], [-0.8, -0.6]].map(([a, b]) => {
  const wx = (a / 8 + b / 4) / 2, wy = (b / 4 - a / 8) / 2, l = hypot(wx, wy); return [wx / l, wy / l];   // screen → world unit vector
});
// The lull is 4 s, stretched (up to 15 s) while the party is under half HP, so a bad wave
// is followed by a breather. Companions who fell during a wave get back up at 25 % HP
// when it's cleared.
const LULL_MAX = 15, LULL_READY = 0.5, LULL_EACH = 0.6, REVIVE = 0.25;   // LULL_EACH: nobody walks into a wave nearly dead

export function createBattle({ state, bus, getWorld, seed, isWalkable, onDefeat, onDrop = () => {}, moveHero }) {
  let rng = mulberry32(streamSeed(seed, 0xb477));
  let battle = null, nextId = 1, focusId = 0, pending = [];   // pending: blows and releases waiting on their wind-up

  // a room tile keeps its room id even where a corridor was carved through it
  const roomAt = (w, x, y) => { const c = w.level && w.level.cells.get(Math.floor(x) + ',' + Math.floor(y)); return c && c.kind === 'floor' && c.room >= 0 ? c.room : -1; };
  const hero = () => state.party[0];
  const alive = (u) => u && !u.down && !u.fallen && u.hp > 0;
  const partyHp = () => { const q = state.party.filter((m) => !m.fallen); return q.reduce((a, m) => a + (m.down ? 0 : m.hp), 0) / Math.max(1, q.reduce((a, m) => a + statsFor(m).maxHp, 0)); };
  // stats in the fight: statsFor plus the guards up right now (Shield Wall, Smoke Step)
  const combatStats = (m) => { const s = statsFor(m), b = m.buff; if (b) { if (b.wall > 0) s.def = s.def * (1 + b.wallK); if (b.smoke > 0) s.dodge += b.smokeK; } return s; };

  // runtime fields on party members (positions for companions; the hero is the player)
  function ensureRuntime() {
    const p = state.player;
    state.party.forEach((m, i) => {
      if (m.mp === undefined) m.mp = statsFor(m).maxMp;
      if (i === 0) { m.x = p.x; m.y = p.y; }
      // catch up after a jump (travel, stairs, a load) — never mid-fight: a companion chasing
      // across a big room popped back to the hero in one tick (~14 tiles)
      else if (m.x === undefined || (!battle && hypot(m.x - p.x, m.y - p.y) > 14)) { m.x = p.x - 0.8 * i; m.y = p.y + 0.8; }
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
    const tough = party >= 3 ? FULL_PARTY_HP : 1;        // a full party of three fights as one: its foes take longer to fall
    const ranged = lvl >= 2 ? Math.floor(n / 3) : 0;
    const kinds = Array.from({ length: n }, (_, i) => i < ranged ? (rng() < 0.5 ? 'rogue' : 'mage') : rng() < 0.55 ? 'minion' : 'warrior');
    const cells = b.cells, p = state.player, g = b.grid, reach = field(p.x, p.y);
    const reachable = (c) => reach[(c[1] - g.y0) * g.gw + (c[0] - g.x0)] < 65535;       // never behind a pool or pillar ring
    for (let i = 0; i < n; i++) {
      const kind = kinds[i], E = ENEMIES[kind];
      let x = 0, y = 0;
      for (let t = 0; t < 60; t++) { const c = cells[(rng() * cells.length) | 0]; x = c[0] + 0.5; y = c[1] + 0.5; if (hypot(x - p.x, y - p.y) > 9 && reachable(c)) break; }
      const elite = eliteWave && i === n - 1;
      const hp = Math.round(E.hp * scale * tough * (elite ? 2.5 : 1));
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
    for (const m of state.party) { m.downs = 0; m.stood = 0; m.buff = null; m.ward = 0; }   // a new room visit
    battle = { room, level: (w.roomLevels && w.roomLevels.get(room)) || 1 + (w.depth || 0), wave: 0, lull: 1.2, cells, grid: { x0, y0, gw, gh, walk }, fields: new Map() };
    w.enemies = []; w.projectiles = [];
    rng = mulberry32(streamSeed(seed ^ (room * 7919 + (w.depth || 0) * 104729), 0xb477));
    bus.emit('battle', { on: true, room, level: battle.level });
  }
  function endBattle(w, why) {
    battle = null; focusId = 0; pending = [];
    if (w) { w.enemies = []; w.projectiles = []; }
    downedOut(why === 'left');
    bus.emit('battle', { on: false, why });
    bus.emit('partyChanged', state.party);
  }
  // the fight is over with members still Downed: walked out on, a companion is Fallen (the
  // main character gets up); otherwise they rise at 20 %
  function downedOut(leftThem) {
    for (const m of state.party) {
      m.buff = null; m.ward = 0;
      if (!m.down) continue;
      if (leftThem && !m.main) fall(m);
      else { m.down = false; m.hp = Math.max(1, Math.round(statsFor(m).maxHp * 0.2)); }
    }
  }
  function fall(m) {
    m.down = false; m.fallen = true; m.hp = 0; m.buff = null; m.ward = 0; m.moving = false;
    bus.emit('combat', { t: 'fallen', x: m.x, y: m.y, name: m.name });
    bus.emit('fallen', { id: m.id, name: m.name });
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
  function applyHit(att, tgt, r, isParty, w, heavy = false) {
    if (r.miss) { bus.emit('combat', { t: 'miss', x: tgt.x, y: tgt.y, party: isParty }); return; }
    let dmg = r.dmg;
    if (isParty && tgt.ward > 0) { const a = Math.min(tgt.ward, dmg); tgt.ward -= a; dmg -= a; if (!dmg) { bus.emit('combat', { t: 'warded', x: tgt.x, y: tgt.y }); return; } }   // Arcane Ward soaks it first
    tgt.hp = Math.max(0, tgt.hp - dmg); tgt.flash = 0.12; tgt.hitN = (tgt.hitN || 0) + 1;
    const by = att.src || att;                                  // the striker (party stats are a copy): where the blow came from, who struck it — hit sparks
    bus.emit('combat', { t: 'hit', x: tgt.x, y: tgt.y, amount: dmg, crit: r.crit, party: isParty, ax: by.x, ay: by.y, src: by.actor || by.cls || by.kind, heavy });
    if (tgt.hp > 0) return;
    if (isParty) {
      tgt.down = true; tgt.downs = (tgt.downs || 0) + 1; tgt.stood = 0; tgt.buff = null; tgt.ward = 0;
      bus.emit('combat', { t: 'down', x: tgt.x, y: tgt.y, name: tgt.name });
      if (tgt.downs >= 2 && !tgt.main) fall(tgt);               // twice in one room visit (the main character stays Downed)
      if (!state.party.some(alive)) defeat(w);
    }
    else { tgt.dead = DEATH_T; reward(tgt); if (focusId === tgt.id) focusId = 0; }
  }
  function reward(e) {
    const living = state.party.filter(alive);
    const xp = Math.round(e.xp * e.lvl), share = Math.max(1, Math.round(xp / Math.max(1, living.length)));
    const lv = (m) => bus.emit('levelUp', { id: m.id, name: m.name, level: m.level });
    for (const m of living) gainXp(m, share, lv);
    for (const m of state.bench || []) gainXp(m, Math.round(share * BENCH_XP), lv);   // the bench earns half
    state.counters.gold = (state.counters.gold || 0) + Math.round(e.gold * e.lvl);
    bus.emit('countersChanged', { ...state.counters });
    bus.emit('combat', { t: 'xp', x: e.x, y: e.y, amount: share });
    if (e.elite) onDrop('elite', e.lvl, e.x, e.y);           // elites often carry gear
  }
  // a wipe: wake at the temple — 30 % HP, Fallen cleared, Weakened, a quarter of the gold gone
  function defeat(w) {
    const lost = Math.floor((state.counters.gold || 0) * 0.25);
    state.counters.gold = (state.counters.gold || 0) - lost;
    endBattle(w, 'defeat');
    for (const m of state.party) {
      m.down = false; m.fallen = false; m.weakUntil = state.t + WEAK_S;
      const s = statsFor(m); m.hp = Math.max(1, Math.round(s.maxHp * WIPE_HP)); m.mp = Math.min(m.mp ?? s.maxMp, s.maxMp);
    }
    bus.emit('defeat', { lost });
    bus.emit('weakened', { on: true, until: state.t + WEAK_S });
    onDefeat();
  }
  // ── abilities ───────────────────────────────────────────────────────────────
  // an ability's cast: its rank, the Rare gear on the caster and Focus set cost and strength
  function cast(m, A) {
    const r = rankOf(m, A.id), am = abilityMods(m, A.name);
    return { A, cost: Math.max(0, rankCost(A, r) - am.cost), mult: rankPower(r) * (1 + am.power) * (1 + (statsFor(m).power || 0)) };
  }
  // MP a member holds back for its guards, heals, wards and novas (only if it has any):
  // Aggressive nothing; Balanced strikes freely until someone is badly hurt, then keeps enough
  // for the cheapest; Defensive always keeps half the pool
  function reserve(m, s) {
    const stance = stanceOf(m); if (stance === 'aggressive') return 0;
    let low = 1e9; for (const A of priorityOf(m)) if (A.kind !== 'strike' && unlocked(m, A) && autocastOn(m, A.id)) low = Math.min(low, cast(m, A).cost);
    if (low === 1e9) return 0;
    if (stance === 'balanced') return state.party.some((q) => alive(q) && q.hp < statsFor(q).maxHp * STANCE_AI.balanced.low) ? low : 0;
    return Math.max(low, s.maxMp * STANCE_AI[stance].reserve);
  }
  // the strike to swing with (paid for here), or null for a basic attack
  function pickStrike(m, tgt) {
    const s = statsFor(m), keep = reserve(m, s);
    for (const A of priorityOf(m)) {
      if (A.kind !== 'strike' || !unlocked(m, A) || !autocastOn(m, A.id)) continue;
      if (A.poison && tgt.poison && tgt.poison.t > 1) continue;                    // Venom: already poisoned
      const c = cast(m, A); if (m.mp < c.cost + keep) continue;
      m.mp -= c.cost; return c;
    }
    return null;
  }
  // a guard, heal, ward or nova worth casting now (it takes the member's turn)
  function tryUtility(m, i, foes, w, F) {
    const s = statsFor(m), ai = STANCE_AI[stanceOf(m)], hpf = m.hp / s.maxHp;
    for (const A of priorityOf(m)) {
      if (A.kind === 'strike' || !unlocked(m, A) || !autocastOn(m, A.id)) continue;
      const c = cast(m, A); if (m.mp < c.cost) continue;
      let target = m;
      if (A.kind === 'guard') {
        const b = m.buff || {}; if ((A.taunt ? b.wall : b.smoke) > 0) continue;
        const near = foes.filter((e) => hypot(e.x - m.x, e.y - m.y) < 3.2).length;
        const guards = A.taunt && state.party.some((q) => q !== m && alive(q));        // taunting only helps with someone to shield
        if (!(hpf < ai.low || (guards && near >= (stanceOf(m) === 'aggressive' ? 3 : 2)))) continue;
      } else if (A.kind === 'heal') { if (hpf >= ai.low) continue; }
      else if (A.kind === 'ward') {
        target = null; let lo = ai.low + 0.1;
        for (const q of state.party) if (alive(q) && !(q.ward > 0)) { const f = q.hp / statsFor(q).maxHp; if (f < lo) { lo = f; target = q; } }
        if (!target) continue;
      } else if (A.kind === 'nova') { if (foes.filter((e) => hypot(e.x - m.x, e.y - m.y) < A.radius).length < 2) continue; }
      m.mp -= c.cost; m.act = 0.55; m.cd = F.interval; m.atkN = (m.atkN || 0) + 1; m.atkKind = 'heavy'; m.moving = false;
      bus.emit('combat', { t: 'ability', x: m.x, y: m.y, name: A.name });
      const tg = target;
      pending.push({ t: WINDUP_HEAVY, fn: () => { if (alive(m)) utility(m, c, tg, w); } });
      return true;
    }
    return false;
  }
  function utility(m, { A, mult }, tgt, w) {
    if (A.kind === 'guard') {
      const b = m.buff || (m.buff = {});
      if (A.taunt) { b.wall = A.dur; b.wallK = A.def * mult; } else { b.smoke = A.dur; b.smokeK = A.dodge * mult; }
      bus.emit('combat', { t: 'guard', x: m.x, y: m.y, name: A.name });
    } else if (A.kind === 'heal') {
      const s = statsFor(m), n = Math.round(s.maxHp * A.heal * mult); m.hp = Math.min(s.maxHp, m.hp + n);
      bus.emit('combat', { t: 'heal', x: m.x, y: m.y, amount: n });
    } else if (A.kind === 'ward') {
      if (!alive(tgt)) return;
      tgt.ward = Math.round(statsFor(tgt).maxHp * A.ward * mult);
      bus.emit('combat', { t: 'ward', x: tgt.x, y: tgt.y, amount: tgt.ward });
    } else if (A.kind === 'nova') {
      const aS = { ...statsFor(m), lvl: m.level, src: m };
      for (const o of w.enemies) if (!o.dead && o.hp > 0 && !(o.spawn > 0) && hypot(o.x - m.x, o.y - m.y) < A.radius) { applyHit(aS, o, resolve(aS, o, A.power * mult), false, w, true); o.slow = A.slow; }
      bus.emit('combat', { t: 'heavy', x: m.x, y: m.y, party: false });
    }
  }
  function attack(att, tgt, isPartyAtt, w, fight, c = null) {
    let power = 1, bonus = 0;
    const ab = c ? c.A : null;
    if (c) { power = ab.power * c.mult; bonus = ab.crit || 0; }
    const heavy = !!ab || (!isPartyAtt && att.elite);
    att.act = heavy ? 0.55 : 0.35; att.cd = fight.interval; att.atkN = (att.atkN || 0) + 1;   // atkN: the renderer starts the attack clip
    att.atkKind = heavy ? 'heavy' : att.atkN % 2 ? 'a' : 'b';
    const aStats = isPartyAtt ? { ...statsFor(att), lvl: att.level, src: att } : att;
    const hit = () => {
      if (!(isPartyAtt ? tgt.hp > 0 && !tgt.dead : alive(tgt))) return;
      const r = resolve(aStats, isPartyAtt ? tgt : combatStats(tgt), power, bonus);   // the defender's guards count when the blow lands
      applyHit(aStats, tgt, r, !isPartyAtt, w, heavy);
      if (r.crit && isPartyAtt && att.cls === 'rogue' && hasPassive(att)) att.mp = Math.min(statsFor(att).maxMp, att.mp + 5);   // Opportunist
      if (heavy) bus.emit('combat', { t: 'heavy', x: tgt.x, y: tgt.y, party: !isPartyAtt });   // the renderer's impact (shake + flash)
      if (ab && ab.splash) for (const o of w.enemies) if (o !== tgt && !o.dead && o.hp > 0 && hypot(o.x - tgt.x, o.y - tgt.y) < 1.8) applyHit(aStats, o, resolve(aStats, o, ab.splash * c.mult), false, w);
      if (ab && ab.poison && tgt.hp > 0) tgt.poison = { t: ab.pdur, dps: aStats.atk * ab.poison * c.mult, acc: 0, by: att };
    };
    if (ab) bus.emit('combat', { t: 'ability', x: att.x, y: att.y, name: ab.name });
    const bolt = isPartyAtt ? fight.bolt : att.bolt;
    const standing = () => (isPartyAtt ? !att.down : att.hp > 0 && !att.dead);
    pending.push({ t: heavy ? WINDUP_HEAVY : WINDUP, fn: () => {
      if (!standing()) return;                               // cut down mid-swing
      if (bolt) { const d = hypot(tgt.x - att.x, tgt.y - att.y); w.projectiles.push({ x: att.x, y: att.y, px: att.x, py: att.y, sx: att.x, sy: att.y, tgt, t: 0, dur: d / BOLT_SPEED, kind: ab ? 'fire' : bolt, hit }); }
      else hit();
    } });
  }

  // ── movement ────────────────────────────────────────────────────────────────
  // Units ease into and out of their stride (critic pass 3: instant starts and stops): the
  // speed along the step ramps at STEP_ACC; a unit that hasn't stepped for a couple of ticks
  // starts again from rest.
  const STEP_ACC = 40;
  let stepN = 0;
  function stepToward(u, tx, ty, speed, dt, w, room) {
    const dx = tx - u.x, dy = ty - u.y, d = hypot(dx, dy); if (d < 0.05) { u.moving = false; u.spd = 0; return; }
    if ((u.stepAt ?? -9) < stepN - 2) u.spd = 0;
    u.stepAt = stepN; u.spd = Math.min(speed, (u.spd || 0) + STEP_ACC * dt);
    const s = Math.min(d, u.spd * dt), nx = u.x + (dx / d) * s, ny = u.y + (dy / d) * s;
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
    const d = hypot(bx - ax, by - ay), n = Math.ceil(d / 0.4);
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
  function separate(units, w, SEP_X = SEP_XB, SEP_Y = SEP_YB, stiff = 1) {   // stiff < 1: a gentle nudge per tick (walking), not a shove
    for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) {
      const a = units[i], b = units[j], dx = b.x - a.x, dy = b.y - a.y;
      let u = ((dx - dy) * 8) / SEP_X, v = ((dx + dy) * 4) / SEP_Y, e = hypot(u, v);
      if (e >= 1) continue;
      if (e < 1e-3) { u = (a.id || i) < (b.id || j) ? -1 : 1; v = 0; e = 1; }       // coincident: part sideways
      const k = ((1 - Math.min(1, e)) * (a.isHero || b.isHero ? 1 : 0.5) * stiff) / e, pu = u * k * SEP_X, pv = v * k * SEP_Y;   // half the gap each, in px
      let px = (pu / 8 + pv / 4) / 2, py = (pv / 4 - pu / 8) / 2;                     // screen px → world tiles
      // ease it: a screen px of height is a quarter tile of depth, so a small overlap on screen
      // shoved a unit ~1.2 tiles in one tick (a visible pop); overlaps now part over a few ticks
      const pl = hypot(px, py); if (pl > MAX_SHOVE) { px *= MAX_SHOVE / pl; py *= MAX_SHOVE / pl; }
      if (!a.isHero && isWalkable(w, a.x - px, a.y - py)) { a.x -= px; a.y -= py; }
      if (!b.isHero && isWalkable(w, b.x + px, b.y + py)) { b.x += px; b.y += py; }
    }
  }
  const nearest = (u, list, pred = () => true, bias = null) => { let best = null, bd = 1e9; for (const o of list) { if (!pred(o)) continue; const d = hypot(o.x - u.x, o.y - u.y) + (bias ? bias(o) : 0); if (d < bd) { bd = d; best = o; } } return best; };
  // formation (GDD §3.5: front fighter, mid rogue, back mage): foes reach for the front line
  // first — the back line counts as this many tiles further away
  const BACKLINE = { fighter: 0, rogue: 1, mage: 2.5 }, reach = (q) => BACKLINE[q.cls] || 0;

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
      const cost = hypot(x - u.x, y - u.y) + (k % STATIONS.length < 2 ? 0 : 0.8) + (ring > 1 ? 6 : 0) - (u.slotTgt === tgt && u.slotK === k ? 1.5 : 0);
      if (cost < bd) { bd = cost; best = k; }
    }
    if (best < 0) return null;
    taken.add(best); u.slotTgt = tgt; u.slotK = best;
    const ring = best < STATIONS.length ? 1 : 1.75, [ux, uy] = STATIONS[best % STATIONS.length];
    return { x: tgt.x + ux * r * ring, y: tgt.y + uy * r * ring, inner: ring === 1 };
  }
  // is (x, y) inside another live unit's on-screen personal space? (u and its target excepted)
  let bodies = [];
  const crowded = (x, y, u, tgt) => bodies.some((o) => o !== u && o !== tgt && o.src !== u && o.src !== tgt && hypot(((o.x - x - (o.y - y)) * 8) / SEP_X, ((o.x - x + (o.y - y)) * 4) / SEP_Y) < 0.9);
  const freeStations = (tgt) => STATIONS.length - ((claims.get(tgt) || { size: 0 }).size);
  // Melee: hold a station beside the target and swing when in reach; never slide mid-swing.
  function melee(u, tgt, F, dt, w, isParty, move) {
    const d = hypot(tgt.x - u.x, tgt.y - u.y), st = station(u, tgt, F.range, w);
    const inReach = d <= F.range + 0.25;
    if (inReach && u.cd <= 0) { u.moving = false; attack(u, tgt, isParty, w, F, isParty ? pickStrike(u, tgt) : null); return; }
    if (u.act > 0.12) { u.moving = false; return; }                     // finishing the swing
    const goal = st || tgt;
    if (hypot(goal.x - u.x, goal.y - u.y) > 0.4 && !(inReach && !st)) move(goal.x, goal.y);
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
  const FORM_BACK = 26, FORM_SIDE = 38, EASE_AFTER = 1.5, SIT_AFTER = 15, STROLL = 2.1;
  // on the move (critic pass 3: they stopped and started, and swung across at every turn): each
  // companion matches the hero's velocity plus a spring toward its station (FOLLOW_K per second),
  // eased by FOLLOW_ACC, capped at FOLLOW_MAX; the formation's heading turns over ~FORM_TURN s
  const FOLLOW_K = 2.4, FOLLOW_ACC = 45, FOLLOW_MAX = 12, FORM_TURN = 0.35;
  const formHead = { x: 0.6, y: 0.8 };
  // the hero's breadcrumbs: a companion whose station is round a corner follows these instead
  // of pressing into the wall (and being teleported once it fell far behind)
  const trail = [];
  const lineOpen = (w, ax, ay, bx, by) => { const n = Math.ceil(hypot(bx - ax, by - ay) / 0.3);
    for (let i = 1; i <= n; i++) { const x = ax + ((bx - ax) * i) / n, y = ay + ((by - ay) * i) / n; if (!isWalkable(w, x - 0.25, y - 0.25) || !isWalkable(w, x + 0.25, y + 0.25) || !isWalkable(w, x - 0.25, y + 0.25) || !isWalkable(w, x + 0.25, y - 0.25)) return false; }
    return true; };
  function moveVel(u, vx, vy, dt, w) {                               // ease u's velocity toward (vx, vy), then move with wall sliding
    const dvx = vx - (u.vx || 0), dvy = vy - (u.vy || 0), dv = hypot(dvx, dvy), a = FOLLOW_ACC * dt;
    if (dv <= a) { u.vx = vx; u.vy = vy; } else { u.vx = (u.vx || 0) + (dvx / dv) * a; u.vy = (u.vy || 0) + (dvy / dv) * a; }
    const sp = hypot(u.vx, u.vy); if (sp < 0.05) { u.vx = u.vy = 0; u.moving = false; return; }
    const nx = u.x + u.vx * dt, ny = u.y + u.vy * dt;
    if (isWalkable(w, nx, ny)) { u.x = nx; u.y = ny; } else if (isWalkable(w, nx, u.y)) { u.x = nx; u.vy = 0; } else if (isWalkable(w, u.x, ny)) { u.y = ny; u.vx = 0; } else { u.vx = u.vy = 0; }
    u.moving = sp > 0.6; if (u.moving) { u.fx = u.vx; u.fy = u.vy; }
  }
  const scr2w = (sx, sy) => [(sx / 8 + sy / 4) / 2, (sy / 4 - sx / 8) / 2];      // screen px → world tiles
  const idleRng = mulberry32(streamSeed(seed, 0x1d1e));
  let heroStill = 0, clock = 0;
  function atEase(dt, w, p, H) {
    clock += dt;
    heroStill = p.moving ? 0 : heroStill + dt;
    const last = trail[trail.length - 1];
    if (!last || hypot(p.x - last[0], p.y - last[1]) > 0.5) { trail.push([p.x, p.y]); if (trail.length > 60) trail.shift(); }
    if (last && hypot(p.x - last[0], p.y - last[1]) > 6) trail.length = 0;   // a jump (travel, stairs): start over
    const wx0 = p.fx ?? 0.7, wy0 = p.fy ?? 0.7;                          // heading, on screen
    let hx = (wx0 - wy0) * 8, hy = (wx0 + wy0) * 4; let hl = hypot(hx, hy) || 1; hx /= hl; hy /= hl;
    if (p.moving) { const k = 1 - exp(-dt / FORM_TURN); formHead.x += (hx - formHead.x) * k; formHead.y += (hy - formHead.y) * k; }
    hl = hypot(formHead.x, formHead.y); if (hl > 0.2) { hx = formHead.x / hl; hy = formHead.y / hl; } else { formHead.x = hx; formHead.y = hy; }
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
      let sx = p.x + ox, sy = p.y + oy;
      // a station inside a wall (a corridor): pull it in toward the hero until it's open floor, so
      // they fall in behind rather than scraping along the wall
      const open = (x, y) => isWalkable(w, x, y) && isWalkable(w, x - 0.3, y - 0.3) && isWalkable(w, x + 0.3, y + 0.3) && isWalkable(w, x - 0.3, y + 0.3) && isWalkable(w, x + 0.3, y - 0.3);
      if (!open(sx, sy)) for (const t of [0.8, 0.6, 0.4, 0.2]) { const qx = p.x + ox * t, qy = p.y + oy * t; if (open(qx, qy)) { sx = qx; sy = qy; break; } }
      if (heroStill < EASE_AFTER) {                                      // on the move: keep station
        m.sitting = false; m.ease = null;
        let ex = sx - m.x, ey = sy - m.y, d = hypot(ex, ey);
        let vx = (p.vx || 0) + ex * FOLLOW_K, vy = (p.vy || 0) + ey * FOLLOW_K;
        if (d > 0.8 && !lineOpen(w, m.x, m.y, sx, sy)) {                 // station round a corner: follow the hero's trail
          let c = null; for (let t = trail.length - 1; t >= 0; t--) if (lineOpen(w, m.x, m.y, trail[t][0], trail[t][1])) { c = trail[t]; break; }
          if (c) { ex = c[0] - m.x; ey = c[1] - m.y; const dc = hypot(ex, ey) || 1, sp = hypot(p.vx || 0, p.vy || 0) + 2.5; vx = (ex / dc) * sp; vy = (ey / dc) * sp; }
        }
        const v = hypot(vx, vy); if (v > FOLLOW_MAX) { vx *= FOLLOW_MAX / v; vy *= FOLLOW_MAX / v; }
        if (!p.moving && d < 0.35) { vx = 0; vy = 0; }                   // settled on station
        moveVel(m, vx, vy, dt, w);
        return;
      }
      m.vx = m.vy = 0;
      if (m.sitting) { m.moving = false; return; }
      const e = m.ease || (m.ease = { next: clock + idleRng() * 2, gx: m.x, gy: m.y });
      if (clock >= e.next) {                                             // a new spot, and maybe a gesture
        const [dx, dy] = scr2w((idleRng() - 0.5) * 30, (idleRng() - 0.5) * 16);   // a spot near the station, mostly sideways on screen
        const gx = sx + dx, gy = sy + dy;
        if (isWalkable(w, gx, gy)) { e.gx = gx; e.gy = gy; }
        e.next = clock + 4 + idleRng() * 6;
        const k = idleRng();
        if (k < 0.3) m.fidgetN = (m.fidgetN || 0) + 1;
        else if (k < 0.6) { m.lookN = (m.lookN || 0) + 1; const la = idleRng() * Math.PI * 2; m.fx = cos(la); m.fy = sin(la); }
        else { m.fx = p.x - m.x; m.fy = p.y - m.y; }                    // turn to the hero
      }
      const d = hypot(e.gx - m.x, e.gy - m.y);
      if (d > 0.3) stepToward(m, e.gx, e.gy, STROLL, dt, w); else m.moving = false;
      if (heroStill > SIT_AFTER + i * 2.5 && !m.moving) { m.sitting = true; m.fx = p.x - m.x; m.fy = p.y - m.y; }   // settle down, facing the hero
    });
    separate([{ ...H, x: p.x, y: p.y, isHero: true }, ...state.party.slice(1).filter((m) => !m.down)], w, 36, 24, heroStill < EASE_AFTER ? 0.3 : 1);   // roomier than in a melee
  }

  // ── the step ────────────────────────────────────────────────────────────────
  function step(dt) {
    stepN++;
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
      if (m.down || m.fallen) continue;
      const s = statsFor(m), k = calm ? OUT_OF_BATTLE_REGEN : 1;
      const iron = m.cls === 'fighter' && m.hp < s.maxHp * 0.3 && hasPassive(m) ? 2 : 1;             // Iron Hide
      m.hp = Math.min(s.maxHp, m.hp + s.hpr * k * iron * dt); m.mp = Math.min(s.maxMp, m.mp + s.mpr * k * dt);   // regen grows with the pool, plus gear regen
      if (m.buff) { m.buff.wall = Math.max(0, (m.buff.wall || 0) - dt); m.buff.smoke = Math.max(0, (m.buff.smoke || 0) - dt); }
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
          onDrop('wave', battle.level, p.x, p.y);                // now and then a fallen wave leaves something behind
          for (const m of state.party) if (alive(m) && m.downs && (m.stood = (m.stood || 0) + 1) >= WIND) { m.downs = 0; m.stood = 0; }
          for (const m of state.party) if (m.down) {                // the fallen get back up in the lull
            m.down = false; m.hp = Math.max(1, Math.round(statsFor(m).maxHp * REVIVE));
            bus.emit('combat', { t: 'rise', x: m.x, y: m.y, name: m.name });
          }
        }
        battle.lull -= dt; battle.waited = (battle.waited || 0) + dt;
        // the next wave comes when the lull is over and the party has caught its breath (or waited long enough)
        if (battle.lull <= 0 && (battle.wave === 0 || (partyHp() >= LULL_READY && state.party.every((m) => !alive(m) || m.hp >= statsFor(m).maxHp * LULL_EACH)) || battle.waited >= LULL_MAX)) { battle.between = false; spawnWave(w); }
      }
      claims = new Map();
      bodies = [{ x: p.x, y: p.y, src: H }, ...state.party.slice(1).filter(alive), ...w.enemies.filter((e) => e.hp > 0 && !e.dead && !(e.spawn > 0))];
      const focus = focusId && foes.find((e) => e.id === focusId);
      // party AI
      state.party.forEach((m, i) => {
        if (!alive(m) || !foes.length) return;
        const F = CLASS_FIGHT[m.cls], stance = stanceOf(m);
        // Defensive companions fight only what comes near the leader, and fall back to it otherwise
        const near = i > 0 && stance === 'defensive' && !F.bolt ? foes.filter((e) => hypot(e.x - p.x, e.y - p.y) < DEF_LEASH) : foes;
        if (!near.length) { if (hypot(p.x - m.x, p.y - m.y) > 2.5) chase(m, p.x, p.y, F.speed, dt, w); else m.moving = false; return; }
        // a fighter guards the leader — while it stands: guarding a Downed hero, one stood idle 45 s
        // on a far station beside two foes hitting it
        const guard = m.cls === 'fighter' && i > 0 && stance !== 'aggressive' && alive(H);
        let tgt = (focus && near.includes(focus) ? focus : null) || (m.cls === 'rogue' ? near.reduce((a, b) => (b.hp < a.hp ? b : a)) : guard ? nearest(H, near) : nearest(m, near));
        if (!tgt) return;

        const d = hypot(tgt.x - m.x, tgt.y - m.y);
        m.fx = tgt.x - m.x; m.fy = tgt.y - m.y;
        if (i === 0 && p.moving) return;                        // the hero is yours while you steer
        if (m.cd <= 0 && m.act <= 0.12 && tryUtility(m, i, foes, w, F)) return;
        if (i === 0) {                                          // …and autobattles when you let go
          if ((p.steer ?? 1e9) < AUTO_DELAY || !moveHero) { if (d <= F.range + 0.25 && m.cd <= 0) attack(m, tgt, true, w, F, pickStrike(m, tgt)); return; }
          melee(m, tgt, F, dt, w, true, (gx, gy) => {               // autobattle: take a station, leashed to the room
            // a probe steps first (the hero's collision decides the real move); it carries the stride
            // ramp (spd, stepAt) across ticks — a fresh probe restarted it every tick, pinning the
            // hero at the first step: 2 tiles/s instead of the fighter's 6.8
            const q = { x: p.x, y: p.y, spd: m.spd, stepAt: m.stepAt }; chase(q, gx, gy, F.speed, dt, w);
            m.spd = q.spd; m.stepAt = q.stepAt;
            if (q.x !== p.x || q.y !== p.y) { moveHero(q.x - p.x, q.y - p.y); m.x = p.x; m.y = p.y; }
          });
          return;
        }
        const close = nearest(m, foes);
        if (F.keepAway && close && hypot(close.x - m.x, close.y - m.y) < F.keepAway) {        // mage: back off (the whole keep-away: melee foes reach 2.8–3 tiles)
          stepToward(m, m.x - (close.x - m.x), m.y - (close.y - m.y), F.speed, dt, w);
        } else if (F.bolt) { if (d > F.range) chase(m, tgt.x, tgt.y, F.speed, dt, w); else { m.moving = false; if (m.cd <= 0) attack(m, tgt, true, w, F, pickStrike(m, tgt)); } }
        else melee(m, tgt, F, dt, w, true, (gx, gy) => chase(m, gx, gy, F.speed, dt, w));
      });
      // enemy AI (leashed to the room)
      const living = state.party.filter(alive);
      const hidden = living.filter((q) => !(q.buff && q.buff.smoke > 0)), targets = hidden.length ? hidden : living;   // Smoke Step: foes lose you
      const taunts = targets.filter((q) => q.buff && q.buff.wall > 0);                                                // Shield Wall: foes turn on you
      for (const e of w.enemies) {
        e.act = Math.max(0, e.act - dt); e.flash = Math.max(0, e.flash - dt);
        if (e.spawn > 0) { e.spawn -= dt; continue; }
        if (e.dead > 0 || e.hp <= 0) { e.moving = false; continue; }
        if (e.poison) {                                                     // Venom ticks once a second
          e.poison.t -= dt; e.poison.acc += dt;
          while (e.poison && e.poison.acc >= 1 && e.hp > 0) { e.poison.acc -= 1; applyHit(e.poison.by, e, { dmg: Math.max(1, Math.round(e.poison.dps)), crit: false }, false, w); }
          if (e.poison && e.poison.t <= 0) e.poison = null;
          if (e.hp <= 0) continue;
        }
        const slow = e.slow > 0 ? 0.5 : 1; if (e.slow > 0) e.slow -= dt;     // Frost Nova
        e.cd = Math.max(0, e.cd - dt * slow);
        const taunt = nearest(e, taunts, (q) => hypot(q.x - e.x, q.y - e.y) < 7);
        // melee skeletons pick the nearest party member with a free station (else the nearest)
        const t = taunt || (e.bolt ? nearest(e, targets, undefined, reach) : nearest(e, targets, (q) => freeStations(q) > 0 || e.slotTgt === q, reach) || nearest(e, targets, undefined, reach));
        if (!t) { e.moving = false; continue; }
        const d = hypot(t.x - e.x, t.y - e.y); e.fx = t.x - e.x; e.fy = t.y - e.y;
        if (e.bolt) { if (d > e.range) chase(e, t.x, t.y, e.speed * slow, dt, w); else { e.moving = false; if (e.cd <= 0) attack(e, t, false, w, e); } }
        else melee(e, t, e, dt, w, false, (gx, gy) => chase(e, gx, gy, e.speed * slow, dt, w));
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
    reset() { const was = !!battle; battle = null; focusId = 0; pending = []; if (was) downedOut(true); placeCompanions(); },   // travel mid-fight = walking out
    placeCompanions,
  };
}
