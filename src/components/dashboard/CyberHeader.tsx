'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { 
  Compass, 
  HelpCircle, 
  FileCheck2, 
  Download, 
  RotateCcw, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const CyberHeader: React.FC = () => {
  const { 
    isSampleMode, 
    loadSampleMode, 
    resetSession,
    setIsWhyGapsModalOpen,
    setIsExportModalOpen,
    setActiveTab
  } = useDarkSpotStore();

  return (
    <header className="border-b border-white/10 bg-[#06080D]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Hackathon Title Matching Image 1 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Compass className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-black text-white tracking-tight">
                DarkSpot <span className="text-purple-400">AI Intelligence</span>
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 hidden sm:inline-block">
                AI Gap Sentinel
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Information Gap & Contradiction Detection Platform
            </p>
          </div>
        </div>

        {/* Right: Actions, Explanations, & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Shinchan Hackathon 2026 Pill */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Shinchan Hackathon 2026</span>
            <span className="sm:hidden">Hackathon</span>
          </div>

          {/* Why Gaps Matter Dialog Trigger */}
          <button
            onClick={() => setIsWhyGapsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Why Gaps Matter</span>
          </button>

          {/* Traceable Evidence Tab Trigger */}
          <button
            onClick={() => setActiveTab('evidence')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-teal-300 hover:text-white bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Traceable Evidence</span>
            <span className="sm:hidden">Evidence</span>
          </button>

          {/* Export Report Trigger */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Sample Pack Load */}
          <button
            onClick={loadSampleMode}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/30 cursor-pointer flex items-center space-x-1"
          >
            <span>Load Sample</span>
          </button>

          {/* Reset */}
          <button
            onClick={resetSession}
            title="Reset active query and sources"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

