// vite.config.mjs — the Luminati prototype's build (docs/lumina-prototype.md; run by tools/lumina/build.mjs, never by hand).
// Luminati (https://gitlab.com/stubborn-hug/lumina, MIT) is checked out at a pinned commit in tools/lumina/.work/luminati;
// our files are staged in its ember/ folder (the build's root), and the result is written to the repo's lumina/, a
// static folder the site serves as it is (the game itself has no build).
//
// What the build changes in Luminati, all here, none of it in their files:
//   · every import of engine/pixel/CharacterSprites.js goes to ember/sheets.js (Emberfall's actor atlases), and every
//     import of engine/pixel/FestivalPoses.js to ember/festival.js — except the original FestivalPoses' and our own
//     wrappers', which keep Luminati's painter (the monsters' come too: their humanoids are our goblins);
//   · three call sites are tagged so a sheet knows whose it is: the player (Player.js), a party member (party/
//     PartyMember.js) and a villager (Npc.js, with the villager's id);
//   · the game's camera framing takes ember/view.js's (Game.js, DebugControls.js): Emberfall's 45° yaw, 30° pitch and
//     near-orthographic lens, unless ?view=luminati;
//   · the ground cover takes ember/ground.js's size, and the floating luminous dots are left out (GroundDetail.js,
//     World.js);
//   · the Japanese and Chinese font slices (fallbacks behind Google Fonts, for pages in those languages) are left out:
//     the prototype is in English, and they were 15 MB of the build.
import { defineConfig } from 'vite';
import { resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const LUM = process.env.LUMINATI, OUT = process.env.EMBER_OUT;
if (!LUM || !OUT) throw new Error('tools/lumina/vite.config.mjs is run by tools/lumina/build.mjs');
const theirs = (await import(pathToFileURL(resolve(LUM, 'vite.config.js')).href)).default;
const SRC = resolve(LUM, 'src'), EMBER = resolve(LUM, 'ember');
const CS = resolve(SRC, 'engine/pixel/CharacterSprites.js'), FP = resolve(SRC, 'engine/pixel/FestivalPoses.js');
const WRAP_CS = resolve(EMBER, 'sheets.js'), WRAP_FP = resolve(EMBER, 'festival.js');
const KEEP = new Set([WRAP_CS, WRAP_FP, FP]);

// the call sites tagged: [file, what's there, what it becomes] — the build stops if Luminati's code has moved
const TAGS = [
  ['game/Player.js', 'createCharacterSheet(playerSpec(look, combat, kit), { combat: true })', "createCharacterSheet({ __ember: 'player', ...playerSpec(look, combat, kit) }, { combat: true })"],
  ['game/Player.js', 'createFestivalSheet(playerSpec(look, false))', "createFestivalSheet({ __ember: 'player', ...playerSpec(look, false) })"],
  ['game/Player.js', ': createCharacterSheet(playerSpec(look, false))', ": createCharacterSheet({ __ember: 'player', ...playerSpec(look, false) })"],
  ['game/party/PartyMember.js', 'createCharacterSheet(memberSpec(record, true), { combat: true }) : createCharacterSheet(memberSpec(record, false))',
    "createCharacterSheet({ __ember: 'party', ...memberSpec(record, true) }, { combat: true }) : createCharacterSheet({ __ember: 'party', ...memberSpec(record, false) })"],
  ['game/party/PartyMember.js', 'createFestivalSheet(memberSpec(this.record, false))', "createFestivalSheet({ __ember: 'party', ...memberSpec(this.record, false) })"],
  ['game/Npc.js', 'const spec = { ...CHARACTER_PRESETS[def.preset], preset: def.preset, ...(def.spec || {}) };',
    "const spec = { ...CHARACTER_PRESETS[def.preset], preset: def.preset, ...(def.spec || {}), __ember: 'npc', __id: def.id };"],
  // the camera (ember/view.js): Emberfall's yaw, pitch and lens over the level's framing, and the yaw the game resets to
  ['game/Game.js', 'this.camera = Object.freeze({ ...CAMERA, ...cameraFraming(cam) });',
    'this.camera = Object.freeze(((f) => ({ ...f, ...(globalThis.__emberView?.camera(f) ?? {}) }))({ ...CAMERA, ...cameraFraming(cam) }));'],
  ['game/Game.js', 'this.rig = new CameraRig(camera, { ...this.camera, yaw: 0, lookAhead: 1.3 });', 'this.rig = new CameraRig(camera, { ...this.camera, yaw: this.camera.yaw ?? 0, lookAhead: 1.3 });'],
  ['game/Game.js', 'rig.setAngles(0, this.camera.pitch);', 'rig.setAngles(this.camera.yaw ?? 0, this.camera.pitch);'],
  ['game/DebugControls.js', 'rig.setAngles(0, C.pitch);', 'rig.setAngles(C.yaw ?? 0, C.pitch);'],
  // and its lens: the depth of field over the deeper view (view.js post)
  ['game/Game.js', "bokehBoost: 1.6 });", "bokehBoost: 1.6 }); globalThis.__emberView?.post(S);"],
  // the ground (ember/ground.js): the ground cover at a quarter of its size, no floating luminous dots
  ['game/GroundDetail.js', 'new Foliage({ sprite, instances: list, name: n,', 'new Foliage({ sprite, instances: globalThis.__emberGround ? globalThis.__emberGround.foliage(list) : list, name: n,'],
  ['game/World.js', 'if (env.dust !== false) {', 'if (env.dust !== false && globalThis.__emberGround?.dust !== false) {'],
  ['game/World.js', "for (const obj of this.objectsOf('emitter')) {", "for (const obj of this.objectsOf('emitter')) { if (globalThis.__emberGround && !globalThis.__emberGround.keeps(obj)) continue;"],
];
const CJK = /^@fontsource\/(?:noto-sans-jp|noto-sans-sc|dotgothic16)\//;

/** @returns {import('vite').Plugin} */
function emberfall() {
  return {
    name: 'emberfall-people',
    enforce: 'pre',
    async resolveId(source, importer, opts) {
      if (CJK.test(source)) return '\0ember-no-cjk';
      if (!importer) return null;
      const r = await this.resolve(source, importer, { ...opts, skipSelf: true });
      if (!r || r.external) return null;
      const id = r.id.split('?')[0], from = importer.split('?')[0];
      if (id === CS && !KEEP.has(from)) return WRAP_CS;
      if (id === FP && from !== WRAP_FP) return WRAP_FP;
      return null;
    },
    load(id) { return id === '\0ember-no-cjk' ? 'export default null;' : null; },
    transform(code, id) {
      const file = id.split('?')[0], rel = file.startsWith(SRC + sep) ? file.slice(SRC.length + 1).split(sep).join('/') : null;
      const mine = rel && TAGS.filter((t) => t[0] === rel);
      if (!mine || !mine.length) return null;
      let out = code;
      for (const [, from, to] of mine) { if (!out.includes(from)) throw new Error(`emberfall-people: ${rel} no longer has "${from}"`); out = out.split(from).join(to); }
      return { code: out, map: null };
    },
  };
}

export default defineConfig({
  root: EMBER,
  base: './',
  publicDir: resolve(EMBER, 'public'),
  plugins: [...theirs.plugins.filter((p) => p && ['base-with-slash', 'fontsource-woff2-only'].includes(p.name)), emberfall()],
  logLevel: 'warn',
  build: {
    target: 'es2022', outDir: OUT, emptyOutDir: true, chunkSizeWarningLimit: 4000,
    rollupOptions: { input: { index: resolve(EMBER, 'index.html'), game: resolve(EMBER, 'game.html') }, treeshake: theirs.build.rollupOptions.treeshake },
  },
});
