'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Check 
} from 'lucide-react';

interface CosmicFooterProps {
  onNavClick?: (target: string) => void;
}

export const CosmicFooter: React.FC<CosmicFooterProps> = ({ onNavClick }) => {
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

  return (
    <footer id="footer" className="relative border-t border-purple-500/15 pt-14 pb-8 bg-[#040108]/90 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="flex items-center tracking-tighter">
                <span className="text-2xl font-black text-white">A</span>
                <span className="text-2xl font-black text-purple-400">Z</span>
              </div>
              <div className="flex flex-col -space-y-0.5">
                <span className="text-[11px] font-semibold tracking-wide text-zinc-300">
                  Digital Marketing
                </span>
                <span className="text-[9px] text-zinc-500 font-mono tracking-wider">
                  Solutions
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Helping businesses grow with innovative marketing strategies that deliver measurable results.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-1">
              {/* Facebook */}
              <a href="#facebook" title="Facebook" className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-400 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#instagram" title="Instagram" className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-400 transition-colors">
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#linkedin" title="LinkedIn" className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-400 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.13a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="#twitter" title="Twitter" className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-400 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {['Home', 'About Us', 'Services', 'Case Studies', 'Blog', 'Contact'].map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => onNavClick && onNavClick(link)}
                    className="hover:text-purple-300 transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'SEO Optimization',
                'Social Media Marketing',
                'Paid Advertising',
                'Content Marketing',
                'Email Marketing'
              ].map((srv, i) => (
                <li key={i}>
                  <button
                    onClick={() => onNavClick && onNavClick(srv)}
                    className="hover:text-purple-300 transition-colors text-left"
                  >
                    {srv}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="hover:text-purple-300 transition-colors cursor-pointer">
                  info@azdigitalsolutions.com
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Let's Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Let&apos;s Connect
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Subscribe to get the latest marketing tips & insights.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                ✓ Thank you for subscribing!
              </span>
            )}
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-purple-500/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
          <p>© 2024 AZ Digital Marketing Solutions. All Rights Reserved.</p>
          <p className="text-zinc-600">
            Engineered with DarkSpot AI Gap & Contradiction Intelligence for Shinchan Hackathon 2026
          </p>
        </div>

      </div>
    </footer>
  );
};
