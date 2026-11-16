// Hide helm (GDD §6.1 v1.65) on a rogue (the owner, 2026-11-16: "hiding helm on rogue does not work"): the rogue's hood
// isn't a worn helm, it's the KayKit model itself (Rogue_Hooded), so emptying the helm slot left it on. The look says
// `bare`, and the world builds it on the plain Rogue model with no Helmet, Hat or Hood shown (tools/render3d/world.js withLook).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lookOf } from '../src/render3d/looks.js';

test('a member with the helm hidden has a bare look; shown, none', () => {
  const m = { cls: 'rogue', gear: { helm: { base: 'hood', r: 'fine', up: 1 } }, appearance: null };
  assert.equal(lookOf(m).a.bare, undefined); assert.ok(lookOf(m).a.gear.helm);
  const b = { ...m, hideHelm: true };
  assert.equal(lookOf(b).a.bare, true); assert.equal(lookOf(b).a.gear.helm, null);
  assert.notEqual(lookOf(b).k, lookOf(m).k, 'a new figure is built for it');
});

test('the world takes a bare look off the hooded model and the shown hats (withLook)', () => {
  const src = readFileSync(new URL('../tools/render3d/world.js', import.meta.url), 'utf8');
  const body = src.slice(src.indexOf('const BARE ='), src.indexOf('\n', src.indexOf("model: v.model.replace(/_Hooded$/")));
  const BARE = /Helmet|Hat|Hood/;   // (as world.js has it)
  const withLook = new Function('BARE', body.replace(/^const BARE = .*;\n/, '') + '\nreturn withLook;')(BARE);
  const cast = JSON.parse(readFileSync(new URL('../assets/models/cast.json', import.meta.url), 'utf8'));
  const v = cast.actors.hero_rogue.v, bare = withLook(v, { appearance: null, gear: null, bare: true });
  assert.equal(v.model, 'Rogue_Hooded'); assert.equal(bare.model, 'Rogue');
  assert.ok(cast.actors.hero_wren.v.model === 'Rogue', 'the plain Rogue model ships (assets/models/Rogue.glb)');
  assert.equal(withLook(v, { appearance: null, gear: null }).model, 'Rogue_Hooded', 'shown: as it was');
});
