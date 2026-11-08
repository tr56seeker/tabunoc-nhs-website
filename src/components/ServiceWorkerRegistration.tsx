"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      const localScope = `${window.location.origin}/`;

      void navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(
          registrations
            .filter((registration) => registration.scope === localScope)
            .map((registration) => registration.unregister()),
        ),
      );

      if ("caches" in window) {
        void caches.keys().then((cacheNames) =>
          Promise.all(
            cacheNames
              .filter((cacheName) => cacheName.startsWith("tnhs-public-"))
              .map((cacheName) => caches.delete(cacheName)),
          ),
        );
      }

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
