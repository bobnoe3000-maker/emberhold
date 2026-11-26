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
  // the passers-by's work in hand (critic pass 11k, scored against the owner's reference: its villagers carry
  // their trade; ours strolled empty-handed). A farmhand's hoe, carried upright like Col's whip (along −y from the
  // grip, so hanging it plumb stands it up), its iron blade over the shoulder
  hoe: () => {
    const g = new THREE.Group(); g.name = 'Hoe'; g.userData.hang = true;
    const wood = mat(0x8a6238, 0, 0.85), iron = mat(0x5a5c60, 0.8, 0.45);
    const stock = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.036, 1.5, 6), wood); stock.position.y = -0.6; g.add(stock);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.2), iron); blade.position.set(0.1, -1.36, 0); blade.rotation.z = 0.25; g.add(blade);
    return g;
  },
  // a drover's wooden pail with an iron bail, hanging at the side
  pail: () => {
    const g = new THREE.Group(); g.name = 'Pail'; g.userData.hang = true;
    const wood = mat(0x8a5e34, 0, 0.85), iron = mat(0x3e3a38, 0.7, 0.5), milk = mat(0xf0ead8, 0, 0.5);
    const bail = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.018, 6, 14, Math.PI), iron); bail.rotation.z = Math.PI; bail.position.y = 0.16; g.add(bail);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.3, 10), wood); body.position.y = 0.36; g.add(body);
    for (const y of [0.26, 0.46]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.185, 0.014, 4, 14), iron); h.rotation.x = Math.PI / 2; h.position.y = y; g.add(h); }
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.02, 10), milk); top.position.y = 0.23; g.add(top);
    return g;
  },
  // a miller's sack of flour, its neck gathered in the fist, the body slumped below
  flour: () => {
    const g = new THREE.Group(); g.name = 'Flour_Sack'; g.userData.hang = true;
    const hemp = mat(0xd8ccae, 0, 0.95), cord = mat(0x6a4a2a, 0, 0.9);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.16, 8), hemp); neck.position.y = 0.12; g.add(neck);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.016, 4, 10), cord); tie.rotation.x = Math.PI / 2; tie.position.y = 0.1; g.add(tie);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), hemp); body.scale.set(1, 1.25, 0.85); body.position.y = 0.44; g.add(body);
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
  // the Toadking's reed-cutters' hat (M8): a broad, shallow cone of plaited reed, worn on the head bone like the brute's kettle
  reedhat: () => {
    const g = new THREE.Group(); g.name = 'Reed_Hat';
    const reed = mat(0xa08a52, 0, 0.95), band = mat(0x4a5a34, 0, 0.9);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.42, 14, 1, true), reed); cone.position.set(0, 0.78, 0.02); g.add(cone);
    const under = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.42, 14, 1, true), reed.clone()); under.material.side = THREE.BackSide; under.position.copy(cone.position); g.add(under);
    const tie = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.56, 0.08, 14), band); tie.position.set(0, 0.62, 0.02); g.add(tie);
    g.traverse((o) => { if (o.isMesh) o.name = 'Reed_Hat'; });
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
  // ── the Fens' foes (M8 slice 4; world doc §8 v1.20) ──
  // the reed-cutters' bill-hook: a long ash pole, a broad iron blade at its head curving into a hook, swung two-handed
  billhook: () => {
    const g = new THREE.Group(); g.name = 'Billhook';
    const wood = mat(0x6a5236, 0, 0.85), iron = mat(0x55585c, 0.8, 0.45);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.9, 7), wood); pole.position.y = 0.45; g.add(pole);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.46, 0.2), iron); blade.position.set(0, 1.5, 0.08); g.add(blade);
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 5, 10, Math.PI * 0.9), iron); hook.position.set(0, 1.72, 0.2); hook.rotation.y = Math.PI / 2; g.add(hook);
    return g;
  },
  // a Cult harvester's lantern-cage on a pole (world doc §8): an iron cage at the pole's head with a caught soul in
  // it, pale violet (userData.glow: the soul's light); swung like a polearm
  cagepole: () => {
    const g = new THREE.Group(); g.name = 'Cagepole';
    const wood = mat(0x2e2420, 0, 0.85), iron = mat(0x3a3634, 0.75, 0.45), soul = new THREE.MeshStandardMaterial({ color: 0xc8b8ff, emissive: 0x7050d0, emissiveIntensity: 1.3, roughness: 0.3 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.0, 7), wood); pole.position.y = 0.45; g.add(pole);
    const top = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.16, 6), iron); top.position.y = 1.98; g.add(top);
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 6), iron); floor.position.y = 1.5; g.add(floor);
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3, bar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.42, 0.03), iron); bar.position.set(Math.cos(a) * 0.17, 1.71, Math.sin(a) * 0.17); g.add(bar); }
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 1), soul); s.position.y = 1.7; s.name = 'Cage_Soul'; s.userData.glow = 0xb8a0ff; g.add(s);
    return g;
  },
  // (M8.6, world doc v1.27) the Toadking's boat-hook: a long tarred pole, an iron spike at its head and a hook curving
  // back off it, a ring of rope at the grip; swung two-handed like the bill-hook
  boathook: () => {
    const g = new THREE.Group(); g.name = 'Boathook';
    const wood = mat(0x3e3226, 0, 0.85), iron = mat(0x4a4c4e, 0.8, 0.45), rope = mat(0x8a7a52, 0, 0.95);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.1, 7), wood); pole.position.y = 0.5; g.add(pole);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.34, 6), iron); spike.position.y = 1.72; g.add(spike);
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 5, 10, Math.PI * 1.1), iron); hook.position.set(0, 1.5, 0.15); hook.rotation.set(0, Math.PI / 2, Math.PI * 0.55); g.add(hook);
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 5, 10), rope); coil.rotation.x = Math.PI / 2; coil.position.y = 0.05; g.add(coil);
    return g;
  },
  // (M8.6) the Abbey's choir-lamp, as the Abbess Below carries it: pale iron, a tall cage of six ribs under a ring, and
  // the roll's light in it, cold blue-white (userData.glow); hung plumb from the hand
  choirlamp: () => {
    const g = new THREE.Group(); g.name = 'Choirlamp'; g.userData.hang = true;
    const pale = mat(0xb8bcc0, 0.7, 0.4), light = new THREE.MeshStandardMaterial({ color: 0xe0f0ff, emissive: 0x6090d0, emissiveIntensity: 1.4, roughness: 0.3 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 12), pale); ring.position.y = 0.1; g.add(ring);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.16, 6), pale); cap.rotation.z = Math.PI; cap.position.y = 0.26; g.add(cap);
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3, rib = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.4, 0.025), pale); rib.position.set(Math.cos(a) * 0.15, 0.52, Math.sin(a) * 0.15); g.add(rib); }
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 1), light); s.position.y = 0.52; s.name = 'Choir_Light'; s.userData.glow = 0xc8e0ff; g.add(s);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.12, 0.06, 6), pale); base.position.y = 0.74; g.add(base);
    return g;
  },
  // a bog-witch's marsh-light: a crooked lantern of bent withies with a cold green-white light in it, hung plumb
  marshlamp: () => {
    const g = new THREE.Group(); g.name = 'Marshlamp'; g.userData.hang = true;
    const withy = mat(0x4a4030, 0, 0.9), light = new THREE.MeshStandardMaterial({ color: 0xd8f0c8, emissive: 0x70b070, emissiveIntensity: 1.3, roughness: 0.3 });
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 4), withy); cord.position.y = 0.1; g.add(cord);
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 1), light); orb.position.y = 0.36; orb.name = 'Marsh_Light'; orb.userData.glow = 0xc8f0c0; g.add(orb);
    for (let k = 0; k < 5; k++) { const a = k * Math.PI * 0.4, w = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.014, 4, 10, Math.PI * 1.1), withy); w.position.y = 0.36; w.rotation.set(Math.PI / 2, a, 0.3); g.add(w); }
    return g;
  },
  // a bog-witch's crook: a gnarled stick, crooked at the head, carried upright
  crook: () => {
    const g = new THREE.Group(); g.name = 'Crook'; g.userData.hang = 'up';
    const wood = mat(0x4a3a28, 0, 0.9);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.8, 6), wood); stick.position.y = 0.3; stick.rotation.z = 0.04; g.add(stick);
    const head = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 5, 10, Math.PI * 1.2), wood); head.position.set(0.12, 1.22, 0); g.add(head);
    return g;
  },
  // the drowned clergy's habit (worn on the chest bone, like the minion's rag): a sodden grey cowl over the shoulders
  // and a long scapular to the knees, front and back, its hem in tatters, waterweed hanging off it
  habit: () => {
    const g = new THREE.Group(); g.name = 'Habit';
    const cloth = mat(0x8a8c84, 0, 0.95), dark = mat(0x5e605a, 0, 0.95), weed = mat(0x4a6a32, 0, 0.9);
    const cowl = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.09, 6, 12), cloth); cowl.rotation.x = Math.PI / 2; cowl.position.y = 0.2; cowl.name = 'Habit_Cloth'; g.add(cowl);
    for (const [z, tilt] of [[0.22, 0.1], [-0.24, -0.08]]) for (let k = 0; k < 5; k++) {
      const len = 0.62 + ((k * 7) % 5) * 0.06, t = new THREE.Mesh(new THREE.BoxGeometry(0.1, len, 0.03), k % 2 ? dark : cloth);
      t.position.set(-0.2 + k * 0.1, 0.16 - len / 2, z); t.rotation.x = tilt; t.name = 'Habit_Cloth'; g.add(t);
    }
    for (const [x, z, len] of [[-0.18, 0.25, 0.3], [0.12, 0.25, 0.22], [0.22, -0.27, 0.34], [-0.05, -0.27, 0.26]]) {
      const w = new THREE.Mesh(new THREE.BoxGeometry(0.035, len, 0.02), weed); w.position.set(x, 0.12 - len / 2, z); w.rotation.z = (x > 0 ? 1 : -1) * 0.12; g.add(w);
    }
    return g;
  },
  // the Vale's bows (world doc §3.1 v1.10), held the way the kit holds its crossbows: gripped in
  // the right hand slot, shooting along +x, the limbs up and down (±y) bending back toward the
  // archer, the string behind (−x). The hunting bow is short and dark with a recurve at the tips;
  // the yew longbow is taller and pale, with horn nocks.
  // ── the gear the kits lack (docs/character-look-plan.md §8; the owner, 2026-11-10: "do 1") ──────────────────────
  // Hand pieces run along +y from the grip as above; head pieces sit in the head bone's space (y up from the jaw, +z the
  // face: the KayKit head is ±0.55 wide, −0.03…1.07 tall, −0.75…0.53 deep with the mage's bun); the worn trinkets in
  // the chest's or the hips' (+z the front: the chest's −0.6…0.32, its front at z 0.39; the hips' belt near y 0.2).
  // the Chapel Sword (the cleric's): a narrow arming sword with a fuller, a gilt cross with turned-down quillons, a
  // white-wrapped grip and a sun-disc pommel: the Grey Sisters' plain blade, not the knight's broad one
  chapelsword: () => {
    const g = new THREE.Group(); g.name = 'Chapel_Sword';
    const steel = mat(0xaeb6bf, 0.9, 0.28), dark = mat(0x737a84, 0.9, 0.35), gilt = mat(0xcfa65c, 0.85, 0.32), cloth = mat(0xefe8d8, 0, 0.85);
    const half = new THREE.Shape([[0, -0.02], [0.075, 0.0], [0.07, 1.02], [0.0, 1.2], [-0.07, 1.02], [-0.075, 0.0]].map(([x, y]) => new THREE.Vector2(x, y)));
    const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(half, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 1 }), steel);
    blade.geometry.translate(0, 0, -0.0175); blade.position.y = 0.2; blade.name = 'Chapel_Sword_Blade'; g.add(blade);
    const fuller = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.78, 0.062), dark); fuller.position.y = 0.66; g.add(fuller);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.06, 0.08), gilt); cross.position.y = 0.17; g.add(cross);
    for (const s of [-1, 1]) { const q = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), gilt); q.position.set(s * 0.235, 0.13, 0); g.add(q); }
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.046, 0.3, 10), cloth); g.add(grip);
    for (const y of [-0.08, 0.0, 0.08]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.046, 0.009, 4, 12), gilt); w.rotation.x = Math.PI / 2; w.position.y = y; g.add(w); }
    const pom = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16), gilt); pom.rotation.x = Math.PI / 2; pom.position.y = -0.21; g.add(pom);
    const sun = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 8), cloth); sun.rotation.x = Math.PI / 2; sun.position.y = -0.21; g.add(sun);
    return g;
  },
  // a book held in the off hand, its spine along y, its covers ±x (the kit's Spellbook: 0.3 thick, 0.43 tall, 0.58
  // wide): the Chained Psalter in the Sisters' off-white and gilt with its chain hanging from the spine; the Book of
  // Hours small, in white leather, gilt corners and clasp, two ribbons hanging
  psalter: () => {
    const g = book({ name: 'Chained_Psalter', w: 0.4, h: 0.36, t: 0.22, cover: 0x5a2a22, edge: 0xb8903c, pages: 0xe8dcc0, clasp: 0xb8903c, corners: true });   // (oxblood and brass, as its icon)
    const iron = mat(0x8a9098, 0.85, 0.4);                                   // the chain: a dozen links from the spine's foot, sagging
    const ch = new THREE.Group(); ch.userData.hang = true; ch.position.set(0, 0.08, -0.2); g.add(ch);   // hung plumb from the spine's foot (figure.js plumb: +y down)
    for (let k = 0; k < 9; k++) { const l = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 4, 8), iron); l.position.y = 0.03 + k * 0.055; l.rotation.y = k % 2 ? Math.PI / 2 : 0; l.name = 'Chained_Psalter_Chain'; ch.add(l); }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.016, 5, 12), iron); ring.position.y = 0.55; ch.add(ring);
    return g;
  },
  hours: () => {
    const g = book({ name: 'Book_of_Hours', w: 0.3, h: 0.26, t: 0.14, cover: 0x2a3a6a, edge: 0xcfa65c, pages: 0xf2ead6, clasp: 0xcfa65c, corners: true });   // (small, in the Sisters' blue)
    for (const [z, c] of [[-0.03, 0x9a2a2a], [0.04, 0xcfa65c]]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.2, 0.03), mat(c, 0, 0.8)); r.position.set(0.0, -0.02, z); r.name = 'Book_of_Hours_Ribbon'; g.add(r); }
    return g;
  },
  // the Spirit Staff (the shaman's): a gnarled stave, its head a split crook bound with hide, hung with small bones,
  // feathers and a bead string; carried upright
  spiritstaff: () => {
    const g = new THREE.Group(); g.name = 'Spirit_Staff'; g.userData.hang = 'up';
    const wood = mat(0x7a5634, 0, 0.88), hide = mat(0xa8957a, 0, 0.95), bone = mat(0xece2ca, 0, 0.7), feather = mat(0x3a3a34, 0, 0.9), bead = mat(0xb03a2a, 0.1, 0.5);
    const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector3(Math.sin(t * 9) * 0.03, -0.62 + t * 1.72, Math.cos(t * 7) * 0.025)); }   // (its foot at the soles: −0.95 sank through the floor)
    const shaft = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.066, 7, false), wood); shaft.name = 'Spirit_Staff_Shaft'; g.add(shaft);
    for (const [a, len] of [[0.5, 0.36], [-0.6, 0.3]]) {                     // the crook: two tines splitting off the head
      const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.08, 0), new THREE.Vector3(Math.sin(a) * len * 0.5, 1.08 + len * 0.6, 0.02), new THREE.Vector3(Math.sin(a) * len, 1.08 + len * 0.85, 0)]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 8, 0.032, 6, false), wood));
    }
    const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.22, 9), hide); wrap.position.y = 0.98; g.add(wrap);
    for (let k = 0; k < 5; k++) {                                             // hung from the wrap: bones, feathers and a bead
      const a = k * 1.26, cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 4), hide); cord.position.set(Math.cos(a) * 0.08, 0.82, Math.sin(a) * 0.08); g.add(cord);
      const y = 0.7, x = Math.cos(a) * 0.09, z = Math.sin(a) * 0.09;
      if (k % 2 === 0) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 6), bone); b.position.set(x, y - 0.03, z); g.add(b);
        for (const e of [-1, 1]) { const n = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), bone); n.position.set(x, y - 0.03 + e * 0.1, z); g.add(n); } }
      else { const f = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.3, 4), feather); f.scale.z = 0.3; f.rotation.y = a; f.rotation.x = Math.PI; f.position.set(x, y - 0.02, z); g.add(f); }
    }
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), bead); b2.position.set(0, 0.9, 0.085); g.add(b2);
    return g;
  },
  // the Antler Rod (the shaman's wand): a short rod of bone-pale antler, its crown three tines, bound with sinew
  antlerrod: () => {
    const g = new THREE.Group(); g.name = 'Antler_Rod';
    const antler = mat(0xcabd9e, 0, 0.75), tip = mat(0xeee4cc, 0, 0.6), sinew = mat(0x6a4a30, 0, 0.9);
    const main = new THREE.CatmullRomCurve3([new THREE.Vector3(0, -0.26, 0), new THREE.Vector3(0.02, 0.2, 0), new THREE.Vector3(-0.02, 0.55, 0.01), new THREE.Vector3(0.03, 0.78, 0)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(main, 12, 0.045, 7, false), antler));
    for (const [a, y0, len] of [[0.7, 0.45, 0.26], [-0.8, 0.6, 0.22], [0.2, 0.78, 0.14]]) {
      const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, y0, 0), new THREE.Vector3(Math.sin(a) * len * 0.6, y0 + len * 0.5, 0.01), new THREE.Vector3(Math.sin(a) * len, y0 + len, 0)]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 6, 0.026, 6, false), antler));
      const t = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.06, 6), tip); t.position.set(Math.sin(a) * len, y0 + len + 0.02, 0); t.rotation.z = -a * 0.6; g.add(t);
    }
    for (const y of [-0.05, 0.02, 0.09]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 4, 10), sinew); w.rotation.x = Math.PI / 2; w.position.y = y; g.add(w); }
    return g;
  },
  // the Bone Fetish (the shaman's off-hand): a bundle hung from the fist on a cord: crossed bones, three fangs, two
  // feathers and red beads (the charm icon's palette). Hangs plumb (+y down)
  fetish: () => {
    const g = new THREE.Group(); g.name = 'Bone_Fetish'; g.userData.hang = true; g.scale.setScalar(1.5);   // (1.5×: it read only close up)
    const bone = mat(0xe2d6bc, 0, 0.7), cord = mat(0x6a3a22, 0, 0.9), red = mat(0x9a2a2a, 0.1, 0.4), feather = mat(0x4a4a40, 0, 0.9);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1, 4), cord); c.position.y = 0.05; g.add(c);
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), cord); knot.position.y = 0.12; g.add(knot);
    g.children.forEach((o) => { if (o !== c && o !== knot) o.position.y -= 0.1; });
    for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.26, 6), bone); b.position.y = 0.3; b.rotation.z = s * 0.7; g.add(b);
      for (const e of [-1, 1]) { const n = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 5), bone); n.position.set(Math.sin(s * 0.7) * -e * 0.13, 0.3 + Math.cos(s * 0.7) * e * 0.13, 0); g.add(n); } }
    for (const [x, z] of [[-0.05, 0.02], [0, -0.03], [0.05, 0.02]]) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.16, 6), bone); f.position.set(x, 0.4, z); g.add(f); }
    for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.24, 4), feather); f.scale.z = 0.3; f.position.set(s * 0.07, 0.36, -0.02); f.rotation.z = s * 0.25 + Math.PI; g.add(f); }
    for (const [x, y] of [[-0.05, 0.15], [0.05, 0.15], [0, 0.18], [-0.025, 0.12], [0.025, 0.12]]) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), red); b.position.set(x, y, 0.03); g.add(b); }
    return g;
  },
  // ── on the head (the head bone's space) ──
  // the Chapel Coif (the cleric's helm): the Grey Sisters' off-white wimple, close round the face and under the chin,
  // a gilt band at the brow, a veil falling behind to the shoulders
  coif: () => {
    const rzBand = 0.665, g = hoodShell({ name: 'Chapel_Coif', cloth: 0xd8ccb0, shade: 0xa89a7e, open: 0.78, rz: 0.66, tip: 0 });   // (warmer than the vestments, so the two part)
    const gilt = mat(0xcfa65c, 0.85, 0.32), cloth = mat(0xd8ccb0, 0, 0.9);
    const band = new THREE.Mesh(new THREE.TorusGeometry(1, 0.04, 5, 32, Math.PI), gilt), R = hoodRing(0.66, 0.7);   // (the gilt band across the brow, ear to ear, on the cloth)
    band.rotation.x = Math.PI / 2 + 0.12; band.scale.set(R.hx * 0.97, 0.505 - R.cz, 1); band.position.set(0, 0.68, R.cz); band.name = 'Chapel_Coif_Band'; band.userData.onFace = true; g.add(band);   // (its front on the brow, under the cloth at the temples)
    const chin = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.72, 0.3, 22, 1, true), new THREE.MeshStandardMaterial({ color: 0xd8ccb0, roughness: 0.92, side: THREE.DoubleSide })); chin.position.set(0, -0.08, -0.03); chin.name = 'Chapel_Coif_Wimple'; g.add(chin);   // (the wimple: a short flared skirt from the chin onto the shoulders)
    const veil = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.72, 0.9, 16, 1, true, Math.PI * 0.6, Math.PI * 0.8), cloth); veil.position.set(0, 0.2, -0.12); veil.name = 'Chapel_Coif_Veil'; g.add(veil);
    return g;
  },
  // the Hide Cowl (the shaman's helm): a hood of undyed hide with a fur ruff at the throat and a string of bone beads
  // at the brow
  hidecowl: () => {
    const g = hoodShell({ name: 'Hide_Cowl', cloth: 0x7a6a50, shade: 0x4a3e2c, open: 0.7, rz: 0.72, tip: 0.35 });
    const fur = mat(0x5a4a38, 0, 1), bone = mat(0xe2d6bc, 0, 0.7);
    for (let k = 0; k < 14; k++) {                                         // the ruff: tufts round the throat, behind and at the sides
      const a = k / 14 * Math.PI * 2; if (Math.abs(Math.sin(a) - 1) < 0.2) continue;   // (none in front of the chin)
      const t = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 0), fur); t.position.set(Math.cos(a) * 0.52, -0.16 + (k % 2) * 0.05, Math.sin(a) * 0.5 - 0.06); t.scale.set(1, 0.8, 1); t.rotation.set(k, k * 2, 0); t.name = 'Hide_Cowl_Ruff'; g.add(t);
    }
    for (let k = -3; k <= 3; k++) { const a = Math.PI / 2 + k * 0.2, b = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 5), bone); const y = 0.8 - Math.abs(k) * 0.025, R = hoodRing(0.72, y); b.position.set(Math.cos(a) * (R.hx + 0.02), y, Math.sin(a) * (R.hz + 0.02) + R.cz); b.userData.onFace = true; g.add(b); }   // (on the cowl's brow, its form's ring there)
    return g;
  },
  // the Hood (the rogue's), for a rogue whose head has none of its own: dark leather-brown, a point falling behind
  hood: () => hoodShell({ name: 'Rogue_Hood', cloth: 0x6a5244, shade: 0x2e2018, open: 0.68, rz: 0.72, tip: 0.5 }),
  // ── worn on the body ──
  // the Amulet: a gilt disc and a blue stone on a silver chain round the neck (the chest's space; the icon's own)
  amulet: () => {
    const g = new THREE.Group(); g.name = 'Amulet';
    const silver = mat(0xa8843a, 0.85, 0.4), gold = mat(0xd9a441, 0.9, 0.3), gem = new THREE.MeshStandardMaterial({ color: 0x3f8cff, metalness: 0.1, roughness: 0.15, emissive: 0x0a2a70, emissiveIntensity: 0.6 });
    for (const s of [-1, 1]) {                                               // the chain: from either side of the neck down to the disc, on the chest
      const A = new THREE.Vector3(s * 0.15, 0.2, 0.345), B = new THREE.Vector3(0, 0.04, 0.405), c = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, A.distanceTo(B), 4), silver);
      c.position.copy(A).add(B).multiplyScalar(0.5); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); c.name = 'Amulet_Chain'; g.add(c);
    }
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.024, 16), gold); disc.rotation.x = Math.PI / 2; disc.position.set(0, 0.0, 0.42); g.add(disc);
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 9), gem); s.scale.z = 0.6; s.position.set(0, 0.0, 0.44); s.name = 'Amulet_Gem'; g.add(s);
    return g;
  },
  // the Charm: a fang and two red beads on a cord, tied at the belt's right (the hips' space)
  charm: () => {
    const g = new THREE.Group(); g.name = 'Charm';
    const bone = mat(0xe6dcc4, 0, 0.7), cord = mat(0x6a3a22, 0, 0.9), red = mat(0x9a2a2a, 0.1, 0.35);
    const at = new THREE.Group(); at.position.set(-0.4, 0.0, 0.2); at.rotation.y = -0.9; at.scale.setScalar(1.5); g.add(at);   // (at the outer hip, 1.5×: at the buckle it was lost)
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.14, 4), cord); c.position.set(0, 0.17, 0); at.add(c);
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.17, 8), bone); f.rotation.z = Math.PI; f.position.set(0, 0.01, 0.01); f.name = 'Charm_Fang'; at.add(f);
    for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), red); b.position.set(s * 0.035, 0.11, 0.015); at.add(b); }
    return g;
  },
  // a quiver on the back, its fletchings over the right shoulder (the chest's space; outside the cape)
  quiver: () => {
    const g = new THREE.Group(); g.name = 'Quiver';
    const leather = mat(0x5a3a26, 0, 0.85), trim = mat(0x2e1f18, 0, 0.9), shaft = mat(0xb08a5a, 0, 0.8), fletch = mat(0xd8d0c0, 0, 0.9);
    const q = new THREE.Group(); q.position.set(-0.08, -0.02, -0.46); q.rotation.z = 0.42; g.add(q);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.66, 10), leather); q.add(body);
    for (const y of [0.3, -0.3]) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.016, 4, 12), trim); t.rotation.x = Math.PI / 2; t.position.y = y; q.add(t); }
    for (let k = 0; k < 5; k++) { const a = k * 1.3, x = Math.cos(a) * 0.05, z = Math.sin(a) * 0.05;
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 4), shaft); s.position.set(x, 0.42, z); q.add(s);
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.008), fletch); f.position.set(x, 0.5, z); f.rotation.y = a; q.add(f); }
    const strap = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 4, 24, Math.PI), trim); strap.rotation.set(0, 0, -0.9); strap.position.set(0, 0.0, 0.0); strap.scale.set(1, 1, 1.0); g.add(strap);
    return g;
  },
  // a bolt case at the right hip, for the crossbows (the hips' space)
  boltcase: () => {
    const g = new THREE.Group(); g.name = 'Bolt_Case';
    const leather = mat(0x4a3022, 0, 0.85), iron = mat(0x8a9098, 0.85, 0.4), shaft = mat(0x9a7a50, 0, 0.8);
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.16), leather); c.position.set(-0.42, 0.12, 0.08); c.rotation.z = -0.15; g.add(c);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.17), iron); lid.position.set(-0.44, 0.28, 0.08); lid.rotation.z = -0.15; g.add(lid);
    const fl = mat(0xe8e0cc, 0, 0.85);
    for (const [x, z] of [[-0.43, 0.03], [-0.45, 0.08], [-0.43, 0.13], [-0.46, 0.115]]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.18, 4), shaft); b.position.set(x, 0.36, z); b.rotation.z = -0.15; g.add(b);
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.008), fl); f.position.set(x - 0.012, 0.44, z); f.rotation.set(0, z * 9, -0.15); g.add(f); }
    return g;
  },
  huntbow: () => bow({ name: 'Hunting_Bow', half: 0.7, draw: 0.2, curl: 0.08, wood: 0x8a5a32, nock: 0x2e1f18, r: 0.045 }),
  longbow: () => bow({ name: 'Yew_Longbow', half: 1.0, draw: 0.24, curl: 0, wood: 0xb07a40, nock: 0xe8dcc0, r: 0.042 }),

  // ── the Cinder Reach's people (world doc v1.53 §3.3; docs/art-critic-pass-reach-cast.md) ──
  // the Charter-Reeve's chain of office (the chest's space): broad brass links over the shoulders and down the breast to
  // the charter's seal, a disc with the clans' crossed pick and hammer on it. Broad and bright, so a bright V reads on her
  // dark coat at 56 px where a fine chain was lost
  chain: () => {
    const g = new THREE.Group(); g.name = 'Office_Chain';
    const brass = mat(0xd0a048, 0.85, 0.32), dark = mat(0x6a4a1e, 0.8, 0.45), iron = mat(0x3a3836, 0.8, 0.5);
    const curve = new THREE.CatmullRomCurve3([[-0.34, 0.25, -0.06], [-0.3, 0.17, 0.22], [-0.17, 0.02, 0.4], [0, -0.06, 0.45], [0.17, 0.02, 0.4], [0.3, 0.17, 0.22], [0.34, 0.25, -0.06], [0, 0.3, -0.3]].map((p) => new THREE.Vector3(...p)), true);
    const n = 30, at = new THREE.Vector3(), t = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      curve.getPointAt(i / n, at); curve.getTangentAt(i / n, t);
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.03, 0.05), i % 2 ? dark : brass); l.position.copy(at);
      l.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), t); l.name = 'Office_Chain_Link'; g.add(l);
    }
    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 18), brass); seal.rotation.x = Math.PI / 2 - 0.2; seal.position.set(0, -0.15, 0.46); seal.name = 'Office_Chain_Seal'; g.add(seal);
    for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.012), iron); b.rotation.set(-0.2, 0, s * 0.75); b.position.set(0, -0.15, 0.48); g.add(b); }   // (the crossed pick and hammer)
    return g;
  },
  // a slag hauler's hod (the chest's space, on his back): a tapered wooden trough on two straps, heaped with slag, a few
  // lumps of it still red. The hauler's whole silhouette: the load stands up over his shoulders
  hod: () => {
    const g = new THREE.Group(); g.name = 'Slag_Hod';
    const wood = mat(0x7a5634, 0, 0.9), band = mat(0x3e3a36, 0.7, 0.55), strap = mat(0x3a2818, 0, 0.9);   // (round R1: darker, the hod was lost against his back)
    const slag = [mat(0x2e2a28, 0.1, 0.9), mat(0x45403a, 0.1, 0.85), mat(0x24201e, 0.1, 0.95)];
    const hot = new THREE.MeshStandardMaterial({ color: 0xff8a40, emissive: 0xd04010, emissiveIntensity: 1.4, roughness: 0.6 });
    const box = new THREE.Group(); box.position.set(0, 0.46, -0.62); box.rotation.x = -0.16; g.add(box);   // (round R2: up over his shoulders, so its load stands over his head from the game's camera)
    const W = 0.66, D = 0.42, H = 0.9;
    for (const s of [-1, 1]) {
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.05, H, D), wood); side.position.set(s * W / 2, 0, 0); side.rotation.z = -s * 0.1; box.add(side);
      const end = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.05), wood); end.position.set(0, 0, s * D / 2); box.add(end);
    }
    const floor = new THREE.Mesh(new THREE.BoxGeometry(W - 0.05, 0.05, D), wood); floor.position.y = -H / 2 + 0.03; box.add(floor);
    for (const y of [-0.28, 0.3]) { const b = new THREE.Mesh(new THREE.BoxGeometry(W + 0.1, 0.06, D + 0.06), band); b.position.y = y; box.add(b); }
    // the heap: lumps over the rim, the hot ones in among them
    const lumps = [[-0.18, 0.49, 0.05, 0.17], [0.12, 0.53, -0.06, 0.19], [0.0, 0.66, 0.02, 0.16], [0.22, 0.47, 0.1, 0.13], [-0.08, 0.51, -0.12, 0.15], [-0.24, 0.45, -0.1, 0.12], [0.08, 0.77, 0.04, 0.11]];
    lumps.forEach(([x, y, z, r], i) => { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), slag[i % 3]); l.position.set(x, y, z); l.rotation.set(i, i * 2.1, i * 0.7); l.name = 'Slag_Hod_Slag'; box.add(l); });
    for (const [x, y, z, r] of [[0.06, 0.56, 0.15, 0.08], [-0.14, 0.62, 0.07, 0.07], [0.2, 0.6, -0.08, 0.06]]) { const e = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), hot); e.position.set(x, y, z); e.name = 'Slag_Hod_Ember'; e.userData.glow = 0xff7030; box.add(e); }
    for (const s of [-1, 1]) {   // the straps: over each shoulder, down the breast, under the arm to the hod's foot
      const st = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 4, 16, Math.PI * 1.25), strap); st.rotation.set(0, Math.PI / 2, Math.PI * 0.62); st.position.set(s * 0.2, 0.0, -0.08); st.scale.set(1, 1.15, 1.05); g.add(st);
    }
    return g;
  },
  // a coal shovel (the slag hauler's weapon, two-handed): an ash haft, a socket, a broad iron blade, dished
  shovel: () => {
    const g = new THREE.Group(); g.name = 'Slag_Shovel';
    const wood = mat(0x6a4a2a, 0, 0.8), iron = mat(0x3e3c3a, 0.85, 0.45), rust = mat(0x6a3a22, 0.4, 0.7);
    const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 1.6, 8), wood); haft.position.y = 0.45; g.add(haft);
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.22, 8), iron); socket.position.y = 1.32; g.add(socket);
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.44, 12, 1, true, -0.75, 1.5), iron); blade.material = iron.clone(); blade.material.side = THREE.DoubleSide;
    blade.position.set(0, 1.62, -0.2); blade.name = 'Slag_Shovel_Blade'; g.add(blade);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.035, 0.05), rust); lip.position.set(0, 1.83, 0.02); g.add(lip);
    return g;
  },
  // a miner's pick, carried by the haft's end (hangs plumb: the head by the knee)
  pickaxe: () => {
    const g = new THREE.Group(); g.name = 'Miner_Pick'; g.userData.hang = true;
    const wood = mat(0x6a4a2a, 0, 0.8), iron = mat(0x4a4846, 0.85, 0.42);
    const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.92, 8), wood); haft.position.y = 0.38; g.add(haft);
    for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.42, 6), iron); p.rotation.z = -s * (Math.PI / 2 - 0.25); p.position.set(s * 0.2, 0.8, 0); p.name = 'Miner_Pick_Head'; g.add(p); }
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.1), iron); eye.position.y = 0.84; g.add(eye);
    return g;
  },
  // a miner's flame lamp (Old Brannagh's, the lamp woman's; a few of the Seam's men): a brass pot, a glass round the flame
  // in an iron gauze, a brass bonnet and a hook, carried hanging. Lit.
  minerlamp: () => {
    const g = new THREE.Group(); g.name = 'Miner_Lamp'; g.userData.hang = true;
    const brass = mat(0xc89a48, 0.85, 0.35), iron = mat(0x3a3836, 0.7, 0.5), glass = new THREE.MeshStandardMaterial({ color: 0xffd080, emissive: 0xd07018, emissiveIntensity: 1.3, roughness: 0.3 });
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 5, 12), iron); hook.position.y = 0.06; g.add(hook);
    const bonnet = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.14, 10), brass); bonnet.position.y = 0.18; g.add(bonnet);
    const flame = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.2, 10), glass); flame.position.y = 0.35; flame.name = 'Miner_Lamp_Glass'; flame.userData.glow = 0xffb048; g.add(flame);
    for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI * 2, bar = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.22, 0.022), iron); bar.position.set(Math.cos(a) * 0.1, 0.35, Math.sin(a) * 0.1); g.add(bar); }
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.11, 0.16, 12), brass); pot.position.y = 0.53; g.add(pot);
    return g;
  },
  // a miner's leather cap (the head bone's space, as the brute's kettle): a close skull-cap with a short peak; `lamp`, a
  // candle-lamp's brass bracket on its front
  minercap: () => minerCap(false),
  lampcap: () => minerCap(true),
  // the Slagborn wise-woman's beads (the chest's space): three strings hung round the neck, bone, red and amber, and a
  // few iron charms on them. Mother Coke's; her rattle of them is how the clans know she's coming
  beads: () => {
    const g = new THREE.Group(); g.name = 'Wise_Beads';
    const cols = [mat(0xe2d6bc, 0, 0.7), mat(0xa02a1e, 0.1, 0.4), mat(0xd08a2a, 0.2, 0.35), mat(0x2a2624, 0.6, 0.5)];
    [[0.06, 0], [-0.06, 1], [-0.18, 2]].forEach(([low, c0], k) => {
      const curve = new THREE.CatmullRomCurve3([[-0.26, 0.24, 0.02], [-0.22, 0.12, 0.3], [0, low, 0.44], [0.22, 0.12, 0.3], [0.26, 0.24, 0.02]].map((p) => new THREE.Vector3(...p)));
      const n = 11 + k * 2, at = new THREE.Vector3();
      for (let i = 0; i <= n; i++) { curve.getPointAt(i / n, at); const b = new THREE.Mesh(new THREE.SphereGeometry(0.03 + 0.008 * ((i + k) % 2), 7, 5), cols[(i + c0) % 3]); b.position.copy(at); b.name = 'Wise_Beads_Bead'; g.add(b); }
    });
    for (const [x, y] of [[-0.1, -0.08], [0.0, -0.26], [0.12, -0.1]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 6), cols[3]); c.rotation.x = Math.PI / 2; c.position.set(x, y, 0.45); g.add(c); }
    return g;
  },
  // sleeve garters (a clerk's: Wynn Sallow's), one on each upper arm (that bone's space, the arm along +y)
  garter: () => {
    const g = new THREE.Group(); g.name = 'Sleeve_Garter';
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 6, 16), mat(0xb0302a, 0, 0.6)); t.rotation.x = Math.PI / 2; t.position.y = 0.2; g.add(t);
    return g;
  },
  // Tamsin Coalbrook's hammer, her focus: a smith's cross-peen with the Ember worked into the iron, its faces and a seam
  // round the head lit (carried head up, as the mage's wand is)
  emberhammer: () => {
    const g = new THREE.Group(); g.name = 'Ember_Hammer'; g.userData.hang = 'up';
    const wood = mat(0x5a3e24, 0, 0.8), iron = mat(0x3a3a3e, 0.85, 0.4), leather = mat(0x2e1f18, 0, 0.9);
    const lit = new THREE.MeshStandardMaterial({ color: 0xffa050, emissive: 0xe05a10, emissiveIntensity: 1.5, roughness: 0.4 });
    const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.72, 8), wood); haft.position.y = 0.22; g.add(haft);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.24, 8), leather); grip.position.y = -0.02; g.add(grip);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.18), iron); head.position.y = 0.6; head.name = 'Ember_Hammer_Head'; g.add(head);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.06, 10), lit); face.rotation.z = Math.PI / 2; face.position.set(0.23, 0.6, 0); face.name = 'Ember_Hammer_Face'; face.userData.glow = 0xff8030; g.add(face);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.19, 0.19), lit); seam.position.set(0.02, 0.6, 0); seam.name = 'Ember_Hammer_Seam'; seam.userData.glow = 0xff8030; g.add(seam);
    const peen = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.16), iron); peen.position.set(-0.24, 0.6, 0); g.add(peen);
    return g;
  },
  // a smith's tongs, a hot billet in the jaws (Tamsin's off hand): carried hanging
  tongs: () => {
    const g = new THREE.Group(); g.name = 'Smith_Tongs'; g.userData.hang = true;
    const iron = mat(0x3a3a3e, 0.85, 0.42), hot = new THREE.MeshStandardMaterial({ color: 0xffb060, emissive: 0xe06010, emissiveIntensity: 1.5, roughness: 0.5 });
    for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.62, 0.03), iron); r.position.set(s * 0.025, 0.3, 0); r.rotation.z = s * 0.04; g.add(r); }
    const billet = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.06), hot); billet.position.set(0, 0.68, 0.05); billet.rotation.x = 1.2; billet.name = 'Smith_Tongs_Billet'; billet.userData.glow = 0xff8030; g.add(billet);
    return g;
  },
  // Wynn Sallow's scales (the Ashgate Exchange: the Assay's set, the one he's using): a brass beam on a hook, two pans
  // hung off it on cords, carried hanging
  scales: () => {
    const g = new THREE.Group(); g.name = 'Brass_Scales'; g.userData.hang = true;
    const brass = mat(0xc89a48, 0.85, 0.35), cord = mat(0x3a2a1e, 0, 0.9);
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.014, 5, 10), brass); hook.position.y = 0.05; g.add(hook);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.12, 6), brass); post.position.y = 0.14; g.add(post);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.035), brass); beam.position.y = 0.2; beam.name = 'Brass_Scales_Beam'; g.add(beam);
    for (const s of [-1, 1]) {
      for (const dz of [-0.05, 0.05]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.26, 4), cord); c.position.set(s * 0.29, 0.33, dz); c.rotation.x = -Math.sign(dz) * 0.2; g.add(c); }
      const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 0.05, 12), brass); pan.position.set(s * 0.29, 0.47, 0); pan.name = 'Brass_Scales_Pan'; g.add(pan);
    }
    return g;
  },
  // the Charter-Reeve's charter: a roll of parchment tied with a red cord, the clans' seal hanging off it
  charter: () => {
    const g = new THREE.Group(); g.name = 'Charter';
    const vellum = mat(0xd8c8a0, 0, 0.85), red = mat(0x8a2a20, 0, 0.6), wax = mat(0xa8301e, 0.1, 0.4);
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.62, 12), vellum); roll.position.y = 0.2; roll.name = 'Charter_Roll'; g.add(roll);
    for (const y of [0.0, 0.4]) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.012, 4, 12), red); t.rotation.x = Math.PI / 2; t.position.y = y; g.add(t); }
    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 12), wax); seal.rotation.z = Math.PI / 2; seal.position.set(0.08, 0.32, 0.03); g.add(seal);
    return g;
  },
  // a tavern-keeper's linen apron (Bel Ruddle's), as the smith's leather one is worn
  linenapron: () => apronOf({ name: 'Linen_Apron', cloth: 0xc8bca0, strap: 0x5a3a24 }),
  // the dwarf-folk's beards (the head bone's space, under a face's own 'full' beard): the clans wear them long, down over
  // the breast, and the Slagborn braid theirs and ring the braids in brass. At 56 px from the game's camera a face's
  // beard was hidden under the chin; this is what reads of a Deepdelver or a Slagborn from above
  beardcopper: () => greatBeard({ name: 'Beard_Copper', hair: 0xa65428, len: 1.0 }),                 // Haldor's, a great copper spade
  beardbraids: () => greatBeard({ name: 'Beard_Braids', hair: 0x4a4440, len: 0.8, braids: true }),   // Gunnar's, iron-grey, braided, his rings gone dull
  beardrust: () => greatBeard({ name: 'Beard_Rust', hair: 0x7e3a1e, len: 0.75, braids: true }),       // a Slagborn picker's
  beardchestnut: () => greatBeard({ name: 'Beard_Chestnut', hair: 0x6e3e24, len: 0.85 }),            // a Deepdelver miner's
  beardash: () => greatBeard({ name: 'Beard_Ash', hair: 0x8a8278, len: 1.15, braids: true }),          // Oruth's, ash-grey, three centuries in the forge
  beardcut: () => greatBeard({ name: 'Beard_Cut', hair: 0x2e2620, len: 0.45, braids: true }),         // a renegade's, the clan's braids hacked short

  // ── the rest of Act III (reach-plan.md "The build sheet"; docs/art-critic-pass-reach-cast.md) ──
  // the Kell Assay's badge (the chest's space, on the breast): a brass disc, a scale-beam over a pick
  assaybadge: () => {
    const g = new THREE.Group(); g.name = 'Assay_Badge';
    const brass = mat(0xd0a048, 0.85, 0.32), dark = mat(0x3a2a10, 0.6, 0.5);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 18), brass); disc.rotation.x = Math.PI / 2; disc.position.set(0, 0.06, 0.43); g.add(disc);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.02, 0.012), dark); beam.position.set(0, 0.1, 0.45); g.add(beam);
    for (const s of [-1, 1]) { const pan = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.012), dark); pan.position.set(s * 0.07, 0.06, 0.45); g.add(pan); }
    const pick = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.14, 0.012), dark); pick.position.set(0, 0.03, 0.45); g.add(pick);
    return g;
  },
  // a renegade's war-pick (a weapon: held as the kit's are, not hanging)
  warpick: () => { const g = PROPS.pickaxe(); g.name = 'War_Pick'; delete g.userData.hang; g.scale.setScalar(1.15); return g; },
  // a forge-wight's sledge: an iron head as big as its skull, its striking face still hot
  forgehammer: () => sledge({ name: 'Forge_Sledge', haft: 1.0, head: [0.48, 0.24, 0.24], hot: true }),
  // Oruth's great hammer: the empire's forge-hammer, brass-banded, the clans' runes along its head lit
  greathammer: () => sledge({ name: 'Oruth_Hammer', haft: 1.45, head: [0.72, 0.34, 0.34], hot: true, bands: true }),
  // a smith's gauntlet (the lower arm's space, over the wrist): a thick leather cuff
  gauntlet: () => { const g = new THREE.Group(); g.name = 'Smith_Gauntlet'; const c = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.26, 10), mat(0x5a3a22, 0, 0.85)); c.position.y = 0.3; g.add(c); return g; },
  // the binding's shackle (the lower arm's space): an iron cuff at the wrist, a broken chain hanging off it
  shackle: () => {
    const g = new THREE.Group(); g.name = 'Binding_Shackle';
    const iron = mat(0x4a4644, 0.8, 0.5), rust = mat(0x6a3a22, 0.4, 0.7);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 10), iron); cuff.position.y = 0.3; g.add(cuff);
    for (let k = 0; k < 5; k++) { const l = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.016, 4, 8), k % 2 ? rust : iron); l.scale.y = 1.5; l.position.set(0.14, 0.26 - k * 0.12, 0.04); if (k % 2) l.rotation.y = Math.PI / 2; g.add(l); }
    return g;
  },
  // the forge-wight's lit cracks (the chest's space, over the ribcage): the binding's fire showing through the bone
  embercracks: () => {
    const g = new THREE.Group(); g.name = 'Ember_Cracks';
    const hot = new THREE.MeshStandardMaterial({ color: 0xffa040, emissive: 0xe05a10, emissiveIntensity: 1.6, roughness: 0.5 });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 0), hot); core.position.set(0.0, 0.05, 0.12); core.name = 'Ember_Cracks_Core'; core.userData.glow = 0xff8030; g.add(core);
    for (const [x, y, a, l] of [[-0.12, 0.12, 0.6, 0.18], [0.1, 0.16, -0.5, 0.16], [-0.06, -0.06, -0.3, 0.14], [0.13, -0.02, 0.4, 0.15]]) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.025, l, 0.03), hot); c.position.set(x, y, 0.2); c.rotation.z = a; c.name = 'Ember_Cracks_Seam'; c.userData.glow = 0xff8030; g.add(c);
    }
    return g;
  },
  // a furnace-priest's censer: a pierced brass ball of coals on a chain, smoking, carried hanging (it swings in the casts)
  censer: () => censerOf(1),
  bigcenser: () => censerOf(1.5),
  // the Weighmaster's scale-pan, swung on its chain like a flail (hanging)
  scalepan: () => {
    const g = new THREE.Group(); g.name = 'Scale_Pan'; g.userData.hang = true;
    const brass = mat(0xd0a048, 0.85, 0.32), iron = mat(0x4a4644, 0.8, 0.5);
    for (let k = 0; k < 6; k++) { const l = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.014, 4, 8), iron); l.scale.y = 1.5; l.position.y = 0.06 + k * 0.1; if (k % 2) l.rotation.y = Math.PI / 2; g.add(l); }
    for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI * 2, c = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.3, 4), iron); c.position.set(Math.cos(a) * 0.1, 0.78, Math.sin(a) * 0.1); c.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35); g.add(c); }
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.16, 0.08, 16), brass); pan.position.y = 0.95; pan.name = 'Scale_Pan_Pan'; g.add(pan);
    return g;
  },
  // a clerk's black over-sleeve (the lower arm's space): the Weighmaster keeps his coat clean
  sleeveguard: () => { const g = new THREE.Group(); g.name = 'Sleeve_Guard'; const c = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.36, 10), mat(0x1e1c1e, 0, 0.8)); c.position.y = 0.2; g.add(c); return g; },
  // Morrow Vane's sword-cane: a slim blade out of a black cane, its silver knob for a hilt
  swordcane: () => {
    const g = new THREE.Group(); g.name = 'Sword_Cane';
    const steel = mat(0xb8c0c8, 0.9, 0.28), black = mat(0x1a1818, 0.3, 0.4), silver = mat(0xc8ccd0, 0.9, 0.3);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8), black); grip.position.y = 0.0; g.add(grip);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), silver); knob.position.y = -0.17; g.add(knob);
    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 8), silver); ferrule.position.y = 0.16; g.add(ferrule);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.055, 1.05, 0.016), steel); blade.position.y = 0.7; blade.name = 'Sword_Cane_Blade'; g.add(blade);
    return g;
  },
  // the Stoker's rake: a long iron bar, hooked and red-hot at its end, for drawing the furnace (two-handed)
  poker: () => {
    const g = new THREE.Group(); g.name = 'Furnace_Rake';
    const iron = mat(0x3a3836, 0.85, 0.45), wood = mat(0x5a3e24, 0, 0.8), hot = new THREE.MeshStandardMaterial({ color: 0xffa050, emissive: 0xe05a10, emissiveIntensity: 1.5, roughness: 0.5 });
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), wood); grip.position.y = 0.0; g.add(grip);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.6, 6), iron); bar.position.y = 0.95; g.add(bar);
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.3, 6), hot); tip.position.y = 1.85; tip.name = 'Furnace_Rake_Tip'; tip.userData.glow = 0xff8030; g.add(tip);
    const hook = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.05), hot); hook.position.set(0.14, 1.98, 0); hook.name = 'Furnace_Rake_Hook'; hook.userData.glow = 0xff8030; g.add(hook);
    return g;
  },
  // a stoker's leather mask over the mouth and nose (the head bone's space: the face's front at z ≈ 0.5), brass-riveted
  facemask: () => {
    const g = new THREE.Group(); g.name = 'Soot_Mask';
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.5, 0.36, 18, 1, true, -1.0, 2.0), new THREE.MeshStandardMaterial({ color: 0x2a2220, roughness: 0.9, side: THREE.DoubleSide })); m.position.set(0, 0.2, -0.02); g.add(m);
    for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), mat(0xc89a48, 0.85, 0.35)); r.position.set(s * 0.32, 0.26, 0.42); g.add(r); }
    g.traverse((o) => { if (o.isMesh) o.name = 'Soot_Mask'; });
    return g;
  },
  // a Redhand halberd (Nan Ruddock's, on the Yards' gate): an ash pole, an axe-blade and a spike, a red tassel; carried upright
  halberd: () => {
    const g = new THREE.Group(); g.name = 'Halberd'; g.userData.hang = 'up';
    const wood = mat(0x6a4a2a, 0, 0.8), steel = mat(0x8a9098, 0.85, 0.35), red = mat(0x9a2a20, 0, 0.8);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 2.2, 8), wood); pole.position.y = 0.3; g.add(pole);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.36, 6), steel); spike.position.y = 1.58; g.add(spike);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.32, 0.03), steel); blade.position.set(0.17, 1.26, 0); blade.name = 'Halberd_Blade'; g.add(blade);
    const fluke = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 4), steel); fluke.rotation.z = Math.PI / 2; fluke.position.set(-0.12, 1.26, 0); g.add(fluke);
    const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 8), red); tassel.position.set(0, 1.0, 0); g.add(tassel);
    return g;
  },
  // a clerk's spectacles (the head bone's space): two brass-wire rounds on the eyes and a bridge
  specs: () => {
    const g = new THREE.Group(); g.name = 'Spectacles'; const wire = mat(0xc8a050, 0.85, 0.35);
    for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 5, 14), wire); r.position.set(s * 0.17, 0.36, 0.55); g.add(r); }
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.02), wire); b.position.set(0, 0.38, 0.56); g.add(b);
    return g;
  },
  // a mill-hand's kerchief, rust-red, tied over the hair (the head bone's space, as the hood)
  kerchief: () => hoodShell({ name: 'Kerchief', cloth: 0x8a3e24, shade: 0x3a160c, open: 0.86, rz: 0.66, tip: 0.12 }),
  // a widow's black hood and veil (Widow Pellam's)
  widowhood: () => hoodShell({ name: 'Widow_Hood', cloth: 0x262224, shade: 0x0c0a0a, open: 0.74, rz: 0.7, tip: 0.25 }),

  // ── the Tidemark's people and the Drowned Mole's foes (world doc v1.69 §3.7; docs/tidemark-plan.md's build sheet) ──
  // a drowned sailor's boarding axe: a short tarred haft, a bearded iron blade (its toe hooked down, for pulling a
  // gunwale), a back spike; rope wound at the grip. Held as the kits' one-handers are (+y from the grip, edge +x)
  boardingaxe: () => {
    const g = new THREE.Group(); g.name = 'Boarding_Axe';
    const wood = mat(0x4a3a2a, 0, 0.8), iron = mat(0xa8b0b6, 0.85, 0.32), rope = mat(0x9a8a60, 0, 0.95);
    const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.12, 7), wood); haft.position.y = 0.36; g.add(haft);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.26, 7), rope); grip.position.y = 0.0; g.add(grip);
    const prof = new THREE.Shape([[0, 0.08], [0.16, 0.1], [0.32, 0.14], [0.34, 0.0], [0.3, -0.2], [0.22, -0.14], [0.1, -0.06], [0, -0.04]].map(([x, y]) => new THREE.Vector2(x, y)));
    const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(prof, { depth: 0.045, bevelEnabled: false }), iron); blade.geometry.translate(0, 0, -0.0225); blade.position.y = 0.8; blade.name = 'Boarding_Axe_Blade'; g.add(blade);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.26, 5), iron); spike.rotation.z = Math.PI / 2; spike.position.set(-0.14, 0.83, 0); g.add(spike);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), iron); cap.position.y = 0.84; g.add(cap);
    return g;
  },
  // what the drowned sailor has left of his rig over the canvas vest (the chest's space): a tarred collar, black and
  // glossy, a frayed rope for a belt-sling across the breast, and the sea's weed hanging off him
  sailrig: () => {
    const g = new THREE.Group(); g.name = 'Sail_Rig';
    const tar = mat(0x16181a, 0.1, 0.35), rope = mat(0x9a8a60, 0, 0.95), weed = mat(0x3e6a3a, 0, 0.9);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.07, 6, 14), tar); collar.rotation.x = Math.PI / 2; collar.position.set(0, 0.2, -0.02); collar.name = 'Sail_Rig_Collar'; g.add(collar);
    const flap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.3, 0.03), tar); flap.position.set(0, 0.06, -0.3); flap.rotation.x = -0.15; flap.name = 'Sail_Rig_Collar'; g.add(flap);   // (the square collar falling down the back)
    const curve = new THREE.CatmullRomCurve3([[-0.3, 0.2, 0.0], [-0.12, 0.02, 0.38], [0.14, -0.26, 0.38], [0.32, -0.42, 0.1], [0.26, -0.3, -0.3], [0.0, -0.04, -0.36], [-0.26, 0.18, -0.18]].map((p) => new THREE.Vector3(...p)), true);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.028, 5, true), rope));
    for (const [x, z, len, a] of [[-0.2, 0.32, 0.36, -0.15], [0.16, 0.34, 0.28, 0.2], [0.24, -0.32, 0.42, 0.1], [-0.1, -0.34, 0.3, -0.1], [0.34, 0.1, 0.3, 0.3]]) {
      const w = new THREE.Mesh(new THREE.BoxGeometry(0.05, len, 0.02), weed); w.position.set(x, 0.1 - len / 2, z); w.rotation.z = a; w.name = 'Sail_Rig_Weed'; g.add(w);
    }
    return g;
  },
  // a tarpaulin hat, the old fleet's: a low round crown and a short brim, tarred black and shining (the head bone's space)
  tarhat: () => {
    const g = new THREE.Group(); g.name = 'Tar_Hat'; g.scale.setScalar(0.84); g.position.y = 0.12;
    const tar = mat(0x1a1c20, 0.15, 0.3), band = mat(0x6a7a8a, 0, 0.8);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.56, 0.2, 16), tar); crown.position.set(0, 1.0, -0.04); g.add(crown);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2), tar); top.scale.y = 0.4; top.position.set(0, 1.1, -0.04); g.add(top);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.05, 18), tar); brim.position.set(0, 0.9, -0.04); brim.rotation.x = 0.12; g.add(brim);
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.565, 0.565, 0.08, 16), band); rib.position.set(0, 0.95, -0.04); g.add(rib);
    g.traverse((o) => { if (o.isMesh) o.name = 'Tar_Hat'; });
    return g;
  },
  // the drowned bosun's chain, swung like a flail (hanging, +y down): great rusted links off the fist and a grapnel's
  // four flukes at its end
  anchorchain: () => {
    const g = new THREE.Group(); g.name = 'Anchor_Chain'; g.userData.hang = true;
    const iron = mat(0x4a4846, 0.8, 0.5), rust = mat(0x7a4a2a, 0.4, 0.75);
    for (let k = 0; k < 7; k++) { const l = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.028, 5, 10), k % 3 === 1 ? rust : iron); l.scale.y = 1.5; l.position.y = 0.08 + k * 0.14; if (k % 2) l.rotation.y = Math.PI / 2; g.add(l); }
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.42, 7), iron); shank.position.y = 1.2; shank.name = 'Anchor_Chain_Grapnel'; g.add(shank);
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2, f = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.034, 5, 8, Math.PI * 0.7), iron);
      f.position.set(Math.cos(a) * 0.15, 1.42, Math.sin(a) * 0.15); f.rotation.set(0, -a, Math.PI * 1.15); f.name = 'Anchor_Chain_Grapnel'; g.add(f);
    }
    return g;
  },
  // and more of it worn (the chest's space): a heavy chain over the left shoulder and down across him to the right hip
  chainsash: () => {
    const g = new THREE.Group(); g.name = 'Chain_Sash';
    const iron = mat(0x5a5856, 0.8, 0.5), rust = mat(0x8a5230, 0.4, 0.75);
    const curve = new THREE.CatmullRomCurve3([[-0.3, 0.3, 0.0], [-0.18, 0.12, 0.42], [0.08, -0.18, 0.48], [0.34, -0.48, 0.3], [0.4, -0.52, -0.1], [0.14, -0.2, -0.44], [-0.2, 0.16, -0.36]].map((p) => new THREE.Vector3(...p)), true);
    const n = 22, at = new THREE.Vector3(), t = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      curve.getPointAt(i / n, at); curve.getTangentAt(i / n, t);
      const l = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.026, 5, 8), i % 4 === 1 ? rust : iron); l.scale.x = 1.5; l.position.copy(at);
      l.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), t); if (i % 2) l.rotateX(Math.PI / 2); l.name = 'Chain_Sash_Link'; g.add(l);
    }
    return g;
  },
  // the Harbourmaster's bicorne, worn athwart (the head bone's space): a black half-moon of felt edged in tarnished gold,
  // a cockade on its side
  bicorne: () => {
    const g = new THREE.Group(); g.name = 'Bicorne'; g.scale.set(0.8, 0.86, 0.86); g.position.y = 0.1;
    const felt = new THREE.MeshStandardMaterial({ color: 0x1a1c24, roughness: 0.85, side: THREE.DoubleSide }), gold = mat(0xc8a048, 0.8, 0.4), sea = mat(0x3a6a64, 0, 0.8);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.24, 24, 1, false, -Math.PI / 2, Math.PI), felt); body.rotation.set(Math.PI / 2, 0, 0); body.scale.set(1, 1, 0.5); body.position.set(0, 0.86, -0.05); g.add(body);
    const edge = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.035, 5, 28, Math.PI), gold); edge.scale.set(1, 0.5, 1); edge.position.set(0, 0.86, 0.075); g.add(edge);
    const edge2 = edge.clone(); edge2.position.z = -0.175; g.add(edge2);
    const cock = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.04, 12), sea); cock.rotation.x = Math.PI / 2; cock.position.set(0.42, 1.08, 0.085); g.add(cock);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.52, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), felt); crown.scale.set(1, 0.5, 0.9); crown.position.set(0, 0.84, -0.05); g.add(crown);
    g.traverse((o) => { if (o.isMesh) o.name = 'Bicorne'; });
    return g;
  },
  // the berths' book, drowned with him (the heirloom: "Every ship that came in. None that left."): a fat ledger gone
  // green with the sea, its pages swollen, a strap and a hank of weed off it. Under his arm, as Morrow Vane's ledger
  berthsbook: () => {
    const g = new THREE.Group(); g.name = 'Berths_Book'; g.scale.setScalar(0.66);
    const cover = mat(0x3e5a4e, 0, 0.85), pages = mat(0xb8ac84, 0, 0.95), strap = mat(0x2a2420, 0, 0.9), weed = mat(0x3e6a3a, 0, 0.9);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.52, 0.56), cover); b.position.y = 0.3; b.name = 'Berths_Book_Cover'; g.add(b);
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 0.58), pages); p.position.set(0.014, 0.3, 0); g.add(p);
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.6), strap); s.position.y = 0.3; g.add(s);
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.02), weed); w.position.set(0.1, 0.02, 0.24); w.rotation.z = 0.2; g.add(w);
    return g;
  },
  // the Harbourmaster's berth-pole: a long iron-shod pole, a brass crook at its head and the berth-lamp hung off it, lit
  // the drowned's pale sea-green (userData.glow). He swings it; the lamp goes with it
  harbourpole: () => {
    const g = new THREE.Group(); g.name = 'Berth_Pole';
    const wood = mat(0x2a2622, 0, 0.8), brass = mat(0xc8a048, 0.8, 0.4), iron = mat(0x4a4c4e, 0.8, 0.45);
    const light = new THREE.MeshStandardMaterial({ color: 0xd0f8e8, emissive: 0x50b090, emissiveIntensity: 1.4, roughness: 0.3 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.0, 7), wood); pole.position.y = 0.55; g.add(pole);
    const shoe = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.2, 6), iron); shoe.rotation.x = Math.PI; shoe.position.y = -0.5; g.add(shoe);
    for (const y of [0.24, 1.4]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.06, 10), brass); b.position.y = y; g.add(b); }
    const crook = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 5, 12, Math.PI), brass); crook.position.set(0.16, 1.55, 0); g.add(crook);
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 4), iron); hook.position.set(0.32, 1.48, 0); g.add(hook);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.12, 6), brass); cap.position.set(0.32, 1.38, 0); g.add(cap);
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3, rib = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.3, 0.025), brass); rib.position.set(0.32 + Math.cos(a) * 0.13, 1.18, Math.sin(a) * 0.13); g.add(rib); }
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 1), light); s.position.set(0.32, 1.18, 0); s.name = 'Berth_Lamp_Light'; s.userData.glow = 0xa0f0d0; g.add(s);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.05, 6), brass); base.position.set(0.32, 1.02, 0); g.add(base);
    return g;
  },
  // a Gull Fleet cutlass: a short broad blade with a curve to its back, a brass shell-guard and a knuckle-bow
  cutlass: () => {
    const g = new THREE.Group(); g.name = 'Cutlass';
    const steel = mat(0xc0c6cc, 0.9, 0.3), brass = mat(0xc8a048, 0.8, 0.35), grip = mat(0x2a1e18, 0, 0.85);
    const prof = new THREE.Shape([[-0.06, 0.0], [0.07, 0.0], [0.1, 0.5], [0.13, 0.82], [0.1, 1.02], [0.0, 1.06], [-0.04, 0.86], [-0.06, 0.5]].map(([x, y]) => new THREE.Vector2(x, y)));
    const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(prof, { depth: 0.03, bevelEnabled: false }), steel); blade.geometry.translate(0, 0, -0.015); blade.position.y = 0.16; blade.name = 'Cutlass_Blade'; g.add(blade);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), brass); shell.scale.set(1, 0.4, 0.8); shell.rotation.x = Math.PI; shell.position.y = 0.18; g.add(shell);
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.018, 4, 12, Math.PI), brass); bow.rotation.z = -Math.PI / 2; bow.position.set(0.0, 0.03, 0); bow.scale.set(1.1, 1, 1); g.add(bow);
    const gr = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.046, 0.28, 8), grip); g.add(gr);
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), brass); pom.position.y = -0.16; g.add(pom);
    return g;
  },
  // the Gull Fleet's headscarf (a corsair's): the fleet's gull-beak yellow, tied tight over the hair, the knot and its
  // two tails behind
  headscarf: () => {
    // (cut short of a hood: the crown and the sides down to the ears, the face open, a flap at the nape; a full
    // hoodShell read as the hooded rogue's hood in yellow)
    const g = new THREE.Group(); g.name = 'Headscarf'; g.userData.helm = true; g.userData.hoodRz = 0.66;
    const C = new THREE.MeshStandardMaterial({ color: 0xc89a2a, roughness: 0.9, side: THREE.DoubleSide }), F = hoodForm(0.66);
    const crown = new THREE.Mesh(formed(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI * 0.32), F), C); crown.name = 'Headscarf_Cloth'; g.add(crown);
    const a = 1.0, side = new THREE.Mesh(formed(new THREE.SphereGeometry(1, 36, 10, Math.PI / 2 + a, Math.PI * 2 - 2 * a, Math.PI * 0.3, Math.PI * 0.26), F), C); side.name = 'Headscarf_Cloth'; g.add(side);
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), C), at = F(0, 0.05, -1); knot.position.copy(at); knot.position.z -= 0.05; knot.name = 'Headscarf_Cloth'; g.add(knot);
    for (const [s, len] of [[-1, 0.5], [1, 0.38]]) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.15, len, 0.03), C); t.position.set(at.x + s * 0.09, at.y - len / 2, at.z - 0.08); t.rotation.set(0.3, 0, s * 0.2); t.name = 'Headscarf_Cloth'; g.add(t); }
    return g;
  },
  // a Gull Fleet gunner's tricorne (the head bone's space): black felt cocked up in three, a corner to the front, a band
  // of the fleet's yellow round the crown (yellow on its edges stood up at the corners like horns at 56 px)
  tricorne: () => {
    const g = new THREE.Group(); g.name = 'Tricorne';
    const felt = new THREE.MeshStandardMaterial({ color: 0x202228, roughness: 0.85, side: THREE.DoubleSide }), trim = mat(0xc89a2a, 0.2, 0.7);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.54, 0.34, 14), felt); crown.position.set(0, 1.04, -0.04); g.add(crown);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.46, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2), felt); top.scale.y = 0.3; top.position.set(0, 1.2, -0.04); g.add(top);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.52, 0.07, 14), trim); band.position.set(0, 0.95, -0.04); g.add(band);
    const R = 0.66, H = 0.2;
    for (let k = 0; k < 3; k++) {                                    // three upturned walls, a corner at the front (+z)
      const a0 = Math.PI / 2 + k * (2 * Math.PI / 3), a1 = a0 + 2 * Math.PI / 3, p0 = new THREE.Vector3(Math.cos(a0) * R, 0, Math.sin(a0) * R), p1 = new THREE.Vector3(Math.cos(a1) * R, 0, Math.sin(a1) * R);
      const mid = p0.clone().add(p1).multiplyScalar(0.5), len = p0.distanceTo(p1), out = mid.clone().setY(0).normalize();
      const wall = new THREE.Mesh(new THREE.BoxGeometry(len * 1.04, H, 0.04), felt); wall.position.set(mid.x, 0.98, mid.z - 0.04); wall.lookAt(wall.position.clone().add(out)); wall.rotateX(-0.75); g.add(wall);
      const floor = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.9, R * 0.9, 0.04, 3), felt); if (k === 0) { floor.rotation.y = -Math.PI / 6 + Math.PI; floor.position.set(0, 0.85, -0.04); g.add(floor); }
    }
    g.traverse((o) => { if (o.isMesh) o.name = 'Tricorne'; });
    return g;
  },
  // a Gull Fleet sash (the hips' space): the fleet's yellow wound round the waist, its ends hanging at the left hip
  sash: () => {
    const g = new THREE.Group(); g.name = 'Sash';
    const C = mat(0xc89a2a, 0, 0.9), D = mat(0x8a6618, 0, 0.9);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.4, 0.16, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xc89a2a, roughness: 0.9, side: THREE.DoubleSide })); band.scale.z = 0.85; band.position.y = 0.16; band.name = 'Sash_Band'; g.add(band);
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), D); knot.position.set(-0.36, 0.15, 0.16); g.add(knot);
    for (const [dz, len, a] of [[0.12, 0.42, 0.12], [0.22, 0.34, 0.3]]) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.03, len, 0.12), C); t.position.set(-0.4, 0.12 - len / 2, dz); t.rotation.x = a * 0.3; t.rotation.z = -0.1; g.add(t); }
    return g;
  },
  // Hester Quaile's toll-chain (the chest's space): the Speaker's chain of office, a little harbour chain of pewter links
  // over the shoulders to a brass toll-key on her breast. Broad and bright, so the V reads on her dark sea-coat
  tollchain: () => {
    const g = new THREE.Group(); g.name = 'Toll_Chain';
    const pewter = mat(0xc8ccd0, 0.85, 0.3), dark = mat(0x6a6e74, 0.8, 0.45), brass = mat(0xd8a848, 0.85, 0.3);
    const curve = new THREE.CatmullRomCurve3([[-0.34, 0.25, -0.06], [-0.3, 0.16, 0.22], [-0.16, 0.0, 0.4], [0, -0.08, 0.45], [0.16, 0.0, 0.4], [0.3, 0.16, 0.22], [0.34, 0.25, -0.06], [0, 0.3, -0.3]].map((p) => new THREE.Vector3(...p)), true);
    const n = 26, at = new THREE.Vector3(), t = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      curve.getPointAt(i / n, at); curve.getTangentAt(i / n, t);
      const l = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.016, 4, 8), i % 2 ? dark : pewter); l.scale.x = 1.5; l.position.copy(at);
      l.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), t); if (i % 2) l.rotateX(Math.PI / 2); l.name = 'Toll_Chain_Link'; g.add(l);
    }
    const key = new THREE.Group(); key.position.set(0, -0.12, 0.47); key.rotation.x = -0.2; key.name = 'Toll_Chain_Key'; g.add(key);
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.022, 5, 12), brass); bow.position.y = 0.0; key.add(bow);
    const shank = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.28, 0.03), brass); shank.position.y = -0.2; key.add(shank);
    const bit = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.03), brass); bit.position.set(0.05, -0.31, 0); key.add(bit);
    return g;
  },
  // a harbourmistress's ledger, the League's tolls: dark blue boards, brass corners
  ledger: () => {
    const g = PROPS.book(); g.name = 'Toll_Ledger';
    g.traverse((o) => { if (o.isMesh && o.material.color.getHex() === 0x5a2020) { o.material = mat(0x24345a, 0, 0.8); } });
    return g;
  },
  // Sister Maren's quay hook: an ash pole, an iron hook and spike at its head for drawing the drowned in to the steps, a
  // white prayer-ribbon tied under it (the Grey Sisters' token: she says their names). Held as a staff, mid-pole
  quayhook: () => {
    const g = new THREE.Group(); g.name = 'Quay_Hook';
    const wood = mat(0x8a6a44, 0, 0.8), iron = mat(0x5a5e62, 0.8, 0.45), linen = mat(0xece4d0, 0, 0.85), rope = mat(0x9a8a60, 0, 0.95);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 1.9, 7), wood); pole.position.y = 0.38; g.add(pole);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.28, 6), iron); spike.position.y = 1.46; g.add(spike);
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.034, 5, 10, Math.PI * 1.1), iron); hook.position.set(0, 1.26, 0.13); hook.rotation.set(0, Math.PI / 2, Math.PI * 0.55); g.add(hook);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 8), iron); collar.position.y = 1.28; g.add(collar);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.02, 4, 10), linen); tie.rotation.x = Math.PI / 2; tie.position.y = 1.12; g.add(tie);
    for (const [s, len] of [[-1, 0.36], [1, 0.28]]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.07, len, 0.015), linen); r.position.set(s * 0.05, 1.12 - len / 2, 0.03); r.rotation.z = s * 0.25; r.name = 'Quay_Hook_Ribbon'; g.add(r); }
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.022, 5, 10), rope); coil.rotation.x = Math.PI / 2; coil.position.y = 0.2; g.add(coil);
    return g;
  },
  // a Grey Sister's veil for the quays (the head bone's space): the order's grey, a linen band at the brow, falling to
  // the shoulders behind
  sisterveil: () => {
    const g = hoodShell({ name: 'Sister_Veil', cloth: 0x8a8a86, shade: 0x3a3a38, open: 0.8, rz: 0.66, tip: 0 });
    const linen = mat(0xece4d0, 0, 0.85), R = hoodRing(0.66, 0.7);
    const band = new THREE.Mesh(new THREE.TorusGeometry(1, 0.045, 5, 32, Math.PI), linen);
    band.rotation.x = Math.PI / 2 + 0.12; band.scale.set(R.hx * 0.98, 0.505 - R.cz, 1); band.position.set(0, 0.7, R.cz); band.name = 'Sister_Veil_Band'; band.userData.onFace = true; g.add(band);
    const veil = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.74, 0.95, 16, 1, true, Math.PI * 0.6, Math.PI * 0.8), new THREE.MeshStandardMaterial({ color: 0x8a8a86, roughness: 0.92, side: THREE.DoubleSide })); veil.position.set(0, 0.18, -0.12); veil.name = 'Sister_Veil_Cloth'; g.add(veil);
    return g;
  },

  // ── the Gull Isles and the Lamp Fort (world doc v1.70 §3.7; docs/tidemark-plan.md's build sheet, step 4) ──
  // a Gull Fleet mate's boarding pike: a long ash pole, a square iron spike on long langets (so a cut can't take the head
  // off), a short back-hook for a rail, and a rag of the fleet's yellow tied under the head. Held two-handed as the
  // reed-cutters' bill-hook is (+y from the grip)
  boardingpike: () => {
    const g = new THREE.Group(); g.name = 'Boarding_Pike';
    const wood = mat(0x5a4632, 0, 0.82), iron = mat(0x8a9096, 0.85, 0.38), dark = mat(0x3a3c3e, 0.8, 0.5), rag = mat(0xc89a2a, 0, 0.9);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.052, 2.3, 7), wood); pole.position.y = 0.55; g.add(pole);
    const butt = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14, 6), dark); butt.rotation.x = Math.PI; butt.position.y = -0.66; g.add(butt);
    for (const s of [-1, 1]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.36, 0.05), dark); l.position.set(s * 0.05, 1.6, 0); g.add(l); }   // (the langets)
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.12, 8), dark); socket.position.y = 1.74; g.add(socket);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.56, 4), iron); spike.position.y = 2.08; spike.name = 'Boarding_Pike_Head'; g.add(spike);
    const hook = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 4), iron); hook.position.set(-0.1, 1.86, 0); hook.rotation.z = 1.1; g.add(hook);
    for (const [s, len] of [[-1, 0.3], [1, 0.22]]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.09, len, 0.02), rag); r.position.set(s * 0.05, 1.5 - len / 2, 0.04); r.rotation.z = s * 0.3; r.name = 'Boarding_Pike_Rag'; g.add(r); }
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.025, 4, 10), rag); tie.rotation.x = Math.PI / 2; tie.position.y = 1.5; g.add(tie);
    return g;
  },
  // the fleet's sash cut for a bigger man (the barbarian's girth: the mate's and the Admiral's), as the corsair's
  sashwide: () => { const g = PROPS.sash(); g.name = 'Sash_Wide'; g.scale.set(1.24, 1.0, 1.3); g.position.y = -0.02; return g; },
  // a mate's watch-cap (the head bone's space): knitted wool, tarred near black, close over the skull with its brim rolled;
  // dark where the corsairs' heads are the fleet's yellow (lab round 1: bare, his scalp read as a brown ball from above)
  watchcap: () => {
    const g = new THREE.Group(); g.name = 'Watch_Cap';
    // (round 2: pulled down to the brows it took the face with it, a dark ball on dark shoulders: up off the brow now, a
    // shade lighter than his jerkin)
    const wool = mat(0x3e4452, 0, 0.95), roll = mat(0x4e5464, 0, 0.95);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), wool); dome.scale.set(1.0, 0.62, 1.04); dome.position.set(0, 0.72, -0.06); g.add(dome);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.575, 0.07, 6, 20), roll); band.rotation.x = Math.PI / 2 - 0.12; band.scale.set(1.0, 1.04, 1); band.position.set(0, 0.73, -0.06); g.add(band);
    g.traverse((o) => { if (o.isMesh) o.name = 'Watch_Cap'; });
    return g;
  },
  // the mate's black beard, long enough to read from above (the face's own is under the chin from the game's camera)
  beardblack: () => greatBeard({ name: 'Beard_Black', hair: 0x1c1612, len: 0.45 }),
  // Admiral Hesk's hanger: an officer's short sword, a curved blade longer and slimmer than the corsairs' cutlasses, a
  // gilt shell and knuckle-bow, a lion's-head pommel gone to a lump at 56 px; held as the kits' one-handers are
  hanger: () => {
    const g = new THREE.Group(); g.name = 'Hanger';
    const steel = mat(0xd0d6dc, 0.92, 0.26), gilt = mat(0xd8b050, 0.85, 0.3), grip = mat(0x1c1a24, 0, 0.8);
    const prof = new THREE.Shape([[-0.045, 0.0], [0.05, 0.0], [0.08, 0.5], [0.11, 0.9], [0.09, 1.14], [0.0, 1.2], [-0.03, 0.96], [-0.045, 0.5]].map(([x, y]) => new THREE.Vector2(x, y)));
    const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(prof, { depth: 0.026, bevelEnabled: false }), steel); blade.geometry.translate(0, 0, -0.013); blade.position.y = 0.17; blade.name = 'Hanger_Blade'; g.add(blade);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), gilt); shell.scale.set(1, 0.4, 0.8); shell.rotation.x = Math.PI; shell.position.y = 0.18; g.add(shell);
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 4, 12, Math.PI), gilt); bow.rotation.z = -Math.PI / 2; bow.position.set(0.0, 0.03, 0); bow.scale.set(1.1, 1, 1); g.add(bow);
    const gr = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.28, 8), grip); g.add(gr);
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 6), gilt); pom.position.y = -0.16; g.add(pom);
    return g;
  },
  // the Admiral's hat (the head bone's space): a broad black felt, its brim edged and banded in tarnished gold, a white
  // plume off a gilt pin on its left, laid back over the crown. Held to a hat's size,
  // not a sail's (the Harbourmaster's bicorne and the gunner's tricorne beside it: this one is round, cocked, plumed)
  cavalier: () => {
    const g = new THREE.Group(); g.name = 'Cavalier_Hat'; g.position.y = 0.06;
    const felt = new THREE.MeshStandardMaterial({ color: 0x1a1c26, roughness: 0.85, side: THREE.DoubleSide }), gold = mat(0xc8a048, 0.8, 0.4);
    const tip = mat(0xf2ead2, 0, 0.95);   // (round 3: the plume white; yellow on black read as nothing at 73 px, and the sash is the fleet's yellow)
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.52, 0.26, 16), felt); crown.position.set(0, 0.99, -0.04); g.add(crown);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.46, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2), felt); top.scale.y = 0.34; top.position.set(0, 1.12, -0.04); g.add(top);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.53, 0.53, 0.08, 16), gold); band.position.set(0, 0.92, -0.04); g.add(band);
    // the brim: a round felt disc, a little down at the front (round 3: its left side turned up stood off the crown as a
    // black fin from the game's camera, and the hat read tall; the plume and its gilt pin keep the cavalier's side)
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.04, 22), felt); brim.position.set(0, 0.88, -0.04); brim.rotation.x = 0.1; g.add(brim);
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), gold); pin.position.set(-0.46, 1.0, 0.12); g.add(pin);
    const edge = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.022, 4, 28), gold); edge.rotation.set(Math.PI / 2 + 0.1, 0, 0); edge.position.set(0, 0.885, -0.04); g.add(edge);   // (round 2: the brim edged in gold, so the hat parts from the coat)
    // the plume (round 2: tucked along the brim it was lost at 56 px): three feathers off the pin, up over the crown and
    // curling back, cream with the fleet's yellow at the quill
    for (const [k, len, a, up] of [[0, 0.78, 0.25, 0.55], [1, 0.64, 0.6, 0.4], [2, 0.56, -0.1, 0.35]]) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 6), tip); f.scale.set(0.11, 0.06, len / 2);
      f.position.set(-0.42 + 0.08 * k + Math.sin(a) * len * 0.4, 1.2 + up * len * 0.5, -0.04 - Math.cos(a) * len * 0.4); f.rotation.set(-up, a, 0.25); g.add(f);
    }
    g.traverse((o) => { if (o.isMesh) o.name = 'Cavalier_Hat'; });
    return g;
  },
  // the skirts of the Admiral's long coat (the hips' space): dark blue broadcloth from the waist to the knee, open at the
  // front for the legs, the edges and the turned-back corners in tarnished gold lace, two gilt buttons at the back vent
  coatskirts: () => coatSkirts({ name: 'Coat_Skirts', cloth: 0x1e2a48, gold: 0xb8903e }),
  // an officer's epaulettes (the chest's space): a gilt pad on each shoulder, its fringe hanging; tarnished, but they
  // tell an admiral from his crew at 56 px
  epaulettes: () => {
    const g = new THREE.Group(); g.name = 'Epaulettes';
    const gold = mat(0xc8a048, 0.8, 0.4), dark = mat(0x8a6a28, 0.7, 0.5);
    for (const s of [-1, 1]) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.05, 12), gold); pad.position.set(s * 0.4, 0.3, -0.02); pad.rotation.z = s * -0.35; g.add(pad);
      for (let k = 0; k < 7; k++) { const a = (k / 6 - 0.5) * 2.2, f = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.12, 4), dark); f.position.set(s * (0.4 + 0.13 * Math.abs(Math.cos(a)) * 0.9), 0.24, -0.02 + 0.14 * Math.sin(a)); f.rotation.z = s * -0.35; g.add(f); }
    }
    g.traverse((o) => { if (o.isMesh) o.name = 'Epaulettes'; });
    return g;
  },
  // Hesk's commission, at his belt (the hips' space, the left hip): a roll of vellum in a gilt cord, sealed in coal-red wax
  // (world doc §3.7: signed *Lucanus*, paid in coal-red wax), the seal hung where it can be seen
  commission: () => {
    const g = new THREE.Group(); g.name = 'Commission';
    const vellum = mat(0xe0d2a8, 0, 0.85), cord = mat(0xc8a048, 0.7, 0.5), wax = mat(0x9a2014, 0.05, 0.35);   // (coal-red: a red with black in it, still red at 73 px)
    // (Stage round 1: a pencil at his hip, gone at play size; a fat roll now, its seal the size of a coin and hung outside the sash)
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.62, 12), vellum); roll.name = 'Commission_Roll'; g.add(roll);
    for (const y of [-0.2, 0.2]) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.097, 0.018, 4, 12), cord); t.rotation.x = Math.PI / 2; t.position.y = y; g.add(t); }
    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 14), wax); seal.rotation.x = Math.PI / 2; seal.position.set(0, -0.08, 0.12); seal.name = 'Commission_Seal'; g.add(seal);
    const tag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.012), cord); tag.position.set(0, 0.02, 0.105); g.add(tag);
    g.position.set(-0.42, 0.02, 0.26); g.rotation.set(0.3, 0, 0.5);
    return g;
  },
  // Old Gannet's hand-lamp: a small brass lamp on a ring, a chimney of glass with its flame in it, warm (userData.glow);
  // hung from his fingers. The coast-lamp's keeper carries a little one about the fort
  handlamp: () => {
    const g = new THREE.Group(); g.name = 'Hand_Lamp'; g.userData.hang = true;
    const brass = mat(0xd0a450, 0.85, 0.32), glass = new THREE.MeshStandardMaterial({ color: 0xffd890, emissive: 0xe08a28, emissiveIntensity: 1.35, roughness: 0.3 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.014, 5, 12), brass); ring.position.y = 0.05; g.add(ring);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.1, 10), brass); cap.rotation.z = Math.PI; cap.position.y = 0.15; g.add(cap);
    const chim = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.2, 10), glass); chim.position.y = 0.3; chim.name = 'Hand_Lamp_Glass'; chim.userData.glow = 0xffc060; g.add(chim);
    for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI * 2, bar = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.2, 0.016), brass); bar.position.set(Math.cos(a) * 0.088, 0.3, Math.sin(a) * 0.088); g.add(bar); }
    const fount = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), brass); fount.scale.y = 0.7; fount.position.y = 0.46; g.add(fount);
    return g;
  },
  // a keeper's sou'wester (the head bone's space): oilskin, the old ochre gone dark with tar and weather, a low crown and
  // a brim short at the brow and long down the back of the neck, so it never hides the face
  souwester: () => {
    // (the portrait, round 2: scaled down, its crown sat inside the painted head and only the brim showed, a ring like horns;
    // sized to the head now: the crown over the hair, the brim up off the brow)
    const g = new THREE.Group(); g.name = 'Souwester';
    const oil = new THREE.MeshStandardMaterial({ color: 0x9a7634, roughness: 0.45, metalness: 0.05, side: THREE.DoubleSide });
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), oil); crown.scale.set(1, 0.62, 1.04); crown.position.set(0, 0.86, -0.06); g.add(crown);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.74, 0.07, 20), oil); brim.position.set(0, 0.84, -0.12); brim.scale.set(1, 1, 1.1); brim.rotation.x = 0.26; g.add(brim);   // (tipped up at the brow, long down the neck)
    g.traverse((o) => { if (o.isMesh) o.name = 'Souwester'; });
    return g;
  },
  // and his beard, white and long, three hundred years of it (from above the face's own is under the chin)
  beardwhite: () => { const g = greatBeard({ name: 'Beard_White', hair: 0xe4e0d8, len: 0.3 }); g.scale.set(0.82, 1, 0.8); g.position.z = 0.04; return g; },   // (the portrait: full size it was a ball of cotton wool)

  // ── Highmarch (world doc v1.72 §3.7; docs/tidemark-plan.md's build sheet, step 6) ──
  // Highmarch's colours: the old legions' oxblood and bronze, the empire it wants back (not the Redhand's bright red on
  // grey iron, nor the Gull Fleet's sea-grey and yellow). A legionary's tower shield (the hand slot's space, as the kits'
  // shields: its face +z, tall along y): new silhouette 1, so a line of them reads as a wall. KayKit's Rectangle_Shield is
  // 0.88 × 1.19; this one is 1.04 × 1.62, curved round the body, oxblood with a bronze rim, a bronze boss on a raised
  // spine and the march's gilt wings either side of it. Its meshes are named *Shield* so the weapon anchors skip it
  towershield: () => towerShield({ name: 'Tower_Shield', face: 0x6e1c1e, back: 0x3a2418, metal: 0xb4883c, wings: 0xd8b050 }),
  // the Champion's: the same shield, its rim and boss gilt, a gilt laurel round the boss for his day in the capital
  championshield: () => towerShield({ name: 'Champion_Shield', face: 0x6e1c1e, back: 0x3a2418, metal: 0xd4aa4c, wings: 0xe8c460, laurel: true }),
  // a legionary's short sword (held as the kits' one-handers: +y from the grip): a broad leaf blade 0.72 long, half the
  // knight's sword, a bronze guard and a round bronze pommel. Stabbed, not swung (the bake's attack is a thrust)
  gladius: () => shortSword({ name: 'Gladius', steel: 0xc4cad0, fit: 0xb4883c }),
  // the Champion's: the same blade, gilt at the hilt
  championsword: () => shortSword({ name: 'Champion_Sword', steel: 0xd0d6dc, fit: 0xd4aa4c, len: 0.84 }),
  // a legionary's helm (the head bone's space): a bronze bowl, a brow band, cheek guards and a flared neck guard, and a
  // crest of oxblood horsehair front to back: from the game's camera the crest and the shield are what say *legion*
  galea: () => galea({ name: 'Galea', metal: 0x9a7438, band: 0xb4883c, crest: 0xa02824 }),   // (lab round 2: the crest in the shield's oxblood went black on the bronze at play size: a brighter red)
  // the Champion's (an officer's of the old harness): gilt, its crest worn side to side, as the legions' centurions wore
  // theirs, and a gilt laurel round the bowl: the Laurel his heirloom is, the day in the capital
  championhelm: () => galea({ name: 'Champion_Helm', metal: 0xc89c44, band: 0xe0b858, crest: 0x8a2024, transverse: true, laurel: 0xe8c460 }),
  // a soldier's oxblood tunic skirt and its leather strips (the hips' space), under the knight's plate: the legions' kilt
  pteruges: () => {
    const g = new THREE.Group(); g.name = 'Pteruges';
    const cloth = new THREE.MeshStandardMaterial({ color: 0x6e1c1e, roughness: 0.9, side: THREE.DoubleSide }), leather = mat(0x4a3222, 0, 0.85), stud = mat(0xb4883c, 0.85, 0.35);
    const kilt = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.47, 0.34, 16, 1, true), cloth); kilt.position.set(0, -0.08, 0); kilt.name = 'Pteruges_Kilt'; g.add(kilt);
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2, s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.025), leather);
      s.position.set(Math.sin(a) * 0.45, -0.06, Math.cos(a) * 0.45); s.rotation.set(Math.cos(a) * 0.14, a, -Math.sin(a) * 0.14); s.name = 'Pteruges_Strip'; g.add(s);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.022, 5, 4), stud); b.position.set(Math.sin(a) * 0.462, -0.17, Math.cos(a) * 0.462); g.add(b);
    }
    return g;
  },
  // a siege engineer's pot of pitch (the hand slot's space, carried by its bail and hung plumb): a squat clay pot sealed
  // with pitch, a rope bail, and a lit rag in its neck (userData.glow: the ember plane), the fuse he lights before he throws
  pitchpot: () => {
    const g = new THREE.Group(); g.name = 'Pitch_Pot'; g.userData.hang = true;
    const clay = mat(0x8a5a36, 0, 0.85), pitch = mat(0x161214, 0.2, 0.3), rope = mat(0x9a8458, 0, 0.95);
    const rag = new THREE.MeshStandardMaterial({ color: 0xffb050, emissive: 0xd06010, emissiveIntensity: 1.4, roughness: 0.6 });
    const bail = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.018, 4, 12, Math.PI), rope); bail.rotation.z = Math.PI; bail.position.y = 0.16; g.add(bail);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 9), clay); body.scale.set(1, 0.86, 1); body.position.y = 0.42; body.name = 'Pitch_Pot_Body'; g.add(body);
    const drip = new THREE.Mesh(new THREE.SphereGeometry(0.205, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.32), pitch); drip.scale.set(1, 0.86, 1); drip.rotation.x = Math.PI; drip.position.y = 0.42; g.add(drip);   // (pitch run down from the neck: the pot's black top as it hangs)
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.08, 10), pitch); neck.position.y = 0.26; g.add(neck);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 6), rag); flame.rotation.z = Math.PI; flame.position.y = 0.16; flame.name = 'Pitch_Pot_Rag'; flame.userData.glow = 0xff8a30; g.add(flame);
    return g;
  },
  // a siege engineer's padded cap (the head bone's space): quilted oxblood wool close over the skull, a leather band, the
  // ear-flaps tied up; Highmarch's colour on a man in a leather apron
  arminghat: () => {
    const g = new THREE.Group(); g.name = 'Arming_Cap';
    const wool = mat(0x6e2424, 0, 0.95), seam = mat(0x3a1414, 0, 0.95), band = mat(0x4a3222, 0, 0.85);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.6, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), wool); dome.scale.set(1, 0.66, 1.04); dome.position.set(0, 0.6, -0.04); g.add(dome);
    for (const a of [-0.5, 0, 0.5]) { const q = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.016, 4, 16, Math.PI), seam); q.rotation.set(0, Math.PI / 2 + a, 0); q.scale.set(1.45, 1.0, 1); q.position.set(0, 0.62, -0.04); g.add(q); }
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.61, 0.61, 0.08, 16), band); b.position.set(0, 0.62, -0.04); g.add(b);
    for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.24), wool); f.position.set(s * 0.6, 0.66, -0.06); f.rotation.z = s * 0.5; g.add(f); }
    g.traverse((o) => { if (o.isMesh) o.name = 'Arming_Cap'; });
    return g;
  },
  // a siege engineer's leather apron (the smith's cut): tan cowhide, so it parts from his soot-dark jerkin at play size
  pitchapron: () => apronOf({ name: 'Pitch_Apron', cloth: 0x9a6434, strap: 0x2e1f18 }),
  // Lucan Varro's circlet (the head bone's space): a narrow gilt band over his hair, a point at the brow set with a
  // coal-red stone (his wax's red). Not a crown yet: he means to be crowned in the capital
  circlet: () => {
    const g = new THREE.Group(); g.name = 'Circlet';
    const gilt = mat(0xe0b850, 0.9, 0.25), stone = mat(0x9a1a14, 0.1, 0.25);
    // (lab round 1: at the cap's 0.6 it rode round the painted head like a halo; drawn in to the hair, low on the brow)
    const r = 0.47, band = new THREE.Mesh(new THREE.TorusGeometry(r, 0.035, 5, 28), gilt); band.rotation.x = Math.PI / 2 - 0.2; band.scale.set(1, 1.1, 1); band.position.set(0, 0.7, 0.0); g.add(band);
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.18, 4), gilt); point.position.set(0, 0.82, r * 1.1 + 0.01); point.rotation.x = 0.2; g.add(point);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), stone); gem.position.set(0, 0.77, r * 1.1 + 0.05); g.add(gem);
    for (const s of [-1, 1]) for (const k of [1, 2]) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), gilt); l.scale.set(1.5, 0.6, 0.6); const a = s * k * 0.38; l.position.set(Math.sin(a) * r, 0.72 + 0.02 * k, Math.cos(a) * r * 1.1); l.rotation.set(0, a, s * 0.5); g.add(l); }   // (two gilt leaves either side of the point)
    g.traverse((o) => { if (o.isMesh) o.name = 'Circlet'; });
    return g;
  },
  // the skirts of Lucan's long coat: black broadcloth to below the knee, laced in gilt (coatSkirts, longer and set out
  // round the knight's plate)
  lucancoat: () => coatSkirts({ name: 'Lucan_Coat', cloth: 0x1a1618, gold: 0xc8a048, len: 0.66, top: 0.12, r0: 0.45, r1: 0.53 }),
  // the Kindler's letters, in Lucan's hand (held as a book is, along +y from the grip): a sheaf of folded letters tied
  // with a faded ribbon, the top one open
  letters: () => {
    const g = new THREE.Group(); g.name = 'Letters';
    const paper = mat(0xe4d6b4, 0, 0.9), old = mat(0xc8b48a, 0, 0.9), ribbon = mat(0x6a1a1c, 0, 0.8);
    for (let k = 0; k < 4; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 0.26), k % 2 ? old : paper); s.position.set(-0.03 + k * 0.022, 0.24, (k % 2) * 0.02); s.rotation.x = (k - 1.5) * 0.06; g.add(s); }
    const open = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.42, 0.34), paper); open.position.set(0.07, 0.3, 0.08); open.rotation.set(0.2, 0, -0.12); open.name = 'Letters_Open'; g.add(open);
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, 0.28), ribbon); tie.position.set(0, 0.2, 0.01); g.add(tie);
    return g;
  },
};

