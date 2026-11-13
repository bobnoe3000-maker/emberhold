// @ts-check
// title.js — the Title screen, which doubles as the pause menu (development plan §2.1–§2.3), laid out after the owner's
// review (2026-11-13: "there are too many menu items … the graphics sub menu is too busy … move the developer items to a
// single menu … Does party make sense here?"; the proposal agreed: "go with it"). Each screen answers one question:
//   · the launch (after the boot's loading screen, src/cutscene/player.js; it holds the world still): Continue (or Begin,
//     for a slot with no hero yet: the intro, then creation), Game slots, Settings, The Chronicle (the intro again);
//   · ☰ in play ('pause': a fight goes on under it): Resume, Settings, The Bowl (from level 6: ui/bowl.js; the owner,
//     2026-11-13: "Menu fine at min level 6"), How to play (the first steps again), Game slots;
//   · Settings: two tabs, Sound (a slider a kind of sound, audio/settings.js) and Graphics (render3d/settings.js), a row a
//     setting, its control on the right: Quality, Resolution, Depth of field, Hit feel, Zoom, Brightness;
//   · Account (net/account.js; the owner, 2026-11-13: "Lets do the account setup including guest"): the guest's handle
//     (a name of the player's own, the hero's name rule, and a 4-digit tag), how long they've played on this device,
//     and the ways to link an online account, which say they aren't set up until the project is (docs/online-setup.md);
//   · Developer, behind a small link on both (the owner: "leave the developer link always on now - we will remove before
//     shipping"): Copy debug report (debugreport.js), the frame rate on screen, the Frame test, what Luminati draws the
//     people as; every skill unlocked and levels with their points (sim/dev.js; architecture A18), which mark the slot a
//     dev game, never verified.
// Party left the menu: the Party screen opens at every Tavern (townmenu.js), and changing the party only works in town. Preact + htm, like every M3 window.

import { html, render } from 'htm/preact';
import { CLASSES } from '../sim/party.js';
import { pendingPoints } from '../sim/attributes.js';
import { pendingSkillPoints, ladderOf, unlocked, TRIAL_CLASSES } from '../sim/skills.js';
import { DEV_LEVEL_MAX } from '../sim/dev.js';
import { swallow } from './actorart.js';
import { debugReport } from './debugreport.js';
import { ZOOM_PCT_MIN, ZOOM_PCT_MAX } from '../render3d/settings.js';
import { PROVIDER_LABEL } from '../net/account.js';
import { BOWL } from '../sim/bowl.js';

