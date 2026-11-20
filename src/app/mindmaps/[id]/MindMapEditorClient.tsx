'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  NodeTypes,
  BackgroundVariant,
  ReactFlowInstance
} from '@xyflow/react';
import CustomNode from '@/components/mindmap/CustomNode';
import MindMapToolbar from '@/components/mindmap/MindMapToolbar';
import MindMapLeftPanel from '@/components/mindmap/MindMapLeftPanel';
import MindMapRightPanel from '@/components/mindmap/MindMapRightPanel';
import ExportModal from '@/components/mindmap/ExportModal';
import ShareModal from '@/components/mindmap/ShareModal';
import { initialMindMapData } from '@/data/mockMindMaps';

interface MindMapEditorClientProps {
  id: string;
}

interface HistorySnapshot {
  nodes: Node[];
  edges: Edge[];
}

interface HistoryState {
  past: HistorySnapshot[];
  future: HistorySnapshot[];
}

const MAX_HISTORY = 30;
const MIN_PANEL_WIDTH = 200;
const MAX_PANEL_WIDTH = 420;

const clampPanelWidth = (w: number) =>
  Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, Math.round(w)));

const deepCloneValue = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => deepCloneValue(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (typeof v !== 'function') {
        out[k] = deepCloneValue(v);
      }
    }
    return out as T;
  }
  return value;
};

const cloneSnapshot = (nodes: Node[], edges: Edge[]): HistorySnapshot => ({
  nodes: nodes.map((n) => deepCloneValue(n)),
  edges: edges.map((e) => deepCloneValue(e))
});

