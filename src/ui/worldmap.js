// @ts-check
// worldmap.js — the World map (docs/worldmap-travel-proposal.md; GDD §10 v1.43): a globe button under the Journal's,
// and a sheet with two tabs.
//   The Old Provinces: the Lantern Guild's wall map (wallmap.js), fogged past the lands you can walk. The coach's
//     towns are pinned: lit once you've stood in one, dim until then; "you are here"; a ★ by the town whose land the
//     tracked quest leads to. A town's card offers the Guild's coach there (sim/coach.js), from a town's square.
//   The land you're in: its overland drawn from the sim (tools/worldmap/minimap.mjs → assets/maps/), with its town,
//     its sites and its roads out. A pin's card says what's there, and Walk there pushes the compass's own goto (from
//     town: the road out, walking on to the site), so nothing new reaches the sim but the coach.
// It only reads state and pushes commands; the sim checks every one. Text renders as text (textContent), never HTML.

import { WALL, PLACES, LAND_AREA, FOG_WORDS } from './wallmap.js';
import { LANDS } from '../sim/regions.js';
import { COACH, days, fare, townOf } from '../sim/coach.js';
import { SITES, siteOpen, levelBand } from '../sim/sites.js';
import { BOSSES } from '../sim/battle.js';
import { NPCS } from '../sim/npcs.js';
import { QS } from '../sim/quests.js';
import { swallow } from './actorart.js';

