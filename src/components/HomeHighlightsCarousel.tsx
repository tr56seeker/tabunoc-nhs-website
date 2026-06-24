"use client";

import { useEffect, useRef, useState } from "react";

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });

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

  if (highlights.length === 0) return null;

  function beginDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
    };
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active || !scrollerRef.current) return;
    const distance = event.clientX - drag.current.startX;

    if (Math.abs(distance) <= 5) return;

    if (!drag.current.moved) {
      drag.current.moved = true;
      scrollerRef.current.setPointerCapture(event.pointerId);
    }

    scrollerRef.current.scrollLeft = drag.current.scrollLeft - distance;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    drag.current.active = false;
    if (scrollerRef.current?.hasPointerCapture(event.pointerId)) {
      scrollerRef.current.releasePointerCapture(event.pointerId);
    }
  }

  function scroll(direction: number) {
    scrollerRef.current?.scrollBy({
      left: direction * Math.min(scrollerRef.current.clientWidth * 0.85, 520),
      behavior: "smooth",
    });
  }

  return (
    <section className="overflow-hidden bg-[#f5f7f9] py-16 sm:py-20" aria-labelledby="school-highlights-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F4C5C]">Campus life</p>
            <h2 id="school-highlights-title" className="mt-2 text-3xl font-semibold tracking-tight text-[#24313e] sm:text-4xl">
              School Highlights
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Stories, activities, and milestones from Tabunoc National High School.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => scroll(-1)} aria-label="Show previous highlights" className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-xl text-[#24313e] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">←</button>
            <button type="button" onClick={() => scroll(1)} aria-label="Show next highlights" className="grid h-11 w-11 place-items-center rounded-full bg-[#24313e] text-xl text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">→</button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="mx-auto mt-9 flex max-w-[100rem] touch-pan-y items-stretch cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-7 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden sm:px-[max(1.5rem,calc((100vw-80rem)/2))]"
      >
        {highlights.map((highlight) => {
          const date = formatEventDate(highlight.event_date);
          return (
            <button
              key={highlight.id}
              type="button"
              onClick={(event) => {
                if (event.detail === 0 || !drag.current.moved) {
                  setSelected(highlight);
                }
              }}
              className="group flex w-[82vw] max-w-[27rem] flex-none snap-start flex-col self-stretch overflow-hidden rounded-2xl bg-white text-left shadow-[0_12px_35px_rgba(36,49,62,0.10)] outline-none transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(36,49,62,0.16)] focus-visible:ring-4 focus-visible:ring-[#ffdf20] sm:w-[25rem]"
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
