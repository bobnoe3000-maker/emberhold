// Where the main story stands (src/ui/storystatus.js; the owner, 2026-10-03: "it's not clear where I find the next
// step in the main quest line"). The Journal says it whenever no chapter is in hand: the next chapter and who gives
// it, the level it waits for, or that the act is done; and then what's still open in the Vale.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { storyStatus, openLeads, CHAPTERS } from '../src/ui/storystatus.js';

const SEED = 20260807;
const status = (sim) => (id) => sim.quests.status(id);
const town = () => { const s = createSim(SEED, undefined, { scene: 'town' }); s.tick(); return s; };

test('a new game: the next chapter is Maudry\'s', () => {
  const sim = town();
  assert.deepEqual(CHAPTERS, ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist', 'ch1_the_standard',
    'ch2_fog_on_the_canal', 'ch2_the_locks', 'ch2_the_sickpools', 'ch2_the_bells', 'ch2_the_rolls', 'ch2_the_last_office',
    'ch3_the_wickham_road', 'ch3_short_shift', 'ch3_paid_by_weight', 'ch3_gone_back_to_work', 'ch3_night_shift', 'ch3_quota',
    'ch4_consigned', 'ch4_low_water', 'ch4_letters_of_marque', 'ch4_keepers_light', 'ch4_brine_cross', 'ch4_seventh_voice']);
  assert.deepEqual(storyStatus(sim.state, status(sim)), { kind: 'next', id: 'ch1_smoke_over_the_vale', giver: 'maudry_fenn', town: 'Thornwick' });
});

test('a chapter in hand: no status (its own card says what to do); handed in, the next one is named', () => {
  const sim = town();
  sim.quests.begin('ch1_smoke_over_the_vale');
  assert.equal(storyStatus(sim.state, status(sim)), null);
  sim.state.quests.ch1_smoke_over_the_vale.st = 3;
  const st = storyStatus(sim.state, status(sim));
  assert.ok(st.kind === 'next' || st.kind === 'level'); assert.equal(st.id, 'ch1_the_diggers');
});

test('the owner\'s save (the Stranger down, level 11): The Standard is next, from Ilse (v1.49), then Act II; each waits for its level; the Vale\'s open leads are listed', () => {
  const sim = town();
  const S = sim.state;
  for (const id of ['vale_long_way_round', 'ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist', 'vale_first_page', 'vale_captains_ledger', 'trial_last_rites', 'trial_quiet_feet', 'trial_cold_weather']) S.quests[id] = { st: 3, step: 0, n: [] };
  S.party[0].level = 11; S.party[0].cls = 'cleric'; S.bosses = { redhand_captain: 1, robed_stranger: 1 }; S.trials = { cleric: 1, mage: 1, rogue: 1 };
  S.fragments = ['frag_vale_standing_order', 'frag_vale_last_dispatch', 'frag_vale_chaplains_prayer', 'frag_vale_chaplains_last_page', 'frag_vale_centurion_tablet'];
  assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch1_the_standard', giver: 'sister_ilse', town: 'Thornwick' });
  assert.deepEqual(openLeads(S, status(sim)).map((l) => l.id), ['brannoc', 'warren', 'chronicle', 'board'], 'the Standard is the chapter now, not a lead');
  S.party[0].level = 6; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id: 'ch1_the_standard', level: 9 });
  assert.deepEqual(openLeads(S, status(sim)).map((l) => l.id), ['brannoc', 'standard', 'warren', 'chronicle', 'board'], 'until it\'s offered, a lead');
  S.quests.ch1_the_standard = { st: 3, step: 0, n: [] }; S.bosses.standard = 1;
  S.party[0].level = 11; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch2_fog_on_the_canal', giver: 'sister_ilse', town: 'Thornwick' });
  S.party[0].level = 9; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id: 'ch2_fog_on_the_canal', level: 10 });
  S.party[0].level = 11;
  const leads = openLeads(S, status(sim)).map((l) => l.id);
  assert.deepEqual(leads, ['brannoc', 'warren', 'chronicle', 'board']);
  assert.deepEqual(openLeads(S, status(sim)).find((l) => l.id === 'chronicle'), { id: 'chronicle', n: 5, of: 10 });
  // every lead and status has its words
  const C = JSON.parse(readFileSync(new URL('../content/story.json', import.meta.url), 'utf8'));
  for (const id of ['brannoc', 'standard', 'warren', 'chronicle', 'milestone', 'trial', 'board']) assert.ok(C.leads[id], id);
  assert.ok(C.end.fens.title && C.next && C.level && C.leadsTitle.vale && C.leadsTitle.fens);
  for (const id of ['toadking', 'wren', 'choir', 'owed', 'tower', 'fensboard']) assert.ok(C.leads[id], id);
});

