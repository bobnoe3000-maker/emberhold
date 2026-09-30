// core.js — the headless simulation. Fixed 20 Hz tick, commands in, events out.
// Zero DOM, zero renderer imports. `node smoke-test.mjs` runs this file happily.
//
// The world is one dungeon level; descending the stairs regenerates it deeper
// (harder). Everything the world can't re-derive from (seed, depth) lives in the
// snapshot: player, counters, the mods/HP overlay, and the discovered-room fog.

import { createWorld, isWalkable, hitResource, heightAt, propAt, resourceAt, CONSUMABLE_PROP } from './world.js';
import { findPath } from './path.js';
import { listDestinations } from './travel.js';
import { createOutdoor, oExitAt, oBlock } from './outdoor.js';
import { makeHero, statsFor } from './party.js';
import { starterKit } from './items.js';
import { autoAllocate } from './attributes.js';
import { createLoot } from './loot.js';
import { createHeroes } from './heroes.js';
import { createBattle } from './battle.js';
import { placeNpcs, createTalk } from './npcs.js';
import { createQuests } from './quests.js';
import { createBus, createCommandQueue } from './bus.js';
import { hypot, atan2, sin, cos } from './detmath.js';

export const TICK_HZ = 20;
export const TICK_DT = 1 / TICK_HZ;

export const PLAYER_SPEED = 8.8;   // tiles / second (5.8 → 7.0 → 8.0 → 8.8)
// Movement has a VELOCITY (critic pass 3: instant starts, stops and pivots read as stiff):
// speed eases up and down (ACCEL / BRAKE) and the heading turns at TURN_RATE, so a stick
// flick or a path corner becomes a short curve. Tap / compass walks steer at a point LOOK
// tiles ahead along the path (pure pursuit) and brake into the goal instead of stopping dead.
const ACCEL = 60, BRAKE = 85, TURN_RATE = 14, LOOK = 1.1;
const PLAYER_RADIUS = 0.32;   // collision radius in tiles
const REACH = 1.8;            // interact reach (chebyshev-ish, in tiles)

// The level's entrance point, snapped to the nearest walkable tile. Used at fresh
// spawn, on descent, and as the relocation target when a restored position is
// off-floor (a save from an older world model — never strand the player).
function findSpawn(world) {
  if (isWalkable(world, world.spawn.x, world.spawn.y)) return { x: world.spawn.x, y: world.spawn.y };
  const bx = Math.floor(world.spawn.x), by = Math.floor(world.spawn.y);
  for (let r = 1; r < 64; r++)
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const nx = bx + dx + 0.5, ny = by + dy + 0.5;
      if (isWalkable(world, nx, ny)) return { x: nx, y: ny };
    }
  return { x: world.spawn.x, y: world.spawn.y };
}

