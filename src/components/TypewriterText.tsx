"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTypewriterQueue } from "@/components/TypewriterQueueProvider";

type TypewriterTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  id?: string;
  speed?: number;
  startDelay?: number;
  once?: boolean;
};

function getTypingDelay(character: string, baseSpeed: number) {
  if (character === " ") return baseSpeed + 35;
  if ([",", ";", ":"].includes(character)) return baseSpeed + 90;
  if ([".", "!", "?"].includes(character)) return baseSpeed + 160;
  if (character === "\n") return baseSpeed + 180;

  return baseSpeed + Math.random() * 28;
}

export default function TypewriterText({
  text,
  as = "span",
  className = "",
  id,
  speed = 72,
  startDelay = 150,
  once = true,
}: TypewriterTextProps) {
  const queueId = useId();
  const queue = useTypewriterQueue();
  const elementRef = useRef<HTMLElement | null>(null);
  const hasTypedRef = useRef(false);
  const registeredRef = useRef(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const Component = as;
  const registerWithQueue = queue?.register;
  const completeQueueItem = queue?.complete;
  const unregisterFromQueue = queue?.unregister;
  const canStartTyping = !queue || queue.activeId === queueId;

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      setReducedMotion(motionQuery.matches);

      if (motionQuery.matches) {
        hasTypedRef.current = true;
        setDisplayedText(text);
        setIsTyping(false);
      }
    };

    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);

    return () =>
      motionQuery.removeEventListener("change", updateMotionPreference);
  }, [text]);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || reducedMotion) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);

      if (registerWithQueue && !registeredRef.current) {
        registeredRef.current = true;
        registerWithQueue(queueId, element);
      }

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (
            registerWithQueue &&
            !registeredRef.current &&
            !hasTypedRef.current
          ) {
            registeredRef.current = true;
            registerWithQueue(queueId, element);
          }

          if (once && !registerWithQueue) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          hasTypedRef.current = false;
          registeredRef.current = false;
          unregisterFromQueue?.(queueId);
          setIsVisible(false);
          setDisplayedText("");
          setIsTyping(false);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, queueId, reducedMotion, registerWithQueue, unregisterFromQueue]);

  useEffect(() => {
    if (!reducedMotion || !registeredRef.current) return;

    completeQueueItem?.(queueId);
    registeredRef.current = false;
  }, [completeQueueItem, queueId, reducedMotion]);

  useEffect(() => {
    return () => {
      unregisterFromQueue?.(queueId);
    };
  }, [queueId, unregisterFromQueue]);

  useEffect(() => {
    if (
      !isVisible ||
      !canStartTyping ||
      reducedMotion ||
      (once && hasTypedRef.current)
    ) {
      return;
    }

    let characterIndex = 0;
    let typingTimer: number | null = null;

    const typeNextCharacter = () => {
      characterIndex += 1;
      setDisplayedText(text.slice(0, characterIndex));

      if (characterIndex >= text.length) {
        hasTypedRef.current = true;
        setIsTyping(false);
        completeQueueItem?.(queueId);
        registeredRef.current = false;
        return;
      }

      const typedCharacter = text[characterIndex - 1] ?? "";
      typingTimer = window.setTimeout(
        typeNextCharacter,
        getTypingDelay(typedCharacter, Math.max(1, speed))
      );
    };

    const delayTimer = window.setTimeout(() => {
      setIsTyping(true);
      typeNextCharacter();
    }, Math.max(0, startDelay));

    return () => {
      window.clearTimeout(delayTimer);

      if (typingTimer !== null) {
        window.clearTimeout(typingTimer);
      }
    };
  }, [
    canStartTyping,
    completeQueueItem,
    isVisible,
    once,
    queueId,
    reducedMotion,
    speed,
    startDelay,
    text,
  ]);

  return (
    <Component
      ref={(node) => {
        elementRef.current = node;
      }}
      className={`typewriter-text ${className}`.trim()}
      id={id}
      aria-label={text}
    >
      <span aria-hidden="true" className="typewriter-text__reserve">
        {text}
      </span>
      <span
        aria-hidden="true"
        className={`typewriter-text__output ${
          isTyping ? "typewriter-cursor" : "typewriter-cursor-done"
        }`}
      >
        {reducedMotion ? text : displayedText}
      </span>
    </Component>
  );
}
