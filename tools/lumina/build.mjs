// build.mjs — builds the Luminati prototype into lumina/ (docs/lumina-prototype.md): Luminati's world, Emberfall's people.
//   node tools/lumina/build.mjs            fetch Luminati at PIN (once), npm ci there (once), stage ember/, vite build → lumina/
// Luminati (https://gitlab.com/stubborn-hug/lumina) is MIT; its checkout and node_modules live in tools/lumina/.work/
// (ignored by git). The output is committed: the site has no build step (netlify.toml publishes the repo as it is).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = resolve(HERE, '..', '..');
const REPO = 'https://gitlab.com/stubborn-hug/lumina.git';
export const PIN = '80e1aa6011159db7b88d52637d4b1112b1450ffa';
// the worlds the prototype ships (Luminati's public/levels): five at peace, one with a fight
export const LEVELS = ['emberfall', 'sample-hamlet', 'brightwater-crossing', 'gildhaven', 'starfall-vale', 'cinderwatch-pass'];
// and Emberfall's own, written by levels.mjs: Thornwick from our sim, the catalogue of Luminati's world, our fight, our dungeon
export const OURS = ['thornwick', 'catalogue', 'encounter', 'barrows'];
const WORK = join(HERE, '.work'), LUM = join(WORK, 'luminati'), OUT = join(ROOT, 'lumina');
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit', env: { ...process.env } });

// 1. Luminati at its pin
mkdirSync(WORK, { recursive: true });
if (!existsSync(join(LUM, '.git'))) run('git', ['clone', '--quiet', REPO, LUM], WORK);
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: LUM }).toString().trim();
if (head !== PIN) { run('git', ['fetch', '--quiet', 'origin'], LUM); run('git', ['checkout', '--quiet', PIN], LUM); }
if (!existsSync(join(LUM, 'node_modules', 'vite'))) run('npm', ['ci', '--no-audit', '--no-fund'], LUM);

// 2. our files into its ember/ (the build's root)
const EMBER = join(LUM, 'ember');
rmSync(EMBER, { recursive: true, force: true }); mkdirSync(join(EMBER, 'public', 'levels'), { recursive: true });
for (const f of readdirSync(join(HERE, 'ember'))) cpSync(join(HERE, 'ember', f), join(EMBER, f), { recursive: true });
for (const l of LEVELS) cpSync(join(LUM, 'public', 'levels', `${l}.json`), join(EMBER, 'public', 'levels', `${l}.json`));
// every baked actor's name, for the sheets (a level may name any of them: levels.mjs), and which have a portrait
const actors = readdirSync(join(ROOT, 'assets', 'actors')).filter((f) => /^[a-z_0-9]+\.json$/.test(f)).map((f) => f.slice(0, -5)).sort();
const faces = actors.filter((a) => existsSync(join(ROOT, 'assets', 'actors', `${a}.face.png`)));
writeFileSync(join(EMBER, 'actors.js'), `// written by tools/lumina/build.mjs: assets/actors/ (every atlas, and those with a portrait baked)\nexport const ACTOR_NAMES = ${JSON.stringify(actors)};\nexport const ACTOR_FACES = ${JSON.stringify(faces)};\n`);
const LV = await import('./levels.mjs'), base = JSON.parse(readFileSync(join(LUM, 'public', 'levels', 'sample-hamlet.json'), 'utf8'));
for (const l of OURS) {
  const { level, stats } = await LV[l](base, LUM);
  writeFileSync(join(EMBER, 'public', 'levels', `${l}.json`), JSON.stringify(level));
  console.log(`levels/${l}.json: ${stats.size}, ${level.objects.length} objects`);
}
mkdirSync(join(EMBER, 'public', 'i18n'), { recursive: true });
cpSync(join(LUM, 'public', 'i18n', 'index.json'), join(EMBER, 'public', 'i18n', 'index.json'));
cpSync(join(LUM, 'LICENSE'), join(EMBER, 'public', 'LUMINATI-LICENSE.txt'));
// their game page, pointed at their main.js from ember/, with our touch controls and the autobattle after it
let game = readFileSync(join(LUM, 'game.html'), 'utf8');
const MAIN = '<script type="module" src="./src/main.js"></script>';
if (!game.includes(MAIN)) throw new Error('build.mjs: Luminati\'s game.html no longer loads ./src/main.js');
game = game.replace(MAIN, '<script type="module" src="../src/main.js"></script>\n  <script type="module" src="./touch.js"></script>\n  <script type="module" src="./autobattle.js"></script>\n  <script type="module" src="./issue.js"></script>\n  <script type="module" src="./cards.js"></script>')
  .replace(/<title>[^<]*<\/title>/, '<title>Emberfall · Luminati prototype</title>')
  .replace('<meta name="viewport" content="width=device-width, initial-scale=1" />', '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />');
writeFileSync(join(EMBER, 'game.html'), game);

// 3. the build
rmSync(OUT, { recursive: true, force: true });
// (the config beside their own, so it finds their vite)
cpSync(join(HERE, 'vite.config.mjs'), join(LUM, 'ember.vite.config.mjs'));
execFileSync(join(LUM, 'node_modules', '.bin', 'vite'), ['build', '--config', join(LUM, 'ember.vite.config.mjs')], { cwd: LUM, stdio: 'inherit', env: { ...process.env, LUMINATI: LUM, EMBER_OUT: OUT } });
writeFileSync(join(OUT, 'BUILD.txt'), `Built by tools/lumina/build.mjs from Luminati ${PIN} (${REPO}, MIT: LUMINATI-LICENSE.txt)\nand Emberfall's tools/lumina/ember/. Levels: ${LEVELS.join(', ')}; Emberfall's ${OURS.join(', ')} (tools/lumina/levels.mjs). Do not edit: rebuild.\n`);
const size = (p) => statSync(p).isDirectory() ? readdirSync(p).reduce((s, f) => s + size(join(p, f)), 0) : statSync(p).size;
console.log(`lumina/: ${(size(OUT) / 1048576).toFixed(1)} MB`);
