import { Point } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import Map from './Map';
import Button from './Button';
import { useLocationStore } from '@/stores/LocationStore';

type MapSelectPopoverProps = React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onClose: () => void;
    selectedLocation: Point | null;
    setSelectedLocation: (location: Point | null) => void;
};

export default function MapSelectPopover({
    isOpen,
    onClose,
    selectedLocation,
    setSelectedLocation,
    className='',
    children,
    ...props
}: MapSelectPopoverProps) {
    const baseClasses = 'fixed inset-20 z-50 flex flex-col gap-2 items-center justify-evenly mt-2 mr-2 bg-white border-1 border-gray-400 rounded-md p-2 drop-shadow-md';
    const combinedClasses = `
        ${baseClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const popoverRef = useRef<HTMLDivElement>(null);

    const [pinnedLocation, setPinnedLocation] = useState<Point | null>(null);

    const userLocation = useLocationStore((state) => state.location);
    const getUserLocation = useLocationStore((state) => state.getLocation);

    useEffect(() => {
      if (!userLocation) {
        getUserLocation().catch((error) => {
          console.error("Could not get location:", error);
        });
      }
    }, [userLocation, getUserLocation]);

    const initialCenter: [number, number] = selectedLocation ? [
        selectedLocation.coordinates[0],
        selectedLocation.coordinates[1],
    ] : userLocation ? [
        userLocation.coordinates[0],
        userLocation.coordinates[1],
    ] : [-83.75, 42.28];

    useEffect(() => {
        if (!isOpen) return;

        function handleOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleOutside, true); // true = capture
        return () => document.removeEventListener("mousedown", handleOutside, true);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={popoverRef}
            className={combinedClasses}
            {...props}
        >
            <div className="flex-1 w-full min-h-0 overflow-hidden rounded-md">
                <Map
                    selectable
                    setPinnedLocation={setPinnedLocation}
                    pinnedLocation={pinnedLocation}
                    initialCenter={initialCenter}
                />
            </div>

            <div className="w-full flex items-center gap-3 shrink-0">
                <Button
                    type="button"
                    variant="outline"
                    disabled={!pinnedLocation && !selectedLocation}
                    onClick={() => {
                        setPinnedLocation(null);
                        setSelectedLocation(null);
                    }}
                >
                    Clear
                </Button>

                <p className="flex-1 text-xs text-gray-500 text-center truncate">
                    {pinnedLocation
                        ? `${pinnedLocation.coordinates[1].toFixed(4)}°, ${pinnedLocation.coordinates[0].toFixed(4)}°`
                        : 'No location selected'}
                </p>

                <Button
                    type="button"
                    disabled={!pinnedLocation}
                    onClick={() => {
                        setSelectedLocation(pinnedLocation);
                        onClose();
                    }}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
}