// Scenes: 'town' (Thornwick), 'overland' (the Hollow Vale) and 'dungeon' (the Old
// Barrows, depth 0…n). Walking into an exit zone or tapping the Barrows stairs /
// the dungeon's way up travels between them.
export function createSim(seed, theme, { scene = 'dungeon', region = 'vale' } = {}) {
  const baseSeed = seed >>> 0;
  const override = theme;                                  // fixed theme (preview) or undefined
  const levelSeed = (d) => (baseSeed ^ Math.imul(d >>> 0, 2654435761)) >>> 0;
  let curScene = scene;
  const buildWorld = (d) => placeNpcs(curScene === 'dungeon' ? createWorld(levelSeed(d), override, d) : createOutdoor(baseSeed, curScene, region), isWalkable, oBlock);

  let world = buildWorld(0);
  const bus = createBus();
  const commands = createCommandQueue();

  const spawn = findSpawn(world);
  const state = {
    t: 0, tick: 0, depth: 0, get scene() { return curScene; },   // tick: integer tick count (replay.js keys commands by it)
    player: {
      x: spawn.x, y: spawn.y, px: spawn.x, py: spawn.y,
      dir: 'down', mirror: false, moving: false, frame: 0, frameAcc: 0,
    },
    counters: { wood: 0, stone: 0, gold: 0, embers: 0, lootN: 0, uidN: 0 },
    bag: [],                          // the party bag (loot.js): items not worn, shared by everyone
    sitesEntered: new Set(),          // dungeon sites ever entered (compass: "nearest unexplored")
    party: [makeHero()],                                   // [your main character, …up to two companions]
    bench: [],                        // recruited companions waiting at the inn (heroes.js)
    created: false,                   // has this game's main character been made? (createHero, once)
    temple: { freeDay: -1 },          // the in-game day the temple last raised someone for free
    flags: {},                        // story flags set by conversations (npcs.js): { [name]: number }
  };

  // gear drops, the bag and the equip commands (loot.js)
  const loot = createLoot({ state, bus, seed: baseSeed });
  // creation, points, skills, stance, the bench, the temple and the inn (heroes.js)
  const heroes = createHeroes({ state, bus, getWorld: () => world, seed: baseSeed });
  // room battles (battle.js): waves, party AI, damage, XP / gold, defeat → back to town
  const battle = createBattle({ state, bus, getWorld: () => world, seed: baseSeed, isWalkable, onDefeat: () => travel('town', 'temple'),
    onDrop: (src, ilv, x, y) => loot.drop(src, { ilv, x, y }),
    moveHero: (dx, dy) => { const p = state.player; tryMove(p, dx, dy); const l = hypot(dx, dy) || 1; p.moving = true; p.fx = dx / l; p.fy = dy / l; p.vx = p.vy = 0; face(p, dx, dy); } });

  // named NPCs and conversations (npcs.js); walkTo is hoisted, standable is called only later
  const quests = createQuests({ state, bus, getWorld: () => world });   // quests (quests.js): counted from this sim's events
  const talk = createTalk({ state, bus, getWorld: () => world, walkTo, canStand: (x, y) => standable(x, y, x, y), moreVars: (id) => quests.varsFor(id), effect: (id, args) => quests.effect(id, args) });

  function tryMove(p, dx, dy) {
    const cz = heightAt(world, Math.floor(p.x), Math.floor(p.y));
    const probe = (nx, ny) =>
      isWalkable(world, nx - PLAYER_RADIUS, ny - PLAYER_RADIUS, cz) &&
      isWalkable(world, nx + PLAYER_RADIUS, ny - PLAYER_RADIUS, cz) &&
      isWalkable(world, nx - PLAYER_RADIUS, ny + PLAYER_RADIUS, cz) &&
      isWalkable(world, nx + PLAYER_RADIUS, ny + PLAYER_RADIUS, cz);
    if (probe(p.x + dx, p.y)) p.x += dx;
    if (probe(p.x, p.y + dy)) p.y += dy;
  }

  // ── tap to move (GDD §3.1): walk a path to a tapped spot; tap a chest / shrine / stairs /
  // growth out of reach and the hero walks up to it and uses it. The stick cancels it.
  const standable = (x, y, fx, fy) => {
    const cz = heightAt(world, fx, fy), cx = x + 0.5, cy = y + 0.5, r = PLAYER_RADIUS * 0.9;
    return isWalkable(world, cx, cy, cz) && isWalkable(world, cx - r, cy - r, cz) && isWalkable(world, cx + r, cy - r, cz) && isWalkable(world, cx - r, cy + r, cz) && isWalkable(world, cx + r, cy + r, cz);
  };
  // opts.label (compass): names the destination for the walking chip; opts.corridors keeps a
  // dungeon walk to corridors, crossing other rooms only when there's no other way.
  function walkTo(tx, ty, then = null, opts = {}) {
    const p = state.player, target = standable(tx, ty, tx, ty);
    const near = opts.near ?? (target && !then ? 0 : 1);
    let weight = null;
    if (opts.corridors && world.kind === 'dungeon') {
      const cells = world.level.cells, c0 = cells.get(Math.floor(p.x) + ',' + Math.floor(p.y)), r0 = c0 ? c0.room : -1, cg = cells.get(tx + ',' + ty), rg = cg ? cg.room : -1;
      const wm = new Map();                                   // per walk, like stand() below: a string-keyed cell lookup per tile searched was most of a long compass walk's cost
      weight = (x, y) => { const k = (x + 4096) * 8192 + (y + 4096); let v = wm.get(k);
        if (v === undefined) { const c = cells.get(x + ',' + y); v = c && c.room >= 0 && !c.corridor && c.room !== r0 && c.room !== rg ? 3 : 0; wm.set(k, v); } return v; };
    }
    // standable() probes five points (walls, hazard, props, climb) and the search asks it up to 24
    // times a node; memoised for this walk — by tile and the height stepped up from, the only
    // thing (fx, fy) changes — a long or unreachable tap no longer stalls the tick (0.2–0.6 s
    // on a laptop, seconds on a phone). The answers, and so the path, are unchanged.
    const memo = new Map(), stand = (x, y, fx, fy) => {
      const hz = heightAt(world, fx, fy), k = (x + 4096) * 8192 + (y + 4096);
      let m = memo.get(hz); if (!m) memo.set(hz, (m = new Map()));
      let v = m.get(k); if (v === undefined) { v = standable(x, y, fx, fy); m.set(k, v); } return v;
    };
    // outdoors, a walk keeps out of every exit zone but the one it's heading for: leaving the
    // barrows for town, the straight line north ran back through the barrows' mouth. (A walk that
    // can only be made through one still goes, and followPath's exit check below lets it pass.)
    const goalZone = world.kind !== 'dungeon' ? oExitAt(world, tx + 0.5, ty + 0.5) : null;
    const clear = (x, y, fx, fy) => { const e = oExitAt(world, x + 0.5, y + 0.5); return (!e || e === goalZone) && stand(x, y, fx, fy); };
    const path = (world.kind !== 'dungeon' && world.exits.length && findPath(p.x, p.y, tx, ty, clear, { near, weight })) || findPath(p.x, p.y, tx, ty, stand, { near, weight });
    if (!path) { bus.emit('noPath', { tx, ty }); return false; }
    p.path = path.slice(1); p.goal = { x: tx + 0.5, y: ty + 0.5 }; p.then = then; p.pathStuck = 0; p.goalZone = goalZone;
    p.dest = opts.label ? { label: opts.label, tx, ty, then, near, room: opts.room ?? -1, fromRoom: battle.battle ? battle.battle.room : -1 } : null;   // fromRoom: a fight you're walking out of doesn't stop you
    if (!p.path.length) arrive();
    return true;
  }
  function stopWalk() { const p = state.player; p.path = null; p.goal = null; p.then = null; p.dest = null; p.goalZone = null; }
  function arrive() { const p = state.player, then = p.then; stopWalk(); if (then) applyCommand(then); }
  const lineClear = (ax, ay, bx, by) => {                 // can the hero walk straight from a to b?
    const d = hypot(bx - ax, by - ay), n = Math.ceil(d / 0.25), cz = heightAt(world, Math.floor(ax), Math.floor(ay)), r = PLAYER_RADIUS;
    for (let i = 1; i <= n; i++) { const x = ax + ((bx - ax) * i) / n, y = ay + ((by - ay) * i) / n;
      if (!isWalkable(world, x - r, y - r, cz) || !isWalkable(world, x + r, y - r, cz) || !isWalkable(world, x - r, y + r, cz) || !isWalkable(world, x + r, y + r, cz)) return false; }
    return true;
  };
  // tap / compass walks: string-pull the path, then steer at a point LOOK tiles ahead along it
  // (a corner becomes an arc), slowing only to brake into the goal
  function followPath() {
    const p = state.player;
    if (!p.path || p.want || state.party[0].down) return;
    let k = 0; for (let j = Math.min(p.path.length - 1, 10); j > 0; j--) if (lineClear(p.x, p.y, p.path[j][0], p.path[j][1])) { k = j; break; }
    if (k) p.path.splice(0, k);
    while (p.path.length > 1 && hypot(p.path[0][0] - p.x, p.path[0][1] - p.y) < LOOK * 0.5) p.path.shift();   // passed it
    const [lx, ly] = p.path[p.path.length - 1];
    let left = 0, ax = p.x, ay = p.y; for (const [wx, wy] of p.path) { left += hypot(wx - ax, wy - ay); ax = wx; ay = wy; }
    if (left < 0.12 || (p.path.length === 1 && hypot(lx - p.x, ly - p.y) < 0.12)) { p.vx *= 0.3; p.vy *= 0.3; arrive(); return; }
    // the carrot: LOOK tiles along the remaining path
    let cx = p.path[0][0], cy = p.path[0][1], need = LOOK; ax = p.x; ay = p.y;
    for (const [wx, wy] of p.path) { const d = hypot(wx - ax, wy - ay); if (d >= need) { cx = ax + ((wx - ax) * need) / d; cy = ay + ((wy - ay) * need) / d; break; } need -= d; ax = wx; ay = wy; cx = wx; cy = wy; }
    if (!lineClear(p.x, p.y, cx, cy)) { cx = p.path[0][0]; cy = p.path[0][1]; }
    const dx = cx - p.x, dy = cy - p.y, d = hypot(dx, dy) || 1;
    const sp = Math.min(PLAYER_SPEED, Math.sqrt(2 * BRAKE * 0.7 * left) + 0.6);    // brake into the goal
    p.want = { x: (dx / d) * sp, y: (dy / d) * sp };
  }
  // integrate the hero's velocity toward p.want (null = stop): speed eases, the heading turns at
  // TURN_RATE (a hard reversal brakes first), collisions slide along walls and kill that axis
  function integrate() {
    const p = state.player, w = p.want;
    let sp = hypot(p.vx || 0, p.vy || 0), hd = sp > 0.05 ? atan2(p.vy, p.vx) : null;
    const ts = w ? hypot(w.x, w.y) : 0, th = ts > 0.05 ? atan2(w.y, w.x) : hd;
    let target = ts;
    if (th !== null) {
      if (hd === null || sp < 1) hd = th;                                   // from a standstill: set off facing the way you want
      else {
        let da = th - hd; da -= 2 * Math.PI * Math.round(da / (2 * Math.PI));
        const turn = TURN_RATE * TICK_DT; hd += Math.max(-turn, Math.min(turn, da));
        if (Math.abs(da) > 2.1) target = Math.min(target, sp * 0.4);        // a hard reversal: brake through it
      }
    }
    sp += Math.max(-BRAKE * TICK_DT, Math.min(ACCEL * TICK_DT, target - sp));
    if (sp < 0.05 || hd === null) { p.vx = p.vy = 0; return; }
    p.vx = cos(hd) * sp; p.vy = sin(hd) * sp;
    const ox = p.x, oy = p.y; tryMove(p, p.vx * TICK_DT, p.vy * TICK_DT);
    if (Math.abs(p.x - ox) < 1e-6) p.vx = 0; if (Math.abs(p.y - oy) < 1e-6) p.vy = 0;   // blocked on that axis
    const moved = hypot(p.x - ox, p.y - oy) / TICK_DT;
    if (moved > 0.6) { p.moving = true; p.fx = (p.x - ox) / (moved * TICK_DT); p.fy = (p.y - oy) / (moved * TICK_DT); face(p, p.fx, p.fy); }
    if (p.path && w) { p.pathStuck = moved < 0.2 ? (p.pathStuck || 0) + 1 : 0; if (p.pathStuck > 10) stopWalk(); }   // blocked (a unit in the way): give up rather than grind
  }

  function face(p, dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) { p.dir = 'side'; p.mirror = dx < 0; }
    else p.dir = dy < 0 ? 'up' : 'down';
  }

  // Floors, one at a time (GDD §3.1): the stairs down go one floor deeper, arriving at the foot of
  // that floor's stair up; the stair up climbs one floor, arriving in the corridor by that floor's
  // stairs down (the first floor's leads out to the surface instead). A site remembers each floor
  // you've been on for the visit — chests opened, growths cut, the fog lifted — so going up and
  // down can't refill them; leaving the site forgets them, as re-entering always has.
  /** @type {Map<number, { mods: any[], hp: any[], discovered: any[], visited: any[] }>} */
  let floors = new Map();
  const overlayOf = (w) => ({ mods: [...w.mods.entries()], hp: [...w.hp.entries()], discovered: [...w.discovered], visited: [...(w.visited || [])] });
  function applyOverlay(w, o) {
    w.mods.clear(); for (const e of o.mods ?? []) Array.isArray(e) ? w.mods.set(e[0], e[1]) : w.mods.set(e, { cleared: true });
    w.hp.clear(); for (const [k, n] of o.hp ?? []) w.hp.set(k, n);
    w.discovered.clear(); for (const id of o.discovered ?? []) w.discovered.add(id);
    w.visited = new Set(o.visited ?? []);
  }
  function changeFloor(d, arrive) {
    stopWalk(); state.player.resume = null;
    floors.set(state.depth, overlayOf(world));
    const up = d < state.depth;
    state.depth = d;
    world = buildWorld(d);
    if (floors.has(d)) applyOverlay(world, floors.get(d));
    const a = arrive(world), s = a && isWalkable(world, a.x, a.y) ? a : findSpawn(world);
    const p = state.player;
    p.x = p.px = s.x; p.y = p.py = s.y; p.moving = false; p.vx = p.vy = 0; p.frame = 0; p.frameAcc = 0;
    battle.reset();
    bus.emit('levelChanged', { depth: state.depth, theme: world.theme, ...(up ? { up: true } : {}) });
  }
  const descend = () => changeFloor(state.depth + 1, (w) => w.stairArrive);
  const ascend = () => changeFloor(state.depth - 1, (w) => w.stairsDownArrive);

  // Travel to another scene and arrive at a named spot (or its default spawn).
  function travel(to, arrive) {
    stopWalk(); state.player.resume = null;
    floors = new Map();                                    // a new visit: the site's floors are fresh
    if (to === 'dungeon') state.sitesEntered.add('barrows');
    curScene = to; state.depth = 0;
    world = buildWorld(0);
    const a = (world.arrivals && (world.arrivals[arrive] || world.arrivals.default)) || world.stairArrive || null;
    const p = state.player;
    const s = a && isWalkable(world, a.x, a.y) ? a : findSpawn(world);
    p.x = p.px = s.x; p.y = p.py = s.y; p.moving = false; p.vx = p.vy = 0; p.frame = 0; p.frameAcc = 0;
    battle.reset();
    bus.emit('levelChanged', { depth: 0, theme: world.theme, scene: curScene });
  }

  function applyCommand(cmd) {
    const p = state.player;
    if (!cmd || typeof cmd !== 'object') return;
    if (loot.command(cmd)) return;                         // equip / unequip / salvage
    if (heroes.command(cmd)) return;                       // hero, party, bench, temple and inn commands
    if (quests.command(cmd)) return;                       // track / questAbandon
    if (talk.command(cmd)) return;                         // talk / dialogueEffect / endTalk
    if (cmd.type === 'focus') { battle.focus(cmd.id); return; }
    if (cmd.type === 'move') {
      if (state.party[0].down) return;                         // your hero has fallen: the others fight on
      const len = hypot(cmd.x, cmd.y);
      if (len < 0.12) return;
      if (p.path || p.resume) { stopWalk(); p.resume = null; }  // the stick takes over from a tap / compass walk
      const nx = cmd.x / Math.max(1, len), ny = cmd.y / Math.max(1, len);
      p.want = { x: nx * PLAYER_SPEED, y: ny * PLAYER_SPEED }; p.steer = 0;
      return;
    }
    if (cmd.type === 'goto') {                             // compass: auto-walk to a picked destination
      if (state.party[0].down) return;
      p.resume = null;
      walkTo(cmd.tx, cmd.ty, cmd.then || null, { near: cmd.near, label: cmd.label, corridors: true, room: cmd.room });
      return;
    }
    if (cmd.type === 'resume') {                           // continue a compass walk a fight interrupted
      const r = p.resume; p.resume = null;
      if (r && !state.party[0].down) walkTo(r.tx, r.ty, r.then, { near: r.near, label: r.label, corridors: true, room: r.room });
      return;
    }
    if (cmd.type === 'cancelWalk') { stopWalk(); p.resume = null; return; }
    if (cmd.type === 'tap') {                              // tap on the ground: use what's there if in reach, else walk to it
      if (state.party[0].down) return;
      const dx = cmd.tx + 0.5 - p.x, dy = cmd.ty + 0.5 - p.y, inReach = Math.max(Math.abs(dx), Math.abs(dy)) <= REACH;
      const thing = propAt(world, cmd.tx, cmd.ty) || resourceAt(world, cmd.tx, cmd.ty);
      if (thing && inReach) { stopWalk(); applyCommand({ type: 'harvest', tx: cmd.tx, ty: cmd.ty }); return; }
      walkTo(cmd.tx, cmd.ty, thing ? { type: 'harvest', tx: cmd.tx, ty: cmd.ty } : null);
      return;
    }
    if (cmd.type === 'harvest') {                          // tap-to-interact
      const dx = cmd.tx + 0.5 - p.x, dy = cmd.ty + 0.5 - p.y;
      const inReach = Math.max(Math.abs(dx), Math.abs(dy)) <= REACH;
      const prop = propAt(world, cmd.tx, cmd.ty);
      if (prop) {
        if (!inReach) { bus.emit('outOfReach', { tx: cmd.tx, ty: cmd.ty }); return; }
        face(p, dx, dy);
        if (prop === 'stairs' && world.kind === 'overland') { travel('dungeon'); return; }          // into the Old Barrows
        if (prop === 'exit') { travel('overland', 'barrows'); return; }                               // back up to the surface
        if (prop === 'stairs') { bus.emit('descend', { depth: state.depth + 1 }); descend(); return; }
        if (CONSUMABLE_PROP.has(prop)) {
          world.mods.set(cmd.tx + ',' + cmd.ty, { opened: true });
          if (prop === 'chest') { state.counters.wood += 4 + state.depth; state.counters.stone += 3 + state.depth; }
          else if (prop === 'shrine') shrine();
          else { state.counters.wood += 2; state.counters.stone += 2; }
          bus.emit('looted', { tx: cmd.tx, ty: cmd.ty, kind: prop });
          if (prop === 'chest') {                          // a chest may hold gear: item level = its room's level (the hero's outdoors)
            const c = world.level && world.level.cells.get(cmd.tx + ',' + cmd.ty), rl = c && world.roomLevels && world.roomLevels.get(c.room);
            loot.drop('chest', { ilv: rl || Math.max(1, world.kind === 'dungeon' ? state.depth + 1 : state.party[0].level), x: cmd.tx + 0.5, y: cmd.ty + 0.5 });
          }
          bus.emit('countersChanged', { ...state.counters });
        }
        return;                                            // decor props: nothing to interact
      }
      if (!inReach) { bus.emit('outOfReach', { tx: cmd.tx, ty: cmd.ty }); return; }
      const hit = hitResource(world, cmd.tx, cmd.ty);
      if (!hit) return;
      face(p, dx, dy);
      bus.emit('hit', { tx: cmd.tx, ty: cmd.ty, kind: hit.kind, destroyed: hit.destroyed });
      if (hit.destroyed) {
        if (hit.kind === 'tree') state.counters.wood += 3;
        if (hit.kind === 'rock') state.counters.stone += 2;
        bus.emit('harvested', { tx: cmd.tx, ty: cmd.ty, kind: hit.kind });
        bus.emit('countersChanged', { ...state.counters });
      }
    }
  }

  // A site shrine (one use each, GDD §3.6): raises the first Fallen member at 50 % HP; with
  // nobody Fallen it restores the party instead.
  function shrine() {
    const f = state.party.find((m) => m.fallen);
    if (f) { heroes.raise(f, 0.5); bus.emit('resurrected', { id: f.id, name: f.name, how: 'shrine', cost: 0 }); }
    else for (const m of state.party) if (!m.down) { const s = statsFor(m); m.hp = s.maxHp; m.mp = s.maxMp; }
    bus.emit('partyChanged', state.party);
  }

  // Reveal rooms the hero has entered or drawn near (minimap fog of war).
  function updateDiscovery() {
    const p = state.player;
    if (!world.visited) world.visited = new Set();
    const hc = world.level.cells.get(Math.floor(p.x) + ',' + Math.floor(p.y));
    if (hc && hc.kind === 'floor' && hc.room >= 0 && !hc.corridor) world.visited.add(hc.room);   // stood inside it (compass: "unexplored")
    if (battle.battle) world.visited.add(battle.battle.room);   // or fought it: a walk stops at the doorway when the fight starts, and the
                                                                // compass would send you back to that doorway as "unexplored" forever
    for (const r of world.level.rooms) {
      if (world.discovered.has(r.id)) continue;
      const dx = Math.max(Math.abs(p.x - r.cx) - r.rw, 0), dy = Math.max(Math.abs(p.y - r.cy) - r.rh, 0);
      if (dx * dx + dy * dy <= 36) world.discovered.add(r.id);       // within ~6 tiles of the room
    }
  }

  function tick() {
    const p = state.player;
    p.px = p.x; p.py = p.y;
    p.moving = false; p.want = null;
    const cmds = commands.drain();
    if (cmds.length) bus.emit('commands', { tick: state.tick, cmds });   // the session recorder (replay.js) logs these
    for (const cmd of cmds) applyCommand(cmd);
    followPath();
    if (p.want || p.path) p.steer = 0;
    if (!state.party[0].down) integrate(); else p.vx = p.vy = 0;
    battle.step(TICK_DT);
    // a compass walk that runs into a fight stops there; unless the fight IS the destination
    // room, the chip can resume it (the resumed walk won't stop for that room again)
    if (p.path && p.dest && battle.battle && battle.battle.room !== p.dest.fromRoom) {
      const d = p.dest; stopWalk();
      if (d.room !== battle.battle.room) p.resume = d;
    }                                   // may walk the hero (autobattle while you're not steering)
    if (p.moving) {
      p.frameAcc += TICK_DT;
      if (p.frameAcc >= 1 / 8) { p.frameAcc -= 1 / 8; p.frame = (p.frame + 1) % 4; }
    } else { p.frame = 0; p.frameAcc = 0; }
    updateDiscovery();
    heroes.tick();
    talk.tick();
    // an exit zone takes you through unless you're walking a path to somewhere else (a corner cut
    // on the way past); the stick, or a walk that ends in it, goes through
    if (world.kind !== 'dungeon') { const ex = oExitAt(world, p.x, p.y); if (ex && !(p.path && p.goalZone !== ex)) travel(ex.to, ex.arrive); }
    else if (world.exitAt && hypot(p.x - world.exitAt.x, p.y - world.exitAt.y) < 1.6) { if (state.depth > 0) ascend(); else travel('overland', 'barrows'); }   // walk up the stair: a floor up, or out
    state.t += TICK_DT; state.tick += 1;
  }

  // a party member's durable fields; runtime ones (position, velocity, cooldowns, melee-station
  // links to enemies — which made the snapshot circular mid-battle, so autosave silently failed)
  // are rebuilt on load by battle.ensureRuntime
  // (M3: attributes, auto, origin, skill ranks, auto-cast off-list, priority, stance, Fallen,
  // Weakened-until and respec count)
  const MEMBER_KEYS = ['id', 'name', 'cls', 'level', 'xp', 'trait', 'hp', 'mp', 'gear', 'actor', 'main', 'down',
    'attrs', 'autoAttrs', 'origin', 'skills', 'off', 'prio', 'stance', 'fallen', 'weakUntil', 'respecs'];
  const persistMember = (m) => { const o = {}; for (const k of MEMBER_KEYS) if (m[k] !== undefined) o[k] = m[k]; return o; };
  function snapshot() {
    const p = state.player;
    return {
      seed: baseSeed, scene: curScene, depth: state.depth, t: state.t, tick: state.tick,
      player: { x: p.x, y: p.y, dir: p.dir, mirror: p.mirror },
      counters: { ...state.counters },
      party: state.party.map(persistMember),
      bench: state.bench.map(persistMember),
      created: state.created, temple: { ...state.temple },
      bag: state.bag.map((it) => ({ ...it })),
      mods: [...world.mods.entries()],   // [ "x,y", {cleared}|{opened} ]
      hp: [...world.hp.entries()],
      discovered: [...world.discovered],
      visited: [...(world.visited || [])],
      sitesEntered: [...state.sitesEntered],
      flags: { ...state.flags },
      floors: [...floors.entries()],     // the other floors of this visit: [depth, { mods, hp, discovered, visited }]
      ...quests.snapshot(),              // quests: { [id]: [state, step, ...counters] }, tracked
    };
  }

  function restore(data) {
    stopWalk();
    state.t = data.t ?? 0; state.tick = data.tick ?? 0;
    state.depth = data.depth ?? 0;
    curScene = data.scene ?? 'dungeon';
    world = buildWorld(state.depth);                       // rebuild the saved level
    const p = state.player;
    p.x = p.px = data.player.x; p.y = p.py = data.player.y;
    if (!isWalkable(world, p.x, p.y)) { const s = findSpawn(world); p.x = p.px = s.x; p.y = p.py = s.y; }
    p.dir = data.player.dir ?? 'down';
    p.mirror = !!data.player.mirror;
    p.moving = false; p.vx = p.vy = 0; p.frame = 0; p.frameAcc = 0;
    state.counters.wood = data.counters?.wood ?? 0;
    state.counters.stone = data.counters?.stone ?? 0;
    state.counters.gold = data.counters?.gold ?? 0;
    for (const k of ['embers', 'lootN', 'uidN']) state.counters[k] = data.counters?.[k] ?? 0;
    if (Array.isArray(data.party) && data.party.length) state.party = data.party.map((m) => ({ ...m }));
    state.bench = (data.bench ?? []).map((m) => ({ ...m }));
    state.created = data.created ?? true;                   // saves from before creation already had their hero
    state.temple = { freeDay: data.temple?.freeDay ?? -1 };
    for (const m of [...state.party, ...state.bench]) {
      if (!m.gear) m.gear = starterKit(m);                  // saves from before gear: the class kit
      if (!m.attrs) { m.autoAttrs = !m.main; autoAllocate(m); }   // saves from before attributes: the class build (same stats as then)
    }
    state.bag = (data.bag ?? []).map((it) => ({ ...it }));
    world.mods.clear();
    for (const e of data.mods ?? []) Array.isArray(e) ? world.mods.set(e[0], e[1]) : world.mods.set(e, { cleared: true });
    world.hp.clear();
    for (const [k, n] of data.hp ?? []) world.hp.set(k, n);
    world.discovered.clear();
    for (const id of data.discovered ?? []) world.discovered.add(id);
    world.visited = new Set(data.visited ?? []);
    state.sitesEntered = new Set(data.sitesEntered ?? []);
    state.flags = {}; for (const [k, v] of Object.entries(data.flags ?? {})) if (typeof v === 'number') state.flags[k] = v;   // v5 and older: none yet
    quests.restore(data);                                  // v6 and older: none yet
    floors = new Map();                                    // v7 and older: none (only the floor you're on)
    for (const e of Array.isArray(data.floors) ? data.floors : []) if (Array.isArray(e) && Number.isInteger(e[0]) && e[0] >= 0 && e[0] !== state.depth && e[1] && typeof e[1] === 'object') floors.set(e[0], e[1]);
    bus.emit('levelChanged', { depth: state.depth, theme: world.theme, scene: curScene });   // renderer resets caches
    bus.emit('questChanged', { id: null });                // the journal repaints
    battle.reset();
    bus.emit('countersChanged', { ...state.counters });
    bus.emit('partyChanged', state.party);
  }

  // compass destinations for where you are now (read-only; see travel.js)
  function destinations({ inSquare = false } = {}) {
    return quests.compass(listDestinations({ world, state, standable, heroLevel: state.party[0].level, sitesEntered: state.sitesEntered, inSquare }), world, !!battle.battle);   // the tracked quest's next place first
  }
  return { state, bus, commands, tick, snapshot, restore, destinations, heroes, quests, seed: baseSeed, get world() { return world; }, get battle() { return battle.battle; } };
}
