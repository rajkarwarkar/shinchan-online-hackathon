'use client';

import React from 'react';

export const NoirFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full p-2 sm:p-3 overflow-hidden bg-[#05030A]">
      {/* Outer Inset Frame (12px rounded contour) */}
      <div className="relative min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] w-full rounded-[28px] sm:rounded-[36px] border border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-hidden bg-[#05030A]">
        {/* Four Corner "+" and Star Glints Matching Art Direction */}
        {/* Top Left */}
        <div className="absolute top-3 left-4 z-40 pointer-events-none flex items-center space-x-1 text-[11px] font-mono text-zinc-500">
          <span className="text-white/60 font-black">+</span>
          <span className="text-[9px] text-zinc-600 tracking-widest pl-1 hidden md:inline">NOIR.FRAME.01</span>
        </div>

        {/* Top Right Star Glint */}
        <div className="absolute top-3 right-4 z-40 pointer-events-none flex items-center space-x-1 text-[11px] font-mono text-zinc-500">
          <span className="text-violet-400 text-xs animate-pulse">✦</span>
          <span className="text-white/60 font-black pl-1">+</span>
        </div>

        {/* Bottom Left Star Glint */}
        <div className="absolute bottom-3 left-4 z-40 pointer-events-none flex items-center space-x-1 text-[11px] font-mono text-zinc-500">
          <span className="text-white/60 font-black">+</span>
          <span className="text-amber-400/80 text-xs">✦</span>
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-3 right-4 z-40 pointer-events-none flex items-center space-x-1 text-[11px] font-mono text-zinc-500">
          <span className="text-[9px] text-zinc-600 tracking-widest pr-1 hidden md:inline">CHROME.SHINCHAN.2026</span>
          <span className="text-white/60 font-black">+</span>
        </div>

        {/* Vertical Section Indicator Dots on the Left Edge */}
        <div className="fixed left-5 sm:left-7 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden lg:flex flex-col items-center space-y-3">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#8B5CF6]" />
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

