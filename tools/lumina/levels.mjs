// levels.mjs — Emberfall's own levels for the Luminati prototype (docs/lumina-prototype.md §3), written at build time by
// tools/lumina/build.mjs into the staged public/levels/ (nothing generated is committed but the built lumina/):
//   thornwick   Thornwick as the game builds it (createSim, the town scene, the Vale): every tile's ground, every
//               building, wall, tree, rock, fence and prop where our sim puts it, and the nine townsfolk at their posts
//               with their own first lines, read out of their compiled Ink (no line is written here)
//   catalogue   every world asset Luminati builds, one exhibit each, in rows by its own catalogue's categories, named
//               by a signpost; then a row of Emberfall's whole cast
//   encounter   a fight on the Vale road: a party of Emberfall's heroes against our goblins, played by the autobattle
//               (ember/autobattle.js) or by hand
//   node tools/lumina/levels.mjs [id]   prints what each level holds (no files)
// Luminati's level format (engine/level/: format "luminati-level", version 1): a tile a world unit, rows of legend
// characters, heights in half units ('0'-'9', 'a'-'z'), objects by type (engine/level/ObjectCatalog.js OBJECT_TYPES).
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SEED = 20260807;
const hash = (...v) => { let h = 0x811c9dc5; for (const c of v.join('|')) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193); return h >>> 0; };
const r2 = (v) => Math.round(v * 100) / 100;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** a level's frame: Luminati's own legend and environment (from a shipped level, `base`), our size and look */
function frame(base, { name, subtitle, description, width, depth, environment }) {
  return { format: 'luminati-level', version: 1, name, subtitle, author: 'Emberfall', description, width, depth,
    waterLevel: 0.4, water: base.water, environment: { ...base.environment, ...environment }, legend: base.legend };
}
const grid = (w, d, ch) => Array.from({ length: d }, () => Array(w).fill(ch));
const rows = (g) => g.map((r) => r.join(''));

// ── an NPC's opening lines, from its compiled Ink (as the game would play them on a first and a later meeting) ──────
let Story = null;
async function inkLines(file, knot, metFlag, vars = {}) {
  Story ??= (await import(pathToFileURL(join(ROOT, 'src', 'vendor', 'inkjs-2.4.0', 'ink.mjs')).href)).Story;
  const json = readFileSync(join(ROOT, 'content', 'dialogue', `${file}.json`), 'utf8').replace(/^\uFEFF/, '');
  const out = [];
  for (const met of [0, 1]) {
    const s = new Story(json);
    s.variablesState.hero_name = '\u0001';                   // (a line that names the hero is left out: there's no hero name)
    for (const [k, v] of Object.entries(vars)) s.variablesState[k] = v;
    if (metFlag) s.variablesState[metFlag] = met;
    s.ChoosePathString(knot);
    while (s.canContinue) { const l = s.Continue().trim(); if (l && !l.includes('\u0001') && !out.includes(l)) out.push(l); }
  }
  return out;
}

// ══ Thornwick ═════════════════════════════════════════════════════════════════════════════════════════════════════
// Our tiles are half a Luminati unit: a 56-px figure is 3.5 of ours and 1.75 of theirs (EMBER_PPU 32), so the town keeps
// its proportions. The crop is the walled town and the farms east of it, to the Vale road.
const CROP = [-12, -16, 168, 128];                           // x0 y0 x1 y1, our tiles
// who stands where: the townsfolk (content/npcs/), their look, Luminati's preset and a few words under the name
const FOLK = {
  maudry_fenn: { preset: 'innkeeper', ink: ['maudry', 'maudry_hub', 'flag_met_maudry'], title: 'The Tired Mule' },
  osric_hale: { preset: 'guard', ink: ['osric', 'osric_hub', 'flag_met_osric'], title: 'Warden-Captain' },
  sister_ilse: { preset: 'cleric', ink: ['ilse', 'ilse_hub', 'flag_met_ilse'], title: 'Grey Sister' },
  wendel: { preset: 'merchant', ink: ['townsfolk', 'wendel_hub', 'flag_met_wendel'], title: 'Provisions' },
  bess_hale: { preset: 'villager', ink: ['townsfolk', 'bess_hub', 'flag_met_bess'], title: 'Hale & Daughter' },
  col: { preset: 'villager', ink: ['townsfolk', 'col_hub', 'flag_met_col'], title: 'The Greyholt cart' },
  jory: { preset: 'guard', ink: ['townsfolk', 'jory_hub', 'flag_met_jory'], title: 'The Watch' },
  nell_tolley: { preset: 'innkeeper', ink: ['townsfolk', 'nell_hub', 'flag_met_nell'], title: 'The Crossed Keys' },
  hedda: { preset: 'farmer', ink: ['townsfolk', 'hedda_hub', 'flag_met_hedda'], title: 'Eggs' },
};
// a building's look in Luminati's walls and roofs, by our piece (the Vale's: timber, plaster and thatch; stone for the
// Shrine and the forge)
const HOUSES = [
  [/_temple_/, { wall: 'stone_brick', roof: 'roof_slate', stories: 2, chimney: false }],
  [/_tavern_/, { wall: 'timber_frame', roof: 'roof_thatch', stories: 2, sign: true, woodpile: true }],
  [/_shop_/, { wall: 'plaster', roof: 'roof_red', stories: 1, sign: true, doorHood: true }],
  [/_smith_/, { wall: 'stone_brick', roof: 'roof_slate', stories: 1, sign: true }],
  [/_inn_/, { wall: 'stone_brick', upperWall: 'timber_frame', roof: 'roof_red', stories: 2, sign: true }],
  [/_longhousex?_/, { wall: 'log_wall', roof: 'roof_thatch', stories: 1 }],
  [/_workshopx?_/, { wall: 'wood_planks', roof: 'roof_slate', stories: 1 }],
  [/_cottagex?_/, { wall: 'plaster', roof: 'roof_thatch', stories: 1 }],
  [/_housex?_/, { wall: 'timber_frame', roof: 'roof_thatch', stories: 2 }],
  [/_farmx?_/, { wall: 'wood_planks_dark', roof: 'roof_thatch', stories: 1, woodpile: true }],
];
const TREES = { oak: 'oak', autumn: 'autumn', birch: 'birch', pine: 'pine', dead: 'deadwood' };

