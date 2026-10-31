'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { CyberHeader } from '@/components/dashboard/CyberHeader';
import { CyberCockpit } from '@/components/dashboard/CyberCockpit';
import { DashboardTabsBar } from '@/components/dashboard/DashboardTabsBar';
import { InformationGapsView } from '@/components/findings/InformationGapsView';
import { ContradictionRadarView } from '@/components/findings/ContradictionRadarView';
import { TemporalAuditView } from '@/components/findings/TemporalAuditView';
import { TraceableEvidenceView } from '@/components/findings/TraceableEvidenceView';
import { VerificationChecklistView } from '@/components/findings/VerificationChecklistView';
import { InstantEvaluationScenariosBar } from '@/components/dashboard/InstantEvaluationScenariosBar';
import { CosmicFeaturesStrip } from '@/components/dashboard/CosmicFeaturesStrip';
import { SourceManager } from '@/components/sources/SourceManager';
import { SourceReaderDrawer } from '@/components/sources/SourceReaderDrawer';
import { WhyGapsMatterModal } from '@/components/modals/WhyGapsMatterModal';
import { ReportExportModal } from '@/components/modals/ReportExportModal';
import { Quote, Sparkles, HelpCircle } from 'lucide-react';

export default function Home() {
  const { activeTab } = useDarkSpotStore();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#06080D] text-zinc-100 selection:bg-purple-500 selection:text-white">
      {/* Top Cyber Navigation Bar Matching Reference Image */}
      <CyberHeader />

      {/* Main Cockpit Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* Three Trust Labels Legend Bar (Non-negotiable requirement) */}
        <div className="darkspot-panel rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs border border-white/10 bg-[#0B0F14]/90 backdrop-blur-md">
          <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px] font-mono">
            Evidence Trust Hierarchy:
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="trust-badge-sourced px-3 py-1 rounded-full flex items-center space-x-1.5 font-medium text-[11px]">
              <Quote className="w-3.5 h-3.5" />
              <span>SOURCED (Verified Quote + Link)</span>
            </div>
            <div className="trust-badge-suggested px-3 py-1 rounded-full flex items-center space-x-1.5 font-medium text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-SUGGESTED (Inference / Guidance)</span>
            </div>
            <div className="trust-badge-uncertain px-3 py-1 rounded-full flex items-center space-x-1.5 font-medium text-[11px]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>UNCERTAIN (Low Confidence / Unverified)</span>
            </div>
          </div>
        </div>

        {/* 3D Cyber Dashboard Cockpit (Information Completeness + 3 Big Metrics + 1-Click Live Scenarios + 3D Prisms) */}
        <CyberCockpit />

        {/* Dashboard Navigation Tabs */}
        <DashboardTabsBar />

        {/* Dynamic Findings Tab Panel */}
        <div className="min-h-[300px]">
          {activeTab === 'gaps' && <InformationGapsView />}
          {activeTab === 'conflicts' && <ContradictionRadarView />}
          {activeTab === 'freshness' && <TemporalAuditView />}
          {activeTab === 'evidence' && <TraceableEvidenceView />}
          {activeTab === 'checklist' && <VerificationChecklistView />}
          {activeTab === 'overview' && <InformationGapsView />}
        </div>

        {/* Instant 1-Click Evaluation Scenarios for Judges */}
        <InstantEvaluationScenariosBar />

        {/* Custom Research & Source Ingestion Engine */}
        <SourceManager />

        {/* Cosmic Features Strip: Hackathon Architectural Guarantees */}
        <CosmicFeaturesStrip />
      </main>

      {/* Source Reader Drawer (Auto-scrolled with highlighted passage) */}
      <SourceReaderDrawer />

      {/* Explainer and Export Modals */}
      <WhyGapsMatterModal />
      <ReportExportModal />

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-xs text-zinc-500 bg-[#040508] mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-zinc-400 font-semibold">
              Digital Dark Spot • AI-Assisted Information Gap & Contradiction Detection Platform
            </span>
            <p className="text-[11px] text-zinc-500 font-mono">
              Shinchan Online Hackathon 2026 • Individual Entry
            </p>
          </div>

          <span className="font-mono text-[11px] text-amber-400/80 max-w-md">
            Disclaimer: AI findings represent potential gaps and signals, never guaranteed legal or financial facts. Always confirm with official issuing authorities.
          </span>
        </div>
      </footer>
    </div>
  );
}
