import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import AppButton from "../../../components/ui/AppButton";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { Coordinate, ReportLocationDraft } from "../../../types/incident";

type IncidentLocationPickerModalProps = {
  visible: boolean;
  incidentLocation: ReportLocationDraft | null;
  onClose: () => void;
  onConfirm: (coordinate: Coordinate) => void;
};

export default function IncidentLocationPickerModal({
  visible,
  incidentLocation,
  onClose,
  onConfirm,
}: IncidentLocationPickerModalProps) {
  const { t } = useI18n();
  const [draftCoordinate, setDraftCoordinate] = useState<Coordinate | null>(
    incidentLocation
  );

  useEffect(() => {
    if (visible) {
      setDraftCoordinate(incidentLocation);
    }
  }, [incidentLocation, visible]);

  const handleSave = () => {
    if (!draftCoordinate) return;

    onConfirm(draftCoordinate);
    onClose();
  };

  if (!incidentLocation || !draftCoordinate) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{t("report.location.picker.title")}</Text>
            <Text style={styles.subtitle}>
              {t("report.location.picker.subtitle")}
            </Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: draftCoordinate.latitude,
            longitude: draftCoordinate.longitude,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006,
          }}
          onPress={(event) => {
            setDraftCoordinate(event.nativeEvent.coordinate);
          }}
          showsUserLocation
          showsCompass
          showsScale
        >
          <Marker
            coordinate={draftCoordinate}
            draggable
            pinColor={colors.primary}
            title={t("report.location.title")}
            onDragEnd={(event) => {
              setDraftCoordinate(event.nativeEvent.coordinate);
            }}
          />
        </MapView>

        <View style={styles.footer}>
          <Text style={styles.coordinateText}>
            {draftCoordinate.latitude.toFixed(6)}, {draftCoordinate.longitude.toFixed(6)}
          </Text>

          <View style={styles.actions}>
            <AppButton
              title={t("common.cancel")}
              variant="secondary"
              size="md"
              onPress={onClose}
              style={styles.actionButton}
            />
            <AppButton
              title={t("report.location.picker.save")}
              variant="danger"
              size="md"
              onPress={handleSave}
              style={styles.actionButton}
              leftIcon={
                <Ionicons name="checkmark" size={17} color={colors.textInverse} />
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["3xl"],
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    flex: 1,
  },
  footer: {
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.floating,
  },
  coordinateText: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
