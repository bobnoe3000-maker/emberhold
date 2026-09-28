// @ts-check
// replay.js — verified progression (architecture §10, development plan §2.13).
//
// The client can't be trusted: anyone can edit memory or a save file. What the server CAN
// trust is the sim itself. A play SESSION is (the world seed, the snapshot it started from,
// every command the player issued, keyed by tick, and how many ticks ran). Because the sim is
// deterministic (detmath.js, seeded streams, commands in / events out), the server re-runs
// that session in Node and gets the exact end state — levels, XP, gold, every item and its
// rolls. Only that re-simulated state is ever stored as the hero's verified save. A client
// that edited XP, spawned an item, or ran its clock fast produces a claim that doesn't match
// and is rejected; its verified hero stays where it was.
//
// Headless and pure: used by the client (recording, hashing) and the server (verifying).

import { createSim } from './core.js';

const clone = (o) => JSON.parse(JSON.stringify(o));

// canonical JSON (sorted keys) → a 64-bit FNV-1a-style hash as 16 hex chars; identical on every engine
export function canonical(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v ?? null);
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  return '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
}
export function stateHash(snapshot) {
  const s = canonical(snapshot);
  let h1 = 0x811c9dc5, h2 = 0x01000193 ^ 0x9e3779b9;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193); h2 = Math.imul(h2 ^ c, 0x5bd1e995); h2 ^= h2 >>> 15;
  }
  return ((h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0'));
}

// Start recording on a FRESH sim (straight after createSim + load, before any tick): the
// session begins from restore(start), exactly as the server's replay does.
export function startSession(sim, meta = {}) {
  const start = clone(sim.snapshot());
  sim.restore(clone(start));
  const startTick = sim.state.tick, log = [];
  const off = sim.bus.on('commands', ({ tick, cmds }) => log.push([tick, clone(cmds)]));
  return {
    seed: sim.seed, meta, start, startHash: stateHash(start), log,
    // a checkpoint (or the end): what the client uploads
    claim() { return { seed: sim.seed, meta, start, startHash: this.startHash, log: clone(log), ticks: sim.state.tick - startTick, endHash: stateHash(sim.snapshot()) }; },
    stop() { off(); return this.claim(); },
  };
}

/** A claimed session: what the client uploads and the server replays.
 * @typedef {{ seed: number, meta?: { theme?: string, scene?: string, region?: string },
 *   start: any, startHash?: string, log: Array<[number, any[]]>, ticks: number, endHash?: string }} Claim */

// Re-run a claimed session headless. Returns the authoritative end snapshot and its hash.
/** @param {Claim} claim */
export function replaySession({ seed, meta = {}, start, log, ticks }) {
  const sim = createSim(seed, meta.theme, { scene: start.scene || meta.scene || 'dungeon', region: meta.region || 'vale' });
  sim.restore(clone(start));
  let li = 0;
  for (let i = 0; i < ticks; i++) {
    const tk = sim.state.tick;
    while (li < log.length && log[li][0] === tk) { for (const c of log[li][1]) sim.commands.push(clone(c)); li++; }
    sim.tick();
  }
  const snapshot = sim.snapshot();
  return { snapshot, hash: stateHash(snapshot) };
}

// The server's check. `verified`: the hash of the last state the server itself stored for this
// hero (the session must start there). `elapsedMs`: wall-clock time between the server issuing
// the session token and receiving this claim (a session can't hold more sim time than that).
/** @param {Claim} claim @param {{ verified?: string|null, elapsedMs?: number, slack?: number }} [opts] */
export function verifySession(claim, { verified = null, elapsedMs = Infinity, slack = 1.05 } = {}) {
  if (verified !== null && stateHash(claim.start) !== verified) return { ok: false, reason: 'start state is not the hero\'s verified state' };
  if (claim.ticks < 0 || claim.log.some(([t], i) => t < claim.start.tick || t >= claim.start.tick + claim.ticks || (i && t < claim.log[i - 1][0]))) return { ok: false, reason: 'command log out of range or out of order' };
  if (claim.ticks * 50 > elapsedMs * slack) return { ok: false, reason: 'more game time than real time (sped-up client)' };
  const r = replaySession(claim);
  if (r.hash !== claim.endHash) return { ok: false, reason: 'end state does not match the replay', hash: r.hash };
  return { ok: true, hash: r.hash, snapshot: r.snapshot };
}
