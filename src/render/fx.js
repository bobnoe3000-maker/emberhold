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
const SOUL = [120, 255, 150], BILE = [190, 230, 110], MUZZLE = [255, 200, 120], SOULCAST = [80, 255, 130], HOLY = [255, 214, 120];
const REDHAND = [255, 92, 70], EMBER = [255, 140, 40];   // (art pass 9) the Company's red; the Cult's ember

// per atlas: effect per attack clip, colours; spark = the colour of the sparks its blows raise
export const FX_STYLES = {
  hero_knight:      { col: STEEL, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [255, 238, 205] },
  hero_barbarian:   { col: WARM, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [255, 196, 120], wide: 1.25 },
  hero_rogue:       { col: VERDANT, attack: 'stab', attack2: 'arc', heavy: 'arc', spark: [215, 255, 225], thin: true },
  hero_rogue_bow:     { col: VERDANT, spark: [215, 255, 225] },   // a bow: no flash, the arrow is the effect
  hero_rogue_longbow: { col: VERDANT, spark: [215, 255, 225] },
  hero_rogue_xbow:    { col: MUZZLE, attack: 'shot', attack2: 'shot', heavy: 'shot', spark: [215, 255, 225] },
  hero_rogue_hxbow:   { col: MUZZLE, attack: 'shot', attack2: 'shot', heavy: 'shot', spark: [215, 255, 225] },
  hero_cleric:      { col: HOLY, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [255, 236, 180], wide: 1.15 },   // the mace: short, heavy, warm gold
  hero_shaman:      { col: [150, 235, 215], attack: 'cast', attack2: 'cast', heavy: 'cast', spark: [180, 255, 230] },   // (v1.19) a spirit bolt, pale green-white
  hero_mage:        { col: ARCANE, attack: 'cast', attack2: 'cast', heavy: 'cast', heavyCol: FIRE, spark: [175, 195, 255], heavySpark: [255, 170, 80] },
  skeleton_warrior: { col: SOUL, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [200, 255, 210] },
  skeleton_minion:  { col: BILE, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [225, 240, 190] },
  skeleton_rogue:   { col: MUZZLE, attack: 'shot', attack2: 'shot', heavy: 'shot', spark: [255, 225, 170] },
  skeleton_mage:    { col: SOULCAST, attack: 'cast', attack2: 'cast', heavy: 'cast', spark: [150, 255, 180] },
  // (art pass 9) the human foes and the bosses swung and cast with nothing drawn: the same primitives, in their colours
  redhand_cutthroat: { col: REDHAND, attack: 'stab', attack2: 'arc', heavy: 'arc', spark: [255, 205, 180], thin: true },
  redhand_brute:     { col: REDHAND, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [255, 190, 150], wide: 1.25 },
  redhand_crossbow:  { col: MUZZLE, attack: 'shot', attack2: 'shot', heavy: 'shot', spark: [255, 225, 170] },
  cinder_acolyte:    { col: EMBER, attack: 'cast', attack2: 'cast', heavy: 'cast', spark: [255, 170, 80] },
  // (v1.19) the hill goblins: a skirmisher's knife, a bruiser's axe, a poacher's bow, a hexer's green
  goblin_skirmisher: { col: VERDANT, attack: 'stab', attack2: 'arc', heavy: 'arc', spark: [215, 240, 170], thin: true },
  goblin_bruiser:    { col: WARM, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [255, 210, 150], wide: 1.1 },
  goblin_archer:     { col: VERDANT, spark: [215, 240, 170] },
  goblin_hexer:      { col: BILE, attack: 'cast', attack2: 'cast', heavy: 'cast', spark: [170, 255, 120] },
  // (M8) the Fens' own: a ghoul's claws, a bill-hook, a fowling crossbow, a marsh-light; the harvester's cage-pole, the drowned
  fen_ghoul:         { col: BILE, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [215, 225, 180], thin: true },
  reed_cutter:       { col: WARM, attack: 'arc', attack2: 'arc', heavy: 'stab', spark: [255, 210, 150], wide: 1.2 },
  reed_fowler:       { col: MUZZLE, attack: 'shot', attack2: 'shot', heavy: 'shot', spark: [255, 225, 170] },
  bog_witch:         { col: [200, 240, 205], attack: 'cast', attack2: 'cast', heavy: 'cast', spark: [210, 245, 215] },
  cult_harvester:    { col: [190, 160, 255], attack: 'arc', attack2: 'arc', heavy: 'stab', spark: [215, 200, 255], wide: 1.2 },
  drowned_brother:   { col: [140, 220, 230], attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [200, 240, 245] },
  drowned_cantor:    { col: [140, 220, 230], attack: 'cast', attack2: 'cast', heavy: 'cast', spark: [190, 235, 245] },
  boss_skarn:        { col: WARM, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [255, 200, 130], wide: 1.25 },
  boss_garrow:       { col: REDHAND, attack: 'arc', attack2: 'arc', heavy: 'stab', spark: [255, 210, 170], wide: 1.15 },
  boss_stranger:     { col: EMBER, attack: 'cast', attack2: 'cast', heavy: 'cast', heavyCol: FIRE, spark: [255, 170, 80], heavySpark: [255, 120, 40] },
  boss_standard:     { col: HOLY, attack: 'arc', attack2: 'arc', heavy: 'arc', spark: [255, 226, 160], wide: 1.2 },
};
// combat events name the striker by its actor / class (party) or kind (the Ashbound)
const CLASS_ACTOR = { fighter: 'hero_barbarian', rogue: 'hero_rogue', mage: 'hero_mage', cleric: 'hero_cleric', shaman: 'hero_shaman' };
/** @param {Record<string, string>} [foeActor] a foe kind's atlas (the renderer's ENEMY_ACTOR): the Redhand's and the bosses' sparks too */
export const styleOfSrc = (src, foe, foeActor = {}) => FX_STYLES[foe ? foeActor[src] || 'skeleton_' + src : CLASS_ACTOR[src] || src] || null;

