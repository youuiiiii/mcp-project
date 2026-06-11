import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, spacing, shadow } from "../../../theme/layout";

type HomeHeroProps = {
  displayName: string;
  initials: string;
  activeCount: number;
  highSeverityCount: number;
  onOpenProfile: () => void;
  onOpenMap: () => void;
  onOpenReport: (kind?: string) => void;
  onOpenSos: () => void;
  onOpenAnalytics?: () => void;
  onOpenEarthquake?: () => void;
  onOpenEducation?: () => void;
};

export default function HomeHero({
  displayName,
  initials,
  activeCount,
  highSeverityCount,
  onOpenProfile,
  onOpenMap,
  onOpenReport,
  onOpenSos,
}: HomeHeroProps) {
  const { t } = useI18n();

  // SIGAP Categories
  const categories = [
    { label: "Kebakaran", icon: "flame" as const, color: colors.dangerSoft, iconColor: colors.danger, kind: "fire_or_smoke" },
    { label: "Banjir", icon: "water" as const, color: colors.infoSoft, iconColor: colors.info, kind: "flood_or_weather" },
    { label: "Gempa Bumi", icon: "pulse" as const, color: colors.warningSoft, iconColor: colors.warning, kind: "earthquake" },
    { label: "Tanah Longsor", icon: "trail-sign" as const, color: "#FDE68A", iconColor: "#B45309", kind: "landslide" },
    { label: "Angin Kencang", icon: "cloudy" as const, color: colors.surfaceContainer, iconColor: colors.textMuted, kind: "strong_wind" },
    { label: "Lainnya", icon: "grid" as const, color: colors.surfaceContainer, iconColor: colors.textMuted, kind: "other_incident" },
  ];

  return (
    <View style={styles.wrapper}>
      {/* 1. Header Sapaan & Notification */}
      <View style={styles.greetingRow}>
        <View style={styles.identity}>
          <Text style={styles.greeting}>Halo,</Text>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
        </View>

        <View style={styles.rightGroup}>
          <Pressable
            onPress={onOpenSos}
            style={({ pressed }) => [
              styles.sosButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            {activeCount > 0 && (
              <View style={styles.notificationBadge} />
            )}
          </Pressable>
          <Pressable
            onPress={onOpenProfile}
            style={({ pressed }) => [
              styles.avatar,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </Pressable>
        </View>
      </View>

      {/* 2. Map Preview */}
      <Pressable onPress={onOpenMap} style={styles.mapPreviewContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapPreview}
          initialRegion={{
            latitude: -6.200000,
            longitude: 106.816666,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
           {/* Mock marker for preview */}
           <Marker coordinate={{ latitude: -6.200000, longitude: 106.816666 }}>
             <View style={styles.markerBadge}>
               <Ionicons name="alert" size={12} color="#FFF" />
             </View>
           </Marker>
        </MapView>
        <View style={styles.mapOverlay}>
          <Text style={styles.mapOverlayText}>Lihat Peta Sekitar</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primaryDark} />
        </View>
      </Pressable>

      {/* 3. Grid Kategori Laporan */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Kategori Bencana</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat, idx) => (
            <Pressable
              key={idx}
              onPress={() => onOpenReport(cat.kind)}
              style={({ pressed }) => [
                styles.categoryItem,
                pressed && styles.buttonPressed,
              ]}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon} size={28} color={cat.iconColor} />
              </View>
              <Text style={styles.categoryLabel} numberOfLines={2}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.lg,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  identity: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: colors.textMuted,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 2,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  sosButton: {
    position: "relative",
    padding: 4,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textInverse,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  mapPreviewContainer: {
    height: 140,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainer,
    ...shadow.sm,
  },
  mapPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  markerBadge: {
    backgroundColor: colors.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  mapOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mapOverlayText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primaryDark,
  },
  categoriesSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 16,
  },
  categoryItem: {
    width: "30%", // approx 3 items per row
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.sm,
  },
  categoryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20, // Squircle shape for SIGAP
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
});
