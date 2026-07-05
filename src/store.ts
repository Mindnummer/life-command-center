import { create } from 'zustand';
import type { BackupFile, Pillar, ThoughtNode, ViewMode } from './types';
import { buildSeedNodes } from './seedData';
import { loadNodes, saveNodes } from './db';

interface AppState {
  nodes: Record<string, ThoughtNode>;
  loaded: boolean;
  selectedId: string | null;
  view: ViewMode;
  search: string;
  saveState: 'idle' | 'saving' | 'saved' | 'error';

  init: () => Promise<void>;
  select: (id: string | null) => void;
  setView: (v: ViewMode) => void;
  setSearch: (s: string) => void;
  addNode: (partial?: Partial<ThoughtNode>) => string;
  updateNode: (id: string, patch: Partial<ThoughtNode>) => void;
  moveNode: (id: string, x: number, y: number) => void;
  deleteNode: (id: string) => void;
  connectNodes: (a: string, b: string) => void;
  disconnectNodes: (a: string, b: string) => void;
  importNodes: (nodes: ThoughtNode[]) => void;
  resetToSeed: () => void;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function persist(get: () => AppState, set: (p: Partial<AppState>) => void) {
  if (saveTimer) clearTimeout(saveTimer);
  set({ saveState: 'saving' });
  saveTimer = setTimeout(async () => {
    const ok = await saveNodes(Object.values(get().nodes));
    set({ saveState: ok ? 'saved' : 'error' });
  }, 400);
}

function touch(node: ThoughtNode): ThoughtNode {
  return { ...node, updatedAt: new Date().toISOString() };
}

export const useStore = create<AppState>((set, get) => ({
  nodes: {},
  loaded: false,
  selectedId: null,
  view: 'pillars',
  search: '',
  saveState: 'idle',

  init: async () => {
    const stored = await loadNodes();
    const list = stored && stored.length > 0 ? stored : buildSeedNodes();
    const nodes: Record<string, ThoughtNode> = {};
    for (const n of list) nodes[n.id] = n;
    set({ nodes, loaded: true, saveState: 'saved' });
    if (!stored || stored.length === 0) {
      await saveNodes(list); // first run: persist the seed immediately
    }
  },

  select: (id) => set({ selectedId: id }),
  setView: (view) => set({ view, selectedId: null }),
  setSearch: (search) => set({ search }),

  addNode: (partial = {}) => {
    const id = `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const ts = new Date().toISOString();
    const node: ThoughtNode = {
      id,
      title: 'New thought',
      description: '',
      pillar: 'projects' as Pillar,
      tags: [],
      status: 'idea',
      priority: 0,
      timeHorizon: 'later',
      people: [],
      parentId: null,
      connectedNodeIds: [],
      x: 0,
      y: 0,
      nextAction: '',
      publicNotes: '',
      locked: false,
      encryptedPayload: null,
      createdAt: ts,
      updatedAt: ts,
      ...partial,
    };
    set((s) => ({ nodes: { ...s.nodes, [id]: node }, selectedId: id }));
    persist(get, set);
    return id;
  },

  updateNode: (id, patch) => {
    set((s) => {
      const cur = s.nodes[id];
      if (!cur) return s;
      return { nodes: { ...s.nodes, [id]: touch({ ...cur, ...patch }) } };
    });
    persist(get, set);
  },

  moveNode: (id, x, y) => {
    set((s) => {
      const cur = s.nodes[id];
      if (!cur) return s;
      return { nodes: { ...s.nodes, [id]: { ...cur, x, y } } };
    });
    persist(get, set);
  },

  deleteNode: (id) => {
    set((s) => {
      const target = s.nodes[id];
      if (!target || target.isHub) return s; // the hub cannot be deleted
      const nodes: Record<string, ThoughtNode> = {};
      for (const n of Object.values(s.nodes)) {
        if (n.id === id) continue;
        let next = n;
        if (n.parentId === id) next = { ...next, parentId: target.parentId }; // re-parent orphans
        if (n.connectedNodeIds.includes(id)) {
          next = { ...next, connectedNodeIds: n.connectedNodeIds.filter((c) => c !== id) };
        }
        nodes[n.id] = next;
      }
      return { nodes, selectedId: s.selectedId === id ? null : s.selectedId };
    });
    persist(get, set);
  },

  connectNodes: (a, b) => {
    if (a === b) return;
    set((s) => {
      const na = s.nodes[a];
      const nb = s.nodes[b];
      if (!na || !nb) return s;
      // Skip if already linked (hierarchy or cross-link, either direction)
      const linked =
        na.parentId === b ||
        nb.parentId === a ||
        na.connectedNodeIds.includes(b) ||
        nb.connectedNodeIds.includes(a);
      if (linked) return s;
      return {
        nodes: {
          ...s.nodes,
          [a]: touch({ ...na, connectedNodeIds: [...na.connectedNodeIds, b] }),
        },
      };
    });
    persist(get, set);
  },

  disconnectNodes: (a, b) => {
    set((s) => {
      const na = s.nodes[a];
      if (!na) return s;
      return {
        nodes: {
          ...s.nodes,
          [a]: touch({ ...na, connectedNodeIds: na.connectedNodeIds.filter((c) => c !== b) }),
        },
      };
    });
    persist(get, set);
  },

  importNodes: (list) => {
    const nodes: Record<string, ThoughtNode> = {};
    for (const n of list) nodes[n.id] = n;
    set({ nodes, selectedId: null });
    persist(get, set);
  },

  resetToSeed: () => {
    const nodes: Record<string, ThoughtNode> = {};
    for (const n of buildSeedNodes()) nodes[n.id] = n;
    set({ nodes, selectedId: null });
    persist(get, set);
  },
}));

/* ------------------------------ export/import ----------------------------- */

export function exportBackup(nodes: ThoughtNode[]) {
  const backup: BackupFile = {
    app: 'life-command-center',
    version: 1,
    exportedAt: new Date().toISOString(),
    nodes,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `lcc-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseBackup(text: string): ThoughtNode[] {
  const data = JSON.parse(text) as Partial<BackupFile>;
  if (data.app !== 'life-command-center' || !Array.isArray(data.nodes)) {
    throw new Error('Not a Life Command Center backup file.');
  }
  for (const n of data.nodes) {
    if (typeof n.id !== 'string' || typeof n.title !== 'string') {
      throw new Error('Backup file contains invalid nodes.');
    }
  }
  return data.nodes as ThoughtNode[];
}
