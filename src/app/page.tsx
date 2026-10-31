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
import { CosmicCTABanner } from '@/components/cosmic/CosmicCTABanner';
import { CosmicFooter } from '@/components/cosmic/CosmicFooter';
import { CosmicHackathonDashboard } from '@/components/cosmic/CosmicHackathonDashboard';
import { HowItWorksModal } from '@/components/HowItWorksModal';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = useState<'showcase' | 'dashboard'>('showcase');
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

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-100 flex flex-col selection:bg-purple-600 selection:text-white">
      
      {/* Global Fixed Cosmic Navigation matching the uploaded image */}
      <CosmicNavbar
        activeView={viewMode}
        onViewChange={setViewMode}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Floating Toggle Pill (Always accessible for judges) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const next = viewMode === 'showcase' ? 'dashboard' : 'showcase';
            setViewMode(next);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full btn-cosmic-purple text-xs font-bold text-white shadow-2xl border border-purple-400/40 backdrop-blur-md cursor-pointer hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
          <span>
            {viewMode === 'showcase' ? 'Switch to AI Cockpit ⚡' : 'Back to Agency Showcase 🌟'}
          </span>
        </button>
      </div>

      {/* Error notification banner if any */}
      {errorMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xl w-full px-4">
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between shadow-2xl backdrop-blur-xl">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="underline font-bold ml-2">Dismiss</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16">
        
        {viewMode === 'showcase' ? (
          /* SHOWCASE VIEW: 100% FAITHFUL REPLICA OF THE UPLOADED DESIGN */
          <div className="space-y-4">
            
            {/* Hero Section */}
            <CosmicHeroSection
              onGetStarted={() => {
                setViewMode('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onWatchShowreel={() => setIsHowItWorksOpen(true)}
            />

            {/* Stats Bar */}
            <CosmicStatsBar />

            {/* About Us Section */}
            <CosmicAboutSection
              onLearnMore={() => {
                setViewMode('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Our Services Section */}
            <CosmicServicesSection
              onSelectService={() => {
                // Smoothly route to dashboard for analysis
                setViewMode('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Results That Speak Louder */}
            <CosmicResultsSection
              onSeeCaseStudies={() => {
                setViewMode('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Featured Works */}
            <CosmicFeaturedWorksSection
              onSelectWork={() => {
                setViewMode('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Interactive Hackathon Evaluation Callout for Judges */}
            <section className="relative py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="cosmic-glass rounded-3xl p-6 sm:p-8 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase text-purple-300">
                      Shinchan Hackathon 2026 Live Engine
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Experience DarkSpot AI Intelligence Cockpit
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-xl">
                    Cross-examine multi-source publications, detect digital dark spots, highlight conflicting criteria, and generate actionable verification checklists.
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={() => {
                      setViewMode('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-full text-xs font-semibold text-white btn-cosmic-purple flex items-center space-x-2 shadow-lg shadow-purple-600/40 cursor-pointer"
                  >
                    <span>Launch AI Cockpit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Call To Action Banner */}
            <CosmicCTABanner
              onConsultation={() => {
                setViewMode('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

          </div>
        ) : (
          /* HACKATHON DASHBOARD VIEW: FULL SUITE OF DETECTION TOOLS IN PURPLE THEME */
          <div className="pt-4">
            <CosmicHackathonDashboard
              currentResult={currentResult}
              activeScenarioId={activeScenarioId}
              onSelectScenario={handleSelectScenario}
              onAnalyzeCustom={handleAnalyzeCustom}
              isLoading={isLoading}
              onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Global Footer matching the image */}
      <CosmicFooter
        onNavClick={(target) => {
          if (target === 'Case Studies' || target === 'Services') {
            setViewMode('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setViewMode('showcase');
          }
        }}
      />

      {/* Methodology / Problem Statement Rubric Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

    </div>
  );
}
