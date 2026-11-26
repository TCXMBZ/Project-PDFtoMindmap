'use client';

import React, { useRef, useState } from 'react';
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
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Node } from '@xyflow/react';

const MIN_WIDTH = 200;
const MAX_WIDTH = 420;
const DEFAULT_LEFT_WIDTH = 288;
const COMPACT_WIDTH = 216;
const STANDARD_WIDTH = 300;

function clampWidth(value: number): number {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(value)));
}

interface MindMapLeftPanelProps {
  nodes: Node[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: (level: 'branch' | 'subtopic') => void;
  onDeleteNode: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  width?: number;
  onWidthChange?: (w: number) => void;
}

export default function MindMapLeftPanel({
  nodes,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  isCollapsed,
  onToggleCollapse,
  width,
  onWidthChange
}: MindMapLeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalWidth, setInternalWidth] = useState(() =>
    clampWidth(width ?? DEFAULT_LEFT_WIDTH)
  );
  const [isResizing, setIsResizing] = useState(false);
  const dragStateRef = useRef<{
    startX: number;
    startWidth: number;
    pointerId: number;
  } | null>(null);

  const currentWidth = clampWidth(
    onWidthChange && width !== undefined ? width : internalWidth
  );
  const isCompact = currentWidth <= 240;

  const updateWidth = (next: number) => {
    const clamped = clampWidth(next);
    if (onWidthChange) {
      onWidthChange(clamped);
    }
    if (!onWidthChange || width === undefined) {
      setInternalWidth(clamped);
    }
  };