export async function thornwick(base) {
  const { createSim } = await import(pathToFileURL(join(ROOT, 'src', 'sim', 'core.js')).href);
  const { ENV_FOOT } = await import(pathToFileURL(join(ROOT, 'src', 'sim', 'envfoot.js')).href);
  const npcDefs = Object.fromEntries(Object.keys(FOLK).map((id) => [id, JSON.parse(readFileSync(join(ROOT, 'content', 'npcs', `${id}.json`), 'utf8'))]));
  const sim = createSim(SEED, undefined, { scene: 'town', region: 'vale' }), w = sim.world;
  const [x0, y0, x1, y1] = CROP, W = (x1 - x0) / 2, D = (y1 - y0) / 2;
  const X = (x) => r2((x - x0) / 2), Z = (y) => r2((y - y0) / 2);
  const tm = (x, y) => { const gx = x + w.PAD, gy = y + w.PAD; return gx >= 0 && gy >= 0 && gx < w.GW && gy < w.GH ? w.tmat[gy * w.GW + gx] : 0; };

  // the ground: each Luminati tile is four of ours; the most of them wins, and a road or a field wins a tie with grass
  const CH = { 0: 'g', 1: '.', 2: 'c', 5: 'F' }, RANK = { 2: 3, 1: 2, 5: 1, 0: 0 };
  const tiles = grid(W, D, 'g'), heights = grid(W, D, '2');
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const n = {};
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const t = tm(x0 + 2 * i + dx, y0 + 2 * j + dy); n[t] = (n[t] || 0) + 1; }
    const t = Object.keys(n).sort((a, b) => n[b] - n[a] || RANK[b] - RANK[a])[0];
    let c = CH[t] ?? 'g';
    if (c === 'g') { const h = hash('g', i, j) % 100; c = h < 12 ? 'G' : h < 16 ? 'f' : 'g'; }
    tiles[j][i] = c;
  }
  const objects = [], count = {};
  const add = (o) => { count[o.type] = (count[o.type] || 0) + 1; objects.push({ id: `${o.type}_${count[o.type]}`, ...o }); };
  const inside = (x, z, m = 0.5) => x > m && z > m && x < W - m && z < D - m;
  // a piece's footprint in Luminati's units: centre and size
  const foot = (s) => { const f = ENV_FOOT[s.id]; if (!f) return null; return { cx: X(s.x + (f[0] + f[2]) / 2), cz: Z(s.y + (f[1] + f[3]) / 2), w: (f[2] - f[0]) / 2, d: (f[3] - f[1]) / 2, f }; };
  const services = new Map(w.services.map((v) => [v.id, v]));

  // the town wall: the curtain, its towers and the east gatehouse raised in stone (Luminati's terrain: a step of a
  // unit or more is a wall face nobody climbs), the Vale road kept open through the gate
  const wallTiles = (s, level) => {
    const f = ENV_FOOT[s.id];
    for (let j = Math.floor((s.y + f[1] - y0) / 2); j < Math.ceil((s.y + f[3] - y0) / 2); j++)
      for (let i = Math.floor((s.x + f[0] - x0) / 2); i < Math.ceil((s.x + f[2] - x0) / 2); i++)
        if (i >= 0 && j >= 0 && i < W && j < D && heights[j][i] < level) { tiles[j][i] = 'k'; heights[j][i] = level; }
  };
  let gate = null;
  for (const s of w.structs) {
    if (/_curtainy?_\d/.test(s.id)) wallTiles(s, '6');
    else if (/_tower_\d/.test(s.id)) wallTiles(s, '8');
    else if (/_gatehousey?_\d/.test(s.id)) { wallTiles(s, '8'); gate = s; }
  }
  if (gate) for (const r of w.roads) for (let k = 0; k + 1 < r.pts.length; k++) {   // the road's tiles through the gate, open
    const [a, b] = [r.pts[k], r.pts[k + 1]];
    for (let t = 0; t <= 1; t += 0.01) {
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      if (Math.abs(x - gate.x) > 6) continue;
      for (let o = -r.w / 2 + 0.5; o < r.w / 2; o += 1) { const i = Math.floor((x - x0) / 2), j = Math.floor((y + o - y0) / 2); if (j >= 0 && j < D) { tiles[j][i] = 'c'; heights[j][i] = '2'; } }
    }
  }
  const walled = (x, z) => { const i = Math.floor(x), j = Math.floor(z); return i < 0 || j < 0 || i >= W || j >= D || heights[j][i] !== '2'; };

  for (const s of w.structs) {
    const id = s.id, p = foot(s);
    if (!p || !inside(p.cx, p.cz)) continue;
    const look = HOUSES.find(([re]) => re.test(id));
    if (look && /^vale_|^windmill/.test(id)) {
      const svc = services.get(id);
      add({ type: 'house', x: p.cx, z: p.cz, rotation: 0, ...(svc ? { name: svc.name } : {}), light: !!svc || hash(id, s.x) % 3 === 0,
        opts: { width: r2(clamp(p.w * 0.82, 3, 8)), depth: r2(clamp(p.d * 0.72, 2.5, 6)), chimney: true, shutters: true, doorHood: false, woodpile: false,
          gableFront: false, sign: false, upperWall: '', ...look[1], seed: hash(id, s.x, s.y) % 997 } });
      if (/_smith_/.test(id)) {                               // Hale & Daughter's forge and anvil, out front as in ours
        add({ type: 'smithy', x: r2(p.cx - 1.6), z: r2(p.cz + p.d * 0.36 + 1.4), rotation: 0, opts: { kind: 'forge', seed: 3 } });
        add({ type: 'smithy', x: r2(p.cx + 1.2), z: r2(p.cz + p.d * 0.36 + 1.6), rotation: 0, opts: { kind: 'anvil', seed: 4 } });
      }
      continue;
    }
    const m = /^([a-z]+)_\d/.exec(id), kind = m && m[1];
    if (kind && (TREES[kind] || kind === 'grove')) {
      if (walled(p.cx, p.cz)) continue;
      const h = hash(id, s.x, s.y), tk = kind === 'grove' ? ['oak', 'oak', 'pine', 'autumn', 'deadwood'][h % 5] : TREES[kind];
      add({ type: 'tree', x: p.cx, z: p.cz, collider: true, opts: { kind: tk, height: r2(clamp(Math.max(p.w, p.d) * 0.62, 2.6, 6.2)), seed: h % 997 } });
    } else if (/^rock_/.test(id)) add({ type: 'rock', x: p.cx, z: p.cz, opts: { size: r2(clamp(Math.max(p.w, p.d) * 0.55, 0.6, 1.4)), seed: hash(id, s.x) % 97 } });
    else if (/^fence_/.test(id)) {
      const f = p.f, horiz = f[2] - f[0] > f[3] - f[1];
      add(horiz ? { type: 'fence', x0: X(s.x + f[0]), z0: p.cz, x1: X(s.x + f[2]), z1: p.cz, opts: {} } : { type: 'fence', x0: p.cx, z0: Z(s.y + f[1]), x1: p.cx, z1: Z(s.y + f[3]), opts: {} });
    }
    else if (/_(well|lanewell)_\d/.test(id)) add({ type: 'well', x: p.cx, z: p.cz, rotation: 0, opts: { roof: 'roof_thatch' } });
    else if (/^windmill_/.test(id)) add({ type: 'windmill', x: p.cx, z: p.cz, rotation: 0, opts: { height: 7, roof: 'roof_thatch', seed: 7 } });
    else if (/^lamppost_/.test(id)) add({ type: 'lamppost', x: p.cx, z: p.cz, rotation: 0, opts: { style: 'arm' } });
    else if (/_foodstand_/.test(id)) add({ type: 'marketStall', x: p.cx, z: p.cz, rotation: 0, opts: { cloth: 'cloth_stripe', width: 3, crates: 'right', seed: 2 } });
    else if (/^barrel/.test(id)) add({ type: 'barrel', x: p.cx, z: p.cz, rotation: (hash(id, s.x, s.y) % 7) / 7, opts: { height: 1, lying: false } });
    else if (/^crate_|^boxes/.test(id)) add({ type: 'crateStack', x: p.cx, z: p.cz, rotation: 0.2, opts: { count: /^boxes/.test(id) ? 3 : 2, size: 0.8, seed: hash(id, s.x) % 31 } });
    else if (/^sack/.test(id)) add({ type: 'sacks', x: p.cx, z: p.cz, rotation: 0, opts: { count: 3, seed: 5 } });
    else if (/^table_/.test(id)) add({ type: 'table', x: p.cx, z: p.cz, rotation: 0, opts: { shape: 'rect', width: 1.6, depth: 0.9, cloth: false, items: true, candle: false, seed: 6 } });
    else if (/^bench_/.test(id)) add({ type: 'bench', x: p.cx, z: p.cz, rotation: 0, opts: { length: 1.6, back: true } });
    else if (/^(handcart|cart|wheelbarrow)/.test(id)) add({ type: 'debris', x: p.cx, z: p.cz, rotation: /_90$/.test(id) ? 1.57 : 0, opts: { kind: 'cart', size: /^cart/.test(id) ? 1 : 0.7, charred: false, seed: hash(id, s.x) % 31 } });
    else if (/^resource_lumber|^woodpile/.test(id)) add({ type: 'debris', x: p.cx, z: p.cz, rotation: 0, opts: { kind: 'timbers', size: 0.8, charred: false, seed: 9 } });
    else if (/^hay_/.test(id)) add({ type: 'haystack', x: p.cx, z: p.cz, opts: { size: 0.8, seed: hash(id, s.x) % 31 } });
    else if (/^hens_/.test(id)) add({ type: 'critters', x: p.cx, z: p.cz, kind: 'chicken', count: 4, radius: 1.6 });
    else if (/^ug_flowers/.test(id) && !walled(p.cx, p.cz)) tiles[Math.floor(p.cz)][Math.floor(p.cx)] = 'f';
  }

  // the townsfolk, at their posts, in their own looks, with their own first words
  const people = [];
  for (const n of w.npcs) {
    const F = FOLK[n.id], def = npcDefs[n.id];
    if (!F || !def) continue;
    const dialogue = await inkLines(...F.ink);
    add({ type: 'npc', x: X(n.x), z: Z(n.y), name: def.name, title: F.title, preset: F.preset, spec: { emberActor: def.look }, facing: 'down',
      behaviour: 'post', wander: 0.6, speed: 0.8, portraitColor: '#b8862e', action: 'none', item: '', script: '', dialogue });
    objects[objects.length - 1].id = n.id;
    people.push({ id: n.id, look: def.look, lines: dialogue.length });
  }
  // the regions' plates: the town, and its square (outdoor.js plazas)
  add({ type: 'region', minX: 0, maxX: W, minZ: 0, maxZ: D, name: 'Thornwick', sub: 'The Hollow Vale', minY: -10, banner: 'Emberfall\'s town, in Luminati\'s light' });
  const sq = w.plazas[0];
  if (sq) add({ type: 'region', minX: X(sq.cx - sq.rx), maxX: X(sq.cx + sq.rx), minZ: Z(sq.cy - sq.ry), maxZ: Z(sq.cy + sq.ry), name: 'The Square', sub: 'Thornwick', minY: -10, banner: '' });
  for (const svc of w.services) { const p = foot(w.structs.find((s) => s.id === svc.id)); if (p) add({ type: 'region', minX: r2(p.cx - p.w / 2), maxX: r2(p.cx + p.w / 2), minZ: r2(p.cz - p.d / 2), maxZ: r2(p.cz + p.d / 2 + 2), name: svc.name, sub: 'Thornwick', minY: -10, banner: '' }); }

  // the frame's edge: the Vale's woods (blocked), Luminati's forest border beyond
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) if (i === 0 || j === 0 || i === W - 1 || j === D - 1) { tiles[j][i] = 'T'; heights[j][i] = '2'; }
  const hub = w.hub;
  const level = {
    ...frame(base, { name: 'Thornwick', subtitle: 'The Hollow Vale, as Emberfall builds it', width: W, depth: D,
      description: 'Emberfall\'s Thornwick, converted from the game\'s own sim (tools/lumina/levels.mjs): its ground, walls, buildings, trees and townsfolk where the game puts them.',
      environment: { timeOfDay: 17.9, clock: true, weather: 'clear', border: 'forest', outerScenery: true, godRays: true, dust: true, camera: null, highGround: null } }),
    spawn: { x: X(hub.x), z: Z(hub.y), facing: 'down' },
    tiles: rows(tiles), heights: rows(heights), objects,
  };
  return { level, stats: { size: `${W} × ${D}`, objects: count, people } };
}

