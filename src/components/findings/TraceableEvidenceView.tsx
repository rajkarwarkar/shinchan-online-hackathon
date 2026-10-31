'use client';

import React, { useState } from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { 
  FileCheck2, 
  Quote, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink, 
  Search, 
  HelpCircle,
  ShieldCheck,
  Check,
  Minus
} from 'lucide-react';

export const TraceableEvidenceView: React.FC = () => {
  const { report, sources, claims, aspects, openSourceDrawer } = useDarkSpotStore();
  const [filterAspectId, setFilterAspectId] = useState<string | null>(null);

  const coverage = report?.coverage || [];
  const allClaims = report?.claims || claims || [];
  const verifiedClaims = allClaims.filter((c) => c.quoteVerified);

  const displayedClaims = filterAspectId
    ? verifiedClaims.filter((c) => c.aspectId === filterAspectId)
    : verifiedClaims;

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-teal-400" />
            <span>Traceable Evidence & 2D Coverage Matrix</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Interactive Aspects × Sources coverage grid. Click any cell or claim to highlight the verbatim passage in the source reader.
          </p>
        </div>

        <div className="trust-badge-sourced px-3 py-1 rounded-full text-[11px] font-mono font-medium flex items-center space-x-1.5">
          <Quote className="w-3.5 h-3.5" />
          <span>{verifiedClaims.length} VERIFIED QUOTES</span>
        </div>
      </div>

      {/* 2D Coverage Matrix Table */}
      <div className="darkspot-panel rounded-3xl p-5 border border-white/10 bg-[#0B0F14]/90 space-y-4 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            Coverage Matrix (Aspects × Sources)
          </h3>
          <span className="text-[11px] font-mono text-zinc-400">
            Click cells to inspect evidence
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-white/10 text-zinc-400 font-mono text-[11px]">
              <th className="py-2.5 px-3 font-semibold w-1/3">Decision Aspect</th>
              {sources.map((s) => (
                <th key={s.id} className="py-2.5 px-2 font-semibold text-center truncate max-w-[120px]" title={s.title}>
                  {s.publisher || s.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {aspects.map((asp) => {
              const isFiltered = filterAspectId === asp.id;

              return (
                <tr
                  key={asp.id}
                  onClick={() => setFilterAspectId(isFiltered ? null : asp.id)}
                  className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                    isFiltered ? 'bg-amber-500/10' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-sans font-semibold text-white">{asp.label}</span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                          asp.importance === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : asp.importance === 'high'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {asp.importance}
                      </span>
                    </div>
                  </td>

                  {sources.map((src) => {
                    const cell = coverage.find(
                      (c) => c.aspectId === asp.id && c.sourceId === src.id
                    );
                    const status = cell?.status || 'none';

                    return (
                      <td key={src.id} className="py-3 px-2 text-center">
                        {status === 'full' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const claimId = cell?.claimIds[0];
                              const claim = allClaims.find((cl) => cl.id === claimId);
                              openSourceDrawer(src, claim?.quote);
                            }}
                            className="w-7 h-7 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 inline-flex items-center justify-center transition-all cursor-pointer shadow-sm shadow-teal-500/20"
                            title="Fully sourced by verified quote (Click to open)"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : status === 'partial' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openSourceDrawer(src);
                            }}
                            className="w-7 h-7 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 inline-flex items-center justify-center transition-all cursor-pointer"
                            title="Partially covered (Click to open)"
                          >
                            <Sparkles className="w-3 h-3" />
                          </button>
                        ) : (
                          <span
                            className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400/60 border border-rose-500/20 inline-flex items-center justify-center"
                            title="Dark Spot: No evidence found"
                          >
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-4 h-4 rounded bg-teal-500/20 border border-teal-500/40 inline-flex items-center justify-center text-teal-300">
              <Check className="w-2.5 h-2.5" />
            </span>
            <span>Full Sourced (Verified Quote)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/40 inline-flex items-center justify-center text-amber-300">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span>Partial Coverage</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-4 h-4 rounded bg-rose-500/10 border border-rose-500/20 inline-flex items-center justify-center text-rose-400">
              <Minus className="w-2.5 h-2.5" />
            </span>
            <span>Dark Spot (Absent)</span>
          </div>
        </div>
      </div>

      {/* Verified Claims List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
            Sourced Claims with Verbatim Evidence ({displayedClaims.length})
          </h3>
          {filterAspectId && (
            <button
              onClick={() => setFilterAspectId(null)}
              className="text-xs font-mono text-amber-400 hover:text-white cursor-pointer"
            >
              Clear Aspect Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayedClaims.map((claim) => {
            const src = sources.find((s) => s.id === claim.sourceId);
            const asp = aspects.find((a) => a.id === claim.aspectId);

            return (
              <div
                key={claim.id}
                className="darkspot-panel rounded-2xl p-4 border border-teal-500/25 bg-[#0B0F14]/90 space-y-3 flex flex-col justify-between hover:border-teal-500/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-teal-300 text-[11px] font-bold">
                      {src?.publisher || 'Official Source'}
                    </span>
                    <span className="font-mono text-zinc-400 text-[10px]">
                      {asp?.label || claim.aspectId}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white">
                    {claim.statement}
                  </p>

                  <blockquote className="rounded-xl p-2.5 bg-teal-950/20 border-l-2 border-teal-400 text-xs italic text-teal-100/90 leading-relaxed">
                    "{claim.quote}"
                  </blockquote>
                </div>

                {src && (
                  <button
                    onClick={() => openSourceDrawer(src, claim.quote)}
                    className="pt-2 border-t border-white/5 text-[11px] font-mono text-teal-300 hover:text-white flex items-center space-x-1 cursor-pointer transition-colors self-start"
                  >
                    <span>Highlight Quote in Source Reader</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

