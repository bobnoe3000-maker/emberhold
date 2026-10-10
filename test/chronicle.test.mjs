// The Vale Chronicle, whole (M5, docs/m5-plan.md §7; world doc §7 v1.7–v1.8): ten fragments across the
// Old Barrows, Wickham Keep and the Sunken Chapel (v1.48, one dungeon a level: the Tithe Mill's ledger is in the Keep's
// strongroom now); three are carried by bosses (Garrow's Last Dispatch, the Chaplain's Last Page under the Stranger,
// the Standard's Ribbon). The last found reveals the Ninth Milestone, whose hall keeps The Last Order in a vault chest,
// once; (v1.48) a secret site seals for SECRET_REST of play each time its vault is opened.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { FRAGMENTS, SETS, HALL_WAVES, holderOf, SET_REVEALS } from '../src/sim/lore.js';
import { SITES, SECRET_REST } from '../src/sim/sites.js';
import { isWalkable } from '../src/sim/world.js';
import { createStoryBook } from '../src/story/adapter.js';

const SEED = 20260807;
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const at = (sim, site, depth) => sim.restore({ ...snap(sim), scene: 'dungeon', site, depth, floors: [] });
const events = (sim, names) => { const out = []; for (const n of names) sim.bus.on(n, (e) => out.push({ n, ...e })); return out; };

test('ten in reading order a set (the Vale\'s, the Fens\'); every one lies somewhere on its floor, for any seed', () => {
  assert.deepEqual(Object.keys(SETS), ['vale', 'fens']); assert.deepEqual(Object.keys(SET_REVEALS), ['vale', 'fens']);
  for (const set of Object.keys(SETS)) {
    assert.equal(SETS[set].length, 10); assert.deepEqual(SETS[set].map((id) => FRAGMENTS[id].order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.equal(SITES[SET_REVEALS[set]].hidden, true); assert.equal(SITES[SET_REVEALS[set]].region, set, 'its own land\'s hidden site');
    assert.ok(SETS[set].every((id) => SITES[FRAGMENTS[id].site].region === set), `${set}: found in its own land`);
  }
  for (const seed of [SEED, 7, 99991]) for (const id of [...SETS.vale, ...SETS.fens]) {
    const f = FRAGMENTS[id], sim = createSim(seed, undefined, { scene: 'dungeon', site: f.site });
    at(sim, f.site, f.floor - 1);
    const h = holderOf(seed, id, sim.world, {});
    assert.ok(h, `${id} on ${f.site} floor ${f.floor}`);
    if (h.key) assert.equal(sim.world.props.get(h.key), h.via, `${id}: its ${h.via} is there`);
    if (f.via === 'boss') assert.equal(h.via, 'boss');
    at(sim, f.site, f.floor === 1 ? 1 : 0);
    assert.equal(holderOf(seed, id, sim.world, {}), null, `${id}: not on another floor`);
  }
});

test('the bosses carry theirs: found when they fall on their floor; one who fell in an older save left it in his hall', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }), ev = events(sim, ['fragmentFound']);
  at(sim, 'wickham_keep', 2);                                                                   // (v1.48: Garrow's hall is the Keep's third floor)
  sim.bus.emit('bossDown', { id: 'robed_stranger' }); assert.equal(ev.length, 0, 'the wrong boss');
  sim.bus.emit('bossDown', { id: 'goblin_chief' }); assert.equal(ev.length, 0, 'the Keep\'s other boss carries none');
  sim.state.bosses.redhand_captain = 1; sim.bus.emit('bossDown', { id: 'redhand_captain', first: true });
  assert.deepEqual(ev.map((e) => e.id), ['frag_vale_last_dispatch']);
  at(sim, 'sunken_chapel', 2); sim.bus.emit('bossDown', { id: 'standard' }); assert.equal(ev.at(-1).id, 'frag_vale_standards_ribbon');   // (the Standard: the Chapel's third floor)
  // an older save: the Stranger already fell before his page was in the table
  const old = createSim(SEED, undefined, { scene: 'town' }), oev = events(old, ['fragmentFound']);
  old.state.bosses.robed_stranger = 1; at(old, 'sunken_chapel', 1);
  assert.deepEqual(old.lore.holder('frag_vale_chaplains_last_page'), { via: 'hall' });
  const hall = old.world.level.descentRoom.id; old.bus.emit('battle', { on: true, room: hall });
  for (let i = 0; i < HALL_WAVES; i++) old.bus.emit('wave', { cleared: true, room: hall });
  // his page, and whatever else this floor keeps in its hall (a shrine's fragment, on a floor drawn without a shrine)
  assert.ok(oev.some((e) => e.id === 'frag_vale_chaplains_last_page'));
  for (const e of oev) assert.deepEqual(old.lore.holder(e.id), { via: 'hall' }, e.id);
});

