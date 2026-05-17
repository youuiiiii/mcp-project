import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getIncidentDisplayMeta } from "../constants/incident";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import type { IncidentReport } from "../types/incident";
import { shareIncident } from "../utils/shareIncident";
import AppCard from "./ui/AppCard";
import IconBadge from "./ui/IconBadge";
import StatusBadge, { type StatusBadgeVariant } from "./ui/StatusBadge";

type IncidentCardProps = {
  incident: IncidentReport;
  onPress?: (incident: IncidentReport) => void;
  showImage?: boolean;
};

const STATUS_LABEL = {
  active: "Aktif",
  resolved: "Selesai",
} as const satisfies Record<IncidentReport["status"], string>;

const SEVERITY_LABEL = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
} as const satisfies Record<IncidentReport["severity"], string>;

export default function IncidentCard({
  incident,
  onPress,
  showImage = true,
}: IncidentCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const handleShare = () => {
    shareIncident({
      type: incident.title || meta.label,
      description: incident.description,
      location: {
        lat: incident.latitude,
        lng: incident.longitude,
      },
      createdAt: incident.createdAt,
    });
  };

  return (
    <AppCard
      onPress={onPress ? () => onPress(incident) : undefined}
      style={styles.card}
    >
      <View style={styles.header}>
        <IconBadge
          variant="neutral"
          size="lg"
          rounded={false}
          style={{
            backgroundColor: meta.lightColor,
          }}
        >
          <Ionicons name={meta.iconName} size={24} color={meta.color} />
        </IconBadge>

        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {incident.title || "Laporan tanpa judul"}
          </Text>

          <Text style={styles.category} numberOfLines={1}>
            {meta.label}
          </Text>
        </View>

        <StatusBadge
          label={STATUS_LABEL[incident.status]}
          variant={getStatusVariant(incident.status)}
          size="sm"
        />
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {incident.description || "Tidak ada deskripsi."}
      </Text>

      {showImage && incident.imageUri ? (
        <Image source={{ uri: incident.imageUri }} style={styles.image} />
      ) : null}

      <View style={styles.footer}>
        <StatusBadge
          label={SEVERITY_LABEL[incident.severity]}
          variant={getSeverityVariant(incident.severity)}
          size="sm"
        />

        <View style={styles.dateWrap}>
          <Ionicons name="time-outline" size={14} color={colors.textSoft} />
          <Text style={styles.date} numberOfLines={1}>
            {formatDate(incident.createdAt)}
          </Text>
        </View>

        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Ionicons name="share-social-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </AppCard>
  );
}

function formatDate(date?: Date): string {
  if (!date) {
    return "Waktu tidak tersedia";
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusVariant(
  status: IncidentReport["status"]
): StatusBadgeVariant {
  if (status === "active") {
    return "active";
  }

  if (status === "resolved") {
    return "resolved";
  }

  return "neutral";
}

function getSeverityVariant(
  severity: IncidentReport["severity"]
): StatusBadgeVariant {
  if (severity === "high") {
    return "danger";
  }

  if (severity === "medium") {
    return "warning";
  }

  return "success";
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius["2xl"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  category: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  description: {
    marginTop: spacing.md,
    ...typography.caption,
    color: colors.textMuted,
  },
  image: {
    marginTop: spacing.md,
    width: "100%",
    height: 150,
    borderRadius: radius.lg,
    backgroundColor: colors.border,
  },
  footer: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  dateWrap: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  date: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSoft,
  },
  shareBtn: {
    padding: 4,
  },
});