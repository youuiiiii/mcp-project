import { useRouter } from "expo-router";
import { useMemo } from "react";

import { useAuth } from "../../../contexts/AuthContext";
import { useBmkgEarthquakes } from "./useBmkgEarthquakes";
import { useHomeReports } from "./useHomeReports";

export const HOME_ROUTES = {
  map: "/(tabs)/map",
  report: "/(tabs)/report",
  analytics: "/(tabs)/analytics",
  profile: "/(tabs)/profile",
  earthquakeDetail: "/(tabs)/detail",
} as const;

const getInitials = (value: string): string => {
  return value
    .split(" ")
    .map((item) => item.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const useHomeScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const reportsState = useHomeReports();
  const earthquakesState = useBmkgEarthquakes();

  const displayName = useMemo(() => {
    return (
      user?.displayName || user?.email?.split("@")[0] || "Community Reporter"
    );
  }, [user]);

  const initials = useMemo(() => {
    return getInitials(displayName);
  }, [displayName]);

  type NavigationTarget = Parameters<typeof router.push>[0];

  const navigateTo = (route: NavigationTarget) => {
    router.push(route);
  };

  return {
    displayName,
    initials,
    routes: HOME_ROUTES,
    navigateTo,
    ...reportsState,
    ...earthquakesState,
  };
};