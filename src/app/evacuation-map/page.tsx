"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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

type LockableScreenOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
  unlock?: () => void;
};

type MarkerType = "room" | "exit" | "assembly";

type EditorMode = "idle" | "room-pin" | "exit-pin" | "assembly-pin" | "route";

type LocationFormState = {
  label: string;
  description: string;
  recommendedExit: string;
  assemblyArea: string;
  instruction: string;
};

const emptyMapData: EvacuationMapData = {
  locations: [],
  emergencyExits: [],
  assemblyAreas: [],
};

const routesDataPath = "/data/evacuation-map-routes.json";

const legendItems = [
  { label: "You are here", sample: "pin" },
  { label: "Evacuation Route", sample: "route" },
  { label: "Emergency Exit", sample: "exit" },
  { label: "Assembly Area", sample: "assembly" },
] as const;

function getRoutePath(points: MapPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function formatCoordinate(point: MapPoint) {
  return `{ x: ${point.x.toFixed(1)}, y: ${point.y.toFixed(1)} }`;
}

function roundMapPoint(point: MapPoint) {
  return {
    x: Number(point.x.toFixed(1)),
    y: Number(point.y.toFixed(1)),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

function slugifyLocationName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLocationFormState(location?: EvacuationLocation | null) {
  return {
    label: location?.label ?? "",
    description: location?.description ?? "",
    recommendedExit: location?.recommendedExit ?? "",
    assemblyArea: location?.assemblyArea ?? "",
    instruction: location?.instruction ?? "",
  };
}

function updateLocation(
  data: EvacuationMapData,
  locationId: string,
  updater: (location: EvacuationLocation) => EvacuationLocation,
) {
  return {
    ...data,
    locations: data.locations.map((location) =>
      location.id === locationId ? updater(location) : location,
    ),
  };
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
  const [selectedId, setSelectedId] = useState("");
  const [editorSelectedId, setEditorSelectedId] = useState("");
  const [editorMode, setEditorMode] = useState<EditorMode>("idle");
  const [latestPoint, setLatestPoint] = useState<MapPoint | null>(null);
  const [editorStatus, setEditorStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCalibrationMode] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("calibrate") === "1",
  );
  const [isCalibrationPanelMinimized, setIsCalibrationPanelMinimized] =
    useState(false);
  const [isFullscreenMapOpen, setIsFullscreenMapOpen] = useState(false);
  const [selectedMarkerType, setSelectedMarkerType] =
    useState<MarkerType>("room");

  const selectedLocation =
    mapData.locations.find((location) => location.id === selectedId) ?? null;
  const editorLocation =
    mapData.locations.find((location) => location.id === editorSelectedId) ??
    null;
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
  const routePointMarkers =
    isCalibrationMode &&
    editorMode === "route" &&
    editorLocation?.id === selectedLocation?.id
    ? getValidRoutePoints(editorLocation?.routePoints)
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

      const firstLocation = data.locations[0];
      if (firstLocation) {
        setEditorSelectedId(firstLocation.id);
      }
    }

    void loadRoutes().catch(() => {
      if (isMounted) {
        setEditorStatus("Unable to load evacuation route data.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

  useEffect(() => {
    if (mapData.locations.length > 0) {
      return;
    }

    setSelectedId("");
    setEditorSelectedId("");
    setLatestPoint(null);
    setEditorMode("idle");
    setSelectedMarkerType("room");
  }, [mapData.locations.length]);

  function getClickedPoint(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    return roundMapPoint({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  function updateSelectedMarker(markerType: MarkerType, point: MapPoint) {
    if (!editorLocation) {
      return;
    }

    setMapData((currentData) =>
      updateLocation(currentData, editorLocation.id, (location) => {
        if (markerType === "room") {
          return {
            ...location,
            x: point.x,
            y: point.y,
          };
        }

        if (markerType === "exit") {
          return {
            ...location,
            emergencyExit: point,
          };
        }

        return {
          ...location,
          assemblyAreaPoint: point,
        };
      }),
    );
    setSelectedMarkerType(markerType);
    setLatestPoint(point);
  }

  function nudgeSelectedMarker(deltaX: number, deltaY: number) {
    if (!editorLocation) {
      return;
    }

    const currentPoint =
      selectedMarkerType === "room"
        ? { x: editorLocation.x, y: editorLocation.y }
        : selectedMarkerType === "exit"
          ? editorLocation.emergencyExit
          : editorLocation.assemblyAreaPoint;

    if (!currentPoint) {
      return;
    }

    updateSelectedMarker(
      selectedMarkerType,
      roundMapPoint({
        x: clamp(currentPoint.x + deltaX, 0, 100),
        y: clamp(currentPoint.y + deltaY, 0, 100),
      }),
    );
  }

  function handleMarkerPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    markerType: MarkerType,
  ) {
    if (!isCalibrationMode || !editorLocation) {
      return;
    }

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedMarkerType(markerType);
  }

  function handleMarkerPointerMove(
    event: PointerEvent<HTMLButtonElement>,
    markerType: MarkerType,
  ) {
    if (
      !isCalibrationMode ||
      !editorLocation ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      return;
    }

    const mapContainer = event.currentTarget.parentElement;

    if (!mapContainer) {
      return;
    }

    const rect = mapContainer.getBoundingClientRect();
    const point = roundMapPoint({
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
    });

    updateSelectedMarker(markerType, point);
  }

  function handleMapEditorClick(event: MouseEvent<HTMLDivElement>) {
    if (!isCalibrationMode || !editorLocation || editorMode === "idle") {
      return;
    }

    const point = getClickedPoint(event);
    setLatestPoint(point);
    setSelectedId(editorLocation.id);

    if (editorMode === "room-pin") {
      updateSelectedMarker("room", point);
      setEditorMode("idle");
      setEditorStatus(`Room pin updated for ${editorLocation.label}.`);
      return;
    }

    if (editorMode === "exit-pin") {
      updateSelectedMarker("exit", point);
      setEditorMode("idle");
      setEditorStatus(`Emergency exit pin updated for ${editorLocation.label}.`);
      return;
    }

    if (editorMode === "assembly-pin") {
      updateSelectedMarker("assembly", point);
      setEditorMode("idle");
      setEditorStatus(`Assembly area pin updated for ${editorLocation.label}.`);
      return;
    }

    setMapData((currentData) =>
      updateLocation(currentData, editorLocation.id, (location) => ({
        ...location,
        routePoints: [...location.routePoints, point],
      })),
    );
    setEditorStatus(`Added route point ${formatCoordinate(point)}.`);
  }

  async function copyText(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setEditorStatus(`Copied ${label}.`);
  }

  async function persistMapData(nextData: EvacuationMapData, savingMessage: string) {
    setIsSaving(true);
    setEditorStatus(savingMessage);

    try {
      const response = await fetch("/api/evacuation-map/save-routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextData),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save evacuation routes.");
      }

      setEditorStatus(result.message ?? "Evacuation routes saved.");
      return true;
    } catch (error) {
      setEditorStatus(
        error instanceof Error
          ? error.message
          : "Unable to save evacuation routes.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function saveRoutes() {
    await persistMapData(mapData, "Saving evacuation route data...");
  }

  async function addLocation(form: LocationFormState) {
    const label = form.label.trim();
    const id = slugifyLocationName(label);

    if (!label) {
      return "Location Name / Room Name is required.";
    }

    if (!id) {
      return "Use at least one letter or number in the location name.";
    }

    if (mapData.locations.some((location) => location.id === id)) {
      return "A location with this name already exists.";
    }

    const newLocation: EvacuationLocation = {
      id,
      label,
      description: form.description.trim(),
      x: 50,
      y: 50,
      recommendedExit: form.recommendedExit.trim(),
      assemblyArea: form.assemblyArea.trim(),
      emergencyExit: null,
      assemblyAreaPoint: null,
      routePoints: [],
      instruction: form.instruction.trim(),
    };
    const nextData = {
      ...mapData,
      locations: [...mapData.locations, newLocation],
    };

    setMapData(nextData);
    setSelectedId(id);
    setEditorSelectedId(id);
    setEditorMode("idle");
    setLatestPoint(null);
    await persistMapData(nextData, `Saving ${label}...`);
    return "";
  }

  async function editLocationDetails(form: LocationFormState) {
    if (!editorLocation) {
      return "Select a location to edit.";
    }

    const label = form.label.trim();
    const nextId = slugifyLocationName(label);

    if (!label) {
      return "Location Name / Room Name is required.";
    }

    if (!nextId) {
      return "Use at least one letter or number in the location name.";
    }

    if (
      mapData.locations.some(
        (location) => location.id === nextId && location.id !== editorLocation.id,
      )
    ) {
      return "A location with this name already exists.";
    }

    const nextData = {
      ...mapData,
      locations: mapData.locations.map((location) =>
        location.id === editorLocation.id
          ? {
              ...location,
              id: nextId,
              label,
              description: form.description.trim(),
              recommendedExit: form.recommendedExit.trim(),
              assemblyArea: form.assemblyArea.trim(),
              instruction: form.instruction.trim(),
            }
          : location,
      ),
    };

    setMapData(nextData);
    setSelectedId(nextId);
    setEditorSelectedId(nextId);
    await persistMapData(nextData, `Saving ${label}...`);
    return "";
  }

  async function deleteLocation() {
    if (!editorLocation) {
      return "Select a location to delete.";
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this location and its saved route?",
    );

    if (!shouldDelete) {
      return "";
    }

    const nextLocations = mapData.locations.filter(
      (location) => location.id !== editorLocation.id,
    );
    const nextSelectedId = nextLocations[0]?.id ?? "";
    const nextData = {
      ...mapData,
      locations: nextLocations,
    };

    setMapData(nextData);
    setSelectedId(nextSelectedId);
    setEditorSelectedId(nextSelectedId);
    setEditorMode("idle");
    setLatestPoint(null);
    await persistMapData(nextData, `Deleting ${editorLocation.label}...`);
    return "";
  }

  function selectEditorLocation(locationId: string) {
    setEditorSelectedId(locationId);
    setSelectedId(locationId);
    setEditorMode("idle");
    setEditorStatus("");
  }

  function undoLastRoutePoint() {
    if (!editorLocation || editorLocation.routePoints.length === 0) {
      return;
    }

    setMapData((currentData) =>
      updateLocation(currentData, editorLocation.id, (location) => ({
        ...location,
        routePoints: location.routePoints.slice(0, -1),
      })),
    );
    setEditorStatus(`Removed last route point for ${editorLocation.label}.`);
  }

  function clearRoute() {
    if (!editorLocation) {
      return;
    }

    setMapData((currentData) =>
      updateLocation(currentData, editorLocation.id, (location) => ({
        ...location,
        routePoints: [],
      })),
    );
    setLatestPoint(null);
    setEditorStatus(`Cleared route for ${editorLocation.label}.`);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f8f5] px-5 py-24 text-[#1f2933]">
      <section
        className={`mx-auto ${isCalibrationMode ? "max-w-7xl" : "max-w-5xl"}`}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2f6f4e]">
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
              className="rounded-xl bg-[#0F4C5C] px-4 py-3 text-sm font-bold text-white outline-none hover:bg-[#146577] focus:ring-4 focus:ring-[#0F4C5C]/20 sm:px-5"
            >
              Open Fullscreen Map
            </button>
          </div>

          <div
            className={
              isCalibrationMode
                ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start"
                : ""
            }
          >
            <div
              onClick={handleMapEditorClick}
              className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${
                isCalibrationMode && editorMode !== "idle"
                  ? "cursor-crosshair"
                  : ""
              }`}
            >
              <img
                src="/images/drrm/school-map.png"
                alt="Tabunoc National High School Evacuation Map"
                className="block w-full rounded-2xl"
              />

              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full [--route-stroke:4px] md:[--route-stroke:5px]"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
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
                      style={{ strokeWidth: "var(--route-stroke)" }}
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                )}
              </svg>

              {selectedExitPoint && (
                <button
                  type="button"
                  aria-label="Selected emergency exit marker"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (isCalibrationMode) {
                      setSelectedMarkerType("exit");
                    }
                  }}
                  onPointerDown={(event) =>
                    handleMarkerPointerDown(event, "exit")
                  }
                  onPointerMove={(event) =>
                    handleMarkerPointerMove(event, "exit")
                  }
                  className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-white bg-[#dc2626] shadow outline-none ${
                    isCalibrationMode && selectedMarkerType === "exit"
                      ? "ring-4 ring-[#ffdf20]/80"
                      : ""
                  }`}
                  style={{
                    left: `${selectedExitPoint.x}%`,
                    top: `${selectedExitPoint.y}%`,
                  }}
                />
              )}

              {selectedAssemblyAreaPoint && (
                <button
                  type="button"
                  aria-label="Selected assembly area marker"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (isCalibrationMode) {
                      setSelectedMarkerType("assembly");
                    }
                  }}
                  onPointerDown={(event) =>
                    handleMarkerPointerDown(event, "assembly")
                  }
                  onPointerMove={(event) =>
                    handleMarkerPointerMove(event, "assembly")
                  }
                  className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#facc15] shadow outline-none ${
                    isCalibrationMode && selectedMarkerType === "assembly"
                      ? "ring-4 ring-[#0F4C5C]/50"
                      : ""
                  }`}
                  style={{
                    left: `${selectedAssemblyAreaPoint.x}%`,
                    top: `${selectedAssemblyAreaPoint.y}%`,
                  }}
                />
              )}

              {selectedLocationPoint && (
                  <button
                    type="button"
                    aria-label={`Select ${selectedLocationPoint.label}`}
                    aria-pressed="true"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(selectedLocationPoint.id);
                      if (isCalibrationMode) {
                        setEditorSelectedId(selectedLocationPoint.id);
                        setSelectedMarkerType("room");
                      }
                    }}
                    onPointerDown={(event) => {
                      if (selectedLocationPoint.id === editorLocation?.id) {
                        handleMarkerPointerDown(event, "room");
                      }
                    }}
                    onPointerMove={(event) => {
                      if (selectedLocationPoint.id === editorLocation?.id) {
                        handleMarkerPointerMove(event, "room");
                      }
                    }}
                    className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#0F4C5C] text-white shadow-lg outline-none focus:ring-4 focus:ring-[#0F4C5C]/25 sm:h-9 sm:w-9 ${
                      isCalibrationMode && selectedMarkerType === "room"
                        ? "ring-4 ring-[#ffdf20]/80"
                        : "ring-4 ring-[#ffdf20]/70"
                    }`}
                    style={{
                      left: `${selectedLocationPoint.x}%`,
                      top: `${selectedLocationPoint.y}%`,
                    }}
                    title={selectedLocationPoint.label}
                  >
                    <span className="h-3 w-3 rounded-full bg-current" />
                  </button>
              )}

              {routePointMarkers.map((point, index) => (
                <div
                  key={`${point.x}-${point.y}-${index}`}
                  aria-hidden="true"
                  className="absolute z-20 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-slate-950 text-[10px] font-bold leading-none text-white shadow"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  {index + 1}
                </div>
              ))}

              {selectedLocationPoint && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute z-10 -translate-x-1/2 translate-y-3 rounded-full border border-white bg-[#0F4C5C] px-2 py-1 text-[10px] font-bold text-white shadow-sm"
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

            {isCalibrationMode && (
              <CalibrationPanel
                data={mapData}
                editorLocation={editorLocation}
                editorMode={editorMode}
                editorSelectedId={editorSelectedId}
                editorStatus={editorStatus}
                isMinimized={isCalibrationPanelMinimized}
                isSaving={isSaving}
                latestPoint={latestPoint}
                onAddLocation={addLocation}
                onClearRoute={clearRoute}
                onCopy={copyText}
                onDeleteLocation={deleteLocation}
                onEditLocation={editLocationDetails}
                onNudgeSelectedMarker={nudgeSelectedMarker}
                onSave={saveRoutes}
                onSelectLocation={selectEditorLocation}
                onSetEditorMode={setEditorMode}
                onSetSelectedMarkerType={setSelectedMarkerType}
                onSetMinimized={setIsCalibrationPanelMinimized}
                onUndoLastPoint={undoLastRoutePoint}
                selectedMarkerType={selectedMarkerType}
              />
            )}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label
                htmlFor="current-location"
                className="text-sm font-semibold text-slate-700"
              >
                Select your current location
              </label>

              <select
                id="current-location"
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-[#2f6f4e] focus:ring-2 focus:ring-[#2f6f4e]/20"
              >
                <option value="">
                  {mapData.locations.length === 0
                    ? "No locations available. Add a location in calibration mode."
                    : "Choose location..."}
                </option>
                {mapData.locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 lg:max-w-[440px]">
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

        {selectedLocation && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6f4e]">
              Recommended Route
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {selectedLocation.label}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {selectedLocation.description}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold text-[#0F4C5C]">
                  Start
                </h3>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedLocation.label}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold text-[#0F4C5C]">
                  Exit
                </h3>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedLocation.recommendedExit}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#ECFDF5] p-5">
                <h3 className="text-sm font-bold text-[#0F4C5C]">
                  Destination
                </h3>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedLocation.assemblyArea}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 md:col-span-3">
                <h3 className="text-sm font-bold text-[#0F4C5C]">
                  Short Evacuation Instruction
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedLocation.instruction}
                </p>
              </div>
            </div>
          </div>
        )}

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
          editorLocation={editorLocation}
          editorMode={editorMode}
          isCalibrationMode={isCalibrationMode}
          routePointMarkers={routePointMarkers}
          selectedAssemblyAreaPoint={selectedAssemblyAreaPoint}
          selectedExitPoint={selectedExitPoint}
          selectedId={selectedId}
          selectedLocation={selectedLocation}
          selectedLocationPoint={selectedLocationPoint}
          selectedMarkerType={selectedMarkerType}
          selectedRoutePoints={selectedRoutePoints}
          onClose={handleCloseFullscreenMap}
          onMapEditorClick={handleMapEditorClick}
          onSelectLocation={(locationId) => {
            setSelectedId(locationId);
            if (isCalibrationMode) {
              setEditorSelectedId(locationId);
            }
          }}
          onSetSelectedMarkerType={setSelectedMarkerType}
          onUpdateSelectedMarker={updateSelectedMarker}
        />
      )}
      </main>
      <Footer />
    </>
  );
}

