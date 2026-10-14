// components/Map.tsx
"use client";

import { useRef, useEffect } from 'react'
import * as mapboxgl from 'mapbox-gl/esm'
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapProps {
  initialCenter?: [number, number]
  initialZoom?: number
  accessToken?: string
}

export default function Map({
  initialCenter = [-83.75, 42.28],
  initialZoom = 12
}: MapProps) {
  const mapRef = useRef<mapboxgl.Map | undefined>(undefined)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapRef.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      container: mapContainerRef.current,
      center: initialCenter,
      zoom: initialZoom,
      style: 'mapbox://styles/mapbox/outdoors-v12',
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [initialCenter, initialZoom])

  return <div id='map-container' ref={mapContainerRef} className="w-full h-screen" />
}