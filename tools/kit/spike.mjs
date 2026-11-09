// spike.mjs — shoot tools/kit/spike-room.html (docs/dungeon-kit-proposal.md §4): the dungeon kit spike room on the
// game's camera, bare and dressed, at the game's pitch and at 45°, and the room whole → tools/capture/out/kit/
//   node tools/kit/spike.mjs   (after tools/kit/fetch.sh, tools/actor-lab/fetch-assets.sh, npm i in tools/actor-lab)
import pw from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..'), OUT = join(ROOT, 'tools', 'capture', 'out', 'kit');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'model/gltf-binary', '.png': 'image/png' };
const srv = createServer(async (q, r) => { try { const f = join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); r.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); r.end(await readFile(f)); } catch { r.writeHead(404); r.end(); } });
await new Promise((ok) => srv.listen(0, ok)); const base = `http://localhost:${/** @type {any} */ (srv.address()).port}/tools/kit/spike-room.html`;
await mkdir(OUT, { recursive: true });
const b = await pw.chromium.launch();
for (const [name, qs, w, h] of [['bare', 'frame=game&plain', 390, 844], ['dressed', 'frame=game', 390, 844], ['dressed-45', 'frame=game&pitch=45', 390, 844], ['room', 'frame=wide', 1000, 800]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => console.log('page error', e.message));
  await p.goto(`${base}?${qs}`); await p.waitForFunction(() => /** @type {any} */ (window).DONE, null, { timeout: 120000 });
  const st = await p.evaluate(() => /** @type {any} */ (window).STATS); await p.screenshot({ path: join(OUT, `${name}.png`) });
  console.log(`${name.padEnd(11)} ${st.calls} draw calls, ${st.tris} triangles → tools/capture/out/kit/${name}.png`); await p.close();
}
await b.close(); srv.close();
