// @ts-check
// player.js — the boot screens and the intro, "The Chronicle of the Fall" (development plan §2.1;
// approved as docs/intro-mockup.html). One full-screen overlay, three uses:
//   boot(ready)  studio splash → loading screen (lore tips, a real progress bar that waits on
//                `ready`) → "Tap to begin". The tap is the gesture that lets the music start.
//   intro()      the six cards of content/cutscenes/intro.json: a painted scene (scenes.js), a
//                music cue (score.js), and the lines, one at a time. Tap shows every line, tap
//                again moves on; Skip ends it. Resolves when it's over.
//   stopMusic()  the score fades out (entering play).
// Presentation only: it never touches the sim. main.js pauses the sim while it's up.

import { paint, W, H } from './scenes.js';
import { createScore } from './score.js';
import { soundSettings, setSoundSettings, onSoundSettings, DEFAULTS } from '../audio/settings.js';
import { musicLevel } from '../audio/engine.js';
import { swallow } from '../ui/actorart.js';

const CSS = `
@font-face { font-family: 'IM Fell English'; font-style: normal; font-weight: 400; font-display: swap; src: url(./assets/fonts/im-fell-english.woff2) format('woff2'); }
@font-face { font-family: 'IM Fell English'; font-style: italic; font-weight: 400; font-display: swap; src: url(./assets/fonts/im-fell-english-italic.woff2) format('woff2'); }
@font-face { font-family: 'IM Fell English SC'; font-style: normal; font-weight: 400; font-display: swap; src: url(./assets/fonts/im-fell-english-sc.woff2) format('woff2'); }
#cine { position: fixed; inset: 0; z-index: 40; background: #070508; color: #f3e6cf; display: none; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; cursor: pointer; }
#cine.on { display: block; }
#cine:focus { outline: none; }
#cine [hidden] { display: none !important; }
#cine .col { position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); overflow: hidden; }
#cine canvas { position: absolute; left: 0; top: 0; }
#cine .layer { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; z-index: 2; }
#cine .veil { position: absolute; inset: 0; background: #000; opacity: 0; pointer-events: none; transition: opacity .45s ease; z-index: 3; }
#cine .veil.on { opacity: 1; }
#cine .splash { justify-content: center; align-items: center; gap: 10px; background: #050407; font: 600 12px ui-monospace, Menlo, monospace; letter-spacing: .4em; text-transform: uppercase; color: #d9cdb8; }
#cine .splash .dot, #bootSplash .dot { width: 8px; height: 8px; border-radius: 50%; background: #ff8a3a; box-shadow: 0 0 14px #ff8a3a; }
#cine .logo { font: 400 46px/1 'IM Fell English SC', Georgia, serif; letter-spacing: .08em; text-align: center; text-shadow: 0 2px 24px rgba(0,0,0,.8); }
#cine .logo em { font-style: normal; color: #ff8a3a; text-shadow: 0 0 22px rgba(255,138,58,.55); }
#cine .bottom { padding: 0 26px calc(env(safe-area-inset-bottom, 0px) + 46px); display: grid; gap: 14px; }
#cine .bar { height: 3px; border-radius: 2px; background: rgba(255,255,255,.14); overflow: hidden; }
#cine .bar i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, #8a2a14, #ff8a3a, #ffd89a); box-shadow: 0 0 10px #ff8a3a; transition: width .2s linear; }
#cine .tip { font: italic 15px/1.45 'IM Fell English', Georgia, serif; min-height: 70px; }
#cine .tip small { display: block; font: 600 10px ui-monospace, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; font-style: normal; color: #ff9a4d; margin-top: 5px; }
#cine .begin { justify-self: center; min-height: 44px; padding: 0 18px; background: none; border: 0; color: #f3e6cf; font: 600 12px ui-monospace, Menlo, monospace; letter-spacing: .22em; text-transform: uppercase; animation: cineBreathe 2.4s ease-in-out infinite; }
@keyframes cineBreathe { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
#cine .txt { padding: 0 24px calc(env(safe-area-inset-bottom, 0px) + 44px); display: grid; gap: 6px; }
#cine .when { font: 600 10.5px/1.2 ui-monospace, Menlo, monospace; letter-spacing: .18em; text-transform: uppercase; color: #ff9a4d; }
#cine .age { font: 400 31px/1.05 'IM Fell English SC', Georgia, serif; letter-spacing: .02em; text-wrap: balance; }
#cine .say { font: 16px/1.5 'IM Fell English', Georgia, serif; margin-top: 4px; }
#cine .say span { opacity: 0; transition: opacity .6s ease; }
#cine .say span.in { opacity: 1; }
#cine .say span.hook { display: block; font: italic 19px/1.35 'IM Fell English', Georgia, serif; color: #fff3df; margin-bottom: 6px; }
#cine .say span.last { display: block; margin-top: 6px; color: #ffcf8f; font-style: italic; }
#cine .chip { position: absolute; top: calc(env(safe-area-inset-top, 0px) + 12px); z-index: 5; min-width: 44px; min-height: 44px; padding: 0 14px; border-radius: 999px;
  font: 600 11px ui-monospace, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; background: rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.2); color: #f3e6cf; }
#cine .skip { right: 14px; } #cine .mute { left: 14px; }
#cine .pips { position: absolute; left: 0; right: 0; bottom: calc(env(safe-area-inset-bottom, 0px) + 14px); display: flex; justify-content: center; gap: 6px; z-index: 4; }
#cine .pips i { width: 16px; height: 3px; border-radius: 2px; background: rgba(255,255,255,.2); }
#cine .pips i.on { background: #ff8a3a; }
@media (prefers-reduced-motion: reduce) { #cine .begin { animation: none; } #cine .say span, #cine .veil { transition: none; } }
`;
const LINE_MS = 1500, FADE_MS = 450, SPLASH_MS = 1500, MIN_LOAD_MS = 2400, MAX_LOAD_MS = 12000, TIP_MS = 7800;   // a tip holds 7.8 s (2.6 s cycled too fast to read)

