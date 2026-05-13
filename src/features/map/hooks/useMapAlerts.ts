import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Alert, Vibration } from "react-native";

import {
  LOCAL_INCIDENT_NOTIFICATION_DISTANCE_METERS,
  VERIFICATION_DISTANCE_METERS,
  WARNING_DISTANCE_METERS,
} from "../../../constants/incident";
import type { IncidentReport } from "../../../types/incident";
import {
  formatDistance,
  getDistanceInMeters,
  isValidCoordinate,
} from "../../../utils/geo";
import type {
  NearbyIncidentNotification,
  UserMapPosition,
} from "../types";
import { getReportDisplayMeta } from "../utils/reportDisplayMeta";

type NearestIncidentResult = {
  incident: IncidentReport | null;
  distance: number | null;
};

type UseMapAlertsParams = {
  actorKey: string | null;
  userLocation: UserMapPosition | null;
  reports: IncidentReport[];
  activeReports: IncidentReport[];
  nearestIncident: NearestIncidentResult;
  onOpenIncidentThread: (incident: IncidentReport) => void;
};

export const useMapAlerts = ({
  actorKey,
  userLocation,
  reports,
  activeReports,
  nearestIncident,
  onOpenIncidentThread,
}: UseMapAlertsParams) => {
  const warnedIncidentIdRef = useRef<string | null>(null);
  const verificationPromptedIncidentIdRef = useRef<string | null>(null);

  const knownIncidentIdsRef = useRef<Set<string>>(new Set());
  const notifiedIncidentIdsRef = useRef<Set<string>>(new Set());
  const initialIncidentSnapshotLoadedRef = useRef(false);

  const [nearbyIncidentNotification, setNearbyIncidentNotification] =
    useState<NearbyIncidentNotification | null>(null);

  const isOwnIncident = (incident: IncidentReport) => {
    if (!actorKey) {
      return false;
    }

    return (
      incident.reporterEmail === actorKey || incident.reportedBy === actorKey
    );
  };

  const hasUserVerifiedIncident = (incident: IncidentReport) => {
    if (!actorKey) {
      return false;
    }

    return (
      incident.verifiedBy?.includes(actorKey) ||
      incident.disputedBy?.includes(actorKey)
    );
  };

  const shouldNotifyNearbyIncident = (
    incident: IncidentReport,
    distance: number
  ) => {
    if (!actorKey) {
      return false;
    }

    if (incident.status !== "active") {
      return false;
    }

    if (!isValidCoordinate(incident.latitude, incident.longitude)) {
      return false;
    }

    if (distance > LOCAL_INCIDENT_NOTIFICATION_DISTANCE_METERS) {
      return false;
    }

    if (isOwnIncident(incident)) {
      return false;
    }

    if (notifiedIncidentIdsRef.current.has(incident.id)) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!userLocation || !actorKey) {
      return;
    }

    const candidate = activeReports.find((incident) => {
      if (isOwnIncident(incident)) {
        return false;
      }

      if (hasUserVerifiedIncident(incident)) {
        return false;
      }

      const distance = getDistanceInMeters(userLocation, {
        latitude: incident.latitude,
        longitude: incident.longitude,
      });

      return distance <= VERIFICATION_DISTANCE_METERS;
    });

    if (!candidate) {
      verificationPromptedIncidentIdRef.current = null;
      return;
    }

    if (verificationPromptedIncidentIdRef.current === candidate.id) {
      return;
    }

    verificationPromptedIncidentIdRef.current = candidate.id;

    const meta = getReportDisplayMeta(candidate);

    Alert.alert(
      "Incident Perlu Verifikasi",
      `${meta.icon} Ada laporan ${meta.label} di sekitar lokasi Anda.\n\nBuka thread untuk melihat detail dan mengirim foto verifikasi.`,
      [
        {
          text: "Nanti",
          style: "cancel",
        },
        {
          text: "Buka Thread",
          onPress: () => {
            onOpenIncidentThread(candidate);
          },
        },
      ]
    );
  }, [userLocation, activeReports, actorKey]);

  useEffect(() => {
    if (!userLocation || reports.length === 0) {
      return;
    }

    const currentIds = new Set(reports.map((report) => report.id));

    if (!initialIncidentSnapshotLoadedRef.current) {
      knownIncidentIdsRef.current = currentIds;
      initialIncidentSnapshotLoadedRef.current = true;
      return;
    }

    const newReports = reports.filter((report) => {
      return !knownIncidentIdsRef.current.has(report.id);
    });

    knownIncidentIdsRef.current = currentIds;

    if (newReports.length === 0) {
      return;
    }

    const nearbyCandidates = newReports
      .map((incident) => {
        const distance = getDistanceInMeters(userLocation, {
          latitude: incident.latitude,
          longitude: incident.longitude,
        });

        return {
          incident,
          distance,
        };
      })
      .filter((item) => {
        return shouldNotifyNearbyIncident(item.incident, item.distance);
      })
      .sort((a, b) => {
        return a.distance - b.distance;
      });

    const nearestNewIncident = nearbyCandidates[0];

    if (!nearestNewIncident) {
      return;
    }

    notifiedIncidentIdsRef.current.add(nearestNewIncident.incident.id);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {}
    );

    setNearbyIncidentNotification(nearestNewIncident);
  }, [reports, userLocation, actorKey]);

  useEffect(() => {
    if (
      !userLocation ||
      !nearestIncident.incident ||
      nearestIncident.distance === null
    ) {
      warnedIncidentIdRef.current = null;
      return;
    }

    if (nearestIncident.distance > WARNING_DISTANCE_METERS) {
      warnedIncidentIdRef.current = null;
      return;
    }

    if (warnedIncidentIdRef.current === nearestIncident.incident.id) {
      return;
    }

    warnedIncidentIdRef.current = nearestIncident.incident.id;

    const meta = getReportDisplayMeta(nearestIncident.incident);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {}
    );

    Vibration.vibrate([0, 350, 180, 350]);

    Alert.alert(
      "Peringatan Kejadian Terdekat",
      `${meta.icon} ${meta.label} terdeteksi sekitar ${formatDistance(
        nearestIncident.distance
      )} dari lokasi Anda.\n\nTetap waspada dan hindari area kejadian.`,
      [{ text: "Mengerti" }]
    );
  }, [userLocation, nearestIncident]);

  const openNearbyIncidentNotification = (incident: IncidentReport) => {
    setNearbyIncidentNotification(null);
    onOpenIncidentThread(incident);
  };

  const closeNearbyIncidentNotification = () => {
    setNearbyIncidentNotification(null);
  };

  return {
    nearbyIncidentNotification,
    openNearbyIncidentNotification,
    closeNearbyIncidentNotification,
  };
};