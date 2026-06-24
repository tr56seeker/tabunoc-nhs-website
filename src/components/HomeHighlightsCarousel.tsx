"use client";

import { useEffect, useRef, useState } from "react";

const AUTO_SCROLL_SPEED = 0.28;
const DRAG_THRESHOLD = 8;

type PauseReason = "hover" | "pointer" | "focus" | "modal";

type Highlight = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  alt_text: string | null;
  facebook_url: string | null;
  event_date: string | null;
  display_order: number;
};

function formatEventDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(date);
}

export default function HomeHighlightsCarousel() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selected, setSelected] = useState<Highlight | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const pauseReasonsRef = useRef<Set<PauseReason>>(new Set());
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const clearDragTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/home-highlights", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Highlights unavailable");
        return response.json() as Promise<{ highlights?: Highlight[] }>;
      })
      .then((data) => setHighlights(data.highlights ?? []))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setHighlights([]);
        }
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  useEffect(() => {
    if (selected) {
      pauseReasonsRef.current.add("modal");
    } else {
      pauseReasonsRef.current.delete("modal");
    }
  }, [selected]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const repeatedSet = setRef.current;
    if (!track || !repeatedSet || highlights.length === 0) return;

    const updateSetWidth = () => {
      setWidthRef.current = repeatedSet.getBoundingClientRect().width;
      offsetRef.current = normalizeOffset(offsetRef.current, setWidthRef.current);
    };

    updateSetWidth();
    const resizeObserver = new ResizeObserver(updateSetWidth);
    resizeObserver.observe(repeatedSet);

    let previousTime: number | null = null;
    const frameDuration = 1000 / 60;
    const animate = (time: number) => {
      const elapsed = previousTime === null ? frameDuration : Math.min(time - previousTime, 50);
      previousTime = time;

      if (
        !prefersReducedMotion &&
        !isDraggingRef.current &&
        pauseReasonsRef.current.size === 0
      ) {
        offsetRef.current -= AUTO_SCROLL_SPEED * (elapsed / frameDuration);
      }

      offsetRef.current = normalizeOffset(offsetRef.current, setWidthRef.current);
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [highlights.length, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (clearDragTimerRef.current !== null) {
        window.clearTimeout(clearDragTimerRef.current);
      }
    };
  }, []);

  if (highlights.length === 0) return null;

  const repetitionCount = Math.max(4, Math.ceil(10 / highlights.length));
  const repeatedHighlights = Array.from({ length: repetitionCount }).flatMap(
    () => highlights,
  );

  function normalizeOffset(offset: number, setWidth: number) {
    if (setWidth <= 0) return offset;
    let normalized = offset;
    while (normalized <= -setWidth) normalized += setWidth;
    while (normalized > 0) normalized -= setWidth;
    return normalized;
  }

  function pauseMarquee(reason: PauseReason) {
    pauseReasonsRef.current.add(reason);
  }

  function resumeMarquee(reason: PauseReason) {
    pauseReasonsRef.current.delete(reason);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (clearDragTimerRef.current !== null) {
      window.clearTimeout(clearDragTimerRef.current);
      clearDragTimerRef.current = null;
    }
    pauseMarquee("pointer");
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    hasDraggedRef.current = false;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    const deltaX = event.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) <= DRAG_THRESHOLD) return;

    if (!hasDraggedRef.current) {
      hasDraggedRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    offsetRef.current = normalizeOffset(
      dragStartOffsetRef.current + deltaX,
      setWidthRef.current,
    );
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    const wasDragged = hasDraggedRef.current;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Pointer capture may already have been released by the browser.
    }

    if (wasDragged) {
      pauseReasonsRef.current.delete("hover");
      pauseReasonsRef.current.delete("focus");
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLElement &&
        event.currentTarget.contains(activeElement)
      ) {
        activeElement.blur();
      }
    } else {
      resumeMarquee("pointer");
    }

    clearDragTimerRef.current = window.setTimeout(() => {
      hasDraggedRef.current = false;
      if (wasDragged) {
        resumeMarquee("pointer");
      }
      clearDragTimerRef.current = null;
    }, 120);
  }

  return (
    <section className="overflow-hidden bg-[#f5f7f9] py-16 sm:py-20" aria-labelledby="school-highlights-title">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F4C5C]">Campus life</p>
        <h2 id="school-highlights-title" className="mt-2 text-3xl font-semibold tracking-tight text-[#24313e] sm:text-4xl">
          School Highlights
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Stories, activities, and milestones from Tabunoc National High School.
        </p>
      </div>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(event) => {
          if (
            isDraggingRef.current &&
            !event.currentTarget.hasPointerCapture(event.pointerId)
          ) {
            endDrag(event);
          }
        }}
        onMouseEnter={() => pauseMarquee("hover")}
        onMouseLeave={() => resumeMarquee("hover")}
        onFocusCapture={() => pauseMarquee("focus")}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            resumeMarquee("focus");
          }
        }}
        className={`mx-auto mt-9 max-w-[100rem] touch-pan-y overflow-hidden px-6 pb-7 select-none sm:px-[max(1.5rem,calc((100vw-80rem)/2))] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[0, 1].map((groupIndex) => (
            <div
              key={groupIndex}
              ref={groupIndex === 0 ? setRef : undefined}
              className="flex shrink-0 items-stretch gap-5 pr-5"
              aria-hidden={groupIndex === 1 ? true : undefined}
            >
              {repeatedHighlights.map((highlight, index) => {
                const date = formatEventDate(highlight.event_date);
                const isKeyboardDuplicate = groupIndex === 1 || index >= highlights.length;
                return (
                  <button
                    key={`${groupIndex}-${highlight.id}-${index}`}
                    type="button"
                    tabIndex={isKeyboardDuplicate ? -1 : undefined}
                    onClick={(event) => {
                      if (event.detail === 0 || !hasDraggedRef.current) {
                        setSelected(highlight);
                      }
                    }}
                    className="group flex w-[82vw] shrink-0 flex-col self-stretch overflow-hidden rounded-2xl bg-white text-left shadow-[0_12px_35px_rgba(36,49,62,0.10)] outline-none transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(36,49,62,0.16)] focus-visible:ring-4 focus-visible:ring-[#ffdf20] sm:w-[420px] lg:w-[460px]"
                    aria-label={`View ${highlight.title}`}
                  >
                    <div className="relative aspect-[16/10] w-full flex-none overflow-hidden rounded-t-2xl bg-slate-100">
                      <img src={highlight.image_url} alt={highlight.alt_text || highlight.title} loading="lazy" draggable={false} className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="flex min-h-28 flex-1 flex-col border-t-4 border-[#ffdf20] p-5">
                      <p className="min-h-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#0F4C5C]">
                        {[highlight.category, date].filter(Boolean).join(" · ")}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-xl font-semibold leading-snug text-[#24313e]">{highlight.title}</h3>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm sm:p-8" role="dialog" aria-modal="true" aria-labelledby="highlight-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <button type="button" onClick={() => setSelected(null)} autoFocus aria-label="Close highlight" className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-slate-950/70 text-2xl leading-none text-white backdrop-blur transition hover:bg-slate-950">×</button>
            <div className="grid lg:grid-cols-[1.35fr_0.85fr]">
              <div className="min-h-64 bg-slate-100 lg:min-h-[34rem]">
                <img src={selected.image_url} alt={selected.alt_text || selected.title} className="h-full max-h-[70vh] w-full object-contain lg:max-h-[84vh]" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9">
                {(selected.category || selected.event_date) && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0F4C5C]">{[selected.category, formatEventDate(selected.event_date)].filter(Boolean).join(" · ")}</p>}
                <h3 id="highlight-modal-title" className="mt-3 text-3xl font-semibold tracking-tight text-[#24313e]">{selected.title}</h3>
                {selected.description && <p className="mt-5 whitespace-pre-line leading-7 text-slate-600">{selected.description}</p>}
                {selected.facebook_url && (
                  <a
                    href={selected.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-[#ffdf20] px-5 py-3 text-sm font-semibold text-[#24313e] shadow-sm transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#24313e]/20"
                  >
                    View Facebook Post
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
