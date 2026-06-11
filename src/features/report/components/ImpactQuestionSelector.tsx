import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import SectionHeader from "../../../components/ui/SectionHeader";
import { IMPACT_QUESTION_OPTIONS } from "../../../constants/reportTaxonomy";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import type {
  IncidentImpactAnswers,
  IncidentImpactKey,
} from "../../../types/incident";

type ImpactQuestionSelectorProps = {
  answers: IncidentImpactAnswers;
  disabled?: boolean;
  onToggleAnswer: (key: IncidentImpactKey) => void;
};

export default function ImpactQuestionSelector({
  answers,
  disabled = false,
  onToggleAnswer,
}: ImpactQuestionSelectorProps) {
  const { t } = useI18n();

  return (
    <View style={styles.section}>
      <SectionHeader
        title={t("report.impact.title")}
      />

      <View style={styles.list}>
        {IMPACT_QUESTION_OPTIONS.map((item) => {
          const active = answers[item.value] === true;

          return (
            <Pressable
              key={item.value}
              disabled={disabled}
              onPress={() => onToggleAnswer(item.value)}
              style={({ pressed }) => [
                styles.row,
                active && styles.rowActive,
                disabled && styles.disabled,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.iconBox, active && styles.iconBoxActive]}>
                <Ionicons
                  name={item.iconName}
                  size={17}
                  color={active ? colors.textInverse : colors.textMuted}
                />
              </View>

              <View style={styles.textGroup}>
                <Text style={styles.label} numberOfLines={1}>
                  {t(item.labelKey)}
                </Text>
                <Text style={styles.helper} numberOfLines={1}>
                  {t(item.helperKey)}
                </Text>
              </View>

              <Ionicons
                name={active ? "toggle" : "toggle-outline"}
                size={24}
                color={active ? colors.danger : colors.textSoft}
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
    gap: spacing.sm,
  },
  list: {
    gap: 6,
  },
  row: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rowActive: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxActive: {
    backgroundColor: colors.danger,
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.text,
  },
  helper: {
    marginTop: 1,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
