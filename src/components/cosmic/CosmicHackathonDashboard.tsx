'use client';

import React, { useState } from 'react';
import { 
  AnalysisResult, 
  DarkSpotMetrics 
} from '@/types';
import { SAMPLE_SCENARIOS } from '@/data/sampleScenarios';
import { GapsView } from '@/components/GapsView';
import { ConflictsView } from '@/components/ConflictsView';
import { FreshnessView } from '@/components/FreshnessView';
import { EvidenceView } from '@/components/EvidenceView';
import { ChecklistView } from '@/components/ChecklistView';
import { 
  AlertTriangle, 
  Layers, 
  CalendarClock, 
  FileCheck, 
  CheckSquare, 
  Sparkles, 
  Search, 
  Globe, 
  Plus, 
  Trash2, 
  Loader2, 
  X, 
  HelpCircle
} from 'lucide-react';

interface CosmicHackathonDashboardProps {
  currentResult: AnalysisResult;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onAnalyzeCustom: (topic: string, sources: Array<{ title: string; url?: string; content?: string }>) => void;
  isLoading: boolean;
  onOpenHowItWorks: () => void;
}

export const CosmicHackathonDashboard: React.FC<CosmicHackathonDashboardProps> = ({
  currentResult,
  activeScenarioId,
  onSelectScenario,
  onAnalyzeCustom,
  isLoading,
  onOpenHowItWorks
}) => {
  const [activeTab, setActiveTab] = useState<'gaps' | 'conflicts' | 'freshness' | 'evidence' | 'checklist'>('gaps');
  const [customInputOpen, setCustomInputOpen] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [customSources, setCustomSources] = useState<Array<{ id: string; url: string; title: string }>>([
    { id: '1', url: 'https://example-guidelines.edu/scholarship-rules', title: 'Official Source' },
    { id: '2', url: 'https://forum.org/advice-and-deadlines', title: 'Community Source' }
  ]);

  const metrics: DarkSpotMetrics = currentResult.metrics;

  const handleAddSource = () => {
    setCustomSources(prev => [
      ...prev,
      { id: String(Date.now()), url: '', title: `Source ${prev.length + 1}` }
    ]);
  };

  const handleRemoveSource = (id: string) => {
    if (customSources.length <= 1) return;
    setCustomSources(prev => prev.filter(s => s.id !== id));
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    onAnalyzeCustom(
      customTopic,
      customSources.map(s => ({ title: s.title, url: s.url }))
    );
    setCustomInputOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Title Bar */}
      <div className="cosmic-glass rounded-3xl p-6 sm:p-8 border border-purple-500/25 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-500/15 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase text-purple-300 tracking-wider">
                  Live Intelligence Matrix
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400">Shinchan Hackathon 2026</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {currentResult.topic}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setCustomInputOpen(!customInputOpen)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                  customInputOpen 
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30' 
                    : 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 border-purple-500/30'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-purple-300" />
                <span>{customInputOpen ? 'Close Scraper' : 'Scrape Custom URLs'}</span>
              </button>

              <button
                onClick={onOpenHowItWorks}
                className="flex items-center space-x-1 px-3.5 py-2 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Problem Statement Rubric</span>
              </button>
            </div>
          </div>

          {/* Metrics & Completeness Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Progress Gauge */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex justify-between text-xs text-zinc-300 font-medium">
                <span>Verified Sourced Coverage: <strong className="text-purple-300">{metrics.completenessScore}%</strong></span>
                <span className="text-rose-400 font-mono">{100 - metrics.completenessScore}% Dark Spot Area</span>
              </div>
              
              <div className="w-full bg-[#14082c] rounded-full h-3.5 overflow-hidden border border-purple-500/20 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-400 rounded-full transition-all duration-700 shadow-md"
                  style={{ width: `${metrics.completenessScore}%` }}
                />
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {metrics.summaryVerdict}
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="lg:col-span-7 grid grid-cols-3 gap-3">
              
              <button
                onClick={() => setActiveTab('gaps')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeTab === 'gaps'
                    ? 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/50 shadow-lg shadow-rose-950/50'
                    : 'border-purple-500/15 bg-purple-950/20 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-rose-400 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase">GAPS</span>
                </div>
                <div className="text-2xl font-black text-white">{metrics.criticalGapsCount + metrics.moderateGapsCount}</div>
                <div className="text-[11px] text-zinc-400 truncate">Missing facets</div>
              </button>

              <button
                onClick={() => setActiveTab('conflicts')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeTab === 'conflicts'
                    ? 'border-amber-500 bg-amber-950/40 ring-2 ring-amber-500/50 shadow-lg shadow-amber-950/50'
                    : 'border-purple-500/15 bg-purple-950/20 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <Layers className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase">CLASH</span>
                </div>
                <div className="text-2xl font-black text-white">{metrics.conflictsCount}</div>
                <div className="text-[11px] text-zinc-400 truncate">Contradictions</div>
              </button>

              <button
                onClick={() => setActiveTab('freshness')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeTab === 'freshness'
                    ? 'border-orange-500 bg-orange-950/40 ring-2 ring-orange-500/50 shadow-lg shadow-orange-950/50'
                    : 'border-purple-500/15 bg-purple-950/20 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-orange-400 mb-1">
                  <CalendarClock className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase">STALE</span>
                </div>
                <div className="text-2xl font-black text-white">{metrics.temporalWarningsCount}</div>
                <div className="text-[11px] text-zinc-400 truncate">Outdated cycles</div>
              </button>

            </div>

          </div>

          {/* 1-Click Evaluation Scenarios for Judges */}
          <div className="pt-4 border-t border-purple-500/15 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center space-x-1.5 text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Instant 1-Click Benchmark Scenarios for Judges:</span>
              </span>
              <span className="text-[10px] text-zinc-500 lowercase">Zero-latency precomputed evaluation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_SCENARIOS.map((sc) => {
                const isSelected = activeScenarioId === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => onSelectScenario(sc.id)}
                    className={`p-3 rounded-2xl text-left border transition-all text-xs space-y-1 ${
                      isSelected
                        ? 'border-purple-400 bg-purple-600/30 text-white ring-2 ring-purple-500/50 shadow-lg shadow-purple-600/30'
                        : 'border-purple-500/15 bg-purple-950/20 text-zinc-300 hover:border-purple-500/30 hover:bg-purple-950/40'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{sc.name}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />}
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">
                      {sc.shortDesc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Expandable Custom URL Scraper Modal */}
      {customInputOpen && (
        <div className="cosmic-glass rounded-3xl p-6 border border-purple-500/30 bg-[#0d041c]/95 shadow-2xl">
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Custom Source Scraper & Cross-Examiner</span>
              </span>
              <button
                type="button"
                onClick={() => setCustomInputOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                Your Research Question or Decision Goal
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                placeholder="e.g. What are the unstated prerequisites and renewal rules for the 2026 AI Grant?"
                className="w-full text-xs p-3 rounded-xl bg-[#14082c] border border-purple-500/25 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase">
                Web Sources to Cross-Examine ({customSources.length})
              </label>
              {customSources.map((s, idx) => (
                <div key={s.id} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={s.url}
                    onChange={e => {
                      const val = e.target.value;
                      setCustomSources(prev => prev.map(item => item.id === s.id ? { ...item, url: val } : item));
                    }}
                    placeholder={`https://source-${idx + 1}.edu/guidelines`}
                    className="flex-1 text-xs p-2.5 rounded-lg bg-[#14082c] border border-purple-500/20 text-white font-mono focus:outline-none focus:border-purple-400"
                    required
                  />
                  {customSources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(s.id)}
                      className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleAddSource}
                className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Another Source URL</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || !customTopic.trim()}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white btn-cosmic-purple disabled:opacity-50 flex items-center space-x-2 shadow-lg shadow-purple-600/30"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Scan for Dark Spots & Contradictions</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Bar */}
      <div className="border-b border-purple-500/20 flex items-center space-x-2 overflow-x-auto no-scrollbar pt-2">
        
        <button
          onClick={() => setActiveTab('gaps')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'gaps'
              ? 'border-rose-500 text-white font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 ${activeTab === 'gaps' ? 'text-rose-400' : 'text-zinc-500'}`} />
          <span>Information Gaps (Dark Spots)</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
            {currentResult.gaps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('conflicts')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'conflicts'
              ? 'border-amber-500 text-white font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeTab === 'conflicts' ? 'text-amber-400' : 'text-zinc-500'}`} />
          <span>Contradiction Radar</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            {currentResult.conflicts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('freshness')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'freshness'
              ? 'border-orange-500 text-white font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <CalendarClock className={`w-4 h-4 ${activeTab === 'freshness' ? 'text-orange-400' : 'text-zinc-500'}`} />
          <span>Temporal & Freshness Audit</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
            {currentResult.temporalWarnings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'evidence'
              ? 'border-emerald-500 text-white font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileCheck className={`w-4 h-4 ${activeTab === 'evidence' ? 'text-emerald-400' : 'text-zinc-500'}`} />
          <span>Evidence & Sourced Facts</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            {currentResult.facts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'checklist'
              ? 'border-purple-400 text-white font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <CheckSquare className={`w-4 h-4 ${activeTab === 'checklist' ? 'text-purple-400' : 'text-zinc-500'}`} />
          <span>Verification Checklist</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
            {currentResult.checklist.length}
          </span>
        </button>

      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'gaps' && <GapsView gaps={currentResult.gaps} />}
        {activeTab === 'conflicts' && (
          <ConflictsView conflicts={currentResult.conflicts} sources={currentResult.sources} />
        )}
        {activeTab === 'freshness' && (
          <FreshnessView warnings={currentResult.temporalWarnings} sources={currentResult.sources} />
        )}
        {activeTab === 'evidence' && (
          <EvidenceView sources={currentResult.sources} facts={currentResult.facts} />
        )}
        {activeTab === 'checklist' && (
          <ChecklistView tasks={currentResult.checklist} fullResult={currentResult} />
        )}
      </div>

    </div>
  );
};