export function createFX() {
  let B = null;                                   // { EMI, DEP, W, H, DPX }
  let acc = null, touched = [];                   // one shape's coverage (max-blended, so overlaps don't double up)
  const ctx = { key: 0, fy: 0, h: 0 };            // depth context of the figure being drawn
  const parts = [], flashes = [], beams = [];

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
  // a loot drop: a column of light over where it fell and a glint on the ground, in the rarity's colour
  function beam(x, y, col, { now = performance.now(), life = 2.6 } = {}) { beams.push({ x, y, col, t0: now, life }); if (beams.length > 8) beams.shift(); }
  // one of the slain raised (the temple, a shrine): a tall column of holy light over them, a ring of it spreading at their
  // feet, and motes rising up the column
  function rise(x, y, { now = performance.now(), life = 1.9, col = HOLY } = {}) { beams.push({ x, y, col, t0: now, life, rise: true }); if (beams.length > 8) beams.shift(); }   // (a lamp's souls going free: violet, lamps.js)

  // proj(x, y) → { sx, sy, h, key } the struck figure's foot on screen, its height and depth key
  function particles(now, proj) {
    for (let i = beams.length - 1; i >= 0; i--) {
      const b = beams[i], age = Math.max(0, (now - b.t0) / 1000 / b.life); if (age >= 1) { beams.splice(i, 1); continue; }
      const P = proj(b.x, b.y), k = age < 0.1 ? age / 0.1 : 1 - Math.pow((age - 0.1) / 0.9, 2), H = (b.rise ? 72 : 46) * (age < 0.1 ? age / 0.1 : 1);
      if (b.rise) {                                                          // the ring at the feet and the rising motes
        depth(P.key + 0.4, P.sy, P.h);
        const R = 5 + 17 * Math.min(1, age * 1.6), ra = 1.1 * (1 - age);
        for (let t = 0; t < 48; t++) { const a = (t / 48) * Math.PI * 2; disc(P.sx + Math.cos(a) * R, P.sy + Math.sin(a) * R * 0.5, 1.6, ra, 1); }
        for (let m = 0; m < 7; m++) { const u = (age * (1.2 + m * 0.11) + m * 0.14) % 1; disc(P.sx + Math.sin(m * 1.9 + u * 3) * (5 + m), P.sy - 6 - u * 64, 1.8, k * 1.3 * (1 - u), 1); }
        flush(b.col);
      }
      depth(P.key + 0.4, P.sy, P.h);
      for (let yy = 0; yy < H; yy++) { const f = yy / H, w = (b.rise ? 5 : 3) * (1 - f * 0.55), a = k * (b.rise ? 2.6 : 1.6) * Math.pow(1 - f, b.rise ? 0.9 : 1.3) * (0.85 + 0.15 * Math.sin(now / 90 + yy * 0.5));
        for (let xx = -Math.ceil(w); xx <= Math.ceil(w); xx++) mark(P.sx + xx, P.sy - yy, a * Math.max(0, 1 - Math.abs(xx) / (w + 0.5))); }
      flush(b.col);
      depth(P.key + 0.4, P.sy, P.h);
      for (let dy = -3; dy <= 3; dy++) for (let dx = -7; dx <= 7; dx++) { const e = (dx * dx) / 49 + (dy * dy) / 9; if (e < 1) mark(P.sx + dx, P.sy + dy, k * 1.3 * (1 - e)); }
      star(P.sx, P.sy - H, 4 + 2 * Math.sin(now / 140), k * 0.9);
      flush(b.col);
    }
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

  // marsh-lights (M8; the Fens' meres at dusk and night): a pale point drifting slowly over each mere, a hand's breadth to
  // a man's height above the water, swelling and fading on its own beat. `list` is [{ x, y, ph }] (tile space, a phase),
  // `k` the light's strength (0: none, by day). Drawn after the particles, depth-tested like them.
  const MARSH = [190, 240, 200];
  function wisps(now, proj, list, k) {
    if (!(k > 0)) return;
    const t = now / 1000;
    for (const w of list) {
      const x = w.x + 1.6 * Math.sin(t * 0.21 + w.ph) + 0.6 * Math.sin(t * 0.53 + w.ph * 2), y = w.y + 1.3 * Math.cos(t * 0.17 + w.ph * 1.3);
      const P = proj(x, y), lift = 9 + 5 * Math.sin(t * 0.7 + w.ph * 3), beat = 0.55 + 0.45 * Math.sin(t * 1.1 + w.ph * 5);
      if (P.sx < -8 || P.sy < -24 || P.sx > B.W + 8 || P.sy > B.H + 24) continue;
      depth(P.key + 0.3, P.sy, P.h);
      disc(P.sx, P.sy - lift, 6, k * 0.9 * beat, 1.5); disc(P.sx, P.sy - lift, 2, k * 2 * beat, 0.8);   // a halo, a hot core
      flush(MARSH);
    }
  }

  return { target, weapon, impact, beam, rise, particles, wisps, primitives: { depth, mark, flush, disc, seg, star, ribbon } };
}
