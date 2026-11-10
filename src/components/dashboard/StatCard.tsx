'use client';

import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType?: 'positive' | 'neutral';
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  iconBg,
  iconColor
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E9E9F1] shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#85859A] uppercase tracking-wider">{title}</span>
        <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-[#202033] tracking-tight">{value}</h3>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={`inline-flex items-center gap-1 font-semibold ${
            changeType === 'positive' ? 'text-[#18A979]' : 'text-[#85859A]'
          }`}>
            <TrendingUp className="w-3.5 h-3.5" />
            {change}
          </span>
          <span className="text-[#85859A]">เปรียบเทียบสัปดาห์ที่แล้ว</span>
        </div>
      </div>
    </div>
  );
}

