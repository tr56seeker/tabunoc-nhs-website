"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Image from "next/image";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { sortLocationsByLabel } from "@/lib/mapLocationSort";

type MapPoint = {
  x: number;
  y: number;
};

type EvacuationLocation = {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  recommendedExit: string;
  assemblyArea: string;
  emergencyExit?: MapPoint | null;
  assemblyAreaPoint?: MapPoint | null;
  routePoints: MapPoint[];
  instruction: string;
};

type EvacuationMapData = {
  locations: EvacuationLocation[];
};

type LockableScreenOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
  unlock?: () => void;
};

const emptyMapData: EvacuationMapData = {
  locations: [],
};

const routesDataPath = "/data/evacuation-map-routes.json";

const legendItems = [
  { label: "You are here", sample: "pin" },
  { label: "Evacuation Route", sample: "route" },
  { label: "Exit Point", sample: "exit" },
  { label: "Assembly Area", sample: "assembly" },
] as const;

const emergencyReminder =
  "Follow teacher and SDRRM personnel instructions during emergencies.";

function getRoutePath(points: MapPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function getRouteGuidance(location: EvacuationLocation) {
  const recommendedExit = location.recommendedExit.trim();

  return recommendedExit
    ? `Follow the highlighted route toward ${recommendedExit}.`
    : "Follow the highlighted route to the marked exit point.";
}

function getAssemblyGuidance(location: EvacuationLocation) {
  return (
    location.assemblyArea.trim() ||
    "Proceed to the marked assembly area and remain with your class for accounting."
  );
}

function RouteOverlay({
  markerId,
  points,
}: {
  markerId: string;
  points: MapPoint[];
}) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [--route-stroke:4px] md:[--route-stroke:5px]"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <marker
          id={markerId}
          markerHeight="7"
          markerWidth="10"
          orient="auto"
          refX="9"
          refY="3.5"
          viewBox="0 0 10 7"
        >
          <path d="M 0 0 L 10 3.5 L 0 7 Z" fill="#087EA4" />
        </marker>
      </defs>
      {points.length > 0 && (
        <>
          <path
            d={getRoutePath(points)}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0 1px 2px rgb(15 23 42 / 0.35))",
              strokeWidth: "calc(var(--route-stroke) + 6px)",
            }}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={getRoutePath(points)}
            fill="none"
            stroke="#087EA4"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={`url(#${markerId})`}
            style={{ strokeWidth: "var(--route-stroke)" }}
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
}

function isValidMapPoint(point?: MapPoint | null): point is MapPoint {
  return (
    typeof point?.x === "number" &&
    Number.isFinite(point.x) &&
    typeof point.y === "number" &&
    Number.isFinite(point.y)
  );
}

function getValidRoutePoints(points?: MapPoint[]) {
  return (points ?? []).filter(isValidMapPoint);
}

async function requestLandscapeFullscreen(element: HTMLElement) {
  try {
    await element.requestFullscreen?.();
  } catch {
    // Continue even if fullscreen fails.
  }

  try {
    const orientation = screen.orientation as
      | LockableScreenOrientation
      | undefined;
    await orientation?.lock?.("landscape");
  } catch {
    // Some mobile browsers do not allow orientation lock.
  }
}

async function exitLandscapeFullscreen() {
  try {
    const orientation = screen.orientation as
      | LockableScreenOrientation
      | undefined;
    orientation?.unlock?.();
  } catch {
    // Ignore unsupported browsers.
  }

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
    }
  } catch {
    // Continue even if browser fullscreen exit fails.
  }
}

