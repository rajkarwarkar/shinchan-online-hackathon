'use client';

import React, { Suspense } from 'react';
import { IntroGate } from '@/components/intro/IntroGate';

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-[#05030A] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-violet-500/30 border-t-violet-400 animate-spin" />
        </div>
      }
    >
      <IntroGate />
    </Suspense>
  );
}
