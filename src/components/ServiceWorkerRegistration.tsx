"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registerServiceWorker = () => {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(
        (error: unknown) => {
          console.warn(
            "The offline service could not be started.",
            error instanceof Error ? error.message : error,
          );
        },
      );
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
      return;
    }

    window.addEventListener("load", registerServiceWorker, { once: true });
    return () => window.removeEventListener("load", registerServiceWorker);
  }, []);

  return null;
}
