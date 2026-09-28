// @ts-check
// idb.js — a tiny promise wrapper over one IndexedDB object store (the idb-keyval pattern,
// in-house: architecture A6). Falls back to localStorage when IndexedDB is unavailable
// (some private-browsing modes), so saving never silently stops working.

const DB = 'emberfall', STORE = 'kv';
let dbp = null;

/** @returns {Promise<IDBDatabase|null>} */
function open() {
  if (dbp) return dbp;
  dbp = new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => { const db = req.result; db.onversionchange = () => { db.close(); dbp = null; }; resolve(db); };   // another tab upgrading / deleting: step aside
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch (e) { resolve(null); }
  });
  return dbp;
}

/** @param {'readonly'|'readwrite'} mode @param {(s: IDBObjectStore) => IDBRequest} fn */
async function run(mode, fn) {
  const db = await open();
  if (!db) return undefined;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode), req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = tx.onabort = () => reject(tx.error);
  });
}

const LS = 'emberfall.kv.';
/** @param {string} key @returns {Promise<any>} */
export async function get(key) {
  const db = await open();
  if (!db) { try { const v = localStorage.getItem(LS + key); return v ? JSON.parse(v) : undefined; } catch (e) { return undefined; } }
  return run('readonly', (s) => s.get(key));
}
/** @param {string} key @param {any} value */
export async function set(key, value) {
  const db = await open();
  if (!db) { try { localStorage.setItem(LS + key, JSON.stringify(value)); } catch (e) { return false; } return true; }
  await run('readwrite', (s) => s.put(value, key));
  return true;
}
/** @param {string} key */
export async function del(key) {
  const db = await open();
  if (!db) { try { localStorage.removeItem(LS + key); } catch (e) { /* nothing */ } return; }
  await run('readwrite', (s) => s.delete(key));
}
