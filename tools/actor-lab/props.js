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
};


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
