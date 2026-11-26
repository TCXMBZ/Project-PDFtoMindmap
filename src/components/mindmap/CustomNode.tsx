'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, type Node } from '@xyflow/react';
import { Database, FolderTree, FileText, Plus } from 'lucide-react';

export type CustomNodeType = Node<{
  label: string;
  description?: string;
  level: 'root' | 'branch' | 'subtopic';
  color?: string;
  fontSize?: string;
  onAddChild?: (nodeId: string) => void;
}, 'custom'>;

function CustomNodeComponent({ id, data, selected }: NodeProps<CustomNodeType>) {
  const isRoot = data.level === 'root';
  const isBranch = data.level === 'branch';
  const isSubtopic = data.level === 'subtopic';

  const hasCustomColor = Boolean(data.color && data.color.toUpperCase() !== '#FFFFFF');

  let nodeClass = '';
  let badgeIcon = null;

  if (isRoot) {
    nodeClass =
      'bg-[var(--gw-accent)] text-white border-2 border-[var(--gw-accent-hover)] shadow-xl ring-2 ring-[var(--gw-accent)]/30';
    badgeIcon = <Database className="w-4 h-4 text-white" />;
  } else if (isBranch) {
    nodeClass = hasCustomColor
      ? 'text-white border border-white/25 shadow-lg'
      : 'gw-panel [backdrop-filter:none] [-webkit-backdrop-filter:none] text-[var(--gw-text)] border border-[var(--gw-accent)]/40 border-l-4 border-l-[var(--gw-accent)] shadow-md';
    badgeIcon = (
      <FolderTree
        className={`w-3.5 h-3.5 ${hasCustomColor ? 'text-white/90' : 'text-[var(--gw-accent)]'}`}
      />
    );
  } else {
    nodeClass =
      'gw-panel [backdrop-filter:none] [-webkit-backdrop-filter:none] text-[var(--gw-text)] border-l-2 border-l-[var(--gw-accent)]/50 shadow-sm hover:border-[var(--gw-accent)]';
    badgeIcon = <FileText className="w-3.5 h-3.5 text-[var(--gw-accent)]" />;
  }

  return (
    <div
      className={`relative px-4 py-3 rounded-2xl min-w-[160px] max-w-[260px] transition-[box-shadow,border-color,background-color,transform] duration-200 cursor-grab active:cursor-grabbing ${nodeClass} ${
        selected ? 'ring-4 ring-[var(--gw-accent)]/55 shadow-2xl scale-105' : ''
      }`}
      style={{
        backgroundColor: !isSubtopic && hasCustomColor ? data.color : undefined,
        borderColor: isSubtopic && hasCustomColor ? data.color : undefined
      }}
    >
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3.5 !h-3.5 !bg-[var(--gw-accent)] !border-2 !border-[var(--gw-bg)] rounded-full touch-none transition-[transform,box-shadow] duration-150 hover:scale-125 hover:ring-4 hover:ring-[var(--gw-accent)]/35"
        />
      )}

      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0">
          {badgeIcon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`font-bold leading-snug truncate ${
              isRoot || (isBranch && hasCustomColor)
                ? 'text-white'
                : 'text-[var(--gw-text)]'
            } ${isRoot ? 'text-base' : isBranch ? 'text-sm' : 'text-xs'}`}
            style={{ fontSize: data.fontSize }}
          >
            {data.label}
          </p>
          {data.description && (
            <p
              className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                isRoot || (isBranch && hasCustomColor)
                  ? 'text-white/85'
                  : 'text-[var(--gw-text-muted)]'
              }`}
            >
              {data.description}
            </p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3.5 !h-3.5 !bg-[var(--gw-accent)] !border-2 !border-[var(--gw-bg)] rounded-full touch-none transition-[transform,box-shadow] duration-150 hover:scale-125 hover:ring-4 hover:ring-[var(--gw-accent)]/35"
      />

      {selected && (
        <button
          type="button"
          aria-label="เพิ่มโหนดลูก"
          title="เพิ่มโหนดลูก"
          onClick={(e) => {
            e.stopPropagation();
            data.onAddChild?.(id);
          }}
          className="nodrag nopan absolute -bottom-5 right-3 z-10 min-w-[36px] min-h-[36px] rounded-full bg-[var(--gw-accent)] hover:bg-[var(--gw-accent-hover)] text-white shadow-lg border-2 border-[var(--gw-bg)] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default memo(CustomNodeComponent);
