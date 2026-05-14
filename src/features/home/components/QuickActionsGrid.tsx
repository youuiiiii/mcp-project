import { Ionicons } from "@expo/vector-icons";
import { type Href } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import SectionHeader from "../../../components/ui/SectionHeader";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import { HOME_ROUTES } from "../hooks/useHomeScreen";

type IconBadgeVariant = "danger" | "info" | "success" | "neutral";
type AppIconName = keyof typeof Ionicons.glyphMap;

type QuickAction = {
  title: string;
  description: string;
  route: Href;
  iconName: AppIconName;
  variant: IconBadgeVariant;
  primary?: boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Report Incident",
    description: "Buat laporan kejadian baru",
    route: HOME_ROUTES.report,
    iconName: "add-circle",
    variant: "danger",
    primary: true,
  },
  {
    title: "Open Map",
    description: "Pantau lokasi incident",
    route: HOME_ROUTES.map,
    iconName: "map",
    variant: "info",
  },
  {
    title: "Analytics",
    description: "Lihat ringkasan data",
    route: HOME_ROUTES.analytics,
    iconName: "stats-chart",
    variant: "success",
  },
  {
    title: "Profile",
    description: "Akun dan kontribusi",
    route: HOME_ROUTES.profile,
    iconName: "person",
    variant: "neutral",
  },
];

type QuickActionsGridProps = {
  onNavigate: (route: Href) => void;
};

export default function QuickActionsGrid({ onNavigate }: QuickActionsGridProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Quick Actions"
        subtitle="Akses fitur utama"
        style={styles.sectionHeader}
      />

      <View style={styles.quickGrid}>
        {QUICK_ACTIONS.map((item) => {
          const isPrimary = item.primary === true;

          return (
            <AppCard
              key={item.title}
              onPress={() => onNavigate(item.route)}
              padding="md"
              style={[styles.quickCard, isPrimary && styles.quickCardPrimary]}
            >
              <IconBadge
                variant={item.variant}
                size="lg"
                rounded={false}
                style={isPrimary && styles.quickIconPrimary}
              >
                <Ionicons
                  name={item.iconName}
                  size={26}
                  color={
                    isPrimary ? colors.textInverse : getIconColor(item.variant)
                  }
                />
              </IconBadge>

              <View style={styles.quickTextGroup}>
                <Text
                  style={[
                    styles.quickTitle,
                    isPrimary && styles.quickTitlePrimary,
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.quickDescription,
                    isPrimary && styles.quickDescriptionPrimary,
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            </AppCard>
          );
        })}
      </View>
    </View>
  );
}

function getIconColor(variant: IconBadgeVariant): string {
  switch (variant) {
    case "danger":
      return colors.danger;

    case "info":
      return colors.info;

    case "success":
      return colors.success;

    case "neutral":
    default:
      return colors.text;
  }
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  quickCard: {
    width: "48%",
    minHeight: 154,
    justifyContent: "space-between",
  },
  quickCardPrimary: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  quickIconPrimary: {
    backgroundColor: colors.primaryDark,
  },
  quickTextGroup: {
    marginTop: spacing.md,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  quickTitlePrimary: {
    color: colors.textInverse,
  },
  quickDescription: {
    marginTop: spacing.xs,
    ...typography.caption,
    color: colors.textMuted,
  },
  quickDescriptionPrimary: {
    color: colors.primarySoft,
  },
});