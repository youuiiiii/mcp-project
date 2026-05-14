import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import SectionHeader from "../../../components/ui/SectionHeader";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type AppIconName = keyof typeof Ionicons.glyphMap;

type AccountInfoItem = {
  iconName: AppIconName;
  label: string;
  value: string;
};

type ProfileAccountCardProps = {
  displayName: string;
  userEmail: string;
};

export default function ProfileAccountCard({
  displayName,
  userEmail,
}: ProfileAccountCardProps) {
  const items: AccountInfoItem[] = [
    {
      iconName: "person-circle",
      label: "Nama",
      value: displayName,
    },
    {
      iconName: "mail",
      label: "Email",
      value: userEmail,
    },
    {
      iconName: "shield-checkmark",
      label: "Peran",
      value: "Community Reporter",
    },
  ];

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Informasi Akun"
        subtitle="Identitas akun yang digunakan untuk laporan"
        style={styles.sectionHeader}
      />

      <AppCard style={styles.card}>
        {items.map((item, index) => (
          <View key={item.label}>
            <View style={styles.infoRow}>
              <IconBadge variant="neutral" size="md" rounded={false}>
                <Ionicons name={item.iconName} size={22} color={colors.text} />
              </IconBadge>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
            </View>

            {index < items.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))}
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  card: {
    paddingVertical: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});