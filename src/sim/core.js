// core.js — the headless simulation. Fixed 20 Hz tick, commands in, events out.
// Zero DOM, zero renderer imports. `node smoke-test.mjs` runs this file happily.

import { createWorld, isWalkable, hitResource, heightAt } from './world.js';
import { createBus, createCommandQueue } from './bus.js';

export const TICK_HZ = 20;
export const TICK_DT = 1 / TICK_HZ;

const PLAYER_SPEED = 4.6;     // tiles / second
const PLAYER_RADIUS = 0.32;   // collision radius in tiles
const REACH = 1.6;            // harvest reach (chebyshev-ish, in tiles)

// The level's entrance point, snapped to the nearest walkable tile. Used both at
// fresh spawn and as the relocation target when a restored position is off-floor
// (e.g. a save written against an older world model — never strand the player).
function findSpawn(world) {
  if (isWalkable(world, world.spawn.x, world.spawn.y)) return { x: world.spawn.x, y: world.spawn.y };
  const bx = Math.floor(world.spawn.x), by = Math.floor(world.spawn.y);
  for (let r = 1; r < 48; r++)
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const nx = bx + dx + 0.5, ny = by + dy + 0.5;
      if (isWalkable(world, nx, ny)) return { x: nx, y: ny };
    }
  return { x: world.spawn.x, y: world.spawn.y };
}

export function createSim(seed, theme) {
  const world = createWorld(seed, theme);
  const bus = createBus();
  const commands = createCommandQueue();

  const spawn = findSpawn(world);
  let sx = spawn.x, sy = spawn.y;

  const state = {
    t: 0,
    player: {
      x: sx, y: sy,          // current (tile units)
      px: sx, py: sy,        // previous tick (for render interpolation)
      dir: 'down', mirror: false,
      moving: false, frame: 0, frameAcc: 0,
    },
    counters: { wood: 0, stone: 0 },
  };

  function tryMove(p, dx, dy) {
    // per-axis slide with a small radius probe. cz = the mover's current tile
    // elevation, so the walk rule blocks stepping onto a different height (cliff).
    const cz = heightAt(world, Math.floor(p.x), Math.floor(p.y));
    const probe = (nx, ny) =>
      isWalkable(world, nx - PLAYER_RADIUS, ny - PLAYER_RADIUS, cz) &&
      isWalkable(world, nx + PLAYER_RADIUS, ny - PLAYER_RADIUS, cz) &&
      isWalkable(world, nx - PLAYER_RADIUS, ny + PLAYER_RADIUS, cz) &&
      isWalkable(world, nx + PLAYER_RADIUS, ny + PLAYER_RADIUS, cz);
    if (probe(p.x + dx, p.y)) p.x += dx;
    if (probe(p.x, p.y + dy)) p.y += dy;
  }

  function applyCommand(cmd) {
    const p = state.player;
    if (cmd.type === 'move') {
      const len = Math.hypot(cmd.x, cmd.y);
      if (len < 0.12) { p.moving = false; return; }
      const nx = cmd.x / Math.max(1, len), ny = cmd.y / Math.max(1, len);
      tryMove(p, nx * PLAYER_SPEED * TICK_DT, ny * PLAYER_SPEED * TICK_DT);
      p.moving = true;
      // facing: dominant axis wins
      if (Math.abs(cmd.x) > Math.abs(cmd.y)) { p.dir = 'side'; p.mirror = cmd.x < 0; }
      else { p.dir = cmd.y < 0 ? 'up' : 'down'; }
    }
    if (cmd.type === 'harvest') {
      const dx = cmd.tx + 0.5 - p.x, dy = cmd.ty + 0.5 - p.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > REACH) {
        bus.emit('outOfReach', { tx: cmd.tx, ty: cmd.ty });
        return;
      }
      const hit = hitResource(world, cmd.tx, cmd.ty);
      if (!hit) return;
      // face the thing you hit
      if (Math.abs(dx) > Math.abs(dy)) { p.dir = 'side'; p.mirror = dx < 0; }
      else p.dir = dy < 0 ? 'up' : 'down';
      bus.emit('hit', { tx: cmd.tx, ty: cmd.ty, kind: hit.kind, destroyed: hit.destroyed });
      if (hit.destroyed) {
        if (hit.kind === 'tree') state.counters.wood += 3;
        if (hit.kind === 'rock') state.counters.stone += 2;
        bus.emit('harvested', { tx: cmd.tx, ty: cmd.ty, kind: hit.kind });
        bus.emit('countersChanged', { ...state.counters });
      }
    }
  }

  function tick() {
    const p = state.player;
    p.px = p.x; p.py = p.y;
    p.moving = false;                      // move commands re-assert each tick
    for (const cmd of commands.drain()) applyCommand(cmd);
    // walk animation clock
    if (p.moving) {
      p.frameAcc += TICK_DT;
      if (p.frameAcc >= 1 / 8) { p.frameAcc -= 1 / 8; p.frame = (p.frame + 1) % 4; }
    } else { p.frame = 0; p.frameAcc = 0; }
    state.t += TICK_DT;
  }

  // ---- persistence seam ----
  // The sim owns its serialized shape; /persist handles storage + versioning.
  // Everything the world can't re-derive from the seed lives here: player
  // position, counters, the sim clock, and the resource mods/HP overlay.
  function snapshot() {
    const p = state.player;
    return {
      seed: world.seed,
      t: state.t,
      player: { x: p.x, y: p.y, dir: p.dir, mirror: p.mirror },
      counters: { ...state.counters },
      mods: [...world.mods.keys()],      // every value is {cleared:true}; keys rebuild it
      hp: [...world.hp.entries()],       // ["x,y", hitsLeft] — partial harvest progress
    };
  }

  function restore(data) {
    state.t = data.t ?? 0;
    const p = state.player;
    p.x = p.px = data.player.x;
    p.y = p.py = data.player.y;
    if (!isWalkable(world, p.x, p.y)) { const s = findSpawn(world); p.x = p.px = s.x; p.y = p.py = s.y; }
    p.dir = data.player.dir ?? 'down';
    p.mirror = !!data.player.mirror;
    p.moving = false; p.frame = 0; p.frameAcc = 0;
    state.counters.wood = data.counters?.wood ?? 0;
    state.counters.stone = data.counters?.stone ?? 0;
    world.mods.clear();
    for (const k of data.mods ?? []) world.mods.set(k, { cleared: true });
    world.hp.clear();
    for (const [k, n] of data.hp ?? []) world.hp.set(k, n);
    bus.emit('countersChanged', { ...state.counters });   // resync any HUD listeners
  }

  return { state, world, bus, commands, tick, snapshot, restore };
}
