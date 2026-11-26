'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity } from 'lucide-react';

type PeriodKey = '7d' | '30d' | '90d';

const PERIOD_DATA: Record<
  PeriodKey,
  { day: string; docs: number; maps: number; quizzes: number }[]
> = {
  '7d': [
    { day: 'จันทร์', docs: 2, maps: 1, quizzes: 3 },
    { day: 'อังคาร', docs: 4, maps: 3, quizzes: 5 },
    { day: 'พุธ', docs: 3, maps: 2, quizzes: 4 },
    { day: 'พฤหัส', docs: 6, maps: 4, quizzes: 7 },
    { day: 'ศุกร์', docs: 5, maps: 3, quizzes: 6 },
    { day: 'เสาร์', docs: 8, maps: 5, quizzes: 9 },
    { day: 'อาทิตย์', docs: 7, maps: 4, quizzes: 8 },
  ],
  '30d': [
    { day: 'สัปดาห์ 1', docs: 10, maps: 6, quizzes: 14 },
    { day: 'สัปดาห์ 2', docs: 14, maps: 9, quizzes: 19 },
    { day: 'สัปดาห์ 3', docs: 12, maps: 8, quizzes: 17 },
    { day: 'สัปดาห์ 4', docs: 18, maps: 12, quizzes: 24 },
  ],
  '90d': [
    { day: 'ส.ค.', docs: 24, maps: 15, quizzes: 34 },
    { day: 'ก.ย.', docs: 31, maps: 22, quizzes: 45 },
    { day: 'ต.ค.', docs: 42, maps: 28, quizzes: 58 },
  ],
};

const PERIOD_LABELS: { key: PeriodKey; label: string }[] = [
  { key: '7d', label: '7 วัน' },
  { key: '30d', label: '30 วัน' },
  { key: '90d', label: '90 วัน' },
];

export default function ActivityChart() {
  const [period, setPeriod] = useState<PeriodKey>('7d');
  const data = PERIOD_DATA[period];

  return (
    <div className="gw-panel rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--gw-accent-soft)] text-[var(--gw-accent)] border border-[var(--gw-border)] flex items-center justify-center shrink-0 mt-0.5">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--gw-text)] text-base">
              สถิติการเรียนรู้และการสรุปผล
            </h3>
            <p className="text-xs text-[var(--gw-text-muted)]">
              กิจกรรมการสร้าง Mind Map และทำแบบทดสอบ
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--gw-accent)]" />
              <span className="text-[var(--gw-text-muted)]">Mind Maps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--gw-positive)]" />
              <span className="text-[var(--gw-text-muted)]">แบบทดสอบ</span>
            </div>
          </div>

          <div
            className="gw-segment inline-flex items-center p-1 rounded-xl gap-1"
            role="tablist"
            aria-label="เลือกช่วงเวลา"
          >
            {PERIOD_LABELS.map((item) => {
              const active = period === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPeriod(item.key)}
                  className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    active
                      ? 'gw-segment-active'
                      : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gwColorMaps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--gw-accent)" stopOpacity={0.34} />
                <stop offset="95%" stopColor="var(--gw-accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gwColorQuizzes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--gw-positive)" stopOpacity={0.26} />
                <stop offset="95%" stopColor="var(--gw-positive)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gw-border)" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="var(--gw-text-subtle)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--gw-text-subtle)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(var(--gw-surface-rgb), 0.95)',
                borderColor: 'var(--gw-border)',
                color: 'var(--gw-text)',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: 'var(--gw-shadow)',
              }}
              labelStyle={{ color: 'var(--gw-text)', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="maps"
              name="Mind Maps"
              stroke="var(--gw-accent)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#gwColorMaps)"
            />
            <Area
              type="monotone"
              dataKey="quizzes"
              name="แบบทดสอบ"
              stroke="var(--gw-positive)"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#gwColorQuizzes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
