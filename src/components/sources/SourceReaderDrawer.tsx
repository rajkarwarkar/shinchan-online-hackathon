'use client';

import React, { useEffect, useRef } from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { X, ExternalLink, ShieldCheck, Calendar, Globe, FileText } from 'lucide-react';

export const SourceReaderDrawer: React.FC = () => {
  const { isSourceDrawerOpen, selectedSourceForDrawer, highlightedQuote, closeSourceDrawer } =
    useDarkSpotStore();

  const highlightRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isSourceDrawerOpen && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }
  }, [isSourceDrawerOpen, highlightedQuote]);

  if (!isSourceDrawerOpen || !selectedSourceForDrawer) return null;

  const source = selectedSourceForDrawer;
  const hasDate = Boolean(source.publishedDate || source.modifiedDate);
  const displayDate = source.modifiedDate || source.publishedDate;

  // Render text with highlighting if a quote was cited
  const renderContent = () => {
    if (!highlightedQuote) {
      return (
        <div className="whitespace-pre-wrap font-sans text-xs text-zinc-300 leading-relaxed space-y-4">
          {source.text}
        </div>
      );
    }

    const cleanQuote = highlightedQuote.trim();
    const text = source.text;
    const index = text.toLowerCase().indexOf(cleanQuote.toLowerCase());

    if (index === -1) {
      return (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono">
            ⚠️ Note: Approximate or summarized quote cited. Full text below:
          </div>
          <div className="whitespace-pre-wrap font-sans text-xs text-zinc-300 leading-relaxed">
            {text}
          </div>
        </div>
      );
    }

    const before = text.slice(0, index);
    const match = text.slice(index, index + cleanQuote.length);
    const after = text.slice(index + cleanQuote.length);

    return (
      <div className="whitespace-pre-wrap font-sans text-xs text-zinc-300 leading-relaxed">
        {before}
        <mark ref={highlightRef} className="source-highlight">
          {match}
        </mark>
        {after}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeSourceDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-in Drawer Container */}
      <div className="relative w-full max-w-2xl bg-[#0E141D] border-l border-white/10 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-start justify-between gap-3 bg-[#0B0F14]/90">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {source.kind}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {source.publisher}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white leading-snug">
              {source.title}
            </h3>
          </div>

          <button
            onClick={closeSourceDrawer}
            className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Provenance & Credibility Strip */}
        <div className="px-5 py-3 border-b border-white/5 bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-teal-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{Math.round(source.credibilityScore * 100)}% Credibility</span>
            </span>

            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {hasDate ? new Date(displayDate!).toLocaleDateString() : 'No date detected'}
              </span>
            </span>
          </div>

          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 text-xs font-medium"
            >
              <span>Open Original</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="flex items-center space-x-1 text-zinc-500">
              <FileText className="w-3.5 h-3.5" />
              <span>User Pasted Document</span>
            </span>
          )}
        </div>

        {/* Cited Quote Callout Banner (if drawer opened from quote) */}
        {highlightedQuote && (
          <div className="m-4 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
              <span>Audited Passage:</span>
            </div>
            <p className="text-xs text-amber-200 font-mono italic leading-relaxed">
              &quot;{highlightedQuote}&quot;
            </p>
          </div>
        )}

        {/* Document Body Reader */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {renderContent()}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-white/5 bg-[#0B0F14] text-[11px] text-zinc-500 flex justify-between">
          <span>Deterministic Quote Locator: verified exact character offset.</span>
          <span>{source.text.length} characters</span>
        </div>

      </div>
    </div>
  );
};
