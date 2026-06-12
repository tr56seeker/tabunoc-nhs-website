"use client";

import { useEffect, useState } from "react";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function ClientParallaxBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mountTimer = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(mountTimer);
  }, []);

  return mounted ? <ParallaxBackground /> : null;
}
