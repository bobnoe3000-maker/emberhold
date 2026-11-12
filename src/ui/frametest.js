// @ts-check
// frametest.js (ui) — the menu's Frame test on screen (render3d/frametest.js does the measuring): while it runs, a line at
// the top says which piece of the picture is off and how far along it is (the world stays in view, untouched: the
// line takes no taps); then a card with each piece's frame time, what turning it off saved, and a Copy button to paste
// the table into a message. Text renders as text.

import { runFrameTest, frameTestText } from '../render3d/frametest.js';

const CSS = `
#ftLine { position: fixed; left: 50%; transform: translateX(-50%); top: calc(env(safe-area-inset-top, 0px) + 8px); z-index: 40; pointer-events: none;
  padding: 6px 12px; border-radius: 10px; background: rgba(16,12,22,0.9); border: 1px solid rgba(214,170,98,0.45); color: #efe4cf;
  font: 12px/1.4 ui-monospace, Menlo, monospace; white-space: nowrap; max-width: calc(100vw - 24px); overflow: hidden; text-overflow: ellipsis; }
#ftWrap { position: fixed; inset: 0; z-index: 40; background: rgba(6,4,10,.62); display: flex; align-items: flex-end; justify-content: center; }
#ftCard { width: 100%; max-width: 480px; max-height: 86vh; overflow-y: auto; background: #100c16; border-top: 1px solid rgba(214,170,98,0.45);
  border-radius: 16px 16px 0 0; padding: 14px 14px calc(env(safe-area-inset-bottom, 0px) + 16px); color: #efe4cf; font: 12px/1.45 ui-monospace, Menlo, monospace; }
#ftCard h2 { font: 600 19px Georgia, serif; color: #f0c880; margin: 0 0 4px; }
#ftCard .about { color: #978c80; font-size: 11px; margin-bottom: 10px; }
#ftCard table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
#ftCard td { padding: 6px 4px; border-bottom: 1px solid #2c2838; }
#ftCard td.n { text-align: right; white-space: nowrap; }
#ftCard tr.base td { color: #f0c880; }
#ftCard td.js { color: #b8ac98; }
#ftCard .saves { color: #8fe07a; }
#ftCard .costs { color: #ff8a7a; }
#ftCard .acts { display: flex; gap: 8px; margin-top: 12px; }
#ftCard button { flex: 1; min-height: 44px; border-radius: 8px; border: 1px solid rgba(214,170,98,0.45); background: none; color: #f0c880;
  font: 12px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; }
`;

/** @param {{ world: () => any, graphics: () => { dof: string, res: string }, where: () => string }} o */
export function createFrameTest(o) {
  let running = false;
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  const swallow = (e) => e.stopPropagation();

  function card(r, where) {
    const wrap = el('div'); wrap.id = 'ftWrap';
    for (const k of ['pointerdown', 'touchstart', 'mousedown']) wrap.addEventListener(k, swallow);
    const c = el('div'); c.id = 'ftCard'; wrap.appendChild(c);
    c.appendChild(el('h2', '', 'Frame test'));
    c.appendChild(el('div', 'about', `${where} · ${r.about} · the mean frame time and the share of frames at 60 fps (Copy has the median and the JavaScript's share)`));
    const base = (r.rows[0].mean + r.rows[r.rows.length - 1].mean) / 2, t = el('table');
    for (const x of r.rows) {
      const tr = el('tr', x.id.startsWith('base') ? 'base' : ''), d = base - x.mean;
      tr.appendChild(el('td', '', x.label));
      tr.appendChild(el('td', 'n', x.frames ? `${x.mean.toFixed(1)} ms` : 'no frames'));
      tr.appendChild(el('td', 'n', `${x.fps.toFixed(0)} fps`));
      tr.appendChild(el('td', 'n js', `${Math.round(x.at60 * 100)} % at 60`));
      // saved or cost, in words as well as colour (AGENTS.md A3)
      tr.appendChild(el('td', 'n ' + (x.id.startsWith('base') ? '' : d >= 0.5 ? 'saves' : d <= -0.5 ? 'costs' : ''), x.id.startsWith('base') ? '' : `${d >= 0 ? 'saves' : 'adds'} ${Math.abs(d).toFixed(1)}`));
      t.appendChild(tr);
    }
    c.appendChild(t);
    const acts = el('div', 'acts'), copy = el('button', '', 'Copy'), close = el('button', '', 'Close');
    copy.addEventListener('click', async () => { try { await navigator.clipboard.writeText(frameTestText(r, where)); copy.textContent = 'Copied'; } catch { copy.textContent = 'Copy failed'; } });
    close.addEventListener('click', () => wrap.remove());
    acts.append(copy, close); c.appendChild(acts);
    document.body.appendChild(wrap);
  }

  return {
    get running() { return running; },
    /** run it on the world in view (the menu closed first: the world fills the screen while it's timed) */
    async run() {
      const w = o.world(); if (!w || running) return false;
      running = true;
      const line = el('div'); line.id = 'ftLine'; document.body.appendChild(line);
      const where = o.where();
      try {
        // (?frametest=all: every piece of the picture; else the question open now: render3d/frametest.js variants)
        const set = new URLSearchParams(location.search).get('frametest') === 'all' ? 'all' : 'focus';
        const r = await runFrameTest(w, o.graphics(), (i, n, label) => { line.textContent = `Frame test ${i + 1}/${n} · ${label} · hands off`; }, set);
        card(r, where);
      } catch (err) {
        line.textContent = `Frame test stopped: ${err && err.message ? err.message : err}`; await new Promise((ok) => setTimeout(ok, 4000));
      } finally { line.remove(); running = false; }
      return true;
    },
  };
}
