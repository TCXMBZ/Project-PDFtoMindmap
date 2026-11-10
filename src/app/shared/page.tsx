'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, FileText, GitFork, ArrowRight, Clock, UserCheck } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function SharedPage() {
  const router = useRouter();

  const sharedItems = [
    {
      id: 'sh-1',
      title: 'Database Architecture & Normalization',
      type: 'mindmap',
      author: 'อาจารย์ ดร. สมศักดิ์ (ผู้สอน)',
      date: '20 ต.ค. 2026',
      nodes: 18,
      href: '/mindmaps/mm-1'
    },
    {
      id: 'sh-2',
      title: 'Software Development Life Cycle (SDLC) Group 4',
      type: 'mindmap',
      author: 'กิตติศักดิ์ & ทีมโครงงาน',
      date: '18 ต.ค. 2026',
      nodes: 14,
      href: '/mindmaps/mm-1'
    },
    {
      id: 'sh-3',
      title: 'Operating System Internals.pdf',
      type: 'document',
      author: 'ฝ่ายวิชาการ',
      date: '15 ต.ค. 2026',
      pages: 54,
      href: '/documents/doc-5/analyze'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        <div className="bg-white p-6 rounded-2xl border border-[#E9E9F1] shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0EFFF] text-[#6558E8]">
              👥 Collaboration
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#202033] mt-1 tracking-tight">
            Shared with me
          </h1>
          <p className="text-sm text-[#85859A] mt-1">
            เอกสารและแผนผังความคิดที่อาจารย์หรือเพื่อนร่วมชั้นแชร์ให้คุณร่วมศึกษา
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sharedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(item.href)}
              className="bg-white rounded-2xl p-5 border border-[#E9E9F1] shadow-xs hover:shadow-md hover:border-[#6558E8]/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F0EFFF] text-[#6558E8]">
                    {item.type === 'mindmap' ? <GitFork className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    {item.type === 'mindmap' ? `${item.nodes} โหนด` : `${item.pages} หน้า`}
                  </span>
                  <span className="text-[11px] text-[#85859A] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#202033] group-hover:text-[#6558E8] transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#85859A] mt-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#18A979]" />
                  แชร์โดย: <span className="font-medium text-[#4A4A68]">{item.author}</span>
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E9E9F1] flex items-center justify-between text-xs font-semibold text-[#6558E8] group-hover:text-[#5548D8]">
                <span>เปิดดูข้อมูล</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

