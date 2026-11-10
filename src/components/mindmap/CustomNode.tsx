'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, type Node } from '@xyflow/react';
import { Database, FolderTree, FileText } from 'lucide-react';

export type CustomNodeType = Node<{
  label: string;
  description?: string;
  level: 'root' | 'branch' | 'subtopic';
  color?: string;
  fontSize?: string;
}, 'custom'>;

function CustomNodeComponent({ data, selected }: NodeProps<CustomNodeType>) {
  const isRoot = data.level === 'root';
  const isBranch = data.level === 'branch';
  const isSubtopic = data.level === 'subtopic';

  let nodeClass = '';
  let badgeIcon = null;

  if (isRoot) {
    nodeClass = 'bg-[#6558E8] text-white border-2 border-[#5548D8] shadow-lg ring-offset-2 ring-2 ring-[#6558E8]/30';
    badgeIcon = <Database className="w-4 h-4 text-white" />;
  } else if (isBranch) {
    nodeClass = 'bg-[#8B7CF6] text-white border border-[#7A6AE6] shadow-md';
    badgeIcon = <FolderTree className="w-3.5 h-3.5 text-white/90" />;
  } else {
    nodeClass = 'bg-white text-[#202033] border border-[#E9E9F1] shadow-xs hover:border-[#8B7CF6]';
    badgeIcon = <FileText className="w-3.5 h-3.5 text-[#6558E8]" />;
  }

  return (
    <div
      className={`px-4 py-3 rounded-2xl min-w-[160px] max-w-[260px] transition-all duration-200 cursor-grab active:cursor-grabbing ${nodeClass} ${
        selected ? 'ring-4 ring-[#6558E8]/50 ring-offset-2 scale-105' : ''
      }`}
      style={{
        backgroundColor: data.color ? (isSubtopic ? '#FFFFFF' : data.color) : undefined,
        borderColor: isSubtopic && data.color ? data.color : undefined
      }}
    >
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-[#6558E8] border-2 border-white rounded-full transition-transform hover:scale-125"
        />
      )}

      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0">
          {badgeIcon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`font-bold leading-snug truncate ${
              isRoot ? 'text-base text-white' : isBranch ? 'text-sm text-white' : 'text-xs text-[#202033]'
            }`}
            style={{ fontSize: data.fontSize }}
          >
            {data.label}
          </p>
          {data.description && (
            <p
              className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                isRoot || isBranch ? 'text-white/80' : 'text-[#85859A]'
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
        className="w-3 h-3 bg-[#6558E8] border-2 border-white rounded-full transition-transform hover:scale-125"
      />
    </div>
  );
}

export default memo(CustomNodeComponent);
