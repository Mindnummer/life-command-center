/**
 * Core data model.
 *
 * Phase 1 uses: id, title, description, pillar, tags, status, priority,
 * people, parentId, connectedNodeIds, x, y, nextAction, timestamps.
 *
 * Phase 2 fields are ALREADY RESERVED here (locked, encryptedPayload,
 * diagnostics) so the Watchdog panel and Locked Thought Bubbles can be
 * added without a schema migration. Phase 1 always writes
 * locked: false and leaves the others null/undefined.
 */

export type Pillar =
  | 'faith'
  | 'family'
  | 'fitness'
  | 'finance'
  | 'work'
  | 'projects'
  | 'research'
  | 'archive';

export type Status =
  | 'priority' // ★ Priority Now
  | 'active' // ✓ Active
  | 'review' // ! Needs Review
  | 'someday' // ○ Someday
  | 'waiting' // ⧗ Waiting
  | 'idea' // ⊕ New Idea
  | 'archived' // 🗄 Archived
  | 'locked'; // 🔒 Locked (Phase 2)

export type TimeHorizon = 'now' | 'soon' | 'later' | 'longterm' | 'someday';

/** 0 = none, 1–3 = star count. 3 stars = top of the Priority Lane. */
export type PriorityLevel = 0 | 1 | 2 | 3;

/* ---------- Phase 2 reserved structures (not used by Phase 1 UI) ---------- */

export interface Diagnostics {
  truthLabel?: string;
  sourceConfidence?: string;
  familyImpact?: string;
  christinaLoadImpact?: string;
  cashFlowImpact?: string;
  energyImpact?: string;
  riskLevel?: string;
  mvpClarity?: string;
  legacyValue?: string;
  privacySensitivity?: string;
  watchdogStatus?: 'green' | 'yellow' | 'red' | 'lock';
  watchdogRecommendations?: string[];
}

/** AES-GCM ciphertext container for Locked Thought Bubbles (Phase 2). */
export interface EncryptedPayload {
  ciphertext: string; // base64
  salt: string; // base64, unique per node
  iv: string; // base64, unique per node
  kdf: 'PBKDF2';
  iterations: number;
  algo: 'AES-GCM';
}

/* ---------------------------- The thought node ---------------------------- */

export interface ThoughtNode {
  id: string;
  title: string;
  description: string;
  pillar: Pillar;
  category?: string;
  tags: string[];
  status: Status;
  priority: PriorityLevel;
  timeHorizon: TimeHorizon;
  people: string[];
  parentId: string | null;
  connectedNodeIds: string[]; // non-hierarchy cross links
  x: number;
  y: number;
  nextAction: string;
  publicNotes: string;
  /** Phase 2: when true, description/notes live only in encryptedPayload. */
  locked: boolean;
  encryptedPayload: EncryptedPayload | null;
  diagnostics?: Diagnostics;
  isHub?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode =
  | 'pillars'
  | 'priorityNow'
  | 'backlog'
  | 'family'
  | 'cashEngine'
  | 'watchdog'; // placeholder until Phase 2

export interface BackupFile {
  app: 'life-command-center';
  version: 1;
  exportedAt: string;
  nodes: ThoughtNode[];
}
