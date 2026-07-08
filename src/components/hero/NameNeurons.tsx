import { useEffect, useRef } from "react";

/**
 * A living neural field rendered to a canvas: nodes drift, connect to nearby
 * neighbours, and periodically "fire" — a glowing pulse travels down a
 * connection like a synapse. Sits behind the hero name to make it feel alive.
 * Pointer-reactive (nodes near the cursor brighten and pull slightly).
 */
const ACCENT = "0, 255, 148";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}
interface Pulse {
  a: number; // from index
  b: number; // to index
  t: number; // 0..1 progress
  speed: number;
}

const NameNeurons = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const NODE_COUNT = isMobile ? 52 : 120;
    const LINK_DIST = isMobile ? 118 : 150;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const nodes: Node[] = [];
    const pulses: Pulse[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    // Cached canvas rect, refreshed only on resize — avoids a forced
    // synchronous layout read on every pointermove (2026-07-08 perf audit).
    let canvasRect: DOMRect = canvas.getBoundingClientRect();

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasRect = canvas.getBoundingClientRect();
    };

    const seed = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
        });
      }
    };

    resize();
    seed();

    const onResize = () => {
      resize();
      seed();
    };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX - canvasRect.left;
      pointer.y = e.clientY - canvasRect.top;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);

    const onScroll = () => {
      canvasRect = canvas.getBoundingClientRect();
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    let raf = 0;
    let lastFire = 0;

    const tick = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // move nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // gentle pull toward pointer
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 200 && d > 0.1) {
            n.x += (dx / d) * 0.4;
            n.y += (dy / d) * 0.4;
          }
        }
      }

      // draw connections + collect candidate links for firing
      const links: [number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const o = (1 - dist / LINK_DIST) * 0.35;
            ctx.strokeStyle = `rgba(${ACCENT},${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            links.push([i, j]);
          }
        }
      }

      // draw nodes
      for (const n of nodes) {
        let glow = 0;
        if (pointer.active) {
          const d = Math.hypot(pointer.x - n.x, pointer.y - n.y);
          glow = d < 180 ? 1 - d / 180 : 0;
        }
        const r = 1.6 + glow * 2.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT},${0.45 + glow * 0.55})`;
        ctx.shadowBlur = 8 + glow * 14;
        ctx.shadowColor = `rgba(${ACCENT},0.9)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // spawn a firing pulse every ~280ms along a random active link
      if (time - lastFire > 280 && links.length) {
        const [a, b] = links[Math.floor(Math.random() * links.length)];
        pulses.push({ a, b, t: 0, speed: 0.015 + Math.random() * 0.02 });
        lastFire = time;
      }

      // advance + draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) {
          pulses.splice(i, 1);
          continue;
        }
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,255,220,${1 - p.t * 0.6})`;
        ctx.shadowBlur = 16;
        ctx.shadowColor = `rgba(${ACCENT},1)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
};

export default NameNeurons;
