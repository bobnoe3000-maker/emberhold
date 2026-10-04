// @ts-check
// beasts.js — farm beasts at their ease (the owner, 2026-10-04: "cows need an idle movement"). A struct with idle frames
// baked beside it (tools/actor-lab/env.json: id~tl and id~tr, the tail swished to a side; id~hd, the head moved: a
// grazing cow lifts hers to chew, one looking about turns hers) is drawn each frame by the renderer, which asks here
// which frame to show. Each beast keeps a timeline of its own: a cycle of 5–11 s, with a swish of the tail (there and
// back, twice, 0.2 s a frame) on most cycles and the head moved for 1.5–3.5 s on about half. Presentation only: the
// clock is the render clock, the chance a hash of the beast's id and where it stands.

/** the frame suffixes, as baked */
export const BEAST_FRAMES = /** @type {const} */ (['', '~tl', '~tr', '~hd']);
const SWISH = ['~tl', '', '~tr', '', '~tl', ''];

/** a beast's timeline, from its id and place
 * @param {{ id: string, x: number, y: number }} st @returns {{ st: typeof st, h: number, per: number, off: number, hold: number }} */
export function beastOf(st) {
  const s = st.id + st.x + ',' + st.y; let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  h >>>= 0;
  const f = (k) => ((h >>> k) & 1023) / 1023;
  return { st, h, per: 5 + 6 * f(0), off: 40 * f(10), hold: 1.5 + 2 * f(20) };
}

/** which frame to show now ('' the standing frame) @param {ReturnType<typeof beastOf>} b @param {number} now ms */
export function beastFrame(b, now) {
  const t = now / 1000 + b.off, n = Math.floor(t / b.per), u = t - n * b.per, roll = (Math.imul(n + 1, 2654435761) ^ b.h) >>> 0;
  if (u < 1.2 && (roll & 7) < 6) return SWISH[Math.floor(u / 0.2)];
  if (u >= b.per * 0.5 && u < b.per * 0.5 + b.hold && (roll >>> 3) % 2) return '~hd';
  return '';
}
