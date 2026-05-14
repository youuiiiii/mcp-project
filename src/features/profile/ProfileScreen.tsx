import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import IconBadge from "../../components/ui/IconBadge";
import LoadingState from "../../components/ui/LoadingState";
import { colors } from "../../theme/colors";
import { shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import ProfileAccountCard from "./components/ProfileAccountCard";
import ProfileHeader from "./components/ProfileHeader";
import ProfileSafetyReminder from "./components/ProfileSafetyReminder";
import ProfileStatsGrid from "./components/ProfileStatsGrid";
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

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Memuat profil..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen contentContainerStyle={styles.screenContent}>
      <ProfileHeader
        displayName={displayName}
        userEmail={userEmail}
        userInitial={userInitial}
      />

      {errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Sebagian data gagal dimuat</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        </AppCard>
      ) : null}

      <ProfileStatsGrid stats={stats} />

      {stats.highSeverityReports > 0 ? (
        <AppCard variant="muted" style={styles.highSeverityCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.highSeverityContent}>
            <Text style={styles.highSeverityTitle}>Laporan Severity Tinggi</Text>
            <Text style={styles.highSeverityText}>
              Kamu memiliki {stats.highSeverityReports} laporan severity tinggi.
              Pantau thread laporan untuk melihat update terbaru.
            </Text>
          </View>
        </AppCard>
      ) : null}

      <ProfileAccountCard displayName={displayName} userEmail={userEmail} />

      <ProfileSafetyReminder />

      <AppButton
        title="Logout"
        variant="danger"
        size="lg"
        fullWidth
        onPress={handleLogout}
        leftIcon={
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.textInverse}
          />
        }
        style={styles.logoutButton}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
  },
  screenContent: {
    gap: spacing["2xl"],
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.textMuted,
  },
  highSeverityCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  highSeverityContent: {
    flex: 1,
  },
  highSeverityTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  highSeverityText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  logoutButton: {
    ...shadow.floating,
    shadowColor: colors.primaryDark,
  },
});