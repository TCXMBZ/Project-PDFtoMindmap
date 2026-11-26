'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Shield,
  Palette,
  Sliders,
  Check,
  Save,
  HardDrive,
  Sparkles,
  Camera,
  Sun,
  Moon,
  RotateCcw,
  Image as ImageIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import {
  useGlass,
  GLASS_LIMITS,
  GLASS_PRESETS,
  getMatchingPreset,
  GlassPresetName,
} from '@/components/layout/GlassContext';
import { mockUser } from '@/data/mockUser';

type SettingsTab = 'profile' | 'account' | 'appearance' | 'preferences';

const WALLPAPER_PRESETS = [
  { label: 'Default Gradient', url: '' },
  {
    label: 'Emerald Mist',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Minimal Studio',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
  },
];

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get('tab');
  const initialTab: SettingsTab =
    initialTabParam === 'account' ||
    initialTabParam === 'appearance' ||
    initialTabParam === 'preferences'
      ? initialTabParam
      : 'profile';

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // Glass & Theme Context
  const {
    glass,
    updateGlass,
    resetGlass,
    theme,
    setTheme,
    backgroundImage,
    setBackgroundImage,
  } = useGlass();

  // Form State
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [institution, setInstitution] = useState('วิทยาลัยเทคนิค / สถาบันอาชีวศึกษา');
  const [bio, setBio] = useState('นักศึกษาระดับ ปวส. สาขาวิชาเทคโนโลยีสารสนเทศ');

  // Preferences State
  const [aiLanguage, setAiLanguage] = useState<'th' | 'en'>('th');
  const [autoSaveCanvas, setAutoSaveCanvas] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  // Feedback State
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'ข้อมูลส่วนตัว (Profile)', icon: User },
    { id: 'account', label: 'บัญชีและการจัดเก็บ (Account)', icon: Shield },
    { id: 'appearance', label: 'หน้าตาและกระจก (Appearance)', icon: Palette },
    { id: 'preferences', label: 'การตั้งค่าระบบ (Preferences)', icon: Sliders },
  ];

  const isPresetActive = (presetName: GlassPresetName) =>
    getMatchingPreset(glass) === presetName;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="gw-panel gw-reveal rounded-2xl p-5 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <span className="gw-badge inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full">
              <SettingsIcon className="w-3.5 h-3.5" />
              Workspace Settings
            </span>
            <h1 className="text-2xl font-extrabold text-[var(--gw-text)] mt-2 tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-sm text-[var(--gw-text-muted)] mt-1">
              จัดการโปรไฟล์ผู้ใช้งาน การจัดเก็บข้อมูล รูปแบบกระจก ธีม และการตั้งค่า AI
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="gw-segment gw-reveal flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                  isActive
                    ? 'gw-segment-active'
                    : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSave}
            className="gw-panel gw-reveal rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[var(--gw-border)]">
              <div className="relative w-20 h-20 shrink-0">
                <img
                  src={mockUser.avatar}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-[var(--gw-accent-soft)]"
                />
                <button
                  type="button"
                  onClick={() => alert('คลิกเพื่อเปลี่ยนรูปภาพประจำตัว')}
                  className="cursor-pointer absolute bottom-0 right-0 p-1.5 rounded-full gw-button-primary shadow-sm"
                  title="เปลี่ยนรูปภาพ"
                  aria-label="เปลี่ยนรูปภาพประจำตัว"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-base text-[var(--gw-text)]">{name}</h3>
                <p className="text-xs text-[var(--gw-text-muted)]">{email}</p>
                <div className="gw-badge mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  {mockUser.plan}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--gw-text-muted)]">
                  ชื่อ - นามสกุล
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[rgba(var(--gw-surface-rgb),0.55)] border border-[var(--gw-border)] rounded-xl text-[var(--gw-text)] focus:outline-none focus:border-[var(--gw-accent)]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--gw-text-muted)]">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[rgba(var(--gw-surface-rgb),0.55)] border border-[var(--gw-border)] rounded-xl text-[var(--gw-text)] focus:outline-none focus:border-[var(--gw-accent)]"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[var(--gw-text-muted)]">
                  สถาบัน / สถานศึกษา
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[rgba(var(--gw-surface-rgb),0.55)] border border-[var(--gw-border)] rounded-xl text-[var(--gw-text)] focus:outline-none focus:border-[var(--gw-accent)]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[var(--gw-text-muted)]">
                  ข้อมูลแนะนำตัวย่อ
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[rgba(var(--gw-surface-rgb),0.55)] border border-[var(--gw-border)] rounded-xl text-[var(--gw-text)] focus:outline-none focus:border-[var(--gw-accent)] resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--gw-border)] flex items-center justify-between gap-3 flex-wrap">
              {savedSuccess ? (
                <span className="text-xs font-semibold text-[var(--gw-positive)] flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!
                </span>
              ) : (
                <span className="text-xs text-[var(--gw-text-subtle)]">
                  แก้ไขข้อมูลแล้วกดปุ่มบันทึก
                </span>
              )}

              <button
                type="submit"
                className="cursor-pointer gw-button-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Account */}
        {activeTab === 'account' && (
          <div className="gw-panel gw-reveal rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[var(--gw-text)] flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[var(--gw-accent)]" />
                พื้นที่จัดเก็บเอกสาร (Cloud Storage)
              </h3>
              <div className="p-4 rounded-xl bg-[rgba(var(--gw-surface-rgb),0.5)] border border-[var(--gw-border)] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[var(--gw-text)]">
                    ใช้งานแล้ว {mockUser.storageUsed}
                  </span>
                  <span className="text-[var(--gw-text-muted)]">
                    จากทั้งหมด {mockUser.storageLimit}
                  </span>
                </div>
                <div className="w-full bg-[rgba(var(--gw-surface-rgb),0.6)] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--gw-accent)] h-full rounded-full"
                    style={{ width: '8.5%' }}
                  />
                </div>
                <p className="text-[11px] text-[var(--gw-text-muted)]">
                  เหลือพื้นที่อีก 457.5 MB สำหรับอัปโหลดเอกสาร PDF / DOCX
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--gw-border)] space-y-4">
              <h4 className="font-bold text-sm text-[var(--gw-text)]">
                ความปลอดภัยของบัญชี
              </h4>
              <button
                type="button"
                onClick={() => alert('เปิดหน้าต่างเปลี่ยนรหัสผ่านจำลอง')}
                className="cursor-pointer gw-button px-4 py-2 rounded-xl text-xs font-semibold"
              >
                เปลี่ยนรหัสผ่าน (Change Password)
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Glass & Theme Appearance */}
        {activeTab === 'appearance' && (
          <div className="gw-panel gw-reveal rounded-2xl p-6 sm:p-8 space-y-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-[var(--gw-text)]">
                  Glass & Theme Appearance
                </h3>
                <p className="text-xs text-[var(--gw-text-muted)] mt-0.5">
                  ปรับแต่งโหมดสี ความเบลอของกระจก ความโปร่งแสง และภาพพื้นหลังได้แบบเรียลไทม์
                </p>
              </div>
              <button
                type="button"
                onClick={resetGlass}
                className="cursor-pointer gw-button px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                รีเซ็ตค่าเริ่มต้น
              </button>
            </div>

            {/* Theme Mode */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-[var(--gw-text-muted)] uppercase tracking-wider">
                โหมดสี (Theme Mode)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`cursor-pointer p-4 rounded-xl border text-left flex items-center justify-between transition ${
                    theme === 'light'
                      ? 'border-[var(--gw-accent)] bg-[var(--gw-accent-soft)]'
                      : 'border-[var(--gw-border)] bg-[rgba(var(--gw-surface-rgb),0.45)] hover:border-[var(--gw-border-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[var(--gw-text)]">Light Mode</p>
                      <p className="text-[11px] text-[var(--gw-text-muted)] mt-0.5">
                        โทนสว่างอบอุ่น สบายตา
                      </p>
                    </div>
                  </div>
                  {theme === 'light' && (
                    <Check className="w-4 h-4 text-[var(--gw-accent)]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`cursor-pointer p-4 rounded-xl border text-left flex items-center justify-between transition ${
                    theme === 'dark'
                      ? 'border-[var(--gw-accent)] bg-[var(--gw-accent-soft)]'
                      : 'border-[var(--gw-border)] bg-[rgba(var(--gw-surface-rgb),0.45)] hover:border-[var(--gw-border-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[var(--gw-text)]">Dark Mode</p>
                      <p className="text-[11px] text-[var(--gw-text-muted)] mt-0.5">
                        โทนมืด Emerald-Slate ถนอมสายตา
                      </p>
                    </div>
                  </div>
                  {theme === 'dark' && (
                    <Check className="w-4 h-4 text-[var(--gw-accent)]" />
                  )}
                </button>
              </div>
            </div>

            {/* Glass Presets */}
            <div className="space-y-2.5 pt-4 border-t border-[var(--gw-border)]">
              <label className="text-xs font-semibold text-[var(--gw-text-muted)] uppercase tracking-wider">
                รูปแบบกระจกสำเร็จรูป (Glass Presets)
              </label>
              <div className="gw-segment inline-flex items-center p-1 rounded-xl gap-1">
                {(['Clear', 'Frosted', 'Solid'] as GlassPresetName[]).map((preset) => {
                  const active = isPresetActive(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => updateGlass(GLASS_PRESETS[preset])}
                      className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        active
                          ? 'gw-segment-active'
                          : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Glass Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[var(--gw-border)]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--gw-text)]">Blur (ความเบลอ)</span>
                  <span className="text-[var(--gw-text-muted)]">{glass.blur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={glass.blur}
                  onChange={(e) => updateGlass({ blur: Number(e.target.value) })}
                  className="w-full accent-[var(--gw-accent)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--gw-text)]">
                    Opacity (ความทึบผิว)
                  </span>
                  <span className="text-[var(--gw-text-muted)]">
                    {Math.round(glass.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={GLASS_LIMITS.opacity.min}
                  max={GLASS_LIMITS.opacity.max}
                  step={GLASS_LIMITS.opacity.step}
                  value={glass.opacity}
                  onChange={(e) => updateGlass({ opacity: Number(e.target.value) })}
                  className="w-full accent-[var(--gw-accent)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--gw-text)]">
                    Saturation (ความอิ่มสี)
                  </span>
                  <span className="text-[var(--gw-text-muted)]">{glass.saturation}%</span>
                </div>
                <input
                  type="range"
                  min={GLASS_LIMITS.saturation.min}
                  max={GLASS_LIMITS.saturation.max}
                  step={GLASS_LIMITS.saturation.step}
                  value={glass.saturation}
                  onChange={(e) => updateGlass({ saturation: Number(e.target.value) })}
                  className="w-full accent-[var(--gw-accent)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--gw-text)]">
                    Tint Strength (สีเคลือบกระจก)
                  </span>
                  <span className="text-[var(--gw-text-muted)]">
                    {Math.round(glass.tint * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={GLASS_LIMITS.tint.min}
                  max={GLASS_LIMITS.tint.max}
                  step={GLASS_LIMITS.tint.step}
                  value={glass.tint}
                  onChange={(e) => updateGlass({ tint: Number(e.target.value) })}
                  className="w-full accent-[var(--gw-accent)] cursor-pointer"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--gw-text)]">
                    Edge Highlight (แสงขอบกระจก)
                  </span>
                  <span className="text-[var(--gw-text-muted)]">
                    {Math.round(glass.edge * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={glass.edge}
                  onChange={(e) => updateGlass({ edge: Number(e.target.value) })}
                  className="w-full accent-[var(--gw-accent)] cursor-pointer"
                />
              </div>
            </div>

            {/* Background URL */}
            <div className="space-y-3 pt-4 border-t border-[var(--gw-border)]">
              <label className="text-xs font-semibold text-[var(--gw-text)] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[var(--gw-accent)]" />
                Background Wallpaper URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="url"
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  placeholder="วาง URL รูปภาพพื้นหลัง หรือเว้นว่างเพื่อใช้ Gradient เริ่มต้น"
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[rgba(var(--gw-surface-rgb),0.55)] border border-[var(--gw-border)] rounded-xl text-[var(--gw-text)] placeholder:text-[var(--gw-text-subtle)] focus:outline-none focus:border-[var(--gw-accent)]"
                />
                {backgroundImage && (
                  <button
                    type="button"
                    onClick={() => setBackgroundImage('')}
                    className="cursor-pointer gw-button px-4 py-2 rounded-xl text-xs font-semibold shrink-0"
                  >
                    ล้างพื้นหลัง
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {WALLPAPER_PRESETS.map((wp) => {
                  const active = backgroundImage === wp.url;
                  return (
                    <button
                      key={wp.label}
                      type="button"
                      onClick={() => setBackgroundImage(wp.url)}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        active
                          ? 'border-[var(--gw-accent)] bg-[var(--gw-accent-soft)] text-[var(--gw-accent)]'
                          : 'border-[var(--gw-border)] bg-[rgba(var(--gw-surface-rgb),0.45)] text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                      }`}
                    >
                      {wp.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Info */}
            <div className="pt-4 border-t border-[var(--gw-border)] space-y-2">
              <label className="text-xs font-semibold text-[var(--gw-text-muted)]">
                ฟอนต์หลักที่ใช้ในระบบ
              </label>
              <div className="p-3 bg-[rgba(var(--gw-surface-rgb),0.5)] rounded-xl text-xs text-[var(--gw-text-muted)] border border-[var(--gw-border)]">
                <strong className="text-[var(--gw-text)]">Sarabun</strong> (ภาษาไทย) &{' '}
                <strong className="text-[var(--gw-text)]">Inter</strong> (ภาษาอังกฤษ / โค้ด)
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Preferences */}
        {activeTab === 'preferences' && (
          <div className="gw-panel gw-reveal rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-bold text-base text-[var(--gw-text)]">
              การตั้งค่าการทำงานของ AI
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[rgba(var(--gw-surface-rgb),0.5)] border border-[var(--gw-border)]">
                <div>
                  <p className="font-bold text-[var(--gw-text)]">
                    ภาษาหลักในการสรุปเนื้อหา
                  </p>
                  <p className="text-[11px] text-[var(--gw-text-muted)] mt-0.5">
                    ภาษาที่ AI จะใช้สร้าง Mind Map และข้อความสรุป
                  </p>
                </div>
                <select
                  value={aiLanguage}
                  onChange={(e) => setAiLanguage(e.target.value as 'th' | 'en')}
                  className="cursor-pointer px-3 py-1.5 rounded-lg bg-[rgba(var(--gw-surface-rgb),0.8)] border border-[var(--gw-border)] font-semibold text-[var(--gw-accent)] focus:outline-none"
                >
                  <option value="th">ภาษาไทย (Thai)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[rgba(var(--gw-surface-rgb),0.5)] border border-[var(--gw-border)]">
                <div>
                  <p className="font-bold text-[var(--gw-text)]">
                    บันทึกการลากโหนดอัตโนมัติ (Auto-save Canvas)
                  </p>
                  <p className="text-[11px] text-[var(--gw-text-muted)] mt-0.5">
                    บันทึกตำแหน่งโหนดทุกครั้งที่มีการขยับ
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSaveCanvas}
                  onChange={(e) => setAutoSaveCanvas(e.target.checked)}
                  className="w-4 h-4 accent-[var(--gw-accent)] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[rgba(var(--gw-surface-rgb),0.5)] border border-[var(--gw-border)]">
                <div>
                  <p className="font-bold text-[var(--gw-text)]">การแจ้งเตือนทางอีเมล</p>
                  <p className="text-[11px] text-[var(--gw-text-muted)] mt-0.5">
                    รับสรุปผลคะแนนแบบทดสอบและการแชร์ไฟล์
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 accent-[var(--gw-accent)] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--gw-border)] flex items-center justify-between gap-3">
              {savedSuccess ? (
                <span className="text-xs font-semibold text-[var(--gw-positive)] flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  บันทึกการตั้งค่าเรียบร้อยแล้ว!
                </span>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => {
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }}
                className="cursor-pointer gw-button-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[var(--gw-text-muted)]">
          กำลังโหลดการตั้งค่า...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
