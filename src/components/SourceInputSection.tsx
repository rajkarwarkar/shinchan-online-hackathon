'use client';

import React, { useState } from 'react';
import { SAMPLE_SCENARIOS } from '@/data/sampleScenarios';
import { Search, Trash2, Globe, FileText, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

interface CustomSourceItem {
  id: string;
  type: 'url' | 'text';
  title: string;
  url: string;
  content: string;
}

interface SourceInputSectionProps {
  onSelectScenario: (scenarioId: string) => void;
  onAnalyzeCustom: (topic: string, sources: Array<{ title: string; url?: string; content?: string }>) => void;
  isLoading: boolean;
  activeScenarioId?: string;
}

export const SourceInputSection: React.FC<SourceInputSectionProps> = ({
  onSelectScenario,
  onAnalyzeCustom,
  isLoading,
  activeScenarioId
}) => {
  const [topic, setTopic] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [sources, setSources] = useState<CustomSourceItem[]>([
    { id: '1', type: 'url', title: 'Official Guideline Portal', url: 'https://example-university.edu/admissions/aid', content: '' },
    { id: '2', type: 'text', title: 'Student Forum Advice Snippet', url: '', content: 'Application deadline is Nov 1st according to last cycle. You must have 3 letters of reference.' }
  ]);

  const handleAddSource = (type: 'url' | 'text') => {
    setSources(prev => [
      ...prev,
      {
        id: String(Date.now()),
        type,
        title: type === 'url' ? 'New Source URL' : 'New Source Text',
        url: '',
        content: ''
      }
    ]);
  };

  const handleRemoveSource = (id: string) => {
    if (sources.length <= 1) return;
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const handleSourceChange = (id: string, field: 'title' | 'url' | 'content', value: string) => {
    setSources(prev => prev.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const payload = sources.map(s => ({
      title: s.title || (s.type === 'url' ? s.url : 'Pasted Document'),
      url: s.type === 'url' ? s.url : undefined,
      content: s.content
    }));

    onAnalyzeCustom(topic, payload);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 1-Click Judge Quick Presets Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-indigo-500/20 bg-gradient-to-r from-indigo-950/20 via-zinc-900/40 to-violet-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">
              Instant 1-Click Evaluation Scenarios
            </span>
          </div>
          <span className="text-xs text-zinc-400">
            Click to run complete gap & conflict analysis instantly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_SCENARIOS.map((sc) => {
            const isActive = activeScenarioId === sc.id && !isCustomMode;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  onSelectScenario(sc.id);
                }}
                disabled={isLoading}
                className={`text-left p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-600/15 ring-1 ring-indigo-500/50'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-[13px]">{sc.name}</span>
                  {isActive && (
                    <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </div>
                <p className="text-zinc-400 line-clamp-2 leading-relaxed">
                  {sc.shortDesc}
                </p>
                <div className="pt-1 text-[11px] font-medium text-indigo-300 flex items-center space-x-1">
                  <span>Load scenario</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsCustomMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !isCustomMode
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            Curated Showcase Mode
          </button>
          <button
            type="button"
            onClick={() => setIsCustomMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isCustomMode
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            Custom Topic & URL Ingestion
          </button>
        </div>

        {isCustomMode && (
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Paste URLs or raw excerpt text to cross-examine
          </span>
        )}
      </div>

      {/* Custom Input Form (Visible when Custom Mode active) */}
      {isCustomMode && (
        <form onSubmit={handleSubmitCustom} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Research Question or Decision Goal
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. What should I verify before applying for the 2026 State AI Research Grant?"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Sources List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Source Material ({sources.length} Added)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleAddSource('url')}
                  className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors"
                >
                  <Globe className="w-3 h-3 text-indigo-400" />
                  <span>+ Add URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSource('text')}
                  className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors"
                >
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span>+ Paste Text</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {sources.map((s, idx) => (
                <div key={s.id} className="p-3.5 rounded-xl bg-zinc-900/70 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                        SRC-{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={s.title}
                        onChange={e => handleSourceChange(s.id, 'title', e.target.value)}
                        placeholder="Source Title / Name"
                        className="text-xs bg-transparent border-b border-zinc-700 focus:border-indigo-500 focus:outline-none text-zinc-200 px-1 py-0.5 flex-1"
                      />
                    </div>
                    {sources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(s.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {s.type === 'url' ? (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <input
                        type="url"
                        value={s.url}
                        onChange={e => handleSourceChange(s.id, 'url', e.target.value)}
                        placeholder="https://official-source.gov/rules-2026"
                        className="w-full text-xs px-3 py-1.5 rounded-lg bg-zinc-950/70 border border-white/10 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                        required
                      />
                    </div>
                  ) : (
                    <textarea
                      value={s.content}
                      onChange={e => handleSourceChange(s.id, 'content', e.target.value)}
                      placeholder="Paste excerpt, policy clause, or guidelines from this source..."
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-lg bg-zinc-950/70 border border-white/10 text-zinc-200 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Dark Spots across Sources...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Run Gap & Conflict Analysis</span>
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
};

