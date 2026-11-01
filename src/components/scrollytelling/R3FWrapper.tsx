'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollyScene } from './ScrollyScene';

export const R3FWrapper: React.FC = () => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      className="w-full h-full"
    >
      <ScrollyScene />
    </Canvas>
  );
};

