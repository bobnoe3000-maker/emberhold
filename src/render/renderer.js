// renderer.js — Emberlit deferred renderer (art direction v0.5). The sim doesn't
// know this file exists. Instead of painting final pixels, the CPU bakes a
// G-BUFFER — albedo + normal + emissive + height — for a MARGIN-cached region of
// the world (re-baked only when the camera crosses the margin). Each frame the
// visible window is copied out, the moving actors are stamped into it, and two
// WebGL2 passes relight it: Pass A adds dynamic point lights (a warm carry-light
// on the hero + corruption flares) and HDR emissives at native resolution; Pass B
// nearest-upscales to the display and layers trilinear-mip bloom + ACES + grade.
//
// Parity note (Emberlit TDD §12.1): the shaders + lighting math are the reference
// demo's, unchanged; only the bake is driven from our infinite world.js. The old
// (The old Canvas2D and flat renderers were retired at M2.5; see git history.)

import { materialAt, heightAt, resourceAt, propAt, isWalkable } from '../sim/world.js';
import { ELIT, EGLOW } from './palette.js';
import { skyAt, makeSky, mixSky, holdT } from './daylight.js';
import { weatherNow, weatherLight, drawWeather, lightOf } from './weatherfx.js';
import { drawDollDetailed, DETAIL_W, DETAIL_H } from '../assetforge/doll.js';
import { hash2, fbm, vnoise } from '../sim/rng.js';
import { beastOf, beastFrame } from './beasts.js';
import { TW, TH, HW, HH, ZH, ROWW, project, unproject, resolveTap } from './iso.js';
import { GLOW_ID, norm3, buildProps, spriteFromCanvasData, PROP_LIGHT } from './gsprite.js';
import { TILE_STYLES, N_UP, paintFloor, paintWall, variantFor, POOL_LIGHT } from './tilestyles.js';
import { paintOutdoor } from './outdoorpaint.js';
import { createAnimator } from './anim.js';
import { createFX, styleOfSrc } from './fx.js';
import { siteOpen, bossAt } from '../sim/sites.js';
import { familyOf, BOSSES, halved } from '../sim/battle.js';
import { DEATH_T } from '../sim/battle.js';
import { statsFor } from '../sim/party.js';
import { shotOf } from '../sim/items.js';

// hazard material → the point-light color it casts (lit dynamically as a flare)
const HAZARD_LIGHT = { lava: [1.7, 0.8, 0.25], ember: [1.7, 0.85, 0.3], poison: [0.5, 1.5, 0.35], chasm: [0.7, 0.55, 1.7] };
const INTERACT = new Set(['chest', 'shrine', 'stairs', 'stairwell']);   // props a tap can target
// Actor atlases (tools/actor-lab/bake.cjs) store one row per screen octant:
// 0=E, 1=SE, 2=S (toward the camera), 3=SW, 4=W, 5=NW, 6=N, 7=NE. sdx/sdy are
// screen-space deltas.
function dir8(sdx, sdy) {
  return ((Math.round(Math.atan2(sdy, sdx) / (Math.PI / 4)) % 8) + 8) % 8;
}
const SKELETONS = ['skeleton_warrior', 'skeleton_minion', 'skeleton_rogue', 'skeleton_mage'];
// every enemy kind's baked look (battle.js ENEMIES and the bosses): the Ashbound, the Redhand Company, the
// Cinder Cult. The Ashbound load with the game; the others when a floor that has them loads.
const ENEMY_ACTOR = { warrior: 'skeleton_warrior', minion: 'skeleton_minion', rogue: 'skeleton_rogue', mage: 'skeleton_mage',
  cutthroat: 'redhand_cutthroat', brute: 'redhand_brute', crossbow: 'redhand_crossbow', acolyte: 'cinder_acolyte',
  goblin: 'goblin_skirmisher', bruiser: 'goblin_bruiser', archer: 'goblin_archer', hexer: 'goblin_hexer',
  redhand_captain: 'boss_garrow', robed_stranger: 'boss_stranger', standard: 'boss_standard', goblin_chief: 'boss_skarn' };
const UNDEAD_LOOK = new Set(SKELETONS.concat(['boss_standard']));   // (they rise from the ground and shamble)
// walk-cycle length in tiles (one full loop of the baked walk clip): frames advance with
// distance, so this sets the stride — hero/companion run (Running_A), skeleton shamble
const STRIDE = { hero: 4.5, skel: 3.2, walk: 2.2 };   // tiles a cycle, from the baked feet: the party's run ~50 px of screen travel, the Ashbound's shuffle ~36 px;
// a Walking_A figure (townsfolk, the Redhand, the robes) carries its own measured `stride` in its atlas JSON (actor-lab
// lab.js strideOf, art pass 6: 1.97–2.33), 2.2 when it has none. They had the run's 4.5, so their feet skated 2×. The
// goblins run (Running_A/B, measured the same way: 3.0–3.2): their short legs barely parted in a walk, and read as skating.
const strideOf = (atl, fallback) => (atl && atl.meta.stride) || fallback;
const NO_WEATHER = Object.freeze({ kind: 'clear', k: 0 });

const MARGIN = 96;                 // native-px slack around the view held in the bake
const TRIGGER = 24;                // start baking the next region (in the background) after this much drift
const BAKE_BUDGET = 5;             // ms of background baking per frame
// A scene change (town ↔ overland, stairs, a load): black while the new scene bakes in slices of
// TRANSIT_BUDGET ms, then a fade in. Baking it in one frame stalled 0.4 s on a laptop and 1–2 s on a
// phone, then cut hard to the new place: it read as a stutter and a jump.
const TRANSIT_BUDGET = 24, TRANSIT_FADE = 320;
const VIEW_TILES = 25;             // tiles across the screen (was ~16, then 20; each step zooms out 20%)
let viewTiles = VIEW_TILES;        // (the dev Stage zooms in: VIEW_TILES ÷ its integer zoom)
const PHONE_CSS = 390 / (VIEW_TILES * 16); // an iPhone 13 upright: CSS px per native px (≈ 0.98), the size of things elsewhere
const DOLL_AX = 12, DOLL_AY = 34;  // hero foot anchor within the 24×36 doll
// Lighting look (was UI sliders in the demo; fixed here — the whole scene stays
// visible via a raised ambient, and lights ADD warmth rather than veil).
const AMB = 0.62, WISP = 0.72, BLOOM = 0.55;
// Map the warm paper-doll into the cold world: snap each pixel to an Emberlit ramp.
const QUANT = ELIT.soil.concat(ELIT.bone, ELIT.flesh, ELIT.obsid);

