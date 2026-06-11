import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import SectionHeader from "../../../components/ui/SectionHeader";
import { REPORT_KIND_OPTIONS } from "../../../constants/reportTaxonomy";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import type { IncidentKind } from "../../../types/incident";

type IncidentKindSelectorProps = {
  selectedKind: IncidentKind | null;
  disabled?: boolean;
  onSelectKind: (kind: IncidentKind) => void;
};

export default function IncidentKindSelector({
  selectedKind,
  disabled = false,
  onSelectKind,
}: IncidentKindSelectorProps) {
  const { t } = useI18n();

  return (
    <View style={styles.section}>
      <SectionHeader
        title={t("report.kind.title")}
        subtitle={t("report.kind.subtitle")}
      />

      <View style={styles.grid}>
        {REPORT_KIND_OPTIONS.map((item) => {
          const active = selectedKind === item.value;

          return (
            <Pressable
              key={item.value}
              disabled={disabled}
              onPress={() => onSelectKind(item.value)}
              style={({ pressed }) => [
                styles.card,
                active && {
                  borderColor: item.color,
                  backgroundColor: item.lightColor,
                  ...shadow.card,
                },
                disabled && styles.disabled,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: active ? item.color : colors.surfaceMuted,
                  },
                ]}
              >
                <Ionicons
                  name={item.iconName}
                  size={24}
                  color={active ? colors.textInverse : item.color}
                />
              </View>

              <Text
                style={[
                  styles.label,
                  active && { color: item.color },
                ]}
                numberOfLines={2}
              >
                {t(item.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: spacing.md,
  },
  card: {
    width: "48.5%",
    aspectRatio: 1.1,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    lineHeight: 16,
  },
});
