// render-smoke-test.mjs — headless proof the Emberlit BAKE side is sound without
// a GPU. The WebGL2 renderer itself needs a real GL context (verified by the
// SwiftShader screenshot harness), but the CPU half — the G-sprite bakers and the
// per-pixel albedo/normal/emissive they emit — is pure typed-array math and runs
// in node. This guards the class of bug (NaN normals, empty masks, bad ramp
// indices) that a blank screenshot would only tell us about after the fact.
//
//   node render-smoke-test.mjs   (run alongside smoke-test.mjs before every push)

import { createSim } from './src/sim/core.js';
import { createWorld, materialAt, heightAt } from './src/sim/world.js';
import { buildProps, norm3 } from './src/render/gsprite.js';

let bad = 0;
function checkSprite(name, sp) {
  if (!sp || !sp.w || !sp.h) { console.log('EMPTY sprite:', name); bad++; return; }
  let filled = 0;
  for (let i = 0; i < sp.mask.length; i++) if (sp.mask[i]) filled++;
  if (filled === 0) { console.log('NO PIXELS:', name); bad++; }
  for (let i = 0; i < sp.nrm.length; i++) if (Number.isNaN(sp.nrm[i])) { console.log('NaN normal:', name); bad++; break; }
  for (let i = 0; i < sp.alb.length; i++) if (Number.isNaN(sp.alb[i])) { console.log('NaN albedo:', name); bad++; break; }
  console.log(`  ${name}: ${sp.w}x${sp.h}, ${filled} px, anchor(${sp.ax},${sp.ay})`);
}

// norm3 must always return a unit-ish vector, never NaN
for (const v of [[0, 0, 0], [1, 2, 3], [-5, 0, 0.001]]) {
  const n = norm3(...v); if (n.some(Number.isNaN)) { console.log('NaN norm3', v); bad++; }
}

// prop bakers
const props = buildProps(20260807);
console.log('props:');
for (const kind of ['spire', 'monolith', 'totem', 'stairs', 'chest', 'shrine', 'brazier']) checkSprite(kind, props[kind][0]);

// world bake sanity: floor/wall/abyss present + elevation spans + deterministic
const SEED = 20260807;
const w1 = createWorld(SEED), w2 = createWorld(SEED);
const { W, H } = w1.level;
const mats = {}; let zmin = 9, zmax = -1, mismatch = 0;
for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
  const m = materialAt(w1, x, y), z = heightAt(w1, x, y);
  mats[m] = (mats[m] || 0) + 1; zmin = Math.min(zmin, z); zmax = Math.max(zmax, z);
  if (materialAt(w2, x, y) !== m || heightAt(w2, x, y) !== z) mismatch++;
}
console.log('world:', w1.theme, mats, 'z', zmin, '..', zmax, 'determinism mismatches', mismatch);
if (Object.keys(mats).length < 3) { console.log('material mix too flat'); bad++; }
if (zmax - zmin < 5) { console.log('no high walls (elevation span)'); bad++; }
if (mismatch) { console.log('non-deterministic worldgen'); bad++; }

// sim still boots + ticks
const sim = createSim(SEED);
for (let i = 0; i < 40; i++) { sim.commands.push({ type: 'move', x: 1, y: 0.3 }); sim.tick(); }
if (!Number.isFinite(sim.state.player.x)) { console.log('player position NaN'); bad++; }

console.log(bad === 0 ? 'RENDER_SMOKE_OK' : 'RENDER_SMOKE_FAIL (' + bad + ')');
if (bad !== 0) process.exit(1);