test('Act II: a chapter given in Saltmere says so; every chapter told, the end is the Tidemark\'s words; the Fens\' leads follow Wren', () => {
  const sim = town(), S = sim.state;
  for (const id of ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist', 'ch1_the_standard', 'ch2_fog_on_the_canal']) S.quests[id] = { st: 3, step: 0, n: [] };
  S.party[0].level = 12; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id: 'ch2_the_locks', level: 13 }, 'the Locks\' band starts at 13 (v1.48)');
  S.party[0].level = 13;
  assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch2_the_locks', giver: 'dace_pike', town: 'Saltmere' });
  for (const id of CHAPTERS) S.quests[id] = { st: 3, step: 0, n: [] };
  assert.deepEqual(storyStatus(S, status(sim)), { kind: 'end', region: 'tidemark' }, 'the last chapter told is the Tidemark\'s (v1.154: Act IV to its end)');
  // (v1.155) Fog on the Canal done: Dace Pike has Wren's marker to settle ('owed'), whether she's found or not
  S.bosses = {}; assert.deepEqual(openLeads(S, status(sim), 'fens').map((l) => l.id), ['toadking', 'choir', 'owed', 'fenschronicle', 'tower', 'fensboard']);
  S.bosses = { toadking: 1 }; assert.deepEqual(openLeads(S, status(sim), 'fens').map((l) => l.id), ['wren', 'choir', 'owed', 'fenschronicle', 'tower', 'fensboard']);
  assert.deepEqual(openLeads(S, status(sim), 'fens').find((l) => l.id === 'fenschronicle'), { id: 'fenschronicle', n: 0, of: 10 });
  S.revealed = new Set(['reedholm_undercroft']); S.sitesEntered = new Set();
  assert.deepEqual(openLeads(S, status(sim), 'fens').map((l) => l.id), ['wren', 'choir', 'owed', 'undercroft', 'tower', 'fensboard'], 'the set whole: the Undercroft');
});

test('a second trial on offer is a Fens lead, with its teacher\'s town', () => {
  const sim = town(), S = sim.state;
  S.party[0].cls = 'cleric'; S.party[0].level = 12; S.trials = { cleric: 1 }; S.bosses = { toadking: 1, drowned_choir: 1 };
  assert.deepEqual(openLeads(S, status(sim), 'fens').find((l) => l.id === 'trial'), { id: 'trial', cls: 'cleric', giver: 'mother_agnes', town: 'Saltmere' });
  S.trials.cleric12 = 1; assert.equal(openLeads(S, status(sim), 'fens').find((l) => l.id === 'trial'), undefined, 'done');
  assert.equal(openLeads(S, status(sim), 'vale').find((l) => l.id === 'trial'), undefined, 'not a Vale lead');
});

