// @ts-check
// detmath.js — deterministic math for the sim (architecture §7).
//
// JS engines are free to approximate Math.sin / cos / atan2 / exp / pow / hypot (and the **
// operator) differently, so V8 (Chrome, Node) and JavaScriptCore (Safari) can disagree in
// the last bits — enough to fork a replay. The sim's replay validator (replay.js) re-runs a
// player's session on the server, so everything that feeds positions or outcomes uses these
// instead: built only from + − × ÷ and Math.sqrt (a correctly rounded hardware instruction
// on every engine we ship to), with fixed range reduction and fixed polynomials. Accuracy is
// ~1e-9, far below anything the game can see; bit-for-bit repeatability is the point.

const PI = 3.141592653589793, HALF_PI = 1.5707963267948966, TWO_PI = 6.283185307179586;
const SQRT3 = 1.7320508075688772, PI_6 = 0.5235987755982988, LN2 = 0.6931471805599453;

export const hypot = (x, y) => Math.sqrt(x * x + y * y);

// sin on [−π/2, π/2]: Taylor to x^15 (error < 1e-12 there)
function sinCore(x) {
  const x2 = x * x;
  return x * (1 + x2 * (-1 / 6 + x2 * (1 / 120 + x2 * (-1 / 5040 + x2 * (1 / 362880 + x2 * (-1 / 39916800 + x2 * (1 / 6227020800 + x2 * (-1 / 1307674368000))))))));
}
export function sin(x) {
  let r = x - TWO_PI * Math.round(x / TWO_PI);           // [−π, π]
  if (r > HALF_PI) r = PI - r; else if (r < -HALF_PI) r = -PI - r;
  return sinCore(r);
}
export const cos = (x) => sin(x + HALF_PI);

// atan on [0, 2−√3]: odd series to t^19 (error < 1e-12); reduce by 1/t and the π/6 identity
function atanSmall(t) {
  const t2 = t * t;
  let s = 0; for (let k = 19; k >= 3; k -= 2) s = (k % 4 === 1 ? 1 : -1) / k + t2 * s;
  return t + t * t2 * s;
}
function atanPos(t) {                                      // t ≥ 0
  let inv = false, off = false;
  if (t > 1) { t = 1 / t; inv = true; }
  if (t > 0.2679491924311228) { t = (t * SQRT3 - 1) / (SQRT3 + t); off = true; }
  let a = atanSmall(t);
  if (off) a += PI_6;
  return inv ? HALF_PI - a : a;
}
export function atan2(y, x) {
  if (x === 0 && y === 0) return 0;
  const a = atanPos(Math.abs(y) / (Math.abs(x) || 1e-300));
  const r = x >= 0 ? a : PI - a;
  return y < 0 ? -r : r;
}

// exp: x = k·ln2 + r, |r| ≤ ln2/2; e^r by Taylor to r^14; 2^k by repeated doubling
export function exp(x) {
  const k = Math.round(x / LN2), r = x - k * LN2;
  let s = 1, term = 1;
  for (let i = 1; i <= 14; i++) { term = (term * r) / i; s += term; }
  let p = 1; const n = Math.abs(k); for (let i = 0; i < n; i++) p *= 2;
  return k >= 0 ? s * p : s / p;
}
