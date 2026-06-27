"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";

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

type MapMarker = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type EvacuationMapData = {
  locations: EvacuationLocation[];
  emergencyExits: MapMarker[];
  assemblyAreas: MapMarker[];
};

type EditorMode = "idle" | "room-pin" | "exit-pin" | "assembly-pin" | "route";
type PanelTab = "editor" | "tools" | "data";
type DragTarget =
  | { type: "room" }
  | { type: "exit" }
  | { type: "assembly" }
  | { type: "route"; index: number };

type CopiedCalibration = {
  sourceId: string;
  sourceLabel: string;
  x: number;
  y: number;
  recommendedExit: string;
  assemblyArea: string;
  emergencyExit?: MapPoint | null;
  assemblyAreaPoint?: MapPoint | null;
  routePoints: MapPoint[];
  instruction: string;
};

const routesDataPath = "/data/evacuation-map-routes.json";
const mapImagePath = "/images/drrm/school-map.png";
const minZoom = 0.75;
const maxZoom = 2.5;
const zoomStep = 0.05;

const emptyMapData: EvacuationMapData = {
  locations: [],
  emergencyExits: [],
  assemblyAreas: [],
};

function roundMapPoint(point: MapPoint) {
  return {
    x: Number(point.x.toFixed(1)),
    y: Number(point.y.toFixed(1)),
  };
}

function formatCoordinate(point?: MapPoint | null) {
  if (!point) return "Not set";
  return `{ x: ${point.x.toFixed(1)}, y: ${point.y.toFixed(1)} }`;
}