// a long coat's skirts (the hips' space): broadcloth from the waist down, open at the front for the legs, its edges and
// hem laced in `gold`, two pairs of buttons at the back vent. Admiral Hesk's (dark blue, to the knee) and Lucan Varro's
// (longer, and further out to clear the knight's plate skirt)
function coatSkirts({ name, cloth: c, gold: gc, len = 0.5, top = 0.08, r0 = 0.41, r1 = 0.46 }) {
  const g = new THREE.Group(); g.name = name;
  const cloth = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, side: THREE.DoubleSide }), gold = mat(gc, 0.8, 0.4);
  // (lab round 3: one flared cylinder read as a barrel from behind; two tails now, open at the front and parted at the
  // back vent, hung nearly straight)
  const open = 0.36, vent = 0.05;
  for (const s of [-1, 1]) {
    const th0 = s > 0 ? Math.PI * open : Math.PI * (1 + vent), thL = Math.PI * (1 - open - vent);
    const sk = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, 12, 1, true, th0, thL), cloth); sk.position.set(0, top - len / 2, -0.02); sk.scale.z = 0.92; sk.name = name + '_Cloth'; g.add(sk);
    const hem = new THREE.Mesh(new THREE.TorusGeometry(r1 + 0.005, 0.022, 4, 14, thL), gold); hem.rotation.set(Math.PI / 2, 0, Math.PI / 2 - th0 - thL); hem.position.set(0, top - len + 0.01, -0.02); hem.scale.y = 0.92; g.add(hem);
    for (const th of [th0, th0 + thL]) { const e = new THREE.Mesh(new THREE.BoxGeometry(0.045, len, 0.025), gold); e.position.set(Math.sin(th) * (r0 + r1) / 2, top - len / 2, Math.cos(th) * (r0 + r1) / 2 * 0.92 - 0.02); e.rotation.y = th; g.add(e); }
  }
  for (const y of [-0.04, -0.2]) for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), gold); b.position.set(s * 0.07, y, -(r0 + 0.06) + y * 0.25); g.add(b); }
  return g;
}
// a tower shield (the hand slot's space: the face +z, tall along y): a slice of a cylinder of radius R round the man
// behind it, `face` on its front and `back` (the wood) behind, a `metal` rim, a boss on a spine, two `wings` either side
// of the boss; `laurel`, a gilt wreath round the boss. Every mesh is named *Shield* (lab.js: no weapon anchor on it)
function towerShield({ name, face, back, metal, wings, laurel = false }) {
  const g = new THREE.Group(); g.name = name;
  const R = 0.95, L = 1.12, H = 1.62, zF = 0.3, zc = zF - R;   // (the front at the middle 0.3 out, where the kit's shields sit)
  const F = new THREE.MeshStandardMaterial({ color: face, roughness: 0.75, metalness: 0.05 }), B = mat(back, 0, 0.9);
  const M = new THREE.MeshStandardMaterial({ color: metal, metalness: 0.85, roughness: 0.35, side: THREE.DoubleSide }), W = mat(wings, 0.9, 0.3);
  const front = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 16, 1, true, -L / 2, L), F); front.position.z = zc; g.add(front);
  // its back, the wood: the shell turned inside out (lab round 2: a BackSide material, the bake's own passes, which keep
  // no side, drew as nothing, and from behind the shield was a gilt frame round a hole)
  const rg = new THREE.CylinderGeometry(R - 0.05, R - 0.05, H, 16, 1, true, -L / 2, L), ix = rg.index.array;
  for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
  const nm = rg.attributes.normal.array; for (let i = 0; i < nm.length; i++) nm[i] = -nm[i];
  const rear = new THREE.Mesh(rg, B); rear.position.z = zc; g.add(rear);
  for (const y of [-H / 2, H / 2]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.015, R + 0.015, 0.08, 16, 1, true, -L / 2 - 0.01, L + 0.02), M); r.position.set(0, y, zc); g.add(r);
    const cap = new THREE.Mesh(new THREE.RingGeometry(R - 0.05, R + 0.015, 16, 1, -L / 2, L), M); cap.rotation.x = -Math.PI / 2; cap.rotation.z = -Math.PI / 2; cap.position.set(0, y, zc); g.add(cap); }   // (its top edge, seen from the game's camera)
  for (const s of [-1, 1]) { const a = s * L / 2, e = new THREE.Mesh(new THREE.BoxGeometry(0.07, H + 0.04, 0.08), M); e.position.set(Math.sin(a) * (R - 0.02), 0, zc + Math.cos(a) * (R - 0.02)); e.rotation.y = a; g.add(e); }
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.08, H - 0.1, 0.035), M); spine.position.z = zF + 0.012; g.add(spine);
  const bossPlate = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.36, 0.03), M); bossPlate.position.z = zF + 0.01; g.add(bossPlate);
  const boss = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), M); boss.rotation.x = Math.PI / 2; boss.scale.set(1, 0.75, 1); boss.position.z = zF + 0.02; g.add(boss);
  for (const s of [-1, 1]) for (const [dy, len, tilt] of [[0.1, 0.36, 0.6], [0.0, 0.3, 0.3]]) {   // the march's wings: two broad feathers up and out from the boss, each side (lab round 1: three thin ones read as a spider's legs)
    const x = s * (0.2 + len * 0.4), f = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 5), W); f.scale.set(len / 2, 0.065, 0.022);
    f.position.set(x, dy + 0.06, zc + Math.sqrt(R * R - x * x) + 0.01); f.rotation.set(0, Math.asin(x / R), s * tilt); g.add(f);
  }
  if (laurel) for (let k = 0; k < 14; k++) {                                // the laurel: leaves on a ring round the boss
    const a = (k / 14) * Math.PI * 2, x = Math.cos(a) * 0.27, y = Math.sin(a) * 0.27, l = new THREE.Mesh(new THREE.SphereGeometry(1, 6, 4), W);
    l.scale.set(0.06, 0.03, 0.015); l.position.set(x, y, zc + Math.sqrt(R * R - x * x) + 0.03); l.rotation.set(0, 0, a + Math.PI / 2 + 0.5); g.add(l);
  }
  g.traverse((o) => { if (o.isMesh) o.name = name; });
  return g;
}
// a short sword (+y from the grip): a broad leaf blade, a guard, a round pommel, in `fit`
function shortSword({ name, steel: s, fit, len = 0.72 }) {
  const g = new THREE.Group(); g.name = name;
  const steel = mat(s, 0.9, 0.28), F = mat(fit, 0.85, 0.35), grip = mat(0x2a1a14, 0, 0.85), k = len / 0.72;
  const prof = new THREE.Shape([[-0.07, 0], [0.07, 0], [0.062, 0.36], [0.078, 0.52], [0, 0.72], [-0.078, 0.52], [-0.062, 0.36]].map(([x, y]) => new THREE.Vector2(x * 1.1, y * k)));
  const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(prof, { depth: 0.03, bevelEnabled: false }), steel); blade.geometry.translate(0, 0, -0.015); blade.position.y = 0.15; blade.name = name + '_Blade'; g.add(blade);
  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.07, 0.12), F); guard.position.y = 0.12; g.add(guard);
  const gr = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.22, 8), grip); gr.position.y = -0.01; g.add(gr);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), F); pom.scale.y = 0.75; pom.position.y = -0.15; g.add(pom);
  return g;
}
// a legion helm (the head bone's space; the kettle's frame: the skull's top near 1.05): a bowl, a brow band, cheek
// guards, a neck guard flared behind, and a horsehair crest on a holder, front to back or (`transverse`) side to side;
// `laurel` a gilt wreath round the bowl, from behind each ear to the temples
function galea({ name, metal, band: bc, crest: cc, transverse = false, laurel = 0 }) {
  const g = new THREE.Group(); g.name = name;
  const M = new THREE.MeshStandardMaterial({ color: metal, metalness: 0.8, roughness: 0.38, side: THREE.DoubleSide }), Bd = mat(bc, 0.85, 0.32);
  const C = new THREE.MeshStandardMaterial({ color: cc, roughness: 0.95, side: THREE.DoubleSide });
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.61, 16, 9, 0, Math.PI * 2, 0, Math.PI / 2), M); bowl.scale.set(1, 0.74, 1.06); bowl.position.set(0, 0.62, -0.03); g.add(bowl);
  const brow = new THREE.Mesh(new THREE.TorusGeometry(0.615, 0.045, 5, 28), Bd); brow.rotation.x = Math.PI / 2; brow.scale.set(1, 1.06, 1); brow.position.set(0, 0.64, -0.03); g.add(brow);
  const peak = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.7, 0.04, 16, 1, false, -0.7, 1.4), Bd); peak.position.set(0, 0.62, 0.0); g.add(peak);   // (the brow's lip)
  for (const s of [-1, 1]) { const ch = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.24), M); ch.position.set(s * 0.5, 0.5, 0.26); ch.rotation.set(0.12, s * 0.4, s * -0.06); g.add(ch); }   // the cheek guards (lab round 1: out at the bowl's rim they stood off the head like ears; tucked in along the cheeks)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.8, 0.16, 16, 1, true, Math.PI * 0.62, Math.PI * 0.76), M); neck.position.set(0, 0.56, -0.04); g.add(neck);
  const holder = new THREE.Mesh(new THREE.BoxGeometry(transverse ? 0.5 : 0.08, 0.1, transverse ? 0.08 : 0.5), Bd); holder.position.set(0, 1.07, -0.03); g.add(holder);
  const crest = new THREE.Mesh(new THREE.CylinderGeometry(transverse ? 0.76 : 0.56, transverse ? 0.76 : 0.56, transverse ? 0.12 : 0.09, 18, 1, false, 0, Math.PI), C);   // (lab round 1: the transverse one at the legionary's size read as his crest from the game's camera: wider and thicker)
  crest.rotation.set(0, transverse ? Math.PI / 2 : 0, Math.PI / 2); crest.scale.set(transverse ? 0.7 : 0.62, 1, 1); crest.position.set(0, 1.08, -0.05); crest.name = name + '_Crest'; g.add(crest);
  if (laurel) { const Lm = mat(laurel, 0.9, 0.28);
    for (const s of [-1, 1]) for (let k = 0; k < 7; k++) {                // leaves from behind the ear (a = π) round to the temple
      const a = Math.PI - (k / 6) * Math.PI * 0.62, l = new THREE.Mesh(new THREE.SphereGeometry(1, 6, 4), Lm); l.scale.set(0.1, 0.045, 0.03);
      l.position.set(s * Math.sin(a) * 0.64, 0.72 + 0.02 * Math.sin(k), Math.cos(a) * 0.68 - 0.03); l.rotation.set(0, s * a + Math.PI / 2, s * (0.45 + (k % 2) * 0.3)); g.add(l);
    } }
  g.traverse((o) => { if (o.isMesh && !o.name) o.name = name; });
  return g;
}
// an apron (the hips' space): a bib, a two-panel skirt, a belt
function apronOf({ name, cloth, strap, z = 0.33 }) {
  const g = new THREE.Group(); g.name = name;
  const C = mat(cloth, 0, 0.9), S = mat(strap, 0, 0.9);
  const bib = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.04), C); bib.position.set(0, 0.32, z); bib.rotation.x = -0.08; bib.name = name + '_Bib'; g.add(bib);
  for (const x of [-0.1, 0.1]) { const sk = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.34, 0.04), C); sk.position.set(x, -0.1, z - 0.03); sk.rotation.x = 0.12; sk.name = name + '_Skirt'; g.add(sk); }
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.06), S); belt.position.set(0, 0.11, z + 0.02); g.add(belt);
  return g;
}
// a sledge (a weapon, along +y from the grip): an ash haft, an iron head; `hot` its striking face lit, `bands` brass rings
function sledge({ name, haft, head, hot = false, bands = false }) {
  const g = new THREE.Group(); g.name = name;
  const wood = mat(0x5a3e24, 0, 0.8), iron = mat(0x3a3a3e, 0.85, 0.4), brass = mat(0xc89a48, 0.85, 0.35);
  const lit = new THREE.MeshStandardMaterial({ color: 0xffa050, emissive: 0xe05a10, emissiveIntensity: 1.5, roughness: 0.45 });
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, haft, 8), wood); h.position.y = haft / 2 - 0.15; g.add(h);
  const y = haft - 0.12, hd = new THREE.Mesh(new THREE.BoxGeometry(...head), iron); hd.position.y = y; hd.name = name + '_Head'; g.add(hd);
  if (hot) for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.03, head[1] * 0.8, head[2] * 0.8), lit); f.position.set(s * (head[0] / 2 + 0.01), y, 0); f.name = name + '_Face'; f.userData.glow = 0xff8030; g.add(f); }
  if (bands) for (const x of [-head[0] * 0.28, head[0] * 0.28]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, head[1] + 0.03, head[2] + 0.03), brass); b.position.set(x, y, 0); g.add(b); }
  return g;
}
// a censer on its chain (hangs plumb): a pierced brass ball, its coals lit, smoke over it
function censerOf(k) {
  const g = new THREE.Group(); g.name = k > 1 ? 'Great_Censer' : 'Censer'; g.userData.hang = true; g.scale.setScalar(k);
  const brass = mat(0xb08a3a, 0.85, 0.4), iron = mat(0x3a3836, 0.8, 0.5), smoke = mat(0x4a4644, 0, 1);
  const coals = new THREE.MeshStandardMaterial({ color: 0xffa050, emissive: 0xe0501a, emissiveIntensity: 1.5, roughness: 0.6 });
  for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 4, 8), iron); l.scale.y = 1.5; l.position.y = 0.06 + i * 0.09; if (i % 2) l.rotation.y = Math.PI / 2; g.add(l); }
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), brass); ball.position.y = 0.52; g.add(ball);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.155, 10, 8, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.16), coals); glow.position.y = 0.52; glow.name = g.name + '_Coals'; glow.userData.glow = 0xff8030; g.add(glow);   // (a band of slots round its waist, the coals showing)
  for (const [x, y, z, r] of [[0.06, 0.32, 0.05, 0.07], [-0.05, 0.24, -0.02, 0.06]]) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), smoke); s.position.set(x, y, z); g.add(s); }   // (smoke rising past the chain: hanging, up is −y here)
  return g;
}
// a long beard (the head bone's space: the chin at y ≈ 0, the face's front at z ≈ 0.5): a full bib from the jaw down over
// the breast, `len` its length; `braids` two braids out of it, each ringed in brass at its end
function greatBeard({ name, hair, len, braids = false }) {
  const g = new THREE.Group(); g.name = name;
  const H = mat(hair, 0, 0.95), dark = mat(new THREE.Color(hair).multiplyScalar(0.62).getHex(), 0, 0.95), brass = mat(0xc89a48, 0.85, 0.35);
  const bib = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), H); bib.scale.set(0.46, 0.34 + 0.3 * len, 0.27); bib.position.set(0, 0.06 - 0.3 * len, 0.33); bib.name = name; g.add(bib);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5 * len, 12), H); tip.rotation.x = Math.PI; tip.scale.z = 0.75; tip.position.set(0, -0.32 - 0.62 * len, 0.38); tip.name = name; g.add(tip);
  for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), H); m.scale.set(1.2, 0.7, 0.9); m.position.set(s * 0.15, 0.12, 0.47); m.name = name; g.add(m); }   // (the moustache's wings, over the corners of the mouth)
  if (braids) for (const s of [-1, 1]) {
    const b0 = new THREE.Vector3(s * 0.2, -0.45 * len, 0.46), b1 = new THREE.Vector3(s * 0.24, -0.45 * len - 0.62, 0.42);
    for (let k = 0; k < 4; k++) { const p = b0.clone().lerp(b1, k / 4 + 0.1), knot = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), k % 2 ? dark : H); knot.scale.y = 1.3; knot.position.copy(p); knot.name = name; g.add(knot); }
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 10), brass); ring.position.copy(b1); ring.name = name + '_Ring'; g.add(ring);
    const end = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 8), H); end.rotation.x = Math.PI; end.position.copy(b1).add(new THREE.Vector3(0, -0.12, 0)); end.name = name; g.add(end);
  }
  return g;
}
// a miner's cap (the head bone's space, before its 0.62 scale: the head spans x ±0.54, y −0.11 … 0.95)
function minerCap(lamp) {
  const g = new THREE.Group(); g.name = lamp ? 'Lamp_Cap' : 'Miner_Cap';
  const leather = mat(0x3a2a1e, 0, 0.9), seam = mat(0x22180e, 0, 0.95);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.6, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), leather); dome.scale.set(1, 0.66, 1.04); dome.position.set(0, 0.56, -0.02); g.add(dome);
  const peak = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.7, 0.05, 16, 1, false, -0.9, 1.8), leather); peak.position.set(0, 0.56, 0.04); g.add(peak);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.605, 0.605, 0.08, 16), seam); band.position.set(0, 0.6, -0.02); g.add(band);
  if (lamp) {
    const brass = mat(0xc89a48, 0.85, 0.35), b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.1), brass); b.position.set(0, 0.8, 0.56); g.add(b);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 0.08, 10), brass); cup.rotation.x = Math.PI / 2; cup.position.set(0, 0.82, 0.64); g.add(cup);
  }
  g.traverse((o) => { if (o.isMesh) o.name = g.name; });
  return g;
}


