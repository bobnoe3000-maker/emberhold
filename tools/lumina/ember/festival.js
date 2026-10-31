// festival.js — the festival's poses (Luminati FestivalPoses.js) in Emberfall's people: a villager who cheers, dances,
// cowers, kneels or bows (a set-piece's behaviour or a story's `pose`) gets the same sheet as anyone else (sheets.js), whose
// `poses` and `cheer_<dir>` / `dance_<dir>` come from the atlas's own attack, walk, hit and death frames. The build points
// imports of FestivalPoses.js here (vite.config.mjs); its pose names pass through.
import { emberSheet } from './sheets.js';

export * from '../src/engine/pixel/FestivalPoses.js';

/** @param {object|string} [spec] */
export function createFestivalSheet(spec = {}) {
  return emberSheet(spec, { festival: true });
}