const CSS = `
/* the fourth button in the right-hand column, set a little apart from the Journal's (the owner: "too close") */
#mapBtn { position: fixed; right: calc(12px + var(--safe-r, env(safe-area-inset-right, 0px))); top: calc(var(--hud-l1, 30px) + 240px); z-index: 5; width: 44px; height: 44px; border-radius: 22px; padding: 0;
  background: rgba(16,12,22,0.92); border: 1px solid rgba(214,170,98,0.45); display: grid; place-items: center; box-shadow: 0 2px 10px rgba(0,0,0,.5); }
#mapBtn svg { width: 24px; height: 24px; fill: none; stroke: #e0a85a; stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }
#mapBtn .dot { position: absolute; top: 3px; right: 3px; width: 10px; height: 10px; border-radius: 5px; background: #8fe07a; box-shadow: 0 0 8px rgba(143,224,122,.7); display: none; }
#mapBtn.due .dot { display: block; }
#mapWrap { position: fixed; inset: 0; z-index: 12; background: rgba(6,4,10,.62); display: none; }
#mapWrap.on { display: block; }
#worldmap { position: absolute; left: 0; right: 0; bottom: 0; top: calc(env(safe-area-inset-top, 0px) + 40px); max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; overflow: hidden;
  background: #100c16; border-top: 1px solid rgba(214,170,98,0.45); border-radius: 16px 16px 0 0; color: #efe4cf; font-family: ui-monospace, Menlo, monospace; }
#worldmap .top { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px 8px; }
#worldmap h2 { font: 600 19px Georgia, serif; color: #f0c880; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#worldmap .x { flex: none; width: 44px; height: 44px; border-radius: 22px; border: 1px solid rgba(214,170,98,0.45); color: #d8a040; background: none; font-size: 15px; }
#worldmap .tabs { display: flex; gap: 8px; padding: 0 14px 10px; }
#worldmap .tabs button { flex: 1; min-width: 0; min-height: 44px; padding: 0 4px; border-radius: 10px; border: 1px solid #2c2838; background: none; color: #978c80; font: 11px ui-monospace, Menlo, monospace; letter-spacing: .8px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#worldmap .tabs button.on { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; font-weight: 700; border-color: #f0c880; }
#worldmap .view { position: relative; flex: 1; min-height: 0; overflow: auto; background: #cdbf9c; overscroll-behavior: contain; }
#worldmap .view.land { background: #17121c; overflow-x: hidden; }
#worldmap .map { position: relative; }
#worldmap .map img { display: block; width: 100%; height: auto; }
#worldmap .map svg.fog { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; }
#worldmap .pin { position: absolute; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 9px; border: 2.5px solid #8a3a22; background: #f6ecd2; box-sizing: border-box; pointer-events: none; }
#worldmap .pin.lit { background: #e0a85a; border-color: #5a2e14; box-shadow: 0 0 10px rgba(224,168,90,.9); }
#worldmap .pin.dim, #worldmap .pin.fresh { background: rgba(246,236,210,.35); border-style: dashed; }
#worldmap .pin.off { border-color: #6e6456; background: #b8ad98; }
#worldmap .pin.sel { outline: 3px solid #f0c880; outline-offset: 3px; }
#worldmap .here { position: absolute; width: 32px; height: 32px; margin: -16px 0 0 -16px; border-radius: 16px; border: 2px solid #f0c880; box-shadow: 0 0 0 4px rgba(240,200,128,.3); pointer-events: none; }
#worldmap .tag { position: absolute; font: italic 12px Georgia, serif; color: #2a2018; background: rgba(240,228,200,.92); padding: 1px 6px; border-radius: 5px; white-space: nowrap; pointer-events: none; }
#worldmap .tag.me { color: #3b2208; font-weight: 600; }
#worldmap .star { position: absolute; margin: -13px 0 0 -2px; color: #b8402a; font: 20px Georgia, serif; text-shadow: 0 0 3px #f0e4c8, 0 0 3px #f0e4c8; pointer-events: none; }
#worldmap .card { position: absolute; left: 10px; right: 10px; bottom: calc(env(safe-area-inset-bottom, 0px) + 12px); background: rgba(16,12,22,0.97); border: 1px solid rgba(214,170,98,0.5); border-radius: 14px;
  padding: 12px 14px; box-shadow: 0 -4px 18px rgba(0,0,0,.5); display: none; }
#worldmap .card.on { display: block; }
#worldmap .card h3 { margin: 0; font: 600 17px Georgia, serif; color: #f0c880; }
#worldmap .card .sub { font-size: 12px; color: #b8a888; margin-top: 3px; line-height: 1.45; }
#worldmap .card .sub.q { color: #e8b0a0; }
#worldmap .card .row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px; }
#worldmap .card .fare { font-size: 13px; color: #efe4cf; line-height: 1.5; min-width: 0; }
#worldmap .card .fare em { color: #e0a85a; font-style: normal; }
#worldmap .card .why { font: italic 13px Georgia, serif; color: #b8a888; margin-top: 6px; }
#worldmap .card .go { flex: none; min-width: 120px; min-height: 48px; border-radius: 12px; border: 1px solid #e0a85a; background: linear-gradient(#5a3e1e, #3e2a14); color: #f8e2b4; font: 600 15px Georgia, serif; }
#worldmap .card .go.walk { background: linear-gradient(#2e3e2a, #1e2a1c); border-color: #8fbf7a; color: #dff0d2; }
#worldmap .card .go:disabled { opacity: .42; }
#coachCard { position: fixed; inset: 0; z-index: 13; display: grid; place-items: center; background: rgba(6,4,10,.7); opacity: 0; visibility: hidden; transition: opacity .35s ease, visibility 0s linear .35s; pointer-events: none; }
#coachCard.on { opacity: 1; visibility: visible; transition: opacity .25s ease; }
#coachCard div { max-width: 300px; margin: 0 16px; padding: 16px 20px; text-align: center; background: #100c16; border: 1px solid rgba(214,170,98,0.5); border-radius: 14px; color: #efe4cf; }
#coachCard b { display: block; font: 600 18px Georgia, serif; color: #f0c880; margin-bottom: 6px; }
#coachCard span { display: block; font: italic 14px/1.5 Georgia, serif; color: #d8ccb8; }
`;
// a globe: the world, not a page of it (the owner: "use a globe icon")
const GLOBE = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2"/><path d="M12 3.4c2.5 2.4 3.7 5.3 3.7 8.6s-1.2 6.2-3.7 8.6c-2.5-2.4-3.7-5.3-3.7-8.6s1.2-6.2 3.7-8.6z"/><path d="M5.2 7.4c1.9.9 4.2 1.4 6.8 1.4s4.9-.5 6.8-1.4M5.2 16.6c1.9-.9 4.2-1.4 6.8-1.4s4.9.5 6.8 1.4"/></svg><i class="dot"></i>';
// what each coach stop is (sim/coach.js COACH; outdoor.js builds them)
const STOP = { thornwick: 'a walled town · five services', saltmere: 'a waystation · tavern, shop, inn and chapel' };
const NUM = ['no', 'one', 'two', 'three', 'four', 'five'];
const lower = (/** @type {string} */ s) => s.replace(/^The /, 'the ');
// the wall map is drawn for a wall: at a phone's width its words are too small to read, so it opens larger, scrolled to
// where you are (both ways): at least 800 px wide, two-thirds of its own size, where its smallest words (17 px, the
// sites') are 11 px (art critic pass 12). The land's overland fits the sheet's width as it is.
const WALL_ZOOM = 1.7, WALL_MIN = 800;

