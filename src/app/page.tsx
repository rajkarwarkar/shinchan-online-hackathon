'use client';

import React, { useState } from 'react';
import { SAMPLE_SCENARIOS } from '@/data/sampleScenarios';
import { AnalysisResult } from '@/types';
import { Header } from '@/components/Header';
import { Spline3DDashboard } from '@/components/Spline3DDashboard';
import { GapsView } from '@/components/GapsView';
import { ConflictsView } from '@/components/ConflictsView';
import { FreshnessView } from '@/components/FreshnessView';
import { EvidenceView } from '@/components/EvidenceView';
import { ChecklistView } from '@/components/ChecklistView';
import { HowItWorksModal } from '@/components/HowItWorksModal';

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
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />

      {/* Main Unified Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Error notification banner if any */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="underline font-medium">Dismiss</button>
          </div>
        )}

        {/* Master 3D Intelligence Dashboard Cockpit */}
        <Spline3DDashboard
          metrics={currentResult.metrics}
          topic={currentResult.topic}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSelectScenario={handleSelectScenario}
          onAnalyzeCustom={handleAnalyzeCustom}
          activeScenarioId={activeScenarioId}
          isLoading={isLoading}
        />

        {/* Active Analysis Detail Panel */}
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
