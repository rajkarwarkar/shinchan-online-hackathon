'use client';

import React, { useState } from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { Source } from '@/types';
import { formatDateDeterministic } from '@/lib/dates/format';
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
  BookOpen
} from 'lucide-react';

export const SourceManager: React.FC = () => {
  const { sources, addSource, removeSource, openSourceDrawer } = useDarkSpotStore();
  
  const [activeTab, setActiveTab] = useState<'url' | 'paste'>('url');
  const [inputUrl, setInputUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFetchUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setErrorMessage(null);
    setIsFetching(true);

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() })
      });

      const json = await res.json();
      if (json.success && json.data) {
        addSource(json.data as Source);
        setInputUrl('');
      } else {
        setErrorMessage(json.error || 'Failed to ingest URL.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error fetching URL.');
    } finally {
      setIsFetching(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    setErrorMessage(null);
    setIsFetching(true);

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pastedText.trim(), title: pastedTitle.trim() || undefined })
      });

      const json = await res.json();
      if (json.success && json.data) {
        addSource(json.data as Source);
        setPastedText('');
        setPastedTitle('');
      } else {
        setErrorMessage(json.error || 'Failed to process pasted text.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error processing text.');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Box Card */}
      <div className="darkspot-panel rounded-3xl p-5 sm:p-7 border border-white/10 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Multi-Source Document Ingestion</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Add at least 2 web documents or guidelines to cross-examine.
            </p>
          </div>

          {/* URL vs Paste Tab Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => { setActiveTab('url'); setErrorMessage(null); }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'url' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Web URL
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('paste'); setErrorMessage(null); }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'paste' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* Tab 1: URL Fetch */}
        {activeTab === 'url' && (
          <form onSubmit={handleFetchUrl} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://official-authority.gov/guidelines-2026"
                disabled={isFetching}
                className="flex-1 text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={isFetching || !inputUrl.trim()}
                className="px-5 py-3 rounded-xl text-xs font-semibold text-black bg-amber-500 hover:bg-amber-400 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-lg shadow-amber-500/20 shrink-0"
              >
                {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Fetch & Audit</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Protected by SSRF guard: 8s timeout, 2MB cap, private IP filters.
            </p>
          </form>
        )}

        {/* Tab 2: Paste Raw Text */}
        {activeTab === 'paste' && (
          <form onSubmit={handlePasteSubmit} className="space-y-3">
            <input
              type="text"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
              placeholder="Document Title (e.g. State Grant Advisory 2026)"
              disabled={isFetching}
              className="w-full text-xs p-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <textarea
              rows={4}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste terms, PDF excerpts, or policy guidelines here..."
              disabled={isFetching}
              className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono resize-y"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isFetching || !pastedText.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-amber-500 hover:bg-amber-400 disabled:opacity-50 flex items-center space-x-2 cursor-pointer transition-colors"
              >
                {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>Ingest Text Document</span>
              </button>
            </div>
          </form>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-zinc-400 hover:text-white text-xs underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Sources List Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Ingested Sources for Cross-Examination ({sources.length})
          </span>
          {sources.length < 2 && (
            <span className="text-amber-400 text-[11px] font-mono">
              ⚠️ Minimum 2 sources required to run gap & conflict detection
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sources.map((src) => {
            const hasDate = Boolean(src.publishedDate || src.modifiedDate);
            const displayDate = src.modifiedDate || src.publishedDate;
            const credPercent = Math.round(src.credibilityScore * 100);

            return (
              <div
                key={src.id}
                className="darkspot-panel darkspot-panel-hover rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-3 relative group"
              >
                {/* Header: Publisher & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                      {src.kind}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 pt-1 leading-snug">
                      {src.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => removeSource(src.id)}
                    title="Remove Source"
                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Metadata & Credibility Meter */}
                <div className="space-y-2 pt-2 border-t border-white/5 text-[11px]">
                  {/* Credibility Score */}
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-teal-400" />
                      <span>Credibility</span>
                    </span>
                    <span className="font-mono font-bold text-teal-300">{credPercent}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                      style={{ width: `${credPercent}%` }}
                    />
                  </div>

                  {/* Temporal Status */}
                  <div className="flex items-center justify-between text-zinc-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>Timestamp</span>
                    </span>
                    {hasDate ? (
                      <span suppressHydrationWarning className="font-mono text-zinc-300 text-[10px]">
                        {formatDateDeterministic(displayDate)}
                      </span>
                    ) : (
                      <span className="font-mono text-amber-400 text-[10px] font-semibold">
                        Undated
                      </span>
                    )}
                  </div>

                  {src.detectedCycleLabel && (
                    <div className="text-[10px] font-mono text-purple-300 bg-purple-950/30 border border-purple-500/20 px-2 py-0.5 rounded-md inline-block">
                      {src.detectedCycleLabel}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => openSourceDrawer(src)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Full Text</span>
                  </button>

                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white transition-colors"
                      title="Open Original Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

