// @ts-check
// main.js — the Frontier's page (frontier.html; docs/frontier-proposal.md §5): boots the sim on the wall map's coast,
// runs it at a fixed 20 Hz, and turns the thumb into commands: drag in the lower two-thirds and the stick runs the party;
// let go and the sim locks the screen's area to fight in; two fingers, the wheel or the − / + buttons zoom; a tap reads the
// land. A sandbox: no save is read or written. On localhost ?manual hands the clock to a capture script
// (globalThis.__frame(ms)), and globalThis.__fr is the sim.

import { createFrontier, conOf, TICK_HZ } from '../sim/frontier/frontier.js';
import { GROUND_NAMES, CH } from '../sim/frontier/land.js';
import { TOWNS, K } from '../sim/frontier/geo.js';
import { createView, CON, KIND_NAME } from './view.js';
import { xpToNext as xpNext } from '../sim/party.js';

const params = new URLSearchParams(location.search);
const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));
const canvas = /** @type {HTMLCanvasElement} */ ($('map'));

const coast = (await (await fetch('./assets/maps/old-provinces.json')).json()).coast;
const fr = createFrontier(20260807, coast, { level: Math.max(1, Math.min(75, +(params.get('lv') || 1))), town: TOWNS.some((t) => t.id === params.get('town')) ? /** @type {string} */ (params.get('town')) : 'thornwick' });
const view = createView(canvas, fr);
if (params.has('zoom')) view.cam.s = Math.max(0.15, Math.min(40, +(/** @type {string} */ (params.get('zoom'))) || 16));
if (LOCAL) Object.assign(globalThis, { __fr: fr, __view: view });

// ── toasts ──────────────────────────────────────────────────────────────────────────────────────────────────────────
let toastT = 0;
function toast(/** @type {string} */ msg, ms = 2600) { const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), ms); }
fr.bus.on('level', (e) => { if (e.name === fr.state.party[0].name) toast(`The party is level ${e.level}`); });
fr.bus.on('wipe', (e) => toast(`The party fell. They wake in ${e.name}'s square at 30 %.`, 4000));
fr.bus.on('lock', () => toast('Holding: the party fights everything on the screen', 2000));
toast('Drag in the lower two-thirds to run · let go to hold and fight · pinch or − + to zoom', 6000);

