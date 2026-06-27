"use client";

import { useEffect, useRef, useState } from "react";

type PopulationCountUpProps = {
  value: number;
  className?: string;
  durationMs?: number;
  delayMs?: number;
  finalRevealDelayMs?: number;
  triggerId?: string;
};

function formatCount(count: number) {
  return new Intl.NumberFormat("en-PH").format(Math.round(count));
}

function easeOutQuint(progress: number) {
  return 1 - Math.pow(1 - progress, 5);
}

const FINAL_REVEAL_DELAY_MS = 450;

export default function PopulationCountUp({
  value,
  className,
  durationMs = 1100,
  delayMs = 0,
  finalRevealDelayMs = FINAL_REVEAL_DELAY_MS,
  triggerId,
}: PopulationCountUpProps) {
  const countRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reduceMotionQuery.matches) {
      hasAnimatedRef.current = true;
      setDisplayValue(value);
      return;
    }

    const element = countRef.current;
    const triggerElement = triggerId
      ? document.getElementById(triggerId)
      : element;

    if (!element || !triggerElement || hasAnimatedRef.current) {
      return;
    }

    setDisplayValue(0);
    let animationFrameId: number | undefined;
    let delayTimerId: number | undefined;
    let finalRevealTimerId: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);

        if (!isVisible || hasAnimatedRef.current) {
          return;
        }

        hasAnimatedRef.current = true;
        observer.disconnect();
        setDisplayValue(0);

        delayTimerId = window.setTimeout(() => {
          if (value <= 1) {
            setDisplayValue(value);
            return;
          }

          const preFinalValue = Math.max(value - 1, 0);
          const startTime = performance.now();

          function animateFrame(currentTime: number) {
            const progress = Math.min(
              (currentTime - startTime) / durationMs,
              1
            );
            const easedProgress = easeOutQuint(progress);
            const currentValue = Math.floor(preFinalValue * easedProgress);

            setDisplayValue((previousValue) =>
              Math.max(previousValue, currentValue)
            );

            if (progress < 1) {
              animationFrameId = window.requestAnimationFrame(animateFrame);
              return;
            }

            setDisplayValue(preFinalValue);
            finalRevealTimerId = window.setTimeout(() => {
              setDisplayValue(value);
            }, finalRevealDelayMs);
          }

          animationFrameId = window.requestAnimationFrame(animateFrame);
        }, delayMs);
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.15,
      }
    );

    observer.observe(triggerElement);

    return () => {
      observer.disconnect();

      if (delayTimerId !== undefined) {
        window.clearTimeout(delayTimerId);
      }

      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (finalRevealTimerId !== undefined) {
        window.clearTimeout(finalRevealTimerId);
      }
    };
  }, [delayMs, durationMs, finalRevealDelayMs, triggerId, value]);

  return (
    <span ref={countRef} className={className} aria-label={formatCount(value)}>
      {formatCount(displayValue)}
    </span>
  );
}
