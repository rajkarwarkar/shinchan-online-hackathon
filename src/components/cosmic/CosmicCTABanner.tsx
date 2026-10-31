'use client';

import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { CosmicCTABannerGraphic } from './FeaturedWorkVisuals';

interface CosmicCTABannerProps {
  onAnalyzeCustom: () => void;
}

export const CosmicCTABanner: React.FC<CosmicCTABannerProps> = ({ onAnalyzeCustom }) => {
  return (
    <section className="relative py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#170a2c] via-[#0f041e] to-[#120626] p-6 sm:p-10 shadow-2xl">
        
        {/* Ambient Cosmic Radial Highlights */}
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 rounded-full bg-fuchsia-600/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Text */}
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Ready to Audit Your Sources?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Cross-examine web publications, detect hidden policy dark spots, and ensure total decision confidence.
            </p>
          </div>

          {/* Right Action & Portal Graphic */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <button
              onClick={onAnalyzeCustom}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white btn-cosmic-purple flex items-center space-x-2 group cursor-pointer shadow-xl shadow-purple-600/40"
            >
              <Search className="w-4 h-4" />
              <span>Scrape & Analyze URLs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Astronaut Facing Cosmic Ring Portal */}
            <CosmicCTABannerGraphic />
          </div>

        </div>

      </div>
    </section>
  );
};
