// ink.mjs — compile every content/dialogue/<name>.ink to content/dialogue/<name>.json with the inkjs
// compiler (architecture A4). The game loads the JSON (no build step), so the compiled files are
// committed; `--check` (npm run content) recompiles and fails on any error, warning or a committed
// JSON that no longer matches its .ink. Exit 1 on any problem.
//   node tools/content/ink.mjs            write the JSON
//   node tools/content/ink.mjs --check    verify only (CI)
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Compiler } from 'inkjs/full';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'content', 'dialogue');
const check = process.argv.includes('--check');
let bad = 0, n = 0;
for (const f of existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.ink')) : []) {
  n++;
  const src = readFileSync(join(DIR, f), 'utf8'), out = join(DIR, f.replace(/\.ink$/, '.json'));
  const problems = [];
  let json = null;
  try {
    const c = new Compiler(src), story = c.Compile();
    problems.push(...(c.errors || []), ...(c.warnings || []));
    if (story && !problems.length) json = story.ToJson();
  } catch (e) { problems.push(e.message); }
  if (json && check && (!existsSync(out) || readFileSync(out, 'utf8') !== json + '\n')) problems.push(`${f.replace(/\.ink$/, '.json')} is out of date: run node tools/content/ink.mjs`);
  if (json && !check) writeFileSync(out, json + '\n');
  if (problems.length) { bad++; console.log(`✗ ${f}`); for (const p of problems) console.log(`    ${p}`); } else console.log(`✓ ${f}`);
}
console.log(bad ? `INK_FAIL (${bad} of ${n})` : `INK_OK (${n} files)`);
process.exit(bad ? 1 : 0);
