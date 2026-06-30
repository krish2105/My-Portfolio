/* eslint-disable react-hooks/immutability, react-hooks/purity, react-hooks/use-memo --
   React Three Fiber's render loop mutates typed-array buffers in place inside
   useFrame (the documented, performant pattern), and node positions are seeded
   once with Math.random(). The React Compiler purity/immutability rules don't
   model this imperative WebGL pattern, so they're disabled for this file only. */
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A premium AI "neural constellation": a drifting field of nodes connected by
 * proximity lines, with a soft pointer-driven parallax. Rendered behind the
 * hero name. Kept deliberately restrained — node count and connection radius
 * are tuned for 60fps on a mid-range laptop, no postprocessing/bloom.
 */
const ACCENT = new THREE.Color("#00ff94");
const NODE_COUNT = 78;
const CONNECT_DIST = 2.5; // world units
const MAX_LINE_VERTS = NODE_COUNT * 10 * 2; // generous upper bound for line endpoints

interface NodeSpec {
  base: THREE.Vector3;
  phase: number;
  speed: number;
  amp: number;
}

/** Soft radial sprite so each node reads as a glowing dot rather than a hard square. */
function makeDotTexture(): THREE.Texture {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(107,255,192,0.9)");
  g.addColorStop(1, "rgba(0,255,148,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function NeuralField() {
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { pointer } = useThree();
  const targetRot = useRef({ x: 0, y: 0 });

  const dotTexture = useMemo(makeDotTexture, []);

  const nodes = useMemo<NodeSpec[]>(() => {
    const out: NodeSpec[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      out.push({
        base: new THREE.Vector3(
          (Math.random() - 0.5) * 13,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 5
        ),
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.35,
        amp: 0.25 + Math.random() * 0.6,
      });
    }
    return out;
  }, []);

  const pointPositions = useMemo(() => new Float32Array(NODE_COUNT * 3), []);
  const linePositions = useMemo(() => new Float32Array(MAX_LINE_VERTS * 3), []);
  const live = useMemo(() => nodes.map((n) => n.base.clone()), [nodes]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // 1. Drift each node on a gentle sine path.
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      const p = live[i];
      p.set(
        n.base.x + Math.sin(t * n.speed + n.phase) * n.amp,
        n.base.y + Math.cos(t * n.speed * 0.9 + n.phase) * n.amp,
        n.base.z + Math.sin(t * n.speed * 0.6 + n.phase) * n.amp * 0.5
      );
      pointPositions[i * 3] = p.x;
      pointPositions[i * 3 + 1] = p.y;
      pointPositions[i * 3 + 2] = p.z;
    }
    const pointGeo = pointsRef.current?.geometry;
    if (pointGeo) pointGeo.attributes.position.needsUpdate = true;

    // 2. Connect nearby nodes with lines (opacity handled by material; we just build segments).
    let v = 0;
    const maxPairVerts = MAX_LINE_VERTS;
    for (let i = 0; i < NODE_COUNT && v < maxPairVerts; i++) {
      for (let j = i + 1; j < NODE_COUNT && v < maxPairVerts; j++) {
        const a = live[i];
        const b = live[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        if (dx * dx + dy * dy + dz * dz < CONNECT_DIST * CONNECT_DIST) {
          linePositions[v * 3] = a.x;
          linePositions[v * 3 + 1] = a.y;
          linePositions[v * 3 + 2] = a.z;
          v++;
          linePositions[v * 3] = b.x;
          linePositions[v * 3 + 1] = b.y;
          linePositions[v * 3 + 2] = b.z;
          v++;
        }
      }
    }
    const lineGeo = linesRef.current?.geometry;
    if (lineGeo) {
      lineGeo.setDrawRange(0, v);
      lineGeo.attributes.position.needsUpdate = true;
    }

    // 3. Soft pointer parallax on the whole group.
    targetRot.current.y += (pointer.x * 0.35 - targetRot.current.y) * 0.04;
    targetRot.current.x += (-pointer.y * 0.25 - targetRot.current.x) * 0.04;
    if (group.current) {
      group.current.rotation.y = targetRot.current.y;
      group.current.rotation.x = targetRot.current.x;
    }
  });

  return (
    <group ref={group}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} count={NODE_COUNT} />
        </bufferGeometry>
        <pointsMaterial
          size={0.42}
          map={dotTexture}
          color={ACCENT}
          transparent
          opacity={0.95}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={MAX_LINE_VERTS} />
        </bufferGeometry>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

const NeuralGraphR3F = () => (
  <Canvas
    dpr={[1, 1.6]}
    camera={{ position: [0, 0, 11], fov: 60 }}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    style={{ position: "absolute", inset: 0 }}
  >
    <NeuralField />
  </Canvas>
);

export default NeuralGraphR3F;
