// @ts-check
// forgefx.js (ui) — the forge's upgrade, played out (GDD §8 v1.114; the owner: "Add a cool animation effect for upgrading
// gear", on the prototype, docs/img/forge/): over the smith's sheet, the piece on the anvil and the one given up over it;
// the one given up burns into embers that pour into it, three hammer blows throw sparks, and then the verdict: a gold
// flare and the new +N (it took), a grey fizzle (it failed: the +N it's left at), or the piece cracking apart (it broke).
// The sim has already decided (smith.js 'forged' { result }); this only shows it. Presentation only, swallows its taps.
// prefers-reduced-motion: the same beats, short and without the particles.
import { swallow } from './actorart.js';
import { BASES } from '../sim/items.js';

const CSS = `
#forgeFx { position: fixed; inset: 0; z-index: 60; display: none; place-items: center; background: rgba(8,6,5,.86);
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); }
#forgeFx.on { display: grid; }
#forgeFx .stage { position: relative; width: min(92vw, 420px); height: min(70vh, 420px); border-radius: 14px; overflow: hidden; isolation: isolate;
  background: radial-gradient(ellipse 60% 45% at 50% 78%, rgba(240,138,60,.22), transparent 70%), radial-gradient(ellipse at 50% 30%, #2a201b, #120d0b 75%); border: 1px solid #3a2e27; }
#forgeFx canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3; pointer-events: none; }
#forgeFx .anvil { position: absolute; left: 50%; bottom: 40px; width: 210px; height: 74px; transform: translateX(-50%); z-index: 1; }
#forgeFx .anvil::before { content: ""; position: absolute; inset: 0 14px 30px; background: linear-gradient(#4a4f57, #2b2e33); border-radius: 6px 6px 3px 3px; box-shadow: inset 0 2px 0 rgba(255,255,255,.12); }
#forgeFx .anvil::after { content: ""; position: absolute; left: 62px; right: 62px; bottom: 0; height: 32px; background: linear-gradient(#34373d, #1d1f23); clip-path: polygon(14% 0, 86% 0, 100% 100%, 0 100%); }
#forgeFx .horn { position: absolute; left: -18px; top: 6px; width: 46px; height: 22px; background: linear-gradient(#454a52, #2b2e33); border-radius: 30px 0 0 30px; }
#forgeFx .piece { position: absolute; left: 50%; bottom: 110px; width: 104px; height: 104px; transform: translateX(-50%); z-index: 2; display: grid; place-items: center;
  border-radius: 14px; border: 2px solid var(--rc); background: radial-gradient(circle at 50% 40%, #2d2530, #15111a); box-shadow: 0 0 16px -4px var(--rc); transition: opacity .25s; }
#forgeFx .piece img { width: 76px; height: 76px; object-fit: contain; }
#forgeFx .piece .up { position: absolute; right: -10px; top: -10px; min-width: 30px; padding: 2px 7px; border-radius: 999px; background: #e8b65a; color: #1a120c; font: 700 15px/1.4 system-ui, sans-serif; text-align: center; }
#forgeFx .piece.gone { opacity: 0; }
#forgeFx .offer { position: absolute; left: 50%; top: 70px; width: 56px; height: 56px; transform: translateX(-50%); z-index: 2; display: grid; place-items: center; border-radius: 10px; border: 2px solid var(--rc); background: #1a1418; opacity: 0; }
#forgeFx .offer img { width: 40px; height: 40px; object-fit: contain; }
#forgeFx .hammer { position: absolute; right: 16%; bottom: 158px; width: 26px; height: 120px; z-index: 2; transform-origin: 50% 100%; transform: rotate(38deg); opacity: 0; }
#forgeFx .hammer::before { content: ""; position: absolute; left: 10px; top: 20px; width: 7px; bottom: 0; background: linear-gradient(90deg, #6b4a32, #8a6342); border-radius: 3px; }
#forgeFx .hammer::after { content: ""; position: absolute; left: -16px; top: 0; width: 58px; height: 28px; background: linear-gradient(#5c626b, #33373d); border-radius: 4px; }
#forgeFx .verdict { position: absolute; left: 8px; right: 8px; top: 18px; z-index: 4; text-align: center; font: 700 24px/1.15 Georgia, 'Times New Roman', serif; opacity: 0; transition: opacity .3s; text-shadow: 0 2px 10px rgba(0,0,0,.8); }
#forgeFx .verdict small { display: block; margin-top: 6px; font: 500 14px/1.3 system-ui, sans-serif; color: #b7a796; }
#forgeFx .verdict.on { opacity: 1; } #forgeFx .verdict.ok { color: #e8b65a; } #forgeFx .verdict.fail { color: #9aa0a8; } #forgeFx .verdict.broke { color: #e0574a; }
#forgeFx .done { position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%); z-index: 5; min-width: 140px; min-height: 44px; border: 0; border-radius: 10px;
  background: linear-gradient(#f5c46b, #e09a3a); color: #1a120c; font: 700 16px/1 Georgia, serif; opacity: 0; pointer-events: none; transition: opacity .3s; }
#forgeFx .done.on { opacity: 1; pointer-events: auto; }
#forgeFx .stage.shake { animation: forgeShake .42s linear; }
@keyframes forgeShake { 0%,100% { transform: none; } 20% { transform: translate(-5px, 2px); } 40% { transform: translate(5px, -2px); } 60% { transform: translate(-3px, 1px); } 80% { transform: translate(3px, 0); } }
@media (prefers-reduced-motion: reduce) { #forgeFx .stage.shake { animation: none; } }
`;
const RC = { common: '#b9b2a4', fine: '#72d06c', rare: '#5aa8ff', heirloom: '#f2a33c' };
const HUE = { common: 30, fine: 110, rare: 210, heirloom: 36 };
const icon = (it) => `./assets/items/${(BASES[it.base] || { icon: 'ring' }).icon}.png`;

