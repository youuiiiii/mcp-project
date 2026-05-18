import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import SectionHeader from "../../../components/ui/SectionHeader";
import { REPORT_KIND_OPTIONS } from "../../../constants/reportTaxonomy";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
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

      <View style={styles.list}>
        {REPORT_KIND_OPTIONS.map((item) => {
          const active = selectedKind === item.value;

          return (
            <Pressable
              key={item.value}
              disabled={disabled}
              onPress={() => onSelectKind(item.value)}
              style={({ pressed }) => [
                styles.row,
                active && {
                  borderColor: item.color,
                  backgroundColor: item.lightColor,
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
                  size={21}
                  color={active ? colors.textInverse : item.color}
                />
              </View>

              <View style={styles.textGroup}>
                <Text
                  style={[styles.label, active && { color: item.color }]}
                  numberOfLines={1}
                >
                  {t(item.labelKey)}
                </Text>

                <Text style={styles.helper} numberOfLines={2}>
                  {t(item.helperKey)}
                </Text>
              </View>

              <Ionicons
                name={active ? "checkmark-circle" : "ellipse-outline"}
                size={21}
                color={active ? item.color : colors.textSoft}
              />
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
  list: {
    gap: spacing.sm,
  },
  row: {
    minHeight: 74,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  helper: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
