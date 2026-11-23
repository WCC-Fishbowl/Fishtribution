"use client";

import { useRef, useEffect } from 'react'
import * as mapboxgl from 'mapbox-gl/esm'
import 'mapbox-gl/dist/mapbox-gl.css';
import { Feature, Point } from 'geojson';

import { renderToStaticMarkup } from 'react-dom/server';
import { MapPinIcon } from '@heroicons/react/24/solid';

async function createPinImage(size = 96, color = '#C9B5FF'): Promise<HTMLImageElement> {
  const svg = renderToStaticMarkup(
    <MapPinIcon width={size} height={size} fill={color} />
  );

  const img = new Image(size, size);
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  return img;
}

export interface MapProps {
  initialCenter?: [number, number]
  initialZoom?: number
  accessToken?: string

  selectable?: boolean;
  setPinnedLocation?: (location: Point) => void;
  pinnedLocation?: Point | null;
}

const DEFAULT_CENTER: [number, number] = [-83.75, 42.28];

export default function Map({
  initialCenter = DEFAULT_CENTER,
  initialZoom = 12,
  selectable = false,
  setPinnedLocation,
  pinnedLocation = null,
}: MapProps) {
  const mapRef = useRef<mapboxgl.Map | undefined>(undefined)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  
  const setPinnedLocationRef = useRef(setPinnedLocation);
  useEffect(() => {
    setPinnedLocationRef.current = setPinnedLocation;
  }, [setPinnedLocation]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    let canceled = false;

    const map = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      container: mapContainerRef.current,
      center: initialCenter,
      zoom: initialZoom,
      style: 'mapbox://styles/mapbox/outdoors-v12',
    });

    mapRef.current = map;

    map.on('load', async () => {
      map.addSource('pin', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pinnedLocation ? [{
            type: 'Feature',
            geometry: pinnedLocation,
            properties: {},
          }] : [],
        }
      });

      try {
        const img = await createPinImage();
        if (canceled) return;

        if (!map.hasImage('pin-icon')) {
          map.addImage('pin-icon', img);
        }

        map.addLayer({
          id: 'pin-layer',
          type: 'symbol',
          source: 'pin',
          layout: {
            'icon-image': 'pin-icon',
            'icon-size': 0.28,
            'icon-allow-overlap': true,
            'icon-anchor': 'bottom',
          },
        });
      } catch (err) {
        console.error('Failed to create pin image:', err);
      }
    });

    if (selectable) {
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;

        const point: Point = {
          type: "Point",
          coordinates: [lng, lat],
        };
        const feature: Feature<Point> = {
          type: "Feature",
          geometry: point,
          properties: {},
        };

        const source = map.getSource('pin') as mapboxgl.GeoJSONSource | undefined;
        source?.setData(feature);

        setPinnedLocationRef.current?.(point);
      });
    }

    return () => {
      canceled = true;
      map.remove();
      mapRef.current = undefined;
    }
  }, [initialCenter[0], initialCenter[1], initialZoom, selectable]);

  return <div id='map-container' ref={mapContainerRef} className={`w-full ${selectable ? 'h-full' : 'h-screen'}`} />;
}