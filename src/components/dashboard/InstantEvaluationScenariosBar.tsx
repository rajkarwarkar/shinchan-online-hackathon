'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { ALL_EVALUATION_SCENARIOS } from '@/data/scenarios';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const InstantEvaluationScenariosBar: React.FC = () => {
  const { activeScenarioId, loadScenario } = useDarkSpotStore();

  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Instant 1-Click Evaluation Scenarios
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          Click to run complete gap & conflict analysis instantly
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ALL_EVALUATION_SCENARIOS.map((scenario) => {
          const isActive = activeScenarioId === scenario.id;

          return (
            <div
              key={scenario.id}
              onClick={() => loadScenario(scenario.id)}
              className={`darkspot-panel rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between group ${
                isActive
                  ? 'border-purple-500/80 bg-purple-950/20 shadow-xl shadow-purple-500/20'
                  : 'border-white/10 bg-[#0B0F14]/90 hover:border-purple-500/40 hover:bg-white/[0.03]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    {scenario.badge}
                  </span>
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shadow-sm shadow-purple-400" />
                  )}
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {scenario.name}
                </h4>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className={`${isActive ? 'text-purple-400 font-bold' : 'text-zinc-500'}`}>
                  {isActive ? '✓ Active Scenario' : 'Ready to evaluate'}
                </span>

                <span className="text-purple-400 group-hover:text-purple-300 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Load scenario</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
