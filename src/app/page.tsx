'use client';

import React, { useState } from 'react';
import { SAMPLE_SCENARIOS } from '@/data/sampleScenarios';
import { AnalysisResult } from '@/types';
import { Spline3DDashboard } from '@/components/Spline3DDashboard';
import { GapsView } from '@/components/GapsView';
import { ConflictsView } from '@/components/ConflictsView';
import { FreshnessView } from '@/components/FreshnessView';
import { EvidenceView } from '@/components/EvidenceView';
import { ChecklistView } from '@/components/ChecklistView';
import { HowItWorksModal } from '@/components/HowItWorksModal';
import { X } from 'lucide-react';

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scholarship-2026');
  const [currentResult, setCurrentResult] = useState<AnalysisResult>(
    SAMPLE_SCENARIOS[0].precomputedResult
  );
  const [activeTab, setActiveTab] = useState<'gaps' | 'conflicts' | 'freshness' | 'evidence' | 'checklist' | 'none'>('gaps');
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
    <div className="relative min-h-screen w-full bg-[#07080c] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Master Fullscreen 3D Spline Dashboard Covering Whole Website */}
      <Spline3DDashboard
        metrics={currentResult.metrics}
        topic={currentResult.topic}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSelectScenario={handleSelectScenario}
        onAnalyzeCustom={handleAnalyzeCustom}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        activeScenarioId={activeScenarioId}
        isLoading={isLoading}
      />

      {/* Error notification banner if any */}
      {errorMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-3 shadow-2xl backdrop-blur-xl">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="underline font-medium">Dismiss</button>
        </div>
      )}

      {/* 2. Slide-up Detail Investigation Panel (Opens when tab is active) */}
      {activeTab !== 'none' && (
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-black/75 backdrop-blur-3xl shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 duration-300">
            
            {/* Panel Header with Close Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                  Detailed Evidence & Audit Stream
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400 font-mono">
                  View Mode: {activeTab.toUpperCase()}
                </span>
              </div>

              <button
                onClick={() => setActiveTab('none')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <span>Collapse Panel</span>
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>

            {/* Active Tab View Body */}
            <div>
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
        </div>
      )}

      {/* How it Works / Problem Background Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

    </div>
  );
}
