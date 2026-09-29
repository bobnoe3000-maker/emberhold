// @ts-check
// classicons.js — small class icons (who can use a bag item), approved from a proposal board.
// Filled 24×24 silhouettes: the shape carries the meaning, the colour only helps (never colour
// alone). The healer's is a sprig of leaves, not a cross: that emblem is protected.

const ICONS = {
  fighter: { c: '#c9d2e0', label: 'Fighter', path: '<path d="M12 2.5 20 5v6.2c0 5-3.4 8.6-8 10.3C7.4 19.8 4 16.2 4 11.2V5z"/><circle cx="12" cy="10.5" r="2.4" fill="#0d0913"/>' },
  rogue: { c: '#8fe07a', label: 'Rogue', path: '<path d="M12 1.8 14.2 6v8.2H9.8V6z"/><path d="M7 14.2h10v1.9H7z"/><path d="M10.9 16.1h2.2v4.2h-2.2z"/><circle cx="12" cy="21.3" r="1.5"/>' },
  mage: { c: '#8fb0ff', label: 'Mage', path: '<path d="M13.2 2.2c-3 2.8-5.4 8-6.6 13.3h11.2C17 11 16 6.8 13.2 2.2z"/><path d="M3 16.3h18v2.4H3z"/><path d="M12.3 8.2l.8 1.7 1.8.2-1.3 1.2.4 1.8-1.7-.9-1.6.9.3-1.8-1.3-1.2 1.8-.2z" fill="#0d0913"/>' },
  cleric: { c: '#ffd678', label: 'Cleric', path: '<path d="M11 10.5h2v11h-2z"/><circle cx="12" cy="21.4" r="1.4"/><path d="M12 1.6 13.3 4l2.7-.9-.6 2.8 2.6 1.2-2.6 1.2.6 2.8-2.7-.9L12 12.6 10.7 10.2 8 11.1l.6-2.8L6 7.1l2.6-1.2L8 3.1l2.7.9z"/>' },
  healer: { c: '#b6e3c8', label: 'Healer', path: '<path d="M11.2 22v-9.5c0-2 .3-3.8 1-5.6l1.6.5c-.6 1.7-.9 3.3-.9 5.1V22z"/><path d="M12.2 7.6C11.3 4.5 12.6 2.2 16 1.6c.7 3.3-.8 5.6-3.8 6z"/><path d="M11.8 12.2c-2.8.4-5.1-1-5.8-4.2 3.4-.5 5.5.9 5.8 4.2z"/><path d="M12.6 15.6c.5-3 2.8-4.7 6-4.2-.4 3.3-2.7 4.9-6 4.2z"/>' },
};

/** a class's colour as `rgba(r,g,b,a)` (the character window's glow) @param {string} cls @param {number} a */
export function classColor(cls, a = 1) {
  const c = (ICONS[cls] || ICONS.fighter).c, n = (i) => parseInt(c.slice(i, i + 2), 16);
  return `rgba(${n(1)},${n(3)},${n(5)},${a})`;
}

/** an inline SVG for a class ('' for an unknown one) @param {string} cls */
export function classIcon(cls) {
  const I = ICONS[cls]; if (!I) return '';
  return `<svg viewBox="0 0 24 24" fill="${I.c}" role="img" aria-label="${I.label}"><title>${I.label}</title>${I.path}</svg>`;
}
