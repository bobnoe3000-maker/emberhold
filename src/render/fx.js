// fx.js — weapon and impact effects, drawn as light into the window G-buffer's EMISSIVE
// plane after the figures are stamped, so they bloom and light nothing but themselves.
//
// Separate from the baked sprites on purpose: the atlas bake (tools/actor-lab) records
// where each held weapon's tip and grip are in every cell (meta.anchors), and the effects
// are drawn from those at runtime — so a style is data (colour, which clip gets a trail,
// a glint or a cast shimmer) and skills and spells can reuse the same primitives later.
//
//   arc   — a ribbon swept by the blade tip over the swing (slices, chops, the spin)
//   stab  — a glint at the point as the thrust lands
//   cast  — a shimmer gathering at the staff crown through the wind-up, a flash on release
//   shot  — a muzzle flash at the crossbow's nose
//   heavy — any heavy clip adds an impact flash at the tip on its impact frame
//   hit sparks — spray from the struck figure away from the attacker (combat 'hit')
//
// Depth: each mark carries the depth the figure it belongs to was stamped at, nudged in
// front or behind by the anchor's z, so a blade swung behind the body tucks under it and
// anything standing nearer covers the effect (dimmed, not cut, so a glow still reads).

// saturated on purpose: bloom and the tonemap wash light toward white, so the hue has to be strong to survive
const STEEL = [185, 210, 255], WARM = [255, 170, 90], VERDANT = [120, 255, 170], ARCANE = [110, 140, 255], FIRE = [255, 120, 30];
const SOUL = [120, 255, 150], BILE = [190, 230, 110], MUZZLE = [255, 200, 120], SOULCAST = [80, 255, 130];

// per atlas: effect per attack clip, colours; spark = the colour of the sparks its blows raise
export const FX_STYLES = {
  hero_knight:      { col: STEEL, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [255, 238, 205] },
  hero_barbarian:   { col: WARM, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [255, 196, 120], wide: 1.25 },
  hero_rogue:       { col: VERDANT, attack: 'stab', attack2: 'arc', heavy: 'arc', spark: [215, 255, 225], thin: true },
  hero_mage:        { col: ARCANE, attack: 'cast', attack2: 'cast', heavy: 'cast', heavyCol: FIRE, spark: [175, 195, 255], heavySpark: [255, 170, 80] },
  skeleton_warrior: { col: SOUL, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [200, 255, 210] },
  skeleton_minion:  { col: BILE, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [225, 240, 190] },
  skeleton_rogue:   { col: MUZZLE, attack: 'shot', attack2: 'shot', heavy: 'shot', spark: [255, 225, 170] },
  skeleton_mage:    { col: SOULCAST, attack: 'cast', attack2: 'cast', heavy: 'cast', spark: [150, 255, 180] },
};
// combat events name the striker by its actor / class (party) or kind (the Ashbound)
const CLASS_ACTOR = { fighter: 'hero_barbarian', rogue: 'hero_rogue', mage: 'hero_mage' };
export const styleOfSrc = (src, foe) => FX_STYLES[foe ? 'skeleton_' + src : CLASS_ACTOR[src] || src] || null;

