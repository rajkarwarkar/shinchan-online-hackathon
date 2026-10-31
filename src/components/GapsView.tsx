'use client';

import React from 'react';
import { InformationGap } from '@/types';
import { AlertCircle, HelpCircle, Compass, ShieldAlert } from 'lucide-react';

interface GapsViewProps {
  gaps: InformationGap[];
}

export const GapsView: React.FC<GapsViewProps> = ({ gaps }) => {
  if (gaps.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 space-y-2">
        <Compass className="w-8 h-8 text-emerald-400 mx-auto" />
        <h3 className="text-base font-semibold text-white">No Critical Dark Spots Detected</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          The reviewed sources provide comprehensive coverage of the standard decision facets for this topic.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Information Gaps & Unanswered Facets</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {gaps.length} Signals
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Critical decision requirements absent across all reviewed publications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {gaps.map((gap, index) => {
          const isCritical = gap.severity === 'CRITICAL';
          return (
            <div
              key={gap.id || index}
              className={`glass-panel rounded-xl p-5 border transition-all ${
                isCritical 
                  ? 'border-rose-500/30 bg-rose-950/10 hover:border-rose-500/50' 
                  : 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {gap.severity} GAP
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    AI SIGNAL / INFERRED OMISSION
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-medium">
                  {gap.reasonMissing}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2 flex items-center space-x-1.5">
                <AlertCircle className={`w-4 h-4 shrink-0 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
                <span>{gap.facet}</span>
              </h4>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3">
                {gap.explanation}
              </p>

              {/* Impact on Decision Box */}
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1 mb-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Real-World Decision Risk</span>
                </div>
                <p className="text-xs text-zinc-300">
                  {gap.impactOnDecision}
                </p>
              </div>

              {/* Actionable Verification Question */}
              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                    Recommended Question to Verify
                  </div>
                  <div className="text-xs text-white font-medium select-all">
                    &ldquo;{gap.verificationQuestion}&rdquo;
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

