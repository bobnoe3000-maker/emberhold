// bus.js — the only way layers talk.
// Input layer  → pushes COMMANDS  → sim consumes at tick boundaries.
// Sim          → emits EVENTS     → render/ui react.
// This seam is what makes the sim headless (testable in node, portable to a Colyseus room).

export function createBus() {
  const handlers = new Map();
  // Quiet (offline progress, ui/away.js): while the time away is fast-forwarded, only the listeners there were at
  // seal() — the sim's own (quests count waves, core pays a boss's drop: rules) and the catch-up's collector — hear
  // events, besides those named in `loud` (a scene change, which the renderer must follow). Presentation sits out
  // hours of fighting and is refreshed once at the end. The sim never registers a listener after it's made, so quiet
  // changes nothing the sim does (test/away.test.mjs).
  let core = null, quiet = false;
  const loud = new Set(['levelChanged']);
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
      if (arr) for (const fn of arr) { if (quiet && core && !core.has(fn) && !loud.has(type)) continue; fn(payload); }
    },
    /** the listeners so far are the ones that hear everything, even when quiet */
    seal() { core = new Set(); for (const arr of handlers.values()) for (const fn of arr) core.add(fn); },
    get quiet() { return quiet; },
    set quiet(v) { quiet = !!v; },
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
