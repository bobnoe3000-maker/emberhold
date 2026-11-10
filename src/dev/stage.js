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
  const st = { ready: false, figures: /** @type {any[]} */ ([]), names: /** @type {string[]} */ ([]), pages: 1, room: '' };
  const P = Object.fromEntries(params.entries());
  const opt = { cast: P.cast || 'vermin,party', match: P.match || '', per: +(P.per || 12), page: +(P.page || 1), cols: +(P.cols || 4), gap: +(P.gap || 4.5),
    clip: P.clip || 'idle', t: P.t !== undefined ? +P.t : undefined, at: P.at !== undefined ? +P.at : undefined, dir: P.dir !== undefined ? +P.dir : 2, labels: P.labels !== '0', room: P.room || 'big' };
  setPaused(true);
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
  renderer.setStage(() => {
    const H = /** @type {any} */ (globalThis).__world3d;
    if (H && tags.size) for (const [f, el] of tags) { const q = H.probe(f.x, f.y); if (q && q.luminati) { el.style.left = q.luminati[0] + 'px'; el.style.top = q.luminati[1] + 6 + 'px'; } }
    return { only: true, figures: st.figures };
  });

  fetch('./assets/models/cast.json').then((r) => r.json()).then((c) => {
    all = Object.keys(c.actors);
    const w = sim.world, want = +(P.floor || 0);
    if (w.kind === 'dungeon' && (w.depth || 0) !== want) sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth: want, floors: [] });
    layout(); st.ready = true;
  });

  return {
    get ready() { return st.ready; },
    get figures() { return st.figures; },
    get names() { return st.names; },
    get pages() { return st.pages; },
    get room() { return st.room; },
    /** change the lineup in place (a capture's next shot): any of the URL's options @param {Record<string, any>} patch */
    set(patch) {
      for (const [k, v] of Object.entries(patch)) /** @type {any} */ (opt)[k] = v;
      for (const k of ['t', 'at']) if (k in patch && (patch[k] === null || patch[k] === '')) /** @type {any} */ (opt)[k] = undefined;
      if (st.ready) layout();
    },
  };
}
