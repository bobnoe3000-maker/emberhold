// @ts-check
// leap.js — the Vault's leap as it's drawn (GDD v1.99; the owner, 2026-11-14: "Vault skill need a slower more dramatic
// jump and attack animation"). The sim keeps him where he took off until he lands (battle.js TIER.leap: a crouch,
// A.air s in the air, the blow as he lands, held LEAP_SETTLE s over it); this is everything in between, a pure function
// of the skill's clock, so the renderer, the Stage and a test all see the same leap:
//   · the crouch (the cast's wind-up): down into KayKit's Jump_Start, slowly, gathering;
//   · the flight: up off the floor on a high arc that hangs at its top (eased: slow over the apex, fast at the ends),
//     the sword drawn back over his head (2H_Melee_Attack_Chop to its raise) while his legs tuck (Jump_Idle), then the
//     chop brought down so it strikes as his feet meet the floor (Jump_Land's legs taking the weight);
//   · the landing: down in Jump_Land's deep crouch, the blade in the floor (the chop's follow-through), then up.
// A pose is { clip, t } (t 0..1 through the clip) with, in the air, `legs`: the legs' own clip and moment (world.js
// figure.js pose: the chop over the jump's legs). Only models that carry the clips are posed so (cast.json `moves`);
// the rest play their heavy clip as before.

/** the clips a figure needs to be posed by this (tools/actor-lab/models.mjs keeps them in each fighter's model) */
export const LEAP_CLIPS = ['Jump_Start', 'Jump_Idle', 'Jump_Land', '2H_Melee_Attack_Chop'];
// KayKit's own moments, as fractions of each clip: Jump_Start is lowest at 0.27 s of 0.6 (0.45), then springs; the chop's sword is up over the head at 0.3 and strikes at 0.44 (frame 5 of the bake's 0–0.8 span);
// Jump_Land is deepest at 0.2 s of 0.67 (0.3)
const START_LOW = 0.45, CHOP_UP = 0.3, CHOP_HIT = 0.44, CHOP_END = 0.62, LAND_LOW = 0.3;
const LEAP_SETTLE = 0.45;                                 // (battle.js LEAP_SETTLE)
const smooth = (x) => { const t = x < 0 ? 0 : x > 1 ? 1 : x; return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

/** the apex's height in tiles for a leap d tiles long: a man's height and more, higher the further */
export const apexOf = (d) => 2.2 + 0.28 * Math.min(8, Math.max(0, d));

/**
 * Where a leap is at: `phase` 'crouch' (s into the wind-up), 'air' or 'land' (s since takeoff), or null when it's over.
 * g: how far along the ground from takeoff to landing (0..1); lift: tiles above the floor; pose: the model's pose.
 * @param {{ wind?: number, air: number, crouchT?: number | null, airT?: number | null, apex?: number, settle?: number }} L  crouchT: s since the cast
 *   (the leap not yet off the floor); airT: s since takeoff; apex, settle: a hop's own (Earthshatter's, render/moves.js), else a Vault's
 * @param {number} dist tiles from takeoff to landing
 * @returns {null | { phase: 'crouch' | 'air' | 'land', g: number, lift: number, pose: { clip: string, t: number, legs?: { clip: string, t: number } } }}
 */
export function leapAt(L, dist) {
  const air = L.air || 0.8, SETTLE = L.settle || LEAP_SETTLE;
  if (L.airT == null) {
    if (L.crouchT == null) return null;
    const w = L.wind || 0.5, k = Math.min(1, L.crouchT / w);
    if (L.crouchT > w + 0.4) return null;                 // (cut down mid-cast: the takeoff never came)
    return { phase: 'crouch', g: 0, lift: 0, pose: { clip: 'Jump_Start', t: START_LOW * smooth(k) } };
  }
  const s = L.airT;
  if (s < air) {
    const p = s / air;
    // the ground eased so the top hangs: 60 % even, 40 % slowed over the middle
    const c = 2 * p - 1, g = 0.6 * p + 0.4 * (0.5 + 0.5 * Math.sign(c) * c * c);
    const lift = (L.apex || apexOf(dist)) * 4 * g * (1 - g);
    let pose;
    if (p < 0.16) pose = { clip: 'Jump_Start', t: lerp(START_LOW, 1, p / 0.16) };   // the spring off the floor
    else {
      // the sword: up over his head by 0.7 (slow, hanging with him), down in the last 30 % to strike on the floor
      const t = p < 0.7 ? CHOP_UP * smooth((p - 0.16) / 0.54) : lerp(CHOP_UP, CHOP_HIT, Math.pow((p - 0.7) / 0.3, 1.6));
      const legs = p < 0.88 ? { clip: 'Jump_Idle', t: 0.5 * smooth((p - 0.16) / 0.72) } : { clip: 'Jump_Land', t: LAND_LOW * 0.4 * ((p - 0.88) / 0.12) };
      pose = { clip: '2H_Melee_Attack_Chop', t, legs };
    }
    return { phase: 'air', g, lift, pose };
  }
  const r = s - air;
  if (r >= SETTLE + 0.2) return null;
  const k = Math.min(1, r / SETTLE);
  // the blade in the floor while he takes the weight (deepest at a third), then up out of the crouch; the last 0.2 s
  // the follow-through finishing, standing
  const legs = r < SETTLE ? { clip: 'Jump_Land', t: k < 0.35 ? lerp(LAND_LOW * 0.4, LAND_LOW, k / 0.35) : lerp(LAND_LOW, 1, smooth((k - 0.35) / 0.65)) } : undefined;
  return { phase: 'land', g: 1, lift: 0, pose: { clip: '2H_Melee_Attack_Chop', t: lerp(CHOP_HIT, CHOP_END, smooth(r / (SETTLE + 0.2))), ...(legs ? { legs } : {}) } };
}
