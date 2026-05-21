"use client";

import { useEffect, useRef } from "react";

export default function ParallaxBackground() {
  const layer1Ref = useRef<HTMLDivElement | null>(null);
  const layer2Ref = useRef<HTMLDivElement | null>(null);
  const layer3Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frameId: number | null = null;

    const updateLayers = () => {
      const scrollY = window.scrollY;

      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
      }
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
      }
      if (layer3Ref.current) {
        layer3Ref.current.style.transform = `translate3d(0, ${scrollY * 0.04}px, 0)`;
      }
      frameId = null;
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateLayers);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateLayers();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={layer1Ref}
        className="absolute left-[-10%] top-16 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"
      />
      <div
        ref={layer2Ref}
        className="absolute right-[-8%] top-24 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl"
      />
      <div
        ref={layer3Ref}
        className="absolute left-[20%] top-[40%] h-96 w-96 rounded-full bg-slate-900/10 blur-3xl"
      />
    </div>
  );
}
