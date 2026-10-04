// tower.mjs — the Mere Tower, headless (sim/tower.js; GDD §17 v1.31): a party at a level, in kit at its level, in the
// stair hall, climbing on at every landing until beaten or out of time. What it reached and what it banked.
//   node tools/balance/tower.mjs [heroLv] [secs] [hires] [--src dir]   (hires: tavern rows, 1,3 = fighter rogue cleric)
import { resolve } from 'node:path';
const args = process.argv.slice(2), si = args.indexOf('--src'), SRC = si >= 0 ? args.splice(si, 2)[1] : 'src';
const [lv = '12', secs = '900', hires = '1,3'] = args;
const root = 'file://' + resolve(SRC) + '/';
const { createSim } = await import(root + 'sim/core.js');
const s0 = createSim(20260807, undefined, { scene: 'town' });
for (const i of hires.split(',').filter(Boolean).map(Number)) { s0.state.counters.gold = 1e9; s0.commands.push({ type: 'hire', idx: i }); s0.tick(); }
const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'mere_tower' });
sim.state.party = [sim.state.party[0], ...s0.state.party.slice(1).map((m) => ({ ...JSON.parse(JSON.stringify(m)), perks: [], hidden: null }))];
const { statsFor } = await import(root + 'sim/party.js'), { starterKit } = await import(root + 'sim/items.js'), { autoAllocate } = await import(root + 'sim/attributes.js');
for (const m of sim.state.party) { m.level = +lv; m.autoAttrs = true; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; }
sim.state.counters.gold = 0; sim.state.counters.embers = 0;
const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
const log = []; let def = false;
sim.bus.on('towerLanding', (e) => { log.push(`landing ${e.landing} at ${sim.state.t.toFixed(0)}s banked ${e.banked.gold}g ${e.banked.cinders}✦`); sim.commands.push({ type: 'towerClimb' }); });
sim.bus.on('bossWave', (e) => log.push(`  warden ${e.name}`));
sim.bus.on('defeat', () => { def = true; });
sim.bus.on('towerOut', (e) => log.push(`out · lost ${JSON.stringify(e.lost)}`));
for (let i = 0; i < 20 * +secs && !def; i++) sim.tick();
const T = sim.state.tower;
console.log(log.join('\n'));
console.log(`L${lv} party ${sim.state.party.map((m) => m.cls).join('/')}: ${def ? 'BEATEN' : 'climbing'} · best wave ${T.best} · landing ${T.landing} · gold ${sim.state.counters.gold} · cinders ${sim.state.counters.embers} · xp ${sim.state.party.map((m) => m.xp)} · ${sim.state.t.toFixed(0)}s`);