test('the last one found reveals the Ninth Milestone', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }), ev = events(sim, ['setComplete', 'siteRevealed']);
  sim.state.fragments = SETS.vale.filter((id) => id !== 'frag_vale_tithe_ledger');
  assert.ok(!sim.state.revealed.has('ninth_milestone'));
  at(sim, 'wickham_keep', 1);                                                                    // (v1.48: the ledger's in the Keep's strongroom)
  const h = sim.lore.holder('frag_vale_tithe_ledger');
  if (h.via === 'chest') { const [x, y] = h.key.split(',').map(Number); sim.bus.emit('looted', { tx: x, ty: y, kind: 'chest' }); }
  else { const hall = sim.world.level.descentRoom.id; sim.bus.emit('battle', { on: true, room: hall }); for (let i = 0; i < HALL_WAVES; i++) sim.bus.emit('wave', { cleared: true, room: hall }); }
  assert.deepEqual(ev.map((e) => e.n).sort(), ['setComplete', 'siteRevealed']); assert.equal(ev.find((e) => e.n === 'siteRevealed').site, 'ninth_milestone');
  assert.ok(sim.state.revealed.has('ninth_milestone'));
});

test('the Ninth Milestone\'s vault: a chest in its hall with The Last Order, once', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); sim.state.party[0].level = 9;
  sim.state.revealed.add('ninth_milestone'); at(sim, 'ninth_milestone', 0);
  const v = sim.world.vault, L = sim.world.level; assert.ok(v, 'a vault');
  const [x, y] = v.key.split(',').map(Number);
  assert.equal(v.heirloom, 'last_order'); assert.equal(L.cells.get(v.key).room, L.descentRoom.id, 'in the hall');
  assert.equal(sim.world.props.get(v.key), 'chest'); assert.ok(isWalkable(sim.world, x + 0.5, y + 1.5), 'you can walk up to it');
  const p = sim.state.player; p.x = p.px = x + 0.5; p.y = p.py = y + 1.5;
  sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick();
  const got = () => sim.state.bag.filter((it) => it.name === 'The Last Order');
  assert.equal(got().length, 1); assert.equal(got()[0].r, 'heirloom'); assert.equal(sim.state.flags.vault_ninth_milestone, 1);
  const back = createSim(SEED, undefined, { scene: 'town' }); back.restore(snap(sim)); at(back, 'ninth_milestone', 0);
  const q = back.state.player; q.x = q.px = x + 0.5; q.y = q.py = y + 1.5;
  back.commands.push({ type: 'harvest', tx: x, ty: y }); back.tick();
  assert.equal(back.state.bag.filter((it) => it.name === 'The Last Order').length, 1, 'a later visit: an ordinary chest');
  const none = createSim(SEED, undefined, { scene: 'dungeon', site: 'wickham_keep' }); at(none, 'wickham_keep', 2); assert.equal(none.world.vault, undefined, 'only a vault site');
});

