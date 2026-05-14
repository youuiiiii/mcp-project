import { useEffect, useMemo, useState } from "react";

import {
  checkAndNotifyNearbyDisaster,
  requestNotificationPermission,
} from "../../../services/notifications";
import {
  fetchRecentBmkgEarthquakes,
  type BmkgEarthquake,
} from "../../../services/bmkgService";

export const useBmkgEarthquakes = () => {
  const [earthquakes, setEarthquakes] = useState<BmkgEarthquake[]>([]);
  const [loadingEarthquakes, setLoadingEarthquakes] = useState(true);
  const [earthquakeErrorMessage, setEarthquakeErrorMessage] = useState<
    string | null
  >(null);

  const latestEarthquakes = useMemo(() => {
    return earthquakes.slice(0, 3);
  }, [earthquakes]);

  const mainEarthquake = latestEarthquakes[0] ?? null;

  const refreshEarthquakes = async () => {
    try {
      setLoadingEarthquakes(true);
      setEarthquakeErrorMessage(null);

      const items = await fetchRecentBmkgEarthquakes();

      setEarthquakes(items);
      void checkAndNotifyNearbyDisaster(items);
    } catch (error) {
      console.error("BMKG error:", error);

      setEarthquakeErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal memuat data gempa BMKG."
      );
    } finally {
      setLoadingEarthquakes(false);
    }
  };

  useEffect(() => {
    void requestNotificationPermission();
    void refreshEarthquakes();
  }, []);

  return {
    latestEarthquakes,
    mainEarthquake,
    loadingEarthquakes,
    earthquakeErrorMessage,
    refreshEarthquakes,
  };
};