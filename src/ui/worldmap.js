// @ts-check
// worldmap.js — the World map (docs/worldmap-travel-proposal.md; GDD §10 v1.43, v1.72): the minimap in the top bar is its
// button (the owner, 2026-11-11: "The mini map replaces the world menu button"), and a sheet with two tabs, the land
// you're in on the left, the World on the right.
//   World (headed The Old Provinces): the Lantern Guild's wall map (wallmap.js), fogged past the lands you can walk. The coach's
//     towns are pinned: lit once you've stood in one, dim until then; "you are here"; a ★ by the town whose land the
//     tracked quest leads to. A town's card offers the Guild's coach there (sim/coach.js), from anywhere above ground (v1.142).
//   The land you're in: its overland drawn from the sim (tools/worldmap/minimap.mjs → assets/maps/), with its town,
//     its sites and its roads out. A pin's card says what's there, and Walk there pushes the compass's own goto (from
//     town: the road out, walking on to the site), so nothing new reaches the sim but the coach. A tap on open ground
//     (v1.72: "Let me click in the minimap to also walk to a location") drops a mark there, snapped to the nearest spot
//     you can stand on (sim.spotNear), and its card's Walk here is a plain goto there.
// The old stones (GDD §19 v1.105, the owner: "Add a map marker for the stones and the event"): on the Fens' tab a pin at the
//     stones, on the World's one by Saltmere once the Fens are open, lit while the Kingstone stands or is about to (the
//     clock is ui/ring.js's); its card says when it stands, and Walk there walks to the ring's edge, where Enter the Ring is.
// It only reads state and pushes commands; the sim checks every one. Text renders as text (textContent), never HTML.

import { WALL, PLACES, LAND_AREA, FOG_WORDS, CLIMB } from './wallmap.js';
import { PAR } from '../sim/stars.js';
import { LANDS } from '../sim/regions.js';
import { COACH, trip, townOf } from '../sim/coach.js';
import { SITES, siteOpen, levelBand } from '../sim/sites.js';
import { BOSSES, bossAway } from '../sim/battle.js';
import { NPCS } from '../sim/npcs.js';
import { QS } from '../sim/quests.js';
import { swallow } from './actorart.js';
import { RING, RINGS, paidFor } from '../sim/ring.js';
import { CAMP_BY } from '../sim/camps.js';
import { EMBERFALL } from './wallmap.js';

