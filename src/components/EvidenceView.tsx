'use client';

import React, { useState } from 'react';
import { Source, ExtractedFact } from '@/types';
import { ExternalLink, ShieldCheck, Quote } from 'lucide-react';

interface EvidenceViewProps {
  sources: Source[];
  facts: ExtractedFact[];
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({ sources, facts }) => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>('all');

  const filteredFacts = selectedSourceId === 'all'
    ? facts
    : facts.filter(f => f.sourceId === selectedSourceId);

  const getSource = (sourceId: string) => sources.find(s => s.id === sourceId);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <span>Source Evidence & Extracted Fact Repository</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {facts.length} Verified Facts
          </span>
        </h3>
        <p className="text-xs text-zinc-400">
          All findings are traceable directly to verbatim text extracted from the reviewed sources
        </p>
      </div>

      {/* Sources Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {sources.map((s) => {
          const isSelected = selectedSourceId === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setSelectedSourceId(isSelected ? 'all' : s.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all text-xs space-y-2.5 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500/50'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  {s.id.toUpperCase()}
                </span>
                {s.isOfficial ? (
                  <span className="flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Official Authority</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {s.reliability.replace('_', ' ')}
                  </span>
                )}
              </div>

              <div className="font-semibold text-white text-[13px] line-clamp-2">
                {s.title}
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-white/5">
                <span className="truncate max-w-[140px]">{s.domain}</span>
                <span className="font-mono text-zinc-300">{s.cycleOrYear || s.publishedDate || 'Undated'}</span>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <a
                  href={s.url.startsWith('http') ? s.url : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[10px] text-zinc-500">
                  {isSelected ? 'Filtering (click to clear)' : 'Click to filter'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter indicator */}
      {selectedSourceId !== 'all' && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs">
          <span className="text-indigo-200">
            Showing claims extracted exclusively from <strong className="text-white">{selectedSourceId.toUpperCase()}</strong>
          </span>
          <button
            onClick={() => setSelectedSourceId('all')}
            className="text-xs text-indigo-400 hover:text-white underline"
          >
            Show All Facts
          </button>
        </div>
      )}

      {/* Extracted Facts List */}
      <div className="space-y-3">
        {filteredFacts.map((fact) => {
          const src = getSource(fact.sourceId);
          return (
            <div
              key={fact.id}
              className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2.5 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                    [SOURCE FACT]
                  </span>
                  <span className="text-xs font-semibold text-zinc-300">
                    {fact.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-zinc-400">
                  <span className="font-mono text-indigo-400">{fact.sourceId.toUpperCase()}</span>
                  <span>•</span>
                  <span>{src ? src.domain : 'Source'}</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-white font-medium">
                {fact.claim}
              </div>

              {/* Exact Verbatim Quote */}
              <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-zinc-300 italic">
                <Quote className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">&ldquo;{fact.exactQuote}&rdquo;</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <span>Direct Citation Traceability</span>
                <span className="font-mono text-emerald-400">
                  {Math.round(fact.confidence * 100)}% Extraction Confidence
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

