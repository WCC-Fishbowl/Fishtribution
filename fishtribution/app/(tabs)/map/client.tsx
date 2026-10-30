'use client';

import Map from '@/components/Map';
import { useLocationStore } from '@/stores/LocationStore';
import { useEffect } from 'react';

/*#E0E0D1*/
export default function MapClient() {
    const location = useLocationStore((state) => state.location);
    const getLocation = useLocationStore((state) => state.getLocation);

    useEffect(() => {
      if (!location) {
        getLocation().catch((error) => {
          console.error("Could not get location:", error);
        });
      }
    }, [location, getLocation]);

    const initialCenter: [number, number] = location
      ? [
        location.coordinates[0],
        location.coordinates[1],
      ] : [-83.75, 42.28];

    return (
    <div>
      <Map initialCenter={initialCenter} initialZoom={14} />
    </div>
  )
}