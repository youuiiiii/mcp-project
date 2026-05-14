import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import SectionHeader from "../../../components/ui/SectionHeader";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type QuickActionsGridProps = {
  onOpenMap: () => void;
  onOpenReport: () => void;
};

export default function QuickActionsGrid({
  onOpenMap,
  onOpenReport,
}: QuickActionsGridProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Quick Actions"
        subtitle="Akses fitur utama tanpa membuka menu yang tidak perlu."
      />

      <View style={styles.grid}>
        <QuickActionCard
          title="Report Incident"
          description="Buat laporan kejadian dari lokasi Anda saat ini."
          iconName="add-circle"
          iconColor={colors.danger}
          onPress={onOpenReport}
        />

        <QuickActionCard
          title="Open Map"
          description="Lihat pin laporan warga di sekitar Anda."
          iconName="map"
          iconColor={colors.info}
          onPress={onOpenMap}
        />
      </View>
    </View>
  );
}

function QuickActionCard({
  title,
  description,
  iconName,
  iconColor,
  onPress,
}: {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  onPress: () => void;
}) {
  return (
    <AppCard onPress={onPress} style={styles.card}>
      <IconBadge
        variant="neutral"
        size="lg"
        rounded={false}
        style={{
          backgroundColor: colors.surfaceMuted,
        }}
      >
        <Ionicons name={iconName} size={24} color={iconColor} />
      </IconBadge>

      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  grid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  card: {
    flex: 1,
    minHeight: 150,
    justifyContent: "space-between",
  },
  cardTitle: {
    marginTop: spacing.md,
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  cardDescription: {
    marginTop: spacing.xs,
    ...typography.caption,
    color: colors.textMuted,
  },
});