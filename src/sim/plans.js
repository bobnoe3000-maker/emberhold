// @ts-check
// plans.js — the Hollow Vale's dungeons as authored floor plans (docs/vale-dungeons-plan.md; the owner, 2026-11-02:
// "Each dungeon should still have a progression of rooms with higher level NPCs and maybe an offshoot. But no more than
// 5 rooms or large corridors total per floor. There can be hallways but perhaps at least 8 wide. No more than 2 levels
// down. Dressing and even layout should fit to the dungeon type").
//
// A PROPOSAL, not yet built from: level.js still generates every floor (halls.js, the caverns). When the owner signs the
// plan off, generateLevel builds a Vale floor from its plan here instead (the same shape out: cells, rooms, edges, spawn,
// entrance, descentRoom), and sites.js takes its floors, levels and bosses from it. Until then the plans are drawn by
// tools/dungeon/vale-plans.mjs and held to their rules by test/plans.test.mjs.
//
// A floor is up to five SPACES (the entrance, the rooms, a large corridor such as the Long Gallery, an offshoot) joined
// by HALLS, which are safe ground (GDD §3.1), 10 tiles wide (the owner, 2026-11-02: "halls 10"), 8–14 long. Tiles are the sim's (two to Luminati's
// unit). x runs east, y south; the camera looks from the south-east (+x+y), so a floor's entrance sits up-screen at its
// north-west, its back walls standing for the stair up, and the way runs on down-screen to the descent room.
//
// A space's `lv` is its level above the dungeon's base. A band of three levels over two floors:
//   floor 1: its first rooms at base, the offshoot and the hall a level up (the hall's boss, if any, there);
//   floor 2: its first room at base + 1, the rest at base + 2, the hall's boss at the band's top.
// `shape`: 'rect' (built: dressed stone, straight walls), 'cave' (dug or grown: an irregular blob inside its box, rock
// walls), 'round' (built round: the binding crypt). `kit` is the dressing (world.js DRESS, and the new pieces the plan
// names); `dress` lists what stands where, for the drawing and for world.js when it's built.

/** @typedef {'entrance' | 'room' | 'offshoot' | 'descent' | 'end'} Role */
/** @typedef {{ id: string, name: string, role: Role, x: number, y: number, w: number, h: number, shape: 'rect' | 'cave' | 'round', lv: number, kit: string, boss?: string, foes?: string, dress: string[], note: string }} Space */
/** @typedef {{ from: string, to: string, x: number, y: number, w: number, h: number, rough?: boolean }} Hall */
/** @typedef {{ name: string, spaces: Space[], halls: Hall[] }} Floor */
/** @typedef {{ site: string, name: string, kind: string, base: number, flat?: boolean, floors: Floor[] }} Plan */

export const PLAN_RULES = Object.freeze({ maxSpaces: 5, maxFloors: 2, hallMinW: 10, hallMaxLen: 14, small: [18, 26], medium: [28, 38], large: [40, 62], gallery: [60, 80] });

