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
/** @typedef {{ id: string, label: string, ms: number, fps: number, frames: number }} Row */

const SETTLE_MS = 1500, MEASURE_MS = 4000;

// the scene's objects by name (Luminati's: the terrain's layers, its ground cover, the trees round the map)
const each = (G, test, fn) => G.engine.scene.traverse((o) => { if (test(o)) fn(o); });
// a toggle that hides objects and shows them again
const hide = (id, label, test) => {
  /** @type {any[]} */ let hid = [];
  return /** @type {Variant} */ ({ id, label,
    on: (w) => { hid = []; each(w.game, (o) => o.visible && test(o), (o) => { o.visible = false; hid.push(o); }); },
    off: () => { for (const o of hid) o.visible = true; hid = []; } });
};
// every material compiled again (lights or shadows changed: the shaders count them)
const recompile = (G) => G.engine.scene.traverse((o) => { if (o.material) for (const m of [].concat(o.material)) m.needsUpdate = true; });
// people: the scene's top-level pieces with a skinned mesh in them (the figures, world.js placeFigure)
const isFigure = (o) => { if (!o.parent?.isScene) return false; let s = false; o.traverse((c) => { if (c.isSkinnedMesh) s = true; }); return s; };

/** @param {{ dof: string, res: string }} cur the menu's Graphics as set now (put back after each) @returns {Variant[]} */
export function variants(cur) {
  /** @type {any} */ let keep = null;
  // lamp lights hidden past the first n (the shaders loop over every one: a change compiles them again)
  const lamps = (id, label, n) => /** @type {Variant} */ ({ id, label,
    on: (w) => { /** @type {any[]} */ const L = []; each(w.game, (o) => o.isPointLight && o.visible, (o) => L.push(o)); keep = L.slice(n); for (const o of keep) o.visible = false; recompile(w.game); },
    off: (w) => { for (const o of keep || []) o.visible = true; keep = null; recompile(w.game); } });
  return [
    { id: 'base', label: 'As it is', on: () => {}, off: () => {} },
    { id: 'dof', label: 'Depth of field off', on: (w) => w.settings({ dof: 'off' }), off: (w) => w.settings({ dof: cur.dof }) },
    { id: 'bloom', label: 'Bloom off', on: (w) => { w.game.postfx.settings.bloom.enabled = false; }, off: (w) => { w.game.postfx.settings.bloom.enabled = true; } },
    { id: 'grade', label: 'Sharpen, grain, colour fringe off', on: (w) => { const g = w.game.postfx.settings.grade; keep = { sharpen: g.sharpen, grain: g.grain, chromaticAberration: g.chromaticAberration }; Object.assign(g, { sharpen: 0, grain: 0, chromaticAberration: 0 }); },
      off: (w) => { if (keep) Object.assign(w.game.postfx.settings.grade, keep); keep = null; } },
    { id: 'post', label: 'All post passes off', on: (w) => { w.game.postfx.settings.enabled = false; }, off: (w) => { w.game.postfx.settings.enabled = true; } },
    { id: 'msaa', label: 'Antialiasing off', on: (w) => { const pf = w.game.postfx; keep = pf.samples; pf.samples = 0; pf._w = 0; }, off: (w) => { const pf = w.game.postfx; pf.samples = keep ?? pf.samples; pf._w = 0; keep = null; } },
    { id: 'shadow1k', label: 'Shadow map 1024 (from 2048)', on: (w) => { const sh = w.game.lighting.sun.shadow; keep = sh.mapSize.x; sh.mapSize.set(1024, 1024); sh.map?.dispose(); sh.map = null; },
      off: (w) => { const sh = w.game.lighting.sun.shadow; sh.mapSize.set(keep || 2048, keep || 2048); sh.map?.dispose(); sh.map = null; keep = null; } },
    { id: 'noshadow', label: 'Shadows off', on: (w) => { w.game.engine.renderer.shadowMap.enabled = false; recompile(w.game); }, off: (w) => { w.game.engine.renderer.shadowMap.enabled = true; recompile(w.game); } },
    lamps('lights8', 'Lamp lights 8 (of 16)', 8),
    lamps('nolights', 'No lamp lights', 0),
    hide('cover', 'Grass and flowers off', (o) => o.name === 'GroundDetail'),
    hide('edges', 'Ground edges off (fringe, brim, skirt)', (o) => /^(fringe|brim|skirt):/.test(o.name)),
    hide('trees', 'Trees round the map off', (o) => o.name === 'trees:outer'),
    hide('outer', 'Land round the map off', (o) => o.name === 'OuterGround'),
    hide('people', 'People hidden', isFigure),
    { id: 'balanced', label: 'Resolution Balanced', on: (w) => w.settings({ res: 'balanced' }), off: (w) => w.settings({ res: cur.res }) },
    { id: 'fast', label: 'Resolution Fast', on: (w) => w.settings({ res: 'fast' }), off: (w) => w.settings({ res: cur.res }) },
    { id: 'base2', label: 'As it is (again)', on: () => {}, off: () => {} },
  ];
}

