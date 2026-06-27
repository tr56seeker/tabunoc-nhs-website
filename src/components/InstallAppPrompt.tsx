"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "tabunoc-pwa-install-dismissed-until";
const INSTALLED_KEY = "tabunoc-pwa-installed";
const DISMISS_DAYS = 7;

function isAppInstalled() {
  if (typeof window === "undefined") return false;

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true;

  const storedInstalled = localStorage.getItem(INSTALLED_KEY) === "true";

  return isStandalone || storedInstalled;
}

function isDismissedRecently() {
  const dismissedUntil = localStorage.getItem(DISMISS_KEY);

  if (!dismissedUntil) return false;

  return Date.now() < Number(dismissedUntil);
}

export default function InstallAppPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setShowInstall(false);
      return;
    }

    if (isAppInstalled() || isDismissedRecently()) {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      if (isAppInstalled() || isDismissedRecently()) {
        setShowInstall(false);
        return;
      }

      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    const handleAppInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, "true");
      localStorage.removeItem(DISMISS_KEY);
      setShowInstall(false);
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
  }, [pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      localStorage.setItem(INSTALLED_KEY, "true");
      localStorage.removeItem(DISMISS_KEY);
      setShowInstall(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    const dismissedUntil =
      Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;

    localStorage.setItem(DISMISS_KEY, String(dismissedUntil));
    setShowInstall(false);
    setDeferredPrompt(null);
  };

  if (!showInstall || pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-yellow-300 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Close install app prompt"
        className="absolute right-3 top-3 rounded-full px-2 text-lg font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        ×
      </button>

      <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">
            Install Tabunoc NHS App
          </p>
          <p className="text-xs text-gray-600">
            Add the official school website to your home screen for faster
            access to announcements, enrollment updates, and online services.
          </p>
        </div>

        <button
          type="button"
          onClick={handleInstallClick}
          className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-gray-900 shadow hover:bg-yellow-300"
        >
          Install
        </button>
      </div>
    </div>
  );
}
