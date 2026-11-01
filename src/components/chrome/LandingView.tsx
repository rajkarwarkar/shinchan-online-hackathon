'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { DisplayHeading } from './DisplayHeading';
import { ChromeHero3D } from './ChromeHero3D';
import { 
  ArrowRight, 
  Quote, 
  Sparkles, 
  HelpCircle, 
  Globe, 
  ShieldAlert, 
  Layers, 
  Clock, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface LandingViewProps {
  onStartAnalysis: () => void;
  onExploreReport: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStartAnalysis, onExploreReport }) => {
  const { loadSampleMode } = useDarkSpotStore();

  const handleSampleMode = () => {
    loadSampleMode();
    onExploreReport();
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-140px)] flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
          {/* Left Column: Expanded Display Heading + Subtitle + Primary Actions */}
          <div className="lg:col-span-7 space-y-8 z-10">
            <DisplayHeading
              line1="FIND WHAT"
              line2="SEARCH"
              line3="MISSES"
              subtitle="People make life-altering decisions from scattered, outdated, and contradictory web info. Digital Dark Spot unearths what is absent, conflicting, and stale before you apply."
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartAnalysis}
                className="group px-6 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center space-x-3 cursor-pointer"
              >
                <span>START ANALYSIS</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </button>

              <button
                onClick={handleSampleMode}
                className="px-6 py-3.5 rounded-full noir-panel hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-xs font-bold tracking-widest uppercase transition-all border border-white/10 flex items-center space-x-2 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>TRY SAMPLE MODE</span>
              </button>
            </div>

            {/* Bottom-Left Violet Glass Status Dock Matching Reference Image */}
            <div className="pt-8 sm:pt-12">
              <div
                onClick={onStartAnalysis}
                className="noir-panel-violet rounded-2xl p-4 max-w-sm flex items-center justify-between gap-4 cursor-pointer group hover:border-violet-500/50 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono tracking-widest text-violet-300 uppercase">
                    EVALUATION ENGINE READY
                  </div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    Available for Critical Research Audit
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-violet-500/30 border border-violet-400/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500 transition-all flex-shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Liquid-Chrome 3D Star & Loops */}
          <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[500px] lg:h-[580px] flex items-center justify-center">
            <ChromeHero3D />
          </div>
        </div>

        {/* Hero Footer Bar: Wireframe globe scroll indicator & mono eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.06] text-[10px] font-mono text-zinc-500">
          <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span className="tracking-[0.2em] uppercase text-zinc-400">
              SCROLL TO EXPLORE ARCHITECTURE
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-zinc-500">
            <span>SHINCHAN HACKATHON 2026</span>
            <span>•</span>
            <span className="text-violet-400/80">INDIVIDUAL COMPETITOR</span>
            <span>•</span>
            <span className="text-amber-400/90">EVIDENCE-LOCKED</span>
          </div>
        </div>
      </section>

      {/* Trust Labels Legend Bar (Non-negotiable requirement in all modes) */}
      <section className="noir-panel rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400">
            TRUST HIERARCHY:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="trust-badge-sourced px-3.5 py-1.5 rounded-full flex items-center space-x-2 font-mono text-xs font-medium">
            <Quote className="w-3.5 h-3.5" />
            <span>SOURCED (Verified Quote + Source Link)</span>
          </div>

          <div className="trust-badge-suggested px-3.5 py-1.5 rounded-full flex items-center space-x-2 font-mono text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-SUGGESTED (Inference / Guidance)</span>
          </div>

          <div className="trust-badge-uncertain px-3.5 py-1.5 rounded-full flex items-center space-x-2 font-mono text-xs font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>UNCERTAIN (Low Confidence / Unverified)</span>
          </div>
        </div>
      </section>

      {/* 3 Glass Feature Cards Below the Fold */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest uppercase text-violet-300">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>CORE ARCHITECTURAL PILLARS</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            SOLVING WHAT CHATBOTS CANNOT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="noir-panel rounded-3xl p-6 border border-white/10 space-y-4 hover:border-amber-500/40 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400">
                PILLAR 01 · GAP DETECTION
              </span>
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                DARK SPOT ILLUMINATOR
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Search engines only find what exists; summarizers condense present text. Digital Dark Spot reveals what is completely missing from requirements.
            </p>
          </div>

          {/* Card 2 */}
          <div className="noir-panel rounded-3xl p-6 border border-white/10 space-y-4 hover:border-violet-500/40 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-violet-400">
                PILLAR 02 · CONFLICT RADAR
              </span>
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                DUAL-QUOTE VERIFIED CLASHES
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Requires verbatim quotes from both publishers to report contradictory policies, income ceilings, or deadlines with benign cycle explanations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="noir-panel rounded-3xl p-6 border border-white/10 space-y-4 hover:border-teal-500/40 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-teal-400">
                PILLAR 03 · EVIDENCE-LOCKED
              </span>
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                ZERO HALLUCINATED CLAIMS
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Every Sourced finding carries a verified quote verified against original text. Clicking opens the Source Reader drawer directly to the highlighted excerpt.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

