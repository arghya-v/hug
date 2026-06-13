import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Friendly on-brand astronaut SVG (purple/white) with a rocket flame trail. */
function Astronaut() {
  return (
    <div className="astro-bob">
      <svg
        width="76"
        height="104"
        viewBox="0 0 80 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_8px_20px_rgba(109,92,174,0.45)]"
      >
        <defs>
          <radialGradient id="astroFlame" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="45%" stopColor="#f6c66b" />
            <stop offset="100%" stopColor="#ec6a3c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="astroVisor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B7BD8" />
            <stop offset="100%" stopColor="#4b3a8f" />
          </linearGradient>
        </defs>

        {/* rocket flame / trail (faded in/out by GSAP) */}
        <g className="astro-trail">
          <ellipse cx="40" cy="100" rx="8" ry="16" fill="url(#astroFlame)" />
          <circle cx="40" cy="95" r="4.5" fill="#fff7d6" />
          <circle cx="31" cy="104" r="2.2" fill="#f6c66b" opacity="0.8" />
          <circle cx="49" cy="106" r="1.8" fill="#f6c66b" opacity="0.7" />
        </g>

        {/* backpack */}
        <rect x="24" y="44" width="32" height="28" rx="11" fill="#6D5CAE" />

        {/* arms */}
        <rect x="14" y="46" width="13" height="22" rx="6.5" fill="#ffffff" stroke="#e2dbf7" strokeWidth="1.5" />
        <rect x="53" y="46" width="13" height="22" rx="6.5" fill="#ffffff" stroke="#e2dbf7" strokeWidth="1.5" />

        {/* legs */}
        <rect x="30" y="66" width="9.5" height="24" rx="4.75" fill="#ffffff" stroke="#e2dbf7" strokeWidth="1.5" />
        <rect x="40.5" y="66" width="9.5" height="24" rx="4.75" fill="#ffffff" stroke="#e2dbf7" strokeWidth="1.5" />
        {/* boots */}
        <rect x="29" y="84" width="11.5" height="8" rx="3.5" fill="#6D5CAE" />
        <rect x="39.5" y="84" width="11.5" height="8" rx="3.5" fill="#6D5CAE" />

        {/* torso */}
        <rect x="27" y="42" width="26" height="32" rx="12" fill="#ffffff" stroke="#e2dbf7" strokeWidth="1.5" />
        {/* chest control + heart (on-brand HUG) */}
        <rect x="33" y="50" width="14" height="11" rx="3.5" fill="#f4f2fd" stroke="#e2dbf7" strokeWidth="1" />
        <path
          d="M40 58.4c-2.4-1.7-3.7-3-3.7-4.4a2 2 0 0 1 3.7-1 2 2 0 0 1 3.7 1c0 1.4-1.3 2.7-3.7 4.4Z"
          fill="#6D5CAE"
        />

        {/* helmet */}
        <circle cx="40" cy="30" r="18" fill="#ffffff" stroke="#e2dbf7" strokeWidth="1.5" />
        <ellipse cx="40" cy="30" rx="12.5" ry="11" fill="url(#astroVisor)" />
        {/* visor shine */}
        <ellipse cx="35" cy="25.5" rx="3.6" ry="2.4" fill="#ffffff" opacity="0.85" />
        <circle cx="45.5" cy="33" r="1.6" fill="#ffffff" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function AstronautFlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || reduced) return;
    const el = containerRef.current;
    if (!el) return;

    const mob = () => window.innerWidth < 768;
    const startX = () => window.innerWidth * (mob() ? 0.62 : 0.72);
    const startY = () => window.innerHeight * 0.3;
    const dipY = () => window.innerHeight * (mob() ? 0.36 : 0.44);
    const endX = () => window.innerWidth * 0.5;
    const endY = () => window.innerHeight * (mob() ? 0.15 : 0.17);

    const ctx = gsap.context(() => {
      gsap.set(el, { xPercent: -50, yPercent: -50, rotation: 10, opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          endTrigger: "#about",
          end: "top 32%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // horizontal drift across the full flight
      tl.fromTo(el, { x: startX }, { x: endX, duration: 1 }, 0);
      // vertical arc: dip down, then settle up (gentle bezier-like curve)
      tl.fromTo(el, { y: startY }, { y: dipY, ease: "sine.in", duration: 0.5 }, 0);
      tl.to(el, { y: endY, ease: "sine.out", duration: 0.5 }, 0.5);
      // slight rotation following the path
      tl.to(el, { rotation: -6, ease: "sine.inOut", duration: 1 }, 0);
      // trail fades in on launch, out on landing
      tl.fromTo(
        ".astro-trail",
        { opacity: 0 },
        { opacity: 0.95, duration: 0.18 },
        0
      );
      tl.to(".astro-trail", { opacity: 0, duration: 0.22 }, 0.78);
    }, containerRef);

    return () => ctx.revert();
  }, [ready, reduced]);

  // Reduced motion → skip the flight entirely (no scroll animation).
  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 will-change-transform"
      style={{ opacity: 0 }}
    >
      <Astronaut />
    </div>
  );
}
