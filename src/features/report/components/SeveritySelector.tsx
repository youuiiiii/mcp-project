import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import SectionHeader from "../../../components/ui/SectionHeader";
import { SEVERITY_OPTIONS } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentSeverity } from "../../../types/incident";

type SeveritySelectorProps = {
  value: IncidentSeverity;
  onChange: (value: IncidentSeverity) => void;
};

export default function SeveritySelector({
  value,
  onChange,
}: SeveritySelectorProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="3. Severity"
        subtitle="Pilih seberapa mendesak kondisi saat ini."
        style={styles.sectionHeader}
      />

      <View style={styles.severityRow}>
        {SEVERITY_OPTIONS.map((item) => {
          const active = value === item.value;

          return (
            <AppCard
              key={item.value}
              onPress={() => onChange(item.value)}
              padding="sm"
              style={[
                styles.severityCard,
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

              <Text
                style={[
                  styles.severityLabel,
                  active && styles.severityLabelActive,
                ]}
              >
                {item.label}
              </Text>

              <Text
                style={[
                  styles.severityDescription,
                  active && styles.severityDescriptionActive,
                ]}
              >
                {item.description}
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
  sectionHeader: {
    marginBottom: 0,
  },
  severityRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  severityCard: {
    flex: 1,
    minHeight: 112,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    marginTop: spacing.sm,
  },
  severityLabelActive: {
    color: colors.textInverse,
  },
  severityDescription: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 4,
  },
  severityDescriptionActive: {
    color: colors.textInverse,
  },
});