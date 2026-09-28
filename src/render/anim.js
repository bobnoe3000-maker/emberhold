// anim.js — picks each actor's atlas cell (direction + frame) every rendered frame.
//
// The baked atlases (tools/actor-lab) carry clips: idle, walk (loops) and attack, hit,
// death, spawn (one-shots). The sim only exposes state — positions, moving, facing, and
// counters that tick when a unit swings (atkN) or takes a blow (hitN) — so the per-unit
// playback lives here:
//   • walk frames advance with DISTANCE travelled (stride-synced), so feet don't skate
//     whatever the speed;
//   • facing turns through the octants in between (one step per TURN_MS) and only
//     changes once the heading clears the octant edge by a margin, so it doesn't flicker
//     on diagonals;
//   • attack starts when atkN changes (its impact frame lines up with the sim's wind-up),
//     a hit flinch when hitN changes, death plays once and holds its last frame.
//   • swings: light A and light B alternate; atkKind 'heavy' plays the heavy clip. The
//     swing in progress is returned too (clip key + seconds in), for the weapon effects.

const TURN_MS = 55, EDGE = 0.62;                  // octant units: 0.5 = the edge, +0.12 hysteresis
// Stride ends (critic pass 3: stopping popped from mid-stride straight to idle, and a walk
// started wherever the last one left off). The baked cycles pass the legs under the body at
// 20 % and 70 % of the cycle — the frames closest to standing — so a stop plays on (faster) to
// the next of those, for at most SETTLE_MS, and a walk from a standstill starts on one.
const PASS = [0.2, 0.7], SETTLE_MS = 180, SETTLE_RATE = 2.2;

export function createAnimator() {
  const st = new WeakMap();
  const wrap = (d) => ((d % 8) + 8) % 8;
  return function pick(u, atlas, o) {
    const C = atlas.meta.clips, now = o.now;
    let s = st.get(u);
    if (!s) { s = { dir: o.dir0 ?? 2, turnAt: 0, phase: (o.seed || 0) % 1, lx: o.x, ly: o.y, atkN: u.atkN || 0, atkT0: -1e9, hitN: u.hitN || 0, hitT0: -1e9, downT0: 0, fidN: u.fidgetN || 0, lookN: u.lookN || 0, gestT0: -1e9, gest: null, sitT0: 0, sat: false }; st.set(u, s); }
    const dx = o.x - s.lx, dy = o.y - s.ly, dist = Math.hypot(dx, dy); s.lx = o.x; s.ly = o.y;
    o.dt = Math.min(50, now - (s.lastNow ?? now)); s.lastNow = now;
    if ((u.atkN || 0) !== s.atkN) {                              // a swing: light A / light B alternate, heavy for abilities and elites
      s.atkN = u.atkN || 0; s.atkT0 = now;
      s.atkKey = (u.atkKind === 'heavy' && C.heavy && 'heavy') || (u.atkKind === 'b' && C.attack2 && 'attack2') || 'attack'; s.atkClip = C[s.atkKey];
    }
    if ((u.hitN || 0) !== s.hitN) { s.hitN = u.hitN || 0; s.hitT0 = now; }
    if ((u.fidgetN || 0) !== s.fidN) { s.fidN = u.fidgetN || 0; s.gestT0 = now; s.gest = 'fidget'; }   // idle gestures (companions at ease, the hero idling)
    if ((u.lookN || 0) !== s.lookN) { s.lookN = u.lookN || 0; s.gestT0 = now; s.gest = 'look'; }
    if (o.sit && !s.sat) s.sitT0 = now;
    s.sat = !!o.sit;
    if (o.dead && !s.dead) s.downT0 = now;
    s.dead = !!o.dead;
    const deadT = o.deadT ?? (now - s.downT0) / 1000;           // enemies pass sim time; fallen party members count here

    // facing: from motion while walking, else toward the target while fighting
    let hx = null, hy = null;
    if (o.moving && dist > 1e-4 && dist < 3) { hx = dx; hy = dy; }
    else if (o.faceX !== undefined && o.facing) { hx = o.faceX; hy = o.faceY; }
    if (hx !== null && !o.dead) {
      const a = Math.atan2(hx + hy, hx - hy) / (Math.PI / 4);          // continuous octant (screen dir8 space)
      let diff = a - s.dir; diff -= 8 * Math.round(diff / 8);
      if (Math.abs(diff) > EDGE && now - s.turnAt >= TURN_MS) { s.dir = wrap(s.dir + Math.sign(diff)); s.turnAt = now; }
    }

    const clipAt = (c, t) => c.start + Math.min(c.len - 1, Math.max(0, Math.floor(t * c.fps)));
    const idleFrame = () => { const c = C.idle; return c.start + Math.floor((now / 1000) * c.fps + (o.seed || 0) * c.len) % c.len; };
    const dur = (c) => (c ? (c.len / c.fps) * 1000 : 0);
    let frame, atk = null;
    if (o.dead && C.death) frame = clipAt(C.death, deadT);                                    // plays once, holds
    else if (o.spawnP !== undefined && C.spawn) frame = C.spawn.start + Math.min(C.spawn.len - 1, Math.floor(o.spawnP * C.spawn.len));
    else if (s.atkClip && now - s.atkT0 < dur(s.atkClip)) { const t = (now - s.atkT0) / 1000; frame = clipAt(s.atkClip, t); atk = { key: s.atkKey, clip: s.atkClip, t, now }; }
    else if (C.hit && now - s.hitT0 < dur(C.hit)) frame = clipAt(C.hit, (now - s.hitT0) / 1000);
    else if (o.sit && C.sit) frame = C.sitdown && now - s.sitT0 < dur(C.sitdown) ? clipAt(C.sitdown, (now - s.sitT0) / 1000) : C.sit.start + Math.floor((now / 1000) * C.sit.fps + (o.seed || 0) * C.sit.len) % C.sit.len;
    else if (o.moving) {
      if (!s.walking) { s.walking = true; if (now - (s.stopT || 0) > 150) s.phase = PASS[(s.leg = (s.leg || 0) ^ 1)]; }   // set off on a passing pose
      s.phase += dist / o.stride; s.lastStep = now;
      const c = C.walk; frame = c.start + (Math.floor(s.phase * c.len) % c.len + c.len) % c.len;
    } else if (s.walking && C.walk && now - (s.lastStep || 0) < SETTLE_MS) {            // just stopped: finish the stride
      const c = C.walk, cyc = ((s.phase % 1) + 1) % 1, next = PASS.map((q) => (q - cyc + 1) % 1).reduce((a, b) => Math.min(a, b));
      if (next < 0.06) { s.walking = false; s.stopT = now; frame = idleFrame(); }
      else { s.phase += Math.min(next, (SETTLE_RATE * (c.fps / c.len) * (o.dt || 16)) / 1000); frame = c.start + (Math.floor(s.phase * c.len) % c.len + c.len) % c.len; }
    } else if (s.gest && C[s.gest] && now - s.gestT0 < dur(C[s.gest])) {
      frame = clipAt(C[s.gest], (now - s.gestT0) / 1000);
    } else frame = idleFrame();
    if (!o.moving && frame !== undefined && !(s.walking && now - (s.lastStep || 0) < SETTLE_MS)) { if (s.walking) s.stopT = now; s.walking = false; }
    return { dir: s.dir, frame, atk };                         // atk: the swing in progress (fx.js draws its trail / glint / cast)
  };
}
