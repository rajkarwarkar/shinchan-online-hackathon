'use client';

import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { CosmicHeroGraphic } from './CosmicHeroGraphic';

interface CosmicHeroSectionProps {
  onGetStarted: () => void;
  onWatchShowreel: () => void;
}

export const CosmicHeroSection: React.FC<CosmicHeroSectionProps> = ({
  onGetStarted,
  onWatchShowreel
}) => {
  return (
    <section className="relative w-full min-h-[85vh] pt-24 sm:pt-28 pb-12 flex items-center overflow-hidden">
      
      {/* Background Cosmic Starfield Dust */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
                DIGITAL
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-gradient-purple">
                MARKETING
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
                SOLUTIONS
              </h1>
            </div>

            {/* Subtitles matching the screenshot */}
            <div className="space-y-3 max-w-xl">
              <p className="text-sm sm:text-base font-semibold tracking-wide text-zinc-300">
                Stratégies. Créativité. Résultats.
              </p>
              
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                We help brands grow online with powerful strategies, creative content & data-driven marketing that delivers real results.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white btn-cosmic-purple flex items-center space-x-2 shadow-xl shadow-purple-600/30 group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onWatchShowreel}
                className="px-4 py-3 rounded-full text-xs sm:text-sm font-medium text-zinc-300 hover:text-white flex items-center space-x-2 transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full border border-purple-500/40 flex items-center justify-center bg-purple-950/30 group-hover:border-purple-400 transition-colors">
                  <Play className="w-3 h-3 text-purple-300 ml-0.5" />
                </div>
                <span>Watch Showreel</span>
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

