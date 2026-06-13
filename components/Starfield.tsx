import { useEffect, useRef } from "react";

interface Star {
  x: number; // 0..1 of width
  y: number; // 0..1 of (height * fieldDepth)
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  layer: number; // parallax depth: 0 (far) .. 1 (near)
  hue: string;
}

const HUES = ["#6D5CAE", "#8B7CC8", "#b9aee6", "#9d8fd6"];

/**
 * Subtle, continuous cosmic starfield rendered to a fixed full-viewport canvas
 * that sits behind all page content. Stars twinkle, drift slowly, and parallax
 * gently with page scroll so the whole site reads as one continuous space.
 *
 * Kept deliberately faint (low alpha) so it never affects text readability.
 * Density scales down on small screens; honours prefers-reduced-motion.
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let raf = 0;
    let scrollY = window.scrollY;

    function buildStars() {
      const isMobile = width < 768;
      const density = isMobile ? 0.00009 : 0.00016; // stars per px²
      const count = Math.min(
        isMobile ? 90 : 220,
        Math.floor(width * height * density)
      );
      stars = Array.from({ length: count }, () => {
        const layer = Math.random();
        return {
          x: Math.random(),
          y: Math.random(),
          r: (0.5 + Math.random() * 1.4) * (0.6 + layer * 0.8),
          baseAlpha: 0.12 + Math.random() * 0.3,
          twinkleSpeed: 0.4 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          layer,
          hue: HUES[Math.floor(Math.random() * HUES.length)],
        };
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);
      for (const s of stars) {
        // Parallax: nearer layers shift more with scroll.
        const parallax = (scrollY * (0.02 + s.layer * 0.06)) % height;
        let y = s.y * height - parallax;
        y = ((y % height) + height) % height;
        const x = s.x * width;

        const twinkle = reduced
          ? 1
          : 0.6 + 0.4 * Math.sin(time * 0.001 * s.twinkleSpeed + s.phase);
        const alpha = s.baseAlpha * twinkle;

        ctx!.beginPath();
        ctx!.arc(x, y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = s.hue;
        ctx!.globalAlpha = alpha;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    }

    function onScroll() {
      scrollY = window.scrollY;
      if (reduced) draw(0); // redraw once for parallax under reduced motion
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Soft cosmic nebula glows */}
      <div
        className="absolute -top-32 -left-24 w-[42rem] h-[42rem] rounded-full opacity-50 nebula-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(157,143,214,0.22) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-[40%] -right-32 w-[40rem] h-[40rem] rounded-full opacity-40 nebula-drift-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(109,92,174,0.18) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[36rem] h-[36rem] rounded-full opacity-30 nebula-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(185,174,230,0.2) 0%, transparent 70%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
