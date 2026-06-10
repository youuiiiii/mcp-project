import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View, TextInput } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import StatusBadge from "../../../components/ui/StatusBadge";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";

type HomeHeroProps = {
  displayName: string;
  initials: string;
  activeCount: number;
  highSeverityCount: number;
  onOpenProfile: () => void;
  onOpenMap: () => void;
  onOpenReport: () => void;
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

  const categories = [
    { label: "Banjir / Cuaca", icon: "rainy-outline" as const, color: "#E2ECE9", iconColor: "#2F5C50" },
    { label: "Kebakaran", icon: "flame-outline" as const, color: "#FADCDA", iconColor: "#8D1B1B" },
    { label: "Kecelakaan", icon: "car-outline" as const, color: "#F5ECD7", iconColor: "#6A5320" },
    { label: "Medis / Rescue", icon: "pulse-outline" as const, color: "#E2ECE3", iconColor: "#2D5A38" },
    { label: "Keamanan", icon: "shield-checkmark-outline" as const, color: "#E5ECE9", iconColor: "#3F6653" },
    { label: "Lainnya", icon: "options-outline" as const, color: "#ECE9E5", iconColor: "#4A4E4A" },
  ];

  const hasAlerts = activeCount > 0;

  return (
    <View style={styles.wrapper}>
      {/* 1. Header Sapaan & Avatar (Wecare style) */}
      <View style={styles.greetingRow}>
        <View style={styles.identity}>
          <Text style={styles.greeting}>{t("home.hero.greeting")},</Text>
          <View style={styles.locationWrapper}>
            <Ionicons name="location-sharp" size={14} color={colors.primary} />
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </View>

        <View style={styles.rightGroup}>
          <Pressable
            onPress={onOpenSos}
            style={({ pressed }) => [
              styles.sosButton,
              pressed && styles.sosButtonPressed,
            ]}
          >
            <Ionicons name="alert-circle" size={16} color="#FFFFFF" />
            <Text style={styles.sosText}>SOS</Text>
          </Pressable>

          <Pressable
            onPress={onOpenProfile}
            style={({ pressed }) => [
              styles.avatar,
              pressed && styles.avatarPressed,
            ]}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </Pressable>
        </View>
      </View>

      {/* 2. Mock Search Bar (Wecare style) */}
      <View style={styles.searchBarWrapper}>
        <Ionicons name="search" size={20} color={colors.textSoft} style={styles.searchIcon} />
        <TextInput
          placeholder="Search disaster alerts..."
          placeholderTextColor={colors.textSoft}
          style={styles.searchInput}
          editable={false}
        />
      </View>

      {/* 3. Grid Kategori Laporan (Wecare style) */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Lapor Kejadian</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat, idx) => (
            <Pressable
              key={idx}
              onPress={onOpenReport}
              style={({ pressed }) => [
                styles.categoryItem,
                pressed && styles.categoryItemPressed,
              ]}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon} size={24} color={cat.iconColor} />
              </View>
              <Text style={styles.categoryLabel} numberOfLines={2}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 4. Active Alert Summary Card */}
      <AppCard style={[styles.card, hasAlerts ? styles.cardAlert : styles.cardSafe]}>
        <View style={styles.messageBlock}>
          <StatusBadge
            label={hasAlerts ? "Peringatan Aktif" : t("home.hero.statusBadge")}
            variant={hasAlerts ? "warning" : "verified"}
            size="sm"
          />

          <Text style={styles.title}>
            {hasAlerts ? "Waspada Bencana Sekitar" : t("home.hero.title")}
          </Text>

          <Text style={[styles.summaryText, hasAlerts ? styles.summaryTextAlert : styles.summaryTextSafe]}>
            {hasAlerts
              ? t("home.hero.summary", { activeCount, attentionCount: highSeverityCount })
              : "Kondisi di sekitar area Anda saat ini terpantau aman dan kondusif."}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={onOpenReport}
            style={({ pressed }) => [
              styles.cardActionBtn,
              pressed && styles.cardActionBtnPressed,
            ]}
          >
            <Text style={styles.cardActionBtnText}>{t("home.actions.reportIncident")}</Text>
          </Pressable>

          <View style={styles.actionDivider} />

          <Pressable
            onPress={onOpenMap}
            style={({ pressed }) => [
              styles.cardActionBtn,
              pressed && styles.cardActionBtnPressed,
            ]}
          >
            <Text style={styles.cardActionBtnText}>{t("home.actions.viewMap")}</Text>
          </Pressable>
        </View>
      </AppCard>
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
    marginTop: spacing.xs,
  },
  identity: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sosButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
  },
  sosButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  sosText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary, // Forest green avatar background
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primarySoft,
  },
  avatarPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textInverse,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,          // Warm cream input background
    borderWidth: 0,
    borderRadius: radius.md,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  categoriesSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryItem: {
    width: "30%", // 3 items per row
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  categoryItemPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  categoryIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700", // Terra label/body weights
    color: colors.text,
    textAlign: "center",
  },
  card: {
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cardSafe: {
    backgroundColor: "rgba(74, 124, 89, 0.08)",    // Translucent Terra primary
    borderColor: colors.primarySoft,
    borderWidth: 1,
  },
  cardAlert: {
    backgroundColor: "rgba(112, 92, 48, 0.08)",     // Translucent Terra warning/tertiary
    borderColor: colors.warningSoft,
    borderWidth: 1,
  },
  messageBlock: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 2,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
  summaryTextSafe: {
    color: colors.primaryDark,
  },
  summaryTextAlert: {
    color: colors.warningDark,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(196, 200, 188, 0.3)", // outline-variant at 30%
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  cardActionBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  cardActionBtnPressed: {
    opacity: 0.7,
  },
  cardActionBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary, // Forest green text link
  },
  actionDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(196, 200, 188, 0.3)", // outline-variant at 30%
  },
});
