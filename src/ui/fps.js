// @ts-check
// fps.js — the frame rate on screen, for testing on the phone (the owner, 2026-11-09: "should we add a menu option to
// toggle on/off the frame rate so I can monitor?"). Off unless the menu's Graphics turns it on (render3d/settings.js,
// per device). A small chip under the ☰ button and the top bar: frames a second over the last half second, and the slowest frame's
// milliseconds, so a hitch shows even when the average is fine. Presentation only; it takes no taps.

const WINDOW_MS = 500;

/** @returns {{ frame: (now: number) => void, show: (on: boolean) => void, readonly on: boolean }} */
export function createFpsMeter() {
  const el = document.createElement('div');
  el.id = 'fpsMeter';
  el.setAttribute('aria-live', 'off');
  el.style.cssText = 'position:fixed;z-index:30;pointer-events:none;display:none;padding:2px 6px;border-radius:6px;'
    + 'background:rgba(16,12,22,0.72);border:1px solid rgba(214,170,98,0.3);font:600 11px/15px ui-monospace,Menlo,monospace;'
    + 'color:#e8e4da;letter-spacing:0.5px;white-space:nowrap;';
  document.body.appendChild(el);
  let on = false, t0 = 0, n = 0, last = 0, worst = 0;
  // under the ☰ button and the whole top bar (its third line, boons and Weakened as chips, comes and goes: placed again at
  // every reading), at the screen's left edge
  const place = () => {
    const b = document.getElementById('menuBtn')?.getBoundingClientRect(), l3 = document.getElementById('hudLine3'), r3 = l3 && l3.childElementCount ? l3.getBoundingClientRect() : null;
    el.style.left = `${Math.round(b ? b.left : 8)}px`;
    el.style.top = `${Math.round(Math.max(b ? b.bottom : 50, r3 ? r3.bottom : 0) + 6)}px`;
  };
  addEventListener('resize', () => { if (on) place(); });
  return {
    frame(now) {
      if (!on) return;
      if (last) worst = Math.max(worst, now - last);
      last = now; n++;
      if (!t0) { t0 = now; return; }
      if (now - t0 < WINDOW_MS) return;
      const fps = Math.round((n * 1000) / (now - t0));
      // the colour follows the number, which says it in words too (no information by colour alone: AGENTS.md A3)
      el.style.color = fps >= 55 ? '#9fe08a' : fps >= 30 ? '#f0c060' : '#ff8a70';
      el.textContent = `${fps} fps · ${Math.round(worst)} ms`; place();
      t0 = now; n = 0; worst = 0;
    },
    show(v) {
      on = !!v; el.style.display = on ? 'block' : 'none';
      t0 = 0; n = 0; last = 0; worst = 0;
      if (on) { el.textContent = '… fps'; place(); }
    },
    get on() { return on; },
  };
}
