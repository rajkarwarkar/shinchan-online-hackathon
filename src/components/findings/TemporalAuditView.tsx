'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { Clock, Calendar, AlertTriangle, CheckCircle, ShieldAlert, ExternalLink } from 'lucide-react';

export const TemporalAuditView: React.FC = () => {
  const { report, sources, openSourceDrawer } = useDarkSpotStore();

  const freshnessFindings = report?.freshness || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            Current (2026)
          </span>
        );
      case 'older-cycle':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            Older Cycle
          </span>
        );
      case 'possibly-outdated':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            Possibly Outdated
          </span>
        );
      case 'undated':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            Undated
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider">
            Unverified Date
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
            <Clock className="w-4 h-4 text-orange-400" />
            <span>Temporal Audit & Freshness Timeline</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Temporal audit identifying stale cycles, undated advice, and obsolete policy references.
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[11px] font-mono font-medium flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>RUNTIME DATE: OCTOBER 2026</span>
        </div>
      </div>

      {/* Freshness Findings Cards */}
      <div className="space-y-3">
        {sources.map((source) => {
          const finding = freshnessFindings.find((f) => f.sourceId === source.id);
          const status = finding?.status || (source.publishedDate ? 'current' : 'undated');

          return (
            <div
              key={source.id}
              className={`darkspot-panel rounded-3xl p-5 border bg-[#0B0F14]/90 space-y-3 transition-all ${
                status === 'older-cycle'
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : status === 'possibly-outdated'
                  ? 'border-amber-500/40 bg-amber-950/10'
                  : status === 'undated'
                  ? 'border-purple-500/30'
                  : 'border-white/10'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  {getStatusBadge(status)}
                  <span className="text-xs font-mono font-bold text-white">
                    {source.publisher || 'Unknown Publisher'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
                  {source.publishedDate ? (
                    <span>Published: {new Date(source.publishedDate).toLocaleDateString()}</span>
                  ) : (
                    <span className="text-purple-400">No Publish Date Found</span>
                  )}
                  {source.detectedCycleLabel && (
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-amber-300">
                      {source.detectedCycleLabel}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-200">
                  {source.title}
                </h4>
                {source.url && (
                  <p className="text-[11px] font-mono text-zinc-500 truncate max-w-xl">
                    {source.url}
                  </p>
                )}
              </div>

              {finding && (
                <div className="rounded-2xl p-3 bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Audit Finding:</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {finding.reason}
                  </p>
                  {finding.evidence && (
                    <p className="text-[11px] font-mono text-zinc-400 italic">
                      Evidence: {finding.evidence}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-zinc-500">
                  Credibility Score: {Math.round(source.credibilityScore * 100)}%
                </span>

                <button
                  onClick={() => openSourceDrawer(source)}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <span>Inspect Source Document</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
