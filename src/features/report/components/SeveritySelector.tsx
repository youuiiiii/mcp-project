import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import SectionHeader from "../../../components/ui/SectionHeader";
import { SEVERITY_OPTIONS } from "../../../constants/incident";
import {
  getIncidentSeverityDescription,
  getIncidentSeverityLabel,
  useI18n,
} from "../../../i18n";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import type { IncidentSeverity } from "../../../types/incident";

type SeveritySelectorProps = {
  selectedSeverity: IncidentSeverity;
  disabled?: boolean;
  onSelectSeverity: (severity: IncidentSeverity) => void;
};

export default function SeveritySelector({
  selectedSeverity,
  disabled = false,
  onSelectSeverity,
}: SeveritySelectorProps) {
  const { t } = useI18n();

  return (
    <View style={styles.section}>
      <SectionHeader
        title={t("report.severity.title")}
        subtitle={t("report.severity.subtitle")}
      />

      <View style={styles.row}>
        {SEVERITY_OPTIONS.map((item) => {
          const active = selectedSeverity === item.value;
          const label = getIncidentSeverityLabel(t, item.value);
          const description = getIncidentSeverityDescription(t, item.value);

          return (
            <AppCard
              key={item.value}
              onPress={disabled ? undefined : () => onSelectSeverity(item.value)}
              padding="sm"
              style={[
                styles.card,
                active && {
                  borderColor: item.color,
                  backgroundColor: item.color,
                },
              ]}
            >
              <Ionicons
                name={item.iconName}
                size={22}
                color={active ? colors.textInverse : item.color}
              />

              <Text style={[styles.label, active && styles.labelActive]}>
                {label}
              </Text>

              <Text
                style={[
                  styles.description,
                  active && styles.descriptionActive,
                ]}
              >
                {description}
              </Text>
            </AppCard>
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
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    minHeight: 116,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  labelActive: {
    color: colors.textInverse,
  },
  description: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    lineHeight: 14,
  },
  descriptionActive: {
    color: colors.textInverse,
  },
});
