'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GitFork, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MindMapItem } from '@/types';

interface RecentMindMapsGridProps {
  mindmaps: MindMapItem[];
  compact?: boolean;
}

export default function RecentMindMapsGrid({
  mindmaps,
  compact = false,
}: RecentMindMapsGridProps) {
  const router = useRouter();

  const getProgressPercent = (nodeCount: number) => {
    return Math.min(100, Math.max(45, Math.round((nodeCount / 28) * 100)));
  };

  return (
    <div className="gw-panel rounded-2xl p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-[var(--gw-text)]">
            แผนผังความคิดล่าสุด (Recent Mind Maps)
          </h3>
          <p className="text-xs text-[var(--gw-text-muted)]">
            Mind Maps ที่ถูกสร้างจากเอกสารด้วย AI
          </p>
        </div>
        <Link
          href="/mindmaps"
          className="cursor-pointer text-xs font-semibold text-[var(--gw-accent)] hover:text-[var(--gw-accent-hover)] flex items-center gap-1 shrink-0 transition-colors"
        >
          ดูทั้งหมด ({mindmaps.length})
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div
        className={`grid gap-3.5 ${
          compact
            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-1'
            : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
        }`}
      >
        {mindmaps.map((item) => {
          const progress = getProgressPercent(item.nodeCount);
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/mindmaps/${item.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(`/mindmaps/${item.id}`);
                }
              }}
              className="group cursor-pointer rounded-2xl p-4 bg-[rgba(var(--gw-surface-rgb),0.45)] border border-[var(--gw-border)] hover:border-[var(--gw-accent)] hover:bg-[rgba(var(--gw-surface-rgb),0.7)] transition-all duration-200 flex flex-col justify-between gap-3 focus-visible:outline-2 focus-visible:outline-[var(--gw-accent)]"
            >
              <div>
                {/* Top tag & Node count */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="gw-badge inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
                    <GitFork className="w-3 h-3" />
                    {item.nodeCount} โหนด
                  </span>
                  <span className="text-[11px] text-[var(--gw-text-subtle)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.lastModified}
                  </span>
                </div>

                {/* Title & Document Source */}
                <h4 className="font-bold text-sm text-[var(--gw-text)] group-hover:text-[var(--gw-accent)] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[var(--gw-text-muted)] mt-0.5 truncate">
                  จากเอกสาร: {item.documentName}
                </p>

                {/* Visual Preview Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.previewNodes.slice(0, 3).map((node, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[rgba(var(--gw-surface-rgb),0.6)] border border-[var(--gw-border)] text-[var(--gw-text-muted)] truncate max-w-[120px]"
                    >
                      {node}
                    </span>
                  ))}
                </div>
              </div>

              {/* Study Progress & Bottom Action */}
              <div className="pt-2.5 border-t border-[var(--gw-border)] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--gw-text-muted)] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[var(--gw-positive)]" />
                    ความพร้อมทบทวน
                  </span>
                  <span className="font-semibold text-[var(--gw-text)]">{progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[rgba(var(--gw-surface-rgb),0.6)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--gw-accent)] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--gw-accent)] pt-0.5">
                  <span>เปิดแก้ไขแคนวาส</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
