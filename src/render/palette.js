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

// ---- Dreadforge master palette (v0.4). Ramps as [r,g,b] for the native-buffer
// renderer. Desaturated cold bases, one poison accent, ember reserved for eyes. ----
const _hx = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const INK_RGB = [11, 9, 16];       // #0b0910 — the void ground
export const DREAD = {
  soil:   ['#120e1c', '#1f1830', '#2f2444', '#413156', '#554165'].map(_hx),  // ashen violet-gray
  flesh:  ['#260e16', '#421a24', '#622834', '#843a44', '#a2545c'].map(_hx),  // organic growth
  bone:   ['#332f28', '#524c40', '#756e5e', '#9c9482', '#c4bba6'].map(_hx),  // high shale
  poison: ['#0c2010', '#1a3c1e', '#2c6229', '#4c9438', '#84d44c'].map(_hx),  // corruption
  water:  ['#060410', '#0c091c', '#130e2a', '#1c1440'].map(_hx),             // void water
  obsid:  ['#0e0a16', '#1c1526', '#2c2138', '#3e2f4e', '#554270'].map(_hx),  // spires / props
};
export const DGLOW = { poison: _hx('#c8ff7a'), violet: _hx('#be96ff'), ember: _hx('#ff785a'), water: _hx('#5a46b4') };

// ---- Emberlit master palette (v0.5). Same materials, but the albedo ramps are
// a touch BRIGHTER than DREAD: deferred lighting multiplies albedo by a low
// ambient and adds dynamic light, so surfaces must carry headroom to relight.
// These feed the WebGL2 renderer + G-sprite bakers; DREAD stays for the parked
// Canvas2D path. Emissive colors are HDR — the lighting pass scales them ×3.2.
export const ELIT = {
  soil:   ['#161226', '#241c38', '#342a4c', '#463a60', '#584a70'].map(_hx),
  flesh:  ['#2a1220', '#48202e', '#682e3c', '#88404a', '#a45a62'].map(_hx),
  bone:   ['#38342c', '#565046', '#787064', '#a0988a', '#c8c0ac'].map(_hx),
  poison: ['#0e2412', '#1e4222', '#30662e', '#50983c', '#88d850'].map(_hx),
  water:  ['#080614', '#0e0a20', '#16102e', '#201646'].map(_hx),
  obsid:  ['#100c1a', '#1e172a', '#2e233c', '#402f52', '#584474'].map(_hx),
  // dungeon-theme terrains
  sand:   ['#241c14', '#3a2c1e', '#54402c', '#74603e', '#9a8256'].map(_hx),  // barren desert dusk
  basalt: ['#121218', '#202028', '#2e2e3a', '#40404e', '#54545f'].map(_hx),  // cold volcanic rock
  lava:   ['#180c0a', '#2a140e', '#3e1e14', '#54281a', '#6a3420'].map(_hx),  // dark crust (cracks glow)
  ember:  ['#1a0e08', '#2c160c', '#402012', '#582c18', '#743a20'].map(_hx),  // scorched vent stone
  chasm:  ['#1a1822', '#2a2834', '#3c3948', '#50505e', '#6a6878'].map(_hx),  // cracked pale stone
  // tile-style variants (tilestyles.js VARIANTS): floor / wall / pool ramps
  stone:  ['#17171c', '#25252d', '#35353f', '#494954', '#5f5f6b'].map(_hx),  // plain dressed stone
  earth:  ['#1c140e', '#2e2016', '#42301f', '#584029', '#705436'].map(_hx),  // packed earth
  loam:   ['#170f0a', '#261a11', '#382619', '#4c3422', '#62442e'].map(_hx),  // earthen walls
  rock:   ['#1a1813', '#2b2820', '#3e3a2e', '#555041', '#6e6855'].map(_hx),  // weathered natural rock (warm)
  crag:   ['#131618', '#1f2427', '#2d3438', '#3e484e', '#526068'].map(_hx),  // cold crag walls
  moss:   ['#121710', '#1d2618', '#2b3822', '#3b4c2e', '#4e623b'].map(_hx),  // blighted moss stone
  ice:    ['#141b27', '#1f2b3c', '#2d3e54', '#40566f', '#5a7490'].map(_hx),  // packed snow-ice
  glacier:['#0f1726', '#18263d', '#253957', '#365174', '#4c6c96'].map(_hx),  // glacier walls
  frost:  ['#2a4056', '#3b5670', '#50728e', '#6a8ea8', '#8eb0c8'].map(_hx),  // frozen pools
  slate:  ['#11171e', '#1b232d', '#27323f', '#364453', '#4a5a6b'].map(_hx),  // wet slate
  tide:   ['#05111b', '#091c2c', '#0f2e44', '#17425c', '#225a76'].map(_hx),  // clear dark water
  mud:    ['#110b07', '#1c130b', '#281b11', '#352417', '#452f1d'].map(_hx),  // mud pools
  pit:    ['#040306', '#08070c', '#0e0c14', '#16131e', '#1f1b29'].map(_hx),  // sunken pits
  // surface scenes (town / overland at dusk)
  grass:  ['#12170f', '#1c2317', '#27301f', '#343e29', '#465036'].map(_hx),  // dusk meadow, olive-grey
  grass_fens:    ['#0f150f', '#161f18', '#1e2a20', '#28362a', '#374636'].map(_hx),  // sodden fen grass
  grass_reach:   ['#131110', '#1d1a17', '#27231f', '#332e28', '#433c34'].map(_hx),  // ash-dusted scrub
  grass_heights: ['#191c1d', '#242929', '#303736', '#414946', '#58605b'].map(_hx),  // frost-bitten turf
  dirt:   ['#191512', '#27201b', '#352c25', '#463b32', '#5a4d42'].map(_hx),  // packed road
  street: ['#1a1816', '#272420', '#36312b', '#46403a', '#59524a'].map(_hx),  // town cobbles, warm grey
  river:  ['#09131b', '#0e1d28', '#142838', '#1d394a', '#385565'].map(_hx),  // cold river water
  wheat:  ['#242011', '#353018', '#4a4222', '#61562d', '#7a6c3a'].map(_hx),  // late wheat
};
export const EGLOW = {
  poison: [190, 255, 110], violet: [180, 140, 255], ember: [255, 150, 70],
  water: [100, 80, 200], lava: [255, 110, 40], soul: [150, 120, 255],
  frost: [170, 225, 255], aqua: [80, 180, 235], window: [255, 176, 92],
};
