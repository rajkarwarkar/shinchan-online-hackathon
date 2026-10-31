'use client';

import React from 'react';
import { Quote, Sparkles, ShieldCheck, Clock, Search, Zap } from 'lucide-react';

export const CosmicFeaturesStrip: React.FC = () => {
  const features = [
    {
      icon: Quote,
      color: 'teal',
      badge: 'Evidence-Locked',
      title: 'Verbatim Quote Verification',
      desc: 'Claims labeled "Sourced" require strict server-verified verbatim quotes against original text. Unverified claims are immediately downgraded.'
    },
    {
      icon: ShieldCheck,
      color: 'amber',
      badge: 'Zero Silent Omissions',
      title: 'Dark Spot Illuminator',
      desc: 'Search finds what exists; summarizers condense what is present. Digital Dark Spot reveals critical facets absent across all reviewed sources.'
    },
    {
      icon: Sparkles,
      color: 'purple',
      badge: 'Dual-Quote Verified',
      title: 'Contradiction Radar',
      desc: 'Detects conflicting dollar values, deadlines, and policy rules, requiring verbatim quotes from both publishers with benign cycle explanations.'
    },
    {
      icon: Clock,
      color: 'orange',
      badge: 'Runtime Date Sentinel',
      title: 'Temporal Freshness Audit',
      desc: 'Evaluates metadata, JSON-LD, and cycle years relative to runtime 2026 date to prevent decisions on stale or expired rules.'
    }
  ];

  return (
    <section className="space-y-3 pt-6 border-t border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Hackathon Architectural Guarantees
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          Shinchan Hackathon 2026 Evaluation Framework
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="darkspot-panel rounded-2xl p-4 border border-white/10 bg-[#0B0F14]/70 space-y-2.5 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Icon className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                  {f.badge}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white tracking-tight">
                {f.title}
              </h4>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
