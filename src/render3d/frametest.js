// @ts-check
// frametest.js — what each part of the world's picture costs on this device (the owner, 2026-11-12: "do 1 - town perf",
// after 22 fps in Thornwick's square on the phone). The cloud box draws with software GL, minutes a frame at a phone's
// density, so it can't say what a phone's GPU spends where; the phone can. From the menu's Graphics: the world as it is,
// then each piece of its picture turned off (or down) in turn for a few seconds, the frame time measured from the
// browser's own frames, and the world put back as it was after each. Presentation only: it reads and sets Luminati's
// renderer, never the sim (docs/performance-options.md, "How to measure").
//
// Each variant is applied, left to settle (a change of lights or shadows compiles shaders: that first frame is a hitch,
// not the cost), then its frames are timed; the world as it is is timed first and last, so a phone warming up shows.

/** @typedef {{ id: string, label: string, on: (w: any) => void, off: (w: any) => void }} Variant */
/** @typedef {{ id: string, label: string, ms: number, mean: number, at60: number, fps: number, frames: number, js: number, world: number, draw: number }} Row */

const SETTLE_MS = 1500, MEASURE_MS = 4000;

// the scene's objects by name (Luminati's: the terrain's layers, its ground cover, the trees round the map)
const each = (G, test, fn) => G.engine.scene.traverse((o) => { if (test(o)) fn(o); });
// every material compiled again (lights or shadows changed: the shaders count them)
const recompile = (G) => G.engine.scene.traverse((o) => { if (o.material) for (const m of [].concat(o.material)) m.needsUpdate = true; });
// people: the scene's top-level pieces with a skinned mesh in them (the figures, world.js placeFigure)
const isFigure = (o) => { if (!o.parent?.isScene) return false; let s = false; o.traverse((c) => { if (c.isSkinnedMesh) s = true; }); return s; };

