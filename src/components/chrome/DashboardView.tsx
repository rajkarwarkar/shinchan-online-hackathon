'use client';

import React, { useState } from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { formatDateDeterministic } from '@/lib/dates/format';
import { 
  ShieldAlert, 
  Layers, 
  Clock, 
  CheckSquare2, 
  Quote, 
  Sparkles, 
  HelpCircle, 
  FileCheck2, 
  ExternalLink,
  Download,
  AlertTriangle,
  Minus,
  Check,
  Calendar,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  onBackToWorkspace: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onBackToWorkspace }) => {
  const { 
    report, 
    question, 
    sources, 
    claims, 
    aspects, 
    activeTab, 
    setActiveTab, 
    openSourceDrawer, 
    toggleChecklistItem, 
    isSampleMode,
    setIsExportModalOpen 
  } = useDarkSpotStore();

  const [filterAspectId, setFilterAspectId] = useState<string | null>(null);

  const completeness = report?.completenessIndex ?? 54;
  const gaps = report?.gaps || [];
  const conflicts = report?.conflicts || [];
  const freshness = report?.freshness || [];
  const checklist = report?.checklist || [];
  const p0Count = checklist.filter((i) => i.priority === 'P0' && !i.done).length;
  const verifiedClaims = report?.claims?.filter((c) => c.quoteVerified) || [];
  const coverage = report?.coverage || [];

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">
      {/* Sample Banner if in Sample Mode */}
      {isSampleMode && (
        <div className="rounded-xl px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase">
              FICTIONAL SAMPLE DATA (AURORA STEM MERIT SCHOLARSHIP)
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 hidden sm:inline">
            ZERO EXTERNAL NETWORK / API DEPENDENCY
          </span>
        </div>
      )}

      {/* Top Cockpit Bar: Compact 'REPORT' heading + the question */}
      <div className="noir-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-mono font-bold tracking-widest uppercase">
              AUDIT REPORT
            </span>
            <span className="text-zinc-600 font-thin">/</span>
            <span className="text-xs font-mono text-zinc-400">
              {sources.length} SOURCES REVIEWED · {verifiedClaims.length} EVIDENCE QUOTES
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>EXPORT</span>
            </button>

            <button
              onClick={onBackToWorkspace}
              className="px-3.5 py-1.5 rounded-full bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-xs font-mono text-violet-300 hover:text-white transition-colors cursor-pointer"
            >
              EDIT SOURCES
            </button>
          </div>
        </div>

        {/* The Question */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            RESEARCH OBJECTIVE
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            {question || 'No research question provided.'}
          </h1>
        </div>

        {/* 4 Glass Stat Tiles + Chrome-Ringed Completeness Gauge */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
          {/* Completeness Gauge */}
          <div className="col-span-2 lg:col-span-1 noir-panel-violet rounded-2xl p-4 border border-violet-500/30 flex items-center space-x-4">
            <div className="relative w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <div
                className="absolute inset-0 rounded-full border-2 border-teal-400"
                style={{ clipPath: `polygon(0 0, 100% 0, 100% ${completeness}%, 0 ${completeness}%)` }}
              />
              <span className="font-display text-base font-black text-white">{completeness}%</span>
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-widest uppercase text-violet-300">
                COMPLETENESS
              </div>
              <div className="text-xs text-zinc-400">Relative coverage score</div>
            </div>
          </div>

          {/* Gaps Stat */}
          <button
            onClick={() => setActiveTab('gaps')}
            className={`noir-panel rounded-2xl p-4 border text-left transition-all cursor-pointer ${
              activeTab === 'gaps' ? 'border-amber-500/60 bg-amber-500/5' : 'border-white/10 hover:border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-amber-400 text-xs mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">GAPS</span>
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-black text-white">{gaps.length}</div>
            <div className="text-[10px] font-mono text-zinc-400">Omissions detected</div>
          </button>

          {/* Conflicts Stat */}
          <button
            onClick={() => setActiveTab('conflicts')}
            className={`noir-panel rounded-2xl p-4 border text-left transition-all cursor-pointer ${
              activeTab === 'conflicts' ? 'border-rose-500/60 bg-rose-500/5' : 'border-white/10 hover:border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-rose-400 text-xs mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">CLASHES</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-black text-white">{conflicts.length}</div>
            <div className="text-[10px] font-mono text-zinc-400">Policy conflicts</div>
          </button>

          {/* Stale Stat */}
          <button
            onClick={() => setActiveTab('freshness')}
            className={`noir-panel rounded-2xl p-4 border text-left transition-all cursor-pointer ${
              activeTab === 'freshness' ? 'border-orange-500/60 bg-orange-500/5' : 'border-white/10 hover:border-orange-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-orange-400 text-xs mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">STALE</span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-black text-white">{freshness.length}</div>
            <div className="text-[10px] font-mono text-zinc-400">Stale/undated cycles</div>
          </button>

          {/* P0 Critical Actions */}
          <button
            onClick={() => setActiveTab('checklist')}
            className={`noir-panel rounded-2xl p-4 border text-left transition-all cursor-pointer ${
              activeTab === 'checklist' ? 'border-violet-500/60 bg-violet-500/5' : 'border-white/10 hover:border-violet-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-violet-400 text-xs mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">P0 ACTIONS</span>
              <CheckSquare2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-black text-white">{p0Count}</div>
            <div className="text-[10px] font-mono text-zinc-400">Blockers remaining</div>
          </button>
        </div>
      </div>

      {/* Always-Visible Trust Legend + Disclaimer */}
      <div className="noir-panel rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs border border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            TRUST LABELS:
          </span>
          <div className="trust-badge-sourced px-3 py-1 rounded-full flex items-center space-x-1.5 font-mono text-[10px]">
            <Quote className="w-3 h-3" />
            <span>SOURCED (Solid Mint · Verified Quote)</span>
          </div>
          <div className="trust-badge-suggested px-3 py-1 rounded-full flex items-center space-x-1.5 font-mono text-[10px]">
            <Sparkles className="w-3 h-3" />
            <span>AI-SUGGESTED (Dashed Lavender · Signal)</span>
          </div>
          <div className="trust-badge-uncertain px-3 py-1 rounded-full flex items-center space-x-1.5 font-mono text-[10px]">
            <HelpCircle className="w-3 h-3" />
            <span>UNCERTAIN (Hatched Slate · Low Confidence)</span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-amber-400/80">
          Disclaimer: AI signals, not guaranteed legal facts. Always cross-verify with official authorities.
        </span>
      </div>

      {/* Pill-Style Tabs: Overview · Coverage Map · Gaps · Conflicts · Freshness · Checklist · Sources */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'evidence', label: 'Coverage Map' },
          { id: 'gaps', label: `Gaps (${gaps.length})` },
          { id: 'conflicts', label: `Conflicts (${conflicts.length})` },
          { id: 'freshness', label: `Freshness (${freshness.length})` },
          { id: 'checklist', label: `Checklist (${checklist.length})` }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-violet-600 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'noir-panel hover:bg-white/10 text-zinc-400 hover:text-white border-white/10'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT (Rendered on near-black glass cards with high text readability) */}
      <div className="min-h-[400px]">
        {/* 1. Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Critical Gaps Spotlight */}
              <div className="noir-panel rounded-3xl p-6 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-white tracking-wider flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>CRITICAL OMISSIONS (DARK SPOTS)</span>
                  </h3>
                  <span className="text-xs font-mono text-amber-400 font-bold">{gaps.length} Found</span>
                </div>
                <div className="space-y-2.5">
                  {gaps.slice(0, 3).map((gap) => (
                    <div key={gap.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-xs font-bold text-zinc-200">{gap.title}</div>
                      <p className="text-[11px] text-zinc-400">{gap.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Evidence Spotlight */}
              <div className="noir-panel rounded-3xl p-6 border border-teal-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-white tracking-wider flex items-center space-x-2">
                    <FileCheck2 className="w-4 h-4 text-teal-400" />
                    <span>VERIFIED EVIDENCE EXCERPTS</span>
                  </h3>
                  <span className="text-xs font-mono text-teal-400 font-bold">{verifiedClaims.length} Claims</span>
                </div>
                <div className="space-y-2.5">
                  {verifiedClaims.slice(0, 3).map((cl) => {
                    const src = sources.find((s) => s.id === cl.sourceId);
                    return (
                      <div
                        key={cl.id}
                        onClick={() => src && openSourceDrawer(src, cl.quote)}
                        className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 cursor-pointer hover:border-teal-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-teal-300">
                          <span>{src?.publisher || 'Official Source'}</span>
                          <span className="underline">View Quote →</span>
                        </div>
                        <p className="text-xs italic text-zinc-300">"{cl.quote}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Coverage Map (Heatmap with pulsing amber Dark Spots) */}
        {activeTab === 'evidence' && (
          <div className="noir-panel rounded-3xl p-6 border border-white/10 space-y-4 overflow-x-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-violet-300">
                COVERAGE HEATMAP (ASPECTS × SOURCES)
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">
                EMPTY AMBER CELLS ARE THE UNADDRESSED DARK SPOTS
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 font-mono text-[11px]">
                  <th className="py-3 px-3 font-semibold w-1/3">Decision Aspect</th>
                  {sources.map((s) => (
                    <th key={s.id} className="py-3 px-2 font-semibold text-center truncate max-w-[120px]" title={s.title}>
                      {s.publisher || s.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {aspects.map((asp) => (
                  <tr key={asp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-sans font-semibold text-white">{asp.label}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                          asp.importance === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-white/5 text-zinc-400'
                        }`}>
                          {asp.importance}
                        </span>
                      </div>
                    </td>

                    {sources.map((src) => {
                      const cell = coverage.find((c) => c.aspectId === asp.id && c.sourceId === src.id);
                      const status = cell?.status || 'none';

                      return (
                        <td key={src.id} className="py-3 px-2 text-center">
                          {status === 'full' ? (
                            <button
                              onClick={() => {
                                const claimId = cell?.claimIds[0];
                                const claim = report?.claims.find((c) => c.id === claimId);
                                openSourceDrawer(src, claim?.quote);
                              }}
                              className="w-7 h-7 rounded-lg bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 border border-teal-500/40 inline-flex items-center justify-center transition-all cursor-pointer shadow-[0_0_10px_rgba(20,184,166,0.2)]"
                              title="Full verified quote"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : status === 'partial' ? (
                            <button
                              onClick={() => openSourceDrawer(src)}
                              className="w-7 h-7 rounded-lg bg-slate-500/20 hover:bg-slate-500/40 text-slate-300 border border-slate-500/40 inline-flex items-center justify-center transition-all cursor-pointer"
                              title="Partial coverage"
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>
                          ) : (
                            /* Dark Spot: Glowing Amber Pulsing Cell */
                            <span
                              className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/60 text-amber-400 inline-flex items-center justify-center dark-spot-glow animate-pulse"
                              title="Dark Spot: Critical fact absent in this source"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Gaps View */}
        {activeTab === 'gaps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaps.map((gap) => (
              <div key={gap.id} className="noir-panel rounded-3xl p-6 border border-amber-500/30 space-y-4 hover:border-amber-500/60 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                      {gap.severity} GAP
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">Aspect: {gap.aspectId}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{gap.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{gap.explanation}</p>

                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <div className="flex items-center space-x-1.5 text-amber-300 text-[11px] font-mono font-bold uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>WHY IT MATTERS:</span>
                    </div>
                    <p className="text-xs text-amber-200/90 leading-relaxed">{gap.whyItMatters}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Conflicts View (Side-by-side with Magenta VS Divider) */}
        {activeTab === 'conflicts' && (
          <div className="space-y-4">
            {conflicts.map((conflict) => {
              const sourceA = sources.find((s) => s.id === conflict.claimA.sourceId);
              const sourceB = sources.find((s) => s.id === conflict.claimB.sourceId);

              return (
                <div key={conflict.id} className="noir-panel rounded-3xl p-6 border border-rose-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                      {conflict.type}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Severity: {conflict.severity}</span>
                  </div>

                  {/* Side-by-Side Claim Cards with Magenta VS Divider */}
                  <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                    {/* Claim A */}
                    <div className="md:col-span-5 p-4 rounded-2xl bg-black/40 border border-teal-500/30 space-y-2">
                      <div className="text-[10px] font-mono text-teal-400 font-bold uppercase">
                        SOURCE A · {sourceA?.publisher || 'Official Document'}
                      </div>
                      <blockquote className="text-xs italic text-teal-100/90">
                        "{conflict.claimA.quote}"
                      </blockquote>
                    </div>

                    {/* Magenta VS Divider */}
                    <div className="md:col-span-1 text-center py-2">
                      <span className="px-2.5 py-1 rounded-full bg-rose-500 text-black font-display font-black text-xs shadow-[0_0_15px_#FB3B6B]">
                        VS
                      </span>
                    </div>

                    {/* Claim B */}
                    <div className="md:col-span-5 p-4 rounded-2xl bg-black/40 border border-rose-500/30 space-y-2">
                      <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                        SOURCE B · {sourceB?.publisher || 'Institutional Document'}
                      </div>
                      <blockquote className="text-xs italic text-rose-100/90">
                        "{conflict.claimB.quote}"
                      </blockquote>
                    </div>
                  </div>

                  {/* Benign Explanation */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300 font-sans">
                    <strong className="text-violet-300 font-mono">Possible Explanation:</strong> {conflict.possibleExplanation}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Freshness Timeline (Amber Ringed Stale/Undated Nodes) */}
        {activeTab === 'freshness' && (
          <div className="space-y-3">
            {sources.map((src) => {
              const finding = freshness.find((f) => f.sourceId === src.id);
              const isStale = finding?.status === 'older-cycle' || finding?.status === 'possibly-outdated';
              const isUndated = !src.publishedDate;

              return (
                <div
                  key={src.id}
                  className={`noir-panel rounded-2xl p-5 border space-y-2 transition-all ${
                    isStale
                      ? 'border-amber-500/60 bg-amber-950/10 dark-spot-glow'
                      : isUndated
                      ? 'border-purple-500/40 bg-purple-950/10'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{src.publisher || src.title}</span>
                    <span suppressHydrationWarning className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isStale ? 'border-amber-500 text-amber-300 bg-amber-500/20' : 'border-white/10 text-zinc-400'
                    }`}>
                      {src.publishedDate ? formatDateDeterministic(src.publishedDate) : 'NO DATE FOUND'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300">{src.title}</p>
                  {finding && (
                    <div className="text-xs font-mono text-amber-300/90 pt-1">
                      ⚠️ Audit finding: {finding.reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 6. Verification Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`noir-panel rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-start space-x-4 ${
                  item.done ? 'opacity-50 border-emerald-500/30' : 'border-white/10 hover:border-violet-500/40'
                }`}
              >
                <button
                  type="button"
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all mt-0.5 ${
                    item.done ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-white/5 border-white/20'
                  }`}
                >
                  {item.done && <Check className="w-4 h-4" />}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                      item.priority === 'P0' ? 'border-rose-500 text-rose-300 bg-rose-500/20' : 'border-white/10 text-zinc-400'
                    }`}>
                      {item.priority} · {item.priority === 'P0' ? 'CRITICAL BLOCKER' : 'VERIFICATION ACTION'}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold text-white ${item.done ? 'line-through text-zinc-500' : ''}`}>
                    {item.action}
                  </h4>
                  <p className="text-xs text-zinc-400">Impact: {item.why}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
