// props.js — what the KayKit packs don't have, shared by the figure bake (lab.js) and the icon
// bake (iconlab.js) so the weapon in a hand and its icon are one object:
//   PROPS      small code-built meshes a variant can put in a hand slot (`hold` in variants.json)
//   swatches() repaint whole colour swatches of a KayKit texture (`swatches` in variants.json)
// Our own models, so no licence beyond the repo's.
import * as THREE from 'three';

const mat = (color, metalness, roughness) => new THREE.MeshStandardMaterial({ color, metalness, roughness });

// Each prop runs along +y from the grip (the hand slot's origin), like the kits' one-handed
// weapons (the 1H sword: −0.37 … 1.41), so the swing clips carry it the same way.
export const PROPS = {
  // a flanged mace: dark ash haft, leather grip, brass bands, an iron head of six flanges
  mace: () => {
    const g = new THREE.Group(); g.name = 'Mace';
    const wood = mat(0x4a3322, 0, 0.85), leather = mat(0x2e1f18, 0, 0.9), brass = mat(0xb8903c, 0.8, 0.35), iron = mat(0x9aa0a6, 0.85, 0.35);
    const add = (geo, m, y, name) => { const o = new THREE.Mesh(geo, m); o.position.y = y; o.name = name; g.add(o); return o; };
    add(new THREE.CylinderGeometry(0.062, 0.07, 1.02, 10), wood, 0.28, 'Mace_Haft');
    add(new THREE.CylinderGeometry(0.08, 0.08, 0.34, 10), leather, -0.02, 'Mace_Grip');
    add(new THREE.SphereGeometry(0.1, 12, 8), brass, -0.25, 'Mace_Pommel');
    for (const y of [0.17, 0.7]) add(new THREE.CylinderGeometry(0.085, 0.085, 0.06, 12), brass, y, 'Mace_Band');
    add(new THREE.CylinderGeometry(0.12, 0.1, 0.38, 12), iron, 0.92, 'Mace_Head');
    // the flanges: six pointed blades standing out from the head (a diamond profile, so the
    // silhouette is a star, not a block)
    const blade = new THREE.Shape([[0, -0.22], [0.13, -0.06], [0.14, 0.06], [0, 0.22]].map(([x, y]) => new THREE.Vector2(x, y)));
    const fg = new THREE.ExtrudeGeometry(blade, { depth: 0.05, bevelEnabled: false }); fg.translate(0, 0, -0.025);
    for (let k = 0; k < 6; k++) {
      const f = new THREE.Mesh(fg, iron), a = k * Math.PI / 3;
      f.position.set(Math.cos(a) * 0.1, 0.92, Math.sin(a) * 0.1); f.rotation.y = -a; f.name = 'Mace_Flange'; g.add(f);
    }
    add(new THREE.ConeGeometry(0.1, 0.16, 10), iron, 1.18, 'Mace_Cap');
    add(new THREE.SphereGeometry(0.065, 10, 8), brass, 1.28, 'Mace_Knop');
    return g;
  },
  // (body mock-up: our own weapons in the kits' slot conventions — +y from the grip, a blade's
  // flat facing ±z, a shield's face +z — so the KayKit clips carry them as they do the kits')
  sword: () => {
    const g = new THREE.Group(); g.name = 'Sword';
    const steel = mat(0xc8ccd2, 0.9, 0.3), brass = mat(0xb8903c, 0.8, 0.35), leather = mat(0x3a2418, 0, 0.9);
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.1, 1.2, 4, 1), steel); blade.scale.set(1, 1, 0.3); blade.rotation.y = Math.PI / 4; blade.position.y = 0.78; blade.name = 'Sword_Blade'; g.add(blade);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.1), brass); guard.position.y = 0.16; g.add(guard);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.3, 8), leather); grip.position.y = 0; g.add(grip);
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), brass); pom.position.y = -0.2; g.add(pom);
    return g;
  },
  dagger: () => {
    const g = new THREE.Group(); g.name = 'Dagger';
    const steel = mat(0xc0c4ca, 0.9, 0.3), dark = mat(0x2a2020, 0.2, 0.7);
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.07, 0.62, 4, 1), steel); blade.scale.set(1, 1, 0.3); blade.rotation.y = Math.PI / 4; blade.position.y = 0.45; g.add(blade);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.05, 0.08), dark); guard.position.y = 0.12; g.add(guard);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.24, 8), dark); g.add(grip);
    return g;
  },
  staff: () => {
    const g = new THREE.Group(); g.name = 'Staff'; g.userData.hang = 'up';   // (carried upright: plumb)
    const wood = mat(0x5a3a22, 0, 0.85), brass = mat(0xb8903c, 0.8, 0.35), orb = new THREE.MeshStandardMaterial({ color: 0xffa040, emissive: 0xc04010, emissiveIntensity: 1.2, roughness: 0.2 });   // (art pass 9) the Cult's ember, not a cold blue: only the Robed Stranger carries it
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.1, 8), wood); shaft.position.y = 0.2; g.add(shaft);
    for (const y of [1.18, -0.8]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 10), brass); b.position.y = y; g.add(b); }
    const claw = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 6, 12), brass); claw.position.y = 1.36; g.add(claw);
    const o = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 1), orb); o.position.y = 1.36; o.userData.glow = 0xff8030; g.add(o);
    return g;
  },
  shield: () => {
    const g = new THREE.Group(); g.name = 'Shield';
    const wood = mat(0x7a2e22, 0, 0.8), iron = mat(0x9aa0a6, 0.85, 0.35), brass = mat(0xc89a40, 0.8, 0.35);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 20), wood); face.rotation.x = Math.PI / 2; face.position.z = 0.16; g.add(face);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 6, 24), iron); rim.position.z = 0.2; g.add(rim);
    const boss = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), brass); boss.rotation.x = Math.PI / 2; boss.position.z = 0.2; g.add(boss);
    return g;
  },
  book: () => {
    const g = new THREE.Group(); g.name = 'Book';
    const cover = mat(0x5a2020, 0, 0.8), pages = mat(0xe8dcc0, 0, 0.9), brass = mat(0xc89a40, 0.8, 0.35);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.46), cover); b.position.y = 0.27; g.add(b);
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.47), pages); p.position.y = 0.27; p.position.x = 0.012; g.add(p);
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.08, 0.08), brass); c.position.set(0, 0.27, 0.2); g.add(c);
    return g;
  },
  // the Standard of the Third Legion (world doc §10.2): a tall pole, a crossbar, a legion-red banner
  // gone to tatters and an ember-gold boss at its heart, a bronze finial on top. Held like a spear.
  standard: () => {
    const g = new THREE.Group(); g.name = 'Standard';
    const wood = mat(0x3a2a1c, 0, 0.9), bronze = mat(0xa8803a, 0.8, 0.4), cloth = mat(0x7a2418, 0, 0.95), ember = new THREE.MeshStandardMaterial({ color: 0xf0b050, emissive: 0xa05010, emissiveIntensity: 1.0, roughness: 0.4 });
    // (it runs along −y from the grip: a hand at rest points its weapon down, and a standard is carried
    // upright, so its banner goes on the grip's other side)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 3.0, 8), wood); pole.position.y = -0.9; g.add(pole);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 8), bronze); bar.rotation.z = Math.PI / 2; bar.position.y = -2.2; g.add(bar);
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.34, 6), bronze); fin.rotation.z = Math.PI; fin.position.y = -2.56; g.add(fin);
    // the banner hangs from the bar (toward the grip) in three tattered tongues
    for (const [x, len] of [[-0.28, 1.0], [0, 1.2], [0.28, 0.9]]) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.28, len, 0.02), cloth); t.position.set(x, -2.2 + len / 2, 0.04); g.add(t); }
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 14), ember); disc.rotation.x = Math.PI / 2; disc.position.set(0, -1.78, 0.07); g.add(disc);
    return g;
  },
  // the Robed Stranger's ember-shard (world doc §5, v1.16): a jagged splinter of the Ember held point-up in his
  // free hand, lit (userData.glow: the bake writes it to the emissive plane), so the Cult's man carries its light
  shard: () => {
    const g = new THREE.Group(); g.name = 'Ember_Shard';
    const ember = new THREE.MeshStandardMaterial({ color: 0xffa040, emissive: 0xc04010, emissiveIntensity: 1.4, roughness: 0.3 });
    for (const [x, h, r, tilt] of [[0, 0.42, 0.07, 0], [0.06, 0.28, 0.05, -0.35], [-0.06, 0.24, 0.045, 0.4]]) {
      const c = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), ember); c.scale.set(r, h / 2, r); c.position.set(x, 0.1 + h / 2, 0); c.rotation.z = tilt;
      c.name = 'Ember_Shard'; c.userData.glow = 0xff8030; g.add(c);
    }
    return g;
  },
  // a pewter ale mug, held by its handle (Maudry Fenn's, the Tired Mule): body along +y above the grip
  mug: () => {
    const g = new THREE.Group(); g.name = 'Mug';
    const pewter = mat(0x6c7074, 0.75, 0.45), ale = mat(0xc8902a, 0.1, 0.35), foam = mat(0xd8d0bc, 0, 0.9);   // (pass 6: darker pewter, less foam; it read as a white blob)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.4, 14, 1, true), pewter); body.position.set(0.22, 0.22, 0); body.name = 'Mug_Body'; g.add(body);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.04, 14), pewter); base.position.set(0.22, 0.03, 0); base.name = 'Mug_Base'; g.add(base);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.02, 14), ale); top.position.set(0.22, 0.38, 0); top.name = 'Mug_Ale'; g.add(top);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), foam); head.scale.set(0.8, 0.3, 0.8); head.position.set(0.22, 0.4, 0); head.name = 'Mug_Foam'; g.add(head);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.035, 8, 16, Math.PI), pewter); handle.rotation.z = Math.PI / 2; handle.position.set(0.02, 0.22, 0); handle.name = 'Mug_Handle'; g.add(handle);
    return g;
  },
  // (art pass 6) what Thornwick's townsfolk carry, from the world doc §5: they hang from the hand at rest
  // (+y runs down the arm there), so a carried thing's body sits along +y below the grip.
  // Wendel's lamp oil: a hooded iron lantern on a bail, its glass lit (userData.glow: the bake writes the
  // glass to the emissive plane, so it glows at dusk and night like the square's lamps)
  lantern: () => {
    const g = new THREE.Group(); g.name = 'Lantern'; g.userData.hang = true;
    const iron = mat(0x3a3634, 0.7, 0.5), brass = mat(0x9a7a3a, 0.8, 0.4), glass = new THREE.MeshStandardMaterial({ color: 0xffc070, emissive: 0xc06010, emissiveIntensity: 1.2, roughness: 0.3 });
    const bail = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 6, 14, Math.PI), iron); bail.rotation.z = Math.PI; bail.position.y = 0.14; g.add(bail);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.14, 8), iron); cap.rotation.z = Math.PI; cap.position.y = 0.3; g.add(cap);
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.3, 8), glass); lamp.position.y = 0.5; lamp.name = 'Lantern_Glass'; lamp.userData.glow = 0xffb050; g.add(lamp);
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, bar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.03), iron); bar.position.set(Math.cos(a) * 0.135, 0.5, Math.sin(a) * 0.135); g.add(bar); }
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.07, 8), brass); base.position.y = 0.68; g.add(base);
    return g;
  },
  // Bess Hale's cross-peen hammer: an ash haft and a dark iron head, heavy enough to read at 56 px
  hammer: () => {
    const g = new THREE.Group(); g.name = 'Smith_Hammer'; g.userData.hang = true;
    const wood = mat(0x6a4a2a, 0, 0.8), iron = mat(0x55585e, 0.85, 0.4), leather = mat(0x2e1f18, 0, 0.9);
    const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.62, 8), wood); haft.position.y = 0.2; g.add(haft);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.26, 8), leather); grip.position.y = -0.02; g.add(grip);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.17, 0.17), iron); head.position.y = 0.52; head.name = 'Hammer_Head'; g.add(head);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 10), iron); face.rotation.z = Math.PI / 2; face.position.set(0.24, 0.52, 0); g.add(face);
    const peen = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.15), iron); peen.position.set(-0.25, 0.52, 0); g.add(peen);
    return g;
  },
  // Hedda's eggs: a willow basket on her arm with a cloth half over a clutch of eggs
  basket: () => {
    const g = new THREE.Group(); g.name = 'Egg_Basket'; g.userData.hang = true;
    const willow = mat(0xa07a44, 0, 0.9), cloth = mat(0xd8d2c0, 0, 0.95), egg = mat(0xf2ead8, 0, 0.6);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 14, Math.PI), willow); handle.rotation.z = Math.PI; handle.position.y = 0.2; g.add(handle);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.19, 0.24, 10), willow); body.position.y = 0.36; g.add(body);
    for (const [x, z] of [[-0.08, 0.05], [0.07, -0.06], [0.0, 0.1], [0.1, 0.08]]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), egg); e.scale.y = 1.25; e.position.set(x, 0.23, z); g.add(e); }
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.22), cloth); c.position.set(-0.08, 0.25, -0.06); c.rotation.y = 0.5; g.add(c);
    return g;
  },
  // Nell Tolley's keys (the Crossed Keys): a big iron ring of long keys, so they read as keys, not a dot
  keys: () => {
    const g = new THREE.Group(); g.name = 'Key_Ring'; g.userData.hang = true;
    const iron = mat(0x6a6460, 0.85, 0.4), brass = mat(0xb08a40, 0.8, 0.4);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 6, 16), iron); ring.position.y = 0.14; g.add(ring);
    for (const [a, m, len] of [[-0.35, brass, 0.42], [0.05, iron, 0.5], [0.4, brass, 0.38]]) {
      const k = new THREE.Group(); k.position.y = 0.24; k.rotation.z = a;
      const shank = new THREE.Mesh(new THREE.BoxGeometry(0.035, len, 0.035), m); shank.position.y = len / 2; k.add(shank);
      const bow = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.018, 5, 10), m); bow.position.y = 0.02; k.add(bow);
      const bit = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.03), m); bit.position.set(0.05, len - 0.04, 0); k.add(bit);
      g.add(k);
    }
    return g;
  },
  // Col's carter's whip: a long ash stock carried upright (it runs along −y from the grip, like the
  // Standard, so hanging it plumb stands it up) with the lash looped back over the top
  whip: () => {
    const g = new THREE.Group(); g.name = 'Carter_Whip'; g.userData.hang = true;
    const wood = mat(0x5a3a22, 0, 0.85), lash = mat(0x2a1a10, 0, 0.9);
    const stock = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.04, 1.6, 6), wood); stock.position.y = -0.62; g.add(stock);
    const pts = [[0, -1.42], [0.1, -1.55], [0.28, -1.5], [0.36, -1.3], [0.38, -1.05], [0.42, -0.85]].map(([x, y]) => new THREE.Vector3(x, y, 0));
    const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.018, 5, false), lash); g.add(t);
    return g;
  },
  // a smith's leather apron, worn on the hips (`wear` in variants.json): bib up the chest, skirt to the
  // knee, split so the legs can stride
  apron: () => {
    const g = new THREE.Group(); g.name = 'Apron';
    const leather = mat(0x6a4428, 0, 0.85), strap = mat(0x2e1f18, 0, 0.9);
    // (hips bone space: y up from the hips at 0.39, z forward; the barbarian's front is ~0.3 out)
    const bib = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.04), leather); bib.position.set(0, 0.32, 0.33); bib.rotation.x = -0.08; bib.name = 'Apron_Bib'; g.add(bib);
    for (const x of [-0.1, 0.1]) { const sk = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.3, 0.04), leather); sk.position.set(x, -0.08, 0.3); sk.rotation.x = 0.12; sk.name = 'Apron_Skirt'; g.add(sk); }
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.06), strap); belt.position.set(0, 0.11, 0.32); g.add(belt);
    return g;
  },
  // the Redhand brute's kettle hat (worn on the head bone): a deserter's issue iron, a low dome on a wide sloping brim,
  // with a band of the Company's red. He wore the barbarian hero's own hat, and only the shirt told them apart.
  // (head bone space, before its 0.62 scale: the head spans x ±0.54, y −0.11 … 0.95)
  kettle: () => {
    const g = new THREE.Group(); g.name = 'Kettle_Hat';
    const iron = mat(0x77736e, 0.6, 0.55), rim = mat(0x56524e, 0.6, 0.6), red = mat(0x9a2a1e, 0, 0.9);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.6, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), iron); dome.scale.set(1, 0.72, 1); dome.position.set(0, 0.6, 0.02); g.add(dome);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.9, 0.12, 16, 1, true), rim); brim.position.set(0, 0.56, 0.02); g.add(brim);
    const under = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.9, 0.12, 16, 1, true), rim); under.material = rim.clone(); under.material.side = THREE.BackSide; under.position.copy(brim.position); g.add(under);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.615, 0.615, 0.12, 16), red); band.position.set(0, 0.68, 0.02); g.add(band);
    g.traverse((o) => { if (o.isMesh) o.name = 'Kettle_Hat'; });
    return g;
  },
  // the Ashbound minion's rag (skeleton-skull proposal, shipped): what's left of a cloak, worn low on the
  // shoulders so the jaw and the ribcage show. KayKit's cloak rode up over the jaw, and the skull read as an egg.
  // (chest bone space: y up from the chest at 1.07 m, z forward; the jaw starts about 0.22 up, the shoulders at 0.13)
  rag: () => {
    const g = new THREE.Group(); g.name = 'Rag';
    const cloth = mat(0xc06a48, 0, 0.95), dark = mat(0x84402a, 0, 0.95);   // (the minion's bake gain is 0.62: lighter than it reads)
    const tongues = (x0, w, z, top, lens, tilt = 0) => lens.forEach((len, k) => {   // a hem torn into strips of uneven length
      const t = new THREE.Mesh(new THREE.BoxGeometry(w / lens.length, len, 0.03), k % 3 === 1 ? dark : cloth);
      t.position.set(x0 + (k + 0.5) * (w / lens.length) - w / 2, top - len / 2, z); t.rotation.x = tilt; t.name = 'Rag_Cloth'; g.add(t);
    });
    // over the shoulders, a mantle joining back to front
    for (const sx of [-1, 1]) { const cap = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.025, 0.5), cloth); cap.position.set(sx * 0.21, 0.15, 0); cap.rotation.z = sx * -0.5; cap.name = 'Rag_Cloth'; g.add(cap); }
    // the back: a broad panel from the shoulders down past the shoulder blades
    tongues(0, 0.62, -0.25, 0.17, [0.36, 0.46, 0.32, 0.5, 0.4, 0.3, 0.44], -0.1);
    // in front, only a torn fringe at the collarbones: long lapels read as stripes down the ribs
    for (const sx of [-1, 1]) tongues(sx * 0.19, 0.2, 0.24, 0.17, sx < 0 ? [0.11, 0.06, 0.09] : [0.08, 0.12, 0.05], 0.12);
    return g;
  },
  // the Vale's bows (world doc §3.1 v1.10), held the way the kit holds its crossbows: gripped in
  // the right hand slot, shooting along +x, the limbs up and down (±y) bending back toward the
  // archer, the string behind (−x). The hunting bow is short and dark with a recurve at the tips;
  // the yew longbow is taller and pale, with horn nocks.
  huntbow: () => bow({ name: 'Hunting_Bow', half: 0.7, draw: 0.2, curl: 0.08, wood: 0x8a5a32, nock: 0x2e1f18, r: 0.045 }),
  longbow: () => bow({ name: 'Yew_Longbow', half: 1.0, draw: 0.24, curl: 0, wood: 0xb07a40, nock: 0xe8dcc0, r: 0.042 }),
};