function FullscreenMapViewer({
  data,
  editorLocation,
  editorMode,
  isCalibrationMode,
  routePointMarkers,
  selectedAssemblyAreaPoint,
  selectedExitPoint,
  selectedId,
  selectedLocation,
  selectedLocationPoint,
  selectedMarkerType,
  selectedRoutePoints,
  onClose,
  onMapEditorClick,
  onSelectLocation,
  onSetSelectedMarkerType,
  onUpdateSelectedMarker,
}: {
  data: EvacuationMapData;
  editorLocation: EvacuationLocation | null;
  editorMode: EditorMode;
  isCalibrationMode: boolean;
  routePointMarkers: MapPoint[];
  selectedAssemblyAreaPoint: MapPoint | null;
  selectedExitPoint: MapPoint | null;
  selectedId: string;
  selectedLocation: EvacuationLocation | null;
  selectedLocationPoint: EvacuationLocation | null;
  selectedMarkerType: MarkerType;
  selectedRoutePoints: MapPoint[];
  onClose: () => void;
  onMapEditorClick: (event: MouseEvent<HTMLDivElement>) => void;
  onSelectLocation: (locationId: string) => void;
  onSetSelectedMarkerType: (markerType: MarkerType) => void;
  onUpdateSelectedMarker: (markerType: MarkerType, point: MapPoint) => void;
}) {
  const suppressClickRef = useRef(false);

  function renderRouteDetails() {
    return (
      <div className="grid gap-5">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Choose your location
          <select
            value={selectedId}
            onChange={(event) => onSelectLocation(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#0F4C5C]/15"
          >
            <option value="">
              {data.locations.length === 0
                ? "No locations available. Add a location in calibration mode."
                : "Choose location..."}
            </option>
            {data.locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.label}
              </option>
            ))}
          </select>
        </label>

        <section className="grid gap-3 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2f6f4e]">
            Selected Location
          </p>
          <h2 className="text-xl font-bold leading-tight text-slate-950">
            {selectedLocation?.label ?? "Select a location"}
          </h2>
          <p>
            {data.locations.length === 0
              ? "No locations available. Add a location in calibration mode."
              : selectedLocation?.description ??
                "Choose your current location to view the recommended route."}
          </p>

          {selectedLocation && (
            <dl className="grid gap-3 rounded-2xl bg-[#F8FAFC] p-4 text-sm">
              <div>
                <dt className="font-bold text-[#0F4C5C]">Start</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {selectedLocation.label}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[#0F4C5C]">Exit</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {selectedLocation.recommendedExit}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[#0F4C5C]">Destination</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {selectedLocation.assemblyArea}
                </dd>
              </div>
            </dl>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Short Evacuation Instruction
            </p>
            <p className="mt-2">
              {selectedLocation?.instruction ??
                "Choose your current location to view the recommended route."}
            </p>
          </div>

          {isCalibrationMode && editorLocation && editorMode !== "idle" && (
            <p className="rounded-2xl bg-[#ECFDF5] p-4 text-xs font-semibold text-[#0F4C5C]">
              Calibration: click the map to{" "}
              {editorMode === "room-pin"
                ? "set the room pin"
                : editorMode === "exit-pin"
                  ? "set the emergency exit pin"
                  : editorMode === "assembly-pin"
                    ? "set the assembly area pin"
                    : "add route points"}
              .
            </p>
          )}
        </section>

        <section className="grid gap-3 border-t border-slate-200 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2f6f4e]">
            Legend
          </p>
          <div className="grid gap-3 rounded-2xl bg-[#F8FAFC] p-4">
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

  function handleMapClick(event: MouseEvent<HTMLDivElement>) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    onMapEditorClick(event);
  }

  function handleFullscreenMarkerPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    markerType: MarkerType,
  ) {
    if (!isCalibrationMode || !editorLocation) {
      return;
    }

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    onSetSelectedMarkerType(markerType);
  }

  function handleFullscreenMarkerPointerMove(
    event: PointerEvent<HTMLButtonElement>,
    markerType: MarkerType,
  ) {
    if (
      !isCalibrationMode ||
      !editorLocation ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      return;
    }

    const mapContainer = event.currentTarget.parentElement;

    if (!mapContainer) {
      return;
    }

    const rect = mapContainer.getBoundingClientRect();
    onUpdateSelectedMarker(
      markerType,
      roundMapPoint({
        x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
        y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
      }),
    );
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-[#071E29] text-slate-950"
      role="dialog"
    >
      <div className="flex h-[100dvh] w-[100dvw] flex-row overflow-hidden">
        <div className="min-w-0 flex-1">
          <TransformWrapper
            centerOnInit
            centerZoomedOut
            limitToBounds
            smooth
            minScale={1}
            maxScale={5}
            wheel={{ disabled: false, step: 0.12 }}
            pinch={{ disabled: false, allowPanning: true, step: 6 }}
            panning={{
              disabled: false,
              velocityDisabled: false,
              excluded: ["button", "select", "input", "textarea"],
            }}
            doubleClick={{
              disabled: false,
              mode: "zoomIn",
              step: 0.7,
              animationTime: 160,
              excluded: ["button", "select", "input", "textarea"],
            }}
            velocityAnimation={{
              animationTime: 180,
              maxAnimationTime: 220,
            }}
            onInit={({ resetTransform }) => {
              requestAnimationFrame(() => {
                resetTransform(0);
              });
            }}
            onPanningStart={() => {
              suppressClickRef.current = true;
            }}
            onPanningStop={() => {
              window.setTimeout(() => {
                suppressClickRef.current = false;
              }, 100);
            }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <div className="relative h-full w-full overflow-hidden bg-[#f7f8f5]">
                <TransformComponent
                  wrapperClass="!h-full !w-full overflow-hidden cursor-grab touch-none active:cursor-grabbing"
                  contentClass="!h-full !w-fit"
                >
              <div
                onClick={handleMapClick}
                className={`relative aspect-[26247/18508] h-full w-auto max-w-none select-none overflow-hidden bg-white shadow-sm ${
                  isCalibrationMode && editorMode !== "idle"
                    ? "cursor-crosshair"
                    : ""
                }`}
                draggable={false}
              >
                <img
                  alt="Tabunoc National High School Evacuation Map"
                  className="block h-full w-full max-w-none select-none object-contain"
                  draggable={false}
                  src="/images/drrm/school-map.png"
                />

                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full [--route-stroke:4px] md:[--route-stroke:5px]"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
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
                        style={{ strokeWidth: "var(--route-stroke)" }}
                        vectorEffect="non-scaling-stroke"
                      />
                    </>
                  )}
                </svg>

            {selectedExitPoint && (
              <button
                type="button"
                aria-label="Selected emergency exit marker"
                onClick={(event) => {
                  event.stopPropagation();
                  if (isCalibrationMode) {
                    onSetSelectedMarkerType("exit");
                  }
                }}
                onPointerDown={(event) =>
                  handleFullscreenMarkerPointerDown(event, "exit")
                }
                onPointerMove={(event) =>
                  handleFullscreenMarkerPointerMove(event, "exit")
                }
                className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-white bg-[#dc2626] shadow outline-none ${
                  isCalibrationMode && selectedMarkerType === "exit"
                    ? "ring-4 ring-[#ffdf20]/80"
                    : ""
                }`}
                style={{
                  left: `${selectedExitPoint.x}%`,
                  top: `${selectedExitPoint.y}%`,
                }}
              />
            )}

            {selectedAssemblyAreaPoint && (
              <button
                type="button"
                aria-label="Selected assembly area marker"
                onClick={(event) => {
                  event.stopPropagation();
                  if (isCalibrationMode) {
                    onSetSelectedMarkerType("assembly");
                  }
                }}
                onPointerDown={(event) =>
                  handleFullscreenMarkerPointerDown(event, "assembly")
                }
                onPointerMove={(event) =>
                  handleFullscreenMarkerPointerMove(event, "assembly")
                }
                className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#facc15] shadow outline-none ${
                  isCalibrationMode && selectedMarkerType === "assembly"
                    ? "ring-4 ring-[#0F4C5C]/50"
                    : ""
                }`}
                style={{
                  left: `${selectedAssemblyAreaPoint.x}%`,
                  top: `${selectedAssemblyAreaPoint.y}%`,
                }}
              />
            )}

            {selectedLocationPoint && (
                <button
                  type="button"
                  aria-label={`Select ${selectedLocationPoint.label}`}
                  aria-pressed="true"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectLocation(selectedLocationPoint.id);
                    if (isCalibrationMode) {
                      onSetSelectedMarkerType("room");
                    }
                  }}
                  onPointerDown={(event) => {
                    if (selectedLocationPoint.id === editorLocation?.id) {
                      handleFullscreenMarkerPointerDown(event, "room");
                    }
                  }}
                  onPointerMove={(event) => {
                    if (selectedLocationPoint.id === editorLocation?.id) {
                      handleFullscreenMarkerPointerMove(event, "room");
                    }
                  }}
                  className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#0F4C5C] text-white shadow-lg outline-none focus:ring-4 focus:ring-[#0F4C5C]/25 sm:h-9 sm:w-9 ${
                    isCalibrationMode && selectedMarkerType === "room"
                      ? "ring-4 ring-[#ffdf20]/80"
                      : "ring-4 ring-[#ffdf20]/70"
                  }`}
                  style={{
                    left: `${selectedLocationPoint.x}%`,
                    top: `${selectedLocationPoint.y}%`,
                  }}
                  title={selectedLocationPoint.label}
                >
                  <span className="h-3 w-3 rounded-full bg-current" />
                </button>
            )}

            {routePointMarkers.map((point, index) => (
              <div
                key={`${point.x}-${point.y}-fullscreen-${index}`}
                aria-hidden="true"
                className="absolute z-20 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-slate-950 text-[10px] font-bold leading-none text-white shadow"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                {index + 1}
              </div>
            ))}

            {selectedLocationPoint && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute z-10 -translate-x-1/2 translate-y-3 rounded-full border border-white bg-[#0F4C5C] px-2 py-1 text-[10px] font-bold text-white shadow-sm"
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
                onClick={() => zoomIn(0.35, 160)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-slate-950 shadow-lg outline-none focus:ring-4 focus:ring-[#0F4C5C]/20"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => zoomOut(0.35, 160)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-slate-950 shadow-lg outline-none focus:ring-4 focus:ring-[#0F4C5C]/20"
              >
                -
              </button>
              <button
                type="button"
                aria-label="Reset map view"
                onClick={() => resetTransform(180)}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-lg outline-none focus:ring-4 focus:ring-[#0F4C5C]/20"
              >
                Reset
              </button>
            </div>
              </div>
            )}
          </TransformWrapper>
        </div>

        <aside
          className="w-[36vw] min-w-[240px] max-w-[340px] overflow-y-auto border-l border-white/10 bg-white p-5 text-[#24313E]"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2f6f4e]">
                Route Details
              </p>
              <h2 className="mt-2 text-lg font-bold leading-tight text-slate-950">
                Evacuation Map
              </h2>
            </div>
            <button
              type="button"
              aria-label="Exit fullscreen evacuation map"
              onClick={onClose}
              className="min-h-11 shrink-0 rounded-xl bg-[#0F4C5C] px-4 py-2 text-xs font-bold text-white outline-none focus:ring-4 focus:ring-[#0F4C5C]/20"
            >
              Close
            </button>
          </div>

          {renderRouteDetails()}
        </aside>
      </div>
    </div>
  );
}

function CalibrationPanel({
  data,
  editorLocation,
  editorMode,
  editorSelectedId,
  editorStatus,
  isMinimized,
  isSaving,
  latestPoint,
  onAddLocation,
  onClearRoute,
  onCopy,
  onDeleteLocation,
  onEditLocation,
  onNudgeSelectedMarker,
  onSave,
  onSelectLocation,
  onSetEditorMode,
  onSetSelectedMarkerType,
  onSetMinimized,
  onUndoLastPoint,
  selectedMarkerType,
}: {
  data: EvacuationMapData;
  editorLocation: EvacuationLocation | null;
  editorMode: EditorMode;
  editorSelectedId: string;
  editorStatus: string;
  isMinimized: boolean;
  isSaving: boolean;
  latestPoint: MapPoint | null;
  onAddLocation: (form: LocationFormState) => Promise<string>;
  onClearRoute: () => void;
  onCopy: (text: string, label: string) => Promise<void>;
  onDeleteLocation: () => Promise<string>;
  onEditLocation: (form: LocationFormState) => Promise<string>;
  onNudgeSelectedMarker: (deltaX: number, deltaY: number) => void;
  onSave: () => Promise<void>;
  onSelectLocation: (locationId: string) => void;
  onSetEditorMode: (mode: EditorMode) => void;
  onSetSelectedMarkerType: (markerType: MarkerType) => void;
  onSetMinimized: (value: boolean) => void;
  onUndoLastPoint: () => void;
  selectedMarkerType: MarkerType;
}) {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState<LocationFormState>(
    getLocationFormState(),
  );
  const [locationFormError, setLocationFormError] = useState("");

  function updateLocationForm(field: keyof LocationFormState, value: string) {
    setLocationForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSaveNewLocation() {
    const error = await onAddLocation(locationForm);

    if (error) {
      setLocationFormError(error);
      return;
    }

    setLocationForm(getLocationFormState());
    setLocationFormError("");
    setIsAddingLocation(false);
  }

  async function handleSaveEditedLocation() {
    const error = await onEditLocation(locationForm);

    if (error) {
      setLocationFormError(error);
      return;
    }

    setLocationFormError("");
    setIsEditingLocation(false);
  }

  function handleSelectLocation(locationId: string) {
    const nextLocation =
      data.locations.find((location) => location.id === locationId) ?? null;

    onSelectLocation(locationId);

    if (isEditingLocation) {
      setLocationForm(getLocationFormState(nextLocation));
      setLocationFormError("");
    }
  }

  async function handleDeleteLocation() {
    const error = await onDeleteLocation();

    if (error) {
      setLocationFormError(error);
    }
  }

  const activeModeMessage =
    editorMode === "room-pin"
      ? "Click the room/location on the map."
      : editorMode === "exit-pin"
        ? "Click the emergency exit location on the map."
        : editorMode === "assembly-pin"
          ? "Click the assembly area location on the map."
          : editorMode === "route"
            ? "Click route points on the map in order."
            : "Select a pinning or route editing mode.";

  if (isMinimized) {
    return (
      <div className="lg:sticky lg:top-24">
        <button
          type="button"
          onClick={() => onSetMinimized(false)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#0F4C5C] shadow-sm outline-none hover:bg-[#ECFDF5] focus:ring-4 focus:ring-[#0F4C5C]/20"
        >
          Show calibration panel
        </button>
      </div>
    );
  }

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0F4C5C]">
            Map Calibration Mode
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Save Route works only on localhost/development. After saving, run
            build, commit, and push to publish the updated evacuation routes.
          </p>
          <p className="mt-2 rounded-xl bg-[#ECFDF5] px-3 py-2 text-xs font-semibold text-[#0F4C5C]">
            Workflow: Select or add a location, set the room pin, set the
            emergency exit pin, set the assembly area pin, edit the route
            points, then save.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-900">
          ?calibrate=1
        </span>
      </div>

      <label
        htmlFor="calibration-location"
        className="mt-4 block text-xs font-bold text-slate-700"
      >
        Location
      </label>
      <select
        id="calibration-location"
        value={editorSelectedId}
        onChange={(event) => handleSelectLocation(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#0F4C5C]/15"
      >
        {data.locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.label}
          </option>
        ))}
      </select>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900">
            Location Management
          </h3>
          <button
            type="button"
            onClick={() => {
              setIsAddingLocation((isOpen) => !isOpen);
              setIsEditingLocation(false);
              setLocationForm(getLocationFormState());
              setLocationFormError("");
            }}
            className="rounded-lg bg-[#0F4C5C] px-3 py-2 text-xs font-bold text-white outline-none focus:ring-4 focus:ring-[#0F4C5C]/20"
          >
            Add New Location
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!editorLocation}
            onClick={() => {
              setIsEditingLocation((isOpen) => !isOpen);
              setIsAddingLocation(false);
              setLocationForm(getLocationFormState(editorLocation));
              setLocationFormError("");
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-300/60"
          >
            Edit Location Details
          </button>
          <button
            type="button"
            disabled={!editorLocation || isSaving}
            onClick={() => void handleDeleteLocation()}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-red-200"
          >
            Delete Location
          </button>
        </div>

        {(isAddingLocation || isEditingLocation) && (
          <LocationDetailsForm
            form={locationForm}
            isSaving={isSaving}
            submitLabel={
              isAddingLocation ? "Save New Location" : "Save Location Details"
            }
            onCancel={() => {
              setIsAddingLocation(false);
              setIsEditingLocation(false);
              setLocationFormError("");
            }}
            onChange={updateLocationForm}
            onSubmit={() =>
              void (isAddingLocation
                ? handleSaveNewLocation()
                : handleSaveEditedLocation())
            }
          />
        )}

        {locationFormError && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            {locationFormError}
          </p>
        )}
      </section>

      <div className="mt-3 rounded-xl bg-slate-100 px-3 py-2 font-mono text-xs text-slate-800">
        {latestPoint ? formatCoordinate(latestPoint) : "No point selected"}
      </div>

      {editorLocation && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-700">
          <p className="font-semibold text-[#0F4C5C]">{activeModeMessage}</p>
          <p className="mt-2">
            Room Pin:{" "}
            {formatCoordinate({ x: editorLocation.x, y: editorLocation.y })}
          </p>
          <p className="mt-1">
            Emergency Exit:{" "}
            {editorLocation.emergencyExit
              ? formatCoordinate(editorLocation.emergencyExit)
              : "Not set"}
          </p>
          <p className="mt-1">
            Assembly Area:{" "}
            {editorLocation.assemblyAreaPoint
              ? formatCoordinate(editorLocation.assemblyAreaPoint)
              : "Not set"}
          </p>
          <p className="mt-1">Route points: {editorLocation.routePoints.length}</p>
          <p className="mt-1 font-semibold text-[#0F4C5C]">
            Selected marker: {selectedMarkerType}
          </p>
        </div>
      )}

      <div className="mt-3 grid gap-2">
        <div className="grid gap-2">
          <button
            type="button"
            disabled={!editorLocation}
            onClick={() => {
              onSetSelectedMarkerType("room");
              onSetEditorMode("room-pin");
            }}
            className="rounded-lg bg-[#0F4C5C] px-3 py-2 text-xs font-bold text-white outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-[#0F4C5C]/20"
          >
            Set Room Pin
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!editorLocation}
              onClick={() => {
                onSetSelectedMarkerType("exit");
                onSetEditorMode("exit-pin");
              }}
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-red-200"
            >
              Set Emergency Exit Pin
            </button>
            <button
              type="button"
              disabled={!editorLocation}
              onClick={() => {
                onSetSelectedMarkerType("assembly");
                onSetEditorMode("assembly-pin");
              }}
              className="rounded-lg border border-yellow-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-yellow-200"
            >
              Set Assembly Area Pin
            </button>
          </div>
        </div>
        <button
          type="button"
          disabled={!editorLocation}
          onClick={() => onSetEditorMode("route")}
          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-400/40"
        >
          Edit Route
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!editorLocation || editorLocation.routePoints.length === 0}
            onClick={onUndoLastPoint}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-300/60"
          >
            Undo Last Point
          </button>
          <button
            type="button"
            disabled={!editorLocation || editorLocation.routePoints.length === 0}
            onClick={onClearRoute}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-300/60"
          >
          Clear Route
          </button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-bold text-slate-700">
            Fine adjustment ({selectedMarkerType})
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <span />
            <button
              type="button"
              disabled={!editorLocation}
              onClick={() => onNudgeSelectedMarker(0, -0.1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-300/60"
            >
              Up
            </button>
            <span />
            <button
              type="button"
              disabled={!editorLocation}
              onClick={() => onNudgeSelectedMarker(-0.1, 0)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-300/60"
            >
              Left
            </button>
            <button
              type="button"
              disabled={!editorLocation}
              onClick={() => onNudgeSelectedMarker(0, 0.1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-300/60"
            >
              Down
            </button>
            <button
              type="button"
              disabled={!editorLocation}
              onClick={() => onNudgeSelectedMarker(0.1, 0)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-300/60"
            >
              Right
            </button>
          </div>
        </div>
        <button
          type="button"
          disabled={isSaving || data.locations.length === 0}
          onClick={() => void onSave()}
          className="rounded-lg bg-[#2f6f4e] px-3 py-2 text-xs font-bold text-white outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-[#2f6f4e]/20"
        >
          {isSaving ? "Saving..." : "Save Route"}
        </button>
        <button
          type="button"
          disabled={data.locations.length === 0}
          onClick={() => void onCopy(JSON.stringify(data, null, 2), "JSON")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-300/60"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => onSetMinimized(true)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none hover:bg-slate-50 focus:ring-4 focus:ring-slate-300/60"
        >
          Minimize calibration panel
        </button>
      </div>

      {editorStatus && (
        <p className="mt-3 rounded-xl bg-[#ECFDF5] px-3 py-2 text-xs font-semibold text-[#0F4C5C]">
          {editorStatus}
        </p>
      )}

      {editorLocation && editorLocation.routePoints.length > 0 && (
        <ol className="mt-3 max-h-52 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 font-mono text-xs text-slate-700">
          {editorLocation.routePoints.map((point, index) => (
            <li key={`${point.x}-${point.y}-list-${index}`}>
              {index + 1}. {formatCoordinate(point)}
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

function LocationDetailsForm({
  form,
  isSaving,
  submitLabel,
  onCancel,
  onChange,
  onSubmit,
}: {
  form: LocationFormState;
  isSaving: boolean;
  submitLabel: string;
  onCancel: () => void;
  onChange: (field: keyof LocationFormState, value: string) => void;
  onSubmit: () => void;
}) {
  const fields: {
    id: keyof LocationFormState;
    label: string;
    required?: boolean;
    multiline?: boolean;
  }[] = [
    { id: "label", label: "Location Name / Room Name", required: true },
    { id: "description", label: "Description", multiline: true },
    { id: "recommendedExit", label: "Recommended Exit" },
    { id: "assemblyArea", label: "Assembly Area" },
    { id: "instruction", label: "Instruction", multiline: true },
  ];

  return (
    <div className="mt-3 grid gap-3 rounded-xl border border-slate-200 bg-white p-3">
      {fields.map((field) => (
        <label key={field.id} className="grid gap-1 text-xs font-bold text-slate-700">
          {field.label}
          {field.multiline ? (
            <textarea
              value={form[field.id]}
              onChange={(event) => onChange(field.id, event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#0F4C5C]/15"
            />
          ) : (
            <input
              value={form[field.id]}
              onChange={(event) => onChange(field.id, event.target.value)}
              required={field.required}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#0F4C5C]/15"
            />
          )}
        </label>
      ))}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={onSubmit}
          className="rounded-lg bg-[#2f6f4e] px-3 py-2 text-xs font-bold text-white outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-[#2f6f4e]/20"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-slate-300/60"
        >
          Cancel
        </button>
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
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F4C5C] text-white">
      <span className="h-2 w-2 rounded-full bg-current" />
    </span>
  );
}
