// room.js — the dungeon kit spike's room (docs/dungeon-kit-proposal.md §4), shared by tools/kit/spike-room.html and
// tools/actor-lab/kit-cast.html (§9, our cast in it): 24 × 20 kit units of KayKit Dungeon Remastered (CC0), tall walls on
// the far sides (cells behind gates on the north, a doorway and a breach on the west), a balustrade on the near ones,
// dressed by the grammar (tall at the back, low near, the middle open) and lit as a dusky room. Seeded, so every page
// and every shot builds the same room. Returns the camera for Emberfall's view and the lights that cast shadows.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** @param {THREE.Scene} S @param {{ kit: string, plain?: boolean, stand?: boolean, actors?: string }} o (kit: the pieces' folder; stand: the KayKit Knight and Skeleton for scale, from `actors`) */
export async function buildRoom(S, o) {
  const L = new GLTFLoader(), cache = {};
  const get = async (n) => {
    if (!cache[n]) { const ext = n === 'chest' || n === 'wall_doorway' ? '.glb' : '.gltf.glb'; const path = /^(Knight|Skeleton_Warrior)$/.test(n) ? `${o.actors}${n}.glb` : o.kit + n + ext; cache[n] = (await L.loadAsync(path)).scene; }
    return cache[n];
  };
  const put = async (n, x, z, ry = 0, y = 0) => {
    const m = (await get(n)).clone(true); m.position.set(x, y, z); m.rotation.y = ry;
    m.traverse((c) => { if (/** @type {any} */ (c).isMesh) { c.castShadow = true; c.receiveShadow = true; } }); S.add(m); return m;
  };
  let seed = 7; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const RW = 24, RD = 20, HP = Math.PI / 2, PLAIN = !!o.plain;
  // the floor: large slabs, here and there four small ones (broken, weeds, carved)
  for (let i = 0; i < RW / 4; i++) for (let j = 0; j < RD / 4; j++) {
    const x = 2 + i * 4, z = 2 + j * 4, r = rnd();
    if (PLAIN) { await put('floor_tile_large', x, z); continue; }
    if (r < 0.28) { const sm = ['floor_tile_small', 'floor_tile_small_broken_A', 'floor_tile_small_broken_B', 'floor_tile_small_weeds_A', 'floor_tile_small_decorated', 'floor_tile_small'];
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) await put(sm[Math.floor(rnd() * sm.length)], x + dx, z + dz, Math.floor(rnd() * 4) * HP); }
    else await put(r < 0.4 ? 'floor_tile_large_rocks' : 'floor_tile_large', x, z, Math.floor(rnd() * 4) * HP);
  }
  const north = PLAIN ? ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'] : ['wall', 'wall_gated', 'wall_cracked', 'wall_pillar', 'wall_gated', 'wall'];
  for (let i = 0; i < 6; i++) await put(north[i], 2 + i * 4, 0);
  const west = PLAIN ? ['wall', 'wall', 'wall', 'wall', 'wall'] : ['wall', 'wall_doorway', 'wall', 'wall_broken', 'wall_cracked'];
  for (let j = 0; j < 5; j++) await put(west[j], 0, 2 + j * 4, HP);
  await put('pillar', 0, 0); await put('pillar', RW, 0); await put('pillar', 0, RD);
  for (let i = 0; i < 6; i++) await put(i % 2 ? 'barrier_column' : 'barrier', 2 + i * 4, RD);
  for (let j = 0; j < 5; j++) await put(j % 2 ? 'barrier_column' : 'barrier', RW, 2 + j * 4, HP);
  await put('barrier_corner', RW, RD, Math.PI);
  /** @type {THREE.PointLight[]} */ const lights = [];
  const torch = (x, y, z, s = 1) => { const l = new THREE.PointLight(0xff9a4a, 26 * s, 15, 1.6); l.position.set(x, y, z); S.add(l); lights.push(l); return l; };
  torch(10, 3.1, 1.3); torch(22, 3.1, 1.3); torch(1.3, 3.1, 10);
  if (!PLAIN) {
    for (const cx of [6, 18]) { await put('floor_tile_large', cx, -4); const c = new THREE.PointLight(0x58c8ff, 30, 9, 1.6); c.position.set(cx, 2.4, -3.2); S.add(c); }
    if (o.stand) await put('Skeleton_Warrior', 6.4, -3.6, 0.4);
    await put('torch_mounted', 10, 0.5, 0, 2.3); await put('torch_mounted', 22, 0.5, 0, 2.3); await put('torch_mounted', 0.5, 10, HP, 2.3);
    await put('banner_patternA_red', 14, 0.55, 0, 0);
    await put('barrel_large', 2.4, 2.6); await put('barrel_small_stack', 4.6, 1.8, 0.6); await put('keg', 2, 5, 1.2);
    await put('crates_stacked', 21.5, 2.2, 0.3); await put('box_stacked', 19.4, 1.6, -0.4);
    await put('rubble_large', 2.4, 14.6, 0.8); await put('rubble_half', 3.6, 17.2, 2.1); await put('rubble_half', 1.6, 12.4, 0.2);
    await put('shelf_small_candles', 0.6, 18, HP, 0); torch(1.6, 2, 18, 0.35);
    await put('pillar_decorated', 8, 9); await put('pillar_decorated', 16, 9);
    await put('candle_triple', 9.4, 10.2); torch(9.4, 1.0, 10.2, 0.25);
    await put('table_medium_broken', 20.5, 12.5, 0.5); await put('sword_shield_broken', 19, 14.5, 1.1);
    await put('chest', 21.8, 6.4, -HP);
  }
  if (o.stand) { await put('Knight', 11, 13.2, -2.4); await put('Skeleton_Warrior', 13.4, 10.6, 0.75); }
  // the cool fill: a moonlit shaft from above the camera's left, the only light whose shadows cover the room
  S.add(new THREE.HemisphereLight(0x5a6c94, 0x1c140e, 0.55));
  const D = new THREE.DirectionalLight(0x8aa0d0, 0.9); D.position.set(20, 30, 26); D.target.position.set(12, 0, 10); S.add(D, D.target);
  D.castShadow = true; D.shadow.mapSize.set(2048, 2048); Object.assign(D.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 90 }); D.shadow.bias = -0.0008; D.shadow.normalBias = 0.03;
  for (const l of lights.slice(0, 3)) { l.castShadow = true; l.shadow.mapSize.set(512, 512); l.shadow.bias = -0.002; }
  return { lights };
}

/** Emberfall's camera: yaw 45°, `pitch` degrees down, orthographic, `viewH` world units tall on a W × H canvas, looking at `target` */
export function emberCamera(W, H, viewH, pitch, target) {
  const yaw = Math.PI / 4, p = pitch * Math.PI / 180, viewW = viewH * W / H;
  const C = new THREE.OrthographicCamera(-viewW / 2, viewW / 2, viewH / 2, -viewH / 2, 0.1, 400);
  C.position.set(target.x + 80 * Math.sin(yaw) * Math.cos(p), 80 * Math.sin(p), target.z + 80 * Math.cos(yaw) * Math.cos(p)); C.lookAt(target);
  return C;
}
