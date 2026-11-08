// tiers.mjs — the tiers' skills (GDD v1.55) on Luminati, as they are now (Emberlit's light over Luminati's world) and in
// Luminati's own looks (renderer.js ?tierlooks=luminati, tools/render3d/world.js TIER_LOOK), frame for frame, for the
// owner to choose between them. Each skill is staged in a real scene (the Old Barrows, a level-18 room, its wave on the
// floor): the sim's own 'skill' events sent with the shapes battle.js gives them (the caster, where it lands, its reach,
// whom it took) and, for those that hold, the hold set on the foes it took, so both runs line up frame for frame.
//
//   node tools/capture/tiers.mjs [--out dir] [--only id,id] [--fps 12] [--base url] [--looks now,luminati]
//
// Writes <out>/<look>/<skill>.webp (a strip of frames, 260 × 260 CSS px each, at --fps from the cast) and <out>/index.json
// ({ fps, size, skills: [{ id, cls, frames }] }). Needs ?dev, so localhost (it serves the repo itself).
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/tiers'))), FPS = +opt('--fps', 12), SIZE = 260;
const LOOKS = opt('--looks', 'now,luminati').split(','), ONLY = opt('--only') ? opt('--only').split(',') : null;
// each class's four, and how long each is watched (s): what lingers, longer
const CLASSES = { fighter: ['vault', 'cutting_wave', 'earthshatter', 'whirling_blades'], rogue: ['kidney_shot', 'fan_of_knives', 'shadowstep', 'caltrops'],
  mage: ['flare', 'gather', 'glacial_tomb', 'blizzard'], cleric: ['sanctuary', 'consecrate', 'revive', 'judgement'], shaman: ['binding_roots', 'old_marks', 'spirit_totem', 'thunder_drum'] };