// a book, spine along y at the grip, covers ±x, opening toward +z (the kit's Spellbook's way)
function book({ name, w, h, t, cover, edge, pages, clasp, boss, corners }) {
  const g = new THREE.Group(); g.name = name;
  const C = mat(cover, 0, 0.75), E = mat(edge, 0.85, 0.32), P = mat(pages, 0, 0.9), K = mat(clasp, 0.85, 0.32);
  const y0 = 0.06 + h / 2;
  for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.03, h, w), C); c.position.set(s * (t / 2 - 0.015), y0, 0); c.name = name + '_Cover'; g.add(c); }
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(t / 2, t / 2, h, 10, 1, false, Math.PI, Math.PI), C); spine.position.set(0, y0, -w / 2); g.add(spine);
  const p = new THREE.Mesh(new THREE.BoxGeometry(t - 0.05, h - 0.03, w - 0.02), P); p.position.set(0, y0, 0.01); g.add(p);
  const k = new THREE.Mesh(new THREE.BoxGeometry(t + 0.02, 0.05, 0.06), K); k.position.set(0, y0, w / 2 - 0.02); g.add(k);
  for (const y of [y0 - h / 2 + 0.04, y0 + h / 2 - 0.04]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(t / 2 + 0.008, t / 2 + 0.008, 0.03, 10, 1, false, Math.PI, Math.PI), E); b.position.set(0, y, -w / 2); g.add(b); }
  if (boss) for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12), mat(boss, 0.85, 0.32)); b.rotation.z = Math.PI / 2; b.position.set(s * (t / 2 + 0.005), y0, 0); g.add(b); }
  if (corners) for (const s of [-1, 1]) for (const yy of [-1, 1]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.06, 0.06), E); c.position.set(s * (t / 2 - 0.012), y0 + yy * (h / 2 - 0.03), w / 2 - 0.03); g.add(c); }
  return g;
}

