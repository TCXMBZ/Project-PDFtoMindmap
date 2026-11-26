'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  BrainCircuit,
  Sparkles,
  GitFork,
  FileText,
  GraduationCap,
  Sun,
  Moon,
} from 'lucide-react';
import { useGlass } from '@/components/layout/GlassContext';
import FlipAuthCard from '@/components/auth/FlipAuthCard';

gsap.registerPlugin(useGSAP);

export default function LoginPage() {
  const { theme, toggleTheme } = useGlass();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.auth-panel',
        { y: 20, opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          clearProps: 'transform,opacity',
        }
      ).fromTo(
        '.auth-stagger',
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
        '-=0.4'
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="gw-root min-h-screen relative flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden"
    >
      {/* Ambient Floating Orbs */}
      <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="gw-orb gw-orb-1 -top-24 -left-24 w-[420px] h-[420px] sm:w-[560px] sm:h-[560px]"
          style={{
            background: `radial-gradient(circle, rgba(var(--gw-tint-rgb), ${
              theme === 'dark' ? '0.42' : '0.36'
            }) 0%, transparent 70%)`,
          }}
        />
        <div
          className="gw-orb gw-orb-2 top-1/4 -right-24 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px]"
          style={{
            background: `radial-gradient(circle, ${
              theme === 'dark' ? 'rgba(45, 212, 191, 0.28)' : 'rgba(20, 184, 166, 0.28)'
            } 0%, transparent 70%)`,
          }}
        />
        <div
          className="gw-orb gw-orb-3 -bottom-28 left-1/3 w-[400px] h-[400px] sm:w-[540px] sm:h-[540px]"
          style={{
            background: `radial-gradient(circle, ${
              theme === 'dark' ? 'rgba(99, 102, 241, 0.26)' : 'rgba(245, 158, 11, 0.24)'
            } 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Top Theme Toggle */}
      <div className="fixed top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="gw-glass w-10 h-10 rounded-2xl flex items-center justify-center text-[var(--gw-text)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          title={theme === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Auth Container */}
      <div className="relative z-10 w-full max-w-[1040px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Brand & Feature Showcase */}
        <div className="auth-panel lg:col-span-6 gw-glass rounded-3xl p-7 sm:p-9 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="auth-stagger flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[var(--gw-accent)] text-white flex items-center justify-center shadow-sm">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-[var(--gw-text)]">
                  MindMap <span className="text-[var(--gw-accent)]">AI</span>
                </h1>
                <p className="text-xs text-[var(--gw-text-muted)]">Smart Learning Workspace</p>
              </div>
            </div>

            {/* Headline */}
            <div className="auth-stagger mt-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--gw-accent-soft)] text-[var(--gw-accent)]">
                <Sparkles className="w-3.5 h-3.5" />
                สำหรับนักเรียน นักศึกษา และอาจารย์
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--gw-text)] leading-snug tracking-tight">
                สรุปรายงานและบทเรียนเป็นแผนผังความคิดด้วย AI
              </h2>
              <p className="text-xs sm:text-sm text-[var(--gw-text-muted)] leading-relaxed">
                อัปโหลดไฟล์ PDF, DOCX หรือ TXT เพื่อสกัดหัวข้อสำคัญ สร้าง Mind Map แบบโต้ตอบได้ พร้อมผู้ช่วยแชท AI และแบบทดสอบทบทวนความรู้
              </p>
            </div>

            {/* Feature Pills */}
            <div className="mt-7 space-y-3">
              <div className="auth-stagger flex items-center gap-3 p-3 rounded-2xl bg-[var(--gw-accent-soft)]/50 border border-[var(--gw-border)] hover:border-[var(--gw-accent)]/40 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[var(--gw-accent)]/15 text-[var(--gw-accent)] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--gw-text)]">วิเคราะห์เอกสารอัตโนมัติ</p>
                  <p className="text-[11px] text-[var(--gw-text-muted)]">สรุปเนื้อหา แยกประเด็นหลัก และคำสำคัญทันที</p>
                </div>
              </div>

              <div className="auth-stagger flex items-center gap-3 p-3 rounded-2xl bg-[var(--gw-accent-soft)]/50 border border-[var(--gw-border)] hover:border-[var(--gw-accent)]/40 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[var(--gw-accent)]/15 text-[var(--gw-accent)] flex items-center justify-center shrink-0">
                  <GitFork className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--gw-text)]">Mind Map Editor เต็มรูปแบบ</p>
                  <p className="text-[11px] text-[var(--gw-text-muted)]">ลาก ปรับแต่งสี เพิ่มกิ่งย่อย และส่งออกเป็น PNG / PDF</p>
                </div>
              </div>

              <div className="auth-stagger flex items-center gap-3 p-3 rounded-2xl bg-[var(--gw-accent-soft)]/50 border border-[var(--gw-border)] hover:border-[var(--gw-accent)]/40 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[var(--gw-accent)]/15 text-[var(--gw-accent)] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--gw-text)]">Study Center & AI Chat</p>
                  <p className="text-[11px] text-[var(--gw-text-muted)]">ถาม-ตอบเนื้อหา พร้อมทำ Quizzes และ Flashcards ทบทวนสอบ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-stagger mt-8 pt-4 border-t border-[var(--gw-border)] flex items-center justify-between text-[11px] text-[var(--gw-text-muted)]">
            <span>โครงงานระดับ ปวส.2 • UI/UX Prototype</span>
            <span className="font-semibold text-[var(--gw-accent)]">Student Plan Free</span>
          </div>
        </div>

        {/* Right: 3D Flip Auth Card (Uiverse.io soft-shrimp-94) */}
        <div className="auth-panel lg:col-span-6 flex items-stretch">
          <FlipAuthCard />
        </div>
      </div>
    </div>
  );
}
