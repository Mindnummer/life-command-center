import type { ThoughtNode } from './types';

/**
 * Local-first persistence. Everything lives in this browser's IndexedDB.
 * No network. No backend. No sync. The only way data leaves the device
 * is the manual JSON export.
 *
 * Storage shape: one document holding all nodes. At this scale
 * (hundreds of nodes) a whole-document write is simpler and more robust
 * than per-node records, and it makes export/import/restore trivial.
 */

const DB_NAME = 'life-command-center';
const DB_VERSION = 1;
const STORE = 'app';
const DOC_KEY = 'state';

interface StoredDoc {
  version: 1;
  savedAt: string;
  nodes: ThoughtNode[];
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadNodes(): Promise<ThoughtNode[] | null> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(DOC_KEY);
      req.onsuccess = () => {
        const doc = req.result as StoredDoc | undefined;
        resolve(doc?.nodes ?? null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('IndexedDB load failed:', err);
    return null;
  }
}

export async function saveNodes(nodes: ThoughtNode[]): Promise<boolean> {
  try {
    const db = await openDB();
    const doc: StoredDoc = { version: 1, savedAt: new Date().toISOString(), nodes };
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(doc, DOC_KEY);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('IndexedDB save failed:', err);
    return false;
  }
}
