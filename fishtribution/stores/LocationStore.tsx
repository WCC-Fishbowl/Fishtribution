import { create } from "zustand";
import type { Point } from "geojson";

type LocationStore = {
  location: Point | null;
  watchId: number | null;
  getLocation: () => Promise<Point>;
  startWatching: () => void;
  stopWatching: () => void;
};

export const useLocationStore = create<LocationStore>((set, get) => ({
  location: null,
  watchId: null,
  getLocation: () =>
  new Promise<Point>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (result) => {
        const location: Point = {
          type: "Point",
          coordinates: [
            result.coords.longitude,
            result.coords.latitude,
          ],
        };

        set({ location });
        resolve(location);
      },
      (error) => {
        alert(`Location error ${error.code}: ${error.message}`);
        reject(error);
      }
    );
  }),
  startWatching: () => {
    if (get().watchId !== null)
        return;

    const watchId = navigator.geolocation.watchPosition(
      (result) => {
        set({
          location: {
            type: "Point",
            coordinates: [
              result.coords.longitude,
              result.coords.latitude,
            ],
          },
        });
      },
      (error) => {
        console.error("Location error:", error);
      }
    );

    set({ watchId });
  },

  stopWatching: () => {
    const { watchId } = get();

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      set({ watchId: null });
    }
  },
}));