function getRoutePath(points: MapPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function slugifyLocationName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidPoint(point?: MapPoint | null): point is MapPoint {
  return (
    typeof point?.x === "number" &&
    Number.isFinite(point.x) &&
    typeof point.y === "number" &&
    Number.isFinite(point.y)
  );
}

function copyPoint(point?: MapPoint | null) {
  return point ? { x: point.x, y: point.y } : null;
}

function copyRoutePoints(points: MapPoint[]) {
  return points.map((point) => ({ x: point.x, y: point.y }));
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function updateLocation(
  data: EvacuationMapData,
  locationId: string,
  updater: (location: EvacuationLocation) => EvacuationLocation
) {
  return {
    ...data,
    locations: data.locations.map((location) =>
      location.id === locationId ? updater(location) : location
    ),
  };
}

export default function MapCalibrationManager() {
  const [mapData, setMapData] = useState<EvacuationMapData>(emptyMapData);
  const [selectedId, setSelectedId] = useState("");
  const [editorMode, setEditorMode] = useState<EditorMode>("idle");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [activePanelTab, setActivePanelTab] = useState<PanelTab>("editor");
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const [activeRoutePointIndex, setActiveRoutePointIndex] = useState<number | null>(
    null
  );
  const [copiedCalibration, setCopiedCalibration] =
    useState<CopiedCalibration | null>(null);
  const [includeRoomPinOnPaste, setIncludeRoomPinOnPaste] = useState(false);
  const [zoom, setZoom] = useState(1);

  const selectedLocation = useMemo(
    () => mapData.locations.find((location) => location.id === selectedId) ?? null,
    [mapData.locations, selectedId]
  );

  const selectedRoutePoints = selectedLocation?.routePoints.filter(isValidPoint) ?? [];

  function updateZoom(nextZoom: number) {
    const clampedZoom = Math.min(maxZoom, Math.max(minZoom, nextZoom));
    setZoom(Number(clampedZoom.toFixed(2)));
  }

  useEffect(() => {
    let isMounted = true;

    async function loadRoutes() {
      const response = await fetch(routesDataPath, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load evacuation map route data.");
      }

      const data = (await response.json()) as EvacuationMapData;
      if (!isMounted) return;

      setMapData(data);
      setSelectedId(data.locations[0]?.id ?? "");
      setStatus(`Loaded ${data.locations.length} calibrated locations.`);
    }

    void loadRoutes().catch((error) => {
      setStatus(error instanceof Error ? error.message : "Unable to load map data.");
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function getRelativePoint(clientX: number, clientY: number, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return roundMapPoint({
      x: clampPercent(((clientX - rect.left) / rect.width) * 100),
      y: clampPercent(((clientY - rect.top) / rect.height) * 100),
    });
  }

  function getClickedPoint(event: MouseEvent<HTMLDivElement>) {
    return getRelativePoint(event.clientX, event.clientY, event.currentTarget);
  }

  function updateDraggedTarget(target: DragTarget, point: MapPoint) {
    if (!selectedLocation) return;

    setMapData((currentData) =>
      updateLocation(currentData, selectedLocation.id, (location) => {
        if (target.type === "room") {
          return { ...location, x: point.x, y: point.y };
        }
        if (target.type === "exit") {
          return { ...location, emergencyExit: point };
        }
        if (target.type === "assembly") {
          return { ...location, assemblyAreaPoint: point };
        }

        return {
          ...location,
          routePoints: location.routePoints.map((routePoint, index) =>
            index === target.index ? point : routePoint
          ),
        };
      })
    );
  }

  function startDrag(
    event: PointerEvent<HTMLElement>,
    target: DragTarget,
    label: string
  ) {
    if (!selectedLocation) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragTarget(target);
    setActiveRoutePointIndex(target.type === "route" ? target.index : null);
    setStatus(`Adjusting ${label}.`);
  }

  function handleDragMove(event: PointerEvent<HTMLElement>) {
    if (!dragTarget || !selectedLocation) return;

    event.preventDefault();
    event.stopPropagation();
    const mapContainer = event.currentTarget.parentElement;
    if (!mapContainer) return;

    updateDraggedTarget(
      dragTarget,
      getRelativePoint(event.clientX, event.clientY, mapContainer)
    );
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (!dragTarget) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    const label =
      dragTarget.type === "route"
        ? `route point ${dragTarget.index + 1}`
        : `${dragTarget.type} pin`;
    setStatus(`Updated ${label}.`);
    setDragTarget(null);
  }

  function handleMapClick(event: MouseEvent<HTMLDivElement>) {
    if (!selectedLocation || editorMode === "idle") return;

    const point = getClickedPoint(event);
    setMapData((currentData) =>
      updateLocation(currentData, selectedLocation.id, (location) => {
        if (editorMode === "room-pin") {
          return { ...location, x: point.x, y: point.y };
        }
        if (editorMode === "exit-pin") {
          return { ...location, emergencyExit: point };
        }
        if (editorMode === "assembly-pin") {
          return { ...location, assemblyAreaPoint: point };
        }
        return { ...location, routePoints: [...location.routePoints, point] };
      })
    );
    if (editorMode === "route") {
      setActiveRoutePointIndex(selectedLocation.routePoints.length);
    }

    setStatus(
      editorMode === "route"
        ? `Added route point ${formatCoordinate(point)}.`
        : `Updated ${selectedLocation.label} at ${formatCoordinate(point)}.`
    );

    if (editorMode !== "route") {
      setEditorMode("idle");
    }
  }

  function updateSelectedLocation(updates: Partial<EvacuationLocation>) {
    if (!selectedLocation) return;
    setMapData((currentData) =>
      updateLocation(currentData, selectedLocation.id, (location) => ({
        ...location,
        ...updates,
      }))
    );
  }

  function addLocation() {
    const label = newLocationName.trim();
    const id = slugifyLocationName(label);

    if (!label || !id) {
      setStatus("Enter a valid location name before adding.");
      return;
    }

    if (mapData.locations.some((location) => location.id === id)) {
      setStatus("A location with this name already exists.");
      return;
    }

    const nextLocation: EvacuationLocation = {
      id,
      label,
      description: "",
      x: 50,
      y: 50,
      recommendedExit: "",
      assemblyArea: "",
      emergencyExit: null,
      assemblyAreaPoint: null,
      routePoints: [],
      instruction: "",
    };

    setMapData((currentData) => ({
      ...currentData,
      locations: [...currentData.locations, nextLocation],
    }));
    setSelectedId(id);
    setNewLocationName("");
    setStatus(`${label} added. Set pins and route points on the map.`);
  }

  function deleteSelectedLocation() {
    if (!selectedLocation) return;
    const shouldDelete = window.confirm(
      `Delete ${selectedLocation.label} and its route data?`
    );
    if (!shouldDelete) return;

    const nextLocations = mapData.locations.filter(
      (location) => location.id !== selectedLocation.id
    );
    setMapData((currentData) => ({ ...currentData, locations: nextLocations }));
    setSelectedId(nextLocations[0]?.id ?? "");
    setEditorMode("idle");
    setActiveRoutePointIndex(null);
    setDragTarget(null);
    setStatus(`${selectedLocation.label} deleted.`);
  }

  function undoLastPoint() {
    if (!selectedLocation || selectedLocation.routePoints.length === 0) return;
    updateSelectedLocation({
      routePoints: selectedLocation.routePoints.slice(0, -1),
    });
    setActiveRoutePointIndex(null);
    setStatus("Removed last route point.");
  }

  function clearRoute() {
    if (!selectedLocation) return;
    updateSelectedLocation({ routePoints: [] });
    setActiveRoutePointIndex(null);
    setDragTarget(null);
    setStatus("Route cleared.");
  }

  function deleteRoutePoint(indexToDelete: number) {
    if (!selectedLocation) return;

    updateSelectedLocation({
      routePoints: selectedLocation.routePoints.filter(
        (_point, index) => index !== indexToDelete
      ),
    });
    setActiveRoutePointIndex(null);
    setDragTarget(null);
    setStatus(`Deleted route point ${indexToDelete + 1}.`);
  }

  function insertRoutePoint(indexToInsertAfter: number, point: MapPoint) {
    if (!selectedLocation) return;

    const insertAfter = Math.min(
      selectedLocation.routePoints.length - 1,
      Math.max(-1, indexToInsertAfter)
    );
    const insertIndex = insertAfter + 1;

    updateSelectedLocation({
      routePoints: [
        ...selectedLocation.routePoints.slice(0, insertIndex),
        point,
        ...selectedLocation.routePoints.slice(insertIndex),
      ],
    });
    setActiveRoutePointIndex(insertIndex);
    setStatus(`Inserted route point ${insertIndex + 1}.`);
  }

  function insertAfterSelectedPoint() {
    if (
      !selectedLocation ||
      activeRoutePointIndex === null ||
      activeRoutePointIndex >= selectedLocation.routePoints.length
    ) {
      return;
    }

    const selectedPoint = selectedLocation.routePoints[activeRoutePointIndex];
    const nextPoint = selectedLocation.routePoints[activeRoutePointIndex + 1];
    const newPoint = nextPoint
      ? roundMapPoint({
          x: (selectedPoint.x + nextPoint.x) / 2,
          y: (selectedPoint.y + nextPoint.y) / 2,
        })
      : roundMapPoint({
          x: clampPercent(selectedPoint.x + 2),
          y: clampPercent(selectedPoint.y + 2),
        });

    insertRoutePoint(activeRoutePointIndex, newPoint);
  }

  function handleSegmentClick(
    event: MouseEvent<SVGPathElement>,
    segmentStartIndex: number
  ) {
    if (!selectedLocation || editorMode !== "route") return;

    event.preventDefault();
    event.stopPropagation();
    const mapSurface = event.currentTarget.closest(
      "[data-map-calibration-surface]"
    );
    if (!(mapSurface instanceof HTMLElement)) return;

    insertRoutePoint(
      segmentStartIndex,
      getRelativePoint(event.clientX, event.clientY, mapSurface)
    );
  }

  function copyCalibration() {
    if (!selectedLocation) return;

    setCopiedCalibration({
      sourceId: selectedLocation.id,
      sourceLabel: selectedLocation.label,
      x: selectedLocation.x,
      y: selectedLocation.y,
      recommendedExit: selectedLocation.recommendedExit,
      assemblyArea: selectedLocation.assemblyArea,
      emergencyExit: copyPoint(selectedLocation.emergencyExit),
      assemblyAreaPoint: copyPoint(selectedLocation.assemblyAreaPoint),
      routePoints: copyRoutePoints(selectedLocation.routePoints),
      instruction: selectedLocation.instruction,
    });
    setStatus("Calibration copied.");
  }

  function pasteCalibration() {
    if (!selectedLocation || !copiedCalibration) return;

    if (selectedLocation.id === copiedCalibration.sourceId) {
      setStatus(
        "The selected location is the copied source. Choose another location before pasting."
      );
      return;
    }

    updateSelectedLocation({
      ...(includeRoomPinOnPaste
        ? { x: copiedCalibration.x, y: copiedCalibration.y }
        : {}),
      recommendedExit: copiedCalibration.recommendedExit,
      assemblyArea: copiedCalibration.assemblyArea,
      emergencyExit: copyPoint(copiedCalibration.emergencyExit),
      assemblyAreaPoint: copyPoint(copiedCalibration.assemblyAreaPoint),
      routePoints: copyRoutePoints(copiedCalibration.routePoints),
      instruction: copiedCalibration.instruction,
    });
    setActiveRoutePointIndex(null);
    setDragTarget(null);
    setStatus(
      `Calibration pasted to ${selectedLocation.label}. Review and save changes.`
    );
  }

  async function saveMapData() {
    setIsSaving(true);
    setStatus("Saving evacuation route data...");

    try {
      const response = await fetch("/api/evacuation-map/save-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapData),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save evacuation routes.");
      }

      setStatus(result.message ?? "Evacuation map routes saved.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to save evacuation routes."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function exportJson() {
    await navigator.clipboard.writeText(JSON.stringify(mapData, null, 2));
    setStatus("Calibration JSON copied to clipboard.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#24313e]">
              Evacuation Map Calibration
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Uses the static map image at {mapImagePath} and route data at{" "}
              {routesDataPath}.
            </p>
          </div>
          <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#0F4C5C]">
            {mapData.locations.length} locations
          </span>
        </div>

        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3 sm:flex-row sm:items-center">
          <div className="flex items-center justify-between gap-3 sm:w-auto">
            <span className="text-sm font-semibold text-[#24313e]">Zoom</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => updateZoom(zoom - zoomStep)}
              disabled={zoom <= minZoom}
              className="h-9 w-9 shrink-0 rounded-xl border border-slate-200 bg-white text-lg font-semibold text-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Zoom out"
              title="Zoom out"
            >
              -
            </button>
            <input
              type="range"
              min={minZoom}
              max={maxZoom}
              step={zoomStep}
              value={zoom}
              onChange={(event) => updateZoom(Number(event.target.value))}
              className="min-w-0 flex-1 accent-[#0F4C5C]"
              aria-label="Map zoom"
            />
            <button
              type="button"
              onClick={() => updateZoom(zoom + zoomStep)}
              disabled={zoom >= maxZoom}
              className="h-9 w-9 shrink-0 rounded-xl border border-slate-200 bg-white text-lg font-semibold text-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Zoom in"
              title="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => updateZoom(1)}
              className="shrink-0 rounded-xl bg-[#0F4C5C] px-3 py-2 text-xs font-semibold text-white"
            >
              Reset
            </button>
          </div>
        </div>

        <div
          data-lenis-prevent
          className="max-h-[72vh] overflow-auto rounded-2xl border border-slate-200 bg-slate-100"
        >
          <div
            data-map-calibration-surface
            onClick={handleMapClick}
            className={`relative origin-top-left bg-slate-50 ${
              editorMode !== "idle" ? "cursor-crosshair" : ""
            }`}
            style={{ width: `${zoom * 100}%` }}
          >
            <Image
              src={mapImagePath}
              alt="Tabunoc National High School Evacuation Map"
              width={26247}
              height={18508}
              priority
              sizes="(max-width: 1280px) 100vw, 900px"
              className="block w-full"
            />

            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full [--route-stroke:4px] md:[--route-stroke:5px]"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <marker
                  id="admin-evacuation-route-arrow"
                  markerHeight="4"
                  markerWidth="6"
                  orient="auto"
                  refX="5.4"
                  refY="2"
                  viewBox="0 0 6 4"
                >
                  <path d="M 0 0 L 6 2 L 0 4 Z" fill="#087EA4" />
                </marker>
              </defs>
              {selectedRoutePoints.length > 0 && (
                <>
                  <path
                    d={getRoutePath(selectedRoutePoints)}
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
                    d={getRoutePath(selectedRoutePoints)}
                    fill="none"
                    stroke="#087EA4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd="url(#admin-evacuation-route-arrow)"
                    style={{ strokeWidth: "var(--route-stroke)" }}
                    vectorEffect="non-scaling-stroke"
                  />
                </>
              )}
            </svg>

            {editorMode === "route" && selectedRoutePoints.length > 1 && (
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                {selectedRoutePoints.slice(0, -1).map((point, index) => {
                  const nextPoint = selectedRoutePoints[index + 1];

                  return (
                    <path
                      key={`${point.x}-${point.y}-segment-${index}`}
                      d={`M ${point.x} ${point.y} L ${nextPoint.x} ${nextPoint.y}`}
                      fill="none"
                      stroke="transparent"
                      strokeLinecap="round"
                      strokeWidth="14"
                      vectorEffect="non-scaling-stroke"
                      pointerEvents="stroke"
                      onClick={(event) => handleSegmentClick(event, index)}
                      className="cursor-copy transition hover:stroke-[#ffdf20]/70"
                    />
                  );
                })}
              </svg>
            )}

            {selectedLocation && (
              <button
                type="button"
                aria-label={`${selectedLocation.label} room pin`}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => startDrag(event, { type: "room" }, "room pin")}
                onPointerMove={handleDragMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={`absolute z-20 flex h-9 w-9 touch-none -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#0F4C5C] text-white shadow-lg ring-4 ring-[#ffdf20]/70 ${
                  dragTarget?.type === "room" ? "cursor-grabbing scale-110" : "cursor-grab"
                }`}
                style={{ left: `${selectedLocation.x}%`, top: `${selectedLocation.y}%` }}
                title={selectedLocation.label}
              >
                <span className="h-3 w-3 rounded-full bg-current" />
              </button>
            )}

            {selectedLocation?.emergencyExit && (
              <button
                type="button"
                aria-label="Emergency exit pin"
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => startDrag(event, { type: "exit" }, "exit pin")}
                onPointerMove={handleDragMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={`absolute z-20 h-5 w-5 touch-none -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-white bg-[#dc2626] shadow ${
                  dragTarget?.type === "exit" ? "cursor-grabbing ring-4 ring-rose-200" : "cursor-grab"
                }`}
                style={{
                  left: `${selectedLocation.emergencyExit.x}%`,
                  top: `${selectedLocation.emergencyExit.y}%`,
                }}
              />
            )}

            {selectedLocation?.assemblyAreaPoint && (
              <button
                type="button"
                aria-label="Assembly area pin"
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) =>
                  startDrag(event, { type: "assembly" }, "assembly pin")
                }
                onPointerMove={handleDragMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={`absolute z-20 h-6 w-6 touch-none -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#facc15] shadow ${
                  dragTarget?.type === "assembly"
                    ? "cursor-grabbing ring-4 ring-yellow-200"
                    : "cursor-grab"
                }`}
                style={{
                  left: `${selectedLocation.assemblyAreaPoint.x}%`,
                  top: `${selectedLocation.assemblyAreaPoint.y}%`,
                }}
              />
            )}

            {selectedRoutePoints.map((point, index) => (
                <button
                  type="button"
                  key={`${point.x}-${point.y}-${index}`}
                  aria-label={`Route point ${index + 1}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveRoutePointIndex(index);
                  }}
                  onPointerDown={(event) =>
                    startDrag(event, { type: "route", index }, `route point ${index + 1}`)
                  }
                  onPointerMove={handleDragMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  className={`absolute z-20 flex h-5 w-5 touch-none -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[10px] font-bold leading-none shadow ${
                    activeRoutePointIndex === index ||
                    (dragTarget?.type === "route" && dragTarget.index === index)
                      ? "cursor-grabbing border-[#ffdf20] bg-[#0F4C5C] text-white ring-4 ring-[#ffdf20]/60"
                      : "cursor-grab border-white bg-slate-950 text-white"
                  }`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
          <LegendItem swatch="pin" label="Room pin" />
          <LegendItem swatch="exit" label="Exit point" />
          <LegendItem swatch="assembly" label="Assembly area" />
          <LegendItem swatch="route" label="Evacuation route" />
        </div>
      </section>

      <aside className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)]">
        <div className="shrink-0 border-b border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[#24313e]">
                Calibration Controls
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Select a location, then edit beside the map.
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving || mapData.locations.length === 0}
              onClick={() => void saveMapData()}
              className="shrink-0 rounded-xl bg-[#0F4C5C] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Location
            <select
              value={selectedId}
              onChange={(event) => {
                setSelectedId(event.target.value);
                setEditorMode("idle");
                setActiveRoutePointIndex(null);
                setDragTarget(null);
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0F4C5C]"
            >
              <option value="">
                {mapData.locations.length === 0
                  ? "No locations available"
                  : "Choose location..."}
              </option>
              {sortLocationsByLabel(mapData.locations).map((location) => (
                <option key={location.id} value={location.id}>
                  {location.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(["editor", "tools", "data"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePanelTab(tab)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${
                  activePanelTab === tab
                    ? "bg-[#ffdf20] text-[#24313e] shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activePanelTab === "editor" && (
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input
                  value={newLocationName}
                  onChange={(event) => setNewLocationName(event.target.value)}
                  placeholder="New location name"
                  className="min-w-0 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0F4C5C]"
                />
                <button
                  type="button"
                  onClick={addLocation}
                  className="rounded-xl bg-[#0F4C5C] px-4 py-2 text-sm font-semibold text-white"
                >
                  Add
                </button>
              </div>

              {selectedLocation ? (
                <div className="space-y-3">
                  <Field
                    label="Location Name / Room Name"
                    value={selectedLocation.label}
                    onChange={(value) => updateSelectedLocation({ label: value })}
                  />
                  <Field
                    label="Description"
                    value={selectedLocation.description}
                    onChange={(value) =>
                      updateSelectedLocation({ description: value })
                    }
                    multiline
                  />
                  <Field
                    label="Recommended Exit"
                    value={selectedLocation.recommendedExit}
                    onChange={(value) =>
                      updateSelectedLocation({ recommendedExit: value })
                    }
                  />
                  <Field
                    label="Assembly Area"
                    value={selectedLocation.assemblyArea}
                    onChange={(value) =>
                      updateSelectedLocation({ assemblyArea: value })
                    }
                    multiline
                  />
                  <Field
                    label="Instruction"
                    value={selectedLocation.instruction}
                    onChange={(value) =>
                      updateSelectedLocation({ instruction: value })
                    }
                    multiline
                  />
                </div>
              ) : (
                <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">
                  Select or add a location to edit details.
                </p>
              )}
            </div>
          )}

          {activePanelTab === "tools" && (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-slate-600">
                Choose a tool, then click the actual map image to update
                coordinates.
              </p>
              <p className="rounded-xl bg-[#ECFDF5] px-3 py-2 text-xs font-semibold leading-5 text-[#0F4C5C]">
                Tip: Select a point or click a route segment to insert a new
                point.
              </p>

              <div className="grid gap-2">
                <ToolButton
                  active={editorMode === "room-pin"}
                  disabled={!selectedLocation}
                  onClick={() => setEditorMode("room-pin")}
                >
                  Set Room Pin
                </ToolButton>
                <ToolButton
                  active={editorMode === "exit-pin"}
                  disabled={!selectedLocation}
                  onClick={() => setEditorMode("exit-pin")}
                >
                  Set Emergency Exit Pin
                </ToolButton>
                <ToolButton
                  active={editorMode === "assembly-pin"}
                  disabled={!selectedLocation}
                  onClick={() => setEditorMode("assembly-pin")}
                >
                  Set Assembly Area Pin
                </ToolButton>
                <ToolButton
                  active={editorMode === "route"}
                  disabled={!selectedLocation}
                  onClick={() => setEditorMode("route")}
                >
                  Edit Route Points
                </ToolButton>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={!selectedLocation || selectedRoutePoints.length === 0}
                  onClick={undoLastPoint}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Undo Point
                </button>
                <button
                  type="button"
                  disabled={!selectedLocation || selectedRoutePoints.length === 0}
                  onClick={clearRoute}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear Route
                </button>
              </div>

              <button
                type="button"
                disabled={
                  !selectedLocation ||
                  activeRoutePointIndex === null ||
                  activeRoutePointIndex >= selectedRoutePoints.length
                }
                onClick={insertAfterSelectedPoint}
                className="w-full rounded-xl border border-[#0F4C5C]/30 bg-white px-3 py-2 text-sm font-semibold text-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Insert After Selected Point
              </button>

              <button
                type="button"
                disabled={
                  !selectedLocation ||
                  activeRoutePointIndex === null ||
                  activeRoutePointIndex >= selectedRoutePoints.length
                }
                onClick={() => {
                  if (activeRoutePointIndex !== null) {
                    deleteRoutePoint(activeRoutePointIndex);
                  }
                }}
                className="w-full rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete Selected Point
              </button>

              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-[#24313e]">
                    Route Points
                  </h4>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {selectedRoutePoints.length} total
                  </span>
                </div>

                {selectedRoutePoints.length === 0 ? (
                  <p className="mt-3 rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
                    No route points yet. Use Edit Route Points, then click the
                    map to add points.
                  </p>
                ) : (
                  <ol className="mt-3 space-y-2">
                    {selectedRoutePoints.map((point, index) => {
                      const selected = activeRoutePointIndex === index;

                      return (
                        <li
                          key={`${point.x}-${point.y}-tool-${index}`}
                          className={`rounded-xl border bg-white p-2 ${
                            selected
                              ? "border-[#ffdf20] ring-2 ring-[#ffdf20]/40"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveRoutePointIndex(index)}
                              className="min-w-0 flex-1 rounded-lg px-2 py-1.5 text-left text-sm font-semibold text-[#24313e] hover:bg-slate-50"
                            >
                              Point {index + 1}
                              <span className="mt-0.5 block truncate font-mono text-xs font-medium text-slate-500">
                                {formatCoordinate(point)}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteRoutePoint(index)}
                              className="shrink-0 rounded-lg border border-rose-200 px-2.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>

              <button
                type="button"
                disabled={!selectedLocation}
                onClick={deleteSelectedLocation}
                className="w-full rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete Location
              </button>

              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <h4 className="text-sm font-semibold text-[#24313e]">
                  Calibration Transfer
                </h4>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Copy a calibrated room, select a nearby room, then paste and
                  adjust if needed.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!selectedLocation}
                    onClick={copyCalibration}
                    className="rounded-xl bg-[#0F4C5C] px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Copy Calibration
                  </button>
                  <button
                    type="button"
                    disabled={!selectedLocation || !copiedCalibration}
                    onClick={pasteCalibration}
                    className="rounded-xl border border-[#0F4C5C]/30 bg-white px-3 py-2 text-sm font-semibold text-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Paste to Selected
                  </button>
                </div>

                <label className="mt-3 flex items-start gap-2 text-xs font-semibold leading-5 text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeRoomPinOnPaste}
                    onChange={(event) =>
                      setIncludeRoomPinOnPaste(event.target.checked)
                    }
                    className="mt-1"
                  />
                  Include room pin position
                </label>

                <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                  Copied from: {copiedCalibration?.sourceLabel ?? "None"}
                </p>
              </section>
            </div>
          )}

          {activePanelTab === "data" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-3 font-mono text-xs leading-6 text-slate-700">
                <p>Room: {formatCoordinate(selectedLocation)}</p>
                <p>Exit: {formatCoordinate(selectedLocation?.emergencyExit)}</p>
                <p>
                  Assembly:{" "}
                  {formatCoordinate(selectedLocation?.assemblyAreaPoint)}
                </p>
                <p>Route points: {selectedRoutePoints.length}</p>
                <p>Locations loaded: {mapData.locations.length}</p>
              </div>

              {status && (
                <p className="rounded-xl bg-[#ECFDF5] px-3 py-2 text-sm font-semibold text-[#0F4C5C]">
                  {status}
                </p>
              )}

              <button
                type="button"
                onClick={() => void exportJson()}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Export JSON
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0F4C5C]"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0F4C5C]"
        />
      )}
    </label>
  );
}

function ToolButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "bg-[#0F4C5C] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function LegendItem({
  swatch,
  label,
}: {
  swatch: "pin" | "exit" | "assembly" | "route";
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {swatch === "pin" && (
        <span className="h-4 w-4 rounded-full border-2 border-white bg-[#0F4C5C] shadow ring-2 ring-[#ffdf20]/70" />
      )}
      {swatch === "exit" && (
        <span className="h-4 w-4 rounded-[3px] border border-white bg-[#dc2626] shadow" />
      )}
      {swatch === "assembly" && (
        <span className="h-4 w-4 rounded-full border-2 border-white bg-[#facc15] shadow" />
      )}
      {swatch === "route" && (
        <span className="h-1 w-8 rounded-full bg-[#087EA4]" />
      )}
      <span className="text-xs font-semibold text-slate-600">{label}</span>
    </div>
  );
}
