// @ts-check
// stage.js — the Stage on Luminati (docs/art-review.md; the owner, 2026-11-10: "recreate the cast lineup and live fx page"):
// dev only, `?dev&scene=stage&show=cast` (localhost: main.js). Any of the cast (assets/models/cast.json: the heroes, the
// townsfolk, the foes, the bosses, the vermin), lined up in a real dungeon room and drawn by the game's own path: the
// renderer's draws (renderer.js setStage), hybrid.js, Luminati's figures (world.js placeFigure, figure.js and the creature
// kit). Each at a clip, looping or held at a moment. The sim is held still (nothing ticks): no wave comes, nobody moves.
//   cast=…        actors and groups, comma separated: party · town · foes · bosses · vermin · all, or names (hero_mage)
//   match=…       only actors whose name holds it          per=12 · page=1   a page of the lineup
//   cols=4 · gap=4.5 (tiles)                               the grid, square to the screen
//   clip=idle|walk|attack|attack2|heavy|hit|death|cast|…   t=0.4: held that many seconds in, or at=0.5: held that far
//                 through the clip (else looping) · dir=0..7
//   site=barrows · floor=0 · room=big|entrance|<part id>   where: the floor's biggest room by default
//   labels=0                                               no names under the figures
// For captures (tools/capture/stage.mjs --show cast): globalThis.__stage { ready, figures, set(patch) }.
// Nothing here writes the sim but where the hero stands (the camera's); the page is a preview and never saves.
//
// `show=fx`: the live effects. A real fight, so every effect is the game's own from the sim's own events (a field, a leap,
// a flare, the blades read the sim's state: no event made up here would draw them as the game does). A party with only
// the chosen skills in play (the rest off: battle.js autocastOn), at a level, every trial done, in a room of that level;
// the waves come as they do. Kept on its feet (a member under 20 % is put back to 50 %: a heal or a guard, which wait for a low mark, still have a reason) and its MP full, so the
// skills fire whenever their own rules let them, again and again. (Revive chosen: the last of the party is left to fall,
// for it to have someone to raise. Turn Undead wants undead: the Old Barrows' floor=2, the Ashbound's.)
//   skill=…       ids, comma separated (frost_nova,cleave); each caster's class joins the party   cls=mage: all of a
//                 class's skills; neither: a plain fight, every skill the game's way   with=fighter,cleric: the rest of the
//                 party, to three (a plain fight's: fighter, rogue, cleric)
//   lv=15         the party's level and the room's (raised to the level the chosen skills open at)                site= · floor= · room= as above
// globalThis.__stage.casts: each chosen skill's 'skill' events as they come ({ id, at, by, x, y, tx, ty, t }).

import { makeHero, makeMember, statsFor } from '../sim/party.js';
import { autoAllocate } from '../sim/attributes.js';
import { starterKit } from '../sim/items.js';
import { SKILLS } from '../sim/skills.js';

const GROUPS = {
  party: (n) => n.startsWith('hero_'),
  town: (n) => n.startsWith('npc_'),
  vermin: (n) => n.startsWith('vermin_'),
  bosses: (n) => n.startsWith('boss_'),
  foes: (n) => !/^(hero|npc|boss)_/.test(n),
  all: () => true,
};

/**
 * @param {{ sim: any, renderer: any, params: URLSearchParams, setPaused: (on: boolean) => void }} o
 */
