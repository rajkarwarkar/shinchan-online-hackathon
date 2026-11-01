'use client';

import React, { useState } from 'react';
import { DisplayHeading } from '@/components/chrome/DisplayHeading';
import { MagneticButton } from './MagneticButton';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';
import { 
  ArrowRight, 
  Quote, 
  Sparkles, 
  HelpCircle, 
  Globe, 
  ShieldAlert, 
  Layers, 
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Search,
  CheckSquare
} from 'lucide-react';

interface ChaptersDOMProps {
  onStartAnalysis: () => void;
  onExploreReport: () => void;
}

export const ChaptersDOM: React.FC<ChaptersDOMProps> = ({
  onStartAnalysis,
  onExploreReport,
}) => {
  const { loadSampleMode } = useDarkSpotStore();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false,
  });

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSampleMode = () => {
    loadSampleMode();
    onExploreReport();
  };

  return (
    <div className="relative z-10 w-full text-[#F5F3FF]">
      {/* ============================================================== */}
      {/* CHAPTER 1: HERO                                                */}
      {/* ============================================================== */}
      <section
        id="chapter-hero"
        className="min-h-screen flex flex-col justify-between py-12 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          {/* Left Column: Heading, Subtitle, Actions */}
          <div className="lg:col-span-7 space-y-8">
            <DisplayHeading
              line1="FIND WHAT"
              line2="SEARCH"
              line3="MISSES"
              subtitle="People make life-altering decisions from scattered, outdated, and contradictory web info. Digital Dark Spot unearths what is absent, conflicting, and stale before you apply."
            />

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton
                onClick={onStartAnalysis}
                className="px-7 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_35px_rgba(139,92,246,0.45)] flex items-center space-x-3 cursor-pointer"
              >
                <span>START ANALYSIS</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </MagneticButton>

              <MagneticButton
                onClick={handleSampleMode}
                className="px-6 py-4 rounded-full noir-panel hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-xs font-bold tracking-widest uppercase transition-all border border-white/10 flex items-center space-x-2 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>TRY SAMPLE MODE</span>
              </MagneticButton>
            </div>

            {/* Status Dock */}
            <div className="pt-4">
              <div
                onClick={onStartAnalysis}
                className="noir-panel-violet rounded-2xl p-4 max-w-sm flex items-center justify-between gap-4 cursor-pointer group hover:border-violet-500/50 transition-all backdrop-blur-xl"
              >
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono tracking-widest text-violet-300 uppercase">
                    EVALUATION ENGINE READY
                  </div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    Available for Critical Research Audit
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-violet-500/30 border border-violet-400/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500 transition-all flex-shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Canvas Space (Behind) */}
          <div className="lg:col-span-5 h-[340px] lg:h-[480px] pointer-events-none" />
        </div>

        {/* Hero Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.06] text-[10px] font-mono text-zinc-500">
          <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span className="tracking-[0.2em] uppercase text-zinc-400">
              SCROLL DOWN TO WITNESS THE AUDIT PIPELINE
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-zinc-500">
            <span>SHINCHAN HACKATHON 2026</span>
            <span>•</span>
            <span className="text-violet-400/80">INDIVIDUAL COMPETITOR</span>
            <span>•</span>
            <span className="text-amber-400/90">EVIDENCE-LOCKED</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CHAPTER 2: THE PROBLEM                                         */}
      {/* ============================================================== */}
      <section
        id="chapter-problem"
        className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="space-y-12">
          {/* Eyebrow & Headline */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>CHAPTER 02 · THE INFORMATION TRAP</span>
            </div>

            <DisplayHeading
              line1="SCATTERED."
              line2="STALE."
              line3="CONFLICTING."
              subtitle="Search engines find what is indexed. Summarizers condense what is provided. Neither reveals what critical policies are absent, contradictory, or secretly outdated."
            />
          </div>

          {/* Three Shard Callouts Floating in Noir Space */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Callout 1: Outdated */}
            <div className="noir-panel rounded-3xl p-6 border border-amber-500/30 space-y-4 bg-gradient-to-b from-[#0A0712]/90 to-[#05030A]/90 backdrop-blur-xl relative group hover:border-amber-400 transition-all shadow-[0_10px_30px_rgba(251,191,36,0.08)]">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                  SIGNAL · TEMPORAL DRIFT
                </div>
                <h4 className="font-display text-base font-bold text-white">
                  OUTDATED GUIDELINES
                </h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Portals quietly retain 2023 eligibility criteria, income caps, or old submission deadlines without date warnings, trapping unsuspecting applicants.
              </p>
            </div>

            {/* Callout 2: Conflicting */}
            <div className="noir-panel rounded-3xl p-6 border border-rose-500/30 space-y-4 bg-gradient-to-b from-[#0A0712]/90 to-[#05030A]/90 backdrop-blur-xl relative group hover:border-rose-400 transition-all shadow-[0_10px_30px_rgba(251,59,107,0.08)]">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-bold">
                  SIGNAL · CONFLICT RADAR
                </div>
                <h4 className="font-display text-base font-bold text-white">
                  DISCORDANT POLICIES
                </h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                The main department portal claims a strict June 15 cutoff while official subsidiary guidelines specify rolling admissions with dual conflicting clauses.
              </p>
            </div>

            {/* Callout 3: Missing Dark Spots */}
            <div className="noir-panel rounded-3xl p-6 border border-violet-500/30 space-y-4 bg-gradient-to-b from-[#0A0712]/90 to-[#05030A]/90 backdrop-blur-xl relative group hover:border-violet-400 transition-all shadow-[0_10px_30px_rgba(139,92,246,0.08)]">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono tracking-widest uppercase text-violet-400 font-bold">
                  SIGNAL · DARK SPOT
                </div>
                <h4 className="font-display text-base font-bold text-white">
                  OMITTED OBLIGATIONS
                </h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Neither portal mentions required post-selection service bonds, clawback triggers, or mandatory co-signer criteria until after submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CHAPTER 3: THE LIGHT & COVERAGE MAP                            */}
      {/* ============================================================== */}
      <section
        id="chapter-light"
        className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="space-y-12">
          {/* Eyebrow & Heading */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono text-[10px] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>CHAPTER 03 · THE SPOTLIGHT AUDIT</span>
            </div>

            <DisplayHeading
              line1="SHINE A LIGHT"
              line2="ON THE"
              line3="DARK SPOTS"
              subtitle="The 3D Coverage Engine maps your sources across essential facets. As the spotlight cone sweeps, unaddressed requirements ignite in amber, while verified criteria glow in mint teal."
            />
          </div>

          {/* Coverage Map 3D Echo Card */}
          <div className="noir-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 bg-[#0A0712]/85 backdrop-blur-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-violet-400 font-bold">
                  EVALUATION MATRIX · 3 OF 5 ASPECTS DEFICIENT
                </span>
                <h3 className="font-display text-lg font-bold text-white mt-1">
                  Cross-Source Information Matrix
                </h3>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(94,234,212,0.8)]" />
                  <span className="text-teal-300 font-bold">SOURCED (40%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  <span className="text-amber-300 font-bold">DARK SPOT (60%)</span>
                </div>
              </div>
            </div>

            {/* Facet Bars */}
            <div className="space-y-3.5">
              {/* Aspect 1 */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-teal-500/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center space-x-2">
                    <span className="text-teal-400">✓</span>
                    <span>Eligibility & GPA Requirements</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    Verified across official portal and program PDF
                  </div>
                </div>
                <span className="trust-badge-sourced px-2.5 py-1 rounded-full text-[10px] font-mono font-bold">
                  SOURCED
                </span>
              </div>

              {/* Aspect 2 */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-amber-500/40 flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(251,191,36,0.06)]">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-200 flex items-center space-x-2">
                    <span className="text-amber-400">⚠</span>
                    <span>Renewal Terms & Minimum Ongoing Credits</span>
                  </div>
                  <div className="text-[10px] font-mono text-amber-300/80">
                    Not found in reviewed sources (potential gap)
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50">
                  DARK SPOT
                </span>
              </div>

              {/* Aspect 3 */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-teal-500/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center space-x-2">
                    <span className="text-teal-400">✓</span>
                    <span>Submission Deadlines & Cycle Windows</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    Dual dates reconciled with benign cycle difference
                  </div>
                </div>
                <span className="trust-badge-sourced px-2.5 py-1 rounded-full text-[10px] font-mono font-bold">
                  SOURCED
                </span>
              </div>

              {/* Aspect 4 */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-amber-500/40 flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(251,191,36,0.06)]">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-200 flex items-center space-x-2">
                    <span className="text-amber-400">⚠</span>
                    <span>Service Bond Obligation & Clawback Terms</span>
                  </div>
                  <div className="text-[10px] font-mono text-amber-300/80">
                    Completely omitted across all primary documents
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50">
                  DARK SPOT
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CHAPTER 4: EVIDENCE-LOCKED (PINNED & TRUST LABELS)             */}
      {/* ============================================================== */}
      <section
        id="chapter-evidence"
        className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="space-y-12">
          {/* Eyebrow & Heading */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-[10px] tracking-widest uppercase">
              <Quote className="w-3.5 h-3.5 text-teal-400" />
              <span>CHAPTER 04 · EVIDENCE-LOCKED TRACEABILITY</span>
            </div>

            <DisplayHeading
              line1="ZERO HALLUCINATIONS."
              line2="EVERY CLAIM"
              line3="QUOTE-LOCKED."
              subtitle="Digital Dark Spot eliminates blind trust. Every Sourced claim is anchored to a verbatim quote verified against original source text with one-click highlight navigation."
            />
          </div>

          {/* Three Trust Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: SOURCED */}
            <div className="trust-card-sourced rounded-3xl p-6 space-y-4 bg-[#0A0712]/90 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="trust-badge-sourced px-3 py-1 rounded-full font-mono text-[10px] font-bold">
                  SOURCED
                </span>
                <Quote className="w-4 h-4 text-teal-400" />
              </div>
              <h4 className="font-display text-base font-bold text-white">
                Verbatim Verified Excerpt
              </h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Carries an exact quote matched against the fetched DOM. The server computes a normalized string search. If verification fails, it is automatically downgraded to Unverified.
              </p>
              <div className="pt-2 text-[10px] font-mono text-teal-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deterministic server verification</span>
              </div>
            </div>

            {/* Card 2: AI-SUGGESTED */}
            <div className="trust-card-suggested rounded-3xl p-6 space-y-4 bg-[#0A0712]/90 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="trust-badge-suggested px-3 py-1 rounded-full font-mono text-[10px] font-bold">
                  AI-SUGGESTED
                </span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="font-display text-base font-bold text-white">
                Inference & Recommendations
              </h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Synthesized insights, missing question prompts, or priority advice. Visually distinguished with dashed borders and sparkle badges so you never confuse AI conjecture with cited fact.
              </p>
              <div className="pt-2 text-[10px] font-mono text-purple-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Labeled potential guidance</span>
              </div>
            </div>

            {/* Card 3: UNCERTAIN */}
            <div className="trust-card-uncertain rounded-3xl p-6 space-y-4 bg-[#0A0712]/90 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="trust-badge-uncertain px-3 py-1 rounded-full font-mono text-[10px] font-bold">
                  UNCERTAIN
                </span>
                <HelpCircle className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-display text-base font-bold text-white">
                Partial or Unverified Signals
              </h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Rendered with hatched diagonal borders. Applied when quote alignment cannot be established with 100% certainty, or when dates/publishers are missing.
              </p>
              <div className="pt-2 text-[10px] font-mono text-slate-400 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Honest uncertainty protocol</span>
              </div>
            </div>
          </div>

          {/* Floating Verbatim Quote Card */}
          <div className="noir-panel-violet rounded-3xl p-6 sm:p-7 border border-violet-500/40 space-y-4 max-w-2xl bg-gradient-to-r from-violet-950/40 via-[#0A0712]/90 to-[#05030A] shadow-[0_0_40px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between text-[10px] font-mono text-violet-300">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="uppercase tracking-widest font-bold">
                  SOURCE READER DRAWER · VERBATIM INSPECTOR
                </span>
              </div>
              <span className="text-zinc-500">scholarship.gov/faq#p4</span>
            </div>

            <blockquote className="text-sm font-sans text-zinc-200 border-l-2 border-teal-400 pl-4 py-1 italic leading-relaxed">
              &quot;Eligible applicants must submit their completed portfolios by no later than <mark className="bg-teal-500/30 text-teal-200 px-1 rounded">May 31 at 23:59 GMT</mark>. Late submissions will not be considered under any extenuating circumstances.&quot;
            </blockquote>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
              <span>Matching confidence: 100% verbatim</span>
              <span className="text-teal-400 flex items-center space-x-1 cursor-pointer hover:underline">
                <span>OPEN READER DRAWER</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CHAPTER 5: THE OUTPUT (CHECKLIST REASSEMBLY)                   */}
      {/* ============================================================== */}
      <section
        id="chapter-output"
        className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="space-y-12">
          {/* Eyebrow & Heading */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono text-[10px] tracking-widest uppercase">
              <CheckSquare className="w-3.5 h-3.5 text-violet-400" />
              <span>CHAPTER 05 · ACTIONABLE SYNTHESIS</span>
            </div>

            <DisplayHeading
              line1="CONVERT GAPS"
              line2="INTO A VERIFIED"
              line3="NEXT CHECKLIST"
              subtitle="Stop guessing. Digital Dark Spot synthesizes findings into a prioritized checklist with suggested emails to publishers, direct query links, and critical warning alerts."
            />
          </div>

          {/* Checklist Mockup */}
          <div className="noir-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 max-w-3xl bg-[#0A0712]/90 backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-violet-400 font-bold">
                  DECISION READINESS CHECKLIST
                </span>
                <h3 className="font-display text-base font-bold text-white mt-0.5">
                  Prioritized Verification Tasks
                </h3>
              </div>

              <span className="text-xs font-mono text-zinc-400">
                {Object.values(checkedItems).filter(Boolean).length} of 4 Completed
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {[
                {
                  id: 0,
                  priority: 'HIGH',
                  action: 'Resolve deadline contradiction between Main Department (June 15) and Portal FAQ (May 31).',
                  target: 'Contact: admissions@scholarship.gov',
                  border: 'border-rose-500/40',
                  badge: 'bg-rose-500/20 text-rose-300',
                },
                {
                  id: 1,
                  priority: 'HIGH',
                  action: 'Request written clarification regarding post-graduation mandatory service bond or clawback clauses.',
                  target: 'Draft email generated with 1 click',
                  border: 'border-amber-500/40',
                  badge: 'bg-amber-500/20 text-amber-300',
                },
                {
                  id: 2,
                  priority: 'MEDIUM',
                  action: 'Verify whether 2023 income bracket rules have been revised for 2026 application cycle.',
                  target: 'Direct Google search query prepared',
                  border: 'border-violet-500/30',
                  badge: 'bg-violet-500/20 text-violet-300',
                },
                {
                  id: 3,
                  priority: 'LOW',
                  action: 'Download certified PDF handbook to cross-reference credit transfer exemptions.',
                  target: 'Documentation audit',
                  border: 'border-white/10',
                  badge: 'bg-white/10 text-zinc-400',
                },
              ].map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 select-none ${
                      item.border
                    } ${
                      isChecked
                        ? 'bg-white/[0.02] opacity-60'
                        : 'bg-white/[0.04] hover:bg-white/[0.07]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${item.badge}`}
                        >
                          {item.priority}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {item.target}
                        </span>
                      </div>
                      <p
                        className={`text-xs font-sans ${
                          isChecked
                            ? 'text-zinc-500 line-through'
                            : 'text-zinc-200 font-medium'
                        }`}
                      >
                        {item.action}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CHAPTER 6: FINAL CTA & DEMO PACK                               */}
      {/* ============================================================== */}
      <section
        id="chapter-cta"
        className="min-h-screen flex flex-col justify-between py-24 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="space-y-12 my-auto">
          {/* Huge Chrome Outline Headline */}
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono text-xs tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span>CHAPTER 06 · DEPLOY THE AUDIT ENGINE</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-none text-white">
                AUDIT YOUR
              </h2>
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-none bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                HIGH-STAKES
              </h2>
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-none text-transparent chrome-text-outline">
                DECISIONS.
              </h2>
            </div>

            <p className="font-mono text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Never apply for a scholarship, submit a critical visa dossier, or execute a major grant proposal based on unverified summaries. Shine a light on the dark spots today.
            </p>

            {/* Magnetic CTA Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-4">
              <MagneticButton
                onClick={onStartAnalysis}
                className="px-8 py-5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_40px_rgba(139,92,246,0.5)] flex items-center space-x-3 cursor-pointer"
              >
                <span>ENTER WORKSPACE NOW</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </MagneticButton>

              <MagneticButton
                onClick={handleSampleMode}
                className="px-7 py-5 rounded-full noir-panel hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-xs font-bold tracking-widest uppercase transition-all border border-white/10 flex items-center space-x-2 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span>LOAD DEMO-PROOF SAMPLE PACK</span>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Footer HUD Details */}
        <div className="pt-12 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-zinc-500">
          <div className="flex items-center space-x-3">
            <span className="text-violet-400 font-bold">DIGITAL DARK SPOT®</span>
            <span>·</span>
            <span>SHINCHAN ONLINE HACKATHON 2026</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-zinc-400">EVIDENCE-LOCKED PROTOCOL</span>
            <span>•</span>
            <span className="text-zinc-400">THREE.JS SCROLLYTELLING</span>
            <span>•</span>
            <span className="text-zinc-400">LENIS + GSAP 60FPS</span>
          </div>
        </div>
      </section>
    </div>
  );
};

