// view.js — the main game's view in Luminati's world (docs/lumina-prototype.md §6): Emberfall's camera and Emberfall's
// eight facings.
//
// Emberfall is 2:1 isometric (src/render/iso.js): its diamonds and its actors (tools/actor-lab: an orthographic camera
// at 30° pitch and 45° yaw) are seen from the south-east, a world axis running down-right and the other down-left.
// Luminati's camera looks north (yaw 0, from +Z), through a 28° lens. With the view 'ember' (the default; ?view=
// luminati for theirs) the camera takes ours:
//   · yaw 45°: screen right is world +X −Z and screen down +X +Z, as iso.js projects our x and y (Thornwick is laid out
//     on X = our x, Z = our y: levels.mjs), so the town sits on the screen as it does in the game;
//   · pitch 30°, the bake's;
//   · a 14° lens: near-orthographic, as our bake is, at the distance that frames a figure as the game does on a phone.
// Luminati's walk follows the camera (CameraRig.getMoveBasis), so the stick stays screen-true; Q / E still turn it.
// The build passes the framing into the game (vite.config.mjs tags Game.js: __emberView.camera, the yaw).
//
// The facings: our atlases have a row for each screen octant (0 E, 1 SE, 2 S, 3 SW, 4 W, 5 NW, 6 N, 7 NE), Luminati's
// sheets four (down, left, right, up), chosen by every system it has (Sprite3D.directionFromVector: screen right and
// down at the camera's yaw). The four stay Luminati's state; when one of our sheets (its texture marked `emberOctants`)
// shows a frame, the row drawn is the
// octant of the sprite's heading on the ground since its last frame, measured as the game measures it (render/
// anim.js: screen right and down on the ground plane, hysteresis 0.62 of an octant), kept within the quarter of
// Luminati's own facing (a turn to talk or to swing wins). A sprite standing keeps its octant. In both views.
import { Sprite3D } from '../src/engine/sprite/Sprite3D.js';
import { globalUniforms } from '../src/engine/render/GlobalUniforms.js';

const params = new URLSearchParams(location.search);
/** the view: Emberfall's camera ('ember', the default) or Luminati's own */
export const VIEW = params.get('view') === 'luminati' ? 'luminati' : 'ember';
/** Emberfall's camera, in Luminati's framing terms (degrees) */
export const EMBER_CAMERA = Object.freeze({ yaw: 45, pitch: 30, fov: 14 });
// The distance that frames as the game does: on a phone a figure stands a 16th of the screen's height in Thornwick's
// square (52 of 844 CSS px, measured), and ours are 1.75 units tall, seen a cos(pitch) shorter. A three.js lens is
// vertical, so the share holds at any width. Luminati's levels set their own distance against its default (30): kept as a
// ratio, so a level framed closer stays closer.
const SHARE = 1 / 16, FIGURE = 1.75, LUMINATI_DISTANCE = 30;
const D = (FIGURE * Math.cos(EMBER_CAMERA.pitch * Math.PI / 180)) / (SHARE * 2 * Math.tan((EMBER_CAMERA.fov / 2) * Math.PI / 180));   // ≈ 99

/** what Game._applyLevel spreads over its camera: our yaw, pitch and lens, the level's distances at our framing */
function camera(framing) {
  if (VIEW !== 'ember') return {};
  const k = D / LUMINATI_DISTANCE;
  return { yaw: EMBER_CAMERA.yaw, pitch: EMBER_CAMERA.pitch, fov: EMBER_CAMERA.fov, distance: framing.distance * k,
    minDistance: framing.minDistance * k, maxDistance: framing.maxDistance * k };
}
// Our game has no depth of field: every tile is as sharp as the hero's. Luminati's diorama blurs outside a band 30 % of
// the screen tall (its tilt-shift) and 6 units of depth round the focus. The near-orthographic view spans two to three
// times that depth on the screen, so in Emberfall's view the band is most of the screen and the depth 16: the square
// sharp, the far roofs and the near hedges softened a little (Game._tunePost, tagged).
function post(S) {
  if (VIEW !== 'ember') return;
  Object.assign(S.dof, { focusRange: 16, tiltShift: 0.14, tiltWidth: 0.62 });
}
Object.assign(globalThis, { __emberView: { name: VIEW, camera, post, distance: D } });

// ── the eight facings ──────────────────────────────────────────────────────────────────────────────────────────────
// Luminati's four, by its row index (constants.js DIRECTIONS: down, left, right, up), as the octant at their middle
const CENTRE = [2, 4, 0, 6];
const EDGE = 0.62;
const facing = new WeakMap();                                // sprite → { x, z, oct }
const apply = Sprite3D.prototype._applyFrame;
Sprite3D.prototype._applyFrame = function () {
  if (!this.sheet?.texture?.userData?.emberOctants) return apply.call(this);
  const four = this._row, centre = CENTRE[four] ?? 2, x = this.position.x, z = this.position.z;   // (sprites stand in the scene itself)
  let f = facing.get(this);
  if (!f) facing.set(this, (f = { x, z, oct: centre }));
  const dx = x - f.x, dz = z - f.z;
  f.x = x; f.z = z;
  const d2 = dx * dx + dz * dz;
  if (d2 > 1e-6 && d2 < 9) {                                 // (a teleport is no heading)
    const yaw = globalUniforms.uCameraYaw.value, c = Math.cos(yaw), s = Math.sin(yaw);
    const a = Math.atan2(dx * s + dz * c, dx * c - dz * s) / (Math.PI / 4);   // screen down over screen right, in octants
    f.a = a;
    let diff = a - f.oct; diff -= 8 * Math.round(diff / 8);
    if (Math.abs(diff) > EDGE) f.oct = (((Math.round(a) % 8) + 8) % 8);
  }
  let off = f.oct - centre; off -= 8 * Math.round(off / 8);
  if (Math.abs(off) > 1) f.oct = centre;                     // outside Luminati's quarter: its facing wins
  this._row = f.oct;
  apply.call(this);
  this._row = four;
};
/** (for checks: a sprite's octant row, null for a sheet of four) */
export const octantOf = (sprite) => (sprite?.sheet?.texture?.userData?.emberOctants ? (facing.get(sprite)?.oct ?? null) : null);
Object.assign(globalThis.__emberView, { octantOf, facingOf: (sprite) => ({ ...facing.get(sprite) }) });
