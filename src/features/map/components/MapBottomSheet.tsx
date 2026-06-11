import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import IncidentCard from "../../../components/IncidentCard";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";
import { formatDistance } from "../../../utils/geo";
import { getReportDisplayMeta } from "../utils/reportDisplayMeta";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MINIMIZED_HEIGHT = 130;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.7;

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
}: MapBottomSheetProps) {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(MINIMIZED_HEIGHT)).current;

  const toggleSheet = () => {
    const toValue = expanded ? MINIMIZED_HEIGHT : EXPANDED_HEIGHT;
    Animated.spring(heightAnim, {
      toValue,
      useNativeDriver: false,
      bounciness: 0, // Solid operational feel, no bouncy spring
    }).start();
    setExpanded(!expanded);
  };

  const activeCount = reports.filter((r) => r.status === "active").length;

  const nearestMeta = nearestIncident.incident
    ? getReportDisplayMeta(nearestIncident.incident)
    : null;

  return (
    <Animated.View style={[styles.bottomSheet, { height: heightAnim }]}>
      <Pressable onPress={toggleSheet} style={styles.headerPanel}>
        <View style={styles.sheetHandle} />
        <View style={styles.anchorTextRow}>
          <Text style={styles.anchorTitle}>
            {activeCount} Active Incidents Nearby
          </Text>
          <Text style={styles.anchorSubtitle}>
            {expanded ? "Pull down to collapse" : "Pull up for details"}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-down" : "chevron-up"}
          size={24}
          color={colors.textInverse}
        />
      </Pressable>

      <View style={styles.content}>
        {!expanded && nearestIncident.incident && nearestMeta && nearestIncident.distance !== null && (
          <View style={styles.nearestBanner}>
            <Ionicons name={nearestMeta.iconName} size={18} color={colors.textInverse} />
            <Text style={styles.nearestText} numberOfLines={1}>
              Nearest: {nearestMeta.label} ({formatDistance(nearestIncident.distance)})
            </Text>
            <Pressable style={styles.nearestBtn} onPress={() => onOpenThread(nearestIncident.incident!)}>
              <Text style={styles.nearestBtnText}>View</Text>
            </Pressable>
          </View>
        )}

        {expanded && (
          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {reports.map((report) => (
              <IncidentCard
                key={report.id}
                incident={report}
                onPress={onOpenThread}
              />
            ))}
            {reports.length === 0 && (
              <Text style={styles.emptyText}>No incidents match the current filter.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceMuted, 
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    ...shadow.floating,
    elevation: 16,
    overflow: "hidden", 
  },
  headerPanel: {
    backgroundColor: "#164e63", // Dark Slate/Teal
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  sheetHandle: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    width: 36,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    left: "50%",
    marginLeft: -18,
  },
  anchorTextRow: {
    flex: 1,
    marginTop: 12,
  },
  anchorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textInverse,
  },
  anchorSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  nearestBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger, 
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  nearestText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textInverse,
    flex: 1,
  },
  nearestBtn: {
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  nearestBtnText: {
    color: colors.textInverse,
    fontWeight: "700",
    fontSize: 12,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 3,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
    fontWeight: "600",
  },
});
