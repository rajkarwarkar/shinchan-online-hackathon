'use client';

import React from 'react';
import { TemporalWarning, Source } from '@/types';
import { CalendarClock, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface FreshnessViewProps {
  warnings: TemporalWarning[];
  sources: Source[];
}

export const FreshnessView: React.FC<FreshnessViewProps> = ({ warnings, sources }) => {
  const getSource = (sourceId: string) => sources.find(s => s.id === sourceId);

  if (warnings.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
        <h3 className="text-base font-semibold text-white">All Sources Fresh & Aligned</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          No stale cycles or outdated publication dates detected across the current source set.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Temporal Decay & Freshness Audit</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {warnings.length} Alert{warnings.length > 1 ? 's' : ''}
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Identifies obsolete application cycles, expired rules, and misleading historic archives
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {warnings.map((w, index) => {
          const src = getSource(w.sourceId);
          return (
            <div
              key={w.id || index}
              className="glass-panel rounded-xl p-5 border border-orange-500/30 bg-orange-950/10 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center space-x-1">
                    <CalendarClock className="w-3.5 h-3.5" />
                    <span>{w.warningType.replace('_', ' ')}</span>
                  </span>
                  <span className="text-xs font-mono text-zinc-300 font-semibold">
                    {w.detectedCycleOrDate}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  Target: {src ? src.title : w.sourceId}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                {w.message}
              </p>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-semibold text-orange-300 uppercase tracking-wider text-[11px]">
                    Freshness Hazard:
                  </span>
                  <p className="text-zinc-300">{w.riskFactor}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