export function createCinema() {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const root = document.createElement('div'); root.id = 'cine'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'The Chronicle of the Fall'); root.tabIndex = 0;
  root.innerHTML = `<div class="col"><canvas></canvas>
    <div class="layer splash" hidden><div class="dot"></div><div>No Game Studios</div></div>
    <div class="layer load" hidden><div class="bottom"><div class="logo">EMBER<em>FALL</em></div><div class="bar"><i></i></div><div class="tip"></div><button class="begin" hidden>Tap to begin</button></div></div>
    <div class="layer card" hidden><div class="txt"><div class="when"></div><div class="age"></div><div class="say" aria-live="polite"></div></div></div>
    <div class="veil"></div><button class="chip skip" hidden>Skip ›</button><button class="chip mute" hidden></button><div class="pips" hidden></div></div>`;
  document.body.appendChild(root); swallow(root);
  const $ = (/** @type {string} */ q) => /** @type {HTMLElement} */ (root.querySelector(q));
  const col = $('.col'), stage = /** @type {HTMLCanvasElement} */ ($('canvas')), veil = $('.veil'), skipBtn = $('.skip'), muteBtn = $('.mute'), pips = $('.pips');
  const L = { splash: $('.splash'), load: $('.load'), card: $('.card') };
  const score = createScore();
  // the music's level is the menu's Music slider (audio/settings.js); ♪ here sets it to 0, or back to where it was
  score.setLevel(musicLevel(soundSettings()));
  onSoundSettings((s) => { score.setLevel(musicLevel(s)); muteLabel(); });
  let musicWas = soundSettings().music || DEFAULTS.music;
  const muteLabel = () => { muteBtn.textContent = score.muted ? '♪ off' : '♪ on'; muteBtn.setAttribute('aria-label', score.muted ? 'Music off' : 'Music on'); };
  muteLabel();

  /** @type {any} */ let content = null;
  const load = () => content || (content = Promise.all(['cutscenes/intro', 'tips'].map((f) => fetch(`./content/${f}.json`).then((r) => r.json())))
    .then(([intro, tips]) => ({ cards: intro.cards, tips: tips.tips })).catch(() => ({ cards: [], tips: [] })));

  // ── the stage: a portrait column, as wide as fits; below the painting is black ground.
  // The scenes drift slowly, so they paint at 30 fps; if a frame still takes too long (a
  // software-rendered canvas: ~40 ms at 2× in headless Chromium, ~13 ms at 1×), the resolution
  // steps down from 2× toward 1×.
  let scene = 'year301', t0 = performance.now(), running = false, playing = false, cardIx = -1, maxDpr = 2, lastPaint = 0, cost = 0;
  function size() {
    const w = Math.floor(Math.min(window.innerWidth, 520, window.innerHeight * W / H)), dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
    col.style.width = w + 'px'; stage.style.width = w + 'px'; stage.style.height = Math.round(w * H / W) + 'px';
    stage.width = Math.round(w * dpr); stage.height = Math.round(stage.width * H / W);
  }
  function frame(/** @type {number} */ now) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (!L.splash.hidden || now - lastPaint < 31) return;
    lastPaint = now; const a = performance.now();
    paint(stage, scene, Math.max(0, (now - t0) / 1000), true);
    cost = cost * 0.9 + (performance.now() - a) * 0.1;
    if (cost > 24 && maxDpr > 1 && (window.devicePixelRatio || 1) > 1) { maxDpr = Math.max(1, maxDpr - 0.25); cost = 12; size(); }
  }
  function open() { root.classList.add('on'); size(); if (!running) { running = true; requestAnimationFrame(frame); } root.focus({ preventScroll: true }); }
  function close() { root.classList.remove('on'); running = false; for (const l of Object.values(L)) l.hidden = true; skipBtn.hidden = muteBtn.hidden = pips.hidden = true; }
  window.addEventListener('resize', () => { if (running) size(); });
  function show(/** @type {'splash'|'load'|'card'} */ k) { for (const [n, el] of Object.entries(L)) el.hidden = n !== k; }
  const fade = (/** @type {() => void} */ fn) => new Promise((res) => { veil.classList.add('on'); setTimeout(() => { fn(); veil.classList.remove('on'); res(undefined); }, FADE_MS); });
  const fromBlack = (/** @type {() => void} */ fn) => { veil.style.transition = 'none'; veil.classList.add('on'); fn(); void veil.offsetWidth; veil.style.transition = ''; veil.classList.remove('on'); };
  const wait = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms));

  // one handler for taps and keys; each screen sets what "next" means
  /** @type {() => void} */ let onNext = () => {};
  /** @type {() => void} */ let onSkip = () => {};
  root.addEventListener('click', (e) => { const el = /** @type {HTMLElement} */ (e.target); if (el.closest('.skip')) onSkip(); else if (el.closest('.mute')) toggleMusic(); else onNext(); });
  root.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNext(); } else if (e.key === 'Escape') onSkip(); });
  function toggleMusic() { const m = soundSettings().music; if (m > 0) { musicWas = m; setSoundSettings({ music: 0 }); } else setSoundSettings({ music: musicWas }); }

  /**
   * Splash, then the loading screen until `ready` settles (and at least long enough to read a tip),
   * then "Tap to begin". Resolves on that tap, with the music started; `under` runs behind the
   * last fade, to put up what the overlay uncovers (the title).
   * @param {Promise<any>} ready @param {() => void} [under]
   */
  async function boot(ready, under = () => {}) {
    open(); show('splash');
    document.getElementById('bootSplash')?.remove();                     // index.html's static splash, shown before any script ran
    await new Promise((res) => { const tm = setTimeout(res, SPLASH_MS); onNext = () => { clearTimeout(tm); res(undefined); }; });
    onNext = () => {};
    const data = load(), start = performance.now(); let done = false, p = 0, tip = 0;
    scene = 'year301'; t0 = performance.now() - 8000;
    await fade(() => show('load'));
    const bar = /** @type {HTMLElement} */ ($('.bar i')), tipEl = $('.tip'), begin = $('.begin');
    /** @type {any[]} */ let tips = [];
    const nextTip = () => { if (!tips.length) return; const q = tips[tip++ % tips.length]; tipEl.textContent = q.text; if (q.source) { const s = document.createElement('small'); s.textContent = q.source; tipEl.append(s); } };
    data.then((d) => { tips = d.tips; nextTip(); });
    const tipTimer = setInterval(nextTip, TIP_MS);
    Promise.race([Promise.allSettled([ready, data]), wait(MAX_LOAD_MS)]).then(() => { done = true; });
    while (true) {                                                        // the bar eases toward 90 % until the work is done
      const el = performance.now() - start;
      p = done && el >= MIN_LOAD_MS ? 100 : Math.min(90, p + (90 - p) * 0.08);
      bar.style.width = p.toFixed(1) + '%';
      if (p >= 100) break;
      await wait(120);
    }
    begin.hidden = false;
    await new Promise((res) => { onNext = () => res(undefined); });
    onNext = () => {}; clearInterval(tipTimer);
    score.init(); score.play('thornwick');                                // the title's music (the intro's last cue, kept)
    await fade(() => { under(); close(); });
  }

  /**
   * The six cards. Resolves when the last one is tapped past, or on Skip; `under` runs behind the
   * last fade, to put up what the overlay uncovers (creation, or the title again).
   * @param {() => void} [under]
   */
  async function intro(under = () => {}) {
    const { cards } = await load(); if (!cards.length) { under(); return; }
    playing = true;
    score.init(); open(); skipBtn.hidden = false; muteBtn.hidden = false; pips.hidden = false;
    let i = 0, revealed = false, ending = false, fading = false, timers = [];
    const say = $('.say');
    const showCard = (/** @type {number} */ k) => {
      const c = cards[k]; i = cardIx = k; revealed = false; timers.forEach(clearTimeout); timers = [];
      scene = c.scene; t0 = performance.now(); show('card');
      $('.age').textContent = c.age; $('.when').textContent = c.when; say.textContent = '';
      const lines = [[c.hook, 'hook'], ...c.body.map((/** @type {string} */ b) => [b, '']), [c.lead, 'last']];
      lines.forEach(([line, cls], n) => { const sp = document.createElement('span'); sp.textContent = line + ' '; if (cls) sp.className = cls; say.append(sp); timers.push(setTimeout(() => sp.classList.add('in'), 500 + n * LINE_MS)); });
      timers.push(setTimeout(() => { revealed = true; }, 500 + lines.length * LINE_MS));
      pips.replaceChildren(...cards.map((/** @type {any} */ _, n) => { const e = document.createElement('i'); if (n <= k) e.className = 'on'; return e; }));
      score.card(c.id, c.music);
    };
    return new Promise((res) => {
      const finish = () => { if (ending) return; ending = true; timers.forEach(clearTimeout); onNext = onSkip = () => {}; fade(() => { under(); close(); playing = false; }).then(res); };
      onNext = () => {
        if (ending || fading) return;                                   // a tap during the fade doesn't count twice
        if (!revealed) { for (const s of say.children) s.classList.add('in'); revealed = true; return; }
        if (i < cards.length - 1) { fading = true; fade(() => showCard(i + 1)).then(() => { fading = false; }); } else finish();
      };
      onSkip = () => { if (score.cue !== 'thornwick') score.card('thornwick', 'thornwick'); finish(); };   // land on Thornwick's music either way
      fromBlack(() => showCard(0));
    });
  }

  return {
    boot, intro,
    /** the music fades out: into play */
    stopMusic: () => score.stop(),
    /** true while the intro's cards are up (the world needn't draw underneath) */
    get playing() { return playing; },
    /** the cue playing, or null (tests) */
    get music() { return score.cue; },
    /** the card on screen (tests) */
    get card() { return playing ? cardIx : -1; },
  };
}
