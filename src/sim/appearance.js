// @ts-check
// appearance.js — how a character looks: their face and their build (GDD §6.1 v1.65; docs/character-look-plan.md §3–4;
// the owner, 2026-11-10: "Let me customize the face and body type more - player choice and allows for NPC variability -
// face shape, eyes, eyebrows, mouth, nose, ears, hair color, body size/shape (during character creation AND later if I
// want in the temple for a gold fee)").
//
// Cosmetic only: no stat reads it, and the sim holds it only so it's saved and checked. A member's `appearance`
// (MEMBER_KEYS, save v39) is a set of ids, each from the lists here, which are the face kit's own
// (tools/actor-lab/faces.js OPTIONS, kept in step by test/appearance.test.mjs: the sim can't import the tools) and the
// builds and heights figure.js knows. Absent: the look's own face and the class's build, as before v1.65.
// The hero chooses theirs at creation (createHero `appearance`) and can change it at a temple for RESTYLE_COST
// (heroes.js `restyle`); a sellsword is hired with one of their own, drawn from their id on a stream of its own
// (APPEARANCE_STREAM), so the tavern's names, levels and perks are as they were.

import { mulberry32, streamSeed } from './rng.js';

/** every part's choices (null: none) */
export const PARTS = {
  shape: ['normal', 'thin', 'thick', 'round', 'oblong', 'pear'],
  skin: ['porcelain', 'fair', 'rose', 'olive', 'tan', 'umber', 'deep'],
  eyes: ['round', 'wide', 'narrow', 'tired', 'sharp'],
  iris: ['brown', 'hazel', 'green', 'blue', 'grey', 'amber'],
  brows: ['straight', 'arched', 'heavy', 'angry', 'worried', 'thin'],
  nose: ['kk', 'button', 'long', 'hook', 'broad', 'snub'],
  mouth: ['line', 'smile', 'grin', 'frown', 'smirk', 'grim', 'open'],
  ears: [null, 'pointed'],
  hair: ['bald', 'crop', 'short', 'receding', 'crest', 'bun', 'topknot', 'braid', 'long', 'ponytail', 'swept'],
  hairColor: ['black', 'soot', 'brown', 'chestnut', 'auburn', 'copper', 'straw', 'flax', 'ash', 'grey', 'white'],
  beard: [null, 'stubble', 'short', 'goatee', 'mustache', 'full'],
  build: ['thin', 'normal', 'broad', 'heavy'],
  height: ['short', 'average', 'tall'],
  // (v43, GDD §6.1 v1.79: the painted head) the face's frame, strong or soft (the softer jaw and chin, lashes, coloured
  // lips), and the expression it wears
  frame: ['strong', 'soft'],
  expression: ['neutral', 'smile', 'happy', 'stern', 'sad', 'smug', 'surprised', 'fierce'],
};
/** the marks (a scar, freckles…): up to MARKS_MAX of them, none twice */
export const MARKS = ['scar', 'scar_cheek', 'freckles', 'blush', 'wrinkles', 'eyepatch', 'earring'], MARKS_MAX = 2;
export const KEYS = [...Object.keys(PARTS), 'marks'];
export const RESTYLE_COST = 40;                                 // gold, at a temple (GDD §6.1 v1.65)
export const APPEARANCE_STREAM = 6600;

/** is this an appearance the sim takes? (every part present, each one of its choices; the marks a short list of them)
 * @param {any} a @returns {boolean} */
export function validAppearance(a) {
  if (!a || typeof a !== 'object' || Array.isArray(a)) return false;
  const keys = Object.keys(a);
  if (keys.length !== KEYS.length || !keys.every((k) => KEYS.includes(k))) return false;
  for (const [k, list] of Object.entries(PARTS)) if (!list.includes(a[k])) return false;
  const m = a.marks;
  return Array.isArray(m) && m.length <= MARKS_MAX && m.every((x) => MARKS.includes(x)) && new Set(m).size === m.length;
}
/** an appearance from before v43 (no frame, no expression): the strong frame, a neutral face @param {any} a */
export const withFrame43 = (a) => (!a || typeof a !== 'object' || Array.isArray(a) ? a : { frame: 'strong', expression: 'neutral', ...a });
/** a copy of a taken appearance (a command's object never kept: its own fields only) @param {any} a */
export const cleanAppearance = (a) => { const o = {}; for (const k of Object.keys(PARTS)) o[k] = a[k]; o.marks = [...a.marks]; return o; };
/** two appearances the same? @param {any} a @param {any} b */
export const sameAppearance = (a, b) => !!a && !!b && KEYS.every((k) => (k === 'marks' ? a.marks.join() === b.marks.join() : a[k] === b[k]));

/** a look drawn for someone (a sellsword at the tavern: their id), its own stream. Most faces plain: a beard one in two,
 * a mark one in three, the builds and heights middling more often than not. @param {number} seed @param {string} key */
export function drawAppearance(seed, key) {
  let h = 0x811c9dc5; for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193);
  const r = mulberry32(streamSeed((seed ^ h) >>> 0, APPEARANCE_STREAM)), pick = (list) => list[Math.floor(r() * list.length)];
  const a = {};
  for (const k of ['shape', 'skin', 'eyes', 'iris', 'brows', 'nose', 'mouth', 'hair', 'hairColor']) a[k] = pick(PARTS[k]);
  a.ears = r() < 0.1 ? 'pointed' : null;
  a.beard = r() < 0.5 ? null : pick(PARTS.beard.slice(1));
  a.build = r() < 0.5 ? 'normal' : pick(PARTS.build);
  a.height = r() < 0.5 ? 'average' : pick(PARTS.height);
  a.marks = r() < 0.33 ? [pick(MARKS)] : [];
  a.frame = r() < 0.5 ? 'strong' : 'soft';                   // (v43: drawn last, so every look drawn before keeps its parts)
  a.expression = r() < 0.6 ? 'neutral' : pick(PARTS.expression);
  return a;
}
