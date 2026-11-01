'use client';

import React, { useEffect, useState } from 'react';
import { scrollStore, ScrollState } from './scrollStore';

const CHAPTERS = [
  { id: 'chapter-hero', label: '01 · HERO' },
  { id: 'chapter-problem', label: '02 · THE PROBLEM' },
  { id: 'chapter-light', label: '03 · THE LIGHT' },
  { id: 'chapter-evidence', label: '04 · EVIDENCE' },
  { id: 'chapter-output', label: '05 · THE OUTPUT' },
  { id: 'chapter-cta', label: '06 · AUDIT START' },
];

export const HUDProgressDots: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return scrollStore.subscribe((state: ScrollState) => {
      setActiveChapter(state.activeChapter);
      setProgress(state.progress);
    });
  }, []);

  const scrollToChapter = (index: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (index / 5) * totalHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Top Hairline Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-white/[0.04] z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-amber-400 transition-all duration-75"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* Left Vertical Section Dots (HUD Motif) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-start space-y-4 pointer-events-auto">
        <div className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase -rotate-90 origin-left mb-6 ml-2 select-none">
          CHRONO.MAP
        </div>

        {CHAPTERS.map((ch, idx) => {
          const isActive = activeChapter === idx;
          return (
            <button
              key={ch.id}
              onClick={() => scrollToChapter(idx)}
              className="group flex items-center space-x-3 cursor-pointer py-1"
              title={`Jump to ${ch.label}`}
            >
              <div
                className={`w-1.5 transition-all duration-300 rounded-full ${
                  isActive
                    ? 'h-6 bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]'
                    : 'h-1.5 bg-white/20 group-hover:bg-white/50 group-hover:h-3'
                }`}
              />
              <span
                className={`font-mono text-[9px] tracking-widest uppercase transition-all duration-200 select-none ${
                  isActive
                    ? 'text-violet-300 font-bold opacity-100 translate-x-1'
                    : 'text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-zinc-300'
                }`}
              >
                {ch.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};
