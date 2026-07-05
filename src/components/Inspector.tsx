import { useState } from 'react';
import { useStore } from '../store';
import { PILLARS, STATUSES, TIME_HORIZONS } from '../constants';
import type { Pillar, PriorityLevel, Status, TimeHorizon } from '../types';

function csv(list: string[]): string {
  return list.join(', ');
}
function fromCsv(s: string): string[] {
  return s
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function Inspector() {
  const selectedId = useStore((s) => s.selectedId);
  const node = useStore((s) => (s.selectedId ? s.nodes[s.selectedId] : null));
  const allNodes = useStore((s) => s.nodes);
  const updateNode = useStore((s) => s.updateNode);
  const deleteNode = useStore((s) => s.deleteNode);
  const disconnectNodes = useStore((s) => s.disconnectNodes);
  const select = useStore((s) => s.select);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!node || !selectedId) return null;

  const set = (patch: Parameters<typeof updateNode>[1]) => updateNode(selectedId, patch);
  const pillar = PILLARS[node.pillar];

  return (
    <aside className="inspector" style={{ ['--pillar' as string]: pillar.color }}>
      <div className="inspector-head">
        <span className="inspector-pillar">{pillar.icon} {pillar.label}</span>
        <button className="btn-ghost" onClick={() => select(null)} aria-label="Close inspector">
          ✕
        </button>
      </div>

      <label className="field">
        <span>Title</span>
        <input value={node.title} onChange={(e) => set({ title: e.target.value })} />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          rows={4}
          value={node.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="What is this thought, plainly?"
        />
      </label>

      <label className="field">
        <span>Next tiny action</span>
        <input
          value={node.nextAction}
          onChange={(e) => set({ nextAction: e.target.value })}
          placeholder="The smallest next step"
        />
      </label>

      {!node.isHub && (
        <div className="field-row">
          <label className="field">
            <span>Pillar</span>
            <select value={node.pillar} onChange={(e) => set({ pillar: e.target.value as Pillar })}>
              {Object.entries(PILLARS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select value={node.status} onChange={(e) => set({ status: e.target.value as Status })}>
              {Object.entries(STATUSES)
                .filter(([k]) => k !== 'locked')
                .map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.badge} {v.label}
                  </option>
                ))}
            </select>
          </label>
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <span>Priority</span>
          <div className="star-picker" role="radiogroup" aria-label="Priority">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                className={`star-btn${node.priority === n ? ' on' : ''}`}
                onClick={() => set({ priority: n as PriorityLevel })}
                title={n === 0 ? 'No priority' : `${n} star${n > 1 ? 's' : ''}`}
              >
                {n === 0 ? '—' : '★'.repeat(n)}
              </button>
            ))}
          </div>
        </div>
        <label className="field">
          <span>Time horizon</span>
          <select
            value={node.timeHorizon}
            onChange={(e) => set({ timeHorizon: e.target.value as TimeHorizon })}
          >
            {Object.entries(TIME_HORIZONS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Tags (comma-separated)</span>
        <input
          defaultValue={csv(node.tags)}
          key={`tags-${node.id}`}
          onBlur={(e) => set({ tags: fromCsv(e.target.value) })}
          placeholder="cash-engine, ministry"
        />
      </label>

      <label className="field">
        <span>People (comma-separated)</span>
        <input
          defaultValue={csv(node.people)}
          key={`people-${node.id}`}
          onBlur={(e) => set({ people: fromCsv(e.target.value) })}
          placeholder="Christina, Andrew"
        />
      </label>

      <label className="field">
        <span>Notes</span>
        <textarea
          rows={3}
          value={node.publicNotes}
          onChange={(e) => set({ publicNotes: e.target.value })}
        />
      </label>

      {node.connectedNodeIds.length > 0 && (
        <div className="field">
          <span>Cross-links</span>
          <ul className="link-list">
            {node.connectedNodeIds.map((id) => (
              <li key={id}>
                <button className="link-jump" onClick={() => select(id)}>
                  {allNodes[id]?.title ?? '(missing)'}
                </button>
                <button
                  className="btn-ghost"
                  title="Remove link"
                  onClick={() => disconnectNodes(selectedId, id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="inspector-meta">
        Created {new Date(node.createdAt).toLocaleDateString()} · Updated{' '}
        {new Date(node.updatedAt).toLocaleDateString()}
      </div>

      {!node.isHub && (
        <div className="inspector-actions">
          <button className="btn" disabled title="Locked Thought Bubbles arrive in Phase 2">
            🔒 Lock (Phase 2)
          </button>
          <button className="btn" onClick={() => set({ status: 'archived' })}>
            ▤ Archive
          </button>
          {confirmDelete ? (
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteNode(selectedId);
                setConfirmDelete(false);
              }}
            >
              Confirm delete
            </button>
          ) : (
            <button className="btn btn-danger-soft" onClick={() => setConfirmDelete(true)}>
              Delete…
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
