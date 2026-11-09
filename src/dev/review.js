// @ts-check
// review.js — the art review's icons and faces (docs/art-review.md): dev only, `?dev&scene=stage&show=icons|faces`
// (localhost: main.js), every item icon and every portrait and character-window figure as the UI shows them, at the UI's
// sizes, on one page (tools/capture/stage.mjs takes a sheet of it).
//   show=icons   every item icon (assets/items) by base, at the bag's size and three times it, with its slot and name
//   show=faces   every portrait and character-window figure (assets/actors/<actor>.face.png, .fig.png)
//   match=…      only those whose id holds it · panel=0 hides the panel (captures)
// The Stage's cast lineup and its env, props and fx views drew through Emberlit's painting, and were retired with it
// (docs/luminati-only-cleanup.md step 4; the owner, 2026-11-09). Nothing here touches the sim or the renderer.

import { BASES } from '../sim/items.js';

const SHOWS = ['icons', 'faces'];
/** who a window shows: the party and the townsfolk (party cards, the sheet, dialogue), by atlas id */
const CAST = [
  ['party', 'hero_knight', 'Knight'], ['party', 'hero_barbarian', 'Barbarian'], ['party', 'hero_rogue', 'Rogue'],
  ['party', 'hero_rogue_bow', 'Bow'], ['party', 'hero_rogue_longbow', 'Longbow'], ['party', 'hero_rogue_xbow', 'Crossbow'],   // (the rogue's ranged looks)
  ['party', 'hero_rogue_hxbow', 'Hand xbow'], ['party', 'hero_mage', 'Mage'], ['party', 'hero_cleric', 'Cleric'], ['party', 'hero_shaman', 'Shaman'], ['party', 'hero_brannoc', 'Brannoc'],
  ['party', 'hero_wren', 'Wren'],   // (M8, Act II: the Fens' found companion)
  ['party', 'hero_wren_bow', 'Wren bow'], ['party', 'hero_wren_longbow', 'Wren long'], ['party', 'hero_wren_xbow', 'Wren xbow'], ['party', 'hero_wren_hxbow', 'Wren hxbow'],   // (her ranged looks)
  ['town', 'npc_maudry', 'Maudry'], ['town', 'npc_osric', 'Osric'], ['town', 'npc_ilse', 'Ilse'], ['town', 'npc_wendel', 'Wendel'], ['town', 'npc_bess', 'Bess'],
  ['town', 'npc_col', 'Col'], ['town', 'npc_jory', 'Jory'], ['town', 'npc_nell', 'Nell'], ['town', 'npc_hedda', 'Hedda'],
  ['town', 'npc_dace', 'Dace'], ['town', 'npc_pim', 'Pim'], ['town', 'npc_orla', 'Orla'], ['town', 'npc_agnes', 'Agnes'], ['town', 'npc_kindler', 'Kindler'],   // (Saltmere's, and the Kindler)
  ['town', 'npc_tobin', 'Tobin'], ['town', 'npc_ned', 'Ned'], ['town', 'npc_hester', 'Hester'],   // (v1.48: by the Vale's dungeons' ways in)
];

