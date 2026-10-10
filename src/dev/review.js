// @ts-check
// review.js — the art review's views beside the cast (docs/art-review.md): the Stage's `show=` pages, dev only
// (`?dev&scene=stage&show=…`, localhost: main.js). Every piece of the game's art in one place, drawn the way the game
// draws it, so a critic pass looks at all of it, at the size a player sees it, in a minute, and the same pixels every
// run on the manual clock (tools/capture/stage.mjs).
//
//   show=env     every baked environment sprite (assets/env: buildings, the town sets, trees, rocks, mountains,
//                undergrowth, farm, props, site pieces), by family, an idle loop where it has frames (id~n);
//                set = env · town-vale · town-fens · town-reach · town-heights · all; page = 1…; match = a substring
//   show=props   every prop the renderer draws on a floor (gsprite.js buildProps: braziers, chests, shrines, pillars,
//                the dungeons' furniture), every variant
//   show=fx      every effect, each in its own cell on a loop: hit sparks, light columns (loot by rarity, a soul freed),
//                the raising, bolts and arrows in flight, the ground hazards, team rings, the numbers, the
//                marsh-lights, and each weapon style's swing, cast or shot
//   show=icons   every item icon (assets/items) by base, at the bag's size and three times it, with its slot and name
//   show=faces   every portrait and character-window figure (assets/actors/<actor>.face.png, .fig.png)
//
// The sprites and effects go through the renderer (renderer.setStage: stageApi), so a capture here is the game's own
// stamping, light, outline and bloom; the icons and faces are the UI's own images at the UI's sizes. Nothing here
// touches the sim: the stage world is a flat field, and this only reads it to place things.

import { unproject } from '../render/iso.js';
import { BASES } from '../sim/items.js';

const SHOWS = ['cast', 'env', 'props', 'fx', 'icons', 'faces'];
const SETS = ['env', 'town-vale', 'town-fens', 'town-reach', 'town-heights', 'all'];
const ATLASES = ['env', 'town-vale', 'town-fens', 'town-reach', 'town-heights'];

// an environment sprite's family, for the headings (in this order)
/** @type {[string, RegExp][]} */
const FAMILIES = [
  ['Town · the Vale', /^vale_/], ['Town · the Fens', /^fens_/], ['Town · the Reach', /^reach_/], ['Town · the Heights', /^heights_/],
  ['Trees', /^(pine|oak|autumn|birch|grove|dead|alder|willow|carr)_/], ['Rocks and mountains', /^(rock_|mountain|massif|shoulder|peak)/],
  ['Undergrowth', /^ug_/], ['Fields and farm', /^(wheat|cow|sheep|hens|pumpkins|hay|planter)_/], ['Fences and walls', /^(fence|drywall)_/],
  ['Sites and roads', /^(stairs|bridge|ruin|mine|lumbermill|watermill|chapelruin|milestone|warren|wagon)/], ['Props', /./],
];
const familyOf = (id) => FAMILIES.findIndex(([, re]) => re.test(id));

