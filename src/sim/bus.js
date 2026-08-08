// bus.js — the only way layers talk.
// Input layer  → pushes COMMANDS  → sim consumes at tick boundaries.
// Sim          → emits EVENTS     → render/ui react.
// This seam is what makes the sim headless (testable in node, portable to a Colyseus room).

export function createBus() {
  const handlers = new Map();
  return {
    on(type, fn) {
      if (!handlers.has(type)) handlers.set(type, []);
      handlers.get(type).push(fn);
      return () => {
        const arr = handlers.get(type);
        const i = arr.indexOf(fn);
        if (i >= 0) arr.splice(i, 1);
      };
    },
    emit(type, payload) {
      const arr = handlers.get(type);
      if (arr) for (const fn of arr) fn(payload);
    },
  };
}

export function createCommandQueue() {
  let q = [];
  return {
    push(cmd) { q.push(cmd); },
    drain() { const out = q; q = []; return out; },
  };
}

// Command shapes (documentation, not enforcement — keep it lean at phase 0):
//   { type: 'move',    x, y }        // unit-ish vector from joystick, applied this tick
//   { type: 'harvest', tx, ty }      // tap on a resource tile
