'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useDarkSpotStore } from '@/store/useDarkSpotStore';

export const IntroGate: React.FC = () => {
  const router = useRouter();
  const { setCurrentView, loadSampleMode } = useDarkSpotStore();

  // State
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normX: 0, normY: 0 });
  const [isTouch, setIsTouch] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasInteractedRef = useRef(false);

  // Auto-skip or session check
  useEffect(() => {
    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(prefersReduced);

    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

    // Auto-skip when query has ?skip=1
    if (params?.get('skip') === '1') {
      setCurrentView('dashboard');
      loadSampleMode();
      router.replace('/home?view=dashboard');
      return;
    }

    // Check sessionStorage intro_seen (unless ?replay=1)
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('intro_seen');
      if (seen && params?.get('replay') !== '1') {
        setCurrentView('dashboard');
        loadSampleMode();
        router.replace('/home?view=dashboard');
        return;
      }
    }

    // Preload /home?view=dashboard
    router.prefetch('/home?view=dashboard');
    router.prefetch('/home');

    // Default center mouse pos
    setMousePos({
      x: window.innerWidth * 0.65,
      y: window.innerHeight * 0.45,
      normX: 0,
      normY: 0,
    });
  }, [router, setCurrentView, loadSampleMode]);

  // Loading Counter Animation (min 1.8s, max 2.6s)
  useEffect(() => {
    if (isReducedMotion) {
      setProgress(100);
      setIsReady(true);
      return;
    }

    const startTime = performance.now();
    const duration = 2200; // 2.2 seconds

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const currentProg = Math.round(eased * 100);
      setProgress(currentProg);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(updateCounter);
      } else {
        setProgress(100);
        setIsReady(true);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateCounter);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isReducedMotion]);

  // Auto-focus ENTER button when ready
  useEffect(() => {
    if (isReady && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isReady]);

  // Mouse & Touch Tracking with Ambient Spotlight Animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      hasInteractedRef.current = true;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({
        x: e.clientX,
        y: e.clientY,
        normX,
        normY,
      });
    };

    const handleTouch = (e: TouchEvent) => {
      setIsTouch(true);
      if (e.touches[0]) {
        hasInteractedRef.current = true;
        const t = e.touches[0];
        const normX = (t.clientX / window.innerWidth) * 2 - 1;
        const normY = (t.clientY / window.innerHeight) * 2 - 1;
        setMousePos({
          x: t.clientX,
          y: t.clientY,
          normX,
          normY,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });

    // Idle auto-animate spotlight gently if no mouse movement
    let idleAnimId: number;
    let idleTime = 0;
    const idleLoop = () => {
      idleTime += 0.015;
      if (!hasInteractedRef.current || isTouch) {
        const cx = window.innerWidth * 0.6 + Math.sin(idleTime) * 120;
        const cy = window.innerHeight * 0.45 + Math.cos(idleTime * 0.8) * 80;
        const normX = (cx / window.innerWidth) * 2 - 1;
        const normY = (cy / window.innerHeight) * 2 - 1;
        setMousePos({ x: cx, y: cy, normX, normY });
      }
      idleAnimId = requestAnimationFrame(idleLoop);
    };
    idleAnimId = requestAnimationFrame(idleLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouch);
      cancelAnimationFrame(idleAnimId);
    };
  }, [isTouch]);

  // Slow, cinematic portal transition from welcome page to dashboard
  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('intro_seen', 'true');
    }

    // Set store view to dashboard and load sample report for instant preview
    loadSampleMode();
    setCurrentView('dashboard');

    // Smooth slow transition: 1.6s delay before router push
    setTimeout(() => {
      router.push('/home?view=dashboard');
    }, 1600);
  }, [isExiting, router, setCurrentView, loadSampleMode]);

  // Handle immediate skip
  const handleSkip = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('intro_seen', 'true');
    }
    loadSampleMode();
    setCurrentView('dashboard');
    router.push('/home?view=dashboard');
  }, [router, setCurrentView, loadSampleMode]);

  // Keyboard navigation: Enter / Space triggers enter when ready, Esc skips
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      } else if ((e.key === 'Enter' || e.key === ' ') && isReady) {
        e.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, handleEnter, handleSkip]);

  // Spotlight math: as counter passes 60%, spotlight expands to full lighting
  const expansionT = Math.max(0, Math.min(1, (progress - 60) / 40));
  const spotlightRadius = isReducedMotion ? 2600 : Math.round(340 + expansionT * 2200);
  const ambientDarkness = isReducedMotion ? 0 : (0.85 * (1 - expansionT)).toFixed(3);

  // 3D Tilt calculation
  const tiltX = isReducedMotion ? 0 : -mousePos.normY * 9;
  const tiltY = isReducedMotion ? 0 : mousePos.normX * 10;
  const parallaxX = isReducedMotion ? 0 : -mousePos.normX * 24;
  const parallaxY = isReducedMotion ? 0 : -mousePos.normY * 20;

  // Staggered 42 dust particles
  const particles = useRef(
    Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      left: `${(i * 19.3) % 100}%`,
      top: `${(i * 27.7) % 100}%`,
      size: (i % 3) + 1.5,
      delay: (i % 7) * 0.4,
      duration: 3 + (i % 4),
      opacity: 0.2 + (i % 5) * 0.15,
    }))
  ).current;

  // 8 four-point star glints
  const glints = [
    { top: '18%', left: '52%', delay: 0.2 },
    { top: '32%', left: '88%', delay: 1.1 },
    { top: '65%', left: '46%', delay: 0.7 },
    { top: '78%', left: '78%', delay: 1.5 },
    { top: '22%', left: '72%', delay: 1.8 },
    { top: '48%', left: '38%', delay: 0.4 },
    { top: '70%', left: '92%', delay: 2.2 },
    { top: '12%', left: '35%', delay: 0.9 },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05030A] select-none text-[#F5F3FF]">
      {/* 1. Signature Flashlight Mask Layer */}
      {!isReducedMotion && (
        <div
          className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, transparent 0px, transparent ${spotlightRadius * 0.35}px, rgba(5, 3, 10, ${ambientDarkness}) ${spotlightRadius}px)`,
          }}
        />
      )}

      {/* 2. Thin Rounded Frame Inset 12px with "+" Corners & HUD Labels */}
      <motion.div
        animate={isExiting ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative w-full h-full p-2.5 sm:p-3 pointer-events-none z-40 flex flex-col justify-between"
      >
        <div className="relative w-full h-full rounded-[28px] sm:rounded-[36px] border border-white/[0.08] pointer-events-none flex flex-col justify-between p-4 sm:p-6">
          {/* Top Left: Wordmark & Role */}
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-300">
            <span className="text-white font-bold text-base">+</span>
            <div className="flex items-center space-x-2 pl-1">
              <span className="font-bold text-violet-300 uppercase tracking-wider">
                DARK SPOT®
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400 hidden sm:inline uppercase tracking-wide text-xs">
                INFORMATION GAP SENTINEL
              </span>
            </div>
          </div>

          {/* Top Right: Hackathon Header */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center space-x-2 text-xs font-mono text-zinc-300">
            <span className="text-violet-400 text-sm animate-pulse">✦</span>
            <span className="text-zinc-400 uppercase tracking-wider text-xs">
              SHINCHAN HACKATHON 2026
            </span>
            <span className="text-white font-bold text-base">+</span>
          </div>

          {/* Bottom Left + */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <span className="text-white font-bold text-base">+</span>
            <span className="text-amber-400 text-sm">✦</span>
          </div>

          {/* Bottom Right: Version Tag */}
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <span className="tracking-wider uppercase text-xs">
              v1.0 · EVIDENCE-LOCKED
            </span>
            <span className="text-white font-bold text-base">+</span>
          </div>
        </div>
      </motion.div>

      {/* 3. Floating Sparkles & Dust Particles Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        style={{
          transform: `translate3d(${parallaxX * 0.7}px, ${parallaxY * 0.7}px, 0)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Floating particles */}
        {!isReducedMotion &&
          particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-violet-300 pointer-events-none animate-pulse"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

        {/* 8 Four-point star glints */}
        {glints.map((g, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={
              isReducedMotion
                ? { opacity: 0.7 }
                : { opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: g.delay,
              ease: 'easeInOut',
            }}
            className="absolute text-violet-300 text-xs sm:text-sm font-mono pointer-events-none drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]"
            style={{ top: g.top, left: g.left }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      {/* 4. Main Viewport Grid (Left: Display Heading, Right: 3D Orb) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto pointer-events-none">
        {/* Top spacer */}
        <div className="h-6" />

        {/* Center Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1 my-auto">
          {/* Left Column: Eyebrow + Staggered Mask-Wipe Headline */}
          <motion.div
            animate={isExiting ? { opacity: 0, x: -40 } : { opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6 pointer-events-auto"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-semibold tracking-wider uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span>WELCOME TO</span>
            </motion.div>

            {/* 3-Line Display Heading with Staggered Mask-Wipe */}
            <div className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.92] select-none">
              {/* Line 1: DIGITAL (Solid White) */}
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="headline-white block"
                >
                  DIGITAL
                </motion.div>
              </div>

              {/* Line 2: DARK (Violet Gradient) */}
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                  className="headline-violet block"
                >
                  DARK
                </motion.div>
              </div>

              {/* Line 3: SPOT (Chrome Outline) */}
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
                  className="headline-chrome block"
                >
                  SPOT
                </motion.div>
              </div>
            </div>

            {/* Human Editorial Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base sm:text-lg text-zinc-300 max-w-lg leading-relaxed pt-3 font-sans font-normal"
            >
              Find what search misses. AI-assisted information gap detection platform.
            </motion.p>
          </motion.div>

          {/* Right Column: 3D Tilt Hero Orb with Ambient Violet Underglow */}
          <div className="lg:col-span-6 relative flex items-center justify-center pointer-events-auto">
            {/* Ambient Violet Glow */}
            <div className="absolute w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] rounded-full bg-violet-600/30 blur-[110px] pointer-events-none -z-10" />

            {/* 3D Tilt Wrapper */}
            <motion.div
              style={{
                perspective: 1200,
                rotateX: tiltX,
                rotateY: tiltY,
              }}
              animate={
                isExiting
                  ? {
                      scale: [1, 1.08, 4.6],
                      rotate: [0, -2, 6],
                      filter: [
                        'brightness(1) contrast(1)',
                        'brightness(1.5) contrast(1.2)',
                        'brightness(2.4) contrast(1.4)',
                      ],
                      opacity: [1, 0.95, 0],
                    }
                  : isReducedMotion
                  ? { scale: 1 }
                  : {
                      y: [-12, 12, -12],
                      scale: 1,
                    }
              }
              transition={
                isExiting
                  ? { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 6, ease: 'easeInOut', repeat: Infinity }
              }
              className="relative w-full max-w-[540px] sm:max-w-[640px] lg:max-w-[700px] aspect-[1024/852] flex items-center justify-center cursor-pointer"
              onClick={isReady ? handleEnter : undefined}
            >
              {!imageError ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/art/hero-orb.png"
                    alt="Chrome sphere with an amber core surrounded by floating document panels"
                    width={1024}
                    height={852}
                    priority
                    unoptimized
                    onError={() => setImageError(true)}
                    className="w-full h-auto object-contain select-none pointer-events-none"
                  />
                </div>
              ) : (
                /* CSS 3D Chrome Sphere Fallback */
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center p-4">
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.5)] border border-white/20 bg-gradient-to-tr from-[#05030A] via-[#2E1065] to-[#D8B4FE]">
                    <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 blur-md opacity-90 animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_35px_#F59E0B]" />
                    <div className="absolute top-2 left-6 w-36 h-18 rounded-full bg-gradient-to-b from-white/90 to-transparent -rotate-12 blur-[1px]" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom Controls Row: Status Dock / Morphing ENTER Button & Bottom Center Hint */}
        <motion.div
          animate={isExiting ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="pt-6 sm:pt-10 flex flex-wrap items-center justify-between gap-4 pointer-events-auto"
        >
          {/* Bottom Left: Status Dock / Morphing ENTER Button */}
          <div className="flex items-center space-x-4">
            <AnimatePresence mode="wait">
              {!isReady ? (
                /* Loading State: Calibrating Evidence Engine + Counter */
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="noir-panel-violet rounded-2xl p-4 sm:p-4.5 min-w-[280px] sm:min-w-[320px] flex items-center justify-between gap-4 border border-violet-500/30 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold tracking-wider text-violet-300 uppercase">
                      <span>CALIBRATING ENGINE</span>
                      <span className="font-bold text-white text-sm">{progress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-amber-400 transition-all duration-75"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="text-xs text-zinc-400 font-sans">
                      Preloading models & verified sources
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
                  </div>
                </motion.div>
              ) : (
                /* Ready State: Primary ENTER Button */
                <motion.button
                  key="enter-button"
                  ref={buttonRef}
                  onClick={handleEnter}
                  disabled={isExiting}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden px-8 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-500 hover:from-violet-500 hover:to-purple-500 text-white font-mono text-sm sm:text-base font-bold tracking-wider uppercase transition-all shadow-[0_0_40px_rgba(139,92,246,0.6)] flex items-center space-x-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 border border-violet-300/40"
                >
                  {/* Chrome Sheen Sweep */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                  <span>ENTER DASHBOARD</span>
                  <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Secondary Skip Intro Link */}
            <button
              onClick={handleSkip}
              className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer underline underline-offset-4 px-2 py-1"
            >
              SKIP INTRO
            </button>
          </div>

          {/* Bottom Center Hint */}
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-zinc-400 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>PRESS ENTER OR CLICK TO BEGIN</span>
          </div>
        </motion.div>
      </div>

      {/* 5. Fullscreen Cinematic Violet Portal Warp Slow Transition on Exit */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0.7, 1] }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-gradient-to-b from-[#05030A] via-purple-950/40 to-[#05030A] backdrop-blur-xl"
          >
            {/* Center Violet Portal Warp Aura */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.4, 2.8], opacity: [0, 0.8, 1] }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-violet-600/50 via-purple-400/40 to-amber-300/30 blur-3xl pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
