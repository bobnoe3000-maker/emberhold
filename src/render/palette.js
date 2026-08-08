// palette.js — dark-mood token system. Generators reference names, never raw hex.
// Phase 0 ships one biome: EMBERWOOD — a dusk-lit dark meadow. Torchlight carries the warmth.

export const INK = '#0d0913';

export const EMBERWOOD = {
  name: 'Emberwood',
  // shade ramps: [highlight, base, shade, deep]
  GRASS: ['#647c44', '#425833', '#2d3f27', '#1b281a'],
  DIRT:  ['#8a6746', '#634830', '#453222', '#2d2015'],
  WATER: ['#33586e', '#1e3a52', '#122638'],
  ACCENT: '#b05a74',       // dusk flowers
  ACCENT2: '#c9a14e',      // ember motes
  CANOPY: ['#3a5a32', '#28421f', '#182a15'],
  TRUNK:  ['#54402c', '#382a1c'],
  ROCK:   ['#7c7c92', '#585868', '#3c3c4c', '#26262f'],
};

export const LIGHT = {
  ambient: 'rgba(9, 7, 18, 0.52)',   // dusk veil over everything
  torchInner: 'rgba(255, 176, 102, 0.16)',
  torchRadius: 4.6,                  // tiles
  flicker: 0.22,                     // radius jitter fraction
};

// ---- character tokens (shared with assetforge/doll.js) ----
export const SKINS = [
  ['#f4d6b6', '#e0ac80', '#b07a52'],
  ['#e8c096', '#cc9868', '#9c6c44'],
  ['#d0a074', '#ac7c50', '#805436'],
  ['#a87850', '#885c3a', '#5c3e28'],
  ['#845430', '#663f26', '#442a1a'],
  ['#5c3c28', '#452c1e', '#2e1d14'],
];
export const HAIRC = ['#241c2c', '#4c3020', '#744c26', '#a87834', '#b8b0a8', '#8c3434', '#345888', '#634488'];
export const CLOTH = ['#8c3838', '#345888', '#356e4a', '#70487c', '#a87834', '#4c5866', '#63402f', '#3c7470', '#84486a', '#586638'];
export const LEATHER = '#33251b';
export const WOODC = ['#8c6438', '#64482a'];
export const METAL = {
  T1: ['#e0a068', '#b06838', '#804424', '#582e18'],   // copper
  T2: ['#c8ccd8', '#909ab0', '#606c80', '#3e4a58'],   // iron
  T3: ['#8ce0c8', '#48ac90', '#2c7868', '#1a4c48'],   // deepsilver
  T4: ['#dcb0f0', '#9c5cd8', '#6434a0', '#3c1c68'],   // riftsteel
};