/** the overlay, made once: play({ item, offer, result, was, up }) shows one upgrade start to end */
export function createForgeFx() {
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const wrap = document.createElement('div'); wrap.id = 'forgeFx'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', 'The forge');
  wrap.innerHTML = `<div class="stage"><div class="verdict"></div><div class="offer"><img alt=""></div><div class="hammer"></div>
    <div class="piece"><img alt=""><span class="up"></span></div><div class="anvil"><div class="horn"></div></div><canvas></canvas><button class="done" type="button">Done</button></div>`;
  document.body.appendChild(wrap); swallow(wrap);
  const $ = (s) => /** @type {HTMLElement} */ (wrap.querySelector(s)), stage = $('.stage'), cv = /** @type {HTMLCanvasElement} */ ($('canvas')), g = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  const parts = [], shards = []; let ring = null, flash = 0, last = 0, raf = 0, open = false;
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce() ? Math.min(ms, 120) : ms));
  const size = () => { const r = stage.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); cv.width = r.width * d; cv.height = r.height * d; g.setTransform(d, 0, 0, d, 0, 0); };
  const centre = () => { const r = stage.getBoundingClientRect(), p = $('.piece').getBoundingClientRect(); return { x: p.left - r.left + p.width / 2, y: p.top - r.top + p.height / 2, w: r.width, h: r.height, ph: p.height }; };
  const sparks = (x, y, n, hue, sp = 1) => { if (reduce()) return; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4, v = (2 + Math.random() * 5) * sp; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.6, t: 0, hue, size: 1.5 + Math.random() * 2, g: 0.18 }); } };
  const shake = () => { stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake'); };
  function frame(now) {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now;
    const c = centre(); g.clearRect(0, 0, c.w, c.h);
    if (flash > 0) { const grd = g.createRadialGradient(c.x, c.y, 0, c.x, c.y, 170); grd.addColorStop(0, `rgba(255,214,140,${flash})`); grd.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = grd; g.fillRect(0, 0, c.w, c.h); flash = Math.max(0, flash - dt * 1.6); }
    if (ring) { ring.t += dt; const k = ring.t / 0.7; if (k >= 1) ring = null; else { g.strokeStyle = `rgba(232,182,90,${1 - k})`; g.lineWidth = 4 * (1 - k) + 1; g.beginPath(); g.ellipse(ring.x, ring.y + 40, 30 + 140 * k, 10 + 46 * k, 0, 0, Math.PI * 2); g.stroke(); } }
    for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.t += dt; if (p.t > p.life) { parts.splice(i, 1); continue; } if (p.t < 0) continue;
      if (p.to) { const k = Math.min(1, p.t / p.life), e = k * k; p.x = p.x0 + (p.to.x - p.x0) * e + Math.sin(k * 6 + p.ph) * 14 * (1 - k); p.y = p.y0 + (p.to.y - p.y0) * e; }
      else { p.vy += p.g; p.x += p.vx; p.y += p.vy; }
      const a = 1 - p.t / p.life; g.fillStyle = p.hue === 'ash' ? `rgba(150,150,158,${a})` : `hsla(${p.hue},100%,${60 + 20 * a}%,${a})`; g.beginPath(); g.arc(p.x, p.y, p.size * (0.6 + a * 0.6), 0, Math.PI * 2); g.fill(); }
    for (let i = shards.length - 1; i >= 0; i--) { const s = shards[i]; s.t += dt; if (s.t > 1.4) { shards.splice(i, 1); continue; } s.vy += 0.35; s.x += s.vx; s.y += s.vy; s.rot += s.vr; if (s.y > s.floor) { s.y = s.floor; s.vy *= -0.3; s.vx *= 0.6; }
      g.save(); g.translate(s.x, s.y); g.rotate(s.rot); g.globalAlpha = Math.max(0, 1 - s.t / 1.4); g.fillStyle = s.c; g.beginPath(); g.moveTo(-s.r, -s.r * 0.6); g.lineTo(s.r, -s.r * 0.2); g.lineTo(s.r * 0.2, s.r); g.closePath(); g.fill(); g.restore(); }
    if (open) raf = requestAnimationFrame(frame);
  }
  let finish = () => {};
  $('.done').addEventListener('click', () => finish());
  /** @param {{ item: any, offer: any, result: 'ok' | 'fail' | 'broke', was: number, up: number }} o @returns {Promise<void>} */
  async function play({ item, offer, result, was, up }) {
    open = true; wrap.classList.add('on'); size(); parts.length = 0; shards.length = 0; ring = null; flash = 0; last = 0;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
    const P = $('.piece'), V = $('.verdict'), D = $('.done'), off = $('.offer'), H = $('.hammer');
    P.style.setProperty('--rc', RC[item.r] || RC.common); /** @type {HTMLImageElement} */ (P.querySelector('img')).src = icon(item); $('.piece .up').textContent = '+' + was; P.classList.remove('gone');
    V.className = 'verdict'; V.textContent = ''; D.classList.remove('on');
    // the piece given up, over the anvil; then burnt to embers that pour into the piece
    off.style.setProperty('--rc', RC[offer.r] || RC.common); /** @type {HTMLImageElement} */ (off.querySelector('img')).src = icon(offer);
    off.style.transition = 'none'; off.style.opacity = '1'; off.style.transform = 'translateX(-50%) scale(1)';
    await wait(380);
    const c = centre(), sr = stage.getBoundingClientRect(), or = off.getBoundingClientRect(), ox = or.left - sr.left + or.width / 2, oy = or.top - sr.top + or.height / 2;
    off.style.transition = 'opacity .45s, transform .45s'; off.style.opacity = '0'; off.style.transform = 'translateX(-50%) scale(.6)';
    if (!reduce()) for (let i = 0; i < 46; i++) parts.push({ x0: ox + (Math.random() - 0.5) * 40, y0: oy + (Math.random() - 0.5) * 40, x: ox, y: oy, to: { x: c.x + (Math.random() - 0.5) * 30, y: c.y + (Math.random() - 0.5) * 30 }, ph: Math.random() * 6, life: 0.55 + Math.random() * 0.35, t: -Math.random() * 0.25, hue: HUE[offer.r] || 30, size: 2 + Math.random() * 2 });
    await wait(820);
    // three blows
    H.style.opacity = '1';
    for (let i = 0; i < 3; i++) {
      H.style.transition = 'transform .16s ease-in'; H.style.transform = 'rotate(38deg)'; await wait(140);
      H.style.transform = 'rotate(-58deg)'; await wait(150);
      const c2 = centre(); sparks(c2.x, c2.y + 34, 26 + i * 8, 28 + i * 6); if (!reduce()) shake(); flash = 0.35 + i * 0.12;
      H.style.transition = 'transform .22s ease-out'; H.style.transform = 'rotate(30deg)'; await wait(i < 2 ? 260 : 340);
    }
    H.style.opacity = '0';
    // the verdict (the sim's)
    const c3 = centre(), name = item.name, line = (t, s) => { V.textContent = t; const sm = document.createElement('small'); sm.textContent = s; V.appendChild(sm); };
    if (result === 'ok') {
      $('.piece .up').textContent = '+' + up; flash = 1; ring = { x: c3.x, y: c3.y, t: 0 }; sparks(c3.x, c3.y, 70, 42, 1.4);
      V.className = 'verdict ok on'; line(`It takes: +${up}`, `${name} is +${up} now`);
    } else if (result === 'fail') {
      $('.piece .up').textContent = '+' + up;
      if (!reduce()) for (let i = 0; i < 30; i++) parts.push({ x: c3.x + (Math.random() - 0.5) * 60, y: c3.y + 20, vx: (Math.random() - 0.5) * 2, vy: -1 - Math.random() * 2, g: -0.02, life: 1 + Math.random(), t: 0, hue: 'ash', size: 3 + Math.random() * 3 });
      V.className = 'verdict fail on'; line('The steel didn’t take', up < was ? `${name} drops to +${up}` : `${name} stays +${up}`);
    } else {
      flash = 0.6; if (!reduce()) shake(); P.classList.add('gone');
      if (!reduce()) for (let i = 0; i < 22; i++) shards.push({ x: c3.x + (Math.random() - 0.5) * 60, y: c3.y + (Math.random() - 0.5) * 60, vx: (Math.random() - 0.5) * 9, vy: -3 - Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, r: 5 + Math.random() * 9, c: i % 3 ? '#7d828b' : (RC[item.r] || RC.common), t: 0, floor: c3.y + c3.ph / 2 + 6 });
      sparks(c3.x, c3.y, 40, 8, 1.2);
      V.className = 'verdict broke on'; line('It broke on the anvil', `${name} +${was} is lost`);
    }
    await wait(500); D.classList.add('on');
    return new Promise((res) => { finish = () => { open = false; cancelAnimationFrame(raf); wrap.classList.remove('on'); finish = () => {}; res(); }; });
  }
  return { play, get isOpen() { return open; } };
}
