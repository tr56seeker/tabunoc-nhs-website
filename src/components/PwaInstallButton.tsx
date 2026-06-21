"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice?: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const INSTALLED_KEY = "tabunoc-pwa-installed";

function isAppInstalled() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true ||
    localStorage.getItem(INSTALLED_KEY) === "true"
  );
}

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => isAppInstalled());

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setInstalled(false);
    };

    const handleAppInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, "true");
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleClick = async () => {
    if (installed) return;

    if (!deferredPrompt) {
      window.location.href = "/install";
      return;
    }

    await deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult?.outcome === "accepted") {
      localStorage.setItem(INSTALLED_KEY, "true");
      setInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <button
      type="button"
      aria-label="Install Tabunoc NHS website app"
      onClick={handleClick}
      disabled={installed}
      className="rounded-xl bg-[#ffdf20] px-5 py-3 text-center text-sm font-semibold text-[#24313E] transition-colors duration-200 hover:bg-[#f1d200] disabled:cursor-not-allowed disabled:opacity-70"
    >
      Install App
    </button>
  );
}
