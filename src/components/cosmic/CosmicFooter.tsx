'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  ArrowRight, 
  Check, 
  Radar, 
  ShieldCheck 
} from 'lucide-react';

interface CosmicFooterProps {
  onNavClick?: (target: string) => void;
  onOpenHowItWorks?: () => void;
}

export const CosmicFooter: React.FC<CosmicFooterProps> = ({ onNavClick, onOpenHowItWorks }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative border-t border-purple-500/15 pt-14 pb-8 bg-[#040108]/90 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Radar className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col -space-y-0.5">
                <div className="flex items-center space-x-1">
                  <span className="text-base font-black text-white">
                    Dark<span className="text-purple-400">Spot</span>
                  </span>
                  <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    AI
                  </span>
                </div>
                <span className="text-[9px] text-zinc-400 font-mono tracking-wider">
                  Gap & Contradiction Radar
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Shinchan Online Hackathon 2026. Empowering high-stakes decision makers with automated policy cross-examination, gap detection, and verification checklists.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-1">
              <a href="#github" title="Repository" className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-400 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="#twitter" title="Twitter" className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-400 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#linkedin" title="LinkedIn" className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-400 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.13a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-purple-300 transition-colors text-left">
                  Home (Top)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className="hover:text-purple-300 transition-colors text-left">
                  About Architecture
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('capabilities')} className="hover:text-purple-300 transition-colors text-left">
                  Core Engines
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('benchmarks')} className="hover:text-purple-300 transition-colors text-left">
                  Hackathon Benchmarks
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('radar')} className="hover:text-purple-300 transition-colors text-left font-semibold text-purple-300">
                  Live Radar Matrix
                </button>
              </li>
              <li>
                <button onClick={onOpenHowItWorks} className="hover:text-purple-300 transition-colors text-left">
                  10-Mark Rubric Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Audit Capabilities
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'Information Gap Detection',
                'Contradiction Radar',
                'Temporal Freshness Sentinel',
                'Traceable Evidence Quotes',
                'Automated Verification Tasks'
              ].map((srv, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      if (onNavClick) onNavClick(srv);
                      scrollTo('radar');
                    }}
                    className="hover:text-purple-300 transition-colors text-left"
                  >
                    {srv}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Hackathon Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Hackathon Registry
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-zinc-300 font-semibold">Shinchan Hackathon 2026</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="hover:text-purple-300 transition-colors cursor-pointer">
                  team@darkspot.ai
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Track 1: AI Knowledge Truth & Gaps</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Stay Updated */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Audit Alerts
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Subscribe for real-time alerts when source policies or grant rules change.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email for alerts"
                className="w-full text-xs py-2.5 pl-3 pr-10 rounded-full bg-[#120826] border border-purple-500/25 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
                required
              />
              <button
                type="submit"
                className="absolute right-1 w-8 h-8 rounded-full btn-cosmic-purple flex items-center justify-center text-white"
              >
                {subscribed ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
            {subscribed && (
              <span className="text-[10px] text-emerald-400 block">
                ✓ Registered for source audit alerts!
              </span>
            )}
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-purple-500/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
          <p>© 2026 DarkSpot AI Intelligence Platform. All Rights Reserved.</p>
          <p className="text-purple-300/80 font-mono">
            Scored directly against Official Shinchan Hackathon 10-Mark Rubric
          </p>
        </div>

      </div>
    </footer>
  );
};
