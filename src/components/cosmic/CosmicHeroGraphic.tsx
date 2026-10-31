'use client';

import React from 'react';

export const CosmicHeroGraphic: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-square flex items-center justify-center select-none pointer-events-none">
      
      {/* Background Cosmic Radial Glows */}
      <div className="absolute w-[90%] h-[90%] rounded-full bg-gradient-to-tr from-purple-900/40 via-fuchsia-900/20 to-transparent blur-3xl -z-10" />
      <div className="absolute w-[65%] h-[65%] rounded-full bg-purple-600/25 blur-2xl -z-10" />

      {/* SVG Celestial Figure & Orb Representation */}
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full drop-shadow-[0_15px_40px_rgba(147,51,234,0.4)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#f0abfc" />
            <stop offset="55%" stopColor="#c084fc" />
            <stop offset="80%" stopColor="#7c3aed" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="faceVoid" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="50%" stopColor="#0f0728" />
            <stop offset="100%" stopColor="#030014" />
          </radialGradient>

          <linearGradient id="hoodFabric" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#3b0764" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#090314" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="hoodEdgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#381559" />
            <stop offset="50%" stopColor="#1a0b2e" />
            <stop offset="100%" stopColor="#0a0512" />
          </linearGradient>

          <filter id="purpleGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="16" result="blur1" />
            <feGaussianBlur stdDeviation="30" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient star dust particles */}
        <g opacity="0.6">
          <circle cx="120" cy="80" r="1.5" fill="#e9d5ff" className="star-twinkle" />
          <circle cx="480" cy="110" r="2" fill="#c084fc" className="star-twinkle" />
          <circle cx="520" cy="240" r="1.5" fill="#f0abfc" className="star-twinkle" />
          <circle cx="80" cy="260" r="2.5" fill="#d8b4fe" className="star-twinkle" />
          <circle cx="160" cy="420" r="1" fill="#ffffff" className="star-twinkle" />
          <circle cx="450" cy="460" r="2" fill="#c084fc" className="star-twinkle" />
          <circle cx="280" cy="60" r="1.5" fill="#ffffff" className="star-twinkle" />
        </g>

        {/* Mystic Hooded Silhouette (Outer Drape) */}
        <path
          d="M 300 45 
             C 210 50, 160 115, 145 220 
             C 130 330, 95 440, 75 560 
             C 190 550, 410 550, 525 560 
             C 505 440, 470 330, 455 220 
             C 440 115, 390 50, 300 45 Z"
          fill="url(#hoodFabric)"
          stroke="url(#hoodEdgeGlow)"
          strokeWidth="3.5"
        />

        {/* Inner Hood Cavity (Deep Cosmic Portal Face) */}
        <path
          d="M 300 85 
             C 240 90, 205 140, 200 220 
             C 195 295, 230 360, 300 375 
             C 370 360, 405 295, 400 220 
             C 395 140, 360 90, 300 85 Z"
          fill="url(#faceVoid)"
          stroke="#a855f7"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Nebula dust inside face hood */}
        <ellipse cx="300" cy="230" rx="75" ry="90" fill="#4c1d95" opacity="0.35" filter="url(#purpleGlowFilter)" />
        <ellipse cx="305" cy="215" rx="45" ry="55" fill="#7c3aed" opacity="0.4" filter="url(#purpleGlowFilter)" />

        {/* Swirling celestial energy lines in hood */}
        <path
          d="M 230 240 Q 300 170 370 240"
          stroke="#c084fc"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.4"
        />
        <path
          d="M 245 270 Q 300 210 355 270"
          stroke="#f0abfc"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Left Arm / Hand Reaching Inward */}
        <path
          d="M 120 450 
             C 170 410, 210 360, 245 320 
             C 255 310, 260 300, 255 290 
             C 250 280, 240 285, 230 295 
             C 200 330, 160 375, 110 430 Z"
          fill="url(#handGradient)"
          stroke="#9333ea"
          strokeWidth="2"
        />

        {/* Right Arm / Hand Reaching Inward */}
        <path
          d="M 480 450 
             C 430 410, 390 360, 355 320 
             C 345 310, 340 300, 345 290 
             C 350 280, 360 285, 370 295 
             C 400 330, 440 375, 490 430 Z"
          fill="url(#handGradient)"
          stroke="#9333ea"
          strokeWidth="2"
        />

        {/* Curved Cupped Fingers Silhouette */}
        {/* Left Fingers */}
        <path d="M 248 300 C 265 285, 275 270, 280 250" stroke="#c084fc" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 242 315 C 262 300, 272 285, 278 268" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
        <path d="M 235 330 C 255 315, 268 300, 272 285" stroke="#7e22ce" strokeWidth="3.5" strokeLinecap="round" />

        {/* Right Fingers */}
        <path d="M 352 300 C 335 285, 325 270, 320 250" stroke="#c084fc" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 358 315 C 338 300, 328 285, 322 268" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
        <path d="M 365 330 C 345 315, 332 300, 328 285" stroke="#7e22ce" strokeWidth="3.5" strokeLinecap="round" />

        {/* THE GLOWING CELESTIAL ORB */}
        <circle cx="300" cy="245" r="70" fill="url(#orbGlow)" filter="url(#purpleGlowFilter)" opacity="0.6" />
        <circle cx="300" cy="245" r="48" fill="url(#orbGlow)" filter="url(#purpleGlowFilter)" opacity="0.8" />
        <circle cx="300" cy="245" r="32" fill="#ffffff" opacity="0.95" />
        <circle cx="296" cy="240" r="16" fill="#ffffff" />

        {/* Galactic Lightning / Arc Flares around the Orb */}
        <path
          d="M 285 220 Q 295 235 300 245 T 325 255"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#purpleGlowFilter)"
        />
        <path
          d="M 315 225 Q 305 240 300 245 T 275 260"
          stroke="#f5d0fe"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Outer Halo Rings */}
        <circle
          cx="300"
          cy="245"
          r="82"
          stroke="#e9d5ff"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.75"
        />
        <circle
          cx="300"
          cy="245"
          r="105"
          stroke="#c084fc"
          strokeWidth="1"
          strokeDasharray="2 12"
          opacity="0.45"
        />
      </svg>

      {/* Floating Sparkles & Light Beams */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-fuchsia-500/25 rounded-full blur-2xl animate-pulse [animation-delay:1.5s]" />
    </div>
  );
};