/** the median frame time of the browser's own frames: after `settle` and three frames (a change of lights or shadows
 * compiles shaders, and that frame is the compile, not the cost), at least `ms` and twelve frames, at most 15 s more
 * @returns {Promise<{ ms: number, frames: number }>} */
function timeFrames(settle, ms) {
  return new Promise((done) => {
    const f = /** @type {number[]} */ ([]); let last = 0, seen = 0, t1 = 0; const t0 = performance.now();
    const tick = (now) => {
      seen++;
      if (now - t0 > settle && seen > 3) { if (!t1) t1 = now; if (last) f.push(now - last); last = now; }
      const enough = t1 && now - t1 >= ms && f.length >= 12, late = now - t0 > settle + ms + 15000;
      if (!ms && now - t0 > settle) return done({ ms: 0, frames: 0 });
      if (!enough && !late) return void requestAnimationFrame(tick);
      f.sort((a, b) => a - b); done({ ms: f.length ? f[Math.floor(f.length / 2)] : 0, frames: f.length });
    };
    requestAnimationFrame(tick);
  });
}

/**
 * Run the test on the world in view. @param {any} world the world module's api (hybrid.js world3d.world)
 * @param {{ dof: string, res: string }} cur @param {(i: number, n: number, label: string) => void} onStep
 * @returns {Promise<{ rows: Row[], about: string }>}
 */
export async function runFrameTest(world, cur, onStep) {
  const V = variants(cur), rows = /** @type {Row[]} */ ([]);
  for (let i = 0; i < V.length; i++) {
    const v = V[i]; onStep(i, V.length, v.label);
    /** @type {{ ms: number, frames: number }} */ let r;
    try { v.on(world); r = await timeFrames(SETTLE_MS, MEASURE_MS); } finally { try { v.off(world); } catch { /* put back as far as it goes */ } }
    rows.push({ id: v.id, label: v.label, ms: r.ms, fps: r.ms ? 1000 / r.ms : 0, frames: r.frames });
    await timeFrames(400, 0);                      // (a moment as it was before the next)
  }
  const G = world.game, R = G.engine.renderer, gl = R.getContext(), dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  let lights = 0; each(G, (o) => o.isPointLight && o.visible, () => { lights++; });
  const about = `${R.domElement.width}×${R.domElement.height} drawn · screen ${(globalThis.devicePixelRatio || 1).toFixed(2)}× · ${gpu} · ${lights} lamp lights · `
    + `antialiasing ${G.postfx?.samples ?? '?'}× · shadow ${G.lighting?.sun?.shadow?.mapSize?.x ?? '?'} · DOF ${cur.dof} · resolution ${cur.res}`;
  return { rows, about };
}

/** the table as plain text (to paste into a message) @param {{ rows: Row[], about: string }} r @param {string} where */
export function frameTestText(r, where) {
  const base = (r.rows[0].ms + r.rows[r.rows.length - 1].ms) / 2;
  const lines = r.rows.map((x) => `${x.label.padEnd(40)} ${x.frames ? x.ms.toFixed(1).padStart(6) : '     —'} ms ${x.fps.toFixed(0).padStart(4)} fps ${String(x.frames).padStart(4)} frames ${x.id.startsWith('base') ? '' : `${(base - x.ms) >= 0 ? '−' : '+'}${Math.abs(base - x.ms).toFixed(1)} ms`}`);
  return `Frame test · ${where}\n${r.about}\n${lines.join('\n')}`;
}
