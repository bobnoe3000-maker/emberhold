// @ts-check
// skillfx.js — each class skill's own effect (docs/combat-fx.md; the owner, 2026-11-07: "Unique effects for each spell
// and skill. AAA quality"). Before, a skill was its name floating up and the class's ordinary swing or cast: Bless,
// Hex, Arcane Ward, Shield Wall and Smoke Step drew nothing, Frost Nova and Turn Undead were a screen shake.
//
// Drawn as light into the emissive plane with fx.js's primitives (AGENTS.md: effects reuse the primitives, no new
// passes), so both renderers show them: Emberlit lights its window with them, Luminati lays the plane over its world.
//
// Two halves:
//   · moments: the sim's 'skill' event (battle.js skillEv: a cast and where it lands, caster, target, those reached)
//     starts a timed effect, drawn each frame from its age; caster and target are followed by id while they move;
//   · auras: what a skill leaves on someone for its duration, read off the sim's state every frame (a Shield Wall, a
//     Smoke Step, Bless, Ancestors' Breath, an Arcane Ward, a Hex, Venom, Spirit Drain's stacks, Frost Nova's chill).
//
// Each class has its colour language, each skill its shape and timing (anticipation, impact, decay):
//   fighter — warm steel and amber: Cleave a crescent swept round the blade; Shield Wall a war-cry ring and the lines
//             of the foes it turns, a shield of light, a ring of plates at the feet; Second Wind a whirl of wind rising.
//   rogue   — verdant, and a crimson cut: Backstab a shadow's streak and a crossed slash; Smoke Step a ring of smoke
//             thrown out, wisps about them after; Venom a green splash, bubbles rising off the poisoned.
//   mage    — arcane blue, fire and frost: Firebolt a roaring head with embers and an explosion that scorches the
//             floor; Frost Nova thrown onto a knot of foes, a ring of frost running out there and ice spikes standing up
//             along it, rime on the chilled;
//             Arcane Ward runes drawn in and a dome of light while it holds.
//   cleric  — gold (Mend's light green, the owner's): Mend a beam from above and a mark rising; Bless a rune circle and halos settling; Turn Undead a
//             sunburst, its rays running out over the floor, the dead it reaches flaring.
//   shaman  — spirit teal, hex green and violet: Spirit Drain a tether drawing motes from the foe, its stacks circling
//             them; Ancestors' Breath a breath going out over the party and leaves spiralling up them; Hex a sigil drawn
//             on the floor under the knot, a mark under each hexed foe.
// The fight's other moments, in the same way (the boss pass, docs/combat-fx.md): a ward breaking, a level gained, and each
// boss's mechanic (battle.js bossMech: the Quartermaster issuing, Garrow's call, the Stranger kindling, Skarn's drum, the
// Choir raising a singer, the Abbess's bells, the Toadking's stamp); and what holds through a boss fight, read off its
// state: the Standard's line, Teague's lit cage mending him, Garrow's men shielding him, the Choir's singing.
// Presentation only: it reads the sim, never writes it. Math.random is fine here (not in the sim); each moment's
// scatter comes from its own small hash so a replayed frame draws the same.
import { LINE_R } from '../sim/battle.js';

/** screen px per tile of world radius: a world circle is an ellipse of these semi-axes (iso.js HW, HH: 8, 4, × √2) */
const EX = 11.31, EY = 5.66;
const TAU = Math.PI * 2;
// saturated on purpose, as fx.js's: bloom and the tonemap wash light toward white
const C = {
  cleave: [255, 190, 100], cleaveHot: [255, 236, 190], wall: [255, 210, 130], taunt: [255, 84, 56], wind: [110, 255, 120], windHot: [200, 255, 190],
  stab: [255, 52, 84], shadow: [110, 255, 165], smoke: [196, 186, 240], venom: [150, 255, 50],
  fire: [255, 116, 28], fireHot: [255, 214, 130], ember: [220, 60, 18], frost: [140, 210, 255], frostHot: [230, 248, 255], ward: [110, 150, 255], wardHot: [190, 215, 255],
  mend: [255, 230, 150], mendG: [110, 255, 140], bless: [255, 210, 110], turn: [255, 246, 210], drain: [110, 240, 210], breath: [140, 255, 190], hex: [160, 255, 70], hexV: [190, 110, 255],
  // (the boss pass) each boss in the colours fx.js gives his weapon, a level's gold
  lvl: [255, 214, 120], lvlHot: [255, 246, 214], issue: [235, 196, 130], issueHot: [255, 238, 196], call: [255, 92, 70], callHot: [255, 196, 168],
  kindle: [255, 128, 34], kindleHot: [255, 214, 140], drum: [255, 170, 90], dust: [200, 168, 120], sing: [130, 225, 235], singHot: [214, 248, 255],
  bell: [170, 205, 255], bellHot: [226, 238, 255], mud: [214, 170, 96], line: [236, 214, 150], cage: [190, 150, 255], cageHot: [236, 220, 255],
  // a foe's warning: Luminati's enemy marker (its rim 2.6, 0.34, 0.12), and white as the blow lands
  warn: [255, 70, 28], warnHot: [255, 236, 214],
  // the proposed statuses: the stun's stars, a root's green, a knocked-down figure's dust
  stun: [255, 236, 150], root: [130, 230, 90],
};
/** how long each moment lasts, s */
const LIFE = { cleave: 0.55, shield_wall: 0.95, second_wind: 1.2, backstab: 0.6, smoke_step: 1.3, venom: 0.8, firebolt: 1.3, frost_nova: 1.6,
  arcane_ward: 0.95, mend: 1.1, bless: 1.2, turn_undead: 1.1, spirit_drain: 0.8, ancestors_breath: 1.3, hex: 1.4 };
/** the skills with a moment of their own (for checks: every class skill has one) */
export const SKILL_MOMENTS = Object.freeze(Object.keys(LIFE));
/** the fight's other moments: a foe's warning, a ward breaking, a level gained, each boss's mechanic (a warning's life is
 *  its own: to the blow or the shot's landing, and a flash) */
const MORE = { warn: 0.6, ward_break: 0.7, level_up: 1.8, boss_issue: 1.3, boss_call: 1.1, boss_kindle: 1.4, boss_swarm: 1.2, boss_vespers: 1.3, boss_bells: 1.6, boss_mud: 0.8 };
export const FIGHT_MOMENTS = Object.freeze(Object.keys(MORE));
/** the proposed skills' moments (docs/skill-trees-proposal.md; for the owner's review: the sim doesn't cast them yet), life s */
const PROPOSED = { vault: 0.9, cutting_wave: 0.8, earthshatter: 1.0, whirling_blades: 5, kidney_shot: 0.7, fan_of_knives: 0.6, shadowstep: 0.8,
  caltrops: 6, flare: 1.3, gather: 0.8, glacial_tomb: 0.9, blizzard: 6, sanctuary: 4, consecrate: 8, revive: 1.7, judgement: 1.6,
  binding_roots: 0.7, old_marks: 0.7, spirit_totem: 8, thunder_drum: 0.7 };
export const PROPOSED_MOMENTS = Object.freeze(Object.keys(PROPOSED));
/** a heavy blow's warning ring, tiles (Emberlit's, and Luminati's from it: hybrid.js) */
export const WARN_R = Object.freeze({ heavy: 1.4, boss: 1.7 });
const ease = (u) => 1 - (1 - u) * (1 - u), clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** a small deterministic scatter: the k-th number of a moment */
const rnd = (seed, k) => { const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };

/**
 * @param {{ depth: Function, mark: Function, flush: Function, disc: Function, seg: Function, star: Function }} P fx.js primitives
 */
