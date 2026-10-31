'use client';

import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Maximize2, Minimize2, Eye, Sparkles, Orbit } from 'lucide-react';

interface Prism3D {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  colorGrad: [string, string, string];
  pulseSpeed: number;
  phase: number;
}

interface RadarNode {
  x: number;
  y: number;
  z: number;
  label: string;
  type: 'gap' | 'conflict' | 'stale' | 'sourced';
  color: string;
}

interface Interactive3DPrismsProps {
  gapsCount: number;
  conflictsCount: number;
  staleCount: number;
  sourcedCount: number;
  onSelectView?: (view: string) => void;
  is2DMode?: boolean;
}

export const Interactive3DPrisms: React.FC<Interactive3DPrismsProps> = ({
  gapsCount,
  conflictsCount,
  staleCount,
  sourcedCount,
  onSelectView,
  is2DMode = false
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useLiveSplineIframe, setUseLiveSplineIframe] = useState(false);

  // Orbit rotation angles
  const rotXRef = useRef(-0.25);
  const rotYRef = useRef(0.4);
  const zoomRef = useRef(1.0);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Reset camera handler
  const handleResetCamera = () => {
    rotXRef.current = -0.25;
    rotYRef.current = 0.4;
    zoomRef.current = 1.0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Build the holographic 3D prisms (mimicking the rainbow metallic bars in Image 1 & 2)
    const prisms: Prism3D[] = [];
    const prismCount = 14;
    const colors: [string, string, string][] = [
      ['#A855F7', '#3B82F6', '#06B6D4'], // violet to cyan
      ['#EC4899', '#8B5CF6', '#3B82F6'], // pink to blue
      ['#F59E0B', '#EF4444', '#EC4899'], // amber to pink
      ['#10B981', '#06B6D4', '#3B82F6'], // emerald to teal
      ['#8B5CF6', '#D946EF', '#F43F5E']  // neon purple
    ];

    for (let i = 0; i < prismCount; i++) {
      const angle = (i / prismCount) * Math.PI * 1.6 - 0.8;
      const radius = 170 + Math.sin(i * 0.7) * 45;
      prisms.push({
        x: Math.sin(angle) * radius,
        y: (i - prismCount / 2) * 12 + Math.cos(i) * 20,
        z: Math.cos(angle) * radius * 0.65,
        width: 18,
        height: 120 + Math.sin(i * 0.8) * 40,
        depth: 22,
        rotX: 0.15 + Math.sin(i) * 0.1,
        rotY: angle + 0.3,
        rotZ: -0.15,
        colorGrad: colors[i % colors.length],
        pulseSpeed: 0.8 + (i % 3) * 0.3,
        phase: i * 0.5
      });
    }

    // Build information radar nodes floating in 3D
    const nodes: RadarNode[] = [
      { x: -120, y: -80, z: 70, label: 'Income Limit Conflict', type: 'conflict', color: '#EF4444' },
      { x: 130, y: -60, z: -40, label: 'Renewal Criteria Gap', type: 'gap', color: '#F59E0B' },
      { x: -90, y: 70, z: -60, label: '2024 Stale Cycle Notice', type: 'stale', color: '#FB923C' },
      { x: 110, y: 80, z: 90, label: 'Official 2026 Portal Link', type: 'sourced', color: '#14B8A6' },
      { x: 0, y: -110, z: 30, label: 'Verification Checklist Active', type: 'sourced', color: '#8B5CF6' }
    ];

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse drag handlers for 3D orbit
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      rotYRef.current += dx * 0.008;
      rotXRef.current += dy * 0.008;
      rotXRef.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotXRef.current));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRef.current -= e.deltaY * 0.001;
      zoomRef.current = Math.max(0.6, Math.min(1.8, zoomRef.current));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastMousePosRef.current.x;
      const dy = e.touches[0].clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      rotYRef.current += dx * 0.01;
      rotXRef.current += dy * 0.01;
    };
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // 3D Projection math
    const project = (
      x: number,
      y: number,
      z: number,
      cx: number,
      cy: number,
      fl: number
    ) => {
      // Rotate Y
      const cosY = Math.cos(rotYRef.current);
      const sinY = Math.sin(rotYRef.current);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotate X
      const cosX = Math.cos(rotXRef.current);
      const sinX = Math.sin(rotXRef.current);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const scale = (fl / (fl + z2 + 380)) * zoomRef.current;
      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        depth: z2,
        scale
      };
    };

    const render = () => {
      time += 0.018;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const fl = 340;

      // Background clear: deep void with subtle cosmic gradient
      ctx.fillStyle = '#06080D';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Subtle background grid floor / radar ring
      ctx.save();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
      ctx.lineWidth = 1;

      // Concentric rings
      const ringRadii = [60, 120, 180, 240];
      for (const r of ringRadii) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const rx = Math.cos(a) * r;
          const rz = Math.sin(a) * r;
          const p = project(rx, 110, rz, cx, cy, fl);
          if (a === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Radar sweep line
      const sweepAngle = time * 1.5;
      const sweepP1 = project(0, 110, 0, cx, cy, fl);
      const sweepP2 = project(Math.cos(sweepAngle) * 240, 110, Math.sin(sweepAngle) * 240, cx, cy, fl);
      const sweepGrad = ctx.createLinearGradient(sweepP1.px, sweepP1.py, sweepP2.px, sweepP2.py);
      sweepGrad.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
      sweepGrad.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
      ctx.strokeStyle = sweepGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sweepP1.px, sweepP1.py);
      ctx.lineTo(sweepP2.px, sweepP2.py);
      ctx.stroke();
      ctx.restore();

      // Render 3D Prisms sorted by depth
      interface RenderablePrism {
        pTop: ReturnType<typeof project>;
        pBottom: ReturnType<typeof project>;
        pRight: ReturnType<typeof project>;
        pLeft: ReturnType<typeof project>;
        depth: number;
        prism: Prism3D;
      }

      const renderableList: RenderablePrism[] = [];

      for (let i = 0; i < prisms.length; i++) {
        const p = prisms[i];
        // Idle gentle wave animation
        const wave = Math.sin(time * p.pulseSpeed + p.phase) * 8;
        const curY = p.y + wave;

        const hw = p.width / 2;
        const hh = p.height / 2;
        const hd = p.depth / 2;

        const pTop = project(p.x, curY - hh, p.z, cx, cy, fl);
        const pBottom = project(p.x, curY + hh, p.z, cx, cy, fl);
        const pRight = project(p.x + hw, curY, p.z + hd, cx, cy, fl);
        const pLeft = project(p.x - hw, curY, p.z - hd, cx, cy, fl);

        const avgDepth = (pTop.depth + pBottom.depth) / 2;
        renderableList.push({ pTop, pBottom, pRight, pLeft, depth: avgDepth, prism: p });
      }

      // Sort by depth (back to front)
      renderableList.sort((a, b) => b.depth - a.depth);

      for (const item of renderableList) {
        const { pTop, pBottom, pRight, pLeft, prism } = item;
        const scale = pTop.scale;
        if (scale <= 0) continue;

        // Front Face (Prism Extrusion)
        ctx.save();
        const grad = ctx.createLinearGradient(pLeft.px, pTop.py, pRight.px, pBottom.py);
        grad.addColorStop(0, prism.colorGrad[0]);
        grad.addColorStop(0.5, prism.colorGrad[1]);
        grad.addColorStop(1, prism.colorGrad[2]);

        ctx.fillStyle = grad;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(pTop.px, pTop.py);
        ctx.lineTo(pRight.px, pRight.py);
        ctx.lineTo(pBottom.px, pBottom.py);
        ctx.lineTo(pLeft.px, pLeft.py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Metallic reflection highlight
        const hlGrad = ctx.createLinearGradient(pTop.px, pTop.py, pLeft.px, pBottom.py);
        hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        hlGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
        hlGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

        ctx.fillStyle = hlGrad;
        ctx.fill();
        ctx.restore();
      }

      // Render floating Holographic Radar Nodes
      for (const node of nodes) {
        const floatY = node.y + Math.sin(time * 2 + node.x) * 6;
        const proj = project(node.x, floatY, node.z, cx, cy, fl);
        if (proj.scale <= 0) continue;

        ctx.save();
        // Glowing halo
        const glowRad = Math.max(4, 14 * proj.scale);
        const glow = ctx.createRadialGradient(proj.px, proj.py, 1, proj.px, proj.py, glowRad);
        glow.addColorStop(0, node.color);
        glow.addColorStop(0.4, node.color + '66');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, Math.max(2, 3.5 * proj.scale), 0, Math.PI * 2);
        ctx.fill();

        // Label pill
        if (proj.scale > 0.75) {
          ctx.font = `600 ${Math.round(10 * proj.scale)}px monospace`;
          const textWidth = ctx.measureText(node.label).width;
          const pad = 6 * proj.scale;

          ctx.fillStyle = 'rgba(11, 15, 20, 0.85)';
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(
            proj.px - textWidth / 2 - pad,
            proj.py - 22 * proj.scale,
            textWidth + pad * 2,
            16 * proj.scale,
            4
          );
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#E4E4E7';
          ctx.fillText(node.label, proj.px - textWidth / 2, proj.py - 10 * proj.scale);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden border border-white/10 bg-[#06080D] shadow-2xl transition-all duration-300 flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 bg-[#06080D]/95 backdrop-blur-xl' : 'h-[380px] sm:h-[420px] w-full'
      }`}
    >
      {/* Top Cockpit Header Bar inside 3D Viewport */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300">
              INTERACTIVE 3D DASHBOARD
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300 backdrop-blur-md">
            <Orbit className="w-3 h-3 text-purple-400" />
            <span>44 3D Nodes</span>
          </div>
        </div>

        {/* Viewport Control Buttons */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={handleResetCamera}
            title="Reset Camera"
            className="p-1.5 rounded-xl bg-black/60 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors backdrop-blur-md cursor-pointer flex items-center space-x-1 text-[11px] px-2.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand 3D View'}
            className="p-1.5 rounded-xl bg-black/60 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors backdrop-blur-md cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3D Canvas Matrix */}
      <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Bottom Interactive Help & Watermark Matching Image 1 & 2 */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
          <div className="pointer-events-auto px-3 py-1 rounded-full bg-black/70 border border-white/10 text-[10px] font-mono text-zinc-400 backdrop-blur-md flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Click & drag inside 3D space to orbit</span>
          </div>

          <div className="pointer-events-auto flex items-center space-x-2">
            <div className="px-3 py-1 rounded-full bg-black/80 border border-purple-500/30 backdrop-blur-md flex items-center space-x-2 shadow-lg shadow-purple-500/10">
              <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 inline-block" />
              <span className="text-[10px] font-semibold text-white">Built with Spline</span>
              <span className="text-[9px] font-mono text-zinc-400 border-l border-white/20 pl-2">
                Scene: hKClAnWsIFEzj9Xp
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-500 border border-white/5 hidden sm:inline-block">
              Shinchan Hackathon 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
