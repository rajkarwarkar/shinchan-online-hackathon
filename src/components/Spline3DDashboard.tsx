'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Radar, 
  Layers, 
  ShieldAlert, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle,
  FileCheck,
  CheckSquare,
  Activity,
  CalendarClock,
  Search,
  Globe,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  HelpCircle,
  X
} from 'lucide-react';
import { DarkSpotMetrics } from '@/types';

// Lazy load Spline strictly client-side per skill instructions
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <SplineBackgroundRadarFallback isConnecting={true} />
});

// User specified Spline 3D scene
const SPLINE_SCENE_URL = 'https://prod.spline.design/hKClaNwSIFExj9Xp/scene.splinecode';

interface Fullscreen3DDashboardProps {
  metrics: DarkSpotMetrics;
  topic: string;
  activeTab: 'gaps' | 'conflicts' | 'freshness' | 'evidence' | 'checklist' | 'none';
  onTabChange: (tab: 'gaps' | 'conflicts' | 'freshness' | 'evidence' | 'checklist' | 'none') => void;
  onSelectScenario: (scenarioId: string) => void;
  onAnalyzeCustom: (topic: string, sources: Array<{ title: string; url?: string; content?: string }>) => void;
  onOpenHowItWorks: () => void;
  activeScenarioId?: string;
  isLoading?: boolean;
}

