import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { getIncidentDisplayMeta } from "../constants/incident";
import { colors } from "../theme/colors";
import { radius, shadow, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import { IncidentReport } from "../types/incident";
import { formatDistance } from "../utils/geo";
import AppButton from "./ui/AppButton";
import AppCard from "./ui/AppCard";
import IconBadge from "./ui/IconBadge";
import StatusBadge from "./ui/StatusBadge";

type LocalIncidentBannerProps = {
  incident: IncidentReport | null;
  distance: number | null;
  visible: boolean;
  onOpen: (incident: IncidentReport) => void;
  onClose: () => void;
};

export default function LocalIncidentBanner({
  incident,
  distance,
  visible,
  onOpen,
  onClose,
}: LocalIncidentBannerProps) {
  if (!visible || !incident) {
    return null;
  }

  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const distanceText =
    distance !== null ? `${formatDistance(distance)} dari posisi Anda` : null;

  return (
    <View style={styles.wrapper}>
      <AppCard
        style={[
          styles.card,
          {
            borderColor: meta.color,
            backgroundColor: meta.lightColor,
          },
        ]}
      >
        <View style={styles.header}>
          <IconBadge
            variant="neutral"
            size="lg"
            rounded={false}
            style={{
              backgroundColor: meta.color,
            }}
          >
            <Ionicons name={meta.iconName} size={24} color={colors.textInverse} />
          </IconBadge>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Laporan baru di sekitar Anda</Text>

              <StatusBadge
                label={incident.severity}
                variant={getSeverityVariant(incident.severity)}
                size="sm"
              />
            </View>

            <Text style={styles.incidentTitle} numberOfLines={1}>
              {incident.title}
            </Text>

            <Text style={styles.description} numberOfLines={2}>
              {meta.label}
              {distanceText ? ` • ${distanceText}` : ""}
            </Text>
          </View>

          <AppButton
            title="×"
            variant="ghost"
            size="sm"
            onPress={onClose}
            style={styles.closeButton}
            textStyle={styles.closeText}
          />
        </View>

        <View style={styles.actionRow}>
          <AppButton
            title="Buka Thread"
            variant="primary"
            size="md"
            onPress={() => onOpen(incident)}
            leftIcon={
              <Ionicons
                name="chatbubble-ellipses"
                size={17}
                color={colors.textInverse}
              />
            }
            style={styles.openButton}
          />

          <AppButton
            title="Nanti"
            variant="secondary"
            size="md"
            onPress={onClose}
            style={styles.dismissButton}
          />
        </View>
      </AppCard>
    </View>
  );
}

function getSeverityVariant(
  severity: IncidentReport["severity"]
): "success" | "warning" | "danger" {
  if (severity === "high") {
    return "danger";
  }

  if (severity === "medium") {
    return "warning";
  }

  return "success";
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.sm,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: radius["2xl"],
    ...shadow.card,
  },
  header: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    ...typography.label,
    color: colors.text,
  },
  incidentTitle: {
    marginTop: spacing.xs,
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  description: {
    marginTop: spacing.xs,
    ...typography.caption,
    color: "#475569",
  },
  closeButton: {
    width: 30,
    height: 30,
    minHeight: 30,
    paddingHorizontal: 0,
    backgroundColor: "rgba(15, 23, 42, 0.08)",
  },
  closeText: {
    fontSize: 20,
    lineHeight: 22,
    color: colors.text,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  openButton: {
    flex: 1.45,
  },
  dismissButton: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});