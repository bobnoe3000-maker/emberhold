// core.js — the headless simulation. Fixed 20 Hz tick, commands in, events out.
// Zero DOM, zero renderer imports. `node smoke-test.mjs` runs this file happily.
//
// The world is one dungeon level; descending the stairs regenerates it deeper
// (harder). Everything the world can't re-derive from (seed, depth) lives in the
// snapshot: player, counters, the mods/HP overlay, and the discovered-room fog.

import { createWorld, isWalkable, hitResource, heightAt, propAt, CONSUMABLE_PROP } from './world.js';
import { createBus, createCommandQueue } from './bus.js';

export const TICK_HZ = 20;
export const TICK_DT = 1 / TICK_HZ;

const PLAYER_SPEED = 5.8;     // tiles / second
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

export function createSim(seed, theme) {
  const baseSeed = seed >>> 0;
  const override = theme;                                  // fixed theme (preview) or undefined
  const levelSeed = (d) => (baseSeed ^ Math.imul(d >>> 0, 2654435761)) >>> 0;
  const buildWorld = (d) => createWorld(levelSeed(d), override, d);

  let world = buildWorld(0);
  const bus = createBus();
  const commands = createCommandQueue();

  const spawn = findSpawn(world);
  const state = {
    t: 0, depth: 0,
    player: {
      x: spawn.x, y: spawn.y, px: spawn.x, py: spawn.y,
      dir: 'down', mirror: false, moving: false, frame: 0, frameAcc: 0,
    },
    counters: { wood: 0, stone: 0 },
  };

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

  function face(p, dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) { p.dir = 'side'; p.mirror = dx < 0; }
    else p.dir = dy < 0 ? 'up' : 'down';
  }

  // Regenerate the world one level deeper and drop the hero at the new entrance.
  // Inventory (counters) carries; the per-level overlay + fog reset with the world.
  function descend() {
    state.depth += 1;
    world = buildWorld(state.depth);
    const s = findSpawn(world);
    const p = state.player;
    p.x = p.px = s.x; p.y = p.py = s.y; p.moving = false; p.frame = 0; p.frameAcc = 0;
    bus.emit('levelChanged', { depth: state.depth, theme: world.theme });
  }

  function applyCommand(cmd) {
    const p = state.player;
    if (cmd.type === 'move') {
      const len = Math.hypot(cmd.x, cmd.y);
      if (len < 0.12) { p.moving = false; return; }
      const nx = cmd.x / Math.max(1, len), ny = cmd.y / Math.max(1, len);
      tryMove(p, nx * PLAYER_SPEED * TICK_DT, ny * PLAYER_SPEED * TICK_DT);
      p.moving = true;
      face(p, cmd.x, cmd.y);
      return;
    }
    if (cmd.type === 'harvest') {                          // tap-to-interact
      const dx = cmd.tx + 0.5 - p.x, dy = cmd.ty + 0.5 - p.y;
      const inReach = Math.max(Math.abs(dx), Math.abs(dy)) <= REACH;
      const prop = propAt(world, cmd.tx, cmd.ty);
      if (prop) {
        if (!inReach) { bus.emit('outOfReach', { tx: cmd.tx, ty: cmd.ty }); return; }
        face(p, dx, dy);
        if (prop === 'stairs') { bus.emit('descend', { depth: state.depth + 1 }); descend(); return; }
        if (CONSUMABLE_PROP.has(prop)) {
          world.mods.set(cmd.tx + ',' + cmd.ty, { opened: true });
          if (prop === 'chest') { state.counters.wood += 4 + state.depth; state.counters.stone += 3 + state.depth; }
          else { state.counters.wood += 2; state.counters.stone += 2; }
          bus.emit('looted', { tx: cmd.tx, ty: cmd.ty, kind: prop });
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

  // Reveal rooms the hero has entered or drawn near (minimap fog of war).
  function updateDiscovery() {
    const p = state.player;
    for (const r of world.level.rooms) {
      if (world.discovered.has(r.id)) continue;
      const dx = Math.max(Math.abs(p.x - r.cx) - r.rw, 0), dy = Math.max(Math.abs(p.y - r.cy) - r.rh, 0);
      if (dx * dx + dy * dy <= 36) world.discovered.add(r.id);       // within ~6 tiles of the room
    }
  }

  function tick() {
    const p = state.player;
    p.px = p.x; p.py = p.y;
    p.moving = false;
    for (const cmd of commands.drain()) applyCommand(cmd);
    if (p.moving) {
      p.frameAcc += TICK_DT;
      if (p.frameAcc >= 1 / 8) { p.frameAcc -= 1 / 8; p.frame = (p.frame + 1) % 4; }
    } else { p.frame = 0; p.frameAcc = 0; }
    updateDiscovery();
    state.t += TICK_DT;
  }

  function snapshot() {
    const p = state.player;
    return {
      seed: baseSeed, depth: state.depth, t: state.t,
      player: { x: p.x, y: p.y, dir: p.dir, mirror: p.mirror },
      counters: { ...state.counters },
      mods: [...world.mods.entries()],   // [ "x,y", {cleared}|{opened} ]
      hp: [...world.hp.entries()],
      discovered: [...world.discovered],
    };
  }

  function restore(data) {
    state.t = data.t ?? 0;
    state.depth = data.depth ?? 0;
    world = buildWorld(state.depth);                       // rebuild the saved level
    const p = state.player;
    p.x = p.px = data.player.x; p.y = p.py = data.player.y;
    if (!isWalkable(world, p.x, p.y)) { const s = findSpawn(world); p.x = p.px = s.x; p.y = p.py = s.y; }
    p.dir = data.player.dir ?? 'down';
    p.mirror = !!data.player.mirror;
    p.moving = false; p.frame = 0; p.frameAcc = 0;
    state.counters.wood = data.counters?.wood ?? 0;
    state.counters.stone = data.counters?.stone ?? 0;
    world.mods.clear();
    for (const e of data.mods ?? []) Array.isArray(e) ? world.mods.set(e[0], e[1]) : world.mods.set(e, { cleared: true });
    world.hp.clear();
    for (const [k, n] of data.hp ?? []) world.hp.set(k, n);
    world.discovered.clear();
    for (const id of data.discovered ?? []) world.discovered.add(id);
    bus.emit('levelChanged', { depth: state.depth, theme: world.theme });   // renderer resets caches
    bus.emit('countersChanged', { ...state.counters });
  }

  return { state, bus, commands, tick, snapshot, restore, seed: baseSeed, get world() { return world; } };
}
