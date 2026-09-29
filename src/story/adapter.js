// @ts-check
// adapter.js — runs Ink conversations for the dialogue window (architecture A4, quest-lore-system
// §6). The story layer: it reads the sim's variables (sent with the 'dialogue' event), plays the
// compiled Ink (content/dialogue/<file>.json, compiled by tools/content/ink.mjs), and turns the
// effect tags it meets into `dialogueEffect` commands. It never touches sim state: the sim checks
// every effect against the talking NPC's allowances and ignores the rest.
//
// Tags (`# name: args…`): presentation ones (portrait, sfx) are dropped; window ones (service,
// shop) go back to the caller to open that window; everything else is a dialogueEffect.
// One Story per file is kept for the session, so Ink's cycles ({&a|b}) move on between visits.

import { Story } from 'inkjs';

const PRESENTATION = new Set(['portrait', 'sfx']), WINDOW = new Set(['service', 'shop']);

/** '# flag: set met_maudry' → { tag: 'flag', args: ['set', 'met_maudry'] } (null if not name: args)
 * @param {string} raw */
export function parseTag(raw) {
  const m = /^\s*([a-z][a-z_]*)\s*:\s*(.*)$/i.exec(String(raw)); if (!m) return null;
  return { tag: m[1].toLowerCase(), args: m[2].trim().split(/\s+/).filter(Boolean) };
}

/** @typedef {{ lines: string[], choices: { index: number, text: string }[], windows: { tag: string, args: string[] }[], ended: boolean }} Beat */

/** @param {(file: string) => Promise<any>} loadJson compiled Ink by file name */
export function createStoryBook(loadJson) {
  /** @type {Map<string, Promise<any>>} */
  const stories = new Map();
  const storyOf = (file) => { let s = stories.get(file); if (!s) { s = loadJson(file).then((j) => new Story(j)); stories.set(file, s); } return s; };

  /** Start a conversation at `knot`. `push` sends one command to the sim.
   * @param {string} file @param {string} knot @param {Record<string, any>} vars @param {(cmd: any) => void} push */
  async function open(file, knot, vars, push) {
    const story = await storyOf(file);
    for (const [k, v] of Object.entries(vars || {})) { try { story.variablesState[k] = v; } catch (e) { /* not declared in this file: it doesn't read it */ } }
    story.ChoosePathString(knot);
    /** @returns {Beat} run on to the next choice (or the end) */
    function step() {
      const lines = [], windows = [];
      while (story.canContinue) {
        const text = story.Continue().trim();
        for (const raw of story.currentTags || []) {
          const t = parseTag(raw); if (!t || PRESENTATION.has(t.tag)) continue;
          if (WINDOW.has(t.tag)) windows.push(t); else push({ type: 'dialogueEffect', tag: t.tag, args: t.args });
        }
        if (text) lines.push(text);
      }
      const choices = story.currentChoices.map((c) => ({ index: c.index, text: c.text }));
      return { lines, choices, windows, ended: !choices.length };
    }
    return { first: step(), /** @param {number} i */ choose: (i) => { story.ChooseChoiceIndex(i); return step(); } };
  }
  return { open };
}
