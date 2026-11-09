// build.mjs — Luminati as a module of the game (docs/luminati-port-plan.md §13 step 1): tools/render3d/world.js with
// Luminati's engine and world layers and three.js, built into src/vendor/luminati-80e1aa6/ (committed: the game has no
// build; never edit it, rebuild). src/render3d/hybrid.js imports its luminati.js.
//   node tools/render3d/build.mjs
// Luminati's checkout at its pin (tools/render3d/.work/luminati, gitignored): fetched and installed here if it isn't
// there yet. (It was the prototype's, tools/lumina/.work, until the prototype was removed: docs/luminati-only-cleanup.md.)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = resolve(HERE, '..', '..');
const REPO = 'https://gitlab.com/stubborn-hug/lumina.git', PIN = '80e1aa6011159db7b88d52637d4b1112b1450ffa';
const LUM = join(HERE, '.work', 'luminati'), OUT = join(ROOT, 'src', 'vendor', `luminati-${PIN.slice(0, 7)}`);
const run = (cmd, args, cwd, env = {}) => execFileSync(cmd, args, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });

// 1. Luminati at its pin
mkdirSync(dirname(LUM), { recursive: true });
if (!existsSync(join(LUM, '.git'))) run('git', ['clone', '--quiet', REPO, LUM], dirname(LUM));
if (execFileSync('git', ['rev-parse', 'HEAD'], { cwd: LUM }).toString().trim() !== PIN) { run('git', ['fetch', '--quiet', 'origin'], LUM); run('git', ['checkout', '--quiet', PIN], LUM); }
if (!existsSync(join(LUM, 'node_modules', 'vite'))) run('npm', ['ci', '--no-audit', '--no-fund'], LUM);

// 2. our module and its ground (ground.js: the quarter-size ground cover, no floating dots) into its ember3d/
const STAGE = join(LUM, 'ember3d');
rmSync(STAGE, { recursive: true, force: true }); mkdirSync(STAGE, { recursive: true });
cpSync(join(HERE, 'world.js'), join(STAGE, 'world.js'));
cpSync(join(HERE, 'ground.js'), join(STAGE, 'ground.js'));
// the bake's figure builder, so the people in the world are the atlases' people as models (world.js placeFigure)
for (const f of ['figure.js', 'faces.js', 'props.js', 'body.js']) cpSync(join(ROOT, 'tools', 'actor-lab', f), join(STAGE, f));

// 3. the library build
rmSync(OUT, { recursive: true, force: true });
cpSync(join(HERE, 'vite.config.mjs'), join(LUM, 'ember3d.vite.config.mjs'));
run(join(LUM, 'node_modules', '.bin', 'vite'), ['build', '--config', join(LUM, 'ember3d.vite.config.mjs')], LUM, { LUMINATI: LUM, EMBER_OUT: OUT });
cpSync(join(LUM, 'LICENSE'), join(OUT, 'LUMINATI-LICENSE.txt'));
// (the CSS of Luminati's own UI is never loaded: its UI is hidden)
for (const f of readdirSync(OUT)) if (f.endsWith('.css')) rmSync(join(OUT, f));
const files = readdirSync(OUT).filter((f) => f.endsWith('.js')), sizes = files.map((f) => { const b = readFileSync(join(OUT, f)); return [f, b.length, gzipSync(b).length]; });
const entryGz = sizes.find(([f]) => f === 'luminati.js')[2], allGz = sizes.reduce((n, s) => n + s[2], 0), all = sizes.reduce((n, s) => n + s[1], 0);
writeFileSync(join(OUT, 'BUILD.txt'), `Built by tools/render3d/build.mjs from Luminati ${PIN} (${REPO}, MIT: LUMINATI-LICENSE.txt) and Emberfall's
tools/render3d/world.js. Do not edit: rebuild. Imported by src/render3d/hybrid.js (docs/luminati-port-plan.md §13).
${files.length} modules, ${(all / 1048576).toFixed(2)} MB (${(allGz / 1024).toFixed(0)} KB gzipped); luminati.js ${(entryGz / 1024).toFixed(0)} KB gzipped.
`);
const size = (p) => statSync(p).isDirectory() ? readdirSync(p).reduce((s, f) => s + size(join(p, f)), 0) : statSync(p).size;
console.log(`${OUT.slice(ROOT.length + 1)}: ${files.length} modules, ${(size(OUT) / 1048576).toFixed(2)} MB on disk, ${(allGz / 1024).toFixed(0)} KB gzipped in all, the entry ${(entryGz / 1024).toFixed(0)} KB`);
for (const [f, b, g] of sizes.sort((a, b) => b[2] - a[2]).slice(0, 8)) console.log(`  ${f}: ${(b / 1024).toFixed(0)} KB, ${(g / 1024).toFixed(0)} KB gz`);
