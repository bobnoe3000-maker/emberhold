// Named NPCs and talking (M4 slice 1: Maudry Fenn). Where she stands, walking over to talk, the
// effects a conversation may make (and the ones it may not), flags in the save, the sim's NPC
// table against content/npcs/*.json and the Ink, and the story adapter's tag handling.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { NPCS, TALK_REACH } from '../src/sim/npcs.js';
import { isWalkable } from '../src/sim/world.js';
import { createStoryBook, parseTag } from '../src/story/adapter.js';

const town = (region = 'vale') => createSim(20260807, undefined, { scene: 'town', region });
const events = (sim, names) => { const ev = []; for (const e of names) sim.bus.on(e, (d) => ev.push({ e, ...d })); return ev; };
const run = (sim, ticks, until = () => false) => { for (let i = 0; i < ticks && !until(); i++) sim.tick(); };
const next = (sim, x, y) => { const p = sim.state.player; p.x = p.px = x; p.y = p.py = y; };
const talkNow = (sim) => { const n = sim.world.npcs[0]; next(sim, n.x + 1, n.y - 1); sim.commands.push({ type: 'talk', npc: n.id }); sim.tick(); };

test('Thornwick\'s people stand in Thornwick: the named on tiles you walk round, townsfolk you pass; nowhere else', () => {
  const sim = town(), [m] = sim.world.npcs;
  assert.equal(m.id, 'maudry_fenn');
  assert.deepEqual(sim.world.npcs.map((n) => n.id).sort(), Object.keys(NPCS).filter((k) => NPCS[k].region === 'vale' && !NPCS[k].found).sort(), 'all nine (a found companion waits in his dungeon)');
  for (const n of sim.world.npcs) assert.equal(isWalkable(sim.world, n.x, n.y), !!n.folk, `${n.id}: ${n.folk ? 'a walker' : 'solid'}`);
  const again = town().world.npcs; assert.deepEqual(again.map((n) => [n.id, n.x, n.y]), sim.world.npcs.map((n) => [n.id, n.x, n.y]));   // the same spots every time
  for (const region of ['fens', 'reach', 'heights']) assert.equal(town(region).world.npcs.length, 0);
  assert.equal(createSim(1, undefined, { scene: 'overland' }).world.npcs.length, 0);
  assert.equal(createSim(1, undefined, { scene: 'dungeon' }).world.npcs.length, 0);
});

test('tap her from across the square: the hero walks up beside her, then she talks', () => {
  const sim = town(), ev = events(sim, ['dialogue']), m = sim.world.npcs[0];
  sim.commands.push({ type: 'talk', npc: 'maudry_fenn' });
  run(sim, 20 * 20, () => ev.length);
  assert.equal(ev.length, 1, 'no dialogue after 20 s');
  const p = sim.state.player; assert.ok(Math.hypot(p.x - m.x, p.y - m.y) <= TALK_REACH);
  assert.equal(ev[0].npc, 'maudry_fenn'); assert.equal(ev[0].knot, 'maudry_hub');
  const v = ev[0].vars; assert.equal(v.hero_name, sim.state.party[0].name); assert.equal(v.flag_met_maudry, 0); assert.equal(v.party_size, 1); assert.equal(v.fallen_name, '');
});

test('in reach she answers at once; nobody, or somebody from elsewhere, does not', () => {
  const sim = town(), ev = events(sim, ['dialogue']);
  talkNow(sim); assert.equal(ev.length, 1);
  sim.commands.push({ type: 'talk', npc: 'osric_hale' }); sim.tick();
  const far = createSim(20260807, undefined, { scene: 'overland' }), ev2 = events(far, ['dialogue', 'noPath']);
  far.commands.push({ type: 'talk', npc: 'maudry_fenn' }); run(far, 40);
  assert.equal(ev.length, 1); assert.equal(ev2.length, 0);
});

