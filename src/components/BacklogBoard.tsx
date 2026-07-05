import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { PILLARS, STATUSES } from '../constants';
import type { Status, ThoughtNode } from '../types';

const COLUMNS: { key: string; label: string; statuses: Status[] }[] = [
  { key: 'priority', label: '★ Priority Now', statuses: ['priority'] },
  { key: 'active', label: '✓ Active', statuses: ['active'] },
  { key: 'review', label: '! Needs Review', statuses: ['review'] },
  { key: 'waiting', label: '⧗ Waiting', statuses: ['waiting'] },
  { key: 'someday', label: '○ Someday / ⊕ Ideas', statuses: ['someday', 'idea'] },
  { key: 'archived', label: '▤ Archived', statuses: ['archived'] },
];

export default function BacklogBoard() {
  const nodes = useStore((s) => s.nodes);
  const search = useStore((s) => s.search);
  const select = useStore((s) => s.select);
  const updateNode = useStore((s) => s.updateNode);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const q = search.trim().toLowerCase();
  const list = useMemo(
    () =>
      Object.values(nodes)
        .filter((n) => !n.isHub && n.parentId !== 'hub')
        .filter((n) => !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q))
        .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title)),
    [nodes, q],
  );

  const byColumn = (statuses: Status[]) => list.filter((n) => statuses.includes(n.status));

  const onDrop = (colKey: string, statuses: Status[]) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData('text/lcc-node');
    if (id && nodes[id]) updateNode(id, { status: statuses[0] });
    void colKey;
  };

  return (
    <div className="board">
      {COLUMNS.map((col) => {
        const items = byColumn(col.statuses);
        return (
          <section
            key={col.key}
            className={`board-col${dragOver === col.key ? ' drag-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(col.key);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={onDrop(col.key, col.statuses)}
          >
            <h2>
              {col.label} <span className="board-count">{items.length}</span>
            </h2>
            <div className="board-cards">
              {items.length === 0 && <p className="board-empty">Nothing here. Drag a card in to move it.</p>}
              {items.map((n: ThoughtNode) => (
                <button
                  key={n.id}
                  className="board-card"
                  style={{ ['--pillar' as string]: PILLARS[n.pillar].color }}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/lcc-node', n.id)}
                  onClick={() => select(n.id)}
                  title={STATUSES[n.status].hint}
                >
                  <span className="board-card-top">
                    <span>{PILLARS[n.pillar].icon} {PILLARS[n.pillar].label}</span>
                    {n.priority > 0 && <span className="node-stars">{'★'.repeat(n.priority)}</span>}
                  </span>
                  <span className="board-card-title">{n.title}</span>
                  {n.nextAction && <span className="board-card-next">→ {n.nextAction}</span>}
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
