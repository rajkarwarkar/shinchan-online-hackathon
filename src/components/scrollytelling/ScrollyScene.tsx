'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { scrollStore } from './scrollStore';

export const ScrollyScene: React.FC = () => {
  const { gl, scene, camera } = useThree();

  // Root groups
  const masterGroupRef = useRef<THREE.Group>(null);
  const starGroupRef = useRef<THREE.Group>(null);
  const loopRef = useRef<THREE.Mesh>(null);
  const orbGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);

  // Shards refs
  const shardsGroupRef = useRef<THREE.Group>(null);
  const shardMeshesRef = useRef<THREE.Mesh[]>([]);

  // Setup PMREM Violet HDR Environment once
  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d');
    if (ctx) {
      // Chrome Noir atmospheric gradient
      const grad = ctx.createLinearGradient(0, 0, 1024, 512);
      grad.addColorStop(0, '#05030A');
      grad.addColorStop(0.25, '#2E1065');
      grad.addColorStop(0.5, '#7C3AED');
      grad.addColorStop(0.7, '#D8B4FE');
      grad.addColorStop(0.85, '#FFFFFF');
      grad.addColorStop(1, '#0F0826');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Specular glare bands
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(480, 0, 60, 512);
      ctx.fillStyle = 'rgba(196, 181, 253, 0.6)';
      ctx.fillRect(200, 0, 80, 512);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.fillRect(750, 0, 50, 512);

      const envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      const envRenderTarget = pmremGenerator.fromEquirectangular(envTexture);
      scene.environment = envRenderTarget.texture;
    }
  }, [gl, scene]);

  // Chrome Material
  const chromeMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 1.0,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 2.4,
      reflectivity: 1.0,
      flatShading: true,
    });
  }, []);

  // 5 Shard Materials (with controllable emissive for Ch 3)
  const shardMaterials = useMemo(() => {
    return [0, 1, 2, 3, 4].map(() => {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xffffff),
        metalness: 1.0,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.2,
        reflectivity: 1.0,
        flatShading: true,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0,
      });
    });
  }, []);

  // Precomputed Star Geometry & Spike Data (NO HOOKS IN LOOPS!)
  const { coreGeo, spikeGeo, spikes } = useMemo(() => {
    const cGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const sGeo = new THREE.ConeGeometry(0.24, 1.45, 4);
    sGeo.rotateX(Math.PI / 2);
    const pos = cGeo.attributes.position;
    const spikeList: Array<{ position: THREE.Vector3; quaternion: THREE.Quaternion }> = [];
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize());
      spikeList.push({ position: v, quaternion: q });
    }
    return { coreGeo: cGeo, spikeGeo: sGeo, spikes: spikeList };
  }, []);

  // 200 Floating dust particles
  const particleGeo = useMemo(() => {
    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Shard geometries
  const shardGeos = useMemo(() => {
    return [
      new THREE.TetrahedronGeometry(0.75, 0),
      new THREE.OctahedronGeometry(0.7, 0),
      new THREE.DodecahedronGeometry(0.65, 0),
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.ConeGeometry(0.4, 0.9, 5),
    ];
  }, []);

  // Spotlight target object
  const spotlightTarget = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    scene.add(spotlightTarget);
    return () => {
      scene.remove(spotlightTarget);
    };
  }, [scene, spotlightTarget]);

  // Set initial camera
  useEffect(() => {
    camera.position.set(0, 0, 7.5);
  }, [camera]);

  // Frame Loop: Smooth 60fps animation without React re-renders!
  useFrame((state, delta) => {
    const { progress, mouseX, mouseY } = scrollStore.getState();
    const clampedDelta = Math.min(delta, 0.1);

    // Mouse Parallax easing
    if (masterGroupRef.current) {
      masterGroupRef.current.rotation.y = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.y,
        mouseX * 0.18,
        4,
        clampedDelta
      );
      masterGroupRef.current.rotation.x = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.x,
        -mouseY * 0.12,
        4,
        clampedDelta
      );
    }

    // Floating particles subtle drift
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.04 * clampedDelta;
      particlesRef.current.rotation.x += 0.02 * clampedDelta;
    }

    // Torus loop idle rotation
    if (loopRef.current) {
      loopRef.current.rotation.z += 0.15 * clampedDelta;
    }

    // -------------------------------------------------------------
    // CHAPTER INTERPOLATION LOGIC
    // Ch 1 (0.00 - 0.18): Hero Star Idle + Loop on right
    // Ch 2 (0.18 - 0.38): The Problem (camera dollies back, star fragments to 5 shards)
    // Ch 3 (0.38 - 0.58): The Light (shards in grid, spotlight sweep, amber/teal glow, orb rises)
    // Ch 4 (0.58 - 0.78): Evidence-Locked (camera orbits orb, trust cards)
    // Ch 5 (0.78 - 0.92): The Output (shards flatten checklist, star re-forms right)
    // Ch 6 (0.92 - 1.00): CTA (final framing, reassembled star)
    // -------------------------------------------------------------

    // 1. Star Transform
    if (starGroupRef.current) {
      let targetStarX = 2.1;
      let targetStarY = 0.1;
      let targetStarZ = 0;
      let targetStarScale = 1.35;

      if (progress < 0.18) {
        // Hero: Large on the right
        targetStarX = 2.1;
        targetStarY = 0.1;
        targetStarZ = 0;
        targetStarScale = 1.35;
      } else if (progress < 0.4) {
        // Ch 2: Star fragments and shrinks away
        const t = (progress - 0.18) / (0.4 - 0.18);
        targetStarScale = THREE.MathUtils.lerp(1.35, 0.01, t);
      } else if (progress < 0.8) {
        // Ch 3 & 4: Star hidden while shards & orb are active
        targetStarScale = 0.01;
      } else {
        // Ch 5 & 6: Star re-forms on the right
        const t = Math.min(1, (progress - 0.8) / 0.15);
        targetStarScale = THREE.MathUtils.lerp(0.01, 1.35, t);
        targetStarX = 2.2;
        targetStarY = 0.0;
        targetStarZ = 0;
      }

      starGroupRef.current.position.x = THREE.MathUtils.damp(
        starGroupRef.current.position.x,
        targetStarX,
        5,
        clampedDelta
      );
      starGroupRef.current.position.y = THREE.MathUtils.damp(
        starGroupRef.current.position.y,
        targetStarY,
        5,
        clampedDelta
      );
      starGroupRef.current.position.z = THREE.MathUtils.damp(
        starGroupRef.current.position.z,
        targetStarZ,
        5,
        clampedDelta
      );
      starGroupRef.current.scale.setScalar(
        THREE.MathUtils.damp(starGroupRef.current.scale.x, targetStarScale, 5, clampedDelta)
      );

      // Continuous slow rotation
      starGroupRef.current.rotation.y += 0.4 * clampedDelta;
      starGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }

    // 2. Five Chrome Shards Logic
    const scatteredTargets = [
      [-2.6, 1.4, -0.6],
      [2.4, 1.6, -1.2],
      [-2.2, -1.5, -0.4],
      [2.5, -1.3, -0.8],
      [0.0, 2.0, -1.4],
    ];

    const gridTargets = [
      [-2.2, 0.9, 0],
      [0.0, 1.2, 0],
      [2.2, 0.9, 0],
      [-1.3, -1.1, 0],
      [1.3, -1.1, 0],
    ];

    const checklistTargets = [
      [-1.8, 1.0, 0],
      [-1.8, 0.5, 0],
      [-1.8, 0.0, 0],
      [-1.8, -0.5, 0],
      [-1.8, -1.0, 0],
    ];

    shardMeshesRef.current.forEach((shard, idx) => {
      if (!shard) return;

      let targetPos = [0, 0, 0];
      let targetScale = 0.01;
      let emissiveColor = new THREE.Color(0x000000);
      let emissiveIntensity = 0;

      if (progress < 0.16) {
        // Ch 1: Tucked inside star
        targetPos = [2.1, 0.1, 0];
        targetScale = 0.01;
      } else if (progress < 0.38) {
        // Ch 2: Scattered sources
        const t = Math.min(1, (progress - 0.16) / (0.38 - 0.16));
        const sTarget = scatteredTargets[idx];
        targetPos = [
          THREE.MathUtils.lerp(2.1, sTarget[0], t),
          THREE.MathUtils.lerp(0.1, sTarget[1], t),
          THREE.MathUtils.lerp(0, sTarget[2], t),
        ];
        targetScale = THREE.MathUtils.lerp(0.01, 1.0, Math.min(1, t * 1.5));
      } else if (progress < 0.6) {
        // Ch 3: The Light & Coverage Map Grid
        const t = Math.min(1, (progress - 0.38) / (0.6 - 0.38));
        const sTarget = scatteredTargets[idx];
        const gTarget = gridTargets[idx];
        targetPos = [
          THREE.MathUtils.lerp(sTarget[0], gTarget[0], t),
          THREE.MathUtils.lerp(sTarget[1], gTarget[1], t),
          THREE.MathUtils.lerp(sTarget[2], gTarget[2], t),
        ];
        targetScale = 1.05;

        // Dark spot glow: shards 0, 1, 3 glow amber; shards 2, 4 glow teal/mint
        if (idx === 0 || idx === 1 || idx === 3) {
          emissiveColor = new THREE.Color(0xfbbf24);
          emissiveIntensity = THREE.MathUtils.lerp(0, 0.9, t);
        } else {
          emissiveColor = new THREE.Color(0x5eead4);
          emissiveIntensity = THREE.MathUtils.lerp(0, 0.8, t);
        }
      } else if (progress < 0.8) {
        // Ch 4: Orbiting around orb
        const angle = (idx / 5) * Math.PI * 2 + progress * 2.5;
        const radius = 2.6;
        targetPos = [Math.cos(angle) * radius, Math.sin(angle) * 0.7, Math.sin(angle) * radius];
        targetScale = 0.8;
      } else if (progress < 0.9) {
        // Ch 5: Checklist row reassembly
        const cTarget = checklistTargets[idx];
        targetPos = [cTarget[0], cTarget[1], cTarget[2]];
        const t = Math.min(1, (progress - 0.8) / (0.9 - 0.8));
        targetScale = THREE.MathUtils.lerp(0.8, 0.4, t);
      } else {
        // Ch 6: Shards merged back into hero star
        targetPos = [2.2, 0, 0];
        targetScale = 0.01;
      }

      shard.position.x = THREE.MathUtils.damp(shard.position.x, targetPos[0], 5, clampedDelta);
      shard.position.y = THREE.MathUtils.damp(shard.position.y, targetPos[1], 5, clampedDelta);
      shard.position.z = THREE.MathUtils.damp(shard.position.z, targetPos[2], 5, clampedDelta);
      shard.scale.setScalar(
        THREE.MathUtils.damp(shard.scale.x, targetScale, 5, clampedDelta)
      );

      // Shard rotation
      shard.rotation.x += (0.3 + idx * 0.1) * clampedDelta;
      shard.rotation.y += (0.4 + idx * 0.15) * clampedDelta;

      // Update material emission
      const mat = shardMaterials[idx];
      mat.emissive.lerp(emissiveColor, 0.1);
      mat.emissiveIntensity = THREE.MathUtils.damp(
        mat.emissiveIntensity,
        emissiveIntensity,
        5,
        clampedDelta
      );
    });

    // 3. Dark Spot Orb (Rises in Ch 3, Hero in Ch 4)
    if (orbGroupRef.current) {
      let targetOrbScale = 0.01;
      let targetOrbY = -4;

      if (progress >= 0.36 && progress < 0.8) {
        const t = Math.min(1, (progress - 0.36) / 0.1);
        targetOrbScale = THREE.MathUtils.lerp(0.01, 1.25, t);
        targetOrbY = 0;
      } else if (progress >= 0.8) {
        targetOrbScale = 0.01;
        targetOrbY = -4;
      }

      orbGroupRef.current.position.y = THREE.MathUtils.damp(
        orbGroupRef.current.position.y,
        targetOrbY,
        4,
        clampedDelta
      );
      orbGroupRef.current.scale.setScalar(
        THREE.MathUtils.damp(orbGroupRef.current.scale.x, targetOrbScale, 4, clampedDelta)
      );
      orbGroupRef.current.rotation.y += 0.3 * clampedDelta;
    }

    // 4. Spotlight Cone Sweep (Active in Ch 3)
    if (spotlightRef.current && spotlightTarget) {
      if (progress >= 0.34 && progress <= 0.62) {
        const sweepT = (progress - 0.34) / (0.62 - 0.34);
        spotlightRef.current.intensity = 15;
        spotlightRef.current.position.x = THREE.MathUtils.lerp(-6, 6, sweepT);
        spotlightTarget.position.x = THREE.MathUtils.lerp(-3, 3, sweepT);
      } else {
        spotlightRef.current.intensity = 0;
      }
    }

    // 5. Camera Dolly & Orbit
    let targetCamZ = 7.5;
    let targetCamX = 0;
    let targetCamY = 0;

    if (progress < 0.18) {
      targetCamZ = 7.5;
      targetCamX = 0;
    } else if (progress < 0.4) {
      const t = (progress - 0.18) / (0.4 - 0.18);
      targetCamZ = THREE.MathUtils.lerp(7.5, 9.5, t);
    } else if (progress < 0.6) {
      const t = (progress - 0.4) / (0.6 - 0.4);
      targetCamZ = THREE.MathUtils.lerp(9.5, 7.8, t);
    } else if (progress < 0.8) {
      const t = (progress - 0.6) / (0.8 - 0.6);
      targetCamX = Math.sin(t * Math.PI) * 1.5;
      targetCamZ = 7.2;
    } else {
      targetCamZ = 7.5;
      targetCamX = 0;
    }

    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4, clampedDelta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4, clampedDelta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4, clampedDelta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Lighting Setup: Violet Rim, White Key, Amber Accent */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 6, 6]} intensity={4.5} color="#FFFFFF" />
      <pointLight position={[-6, 4, -4]} intensity={9.0} color="#8B5CF6" />
      <pointLight position={[3, -4, 2]} intensity={3.5} color="#FBBF24" />

      {/* Spotlight Cone for Chapter 3 sweep */}
      <spotLight
        ref={spotlightRef}
        position={[-5, 5, 5]}
        angle={0.45}
        penumbra={0.7}
        intensity={0}
        color="#E9D5FF"
        target={spotlightTarget}
      />

      {/* Master Parallax Group */}
      <group ref={masterGroupRef}>
        {/* 1. Primary Hero Liquid-Chrome Spiky Star */}
        <group ref={starGroupRef} position={[2.1, 0.1, 0]} scale={1.35}>
          {/* Core Icosahedron */}
          <mesh geometry={coreGeo} material={chromeMaterial} />

          {/* Extruded Spikes (Precomputed, no hooks inside loop) */}
          {spikes.map((s, i) => (
            <mesh
              key={i}
              geometry={spikeGeo}
              material={chromeMaterial}
              position={s.position}
              quaternion={s.quaternion}
            />
          ))}

          {/* Orbit Ring */}
          <mesh rotation={[Math.PI / 3, 0.2, 0]}>
            <ringGeometry args={[1.9, 1.93, 64]} />
            <meshBasicMaterial
              color="#A78BFA"
              side={THREE.DoubleSide}
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>

        {/* 2. Parabolic Chrome Loop Bleeding Off Edge */}
        <mesh
          ref={loopRef}
          position={[2.8, -1.8, -0.6]}
          rotation={[0.65, -0.6, 0.35]}
          material={chromeMaterial}
        >
          <torusGeometry args={[2.5, 0.42, 32, 64]} />
        </mesh>

        {/* 3. Five Chrome Shards */}
        <group ref={shardsGroupRef}>
          {shardGeos.map((geo, idx) => (
            <mesh
              key={idx}
              ref={(el) => {
                if (el) shardMeshesRef.current[idx] = el;
              }}
              geometry={geo}
              material={shardMaterials[idx]}
              position={[2.1, 0.1, 0]}
              scale={0.01}
            />
          ))}
        </group>

        {/* 4. Dark Spot Orb (Appears in Chapter 3 & 4) */}
        <group ref={orbGroupRef} position={[0, -4, 0]} scale={0.01}>
          {/* Glossy Black Shell */}
          <mesh>
            <sphereGeometry args={[1.1, 64, 64]} />
            <meshPhysicalMaterial
              color="#090610"
              metalness={0.9}
              roughness={0.05}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              envMapIntensity={2.5}
            />
          </mesh>
          {/* Inner Glowing Amber Core */}
          <mesh scale={0.88}>
            <sphereGeometry args={[1.1, 32, 32]} />
            <meshBasicMaterial color="#FBBF24" transparent opacity={0.65} />
          </mesh>
          <pointLight color="#FBBF24" intensity={4} distance={6} />
        </group>

        {/* 5. 200 Floating Particles Dust in Spotlight */}
        <points ref={particlesRef} geometry={particleGeo}>
          <pointsMaterial
            size={0.045}
            color="#C4B5FD"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      </group>
    </>
  );
};