test('a conversation may set only its own flags, only while it is open', () => {
  const sim = town(), ev = events(sim, ['flagChanged', 'talkEnded']), fx = (args, tag = 'flag') => { sim.commands.push({ type: 'dialogueEffect', tag, args }); sim.tick(); };
  fx(['set', 'met_maudry']); assert.deepEqual(sim.state.flags, {}, 'no talk open');
  talkNow(sim);
  fx(['set', 'met_ilse']); fx(['set', 'anything']); fx(['add', 'met_maudry', 'lots']); fx(['gold', '500'], 'give'); fx(null);
  assert.deepEqual(sim.state.flags, {});
  assert.equal(sim.state.counters.gold, 0);
  fx(['set', 'met_maudry']); fx(['set', 'met_maudry']);
  assert.deepEqual(sim.state.flags, { met_maudry: 1 });
  assert.equal(ev.filter((e) => e.e === 'flagChanged').length, 1);
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  assert.equal(ev.filter((e) => e.e === 'talkEnded').length, 1);
  sim.state.flags = {}; fx(['set', 'met_maudry']); assert.deepEqual(sim.state.flags, {}, 'after endTalk');
});

test('walking off ends the conversation', () => {
  const sim = town(), ev = events(sim, ['talkEnded']), m = sim.world.npcs[0];
  talkNow(sim);
  next(sim, m.x + 8, m.y + 8); sim.tick();
  assert.equal(ev.length, 1);
  sim.commands.push({ type: 'dialogueEffect', tag: 'flag', args: ['set', 'met_maudry'] }); sim.tick();
  assert.deepEqual(sim.state.flags, {});
});

test('flags survive a save; saves from before flags load with none', () => {
  const sim = town(); talkNow(sim);
  sim.commands.push({ type: 'dialogueEffect', tag: 'flag', args: ['set', 'met_maudry'] }); sim.tick();
  const data = JSON.parse(JSON.stringify(sim.snapshot()));
  assert.deepEqual(data.flags, { met_maudry: 1 });
  const b = town(); b.restore(data); assert.deepEqual(b.state.flags, { met_maudry: 1 });
  const old = { ...data }; delete old.flags; b.restore(old); assert.deepEqual(b.state.flags, {});
  b.restore({ ...data, flags: { met_maudry: 'yes', x: 2 } }); assert.deepEqual(b.state.flags, { x: 2 });   // only numbers are read back
  const ev = events(b, ['dialogue']); talkNow(b); assert.equal(ev[0].vars.flag_met_maudry, 0);
});

// ── the sim's table against the content ─────────────────────────────────────
const defs = readdirSync('content/npcs').filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`content/npcs/${f}`, 'utf8')));
const REGION_TOWN = { vale: 'thornwick', fens: 'saltmere', reach: 'ashgate', heights: 'frosthold' };

test('content/npcs matches the sim table (ids, region, town, entry knot); looks are baked', () => {
  assert.deepEqual(defs.map((d) => d.id).sort(), Object.keys(NPCS).sort());
  for (const d of defs) {
    const n = NPCS[d.id];
    assert.equal(d.region, n.region, d.id); assert.equal(d.town, REGION_TOWN[n.region], d.id); assert.equal(d.knot, n.knot, d.id);
    for (const a of [d.look, d.portrait || d.look]) assert.ok(existsSync(`assets/actors/${a}.json`) && existsSync(`assets/actors/${a}.alb.png`), `${d.id}: no atlas ${a}`);
  }
});

