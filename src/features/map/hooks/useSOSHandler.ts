import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Alert, Platform, Vibration } from "react-native";

import { createSOSLog } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";
import { formatDistance, getNearestIncident } from "../../../utils/geo";
import type { UserMapPosition } from "../types";
import { getEmergencyGuidance } from "../utils/emergencyGuidance";
import { getReportDisplayMeta } from "../utils/reportDisplayMeta";

type UseSOSHandlerParams = {
  userLocation: UserMapPosition | null;
  activeReports: IncidentReport[];
};

export const useSOSHandler = ({
  userLocation,
  activeReports,
}: UseSOSHandlerParams) => {
  const [sosLoading, setSosLoading] = useState(false);

  const handleSOSPress = async () => {
    try {
      if (!userLocation) {
        Alert.alert(
          "Lokasi Tidak Tersedia",
          "Aplikasi belum mendapatkan lokasi Anda. Pastikan izin lokasi aktif."
        );
        return;
      }

      setSosLoading(true);

      const nearest = getNearestIncident(userLocation, activeReports);

      const nearestMeta = nearest.incident
        ? getReportDisplayMeta(nearest.incident)
        : null;

      const vibrationPattern =
        Platform.OS === "android"
          ? 10000
          : [0, 800, 300, 800, 300, 800, 300, 800, 300, 800];

      Vibration.vibrate(vibrationPattern);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      ).catch(() => {});

      await createSOSLog({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        nearestIncidentId: nearest.incident?.id ?? null,
        nearestIncidentDistance: nearest.distance ?? null,
      });

      const nearbyMessage =
        nearest.incident && nearest.distance !== null
          ? `Incident terdekat: ${nearestMeta?.icon} ${
              nearestMeta?.label
            } sekitar ${formatDistance(nearest.distance)} dari lokasi Anda.`
          : "Belum ada incident aktif yang terdeteksi di sekitar lokasi Anda.";

      Alert.alert(
        "SOS Aktif",
        `${nearbyMessage}\n\n${getEmergencyGuidance(nearest.incident)}`,
        [
          {
            text: "Mengerti",
            onPress: () => {
              Vibration.cancel();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "SOS Gagal",
        error instanceof Error
          ? error.message
          : "Gagal mengirim log SOS. Coba lagi beberapa saat."
      );
    } finally {
      setSosLoading(false);
    }
  };

  return {
    sosLoading,
    handleSOSPress,
  };
};