// each piece by id, its own state kept on it (st), so pieces combine: a combination is its pieces on in order, off in reverse
/** @param {{ dof: string, res: string }} cur @returns {Record<string, { label: string, on: (w: any, st: any) => void, off: (w: any, st: any) => void }>} */
function pieces(cur) {
  const hideBy = (label, test) => ({ label, on: (w, st) => { st.hid = []; each(w.game, (o) => o.visible && test(o), (o) => { o.visible = false; st.hid.push(o); }); }, off: (w, st) => { for (const o of st.hid || []) o.visible = true; } });
  // lamp lights hidden past the first n (the shaders loop over every one: a change compiles them again)
  const lamps = (label, n) => ({ label, on: (w, st) => { /** @type {any[]} */ const L = []; each(w.game, (o) => o.isPointLight && o.visible, (o) => L.push(o)); st.L = L.slice(n); for (const o of st.L) o.visible = false; recompile(w.game); },
    off: (w, st) => { for (const o of st.L || []) o.visible = true; recompile(w.game); } });
  const shadowAt = (n) => ({ label: `Shadow map ${n} (from 2048)`, on: (w, st) => { const sh = w.game.lighting.sun.shadow; st.n = sh.mapSize.x; sh.mapSize.set(n, n); sh.map?.dispose(); sh.map = null; },
    off: (w, st) => { const sh = w.game.lighting.sun.shadow; sh.mapSize.set(st.n || 2048, st.n || 2048); sh.map?.dispose(); sh.map = null; } });
  return {
    base: { label: 'As it is', on: () => {}, off: () => {} },
    // the two that say whether the GPU is the limit at all: the world's every piece hidden (its passes still run, on
    // nothing), and Luminati not drawing (it still steps: the picture holds)
    empty: hideBy('Nothing drawn (all hidden)', (o) => o.parent?.isScene && !o.isCamera),
    nodraw: { label: 'Luminati not drawing', on: (w, st) => { st.wf = w.frame; w.frame = function (f) { return st.wf.call(this, { ...f, draw: false }); }; }, off: (w, st) => { if (st.wf) w.frame = st.wf; } },
    dof: { label: 'Depth of field off', on: (w) => w.settings({ dof: 'off' }), off: (w) => w.settings({ dof: cur.dof }) },
    bloom: { label: 'Bloom off', on: (w) => { w.game.postfx.settings.bloom.enabled = false; }, off: (w) => { w.game.postfx.settings.bloom.enabled = true; } },
    grade: { label: 'Sharpen, grain, colour fringe off', on: (w, st) => { const g = w.game.postfx.settings.grade; st.g = { sharpen: g.sharpen, grain: g.grain, chromaticAberration: g.chromaticAberration }; Object.assign(g, { sharpen: 0, grain: 0, chromaticAberration: 0 }); },
      off: (w, st) => { if (st.g) Object.assign(w.game.postfx.settings.grade, st.g); } },
    post: { label: 'All post passes off', on: (w) => { w.game.postfx.settings.enabled = false; }, off: (w) => { w.game.postfx.settings.enabled = true; } },
    msaa: { label: 'Antialiasing off', on: (w, st) => { const pf = w.game.postfx; st.n = pf.samples; pf.samples = 0; pf._w = 0; }, off: (w, st) => { const pf = w.game.postfx; pf.samples = st.n ?? pf.samples; pf._w = 0; } },
    shadow1k: shadowAt(1024),
    noshadow: { label: 'Shadows off', on: (w) => { w.game.engine.renderer.shadowMap.enabled = false; recompile(w.game); }, off: (w) => { w.game.engine.renderer.shadowMap.enabled = true; recompile(w.game); } },
    lights8: lamps('Lamp lights 8 (of 16)', 8),
    lights4: lamps('Lamp lights 4 (of 16)', 4),
    lights2: lamps('Lamp lights 2 (of 16)', 2),
    lights1: lamps('Lamp lights 1 (of 16)', 1),
    // the sun's shadow sharp-edged: one tap of the shadow map a pixel, not PCF's five (three.js BasicShadowMap 0)
    hardshadow: { label: 'Shadows hard-edged (1 tap, not 5)', on: (w, st) => { const R = w.game.engine.renderer; st.t = R.shadowMap.type; R.shadowMap.type = 0; R.shadowMap.needsUpdate = true; recompile(w.game); },
      off: (w, st) => { const R = w.game.engine.renderer; R.shadowMap.type = st.t ?? 1; R.shadowMap.needsUpdate = true; recompile(w.game); } },
    nolights: lamps('No lamp lights', 0),
    cover: hideBy('Grass and flowers off', (o) => o.name === 'GroundDetail'),
    edges: hideBy('Ground edges off (fringe, brim, skirt)', (o) => /^(fringe|brim|skirt):/.test(o.name)),
    tops: hideBy('Ground tops hidden (grass, cobbles…)', (o) => /^(top|side):/.test(o.name)),
    village: hideBy('Buildings hidden', (o) => /^village:/.test(o.name)),
    trees: hideBy('Trees round the map off', (o) => o.name === 'trees:outer'),
    outer: hideBy('Land round the map off', (o) => o.name === 'OuterGround'),
    // (by their materials: world.js shows a figure's root again every frame it's placed)
    people: { label: 'People hidden', on: (w, st) => { st.m = []; each(w.game, isFigure, (r) => r.traverse((o) => { if (o.isMesh) for (const m of [].concat(o.material)) if (m.visible) { m.visible = false; st.m.push(m); } })); },
      off: (w, st) => { for (const m of st.m || []) m.visible = true; } },
    balanced: { label: 'Resolution Balanced', on: (w) => w.settings({ res: 'balanced' }), off: (w) => w.settings({ res: cur.res }) },
    fast: { label: 'Resolution Fast', on: (w) => w.settings({ res: 'fast' }), off: (w) => w.settings({ res: cur.res }) },
  };
}

/** @param {{ dof: string, res: string }} cur the menu's Graphics as set now (put back after each)
 * @param {'focus' | 'all'} [set] focus: the question open now (the lamps and the shadow, 2026-11-12); all: every piece
 * @returns {Variant[]} */