test('every Ink file opens at its entry knot, and every flag it sets is one the sim allows', async () => {
  for (const d of defs) {
    const ink = readFileSync(`content/dialogue/${d.dialogue}.ink`, 'utf8');
    const speakers = defs.filter((q) => q.dialogue === d.dialogue).flatMap((q) => NPCS[q.id].flags);   // (townsfolk share one file)
    for (const [, name] of ink.matchAll(/#\s*flag:\s*\w+\s+(\w+)/g)) assert.ok(speakers.includes(name), `${d.dialogue}.ink sets flag ${name}, which nobody speaking from it may set`);
    for (const f of NPCS[d.id].flags) assert.match(ink, new RegExp(`VAR flag_${f} =`), `${d.dialogue}.ink doesn't declare flag_${f}`);
    const book = createStoryBook(async (f) => readFileSync(`content/dialogue/${f}.json`, 'utf8'));
    const c = await book.open(d.dialogue, d.knot, {}, () => {});
    assert.ok(c.first.lines.length > 0, `${d.id}: says nothing`);
  }
});

// a beat that waits after a line with effects carries on with the sim's variables (here: the same ones), as the window does
const settle = (c, b, vars) => { const lines = [...b.lines]; while (b.waiting) { b = c.resume(vars); lines.push(...b.lines); } return { ...b, lines }; };

test('the story adapter: tags become commands, windows come back, presentation is dropped', async () => {
  assert.deepEqual(parseTag('flag: set met_maudry'), { tag: 'flag', args: ['set', 'met_maudry'] });
  assert.deepEqual(parseTag(' service:tavern'), { tag: 'service', args: ['tavern'] });
  assert.equal(parseTag('just words'), null);
  const book = createStoryBook(async (f) => readFileSync(`content/dialogue/${f}.json`, 'utf8'));
  const pushed = [];
  const origins = {};
  for (const origin of ['thornwick_born', 'redhand_deserter', 'grey_sisters_ward', 'deepdelver_fostered', '']) {
    const vars = { hero_name: 'Tam', hero_origin: origin, flag_met_maudry: 0, road_ranks: 0 };   // (with the road held she goes on about it after: road.test.mjs)
    const c = await book.open('maudry', 'maudry_hub', vars, (cmd) => pushed.push(cmd));
    assert.ok(c.first.waiting, 'meeting her is an effect: the beat waits for the sim');
    origins[origin] = settle(c, c.first, vars).lines.at(-1);
    assert.deepEqual(pushed.at(-1), { type: 'dialogueEffect', tag: 'flag', args: ['set', 'met_maudry'] });
  }
  assert.equal(new Set(Object.values(origins)).size, 5, 'a line per origin');
  assert.match(origins.thornwick_born, /knew your mother/);
  // returning with a Fallen companion: she notices; the hiring board is a window, not a command
  const c = await book.open('maudry', 'maudry_hub', { hero_name: 'Tam', flag_met_maudry: 1, fallen_name: 'Brin' }, (cmd) => pushed.push(cmd));
  assert.match(c.first.lines.join(' '), /No Brin today/); assert.equal(c.first.waiting, 0);
  const n = pushed.length, hire = c.choose(c.first.choices.findIndex((ch) => /hire/i.test(ch.text)));
  const board = c.choose(hire.choices.findIndex((ch) => /board/i.test(ch.text)));
  assert.deepEqual(board.windows, [{ tag: 'service', args: ['tavern'] }]); assert.equal(board.ended, true); assert.equal(pushed.length, n);
});

test('quest choices are marked for the window, and the mark never reaches the sim', async () => {
  const book = createStoryBook(async (f) => readFileSync(`content/dialogue/${f}.json`, 'utf8'));
  const pushed = [], marks = (b) => b.choices.map((ch) => ch.mark.join(' '));
  const offer = await book.open('maudry', 'maudry_hub', { hero_name: 'Tam', flag_met_maudry: 1, q_vale_long_way_round: 0 }, (cmd) => pushed.push(cmd));
  assert.deepEqual(marks(offer.first).filter(Boolean), ['quest'], 'the offer, and nothing else');
  assert.ok(offer.first.choices.every((ch) => !ch.mark.length || !/#/.test(ch.text)), 'the tag is not in the text');
  const ask = offer.choose(offer.first.choices.findIndex((ch) => ch.mark[0] === 'quest'));
  assert.deepEqual(marks(ask), ['quest', ''], "I'll see to it / Not today");
  const ready = await book.open('maudry', 'maudry_hub', { hero_name: 'Tam', flag_met_maudry: 1, q_vale_long_way_round: 2 }, (cmd) => pushed.push(cmd));
  assert.deepEqual(marks(ready.first).filter(Boolean), ['quest ready']);
  assert.ok(pushed.every((c) => c.tag !== 'mark'));
});

// ── townsfolk keep a routine (world doc §5, v1.6) ────────────────────────────
import { partOf, PART_S } from '../src/sim/npcs.js';
test('townsfolk keep a routine: at each part of the day they walk to that part\'s spot; a town built later has them there already', () => {
  const sim = town(), w = () => sim.world.npcs.find((n) => n.id === 'wendel');
  assert.equal(partOf(sim.state.t), 0); assert.equal(w().at, 0);
  const home = { x: w().x, y: w().y };
  sim.state.t = 3 * PART_S;                                      // night: Wendel's at the Mule
  let moved = 0; for (let i = 0; i < 20 * 90 && (w().path || moved === 0); i++) { sim.tick(); if (w().moving) moved++; }
  assert.equal(w().at, 1); assert.ok(moved > 20, 'he walked'); assert.equal(w().path, null);
  const there = w().spots[1]; assert.ok(Math.hypot(w().x - there.x, w().y - there.y) < 0.01, 'and got there');
  assert.ok(Math.hypot(home.x - there.x, home.y - there.y) > 3);
  const later = createSim(20260807, undefined, { scene: 'overland' }); later.state.t = 3 * PART_S;
  const data = JSON.parse(JSON.stringify(later.snapshot())), c = town(); c.restore({ ...data, scene: 'town', player: { x: 0, y: 0 } });
  const w2 = c.world.npcs.find((n) => n.id === 'wendel'); assert.equal(w2.at, 1); assert.ok(Math.hypot(w2.x - there.x, w2.y - there.y) < 0.01, 'built at night: already at the Mule');
});
test('a townsperson you\'re talking to waits; Osric and Ilse answer where they stand', () => {
  const sim = town(), ev = events(sim, ['dialogue']);
  for (const id of ['osric_hale', 'sister_ilse', 'hedda']) {
    sim.commands.push({ type: 'endTalk' }); sim.tick();
    sim.commands.push({ type: 'talk', npc: id }); run(sim, 20 * 30, () => ev.some((e) => e.npc === id));
    assert.ok(ev.some((e) => e.npc === id && e.knot === NPCS[id].knot), `${id} answers`);
  }
  const h = sim.world.npcs.find((n) => n.id === 'hedda'), at = [h.x, h.y]; sim.state.t = 2 * PART_S; run(sim, 40);
  assert.deepEqual([h.x, h.y], at, 'she waits while you talk');
  sim.commands.push({ type: 'endTalk' }); run(sim, 40); assert.notDeepEqual([h.x, h.y], at, 'then goes');
});

// ── room to be told apart, and strolls (a tap picks one person; the square has life in it) ──
import { apart } from '../src/sim/npcs.js';
const townAt = (part, seed = 20260807) => { const t = createSim(seed, undefined, { scene: 'overland' }); t.state.t = part * PART_S; const d = JSON.parse(JSON.stringify(t.snapshot())); const c = createSim(seed, undefined, { scene: 'town' }); c.restore({ ...d, scene: 'town', player: { x: 0, y: 0 } }); return c; };
test('everyone keeps apart on screen, at every part of the day, strolls included (Col and Jory stood by Maudry\'s door)', () => {
  for (const seed of [20260807, 7, 99991]) for (let part = 0; part < 4; part++) {
    const n = townAt(part, seed).world.npcs;
    for (let i = 0; i < n.length; i++) for (let j = i + 1; j < n.length; j++) {
      const A = n[i].folk ? n[i].roam.flat() : [n[i]], B = n[j].folk ? n[j].roam.flat() : [n[j]];
      assert.ok(A.every((a) => B.every((b) => apart(a, b))), `seed ${seed} part ${part}: ${n[i].id} and ${n[j].id} can overlap`);
    }
  }
});
test('townsfolk stroll about their spot between the day\'s changes, and keep still while you stand beside them', () => {
  const sim = town(), folk = sim.world.npcs.filter((n) => n.folk), start = new Map(folk.map((n) => [n.id, [n.x, n.y]])), walked = new Set();
  const p = sim.state.player; p.x = p.px = 0; p.y = p.py = 0;
  for (let i = 0; i < 20 * 30; i++) { sim.tick(); for (const n of folk) if (n.moving) walked.add(n.id); }
  assert.equal(walked.size, folk.length, `in 30 s of one part of the day, walked: ${[...walked].join(', ')}`);
  for (const n of folk) { const home = n.spots[n.at]; assert.ok(Math.abs(n.x - home.x) <= 3.5 && Math.abs(n.y - home.y) <= 3.5, `${n.id} stays near its spot`); }
  const h = folk.find((n) => n.id === 'hedda'); for (let i = 0; i < 20 * 20 && h.path; i++) sim.tick();
  p.x = p.px = h.x + 1; p.y = p.py = h.y; const at = [h.x, h.y];
  for (let i = 0; i < 20 * 30; i++) { p.x = p.px = h.x + 1; sim.tick(); }
  assert.deepEqual([h.x, h.y], at, 'she keeps still beside you');
  assert.ok(start.size);
});