export const Spline3DDashboard: React.FC<Fullscreen3DDashboardProps> = ({
  metrics,
  topic,
  activeTab,
  onTabChange,
  onSelectScenario,
  onAnalyzeCustom,
  onOpenHowItWorks,
  activeScenarioId,
  isLoading = false
}) => {
  const [hasWebGL] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });

  const [is3DActive, setIs3DActive] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [sceneStatus, setSceneStatus] = useState<string>('Initializing 3D Matrix...');
  const [isHudMinimized, setIsHudMinimized] = useState<boolean>(false);
  const [customInputOpen, setCustomInputOpen] = useState<boolean>(false);

  // Custom input state
  const [customTopic, setCustomTopic] = useState('');
  const [customSources, setCustomSources] = useState<Array<{ id: string; url: string; title: string }>>([
    { id: '1', url: 'https://example-university.edu/guidelines', title: 'Official Source' },
    { id: '2', url: 'https://community-forum.org/advice', title: 'Community Forum' }
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splineRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSplineLoad = (app: any) => {
    splineRef.current = app;
    setSceneStatus('3D Matrix Online');

    // Remove template conference text completely (scale to 0 & hide)
    try {
      if (typeof app.getAllObjects === 'function') {
        const all = app.getAllObjects();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        all.forEach((obj: any) => {
          if (!obj || !obj.name) return;
          const n = obj.name.toLowerCase();
          if (
            n.includes('register') || 
            n.includes('agenda') || 
            n.includes('speaker') || 
            n.includes('faq') || 
            n.includes('canvas') || 
            n.includes('text') || 
            n.includes('october')
          ) {
            obj.visible = false;
            if (obj.scale) {
              obj.scale.x = 0;
              obj.scale.y = 0;
              obj.scale.z = 0;
            }
            if (obj.position) {
              obj.position.y = -99999;
            }
          }
        });
      }

      const specific = ['Register', 'Text', 'Text 2', 'Text 3', 'canvas'];
      specific.forEach(name => {
        const o = app.findObjectByName(name);
        if (o) {
          o.visible = false;
          if (o.scale) { o.scale.x = 0; o.scale.y = 0; o.scale.z = 0; }
          if (o.position) { o.position.y = -99999; }
        }
      });
    } catch (err) {
      console.warn('Spline customization notice:', err);
    }
  };

  const handleResetCamera = () => {
    if (splineRef.current) {
      try {
        if (typeof splineRef.current.setZoom === 'function') {
          splineRef.current.setZoom(1);
        }
        splineRef.current.emitEvent('start', 'Camera');
      } catch {
        // safe ignore
      }
    }
  };

  const handleAddSource = () => {
    setCustomSources(prev => [
      ...prev,
      { id: String(Date.now()), url: '', title: `Source ${prev.length + 1}` }
    ]);
  };

  const handleRemoveSource = (id: string) => {
    if (customSources.length <= 1) return;
    setCustomSources(prev => prev.filter(s => s.id !== id));
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    onAnalyzeCustom(
      customTopic,
      customSources.map(s => ({ title: s.title, url: s.url }))
    );
    setCustomInputOpen(false);
  };

  const isHealthy = metrics.completenessScore >= 80;
  const isModerate = metrics.completenessScore >= 50 && metrics.completenessScore < 80;
  const scoreBadgeColor = isHealthy
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : isModerate
    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#07080c] text-white flex flex-col justify-between select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          1. FULLSCREEN 3D SPLINE BACKGROUND VIEWPORT (WHOLE WEBSITE)
         ───────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-auto">
        {is3DActive && hasWebGL && !loadError ? (
          <Suspense fallback={<SplineBackgroundRadarFallback isConnecting={true} />}>
            <Spline
              scene={SPLINE_SCENE_URL}
              onLoad={handleSplineLoad}
              onError={() => setLoadError(true)}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />
          </Suspense>
        ) : (
          <SplineBackgroundRadarFallback isConnecting={false} />
        )}
        
        {/* Subtle vignette gradient so foreground UI is razor-sharp */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/40 to-[#07080c]/70 pointer-events-none" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING TOP COMMAND BAR
         ───────────────────────────────────────────────────────────── */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="glass-panel rounded-2xl px-4 py-3 border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-xl bg-black/60">
          
          {/* Logo & Hackathon Tag */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/30">
              <Radar className="w-5 h-5 text-white animate-spin [animation-duration:10s]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white">
                  Dark<span className="text-indigo-400">Spot</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  3D Cockpit
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 hidden sm:block">
                Information Gap & Contradiction Detection Platform
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center space-x-2">
            
            <button
              onClick={() => setCustomInputOpen(!customInputOpen)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                customInputOpen 
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30' 
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>{customInputOpen ? 'Close Input' : 'Analyze Custom URLs'}</span>
            </button>

            <button
              onClick={handleResetCamera}
              title="Reset 3D Camera"
              className="p-2 rounded-xl text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            <button
              onClick={() => setIsHudMinimized(!isHudMinimized)}
              title={isHudMinimized ? 'Show Cockpit Controls' : 'Hide Cockpit (Pure 3D)'}
              className="p-2 rounded-xl text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              {isHudMinimized ? <Maximize2 className="w-3.5 h-3.5 text-indigo-400" /> : <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />}
            </button>

            <button
              onClick={onOpenHowItWorks}
              className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Why Gaps Matter</span>
            </button>

            <button
              onClick={() => setIs3DActive(!is3DActive)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              {is3DActive ? '2D Radar' : '3D WebGL'}
            </button>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. EXPANDABLE CUSTOM URL INGESTION MODAL / DRAWER
         ───────────────────────────────────────────────────────────── */}
      {customInputOpen && (
        <div className="relative z-40 w-full max-w-3xl mx-auto px-4 mt-3">
          <form onSubmit={handleCustomSubmit} className="glass-panel rounded-2xl p-5 border border-indigo-500/40 bg-black/85 backdrop-blur-2xl shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Custom Source Scraper & Gap Analyzer</span>
              </span>
              <button
                type="button"
                onClick={() => setCustomInputOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                Your Research Question or Goal
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                placeholder="e.g. What should I verify before applying for the State STEM Scholarship?"
                className="w-full text-xs p-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase">
                Web Sources to Cross-Examine ({customSources.length})
              </label>
              {customSources.map((s, idx) => (
                <div key={s.id} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={s.url}
                    onChange={e => {
                      const val = e.target.value;
                      setCustomSources(prev => prev.map(item => item.id === s.id ? { ...item, url: val } : item));
                    }}
                    placeholder={`https://source-${idx + 1}.edu/eligibility`}
                    className="flex-1 text-xs p-2 rounded-lg bg-zinc-950 border border-white/10 text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                  {customSources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(s.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleAddSource}
                className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Another URL</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || !customTopic.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Scan for Digital Dark Spots</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. FLOATING CENTER COCKPIT & LIVE TELEMETRY
         ───────────────────────────────────────────────────────────── */}
      {!isHudMinimized && (
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 my-auto py-4">
          <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-indigo-500/30 bg-black/65 backdrop-blur-2xl shadow-2xl space-y-5">
            
            {/* Top Mission Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase text-indigo-300">
                    {sceneStatus}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[11px] text-zinc-400">Shinchan Hackathon 2026</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {topic}
                </h1>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${scoreBadgeColor}`}>
                  {metrics.completenessScore}% Information Completeness
                </span>
              </div>
            </div>

            {/* Completeness Bar & 3 Telemetry Risk Badges */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Completeness Progress Gauge */}
              <div className="md:col-span-5 space-y-2">
                <div className="flex justify-between text-xs text-zinc-300 font-medium">
                  <span>Sourced Evidence: <strong className="text-white">{metrics.completenessScore}%</strong></span>
                  <span className="text-rose-400 font-mono">{100 - metrics.completenessScore}% Dark Spot Area</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-violet-400 to-emerald-400 rounded-full transition-all duration-700 shadow-md"
                    style={{ width: `${metrics.completenessScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  {metrics.summaryVerdict}
                </p>
              </div>

              {/* 3 Clickable Telemetry Badges */}
              <div className="md:col-span-7 grid grid-cols-3 gap-2.5">
                
                <button
                  onClick={() => onTabChange('gaps')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activeTab === 'gaps'
                      ? 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/50 shadow-lg shadow-rose-950/50'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between text-rose-400 mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase">GAPS</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{metrics.criticalGapsCount + metrics.moderateGapsCount}</div>
                  <div className="text-[10px] text-zinc-400 truncate">Missing facets</div>
                </button>

                <button
                  onClick={() => onTabChange('conflicts')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activeTab === 'conflicts'
                      ? 'border-amber-500 bg-amber-950/40 ring-2 ring-amber-500/50 shadow-lg shadow-amber-950/50'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between text-amber-400 mb-1">
                    <Layers className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase">CLASH</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{metrics.conflictsCount}</div>
                  <div className="text-[10px] text-zinc-400 truncate">Contradictions</div>
                </button>

                <button
                  onClick={() => onTabChange('freshness')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activeTab === 'freshness'
                      ? 'border-orange-500 bg-orange-950/40 ring-2 ring-orange-500/50 shadow-lg shadow-orange-950/50'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between text-orange-400 mb-1">
                    <CalendarClock className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase">STALE</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{metrics.temporalWarningsCount}</div>
                  <div className="text-[10px] text-zinc-400 truncate">Outdated cycles</div>
                </button>

              </div>

            </div>

            {/* 1-Click Evaluation Scenarios Bar */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                <span className="flex items-center space-x-1.5 text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Instant 1-Click Scenarios for Judges:</span>
                </span>
                <span className="text-[10px] text-zinc-500 lowercase">Click to load zero-latency benchmark</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => onSelectScenario('scholarship-2026')}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs space-y-0.5 ${
                    activeScenarioId === 'scholarship-2026'
                      ? 'border-indigo-500 bg-indigo-600/25 text-white ring-1 ring-indigo-500'
                      : 'border-white/5 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>🎓 STEM Scholarship</span>
                    {activeScenarioId === 'scholarship-2026' && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-1">PDF Section 3: renewal gaps & $50k conflict</p>
                </button>

                <button
                  onClick={() => onSelectScenario('stem-opt-visa')}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs space-y-0.5 ${
                    activeScenarioId === 'stem-opt-visa'
                      ? 'border-indigo-500 bg-indigo-600/25 text-white ring-1 ring-indigo-500'
                      : 'border-white/5 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>🛂 STEM OPT Visa</span>
                    {activeScenarioId === 'stem-opt-visa' && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-1">180-day grace gap & 10 vs 30-day reporting</p>
                </button>

                <button
                  onClick={() => onSelectScenario('clean-energy-rebate')}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs space-y-0.5 ${
                    activeScenarioId === 'clean-energy-rebate'
                      ? 'border-indigo-500 bg-indigo-600/25 text-white ring-1 ring-indigo-500'
                      : 'border-white/5 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>⚡ EV Tax Credit</span>
                    {activeScenarioId === 'clean-energy-rebate' && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-1">Point-of-sale transfer & sedan MSRP caps</p>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. FLOATING BOTTOM COCKPIT DOCK (5 FEATURE TABS)
         ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-2">
        <div className="glass-panel rounded-2xl px-4 py-2.5 border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-xl bg-black/70">
          
          <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span className="hidden sm:inline">Orbit 3D World (Click & Drag)</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            
            <button
              onClick={() => onTabChange(activeTab === 'gaps' ? 'none' : 'gaps')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'gaps'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-1 ring-rose-400'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Gaps ({metrics.criticalGapsCount + metrics.moderateGapsCount})</span>
              {activeTab === 'gaps' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

            <button
              onClick={() => onTabChange(activeTab === 'conflicts' ? 'none' : 'conflicts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'conflicts'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/40 ring-1 ring-amber-400'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Conflicts ({metrics.conflictsCount})</span>
              {activeTab === 'conflicts' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

            <button
              onClick={() => onTabChange(activeTab === 'freshness' ? 'none' : 'freshness')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'freshness'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/40 ring-1 ring-orange-400'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Stale ({metrics.temporalWarningsCount})</span>
              {activeTab === 'freshness' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

            <button
              onClick={() => onTabChange(activeTab === 'evidence' ? 'none' : 'evidence')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'evidence'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-1 ring-emerald-400'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Evidence</span>
              {activeTab === 'evidence' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

            <button
              onClick={() => onTabChange(activeTab === 'checklist' ? 'none' : 'checklist')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-1 ring-indigo-400'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Checklist</span>
              {activeTab === 'checklist' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

          </div>

        </div>
      </footer>

    </div>
  );
};

/**
 * Animated Fullscreen Radar Fallback
 * Used while Spline 3D downloads or if WebGL is unavailable
 */
function SplineBackgroundRadarFallback({ isConnecting }: { isConnecting: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const centerX = () => canvas.width / 2;
    const centerY = () => canvas.height / 2;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = centerX();
      const cy = centerY();
      const radius = Math.min(cx, cy) * 0.85;

      ctx.fillStyle = '#07080c';
      ctx.fillRect(0, 0, width, height);

      // Radar rings
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 5) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Sweep
      const sweepX = cx + radius * Math.cos(angle);
      const sweepY = cy + radius * Math.sin(angle);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      grad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle - 0.6, angle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Beam
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      angle += 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#07080c]">
      <canvas ref={canvasRef} className="w-full h-full" />
      {isConnecting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm space-y-2 pointer-events-none">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-indigo-300">
            Initializing Fullscreen 3D Spline Matrix...
          </span>
        </div>
      )}
    </div>
  );
}
