'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { SourceManager } from '@/components/sources/SourceManager';
import { SourceReaderDrawer } from '@/components/sources/SourceReaderDrawer';
import { 
  Compass, 
  Quote, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  FileCheck2
} from 'lucide-react';

export default function Home() {
  const { 
    question, 
    sources, 
    report, 
    isSampleMode, 
    loadSampleMode, 
    resetSession 
  } = useDarkSpotStore();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-[#0B0F14]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Compass className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black text-white tracking-tight">
                  DIGITAL <span className="text-amber-400">DARK SPOT</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Hackathon 2026
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                AI-Assisted Information Gap & Contradiction Detection Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isSampleMode && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-white/10 hidden sm:inline-flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Sample Mode: Aurora Scholarship</span>
              </span>
            )}
            <button
              onClick={loadSampleMode}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Load Sample Pack
            </button>
            <button
              onClick={resetSession}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Three Trust Labels Legend Bar (Non-negotiable requirement) */}
        <div className="darkspot-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
            Evidence Trust Hierarchy:
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="trust-badge-sourced px-3 py-1 rounded-full flex items-center space-x-1.5 font-medium">
              <Quote className="w-3.5 h-3.5" />
              <span>SOURCED (Verified Quote + Source Link)</span>
            </div>
            <div className="trust-badge-suggested px-3 py-1 rounded-full flex items-center space-x-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-SUGGESTED (Inference / Guidance)</span>
            </div>
            <div className="trust-badge-uncertain px-3 py-1 rounded-full flex items-center space-x-1.5 font-medium">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>UNCERTAIN (Low Confidence / Unverified)</span>
            </div>
          </div>
        </div>

        {/* Question & Summary Hero Card */}
        <div className="darkspot-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
              Research Objective & Decision Goal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {question}
            </h1>
            <p className="text-xs text-zinc-400">
              {sources.length} sources reviewed • {report?.gaps.length || 0} gaps detected • {report?.conflicts.length || 0} conflicts flagged
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="darkspot-panel rounded-2xl p-4 border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-amber-400 text-xs font-mono">
                <span>COMPLETENESS</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{report?.completenessIndex || 0}%</div>
              <div className="text-[11px] text-zinc-400">Relative coverage score</div>
            </div>

            <div className="darkspot-panel rounded-2xl p-4 border border-rose-500/30 space-y-1">
              <div className="flex items-center justify-between text-rose-400 text-xs font-mono">
                <span>DARK SPOTS</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{report?.gaps.length || 0}</div>
              <div className="text-[11px] text-zinc-400">Missing decision facets</div>
            </div>

            <div className="darkspot-panel rounded-2xl p-4 border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-amber-400 text-xs font-mono">
                <span>CONFLICTS</span>
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{report?.conflicts.length || 0}</div>
              <div className="text-[11px] text-zinc-400">Policy contradictions</div>
            </div>

            <div className="darkspot-panel rounded-2xl p-4 border border-teal-500/30 space-y-1">
              <div className="flex items-center justify-between text-teal-400 text-xs font-mono">
                <span>SOURCED FACTS</span>
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{report?.claims.filter(c => c.quoteVerified).length || 0}</div>
              <div className="text-[11px] text-zinc-400">Verified verbatim quotes</div>
            </div>
          </div>
        </div>

        {/* Source Manager & Ingestion Module (Phase 2) */}
        <SourceManager />
      </main>

      {/* Source Reader Drawer (Auto-scrolled with highlighted passage) */}
      <SourceReaderDrawer />

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-xs text-zinc-500 bg-[#070A0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Digital Dark Spot • Shinchan Online Hackathon 2026</span>
          <span className="font-mono text-[11px] text-amber-400/80">
            Disclaimer: AI-generated signals, not guaranteed facts. Always confirm with official authorities.
          </span>
        </div>
      </footer>
    </div>
  );
}