/** @param {string} tag @param {string} [cls] @param {string} [text] */
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

/**
 * @param {{ sim: any, toast: (msg: string, ms?: number) => void, inSquare: () => boolean, questTitle: (id: string) => string }} o
 */
export function createWorldMap({ sim, toast, inSquare, questTitle }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const btn = el('button'); btn.id = 'mapBtn'; btn.setAttribute('aria-label', 'World map'); btn.innerHTML = GLOBE;
  const wrap = el('div'); wrap.id = 'mapWrap';
  const coachCard = el('div'); coachCard.id = 'coachCard'; coachCard.setAttribute('aria-live', 'polite');
  document.body.append(btn, wrap, coachCard);
  for (const e of [btn, wrap]) swallow(e);

  const sheet = el('div'); sheet.id = 'worldmap'; wrap.append(sheet);
  const title = el('h2'), x = el('button', 'x', '✕'); x.setAttribute('aria-label', 'Close');
  const top = el('div', 'top'); top.append(title, x);
  const tabW = el('button'), tabL = el('button'), tabs = el('div', 'tabs'); tabs.append(tabW, tabL);
  const view = el('div', 'view'), card = el('div', 'card');
  sheet.append(top, tabs, view, card);
  x.addEventListener('click', close);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  tabW.addEventListener('click', () => show('world'));
  tabL.addEventListener('click', () => show('land'));

  /** @type {Record<string, any>} */ const lands = {};      // assets/maps/minimap-<land>.json: the overland's frame and pins
  const landData = (/** @type {string} */ r) => lands[r] || (lands[r] = fetch(`./assets/maps/minimap-${r}.json`).then((q) => q.json()).catch(() => null));
  let open = false, tab = 'world', sel = '', pins = /** @type {any[]} */ ([]), scrolled = false;

  const region = () => (LANDS[sim.state.region] ? sim.state.region : 'vale');
  const S = () => sim.state;

  // where the tracked quest leads: its land, and the site in it (or null for the land's town)
  function questAt() {
    const id = S().tracked, q = id && S().quests[id], d = id && sim.quests.def(id);
    if (!q || !d || q.st === QS.DONE) return null;
    if (q.st === QS.READY) { const n = NPCS[d.turnin || d.giver]; return { id, land: (n && n.region) || d.region || null, site: null }; }
    const step = d.steps && (d.steps[q.step] || d.steps[0]), objs = (step && step.objectives) || [];
    const o = objs.find((/** @type {any} */ ob, /** @type {number} */ i) => (q.n[i] || 0) < ob.count) || objs[0];
    if (o && o.site && SITES[o.site]) return { id, land: SITES[o.site].region, site: o.site };
    return { id, land: (o && o.region) || d.region || null, site: null };
  }

  function show(/** @type {string} */ t) {
    tab = t; sel = ''; scrolled = false;
    const r = region();
    tabW.textContent = 'The Old Provinces'; tabL.textContent = LANDS[r].name;
    tabW.classList.toggle('on', t === 'world'); tabL.classList.toggle('on', t === 'land');
    title.textContent = t === 'world' ? 'The Old Provinces' : LANDS[r].name;
    view.className = 'view' + (t === 'land' ? ' land' : '');
    paint();
  }

  // ── the map: pins (in the map's own units), drawn over the image at its scale ──────────────────────────────────────
  function paint() {
    if (!open) return;
    view.textContent = ''; card.classList.remove('on'); view.style.paddingBottom = '';
    const map = el('div', 'map'), img = /** @type {HTMLImageElement} */ (el('img'));
    img.alt = ''; map.append(img); view.append(map);
    if (tab === 'world') {
      img.src = WALL.src; img.width = WALL.w; img.height = WALL.h;
      map.style.width = `${Math.round(Math.max(view.clientWidth * WALL_ZOOM, WALL_MIN))}px`;
      map.append(fogSvg());
      pins = worldPins();
      place(map, pins, WALL.w, 0, 0);
      const at = PLACES[townOf(region())];
      const go = () => { if (scrolled) return; scrolled = true; const k = map.clientWidth / WALL.w; view.scrollLeft = Math.max(0, at[0] * k - view.clientWidth / 2); view.scrollTop = Math.max(0, at[1] * k - view.clientHeight * 0.42); };
      if (img.complete) go(); else img.addEventListener('load', go, { once: true });
      requestAnimationFrame(go);
    } else {
      const r = region();
      landData(r).then((L) => {
        if (!open || tab !== 'land' || !L) return;
        img.src = `./assets/maps/minimap-${r}.png`; img.width = L.w * L.px; img.height = L.h * L.px;
        pins = landPins(r, L);
        place(map, pins, L.w, L.x0, L.y0);
      });
    }
    map.addEventListener('click', (e) => {
      const b = map.getBoundingClientRect(), mx = e.clientX - b.left, my = e.clientY - b.top;
      let best = null, bd = 30;                              // a thumb's reach: the nearest pin within 30 px
      for (const p of pins) { if (!p.tap) continue; const d = Math.hypot(p.sx - mx, p.sy - my); if (d < bd) { bd = d; best = p; } }
      sel = best ? best.key : ''; mark(map); paintCard(); if (best) inView(best);
    });
  }
  // the pins at the map's current size (screen px a map unit: its width over the units it spans); each pin remembers
  // where it stands on screen, for the tap
  let relay = () => {};
  /** @param {HTMLElement} map @param {any[]} list @param {number} unitsWide @param {number} x0 @param {number} y0 */
  function place(map, list, unitsWide, x0, y0) {
    const lay = () => {
      for (const n of map.querySelectorAll('.pin, .here, .tag, .star')) n.remove();
      const k = map.clientWidth / unitsWide, boxes = /** @type {number[][]} */ ([]);
      const free = (/** @type {number[]} */ bx) => { if (boxes.some((o) => bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1])) return false; boxes.push(bx); return true; };
      for (const p of list) {
        p.sx = (p.x - x0) * k; p.sy = (p.y - y0) * k;
        if (p.here) { const h = el('div', 'here'); h.style.left = `${p.sx}px`; h.style.top = `${p.sy}px`; map.append(h); }
        if (p.cls !== null) { const n = el('div', 'pin' + (p.cls ? ' ' + p.cls : '') + (sel === p.key ? ' sel' : '')); n.dataset.key = p.key; n.style.left = `${p.sx}px`; n.style.top = `${p.sy}px`; map.append(n); }
        if (p.star) { const s = el('div', 'star', '★'); s.style.left = `${p.sx + 10}px`; s.style.top = `${p.sy}px`; map.append(s); }
      }
      // the words beside the pins: you are here first, then the names, each below its pin, or above, right or left
      // where that would cover another (art critic pass 12: three of the Fens' were dropped); skipped only when none is free
      const MW = map.clientWidth, MH = map.clientHeight || 1e9;
      for (const p of [...list].sort((a, b) => (b.here ? 1 : 0) - (a.here ? 1 : 0))) {
        const text = p.here ? p.here : p.label; if (!text) continue;
        const w = text.length * 6.6 + 12, h = 18, cx = (x) => Math.min(Math.max(x, 2), MW - w - 2);
        const spots = [[cx(p.sx - w / 2), p.sy + (p.here ? 18 : 12)], [cx(p.sx - w / 2), p.sy - (p.here ? 18 : 12) - h], [p.sx + 14, p.sy - h / 2], [p.sx - 14 - w, p.sy - h / 2]]
          .filter(([lx, ly]) => lx >= 0 && lx + w <= MW && ly >= 0 && ly + h <= MH);
        const at = spots.find(([lx, ly]) => free([lx, ly, lx + w, ly + h])) || (p.here ? spots[0] : null);
        if (!at) continue;
        const t = el('div', 'tag' + (p.here ? ' me' : ''), text); t.style.left = `${at[0]}px`; t.style.top = `${at[1]}px`; map.append(t);
      }
    };
    lay();
    const img = map.querySelector('img'); if (img && !img.complete) img.addEventListener('load', lay, { once: true });
    relay = lay;
  }
  // a picked pin scrolled clear of its card (the card stands over the bottom of the map)
  function inView(/** @type {any} */ p) {
    const ch = card.offsetHeight + 24, h = view.clientHeight - ch;
    view.style.paddingBottom = `${ch}px`;                 // room to scroll the map's foot above the card
    const y = p.sy - view.scrollTop, xx = p.sx - view.scrollLeft;
    const top = y < 40 || y > h - 30 ? Math.max(0, p.sy - h / 2) : view.scrollTop, left = xx < 30 || xx > view.clientWidth - 30 ? Math.max(0, p.sx - view.clientWidth / 2) : view.scrollLeft;
    if (top !== view.scrollTop || left !== view.scrollLeft) view.scrollTo({ top, left, behavior: 'smooth' });
  }
  const mark = (/** @type {HTMLElement} */ map) => { for (const n of map.querySelectorAll('.pin')) n.classList.toggle('sel', /** @type {HTMLElement} */ (n).dataset.key === sel); };

  // the fog: the whole map but the open lands (even-odd: the lands don't overlap), and its words
  function fogSvg() {
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'fog'); svg.setAttribute('viewBox', `0 0 ${WALL.w} ${WALL.h}`); svg.setAttribute('preserveAspectRatio', 'none');
    const opened = Object.keys(LAND_AREA).filter((r) => LANDS[r] && sim.landOpen(r));
    const d = `M0,0H${WALL.w}V${WALL.h}H0Z` + opened.map((r) => 'M' + LAND_AREA[r].map((p) => p.join(',')).join('L') + 'Z').join('');
    const path = document.createElementNS(NS, 'path'); path.setAttribute('d', d); path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('fill', 'rgba(36,28,40,0.62)'); path.setAttribute('stroke', 'rgba(240,200,128,0.7)'); path.setAttribute('stroke-width', '3'); path.setAttribute('stroke-dasharray', '10 8');
    svg.append(path);
    const words = [FOG_WORDS.beyond, ...(opened.includes('fens') ? [] : [FOG_WORDS.fens])];
    for (const w of words) w.lines.forEach((line, i) => {
      const t = document.createElementNS(NS, 'text'); t.setAttribute('x', String(w.at[0])); t.setAttribute('y', String(w.at[1] + i * 46)); t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-family', 'Georgia, serif'); t.setAttribute('font-style', 'italic'); t.setAttribute('font-size', i === 0 ? '40' : '36'); t.setAttribute('fill', '#f0e2c4');
      t.setAttribute('stroke', 'rgba(20,14,22,.85)'); t.setAttribute('stroke-width', '6'); t.setAttribute('paint-order', 'stroke');
      t.textContent = line; svg.append(t);
    });
    return svg;
  }

  // ── the Old Provinces: the coach's stops in the open lands ─────────────────────────────────────────────────────────
  function worldPins() {
    const here = townOf(region()), inTown = sim.world.kind === 'town', q = questAt(), out = [];
    for (const id of Object.keys(COACH)) {
      const land = COACH[id].land; if (!sim.landOpen(land) || !PLACES[id]) continue;
      const [x, y] = PLACES[id];
      out.push({ key: id, kind: 'stop', id, land, x, y, tap: true, cls: S().reached.has(id) ? 'lit' : 'dim', label: '',
        here: id === here ? (inTown ? 'you are here' : `you are in ${lower(LANDS[land].name)}`) : '', star: !!(q && q.land === land && townOf(land) === id) });
    }
    return out;
  }

  // ── the land you're in: its town, its open sites and its roads out ────────────────────────────────────────────────
  /** @param {string} r @param {any} L */
  function landPins(r, L) {
    const w = sim.world, q = questAt(), out = [];
    for (const p of L.pins || []) {
      if (p.kind === 'site' && !siteOpen(p.id, S().revealed)) continue;             // not found yet: not on the map either
      const base = { key: p.kind + ':' + p.id, kind: p.kind, id: p.id, x: p.x, y: p.y, tap: true, here: '', star: false };
      if (p.kind === 'site') out.push({ ...base, label: SITES[p.id].name, cls: S().sitesEntered.has(p.id) ? '' : 'fresh', star: !!(q && q.site === p.id),
        here: w.kind === 'dungeon' && S().site === p.id ? 'you are here' : '' });
      else if (p.kind === 'town') out.push({ ...base, label: LANDS[r].town, cls: S().reached.has(townOf(r)) ? 'lit' : 'dim', star: !!(q && q.land === r && !q.site), here: w.kind === 'town' ? 'you are here' : '' });
      else if (LANDS[p.id]) out.push({ ...base, label: `to ${lower(LANDS[p.id].name)}`, cls: sim.landOpen(p.id) ? '' : 'off', star: !!(q && q.land === p.id && q.land !== r) });
    }
    if (w.kind === 'overland') { const pl = S().player; out.push({ key: 'me', kind: 'me', x: pl.x, y: pl.y, tap: false, cls: null, here: 'you are here', label: '' }); }
    return out;
  }

  // ── the card for the picked pin ────────────────────────────────────────────────────────────────────────────────────
  function paintCard() {
    const p = pins.find((o) => o.key === sel);
    card.textContent = ''; card.classList.toggle('on', !!p); if (!p) return;
    const q = p.star ? questAt() : null, qt = q ? questTitle(q.id) : '';
    const row = el('div', 'row'), info = el('div', 'fare');
    const button = (/** @type {string} */ text, /** @type {string} */ cls, /** @type {string} */ why, /** @type {() => void} */ act) => {
      const b = /** @type {HTMLButtonElement} */ (el('button', 'go' + (cls ? ' ' + cls : ''), text)); b.disabled = !!why; b.addEventListener('click', act); row.append(info, b);
      card.append(row); if (why) card.append(el('div', 'why', why));
    };
    if (p.kind === 'stop') {
      card.append(el('h3', '', COACH[p.id].name), el('div', 'sub', `${LANDS[p.land].name} · ${STOP[p.id] || 'a town'}`));
      if (qt) card.append(el('div', 'sub q', `★ ${qt}`));
      const from = townOf(region()), inTown = sim.world.kind === 'town';
      if (p.id === from && inTown) { info.textContent = 'You are here.'; row.append(info); card.append(row); return; }
      const n = days(from, p.id), f = fare(from, p.id);
      if (n === null || f === null) { info.textContent = 'No coach goes there yet.'; row.append(info); card.append(row); return; }
      info.append('The Guild’s coach', el('br'), el('em', '', `${n === 1 ? 'a day' : NUM[n] + ' days'} on the road · ${f} gold`));
      const why = !S().reached.has(p.id) ? 'Walk there first: the coach goes only where you’ve been.'
        : !inTown || !inSquare() ? 'The coach leaves from a town’s square, by the tavern.'
        : (S().counters.gold || 0) < f ? `Not enough gold: the fare is ${f}.` : '';
      button('Travel', '', why, () => { sim.commands.push({ type: 'coach', to: p.id }); close(); });
      return;
    }
    const r = region();
    if (p.kind === 'site') {
      const s = SITES[p.id], fl = s.floors ? `${NUM[s.floors] || s.floors} floor${s.floors === 1 ? '' : 's'}` : 'floors without end';
      const boss = Object.values(s.bosses || {}).map((b) => (BOSSES[b] ? BOSSES[b].name : '')).filter(Boolean).join(', ');
      card.append(el('h3', '', s.name), el('div', 'sub', `levels ${levelBand(p.id)} · ${fl}${boss ? ' · ' + boss : ''}`));
      card.append(el('div', 'sub', (S().sitesEntered.has(p.id) ? 'you’ve been in' : 'never entered') + (s.minLevel ? ` · takes a company from level ${s.minLevel}` : '')));
    } else if (p.kind === 'town') card.append(el('h3', '', LANDS[r].town), el('div', 'sub', STOP[townOf(r)] || 'a town'));
    else card.append(el('h3', '', LANDS[p.id].name), el('div', 'sub', sim.landOpen(p.id) ? 'the road there' : 'the road is shut'));
    if (qt) card.append(el('div', 'sub q', `★ ${qt}`));
    // Walk there: the compass's own rows (sim travel.js), so the walk is the one the compass would make
    const w = sim.world, want = p.kind === 'site' ? 'site:' + p.id : p.kind === 'town' ? 'town' : 'land:' + p.id;
    let go = null, why = '', steps = '';
    if (w.kind === 'overland' && w.region === r) {
      const o = sim.destinations().find((d) => d.id === want && !d.off);
      if (o) { go = { type: 'goto', tx: o.tx, ty: o.ty, near: o.near, then: o.then || null, label: o.label, room: o.room, journey: o.journey || null, site: o.site || null }; steps = `about ${o.steps} steps`; }
      else why = p.kind === 'land' && !sim.landOpen(p.id) ? 'The road there is shut.' : 'No way there from here.';
    } else if (w.kind === 'town' && p.kind === 'site') {
      const o = sim.destinations({ inSquare: inSquare() }).find((d) => d.id === 'road-out');
      if (o) { go = { type: 'goto', tx: o.tx, ty: o.ty, near: o.near, then: null, label: SITES[p.id].name, journey: 'delve', site: p.id }; steps = 'by the road out'; }
    } else if (w.kind === 'town') why = p.kind === 'town' ? '' : 'Take the road out first.';
    else why = 'Climb out first.';
    if (p.kind === 'town' && w.kind === 'town') { info.textContent = 'You are here.'; row.append(info); card.append(row); return; }
    if (go) info.append(p.kind === 'site' ? 'On this road' : 'The way', el('br'), el('em', '', steps));
    button('Walk there', 'walk', go ? '' : why || 'No way there from here.', () => { if (go) sim.commands.push(go); close(); });
  }

  function openMap(/** @type {string} */ t) {
    open = true; wrap.classList.add('on'); btn.classList.remove('due');
    show(t || (sim.world.kind === 'town' ? 'world' : 'land'));
  }
  function close() { open = false; wrap.classList.remove('on'); view.textContent = ''; card.classList.remove('on'); }
  btn.addEventListener('click', () => (open ? close() : openMap('')));
  addEventListener('resize', () => { if (open) relay(); });
  sim.bus.on('levelChanged', () => { if (open) show(tab); });
  sim.bus.on('questTracked', () => { if (open) show(tab); });

  // a town reached for the first time: the coach stops there now
  sim.bus.on('townReached', (e) => { btn.classList.add('due'); toast(`${e.name} · the Guild’s coach stops here now`, 2800); });
  // the trip: a card while the other town comes up (the sim moved you at once; the day on the road is words)
  let hideAt = 0;
  sim.bus.on('coach', (e) => {
    coachCard.textContent = '';
    const box = el('div'); box.append(el('b', '', 'The Guild’s coach'), el('span', '', `${COACH[e.from].name} to ${COACH[e.to].name}`), el('span', '', `${e.days === 1 ? 'a day' : NUM[e.days] + ' days'} on the road · ${e.fare} gold`));
    coachCard.append(box); coachCard.classList.add('on');
    clearTimeout(hideAt); hideAt = setTimeout(() => coachCard.classList.remove('on'), 2200);
  });

  return { open: openMap, close, get isOpen() { return open; } };
}
