'use client';

import React from 'react';
import { 
  Target, 
  Users, 
  Megaphone, 
  FileText, 
  Mail, 
  ArrowUpRight 
} from 'lucide-react';

interface CosmicServicesSectionProps {
  onSelectService?: (serviceName: string) => void;
}

export const CosmicServicesSection: React.FC<CosmicServicesSectionProps> = ({ onSelectService }) => {
  const services = [
    {
      title: 'SEO Optimization',
      desc: 'Rank higher & get found by the right audience.',
      icon: Target
    },
    {
      title: 'Social Media Marketing',
      desc: 'Build your brand & engage across all platforms.',
      icon: Users
    },
    {
      title: 'Paid Advertising',
      desc: 'Target the right audience & maximize ROI.',
      icon: Megaphone
    },
    {
      title: 'Content Marketing',
      desc: 'Powerful content that tells your brand story.',
      icon: FileText
    },
    {
      title: 'Email Marketing',
      desc: 'Nurture leads & convert them into customers.',
      icon: Mail
    }
  ];

  return (
    <section id="services" className="relative py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center space-y-2 mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          OUR SERVICES
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Solutions That Drive <span className="text-gradient-purple">Real Growth</span>
        </h2>
      </div>

      {/* 5-Card Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {services.map((srv, i) => {
          const Icon = srv.icon;
          return (
            <div
              key={i}
              onClick={() => onSelectService && onSelectService(srv.title)}
              className="cosmic-glass cosmic-glass-hover rounded-2xl p-5 border border-purple-500/20 flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:border-purple-400 transition-all">
                  <Icon className="w-5 h-5 text-purple-300" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="space-y-1.5 text-left">
                <h3 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
