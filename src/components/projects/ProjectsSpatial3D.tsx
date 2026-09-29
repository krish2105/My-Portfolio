import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "../../types/portfolio";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { useTheme } from "../../lib/theme";

/** Generates a canvas texture for a project HUD card in 3D */
function createCardTexture(project: Project, isHovered: boolean, theme: string): THREE.CanvasTexture {
  const w = 512;
  const h = 320;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  const isDark = theme !== "light";
  const bg = isDark ? "rgba(10, 10, 15, 0.94)" : "rgba(245, 247, 250, 0.94)";
  const border = isHovered
    ? "#00ff94"
    : isDark
    ? "rgba(215, 226, 234, 0.2)"
    : "rgba(12, 18, 24, 0.2)";
  const textColor = isDark ? "#edf5fa" : "#0c1218";
  const metaColor = isDark ? "#a0adba" : "#46535f";
  const accent = isDark ? "#00ff94" : "#007a48";

  // Rounded card background
  ctx.save();
  ctx.beginPath();
  const radius = 24;
  ctx.roundRect(8, 8, w - 16, h - 16, radius);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = isHovered ? 4 : 2;
  ctx.strokeStyle = border;
  ctx.stroke();
  ctx.restore();

  // Subtle header line
  ctx.fillStyle = isHovered ? "rgba(0, 255, 148, 0.15)" : "transparent";
  ctx.fillRect(8, 8, w - 16, 44);

  // Kicker & Number
  ctx.font = "bold 18px 'JetBrains Mono', monospace";
  ctx.fillStyle = accent;
  ctx.fillText(project.number, 28, 38);

  ctx.font = "14px 'JetBrains Mono', monospace";
  ctx.fillStyle = metaColor;
  ctx.fillText(project.status.toUpperCase(), 75, 38);

  // Status dot
  ctx.beginPath();
  ctx.arc(w - 36, 32, 6, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();

  // Title
  ctx.font = "900 32px 'Kanit', sans-serif";
  ctx.fillStyle = textColor;
  ctx.fillText(project.shortTitle, 28, 96);

  // Category
  ctx.font = "bold 15px 'Inter', sans-serif";
  ctx.fillStyle = accent;
  ctx.fillText(project.category, 28, 126);

  // Description snippet (multiline)
  ctx.font = "14px 'Inter', sans-serif";
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

  // Tech Chips footer
  ctx.font = "12px 'JetBrains Mono', monospace";
  const chips = (project.technologies || []).slice(0, 3).join("  •  ");
  ctx.fillStyle = textColor;
  ctx.fillText(chips, 28, 280);

  // View prompt
  if (isHovered) {
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillStyle = accent;
    ctx.fillText("CLICK TO OPEN CASE STUDY ↗", w - 240, 280);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/** Individual 3D Holographic Card in Space */
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
  const [hovered, setHovered] = useState(false);

  const angle = (index / total) * Math.PI * 2;
  const radius = 6.2;
  const posX = Math.sin(angle) * radius;
  const posZ = Math.cos(angle) * radius;
  const posY = Math.sin(index * 1.5) * 0.4;

  const texture = useMemo(() => createCardTexture(project, hovered, theme), [project, hovered, theme]);

  useFrame(() => {
    if (!meshRef.current) return;
    // Face the center with slight upward orientation
    meshRef.current.lookAt(0, posY * 0.5, 0);
    // Invert rotation so card faces camera in the orbit ring
    meshRef.current.rotateY(Math.PI);
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
        map={texture}
        transparent
        opacity={hovered ? 1 : 0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Core Rotating Reactor at the center of the ring */
function ReactorCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

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
        <meshBasicMaterial color="#00ff94" wireframe transparent opacity={0.35} />
      </mesh>
      {/* Outer wireframe sphere */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.4, 16, 16]} />
        <meshBasicMaterial color="#6bffc0" wireframe transparent opacity={0.15} />
      </mesh>
      <pointLight color="#00ff94" intensity={3} distance={10} />
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
      <ReactorCore />
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
      className="relative h-[650px] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[#050505]"
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
        <span className="flex items-center gap-1.5 rounded-full border border-[#00FF94]/30 bg-[#00FF94]/10 px-3 py-1 font-mono text-xs text-[var(--accent)]">
          <Sparkles size={12} className="animate-spin" aria-hidden /> 3D MISSION CONTROL
        </span>
        <span className="hidden font-mono text-xs text-[var(--text-3)] md:inline">
          Orbiting {projects.length} System Architectures
        </span>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--panel)]/90 px-4 py-2 shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={rotateLeft}
          aria-label="Orbit previous project"
          className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--accent)]"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="font-mono text-xs text-[var(--text-3)]">
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
