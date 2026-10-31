'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TrafficWaveChart, ConversionsBarChart, CircularMetricGauge } from './ResultsCharts';

interface CosmicResultsSectionProps {
  onSeeCaseStudies: () => void;
}

export const CosmicResultsSection: React.FC<CosmicResultsSectionProps> = ({ onSeeCaseStudies }) => {
  return (
    <section className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* Left Column: Heading, Subtitle & Button */}
        <div className="lg:col-span-4 space-y-5 text-left">
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              Results That Speak <br />
              <span className="text-gradient-purple">Louder</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            We focus on metrics that matter. Here is our automated audit benchmark across complex, multi-source official publications.
          </p>

          <div className="pt-2">
            <button
              onClick={onSeeCaseStudies}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white btn-cosmic-purple flex items-center space-x-2 group cursor-pointer shadow-lg shadow-purple-600/30"
            >
              <span>Inspect Benchmarks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: 4 Metrics Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: 320% Gap Catch Rate */}
          <div className="cosmic-glass cosmic-glass-hover rounded-2xl p-4 sm:p-5 border border-purple-500/20 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white">
                320%
              </div>
              <div className="text-xs text-zinc-400 font-medium">
                More Gaps Detected vs Baseline
              </div>
            </div>
            <div className="pt-2">
              <TrafficWaveChart />
            </div>
          </div>

          {/* Card 2: 100% Verbatim Traceability */}
          <div className="cosmic-glass cosmic-glass-hover rounded-2xl p-4 sm:p-5 border border-purple-500/20 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white">
                100%
              </div>
              <div className="text-xs text-zinc-400 font-medium">
                Verbatim Quote Traceability
              </div>
            </div>
            <div className="pt-2">
              <ConversionsBarChart />
            </div>
          </div>

          {/* Card 3: 0% Hallucinations */}
          <div className="cosmic-glass cosmic-glass-hover rounded-2xl p-4 sm:p-5 border border-purple-500/20 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white">
                0%
              </div>
              <div className="text-xs text-zinc-400 font-medium">
                Unverified Hallucinations
              </div>
            </div>
            <div className="pt-2 flex justify-center">
              <CircularMetricGauge percentage={100} />
            </div>
          </div>

          {/* Card 4: 98% Decision Readiness */}
          <div className="cosmic-glass cosmic-glass-hover rounded-2xl p-4 sm:p-5 border border-purple-500/20 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white">
                98%
              </div>
              <div className="text-xs text-zinc-400 font-medium">
                Decision Readiness Score
              </div>
            </div>
            <div className="pt-2 flex justify-center">
              <CircularMetricGauge percentage={98} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
