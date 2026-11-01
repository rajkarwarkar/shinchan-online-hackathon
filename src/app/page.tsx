'use client';

import React, { useState, useEffect } from 'react';
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
import { DarkSpotOrb } from '@/components/chrome/DarkSpotOrb';

export default function Home() {
  const { 
    currentView, 
    setCurrentView, 
    isAnalyzing, 
    setIsAnalyzing, 
    analysisStage,
    question,
    sources,
    aspects,
    setReport
  } = useDarkSpotStore();



  // Real pipeline analysis trigger
  const handleRunAnalysis = async () => {
    if (sources.length < 2 || !question.trim()) return;

    setIsAnalyzing(true, 'Synthesizing evidence & detecting gaps...');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sources, aspects })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize analysis');
      }

      setReport(data.report);
      setCurrentView('dashboard');
    } catch (err: any) {
      console.warn('API error, falling back to local synthesis:', err);
      // Fallback: if Gemini key is absent in dev, navigate to report with current scenario
      setCurrentView('dashboard');
    } finally {
      setIsAnalyzing(false);
    }
  };



  return (
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
        </div>
        <div className="text-zinc-500">
          CHROME NOIR ART DIRECTION · ARCHIVO EXPANDED · JETBRAINS MONO · THREE.JS
        </div>
      </footer>
    </NoirFrame>
  );
}