// ══ the catalogue ═════════════════════════════════════════════════════════════════════════════════════════════════
// Every world asset Luminati's engine builds (its ObjectCatalog: each type and each of its kinds, walls, roofs, stones,
// styles), one exhibit a cell along lanes of cobble, a signpost in front naming it as the level format does
// (`type · field value`), a row a region whose plate names it. Then the ground's tile types, and Emberfall's whole
// cast (assets/actors/), each as the game bakes them. The exhibits come from the catalogue itself, so a type Luminati
// adds at a new pin shows up in its row.
const humanize = (id) => id.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
export async function catalogue(base, LUM) {
  const C = await import(pathToFileURL(join(LUM, 'src', 'engine', 'level', 'ObjectCatalog.js')).href);
  const T = C.OBJECT_TYPES, optionsOf = (type, key) => (T[type].fields || []).find((f) => f.key === key)?.options?.map((o) => o.value ?? o).filter((v) => v !== '') ?? [];
  const W = 112, ROWS = [];
  const row = (title, cell, depth, items) => ROWS.push({ title, cell, depth, items });
  const ex = (type, label, over = {}) => ({ type, label, over });
  // the buildings: every wall (its roof in turn), every roof, the forms; then the other buildings
  const walls = optionsOf('house', 'opts.wall'), roofs = optionsOf('house', 'opts.roof');
  row('Houses: the walls', 9, 7.5, walls.map((w, i) => ex('house', `house · wall ${w}\nroof ${roofs[i % roofs.length]}`, { opts: { wall: w, roof: roofs[i % roofs.length], width: 4.4, depth: 3.2, stories: 1, seed: i + 1 } })));
  row('Houses: the roofs and the forms', 9, 7.5, [
    ...roofs.map((r, i) => ex('house', `house · roof ${r}`, { opts: { wall: 'timber_frame', roof: r, width: 4.4, depth: 3.2, stories: 1, seed: 20 + i } })),
    ex('house', 'house · stories 2, upperWall plaster', { opts: { wall: 'stone_brick', upperWall: 'plaster', roof: 'roof_slate', stories: 2, width: 5, depth: 3.6, sign: true, seed: 31 } }),
    ex('house', 'house · gableFront', { opts: { wall: 'brick', roof: 'roof_red', gableFront: true, width: 4.4, depth: 3.6, seed: 32 } }),
    ex('house', 'house · flatRoof', { opts: { wall: 'adobe', roof: 'roof_terracotta', flatRoof: true, width: 4.4, depth: 3.2, seed: 33 } }),
    ex('house', 'house · ruin', { opts: { wall: 'charred_wall', roof: 'roof_charred', ruin: true, width: 4.4, depth: 3.2, seed: 34 } }),
  ]);
  row('Buildings', 9, 8.5, [
    ex('windmill', 'windmill', { opts: { roof: 'roof_thatch' } }),
    ...optionsOf('well', 'opts.roof').slice(0, 2).map((r) => ex('well', `well · roof ${r}`, { opts: { roof: r } })),
    ...optionsOf('marketStall', 'opts.cloth').map((c) => ex('marketStall', `marketStall · cloth ${c}`, { opts: { cloth: c } })),
    ...optionsOf('belfry', 'opts.kind').map((k) => ex('belfry', `belfry · kind ${k}`, { opts: { kind: k } })),
  ]);
  row('Trees', 7.5, 7, optionsOf('tree', 'opts.kind').map((k, i) => ex('tree', `tree · kind ${k}`, { collider: true, opts: { kind: k, seed: 40 + i } })));
  row('Stone', 7, 6, [
    ...['', ...optionsOf('rock', 'opts.stone')].map((s) => ex('rock', `rock · stone ${s || '(plain)'}`, { opts: { stone: s, size: 1.2 } })),
    ...optionsOf('crag', 'opts.kind').map((k) => ex('crag', `crag · kind ${k}`, { opts: { kind: k } })),
    ex('haystack', 'haystack'),
  ].slice(0, 15));
  row('Light and fire', 7, 5.5, [
    ...optionsOf('lamppost', 'opts.style').map((s) => ex('lamppost', `lamppost · style ${s}`, { opts: { style: s } })),
    ex('wallTorch', 'wallTorch'), ex('campfire', 'campfire', { opts: { seat: true } }), ex('light', 'light (a point light)'),
    ...optionsOf('fire', 'opts.kind').map((k) => ex('fire', `fire · kind ${k}`, { opts: { kind: k } })),
    ...optionsOf('monument', 'opts.kind').map((k) => ex('monument', `monument · kind ${k}`, { opts: { kind: k } })),
  ]);
  row('Props', 6.5, 5, [
    ex('bench', 'bench'), ex('barrel', 'barrel'), ex('barrel', 'barrel · lying', { opts: { lying: true } }), ex('crate', 'crate'), ex('crateStack', 'crateStack'),
    ex('flowerbox', 'flowerbox'), ex('signpost', 'signpost', { opts: { boards: 3 } }), ex('sacks', 'sacks'),
    ...optionsOf('debris', 'opts.kind').map((k) => ex('debris', `debris · kind ${k}`, { opts: { kind: k } })),
  ]);
  row('Indoors', 6, 5, [
    ex('bed', 'bed'), ...optionsOf('table', 'opts.shape').map((s) => ex('table', `table · shape ${s}`, { opts: { shape: s, items: true, candle: true } })),
    ...optionsOf('chair', 'opts.style').map((s) => ex('chair', `chair · style ${s}`, { opts: { style: s } })),
    ...optionsOf('shelf', 'opts.kind').map((k) => ex('shelf', `shelf · kind ${k}`, { opts: { kind: k } })),
    ex('hearth', 'hearth', { opts: { lit: true, pot: true } }),
    ...optionsOf('counter', 'opts.style').map((s) => ex('counter', `counter · style ${s}`, { opts: { style: s, items: true } })),
    ex('rug', 'rug'), ex('staircase', 'staircase'),
    ...optionsOf('wardrobe', 'opts.kind').map((k) => ex('wardrobe', `wardrobe · kind ${k}`, { opts: { kind: k } })),
    ex('wallWindow', 'wallWindow'),
  ]);
  row('The smithy', 7, 5, optionsOf('smithy', 'opts.kind').map((k) => ex('smithy', `smithy · kind ${k}`, { opts: { kind: k } })));
  row('Fences, bridges and boats', 0, 10, []);                // (laid out by hand, below: they need water)
  row('Life in the air and underfoot', 6.5, 5, [
    ...optionsOf('critters', 'kind').map((k) => ex('critters', `critters · kind ${k}`, { kind: k, count: 3, radius: 1.2 })),
    // (an exhibit: ground.js leaves the floating dots out of every level but here)
    ...optionsOf('emitter', 'preset').map((p) => ex('emitter', `emitter · preset ${p}`, { preset: p, size: [3, 2, 2.5], count: 20, dy: 0.8, emberExhibit: true })),
  ]);
  row('The ground', 0, 5, []);                               // (tile patches, below)
  const actors = (await import('node:fs')).readdirSync(join(ROOT, 'assets', 'actors')).filter((f) => /^[a-z_0-9]+\.json$/.test(f)).map((f) => f.slice(0, -5)).sort();
  const names = Object.fromEntries((await import('node:fs')).readdirSync(join(ROOT, 'content', 'npcs')).map((f) => JSON.parse(readFileSync(join(ROOT, 'content', 'npcs', f), 'utf8'))).map((d) => [d.look, d.name]));
  const cast = (title, list, depth) => row(title, W / (list.length + 1), depth, list.map((a) => ({ actor: a, label: names[a] ? `${names[a]} · ${a}` : `${humanize(a)} · ${a}` })));
  cast('Emberfall\'s cast: the heroes and the townsfolk', actors.filter((a) => /^(hero|npc)_/.test(a)), 4.5);
  cast('Emberfall\'s cast: the foes', actors.filter((a) => !/^(hero|npc|boss)_/.test(a)), 4.5);
  cast('Emberfall\'s cast: the bosses', actors.filter((a) => /^boss_/.test(a)), 6);

  const LANE = 1.5, D = Math.ceil(ROWS.reduce((s, r) => s + r.depth + LANE, 3)) + 1;
  const tiles = grid(W, D, 'g'), heights = grid(W, D, '2'), objects = [], count = {};
  const add = (o) => { count[o.type] = (count[o.type] || 0) + 1; objects.push({ id: `${o.type}_${count[o.type]}`, ...o }); };
  const sign = (x, z, label) => add({ type: 'signpost', x: r2(x), z: r2(z), rotation: 0, speaker: 'Catalogue', text: [label], opts: { boards: 1 } });
  const fill = (x0, z0, x1, z1, ch, h) => { for (let j = Math.max(0, Math.floor(z0)); j < Math.min(D, Math.ceil(z1)); j++) for (let i = Math.max(0, Math.floor(x0)); i < Math.min(W, Math.ceil(x1)); i++) { tiles[j][i] = ch; heights[j][i] = h; } };
  let z = 3; const exhibits = [];
  fill(0, 1, W, 3, 'c', '2');
  for (const R of ROWS) {
    const zc = z + R.depth / 2, zl = z + R.depth;
    fill(0, zl, W, zl + LANE, 'c', '2');
    add({ type: 'region', minX: 0, maxX: W, minZ: r2(z - 0.5), maxZ: r2(zl + LANE - 0.5), name: R.title, sub: 'The catalogue', minY: -10, banner: '' });
    if (R.title === 'Fences, bridges and boats') {
      add({ type: 'fence', x0: 4, z0: r2(zc - 2), x1: 12, z1: r2(zc - 2), opts: {} }); sign(8, zl - 0.6, 'fence (a line: x0, z0 → x1, z1)');
      fill(16, z + 1, 20, zl - 0.5, 'o', '0');                 // a channel, and the bridge over it
      add({ type: 'bridge', x0: 14.5, z0: r2(zc), x1: 21.5, z1: r2(zc), deckY: null, opts: { width: 2, arch: 0.25 } }); sign(22.5, zl - 0.6, 'bridge (over water)');
      optionsOf('garland', 'opts.kind').forEach((k, i) => { add({ type: 'garland', x0: 26 + i * 9, z0: r2(zc), x1: 32 + i * 9, z1: r2(zc), opts: { kind: k, sag: 0.5, posts: true, seed: i } }); sign(29 + i * 9, zl - 0.6, `garland · kind ${k}`); });
      fill(54, z + 0.5, 100, zl - 0.5, 'o', '0');              // a pool: the ships, and a falls into it off a stone step
      optionsOf('ship', 'opts.kind').forEach((k, i) => { add({ type: 'ship', x: 62 + i * 12, z: r2(zc + 0.5), rotation: 1.5708, opts: { kind: k, sails: 'set', seed: i } }); sign(62 + i * 12, zl - 0.2, `ship · kind ${k}`); });
      fill(102, z + 0.5, 108, zl - 0.5, 'p', '4'); fill(100, z + 0.5, 102, zl - 0.5, 'o', '0');
      add({ type: 'waterfall', x: 102, z: r2(zc), width: 3, facing: 'W' }); sign(104, zl + 0.2, 'waterfall');
    } else if (R.title === 'The ground') {
      const L = Object.keys(base.legend).filter((c) => c !== ' ');
      const cw = (W - 4) / L.length;
      L.forEach((c, i) => { const t = base.legend[c]; fill(2 + i * cw + 0.5, z + 0.5, 2 + (i + 1) * cw - 0.5, zl - 1, c, t.water ? '0' : '2'); sign(2 + (i + 0.5) * cw, zl - 0.4, `tile '${c}' · ${t.top}${t.water ? ' (water)' : ''}${t.stairs ? ` (stairs ${t.stairs})` : ''}${t.walkable === false && !t.water ? ' (blocked)' : ''}`); });
    } else {
      R.items.forEach((it, i) => {
        const x = r2(R.cell * (i + 0.5) + (W - R.cell * R.items.length) / 2);
        if (it.actor) {
          add({ type: 'npc', x, z: r2(zc), name: names[it.actor] || humanize(it.actor), title: it.actor, preset: /^hero_/.test(it.actor) ? 'traveler' : 'villager', spec: { emberActor: it.actor },
            facing: 'down', behaviour: 'still', wander: 0, speed: 0, portraitColor: '#b8862e', action: 'none', item: '', script: '', dialogue: [it.label] });
          exhibits.push(it.actor);
          return;
        }
        const o = C.createObject(it.type, x, r2(zc - 0.3), it.over);
        if (T[it.type].fields?.some((f) => f.key === 'opts.seed') && o.opts && o.opts.seed === undefined) o.opts.seed = i + 1;
        count[it.type] = (count[it.type] || 0) + 1; o.id = `${it.type}_${count[it.type]}`; objects.push(o);
        sign(x + Math.min(2.6, R.cell / 2 - 0.6), zl - 0.4, it.label);
        exhibits.push(it.label.split('\n')[0]);
      });
    }
    z = zl + LANE;
  }
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) if (i === 0 || j === 0 || i === W - 1 || j === D - 1) { tiles[j][i] = 'T'; heights[j][i] = '2'; }
  const level = {
    ...frame(base, { name: 'The Catalogue', subtitle: 'Every world asset Luminati builds, and Emberfall\'s cast', width: W, depth: D,
      description: 'Each of Luminati\'s object types and kinds (its ObjectCatalog), one exhibit each with a signpost naming it; the tile types; every Emberfall actor. Generated by tools/lumina/levels.mjs.',
      environment: { timeOfDay: 15.5, clock: true, weather: 'clear', border: 'forest', outerScenery: true, godRays: false, dust: false, music: true, camera: null, highGround: null } }),
    spawn: { x: 4, z: 2, facing: 'down' },
    tiles: rows(tiles), heights: rows(heights), objects,
  };
  return { level, stats: { size: `${W} × ${D}`, rows: ROWS.map((r) => `${r.title}: ${r.items.length}`), exhibits: exhibits.length, objects: count } };
}

