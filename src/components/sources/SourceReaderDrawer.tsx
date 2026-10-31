'use client';

import React, { useEffect, useRef } from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { X, ExternalLink, ShieldCheck, Calendar, Globe, FileText, Quote } from 'lucide-react';
import { formatDateDeterministic } from '@/lib/dates/format';

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
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Slide-in Drawer Container (Right-side Dark Glass Drawer) */}
      <div className="relative w-full max-w-2xl bg-[#080512]/95 border-l border-white/10 h-full shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-black/40">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {source.kind}
              </span>
              <span className="text-xs font-mono text-zinc-400 truncate">
                {source.publisher || 'Direct Source Text'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              {source.title}
            </h3>
          </div>

          <button
            onClick={closeSourceDrawer}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Metadata & Credibility Bar */}
        <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-teal-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{Math.round(source.credibilityScore * 100)}% Credibility</span>
            </span>

            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span suppressHydrationWarning>
                {hasDate ? formatDateDeterministic(displayDate) : 'No date detected'}
              </span>
            </span>
          </div>

          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-violet-300 hover:text-white text-xs font-medium"
            >
              <span className="truncate max-w-[180px]">Visit Source Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Highlighted Passage Banner */}
        {highlightedQuote && (
          <div className="px-6 py-3 bg-violet-950/20 border-b border-violet-500/20 flex items-center justify-between text-xs text-violet-200 font-mono">
            <span className="flex items-center space-x-2">
              <Quote className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              <span className="truncate">Active cited passage auto-scrolled below</span>
            </span>
          </div>
        )}

        {/* Document Reader Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
          {renderContent()}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
          <span>DIGITAL DARK SPOT · VERBATIM PASSAGE INSPECTION</span>
          <span>ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  );
};
