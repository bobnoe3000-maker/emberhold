// @ts-check
// title.js — the Title screen, which doubles as the pause menu (development plan §2.1–§2.3).
// On launch (after the boot's loading screen, src/cutscene/player.js) it covers the (paused)
// world: the wordmark, this slot's hero, and Continue — or Begin, for a slot with no hero yet,
// which plays the intro and then opens character creation. ☰ in the HUD brings it back
// mid-game as a pause menu (Resume). From here: Game slots, Party, The Chronicle (the intro
// again), Sound (the volume, and a slider each for the music, ambience, attacks and spells, footsteps and foes' cries:
// kept per device, audio/settings.js), Account (cloud saves arrive at M6) and Copy debug report (debugreport.js: the game's
// state as text on the clipboard, to paste into a bug report; read only).
// Developer (sim/dev.js; architecture A18): every skill unlocked and levels with their points, for testing; it marks
// the slot a dev game, never verified.
//
// The sim doesn't tick while the title is up (main.js pauses the loop), so a battle behind
// it waits. Preact + htm, like every M3 window.

import { html, render } from 'htm/preact';
import { CLASSES } from '../sim/party.js';
import { pendingPoints } from '../sim/attributes.js';
import { pendingSkillPoints, ladderOf, unlocked, TRIAL_CLASSES } from '../sim/skills.js';
import { DEV_LEVEL_MAX } from '../sim/dev.js';
import { swallow } from './actorart.js';
import { debugReport } from './debugreport.js';

const CSS = `
#titleWrap { position: fixed; inset: 0; z-index: 11; display: none; background: linear-gradient(rgba(8,6,12,.35), rgba(8,6,12,.55) 40%, rgba(8,6,12,.94) 72%); }
#titleWrap.on { display: block; }
#title { position: absolute; left: 0; right: 0; bottom: 0; max-width: 480px; margin: 0 auto; padding: 0 22px calc(env(safe-area-inset-bottom, 0px) + 22px);
  font-family: Georgia, 'Times New Roman', serif; color: #efe4cf; text-align: center; }
#title .mark { font: 400 46px 'IM Fell English SC', Georgia, serif; letter-spacing: 6px; color: #f0c880; text-shadow: 0 2px 0 #000, 0 0 24px rgba(224,168,90,.45); margin-bottom: 6px; }
#title .mark em { font-style: normal; color: #ff9a50; }
#title .tag { font: italic 15px 'IM Fell English', Georgia, serif; color: #c8baa2; line-height: 1.4; margin: 0 auto 26px; max-width: 320px; }
#title .who { font: 12px ui-monospace, Menlo, monospace; letter-spacing: 1px; color: #b8aca0; margin-bottom: 14px; line-height: 1.5; }
#title .who b { color: #efe4cf; font: 600 16px Georgia, serif; letter-spacing: 0; }
#title button { display: block; width: 100%; min-height: 48px; margin: 0 0 10px; border-radius: 10px; font: 600 15px Georgia, serif; letter-spacing: 1px;
  border: 1px solid rgba(214,170,98,0.5); color: #f0c880; background: rgba(16,12,22,.8); }
#title button.pri { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; border-color: #f0c880; font-size: 17px; }
#title button:disabled { color: #6f6880; border-color: #3a3346; background: rgba(16,12,22,.6); }
#title button small { display: block; font: 10.5px ui-monospace, Menlo, monospace; letter-spacing: .5px; color: inherit; opacity: .75; margin-top: 2px; }
#title .row { display: flex; gap: 10px; } #title .row button { flex: 1; }
#title .snd { text-align: left; margin: 0 0 12px; max-height: calc(100vh - 150px); overflow-y: auto; }
#title .snd label { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; padding: 0 12px; margin: 0 0 8px;
  border-radius: 10px; border: 1px solid rgba(214,170,98,0.35); background: rgba(16,12,22,.8); font: 600 15px Georgia, serif; color: #efe4cf; }
#title .snd label small { display: block; font: 10.5px ui-monospace, Menlo, monospace; color: #b8aca0; margin-top: 2px; letter-spacing: .3px; }
#title .snd label > span { min-width: 0; }
#title .snd small b { font-weight: 600; color: #f0c880; }
#title .snd input[type=range] { width: 46%; height: 40px; accent-color: #e0a84a; flex: none; }
#title .dev { max-height: calc(100vh - 120px); overflow-y: auto; }
#title .devwho { text-align: left; margin: 0 0 6px; font: 600 15px Georgia, serif; color: #efe4cf; }
#title .devwho small { display: block; font: 11px ui-monospace, Menlo, monospace; color: #b8aca0; margin-top: 2px; }
#title .devnote { font: 11px ui-monospace, Menlo, monospace; color: #c8baa2; line-height: 1.45; margin: 0 0 12px; text-align: left; }
#title .devsaid { font: 12px ui-monospace, Menlo, monospace; color: #f0c880; min-height: 1.4em; margin: 0 0 10px; }
`;

