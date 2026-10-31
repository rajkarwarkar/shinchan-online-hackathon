'use client';

import React, { useState } from 'react';
import { SAMPLE_SCENARIOS } from '@/data/sampleScenarios';
import { AnalysisResult } from '@/types';
import { CosmicNavbar } from '@/components/cosmic/CosmicNavbar';
import { CosmicHeroSection } from '@/components/cosmic/CosmicHeroSection';
import { CosmicStatsBar } from '@/components/cosmic/CosmicStatsBar';
import { CosmicAboutSection } from '@/components/cosmic/CosmicAboutSection';
import { CosmicServicesSection } from '@/components/cosmic/CosmicServicesSection';
import { CosmicResultsSection } from '@/components/cosmic/CosmicResultsSection';
import { CosmicFeaturedWorksSection } from '@/components/cosmic/CosmicFeaturedWorksSection';
import { CosmicHackathonDashboard } from '@/components/cosmic/CosmicHackathonDashboard';
import { CosmicCTABanner } from '@/components/cosmic/CosmicCTABanner';
import { CosmicFooter } from '@/components/cosmic/CosmicFooter';
import { HowItWorksModal } from '@/components/HowItWorksModal';

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scholarship-2026');
  const [currentResult, setCurrentResult] = useState<AnalysisResult>(
    SAMPLE_SCENARIOS[0].precomputedResult
  );
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

  const scrollToRadar = () => {
    const el = document.getElementById('radar');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-100 flex flex-col selection:bg-purple-600 selection:text-white">
      
      {/* Navigation matching the uploaded reference design */}
      <CosmicNavbar
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onScrollToRadar={scrollToRadar}
      />

      {/* Error notification banner if any */}
      {errorMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xl w-full px-4">
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between shadow-2xl backdrop-blur-xl">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="underline font-bold ml-2">Dismiss</button>
          </div>
        </div>
      )}

      {/* Main Single-Page Unified Experience */}
      <main className="flex-1 w-full pt-14 space-y-4">
        
        {/* 1. Hero Section: Information Gap Detection Intelligence */}
        <CosmicHeroSection
          onLaunchRadar={scrollToRadar}
          onWatchRubric={() => setIsHowItWorksOpen(true)}
        />

        {/* 2. Stats Bar: Dark Spots, Traceability, Rubric, Tokens */}
        <CosmicStatsBar />

        {/* 3. About Section: Why Evaluating the Unsaid Matters */}
        <CosmicAboutSection
          onLearnMore={() => setIsHowItWorksOpen(true)}
        />

        {/* 4. Core Capabilities: Gap Detection, Contradiction Radar, Freshness, Evidence, Checklist */}
        <CosmicServicesSection
          onSelectCapability={scrollToRadar}
        />

        {/* 5. Results That Speak Louder: Benchmark Accuracy & Catch Rate Charts */}
        <CosmicResultsSection
          onSeeCaseStudies={() => {
            const el = document.getElementById('benchmarks');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 6. Featured Benchmark Scenarios: STEM Scholarship (PDF Official), STEM OPT, EV Rebate */}
        <CosmicFeaturedWorksSection
          onSelectScenario={handleSelectScenario}
          activeScenarioId={activeScenarioId}
        />

        {/* 7. LIVE INTERACTIVE RADAR & CROSS-EXAMINATION ENGINE EMBEDDED DIRECTLY IN PAGE */}
        <section id="radar" className="relative scroll-mt-20">
          <CosmicHackathonDashboard
            currentResult={currentResult}
            activeScenarioId={activeScenarioId}
            onSelectScenario={handleSelectScenario}
            onAnalyzeCustom={handleAnalyzeCustom}
            isLoading={isLoading}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        </section>

        {/* 8. Call To Action Banner: Audit Your Sources */}
        <CosmicCTABanner
          onAnalyzeCustom={scrollToRadar}
        />

      </main>

      {/* Global Footer */}
      <CosmicFooter
        onNavClick={scrollToRadar}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Problem Statement 10-Mark Rubric Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

    </div>
  );
}
