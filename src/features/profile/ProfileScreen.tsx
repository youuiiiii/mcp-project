import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

import { type Href, useRouter } from "expo-router";
import AppButton from "../../components/ui/AppButton";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import { isModeratorEmail } from "../../constants/moderators";
import { colors } from "../../theme/colors";
import { radius, shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import type { ProfileStats } from "./hooks/useProfileScreen";
import { useProfileScreen } from "./hooks/useProfileScreen";

export default function ProfileScreen() {
  const {
    loading,
    errorMessage,
    displayName,
    userEmail,
    userInitial,
    stats,
    handleLogout,
  } = useProfileScreen();

  const router = useRouter();
  const isModerator = isModeratorEmail(userEmail);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const openModeration = () => {
    router.push("/moderation" as Href);
  };

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Loading profile..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppCard style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {userEmail}
          </Text>
          <View style={styles.rolePill}>
            <Ionicons name="shield-checkmark" size={14} color={colors.info} />
            <Text style={styles.roleText}>Community Reporter</Text>
          </View>
        </View>
      </AppCard>

      {errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <Ionicons name="warning" size={18} color={colors.danger} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </AppCard>
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          title="Contribution"
          subtitle="Summary of reports from this account."
        />
        <StatsStrip stats={stats} />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Account"
          subtitle="Basic information and account settings."
        />
        <AppCard style={styles.accountCard}>
          <AccountRow iconName="person-outline" label="Name" value={displayName} />
          <View style={styles.divider} />
          <AccountRow iconName="mail-outline" label="Email" value={userEmail} />
        </AppCard>
      </View>

      {isModerator ? (
        <View style={styles.section}>
          <SectionHeader
            title="Moderator"
            subtitle="Review content reports from community."
          />
          <AppCard style={styles.moderatorCard}>
            <View style={styles.moderatorIcon}>
              <Ionicons name="shield-checkmark" size={22} color={colors.info} />
            </View>
            <View style={styles.moderatorText}>
              <Text style={styles.moderatorTitle}>Moderation Queue</Text>
              <Text style={styles.moderatorDescription}>
                Review reported content and hide problematic reports.
              </Text>
            </View>
            <AppButton
              title="Open"
              variant="secondary"
              size="sm"
              onPress={openModeration}
            />
          </AppCard>
        </View>
      ) : null}

      <AppButton
        title="Logout"
        variant="danger"
        size="lg"
        fullWidth
        onPress={() => setLogoutModalVisible(true)}
        leftIcon={
          <Ionicons name="log-out-outline" size={20} color={colors.textInverse} />
        }
        style={styles.logoutButton}
      />

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="log-out-outline" size={32} color={colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out of your account?
            </Text>
            <View style={styles.modalBtnRow}>
              <AppButton
                title="Cancel"
                variant="secondary"
                size="md"
                onPress={() => setLogoutModalVisible(false)}
                style={styles.modalBtnCancel}
              />
              <AppButton
                title="Logout"
                variant="danger"
                size="md"
                onPress={() => {
                  setLogoutModalVisible(false);
                  handleLogout();
                }}
                style={styles.modalBtnLogout}
              />
            </View>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

function StatsStrip({ stats }: { stats: ProfileStats }) {
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

function AccountRow({
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

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
  },
  content: {
    gap: spacing["2xl"],
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius["2xl"],
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textInverse,
  },
  identity: {
    flex: 1,
  },
  name: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
  },
  email: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  rolePill: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.infoSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.infoDark,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderColor: "#FECACA",
  },
  errorText: {
    flex: 1,
    ...typography.caption,
    color: colors.primaryDark,
  },
  section: {
    gap: spacing.md,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  statDivider: {
    position: "absolute",
    right: 0,
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: colors.border,
  },
  accountCard: {
    paddingVertical: spacing.md,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  accountIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  accountText: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
  },
  accountValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  logoutButton: {
    ...shadow.floating,
    shadowColor: colors.primaryDark,
  },
  moderatorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  moderatorIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    backgroundColor: colors.infoSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  moderatorText: {
    flex: 1,
  },
  moderatorTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  moderatorDescription: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: spacing.md,
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
  },
  modalMessage: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
    marginTop: spacing.sm,
  },
  modalBtnCancel: {
    flex: 1,
  },
  modalBtnLogout: {
    flex: 1,
  },
});