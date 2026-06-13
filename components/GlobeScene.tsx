import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

interface Chapter {
  lat: number;
  lon: number;
  label: string;
}

const CHAPTERS: Chapter[] = [
  { lat: 36.7, lon: -119.4, label: "California Chapter" },
  { lat: 38.8, lon: -116.4, label: "Nevada Chapter" },
  { lat: 20.6, lon: 78.9, label: "India Chapter" },
];

// Realistic equirectangular Earth day-maps (all CORS-enabled for WebGL).
const EARTH_TEXTURE_URLS = [
  "https://unpkg.com/three-globe/example/img/earth-day.jpg",
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
];

/** Convert lat/lon (degrees) to a position on a sphere of radius r. */
function latLonToVec3(
  lat: number,
  lon: number,
  r: number
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

/**
 * Bright blue-ocean / green-land procedural Earth used ONLY if every remote
 * texture fails to load. Deliberately Earth-coloured (never the dark purple
 * blob) so the globe always reads as a normal planet.
 */
function makeFallbackEarth(size: number): THREE.CanvasTexture {
  const w = size;
  const h = size / 2;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);

  const hash = (x: number, y: number, z: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const vnoise = (x: number, y: number, z: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;
    const u = smooth(xf);
    const v = smooth(yf);
    const wv = smooth(zf);
    const c = (dx: number, dy: number, dz: number) =>
      hash(xi + dx, yi + dy, zi + dz);
    const x00 = lerp(c(0, 0, 0), c(1, 0, 0), u);
    const x10 = lerp(c(0, 1, 0), c(1, 1, 0), u);
    const x01 = lerp(c(0, 0, 1), c(1, 0, 1), u);
    const x11 = lerp(c(0, 1, 1), c(1, 1, 1), u);
    return lerp(lerp(x00, x10, v), lerp(x01, x11, v), wv);
  };
  const fbm = (x: number, y: number, z: number) => {
    let f = 0;
    let amp = 0.5;
    let freq = 1;
    for (let o = 0; o < 5; o++) {
      f += amp * vnoise(x * freq, y * freq, z * freq);
      freq *= 2;
      amp *= 0.5;
    }
    return f;
  };

  const ocean: [number, number, number] = [40, 96, 168];
  const oceanDeep: [number, number, number] = [22, 64, 130];
  const land: [number, number, number] = [78, 138, 74];
  const landHi: [number, number, number] = [176, 162, 110];

  for (let j = 0; j < h; j++) {
    const lat = (j / h - 0.5) * Math.PI;
    for (let i = 0; i < w; i++) {
      const lon = (i / w) * Math.PI * 2;
      const px = Math.cos(lat) * Math.cos(lon);
      const py = Math.sin(lat);
      const pz = Math.cos(lat) * Math.sin(lon);
      const scale = 2.3;
      const n = fbm(px * scale + 5, py * scale + 5, pz * scale + 5);
      const idx = (j * w + i) * 4;
      let r: number;
      let g: number;
      let b: number;
      if (n > 0.52) {
        const t = Math.min(1, (n - 0.52) / 0.25);
        r = lerp(land[0], landHi[0], t);
        g = lerp(land[1], landHi[1], t);
        b = lerp(land[2], landHi[2], t);
      } else {
        const t = Math.min(1, (0.52 - n) / 0.3);
        r = lerp(ocean[0], oceanDeep[0], t);
        g = lerp(ocean[1], oceanDeep[1], t);
        b = lerp(ocean[2], oceanDeep[2], t);
      }
      img.data[idx] = r;
      img.data[idx + 1] = g;
      img.data[idx + 2] = b;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Loads a realistic Earth texture from a CDN, trying each URL in turn. Starts
 * with a bright Earth-coloured procedural fallback so something sensible always
 * shows, then swaps in the real photo when it arrives.
 */
function useEarthTexture(isMobile: boolean): THREE.Texture {
  const fallback = useMemo(
    () => makeFallbackEarth(isMobile ? 256 : 512),
    [isMobile]
  );
  const [texture, setTexture] = useState<THREE.Texture>(fallback);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const tryLoad = (i: number) => {
      if (cancelled || i >= EARTH_TEXTURE_URLS.length) {
        if (!cancelled) {
          console.warn(
            "[GlobeScene] All remote Earth textures failed — using procedural Earth fallback."
          );
        }
        return;
      }
      const url = EARTH_TEXTURE_URLS[i];
      loader.load(
        url,
        (tex) => {
          if (cancelled) return;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          console.info(`[GlobeScene] Loaded Earth texture: ${url}`);
          setTexture(tex);
        },
        undefined,
        () => {
          console.warn(`[GlobeScene] Failed to load Earth texture: ${url}`);
          tryLoad(i + 1);
        }
      );
    };

    tryLoad(0);
    return () => {
      cancelled = true;
    };
  }, [isMobile]);

  return texture;
}

const ATMO_VERT = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPosition = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const ATMO_FRAG = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float intensity = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
    gl_FragColor = vec4(glowColor, intensity);
  }
`;

function Atmosphere() {
  const uniforms = useMemo(
    () => ({ glowColor: { value: new THREE.Color("#6D5CAE") } }),
    []
  );
  return (
    <mesh scale={1.16}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={ATMO_VERT}
        fragmentShader={ATMO_FRAG}
      />
    </mesh>
  );
}

function Marker({
  position,
  label,
  reduced,
  onHover,
}: {
  position: [number, number, number];
  label: string;
  reduced: boolean;
  onHover: (v: boolean) => void;
}) {
  const haloRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!haloRef.current) return;
    const s = reduced ? 1.5 : 1 + (Math.sin(clock.getElapsedTime() * 2.4) + 1);
    haloRef.current.scale.setScalar(s);
    const mat = haloRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = reduced ? 0.35 : 0.45 - (s - 1) * 0.16;
  });

  return (
    <group position={position}>
      {/* pulsing halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
      {/* bright pin head (unlit so it always glows over the Earth) */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(false);
        }}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#f3e8ff" />
      </mesh>
      {/* inner accent */}
      <mesh>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>
      {hovered && (
        <Html center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full bg-[#1d1d1f] px-3 py-1 text-xs font-medium text-white shadow-lg -translate-y-7">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

function Scene({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useEarthTexture(isMobile);
  const segments = isMobile ? 48 : 96;

  useFrame((_, delta) => {
    if (groupRef.current && !reduced && !hovered) {
      groupRef.current.rotation.y += delta * 0.16;
    }
  });

  return (
    <>
      {/* Bright, even lighting so the Earth reads clearly (no dark face). */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[3, 2, 5]} intensity={1.5} />
      <directionalLight position={[-4, 1, -2]} intensity={0.45} color="#ffffff" />
      <Atmosphere />
      {/* rotation framed so North America (California/Nevada pins) faces front */}
      <group
        ref={groupRef}
        rotation={[0.3, 0.45, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <sphereGeometry args={[1.5, segments, segments]} />
          <meshStandardMaterial map={texture} roughness={1} metalness={0} />
        </mesh>
        {CHAPTERS.map((c) => (
          <Marker
            key={c.label}
            position={latLonToVec3(c.lat, c.lon, 1.57)}
            label={c.label}
            reduced={reduced}
            onHover={setHovered}
          />
        ))}
      </group>
    </>
  );
}

export default function GlobeScene() {
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.8]}
      >
        <Scene reduced={reduced} isMobile={isMobile} />
      </Canvas>
    </motion.div>
  );
}
