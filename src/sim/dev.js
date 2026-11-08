// @ts-check
// dev.js — the menu's Developer tools (the owner, 2026-11-08: "Add a developer option in the menu to unlock skills, and
// add a level which includes appropriate skill points and stats"; shown on the site too, by the owner's choice).
// Commands like any other, so the sim stays the only thing that changes its state and a replay sees them; but the one
// path in the game that grants progress outside play, so using either marks the slot a dev game (state.dev, kept in the
// save): a validator refuses a dev game's sessions (replay.js isDevGame), and it can never count as verified progress.
//
//   devUnlockSkills {}       every class's level-6 and level-12 trials done for the company (state.trials, as the
//                            trials' quests set them): each ability opens at its level (skills.js unlocked)
//   devLevel        { id }   one level for a member of the party or the bench, by the sim's own way: exactly the XP the
//                            level wants (party.js gainXp), so its 3 stat points, a skill point at every even level
//                            (both derived from the level: attributes.js, skills.js), the HP its new max brings and
//                            the Auto build's spending come as a level fought for brings them; 'levelUp' as ever
//
// Events: 'levelUp' { id, name, level } · 'devUsed' { what } · 'refused' { reason }. Headless and deterministic.

import { gainXp, xpToNext } from './party.js';
import { TRIAL_CLASSES } from './skills.js';

/** the highest level a dev level goes to: the end of the XP table (party.js) */
export const DEV_LEVEL_MAX = 60;

/** @param {{ state: any, bus: any }} deps */
export function createDev({ state, bus }) {
  const find = (id) => state.party.find((m) => m.id === id) || state.bench.find((m) => m.id === id) || null;
  const refuse = (reason) => { bus.emit('refused', { reason }); return true; };
  const mark = (what) => { state.dev = true; bus.emit('devUsed', { what }); };
  /** @param {any} cmd @returns {boolean} true when the command was ours */
  function command(cmd) {
    switch (cmd.type) {
      case 'devUnlockSkills': {
        if (!state.created) return refuse('Make your hero first');
        for (const c of TRIAL_CLASSES) { state.trials[c] = 1; state.trials[c + '12'] = 1; }
        mark('skills'); bus.emit('partyChanged', state.party); return true;
      }
      case 'devLevel': {
        const m = find(cmd.id);
        if (!m) return true;
        if ((m.level || 1) >= DEV_LEVEL_MAX) return refuse(`${m.name} is at level ${DEV_LEVEL_MAX}`);
        gainXp(m, Math.max(1, xpToNext(m.level) - (m.xp || 0)), () => bus.emit('levelUp', { id: m.id, name: m.name, level: m.level }));
        mark('level'); bus.emit('partyChanged', state.party); return true;
      }
      default: return false;
    }
  }
  return { command };
}
