'use client';

import React from 'react';
import { X, Search, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel p-6 border border-white/10 space-y-5 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Why Information Gaps Matter: The &ldquo;Dark Spot&rdquo; Challenge
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2">
            <h4 className="font-semibold text-white text-sm">The Fundamental Search Blindspot</h4>
            <p>
              When people research high-stakes decisions (scholarships, visas, healthcare, government grants), standard search engines tell you <em>what was published</em>, and AI summarizers <em>condense what you read</em>.
            </p>
            <p className="text-amber-300 font-medium">
              Neither tool tells you what is dangerously missing, conflicting, or outdated before you submit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-zinc-400 font-semibold text-xs">
                <Search className="w-4 h-4" />
                <span>Search Engines</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Index keywords and return thousands of links without checking mutual coherence.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-zinc-400 font-semibold text-xs">
                <FileText className="w-4 h-4" />
                <span>AI Summarizers</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Paraphrase given text into bullet points; if a rule is omitted, the summary omits it too.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-indigo-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>DarkSpot AI</span>
              </div>
              <p className="text-[11px] text-indigo-200">
                Cross-examines sources, flags missing renewal policies, pinpoints contradictory numbers, and provides a verification checklist.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              How DarkSpot AI Audits Decisions
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Expectation Matrix:</strong> Benchmarks findings against domain templates (eligibility, renewal, deadlines, appeal paths).</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Contradiction Radar:</strong> Surfaces verbatim conflicting quotes side-by-side with exact citations.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Temporal Auditing:</strong> Flags expired cycles (e.g. 2024 guidance in 2026) to prevent acting on obsolete rules.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Got it, Let&apos;s Explore
          </button>
        </div>

      </div>
    </div>
  );
};

