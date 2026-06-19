"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const lenisDisabledRoutes = ["/evacuation-map"];

function shouldDisableLenis(pathname: string) {
  return lenisDisabledRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export default function SmoothScrollProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (shouldDisableLenis(pathname)) return;

    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reduceMotionQuery.matches) return;

    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      duration: 0.85,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      prevent: (node) =>
        Boolean(
          node.closest(
            "[data-lenis-prevent], .personnel-modal-scroll, [role='dialog']"
          )
        ),
    });

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