export function createFX() {
  let B = null;                                   // { EMI, DEP, W, H, DPX }
  let acc = null, touched = [];                   // one shape's coverage (max-blended, so overlaps don't double up)
  const ctx = { key: 0, fy: 0, h: 0 };            // depth context of the figure being drawn
  const parts = [], flashes = [];

  function target(buf) {
    B = buf;
    if (!acc || acc.length !== B.W * B.H) { acc = new Float32Array(B.W * B.H); touched = []; }
  }
  function depth(key, footY, baseH) { ctx.key = key; ctx.fy = footY; ctx.h = baseH; }

  // ── primitives: mark coverage, then flush it as light of one colour ─────────
  function mark(x, y, a) {
    x |= 0; y |= 0; if (x < 0 || y < 0 || x >= B.W || y >= B.H || a <= 0.004) return;
    const i = y * B.W + x; if (!acc[i]) touched.push(i); if (a > acc[i]) acc[i] = a;
  }
  function flush(col, gain = 1) {
    const { EMI, DEP, W, DPX } = B;
    for (const i of touched) {
      let a = acc[i] * gain; acc[i] = 0;
      const py = (i / W) | 0, d = ctx.key + DPX * (ctx.h + Math.max(0, ctx.fy - py));
      if (DEP && DEP[i] > d + 0.05) a *= 0.22;                               // something nearer stands over it
      const j = i * 4;
      EMI[j] = Math.min(255, EMI[j] + col[0] * a * 0.24); EMI[j + 1] = Math.min(255, EMI[j + 1] + col[1] * a * 0.24); EMI[j + 2] = Math.min(255, EMI[j + 2] + col[2] * a * 0.24);
      EMI[j + 3] = 250;                                                       // steady (no ember flicker)
    }
    touched.length = 0;
  }
  // soft disc: a · (1 − d/r)^p
  function disc(x, y, r, a, p = 1.6) {
    const R = Math.ceil(r);
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const d = Math.hypot(dx, dy) / r; if (d < 1) mark(x + dx, y + dy, a * Math.pow(1 - d, p)); }
  }
  // line, alpha ramped a0 → a1, optional half-width
  function seg(x0, y0, x1, y1, a0, a1 = a0, w = 0) {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.5));
    for (let k = 0; k <= n; k++) { const u = k / n, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u, a = a0 + (a1 - a0) * u; if (w) disc(x, y, w + 0.5, a, 0.6); else mark(x + 0.5, y + 0.5, a); }
  }
  // four-point glint: long arms left/right, shorter up/down, a hot core
  function star(x, y, r, a) {
    seg(x - r, y, x, y, 0, a); seg(x, y, x + r, y, a, 0);
    seg(x, y - r * 0.7, x, y, 0, a); seg(x, y, x, y + r * 0.7, a, 0);
    seg(x - r * 0.35, y - r * 0.35, x + r * 0.35, y + r * 0.35, a * 0.4, a * 0.4); seg(x - r * 0.35, y + r * 0.35, x + r * 0.35, y - r * 0.35, a * 0.4, a * 0.4);
    disc(x, y, 1.8, a * 1.2, 0.8);
  }
  // ribbon between an outer (tip) and inner edge: pts = [{ox, oy, ix, iy, a}] oldest → newest;
  // bright along the outer edge, falling off inward
  function ribbon(pts) {
    for (let k = 1; k < pts.length; k++) {
      const p = pts[k - 1], q = pts[k], n = Math.max(1, Math.ceil(Math.max(Math.hypot(q.ox - p.ox, q.oy - p.oy), Math.hypot(q.ix - p.ix, q.iy - p.iy)) * 1.6));
      for (let s = 0; s < n; s++) {
        const u = s / n, a = p.a + (q.a - p.a) * u;
        const ox = p.ox + (q.ox - p.ox) * u, oy = p.oy + (q.oy - p.oy) * u, ix = p.ix + (q.ix - p.ix) * u, iy = p.iy + (q.iy - p.iy) * u;
        const m = Math.max(1, Math.ceil(Math.hypot(ox - ix, oy - iy) * 1.4));
        for (let t = 0; t <= m; t++) { const v = t / m; mark(ix + (ox - ix) * v + 0.5, iy + (oy - iy) * v + 0.5, a * (0.12 + 0.88 * v * v)); }
      }
    }
  }

  // ── anchors: the baked tip / grip of a slot at a fractional clip frame ────────
  // Catmull-Rom through the clip's baked frames, so a 7-frame swing draws a curve
  function anchor(meta, sl, dir, clip, f) {
    const A = meta.anchors && meta.anchors[sl]; if (!A) return null;
    const at = (k) => { k = Math.max(0, Math.min(clip.len - 1, k)); const i = (dir * meta.frames + clip.start + k) * 5; return A.slice(i, i + 5); };
    const k = Math.floor(f), u = f - k, p0 = at(k - 1), p1 = at(k), p2 = at(k + 1), p3 = at(k + 2), o = [];
    for (let c = 0; c < 5; c++) o.push(0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * u + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * u * u + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * u * u * u));
    return o;
  }

  // ── a figure's weapon effect: atlas, the animator's pick (with .atk), its foot point ──
  function weapon(atlas, pk, footX, footY, baseH, footKey) {
    const at = pk.atk, meta = atlas.meta, st = FX_STYLES[atlas.name];
    if (!at || !st || !meta.anchors) return;
    const kind = st[at.key]; if (!kind) return;
    const c = at.clip, heavy = at.key === 'heavy', fp = at.t * c.fps, imp = c.impact ?? Math.floor(c.len / 2);
    const col = (heavy && st.heavyCol) || st.col, x0 = (footX | 0) - meta.ax, y0 = (footY | 0) - meta.ay;
    const slots = Object.keys(meta.anchors).filter((s) => s === 'r' || st.thin);   // the rogue's offhand knife draws too
    const pt = (sl, f) => { const a = anchor(meta, sl, pk.dir, c, f); return a && { tx: x0 + a[0], ty: y0 + a[1], gx: x0 + a[2], gy: y0 + a[3], z: a[4] }; };
    const put = (z, gain = 1) => { depth(footKey + (z >= 0 ? 0.35 : -0.35), footY | 0, baseH); flush(col, gain); };
    for (const sl of slots) {
      if (kind === 'arc') {
        const L = heavy ? 3.4 : 2.4, a0 = imp - (heavy ? 3 : 2), a1 = imp + (heavy ? 1.2 : 0.7), fade = heavy ? 1.4 : 1;
        const head = Math.min(c.len - 1, Math.floor(fp)), tail = Math.max(a0, fp - L);
        if (fp < a0 || fp > a1 + fade || head <= tail) continue;
        const g = fp > a1 ? 1 - (fp - a1) / fade : 1, inner = (heavy ? 0.52 : 0.4) * (st.wide || 1) * (st.thin ? 0.8 : 1), pts = [];
        let zs = 0;
        for (let u = tail; ; u = Math.min(head, u + 0.2)) {
          const p = pt(sl, u), age = (head - u) / L;
          pts.push({ ox: p.tx, oy: p.ty, ix: p.tx + (p.gx - p.tx) * inner, iy: p.ty + (p.gy - p.ty) * inner, a: g * Math.pow(Math.max(0, 1 - age), 1.2) * (heavy ? 1.05 : 0.85) });
          zs += p.z; if (u >= head) break;
        }
        ribbon(pts); put(zs / pts.length);
        if (heavy && fp >= imp && fp < imp + 2.2) { const p = pt(sl, imp), k = 1 - (fp - imp) / 2.2; star(p.tx, p.ty, 7 + 4 * k, 1.3 * k); disc(p.tx, p.ty, 4.5, 0.9 * k); put(p.z, 1.1); }
      } else if (kind === 'stab') {
        if (fp < imp - 1 || fp > imp + 2.2) continue;
        const p = pt(sl, imp), q = pt(sl, imp - 1), k = fp < imp ? (fp - (imp - 1)) : 1 - (fp - imp) / 2.2;
        seg(q.tx, q.ty, p.tx, p.ty, 0, 0.7 * k);                             // the thrust's line
        star(p.tx, p.ty, 4 + 2.5 * k, 1.15 * k); put(p.z);
      } else if (kind === 'cast') {
        const n = Math.floor(fp), p = pt(sl, Math.min(fp, c.len - 1));
        if (fp < imp) {                                                        // gathering: brighter as the release nears
          const k = Math.max(0, fp / imp), now = at.now / 1000;
          disc(p.tx, p.ty, 2.2 + 1.6 * k + (heavy ? 1 : 0), 0.45 + 0.55 * k);
          for (let s = 0; s < (heavy ? 4 : 3); s++) {                          // motes circling the crown
            const ang = now * 7 + s * 2.1 + n * 0.3, r = 5 - 2.5 * k + (heavy ? 1.5 : 0);
            mark(p.tx + Math.cos(ang) * r, p.ty + Math.sin(ang) * r * 0.7, 0.8 * (0.4 + 0.6 * Math.abs(Math.sin(now * 13 + s))));
          }
          put(p.z);
        } else if (fp < imp + 2.6) {                                           // release
          const q = pt(sl, imp), k = 1 - (fp - imp) / 2.6;
          disc(q.tx, q.ty, (heavy ? 8 : 6) * (0.6 + 0.4 * k), 1.1 * k, 1.2); star(q.tx, q.ty, (heavy ? 12 : 8) * (0.7 + 0.3 * k), 1.2 * k); put(q.z, 1);
        }
      } else if (kind === 'shot') {
        if (fp < imp || fp > imp + 1.8) continue;
        const p = pt(sl, imp), k = 1 - (fp - imp) / 1.8;
        disc(p.tx, p.ty, 3.5, 1.1 * k); star(p.tx, p.ty, 6 * k + 2, 1.1 * k); put(p.z);
      }
    }
  }

  // ── impacts: a spray of sparks off the struck figure, away from the striker ────
  // (x, y) world position of the struck, dir = screen-space unit direction of the blow
  function impact(x, y, dx, dy, col, { heavy = false, crit = false, now = performance.now() } = {}) {
    const n = heavy ? 11 : crit ? 8 : 5;
    for (let k = 0; k < n; k++) {
      const sp = (heavy ? 150 : 110) * (0.55 + Math.random() * 0.6), off = (Math.random() - 0.5) * 1.5;
      const vx = (dx * Math.cos(off) - dy * Math.sin(off)) * sp, vy = (dx * Math.sin(off) + dy * Math.cos(off)) * sp - 50 - Math.random() * 40;
      parts.push({ x, y, ox: (Math.random() - 0.5) * 4, oy: -24 + (Math.random() - 0.5) * 8, vx, vy, t0: now, life: 0.2 + Math.random() * (heavy ? 0.25 : 0.16), col });
    }
    flashes.push({ x, y, t0: now, life: heavy ? 0.18 : 0.1, r: heavy ? 5.5 : crit ? 4 : 3, col, heavy });
    if (parts.length > 240) parts.splice(0, parts.length - 240);
  }
  // proj(x, y) → { sx, sy, h, key } the struck figure's foot on screen, its height and depth key
  function particles(now, proj) {
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i], age = Math.max(0, (now - f.t0) / 1000 / f.life); if (age >= 1) { flashes.splice(i, 1); continue; }
      const P = proj(f.x, f.y); depth(P.key + 0.6, P.sy, P.h);
      disc(P.sx, P.sy - 24, f.r * (0.7 + 0.5 * age), 0.75 * (1 - age), 1.4); if (f.heavy) star(P.sx, P.sy - 24, 9 * (1 - age * 0.5), 0.9 * (1 - age));
      flush(f.col);
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const s = parts[i], age = Math.max(0, (now - s.t0) / 1000); if (age >= s.life) { parts.splice(i, 1); continue; }
      const P = proj(s.x, s.y), x = P.sx + s.ox + s.vx * age, y = P.sy + s.oy + s.vy * age + 0.5 * 340 * age * age;
      const vx = s.vx, vy = s.vy + 340 * age, k = 1 - age / s.life;
      depth(P.key + 0.6, P.sy, P.h); seg(x - vx * 0.022, y - vy * 0.022, x, y, 0.15 * k, 1.1 * k); flush(s.col);
    }
  }

  return { target, weapon, impact, particles, primitives: { depth, mark, flush, disc, seg, star, ribbon } };
}
