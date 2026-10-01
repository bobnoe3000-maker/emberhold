// Act I, Smoke over the Vale (M5, docs/m5-plan.md §4; world doc §6): three chapters in order. The Tithe
// Mill for Maudry, handed in to Osric, who then opens Wickham Keep; Captain Garrow for Osric; the
// Robed Stranger in the Sunken Chapel for Osric, handed in to Sister Ilse. Each is taken only from its
// giver and handed in only to its taker, only in order; a chapter can't be abandoned; a boss who fell
// before the chapter was taken still counts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';

const SEED = 20260807;
const talk = (sim, npc) => {
  if (sim.world.kind !== 'town') { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'town', depth: 0 }); }
  const n = sim.world.npcs.find((q) => q.id === npc), p = sim.state.player;
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  p.x = p.px = n.x + 1; p.y = p.py = n.y - 1; sim.commands.push({ type: 'talk', npc }); sim.tick();
};
const say = (sim, verb, id) => { sim.commands.push({ type: 'dialogueEffect', tag: 'quest', args: [verb, id] }); sim.tick(); };
const st = (sim, id) => sim.quests.status(id);
// into a site, a strong company (the chapters are the test, not the balance)
function goTo(sim, site, depth = 0) {
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  sim.restore({ ...snap, scene: 'dungeon', site, depth, floors: [] });
  for (const m of sim.state.party) { m.level = Math.max(m.level, 12); m.hp = statsFor(m).maxHp; }
}
function fightIn(sim, room, until, secs = 300) {
  const L = sim.world.level, r = room(L), S = sim.world.stairwell, p = sim.state.player; let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); if (S && x >= S.x0 - 1 && x <= S.x1 && y >= S.y0 - 1 && y <= S.y1) continue; const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  for (let i = 0; i < secs * 20 && !until(); i++) { for (const m of sim.state.party) if (!m.down) m.hp = Math.max(m.hp, statsFor(m).maxHp * 0.7); sim.tick(); }
}
const down = (sim) => { const t = sim.world.stairsAt, p = sim.state.player; p.x = p.px = t.x + 0.5; p.y = p.py = t.y + 1.5; sim.commands.push({ type: 'harvest', tx: t.x, ty: t.y }); sim.tick(); };

test('Act I from start to finish: the mill, the Keep, the chapel, in order, each paid once', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [0, 2]);
  sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  const paid = []; sim.bus.on('questReward', (r) => paid.push(r.id));
  const fines = []; sim.bus.on('loot', (l) => { if (l.src === 'chapter') fines.push(l.item.r); });
  const revealed = []; sim.bus.on('siteRevealed', (e) => revealed.push(e.site));

  // 1. Smoke over the Vale: from Maudry only; the others can't start before it's done
  assert.equal(st(sim, 'ch1_smoke_over_the_vale'), QS.AVAILABLE);
  assert.equal(st(sim, 'ch1_the_diggers'), QS.LOCKED, 'the Keep waits on the mill');
  talk(sim, 'osric_hale'); say(sim, 'accept', 'ch1_smoke_over_the_vale'); assert.equal(st(sim, 'ch1_smoke_over_the_vale'), QS.AVAILABLE, 'not from Osric');
  talk(sim, 'maudry_fenn'); say(sim, 'accept', 'ch1_smoke_over_the_vale'); assert.equal(st(sim, 'ch1_smoke_over_the_vale'), QS.ACTIVE);
  sim.commands.push({ type: 'questAbandon', id: 'ch1_smoke_over_the_vale' }); sim.tick(); assert.equal(st(sim, 'ch1_smoke_over_the_vale'), QS.ACTIVE, 'a chapter stays');
  goTo(sim, 'tithe_mill'); let cleared = 0; sim.bus.on('wave', (e) => { if (e.cleared) cleared++; });
  fightIn(sim, (L) => L.rooms.find((q) => q !== L.entrance), () => st(sim, 'ch1_smoke_over_the_vale') === QS.READY);
  assert.equal(st(sim, 'ch1_smoke_over_the_vale'), QS.READY); assert.ok(cleared >= 4);
  talk(sim, 'maudry_fenn'); say(sim, 'turnin', 'ch1_smoke_over_the_vale'); assert.equal(st(sim, 'ch1_smoke_over_the_vale'), QS.READY, 'handed in to Osric, not Maudry');
  assert.ok(!sim.state.revealed.has('wickham_keep'));
  talk(sim, 'osric_hale'); say(sim, 'turnin', 'ch1_smoke_over_the_vale');
  assert.equal(st(sim, 'ch1_smoke_over_the_vale'), QS.DONE); assert.deepEqual(revealed, ['wickham_keep'], 'the Keep is revealed');

  // 2. The Diggers: Osric; down to the Keep's second floor, then Garrow
  say(sim, 'accept', 'ch1_the_diggers'); assert.equal(st(sim, 'ch1_the_diggers'), QS.ACTIVE);
  goTo(sim, 'wickham_keep'); down(sim); assert.equal(sim.state.depth, 1);
  assert.equal(sim.state.quests.ch1_the_diggers.step, 1, 'on to Garrow');
  fightIn(sim, (L) => L.descentRoom, () => st(sim, 'ch1_the_diggers') === QS.READY);
  assert.equal(st(sim, 'ch1_the_diggers'), QS.READY); assert.equal(sim.state.bosses.redhand_captain, 1);
  talk(sim, 'osric_hale'); say(sim, 'turnin', 'ch1_the_diggers'); assert.equal(st(sim, 'ch1_the_diggers'), QS.DONE);

  // 3. An Ember in the Fist: from Osric, handed in to Sister Ilse
  say(sim, 'accept', 'ch1_ember_in_the_fist'); assert.equal(st(sim, 'ch1_ember_in_the_fist'), QS.ACTIVE);
  goTo(sim, 'sunken_chapel'); down(sim);
  fightIn(sim, (L) => L.descentRoom, () => st(sim, 'ch1_ember_in_the_fist') === QS.READY);
  talk(sim, 'osric_hale'); say(sim, 'turnin', 'ch1_ember_in_the_fist'); assert.equal(st(sim, 'ch1_ember_in_the_fist'), QS.READY, 'not Osric: Ilse');
  talk(sim, 'sister_ilse'); say(sim, 'turnin', 'ch1_ember_in_the_fist'); assert.equal(st(sim, 'ch1_ember_in_the_fist'), QS.DONE);
  say(sim, 'turnin', 'ch1_ember_in_the_fist');
  assert.deepEqual(paid, ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist'], 'each paid once, in order');
  assert.equal(fines.length, 3, 'each chapter pays a Fine or better too (GDD §8)'); assert.ok(fines.every((r) => r === 'fine' || r === 'rare'));
});

