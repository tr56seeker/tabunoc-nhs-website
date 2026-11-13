"use client";

import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, MessageSquareHeart, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CSM_SURVEY_URL } from "@/lib/csm";

const SESSION_KEY = "tabunoc-csm-reminder-shown";
const PROMPT_DELAY_MS = 45_000;
const EXIT_INTENT_ARM_DELAY_MS = 12_000;

function wasPromptShown() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberPrompt() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    // Keep the reminder functional when storage is unavailable.
  }
}

export default function CsmSurveyPrompt() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function openPrompt() {
    if (wasPromptShown()) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    rememberPrompt();
    setIsOpen(true);
  }

  function closePrompt() {
    setIsOpen(false);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  }

  useEffect(() => {
    if (isAdminPath || wasPromptShown()) return;

    let exitIntentArmed = false;
    let footerPromptTimer: number | undefined;

    const armTimer = window.setTimeout(() => {
      exitIntentArmed = true;
    }, EXIT_INTENT_ARM_DELAY_MS);

    const promptTimer = window.setTimeout(() => {
      openPrompt();
    }, PROMPT_DELAY_MS);

    const handleMouseOut = (event: MouseEvent) => {
      if (
        exitIntentArmed &&
        event.clientY <= 8 &&
        !event.relatedTarget &&
        !wasPromptShown()
      ) {
        openPrompt();
      }
    };

    document.addEventListener("mouseout", handleMouseOut);

    const footer = document.getElementById("site-footer");
    const footerObserver = footer
      ? new IntersectionObserver(
          ([entry]) => {
            if (
              entry.isIntersecting &&
              exitIntentArmed &&
              !wasPromptShown()
            ) {
              footerPromptTimer = window.setTimeout(openPrompt, 700);
            }
          },
          { threshold: 0.35 }
        )
      : null;

    if (footer && footerObserver) footerObserver.observe(footer);

    return () => {
      window.clearTimeout(armTimer);
      window.clearTimeout(promptTimer);
      if (footerPromptTimer) window.clearTimeout(footerPromptTimer);
      document.removeEventListener("mouseout", handleMouseOut);
      footerObserver?.disconnect();
    };
  }, [isAdminPath, pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const firstFocusable = dialog?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePrompt();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (isAdminPath) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          previousFocusRef.current = document.activeElement as HTMLElement;
          rememberPrompt();
          setIsOpen(true);
        }}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-teal px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(15,76,92,0.28)] transition hover:-translate-y-0.5 hover:bg-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-haspopup="dialog"
      >
        <MessageSquareHeart className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Rate our service</span>
        <span className="sm:hidden">Feedback</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[1200] flex items-end justify-center bg-brand-navy/60 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closePrompt();
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="csm-prompt-title"
              aria-describedby="csm-prompt-description"
              data-lenis-prevent
              className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-[1.75rem] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.32)]"
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="h-2 bg-brand-yellow" aria-hidden="true" />

              <button
                type="button"
                onClick={closePrompt}
                aria-label="Close client satisfaction survey reminder"
                className="absolute right-4 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="p-6 pr-16 sm:p-8 sm:pr-20">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-mint text-brand-teal">
                  <MessageSquareHeart className="h-6 w-6" aria-hidden="true" />
                </span>

                <h2
                  id="csm-prompt-title"
                  className="mt-5 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl"
                >
                  Before you go, how was our service?
                </h2>
                <p
                  id="csm-prompt-description"
                  className="mt-4 max-w-[58ch] text-base leading-7 text-slate-600"
                >
                  If you completed a transaction or received assistance from
                  Tabunoc National High School, please take our short Client
                  Satisfaction Measurement Survey. Your feedback helps us serve
                  you better.
                </p>

                <p className="mt-4 text-sm font-medium leading-6 text-brand-teal">
                  Please answer only if you received a school service.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={CSM_SURVEY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closePrompt}
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-yellow px-5 py-3 text-center font-semibold text-brand-navy shadow-[0_8px_24px_rgba(255,223,32,0.24)] transition hover:-translate-y-0.5 hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
                  >
                    Answer the survey
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={closePrompt}
                    className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-brand-navy transition hover:border-brand-teal hover:bg-brand-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 sm:min-w-36"
                  >
                    Maybe later
                  </button>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  The survey opens in the official DepEd CSM portal.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
