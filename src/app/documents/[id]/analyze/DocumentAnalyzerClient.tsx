'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  Download,
  BookOpen,
  Tag,
  ListOrdered,
  ArrowRight,
  GitFork,
  MessageSquare,
  CheckCircle2,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { mockDocuments } from '@/data/mockDocuments';

interface DocumentAnalyzerClientProps {
  id: string;
}

export default function DocumentAnalyzerClient({ id }: DocumentAnalyzerClientProps) {
  const router = useRouter();

  // Find document or fallback to doc-1
  const doc = mockDocuments.find((d) => d.id === id) || mockDocuments[0];

  // Viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = doc.pageCount;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  const handleGenerateMindMap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      router.push(`/mindmaps/mm-1`);
    }, 800);
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Top bar header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E9E9F1] shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/documents"
              className="p-2 rounded-xl text-[#85859A] hover:text-[#202033] hover:bg-[#F7F8FC] border border-[#E9E9F1]"
              title="ย้อนกลับไปคลังเอกสาร"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-red-50 text-red-600">
                  {doc.fileType}
                </span>
                <span className="text-xs text-[#85859A]">{doc.fileSize} • {doc.uploadDate}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#202033] mt-0.5">
                {doc.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/chat"
              className="px-3.5 py-2 rounded-xl border border-[#E9E9F1] bg-white text-xs font-semibold text-[#4A4A68] hover:bg-[#F7F8FC] transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-[#6558E8]" />
              สนทนากับ AI
            </Link>

            <button
              onClick={handleGenerateMindMap}
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-all flex items-center gap-2 shadow-sm"
            >
              <GitFork className="w-4 h-4" />
              {isGenerating ? 'กำลังสร้าง Mind Map...' : 'Generate Mind Map'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Split: Document Viewer (Left) & AI Analysis (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Document Preview (Col 1-7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E9E9F1] shadow-xs flex flex-col h-[750px] overflow-hidden">
            {/* Viewer Toolbar */}
            <div className="p-3.5 border-b border-[#E9E9F1] bg-[#F7F8FC] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6558E8]" />
                <span className="font-semibold text-[#202033]">Document Preview</span>
              </div>

              {/* Page navigation controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-lg border border-[#E9E9F1] bg-white disabled:opacity-40 text-[#4A4A68]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-[#4A4A68]">
                  หน้า <span className="font-bold text-[#202033]">{currentPage}</span> / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded-lg border border-[#E9E9F1] bg-white disabled:opacity-40 text-[#4A4A68]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                  className="p-1.5 rounded-lg border border-[#E9E9F1] bg-white text-[#4A4A68] hover:bg-[#F0EFFF]"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-[#85859A] w-10 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                  className="p-1.5 rounded-lg border border-[#E9E9F1] bg-white text-[#4A4A68] hover:bg-[#F0EFFF]"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Render Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#FAFAFC]">
              <div
                className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xs border border-[#E9E9F1] transition-all"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                <div className="border-b border-[#E9E9F1] pb-4 mb-6">
                  <span className="text-[11px] font-bold text-[#6558E8] tracking-widest uppercase">
                    CHAPTER 1: INTRODUCTION TO DATABASE SYSTEMS
                  </span>
                  <h2 className="text-xl font-bold text-[#202033] mt-1">
                    สถาปัตยกรรมระบบฐานข้อมูล และแบบจำลองเชิงสัมพันธ์
                  </h2>
                  <p className="text-xs text-[#85859A] mt-1">
                    หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) • แผนกวิชาเทคโนโลยีสารสนเทศ
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#383852] leading-relaxed">
                  <p>
                    <strong>1. ความหมายของระบบฐานข้อมูล (Database System):</strong> คือกลุ่มของข้อมูลที่มีความสัมพันธ์กัน ถูกจัดเก็บไว้ในหน่วยความจำสำรองอย่างเป็นระบบ โดยมีซอฟต์แวร์ควบคุมที่เรียกว่า <em>Database Management System (DBMS)</em> ทำหน้าที่เป็นตัวกลางในการจัดการ เข้าถึง และคุ้มครองความปลอดภัยของข้อมูล
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#F0EFFF]/60 border border-[#6558E8]/20 my-3">
                    <p className="font-semibold text-xs text-[#6558E8] mb-1">💡 ข้อดีของการใช้ระบบฐานข้อมูล:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#4A4A68]">
                      <li>ลดความซ้ำซ้อนของข้อมูล (Minimizing Data Redundancy)</li>
                      <li>หลีกเลี่ยงความขัดแย้งของข้อมูล (Avoiding Inconsistency)</li>
                      <li>สามารถใช้ข้อมูลร่วมกันได้หลายคนในเวลาเดียวกัน (Multi-user Sharing)</li>
                      <li>รักษาความถูกต้องและความคงสภาพของข้อมูล (Data Integrity & ACID)</li>
                    </ul>
                  </div>

                  <p>
                    <strong>2. สถาปัตยกรรมแบบ 3 ระดับ (Three-Schema Architecture):</strong> ประกอบด้วย External Level (มุมมองของผู้ใช้งาน), Conceptual Level (โครงสร้างเชิงตรรกะทั้งหมดของตารางและความสัมพันธ์), และ Internal Level (การจัดเก็บข้อมูลทางกายภาพในดิสก์)
                  </p>

                  <p>
                    <strong>3. ภาษามาตรฐาน SQL (Structured Query Language):</strong> แบ่งคำสั่งออกเป็น 4 หมวดหลัก:
                  </p>

                  <div className="font-mono text-xs p-3 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto space-y-1">
                    <p className="text-[#8B7CF6]">-- ตัวอย่างคำสั่ง DDL และ DML</p>
                    <p><span className="text-pink-400">CREATE TABLE</span> Students (</p>
                    <p className="pl-4">student_id <span className="text-emerald-400">VARCHAR(10)</span> <span className="text-yellow-400">PRIMARY KEY</span>,</p>
                    <p className="pl-4">fullname <span className="text-emerald-400">VARCHAR(100)</span> <span className="text-yellow-400">NOT NULL</span>,</p>
                    <p className="pl-4">department_id <span className="text-emerald-400">INT</span> <span className="text-yellow-400">REFERENCES</span> Departments(id)</p>
                    <p>);</p>
                  </div>

                  <p>
                    <strong>4. การจัดโครงสร้างความสัมพันธ์ (Normalization):</strong> มีเป้าหมายเพื่อลดความซ้ำซ้อนและป้องกันภาวะความผิดปกติ (Anomalies) เช่น Insertion Anomaly, Deletion Anomaly, และ Update Anomaly โดยดำเนินการตามกฎ 1NF, 2NF และ 3NF
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: AI Analysis Result (Col 8-12) */}
          <div className="lg:col-span-5 space-y-5">
            {/* AI Summary Card */}
            <div className="bg-white rounded-2xl border border-[#E9E9F1] p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E9E9F1] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#202033]">AI Analysis Summary</h3>
                    <p className="text-[11px] text-[#85859A]">วิเคราะห์เสร็จสมบูรณ์ • ความเชื่อมั่น 99%</p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#18A979]/10 text-[#18A979]">
                  พร้อมสร้าง Mind Map
                </span>
              </div>

              {/* Document Overview */}
              <div>
                <h4 className="text-xs font-bold text-[#85859A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#6558E8]" />
                  ภาพรวมเอกสาร (Overview)
                </h4>
                <p className="text-xs sm:text-sm text-[#383852] bg-[#F7F8FC] p-3.5 rounded-xl border border-[#E9E9F1] leading-relaxed">
                  {doc.overview}
                </p>
              </div>

              {/* Main Topics */}
              <div>
                <h4 className="text-xs font-bold text-[#85859A] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#6558E8]" />
                  หัวข้อหลักที่ตรวจพบ (Main Topics)
                </h4>
                <div className="space-y-2">
                  {doc.topics?.map((topic, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1] hover:border-[#6558E8]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-[#F0EFFF] text-[#6558E8] font-bold text-[11px] flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-[#202033]">{topic}</span>
                      </div>
                      <span className="text-[10px] text-[#85859A]">กิ่ง Mind Map</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <h4 className="text-xs font-bold text-[#85859A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#6558E8]" />
                  คำสำคัญ (Keywords)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {doc.keywords?.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => handleCopy(kw)}
                      className="px-2.5 py-1 rounded-lg bg-[#F0EFFF] hover:bg-[#E7E4FE] text-[#6558E8] text-xs font-medium transition-colors flex items-center gap-1 group"
                      title="คลิกเพื่อคัดลอก"
                    >
                      #{kw}
                      {copiedKeyword === kw ? (
                        <Check className="w-3 h-3 text-[#18A979]" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Summary Points */}
              <div>
                <h4 className="text-xs font-bold text-[#85859A] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-[#6558E8]" />
                  ประเด็นสรุปสาระสำคัญ (Key Takeaways)
                </h4>
                <div className="space-y-2">
                  {doc.summary?.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#383852] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#18A979] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Big CTA */}
              <div className="pt-2">
                <button
                  onClick={handleGenerateMindMap}
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6558E8] to-[#8B7CF6] hover:from-[#5548D8] hover:to-[#7A6AE6] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <GitFork className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  {isGenerating ? 'กำลังสร้างแผนผังความคิด...' : 'เปิดใน Mind Map Editor ทันที'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