// ══ the encounter ═════════════════════════════════════════════════════════════════════════════════════════════════
// The hill goblins' door (world doc §3: the Scrag Warren, an old adit under the scree with a horse skull on its cap,
// the spoil heap grassed over): three bands of goblins between the party's camp and the door. The party is the right
// one (GDD §7.1: fighter, rogue, cleric) and the game's size, you and two: your hero the fighter, Wren and a Lantern
// Guild cleric, who join as the level opens
// (Luminati's `party join`) and fight by Luminati's party AI; the player's hero fights by ember/autobattle.js (the Auto
// button) or by hand. Luminati's goblin, archer and shaman are drawn as our skirmisher, archer and hexer (sheets.js).
export async function encounter(base) {
  const W = 56, D = 60;
  const tiles = grid(W, D, 'G'), heights = grid(W, D, '2'), objects = [], count = {};
  const add = (o) => { count[o.type] = (count[o.type] || 0) + 1; objects.push({ id: o.id || `${o.type}_${count[o.type]}`, ...o }); };
  const fill = (x0, z0, x1, z1, ch, h) => { for (let j = Math.max(0, z0); j < Math.min(D, z1); j++) for (let i = Math.max(0, x0); i < Math.min(W, x1); i++) { tiles[j][i] = ch; if (h) heights[j][i] = h; } };
  // the range's foot: a scree wall across the north, the adit's mouth in it; a shelf to the east (a step up)
  fill(0, 0, W, 7, 'x', '9'); fill(25, 4, 31, 7, 'd', '2');
  fill(38, 14, 52, 26, 'm', '3');
  // the scree, the spoil heap and the track up from the camp
  for (let j = 7; j < D; j++) for (let i = 0; i < W; i++) { if (tiles[j][i] !== 'G') continue; const h = hash('e', i, j) % 100; tiles[j][i] = j < 30 ? (h < 45 ? 'd' : h < 70 ? 'm' : 'G') : h < 10 ? 'f' : h < 40 ? 'g' : 'G'; }
  for (let j = 7; j < 52; j++) { const c = Math.round(28 + 3 * Math.sin(j / 6)); fill(c - 1, j, c + 2, j + 1, '.'); }
  fill(18, 24, 30, 32, 'd');
  fill(20, 46, 38, 55, 'g');                                   // the camp's grass
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) if (i === 0 || i === W - 1 || j === D - 1) { tiles[j][i] = 'T'; heights[j][i] = '2'; }
  // the door: the adit's timbers, the horse skull, the spoil
  add({ type: 'debris', x: 28, z: 7.6, rotation: 0, opts: { kind: 'timbers', size: 1.1, charred: false, seed: 4 } });
  add({ type: 'debris', x: 30.6, z: 8.4, rotation: 0.4, opts: { kind: 'bones', size: 0.45, charred: false, seed: 5 } });
  add({ type: 'debris', x: 24.6, z: 8.6, rotation: 0, opts: { kind: 'cart', size: 0.9, charred: false, seed: 6 } });
  add({ type: 'wallTorch', x: 26.2, z: 7.2, rotation: 0, dy: 1.6, opts: { embers: true } });
  for (const [x, z, s] of [[19, 26, 1.3], [22, 25, 0.9], [27, 30, 1.1], [16, 30, 0.8], [36, 12, 1.2], [44, 30, 1], [10, 18, 1.4], [8, 34, 0.9], [48, 40, 1.1], [12, 44, 0.8]]) add({ type: 'rock', x, z, opts: { size: s, seed: x * 7 + z } });
  add({ type: 'crag', x: 6, z: 11, rotation: 0, opts: { kind: 'boulders', stone: 'basalt', height: 3, width: 4, seed: 2 } });
  add({ type: 'crag', x: 50, z: 10, rotation: 0.4, opts: { kind: 'spire', stone: 'basalt', height: 5, width: 3, seed: 3 } });
  for (const [x, z, k] of [[4, 40, 'pine'], [7, 48, 'pine'], [3, 54, 'birch'], [50, 50, 'pine'], [52, 44, 'deadwood'], [47, 56, 'pine'], [14, 52, 'birch'], [10, 26, 'deadwood']]) add({ type: 'tree', x, z, collider: true, opts: { kind: k, height: 4.6, seed: x + z } });
  // the camp
  add({ type: 'campfire', x: 28, z: 50, rotation: 0, opts: { seat: true } });
  add({ type: 'debris', x: 23, z: 48.5, rotation: 0.3, opts: { kind: 'tent', size: 1, charred: false, seed: 7 } });
  add({ type: 'crateStack', x: 34, z: 48, rotation: 0.2, opts: { count: 2, size: 0.8, seed: 8 } });
  add({ id: 'waystone_camp', type: 'waystone', x: 32, z: 53, name: 'The camp' });
  // the party: our heroes, who join as the level opens
  const wren = await inkLines('wren', 'wren_hub', 'flag_met_wren', { joined: 1, in_party: 1, boss_toadking: 1 });
  const guild = JSON.parse(readFileSync(join(ROOT, 'content', 'companions.json'), 'utf8')).ranks.lamp.line;
  const npc = (id, x, name, title, preset, look, dialogue) => add({ id, type: 'npc', x, z: 51.5, name, title, preset, spec: { emberActor: look }, facing: 'up',
    behaviour: 'post', wander: 0.3, speed: 0.8, portraitColor: '#b8862e', action: 'none', item: '', script: '', dialogue });
  npc('wren', 30.5, 'Wren', 'Of Saltmere', 'hunter', 'hero_wren', wren.slice(0, 3));
  npc('guild_cleric', 33.5, 'Guild Cleric', 'The Lantern Guild', 'cleric', 'hero_cleric', [guild]);
  add({ type: 'event', minX: 0, maxX: W, minZ: 0, maxZ: D, on: 'arrive', once: true, background: false,
    run: ['party join wren as ranger hunter', 'party join guild_cleric as cleric support'] });
  // the goblins: the spoil heap's band, the shelf's archers, and the door's own with its hexer
  const foe = (id, kind, x, z, n, level, radius) => add({ id, type: 'enemy', x, z, kind, count: n, radius, level, elite: false, name: '' });
  foe('spoil_goblins', 'goblin', 23.5, 28.5, 4, 4, 2.5);
  foe('shelf_archers', 'archer', 45.5, 19.5, 3, 5, 2);
  foe('door_goblins', 'goblin', 28.5, 12.5, 4, 5, 2.5);
  foe('door_hexer', 'shaman', 31.5, 10.5, 2, 6, 1.4);
  add({ type: 'chest', x: 22.5, z: 9.5, rotation: 0, gold: 30, potions: 1, upgrade: 'none' });
  add({ type: 'region', minX: 0, maxX: W, minZ: 0, maxZ: 38, name: 'The Scrag Warren', sub: 'The Reach', minY: -10, banner: 'The hill goblins\' door' });
  add({ type: 'region', minX: 16, maxX: 40, minZ: 42, maxZ: D, name: 'The camp', sub: 'Below the Scrag Warren', minY: -10, banner: '' });
  const level = {
    ...frame(base, { name: 'The Scrag Warren', subtitle: 'An encounter: Emberfall\'s party against the hill goblins', width: W, depth: D,
      description: 'Wren and a Guild cleric with the player against three bands of goblins at the Scrag Warren\'s door. ?auto=1 (or the Auto button) lets the hero fight by itself. Generated by tools/lumina/levels.mjs.',
      environment: { timeOfDay: 18.2, clock: false, weather: 'clear', border: 'forest', outerScenery: true, godRays: true, dust: true, music: true, combat: true,
        camera: { distance: 24, pitch: 36 }, highGround: null } }),
    spawn: { x: 28, z: 53, facing: 'up' },
    tiles: rows(tiles), heights: rows(heights), objects,
  };
  return { level, stats: { size: `${W} × ${D}`, objects: count, party: ['wren', 'guild_cleric'] } };
}

