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
// Canvas2D path is parked in renderer-canvas.js.

import { materialAt, heightAt, resourceAt, propAt } from '../sim/world.js';
import { ELIT, EGLOW } from './palette.js';
import { drawDollDetailed, DETAIL_W, DETAIL_H } from '../assetforge/doll.js';
import { hash2, fbm, vnoise } from '../sim/rng.js';
import { TW, TH, HW, HH, ZH, ROWW, project, unproject, resolveTap } from './iso.js';
import { GLOW_ID, norm3, buildProps, spriteFromCanvasData, PROP_LIGHT } from './gsprite.js';
import { TILE_STYLES, N_UP, paintFloor, paintWall, variantFor, POOL_LIGHT } from './tilestyles.js';
import { paintOutdoor } from './outdoorpaint.js';

// hazard material → the point-light color it casts (lit dynamically as a flare)
const HAZARD_LIGHT = { lava: [1.7, 0.8, 0.25], ember: [1.7, 0.85, 0.3], poison: [0.5, 1.5, 0.35], chasm: [0.7, 0.55, 1.7] };
const INTERACT = new Set(['chest', 'shrine', 'stairs']);   // props a tap can target
// Actor atlases (tools/actor-lab/bake.cjs) store one row per screen octant:
// 0=E, 1=SE, 2=S (toward the camera), 3=SW, 4=W, 5=NW, 6=N, 7=NE. sdx/sdy are
// screen-space deltas.
function dir8(sdx, sdy) {
  return ((Math.round(Math.atan2(sdy, sdx) / (Math.PI / 4)) % 8) + 8) % 8;
}
const SKELETONS = ['skeleton_warrior', 'skeleton_minion', 'skeleton_rogue', 'skeleton_mage'];

