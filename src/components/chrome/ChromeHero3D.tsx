'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const ChromeHero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // Generate High-Fidelity Violet-Tinted Environment Map (Crucial so metalness 1.0 reflects bright chrome)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d');
    if (ctx) {
      // Violet spotlight cutting through black void reflection map
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#1E0B38');     // Deep violet void
      grad.addColorStop(0.25, '#7C3AED');  // Bright violet spotlight band
      grad.addColorStop(0.48, '#FFFFFF');  // Blinding white horizon reflection
      grad.addColorStop(0.52, '#E2E8F0');  // Chrome specular highlight
      grad.addColorStop(0.75, '#A78BFA');  // Lavender sheen
      grad.addColorStop(1, '#05030A');     // Void floor
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Add specular reflection highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(320, 180, 90, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#C4B5FD';
      ctx.beginPath();
      ctx.arc(750, 200, 120, 0, Math.PI * 2);
      ctx.fill();

      const envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      const envRenderTarget = pmremGenerator.fromEquirectangular(envTexture);
      scene.environment = envRenderTarget.texture;
    }

    // Master group for mouse parallax and positioning
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // MeshPhysicalMaterial matching exact spec: metalness 1, roughness 0.12, clearcoat 1, envMapIntensity >= 1.5
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 1.0,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 2.2,
      reflectivity: 1.0,
      flatShading: true
    });

    // 1. Large Liquid-Chrome Spiky Star (centered in right half)
    const starGroup = new THREE.Group();
    starGroup.position.set(0.1, 0.2, 0);
    starGroup.scale.set(1.45, 1.45, 1.45); // Generously sized to fill 40-50% viewport width

    // Base core icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const coreMesh = new THREE.Mesh(coreGeo, chromeMaterial);
    starGroup.add(coreMesh);

    // Multi-pointed faceted cones extending from each vertex
    const pos = coreGeo.attributes.position;
    const spikeGeo = new THREE.ConeGeometry(0.25, 1.45, 4);
    spikeGeo.rotateX(Math.PI / 2);

    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const spike = new THREE.Mesh(spikeGeo, chromeMaterial);
      spike.position.copy(v);
      spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize());
      starGroup.add(spike);
    }

    masterGroup.add(starGroup);

    // 2. Parabolic Liquid-Chrome Loop bleeding off bottom-right edge
    const loopGeo = new THREE.TorusGeometry(2.4, 0.45, 32, 64);
    const loopMesh = new THREE.Mesh(loopGeo, chromeMaterial);
    loopMesh.position.set(1.6, -1.7, -0.4);
    loopMesh.rotation.set(0.65, -0.6, 0.35);
    masterGroup.add(loopMesh);

    // 3. Fluid chrome loop tendril in upper corner
    const tendrilGeo = new THREE.TorusGeometry(1.3, 0.2, 24, 48);
    const tendrilMesh = new THREE.Mesh(tendrilGeo, chromeMaterial);
    tendrilMesh.position.set(-2.5, 2.2, -1.0);
    tendrilMesh.rotation.set(1.1, 0.4, -0.5);
    masterGroup.add(tendrilMesh);

    // 4. Orbital Ring
    const ringGeo = new THREE.RingGeometry(2.1, 2.12, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.position.copy(starGroup.position);
    orbitalRing.rotation.x = Math.PI / 2.3;
    masterGroup.add(orbitalRing);

    // Lighting (Spec: violet rim light plus a white key light)
    // White Key Light
    const whiteKeyLight = new THREE.DirectionalLight(0xffffff, 4.5);
    whiteKeyLight.position.set(5, 5, 5);
    scene.add(whiteKeyLight);

    // Violet Rim Light
    const violetRimLight = new THREE.DirectionalLight(0x8b5cf6, 8.5);
    violetRimLight.position.set(-5, 3, -3);
    scene.add(violetRimLight);

    // Violet Point Accent
    const violetPoint = new THREE.PointLight(0xa78bfa, 6.0, 20);
    violetPoint.position.set(2, 2, 3);
    scene.add(violetPoint);

    // Amber Inner Accent
    const amberAccent = new THREE.PointLight(0xfbbf24, 2.5, 12);
    amberAccent.position.set(0, -3, 2);
    scene.add(amberAccent);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x180d2e, 1.5);
    scene.add(ambientLight);

    // Mouse parallax
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

    // Responsive Resizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let prevTime = performance.now();
    const startTime = prevTime;

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((currentTime - prevTime) / 1000, 0.1);
      prevTime = currentTime;
      const elapsedTime = (currentTime - startTime) / 1000;

      // Slow elegant rotations
      starGroup.rotation.y += 0.35 * delta;
      starGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.15;

      loopMesh.rotation.z += 0.1 * delta;
      tendrilMesh.rotation.y += 0.12 * delta;

      // Mouse Parallax Easing
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      masterGroup.rotation.y = mouseX;
      masterGroup.rotation.x = mouseY;

      renderer.render(scene, camera);
    };

    animate(performance.now());

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      pmremGenerator.dispose();
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
    <div className="relative w-full h-full min-h-[440px] lg:min-h-[580px] flex items-center justify-center">
      {/* Three.js Canvas container: absolute inset-0 per prompt spec */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Fallback Graphic if WebGL fails */}
      {!hasWebGL && (
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600/30 via-fuchsia-600/20 to-transparent blur-3xl animate-pulse" />
          <svg viewBox="0 0 200 200" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-[0_20px_50px_rgba(139,92,246,0.4)]">
            <defs>
              <linearGradient id="chromeGradFallback" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#D9DCE6" />
                <stop offset="50%" stopColor="#8E93A8" />
                <stop offset="70%" stopColor="#F4F5FA" />
                <stop offset="100%" stopColor="#5B6075" />
              </linearGradient>
            </defs>
            <polygon
              points="100,10 120,70 185,75 135,115 155,180 100,140 45,180 65,115 15,75 80,70"
              fill="url(#chromeGradFallback)"
              stroke="#A78BFA"
              strokeWidth="2"
            />
            <circle cx="100" cy="100" r="14" fill="#FBBF24" />
          </svg>
        </div>
      )}

      {/* Floating Four-Point Star Glints matching reference image */}
      <div className="absolute top-10 right-14 text-violet-300 text-lg animate-ping opacity-80 pointer-events-none">✦</div>
      <div className="absolute bottom-16 right-32 text-white text-xs opacity-70 pointer-events-none">✦</div>
      <div className="absolute top-1/2 right-6 text-amber-300 text-sm animate-pulse opacity-90 pointer-events-none">✦</div>
    </div>
  );
};
