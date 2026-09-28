// validate.mjs — `npm run content`: every content/<name>.json against content/schema/<name>.schema.json,
// plus id uniqueness in every array of objects with an `id`. Exit 1 on any problem.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'content');
const ajv = new Ajv({ allErrors: true });
let bad = 0, n = 0;
const dupes = (v, path, out) => {
  if (Array.isArray(v)) {
    const ids = v.filter((o) => o && typeof o === 'object' && 'id' in o).map((o) => o.id);
    for (const id of ids.filter((x, i) => ids.indexOf(x) !== i)) out.push(`${path}: duplicate id "${id}"`);
    v.forEach((x, i) => dupes(x, `${path}[${i}]`, out));
  } else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) dupes(x, `${path}.${k}`, out);
};
for (const f of readdirSync(ROOT).filter((f) => f.endsWith('.json'))) {
  n++;
  const name = f.replace(/\.json$/, ''), schemaPath = join(ROOT, 'schema', `${name}.schema.json`);
  let data;
  try { data = JSON.parse(readFileSync(join(ROOT, f), 'utf8')); } catch (e) { console.log(`✗ ${f}: invalid JSON — ${e.message}`); bad++; continue; }
  if (!existsSync(schemaPath)) { console.log(`✗ ${f}: no schema at content/schema/${name}.schema.json`); bad++; continue; }
  const validate = ajv.compile(JSON.parse(readFileSync(schemaPath, 'utf8')));
  const errs = validate(data) ? [] : validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`);
  dupes(data, name, errs);
  if (errs.length) { bad++; console.log(`✗ ${f}`); for (const e of errs) console.log(`    ${e}`); } else console.log(`✓ ${f}`);
}
console.log(bad ? `CONTENT_FAIL (${bad} of ${n})` : `CONTENT_OK (${n} files)`);
process.exit(bad ? 1 : 0);
