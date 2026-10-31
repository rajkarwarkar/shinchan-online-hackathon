'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Award, Database } from 'lucide-react';

export const CosmicStatsBar: React.FC = () => {
  const stats = [
    {
      value: '250+',
      label: 'Dark Spots Detected',
      icon: AlertTriangle
    },
    {
      value: '98%',
      label: 'Sourced Citation Accuracy',
      icon: CheckCircle2
    },
    {
      value: '10-Pt',
      label: 'Rubric Alignment',
      icon: Award
    },
    {
      value: '5M+',
      label: 'Audited Knowledge Tokens',
      icon: Database
    }
  ];

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-6 mb-16">
      <div className="cosmic-glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-purple-500/20 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-purple-500/10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className={`flex items-center space-x-3.5 ${i > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-300">
                  <Icon className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-zinc-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
