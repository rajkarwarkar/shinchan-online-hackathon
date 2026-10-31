'use client';

import React from 'react';

export const CosmicAstronautGraphic: React.FC = () => {
  return (
    <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-b from-[#120826] via-[#090314] to-[#04010a] shadow-2xl flex items-center justify-center select-none group">
      
      {/* Background Starfield & Nebula */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent opacity-80" />
      <div className="absolute top-10 right-12 w-44 h-44 rounded-full bg-fuchsia-600/15 blur-3xl" />
      <div className="absolute bottom-8 left-10 w-52 h-52 rounded-full bg-purple-600/20 blur-3xl" />

      {/* High-Resolution Cosmic Astronaut & Ring Portal Vector */}
      <svg
        viewBox="0 0 700 550"
        className="w-full h-full object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ring portal neon gradient */}
          <linearGradient id="portalRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#c084fc" />
            <stop offset="70%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>

          <radialGradient id="portalCenterGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#3b0764" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0a0316" stopOpacity="0.9" />
          </radialGradient>

          <linearGradient id="terrainGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="40%" stopColor="#140628" />
            <stop offset="100%" stopColor="#04010a" />
          </linearGradient>

          <filter id="ringNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" result="blur1" />
            <feGaussianBlur stdDeviation="24" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Distant Moons & Orbiting Spheres */}
        <circle cx="530" cy="190" r="45" fill="#1e0b36" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="530" cy="190" r="45" fill="url(#terrainGrad)" opacity="0.8" />
        <ellipse cx="530" cy="190" rx="65" ry="12" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.3" transform="rotate(-25 530 190)" />

        {/* Small distant moon */}
        <circle cx="590" cy="270" r="14" fill="#3b0764" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.5" />

        {/* Stars */}
        <g opacity="0.7">
          <circle cx="100" cy="90" r="1.5" fill="#ffffff" />
          <circle cx="190" cy="60" r="2" fill="#c084fc" />
          <circle cx="380" cy="70" r="1" fill="#e9d5ff" />
          <circle cx="490" cy="110" r="1.5" fill="#ffffff" />
          <circle cx="620" cy="80" r="2" fill="#f0abfc" />
          <circle cx="70" cy="220" r="1" fill="#ffffff" />
          <circle cx="140" cy="300" r="1.5" fill="#c084fc" />
        </g>

        {/* THE GIANT GLOWING NEON PURPLE PORTAL RING */}
        {/* Portal Void Inside Ring */}
        <circle cx="340" cy="240" r="145" fill="url(#portalCenterGrad)" />
        
        {/* Ring Glow Outer */}
        <circle
          cx="340"
          cy="240"
          r="150"
          stroke="url(#portalRingGrad)"
          strokeWidth="6"
          filter="url(#ringNeonGlow)"
          opacity="0.9"
        />
        {/* Inner high-contrast bright core */}
        <circle
          cx="340"
          cy="240"
          r="150"
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.95"
        />

        {/* Secondary concentric orbital rings */}
        <circle
          cx="340"
          cy="240"
          r="170"
          stroke="#a855f7"
          strokeWidth="1"
          strokeDasharray="4 8"
          opacity="0.4"
        />

        {/* Celestial Horizon & Rugged Lunar Crags */}
        <path
          d="M 0 460 
             C 120 440, 210 450, 310 435 
             C 410 420, 520 435, 700 410 
             L 700 550 L 0 550 Z"
          fill="url(#terrainGrad)"
          stroke="#7e22ce"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <path
          d="M 0 480 
             C 150 470, 350 460, 500 480 
             C 580 490, 640 480, 700 470 
             L 700 550 L 0 550 Z"
          fill="#0a0214"
        />

        {/* Small rugged rocks */}
        <polygon points="120,455 135,445 150,458 138,462" fill="#3b0764" />
        <polygon points="460,440 475,432 490,444 478,448" fill="#4c1d95" />
        <polygon points="560,450 580,438 595,453 575,456" fill="#3b0764" />

        {/* ASTRONAUT SILHOUETTE (Standing firmly on rocky ledge gazing into the portal) */}
        <g transform="translate(325, 345) scale(0.95)">
          {/* Shadow beneath astronaut */}
          <ellipse cx="16" cy="112" rx="22" ry="6" fill="#000000" opacity="0.8" />
          
          {/* Suit Silhouette */}
          {/* Backpack / Life Support */}
          <rect x="-4" y="26" width="40" height="48" rx="6" fill="#1e0b36" stroke="#9333ea" strokeWidth="1" />
          
          {/* Helmet Dome */}
          <circle cx="16" cy="18" r="16" fill="#140628" stroke="#c084fc" strokeWidth="2" />
          {/* Visor with purple-white neon reflection */}
          <ellipse cx="16" cy="17" rx="11" ry="8" fill="#e9d5ff" opacity="0.9" />
          <ellipse cx="16" cy="17" rx="8" ry="6" fill="#7c3aed" opacity="0.6" />
          <path d="M 10 14 Q 16 12 21 15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

          {/* Torso */}
          <path
            d="M 4 34 L 28 34 L 26 70 L 6 70 Z"
            fill="#270e43"
            stroke="#9333ea"
            strokeWidth="1.5"
          />

          {/* Arms */}
          <path d="M 3 36 L -2 60 L 2 72" stroke="#3b0764" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 29 36 L 34 60 L 30 72" stroke="#3b0764" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Legs */}
          <path d="M 10 70 L 8 108" stroke="#1f0a38" strokeWidth="6" strokeLinecap="round" />
          <path d="M 22 70 L 24 108" stroke="#1f0a38" strokeWidth="6" strokeLinecap="round" />

          {/* Boots */}
          <rect x="3" y="105" width="10" height="7" rx="2" fill="#0d041a" stroke="#7e22ce" strokeWidth="1" />
          <rect x="20" y="105" width="10" height="7" rx="2" fill="#0d041a" stroke="#7e22ce" strokeWidth="1" />
        </g>
      </svg>

      {/* Subtle edge highlight */}
      <div className="absolute inset-0 rounded-3xl border border-purple-500/10 pointer-events-none" />
    </div>
  );
};
