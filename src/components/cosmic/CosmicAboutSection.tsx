'use client';

import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { CosmicAstronautGraphic } from './CosmicAstronautGraphic';

interface CosmicAboutSectionProps {
  onLearnMore: () => void;
}

export const CosmicAboutSection: React.FC<CosmicAboutSectionProps> = ({ onLearnMore }) => {
  const points = [
    'Multi-Source Cross-Examination',
    'Contradiction & Policy Clash Radar',
    'Temporal Decay & Freshness Audit',
    'Actionable Verification Checklists'
  ];

  return (
    <section id="about" className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Column: Astronaut Facing Purple Ring Portal */}
        <div className="lg:col-span-6">
          <CosmicAstronautGraphic />
        </div>

        {/* Right Column: Copy & Checklist */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              ABOUT THE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              We Expose Truths <br />
              That LLMs <span className="text-gradient-purple">Miss</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
            Standard AI models hallucinate plausible answers when crucial information is missing. DarkSpot AI evaluates what is <em>unsaid</em>: cross-referencing official guidelines, forum reports, and policy updates to detect omissions, conflicting rules, and stale deadlines.
          </p>

          <div className="space-y-3 pt-2">
            {points.map((pt, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-purple-600/30 border border-purple-400/50 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-purple-300 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-zinc-200">
                  {pt}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <button
              onClick={onLearnMore}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white btn-cosmic-purple flex items-center space-x-2 group cursor-pointer shadow-lg shadow-purple-600/30"
            >
              <span>Explore Rubric & Design</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
