'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { ShieldAlert, AlertTriangle, Sparkles, ExternalLink, HelpCircle, CheckCircle } from 'lucide-react';

export const InformationGapsView: React.FC = () => {
  const { report, sources, openSourceDrawer } = useDarkSpotStore();

  const gaps = report?.gaps || [];

  if (gaps.length === 0) {
    return (
      <div className="darkspot-panel rounded-3xl p-8 text-center border border-emerald-500/20 bg-[#0B0F14] space-y-3">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Critical Dark Spots Detected</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          All high-priority decision aspects are covered by verified quotes in the reviewed sources.
        </p>
      </div>
    );
  }

  const severityBadge = (severity: string) => {
    const s = severity.toUpperCase();
    switch (s) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            Critical Gap
          </span>
        );
      case 'MODERATE':
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            Moderate Gap
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider">
            Low Priority Gap
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Identified Information Gaps ({gaps.length})</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Crucial decision factors completely absent or unaddressed across all reviewed sources.
          </p>
        </div>

        <div className="trust-badge-suggested px-3 py-1 rounded-full text-[11px] font-mono font-medium flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-SUGGESTED SIGNALS</span>
        </div>
      </div>

      {/* Gap cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gaps.map((gap) => {
          const aspect = report?.aspects.find((a) => a.id === gap.aspectId);

          return (
            <div
              key={gap.id}
              className="darkspot-panel rounded-3xl p-5 border border-rose-500/30 bg-[#0B0F14]/90 space-y-4 hover:border-rose-500/60 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {severityBadge(gap.severity)}
                  <span className="text-[11px] font-mono text-zinc-400">
                    Aspect: {aspect?.label || gap.aspectId}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {gap.title}
                </h3>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {gap.explanation}
                </p>

                {/* Why It Matters Callout */}
                <div className="rounded-2xl p-3.5 bg-rose-500/10 border border-rose-500/25 space-y-1">
                  <div className="flex items-center space-x-1.5 text-rose-300 text-[11px] font-bold font-mono uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Why It Matters:</span>
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    {gap.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Reviewed Sources Evidence References */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                <span>Sources Checked:</span>
                <div className="flex flex-wrap gap-1.5">
                  {gap.evidenceRefs.map((srcId) => {
                    const s = sources.find((src) => src.id === srcId);
                    if (!s) return null;
                    return (
                      <button
                        key={srcId}
                        onClick={() => openSourceDrawer(s)}
                        className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors flex items-center space-x-1 cursor-pointer"
                        title={s.title}
                      >
                        <span className="truncate max-w-[120px]">{s.publisher || s.title}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
