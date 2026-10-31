'use client';

import React from 'react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { X, HelpCircle, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Quote } from 'lucide-react';

export const WhyGapsMatterModal: React.FC = () => {
  const { isWhyGapsModalOpen, setIsWhyGapsModalOpen } = useDarkSpotStore();

  if (!isWhyGapsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0B0F14] border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                Shinchan Online Hackathon 2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Why Information Gaps Matter More Than Summaries
            </h2>
          </div>

          <button
            onClick={() => setIsWhyGapsModalOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Fundamental Problem */}
        <div className="rounded-2xl p-4 bg-purple-950/20 border border-purple-500/25 space-y-2">
          <h3 className="text-sm font-bold text-purple-200">
            The Critical Flaw in Modern Search & Chatbots
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            People make life-altering decisions (scholarships, visa compliance, tax grants, public benefits) based on scattered, outdated, and contradictory web pages.
            <strong> Search engines only find what exists; summarizers condense what exists. Neither tells you what is completely missing, contradictory, stale, or unverified.</strong>
          </p>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Generic Chatbot */}
          <div className="rounded-2xl p-4 bg-white/[0.02] border border-rose-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 font-bold font-mono">
              <AlertTriangle className="w-4 h-4" />
              <span>Generic AI Chatbot / Summarizer</span>
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Hallucinates plausibly when crucial rules or deadlines are missing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Silently blends outdated 2023 guidelines with 2026 rules without warnings.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Cannot trace claims to verifiable verbatim quotes in the original text.</span>
              </li>
            </ul>
          </div>

          {/* Digital Dark Spot */}
          <div className="rounded-2xl p-4 bg-white/[0.02] border border-emerald-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>Digital Dark Spot Platform</span>
            </div>
            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Evidence-Locked:</strong> Only claims with verified verbatim quotes are labeled Sourced.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Dark Spot Illuminator:</strong> Flags critical unaddressed facets before you apply.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Dual-Quote Contradiction Radar:</strong> Requires quotes from both publishers to report clashes.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setIsWhyGapsModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-colors cursor-pointer"
          >
            Got it, Return to Cockpit
          </button>
        </div>
      </div>
    </div>
  );
};
