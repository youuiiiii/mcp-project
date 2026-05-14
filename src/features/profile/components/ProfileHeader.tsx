import { StyleSheet, Text, View } from "react-native";

import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type ProfileHeaderProps = {
  displayName: string;
  userEmail: string;
  userInitial: string;
};

export default function ProfileHeader({
  displayName,
  userEmail,
  userInitial,
}: ProfileHeaderProps) {
  return (
    <View style={styles.hero}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{userInitial}</Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {displayName}
      </Text>

      <Text style={styles.email} numberOfLines={1}>
        {userEmail}
      </Text>

      <StatusBadge
        label="Community Reporter"
        variant="info"
        size="sm"
        style={styles.roleBadge}
        textStyle={styles.roleBadgeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.dark,
    borderRadius: radius["3xl"],
    padding: spacing["2xl"],
    alignItems: "center",
    ...shadow.floating,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: radius["2xl"],
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },
  name: {
    maxWidth: "100%",
    fontSize: 24,
    fontWeight: "900",
    color: colors.textInverse,
    textAlign: "center",
  },
  email: {
    maxWidth: "100%",
    marginTop: spacing.xs,
    ...typography.caption,
    color: colors.textSoft,
    textAlign: "center",
  },
  roleBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.darkSoft,
  },
  roleBadgeText: {
    color: colors.textInverse,
  },
});