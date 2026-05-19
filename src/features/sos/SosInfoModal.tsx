import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/ui/AppButton";
import { useAuth } from "../../contexts/AuthContext";
import { createSOSLog } from "../../services/sosService";
import { colors } from "../../theme/colors";
import { radius, shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import type { Coordinate } from "../../types/incident";
import { formatDistance } from "../../utils/geo";

type SosInfoModalProps = {
  visible: boolean;
  onClose: () => void;
  userLocation: Coordinate | null;
  nearestIncidentId?: string | null;
  nearestIncidentDistance?: number | null;
};

export default function SosInfoModal({
  visible,
  onClose,
  userLocation,
  nearestIncidentId,
  nearestIncidentDistance,
}: SosInfoModalProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  const submitSOSLog = async () => {
    try {
      if (!user) {
        Alert.alert("Login Required", "Please log in before logging SOS info.");
        return;
      }

      if (!userLocation) {
        Alert.alert(
          "Location Unavailable",
          "Allow location access before logging SOS info."
        );
        return;
      }

      setSubmitting(true);

      await createSOSLog({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        nearestIncidentId,
        nearestIncidentDistance,
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
      });

      Alert.alert(
        "SOS Logged",
        "Your current location was recorded for moderator review. This did not contact emergency services.",
        [{ text: "OK", onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        "Could Not Log SOS",
        error instanceof Error
          ? error.message
          : "Something went wrong while logging SOS info."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSOSLog = () => {
    Alert.alert(
      "Log SOS Info?",
      "This records your current app location for moderators. It does not call police, ambulance, firefighters, or other emergency services.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Location",
          style: "destructive",
          onPress: submitSOSLog,
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressArea} onPress={handleClose} />

        <View style={styles.card}>
          <View style={styles.iconBox}>
            <Ionicons name="alert" size={30} color={colors.textInverse} />
          </View>

          <Text style={styles.title}>SOS Info</Text>

          <Text style={styles.description}>
            This app does not contact emergency services automatically. If you
            are in immediate danger, call local emergency services first, move
            to a safer place if possible, then report the incident with current
            location evidence.
          </Text>

          <View style={styles.locationBox}>
            <Ionicons name="location" size={18} color={colors.danger} />
            <Text style={styles.locationText}>
              {userLocation
                ? `Ready to log your current location${
                    nearestIncidentDistance !== null &&
                    nearestIncidentDistance !== undefined
                      ? `, about ${formatDistance(
                          nearestIncidentDistance
                        )} from the nearest active report`
                      : ""
                  }.`
                : "Current location is unavailable."}
            </Text>
          </View>

          <AppButton
            title="Log SOS Info"
            variant="danger"
            size="md"
            fullWidth
            loading={submitting}
            disabled={submitting || !userLocation}
            onPress={confirmSOSLog}
          />

          <AppButton
            title="Close"
            variant="secondary"
            size="md"
            fullWidth
            disabled={submitting}
            onPress={handleClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  backdropPressArea: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "100%",
    borderRadius: radius["3xl"],
    backgroundColor: colors.background,
    padding: spacing["2xl"],
    alignItems: "center",
    gap: spacing.md,
    ...shadow.floating,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
  locationBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  locationText: {
    flex: 1,
    ...typography.caption,
    color: colors.textMuted,
  },
});