export function createStage({ sim, renderer, params, setPaused }) {
  const st = { ready: false, figures: /** @type {any[]} */ ([]), names: /** @type {string[]} */ ([]), pages: 1, room: '', casts: /** @type {any[]} */ ([]), party: /** @type {string[]} */ ([]) };
  const P = Object.fromEntries(params.entries()), FX = P.show === 'fx';
  const opt = { cast: P.cast || 'vermin,party', match: P.match || '', per: +(P.per || 12), page: +(P.page || 1), cols: +(P.cols || 4), gap: +(P.gap || 4.5),
    clip: P.clip || 'idle', t: P.t !== undefined ? +P.t : undefined, at: P.at !== undefined ? +P.at : undefined, dir: P.dir !== undefined ? +P.dir : 2, labels: P.labels !== '0', room: P.room || 'big' };
  setPaused(!FX);
  let all = /** @type {string[]} */ ([]);
  // the labels: plain text under each figure, placed through Luminati's camera each frame (hybrid.js probe)
  const box = document.createElement('div'); box.id = 'stageLabels';
  box.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:5;font:600 11px system-ui,sans-serif;color:#e8e2f0;text-shadow:0 1px 0 #0d0913,1px 0 0 #0d0913,-1px 0 0 #0d0913,0 -1px 0 #0d0913';
  document.body.append(box);
  // the HUD out of the way (the minimap, the party's cards, the compass): the world and the figures alone
  const hide = document.createElement('style');
  hide.textContent = 'body > *:not(#game):not(#world3d):not(#world3d-ui):not(#stageLabels):not(script):not(style) { display: none !important; }';
  document.head.append(hide);
  const tags = new Map();

  function centre() {
    const w = sim.world, L = w.level, rooms = (L && L.rooms) || [];
    const room = opt.room === 'entrance' ? L.entrance : rooms.find((r) => r.part === opt.room)
      || rooms.slice().sort((a, b) => (b.x1 - b.x0) * (b.y1 - b.y0) - (a.x1 - a.x0) * (a.y1 - a.y0))[0];
    st.room = room ? room.part || String(room.id) : '';
    return room ? { x: room.cx + 0.5, y: room.cy + 0.5 } : { x: sim.state.player.x, y: sim.state.player.y };
  }
  function layout() {
    const names = [...new Set(opt.cast.split(',').flatMap((g) => all.filter((n) => (GROUPS[g] ? GROUPS[g](n) : g === n))))].filter((n) => !opt.match || n.includes(opt.match));   // (in the order asked)
    st.pages = Math.max(1, Math.ceil(names.length / opt.per));
    const page = names.slice((opt.page - 1) * opt.per, opt.page * opt.per);
    const C = centre(), cols = Math.min(opt.cols, page.length || 1), rows = Math.ceil(page.length / cols), k = opt.gap * Math.SQRT1_2;
    st.names = page;
    st.figures = page.map((actor, i) => {
      // screen right is +x −y, screen down +x +y; a tile is half as tall as it is wide, and a figure taller than wide: the
      // rows twice and a bit apart, for each row to clear the one behind it
      const a = (i % cols) - (cols - 1) / 2, b = (Math.floor(i / cols) - (rows - 1) / 2) * 2.2;
      return { actor, x: C.x + (a + b) * k, y: C.y + (b - a) * k, dir: opt.dir, clip: opt.clip, t: opt.t, at: opt.at, seed: (i * 0.37) % 1 };
    });
    const p = sim.state.player; p.x = p.px = C.x; p.y = p.py = C.y;            // the camera's: it follows the hero (not drawn)
    for (const [, el] of tags) el.remove(); tags.clear();
    if (opt.labels) for (const f of st.figures) { const el = document.createElement('div'); el.style.cssText = 'position:absolute;transform:translate(-50%,0);white-space:nowrap'; el.textContent = f.actor.replace(/^(hero|npc|boss|vermin)_/, ''); box.append(el); tags.set(f, el); }
  }
  // the live effects (show=fx): the party for the chosen skills, in a room at their level, the fight let run
  const fx = { skills: (P.skill || '').split(',').filter(Boolean), cls: P.cls || '', with: P.with ? P.with.split(',').filter(Boolean) : null, lv: +(P.lv || 15) };
  const classOf = (id) => Object.keys(SKILLS).find((c) => SKILLS[c].some((q) => q.id === id)) || null;
  let fxWant = new Set();
  function fxSetup() {
    // (no skill and no class named: a plain fight, every member's own skills as the game picks them)
    const plain = !fx.cls && !fx.skills.length, want = fxWant = new Set(fx.cls ? SKILLS[fx.cls].map((q) => q.id) : fx.skills);
    const classes = [...new Set([...(fx.cls ? [fx.cls] : fx.skills.map(classOf).filter(Boolean)), ...(fx.with || (plain ? ['fighter', 'rogue', 'cleric'] : ['fighter', 'cleric']))])].slice(0, 3);
    // (at least the level the chosen skills open at, and the room with it)
    const lv = Math.max(fx.lv, ...Object.values(SKILLS).flat().filter((q) => want.has(q.id)).map((q) => q.lv));   // (Math.max of fx.lv alone: a plain fight)
    sim.state.trials = Object.fromEntries(Object.keys(SKILLS).flatMap((c) => [[c, 1], [c + '12', 1]]));
    sim.state.party = classes.map((c, i) => {
      const m = i ? makeMember('stage' + i, ['Wren', 'Tam'][i - 1], c, lv) : makeHero({ cls: c });
      m.level = lv; m.attrs = null; m.autoAttrs = true; autoAllocate(m); m.gear = starterKit(m);
      if (!plain) {
        m.off = SKILLS[c].map((q) => q.id).filter((id) => !want.has(id));          // (only the chosen skills in play: on, and in
        m.loadout = SKILLS[c].map((q) => q.id).filter((id) => want.has(id)).slice(0, 4);   // its loadout of four, skills.js inPlay)
      }
      m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; return m;
    });
    st.party = classes;
    const w = sim.world, C = centre(), room = w.level.rooms.find((r) => (r.part || String(r.id)) === st.room);
    if (room) w.roomLevels.set(room.id, lv);
    const p = sim.state.player; p.x = p.px = C.x; p.y = p.py = C.y;
    sim.state.party.forEach((m, i) => { m.x = m.px = C.x + (i ? (i === 1 ? 1.2 : -1.2) : 0); m.y = m.py = C.y + (i ? 1 : 0); });
    st.casts = [];
  }
  sim.bus.on('skill', (e) => { if (FX && st.ready && (fx.cls ? classOf(e.id) === fx.cls : !fx.skills.length || fx.skills.includes(e.id))) { st.casts.push({ id: e.id, at: e.at, by: e.by, x: e.x, y: e.y, tx: e.tx, ty: e.ty, t: sim.state.t }); if (st.casts.length > 200) st.casts.shift(); } });
  renderer.setStage(() => {
    if (FX) {                                                    // (kept on its feet, its MP full: the skills fire on their own rules)
      // (Revive wants someone down: with it chosen, the last of the party is left to fall)
      const fall = fxWant.has('revive') ? sim.state.party[sim.state.party.length - 1] : null;
      for (const m of sim.state.party) { const s = statsFor(m); if (m !== fall && !m.down && !m.fallen && m.hp < s.maxHp * 0.2) m.hp = Math.round(s.maxHp * 0.5); m.mp = s.maxMp; }
      return { figures: [] };
    }
    const H = /** @type {any} */ (globalThis).__world3d;
    if (H && tags.size) for (const [f, el] of tags) { const q = H.probe(f.x, f.y); if (q && q.luminati) { el.style.left = q.luminati[0] + 'px'; el.style.top = q.luminati[1] + 6 + 'px'; } }
    return { only: true, figures: st.figures };
  });

  fetch('./assets/models/cast.json').then((r) => r.json()).then((c) => {
    all = Object.keys(c.actors);
    const w = sim.world, want = +(P.floor || 0);
    if (w.kind === 'dungeon' && (w.depth || 0) !== want) sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth: want, floors: [] });
    if (FX) { centre(); fxSetup(); } else layout();
    st.ready = true;
  });

  return {
    get ready() { return st.ready; },
    get figures() { return st.figures; },
    get names() { return st.names; },
    get pages() { return st.pages; },
    get room() { return st.room; },
    get casts() { return st.casts; },
    get party() { return st.party; },
    /** change the lineup in place (a capture's next shot): any of the URL's options @param {Record<string, any>} patch */
    set(patch) {
      for (const [k, v] of Object.entries(patch)) /** @type {any} */ (opt)[k] = v;
      for (const k of ['t', 'at']) if (k in patch && (patch[k] === null || patch[k] === '')) /** @type {any} */ (opt)[k] = undefined;
      if (FX) { if ('skill' in patch) fx.skills = String(patch.skill).split(',').filter(Boolean); if ('cls' in patch) fx.cls = patch.cls || ''; if ('lv' in patch) fx.lv = +patch.lv; if (st.ready) fxSetup(); return; }
      if (st.ready) layout();
    },
  };
}