export default function EvacuationMapPage() {
  const [mapData, setMapData] = useState<EvacuationMapData>(emptyMapData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [isFullscreenMapOpen, setIsFullscreenMapOpen] = useState(false);
  const hasAutoOpenedFullscreenRef = useRef(false);

  const selectedLocation =
    mapData.locations.find((location) => location.id === selectedId) ?? null;
  const selectedLocationPoint =
    selectedLocation && isValidMapPoint(selectedLocation)
      ? selectedLocation
      : null;
  const selectedExitPoint =
    selectedLocation && isValidMapPoint(selectedLocation.emergencyExit)
      ? selectedLocation.emergencyExit
      : null;
  const selectedAssemblyAreaPoint =
    selectedLocation && isValidMapPoint(selectedLocation.assemblyAreaPoint)
      ? selectedLocation.assemblyAreaPoint
      : null;
  const selectedRoutePoints = selectedLocation
    ? getValidRoutePoints(selectedLocation.routePoints)
    : [];

  useEffect(() => {
    let isMounted = true;

    async function loadRoutes() {
      const response = await fetch(routesDataPath, { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Unable to load evacuation map route data.");
      }

      const data = (await response.json()) as EvacuationMapData;

      if (!isMounted) {
        return;
      }

      setMapData(data);
    }

    void loadRoutes().finally(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading || hasAutoOpenedFullscreenRef.current) {
      return;
    }

    hasAutoOpenedFullscreenRef.current = true;

    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;

    if (isMobileViewport) {
      handleOpenFullscreenMap();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isFullscreenMapOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleCloseFullscreenMap();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenMapOpen]);

  function handleOpenFullscreenMap() {
    setIsFullscreenMapOpen(true);
    void requestLandscapeFullscreen(document.documentElement);
  }

  function handleCloseFullscreenMap() {
    setIsFullscreenMapOpen(false);
    void exitLandscapeFullscreen();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f8f5] px-5 py-24 text-[#1f2933]">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-green">
          School DRRM
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Interactive Evacuation Map
        </h1>

        <p className="mt-4 max-w-2xl text-base text-slate-600">
          Select your current location inside Tabunoc National High School to
          view the recommended emergency exit route and evacuation area.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Tabunoc NHS Evacuation Map
              </h2>
              <p className="text-sm text-slate-500">
                Emergency evacuation routes and assembly areas
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenFullscreenMap}
              className="rounded-xl bg-brand-teal px-4 py-3 text-sm font-bold text-white outline-none hover:bg-brand-cyan focus:ring-4 focus:ring-brand-teal/20 sm:px-5"
            >
              Open Fullscreen Map
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <button
              type="button"
              onClick={handleOpenFullscreenMap}
              aria-label="Open fullscreen evacuation map"
              data-lenis-prevent
              className="group relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left outline-none focus-visible:ring-4 focus-visible:ring-brand-teal/30"
            >
              <Image
                src="/images/drrm/school-map.png"
                alt="Tabunoc National High School Evacuation Map"
                width={1448}
                height={1086}
                priority
                sizes="(max-width: 1024px) 100vw, 960px"
                className="block w-full rounded-2xl"
              />

              <RouteOverlay
                markerId="evacuation-route-arrow"
                points={selectedRoutePoints}
              />

              {selectedExitPoint && (
                <span
                  aria-hidden="true"
                  className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-white bg-[#dc2626] shadow"
                  style={{
                    left: `${selectedExitPoint.x}%`,
                    top: `${selectedExitPoint.y}%`,
                  }}
                />
              )}

              {selectedAssemblyAreaPoint && (
                <span
                  aria-hidden="true"
                  className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#facc15] shadow"
                  style={{
                    left: `${selectedAssemblyAreaPoint.x}%`,
                    top: `${selectedAssemblyAreaPoint.y}%`,
                  }}
                />
              )}

              {selectedLocationPoint && (
                <span
                  aria-hidden="true"
                  className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-brand-teal text-white shadow-lg ring-4 ring-brand-yellow/70 sm:h-9 sm:w-9"
                  style={{
                    left: `${selectedLocationPoint.x}%`,
                    top: `${selectedLocationPoint.y}%`,
                  }}
                >
                  <span className="h-3 w-3 rounded-full bg-current" />
                </span>
              )}

              {selectedLocationPoint && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute z-10 -translate-x-1/2 translate-y-3 rounded-full border border-white bg-brand-teal px-2 py-1 text-[10px] font-bold text-white shadow-sm"
                  style={{
                    left: `${selectedLocationPoint.x}%`,
                    top: `${selectedLocationPoint.y}%`,
                  }}
                >
                  You are here
                </span>
              )}

              {selectedExitPoint && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute z-10 translate-x-2 -translate-y-1/2 rounded-full border border-white bg-white px-2 py-1 text-[10px] font-bold text-[#b91c1c] shadow-sm"
                  style={{
                    left: `${selectedExitPoint.x}%`,
                    top: `${selectedExitPoint.y}%`,
                  }}
                >
                  Exit
                </span>
              )}

              {selectedAssemblyAreaPoint && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute z-10 translate-x-2 -translate-y-1/2 rounded-full border border-white bg-white px-2 py-1 text-[10px] font-bold text-slate-800 shadow-sm"
                  style={{
                    left: `${selectedAssemblyAreaPoint.x}%`,
                    top: `${selectedAssemblyAreaPoint.y}%`,
                  }}
                >
                  Assembly Area
                </span>
              )}

              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/75 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm transition-transform duration-200 group-hover:scale-105"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                Tap to expand
              </span>
            </button>

            <RouteGuidancePanel
              locations={mapData.locations}
              isLoading={isLoading}
              selectedId={selectedId}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedId}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:justify-end">
            <div className="flex flex-wrap gap-x-5 gap-y-3 rounded-2xl border border-slate-200 bg-brand-slate p-4 lg:max-w-[440px]">
              {legendItems.map((item) => (
                <div
                  key={item.label}
                  className="flex min-w-fit items-center gap-2"
                >
                  <LegendSample sample={item.sample} />
                  <span className="text-xs font-semibold text-slate-600">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
          This evacuation map is for guidance and emergency preparedness
          purposes only. During actual emergencies, learners and personnel must
          follow the instructions of teachers, floor marshals, SDRRM personnel,
          and emergency responders.
        </p>

        <div className="mt-8 rounded-3xl bg-[#2f3c48] p-6 text-white">
          <h2 className="text-xl font-bold">Emergency Reminder</h2>
          <p className="mt-3 text-sm text-white/85">
            Move calmly to the nearest safe exit, keep pathways clear, and
            proceed to the assigned assembly area.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Follow your teacher, class adviser, or DRRM marshal.
          </p>
        </div>
      </section>

      {isFullscreenMapOpen && (
        <FullscreenMapViewer
          data={mapData}
          isLoading={isLoading}
          selectedAssemblyAreaPoint={selectedAssemblyAreaPoint}
          selectedExitPoint={selectedExitPoint}
          selectedId={selectedId}
          selectedLocation={selectedLocation}
          selectedLocationPoint={selectedLocationPoint}
          selectedRoutePoints={selectedRoutePoints}
          onClose={handleCloseFullscreenMap}
          onSelectLocation={setSelectedId}
        />
      )}
      </main>
      <Footer />
    </>
  );
}

function RouteGuidanceDetails({
  selectedLocation,
}: {
  selectedLocation: EvacuationLocation | null;
}) {
  if (!selectedLocation) {
    return (
      <div className="grid gap-4">
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-600">
          Select your current location to view the highlighted evacuation
          route, exit guidance, and assembly area.
        </p>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
          {emergencyReminder}
        </p>
      </div>
    );
  }

  return (
    <div aria-live="polite" className="grid gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
          Selected Location
        </p>
        <h2 className="mt-2 text-xl font-bold leading-tight text-slate-950">
          {selectedLocation.label}
        </h2>
        {selectedLocation.description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {selectedLocation.description}
          </p>
        ) : null}
      </div>

      <dl className="grid gap-3 text-sm leading-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <dt className="font-bold text-brand-teal">
            Suggested Exit / Route
          </dt>
          <dd className="mt-1 text-slate-700">
            {getRouteGuidance(selectedLocation)}
          </dd>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <dt className="font-bold text-brand-teal">Assembly Area</dt>
          <dd className="mt-1 text-slate-700">
            {getAssemblyGuidance(selectedLocation)}
          </dd>
        </div>
      </dl>

      {selectedLocation.instruction ? (
        <div className="rounded-xl bg-brand-mint p-4 text-sm leading-6 text-[#174b37]">
          <p className="font-bold">Location Guidance</p>
          <p className="mt-1">{selectedLocation.instruction}</p>
        </div>
      ) : null}

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
        {emergencyReminder}
      </p>
    </div>
  );
}

function LocationFinder({
  id,
  label,
  locations,
  selectedId,
  isLoading,
  onSelectLocation,
}: {
  id: string;
  label: string;
  locations: EvacuationLocation[];
  selectedId: string;
  isLoading: boolean;
  onSelectLocation: (locationId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listboxId = `${id}-listbox`;
  const selectedLabel =
    locations.find((location) => location.id === selectedId)?.label ?? "";
  const inputValue = isOpen ? query : selectedLabel;

  const filteredLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortLocationsByLabel(locations).filter((location) => {
      return (
        normalizedQuery === "" ||
        location.label.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [locations, query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function selectLocation(locationId: string) {
    onSelectLocation(locationId);
    setIsOpen(false);
    setActiveIndex(0);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        Math.min(index + 1, filteredLocations.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const active = filteredLocations[activeIndex];

      if (active) {
        selectLocation(active.id);
      }

      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  const placeholder = isLoading
    ? "Loading locations..."
    : locations.length === 0
      ? "No locations available"
      : "Search room or building...";

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={isLoading}
          placeholder={placeholder}
          value={inputValue}
          onFocus={() => {
            setQuery(selectedLabel);
            setIsOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-9 text-sm font-semibold text-slate-900 outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/15 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        {isOpen && !isLoading && locations.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
          >
            {filteredLocations.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-500">
                No matching locations
              </li>
            ) : (
              filteredLocations.map((location, index) => (
                <li
                  key={location.id}
                  role="option"
                  aria-selected={location.id === selectedId}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectLocation(location.id);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${
                    index === activeIndex
                      ? "bg-brand-mint text-brand-teal"
                      : "text-slate-700"
                  } ${location.id === selectedId ? "font-bold" : "font-medium"}`}
                >
                  {location.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

function RouteGuidancePanel({
  locations,
  isLoading,
  selectedId,
  selectedLocation,
  onSelectLocation,
}: {
  locations: EvacuationLocation[];
  isLoading: boolean;
  selectedId: string;
  selectedLocation: EvacuationLocation | null;
  onSelectLocation: (locationId: string) => void;
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-brand-slate p-5 lg:sticky lg:top-24">
      <LocationFinder
        id="current-location"
        label="Current Location"
        locations={locations}
        selectedId={selectedId}
        isLoading={isLoading}
        onSelectLocation={onSelectLocation}
      />

      <div className="mt-5">
        <RouteGuidanceDetails selectedLocation={selectedLocation} />
      </div>
    </aside>
  );
}

function FullscreenMapViewer({
  data,
  isLoading,
  selectedAssemblyAreaPoint,
  selectedExitPoint,
  selectedId,
  selectedLocation,
  selectedLocationPoint,
  selectedRoutePoints,
  onClose,
  onSelectLocation,
}: {
  data: EvacuationMapData;
  isLoading: boolean;
  selectedAssemblyAreaPoint: MapPoint | null;
  selectedExitPoint: MapPoint | null;
  selectedId: string;
  selectedLocation: EvacuationLocation | null;
  selectedLocationPoint: EvacuationLocation | null;
  selectedRoutePoints: MapPoint[];
  onClose: () => void;
  onSelectLocation: (locationId: string) => void;
}) {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const focusScale = 2.4;
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  function handleSelectLocation(locationId: string) {
    onSelectLocation(locationId);
    setIsPanelExpanded(false);
  }

  useEffect(() => {
    const context = transformRef.current;

    if (!context || !selectedLocationPoint) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      context.zoomToElement(
        "fullscreen-selected-marker",
        focusScale,
        450,
        "easeOutCubic",
      );
    });

    return () => window.cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function renderRouteDetails() {
    return (
      <div className="grid gap-5">
        <LocationFinder
          id="fullscreen-current-location"
          label="Choose your location"
          locations={data.locations}
          selectedId={selectedId}
          isLoading={isLoading}
          onSelectLocation={handleSelectLocation}
        />

        <section className="grid gap-4 border-t border-slate-200 pt-5">
          <RouteGuidanceDetails selectedLocation={selectedLocation} />
        </section>

        <section className="grid gap-3 border-t border-slate-200 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
            Legend
          </p>
          <div className="grid gap-3 rounded-2xl bg-brand-slate p-4">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <LegendSample sample={item.sample} />
                <span className="text-xs font-semibold text-slate-600">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-brand-deepteal text-slate-950"
      data-lenis-prevent
      role="dialog"
    >
      <div className="flex h-[100dvh] w-[100dvw] flex-col overflow-hidden lg:flex-row">
        <div className="min-h-0 min-w-0 flex-1">
          <TransformWrapper
            ref={transformRef}
            centerOnInit
            centerZoomedOut
            limitToBounds
            smooth
            minScale={1}
            maxScale={5}
            wheel={{ disabled: false, step: 0.1 }}
            pinch={{ disabled: false, allowPanning: true, step: 4 }}
            panning={{
              disabled: false,
              velocityDisabled: false,
              excluded: ["button", "select", "input", "textarea"],
            }}
            doubleClick={{
              disabled: false,
              mode: "zoomIn",
              step: 0.7,
              animationTime: 300,
              animationType: "easeOutCubic",
              excluded: ["button", "select", "input", "textarea"],
            }}
            zoomAnimation={{
              disabled: false,
              animationTime: 300,
              animationType: "easeOutCubic",
            }}
            velocityAnimation={{
              disabled: false,
              animationTime: 350,
              maxAnimationTime: 450,
              animationType: "easeOutCubic",
            }}
            onInit={({ resetTransform }) => {
              requestAnimationFrame(() => {
                resetTransform(0);
              });
            }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <div className="relative h-full w-full overflow-hidden bg-[#f7f8f5]">
                <TransformComponent
                  wrapperClass="!h-full !w-full overflow-hidden cursor-grab touch-none active:cursor-grabbing"
                  contentClass="!h-full !w-fit"
                >
              <div className="relative inline-block aspect-[4/3] h-full w-auto max-w-none select-none overflow-hidden bg-white shadow-sm">
                <Image
                  src="/images/drrm/school-map.png"
                  alt="Tabunoc National High School Evacuation Map"
                  width={1448}
                  height={1086}
                  sizes="100vw"
                  className="block h-full w-full max-w-none select-none object-contain"
                  draggable={false}
                />

                <RouteOverlay
                  markerId="fullscreen-evacuation-route-arrow"
                  points={selectedRoutePoints}
                />

            {selectedExitPoint && (
              <span
                aria-hidden="true"
                className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-white bg-[#dc2626] shadow"
                style={{
                  left: `${selectedExitPoint.x}%`,
                  top: `${selectedExitPoint.y}%`,
                }}
              />
            )}

            {selectedAssemblyAreaPoint && (
              <span
                aria-hidden="true"
                className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#facc15] shadow"
                style={{
                  left: `${selectedAssemblyAreaPoint.x}%`,
                  top: `${selectedAssemblyAreaPoint.y}%`,
                }}
              />
            )}

            {selectedLocationPoint && (
              <span
                id="fullscreen-selected-marker"
                aria-hidden="true"
                className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-brand-teal text-white shadow-lg ring-4 ring-brand-yellow/70 sm:h-9 sm:w-9"
                style={{
                  left: `${selectedLocationPoint.x}%`,
                  top: `${selectedLocationPoint.y}%`,
                }}
              >
                <span className="h-3 w-3 rounded-full bg-current" />
              </span>
            )}

            {selectedLocationPoint && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute z-10 -translate-x-1/2 translate-y-3 rounded-full border border-white bg-brand-teal px-2 py-1 text-[10px] font-bold text-white shadow-sm"
                style={{
                  left: `${selectedLocationPoint.x}%`,
                  top: `${selectedLocationPoint.y}%`,
                }}
              >
                You are here
              </span>
            )}

            {selectedExitPoint && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute z-10 translate-x-2 -translate-y-1/2 rounded-full border border-white bg-white px-2 py-1 text-[10px] font-bold text-[#b91c1c] shadow-sm"
                style={{
                  left: `${selectedExitPoint.x}%`,
                  top: `${selectedExitPoint.y}%`,
                }}
              >
                Exit
              </span>
            )}

            {selectedAssemblyAreaPoint && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute z-10 translate-x-2 -translate-y-1/2 rounded-full border border-white bg-white px-2 py-1 text-[10px] font-bold text-slate-800 shadow-sm"
                style={{
                  left: `${selectedAssemblyAreaPoint.x}%`,
                  top: `${selectedAssemblyAreaPoint.y}%`,
                }}
              >
                Assembly Area
              </span>
            )}
              </div>
                </TransformComponent>

            <div
              className="absolute left-3 top-3 z-30 flex flex-wrap gap-2"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => zoomIn(0.4, 300, "easeOutCubic")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-slate-950 shadow-lg outline-none focus:ring-4 focus:ring-brand-teal/20"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => zoomOut(0.4, 300, "easeOutCubic")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-slate-950 shadow-lg outline-none focus:ring-4 focus:ring-brand-teal/20"
              >
                -
              </button>
              <button
                type="button"
                aria-label="Reset map view"
                onClick={() => resetTransform(350, "easeOutCubic")}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-lg outline-none focus:ring-4 focus:ring-brand-teal/20"
              >
                Reset
              </button>
            </div>
              </div>
            )}
          </TransformWrapper>
        </div>

        <aside
          className="w-full shrink-0 rounded-t-3xl border-t border-slate-200 bg-white text-brand-navy lg:flex lg:h-full lg:w-[36vw] lg:min-w-[280px] lg:max-w-[360px] lg:flex-col lg:rounded-none lg:border-l lg:border-t-0 lg:border-white/10"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 p-5 lg:shrink-0">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                Route Details
              </p>
              <h2 className="mt-2 truncate text-lg font-bold leading-tight text-slate-950">
                {selectedLocation ? selectedLocation.label : "Evacuation Map"}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-expanded={isPanelExpanded}
                aria-label={
                  isPanelExpanded ? "Hide route details" : "Show route details"
                }
                onClick={() => setIsPanelExpanded((value) => !value)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 outline-none focus:ring-4 focus:ring-brand-teal/20 lg:hidden"
              >
                <svg
                  aria-hidden="true"
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isPanelExpanded ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Exit fullscreen evacuation map"
                onClick={onClose}
                className="min-h-11 shrink-0 rounded-xl bg-brand-teal px-4 py-2 text-xs font-bold text-white outline-none focus:ring-4 focus:ring-brand-teal/20"
              >
                Close
              </button>
            </div>
          </div>

          <div
            className={`${
              isPanelExpanded ? "block" : "hidden"
            } max-h-[55dvh] overflow-y-auto border-t border-slate-100 p-5 pt-4 lg:block lg:max-h-none lg:flex-1 lg:border-t-0 lg:pt-0`}
          >
            {renderRouteDetails()}
          </div>
        </aside>
      </div>
    </div>
  );
}

function LegendSample({
  sample,
}: {
  sample: (typeof legendItems)[number]["sample"];
}) {
  if (sample === "route") {
    return <span className="h-1.5 w-8 rounded-full bg-[#087EA4]" />;
  }

  if (sample === "exit") {
    return <span className="h-3 w-3 rounded-[3px] bg-[#dc2626]" />;
  }

  if (sample === "assembly") {
    return <span className="h-4 w-4 rounded-full bg-[#facc15]" />;
  }

  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-teal text-white">
      <span className="h-2 w-2 rounded-full bg-current" />
    </span>
  );
}