test('a boss who fell before his chapter was taken still counts; Ink reads a chapter at its taker too', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  sim.state.quests.ch1_smoke_over_the_vale = { st: QS.DONE, step: 0, n: [4] };
  sim.state.party[0].level = 5;
  sim.state.bosses.redhand_captain = 1;
  talk(sim, 'osric_hale'); say(sim, 'accept', 'ch1_the_diggers');
  // the first step (reach floor 2) still wants walking; Garrow is counted when it's reached
  assert.equal(st(sim, 'ch1_the_diggers'), QS.ACTIVE);
  goTo(sim, 'wickham_keep'); down(sim);
  assert.equal(st(sim, 'ch1_the_diggers'), QS.READY, 'reaching the floor was the last thing left: Garrow already fell');
  let got = null; sim.bus.on('dialogue', (e) => { got = e.vars; });
  talk(sim, 'sister_ilse'); assert.ok('q_ch1_ember_in_the_fist' in got, 'Ilse reads the chapter she takes in');
});

// the words: each chapter is offered and handed in in its people's own conversations (story adapter)
import { readFileSync } from 'node:fs';
import { createStoryBook } from '../src/story/adapter.js';
import { hire } from './fixtures/hire.mjs';
const book = () => createStoryBook(async (f) => JSON.parse(readFileSync(`content/dialogue/${f}.json`, 'utf8')));
async function play(file, knot, vars, picks) {
  const sent = [], c = await book().open(file, knot, vars, (cmd) => sent.push(cmd));
  let b = c.first; const settle = () => { while (b.waiting) b = c.resume(vars); }; settle();
  for (const want of picks) { const ch = b.choices.find((x) => x.text.startsWith(want)); assert.ok(ch, `${file}: no "${want}" in ${b.choices.map((x) => x.text)}`); b = c.choose(ch.index); settle(); }
  return sent.filter((x) => x.tag === 'quest').map((x) => x.args.join(' '));
}
const base = { hero_name: 'Wren', hero_level: 6, party_size: 3, fallen_name: '', flag_met_maudry: 1, flag_met_osric: 1, flag_met_ilse: 1 };
test('the Ink: Maudry offers the mill, Osric takes it in and offers the Keep and the chapel, Ilse takes the shard', async () => {
  assert.deepEqual(await play('maudry', 'maudry_hub', { ...base, q_ch1_smoke_over_the_vale: 0 }, ['You said something about smoke?', "I'll shift them."]), ['accept ch1_smoke_over_the_vale']);
  assert.deepEqual(await play('osric', 'osric_hub', { ...base, q_ch1_smoke_over_the_vale: 2 }, ['The Redhand are out of the mill.']), ['turnin ch1_smoke_over_the_vale']);
  assert.deepEqual(await play('osric', 'osric_hub', { ...base, q_ch1_smoke_over_the_vale: 3, q_ch1_the_diggers: 0 }, ['Where did the Redhand go?', "I'll go to the Keep."]), ['accept ch1_the_diggers']);
  assert.deepEqual(await play('osric', 'osric_hub', { ...base, q_ch1_the_diggers: 2 }, ['Captain Garrow is down. I have his ledger.']), ['turnin ch1_the_diggers']);
  assert.deepEqual(await play('osric', 'osric_hub', { ...base, q_ch1_the_diggers: 3, q_ch1_ember_in_the_fist: 0 }, ['Who paid for the digging?', "I'll go down into the chapel."]), ['accept ch1_ember_in_the_fist']);
  assert.deepEqual(await play('ilse', 'ilse_hub', { ...base, q_ch1_ember_in_the_fist: 2 }, ['The robed stranger in the chapel died holding this.']), ['turnin ch1_ember_in_the_fist']);
});
