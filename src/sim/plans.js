// @ts-check
// plans.js — the Hollow Vale's dungeons as authored floor plans (docs/vale-dungeons-plan.md; the owner, 2026-11-02:
// "Each dungeon should still have a progression of rooms with higher level NPCs and maybe an offshoot. But no more than
// 5 rooms or large corridors total per floor. There can be hallways but perhaps at least 8 wide. No more than 2 levels
// down. Dressing and even layout should fit to the dungeon type").
//
// Built (2026-11-02, the owner: "Same layout every visit"; docs/level-design-rules.md §4.1): level.js generateLevel
// builds a Vale floor from its plan here (the same shape out as halls.js: cells, rooms, edges, spawn, entrance,
// descentRoom), and sites.js takes its floors, levels and bosses from it. The plans are drawn by
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
/** @typedef {{ site: string, name: string, kind: string, base: number, step?: number, flat?: boolean, floors: Floor[] }} Plan */

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

  // ── The Proving Pens (a trial, 4: GDD v1.60): the bestiary penned behind the old adit, a pen a kind, the bosses in the
  //    halls. Laid out as the Barrows' first floor and the Keep's second (their shapes are the rules' proven ones).
  proving_pens: { site: 'proving_pens', name: 'The Proving Pens', kind: 'pen', base: 4, flat: true, floors: [
    { name: 'The Upper Pens', spaces: [
      { id: 'adit_mouth', name: 'The Adit Mouth', role: 'entrance', x: 0, y: 0, w: 32, h: 28, shape: 'cave', lv: 0, kit: 'dig',
        dress: ['spoil', 'lanterns', 'crates'], note: 'The old lead level behind the boards: rusted rails, the spoil grassed over at the door, lanterns hung for whoever comes to look.' },
      { id: 'beetle_pen', name: 'The Beetle Pen', role: 'room', x: 42, y: 0, w: 36, h: 30, shape: 'cave', lv: 0, kit: 'dig', foes: 'beetles',
        dress: ['timbers', 'spoil', 'lanterns'], note: 'The red fire beetles, alone: a dug pen, its timbers scorched.' },
      { id: 'goblin_pen', name: 'The Goblin Pen', role: 'room', x: 36, y: 40, w: 56, h: 52, shape: 'rect', lv: 0, kit: 'bailey', foes: 'gobs',
        dress: ['crates', 'cookfires', 'banners'], note: 'The goblins, alone: a big square pen, their crates and their fires.' },
      { id: 'wraith_pen', name: 'The Wraith Pen', role: 'offshoot', x: 80, y: 8, w: 24, h: 22, shape: 'rect', lv: 0, kit: 'gallery', foes: 'wraiths',
        dress: ['niches', 'candles', 'chest'], note: 'The graveyard wraiths, alone: a cut crypt, candles in its niches.' },
      { id: 'rat_kings_hall', name: 'The Rat King\'s Hall', role: 'descent', x: 46, y: 102, w: 48, h: 42, shape: 'rect', lv: 0, kit: 'cellar', foes: 'vermin', boss: 'rat_king',
        dress: ['casks', 'scaffold', 'stair_down'], note: 'The Rat King and his swarm, casks gnawed through, the way down at the back.' },
    ], halls: [
      { from: 'adit_mouth', to: 'beetle_pen', x: 32, y: 10, w: 10, h: 10, rough: true },
      { from: 'beetle_pen', to: 'goblin_pen', x: 56, y: 30, w: 10, h: 10, rough: true },
      { from: 'goblin_pen', to: 'wraith_pen', x: 82, y: 30, w: 10, h: 10 },
      { from: 'goblin_pen', to: 'rat_kings_hall', x: 62, y: 92, w: 10, h: 10 },
    ] },
    { name: 'The Lower Pens', spaces: [
      { id: 'pens_stair', name: 'The Pens\' Stair', role: 'entrance', x: 0, y: 0, w: 28, h: 26, shape: 'rect', lv: 0, kit: 'barracks',
        dress: ['casks', 'lanterns', 'stair_up'], note: 'The foot of the stair down from the Rat King\'s Hall.' },
      { id: 'mixed_pen', name: 'The Mixed Pen', role: 'room', x: 38, y: 0, w: 68, h: 22, shape: 'rect', lv: 0, kit: 'barracks', foes: 'bestiary',
        dress: ['racks', 'banners', 'braziers'], note: 'A large corridor: all four new together, the goblins and the golems up front, the beetles spitting behind, a wraith leading.' },
      { id: 'vermin_pen', name: 'The Vermin Pen', role: 'offshoot', x: 44, y: 32, w: 24, h: 22, shape: 'rect', lv: 0, kit: 'cellar', foes: 'vermin',
        dress: ['casks', 'chest'], note: 'The grave rats, the spiders and the spinners together, Old Gutter leading.' },
      { id: 'golem_pen', name: 'The Golem Pen', role: 'room', x: 116, y: 0, w: 36, h: 34, shape: 'rect', lv: 0, kit: 'cellar', foes: 'golems',
        dress: ['scaffold', 'broken_floor', 'ladders'], note: 'The stone golems, alone: the floor cracked under them.' },
      { id: 'spider_queens_hall', name: 'The Spider Queen\'s Hall', role: 'end', x: 104, y: 46, w: 58, h: 48, shape: 'cave', lv: 0, kit: 'cellar', foes: 'cellar', boss: 'spider_queen',
        dress: ['pools', 'stalagmites', 'drips'], note: 'The Spider Queen and her brood, in the cave at the bottom.' },
    ], halls: [
      { from: 'pens_stair', to: 'mixed_pen', x: 28, y: 8, w: 10, h: 10 },
      { from: 'mixed_pen', to: 'vermin_pen', x: 52, y: 22, w: 10, h: 10 },
      { from: 'mixed_pen', to: 'golem_pen', x: 106, y: 6, w: 10, h: 10 },
      { from: 'golem_pen', to: 'spider_queens_hall', x: 126, y: 34, w: 10, h: 12, rough: true },
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

  // ── The Greywater Fens (v1.102; the owner, 2026-11-14: "Raid dungeon no more than 2 floors like our overall dungeon
  //    rules", then "go ahead with recommendations": docs/fens-dungeons-audit.md §4). Brought onto the Vale's rules: two
  //    floors, five spaces a floor, halls 10, the same rooms every visit; their own shapes, not the Vale's.

  // ── Toadking's Mound (10–12): an island of boats in the reeds. The toad-men's landing and their mud below the reed
  //    beds; then the stilt-built boat houses over the water, the Toadking in his Boat Hall with Wren his prisoner.
  // the Cinder Reach's first band (GDD v1.124, world doc v1.53, docs/reach-plan.md): the Deepdelvers' old pithead, then
  // the warren the Scrag Warren's goblins dug on through the range into it; the Foreman in the tally cave, Tamsin held there
  cold_seam: { site: 'cold_seam', name: 'The Cold Seam', kind: 'seam', base: 19, step: 2, floors: [
    { name: 'The Old Pithead', spaces: [
      { id: 'the_shaft_head', name: 'The Shaft Head', role: 'entrance', x: 0, y: 0, w: 32, h: 28, shape: 'rect', lv: 0, kit: 'pithead',
        dress: ['timbers', 'rails', 'lanterns', 'crates'], note: 'The cage landing at the foot of the shaft, the cage itself long gone; the shaft\'s ladder up to the day is the way out. Timbered, dry, cold.' },
      { id: 'the_lamp_room', name: 'The Lamp Room', role: 'room', x: 42, y: 0, w: 38, h: 30, shape: 'rect', lv: 0, kit: 'pithead', foes: 'pithead',
        dress: ['racks', 'lanterns', 'barrels'], note: 'Where the shift took its lamps and left its tallies: the racks still hang with them, two hundred lamps, none lit. Old Brannagh kept this room.' },
      { id: 'the_pay_office', name: 'The Pay Office', role: 'offshoot', x: 90, y: 4, w: 24, h: 22, shape: 'rect', lv: 1, kit: 'pithead', foes: 'pithead',
        dress: ['bars', 'pay_chests', 'ledger', 'chests'], note: 'The Seam\'s last wages behind the grille, in their strongboxes, never paid out: the Seam closed on a Friday.' },
      { id: 'the_long_gallery', name: 'The Long Gallery', role: 'room', x: 28, y: 40, w: 60, h: 40, shape: 'cave', lv: 0, kit: 'pithead', foes: 'pithead',
        dress: ['rails', 'timbers', 'carts', 'rubble', 'drips'], note: 'The main gallery, timbered every few paces, the rails for the carts down its middle; a stretch of roof came in years ago and the way goes round it.' },
      { id: 'the_winding_room', name: 'The Winding Room', role: 'descent', x: 34, y: 90, w: 50, h: 44, shape: 'rect', lv: 1, kit: 'pithead', foes: 'pithead',
        dress: ['windlasses', 'timbers', 'lanterns', 'stair_down'], note: 'The winding gear for the deep shaft, its great wheel overhead; the goblins\' ladder goes down the old shaft beside it.' },
    ], halls: [
      { from: 'the_shaft_head', to: 'the_lamp_room', x: 32, y: 9, w: 10, h: 10 },
      { from: 'the_lamp_room', to: 'the_pay_office', x: 80, y: 10, w: 10, h: 10 },
      { from: 'the_lamp_room', to: 'the_long_gallery', x: 52, y: 30, w: 10, h: 10 },
      { from: 'the_long_gallery', to: 'the_winding_room', x: 54, y: 80, w: 10, h: 10, rough: true },
    ] },
    { name: 'The Warren', spaces: [
      { id: 'the_breakthrough', name: 'The Breakthrough', role: 'entrance', x: 0, y: 0, w: 30, h: 26, shape: 'cave', lv: 2, kit: 'warren',
        dress: ['rubble', 'robbed_shoring', 'lanterns', 'stair_up'], note: 'Where the goblins broke through out of the range into the cut stone: raw rock one side, the Deepdelvers\' dressed wall the other.' },
      { id: 'the_burrow_hall', name: 'The Burrow Hall', role: 'room', x: 40, y: 2, w: 70, h: 22, shape: 'cave', lv: 2, kit: 'warren', foes: 'warren',
        dress: ['bedrolls', 'cookfires', 'robbed_shoring', 'sacks'], note: 'A long burrow the goblins sleep in, in shifts: the bedrolls are never cold.' },
      { id: 'the_larder', name: 'The Larder', role: 'offshoot', x: 50, y: 34, w: 26, h: 22, shape: 'cave', lv: 3, kit: 'warren', foes: 'warren',
        dress: ['barrels', 'bones', 'chest', 'shrine'], note: 'What the warren eats, hung and stacked; better not to look at the bottom of the pile.' },
      { id: 'the_spoil_cut', name: 'The Spoil Cut', role: 'room', x: 120, y: 0, w: 36, h: 34, shape: 'cave', lv: 3, kit: 'warren', foes: 'warren',
        dress: ['tipped_cart', 'carts', 'rubble', 'lanterns'], note: 'Where the goblins tip what they dig, by the cartload: the old carts, stolen off the Seam\'s rails, and a heap to the roof.' },
      { id: 'the_tally_cave', name: 'The Tally Cave', role: 'end', x: 106, y: 44, w: 58, h: 50, shape: 'cave', lv: 3, kit: 'warren', foes: 'warren', boss: 'foreman',
        dress: ['scaffold', 'ladders', 'robbed_shoring', 'braziers', 'drips'], note: 'The Foreman\'s cave: the old chutes come down through its roof from the gallery above, and he has chalked his crosses on the floor under them. His tally covers the walls. Tamsin Coalbrook at the goblins\' anvil, on a chain.' },
    ], halls: [
      { from: 'the_breakthrough', to: 'the_burrow_hall', x: 30, y: 8, w: 10, h: 10, rough: true },
      { from: 'the_burrow_hall', to: 'the_larder', x: 56, y: 24, w: 10, h: 10, rough: true },
      { from: 'the_burrow_hall', to: 'the_spoil_cut', x: 110, y: 8, w: 10, h: 10, rough: true },
      { from: 'the_spoil_cut', to: 'the_tally_cave', x: 132, y: 34, w: 10, h: 10, rough: true },
    ] },
  ] },
  // the Cinder Reach's other bands (GDD v1.126, the build sheet in docs/reach-plan.md): the Cold Seam's two floor shapes, held to the
  // rules, each room its own place
  assay_yards: { site: 'assay_yards', name: 'The Assay Yards', kind: 'yards', base: 23, step: 2, floors: [
    { name: 'The Yards and the Counting House', spaces: [
      { id: 'the_yard_gate', name: 'The Yard Gate', role: 'entrance', x: 0, y: 0, w: 32, h: 28, shape: 'rect', lv: 0, kit: 'yards',
        dress: ['crates', 'lanterns', 'banners'], note: 'The Assay\'s gate in its fence, the scale-and-pick painted over it; Nan Ruddock\'s men lounge on the inside of it, paid by the week.' },
      { id: 'the_weigh_house', name: 'The Weigh-House', role: 'room', x: 42, y: 0, w: 38, h: 30, shape: 'rect', lv: 0, kit: 'yards', foes: 'yards',
        dress: ['racks', 'barrels', 'lanterns'], note: 'Where the carts are weighed in: the great beam scale, its chains, the slag tipped beside it by the ton.' },
      { id: 'the_guard_room', name: 'The Guard Room', role: 'offshoot', x: 90, y: 4, w: 24, h: 22, shape: 'rect', lv: 1, kit: 'yards', foes: 'yards',
        dress: ['benches', 'racks', 'chest', 'shrine'], note: 'The Redhand\'s room: their kit on the racks, their dice on the bench, and a chest nobody has counted.' },
      { id: 'the_ore_sheds', name: 'The Ore Sheds', role: 'room', x: 28, y: 40, w: 60, h: 40, shape: 'rect', lv: 0, kit: 'yards', foes: 'yards',
        dress: ['carts', 'crates', 'sacks'], note: 'Long sheds open to the yard, the ore in heaps under them by grade, the carts left where they stopped.' },
      { id: 'the_counting_house', name: 'The Counting House', role: 'descent', x: 34, y: 90, w: 50, h: 44, shape: 'rect', lv: 1, kit: 'yards', foes: 'yards',
        dress: ['desks', 'ledger', 'chest', 'stair_down'], note: 'The Assay\'s clerks\' hall, desks in rows under high windows; the stair down to the cellars is behind the cashier\'s grille.' },
    ], halls: [
      { from: 'the_yard_gate', to: 'the_weigh_house', x: 32, y: 9, w: 10, h: 10 },
      { from: 'the_weigh_house', to: 'the_guard_room', x: 80, y: 10, w: 10, h: 10 },
      { from: 'the_weigh_house', to: 'the_ore_sheds', x: 52, y: 30, w: 10, h: 10 },
      { from: 'the_ore_sheds', to: 'the_counting_house', x: 54, y: 80, w: 10, h: 10, rough: true },
    ] },
    { name: 'The Cellars and the Quota Office', spaces: [
      { id: 'the_cellar_stair', name: 'The Cellar Stair', role: 'entrance', x: 0, y: 0, w: 30, h: 26, shape: 'cave', lv: 2, kit: 'quota',
        dress: ['lanterns', 'barrels', 'stair_up'], note: 'The foot of the counting house stair, where the cellars begin: cool, dry, swept.' },
      { id: 'the_cage_store', name: 'The Cage Store', role: 'room', x: 40, y: 2, w: 70, h: 22, shape: 'cave', lv: 2, kit: 'quota', foes: 'quota',
        dress: ['bars', 'chains', 'lanterns'], note: 'The night shift\'s chains on the walls, a hook for each, and a number chalked over each hook.' },
      { id: 'the_ledger_room', name: 'The Ledger Room', role: 'offshoot', x: 50, y: 34, w: 26, h: 22, shape: 'cave', lv: 3, kit: 'quota', foes: 'quota',
        dress: ['rolls', 'desks', 'desk_rows', 'chest', 'shrine'], note: 'The rolls of the night shift, by name and weight: the company\'s proof, if anyone will read it.' },
      { id: 'the_assay_furnace', name: 'The Assay Furnace', role: 'room', x: 120, y: 0, w: 36, h: 34, shape: 'cave', lv: 3, kit: 'quota', foes: 'quota',
        dress: ['braziers', 'carts', 'crates'], note: 'Where the ore is tried: a small furnace kept hot, crucibles in rows, the slag of every sample swept into a heap.' },
      { id: 'the_quota_office', name: 'The Quota Office', role: 'end', x: 106, y: 44, w: 58, h: 50, shape: 'cave', lv: 3, kit: 'quota', foes: 'quota', boss: 'weighmaster',
        dress: ['desks', 'ledger', 'desk_rows', 'strongbox', 'braziers', 'banners'], note: 'The Weighmaster\'s office: his brass scale on its stand, the week\'s quota chalked on a board, and a column headed QUOTA in every book.' },
    ], halls: [
      { from: 'the_cellar_stair', to: 'the_cage_store', x: 30, y: 8, w: 10, h: 10, rough: true },
      { from: 'the_cage_store', to: 'the_ledger_room', x: 56, y: 24, w: 10, h: 10, rough: true },
      { from: 'the_cage_store', to: 'the_assay_furnace', x: 110, y: 8, w: 10, h: 10, rough: true },
      { from: 'the_assay_furnace', to: 'the_quota_office', x: 132, y: 34, w: 10, h: 10, rough: true },
    ] },
  ] },
  // (v1.144, the owner: "Make the reach as 3 dungeons") the Cinderworks, 27–30, the Forgehall of Oruth its first floor: the
  // Assay walled the forge-hall's great doors on the Ashwater and drove a cut down into it from the works, so the way in is
  // the works gate and the old forge-hall lies under it, Oruth at his forge in its hall; the stair behind his anvil goes
  // down to the furnace hall, Morrow Vane's (a room's own boss), and the Magma Vault and Furnace Nine below
  cinderworks: { site: 'cinderworks', name: 'The Cinderworks', kind: 'works', base: 27, step: 2, floors: [
    { name: 'The Works and the Forgehall', spaces: [
      { id: 'the_works_gate', name: 'The Works Gate', role: 'entrance', x: 0, y: 0, w: 32, h: 28, shape: 'rect', lv: 0, kit: 'works',
        dress: ['crates', 'lanterns', 'banners'], note: 'The Cinderworks\' gate on its track among the slag heaps, the Assay\'s men on it in shifts; the cut down to the old forge-hall opens behind the gatehouse.' },
      { id: 'the_anvil_hall', name: 'The Anvil Hall', role: 'room', x: 42, y: 0, w: 38, h: 30, shape: 'rect', lv: 0, kit: 'forge', foes: 'forge',
        dress: ['racks', 'scaffold', 'braziers'], note: 'The forge-hall\'s anvils in rows, a hundred of them, cold three centuries; some of them are warm.' },
      { id: 'the_pattern_store', name: 'The Pattern Store', role: 'offshoot', x: 90, y: 4, w: 24, h: 22, shape: 'rect', lv: 1, kit: 'forge', foes: 'forge',
        dress: ['rolls', 'racks', 'chests', 'shrine'], note: 'The empire\'s patterns for every blade it ever ordered, in wax and wood on the shelves.' },
      { id: 'the_night_pens', name: 'The Night Pens', role: 'room', x: 28, y: 40, w: 60, h: 40, shape: 'rect', lv: 0, kit: 'works', foes: 'works',
        dress: ['cage', 'bars', 'chains'], note: 'Where the night shift is held between shifts, in the forge-hall\'s old quench troughs drained dry. The doors are on the outside.' },
      { id: 'oruths_forge', name: 'Oruth\'s Forge', role: 'descent', x: 34, y: 90, w: 50, h: 44, shape: 'rect', lv: 1, kit: 'deepforge', foes: 'deepforge', boss: 'oruth',
        dress: ['braziers', 'scaffold', 'racks', 'stair_down'], note: 'The Forgemaster\'s forge and his anvil, and Oruth at it, working as ordered; the stair down to the furnace hall behind it.' },
    ], halls: [
      { from: 'the_works_gate', to: 'the_anvil_hall', x: 32, y: 9, w: 10, h: 10 },
      { from: 'the_anvil_hall', to: 'the_pattern_store', x: 80, y: 10, w: 10, h: 10 },
      { from: 'the_anvil_hall', to: 'the_night_pens', x: 52, y: 30, w: 10, h: 10 },
      { from: 'the_night_pens', to: 'oruths_forge', x: 54, y: 80, w: 10, h: 10, rough: true },
    ] },
    { name: 'The Furnace Hall and the Magma Vault', spaces: [
      { id: 'the_stair_into_the_heat', name: 'The Stair into the Heat', role: 'entrance', x: 0, y: 0, w: 30, h: 26, shape: 'cave', lv: 2, kit: 'vault',
        dress: ['magma_channel', 'braziers', 'rubble', 'stair_up'], note: 'The stair down from Oruth\'s forge, the air getting thicker with every step, the first of the magma running in its channel below it.' },
      { id: 'the_furnace_hall', name: 'The Furnace Hall', role: 'room', x: 40, y: 2, w: 70, h: 22, shape: 'rect', lv: 2, kit: 'works', foes: 'works', boss: 'morrow_vane',
        dress: ['furnaces', 'anvils', 'braziers', 'carts', 'banners'], note: 'The works\' furnace hall, Morrow Vane\'s office at its back and the door he bolts behind him.' },
      { id: 'the_priests_cells', name: 'The Priests\' Cells', role: 'offshoot', x: 50, y: 34, w: 26, h: 22, shape: 'cave', lv: 3, kit: 'vault', foes: 'vault',
        dress: ['candles', 'chains', 'chest', 'shrine'], note: 'The furnace-priests\' cells, a cot and a censer in each.' },
      { id: 'the_casting_floor', name: 'The Casting Floor', role: 'room', x: 120, y: 0, w: 36, h: 34, shape: 'cave', lv: 3, kit: 'vault', foes: 'vault',
        dress: ['magma_channel', 'furnaces', 'anvils', 'scaffold', 'chains'], note: 'The vessel\'s mould on the casting floor, empty: it has gone. The magma comes in along the back wall to the furnaces that poured it.' },
      { id: 'furnace_nine', name: 'Furnace Nine', role: 'end', x: 106, y: 44, w: 58, h: 50, shape: 'cave', lv: 3, kit: 'vault', foes: 'vault', boss: 'stoker',
        dress: ['magma_channel', 'magma_pool', 'furnaces', 'anvils', 'chains'], note: 'Furnace Nine, a furnace-lamp hot enough to melt pale iron, and its Stoker. The night shift\'s souls are in it. The magma feeding it runs along the back wall and pools in the corner.' },
    ], halls: [
      { from: 'the_stair_into_the_heat', to: 'the_furnace_hall', x: 30, y: 8, w: 10, h: 10, rough: true },
      { from: 'the_furnace_hall', to: 'the_priests_cells', x: 56, y: 24, w: 10, h: 10, rough: true },
      { from: 'the_furnace_hall', to: 'the_casting_floor', x: 110, y: 8, w: 10, h: 10, rough: true },
      { from: 'the_casting_floor', to: 'furnace_nine', x: 132, y: 34, w: 10, h: 10, rough: true },
    ] },
  ] },
  // ── the Sister's Cabin (45; the Tidemark's secret, GDD v1.156, docs/tidemark-plan.md step 7): the wreck of Aurelle's
  //    Grace on her reef, one floor on the hulk kit, her drowned crew aboard at 45; the chapel locker the reliquary's, empty;
  //    the vault Livia's cabin at the stern (no boss: a secret's end room is its vault, as the Ninth Vault's)
  sisters_cabin: { site: 'sisters_cabin', name: "The Sister's Cabin", kind: 'vault', base: 45, flat: true, floors: [
    { name: "Aurelle's Grace", spaces: [
      { id: 'the_reef_ladder', name: 'The Reef Ladder', role: 'entrance', x: 4, y: 130, w: 30, h: 24, shape: 'rect', lv: 0, kit: 'hulk',
        dress: ['dock_ropes', 'mole_lamps', 'stair_up'], note: 'Up the ladder from the reef at low water and in over her side, where the planks are gone.' },
      { id: 'the_waist', name: 'The Waist', role: 'room', x: 0, y: 66, w: 38, h: 54, shape: 'rect', lv: 0, kit: 'hulk', foes: 'drowned_fleet',
        dress: ['casks', 'anchors', 'mole_lamps'], note: 'The open deck amidships, her crew still at their stations, as they were the night she struck.' },
      { id: 'the_chapel_locker', name: 'The Chapel Locker', role: 'offshoot', x: 48, y: 80, w: 24, h: 22, shape: 'rect', lv: 0, kit: 'hulk', foes: 'drowned_fleet',
        dress: ['reliquary', 'mole_lamps', 'chest', 'shrine'], note: 'Aurelle\'s chapel aboard, small enough to kneel in. The reliquary where the box was kept is empty.' },
      { id: 'the_childrens_deck', name: "The Children's Deck", role: 'room', x: 2, y: 16, w: 34, h: 40, shape: 'rect', lv: 0, kit: 'hulk', foes: 'drowned_fleet',
        dress: ['bunks', 'casks', 'mole_lamps'], note: 'The deck below, rows of small hammocks slung low, the crew walking it as if on watch.' },
      { id: 'livias_cabin', name: "Livia's Cabin", role: 'end', x: 48, y: 0, w: 50, h: 44, shape: 'rect', lv: 0, kit: 'hulk', foes: 'drowned_fleet',
        dress: ['vault_chest', 'desks', 'rug', 'mole_lamps'], note: 'The stern cabin, the whole width of her, where Livia slept the one night aboard. The manifest is in her chest.' },
    ], halls: [
      { from: 'the_reef_ladder', to: 'the_waist', x: 14, y: 120, w: 10, h: 10 },
      { from: 'the_waist', to: 'the_chapel_locker', x: 38, y: 86, w: 10, h: 10 },
      { from: 'the_waist', to: 'the_childrens_deck', x: 12, y: 56, w: 10, h: 10 },
      { from: 'the_childrens_deck', to: 'livias_cabin', x: 36, y: 26, w: 12, h: 10 },
    ] },
  ] },
  ninth_vault: { site: 'ninth_vault', name: 'The Ninth Vault', kind: 'vault', base: 30, flat: true, floors: [
    { name: 'The Quota Office\'s Strongroom', spaces: [
      { id: 'the_vault_track', name: 'The Vault Track', role: 'entrance', x: 0, y: 0, w: 28, h: 24, shape: 'rect', lv: 0, kit: 'strongroom',
        dress: ['stair_up', 'lanterns'], note: 'The old track\'s end, cut into the volcano\'s flank: a door the quota office paid to have hung.' },
      { id: 'the_clerks_hall', name: 'The Clerks\' Hall', role: 'room', x: 38, y: 0, w: 32, h: 28, shape: 'rect', lv: 0, kit: 'strongroom', foes: 'ashbound',
        dress: ['desks', 'ledger', 'braziers'], note: 'The Ashbound clerks at their desks, still keeping the books.' },
      { id: 'the_long_shelves', name: 'The Long Shelves', role: 'room', x: 80, y: 4, w: 60, h: 18, shape: 'rect', lv: 0, kit: 'strongroom', foes: 'ashbound',
        dress: ['rolls', 'bars'], note: 'A large corridor of ledgers, every week of the quota for three hundred years.' },
      { id: 'the_tally_room', name: 'The Tally Room', role: 'offshoot', x: 86, y: 32, w: 22, h: 20, shape: 'rect', lv: 0, kit: 'strongroom', foes: 'ashbound',
        dress: ['desks', 'rolls', 'chest', 'shrine'], note: 'Where the weeks were added up, and a chest.' },
      { id: 'the_ninth_vault', name: 'The Ninth Vault', role: 'end', x: 150, y: 0, w: 44, h: 40, shape: 'rect', lv: 0, kit: 'strongroom', foes: 'ashbound',
        dress: ['vault_chest', 'pay_chests', 'braziers'], note: 'The strongroom: its chest, and in it the Quota Ledgers, every soul the furnaces were owed.' },
    ], halls: [
      { from: 'the_vault_track', to: 'the_clerks_hall', x: 28, y: 8, w: 10, h: 10 },
      { from: 'the_clerks_hall', to: 'the_long_shelves', x: 70, y: 10, w: 10, h: 10 },
      { from: 'the_long_shelves', to: 'the_tally_room', x: 92, y: 22, w: 10, h: 10 },
      { from: 'the_long_shelves', to: 'the_ninth_vault', x: 140, y: 8, w: 10, h: 10 },
    ] },
  ] },
  toadking_mound: { site: 'toadking_mound', name: "Toadking's Mound", kind: 'mound', base: 10, floors: [
    { name: 'The Landing and the Mudflats', spaces: [
      { id: 'the_landing', name: 'The Landing', role: 'entrance', x: 0, y: 0, w: 34, h: 28, shape: 'cave', lv: 0, kit: 'mound',
        dress: ['boats', 'reeds', 'lanterns', 'crates'], note: 'Where the punts come in under the mound: boats hauled up on the mud, reeds through the boards. The plank ramp up to the reeds is the way out.' },
      { id: 'the_reed_beds', name: 'The Reed Beds', role: 'room', x: 44, y: 0, w: 40, h: 32, shape: 'cave', lv: 0, kit: 'mound', foes: 'toadmen',
        dress: ['reeds', 'pools', 'lanterns'], note: 'The reeds growing in through the mound\'s side, cut back for the toad-men\'s paths; standing water between.' },
      { id: 'the_eel_store', name: 'The Eel Store', role: 'offshoot', x: 94, y: 4, w: 24, h: 22, shape: 'rect', lv: 1, kit: 'mound', foes: 'toadmen',
        dress: ['barrels', 'nets', 'chest', 'shrine'], note: 'The eel-men\'s smoke store, taken over: casks of salted eel, nets on the walls, a chest, and the Reed Tally (the Chronicle).' },
      { id: 'the_mudflats', name: 'The Mudflats', role: 'room', x: 30, y: 42, w: 58, h: 46, shape: 'cave', lv: 0, kit: 'mound', foes: 'toadmen',
        dress: ['pools', 'reeds', 'boats'], note: 'A wide floor of grey mud the mound\'s water seeps up through, a boat or two sunk in it: the toads\' ground.' },
      { id: 'the_toad_pens', name: 'The Toad Pens', role: 'descent', x: 40, y: 98, w: 50, h: 44, shape: 'rect', lv: 1, kit: 'mound', foes: 'toadmen',
        dress: ['pens', 'reeds', 'stair_down'], note: 'Wattle pens where the toad-men keep their beasts, the reeds trodden flat. The stair down to the boat houses is at the back.' },
    ], halls: [
      { from: 'the_landing', to: 'the_reed_beds', x: 34, y: 10, w: 10, h: 10, rough: true },
      { from: 'the_reed_beds', to: 'the_eel_store', x: 84, y: 10, w: 10, h: 10 },
      { from: 'the_reed_beds', to: 'the_mudflats', x: 56, y: 32, w: 10, h: 10, rough: true },
      { from: 'the_mudflats', to: 'the_toad_pens', x: 58, y: 88, w: 10, h: 10, rough: true },
    ] },
    { name: 'The Boat Houses and the Boat Hall', spaces: [
      { id: 'the_stilt_stair', name: 'The Stilt Stair', role: 'entrance', x: 0, y: 0, w: 30, h: 26, shape: 'rect', lv: 1, kit: 'mound',
        dress: ['lanterns', 'barrels', 'stair_up'], note: 'The foot of the ladder-stair, on piles over the black water.' },
      { id: 'the_net_walk', name: 'The Net Walk', role: 'room', x: 40, y: 2, w: 70, h: 22, shape: 'rect', lv: 1, kit: 'mound', foes: 'boathall',
        dress: ['nets', 'boats', 'lanterns'], note: 'A large corridor: the boardwalk between the boat houses, nets drying on the rails, boats slung overhead.' },
      { id: 'the_burying_ground', name: 'The Old Burying-Ground', role: 'offshoot', x: 50, y: 34, w: 26, h: 22, shape: 'cave', lv: 2, kit: 'mound', foes: 'boathall',
        dress: ['bones', 'candles', 'chest', 'shrine'], note: 'The island\'s burying-ground from before the Toadking, the mound raised over it: old bones in the mud, the eel-men\'s candles still left. Kept a vigil over.' },
      { id: 'the_slipway', name: 'The Slipway', role: 'room', x: 120, y: 0, w: 36, h: 34, shape: 'rect', lv: 2, kit: 'mound', foes: 'boathall',
        dress: ['boats', 'windlasses', 'barrels'], note: 'Where the boats are drawn up: a windlass at the head of the slip, a boat half up it, the gulpers wallowing at its foot.' },
      { id: 'the_boat_hall', name: 'The Boat Hall', role: 'end', x: 106, y: 44, w: 58, h: 50, shape: 'rect', lv: 2, kit: 'mound', foes: 'boathall', boss: 'toadking',
        dress: ['boats', 'pools', 'reeds', 'braziers'], note: 'The Toadking\'s hall, roofed with upturned hulls, the tithe plate nailed over his seat. Wren tied to a mooring post.' },
    ], halls: [
      { from: 'the_stilt_stair', to: 'the_net_walk', x: 30, y: 8, w: 10, h: 10 },
      { from: 'the_net_walk', to: 'the_burying_ground', x: 56, y: 24, w: 10, h: 10 },
      { from: 'the_net_walk', to: 'the_slipway', x: 110, y: 8, w: 10, h: 10 },
      { from: 'the_slipway', to: 'the_boat_hall', x: 132, y: 34, w: 10, h: 10 },
    ] },
  ] },

  // ── The Canal Locks (13–15): built lock halls, then the vats. The lock gate, the long lock chamber and its basin, the
  //    Sluice at the end; below, the Cult's Vat Seven, where the harvesters fill their cages.
  canal_locks: { site: 'canal_locks', name: 'The Canal Locks', kind: 'locks', base: 13, floors: [
    { name: 'The Lock Chamber and the Sluice', spaces: [
      { id: 'the_lock_gate', name: 'The Lock Gate', role: 'entrance', x: 0, y: 36, w: 30, h: 24, shape: 'rect', lv: 0, kit: 'locks',
        dress: ['windlasses', 'chains', 'lanterns'], note: 'The upper gate, its beams black with the canal: the winding gear, the chains. The Kindler waits here. The gate\'s stair is the way out.' },
      { id: 'the_lock_chamber', name: 'The Lock Chamber', role: 'room', x: 40, y: 34, w: 72, h: 26, shape: 'rect', lv: 0, kit: 'locks', foes: 'ashbound',
        dress: ['colonnade', 'chains', 'pools'], note: 'A large corridor: the drained lock itself, its walls weeded to the old waterline, the lock-men who drowned in it standing up again.' },
      { id: 'the_tally_house', name: 'The Tally House', role: 'offshoot', x: 60, y: 4, w: 24, h: 20, shape: 'rect', lv: 1, kit: 'locks', foes: 'lockcult',
        dress: ['desks', 'rolls', 'chest', 'shrine'], note: 'Where the lock-keeper counted the boats through: his tallies on the shelves, a chest, a shrine with the canal\'s order.' },
      { id: 'the_basin', name: 'The Basin', role: 'room', x: 122, y: 30, w: 38, h: 36, shape: 'rect', lv: 0, kit: 'locks', foes: 'lockcult',
        dress: ['pools', 'barrels', 'chains'], note: 'The turning basin below the lock, half drained: barrels the Cult rolled down, the water in pools.' },
      { id: 'the_sluice', name: 'The Sluice', role: 'descent', x: 112, y: 76, w: 56, h: 44, shape: 'rect', lv: 1, kit: 'locks', foes: 'lockcult',
        dress: ['windlasses', 'pools', 'braziers', 'stair_down'], note: 'The sluice-house over the outfall: its paddle gear, the Sluice Book on its stand, and the stair down to the vats.' },
    ], halls: [
      { from: 'the_lock_gate', to: 'the_lock_chamber', x: 30, y: 42, w: 10, h: 10 },
      { from: 'the_lock_chamber', to: 'the_tally_house', x: 66, y: 24, w: 10, h: 10 },
      { from: 'the_lock_chamber', to: 'the_basin', x: 112, y: 40, w: 10, h: 10 },
      { from: 'the_basin', to: 'the_sluice', x: 136, y: 66, w: 10, h: 10 },
    ] },
    { name: 'Vat Seven', spaces: [
      { id: 'the_vat_stair', name: 'The Vat Stair', role: 'entrance', x: 0, y: 0, w: 30, h: 28, shape: 'rect', lv: 1, kit: 'vats',
        dress: ['barrels', 'lanterns', 'stair_up'], note: 'The stair\'s foot, the air already sour: barrels stacked by the wall.' },
      { id: 'the_vat_row', name: 'The Vat Row', role: 'room', x: 0, y: 38, w: 76, h: 22, shape: 'rect', lv: 1, kit: 'vats', foes: 'harvest',
        dress: ['vats', 'chains', 'candles'], note: 'A large corridor of the Cult\'s tubs, six down the wall, the seventh beyond: what they render there.' },
      { id: 'the_drain_office', name: 'The Drain Office', role: 'offshoot', x: 18, y: 70, w: 24, h: 20, shape: 'rect', lv: 2, kit: 'vats', foes: 'harvest',
        dress: ['desks', 'ledgers', 'chest', 'shrine'], note: 'The drain-master\'s office the Cult kept its books in: the vat ledger in a chest, the drain order at the shrine.' },
      { id: 'the_cage_store', name: 'The Cage Store', role: 'room', x: 86, y: 30, w: 34, h: 32, shape: 'rect', lv: 2, kit: 'vats', foes: 'harvest',
        dress: ['gibbets', 'chains', 'barrels'], note: 'The harvesters\' store of empty lantern-cages, hung from the beams, waiting to be filled.' },
      { id: 'vat_seven', name: 'Vat Seven', role: 'end', x: 80, y: 72, w: 60, h: 46, shape: 'rect', lv: 2, kit: 'vats', foes: 'harvest', boss: 'vatwarden',
        dress: ['vats', 'pools', 'braziers', 'chest'], note: 'The seventh vat, the great one, poison standing round it: the Vatwarden keeps it.' },
    ], halls: [
      { from: 'the_vat_stair', to: 'the_vat_row', x: 10, y: 28, w: 10, h: 10 },
      { from: 'the_vat_row', to: 'the_drain_office', x: 24, y: 60, w: 10, h: 10 },
      { from: 'the_vat_row', to: 'the_cage_store', x: 76, y: 44, w: 10, h: 10 },
      { from: 'the_cage_store', to: 'vat_seven', x: 96, y: 62, w: 10, h: 10 },
    ] },
  ] },

  // ── The Drowned Abbey (16–18): an abbey under the flood. The cloister walk, Brother Teague in his cell off it, the
  //    garth and the choir where the Drowned Choir sings; below, the night stair, the dorter and the chapter-house, round,
  //    where the Abbess Below rings her bells.
  drowned_abbey: { site: 'drowned_abbey', name: 'The Drowned Abbey', kind: 'abbey', base: 16, floors: [
    { name: 'The Cloister and the Choir', spaces: [
      { id: 'the_west_door', name: 'The West Door', role: 'entrance', x: 0, y: 0, w: 30, h: 26, shape: 'rect', lv: 0, kit: 'abbey',
        dress: ['doors', 'candles', 'saints'], note: 'The abbey\'s west door, the flood\'s line on it at head height. Its steps up are the way out.' },
      { id: 'the_cloister_walk', name: 'The Cloister Walk', role: 'room', x: 40, y: 2, w: 72, h: 20, shape: 'rect', lv: 0, kit: 'abbey', foes: 'drowned',
        dress: ['colonnade', 'pools', 'saints'], note: 'A large corridor: the cloister\'s north walk, its arcade open on the drowned garth, water over the flags.' },
      { id: 'teagues_cell', name: 'Brother Teague\'s Cell', role: 'offshoot', x: 44, y: 32, w: 24, h: 22, shape: 'rect', lv: 1, kit: 'abbey', foes: 'drowned', boss: 'teague',
        dress: ['candles', 'chest', 'shrine'], note: 'A monk\'s cell off the walk, kept dry: Teague\'s lantern-cage and his bed. He waits at its door.' },
      { id: 'the_garth', name: 'The Garth', role: 'room', x: 122, y: 0, w: 36, h: 36, shape: 'rect', lv: 0, kit: 'abbey', foes: 'drowned',
        dress: ['pools', 'font', 'saints'], note: 'The cloister\'s square garden, a pond now: the lavabo standing in it, the saints fallen in.' },
      { id: 'the_choir', name: 'The Choir', role: 'descent', x: 108, y: 48, w: 56, h: 48, shape: 'rect', lv: 1, kit: 'abbey', foes: 'drowned', boss: 'drowned_choir',
        dress: ['pews', 'pools', 'candles', 'chest', 'stair_down'], note: 'The monks\' stalls in two rows, the water to their seats. The Drowned Choir sings over the night stair, down which the rolls came up.' },
    ], halls: [
      { from: 'the_west_door', to: 'the_cloister_walk', x: 30, y: 8, w: 10, h: 10 },
      { from: 'the_cloister_walk', to: 'teagues_cell', x: 50, y: 22, w: 10, h: 10 },
      { from: 'the_cloister_walk', to: 'the_garth', x: 112, y: 6, w: 10, h: 10 },
      { from: 'the_garth', to: 'the_choir', x: 134, y: 36, w: 10, h: 12 },
    ] },
    { name: 'The Dorter and the Chapter-House', spaces: [
      { id: 'the_night_stair', name: 'The Night Stair', role: 'entrance', x: 0, y: 40, w: 28, h: 26, shape: 'rect', lv: 1, kit: 'abbey',
        dress: ['candles', 'stair_up'], note: 'The monks\' stair down from the choir to their beds, worn hollow.' },
      { id: 'the_dorter', name: 'The Dorter', role: 'room', x: 38, y: 42, w: 64, h: 22, shape: 'rect', lv: 1, kit: 'abbey', foes: 'drowned',
        dress: ['bunks', 'pools', 'candles'], note: 'A large corridor: the monks\' dormitory, their cots in two rows, the flood come in over them.' },
      { id: 'the_scriptorium', name: 'The Scriptorium', role: 'offshoot', x: 56, y: 10, w: 24, h: 22, shape: 'rect', lv: 2, kit: 'abbey', foes: 'drowned',
        dress: ['desks', 'rolls', 'chest', 'shrine'], note: 'The copying room, up a step from the water: desks, the day book, a chest.' },
      { id: 'the_lay_crypt', name: 'The Lay Crypt', role: 'room', x: 112, y: 36, w: 34, h: 34, shape: 'rect', lv: 2, kit: 'abbey', foes: 'drowned',
        dress: ['sarcophagi', 'candles', 'pools'], note: 'The lay brothers\' crypt, its tombs awash.' },
      { id: 'the_chapter_house', name: 'The Chapter-House', role: 'end', x: 104, y: 80, w: 50, h: 50, shape: 'round', lv: 2, kit: 'abbey', foes: 'drowned', boss: 'abbess_below',
        dress: ['ring_of_pillars', 'pools', 'braziers'], note: 'Round, its vault on a ring of pillars, the water black: the Abbess Below in the abbess\'s seat, her bells.' },
    ], halls: [
      { from: 'the_night_stair', to: 'the_dorter', x: 28, y: 48, w: 10, h: 10 },
      { from: 'the_dorter', to: 'the_scriptorium', x: 62, y: 32, w: 10, h: 10 },
      { from: 'the_dorter', to: 'the_lay_crypt', x: 102, y: 46, w: 10, h: 10 },
      { from: 'the_lay_crypt', to: 'the_chapter_house', x: 124, y: 70, w: 10, h: 10 },
    ] },
  ] },

  // ── The Shuttered Inn (a prototype: the tavern kit, docs/tavern-dungeon.md; the owner, 2026-11-22, from a reference):
  //    a roadside inn the Redhand took and boarded up, a dungeon inside a building. Its walls stand to their full height
  //    (the near ones cut away, so the camera looks in), and its rooms are dressed at their edges, the middle of each left
  //    open for the fight: the common room's hearth and notice board on its back wall, its long tables along the sides.
  shuttered_inn: { site: 'shuttered_inn', name: 'The Shuttered Inn', kind: 'inn', base: 23,   // (v1.145: 23, the Yards' band, its Redhand off the Yards' gates and Hob's price in Paid by Weight; it was 20)
    flat: true, floors: [
    { name: 'The Inn', spaces: [
      { id: 'the_front_room', name: 'The Front Room', role: 'entrance', x: 0, y: 38, w: 32, h: 30, shape: 'rect', lv: 0, kit: 'tavern',
        dress: ['counter', 'barrels', 'rug', 'corners'], note: 'The front door off the road and the bar beside it, the shutters nailed; the Redhand drank the place dry first.' },
      { id: 'the_common_room', name: 'The Common Room', role: 'room', x: 42, y: 30, w: 50, h: 40, shape: 'rect', lv: 0, kit: 'tavern', foes: 'taproom',
        dress: ['hearth', 'noticeboard', 'tavern_tables', 'firewood', 'fire_baskets', 'barrels', 'rug', 'corners'], note: 'The big room: the hearth still lit, the old notices on the board, the long tables pushed to the walls for the fighting.' },
      { id: 'the_kitchen', name: 'The Kitchen', role: 'offshoot', x: 48, y: 0, w: 26, h: 20, shape: 'rect', lv: 0, kit: 'tavern', foes: 'taproom',
        dress: ['kitchen_hearth', 'prep_table', 'casks', 'sacks', 'chest', 'shrine_west', 'corners'], note: 'The kitchen behind the common room, the pot on the fire, the stores along the wall.' },
      { id: 'the_snug', name: 'The Snug', role: 'room', x: 102, y: 34, w: 30, h: 30, shape: 'rect', lv: 0, kit: 'tavern', foes: 'taproom',
        dress: ['snug_tables', 'rug', 'chest', 'corners'], note: 'The small room off the common room, where the regulars sat; the Redhand\'s officers have it now.' },
      { id: 'the_cellar_hall', name: 'The Cellar Hall', role: 'end', x: 46, y: 80, w: 48, h: 40, shape: 'rect', lv: 0, kit: 'tavern_cellar', foes: 'taproom',
        dress: ['casks', 'barrels', 'crates', 'fire_baskets', 'corners', 'chest'], note: 'The long room at the back, over the cellar: the casks racked down the wall, what\'s left of them, and behind them a box somebody hid.' },   // (v1.146: its chest, the run's end for the stars and Hob's box: without it the inn could never be finished)
    ], halls: [
      { from: 'the_front_room', to: 'the_common_room', x: 32, y: 44, w: 10, h: 10 },
      { from: 'the_common_room', to: 'the_kitchen', x: 48, y: 20, w: 10, h: 10 },
      { from: 'the_common_room', to: 'the_snug', x: 92, y: 44, w: 10, h: 10 },
      { from: 'the_common_room', to: 'the_cellar_hall', x: 80, y: 70, w: 10, h: 10 },
    ] },
  ] },

  // ── The Haddow Crypt (a prototype: the crypt kit, docs/crypt-dungeon.md; the owner, 2026-11-22: "do a similar dungeon
  //    style as the inside of a crypt"): the Haddows' burial vault, a wool family's, dug under their chantry and built
  //    grander than the chantry over it. A dungeon inside a building, as the Shuttered Inn is: its walls stand whole, the
  //    near ones cut away, and every room is dressed at its edges, the tombs along the walls and the middle open for the
  //    fight. The dead in it no longer keep to their shelves.
  haddow_crypt: { site: 'haddow_crypt', name: 'The Haddow Crypt', kind: 'crypt', base: 6, flat: true, floors: [
    { name: 'The Crypt', spaces: [
      { id: 'the_stair_hall', name: 'The Stair Hall', role: 'entrance', x: 0, y: 38, w: 32, h: 30, shape: 'rect', lv: 0, kit: 'crypt',
        dress: ['offering', 'tomb_one', 'candelabra_ends', 'crypt_corners'], note: 'The steps down from the chantry and the table where the family left its offerings, still laid.' },
      { id: 'the_hall_of_tombs', name: 'The Hall of Tombs', role: 'room', x: 42, y: 30, w: 50, h: 40, shape: 'rect', lv: 0, kit: 'crypt', foes: 'ashbound',
        dress: ['tombs', 'candelabra_pair', 'crypt_corners'], note: 'Four generations of Haddows in stone along the walls, lids carved with their likenesses, the aisle between them open.' },
      { id: 'the_chantry_chapel', name: 'The Chantry Chapel', role: 'offshoot', x: 48, y: 0, w: 26, h: 20, shape: 'rect', lv: 0, kit: 'crypt', foes: 'ashbound',
        dress: ['chantry_altar', 'chantry_pews'], note: 'The little chapel below, where a priest was paid to say the family\'s names once a year; nobody has paid him since.' },
      { id: 'the_ossuary', name: 'The Ossuary', role: 'room', x: 102, y: 34, w: 30, h: 30, shape: 'rect', lv: 0, kit: 'ossuary', foes: 'ashbound',
        dress: ['candelabra_ends', 'crypt_corners', 'chest'], note: 'Where the older dead went when the shelves filled: their bones stacked in the walls, the skulls in rows.' },
      { id: 'the_founders_vault', name: 'The Founder\'s Vault', role: 'end', x: 46, y: 80, w: 48, h: 40, shape: 'rect', lv: 0, kit: 'crypt', foes: 'ashbound',
        dress: ['great_tomb', 'mourners', 'founder_lights', 'tombs_near', 'tombs_side', 'crypt_corners', 'chest'], note: 'Old Godwin Haddow, who made the money, under a canopy he paid for himself, two stone mourners he also paid for.' },
    ], halls: [
      { from: 'the_stair_hall', to: 'the_hall_of_tombs', x: 32, y: 44, w: 10, h: 10 },
      { from: 'the_hall_of_tombs', to: 'the_chantry_chapel', x: 48, y: 20, w: 10, h: 10 },
      { from: 'the_hall_of_tombs', to: 'the_ossuary', x: 92, y: 44, w: 10, h: 10 },
      { from: 'the_hall_of_tombs', to: 'the_founders_vault', x: 46, y: 70, w: 10, h: 10 },   // (at the west end: the founder's canopy stands at the middle of the vault's back wall, round 3)
    ] },
  ] },

  // ── The Reedholm Undercroft (v1.145; the owner, 2026-11-23: "we can replace an existing dungeon in favor of the better
  //    dungeon if its the right style"): the Fens' secret, the binding clergy's copy-room under Reedholm priory, was the
  //    generator's; now the crypt kit's, on the Haddow Crypt's proven floor (its halls, its open middles), dressed as
  //    a scriptorium of the dead: the copyists' desks and rolls at the walls, the clergy's chapel, their bones, and the
  //    vault where the fair copy lies (world doc §7: The Fair Copy, its heirloom, in the end room's chest: world.js placeVault).
  reedholm_undercroft: { site: 'reedholm_undercroft', name: 'The Reedholm Undercroft', kind: 'crypt', base: 18, flat: true, floors: [
    { name: 'The Undercroft', spaces: [
      { id: 'the_key_stair', name: 'The Key Stair', role: 'entrance', x: 0, y: 38, w: 32, h: 30, shape: 'rect', lv: 0, kit: 'fenbrick',
        dress: ['candelabra_ends', 'crypt_corners'], note: 'The stair down from the priory\'s low door. The key was on its nail by the door. It always was.' },
      { id: 'the_copy_room', name: 'The Copy Room', role: 'room', x: 42, y: 30, w: 50, h: 40, shape: 'rect', lv: 0, kit: 'fenbrick', foes: 'ashbound',
        dress: ['desks', 'rolls', 'candelabra_pair', 'crypt_corners'], note: 'Where the binding rolls were written out fair: the copyists\' desks along the walls, the ink dry in its horns.' },
      { id: 'the_clergy_chapel', name: 'The Clergy\'s Chapel', role: 'offshoot', x: 48, y: 0, w: 26, h: 20, shape: 'rect', lv: 0, kit: 'fenbrick', foes: 'ashbound',
        dress: ['chantry_altar', 'chantry_pews', 'shrine'], note: 'The binding clergy\'s own chapel, where a roll was blessed before it was bound.' },
      { id: 'the_bone_room', name: 'The Bone Room', role: 'room', x: 102, y: 34, w: 30, h: 30, shape: 'rect', lv: 0, kit: 'fenbones', foes: 'ashbound',
        dress: ['candelabra_ends', 'crypt_corners', 'chest'], note: 'The priory\'s dead, brought down when the water came into the Abbey.' },
      { id: 'the_fair_copy', name: 'The Fair Copy', role: 'end', x: 46, y: 80, w: 48, h: 40, shape: 'rect', lv: 0, kit: 'fenbrick', foes: 'ashbound',
        dress: ['vault_chest', 'tombs_near', 'tombs_side', 'founder_lights', 'rolls', 'crypt_corners'], note: 'The copyists in their tombs, and between them the chest with the fair copy: every name, in a better hand than it was ever written in.' },
    ], halls: [
      { from: 'the_key_stair', to: 'the_copy_room', x: 32, y: 44, w: 10, h: 10 },
      { from: 'the_copy_room', to: 'the_clergy_chapel', x: 48, y: 20, w: 10, h: 10 },
      { from: 'the_copy_room', to: 'the_bone_room', x: 92, y: 44, w: 10, h: 10 },
      { from: 'the_copy_room', to: 'the_fair_copy', x: 46, y: 70, w: 10, h: 10 },
    ] },
  ] },

  // ── The Drowned Mole (31–35; the Tidemark, GDD v1.150, docs/tidemark-plan.md): the sunken imperial harbour off
  //    Gullwick. Floor 1 the old wharf on its piles (the docks kit, the Old Eel Wharf's proven rooms), floor 2 the stone
  //    moles at low water (the mole kit: the empire's stone, weed to the tide line, wrecks on their sides). A band of
  //    five: floor 1 at 31–33, floor 2 at 34–35 (`step` 3). The drowned sailors under Lucan's orders, the Gull Fleet's
  //    corsairs picking the wrecks; the Harbourmaster on the outer mole's end; Sister Maren in the harbour office.
  drowned_mole: { site: 'drowned_mole', name: 'The Drowned Mole', kind: 'wharf', base: 31, step: 3, floors: [
    { name: 'The Wharf', spaces: [
      { id: 'the_ferry_stage', name: 'The Ferry Stage', role: 'entrance', x: 0, y: 38, w: 32, h: 30, shape: 'rect', lv: 0, kit: 'docks',
        dress: ['dock_lamps', 'dock_cargo', 'dock_ropes'], note: 'Where Gullwick\'s ferryman puts a company ashore and pushes off again quickly. The steps down to his boat are the way out.' },
      { id: 'the_fish_market', name: 'The Fish Market', role: 'room', x: 42, y: 30, w: 50, h: 40, shape: 'rect', lv: 0, kit: 'docks', foes: 'wharf',
        dress: ['fish_market', 'dock_lamps', 'dock_ropes', 'moorings'], note: 'The imperial harbour\'s market, its stalls on the boards over the water; the drowned stand at them as if the boats were due in.' },
      { id: 'the_customs_shed', name: 'The Customs Shed', role: 'offshoot', x: 48, y: 0, w: 26, h: 20, shape: 'rect', lv: 1, kit: 'docks', foes: 'wharf',
        dress: ['dock_lamps', 'dock_cargo', 'chest'], note: 'The tollmen\'s shed, its ledgers swollen shut; the Gull Fleet\'s corsairs have been through the strongbox, and missed one.' },
      { id: 'the_net_stage', name: 'The Net Stage', role: 'room', x: 102, y: 34, w: 30, h: 30, shape: 'rect', lv: 1, kit: 'docks', foes: 'wharf',
        dress: ['dock_lamps', 'dock_ropes', 'moorings'], note: 'Where the fleet\'s nets were spread to mend; they are still spread, and something is caught in every one.' },
      { id: 'the_long_jetty', name: 'The Long Jetty', role: 'descent', x: 46, y: 80, w: 48, h: 40, shape: 'rect', lv: 2, kit: 'docks', foes: 'wharf',
        dress: ['crane', 'dock_lamps', 'dock_cargo', 'stair_down'], note: 'The deep-water berth, and at its end the old sea-wall stair down to the moles, bare at low water.' },
    ], halls: [
      { from: 'the_ferry_stage', to: 'the_fish_market', x: 32, y: 44, w: 10, h: 10 },
      { from: 'the_fish_market', to: 'the_customs_shed', x: 52, y: 20, w: 10, h: 10 },
      { from: 'the_fish_market', to: 'the_net_stage', x: 92, y: 44, w: 10, h: 10 },
      { from: 'the_fish_market', to: 'the_long_jetty', x: 48, y: 70, w: 10, h: 10 },
    ] },
    { name: 'The Moles at Low Water', spaces: [
      { id: 'the_sea_wall_stair', name: 'The Sea-Wall Stair', role: 'entrance', x: 0, y: 0, w: 30, h: 26, shape: 'rect', lv: 3, kit: 'mole',
        dress: ['weed', 'mole_lamps', 'stair_up'], note: 'The foot of the sea wall, the stair up to the jetty slick with weed; the tide line is over your head.' },
      { id: 'the_inner_mole', name: 'The Inner Mole', role: 'room', x: 40, y: 2, w: 70, h: 22, shape: 'rect', lv: 3, kit: 'mole', foes: 'mole',
        dress: ['weed', 'bollards', 'mole_lamps', 'anchors'], note: 'A long stone arm out into the harbour, its bollards still standing, the water slapping either side of it.' },
      { id: 'the_harbour_office', name: 'The Harbour Office', role: 'offshoot', x: 50, y: 34, w: 26, h: 22, shape: 'rect', lv: 4, kit: 'mole', foes: 'mole',
        dress: ['desks', 'weed', 'chest', 'shrine'], note: 'The harbourmaster\'s office on the mole, its roof gone; a Grey Sister holding its door with a boathook, and saying the drowned\'s names at them.' },
      { id: 'the_wreck_yard', name: 'The Wreck Yard', role: 'room', x: 120, y: 0, w: 36, h: 34, shape: 'rect', lv: 4, kit: 'mole', foes: 'mole',
        dress: ['wrecks', 'weed', 'anchors'], note: 'Where the hulls were dragged to break and never broken: they lie on their sides, and the drowned climb out of them.' },
      { id: 'the_outer_mole', name: 'The Outer Mole', role: 'end', x: 106, y: 44, w: 58, h: 50, shape: 'rect', lv: 4, kit: 'mole', foes: 'mole', boss: 'harbourmaster',
        dress: ['lamp_stand', 'bollards', 'weed', 'mole_lamps'], note: 'The mole\'s end and its lamp-stand, the open sea past it. The Harbourmaster keeps the berths, as he did. Lucan sang from the lamp-stand.' },
    ], halls: [
      { from: 'the_sea_wall_stair', to: 'the_inner_mole', x: 30, y: 8, w: 10, h: 10 },
      { from: 'the_inner_mole', to: 'the_harbour_office', x: 56, y: 24, w: 10, h: 10 },
      { from: 'the_inner_mole', to: 'the_wreck_yard', x: 110, y: 8, w: 10, h: 10 },
      { from: 'the_wreck_yard', to: 'the_outer_mole', x: 132, y: 34, w: 10, h: 10 },
    ] },
  ] },

  // ── The Gull Isles (36–40; the Tidemark, GDD v1.151, docs/tidemark-plan.md step 4): out on the isles past the salt
  //    marsh. Floor 1 the sea cave where the Gull Fleet hides its boats (the `seacave` kit: the cellar's cave with the sea
  //    in it), floor 2 the hulks moored in its lagoon (the `hulk` kit: a ship's inside, its decks and ribs, the hold). A
  //    band of five, as the Mole: floor 1 at 36–38, floor 2 at 39–40 (`step` 3). Hesk in the flagship's great cabin; his
  //    commission in the wardroom.
  gull_isles: { site: 'gull_isles', name: 'The Gull Isles', kind: 'cave', base: 36, step: 3, floors: [
    { name: 'The Sea Cave', spaces: [
      { id: 'the_boat_landing', name: 'The Boat Landing', role: 'entrance', x: 0, y: 38, w: 32, h: 30, shape: 'rect', lv: 0, kit: 'seacave',
        dress: ['boats', 'dock_lamps', 'dock_ropes'], note: 'Where the fleet\'s boats put in under the cliff, the sea slapping at the rock. The landing\'s steps are the way out.' },
      { id: 'the_smugglers_stores', name: 'The Smugglers\' Stores', role: 'room', x: 42, y: 30, w: 50, h: 40, shape: 'rect', lv: 0, kit: 'seacave', foes: 'fleet',
        dress: ['casks', 'dock_cargo', 'stalagmites', 'dock_lamps'], note: 'What the fleet took off League ships, stacked in the cave\'s dry end, tallied in chalk on the rock.' },
      { id: 'the_strongroom', name: 'The Strongroom', role: 'offshoot', x: 48, y: 0, w: 26, h: 20, shape: 'rect', lv: 1, kit: 'seacave', foes: 'fleet',
        dress: ['ledger', 'dock_lamps', 'chest'], note: 'A fissure walled up with a ship\'s door. The fleet\'s share-out is reckoned here.' },
      { id: 'the_long_gallery', name: 'The Long Gallery', role: 'room', x: 102, y: 34, w: 30, h: 30, shape: 'rect', lv: 1, kit: 'seacave', foes: 'fleet',
        dress: ['stalagmites', 'drips', 'dock_lamps'], note: 'The cave\'s long arm under the isle, wet to the knee at high water. The hounds are kennelled at its end.' },
      { id: 'the_careening_beach', name: 'The Careening Beach', role: 'descent', x: 46, y: 80, w: 48, h: 40, shape: 'rect', lv: 2, kit: 'seacave', foes: 'fleet',
        dress: ['boats', 'scaffold', 'dock_lamps', 'stair_down'], note: 'A beach inside the isle where the boats are hauled over to be scraped, and the way out through the rock to the lagoon and the hulks.' },
    ], halls: [
      { from: 'the_boat_landing', to: 'the_smugglers_stores', x: 32, y: 44, w: 10, h: 10 },
      { from: 'the_smugglers_stores', to: 'the_strongroom', x: 52, y: 20, w: 10, h: 10 },
      { from: 'the_smugglers_stores', to: 'the_long_gallery', x: 92, y: 44, w: 10, h: 10 },
      { from: 'the_smugglers_stores', to: 'the_careening_beach', x: 48, y: 70, w: 10, h: 10 },
    ] },
    { name: 'The Hulks', spaces: [
      { id: 'the_gangway', name: 'The Gangway', role: 'entrance', x: 0, y: 0, w: 30, h: 26, shape: 'rect', lv: 3, kit: 'hulk',
        dress: ['dock_ropes', 'mole_lamps', 'stair_up'], note: 'Up the gangway from the lagoon\'s shingle and in through the first hulk\'s side, where a port was cut wide for cargo.' },
      { id: 'the_gun_deck', name: 'The Gun Deck', role: 'room', x: 40, y: 2, w: 70, h: 22, shape: 'rect', lv: 3, kit: 'hulk', foes: 'fleet',
        dress: ['bunks', 'casks', 'mole_lamps'], note: 'The long low deck under the beams, the crew\'s hammocks slung between the guns.' },
      { id: 'the_wardroom', name: 'The Wardroom', role: 'offshoot', x: 50, y: 34, w: 26, h: 22, shape: 'rect', lv: 4, kit: 'hulk', foes: 'fleet',
        dress: ['desks', 'mole_lamps', 'chest'], note: 'The officers\' table, its charts held down with bottles. Hesk\'s commission is in the drawer: signed Lucanus, sealed in coal-red wax.' },
      { id: 'the_hold', name: 'The Hold', role: 'room', x: 120, y: 0, w: 36, h: 34, shape: 'rect', lv: 4, kit: 'hulk', foes: 'fleet',
        dress: ['casks', 'dock_cargo', 'anchors', 'mole_lamps'], note: 'Down among the ribs and the ballast, where the prizes\' cargo goes and the bilge comes up through the boards.' },
      { id: 'the_great_cabin', name: 'The Great Cabin', role: 'end', x: 106, y: 44, w: 58, h: 50, shape: 'rect', lv: 4, kit: 'hulk', foes: 'fleet', boss: 'hesk',
        dress: ['desks', 'dock_cargo', 'mole_lamps', 'rug'], note: 'The flagship\'s stern cabin, the whole width of her, the windows over the lagoon. Admiral Hesk keeps his table here, and his prizes\' flags.' },
    ], halls: [
      { from: 'the_gangway', to: 'the_gun_deck', x: 30, y: 8, w: 10, h: 10 },
      { from: 'the_gun_deck', to: 'the_wardroom', x: 56, y: 24, w: 10, h: 10 },
      { from: 'the_gun_deck', to: 'the_hold', x: 110, y: 8, w: 10, h: 10 },
      { from: 'the_hold', to: 'the_great_cabin', x: 132, y: 34, w: 10, h: 10 },
    ] },
  ] },

  // ── Highmarch (41–45; the Tidemark, GDD v1.154, docs/tidemark-plan.md step 6): the walled march-kingdom at the head of
  //    the Highmarch road, stormed. Floor 1 the walls under siege, in through the breach the League's engines made (the
  //    ramparts kit: the drop and the mist below), the Seventh's Champion holding the great bastion; floor 2 the Seventh's
  //    Palace (the `palace` kit: the crypt's dressed stone, the tavern's furniture, banners, the throne), Lucan on his
  //    throne. A band of five, as the Mole: floor 1 at 41–43, floor 2 at 44–45 (`step` 3).
  highmarch: { site: 'highmarch', name: 'Highmarch', kind: 'ramparts', base: 41, step: 3, floors: [
    { name: 'The Walls', spaces: [
      { id: 'the_breach', name: 'The Breach', role: 'entrance', x: 0, y: 38, w: 32, h: 30, shape: 'rect', lv: 0, kit: 'ramparts',
        dress: ['rampart_torches', 'rampart_cargo'], note: 'Where the League\'s engines brought the curtain down: in over the rubble, the gate the way out.' },
      { id: 'the_rampart_walk', name: 'The Rampart Walk', role: 'room', x: 42, y: 30, w: 50, h: 40, shape: 'rect', lv: 0, kit: 'ramparts', foes: 'siege',
        dress: ['rampart_torches', 'rampart_cargo', 'rampart_clutter'], note: 'The wall walk, the march-town\'s roofs at its back and the drop into the mist at its front. The legionaries hold it shield to shield.' },
      { id: 'the_engine_tower', name: 'The Engine Tower', role: 'offshoot', x: 48, y: 0, w: 26, h: 20, shape: 'rect', lv: 1, kit: 'ramparts', foes: 'siege',
        dress: ['rampart_torches', 'chest'], note: 'Where the engineers keep the pitch and the throwing-arm, and the march\'s pay for them.' },
      { id: 'the_gatehouse', name: 'The Gatehouse', role: 'room', x: 102, y: 34, w: 30, h: 30, shape: 'rect', lv: 1, kit: 'ramparts', foes: 'siege',
        dress: ['rampart_torches', 'rampart_well', 'rampart_cargo'], note: 'The gate\'s winding-room over the road, the portcullis down, the hounds kennelled under the stair.' },
      { id: 'the_great_bastion', name: 'The Great Bastion', role: 'descent', x: 46, y: 80, w: 48, h: 40, shape: 'rect', lv: 2, kit: 'ramparts', foes: 'siege', boss: 'champion',
        dress: ['rampart_torches', 'rampart_clutter', 'stair_down'], note: 'The wall\'s great bastion over the town, and the stair down into the palace yard. The Seventh\'s Champion has drilled the wall here four years for a coronation.' },
    ], halls: [
      { from: 'the_breach', to: 'the_rampart_walk', x: 32, y: 44, w: 10, h: 10 },
      { from: 'the_rampart_walk', to: 'the_engine_tower', x: 52, y: 20, w: 10, h: 10 },
      { from: 'the_rampart_walk', to: 'the_gatehouse', x: 92, y: 44, w: 10, h: 10 },
      { from: 'the_rampart_walk', to: 'the_great_bastion', x: 48, y: 70, w: 10, h: 10 },
    ] },
    { name: 'The Seventh\'s Palace', spaces: [
      { id: 'the_courtyard', name: 'The Courtyard', role: 'entrance', x: 0, y: 0, w: 30, h: 26, shape: 'rect', lv: 3, kit: 'palace',
        dress: ['palace_lamps', 'stair_up'], note: 'The palace yard at the bastion stair\'s foot, the household\'s banners still out for the day in the capital.' },
      { id: 'the_hall_of_banners', name: 'The Hall of Banners', role: 'room', x: 40, y: 2, w: 70, h: 22, shape: 'rect', lv: 3, kit: 'palace', foes: 'palace',
        dress: ['banners', 'standards', 'palace_lamps'], note: 'The long hall, the legions\' standards down both walls: every one the empire raised, and some it never did.' },
      { id: 'the_study', name: 'The Study', role: 'offshoot', x: 50, y: 34, w: 26, h: 22, shape: 'rect', lv: 4, kit: 'palace', foes: 'palace',
        dress: ['desks', 'palace_lamps', 'chest'], note: 'Lucan\'s study. The Kindler\'s letters are on the table, under the paperweight, unopened.' },
      { id: 'the_chapel', name: 'The Chapel', role: 'room', x: 120, y: 0, w: 36, h: 34, shape: 'rect', lv: 4, kit: 'palace', foes: 'palace',
        dress: ['reliquary', 'palace_lamps', 'rug'], note: 'Where Livia\'s box stood three hundred years. Its stand is empty and its lid lies on the floor.' },
      { id: 'the_throne_room', name: 'The Throne Room', role: 'end', x: 106, y: 44, w: 58, h: 50, shape: 'rect', lv: 4, kit: 'palace', foes: 'palace', boss: 'lucan',
        dress: ['throne', 'banners', 'palace_lamps'], note: 'The throne on its dais, the dais\'s steps. Lucan sings from the throne and sits down on the steps.' },
    ], halls: [
      { from: 'the_courtyard', to: 'the_hall_of_banners', x: 30, y: 8, w: 10, h: 10 },
      { from: 'the_hall_of_banners', to: 'the_study', x: 56, y: 24, w: 10, h: 10 },
      { from: 'the_hall_of_banners', to: 'the_chapel', x: 110, y: 8, w: 10, h: 10 },
      { from: 'the_chapel', to: 'the_throne_room', x: 132, y: 34, w: 10, h: 10 },
    ] },
  ] },

  // ── The Lamp Fort (38; the Tidemark's side vault, GDD v1.151): Old Gannet's coast light on its headland, a fort on the
  //    ramparts kit with the Gull Fleet at its door. One floor; Gannet at the gate; his spare wick in the lamp room's
  //    chest (sites.js `vault`: the keepsake, once), then it seals (`side`, core.js).
  lamp_fort: { site: 'lamp_fort', name: 'The Lamp Fort', kind: 'ramparts', base: 38, flat: true, floors: [
    { name: 'The Lamp Fort', spaces: [
      { id: 'the_fort_gate', name: 'The Fort Gate', role: 'entrance', x: 0, y: 38, w: 32, h: 30, shape: 'rect', lv: 0, kit: 'ramparts',
        dress: ['rampart_torches', 'rampart_cargo'], note: 'Inside the gate, where Gannet waits with his hand-lamp. The fleet has been at the door since the spring.' },
      { id: 'the_yard', name: 'The Yard', role: 'room', x: 42, y: 30, w: 50, h: 40, shape: 'rect', lv: 0, kit: 'ramparts', foes: 'fleet',
        dress: ['rampart_well', 'rampart_torches', 'rampart_cargo', 'rampart_clutter'], note: 'The fort\'s yard and its well, the barracks along the back, nobody in them but Gannet for a long time.' },
      { id: 'the_magazine', name: 'The Magazine', role: 'offshoot', x: 48, y: 0, w: 26, h: 20, shape: 'rect', lv: 0, kit: 'ramparts', foes: 'fleet',
        dress: ['rampart_torches', 'chest'], note: 'Where the oil for the lamp is kept, sixty years of it, and what the fleet wanted.' },
      { id: 'the_curtain_walk', name: 'The Curtain Walk', role: 'room', x: 102, y: 34, w: 30, h: 30, shape: 'rect', lv: 0, kit: 'ramparts', foes: 'fleet',
        dress: ['rampart_torches', 'rampart_cargo'], note: 'The wall walk round the seaward side, the drop to the rocks below it.' },
      { id: 'the_lamp_room', name: 'The Lamp Room', role: 'end', x: 46, y: 80, w: 48, h: 40, shape: 'rect', lv: 0, kit: 'ramparts', foes: 'fleet',
        dress: ['rampart_torches', 'rampart_clutter', 'lamp_stand'], note: 'The top of the tower and the light, kept lit. Gannet\'s spare wick is in the chest by the lamp.' },
    ], halls: [
      { from: 'the_fort_gate', to: 'the_yard', x: 32, y: 44, w: 10, h: 10 },
      { from: 'the_yard', to: 'the_magazine', x: 52, y: 20, w: 10, h: 10 },
      { from: 'the_yard', to: 'the_curtain_walk', x: 92, y: 44, w: 10, h: 10 },
      { from: 'the_yard', to: 'the_lamp_room', x: 48, y: 70, w: 10, h: 10 },
    ] },
  ] },

  // ── The Old Eel Wharf (a prototype: the docks kit, docs/docks-dungeon.md; the owner, 2026-11-23, from a reference:
  //    "start two new level dressing types, docks and harbor"): the eel-men's wharf on the Fens' edge, its decks out over
  //    the black water on piles, a trial for Tollhaven's quays (world doc §3.7). No walls: each deck's edge is the water,
  //    railed; boardwalks between them. Every piece at an edge and the middle open for the fight. The drowned come up
  //    the piles at night.
  old_eel_wharf: { site: 'old_eel_wharf', name: 'The Old Eel Wharf', kind: 'wharf', base: 12, flat: true, floors: [
    { name: 'The Wharf', spaces: [
      { id: 'the_landing', name: 'The Landing', role: 'entrance', x: 0, y: 38, w: 32, h: 30, shape: 'rect', lv: 0, kit: 'docks',
        dress: ['dock_lamps', 'dock_cargo', 'dock_ropes'], note: 'The steps up from the boats, the eel-men\'s barrels where they left them.' },
      { id: 'the_fish_market', name: 'The Fish Market', role: 'room', x: 42, y: 30, w: 50, h: 40, shape: 'rect', lv: 0, kit: 'docks', foes: 'drowned',
        dress: ['fish_market', 'dock_lamps', 'dock_ropes', 'moorings'], note: 'The morning\'s catch still in its crates along the back, and nobody come to buy it.' },
      { id: 'the_net_stage', name: 'The Net Stage', role: 'offshoot', x: 48, y: 0, w: 26, h: 20, shape: 'rect', lv: 0, kit: 'docks', foes: 'drowned',
        dress: ['dock_lamps', 'dock_ropes'], note: 'Where the nets were spread to mend; they are still spread.' },
      { id: 'the_long_jetty', name: 'The Long Jetty', role: 'room', x: 102, y: 34, w: 30, h: 30, shape: 'rect', lv: 0, kit: 'docks', foes: 'drowned',
        dress: ['dock_lamps', 'dock_cargo', 'moorings', 'chest'], note: 'The deep-water berth, a boat still tied up at it with nobody in her.' },
      { id: 'the_harbour_end', name: 'The Harbour End', role: 'end', x: 46, y: 80, w: 48, h: 40, shape: 'rect', lv: 0, kit: 'docks', foes: 'drowned',
        dress: ['crane', 'dock_lamps', 'dock_cargo', 'dock_ropes', 'moorings', 'chest'], note: 'The crane and its last load, swung out over the water and left there.' },
    ], halls: [
      { from: 'the_landing', to: 'the_fish_market', x: 32, y: 44, w: 10, h: 10 },
      { from: 'the_fish_market', to: 'the_net_stage', x: 52, y: 20, w: 10, h: 10 },
      { from: 'the_fish_market', to: 'the_long_jetty', x: 92, y: 44, w: 10, h: 10 },
      { from: 'the_fish_market', to: 'the_harbour_end', x: 48, y: 70, w: 10, h: 10 },
    ] },
  ] },

  // ── The High Ramparts (a prototype: the ramparts kit, docs/ramparts-dungeon.md; the owner, 2026-11-23, from a reference:
  //    "the reaches, high up on the ramparts"): a walled town's upper streets, built along the top of its ramparts, the
  //    houses on the town side and a parapet over the drop on the other, the mist down below. A trial for the Reach's walled
  //    towns. Every piece by the houses or the parapet, the middle of each terrace open for the fight. The Assay's men hold
  //    the walls.
  high_ramparts: { site: 'high_ramparts', name: 'The High Ramparts', kind: 'ramparts', base: 22, flat: true, floors: [
    { name: 'The Ramparts', spaces: [
      { id: 'the_stair_head', name: 'The Stair Head', role: 'entrance', x: 0, y: 38, w: 32, h: 30, shape: 'rect', lv: 0, kit: 'ramparts',
        dress: ['rampart_torches', 'rampart_cargo', 'rampart_clutter'], note: 'The top of the long stair up the inside of the wall, and the street along it.' },
      { id: 'the_market_terrace', name: 'The Market Terrace', role: 'room', x: 42, y: 30, w: 50, h: 40, shape: 'rect', lv: 0, kit: 'ramparts', foes: 'yards',
        dress: ['market_stalls', 'rampart_torches', 'rampart_cargo', 'rampart_clutter'], note: 'The stalls up against the houses, their awnings out over the street, nobody selling.' },
      { id: 'the_watch_walk', name: 'The Watch Walk', role: 'offshoot', x: 48, y: 0, w: 26, h: 20, shape: 'rect', lv: 0, kit: 'ramparts', foes: 'yards',
        dress: ['rampart_torches'], note: 'Where the watch walked its round; the brazier is still warm.' },
      { id: 'the_bakers_row', name: 'The Bakers\' Row', role: 'room', x: 102, y: 34, w: 30, h: 30, shape: 'rect', lv: 0, kit: 'ramparts', foes: 'yards',
        dress: ['oven', 'rampart_torches', 'rampart_cargo', 'chest'], note: 'The ovens built out into the street, and the smell of the morning\'s bread.' },
      { id: 'the_bastion', name: 'The Bastion', role: 'end', x: 46, y: 80, w: 48, h: 40, shape: 'rect', lv: 0, kit: 'ramparts', foes: 'yards',
        dress: ['rampart_well', 'rampart_torches', 'rampart_cargo', 'rampart_clutter', 'chest'], note: 'The wall\'s corner tower, its top a yard with a well; the whole drop below it in the mist.' },
    ], halls: [
      { from: 'the_stair_head', to: 'the_market_terrace', x: 32, y: 44, w: 10, h: 10 },
      { from: 'the_market_terrace', to: 'the_watch_walk', x: 52, y: 20, w: 10, h: 10 },
      { from: 'the_market_terrace', to: 'the_bakers_row', x: 92, y: 44, w: 10, h: 10 },
      { from: 'the_market_terrace', to: 'the_bastion', x: 48, y: 70, w: 10, h: 10 },
    ] },
  ] },

  // ── The Bowl (GDD §17 v1.85, v1.88; world doc v1.46 §3.9; docs/bowl-arena-proposal.md §12, the owner's "B"): the
  //    Quarry Ring in Solmere, the arena cut down into the old sandstone quarry. Not on any land: the menu takes a company
  //    to it from level 6 and back. One space, open to the sky: the sand, oval, open from wall to wall, the company's gate
  //    in its north face (the stair up is the way back out). An arena's plan is its one sand (checkPlan).
  bowl: { site: 'bowl', name: 'The Bowl', kind: 'arena', base: 6, flat: true, floors: [
    { name: 'The Sand', spaces: [
      { id: 'the_sand', name: 'The Sand', role: 'end', x: 0, y: 0, w: 52, h: 40, shape: 'round', lv: 0, kit: 'bailey',
        dress: [], note: 'The Quarry Ring\'s sand, raked between bouts, under three ledges of banded rock where the crowd sits; the Sun\'s Box on the far ledge, the fighters\' gate in the north face.' },
    ], halls: [] },
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
    const arena = p.kind === 'arena';                  // (an arena is its one sand: the way in a gate in its wall)
    if (arena && (f.spaces.length !== 1 || f.halls.length)) out.push(`${at}: an arena is one space`);
    if (!arena && roles.filter((r) => r === 'entrance').length !== 1) out.push(`${at}: one entrance`);
    if (roles.filter((r) => r === (last ? 'end' : 'descent')).length !== 1) out.push(`${at}: one ${last ? 'end hall' : 'descent room'}`);
    for (const s of f.spaces) {
      const k = sizeOf(s), lo = Math.min(s.w, s.h), hi = Math.max(s.w, s.h);
      if (lo < R.small[0]) out.push(`${at} ${s.id}: ${lo} across, under a small room's ${R.small[0]}`);
      if (k === 'large' && hi > R.large[1]) out.push(`${at} ${s.id}: ${hi} long, over a large room's ${R.large[1]}`);
      if (k === 'gallery' && hi > R.gallery[1]) out.push(`${at} ${s.id}: ${hi} long, over a gallery's ${R.gallery[1]}`);
      if ((s.role === 'descent' || s.role === 'end') && k !== 'large') out.push(`${at} ${s.id}: a floor's last hall is large`);
      if (s.role === 'entrance' && k === 'small') out.push(`${at} ${s.id}: an entrance is never small`);
      // (v1.144: a band of four, two levels a floor: `step`; v1.150: a band of five, three on the first floor and two on
      // the last: a floor that isn't the last spans `step` levels, the last floor two)
      const lvLo = fi * (p.step || 1), lvHi = lvLo + (last ? 1 : Math.max(1, (p.step || 1) - 1));
      if (!p.flat && (s.lv < lvLo || s.lv > lvHi)) out.push(`${at} ${s.id}: level +${s.lv} outside the floor's +${lvLo}..+${lvHi}`);
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
    const start = f.spaces.find((s) => s.role === 'entrance') || (arena ? f.spaces[0] : undefined), seen = new Set(start ? [start.id] : []), q = start ? [start.id] : [];
    while (q.length) for (const n of adj.get(/** @type {string} */ (q.shift())) || []) if (!seen.has(n)) { seen.add(n); q.push(n); }
    for (const s of f.spaces) if (!seen.has(s.id)) out.push(`${at}: ${s.id} can't be reached`);
    for (const s of f.spaces) if (s.role === 'offshoot' && (adj.get(s.id) || []).length !== 1) out.push(`${at}: the offshoot ${s.id} is a dead end off one room`);
  });
  return out;
}
