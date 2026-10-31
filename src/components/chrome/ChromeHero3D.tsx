'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const ChromeHero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL check & prefers-reduced-motion check
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl || isReducedMotion || isMobile) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // Three.js Scene Setup
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // Group for mouse parallax
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Chrome Material (Physical Material with clearcoat & liquid metallic reflection)
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xdce2f0),
      metalness: 1.0,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      flatShading: true
    });

    // 1. Spiky Liquid-Chrome Star Geometry (matching the multi-pointed chrome star in reference image)
    const starGroup = new THREE.Group();
    starGroup.position.set(1.1, 1.0, 0);

    // Base core icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const coreMesh = new THREE.Mesh(coreGeo, chromeMaterial);
    starGroup.add(coreMesh);

    // Add pyramidal spikes pointing outward from each vertex
    const pos = coreGeo.attributes.position;
    const spikeGeo = new THREE.ConeGeometry(0.24, 1.35, 4);
    spikeGeo.rotateX(Math.PI / 2);

    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const spike = new THREE.Mesh(spikeGeo, chromeMaterial);
      spike.position.copy(v);
      spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize());
      starGroup.add(spike);
    }

    masterGroup.add(starGroup);

    // 2. Parabolic Chrome Loop / Toroid bleeding off bottom right edge
    const loopGeo = new THREE.TorusGeometry(2.3, 0.42, 32, 64);
    const loopMesh = new THREE.Mesh(loopGeo, chromeMaterial);
    loopMesh.position.set(2.4, -1.8, -0.6);
    loopMesh.rotation.set(0.6, -0.7, 0.3);
    masterGroup.add(loopMesh);

    // 3. Fluid loop tendril in upper corner
    const tendrilGeo = new THREE.TorusGeometry(1.2, 0.18, 24, 48);
    const tendrilMesh = new THREE.Mesh(tendrilGeo, chromeMaterial);
    tendrilMesh.position.set(-2.8, 2.2, -1.2);
    tendrilMesh.rotation.set(1.2, 0.4, -0.5);
    masterGroup.add(tendrilMesh);

    // 4. Thin Orbital Wireframe Rings
    const ringGeo = new THREE.RingGeometry(1.9, 1.91, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.position.copy(starGroup.position);
    orbitalRing.rotation.x = Math.PI / 2.3;
    masterGroup.add(orbitalRing);

    // Lighting (Cinematic Violet Noir Spotlight)
    const keyVioletLight = new THREE.DirectionalLight(0xc4b5fd, 3.5);
    keyVioletLight.position.set(5, 5, 6);
    scene.add(keyVioletLight);

    const rimVioletLight = new THREE.PointLight(0x7c3aed, 6.0, 15);
    rimVioletLight.position.set(2, 2, 3);
    scene.add(rimVioletLight);

    const fillBlueLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    fillBlueLight.position.set(-6, -4, 4);
    scene.add(fillBlueLight);

    const amberAccentLight = new THREE.PointLight(0xfbbf24, 2.0, 10);
    amberAccentLight.position.set(0, -3, 2);
    scene.add(amberAccentLight);

    const ambientLight = new THREE.AmbientLight(0x1e1538, 1.2);
    scene.add(ambientLight);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.4;
      targetY = -y * 0.3;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Slow elegant rotations
      starGroup.rotation.y += 0.4 * delta;
      starGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;

      loopMesh.rotation.z += 0.12 * delta;
      tendrilMesh.rotation.y += 0.15 * delta;

      // Mouse Parallax Easing
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      masterGroup.rotation.y = mouseX;
      masterGroup.rotation.x = mouseY;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      spikeGeo.dispose();
      loopGeo.dispose();
      tendrilGeo.dispose();
      ringGeo.dispose();
      chromeMaterial.dispose();
      ringMat.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="relative w-full h-full min-h-[460px] flex items-center justify-center pointer-events-none">
      {/* Fallback Static Graphic if WebGL fails or mobile */}
      {!hasWebGL && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full flex items-center justify-center">
            {/* Violet light aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600/30 via-fuchsia-600/20 to-transparent blur-3xl animate-pulse" />
            
            {/* Chrome Spiky Star SVG Representation */}
            <svg viewBox="0 0 200 200" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-[0_20px_50px_rgba(139,92,246,0.4)] animate-spin-slow">
              <defs>
                <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#D9DCE6" />
                  <stop offset="50%" stopColor="#8E93A8" />
                  <stop offset="75%" stopColor="#F4F5FA" />
                  <stop offset="100%" stopColor="#5B6075" />
                </linearGradient>
                <linearGradient id="violetGleam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C4B5FD" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              {/* Spiky Star Shape */}
              <polygon
                points="100,10 120,70 185,75 135,115 155,180 100,140 45,180 65,115 15,75 80,70"
                fill="url(#chromeGrad)"
                stroke="url(#violetGleam)"
                strokeWidth="2"
              />
              <circle cx="100" cy="100" r="28" fill="url(#violetGleam)" opacity="0.8" />
              <circle cx="100" cy="100" r="14" fill="#FBBF24" opacity="0.9" />
            </svg>
          </div>
        </div>
      )}

      {/* Four-Point Star Glints floating in space matching reference image */}
      <div className="absolute top-8 right-12 text-violet-300 text-lg animate-ping opacity-75">✦</div>
      <div className="absolute bottom-16 right-28 text-white text-xs opacity-60">✦</div>
      <div className="absolute top-1/2 right-4 text-amber-300 text-sm animate-pulse opacity-80">✦</div>
    </div>
  );
};