/** @type {Record<string, Plan>} */
export const PLANS = {
  // ── The Old Barrows (1–3): a barrow. Dug at the door, built within: an axis of long galleries, niches cut in the walls.
  barrows: { site: 'barrows', name: 'The Old Barrows', kind: 'crypt', base: 1, floors: [
    { name: 'The Barrow Mouth', spaces: [
      { id: 'barrow_mouth', name: 'The Barrow Mouth', role: 'entrance', x: 0, y: 0, w: 32, h: 28, shape: 'cave', lv: 0, kit: 'dig',
        dress: ['camp', 'tents', 'spoil', 'lanterns', 'crates'], note: 'The Redhand\'s camp at the door: two tents, a cookfire, spoil heaps, their crates. The stair up is the dug ramp to daylight in the north wall.' },
      { id: 'the_cutting', name: 'The Cutting', role: 'room', x: 42, y: 0, w: 36, h: 30, shape: 'cave', lv: 0, kit: 'dig', foes: 'cutting',
        dress: ['timbers', 'spoil', 'lanterns', 'barrows'], note: 'The Redhand\'s trench through the mound: earth walls shored with timbers, barrows of spoil, lanterns on poles. The diggers still at it. (v1.58) Grave rats come up with the spoil, and Old Gutter leads them.' },
      { id: 'the_breach', name: 'The Breach', role: 'room', x: 36, y: 40, w: 56, h: 52, shape: 'rect', lv: 0, kit: 'gallery', foes: 'ashbound',
        dress: ['rubble', 'niches', 'candles', 'spoil'], note: 'Where the dig broke into the barrow\'s built passage: its west end raw earth and rubble, its east end dressed stone, the first niches, the first of the dead standing up.' },
      { id: 'robbed_tomb', name: 'The Robbed Tomb', role: 'offshoot', x: 80, y: 8, w: 24, h: 22, shape: 'rect', lv: 1, kit: 'gallery', foes: 'ashbound',
        dress: ['sarcophagus_open', 'grave_goods', 'candles', 'chest', 'shrine'], note: 'A burial chamber the Redhand found first: the lid off, the grave goods scattered, what they missed in a chest. A fragment of the Chronicle.' },
      { id: 'barrow_door', name: 'The Barrow Door', role: 'descent', x: 46, y: 102, w: 48, h: 42, shape: 'rect', lv: 1, kit: 'gallery', foes: 'ashbound',
        dress: ['guardians', 'braziers', 'niches', 'stair_down'], note: 'The inner door the legion sealed, broken in. Two great guardian statues either side of the stair down; braziers lit by nobody.' },
    ], halls: [
      { from: 'barrow_mouth', to: 'the_cutting', x: 32, y: 10, w: 10, h: 10, rough: true },
      { from: 'the_cutting', to: 'the_breach', x: 56, y: 30, w: 10, h: 10, rough: true },
      { from: 'the_breach', to: 'robbed_tomb', x: 82, y: 30, w: 10, h: 10 },
      { from: 'the_breach', to: 'barrow_door', x: 62, y: 92, w: 10, h: 10 },
    ] },
    { name: 'The Long Gallery and the Muster Hall', spaces: [
      { id: 'stair_foot', name: 'The Stair Foot', role: 'entrance', x: 0, y: 0, w: 30, h: 28, shape: 'rect', lv: 1, kit: 'gallery',
        dress: ['niches', 'candles', 'stair_up'], note: 'The landing at the foot of the stair: Tobin\'s candles, the first names cut in the wall.' },
      { id: 'long_gallery', name: 'The Long Gallery', role: 'room', x: 0, y: 38, w: 78, h: 20, shape: 'rect', lv: 1, kit: 'gallery', foes: 'ashbound',
        dress: ['niches', 'candles', 'skulls', 'sarcophagi'], note: 'A large corridor: burial niches every six paces down both long walls, a skull and a family\'s candle in each, the dead in rows between. Maudry\'s errand and the bright-eyed officers.' },
      { id: 'clerks_room', name: 'The Clerk\'s Room', role: 'offshoot', x: 20, y: 68, w: 24, h: 22, shape: 'rect', lv: 2, kit: 'muster', foes: 'ashbound',
        dress: ['desks', 'rolls', 'candles', 'chest', 'shrine'], note: 'The legion\'s rolls on their desks, ink long dry; a chest; the muster roll for the Chronicle.' },
      { id: 'issue_room', name: 'The Issue Room', role: 'room', x: 88, y: 28, w: 34, h: 34, shape: 'rect', lv: 2, kit: 'muster', foes: 'ashbound',
        dress: ['racks', 'crates', 'standards', 'braziers'], note: 'The Quartermaster\'s stores: racks of rusted kit along the walls, crates, the ranks waiting to be re-armed.' },
      { id: 'muster_hall', name: 'The Muster Hall', role: 'end', x: 80, y: 74, w: 58, h: 46, shape: 'rect', lv: 2, kit: 'muster', foes: 'ashbound', boss: 'quartermaster',
        dress: ['colonnade', 'racks', 'standards', 'braziers'], note: 'Two colonnades, the racks along the back wall, the legion\'s standards. The Quartermaster still issues.' },
    ], halls: [
      { from: 'stair_foot', to: 'long_gallery', x: 10, y: 28, w: 10, h: 10 },
      { from: 'long_gallery', to: 'clerks_room', x: 28, y: 58, w: 10, h: 10 },
      { from: 'long_gallery', to: 'issue_room', x: 78, y: 44, w: 10, h: 10 },
      { from: 'issue_room', to: 'muster_hall', x: 100, y: 62, w: 10, h: 12 },
    ] },
  ] },

  // ── Wickham Keep (4–6): a castle, then a cave. A courtyard plan round a curtain wall above; barracks and cellars
  //    below, broken through into the cave the Redhand dug into.
  wickham_keep: { site: 'wickham_keep', name: 'Wickham Keep', kind: 'keep', base: 4, floors: [
    { name: 'The Bailey', spaces: [
      { id: 'gatehouse', name: 'The Gatehouse', role: 'entrance', x: 0, y: 34, w: 30, h: 24, shape: 'rect', lv: 0, kit: 'bailey',
        dress: ['portcullis', 'braziers', 'banners'], note: 'The gate passage under the tower, its portcullis rusted up; the Redhand\'s red hand daubed on the arch. The way out.' },
      { id: 'horse_lines', name: 'The Horse Lines', role: 'room', x: 38, y: 28, w: 40, h: 32, shape: 'rect', lv: 0, kit: 'bailey', foes: 'redhand',
        dress: ['stalls', 'hay', 'troughs', 'hen_cart'], note: 'Stalls along the north wall, hay, troughs, and Old Skarn\'s cart of stolen hens parked where the goblins can watch it.' },
      { id: 'warden_chapel', name: 'The Gate-Warden\'s Chapel', role: 'offshoot', x: 44, y: 0, w: 24, h: 18, shape: 'rect', lv: 1, kit: 'bailey', foes: 'redhand',
        dress: ['shrine', 'candles', 'benches', 'chest'], note: 'A small chapel in the gate tower: a shrine, two benches, the Gate-Warden\'s Note (the Chronicle) where he left it.' },
      { id: 'company_camp', name: 'The Company\'s Camp', role: 'room', x: 88, y: 30, w: 66, h: 22, shape: 'rect', lv: 0, kit: 'bailey', foes: 'redhand',
        dress: ['tents', 'cookfires', 'bedrolls', 'cage'], note: 'A large corridor under the curtain wall: the Company\'s tents in a row, their cookfires, and Ned Fallow in a cage at the end, waiting on Lord Pellam\'s ransom.' },
      { id: 'keep_yard', name: 'The Keep Yard', role: 'descent', x: 106, y: 62, w: 52, h: 46, shape: 'rect', lv: 1, kit: 'bailey', foes: 'goblin', boss: 'goblin_chief',
        dress: ['well', 'carts', 'banners', 'stair_down'], note: 'The yard before the keep\'s door, cobbled, a well in it. Old Skarn haggles here, drum and all. The keep\'s cellar stair goes down from its south wall.' },
    ], halls: [
      { from: 'gatehouse', to: 'horse_lines', x: 30, y: 42, w: 8, h: 10 },
      { from: 'horse_lines', to: 'warden_chapel', x: 52, y: 18, w: 10, h: 10 },
      { from: 'horse_lines', to: 'company_camp', x: 78, y: 40, w: 10, h: 10 },
      { from: 'company_camp', to: 'keep_yard', x: 130, y: 52, w: 10, h: 10 },
    ] },
    { name: 'The Barracks and the Old Cellars', spaces: [
      { id: 'undercroft_stair', name: 'The Undercroft Stair', role: 'entrance', x: 0, y: 0, w: 28, h: 26, shape: 'rect', lv: 1, kit: 'barracks',
        dress: ['casks', 'lanterns', 'stair_up'], note: 'The vaulted foot of the keep\'s stair: casks, a lantern on a hook.' },
      { id: 'barracks', name: 'The Barracks', role: 'room', x: 38, y: 0, w: 68, h: 22, shape: 'rect', lv: 1, kit: 'barracks', foes: 'redhand',
        dress: ['bunks', 'racks', 'banners', 'braziers'], note: 'A large corridor: bunks in a double row down both long walls, the armoury\'s racks at the far end. The Redhand\'s sergeants sleep here.' },
      { id: 'strongroom', name: 'The Paymaster\'s Strongroom', role: 'offshoot', x: 44, y: 32, w: 24, h: 22, shape: 'rect', lv: 2, kit: 'barracks', foes: 'redhand',
        dress: ['iron_door', 'chests', 'ledger', 'shrine'], note: 'Behind an iron door: the paymaster\'s two chests (Brannoc\'s errand) and the Last Dispatch.' },
      { id: 'old_cellars', name: 'The Old Cellars', role: 'room', x: 116, y: 0, w: 36, h: 34, shape: 'rect', lv: 2, kit: 'cellar', foes: 'cellar',
        dress: ['casks', 'scaffold', 'broken_floor', 'ladders'], note: 'The imperial cellars: casks along the walls, and in the south half the floor broken through where the Redhand dug, scaffolds and ladders going down. (v1.58) Gone to the giant spiders: the casks webbed over, spinners in the rafters, grave rats under the casks.' },
      { id: 'cellar_cave', name: 'The Cave Under the Cellars', role: 'end', x: 104, y: 46, w: 58, h: 48, shape: 'cave', lv: 2, kit: 'cellar', foes: 'diggers', boss: 'redhand_captain',
        dress: ['pools', 'stalagmites', 'drips', 'garrows_table'], note: 'The cave the dig broke into: still pools, stone teeth up out of the floor, the roof\'s water coming down. Captain Garrow\'s table, and Brannoc chained to a stalagmite.' },
    ], halls: [
      { from: 'undercroft_stair', to: 'barracks', x: 28, y: 8, w: 10, h: 10 },
      { from: 'barracks', to: 'strongroom', x: 52, y: 22, w: 10, h: 10 },
      { from: 'barracks', to: 'old_cellars', x: 106, y: 6, w: 10, h: 10 },
      { from: 'old_cellars', to: 'cellar_cave', x: 126, y: 34, w: 10, h: 12, rough: true },
    ] },
  ] },

  // ── The Sunken Chapel (7–9): a temple. Cruciform and symmetric, axial to the altar, its floor sunk under the river;
  //    below, the cult's rough cut down into the round crypt where the legion was bound.
  sunken_chapel: { site: 'sunken_chapel', name: 'The Sunken Chapel', kind: 'temple', base: 7, floors: [
    { name: 'The Nave', spaces: [
      { id: 'dry_porch', name: 'The Dry Porch', role: 'entrance', x: 0, y: 42, w: 28, h: 22, shape: 'rect', lv: 0, kit: 'nave',
        dress: ['hives', 'benches', 'doors'], note: 'The porch the river never reached: Hester Lowe\'s hives along the wall, the chapel doors off their hinges. The way out.' },
      { id: 'the_nave', name: 'The Nave', role: 'room', x: 38, y: 38, w: 66, h: 28, shape: 'rect', lv: 0, kit: 'nave', foes: 'chapel',
        dress: ['pews', 'colonnade', 'pools', 'saints'], note: 'A large corridor: two rows of pillars, the pews in two blocks either side of the aisle, standing water over the flags, fallen saints.' },
      { id: 'the_crossing', name: 'The Crossing', role: 'room', x: 114, y: 36, w: 34, h: 34, shape: 'rect', lv: 0, kit: 'nave', foes: 'chapel',
        dress: ['rubble', 'pools', 'font', 'light_shaft'], note: 'Under the fallen tower: rubble, the font, daylight down the shaft where the roof was. The south transept is fallen in.' },
      { id: 'lady_chapel', name: 'The Lady Chapel', role: 'offshoot', x: 119, y: 2, w: 24, h: 24, shape: 'rect', lv: 1, kit: 'nave', foes: 'chapel',
        dress: ['altar_small', 'candles', 'saints', 'chest', 'shrine'], note: 'The north transept\'s chapel, dry: a small altar, candles, and the chest with the Chaplain\'s Prayer.' },
      { id: 'the_chancel', name: 'The Chancel', role: 'descent', x: 158, y: 30, w: 46, h: 46, shape: 'rect', lv: 1, kit: 'cultcut', foes: 'chapel', boss: 'robed_stranger',
        dress: ['altar', 'candles', 'chains', 'stair_down'], note: 'The altar, broken through: the cult\'s cut goes down beneath it. The Robed Stranger waits by it.' },
    ], halls: [
      { from: 'dry_porch', to: 'the_nave', x: 28, y: 48, w: 10, h: 10 },
      { from: 'the_nave', to: 'the_crossing', x: 104, y: 46, w: 10, h: 10 },
      { from: 'the_crossing', to: 'lady_chapel', x: 127, y: 26, w: 10, h: 10 },
      { from: 'the_crossing', to: 'the_chancel', x: 148, y: 46, w: 10, h: 10 },
    ] },
    { name: 'The Cult\'s Cut and the Binding Crypt', spaces: [
      { id: 'cut_foot', name: 'The Cut\'s Foot', role: 'entrance', x: 0, y: 0, w: 28, h: 26, shape: 'cave', lv: 1, kit: 'cultcut',
        dress: ['windlass', 'ladders', 'sacks', 'stair_up'], note: 'The bottom of the cult\'s shaft: their windlass and bucket, ladders, sacks of spoil.' },
      { id: 'cults_cut', name: 'The Cult\'s Cut', role: 'room', x: 38, y: 0, w: 64, h: 24, shape: 'cave', lv: 1, kit: 'cultcut', foes: 'chapel',
        dress: ['chains', 'candles', 'sacks', 'gibbets'], note: 'A large corridor, dug rough and sloping down into the old stone: chains, the cult\'s candles, sacks, a gibbet or two.' },
      { id: 'robed_camp', name: 'The Robed Men\'s Camp', role: 'offshoot', x: 44, y: 34, w: 26, h: 22, shape: 'cave', lv: 2, kit: 'cultcut', foes: 'chapel',
        dress: ['bedrolls', 'ledgers', 'candles', 'chest'], note: 'Where the robed strangers slept: bedrolls, their ledgers of what was paid to whom, a chest.' },
      { id: 'hall_of_bound', name: 'The Hall of the Bound', role: 'room', x: 112, y: 0, w: 34, h: 34, shape: 'rect', lv: 2, kit: 'binding', foes: 'chapel',
        dress: ['bound', 'chains', 'candles', 'shrine'], note: 'Built crypt again: the legion\'s bound standing in rows, chained where they were put.' },
      { id: 'binding_crypt', name: 'The Binding Crypt', role: 'end', x: 106, y: 46, w: 50, h: 50, shape: 'round', lv: 2, kit: 'binding', foes: 'chapel', boss: 'standard',
        dress: ['circle', 'ring_of_pillars', 'bound', 'braziers'], note: 'Round, a ring of pillars, the binding circle in the floor, and the Standard of the Third Legion over it. Brannoc\'s Standing Down.' },
    ], halls: [
      { from: 'cut_foot', to: 'cults_cut', x: 28, y: 8, w: 10, h: 10, rough: true },
      { from: 'cults_cut', to: 'robed_camp', x: 52, y: 24, w: 10, h: 10, rough: true },
      { from: 'cults_cut', to: 'hall_of_bound', x: 102, y: 6, w: 10, h: 10, rough: true },
      { from: 'hall_of_bound', to: 'binding_crypt', x: 124, y: 34, w: 10, h: 12 },
    ] },
  ] },

  // ── The Ninth Milestone (secret, 9): the legion's strongroom under the milestone. One floor, all at 9.
  ninth_milestone: { site: 'ninth_milestone', name: 'The Ninth Milestone', kind: 'vault', base: 9, flat: true, floors: [
    { name: 'The Strongroom', spaces: [
      { id: 'milestone_shaft', name: 'The Milestone Shaft', role: 'entrance', x: 0, y: 0, w: 28, h: 24, shape: 'rect', lv: 0, kit: 'muster',
        dress: ['stair_up', 'lanterns'], note: 'The stair down from under the milestone, cut square and dry.' },
      { id: 'guardroom', name: 'The Guardroom', role: 'room', x: 38, y: 0, w: 32, h: 28, shape: 'rect', lv: 0, kit: 'muster', foes: 'ashbound',
        dress: ['racks', 'benches', 'braziers'], note: 'The last guard, still posted: racks, benches, a cold brazier.' },
      { id: 'long_vault', name: 'The Long Vault', role: 'room', x: 80, y: 4, w: 60, h: 18, shape: 'rect', lv: 0, kit: 'muster', foes: 'ashbound',
        dress: ['pay_chests', 'bars'], note: 'A large corridor of barred alcoves, the pay-chests in them long empty.' },
      { id: 'muniment_room', name: 'The Muniment Room', role: 'offshoot', x: 86, y: 32, w: 22, h: 20, shape: 'rect', lv: 0, kit: 'muster', foes: 'ashbound',
        dress: ['desks', 'rolls', 'chest', 'shrine'], note: 'The legion\'s orders filed in their pigeonholes, and a chest.' },
      { id: 'strongroom_vault', name: 'The Strongroom', role: 'end', x: 150, y: 0, w: 44, h: 40, shape: 'rect', lv: 0, kit: 'muster', foes: 'ashbound',
        dress: ['vault_chest', 'standards', 'braziers'], note: 'The vault: its chest, and in it the Last Order.' },
    ], halls: [
      { from: 'milestone_shaft', to: 'guardroom', x: 28, y: 8, w: 10, h: 10 },
      { from: 'guardroom', to: 'long_vault', x: 70, y: 10, w: 10, h: 10 },
      { from: 'long_vault', to: 'muniment_room', x: 92, y: 22, w: 10, h: 10 },
      { from: 'long_vault', to: 'strongroom_vault', x: 140, y: 8, w: 10, h: 10 },
    ] },
  ] },
};

