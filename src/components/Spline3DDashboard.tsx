'use client';

import React, { useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { 
  Radar, 
  Layers, 
  ShieldAlert, 
  Maximize2, 
  Minimize2, 
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
  Loader2
} from 'lucide-react';
import { DarkSpotMetrics } from '@/types';

// Lazy load Spline strictly client-side
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <SplineRadarFallback isConnecting={true} />
});

// User's specified Spline 3D Dashboard scene URL
const SPLINE_DASHBOARD_URL = 'https://prod.spline.design/hKClaNwSIFExj9Xp/scene.splinecode';

interface Spline3DDashboardProps {
  metrics: DarkSpotMetrics;
  topic: string;
  activeTab: 'gaps' | 'conflicts' | 'freshness' | 'evidence' | 'checklist';
  onTabChange: (tab: 'gaps' | 'conflicts' | 'freshness' | 'evidence' | 'checklist') => void;
  onSelectScenario: (scenarioId: string) => void;
  onAnalyzeCustom: (topic: string, sources: Array<{ title: string; url?: string; content?: string }>) => void;
  activeScenarioId?: string;
  isLoading?: boolean;
}

export const Spline3DDashboard: React.FC<Spline3DDashboardProps> = ({
  metrics,
  topic,
  activeTab,
  onTabChange,
  onSelectScenario,
  onAnalyzeCustom,
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

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [is3DActive, setIs3DActive] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [sceneStatus, setSceneStatus] = useState<string>('Syncing 3D Scene...');
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
    setSceneStatus('3D Radar Online');

    // EDIT THE 3D DASHBOARD: Clean up all irrelevant conference template text
    try {
      if (typeof app.getAllObjects === 'function') {
        const all = app.getAllObjects();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        all.forEach((obj: any) => {
          if (!obj || !obj.name) return;
          const n = obj.name.toLowerCase();
          // Hide template text: "Register", "canvas 24", "October 8, 2024", "Agenda Speakers FAQ"
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
          }
        });
      }

      // Hide specific named objects directly
      const specificToHide = ['Register', 'Text', 'Text 2', 'Text 3', 'canvas'];
      specificToHide.forEach(name => {
        const o = app.findObjectByName(name);
        if (o) o.visible = false;
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
    <div className={`relative w-full rounded-3xl overflow-hidden glass-panel border border-indigo-500/30 transition-all duration-500 shadow-2xl ${
      isExpanded ? 'min-h-[750px] p-4 sm:p-6 ring-2 ring-indigo-500/40' : 'p-5 sm:p-7'
    } bg-gradient-to-b from-[#0e101a] via-[#090a0f] to-[#07080c]`}>
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-20">
        
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DIGITAL DARK SPOT COCKPIT</span>
            </span>

            <span className="text-[11px] text-zinc-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {sceneStatus}
            </span>

            <span className="text-xs text-zinc-400 hidden sm:inline">•</span>
            <span className="text-xs text-zinc-300 font-medium truncate max-w-[280px] sm:max-w-md">
              {topic}
            </span>
          </div>
        </div>

        {/* 3D Dashboard Controls */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={() => setCustomInputOpen(!customInputOpen)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              customInputOpen
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>{customInputOpen ? 'Close Ingestion' : 'Analyze Custom URLs'}</span>
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset 3D Viewport Camera"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Reset Camera</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse 3D Dashboard' : 'Expand Fullscreen 3D View'}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Compact</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIs3DActive(!is3DActive)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            {is3DActive ? '2D Radar' : '3D WebGL'}
          </button>
        </div>

      </div>

      {/* Expandable Custom URL & Topic Ingestion Form */}
      {customInputOpen && (
        <form onSubmit={handleCustomSubmit} className="mt-4 p-4 rounded-2xl bg-zinc-900/90 border border-indigo-500/30 space-y-3 relative z-30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Custom Topic & URL Ingestion
            </span>
            <span className="text-[11px] text-zinc-400">
              Scrapes web pages & detects missing parameters
            </span>
          </div>

          <div>
            <input
              type="text"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="e.g. What should I verify before applying for the 2026 State AI Research Grant?"
              className="w-full text-xs p-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            {customSources.map((s, idx) => (
              <div key={s.id} className="flex items-center space-x-2">
                <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <input
                  type="url"
                  value={s.url}
                  onChange={e => {
                    const val = e.target.value;
                    setCustomSources(prev => prev.map(item => item.id === s.id ? { ...item, url: val } : item));
                  }}
                  placeholder={`https://source-${idx + 1}.gov/rules`}
                  className="flex-1 text-xs p-2 rounded-lg bg-black/60 border border-white/10 text-white font-mono focus:outline-none focus:border-indigo-500"
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
              <span>Add Another URL</span>
            </button>

            <button
              type="submit"
              disabled={isLoading || !customTopic.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 flex items-center space-x-1.5"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Scan & Cross-Examine</span>
            </button>
          </div>
        </form>
      )}

      {/* Main 3D Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-5 relative z-10">
        
        {/* Left Side: Real-Time HUD Overlay Panels */}
        <div className={`${isExpanded ? 'lg:col-span-4' : 'lg:col-span-5'} space-y-4`}>
          
          {/* Completeness Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Radar className="w-4 h-4 text-indigo-400" />
                <span>Information Completeness</span>
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreBadgeColor}`}>
                {metrics.completenessScore}% Sourced
              </span>
            </div>

            <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${metrics.completenessScore}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-zinc-400 pt-0.5 font-mono">
              <span>{100 - metrics.completenessScore}% Unverified Dark Spot</span>
              <span className="text-indigo-300 font-semibold">Active Synthesis</span>
            </div>
          </div>

          {/* Quick HUD Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            
            <button
              onClick={() => onTabChange('gaps')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTab === 'gaps'
                  ? 'border-rose-500 bg-rose-950/20 ring-1 ring-rose-500/50'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-rose-400 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase font-mono">GAPS</span>
              </div>
              <div className="text-xl font-black text-white">{metrics.criticalGapsCount + metrics.moderateGapsCount}</div>
              <div className="text-[10px] text-zinc-400 truncate">Dark spots</div>
            </button>

            <button
              onClick={() => onTabChange('conflicts')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTab === 'conflicts'
                  ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/50'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase font-mono">CLASH</span>
              </div>
              <div className="text-xl font-black text-white">{metrics.conflictsCount}</div>
              <div className="text-[10px] text-zinc-400 truncate">Contradictions</div>
            </button>

            <button
              onClick={() => onTabChange('freshness')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTab === 'freshness'
                  ? 'border-orange-500 bg-orange-950/20 ring-1 ring-orange-500/50'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-orange-400 mb-1">
                <CalendarClock className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase font-mono">STALE</span>
              </div>
              <div className="text-xl font-black text-white">{metrics.temporalWarningsCount}</div>
              <div className="text-[10px] text-zinc-400 truncate">Outdated cycles</div>
            </button>

          </div>

          {/* Quick Scenario Preset Pills */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-2">
            <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>1-Click Live Scenarios for Judges:</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => onSelectScenario('scholarship-2026')}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center justify-between ${
                  activeScenarioId === 'scholarship-2026'
                    ? 'border-indigo-500 bg-indigo-600/20 text-white'
                    : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-semibold text-white">🎓 STEM Scholarship (PDF Official Use Case)</div>
                  <div className="text-[11px] text-zinc-400">Renewal gaps, $50k vs $65k conflict, 2024 stale notice</div>
                </div>
                {activeScenarioId === 'scholarship-2026' && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0 ml-2" />}
              </button>

              <button
                onClick={() => onSelectScenario('stem-opt-visa')}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center justify-between ${
                  activeScenarioId === 'stem-opt-visa'
                    ? 'border-indigo-500 bg-indigo-600/20 text-white'
                    : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-semibold text-white">🛂 STEM OPT 24-Month Visa Rules</div>
                  <div className="text-[11px] text-zinc-400">180-day grace gap, 10 vs 30-day reporting discrepancy</div>
                </div>
                {activeScenarioId === 'stem-opt-visa' && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0 ml-2" />}
              </button>

              <button
                onClick={() => onSelectScenario('clean-energy-rebate')}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center justify-between ${
                  activeScenarioId === 'clean-energy-rebate'
                    ? 'border-indigo-500 bg-indigo-600/20 text-white'
                    : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-semibold text-white">⚡ 2026 Clean Energy EV Tax Credit</div>
                  <div className="text-[11px] text-zinc-400">Point-of-sale transfer gaps, sedan vs SUV MSRP limits</div>
                </div>
                {activeScenarioId === 'clean-energy-rebate' && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0 ml-2" />}
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: The 3D Spline Dashboard Canvas Viewport */}
        <div className={`${isExpanded ? 'lg:col-span-8' : 'lg:col-span-7'}`}>
          <div className={`relative w-full rounded-2xl overflow-hidden border border-indigo-500/20 bg-black/60 shadow-2xl transition-all duration-300 ${
            isExpanded ? 'h-[560px]' : 'h-[380px] sm:h-[440px]'
          }`}>
            
            {/* 3D Spline Scene Viewport */}
            {is3DActive && hasWebGL && !loadError ? (
              <Suspense fallback={<SplineRadarFallback isConnecting={true} />}>
                <Spline
                  scene={SPLINE_DASHBOARD_URL}
                  onLoad={handleSplineLoad}
                  onError={() => setLoadError(true)}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                />
              </Suspense>
            ) : (
              <SplineRadarFallback isConnecting={false} />
            )}

            {/* Custom Overlay: Branding the 3D Canvas specifically for DarkSpot AI */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center space-x-2">
              <span className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-indigo-500/30 text-xs font-mono font-bold text-indigo-300 flex items-center space-x-2 shadow-lg">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>DARKSPOT 3D RADAR MATRIX</span>
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300 shadow-lg">
                Interactive: Click & drag to rotate 3D prisms
              </div>
              <div className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-indigo-500/30 text-[11px] font-mono text-indigo-300 shadow-lg">
                Shinchan Hackathon 2026
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Integrated Dock: 5 Core Views */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-20">
        
        <div className="text-xs text-zinc-400 font-medium">
          Select Analysis View:
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          
          <button
            onClick={() => onTabChange('gaps')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'gaps'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-1 ring-rose-400'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Information Gaps ({metrics.criticalGapsCount + metrics.moderateGapsCount})</span>
          </button>

          <button
            onClick={() => onTabChange('conflicts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'conflicts'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/40 ring-1 ring-amber-400'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Contradiction Radar ({metrics.conflictsCount})</span>
          </button>

          <button
            onClick={() => onTabChange('freshness')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'freshness'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/40 ring-1 ring-orange-400'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Temporal Audit ({metrics.temporalWarningsCount})</span>
          </button>

          <button
            onClick={() => onTabChange('evidence')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'evidence'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-1 ring-emerald-400'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Evidence & Facts</span>
          </button>

          <button
            onClick={() => onTabChange('checklist')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'checklist'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-1 ring-indigo-400'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Verification Checklist</span>
          </button>

        </div>

      </div>

    </div>
  );
};

/**
 * Animated Radar Fallback
 * Renders an animated radar sweep with dark spots and nodes.
 * Used while 3D Spline downloads or if WebGL is unavailable / user toggles 2D mode.
 */
function SplineRadarFallback({ isConnecting }: { isConnecting: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 400);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 25;

    const points = [
      { r: radius * 0.45, theta: 0.8, label: 'Renewal Gap', color: '#f43f5e' },
      { r: radius * 0.75, theta: 2.2, label: 'Income Conflict', color: '#f59e0b' },
      { r: radius * 0.60, theta: 4.1, label: '2024 Stale Date', color: '#fb923c' },
      { r: radius * 0.35, theta: 5.3, label: 'Verified Quote', color: '#10b981' }
    ];

    const render = () => {
      ctx.fillStyle = '#07080c';
      ctx.fillRect(0, 0, width, height);

      // Radar Concentric Circles
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radar Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.stroke();

      // Radar Sweep Line
      const sweepX = centerX + radius * Math.cos(angle);
      const sweepY = centerY + radius * Math.sin(angle);

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle - 0.5, angle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Radar Beam
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Render Detected Points
      points.forEach(pt => {
        const px = centerX + pt.r * Math.cos(pt.theta);
        const py = centerY + pt.r * Math.sin(pt.theta);

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(pt.label, px + 8, py + 3);
      });

      angle += 0.025;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#07080c]">
      <canvas ref={canvasRef} className="w-full h-full" />
      {isConnecting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] space-y-2 pointer-events-none">
          <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-indigo-300">
            Connecting 3D Radar Matrix...
          </span>
        </div>
      )}
    </div>
  );
}
