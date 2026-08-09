// iso.js — single source of isometric geometry truth. Pure math, zero DOM,
// node-testable. 2:1 dimetric diamonds. Everything that projects world↔screen
// goes through here so the renderer and input layer can never disagree.

export const TW = 16, TH = 8;          // tile diamond footprint, native px (2:1)
export const HW = TW / 2, HH = TH / 2; // 8, 4 — half extents
export const ZH = 6;                   // px lifted per height level
// The tile top diamond's per-row widths (single source of truth for masking,
// edge detection, and cliff-face attachment — see Dreadforge TDD §3).
export const ROWW = [4, 8, 12, 16, 16, 12, 8, 4];

// World tile (x, y, h) → screen offset of the diamond's top vertex (pre-camera).
// A tile's ground point (where props/actors stand) is project(x+0.5, y+0.5, h).
export function project(x, y, h = 0) {
  return { sx: (x - y) * HW, sy: (x + y) * HH - h * ZH };
}

// Inverse of project() for a GIVEN height h: screen offset → float world coords.
// floor() the result to get the tile. Exact inverse of project (round-trips).
export function unproject(sx, sy, h = 0) {
  const a = sx / HW;              // = x - y
  const b = (sy + h * ZH) / HH;   // = x + y
  return { x: (a + b) / 2, y: (b - a) / 2 };
}

// Screen drag vector → world move direction (unnormalized). Dragging screen
// down-right walks toward +x/+y (front), which is what a thumb expects in iso.
export function screenDirToWorld(sx, sy) {
  return { x: sx / HW + sy / HH, y: sy / HH - sx / HW };
}

// Resolve a screen-offset tap to a tile: try heights high→low, first whose
// landed tile actually sits at that height wins; then snap to a nearby resource
// (fat-finger help — diamonds are small under a thumb). Callbacks injected so
// this stays pure. heightAt(tx,ty)→int, hasResource(tx,ty)→bool.
export function resolveTap(sx, sy, { heightAt, hasResource, heights = [2, 1, 0], snap = 0.75 }) {
  let landed = null;
  for (const h of heights) {
    const w = unproject(sx, sy, h);
    const tx = Math.floor(w.x), ty = Math.floor(w.y);
    if (!landed) landed = { tx, ty, wx: w.x, wy: w.y };
    if (heightAt(tx, ty) === h) { landed = { tx, ty, wx: w.x, wy: w.y }; break; }
  }
  if (hasResource(landed.tx, landed.ty)) return { tx: landed.tx, ty: landed.ty };
  let best = null, bd = snap * snap;
  for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
    const nx = landed.tx + ox, ny = landed.ty + oy;
    if (!hasResource(nx, ny)) continue;
    const dx = (nx + 0.5) - landed.wx, dy = (ny + 0.5) - landed.wy, d = dx * dx + dy * dy;
    if (d < bd) { bd = d; best = { tx: nx, ty: ny }; }
  }
  return best || { tx: landed.tx, ty: landed.ty };
}
