'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { NoirFrame } from '@/components/chrome/NoirFrame';
import { FloatingNav } from '@/components/chrome/FloatingNav';
import { LandingView } from '@/components/chrome/LandingView';
import { WorkspaceView } from '@/components/chrome/WorkspaceView';
import { DashboardView } from '@/components/chrome/DashboardView';
import { AnalysisProgressView } from '@/components/chrome/AnalysisProgressView';
import { SourceReaderDrawer } from '@/components/sources/SourceReaderDrawer';
import { WhyGapsMatterModal } from '@/components/modals/WhyGapsMatterModal';
import { ReportExportModal } from '@/components/modals/ReportExportModal';
import { motion } from 'framer-motion';

function HomeContent() {
  const searchParams = useSearchParams();
  const { 
    currentView, 
    setCurrentView, 
    isAnalyzing, 
    setIsAnalyzing, 
    analysisStage,
    question,
    sources,
    aspects,
    setReport,
    loadSampleMode,
    setAiError
  } = useDarkSpotStore();

  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'dashboard') {
      loadSampleMode();
      setCurrentView('dashboard');
    } else if (viewParam === 'workspace') {
      setCurrentView('workspace');
    }
  }, [searchParams, setCurrentView, loadSampleMode]);

  // Real pipeline analysis trigger
  const handleRunAnalysis = async () => {
    if (sources.length < 2 || !question.trim()) return;

    setIsAnalyzing(true, 'Synthesizing evidence & detecting gaps...');
    setAiError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sources, aspects })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.code === 'AI_KEY_NOT_CONFIGURED' || !res.ok) {
          setAiError(data.error || 'AI key not configured');
          setIsAnalyzing(false);
          return;
        }
        throw new Error(data.error || 'Failed to synthesize analysis');
      }

      setReport(data.data || data.report);
      setCurrentView('dashboard');
    } catch (err: unknown) {
      console.warn('Analysis request error:', err);
      const msg = err instanceof Error ? err.message : 'AI key not configured';
      setAiError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReplayIntro = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('intro_seen');
      window.location.href = '/?replay=1';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen flex flex-col justify-between"
    >
      <NoirFrame>
        {/* Top Floating Glass Pill Navigation */}
        <FloatingNav
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {isAnalyzing ? (
            <AnalysisProgressView
              currentStage={analysisStage}
              onCancel={() => setIsAnalyzing(false)}
            />
          ) : currentView === 'landing' ? (
            <LandingView
              onStartAnalysis={() => setCurrentView('workspace')}
              onExploreReport={() => setCurrentView('dashboard')}
            />
          ) : currentView === 'workspace' ? (
            <WorkspaceView onRunAnalysis={handleRunAnalysis} />
          ) : (
            <DashboardView onBackToWorkspace={() => setCurrentView('workspace')} />
          )}
        </main>

        {/* Persistent Source Reader Drawer */}
        <SourceReaderDrawer />

        {/* Explainer and Export Modals */}
        <WhyGapsMatterModal />
        <ReportExportModal />

        {/* Noir Frame Subtle Footer */}
        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 text-[10px] font-mono text-zinc-600 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.04]">
          <div className="flex items-center space-x-2">
            <span className="text-violet-400 font-bold">DIGITAL DARK SPOT®</span>
            <span>·</span>
            <span>SHINCHAN ONLINE HACKATHON 2026</span>
            <span>·</span>
            <button
              onClick={handleReplayIntro}
              className="text-violet-400/80 hover:text-violet-300 transition-colors uppercase tracking-widest cursor-pointer underline underline-offset-2 ml-1"
            >
              REPLAY INTRO
            </button>
          </div>
          <div className="text-zinc-500">
            CHROME NOIR ART DIRECTION · ARCHIVO EXPANDED · JETBRAINS MONO · THREE.JS
          </div>
        </footer>
      </NoirFrame>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#05030A] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-violet-500/30 border-t-violet-400 animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
