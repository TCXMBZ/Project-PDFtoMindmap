'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function DocumentUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
        uploadIntervalRef.current = null;
      }
    };
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setSelectedFile({
        name: file.name,
        size: sizeMB,
        type: file.name.split('.').pop() || 'pdf'
      });
      simulateUpload();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setSelectedFile({
        name: file.name,
        size: sizeMB,
        type: file.name.split('.').pop() || 'pdf'
      });
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }

    let currentProgress = 15;
    setIsUploading(true);
    setUploadProgress(currentProgress);
    setIsCompleted(false);

    uploadIntervalRef.current = setInterval(() => {
      currentProgress = Math.min(100, currentProgress + 20);
      setUploadProgress(currentProgress);

      if (currentProgress >= 100) {
        if (uploadIntervalRef.current) {
          clearInterval(uploadIntervalRef.current);
          uploadIntervalRef.current = null;
        }
        setIsUploading(false);
        setIsCompleted(true);
      }
    }, 250);
  };

  const handleChooseSample = (sampleName: string, size: string) => {
    setSelectedFile({
      name: sampleName,
      size: size,
      type: sampleName.split('.').pop() || 'pdf'
    });
    simulateUpload();
  };

  const handleStartAnalyze = () => {
    router.push('/documents/doc-1/analyze');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="gw-reveal text-center space-y-2">
          <div className="gw-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Document Processing
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--gw-text)] tracking-tight">
            Upload Your Document
          </h1>
          <p className="text-sm text-[var(--gw-text-muted)] max-w-lg mx-auto">
            อัปโหลดเอกสารของคุณเพื่อให้ AI วิเคราะห์เนื้อหา สกัดแนวคิดสำคัญ และเปลี่ยนเป็นแผนผังความคิด (Mind Map)
          </p>
        </div>

        {/* Upload Card */}
        <div className="gw-panel gw-reveal rounded-2xl p-6 sm:p-8">
          {/* Hidden real file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />

          {/* Drag & Drop Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition duration-200 group ${
              isDragging
                ? 'border-[var(--gw-accent)] bg-[var(--gw-accent-soft)] scale-[0.99]'
                : 'border-[var(--gw-border-strong)] hover:border-[var(--gw-accent)] hover:bg-[var(--gw-accent-soft)]/40'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl gw-badge flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="font-bold text-base text-[var(--gw-text)]">
              ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
            </h3>
            <p className="text-xs text-[var(--gw-text-muted)] mt-1.5">
              รองรับไฟล์ <strong className="text-[var(--gw-text)]">PDF, DOCX, TXT</strong> (ขนาดไฟล์สูงสุด 25 MB)
            </p>

            <button
              type="button"
              className="gw-button-primary mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              Browse Files
            </button>
          </div>

          {/* Sample quick upload chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[var(--gw-text-muted)]">หรือลองไฟล์ตัวอย่าง:</span>
            <button
              type="button"
              onClick={() => handleChooseSample('Database System.pdf', '3.8 MB')}
              className="gw-button px-2.5 py-1 rounded-lg text-[var(--gw-text)] hover:text-[var(--gw-accent)] cursor-pointer"
            >
              Database System.pdf (3.8 MB)
            </button>
            <button
              type="button"
              onClick={() => handleChooseSample('Network Fundamentals.pdf', '5.2 MB')}
              className="gw-button px-2.5 py-1 rounded-lg text-[var(--gw-text)] hover:text-[var(--gw-accent)] cursor-pointer"
            >
              Network Fundamentals.pdf (5.2 MB)
            </button>
          </div>

          {/* Upload Progress Preview */}
          {selectedFile && (
            <div className="mt-6 p-4 rounded-xl gw-glass animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg gw-badge flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--gw-text)] truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-[var(--gw-text-muted)]">{selectedFile.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[var(--gw-accent)]">
                    {uploadProgress}%
                  </span>
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadProgress(0);
                        setIsCompleted(false);
                      }}
                      className="p-1 rounded-md text-[var(--gw-text-muted)] hover:text-[var(--gw-danger)] cursor-pointer"
                      aria-label="ลบไฟล์ที่เลือก"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(var(--gw-surface-rgb), 0.5)' }}
              >
                <div
                  className="h-full transition-[width] duration-300 ease-out rounded-full"
                  style={{
                    width: `${uploadProgress}%`,
                    background: 'var(--gw-accent)'
                  }}
                />
              </div>

              {isCompleted && (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[var(--gw-positive)]">
                  <CheckCircle2 className="w-4 h-4" />
                  อัปโหลดไฟล์เสร็จสมบูรณ์ พร้อมให้ AI วิเคราะห์
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-5 border-t gw-divider flex items-center justify-between">
            <Link
              href="/documents"
              className="gw-button px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleStartAnalyze}
              disabled={!selectedFile || isUploading}
              className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                selectedFile && !isUploading
                  ? 'gw-button-primary shadow-md cursor-pointer'
                  : 'opacity-45 cursor-not-allowed gw-button'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Analyze Document
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="gw-panel gw-reveal p-4 rounded-2xl flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-500 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[var(--gw-text)]">1. สกัดเนื้อหาอัจฉริยะ</h4>
              <p className="text-[11px] text-[var(--gw-text-muted)] mt-1 leading-relaxed">
                ระบบสกัดข้อความ โครงสร้างหัวข้อ และตารางข้อมูลอย่างแม่นยำ
              </p>
            </div>
          </div>

          <div className="gw-panel gw-reveal p-4 rounded-2xl flex gap-3">
            <div className="w-9 h-9 rounded-xl gw-badge flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[var(--gw-text)]">2. ค้นหาคีย์เวิร์ดสำคัญ</h4>
              <p className="text-[11px] text-[var(--gw-text-muted)] mt-1 leading-relaxed">
                ประมวลผลความหมาย เชื่อมโยงคำศัพท์หลักและความสัมพันธ์ของหัวข้อย่อย
              </p>
            </div>
          </div>

          <div className="gw-panel gw-reveal p-4 rounded-2xl flex gap-3">
            <div className="w-9 h-9 rounded-xl gw-positive flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[var(--gw-text)]">3. ความเป็นส่วนตัว</h4>
              <p className="text-[11px] text-[var(--gw-text-muted)] mt-1 leading-relaxed">
                ข้อมูลจำลองการทำงานภายในเบราว์เซอร์ ปลอดภัยและรวดเร็ว
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
