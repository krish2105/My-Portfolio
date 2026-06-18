import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Points,
  PointMaterial,
  Sparkles,
  Torus,
  MeshDistortMaterial,
  Icosahedron,
} from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const ACCENT = "#00FF94";
const ACCENT_DIM = "#00B368";

/** Drifting particle field. */
const NeuralNodes = ({ isMobile }: { isMobile: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = isMobile ? 80 : 220;
  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    return pos;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.035;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial transparent color={ACCENT} size={0.04} sizeAttenuation depthWrite={false} />
    </Points>
  );
};

/** Organic distorting core with orbiting rings. */
const Core = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.1}>
      <group ref={groupRef}>
        <Icosahedron args={[1, 8]}>
          <MeshDistortMaterial
            color={ACCENT_DIM}
            emissive={ACCENT}
            emissiveIntensity={0.4}
            roughness={0.22}
            metalness={0.65}
            distort={0.38}
            speed={1.8}
          />
        </Icosahedron>
        <mesh scale={1.55}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.22} />
        </mesh>
        <Torus args={[2.1, 0.008, 16, 120]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={ACCENT} transparent opacity={0.35} />
        </Torus>
        <Torus args={[2.6, 0.006, 16, 120]} rotation={[0, Math.PI / 3, Math.PI / 4]}>
          <meshBasicMaterial color={ACCENT} transparent opacity={0.2} />
        </Torus>
        <Torus args={[3.1, 0.005, 16, 120]} rotation={[Math.PI / 4, 0, 0]}>
          <meshBasicMaterial color={ACCENT_DIM} transparent opacity={0.15} />
        </Torus>
      </group>
    </Float>
  );
};

/** Wireframe satellites orbiting the core. */
const Satellites = ({ count }: { count: number }) => {
  const [items] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      key: i,
      radius: 3 + Math.random() * 2,
      speed: 0.2 + Math.random() * 0.3,
      offset: (i / count) * Math.PI * 2,
      scale: 0.12 + Math.random() * 0.16,
      y: (Math.random() - 0.5) * 3,
    }))
  );
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const it = items[i];
      child.position.x = Math.cos(t * it.speed + it.offset) * it.radius;
      child.position.z = Math.sin(t * it.speed + it.offset) * it.radius;
      child.position.y = it.y;
      child.rotation.x = t * it.speed;
      child.rotation.y = t * it.speed;
    });
  });
  return (
    <group ref={groupRef}>
      {items.map((it) => (
        <mesh key={it.key} scale={it.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

/** Whole-scene mouse parallax — gives the world depth as the pointer moves. */
const ParallaxRig = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.35, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.25, 0.04);
  });
  return <group ref={ref}>{children}</group>;
};

const NeuralScene = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (isReducedMotion) {
    return (
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <mesh>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.25} />
        </mesh>
      </Canvas>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color={ACCENT} />
      <pointLight position={[-5, -3, 2]} intensity={1} color={ACCENT_DIM} />
      <ParallaxRig>
        <Core />
        <Satellites count={isMobile ? 5 : 9} />
        <NeuralNodes isMobile={isMobile} />
        <Sparkles count={isMobile ? 40 : 90} scale={13} size={2} speed={0.25} opacity={0.5} color={ACCENT} />
      </ParallaxRig>
    </Canvas>
  );
};

export default NeuralScene;
