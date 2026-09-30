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

test('Maudry stands in Thornwick, on a tile you walk round; nowhere else', () => {
  const sim = town(), [m] = sim.world.npcs;
  assert.equal(sim.world.npcs.length, 1); assert.equal(m.id, 'maudry_fenn');
  assert.equal(isWalkable(sim.world, m.x, m.y), false);
  const again = town().world.npcs[0]; assert.deepEqual([again.x, again.y], [m.x, m.y]);   // the same spot every time
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
    for (const [, name] of ink.matchAll(/#\s*flag:\s*\w+\s+(\w+)/g)) assert.ok(NPCS[d.id].flags.includes(name), `${d.dialogue}.ink sets flag ${name}, which ${d.id} may not`);
    for (const f of NPCS[d.id].flags) assert.match(ink, new RegExp(`VAR flag_${f} =`), `${d.dialogue}.ink doesn't declare flag_${f}`);
    const book = createStoryBook(async (f) => readFileSync(`content/dialogue/${f}.json`, 'utf8'));
    const c = await book.open(d.dialogue, d.knot, {}, () => {});
    assert.ok(c.first.lines.length > 0, `${d.id}: says nothing`);
  }
});

test('the story adapter: tags become commands, windows come back, presentation is dropped', async () => {
  assert.deepEqual(parseTag('flag: set met_maudry'), { tag: 'flag', args: ['set', 'met_maudry'] });
  assert.deepEqual(parseTag(' service:tavern'), { tag: 'service', args: ['tavern'] });
  assert.equal(parseTag('just words'), null);
  const book = createStoryBook(async (f) => readFileSync(`content/dialogue/${f}.json`, 'utf8'));
  const pushed = [];
  const origins = {};
  for (const origin of ['thornwick_born', 'redhand_deserter', 'grey_sisters_ward', 'deepdelver_fostered', '']) {
    const c = await book.open('maudry', 'maudry_hub', { hero_name: 'Tam', hero_origin: origin, flag_met_maudry: 0 }, (cmd) => pushed.push(cmd));
    origins[origin] = c.first.lines.at(-1);
    assert.deepEqual(pushed.at(-1), { type: 'dialogueEffect', tag: 'flag', args: ['set', 'met_maudry'] });
  }
  assert.equal(new Set(Object.values(origins)).size, 5, 'a line per origin');
  assert.match(origins.thornwick_born, /knew your mother/);
  // returning with a Fallen companion: she notices; the hiring board is a window, not a command
  const c = await book.open('maudry', 'maudry_hub', { hero_name: 'Tam', flag_met_maudry: 1, fallen_name: 'Brin' }, (cmd) => pushed.push(cmd));
  assert.match(c.first.lines.join(' '), /No Brin today/);
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
