'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { Layers, Quote, HelpCircle, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

export const ContradictionRadarView: React.FC = () => {
  const { report, sources, openSourceDrawer } = useDarkSpotStore();

  const conflicts = report?.conflicts || [];

  if (conflicts.length === 0) {
    return (
      <div className="darkspot-panel rounded-3xl p-8 text-center border border-emerald-500/20 bg-[#0B0F14] space-y-3">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Direct Contradictions Flagged</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Reviewed sources exhibit harmonious claims with no dual-quote policy clashes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overview header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Contradiction Radar ({conflicts.length})</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Conflicting statements between sources, verified by verbatim quotes from each publisher.
          </p>
        </div>

        <div className="trust-badge-sourced px-3 py-1 rounded-full text-[11px] font-mono font-medium flex items-center space-x-1.5">
          <Quote className="w-3.5 h-3.5" />
          <span>DUAL-QUOTE VERIFIED</span>
        </div>
      </div>

      {/* Contradiction Cards */}
      <div className="space-y-4">
        {conflicts.map((conflict) => {
          const aspect = report?.aspects.find((a) => a.id === conflict.aspectId);
          const sourceA = sources.find((s) => s.id === conflict.claimA.sourceId);
          const sourceB = sources.find((s) => s.id === conflict.claimB.sourceId);

          return (
            <div
              key={conflict.id}
              className="darkspot-panel rounded-3xl p-6 border border-amber-500/30 bg-[#0B0F14]/90 space-y-5 shadow-xl hover:border-amber-500/60 transition-all"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {conflict.type.replace('-', ' ')}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    Aspect: <span className="text-white font-semibold">{aspect?.label || conflict.aspectId}</span>
                  </span>
                </div>

                <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                  Severity: {conflict.severity}
                </span>
              </div>

              {/* Side-by-side Claims Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Claim A */}
                <div className="rounded-2xl p-4 bg-white/[0.02] border border-teal-500/30 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-teal-400 font-bold uppercase text-[11px]">
                        SOURCE A: {sourceA?.publisher || 'Official Document'}
                      </span>
                      {sourceA?.detectedCycleLabel && (
                        <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/5">
                          {sourceA.detectedCycleLabel}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-white">
                      "{conflict.claimA.statement}"
                    </p>

                    <blockquote className="rounded-xl p-3 bg-teal-950/20 border-l-2 border-teal-400 text-xs italic text-teal-100/90 leading-relaxed">
                      "{conflict.claimA.quote}"
                    </blockquote>
                  </div>

                  {sourceA && (
                    <button
                      onClick={() => openSourceDrawer(sourceA, conflict.claimA.quote)}
                      className="mt-3 text-[11px] font-mono text-teal-300 hover:text-white flex items-center space-x-1 cursor-pointer self-start"
                    >
                      <span>Highlight in source reader</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Claim B */}
                <div className="rounded-2xl p-4 bg-white/[0.02] border border-rose-500/30 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-rose-400 font-bold uppercase text-[11px]">
                        SOURCE B: {sourceB?.publisher || 'Institutional Document'}
                      </span>
                      {sourceB?.detectedCycleLabel && (
                        <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/5">
                          {sourceB.detectedCycleLabel}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-white">
                      "{conflict.claimB.statement}"
                    </p>

                    <blockquote className="rounded-xl p-3 bg-rose-950/20 border-l-2 border-rose-400 text-xs italic text-rose-100/90 leading-relaxed">
                      "{conflict.claimB.quote}"
                    </blockquote>
                  </div>

                  {sourceB && (
                    <button
                      onClick={() => openSourceDrawer(sourceB, conflict.claimB.quote)}
                      className="mt-3 text-[11px] font-mono text-rose-300 hover:text-white flex items-center space-x-1 cursor-pointer self-start"
                    >
                      <span>Highlight in source reader</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Benign Explanation & Next Step */}
              <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/25 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Possible Benign Explanation & Resolution:</span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {conflict.possibleExplanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
