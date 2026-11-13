"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import * as mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  accessToken?: string;
}

type Species = {
  id: string;
  common_name: string;
  scientific_name: string;
};

const DEFAULT_CENTER: [number, number] = [-83.75, 42.28];
const TILE_BASE = "/api/fishTiles/{z}/{x}/{y}";
const tileUrl = (filters = "") =>
  `${window.location.origin}${TILE_BASE}${filters ? `?${filters}` : ""}`;

export default function FishCatchMap({
  initialCenter = DEFAULT_CENTER,
  initialZoom = 12,
  accessToken,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const speciesRef = useRef<Map<string, string>>(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [species, setSpecies] = useState<Species[]>([]);
  const [selectedTaxon, setSelectedTaxon] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [appliedFilters, setAppliedFilters] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loadingSpecies, setLoadingSpecies] = useState(true);
  const [searching, setSearching] = useState(false);

  const token = accessToken || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const longitude = initialCenter[0];
  const latitude = initialCenter[1];

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/fishSpecies", { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(`Species API returned ${response.status}`);
        return response.json() as Promise<{ species: Species[] }>;
      })
      .then(data => {
        if (!Array.isArray(data.species)) throw new Error("Unexpected species response");
        speciesRef.current = new Map(data.species.map(item => [item.id, item.common_name]));
        setSpecies(data.species);
      })
      .catch(error => {
        if (!controller.signal.aborted) setStatus(`Species list unavailable: ${String(error)}`);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingSpecies(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !token) return;

    const map = new mapboxgl.Map({
      accessToken: token,
      container: mapContainerRef.current,
      center: [longitude, latitude],
      zoom: initialZoom,
      style: "mapbox://styles/mapbox/outdoors-v12",
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("fish", {
        type: "vector",
        tiles: [tileUrl()],
        minzoom: 7,
        maxzoom: 22,
      });
      map.addLayer({
        id: "fish",
        type: "circle",
        source: "fish",
        "source-layer": "fish",
        paint: {
          "circle-color": "#f25c32",
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 7, 3, 12, 6, 16, 10],
          "circle-opacity": 0.85,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1,
        },
      });

      map.on("mouseenter", "fish", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "fish", () => { map.getCanvas().style.cursor = ""; });
      map.on("click", "fish", event => {
        const feature = event.features?.[0];
        if (!feature || !event.lngLat) return;
        const id = String(feature.properties?.taxon_id ?? "");
        const name = speciesRef.current.get(id) || "Fish catch";
        const date = String(feature.properties?.caught_at_local ?? "");
        const message = date ? `${name}\nCaught: ${date} (Michigan time)` : name;
        new mapboxgl.Popup({ closeButton: true })
          .setLngLat(event.lngLat)
          .setText(message)
          .addTo(map);
      });
      setMapReady(true);
    });

    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, [longitude, latitude, initialZoom, token]);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const source = map?.getSource("fish") as mapboxgl.VectorTileSource | undefined;
    if (!source) return;
    source.setTiles([tileUrl(appliedFilters)]);
  }, [appliedFilters, mapReady]);

  function applyFilters() {
    if (dateStart && dateEnd && dateStart > dateEnd) {
      setStatus("End date cannot be earlier than start date.");
      return;
    }
    const params = new URLSearchParams();
    if (selectedTaxon) params.append("taxon", selectedTaxon);
    if (dateStart) params.set("dateStart", dateStart);
    if (dateEnd) params.set("dateEnd", dateEnd);
    if (timeStart) params.set("timeStart", timeStart);
    if (timeEnd) params.set("timeEnd", timeEnd);
    setAppliedFilters(params.toString());
    setStatus("Map filters applied.");
  }

  function resetFilters() {
    setSelectedTaxon("");
    setDateStart("");
    setDateEnd("");
    setTimeStart("");
    setTimeEnd("");
    setAppliedFilters("");
    setStatus("Map filters cleared.");
  }

  async function searchLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = placeSearch.trim();
    if (!query || !mapRef.current) return;
    if (!token) {
      setStatus("Mapbox access token is missing.");
      return;
    }
    if (query.length > 256 || query.includes(";")) {
      setStatus("Enter a shorter location without semicolons.");
      return;
    }

    setSearching(true);
    setStatus("");
    try {
      const params = new URLSearchParams({
        q: query,
        access_token: token,
        autocomplete: "false",
        limit: "1",
        proximity: `${mapRef.current.getCenter().lng},${mapRef.current.getCenter().lat}`,
      });
      const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params}`);
      if (!response.ok) throw new Error(`Location search returned ${response.status}`);
      const result = await response.json() as {
        features?: Array<{ geometry?: { coordinates?: number[] }; properties?: { name?: string } }>;
      };
      const coordinates = result.features?.[0]?.geometry?.coordinates;
      if (!coordinates || coordinates.length < 2 || !coordinates.every(Number.isFinite)) {
        setStatus("No matching location found.");
        return;
      }
      mapRef.current?.flyTo({ center: [coordinates[0], coordinates[1]], zoom: 12 });
      setStatus(`Moved map to ${result.features?.[0]?.properties?.name || query}.`);
    } catch (error) {
      setStatus(`Location search failed: ${String(error)}`);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="relative h-screen min-h-[520px] w-full" style={{ position: "relative", height: "75vh", minHeight: 500, width: "100%" }} >
      <div ref={mapContainerRef} className="absolute inset-0" aria-label="Map of fish catches" style={{ position: "absolute", top: 0, left: 0, height: "75vh", minHeight: 500, width: "100%" }} />
      <section className="absolute left-3 top-3 z-10 max-h-[calc(100vh-1.5rem)] w-[min(22rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
        <h2 className="mb-3 text-lg font-semibold">Explore fish catches</h2>
        <form className="mb-4 flex gap-2" onSubmit={searchLocation}>
          <label className="sr-only" htmlFor="fish-map-place">Search a place</label>
          <input
            id="fish-map-place"
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-2 text-sm"
            type="search"
            placeholder="Search a city or address"
            value={placeSearch}
            onChange={event => setPlaceSearch(event.target.value)}
          />
          <button type="submit" disabled={searching || !placeSearch.trim()} className="rounded-md bg-sky-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">
            {searching ? "Finding" : "Go"}
          </button>
        </form>
        <div className="space-y-3">
          <div>
            <label htmlFor="fish-map-species" className="mb-1 block text-sm font-medium">Fish species</label>
            <select
              id="fish-map-species"
              value={selectedTaxon}
              onChange={event => setSelectedTaxon(event.target.value)}
              disabled={loadingSpecies}
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
            >
              <option value="">All species</option>
              {species.map(item => <option key={item.id} value={item.id}>{item.common_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-medium">From date
              <input type="date" value={dateStart} onChange={event => setDateStart(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-1 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium">To date
              <input type="date" value={dateEnd} onChange={event => setDateEnd(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-1 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium">From time
              <input type="time" value={timeStart} onChange={event => setTimeStart(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-1 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium">To time
              <input type="time" value={timeEnd} onChange={event => setTimeEnd(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-1 py-2 text-sm" />
            </label>
          </div>
          <p className="text-xs text-slate-500">Date and time filters use Michigan local time.</p>
          <div className="flex gap-2">
            <button type="button" onClick={applyFilters} className="flex-1 rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">Apply filters</button>
            <button type="button" onClick={resetFilters} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium">Clear</button>
          </div>
        </div>
        {status && <p className="mt-3 text-xs text-slate-700" role="status">{status}</p>}
        {!token && <p className="mt-3 text-xs text-red-700">NEXT_PUBLIC_MAPBOX_TOKEN is missing.</p>}
      </section>
    </div>
  );
}
