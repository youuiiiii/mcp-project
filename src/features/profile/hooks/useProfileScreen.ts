import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../../contexts/AuthContext";
import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";

const LOGIN_ROUTE = "/login" as Href;

export type ProfileStats = {
  totalReports: number;
  activeReports: number;
  resolvedReports: number;
  highSeverityReports: number;
};

const normalizeText = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return normalized.length > 0 ? normalized : null;
};

const getInitials = (value: string): string => {
  return value
    .split(" ")
    .map((item) => item.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const useProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribeReports = subscribeToIncidents(
      (items) => {
        setReports(items);
        setErrorMessage(null);
        setLoading(false);
      },
      (error) => {
        console.error("Profile reports error:", error);
        setErrorMessage(error.message || "Could not load report data.");
        setLoading(false);
      }
    );

    return unsubscribeReports;
  }, []);

  const displayName = useMemo(() => {
    return (
      user?.displayName || user?.email?.split("@")[0] || "Community Reporter"
    );
  }, [user]);

  const userEmail = user?.email || "-";

  const userInitial = useMemo(() => {
    return getInitials(displayName);
  }, [displayName]);

  const userReports = useMemo(() => {
    const uidKey = normalizeText(user?.uid);
    const emailKey = normalizeText(user?.email);
    const nameKey = normalizeText(user?.displayName);

    return reports.filter((report) => {
      const reporterUid = normalizeText(report.reporterUid);
      const reporterEmail = normalizeText(report.reporterEmail);
      const reportedBy = normalizeText(report.reportedBy);

      if (uidKey && reporterUid === uidKey) {
        return true;
      }

      if (emailKey) {
        return reporterEmail === emailKey || reportedBy === emailKey;
      }

      if (nameKey) {
        return reportedBy === nameKey;
      }

      return false;
    });
  }, [reports, user?.uid, user?.email, user?.displayName]);

  const stats = useMemo<ProfileStats>(() => {
    return {
      totalReports: userReports.length,
      activeReports: userReports.filter((report) => report.status === "active")
        .length,
      resolvedReports: userReports.filter(
        (report) => report.status === "resolved"
      ).length,
      highSeverityReports: userReports.filter(
        (report) => report.severity === "high"
      ).length,
    };
  }, [userReports]);

  const handleLogout = () => {
    Alert.alert("Logout", "Log out of this account?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace(LOGIN_ROUTE);
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Logout Failed", "Something went wrong while logging out.");
          }
        },
      },
    ]);
  };

  return {
    loading,
    errorMessage,
    displayName,
    userEmail,
    userInitial,
    stats,
    handleLogout,
  };
};
