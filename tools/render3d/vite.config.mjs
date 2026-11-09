// vite.config.mjs — Luminati as a module the game imports (docs/luminati-port-plan.md §13 step 1; run by
// tools/render3d/build.mjs, never by hand). A library build of tools/render3d/world.js (staged into Luminati's checkout
// as ember3d/): Luminati's engine and world layers and three.js, as ES modules, into src/vendor/luminati-80e1aa6/. The
// game has no build: this folder is committed.
//
// What the build changes in Luminati, here only, never in their files (each a tag: the build stops if their code moved):
//   · the ground cover at a quarter of its size, and no floating luminous dots (ground.js);
//   · Game.js: its UI under a root the game gives it (hidden), its input on a target nothing sends to, its sound never
//     unlocked: in the game's own page its keys, taps and sound are the game's; its pixel ratio the game's (world.js
//     PIXEL_RATIO: the phone's own, to 3×, where it held 1.25×);
//   · the Japanese and Chinese font slices left out (the game is in English).
import { defineConfig } from 'vite';
import { resolve, sep } from 'node:path';

const LUM = process.env.LUMINATI, OUT = process.env.EMBER_OUT;
if (!LUM || !OUT) throw new Error('tools/render3d/vite.config.mjs is run by tools/render3d/build.mjs');
const SRC = resolve(LUM, 'src'), EMBER = resolve(LUM, 'ember3d');
const TAGS = [
  ['game/GroundDetail.js', 'new Foliage({ sprite, instances: list, name: n,', 'new Foliage({ sprite, instances: globalThis.__emberGround ? globalThis.__emberGround.foliage(list) : list, name: n,'],
  ['game/World.js', 'if (env.dust !== false) {', 'if (env.dust !== false && globalThis.__emberGround?.dust !== false) {'],
  ['game/World.js', "for (const obj of this.objectsOf('emitter')) {", "for (const obj of this.objectsOf('emitter')) { if (globalThis.__emberGround && !globalThis.__emberGround.keeps(obj)) continue;"],
  ['game/Game.js', 'this.ui = new UI(document.body, this.uiOptions);', 'this.ui = new UI(globalThis.__emberUiRoot ?? document.body, this.uiOptions);'],
  ['game/Game.js', 'const engine = new Engine({ container: this.container, maxPixelRatio: 1.25 });', 'const engine = new Engine({ container: this.container, maxPixelRatio: globalThis.__emberPixelRatio ?? 1.25, ...(globalThis.__emberInputTarget ? { inputTarget: globalThis.__emberInputTarget } : {}) });'],
  ['game/Game.js', '  _armAudioUnlock() {\n', '  _armAudioUnlock() {\n    if (globalThis.__emberSilent) return;\n'],
];
const CJK = /^@fontsource\/(?:noto-sans-jp|noto-sans-sc|dotgothic16)\//;

/** @returns {import('vite').Plugin} */
function emberfall() {
  return {
    name: 'emberfall-world',
    enforce: 'pre',
    resolveId(source) { return CJK.test(source) ? '\0ember-no-cjk' : null; },
    load(id) { return id === '\0ember-no-cjk' ? 'export default null;' : null; },
    transform(code, id) {
      const file = id.split('?')[0], rel = file.startsWith(SRC + sep) ? file.slice(SRC.length + 1).split(sep).join('/') : null;
      const mine = rel && TAGS.filter((t) => t[0] === rel);
      if (!mine || !mine.length) return null;
      let out = code;
      for (const [, from, to] of mine) { if (!out.includes(from)) throw new Error(`emberfall-world: ${rel} no longer has "${from.trim()}"`); out = out.split(from).join(to); }
      return { code: out, map: null };
    },
  };
}

export default defineConfig({
  root: EMBER,
  base: './',
  publicDir: false,
  plugins: [emberfall()],
  logLevel: 'warn',
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    target: 'es2022', outDir: OUT, emptyOutDir: true, chunkSizeWarningLimit: 4000, copyPublicDir: false,
    lib: { entry: resolve(EMBER, 'world.js'), formats: ['es'], fileName: () => 'luminati.js' },
    rollupOptions: { output: { chunkFileNames: '[name]-[hash].js', assetFileNames: '[name]-[hash][extname]' } },
  },
});
