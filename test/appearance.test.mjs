// A character's look (GDD §6.1 v1.65, src/sim/appearance.js): the choices are the face kit's own (tools/actor-lab/faces.js,
// read from its source: CI hasn't three.js to import it), the sim takes only those, createHero and the temple's restyle
// set it (the restyle for its gold, at a temple only), a sellsword is hired with a look of their own from their id, and the
// look is saved (v39) and a bad one dropped on load.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { PARTS, MARKS, KEYS, RESTYLE_COST, validAppearance, drawAppearance } from '../src/sim/appearance.js';
import { tavernRoster } from '../src/sim/party.js';

const SEED = 20260807;
const src = readFileSync(new URL('../tools/actor-lab/faces.js', import.meta.url), 'utf8').replace(/\/\/[^\n]*/g, '');   // (its comments out: a word before a colon in one isn't a key)
/** the top-level keys of `const NAME = { … }` in faces.js */
function keysOf(name) {
  const at = src.search(new RegExp(`(?:export )?const ${name} = \\{`)); assert.ok(at >= 0, `faces.js: ${name}`);
  let i = src.indexOf('{', at) + 1, depth = 1, word = '', out = [];
  for (; i < src.length && depth; i++) {
    const c = src[i];
    if (c === '{' || c === '[' || c === '(') depth++; else if (c === '}' || c === ']' || c === ')') depth--;
    else if (depth === 1 && c === ':' && word) out.push(word);
    if (/[A-Za-z0-9_]/.test(c)) word += c; else if (c !== ' ' && c !== ':') word = c === "'" ? word : '';
  }
  return out;
}
const options = /OPTIONS = \{([\s\S]*?)\n\};/.exec(src)[1];
const listIn = (part) => { const m = new RegExp(`${part}: \\[([^\\]]*)\\]`).exec(options); return m[1].split(',').map((s) => s.trim().replace(/'/g, '')).map((s) => (s === 'null' ? null : s)).filter((s) => s === null || (s !== '' && !s.startsWith('...'))); };

test("the choices are the face kit's own", () => {
  assert.deepEqual(PARTS.skin, keysOf('SKIN')); assert.deepEqual(PARTS.hairColor, keysOf('HAIR')); assert.deepEqual(PARTS.iris, keysOf('IRIS'));
  assert.deepEqual(PARTS.shape, keysOf('SHAPES')); assert.deepEqual(PARTS.hair, keysOf('HAIRS')); assert.deepEqual(PARTS.eyes, keysOf('EYES'));
  assert.deepEqual(PARTS.brows, keysOf('BROWS')); assert.deepEqual(PARTS.mouth, keysOf('MOUTHS'));
  assert.deepEqual(PARTS.nose, ['kk', ...keysOf('NOSES')]);
  assert.deepEqual(PARTS.beard, listIn('beard')); assert.deepEqual(MARKS, listIn('marks')); assert.deepEqual(PARTS.ears, listIn('ears'));
});

const look = (o = {}) => ({ ...drawAppearance(SEED, 'test'), ...o });
test('the sim takes only a look of the choices', () => {
  assert.ok(validAppearance(look()));
  for (const bad of [null, [], {}, look({ eyes: 'laser' }), look({ build: 'giant' }), look({ marks: ['scar', 'scar'] }), look({ marks: ['scar', 'freckles', 'blush'] }), look({ marks: ['tattoo'] }), { ...look(), extra: 1 }, (() => { const a = look(); delete a.nose; return a; })()])
    assert.equal(validAppearance(bad), false, JSON.stringify(bad));
  for (let i = 0; i < 200; i++) assert.ok(validAppearance(drawAppearance(SEED, `s${i}`)), 'every drawn look is one of the choices');
  assert.deepEqual(Object.keys(look()).sort(), [...KEYS].sort());
});

const town = () => { const s = createSim(SEED, undefined, { scene: 'town' }); s.state.counters.gold = 1000; return s; };
const said = (sim) => { const out = []; sim.bus.on('refused', (r) => out.push(r.reason)); return out; };
const make = (sim, o) => { sim.commands.push({ type: 'createHero', cls: 'mage', look: 'hero_mage', origin: 'thornwick_born', name: 'Ada', ...o }); sim.tick(); };

test('createHero takes the look chosen, and refuses one that is not of the choices', () => {
  const sim = town(), no = said(sim);
  make(sim, { appearance: look({ nose: 'trunk' }) }); assert.equal(sim.state.created, false); assert.equal(no.length, 1);
  const a = look({ hair: 'braid', hairColor: 'copper', build: 'broad', height: 'tall' }); make(sim, { appearance: a });
  assert.deepEqual(sim.state.party[0].appearance, a);
  const plain = town(); make(plain, {}); assert.equal(plain.state.party[0].appearance, undefined, "none chosen: the look's own");
});

test('the temple changes it for its gold; elsewhere, for the same look, or without the gold, nothing', () => {
  const sim = town(), no = said(sim); make(sim, { appearance: look() });
  const a = look({ mouth: 'grin', beard: 'full' }), g0 = sim.state.counters.gold;
  const temple = sim.world.services.find((s) => s.kind === 'temple'); assert.ok(temple, 'the town has a temple');
  sim.commands.push({ type: 'restyle', id: 'you', appearance: a }); sim.tick();
  assert.deepEqual(sim.state.party[0].appearance, a); assert.equal(sim.state.counters.gold, g0 - RESTYLE_COST, `${RESTYLE_COST} gold`);
  sim.commands.push({ type: 'restyle', id: 'you', appearance: a }); sim.tick(); assert.equal(no.at(-1), 'That is the look they have');
  sim.state.counters.gold = RESTYLE_COST - 1; sim.commands.push({ type: 'restyle', id: 'you', appearance: look() }); sim.tick();
  assert.equal(no.at(-1), 'Not enough gold'); assert.deepEqual(sim.state.party[0].appearance, a);
  sim.commands.push({ type: 'restyle', id: 'you', appearance: { ...a, eyes: 'none' } }); sim.tick(); assert.equal(no.at(-1), 'That look is not one of the choices');
  const out = createSim(SEED, undefined, { scene: 'overland' }), no2 = said(out); out.state.counters.gold = 1000;
  out.commands.push({ type: 'createHero', cls: 'mage', look: 'hero_mage', origin: 'thornwick_born', name: 'Ada', appearance: look() }); out.tick();
  out.commands.push({ type: 'restyle', id: 'you', appearance: a }); out.tick(); assert.match(no2.at(-1), /temple/);
});

test('a sellsword comes with a look of their own, the same for the same roster; the tavern draws as before', () => {
  const r1 = tavernRoster(SEED, 'vale', 3, 6), r2 = tavernRoster(SEED, 'vale', 3, 6);
  assert.deepEqual(r1.map((m) => m.appearance), r2.map((m) => m.appearance));
  assert.ok(r1.every((m) => validAppearance(m.appearance)));
  assert.ok(new Set(r1.map((m) => JSON.stringify(m.appearance))).size === r1.length, 'each their own');
  const looks = new Set(); for (let d = 0; d < 40; d++) for (const m of tavernRoster(SEED, 'vale', d, 6)) looks.add(m.appearance.hair + m.appearance.hairColor + m.appearance.shape);
  assert.ok(looks.size > 60, `variety: ${looks.size} hair, colour and shape mixes over 40 rosters`);
});

test('the look is saved (v39); a bad one is dropped on load', () => {
  const sim = town(); make(sim, { appearance: look() });
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  const b = createSim(1); b.restore(snap); assert.deepEqual(b.state.party[0].appearance, look());
  snap.party[0].appearance = { ...look(), hair: 'mohawk' }; const c = createSim(1); c.restore(snap); assert.equal(c.state.party[0].appearance, undefined);
});

test('every choice has its word (content/looks.json), every part its place in the order', () => {
  const w = JSON.parse(readFileSync(new URL('../content/looks.json', import.meta.url), 'utf8'));
  assert.deepEqual([...w.order].sort(), [...KEYS].sort());
  for (const [k, list] of Object.entries(PARTS)) { assert.ok(w.parts[k], k); for (const v of list) assert.ok(w.parts[k].names[String(v)], `${k}: ${v}`); }
  for (const m of MARKS) assert.ok(w.marks.names[m], m);
});

test("gear stays the class's: a mage can't put on plate, a fighter can; the figure only ever wears what equip allowed", async () => {
  const { makeItem } = await import('../src/sim/items.js');
  const sim = town(), no = []; sim.bus.on('gearRefused', (r) => no.push(r.reason)); make(sim, {});   // (a mage: make's default; the bag's refusals are gearRefused)
  sim.state.bag.push(makeItem('plate', 1, 'common', { uid: 'p1' }), makeItem('robes', 1, 'fine', { uid: 'r1' }));
  sim.commands.push({ type: 'equip', member: 'you', uid: 'p1' }); sim.tick();
  assert.match(no.at(-1), /can't use/); assert.equal(sim.state.party[0].gear.armor.base, 'robes', 'still in robes');
  sim.commands.push({ type: 'equip', member: 'you', uid: 'r1' }); sim.tick();
  assert.equal(sim.state.party[0].gear.armor.r, 'fine', 'robes are a mage\'s');
  const f = town(); f.commands.push({ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'thornwick_born', name: 'Tam' }); f.tick();
  f.state.bag.push(makeItem('plate', 1, 'rare', { uid: 'p2' })); f.commands.push({ type: 'equip', member: 'you', uid: 'p2' }); f.tick();
  assert.equal(f.state.party[0].gear.armor.r, 'rare');
});

test("a card's portrait: the baked one while a member looks as baked; their own once their look, helm or armour isn't the kit's", async () => {
  const { portraitKey, setPortraitModels } = await import('../src/ui/portraits.js');
  const { makeItem } = await import('../src/sim/items.js');
  const sim = town(); sim.commands.push({ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'thornwick_born', name: 'Tam' }); sim.tick();
  const m = sim.state.party[0];
  assert.equal(portraitKey(m), 'hero_knight', 'as made: the bake');
  m.gear.weapon = makeItem('greatsword', 3, 'rare', { uid: 'w' }); assert.equal(portraitKey(m), 'hero_knight', "a weapon doesn't show in a head-and-shoulders");
  const k0 = portraitKey({ ...m, gear: { ...m.gear, helm: null } }); assert.match(k0, /^hero_knight#/, 'the helm off: their own');
  const up = { ...m, gear: { ...m.gear, armor: { ...m.gear.armor, r: 'heirloom', up: 4 } } }; assert.equal(portraitKey(up), 'hero_knight', 'the same armour finer: the same portrait');
  m.appearance = look(); const k1 = portraitKey(m); assert.match(k1, /^hero_knight#/);
  assert.notEqual(k1, portraitKey({ ...m, appearance: look({ hair: look().hair === 'bald' ? 'braid' : 'bald' }) }), 'each look its own');
  assert.equal(k1, portraitKey({ ...m, appearance: look() }), 'the same look, the same portrait');
  setPortraitModels(false); assert.equal(portraitKey(m), 'hero_knight', 'no models: the bake'); setPortraitModels(true);
});

test('the helm hidden (showHelm): cosmetic, anywhere, saved (v40); still worn and counted; a bad value does nothing', async () => {
  const { lookOf } = await import('../src/render3d/looks.js');
  const { statsFor } = await import('../src/sim/party.js');
  const sim = createSim(SEED, undefined, { scene: 'overland' });
  sim.commands.push({ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'thornwick_born', name: 'Tam' }); sim.tick();
  const m = sim.state.party[0], def0 = statsFor(m).def; assert.ok(m.gear.helm, 'a knight sets out helmed');
  assert.equal(lookOf(m).a.gear.helm.base, m.gear.helm.base);
  for (const on of ['no', 0, null]) { sim.commands.push({ type: 'showHelm', id: 'you', on }); sim.tick(); assert.equal(m.hideHelm, undefined, String(on)); }
  sim.commands.push({ type: 'showHelm', id: 'you', on: false }); sim.tick();
  assert.equal(m.hideHelm, true); assert.equal(lookOf(m).a.gear.helm, null, 'the figure bareheaded');
  assert.ok(m.gear.helm, 'the helm still worn'); assert.equal(statsFor(m).def, def0, 'and still counts');
  const snap = JSON.parse(JSON.stringify(sim.snapshot())); const b = createSim(1); b.restore(snap); assert.equal(b.state.party[0].hideHelm, true);
  snap.party[0].hideHelm = 'yes'; const c = createSim(1); c.restore(snap); assert.equal(c.state.party[0].hideHelm, undefined);
  sim.commands.push({ type: 'showHelm', id: 'you', on: true }); sim.tick(); assert.equal(m.hideHelm, undefined); assert.ok(lookOf(m).a.gear.helm);
});
