'use client';

import React from 'react';
import { 
  AlertTriangle, 
  Layers, 
  CalendarClock, 
  FileCheck, 
  CheckSquare, 
  ArrowUpRight 
} from 'lucide-react';

interface CosmicServicesSectionProps {
  onSelectCapability?: (capabilityName: string) => void;
}

export const CosmicServicesSection: React.FC<CosmicServicesSectionProps> = ({ onSelectCapability }) => {
  const capabilities = [
    {
      title: 'Gap Detection',
      badge: 'DARK SPOT LOCATOR',
      desc: 'Unearths missing prerequisites, omitted conditions, and silent eligibility exceptions.',
      icon: AlertTriangle
    },
    {
      title: 'Contradiction Radar',
      badge: 'CLASH RECONCILIATION',
      desc: 'Cross-references competing sources, conflicting monetary caps, and mismatched rules.',
      icon: Layers
    },
    {
      title: 'Temporal Audit',
      badge: 'STALE RULE SENTINEL',
      desc: 'Flags outdated policy cycles, expired deadlines, and superseded regulations.',
      icon: CalendarClock
    },
    {
      title: 'Traceable Evidence',
      badge: 'VERBATIM CITATIONS',
      desc: 'Extracts verifiable quotes with confidence scores linked directly to source URLs.',
      icon: FileCheck
    },
    {
      title: 'Verification Tasks',
      badge: 'ACTIONABLE AUDITS',
      desc: 'Transforms detected omissions and conflicts into prioritized interactive checklists.',
      icon: CheckSquare
    }
  ];

  return (
    <section id="capabilities" className="relative py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center space-y-2 mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          INTELLIGENCE CAPABILITIES
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Engines That Expose <span className="text-gradient-purple">The Truth</span>
        </h2>
      </div>

      {/* 5-Card Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {capabilities.map((srv, i) => {
          const Icon = srv.icon;
          return (
            <div
              key={i}
              onClick={() => onSelectCapability && onSelectCapability(srv.title)}
              className="cosmic-glass cosmic-glass-hover rounded-2xl p-5 border border-purple-500/20 flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:border-purple-400 transition-all">
                  <Icon className="w-5 h-5 text-purple-300" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="space-y-1.5 text-left">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-400 block">
                  {srv.badge}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
