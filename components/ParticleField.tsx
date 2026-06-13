import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Shared input state (module-level so listeners are set up once).
const pointer = { x: 0, y: 0 };
const scroll = { y: 0 };

interface LayerProps {
  count: number;
  spread: [number, number, number];
  size: number;
  color: string;
  opacity: number;
  /** how strongly this layer parallaxes with scroll (depth cue) */
  parallax: number;
  /** base rotation speed */
  spin: number;
  reduced: boolean;
}

function Layer({
  count,
  spread,
  size,
  color,
  opacity,
  parallax,
  spin,
  reduced,
}: LayerProps) {
  const ref = useRef<THREE.Points>(null);
  const baseY = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFrame(({ clock }) => {
    const el = ref.current;
    if (!el) return;
    // Scroll parallax — nearer (higher parallax) layers move more.
    const targetY = baseY.current + scroll.y * 0.0014 * parallax;
    el.position.y += (targetY - el.position.y) * 0.06;

    if (reduced) return;

    const t = clock.getElapsedTime();
    el.rotation.y += spin;
    el.rotation.x += (pointer.y * 0.18 * parallax - el.rotation.x) * 0.04;
    el.rotation.z += (pointer.x * 0.08 * parallax - el.rotation.z) * 0.04;
    el.position.x = Math.sin(t * 0.2) * 0.15 * parallax;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    setIsMobile(window.innerWidth < 768);

    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scroll.y = window.scrollY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scale = isMobile ? 0.45 : 1;

  return (
    <Canvas
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 8], fov: 75 }}
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1.5]}
    >
      {/* Far layer — many small, faint white stars, slow */}
      <Layer
        count={Math.round(260 * scale)}
        spread={[28, 19, 15]}
        size={0.04}
        color="#ffffff"
        opacity={0.4}
        parallax={0.4}
        spin={0.0002}
        reduced={reduced}
      />
      {/* Mid layer */}
      <Layer
        count={Math.round(120 * scale)}
        spread={[22, 14, 10]}
        size={0.07}
        color="#ffffff"
        opacity={0.7}
        parallax={1}
        spin={0.0004}
        reduced={reduced}
      />
      {/* Near layer — a few larger, bright white stars, fastest parallax */}
      <Layer
        count={Math.round(45 * scale)}
        spread={[18, 11, 7]}
        size={0.13}
        color="#ffffff"
        opacity={1}
        parallax={1.8}
        spin={0.0006}
        reduced={reduced}
      />
    </Canvas>
  );
}