export default function MindMapEditorClient({ id }: MindMapEditorClientProps) {
  const mapData = initialMindMapData[id] || initialMindMapData['mm-1'];

  // State
  const [title, setTitle] = useState(mapData.title);
  const [nodes, setNodes, onNodesChange] = useNodesState(mapData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mapData.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('root');

  // Undo / Redo history
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const historyRef = useRef<HistoryState>({ past: [], future: [] });
  const [historyVersion, setHistoryVersion] = useState(0);

  // Panel toggles & resizable widths
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(296);
  const [mobilePanel, setMobilePanel] = useState<'none' | 'left' | 'right'>('none');

  // Modals
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const nodesRef = useRef<Node[]>(nodes);
  const edgesRef = useRef<Edge[]>(edges);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const pushHistory = useCallback((snapshotNodes: Node[], snapshotEdges: Edge[]) => {
    const snap = cloneSnapshot(snapshotNodes, snapshotEdges);
    const nextHistory: HistoryState = {
      past: [...historyRef.current.past, snap].slice(-MAX_HISTORY),
      future: []
    };
    historyRef.current = nextHistory;
    setHistory(nextHistory);
  }, []);

  const handleLeftWidthChange = useCallback((w: number) => {
    setLeftWidth(clampPanelWidth(w));
  }, []);

  const handleRightWidthChange = useCallback((w: number) => {
    setRightWidth(clampPanelWidth(w));
  }, []);

  // Register Custom Node Type
  const nodeTypes: NodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Selected Node Object
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Connect handler
  const onConnect = useCallback(
    (params: Connection) => {
      pushHistory(nodesRef.current, edgesRef.current);
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: 'var(--gw-text-subtle)', strokeWidth: 1.5 }
          },
          eds
        )
      );
      setIsSaved(false);
    },
    [pushHistory, setEdges]
  );

  // Record history once before dragging a node
  const onNodeDragStart = useCallback(() => {
    pushHistory(nodesRef.current, edgesRef.current);
  }, [pushHistory]);

  // Node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    // Keep selection
  }, []);

  // Update Node Data from Right Panel
  const handleUpdateNode = useCallback(
    (nodeId: string, updatedData: Record<string, unknown>) => {
      pushHistory(nodesRef.current, edgesRef.current);
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updatedData
              }
            };
          }
          return node;
        })
      );
      setIsSaved(false);
    },
    [pushHistory, setNodes]
  );

  // Add new branch or subtopic
  const handleAddNode = useCallback(
    (level: 'branch' | 'subtopic') => {
      const currentNodes = nodesRef.current;
      const parent = currentNodes.find((n) => n.id === selectedNodeId) || currentNodes[0];
      if (!parent) return;

      pushHistory(currentNodes, edgesRef.current);

      const newId = `node-${Date.now()}`;
      const posX = parent.position.x + (level === 'subtopic' ? 240 : 200);
      const posY = parent.position.y + (currentNodes.length % 2 === 0 ? 80 : -80);

      const newNode: Node = {
        id: newId,
        type: 'custom',
        selected: true,
        position: { x: posX, y: posY },
        data: {
          label: level === 'branch' ? `หัวข้อใหม่ (${currentNodes.length})` : 'ข้อย่อยใหม่',
          description: 'เพิ่มคำอธิบายสั้นๆ ของหัวข้อนี้',
          level: level,
          color: level === 'branch' ? 'var(--gw-accent)' : undefined,
          fontSize: level === 'branch' ? '15px' : '13px'
        }
      };

      const newEdge: Edge = {
        id: `e-${parent.id}-${newId}`,
        source: parent.id,
        target: newId,
        style: { stroke: 'var(--gw-text-subtle)', strokeWidth: 1.5 }
      };

      setNodes((nds) => [...nds.map((n) => ({ ...n, selected: false })), newNode]);
      setEdges((eds) => [...eds, newEdge]);
      setSelectedNodeId(newId);
      setIsSaved(false);
    },
    [pushHistory, selectedNodeId, setNodes, setEdges]
  );

  // Quick Add Child directly from a node's + button
  const handleAddChildFromNode = useCallback(
    (parentId: string) => {
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;
      const parent = currentNodes.find((n) => n.id === parentId);
      if (!parent) return;

      pushHistory(currentNodes, currentEdges);

      const level: 'branch' | 'subtopic' =
        parent.data?.level === 'root' ? 'branch' : 'subtopic';
      const siblingCount = currentEdges.filter((e) => e.source === parentId).length;
      const offsetStep = Math.ceil(siblingCount / 2) * 120;
      const offsetY =
        siblingCount === 0 ? 0 : (siblingCount % 2 === 1 ? 1 : -1) * offsetStep;

      const newId = `node-${Date.now()}`;
      const newNode: Node = {
        id: newId,
        type: 'custom',
        selected: true,
        position: {
          x: parent.position.x + 300,
          y: parent.position.y + offsetY
        },
        data: {
          label: level === 'branch' ? `หัวข้อใหม่ (${currentNodes.length})` : 'ข้อย่อยใหม่',
          description: 'เพิ่มคำอธิบายสั้นๆ ของหัวข้อนี้',
          level,
          color: level === 'branch' ? 'var(--gw-accent)' : undefined,
          fontSize: level === 'branch' ? '15px' : '13px'
        }
      };

      const newEdge: Edge = {
        id: `e-${parentId}-${newId}`,
        source: parentId,
        target: newId,
        style: { stroke: 'var(--gw-text-subtle)', strokeWidth: 1.5 }
      };

      setNodes((nds) => [...nds.map((n) => ({ ...n, selected: false })), newNode]);
      setEdges((eds) => [...eds, newEdge]);
      setSelectedNodeId(newId);
      setIsSaved(false);
    },
    [pushHistory, setNodes, setEdges]
  );

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (nodeId === 'root') {
        alert('ไม่สามารถลบโหนดหลัก (Root Node) ได้');
        return;
      }
      pushHistory(nodesRef.current, edgesRef.current);
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId('root');
      setIsSaved(false);
    },
    [pushHistory, setNodes, setEdges]
  );

  // Hierarchical Tree Auto-Layout
  const handleAutoLayout = useCallback(() => {
    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;
    if (currentNodes.length === 0) return;

    pushHistory(currentNodes, currentEdges);

    const nodeIds = new Set(currentNodes.map((n) => n.id));
    const childrenMap = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    for (const n of currentNodes) {
      childrenMap.set(n.id, []);
      inDegree.set(n.id, 0);
    }

    for (const e of currentEdges) {
      if (nodeIds.has(e.source) && nodeIds.has(e.target) && e.source !== e.target) {
        const list = childrenMap.get(e.source)!;
        if (!list.includes(e.target)) {
          list.push(e.target);
          inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
        }
      }
    }

    // Determine ordered root candidates
    const roots: string[] = [];
    if (nodeIds.has('root')) {
      roots.push('root');
    }
    for (const n of currentNodes) {
      if ((inDegree.get(n.id) || 0) === 0 && !roots.includes(n.id)) {
        roots.push(n.id);
      }
    }
    if (roots.length === 0) {
      roots.push(currentNodes[0].id);
    }

    const visited = new Set<string>();
    const treeChildren = new Map<string, string[]>();

    const buildSpanningTree = (id: string) => {
      visited.add(id);
      const validChildren: string[] = [];
      for (const childId of childrenMap.get(id) || []) {
        if (!visited.has(childId)) {
          visited.add(childId);
          validChildren.push(childId);
        }
      }
      treeChildren.set(id, validChildren);
      for (const childId of validChildren) {
        buildSpanningTree(childId);
      }
    };

    const forestRoots: string[] = [];
    for (const r of roots) {
      if (!visited.has(r)) {
        forestRoots.push(r);
        buildSpanningTree(r);
      }
    }
    // Catch any disconnected cycle components
    for (const n of currentNodes) {
      if (!visited.has(n.id)) {
        forestRoots.push(n.id);
        buildSpanningTree(n.id);
      }
    }

    const COLUMN_GAP_X = 320;
    const NODE_HEIGHT = 110;
    const VERTICAL_GAP = 36;
    const SLOT_HEIGHT = NODE_HEIGHT + VERTICAL_GAP;

    const subtreeHeights = new Map<string, number>();
    const computeHeight = (id: string): number => {
      const children = treeChildren.get(id) || [];
      if (children.length === 0) {
        subtreeHeights.set(id, SLOT_HEIGHT);
        return SLOT_HEIGHT;
      }
      const sum = children.reduce((acc, cid) => acc + computeHeight(cid), 0);
      subtreeHeights.set(id, sum);
      return sum;
    };

    const totalForestHeight = forestRoots.reduce((acc, r) => acc + computeHeight(r), 0);
    const positions = new Map<string, { x: number; y: number }>();

    const assignPositions = (id: string, depth: number, startY: number) => {
      const height = subtreeHeights.get(id) || SLOT_HEIGHT;
      positions.set(id, {
        x: depth * COLUMN_GAP_X,
        y: startY + height / 2 - NODE_HEIGHT / 2
      });

      let childY = startY;
      for (const cid of treeChildren.get(id) || []) {
        const ch = subtreeHeights.get(cid) || SLOT_HEIGHT;
        assignPositions(cid, depth + 1, childY);
        childY += ch;
      }
    };

    let currentRootY = -totalForestHeight / 2;
    for (const r of forestRoots) {
      const rh = subtreeHeights.get(r) || SLOT_HEIGHT;
      assignPositions(r, 0, currentRootY);
      currentRootY += rh;
    }

    setNodes((nds) =>
      nds.map((n) => {
        const pos = positions.get(n.id);
        return pos ? { ...n, position: pos } : n;
      })
    );
    setIsSaved(false);

    requestAnimationFrame(() => {
      reactFlowInstance.current?.fitView({ padding: 0.2, duration: 500 });
    });
  }, [pushHistory, setNodes]);

  // AI Generate (Auto-organize / layout animation)
  const handleAiGenerate = useCallback(() => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;
      pushHistory(currentNodes, currentEdges);

      const newBranchId = `branch-ai-${Date.now()}`;
      const newSubId = `sub-ai-${Date.now()}`;

      const newBranch: Node = {
        id: newBranchId,
        type: 'custom',
        position: { x: 380, y: 460 },
        data: {
          label: '5. NoSQL & Big Data',
          description: 'ฐานข้อมูลรูปแบบใหม่เพื่อรองรับข้อมูลขนาดใหญ่ (MongoDB, Cassandra)',
          level: 'branch',
          color: 'var(--gw-positive)',
          fontSize: '15px'
        }
      };

      const newSub: Node = {
        id: newSubId,
        type: 'custom',
        position: { x: 680, y: 480 },
        data: {
          label: 'Document Store (JSON)',
          description: 'การจัดเก็บข้อมูลแบบ Schema-less สะดวกต่อการขยายตัว',
          level: 'subtopic',
          fontSize: '13px'
        }
      };

      const edge1: Edge = {
        id: `e-root-${newBranchId}`,
        source: 'root',
        target: newBranchId,
        animated: true,
        style: { stroke: 'var(--gw-positive)', strokeWidth: 2 }
      };

      const edge2: Edge = {
        id: `e-${newBranchId}-${newSubId}`,
        source: newBranchId,
        target: newSubId,
        style: { stroke: 'var(--gw-text-subtle)', strokeWidth: 1.5 }
      };

      setNodes((nds) => [...nds, newBranch, newSub]);
      setEdges((eds) => [...eds, edge1, edge2]);
      setIsAiGenerating(false);
      setIsSaved(false);
      reactFlowInstance.current?.fitView({ duration: 800 });
    }, 1000);
  }, [pushHistory, setNodes, setEdges]);

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    const prev = historyRef.current;
    if (prev.past.length === 0) return;

    const lastSnapshot = prev.past[prev.past.length - 1];
    const target = cloneSnapshot(lastSnapshot.nodes, lastSnapshot.edges);
    const currentSnap = cloneSnapshot(nodesRef.current, edgesRef.current);

    const nextHistory: HistoryState = {
      past: prev.past.slice(0, -1),
      future: [...prev.future, currentSnap].slice(-MAX_HISTORY)
    };
    historyRef.current = nextHistory;
    setHistory(nextHistory);

    nodesRef.current = target.nodes;
    edgesRef.current = target.edges;
    setNodes(target.nodes);
    setEdges(target.edges);
    setIsSaved(false);
    setSelectedNodeId((sel) =>
      sel && target.nodes.some((n) => n.id === sel)
        ? sel
        : target.nodes[0]?.id ?? null
    );
    setHistoryVersion((v) => v + 1);
  }, [setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    const prev = historyRef.current;
    if (prev.future.length === 0) return;

    const nextSnapshot = prev.future[prev.future.length - 1];
    const target = cloneSnapshot(nextSnapshot.nodes, nextSnapshot.edges);
    const currentSnap = cloneSnapshot(nodesRef.current, edgesRef.current);

    const nextHistory: HistoryState = {
      past: [...prev.past, currentSnap].slice(-MAX_HISTORY),
      future: prev.future.slice(0, -1)
    };
    historyRef.current = nextHistory;
    setHistory(nextHistory);

    nodesRef.current = target.nodes;
    edgesRef.current = target.edges;
    setNodes(target.nodes);
    setEdges(target.edges);
    setIsSaved(false);
    setSelectedNodeId((sel) =>
      sel && target.nodes.some((n) => n.id === sel)
        ? sel
        : target.nodes[0]?.id ?? null
    );
    setHistoryVersion((v) => v + 1);
  }, [setNodes, setEdges]);

  // Wrapped ReactFlow change handlers
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const filteredChanges = changes.filter(
        (change) => !(change.type === 'remove' && change.id === 'root')
      );
      if (filteredChanges.length === 0) return;

      const hasRemoval = filteredChanges.some((change) => change.type === 'remove');
      if (hasRemoval) {
        pushHistory(nodesRef.current, edgesRef.current);
        setIsSaved(false);
      }

      onNodesChange(filteredChanges);
    },
    [onNodesChange, pushHistory]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (changes.length === 0) return;

      const hasRemoval = changes.some((change) => change.type === 'remove');
      if (hasRemoval) {
        pushHistory(nodesRef.current, edgesRef.current);
        setIsSaved(false);
      }

      onEdgesChange(changes);
    },
    [onEdgesChange, pushHistory]
  );

  // Keyboard shortcuts: Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();

      if (key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (key === 'y' && !e.shiftKey) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, handleRedo]);

  // Attach onAddChild cleanly without polluting node state or history snapshots
  const nodesWithActions: Node[] = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onAddChild: handleAddChildFromNode
        }
      })),
    [nodes, handleAddChildFromNode]
  );

  // Toolbar Actions
  const handleZoomIn = () => reactFlowInstance.current?.zoomIn();
  const handleZoomOut = () => reactFlowInstance.current?.zoomOut();
  const handleFitView = () => reactFlowInstance.current?.fitView({ duration: 600 });

  const handleSave = () => {
    setIsSaved(true);
  };

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden select-none relative"
      style={{
        backgroundColor: 'var(--gw-bg)',
        backgroundImage: 'var(--gw-wallpaper, var(--gw-bg-gradient))',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Top Floating Glass Toolbar */}
      <div className="p-3 pb-0 z-20 shrink-0">
        <MindMapToolbar
          title={title}
          onTitleChange={setTitle}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={history.past.length > 0}
          canRedo={history.future.length > 0}
          onSave={handleSave}
          isSaved={isSaved}
          onOpenExport={() => setExportOpen(true)}
          onOpenShare={() => setShareOpen(true)}
          onAiGenerate={handleAiGenerate}
          isAiGenerating={isAiGenerating}
          onAutoLayout={handleAutoLayout}
        />
      </div>

      {/* Main Canvas Workspace with Floating Left & Right Glass Panels */}
      <div className="flex-1 flex gap-3 p-2.5 sm:p-3 relative overflow-hidden">
        {/* Left Panel (Desktop) */}
        <div className="hidden md:block h-full">
          <MindMapLeftPanel
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={(nodeId) => {
              setSelectedNodeId(nodeId);
              const targetNode = nodes.find((n) => n.id === nodeId);
              if (targetNode) {
                reactFlowInstance.current?.setCenter(
                  targetNode.position.x + 80,
                  targetNode.position.y + 40,
                  { zoom: 1.1, duration: 600 }
                );
              }
            }}
            onAddNode={handleAddNode}
            onDeleteNode={handleDeleteNode}
            isCollapsed={leftCollapsed}
            onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
            width={leftWidth}
            onWidthChange={handleLeftWidthChange}
          />
        </div>

        {/* Center: React Flow Canvas */}
        <div className="flex-1 h-full relative gw-glass rounded-2xl overflow-hidden">
          <ReactFlow
            nodes={nodesWithActions}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onNodeDragStart={onNodeDragStart}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            onInit={(instance) => {
              reactFlowInstance.current = instance;
              instance.fitView({ padding: 0.2 });
            }}
            fitView
            panOnDrag
            zoomOnPinch
            panOnScroll
            selectionOnDrag={false}
            minZoom={0.2}
            maxZoom={2.5}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: 'var(--gw-text-subtle)', strokeWidth: 1.5 }
            }}
          >
            <Background
              color="var(--gw-border-strong)"
              gap={20}
              size={1.2}
              variant={BackgroundVariant.Dots}
            />
            <Controls
              showInteractive={false}
              className="!bg-transparent !border-none !shadow-none [&_button]:!min-w-[36px] [&_button]:!min-h-[36px] [&_button]:!bg-[rgba(var(--gw-surface-rgb),0.75)] [&_button]:!border [&_button]:!border-[var(--gw-border)] [&_button]:!text-[var(--gw-text)] [&_button:hover]:!bg-[var(--gw-accent-soft)] [&_button]:!backdrop-blur-md [&_button]:!rounded-lg [&_button]:!mb-1"
            />
            <MiniMap
              className="hidden md:block !w-[168px] !h-[108px] !bg-[rgba(var(--gw-surface-rgb),0.78)] !border !border-[var(--gw-border)] !rounded-xl !backdrop-blur-md !shadow-sm"
              nodeColor={(n) => {
                if (n.data?.level === 'root') return 'var(--gw-accent)';
                const c = n.data?.color ? String(n.data.color) : '';
                if (c && c.toUpperCase() !== '#FFFFFF') return c;
                return 'var(--gw-text-subtle)';
              }}
              maskColor="rgba(var(--gw-surface-rgb), 0.55)"
              pannable
              zoomable
            />
          </ReactFlow>

          {/* Mobile Drawer Toggles (shown on < md) */}
          <div className="md:hidden absolute bottom-3 right-3 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobilePanel((p) => (p === 'left' ? 'none' : 'left'))}
              className="gw-glass min-h-[44px] px-3.5 rounded-xl text-xs font-semibold text-[var(--gw-text)] cursor-pointer"
            >
              โหนด ({nodes.length})
            </button>
            <button
              type="button"
              onClick={() => setMobilePanel((p) => (p === 'right' ? 'none' : 'right'))}
              className="gw-button-primary min-h-[44px] px-3.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              คุณสมบัติ
            </button>
          </div>

          {/* Quick status badge on canvas */}
          <div className="gw-glass hidden sm:flex absolute bottom-4 left-14 z-10 px-3 py-1.5 rounded-xl text-[11px] text-[var(--gw-text-muted)] items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[var(--gw-positive)]" />
            <span>React Flow Active • {nodes.length} โหนด • {edges.length} เส้นเชื่อม</span>
          </div>
        </div>

        {/* Right Panel (Desktop) */}
        <div className="hidden md:block h-full">
          <MindMapRightPanel
            key={`${selectedNode?.id ?? 'none'}-${historyVersion}`}
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            isCollapsed={rightCollapsed}
            onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
            width={rightWidth}
            onWidthChange={handleRightWidthChange}
          />
        </div>

        {/* Mobile Overlay Drawers for Left/Right Panels */}
        {mobilePanel !== 'none' && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/45 backdrop-blur-xs flex justify-center items-end p-2.5"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMobilePanel('none');
            }}
          >
            <div className="w-full max-w-sm h-[75dvh]">
              {mobilePanel === 'left' ? (
                <MindMapLeftPanel
                  nodes={nodes}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={(nodeId) => {
                    setSelectedNodeId(nodeId);
                    setMobilePanel('none');
                    const targetNode = nodes.find((n) => n.id === nodeId);
                    if (targetNode) {
                      reactFlowInstance.current?.setCenter(
                        targetNode.position.x + 80,
                        targetNode.position.y + 40,
                        { zoom: 1.1, duration: 600 }
                      );
                    }
                  }}
                  onAddNode={handleAddNode}
                  onDeleteNode={handleDeleteNode}
                  isCollapsed={false}
                  onToggleCollapse={() => setMobilePanel('none')}
                />
              ) : (
                <MindMapRightPanel
                  key={`${selectedNode?.id ?? 'none'}-${historyVersion}`}
                  selectedNode={selectedNode}
                  onUpdateNode={handleUpdateNode}
                  isCollapsed={false}
                  onToggleCollapse={() => setMobilePanel('none')}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Export & Share Modals */}
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        mindMapTitle={title}
      />
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        mindMapTitle={title}
      />
    </div>
  );
}
