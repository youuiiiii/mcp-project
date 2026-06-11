import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppCard from "../../../components/ui/AppCard";
import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";
import { formatDistance } from "../../../utils/geo";
import { getReportDisplayMeta } from "../utils/reportDisplayMeta";
import { getIncidentDisplayMeta } from "../../../constants/incident";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MINIMIZED_HEIGHT = 140; // Approx height for anchor bar + nearest info
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.65;

type MapBottomSheetProps = {
  reports: IncidentReport[];
  nearestIncident: { incident: IncidentReport | null; distance: number | null };
  onOpenThread: (incident: IncidentReport) => void;
  onOpenVerify: (incident: IncidentReport) => void;
};

export default function MapBottomSheet({
  reports,
  nearestIncident,
  onOpenThread,
  onOpenVerify,
}: MapBottomSheetProps) {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(MINIMIZED_HEIGHT)).current;

  const toggleSheet = () => {
    const toValue = expanded ? MINIMIZED_HEIGHT : EXPANDED_HEIGHT;
    Animated.spring(heightAnim, {
      toValue,
      useNativeDriver: false, // height animation requires false
      bounciness: 4,
    }).start();
    setExpanded(!expanded);
  };

  const activeCount = reports.filter((r) => r.status === "active").length;

  const nearestMeta = nearestIncident.incident
    ? getReportDisplayMeta(nearestIncident.incident)
    : null;

  return (
    <Animated.View style={[styles.bottomSheet, { height: heightAnim }]}>
      <View style={styles.sheetHandleContainer}>
        <View style={styles.sheetHandle} />
      </View>

      <Pressable onPress={toggleSheet} style={styles.anchorBar}>
        <View style={styles.anchorTextRow}>
          <Text style={styles.anchorTitle}>
            {activeCount} Peringatan Aktif Sekitar
          </Text>
          <Text style={styles.anchorSubtitle}>
            {expanded ? "Tarik turun untuk menutup" : "Tarik naik untuk daftar"}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-down" : "chevron-up"}
          size={24}
          color={colors.textSoft}
        />
      </Pressable>

      {!expanded && nearestIncident.incident && nearestMeta && nearestIncident.distance !== null && (
        <View style={styles.nearestBanner}>
          <Ionicons name={nearestMeta.iconName} size={18} color={nearestMeta.color} />
          <Text style={styles.nearestText} numberOfLines={1}>
            Terdekat: {nearestMeta.label} ({formatDistance(nearestIncident.distance)})
          </Text>
        </View>
      )}

      {expanded && (
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {reports.map((report) => (
            <BottomSheetReportItem
              key={report.id}
              report={report}
              onPress={() => onOpenThread(report)}
              onVerify={() => onOpenVerify(report)}
            />
          ))}
          {reports.length === 0 && (
            <Text style={styles.emptyText}>Tidak ada laporan yang sesuai filter.</Text>
          )}
        </ScrollView>
      )}
    </Animated.View>
  );
}

function BottomSheetReportItem({
  report,
  onPress,
  onVerify,
}: {
  report: IncidentReport;
  onPress: () => void;
  onVerify: () => void;
}) {
  const meta = getIncidentDisplayMeta({
    category: report.category,
    subcategory: report.subcategory ?? report.type,
  });

  return (
    <AppCard onPress={onPress} style={styles.reportCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: meta.lightColor }]}>
          <Ionicons name={meta.iconName} size={20} color={meta.color} />
        </View>
        <View style={styles.cardHeaderTexts}>
          <Text style={styles.cardTitle} numberOfLines={1}>{report.title}</Text>
          <Text style={styles.cardMeta} numberOfLines={1}>{meta.label}</Text>
        </View>
        {(report.urgencyLevel === "high" || report.severity === "high") && (
          <StatusBadge label="DARURAT" variant="danger" size="sm" />
        )}
      </View>
      
      <Text style={styles.cardDescription} numberOfLines={2}>
        {report.description || "Tidak ada detail tambahan."}
      </Text>

      <View style={styles.cardActions}>
        <Pressable onPress={onVerify} style={styles.actionBtn}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.actionBtnText}>Verifikasi</Text>
        </Pressable>
        <Pressable onPress={onPress} style={styles.actionBtn}>
          <Ionicons name="chatbubbles-outline" size={18} color={colors.textMuted} />
          <Text style={styles.actionBtnTextMuted}>Lihat Diskusi</Text>
        </Pressable>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    ...shadow.floating,
    elevation: 8,
  },
  sheetHandleContainer: {
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  anchorBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  anchorTextRow: {
    flex: 1,
  },
  anchorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  anchorSubtitle: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 2,
  },
  nearestBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainer,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  nearestText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  listContainer: {
    marginTop: spacing.sm,
  },
  listContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  reportCard: {
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderTexts: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSoft,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: "row",
    gap: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  actionBtnTextMuted: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