test('Act III (v1.124): after Act II, Ilse in Thornwick sends the company north; Dagny gives the next in Ashgate; the Reach\'s leads follow the Foreman and Tamsin', () => {
  const sim = town(), S = sim.state;
  for (const id of CHAPTERS.slice(0, 10)) S.quests[id] = { st: 3, step: 0, n: [] };
  S.party[0].level = 17; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id: 'ch3_the_wickham_road', level: 18 });
  S.party[0].level = 18; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch3_the_wickham_road', giver: 'sister_ilse', town: 'Thornwick' });
  S.quests.ch3_the_wickham_road = { st: 3, step: 0, n: [] };
  assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id: 'ch3_short_shift', level: 19 });
  S.party[0].level = 19; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch3_short_shift', giver: 'dagny_coalbrook', town: 'Ashgate' });
  S.bosses = {}; assert.deepEqual(openLeads(S, status(sim), 'reach').map((l) => l.id), ['foreman', 'reachchronicle', 'reachboard']);
  S.bosses = { foreman: 1 }; assert.deepEqual(openLeads(S, status(sim), 'reach').map((l) => l.id), ['tamsin', 'reachchronicle', 'reachboard']);
  S.bench = [{ id: 'tamsin', cls: 'mage', level: 19 }]; assert.deepEqual(openLeads(S, status(sim), 'reach').map((l) => l.id), ['reachchronicle', 'reachboard'], 'she\'s with you');
  S.party[0].level = 23; assert.deepEqual(openLeads(S, status(sim), 'reach').map((l) => l.id), ['showingoff', 'reachchronicle', 'reachboard'], 'her chain, from 23 (v1.144)');
  assert.deepEqual(openLeads(S, status(sim), 'reach').find((l) => l.id === 'reachchronicle'), { id: 'reachchronicle', n: 0, of: 12 });
  S.revealed = new Set(['ninth_vault']); S.sitesEntered = new Set();
  assert.ok(openLeads(S, status(sim), 'reach').some((l) => l.id === 'ninthvault'), 'the set whole: the Ninth Vault');
  // (v1.54) the rest of the act: Hob, Mother Coke, Dagny, then Tamsin's, from her card
  for (const [id, giver, town, lv] of [['ch3_paid_by_weight', 'hob', 'Ashgate', 23], ['ch3_gone_back_to_work', 'mother_coke', 'Ashgate', 27], ['ch3_night_shift', 'dagny_coalbrook', 'Ashgate', 29]]) {
    const before = CHAPTERS[CHAPTERS.indexOf(id) - 1]; S.quests[before] = { st: 3, step: 0, n: [] };
    S.party[0].level = lv - 1; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id, level: lv });
    S.party[0].level = lv; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id, giver, town });
  }
  S.quests.ch3_night_shift = { st: 3, step: 0, n: [] }; S.party[0].level = 30;
  assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch3_quota', giver: 'dagny_coalbrook', town: 'Ashgate' }, 'Dagny\'s (v1.154: no chapter waits on a companion)');
  S.quests.ch3_quota = { st: 3, step: 0, n: [] };
  assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch4_consigned', giver: 'sister_ilse', town: 'Thornwick' }, 'Act III is done: Ilse has Act IV');
  // (v1.150) Act IV's first two: Ilse sends the company to Tollhaven, where Hester Quaile gives Low Water
  S.quests.ch4_consigned = { st: 3, step: 0, n: [] }; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id: 'ch4_low_water', level: 31 });
  S.party[0].level = 31; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch4_low_water', giver: 'hester_quaile', town: 'Tollhaven' });
  S.quests.ch4_low_water = { st: 3, step: 0, n: [] }; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id: 'ch4_letters_of_marque', level: 36 });
  // (v1.151) the Gull Isles and the Lamp Fort, both after Low Water: Hester has Letters of Marque, then Old Gannet, at the
  // Lamp Fort's gate, The Keeper's Light (his town is the land's, Tollhaven, though he stands at the fort)
  S.party[0].level = 36; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch4_letters_of_marque', giver: 'hester_quaile', town: 'Tollhaven' });
  S.quests.ch4_keepers_light = { st: 3, step: 0, n: [] };
  assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch4_letters_of_marque', giver: 'hester_quaile', town: 'Tollhaven' }, 'the Lamp Fort first: the Isles still to come');
  delete S.quests.ch4_keepers_light; S.quests.ch4_letters_of_marque = { st: 3, step: 0, n: [] };
  const gannet = storyStatus(S, status(sim));
  assert.deepEqual([gannet.kind, gannet.id, gannet.giver, gannet.found], ['next', 'ch4_keepers_light', 'old_gannet', undefined], 'not a found companion: no card to talk from');
  S.quests.ch4_keepers_light = { st: 3, step: 0, n: [] };
  // (v1.151 step 5) Brine Cross, Hester's, after both: it waits for 40, then she has it; held and handed in, Act IV is told
  // as far as it goes (Highmarch, Maren's, is to come)
  assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id: 'ch4_brine_cross', level: 40 });
  S.party[0].level = 40; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'next', id: 'ch4_brine_cross', giver: 'hester_quaile', town: 'Tollhaven' });
  S.quests.ch4_brine_cross = { st: 3, step: 0, n: [] }; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'level', id: 'ch4_seventh_voice', level: 41 });
  // (v1.154 step 6) The Seventh Voice, Maren's (Hester's: v1.154, no chapter waits on a companion): from 41; handed in, Act IV is told
  S.party[0].level = 41; const seventh = storyStatus(S, status(sim)); assert.deepEqual([seventh.kind, seventh.id, seventh.giver], ['next', 'ch4_seventh_voice', 'hester_quaile']);
  S.quests.ch4_seventh_voice = { st: 3, step: 0, n: [] }; assert.deepEqual(storyStatus(S, status(sim)), { kind: 'end', region: 'tidemark' }, 'Act IV is told');
  const C = JSON.parse(readFileSync(new URL('../content/story.json', import.meta.url), 'utf8'));
  for (const id of ['foreman', 'tamsin', 'reachboard', 'showingoff', 'reachchronicle', 'ninthvault']) assert.ok(C.leads[id], id);
  assert.ok(C.nextFound);
  assert.ok(C.end.reach.title && C.end.reach.text && C.leadsTitle.reach);
  assert.ok(C.end.tidemark.title && C.end.tidemark.text);
  for (const id of ['harbourmaster', 'maren', 'hesk', 'lampfort', 'brinecross']) assert.ok(C.leads[id], id);
});
