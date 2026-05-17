import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import StatusBadge from "../../../components/ui/StatusBadge";
import { getIncidentDisplayMeta } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentReport } from "../../../types/incident";
import {
  formatIncidentDate,
  getStatusLabel,
  getStatusVariant,
} from "./threadLabels";

type IncidentOverviewCardProps = {
  incident: IncidentReport;
  onReportContent: () => void;
};

export default function IncidentOverviewCard({
  incident,
  onReportContent,
}: IncidentOverviewCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const author = incident.reportedBy || incident.reporterEmail || "Anonymous";
  const trust = getTrustMeta(incident);

  return (
    <View style={styles.post}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={18} color={colors.textInverse} />
      </View>

      <View style={styles.body}>
        <View style={styles.authorRow}>
          <Text style={styles.authorName} numberOfLines={1}>
            {author}
          </Text>

          <Text style={styles.dot}>·</Text>

          <Text style={styles.timeText} numberOfLines={1}>
            {formatIncidentDate(incident.createdAt)}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.categoryPill,
              {
                backgroundColor: meta.lightColor,
              },
            ]}
          >
            <Ionicons name={meta.iconName} size={14} color={meta.color} />
            <Text
              style={[
                styles.categoryText,
                {
                  color: meta.color,
                },
              ]}
              numberOfLines={1}
            >
              {meta.label}
            </Text>
          </View>

          <StatusBadge
            label={getStatusLabel(incident.status)}
            variant={getStatusVariant(incident.status)}
            size="sm"
          />

          <StatusBadge
            label={getSeverityLabel(incident.severity)}
            variant={getSeverityVariant(incident.severity)}
            size="sm"
          />
        </View>

        <View
          style={[
            styles.trustNotice,
            {
              backgroundColor: trust.backgroundColor,
              borderColor: trust.borderColor,
            },
          ]}
        >
          <Ionicons name={trust.iconName} size={17} color={trust.color} />

          <View style={styles.trustTextGroup}>
            <Text
              style={[
                styles.trustTitle,
                {
                  color: trust.color,
                },
              ]}
            >
              {trust.label}
            </Text>

            <Text style={styles.trustDescription}>{trust.description}</Text>
          </View>
        </View>

        <Text style={styles.title}>{incident.title}</Text>

        <Text style={styles.description}>
          {incident.description || "Tidak ada deskripsi."}
        </Text>

        {incident.imageUri ? (
          <Image source={{ uri: incident.imageUri }} style={styles.image} />
        ) : null}

        <Text style={styles.disclaimer}>
          Laporan ini berasal dari warga dan belum tentu merupakan informasi
          resmi. Gunakan sebagai informasi awal dan tetap berhati-hati di
          lapangan.
        </Text>

        <Pressable
          onPress={onReportContent}
          style={({ pressed }) => [
            styles.reportContentButton,
            pressed && styles.reportContentPressed,
          ]}
        >
          <Ionicons
            name="flag-outline"
            size={16}
            color={colors.primaryDark}
          />
          <Text style={styles.reportContentText}>Laporkan Konten</Text>
        </Pressable>
      </View>
    </View>
  );
}

function getTrustMeta(incident: IncidentReport): {
  label: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
  borderColor: string;
} {
  const verificationCount = incident.verificationCount ?? 0;
  const disputeCount = incident.disputeCount ?? 0;

  if (
    incident.verificationStatus === "disputed" ||
    (disputeCount >= 2 && disputeCount >= verificationCount)
  ) {
    return {
      label: "Dipertanyakan",
      description:
        "Beberapa warga memberi tanda bahwa laporan ini perlu ditinjau kembali.",
      iconName: "alert-circle-outline",
      color: colors.primaryDark,
      backgroundColor: colors.dangerSoft,
      borderColor: "#FECACA",
    };
  }

  if (
    incident.verificationStatus === "verified" ||
    (verificationCount >= 2 && verificationCount > disputeCount)
  ) {
    return {
      label: "Dikonfirmasi warga",
      description: "Beberapa warga telah memberi update bahwa kejadian terjadi.",
      iconName: "checkmark-circle-outline",
      color: colors.success,
      backgroundColor: colors.successSoft,
      borderColor: "#BBF7D0",
    };
  }

  return {
    label: "Belum diverifikasi",
    description:
      "Laporan ini belum memiliki cukup update dari warga di sekitar lokasi.",
    iconName: "information-circle-outline",
    color: colors.warningDark,
    backgroundColor: colors.warningSoft,
    borderColor: "#FDE68A",
  };
}

function getSeverityLabel(severity: IncidentReport["severity"]) {
  if (severity === "high") {
    return "Tinggi";
  }

  if (severity === "medium") {
    return "Sedang";
  }

  return "Rendah";
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
  post: {
    flexDirection: "row",
    gap: spacing.md,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  authorName: {
    maxWidth: "54%",
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  dot: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
  },
  timeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  categoryPill: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
  },
  trustNotice: {
    marginTop: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  trustTextGroup: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  trustDescription: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
    color: colors.textMuted,
  },
  title: {
    marginTop: spacing.md,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    color: colors.text,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
    color: "#475569",
  },
  image: {
    marginTop: spacing.md,
    width: "100%",
    height: 210,
    borderRadius: radius.xl,
    backgroundColor: colors.border,
  },
  disclaimer: {
    marginTop: spacing.md,
    ...typography.caption,
    color: colors.textMuted,
  },
  reportContentButton: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.dangerSoft,
  },
  reportContentPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  reportContentText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
});