// a hood about the head (the head bone's space): a shell over the crown, the sides and the back, open at the face,
// falling to the shoulders; `tip` a point hanging behind. Kept off the head (±0.56 wide, its back to −0.75).
// Its form (the owner, 2026-11-12: "The hoods looked funny, too much like a sphere, not more ovalish like they should
// be"): a sphere bent into an oval about the head, taller than wide, narrowing to a soft point up and back at the crown
// and flaring at the bottom where the cloth falls onto the shoulders. hoodForm maps a point of the unit sphere onto it.
const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const hoodForm = (rz, inset = 0) => (x, y, z, out = new THREE.Vector3()) => {
  const top = sm(0.35, 1, y), low = sm(-0.3, -1, y), ears = Math.exp(-(((y + 0.05) / 0.3) ** 2)), k = (1 - 0.1 * top) * (1 + 0.3 * low) * (1 - inset);
  return out.set(x * (0.56 + 0.04 * ears) * k, 0.48 + y * 0.72 * (1 - inset * 0.5), -0.08 + (z * k - 0.08 * top) * rz);   // (round over the crown, a little up and back; clear of the ears)
};
/** the hood's ring at a height y (head-bone space): its half-width, half-depth and middle, for what sits on it */
export function hoodRing(rz, y) {
  const F = hoodForm(rz); let lo = -1, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (F(0, m, 0).y < y) lo = m; else hi = m; }
  const yn = (lo + hi) / 2, r = Math.sqrt(Math.max(0, 1 - yn * yn)), c = F(0, yn, 0);
  return { hx: F(r, yn, 0).x, hz: F(0, yn, r).z - c.z, cz: c.z };
}
// win: the face's window made an oval, the unit sphere's angles bent before the form: its half-angle `a` at the cheeks,
// narrowing toward the brow and the chin (within the window's span of the sphere, t0 to t1 down from the top)
function formed(geo, form, win = null) {
  const p = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (win) {
      const th = Math.acos(Math.max(-1, Math.min(1, y))), r = Math.sqrt(x * x + z * z), u = Math.max(0, Math.min(1, (th - win.t0) / (win.t1 - win.t0)));
      let d = Math.atan2(z, -x) - Math.PI / 2; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
      const aw = win.a * (0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, u * 1.08))), m = Math.abs(d), m2 = aw + ((m - win.a) * (Math.PI - aw)) / (Math.PI - win.a), ph = Math.PI / 2 + Math.sign(d || 1) * m2;
      x = -Math.cos(ph) * r; z = Math.sin(ph) * r;
    }
    form(x, y, z, v); p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals(); return geo;
}
function hoodShell({ name, cloth, shade, open, rz, tip }) {
  const g = new THREE.Group(); g.name = name; g.userData.helm = true; g.userData.hoodRz = rz;
  const C = new THREE.MeshStandardMaterial({ color: cloth, roughness: 0.92, metalness: 0, side: THREE.DoubleSide }), F = hoodForm(rz);
  const crown = new THREE.Mesh(formed(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI * 0.32), F), C); crown.name = name + '_Cloth'; g.add(crown);
  // the sides and back, the face's window cut out of the front (three's sphere: z = sin φ, so the front +z is φ = π/2)
  const a = open, win = { a, t0: Math.PI * 0.3, t1: Math.PI * 0.96 }, side = new THREE.Mesh(formed(new THREE.SphereGeometry(1, 40, 22, Math.PI / 2 + a, Math.PI * 2 - 2 * a, Math.PI * 0.3, Math.PI * 0.66), F, win), C);
  side.name = name + '_Cloth'; g.add(side);
  // the inside, in the shade, so the window reads as depth round the face
  const inner = new THREE.Mesh(formed(new THREE.SphereGeometry(1, 36, 18, Math.PI / 2 + a, Math.PI * 2 - 2 * a, Math.PI * 0.3, Math.PI * 0.66), hoodForm(rz, 0.015), win), new THREE.MeshStandardMaterial({ color: new THREE.Color(shade).multiplyScalar(0.55), roughness: 1, side: THREE.BackSide }));
  g.add(inner);
  if (tip) { const len = tip + 0.35, t = new THREE.Mesh(new THREE.ConeGeometry(0.2, len, 12), C), at = F(0, 0.62, -0.78), dir = new THREE.Vector3(0, -0.8, -0.6).normalize();   // (the hood's point, falling down the back)
    t.position.copy(at).addScaledVector(dir, len * 0.42); t.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().negate()); t.scale.set(1, 1, 0.65); g.add(t); }
  return g;
}

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
  root.traverse((o) => { if (!o.isMesh || !o.material.map || /Eyes/.test(o.name) || o.userData.foreign) return;   // (a body from another kit, gear.js: its own texture, its own colours)
    let m = done.get(o.material);
    if (!m) { const src = o.material.map, t = new THREE.CanvasTexture(swatches(src.image, list));
      t.flipY = src.flipY; t.colorSpace = src.colorSpace; t.magFilter = src.magFilter; t.minFilter = src.minFilter; t.wrapS = src.wrapS; t.wrapT = src.wrapT;
      m = o.material.clone(); m.map = t; done.set(o.material, m); }
    o.material = m; });
}
