/*
 * From Uiverse.io by vamsidevendrakumar - https://uiverse.io/vamsidevendrakumar/soft-shrimp-94
 * MIT License, Copyright (c) vamsidevendrakumar (Vamsi Devendra Kumar)
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  User,
  CheckCircle2,
  Loader2,
  RotateCw,
} from 'lucide-react';
import { mockUser } from '@/data/mockUser';

export default function FlipAuthCard() {
  const router = useRouter();

  const [isFlipped, setIsFlipped] = useState(false);

  // Login State (Front Side)
  const [loginEmail, setLoginEmail] = useState(mockUser.email);
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);

  // Register State (Back Side)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  // Shared Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFlip = (toRegister: boolean) => {
    setErrorMsg('');
    setForgotSent(false);
    setIsFlipped(toRegister);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 650);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('กรุณากรอกข้อมูลการสมัครให้ครบทุกช่อง');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 650);
  };

  const handleDemoLogin = () => {
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 550);
  };

  return (
    <div className={`uiverse-flip-card ${isFlipped ? 'is-flipped' : ''}`}>
      <div className="uiverse-flip-card-inner">
        {/* ================= FRONT SIDE: SIGN IN ================= */}
        <div
          className={`uiverse-flip-card-front gw-glass p-7 sm:p-9 flex flex-col justify-between ${
            isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <div>
            {/* Card Top Bar */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--gw-accent)] text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
                Sign In • เข้าสู่ระบบ
              </span>
              <button
                type="button"
                onClick={() => handleFlip(true)}
                className="gw-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--gw-accent)] cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                สมัครสมาชิก
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-[var(--gw-text)]">ยินดีต้อนรับกลับมา!</h2>
              <p className="text-xs text-[var(--gw-text-muted)] mt-1">
                เข้าสู่พื้นที่ทำงาน MindMap AI ของคุณ
              </p>
            </div>

            {errorMsg && !isFlipped && (
              <div className="mb-4 p-2.5 rounded-xl bg-[var(--gw-danger)]/10 border border-[var(--gw-danger)]/30 text-xs font-medium text-[var(--gw-danger)]">
                {errorMsg}
              </div>
            )}

            {forgotSent && (
              <div className="mb-4 p-2.5 rounded-xl bg-[var(--gw-positive-bg)] border border-[var(--gw-positive)]/30 text-xs font-medium text-[var(--gw-positive)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                ส่งลิงก์รีเซ็ตรหัสผ่านจำลองไปยังอีเมลของคุณแล้ว
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--gw-text)]">อีเมลสถาบันการศึกษา</label>
                <div className="gw-search relative rounded-xl">
                  <Mail className="w-4 h-4 text-[var(--gw-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@college.ac.th"
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-transparent text-[var(--gw-text)] placeholder-[var(--gw-text-subtle)] focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--gw-text)]">รหัสผ่าน</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSent(true);
                      setTimeout(() => setForgotSent(false), 3000);
                    }}
                    className="text-[11px] font-semibold text-[var(--gw-accent)] hover:underline cursor-pointer"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
                <div className="gw-search relative rounded-xl">
                  <Lock className="w-4 h-4 text-[var(--gw-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านของคุณ"
                    className="w-full h-11 pl-10 pr-11 text-xs sm:text-sm bg-transparent text-[var(--gw-text)] placeholder-[var(--gw-text-subtle)] focus:outline-none rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] cursor-pointer"
                    aria-label={showLoginPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-[var(--gw-text-muted)] cursor-pointer select-none pt-0.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--gw-accent)] cursor-pointer"
                />
                จดจำการเข้าสู่ระบบไว้ในอุปกรณ์นี้
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="gw-button-primary group w-full h-11 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    <span>เข้าสู่ระบบ</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo & Flip Footer */}
          <div className="pt-4 mt-4 border-t border-[var(--gw-border)] space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="gw-button h-10 px-3 rounded-xl text-[11px] font-semibold text-[var(--gw-text)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                บัญชีนักศึกษา (Demo)
              </button>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="gw-button h-10 px-3 rounded-xl text-[11px] font-semibold text-[var(--gw-text)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-white text-[#4285F4] font-bold text-[10px] flex items-center justify-center shadow-2xs">
                  G
                </span>
                Google SSO
              </button>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE: REGISTER ================= */}
        <div
          className={`uiverse-flip-card-back gw-glass p-7 sm:p-9 flex flex-col justify-between ${
            isFlipped ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div>
            {/* Card Top Bar */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--secondary)] text-white shadow-xs">
                <User className="w-3 h-3" />
                Register • สมัครสมาชิก
              </span>
              <button
                type="button"
                onClick={() => handleFlip(false)}
                className="gw-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--gw-accent)] cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                กลับไปเข้าสู่ระบบ
              </button>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-extrabold text-[var(--gw-text)]">สร้างบัญชีนักศึกษาใหม่</h2>
              <p className="text-xs text-[var(--gw-text-muted)] mt-1">
                เริ่มต้นใช้งาน MindMap AI ฟรีสำหรับนักเรียนและนักศึกษา
              </p>
            </div>

            {errorMsg && isFlipped && (
              <div className="mb-3 p-2.5 rounded-xl bg-[var(--gw-danger)]/10 border border-[var(--gw-danger)]/30 text-xs font-medium text-[var(--gw-danger)]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--gw-text)]">ชื่อ - นามสกุล</label>
                <div className="gw-search relative rounded-xl">
                  <User className="w-4 h-4 text-[var(--gw-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="เช่น ธนพัฒน์ วงศ์สว่าง"
                    className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm bg-transparent text-[var(--gw-text)] placeholder-[var(--gw-text-subtle)] focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--gw-text)]">อีเมลสถาบันการศึกษา</label>
                <div className="gw-search relative rounded-xl">
                  <Mail className="w-4 h-4 text-[var(--gw-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="student@college.ac.th"
                    className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm bg-transparent text-[var(--gw-text)] placeholder-[var(--gw-text-subtle)] focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--gw-text)]">ตั้งรหัสผ่าน</label>
                <div className="gw-search relative rounded-xl">
                  <Lock className="w-4 h-4 text-[var(--gw-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    className="w-full h-10 pl-10 pr-11 text-xs sm:text-sm bg-transparent text-[var(--gw-text)] placeholder-[var(--gw-text-subtle)] focus:outline-none rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] cursor-pointer"
                    aria-label={showRegPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="gw-button-primary group w-full h-11 mt-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังสร้างบัญชี...
                  </>
                ) : (
                  <>
                    <span>สร้างบัญชีและเริ่มต้นใช้งาน</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 mt-4 border-t border-[var(--gw-border)] text-center text-[11px] text-[var(--gw-text-muted)]">
            มีบัญชีอยู่แล้ว?{' '}
            <button
              type="button"
              onClick={() => handleFlip(false)}
              className="font-bold text-[var(--gw-accent)] hover:underline cursor-pointer"
            >
              พลิกกลับไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
