// @ts-check
// stage.js — the Stage (docs/character-stage-proposal.md): a dev-only lineup page for clean character
// captures. `?dev&scene=stage` (localhost only: main.js) builds a flat field (sim outdoor.js buildStage)
// and this module stands the game's figures on it in labelled rows, each on its own spot, none
// overlapping, every one playing the same clip in place. They're drawn through the real renderer
// (renderer.setStage): the same stamping, light, outline, upscale and weapon effects as in play, so a
// capture here is what a player sees, without the world in front of it.
//
// URL parameters (the panel at the top writes them and reloads):
//   group  party · town · foes · bosses · all, or actor ids separated by commas      (default party)
//   clip   idle · walk · attack · attack2 · heavy · hit · death · fidget · look · sit · spawn   (idle)
//   dir    0–7 (0 = east, 1 = south-east toward the camera, … clockwise) · turn (a facing a second)
//          · all (each figure in all 8 facings, a row each)                                    (1)
//   tod    dawn · day · dusk · night (main.js holds the light)                                (dusk)
//   floor  grass · cobble (sim buildStage)                                                     (grass)
//   zoom   1 (in-game) · 2 · 3                                                                 (1)
//   cmp    a path prefix serving another checkout, e.g. /before/: each figure gets a twin from
//          that checkout's atlases on its left (before · after)
//   speed  tiles a second for walk (the figure's own game speed by default)
//   space  spacing × (for a prototype bake of bigger figures) · labels 0 to hide the names · panel 0 to hide the panel (captures)
// Nothing here touches the sim: the Stage only reads the stage world to place figures, and keeps each
// figure's playback state on its own objects.

import { unproject } from '../render/iso.js';

/** who's who: atlas, name, kind (the renderer's stride family) and the game speed of their walk */
const CAST = [
  ['party', 'hero_knight', 'Knight'], ['party', 'hero_barbarian', 'Barbarian'], ['party', 'hero_rogue', 'Rogue'],
  ['party', 'hero_rogue_bow', 'Bow'], ['party', 'hero_rogue_longbow', 'Longbow'], ['party', 'hero_rogue_xbow', 'Crossbow'],   // (the rogue's ranged looks)
  ['party', 'hero_rogue_hxbow', 'Hand xbow'], ['party', 'hero_mage', 'Mage'], ['party', 'hero_cleric', 'Cleric'], ['party', 'hero_shaman', 'Shaman'], ['party', 'hero_brannoc', 'Brannoc'],
  ['town', 'npc_maudry', 'Maudry'], ['town', 'npc_osric', 'Osric'], ['town', 'npc_ilse', 'Ilse'], ['town', 'npc_wendel', 'Wendel'], ['town', 'npc_bess', 'Bess'],
  ['town', 'npc_col', 'Col'], ['town', 'npc_jory', 'Jory'], ['town', 'npc_nell', 'Nell'], ['town', 'npc_hedda', 'Hedda'],
  ['foes', 'skeleton_warrior', 'Warrior'], ['foes', 'skeleton_minion', 'Minion'], ['foes', 'skeleton_rogue', 'Archer'], ['foes', 'skeleton_mage', 'Mage'],
  ['foes', 'redhand_cutthroat', 'Cutthroat'], ['foes', 'redhand_brute', 'Brute'], ['foes', 'redhand_crossbow', 'Crossbow'], ['foes', 'cinder_acolyte', 'Acolyte'],
  ['foes', 'goblin_skirmisher', 'Goblin'], ['foes', 'goblin_bruiser', 'Bruiser'], ['foes', 'goblin_archer', 'Gob. archer'], ['foes', 'goblin_hexer', 'Hexer'],
  ['bosses', 'boss_garrow', 'Garrow'], ['bosses', 'boss_stranger', 'Stranger'], ['bosses', 'boss_standard', 'Standard'], ['bosses', 'boss_skarn', 'Skarn'],
];
const GROUP_NAME = { party: 'The party', town: 'Thornwick', foes: 'Foes', bosses: 'Bosses' };
const kindOf = (group, atlas) => (group === 'party' ? 'party' : /^skeleton_|boss_standard/.test(atlas) ? 'undead' : group === 'town' ? 'folk' : 'human');
const SPEED = { party: 8.8, folk: 1.6, human: 3.2, undead: 3.0 };             // tiles/s: the hero, an amble, the Redhand, the Ashbound
export const CLIPS = ['idle', 'walk', 'attack', 'attack2', 'heavy', 'hit', 'death', 'fidget', 'look', 'sit', 'spawn'];
const OPTS = { group: ['party', 'town', 'foes', 'bosses', 'all'], clip: CLIPS, dir: ['0', '1', '2', '3', '4', '5', '6', '7', 'turn', 'all'], tod: ['dawn', 'day', 'dusk', 'night'], floor: ['grass', 'cobble'], zoom: ['1', '2', '3'] };