// (v1.48, one dungeon a level: GDD §3, world doc v1.32 §3.1; sites.js SECRET_REST, core.js) a secret site is a land's
// once-in-a-while: opening its vault seals it for two hours of play (its door says so, and doesn't let you in); then it
// can be walked again, on a fresh floor, its vault an ordinary chest; the heirloom came once
test('a secret site seals for SECRET_REST of play once its vault is opened, its door refusing you; then it opens again; the heirloom once', () => {
  assert.equal(SECRET_REST, 7200, 'two hours of play');
  assert.deepEqual(Object.keys(SITES).filter((k) => SITES[k].secret), ['ninth_milestone', 'reedholm_undercroft']);
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); sim.state.party[0].level = 9;
  const ev = events(sim, ['secretSealed', 'siteSealed', 'vaultOpened']), sealedAt = []; sim.bus.on('secretSealed', () => sealedAt.push(sim.state.t));
  sim.state.revealed.add('ninth_milestone'); at(sim, 'ninth_milestone', 0);
  sim.bus.emit('looted', { kind: 'chest', tx: 0, ty: 0 }); assert.deepEqual(sim.state.secrets, {}, 'another chest: no seal');
  const loot = () => { const [x, y] = sim.world.vault.key.split(',').map(Number), p = sim.state.player; p.x = p.px = x + 0.5; p.y = p.py = y + 1.5; sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick(); };
  loot();
  const sealed = ev.filter((e) => e.n === 'secretSealed'); assert.equal(sealed.length, 1, 'the vault opened: it seals');
  assert.equal(sealed[0].site, 'ninth_milestone'); assert.equal(sealed[0].until, sealedAt[0] + SECRET_REST);
  const until = sim.state.secrets.ninth_milestone; assert.equal(until, sealed[0].until);
  assert.equal(sim.state.bag.filter((it) => it.name === 'The Last Order').length, 1);
  const back = createSim(1); back.restore(snap(sim)); assert.deepEqual(back.state.secrets, { ninth_milestone: until }, 'a save keeps the seal');
  // out on the Vale: its door refuses you while it rests, and says for how long
  sim.restore({ ...snap(sim), scene: 'overland', region: 'vale', floors: [] }); sim.tick();
  const door = sim.world.exits.find((x) => x.site === 'ninth_milestone'), p = sim.state.player;
  p.x = p.px = (door.x0 + door.x1) / 2; p.y = p.py = (door.y0 + door.y1) / 2; for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.world.kind, 'overland', 'sealed: no way in');
  const said = ev.filter((e) => e.n === 'siteSealed'); assert.equal(said.length, 1, 'said once'); assert.equal(said[0].site, 'ninth_milestone');
  assert.equal(said[0].mins, Math.ceil((until - sim.state.t) / 60)); assert.ok(said[0].mins > 100, `${said[0].mins} minutes`);
  sim.state.t = until - 0.5; sim.tick(); assert.equal(sim.world.kind, 'overland', 'not a moment early');
  for (let i = 0; i < 20 && sim.world.kind === 'overland'; i++) sim.tick();
  assert.equal(sim.world.kind, 'dungeon', 'its rest over, the door lets you in'); assert.equal(sim.world.site, 'ninth_milestone');
  assert.ok(sim.state.t >= until);
  // the vault again: no second heirloom, and it seals once more
  loot();
  assert.equal(sim.state.bag.filter((it) => it.name === 'The Last Order').length, 1, 'the heirloom came once');
  assert.equal(sim.state.flags.vault_ninth_milestone, 1); assert.equal(ev.filter((e) => e.n === 'vaultOpened').length, 1);
  assert.equal(ev.filter((e) => e.n === 'secretSealed').length, 2, 'sealed again');
  assert.equal(sim.state.secrets.ninth_milestone, sealedAt[1] + SECRET_REST);
});

