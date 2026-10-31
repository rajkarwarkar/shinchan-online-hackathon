'use client';

import React from 'react';

interface DarkSpotOrbProps {
  size?: number;
  pulse?: boolean;
  className?: string;
}

export const DarkSpotOrb: React.FC<DarkSpotOrbProps> = ({
  size = 40,
  pulse = true,
  className = ''
}) => {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient violet glow */}
      <div
        className="absolute inset-0 rounded-full bg-violet-600/30 blur-md pointer-events-none"
        style={{ transform: 'scale(1.3)' }}
      />

      {/* Glossy Void Orb Body */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden border border-white/20 shadow-2xl"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #2A1747 0%, #0E071D 50%, #05030A 100%)'
        }}
      >
        {/* Amber Inner Dark-Spot Glow */}
        <div
          className={`absolute rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 blur-sm pointer-events-none opacity-80 ${
            pulse ? 'animate-pulse' : ''
          }`}
          style={{
            width: size * 0.45,
            height: size * 0.45,
            bottom: '18%',
            right: '20%',
            boxShadow: '0 0 16px #F59E0B'
          }}
        />

        {/* Liquid Chrome Top Specular Highlight */}
        <div
          className="absolute top-1 left-2 rounded-full bg-gradient-to-b from-white/90 to-transparent pointer-events-none"
          style={{
            width: size * 0.45,
            height: size * 0.22,
            transform: 'rotate(-25deg)',
            filter: 'blur(0.5px)'
          }}
        />

        {/* Chrome Rim Reflection */}
        <div
          className="absolute inset-0 rounded-full border pointer-events-none"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.25)',
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(139, 92, 246, 0.4)'
          }}
        />
      </div>
    </div>
  );
};