const CSS = `
/* the button: no face of its own, laid over the minimap as the renderer draws it (renderer.minimapRect), hidden where
   there's none (the town square's home screen: the tavern's coach row opens the map there) */
#mapBtn { position: fixed; z-index: 5; padding: 0; margin: 0; border: 0; border-radius: 8px; background: none; display: none; -webkit-tap-highlight-color: transparent; }
#mapBtn.on { display: block; }
#mapBtn:active { background: rgba(240,200,128,.14); }
#mapBtn .dot { position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; border-radius: 6px; background: #8fe07a; box-shadow: 0 0 8px rgba(143,224,122,.7); display: none; }
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
#worldmap .pin.spot { width: 16px; height: 16px; margin: -8px 0 0 -8px; border: 2.5px solid #2e5a22; background: #bfe8a8; box-shadow: 0 0 0 3px rgba(240,228,200,.8); }
#worldmap .pin.ring { width: 20px; height: 20px; margin: -10px 0 0 -10px; border-radius: 10px; border: 3px double #6a2a14; background: #c9b89a; }
#worldmap .pin.ring.live { border: 3px solid #fff0d8; background: #ff7a2a; box-shadow: 0 0 0 3px rgba(255,122,42,.45), 0 0 14px rgba(255,122,42,.95); animation: wmRing 1.4s ease-in-out infinite; }
#worldmap .pin.ring.soon { border-color: #ff9a50; background: #f0c890; box-shadow: 0 0 10px rgba(255,150,80,.8); }
@keyframes wmRing { 50% { box-shadow: 0 0 0 7px rgba(255,122,42,0), 0 0 18px rgba(255,122,42,.95); } }
#worldmap .card .sub.ring { color: #ffb070; }
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
#worldmap .card .stars-line { color: #efe4cf; font-size: 13px; }
#worldmap .card .stars-line b { color: #ffd36a; font: 16px Georgia, serif; letter-spacing: 1px; }
#worldmap .card .stars-line i { color: rgba(240,228,200,.4); font: normal 16px Georgia, serif; letter-spacing: 1px; }
#worldmap .card .row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px; }
#worldmap .card .fare { font-size: 13px; color: #efe4cf; line-height: 1.5; min-width: 0; }
#worldmap .card .fare em { color: #e0a85a; font-style: normal; }
#worldmap .card .why { font: italic 13px Georgia, serif; color: #b8a888; margin-top: 6px; }
#worldmap .card .go { flex: none; min-width: 120px; min-height: 48px; border-radius: 12px; border: 1px solid #e0a85a; background: linear-gradient(#5a3e1e, #3e2a14); color: #f8e2b4; font: 600 15px Georgia, serif; }
#worldmap .card .go.walk { background: linear-gradient(#2e3e2a, #1e2a1c); border-color: #8fbf7a; color: #dff0d2; }
#worldmap .card .go:disabled { opacity: .42; }
/* (v1.143) the climb: a dungeon's stars beside its mark, each land's progress under its name, the road climbed inked in,
   and the level rail at the side, the lowest at its foot and the highest at its head */
#worldmap .pin.dgn { width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 3px; border: 2px solid #3b2a1c; background: rgba(246,236,210,.55); transform: rotate(45deg); }
#worldmap .pin.dgn.won { background: #e0a85a; border-color: #5a2e14; }
#worldmap .pin.dgn.gold { background: #ffd36a; border-color: #7a4a10; box-shadow: 0 0 9px rgba(255,200,90,.95); }
#worldmap .stars { position: absolute; transform: translateX(-50%); padding: 0 3px; border-radius: 6px; background: rgba(28,20,14,.82); color: #ffd36a; font: 12px/16px Georgia, serif; letter-spacing: 0; white-space: nowrap; pointer-events: none; }
#worldmap .stars i { font-style: normal; color: rgba(240,228,200,.45); }
#worldmap .prog { position: absolute; transform: translate(-50%, 0); padding: 2px 8px; border-radius: 8px; font: 12px/1.35 Georgia, serif; white-space: nowrap; pointer-events: none; text-align: center;
  background: rgba(28,20,14,.86); color: #f0e2c4; border: 1px solid rgba(214,170,98,.55); }
#worldmap .prog b { color: #ffd36a; font-weight: 600; }
#worldmap .prog.is-done { background: linear-gradient(#6a4a14, #3e2a0c); border-color: #ffd36a; }
#worldmap .prog.is-here { box-shadow: 0 0 0 2px rgba(240,200,128,.5), 0 0 12px rgba(240,200,128,.6); }
#worldmap .prog.is-shut, #worldmap .prog.is-far { color: #b8ad98; border-style: dashed; background: rgba(36,28,40,.8); }
#worldmap svg.trail { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; }
#worldmap .railpad { position: absolute; top: 0; left: calc(100% + 40px); width: 1px; height: 1px; pointer-events: none; }
#worldmap .rail { position: absolute; right: 4px; width: 26px; z-index: 2; display: flex; flex-direction: column-reverse; gap: 3px; padding: 4px 3px; border-radius: 12px;
  background: rgba(16,12,22,.82); border: 1px solid rgba(214,170,98,.45); }
#worldmap .rail button { position: relative; flex: 1; min-height: 0; padding: 0; border: 1px solid #3a3446; border-radius: 6px; background: #221c2c; overflow: hidden; }
#worldmap .rail button .fill { position: absolute; left: 0; right: 0; bottom: 0; background: linear-gradient(#e0a84a, #8a5a1a); }
#worldmap .rail button.done { border-color: #ffd36a; }
#worldmap .rail button.open { border-color: #b67c2a; }
#worldmap .rail button.off { opacity: .45; border-style: dashed; }
#worldmap .rail button span { position: absolute; left: 0; right: 0; top: 2px; font: 9px ui-monospace, Menlo, monospace; color: #efe4cf; text-shadow: 0 0 3px #000; }
#worldmap .rail .me { position: absolute; left: -7px; right: -7px; height: 0; border-top: 3px solid #8fe07a; box-shadow: 0 0 6px #8fe07a; pointer-events: none; }
#worldmap .rail .me em { position: absolute; right: 100%; top: -9px; margin-right: 3px; padding: 0 4px; border-radius: 4px; background: #1e3a18; color: #c8f0b0; font: 10px/16px ui-monospace, Menlo, monospace; font-style: normal; white-space: nowrap; }
#coachCard { position: fixed; inset: 0; z-index: 13; display: grid; place-items: center; background: rgba(6,4,10,.7); opacity: 0; visibility: hidden; transition: opacity .35s ease, visibility 0s linear .35s; pointer-events: none; }
#coachCard.on { opacity: 1; visibility: visible; transition: opacity .25s ease; }
#coachCard div { max-width: 300px; margin: 0 16px; padding: 16px 20px; text-align: center; background: #100c16; border: 1px solid rgba(214,170,98,0.5); border-radius: 14px; color: #efe4cf; }
#coachCard b { display: block; font: 600 18px Georgia, serif; color: #f0c880; margin-bottom: 6px; }
#coachCard span { display: block; font: italic 14px/1.5 Georgia, serif; color: #d8ccb8; }
`;
// what each coach stop is (sim/coach.js COACH; outdoor.js builds them)
const STOP = { thornwick: 'a walled town · five services', saltmere: 'a waystation · five services', ashgate: 'a walled town · five services' };
const NUM = ['no', 'one', 'two', 'three', 'four', 'five'];
const lower = (/** @type {string} */ s) => s.replace(/^The /, 'the ');
// the wall map is drawn for a wall: at a phone's width its words are too small to read, so it opens larger, scrolled to
// where you are (both ways): at least 800 px wide, two-thirds of its own size, where its smallest words (17 px, the
// sites') are 11 px (art critic pass 12). The land's overland fits the sheet's width as it is.
const WALL_ZOOM = 1.7, WALL_MIN = 800;

/** @param {string} tag @param {string} [cls] @param {string} [text] */
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

/**
 * @param {{ sim: any, toast: (msg: string, ms?: number) => void, inSquare: () => boolean, questTitle: (id: string) => string, minimap: () => ({ l: number, t: number, r: number, b: number } | null) }} o
 */
