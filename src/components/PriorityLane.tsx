import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { PILLARS, PRIORITY_LANE_KEY } from '../constants';

/**
 * The Priority Lane: the top five things that matter right now.
 * Ranked by status (Priority Now first), then stars, then recency.
 */
export default function PriorityLane() {
  const nodes = useStore((s) => s.nodes);
  const select = useStore((s) => s.select);
  const [open, setOpen] = useState(() => localStorage.getItem(PRIORITY_LANE_KEY) !== '0');

  const top = useMemo(
    () =>
      Object.values(nodes)
        .filter((n) => !n.isHub && n.parentId !== 'hub' && n.status !== 'archived')
        .filter((n) => n.status === 'priority' || n.priority > 0)
        .sort(
          (a, b) =>
            Number(b.status === 'priority') - Number(a.status === 'priority') ||
            b.priority - a.priority ||
            b.updatedAt.localeCompare(a.updatedAt),
        )
        .slice(0, 5),
    [nodes],
  );

  const toggle = () => {
    setOpen((o) => {
      localStorage.setItem(PRIORITY_LANE_KEY, o ? '0' : '1');
      return !o;
    });
  };

  return (
    <div className={`priority-lane${open ? '' : ' closed'}`}>
      <button className="lane-toggle" onClick={toggle} aria-expanded={open}>
        ★ Priority Lane {open ? '▾' : '▴'}
      </button>
      {open && (
        <ol className="lane-items">
          {top.length === 0 && (
            <li className="lane-empty">
              Nothing prioritized yet. Set a node's status to ★ Priority Now or give it stars.
            </li>
          )}
          {top.map((n, i) => (
            <li key={n.id}>
              <button
                className="lane-item"
                style={{ ['--pillar' as string]: PILLARS[n.pillar].color }}
                onClick={() => select(n.id)}
              >
                <span className="lane-rank">{i + 1}</span>
                <span className="lane-title">{n.title}</span>
                {n.nextAction && <span className="lane-next">→ {n.nextAction}</span>}
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
