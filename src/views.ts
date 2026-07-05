import type { ThoughtNode, ViewMode } from './types';
import { FAMILY_NAMES } from './constants';

/**
 * A view is a lens: same nodes, different filter. Each view returns the set
 * of node ids that should be visible on the map. Ancestors of a matching
 * node stay visible so the map keeps its shape and context.
 *
 * Phase 2 will add more lenses here (Risk & Watchdog, Time Horizon, etc.)
 * without touching the canvas code — that's why this lives in its own module.
 */

function matchesSearch(n: ThoughtNode, q: string): boolean {
  const hay = [n.title, n.description, n.nextAction, n.publicNotes, ...n.tags, ...n.people]
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

function viewPredicate(view: ViewMode): (n: ThoughtNode) => boolean {
  switch (view) {
    case 'pillars':
      return (n) => n.status !== 'archived';
    case 'priorityNow':
      return (n) => n.status === 'priority' || (n.status === 'active' && n.priority >= 2);
    case 'backlog':
      // Backlog renders as a board, not the map; predicate kept for completeness.
      return (n) => !n.isHub;
    case 'family':
      return (n) =>
        n.status !== 'archived' &&
        (n.pillar === 'family' || n.people.some((p) => FAMILY_NAMES.includes(p)));
    case 'cashEngine':
      return (n) =>
        n.status !== 'archived' &&
        (n.pillar === 'finance' || n.pillar === 'work' || n.tags.includes('cash-engine'));
    case 'watchdog':
      // Phase 2 placeholder: surface anything flagged for review.
      return (n) => n.status === 'review';
  }
}

export function visibleNodeIds(
  nodes: Record<string, ThoughtNode>,
  view: ViewMode,
  search: string,
): Set<string> {
  const q = search.trim().toLowerCase();
  const pred = viewPredicate(view);
  const visible = new Set<string>();

  for (const n of Object.values(nodes)) {
    if (!pred(n)) continue;
    if (q && !matchesSearch(n, q)) continue;
    visible.add(n.id);
    // keep ancestors so the branch structure stays readable
    let p = n.parentId;
    let guard = 0;
    while (p && !visible.has(p) && guard++ < 50) {
      visible.add(p);
      p = nodes[p]?.parentId ?? null;
    }
  }
  return visible;
}
