import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "../../types/portfolio";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { useTheme } from "../../lib/theme";

/** Generates a high-fidelity canvas texture for a project card in 3D */
function createCardTexture(project: Project, isHovered: boolean, theme: string): THREE.CanvasTexture {
  const w = 512;
  const h = 320;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  const isDark = theme !== "light";
  const bg = isDark ? "rgba(10, 14, 22, 0.94)" : "rgba(255, 255, 255, 0.98)";
  const border = isHovered
    ? (isDark ? "#00ff94" : "#007a48")
    : isDark
    ? "rgba(215, 226, 234, 0.22)"
    : "rgba(12, 18, 24, 0.16)";
  const textColor = isDark ? "#edf5fa" : "#0c1218";
  const metaColor = isDark ? "#94a3b8" : "#46535f";
  const accent = isDark ? "#00ff94" : "#007a48";

  // In light mode, draw a soft crisp shadow for architectural depth
  if (!isDark) {
    ctx.shadowColor = "rgba(12, 18, 24, 0.14)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
  }

  // Rounded card background
  ctx.save();
  ctx.beginPath();
  const radius = 24;
  ctx.roundRect(10, 10, w - 20, h - 20, radius);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.lineWidth = isHovered ? 4 : 2;
  ctx.strokeStyle = border;
  ctx.stroke();
  ctx.restore();

  // Header accent strip on hover
  if (isHovered) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(10, 10, w - 20, 48, [radius, radius, 0, 0]);
    ctx.fillStyle = isDark ? "rgba(0, 255, 148, 0.15)" : "rgba(0, 122, 72, 0.1)";
    ctx.fill();
    ctx.restore();
  }

  // Kicker & Number
  ctx.font = "bold 18px 'JetBrains Mono', monospace";
  ctx.fillStyle = accent;
  ctx.fillText(project.number, 28, 42);

  ctx.font = "14px 'JetBrains Mono', monospace";
  ctx.fillStyle = metaColor;
  ctx.fillText(project.status.toUpperCase(), 75, 42);

  // Status dot
  ctx.beginPath();
  ctx.arc(w - 36, 36, 6, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();

  // Title
  ctx.font = "900 30px 'Kanit', sans-serif";
  ctx.fillStyle = textColor;
  ctx.fillText(project.shortTitle, 28, 98);

  // Category
  ctx.font = "bold 14px 'Inter', sans-serif";
  ctx.fillStyle = accent;
  ctx.fillText(project.category, 28, 126);

  // Description snippet (multiline)
  ctx.font = "13px 'Inter', sans-serif";
  ctx.fillStyle = metaColor;
  const words = project.description.split(" ");
  let line = "";
  let y = 160;
  for (const word of words) {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > w - 60 && line !== "") {
      ctx.fillText(line, 28, y);
      line = word + " ";
      y += 22;
      if (y > 210) break;
    } else {
      line = testLine;
    }
  }
  if (line && y <= 210) ctx.fillText(line, 28, y);

  // Subtle separator line
  ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 246);
  ctx.lineTo(w - 28, 246);
  ctx.stroke();

  // Tech Chips footer
  ctx.font = "12px 'JetBrains Mono', monospace";
  const chips = (project.technologies || []).slice(0, 3).join("  •  ");
  ctx.fillStyle = textColor;
  ctx.fillText(chips, 28, 280);

  // View prompt
  if (isHovered) {
    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillStyle = accent;
    ctx.fillText("OPEN CASE STUDY ↗", w - 210, 280);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/** Individual 3D Holographic Card with billboard orientation and depth fading */
function HolographicCard({
  project,
  index,
  total,
  onOpen,
  theme,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (p: Project) => void;
  theme: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);

  const angle = (index / total) * Math.PI * 2;
  const radius = 6.2;
  const posX = Math.sin(angle) * radius;
  const posZ = Math.cos(angle) * radius;
  const posY = Math.sin(index * 1.5) * 0.4;

  const texture = useMemo(() => createCardTexture(project, hovered, theme), [project, hovered, theme]);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;
    // Always face camera directly so text is never backwards or inverted
    meshRef.current.lookAt(camera.position);

    // Dynamic depth fading based on distance from camera
    const worldPos = new THREE.Vector3();
    meshRef.current.getWorldPosition(worldPos);
    // camera is at z = 9.2; cards orbit around origin z=0 with radius 6.2
    // worldPos.z ranges from approx -6.2 (furthest back) to +6.2 (closest front)
    const normalizedDepth = (worldPos.z + 6.2) / 12.4; // 0 to 1
    const targetOpacity = hovered
      ? 1.0
      : Math.max(0.5, Math.min(1.0, 0.45 + normalizedDepth * 0.55));

    if (matRef.current) {
      matRef.current.opacity = targetOpacity;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[posX, posY, posZ]}
      scale={hovered ? 1.08 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(project);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <planeGeometry args={[2.8, 1.75]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={hovered ? 1 : 0.9}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

/** Core Rotating Reactor at the center of the ring */
function ReactorCore({ theme }: { theme: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const isDark = theme !== "light";

  const coreColor = isDark ? "#00ff94" : "#007a48";
  const sphereColor = isDark ? "#6bffc0" : "#005230";
  const lightColor = isDark ? "#00ff94" : "#00935a";

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.3;
      wireRef.current.rotation.y -= delta * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Inner glowing icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial
          color={coreColor}
          wireframe
          transparent
          opacity={isDark ? 0.35 : 0.45}
        />
      </mesh>
      {/* Outer wireframe sphere */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.4, 16, 16]} />
        <meshBasicMaterial
          color={sphereColor}
          wireframe
          transparent
          opacity={isDark ? 0.15 : 0.22}
        />
      </mesh>
      <pointLight color={lightColor} intensity={isDark ? 3 : 2} distance={10} />
    </group>
  );
}

/** The orbiting ring scene with pointer drag control */
function OrbitScene({
  projects,
  onOpen,
  theme,
  rotationY,
}: {
  projects: Project[];
  onOpen: (p: Project) => void;
  theme: string;
  rotationY: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    // Smooth damp towards target rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotationY + pointer.x * 0.15,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.08,
      0.08
    );
  });

  return (
    <group ref={groupRef}>
      <ReactorCore theme={theme} />
      {projects.map((project, i) => (
        <HolographicCard
          key={project.id}
          project={project}
          index={i}
          total={projects.length}
          onOpen={onOpen}
          theme={theme}
        />
      ))}
    </group>
  );
}

export const ProjectsSpatial3D = ({
  projects,
  onOpen,
}: {
  projects: Project[];
  onOpen: (p: Project) => void;
}) => {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartRot = useRef(0);

  const rotateLeft = () => setRotationY((r) => r + (Math.PI * 2) / projects.length);
  const rotateRight = () => setRotationY((r) => r - (Math.PI * 2) / projects.length);

  useEffect(() => {
    const step = (Math.PI * 2) / projects.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setRotationY((r) => r + step);
      if (e.key === "ArrowRight") setRotationY((r) => r - step);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projects.length]);

  return (
    <div
      className={`relative h-[650px] w-full overflow-hidden rounded-2xl border transition-colors duration-300 ${
        isDark
          ? "border-[var(--border)] bg-[#07090e]"
          : "border-[var(--border-strong)] bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#e2e8f0] shadow-inner"
      }`}
      style={{
        backgroundImage: isDark
          ? "radial-gradient(circle at 50% 50%, rgba(0, 255, 148, 0.05), transparent 70%), linear-gradient(180deg, #07090e 0%, #05070a 100%)"
          : "radial-gradient(circle at 50% 50%, rgba(0, 122, 72, 0.06), transparent 70%), linear-gradient(180deg, #fbfcfe 0%, #eef2f6 50%, #e2e8f0 100%)"
      }}
      onPointerDown={(e) => {
        setIsDragging(true);
        dragStartX.current = e.clientX;
        dragStartRot.current = rotationY;
      }}
      onPointerMove={(e) => {
        if (!isDragging) return;
        const delta = (e.clientX - dragStartX.current) * 0.006;
        setRotationY(dragStartRot.current + delta);
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.2, 9.2], fov: 42 }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <ambientLight intensity={0.8} />
        <OrbitScene
          projects={projects}
          onOpen={onOpen}
          theme={theme}
          rotationY={rotationY}
        />
      </Canvas>

      {/* Top Telemetry overlay */}
      <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-2">
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold ${
            isDark
              ? "border-[#00FF94]/30 bg-[#00FF94]/10 text-[var(--accent)]"
              : "border-[#007a48]/30 bg-[#007a48]/10 text-[#007a48]"
          }`}
        >
          <Sparkles size={12} className="animate-spin" aria-hidden /> 3D MISSION CONTROL
        </span>
        <span className="hidden font-mono text-xs text-[var(--text-3)] md:inline">
          Orbiting {projects.length} System Architectures
        </span>
      </div>

      {/* Interactive Controls Overlay */}
      <div
        className={`absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-md transition-colors ${
          isDark
            ? "border-[var(--border)] bg-[var(--panel)]/90 text-[var(--text-3)] shadow-2xl"
            : "border-[var(--border-strong)] bg-white/95 text-[var(--text)] shadow-xl"
        }`}
      >
        <button
          type="button"
          onClick={rotateLeft}
          aria-label="Orbit previous project"
          className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--accent)]"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="font-mono text-xs text-[var(--text-2)]">
          Drag or Arrow Keys to Orbit · Click Card to Inspect
        </span>

        <button
          type="button"
          onClick={rotateRight}
          aria-label="Orbit next project"
          className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--accent)]"
        >
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          onClick={() => setRotationY(0)}
          aria-label="Reset rotation"
          title="Reset camera view"
          className="ml-1 grid h-7 w-7 place-items-center rounded-full border border-[var(--border)] text-[var(--text-3)] hover:text-[var(--accent)]"
        >
          <RotateCcw size={12} />
        </button>
      </div>
    </div>
  );
};

export default ProjectsSpatial3D;
