// @ts-check
// adapter.js — runs Ink conversations for the dialogue window (architecture A4, quest-lore-system
// §6). The story layer: it reads the sim's variables (sent with the 'dialogue' event), plays the
// compiled Ink (content/dialogue/<file>.json, compiled by tools/content/ink.mjs), and turns the
// effect tags it meets into `dialogueEffect` commands. It never touches sim state: the sim checks
// every effect against the talking NPC's allowances and ignores the rest.
//
// Tags (`# name: args…`): presentation ones (portrait, sfx, mark) are dropped; window ones (service,
// shop) go back to the caller to open that window; everything else is a dialogueEffect. A tag
// inside a choice's brackets belongs to the choice (`+ [I'll see to it. #mark: quest]`) and never
// reaches the sim: `mark: quest [ready]` sets that choice apart as a quest one in the window.
// One Story per file is kept for the session, so Ink's cycles ({&a|b}) move on between visits.
//
// The variables are the sim's, copied in when the talk opens. A line with effects is where they go
// stale (a turnin makes q_<id> 3), so the story stops after it: the beat comes back `waiting` with
// the number of effects sent, and `resume(vars)` carries on with the sim's variables once it has
// applied them ('talkVars'). Ink's lookahead may already have built the next choices from the stale
// copy, so resuming rewinds to just before that line, binds the new variables and plays the line
// again silently (its text is shown and its effects sent): the topics it comes back to no longer
// offer the quest just handed in.

import { Story } from 'inkjs';

const PRESENTATION = new Set(['portrait', 'sfx', 'mark']), WINDOW = new Set(['service', 'shop']);

/** '# flag: set met_maudry' → { tag: 'flag', args: ['set', 'met_maudry'] } (null if not name: args)
 * @param {string} raw */
export function parseTag(raw) {
  const m = /^\s*([a-z][a-z_]*)\s*:\s*(.*)$/i.exec(String(raw)); if (!m) return null;
  return { tag: m[1].toLowerCase(), args: m[2].trim().split(/\s+/).filter(Boolean) };
}

/** @typedef {{ lines: string[], choices: { index: number, text: string, mark: string[] }[], windows: { tag: string, args: string[] }[], ended: boolean, waiting: number }} Beat */

/** @param {(file: string) => Promise<any>} loadJson compiled Ink by file name */
export function createStoryBook(loadJson) {
  /** @type {Map<string, Promise<any>>} */
  const stories = new Map();
  const storyOf = (file) => { let s = stories.get(file); if (!s) { s = loadJson(file).then((j) => new Story(j)); stories.set(file, s); } return s; };

  /** Start a conversation at `knot`. `push` sends one command to the sim.
   * @param {string} file @param {string} knot @param {Record<string, any>} vars @param {(cmd: any) => void} push */
  async function open(file, knot, vars, push) {
    const story = await storyOf(file);
    const bind = (/** @type {Record<string, any>} */ v) => { for (const [k, x] of Object.entries(v || {})) { try { story.variablesState[k] = x; } catch (e) { /* not declared here */ } } };
    bind(vars); story.ChoosePathString(knot);
    /** @returns {Beat} run on to the next choice (or the end), or to the first line with effects */
    let before = '';                              // the story's state before the last line (JSON), for resume
    function step() {
      const lines = [], windows = [];
      let sent = 0;
      while (story.canContinue && !sent) {
        before = story.state.ToJson();
        const text = story.Continue().trim();
        for (const raw of story.currentTags || []) {
          const t = parseTag(raw); if (!t || PRESENTATION.has(t.tag)) continue;
          if (WINDOW.has(t.tag)) windows.push(t); else { push({ type: 'dialogueEffect', tag: t.tag, args: t.args }); sent++; }
        }
        if (text) lines.push(text);
      }
      if (sent) return { lines, choices: [], windows, ended: false, waiting: sent };
      const choices = story.currentChoices.map((c) => ({ index: c.index, text: c.text, mark: (c.tags || []).map(parseTag).find((t) => t && t.tag === 'mark')?.args || [] }));
      return { lines, choices, windows, ended: !choices.length, waiting: 0 };
    }
    return { first: step(), /** @param {number} i */ choose: (i) => { story.ChooseChoiceIndex(i); return step(); },
      /** carry on from a waiting beat with the sim's variables @param {Record<string, any>} v */ resume: (v) => { story.state.LoadJson(before); bind(v); story.Continue(); return step(); } };
  }
  return { open };
}
