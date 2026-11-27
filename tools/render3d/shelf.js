// @ts-check
// shelf.js — the levels set aside (world.js load), and the swaps that file them: one swap at a time, each level left
// filed under its own key. Pure (no three.js, no Luminati), so test/shelf.test.mjs runs it under node.
//
// Why it's its own module: world.js's load ran each swap as it was asked for, and two could overlap (a restore while a
// level was still building: tools/capture/rig.mjs's run of shots, 2026-11-27). Each filed the level it left under
// `curKey` as it stood when its own swap came back, and set `curKey` to its own level after, so the later swap that
// came back first filed the level it left under the key of the one before, and the earlier one then filed *its* level
// left under the later one's key. Wickham Keep's key came to hold the High Ramparts' kept world, and the next trip to
// the Keep re-attached the Ramparts' houses under the Keep's HUD. Luminati's own swapLevel isn't safe to overlap
// either (each detaches whatever world is current: the other's half-built one). So here a swap waits for the one before
// it to end; a swap that a later one has overtaken while it waited never runs (its level was never shown); the level
// left is filed under the key it was swapped in with (`current`, set only when its swap has ended); and a key already on
// the shelf (the same level built twice) lets the older entry go rather than dropping it on the floor unreleased.

/**
 * @template T
 * @param {{ max: number, release: (entry: T) => void }} o max: entries kept at most (the oldest let go first);
 *   release: an entry let go for good
 */
export function createShelf({ max, release }) {
  /** @type {Map<string, T>} */
  const aside = new Map();
  let current = '', asked = 0, pending = 0;
  /** @type {Promise<void>} */
  let tail = Promise.resolve();
  /** @param {string} key @param {T} entry */
  const file = (key, entry) => {
    const old = aside.get(key);
    if (old !== undefined) { aside.delete(key); if (old !== entry) release(old); }
    aside.set(key, entry);
    while (aside.size > max) {
      const [k, v] = /** @type {[string, T]} */ (aside.entries().next().value);
      aside.delete(k); release(v);
    }
  };
  return {
    /** the key of the level in play ('' before the first, or after a swap that failed) */
    get current() { return current; },
    /** a swap running or waiting */
    get busy() { return pending > 0; },
    get size() { return aside.size; },
    /** @param {string} key */
    has: (key) => aside.has(key),
    /** (for checks) the keys on the shelf, oldest first */
    keys: () => [...aside.keys()],
    /** every entry let go (world.js lampsTo: the levels set aside held the old light pool) */
    clear() { for (const v of aside.values()) release(v); aside.clear(); },
    /**
     * Swap to the level `key`, after any swap asked for before has ended.
     * @param {string} key the level coming (its content's key)
     * @param {(s: { back: T | null, keep: boolean }) => Promise<T | null>} step the swap itself: given the level's own
     *   entry if it was set aside (taken off the shelf), and whether to keep the level left (not when there's none, or
     *   it's this same level); resolves to the level left's entry to file (null: not kept). If it throws, the entry
     *   handed to it is the step's to release, and no level is current.
     * @returns {Promise<{ ran: boolean, back: T | null }>} ran false: a later swap was asked for before this one's
     *   turn came, and this one never ran
     */
    async swap(key, step) {
      const n = ++asked, before = tail;
      /** @type {() => void} */
      let done = () => {};
      tail = new Promise((r) => { done = () => r(undefined); });
      pending++;
      try {
        await before;
        if (n !== asked) return { ran: false, back: null };
        const back = aside.get(key) ?? null;
        if (back !== null) aside.delete(key);
        const from = current, keep = !!from && from !== key;
        current = '';                                   // (mid-swap neither is in play; a failure leaves none)
        const left = await step({ back, keep });
        if (left) { if (keep) file(from, left); else release(left); }
        current = key;
        return { ran: true, back };
      } finally { pending--; done(); }
    },
  };
}
