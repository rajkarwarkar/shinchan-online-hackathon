'use client';

import React from 'react';

interface DisplayHeadingProps {
  line1?: string;
  line2?: string;
  line3?: string;
  subtitle?: string;
  className?: string;
}

export const DisplayHeading: React.FC<DisplayHeadingProps> = ({
  line1 = 'FIND WHAT',
  line2 = 'SEARCH',
  line3 = 'MISSES',
  subtitle = 'Cross-check sources, expose gaps and conflicts, get a verified checklist.',
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Eyebrow HUD line matching reference image */}
      <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.2em] text-violet-300 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        <span>EVIDENCE-LOCKED INTELLIGENCE · DIGITAL FUTURES</span>
      </div>

      {/* Huge 3-Line Display Headline */}
      <div className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] select-none">
        {/* Line 1: Solid White */}
        <div className="headline-white block">
          {line1}
        </div>

        {/* Line 2: Violet Gradient */}
        <div className="headline-violet block">
          {line2}
        </div>

        {/* Line 3: Liquid Chrome Outline */}
        <div className="headline-chrome block">
          {line3}
        </div>
      </div>

      {/* Two-line mono subcopy specified in prompt */}
      {subtitle && (
        <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-xl leading-relaxed pt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
