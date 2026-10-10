// The Greywater Fens' own (M8 slice 4; world doc v1.20 §8): the fen ghoul and the bog-witch (the region's two new
// silhouettes), the Toadking's reed-cutters and fowlers (Redhand recolours), the Cult's harvesters (acolytes with a
// lantern-cage on a pole) and the drowned clergy (Ashbound). Each mirrors an Ashbound role's strength, so the
// difficulty contract holds whoever fills a wave; each has a baked look; each site's rooms fill with its own.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { statsFor } from '../src/sim/party.js';
import { FAMILIES, ENEMY_KINDS } from '../src/sim/battle.js';
import { SITES } from '../src/sim/sites.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807, FENS = ['fenghoul', 'reedcutter', 'fowler', 'bogwitch', 'harvester', 'drowned', 'cantor'];
const read = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');

test('the Fens\' families: every kind is the sim\'s and named for the defeat screen; only the drowned clergy and the Ashbound are undead', () => {
  const foes = JSON.parse(read('../content/foes.json')).foes;
  for (const id of ['reedmen', 'lockcult', 'harvest', 'drowned']) {
    const F = FAMILIES[id];
    for (const k of [...F.melee, ...F.ranged, F.elite]) {
      assert.ok(ENEMY_KINDS.includes(k), `${id}: ${k}`); assert.ok(foes[k] && foes[k].a, `the defeat screen names ${k}`);
      assert.equal(F.undead(k), ['minion', 'warrior', 'rogue', 'mage', 'drowned', 'cantor'].includes(k), `${id}: ${k} undead?`);
    }
  }
  for (const id of Object.keys(SITES).filter((s) => SITES[s].region === 'fens'))
    for (const f of [SITES[id].family, ...(SITES[id].families || [])]) assert.ok(FAMILIES[f], `${id}: ${f}`);
  assert.equal(SITES.toadking_mound.family, 'reedmen'); assert.equal(SITES.drowned_abbey.family, 'drowned');
  assert.deepEqual(SITES.canal_locks.families, ['ashbound', 'lockcult', 'harvest'], 'the Locks\' first floor is the bound lock-men; Vat Seven, the third (the Sickpools, v1.48), the harvest');
});

test('each of the Fens\' own mirrors a role (HP and ATK within 15 % of it), so the contract holds whoever fills a wave', async () => {
  const src = read('../src/sim/battle.js');
  const stat = (k) => { const m = src.match(new RegExp(`\\n  ${k}:\\s*\\{ hp: ([\\d.]+), atk: ([\\d.]+)`)); assert.ok(m, k); return [+m[1], +m[2]]; };
  const MIRROR = { fenghoul: 'minion', reedcutter: 'warrior', fowler: 'crossbow', bogwitch: 'mage', harvester: 'warrior', drowned: 'minion', cantor: 'mage' };
  for (const [k, role] of Object.entries(MIRROR)) {
    const [h, a] = stat(k), [H, A] = stat(role);
    assert.ok(Math.abs(h / H - 1) <= 0.15 && Math.abs(a / A - 1) <= 0.15, `${k} (${h}/${a}) against ${role} (${H}/${A})`);
  }
});

test('every foe kind has a baked look: the renderer names its atlas and the atlas ships', () => {
  const src = read('../src/render/renderer.js'), map = src.match(/const ENEMY_ACTOR = \{([\s\S]*?)\};/)[1];
  const actor = Object.fromEntries([...map.matchAll(/(\w+): '(\w+)'/g)].map((m) => [m[1], m[2]]));
  for (const k of ENEMY_KINDS) {
    assert.ok(actor[k], `ENEMY_ACTOR has ${k}`);
    for (const ext of ['json', 'alb.png', 'nrm.png']) assert.ok(existsSync(new URL(`../assets/actors/${actor[k]}.${ext}`, import.meta.url)), `${actor[k]}.${ext}`);
  }
  const stage = read('../src/dev/stage.js');
  for (const k of FENS) assert.ok(stage.includes(`'${actor[k]}'`), `the Stage lines up ${actor[k]}`);
});

// a room in each site fills with its own family and nothing else (fought with a party kept on its feet); (v1.48) the
// Sickpools' harvest fills Vat Seven, the Canal Locks' third floor
for (const [site, depth, kinds] of [['toadking_mound', 0, ['fenghoul', 'reedcutter', 'fowler', 'bogwitch']], ['drowned_abbey', 0, ['drowned', 'harvester', 'rogue', 'cantor']], ['canal_locks', 2, ['fenghoul', 'harvester', 'rogue', 'bogwitch']]])
  test(`a room in ${site}${depth ? ` (floor ${depth + 1})` : ''} fills with its own: ${kinds.join(', ')}`, () => {
    const sim = createSim(SEED, undefined, { scene: 'dungeon', site }); sim.tick();
    if (depth) { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth, floors: [] }); assert.equal(sim.world.depth, depth); }
    const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [1, 3]);
    sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m }))); for (const m of sim.state.party) { m.level = SITES[site].base + depth; m.hp = statsFor(m).maxHp; }
    const L = sim.world.level, r = L.rooms.find((q) => q.id !== L.entrance.id && (!L.descentRoom || q.id !== L.descentRoom.id)), p = sim.state.player;
    p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
    const seen = new Set();
    for (let i = 0; i < 20 * 90; i++) { for (const m of sim.state.party) if (!m.down) m.hp = statsFor(m).maxHp; sim.tick(); for (const e of sim.world.enemies || []) seen.add(e.kind); }
    assert.ok(seen.size >= 2, [...seen].join(','));
    for (const k of seen) assert.ok(kinds.includes(k), `${k} in ${site}`);
  });
