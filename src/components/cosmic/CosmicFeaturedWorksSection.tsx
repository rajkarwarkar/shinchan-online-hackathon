'use client';

import React, { useState } from 'react';
import { 
  LuxuryFashionGraphic, 
  TechInnovationGraphic, 
  TravelWorldGraphic 
} from './FeaturedWorkVisuals';
import { ArrowUpRight } from 'lucide-react';

interface CosmicFeaturedWorksSectionProps {
  onSelectWork?: (title: string) => void;
}

export const CosmicFeaturedWorksSection: React.FC<CosmicFeaturedWorksSectionProps> = ({ onSelectWork }) => {
  const [activeDot, setActiveDot] = useState(1);

  const works = [
    {
      title: 'LUXURY FASHION',
      category: 'Brand Strategy & E-Commerce',
      visual: <LuxuryFashionGraphic />
    },
    {
      title: 'TECH INNOVATION',
      category: 'Next-Gen Cyber & AI Systems',
      visual: <TechInnovationGraphic />
    },
    {
      title: 'TRAVEL THE WORLD',
      category: 'Global Expeditions & Hospitality',
      visual: <TravelWorldGraphic />
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="space-y-1 mb-10 text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          FEATURED WORKS
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Real Brands. <span className="text-gradient-purple">Real Results.</span>
        </h2>
      </div>

      {/* 3 Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {works.map((work, i) => (
          <div
            key={i}
            onClick={() => onSelectWork && onSelectWork(work.title)}
            className="cosmic-glass cosmic-glass-hover rounded-2xl overflow-hidden border border-purple-500/20 group cursor-pointer flex flex-col"
          >
            {/* Visual Container */}
            <div className="w-full relative overflow-hidden">
              {work.visual}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-purple-300 group-hover:scale-110 transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Label below image inside card */}
            <div className="p-4 bg-[#0c051a]/90 border-t border-purple-500/15 flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black tracking-wider text-white group-hover:text-purple-300 transition-colors uppercase">
                  {work.title}
                </h3>
                <p className="text-[10px] text-zinc-400">
                  {work.category}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3 Pagination Carousel Dots */}
      <div className="flex justify-center items-center space-x-2 pt-8">
        {[0, 1, 2].map((dot) => (
          <button
            key={dot}
            onClick={() => setActiveDot(dot)}
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
