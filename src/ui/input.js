// input.js — one thumb, two verbs.
// Drag anywhere = floating joystick (move). Quick tap = context interact (harvest).
// Emits nothing itself; main.js reads state each tick and pushes commands.

const TAP_MS = 220;
const TAP_SLOP = 11;        // px of movement allowed before it's a drag
const STICK_MAX = 32;       // knob travel to full speed (smaller = more responsive)

export function createInput(canvas) {
  let active = null;        // { id, bx, by, kx, ky, t0, moved }
  let tapHandler = null;

  const vec = { x: 0, y: 0 };

  function down(e) {
    if (active) return;
    const t = e.changedTouches ? e.changedTouches[0] : e;
    active = { id: t.identifier ?? 'mouse', bx: t.clientX, by: t.clientY, kx: t.clientX, ky: t.clientY, t0: performance.now(), moved: false };
    e.preventDefault();
  }
  function move(e) {
    if (!active) return;
    const t = pick(e);
    if (!t) return;
    const dx = t.clientX - active.bx, dy = t.clientY - active.by;
    if (Math.hypot(dx, dy) > TAP_SLOP) active.moved = true;
    if (active.moved) {
      const len = Math.hypot(dx, dy) || 1;
      const clamped = Math.min(len, STICK_MAX);
      active.kx = active.bx + (dx / len) * clamped;
      active.ky = active.by + (dy / len) * clamped;
      vec.x = (dx / len) * (clamped / STICK_MAX);
      vec.y = (dy / len) * (clamped / STICK_MAX);
    }
    e.preventDefault();
  }
  function up(e) {
    if (!active) return;
    const t = pick(e);
    if (!t) return;
    const quick = performance.now() - active.t0 < TAP_MS;
    if (!active.moved && quick && tapHandler) tapHandler(active.bx, active.by);
    active = null;
    vec.x = 0; vec.y = 0;
    e.preventDefault();
  }
  function pick(e) {
    if (!e.changedTouches) return e;
    for (const t of e.changedTouches) if (t.identifier === active.id) return t;
    return null;
  }

  canvas.addEventListener('touchstart', down, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', up, { passive: false });
  canvas.addEventListener('touchcancel', up, { passive: false });
  canvas.addEventListener('mousedown', down);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);

  return {
    vec: () => (active && active.moved ? vec : null),
    joystick: () => {
      if (!active || !active.moved) return null;
      const dpr = canvas.width / window.innerWidth;
      return { bx: active.bx * dpr, by: active.by * dpr, kx: active.kx * dpr, ky: active.ky * dpr };
    },
    onTap(fn) { tapHandler = fn; },
  };
}
