import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  type Edge,
  type NodeChange,
  type Connection,
} from '@xyflow/react';
import { useStore } from '../store';
import { visibleNodeIds } from '../views';
import { PILLARS } from '../constants';
import ThoughtNodeCard, { type ThoughtFlowNode } from './ThoughtNodeCard';

const nodeTypes = { thought: ThoughtNodeCard };

function CanvasInner() {
  const nodes = useStore((s) => s.nodes);
  const view = useStore((s) => s.view);
  const search = useStore((s) => s.search);
  const selectedId = useStore((s) => s.selectedId);
  const select = useStore((s) => s.select);
  const moveNode = useStore((s) => s.moveNode);
  const connectNodes = useStore((s) => s.connectNodes);
  const addNode = useStore((s) => s.addNode);
  const { fitView, screenToFlowPosition } = useReactFlow();

  const visible = useMemo(() => visibleNodeIds(nodes, view, search), [nodes, view, search]);

  const rfNodes: ThoughtFlowNode[] = useMemo(
    () =>
      Object.values(nodes)
        .filter((n) => visible.has(n.id))
        .map((n) => ({
          id: n.id,
          type: 'thought' as const,
          position: { x: n.x, y: n.y },
          data: { thought: n },
          selected: n.id === selectedId,
          draggable: true,
        })),
    [nodes, visible, selectedId],
  );

  const rfEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    for (const n of Object.values(nodes)) {
      if (n.parentId && visible.has(n.id) && visible.has(n.parentId)) {
        edges.push({
          id: `h-${n.parentId}-${n.id}`,
          source: n.parentId,
          target: n.id,
          style: { stroke: PILLARS[n.pillar].color, strokeWidth: n.parentId === 'hub' ? 2.5 : 1.5, opacity: 0.55 },
        });
      }
      for (const c of n.connectedNodeIds) {
        if (visible.has(n.id) && visible.has(c)) {
          edges.push({
            id: `x-${n.id}-${c}`,
            source: n.id,
            target: c,
            style: { stroke: '#7fb8a8', strokeWidth: 1.5, strokeDasharray: '6 5', opacity: 0.7 },
          });
        }
      }
    }
    return edges;
  }, [nodes, visible]);

  const onNodesChange = useCallback(
    (changes: NodeChange<ThoughtFlowNode>[]) => {
      for (const ch of changes) {
        if (ch.type === 'position' && ch.position) {
          moveNode(ch.id, ch.position.x, ch.position.y);
        }
      }
    },
    [moveNode],
  );

  const onConnect = useCallback(
    (c: Connection) => {
      if (c.source && c.target) connectNodes(c.source, c.target);
    },
    [connectNodes],
  );

  // Double-click empty canvas -> new thought right there
  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('react-flow__pane')) return;
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode({ x: pos.x, y: pos.y });
    },
    [screenToFlowPosition, addNode],
  );

  // Re-frame the map when the lens changes
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15, duration: 500 }), 60);
    return () => clearTimeout(t);
  }, [view, fitView]);

  return (
    <div className="canvas-wrap" onDoubleClick={onDoubleClick}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onNodeClick={(_, n) => select(n.id)}
        onPaneClick={() => select(null)}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.08}
        maxZoom={2}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: false }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.5} color="rgba(127,184,168,0.13)" />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => PILLARS[(n as ThoughtFlowNode).data.thought.pillar].color}
          maskColor="rgba(8,14,13,0.75)"
          bgColor="rgba(13,21,20,0.9)"
        />
      </ReactFlow>
    </div>
  );
}

export default function MapCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