/**
 * @param {{ sim: any, slot: number, audio?: any, setPaused: (on: boolean) => void, openSlots: () => void, openParty: () => void, openCreate: () => void,
 *   openChronicle: (mode: string) => void, onOpen?: () => void, onPlay?: () => void, openPage?: (url: string) => void,
 *   graphics?: { read: () => any, set: (patch: any) => Promise<any>, current: () => string, status?: () => any } | null, tune?: (() => void) | null,
 *   devApply?: ((cmds: any[]) => void) | null }} o  onPlay: the title closes into play;
 *   openPage: a sandbox page of its own (the Frontier, docs/frontier-proposal.md; the Luminati prototype,
 *   docs/lumina-prototype.md), the game saved first; graphics: the Graphics panel (src/render3d/settings.js); tune: the
 *   Brightness tray (ui/brightness.js), opened over play with the menu closed
 */
export function createTitle({ sim, slot, audio = null, setPaused, openSlots, openParty, openCreate, openChronicle, onOpen = () => {}, onPlay = () => {}, openPage = null, graphics = null, tune = null, devApply = null }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'titleWrap'; document.body.appendChild(wrap);
  swallow(wrap);
  let mode = 'title', panel = '';

  // Sound: the player's settings, applied as they change (audio/settings.js keeps them): the volume, then a slider for
  // each kind of sound (the owner: "instead of on or off for each effect add a volume slider", and one for the music)
  const SOUND_ROWS = [['music', 'Music', 'the Chronicle’s score, under the title'], ['ambient', 'Ambient sound', 'the creek, wind, rain, drips, birds and owls'],
    ['combat', 'Attacks and spells', 'blows, bows, spells, loot and level-ups'], ['steps', 'Footsteps', 'on grass, cobbles and stone'],
    ['voices', 'Foes arriving and falling', 'goblins’ screeches, the dead rising, death cries']];
  const slider = (k, label, what, v) => { const pct = Math.round(v * 100);
    return html`<label key=${k}><span>${label}<small>${what ? html`${what} · ` : ''}<b>${pct === 0 ? 'off' : `${pct} %`}</b></small></span>
      <input type="range" min="0" max="100" step="5" value=${pct} aria-label=${label} aria-valuetext=${pct === 0 ? 'off' : `${pct} percent`}
        onInput=${(e) => { audio.set({ [k]: +e.currentTarget.value / 100 }); draw(); }} /></label>`; };
  function Sound() {
    const st = audio.settings;
    return html`<div id="title">
      <div class="mark" style="font-size:32px">SOUND</div>
      <div class="snd">
        ${slider('volume', 'Volume', '', st.volume)}
        ${SOUND_ROWS.map(([k, label, what]) => slider(k, label, what, st[k]))}
      </div>
      <button class="pri" onClick=${() => { panel = ''; draw(); }}>Back</button>
    </div>`;
  }

  // Graphics (render3d/settings.js, per device): the world is drawn by Luminati only (docs/luminati-only-cleanup.md); the
  // depth of field (the owner: "Depth of field Blur is a new menu setting"), Luminati's lens blur, soft or off; the hit
  // feel, the frame rate on screen and the brightness tray
  const choice = (k, v, label, what, on) => html`<button key=${k + v} class=${on ? 'pri' : ''} aria-pressed=${on ? 'true' : 'false'}
    onClick=${async () => { await graphics.set({ [k]: v }); draw(); }}>${label}<small>${what}</small></button>`;
  // what Luminati is drawing the people as (docs/dungeon-kit-proposal.md §9.6): models or sprites, how many, and the density
  // it draws at; a model that failed says why (the owner saw sprites on a phone we can't test from here)
  function figStatus() {
    const s = graphics.status ? graphics.status() : null;
    if (!s) return 'People: Luminati is still starting';
    const at = s.pr ? ` · drawn at ${+s.pr.toFixed(2)}× (screen ${+(s.dpr || 1).toFixed(2)}×)` : '';
    if (s.figures === 'sprites') return `People: sprites (?figures=sprites)${at}`;
    if (s.figErr) return `People: sprites where a model failed (${s.figErr})${at}`;
    if (s.actors > 0 && s.models === s.actors) return `People: 3D models, all ${s.models} in view${at}`;
    return `People: ${s.models || 0} of ${s.actors || 0} in view as models, the rest still loading${at}`;
  }
  function Graphics() {
    const g = graphics.read(), r = graphics.current();
    return html`<div id="title">
      <div class="mark" style="font-size:32px">GRAPHICS</div>
      ${r === 'luminati' && html`<div class="tag" id="figStatus">${figStatus()}</div>`}
      <div class="tag">Depth of field</div>
      <div class="row">
        ${choice('dof', 'soft', 'Soft blur', 'far and near a little soft', g.dof === 'soft')}
        ${choice('dof', 'off', 'Off', 'everything sharp', g.dof === 'off')}
      </div>
      <div class="tag">Hit feel</div>
      <div class="row">
        ${choice('feel', 'full', 'Full', 'blows hold and jolt', g.feel === 'full')}
        ${choice('feel', 'light', 'Light', 'half as much', g.feel === 'light')}
        ${choice('feel', 'off', 'Off', 'the screen keeps still', g.feel === 'off')}
      </div>
      <div class="tag">Frame rate on screen</div>
      <div class="row">
        ${choice('fps', 'on', 'Show', 'frames a second, under ☰', g.fps === 'on')}
        ${choice('fps', 'off', 'Hide', 'for play', g.fps !== 'on')}
      </div>
      ${tune && html`<div class="tag">Brightness by the part of the day</div>
      <button disabled=${!(mode === 'pause' || sim.state.created)} onClick=${() => { hide(); setPaused(false); onPlay(); tune(); }}>Brightness<small>${mode === 'pause' || sim.state.created
        ? ['dawn', 'day', 'dusk', 'night'].map((p) => `${p} ${g.bright ? g.bright[p] : 100} %`).join(' · ')
        : 'once your hero is made'}</small></button>`}
      <button class="pri" onClick=${() => { panel = ''; draw(); }}>Back</button>
    </div>`;
  }

  // Compare worlds (the owner, 2026-10-31: "Keep these map options available from the menu so i can compare gameplay
  // and world art"): the Luminati prototype's own maps (docs/lumina-prototype.md; the game itself is drawn by Luminati only
  // since 2026-11-09, and the prototype goes in the cleanup's step 2), each opened with your hero's look, with a way straight back (its ◂ Game). The game is saved before a page of the prototype opens (openPage).
  const PROTO = [['thornwick', 'Thornwick', 'our town, in Luminati’s own play', ''], ['encounter', 'The Scrag Warren', 'a party of three against the hill goblins · Auto', '&auto=1'],
    ['barrows', 'The Old Barrows', 'the Ashbound and the Quartermaster · Auto', '&auto=1'], ['catalogue', 'The Catalogue', 'every world asset Luminati builds', ''],
    ['catalogue-art', 'The Catalogue: our art', 'every piece of Emberfall’s world art in Luminati’s light', ''],
    ['biomes', 'The Biomes', 'grassland, desert, snow and ice: the tiles the Vale, the Reach and the Heights are drawn in', '']];
  const PROTO_HEROES = ['hero_knight', 'hero_barbarian', 'hero_rogue', 'hero_mage', 'hero_cleric', 'hero_shaman', 'hero_wren', 'hero_brannoc'];
  function Worlds() {
    const look = sim.state.party[0]?.actor, hero = PROTO_HEROES.includes(look) ? look : 'hero_knight';
    const go = (slug, extra) => openPage(`./lumina/game.html?autostart=1&level=${slug}&hero=${hero}&from=game${extra}`);
    return html`<div id="title">
      <div class="mark" style="font-size:32px">WORLDS</div>
      <div class="tag">Luminati’s prototype maps</div>
      ${PROTO.map(([slug, name, what, extra]) => html`<button key=${slug} onClick=${() => go(slug, extra)}>${name}<small>${what}</small></button>`)}
      <div class="row">
        <button onClick=${() => openPage('./lumina/index.html')}>All of Luminati’s worlds<small>and its other views</small></button>
        <button onClick=${() => openPage('./frontier.html')}>The Frontier<small>the Old Provinces as one land</small></button>
      </div>
      <button class="pri" onClick=${() => { panel = ''; draw(); }}>Back</button>
    </div>`;
  }

  // Developer (the owner, 2026-11-08: "Add a developer option in the menu to unlock skills, and add a level which includes
  // appropriate skill points and stats"; on the site too, the owner's choice): every skill unlocked for the company, and
  // a level for anyone in the party, by the sim's own commands (sim/dev.js), so a level brings its stat points, its skill
  // point and its HP as one fought for does. Applied at once (main.js devApply: the menu holds the game still). Either
  // marks this slot a dev game: never verified once saves go online.
  let devSaid = '';
  function devDo(cmds, say) { if (!devApply) return; devApply(cmds); devSaid = say(); draw(); }
  function Developer() {
    const S = sim.state, all = TRIAL_CLASSES.length * 2, done = TRIAL_CLASSES.reduce((n, c) => n + (S.trials[c] ? 1 : 0) + (S.trials[c + '12'] ? 1 : 0), 0);
    const pts = (m) => { const a = pendingPoints(m), k = pendingSkillPoints(m); return a || k ? `${a ? `${a} stat point${a > 1 ? 's' : ''}` : ''}${a && k ? ' · ' : ''}${k ? `${k} skill point${k > 1 ? 's' : ''}` : ''} to spend` : 'no points to spend'; };
    const open = (m) => ladderOf(m.cls).filter((q) => unlocked(m, q, S.trials)).length, carried = (m) => ladderOf(m.cls).length;   // (abilities and passives: the ladder, skills.js)
    const up = (m, n) => devDo(Array.from({ length: Math.min(n, DEV_LEVEL_MAX - m.level) }, () => ({ type: 'devLevel', id: m.id })),
      () => `${m.name} is level ${m.level}: ${pts(m)} · ${open(m)} of ${carried(m)} skills open`);
    return html`<div id="title" class="dev">
      <div class="mark" style="font-size:32px">DEVELOPER</div>
      <div class="devnote">For testing. A level comes as one fought for does: 3 stat points, a skill point at every even level, the HP it brings. Using either marks this slot a <b>dev game</b>${S.dev ? ' (it is one)' : ''}: it will never count as verified progress once saves go online.</div>
      <div class="devsaid" role="status">${devSaid}</div>
      <button disabled=${done >= all || !S.created} onClick=${() => devDo([{ type: 'devUnlockSkills' }], () => 'Every skill unlocked: each opens at its level (6, 12)')}>
        Unlock every skill<small>${done >= all ? 'done: every class’s level-6 and level-12 trials' : `every class’s trials, as if done (${done} of ${all} now): each skill opens at its level`}</small></button>
      ${S.created && S.party.map((m) => html`<div key=${m.id}>
        <div class="devwho">${m.name}<small>${(CLASSES[m.cls] || CLASSES.fighter).label} · level ${m.level} · ${pts(m)} · ${open(m)} of ${carried(m)} skills open</small></div>
        <div class="row">
          <button disabled=${m.level >= DEV_LEVEL_MAX} onClick=${() => up(m, 1)}>+1 level</button>
          <button disabled=${m.level >= DEV_LEVEL_MAX} onClick=${() => up(m, 5)}>+5 levels</button>
        </div></div>`)}
      <div class="row">
        <button disabled=${!S.created} onClick=${() => { devSaid = ''; close(); openParty(); }}>Party<small>spend the points</small></button>
        <button class="pri" onClick=${() => { panel = ''; devSaid = ''; draw(); }}>Back</button>
      </div>
    </div>`;
  }

  function Title() {
    if (panel === 'dev' && devApply) return html`<${Developer} />`;
    if (panel === 'sound' && audio) return html`<${Sound} />`;
    if (panel === 'graphics' && graphics) return html`<${Graphics} />`;
    if (panel === 'worlds' && openPage) return html`<${Worlds} />`;
    const S = sim.state, h = S.party[0], made = S.created;
    const where = sim.world.kind === 'dungeon' ? `${(sim.world.siteName || 'The Old Barrows').replace(/^The /, 'the ')} · depth ${S.depth + 1}` : sim.world.name || 'Emberfall';
    return html`<div id="title">
      <div class="mark">EMBER<em>FALL</em></div>
      <div class="tag">The heroes of this age are not available… Looks like it is up to you.</div>
      <div class="who">${made
        ? html`Slot ${slot} · <b>${h.name}</b><br />${(CLASSES[h.cls] || CLASSES.fighter).label} · level ${h.level} · ${where}${S.dev ? ' · dev game' : ''}`
        : html`Slot ${slot} · <b>no hero yet</b><br />a new party, a fresh Emberfall`}</div>
      ${made
        ? html`<button class="pri" onClick=${close}>${mode === 'pause' ? 'Resume' : 'Continue'}</button>`
        : html`<button class="pri" onClick=${() => { hide(); openCreate(); }}>Begin</button>`}
      <div class="row">
        <button onClick=${() => openSlots()}>Game slots</button>
        <button disabled=${!made} onClick=${() => { close(); openParty(); }}>Party</button>
      </div>
      <div class="row">
        <button onClick=${() => { hide(); openChronicle(mode); }}>The Chronicle<small>watch the intro</small></button>
        <button disabled>Account<small>cloud saves with M6</small></button>
      </div>
      ${openPage && html`<div class="row">
        <button onClick=${() => openPage('./frontier.html')}>The Frontier<small>the Old Provinces as one land</small></button>
        <button onClick=${() => openPage('./lumina/index.html')}>Another world<small>Luminati's dioramas, your people</small></button>
      </div>
      <button onClick=${() => { panel = 'worlds'; draw(); }}>Compare worlds<small>the prototype's Scrag Warren · the Old Barrows · Thornwick · the catalogues, one tap each</small></button>`}
      ${audio && html`<button onClick=${() => { panel = 'sound'; draw(); }}>Sound<small>volume · music · ambient · attacks and spells · footsteps · foes</small></button>`}
      ${graphics && html`<button onClick=${() => { panel = 'graphics'; draw(); }}>Graphics<small>depth of field · hit feel · brightness · frame rate</small></button>`}
      <button onClick=${copyReport}>${copied || 'Copy debug report'}<small>stats, state and quests, for a bug report</small></button>
      ${devApply && made && html`<button onClick=${() => { panel = 'dev'; devSaid = ''; draw(); }}>Developer<small>unlock every skill · levels with their points${S.dev ? ' · a dev game' : ''}</small></button>`}
    </div>`;
  }
  const draw = () => render(html`<${Title} />`, wrap);
  // the report to the clipboard; the label says how it went (a HUD toast would sit under this menu)
  let copied = '';
  async function copyReport() {
    const text = debugReport(sim, { slot, when: new Date().toISOString(), ua: navigator.userAgent, view: `${innerWidth}×${innerHeight} @${devicePixelRatio}x` });
    let ok;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta); ta.select(); try { ok = document.execCommand('copy'); } catch { ok = false; } ta.remove();
    }
    copied = ok ? `Copied ✓ (${Math.round(text.length / 1024)} KB)` : 'Copy failed: no clipboard here'; draw();
    setTimeout(() => { copied = ''; if (wrap.classList.contains('on')) draw(); }, 2500);
  }
  function open(m = 'title') { mode = m; panel = ''; onOpen(); wrap.classList.add('on'); setPaused(true); draw(); }
  function hide() { wrap.classList.remove('on'); render(null, wrap); }
  function close() { hide(); setPaused(false); onPlay(); }
  const btn = document.getElementById('menuBtn');
  if (btn) { btn.setAttribute('aria-label', 'Menu'); btn.addEventListener('click', () => open('pause')); swallow(btn); }
  return { open, close, get isOpen() { return wrap.classList.contains('on'); } };
}