/** a space's size class by its sides (PLAN_RULES) @param {{ w: number, h: number }} s */
export function sizeOf(s) {
  const lo = Math.min(s.w, s.h), hi = Math.max(s.w, s.h), R = PLAN_RULES;
  if (hi >= R.gallery[0] && lo <= 28) return 'gallery';            // a large corridor: long and narrow, counted as a space
  if (hi <= R.small[1]) return 'small';
  if (hi <= R.medium[1]) return 'medium';
  return 'large';
}

/**
 * The plan's rules, as the owner set them: the problems found, or none.
 * @param {Plan} p
 * @returns {string[]}
 */
export function checkPlan(p) {
  const R = PLAN_RULES, out = [];
  if (p.floors.length > R.maxFloors) out.push(`${p.site}: ${p.floors.length} floors (at most ${R.maxFloors})`);
  p.floors.forEach((f, fi) => {
    const at = `${p.site} floor ${fi + 1}`, byId = new Map(f.spaces.map((s) => [s.id, s]));
    if (f.spaces.length > R.maxSpaces) out.push(`${at}: ${f.spaces.length} spaces (at most ${R.maxSpaces})`);
    const roles = f.spaces.map((s) => s.role), last = fi === p.floors.length - 1;
    if (roles.filter((r) => r === 'entrance').length !== 1) out.push(`${at}: one entrance`);
    if (roles.filter((r) => r === (last ? 'end' : 'descent')).length !== 1) out.push(`${at}: one ${last ? 'end hall' : 'descent room'}`);
    for (const s of f.spaces) {
      const k = sizeOf(s), lo = Math.min(s.w, s.h), hi = Math.max(s.w, s.h);
      if (lo < R.small[0]) out.push(`${at} ${s.id}: ${lo} across, under a small room's ${R.small[0]}`);
      if (k === 'large' && hi > R.large[1]) out.push(`${at} ${s.id}: ${hi} long, over a large room's ${R.large[1]}`);
      if (k === 'gallery' && hi > R.gallery[1]) out.push(`${at} ${s.id}: ${hi} long, over a gallery's ${R.gallery[1]}`);
      if ((s.role === 'descent' || s.role === 'end') && k !== 'large') out.push(`${at} ${s.id}: a floor's last hall is large`);
      if (s.role === 'entrance' && k === 'small') out.push(`${at} ${s.id}: an entrance is never small`);
      if (!p.flat && (s.lv < fi || s.lv > fi + 1)) out.push(`${at} ${s.id}: level +${s.lv} outside the floor's +${fi}..+${fi + 1}`);
      for (const t of f.spaces) if (t !== s && s.x < t.x + t.w && t.x < s.x + s.w && s.y < t.y + t.h && t.y < s.y + s.h) out.push(`${at}: ${s.id} overlaps ${t.id}`);
    }
    // halls: hallMinW wide or more, 8–14 long, each joining its two spaces across a shared edge, overlapping no other
    // space. Wide and long are by the way it runs: a hall meeting its rooms at its east and west ends runs along x.
    const adj = new Map(f.spaces.map((s) => [s.id, /** @type {string[]} */ ([])]));
    for (const h of f.halls) {
      const a = byId.get(h.from), b = byId.get(h.to);
      if (!a || !b) { out.push(`${at}: a hall from ${h.from} to ${h.to}`); continue; }
      const alongX = h.x + h.w === a.x || a.x + a.w === h.x, across = alongX ? h.h : h.w, long = alongX ? h.w : h.h;
      if (across < R.hallMinW) out.push(`${at}: the hall ${h.from} → ${h.to} is ${across} wide (at least ${R.hallMinW})`);
      if (long > R.hallMaxLen) out.push(`${at}: the hall ${h.from} → ${h.to} is ${long} long (at most ${R.hallMaxLen})`);
      const touches = (s) => {
        const xs = h.x < s.x + s.w && s.x < h.x + h.w, ys = h.y < s.y + s.h && s.y < h.y + h.h;
        return (xs && (h.y + h.h === s.y || s.y + s.h === h.y) && h.x >= s.x && h.x + h.w <= s.x + s.w)
          || (ys && (h.x + h.w === s.x || s.x + s.w === h.x) && h.y >= s.y && h.y + h.h <= s.y + s.h);
      };
      if (!touches(a) || !touches(b)) out.push(`${at}: the hall ${h.from} → ${h.to} doesn't meet both along a wall`);
      for (const s of f.spaces) if (h.x < s.x + s.w && s.x < h.x + h.w && h.y < s.y + s.h && s.y < h.y + h.h) out.push(`${at}: the hall ${h.from} → ${h.to} runs into ${s.id}`);
      adj.get(a.id)?.push(b.id); adj.get(b.id)?.push(a.id);
    }
    // every space reached from the entrance; an offshoot a dead end; the way on runs entrance → rooms → the last hall
    const start = f.spaces.find((s) => s.role === 'entrance'), seen = new Set(start ? [start.id] : []), q = start ? [start.id] : [];
    while (q.length) for (const n of adj.get(/** @type {string} */ (q.shift())) || []) if (!seen.has(n)) { seen.add(n); q.push(n); }
    for (const s of f.spaces) if (!seen.has(s.id)) out.push(`${at}: ${s.id} can't be reached`);
    for (const s of f.spaces) if (s.role === 'offshoot' && (adj.get(s.id) || []).length !== 1) out.push(`${at}: the offshoot ${s.id} is a dead end off one room`);
  });
  return out;
}
