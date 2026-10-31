'use client';

import React, { useState } from 'react';
import { 
  LuxuryFashionGraphic, 
  TechInnovationGraphic, 
  TravelWorldGraphic 
} from './FeaturedWorkVisuals';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CosmicFeaturedWorksSectionProps {
  onSelectScenario: (scenarioId: string) => void;
  activeScenarioId?: string;
}

export const CosmicFeaturedWorksSection: React.FC<CosmicFeaturedWorksSectionProps> = ({ 
  onSelectScenario,
  activeScenarioId 
}) => {
  const [activeDot, setActiveDot] = useState(0);

  const benchmarks = [
    {
      id: 'scholarship-2026',
      tag: 'OFFICIAL PDF USE CASE',
      title: 'STEM SCHOLARSHIP 2026',
      category: 'Unstated renewal GPA criteria & conflicting $50k income ceiling',
      visual: <LuxuryFashionGraphic />
    },
    {
      id: 'stem-opt-visa',
      tag: 'VISA & IMMIGRATION RULES',
      title: 'STEM OPT 24-MO EXTENSION',
      category: '180-day grace period gap & conflicting 10 vs 30-day employer reporting',
      visual: <TechInnovationGraphic />
    },
    {
      id: 'clean-energy-rebate',
      tag: 'FEDERAL & STATE GRANTS',
      title: 'CLEAN ENERGY EV REBATE',
      category: 'Omitted battery sourcing conditions, $55k vs $80k MSRP caps & stale 2023 rules',
      visual: <TravelWorldGraphic />
    }
  ];

  return (
    <section id="benchmarks" className="relative py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-left">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>HACKATHON BENCHMARKS</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Real Sources. <span className="text-gradient-purple">Real Evidence.</span>
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-md">
          Click any precomputed benchmark below to load its multi-source documents and live verification audit in the radar below.
        </p>
      </div>

      {/* 3 Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benchmarks.map((work, i) => {
          const isSelected = activeScenarioId === work.id;
          return (
            <div
              key={work.id}
              onClick={() => {
                setActiveDot(i);
                onSelectScenario(work.id);
                const el = document.getElementById('radar');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`cosmic-glass cosmic-glass-hover rounded-2xl overflow-hidden border transition-all group cursor-pointer flex flex-col ${
                isSelected 
                  ? 'border-purple-400 ring-2 ring-purple-500/50 shadow-2xl shadow-purple-600/40' 
                  : 'border-purple-500/20'
              }`}
            >
              {/* Visual Container */}
              <div className="w-full relative overflow-hidden">
                {work.visual}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-purple-500/30 text-[10px] font-mono font-bold text-purple-300">
                  {work.tag}
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-purple-300 group-hover:scale-110 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Label below image inside card */}
              <div className="p-4 bg-[#0c051a]/90 border-t border-purple-500/15 flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-black tracking-wider text-white group-hover:text-purple-300 transition-colors uppercase">
                    {work.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-1">
                    {work.category}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-purple-300 border-t border-purple-500/10">
                  <span>{isSelected ? '● Active in Radar' : 'Click to Load in Radar'}</span>
                  <span>Inspect Audit →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 Pagination Carousel Dots */}
      <div className="flex justify-center items-center space-x-2 pt-8">
        {[0, 1, 2].map((dot) => (
          <button
            key={dot}
            onClick={() => {
              setActiveDot(dot);
              onSelectScenario(benchmarks[dot].id);
            }}
            className={`transition-all rounded-full ${
              activeDot === dot
                ? 'w-6 h-1.5 bg-purple-500'
                : 'w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500'
            }`}
          />
        ))}
      </div>

    </section>
  );
};
