// render-smoke-test.mjs — headless proof the ISO renderer boots and paints
// without throwing or emitting NaN / undefined draw values. Uses a stub canvas
// (no real drawing) — it exercises every generator + the per-frame paint path
// with the real sim + world. Run alongside smoke-test.mjs before every push.
//
//   node render-smoke-test.mjs
//
// (This is the harness the TDP §7 calls for — the same class of check that
//  caught a bad ramp/undefined-style bug during the mockup rounds.)

import { createSim } from './src/sim/core.js';
import { mulberry32, streamSeed, STREAM } from './src/sim/rng.js';
import { rollRecipe } from './src/assetforge/doll.js';

let bad = 0, nan = 0, styleWrites = 0, drawImages = 0;
function badColor(v) {
  return v == null || v === 'undefined' ||
    (typeof v === 'string' && (v.includes('NaN') || v.includes('undefined')));
}
function stubCtx(w, h) {
  return {
    canvas: { width: w, height: h }, imageSmoothingEnabled: false,
    lineWidth: 0, strokeStyle: '', globalCompositeOperation: 'source-over',
    set fillStyle(v) { styleWrites++; if (badColor(v)) { bad++; if (bad < 8) console.log('BAD STYLE:', JSON.stringify(v)); } this._fs = v; },
    get fillStyle() { return this._fs; },
    fillRect(x, y, ww, hh) { if ([x, y, ww, hh].some(Number.isNaN)) { nan++; if (nan < 8) console.log('NaN fillRect', x, y, ww, hh); } },
    drawImage(img, x, y, ww, hh) { drawImages++; if ([x, y, ww, hh].some((n) => n !== undefined && Number.isNaN(n))) { nan++; if (nan < 8) console.log('NaN drawImage', x, y, ww, hh); } },
    clearRect() {}, strokeRect() {}, beginPath() {}, arc() {}, fill() {}, stroke() {}, moveTo() {}, lineTo() {},
    getImageData(x, y, ww, hh) { return { data: new Uint8ClampedArray(ww * hh * 4), width: ww, height: hh }; },
    createImageData(ww, hh) { return { data: new Uint8ClampedArray(ww * hh * 4), width: ww, height: hh }; },
    putImageData() {},
    createRadialGradient() { return { addColorStop() {} }; },
  };
}
function mkCanvas(w = 0, h = 0) {
  return { width: w, height: h, style: {}, getContext() { return stubCtx(this.width, this.height); }, addEventListener() {} };
}
global.document = { createElement: () => mkCanvas() };
global.window = { devicePixelRatio: 2, innerWidth: 402, innerHeight: 874, addEventListener() {}, matchMedia: () => ({ matches: false }) };
global.performance = { now: () => 0 };

// import the renderer AFTER the DOM stubs exist (module top-level is DOM-free,
// but createRenderer touches document/window at call time)
const { createRenderer } = await import('./src/render/renderer.js');

const SEED = 20260807;
const sim = createSim(SEED);
const canvas = mkCanvas();
const input = { joystick: () => null, vec: () => null, onTap: () => {} };
const renderer = createRenderer(canvas, sim, input);
renderer.setHero(rollRecipe(mulberry32(streamSeed(SEED, STREAM.RECIPE))));

// drive a few ticks of movement, then paint interpolated frames + a couple taps
for (let i = 0; i < 40; i++) { sim.commands.push({ type: 'move', x: 1, y: 0.3 }); sim.tick(); }
for (let f = 0; f < 12; f++) renderer.render((f % 4) / 4, f * 16);

const tapMid = renderer.screenToTile(200, 430, 1);
const tapCorner = renderer.screenToTile(10, 10, 1);
const tapsOk = Number.isFinite(tapMid.tx) && Number.isFinite(tapMid.ty) &&
  Number.isFinite(tapCorner.tx) && Number.isFinite(tapCorner.ty);

console.log('frames painted: 12 |', 'style writes:', styleWrites, '| drawImages:', drawImages);
console.log('taps resolve to finite tiles:', tapsOk, tapMid, tapCorner);
console.log('bad styles:', bad, '| NaN draw values:', nan);
console.log(bad === 0 && nan === 0 && tapsOk ? 'RENDER_SMOKE_OK' : 'RENDER_SMOKE_FAIL');
if (!(bad === 0 && nan === 0 && tapsOk)) process.exit(1);