function bow({ name, half, draw, curl, wood, nock, r }) {
  const g = new THREE.Group(); g.name = name;
  const W = mat(wood, 0, 0.75), N = mat(nock, 0.1, 0.5), leather = mat(0x2e1f18, 0, 0.9), string = mat(0xe6dcc8, 0, 0.8);
  // one limb, grip to tip, as a tapering tube: back toward the archer as it goes out, the tip flicked forward by `curl`
  const limb = (s) => {
    const pts = [0, 0.25, 0.5, 0.75, 1].map((t) => new THREE.Vector3(-draw * t * t + curl * Math.max(0, t - 0.75) * 4, s * half * t, 0));
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, r, 6, false), pos = tube.attributes.position;
    for (let i = 0; i < pos.count; i++) {                       // taper: full at the grip, 45 % at the tip
      const y = pos.getY(i), t = Math.min(1, Math.abs(y) / half), k = 1 - 0.55 * t, c = pts[Math.round(t * 4)];
      pos.setX(i, c.x + (pos.getX(i) - c.x) * k); pos.setZ(i, pos.getZ(i) * k);
    }
    const m = new THREE.Mesh(tube, W); m.name = name + '_Limb'; g.add(m);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(r * 0.9, 8, 6), N); tip.position.copy(pts[4]); tip.name = name + '_Nock'; g.add(tip);
    return pts[4];
  };
  const top = limb(1), bot = limb(-1);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.5, r * 1.5, 0.24, 8), leather); grip.name = name + '_Grip'; g.add(grip);
  const s = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, top.distanceTo(bot), 4), string);
  s.position.set((top.x + bot.x) / 2, 0, 0); s.name = name + '_String'; g.add(s);
  return g;
}

