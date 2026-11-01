'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { DarkSpotOrb } from './DarkSpotOrb';
import { 
  Sparkles, 
  HelpCircle, 
  Download, 
  RotateCcw, 
  CheckSquare2, 
  FileCheck2, 
  ShieldAlert,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface FloatingNavProps {
  currentView: 'landing' | 'workspace' | 'dashboard';
  onNavigate: (view: 'landing' | 'workspace' | 'dashboard') => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ currentView, onNavigate }) => {
  const { 
    isSampleMode, 
    loadSampleMode, 
    resetSession,
    setIsWhyGapsModalOpen,
    setIsExportModalOpen,
    report,
    activeTab,
    setActiveTab
  } = useDarkSpotStore();

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-8 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Top-Left: Wordmark with ® and DarkSpot Orb */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <DarkSpotOrb size={34} pulse={true} />
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="font-display text-sm sm:text-base font-black tracking-wider text-white group-hover:text-violet-300 transition-colors">
                DARK SPOT<sup className="text-[10px] text-violet-400 font-mono ml-0.5">®</sup>
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-[0.16em] uppercase text-zinc-500 hidden sm:inline">
              Information Gap Sentinel
            </span>
          </div>
        </div>

        {/* Center: Floating Segmented-Pill Nav (Glass with Hairline Dividers) */}
        <nav className="noir-panel rounded-full px-1.5 py-1 flex items-center space-x-0.5 border border-white/10 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-white/15 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            OVERVIEW
          </button>

          <span className="text-white/15 select-none font-thin">|</span>

          <button
            onClick={() => onNavigate('workspace')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
              currentView === 'workspace'
                ? 'bg-violet-600/50 text-white font-bold shadow-sm shadow-violet-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            WORKSPACE
          </button>

          <span className="text-white/15 select-none font-thin">|</span>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
              currentView === 'dashboard'
                ? 'bg-white/15 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>AUDIT REPORT</span>
            {report && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-violet-500/30 text-violet-300 border border-violet-500/40">
                {report.completenessIndex}%
              </span>
            )}
          </button>

          <span className="text-white/15 select-none font-thin hidden sm:inline">|</span>

          <button
            onClick={() => setIsWhyGapsModalOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer hidden sm:flex items-center space-x-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
            <span>HOW IT WORKS</span>
          </button>
        </nav>

        {/* Top-Right: Status Chip Matching Reference Image */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadSampleMode}
            className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase border transition-all cursor-pointer flex items-center space-x-1.5 ${
              isSampleMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
            }`}
            title="Click to toggle or reload sample mode"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-ping ${
                isSampleMode ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            <span>{isSampleMode ? 'SAMPLE MODE · ON' : 'LIVE · AI READY'}</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer hidden md:flex items-center justify-center"
            title="Export Report (Markdown / JSON)"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
          </button>

          <button
            onClick={resetSession}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset active query and sources"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