const CSS = `
#titleWrap { position: fixed; inset: 0; z-index: 11; display: none; background: linear-gradient(rgba(8,6,12,.35), rgba(8,6,12,.55) 40%, rgba(8,6,12,.94) 72%); }
#titleWrap.on { display: block; }
#titleWrap.deep { background: rgba(8,6,12,.96); }   /* Settings and Developer: the world's labels don't show through their rows */
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
#title.panel { max-height: calc(100vh - 20px); overflow-y: auto; }
#title .mark.small { font-size: 30px; letter-spacing: 4px; margin: 14px 0 12px; }
#title .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 0 0 12px; }
#title .tabs button { margin: 0; min-height: 44px; font: 700 12px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #978c80; border-color: #3a3346; }
#title .tabs button.on { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; border-color: #f0c880; }
/* a setting's row (Graphics, Developer): its name and what it does now on the left, its control on the right, as Sound's sliders */
#title .snd .set { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 52px; padding: 4px 6px 4px 12px; margin: 0 0 8px;
  border-radius: 10px; border: 1px solid rgba(214,170,98,0.35); background: rgba(16,12,22,.8); font: 600 15px Georgia, serif; color: #efe4cf; }
#title .snd .set > span, #title .snd .go > span { min-width: 0; }
#title .snd .set small, #title .snd .go small { display: block; font: 10.5px ui-monospace, Menlo, monospace; color: #b8aca0; margin-top: 2px; letter-spacing: .3px; font-weight: 400; }
#title .seg { display: inline-flex; flex: none; border: 1px solid #3a3346; border-radius: 9px; overflow: hidden; }
#title .seg button { display: block; width: auto; min-height: 44px; margin: 0; padding: 0 9px; border: 0; border-radius: 0; background: none; color: #978c80;
  font: 700 11px ui-monospace, Menlo, monospace; letter-spacing: .3px; }
#title .seg button + button { border-left: 1px solid #3a3346; }
#title .seg button.on { background: rgba(216,160,64,.24); color: #f0c880; }
#title .tog { flex: none; display: block; width: 58px; min-height: 44px; margin: 0; padding: 0; border: 0; background: none; position: relative; }
#title .tog i { position: absolute; left: 6px; right: 6px; top: 11px; height: 22px; border-radius: 11px; background: #3a3346; }
#title .tog i::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 8px; background: #8a8094; transition: left .15s; }
#title .tog.on i { background: #b67c2a; } #title .tog.on i::after { left: 25px; background: #f6dc8a; }
#title .snd .go { display: flex; align-items: center; justify-content: space-between; gap: 10px; text-align: left; min-height: 52px; padding: 4px 14px 4px 12px; margin: 0 0 8px;
  border-color: rgba(214,170,98,0.35); color: #efe4cf; font: 600 15px Georgia, serif; letter-spacing: 0; }
#title .snd .go i { font: 18px ui-monospace, Menlo, monospace; color: #d8a040; font-style: normal; }
#title button.link { display: inline-block; width: auto; min-height: 44px; margin: 2px auto 0; padding: 0 14px; border: 0; background: none; color: #8a8094;
  font: 12px ui-monospace, Menlo, monospace; letter-spacing: .5px; text-decoration: underline; }
#title .grp { font: 700 10.5px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #978c80; text-align: left; margin: 8px 2px 8px; }
@media (prefers-reduced-motion: reduce) { #title .tog i::after { transition: none; } }
#title .dev { max-height: calc(100vh - 20px); overflow-y: auto; }
#title.acct .card { text-align: left; border: 1px solid rgba(214,170,98,0.45); border-radius: 10px; padding: 12px 14px; background: rgba(16,12,22,.85); margin: 0 0 6px; }
#title.acct .card b { display: block; font: 600 20px Georgia, serif; color: #f0c880; }
#title.acct .card span { display: block; font: 11px ui-monospace, Menlo, monospace; color: #b8aca0; margin-top: 3px; }
#title.acct .namer { display: flex; gap: 8px; margin: 0 0 4px; }
#title.acct .namer input { flex: 1; min-width: 0; min-height: 48px; border-radius: 10px; border: 1px solid rgba(214,170,98,0.45); background: #0d0a12; color: #efe4cf;
  font: 600 16px Georgia, serif; padding: 0 12px; }
#title.acct .namer input:focus { outline: 2px solid #d8a040; outline-offset: 1px; }
#title.acct .namer button { width: auto; margin: 0; padding: 0 16px; }
#title.acct .said { font: 11px ui-monospace, Menlo, monospace; color: #b8aca0; text-align: left; margin: 0 2px 10px; min-height: 1.4em; }
#title.acct .said.ok { color: #8fe07a; }
#title.acct .link-acct { min-height: 44px; }
#title .devwho { text-align: left; margin: 0 0 6px; font: 600 15px Georgia, serif; color: #efe4cf; }
#title .devwho small { display: block; font: 11px ui-monospace, Menlo, monospace; color: #b8aca0; margin-top: 2px; }
#title .devnote { font: 11px ui-monospace, Menlo, monospace; color: #c8baa2; line-height: 1.45; margin: 0 0 12px; text-align: left; }
#title .devsaid { font: 12px ui-monospace, Menlo, monospace; color: #f0c880; min-height: 1.4em; margin: 0 0 10px; }
`;