// a screen octant (0 = east, clockwise) → a world-space facing; the inverse of anim.js's octant
const facing = (k) => { const a = (k * Math.PI) / 4, u = Math.cos(a), v = Math.sin(a); return { x: (u + v) / 2, y: (v - u) / 2 }; };

/** @param {{ renderer: any, sim: any, params: URLSearchParams }} o */
export function createStage({ renderer, sim, params }) {
  const P = (k, d) => params.get(k) ?? d;
  const zoom = Math.max(1, Math.min(3, Math.round(+P('zoom', '1')) || 1));
  renderer.setZoom(zoom);
  const clip = CLIPS.includes(P('clip', 'idle')) ? P('clip', 'idle') : 'idle', dirP = P('dir', '1'), cmp = P('cmp', ''), labels = P('labels', '1') !== '0';
  const speedP = +P('speed', '0');
  const g = P('group', 'party');
  const picked = g === 'all' ? CAST : OPTS.group.includes(g) ? CAST.filter((c) => c[0] === g) : CAST.filter((c) => g.split(',').includes(c[1]));
  const roots = cmp ? [cmp.replace(/\/?$/, '/') + 'assets/actors/', ''] : [''];
  const dirs = dirP === 'all' ? [0, 1, 2, 3, 4, 5, 6, 7] : [null];

  // ── layout, in native screen px from the camera's point, then onto the floor (iso unproject) ──
  const view = renderer.view, W = view.w - 8, anchorY = 0.47;                    // (camera(): the point sits 47 % down)
  const space = Math.max(0.5, Math.min(4, +P('space', '1') || 1));   // (bigger figures than the game's 56 px: a prototype bake)
  const cell = (c) => (dirP === 'all' ? 50 : 66) * (c[0] === 'bosses' ? 1.3 : 1) * space;
  const rows = [], heads = [];
  let y = 0, row = null, x = 0, lastGroup = null;
  const ROW_H = (c) => (c[0] === 'bosses' ? 124 : 100) * space;
  const newRow = (c) => { if (row) y += ROW_H(row.items[0].c); row = { y, items: [] }; rows.push(row); x = 0; };
  for (const c of picked) {
    if (c[0] !== lastGroup && g === 'all') { newRow(c); heads.push({ text: GROUP_NAME[c[0]], y }); lastGroup = c[0]; }
    for (const d of dirs) {
      // a unit: the figure, or its before · after pair, which never splits across a row
      const ws = roots.map((root) => cell(c) * (roots.length > 1 && root ? 0.82 : 1)), unit = ws.reduce((m, n) => m + n, 0);   // (a twin stands closer to its pair)
      if (!row || (x + unit > W && row.items.length) || (dirP === 'all' && d === 0 && row.items.length)) newRow(c);
      roots.forEach((root, i) => { row.items.push({ c, d, root, x: x + ws[i] / 2 }); x += ws[i]; });
    }
  }
  if (row) y += ROW_H(row.items[0].c);
  const showPanel = P('panel', '1') !== '0', reserve = showPanel ? Math.round(92 * view.w / window.innerWidth) : 10;   // (the panel's height, in native px)
  // a cast taller than the screen packs its rows closer (to 78 %: a 56 px figure and its label still clear the next)
  const squeeze = Math.max(0.78, Math.min(1, (view.h - reserve) / y));
  if (squeeze < 1) { for (const r of rows) r.y *= squeeze; for (const h of heads) h.y *= squeeze; y *= squeeze; }
  const totalH = y, room = view.h - reserve, top = totalH < room ? reserve - view.h * anchorY + (room - totalH) / 2 : reserve - view.h * anchorY;   // centred below the panel; from the top when it's taller
  const C0 = sim.world.spawn, cam = { x: C0.x, y: C0.y };
  const actors = [];
  for (const r of rows) {
    const rw = r.items.length ? r.items[r.items.length - 1].x + cell(r.items[0].c) / 2 : 0;
    for (const it of r.items) {
      const sx = it.x - rw / 2, sy = top + r.y + ROW_H(it.c) * squeeze - 26 * space, w = unproject(sx, sy);
      const kind = kindOf(it.c[0], it.c[1]);
      const label = it.d !== null ? (it.d === 0 ? `${it.c[2]} 0` : String(it.d)) : roots.length > 1 && it.root ? '' : it.c[2];
      actors.push({ atlas: it.c[1], label, tag: roots.length > 1 ? (it.root ? 'before' : 'after') : '', kind,
        root: it.root || undefined, scale: it.c[0] === 'bosses' ? 1.3 : 1, x: cam.x + w.x, y: cam.y + w.y, dir: it.d, unit: { atkN: 0, hitN: 0, fidgetN: 0, lookN: 0 }, vx: 0, vy: 0, last: 0 });
    }
  }
  const headAt = heads.map((h) => ({ text: h.text, ...unproject(-W / 2 + 4, top + h.y + 10) }));

  // ── playback: what each figure is told, every frame (the animator does the rest) ──
  const dur = (c) => (c ? (c.len / c.fps) * 1000 : 0);
  function anim(a, atl, now) {
    const C = atl.meta.clips, k = a.dir !== null ? a.dir : dirP === 'turn' ? Math.floor(now / 1000) % 8 : +dirP || 0, f = facing(k);
    const want = C[clip] ? clip : 'idle', base = { faceX: f.x, faceY: f.y, facing: true, dir0: k, x: a.vx, y: a.vy, moving: false, seed: 0 };
    const dt = a.last ? Math.min(100, now - a.last) : 0; a.last = now;
    if (want === 'walk') {                                                      // in place: a virtual walk the animator steps by distance
      const v = (speedP || SPEED[a.kind]) * dt / 1000; a.vx += f.x * v * Math.SQRT2; a.vy += f.y * v * Math.SQRT2;
      return { ...base, x: a.vx, y: a.vy, moving: true, facing: false };
    }
    const c = C[want], period = dur(c) + 700, n = Math.floor(now / period) + 1;   // one-shots repeat, with a breath between
    if (want === 'attack' || want === 'attack2' || want === 'heavy') { a.unit.atkN = n; a.unit.atkKind = want === 'heavy' ? 'heavy' : want === 'attack2' ? 'b' : undefined; }
    else if (want === 'hit') a.unit.hitN = n;
    else if (want === 'fidget') a.unit.fidgetN = n;
    else if (want === 'look') a.unit.lookN = n;
    else if (want === 'death') { const p2 = dur(c) + 1500; return { ...base, dead: true, deadT: (now % p2) / 1000 }; }
    else if (want === 'sit') return { ...base, sit: true };
    else if (want === 'spawn') { const p2 = dur(c) + 900, q = (now % p2) / dur(c); return { ...base, spawnP: Math.min(0.999, q) }; }
    return base;
  }

  // ── names under the feet, group headings; device px from the renderer's projection ──
  function overlay(ctx, toPx, S) {
    const v = renderer.view, cut = actors.filter((a) => a.box && (a.box[0] < 0 || a.box[1] < 0 || a.box[2] > v.w || a.box[3] > v.h)).length;
    if (cut) {                                                                  // say so rather than cut figures off quietly
      const dpr = Math.min(3, window.devicePixelRatio || 1), t = `${cut} of ${actors.length} don't fit: a lower zoom, a smaller group or a taller window`;
      ctx.font = `${Math.round(12 * dpr)}px ui-monospace, Menlo, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillStyle = 'rgba(60,16,12,.85)'; const tw = ctx.measureText(t).width; ctx.fillRect(ctx.canvas.width / 2 - tw / 2 - 8, ctx.canvas.height - 30 * dpr, tw + 16, 22 * dpr);
      ctx.fillStyle = '#ffd0c8'; ctx.fillText(t, ctx.canvas.width / 2, ctx.canvas.height - 12 * dpr);
    }
    if (!labels) return;
    const dpr = Math.min(3, window.devicePixelRatio || 1), px = Math.round(11 * dpr);         // 11 CSS px
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (const a of actors) {
      const [x, y] = toPx(a.x, a.y);
      ctx.font = `${px}px ui-monospace, Menlo, monospace`; ctx.fillStyle = 'rgba(12,10,16,.55)';
      const t = a.label, tw = ctx.measureText(t).width;
      if (t) ctx.fillRect(x - tw / 2 - 3, y + 4 * S, tw + 6, px + 4); ctx.fillStyle = '#efe4cf'; if (t) ctx.fillText(t, x, y + 4 * S + 2);
      if (a.tag) { ctx.fillStyle = a.tag === 'before' ? '#c8a870' : '#8fe07a'; ctx.fillText(a.tag, x, y + 4 * S + (t ? px + 6 : 2)); }
    }
    ctx.textAlign = 'left'; ctx.font = `600 ${Math.round(px * 1.15)}px Georgia, serif`; ctx.fillStyle = '#f0c880';
    for (const h of headAt) { const [x, y] = toPx(cam.x + h.x, cam.y + h.y); ctx.fillText(h.text, x, y); }
  }

  const st = { cam, actors, anim, overlay };
  renderer.setStage(st);

  // ── the page: no HUD, no taps into the world; a small panel of the parameters ──
  document.body.classList.add('stage');
  const css = document.createElement('style');
  css.textContent = `body.stage > *:not(canvas):not(#stagePanel) { display: none !important; }
#stagePanel { position: fixed; left: 6px; right: 6px; top: 6px; z-index: 20; display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; padding: 6px 8px;
  background: rgba(16,12,22,.92); border: 1px solid rgba(214,170,98,.4); border-radius: 10px; font: 11px ui-monospace, Menlo, monospace; color: #cbbfae; }
#stagePanel b { color: #f0c880; font: 600 13px Georgia, serif; margin-right: 4px; }
#stagePanel label { display: flex; gap: 3px; align-items: center; }
#stagePanel select, #stagePanel input { min-height: 30px; background: #221c2c; color: #efe4cf; border: 1px solid #3a3444; border-radius: 6px; font: inherit; }
#stagePanel input { width: 7em; }`;
  document.head.appendChild(css);
  if (showPanel) {
    const panel = document.createElement('div'); panel.id = 'stagePanel';
    const sel = (k, cur) => `<label>${k}<select data-k="${k}">${OPTS[k].map((v) => `<option${v === cur ? ' selected' : ''}>${v}</option>`).join('')}</select></label>`;
    panel.innerHTML = `<b>Stage</b>${sel('group', OPTS.group.includes(g) ? g : 'all')}${sel('clip', clip)}${sel('dir', dirP)}${sel('tod', P('tod', 'dusk'))}${sel('floor', P('floor', 'grass'))}${sel('zoom', String(zoom))}<label>cmp<input data-k="cmp" placeholder="/before/" value="${cmp.replace(/"/g, '')}"></label>`;
    panel.addEventListener('change', (e) => { const t = /** @type {HTMLInputElement} */ (e.target), q = new URLSearchParams(location.search); if (t.value) q.set(t.dataset.k || '', t.value); else q.delete(t.dataset.k || ''); location.search = q.toString(); });
    document.body.appendChild(panel);
  }
  return st;
}
