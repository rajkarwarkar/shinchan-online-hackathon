'use client';

import React from 'react';
import { ArrowRight, Radar } from 'lucide-react';

interface CosmicNavbarProps {
  onOpenHowItWorks?: () => void;
  onScrollToRadar?: () => void;
}

export const CosmicNavbar: React.FC<CosmicNavbarProps> = ({
  onOpenHowItWorks,
  onScrollToRadar
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-md bg-[#050508]/80 border-b border-purple-500/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo DarkSpot AI */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <Radar className="w-4 h-4 text-white animate-spin [animation-duration:12s]" />
          </div>
          <div className="flex flex-col -space-y-0.5">
            <div className="flex items-center space-x-1">
              <span className="text-base font-black text-white group-hover:text-purple-200 transition-colors">
                Dark<span className="text-purple-400">Spot</span>
              </span>
              <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 font-mono tracking-wider">
              Gap & Contradiction Radar
            </span>
          </div>
        </div>

        {/* Center: Sleek Navbar Pill Menu */}
        <nav className="hidden md:flex items-center p-1 rounded-full bg-[#120826]/80 border border-purple-500/20 shadow-inner">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white bg-purple-600/30 border border-purple-400/40 shadow-sm"
          >
            Home
          </button>
          
          <button
            onClick={() => scrollTo('about')}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            About
          </button>

          <button
            onClick={() => scrollTo('capabilities')}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Capabilities
          </button>

          <button
            onClick={() => scrollTo('benchmarks')}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Benchmarks
          </button>

          <button
            onClick={() => scrollTo('radar')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300 hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>Live Radar</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Rubric & Methodology
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              if (onScrollToRadar) {
                onScrollToRadar();
              } else {
                scrollTo('radar');
              }
            }}
            className="px-4 py-2 rounded-full text-xs font-semibold text-white btn-cosmic-purple flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
          >
            <span>Launch Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