const WATCH = { whirling_blades: 3.0, caltrops: 3.0, blizzard: 3.0, sanctuary: 3.0, consecrate: 3.0, spirit_totem: 3.5, glacial_tomb: 3.2, binding_roots: 2.6, old_marks: 2.8 };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
let srv = null, base = opt('--base');
if (!base) {
  srv = createServer(async (req, res) => {
    const p = normalize(join(ROOT, decodeURIComponent(req.url.split('?')[0])));
    if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    try { const b = await readFile(p); res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${srv.address().port}`;
}

// ── in the page ───────────────────────────────────────────────────────────────────────────────
// the party at 18 (the class first, the hero), every skill's auto-use off (nothing else is cast), in a large room at 18
async function stagePage(cls) {
  const sim = globalThis.__sim, { makeHero, makeMember, statsFor } = await import('/src/sim/party.js'), { autoAllocate } = await import('/src/sim/attributes.js'), { starterKit } = await import('/src/sim/items.js'), { SKILLS } = await import('/src/sim/skills.js');
  sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
  const classes = [cls, cls === 'fighter' ? 'cleric' : 'fighter', cls === 'rogue' ? 'cleric' : 'rogue'];
  sim.state.party = classes.map((c, i) => { const m = i ? makeMember('c' + i, ['Wren', 'Tam'][i - 1], c, 18) : makeHero({ cls: c }); m.level = 18; m.attrs = null; m.autoAttrs = true; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp * 4; m.mp = statsFor(m).maxMp; m.off = SKILLS[c].map((s) => s.id); return m; });
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom && q.size === 'large'), P = sim.state.player;
  sim.world.roomLevels.set(r.id, 16);
  P.x = P.px = r.cx + 0.5; P.y = P.py = r.cy + 0.5;
  sim.state.party.forEach((m, i) => { if (i) { m.x = m.px = P.x + (i === 1 ? 1.4 : -1.4); m.y = m.py = P.y + 1.2; } });
  return true;
}
// a skill, staged: its cast, then (0.38 s on, as battle.js's wind-up) where it lands; returns where to look
function stage(id) {
  const s = globalThis.__sim, P = s.state.player, H = s.state.party[0], A = s.state.party[1], foes = s.world.enemies.filter((e) => !e.dead && e.hp > 0 && !(e.spawn > 0));
  const d = (o, q) => Math.hypot(o.x - q.x, o.y - q.y), byNear = (q) => [...foes].sort((a, b) => d(a, q) - d(b, q)), at = (o) => ({ id: o.id, x: o.x, y: o.y });
  const near = byNear(P), T = near[0] || { id: null, x: P.x + 2, y: P.y }, far = near.find((o) => d(o, P) >= 3) || T;
  const ev = (more) => ({ id, cls: H.cls, by: H.id, x: P.x, y: P.y, tid: null, ally: false, tx: P.x, ty: P.y, r: 0, reached: [], crit: false, ...more });
  const dir = (o, len) => { const l = d(o, P) || 1; return { tx: P.x + ((o.x - P.x) / l) * len, ty: P.y + ((o.y - P.y) / l) * len }; };
  const within = (q, r) => foes.filter((o) => d(o, q) < r).map(at);
  let land, look = T, holds = [];
  switch (id) {
    case 'vault': land = ev({ tid: far.id, tx: far.x, ty: far.y, reached: within(far, 1.8) }); look = far; holds = [[far, 'knocked', 0.8, 0.3]]; break;
    case 'cutting_wave': land = ev({ ...dir(T, 6), reached: near.slice(0, 2).map(at) }); look = { x: (P.x + T.x) / 2, y: (P.y + T.y) / 2 }; break;
    case 'earthshatter': land = ev({ tid: H.id, ally: true, r: 3, reached: near.slice(0, 3).map(at) }); look = P; holds = near.slice(0, 3).map((o) => [o, 'knocked', 1.2, 0]); break;
    case 'whirling_blades': land = ev({ tid: H.id, ally: true, r: 3, reached: within(P, 3) }); look = P; break;
    case 'kidney_shot': land = ev({ tid: T.id, tx: T.x, ty: T.y }); holds = [[T, 'stun', 1.5, 0]]; break;
    case 'fan_of_knives': land = ev({ ...dir(T, 6), reached: near.slice(0, 3).map(at) }); look = { x: (P.x + T.x) / 2, y: (P.y + T.y) / 2 }; break;
    case 'shadowstep': land = ev({ tid: far.id, tx: far.x, ty: far.y, crit: true }); look = far; break;
    case 'caltrops': land = ev({ tx: T.x, ty: T.y, r: 2.5, reached: within(T, 2.5) }); break;
    case 'flare': land = ev({ tid: T.id, tx: T.x, ty: T.y, r: 2.5, reached: within(T, 2.5) }); break;
    case 'gather': land = ev({ tx: T.x, ty: T.y, r: 5, reached: within(T, 5) }); break;
    case 'glacial_tomb': land = ev({ tx: T.x, ty: T.y, r: 3, reached: near.slice(0, 3).filter((o) => d(o, T) < 3.5).map(at) }); holds = near.slice(0, 3).filter((o) => d(o, T) < 3.5).map((o) => [o, 'frozen', 2.5, 0]); break;
    case 'blizzard': land = ev({ tx: T.x, ty: T.y, r: 2.5, reached: within(T, 2.5) }); break;
    case 'sanctuary': land = ev({ tx: P.x, ty: P.y, ally: true, r: 3, reached: s.state.party.map((m, i) => ({ id: m.id, x: i ? m.x : P.x, y: i ? m.y : P.y })) }); look = P; break;
    case 'consecrate': land = ev({ tx: T.x, ty: T.y, r: 2.5, reached: within(T, 2.5) }); break;
    case 'revive': land = ev({ tid: A.id, ally: true, tx: A.x, ty: A.y }); look = A; break;
    case 'judgement': land = ev({ tid: T.id, tx: T.x, ty: T.y, r: 3, reached: within(T, 3).filter((o) => o.id !== T.id) }); break;
    case 'binding_roots': land = ev({ tx: T.x, ty: T.y, r: 3, reached: within(T, 3) }); holds = foes.filter((o) => d(o, T) < 3).map((o) => [o, 'rooted', 2.5, 0]); break;
    case 'old_marks': land = ev({ tid: T.id, tx: T.x, ty: T.y, marks: 1 }); holds = [[T, 'stun', 1, 1.8]]; break;
    case 'spirit_totem': { const c = { x: (P.x + A.x) / 2, y: (P.y + A.y) / 2 }; land = ev({ tx: c.x, ty: c.y, ally: true, r: 4, reached: [] }); look = c; break; }
    case 'thunder_drum': land = ev({ tid: H.id, ally: true, tx: P.x, ty: P.y, r: 3, reached: within(P, 3) }); look = P; holds = foes.filter((o) => d(o, P) < 3).map((o) => [o, 'stun', 1, 0]); break;
  }
  s.bus.emit('skill', { ...land, at: 'cast' });
  globalThis.__staged = { land, holds: holds.map(([o, k, t, after]) => ({ id: o.id, k, t, after })), sent: false, t0: s.state.t, marks: id === 'old_marks' ? 1 : 0 };
  return { x: look.x, y: look.y };
}
// the sim moves on a frame at a time; the staged land and holds go out on time (the holds by the foe's own fields, as battle.js sets them)
function tick(ms) {
  const s = globalThis.__sim, S = globalThis.__staged;
  for (let t = 0; t < ms; t += 33) {
    globalThis.__frame(33);
    if (!S) continue;
    const age = s.state.t - S.t0;
    if (!S.sent && age >= 0.38) { S.sent = true; s.bus.emit('skill', { ...S.land, at: 'land' }); }
    if (S.marks && S.marks < 3 && age >= 0.38 + 0.9 * S.marks) { S.marks++; s.bus.emit('skill', { ...S.land, at: 'land', marks: S.marks }); }
    for (const h of S.holds) if (!h.done && age >= 0.38 + h.after) { h.done = true; const f = s.world.enemies.find((e) => e.id === h.id); if (f) f[h.k] = h.t; }
  }
}
function take(cx, cy, size) {
  globalThis.__lumDraw = true; globalThis.__frame(16);
  const W = size, H = size, d = devicePixelRatio, c = document.createElement('canvas'); c.width = W * d; c.height = H * d;
  const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
  for (const cv of document.querySelectorAll('canvas')) {
    const st = getComputedStyle(cv), r = cv.getBoundingClientRect();
    if (cv === c || st.display === 'none' || st.visibility === 'hidden' || r.width * r.height < innerWidth * innerHeight * 0.5) continue;
    g.drawImage(cv, (r.left - (cx - W / 2)) * d, (r.top - (cy - H / 2)) * d, r.width * d, r.height * d);
  }
  return c.toDataURL('image/png');
}

async function run(look) {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  await mkdir(join(OUT, look), { recursive: true });
  const done = [];
  for (const [cls, ids] of Object.entries(CLASSES)) for (const id of ids) {
    if (ONLY && !ONLY.includes(id)) continue;
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=dungeon&site=barrows&renderer=luminati${look === 'luminati' ? '&tierlooks=luminati' : ''}`);
    await p.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__sim, null, { timeout: 120000 });
    for (let i = 0; i < 600; i++) { if (await p.evaluate(() => { for (let k = 0; k < 4; k++) globalThis.__frame(16); return !globalThis.__renderer.transiting && (!globalThis.__world3d || globalThis.__world3d.world?.stats.level >= 1); })) break; await p.waitForTimeout(50); }
    await p.evaluate(`globalThis.__take = ${take.toString()}; globalThis.__tick = ${tick.toString()}; globalThis.__stage = ${stage.toString()};`);
    await p.evaluate(stagePage, cls);
    // the wave on the floor and closing (Luminati stepped, not drawn, meanwhile)
    await p.evaluate(() => { globalThis.__lumDraw = false; globalThis.__tick(4500); });
    const lookAt = await p.evaluate((id) => globalThis.__stage(id), id);
    const frames = [], n = Math.round((WATCH[id] || 1.8) * FPS), step = 1000 / FPS;
    for (let i = 0; i < n; i++) {
      frames.push(await p.evaluate(({ lookAt, size }) => { const [sx, sy] = globalThis.__renderer.screenAt(lookAt.x, lookAt.y); return globalThis.__take(Math.max(size / 2, Math.min(innerWidth - size / 2, sx)), Math.max(size / 2, Math.min(innerHeight - size / 2, sy - 30)), size);   /* (kept on the screen) */ }, { lookAt, size: SIZE }));
      await p.evaluate((ms) => { globalThis.__lumDraw = false; globalThis.__tick(ms); }, step - 16);
    }
    const strip = await p.evaluate(async (fr) => { const ims = await Promise.all(fr.map(async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; }));
      const c = document.createElement('canvas'); c.width = ims[0].width * ims.length; c.height = ims[0].height; const g = c.getContext('2d'); ims.forEach((im, i) => g.drawImage(im, i * im.width, 0)); return c.toDataURL('image/webp', 0.8); }, frames);
    await writeFile(join(OUT, look, `${id}.webp`), Buffer.from(strip.split(',')[1], 'base64'));
    done.push({ id, cls, frames: n });
    console.log(`${look} ${cls} ${id}: ${n} frames${errs.length ? ' · page errors ' + errs.slice(0, 2).join(' | ') : ''}`);
    await p.close();
  }
  await b.close();
  return done;
}
const res = await Promise.all(LOOKS.map((l) => run(l)));
await writeFile(join(OUT, 'index.json'), JSON.stringify({ fps: FPS, size: SIZE, looks: LOOKS, skills: res[0] }, null, 1));
srv?.close();
console.log(`done: ${res[0].length} skills · ${OUT}`);
