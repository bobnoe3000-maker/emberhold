// @ts-check
// weathericon.js — the weather's icon beside the sky dial (docs/weather-icon-mockup.md; the owner, 2026-10-04:
// "icons only for weather"). 16 × 14 CSS px, the dial's height, drawn as SVG like the dial: a sun or a moon, the same
// half behind a cloud, fog, rain, snow or wind. Each has a thin dark outline (the HUD's #141020) so it reads over
// grass, water and the night. The word never sits beside it: the dial's tap toast and its screen-reader label say it.

const OUT = '#141020', SUN = '#f0d478', MOON = '#a8c0ff';
const CLOUD = 'M3.2 12.6h8.6a2.5 2.5 0 0 0 .2-5 3.3 3.3 0 0 0-6.3-1 2.6 2.6 0 0 0-2.5 6z';   // a cloud, its base at y 12.6
const sun = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${SUN}" stroke="${OUT}" stroke-width=".8"/>`
  + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = i * Math.PI / 4, c = Math.cos(a), s = Math.sin(a);
    return `<line x1="${(cx + c * (r + 1.1)).toFixed(1)}" y1="${(cy + s * (r + 1.1)).toFixed(1)}" x2="${(cx + c * (r + 2.4)).toFixed(1)}" y2="${(cy + s * (r + 2.4)).toFixed(1)}" stroke="${SUN}" stroke-width="1.1" stroke-linecap="round"/>`; }).join('');
// the moon's bite is cut out with a mask, so the world shows through it rather than a dark disc
const moon = (id, cx, cy, r) => `<mask id="${id}"><rect x="0" y="0" width="16" height="14" fill="#fff"/><circle cx="${cx + r * 0.55}" cy="${cy - r * 0.4}" r="${r * 0.85}" fill="#000"/></mask>`
  + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${MOON}" stroke="${OUT}" stroke-width=".8" mask="url(#${id})"/>`;
const cloud = (fill) => `<path d="${CLOUD}" fill="${fill}" stroke="${OUT}" stroke-width=".8" stroke-linejoin="round"/>`;
const cloudUp = (fill) => `<g transform="translate(0 -3)">${cloud(fill)}</g>`;
let ids = 0;

/** the icon, as an SVG string @param {import('../sim/weather.js').SkyKind} sky @param {boolean} night */
export function weatherIcon(sky, night) {
  const id = `wim${++ids}`, pale = night ? '#8a90a0' : '#d4d8e0', dim = night ? 0.75 : 1;
  const body = {
    sunny: night ? moon(id, 7, 7, 4.2) + `<circle cx="13.4" cy="3" r=".9" fill="${MOON}"/><circle cx="12.4" cy="10.8" r=".7" fill="${MOON}"/>` : sun(8, 7, 3.4),
    partly: (night ? moon(id, 6, 5, 3.4) : sun(6, 5, 2.6)) + `<g transform="translate(2.2 .6)">${cloud(pale)}</g>`,
    fog: [3.5, 7, 10.5].map((y, i) => `<path d="M${1.5 + i},${y} q2.2 -1.6 4.4 0 t4.4 0 t4.4 0" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M${1.5 + i},${y} q2.2 -1.6 4.4 0 t4.4 0 t4.4 0" fill="none" stroke="#b8bec8" stroke-width="1.3" stroke-linecap="round" opacity="${dim}"/>`).join(''),
    rain: cloudUp(night ? '#7a8090' : '#c8ccd4') + [4.5, 8, 11.5].map((x) => `<line x1="${x}" y1="11" x2="${x - 1.4}" y2="13.8" stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"/><line x1="${x}" y1="11" x2="${x - 1.4}" y2="13.8" stroke="#7fb0e0" stroke-width="1.2" stroke-linecap="round"/>`).join(''),
    snow: cloudUp(night ? '#7a8090' : '#c8ccd4') + [4.5, 8, 11.5].map((x, i) => `<circle cx="${x - (i % 2) * 0.6}" cy="${12.2 + (i % 2) * 0.8}" r="1.25" fill="#f4f6fa" stroke="${OUT}" stroke-width=".6"/>`).join(''),
    wind: ['M1.5 4.5h8.5a2 2 0 1 0-2-2', 'M1.5 8h11a2 2 0 1 1-2 2', 'M3 11.5h6'].map((d) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#c8d0d8" stroke-width="1.3" stroke-linecap="round" opacity="${dim}"/>`).join(''),
  }[sky];
  return `<svg class="wx" width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">${body || ''}</svg>`;
}

/** the sky's word, for the dial's tap and its screen-reader label @param {import('../sim/weather.js').SkyKind} sky @param {boolean} night */
export const skyWord = (sky, night) => ({ sunny: night ? 'clear' : 'sunny', partly: night ? 'partly cloudy' : 'partly sunny', fog: 'fog', rain: 'rain', snow: 'snow', wind: 'wind' })[sky] || '';
