'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Radar, Layers, ShieldAlert } from 'lucide-react';

// Lazy load the Spline component strictly client-side per skill instructions
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <Spline3DFallback isConnecting={true} />
});

// Production-tested Spline 3D Scene URL (Cybernetic Dark Particle Radar Sphere)
const SPLINE_SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

interface Spline3DHeroProps {
  onExploreGaps?: () => void;
  gapsCount: number;
  conflictsCount: number;
  completenessScore: number;
}

export const Spline3DHero: React.FC<Spline3DHeroProps> = ({
  gapsCount,
  conflictsCount,
  completenessScore
}) => {
  // Check WebGL availability safely without cascading effects
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

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel border border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 via-zinc-950/60 to-[#090a0f] p-6 sm:p-8 mb-8 shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Mission & Metrics Callout */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">3D Information Radar Active</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400 font-normal">Real-Time Synthesis</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Uncover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-rose-400">Digital Dark Spots</span> in Critical Information.
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            Search finds text. Summarizers compress text. <strong>DarkSpot AI</strong> cross-examines multi-source literature to surface what is dangerously <em>missing</em>, <em>contradictory</em>, or <em>stale</em> before you commit.
          </p>

          {/* Real-time 3D telemetry pills */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center space-x-1">
                <Radar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Completeness</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {completenessScore}%
              </div>
              <div className="text-[10px] text-zinc-500">
                {100 - completenessScore}% blindspot area
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-[11px] font-medium text-rose-400 uppercase tracking-wider flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Gaps Flagged</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-300">
                {gapsCount}
              </div>
              <div className="text-[10px] text-zinc-500">
                Unstated decision facets
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-[11px] font-medium text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Conflicts</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                {conflictsCount}
              </div>
              <div className="text-[10px] text-zinc-500">
                Cross-source claims
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-1">
            <div className="flex items-center space-x-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Interactive 3D WebGL Visualization</span>
            </div>
            
            {/* Toggle 3D scene in case user wants static low-power mode */}
            <button
              onClick={() => setIs3DActive(!is3DActive)}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium transition-colors"
            >
              {is3DActive ? 'Switch to Lightweight Canvas' : 'Enable 3D Spline Scene'}
            </button>
          </div>

        </div>

        {/* Right Column: 3D Spline Canvas / WebGL Radar Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-inner group">
            
            {/* 3D Scene Viewport */}
            {is3DActive && hasWebGL && !loadError ? (
              <Suspense fallback={<Spline3DFallback isConnecting={true} />}>
                <Spline
                  scene={SPLINE_SCENE_URL}
                  onError={() => setLoadError(true)}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                />
              </Suspense>
            ) : (
              <Spline3DFallback isConnecting={false} />
            )}

            {/* Viewport Overlay Controls */}
            <div className="absolute top-3 left-3 flex items-center space-x-2 z-20 pointer-events-none">
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-indigo-300 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>3D RADAR SCANNER</span>
              </span>
            </div>

            <div className="absolute bottom-3 right-3 z-20">
              <span className="text-[10px] text-zinc-400 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono">
                Drag to rotate 3D mesh
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

/**
 * Interactive Radar Canvas Fallback
 * Renders an animated radar sweep with dark spots and nodes.
 * Used while 3D Spline downloads or if WebGL is unavailable / user toggles low-power mode.
 */
function Spline3DFallback({ isConnecting }: { isConnecting: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 380);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Simulated information gap points
    const points = [
      { r: radius * 0.45, theta: 0.8, label: 'Renewal Gap', color: '#f43f5e' },
      { r: radius * 0.75, theta: 2.2, label: 'Income Conflict', color: '#f59e0b' },
      { r: radius * 0.60, theta: 4.1, label: '2024 Stale Date', color: '#fb923c' },
      { r: radius * 0.35, theta: 5.3, label: 'Verified Quote', color: '#10b981' }
    ];

    const render = () => {
      ctx.fillStyle = '#090a0f';
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
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
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
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#090a0f]">
      <canvas ref={canvasRef} className="w-full h-full" />
      {isConnecting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] space-y-2 pointer-events-none">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px] font-mono text-indigo-300">
            Initializing Spline 3D Scene...
          </span>
        </div>
      )}
    </div>
  );
}
