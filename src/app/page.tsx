'use client';

import React, { useState } from 'react';
import { SAMPLE_SCENARIOS } from '@/data/sampleScenarios';
import { AnalysisResult } from '@/types';
import { Header } from '@/components/Header';
import { MetricsOverview } from '@/components/MetricsOverview';
import { SourceInputSection } from '@/components/SourceInputSection';
import { GapsView } from '@/components/GapsView';
import { ConflictsView } from '@/components/ConflictsView';
import { FreshnessView } from '@/components/FreshnessView';
import { EvidenceView } from '@/components/EvidenceView';
import { ChecklistView } from '@/components/ChecklistView';
import { HowItWorksModal } from '@/components/HowItWorksModal';
import { Spline3DHero } from '@/components/Spline3DHero';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CalendarClock, 
  FileCheck, 
  CheckSquare
} from 'lucide-react';

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scholarship-2026');
  const [currentResult, setCurrentResult] = useState<AnalysisResult>(
    SAMPLE_SCENARIOS[0].precomputedResult
  );
  const [activeTab, setActiveTab] = useState<'gaps' | 'conflicts' | 'freshness' | 'evidence' | 'checklist'>('gaps');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  // Handle selecting a preset scenario
  const handleSelectScenario = async (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentResult(data.data);
      } else {
        const local = SAMPLE_SCENARIOS.find(s => s.id === scenarioId);
        if (local) setCurrentResult(local.precomputedResult);
      }
    } catch {
      const local = SAMPLE_SCENARIOS.find(s => s.id === scenarioId);
      if (local) setCurrentResult(local.precomputedResult);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle custom analysis
  const handleAnalyzeCustom = async (
    topic: string,
    sources: Array<{ title: string; url?: string; content?: string }>
  ) => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, sources })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentResult(data.data);
        setActiveScenarioId('');
      } else {
        setErrorMsg(data.error || 'Failed to complete analysis.');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Analysis request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error notification banner if any */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="underline font-medium">Dismiss</button>
          </div>
        )}

        {/* Interactive 3D Spline Information Radar */}
        <Spline3DHero
          completenessScore={currentResult.metrics.completenessScore}
          gapsCount={currentResult.gaps.length}
          conflictsCount={currentResult.conflicts.length}
        />

        {/* Input & Scenario Selector */}
        <SourceInputSection
          onSelectScenario={handleSelectScenario}
          onAnalyzeCustom={handleAnalyzeCustom}
          isLoading={isLoading}
          activeScenarioId={activeScenarioId}
        />

        {/* Dashboard Top Metrics */}
        <MetricsOverview
          metrics={currentResult.metrics}
          topic={currentResult.topic}
        />

        {/* Tab Navigation */}
        <div className="border-b border-white/10 flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar pt-2">
          
          <button
            onClick={() => setActiveTab('gaps')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'gaps'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${activeTab === 'gaps' ? 'text-rose-400' : 'text-zinc-500'}`} />
            <span>Information Gaps (Dark Spots)</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
              {currentResult.gaps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('conflicts')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'conflicts'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${activeTab === 'conflicts' ? 'text-amber-400' : 'text-zinc-500'}`} />
            <span>Contradiction Radar</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              {currentResult.conflicts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('freshness')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'freshness'
                ? 'border-orange-500 text-white font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CalendarClock className={`w-4 h-4 ${activeTab === 'freshness' ? 'text-orange-400' : 'text-zinc-500'}`} />
            <span>Temporal & Freshness Audit</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
              {currentResult.temporalWarnings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'evidence'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCheck className={`w-4 h-4 ${activeTab === 'evidence' ? 'text-emerald-400' : 'text-zinc-500'}`} />
            <span>Evidence & Sourced Facts</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {currentResult.facts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'checklist'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckSquare className={`w-4 h-4 ${activeTab === 'checklist' ? 'text-indigo-400' : 'text-zinc-500'}`} />
            <span>Verification Checklist</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              {currentResult.checklist.length}
            </span>
          </button>

        </div>

        {/* Tab Content Panels */}
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

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-6 mt-16 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-zinc-300">DarkSpot AI</span>
            <span>•</span>
            <span>Shinchan Online Hackathon 2026 Official Project</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-zinc-400">
              Scoring Aligned with Official 10-Mark Rubric
            </span>
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Methodology
            </button>
          </div>
        </div>
      </footer>

      {/* How it Works / Problem Background Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

    </div>
  );
}
