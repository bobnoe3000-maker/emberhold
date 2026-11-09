// spike.mjs — shoot tools/kit/spike-room.html (docs/dungeon-kit-proposal.md §4): the dungeon kit spike room on the
// game's camera, bare and dressed, at the game's pitch and at 45°, and the room whole → tools/capture/out/kit/
//   node tools/kit/spike.mjs   (after tools/kit/fetch.sh, tools/actor-lab/fetch-assets.sh, npm i in tools/actor-lab)
//   node tools/kit/spike.mjs --cast [bakeDir]   our cast in the room (tools/actor-lab/kit-cast.html, the proposal's §9) on a
//     phone at 3× density: today's sprites at Luminati's render resolution (1.25) and at the phone's, a re-bake (bakeDir:
//     BAKE_PX=112 BAKE_OUT=bakeDir node tools/actor-lab/bake.cjs hero_knight hero_rogue hero_cleric skeleton_warrior
//     skeleton_minion) sampled smooth, and the models → tools/capture/out/kit/cast-*.png
import pw from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..'), OUT = join(ROOT, 'tools', 'capture', 'out', 'kit');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'model/gltf-binary', '.png': 'image/png' };
const ci = process.argv.indexOf('--cast'), CAST = ci > 0, BAKE = CAST && process.argv[ci + 1] ? process.argv[ci + 1] : null;
const srv = createServer(async (q, r) => { try { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = BAKE && u.startsWith('/bake/') ? join(BAKE, u.slice(6)) : join(ROOT, u); r.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); r.end(await readFile(f)); } catch { r.writeHead(404); r.end(); } });
await new Promise((ok) => srv.listen(0, ok)); const host = `http://localhost:${/** @type {any} */ (srv.address()).port}`;
const base = CAST ? `${host}/tools/actor-lab/kit-cast.html` : `${host}/tools/kit/spike-room.html`;
await mkdir(OUT, { recursive: true });
const b = await pw.chromium.launch();
const SHOTS = CAST ? [['cast-sprite-today', 'mode=sprite&pr=1.25'], ['cast-sprite-native', 'mode=sprite&pr=3'],
  ...(BAKE ? [['cast-sprite-2x', 'mode=sprite&pr=3&smooth&atlas=/bake/']] : []), ['cast-3d', 'mode=3d&pr=3'], ['cast-3d-1.5', 'mode=3d&pr=1.5']].map(([n, qs]) => [n, qs, 390, 844, 3])
  : [['bare', 'frame=game&plain', 390, 844, 1], ['dressed', 'frame=game', 390, 844, 1], ['dressed-45', 'frame=game&pitch=45', 390, 844, 1], ['room', 'frame=wide', 1000, 800, 1]];
for (const [name, qs, w, h, dpr] of SHOTS) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  p.on('pageerror', (e) => console.log('page error', e.message));
  await p.goto(`${base}?${qs}`); await p.waitForFunction(() => /** @type {any} */ (window).DONE, null, { timeout: 120000 });
  const st = await p.evaluate(() => /** @type {any} */ (window).STATS); await p.screenshot({ path: join(OUT, `${name}.png`) });
  console.log(`${name.padEnd(18)} ${st.calls} draw calls, ${st.tris} triangles${st.glow ? `, figure glow ${st.glow.toFixed(2)}` : ''} → tools/capture/out/kit/${name}.png`); await p.close();
}
await b.close(); srv.close();
