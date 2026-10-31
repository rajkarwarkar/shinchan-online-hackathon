'use client';

import React from 'react';
import { SourceConflict, Source } from '@/types';
import { Split, CheckCircle } from 'lucide-react';

interface ConflictsViewProps {
  conflicts: SourceConflict[];
  sources: Source[];
}

export const ConflictsView: React.FC<ConflictsViewProps> = ({ conflicts, sources }) => {
  const getSourceTitle = (sourceId: string) => {
    const s = sources.find(src => src.id === sourceId);
    return s ? s.title : sourceId;
  };

  const getSourceDomain = (sourceId: string) => {
    const s = sources.find(src => src.id === sourceId);
    return s ? s.domain : '';
  };

  if (conflicts.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 space-y-2">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
        <h3 className="text-base font-semibold text-white">No Contradictions Detected</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          The statements across reviewed sources show consistent alignment on criteria, numbers, and deadlines.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Cross-Source Contradiction Radar</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {conflicts.length} Divergence{conflicts.length > 1 ? 's' : ''}
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Conflicting rules, numbers, or deadlines identified between different publications
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {conflicts.map((conflict, index) => {
          return (
            <div
              key={conflict.id || index}
              className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-950/10 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {conflict.severity} CONFLICT
                  </span>
                  <h4 className="text-base font-bold text-white">{conflict.topic}</h4>
                </div>
                <div className="text-xs text-zinc-400 flex items-center space-x-1">
                  <Split className="w-3.5 h-3.5 text-amber-400" />
                  <span>Divergence Detected</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-200">
                {conflict.divergenceSummary}
              </p>

              {/* Side-by-side Claims Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                
                {/* Source A Claim Card */}
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {conflict.claimA.sourceId.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                      {getSourceDomain(conflict.claimA.sourceId)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-300">
                    {getSourceTitle(conflict.claimA.sourceId)}
                  </div>
                  <blockquote className="text-xs text-amber-200/90 italic pl-2.5 border-l-2 border-amber-500/60 leading-relaxed bg-black/20 p-2 rounded-r">
                    &ldquo;{conflict.claimA.exactQuote}&rdquo;
                  </blockquote>
                  <div className="text-xs text-zinc-400 pt-1">
                    <span className="text-zinc-500 font-medium">Claim: </span>
                    {conflict.claimA.statement}
                  </div>
                </div>

                {/* Source B Claim Card */}
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {conflict.claimB.sourceId.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                      {getSourceDomain(conflict.claimB.sourceId)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-300">
                    {getSourceTitle(conflict.claimB.sourceId)}
                  </div>
                  <blockquote className="text-xs text-rose-200/90 italic pl-2.5 border-l-2 border-rose-500/60 leading-relaxed bg-black/20 p-2 rounded-r">
                    &ldquo;{conflict.claimB.exactQuote}&rdquo;
                  </blockquote>
                  <div className="text-xs text-zinc-400 pt-1">
                    <span className="text-zinc-500 font-medium">Claim: </span>
                    {conflict.claimB.statement}
                  </div>
                </div>

              </div>

              {/* Root Cause & Resolution Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Root Cause Analysis
                  </div>
                  <div className="text-xs text-zinc-300">
                    {conflict.rootCause}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>How to Reconcile</span>
                  </div>
                  <div className="text-xs text-emerald-200/90">
                    {conflict.verificationGuidance}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

