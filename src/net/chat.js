// @ts-check
// chat.js — talking with other players (the chat dock's Chat channel, ui/chatdock.js). The transport is the online
// part's (architecture A7: Supabase; its Realtime channels carry a room's lines), and it waits on the owner's project as
// accounts do (net/account.js, docs/online-setup.md): with no online config, chat is offline and says so, and nothing
// touches the network. What a line must be is fixed here, whoever carries it: a player's own words, plain text (drawn
// as text, never as HTML), 1 to MAX_LINE characters, trimmed; the name it's shown under is the account's handle.
// Moderation (a word filter, report, mute) comes with the transport: a player's words are the one text in the game no
// one wrote ahead of time (AGENTS.md, narrative content), so they're never shown to others unfiltered.

export const MAX_LINE = 140;

/** a line as it may be sent: trimmed, single-line, at most MAX_LINE, or '' @param {string} s */
export function cleanLine(s) { return [...String(s || '')].map((c) => (c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127 ? ' ' : c)).join('').replace(/\s+/g, ' ').trim().slice(0, MAX_LINE); }

/**
 * @typedef {{ who: string, lv?: number, text: string, at: number, me?: boolean }} ChatLine
 * @typedef {{ online: boolean, why: string, send: (text: string) => { ok: boolean, why?: string }, onLine: (fn: (l: ChatLine) => void) => void }} Chat
 */
/** the chat as this build has it. Offline (no online config, or no transport yet): sends nothing, says why
 * @param {{ online?: any }} [o] @returns {Chat} */
export function createChat({ online = null } = {}) {
  const why = online ? 'Chat with other players comes with online play: this build can’t carry it yet.' : 'Chat with other players comes with online play.';
  return {
    online: false, why,
    send(text) { return cleanLine(text) ? { ok: false, why } : { ok: false, why: 'Nothing to say.' }; },
    onLine() {},
  };
}
