'use client';

import React from 'react';
import { ScrollProvider } from '@/components/scrollytelling/ScrollProvider';
import { ScrollyCanvas } from '@/components/scrollytelling/ScrollyCanvas';
import { HUDProgressDots } from '@/components/scrollytelling/HUDProgressDots';
import { ChaptersDOM } from '@/components/scrollytelling/ChaptersDOM';

interface LandingViewProps {
  onStartAnalysis: () => void;
  onExploreReport: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartAnalysis,
  onExploreReport,
}) => {
  return (
    <ScrollProvider>
      {/* Persistent Fixed Full-Viewport 3D Canvas (z-0, pointer-events none) */}
      <ScrollyCanvas />

      {/* Left HUD Chapter Progress Dots & Top Scrollbar */}
      <HUDProgressDots />

      {/* Scrollytelling DOM Chapters Layer on Top (z-10) */}
      <ChaptersDOM
        onStartAnalysis={onStartAnalysis}
        onExploreReport={onExploreReport}
      />
    </ScrollProvider>
  );
};