export function variants(cur, set = 'focus') {
  const P = pieces(cur);
  const one = (id) => { const p = P[id], st = {}; return /** @type {Variant} */ ({ id, label: p.label, on: (w) => p.on(w, st), off: (w) => p.off(w, st) }); };
  // a combination: its pieces on in order, off in reverse (each keeps its own state)
  const all = (id, label, ids) => { const ps = ids.map((k) => ({ p: P[k], st: {} })); return /** @type {Variant} */ ({ id, label,
    on: (w) => { for (const q of ps) q.p.on(w, q.st); }, off: (w) => { for (const q of ps.slice().reverse()) { try { q.p.off(w, q.st); } catch { /* the rest still */ } } } }); };
  const trims = ['shadow1k', 'lights8', 'grade'], more = [...trims, 'bloom', 'edges', 'trees'];
  // the owner's third table (2026-11-12): no lamp lights saved 3.3 ms alone, 8 of 16 only 0.4; the trims that hardly
  // change the look, 2.7 together; those with shadows and lamps off held 57 fps, but the town lost its dusk. So: how
  // few lamps keep most of it, and whether a sharp-edged shadow is the shadow's cost
  const light = ['grade', 'bloom', 'edges', 'trees'];
  if (set !== 'all') return [
    one('base'), ...['nolights', 'lights8', 'lights4', 'lights2', 'lights1', 'hardshadow', 'noshadow'].map(one),
    all('l4', 'Together: 4 lamps, no grain/sharpen, bloom, edges, outer trees', ['lights4', ...light]),
    all('l2h', 'Together: 2 lamps, hard shadows, and those', ['lights2', 'hardshadow', ...light]),
    all('l1h', 'Together: 1 lamp, hard shadows, and those', ['lights1', 'hardshadow', ...light]),
    all('l4h', 'Together: 4 lamps, hard shadows, and those', ['lights4', 'hardshadow', ...light]),
    all('lean3', 'Together: no lamps, no shadows, and those', [...more, 'noshadow', 'nolights']),
    { id: 'base2', label: 'As it is (again)', on: () => {}, off: () => {} },
  ];
  return [
    one('base'), one('empty'), one('nodraw'),
    ...['dof', 'bloom', 'grade', 'post', 'msaa', 'shadow1k', 'noshadow', 'lights8', 'nolights', 'cover', 'edges', 'tops', 'village', 'trees', 'outer', 'people', 'balanced', 'fast'].map(one),
    // together (the owner's table, 2026-11-12: each piece alone saves 0-2 ms, nothing drawn 8: the cost is spread, so it's
    // what they save together that says what to change), from the ones that hardly change the look to the bare world
    all('lean1', 'Together: shadow 1024, 8 lamps, no grain/sharpen', trims),
    all('lean2', 'Together: those, bloom, ground edges, outer trees off', more),
    all('lean3', 'Together: those, shadows off, no lamps', [...more, 'noshadow', 'nolights']),
    all('bare', 'Together: every post pass, shadow, lamp, edge, tree off', ['post', 'noshadow', 'nolights', 'edges', 'trees', 'outer', 'cover']),
    { id: 'base2', label: 'As it is (again)', on: () => {}, off: () => {} },
  ];
}

/** the median frame time of the browser's own frames: after `settle` and three frames (a change of lights or shadows
 * compiles shaders, and that frame is the compile, not the cost), at least `ms` and twelve frames, at most 15 s more;
 * and over the same frames, the JavaScript's time a frame (the CPU's share: `cpu` counts it, see runFrameTest)
 * @param {{ js: number, world: number, draw: number }} [cpu]
 * @returns {Promise<{ ms: number, mean: number, at60: number, frames: number, js: number, world: number, draw: number }>} */
function timeFrames(settle, ms, cpu) {
  return new Promise((done) => {
    const f = /** @type {number[]} */ ([]); let last = 0, seen = 0, t1 = 0; const t0 = performance.now();
    const tick = (now) => {
      seen++;
      if (now - t0 > settle && seen > 3) { if (!t1) { t1 = now; if (cpu) cpu.js = cpu.world = cpu.draw = 0; } if (last) f.push(now - last); last = now; }
      const enough = t1 && now - t1 >= ms && f.length >= 12, late = now - t0 > settle + ms + 15000;
      if (!ms && now - t0 > settle) return done({ ms: 0, mean: 0, at60: 0, frames: 0, js: 0, world: 0, draw: 0 });
      if (!enough && !late) return void requestAnimationFrame(tick);
      const n = Math.max(1, f.length + 1); f.sort((a, b) => a - b);
      done({ ms: f.length ? f[Math.floor(f.length / 2)] : 0, mean: f.length ? f.reduce((x, y) => x + y, 0) / f.length : 0, at60: f.length ? f.filter((x) => x < 18).length / f.length : 0, frames: f.length, js: cpu ? cpu.js / n : 0, world: cpu ? cpu.world / n : 0, draw: cpu ? cpu.draw / n : 0 });
    };
    requestAnimationFrame(tick);
  });
}

