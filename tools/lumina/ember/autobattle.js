// autobattle.js — the hero fights by itself in Luminati's combat levels (docs/lumina-prototype.md §3.3): the encounter at
// the Scrag Warren, Cinderwatch Pass. The party's companions already fight by Luminati's party AI; this drives the
// player the same way, through Luminati's own combat hooks (`window.__game.combat`, its COMBAT.md §20.1: `move`, `aim`,
// `press`, `enemies`, `path`, `state`), so it takes the same paths, cooldowns and guards a thumb would.
//   · the target: the nearest foe awake (one already fighting first, and one that raises the others — the Old Barrows'
//     Quartermaster, issue.js — sooner than his ranks), kept while it lives unless another is much nearer
//   · out of reach: walk to it, along the enemies' walk grid when the straight line is blocked (a wall, a cliff)
//   · in reach: face it and swing; a skill in turn every few seconds (a skill on cooldown does nothing)
//   · a Healing Draught under 40 % HP; a dodge away when a burst of damage lands
//   · fallen: rise at the waystone (a key to the death screen, as a tap would), and fight on
//   · none awake: the ones asleep at their posts, nearest first (a dungeon's rooms are cleared); nothing left: stand
// On while the Auto button is lit (?auto=1 lights it at the start; the choice is kept on this device). Touching the
// stick takes the hero back at once: Auto goes off.

const TICK = 100, REACH = 1.7, SKILL_EVERY = 2600, DRAUGHT_AT = 0.4, BURST = 0.12;
const params = new URLSearchParams(location.search);
const KEY = 'ember.lumina.auto';
const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch { /* private mode: not kept */ } };
let on = params.get('auto') === '1' || (params.get('auto') !== '0' && read() === '1');
let downAt = 0, risenAt = 0;
let driving = false, target = null, path = null, pathAt = 0, skillAt = 0, skillNo = 0, draughtAt = 0;
const hpLog = [];                                             // [time, hp] over the last half second

const css = `
#ember-auto { position: fixed; right: calc(14px + env(safe-area-inset-right, 0px)); bottom: calc(env(safe-area-inset-bottom, 0px) + 172px); z-index: 41;
  min-width: 64px; height: 48px; padding: 0 12px; border-radius: 24px; border: 2px solid rgba(232,207,138,.6); background: rgba(12,16,34,.82); color: #e8cf8a;
  font: 600 13px Georgia, serif; display: none; touch-action: none; }
#ember-auto[aria-pressed="true"] { background: rgba(184,134,46,.9); color: #160f08; border-color: #e8cf8a; }`;
let btn = null;
function mount() {
  const style = document.createElement('style'); style.textContent = css; document.head.append(style);
  btn = document.createElement('button'); btn.id = 'ember-auto'; btn.type = 'button';
  document.body.append(btn); paint();
  for (const ev of ['pointerdown', 'touchstart', 'mousedown']) btn.addEventListener(ev, (e) => e.stopPropagation());
  btn.addEventListener('click', () => { set(!on); });
}
function paint() { if (!btn) return; btn.textContent = on ? 'Auto ✓' : 'Auto'; btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.setAttribute('aria-label', on ? 'Autobattle on' : 'Autobattle off'); }
function set(v) { on = v; write(v); paint(); if (!v) release(); }
function release() {
  const C = /** @type {any} */ (window).__game?.combat;
  if (driving && C) { C.move(null); C.aim(null); }
  driving = false; target = null; path = null;
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
function tick() {
  const G = /** @type {any} */ (window).__game, C = G?.combat;
  if (btn) btn.style.display = C ? 'block' : 'none';
  if (!C || !on) return;
  // a finger on the stick (touch.js) takes the hero back
  if (/** @type {any} */ (globalThis).__emberStick?.on) { set(false); return; }
  const sys = C.system, P = sys?.player?.position;
  // fallen: rise at the waystone (Luminati's death screen takes any key once armed, 1 s), as a player would tap
  if (C.state().player.hp <= 0) {
    const t = performance.now();
    if (!downAt) downAt = t;
    else if (t - downAt > 2500 && t - risenAt > 1000) { risenAt = t; window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter' })); }
    return;
  }
  downAt = 0;
  if (!P || sys.game?.busy) return;                            // a dialogue, a cutscene, the death screen
  const st = C.state(), me = st.player, now = st.time * 1000;   // (the combat's own clock: the same when stepped)
  if (me.hp <= 0) return;
  driving = true;
  // health: a draught when low; a dodge when a burst lands
  hpLog.push([now, me.hp]); while (hpLog.length && now - hpLog[0][0] > 500) hpLog.shift();
  if (me.hp < me.hpMax * DRAUGHT_AT && me.potions > 0 && now - draughtAt > 3000) { C.press('draught', 2); draughtAt = now; }
  const burst = hpLog.length > 1 && hpLog[0][1] - me.hp > me.hpMax * BURST;
  // the target
  // (the foes awake; with none, the ones asleep at their posts: a dungeon's rooms are cleared, not left)
  const standing = C.enemies().filter((e) => e.hp > 0 && e.state !== 'dead'), awake = standing.filter((e) => !e.dormant);
  const foes = awake.length ? awake : standing;
  if (target) target = foes.find((e) => e.uid === target.uid) ?? null;
  let best = null, bd = Infinity;
  // (one already fighting first; and a foe that raises the others — the Quartermaster, issue.js — before his ranks)
  const issuer = /** @type {any} */ (globalThis).__emberIssue?.isIssuer;
  for (const e of foes) { const d = dist(P, e) - (e.aggro ? 4 : 0) - (issuer?.(e.uid) ? 10 : 0); if (d < bd) { bd = d; best = e; } }
  if (!target || (best && dist(P, best) + 3 < dist(P, target))) { target = best; path = null; }
  if (!target) { C.move(0, 0); C.aim(null); return; }        // nothing left: stand
  const d = dist(P, target);
  C.aim(target.x, target.z);
  if (burst) { const k = 1 / (d || 1); C.move((P.x - target.x) * k, (P.z - target.z) * k); C.press('dodge', 2); hpLog.length = 0; return; }
  if (d > REACH) {
    // walk: straight at it, or along the walk grid's path (refreshed every 0.6 s)
    if (!path || now - pathAt > 600) { path = C.path(P.x, P.z, target.x, target.z) ?? null; pathAt = now; }
    let to = target;
    if (path && path.length > 1) { while (path.length > 1 && Math.hypot(path[0][0] - P.x, path[0][1] - P.z) < 0.6) path.shift(); to = { x: path[0][0], z: path[0][1] }; }
    const tx = to.x - P.x, tz = to.z - P.z, k = 1 / (Math.hypot(tx, tz) || 1);
    C.move(tx * k, tz * k);
    return;
  }
  C.move(0, 0);
  C.press('attack', 2);
  if (now - skillAt > SKILL_EVERY && me.cooldowns?.[skillNo] === 0) C.press(`skill${skillNo + 1}`, 2);
  if (now - skillAt > SKILL_EVERY) { skillAt = now; skillNo = (skillNo + 1) % 3; }
}

if (document.body) mount(); else addEventListener('DOMContentLoaded', mount);
setInterval(tick, TICK);
/** (for checks) */
Object.assign(globalThis, { __emberAuto: { get on() { return on; }, set, tick, get target() { return target?.uid ?? null; } } });
