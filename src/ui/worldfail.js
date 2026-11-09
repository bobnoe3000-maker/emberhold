// @ts-check
// worldfail.js — when Luminati can't draw the world (docs/luminati-only-cleanup.md step 1; the owner, 2026-11-09: a
// message and a Retry, no hidden fallback). Luminati is the only renderer now, so a failed start (no WebGL2, a phone out
// of memory, its module not loading) or a level it couldn't build left a black world and a line in the console. This
// says so over the screen, with what went wrong in small print for a bug report, and Retry, which saves the slot and
// reloads (the caller's `retry`). Presentation only; it swallows the taps under it.

/** @param {{ retry: () => void | Promise<void> }} o @returns {{ show: (why: string) => void, readonly shown: boolean }} */
export function createWorldFail({ retry }) {
  let el = /** @type {HTMLDivElement | null} */ (null);
  return {
    show(why) {
      if (el) return;
      el = document.createElement('div');
      el.id = 'worldFail';
      el.setAttribute('role', 'alertdialog');
      el.style.cssText = 'position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;'
        + 'padding:24px calc(24px + env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) calc(24px + env(safe-area-inset-left));'
        + 'background:rgba(8,6,12,0.94);color:#e8e4da;text-align:center;font:15px/1.45 system-ui,sans-serif;';
      const h = document.createElement('div'); h.textContent = 'The world couldn’t be drawn on this device.';
      h.style.cssText = 'font-size:18px;font-weight:700;max-width:320px;';
      const p = document.createElement('div'); p.textContent = 'Your game is safe. Retry reloads the page; closing other apps or tabs can help.';
      p.style.cssText = 'max-width:320px;color:#c8bca8;';
      const why2 = document.createElement('div'); why2.textContent = why;   // (text, never HTML: AGENTS.md A3)
      why2.style.cssText = 'max-width:320px;font:11px/1.4 ui-monospace,Menlo,monospace;color:#9a93a8;overflow-wrap:anywhere;';
      const b = document.createElement('button'); b.textContent = 'Retry';
      b.style.cssText = 'min-width:140px;min-height:48px;border-radius:10px;border:1px solid rgba(214,170,98,0.6);background:#2a2030;color:#f0c070;font-size:16px;font-weight:700;';
      b.addEventListener('click', () => { b.disabled = true; void retry(); });
      el.append(h, p, why2, b);
      for (const ev of ['pointerdown', 'touchstart', 'mousedown']) el.addEventListener(ev, (e) => e.stopPropagation());   // (the world under it never gets the tap)
      document.body.appendChild(el);
    },
    get shown() { return !!el; },
  };
}
