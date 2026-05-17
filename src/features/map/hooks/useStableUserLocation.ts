import * as Location from "expo-location";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import MapView, { Region } from "react-native-maps";

import { getDistanceInMeters } from "../../../utils/geo";
import type { UserMapPosition } from "../types";

const DEFAULT_REGION: Region = {
  latitude: -6.2,
  longitude: 106.816666,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const USER_LOCATION_MIN_MOVE_METERS = 2;
const USER_LOCATION_MAX_ACCURACY_METERS = 60;
const USER_LOCATION_MAX_JUMP_METERS = 80;

export const useStableUserLocation = (mapRef: RefObject<MapView | null>) => {
  const lastStableUserLocationRef = useRef<UserMapPosition | null>(null);

  const [userLocation, setUserLocation] = useState<UserMapPosition | null>(
    null
  );
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationErrorMessage, setLocationErrorMessage] = useState<
    string | null
  >(null);

  const updateStableUserLocation = useCallback(
    (nextLocation: UserMapPosition) => {
      const lastLocation = lastStableUserLocationRef.current;
      const nextAccuracy =
        nextLocation.accuracy ?? USER_LOCATION_MAX_ACCURACY_METERS;

      if (nextAccuracy > USER_LOCATION_MAX_ACCURACY_METERS) {
        return;
      }

      if (!lastLocation) {
        lastStableUserLocationRef.current = nextLocation;
        setUserLocation(nextLocation);
        return;
      }

      const distance = getDistanceInMeters(lastLocation, nextLocation);

      if (distance > USER_LOCATION_MAX_JUMP_METERS) {
        return;
      }

      const lastAccuracy =
        lastLocation.accuracy ?? USER_LOCATION_MAX_ACCURACY_METERS;
      const accuracyImproved = nextAccuracy + 5 < lastAccuracy;

      if (distance < USER_LOCATION_MIN_MOVE_METERS && !accuracyImproved) {
        return;
      }

      lastStableUserLocationRef.current = nextLocation;
      setUserLocation(nextLocation);
    },
    []
  );

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let mounted = true;

    const setupLocation = async () => {
      try {
        setLoadingLocation(true);

        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status !== "granted") {
          setLocationErrorMessage(
            "Izin lokasi ditolak. Map tetap dapat digunakan, tetapi posisi Anda tidak bisa ditampilkan."
          );
          setLoadingLocation(false);
          return;
        }

        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        if (!mounted) {
          return;
        }

        const coordinate: UserMapPosition = {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
          accuracy: currentPosition.coords.accuracy,
          heading: currentPosition.coords.heading,
        };

        const nextRegion: Region = {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };

        lastStableUserLocationRef.current = coordinate;
        setUserLocation(coordinate);
        setRegion(nextRegion);
        setLoadingLocation(false);

        setTimeout(() => {
          mapRef.current?.animateToRegion(nextRegion, 700);
        }, 300);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 2,
            timeInterval: 1500,
          },
          (position) => {
            const nextCoordinate: UserMapPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              heading: position.coords.heading,
            };

            updateStableUserLocation(nextCoordinate);
          }
        );
      } catch (error) {
        console.error("Location error:", error);

        setLocationErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal mengambil lokasi perangkat."
        );

        setLoadingLocation(false);
      }
    };

    void setupLocation();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [mapRef, updateStableUserLocation]);

  const focusUserLocation = () => {
    if (!userLocation) {
      Alert.alert(
        "Lokasi Tidak Tersedia",
        "Izinkan akses lokasi untuk menampilkan posisi Anda."
      );
      return;
    }

    const nextRegion: Region = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 700);
  };

  return {
    userLocation,
    region,
    loadingLocation,
    locationErrorMessage,
    focusUserLocation,
  };
};
