// @ts-check
// moves.js — Earthshatter's hop and Shadowstep's dash as they're drawn (GDD v1.111; the owner, 2026-11-15: "do #4", the
// same treatment as the Vault's leap for the other skills that move: render/leap.js). The sim holds the member where they
// stood until the blow (battle.js TIER.slam, TIER.step: a 'go' event, then the 'land' as it strikes); this is everything
// in between, a pure function of the skill's clock, so the renderer, the Stage and a test all see the same move:
//   · Earthshatter: the crouch (the cast's wind-up), a short hop straight up with the sword raised over his head, and the
//     sword brought down into the floor as his feet meet it (the Vault's own poses, leap.js, on the spot and lower);
//   · Shadowstep: she goes low and fast (KayKit's Dodge_Forward, the roll's lunge), on a curve round the shooter to its
//     back, half gone into the smoke at the middle of it; then the twin stab as she comes out behind it.
// A pose is { clip, t } (t 0..1 through the clip), as leap.js's; only models that carry the clips are posed so (cast.json
// `moves`, tools/actor-lab/models.mjs), the rest play their own clips as before.
import { leapAt } from './leap.js';

/** the clips a rogue's figure needs for the dash (tools/actor-lab/models.mjs keeps them in her model) */
export const DASH_CLIPS = ['Dodge_Forward', 'Dualwield_Melee_Attack_Stab'];
/** a hop's height in tiles at its top: a little over a knee's height and more, well under a Vault's 2.2 */
export const HOP_APEX = 1.4;
const HOP_SETTLE = 0.35, DASH_SETTLE = 0.3;               // (battle.js)
// KayKit's moments: Dodge_Forward lunges from 0.1 and is lowest, gone furthest, at 0.55; the twin stab's blades go in at 0.4
const DODGE_IN = 0.1, DODGE_LOW = 0.55, STAB_FROM = 0.12, STAB_HIT = 0.4, STAB_END = 0.75;
const smooth = (x) => { const t = x < 0 ? 0 : x > 1 ? 1 : x; return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Earthshatter's hop: as leapAt, on the spot (no ground covered), lower and quicker.
 * @param {{ wind?: number, air: number, crouchT?: number | null, airT?: number | null }} H
 */
export const hopAt = (H) => leapAt({ ...H, apex: HOP_APEX, settle: HOP_SETTLE }, 0);

/**
 * Shadowstep's dash: `phase` 'dash' (s since she went < air) or 'stab' (after), null when it's over.
 * g: how far along her curve (0..1); bend: how far the curve swings out to the side at its middle (tiles: she runs round
 * the shooter, not through it); fade: how far she's gone into the smoke (0..1); pose: the model's.
 * @param {{ air: number, t: number }} D  t: s since she went
 * @returns {null | { phase: 'dash' | 'stab', g: number, fade: number, pose: { clip: string, t: number } }}
 */
export function dashAt(D) {
  const air = D.air || 0.3, s = D.t;
  if (s < 0) return null;
  if (s < air) {
    const p = s / air, g = smooth(p * 0.85 + 0.15 * p * p);   // (quick away, quicker in: she arrives at a rush)
    return { phase: 'dash', g, fade: 0.55 * Math.sin(Math.PI * p), pose: { clip: 'Dodge_Forward', t: lerp(DODGE_IN, DODGE_LOW, smooth(p)) } };
  }
  const r = s - air;
  if (r >= DASH_SETTLE + 0.15) return null;
  // the blades go in as she comes out (the sim's blow is now), then drawn out
  const t = r < 0.08 ? lerp(STAB_FROM + (STAB_HIT - STAB_FROM) * 0.6, STAB_HIT, r / 0.08) : lerp(STAB_HIT, STAB_END, smooth((r - 0.08) / (DASH_SETTLE + 0.07)));
  return { phase: 'stab', g: 1, fade: 0, pose: { clip: 'Dualwield_Melee_Attack_Stab', t } };
}

/** a point on her curve from (ax, ay) to (bx, by), swung out `bend` tiles to one side at its middle */
export function dashPoint(ax, ay, bx, by, g, bend) {
  const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1, s = 4 * g * (1 - g) * bend;
  return { x: ax + dx * g + (-dy / l) * s, y: ay + dy * g + (dx / l) * s };
}