// KayKit textures are an 8 × 4 grid of gradient swatches; a mesh's colour is the swatch its UVs
// sit in. swatches(image, [{ tile: [col, row], to: [light, dark] }]) repaints each listed swatch
// between two colours by the swatch's own luminance, so its gradient and highlight stripe survive.
export function swatches(img, list) {
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const x = cv.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
  const tw = img.width / 8, th = img.height / 4, hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  for (const { tile: [c, r], to: [light, dark] } of list) {
    const d = x.getImageData(c * tw, r * th, tw, th), p = d.data, L = hex(light), D = hex(dark);
    let lo = 255, hi = 0; const lum = (i) => 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2];
    for (let i = 0; i < p.length; i += 4) { const l = lum(i); lo = Math.min(lo, l); hi = Math.max(hi, l); }
    for (let i = 0; i < p.length; i += 4) { const t = hi > lo ? (lum(i) - lo) / (hi - lo) : 1; for (let k = 0; k < 3; k++) p[i + k] = D[k] + (L[k] - D[k]) * t; }
    x.putImageData(d, c * tw, r * th);
  }
  return cv;
}

// swap every textured material under `root` for one whose map has the swatches repainted
export function repaint(root, list) {
  const done = new Map();
  root.traverse((o) => { if (!o.isMesh || !o.material.map || /Eyes/.test(o.name)) return;
    let m = done.get(o.material);
    if (!m) { const src = o.material.map, t = new THREE.CanvasTexture(swatches(src.image, list));
      t.flipY = src.flipY; t.colorSpace = src.colorSpace; t.magFilter = src.magFilter; t.minFilter = src.minFilter; t.wrapS = src.wrapS; t.wrapT = src.wrapT;
      m = o.material.clone(); m.map = t; done.set(o.material, m); }
    o.material = m; });
}
