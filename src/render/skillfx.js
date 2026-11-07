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
//   cleric  — gold: Mend a beam from above and a mark rising; Bless a rune circle and halos settling; Turn Undead a
//             sunburst, its rays running out over the floor, the dead it reaches flaring.
//   shaman  — spirit teal, hex green and violet: Spirit Drain a tether drawing motes from the foe, its stacks circling
//             them; Ancestors' Breath a breath going out over the party and leaves spiralling up them; Hex a sigil drawn
//             on the floor under the knot, a mark under each hexed foe.
// Presentation only: it reads the sim, never writes it. Math.random is fine here (not in the sim); each moment's
// scatter comes from its own small hash so a replayed frame draws the same.

/** screen px per tile of world radius: a world circle is an ellipse of these semi-axes (iso.js HW, HH: 8, 4, × √2) */
const EX = 11.31, EY = 5.66;
const TAU = Math.PI * 2;
// saturated on purpose, as fx.js's: bloom and the tonemap wash light toward white
const C = {
  cleave: [255, 190, 100], cleaveHot: [255, 236, 190], wall: [255, 210, 130], taunt: [255, 84, 56], wind: [190, 255, 150],
  stab: [255, 52, 84], shadow: [110, 255, 165], smoke: [196, 186, 240], venom: [150, 255, 50],
  fire: [255, 116, 28], fireHot: [255, 214, 130], frost: [140, 210, 255], frostHot: [230, 248, 255], ward: [110, 150, 255], wardHot: [190, 215, 255],
  mend: [255, 230, 150], bless: [255, 210, 110], turn: [255, 246, 210], drain: [110, 240, 210], breath: [140, 255, 190], hex: [160, 255, 70], hexV: [190, 110, 255],
};
/** how long each moment lasts, s */
const LIFE = { cleave: 0.55, shield_wall: 0.95, second_wind: 1.2, backstab: 0.6, smoke_step: 1.3, venom: 0.8, firebolt: 0.9, frost_nova: 1.1,
  arcane_ward: 0.95, mend: 1.1, bless: 1.2, turn_undead: 1.1, spirit_drain: 0.8, ancestors_breath: 1.3, hex: 1.4 };
/** the skills with a moment of their own (for checks: every class skill has one) */
export const SKILL_MOMENTS = Object.freeze(Object.keys(LIFE));
const ease = (u) => 1 - (1 - u) * (1 - u), clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** a small deterministic scatter: the k-th number of a moment */
const rnd = (seed, k) => { const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };

/**
 * @param {{ depth: Function, mark: Function, flush: Function, disc: Function, seg: Function, star: Function }} P fx.js primitives
 */
