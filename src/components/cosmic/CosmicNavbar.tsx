'use client';

import React from 'react';
import { ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';

interface CosmicNavbarProps {
  activeView: 'showcase' | 'dashboard';
  onViewChange: (view: 'showcase' | 'dashboard') => void;
  onOpenHowItWorks?: () => void;
  onSelectScenario?: (id: string) => void;
}

export const CosmicNavbar: React.FC<CosmicNavbarProps> = ({
  activeView,
  onViewChange,
  onOpenHowItWorks
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-md bg-[#050508]/75 border-b border-purple-500/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo AZ */}
        <div 
          onClick={() => onViewChange('showcase')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="flex items-center tracking-tighter">
            <span className="text-2xl font-black text-white group-hover:text-purple-200 transition-colors">A</span>
            <span className="text-2xl font-black text-purple-400 group-hover:text-purple-300 transition-colors">Z</span>
          </div>
          <div className="flex flex-col -space-y-0.5">
            <span className="text-[11px] font-semibold tracking-wide text-zinc-300 group-hover:text-white">
              Digital Marketing
            </span>
            <span className="text-[9px] text-zinc-500 font-mono tracking-wider">
              Solutions
            </span>
          </div>
        </div>

        {/* Center: Sleek Navbar Pill Menu */}
        <nav className="hidden md:flex items-center p-1 rounded-full bg-[#120826]/80 border border-purple-500/20 shadow-inner">
          <button
            onClick={() => {
              onViewChange('showcase');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeView === 'showcase'
                ? 'bg-purple-600/30 text-white border border-purple-400/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Home
          </button>
          
          <a
            href="#about"
            onClick={() => onViewChange('showcase')}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            About Us
          </a>

          <a
            href="#services"
            onClick={() => onViewChange('showcase')}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Services
          </a>

          <a
            href="#case-studies"
            onClick={() => onViewChange('showcase')}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Case Studies
          </a>

          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeView === 'dashboard'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                : 'text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-300 animate-pulse" />
            <span>AI Dashboard</span>
          </button>

          <a
            href="#footer"
            onClick={() => onViewChange('showcase')}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Toggle for Hackathon Mode */}
          <button
            onClick={() => onViewChange(activeView === 'showcase' ? 'dashboard' : 'showcase')}
            title="Toggle Dashboard View"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-500/30 bg-purple-950/40 text-purple-200 hover:bg-purple-900/50 transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
            <span>{activeView === 'showcase' ? 'Open Dashboard' : 'View Showcase'}</span>
          </button>

          {/* Let's Talk Button from image */}
          <button
            onClick={() => {
              if (activeView !== 'dashboard') {
                onViewChange('dashboard');
              } else if (onOpenHowItWorks) {
                onOpenHowItWorks();
              }
            }}
            className="px-4 py-2 rounded-full text-xs font-semibold text-white btn-cosmic-purple flex items-center space-x-1.5"
          >
            <span>Let&apos;s Talk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};

