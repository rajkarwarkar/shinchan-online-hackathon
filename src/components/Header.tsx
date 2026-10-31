'use client';

import React from 'react';
import { Radar, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHowItWorks }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20">
            <Radar className="w-5 h-5 text-white animate-spin [animation-duration:8s]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Dark<span className="text-indigo-400">Spot</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                AI Intelligence
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Information Gap & Contradiction Detection Platform
            </p>
          </div>
        </div>

        {/* Hackathon Badge & Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Shinchan Hackathon 2026</span>
          </div>

          <button
            onClick={onOpenHowItWorks}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Why Gaps Matter</span>
          </button>

          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Traceable Evidence</span>
          </div>
        </div>

      </div>
    </header>
  );
};

