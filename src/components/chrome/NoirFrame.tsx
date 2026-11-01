'use client';

import React from 'react';

export const NoirFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full p-2 sm:p-3 bg-[#05030A] overflow-x-clip">
      {/* Outer Inset Frame (12px rounded contour) */}
      <div className="relative min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] w-full rounded-[28px] sm:rounded-[36px] border border-white/[0.08] shadow-2xl flex flex-col justify-between bg-[#05030A] overflow-x-clip">
        {/* Four Corner "+" and Star Glints Matching Art Direction */}
        {/* Top Left */}
        <div className="absolute top-3 left-4 z-40 pointer-events-none flex items-center space-x-1.5 text-xs font-mono text-zinc-400">
          <span className="text-white/70 font-black">+</span>
          <span className="text-xs text-zinc-500 font-mono tracking-wider pl-1 hidden md:inline">NOIR.FRAME.01</span>
        </div>

        {/* Top Right Star Glint */}
        <div className="absolute top-3 right-4 z-40 pointer-events-none flex items-center space-x-1.5 text-xs font-mono text-zinc-400">
          <span className="text-violet-400 text-xs animate-pulse">✦</span>
          <span className="text-white/70 font-black pl-1">+</span>
        </div>

        {/* Bottom Left Star Glint */}
        <div className="absolute bottom-3 left-4 z-40 pointer-events-none flex items-center space-x-1.5 text-xs font-mono text-zinc-400">
          <span className="text-white/70 font-black">+</span>
          <span className="text-amber-400/80 text-xs">✦</span>
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-3 right-4 z-40 pointer-events-none flex items-center space-x-1.5 text-xs font-mono text-zinc-400">
          <span className="text-xs text-zinc-500 font-mono tracking-wider pr-1 hidden md:inline">CHROME.SHINCHAN.2026</span>
          <span className="text-white/70 font-black">+</span>
        </div>



        {/* Content Wrapper */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

