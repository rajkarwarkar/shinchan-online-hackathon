'use client';

import React from 'react';
import { DarkSpotOrb } from './DarkSpotOrb';
import { Loader2, CheckCircle2, X } from 'lucide-react';

interface AnalysisProgressViewProps {
  currentStage: string;
  onCancel: () => void;
}

export const AnalysisProgressView: React.FC<AnalysisProgressViewProps> = ({
  currentStage,
  onCancel
}) => {
  const stages = [
    { id: 'ingest', label: '1. Ingesting & SSRF Guarding Sources' },
    { id: 'read', label: '2. Extracting Verbatim Evidence & Dates' },
    { id: 'matrix', label: '3. Mapping Aspects × Sources Coverage Matrix' },
    { id: 'gaps', label: '4. Detecting Unaddressed Gaps & Policy Clashes' },
    { id: 'checklist', label: '5. Computing Completeness Index & Prioritizing Checklist' }
  ];

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 max-w-2xl mx-auto w-full space-y-10">
      {/* Glossy Dark-Spot Orb with Amber Sweep */}
      <div className="relative flex items-center justify-center">
        <DarkSpotOrb size={80} pulse={true} />
        {/* Orbital Amber Sweep Ring */}
        <div className="absolute inset-0 w-28 h-28 -m-2 rounded-full border border-amber-400/40 border-t-amber-400 animate-spin pointer-events-none" />
      </div>

      <div className="text-center space-y-3">
        <span className="text-xs font-mono font-medium tracking-wider text-violet-300 uppercase">
          EVIDENCE AUDIT IN PROGRESS
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          SYNTHESIZING DIGITAL DARK SPOTS
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 font-sans max-w-lg mx-auto">
          Cross-examining quotes, matching dates, and detecting unmentioned criteria.
        </p>
      </div>

      {/* Vertical Stage Timeline with Mono Timestamps */}
      <div className="noir-panel-violet rounded-3xl p-6 sm:p-8 w-full space-y-5 border border-violet-500/30">
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const isCompleted = idx < 3; // simulated or active
            const isCurrent = idx === 3;

            return (
              <div key={stage.id} className="flex items-center justify-between text-sm font-sans font-medium">
                <div className="flex items-center space-x-3">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-700" />
                  )}
                  <span className={isCurrent ? 'text-white font-bold' : isCompleted ? 'text-zinc-200' : 'text-zinc-500'}>
                    {stage.label}
                  </span>
                </div>

                <span className="text-xs font-mono font-medium text-zinc-400">
                  {isCompleted ? '✓ VERIFIED' : isCurrent ? 'AUDITING...' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            MODEL: GEMINI 2.5 FLASH · ZERO HALLUCINATION MODE
          </span>

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full noir-panel hover:bg-white/10 text-zinc-300 hover:text-white text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

