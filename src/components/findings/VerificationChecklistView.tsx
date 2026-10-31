'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { CheckSquare2, ExternalLink, ShieldCheck, AlertCircle, Check } from 'lucide-react';

export const VerificationChecklistView: React.FC = () => {
  const { report, toggleChecklistItem, setActiveTab } = useDarkSpotStore();

  const checklist = report?.checklist || [];
  const completedCount = checklist.filter((item) => item.done).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const priorityBadge = (priority: 'P0' | 'P1' | 'P2') => {
    switch (priority) {
      case 'P0':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            P0 • Critical Blocker
          </span>
        );
      case 'P1':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            P1 • High Priority
          </span>
        );
      case 'P2':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            P2 • Verification Action
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview Header with Progress Meter */}
      <div className="darkspot-panel rounded-3xl p-5 border border-purple-500/30 bg-[#0B0F14]/90 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <CheckSquare2 className="w-4 h-4 text-purple-400" />
              <span>Prioritized Verification Checklist</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Deterministic action items ordered by decision impact. Complete these steps before finalizing your application or decision.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>
              {completedCount} of {checklist.length} Actions Verified ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleChecklistItem(item.id)}
            className={`darkspot-panel rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-start space-x-4 ${
              item.done
                ? 'border-emerald-500/30 bg-emerald-950/10 opacity-70'
                : item.priority === 'P0'
                ? 'border-rose-500/40 bg-rose-950/10 hover:border-rose-500/70'
                : 'border-white/10 bg-[#0B0F14]/90 hover:border-purple-500/40'
            }`}
          >
            {/* Custom Checkbox */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleChecklistItem(item.id);
              }}
              className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center border transition-all cursor-pointer mt-0.5 ${
                item.done
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm shadow-emerald-500/30'
                  : 'bg-white/5 border-white/20 text-transparent hover:border-purple-400'
              }`}
            >
              <Check className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {priorityBadge(item.priority)}
                  {item.done && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      ✓ Resolved
                    </span>
                  )}
                </div>

                {item.linkedFindingIds.length > 0 && (
                  <span className="text-[10px] font-mono text-zinc-500">
                    Linked Signals: {item.linkedFindingIds.join(', ')}
                  </span>
                )}
              </div>

              <h4
                className={`text-sm font-bold text-white leading-snug ${
                  item.done ? 'line-through text-zinc-400' : ''
                }`}
              >
                {item.action}
              </h4>

              <p className="text-xs text-zinc-300 leading-relaxed">
                <span className="font-semibold text-zinc-200">Decision Impact:</span> {item.why}
              </p>

              {item.suggestedVerificationSource && (
                <div className="pt-2 flex items-center space-x-2 text-xs">
                  <span className="text-[11px] font-mono text-zinc-500">
                    Suggested Verification Authority:
                  </span>
                  <a
                    href={item.suggestedVerificationSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-mono text-purple-300 hover:text-white underline flex items-center space-x-1"
                  >
                    <span className="truncate max-w-[220px]">{item.suggestedVerificationSource}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
