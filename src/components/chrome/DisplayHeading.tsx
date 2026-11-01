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
      {/* Eyebrow line */}
      <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-violet-300 uppercase">
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
        <span>EVIDENCE-LOCKED INTELLIGENCE · DIGITAL FUTURES</span>
      </div>

      {/* 3-Line Display Headline - Balanced Human Scale */}
      <div className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] select-none">
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

      {/* Human Editorial Subcopy */}
      {subtitle && (
        <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed pt-3 font-sans font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};

