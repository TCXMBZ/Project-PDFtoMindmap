'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { day: 'จันทร์', docs: 2, maps: 1, quizzes: 3 },
  { day: 'อังคาร', docs: 4, maps: 3, quizzes: 5 },
  { day: 'พุธ', docs: 3, maps: 2, quizzes: 4 },
  { day: 'พฤหัส', docs: 6, maps: 4, quizzes: 7 },
  { day: 'ศุกร์', docs: 5, maps: 3, quizzes: 6 },
  { day: 'เสาร์', docs: 8, maps: 5, quizzes: 9 },
  { day: 'อาทิตย์', docs: 7, maps: 4, quizzes: 8 }
];

export default function ActivityChart() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E9E9F1] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-bold text-[#202033] text-base">สถิติการเรียนรู้และการสรุปผล</h3>
          <p className="text-xs text-[#85859A]">กิจกรรมการสร้าง Mind Map และทำแบบทดสอบในรอบสัปดาห์</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6558E8]" />
            <span className="text-[#4A4A68]">Mind Maps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B7CF6]" />
            <span className="text-[#4A4A68]">แบบทดสอบ</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMaps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6558E8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6558E8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B7CF6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B7CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EFFF" vertical={false} />
            <XAxis dataKey="day" stroke="#85859A" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#85859A" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E9E9F1',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
            />
            <Area
              type="monotone"
              dataKey="maps"
              name="Mind Maps"
              stroke="#6558E8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMaps)"
            />
            <Area
              type="monotone"
              dataKey="quizzes"
              name="แบบทดสอบ"
              stroke="#8B7CF6"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorQuizzes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

