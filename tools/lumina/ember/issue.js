// issue.js — the Quartermaster still issues (docs/lumina-prototype.md §8; world doc §3.1, v1.32–33): in the Old Barrows'
// Muster Hall the Third Legion's quartermaster keeps the stores, "and he still issues: every little while the most broken
// of his ranks stands up whole, re-armed from his racks"; put him down, and the ones you put down stay down. Emberfall's
// own rule (src/sim/battle.js BOSSES.quartermaster, mech 'issue', ISSUE_S), here on Luminati's combat:
//   · a level's enemy object `emberIssues: true` is the issuer (its foes); `emberIssued: true` groups are his ranks;
//   · while an issuer stands and a fight is on, every ISSUE_S seconds of combat time the most broken of the ranks stands
//     up whole: a fallen one first (back at its post, as Luminati's own rest brings a foe back: Enemy.reset, and into
//     the fight: the `wake` hook), else the most hurt one living, made whole where it stands;
//   · an issuer down: nothing more is issued. Luminati's own respawn stays as it is: a fall wakes the party at the last
//     waystone touched, and a rest there brings every foe back.
// Read from `window.__game.combat` (its CombatSystem, `system`) a few times a second; nothing on a level without issuers.
const ISSUE_S = 10;                                           // (src/sim/battle.js ISSUE_S)
let lastLevel = null, issuers = [], ranks = [], next = 0, issued = 0;

function setup(C) {
  const level = window.__game?.world?.level ?? window.__game?.level, groups = (level?.objects ?? []).filter((o) => o?.type === 'enemy');
  const ids = (pred) => new Set(groups.filter(pred).map((o) => o.id));
  const by = ids((o) => o.emberIssues === true), of = ids((o) => o.emberIssued === true);
  const group = (e) => e.uid.slice(0, e.uid.lastIndexOf('#'));
  issuers = C.system.enemies.filter((e) => by.has(group(e)));
  ranks = C.system.enemies.filter((e) => of.has(group(e)));
  next = 0; issued = 0;
}

/** one look: issue one if it's time (exported for checks on the manual clock) */
export function tick() {
  const G = /** @type {any} */ (window).__game, C = G?.combat;
  if (!C?.system) { lastLevel = null; return; }
  const lv = G.world?.level ?? G.level;
  if (lastLevel !== lv) { lastLevel = lv; setup(C); }
  if (!issuers.length) return;
  const sys = C.system, st = C.state(), now = st.time;
  if (!issuers.some((e) => e.alive) || !st.engaged) { next = now + ISSUE_S; return; }
  if (now < next) return;
  next = now + ISSUE_S;
  const fallen = ranks.find((e) => !e.alive);
  // (Luminati's reset puts a foe back asleep at its post: one stood up mid-fight comes back into it)
  if (fallen) { fallen.reset(sys.ctx); C.wake(fallen.uid); issued++; return; }
  let worst = null;
  for (const e of ranks) if (e.alive && e.hp < e.hpMax && (!worst || e.hp / e.hpMax < worst.hp / worst.hpMax)) worst = e;
  if (worst) { worst.hp = worst.hpMax; issued++; }
}

setInterval(tick, 250);
/** (for checks) */
Object.assign(globalThis, { __emberIssue: { tick, isIssuer: (uid) => issuers.some((e) => e.uid === uid), get issued() { return issued; }, get issuers() { return issuers.length; }, get ranks() { return ranks.length; } } });
