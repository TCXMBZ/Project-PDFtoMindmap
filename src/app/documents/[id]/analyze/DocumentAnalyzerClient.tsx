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
  BookOpen,
  Tag,
  ListOrdered,
  ArrowRight,
  GitFork,
  MessageSquare,
  CheckCircle2,
  Layers,
  Copy,
  Check,
  Lightbulb
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
        <div className="gw-panel gw-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <Link
              href="/documents"
              className="gw-button p-2 rounded-xl text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] cursor-pointer"
              title="ย้อนกลับไปคลังเอกสาร"
              aria-label="ย้อนกลับไปคลังเอกสาร"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-500 border border-rose-500/20">
                  {doc.fileType}
                </span>
                <span className="text-xs text-[var(--gw-text-muted)]">{doc.fileSize} • {doc.uploadDate}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[var(--gw-text)] mt-0.5">
                {doc.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/chat"
              className="gw-button px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[var(--gw-accent)]" />
              สนทนากับ AI
            </Link>

            <button
              type="button"
              onClick={handleGenerateMindMap}
              disabled={isGenerating}
              className="gw-button-primary px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
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
          <div className="lg:col-span-7 gw-panel gw-reveal rounded-2xl flex flex-col h-[420px] sm:h-[560px] lg:h-[750px] overflow-hidden">
            {/* Viewer Toolbar */}
            <div
              className="p-3 sm:p-3.5 border-b gw-divider flex flex-wrap items-center justify-between gap-2 text-xs"
              style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--gw-accent)]" />
                <span className="font-semibold text-[var(--gw-text)]">Document Preview</span>
              </div>

              {/* Page navigation controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="gw-button p-1 rounded-lg disabled:opacity-40 cursor-pointer"
                  aria-label="หน้าก่อนหน้า"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-[var(--gw-text-muted)]">
                  หน้า <span className="font-bold text-[var(--gw-text)]">{currentPage}</span> / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="gw-button p-1 rounded-lg disabled:opacity-40 cursor-pointer"
                  aria-label="หน้าถัดไป"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                  className="gw-button p-1.5 rounded-lg cursor-pointer"
                  title="Zoom Out"
                  aria-label="ย่อขนาดเอกสาร"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-[var(--gw-text-muted)] w-10 text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                  className="gw-button p-1.5 rounded-lg cursor-pointer"
                  title="Zoom In"
                  aria-label="ขยายขนาดเอกสาร"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Render Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div
                className="max-w-2xl mx-auto gw-glass p-8 rounded-xl transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                <div className="border-b gw-divider pb-4 mb-6">
                  <span className="text-[11px] font-bold text-[var(--gw-accent)] tracking-widest uppercase">
                    CHAPTER 1: INTRODUCTION TO DATABASE SYSTEMS
                  </span>
                  <h2 className="text-xl font-bold text-[var(--gw-text)] mt-1">
                    สถาปัตยกรรมระบบฐานข้อมูล และแบบจำลองเชิงสัมพันธ์
                  </h2>
                  <p className="text-xs text-[var(--gw-text-muted)] mt-1">
                    หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) • แผนกวิชาเทคโนโลยีสารสนเทศ
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[var(--gw-text)] leading-relaxed">
                  <p>
                    <strong>1. ความหมายของระบบฐานข้อมูล (Database System):</strong> คือกลุ่มของข้อมูลที่มีความสัมพันธ์กัน ถูกจัดเก็บไว้ในหน่วยความจำสำรองอย่างเป็นระบบ โดยมีซอฟต์แวร์ควบคุมที่เรียกว่า <em>Database Management System (DBMS)</em> ทำหน้าที่เป็นตัวกลางในการจัดการ เข้าถึง และคุ้มครองความปลอดภัยของข้อมูล
                  </p>

                  <div className="p-3.5 rounded-xl bg-[var(--gw-accent-soft)] border border-[var(--gw-accent)]/25 my-3">
                    <p className="font-semibold text-xs text-[var(--gw-accent)] mb-1.5 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      ข้อดีของการใช้ระบบฐานข้อมูล:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[var(--gw-text-muted)]">
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

                  <div className="font-mono text-xs p-3.5 rounded-xl bg-slate-950/90 text-slate-100 border border-[var(--gw-border)] overflow-x-auto space-y-1">
                    <p className="text-emerald-400">-- ตัวอย่างคำสั่ง DDL และ DML</p>
                    <p><span className="text-pink-400">CREATE TABLE</span> Students (</p>
                    <p className="pl-4">student_id <span className="text-emerald-400">VARCHAR(10)</span> <span className="text-amber-300">PRIMARY KEY</span>,</p>
                    <p className="pl-4">fullname <span className="text-emerald-400">VARCHAR(100)</span> <span className="text-amber-300">NOT NULL</span>,</p>
                    <p className="pl-4">department_id <span className="text-emerald-400">INT</span> <span className="text-amber-300">REFERENCES</span> Departments(id)</p>
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
            <div className="gw-panel gw-reveal rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b gw-divider pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl gw-badge flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--gw-text)]">AI Analysis Summary</h3>
                    <p className="text-[11px] text-[var(--gw-text-muted)]">วิเคราะห์เสร็จสมบูรณ์ • ความเชื่อมั่น 99%</p>
                  </div>
                </div>

                <span className="gw-positive text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  พร้อมสร้าง Mind Map
                </span>
              </div>

              {/* Document Overview */}
              <div>
                <h4 className="text-xs font-bold text-[var(--gw-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                  ภาพรวมเอกสาร (Overview)
                </h4>
                <p
                  className="text-xs sm:text-sm text-[var(--gw-text)] p-3.5 rounded-xl border gw-divider leading-relaxed"
                  style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
                >
                  {doc.overview}
                </p>
              </div>

              {/* Main Topics */}
              <div>
                <h4 className="text-xs font-bold text-[var(--gw-text-muted)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                  หัวข้อหลักที่ตรวจพบ (Main Topics)
                </h4>
                <div className="space-y-2">
                  {doc.topics?.map((topic, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl border gw-divider hover:border-[var(--gw-accent)]/50 transition-colors"
                      style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md gw-badge font-bold text-[11px] flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-[var(--gw-text)]">{topic}</span>
                      </div>
                      <span className="text-[10px] text-[var(--gw-text-muted)]">กิ่ง Mind Map</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <h4 className="text-xs font-bold text-[var(--gw-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                  คำสำคัญ (Keywords)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {doc.keywords?.map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleCopy(kw)}
                      className="gw-badge px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-[var(--gw-accent)] hover:text-white transition-colors flex items-center gap-1 group cursor-pointer"
                      title="คลิกเพื่อคัดลอก"
                    >
                      #{kw}
                      {copiedKeyword === kw ? (
                        <Check className="w-3 h-3 text-[var(--gw-positive)] group-hover:text-white" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Summary Points */}
              <div>
                <h4 className="text-xs font-bold text-[var(--gw-text-muted)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                  ประเด็นสรุปสาระสำคัญ (Key Takeaways)
                </h4>
                <div className="space-y-2">
                  {doc.summary?.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--gw-text)] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[var(--gw-positive)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Big CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateMindMap}
                  disabled={isGenerating}
                  className="gw-button-primary w-full py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
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
