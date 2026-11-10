'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
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

export default function MindMapEditorClient({ id }: MindMapEditorClientProps) {
  const mapData = initialMindMapData[id] || initialMindMapData['mm-1'];

  // State
  const [title, setTitle] = useState(mapData.title);
  const [nodes, setNodes, onNodesChange] = useNodesState(mapData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mapData.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('root');

  // Panel toggles
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // Modals
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Register Custom Node Type
  const nodeTypes = useMemo(() => ({ custom: CustomNode as any }), []);

  // Selected Node Object
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Connect handler
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: '#85859A', strokeWidth: 1.5 }
          },
          eds
        )
      );
      setIsSaved(false);
    },
    [setEdges]
  );

  // Node selection
  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    // Keep selection
  }, []);

  // Update Node Data from Right Panel
  const handleUpdateNode = useCallback(
    (nodeId: string, updatedData: any) => {
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
    [setNodes]
  );

  // Add new branch or subtopic
  const handleAddNode = useCallback(
    (level: 'branch' | 'subtopic') => {
      const newId = `node-${Date.now()}`;
      const parent = selectedNode || nodes[0];
      const posX = parent.position.x + (level === 'subtopic' ? 240 : 200);
      const posY = parent.position.y + (nodes.length % 2 === 0 ? 80 : -80);

      const newNode: Node = {
        id: newId,
        type: 'custom',
        position: { x: posX, y: posY },
        data: {
          label: level === 'branch' ? `หัวข้อใหม่ (${nodes.length})` : 'ข้อย่อยใหม่',
          description: 'เพิ่มคำอธิบายสั้นๆ ของหัวข้อนี้',
          level: level,
          color: level === 'branch' ? '#8B7CF6' : '#FFFFFF',
          fontSize: level === 'branch' ? '15px' : '13px'
        }
      };

      const newEdge: Edge = {
        id: `e-${parent.id}-${newId}`,
        source: parent.id,
        target: newId,
        style: { stroke: '#85859A', strokeWidth: 1.5 }
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
      setSelectedNodeId(newId);
      setIsSaved(false);
    },
    [nodes, selectedNode, setNodes, setEdges]
  );

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (nodeId === 'root') {
        alert('ไม่สามารถลบโหนดหลัก (Root Node) ได้');
        return;
      }
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId('root');
      setIsSaved(false);
    },
    [setNodes, setEdges]
  );

  // AI Generate (Auto-organize / layout animation)
  const handleAiGenerate = useCallback(() => {
    setIsAiGenerating(true);
    setTimeout(() => {
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
          color: '#18A979',
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
          color: '#FFFFFF',
          fontSize: '13px'
        }
      };

      const edge1: Edge = {
        id: `e-root-${newBranchId}`,
        source: 'root',
        target: newBranchId,
        animated: true,
        style: { stroke: '#18A979', strokeWidth: 2 }
      };

      const edge2: Edge = {
        id: `e-${newBranchId}-${newSubId}`,
        source: newBranchId,
        target: newSubId,
        style: { stroke: '#D1D3DF', strokeWidth: 1.5 }
      };

      setNodes((nds) => [...nds, newBranch, newSub]);
      setEdges((eds) => [...eds, edge1, edge2]);
      setIsAiGenerating(false);
      setIsSaved(false);
      reactFlowInstance.current?.fitView({ duration: 800 });
    }, 1000);
  }, [setNodes, setEdges]);

  // Toolbar Actions
  const handleZoomIn = () => reactFlowInstance.current?.zoomIn();
  const handleZoomOut = () => reactFlowInstance.current?.zoomOut();
  const handleFitView = () => reactFlowInstance.current?.fitView({ duration: 600 });

  const handleSave = () => {
    setIsSaved(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F7F8FC] overflow-hidden select-none">
      {/* Top Toolbar (64px) */}
      <MindMapToolbar
        title={title}
        onTitleChange={setTitle}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
        onSave={handleSave}
        isSaved={isSaved}
        onOpenExport={() => setExportOpen(true)}
        onOpenShare={() => setShareOpen(true)}
        onAiGenerate={handleAiGenerate}
        isAiGenerating={isAiGenerating}
      />

      {/* Main Canvas Workspace with Left & Right Panels */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Panel */}
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
        />

        {/* Center: React Flow Canvas */}
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            onInit={(instance) => {
              reactFlowInstance.current = instance;
              instance.fitView({ padding: 0.2 });
            }}
            fitView
            minZoom={0.2}
            maxZoom={2.5}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#85859A', strokeWidth: 1.5 }
            }}
          >
            <Background color="#DCDDE8" gap={20} size={1.2} variant={BackgroundVariant.Dots} />
            <Controls showInteractive={false} className="bg-white border border-[#E9E9F1] rounded-xl shadow-xs" />
          </ReactFlow>

          {/* Quick status badge on canvas */}
          <div className="absolute bottom-5 left-5 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#E9E9F1] shadow-xs text-[11px] text-[#85859A] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#18A979]" />
            <span>React Flow Active • {nodes.length} โหนด • {edges.length} เส้นเชื่อม</span>
          </div>
        </div>

        {/* Right Panel */}
        <MindMapRightPanel
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          isCollapsed={rightCollapsed}
          onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
        />
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

