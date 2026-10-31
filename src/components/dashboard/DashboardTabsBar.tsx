'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { 
  ShieldAlert, 
  Layers, 
  Clock, 
  FileCheck2, 
  CheckSquare2,
  Sparkles
} from 'lucide-react';

export const DashboardTabsBar: React.FC = () => {
  const { activeTab, setActiveTab, report } = useDarkSpotStore();

  const gapsCount = report?.gaps.length ?? 0;
  const conflictsCount = report?.conflicts.length ?? 0;
  const staleCount = report?.freshness.length ?? 0;
  const checklistPendingCount = report?.checklist.filter((i) => !i.done).length ?? 0;
  const verifiedClaimsCount = report?.claims.filter((c) => c.quoteVerified).length ?? 0;

  const tabs = [
    {
      id: 'gaps',
      label: 'Information Gaps',
      icon: ShieldAlert,
      badge: gapsCount,
      activeClass: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 border-rose-400 font-bold',
      inactiveClass: 'hover:text-rose-400 hover:bg-rose-500/10 text-zinc-400 border-white/5'
    },
    {
      id: 'conflicts',
      label: 'Contradiction Radar',
      icon: Layers,
      badge: conflictsCount,
      activeClass: 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 border-amber-400 font-bold',
      inactiveClass: 'hover:text-amber-400 hover:bg-amber-500/10 text-zinc-400 border-white/5'
    },
    {
      id: 'freshness',
      label: 'Temporal Audit',
      icon: Clock,
      badge: staleCount,
      activeClass: 'bg-orange-500 text-black shadow-lg shadow-orange-500/30 border-orange-400 font-bold',
      inactiveClass: 'hover:text-orange-400 hover:bg-orange-500/10 text-zinc-400 border-white/5'
    },
    {
      id: 'evidence',
      label: 'Traceable Evidence',
      icon: FileCheck2,
      badge: `${verifiedClaimsCount} Sourced`,
      activeClass: 'bg-teal-500 text-black shadow-lg shadow-teal-500/30 border-teal-400 font-bold',
      inactiveClass: 'hover:text-teal-400 hover:bg-teal-500/10 text-zinc-400 border-white/5'
    },
    {
      id: 'checklist',
      label: 'Verification Checklist',
      icon: CheckSquare2,
      badge: `${checklistPendingCount} To-Do`,
      activeClass: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border-purple-400 font-bold',
      inactiveClass: 'hover:text-purple-400 hover:bg-purple-500/10 text-zinc-400 border-white/5'
    }
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Dashboard Views:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs flex items-center space-x-2 border transition-all cursor-pointer ${
                isActive ? t.activeClass : `bg-white/[0.03] ${t.inactiveClass}`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-black/30 text-white font-bold' : 'bg-white/10 text-zinc-400'
                }`}
              >
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
