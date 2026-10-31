'use client';

import React, { useState } from 'react';
import { VerificationTask, AnalysisResult } from '@/types';
import { CheckSquare, Square, Printer, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateMarkdownReport } from '@/lib/exportUtils';

interface ChecklistViewProps {
  tasks: VerificationTask[];
  fullResult: AnalysisResult;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({ tasks, fullResult }) => {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const isCompleted = (task: VerificationTask) => {
    return completedMap[task.id] !== undefined ? completedMap[task.id] : task.completed;
  };

  const toggleTask = (id: string) => {
    setCompletedMap(prev => {
      const current = prev[id] !== undefined ? prev[id] : (tasks.find(t => t.id === id)?.completed || false);
      const nextVal = !current;
      const updated = { ...prev, [id]: nextVal };

      const allDone = tasks.every(t => (updated[t.id] !== undefined ? updated[t.id] : t.completed));
      if (allDone && tasks.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      return updated;
    });
  };

  const completedCount = tasks.filter(t => isCompleted(t)).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleCopyMarkdown = () => {
    const report = generateMarkdownReport({
      ...fullResult,
      checklist: tasks.map(t => ({ ...t, completed: isCompleted(t) }))
    });
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-white/5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Prioritized Human Verification Action Plan</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {completedCount}/{tasks.length} Completed
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Action items required to resolve critical gaps, contradictions, and stale assumptions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Copied Brief!' : 'Copy Markdown Brief'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Print Report</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
        <div className="flex justify-between text-xs text-zinc-300 font-medium">
          <span>Verification Readiness</span>
          <span className="font-mono text-indigo-300">{progressPercent}% Verified</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const completed = isCompleted(task);
          const isImmediate = task.priority === 'IMMEDIATE';
          const isImportant = task.priority === 'IMPORTANT';

          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all text-xs space-y-2 ${
                completed
                  ? 'bg-emerald-950/10 border-emerald-500/30 opacity-75'
                  : isImmediate
                  ? 'bg-rose-950/10 border-rose-500/30 hover:border-rose-500/50'
                  : isImportant
                  ? 'bg-amber-950/10 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="pt-0.5 text-indigo-400 shrink-0">
                    {completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isImmediate
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : isImportant
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        Category: {task.category}
                      </span>
                    </div>

                    <div className={`text-sm font-bold text-white ${completed ? 'line-through text-zinc-400' : ''}`}>
                      {task.title}
                    </div>

                    <p className={`text-xs text-zinc-300 leading-relaxed ${completed ? 'line-through text-zinc-500' : ''}`}>
                      {task.actionText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Entity Strip */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5 text-zinc-400">
                <span>
                  <strong className="text-zinc-300">Target Authority:</strong> {task.targetEntityOrSource}
                </span>
                <span className="text-zinc-500">
                  {completed ? '✓ Verified' : 'Click card to toggle status'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