const MARGIN = 64;                 // native-px slack before a re-bake
const VIEW_TILES = 25;             // tiles across the screen (was ~16, then 20; each step zooms out 20%)
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
uniform vec3 uSunL, uSunC, uAmbC;   // outdoor scenes: directional dusk sun + ambient colour (zero in dungeons)
out vec4 O;
float h21(vec2 p){p=fract(p*vec2(234.34,435.345));p+=dot(p,p+34.23);return fract(p.x*p.y);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  float a=h21(i),b=h21(i+vec2(1,0)),c=h21(i+vec2(0,1)),d=h21(i+vec2(1,1));
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec4 A=texture(uAlb,uv);
  vec4 N=texture(uNrm,uv);
  vec3 E=texture(uEmi,uv).rgb*3.2;
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
    col+=A.rgb*uLC[i]*ndl*att;
    col+=uLC[i]*att*0.05;
  }
  float ph=h21(floor(gl_FragCoord.xy))*6.28;
  col+=E*(0.55+0.45*sin(uTime*2.6+ph));
  float wd=length(gl_FragCoord.xy-uWispPx);
  col+=vec3(2.2,1.35,0.5)*exp(-wd*wd*0.05)*uWispA*1.15;
  col+=vec3(2.2,1.35,0.5)*exp(-wd*wd*0.006)*uWispA*0.35;
  float fog=n2(uv*vec2(7.0,3.5)+vec2(uTime*0.05,uTime*0.02));
  float fa=smoothstep(0.3,0.9,fog)*0.10*(1.0-uv.y*0.5);
  col=mix(col,vec3(0.10,0.07,0.16),fa);
  O=vec4(col,1.0);
}`;
const POST_FS = `#version 300 es
precision highp float;
uniform sampler2D uLit,uLitM,uAlbT,uNrmT,uEmiT;
uniform vec2 uOut,uNative; uniform float uScale,uBloom,uTime;
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
  col+=vec3(0.010,0.002,0.020)*(1.0-col);
  vec2 c=gl_FragCoord.xy/uOut-0.5;
  col*=1.0-dot(c,c)*0.85;
  col+=(h21(gl_FragCoord.xy+fract(uTime)*100.0)-0.5)*0.02;
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
  let bALB, bNRM, bEMI, sALB, sNRM, sEMI;            // baked (margin) + scratch (window)
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

  function resize() {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    vw = Math.floor(window.innerWidth * dpr);
    vh = Math.floor(window.innerHeight * dpr);
    canvas.width = vw; canvas.height = vh;
    canvas.style.width = window.innerWidth + 'px'; canvas.style.height = window.innerHeight + 'px';
    overlay.width = vw; overlay.height = vh;
    overlay.style.width = window.innerWidth + 'px'; overlay.style.height = window.innerHeight + 'px';
    S = Math.max(1.5, vw / (VIEW_TILES * TW));             // fractional; PASS B upscales sharp-bilinear
    nvw = Math.ceil(vw / S) + 2; nvh = Math.ceil(vh / S) + 2;
    tbw = nvw + 2 * MARGIN; tbh = nvh + 2 * MARGIN;
    bALB = new Uint8ClampedArray(tbw * tbh * 4); bNRM = new Uint8ClampedArray(tbw * tbh * 4); bEMI = new Uint8ClampedArray(tbw * tbh * 4);
    sALB = new Uint8Array(nvw * nvh * 4); sNRM = new Uint8Array(nvw * nvh * 4); sEMI = new Uint8Array(nvw * nvh * 4);
    bDEP = new Float32Array(tbw * tbh); sDEP = new Float32Array(nvw * nvh); bSH = new Uint8Array(tbw * tbh);
    for (const t of [texAlb, texNrm, texEmi]) { gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, nvw, nvh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); }
    setupLit();
    terrValid = false;
  }
  window.addEventListener('resize', resize); resize();

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
  let heroAtlas = null, heroDir = 2, outMap = null;
  const skelAtlases = [];
  const acv = document.createElement('canvas'), actx = acv.getContext('2d', { willReadFrequently: true });
  const loadImg = (url) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const pixels = (img) => { acv.width = img.width; acv.height = img.height; actx.clearRect(0, 0, img.width, img.height); actx.drawImage(img, 0, 0); return actx.getImageData(0, 0, img.width, img.height).data; };
  async function loadActorAtlas(name) {
    const base = './assets/actors/' + name, meta = await (await fetch(base + '.json')).json();
    const alb = pixels(await loadImg(base + '.alb.png')), iw = acv.width;
    const nrm = pixels(await loadImg(base + '.nrm.png')), emi = meta.glow ? pixels(await loadImg(base + '.emi.png')) : null;
    const { cw, ch, ax, ay } = meta, cells = [];
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
    return { meta, cells };
  }
  loadActorAtlas('hero_knight').then((a) => { heroAtlas = a; }).catch(() => {});

  // ── Environment atlas: KayKit Medieval Hexagon (CC0) buildings, trees, rocks and
  // mountains baked by tools/actor-lab/bake-env.cjs — albedo, normal (+ shadow in its
  // alpha), and a per-pixel depth key (+ lit-window flag). Sprites are sliced lazily,
  // only when a scene first uses them.
  // Two atlases are live at a time: the shared base ('env': trees, rocks, props) and the
  // current region's town buildings ('town-<region>': same shapes, the region's tones).
  let envMeta = null;                                  // { sprites: id → meta (+ .atlas) } merged across loaded atlases
  const envAtlases = new Map(), envCache = new Map();
  function loadAtlas(name) {
    if (envAtlases.has(name)) return;
    envAtlases.set(name, null);
    Promise.all([fetch(`./assets/env/${name}.json`).then((r) => r.json()), ...['alb', 'nrm', 'key'].map((c) => loadImg(`./assets/env/${name}.${c}.png`))])
      .then(([m, a, n, k]) => {
        envAtlases.set(name, { a, n, k });
        envMeta = envMeta || { sprites: {} };
        for (const [id, sm] of Object.entries(m.sprites)) envMeta.sprites[id] = { ...sm, atlas: name };
        terrValid = false; outMap = null;
      }).catch(() => envAtlases.delete(name));
  }
  const wantAtlases = () => { loadAtlas('env'); if (sim.world.kind !== 'dungeon') loadAtlas('town-' + (sim.world.region || 'vale')); };
  wantAtlases();
  const ecv = document.createElement('canvas'), ectx = ecv.getContext('2d', { willReadFrequently: true });
  function envSprite(id) {
    if (envCache.has(id)) return envCache.get(id);
    const m = envMeta && envMeta.sprites[id]; if (!m) return null;
    const envImgs = envAtlases.get(m.atlas); if (!envImgs) return null;
    const grab = (img) => { ecv.width = m.w; ecv.height = m.h; ectx.clearRect(0, 0, m.w, m.h); ectx.drawImage(img, m.x, m.y, m.w, m.h, 0, 0, m.w, m.h); return ectx.getImageData(0, 0, m.w, m.h).data; };
    const A = grab(envImgs.a), N = grab(envImgs.n), K = grab(envImgs.k), n = m.w * m.h;
    const sp = { w: m.w, h: m.h, ax: m.ax, ay: m.ay, mask: new Uint8Array(n), alb: new Uint8Array(n * 3), nrm: new Uint8Array(n * 3), dep: new Float32Array(n), emi: new Uint8Array(n) };
    for (let j = 0; j < n; j++) {
      const i = j * 4;
      if (A[i + 3] >= 128) {
        sp.mask[j] = 1;
        sp.alb[j * 3] = A[i]; sp.alb[j * 3 + 1] = A[i + 1]; sp.alb[j * 3 + 2] = A[i + 2];
        sp.nrm[j * 3] = N[i]; sp.nrm[j * 3 + 1] = N[i + 1]; sp.nrm[j * 3 + 2] = N[i + 2];
        sp.dep[j] = K[i] + K[i + 1] / 255 - 128;
        sp.emi[j] = K[i + 2] > 128 ? 9 : 0;
      } else if (N[i + 3] > 40) sp.mask[j] = 2;              // ground shadow only
    }
    envCache.set(id, sp);
    return sp;
  }

  // Composite the scene's structures into the bake: first every ground shadow (only
  // onto ground-level pixels, once), then every sprite with the nearer-wins depth test.
  function stampStructures(bx, by, lights) {
    const world = sim.world, z = heightAt(world, 0, 0), zp = z * ZH, list = [];
    if (!envMeta) return;
    for (const st of world.structs) {
      const sp = envSprite(st.id); if (!sp) continue;
      const P = project(st.x, st.y, z), x0 = Math.round(bx + P.sx) - sp.ax, y0 = Math.round(by + P.sy) - sp.ay;
      if (x0 > tbw || y0 > tbh || x0 + sp.w < 0 || y0 + sp.h < 0) continue;
      list.push({ sp, x0, y0, base: st.x + st.y + z * 0.5, walkOn: st.id.startsWith('bridge') });   // you walk ON a bridge: it never hides actors
      if (envMeta.sprites[st.id].glow && lights.length < 30) lights.push({ x: st.x, y: st.y, z: z + 3, color: [1.1, 0.72, 0.36] });
    }
    for (const { sp, x0, y0 } of list) for (let yy = 0; yy < sp.h; yy++) {
      const py = y0 + yy; if (py < 0 || py >= tbh) continue;
      const ground = (py - by + zp) / HH + z * 0.5 + 0.35;         // depth of a ground-level pixel on this row
      for (let xx = 0; xx < sp.w; xx++) {
        if (sp.mask[yy * sp.w + xx] !== 2) continue;
        const px = x0 + xx; if (px < 0 || px >= tbw) continue;
        const di = py * tbw + px; if (bSH[di] || bDEP[di] > ground) continue;
        bSH[di] = 1; const i = di * 4;
        bALB[i] *= 0.52; bALB[i + 1] *= 0.54; bALB[i + 2] *= 0.64;
      }
    }
    for (const { sp, x0, y0, base, walkOn } of list) for (let yy = 0; yy < sp.h; yy++) {
      const py = y0 + yy; if (py < 0 || py >= tbh) continue;
      for (let xx = 0; xx < sp.w; xx++) {
        const j = yy * sp.w + xx; if (sp.mask[j] !== 1) continue;
        const px = x0 + xx; if (px < 0 || px >= tbw) continue;
        const di = py * tbw + px, dep = base + sp.dep[j];
        if (dep < bDEP[di] - 0.05) continue;
        if (!walkOn) bDEP[di] = dep;
        const i = di * 4, hpx = Math.max(0, Math.min(63, (4 * (dep - z * 0.5) - (py - by + zp)) / 1.333));
        bALB[i] = sp.alb[j * 3]; bALB[i + 1] = sp.alb[j * 3 + 1]; bALB[i + 2] = sp.alb[j * 3 + 2]; bALB[i + 3] = 255;
        bNRM[i] = sp.nrm[j * 3]; bNRM[i + 1] = sp.nrm[j * 3 + 1]; bNRM[i + 2] = sp.nrm[j * 3 + 2]; bNRM[i + 3] = zp * 4 + hpx * 4 > 255 ? 255 : zp * 4 + hpx * 4;
        const e = sp.emi[j];
        if (e) { const g = GLOW_ID[e]; bEMI[i] = g[0] / 3; bEMI[i + 1] = g[1] / 3; bEMI[i + 2] = g[2] / 3; } else { bEMI[i] = 0; bEMI[i + 1] = 0; bEMI[i + 2] = 0; }
        bEMI[i + 3] = 255;
      }
    }
  }
  SKELETONS.forEach((n, i) => loadActorAtlas(n).then((a) => { skelAtlases[i] = a; }).catch(() => {}));
  // companions (hired party members) — atlases load on first use
  const partyAtlases = {};
  const partyAtlas = (name) => { if (!(name in partyAtlases)) { partyAtlases[name] = null; loadActorAtlas(name).then((a) => { partyAtlases[name] = a; }).catch(() => {}); } return partyAtlases[name]; };

  // Companions follow the hero along a breadcrumb trail of the hero's past positions
  // (one crumb per ~0.3 tiles walked); companion i stands SPACING crumbs back.
  const trail = [], SPACING = 8, fol = [];
  function trailPush(x, y) {
    const t = trail[0];
    if (!t || Math.hypot(t.x - x, t.y - y) > 0.3) { trail.unshift({ x, y }); if (trail.length > SPACING * 3 + 2) trail.pop(); }
  }
  function trailAt(k, x, y) { return trail[Math.min(k, trail.length - 1)] || { x, y }; }

  // Terrain painter: cobble by default; ?tiles=<style> picks another structured style
  // from tilestyles.js, and ?tiles=classic restores the original per-pixel-noise look.
  // ?tv=<variant> forces a material variant (plain/earth/rock/lava/poison/ice/water);
  // otherwise each biome uses its default.
  const qs = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
  const tileKey = qs.get('tiles') || 'cobble', tileVariant = qs.get('tv') || '';
  const tileStyle = tileKey === 'classic' ? null : (TILE_STYLES[tileKey] || TILE_STYLES.cobble);

  /* ── G-buffer writers ───────────────────────────────────────────────────── */
  // DEPTH (bDEP): distance toward the camera in tile units = ground x+y of the surface
  // point + 0.0833 per px of height (0.5 per level). Terrain paints in painter's order and
  // writes it; baked structures and actors composite against it ("nearer wins").
  const DPX = 0.0833;
  const putG = (px, py, alb, n, hpx, emiId, dep = -1e9) => {
    px |= 0; py |= 0; if (px < 0 || py < 0 || px >= tbw || py >= tbh) return;
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
  function stamp(ALB, NRM, EMI, W, H, sp, footX, footY, baseH, DEP, footKey = 0, test = false) {
    const x0 = (footX | 0) - sp.ax, y0 = (footY | 0) - sp.ay;
    for (let yy = 0; yy < sp.h; yy++) {
      const py = y0 + yy; if (py < 0 || py >= H) continue;
      const hpx = baseH + (sp.h - yy) * 0.55;
      const dep = footKey + DPX * (baseH + Math.max(0, sp.ay - yy));
      for (let xx = 0; xx < sp.w; xx++) {
        const j = yy * sp.w + xx; if (!sp.mask[j]) continue;
        const px = x0 + xx; if (px < 0 || px >= W) continue;
        const i = (py * W + px) * 4;
        if (DEP) {
          const di = py * W + px;
          if (test && dep < DEP[di] - 0.6) { ALB[i] = ALB[i] * 0.5 + 34; ALB[i + 1] = ALB[i + 1] * 0.5 + 26; ALB[i + 2] = ALB[i + 2] * 0.5 + 52; continue; }
          DEP[di] = dep;
        }
        ALB[i] = sp.alb[j * 3]; ALB[i + 1] = sp.alb[j * 3 + 1]; ALB[i + 2] = sp.alb[j * 3 + 2]; ALB[i + 3] = 255;
        NRM[i] = sp.nrm[j * 3]; NRM[i + 1] = sp.nrm[j * 3 + 1]; NRM[i + 2] = sp.nrm[j * 3 + 2]; NRM[i + 3] = Math.min(255, hpx * 4);
        const e = sp.emi[j];
        if (e) { const g = GLOW_ID[e]; EMI[i] = g[0] / 3; EMI[i + 1] = g[1] / 3; EMI[i + 2] = g[2] / 3; } else { EMI[i] = 0; EMI[i + 1] = 0; EMI[i + 2] = 0; }
        EMI[i + 3] = 255;
      }
    }
  }

  // Terrain tile → G-buffer: cliff faces (SW/SE drops) then the top diamond,
  // with material-gradient normals + sparse emissive specks (water / poison).
  function drawTileG(bx, by, x, y) {
    const world = sim.world;
    const m = materialAt(world, x, y);
    if (m === 'abyss') return;                                   // the void: draw nothing
    const z = heightAt(world, x, y);
    const sx = bx + (x - y) * HW, sy = by + (x + y) * HH - z * ZH;
    if (sx < -TW || sx > tbw + TW || sy < -80 || sy > tbh + 20) return;
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
    const V = variantFor(world.theme, tileVariant), pool = !isWall && m === th.hazard;
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
        const r = paintFloor(tileStyle, V, c, pool, isWall);
        let col = r.c;
        if ((nwHi && py < 3 && dx < w / 2) || (neHi && py < 3 && dx >= w / 2)) col = [col[0] * 0.72, col[1] * 0.72, col[2] * 0.72];
        putG(X, sy + py, col, r.n || N_UP, hPix, r.e || 0, x + y + (py + 0.5) / HH + z * 0.5);
      }
    }
  }
  function faceStyled(sx, sy, drop, side, hTop, x, y, wr, seed, accent, V) {
    const h = Math.min(drop * ZH, 30), nb = side === 0 ? norm3(-0.70, 0.45, 0.52) : norm3(0.70, 0.45, 0.52);
    for (let i = 0; i < 8; i++) {
      const X = side === 0 ? sx - 8 + i : sx + i, yTop = side === 0 ? sy + 4 + ((i >> 1) + 1) : sy + 8 - (i >> 1);
      const along = side === 0 ? x + (i + 0.5) / 8 : y + 1 - (i + 0.5) / 8;     // continuous along a wall run
      for (let k = 0; k < h; k++) {
        const r = paintWall(tileStyle, V, { along, k, h, hz: hTop - k, side, tx: x, ty: y, wr, seed, accent });
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
  function bakeGBuffer(ox, oy) {
    bakeOx = ox; bakeOy = oy;
    bALB.fill(0); bNRM.fill(0); bEMI.fill(0); bDEP.fill(-1e9); bSH.fill(0);
    const bx = MARGIN + ox, by = MARGIN + oy;
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (const cx of [-MARGIN, nvw + MARGIN]) for (const cy of [-MARGIN, nvh + MARGIN]) for (const zz of [0, 7]) {
      const w = unproject(cx - ox, cy - oy, zz);
      minX = Math.min(minX, w.x); maxX = Math.max(maxX, w.x); minY = Math.min(minY, w.y); maxY = Math.max(maxY, w.y);
    }
    minX = Math.floor(minX) - 1; minY = Math.floor(minY) - 1; maxX = Math.ceil(maxX) + 1; maxY = Math.ceil(maxY) + 1;
    const tiles = [];
    for (let ty = minY; ty <= maxY; ty++) for (let tx = minX; tx <= maxX; tx++) tiles.push([tx, ty]);
    tiles.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    const world = sim.world;
    const hazards = [], lights = [];
    for (const [tx, ty] of tiles) {
      drawTileG(bx, by, tx, ty);
      const z = heightAt(world, tx, ty);
      // static props / resources composite into the bake (depth order via the sort)
      const pk = propAt(world, tx, ty);
      if (pk) {
        const arr = props[pk] || props.spire, sp = arr.length === 1 ? arr[0] : arr[(hash2(tx, ty, 5) * arr.length) | 0];
        stamp(bALB, bNRM, bEMI, tbw, tbh, sp, bx + (tx - ty) * HW, by + (tx + ty) * HH - z * ZH + HH, z * ZH, bDEP, tx + ty + 1);
        if (PROP_LIGHT[pk]) lights.push({ x: tx, y: ty, z, color: PROP_LIGHT[pk] });   // braziers / gate / shrine glow
      }
      const rk = resourceAt(world, tx, ty);
      if (rk) stamp(bALB, bNRM, bEMI, tbw, tbh, harvest[rk], bx + (tx - ty) * HW, by + (tx + ty) * HH - z * ZH + HH, z * ZH, bDEP, tx + ty + 1);
      const mm = materialAt(world, tx, ty);   // glowing hazard pools (lava / flame / poison / soul / ice / water)
      const hl = tileStyle ? (mm === world.level.th.hazard ? POOL_LIGHT[variantFor(world.theme, tileVariant).pool] : null) : HAZARD_LIGHT[mm];
      if (hl) hazards.push({ x: tx, y: ty, z, color: hl, s: hash2(tx, ty, 1234) });
    }
    if (world.kind !== 'dungeon') stampStructures(bx, by, lights);
    // thin the hazard pools to a few representatives spread apart, then pool all
    // candidates; render picks the two nearest the hero each frame.
    hazards.sort((a, b) => b.s - a.s);
    for (const h of hazards) { if (lights.length > 40) break; if (lights.every((o) => o.color !== h.color || Math.hypot(o.x - h.x, o.y - h.y) > 7)) lights.push(h); }
    flares = lights;
    terrValid = true;
  }

  let flash = null;
  sim.bus.on('hit', ({ tx, ty }) => { flash = { tx, ty, until: performance.now() + 90 }; });
  // descending / restoring rebuilds the world — rebuild seed-keyed props + re-bake.
  const withExit = (p) => ({ ...p, exit: p.stairs });          // the dungeon's way back up reuses the stair sprite
  props = withExit(props);
  let banner = null;
  const sceneTitle = () => (sim.world.kind === 'dungeon' ? `The Old Barrows · depth ${sim.state.depth + 1}` : sim.world.name);
  sim.bus.on('levelChanged', () => { trail.length = 0; fol.length = 0; props = withExit(buildProps(sim.world.seed)); terrValid = false; flash = null; outMap = null; wantAtlases(); banner = { text: sceneTitle(), until: performance.now() + 2600 }; });
  banner = { text: sceneTitle(), until: performance.now() + 2600 };

  // Camera: follows the hero, but in a town square (world.hub) it eases onto the square's
  // fixed framing, so the square sits still like a home screen while the hero moves in it.
  let camT = 0;
  function camera(ix, iy, pz) {
    const hub = sim.world.hub;
    let cx = ix, cy = iy;
    if (hub) {
      const d = Math.hypot(ix - hub.x, iy - hub.y), want = d < hub.r - 6 ? 1 : d > hub.r ? 0 : (hub.r - d) / 6;
      camT += (want - camT) * 0.08;
      const t = camT * camT * (3 - 2 * camT);
      cx = ix + (hub.focus.x - ix) * t; cy = iy + (hub.focus.y - iy) * t;
    } else camT = 0;
    const C = project(cx, cy, pz), t = camT * camT * (3 - 2 * camT);
    const anchor = 0.47 + (0.56 - 0.47) * t;               // hero sits higher (party cards below); the square keeps its framing
    return { ox: Math.round(nvw / 2 - C.sx), oy: Math.round(nvh * anchor - C.sy) };
  }
  let lastCam = { ox: 0, oy: 0 };

  function render(alpha, now) {
    const p = sim.state.player;
    const ix = p.px + (p.x - p.px) * alpha, iy = p.py + (p.y - p.py) * alpha;
    const pz = heightAt(sim.world, Math.floor(p.x), Math.floor(p.y));
    const P = project(ix, iy, pz);
    const { ox, oy } = (lastCam = camera(ix, iy, pz));

    if (!terrValid || Math.abs(bakeOx - ox) > MARGIN - 8 || Math.abs(bakeOy - oy) > MARGIN - 8) bakeGBuffer(ox, oy);

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
    const draws = [];
    if (heroAtlas) {
      const vdx = p.x - p.px, vdy = p.y - p.py;
      if (p.moving && Math.hypot(vdx, vdy) > 1e-4) heroDir = dir8(vdx - vdy, vdx + vdy);
      const clip = p.moving ? heroAtlas.meta.clips.walk : heroAtlas.meta.clips.idle;
      const fr = clip.start + (Math.floor((now / 1000) * clip.fps) % clip.len);
      draws.push({ d: ix + iy + 0.01, sp: heroAtlas.cells[heroDir][fr], fx: ox + P.sx, fy: oy + P.sy, h: pz * ZH, k: ix + iy });
    } else {
      draws.push({ d: ix + iy + 0.01, sp: heroSprite(p.moving ? p.frame : 0, p.mirror), fx: ox + P.sx, fy: oy + P.sy, h: pz * ZH, k: ix + iy });
    }
    // companions: trail positions behind the hero, facing where they walk
    trailPush(ix, iy);
    sim.state.party.slice(1).forEach((m, i) => {
      const atl = partyAtlas(m.actor || ({ fighter: 'hero_barbarian', rogue: 'hero_rogue', mage: 'hero_mage' })[m.cls]); if (!atl) return;
      const q = trailAt((i + 1) * SPACING, ix, iy), f = fol[i] || (fol[i] = { x: q.x, y: q.y, dir: 2, moving: false });
      const dx = q.x - f.x, dy = q.y - f.y, mv = Math.hypot(dx, dy) > 0.002;
      if (mv) f.dir = dir8(dx - dy, dx + dy);
      f.x = q.x; f.y = q.y; f.moving = mv || (f.moving && p.moving);
      const cz = heightAt(sim.world, Math.floor(f.x), Math.floor(f.y)), cp = project(f.x, f.y, cz);
      const clip = f.moving ? atl.meta.clips.walk : atl.meta.clips.idle, fr = clip.start + (Math.floor((now / 1000) * clip.fps + i * 3) % clip.len);
      draws.push({ d: f.x + f.y, sp: atl.cells[f.dir][fr], fx: ox + cp.sx, fy: oy + cp.sy, h: cz * ZH, k: f.x + f.y });
    });
    for (const e of sim.world.enemies || []) {
      const skelAtlas = skelAtlases[(hash2(Math.floor(e.x), Math.floor(e.y), 77) * SKELETONS.length) | 0];
      if (!skelAtlas) continue;
      const ez = heightAt(sim.world, Math.floor(e.x), Math.floor(e.y));
      const ep = project(e.x, e.y, ez), ex = ox + ep.sx, ey = oy + ep.sy;
      if (ex < -40 || ex > nvw + 40 || ey < -40 || ey > nvh + 40) continue;      // offscreen
      const fdx = p.x - e.x, fdy = p.y - e.y;                                     // face the hero
      const ed = dir8(fdx - fdy, fdx + fdy);
      const clip = skelAtlas.meta.clips.idle;
      const fr = clip.start + (Math.floor((now / 1000) * clip.fps + e.x * 7) % clip.len);
      draws.push({ d: e.x + e.y, sp: skelAtlas.cells[ed][fr], fx: ex, fy: ey, h: ez * ZH, k: e.x + e.y });
    }
    if (globalThis.__noactors) draws.length = 0;   // dev: tools/actor-lab backdrop capture
    draws.sort((a, b) => a.d - b.d);
    for (const dr of draws) if (dr.sp) stamp(sALB, sNRM, sEMI, nvw, nvh, dr.sp, dr.fx, dr.fy, dr.h, sDEP, dr.k, true);

    // upload the window G-buffer
    gl.bindTexture(gl.TEXTURE_2D, texAlb); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, nvw, nvh, gl.RGBA, gl.UNSIGNED_BYTE, sALB);
    gl.bindTexture(gl.TEXTURE_2D, texNrm); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, nvw, nvh, gl.RGBA, gl.UNSIGNED_BYTE, sNRM);
    gl.bindTexture(gl.TEXTURE_2D, texEmi); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, nvw, nvh, gl.RGBA, gl.UNSIGNED_BYTE, sEMI);

    const t = now / 1000;
    // hero carry-light + corruption flares (all in native/scratch pixel space)
    const hx = ox + P.sx, hy = oy + P.sy - 16, hz = pz * ZH + 20;
    const L = [[hx, hy, hz], [0, 0, 0], [0, 0, 0]];
    const hl = sim.world.kind === 'dungeon' ? 1 : 0.42;             // at dusk outdoors the hero's ember-wisp is a glow, not a torch
    const LC = [[1.9 * WISP * hl, 1.15 * WISP * hl, 0.42 * WISP * hl], [0, 0, 0], [0, 0, 0]];
    // the two nearest hazard/prop lights to the hero cast this frame (shader has 3 slots)
    const near = flares.map((s) => ({ s, d: Math.hypot(s.x - ix, s.y - iy) })).sort((a, b) => a.d - b.d).slice(0, 2);
    near.forEach(({ s }, i) => {
      const sp = project(s.x + 0.5, s.y + 0.5, s.z);
      const fl = 0.6 + 0.4 * vnoise(t * (i === 0 ? 5.3 : 4.1), i === 0 ? 3.3 : 9.9, sim.world.seed);
      L[i + 1] = [ox + sp.sx, oy + sp.sy, s.z * ZH + 12];
      LC[i + 1] = [s.color[0] * fl, s.color[1] * fl, s.color[2] * fl];
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
    gl.uniform1f(U(lightP, 'uWispA'), sim.world.kind === 'dungeon' ? WISP : WISP * 0.6);
    gl.uniform3fv(U(lightP, 'uL'), L.flat());
    gl.uniform3fv(U(lightP, 'uLC'), LC.flat());
    // the wisp floats beside the 56 px figure's shoulder (not over its torso), bobbing gently
    const outdoor = sim.world.kind !== 'dungeon';
    gl.uniform3f(U(lightP, 'uSunL'), -0.72, 0.16, 0.67);                 // low sun from the upper left (matches the baked shadows)
    gl.uniform3fv(U(lightP, 'uSunC'), outdoor ? [0.78, 0.55, 0.40] : [0, 0, 0]);   // late, low, amber
    gl.uniform3fv(U(lightP, 'uAmbC'), outdoor ? [0.31, 0.29, 0.44] : [0, 0, 0]);   // violet dusk, like the dungeon's ambient
    gl.uniform2f(U(lightP, 'uWispPx'), hx + 17, oy + P.sy - 42 + Math.sin(t * 2.1) * 1.5);
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
    gl.uniform2f(U(postP, 'uOff'), 0, 0);
    gl.uniform1f(U(postP, 'uBloom'), BLOOM);
    gl.uniform1f(U(postP, 'uTime'), t);
    gl.uniform1i(U(postP, 'uView'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 2D overlay (above the GL canvas): minimap + floating joystick
    octx.clearRect(0, 0, vw, vh);
    if (sim.world.kind === 'dungeon') drawMinimap(ix, iy); else { if (camT < 0.5) drawOutdoorMinimap(ix, iy); drawLabels(ox, oy, ix, iy); }   // no minimap on the town's home screen
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
    const bx = vw - MM - pad - 10 * k, by = 58 * k, x0 = -12, y0 = -12, span = Math.max(w.W, w.H) + 24;
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
      if (L.service) continue;
      const mx = bx + (L.x - x0) / span * MM, my = by + (L.y - y0) / span * MM, r = Math.max(2.5, 3.2 * k);
      octx.fillStyle = /Barrows/.test(L.text) ? '#b48cff' : /Thornwick/.test(L.text) ? '#e0b060' : 'rgba(220,210,190,0.85)';
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
      const d = Math.hypot(L.x - ix, L.y - iy); if (d > 60) continue;
      const top = (envMeta && L.id && envMeta.sprites[L.id]) ? envMeta.sprites[L.id].top * 9.8 : 100;
      const P = project(L.x, L.y, z), sx = (ox + P.sx) * S, sy = (oy + P.sy - top - 10) * S;
      if (sx < 0 || sx > vw || sy < 0 || sy > vh) continue;
      const a = L.service && camT > 0.5 ? 1 : Math.max(0, Math.min(1, (60 - d) / 20));   // on the home screen every service reads
      if (L.service) {                                              // service plaques: tappable-looking signs
        const tw = octx.measureText(L.text).width + 14 * k, th = 17 * k;
        octx.fillStyle = `rgba(16,12,22,${0.78 * a})`; octx.strokeStyle = `rgba(214,170,98,${0.55 * a})`; octx.lineWidth = Math.max(1, k);
        octx.beginPath(); octx.roundRect(sx - tw / 2, sy - th + 4 * k, tw, th, 5 * k); octx.fill(); octx.stroke();
        octx.fillStyle = `rgba(240,200,128,${a})`; octx.fillText(L.text, sx, sy);
        continue;
      }
      octx.fillStyle = `rgba(8,5,14,${0.7 * a})`; octx.fillText(L.text, sx + k, sy + k);
      octx.fillStyle = `rgba(236,214,170,${0.92 * a})`; octx.fillText(L.text, sx, sy);
    }
  }
  function drawBanner(now) {
    if (!banner || now > banner.until) return;
    const k = vw / window.innerWidth, a = Math.min(1, (banner.until - now) / 600);
    octx.font = `600 ${Math.round(20 * k)}px Georgia, 'Times New Roman', serif`; octx.textAlign = 'center';
    octx.fillStyle = `rgba(8,5,14,${0.75 * a})`; octx.fillText(banner.text, vw / 2 + 1.5 * k, 150 * k + 1.5 * k);
    octx.fillStyle = `rgba(240,200,130,${a})`; octx.fillText(banner.text, vw / 2, 150 * k);
  }
  function drawMinimap(ix, iy) {
    const lvl = sim.world.level, rooms = lvl.rooms, discovered = sim.world.discovered;
    if (!rooms.length) return;
    const k = vw / window.innerWidth, MM = 96 * k, pad = 6 * k;
    const bx = vw - MM - pad - 10 * k, by = 58 * k;         // top-right, clear of the HUD
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
    serviceAt(sxPx, syPx) {
      const w = sim.world; if (!w.services || !w.services.length || !envMeta) return null;
      const dpr = vw / window.innerWidth, nx = (sxPx * dpr) / S, ny = (syPx * dpr) / S, z = heightAt(w, 0, 0);
      let best = null;
      for (const sv of w.services) {
        const m = envMeta.sprites[sv.id]; if (!m) continue;
        const P = project(sv.x, sv.y, z), x0 = lastCam.ox + P.sx - m.ax, y0 = lastCam.oy + P.sy - m.ay;
        if (nx >= x0 && nx < x0 + m.w && ny >= y0 && ny < y0 + m.h * 0.85 && (!best || sv.x + sv.y > best.x + best.y)) best = sv;
      }
      return best;
    },
    screenToTile(sxPx, syPx, alpha) {
      const p = sim.state.player;
      const ix = p.px + (p.x - p.px) * alpha, iy = p.py + (p.y - p.py) * alpha;
      const pz = heightAt(sim.world, Math.floor(p.x), Math.floor(p.y));
      const { ox, oy } = lastCam;
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
