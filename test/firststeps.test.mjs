// The first steps' cards (GDD §6.1 v1.64, content/firststeps.json, src/ui/firststeps.js): the eight the owner asked for
// (walking, your hero and its windows, the compass, the quest log, the world map, the main menu, the square, the first
// errand), each one ringing an element the game has, short enough for a phone. (The browser suite reads them through.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const steps = JSON.parse(readFileSync(new URL('../content/firststeps.json', import.meta.url), 'utf8')).steps;
const src = ['index.html', 'src/ui/party.js', 'src/ui/compass.js', 'src/ui/journal.js', 'src/ui/worldmap.js', 'src/ui/townmenu.js']
  .map((f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8')).join('\n');

test('the opening square: the cards asked for, in order, each on something the game has', () => {
  assert.deepEqual(steps.map((s) => s.id), ['move', 'hero', 'compass', 'journal', 'map', 'menu', 'square', 'errand']);
  for (const s of steps) {
    if (!s.at) continue;
    const id = /^#([A-Za-z]+)/.exec(s.at)[1];
    assert.ok(src.includes(`id="${id}"`) || src.includes(`id = '${id}'`), `${s.id}: #${id} is the game's`);
  }
  assert.ok(steps.every((s) => s.text.length <= 320 && s.title.length <= 32), 'short enough for a phone');
  assert.ok(/Maudry/.test(steps.at(-1).text), 'the first errand says who');
});

// the first-open cards (docs/first-steps-plan.md §3; the owner: "do 3"): one for each window the plan lists, each asked
// for by that window's own code, each short, its ring (if any) on the window it's about
test('the first-open cards: one a window the plan lists, each asked for where that window opens, short, rung on its window', () => {
  const once = JSON.parse(readFileSync(new URL('../content/firststeps.json', import.meta.url), 'utf8')).once;
  const ids = once.map((c) => c.id);
  assert.deepEqual(ids, ['shop', 'smith', 'tavern', 'hire', 'inn', 'temple', 'board', 'coach', 'bag', 'skills', 'room', 'fallen']);
  const code = ['src/ui/townmenu.js', 'src/ui/sheet.js', 'src/main.js'].map((f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8')).join('\n');
  for (const id of ids.filter((i) => !['shop', 'smith', 'tavern', 'inn', 'temple'].includes(i))) assert.ok(code.includes(`firstOpen('${id}'`), `${id}: asked for`);
  assert.ok(/firstOpen\(kind\)/.test(code), "the services' own: open(kind) asks for its kind's");
  for (const c of once) {
    assert.ok(c.text.length <= 320 && c.title.length <= 32, `${c.id}: short enough for a phone`);
    if (c.at) assert.match(c.at, /^#(hubSheet|gearSheet) /, `${c.id}: rings a row of its own window`);
  }
});
