'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GitFork, Clock, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { MindMapItem } from '@/types';

interface RecentMindMapsGridProps {
  mindmaps: MindMapItem[];
}

export default function RecentMindMapsGrid({ mindmaps }: RecentMindMapsGridProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-[#202033]">แผนผังความคิดล่าสุด (Recent Mind Maps)</h3>
          <p className="text-xs text-[#85859A]">Mind Maps ที่ถูกสร้างจากเอกสารด้วย AI</p>
        </div>
        <Link
          href="/mindmaps"
          className="text-xs font-semibold text-[#6558E8] hover:text-[#5548D8] flex items-center gap-1"
        >
          ดูทั้งหมด ({mindmaps.length})
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {mindmaps.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/mindmaps/${item.id}`)}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-[#E9E9F1] shadow-xs hover:shadow-lg hover:border-[#6558E8]/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Top tag & Node count */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F0EFFF] text-[#6558E8]">
                  <GitFork className="w-3.5 h-3.5" />
                  {item.nodeCount} โหนด
                </span>
                <span className="text-[11px] text-[#85859A] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.lastModified}
                </span>
              </div>

              {/* Title & Document Source */}
              <h4 className="font-bold text-sm text-[#202033] group-hover:text-[#6558E8] transition-colors line-clamp-1">
                {item.title}
              </h4>
              <p className="text-xs text-[#85859A] mt-1 truncate">
                จากเอกสาร: {item.documentName}
              </p>

              {/* Visual Preview Pills */}
              <div className="mt-4 pt-3 border-t border-[#E9E9F1]/80 flex flex-wrap gap-1.5">
                {item.previewNodes.map((node, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F7F8FC] border border-[#E9E9F1] text-[#4A4A68] truncate max-w-[120px]"
                  >
                    • {node}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-5 pt-3 border-t border-[#E9E9F1] flex items-center justify-between text-xs font-semibold text-[#6558E8] group-hover:text-[#5548D8]">
              <span>เปิดแก้ไขแคนวาส</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