/** @param {{ params: URLSearchParams }} o @returns {{ total: number, of: number, ready: boolean }} */
export function createReview({ params }) {
  const P = (k, d) => params.get(k) ?? d;
  const show = SHOWS.includes(P('show', 'icons')) ? P('show', 'icons') : 'icons', match = P('match', '');
  const showPanel = P('panel', '1') !== '0', panelH = 64;
  const st = { total: 0, of: 0, ready: false };
  const WINDOWED = CAST.filter((c) => !/_(bow|longbow|xbow|hxbow)$/.test(c[1]));
  const box = document.createElement('div'); box.id = 'reviewGrid';
  const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  if (show === 'icons') {
    const icons = new Map(); for (const [id, b] of Object.entries(BASES)) { const k = b.icon || id; if (!icons.has(k)) icons.set(k, []); icons.get(k).push({ id, b }); }
    box.innerHTML = [...icons].filter(([k]) => !match || k.includes(match)).map(([k, uses]) => `<figure><div class="pair"><img src="./assets/items/${esc(k)}.png" width="40" height="40" alt=""><img src="./assets/items/${esc(k)}.png" width="120" height="120" alt=""></div><figcaption><b>${esc(k)}</b> · ${esc(uses[0].b.slot || '')}<br>${esc(uses.map((u) => u.b.name || u.id).join(', '))}</figcaption></figure>`).join('');
  } else {
    // the windows show the party and the townsfolk (party cards, the sheet, dialogue); foes never sit in a window,
    // and the rogue's ranged looks are the renderer's alone (renderer.js RANGED_LOOK): a window shows hero_rogue
    box.innerHTML = `<p style="grid-column:1/-1;margin:0">Every face and figure a window shows: the party and the townsfolk. Foes and the rogue's ranged looks have none, by design.</p>`
      + WINDOWED.filter((c) => !match || c[1].includes(match)).map((c) => `<figure><div class="pair"><img src="./assets/actors/${esc(c[1])}.face.png" width="48" height="56" alt="" onerror="this.replaceWith(Object.assign(document.createElement('i'),{textContent:'no face'}))"><img src="./assets/actors/${esc(c[1])}.fig.png" width="176" height="204" alt="" onerror="this.replaceWith(Object.assign(document.createElement('i'),{textContent:'no figure'}))"></div><figcaption><b>${esc(c[2])}</b> · ${esc(c[1])}</figcaption></figure>`).join('');
  }
  document.body.appendChild(box);
  st.total = box.querySelectorAll('figure').length; st.of = show === 'icons' ? new Set(Object.entries(BASES).map(([id, b]) => b.icon || id)).size : WINDOWED.length;

  st.ready = true;

  // ── the page: no HUD; the panel (show, match) ──
  document.body.classList.add('stage');
  const css = document.createElement('style');
  css.textContent = `body.stage > *:not(#stagePanel):not(#reviewGrid) { display: none !important; }
#stagePanel { position: fixed; left: 6px; right: 6px; top: 6px; z-index: 20; display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; padding: 6px 8px;
  background: rgba(16,12,22,.92); border: 1px solid rgba(214,170,98,.4); border-radius: 10px; font: 11px ui-monospace, Menlo, monospace; color: #cbbfae; }
#stagePanel b { color: #f0c880; font: 600 13px Georgia, serif; margin-right: 4px; }
#stagePanel label { display: flex; gap: 3px; align-items: center; }
#stagePanel select, #stagePanel input { min-height: 44px; background: #221c2c; color: #efe4cf; border: 1px solid #3a3444; border-radius: 6px; font: inherit; }
#stagePanel input { width: 7em; }
#reviewGrid { position: fixed; inset: ${showPanel ? panelH : 8}px 8px 8px; z-index: 10; overflow: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(${show === 'faces' ? 260 : 190}px, 1fr)); gap: 10px;
  background: #15121b; color: #cbbfae; font: 11px ui-monospace, Menlo, monospace; padding: 8px; }
#reviewGrid figure { margin: 0; padding: 8px; background: #1e1926; border: 1px solid #332b3d; border-radius: 8px; }
#reviewGrid .pair { display: flex; gap: 10px; align-items: flex-end; } #reviewGrid img { image-rendering: auto; background: #2a2333; border-radius: 4px; }
#reviewGrid figcaption { margin-top: 6px; line-height: 1.4; } #reviewGrid b { color: #f0c880; }`;
  document.head.appendChild(css);
  if (showPanel) {
    const panel = document.createElement('div'); panel.id = 'stagePanel';
    panel.innerHTML = `<b>Review</b><label>show<select data-k="show">${SHOWS.map((v) => `<option${v === show ? ' selected' : ''}>${v}</option>`).join('')}</select></label>`
      + `<label>match<input data-k="match" value="${match.replace(/"/g, '')}"></label>`;
    panel.addEventListener('change', (e) => { const t = /** @type {HTMLInputElement} */ (e.target), q = new URLSearchParams(location.search); if (t.value) q.set(t.dataset.k || '', t.value); else q.delete(t.dataset.k || ''); location.search = q.toString(); });
    document.body.appendChild(panel);
  }
  return st;
}
