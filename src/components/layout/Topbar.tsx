'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  User,
  Settings,
  LogOut,
  FileText,
  GitFork,
  X,
  CheckCircle2,
  BrainCircuit,
  SlidersHorizontal,
  Sun,
  Moon,
  RotateCcw,
} from 'lucide-react';
import { mockUser, mockNotifications } from '@/data/mockUser';
import { mockDocuments } from '@/data/mockDocuments';
import { mockMindMapsList } from '@/data/mockMindMaps';
import {
  GLASS_LIMITS,
  GLASS_PRESETS,
  getMatchingPreset,
  type GlassPresetName,
  useGlass,
} from '@/components/layout/GlassContext';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  onOpenHelp: () => void;
}

const TINT_SWATCHES = [
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Rose', hex: '#f43f5e' },
] as const;

export default function Topbar({ onToggleMobileMenu, onOpenHelp }: TopbarProps) {
  const router = useRouter();
  const {
    glass,
    updateGlass,
    resetGlass,
    theme,
    toggleTheme,
    notificationsOpen,
    setNotificationsOpen,
    settingsOpen,
    setSettingsOpen,
  } = useGlass();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Glass appearance popover state
  const glassPopoverRef = useRef<HTMLDivElement>(null);
  const activePreset = getMatchingPreset(glass);

  // Notification state
  const [notifications, setNotifications] = useState(mockNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile menu state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside & Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (glassPopoverRef.current && !glassPopoverRef.current.contains(target)) {
        setSettingsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSettingsOpen(false);
        setNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setNotificationsOpen, setSettingsOpen]);

  // Filtered search results
  const filteredDocs = searchQuery.trim()
    ? mockDocuments.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredMindMaps = searchQuery.trim()
    ? mockMindMapsList.filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handlePreset = (name: GlassPresetName) => {
    updateGlass(GLASS_PRESETS[name]);
  };

  const handleResetGlass = () => {
    resetGlass();
  };

  return (
    <header className="gw-topbar gw-glass rounded-2xl px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3 relative z-30">
      {/* Left: Mobile Menu + Brand Logo */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden gw-button min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--gw-accent)] text-white flex items-center justify-center shadow-xs shrink-0 transition-transform duration-200 group-hover:scale-105">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--gw-text)] whitespace-nowrap">
              MindMap <span className="text-[var(--gw-accent)]">AI</span>
            </span>
            <span
              aria-hidden="true"
              className="hidden sm:inline-block w-px h-4 bg-[var(--gw-border-strong)]"
            />
            <span className="hidden sm:inline-block text-xs font-medium text-[var(--gw-text-muted)] truncate">
              Personal workspace
            </span>
          </div>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div ref={searchRef} className="relative hidden md:block">
          <div className="gw-search relative flex items-center rounded-xl">
            <Search className="w-3.5 h-3.5 text-[var(--gw-text-muted)] absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาเอกสาร, Mind Map..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              aria-label="Search documents and mind maps"
              className="w-44 lg:w-60 h-9 pl-8 pr-7 text-xs bg-transparent text-[var(--gw-text)] placeholder:text-[var(--gw-text-subtle)] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2 p-0.5 text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="gw-popover absolute right-0 mt-2 w-80 lg:w-96 rounded-2xl overflow-hidden z-50">
              <div className="px-3.5 py-2.5 border-b border-[var(--gw-border)] flex items-center justify-between text-xs text-[var(--gw-text-muted)]">
                <span>ผลการค้นหาสำหรับ &ldquo;{searchQuery}&rdquo;</span>
                <span>{filteredDocs.length + filteredMindMaps.length} รายการ</span>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-3">
                {filteredDocs.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--gw-text-muted)] uppercase px-2 mb-1">
                      เอกสาร (Documents)
                    </p>
                    {filteredDocs.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          router.push(`/documents/${doc.id}/analyze`);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--gw-accent-soft)] text-left transition-colors group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--gw-accent-soft)] text-[var(--gw-accent)] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[var(--gw-text)] group-hover:text-[var(--gw-accent)] truncate">
                            {doc.name}
                          </p>
                          <p className="text-[11px] text-[var(--gw-text-muted)]">
                            {doc.fileSize} • {doc.pageCount} หน้า
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredMindMaps.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--gw-text-muted)] uppercase px-2 mb-1">
                      แผนผังความคิด (Mind Maps)
                    </p>
                    {filteredMindMaps.map((map) => (
                      <button
                        key={map.id}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          router.push(`/mindmaps/${map.id}`);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--gw-accent-soft)] text-left transition-colors group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--gw-accent-soft)] text-[var(--gw-accent)] flex items-center justify-center shrink-0">
                          <GitFork className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[var(--gw-text)] group-hover:text-[var(--gw-accent)] truncate">
                            {map.title}
                          </p>
                          <p className="text-[11px] text-[var(--gw-text-muted)]">
                            {map.nodeCount} โหนด • {map.documentName}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredDocs.length === 0 && filteredMindMaps.length === 0 && (
                  <div className="py-6 text-center text-xs text-[var(--gw-text-muted)]">
                    ไม่พบข้อมูลที่ตรงกับคำค้นหา
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Adjust Glass Button & Popover */}
        <div ref={glassPopoverRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setSettingsOpen((prev) => !prev);
              setNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            aria-expanded={settingsOpen}
            aria-label="Adjust glass appearance"
            className={`gw-button min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:h-9 px-2.5 sm:px-3 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer ${
              settingsOpen ? 'ring-2 ring-[var(--gw-accent)]' : ''
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
            <span className="hidden sm:inline">Adjust glass</span>
          </button>

          {settingsOpen && (
            <div className="gw-popover fixed inset-x-3 top-[4.5rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-2xl p-4 z-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-[var(--gw-text)]">
                    Glass Appearance
                  </h3>
                  <p className="text-[11px] text-[var(--gw-text-muted)]">
                    ปรับแต่งความเบลอ แสงขอบ และโทนกระจก
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetGlass}
                  className="gw-button inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Presets */}
              <div className="gw-segment grid grid-cols-3 gap-1 rounded-xl p-1">
                {(['Clear', 'Frosted', 'Solid'] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className={`rounded-lg py-1.5 text-xs font-medium transition cursor-pointer ${
                      activePreset === preset
                        ? 'gw-segment-active text-white'
                        : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <div className="space-y-3 text-xs">
                <label className="block">
                  <div className="flex justify-between mb-1 text-[var(--gw-text-muted)]">
                    <span>Blur</span>
                    <span className="font-mono text-[var(--gw-text)]">{glass.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min={GLASS_LIMITS.blur.min}
                    max={GLASS_LIMITS.blur.max}
                    step={GLASS_LIMITS.blur.step}
                    value={glass.blur}
                    onChange={(e) => updateGlass({ blur: Number(e.target.value) })}
                    className="w-full accent-[var(--gw-accent)] cursor-pointer"
                  />
                </label>

                <label className="block">
                  <div className="flex justify-between mb-1 text-[var(--gw-text-muted)]">
                    <span>Opacity</span>
                    <span className="font-mono text-[var(--gw-text)]">
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
                </label>

                <label className="block">
                  <div className="flex justify-between mb-1 text-[var(--gw-text-muted)]">
                    <span>Saturation</span>
                    <span className="font-mono text-[var(--gw-text)]">{glass.saturation}%</span>
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
                </label>

                <label className="block">
                  <div className="flex justify-between mb-1 text-[var(--gw-text-muted)]">
                    <span>Edge light</span>
                    <span className="font-mono text-[var(--gw-text)]">
                      {Math.round(glass.edge * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={GLASS_LIMITS.edge.min}
                    max={GLASS_LIMITS.edge.max}
                    step={GLASS_LIMITS.edge.step}
                    value={glass.edge}
                    onChange={(e) => updateGlass({ edge: Number(e.target.value) })}
                    className="w-full accent-[var(--gw-accent)] cursor-pointer"
                  />
                </label>

                <label className="block">
                  <div className="flex justify-between mb-1 text-[var(--gw-text-muted)]">
                    <span>Tint strength</span>
                    <span className="font-mono text-[var(--gw-text)]">
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
                </label>
              </div>

              {/* Glass Tint Color Picker */}
              <div className="pt-2 border-t border-[var(--gw-border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--gw-text-muted)]">Glass tint color</span>
                  <span className="text-[11px] font-mono text-[var(--gw-text-subtle)]">{glass.tintColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {TINT_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => updateGlass({ tintColor: swatch.hex })}
                      aria-label={`Select ${swatch.name} glass tint`}
                      title={swatch.name}
                      style={{ backgroundColor: swatch.hex }}
                      className={`w-6 h-6 rounded-full border transition-transform cursor-pointer hover:scale-110 ${
                        glass.tintColor.toLowerCase() === swatch.hex.toLowerCase()
                          ? 'ring-2 ring-offset-1 ring-[var(--gw-text)] border-white'
                          : 'border-white/40'
                      }`}
                    />
                  ))}
                  <label
                    title="Custom tint color"
                    className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-[var(--gw-text-muted)] cursor-pointer"
                  >
                    <input
                      type="color"
                      value={glass.tintColor}
                      onChange={(e) => updateGlass({ tintColor: e.target.value })}
                      aria-label="Custom glass tint color"
                      className="w-6 h-6 rounded-md border border-[var(--gw-border)] bg-transparent cursor-pointer p-0"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Light / Dark Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
          className="gw-button min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-[var(--gw-text)] cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setSettingsOpen(false);
              setIsProfileOpen(false);
            }}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            title="การแจ้งเตือน"
            className="gw-button relative min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-[var(--gw-text)] cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 sm:top-2 sm:right-2 w-2 h-2 bg-[var(--gw-danger)] rounded-full ring-2 ring-[var(--gw-bg)]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="gw-popover fixed inset-x-3 top-[4.5rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-2xl z-50">
              <div className="p-3.5 border-b border-[var(--gw-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[var(--gw-text)]">การแจ้งเตือน</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-medium bg-[var(--gw-accent)] text-white px-2 py-0.5 rounded-full">
                      {unreadCount} ใหม่
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs text-[var(--gw-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    อ่านทั้งหมด
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[var(--gw-border)]">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 transition-colors flex gap-3 hover:bg-[var(--gw-accent-soft)]/50 ${
                      !item.read ? 'bg-[var(--gw-accent-soft)]/30' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                        !item.read ? 'bg-[var(--gw-accent)]' : 'bg-[var(--gw-text-subtle)]'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--gw-text)]">{item.title}</p>
                      <p className="text-xs text-[var(--gw-text-muted)] mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-[var(--gw-text-subtle)] mt-1.5 block">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Center Shortcut */}
        <button
          type="button"
          onClick={onOpenHelp}
          aria-label="Open help center"
          title="ช่วยเหลือและคู่มือ"
          className="gw-button hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-[var(--gw-text)] cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Avatar & Dropdown */}
        <div ref={profileRef} className="relative pl-0.5">
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setSettingsOpen(false);
              setNotificationsOpen(false);
            }}
            aria-label="Open user profile menu"
            aria-expanded={isProfileOpen}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 p-0.5 rounded-xl hover:bg-[var(--gw-accent-soft)] transition-colors cursor-pointer"
          >
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--gw-accent-soft)]"
            />
          </button>

          {isProfileOpen && (
            <div className="gw-popover fixed inset-x-3 top-[4.5rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-60 rounded-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-[var(--gw-border)]">
                <p className="text-sm font-semibold text-[var(--gw-text)]">{mockUser.name}</p>
                <p className="text-xs text-[var(--gw-text-muted)] truncate">{mockUser.email}</p>
                <div className="gw-badge mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md inline-block">
                  {mockUser.plan}
                </div>
              </div>

              <div className="p-2 space-y-1">
                <Link
                  href="/settings?tab=profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--gw-text-muted)] hover:bg-[var(--gw-accent-soft)] hover:text-[var(--gw-text)] rounded-xl transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  ข้อมูลส่วนตัว (Profile)
                </Link>
                <Link
                  href="/settings?tab=account"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--gw-text-muted)] hover:bg-[var(--gw-accent-soft)] hover:text-[var(--gw-text)] rounded-xl transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  การตั้งค่าบัญชี (Settings)
                </Link>
              </div>

              <div className="p-2 border-t border-[var(--gw-border)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    router.push('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--gw-danger)] hover:bg-[var(--gw-danger)]/10 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ (Sign Out)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
