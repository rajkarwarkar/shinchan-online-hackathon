'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollStore } from './scrollStore';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollProviderProps {
  children: React.ReactNode;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = mediaQuery.matches;
    const isMobile = window.innerWidth < 768;

    scrollStore.setPreferences(isReducedMotion, isMobile);

    if (isReducedMotion) {
      // If reduced motion is preferred, use native scrolling and listen to window scroll
      const handleNativeScroll = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? window.scrollY / total : 0;
        scrollStore.setProgress(progress);
      };
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleNativeScroll);
      };
    }

    // Initialize Lenis for buttery-smooth 60fps scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', (e: { progress: number; scroll: number }) => {
      ScrollTrigger.update();
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? e.scroll / total : 0;
      scrollStore.setProgress(progress);
    });

    // GSAP Ticker handles Lenis RAF
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Track mouse coordinates for 3D parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      scrollStore.setMouse(x, y);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      delete (window as any).__lenis;
      lenisRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div className="relative w-full">{children}</div>;
};
