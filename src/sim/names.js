// @ts-check
// names.js — the names a hero may not take (GDD §6.1 v1.64; the owner, 2026-11-10: "Disallow profanity or other
// typically un-allowed names in an MMO"). The sim's rule, so every client and the replay refuse the same names: the
// UI asks it as you type (create.js), and createHero (heroes.js) refuses what it refuses.
//
// The name is checked as party.js cleanName leaves it (letters, spaces and hyphens), folded: lower case, accents off
// by an explicit table (no Unicode tables: they differ between engines, and the replay mustn't), each letter of a
// listed word let run on ("fuuuck", "asss": a doubled letter stays at least doubled, so "boob" never takes "Bob").
// Two lists:
//   · ANYWHERE: refused wherever it falls in the name, spaces and hyphens taken out ("Shi-t", "Bigshitter");
//   · WORDS: refused as the whole name or one of its words, as they hide inside honest names (Cassia, Hancock, Dickon,
//     Grape, Titus, Analise);
// and a third, the staff and the game, so nobody passes as one of us (GM Tam, Admin, Emberfall).
// What's refused is the obvious; a list can't be the whole of it, and a report button is the rest (later, online).

/** accented letters folded to their plain ones (cleanName lets through U+00C0–U+024F) */
const FOLD = {};
for (const [plain, from] of Object.entries({
  a: 'àáâãäåāăąǎǟǡǻȁȃȧ', c: 'çćĉċč', d: 'ďđ', e: 'èéêëēĕėęěȅȇȩ', g: 'ĝğġģǥǧǵ', h: 'ĥħȟ', i: 'ìíîïĩīĭįıǐȉȋ', j: 'ĵǰ',
  k: 'ķĸǩ', l: 'ĺļľŀł', n: 'ñńņňŉŋǹ', o: 'òóôõöøōŏőǒǫǭǿȍȏȫȭȯȱ', r: 'ŕŗřȑȓ', s: 'śŝşšșſ', t: 'ţťŧț', u: 'ùúûüũūŭůűųǔǖǘǚǜȕȗ',
  w: 'ŵ', y: 'ýÿŷȳ', z: 'źżžƶ', ae: 'æǣǽ', oe: 'œ', ss: 'ß', th: 'þ', dh: 'ð',
})) for (const ch of from) FOLD[ch] = plain;
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
/** one letter, lower and plain @param {string} ch */
function foldChar(ch) {
  const u = UPPER.indexOf(ch);
  if (u >= 0) return 'abcdefghijklmnopqrstuvwxyz'[u];
  const lo = ch.toLowerCase();                                  // (only within the table's own letters, checked below)
  return FOLD[ch] ?? FOLD[lo] ?? (/[a-z]/.test(ch) ? ch : '');
}
/** the name folded: lower, plain, its words @param {string} name */
export function foldName(name) {
  const words = String(name ?? '').split(/[\s-]+/).filter(Boolean).map((w) => [...w].map(foldChar).join(''));
  return { words, flat: words.join('') };
}
/** a listed word as a pattern: each letter may run on, a doubled one stays at least doubled @param {string} w */
const pat = (w) => (w.match(/(.)\1*/g) || []).map((r) => (r.length > 1 ? `${r[0]}{${r.length},}` : `${r}+`)).join('');

// (kept short and plain: the words, not the clever spellings; runs() and the fold take the stretched and the accented)
const ANYWHERE = ['fuck', 'fuk', 'fvck', 'phuck', 'shit', 'cunt', 'nigger', 'nigga', 'niglet', 'faggot', 'fagot', 'whore', 'slut',
  'bitch', 'penis', 'vagina', 'porn', 'nazi', 'hitler', 'kike', 'retard', 'twat', 'wank', 'bastard', 'dildo', 'jizz', 'pussy',
  'cocksuck', 'motherf', 'asshole', 'arsehole', 'bollock', 'tranny', 'paedo', 'pedo', 'rapist', 'molest', 'semen', 'clit',
  'orgasm', 'kkk', 'heil'];
const WORDS = ['ass', 'arse', 'cock', 'dick', 'rape', 'spic', 'chink', 'cum', 'tit', 'tits', 'anal', 'anus', 'sex', 'piss',
  'fag', 'gook', 'coon', 'dyke', 'homo', 'nonce', 'poon', 'scat', 'boob', 'boobs', 'knob', 'prick', 'turd'];
// the staff and the game itself: anywhere (Admin, Adminbob), or as a word (GM Tam, Dev)
const STAFF_ANYWHERE = ['admin', 'moderator', 'gamemaster', 'emberfall', 'customerservice', 'officialstaff'];
const STAFF_WORDS = ['gm', 'mod', 'dev', 'devs', 'staff', 'support', 'system', 'official', 'owner', 'helpdesk', 'server'];

const anywhere = (list) => list.map((w) => new RegExp(pat(w))), whole = (list) => list.map((w) => new RegExp(`^${pat(w)}$`));
const RUDE_ANY = anywhere(ANYWHERE), RUDE_WORD = whole(WORDS), STAFF_ANY = anywhere(STAFF_ANYWHERE), STAFF_WORD = whole(STAFF_WORDS);

export const REFUSE_RUDE = 'That name is not allowed', REFUSE_STAFF = 'That name is kept for the game itself';
/** why the sim won't take this name, or null when it will @param {string} name (as cleanName leaves it) */
export function nameRefusal(name) {
  const { words, flat } = foldName(name);
  const hit = (any, word) => any.some((re) => re.test(flat)) || word.some((re) => re.test(flat) || words.some((x) => re.test(x)));
  if (hit(RUDE_ANY, RUDE_WORD)) return REFUSE_RUDE;
  if (hit(STAFF_ANY, STAFF_WORD)) return REFUSE_STAFF;
  return null;
}