/** @param {{ sim: any, toast: any, inSquare: () => boolean, questTitle: (id: string) => string, minimap: () => any, ringClock?: (f?: (G: any) => boolean) => any }} o */
export function createWorldMap({ sim, toast, inSquare, questTitle, minimap, ringClock = () => null }) {
  // the road's length in words: none when the coach only fetches you in to your own land's town (v1.142)
  const road = (/** @type {number} */ n) => n === 0 ? 'in to the town' : `${n === 1 ? 'a day' : NUM[n] + ' days'} on the road`;
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const btn = el('button'); btn.id = 'mapBtn'; btn.setAttribute('aria-label', 'Map'); btn.append(el('span', 'dot'));
  const wrap = el('div'); wrap.id = 'mapWrap';
  const coachCard = el('div'); coachCard.id = 'coachCard'; coachCard.setAttribute('aria-live', 'polite');
  document.body.append(btn, wrap, coachCard);
  for (const e of [btn, wrap]) swallow(e);

  const sheet = el('div'); sheet.id = 'worldmap'; wrap.append(sheet);
  const title = el('h2'), x = el('button', 'x', '✕'); x.setAttribute('aria-label', 'Close');
  const top = el('div', 'top'); top.append(title, x);
  const tabW = el('button'), tabL = el('button'), tabs = el('div', 'tabs'); tabs.append(tabL, tabW);   // (the land you're in first, the World after: v1.72)
  const view = el('div', 'view'), card = el('div', 'card');
  sheet.append(top, tabs, view, card);
  x.addEventListener('click', close);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  tabW.addEventListener('click', () => show('world'));
  tabL.addEventListener('click', () => show('land'));

  /** @type {Record<string, any>} */ const lands = {};      // assets/maps/minimap-<land>.json: the overland's frame and pins (its picture: land-<land>.jpg)
  /** @type {number[][] | null} */ let coast = null;         // assets/maps/old-provinces.json: the wall map's coast, for the fog
  /** @type {Record<string, number[]>} */ let siteXY = {};   // (v1.143) each dungeon's mark on the wall map (draw.mjs): its stars stand beside it
  fetch('./assets/maps/old-provinces.json').then((q) => q.json()).then((j) => { coast = j.coast; siteXY = j.sites || {}; if (open && tab === 'world') paint(); const f = view.querySelector('svg.fog'); if (open && tab === 'world' && f) f.replaceWith(fogSvg()); }).catch(() => {});
  const landData = (/** @type {string} */ r) => lands[r] || (lands[r] = fetch(`./assets/maps/minimap-${r}.json`).then((q) => q.json()).catch(() => null));
  let open = false, tab = 'world', sel = '', pins = /** @type {any[]} */ ([]), scrolled = false;
  /** @type {{ w: number, x0: number, y0: number } | null} */ let frame = null;   // the land tab's map: its units across and its origin (for a tap on open ground)

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
    tabW.textContent = 'World'; tabL.textContent = LANDS[r].name;   // (the tab says World; its heading keeps the map's own name)
    tabW.classList.toggle('on', t === 'world'); tabL.classList.toggle('on', t === 'land');
    title.textContent = t === 'world' ? 'The Old Provinces' : LANDS[r].name;
    view.className = 'view' + (t === 'land' ? ' land' : '');
    paint();
  }

  // ── the map: pins (in the map's own units), drawn over the image at its scale ──────────────────────────────────────
  function paint() {
    if (!open) return;
    view.textContent = ''; card.classList.remove('on'); view.style.paddingBottom = ''; frame = null; for (const n of sheet.querySelectorAll('.rail')) n.remove();
    const map = el('div', 'map'), img = /** @type {HTMLImageElement} */ (el('img'));
    img.alt = ''; map.append(img); view.append(map);
    if (tab === 'world') {
      img.src = WALL.src; img.width = WALL.w; img.height = WALL.h;
      map.style.width = `${Math.round(Math.max(view.clientWidth * WALL_ZOOM, WALL_MIN))}px`;
      map.append(fogSvg(), trailSvg());
      // (v1.146 critic: the level rail stood over the right edge's pins, the Sunken Chapel's stars under it) the map
      // scrolls a rail's width further, so whatever the rail covers can be brought out from under it
      { const pad = el('div', 'railpad'); map.append(pad); }
      pins = worldPins();
      place(map, pins, WALL.w, 0, 0);
      progTags(map); rail(map);
      const at = PLACES[townOf(region())];
      // scrolled to where you are, with "you are here" (west of the pin) wholly in view
      // (v1.143) and the next land up the climb with it, where both fit across the view: the way on is in sight
      const ci = CLIMB.findIndex((L) => L.id === region()), nx = ci >= 0 && CLIMB[ci + 1] ? PLACES[CLIMB[ci + 1].town] : null;
      // (a map not laid out yet measures 0 wide: scrolled then, it opened on the map's top corner and never scrolled again,
      // so wait a frame for its width; the browser suite's World map check failed on that race, now and then)
      const go = () => { if (scrolled) return; if (!map.clientWidth || !view.clientWidth) { requestAnimationFrame(go); return; } scrolled = true; const k = map.clientWidth / WALL.w, me = pins.find((p) => p.here), tw = me ? me.here.length * 6.6 + 12 + 22 + 10 : 0;
        const VW = view.clientWidth - 40;   // (the rail's width off the right: v1.146 critic)
        const both = nx && Math.abs(nx[0] - at[0]) * k < view.clientWidth - 90 && Math.abs(nx[1] - at[1]) * k < view.clientHeight * 0.7;   // (the full width: two towns 283 px apart on a 390 phone still fit, the next one short of the rail)
        // (v1.146: the tag west of the pin was cut by the view's left edge when both lands were framed) the span from the
        // tag's left end to the next land's town, centred where it fits; where it doesn't, the tag wins
        const hx = me && me.sx != null ? me.sx : at[0] * k, lo = Math.min(hx - tw, at[0] * k - 12), hi = both ? Math.max(nx[0], at[0]) * k + 40 : hx;
        view.scrollLeft = Math.max(0, both && hi - lo <= VW ? (lo + hi) / 2 - VW / 2 : both ? ((at[0] + nx[0]) / 2) * k - (VW - 30) / 2 : Math.min(at[0] * k - VW / 2, hx - tw));
        relay();   // (the tags again, now the view is where it opens: "you are here" picks a spot inside it, lay below)
        view.scrollTop = Math.max(0, (both ? ((at[1] + nx[1]) / 2) * k - view.clientHeight * 0.45 : at[1] * k - view.clientHeight * 0.42)); };
      if (img.complete) go(); else img.addEventListener('load', go, { once: true });
      requestAnimationFrame(go);
    } else {
      const r = region();
      landData(r).then((L) => {
        if (!open || tab !== 'land' || !L) return;
        img.src = `./assets/maps/land-${r}.jpg`;   // (the overland in the wall map's hand: tools/worldmap/minimap.mjs) img.width = L.w * L.px; img.height = L.h * L.px;
        pins = landPins(r, L); frame = { w: L.w, x0: L.x0, y0: L.y0 };
        place(map, pins, L.w, L.x0, L.y0);
      });
    }
    map.addEventListener('click', (e) => {
      const b = map.getBoundingClientRect(), mx = e.clientX - b.left, my = e.clientY - b.top;
      let best = null, bd = 30;                              // a thumb's reach: the nearest pin within 30 px
      for (const p of pins) { if (!p.tap) continue; const d = Math.hypot(p.sx - mx, p.sy - my); if (d < bd) { bd = d; best = p; } }
      const old = pins.findIndex((p) => p.kind === 'spot'); if (old >= 0) pins.splice(old, 1);   // (pins is the list place() lays: changed in place)
      if (!best && tab === 'land' && frame) {
        // open ground: a mark there, snapped to the nearest spot you can stand on, and a card to walk to it
        const k = map.clientWidth / frame.w, ux = frame.x0 + mx / k, uy = frame.y0 + my / k, w = sim.world;
        const s = w.kind === 'overland' && w.region === region() ? sim.spotNear(ux, uy) : null;
        best = { key: 'spot', kind: 'spot', x: s ? s.tx + 0.5 : ux, y: s ? s.ty + 0.5 : uy, tap: false, cls: 'spot', here: '', label: '', star: false, spot: s };
        pins.push(best);
      }
      sel = best ? best.key : ''; relay(); paintCard(); if (best) inView(best);
    });
  }
  // the pins at the map's current size (screen px a map unit: its width over the units it spans); each pin remembers
  // where it stands on screen, for the tap
  let relay = () => {};
  /** @param {HTMLElement} map @param {any[]} list @param {number} unitsWide @param {number} x0 @param {number} y0 */
  function place(map, list, unitsWide, x0, y0) {
    const lay = () => {
      for (const n of map.querySelectorAll('.pin, .here, .tag, .star, .stars')) n.remove();
      const k = map.clientWidth / unitsWide, boxes = /** @type {number[][]} */ ([]);
      const free = (/** @type {number[]} */ bx) => { if (boxes.some((o) => bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1])) return false; boxes.push(bx); return true; };
      for (const p of list) {
        p.sx = (p.x - x0) * k; p.sy = (p.y - y0) * k;
        if (p.here) { const h = el('div', 'here'); h.style.left = `${p.sx}px`; h.style.top = `${p.sy}px`; map.append(h); }
        if (p.cls !== null) { const n = el('div', 'pin' + (p.cls ? ' ' + p.cls : '') + (sel === p.key ? ' sel' : '')); n.dataset.key = p.key; n.style.left = `${p.sx}px`; n.style.top = `${p.sy}px`; map.append(n); }
        if (p.star) { const s = el('div', 'star', '★'); s.style.left = `${p.sx + 10}px`; s.style.top = `${p.sy}px`; map.append(s); }
        // (v1.146 critic: beside the mark they ran into the next dungeon's and over the map's own lettering) the stars
        // over the mark, where the wall map writes nothing; under it if a neighbour's are there already, else beside
        if (p.stars != null) { const s = el('div', 'stars'); s.append('★'.repeat(p.stars)); if (p.stars < 3) s.append(el('i', '', '☆'.repeat(3 - p.stars))); s.setAttribute('aria-label', `${p.stars} of 3 stars`);
          const W2 = 21, spots = [[p.sx, p.sy - 26], [p.sx, p.sy + 10], [p.sx + 12 + W2, p.sy - 8]], at = spots.find(([x, y]) => free([x - W2, y, x + W2, y + 16])) || spots[0];
          s.style.left = `${at[0]}px`; s.style.top = `${at[1]}px`; map.append(s); }
      }
      // the words beside the pins: you are here first, then the names, each below its pin, or above, right or left
      // where that would cover another (art critic pass 12: three of the Fens' were dropped); skipped only when none is free
      const MW = map.clientWidth, MH = map.clientHeight || 1e9;
      for (const p of [...list].sort((a, b) => (b.here ? 1 : 0) - (a.here ? 1 : 0))) {
        const text = p.here ? p.here : p.label; if (!text) continue;
        const w = text.length * 6.6 + 12, h = 18, cx = (x) => Math.min(Math.max(x, 2), MW - w - 2);
        const below = [cx(p.sx - w / 2), p.sy + (p.here ? 18 : 12)], above = [cx(p.sx - w / 2), p.sy - (p.here ? 18 : 12) - h];
        const left = [p.sx - (p.here ? 22 : 14) - w, p.sy - h / 2], right = [p.sx + 14, p.sy - h / 2];
        const spots = (p.west ? [left, above, below, right] : [below, above, right, left])
          .filter(([lx, ly]) => lx >= 0 && lx + w <= MW && ly >= 0 && ly + h <= MH);
        // (v1.146 critic: "you are here" west of the pin was cut by the view's left edge) its spots inside what the view
        // shows first, the rail's width off the right
        const V = map.parentElement, V0 = V ? V.scrollLeft : 0, V1 = V ? V0 + V.clientWidth - 40 : MW;
        if (p.here) spots.sort((a, b) => +(a[0] < V0 || a[0] + w > V1) - +(b[0] < V0 || b[0] + w > V1));
        const at = spots.find(([lx, ly]) => free([lx, ly, lx + w, ly + h])) || (p.here ? spots[0] : null);
        if (!at) continue;
        const t = el('div', 'tag' + (p.here ? ' me' : ''), text); t.style.left = `${at[0]}px`; t.style.top = `${at[1]}px`; map.append(t);
      }
    };
    lay();
    const img = map.querySelector('img'); if (img && !img.complete) img.addEventListener('load', lay, { once: true });
    relay = lay;
  }
  // ── (v1.143) the climb: stars, each land's progress, the road climbed, the level rail ───────────────────────────────
  const starsAt = (/** @type {string} */ id) => { const r = S().stars && S().stars[id]; return r ? r.n : 0; };
  /** a land's dungeons with stars to win (found ones), the stars won and how many are cleared @param {string} land */
  function landStats(land) {
    const ids = Object.keys(PAR).filter((k) => SITES[k] && SITES[k].region === land && !SITES[k].parked && siteOpen(k, S().revealed));
    const got = ids.reduce((a, k) => a + starsAt(k), 0), done = ids.filter((k) => starsAt(k) > 0).length;
    return { n: ids.length, got, done, all: ids.length > 0 && done === ids.length };
  }
  /** where a land stands on the climb: 'done' (every dungeon cleared), 'here', 'open', 'shut' (built, not yet open), 'far' */
  function landState(/** @type {typeof CLIMB[number]} */ L) {
    if (!L.built || !LANDS[L.id]) return 'far';
    if (!sim.landOpen(L.id)) return 'shut';
    if (landStats(L.id).all) return 'done';
    return region() === L.id ? 'here' : 'open';
  }
  // under each land's name on the map: its stars and how many of its dungeons are cleared, or when it opens
  function progTags(/** @type {HTMLElement} */ map) {
    const lay = () => {
      for (const n of map.querySelectorAll('.prog')) n.remove();
      const k = map.clientWidth / WALL.w;
      for (const L of CLIMB) {
        const st = landState(L), t = el('div', 'prog is-' + st), lines = L.id === 'fens' ? 2 : 1;
        if (st === 'far') t.textContent = 'the Guild’s roads don’t reach it yet';
        else if (st === 'shut') t.textContent = `opens from level ${L.lv[0]}`;
        else { const g = landStats(L.id); t.append(el('b', '', `★ ${g.got} / ${g.n * 3}`), ` · ${g.done} of ${g.n} cleared` + (st === 'done' ? ' · done' : '')); }
        t.style.left = `${L.at[0] * k}px`; t.style.top = `${(L.at[1] + (lines - 1) * 30 + 50) * k}px`; map.append(t);
      }
    };
    lay(); const img = map.querySelector('img'); if (img && !img.complete) img.addEventListener('load', lay, { once: true });
  }
  // the road climbed: town to town up the map in the lands' order, inked solid through the lands open, dotted beyond, to
  // the Throne
  function trailSvg() {
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), mk = (/** @type {string} */ tag, /** @type {Record<string, any>} */ at) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(at)) e.setAttribute(k, String(v)); return e; };
    svg.setAttribute('class', 'trail'); svg.setAttribute('viewBox', `0 0 ${WALL.w} ${WALL.h}`); svg.setAttribute('preserveAspectRatio', 'none');
    const pts = [...CLIMB.map((L) => ({ at: PLACES[L.town], open: L.built && !!LANDS[L.id] && sim.landOpen(L.id) })), { at: PLACES.throne, open: false }];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i].at, b = pts[i + 1].at, lit = pts[i].open && pts[i + 1].open;
      svg.append(mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: lit ? '#b8402a' : '#5a4330', 'stroke-width': lit ? 7 : 4, 'stroke-dasharray': lit ? '' : '4 14', 'stroke-linecap': 'round', opacity: lit ? 0.55 : 0.5 }));
    }
    for (const p of pts.slice(0, -1)) svg.append(mk('circle', { cx: p.at[0], cy: p.at[1], r: 16, fill: 'none', stroke: p.open ? '#b8402a' : '#5a4330', 'stroke-width': 4, opacity: 0.55 }));
    return svg;
  }
  // the level rail, beside the map and not scrolling with it: a segment a land, the lowest at its foot; each filled by
  // the stars won there, and a mark at the hero's level; a tap scrolls the map to the land
  function rail(/** @type {HTMLElement} */ map) {
    for (const n of sheet.querySelectorAll('.rail')) n.remove();
    const R0 = el('div', 'rail'), lv = (S().party[0] && S().party[0].level) || 1, hb = view.getBoundingClientRect(), sb = sheet.getBoundingClientRect();
    R0.style.top = `${hb.top - sb.top + 8}px`; R0.style.height = `${Math.max(160, hb.height - 16)}px`;
    for (const L of CLIMB) {
      const st = landState(L), b = /** @type {HTMLButtonElement} */ (el('button', st === 'far' || st === 'shut' ? 'off' : st === 'done' ? 'done' : 'open'));
      const g = st === 'far' || st === 'shut' ? null : landStats(L.id), f = el('div', 'fill'); f.style.height = `${g && g.n ? Math.round((100 * g.got) / (g.n * 3)) : 0}%`;
      b.append(f, el('span', '', String(L.lv[0]))); b.setAttribute('aria-label', `${L.name}, levels ${L.lv[0]} to ${L.lv[1]}`);
      b.addEventListener('click', () => { const k = map.clientWidth / WALL.w; view.scrollTo({ top: Math.max(0, L.at[1] * k - view.clientHeight * 0.4), left: Math.max(0, L.at[0] * k - view.clientWidth / 2), behavior: 'smooth' }); });
      R0.append(b);
    }
    // the hero's level: within its land's segment, as far up it as the level is through the land's band
    const i = Math.max(0, CLIMB.findIndex((L) => lv <= L.lv[1])), L = CLIMB[i < 0 ? CLIMB.length - 1 : i], t = Math.min(1, Math.max(0, (lv - L.lv[0] + 0.5) / (L.lv[1] - L.lv[0] + 1)));
    const me = el('div', 'me'); me.append(el('em', '', `LV ${lv}`)); R0.append(me);
    requestAnimationFrame(() => { const seg = /** @type {HTMLElement} */ (R0.children[i]); if (!seg) return; me.style.top = `${seg.offsetTop + seg.offsetHeight * (1 - t)}px`; });
    sheet.append(R0);
  }
  // a picked pin scrolled clear of its card (the card stands over the bottom of the map)
  function inView(/** @type {any} */ p) {
    const ch = card.offsetHeight + 24, h = view.clientHeight - ch;
    view.style.paddingBottom = `${ch}px`;                 // room to scroll the map's foot above the card
    const y = p.sy - view.scrollTop, xx = p.sx - view.scrollLeft;
    const top = y < 40 || y > h - 30 ? Math.max(0, p.sy - h / 2) : view.scrollTop, left = xx < 30 || xx > view.clientWidth - 30 ? Math.max(0, p.sx - view.clientWidth / 2) : view.scrollLeft;
    if (top !== view.scrollTop || left !== view.scrollLeft) view.scrollTo({ top, left, behavior: 'smooth' });
  }

  // the fog: the whole map but the open lands (even-odd: the lands don't overlap), and its words
  // (art critic pass 13: the lit land was a die-cut box, a ruled edge across land and sea, the Vale and the Fens split
  // by a dashed line.) Now the fog lifts off the open lands as far as their shore and a little past it, the coast
  // drawn by draw.mjs (assets/maps/old-provinces.json), with a feathered edge where one land meets one not yet open.
  function fogSvg() {
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), el2 = (/** @type {string} */ tag, /** @type {Record<string, any>} */ at) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(at)) e.setAttribute(k, String(v)); return e; };
    svg.setAttribute('class', 'fog'); svg.setAttribute('viewBox', `0 0 ${WALL.w} ${WALL.h}`); svg.setAttribute('preserveAspectRatio', 'none');
    const opened = Object.keys(LAND_AREA).filter((r) => LANDS[r] && sim.landOpen(r));
    const lands = opened.map((r) => 'M' + LAND_AREA[r].map((p) => p.join(',')).join('L') + 'Z').join('');
    const defs = el2('defs', {}), clip = el2('clipPath', { id: 'wmLands' }), feather = el2('filter', { id: 'wmFeather', x: '-5%', y: '-5%', width: '110%', height: '110%' });
    clip.append(el2('path', { d: lands || 'M0,0Z' })); feather.append(el2('feGaussianBlur', { stdDeviation: 7 }));
    const mask = el2('mask', { id: 'wmFog', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: WALL.w, height: WALL.h }), soft = el2('g', { filter: 'url(#wmFeather)' }), cut = el2('g', { 'clip-path': 'url(#wmLands)' });
    // the open lands, to the shore and 28 units of sea past it (the coast's own ripple-lines); without the coast yet, the lands as drawn
    cut.append(coast ? el2('path', { d: 'M' + coast.map((p) => p.join(',')).join('L') + 'Z', fill: '#000', stroke: '#000', 'stroke-width': 56, 'stroke-linejoin': 'round' }) : el2('path', { d: lands || 'M0,0Z', fill: '#000' }));
    soft.append(cut); mask.append(el2('rect', { width: WALL.w, height: WALL.h, fill: '#fff' }), soft); defs.append(clip, feather, mask); svg.append(defs);
    svg.append(el2('rect', { width: WALL.w, height: WALL.h, fill: 'rgba(36,28,40,0.62)', mask: 'url(#wmFog)' }));
    const words = [FOG_WORDS.beyond, ...['fens', 'reach'].filter((r) => !opened.includes(r)).map((r) => FOG_WORDS[r])];
    for (const w of words) w.lines.forEach((line, i) => {
      const t = document.createElementNS(NS, 'text'); t.setAttribute('x', String(w.at[0])); t.setAttribute('y', String(w.at[1] + i * 34)); t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-family', 'Georgia, serif'); t.setAttribute('font-style', 'italic'); t.setAttribute('font-size', i === 0 ? '30' : '24'); t.setAttribute('fill', '#f0e2c4');
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
        here: id === here ? (inTown ? 'you are here' : `you are in ${lower(LANDS[land].name)}`) : '', star: !!(q && q.land === land && townOf(land) === id),
        west: true });   // (the wall map writes a town's name under its mark and its sites' round it; west of Emberfall's towns is open land and the coast: "you are here" goes there, pass 13)
    }
    for (const G of ringsShown()) { const C = CAMP_BY[G.camp], [x, y] = EMBERFALL[G.region](C.x, C.y); out.push(ringPin(x, y, G)); }
    // (v1.143) the dungeons of the open lands, found ones only, each with its stars (sim/stars.js): the map's own ink names them
    for (const id of Object.keys(PAR)) {
      const S0 = SITES[id], at = siteXY[id]; if (!S0 || !at || S0.parked || !sim.landOpen(S0.region) || !siteOpen(id, S().revealed)) continue;
      const n = starsAt(id);
      out.push({ key: 'site:' + id, kind: 'site', id, x: at[0], y: at[1], tap: true, cls: 'dgn' + (n === 3 ? ' gold' : n ? ' won' : ''), label: '', here: '', star: !!(q && q.site === id), stars: n });
    }
    return out;
  }
  // the region bosses on the map: the Kingstone's stones once the Fens are open; Furnace Nine's mouth once the Reach is and
  // it's been broken (v1.126: before that it's the Stoker's lamp, the story's to find)
  // (v1.147: a land of the game's, LANDS: the Heights aren't one yet, and landOpen reads an unknown land as the Vale)
  const ringsShown = () => Object.values(RINGS).filter((G) => LANDS[G.region] && EMBERFALL[G.region] && sim.landOpen(G.region) && (!G.lamp || (S().lampsBroken || []).includes(G.lamp)));
  const RING_WORDS = {
    kingstone: { place: 'the old stones', verb: 'stands', title: 'The old stones', sub: 'The Greywater Fens · the Kingstone stands the first 15 minutes of every hour', ground: 'the ring', where: 'In the Greywater Fens, north-east of Saltmere.' },
    furnace_nine: { place: 'the Vault’s mouth', verb: 'burns', title: 'The Vault’s mouth', sub: 'The Cinder Reach · Furnace Nine burns the first 15 minutes after every half hour', ground: 'its ground', where: 'In the Cinder Reach, up the track north of the Cinderworks.' },
    first_pilgrim: { place: 'the Lip', verb: 'stands', title: 'The Lip', sub: 'The Pale Heights · the First Pilgrim stands the first 15 minutes after every half hour', ground: 'his ground', where: 'In the Pale Heights, at the head of the Pilgrims’ Stair.' },   // (v1.147)
  };
  // a boss's pin: lit while it stands (a window open, not yet stood in), warm when it's about to
  function ringPin(/** @type {number} */ x, /** @type {number} */ y, /** @type {typeof RING} */ G = RING) {
    const c = ringClock((q) => q === G), live = !!(c && c.open && !paidFor(S(), c.id)), soon = !!(c && c.soon), W = RING_WORDS[G.id] || RING_WORDS.kingstone;
    return { key: 'ring:' + G.id, kind: 'ring', ring: G.id, x, y, tap: true, here: '', star: false, cls: 'ring' + (live ? ' live' : soon ? ' soon' : ''),
      label: live ? `${G.name.replace(/^The /, 'the ')} ${W.verb}` : soon ? `${G.name.replace(/^The /, 'the ')} at ${c.at}` : W.place };
  }

  // ── the land you're in: its town, its open sites and its roads out ────────────────────────────────────────────────
  /** @param {string} r @param {any} L */
  function landPins(r, L) {
    const w = sim.world, q = questAt(), out = [];
    for (const p of L.pins || []) {
      if (p.kind === 'site' && !siteOpen(p.id, S().revealed)) continue;             // not found yet: not on the map either
      const base = { key: p.kind + ':' + p.id, kind: p.kind, id: p.id, x: p.x, y: p.y, tap: true, here: '', star: false };
      if (p.kind === 'site') out.push({ ...base, label: SITES[p.id].name, cls: S().sitesEntered.has(p.id) ? '' : 'fresh', star: !!(q && q.site === p.id), stars: PAR[p.id] ? starsAt(p.id) : null,
        here: w.kind === 'dungeon' && S().site === p.id ? 'you are here' : '' });
      else if (p.kind === 'town') out.push({ ...base, label: LANDS[r].town, cls: S().reached.has(townOf(r)) ? 'lit' : 'dim', star: !!(q && q.land === r && !q.site), here: w.kind === 'town' ? 'you are here' : '' });
      // (v1.146 critic: a way out stands past the land's edge, and the picture's crop cut its pin off, the Vale's to the
      // Fens wholly) held 4 tiles inside the picture's frame
      else if (LANDS[p.id]) out.push({ ...base, x: Math.min(Math.max(p.x, L.x0 + 4), L.x0 + L.w - 4), y: Math.min(Math.max(p.y, L.y0 + 4), L.y0 + L.h - 4),
        label: `to ${lower(LANDS[p.id].name)}`, cls: sim.landOpen(p.id) ? '' : 'off', star: !!(q && q.land === p.id && q.land !== r) });
    }
    for (const G of ringsShown()) if (r === G.region) { const C = CAMP_BY[G.camp]; out.push(ringPin(C.x, C.y, G)); }
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
      // (v1.142: from anywhere above ground; out on a land the fare adds the way to its town gate: sim/coach.js trip)
      const t = trip(S(), sim.world, p.id);
      if (!t && sim.world.kind !== 'town' && sim.world.kind !== 'overland') { info.textContent = 'The Guild’s coach'; button('Travel', '', 'Climb out first: the coach waits above ground.', () => {}); return; }
      if (!t) { info.textContent = 'No coach goes there yet.'; row.append(info); card.append(row); return; }
      const f = t.fare;
      info.append('The Guild’s coach', el('br'), el('em', '', `${road(t.days)} · ${f} gold`));
      if (t.pickup) info.append(el('br'), el('em', 'pick', `${t.pickup} of it to fetch you here`));
      const why = !S().reached.has(p.id) ? 'Walk there first: the coach goes only where you’ve been.'
        : !sim.landOpen(COACH[p.id].land) ? 'The road there is shut.'
        : (S().counters.gold || 0) < f ? `Not enough gold: the fare is ${f}.` : '';
      button('Travel', '', why, () => { sim.commands.push({ type: 'coach', to: p.id }); close(); });
      return;
    }
    const r = region();
    if (p.kind === 'ring') {                               // the old stones and the Kingstone (GDD §19 v1.105); the Vault's mouth and Furnace Nine (v1.126)
      const G = RINGS[p.ring] || RING, W = RING_WORDS[G.id] || RING_WORDS.kingstone;
      const c = ringClock((q) => q === G), w = sim.world, P = S().player, C = CAMP_BY[G.camp], mm = (/** @type {number} */ t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
      card.append(el('h3', '', W.title), el('div', 'sub', W.sub));
      card.append(el('div', 'sub ring', !c ? '' : c.open ? (paidFor(S(), c.id) ? `It ${W.verb} now · you’ve stood against it this window` : `It ${W.verb} now · ${mm(c.left)} left`)
        : `It ${W.verb} next at ${c.at}${c.soon ? ` · in ${mm(c.until)}` : ''}`));
      card.append(el('div', 'sub', `from level ${G.minLevel} · fought at level ${G.level} · up to five companies · walk into ${W.ground} to fight it`));
      // Walk there: to just outside its reach on your side; a step on and you're in it (and, in a window, its fight)
      let go = null, why = '', steps = '';
      if (w.kind === 'overland' && w.region === G.region) {
        const dx = P.x - C.x, dy = P.y - C.y, d = Math.hypot(dx, dy) || 1, k = Math.min(d, C.reach + 3) / d, s = sim.spotNear(C.x + dx * k, C.y + dy * k);
        if (s) { go = { type: 'goto', tx: s.tx, ty: s.ty, near: 0, then: null, label: W.title }; steps = `about ${s.steps} steps`; } else why = 'No way there from here.';
      } else why = r !== G.region ? W.where : w.kind === 'town' ? 'Take the road out first.' : 'Climb out first.';
      if (go) info.append('The way', el('br'), el('em', '', steps));
      button('Walk there', 'walk', why, () => { if (go) sim.commands.push(go); close(); });
      return;
    }
    if (p.kind === 'spot') {                               // a tap on open ground (v1.72): the walk there, a plain goto
      const w = sim.world, s = p.spot;
      card.append(el('h3', '', 'This spot'), el('div', 'sub', `open ground in ${lower(LANDS[r].name)}`));
      const why = w.kind === 'dungeon' ? 'Climb out first.' : w.kind === 'town' ? 'Take the road out first.' : !s ? 'No way there from here.' : '';
      if (s) info.append('The way', el('br'), el('em', '', `about ${s.steps} steps`));
      button('Walk here', 'walk', why, () => { if (s) sim.commands.push({ type: 'goto', tx: s.tx, ty: s.ty, near: 0, then: null, label: 'Walk here' }); close(); });
      return;
    }
    if (p.kind === 'site') {
      const s = SITES[p.id], fl = s.floors ? `${NUM[s.floors] || s.floors} floor${s.floors === 1 ? '' : 's'}` : 'floors without end';
      // (a boss away, battle.js bossAway v1.73: when he's back, in minutes of game time)
      const boss = Object.entries(s.bosses || {}).map(([d, b]) => { if (!BOSSES[b]) return ''; const a = bossAway(S(), p.id, Number(d) - 1); return BOSSES[b].name + (a ? ` (back in ${Math.max(1, Math.ceil(a.left / 60))} min)` : ''); }).filter(Boolean).join(', ');
      card.append(el('h3', '', s.name), el('div', 'sub', `levels ${levelBand(p.id)} · ${fl}${boss ? ' · ' + boss : ''}`));
      card.append(el('div', 'sub', (S().sitesEntered.has(p.id) ? 'you’ve been in' : 'never entered') + (s.minLevel ? ` · takes a company from level ${s.minLevel}` : '')));
      // (v1.143) its stars: what it has, the best time, and what the next one asks (sim/stars.js PAR)
      if (PAR[p.id]) {
        const rec = S().stars[p.id], n = rec ? rec.n : 0, [qk, ok] = PAR[p.id], mm = (/** @type {number} */ t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
        const st = el('div', 'sub stars-line'); st.append(el('b', '', '★'.repeat(n)), el('i', '', '☆'.repeat(3 - n)));
        st.append(` ${n} of 3` + (rec && rec.best != null ? ` · best ${mm(rec.best)}${rec.clean ? ', nobody down' : ''}` : ''));
        card.append(st, el('div', 'sub', n >= 3 ? 'Every star taken.' : `★ the end reached · ★★ inside ${ok} min · ★★★ inside ${qk} min with nobody down`));
      }
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
  // the button sits on the minimap as drawn this frame, and only while there is one
  let seatKey = '';
  (function seat() {
    const m = minimap(), key = m ? `${m.l},${m.t},${m.r},${m.b}` : '';
    if (key !== seatKey) {
      seatKey = key; btn.classList.toggle('on', !!m);
      if (m) Object.assign(btn.style, { left: `${m.l}px`, top: `${m.t}px`, width: `${m.r - m.l}px`, height: `${m.b - m.t}px` });
    }
    requestAnimationFrame(seat);
  })();
  addEventListener('resize', () => { if (open) relay(); });
  sim.bus.on('levelChanged', () => { if (open) show(tab); });
  sim.bus.on('questTracked', () => { if (open) show(tab); });

  // (v1.143) a dungeon's run ended: its stars, and the map's button lit when it's a new best
  sim.bus.on('dungeonStars', (e) => { const n = e.n, mm = `${Math.floor(e.secs / 60)}:${String(e.secs % 60).padStart(2, '0')}`; toast(`${SITES[e.site].name} · ${'★'.repeat(n)}${'☆'.repeat(3 - n)} · ${mm}${e.downs ? '' : ', nobody down'}`, 3600); if (n > e.was) btn.classList.add('due'); });
  // a town reached for the first time: the coach stops there now
  sim.bus.on('townReached', (e) => { btn.classList.add('due'); toast(`${e.name} · the Guild’s coach stops here now`, 2800); });
  // the trip: a card while the other town comes up (the sim moved you at once; the day on the road is words)
  let hideAt = 0;
  sim.bus.on('coach', (e) => {
    coachCard.textContent = '';
    const box = el('div'); box.append(el('b', '', 'The Guild’s coach'), el('span', '', `${COACH[e.from].name} to ${COACH[e.to].name}`), el('span', '', `${road(e.days)} · ${e.fare} gold`));
    coachCard.append(box); coachCard.classList.add('on');
    clearTimeout(hideAt); hideAt = setTimeout(() => coachCard.classList.remove('on'), 2200);
  });

  return { open: openMap, close, get isOpen() { return open; } };
}
