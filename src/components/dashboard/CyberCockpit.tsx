'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { Interactive3DPrisms } from './Interactive3DPrisms';
import { 
  ShieldAlert, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  ChevronRight,
  RotateCcw,
  Maximize2,
  FileText
} from 'lucide-react';
import { ALL_EVALUATION_SCENARIOS } from '@/data/scenarios';

export const CyberCockpit: React.FC = () => {
  const { 
    report, 
    question, 
    activeScenarioId, 
    loadScenario, 
    activeTab, 
    setActiveTab 
  } = useDarkSpotStore();

  const completeness = report?.completenessIndex ?? 54;
  const darkSpotPercentage = 100 - completeness;
  const gapsCount = report?.gaps.length ?? 4;
  const conflictsCount = report?.conflicts.length ?? 2;
  const staleCount = report?.freshness.length ?? 2;
  const sourcedClaimsCount = report?.claims.filter((c) => c.quoteVerified).length ?? 6;

  return (
    <section className="space-y-4">
      {/* Cockpit Status Bar Matching Image 1 */}
      <div className="darkspot-panel rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs border border-white/10 bg-[#0B0F14]/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>3D CYBER DASHBOARD</span>
          </div>

          <span className="text-zinc-500 hidden sm:inline">•</span>

          <span className="text-[11px] font-mono text-zinc-400 hidden md:inline">
            3D Dashboard Online (44 3D Nodes)
          </span>

          <span className="text-zinc-500 hidden md:inline">•</span>

          <div className="flex items-center space-x-1 text-zinc-300 font-medium max-w-md truncate">
            <span className="text-amber-400/90 font-mono text-[11px]">Active Query:</span>
            <span className="truncate text-white font-semibold">{question || 'No research query active'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
              activeTab === 'evidence'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-zinc-400 hover:text-white border-white/10'
            }`}
          >
            2D Radar Matrix
          </button>
        </div>
      </div>

      {/* Main 2-Column Cockpit Grid Matching Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Completeness, Metrics, & Judge Scenarios */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Card 1: Information Completeness Bar */}
          <div className="darkspot-panel rounded-3xl p-5 border border-white/10 bg-[#0B0F14] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold tracking-wider uppercase text-zinc-300 font-mono">
                  INFORMATION COMPLETENESS
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-black">
                {completeness}% Sourced
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-zinc-800/80 overflow-hidden flex p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 transition-all duration-700 shadow-sm shadow-teal-500/30"
                  style={{ width: `${completeness}%` }}
                />
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500/40 to-rose-500/50 transition-all duration-700"
                  style={{ width: `${darkSpotPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="text-amber-400/90 font-medium">
                  {darkSpotPercentage}% Unverified Dark Spot
                </span>
                <span className="text-teal-400/90 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span>Active Synthesis</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: 3 Big Metric Cards Side-by-Side */}
          <div className="grid grid-cols-3 gap-3">
            {/* Gaps */}
            <button
              onClick={() => setActiveTab('gaps')}
              className={`text-left rounded-2xl p-3.5 border transition-all cursor-pointer group ${
                activeTab === 'gaps'
                  ? 'bg-rose-500/10 border-rose-500/60 shadow-lg shadow-rose-500/15'
                  : 'bg-[#0B0F14] border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-500/5'
              }`}
            >
              <div className="flex items-center justify-between text-rose-400 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  GAPS
                </span>
              </div>
              <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">
                {gapsCount}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Dark spots
              </div>
            </button>

            {/* Clash / Conflicts */}
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`text-left rounded-2xl p-3.5 border transition-all cursor-pointer group ${
                activeTab === 'conflicts'
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/15'
                  : 'bg-[#0B0F14] border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5'
              }`}
            >
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  CLASH
                </span>
              </div>
              <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">
                {conflictsCount}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Contradictions
              </div>
            </button>

            {/* Stale Dates */}
            <button
              onClick={() => setActiveTab('freshness')}
              className={`text-left rounded-2xl p-3.5 border transition-all cursor-pointer group ${
                activeTab === 'freshness'
                  ? 'bg-orange-500/10 border-orange-500/60 shadow-lg shadow-orange-500/15'
                  : 'bg-[#0B0F14] border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-500/5'
              }`}
            >
              <div className="flex items-center justify-between text-orange-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  STALE
                </span>
              </div>
              <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">
                {staleCount}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Outdated cycles
              </div>
            </button>
          </div>

          {/* Card 3: 1-Click Live Scenarios for Judges */}
          <div className="darkspot-panel rounded-3xl p-4 sm:p-5 border border-white/10 bg-[#0B0F14] space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>1-CLICK LIVE SCENARIOS FOR JUDGES:</span>
            </div>

            <div className="space-y-2">
              {ALL_EVALUATION_SCENARIOS.map((sc) => {
                const isSelected = activeScenarioId === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => loadScenario(sc.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500/60 text-white shadow-md shadow-purple-500/20'
                        : 'bg-white/[0.03] border-white/5 text-zinc-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isSelected ? 'bg-purple-400 shadow-sm shadow-purple-400 animate-pulse' : 'bg-zinc-600'
                        }`}
                      />
                      <span className="text-xs font-semibold truncate tracking-tight">
                        {sc.name}
                      </span>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-zinc-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all flex-shrink-0 ${
                        isSelected ? 'text-purple-400' : ''
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Prisms Viewport */}
        <div className="lg:col-span-7 flex flex-col">
          <Interactive3DPrisms
            gapsCount={gapsCount}
            conflictsCount={conflictsCount}
            staleCount={staleCount}
            sourcedCount={sourcedClaimsCount}
            onSelectView={(view) => setActiveTab(view as any)}
          />
        </div>
      </div>
    </section>
  );
};
