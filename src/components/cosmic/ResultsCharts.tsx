'use client';

import React from 'react';

// 1. Traffic Wave Graph (320%)
export const TrafficWaveChart: React.FC = () => {
  return (
    <div className="w-full h-14 relative flex items-end">
      <svg viewBox="0 0 180 50" className="w-full h-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Fill under wave */}
        <path
          d="M 0 45 Q 30 40 50 30 T 90 25 T 130 14 T 180 4 L 180 50 L 0 50 Z"
          fill="url(#waveFill)"
        />
        {/* Glowing Wave Line */}
        <path
          d="M 0 45 Q 30 40 50 30 T 90 25 T 130 14 T 180 4"
          stroke="#c084fc"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Apex glowing point */}
        <circle cx="180" cy="4" r="3.5" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />
      </svg>
    </div>
  );
};

// 2. Bar Chart Histogram (200%)
export const ConversionsBarChart: React.FC = () => {
  const bars = [25, 40, 32, 60, 48, 75, 68, 92];
  return (
    <div className="w-full h-14 flex items-end justify-between gap-1.5 px-1">
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-500 hover:brightness-125"
          style={{
            height: `${height}%`,
            background: i >= 5 
              ? 'linear-gradient(to top, #7e22ce, #c084fc)' 
              : 'linear-gradient(to top, #3b0764, #9333ea)'
          }}
        />
      ))}
    </div>
  );
};

// 3. Circular Gauge (for ROAS & Retention)
export const CircularMetricGauge: React.FC<{ percentage: number; label?: string }> = ({ percentage }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
        {/* Track */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="rgba(168, 85, 247, 0.15)"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress Arc */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#c084fc"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
};