/**
 * @param {{ sim: any, slot: number, audio?: any, setPaused: (on: boolean) => void, openSlots: () => void, openParty: () => void, openCreate: () => void,
 *   openChronicle: (mode: string) => void, onOpen?: () => void, onPlay?: () => void,
 *   graphics?: { read: () => any, set: (patch: any) => Promise<any>, status?: () => any, frameTest?: () => Promise<boolean> } | null, tune?: (() => void) | null,
 *   devApply?: ((cmds: any[]) => void) | null, openSteps?: (() => void) | null, account?: any, openBowl?: (() => void) | null }} o  openBowl: the Bowl's board (ui/bowl.js), from level 6;  account: net/account.js  onPlay: the title closes into play; openSteps: the first steps again (ui/firststeps.js);
 *   graphics: the Graphics panel (src/render3d/settings.js); tune: the
 *   Brightness tray (ui/brightness.js), opened over play with the menu closed
 */
export function createTitle({ sim, slot, audio = null, setPaused, openSlots, openParty, openCreate, openChronicle, onOpen = () => {}, onPlay = () => {}, graphics = null, tune = null, devApply = null, openSteps = null, account = null, openBowl = null }) {
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
  const Sound = () => { const st = audio.settings; return html`<div class="snd">${slider('volume', 'Volume', '', st.volume)}${SOUND_ROWS.map(([k, label, what]) => slider(k, label, what, st[k]))}</div>`; };

  // Graphics (render3d/settings.js, per device), a row a setting, as Sound is: the quality (high, or low: render3d/world.js
  // quality), the resolution (sharp, balanced, fast: the most of the screen's pixel density it draws at), the depth of field
  // (Luminati's lens: soft or off), the hit feel, the zoom (a slider; a pinch or the wheel set it too) and the Brightness
  // tray (ui/brightness.js, opened over play with the menu closed). The testing tools went to Developer.
  const set = async (patch) => { await graphics.set(patch); draw(); };
  /** a row of segments: one of `opts` [value, label], the set one pressed @param {string} k @param {any[][]} opts @param {any} cur */
  const seg = (k, opts, cur) => html`<span class="seg" role="group">${opts.map(([v, label]) => html`<button key=${String(v)} class=${cur === v ? 'on' : ''}
    aria-pressed=${cur === v ? 'true' : 'false'} data-k=${k} data-v=${String(v)} onClick=${() => set({ [k]: v })}>${label}</button>`)}</span>`;
  const row = (k, label, hint, control) => html`<div class="set" key=${k}><span>${label}<small>${hint}</small></span>${control}</div>`;
  const HINT = { quality: { high: 'everything as it was', low: 'quicker: sharp shadows, the nearest lamps' },
    res: { sharp: 'the screen’s own sharpness', balanced: 'at most 2×: quicker', fast: 'at most 1.5×: quicker, softer' },
    feel: { full: 'blows hold and jolt', light: 'half as much', off: 'the screen keeps still' } };
  function Graphics() {
    const g = graphics.read(), canTune = !!tune && (mode === 'pause' || sim.state.created);
    return html`<div class="snd">
      ${row('quality', 'Quality', HINT.quality[g.quality], seg('quality', [['high', 'High'], ['low', 'Low']], g.quality))}
      ${row('res', 'Resolution', HINT.res[g.res], seg('res', [['sharp', 'Sharp'], ['balanced', 'Balanced'], ['fast', 'Fast']], g.res))}
      ${row('dof', 'Depth of field', g.dof === 'off' ? 'everything sharp' : 'the top and bottom of the screen soft', html`<button class=${'tog' + (g.dof !== 'off' ? ' on' : '')} role="switch"
        aria-checked=${g.dof !== 'off' ? 'true' : 'false'} aria-label="Depth of field" data-k="dof" onClick=${() => set({ dof: g.dof === 'off' ? 'soft' : 'off' })}><i></i></button>`)}
      ${row('feel', 'Hit feel', HINT.feel[g.feel], seg('feel', [['full', 'Full'], ['light', 'Light'], ['off', 'Off']], g.feel))}
      <label key="zoom"><span>Zoom<small><b>${g.zoom} %</b> · pinch the world, or the wheel</small></span>
        <input type="range" min=${ZOOM_PCT_MIN} max=${ZOOM_PCT_MAX} step="1" value=${g.zoom} aria-label="Zoom" aria-valuetext=${`${g.zoom} percent`}
          onInput=${(e) => set({ zoom: +e.currentTarget.value })} /></label>
      ${tune && html`<button class="go" key="bright" disabled=${!canTune} onClick=${() => { hide(); setPaused(false); onPlay(); tune(); }}><span>Brightness<small>${canTune
        ? ['dawn', 'day', 'dusk', 'night'].map((p) => `${p} ${g.bright ? g.bright[p] : 100} %`).join(' · ') : 'once your hero is made'}</small></span><i aria-hidden="true">›</i></button>`}
    </div>`;
  }
  let tab = 'sound';
  function Settings() {
    const tabs = [audio && ['sound', 'Sound'], graphics && ['graphics', 'Graphics']].filter(Boolean);
    if (!tabs.some(([k]) => k === tab)) tab = tabs[0][0];
    return html`<div id="title" class="panel">
      <div class="mark small">SETTINGS</div>
      ${tabs.length > 1 && html`<div class="tabs" role="tablist">${tabs.map(([k, label]) => html`<button key=${k} role="tab" class=${tab === k ? 'on' : ''}
        aria-selected=${tab === k ? 'true' : 'false'} onClick=${() => { tab = k; draw(); }}>${label}</button>`)}</div>`}
      ${tab === 'sound' ? html`<${Sound} />` : html`<${Graphics} />`}
      <button class="pri" onClick=${() => { panel = ''; draw(); }}>Back</button>
    </div>`;
  }

  // what Luminati is drawing the people as (docs/dungeon-kit-proposal.md §9.6): models or sprites, how many, and the density
  // it draws at; a model that failed says why (the owner saw sprites on a phone we can't test from here)
  function figStatus() {
    const s = graphics && graphics.status ? graphics.status() : null;
    if (!s) return 'People: Luminati is still starting';
    const at = s.pr ? ` · drawn at ${+s.pr.toFixed(2)}× (screen ${+(s.dpr || 1).toFixed(2)}×)` : '';
    if (s.figures === 'sprites') return `People: sprites (?figures=sprites)${at}`;
    if (s.figErr) return `People: sprites where a model failed (${s.figErr})${at}`;
    if (s.actors > 0 && s.models === s.actors) return `People: 3D models, all ${s.models} in view${at}`;
    return `People: ${s.models || 0} of ${s.actors || 0} in view as models, the rest still loading${at}`;
  }

  // Developer (the owner, 2026-11-08: "Add a developer option in the menu to unlock skills, and add a level which includes
  // appropriate skill points and stats"; on the site too, the owner's choice; 2026-11-13: the testing tools gathered here).
  // Reports: the debug report, the frame rate on screen, the Frame test (render3d/frametest.js), what Luminati draws the
  // people as. Cheats: every skill unlocked for the company, and a level for anyone in the party, by the sim's own commands
  // (sim/dev.js), so a level brings its stat points, its skill point and its HP as one fought for does; applied at once
  // (main.js devApply). Either marks this slot a dev game: never verified once saves go online.
  let devSaid = '';
  function devDo(cmds, say) { if (!devApply) return; devApply(cmds); devSaid = say(); draw(); }
  function Developer() {
    const S = sim.state, all = TRIAL_CLASSES.length * 2, done = TRIAL_CLASSES.reduce((n, c) => n + (S.trials[c] ? 1 : 0) + (S.trials[c + '12'] ? 1 : 0), 0);
    const pts = (m) => { const a = pendingPoints(m), k = pendingSkillPoints(m); return a || k ? `${a ? `${a} stat point${a > 1 ? 's' : ''}` : ''}${a && k ? ' · ' : ''}${k ? `${k} skill point${k > 1 ? 's' : ''}` : ''} to spend` : 'no points to spend'; };
    const open = (m) => ladderOf(m.cls).filter((q) => unlocked(m, q, S.trials)).length, carried = (m) => ladderOf(m.cls).length;   // (abilities and passives: the ladder, skills.js)
    const up = (m, n) => devDo(Array.from({ length: Math.min(n, DEV_LEVEL_MAX - m.level) }, () => ({ type: 'devLevel', id: m.id })),
      () => `${m.name} is level ${m.level}: ${pts(m)} · ${open(m)} of ${carried(m)} skills open`);
    const g = graphics ? graphics.read() : null;
    return html`<div id="title" class="panel dev">
      <div class="mark small">DEVELOPER</div>
      <div class="grp">Reports</div>
      <div class="snd">
        <button class="go" key="report" onClick=${copyReport}><span>${copied || 'Copy debug report'}<small>stats, state and quests, for a bug report</small></span><i aria-hidden="true">›</i></button>
        ${g && html`<div class="set" key="fps"><span>Frame rate on screen<small>frames a second, under ☰</small></span><button class=${'tog' + (g.fps === 'on' ? ' on' : '')} role="switch"
          aria-checked=${g.fps === 'on' ? 'true' : 'false'} aria-label="Frame rate on screen" data-k="fps" onClick=${() => set({ fps: g.fps === 'on' ? 'off' : 'on' })}><i></i></button></div>`}
        ${graphics && graphics.frameTest && html`<button class="go" key="ft" onClick=${() => { close(); setTimeout(() => graphics.frameTest(), 600); }}><span>Frame test<small>about a minute, hands off: each part of the picture timed on this device</small></span><i aria-hidden="true">›</i></button>`}
      </div>
      ${graphics && html`<div class="devnote" id="figStatus">${figStatus()}</div>`}
      <div class="grp">Cheats · mark this slot a dev game${S.dev ? ' (it is one)' : ''}</div>
      <div class="devnote">A level comes as one fought for does: 3 stat points, a skill point at every even level, the HP it brings. A dev game never counts as verified progress once saves go online.</div>
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

  // Account (net/account.js): the guest as others will see them, a name of their own (the hero's name rule), and the ways
  // to link an online account (each says why it can't yet, until the project is set up: docs/online-setup.md)
  let draft = null, acctSaid = '', acctOk = false;
  function Account() {
    const st = account.state, p = st.profile, name = draft ?? p.name;
    const since = p.createdAt ? new Date(p.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : 'today';
    const save = () => { const r = account.rename(name); acctOk = r.ok; acctSaid = r.ok ? `Saved: you're ${account.state.handle}` : r.why; if (r.ok) draft = null; draw(); };
    const link = async (prov) => { const r = await account.linkWith(prov); acctOk = r.ok; acctSaid = r.ok ? 'Linked' : r.why || ''; draw(); };
    return html`<div id="title" class="panel acct">
      <div class="mark small">ACCOUNT</div>
      <div class="card"><b>${st.handle}</b><span>${st.guest ? 'Playing as a guest' : 'Linked'} · on this device since ${since}</span></div>
      <div class="grp">Your name</div>
      <form class="namer" onSubmit=${(e) => { e.preventDefault(); save(); }}>
        <input id="acctName" value=${name} maxlength="16" autocomplete="off" spellcheck="false" aria-label="Your name"
          onInput=${(e) => { draft = e.currentTarget.value; acctSaid = ''; draw(); }} />
        <button type="submit" disabled=${name === p.name}>Save</button>
      </form>
      <div class=${'said' + (acctOk ? ' ok' : '')} role="status">${acctSaid || 'Others see it with your tag, so two players can share a name.'}</div>
      <div class="grp">Keep your heroes safe</div>
      <div class="devnote">Your heroes are saved on this device. Link an account to keep them if you lose it, and to play on another; your guest heroes come with you.</div>
      ${['apple', 'google', 'email'].map((k) => html`<button key=${k} class="link-acct" disabled=${!st.online || !st.providers.includes(k)}
        onClick=${() => link(k)}>${PROVIDER_LABEL[k]}</button>`)}
      ${!st.online && html`<div class="devnote">Online accounts aren’t set up yet. Until then you play as a guest, and nothing leaves this device.</div>`}
      <button class="pri" onClick=${() => { panel = ''; draft = null; acctSaid = ''; draw(); }}>Back</button>
    </div>`;
  }

  function Title() {
    if (panel === 'dev' && devApply) return html`<${Developer} />`;
    if (panel === 'account' && account) return html`<${Account} />`;
    if (panel === 'settings' && (audio || graphics)) return html`<${Settings} />`;
    const S = sim.state, h = S.party[0], made = S.created, paused = mode === 'pause';
    const where = sim.world.kind === 'dungeon' ? `${(sim.world.siteName || 'The Old Barrows').replace(/^The /, 'the ')} · depth ${S.depth + 1}` : sim.world.name || 'Emberfall';
    const settings = (audio || graphics) && html`<button onClick=${() => { panel = 'settings'; draw(); }}>Settings<small>${[audio && 'sound', graphics && 'graphics'].filter(Boolean).join(' · ')}</small></button>`;
    const acct = account && html`<button onClick=${() => { panel = 'account'; draft = null; acctSaid = ''; draw(); }}>Account<small>${account.state.handle} · ${account.state.guest ? 'a guest' : 'linked'}</small></button>`;
    return html`<div id="title">
      ${paused ? html`<div class="mark small">PAUSED</div>` : html`<div class="mark">EMBER<em>FALL</em></div>
      <div class="tag">The heroes of this age are not available… Looks like it is up to you.</div>`}
      <div class="who">${made
        ? html`Slot ${slot} · <b>${h.name}</b><br />${(CLASSES[h.cls] || CLASSES.fighter).label} · level ${h.level} · ${where}${S.dev ? ' · dev game' : ''}`
        : html`Slot ${slot} · <b>no hero yet</b><br />a new party, a fresh Emberfall`}</div>
      ${made
        ? html`<button class="pri" onClick=${close}>${paused ? 'Resume' : 'Continue'}</button>`
        : html`<button class="pri" onClick=${() => { hide(); openCreate(); }}>Begin</button>`}
      ${paused ? html`
        ${settings}
        ${acct}
        ${openBowl && made && h.level >= BOWL.minLevel && html`<button onClick=${() => { close(); openBowl(); }}>The Bowl<small>the arena · ${S.bowl ? `${S.bowl.marks} marks` : 'company against company'}</small></button>`}
        ${openSteps && made && html`<button onClick=${() => { close(); openSteps(); }}>How to play<small>the first steps again</small></button>`}
        <button onClick=${() => openSlots()}>Game slots<small>saved as you go</small></button>`
      : html`
        <button onClick=${() => openSlots()}>Game slots<small>new game · switch · delete</small></button>
        ${settings}
        ${acct}
        <button onClick=${() => { hide(); openChronicle(mode); }}>The Chronicle<small>watch the intro</small></button>`}
      ${devApply && html`<button class="link" onClick=${() => { panel = 'dev'; devSaid = ''; draw(); }}>Developer ›</button>`}
    </div>`;
  }
  const draw = () => { wrap.classList.toggle('deep', panel !== ''); render(html`<${Title} />`, wrap); };
  // the report to the clipboard; the label says how it went (a HUD toast would sit under this menu)
  let copied = '';
  async function copyReport() {
    const text = debugReport(sim, { slot, when: new Date().toISOString(), ua: navigator.userAgent, view: `${innerWidth}×${innerHeight} @${devicePixelRatio}x`, render: graphics && graphics.status ? graphics.status() : null });
    let ok;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta); ta.select(); try { ok = document.execCommand('copy'); } catch { ok = false; } ta.remove();
    }
    copied = ok ? `Copied ✓ (${Math.round(text.length / 1024)} KB)` : 'Copy failed: no clipboard here'; draw();
    setTimeout(() => { copied = ''; if (wrap.classList.contains('on')) draw(); }, 2500);
  }
  // the title holds the game still; the menu in play (☰, 'pause') doesn't: a fight goes on under it (the owner, 2026-11-11:
  // "Fighting should continue while i have the menu open")
  function open(m = 'title') { mode = m; panel = ''; onOpen(); wrap.classList.add('on'); setPaused(m !== 'pause'); draw(); }
  function hide() { wrap.classList.remove('on'); render(null, wrap); }
  function close() { hide(); setPaused(false); onPlay(); }
  const btn = document.getElementById('menuBtn');
  if (btn) { btn.setAttribute('aria-label', 'Menu'); btn.addEventListener('click', () => open('pause')); swallow(btn); }
  return { open, close, get isOpen() { return wrap.classList.contains('on'); } };
}
