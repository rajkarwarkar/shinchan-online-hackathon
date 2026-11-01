'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const R3FWrapper = dynamic(
  () => import('./R3FWrapper').then((mod) => mod.R3FWrapper),
  { ssr: false }
);

export const ScrollyCanvas: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <Suspense fallback={null}>
        <R3FWrapper />
      </Suspense>
    </div>
  );
};
