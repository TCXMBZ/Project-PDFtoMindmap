'use client';

import React, { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Download,
  Moon,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  TrendingUp,
} from 'lucide-react';
import {
  GLASS_LIMITS,
  GLASS_PRESETS,
  getMatchingPreset,
  type GlassPresetName,
  useGlass,
} from '@/components/layout/GlassContext';

gsap.registerPlugin(useGSAP);

interface MetricRow {
  label: string;
  value: string;
  delta: string;
  category: string;
}

const SAMPLE_METRICS: MetricRow[] = [
  { label: 'เอกสารที่สรุปแล้ว', value: '128', delta: '+14.2%', category: 'Documents' },
  { label: 'แผนผังความคิด', value: '64', delta: '+9.8%', category: 'MindMaps' },
  { label: 'โหนดความรู้ทั้งหมด', value: '2,480', delta: '+22.4%', category: 'Nodes' },
  { label: 'เวลาที่ประหยัดได้', value: '42.5 ชม.', delta: '+18.0%', category: 'Efficiency' },
];

export function AdjustableGlassDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { glass, updateGlass, resetGlass, theme, toggleTheme } = useGlass();
  const [query, setQuery] = useState('');
  const activePreset = getMatchingPreset(glass);

  useGSAP(
    () => {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }
      gsap.from('.gw-reveal', {
        y: 14,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    },
    { scope: containerRef }
  );

  const filteredMetrics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_METRICS;
    return SAMPLE_METRICS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q)
    );
  }, [query]);

  const handlePreset = (name: GlassPresetName) => {
    updateGlass(GLASS_PRESETS[name]);
  };

  const handleExportCsv = () => {
    const header = ['Label', 'Value', 'Delta', 'Category'].join(',');
    const rows = filteredMetrics.map((m) =>
      [m.label, m.value, m.delta, m.category].map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    );
    const csv = [header, ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'glass-dashboard-metrics.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={containerRef} className="space-y-5">
      {/* Header Bar */}
      <div className="gw-panel gw-reveal flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gw-accent-soft)] text-[var(--gw-accent)]">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--gw-text)]">
              Adjustable Glass Dashboard
            </h2>
            <p className="text-xs text-[var(--gw-text-muted)]">
              ปรับแต่งความเบลอ ความโปร่งแสง และโทนสีแบบเรียลไทม์
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="gw-search flex items-center gap-2 rounded-xl px-3 py-1.5">
            <Search className="h-4 w-4 text-[var(--gw-text-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาตัวชี้วัด..."
              className="w-36 bg-transparent text-xs text-[var(--gw-text)] placeholder:text-[var(--gw-text-subtle)] focus:outline-none sm:w-44"
            />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="gw-button inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="gw-button inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Presets & Sliders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="gw-glass gw-reveal rounded-2xl p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--gw-text)]">
              <Sparkles className="h-4 w-4 text-[var(--gw-accent)]" />
              Glass Presets
            </span>
            <button
              type="button"
              onClick={resetGlass}
              className="gw-button inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="gw-segment mb-5 grid grid-cols-3 gap-1 rounded-xl p-1">
            {(['Clear', 'Frosted', 'Solid'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  activePreset === preset
                    ? 'gw-segment-active'
                    : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="space-y-3.5 text-xs">
            <label className="block">
              <div className="mb-1 flex justify-between text-[var(--gw-text-muted)]">
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
                className="w-full cursor-pointer accent-[var(--gw-accent)]"
              />
            </label>

            <label className="block">
              <div className="mb-1 flex justify-between text-[var(--gw-text-muted)]">
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
                className="w-full cursor-pointer accent-[var(--gw-accent)]"
              />
            </label>

            <label className="block">
              <div className="mb-1 flex justify-between text-[var(--gw-text-muted)]">
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
                className="w-full cursor-pointer accent-[var(--gw-accent)]"
              />
            </label>

            <label className="block">
              <div className="mb-1 flex justify-between text-[var(--gw-text-muted)]">
                <span>Tint</span>
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
                className="w-full cursor-pointer accent-[var(--gw-accent)]"
              />
            </label>

            <label className="block">
              <div className="mb-1 flex justify-between text-[var(--gw-text-muted)]">
                <span>Edge Highlight</span>
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
                className="w-full cursor-pointer accent-[var(--gw-accent)]"
              />
            </label>
          </div>
        </div>

        {/* Live Metric Preview Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          {filteredMetrics.map((metric) => (
            <div
              key={metric.label}
              className="gw-glass gw-reveal flex flex-col justify-between rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--gw-text-muted)]">
                  {metric.category}
                </span>
                <span className="gw-positive inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
                  <TrendingUp className="h-3 w-3" />
                  {metric.delta}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold tracking-tight text-[var(--gw-text)]">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm text-[var(--gw-text-muted)]">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdjustableGlassDashboard;
