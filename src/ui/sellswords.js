// @ts-check
// sellswords.js — the Lantern Guild's sellswords in the windows (GDD §6.2): rank marks (a colour and
// always the word, never the colour alone), perk names and lines from content/companions.json, and the
// loyalty and wage lines. Reads sim state; never writes it.

import { PERKS, loyaltyOf, wageOf, hired, sworn, SWORN_AT, REVEAL_AT } from '../sim/companions.js';
import { esc } from './actorart.js';

export const RANK_COL = { wick: '#c8bcae', lamp: '#9ad87e', lantern: '#86c0ff', beacon: '#ffc24a', found: '#e8d4ae' };
/** @type {any} */
let words = null;
export const wordsReady = fetch('./content/companions.json').then((r) => r.json()).then((d) => { words = d; }).catch(() => {});
export const rankName = (/** @type {string} */ r) => (words && words.ranks[r] && words.ranks[r].name) || r;
export const rankLine = (/** @type {string} */ r) => (words && words.ranks[r] && words.ranks[r].line) || '';
export const perkWord = (/** @type {string} */ id) => (words && words.perks[id]) || { name: id, text: '' };
export const famWord = (/** @type {string} */ id) => (words && words.families[(PERKS[id] || {}).fam]) || '';

/** ◆ Lantern, in its colour @param {any} m */
export const rankMark = (m) => (m && m.rank ? `<i class="rk" style="color:${RANK_COL[m.rank] || '#ccc'};border-color:${RANK_COL[m.rank] || '#ccc'}">◆ ${esc(rankName(m.rank))}</i>` : '');
/** "Loyalty 2/5" / "Sworn" @param {any} m */
export const loyaltyWord = (m) => (!hired(m) ? '' : sworn(m) ? 'Sworn' : `Loyalty ${loyaltyOf(m)}/${SWORN_AT}`);
/** the perk lines, each with its family; a hidden one as a line of its own @param {any} m */
export function perkLines(m) {
  if (!m || !Array.isArray(m.perks)) return '';
  const dark = m.owed > 0;
  const lines = m.perks.map((id) => { const w = perkWord(id); return `<div class="pk${dark ? ' dark' : ''}${PERKS[id] && PERKS[id].fam === 'quirk' ? ' quirk' : ''}"><b>${esc(w.name)}</b> <small>${esc(famWord(id))}</small><br>${esc(w.text)}</div>`; });
  if (m.hidden) lines.push(`<div class="pk hid"><b>One more, kept back</b><br>Shows at loyalty ${REVEAL_AT}</div>`);
  return lines.join('');
}
/** a dawn's wage line @param {any} m @param {boolean} benched */
export const wageLine = (m, benched) => (hired(m) ? `${wageOf(m, benched)} gold a dawn${benched ? ' (benched: half)' : ''}` : 'no wage');
export const SW_CSS = `
.rk { display: inline-block; font: 700 10.5px ui-monospace, Menlo, monospace; font-style: normal; letter-spacing: .4px; border: 1px solid; border-radius: 4px; padding: 1px 5px; margin-left: 6px; vertical-align: 1px; }
.pk { font: 12px/1.35 Georgia, serif; color: #d8ccb8; margin-top: 5px; padding-left: 9px; border-left: 2px solid rgba(214,170,98,.35); }
.pk b { color: #f0dcb0; font-weight: 600; }
.pk small { font: 10px ui-monospace, Menlo, monospace; color: #a8987e; letter-spacing: .4px; text-transform: uppercase; }
.pk.quirk { border-left-color: rgba(255,140,110,.5); }
.pk.hid { color: #a8a0b8; border-left-style: dashed; }
.pk.dark { opacity: .45; }
`;