const clampf = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* ── shaders (verbatim from the Emberlit reference demo) ─────────────────── */
const VS = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0.0,1.0);}`;
const LIGHT_FS = `#version 300 es
precision highp float;
uniform sampler2D uAlb,uNrm,uEmi;
uniform vec2 uRes; uniform float uTime,uAmb,uWispA;
uniform vec3 uL[3]; uniform vec3 uLC[3];
uniform vec2 uWispPx;
uniform vec3 uSunL, uSunC, uAmbC;   // outdoor scenes: directional sun + ambient colour by the time of day (zero in dungeons)
uniform float uWin, uLift, uHaze;   // lit windows' glow ×; how far baked ground shadows lift; the violet haze × (daylight.js)
out vec4 O;
float h21(vec2 p){p=fract(p*vec2(234.34,435.345));p+=dot(p,p+34.23);return fract(p.x*p.y);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  float a=h21(i),b=h21(i+vec2(1,0)),c=h21(i+vec2(0,1)),d=h21(i+vec2(1,1));
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec4 A=texture(uAlb,uv);
  // a baked ground shadow (ALB alpha 254, stampShadow) lifts toward the unshadowed ground by day
  if(A.a>0.99&&A.a<0.998)A.rgb=mix(A.rgb,min(A.rgb/vec3(0.52,0.54,0.64),vec3(1.0)),uLift);
  vec4 N=texture(uNrm,uv);
  vec4 Et=texture(uEmi,uv); vec3 E=Et.rgb*3.2;
  // a lit window (EMI alpha 254): by day its glow goes out and the glass reads dark (its baked albedo is
  // the warm lamplight behind it); at dusk (uWin 1) it is as baked; by night it burns brighter
  if(Et.a>0.993&&Et.a<0.998){E*=uWin;A.rgb*=mix(0.32,1.0,min(uWin,1.0));}
  vec3 n=normalize(vec3(N.xy*2.0-1.0,max(N.z,0.02)));
  float h=N.a*64.0;
  vec2 p=gl_FragCoord.xy;
  vec3 amb=dot(uAmbC,vec3(1.0))>0.0?uAmbC:mix(vec3(0.10,0.07,0.17),vec3(0.55,0.48,0.62),uAmb);
  vec3 col=A.rgb*amb*(0.72+0.28*n.z);
  col+=A.rgb*uSunC*max(dot(n,uSunL),0.0);
  for(int i=0;i<3;i++){
    vec3 lp=uL[i];
    vec3 d=vec3(p.x-lp.x,(lp.y-p.y)*1.8,lp.z-h);
    float dd=length(d);
    vec3 L=d/max(dd,0.001);
    float ndl=max(dot(n,vec3(L.x,-L.y*0.55,L.z)),0.0);
    float att=1.0/(1.0+dd*dd*0.0016);
    // figures (actor pixels carry EMI alpha 250) take the hero's own carry light at 55 %: at arm's
    // length it flattened the knight's steel to a pink-white ghost; the floor keeps the full pool
    float fig=(i==0&&Et.a>0.97&&Et.a<0.99)?0.55:1.0;
    col+=A.rgb*uLC[i]*ndl*att*fig;
    col+=uLC[i]*att*0.05*fig;
  }
  float ph=h21(floor(gl_FragCoord.xy))*6.28;
  col+=E*(Et.a<0.99?1.0:0.55+0.45*sin(uTime*2.6+ph));   // EMI alpha < 1 marks steady (UI-like) glow: team rings
  float wd=length(gl_FragCoord.xy-uWispPx);
  col+=vec3(2.2,1.35,0.5)*exp(-wd*wd*0.16)*uWispA*0.85;      // a small ember mote, not a disc over the figure
  col+=vec3(2.2,1.35,0.5)*exp(-wd*wd*0.02)*uWispA*0.16;
  float fog=n2(uv*vec2(7.0,3.5)+vec2(uTime*0.05,uTime*0.02));
  float fa=smoothstep(0.3,0.9,fog)*0.10*(1.0-uv.y*0.5)*uHaze;
  col=mix(col,vec3(0.10,0.07,0.16),fa);
  O=vec4(col,1.0);
}`;
const POST_FS = `#version 300 es
precision highp float;
uniform sampler2D uLit,uLitM,uAlbT,uNrmT,uEmiT;
uniform vec2 uOut,uNative; uniform float uScale,uBloom,uTime,uVig,uSat;
uniform vec2 uOff; uniform int uView;
out vec4 O;
float h21(vec2 p){p=fract(p*vec2(234.34,435.345));p+=dot(p,p+34.23);return fract(p.x*p.y);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);}
void main(){
  vec2 sp=vec2(gl_FragCoord.x,uOut.y-gl_FragCoord.y);
  vec2 np=(sp-uOff)/uScale;
  if(np.x<0.0||np.y<0.0||np.x>=uNative.x||np.y>=uNative.y){O=vec4(0.02,0.013,0.03,1.0);return;}
  vec2 uv=vec2(np.x/uNative.x,np.y/uNative.y);
  // sharp-bilinear: nearest inside each native pixel, a one-output-pixel blend at its
  // edges, so a fractional scale stays crisp without uneven 2px/3px columns
  vec2 cd=fract(np)-0.5,rr=vec2(0.5-0.5/uScale);
  vec2 suv=(floor(np)+0.5+(cd-clamp(cd,-rr,rr))*uScale)/uNative;
  if(uView==1){O=vec4(texture(uAlbT,uv).rgb,1.0);return;}
  if(uView==2){O=vec4(texture(uNrmT,uv).rgb,1.0);return;}
  if(uView==3){O=vec4(texture(uEmiT,uv).rgb*3.2,1.0);return;}
  vec3 col=textureLod(uLitM,suv,0.0).rgb;
  vec3 bl=vec3(0.0);
  bl+=textureLod(uLitM,uv,2.0).rgb*0.34;
  bl+=textureLod(uLitM,uv,3.0).rgb*0.30;
  bl+=textureLod(uLitM,uv,4.0).rgb*0.22;
  bl=max(bl-0.14,vec3(0.0));
  col+=bl*uBloom*1.8;
  col=aces(col*1.12);
  col=pow(col,vec3(1.03,1.0,0.95));
  col=max(mix(vec3(dot(col,vec3(0.2126,0.7152,0.0722))),col,uSat),vec3(0.0));   // the time of day's saturation grade (1 in the dungeons)
  col+=vec3(0.010,0.002,0.020)*(1.0-col);
  vec2 c=gl_FragCoord.xy/uOut-0.5;
  col*=1.0-dot(c,c)*uVig;
  col+=(h21(floor(gl_FragCoord.xy*0.5))-0.5)*0.008;   // a whisper of static grain (animated per-pixel grain crawled over small figures)
  O=vec4(col,1.0);
}`;

export function createRenderer(canvas, sim, input) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
  if (!gl) throw new Error('WebGL2 not available');
  const hasF = gl.getExtension('EXT_color_buffer_float');

  const compile = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const link = (fs) => { const p = gl.createProgram(); gl.attachShader(p, compile(gl.VERTEX_SHADER, VS)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; };
  const lightP = link(LIGHT_FS), postP = link(POST_FS);
  const U = (p, n) => gl.getUniformLocation(p, n);

  const mkTex = () => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.NEAREST], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); return t; };
  const texAlb = mkTex(), texNrm = mkTex(), texEmi = mkTex();
  const litTex = gl.createTexture(), litFbo = gl.createFramebuffer();
  let useHDR = !!hasF;
  const sampNearest = gl.createSampler(); gl.samplerParameteri(sampNearest, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.samplerParameteri(sampNearest, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  const sampMip = gl.createSampler(); gl.samplerParameteri(sampMip, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.samplerParameteri(sampMip, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // joystick + HUD overlay (GL owns the main canvas, so the 2D stick lives above it)
  const overlay = document.createElement('canvas');
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2;';
  document.body.appendChild(overlay);
  const octx = overlay.getContext('2d');

  let S = 3, vw = 0, vh = 0, nvw = 0, nvh = 0, tbw = 0, tbh = 0;
  // the time of day outdoors (daylight.js): the sim's clock, or a held look (the title's dusk, ?dev&tod=);
  // a change of hold eases over SKY_EASE ms instead of cutting
  const sky = makeSky(), skyNow = makeSky(), skyFrom = makeSky(), SKY_EASE = 1500;
  let skyHoldT = /** @type {number|null} */ (null), skyEase0 = -1e9, lastNow = 0;
  let bALB, bNRM, bEMI, sALB, sNRM, sEMI;            // baked (margin) + scratch (window); b* point at the CURRENT bake target
  let front = null, back = null, job = null;          // double-buffered bakes: render from front, bake the next region into back
  let bDEP, sDEP, bSH;                               // depth toward the camera (tiles) + shadow flags
  let bakeOx = 0, bakeOy = 0, terrValid = false, flares = [];

  function setupLit() {
    gl.bindTexture(gl.TEXTURE_2D, litTex);
    if (useHDR) { try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, nvw, nvh, 0, gl.RGBA, gl.HALF_FLOAT, null); } catch (e) { useHDR = false; } }
    if (!useHDR) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, nvw, nvh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.NEAREST], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    gl.bindFramebuffer(gl.FRAMEBUFFER, litFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, litTex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE && useHDR) { useHDR = false; setupLit(); return; }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function target(set) { bALB = set.ALB; bNRM = set.NRM; bEMI = set.EMI; bDEP = set.DEP; bSH = set.SH; }
  function resize() {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    vw = Math.floor(window.innerWidth * dpr);
    vh = Math.floor(window.innerHeight * dpr);
    canvas.width = vw; canvas.height = vh;
    canvas.style.width = window.innerWidth + 'px'; canvas.style.height = window.innerHeight + 'px';
    overlay.width = vw; overlay.height = vh;
    overlay.style.width = window.innerWidth + 'px'; overlay.style.height = window.innerHeight + 'px';
    // CSS px per native px. A phone held upright fits VIEW_TILES across (the owner: on an iPhone 13 it's right). Any
    // other screen keeps things about that size and shows more world, instead of blowing the same 25 tiles up to fill
    // a desktop window (the owner, 2026-10-03: "too zoomed in" there): the phone's own size on a touch screen (so
    // turning a phone sideways keeps the figures' size), a quarter larger with a mouse (a desk is viewed from further).
    // The dev Stage's zoom (viewTiles < VIEW_TILES) scales either rule.
    const cw = window.innerWidth, zk = VIEW_TILES / viewTiles, fit = cw / (viewTiles * TW);
    const touch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches), upright = touch && cw <= 500;
    const css = upright ? fit : Math.min(fit, PHONE_CSS * (touch ? 1 : 1.25) * zk);
    S = Math.max(1.5, css * dpr);                          // fractional; PASS B upscales sharp-bilinear
    nvw = Math.ceil(vw / S) + 2; nvh = Math.ceil(vh / S) + 2;
    tbw = nvw + 2 * MARGIN; tbh = nvh + 2 * MARGIN;
    const mkSet = () => ({ ALB: new Uint8ClampedArray(tbw * tbh * 4), NRM: new Uint8ClampedArray(tbw * tbh * 4), EMI: new Uint8ClampedArray(tbw * tbh * 4), DEP: new Float32Array(tbw * tbh), SH: new Uint8Array(tbw * tbh) });
    front = mkSet(); back = mkSet(); job = null; target(front);
    sALB = new Uint8Array(nvw * nvh * 4); sNRM = new Uint8Array(nvw * nvh * 4); sEMI = new Uint8Array(nvw * nvh * 4);
    sDEP = new Float32Array(nvw * nvh);
    for (const t of [texAlb, texNrm, texEmi]) { gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, nvw, nvh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); }
    setupLit();
    terrValid = false;
  }
  window.addEventListener('resize', resize); resize();
  // The HUD row's bottom edge, in CSS px: it sits under the phone's safe area (an iPhone's camera island
  // pushes it ~60 px down), so everything drawn along the top (minimap, room pill, boss bar, labels)
  // keys off it rather than a fixed height that fit a desktop and overlapped on a phone.
  let hudB = 50;
  // ...and the party's column down the left on a phone held sideways (ui/party.js sets --party-side, CSS px; 0 when
  // the cards sit along the bottom): the camera centres the hero in the rest of the screen
  // and the notch's inset on the right, if it's there (ui/safearea.js's probe): the minimap and the room pill keep clear of it
  let sideL = 0, safeR = 0;
  const measureHud = () => {
    const h = typeof document !== 'undefined' && document.getElementById('hud'); if (h) hudB = Math.max(40, h.getBoundingClientRect().bottom);
    if (typeof document !== 'undefined') {
      sideL = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--party-side')) || 0;
      const pr = document.getElementById('safeProbe'); safeR = pr ? parseFloat(getComputedStyle(pr).paddingRight) || 0 : 0;
    }
  };
  measureHud(); window.addEventListener('resize', () => { measureHud(); requestAnimationFrame(measureHud); }); setInterval(measureHud, 1000);
  const MM_CSS = 96, MM_PAD = 6, MM_RIGHT = 10;                // the minimap's size and margins (CSS px; + the notch's inset, safeR)
  const mmTop = () => hudB + 10;                                 // the minimap's top edge (CSS px)

  /* ── load-time bakes: props, hero doll frames ───────────────────────────── */
  let props = buildProps(sim.world.seed);
  const harvest = buildHarvest();

  const dollCache = new Map();
  let heroRecipe = null;
  const qCv = document.createElement('canvas'); qCv.width = DETAIL_W; qCv.height = DETAIL_H;
  const qCtx = qCv.getContext('2d');
  function setHero(r) { heroRecipe = r; dollCache.clear(); }
  function heroSprite(frame, mirror) {
    const k = frame + '|' + mirror;
    let sp = dollCache.get(k);
    if (!sp) {
      qCtx.clearRect(0, 0, DETAIL_W, DETAIL_H);
      drawDollDetailed(qCtx, heroRecipe, frame, mirror);
      const id = qCtx.getImageData(0, 0, DETAIL_W, DETAIL_H), d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] === 0) continue;
        let bj = 0, bd = 1e18;
        for (let j = 0; j < QUANT.length; j++) { const q = QUANT[j], dd = (d[i] - q[0]) ** 2 + (d[i + 1] - q[1]) ** 2 + (d[i + 2] - q[2]) ** 2; if (dd < bd) { bd = dd; bj = j; } }
        d[i] = QUANT[bj][0]; d[i + 1] = QUANT[bj][1]; d[i + 2] = QUANT[bj][2];
      }
      sp = spriteFromCanvasData(d, DETAIL_W, DETAIL_H, DOLL_AX, DOLL_AY);
      dollCache.set(k, sp);
    }
    return sp;
  }

  // ── Actor atlases: KayKit CC0 figures baked at 56 px (heroic + grim) by
  // tools/actor-lab/bake.cjs into albedo / normal / emissive sheets, sliced here
  // into per-(direction, frame) G-sprites with real 3D normals, so they relight in
  // the deferred pass. Loaded async; until ready the hero falls back to the
  // paper-doll and skeletons simply don't draw yet.
  let heroAtlas = null, outMap = null;
  const pickAnim = createAnimator();                   // per-unit clip playback (anim.js)
  const fx = createFX();                               // weapon trails / glints / cast shimmer + hit sparks (fx.js)
  const skelAtlases = [], enemyAtlases = new Map();   // actor name → atlas, or a promise while it loads
  const enemyAtlas = (kind) => {
    const name = ENEMY_ACTOR[kind] || 'skeleton_minion', a = enemyAtlases.get(name);
    if (a === undefined) enemyAtlases.set(name, loadActorAtlas(name, name.startsWith('boss_') ? 1.3 : 1).then((x) => { enemyAtlases.set(name, x); return x; }).catch(() => { enemyAtlases.set(name, null); }));
    return a && a.cells ? a : null;
  };
  // a floor's family, loaded before its first wave (battle.js FAMILIES): no enemy pops in undrawn
  const preloadFamily = () => { const w = sim.world; if (w.kind === 'overland') { for (const q of w.pickets || []) enemyAtlas(q.kind); return; } if (w.kind !== 'dungeon') return; const F = familyOf(w); for (const k of [...F.melee, ...F.ranged, F.elite]) enemyAtlas(k); const b = bossAt(w.site, w.depth || 0); if (b) enemyAtlas(b); };
  const acv = document.createElement('canvas'), actx = acv.getContext('2d', { willReadFrequently: true });
  const loadImg = (url) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  // An atlas is a JSON of rects plus PNGs, and a re-bake moves the rects. A browser (or host) that
  // cached one half and not the other slices from the wrong place: a stairwell drawn blank. So the
  // small JSON is always revalidated, and the PNGs are asked for at a version hashed from it.
  const atlasMeta = (url) => fetch(url, { cache: 'no-cache' }).then((r) => r.text()).then((t) => {
    let h = 0x811c9dc5; for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 0x01000193);
    return { meta: JSON.parse(t), v: (h >>> 0).toString(36) };
  });
  const pixels = (img) => { acv.width = img.width; acv.height = img.height; actx.clearRect(0, 0, img.width, img.height); actx.drawImage(img, 0, 0); return actx.getImageData(0, 0, img.width, img.height).data; };
  // scale: how tall against a man (a boss 1.3×). The bake makes the bosses tall (73 px; art pass 9), so their atlas
  // loads as it is; an atlas baked smaller (88-px cells at 56 px, e.g. an older checkout's twin on the Stage) is
  // nearest-upscaled the rest of the way, its foot point and weapon anchors with it (they were left at 1×).
  async function loadActorAtlas(name, scale = 1, root = './assets/actors/') {   // root: the dev Stage's before/after twin loads another checkout's
    const base = root + name, { meta: m0, v } = await atlasMeta(base + '.json'), k = scale * 88 / m0.cw;
    const up = Math.abs(k - 1) > 0.04, meta = up ? scaledMeta(m0, k) : m0;
    const alb = pixels(await loadImg(`${base}.alb.png?v=${v}`)), iw = acv.width;
    const nrm = pixels(await loadImg(`${base}.nrm.png?v=${v}`)), emi = meta.glow ? pixels(await loadImg(`${base}.emi.png?v=${v}`)) : null;
    const { cw, ch, ax, ay } = m0, cells = [];
    for (let r = 0; r < meta.dirs; r++) {
      const row = [];
      for (let f = 0; f < meta.frames; f++) {
        const sp = { w: cw, h: ch, ax, ay, mask: new Uint8Array(cw * ch), alb: new Uint8Array(cw * ch * 3), nrm: new Uint8Array(cw * ch * 3), emi: new Uint8Array(cw * ch) };
        for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
          const i = ((r * ch + y) * iw + f * cw + x) * 4, j = y * cw + x;
          if (alb[i + 3] < 128) continue;
          sp.mask[j] = 1;
          sp.alb[j * 3] = alb[i]; sp.alb[j * 3 + 1] = alb[i + 1]; sp.alb[j * 3 + 2] = alb[i + 2];
          sp.nrm[j * 3] = nrm[i]; sp.nrm[j * 3 + 1] = nrm[i + 1]; sp.nrm[j * 3 + 2] = nrm[i + 2];
          if (emi && emi[i] > 128) sp.emi[j] = meta.glow;
        }
        row.push(sp);
      }
      cells.push(row);
    }
    if (up) for (const row of cells) for (let f = 0; f < row.length; f++) row[f] = upscale(row[f], k);
    return { name, meta, cells };
  }
  const scaledMeta = (m, k) => ({ ...m, cw: Math.round(m.cw * k), ch: Math.round(m.ch * k), ax: Math.round(m.ax * k), ay: Math.round(m.ay * k),
    ...(m.anchors ? { anchors: Object.fromEntries(Object.entries(m.anchors).map(([sl, A]) => [sl, A.map((n) => Math.round(n * k))])) } : {}) });
  function upscale(sp, k) {
    const w = Math.round(sp.w * k), h = Math.round(sp.h * k), o = { w, h, ax: Math.round(sp.ax * k), ay: Math.round(sp.ay * k), mask: new Uint8Array(w * h), alb: new Uint8Array(w * h * 3), nrm: new Uint8Array(w * h * 3), emi: new Uint8Array(w * h) };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const j = Math.min(sp.h - 1, (y / k) | 0) * sp.w + Math.min(sp.w - 1, (x / k) | 0), i = y * w + x;
      if (!sp.mask[j]) continue;
      o.mask[i] = 1; o.emi[i] = sp.emi[j];
      for (let c = 0; c < 3; c++) { o.alb[i * 3 + c] = sp.alb[j * 3 + c]; o.nrm[i * 3 + c] = sp.nrm[j * 3 + c]; }
    }
    return o;
  }
  const firstLoads = [];                               // what the boot's loading screen waits for (`ready`)
  firstLoads.push(loadActorAtlas('hero_knight').then((a) => { heroAtlas = a; partyAtlases.hero_knight = a; }).catch(() => {}));   // the default look; a created hero's own look loads via partyAtlas
  SKELETONS.forEach((n, i) => firstLoads.push(loadActorAtlas(n).then((a) => { skelAtlases[i] = a; enemyAtlases.set(n, a); }).catch(() => {})));

  // ── Environment atlas: KayKit Medieval Hexagon (CC0) buildings, trees, rocks and
  // mountains baked by tools/actor-lab/bake-env.cjs — albedo, normal (+ shadow in its
  // alpha), and a per-pixel depth key (+ lit-window flag). Sprites are sliced lazily,
  // only when a scene first uses them.
  // Two atlases are live at a time: the shared base ('env': trees, rocks, props) and the
  // current region's town buildings ('town-<region>': same shapes, the region's tones).
  let envMeta = null;                                  // { sprites: id → meta (+ .atlas) } merged across loaded atlases
  let envGen = 0;                                      // bumped as each atlas lands (the beasts' list is rebuilt)
  const envAtlases = new Map(), envCache = new Map();
  function loadAtlas(name) {
    if (envAtlases.has(name)) return null;
    envAtlases.set(name, null);
    return atlasMeta(`./assets/env/${name}.json`)
      .then(({ meta, v }) => Promise.all([meta, ...['alb', 'nrm', 'key'].map((c) => loadImg(`./assets/env/${name}.${c}.png?v=${v}`))]))
      .then(([m, a, n, k]) => {
        envAtlases.set(name, { a, n, k });
        envMeta = envMeta || { sprites: {} };
        for (const [id, sm] of Object.entries(m.sprites)) envMeta.sprites[id] = { ...sm, atlas: name };
        terrValid = false; outMap = null; envGen++;
      }).catch(() => envAtlases.delete(name));
  }
  const wantAtlases = () => [loadAtlas('env'), sim.world.kind !== 'dungeon' ? loadAtlas('town-' + (sim.world.region || 'vale')) : null];   // env carries the dungeon's stair too
  firstLoads.push(...wantAtlases());
  const ecv = document.createElement('canvas'), ectx = ecv.getContext('2d', { willReadFrequently: true });
  function envSprite(id) {
    if (envCache.has(id)) return envCache.get(id);
    const m = envMeta && envMeta.sprites[id]; if (!m) return null;
    const envImgs = envAtlases.get(m.atlas); if (!envImgs) return null;
    const grab = (img) => { ecv.width = m.w; ecv.height = m.h; ectx.clearRect(0, 0, m.w, m.h); ectx.drawImage(img, m.x, m.y, m.w, m.h, 0, 0, m.w, m.h); return ectx.getImageData(0, 0, m.w, m.h).data; };
    const A = grab(envImgs.a), N = grab(envImgs.n), K = grab(envImgs.k), U = m.up || 1, w = m.w * U, h = m.h * U, n = w * h;
    // (m.up: baked at 1/up of the pixels, the mountain massifs; scaled back ×up, nearest, here: critic pass 10)
    const sp = { w, h, ax: m.ax * U, ay: m.ay * U, mask: new Uint8Array(n), alb: new Uint8Array(n * 3), nrm: new Uint8Array(n * 3), dep: new Float32Array(n), emi: new Uint8Array(n) };
    for (let j = 0; j < n; j++) {
      const i = U === 1 ? j * 4 : (Math.floor(Math.floor(j / w) / U) * m.w + Math.floor((j % w) / U)) * 4;
      if (A[i + 3] >= 128) {
        sp.mask[j] = 1;
        sp.alb[j * 3] = A[i]; sp.alb[j * 3 + 1] = A[i + 1]; sp.alb[j * 3 + 2] = A[i + 2];
        sp.nrm[j * 3] = N[i]; sp.nrm[j * 3 + 1] = N[i + 1]; sp.nrm[j * 3 + 2] = N[i + 2];
        sp.dep[j] = K[i] + K[i + 1] / 255 - 128;
        sp.emi[j] = K[i + 2] > 128 ? m.glow || 9 : 0;   // its GLOW_ID: lit windows, or the stairwell's violet
      } else if (N[i + 3] > 40) sp.mask[j] = 2;              // ground shadow only
    }
    envCache.set(id, sp);
    return sp;
  }

  // Composite the scene's structures into the bake: first every ground shadow (only
  // onto ground-level pixels, once), then every sprite with the nearer-wins depth test.
  function structList(bx, by, lights) {
    const world = sim.world, list = [];
    if (!envMeta || !world.structs) return list;
    for (const st of world.structs) {
      const sp = envSprite(st.id); if (!sp) continue;
      const z = heightAt(world, Math.floor(st.x), Math.floor(st.y));
      const P = project(st.x, st.y, z), x0 = Math.round(bx + P.sx) - sp.ax, y0 = Math.round(by + P.sy) - sp.ay;
      if (x0 > tbw || y0 > tbh || x0 + sp.w < 0 || y0 + sp.h < 0) continue;
      list.push({ sp, x0, y0, z, base: st.x + st.y + z * 0.5, walkOn: st.id.startsWith('bridge') || st.id.startsWith('stairsup'), hole: !!st.hole, beast: isBeast(st.id) });
      const gl = envMeta.sprites[st.id].glow;
      if (gl && lights.length < 30) lights.push(gl === 2 ? { x: st.x, y: st.y - 2.5, z: z - 1, color: PROP_LIGHT.stairs } : { x: st.x, y: st.y, z: z + 3, color: [1.1, 0.72, 0.36] });
    }
    return list;
  }
  function stampShadow({ sp, x0, y0, z }, by) {
    const zp = z * ZH;
    for (let yy = 0; yy < sp.h; yy++) {
      const py = y0 + yy; if (py < 0 || py >= tbh) continue;
      const ground = (py - by + zp) / HH + z * 0.5 + 0.35;
      for (let xx = 0; xx < sp.w; xx++) {
        if (sp.mask[yy * sp.w + xx] !== 2) continue;
        const px = x0 + xx; if (px < 0 || px >= tbw) continue;
        const di = py * tbw + px; if (bSH[di] || bDEP[di] > ground) continue;
        bSH[di] = 1; const i = di * 4;
        bALB[i] *= 0.52; bALB[i + 1] *= 0.54; bALB[i + 2] *= 0.64; bALB[i + 3] = 254;   // marked, for the daylight lift
      }
    }
  }
  // A `hole` (the stairwell) is below the floor, so its keys are further than the floor's: it
  // replaces floor pixels (the bake shows it through its mouth only) and gives way to anything
  // standing nearer than the floor there (a pillar, a wall), the same test as a ground shadow.
  function stampSprite({ sp, x0, y0, base, walkOn, hole, z }, by) {
    const zp = z * ZH;
    for (let yy = 0; yy < sp.h; yy++) {
      const py = y0 + yy; if (py < 0 || py >= tbh) continue;
      const ground = (py - by + zp) / HH + z * 0.5 + 0.35;
      for (let xx = 0; xx < sp.w; xx++) {
        const j = yy * sp.w + xx; if (sp.mask[j] !== 1) continue;
        const px = x0 + xx; if (px < 0 || px >= tbw) continue;
        const di = py * tbw + px, dep = base + sp.dep[j];
        if (hole ? bDEP[di] > ground + 0.1 : dep < bDEP[di] - 0.05) continue;
        if (!walkOn) bDEP[di] = dep;
        const i = di * 4, hpx = Math.max(0, Math.min(63, (4 * (dep - z * 0.5) - (py - by + zp)) / 1.333));
        bALB[i] = sp.alb[j * 3]; bALB[i + 1] = sp.alb[j * 3 + 1]; bALB[i + 2] = sp.alb[j * 3 + 2]; bALB[i + 3] = 255;
        bNRM[i] = sp.nrm[j * 3]; bNRM[i + 1] = sp.nrm[j * 3 + 1]; bNRM[i + 2] = sp.nrm[j * 3 + 2]; bNRM[i + 3] = zp * 4 + hpx * 4 > 255 ? 255 : zp * 4 + hpx * 4;
        const e = sp.emi[j];
        if (e) { const g = GLOW_ID[e]; bEMI[i] = g[0] / 3; bEMI[i + 1] = g[1] / 3; bEMI[i + 2] = g[2] / 3; } else { bEMI[i] = 0; bEMI[i + 1] = 0; bEMI[i + 2] = 0; }
        bEMI[i + 3] = e === 9 ? 254 : 255;                // a lit window (flickers, and the time of day dims it)
      }
    }
  }
  // bolts: tiny emissive sprites (firebolt ember, soul-bolt violet, a goblin's hex green, crossbow quarrel steel)
  const bolts = {};
  function boltSprite(kind) {
    if (bolts[kind]) return bolts[kind];
    const w = 7, h = 7, sp = { w, h, ax: 3, ay: 3, mask: new Uint8Array(w * h), alb: new Uint8Array(w * h * 3), nrm: new Uint8Array(w * h * 3), emi: new Uint8Array(w * h) };
    const col = kind === 'fire' ? [255, 170, 80] : kind === 'soul' ? [190, 150, 255] : kind === 'hex' ? [160, 235, 110] : kind === 'spirit' ? [150, 235, 215] : [210, 210, 220], glow = kind === 'fire' ? 3 : kind === 'soul' ? 2 : kind === 'hex' ? 1 : kind === 'spirit' ? 8 : 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const d = Math.hypot(x - 3, y - 3); if (d > (kind === 'bolt' ? 1.6 : 2.9)) continue;
      const j = y * w + x; sp.mask[j] = 1; sp.alb.set(col, j * 3); sp.nrm.set([127, 160, 250], j * 3); sp.emi[j] = d < 1.8 ? glow : 0;
    }
    return (bolts[kind] = sp);
  }
  // an arrow: a short line along its flight on screen (q of 16 headings), steel head forward, pale
  // fletching behind, both glinting; baked once per heading
  function arrowSprite(q) {
    const key = 'arrow' + q; if (bolts[key]) return bolts[key];
    const w = 15, h = 15, sp = { w, h, ax: 7, ay: 7, mask: new Uint8Array(w * h), alb: new Uint8Array(w * h * 3), nrm: new Uint8Array(w * h * 3), emi: new Uint8Array(w * h) };
    const a = (q / 16) * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a);
    for (let t = -6; t <= 6; t++) {
      const x = Math.round(7 + dx * t), y = Math.round(7 + dy * t), j = y * w + x;
      sp.mask[j] = 1; sp.alb.set(t >= 5 ? [215, 220, 230] : t <= -5 ? [240, 232, 214] : [196, 146, 90], j * 3); sp.nrm.set([127, 160, 250], j * 3);
      if (t >= 5 || t <= -5) sp.emi[j] = 7;               // a frost glint at the head and the fletching: it reads in the dark
    }
    return (bolts[key] = sp);
  }
  // companions (hired party members) — atlases load on first use
  const partyAtlases = {};
  let cast = {};                                      // content/npcs/*.json by id (setCast): each NPC's look and name
  const npcPres = new Map();                          // NPC id → its animation state (never on the sim's objects)
  // The crowd (critic pass 11f, scored against the owner's reference: its village is busy with people at work,
  // ten or more a frame; ours had its nine named townsfolk). Unnamed villagers (npc_villager_1–4) stroll from one
  // open spot of the square or the high street to another, wait a while, and go on. Presentation only: the sim
  // knows nothing of them, they're never tapped or saved, and their walk is the renderer's own (a seeded LCG).
  const CROWD_N = 8, CROWD_SPEED = 1.3, crowds = new WeakMap(), CROWD_LOOK = { flash: 0, dissolve: 0 };   // passers-by never x-ray through a wall: a hidden one is just out of sight
  function crowdOf(world) {
    let c = crowds.get(world); if (c) return c;
    c = [];
    if (world.kind === 'town' && world.hub) {
      let s = (world.seed ^ 0x9e3779b9) >>> 0; const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
      const H = world.hub, spots = [];
      for (let t = 0; t < 400 && spots.length < 48; t++) {          // open spots: the square, and the high street to the gate
        const onStreet = rnd() < 0.3, x = onStreet ? 84 + rnd() * 24 : H.x + (rnd() - 0.5) * H.r * 1.6, y = onStreet ? 77 + rnd() * 6 : H.y + (rnd() - 0.5) * H.r * 1.6;
        if (!onStreet && Math.hypot(x - H.x, y - H.y) > H.r - 3) continue;
        if (isWalkable(world, x, y) && isWalkable(world, x + 0.6, y) && isWalkable(world, x, y + 0.6)) spots.push([x, y]);
      }
      for (let i = 0; i < CROWD_N && spots.length > 2; i++) { const [x, y] = spots[(rnd() * spots.length) | 0];
        c.push({ x, y, tx: x, ty: y, wait: rnd() * 4000, look: 'npc_villager_' + (1 + (i % 4)), fx: 0, fy: 1, moving: false, u: { fidgetN: 0, lookN: 0, h: i * 977, seed: rnd(), next: 1e15, near: false } }); }
      c.spots = spots; c.rnd = rnd; c.last = 0;
    }
    crowds.set(world, c); return c;
  }
  const clearWalk = (world, ax, ay, bx, by) => { const n = Math.ceil(Math.hypot(bx - ax, by - ay) / 0.5); for (let k = 1; k <= n; k++) if (!isWalkable(world, ax + (bx - ax) * k / n, ay + (by - ay) * k / n)) return false; return true; };
  function stepCrowd(world, c, now) {
    const dt = Math.min(0.1, c.last ? (now - c.last) / 1000 : 0); c.last = now;
    for (const v of c) {
      const dx = v.tx - v.x, dy = v.ty - v.y, d = Math.hypot(dx, dy);
      if (d > 0.05) { const st = Math.min(d, CROWD_SPEED * dt); v.x += dx / d * st; v.y += dy / d * st; v.fx = dx; v.fy = dy; v.moving = true; continue; }
      v.moving = false; v.wait -= dt * 1000;
      if (v.wait > 0) continue;
      for (let t = 0; t < 8; t++) {                                   // the next spot: near enough, and a clear walk to it
        const [x, y] = c.spots[(c.rnd() * c.spots.length) | 0];
        if (Math.hypot(x - v.x, y - v.y) < 18 && clearWalk(world, v.x, v.y, x, y)) { v.tx = x; v.ty = y; break; }
      }
      v.wait = 1500 + c.rnd() * 5000;
    }
  }
  // the person you're talking to (sim 'dialogue' … 'talkEnded'): they turn to you, greet you and talk with their
  // hands; you turn to them (art pass 6: both stood as they were, often back to back)
  let talkingTo = null, greet = null;
  sim.bus.on('dialogue', ({ npc }) => { talkingTo = greet = npc; });
  sim.bus.on('talkEnded', () => { talkingTo = greet = null; });
  // each townsperson's own beat: an idle phase and a gesture rhythm from their id, so the square doesn't
  // breathe and wave in unison (it did: every NPC had seed 0.61 and the same fidget schedule)
  const idHash = (id) => { let h = 0x811c9dc5; for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 0x01000193); return h >>> 0; };
  // farm beasts at their ease (beasts.js): a struct with idle frames baked beside it leaves the static bake, all but its
  // ground shadow, and is stamped each frame instead, on a timeline of its own
  const isBeast = (id) => !!(envMeta && envMeta.sprites[id + '~tl']);
  let beasts = [], beastWorld = null, beastGen = -1;
  function beastList() {
    if (beastWorld === sim.world && beastGen === envGen) return beasts;
    beastWorld = sim.world; beastGen = envGen;
    return (beasts = (sim.world.structs || []).filter((st) => isBeast(st.id)).map(beastOf));
  }
  const beastSp = new Map();                           // an env sprite as a figure (its shadow-only pixels dropped)
  function beastSprite(id) {
    let s = beastSp.get(id); if (s) return s;
    const e = envSprite(id); if (!e) return null;
    s = { w: e.w, h: e.h, ax: e.ax, ay: e.ay, mask: e.mask.map((v) => (v === 1 ? 1 : 0)), alb: e.alb, nrm: e.nrm, emi: e.emi };
    beastSp.set(id, s); return s;
  }
  // a rogue is drawn with what they shoot with (sim items.js `shot`; the atlases: actor-lab bake.json),
  // in their dagger look until that atlas has loaded
  const RANGED_LOOK = { bow: '_bow', longbow: '_longbow', crossbow: '_hxbow', heavy: '_xbow' };
  const memberAtlas = (m, base) => { const k = base === 'hero_rogue' && shotOf(m); return (k && partyAtlas(base + RANGED_LOOK[k])) || partyAtlas(base); };
  const partyAtlas = (name) => { if (!(name in partyAtlases)) { partyAtlases[name] = null; loadActorAtlas(name).then((a) => { partyAtlases[name] = a; }).catch(() => {}); } return partyAtlases[name]; };

  const fol = [];                                     // smoothed companion draw positions

  // Terrain painter: cobble by default; ?tiles=<style> picks another structured style
  // from tilestyles.js, and ?tiles=classic restores the original per-pixel-noise look.
  // ?tv=<variant> forces a material variant (plain/earth/rock/lava/poison/ice/water);
  // otherwise each biome uses its default.
  const qs = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
  const tileKey = qs.get('tiles') || 'cobble', tileVariant = qs.get('tv') || '';
  const tileStyle = tileKey === 'classic' ? null : (TILE_STYLES[tileKey] || TILE_STYLES.cobble);
  // a site may keep its own style (the goblins' warren is dug, not laid: cavern), unless ?tiles= says otherwise
  const THEME_STYLE = { warren: 'cavern' }, styleOf = (w) => (!qs.has('tiles') && THEME_STYLE[w.theme] ? TILE_STYLES[THEME_STYLE[w.theme]] : tileStyle);

  /* ── G-buffer writers ───────────────────────────────────────────────────── */
  // DEPTH (bDEP): distance toward the camera in tile units = ground x+y of the surface
  // point + 0.0833 per px of height (0.5 per level). Terrain paints in painter's order and
  // writes it; baked structures and actors composite against it ("nearer wins").
  const DPX = 0.0833;
  // Terrain never changes within a level, so each tile's writes are RECORDED the first
  // time it's painted (relative to its screen origin) and REPLAYED on later bakes.
  let rec = null;
  const tileCache = new Map();
  const putG = (px, py, alb, n, hpx, emiId, dep = -1e9) => {
    px |= 0; py |= 0;
    if (rec) rec.push(px - rec.sx, py - rec.sy, alb[0], alb[1], alb[2], (n[0] * 0.5 + 0.5) * 255, (n[1] * 0.5 + 0.5) * 255, n[2] * 255, hpx * 4, emiId || 0, dep);
    if (px < 0 || py < 0 || px >= tbw || py >= tbh) return;
    bDEP[py * tbw + px] = dep;
    const i = (py * tbw + px) * 4;
    bALB[i] = alb[0]; bALB[i + 1] = alb[1]; bALB[i + 2] = alb[2]; bALB[i + 3] = 255;
    bNRM[i] = (n[0] * 0.5 + 0.5) * 255; bNRM[i + 1] = (n[1] * 0.5 + 0.5) * 255; bNRM[i + 2] = n[2] * 255; bNRM[i + 3] = hpx * 4;
    if (emiId) { const g = GLOW_ID[emiId]; bEMI[i] = g[0] / 3; bEMI[i + 1] = g[1] / 3; bEMI[i + 2] = g[2] / 3; }
    else { bEMI[i] = 0; bEMI[i + 1] = 0; bEMI[i + 2] = 0; }
    bEMI[i + 3] = 255;
  };

  // Stamp a G-sprite (albedo/normal/emissive) into a target buffer at a foot point.
  // footKey = ground x+y under the foot; test = depth-test against DEP (actors): pixels
  // behind nearer geometry draw as a dim x-ray silhouette instead of vanishing.
  // Contact shadow + team ring at a foot point, painted into the window G-buffer before the
  // figures: an iso ellipse (2:1) that darkens the ground (only ground at or behind the
  // foot, never a wall in front), and for team > 0 a thin tinted rim — party gold, the
  // Ashbound red, elites ember-orange — so friend and foe read apart in a melee.
  const TEAM_RGB = [null, [214, 176, 92], [196, 58, 46], [236, 128, 48]];
  function footMark(fx, fy, h, team, fade) {
    const gh = Math.min(255, h * 4), rx = 13, ry = 6.5, col = TEAM_RGB[team], keep = 1 - fade;
    for (let dy = -8; dy <= 8; dy++) {
      const py = fy + dy; if (py < 0 || py >= nvh) continue;
      for (let dx = -15; dx <= 15; dx++) {
        const px = fx + dx; if (px < 0 || px >= nvw) continue;
        const di = py * nvw + px, i4 = di * 4; if (sNRM[i4 + 3] > gh + 8) continue;   // only ground at the foot's height, never a wall or prop face
        const e = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry), i = i4;
        if (e < 1) { const m = 1 - 0.5 * Math.pow(1 - e, 0.6) * keep; sALB[i] *= m; sALB[i + 1] *= m; sALB[i + 2] *= m; }
        if (col && e > 0.72 && e < 1.2 && dy >= -2) {                  // the ring's near arc (the far arc hides behind the figure)
          const a = 0.46 * keep; sALB[i] += (col[0] - sALB[i]) * a; sALB[i + 1] += (col[1] - sALB[i + 1]) * a; sALB[i + 2] += (col[2] - sALB[i + 2]) * a;
          sEMI[i] = col[0] * 0.09; sEMI[i + 1] = col[1] * 0.09; sEMI[i + 2] = col[2] * 0.09; sEMI[i + 3] = 250;   // steady glow
        }
      }
    }
  }
  // A figure's cast shadow (critic pass 11h: the reference puts a crisp shadow under every figure). Its silhouette
  // laid on the ground along the baked sun's line (envlab.js SUN: the trees' shadows fall 0.80 px right and 0.11 px
  // up a pixel of height; a figure's is cut to 0.55, so it stays under the figure), thickened two pixels each way
  // for the body's depth (a flat silhouette laid down is a sliver). It's marked as a baked shadow (ALB alpha 254) but deeper (× 0.36–0.48:
  // at the bake's 0.52 it read 15–23 % darker after the light pass, a smudge), so the day lifts it as it lifts theirs and a figure in a tree's shadow never darkens twice. Ground at the foot's
  // height only, as footMark.
  const CAST_X = 0.55, CAST_Y = -0.08, CAST_T = 2;
  function castShadow(sp, footX, footY, h) {
    const gh = Math.min(255, h * 4), x0 = Math.round(footX) - sp.ax, fy = Math.round(footY);
    for (let yy = 0; yy < sp.h; yy++) {
      const hgt = sp.ay - yy; if (hgt < 0) continue;
      const sx = Math.round(hgt * CAST_X), sy = fy + Math.round(hgt * CAST_Y);
      for (let xx = 0; xx < sp.w; xx++) {
        if (!sp.mask[yy * sp.w + xx]) continue;
        const px = x0 + xx + sx; if (px < 0 || px >= nvw) continue;
        for (let py = sy - CAST_T; py <= sy + CAST_T; py++) {
          if (py < 0 || py >= nvh) continue;
          const i = (py * nvw + px) * 4; if (sALB[i + 3] === 254 || sNRM[i + 3] > gh + 8) continue;
          sALB[i] *= 0.36; sALB[i + 1] *= 0.38; sALB[i + 2] *= 0.48; sALB[i + 3] = 254;
        }
      }
    }
  }
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
  function stamp(ALB, NRM, EMI, W, H, sp, footX, footY, baseH, DEP, footKey = 0, test = false, look = null) {
    const flash = look ? look.flash || 0 : 0, fade = look ? look.fade || 0 : 0, dis = look ? look.dissolve || 0 : 0, ghost = look ? look.ghost || 0 : 0;
    const x0 = Math.round(footX) - sp.ax, y0 = Math.round(footY) - sp.ay;
    let flashEdge = false, hid = 0, shown = 0;
    for (let yy = 0; yy < sp.h; yy++) {
      const py = y0 + yy; if (py < 0 || py >= H) continue;
      const hpx = baseH + (sp.h - yy) * 0.55;
      const dep = footKey + DPX * (baseH + Math.max(0, sp.ay - yy));
      for (let xx = 0; xx < sp.w; xx++) {
        const j = yy * sp.w + xx; if (!sp.mask[j]) continue;
        const px = x0 + xx; if (px < 0 || px >= W) continue;
        if (dis && BAYER[(py & 3) * 4 + (px & 3)] < dis) continue;          // ordered-dither dissolve (the slain crumble away)
        if (ghost && BAYER[(py & 3) * 4 + (px & 3)] < 0.4) continue;         // the Fallen: see-through (the floor shows between)
        const i = (py * W + px) * 4;
        if (DEP) {
          const di = py * W + px;
          if (test && dep < DEP[di] - 0.6) { if (test !== 2) { ALB[i] = ALB[i] * 0.5 + 34; ALB[i + 1] = ALB[i + 1] * 0.5 + 26; ALB[i + 2] = ALB[i + 2] * 0.5 + 52; } hid++; continue; }   // test 2: occluded, no x-ray
          DEP[di] = dep;
        }
        ALB[i] = sp.alb[j * 3]; ALB[i + 1] = sp.alb[j * 3 + 1]; ALB[i + 2] = sp.alb[j * 3 + 2]; ALB[i + 3] = 255;
        if (flash) {                                    // struck: a hot rim on the silhouette, a light warm tint inside (a full tint read as a pink haze on bone)
          const edge = xx === 0 || yy === 0 || xx === sp.w - 1 || yy === sp.h - 1 || !sp.mask[j - 1] || !sp.mask[j + 1] || !sp.mask[j - sp.w] || !sp.mask[j + sp.w];
          const k = edge ? Math.min(1, flash * 2.4) : flash * 0.35;
          ALB[i] += (255 - ALB[i]) * k; ALB[i + 1] += (205 - ALB[i + 1]) * k; ALB[i + 2] += (160 - ALB[i + 2]) * k;
          if (edge) { EMI[i] = 90 * k; EMI[i + 1] = 60 * k; EMI[i + 2] = 36 * k; EMI[i + 3] = 250; flashEdge = true; }
        }
        if (fade) { ALB[i] *= 1 - fade * 0.75; ALB[i + 1] *= 1 - fade * 0.78; ALB[i + 2] *= 1 - fade * 0.6; }
        let rim = false;
        if (ghost) {                                    // a Fallen member's ghost: cold grey, with a steady pale rim
          const l = ALB[i] * 0.3 + ALB[i + 1] * 0.59 + ALB[i + 2] * 0.11;
          ALB[i] = l * 0.62 + 34; ALB[i + 1] = l * 0.7 + 42; ALB[i + 2] = l * 0.82 + 60;
          rim = xx === 0 || yy === 0 || xx === sp.w - 1 || yy === sp.h - 1 || !sp.mask[j - 1] || !sp.mask[j + 1] || !sp.mask[j - sp.w] || !sp.mask[j + sp.w];
        }
        NRM[i] = sp.nrm[j * 3]; NRM[i + 1] = sp.nrm[j * 3 + 1]; NRM[i + 2] = sp.nrm[j * 3 + 2]; NRM[i + 3] = Math.min(255, hpx * 4);
        const e = fade > 0.5 ? 0 : sp.emi[j];
        if (flashEdge) flashEdge = false;
        else if (rim) { EMI[i] = 34; EMI[i + 1] = 48; EMI[i + 2] = 66; }
        else if (ghost) { EMI[i] = ALB[i] * 0.06; EMI[i + 1] = ALB[i + 1] * 0.06; EMI[i + 2] = ALB[i + 2] * 0.08; }
        else if (e) { const g = GLOW_ID[e]; EMI[i] = g[0] / 3; EMI[i + 1] = g[1] / 3; EMI[i + 2] = g[2] / 3; }
        else if (test) { const k = 0.045 * (1 - fade); EMI[i] = ALB[i] * k; EMI[i + 1] = ALB[i + 1] * k; EMI[i + 2] = ALB[i + 2] * k * 1.1; }   // actors: a faint self-light, so figures read in the dark
        else { EMI[i] = 0; EMI[i + 1] = 0; EMI[i + 2] = 0; }
        EMI[i + 3] = test && !e ? 250 : 255;          // actors' self-light is steady (alpha < 255): the shader's per-pixel ember flicker read as grain on figures
        shown++;
      }
    }
    return hid / Math.max(1, hid + shown);              // the share drawn as x-ray (behind nearer geometry)
  }

  // Terrain tile → G-buffer: cliff faces (SW/SE drops) then the top diamond,
  // with material-gradient normals + sparse emissive specks (water / poison).
  function replayTile(r, sx, sy) {
    const P = r.p, D = r.d, n = D.length;
    for (let k = 0; k < n; k++) {
      const px = sx + P[k * 10], py = sy + P[k * 10 + 1]; if (px < 0 || py < 0 || px >= tbw || py >= tbh) continue;
      const di = py * tbw + px, i = di * 4, o = k * 10;
      bALB[i] = P[o + 2]; bALB[i + 1] = P[o + 3]; bALB[i + 2] = P[o + 4]; bALB[i + 3] = 255;
      bNRM[i] = P[o + 5]; bNRM[i + 1] = P[o + 6]; bNRM[i + 2] = P[o + 7]; bNRM[i + 3] = P[o + 8];
      const e = P[o + 9];
      if (e) { const g = GLOW_ID[e]; bEMI[i] = g[0] / 3; bEMI[i + 1] = g[1] / 3; bEMI[i + 2] = g[2] / 3; } else { bEMI[i] = 0; bEMI[i + 1] = 0; bEMI[i + 2] = 0; }
      bEMI[i + 3] = 255; bDEP[di] = D[k];
    }
  }
  function drawTileG(bx, by, x, y) {
    const world = sim.world;
    const sx0 = bx + (x - y) * HW;
    if (sx0 < -TW * 2 || sx0 > tbw + TW * 2) return;
    const key = x + ',' + y, hit = tileCache.get(key);
    if (hit) { if (hit !== 1) replayTile(hit, sx0, by + (x + y) * HH - hit.z * ZH); return; }
    const m = materialAt(world, x, y);
    if (m === 'abyss') { tileCache.set(key, 1); return; }        // the void: draw nothing
    const z = heightAt(world, x, y);
    const sx = sx0, sy = by + (x + y) * HH - z * ZH;
    if (sy < -80 || sy > tbh + 20) return;
    const raw = []; raw.sx = sx; rec = { sx, sy, push: (...v) => raw.push(...v) };
    try { drawTileBody(sx, sy, x, y, z, m, world); } finally { rec = null; }
    const cnt = raw.length / 11, P = new Int16Array(cnt * 10), D = new Float32Array(cnt);
    for (let k = 0; k < cnt; k++) { for (let j = 0; j < 10; j++) P[k * 10 + j] = Math.round(raw[k * 11 + j]); D[k] = raw[k * 11 + 10]; }
    if (tileCache.size > 60000) tileCache.clear();
    tileCache.set(key, { p: P, d: D, z });
  }
  function drawTileBody(sx, sy, x, y, z, m, world) {
    if (world.kind !== 'dungeon') return drawTileOutdoor(sx, sy, x, y, z);
    if (tileStyle) return drawTileStyled(sx, sy, x, y, z, m);
    const liq = m === 'water' || m === 'poison' || m === 'lava', hPix = z * ZH;
    const ramp = ELIT[m] || ELIT.soil;
    // cliff faces (walls tower over floors; floor lips fall into the abyss)
    if (m !== 'water') {
      const dSW = z - heightAt(world, x, y + 1), dSE = z - heightAt(world, x + 1, y);
      if (dSW > 0) faceG(sx, sy, dSW, ramp, 0, hPix, x, y);
      if (dSE > 0) faceG(sx, sy, dSE, ramp, 1, hPix, x, y);
    }
    const zN = heightAt(world, x, y - 1), zW = heightAt(world, x - 1, y);
    const nwHi = zW > z, neHi = zN > z, e = 0.35;
    for (let py = 0; py < 8; py++) {
      const w = ROWW[py], xs = sx - w / 2;
      for (let dx = 0; dx < w; dx++) {
        const X = xs + dx, u = (x + dx / 16) * 2.3, v = (y + py / 8) * 2.3;
        const n0 = fbm(u, v, world.ss + 7);
        let idx = Math.max(0, Math.min(ramp.length - 1, Math.floor(n0 * (ramp.length + 0.2))));
        if (m === 'water') idx = Math.min(3, idx);
        if (nwHi && py < 3 && dx < w / 2 && idx > 0) idx--;
        if (neHi && py < 3 && dx >= w / 2 && idx > 0) idx--;
        const gx = (fbm(u + e, v, world.ss + 7) - fbm(u - e, v, world.ss + 7)) * (liq ? 0.6 : 2.6);
        const gy = (fbm(u, v + e, world.ss + 7) - fbm(u, v - e, world.ss + 7)) * (liq ? 0.6 : 2.6);
        putG(X, sy + py, ramp[idx], norm3(gx, 0.30 + gy, 0.95), hPix, emissiveFor(m, X | 0, x, y, py, u, v, world), x + y + (py + 0.5) / HH + z * 0.5);
      }
    }
  }
  // Outdoor ground tile: every pixel samples the continuous ground features (outdoorpaint.js).
  function drawTileOutdoor(sx, sy, x, y, z) {
    const world = sim.world, hPix = z * ZH;
    for (let py = 0; py < 8; py++) {
      const w = ROWW[py], xs = sx - w / 2;
      for (let dx = 0; dx < w; dx++) {
        const X = xs + dx, a = (X + 0.5 - sx) / HW, b = (py + 0.5) / HH;
        const u = Math.min(0.999, Math.max(0, (a + b) / 2)), v = Math.min(0.999, Math.max(0, (b - a) / 2));
        const r = paintOutdoor(world, x + u, y + v, x, y, X + 0.5 - sx, py + 0.5);
        putG(X, sy + py, r.c, r.n, hPix, r.e, x + y + b + z * 0.5);
      }
    }
  }
  // Structured-style tile: one floor ramp + one wall ramp per variant, painted from
  // tile-local coordinates (no per-pixel noise). The biome's hazard tiles become
  // the variant's pools (lava, poison, ice, water, mud, pits, rubble).
  function drawTileStyled(sx, sy, x, y, z, m) {
    const world = sim.world, th = world.level.th, cell = world.level.cells.get(x + ',' + y);
    const isWall = !!cell && cell.kind === 'wall', hPix = z * ZH, seed = world.ss;
    const V = variantFor(world.theme, tileVariant), pool = !isWall && m === th.hazard, ST = styleOf(world);
    const fr = ELIT[V.floor], wr = ELIT[V.wall], accent = V.accent;
    const dSW = z - heightAt(world, x, y + 1), dSE = z - heightAt(world, x + 1, y);
    // wall faces sit one ramp step darker than floors/caps, so the play space reads first
    const wd = [[wr[0][0] * 0.75, wr[0][1] * 0.75, wr[0][2] * 0.75], wr[0], wr[1], wr[2], wr[3]];
    if (dSW > 0) faceStyled(sx, sy, dSW, 0, hPix, x, y, wd, seed, accent, V);
    if (dSE > 0) faceStyled(sx, sy, dSE, 1, hPix, x, y, wd, seed, accent, V);
    const nwHi = heightAt(world, x - 1, y) > z, neHi = heightAt(world, x, y - 1) > z;
    for (let py = 0; py < 8; py++) {
      const w = ROWW[py], xs = sx - w / 2;
      for (let dx = 0; dx < w; dx++) {
        const X = xs + dx, a = (X + 0.5 - sx) / HW, b = (py + 0.5) / HH;
        const u = Math.min(0.999, Math.max(0, (a + b) / 2)), v = Math.min(0.999, Math.max(0, (b - a) / 2));
        const c = { gx: x + u, gy: y + v, u, v, tx: x, ty: y, fr: isWall ? wr : fr, wr, seed, accent };
        const r = paintFloor(ST, V, c, pool, isWall);
        let col = r.c;
        if ((nwHi && py < 3 && dx < w / 2) || (neHi && py < 3 && dx >= w / 2)) col = [col[0] * 0.72, col[1] * 0.72, col[2] * 0.72];
        putG(X, sy + py, col, r.n || N_UP, hPix, r.e || 0, x + y + (py + 0.5) / HH + z * 0.5);
      }
    }
  }
  function faceStyled(sx, sy, drop, side, hTop, x, y, wr, seed, accent, V) {
    const WS = styleOf(sim.world);
    const h = Math.min(drop * ZH, 30), nb = side === 0 ? norm3(-0.70, 0.45, 0.52) : norm3(0.70, 0.45, 0.52);
    for (let i = 0; i < 8; i++) {
      const X = side === 0 ? sx - 8 + i : sx + i, yTop = side === 0 ? sy + 4 + ((i >> 1) + 1) : sy + 8 - (i >> 1);
      const along = side === 0 ? x + (i + 0.5) / 8 : y + 1 - (i + 0.5) / 8;     // continuous along a wall run
      for (let k = 0; k < h; k++) {
        const r = paintWall(WS, V, { along, k, h, hz: hTop - k, side, tx: x, ty: y, wr, seed, accent });
        const n = r.n ? norm3(nb[0] + r.n[0], nb[1] + r.n[1], nb[2] + r.n[2]) : nb;
        putG(X, yTop + k, r.c, n, Math.max(0, hTop - k), r.e || 0, faceKey(x, y, side, i) + DPX * (hTop - k));
      }
    }
  }
  // Emissive pattern per terrain: sparse specks on water/poison, glowing crack
  // veins on lava/chasm, scattered vents on ember. Returns a GLOW_ID (0 = none).
  function emissiveFor(m, X, tx, ty, py, u, v, world) {
    switch (m) {
      case 'water':  return hash2(X, py + ty * 8, world.cs + 901) > 0.986 ? 4 : 0;
      case 'poison': return hash2(X * 3, py + ty * 13, world.cs + 77) > 0.972 ? 1 : 0;
      case 'lava':   return Math.abs(fbm(u * 0.8 + 3, v * 0.8, world.hs + 5) - 0.5) < 0.075 ? 5 : 0;
      case 'ember':  return hash2(X, py + ty * 8, world.cs + 31) > 0.95 ? 3 : 0;
      case 'chasm':  return Math.abs(fbm(u * 0.7 + 7, v * 0.7, world.hs + 9) - 0.5) < 0.05 ? 6 : 0;
      default:       return 0;
    }
  }
  // ground x+y along a tile's front edge for face column i (SW face: left→bottom vertex; SE: bottom→right)
  const faceKey = (x, y, side, i) => x + y + (side === 0 ? 1 + (i + 0.5) / 8 : 2 - (i + 0.5) / 8);
  function faceG(sx, sy, drop, ramp, side, hTop, tx, ty) {
    const world = sim.world, h = Math.min(drop * ZH, 30);
    const n = side === 0 ? norm3(-0.70, 0.45, 0.52) : norm3(0.70, 0.45, 0.52);
    for (let i = 0; i < 8; i++) {
      const X = side === 0 ? sx - 8 + i : sx + i;
      const yTop = side === 0 ? sy + 4 + ((i >> 1) + 1) : sy + 8 - (i >> 1);
      for (let k = 0; k < h; k++) {
        const strat = fbm(X * 0.4, (yTop + k) * 0.35, world.hs + 13);
        const idx = Math.max(0, Math.floor(strat * 3) - (side === 1 ? 1 : 0));
        const wob = (vnoise(X * 0.8, (yTop + k) * 0.5, world.hs + 21) - 0.5) * 0.5;
        putG(X, yTop + k, ramp[Math.min(idx, ramp.length - 1)], norm3(n[0] + wob, n[1], n[2]), Math.max(0, hTop - k), 0, faceKey(tx, ty, side, i) + DPX * (hTop - k));
      }
    }
  }

  // Bake the terrain + static props/resources for (viewport + margin), keyed to
  // camera (ox, oy). Records up to two corruption flare anchors in the region.
  // The bake runs as a JOB: begin (clear the target, list tiles), step (paint tiles, then
  // stamp structures, then thin lights) until a time budget runs out, commit (make it
  // current). Normally it runs in the background into the back buffers while you walk
  // on the front ones, so crossing the margin never hitches.
  function bakeBegin(ox, oy) {
    bALB.fill(0); bNRM.fill(0); bEMI.fill(0); bDEP.fill(-1e9); bSH.fill(0);
    const bx = MARGIN + ox, by = MARGIN + oy;
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (const cx of [-MARGIN, nvw + MARGIN]) for (const cy of [-MARGIN, nvh + MARGIN]) for (const zz of [0, 7]) {
      const w = unproject(cx - ox, cy - oy, zz);
      minX = Math.min(minX, w.x); maxX = Math.max(maxX, w.x); minY = Math.min(minY, w.y); maxY = Math.max(maxY, w.y);
    }
    minX = Math.floor(minX) - 1; minY = Math.floor(minY) - 1; maxX = Math.ceil(maxX) + 1; maxY = Math.ceil(maxY) + 1;
    const tiles = [];
    for (let ty = minY; ty <= maxY; ty++) for (let tx = minX; tx <= maxX; tx++) tiles.push(tx, ty);
    const idx = Array.from({ length: tiles.length / 2 }, (_, i) => i).sort((a, b) => (tiles[a * 2] + tiles[a * 2 + 1]) - (tiles[b * 2] + tiles[b * 2 + 1]));
    return { ox, oy, bx, by, tiles, idx, i: 0, phase: 0, hazards: [], lights: [], world: sim.world };
  }
  function bakeStep(j, deadline) {
    const world = sim.world; if (j.world !== world) return false;
    const { bx, by } = j;
    while (j.phase === 0 && j.i < j.idx.length) {
      const q = j.idx[j.i++], tx = j.tiles[q * 2], ty = j.tiles[q * 2 + 1];
      drawTileG(bx, by, tx, ty);
      const z = heightAt(world, tx, ty);
      // static props / resources composite into the bake (depth order via the sort)
      const was = !propAt(world, tx, ty) && world.props && world.props.get(tx + ',' + ty);
      const pk = propAt(world, tx, ty) || (was === 'chest' ? 'chestOpen' : was === 'shrine' ? 'shrineSpent' : null);   // (an opened chest stays, lid back; a used shrine, its orb dark)
      if (pk && pk !== 'stairwell' && !(pk === 'stairs' && world.stairwell)) {   // (a stairwell's tiles: drawn by its structure, stairsdown_0, light and all)
        const arr = props[pk] || props.spire, sp = arr.length === 1 ? arr[0] : arr[(hash2(tx, ty, 5) * arr.length) | 0];
        stamp(bALB, bNRM, bEMI, tbw, tbh, sp, bx + (tx - ty) * HW, by + (tx + ty) * HH - z * ZH + HH, z * ZH, bDEP, tx + ty + 1);
        if (PROP_LIGHT[pk]) j.lights.push({ x: tx, y: ty, z, color: PROP_LIGHT[pk] });   // braziers / gate / shrine glow
      }
      const rk = resourceAt(world, tx, ty);
      if (rk) stamp(bALB, bNRM, bEMI, tbw, tbh, harvest[rk], bx + (tx - ty) * HW, by + (tx + ty) * HH - z * ZH + HH, z * ZH, bDEP, tx + ty + 1);
      if (world.kind === 'dungeon') {
        const mm = materialAt(world, tx, ty);   // glowing hazard pools (lava / flame / poison / soul / ice / water)
        const hl = tileStyle ? (mm === world.level.th.hazard ? POOL_LIGHT[variantFor(world.theme, tileVariant).pool] : null) : HAZARD_LIGHT[mm];
        if (hl) j.hazards.push({ x: tx, y: ty, z, color: hl, s: hash2(tx, ty, 1234) });
      }
      if ((j.i & 15) === 0 && performance.now() > deadline) return false;
    }
    if (j.phase === 0) { j.phase = 1; if (performance.now() > deadline) return false; }
    // structures: every ground shadow first, then every sprite (depth-tested), a few per slice
    if (j.phase === 1) { j.list = structList(bx, by, j.lights); j.k = 0; j.phase = 2; }
    while (j.phase === 2 && j.k < j.list.length) { stampShadow(j.list[j.k++], by); if (performance.now() > deadline) return false; }
    if (j.phase === 2) { j.phase = 3; j.k = 0; }
    while (j.phase === 3 && j.k < j.list.length) { const it = j.list[j.k++]; if (!it.beast) stampSprite(it, by); if (performance.now() > deadline) return false; }   // (a beast: its shadow only; it's drawn each frame)
    // thin the hazard pools to a few representatives spread apart, then pool all
    // candidates; render picks the two nearest the hero each frame.
    j.hazards.sort((a, b) => b.s - a.s);
    for (const h of j.hazards) { if (j.lights.length > 40) break; if (j.lights.every((o) => o.color !== h.color || Math.hypot(o.x - h.x, o.y - h.y) > 7)) j.lights.push(h); }
    return true;
  }
  function bakeCommit(j) { bakeOx = j.ox; bakeOy = j.oy; flares = j.lights; terrValid = true; }
  let lastOx = 0, lastOy = 0, velX = 0, velY = 0;
  let transit = null;                                  // { job, fadeFrom }: see TRANSIT_BUDGET
  function keepBaked(ox, oy, t0) {
    velX = velX * 0.9 + (ox - lastOx) * 0.1; velY = velY * 0.9 + (oy - lastOy) * 0.1; lastOx = ox; lastOy = oy;
    if (!terrValid && transit) {                                   // a scene change: bake in slices behind black
      if (!transit.job || transit.job.world !== sim.world) { target(back); transit.job = bakeBegin(ox, oy); }
      target(back);
      if (bakeStep(transit.job, t0 + TRANSIT_BUDGET)) { const f = front; front = back; back = f; bakeCommit(transit.job); transit.job = null; transit.fadeFrom = t0; }
      target(front);
      return;
    }
    if (!terrValid) {                                              // first frame: bake now, in full
      job = null; target(front); const j = bakeBegin(ox, oy); bakeStep(j, Infinity); bakeCommit(j);
      if (globalThis.__rstats) globalThis.__rstats.bakes.push(performance.now() - t0);
      return;
    }
    const drift = Math.max(Math.abs(bakeOx - ox), Math.abs(bakeOy - oy));
    if (!job && drift > TRIGGER) {                                 // aim ahead of where the camera is heading
      const lead = (v) => Math.max(-MARGIN * 0.45, Math.min(MARGIN * 0.45, v * 40));
      target(back); job = bakeBegin(Math.round(ox + lead(velX)), Math.round(oy + lead(velY)));
    }
    if (job) {
      target(back);
      const urgent = drift > MARGIN - 10;                          // about to run off the baked area: finish now
      const done = bakeStep(job, urgent ? Infinity : t0 + BAKE_BUDGET);
      if (done) { const f = front; front = back; back = f; bakeCommit(job); job = null; if (globalThis.__rstats) globalThis.__rstats.swaps = (globalThis.__rstats.swaps || 0) + 1; }
      target(front);
    }
  }

  let flash = null;
  sim.bus.on('hit', ({ tx, ty }) => { flash = { tx, ty, until: performance.now() + 90 }; });
  // descending / restoring rebuilds the world — rebuild seed-keyed props + re-bake.
  const withExit = (p) => ({ ...p, exit: p.stairs });          // the dungeon's way back up reuses the stair sprite
  props = withExit(props);
  let banner = null;
  const sceneTitle = () => (sim.world.kind === 'dungeon' ? `${sim.world.siteName || 'The Old Barrows'} · depth ${sim.state.depth + 1}` : sim.world.name);
  const hiddenHere = (L) => !!L.site && !siteOpen(L.site, sim.state.revealed || []);   // a site not found yet has no name on the Vale
  sim.bus.on('harvested', () => { terrValid = false; }); sim.bus.on('looted', () => { terrValid = false; });
  sim.bus.on('levelChanged', () => { transit = { job: null, fadeFrom: 0 }; tileCache.clear(); job = null; fol.length = 0; props = withExit(buildProps(sim.world.seed)); terrValid = false; flash = null; outMap = null; wantAtlases(); preloadFamily(); banner = { text: sceneTitle(), until: performance.now() + 2600 }; });
  preloadFamily();
  banner = { text: sceneTitle(), until: performance.now() + 2600 };

  // ── The Stage (dev only: src/dev/stage.js, docs/character-stage-proposal.md) ──────────────────────
  // A lineup of figures on the stage world, each standing on its spot and playing the clip the Stage
  // asks for, drawn by the same stamping, light and upscale as play. The Stage owns the layout, the
  // camera and each figure's playback inputs; the strides are the renderer's own, so a walk in place
  // steps exactly as it does in the world.
  let stage = null;
  const stageAtlases = new Map();
  const stageAtlas = (a) => {
    const key = `${a.root || ''}|${a.atlas}|${a.scale || 1}`;
    if (!stageAtlases.has(key)) { stageAtlases.set(key, null); loadActorAtlas(a.atlas, a.scale || 1, a.root || undefined).then((x) => stageAtlases.set(key, x)).catch(() => stageAtlases.set(key, false)); }
    return stageAtlases.get(key);
  };
  function stageDraws(st, draws, ox, oy, now) {
    for (const a of st.actors) {
      const atl = stageAtlas(a); if (!atl) continue; a.meta = atl.meta;   // (the capture tool reads clip lengths)
      const stride = a.kind === 'party' ? STRIDE.hero : a.kind === 'undead' ? STRIDE.skel : strideOf(atl, STRIDE.walk);
      const o = st.anim(a, atl, now), an = pickAnim(a.unit, atl, { ...o, now, stride });
      const z = heightAt(sim.world, Math.floor(a.x), Math.floor(a.y)), q = project(a.x, a.y, z);
      const sp = atl.cells[an.dir][an.frame], fx = ox + q.sx, fy = oy + q.sy, bb = spriteBox(sp);
      a.box = [Math.round(fx) - sp.ax + bb[0], Math.round(fy) - sp.ay + bb[1], Math.round(fx) - sp.ax + bb[2], Math.round(fy) - sp.ay + bb[3]];   // drawn bounds, native px (the overlap test)
      draws.push({ d: a.x + a.y, sp, fx, fy, h: z * ZH, k: a.x + a.y, look: { flash: 0, fade: 0 }, team: 0, atl, a: an });
    }
  }
  const boxes = new WeakMap();
  const spriteBox = (sp) => { let b = boxes.get(sp); if (b) return b; let x0 = sp.w, y0 = sp.h, x1 = -1, y1 = -1;
    for (let y = 0; y < sp.h; y++) for (let x = 0; x < sp.w; x++) if (sp.mask[y * sp.w + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    boxes.set(sp, (b = [x0, y0, x1 + 1, y1 + 1])); return b; };

  // Camera: follows the hero, but in a town square (world.hub) it eases onto the square's
  // fixed framing, so the square sits still like a home screen while the hero moves in it.
  let camT = 0, leadT = 0, shake = null;             // shake: a heavy blow's short camera jolt
  function camera(ix, iy, pz) {
    const hub = sim.world.hub;
    let cx = ix, cy = iy;
    if (hub) {
      const d = Math.hypot(ix - hub.x, iy - hub.y), want = d < hub.r - 6 ? 1 : d > hub.r ? 0 : (hub.r - d) / 6;
      camT += (want - camT) * 0.08;
      const t = camT * camT * (3 - 2 * camT);
      cx = ix + (hub.focus.x - ix) * t; cy = iy + (hub.focus.y - iy) * t;
    } else camT = 0;
    // On a town's approach road the camera leads toward the gate, so the gate is in the frame from the arrival on
    // (world.lead: the road's zone, the point to lead toward, and how far, 0..1; docs/town-layout-proposal.md)
    const lead = sim.world.lead;
    if (lead) {
      const inZone = ix > lead.x0 && ix < lead.x1 && iy > lead.y0 && iy < lead.y1;
      leadT += ((inZone ? 1 : 0) - leadT) * 0.05;
      const e = leadT * leadT * (3 - 2 * leadT) * lead.k;
      cx += (lead.x - ix) * e; cy += (lead.y - iy) * e;
    } else leadT = 0;
    const C = project(cx, cy, pz), t = camT * camT * (3 - 2 * camT);
    const anchor = (sideL ? 0.52 : 0.47) + (0.56 - 0.47) * t;   // hero sits higher (party cards below; level with no cards there); the square keeps its framing
    let jx = 0, jy = 0;
    if (shake) { const a = (performance.now() - shake.t0) / 160; if (a >= 1) shake = null; else { const k = shake.amp * (1 - a) * (1 - a); jx = Math.round(Math.sin(a * 37) * k); jy = Math.round(Math.cos(a * 29) * k * 0.6); } }
    // SUB-PIXEL SCROLL (critic pass 3: the world stepped in whole native pixels — 3 CSS px — in
    // an uneven 1-1-2 cadence, a judder over the whole screen). The window is rendered at the
    // camera rounded UP (ox, oy) and PASS B shifts the upscaled image back by the fraction
    // (rx − ox, a value in (−1, 0]), so the world glides; figures land on the nearest pixel.
    const rx = nvw / 2 + ((sideL - safeR) * vw) / (2 * window.innerWidth * S) - C.sx + jx, ry = nvh * anchor - C.sy + jy;
    return { ox: Math.ceil(rx), oy: Math.ceil(ry), rx, ry };
  }
  let lastCam = { ox: 0, oy: 0, rx: 0, ry: 0 };
  /** @type {((draws: any[], view: { hx: number, hy: number, nvw: number, ix: number, iy: number }) => void) | null} */
  let heard = null;                                   // a listener for each frame's figures (the sound); reads, never writes

  let clockNow = 0;                                   // the render clock (dev slow motion runs it slow)
  function render(alpha, now) {
    clockNow = now;
    const p = sim.state.player, st = stage && sim.world.kind === 'stage' ? stage : null;
    const ix = st ? st.cam.x : p.px + (p.x - p.px) * alpha, iy = st ? st.cam.y : p.py + (p.y - p.py) * alpha;   // the Stage frames its lineup, not the hero
    const pz = heightAt(sim.world, Math.floor(ix), Math.floor(iy));
    const P = project(ix, iy, pz);
    const { ox, oy } = (lastCam = camera(ix, iy, pz));

    const t0 = performance.now();
    keepBaked(ox, oy, t0);
    if (transit && !terrValid) {                                   // the new scene is still baking: black, and the scene's name
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, vw, vh); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      octx.clearRect(0, 0, vw, vh); drawBanner(now);
      return;
    }

    // copy the visible window out of the baked margin region (scratch x == native x)
    const srcX = MARGIN + (bakeOx - ox), srcY = MARGIN + (bakeOy - oy);
    for (let y = 0; y < nvh; y++) {
      const b0 = ((srcY + y) * tbw + srcX) * 4, s0 = (y * nvw) * 4, len = nvw * 4;
      sALB.set(bALB.subarray(b0, b0 + len), s0);
      sNRM.set(bNRM.subarray(b0, b0 + len), s0);
      sEMI.set(bEMI.subarray(b0, b0 + len), s0);
      sDEP.set(bDEP.subarray((srcY + y) * tbw + srcX, (srcY + y) * tbw + srcX + nvw), y * nvw);
    }

    // stamp actors (skeletons + hero) into the window G-buffer, depth-sorted by
    // (x+y) so nearer figures overdraw farther ones.
    const draws = [], party = sim.state.party, H = party[0];
    const lerp = (u, k) => (u['p' + k] === undefined ? u[k] : u['p' + k] + (u[k] - u['p' + k]) * alpha);   // between 20 Hz steps
    const lookOf = (u, fade = 0) => ({ flash: u.flash > 0 ? 0.32 : 0, fade });
    const GHOST = { ghost: 1 };
    if (st) stageDraws(st, draws, ox, oy, now); else {               // the dev Stage: its lineup instead of the world's people
    // the hero
    const hAtl = H.actor && H.actor !== 'hero_knight' ? memberAtlas(H, H.actor) : heroAtlas;
    if (hAtl) {
      const heroAtlas = hAtl;
      const tn = talkingTo && !p.moving && (sim.world.npcs || []).find((n) => n.id === talkingTo);   // in a conversation: face them
      const a = pickAnim(H, heroAtlas, { now, x: ix, y: iy, moving: p.moving, faceX: tn ? tn.x - ix : H.fx, faceY: tn ? tn.y - iy : H.fy, facing: H.act > 0 || !!tn, dead: H.down, stride: STRIDE.hero });
      draws.push({ d: ix + iy + 0.01, sp: heroAtlas.cells[a.dir][a.frame], fx: ox + P.sx, fy: oy + P.sy, h: pz * ZH, k: ix + iy, look: lookOf(H, H.down ? 0.35 : 0), team: 1, atl: heroAtlas, a });
    } else {
      draws.push({ d: ix + iy + 0.01, sp: heroSprite(p.moving ? p.frame : 0, p.mirror), fx: ox + P.sx, fy: oy + P.sy, h: pz * ZH, k: ix + iy });
    }
    // companions: their sim positions (they follow you, or fight on their own)
    party.slice(1).forEach((m, i) => {
      const atl = memberAtlas(m, m.actor || ({ fighter: 'hero_barbarian', rogue: 'hero_rogue', mage: 'hero_mage', cleric: 'hero_cleric', shaman: 'hero_shaman' })[m.cls]); if (!atl || m.x === undefined) return;
      const mx = lerp(m, 'x'), my = lerp(m, 'y'), f = fol[i] || (fol[i] = {}); f.x = mx; f.y = my;
      const cz = heightAt(sim.world, Math.floor(mx), Math.floor(my)), cp = project(mx, my, cz);
      const a = pickAnim(m, atl, { now, x: mx, y: my, moving: m.moving, faceX: m.fx, faceY: m.fy, facing: m.act > 0 || !m.moving, dead: m.down, sit: m.sitting && !m.moving, stride: STRIDE.hero, seed: 0.37 * (i + 1) });
      draws.push({ d: mx + my, sp: atl.cells[a.dir][a.frame], fx: ox + cp.sx, fy: oy + cp.sy, h: cz * ZH, k: mx + my, look: m.fallen ? GHOST : lookOf(m, m.down ? 0.35 : 0), team: m.fallen ? undefined : 1, atl, a });
    });
    // named townsfolk (sim world.npcs): idle where they stand, turning to you as you come near, with a
    // gesture now and then. Their playback state is presentation-only, kept here by NPC id.
    // (townsfolk walk a routine, world doc §5 v1.6: interpolated like everyone else, walking where they're headed)
    for (const n of sim.world.npcs || []) {
      const def = cast[n.id], atl = def && partyAtlas(def.look); if (!atl) continue;
      const qx = n.folk ? lerp(n, 'x') : n.x, qy = n.folk ? lerp(n, 'y') : n.y;
      const nz = heightAt(sim.world, Math.floor(qx), Math.floor(qy)), np = project(qx, qy, nz), nx = ox + np.sx, ny = oy + np.sy;
      if (nx < -60 || nx > nvw + 60 || ny < -40 || ny > nvh + 120) continue;
      let u = npcPres.get(n.id);
      if (!u) { const h = idHash(n.id); npcPres.set(n.id, (u = { fidgetN: 0, lookN: 0, h, seed: (h % 997) / 997, next: now + 2500 + (h % 6000), near: false })); }
      const near = Math.hypot(ix - n.x, iy - n.y) < 7, talking = talkingTo === n.id;
      if (greet === n.id) { greet = null; u.fidgetN++; u.next = now + 2600; }   // a greeting as the conversation opens
      else if (near && !u.near && !talking) u.lookN++;                  // she looks up as you come over
      else if (now > u.next) {                                         // a gesture: often in a conversation, now and then otherwise
        if (talking && u.fidgetN % 2) u.lookN++; else u.fidgetN++;
        const r = Math.imul(u.fidgetN + u.lookN + 1, 2654435761) ^ u.h;
        u.next = now + (talking ? 2800 + (r >>> 0) % 2400 : 7000 + (r >>> 0) % 6000);
      }
      u.near = near;
      const walking = !!n.moving;
      const a = pickAnim(u, atl, { now, x: qx, y: qy, moving: walking, faceX: walking ? n.fx : near || talking ? ix - qx : -1, faceY: walking ? n.fy : near || talking ? iy - qy : 1, facing: true, dir0: 2, stride: strideOf(atl, STRIDE.walk), seed: u.seed });
      draws.push({ d: qx + qy, sp: atl.cells[a.dir][a.frame], fx: nx, fy: ny, h: nz * ZH, k: qx + qy, look: lookOf(n), team: 0, atl, a, id: n.id });
    }
    // the crowd (pass 11f): no id, so a tap never picks one
    { const crowd = crowdOf(sim.world); if (crowd.length) stepCrowd(sim.world, crowd, now);
      for (const v of crowd) {
        const atl = partyAtlas(v.look); if (!atl) continue;
        const vz = heightAt(sim.world, Math.floor(v.x), Math.floor(v.y)), vp = project(v.x, v.y, vz), vx = ox + vp.sx, vy = oy + vp.sy;
        if (vx < -60 || vx > nvw + 60 || vy < -40 || vy > nvh + 120) continue;
        const a = pickAnim(v.u, atl, { now, x: v.x, y: v.y, moving: v.moving, faceX: v.fx, faceY: v.fy, facing: true, dir0: 2, stride: strideOf(atl, STRIDE.walk), seed: v.u.seed });
        draws.push({ d: v.x + v.y, sp: atl.cells[a.dir][a.frame], fx: vx, fy: vy, h: vz * ZH, k: v.x + v.y, look: CROWD_LOOK, team: 0, atl, a, noXray: true });
      } }
    // the dead on the barrows road (sim road.js; world doc §3.1 v1.9): ranks standing at ease, facing north
    // up the road for the relief that never came. No ring, no bar: they aren't in a fight with you.
    for (const q of sim.world.pickets || []) {
      const atl = enemyAtlas(q.kind); if (!atl) continue;
      const qz = heightAt(sim.world, Math.floor(q.x), Math.floor(q.y)), qp = project(q.x, q.y, qz), qx = ox + qp.sx, qy = oy + qp.sy;
      if (qx < -60 || qx > nvw + 60 || qy < -40 || qy > nvh + 120) continue;
      const a = pickAnim(q, atl, { now, x: q.x, y: q.y, moving: false, faceX: -0.25, faceY: -1, facing: true, dir0: 2, stride: STRIDE.skel, seed: (q.x * 0.37 + q.y * 0.11) % 1 });
      draws.push({ d: q.x + q.y, sp: atl.cells[a.dir][a.frame], fx: qx, fy: qy, h: qz * ZH, k: q.x + q.y, look: { flash: 0, dissolve: 0 }, team: 0, atl, a });
    }
    // the farm beasts, at their ease (beastFrame): no ring, no tap, and their ground shadow is in the bake
    for (const bst of beastList()) {
      const st = bst.st, bz = heightAt(sim.world, Math.floor(st.x), Math.floor(st.y)), bp = project(st.x, st.y, bz), bxs = ox + bp.sx, bys = oy + bp.sy;
      if (bxs < -60 || bxs > nvw + 60 || bys < -40 || bys > nvh + 80) continue;
      const sp = beastSprite(st.id + beastFrame(bst, now)) || beastSprite(st.id); if (!sp) continue;
      draws.push({ d: st.x + st.y, sp, fx: bxs, fy: bys, h: bz * ZH, k: st.x + st.y, look: null, noXray: true });
    }
    // enemies: one atlas per kind (ENEMY_ACTOR); the Ashbound rise from the ground, and the slain collapse, lie, then fade
    for (const e of sim.world.enemies || []) {
      const skelAtlas = enemyAtlas(e.kind);
      if (!skelAtlas) continue;
      const undead = UNDEAD_LOOK.has(skelAtlas.name);
      const exi = lerp(e, 'x'), eyi = lerp(e, 'y');
      const ez = heightAt(sim.world, Math.floor(exi), Math.floor(eyi));
      const ep = project(exi, eyi, ez), ex = ox + ep.sx, ey = oy + ep.sy;
      if (ex < -60 || ex > nvw + 60 || ey < -40 || ey > nvh + 120) continue;      // offscreen
      const dead = e.hp <= 0, deadT = dead ? DEATH_T - Math.max(0, e.dead || 0) : 0;
      const a = pickAnim(e, skelAtlas, { now, x: exi, y: eyi, moving: e.moving, faceX: e.fx, faceY: e.fy, facing: true, dead, deadT, dir0: 2,
        spawnP: e.spawn > 0 && undead ? 1 - e.spawn / 0.5 : undefined, stride: undead ? STRIDE.skel : strideOf(skelAtlas, STRIDE.walk), seed: (e.id * 0.37) % 1 });
      const fade = dead ? Math.max(0, (deadT - (DEATH_T - 0.35)) / 0.35) : 0;
      draws.push({ d: exi + eyi, sp: skelAtlas.cells[a.dir][a.frame], fx: ex, fy: ey, h: ez * ZH, k: exi + eyi, look: { flash: e.flash > 0 ? 0.36 : 0, dissolve: dead ? fade : !undead && e.spawn > 0 ? e.spawn / 0.5 : 0 }, team: dead ? 0 : e.elite ? 3 : 2, atl: skelAtlas, a, uid: e.id });   // (the living walk in out of the dark: a fade, not a rise)
    }
    // bolts in flight: small glowing sprites, a little above the ground
    for (const b of sim.world.projectiles || []) {
      if (!b.kind) continue;
      const bx = lerp(b, 'x'), by = lerp(b, 'y'), bz = heightAt(sim.world, Math.floor(bx), Math.floor(by)), bp = project(bx, by, bz);
      let sp;
      if (b.kind === 'arrow') { const vx = b.tgt.x - b.sx, vy = b.tgt.y - b.sy, a = Math.atan2((vx + vy) * HH, (vx - vy) * HW); sp = arrowSprite(((Math.round(a / (Math.PI / 8)) % 16) + 16) % 16); }
      else sp = boltSprite(b.kind);
      draws.push({ d: bx + by + 0.2, sp, fx: ox + bp.sx, fy: oy + bp.sy - 18, h: bz * ZH + 18, k: bx + by + 1.5 });
    }
    }
    if (globalThis.__trace) globalThis.__trace.push({ t: now, ox, oy, rx: lastCam.rx, ry: lastCam.ry, ix, iy, mv: p.moving,   // dev: motion trace (per rendered frame)
      party: draws.filter((d) => d.team === 1 && d.a).map((d) => [d.fx, d.fy, d.a.frame, d.a.dir]),
      foes: draws.filter((d) => d.team >= 2 && d.a && d.atl).map((d) => [d.fx, d.fy, d.a.frame, d.a.dir, d.atl.name, d.uid]) });
    if (heard) heard(draws, { hx: ox + P.sx, hy: oy + P.sy, nvw, ix, iy });   // the sound's listener (audio/listen.js): steps, swings, who's where
    if (globalThis.__noactors) draws.length = 0;   // dev: tools/actor-lab backdrop capture
    draws.sort((a, b) => a.d - b.d);
    // ground the figures: a soft contact shadow under each, and in battle a faint team ring
    const rings = !!sim.battle;
    if (sim.world.kind !== 'dungeon') for (const dr of draws) if (dr.team !== undefined && dr.sp && !(dr.look && (dr.look.ghost || dr.look.dissolve))) castShadow(dr.sp, dr.fx, dr.fy, dr.h);   // no sun underground
    for (const dr of draws) if (dr.team !== undefined && dr.sp) footMark(Math.round(dr.fx), Math.round(dr.fy), dr.h, rings ? dr.team : 0, dr.look && dr.look.dissolve || 0);
    for (const dr of draws) if (dr.sp) { const x = stamp(sALB, sNRM, sEMI, nvw, nvh, dr.sp, dr.fx, dr.fy, dr.h, sDEP, dr.k, dr.noXray ? 2 : true, dr.look); if (globalThis.__xray && dr.id) globalThis.__xray[dr.id] = x; }   // dev: how hidden each named person is
    // weapon effects over the figures (light only — the EMISSIVE plane), then the hit sparks
    fx.target({ EMI: sEMI, DEP: sDEP, W: nvw, H: nvh, DPX });
    for (const dr of draws) if (dr.atl && dr.a.atk) fx.weapon(dr.atl, dr.a, dr.fx, dr.fy, dr.h, dr.k);
    fx.particles(now, (x, y) => { const z = heightAt(sim.world, Math.floor(x), Math.floor(y)), q = project(x, y, z); return { sx: ox + q.sx, sy: oy + q.sy, h: z * ZH, key: x + y }; });

    if (globalThis.__rstats) globalThis.__rstats.cpu.push(performance.now() - t0);
    // upload the window G-buffer
    gl.bindTexture(gl.TEXTURE_2D, texAlb); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, nvw, nvh, gl.RGBA, gl.UNSIGNED_BYTE, sALB);
    gl.bindTexture(gl.TEXTURE_2D, texNrm); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, nvw, nvh, gl.RGBA, gl.UNSIGNED_BYTE, sNRM);
    gl.bindTexture(gl.TEXTURE_2D, texEmi); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, nvw, nvh, gl.RGBA, gl.UNSIGNED_BYTE, sEMI);

    const t = now / 1000;
    // hero carry-light + corruption flares (all in native/scratch pixel space)
    // the carry light rides with the ember wisp above the shoulder (critic pass 3: at chest height it
    // sat inside the figure and blew the knight's armour out to a white ghost)
    const hx = ox + P.sx, hy = oy + P.sy - 30, hz = pz * ZH + 46;
    const L = [[hx + 8, hy, hz], [0, 0, 0], [0, 0, 0]];
    const outdoor = sim.world.kind !== 'dungeon';
    skyAt(skyHoldT ?? sim.state.t, skyNow); lastNow = now;
    const ease = Math.min(1, (now - skyEase0) / SKY_EASE); mixSky(sky, skyFrom, skyNow, ease * ease * (3 - 2 * ease));
    const wx = outdoor && !st ? weatherNow(sim) : NO_WEATHER, wLight = lightOf(sky); weatherLight(sky, wx);   // rain, fog, snow: mostly in the light (weatherfx.js)
    const hl = st ? 0 : outdoor ? 0.42 * sky.wisp : 1;              // outdoors the hero's ember-wisp is a glow at dusk, a torch at night (none on the Stage: even light)
    const LC = [[1.9 * WISP * hl, 1.15 * WISP * hl, 0.42 * WISP * hl], [0, 0, 0], [0, 0, 0]];
    // the two nearest hazard/prop lights to the hero cast this frame (shader has 3 slots)
    const near = flares.map((s) => ({ s, d: Math.hypot(s.x - ix, s.y - iy) })).sort((a, b) => a.d - b.d).slice(0, 2);
    near.forEach(({ s }, i) => {
      const sp = project(s.x + 0.5, s.y + 0.5, s.z);
      const fl = 0.6 + 0.4 * vnoise(t * (i === 0 ? 5.3 : 4.1), i === 0 ? 3.3 : 9.9, sim.world.seed);
      L[i + 1] = [ox + sp.sx, oy + sp.sy, s.z * ZH + 12];
      const g = outdoor ? fl * sky.lamp : fl;                       // lamps and windows cast less by day
      LC[i + 1] = [s.color[0] * g, s.color[1] * g, s.color[2] * g];
    });

    // PASS A — lighting at native resolution
    gl.bindFramebuffer(gl.FRAMEBUFFER, litFbo);
    gl.viewport(0, 0, nvw, nvh);
    gl.useProgram(lightP);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texAlb); gl.bindSampler(0, sampNearest);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texNrm); gl.bindSampler(1, sampNearest);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, texEmi); gl.bindSampler(2, sampNearest);
    gl.uniform1i(U(lightP, 'uAlb'), 0); gl.uniform1i(U(lightP, 'uNrm'), 1); gl.uniform1i(U(lightP, 'uEmi'), 2);
    gl.uniform2f(U(lightP, 'uRes'), nvw, nvh);
    gl.uniform1f(U(lightP, 'uTime'), t);
    gl.uniform1f(U(lightP, 'uAmb'), AMB);
    gl.uniform1f(U(lightP, 'uWispA'), st ? 0 : outdoor ? WISP * 0.6 * Math.min(1, sky.wisp) : WISP);
    gl.uniform3fv(U(lightP, 'uL'), L.flat());
    gl.uniform3fv(U(lightP, 'uLC'), LC.flat());
    // the wisp floats beside the 56 px figure's shoulder (not over its torso), bobbing gently
    gl.uniform3f(U(lightP, 'uSunL'), -0.72, 0.16, 0.67);                 // low sun from the upper left (matches the baked shadows)
    if (outdoor) { gl.uniform3fv(U(lightP, 'uSunC'), sky.sun); gl.uniform3fv(U(lightP, 'uAmbC'), sky.amb); } else { gl.uniform3f(U(lightP, 'uSunC'), 0, 0, 0); gl.uniform3f(U(lightP, 'uAmbC'), 0, 0, 0); }
    gl.uniform1f(U(lightP, 'uWin'), outdoor ? sky.win : 1);
    gl.uniform1f(U(lightP, 'uLift'), outdoor ? sky.lift : 0);
    gl.uniform1f(U(lightP, 'uHaze'), outdoor ? sky.haze : 1);
    gl.uniform2f(U(lightP, 'uWispPx'), hx + 19, oy + P.sy - 50 + Math.sin(t * 2.1) * 1.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindTexture(gl.TEXTURE_2D, litTex); gl.generateMipmap(gl.TEXTURE_2D);

    // PASS B — crisp (sharp-bilinear) upscale + bloom + grade
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, vw, vh);
    gl.useProgram(postP);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, litTex); gl.bindSampler(0, sampNearest);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, litTex); gl.bindSampler(1, sampMip);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, texAlb); gl.bindSampler(2, sampNearest);
    gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, texNrm); gl.bindSampler(3, sampNearest);
    gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, texEmi); gl.bindSampler(4, sampNearest);
    gl.uniform1i(U(postP, 'uLit'), 0); gl.uniform1i(U(postP, 'uLitM'), 1);
    gl.uniform1i(U(postP, 'uAlbT'), 2); gl.uniform1i(U(postP, 'uNrmT'), 3); gl.uniform1i(U(postP, 'uEmiT'), 4);
    gl.uniform2f(U(postP, 'uOut'), vw, vh);
    gl.uniform2f(U(postP, 'uNative'), nvw, nvh);
    gl.uniform1f(U(postP, 'uScale'), S);
    gl.uniform2f(U(postP, 'uOff'), (lastCam.rx - ox) * S, (lastCam.ry - oy) * S);   // the sub-pixel part of the camera
    gl.uniform1f(U(postP, 'uBloom'), outdoor ? BLOOM * sky.bloom : BLOOM);
    gl.uniform1f(U(postP, 'uVig'), outdoor ? sky.vig : 0.85); gl.uniform1f(U(postP, 'uSat'), outdoor ? sky.sat : 1);
    gl.uniform1f(U(postP, 'uTime'), t);
    gl.uniform1i(U(postP, 'uView'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 2D overlay (above the GL canvas): minimap + floating joystick
    octx.clearRect(0, 0, vw, vh);
    if (wx.k) drawWeather(octx, wx, { vw, vh, S, camX: -lastCam.rx, camY: -lastCam.ry, now, light: wLight });   // under the minimap and labels
    if (st) st.overlay(octx, (x, y) => { const q = project(x, y, pz); return [(lastCam.rx + q.sx) * S, (lastCam.ry + q.sy) * S]; }, S);   // the Stage's names and headings
    else if (sim.world.kind === 'dungeon') { drawShrines(lastCam.rx, lastCam.ry, ix, iy); drawMinimap(ix, iy); } else { if (camT < 0.5) drawOutdoorMinimap(ix, iy); drawLabels(lastCam.rx, lastCam.ry, ix, iy); }   // no minimap on the town's home screen
    drawGoal(lastCam.rx, lastCam.ry, now);                 // overlays use the exact camera: glued to the gliding world
    drawBattle(lastCam.rx, lastCam.ry, ix, iy, pz, now);
    if (transit) {                                                 // fading in from the scene change
      const a = 1 - (t0 - transit.fadeFrom) / TRANSIT_FADE;
      if (a <= 0) transit = null; else { octx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; octx.fillRect(0, 0, vw, vh); }
    }
    drawBanner(now);
    const j = input.joystick();
    if (j) {
      const k = vw / window.innerWidth;
      octx.strokeStyle = 'rgba(200,220,180,0.25)'; octx.lineWidth = 2;
      octx.beginPath(); octx.arc(j.bx, j.by, 46 * k, 0, Math.PI * 2); octx.stroke();
      octx.fillStyle = 'rgba(240,165,0,0.5)'; octx.beginPath(); octx.arc(j.kx, j.ky, 18 * k, 0, Math.PI * 2); octx.fill();
    }
  }

  // Fog-of-war minimap, top-right: discovered rooms in the theme tint, corridors
  // that lead out of them (so unexplored exits are visible), and the hero marker.
  // Outdoor minimap: the whole map pre-rendered once per scene (ground, water, roads,
  // structures), shown top-down like the dungeon's, with the hero dot.
  function drawOutdoorMinimap(ix, iy) {
    const w = sim.world, k = vw / window.innerWidth, MM = 96 * k, pad = 6 * k;
    const bx = vw - MM - pad - (MM_RIGHT + safeR) * k, by = mmTop() * k, x0 = -12, y0 = -12, span = Math.max(w.W, w.H) + 24;
    if (!outMap) {
      const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'), img = x.createImageData(N, N);
      const COL = [[46, 64, 42], [96, 80, 60], [104, 98, 104], [40, 86, 118], [70, 60, 48], [128, 110, 60]];
      for (let py = 0; py < N; py++) for (let px = 0; px < N; px++) {
        const tx = x0 + (px + 0.5) * span / N, ty = y0 + (py + 0.5) * span / N, m = materialAt(w, tx, ty), i = (py * N + px) * 4;
        const cc = COL[['grass', 'dirt', 'cobble', 'water', 'bank', 'field'].indexOf(m)] || COL[0];
        img.data[i] = cc[0]; img.data[i + 1] = cc[1]; img.data[i + 2] = cc[2]; img.data[i + 3] = 235;
      }
      x.putImageData(img, 0, 0);
      for (const st of w.structs) {
        const f = envMeta && envMeta.sprites[st.id]; if (!f) continue;
        if (st.id.startsWith('ug_')) continue;                   // (the undergrowth isn't mapped: a tuft isn't a landmark)
        const tree = /pine|oak|autumn|dead|grove|mountain|rock/.test(st.id), sx = (st.x - x0) * N / span, sy = (st.y - y0) * N / span;
        x.fillStyle = /mountain/.test(st.id) ? 'rgba(120,118,128,0.9)' : tree ? 'rgba(24,44,28,0.9)' : 'rgba(170,86,70,0.95)';
        const r = tree ? (/grove|mountain/.test(st.id) ? 3 : 1.3) : 2.2; x.fillRect(sx - r, sy - r, r * 2, r * 2);
      }
      outMap = c;
    }
    octx.fillStyle = 'rgba(10,8,16,0.60)'; octx.fillRect(bx - pad, by - pad, MM + 2 * pad, MM + 2 * pad);
    octx.imageSmoothingEnabled = true; octx.drawImage(outMap, bx, by, MM, MM);
    octx.strokeStyle = 'rgba(130,120,160,0.35)'; octx.lineWidth = Math.max(1, k); octx.strokeRect(bx - pad, by - pad, MM + 2 * pad, MM + 2 * pad);
    // places of note: diamonds (the Barrows violet — the way down; Thornwick gold; others pale)
    for (const L of w.labels || []) {
      if (L.service || hiddenHere(L)) continue;
      const mx = bx + (L.x - x0) / span * MM, my = by + (L.y - y0) / span * MM, r = Math.max(2.5, 3.2 * k);
      octx.fillStyle = /Barrows/.test(L.text) ? '#b48cff' : /Thornwick|Saltmere/.test(L.text) ? '#e0b060' : 'rgba(220,210,190,0.85)';
      octx.beginPath(); octx.moveTo(mx, my - r); octx.lineTo(mx + r, my); octx.lineTo(mx, my + r); octx.lineTo(mx - r, my); octx.closePath(); octx.fill();
      octx.strokeStyle = 'rgba(0,0,0,0.55)'; octx.lineWidth = Math.max(1, 0.8 * k); octx.stroke();
    }
    octx.fillStyle = '#f0a500'; octx.beginPath(); octx.arc(bx + (ix - x0) / span * MM, by + (iy - y0) / span * MM, Math.max(2, 2.6 * k), 0, Math.PI * 2); octx.fill();
    octx.strokeStyle = 'rgba(0,0,0,0.6)'; octx.stroke();
  }
  // Place names float over nearby landmarks (the tavern, the guild hall, the keep…).
  function drawLabels(ox, oy, ix, iy) {
    const k = vw / window.innerWidth, z = heightAt(sim.world, 0, 0);
    octx.font = `600 ${Math.round(11 * k)}px Georgia, 'Times New Roman', serif`; octx.textAlign = 'center';
    for (const L of sim.world.labels || []) {
      const d = Math.hypot(L.x - ix, L.y - iy); if (d > (L.service && camT > 0.5 ? 90 : 60) || hiddenHere(L)) continue;   // (on the home screen every service's plaque, however far: the temple heads the square)
      const top = (envMeta && L.id && envMeta.sprites[L.id]) ? envMeta.sprites[L.id].top * 9.8 : 100;
      const P = project(L.x, L.y, z), sy0 = (oy + P.sy - top - 10) * S; let sx = (ox + P.sx) * S;
      if (L.service ? (sx < -vw * 0.3 || sx > vw * 1.3 || sy0 < -vh * 0.4 || sy0 > vh) : (sx < 0 || sx > vw || sy0 < -40 * k || sy0 > vh)) continue;
      const sy = Math.max(sy0, (hudB + 22) * k);               // never under the top HUD: a tall spire's label slides down below it
      const a = L.service && camT > 0.5 ? 1 : Math.max(0, Math.min(1, (60 - d) / 20));   // on the home screen every service reads
      if (L.service) {                                              // service plaques: tappable-looking signs
        const tw = octx.measureText(L.text).width + 14 * k, th = 17 * k;
        sx = Math.min(Math.max(sx, tw / 2 + 4 * k), vw - tw / 2 - 4 * k);      // a service at the frame's edge keeps its plaque on screen
        if (sy > (hudB + 112) * k && sy - th < (hudB + 222) * k) sx = Math.min(sx, vw - tw / 2 - (62 + safeR) * k);   // ...and clear of the compass and journal buttons on the right (ui/compass.js, ui/journal.js: right 12, 44 wide, from 120 to 216 under the HUD)
        octx.fillStyle = `rgba(16,12,22,${0.78 * a})`; octx.strokeStyle = `rgba(214,170,98,${0.55 * a})`; octx.lineWidth = Math.max(1, k);
        octx.beginPath(); octx.roundRect(sx - tw / 2, sy - th + 4 * k, tw, th, 5 * k); octx.fill(); octx.stroke();
        octx.fillStyle = `rgba(240,200,128,${a})`; octx.fillText(L.text, sx, sy);
        continue;
      }
      octx.fillStyle = `rgba(8,5,14,${0.7 * a})`; octx.fillText(L.text, sx + k, sy + k);
      octx.fillStyle = `rgba(236,214,170,${0.92 * a})`; octx.fillText(L.text, sx, sy);
    }
    // named people: their name over their head as you come near (tap them to talk)
    for (const n of sim.world.npcs || []) {
      const d = Math.hypot(n.x - ix, n.y - iy), def = cast[n.id]; if (d > 12 || !def) continue;
      const a = Math.max(0, Math.min(1, (12 - d) / 4)), nz = heightAt(sim.world, Math.floor(n.x), Math.floor(n.y)), P = project(n.x, n.y, nz);
      const sx = (ox + P.sx) * S, sy = (oy + P.sy - 62) * S;
      octx.fillStyle = `rgba(8,5,14,${0.75 * a})`; octx.fillText(def.name, sx + k, sy + k);
      octx.fillStyle = `rgba(255,226,160,${a})`; octx.fillText(def.name, sx, sy);
    }
    // who has a quest for you (sim quests.js marks): a gold "!" for one to take, a green "?" for one to hand
    // in, bobbing over their head and seen from across the square. The symbol says which, not just the colour.
    const QM = sim.quests && sim.quests.marks ? sim.quests.marks() : {}, bob = Math.sin(performance.now() / 380) * 2;
    for (const n of sim.world.npcs || []) {
      const m = QM[n.id], d = Math.hypot(n.x - ix, n.y - iy); if (!m || d > 40 || !cast[n.id]) continue;
      const nz = heightAt(sim.world, Math.floor(n.x), Math.floor(n.y)), P = project(n.x, n.y, nz);
      const sx = (ox + P.sx) * S, sy = (oy + P.sy - (d <= 12 ? 80 : 68) + bob) * S, r = 12 * k;   // (over the name when it shows)
      if (sx < -20 * k || sx > vw + 20 * k || sy < (hudB + 14) * k || sy > vh) continue;
      const col = m === 'ready' ? '#8fe07a' : '#ffc840';
      octx.beginPath(); octx.moveTo(sx, sy - r * 1.25); octx.lineTo(sx + r, sy); octx.lineTo(sx, sy + r * 1.25); octx.lineTo(sx - r, sy); octx.closePath();
      octx.shadowColor = col; octx.shadowBlur = 8 * k; octx.fillStyle = 'rgba(16,12,22,0.9)'; octx.fill(); octx.shadowBlur = 0;
      octx.lineWidth = Math.max(2, 2 * k); octx.strokeStyle = col; octx.stroke();
      octx.font = `800 ${Math.round(17 * k)}px Georgia, 'Times New Roman', serif`; octx.textAlign = 'center'; octx.textBaseline = 'middle';
      octx.fillStyle = col; octx.fillText(m === 'ready' ? '?' : '!', sx, sy + 0.5 * k);
      octx.textBaseline = 'alphabetic';
    }
  }
  // The props a tap can use (a chest, a shrine, the stairs gate), each matched against its sprite as drawn
  // rather than the floor tile under the finger: a chest stands twice its old height and a shrine three
  // times, so a tap on the lid or the orb landed on the tile behind and only walked there (2026-10-01).
  // Within 3 native px of a drawn pixel counts; the nearest the camera wins. (nx, ny) are native px from
  // the camera origin.
  const USABLE = new Set(['chest', 'shrine', 'stairs']);
  function propUnder(nx, ny) {
    const w = sim.world; if (!w.props) return null;
    let best = null;
    for (const [key, kind] of w.props) {
      if (!USABLE.has(kind) || (kind === 'stairs' && w.stairwell)) continue;
      const c = key.indexOf(','), tx = +key.slice(0, c), ty = +key.slice(c + 1);
      if (propAt(w, tx, ty) !== kind || (best && tx + ty <= best.tx + best.ty)) continue;
      const sp = props[kind] && props[kind][0]; if (!sp) continue;
      const P = project(tx + 0.5, ty + 0.5, heightAt(w, tx, ty)), lx = Math.floor(nx - (P.sx - sp.ax)), ly = Math.floor(ny - (P.sy - sp.ay));
      if (lx < -3 || ly < -3 || lx >= sp.w + 3 || ly >= sp.h + 3) continue;
      let hit = false;
      for (let dy = -3; dy <= 3 && !hit; dy++) for (let dx = -3; dx <= 3; dx++) { const X = lx + dx, Y = ly + dy; if (X >= 0 && Y >= 0 && X < sp.w && Y < sp.h && sp.mask[Y * sp.w + X]) { hit = true; break; } }
      if (hit) best = { tx, ty, kind };
    }
    return best;
  }
  // An unused shrine says what it is from across the room, and what it does as you come near (GDD §3.6):
  // its orb's aqua, never the colour alone. A used one goes dark and unlabelled.
  function drawShrines(ox, oy, ix, iy) {
    const w = sim.world, sp = props.shrine && props.shrine[0]; if (!w.props || !sp) return;
    const k = vw / window.innerWidth;
    for (const [key, kind] of w.props) {
      if (kind !== 'shrine') continue;
      const c = key.indexOf(','), tx = +key.slice(0, c), ty = +key.slice(c + 1), d = Math.hypot(tx + 0.5 - ix, ty + 0.5 - iy);
      if (d > 14 || propAt(w, tx, ty) !== 'shrine') continue;
      const P = project(tx + 0.5, ty + 0.5, heightAt(w, tx, ty)), sx = (ox + P.sx) * S, sy = (oy + P.sy - sp.ay - 4) * S;
      if (sx < -60 * k || sx > vw + 60 * k || sy < (hudB + 14) * k || sy > vh) continue;
      const a = Math.max(0, Math.min(1, (14 - d) / 4));
      octx.textAlign = 'center'; octx.font = `700 ${Math.round(12 * k)}px Georgia, 'Times New Roman', serif`;
      octx.fillStyle = `rgba(6,10,14,${0.8 * a})`; octx.fillText('Shrine', sx + k, sy + k);
      octx.fillStyle = `rgba(150,232,244,${a})`; octx.fillText('Shrine', sx, sy);
      if (d <= 6) {
        const b = Math.max(0, Math.min(1, (6 - d) / 2)), t2 = 'mends everyone, or raises one of the slain · once';
        octx.font = `${Math.round(11 * k)}px Georgia, 'Times New Roman', serif`;
        octx.fillStyle = `rgba(6,10,14,${0.8 * b})`; octx.fillText(t2, sx + k, sy + 14 * k + k);
        octx.fillStyle = `rgba(200,236,240,${b})`; octx.fillText(t2, sx, sy + 14 * k);
      }
    }
  }
  // ── battle overlay: HP bars, floating numbers, ability callouts, the room-level · wave pill ──
  const floats = [];
  // numbers fan out: each new float near a recent one steps sideways/up so a melee doesn't stack them into mush
  const addFloat = (x, y, text, color, size = 12, rise = 22) => {
    const t0 = performance.now(), busy = floats.filter((f) => t0 - f.t0 < 450 && Math.hypot(f.x - x, f.y - y) < 1.5).length;
    floats.push({ x, y, text, color, size, rise, t0, jx: ((busy % 3) - 1) * 11 + (busy ? 0 : 0), jy: Math.floor(busy / 3) * 9 + (busy % 2) * 4 });
    if (floats.length > 40) floats.shift();
  };
  // a chest's gold rises off it, gilt; gear follows as its own beam and card (sheet.js)
  sim.bus.on('chestOpened', (c) => addFloat(c.x, c.y, '+' + c.gold + ' gold', '#ffd070', 11, 32));
  sim.bus.on('combat', (c) => {
    if (c.t === 'hit') {                                                          // sparks fly off the struck, away from the striker
      const st = styleOfSrc(c.src, c.party, ENEMY_ACTOR), a = project(c.ax ?? c.x, c.ay ?? c.y, 0), b = project(c.x, c.y, 0);
      let dx = b.sx - a.sx, dy = b.sy - a.sy; const l = Math.hypot(dx, dy); if (l > 1e-3) { dx /= l; dy /= l; } else { dx = 0; dy = -1; }
      fx.impact(c.x, c.y, dx, dy, (st && ((c.heavy && st.heavySpark) || st.spark)) || [255, 232, 200], { heavy: c.heavy, crit: c.crit, now: clockNow || performance.now() });
    }
    if (c.t === 'hit') addFloat(c.x, c.y, (c.crit ? c.amount + '!' : '' + c.amount), c.party ? '#ff6a5a' : c.crit ? '#ffd24a' : '#f2ece0', c.crit ? 15 : 12);
    else if (c.t === 'miss') addFloat(c.x, c.y, 'miss', '#9a93a8', 10);
    else if (c.t === 'xp') addFloat(c.x, c.y, '+' + c.amount + ' xp', '#c8a0ff', 10, 30);
    else if (c.t === 'cinders') addFloat(c.x, c.y, '+' + c.amount + ' ✦', '#ff9440', 11, 36);   // an elite's or a boss's cinders, for the smith
    else if (c.t === 'ability') addFloat(c.x, c.y, c.name, '#ffb060', 11, 16);
    else if (c.t === 'down') addFloat(c.x, c.y, c.name + ' falls', '#ff6a5a', 12, 26);
    else if (c.t === 'rise') addFloat(c.x, c.y, c.name + ' rises', '#8fd08f', 12, 26);
    else if (c.t === 'fallen') addFloat(c.x, c.y, c.name + ' is slain', '#b8c4d8', 12, 30);
    else if (c.t === 'heal') addFloat(c.x, c.y, '+' + c.amount, '#8fe07a', 12, 20);
    else if (c.t === 'ward') addFloat(c.x, c.y, 'ward ' + c.amount, '#8fc8ff', 11, 20);
    else if (c.t === 'warded') addFloat(c.x, c.y, 'warded', '#8fc8ff', 10);
    else if (c.t === 'hex') addFloat(c.x, c.y, 'hexed', '#b8e070', 11, 20);
    else if (c.t === 'lifeline') addFloat(c.x, c.y, 'Lifeline', '#f0e0a0', 12, 24);
    else if (c.t === 'heavy') { const pl = sim.state.player; if (Math.hypot(c.x - pl.x, c.y - pl.y) < 14) shake = { t0: performance.now(), amp: c.party ? 2.2 : 1.6 }; }   // a heavy blow lands: a short camera jolt
  });
  const LOOT_RGB = { common: [220, 208, 185], fine: [120, 235, 110], rare: [90, 160, 255], heirloom: [255, 165, 50] };
  sim.bus.on('loot', (l) => { if (!l.salvaged) fx.beam(l.x, l.y, LOOT_RGB[l.item.r] || LOOT_RGB.common, { now: clockNow || performance.now() }); });   // a drop: a column of light where it fell
  sim.bus.on('wave', (w) => { banner = { text: w.cleared ? `Wave ${w.wave} cleared` : `Wave ${w.wave}`, until: performance.now() + (w.cleared ? 1600 : 1300), small: true }; });
  // bosses (battle.js): who stands in the hall, what it does, and its fall
  const bossLine = { call: ['calls his men to him', 'he stands behind them until they fall'], kindle: ['kindles the dead', 'the last one down gets back up'], line: ['holds the line', 'the dead near it take half: knock it down first'], swarm: ['drums', 'while he drums, more come out of the tunnels: put him down'] };
  sim.bus.on('bossWave', ({ id, name }) => { const B = BOSSES[id]; banner = { text: name, sub: bossLine[B.mech][1], until: performance.now() + 3200 }; });
  sim.bus.on('bossCall', () => { banner = { text: 'Garrow calls his men', sub: bossLine.call[1], until: performance.now() + 2200, small: true }; });
  sim.bus.on('bossSwarm', () => { banner = { text: 'Skarn drums: goblins pour out', sub: bossLine.swarm[1], until: performance.now() + 2000, small: true }; });
  sim.bus.on('bossKindle', () => { banner = { text: 'The Stranger kindles the dead', sub: bossLine.kindle[1], until: performance.now() + 2000, small: true }; });
  sim.bus.on('bossDown', ({ name, first }) => { banner = { text: `${name} falls`, sub: first ? 'the room is quiet · something was left behind' : 'the room is quiet', until: performance.now() + 3200 }; });
  sim.bus.on('tideTurned', () => { banner = { text: 'The room falls back', sub: 'the tide turns: the next climb starts here', until: performance.now() + 2200, small: true }; });
  sim.bus.on('battle', (b) => { if (b.on) banner = { text: `Level ${b.level} room`, sub: dangerWord(b.level), until: performance.now() + 1100 }; });
  sim.bus.on('levelUp', (l) => { banner = { text: `${l.name} reaches level ${l.level}`, until: performance.now() + 2200, small: true }; });
  sim.bus.on('defeat', (d) => { banner = { text: 'Your party is beaten', sub: `you wake at the temple · Weakened${d.lost ? ` · lost ${d.lost} gold` : ''}`, until: performance.now() + 3600 }; });
  sim.bus.on('resurrected', (r) => { banner = { text: `${r.name} rises`, sub: r.how === 'shrine' ? 'the shrine’s light fades' : 'the temple’s grace', until: performance.now() + 2600, small: true }; });
  // How a room's level reads against your hero's: at or below → gold, +1 → amber, +2 → orange, +3 or more → red.
  const DANGER = [['#f0c880', 'even match'], ['#ffc060', 'a step up'], ['#ff9a50', 'dangerous'], ['#ff5a4a', 'deadly']];
  const dangerOf = (lv) => DANGER[Math.max(0, Math.min(3, lv - sim.state.party[0].level))];
  const dangerColor = (lv) => dangerOf(lv)[0], dangerWord = (lv) => dangerOf(lv)[1];
  function drawBattle(ox, oy, ix, iy, pz, now) {
    const k = vw / window.innerWidth, w = sim.world, b = sim.battle, party = sim.state.party;
    const scr = (x, y, lift = 0) => { const z = heightAt(w, Math.floor(x), Math.floor(y)), P = project(x, y, z); return [(ox + P.sx) * S, (oy + P.sy - lift) * S]; };
    const bar = (x, y, frac, col, wide = 18) => {
      const [sx, sy] = scr(x, y, 62), bw = wide * S * 0.9, bh = Math.max(3, 3.2 * k);
      octx.fillStyle = 'rgba(8,6,12,0.8)'; octx.fillRect(sx - bw / 2 - k, sy - k, bw + 2 * k, bh + 2 * k);
      octx.fillStyle = col; octx.fillRect(sx - bw / 2, sy, bw * Math.max(0, Math.min(1, frac)), bh);
    };
    if (b) {
      for (const e of w.enemies || []) if (e.hp > 0 && !(e.spawn > 0)) bar(e.x, e.y, e.hp / e.maxHp, e.elite ? '#ff9a3a' : '#d24a3c', e.elite ? 24 : 18);
      party.forEach((m, i) => { if (m.down || m.fallen) return; const x = i ? (fol[i - 1] || m).x : ix, y = i ? (fol[i - 1] || m).y : iy; const s = sim.state.party[i]; const mx = maxHpOf(s); bar(x, y, s.hp / mx, '#5aa35c', 16); });
      // the room-level · wave pill under the HUD, tinted by how far the room is above you
      // …and, from the second wave, how far the tide has lifted the foes (GDD §7.1: each wave of a visit is tougher)
      const txt = `ROOM LV ${b.level}  ·  WAVE ${b.wave}${b.tide > 0.005 ? `  ·  FOES +${Math.round(b.tide * 100)}%` : ''}`, dc = dangerColor(b.level);
      octx.font = `700 ${Math.round(11 * k)}px ui-monospace, Menlo, monospace`; octx.textAlign = 'center';
      // under the HUD row (hudB: the phone's safe area included), centred, but never under the minimap
      const tw = octx.measureText(txt).width + 18 * k, mmL = vw - (MM_CSS + 2 * MM_PAD + MM_RIGHT + safeR + 8) * k;
      const px = Math.max(tw / 2 + 10 * k, Math.min(vw / 2, mmL - tw / 2)), py = (hudB + 16) * k;
      octx.fillStyle = 'rgba(14,10,18,0.82)'; octx.strokeStyle = dc; octx.lineWidth = Math.max(1, k);
      octx.beginPath(); octx.roundRect(px - tw / 2, py - 13 * k, tw, 19 * k, 9 * k); octx.fill(); octx.stroke();
      octx.fillStyle = dc; octx.fillText(txt, px, py + 1 * k);
      // a boss's bar under the pill: its name, its health, and a shield while it's guarded (battle.js BOSSES)
      const boss = (w.enemies || []).find((e) => e.boss && e.hp > 0 && !e.dead);
      if (boss) {
        const bw = Math.min(vw * 0.38, 150 * k, 2 * (mmL - px)), bh = 7 * k, bx0 = px - bw / 2, by0 = py + 24 * k, f = boss.hp / boss.maxHp;   // (clear of the minimap on the right)
        const guarded = halved(boss, w.enemies || []);
        octx.font = `600 ${Math.round(12 * k)}px Georgia, 'Times New Roman', serif`; octx.fillStyle = 'rgba(0,0,0,0.7)'; octx.fillText(BOSSES[boss.boss].name, px + k, by0 - 3 * k + k);
        octx.fillStyle = '#f0c880'; octx.fillText(BOSSES[boss.boss].name + (guarded ? '  ⛨' : ''), px, by0 - 3 * k);
        octx.fillStyle = 'rgba(14,10,18,0.85)'; octx.fillRect(bx0 - k, by0 + 2 * k, bw + 2 * k, bh + 2 * k);
        octx.fillStyle = guarded ? '#8a93a8' : '#c8402c'; octx.fillRect(bx0, by0 + 3 * k, bw * f, bh);
        octx.strokeStyle = 'rgba(240,200,128,0.6)'; octx.lineWidth = Math.max(1, k); octx.strokeRect(bx0 - k, by0 + 2 * k, bw + 2 * k, bh + 2 * k);
      }
    }
    // floating numbers
    const t = performance.now();
    for (let i = floats.length - 1; i >= 0; i--) {
      const f = floats[i], a = (t - f.t0) / 900; if (a >= 1) { floats.splice(i, 1); continue; }
      const [sx0, sy0] = scr(f.x, f.y, 56 + (f.jy || 0) + f.rise * a), sx = sx0 + (f.jx || 0) * S, sy = sy0;
      octx.font = `800 ${Math.round(f.size * k)}px ui-monospace, Menlo, monospace`; octx.textAlign = 'center';
      octx.globalAlpha = a < 0.7 ? 1 : 1 - (a - 0.7) / 0.3;
      octx.fillStyle = 'rgba(0,0,0,0.75)'; octx.fillText(f.text, sx + k, sy + k);
      octx.fillStyle = f.color; octx.fillText(f.text, sx, sy);
      octx.globalAlpha = 1;
    }
  }
  // the sim's own max HP (class, level, attributes, gear, Weakened). A separate class table here
  // had no cleric: the first HP bar drawn in a fight threw, and the frame loop stopped (a freeze).
  const maxHpOf = (m) => statsFor(m).maxHp;
  function drawBanner(now) {
    if (!banner || now > banner.until || stage) return;           // (the Stage has no scene title over its lineup)
    const k = vw / window.innerWidth, a = Math.min(1, (banner.until - now) / 600);
    const size = banner.small ? 16 : 20, y = (hudB + (banner.small ? 68 : 100)) * k;   // (under the room pill and a boss's bar)
    octx.font = `600 ${Math.round(size * k)}px Georgia, 'Times New Roman', serif`; octx.textAlign = 'center';
    octx.fillStyle = `rgba(8,5,14,${0.75 * a})`; octx.fillText(banner.text, vw / 2 + 1.5 * k, y + 1.5 * k);
    octx.fillStyle = `rgba(240,200,130,${a})`; octx.fillText(banner.text, vw / 2, y);
    if (banner.sub) { octx.font = `${Math.round(12 * k)}px Georgia, serif`; octx.fillStyle = `rgba(200,190,176,${a})`; octx.fillText(banner.sub, vw / 2, y + 22 * k); }
  }
  // Tap-to-move destination: a small gold iso ring that pulses in, with a faint dot trail
  // along the remaining path; gone the moment the hero arrives or the stick takes over.
  let goalT0 = 0, lastGoal = null;
  const partyH = () => { const el = document.getElementById('party'); return el ? el.getBoundingClientRect().height : 0; };
  function drawGoal(ox, oy, now) {
    const p = sim.state.player, g = p.goal;
    if (!g || !p.path) { lastGoal = null; return; }
    if (g !== lastGoal) { lastGoal = g; goalT0 = now; }
    const k = vw / window.innerWidth, t = Math.min(1, (now - goalT0) / 220), pulse = 1 + 0.08 * Math.sin(now / 160);
    const at = (x, y) => { const z = heightAt(sim.world, Math.floor(x), Math.floor(y)), P = project(x, y, z); return [(ox + P.sx) * S, (oy + P.sy) * S]; };
    octx.fillStyle = 'rgba(240,200,120,0.35)';
    for (const [x, y] of p.path.slice(0, -1)) { const [sx, sy] = at(x, y); octx.beginPath(); octx.arc(sx, sy, 1.6 * k, 0, Math.PI * 2); octx.fill(); }
    const [sx, sy] = at(g.x, g.y), rx = 11 * S * (1.6 - 0.6 * t) * pulse, ry = rx / 2;
    // off-screen destination: the trail ends in a chevron at the screen edge, pointing at it
    const m = 26 * k, top = 70 * k, bottom = vh - (partyH ? partyH() * k : 0) - 16 * k;
    if (sx < m || sx > vw - m || sy < top || sy > bottom) {
      const cx = vw / 2, cy = (top + bottom) / 2, dx = sx - cx, dy = sy - cy;
      const s2 = Math.min((vw / 2 - m) / Math.max(1e-6, Math.abs(dx)), ((bottom - top) / 2) / Math.max(1e-6, Math.abs(dy)));
      const ex = cx + dx * s2, ey = cy + dy * s2, a = Math.atan2(dy, dx), L = 11 * k;
      octx.save(); octx.translate(ex, ey); octx.rotate(a);
      octx.lineWidth = Math.max(2, 2.6 * k); octx.lineJoin = 'round';
      octx.strokeStyle = 'rgba(20,12,6,0.6)'; octx.beginPath(); octx.moveTo(-L, -L + k); octx.lineTo(k, k); octx.lineTo(-L, L + k); octx.stroke();
      octx.strokeStyle = `rgba(240,196,110,${0.6 + 0.3 * Math.sin(now / 200)})`; octx.beginPath(); octx.moveTo(-L, -L); octx.lineTo(0, 0); octx.lineTo(-L, L); octx.stroke();
      octx.restore();
      return;
    }
    octx.lineWidth = Math.max(1.5, 2 * k);
    octx.strokeStyle = `rgba(20,12,6,${0.55 * t})`; octx.beginPath(); octx.ellipse(sx, sy + k, rx, ry, 0, 0, Math.PI * 2); octx.stroke();
    octx.strokeStyle = `rgba(240,196,110,${0.9 * t})`; octx.beginPath(); octx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2); octx.stroke();
  }
  function drawMinimap(ix, iy) {
    const lvl = sim.world.level, rooms = lvl.rooms, discovered = sim.world.discovered;
    if (!rooms.length) return;
    const k = vw / window.innerWidth, MM = 96 * k, pad = 6 * k;
    const bx = vw - MM - pad - (MM_RIGHT + safeR) * k, by = mmTop() * k;     // top-right, under the HUD
    // panel
    octx.fillStyle = 'rgba(10,8,16,0.60)';
    octx.fillRect(bx - pad, by - pad, MM + 2 * pad, MM + 2 * pad);
    octx.strokeStyle = 'rgba(130,120,160,0.35)'; octx.lineWidth = Math.max(1, k);
    octx.strokeRect(bx - pad, by - pad, MM + 2 * pad, MM + 2 * pad);
    // fit all rooms into the square, centered, preserving aspect
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const r of rooms) { x0 = Math.min(x0, r.cx - r.rw); x1 = Math.max(x1, r.cx + r.rw); y0 = Math.min(y0, r.cy - r.rh); y1 = Math.max(y1, r.cy + r.rh); }
    const span = Math.max(x1 - x0, y1 - y0) || 1, s = MM / span;
    const mx = (tx) => bx + (tx - x0) * s + (MM - (x1 - x0) * s) / 2;
    const my = (ty) => by + (ty - y0) * s + (MM - (y1 - y0) * s) / 2;
    // corridors leading out of any discovered room
    octx.strokeStyle = 'rgba(150,140,180,0.45)'; octx.lineWidth = Math.max(1, 1.5 * k);
    for (const [a, b] of lvl.edges) {
      if (!discovered.has(a) && !discovered.has(b)) continue;
      octx.beginPath(); octx.moveTo(mx(rooms[a].cx), my(rooms[a].cy)); octx.lineTo(mx(rooms[b].cx), my(rooms[b].cy)); octx.stroke();
    }
    // discovered rooms, in the theme's floor tint
    const rc = ELIT[lvl.th.floors[0]][3] || [90, 80, 110];
    octx.fillStyle = `rgba(${rc[0]},${rc[1]},${rc[2]},0.9)`;
    for (const r of rooms) {
      if (!discovered.has(r.id)) continue;
      const w = Math.max(3 * k, r.rw * 2 * s), h = Math.max(3 * k, r.rh * 2 * s);
      octx.fillRect(mx(r.cx) - w / 2, my(r.cy) - h / 2, w, h);
    }
    // each discovered room's level (GDD §3.2: rooms show their threat before you commit)
    const levels = sim.world.roomLevels;
    if (levels) {
      octx.font = `700 ${Math.round(8 * k)}px ui-monospace, Menlo, monospace`; octx.textAlign = 'center'; octx.textBaseline = 'middle';
      for (const r of rooms) {
        const lv = levels.get(r.id); if (!lv || !discovered.has(r.id) || r === lvl.descentRoom) continue;
        octx.fillStyle = 'rgba(0,0,0,0.7)'; octx.fillText(String(lv), mx(r.cx) + k, my(r.cy) + k);
        octx.fillStyle = dangerColor(lv); octx.fillText(String(lv), mx(r.cx), my(r.cy));
      }
      octx.textBaseline = 'alphabetic';
    }
    // descent gate marker, once its room is known (a violet diamond → the way down)
    const dr = lvl.descentRoom;
    if (dr && discovered.has(dr.id)) {
      const r = Math.max(2.5, 3 * k); octx.fillStyle = '#b48cff';
      octx.beginPath(); octx.moveTo(mx(dr.cx), my(dr.cy) - r); octx.lineTo(mx(dr.cx) + r, my(dr.cy)); octx.lineTo(mx(dr.cx), my(dr.cy) + r); octx.lineTo(mx(dr.cx) - r, my(dr.cy)); octx.closePath(); octx.fill();
    }
    // hero marker
    octx.fillStyle = '#f0a500';
    octx.beginPath(); octx.arc(mx(ix), my(iy), Math.max(2, 2.6 * k), 0, Math.PI * 2); octx.fill();
    octx.strokeStyle = 'rgba(0,0,0,0.6)'; octx.lineWidth = Math.max(1, k); octx.stroke();
  }

  return {
    render, setHero, resize,
    /** hold the outdoor light at a look (a part's name or a fraction of the day, daylight.js holdT), or
     * null to follow the sim's clock; a change eases in. The title holds dusk; ?dev&tod= holds any. */
    holdSky(v) {
      const t = holdT(v); if (t === skyHoldT) return;
      mixSky(skyFrom, sky, sky, 0); skyEase0 = lastNow; skyHoldT = t;
    },
    /** true while a scene change is still baking behind black (main.js holds the sim still meanwhile) */
    get transiting() { return !!transit && !terrValid; },
    /** settles once the first actor and environment atlases have loaded (or failed): the loading screen's cue */
    ready: Promise.allSettled(firstLoads.filter(Boolean)),
    enemyAt(sxPx, syPx) {                                  // the enemy under (or nearest to) a tap, for focus
      const w = sim.world; if (!w.enemies || !w.enemies.length) return null;
      const dpr = vw / window.innerWidth, nx = (sxPx * dpr) / S, ny = (syPx * dpr) / S;
      let best = null, bd = 26;
      for (const e of w.enemies) { if (e.hp <= 0) continue; const z = heightAt(w, Math.floor(e.x), Math.floor(e.y)), P = project(e.x, e.y, z);
        const d = Math.hypot(lastCam.rx + P.sx - nx, lastCam.ry + P.sy - 24 - ny); if (d < bd) { bd = d; best = e; } }
      return best;
    },
    /** the named NPCs' content defs (content/npcs/*.json), by id: until they load, nobody stands there */
    setCast(c) { cast = c || {}; },
    npcAt(sxPx, syPx) {                                    // the named person under a tap (their body, a little generous for a thumb)
      const w = sim.world; if (!w.npcs || !w.npcs.length) return null;
      const dpr = vw / window.innerWidth, nx = (sxPx * dpr) / S, ny = (syPx * dpr) / S;
      let best = null, bd = 20;
      for (const n of w.npcs) { if (!cast[n.id]) continue; const z = heightAt(w, Math.floor(n.x), Math.floor(n.y)), P = project(n.x, n.y, z);
        const d = Math.hypot((lastCam.rx + P.sx - nx) * 1.4, lastCam.ry + P.sy - 24 - ny); if (d < bd) { bd = d; best = n; } }
      return best;
    },
    serviceAt(sxPx, syPx) {
      const w = sim.world; if (!w.services || !w.services.length || !envMeta) return null;
      const dpr = vw / window.innerWidth, nx = (sxPx * dpr) / S, ny = (syPx * dpr) / S, z = heightAt(w, 0, 0);
      let best = null;
      for (const sv of w.services) {
        const m = envMeta.sprites[sv.id]; if (!m) continue;
        const P = project(sv.x, sv.y, z), x0 = lastCam.rx + P.sx - m.ax, y0 = lastCam.ry + P.sy - m.ay;
        if (nx >= x0 && nx < x0 + m.w && ny >= y0 && ny < y0 + m.h * 0.85 && (!best || sv.x + sv.y > best.x + best.y)) best = sv;
      }
      return best;
    },
    /** the chest, shrine or stairs drawn under a tap (its whole sprite, not its floor tile), or null */
    /** the sound's listener: called each frame with the figures drawn (audio/listen.js) @param {any} fn */
    onFrame(fn) { heard = fn; },
    propAt(sxPx, syPx) { const dpr = vw / window.innerWidth; return propUnder((sxPx * dpr) / S - lastCam.rx, (syPx * dpr) / S - lastCam.ry); },
    /** dev: the Stage (src/dev/stage.js) — its lineup, camera and overlay; null to leave it */
    setStage(s) { stage = s; },
    /** dev: the Stage's zoom (integer): fewer tiles across the screen, the same native-pixel look */
    setZoom(z) { viewTiles = VIEW_TILES / Math.max(1, Math.round(z) || 1); resize(); },
    /** dev: the native view size (px) and whether every stage atlas has loaded (or failed) */
    get view() { return { w: nvw, h: nvh, S }; },
    /** dev: the lineup's bounds in CSS px (every figure's drawn box, and room under the feet for its name) */
    stageBounds(pad = 8) {
      if (!stage) return null; const dpr = vw / window.innerWidth, fx = lastCam.rx - lastCam.ox, fy = lastCam.ry - lastCam.oy;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const a of stage.actors) if (a.box) { x0 = Math.min(x0, a.box[0]); y0 = Math.min(y0, a.box[1]); x1 = Math.max(x1, a.box[2]); y1 = Math.max(y1, a.box[3]); }
      if (!isFinite(x0)) return null;
      const c = (v, f) => ((v + f) * S) / dpr, below = 36;   // (the name and a before / after tag)
      return { x: Math.max(0, c(x0, fx) - pad), y: Math.max(0, c(y0, fy) - pad), x1: Math.min(window.innerWidth, c(x1, fx) + pad), y1: Math.min(window.innerHeight, c(y1, fy) + below + pad) };
    },
    get stageReady() { return !!stage && stage.actors.every((a) => stageAtlases.get(`${a.root || ''}|${a.atlas}|${a.scale || 1}`) !== null && stageAtlases.has(`${a.root || ''}|${a.atlas}|${a.scale || 1}`)); },
    screenToTile(sxPx, syPx, alpha) {
      const p = sim.state.player;
      const ix = p.px + (p.x - p.px) * alpha, iy = p.py + (p.y - p.py) * alpha;
      const pz = heightAt(sim.world, Math.floor(p.x), Math.floor(p.y));
      const { rx: ox, ry: oy } = lastCam;
      const dpr = vw / window.innerWidth;
      return resolveTap((sxPx * dpr) / S - ox, (syPx * dpr) / S - oy, {
        heightAt: (tx, ty) => heightAt(sim.world, tx, ty),
        // snap to harvestables AND interactable props (chest / shrine / stairs)
        hasResource: (tx, ty) => !!resourceAt(sim.world, tx, ty) || INTERACT.has(propAt(sim.world, tx, ty)),
        heights: [7, 6, 5, 4, 3, 2, 1, 0],
      });
    },
  };

  // ---- small emissive-aware harvest sprites (bonegrowth / obsidian shard) ----
  function buildHarvest() {
    const mk = (w, h, ax, ay) => ({ w, h, mask: new Uint8Array(w * h), alb: new Uint8Array(w * h * 3), nrm: new Uint8Array(w * h * 3), emi: new Uint8Array(w * h), ax, ay });
    const set = (sp, x, y, c, n, e) => { if (x < 0 || y < 0 || x >= sp.w || y >= sp.h) return; const i = y * sp.w + x; sp.mask[i] = 1; sp.alb[i * 3] = c[0]; sp.alb[i * 3 + 1] = c[1]; sp.alb[i * 3 + 2] = c[2]; sp.nrm[i * 3] = (n[0] * 0.5 + 0.5) * 254; sp.nrm[i * 3 + 1] = (n[1] * 0.5 + 0.5) * 254; sp.nrm[i * 3 + 2] = n[2] * 254; sp.emi[i] = e || 0; };
    const out = {};
    // bonegrowth: three pale stalks
    const tree = mk(14, 18, 7, 17), br = ELIT.bone;
    for (let s = 0; s < 3; s++) { const bx = 4 + s * 3, top = 4 + ((s * 7) % 5); for (let y = top; y < 16; y++) { set(tree, bx, y, br[2], norm3(-0.4, 0, 0.9), 0); set(tree, bx + 1, y, br[3], norm3(0.4, 0, 0.9), 0); } set(tree, bx, top - 1, br[4], norm3(0, -0.3, 0.9), 0); }
    out.tree = tree;
    // obsidian shard with a violet glint
    const rock = mk(14, 18, 7, 17), ob = ELIT.obsid;
    for (let y = 8; y < 16; y++) for (let x = 4; x < 10; x++) if (Math.abs(x - 7) + Math.abs(y - 13) < 5) set(rock, x, y, ob[x < 7 ? 2 : 3], norm3((x - 7) * 0.3, -0.2, 0.9), 0);
    set(rock, 7, 6, ob[4], norm3(0, -0.4, 0.8), 2); set(rock, 7, 5, EGLOW.violet, norm3(0, -0.3, 0.9), 2);
    out.rock = rock;
    return out;
  }
}