/**
 * Run the test on the world in view. @param {any} world the world module's api (hybrid.js world3d.world)
 * @param {{ dof: string, res: string }} cur @param {(i: number, n: number, label: string) => void} onStep @param {'focus' | 'all'} [set]
 * @returns {Promise<{ rows: Row[], about: string }>}
 */
export async function runFrameTest(world, cur, onStep, set = 'focus') {
  const V = variants(cur, set), rows = /** @type {Row[]} */ ([]);
  // the CPU's share: every animation-frame callback's time (the game's loop: the sim, the overlay, the UI; and Luminati's
  // frame within it), Luminati's frame (world.frame: its update, then three.js's draw calls) and the draw calls alone
  // (postfx.render); put back after
  const cpu = { js: 0, world: 0, draw: 0 }, pf = world.game.postfx, raf = globalThis.requestAnimationFrame, wf = world.frame, pr = pf.render;
  const timed = (fn, k) => function (...a) { const t = performance.now(); try { return fn.apply(this, a); } finally { cpu[k] += performance.now() - t; } };
  globalThis.requestAnimationFrame = (cb) => raf((t) => { const a = performance.now(); try { cb(t); } finally { cpu.js += performance.now() - a; } });
  world.frame = timed(wf, 'world'); pf.render = timed(pr, 'draw');
  try {
    for (let i = 0; i < V.length; i++) {
      const v = V[i]; onStep(i, V.length, v.label);
      /** @type {{ ms: number, mean: number, at60: number, frames: number, js: number, world: number, draw: number }} */ let r;
      try { v.on(world); r = await timeFrames(SETTLE_MS, MEASURE_MS, cpu); } finally { try { v.off(world); } catch { /* put back as far as it goes */ } }
      rows.push({ id: v.id, label: v.label, ms: r.ms, mean: r.mean, at60: r.at60, fps: r.mean ? 1000 / r.mean : 0, frames: r.frames, js: r.js, world: r.world, draw: r.draw });
      await timeFrames(400, 0);                      // (a moment as it was before the next)
    }
  } finally { globalThis.requestAnimationFrame = raf; world.frame = wf; pf.render = pr; }
  const G = world.game, R = G.engine.renderer, gl = R.getContext(), dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  let lights = 0; each(G, (o) => o.isPointLight && o.visible, () => { lights++; });
  const about = `${R.domElement.width}×${R.domElement.height} drawn · screen ${(globalThis.devicePixelRatio || 1).toFixed(2)}× · ${gpu} · ${lights} lamp lights · `
    + `antialiasing ${G.postfx?.samples ?? '?'}× · shadow ${G.lighting?.sun?.shadow?.mapSize?.x ?? '?'} · DOF ${cur.dof} · resolution ${cur.res}`;
  return { rows, about };
}

/** the table as plain text (to paste into a message) @param {{ rows: Row[], about: string }} r @param {string} where */
export function frameTestText(r, where) {
  const base = (r.rows[0].mean + r.rows[r.rows.length - 1].mean) / 2;
  const lines = r.rows.map((x) => `${x.label.padEnd(50)} ${x.frames ? x.mean.toFixed(1).padStart(5) : '    —'} ms ${x.fps.toFixed(0).padStart(3)} fps · median ${x.ms.toFixed(0).padStart(2)} · ${Math.round(x.at60 * 100).toString().padStart(3)} % at 60`
    + ` · JS ${x.js.toFixed(1).padStart(4)} (Luminati ${x.world.toFixed(1).padStart(4)}, draw calls ${x.draw.toFixed(1).padStart(4)}) ${x.id.startsWith('base') ? '' : `${(base - x.mean) >= 0 ? '−' : '+'}${Math.abs(base - x.mean).toFixed(1)} ms`}`);
  return `Frame test · ${where}\n${r.about}\nmean frame ms · fps · median · share of frames at 60 fps · JS ms a frame (Luminati's update and draw calls within it; the draw calls alone)\n${lines.join('\n')}`;
}
