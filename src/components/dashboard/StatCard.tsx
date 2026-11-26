'use client';

import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType?: 'positive' | 'neutral';
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  iconBg = 'bg-[var(--gw-accent-soft)]',
  iconColor = 'text-[var(--gw-accent)]',
}: StatCardProps) {
  return (
    <div className="gw-panel rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-[var(--gw-text-muted)] uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 border border-[var(--gw-border)]`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-[var(--gw-text)] tracking-tight">{value}</h3>
        <div className="mt-2.5 flex items-center flex-wrap gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${
              changeType === 'positive'
                ? 'gw-positive'
                : 'bg-[rgba(var(--gw-surface-rgb),0.6)] text-[var(--gw-text-muted)] border border-[var(--gw-border)]'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            {change}
          </span>
          <span className="text-[var(--gw-text-subtle)] text-[11px]">เทียบสัปดาห์ที่แล้ว</span>
        </div>
      </div>
    </div>
  );
}