// ── the thumb: the stick, the pinch, the tap ─────────────────────────────────────────────────────────────────────────
const STICK_MAX = 48, SLOP = 11, TAP_MS = 260;
/** @type {Map<number, { x0: number, y0: number, x: number, y: number, t0: number }>} */
const ptrs = new Map();
let stick = /** @type {{ x: number, y: number } | null} */ (null), pinch = /** @type {{ d0: number, s0: number } | null} */ (null);
const stickEl = $('stick'), knob = /** @type {HTMLElement} */ (stickEl.firstElementChild);
canvas.addEventListener('pointerdown', (e) => {
  canvas.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId, { x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, t0: performance.now() });
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, s0: view.cam.s }; stick = null; stickEl.style.display = 'none'; }
});
canvas.addEventListener('pointermove', (e) => {
  const p = ptrs.get(e.pointerId); if (!p) return;
  p.x = e.clientX; p.y = e.clientY;
  if (pinch && ptrs.size >= 2) { const [a, b] = [...ptrs.values()]; zoomTo(pinch.s0 * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d0); return; }
  if (pinch) return;
  const dx = p.x - p.x0, dy = p.y - p.y0, d = Math.hypot(dx, dy);
  if (!stick && d > SLOP && p.y0 > innerHeight * 0.3) { stick = { x: 0, y: 0 }; stickEl.style.display = 'block'; stickEl.style.left = `${p.x0}px`; stickEl.style.top = `${p.y0}px`; $('info').classList.remove('on'); }
  if (stick) { const k = Math.min(1, d / STICK_MAX) / (d || 1); stick.x = dx * k; stick.y = dy * k; knob.style.transform = `translate(${stick.x * STICK_MAX * 0.6}px, ${stick.y * STICK_MAX * 0.6}px)`; }
});
const up = (/** @type {PointerEvent} */ e) => {
  const p = ptrs.get(e.pointerId); if (!p) return;
  ptrs.delete(e.pointerId);
  if (pinch) { if (ptrs.size === 0) pinch = null; return; }
  if (stick) { stick = null; stickEl.style.display = 'none'; knob.style.transform = ''; fr.commands.push({ type: 'release', ...view.screenArea() }); return; }
  if (performance.now() - p.t0 < TAP_MS && Math.hypot(p.x - p.x0, p.y - p.y0) < SLOP) read(p.x, p.y);
};
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
canvas.addEventListener('wheel', (e) => { e.preventDefault(); zoomTo(view.cam.s * Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
for (const b of document.querySelectorAll('#btns button, #menu')) for (const ev of ['pointerdown', 'touchstart', 'mousedown']) b.addEventListener(ev, (e) => e.stopPropagation());
const zoomTo = (/** @type {number} */ s) => { view.cam.s = Math.max(0.15, Math.min(40, s)); };
$('zin').addEventListener('click', () => zoomTo(view.cam.s * 1.8));
$('zout').addEventListener('click', () => zoomTo(view.cam.s / 1.8));
$('lvls').addEventListener('click', () => { view.opts.levels = !view.opts.levels; $('lvls').classList.toggle('on', view.opts.levels); });

// a tap: what's there (the region, the ground, its level, the nearest camp)
function read(/** @type {number} */ px, /** @type {number} */ py) {
  const t = view.toTile(px, py), I = fr.inspect(t.x, t.y), el = $('info');
  if (!I) { el.innerHTML = '<b>The sea</b>'; el.classList.add('on'); setTimeout(() => el.classList.remove('on'), 2500); return; }
  let best = null, bd = 40;
  for (let cy = Math.floor((t.y - 40) / CH); cy <= Math.floor((t.y + 40) / CH); cy++) for (let cx = Math.floor((t.x - 40) / CH); cx <= Math.floor((t.x + 40) / CH); cx++) {
    if (cx < 0 || cy < 0 || cx >= fr.land.CW || cy >= fr.land.CHN) continue;
    for (const k of fr.land.chunk(cx, cy).camps) { const d = Math.hypot(k.x - t.x, k.y - t.y); if (d < bd) { bd = d; best = k; } }
  }
  const lv = fr.partyLv(), esc = (/** @type {string} */ s) => s.replace(/[&<]/g, (c) => (c === '&' ? '&amp;' : '&lt;'));
  let h = `<b>${esc(I.region)}</b> · levels ${I.band[0]}–${I.band[1]}<br>${GROUND_NAMES[I.ground]}${I.walk ? '' : ' (no way across)'} · this ground is level <span style="color:${CON[conOf(I.level, lv)]}">${I.level}</span>`;
  if (best) {
    const at = fr.state.respawnAt.get(best.id), down = at ? at.filter((x) => x > fr.state.tick).length : 0, kinds = best.foes.map((f) => KIND_NAME[f.kind] + (f.warden ? ' (warden)' : f.elite ? ' (elite)' : '')).join(', ');
    const word = { wanderer: 'A wanderer', pack: 'A pack', camp: 'A camp', elite: 'An elite and its guards', lair: `${best.name}'s lair` }[best.kind];
    h += `<br>${word}, ${Math.round(bd)} tiles off: level <span style="color:${CON[conOf(best.lv, lv)]}">${best.lv}</span> · ${esc(kinds)}${down ? ` · ${down} fallen, back in ${Math.ceil((Math.min(...at.filter((x) => x > fr.state.tick)) - fr.state.tick) / TICK_HZ)} s` : ''}`;
  }
  el.innerHTML = h; el.classList.add('on'); clearTimeout(readT); readT = setTimeout(() => el.classList.remove('on'), 5000);
}
let readT = 0;

// ── the menu: the party's level, the towns, the fog ─────────────────────────────────────────────────────────────────
const menu = $('menu');
$('menuBtn').addEventListener('click', () => { $('lvNow').textContent = String(fr.partyLv()); menu.classList.add('on'); });
$('close').addEventListener('click', () => menu.classList.remove('on'));
menu.addEventListener('click', (e) => { if (e.target === menu) menu.classList.remove('on'); });
const setLv = (/** @type {number} */ n) => { n = Math.max(1, Math.min(75, n)); fr.commands.push({ type: 'level', n }); $('lvNow').textContent = String(n); };
$('lvDown').addEventListener('click', () => setLv(+($('lvNow').textContent || 1) - 1));
$('lvUp').addEventListener('click', () => setLv(+($('lvNow').textContent || 1) + 1));
$('lvAt').addEventListener('click', () => { const H = fr.state.party[0]; setLv(fr.land.levelAt(H.x, H.y) || 1); });
for (const t of TOWNS) {
  const b = document.createElement('button'), R = fr.land.regionAt(t.x * K, t.y * K), lv = Math.round(fr.land.baseLevel(t.x * K, t.y * K));
  b.innerHTML = `${t.name}<small>${R ? R.name.replace(/^The /, '') : ''} · about ${lv}</small>`;
  b.addEventListener('click', () => { fr.commands.push({ type: 'jump', town: t.id }); menu.classList.remove('on'); toast(t.name); });
  $('towns').append(b);
}
$('fogBtn').addEventListener('click', () => { view.opts.fog = !view.opts.fog; $('fogBtn').textContent = `Fog: ${view.opts.fog ? 'on' : 'off'}`; });

// ── the HUD: where you are, the party, the locked area ─────────────────────────────────────────────────────────────────────
let lastRegion = '', hudT = 0;
function hud() {
  const H = fr.state.party[0], R = fr.land.regionAt(H.x, H.y), lv = fr.partyLv(), here = fr.land.levelAt(H.x, H.y);
  if (R && R.name !== lastRegion) { if (lastRegion) toast(`${R.name} · levels ${R.band[0]}–${R.band[1]}`); lastRegion = R.name; }
  $('where').textContent = R ? R.name : 'the Frontier';
  $('band').innerHTML = R ? `levels ${R.band[0]}–${R.band[1]} · this ground <span style="color:${CON[conOf(here, lv)]}">${here}</span> · the party <span style="color:#f0c880">${lv}</span>` : '';
  $('party').innerHTML = fr.state.party.map((m) => `<div class="pm"><div class="n">${m.name} · ${m.cls}${m.down ? ' · down' : ''}</div><div class="bar"><i style="width:${Math.round(100 * m.hp / m.st.maxHp)}%"></i></div></div>`).join('')
    + `<div class="pm" style="flex:0.8"><div class="n">XP</div><div class="bar xp"><i style="width:${Math.round(100 * Math.min(1, H.xp / Math.max(1, xpNext(H.level))))}%"></i></div></div>`;
  const s = view.cam.s; $('zoomTier').textContent = s >= 10 ? 'near' : s >= 1.5 ? 'map' : 'the Guild\'s map';
  const I = fr.lockInfo(), card = $('lockCard');
  card.classList.toggle('on', !!I);
  if (I) card.innerHTML = `<b>Holding</b> · ${I.camps ? `${I.camps} camp${I.camps > 1 ? 's' : ''}, ${I.lo === I.hi ? `level ${I.lo}` : `levels ${I.lo}–${I.hi}`}` : 'no camp on the screen: drag on to find one'}`
    + `<br>${I.standing} standing${I.next !== null ? ` · the next stands in <em>${Math.ceil(I.next)} s</em>` : ''} · ${I.kills} slain · <em>${I.mins >= 0.5 ? I.xpMin : '…'}</em> XP a minute`;
}

// ── the loop: the sim at 20 Hz, the view every frame ───────────────────────────────────────────────────────────────
let last = performance.now(), acc = 0;
const DT = 1 / TICK_HZ;
function frame(/** @type {number} */ now) {
  if (!MANUAL) requestAnimationFrame(frame);
  acc += Math.min(0.25, (now - last) / 1000); last = now;
  while (acc >= DT) {
    if (stick) fr.commands.push({ type: 'stick', x: stick.x, y: stick.y });
    view.beforeTick(); fr.tick(); acc -= DT;
  }
  view.draw(acc / DT);
  if (now - hudT > 200) { hudT = now; hud(); }
}
const MANUAL = LOCAL && params.has('manual');
if (MANUAL) { let mt = performance.now(); last = mt; Object.assign(globalThis, { __frame: (ms = 1000 / 60) => { mt += ms; frame(mt); } }); }
else requestAnimationFrame(frame);
