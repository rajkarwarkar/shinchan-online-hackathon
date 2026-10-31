'use client';

import React, { useState } from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { Source } from '@/types';
import { formatDateDeterministic } from '@/lib/dates/format';
import { ALL_EVALUATION_SCENARIOS } from '@/data/scenarios';
import { 
  Plus, 
  Globe, 
  FileText, 
  Trash2, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Loader2, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Zap
} from 'lucide-react';

interface WorkspaceViewProps {
  onRunAnalysis: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ onRunAnalysis }) => {
  const { 
    question, 
    setQuestion, 
    sources, 
    addSource, 
    removeSource, 
    openSourceDrawer, 
    loadScenario,
    activeScenarioId,
    setIsAnalyzing
  } = useDarkSpotStore();

  const [activeTab, setActiveTab] = useState<'url' | 'paste'>('url');
  const [inputUrl, setInputUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ingestion handler using /api/ingest
  const handleFetchUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsFetching(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch and parse URL');
      }

      addSource(data.source);
      setInputUrl('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error ingesting URL. Please check formatting or CORS.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddPastedText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    const newSource: Source = {
      id: `usr-text-${Date.now()}`,
      title: pastedTitle.trim() || `User Document (${new Date().toLocaleTimeString()})`,
      publisher: 'User Uploaded Text',
      kind: 'user-text',
      credibilityScore: 0.75,
      publishedDate: new Date().toISOString(),
      text: pastedText.trim(),
      fetchedAt: new Date().toISOString(),
      status: 'ready'
    };

    addSource(newSource);
    setPastedText('');
    setPastedTitle('');
  };

  const isRunDisabled = sources.length < 2 || !question.trim();
  const runReason = !question.trim()
    ? 'Enter a research objective above'
    : sources.length < 2
    ? `Add at least 2 sources to cross-check (${sources.length}/2 added)`
    : '';

  return (
    <div className="space-y-10 py-6 sm:py-8 max-w-5xl mx-auto w-full">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-mono text-violet-300 uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span>RESEARCH AUDIT CONSOLE</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-black text-white tracking-wide">
          INPUT RESEARCH OBJECTIVE & SOURCES
        </h1>
        <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-xl mx-auto">
          Enter your high-stakes question and link source documents. Digital Dark Spot cross-references claims to uncover what is missing.
        </p>
      </div>

      {/* 1-Click Scenario Example Chips */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
          OR LOAD 1-CLICK CURATED EVALUATION SCENARIOS:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {ALL_EVALUATION_SCENARIOS.map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => loadScenario(sc.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-violet-600/30 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                    : 'noir-panel hover:bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-violet-400 animate-pulse' : 'bg-zinc-600'}`} />
                <span>{sc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Centered Glass Console: Large Textarea with Violet Glow Focus */}
      <div className="noir-panel-violet rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold tracking-widest uppercase text-violet-300">
            RESEARCH OBJECTIVE / DECISION GOAL
          </label>
          <span className="text-[10px] font-mono text-zinc-500">
            BE SPECIFIC REGARDING CRITERIA, DATES, FEES
          </span>
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What are the complete eligibility criteria, deadlines, income ceilings, and renewal requirements for the Aurora STEM Scholarship 2026?"
          rows={3}
          className="w-full rounded-2xl bg-black/60 border border-white/15 p-4 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all font-sans"
        />
      </div>

      {/* Source Ingestion Tabs & Form */}
      <div className="noir-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white">
              SOURCE DOCUMENTS ({sources.length})
            </span>
          </div>

          <div className="flex items-center space-x-1.5 p-1 rounded-full bg-black/40 border border-white/10">
            <button
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'url' ? 'bg-white/15 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              FETCH URL (SSRF GUARDED)
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'paste' ? 'bg-white/15 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              PASTE DOCUMENT TEXT
            </button>
          </div>
        </div>

        {/* Tab 1: URL Fetcher */}
        {activeTab === 'url' && (
          <form onSubmit={handleFetchUrl} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://official-authority.gov/guidelines-2026"
                  disabled={isFetching}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isFetching || !inputUrl.trim()}
                className="px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{isFetching ? 'INGESTING...' : 'INGEST SOURCE'}</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        )}

        {/* Tab 2: Paste Raw Text */}
        {activeTab === 'paste' && (
          <form onSubmit={handleAddPastedText} className="space-y-3">
            <input
              type="text"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
              placeholder="Document Title (e.g. University Financial Aid Advisory)"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all font-mono"
            />

            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste article text, circular announcement, or terms..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all font-sans"
            />

            <button
              type="submit"
              disabled={!pastedText.trim()}
              className="px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>ADD DOCUMENT</span>
            </button>
          </form>
        )}

        {/* List of Ingested Sources */}
        <div className="space-y-3 pt-2">
          {sources.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 font-mono text-xs border border-dashed border-white/10 rounded-2xl">
              No sources added yet. Ingest URLs or select a 1-click curated scenario above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {sources.map((src) => {
                const credPct = Math.round(src.credibilityScore * 100);
                const hasDate = Boolean(src.publishedDate || src.modifiedDate);
                const displayDate = src.modifiedDate || src.publishedDate;

                return (
                  <div
                    key={src.id}
                    className="noir-panel rounded-2xl p-4 border border-white/10 space-y-3 flex flex-col justify-between hover:border-violet-500/40 transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                          {src.kind}
                        </span>

                        <button
                          onClick={() => removeSource(src.id)}
                          className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove source"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {src.title}
                      </h4>

                      <p className="text-[11px] font-mono text-violet-300 truncate">
                        {src.publisher || 'Unknown Publisher'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1.5 text-[10px] font-mono text-zinc-400">
                      <div className="flex items-center justify-between">
                        <span>Credibility Score</span>
                        <span className="text-teal-400 font-bold">{credPct}%</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-teal-400"
                          style={{ width: `${credPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span>Timestamp</span>
                        {hasDate ? (
                          <span suppressHydrationWarning className="text-zinc-300">
                            {formatDateDeterministic(displayDate)}
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold">NO DATE FOUND</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Dock: Source count + RUN ANALYSIS CTA */}
      <div className="sticky bottom-6 z-30 flex items-center justify-center">
        <div className="noir-panel-violet rounded-full px-6 py-3 border border-violet-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {sources.length} {sources.length === 1 ? 'Source' : 'Sources'} Ready
            </span>
          </div>

          <button
            onClick={onRunAnalysis}
            disabled={isRunDisabled}
            className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center space-x-2 cursor-pointer"
            title={runReason}
          >
            <span>RUN ANALYSIS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
