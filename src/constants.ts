import type { Pillar, Status, TimeHorizon, ViewMode } from './types';

/** Pillar lanes. Colors follow the agreed system (Gold = Faith, etc.). */
export const PILLARS: Record<
  Pillar,
  { label: string; color: string; soft: string; icon: string }
> = {
  faith: { label: 'Faith', color: '#D9A427', soft: 'rgba(217,164,39,0.14)', icon: '✝' },
  family: { label: 'Family', color: '#3E7BD6', soft: 'rgba(62,123,214,0.14)', icon: '⌂' },
  fitness: { label: 'Fitness', color: '#3FA35C', soft: 'rgba(63,163,92,0.14)', icon: '↟' },
  finance: { label: 'Finance', color: '#E05A33', soft: 'rgba(224,90,51,0.14)', icon: '◈' },
  projects: { label: 'Cross-Pillar Projects', color: '#8B5CD6', soft: 'rgba(139,92,214,0.14)', icon: '⬡' },
  work: { label: 'Work / Service', color: '#2BA3A0', soft: 'rgba(43,163,160,0.14)', icon: '⚙' },
  research: { label: 'Research', color: '#5C6BD6', soft: 'rgba(92,107,214,0.14)', icon: '◉' },
  archive: { label: 'Archive', color: '#8A8F98', soft: 'rgba(138,143,152,0.12)', icon: '▤' },
};

export const STATUSES: Record<Status, { label: string; badge: string; hint: string }> = {
  priority: { label: 'Priority Now', badge: '★', hint: 'Top of the stack' },
  active: { label: 'Active', badge: '✓', hint: 'In motion' },
  review: { label: 'Needs Review', badge: '!', hint: 'Check before acting' },
  someday: { label: 'Someday', badge: '○', hint: 'Parked, not lost' },
  waiting: { label: 'Waiting', badge: '⧗', hint: 'Blocked on something' },
  idea: { label: 'New Idea', badge: '⊕', hint: 'Freshly captured' },
  archived: { label: 'Archived', badge: '▤', hint: 'Out of play' },
  locked: { label: 'Locked', badge: '🔒', hint: 'Encrypted (Phase 2)' },
};

export const TIME_HORIZONS: Record<TimeHorizon, string> = {
  now: 'Now',
  soon: 'Soon',
  later: 'Later',
  longterm: 'Long-Term',
  someday: 'Someday',
};

export const VIEWS: {
  id: ViewMode;
  label: string;
  tagline: string;
  placeholder?: boolean;
}[] = [
  { id: 'pillars', label: 'Four Pillars', tagline: 'The whole map, every lane' },
  { id: 'priorityNow', label: 'Priority Now', tagline: 'Only what matters today' },
  { id: 'backlog', label: 'Backlog Board', tagline: 'Active · Waiting · Someday · Archive' },
  { id: 'family', label: 'Family-Centered', tagline: 'Christina, the kids, the home' },
  { id: 'cashEngine', label: 'Cash Engine', tagline: 'Repair shop income and stability' },
  { id: 'watchdog', label: 'Risk & Watchdog', tagline: 'Coming in Phase 2', placeholder: true },
];

export const FAMILY_NAMES = ['Christina', 'Andrew', 'Abigail', 'Micah', 'Amariah'];

export const CREED =
  'Truth first • Family protected • Capacity strengthened • Finances stabilized';

export const FIRST_RUN_KEY = 'lcc:firstRunAccepted';
export const PRIORITY_LANE_KEY = 'lcc:priorityLaneOpen';
