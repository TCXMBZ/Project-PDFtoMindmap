'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  FolderTree,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  CornerDownRight,
  Sparkles
} from 'lucide-react';
import { Node } from '@xyflow/react';

interface MindMapLeftPanelProps {
  nodes: Node[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: (level: 'branch' | 'subtopic') => void;
  onDeleteNode: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function MindMapLeftPanel({
  nodes,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  isCollapsed,
  onToggleCollapse
}: MindMapLeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = nodes.filter((n) =>
    (n.data as any)?.label?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`relative z-10 bg-white border-r border-[#E9E9F1] transition-all duration-300 flex flex-col h-full shadow-xs ${
        isCollapsed ? 'w-12' : 'w-72 sm:w-80'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-5 z-20 w-6 h-6 bg-white border border-[#E9E9F1] rounded-full shadow-xs flex items-center justify-center text-[#85859A] hover:text-[#202033]"
        title={isCollapsed ? 'ขยายแผงจัดการ' : 'ย่อแผงจัดการ'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {isCollapsed ? (
        <div className="flex flex-col items-center py-5 space-y-4">
          <button
            onClick={() => onAddNode('branch')}
            className="w-8 h-8 rounded-lg bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center hover:bg-[#6558E8] hover:text-white transition-colors"
            title="เพิ่มกิ่งหลัก"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleCollapse()}
            className="w-8 h-8 rounded-lg text-[#85859A] hover:bg-[#F7F8FC] flex items-center justify-center"
            title="โครงสร้างโหนด"
          >
            <FolderTree className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-[#6558E8]" />
              <h3 className="font-bold text-xs text-[#202033] uppercase tracking-wider">
                Node Structure
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#85859A] bg-[#F7F8FC] px-2 py-0.5 rounded-md">
              {nodes.length} โหนด
            </span>
          </div>

          {/* Quick Add Node Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddNode('branch')}
              className="py-2 px-3 rounded-xl bg-[#F0EFFF] text-[#6558E8] hover:bg-[#E7E4FE] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              + กิ่งหลัก (Branch)
            </button>
            <button
              onClick={() => onAddNode('subtopic')}
              disabled={!selectedNodeId}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                selectedNodeId
                  ? 'bg-white border border-[#6558E8] text-[#6558E8] hover:bg-[#F0EFFF]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title={selectedNodeId ? 'เพิ่มหัวข้อย่อยใต้โหนดที่เลือก' : 'กรุณาเลือกโหนดก่อน'}
            >
              <Plus className="w-3.5 h-3.5" />
              + ข้อย่อย (Subtopic)
            </button>
          </div>

          {/* Search nodes */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#85859A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาโหนดในแผนผัง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#F7F8FC] border border-[#E9E9F1] rounded-lg text-[#202033] placeholder-[#85859A] focus:outline-none focus:border-[#6558E8]"
            />
          </div>

          {/* Tree View of Nodes */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredNodes.map((node) => {
              const data = node.data as any;
              const isSelected = selectedNodeId === node.id;
              const isRoot = data.level === 'root';
              const isBranch = data.level === 'branch';

              return (
                <div
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#F0EFFF] border border-[#6558E8] text-[#6558E8] font-bold shadow-xs'
                      : 'hover:bg-[#F7F8FC] text-[#4A4A68]'
                  } ${isBranch ? 'ml-3' : !isRoot ? 'ml-6' : ''}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isRoot ? (
                      <Database className="w-3.5 h-3.5 text-[#6558E8] shrink-0" />
                    ) : isBranch ? (
                      <CornerDownRight className="w-3.5 h-3.5 text-[#8B7CF6] shrink-0" />
                    ) : (
                      <FileText className="w-3 h-3 text-[#85859A] shrink-0" />
                    )}
                    <span className="truncate">{data.label}</span>
                  </div>

                  {!isRoot && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNode(node.id);
                      }}
                      className="p-1 rounded text-[#85859A] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="ลบโหนด"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Node Status Footer */}
          {selectedNodeId && (
            <div className="pt-3 border-t border-[#E9E9F1] flex items-center justify-between text-xs">
              <span className="text-[#85859A] truncate">เลือก: {selectedNodeId}</span>
              <button
                onClick={() => onDeleteNode(selectedNodeId)}
                className="text-red-500 hover:underline flex items-center gap-1 font-semibold text-xs"
              >
                <Trash2 className="w-3 h-3" />
                ลบโหนดนี้
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

