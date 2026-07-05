import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { ThoughtNode } from '../types';
import { PILLARS, STATUSES } from '../constants';

export type ThoughtFlowNode = Node<{ thought: ThoughtNode }, 'thought'>;

function Stars({ n }: { n: number }) {
  if (n <= 0) return null;
  return <span className="node-stars">{'★'.repeat(n)}</span>;
}

/**
 * One card on the map. Three visual weights:
 *  - hub: the center emblem with the creed
 *  - branch: a pillar heading (direct child of the hub)
 *  - thought: a normal card
 */
function ThoughtNodeCard({ data, selected }: NodeProps<ThoughtFlowNode>) {
  const t = data.thought;
  const pillar = PILLARS[t.pillar];
  const status = STATUSES[t.status];
  const isBranch = t.parentId === 'hub';

  const cls = t.isHub ? 'node-card node-hub' : isBranch ? 'node-card node-branch' : 'node-card';

  return (
    <div
      className={`${cls}${selected ? ' node-selected' : ''}`}
      style={{ ['--pillar' as string]: pillar.color, ['--pillar-soft' as string]: pillar.soft }}
    >
      <Handle type="target" position={Position.Left} className="node-handle" />

      {t.isHub ? (
        <>
          <div className="hub-icon">✦</div>
          <div className="hub-title">{t.title}</div>
          <div className="hub-creed">{t.description}</div>
        </>
      ) : (
        <>
          <div className="node-top">
            <span className="node-pillar-icon" title={pillar.label}>
              {pillar.icon}
            </span>
            <span
              className={`node-badge badge-${t.status}`}
              title={`${status.label} — ${status.hint}`}
            >
              {status.badge}
            </span>
            <Stars n={t.priority} />
            {t.locked && <span title="Locked thought (Phase 2)">🔒</span>}
          </div>
          <div className="node-title">{t.title}</div>
          {!isBranch && t.nextAction && (
            <div className="node-next" title="Next tiny action">
              → {t.nextAction}
            </div>
          )}
          {isBranch && t.description && <div className="node-branch-sub">{t.description}</div>}
        </>
      )}

      <Handle type="source" position={Position.Right} className="node-handle" />
    </div>
  );
}

export default memo(ThoughtNodeCard);
