// =============================================================================
// FaroesMap — expedition-grade interactive MapLibre GL map.
//
// Custom North Atlantic palette, dual-stroke itinerary routes with semantic
// dash patterns, 32px expedition waypoint markers with amber fill and cream
// halo, custom unified controls, itinerary-geometry camera fitting.
// =============================================================================

"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type RefObject,
} from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { JOURNEY_STOPS, ALL_PLACES, FAROE_MAX_BOUNDS, type TripPlace } from "@/lib/data/faroes-places";
import { JOURNEY_LEGS, type JourneyLeg } from "@/lib/data/faroes-journey-legs";

// ---------------------------------------------------------------------------
// North Atlantic expedition palette
// ---------------------------------------------------------------------------
const P = {
  ocean:       "#263b43",
  oceanShallow:"#36525a",
  landLow:     "#8d9a88",
  landHigh:    "#697567",
  rock:        "#59615b",
  contour:     "rgba(40,50,46,0.20)",
  road:        "rgba(243,239,224,0.72)",
  path:        "rgba(224,188,111,0.78)",
  route:       "#d69a32",
  routeDark:   "#352f28",
  text:        "#f6f2e7",
  panel:       "rgba(24,31,32,0.88)",
  amber:       "#d69a32",
  cream:       "#F2EFE7",
  basalt:      "#283035",
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type SelectedFeature =
  | { kind: "place"; place: TripPlace }
  | { kind: "leg"; leg: JourneyLeg }
  | null;

export type MapFilter = "journey" | "places" | "match" | "stay" | "suðuroy";

interface FaroesMapProps {
  onSelect: (feature: SelectedFeature) => void;
  selected: SelectedFeature;
  filter: MapFilter;
  mapRef: RefObject<maplibregl.Map | null>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAP_STYLE =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/liberty";

const SOURCE_PLACES = "faroes-places";
const SOURCE_LEGS = "faroes-legs";
const SOURCE_LEGS_CASING = "faroes-legs-casing";

// Route casing (dark outer stroke)
const LAYER_LEG_CASING = "faroes-leg-casing";
// Route inner line (amber)
const LAYER_LEG_LINES = "faroes-leg-lines";
const LAYER_LEG_LINES_SEL = "faroes-leg-lines-selected";

// Place markers
const LAYER_PLACE_HALO = "faroes-place-halo";
const LAYER_PLACE_CIRCLES = "faroes-place-circles";
const LAYER_PLACE_CIRCLES_SEL = "faroes-place-circles-selected";
const LAYER_PLACE_NUMBERS = "faroes-place-numbers";
const LAYER_PLACE_LABELS = "faroes-place-labels";

// ---------------------------------------------------------------------------
// Itinerary boundary — computed from ALL_PLACES coordinates
// ---------------------------------------------------------------------------
function itineraryBounds(): [[number, number], [number, number]] {
  const coords = ALL_PLACES.map((p) => p.coordinates);
  const lons = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const pad = 0.06;
  return [
    [Math.min(...lons) - pad, Math.min(...lats) - pad],
    [Math.max(...lons) + pad, Math.max(...lats) + pad],
  ];
}

// ---------------------------------------------------------------------------
// Merge overlapping Tórshavn markers — show one marker for co-located stops
// ---------------------------------------------------------------------------
function mergeOverlapping(places: TripPlace[]): TripPlace[] {
  const result: TripPlace[] = [];
  const used = new Set<string>();

  for (const p of places) {
    if (p.id === "torshavn-ferry") continue; // merged into torshavn
    if (p.id === "torshavn") {
      // Merge Tórshavn + Ferry Terminal into one marker
      result.push({
        ...p,
        displayName: "Tórshavn · Bus + Ferry",
        description: "Bus 300 terminates here (~19:45). Ferry terminal (Farstøðin) is a short walk from the bus station. M/F Smyril departs at 21:15 for Suðuroy.",
        practicalNote: "1h 30m between bus arrival and ferry departure. Grab food near the harbour. Gate closes 5 min before sailing.",
        service: "Bus 300 · M/F Smyril",
      });
      used.add("torshavn");
      used.add("torshavn-ferry");
    } else {
      result.push(p);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// GeoJSON helpers
// ---------------------------------------------------------------------------
function placesToGeoJSON(places: TripPlace[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: mergeOverlapping(places).map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: p.coordinates },
      properties: {
        id: p.id,
        name: p.name,
        category: p.category,
        routeSequence: p.routeSequence ?? null,
        status: p.status ?? null,
      },
    })),
  };
}

function legsToGeoJSON(legs: JourneyLeg[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: legs.map((l) => ({
      type: "Feature" as const,
      geometry: l.geometry,
      properties: {
        id: l.id,
        mode: l.mode,
        status: l.status ?? null,
        fromPlaceId: l.fromPlaceId,
        toPlaceId: l.toPlaceId,
        service: l.service ?? "",
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Motion helpers
// ---------------------------------------------------------------------------
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function moveTo(map: maplibregl.Map, center: [number, number], zoom: number) {
  if (prefersReducedMotion()) {
    map.jumpTo({ center, zoom });
  } else {
    map.flyTo({ center, zoom, duration: 800 });
  }
}

function fitBoundsAnimated(map: maplibregl.Map, bounds: [[number, number], [number, number]], padding: number) {
  if (prefersReducedMotion()) {
    map.fitBounds(bounds, { padding, animate: false });
  } else {
    map.fitBounds(bounds, { padding, duration: 800 });
  }
}

function dashFor(mode: string): number[] {
  switch (mode) {
    case "ferry": return [8, 4];
    case "walk":  return [3, 3];
    case "bus":   return [1, 0]; // solid
    default:      return [1, 0];
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function FaroesMap({
  onSelect,
  selected,
  filter,
  mapRef,
}: FaroesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  const onSelectRef = useRef(onSelect);
  useEffect(() => { onSelectRef.current = onSelect; });

  const placeById = useCallback(
    (id: string) => ALL_PLACES.find((p) => p.id === id) ?? null, [],
  );
  const legById = useCallback(
    (id: string) => JOURNEY_LEGS.find((l) => l.id === id) ?? null, [],
  );

  // ---- Visible places by filter ----
  const getVisiblePlaces = useCallback((f: MapFilter): TripPlace[] => {
    switch (f) {
      case "journey": return JOURNEY_STOPS;
      case "places":  return ALL_PLACES;
      case "match":   return ALL_PLACES.filter((p) =>
        p.id === "torsvollur" || p.id === "torshavn" || p.id === "torshavn-ferry");
      case "stay":    return ALL_PLACES.filter((p) =>
        p.id === "oravik" || p.id === "krambatangi");
      case "suðuroy": return ALL_PLACES.filter((p) =>
        p.id === "oravik" || p.id === "krambatangi" || p.id === "hov" ||
        p.id === "hvannhagi" || p.id === "beinisvord" || p.id === "tvoroyri" ||
        p.id === "akraberg");
      default: return JOURNEY_STOPS;
    }
  }, []);

  // ---- Fit trip — fit camera to visible itinerary places ----
  const fitTrip = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const places = getVisiblePlaces(filter);
    if (places.length === 0) return;
    const coords = places.map((p) => p.coordinates);
    const lons = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);
    const pad = 0.03;
    const sw: [number, number] = [Math.min(...lons) - pad, Math.min(...lats) - pad];
    const ne: [number, number] = [Math.max(...lons) + pad, Math.max(...lats) + pad];
    fitBoundsAnimated(map, [sw, ne], 70);
  }, [mapRef, filter, getVisiblePlaces]);

  // ---- Filter → viewport ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (filter === "match") {
      const venue = ALL_PLACES.find((p) => p.id === "torsvollur");
      if (venue) {
        fitBoundsAnimated(map, [
          [venue.coordinates[0] - 0.02, venue.coordinates[1] - 0.01],
          [venue.coordinates[0] + 0.02, venue.coordinates[1] + 0.02],
        ], 40);
      }
    } else if (filter === "stay") {
      fitBoundsAnimated(map, [[-6.84, 61.52], [-6.78, 61.56]], 40);
    } else if (filter === "suðuroy") {
      fitBoundsAnimated(map, [[-6.84, 61.38], [-6.76, 61.57]], 60);
    } else {
      fitBoundsAnimated(map, itineraryBounds(), 70);
    }
  }, [filter, mapRef]);

  // ---- Map init ----
  useEffect(() => {
    if (initRef.current || !containerRef.current) return;
    initRef.current = true;

    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        bounds: itineraryBounds(),
        maxBounds: FAROE_MAX_BOUNDS,
        minZoom: 7,
        maxZoom: 15,
        bearing: 0,
        pitch: 0,
        dragRotate: false,
        touchPitch: false,
        renderWorldCopies: false,
        cooperativeGestures: true,
        attributionControl: { compact: true },
      });

      mapRef.current = map;

      map.on("load", () => {
        // Add sources
        map.addSource(SOURCE_PLACES, {
          type: "geojson",
          data: placesToGeoJSON(getVisiblePlaces(filter)),
        });
        map.addSource(SOURCE_LEGS, {
          type: "geojson",
          data: legsToGeoJSON(JOURNEY_LEGS),
        });

        // 3D terrain
        map.addSource("terrain-dem", {
          type: "raster-dem",
          url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
          tileSize: 256,
        });
        map.setTerrain({ source: "terrain-dem", exaggeration: 1.25 });

        // ---- Route CASING (dark outer stroke, wider) ----
        map.addLayer({
          id: LAYER_LEG_CASING,
          type: "line",
          source: SOURCE_LEGS,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": P.routeDark,
            "line-width": 6,
            "line-opacity": 0.55,
            "line-dasharray": ["match", ["get", "mode"],
              "ferry", ["literal", [8, 4]],
              "walk", ["literal", [3, 3]],
              ["literal", [1, 0]],
            ],
          },
        });;

        // ---- Route INNER LINE (amber, narrower) ----
        map.addLayer({
          id: LAYER_LEG_LINES,
          type: "line",
          source: SOURCE_LEGS,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": P.route,
            "line-width": 3,
            "line-opacity": 0.9,
            "line-dasharray": ["match", ["get", "mode"],
              "ferry", ["literal", [8, 4]],
              "walk", ["literal", [3, 3]],
              ["literal", [1, 0]],
            ],
          },
        });

        // ---- Selected leg highlight ----
        map.addLayer({
          id: LAYER_LEG_LINES_SEL,
          type: "line",
          source: SOURCE_LEGS,
          filter: ["==", ["get", "id"], ""],
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": P.amber,
            "line-width": 4,
            "line-opacity": 1,
          },
        });

        // ---- Place marker HALO (cream, larger) ----
        map.addLayer({
          id: LAYER_PLACE_HALO,
          type: "circle",
          source: SOURCE_PLACES,
          paint: {
            "circle-radius": 18,
            "circle-color": P.cream,
            "circle-opacity": 0.85,
            "circle-stroke-color": "transparent",
            "circle-stroke-width": 0,
          },
        });

        // ---- Place marker (amber fill, dark border) ----
        map.addLayer({
          id: LAYER_PLACE_CIRCLES,
          type: "circle",
          source: SOURCE_PLACES,
          paint: {
            "circle-radius": ["case", ["has", "routeSequence"], 16, 11],
            "circle-color": P.amber,
            "circle-stroke-color": P.basalt,
            "circle-stroke-width": 2,
            "circle-opacity": 1,
          },
        });

        // ---- Selected marker (larger, halo) ----
        map.addLayer({
          id: LAYER_PLACE_CIRCLES_SEL,
          type: "circle",
          source: SOURCE_PLACES,
          filter: ["==", ["get", "id"], ""],
          paint: {
            "circle-radius": 24,
            "circle-color": P.amber,
            "circle-stroke-color": P.cream,
            "circle-stroke-width": 3,
            "circle-opacity": 1,
          },
        });

        // ---- Place numbers (on top of everything) ----
        map.addLayer({
          id: LAYER_PLACE_NUMBERS,
          type: "symbol",
          source: SOURCE_PLACES,
          filter: ["has", "routeSequence"],
          layout: {
            "text-field": ["to-string", ["get", "routeSequence"]],
            "text-font": ["Noto Sans Bold"],
            "text-size": 12,
            "text-offset": [0, 0],
          },
          paint: {
            "text-color": P.basalt,
          },
        });

        // ---- Place name labels ----
        map.addLayer({
          id: LAYER_PLACE_LABELS,
          type: "symbol",
          source: SOURCE_PLACES,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Noto Sans Regular"],
            "text-size": 11,
            "text-offset": [0, 1.8],
            "text-anchor": "top",
            "text-optional": true,
          },
          paint: {
            "text-color": P.text,
            "text-halo-color": P.basalt,
            "text-halo-width": 1.5,
          },
          minzoom: 9,
        });

        // Click handlers
        map.on("click", LAYER_PLACE_CIRCLES, (e) => {
          if (!e.features?.[0]) return;
          const props = e.features[0].properties;
          const place = placeById(props.id);
          if (place) onSelectRef.current({ kind: "place", place });
        });

        map.on("click", LAYER_LEG_LINES, (e) => {
          if (!e.features?.[0]) return;
          const props = e.features[0].properties;
          const leg = legById(props.id);
          if (leg) onSelectRef.current({ kind: "leg", leg });
        });

        // Cursors
        map.on("mouseenter", LAYER_PLACE_CIRCLES, () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", LAYER_PLACE_CIRCLES, () => { map.getCanvas().style.cursor = ""; });
        map.on("mouseenter", LAYER_LEG_LINES, () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", LAYER_LEG_LINES, () => { map.getCanvas().style.cursor = ""; });

        setLoaded(true);
      });

      map.on("error", (e) => {
        console.error("MapLibre error:", e.error);
        if (!map.loaded()) {
          queueMicrotask(() => setError("Map failed to load. Check your connection and try again."));
        }
      });

      return () => {
        map.remove();
        mapRef.current = null;
        initRef.current = false;
      };
    } catch (err) {
      console.error("Map init error:", err);
      initRef.current = false;
      queueMicrotask(() => setError("Could not create the map. Your journey details are shown below."));
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Update place source when filter changes ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const src = map.getSource(SOURCE_PLACES) as maplibregl.GeoJSONSource | undefined;
    if (src) src.setData(placesToGeoJSON(getVisiblePlaces(filter)));
  }, [filter, getVisiblePlaces, mapRef]);

  // ---- Update selected leg ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    map.setFilter(LAYER_LEG_LINES_SEL, ["==", ["get", "id"], selected?.kind === "leg" ? selected.leg.id : ""]);
  }, [selected, mapRef]);

  // ---- Update selected place ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    map.setFilter(LAYER_PLACE_CIRCLES_SEL, ["==", ["get", "id"], selected?.kind === "place" ? selected.place.id : ""]);
  }, [selected, mapRef]);

  // ---- Fly to selected place ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (selected?.kind === "place") {
      moveTo(map, selected.place.coordinates, Math.max(map.getZoom(), 11));
    }
  }, [selected, mapRef]);

  // ---- Resize ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onResize = () => map.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mapRef]);

  return (
    <div className="relative w-full" style={{ height: "clamp(420px, 65vh, 820px)" }}>
      <div
        ref={containerRef}
        className="w-full h-full"
        role="application"
        aria-label="Interactive expedition map of the Faroe Islands"
      />

      {/* ---- Custom unified controls ---- */}
      {loaded && (
        <div
          className="absolute top-3 right-3 z-10 flex flex-col gap-0 rounded-[10px] overflow-hidden"
          style={{ background: P.panel, border: "1px solid rgba(255,255,255,0.12)" }}
          role="group"
          aria-label="Map controls"
        >
          <ControlBtn label="Zoom in" onClick={() => mapRef.current?.zoomIn()}>+</ControlBtn>
          <ControlBtn label="Zoom out" onClick={() => mapRef.current?.zoomOut()}>−</ControlBtn>
          <ControlBtn label="Fit trip" onClick={fitTrip}>⌂</ControlBtn>
          <ControlBtn label="Fullscreen" onClick={() => {
            if (typeof document !== "undefined" && document.fullscreenEnabled) {
              containerRef.current?.requestFullscreen?.()?.catch(() => {});
            }
          }}>⛶</ControlBtn>
        </div>
      )}

      {/* Loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-wool/80 z-10" aria-live="polite">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-basalt/20 border-t-amber rounded-full animate-spin" />
            <p className="caption">Loading map…</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-wool/90 z-10" aria-live="assertive">
          <div className="max-w-xs text-center">
            <p className="font-medium text-basalt mb-2">Map unavailable</p>
            <p className="caption mb-4">{error}</p>
            <button
              type="button"
              onClick={() => { setError(null); setLoaded(false); }}
              className="border border-basalt/30 px-4 py-2 text-[14px] font-medium hover:bg-fog/40 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Control button
// ---------------------------------------------------------------------------
function ControlBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-[44px] h-[44px] flex items-center justify-center text-[16px] font-medium text-cream/80 hover:text-cream hover:bg-white/[0.08] transition-colors border-b border-white/[0.06] last:border-b-0"
    >
      {children}
    </button>
  );
}