test('content: each new fragment\'s words are canon; Ilse reads the whole set and sends you to the milestone', async () => {
  const world = readFileSync('docs/emberfall-world.md', 'utf8').replace(/\s+/g, ' ');
  for (const id of SETS.vale.slice(3)) { const d = JSON.parse(readFileSync(`content/lore/${id}.json`, 'utf8')); assert.ok(world.includes(d.text), `${id}: canon`); }
  const book = createStoryBook(async (f) => JSON.parse(readFileSync(`content/dialogue/${f}.json`, 'utf8')));
  const all = Object.fromEntries(SETS.vale.map((id) => [id, 1]));
  const c = await book.open('ilse', 'ilse_hub', { hero_name: 'Tam', flag_met_ilse: 1, fallen_name: '', frag_vale_count: 10, ...all }, () => {});
  const b = c.choose(c.first.choices.find((x) => x.text.startsWith('Read me the Chronicle')).index);
  const text = b.lines.join(' ');
  assert.match(text, /Stand down/); assert.match(text, /ninth milestone of the Wickham road/); assert.match(text, /It's on your map now/);
});

// ── the Fens set (M8 slice 10; world doc §7 v1.30): the last found reveals the Reedholm Undercroft, whose hall keeps
// The Fair Copy; the Toadking and the Abbess carry theirs; Ilse reads it, and sends you to Mother Agnes for the key ──
test('the Fens set: the bosses carry theirs; the last found reveals the Undercroft, whose vault keeps The Fair Copy, once', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }), ev = events(sim, ['fragmentFound', 'siteRevealed']); sim.tick(); sim.state.party[0].level = 18;
  at(sim, 'toadking_mound', 2); sim.state.bosses.toadking = 1; sim.bus.emit('bossDown', { id: 'toadking', first: true });   // (v1.48: the Boat Hall is the Mound's third floor)
  at(sim, 'drowned_abbey', 2); sim.state.bosses.abbess_below = 1; sim.bus.emit('bossDown', { id: 'abbess_below', first: true });
  assert.deepEqual(ev.filter((e) => e.n === 'fragmentFound').map((e) => e.id), ['frag_fens_tithe_plate', 'frag_fens_last_hour']);
  sim.state.fragments.push(...SETS.fens.filter((id) => !sim.state.fragments.includes(id) && id !== 'frag_fens_sluice_book'));
  assert.ok(!sim.state.revealed.has('reedholm_undercroft'));
  at(sim, 'canal_locks', 1); const hall = sim.world.level.descentRoom.id;
  sim.bus.emit('battle', { on: true, room: hall }); for (let i = 0; i < HALL_WAVES; i++) sim.bus.emit('wave', { cleared: true, room: hall });
  assert.equal(ev.at(-1).site, 'reedholm_undercroft', 'the Sluice-Book, last: the Undercroft revealed');
  at(sim, 'reedholm_undercroft', 0);
  const v = sim.world.vault; assert.ok(v); assert.equal(v.heirloom, 'the_fair_copy');
  const [x, y] = v.key.split(',').map(Number), p = sim.state.player; p.x = p.px = x + 0.5; p.y = p.py = y + 1.5;
  sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick(); sim.commands.push({ type: 'harvest', tx: x, ty: y }); sim.tick();
  assert.equal(sim.state.bag.filter((it) => it.name === 'The Fair Copy').length, 1);
  assert.ok(sim.state.secrets.reedholm_undercroft > sim.state.t, 'and it seals behind you, as the Milestone does');
});

test('content: the Fens set is canon; Ilse reads it whole and sends you to Agnes, who has the key', async () => {
  const world = readFileSync('docs/emberfall-world.md', 'utf8').replace(/\s+/g, ' ');
  for (const id of SETS.fens) { const d = JSON.parse(readFileSync(`content/lore/${id}.json`, 'utf8')); assert.ok(world.includes(d.text), `${id}: canon`); assert.equal(d.region, 'fens'); }
  const book = createStoryBook(async (f) => JSON.parse(readFileSync(`content/dialogue/${f}.json`, 'utf8')));
  const all = Object.fromEntries(SETS.fens.map((id) => [id, 1]));
  const c = await book.open('ilse', 'ilse_hub', { hero_name: 'Tam', flag_met_ilse: 1, fallen_name: '', frag_fens_count: 10, ...all }, () => {});
  const text = c.choose(c.first.choices.find((x) => x.text.startsWith('Read me what we found in the Fens')).index).lines.join(' ');
  assert.match(text, /We kept the hours/); assert.match(text, /Mother Agnes has the key/);
  const a = await book.open('agnes', 'agnes_hub', { hero_name: 'Tam', flag_met_agnes: 1, fallen_name: '', frag_fens_count: 10 }, () => {});
  assert.match(a.choose(a.first.choices.find((x) => /Fens' Chronicle/.test(x.text)).index).lines.join(' '), /The key's on the nail by the door/);
});
