'use client';

import React from 'react';

// 1. Luxury Fashion Visual (Perfume Bottle with Violet Backlighting)
export const LuxuryFashionGraphic: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[220px] bg-gradient-to-b from-[#180a2e] via-[#0d041c] to-[#05010a] flex items-center justify-center overflow-hidden">
      <div className="absolute w-32 h-32 rounded-full bg-purple-500/30 blur-2xl" />
      <svg viewBox="0 0 300 240" className="w-full h-48 drop-shadow-[0_10px_20px_rgba(168,85,247,0.4)]" fill="none">
        <defs>
          <linearGradient id="perfumeGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#7e22ce" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#6b21a8" />
          </linearGradient>
        </defs>
        {/* Cap */}
        <rect x="135" y="45" width="30" height="25" rx="3" fill="url(#goldCap)" stroke="#e9d5ff" strokeWidth="1" />
        <rect x="142" y="70" width="16" height="8" fill="#a855f7" />
        {/* Bottle Body */}
        <rect x="110" y="78" width="80" height="110" rx="14" fill="url(#perfumeGlass)" stroke="#c084fc" strokeWidth="1.5" />
        {/* Inner Liquid Level */}
        <rect x="115" y="105" width="70" height="78" rx="10" fill="#581c87" opacity="0.8" />
        {/* Glass Reflection Highlight */}
        <line x1="120" y1="88" x2="120" y2="175" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* Bottle Label */}
        <rect x="125" y="120" width="50" height="35" rx="4" fill="#090314" stroke="#e9d5ff" strokeWidth="0.8" />
        <line x1="133" y1="133" x2="167" y2="133" stroke="#e9d5ff" strokeWidth="1" />
        <line x1="138" y1="140" x2="162" y2="140" stroke="#c084fc" strokeWidth="0.8" />
        {/* Ground Reflection */}
        <ellipse cx="150" cy="195" rx="55" ry="8" fill="#000000" opacity="0.7" />
      </svg>
    </div>
  );
};

// 2. Tech Innovation Visual (Cyberpunk Visor / AI Astronaut)
export const TechInnovationGraphic: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[220px] bg-gradient-to-b from-[#140628] via-[#090216] to-[#04010a] flex items-center justify-center overflow-hidden">
      <div className="absolute w-36 h-36 rounded-full bg-violet-600/25 blur-2xl" />
      <svg viewBox="0 0 300 240" className="w-full h-48 drop-shadow-[0_10px_25px_rgba(139,92,246,0.5)]" fill="none">
        <defs>
          <linearGradient id="cyberHelmet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b0764" />
            <stop offset="70%" stopColor="#1e0b36" />
            <stop offset="100%" stopColor="#090314" />
          </linearGradient>
          <linearGradient id="visorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="30%" stopColor="#c084fc" />
            <stop offset="70%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
        </defs>
        {/* Head Contour */}
        <path d="M 100 130 C 95 60, 205 60, 200 130 C 198 160, 185 190, 150 195 C 115 190, 102 160, 100 130 Z" fill="url(#cyberHelmet)" stroke="#9333ea" strokeWidth="2" />
        {/* Futuristic Visor Shield */}
        <path d="M 112 110 C 115 90, 185 90, 188 110 C 185 140, 115 140, 112 110 Z" fill="url(#visorGlow)" stroke="#ffffff" strokeWidth="1.5" />
        {/* HUD Data Grid Overlay */}
        <line x1="122" y1="108" x2="178" y2="108" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
        <line x1="128" y1="116" x2="172" y2="116" stroke="#c084fc" strokeWidth="1" opacity="0.6" />
        {/* Audio / Comm Earplates */}
        <circle cx="98" cy="125" r="10" fill="#2e1065" stroke="#a855f7" strokeWidth="1.5" />
        <circle cx="202" cy="125" r="10" fill="#2e1065" stroke="#a855f7" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

// 3. Travel The World Visual (Purple Starlit Mountains)
export const TravelWorldGraphic: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[220px] bg-gradient-to-b from-[#180a32] via-[#0d041e] to-[#04010a] flex items-center justify-center overflow-hidden">
      <div className="absolute top-2 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl" />
      <svg viewBox="0 0 300 240" className="w-full h-48" fill="none">
        <defs>
          <linearGradient id="mountGrad1" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="60%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#1e0b36" />
          </linearGradient>
          <linearGradient id="mountGrad2" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#7e22ce" />
            <stop offset="80%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#090216" />
          </linearGradient>
        </defs>
        {/* Stars */}
        <circle cx="40" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="90" cy="25" r="1.2" fill="#c084fc" />
        <circle cx="210" cy="35" r="1.5" fill="#ffffff" />
        <circle cx="260" cy="55" r="1.2" fill="#e9d5ff" />
        {/* Distant Ridge */}
        <polygon points="20,170 110,90 190,170" fill="url(#mountGrad1)" opacity="0.6" />
        {/* Main Mountain Peaks */}
        <polygon points="70,190 170,75 270,190" fill="url(#mountGrad2)" stroke="#a855f7" strokeWidth="1" />
        <polygon points="170,75 200,120 170,135 145,115" fill="#ffffff" opacity="0.85" />
        {/* Foreground Foothills */}
        <path d="M 0 185 Q 80 160 160 180 T 300 175 L 300 240 L 0 240 Z" fill="#0c0418" />
      </svg>
    </div>
  );
};

// 4. CTA Banner Graphic (Astronaut at Cosmic Ring Portal)
export const CosmicCTABannerGraphic: React.FC = () => {
  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-purple-600/30 blur-xl animate-pulse" />
      <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="ctaRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        {/* Portal Ring */}
        <circle cx="80" cy="80" r="55" stroke="url(#ctaRing)" strokeWidth="4" />
        <circle cx="80" cy="80" r="55" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
        <circle cx="80" cy="80" r="62" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
        {/* Small Astronaut Silhouette */}
        <g transform="translate(73, 56) scale(0.65)">
          <circle cx="10" cy="10" r="8" fill="#090314" stroke="#c084fc" strokeWidth="1.5" />
          <rect x="2" y="18" width="16" height="22" rx="3" fill="#090314" stroke="#7e22ce" strokeWidth="1.5" />
          <line x1="6" y1="40" x2="6" y2="52" stroke="#090314" strokeWidth="4" strokeLinecap="round" />
          <line x1="14" y1="40" x2="14" y2="52" stroke="#090314" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