export function createSkillFX(P) {
  const { depth, mark, disc, seg, star } = P;
  // (the light's strength: at fx.js's own gain the first pass read as dotted outlines beside the weapons' arcs)
  const BOOST = 1.7, flush = (col, g = 1) => P.flush(col, g * BOOST);
  /** @type {{ e: any, t0: number, seed: number }[]} */
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
        disc(Cq.sx + Math.cos(ang) * r, Cq.sy - hgt + Math.sin(ang) * r * 0.4, 1.4, k * (1 - u * 0.7) * (Math.sin(ang) > 0 ? 1 : 0.5), 1);
      }
      flush(C.wind); under(Cq); ring(Cq, 0.3 + 1.1 * ease(clamp01(t / 0.5)), 0.9 * k, 1.3); flush(C.wind);
    },
    // a shadow's streak from where the rogue stood, then two cuts crossing on the target, crimson; a crit a star
    backstab(ctx) {
      const { t, Cq, Tq, e } = ctx; if (ctx.at !== 'land') return;
      if (t < 0.25) { over(Tq, 0.2); seg(Cq.sx, Cq.sy - 20, Tq.sx, Tq.sy - 22, 0, 0.55 * (1 - t / 0.25), 1); flush(C.shadow); }
      const x = Tq.sx, y = Tq.sy - 24, k = t < 0.12 ? 1 : 1 - (t - 0.12) / 0.48;
      const s1 = clamp01(t / 0.05), s2 = clamp01((t - 0.04) / 0.05);
      over(Tq, 0.9);
      seg(x - 9, y - 9, x - 9 + 18 * s1, y - 9 + 18 * s1, 1.2 * k, 1.2 * k, 0.9);
      if (s2 > 0) seg(x + 9, y - 9, x + 9 - 18 * s2, y - 9 + 18 * s2, 1.2 * k, 1.2 * k, 0.9);
      if (e.crit) star(x, y, 9 + 6 * (1 - k), 1.3 * k);
      flush(C.stab, 1.1);
    },
    // smoke thrown out in a ring at the feet, billowing and rising, pale lilac in the dark
    smoke_step(ctx) {
      const { t, k, Cq, seed } = ctx; if (ctx.at !== 'land') return;
      over(Cq, 0.5);
      for (let i = 0; i < 16; i++) { const ang = (i / 16) * TAU + rnd(seed, i) * 0.4, u = ease(clamp01(t / 0.6)), R = 0.3 + 1.2 * u * (0.7 + 0.3 * rnd(seed, i + 30));
        const [x, y] = on(Cq, R, ang, 4 + 14 * u * rnd(seed, i + 60)); disc(x, y, 4 + 5 * u, 0.32 * k, 2.2); }
      for (let i = 0; i < 5; i++) { const ang = t * 3 + i * 1.26; disc(Cq.sx + Math.cos(ang) * 8, Cq.sy - 20 - t * 14 + Math.sin(ang) * 6, 1.4, 0.8 * k, 1); }
      flush(C.smoke);
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
    // where the firebolt lands: a white-orange flash, a ring of fire thrown out at the target's height, the floor
    // scorched in a ring, embers flung up and falling, a breath of smoke-light rising
    firebolt(ctx) {
      const { t, k, Tq, seed } = ctx; if (ctx.at !== 'land') return;
      over(Tq, 0.8);
      if (t < 0.18) { const f = 1 - t / 0.18; disc(Tq.sx, Tq.sy - 22, 11 * (0.7 + 0.5 * (1 - f)), 1.4 * f, 1.2); star(Tq.sx, Tq.sy - 22, 14, 1.3 * f); }
      flush(C.fireHot, 1.1);
      over(Tq, 0.7); const u = ease(clamp01(t / 0.35));
      if (u < 1) ring(Tq, 0.35 + 1.4 * u, 1.2 * (1 - u), 1.6, 20);
      for (let i = 0; i < 18; i++) { const a = rnd(seed, i) * TAU, sp = 40 + 60 * rnd(seed, i + 7), life = 0.5 + 0.4 * rnd(seed, i + 3); if (t > life) continue;
        const x = Tq.sx + Math.cos(a) * sp * t, y = Tq.sy - 20 + Math.sin(a) * sp * 0.55 * t - 70 * t + 160 * t * t; seg(x - Math.cos(a) * 2, y + 1, x, y, 0.2 * (1 - t / life), 1.1 * (1 - t / life)); }
      for (let i = 0; i < 6; i++) { const lift = 18 + t * 40 + i * 5; disc(Tq.sx + Math.sin(i * 2.1 + t * 3) * 5, Tq.sy - lift, 2.5, 0.35 * k * (1 - i / 6), 1.5); }
      flush(C.fire);
      under(Tq); ring(Tq, 0.25 + 0.9 * ease(clamp01(t / 0.25)), 0.75 * k, 1.8); pool(Tq, 0.8, 0.45 * k); flush(C.fire);
    },
    // the ring of frost running out from the mage over the floor, ice spikes standing up behind it as it passes, a cold
    // mist inside; each foe it reaches flashes white
    frost_nova(ctx) {
      const { t, k, Cq: M, Tq: Cq, R, seed } = ctx; if (ctx.at !== 'land') return;   // (thrown, GDD v1.53: it bursts on the knot, Tq)
      if (t < 0.16 && Math.hypot(Cq.sx - M.sx, Cq.sy - M.sy) > 8) { over(Cq, 0.4); const f = 1 - t / 0.16; seg(M.sx, M.sy - 26, Cq.sx, Cq.sy - 10, 0.25 * f, 1.1 * f, 0.9); star(M.sx, M.sy - 26, 5, f); flush(C.frostHot); }   // the throw: a cold streak from the staff to the knot
      const RR = ctx.e.r || 3.5, u = ease(clamp01(t / 0.3)), rad = 0.3 + (RR - 0.3) * u;   // (its real reach: skills.js radius)
      under(Cq); pool(Cq, rad, 0.28 * k, 0, 1.1); if (u < 1) { ring(Cq, rad, 1.25 * (1 - u * 0.4), 2.1); ring(Cq, rad * 0.86, 0.5 * (1 - u), 1.2); } flush(C.frost, 1.1);
      over(Cq, 0.3);
      for (let i = 0; i < 18; i++) { const ang = (i / 18) * TAU + rnd(seed, i) * 0.3, r0 = 0.6 + (RR - 0.6) * rnd(seed, i + 40); if (rad < r0) continue;
        const grow = clamp01((t - (r0 / RR) * 0.3) / 0.12), hgt = (6 + 9 * rnd(seed, i + 20)) * grow, [x, y] = on(Cq, r0, ang);
        seg(x, y, x + (rnd(seed, i + 5) - 0.5) * 3, y - hgt, 0.9 * k, 1.3 * k, 0.6); if (grow >= 1 && t < 0.6) star(x, y - hgt, 3, 0.8 * (1 - t / 0.6)); }
      flush(C.frostHot);
      if (t < 0.4) for (const q of R) { over(q); star(q.sx, q.sy - 24, 8, 1.2 * (1 - t / 0.4)); flush(C.frostHot); }
    },
    // runes drawn in round the ally, then the dome closes over them with a flash (the dome itself is the aura)
    arcane_ward(ctx) {
      const { t, k, Tq } = ctx; if (ctx.at !== 'land') return;
      over(Tq, 0.8);
      if (t < 0.35) { const u = t / 0.35; for (let i = 0; i < 6; i++) { const a = i * 1.047 + t * 6, r = 22 - 12 * u; disc(Tq.sx + Math.cos(a) * r, Tq.sy - 22 + Math.sin(a) * r * 0.55, 1.6, 1.1, 1); seg(Tq.sx + Math.cos(a) * r, Tq.sy - 22 + Math.sin(a) * r * 0.55, Tq.sx + Math.cos(a + 0.4) * r, Tq.sy - 22 + Math.sin(a + 0.4) * r * 0.55, 0.6, 0.1); } }
      else { const u = (t - 0.35) / 0.6; oval(Tq.sx, Tq.sy - 22, 13 + 4 * (1 - u), 21 + 4 * (1 - u), 1.2 * (1 - u), 1.2); }
      flush(C.wardHot);
      void k;
    },
    // a beam of gold from above onto the ally, a ring at their feet, a mark rising over their head, motes going up
    mend(ctx) {
      const { t, k, Tq } = ctx; if (ctx.at !== 'land') return;
      const on2 = t < 0.12 ? t / 0.12 : 1;
      over(Tq, 0.4); column(Tq.sx, Tq.sy, 74 * on2, 3.5, 1.5 * k); flush(C.mend);
      under(Tq); ring(Tq, 0.25 + 0.7 * ease(clamp01(t / 0.45)), 1.0 * k, 1.3); pool(Tq, 0.5, 0.5 * k); flush(C.mend);
      over(Tq, 0.8); const yy = Tq.sy - 50 - t * 14;
      seg(Tq.sx - 5, yy, Tq.sx + 5, yy, 1.2 * k, 1.2 * k, 0.8); seg(Tq.sx, yy - 5, Tq.sx, yy + 5, 1.2 * k, 1.2 * k, 0.8);
      for (let i = 0; i < 7; i++) { const u2 = (t * 1.4 + i / 7) % 1; disc(Tq.sx + Math.sin(i * 2.3) * 8, Tq.sy - 4 - u2 * 46, 1.3, k * (1 - u2), 1); }
      flush(C.mend);
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
      for (let i = 0; i <= 28; i++) { const u = i / 28, w = Math.sin(u * Math.PI * 3 - t * 18) * 4 * Math.sin(u * Math.PI); mark(x0 + dx * u + nx * w, y0 + dy * u + ny * w, 0.45 * k); }
      for (let i = 0; i < 7; i++) { const u = (t * 1.8 + i / 7) % 1, w = Math.sin(u * Math.PI * 3 - t * 18) * 4 * Math.sin(u * Math.PI); disc(x0 + dx * u + nx * w, y0 + dy * u + ny * w, 1.6, 1.1 * k, 1); }
      star(x0, y0, 5, 0.8 * k);
      flush(C.drain);
    },
    // a breath going out over the floor from the shaman, and leaves of spirit-light spiralling up each of the party
    ancestors_breath(ctx) {
      const { t, k, Cq, R } = ctx; if (ctx.at !== 'land') return;
      under(Cq); const u = ease(clamp01(t / 0.45)); if (u < 1) { ring(Cq, 0.3 + 2.8 * u, 0.9 * (1 - u), 1.6); ring(Cq, 0.2 + 2.2 * u, 0.4 * (1 - u), 1); } flush(C.breath);
      for (const q of R) { over(q, 0.5);
        for (let i = 0; i < 8; i++) { const v = clamp01(t * 1.1 - i * 0.05), a = v * 9 + i * 0.8; if (v <= 0 || v >= 1) continue;
          disc(q.sx + Math.cos(a) * 10 * (1 - v * 0.3), q.sy - 4 - v * 50 + Math.sin(a) * 3.5, 1.5, k * (1 - v) * 1.1, 1); }
        flush(C.breath); }
    },
    // a sigil drawn on the floor under the knot: two rings and a five-pointed star, stroke by stroke; a violet line out
    // to each foe it takes
    hex(ctx) {
      const { t, k, Tq, R } = ctx; if (ctx.at !== 'land') return;
      const draw = clamp01(t / 0.35), RR = 1.35;
      under(Tq);
      ring(Tq, RR, 0.9 * k, 1.2, 0, -Math.PI / 2, -Math.PI / 2 + TAU * draw); ring(Tq, RR * 0.82, 0.55 * k, 1, 0, Math.PI / 2, Math.PI / 2 + TAU * draw);
      const pts = []; for (let i = 0; i < 5; i++) pts.push(on(Tq, RR * 0.82, -Math.PI / 2 + i * TAU / 5));
      for (let i = 0; i < 5; i++) { const s = clamp01(draw * 5 - i); if (s <= 0) break; const a = pts[(i * 2) % 5], b = pts[(i * 2 + 2) % 5]; seg(a[0], a[1], a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, 0.9 * k, 0.9 * k, 0.4); }
      flush(C.hex, 1.05);
      under(Tq); pool(Tq, 0.55, 0.5 * k); flush(C.hexV);
      if (t > 0.2 && t < 0.8) { over(Tq, 0.2); const g = 0.7 * (1 - (t - 0.2) / 0.6); for (const q of R) seg(Tq.sx, Tq.sy, q.sx, q.sy - 4, g, g * 0.3, 0.4); flush(C.hexV); }
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
        if (b.smoke > 0) { const f = Math.min(1, b.smoke / 0.8); over(q, 0.4);   // wisps of smoke turning about them
          for (let i = 0; i < 4; i++) { const a = t * 1.7 + i * 1.57; disc(q.sx + Math.cos(a) * 11, q.sy - 14 - ((t * 9 + i * 7) % 26) + Math.sin(a) * 4, 3.2, 0.22 * f, 2); }
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
        if (u.slow > 0) { const f = Math.min(1, u.slow / 0.6); under(q); ring(q, 0.45, 0.6 * f, 1.1); pool(q, 0.4, 0.25 * f); flush(C.frost);   // rime at the feet, snow falling on them
          over(q, 0.5); for (let i = 0; i < 3; i++) { const v2 = ((t * 0.8) + i / 3) % 1; mark(q.sx - 6 + i * 6 + Math.sin(t * 2 + i) * 2, q.sy - 44 + v2 * 36, 0.9 * f * (1 - v2)); } flush(C.frostHot); }
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

  return {
    /** a skill's moment begins (the sim's 'skill' event) @param {any} e @param {number} now */
    event(e, now) { if (MOMENT[e.id]) { live.push({ e, t0: now, seed: (n++ % 997) + 1 }); if (live.length > 40) live.shift(); } },
    /** every moment under way and every aura, this frame. units: the figures drawn ({ u, foe, sx, sy, h, key }), for
     *  following who's in it and drawing what they carry @param {number} now @param {Function} proj @param {any[]} units */
    draw(now, proj, units) {
      const at = new Map(); for (const v of units) if (v.u && v.u.id != null) at.set((v.foe ? 'e' : 'p') + v.u.id, v);
      const foes = units.filter((v) => v.foe && v.u && !v.u.dead && v.u.hp > 0);
      auras(now, units);
      for (let i = live.length - 1; i >= 0; i--) {
        const L = live[i], e = L.e, t = (now - L.t0) / 1000, life = LIFE[e.id] || 1;
        if (t >= life) { live.splice(i, 1); continue; } if (t < 0) continue;
        const Cq = find(at, false, e.by, e.x, e.y, proj), Tq = find(at, !e.ally, e.tid, e.tx, e.ty, proj);
        const R = (e.reached || []).map((o) => find(at, e.id !== 'bless' && e.id !== 'ancestors_breath', o.id, o.x, o.y, proj));
        MOMENT[e.id]({ t, k: 1 - t / life, Cq, Tq, R, e, at: e.at, foes, seed: L.seed });
      }
    },
    fireHead,
    /** (for checks) the moments under way */
    get live() { return live.length; },
  };
}
