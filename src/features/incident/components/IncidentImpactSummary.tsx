import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { IMPACT_QUESTION_OPTIONS } from "../../../constants/reportTaxonomy";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import type { IncidentImpactAnswers } from "../../../types/incident";

type IncidentImpactSummaryProps = {
  impactAnswers?: IncidentImpactAnswers;
};

export default function IncidentImpactSummary({
  impactAnswers,
}: IncidentImpactSummaryProps) {
  const { t } = useI18n();
  const activeImpacts = IMPACT_QUESTION_OPTIONS.filter((item) => {
    return impactAnswers?.[item.value] === true;
  });

  if (activeImpacts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {activeImpacts.map((item) => (
        <View key={item.value} style={styles.chip}>
          <Ionicons name={item.iconName} size={14} color={colors.primaryDark} />
          <Text style={styles.text} numberOfLines={1}>
            {t(item.labelKey)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: radius.full,
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  text: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    color: colors.primaryDark,
  },
});
