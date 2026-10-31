'use client';

import React from 'react';
import { ArrowRight, Play, ShieldAlert } from 'lucide-react';
import { CosmicHeroGraphic } from './CosmicHeroGraphic';

interface CosmicHeroSectionProps {
  onLaunchRadar: () => void;
  onWatchRubric: () => void;
}

export const CosmicHeroSection: React.FC<CosmicHeroSectionProps> = ({
  onLaunchRadar,
  onWatchRubric
}) => {
  return (
    <section id="hero" className="relative w-full min-h-[85vh] pt-24 sm:pt-28 pb-12 flex items-center overflow-hidden">
      
      {/* Background Cosmic Starfield Dust */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            
            {/* Hackathon Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Shinchan Hackathon 2026 • Problem Statement: Information Gaps</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
                INFORMATION
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-gradient-purple">
                GAP DETECTION
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
                INTELLIGENCE
              </h1>
            </div>

            {/* Subtitles */}
            <div className="space-y-3 max-w-xl">
              <p className="text-sm sm:text-base font-semibold tracking-wide text-zinc-300 font-mono">
                Détection. Contradiction. Vérité.
              </p>
              
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Cross-examine multi-source web publications to unearth critical digital dark spots, resolve policy contradictions, and generate automated verification checklists before high-stakes decisions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchRadar}
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white btn-cosmic-purple flex items-center space-x-2 shadow-xl shadow-purple-600/30 group cursor-pointer"
              >
                <span>Launch Live Radar</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onWatchRubric}
                className="px-4 py-3 rounded-full text-xs sm:text-sm font-medium text-zinc-300 hover:text-white flex items-center space-x-2 transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full border border-purple-500/40 flex items-center justify-center bg-purple-950/30 group-hover:border-purple-400 transition-colors">
                  <Play className="w-3 h-3 text-purple-300 ml-0.5" />
                </div>
                <span>Rubric & Scoring</span>
              </button>
            </div>

          </div>

          {/* Right Column: Mystical Hooded Figure with Glowing Orb */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <CosmicHeroGraphic />
          </div>

        </div>
      </div>

    </section>
  );
};
