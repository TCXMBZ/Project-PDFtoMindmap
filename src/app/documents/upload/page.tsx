'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileCheck2,
  FileCode,
  Sparkles
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function DocumentUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setIsUploading(true);
    setUploadProgress(15);
    setIsCompleted(false);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsCompleted(true);
          return 100;
        }
        return prev + 20;
      });
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
    // Navigate to analyze page
    router.push('/documents/doc-1/analyze');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EFFF] text-[#6558E8] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Document Processing
          </div>
          <h1 className="text-3xl font-extrabold text-[#202033] tracking-tight">
            Upload Your Document
          </h1>
          <p className="text-sm text-[#85859A] max-w-lg mx-auto">
            อัปโหลดเอกสารของคุณเพื่อให้ AI วิเคราะห์เนื้อหา สกัดแนวคิดสำคัญ และเปลี่ยนเป็นแผนผังความคิด (Mind Map)
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl border border-[#E9E9F1] p-6 sm:p-8 shadow-xs">
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
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-[#6558E8] bg-[#F0EFFF]/30 scale-[0.99]'
                : 'border-[#E9E9F1] hover:border-[#6558E8]/60 hover:bg-[#F7F8FC]'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="font-bold text-base text-[#202033]">
              ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
            </h3>
            <p className="text-xs text-[#85859A] mt-1.5">
              รองรับไฟล์ <strong className="text-[#4A4A68]">PDF, DOCX, TXT</strong> (ขนาดไฟล์สูงสุด 25 MB)
            </p>

            <button
              type="button"
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-colors shadow-xs inline-flex items-center gap-2"
            >
              Browse Files
            </button>
          </div>

          {/* Sample quick upload chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#85859A]">หรือลองไฟล์ตัวอย่าง:</span>
            <button
              type="button"
              onClick={() => handleChooseSample('Database System.pdf', '3.8 MB')}
              className="px-2.5 py-1 rounded-lg bg-[#F7F8FC] border border-[#E9E9F1] text-[#4A4A68] hover:border-[#6558E8] hover:text-[#6558E8] transition-colors"
            >
              Database System.pdf (3.8 MB)
            </button>
            <button
              type="button"
              onClick={() => handleChooseSample('Network Fundamentals.pdf', '5.2 MB')}
              className="px-2.5 py-1 rounded-lg bg-[#F7F8FC] border border-[#E9E9F1] text-[#4A4A68] hover:border-[#6558E8] hover:text-[#6558E8] transition-colors"
            >
              Network Fundamentals.pdf (5.2 MB)
            </button>
          </div>

          {/* Upload Progress Preview */}
          {selectedFile && (
            <div className="mt-6 p-4 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1] animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#202033] truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-[#85859A]">{selectedFile.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#6558E8]">
                    {uploadProgress}%
                  </span>
                  {!isUploading && (
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadProgress(0);
                        setIsCompleted(false);
                      }}
                      className="p-1 rounded-md text-[#85859A] hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#E9E9F1] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#6558E8] to-[#8B7CF6] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              {isCompleted && (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#18A979]">
                  <CheckCircle2 className="w-4 h-4" />
                  อัปโหลดไฟล์เสร็จสมบูรณ์ พร้อมให้ AI วิเคราะห์
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-5 border-t border-[#E9E9F1] flex items-center justify-between">
            <Link
              href="/documents"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#85859A] hover:text-[#202033] hover:bg-[#F7F8FC] transition-colors"
            >
              Cancel
            </Link>

            <button
              onClick={handleStartAnalyze}
              disabled={!selectedFile || isUploading}
              className={`px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-2 ${
                selectedFile && !isUploading
                  ? 'bg-[#6558E8] hover:bg-[#5548D8] shadow-md cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
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
          <div className="bg-white p-4 rounded-2xl border border-[#E9E9F1] flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#202033]">1. สกัดเนื้อหาอัจฉริยะ</h4>
              <p className="text-[11px] text-[#85859A] mt-1 leading-relaxed">
                ระบบสกัดข้อความ โครงสร้างหัวข้อ และตารางข้อมูลอย่างแม่นยำ
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E9E9F1] flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#202033]">2. ค้นหาคีย์เวิร์ดสำคัญ</h4>
              <p className="text-[11px] text-[#85859A] mt-1 leading-relaxed">
                ประมวลผลความหมาย เชื่อมโยงคำศัพท์หลักและความสัมพันธ์ของหัวข้อย่อย
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E9E9F1] flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#202033]">3. ความเป็นส่วนตัว</h4>
              <p className="text-[11px] text-[#85859A] mt-1 leading-relaxed">
                ข้อมูลจำลองการทำงานภายในเบราว์เซอร์ ปลอดภัยและรวดเร็ว
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