export function createSkillFX(P) {
  const { depth, mark, disc, seg, star } = P;
  // (the light's strength: at fx.js's own gain the first pass read as dotted outlines beside the weapons' arcs)
  // (the boss pass: a boss's moment and what holds through his fight are drawn in a melee, the party over them; at the
  // skills' strength they read in the art review and were lost in a real fight: tools/capture/bosses.mjs)
  const BOOST = 1.7, BOSS = 1.6; let gainK = 1;
  const flush = (col, g = 1) => P.flush(col, g * BOOST * gainK);
  /** @type {{ e: any, t0: number, seed: number, lock?: any }[]} */
  const live = [];
  let n = 0;
  // ── shapes, on the screen (the iso ground's 2:1 built in) ───────────────────────────────────────────────────────
  // q: a point { sx, sy, h, key }; under the figures (the floor) or over them
  const under = (q) => depth(q.key - 0.25, q.sy, q.h), over = (q, k = 0.6) => depth(q.key + k, q.sy, q.h);
  /** a ring on the floor of world radius R tiles, lifted `lift` px, from angle a0 to a1 */
  /** an ellipse's length, px (Ramanujan's), for stepping a stroke a pixel at a time: a ring stepped more coarsely read dotted */
  const perim = (rx, ry) => Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  function ring(q, R, a, w = 1.5, lift = 0, a0 = 0, a1 = TAU) {
    if (a <= 0.01 || R <= 0) return;
    const m = Math.max(12, Math.ceil(perim(R * EX, R * EY) * (a1 - a0) / TAU * 1.1));
    for (let i = 0; i <= m; i++) { const t = a0 + (a1 - a0) * (i / m); disc(q.sx + Math.cos(t) * R * EX, q.sy - lift + Math.sin(t) * R * EY, w, a, 1); }
  }
  /** a soft filled ellipse on the floor (a glow, a mist), brightest at its middle */
  function pool(q, R, a, lift = 0, p = 1.6) {
    if (a <= 0.01) return;
    const rx = R * EX, ry = R * EY;
    for (let dy = -Math.ceil(ry); dy <= ry; dy++) for (let dx = -Math.ceil(rx); dx <= rx; dx++) { const e = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry); if (e < 1) mark(q.sx + dx, q.sy - lift + dy, a * Math.pow(1 - e, p)); }
  }
  /** a point on the floor ellipse round q at angle t, radius R tiles, lifted */
  const on = (q, R, t, lift = 0) => [q.sx + Math.cos(t) * R * EX, q.sy - lift + Math.sin(t) * R * EY];
  /** a vertical column of light standing on (x, y), h tall, w half-wide, brightest at the foot */
  function column(x, y, h, w, a) { for (let yy = 0; yy < h; yy++) { const f = yy / h, ww = w * (1 - f * 0.4), aa = a * Math.pow(1 - f, 0.7); for (let xx = -Math.ceil(ww); xx <= ww; xx++) mark(x + xx, y - yy, aa * Math.max(0, 1 - Math.abs(xx) / (ww + 0.5))); } }
  /** an ellipse standing up (a dome, a shield's outline): centre, semi-axes in px, from angle a0 to a1 */
  function oval(x, y, rx, ry, a, w = 1.2, a0 = 0, a1 = TAU) { const m = Math.max(12, Math.ceil(perim(rx, ry) * (a1 - a0) / TAU * 1.1)); for (let i = 0; i <= m; i++) { const t = a0 + (a1 - a0) * (i / m); disc(x + Math.cos(t) * rx, y + Math.sin(t) * ry, w, a, 1); } }

  // ── where the people in it stand now (followed by id while they move), else where they were ───────────────────
  /** @param {Map<string, any>} at @param {boolean} foe @param {any} id @param {number} x @param {number} y @param {Function} proj */
  const find = (at, foe, id, x, y, proj) => (id != null && at.get((foe ? 'e' : 'p') + id)) || proj(x, y);

  // ── the moments ───────────────────────────────────────────────────────────────────────────────────────────────
  // each draws from t (s since it began), k (1 → 0 over its life), Cq/Tq (caster, target), R (those reached)
  const MOMENT = {
    // the blade's crescent, swept round the fighter toward the target and out past it, a white-hot edge; a spark on each
    // foe beside the target
    cleave(ctx) {
      const { t, Cq, Tq, R } = ctx; if (ctx.at !== 'land') return;
      const ph = Math.atan2((Tq.sy - Cq.sy) / EY, (Tq.sx - Cq.sx) / EX), head = -1.25 + 2.5 * clamp01(t / 0.11), fade = t < 0.11 ? 1 : 1 - (t - 0.11) / 0.44;
      over(Cq, 0.4);
      for (let u = -1.25; u <= head; u += 0.035) {
        const age = (head - u) / 2.5, a = fade * Math.pow(1 - age, 1.4);
        const [ox, oy] = on(Cq, 1.75, ph + u, 15), [ix, iy] = on(Cq, 1.05, ph + u, 13);
        seg(ix, iy, ox, oy, a * 0.18, a * 0.9);
      }
      flush(C.cleave, 1.1);
      if (t < 0.14) { const [ox, oy] = on(Cq, 1.75, ph + head, 15); star(ox, oy, 7, 1.2); over(Cq, 0.5); flush(C.cleaveHot); }
      if (t < 0.3) for (const q of [Tq, ...R]) { over(q); star(q.sx, q.sy - 24, 6 + 6 * t, 1.1 * (1 - t / 0.3)); flush(C.cleaveHot); under(q); ring(q, 0.35 + t * 2.5, 0.8 * (1 - t / 0.3), 1.1); flush(C.cleave); }
    },
    // the war cry: a red ring thrown out over the floor, a line from each foe it turns, then a shield of light standing
    // before the fighter
    shield_wall(ctx) {
      const { t, Cq, foes } = ctx;
      if (ctx.at === 'cast') {
        const u = clamp01(t / 0.4); if (u >= 1) return;
        under(Cq); ring(Cq, 0.4 + 2.9 * ease(u), 1.1 * (1 - u), 1.6); ring(Cq, 0.2 + 2.2 * ease(u), 0.5 * (1 - u), 1); flush(C.taunt);
        over(Cq, 0.3);
        for (const f of foes) { const d = Math.hypot((f.sx - Cq.sx) / EX, (f.sy - Cq.sy) / EY); if (d > 4.2) continue; const g = 0.75 * (1 - u) * (1 - d / 4.2);
          for (let s = 0; s < 3; s++) { const a = clamp01(u * 3 - s * 0.5); const x0 = f.sx + (Cq.sx - f.sx) * a, y0 = f.sy - 26 + (Cq.sy - f.sy) * a; disc(x0, y0, 1.8, g, 1); }
          seg(f.sx, f.sy - 26, Cq.sx, Cq.sy - 26, g * 0.15, g * 0.5); }
        flush(C.taunt);
        return;
      }
      const rise = clamp01(t / 0.16), k = t < 0.55 ? 1 : 1 - (t - 0.55) / 0.4, x = Cq.sx, y = Cq.sy - 6 - 22 * rise;
      over(Cq, 0.7);
      for (let yy = -16; yy <= 16; yy++) { const half = 11 * Math.sqrt(1 - Math.pow(Math.max(0, yy - 4) / 13, 2)); disc(x - half, y + yy, 1.1, 1.2 * k * rise, 1); disc(x + half, y + yy, 1.1, 1.2 * k * rise, 1); }   // the shield's rim
      for (let yy = -16; yy <= 4; yy += 4) seg(x - 9, y + yy, x + 9, y + yy, 0.18 * k * rise, 0.18 * k * rise);   // its face
      seg(x, y - 16, x, y + 16, 0.6 * k, 0.2 * k); star(x, y - 16, 6, k * rise);
      flush(C.wall, 1.05);
    },
    // a whirl of wind rising round the fighter, three strands, and a ring at the feet
    second_wind(ctx) {
      const { t, k, Cq } = ctx; if (ctx.at !== 'land') return;
      over(Cq, 0.3);
      for (let s = 0; s < 3; s++) for (let j = 0; j < 14; j++) {
        const u = j / 13, hgt = u * 54 * clamp01(t / 0.35 + 0.2), ang = t * 9 + s * 2.094 + u * 5.5, r = 11 * (1 - u * 0.35);
        disc(Cq.sx + Math.cos(ang) * r, Cq.sy - hgt + Math.sin(ang) * r * 0.4, 2, 1.25 * k * (1 - u * 0.6) * (Math.sin(ang) > 0 ? 1 : 0.55), 1);
      }
      flush(C.wind, 1.5);
      over(Cq, 0.2); column(Cq.sx, Cq.sy, 58 * clamp01(t / 0.3 + 0.2), 6, 0.55 * k); if (t < 0.3) star(Cq.sx, Cq.sy - 30, 10, 1.1 * (1 - t / 0.3)); flush(C.windHot, 1.2);   // (the owner, 2026-11-08: "brighter green lights")
      under(Cq); ring(Cq, 0.3 + 1.1 * ease(clamp01(t / 0.5)), 1.2 * k, 1.6); pool(Cq, 0.8, 0.55 * k); flush(C.wind, 1.4);
    },
    // a shadow's streak from where the rogue stood, then two cuts crossing on the target, crimson; a crit a star
    backstab(ctx) {
      const { t, Cq, Tq, e } = ctx; if (ctx.at !== 'land') return;
      if (t < 0.25) { over(Tq, 0.2); seg(Cq.sx, Cq.sy - 20, Tq.sx, Tq.sy - 22, 0, 0.95 * (1 - t / 0.25), 1.3); flush(C.shadow, 1.4); }   // (the owner, 2026-11-08: "brighter")
      const x = Tq.sx, y = Tq.sy - 24, k = t < 0.12 ? 1 : 1 - (t - 0.12) / 0.48;
      const s1 = clamp01(t / 0.05), s2 = clamp01((t - 0.04) / 0.05);
      over(Tq, 0.9);
      seg(x - 10, y - 10, x - 10 + 20 * s1, y - 10 + 20 * s1, 1.5 * k, 1.5 * k, 1.3);
      if (s2 > 0) seg(x + 10, y - 10, x + 10 - 20 * s2, y - 10 + 20 * s2, 1.5 * k, 1.5 * k, 1.3);
      if (e.crit) star(x, y, 11 + 7 * (1 - k), 1.6 * k);
      flush(C.stab, 1.7);
      if (t < 0.2) { over(Tq, 0.95); disc(x, y, 6 + 6 * (t / 0.2), 0.9 * (1 - t / 0.2), 1.2); flush(C.stab, 1.3); }
    },
    // smoke thrown out in a ring at the feet, billowing and rising, pale lilac in the dark
    smoke_step(ctx) {
      const { t, k, Cq, seed } = ctx; if (ctx.at !== 'land') return;
      over(Cq, 0.5);
      for (let i = 0; i < 16; i++) { const ang = (i / 16) * TAU + rnd(seed, i) * 0.4, u = ease(clamp01(t / 0.6)), R = 0.3 + 1.2 * u * (0.7 + 0.3 * rnd(seed, i + 30));
        const [x, y] = on(Cq, R, ang, 4 + 14 * u * rnd(seed, i + 60)); disc(x, y, 4.5 + 6 * u, 0.5 * k, 2); }
      for (let i = 0; i < 5; i++) { const ang = t * 3 + i * 1.26; disc(Cq.sx + Math.cos(ang) * 8, Cq.sy - 20 - t * 14 + Math.sin(ang) * 6, 1.8, 1.1 * k, 1); }
      flush(C.smoke, 1.4);   // (the owner, 2026-11-08: "brighter"; and the smoke stays for the buff: the aura)
    },
    // a green splash off the struck: drops thrown out and falling, a ring of it at their feet
    venom(ctx) {
      const { t, k, Tq, seed } = ctx; if (ctx.at !== 'land') return;
      over(Tq, 0.7);
      for (let i = 0; i < 12; i++) { const a = rnd(seed, i) * TAU, sp = 26 + 30 * rnd(seed, i + 9), x = Tq.sx + Math.cos(a) * sp * t, y = Tq.sy - 22 + Math.sin(a) * sp * 0.5 * t - 40 * t + 110 * t * t;
        disc(x, y, 1.3, k * 1.1, 1); }
      star(Tq.sx, Tq.sy - 22, 6 * k + 2, 0.9 * k);
      flush(C.venom); under(Tq); ring(Tq, 0.25 + 0.6 * ease(clamp01(t / 0.4)), 0.8 * k, 1.2); flush(C.venom);
    },
    // where the firebolt lands, an explosion (the owner, 2026-11-08: "The mage fireball needs more explosion fx on hit"),
    // staged as a blast reads: a white core flash; the fireball billowing out and cooling white → orange → red as it
    // grows; a fast shock ring and a slower one over the floor; flame tongues standing up round its edge; burning debris
    // flung out on arcs, trailing, bouncing once; smoke-light going up; the floor left glowing and cooling. (The renderer
    // adds the light it throws on the room, and a harder jolt: renderer.js blasts.)
    firebolt(ctx) {
      const { t, k, Tq, seed } = ctx; if (ctx.at !== 'land') return;
      const X = Tq.sx, Y = Tq.sy - 18;
      // the core: white, gone in a tenth of a second
      if (t < 0.12) { const f = 1 - t / 0.12; over(Tq, 0.9); disc(X, Y, 9 + 10 * (1 - f), 1.8 * f, 0.9); star(X, Y, 22 + 8 * (1 - f), 1.5 * f); flush(C.fireHot, 1.2); }
      // the fireball: lobes round a growing middle, hot inside and cooling outward and with age
      const b = clamp01(t / 0.42); if (b < 1) {
        const R = 6 + 16 * ease(b), fade = 1 - b;
        over(Tq, 0.8); disc(X, Y - 4 * b, R * 0.55, 1.4 * fade * fade, 1.2); flush(b < 0.3 ? C.fireHot : C.fire, 1.15);
        over(Tq, 0.75);
        for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU + rnd(seed, i + 50) * 0.7, rr = R * (0.45 + 0.35 * rnd(seed, i + 60)); disc(X + Math.cos(a) * rr, Y - 4 * b + Math.sin(a) * rr * 0.75 - 6 * b * rnd(seed, i + 70), R * (0.32 + 0.12 * rnd(seed, i + 80)), 0.9 * fade, 1.5); }
        flush(b < 0.5 ? C.fire : C.ember, 1.05);
      }
      // the shock: a fast bright ring over the floor, then a slower, wider one
      under(Tq); { const u = clamp01(t / 0.2); if (u < 1) ring(Tq, 0.3 + 2.2 * ease(u), 1.5 * (1 - u), 2); const v = clamp01((t - 0.06) / 0.5); if (v > 0 && v < 1) ring(Tq, 0.3 + 1.6 * ease(v), 0.8 * (1 - v), 1.4); } flush(C.fireHot);
      // flame tongues round the blast's edge, licking up and dying down
      if (t > 0.05 && t < 0.8) { const g = clamp01((t - 0.05) / 0.1) * (1 - clamp01((t - 0.35) / 0.45)); over(Tq, 0.6);
        for (let i = 0; i < 10; i++) { const a = (i / 10) * TAU + rnd(seed, i + 90) * 0.5, [x, y] = on(Tq, 0.9 + 0.4 * rnd(seed, i + 91), a), h = (10 + 14 * rnd(seed, i + 92)) * g * (0.75 + 0.25 * Math.sin(t * 30 + i * 2));
          for (let j = 0; j <= 7; j++) { const v = j / 7; disc(x + Math.sin(t * 22 + i + v * 5) * 2 * v, y - v * h, 1.5 * (1 - v * 0.6), 1.1 * g * (1 - v * 0.7), 1); } }
        flush(C.fire, 1.05); }
      // burning debris: out on arcs, a trail behind each, a bounce where it meets the floor
      over(Tq, 0.7);
      for (let i = 0; i < 26; i++) {
        const a = rnd(seed, i) * TAU, sp = 50 + 90 * rnd(seed, i + 7), life = 0.55 + 0.5 * rnd(seed, i + 3); if (t > life) continue;
        const vx = Math.cos(a) * sp, vy = Math.sin(a) * sp * 0.5 - 80 - 50 * rnd(seed, i + 11), g = 340, f = 1 - t / life;
        const pos = (tt) => { let y = Y + vy * tt + 0.5 * g * tt * tt; const floor = Tq.sy + Math.sin(a) * sp * 0.5 * tt * 0.4; if (y > floor) y = floor - (y - floor) * 0.3; return [X + vx * tt, y]; };
        const [x1, y1] = pos(t), [x0, y0] = pos(Math.max(0, t - 0.05)); seg(x0, y0, x1, y1, 0.2 * f, 1.2 * f, i % 4 ? 0 : 0.5);
      }
      flush(C.fire, 1.1);
      // smoke-light going up off it
      for (let i = 0; i < 8; i++) { const v = clamp01((t - 0.12 - i * 0.04) / 0.9); if (v <= 0 || v >= 1) continue; disc(X + Math.sin(i * 2.1 + t * 3) * (4 + 6 * v), Y - 8 - v * 46, 3 + 4 * v, 0.32 * (1 - v), 1.6); }
      flush(C.ember, 0.9);
      // the floor: a scorch glowing and cooling
      under(Tq); pool(Tq, 1.1, 0.75 * k * k, 0, 1.3); ring(Tq, 0.95, 0.5 * k, 1.4); flush(t < 0.4 ? C.fire : C.ember);
    },
    // the ring of frost running out from the mage over the floor, ice spikes standing up behind it as it passes, a cold
    // mist inside; each foe it reaches flashes white
    frost_nova(ctx) {
      const { t, Cq: M, Tq: Cq, R, seed } = ctx; if (ctx.at !== 'land') return;   // (thrown, GDD v1.53: it bursts on the knot, Tq)
      if (t < 0.16 && Math.hypot(Cq.sx - M.sx, Cq.sy - M.sy) > 8) { over(Cq, 0.4); const f = 1 - t / 0.16; seg(M.sx, M.sy - 26, Cq.sx, Cq.sy - 10, 0.25 * f, 1.1 * f, 0.9); star(M.sx, M.sy - 26, 5, f); flush(C.frostHot); }   // the throw: a cold streak from the staff to the knot
      const RR = ctx.e.r || 3.5, u = ease(clamp01(t / 0.3)), rad = 0.3 + (RR - 0.3) * u;   // (its real reach: skills.js radius)
      const hold = t < 1.0 ? 1 : 1 - (t - 1.0) / 0.6;   // (the owner, 2026-11-08: "the ground effect lingers 0.5 sec longer": it holds a second, then fades)
      under(Cq); pool(Cq, rad, 0.28 * hold, 0, 1.1); if (u < 1) { ring(Cq, rad, 1.25 * (1 - u * 0.4), 2.1); ring(Cq, rad * 0.86, 0.5 * (1 - u), 1.2); } flush(C.frost, 1.1);
      over(Cq, 0.3);
      for (let i = 0; i < 18; i++) { const ang = (i / 18) * TAU + rnd(seed, i) * 0.3, r0 = 0.6 + (RR - 0.6) * rnd(seed, i + 40); if (rad < r0) continue;
        const grow = clamp01((t - (r0 / RR) * 0.3) / 0.12), hgt = (6 + 9 * rnd(seed, i + 20)) * grow, [x, y] = on(Cq, r0, ang);
        seg(x, y, x + (rnd(seed, i + 5) - 0.5) * 3, y - hgt, 0.9 * hold, 1.3 * hold, 0.6); if (grow >= 1 && t < 0.6) star(x, y - hgt, 3, 0.8 * (1 - t / 0.6)); }
      flush(C.frostHot);
      if (t < 0.4) for (const q of R) { over(q); star(q.sx, q.sy - 24, 8, 1.2 * (1 - t / 0.4)); flush(C.frostHot); }
    },
    // runes drawn in round the ally, then the dome closes over them with a flash (the dome itself is the aura)
    arcane_ward(ctx) {
      const { t, k, Tq } = ctx; if (ctx.at !== 'land') return;
      over(Tq, 0.8);
      // (the owner, 2026-11-08: "Brighter": bigger runes and their trails, a heavier dome, a flash and a ring underfoot)
      if (t < 0.35) { const u = t / 0.35; for (let i = 0; i < 6; i++) { const a = i * 1.047 + t * 6, r = 24 - 13 * u; disc(Tq.sx + Math.cos(a) * r, Tq.sy - 22 + Math.sin(a) * r * 0.55, 2.4, 1.5, 1.2); seg(Tq.sx + Math.cos(a) * r, Tq.sy - 22 + Math.sin(a) * r * 0.55, Tq.sx + Math.cos(a + 0.5) * r, Tq.sy - 22 + Math.sin(a + 0.5) * r * 0.55, 1.1, 0.2, 0.8); } }
      else { const u = (t - 0.35) / 0.6; oval(Tq.sx, Tq.sy - 22, 13 + 4 * (1 - u), 21 + 4 * (1 - u), 1.7 * (1 - u), 1.8); if (u < 0.3) star(Tq.sx, Tq.sy - 30, 14, 1.5 * (1 - u / 0.3)); }
      flush(C.wardHot, 1.5);
      under(Tq); ring(Tq, 0.5 + 0.3 * ease(clamp01(t / 0.4)), 1.1 * k * (1 - clamp01((t - 0.5) / 0.45)), 1.5); pool(Tq, 0.55, 0.45 * k); flush(C.ward, 1.4);
    },
    // a beam of gold from above onto the ally, a ring at their feet, a mark rising over their head, motes going up
    mend(ctx) {
      const { t, k, Tq } = ctx; if (ctx.at !== 'land') return;
      const on2 = t < 0.12 ? t / 0.12 : 1;
      // (the owner, 2026-11-08: "Green light": the beam, the ring and the motes green, as on Luminati; the mark stays gold)
      over(Tq, 0.4); column(Tq.sx, Tq.sy, 74 * on2, 3.5, 1.6 * k); flush(C.mendG, 1.3);
      under(Tq); ring(Tq, 0.25 + 0.7 * ease(clamp01(t / 0.45)), 1.1 * k, 1.4); pool(Tq, 0.55, 0.6 * k); flush(C.mendG, 1.3);
      over(Tq, 0.8); const yy = Tq.sy - 50 - t * 14;
      seg(Tq.sx - 5, yy, Tq.sx + 5, yy, 1.2 * k, 1.2 * k, 0.8); seg(Tq.sx, yy - 5, Tq.sx, yy + 5, 1.2 * k, 1.2 * k, 0.8);
      flush(C.mend);
      for (let i = 0; i < 7; i++) { const u2 = (t * 1.4 + i / 7) % 1; disc(Tq.sx + Math.sin(i * 2.3) * 8, Tq.sy - 4 - u2 * 46, 1.5, 1.2 * k * (1 - u2), 1); }
      flush(C.mendG, 1.3);
    },
    // a rune circle turning at the cleric's feet, then a halo settling over each of the party (it stays: the aura)
    bless(ctx) {
      const { t, k, Cq, R } = ctx; if (ctx.at !== 'land') return;
      under(Cq); const u = ease(clamp01(t / 0.3)), rr = 1.25 * u;
      ring(Cq, rr, 1.1 * k, 1.3); ring(Cq, rr * 0.72, 0.7 * k, 1);
      for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + t * 1.6, [x0, y0] = on(Cq, rr * 0.72, a), [x1, y1] = on(Cq, rr, a); seg(x0, y0, x1, y1, 0.9 * k, 0.9 * k); }
      flush(C.bless);
      for (const q of R) { over(q, 0.8); const drop = clamp01(t / 0.35), y = q.sy - 66 + 14 * ease(drop); oval(q.sx, y, 8, 2.6, 1.3 * k, 1); if (t < 0.35) star(q.sx, y, 5, 0.9); flush(C.bless); }
    },
    // the sunburst: rays running out over the floor from the cleric, a ring of light behind them, a flare on each of the
    // dead they reach and their smoke going up
    turn_undead(ctx) {
      const { t, k, Cq, R, seed } = ctx; if (ctx.at !== 'land') return;
      const u = ease(clamp01(t / 0.32)), RR = 3;
      under(Cq);
      for (let i = 0; i < 20; i++) { const a = (i / 20) * TAU + rnd(seed, i) * 0.12, [x0, y0] = on(Cq, 0.4, a), [x1, y1] = on(Cq, 0.4 + (RR - 0.4) * u * (0.8 + 0.2 * rnd(seed, i + 9)), a); seg(x0, y0, x1, y1, 1.0 * k, 0.15 * k, 0.6); }
      if (u < 1) ring(Cq, 0.4 + (RR - 0.4) * u, 1.2 * (1 - u), 1.8); pool(Cq, 1.2 * u, 0.6 * k); flush(C.turn, 1.1);
      over(Cq, 0.3); if (t < 0.25) { column(Cq.sx, Cq.sy, 60, 5, 1.3 * (1 - t / 0.25)); star(Cq.sx, Cq.sy - 30, 14, 1.2 * (1 - t / 0.25)); } flush(C.turn);
      for (const q of R) { over(q, 0.6); if (t < 0.3) star(q.sx, q.sy - 26, 10, 1.3 * (1 - t / 0.3));
        for (let i = 0; i < 5; i++) { const v = clamp01(t * 1.3 - i * 0.08); if (v > 0 && v < 1) disc(q.sx + Math.sin(i * 1.9 + t * 4) * 6, q.sy - 22 - v * 36, 2.2, 0.8 * (1 - v), 1.3); } flush(C.turn); }
    },
    // the tether: motes drawn along a wavering line from the foe to the shaman, the line itself faint
    spirit_drain(ctx) {
      const { t, k, Cq, Tq } = ctx; if (ctx.at !== 'land') return;
      const x0 = Tq.sx, y0 = Tq.sy - 24, x1 = Cq.sx, y1 = Cq.sy - 26, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
      over(Tq, 0.3);
      for (let i = 0; i <= 40; i++) { const u = i / 40, w = Math.sin(u * Math.PI * 3 - t * 18) * 4 * Math.sin(u * Math.PI); disc(x0 + dx * u + nx * w, y0 + dy * u + ny * w, 0.9, 0.8 * k, 1); }
      for (let i = 0; i < 9; i++) { const u = (t * 1.8 + i / 9) % 1, w = Math.sin(u * Math.PI * 3 - t * 18) * 4 * Math.sin(u * Math.PI); disc(x0 + dx * u + nx * w, y0 + dy * u + ny * w, 2.3, 1.5 * k, 1); }
      star(x0, y0, 8, 1.2 * k); star(x1, y1, 6, 0.9 * k);
      flush(C.drain, 1.5);   // (the owner, 2026-11-08: "brighter fx")
    },
    // a breath going out over the floor from the shaman, and leaves of spirit-light spiralling up each of the party
    ancestors_breath(ctx) {
      const { t, k, Cq, R } = ctx; if (ctx.at !== 'land') return;
      under(Cq); const u = ease(clamp01(t / 0.45)); if (u < 1) { ring(Cq, 0.3 + 2.8 * u, 1.3 * (1 - u), 2); ring(Cq, 0.2 + 2.2 * u, 0.7 * (1 - u), 1.3); } flush(C.breath, 1.4);   // (the owner, 2026-11-08: "brighter lighting")
      for (const q of R) { under(q); pool(q, 0.7, 0.5 * k); flush(C.breath, 1.2); over(q, 0.5);
        for (let i = 0; i < 10; i++) { const v = clamp01(t * 1.1 - i * 0.05), a = v * 9 + i * 0.8; if (v <= 0 || v >= 1) continue;
          disc(q.sx + Math.cos(a) * 10 * (1 - v * 0.3), q.sy - 4 - v * 50 + Math.sin(a) * 3.5, 2, k * (1 - v) * 1.5, 1); }
        flush(C.breath, 1.5); }
    },
    // a sigil drawn on the floor under the knot: two rings and a five-pointed star, stroke by stroke; a violet line out
    // to each foe it takes
    hex(ctx) {
      const { t, k, Tq, R } = ctx; if (ctx.at !== 'land') return;
      const draw = clamp01(t / 0.35), RR = 2.1;   // (the owner, 2026-11-08: "Bigger FX": 1.35 → 2.1 tiles, heavier strokes)
      under(Tq);
      ring(Tq, RR, 1.2 * k, 1.7, 0, -Math.PI / 2, -Math.PI / 2 + TAU * draw); ring(Tq, RR * 0.82, 0.8 * k, 1.3, 0, Math.PI / 2, Math.PI / 2 + TAU * draw);
      const pts = []; for (let i = 0; i < 5; i++) pts.push(on(Tq, RR * 0.82, -Math.PI / 2 + i * TAU / 5));
      for (let i = 0; i < 5; i++) { const s = clamp01(draw * 5 - i); if (s <= 0) break; const a = pts[(i * 2) % 5], b = pts[(i * 2 + 2) % 5]; seg(a[0], a[1], a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, 1.2 * k, 1.2 * k, 0.8); }
      flush(C.hex, 1.4);
      under(Tq); pool(Tq, 1.1, 0.6 * k); flush(C.hexV, 1.2);
      if (t > 0.2 && t < 0.9) { over(Tq, 0.2); const g = 1.0 * (1 - (t - 0.2) / 0.7); for (const q of R) { seg(Tq.sx, Tq.sy, q.sx, q.sy - 4, g, g * 0.4, 0.8); star(q.sx, q.sy - 24, 6, g); } flush(C.hexV, 1.3); }
    },

    // ── the proposed skills (docs/skill-trees-proposal.md, tiers I and II): drawn for the owner's review before the sim
    // has them; each in its class's colours. ctx.P projects a world point (where a leap or a dash began) ──────────
    // FIGHTER · Vault: up from where he stood in an amber arc, then a sword of light falls with him onto the foe: a slam
    vault(ctx) {
      const { t, k, Tq, e, P, seed } = ctx; if (ctx.at !== 'land') return;
      const A = P(e.x, e.y), u = clamp01(t / 0.35);
      if (t < 0.5) { over(Tq, 0.6); const n = 18; for (let i = 0; i <= n; i++) { const v = (i / n) * u, x = A.sx + (Tq.sx - A.sx) * v, y = A.sy + (Tq.sy - A.sy) * v - 46 * Math.sin(v * Math.PI) - 20; disc(x, y, 1.6, (0.25 + 0.75 * (i / n)) * (t < 0.35 ? 1 : 1 - (t - 0.35) / 0.15), 1); } flush(C.cleave, 1.2); }
      if (t < 0.12) { under(Tq); ring(Tq, 0.3 + 0.8 * (t / 0.12), 0.7, 1.2); flush(C.dust); }   // (the push off)
      const s = (t - 0.3) / 0.12; if (s > 0 && s < 1.6) { over(Tq, 0.8); const yy = Tq.sy - 90 + 70 * clamp01(s); seg(Tq.sx, yy - 30, Tq.sx, yy + 4, 0.2 * (1.6 - s), 1.4 * (1.6 - s) / 1.6, 1.4); seg(Tq.sx - 7, yy - 18, Tq.sx + 7, yy - 18, 1.0 * (1.6 - s) / 1.6, 1.0 * (1.6 - s) / 1.6, 0.8); flush(C.cleaveHot, 1.3); }
      if (t > 0.38) { const v = clamp01((t - 0.38) / 0.4); under(Tq); ring(Tq, 0.3 + 1.6 * ease(v), 1.4 * (1 - v), 2); for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU + rnd(seed, i) * 0.5, [x0, y0] = on(Tq, 0.25, a), [x1, y1] = on(Tq, 0.4 + 1.1 * ease(v) * (0.6 + 0.4 * rnd(seed, i + 3)), a); seg(x0, y0, x1, y1, 1.0 * k, 0.2 * k, 0.6); } flush(C.cleave, 1.2);
        if (t < 0.55) { over(Tq, 0.9); star(Tq.sx, Tq.sy - 18, 16, 1.4 * (1 - (t - 0.38) / 0.17)); flush(C.cleaveHot); } }
    },
    // FIGHTER · Cutting Wave: a crest of steel light rushes along the floor from him through the line of foes, a fading lane behind
    cutting_wave(ctx) {
      const { t, k, Cq, Tq, R, P, e } = ctx; if (ctx.at !== 'land') return;
      // the lane in floor tiles: (wx, wy) a unit step along it, (−wy, wx) across it; W() puts a floor point on screen
      const L = Math.hypot((Tq.sx - Cq.sx) / EX, (Tq.sy - Cq.sy) / EY) || 1, wx = (Tq.sx - Cq.sx) / EX / L, wy = (Tq.sy - Cq.sy) / EY / L;
      const W = (/** @type {number} */ d, /** @type {number} */ o) => [Cq.sx + (wx * d - wy * o) * EX, Cq.sy + (wy * d + wx * o) * EY];
      const len = 6, u = clamp01(t / 0.32), head = len * ease(u), fade = t < 0.32 ? 1 : 1 - clamp01((t - 0.32) / 0.45);
      under(Cq); for (const o of [-0.45, 0, 0.45]) { const w = o ? 0.9 : 1.5, [ax, ay] = W(0.4, o), [bx, by] = W(Math.max(0.4, head - 2.4), o), [hx, hy] = W(head, o);
        seg(ax, ay, bx, by, 0.35 * k * fade, 0.35 * k * fade, w); seg(bx, by, hx, hy, 0.35 * k * fade, 1.5 * k * fade, w); } flush(C.cleave, 1.6);
      if (u < 1) { over(Cq, 0.4); for (let i = -3; i <= 3; i++) { const [x, y] = W(head - Math.abs(i) * 0.12, i * 0.18); seg(x, y, x, y - 16 + Math.abs(i) * 2.5, 1.3, 0.25, 0.7); } const [hx, hy] = W(head, 0); star(hx, hy - 8, 10, 1.3); flush(C.cleaveHot, 1.3); }
      for (const q of R) { const d = Math.hypot((q.sx - Cq.sx) / EX, (q.sy - Cq.sy) / EY); if (head >= d * 0.9 && t < 0.6) { over(q, 0.8); seg(q.sx - 9, q.sy - 26, q.sx + 9, q.sy - 18, 1.2 * (1 - t / 0.6), 1.2 * (1 - t / 0.6), 0.9); flush(C.cleaveHot); } }
      void P; void e;
    },
    // FIGHTER · Earthshatter: the slam cracks the floor out from him, a shock ring; then a ring of stone spikes thrown up, crumbling
    earthshatter(ctx) {
      const { t, k, Cq, seed } = ctx; if (ctx.at !== 'land') return;
      const u = ease(clamp01(t / 0.22)), RR = 3;
      under(Cq); for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU + rnd(seed, i) * 0.4; let [x, y] = on(Cq, 0.3, a); const n = 6; for (let j = 1; j <= n; j++) { const [x2, y2] = on(Cq, 0.3 + (RR - 0.3) * u * (j / n), a + (rnd(seed, i * 7 + j) - 0.5) * 0.35); seg(x, y, x2, y2, 1.1 * k, 1.1 * k, 0.5); x = x2; y = y2; } } flush(C.mud, 1.4);
      under(Cq); { const v = clamp01(t / 0.3); if (v < 1) ring(Cq, 0.4 + (RR + 0.4) * ease(v), 1.4 * (1 - v), 2.2); } pool(Cq, 1.2, 0.5 * k); flush(C.wall, 1.3);
      const s = clamp01((t - 0.14) / 0.12), fall = clamp01((t - 0.55) / 0.35); if (s > 0) { over(Cq, 0.3);
        for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU + rnd(seed, i + 40) * 0.3, r0 = 1.4 + 2.2 * rnd(seed, i + 50), [x, y] = on(Cq, r0, a), h = (8 + 9 * rnd(seed, i + 60)) * s * (1 - fall); if (h < 1) continue; seg(x - 2, y, x, y - h, 0.9, 1.3, 0.7); seg(x + 2, y, x, y - h, 0.6, 1.0); } flush(C.dust, 1.5);
        if (fall > 0) { for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU + rnd(seed, i + 40) * 0.3, [x, y] = on(Cq, 1.4 + 2.2 * rnd(seed, i + 50), a); disc(x + (rnd(seed, i + 70) - 0.5) * 8 * fall, y - 4 + 10 * fall * fall, 1.6, 0.8 * (1 - fall), 1); } flush(C.dust); } }
    },
    // FIGHTER · Whirling Blades: three blades of light circle him while it lasts, a cut flashing round them every 0.6 s
    whirling_blades(ctx) {
      const { t, Cq } = ctx; if (ctx.at !== 'land') return;
      const life = 5, f = Math.min(1, t / 0.2) * Math.min(1, (life - t) / 0.4); if (f <= 0) return;
      over(Cq, 0.5);
      for (let b = 0; b < 3; b++) { const a = t * 4.2 + b * TAU / 3; for (let j = 0; j < 9; j++) { const aa = a - j * 0.08, g = f * (1 - j / 9), [x, y] = on(Cq, 1.7, aa, 18); const [x2, y2] = on(Cq, 0.95, aa, 15); seg(x2, y2, x, y, 0.8 * g, 1.6 * g, j ? 0.4 : 1.4); }
        const [hx, hy] = on(Cq, 1.7, a, 18); star(hx, hy, 6, 1.2 * f); }
      flush(C.cleaveHot, 1.6);
      under(Cq); ring(Cq, 1.6, 0.35 * f, 1.4); const p = (t % 0.6) / 0.6; if (p < 0.35) ring(Cq, 1.2 + 1.0 * p / 0.35, 1.2 * f * (1 - p / 0.35), 2); flush(C.cleave, 1.4);
    },
    // ROGUE · Kidney Shot: a short heavy blow, a dull crimson thud and the stun's stars (the stun itself: the aura)
    kidney_shot(ctx) {
      const { t, k, Tq } = ctx; if (ctx.at !== 'land') return;
      const x = Tq.sx, y = Tq.sy - 22; over(Tq, 0.9);
      if (t < 0.18) { const f = 1 - t / 0.18; disc(x, y, 5 + 9 * (1 - f), 1.2 * f, 1.1); for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + 0.3; seg(x + Math.cos(a) * 5, y + Math.sin(a) * 4, x + Math.cos(a) * (12 + 8 * (1 - f)), y + Math.sin(a) * (9 + 6 * (1 - f)), 1.2 * f, 0.2 * f, 0.7); } }
      star(x, y, 10, 1.3 * k); flush(C.stab, 1.5);
    },
    // ROGUE · Fan of Knives: five knives thrown out in a fan, glinting streaks; a cut on each foe they find
    fan_of_knives(ctx) {
      const { t, k, Cq, Tq, R } = ctx; if (ctx.at !== 'land') return;
      const a0 = Math.atan2((Tq.sy - Cq.sy) / EY, (Tq.sx - Cq.sx) / EX), u = clamp01(t / 0.25), d = 6 * ease(u);
      over(Cq, 0.6);
      for (let i = -2; i <= 2; i++) { const a = a0 + i * 0.175, [x1, y1] = on(Cq, 0.5 + d, a, 18), [x0, y0] = on(Cq, Math.max(0.5, 0.5 + d - 1.4), a, 18); if (u < 1) { seg(x0, y0, x1, y1, 0.2, 1.7, 0.9); star(x1, y1, 5, 1.4); } }
      flush(C.shadow, 1.8);
      if (u < 1) { over(Cq, 0.6); for (let i = -2; i <= 2; i++) { const [x1, y1] = on(Cq, 0.5 + d, a0 + i * 0.175, 18); disc(x1, y1, 1.2, 1.2, 0.6); } flush(C.cleaveHot, 1.4); }   // (the steel's glint at each point)
      for (const q of R) if (t > 0.12 && t < 0.5) { over(q, 0.8); const g = 1 - (t - 0.12) / 0.38; seg(q.sx - 7, q.sy - 28, q.sx + 7, q.sy - 18, 1.3 * g, 1.3 * g, 0.8); flush(C.stab, 1.3); }
      void k;
    },
    // ROGUE · Shadowstep: a puff of smoke where she stood, a crimson streak, smoke again behind the foe, and a sure cut
    shadowstep(ctx) {
      const { t, k, Tq, e, P, seed } = ctx; if (ctx.at !== 'land') return;
      const A = P(e.x, e.y);
      for (const [Q, d] of [[A, 0], [Tq, 0.12]]) { const v = clamp01((t - d) / 0.5); if (v <= 0 || v >= 1) continue; over(Q, 0.4); for (let i = 0; i < 10; i++) { const a = rnd(seed, i + d * 100) * TAU, r = 6 + 12 * v * rnd(seed, i + 9); disc(Q.sx + Math.cos(a) * r, Q.sy - 14 + Math.sin(a) * r * 0.5 - 10 * v, 3.6 + 3 * v, 0.45 * (1 - v), 2); } flush(C.smoke, 1.3); }
      if (t < 0.2) { over(Tq, 0.2); seg(A.sx, A.sy - 22, Tq.sx + 10, Tq.sy - 22, 0, 1.0 * (1 - t / 0.2), 1.2); flush(C.shadow, 1.4); }
      if (t > 0.12) { const x = Tq.sx, y = Tq.sy - 24, s = clamp01((t - 0.12) / 0.06), g = t < 0.3 ? 1 : 1 - (t - 0.3) / 0.4; over(Tq, 0.9); seg(x - 10, y - 10, x - 10 + 20 * s, y - 10 + 20 * s, 1.5 * g, 1.5 * g, 1.2); seg(x + 10, y - 10, x + 10 - 20 * s, y - 10 + 20 * s, 1.5 * g, 1.5 * g, 1.2); star(x, y, 14, 1.5 * g); flush(C.stab, 1.6); }
      void k;
    },
    // ROGUE · Caltrops: a handful thrown in an arc onto the knot; while it lies there, iron points glint on the floor and the ground stings
    caltrops(ctx) {
      const { t, Cq, Tq, seed } = ctx; if (ctx.at !== 'land') return;
      const life = 6, f = Math.min(1, (life - t) / 0.6); if (f <= 0) return;
      if (t < 0.3) { over(Tq, 0.4); for (let i = 0; i < 8; i++) { const v = clamp01(t / 0.3), a = rnd(seed, i) * TAU, r = 0.8 * rnd(seed, i + 5), [ex, ey] = on(Tq, r, a); disc(Cq.sx + (ex - Cq.sx) * v, Cq.sy - 20 + (ey - Cq.sy + 20) * v - 26 * Math.sin(v * Math.PI), 1.3, 1, 1); } flush(C.shadow, 1.2); }
      if (t > 0.25) { under(Tq); ring(Tq, 0.85, 0.55 * f, 1.2); pool(Tq, 0.85, 0.22 * f, 0, 0.8); flush(C.venom, 1.1); under(Tq);
        for (let i = 0; i < 16; i++) { const a = rnd(seed, i + 20) * TAU, r = 0.75 * Math.sqrt(rnd(seed, i + 30)), [x, y] = on(Tq, r, a), tw = 0.5 + 0.5 * Math.sin(t * 7 + i * 1.7); star(x, y - 1, 2.2, (0.4 + 0.8 * tw) * f); } flush(C.cleaveHot, 1.2); }
    },
    // MAGE · Flare: a burning rune marked on the floor under the knot, pulsing quicker, then a pillar of fire bursts up out of it
    flare(ctx) {
      const { t, k, Tq, seed } = ctx; if (ctx.at !== 'land') return;
      const RR = 1.8;
      if (t < 0.7) { const p = 0.5 + 0.5 * Math.sin(t * (10 + t * 30)); under(Tq); ring(Tq, RR, (0.5 + 0.5 * p) * clamp01(t / 0.15), 1.4); ring(Tq, RR * 0.6, 0.6 * clamp01(t / 0.25), 1); for (let i = 0; i < 6; i++) { const [x0, y0] = on(Tq, RR * 0.6, i * TAU / 6 + t), [x1, y1] = on(Tq, RR, i * TAU / 6 + t); seg(x0, y0, x1, y1, 0.6, 0.6); } flush(C.fire, 1.2); return; }
      const s = t - 0.7, g = 1 - s / 0.6; if (g <= 0) return;
      over(Tq, 0.7); column(Tq.sx, Tq.sy, 96 * ease(clamp01(s / 0.08)), 9 * g + 2, 1.6 * g); flush(C.fireHot, 1.3);
      under(Tq); ring(Tq, 0.3 + RR * ease(clamp01(s / 0.2)), 1.4 * g, 2); pool(Tq, RR, 0.6 * g); flush(C.fire, 1.2);
      over(Tq, 0.6); for (let i = 0; i < 14; i++) { const a = rnd(seed, i) * TAU, sp = 30 + 40 * rnd(seed, i + 4); disc(Tq.sx + Math.cos(a) * sp * s, Tq.sy - 20 - 60 * s + 90 * s * s + Math.sin(a) * sp * 0.4 * s, 1.4, 1.1 * g, 1); } flush(C.ember, 1.2); void k;
    },
    // MAGE · Gather: arcane threads spiral in on the knot's middle and draw the foes toward it (the pull: the sim's)
    gather(ctx) {
      const { t, k, Tq, R } = ctx; if (ctx.at !== 'land') return;
      const u = clamp01(t / 0.5);
      under(Tq); for (let s = 0; s < 4; s++) for (let j = 0; j <= 30; j++) { const v = j / 30, a = s * TAU / 4 + v * 4 - t * 6, r = 4 * (1 - v) * (1 - 0.6 * u); const [x, y] = on(Tq, r, a); mark(x, y, 0.9 * k * v); } ring(Tq, 4 * (1 - 0.75 * ease(u)), 0.8 * k, 1.4); flush(C.ward, 1.3);
      over(Tq, 0.4); for (const q of R) if (t < 0.6) { seg(q.sx, q.sy - 18, Tq.sx + (q.sx - Tq.sx) * 0.4, Tq.sy - 18 + (q.sy - Tq.sy) * 0.4, 0.2 * k, 1.0 * k, 0.6); } star(Tq.sx, Tq.sy - 16, 10 * u, 1.2 * k); flush(C.wardHot, 1.2);
    },
    // MAGE · Glacial Tomb: the frost glyph drawn under the knot, then ice stands up round each foe in it (the freeze: the aura)
    glacial_tomb(ctx) {
      const { t, k, Tq, R } = ctx; if (ctx.at !== 'land') return;
      const RR = 2.4, d = clamp01(t / 0.3);
      under(Tq); ring(Tq, RR, 1.0 * k, 1.5, 0, 0, TAU * d); ring(Tq, RR * 0.7, 0.7 * k, 1.1, 0, 0, TAU * d); for (let i = 0; i < 6; i++) { const a = i * TAU / 6, [x1, y1] = on(Tq, RR * d, a); seg(Tq.sx, Tq.sy, x1, y1, 0.9 * k, 0.4 * k, 0.4); const [bx, by] = on(Tq, RR * 0.55 * d, a); const [b1x, b1y] = on(Tq, RR * 0.75 * d, a + 0.25), [b2x, b2y] = on(Tq, RR * 0.75 * d, a - 0.25); seg(bx, by, b1x, b1y, 0.7 * k, 0.4 * k); seg(bx, by, b2x, b2y, 0.7 * k, 0.4 * k); } flush(C.frost, 1.3);
      const s = clamp01((t - 0.25) / 0.15); if (s > 0) { over(Tq, 0.3); for (const q of R) { for (let i = 0; i < 5; i++) { const a = i * TAU / 5 + 0.3, [x, y] = on(q, 0.45, a), h = (24 + 10 * (i % 2)) * s; seg(x - 2, y, x, y - h, 0.8 * k, 1.3 * k, 0.8); seg(x + 2, y, x, y - h, 0.5 * k, 1.0 * k); } if (t < 0.6) star(q.sx, q.sy - 30, 9, 1.3 * (1 - (t - 0.25) / 0.35)); } flush(C.frostHot, 1.3); }
    },
    // MAGE · Blizzard: a storm settles on the knot while it lasts: snow driven round in circles, a cold mist, its edge on the floor
    blizzard(ctx) {
      const { t, Tq, seed } = ctx; if (ctx.at !== 'land') return;
      const life = 6, f = Math.min(1, t / 0.4) * Math.min(1, (life - t) / 0.6), RR = 1.5; if (f <= 0) return;
      under(Tq); ring(Tq, RR, 0.7 * f, 1.3); pool(Tq, RR, 0.3 * f, 0, 0.8); flush(C.frost, 1.2);
      over(Tq, 0.5); for (let i = 0; i < 34; i++) { const a = rnd(seed, i) * TAU + t * (2.2 + rnd(seed, i + 5)), r = RR * Math.sqrt(rnd(seed, i + 9)), hh = ((t * (30 + 20 * rnd(seed, i + 13)) + rnd(seed, i + 17) * 50) % 50); const [x, y] = on(Tq, r, a, 50 - hh); disc(x, y, 1.2, 0.9 * f, 1); if (i % 4 === 0) seg(x, y, x - 4, y - 1, 0.6 * f, 0); } flush(C.frostHot, 1.2);
    },
    // CLERIC · Sanctuary: a circle of green-gold light under the hurt, pulsing as it heals (8 pulses), motes going up the warded
    sanctuary(ctx) {
      const { t, Tq, R } = ctx; if (ctx.at !== 'land') return;
      const life = 4, f = Math.min(1, t / 0.3) * Math.min(1, (life - t) / 0.4), RR = 1.25; if (f <= 0) return;
      under(Tq); ring(Tq, RR, 1.0 * f, 1.6); ring(Tq, RR * 0.8, 0.5 * f, 1, 0, 0, TAU); pool(Tq, RR, 0.32 * f, 0, 0.7); flush(C.breath, 1.2);
      const p = (t % 0.5) / 0.5; under(Tq); ring(Tq, RR * (0.2 + 0.8 * p), 0.8 * f * (1 - p), 1.3); flush(C.mend, 1.2);
      for (const q of R) { over(q, 0.5); for (let i = 0; i < 4; i++) { const v = ((t * 0.9) + i / 4) % 1; disc(q.sx + Math.sin(i * 2.1 + t) * 7, q.sy - 6 - v * 44, 1.6, 1.0 * f * (1 - v), 1); } flush(C.breath, 1.3); }
    },
    // CLERIC · Consecrate: gold holy ground on the knot while it lasts, a cross of light in a ring, motes going up; the dead on it smoke
    consecrate(ctx) {
      const { t, Tq, R } = ctx; if (ctx.at !== 'land') return;
      const life = 8, f = Math.min(1, t / 0.35) * Math.min(1, (life - t) / 0.6), RR = 1.0; if (f <= 0) return;
      under(Tq); ring(Tq, RR, 1.0 * f, 1.5); pool(Tq, RR, 0.35 * f, 0, 0.8); for (const a of [0, Math.PI / 2]) { const [x0, y0] = on(Tq, RR * 0.85, a), [x1, y1] = on(Tq, RR * 0.85, a + Math.PI); seg(x0, y0, x1, y1, 0.9 * f, 0.9 * f, 0.7); } flush(C.bless, 1.3);
      over(Tq, 0.4); for (let i = 0; i < 8; i++) { const v = ((t * 0.5) + i / 8) % 1, [x, y] = on(Tq, RR * 0.8 * ((i * 37) % 10) / 10, i * 2.4); disc(x, y - v * 40, 1.3, 0.9 * f * (1 - v), 1); } flush(C.turn, 1.2);
      for (const q of R) { const p = (t % 1) ; if (p < 0.3) { over(q, 0.6); star(q.sx, q.sy - 24, 7, 1.1 * f * (1 - p / 0.3)); flush(C.turn); } }
    },
    // CLERIC · Revive: she kneels, a thread of gold from her to the Downed; then a pillar of light on them and they stand
    revive(ctx) {
      const { t, Cq, Tq } = ctx; if (ctx.at !== 'land') return;
      if (t < 1.2) { const u = t / 1.2; under(Cq); ring(Cq, 0.5 + 0.2 * Math.sin(t * 8), 0.9, 1.3); flush(C.bless, 1.2); over(Tq, 0.3); const g = 0.4 + 0.6 * u; for (let i = 0; i <= 24; i++) { const v = i / 24; mark(Cq.sx + (Tq.sx - Cq.sx) * v, Cq.sy - 26 + (Tq.sy - 6 - (Cq.sy - 26)) * v - 10 * Math.sin(v * Math.PI), g * (0.4 + 0.6 * ((v * 6 - t * 4) % 1 + 1) % 1)); } under(Tq); pool(Tq, 0.6 * u, 0.6 * u); flush(C.mend, 1.3); return; }
      const s = t - 1.2, g = 1 - s / 0.5; if (g <= 0) return;
      over(Tq, 0.5); column(Tq.sx, Tq.sy, 90, 7, 1.7 * g); star(Tq.sx, Tq.sy - 40, 18, 1.5 * g); flush(C.turn, 1.4);
      under(Tq); ring(Tq, 0.3 + 1.3 * ease(clamp01(s / 0.3)), 1.3 * g, 1.8); flush(C.mend, 1.3);
    },
    // CLERIC · Judgement: her glyph on the floor round the foe, six pillars striking down round it, then the great pillar on it
    judgement(ctx) {
      const { t, Tq, R } = ctx; if (ctx.at !== 'land') return;
      const RR = 2.2, g0 = clamp01(t / 0.25), out = t < 1.2 ? 1 : 1 - (t - 1.2) / 0.4; if (out <= 0) return;
      under(Tq); ring(Tq, RR, 0.9 * g0 * out, 1.4); ring(Tq, RR * 0.6, 0.6 * g0 * out, 1); for (let i = 0; i < 12; i++) { const a = i * TAU / 12 + t * 0.6, [x0, y0] = on(Tq, RR * 0.6, a), [x1, y1] = on(Tq, RR, a); seg(x0, y0, x1, y1, 0.6 * out, 0.6 * out); } flush(C.bless, 1.2);
      for (let i = 0; i < 6; i++) { const at = 0.2 + i * 0.08, s = t - at; if (s < 0 || s > 0.4) continue; const [x, y] = on(Tq, RR * 0.8, i * TAU / 6 + 0.5), g = 1 - s / 0.4; over(Tq, 0.3); column(x, y, 70 * ease(clamp01(s / 0.06)), 3.5, 1.4 * g); flush(C.turn, 1.3); under(Tq); disc(x, y, 5, 0.9 * g, 1.2); flush(C.bless); }
      const s = t - 0.8; if (s > 0 && s < 0.6) { const g = 1 - s / 0.6; over(Tq, 0.6); column(Tq.sx, Tq.sy, 110 * ease(clamp01(s / 0.07)), 10 * g + 3, 1.8 * g); star(Tq.sx, Tq.sy - 30, 22, 1.5 * g); flush(C.turn, 1.5); under(Tq); ring(Tq, 0.4 + 2.4 * ease(clamp01(s / 0.3)), 1.4 * g, 2); flush(C.bless, 1.3); for (const q of R) { over(q, 0.7); star(q.sx, q.sy - 24, 9, 1.2 * g); flush(C.turn); } }
    },
    // SHAMAN · Binding Roots: green roots wind up out of the floor round each foe in the knot (the root itself: the aura)
    binding_roots(ctx) {
      const { t, k, Tq, R, seed } = ctx; if (ctx.at !== 'land') return;
      const u = ease(clamp01(t / 0.35));
      under(Tq); ring(Tq, 1.25 * u, 0.8 * k, 1.3); flush(C.hex, 1.2);
      over(Tq, 0.3); for (const q of R) for (let i = 0; i < 5; i++) { const a = i * TAU / 5 + rnd(seed, i) * 0.6, [x, y] = on(q, 0.42, a); let px = x, py = y; const h = 26 * u; for (let j = 1; j <= 6; j++) { const v = j / 6, nx = x + Math.sin(v * 7 + i + t * 3) * 4 * v, ny = y - h * v; seg(px, py, nx, ny, 1.1 * k, 1.1 * k * (1 - v * 0.5), 0.6); px = nx; py = ny; } } flush(C.hex, 1.4);
    },
    // SHAMAN · Old Marks: a strike that brands a mark on the foe (one, two, three hung over it); the third breaks them in a burst
    old_marks(ctx) {
      const { t, k, Tq, e } = ctx; if (ctx.at !== 'land') return;
      const n = e.marks || 1; over(Tq, 0.8);
      if (n < 3) { for (let i = 0; i < n; i++) { const x = Tq.sx + (i - (n - 1) / 2) * 9, y = Tq.sy - 44; oval(x, y, 3.2, 3.2, 1.3 * k, 1); seg(x, y - 3, x, y + 3, 1.1 * k, 1.1 * k); } star(Tq.sx, Tq.sy - 24, 7, 1.1 * k); flush(C.hexV, 1.4); return; }
      const g = 1 - t / 0.6; if (g <= 0) return; for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i - 1) * 0.6, r = 9 + 26 * ease(clamp01(t / 0.3)); disc(Tq.sx + Math.cos(a) * r, Tq.sy - 44 + Math.sin(a) * r * 0.6, 3, 1.4 * g, 1); }
      star(Tq.sx, Tq.sy - 30, 20 * (0.5 + 0.5 * g), 1.6 * g); flush(C.hexV, 1.5); under(Tq); ring(Tq, 0.3 + 1.4 * ease(clamp01(t / 0.3)), 1.3 * g, 1.8); flush(C.drain, 1.3);
    },
    // SHAMAN · Spirit Totem: a spirit post stands near the party while it lasts: its pull goes in in rings every 1.5 s, its ward a ring on the floor
    spirit_totem(ctx) {
      const { t, Tq } = ctx; if (ctx.at !== 'land') return;
      const life = 8, f = Math.min(1, t / 0.3) * Math.min(1, (life - t) / 0.5); if (f <= 0) return;
      over(Tq, 0.4); column(Tq.sx, Tq.sy, 40, 2, 1.0 * f); oval(Tq.sx, Tq.sy - 46, 6, 7, 1.2 * f, 1.2, Math.PI, TAU); seg(Tq.sx - 7, Tq.sy - 46, Tq.sx + 7, Tq.sy - 46, 1.2 * f, 1.2 * f); star(Tq.sx, Tq.sy - 40, 6, (0.6 + 0.4 * Math.sin(t * 5)) * f); flush(C.singHot, 1.3);
      under(Tq); ring(Tq, 2.5, 0.55 * f, 1.3); pool(Tq, 2.5, 0.12 * f, 0, 0.6); flush(C.drain, 1.1);
      const p = (t % 1.5) / 1.5; if (p < 0.6) { const v = p / 0.6; under(Tq); ring(Tq, 4 - 3.4 * ease(v), 1.0 * f * (1 - v), 1.6); flush(C.sing, 1.3); }
    },
    // SHAMAN · Thunder Drum: a drum's beat thrown out from the shaman in hard rings; each foe it reaches flung back, a flash on it
    thunder_drum(ctx) {
      const { t, k, Cq, R } = ctx; if (ctx.at !== 'land') return;
      under(Cq); for (const d of [0, 0.12]) { const u = clamp01((t - d) / 0.3); if (u > 0 && u < 1) ring(Cq, 0.4 + 2.4 * ease(u), 1.5 * (1 - u), 2.2); } pool(Cq, 0.9, 0.5 * k); flush(C.drain, 1.4);
      over(Cq, 0.5); if (t < 0.2) star(Cq.sx, Cq.sy - 42, 14, 1.4 * (1 - t / 0.2)); flush(C.singHot, 1.3);
      for (const q of R) if (t > 0.08 && t < 0.5) { const g = 1 - (t - 0.08) / 0.42, dx = q.sx - Cq.sx, dy = q.sy - Cq.sy, l = Math.hypot(dx, dy) || 1; over(q, 0.6); seg(q.sx - dx / l * 14, q.sy - 20 - dy / l * 7, q.sx, q.sy - 20, 0.1, 1.2 * g, 0.8); star(q.sx, q.sy - 22, 8, 1.2 * g); flush(C.drain, 1.3); }
    },

    // ── the fight's other moments ─────────────────────────────────────────────────────────────────────────────────
    // a foe's warning ('windup', battle.js attack: the telegraph grammar, docs/combat-fx.md), Luminati's markers drawn in
    // our light. A heavy blow (an elite's, a boss's): a ring on the floor under the one it's meant for, its fill running
    // out to the rim as the blow comes, the rim going white as it lands. A shot: a lane on the floor from the shooter to
    // its mark, filling toward the mark until the shot lands; it follows both until the release, then its start holds
    // (locked: its edges flash) while the end stays on the mark, as the bolt does. A light shot's lane is thinner and
    // fainter, so a room of archers doesn't paint the floor; a light blow has none (Luminati marks nothing that small).
    warn(ctx) {
      const { t, Cq, Tq, e, mem } = ctx, wind = e.wind || 0.38, T = wind + (e.fly || 0), hit = t >= T, out = hit ? 1 - (t - T) / 0.16 : 1;
      if (out <= 0) return;
      const p = clamp01(t / T), g = e.heavy ? 1 : 0.62;
      if (!e.bolt) {
        const RR = e.boss ? WARN_R.boss : WARN_R.heavy, f = RR * ease(p);   // (wider than the feet's rings: at 0.95 a melee's figures hid it)
        under(Tq); pool(Tq, f, (0.24 + 0.36 * p) * out, 0, 0.45); ring(Tq, f, 0.7 * out, 1.2); flush(C.warn);
        under(Tq); ring(Tq, RR, (0.6 + 0.5 * p) * out, 1.8); flush(hit ? C.warnHot : C.warn, hit ? 1.5 : 1.1);
        return;
      }
      if (t >= wind && !mem.lock) mem.lock = { sx: Cq.sx, sy: Cq.sy, h: Cq.h, key: Cq.key };
      const A = mem.lock || Cq, B = Tq, dx = B.sx - A.sx, dy = B.sy - A.sy;
      const wl = Math.hypot(dx / EX, dy / EY); if (wl < 0.3) return;
      const hw = (e.heavy ? 0.3 : 0.2), nx = (-dy / EY / wl) * hw * EX, ny = (dx / EX / wl) * hw * EY, w = Math.max(1, Math.hypot(nx, ny) - 0.5);
      const lock = mem.lock && t - wind < 0.09, N = 8;
      for (let i = 0; i < N; i++) {                              // in pieces, each at its own depth along the floor
        const u0 = i / N, u1 = (i + 1) / N, x0 = A.sx + dx * u0, y0 = A.sy + dy * u0, x1 = A.sx + dx * u1, y1 = A.sy + dy * u1;
        depth(A.key + (B.key - A.key) * (u0 + u1) / 2 - 0.25, A.sy + dy * (u0 + u1) / 2, A.h + (B.h - A.h) * (u0 + u1) / 2);
        if (u0 < p) { const s = Math.min(1, (p - u0) * N), a = (0.14 + 0.3 * p) * g * out; seg(x0, y0, x0 + (x1 - x0) * s, y0 + (y1 - y0) * s, a, a, w); }
        flush(C.warn);
        seg(x0 + nx, y0 + ny, x1 + nx, y1 + ny, 0.5 * g * out); seg(x0 - nx, y0 - ny, x1 - nx, y1 - ny, 0.5 * g * out);
        flush(lock || hit ? C.warnHot : C.warn, lock ? 1.3 : 1);
      }
      if (p < 1) { const hx = A.sx + dx * p, hy = A.sy + dy * p; depth(A.key + (B.key - A.key) * p - 0.2, hy, A.h); disc(hx, hy, 2.2, 0.9 * g, 1); flush(C.warnHot); }   // the fill's front
      under(B); ring(B, e.heavy ? 0.6 : 0.42, (hit ? 1.2 : 0.35 + 0.4 * p) * g * out, 1.2); flush(hit ? C.warnHot : C.warn);   // the mark, white as it lands
    },
    // a ward spent (battle.js 'wardBreak'): the dome flashes and shatters, its shards thrown out and falling, a ring at
    // the feet (it went out with nothing before: docs/combat-fx.md's notes)
    ward_break(ctx) {
      const { t, k, Tq, seed } = ctx;
      over(Tq, 0.8);
      if (t < 0.12) { const f = 1 - t / 0.12; oval(Tq.sx, Tq.sy - 22, 13 + 3 * (1 - f), 21 + 3 * (1 - f), 1.4 * f, 1.3); star(Tq.sx, Tq.sy - 30, 11, 1.3 * f); }
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU + rnd(seed, i) * 0.35, sp = 42 + 46 * rnd(seed, i + 5), x0 = Tq.sx + Math.cos(a) * 13, y0 = Tq.sy - 22 + Math.sin(a) * 21;
        const x = x0 + Math.cos(a) * sp * t, y = y0 + Math.sin(a) * sp * 0.6 * t + 130 * t * t, sp2 = 1.2 + rnd(seed, i + 9), tw = Math.abs(Math.sin(t * 22 * sp2 + i));
        seg(x, y, x - Math.cos(a + 1.3) * 4, y - Math.sin(a + 1.3) * 4, (0.6 + 0.6 * tw) * k, 0.3 * k, 0.5);
      }
      flush(C.wardHot, 1.1);
      under(Tq); ring(Tq, 0.45 + 0.9 * ease(clamp01(t / 0.3)), 0.8 * k, 1.3); flush(C.ward);
    },
    // a level gained ('levelUp'): a column of gold going up from the feet, two rings out over the floor, motes spiralling
    // up the column and a star breaking over the head (it was a banner and a sound)
    level_up(ctx) {
      const { t, k, Tq } = ctx, up = clamp01(t / 0.25), hold = t < 0.25 ? 1 : 1 - (t - 0.25) / 1.55;
      over(Tq, 0.4); column(Tq.sx, Tq.sy, 86 * up, 4.5, 1.3 * hold); flush(C.lvl);
      under(Tq); for (const d of [0, 0.35]) { const u = clamp01((t - d) / 0.65); if (u > 0 && u < 1) ring(Tq, 0.3 + 1.4 * ease(u), 1.1 * (1 - u), 1.6); } pool(Tq, 0.7, 0.5 * k); flush(C.lvl);
      over(Tq, 0.7);
      for (let i = 0; i < 14; i++) { const v = clamp01(t * 0.9 - i * 0.04); if (v <= 0 || v >= 1) continue; const a = v * 10 + (i * TAU) / 14; disc(Tq.sx + Math.cos(a) * 12 * (1 - v * 0.5), Tq.sy - 6 - v * 72 + Math.sin(a) * 4, 1.5, 1.1 * (1 - v), 1); }
      if (t > 0.22 && t < 0.72) { const f = 1 - (t - 0.22) / 0.5; star(Tq.sx, Tq.sy - 64, 4 + 12 * f, 1.3 * f); }
      flush(C.lvlHot);
    },
    // the Quartermaster issues ('bossIssue'): a brass streak from him to the most broken of his ranks, three blades of
    // light closing on the man, a rack-light standing over him and a ring at his feet: he stands up whole
    boss_issue(ctx) {
      const { t, k, Cq, Tq } = ctx;
      if (t < 0.3 && Math.hypot(Cq.sx - Tq.sx, Cq.sy - Tq.sy) > 6) {
        const f = 1 - t / 0.3, u = clamp01(t / 0.18); over(Tq, 0.3);
        seg(Cq.sx, Cq.sy - 32, Cq.sx + (Tq.sx - Cq.sx) * u, Cq.sy - 32 + (Tq.sy - 26 - (Cq.sy - 32)) * u, 0.2 * f, 1.0 * f, 0.8); star(Cq.sx, Cq.sy - 32, 6, 0.9 * f); flush(C.issueHot);
      }
      const s = clamp01((t - 0.15) / 0.2); if (s <= 0) return;
      over(Tq, 0.6);
      for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i - 1) * 1.15, r = 28 * (1 - s), x = Tq.sx + Math.cos(a) * r, y = Tq.sy - 26 + Math.sin(a) * r * 0.8; seg(x, y, x + Math.cos(a) * 9, y + Math.sin(a) * 7, 1.1 * k, 0.2 * k, 0.6); }
      if (s >= 1 && t < 0.62) star(Tq.sx, Tq.sy - 26, 11, 1.3 * (1 - (t - 0.35) / 0.27));
      flush(C.issueHot);
      over(Tq, 0.4); column(Tq.sx, Tq.sy, 50 * s, 3, 0.95 * k); flush(C.issue);
      under(Tq); ring(Tq, 0.3 + 0.8 * ease(s), 0.95 * k, 1.4); pool(Tq, 0.5, 0.45 * k); flush(C.issue);
    },
    // Garrow calls his men ('bossCall'): the call thrown out in red rings from him, a line to each man, and each one
    // standing in a red flash at his post
    boss_call(ctx) {
      const { t, k, Cq, R } = ctx;
      under(Cq); for (const d of [0, 0.18]) { const u = clamp01((t - d) / 0.5); if (u > 0 && u < 1) ring(Cq, 0.4 + 2.4 * ease(u), 1.2 * (1 - u), 1.6); } flush(C.call);
      if (t < 0.45) { over(Cq, 0.5); star(Cq.sx, Cq.sy - 40, 9, 1.2 * (1 - t / 0.45)); flush(C.callHot); }
      for (const q of R) {
        const s = clamp01((t - 0.12) / 0.2); if (s <= 0) continue;
        over(q, 0.3); if (t < 0.6) seg(Cq.sx, Cq.sy - 30, q.sx, q.sy - 24, 0.5 * (1 - t / 0.6), 0.15 * (1 - t / 0.6), 0.5);
        column(q.sx, q.sy, 40 * s, 3, 0.9 * k); flush(C.call);
        under(q); ring(q, 0.25 + 0.6 * ease(s), 1.0 * k, 1.3); flush(C.callHot);
      }
    },
    // the Stranger kindles ('bossKindle'): a streak of fire from him to where the last of them fell, and a minion
    // kindled there: a ring of fire on the floor, flames standing up, cinders going up the column
    boss_kindle(ctx) {
      const { t, k, Cq, Tq, seed } = ctx;
      if (t < 0.3 && Math.hypot(Cq.sx - Tq.sx, Cq.sy - Tq.sy) > 6) { const f = 1 - t / 0.3, u = clamp01(t / 0.2); over(Tq, 0.3); seg(Cq.sx, Cq.sy - 34, Cq.sx + (Tq.sx - Cq.sx) * u, Cq.sy - 34 + (Tq.sy - 6 - (Cq.sy - 34)) * u, 0.2 * f, 1.1 * f, 0.9); flush(C.kindleHot); }
      const s = clamp01((t - 0.15) / 0.3); if (s <= 0) return;
      under(Tq); ring(Tq, 0.7 * ease(s), 1.1 * k, 1.6); pool(Tq, 0.75 * s, 0.55 * k); flush(C.kindle);
      over(Tq, 0.5);
      for (let i = 0; i < 7; i++) { const a = (i / 7) * TAU + rnd(seed, i) * 0.6, [x, y] = on(Tq, 0.55 * s, a), h = (10 + 12 * rnd(seed, i + 3)) * s * (0.7 + 0.3 * Math.sin(t * 20 + i)); for (let j = 0; j <= 6; j++) { const v = j / 6; disc(x + Math.sin(t * 16 + i + v * 4) * 1.5, y - v * h, 1.2, 0.9 * k * (1 - v * 0.8), 1); } }
      flush(C.kindle, 1.05);
      for (let i = 0; i < 10; i++) { const v = (t * 0.9 + i / 10) % 1; disc(Tq.sx + Math.sin(i * 2.4 + t * 5) * 7 * (1 - v), Tq.sy - 4 - v * 56 * s, 1.3, 1.1 * k * (1 - v), 1); }
      flush(C.kindleHot);
    },
    // Skarn drums ('bossSwarm'): three beats thrown out over the floor from him, and dust going up where the goblins come
    // out of the tunnels
    boss_swarm(ctx) {
      const { t, k, Cq, R, seed } = ctx;
      under(Cq); for (const d of [0, 0.28, 0.56]) { const u = clamp01((t - d) / 0.42); if (u > 0 && u < 1) ring(Cq, 0.4 + 2.2 * ease(u), 1.15 * (1 - u), 1.7); } flush(C.drum);
      over(Cq, 0.5); for (const d of [0, 0.28, 0.56]) { const u = (t - d) / 0.16; if (u > 0 && u < 1) star(Cq.sx, Cq.sy - 44, 8, 1.1 * (1 - u)); } flush(C.drum);
      for (const q of R) {
        const s = clamp01((t - 0.25) / 0.6); if (s <= 0 || s >= 1) continue;
        over(q, 0.3); for (let i = 0; i < 9; i++) { const a = rnd(seed, i) * TAU, r = (0.3 + 0.7 * s) * (0.6 + 0.4 * rnd(seed, i + 4)), [x, y] = on(q, r, a, 6 + 18 * s * rnd(seed, i + 8)); disc(x, y, 3 + 3 * s, 0.32 * (1 - s), 2.2); }
        flush(C.dust);
      }
      void k;
    },
    // the Choir raises another singer ('bossVespers'): a pale column where she stands up out of the stalls, a ring, and
    // a thread of song from the Choir to her
    boss_vespers(ctx) {
      const { t, k, Cq, Tq } = ctx, s = clamp01(t / 0.3);
      if (t < 0.7 && Math.hypot(Cq.sx - Tq.sx, Cq.sy - Tq.sy) > 6) { over(Tq, 0.2); const g = 0.5 * (1 - t / 0.7), dx = Tq.sx - Cq.sx, dy = Tq.sy - Cq.sy;
        for (let i = 0; i <= 36; i++) { const u = i / 36, w = Math.sin(u * Math.PI * 4 - t * 14) * 3; mark(Cq.sx + dx * u - dy / 60 * w, Cq.sy - 30 + dy * u + dx / 60 * w - 6 * Math.sin(u * Math.PI), g); } flush(C.sing); }
      over(Tq, 0.4); column(Tq.sx, Tq.sy, 70 * s, 3.5, 1.1 * k); flush(C.sing);
      under(Tq); ring(Tq, 0.3 + 0.9 * ease(s), 1.0 * k, 1.4); pool(Tq, 0.55, 0.45 * k); flush(C.singHot);
    },
    // the Abbess's bell ('bossFlood'): a bell's shape flashing over her, and its toll in three pale rings going out over
    // the floor (the water comes in after it)
    boss_bells(ctx) {
      const { t, k, Cq } = ctx;
      if (t < 0.5) { const f = 1 - t / 0.5, sw = Math.sin(t * 26) * 3 * f; over(Cq, 0.6); oval(Cq.sx + sw, Cq.sy - 58, 7, 8, 1.1 * f, 1, Math.PI, TAU); seg(Cq.sx - 8 + sw, Cq.sy - 58, Cq.sx + 8 + sw, Cq.sy - 58, 1.1 * f, 1.1 * f); star(Cq.sx + sw, Cq.sy - 52, 8, 1.2 * f); flush(C.bellHot); }
      under(Cq); for (const d of [0, 0.25, 0.5]) { const u = clamp01((t - d) / 1.0); if (u > 0 && u < 1) ring(Cq, 0.5 + 4.5 * ease(u), 1.05 * (1 - u), 1.5); } flush(C.bell);
      void k;
    },
    // the Toadking stamps ('bossMud'): a ring off his foot, and one welling up under each of the party where the mud comes
    boss_mud(ctx) {
      const { t, k, Cq, R } = ctx;
      under(Cq); { const u = ease(clamp01(t / 0.35)); ring(Cq, 0.4 + 1.8 * u, 1.1 * (1 - u), 1.8); } flush(C.mud);
      for (const q of R) { const u = ease(clamp01((t - 0.1) / 0.5)); if (u <= 0) continue; under(q); ring(q, 0.4 + 1.2 * u, 0.8 * k, 1.3); flush(C.mud); }
    },
  };
  // the firebolt in flight: a roaring head over the ordinary bolt's trail, embers shed behind it (renderer boltFx)
  function fireHead(pts, key, footY, baseH, now) {
    const h = pts[pts.length - 1]; if (!h) return;
    depth(key + 0.25, footY, baseH);
    disc(h.sx, h.sy, 11 + Math.sin(now / 40) * 1.5, 0.85, 1.7); disc(h.sx, h.sy, 4.2, 1.8, 0.8);   // (larger than the plain bolt's: in a real fight at first it passed for one)
    const p = pts[0], dx = h.sx - p.sx, dy = h.sy - p.sy;
    for (let i = 0; i < 10; i++) { const u = ((now / 260) + i / 10) % 1, wob = Math.sin(now / 50 + i * 2) * 3; disc(h.sx - dx * u * 1.6 + wob * 0.5, h.sy - dy * u * 1.6 + wob - u * 6, 1.4, 1.3 * (1 - u), 1); }
    flush(C.fire, 1.1);
    depth(key + 0.3, footY, baseH); star(h.sx, h.sy, 6, 0.9); flush(C.fireHot);
  }

  // ── the auras: what a skill leaves on someone while it lasts (the sim's state, read every frame) ───────────────
  function auras(now, units) {
    const t = now / 1000;
    for (const v of units) {
      const u = v.u; if (!u) continue;
      const q = v;
      if (!v.foe) {
        const b = u.buff || {};
        if (b.wall > 0) { const f = Math.min(1, b.wall / 0.8); under(q);   // a ring of plates at the fighter's feet, turning slowly, a pulse going out
          for (let i = 0; i < 6; i++) { const a0 = i * TAU / 6 + t * 0.6; ring(q, 0.66, 0.9 * f, 1.6, 0, a0, a0 + TAU / 6 - 0.22); const [x, y] = on(q, 0.66, a0 + 0.2); seg(x, y, x, y - 7, 0.8 * f, 0.1 * f); }
          const p = (t % 1.2) / 1.2; ring(q, 0.66 + p * 0.7, 0.6 * f * (1 - p), 1.2); flush(C.wall); }
        if (b.smoke > 0) { const f = Math.min(1, b.smoke / 0.8);   // a cloud of smoke round them while it lasts (the owner, 2026-11-08: "smoke lingers for the duration of the buff, brighter")
          under(q); pool(q, 0.85, 0.32 * f, 0, 0.9); flush(C.smoke, 1.2); over(q, 0.4);
          for (let i = 0; i < 9; i++) { const a = t * 1.3 + i * 0.7, rr = 9 + 4 * Math.sin(t * 0.9 + i); disc(q.sx + Math.cos(a) * rr, q.sy - 8 - ((t * 8 + i * 5) % 34) + Math.sin(a) * 4, 4.6, 0.36 * f, 2); }
          flush(C.smoke); }
        if (b.bless > 0) { const f = Math.min(1, b.bless / 0.8); over(q, 0.8); oval(q.sx, q.sy - 52, 7.5, 2.6, (0.85 + 0.25 * Math.sin(t * 4)) * f, 1.1); flush(C.bless); }   // the halo
        if (b.breath > 0) { const f = Math.min(1, b.breath / 0.8); over(q, 0.5);   // leaves going up them
          for (let i = 0; i < 3; i++) { const v2 = ((t / 1.4) + i / 3) % 1, a = v2 * 8 + i * 2; disc(q.sx + Math.cos(a) * 9, q.sy - 4 - v2 * 46 + Math.sin(a) * 3, 1.3, 0.85 * f * (1 - v2), 1); }
          flush(C.breath); }
        if (u.ward > 0) { over(q, 0.7);   // the dome, a light running round it
          const s = (t * 0.9) % 1; oval(q.sx, q.sy - 22, 13, 21, 0.22, 1); oval(q.sx, q.sy - 22, 13, 21, 0.6, 1.1, -Math.PI / 2 + s * TAU, -Math.PI / 2 + s * TAU + 0.9); oval(q.sx, q.sy - 4, 12, 4, 0.3, 1);   // (held quiet: on two or three of the party at once, brighter read as a wall of ovals)
          for (let i = 0; i < 3; i++) { const tw = Math.max(0, Math.sin(t * 5 + i * 2.2)); if (tw > 0.6) star(q.sx + Math.cos(i * 2.1) * 8, q.sy - 22 + Math.sin(i * 2.1) * 13, 3, (tw - 0.6) * 2); }
          flush(C.ward); }
      } else {
        if (u.dead || u.hp <= 0) continue;
        // (the proposed statuses, docs/skill-trees-proposal.md §2: drawn from the state once the sim keeps them)
        if (u.stun > 0) { const f = Math.min(1, u.stun / 0.3); over(q, 0.9); for (let i = 0; i < 3; i++) { const a = t * 5 + i * TAU / 3; star(q.sx + Math.cos(a) * 9, q.sy - 50 + Math.sin(a) * 3, 3.2, 1.1 * f); } flush(C.stun, 1.3); }
        if (u.frozen > 0) { const f = Math.min(1, u.frozen / 0.3); over(q, 0.95); oval(q.sx, q.sy - 22, 12, 24, 0.9 * f, 1.3); for (let i = 0; i < 4; i++) { const tw = 0.5 + 0.5 * Math.sin(t * 6 + i * 2); star(q.sx - 8 + i * 5, q.sy - 40 + (i % 2) * 22, 3, tw * f); } flush(C.frostHot, 1.2); under(q); pool(q, 0.55, 0.45 * f); ring(q, 0.55, 0.8 * f, 1.3); flush(C.frost, 1.2); }
        if (u.rooted > 0) { const f = Math.min(1, u.rooted / 0.3); under(q); ring(q, 0.45, 0.8 * f, 1.3); flush(C.root, 1.2); over(q, 0.4); for (let i = 0; i < 4; i++) { const a = i * TAU / 4 + 0.4, [x, y] = on(q, 0.4, a); seg(x, y, x + Math.sin(t * 2 + i) * 3, y - 14, 1.0 * f, 0.3 * f, 0.5); } flush(C.root, 1.2); }
        if (u.knocked > 0) { const f = Math.min(1, u.knocked / 0.3); under(q); pool(q, 0.6, 0.35 * f, 0, 1.2); flush(C.dust, 1.2); over(q, 0.9); for (let i = 0; i < 2; i++) { const a = t * 4 + i * Math.PI; star(q.sx + Math.cos(a) * 7, q.sy - 26 + Math.sin(a) * 3, 2.6, 0.9 * f); } flush(C.stun, 1.2); }
        if (u.slow > 0) { const f = Math.min(1, u.slow / 0.6); under(q); ring(q, 0.45, 0.6 * f, 1.1); pool(q, 0.4, 0.25 * f); flush(C.frost);   // rime at the feet, snow falling on them
          over(q, 0.5); for (let i = 0; i < 5; i++) { const v2 = ((t * 0.7) + i / 5) % 1, x = q.sx - 9 + i * 4.5 + Math.sin(t * 2 + i) * 2.5, y = q.sy - 48 + v2 * 40;   // snowflakes falling on them, big enough to read (the owner, 2026-11-08: "bigger falling snow flakes")
            star(x, y, 2.6, 0.9 * f * (1 - v2 * 0.7)); disc(x, y, 1.2, 0.9 * f * (1 - v2 * 0.7), 1); } flush(C.frostHot, 1.2); }
        if (u.poison && u.poison.t > 0) { const f = Math.min(1, u.poison.t / 0.6); over(q, 0.5);   // bubbles going up off them, a sick glow under
          for (let i = 0; i < 3; i++) { const v2 = ((t * 1.1) + i / 3) % 1; disc(q.sx - 5 + i * 5, q.sy - 30 - v2 * 18, 1.2 + v2, 0.8 * f * (1 - v2), 1); }
          flush(C.venom); under(q); pool(q, 0.35, 0.35 * f); flush(C.venom); }
        if (u.drain && u.drain.n > 0 && u.drain.t > 0) { over(q, 0.6);   // the stacks: a mote apiece circling them
          for (let i = 0; i < u.drain.n; i++) { const a = t * 3.2 + i * TAU / u.drain.n; disc(q.sx + Math.cos(a) * 10, q.sy - 26 + Math.sin(a) * 4, 1.4, 1.0, 1); }
          flush(C.drain); }
        if (u.hex && u.hex.t > 0) { const f = Math.min(1, u.hex.t / 0.6); under(q);   // a mark under them, and the life sinking out
          ring(q, 0.42, 0.6 * f, 1); for (let i = 0; i < 3; i++) { const a = t * 0.8 + i * TAU / 3, [x, y] = on(q, 0.42, a); disc(x, y, 1.3, 0.9 * f, 1); } flush(C.hex);
          over(q, 0.5); for (let i = 0; i < 2; i++) { const v2 = ((t * 0.7) + i / 2) % 1; disc(q.sx + (i ? 4 : -4), q.sy - 40 + v2 * 30, 1.3, 0.7 * f * (1 - v2), 1); } flush(C.hexV); }
      }
    }
  }

  // ── what holds through a boss fight (the sim's state, every frame) ──────────────────────────────────────────────
  //   the Standard's line: a ring of its reach turning on the floor round it, and over each of the Ashbound it covers
  //     (battle.js halved: they take half) a small shield of its light, a thread back to it;
  //   Teague's lit cage: the lantern burning, and while he's hurt its light drawn along a thread into him (he mends);
  //   Garrow's men: while they stand, a red thread from each to him and a shield over him (he takes half);
  //   the Choir's singing: notes going up off each singer, and the hall's dead mending in their light (motes rising).
  function bossAuras(now, units, at) {
    const t = now / 1000, up = (o) => o && o.u && o.u.hp > 0 && !o.u.dead;
    const foes = units.filter((v) => v.foe && up(v));
    for (const v of foes) {
      const u = v.u;
      if (u.boss === 'standard') {
        under(v); for (let i = 0; i < 12; i++) { const a0 = (i * TAU) / 12 + t * 0.25; ring(v, LINE_R, 0.8, 1.4, 0, a0, a0 + TAU / 24); } flush(C.line);
        for (const o of foes) {
          if (o === v || o.u.boss || !o.u.undead || Math.hypot(o.u.x - u.x, o.u.y - u.y) >= LINE_R) continue;
          over(o, 0.7); const y = o.sy - 50, x = o.sx, pu = 0.75 + 0.25 * Math.sin(t * 3 + o.u.id);
          oval(x, y, 5, 6, 1.3 * pu, 1.1, -0.15, Math.PI + 0.15); seg(x - 5, y, x + 5, y, 1.3 * pu, 1.3 * pu, 0.5); seg(x, y - 1, x, y + 6, 0.9 * pu, 0.9 * pu);   // a small shield
          seg(v.sx, v.sy - 56, o.sx, o.sy - 46, 0.45, 0.15, 0.4); flush(C.line);
        }
      }
      if (u.kind === 'lantern') {
        const owner = at.get('e' + u.owner);
        over(v, 0.9); const b = 0.8 + 0.2 * Math.sin(t * 7) * Math.sin(t * 3.1); disc(v.sx, v.sy - 14, 11, 0.8 * b, 1.6); disc(v.sx, v.sy - 14, 3, 1.6 * b, 0.8); star(v.sx, v.sy - 14, 6, 0.7 * b); flush(C.cage);
        if (up(owner)) {
          const hurt = owner.u.hp < owner.u.maxHp, x0 = v.sx, y0 = v.sy - 14, x1 = owner.sx, y1 = owner.sy - 30;
          over(owner, 0.9); seg(x0, y0, x1, y1, 0.45, 0.3, 0.4);
          for (let i = 0; i < 6; i++) { const s = (t * (hurt ? 1.2 : 0.4) + i / 6) % 1; disc(x0 + (x1 - x0) * s, y0 + (y1 - y0) * s - Math.sin(s * Math.PI) * 6, 1.6, (hurt ? 1.3 : 0.5) * Math.sin(s * Math.PI), 1); }   // (faster and brighter while he mends)
          if (hurt) { const p = (t % 0.9) / 0.9; oval(x1, y1 + 8, 9 + 6 * p, 12 + 6 * p, 0.9 * (1 - p), 1); }
          flush(C.cageHot);
        }
      }
      if (u.boss && u.guards && u.guards.length) {
        const g = u.guards.map((id) => at.get('e' + id)).filter(up);
        if (g.length) {
          over(v, 0.3); for (const o of g) { const f = 0.3 + 0.12 * Math.sin(t * 4 + o.u.id); seg(o.sx, o.sy - 26, v.sx, v.sy - 34, f, f * 0.5, 0.3); }
          const x = v.sx, y = v.sy - 66, pu = 0.8 + 0.2 * Math.sin(t * 5);
          oval(x, y, 6, 7.5, 1.4 * pu, 1.1, -0.15, Math.PI + 0.15); seg(x - 6, y, x + 6, y, 1.4 * pu, 1.4 * pu, 0.5); flush(C.call);
        }
      }
      if (u.singer != null && !(u.spawn > 0) && up(at.get('e' + u.singer))) {
        over(v, 0.6); for (let i = 0; i < 4; i++) { const s = (t * 0.55 + i / 4) % 1, x = v.sx + Math.sin(s * 9 + i) * 7, y = v.sy - 40 - s * 38; disc(x, y, 1.8, 1.4 * Math.sin(s * Math.PI), 1); seg(x + 1.8, y, x + 1.8, y - 6, 1.1 * Math.sin(s * Math.PI), 0.4 * Math.sin(s * Math.PI)); }
        flush(C.singHot); under(v); { const p = (t % 1.4) / 1.4; ring(v, 0.4 + 0.9 * p, 0.9 * (1 - p), 1.3); } flush(C.sing);   // (her song going out over the floor)
      }
    }
    // the dead mending while one sings
    const singing = foes.some((v) => v.u.singer != null && !(v.u.spawn > 0) && up(at.get('e' + v.u.singer)));
    if (singing) for (const v of foes) {
      if (!v.u.undead || v.u.hp >= v.u.maxHp) continue;
      over(v, 0.5); for (let i = 0; i < 4; i++) { const s = (t * 0.7 + i / 4 + v.u.id * 0.13) % 1; disc(v.sx + (i - 1.5) * 5, v.sy - 6 - s * 38, 1.5, 1.1 * (1 - s), 1); } flush(C.sing);
    }
  }

  return {
    /** a skill's moment begins (the sim's 'skill' event) @param {any} e @param {number} now */
    event(e, now) { if (MOMENT[e.id]) { live.push({ e, t0: now, seed: (n++ % 997) + 1 }); if (live.length > 40) live.shift(); } },
    /** the fight's other moments (a ward breaking, a level gained, a boss's mechanic): the renderer hands its event as a
     *  moment's { id: 'ward_break' | 'level_up' | 'boss_…', by, foeBy (the one it starts from is a foe), tid, ally, x, y,
     *  tx, ty, reached } @param {any} e @param {number} now */
    moment(e, now) { this.event(e, now); },
    /** every moment under way and every aura, this frame. units: the figures drawn ({ u, foe, sx, sy, h, key }), for
     *  following who's in it and drawing what they carry @param {number} now @param {Function} proj @param {any[]} units */
    draw(now, proj, units) {
      const at = new Map(); for (const v of units) if (v.u && v.u.id != null) at.set((v.foe ? 'e' : 'p') + v.u.id, v);
      const foes = units.filter((v) => v.foe && v.u && !v.u.dead && v.u.hp > 0);
      auras(now, units); gainK = BOSS; bossAuras(now, units, at); gainK = 1;
      for (let i = live.length - 1; i >= 0; i--) {
        const L = live[i], e = L.e, t = (now - L.t0) / 1000, life = e.life || LIFE[e.id] || MORE[e.id] || PROPOSED[e.id] || 1;
        if (t >= life) { live.splice(i, 1); continue; } if (t < 0) continue;
        const Cq = find(at, !!e.foeBy, e.by, e.x, e.y, proj), Tq = find(at, !e.ally, e.tid, e.tx, e.ty, proj);
        const R = (e.reached || []).map((o) => find(at, e.id !== 'bless' && e.id !== 'ancestors_breath', o.id, o.x, o.y, proj));
        gainK = e.id.startsWith('boss_') ? BOSS : 1;
        MOMENT[e.id]({ t, k: 1 - t / life, Cq, Tq, R, e, at: e.at, foes, seed: L.seed, mem: L, P: proj });
        gainK = 1;
      }
    },
    fireHead,
    /** (for checks) the moments under way */
    get live() { return live.length; },
  };
}
