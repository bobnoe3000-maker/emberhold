// travel.js — compass destinations (docs/compass-mockup.html). A short, context-sensitive
// list of places the party can auto-walk to, built on demand from the world. Every entry
// carries its path length in steps (from the same pathfinder as tap-to-move); places that
// can't be reached are left out, and ones not found yet come back greyed (`off`).
//
//   dungeon  — (in a fight) step out · next unexplored room · room at your level · unopened chest /
//              shrine · stairs down (greyed until found) · stairs up (the first floor's: out to the surface)
//   overland — the region's town · every site you can go into (site:<id>, nearest first; a hidden one only
//              once revealed) · landmarks
//   town     — town square (not while you're in it) · nearest dungeon (by the road out) · road out
//
// A row with `journey` walks on past the scene change it ends in (core.js): the nearest dungeon
// ('delve') and the stairs down go on to the next unexplored room; the tracked quest's row
// ('quest', quests.js) follows the quest.
// Pure: it reads the world and state, never writes them. core.js turns a pick into a walk.

import { findPath } from './path.js';
import { heightAt, isWalkable } from './world.js';
import { hypot } from './detmath.js';
import { SITES, siteOpen, levelBand } from './sites.js';


export function listDestinations({ world, state, standable, heroLevel, sitesEntered, inSquare, battleRoom = -1 }) {
  // standable() probes five points with climb checks; every row prices many tiles, so cache by
  // (tile, height stepped up from)
  const memo = new Map(), raw = standable;
  standable = (x, y, fx, fy) => {
    const k = ((x + 4096) * 8192 + (y + 4096)) * 16 + (heightAt(world, fx, fy) & 15);
    let v = memo.get(k); if (v === undefined) { v = raw(x, y, fx, fy); memo.set(k, v); } return v;
  };
  const p = state.player, out = [];
  const px = Math.floor(p.x), py = Math.floor(p.y);
  const straight = (t) => hypot(t.tx + 0.5 - p.x, t.ty + 0.5 - p.y);
  const pathLen = (tx, ty, near = 0) => { const path = findPath(p.x, p.y, tx, ty, standable, { near, maxNodes: 80000 }); return path ? path.length - 1 : null; };
  // nearest standable tile to (x, y), for aiming at the middle of a room or a zone
  const standOn = (x, y, r = 8) => {
    x = Math.floor(x); y = Math.floor(y);
    for (let d = 0; d <= r; d++) for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++)
      if (Math.max(Math.abs(dx), Math.abs(dy)) === d && standable(x + dx, y + dy, x + dx, y + dy)) return { tx: x + dx, ty: y + dy };
    return null;
  };

  if (world.kind === 'dungeon') {
    // one distance field from the hero (8-way, no corner cutting) prices every candidate at
    // once — pathing each room separately cost ~0.7 s when some weren't reachable
    const field = new Map(), K = (x, y) => x * 4096 + y, q = [[px, py]]; field.set(K(px, py), 0);
    // centre probe, cached on the world (tiles don't change but for looted props, which only open
    // tiles up): a step estimate — the walk itself uses the full radius + climb check
    const wc = world._openCache || (world._openCache = new Map());
    const open = (a, b) => { const k = K(a, b); let v = wc.get(k); if (v === undefined) { v = isWalkable(world, a + 0.5, b + 0.5); wc.set(k, v); } return v; };
    for (let h = 0; h < q.length; h++) {
      const [x, y] = q[h], d = field.get(K(x, y));
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue; const nx = x + dx, ny = y + dy, nk = K(nx, ny);

        if (field.has(nk) || !open(nx, ny)) continue;
        if (dx && dy && (!open(x + dx, y) || !open(x, y + dy))) continue;
        field.set(nk, d + 1); q.push([nx, ny]);
      }
    }
    const reachAt = (tx, ty, near) => { let b = null; for (let dy = -near; dy <= near; dy++) for (let dx = -near; dx <= near; dx++) { const v = field.get(K(tx + dx, ty + dy)); if (v !== undefined && (b === null || v < b)) b = v; } return b; };
    const pathLenD = (tx, ty, near = 0) => reachAt(tx, ty, Math.max(near, 0));
    const nearestD = (cands, near = 0) => { let best = null; for (const c of cands) { const steps = pathLenD(c.tx, c.ty, c.near ?? near); if (steps !== null && (!best || steps < best.steps)) best = { ...c, steps }; } return best; };
    const L = world.level, lv = world.roomLevels || new Map(), visited = world.visited || new Set();
    const cellAt = (x, y) => L.cells.get(x + ',' + y);
    const here = cellAt(px, py), hereRoom = here && here.kind === 'floor' ? here.room : -1;
    const roomTarget = (r) => { const t = standOn(r.cx, r.cy, 10); return t && { ...t, room: r }; };
    const fighting = L.rooms.filter((r) => r !== L.entrance && r.id !== hereRoom);

    // in a fight: the nearest way out, a corridor tile just past one of its doorways (the fight ends
    // there and corridors restore you at 5×; GDD §7.1: a visit ends when you walk out or the room wins)
    if (battleRoom >= 0) {
      const doors = [];
      for (const [k, c] of L.cells) {
        if (c.kind !== 'floor' || c.room >= 0) continue;
        const [x, y] = k.split(',').map(Number);
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const n = cellAt(x + dx, y + dy); return n && n.kind === 'floor' && n.room === battleRoom; })) doors.push({ tx: x, ty: y });
      }
      const exit = nearestD(doors);
      if (exit) out.push({ id: 'step-out', icon: 'exit', label: 'Step out', sub: `to the corridor · ${exit.steps} steps`, tx: exit.tx, ty: exit.ty, near: 0, steps: exit.steps });
    }

    const next = nearestD(fighting.filter((r) => !visited.has(r.id)).map(roomTarget).filter(Boolean));
    if (next) out.push({ id: 'next-room', icon: 'next', label: 'Next room', sub: `unexplored · ${next.steps} steps`, level: lv.get(next.room.id), tx: next.tx, ty: next.ty, near: 1, room: next.room.id, steps: next.steps });

    const safe = fighting.filter((r) => (lv.get(r.id) || 1) <= heroLevel && (!next || r !== next.room || fighting.filter((q) => (lv.get(q.id) || 1) <= heroLevel).length === 1));
    const topLv = Math.max(0, ...safe.map((r) => lv.get(r.id) || 1));
    const farmPick = nearestD(safe.filter((r) => (lv.get(r.id) || 1) === topLv).map(roomTarget).filter(Boolean));
    const farm = farmPick && (!next || farmPick.room !== next.room) ? farmPick : null;
    if (farm) out.push({ id: 'farm-room', icon: 'farm', label: 'Room at your level', sub: `farm it safely · ${farm.steps} steps`, level: lv.get(farm.room.id), tx: farm.tx, ty: farm.ty, near: 1, room: farm.room.id, steps: farm.steps });

    const loot = [];
    for (const [k, kind] of world.props) {
      if (kind !== 'chest' && kind !== 'shrine') continue;
      if (world.mods.get(k)?.opened) continue;
      const [x, y] = k.split(',').map(Number), c = cellAt(x, y);
      if (c && c.room >= 0 && world.discovered.has(c.room)) loot.push({ tx: x, ty: y, kind, near: 1 });
    }
    const chest = nearestD(loot);
    if (chest) out.push({ id: 'loot', icon: chest.kind, label: chest.kind === 'chest' ? 'Unopened chest' : 'Unused shrine', sub: `seen · ${chest.steps} steps`, tx: chest.tx, ty: chest.ty, near: 1, then: { type: 'harvest', tx: chest.tx, ty: chest.ty }, steps: chest.steps });

    const dr = L.descentRoom, dlv = dr && lv.get(dr.id);
    if (dr && world.discovered.has(dr.id)) {
      // the nearest tile beside the stairwell (any side: it's used from anywhere on its rim), then use it
      const at = world.stairsAt || { x: dr.cx, y: dr.cy }, S = world.stairwell, rim = [];
      if (S) for (let y = S.y0 - 1; y <= S.y1; y++) for (let x = S.x0 - 1; x <= S.x1; x++) {
        if (x >= S.x0 && x < S.x1 && y >= S.y0 && y < S.y1) continue;
        rim.push({ tx: x, ty: y, near: 0, use: [Math.max(S.x0, Math.min(S.x1 - 1, x)), Math.max(S.y0, Math.min(S.y1 - 1, y))] });
      }
      const best = S ? nearestD(rim) : null, steps = S ? best && best.steps : pathLenD(at.x, at.y, 1);
      const [ux, uy] = best ? best.use : [at.x, at.y];
      if (steps !== null && steps !== undefined) out.push({ id: 'stairs-down', icon: 'down', label: 'Stairs down', sub: `to depth ${(world.depth || 0) + 2} · ${steps} steps`, level: dlv, tx: best ? best.tx : at.x, ty: best ? best.ty : at.y, near: best ? 0 : 1, then: { type: 'harvest', tx: ux, ty: uy }, steps, journey: 'delve' });
    } else if (dr) out.push({ id: 'stairs-down', icon: 'down', label: 'Stairs down', sub: 'not found yet', level: dlv, off: true });

    if (world.exitAt) {
      const t = standOn(world.exitAt.x, world.exitAt.y, 3), steps = t && pathLenD(t.tx, t.ty);
      const top = !world.depth;                             // the first floor's stair leads out; deeper ones climb one floor
      if (steps !== null && steps !== undefined) out.push({ id: 'exit', icon: 'exit', label: top ? 'Exit to the Hollow Vale' : 'Stairs up', sub: top ? `stair up · ${steps} steps` : `to depth ${world.depth} · ${steps} steps`, tx: t.tx, ty: t.ty, near: 0, steps, sep: true });
    }
    return out;
  }

  const zone = (e) => standOn((e.x0 + e.x1) / 2, (e.y0 + e.y1) / 2, 6);
  if (world.kind === 'town') {
    const h = world.hub;
    if (h && !inSquare) { const t = standOn(h.x, h.y, 6), steps = t && pathLen(t.tx, t.ty); if (steps != null) out.push({ id: 'square', icon: 'square', label: 'Town square', sub: `the five services · ${steps} steps`, tx: t.tx, ty: t.ty, near: 0, steps }); }
    for (const e of world.exits) {
      const t = zone(e), steps = t && pathLen(t.tx, t.ty); if (steps == null) continue;
      out.push({ id: 'to-dungeon', icon: 'dungeon', label: 'Nearest dungeon', sub: `by the road out · ${steps}+ steps`, chip: 'Nearest dungeon', tx: t.tx, ty: t.ty, near: 0, steps, journey: 'delve' });
      out.push({ id: 'road-out', icon: 'next', label: 'Road out', sub: `to the Hollow Vale · ${steps} steps`, tx: t.tx, ty: t.ty, near: 0, steps });
    }
    return out;
  }

  // overland: the town, every site you can go into (nearest first), landmarks
  const labelNear = (x, y) => (world.labels || []).reduce((b, l) => { const d = hypot(l.x - x, l.y - y); return d < (b ? b.d : 30) ? { l, d } : b; }, null);
  const sites = [];
  for (const e of world.exits) {
    const t = zone(e); if (!t) continue;
    if (e.to === 'town') { const lab = labelNear((e.x0 + e.x1) / 2, (e.y0 + e.y1) / 2), steps = pathLen(t.tx, t.ty); if (steps != null) out.push({ id: 'town', icon: 'town', label: lab ? lab.l.text : 'Town', sub: `town · ${steps} steps`, tx: t.tx, ty: t.ty, near: 0, steps }); }
    else if (e.to === 'dungeon' && SITES[e.site] && siteOpen(e.site, state.revealed || [])) { const steps = pathLen(t.tx, t.ty); if (steps != null) sites.push({ ...t, site: e.site, steps }); }
  }
  for (const d of sites.sort((a, b) => a.steps - b.steps)) {
    const fresh = !sitesEntered.has(d.site);
    out.push({ id: 'site:' + d.site, site: d.site, icon: fresh ? 'unexplored' : 'dungeon', label: SITES[d.site].name, sub: `${fresh ? 'never entered' : 'dungeon'} · ${d.steps} steps`, levelRange: levelBand(d.site), tx: d.tx, ty: d.ty, near: 0, steps: d.steps, journey: 'delve' });
  }
  const used = new Set(out.map((o) => o.label).concat(Object.values(SITES).map((q) => q.name)));
  const marks = (world.labels || []).filter((l) => !used.has(l.text) && !l.service).map((l) => ({ ...(standOn(l.x, l.y + 8, 10) || {}), name: l.text, near: 3 })).filter((m) => m.tx !== undefined);
  for (const m of marks.sort((a, b) => straight(a) - straight(b)).slice(0, 3)) {
    const steps = pathLen(m.tx, m.ty, 3); if (steps != null) out.push({ id: 'mark:' + m.name, icon: 'landmark', label: m.name, sub: `landmark · ${steps} steps`, tx: m.tx, ty: m.ty, near: 3, steps });
  }
  return out;
}