// ══ the dungeon ═══════════════════════════════════════════════════════════════════════════════════════════════════
// The Old Barrows (world doc §3.1, v1.32–33), the Vale's crypt, one floor of each of its three, top to bottom:
//   · the Barrow Mouth: the Redhand's dig at the door, their spoil and their camp; Tobin Hask, Thornwick's sexton, on a
//     coffin-lid with his lantern and his book (his lines from his Ink); his lantern is the waystone the party wakes at
//     when it falls (Luminati's death and respawn), and rests at (a rest brings every foe back);
//   · the Long Gallery: burial niches, a skull in each, the families' candles still burning; the Ashbound in rows;
//   · the Muster Hall: the Third Legion's stores and racks, and the Quartermaster, who still issues (ember/issue.js:
//     every 10 s of a fight the most broken of his ranks stands up whole; put him down and the dead stay down).
// Its foes are Luminati's goblin, archer and shaman drawn as our Ashbound (each group's `emberActor`: sheets.js
// enemySheetFor) and named as content/foes.json names them. The party: your hero, Wren and a Guild cleric, as the encounter's.
export async function barrows(base) {
  const W = 48, D = 72;
  const tiles = grid(W, D, 'x'), heights = grid(W, D, '6'), objects = [], count = {};
  const add = (o) => { count[o.type] = (count[o.type] || 0) + 1; objects.push({ id: o.id || `${o.type}_${count[o.type]}`, ...o }); };
  const carve = (x0, z0, x1, z1, ch = 'k') => { for (let j = z0; j < z1; j++) for (let i = x0; i < x1; i++) { tiles[j][i] = ch; heights[j][i] = '2'; } };
  // the floors: the mouth (the Redhand's dirt), the steps down, the gallery and its niches, the passage, the hall
  carve(15, 58, 33, 70, 'd'); carve(22, 58, 26, 70, 'k');
  carve(21, 47, 27, 58);
  carve(4, 34, 44, 47);
  for (let x = 6; x < 42; x += 5) { carve(x, 32, x + 2, 34); if (x < 19 || x > 27) carve(x, 47, x + 2, 49); }
  carve(36, 22, 42, 34);
  carve(8, 4, 44, 22);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) if (tiles[j][i] === 'k' && hash('b', i, j) % 100 < 14) tiles[j][i] = 'm';
  // ── the Barrow Mouth ──
  const tobin = [...await inkLines('tobin', 'tobin_hub', 'flag_met_tobin'), ...await inkLines('tobin', 'tobin_floors', null)].slice(0, 6);
  add({ id: 'tobin_hask', type: 'npc', x: 18.5, z: 61.5, name: 'Tobin Hask', title: 'Sexton, Thornwick', preset: 'elder', spec: { emberActor: 'npc_tobin' }, facing: 'right',
    behaviour: 'post', wander: 0, speed: 0.6, portraitColor: '#b8862e', action: 'none', item: '', script: '', dialogue: tobin });
  add({ id: 'waystone_mouth', type: 'waystone', x: 23, z: 62.6, name: 'Tobin\'s lantern' });
  add({ type: 'campfire', x: 29, z: 66, rotation: 0, opts: { seat: true } });
  add({ type: 'debris', x: 31, z: 61, rotation: 0.3, opts: { kind: 'tent', size: 0.9, charred: false, seed: 11 } });
  add({ type: 'debris', x: 17, z: 67.5, rotation: 0, opts: { kind: 'rubble', size: 1.1, charred: false, seed: 12 } });
  add({ type: 'debris', x: 31.5, z: 68, rotation: 0.6, opts: { kind: 'cart', size: 0.8, charred: false, seed: 13 } });
  add({ type: 'debris', x: 16.5, z: 59.5, rotation: 0, opts: { kind: 'timbers', size: 0.9, charred: false, seed: 14 } });
  add({ type: 'crateStack', x: 28.5, z: 59.5, rotation: 0.2, opts: { count: 2, size: 0.8, seed: 15 } });
  add({ type: 'wallTorch', x: 21.2, z: 57.6, rotation: 0, dy: 1.4, opts: { embers: true } });
  add({ type: 'wallTorch', x: 26.8, z: 57.6, rotation: 0, dy: 1.4, opts: { embers: true } });
  const wren = await inkLines('wren', 'wren_hub', 'flag_met_wren', { joined: 1, in_party: 1, boss_toadking: 1 });
  const guild = JSON.parse(readFileSync(join(ROOT, 'content', 'companions.json'), 'utf8')).ranks.lamp.line;
  const npc = (id, x, name, title, preset, look, dialogue) => add({ id, type: 'npc', x, z: 66.5, name, title, preset, spec: { emberActor: look }, facing: 'up',
    behaviour: 'post', wander: 0.3, speed: 0.8, portraitColor: '#b8862e', action: 'none', item: '', script: '', dialogue });
  npc('wren', 25.5, 'Wren', 'Of Saltmere', 'hunter', 'hero_wren', wren.slice(0, 3));
  npc('guild_cleric', 27.5, 'Guild Cleric', 'The Lantern Guild', 'cleric', 'hero_cleric', [guild]);
  add({ type: 'event', minX: 0, maxX: W, minZ: 0, maxZ: D, on: 'arrive', once: true, background: false,
    run: ['party join wren as ranger hunter', 'party join guild_cleric as cleric support'] });
  // ── the Long Gallery: a skull in each niche, the families' candles ──
  for (let x = 6, k = 0; x < 42; x += 5, k++) {
    add({ type: 'debris', x: x + 1, z: 32.8, rotation: 0, opts: { kind: 'bones', size: 0.35, charred: false, seed: 20 + k } });
    if (k % 2 === 0) add({ type: 'monument', x: x + 1, z: 33.6, opts: { kind: 'lantern', fire: 'warm', lit: true, seed: 30 + k } });
  }
  // torches down the gallery, the passage and the hall (more than 12 lamps: a level this deep shares Luminati's 12 by
  // distance, LightPool)
  for (const [x, z] of [[9, 33.6], [19, 33.6], [29, 33.6], [39, 33.6], [5, 40.5], [43.4, 40.5], [36.4, 27], [41.6, 27], [9, 4.4], [43.4, 14]]) add({ type: 'wallTorch', x, z, rotation: 0, dy: 1.4, opts: { embers: true } });
  // ── the Muster Hall: the stores, the racks, the braziers ──
  for (const [x, k] of [[14, 'rack'], [20, 'rack'], [26, 'rack'], [32, 'rack']]) add({ type: 'smithy', x, z: 5.2, rotation: 0, opts: { kind: k, seed: x } });
  add({ type: 'crateStack', x: 38, z: 6, rotation: 0.1, opts: { count: 3, size: 0.9, seed: 41 } });
  add({ type: 'sacks', x: 41, z: 8, rotation: 0, opts: { count: 4, seed: 42 } });
  add({ type: 'barrel', x: 10, z: 6, rotation: 0, opts: { height: 1, lying: false } });
  add({ type: 'barrel', x: 11, z: 7.2, rotation: 0.5, opts: { height: 1, lying: true } });
  for (const [x, z] of [[12, 10], [40, 10], [12, 19], [40, 19]]) add({ type: 'fire', x, z, opts: { kind: 'brazier', size: 1, smoke: false, light: true, seed: x + z } });
  add({ type: 'chest', x: 26, z: 5.5, rotation: 0, gold: 60, potions: 1, upgrade: 'attack' });
  // ── the Ashbound (content/foes.json names), and the Quartermaster ──
  const foe = (id, kind, x, z, n, level, radius, actor, name, extra = {}) => add({ id, type: 'enemy', x, z, kind, count: n, radius, level, elite: false, name, emberActor: actor, emberIssued: true, ...extra });
  foe('gallery_minions', 'goblin', 12.5, 40.5, 3, 1, 2.2, 'skeleton_minion', 'Ashbound minion');
  foe('gallery_warriors', 'goblin', 24.5, 39.5, 4, 2, 2.6, 'skeleton_warrior', 'Ashbound warrior');
  foe('gallery_rogues', 'archer', 36.5, 38.5, 2, 2, 1.8, 'skeleton_rogue', 'Ashbound rogue');
  foe('hall_warriors', 'goblin', 24.5, 14.5, 3, 3, 2.6, 'skeleton_warrior', 'Ashbound warrior');
  foe('hall_mages', 'shaman', 18.5, 9.5, 2, 3, 2, 'skeleton_mage', 'Ashbound mage');
  foe('quartermaster', 'goblin', 26, 9, 1, 4, 1, 'boss_quartermaster', 'The Quartermaster', { elite: true, emberIssued: false, emberIssues: true, spotOffsets: [[0, 0]] });
  add({ type: 'region', minX: 14, maxX: 34, minZ: 56, maxZ: 71, name: 'The Barrow Mouth', sub: 'The Old Barrows', minY: -10, banner: '' });
  add({ type: 'region', minX: 3, maxX: 45, minZ: 31, maxZ: 50, name: 'The Long Gallery', sub: 'The Old Barrows', minY: -10, banner: '' });
  add({ type: 'region', minX: 7, maxX: 45, minZ: 3, maxZ: 23, name: 'The Muster Hall', sub: 'The Old Barrows', minY: -10, banner: 'He still issues.' });
  const level = {
    ...frame(base, { name: 'The Old Barrows', subtitle: 'A dungeon: the Ashbound, and the Quartermaster who still issues', width: W, depth: D,
      description: 'The Vale\'s crypt in three parts: the Barrow Mouth (Tobin Hask and his lantern, the waystone), the Long Gallery and the Muster Hall. While the Quartermaster stands, the most broken of his ranks stand up again. Generated by tools/lumina/levels.mjs.',
      // (no sky under the ground: a fixed hour, as Luminati's own rooms have one; a late, warm one, lit by the torches)
      environment: { timeOfDay: 19.4, clock: false, weather: 'clear', border: 'none', outerScenery: false, godRays: false, dust: false, music: true, combat: true, interior: true,
        camera: { distance: 26, pitch: 34 }, highGround: null } }),
    spawn: { x: 24, z: 64, facing: 'up' },
    tiles: rows(tiles), heights: rows(heights), objects,
  };
  return { level, stats: { size: `${W} × ${D}`, objects: count, foes: objects.filter((o) => o.type === 'enemy').reduce((n, o) => n + o.count, 0), tobin: tobin.length } };
}

// standalone: what each level holds
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const LUM = join(dirname(fileURLToPath(import.meta.url)), '.work', 'luminati');
  const base = JSON.parse(readFileSync(join(LUM, 'public', 'levels', 'sample-hamlet.json'), 'utf8'));
  const all = { thornwick, catalogue, encounter, barrows };
  for (const id of process.argv[2] ? [process.argv[2]] : Object.keys(all)) console.log(id, JSON.stringify((await all[id](base, LUM)).stats, null, 1));
}
