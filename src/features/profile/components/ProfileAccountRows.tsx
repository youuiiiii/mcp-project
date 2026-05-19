import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import { colors } from "../../../theme/colors";
import type { ProfileStats } from "../hooks/useProfileScreen";
import { profileStyles as styles } from "../profileStyles";

export function StatsStrip({ stats }: { stats: ProfileStats }) {
  const items = [
    {
      label: "Total",
      value: stats.totalReports,
      iconName: "document-text-outline" as const,
      color: colors.info,
    },
    {
      label: "Active",
      value: stats.activeReports,
      iconName: "radio" as const,
      color: colors.danger,
    },
    {
      label: "Resolved",
      value: stats.resolvedReports,
      iconName: "checkmark-circle-outline" as const,
      color: colors.success,
    },
    {
      label: "High",
      value: stats.highSeverityReports,
      iconName: "warning-outline" as const,
      color: colors.warningDark,
    },
  ];

  return (
    <AppCard style={styles.statsCard}>
      {items.map((item, index) => (
        <View key={item.label} style={styles.statItem}>
          <Ionicons name={item.iconName} size={18} color={item.color} />
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
          {index < items.length - 1 ? <View style={styles.statDivider} /> : null}
        </View>
      ))}
    </AppCard>
  );
}

export function EditableNameRow({
  value,
  draftValue,
  isEditing,
  saving,
  onChange,
  onEdit,
  onCancel,
  onSubmit,
}: {
  value: string;
  draftValue: string;
  isEditing: boolean;
  saving: boolean;
  onChange: (value: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.accountRow}>
      <View style={styles.accountIcon}>
        <Ionicons name="person-outline" size={19} color={colors.textMuted} />
      </View>

      <View style={styles.accountText}>
        <Text style={styles.accountLabel}>Nama</Text>

        {isEditing ? (
          <TextInput
            value={draftValue}
            onChangeText={onChange}
            editable={!saving}
            autoFocus
            placeholder="Masukkan nama"
            placeholderTextColor={colors.textSoft}
            style={styles.accountNameInput}
          />
        ) : (
          <Text style={styles.accountValue} numberOfLines={1}>
            {value}
          </Text>
        )}
      </View>

      {isEditing ? (
        <View style={styles.inlineActions}>
          <Pressable
            onPress={onSubmit}
            disabled={saving || draftValue.trim().length < 2}
            style={({ pressed }) => [
              styles.inlineActionButton,
              pressed && styles.inlineActionPressed,
            ]}
          >
            <Ionicons name="checkmark" size={18} color={colors.success} />
          </Pressable>

          <Pressable
            onPress={onCancel}
            disabled={saving}
            style={({ pressed }) => [
              styles.inlineActionButton,
              pressed && styles.inlineActionPressed,
            ]}
          >
            <Ionicons name="close" size={18} color={colors.danger} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            styles.editNameButton,
            pressed && styles.inlineActionPressed,
          ]}
        >
          <Ionicons name="pencil" size={16} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

export function AccountRow({
  iconName,
  label,
  value,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.accountRow}>
      <View style={styles.accountIcon}>
        <Ionicons name={iconName} size={19} color={colors.textMuted} />
      </View>
      <View style={styles.accountText}>
        <Text style={styles.accountLabel}>{label}</Text>
        <Text style={styles.accountValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}