  const handleToggleWidthPreset = () => {
    updateWidth(isCompact ? STANDARD_WIDTH : COMPACT_WIDTH);
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      startX: e.clientX,
      startWidth: currentWidth,
      pointerId: e.pointerId
    };
    setIsResizing(true);
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    const delta = e.clientX - dragStateRef.current.startX;
    updateWidth(dragStateRef.current.startWidth + delta);
  };

  const handleResizePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragStateRef.current = null;
    setIsResizing(false);
  };

  const handleResizeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateWidth(currentWidth + 16);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateWidth(currentWidth - 16);
    }
  };

  const filteredNodes = nodes.filter((n) =>
    ((n.data as Record<string, unknown>)?.label as string || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{ '--panel-width': `${currentWidth}px` } as React.CSSProperties}
      className={`gw-panel rounded-2xl relative z-10 flex flex-col h-full ${
        isResizing ? 'transition-none' : 'transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
      } ${isCollapsed ? 'w-12' : 'w-full md:w-[var(--panel-width)]'}`}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="gw-glass absolute right-2 top-3 md:-right-3 md:top-5 z-30 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] cursor-pointer"
        title={isCollapsed ? 'ขยายแผงจัดการ' : 'ย่อแผงจัดการ'}
        aria-label={isCollapsed ? 'ขยายแผงจัดการ' : 'ย่อแผงจัดการ'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 md:w-3.5 md:h-3.5" /> : <ChevronLeft className="w-4 h-4 md:w-3.5 md:h-3.5" />}
      </button>

      {/* Desktop Inner-Edge Resize Handle */}
      {!isCollapsed && (
        <div
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label="ปรับความกว้างแผงโครงสร้างโหนด"
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
          aria-valuenow={currentWidth}
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerEnd}
          onPointerCancel={handleResizePointerEnd}
          onKeyDown={handleResizeKeyDown}
          className="hidden md:flex items-center justify-center absolute top-14 bottom-4 -right-1.5 w-3 z-20 cursor-col-resize touch-none select-none group/resize focus:outline-none"
        >
          <div
            className={`w-1 h-10 rounded-full transition ${
              isResizing
                ? 'bg-[var(--gw-accent)] opacity-100 scale-y-110'
                : 'bg-[var(--gw-border-strong)] opacity-0 group-hover/resize:opacity-100 group-focus-visible/resize:opacity-100'
            }`}
          />
        </div>
      )}

      {isCollapsed ? (
        <div className="flex flex-col items-center py-5 gap-2">
          <button
            type="button"
            onClick={() => onAddNode('branch')}
            className="gw-badge w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[var(--gw-accent)] hover:text-white transition-colors cursor-pointer"
            title="เพิ่มกิ่งหลัก"
            aria-label="เพิ่มกิ่งหลัก"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleCollapse()}
            className="w-10 h-10 rounded-lg text-[var(--gw-text-muted)] hover:bg-[var(--gw-accent-soft)] flex items-center justify-center cursor-pointer"
            title="โครงสร้างโหนด"
            aria-label="โครงสร้างโหนด"
          >
            <FolderTree className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-3 pr-11 md:pr-2 border-b gw-divider">
            <div className="flex items-center gap-2 min-w-0">
              <FolderTree className="w-4 h-4 text-[var(--gw-accent)] shrink-0" />
              <h3 className="font-bold text-xs text-[var(--gw-text)] uppercase tracking-wider truncate">
                Node Structure
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="gw-badge text-[11px] font-semibold px-2 py-0.5 rounded-md">
                {nodes.length} โหนด
              </span>
              <button
                type="button"
                onClick={handleToggleWidthPreset}
                className="hidden md:inline-flex items-center justify-center min-w-[36px] min-h-[36px] rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] transition-colors cursor-pointer"
                title={isCompact ? `ขยายแผง (${STANDARD_WIDTH}px)` : `ย่อแผง (${COMPACT_WIDTH}px)`}
                aria-label={isCompact ? `ปรับความกว้างเป็นมาตรฐาน ${STANDARD_WIDTH} พิกเซล` : `ปรับความกว้างเป็นกะทัดรัด ${COMPACT_WIDTH} พิกเซล`}
              >
                {isCompact ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Quick Add Node Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onAddNode('branch')}
              aria-label="เพิ่มกิ่งหลัก"
              className="gw-badge min-h-[44px] py-2 px-3 rounded-xl hover:bg-[var(--gw-accent)] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              กิ่งหลัก
            </button>
            <button
              type="button"
              onClick={() => onAddNode('subtopic')}
              disabled={!selectedNodeId}
              aria-label="เพิ่มข้อย่อย"
              className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                selectedNodeId
                  ? 'gw-button border-[var(--gw-accent)]/40 text-[var(--gw-accent)] hover:bg-[var(--gw-accent-soft)] cursor-pointer'
                  : 'gw-button opacity-45 cursor-not-allowed'
              }`}
              title={selectedNodeId ? 'เพิ่มหัวข้อย่อยใต้โหนดที่เลือก' : 'กรุณาเลือกโหนดก่อน'}
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              ข้อย่อย
            </button>
          </div>

          {/* Search nodes */}
          <div className="gw-search relative rounded-lg">
            <Search className="w-3.5 h-3.5 text-[var(--gw-text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาโหนดในแผนผัง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="ค้นหาโหนดในแผนผัง"
              className="w-full min-h-[40px] pl-8 pr-3 text-xs bg-transparent text-[var(--gw-text)] placeholder-[var(--gw-text-subtle)] focus:outline-none"
            />
          </div>

          {/* Tree View of Nodes */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredNodes.map((node) => {
              const data = node.data as Record<string, unknown>;
              const isSelected = selectedNodeId === node.id;
              const isRoot = data.level === 'root';
              const isBranch = data.level === 'branch';

              return (
                <div
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectNode(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectNode(node.id);
                    }
                  }}
                  className={`group flex items-center justify-between gap-2 min-h-[44px] px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition border focus-visible:outline-2 focus-visible:outline-[var(--gw-accent)] ${
                    isSelected
                      ? 'bg-[var(--gw-accent-soft)] border-[var(--gw-accent)] text-[var(--gw-accent)] font-bold'
                      : 'border-transparent hover:bg-[var(--gw-accent-soft)]/40 text-[var(--gw-text)]'
                  } ${isBranch ? 'ml-3' : !isRoot ? 'ml-6' : ''}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isRoot ? (
                      <Database className="w-3.5 h-3.5 text-[var(--gw-accent)] shrink-0" />
                    ) : isBranch ? (
                      <CornerDownRight className="w-3.5 h-3.5 text-[var(--gw-accent)] shrink-0" />
                    ) : (
                      <FileText className="w-3 h-3 text-[var(--gw-text-muted)] shrink-0" />
                    )}
                    <span className="truncate">{String(data.label || '')}</span>
                  </div>

                  {!isRoot && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNode(node.id);
                      }}
                      className="min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] flex items-center justify-center rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-danger)] hover:bg-rose-500/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 transition-opacity cursor-pointer shrink-0"
                      title="ลบโหนด"
                      aria-label={`ลบโหนด ${String(data.label || '')}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Node Status Footer */}
          {selectedNodeId && (
            <div className="pt-3 border-t gw-divider flex items-center justify-between gap-2 text-xs">
              <span className="text-[var(--gw-text-muted)] truncate">เลือก: {selectedNodeId}</span>
              <button
                type="button"
                onClick={() => onDeleteNode(selectedNodeId)}
                aria-label="ลบโหนดที่เลือก"
                className="min-h-[44px] px-2 text-[var(--gw-danger)] hover:underline flex items-center gap-1.5 font-semibold text-xs cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                ลบโหนดนี้
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