/** @param {{ renderer: any, sim: any, params: URLSearchParams, CAST: any[], makeAnim: (c: string, d: string, s: number) => any }} o */
export function createReview({ renderer, sim, params, CAST, makeAnim }) {
  const P = (k, d) => params.get(k) ?? d;
  const show = SHOWS.includes(P('show', 'env')) ? P('show', 'env') : 'env';
  const zoom = Math.max(1, Math.min(3, Math.round(+P('zoom', '1')) || 1)); renderer.setZoom(zoom);
  const set = SETS.includes(P('set', 'env')) ? P('set', 'env') : 'env', match = P('match', ''), labels = P('labels', '1') !== '0';
  const showPanel = P('panel', '1') !== '0';
  const view = renderer.view, W = view.w - 8, anchorY = 0.47, panelH = window.innerWidth < 700 ? 160 : 96, reserve = showPanel ? Math.round(panelH * view.w / window.innerWidth) : 10;   // (the panel wraps to three rows on a phone)
  const room = view.h - reserve - 16, top = reserve - view.h * anchorY;
  const cam = { x: sim.world.spawn.x, y: sim.world.spawn.y };
  const at = (sx, sy) => { const w = unproject(sx, sy); return { x: cam.x + w.x, y: cam.y + w.y }; };
  const st = { total: 0, of: 0, cam, actors: /** @type {any[]} */ ([]), anim: makeAnim('idle', '1', 0), overlay, frame: null, afterFx: null, hazard: null, rings: false, pages: 1, page: 1, cell: [0, 0], need: 0, items: /** @type {any[]} */ ([]), heads: /** @type {any[]} */ ([]), ready: false };
  const page = Math.max(1, Math.round(+P('page', '1')) || 1);
  const TXT = 6.9 * view.w / window.innerWidth;                          // native px a label character takes (11 CSS px monospace: 6.6 CSS px a character, and a little)

  // ── pages of items: rows packed across the screen, a heading row at each new family, a new page when a row won't fit ──
  /** @param {{ id: string, label: string, w: number, h: number, fam: number, head: string }[]} list */
  function paginate(list) {
    const pages = [[]], heads = [[]]; let y = 0, x = 0, rowH = 0, row = [], fam = -1;
    const flush = () => { if (!row.length) return; const rw = x - 4; for (const it of row) { it.sx -= rw / 2; it.sy = y + rowH; } y += rowH + 12; row = []; x = 0; rowH = 0; };
    for (const it of list) {
      const cw = Math.max(it.w, it.label.length * TXT) + 6;
      if (it.fam !== fam) { flush(); if (y + 14 > room) { pages.push([]); heads.push([]); y = 0; } heads[heads.length - 1].push({ text: it.head, sy: y }); y += 12; fam = it.fam; }
      if (row.length && x + cw > W) flush();
      if (y + Math.max(rowH, it.h) + 12 > room && (row.length || y > 0)) { flush(); pages.push([]); heads.push([]); y = 0; heads[heads.length - 1].push({ text: it.head + ' (cont.)', sy: y }); y += 12; }
      const p = { ...it, sx: x + cw / 2, sy: 0 }; row.push(p); pages[pages.length - 1].push(p); x += cw; rowH = Math.max(rowH, it.h);
    }
    flush();
    st.pages = pages.length; st.page = Math.min(page, pages.length);
    st.items = pages[st.page - 1].map((p) => ({ ...p, ...at(p.sx, top + p.sy) }));
    st.heads = heads[st.page - 1].map((h) => ({ text: h.text, ...at(-W / 2 + 2, top + h.sy + 9) }));
  }

  // ── show=env ───────────────────────────────────────────────────────────────────────────────────────────
  if (show === 'env') {
    const names = set === 'all' ? ATLASES : [set];
    renderer.stageLoad(names);
    st.frame = (api) => {
      if (!st.ready) {
        const lists = names.map((n) => renderer.envIds(n)); if (lists.some((l) => !l) || !api.envMeta) return;
        const frames = new Map();                                          // an idle loop: id, id~1, id~2…
        for (const id of lists.flat()) { const b = id.split('~')[0]; if (!frames.has(b)) frames.set(b, []); frames.get(b).push(id); }
        const list = [...frames.keys()].filter((id) => !match || id.includes(match)).map((id) => {
          const m = api.envMeta.sprites[id], up = m.up || 1, fam = familyOf(id);
          return { id, label: id + (frames.get(id).length > 1 ? ` · ${frames.get(id).length} frames` : ''), w: m.w * up, h: m.h * up, fam, head: FAMILIES[fam][0], frames: frames.get(id).sort() };
        }).sort((a, b) => a.fam - b.fam || a.id.localeCompare(b.id));
        st.total = list.length; st.of = frames.size; paginate(list); st.ready = true;   // (total: listed; of: every base sprite in the atlases; the test holds them equal)
      }
      for (const it of st.items) {
        const id = it.frames.length > 1 ? it.frames[Math.floor(api.now / 250) % it.frames.length] : it.id, sp = api.envSprite(id); if (!sp) continue;
        const q = api.at(it.x, it.y);
        api.draws.push({ d: it.x + it.y, sp, fx: q.sx, fy: q.sy, h: q.h, k: it.x + it.y, look: null, noXray: true });
      }
    };
  }

  // ── show=props ─────────────────────────────────────────────────────────────────────────────────────────
  if (show === 'props') {
    st.frame = (api) => {
      if (!st.ready) {
        const list = [];
        for (const [kind, arr] of Object.entries(api.props)) arr.forEach((sp, v) => { if (!match || kind.includes(match)) list.push({ id: kind, v, label: arr.length > 1 ? `${kind} ${v + 1}` : kind, w: sp.w, h: sp.h, fam: 0, head: 'Props (gsprite.js buildProps)' }); });
        list.sort((a, b) => a.id.localeCompare(b.id) || a.v - b.v);
        st.total = list.length; st.of = Object.values(api.props).reduce((n, arr) => n + arr.length, 0); paginate(list); st.ready = true;
      }
      for (const it of st.items) {
        const sp = api.props[it.id][it.v], q = api.at(it.x, it.y);
        api.draws.push({ d: it.x + it.y, sp, fx: q.sx, fy: q.sy, h: q.h, k: it.x + it.y + 1, look: null, noXray: true });
      }
    };
  }

  // ── show=fx ────────────────────────────────────────────────────────────────────────────────────────────
  if (show === 'fx') {
    const CW = Math.max(62, 17 * TXT), CH = 60; st.cell = [CW, CH]; const cols = Math.max(1, Math.floor(W / CW));   // (a cell holds its name: the longest are 17 characters)
    /** @type {{ head: string, label: string, period?: number, go?: (api: any, x: number, y: number, now: number) => void, draw?: (api: any, x: number, y: number, now: number) => void, after?: (o: any, x: number, y: number) => void, actor?: any[], span?: number, mud?: boolean, flood?: boolean }[]} */
    const cells = [];
    const H = (head, label, more) => cells.push({ head, label, ...more });
    const SPARK = [255, 232, 200];
    H('Hits', 'sparks', { period: 900, go: (a, x, y, now) => a.fx.impact(x, y, 0.7, -0.7, SPARK, { now }) });
    H('Hits', 'sparks · heavy', { period: 900, go: (a, x, y, now) => a.fx.impact(x, y, 0.7, -0.7, SPARK, { heavy: true, now }) });
    H('Hits', 'sparks · crit', { period: 900, go: (a, x, y, now) => a.fx.impact(x, y, 0.7, -0.7, SPARK, { crit: true, now }) });
    for (const r of ['common', 'fine', 'rare', 'heirloom']) H('Light', `loot · ${r}`, { period: 2800, go: (a, x, y, now) => a.fx.beam(x, y, a.LOOT_RGB[r], { now }) });
    H('Light', 'a soul freed', { period: 2000, go: (a, x, y, now) => a.fx.beam(x, y, a.SOUL_FREE, { now, life: 1.4 }) });
    H('Light', 'raised', { period: 2200, go: (a, x, y, now) => a.fx.rise(x, y, { now }) });
    H('Light', 'souls go free', { period: 2800, go: (a, x, y, now) => a.fx.rise(x, y, { now, life: 2.6, col: a.SOUL_FREE }) });
    // a bolt flies its 4 tiles at the game's speed (battle.js BOLT_SPEED, 26 tiles a second) and lands, once every 0.9 s,
    // as the game draws one: its trail, halo and floor glow, then its burst (renderer stageApi.bolt: a new object each
    // flight, and one let go lands)
    const fly = (c, a, x, y, now, kind, sp) => {
      const n = Math.floor(now / 900), t = (now % 900) / 155; if (t >= 1) return;
      const bx = x - 2 + 4 * t, by = y + 2 - 4 * t, q = a.at(bx, by);
      if (c.n !== n) { c.n = n; c.shot = {}; }
      a.bolt(c.shot, bx, by, kind); a.draws.push({ d: bx + by + 0.2, sp, fx: q.sx, fy: q.sy - 18, h: q.h + 18, k: bx + by + 1.5 });
    };
    for (const kind of ['fire', 'soul', 'hex', 'spirit', 'marsh', 'bolt']) H('In flight', `bolt · ${kind}`, { draw(a, x, y, now) { fly(this, a, x, y, now, kind, a.boltSprite(kind)); } });
    H('In flight', 'arrows · 16 headings', { draw: (a, x, y) => { for (let qd = 0; qd < 16; qd++) { const ang = (qd / 16) * Math.PI * 2, q = a.at(x, y); a.draws.push({ d: x + y, sp: a.arrowSprite(qd), fx: q.sx + Math.cos(ang) * 16, fy: q.sy - 18 + Math.sin(ang) * 10, h: q.h + 18, k: x + y + 1.5 }); } } });
    H('In flight', 'an arrow', { draw(a, x, y, now) { const ang = Math.atan2(0, 2 * a.HW); fly(this, a, x, y, now, 'arrow', a.arrowSprite(((Math.round(ang / (Math.PI / 8)) % 16) + 16) % 16)); } });
    H('Ground', 'shockwave · crit', { period: 1100, go: (a, x, y, now) => a.fx.shock(x, y, [255, 225, 170], { now }) });
    H('Ground', 'shockwave · heavy crit', { period: 1300, go: (a, x, y, now) => a.fx.shock(x, y, [255, 196, 120], { now, big: true }) });
    H('Ground', 'a foe goes out', { period: 1700, go: (a, x, y, now) => a.fx.soul(x, y, [200, 255, 210], { now }) });
    H('Ground', 'a boss goes out', { period: 2100, go: (a, x, y, now) => a.fx.soul(x, y, [255, 200, 130], { now, big: true }) });
    H('Ground', 'the Toadking\'s mud', { mud: true, span: 2 });
    H('Ground', 'the Abbess\'s water', { flood: true, span: 2 });
    H('Rings', 'the party', { actor: ['hero_knight', 1, 'idle'] });
    H('Rings', 'a foe', { actor: ['skeleton_warrior', 2, 'idle'] });
    H('Rings', 'an elite', { actor: ['skeleton_warrior', 3, 'idle'] });
    const FLOATS = [['14', '#f2ece0', 12], ['22!', '#ffd24a', 15], ['9', '#ff6a5a', 12], ['+18', '#8fe07a', 12], ['+40 xp', '#c8a0ff', 10], ['miss', '#9a93a8', 10], ['ward 12', '#8fc8ff', 11], ['hexed', '#b8e070', 11], ['+3 ✦', '#ff9440', 11], ['Cleave', '#ffb060', 11]];
    H('Numbers', 'over a foe', { actor: ['skeleton_warrior', 0, 'idle'], period: 600, go: (a, x, y, now) => { const f = FLOATS[Math.floor(now / 600) % FLOATS.length]; a.float(x, y, f[0], f[1], f[2]); } });
    H('Night', 'marsh-lights', { after: (o, x, y) => o.fx.wisps(o.now, o.proj, [{ x, y, ph: 0.7 }], 1) });
    for (const [atl, clip, label] of [['hero_knight', 'attack', 'knight · slash'], ['hero_barbarian', 'heavy', 'barbarian · heavy'], ['hero_rogue', 'attack', 'rogue · stab'], ['hero_rogue_xbow', 'attack', 'crossbow · shot'],
      ['hero_mage', 'attack', 'mage · cast'], ['hero_mage', 'heavy', 'mage · fire'], ['hero_cleric', 'heavy', 'cleric · mace'], ['hero_shaman', 'attack', 'shaman · spirit'],
      ['skeleton_warrior', 'attack', 'skeleton · slash'], ['skeleton_mage', 'attack', 'skeleton mage'], ['redhand_brute', 'heavy', 'brute · heavy'], ['goblin_hexer', 'attack', 'hexer · cast']])
      H('Weapons', label, { actor: [atl, 0, clip] });
    // the grid: a heading at each new family, the cells under it
    let col = 0, row = 0, head = '';
    const kindOfActor = (id) => (/^hero_/.test(id) ? 'party' : /^skeleton_/.test(id) ? 'undead' : 'human');
    for (const c of cells.filter((q) => !match || q.label.includes(match) || q.head.includes(match))) {
      const span = c.span || 1;
      if (c.head !== head) { if (col) { row++; col = 0; } st.heads.push({ text: c.head, ...at(-W / 2 + 2, top + row * CH + 9) }); head = c.head; }
      if (col + span > cols && col) { col = 0; row++; }
      const sx = -W / 2 + (col + span / 2) * CW, sy = top + row * CH + CH - 6, p = at(sx, sy);
      col += span - 1;
      st.items.push({ ...c, ...p });
      if (c.actor) st.actors.push({ atlas: c.actor[0], label: '', kind: kindOfActor(c.actor[0]), scale: 1, x: p.x, y: p.y, dir: 1, team: c.actor[1], clip: c.actor[2], unit: { atkN: 0, hitN: 0, fidgetN: 0, lookN: 0 }, vx: 0, vy: 0, last: 0 });
      if (++col >= cols) { col = 0; row++; }
    }
    st.rings = true; st.total = st.items.length; st.of = cells.length;
    st.need = Math.ceil((reserve + (row + (col ? 1 : 0)) * CH + 16) * window.innerWidth / view.w);   // (CSS px tall the grid wants: the capture grows the window to it)
    const mud = st.items.find((i) => i.mud), wet = st.items.find((i) => i.flood), edge = new Map();
    if (wet) for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) edge.set(`${Math.floor(wet.x) + dx},${Math.floor(wet.y) + dy}`, 1 + Math.max(Math.abs(dx), Math.abs(dy)));
    st.hazard = { hazards: mud ? [{ x: mud.x, y: mud.y, r: 2.2, until: 1e12, from: -1e12 }] : [], flood: wet ? 3 : 0, edge: wet ? edge : null, floodStep: 1 };
    st.ready = true;
    st.frame = (api) => {
      for (const c of st.items) {
        if (c.go) { const n = Math.floor(api.now / c.period); if (n !== c.n) { c.n = n; c.go(api, c.x, c.y, api.now); } }
        if (c.draw) c.draw(api, c.x, c.y, api.now);
      }
    };
    st.afterFx = (o) => { for (const c of st.items) if (c.after) c.after(o, c.x, c.y); };
  }

  // ── show=icons, show=faces: the UI's own images, at the UI's sizes ─────────────────────────────────────────
  const WINDOWED = CAST.filter((c) => (c[0] === 'party' || c[0] === 'town') && !/_(bow|longbow|xbow|hxbow)$/.test(c[1]));
  if (show === 'icons' || show === 'faces') {
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
  }

  // ── names and headings; device px from the renderer's projection ──
  function overlay(ctx, toPx, S) {
    if (!labels || show === 'icons' || show === 'faces') return;
    const dpr = Math.min(3, window.devicePixelRatio || 1), px = Math.round(11 * dpr);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = `${px}px ui-monospace, Menlo, monospace`;
    for (const it of st.items) {
      const [x, y] = toPx(it.x, it.y), t = it.label, tw = ctx.measureText(t).width;
      it.css = [x / dpr, y / dpr, S / dpr];                              // (where its cell sits on the page, for the capture's strips)
      ctx.fillStyle = 'rgba(12,10,16,.62)'; ctx.fillRect(x - tw / 2 - 3, y + 3 * S, tw + 6, px + 4);
      ctx.fillStyle = '#efe4cf'; ctx.fillText(t, x, y + 3 * S + 2);
    }
    ctx.textAlign = 'left'; ctx.font = `600 ${Math.round(px * 1.15)}px Georgia, serif`; ctx.fillStyle = '#f0c880';
    for (const h of st.heads) { const [x, y] = toPx(h.x, h.y); ctx.fillText(h.text, x, y); }
    if (st.pages > 1) { ctx.textAlign = 'right'; ctx.font = `${px}px ui-monospace, Menlo, monospace`; ctx.fillStyle = '#cbbfae'; ctx.fillText(`page ${st.page} of ${st.pages}`, ctx.canvas.width - 10 * dpr, ctx.canvas.height - 22 * dpr); }
  }

  renderer.setStage(st);

  // ── the page: no HUD; the panel (show, set, page, light, floor, zoom, match) ──
  document.body.classList.add('stage');
  const css = document.createElement('style');
  css.textContent = `body.stage > *:not(canvas):not(#stagePanel):not(#reviewGrid) { display: none !important; }
#stagePanel { position: fixed; left: 6px; right: 6px; top: 6px; z-index: 20; display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; padding: 6px 8px;
  background: rgba(16,12,22,.92); border: 1px solid rgba(214,170,98,.4); border-radius: 10px; font: 11px ui-monospace, Menlo, monospace; color: #cbbfae; }
#stagePanel b { color: #f0c880; font: 600 13px Georgia, serif; margin-right: 4px; }
#stagePanel label { display: flex; gap: 3px; align-items: center; }
#stagePanel select, #stagePanel input, #stagePanel button { min-height: 44px; background: #221c2c; color: #efe4cf; border: 1px solid #3a3444; border-radius: 6px; font: inherit; }
#stagePanel input { width: 7em; }
#reviewGrid { position: fixed; inset: ${showPanel ? panelH : 8}px 8px 8px; z-index: 10; overflow: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(${show === 'faces' ? 260 : 190}px, 1fr)); gap: 10px;
  background: #15121b; color: #cbbfae; font: 11px ui-monospace, Menlo, monospace; padding: 8px; }
#reviewGrid figure { margin: 0; padding: 8px; background: #1e1926; border: 1px solid #332b3d; border-radius: 8px; }
#reviewGrid .pair { display: flex; gap: 10px; align-items: flex-end; } #reviewGrid img { image-rendering: auto; background: #2a2333; border-radius: 4px; }
#reviewGrid figcaption { margin-top: 6px; line-height: 1.4; } #reviewGrid b { color: #f0c880; }`;
  document.head.appendChild(css);
  if (showPanel) {
    const OPTS = { show: SHOWS, set: SETS, tod: ['dawn', 'day', 'dusk', 'night'], floor: ['grass', 'cobble'], zoom: ['1', '2', '3'] };
    const sel = (k, cur) => `<label>${k}<select data-k="${k}">${OPTS[k].map((v) => `<option${v === cur ? ' selected' : ''}>${v}</option>`).join('')}</select></label>`;
    const panel = document.createElement('div'); panel.id = 'stagePanel';
    panel.innerHTML = `<b>Review</b>${sel('show', show)}${show === 'env' ? sel('set', set) : ''}${sel('tod', P('tod', 'dusk'))}${sel('floor', P('floor', 'grass'))}${sel('zoom', String(zoom))}<label>match<input data-k="match" value="${match.replace(/"/g, '')}"></label>`
      + (show === 'env' || show === 'props' ? `<button data-page="-1">‹ page</button><button data-page="1">page ›</button>` : '');
    panel.addEventListener('change', (e) => { const t = /** @type {HTMLInputElement} */ (e.target), q = new URLSearchParams(location.search); if (t.value) q.set(t.dataset.k || '', t.value); else q.delete(t.dataset.k || ''); if (t.dataset.k !== 'page') q.delete('page'); location.search = q.toString(); });
    panel.addEventListener('click', (e) => { const b = /** @type {HTMLElement} */ (e.target), d = +(b.dataset && b.dataset.page || 0); if (!d) return; const q = new URLSearchParams(location.search), n = Math.max(1, Math.min(st.pages, st.page + d)); q.set('page', String(n)); location.search = q.toString(); });
    document.body.appendChild(panel);
  }
  return st;
}
