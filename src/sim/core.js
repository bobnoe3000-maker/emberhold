// core.js — the headless simulation. Fixed 20 Hz tick, commands in, events out.
// Zero DOM, zero renderer imports. `node smoke-test.mjs` runs this file happily.

import { createWorld, isWalkable, hitResource } from './world.js';
import { createBus, createCommandQueue } from './bus.js';

export const TICK_HZ = 20;
export const TICK_DT = 1 / TICK_HZ;

const PLAYER_SPEED = 4.6;     // tiles / second
const PLAYER_RADIUS = 0.32;   // collision radius in tiles
const REACH = 1.6;            // harvest reach (chebyshev-ish, in tiles)

export function createSim(seed) {
  const world = createWorld(seed);
  const bus = createBus();
  const commands = createCommandQueue();

  // Find a walkable spawn near origin.
  let sx = 0, sy = 0;
  outer: for (let r = 0; r < 64; r++) {
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (isWalkable(world, dx + 0.5, dy + 0.5)) { sx = dx + 0.5; sy = dy + 0.5; break outer; }
    }
  }

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
    // per-axis slide with a small radius probe
    const probe = (nx, ny) =>
      isWalkable(world, nx - PLAYER_RADIUS, ny - PLAYER_RADIUS) &&
      isWalkable(world, nx + PLAYER_RADIUS, ny - PLAYER_RADIUS) &&
      isWalkable(world, nx - PLAYER_RADIUS, ny + PLAYER_RADIUS) &&
      isWalkable(world, nx + PLAYER_RADIUS, ny + PLAYER_RADIUS);
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

  return { state, world, bus, commands, tick };
}
