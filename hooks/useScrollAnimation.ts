import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function reduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function fadeInUp(
  element: gsap.TweenTarget,
  trigger?: Element | string | null,
  delay = 0
) {
  if (reduced()) return;
  gsap.fromTo(
    element,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: (trigger ?? element) as Element,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    }
  );
}

export function staggerFadeInUp(
  parent: Element | string,
  children: gsap.TweenTarget
) {
  if (reduced()) return;
  gsap.fromTo(
    children,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: parent as Element,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }
  );
}

export function slideInRight(
  children: gsap.TweenTarget,
  trigger: Element | string | null
) {
  if (reduced()) return;
  gsap.fromTo(
    children,
    { opacity: 0, x: 60 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: (trigger ?? children) as Element,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }
  );
}

export function countUp(
  element: Element | null,
  target: number,
  suffix = "",
  duration = 2
) {
  if (!element) return;
  if (reduced()) {
    element.textContent = target.toLocaleString() + suffix;
    return;
  }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    ease: "power1.out",
    scrollTrigger: {
      trigger: element,
      start: "top 90%",
      toggleActions: "play none none none",
    },
    onUpdate() {
      element.textContent = Math.round(obj.val).toLocaleString() + suffix;
    },
  });
}
