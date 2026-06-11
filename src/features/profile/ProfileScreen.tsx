import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import LoadingState from "../../components/ui/LoadingState";
import { useAuth } from "../../contexts/AuthContext";
import { useI18n } from "../../i18n";
import { fetchRecentBmkgEarthquakes } from "../../services/bmkgService";
import {
  checkAndNotifyNearbyDisaster,
  checkAndNotifyNearbyIncidents,
} from "../../services/notifications";
import { colors } from "../../theme/colors";
import type { ProfileStats } from "./hooks/useProfileScreen";
import { useProfileScreen } from "./hooks/useProfileScreen";
import { profileStyles as styles } from "./profileStyles";

const EARTHQUAKE_ROUTE = "/earthquake" as Href;
const EDUCATION_ROUTE = "/education" as Href;
const MODERATION_ROUTE = "/moderation" as Href;
const ACTIVITY_ROUTE = "/(tabs)/activity" as Href;

type AppIconName = keyof typeof Ionicons.glyphMap;

export default function ProfileScreen() {
  const {
    loading,
    savingProfile,
    errorMessage,
    displayName,
    userEmail,
    userInitial,
    draftName,
    setDraftName,
    draftPhotoUri,
    reports,
    stats,
    pickProfilePhoto,
    saveProfile,
    handleLogout,
  } = useProfileScreen();

  const router = useRouter();
  const { isModerator, roleLoading } = useAuth();
  const { t, language, languageOptions, setLanguage } = useI18n();
  const [isEditingName, setIsEditingName] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [checkingAlerts, setCheckingAlerts] = useState(false);
  const [checkingBmkg, setCheckingBmkg] = useState(false);

  const roleLabel = isModerator
    ? t("profile.role.moderator")
    : t("profile.role.communityMember");
  const profileImageUri = draftPhotoUri;

  const submitName = async () => {
    if (draftName.trim() === displayName) {
      setIsEditingName(false);
      return;
    }

    if (draftName.trim().length < 2) {
      Alert.alert(
        t("profile.alert.nameTooShort.title"),
        t("profile.alert.nameTooShort.message")
      );
      return;
    }

    await saveProfile();
    setIsEditingName(false);
  };

  const cancelEditName = () => {
    setDraftName(displayName);
    setIsEditingName(false);
  };

  const handleNearbyAlerts = async () => {
    setCheckingAlerts(true);

    const result = await checkAndNotifyNearbyIncidents(reports);

    setCheckingAlerts(false);
    Alert.alert(
      result.notified
        ? t("profile.alert.nearbySent.title")
        : t("profile.alert.nearbyChecked.title"),
      result.message
    );
  };

  const handleBmkgAlerts = async () => {
    try {
      setCheckingBmkg(true);
      const earthquakes = await fetchRecentBmkgEarthquakes();
      await checkAndNotifyNearbyDisaster(earthquakes);
      router.push(EARTHQUAKE_ROUTE);
    } catch (error) {
      Alert.alert(
        t("profile.alert.bmkgError.title"),
        error instanceof Error
          ? error.message
          : t("profile.alert.bmkgError.message")
      );
    } finally {
      setCheckingBmkg(false);
    }
  };

  const handleModerationPress = () => {
    if (isModerator) {
      router.push(MODERATION_ROUTE);
      return;
    }

    Alert.alert(
      t("profile.alert.moderationProtected.title"),
      t("profile.alert.moderationProtected.message")
    );
  };

  if (loading || roleLoading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Loading profile..." />
      </AppScreen>
    );
  }

  return (
    <>
      <AppScreen withPadding={false} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={["#0C7186", "#11B7D2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Pressable
            onPress={pickProfilePhoto}
            disabled={savingProfile}
            style={({ pressed }) => [
              styles.avatar,
              pressed && !savingProfile && styles.avatarPressed,
            ]}
          >
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{userInitial}</Text>
            )}

            <View style={styles.cameraBadge}>
              {savingProfile ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="pencil" size={15} color={colors.primary} />
              )}
            </View>
          </Pressable>

          <View style={styles.identity}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {displayName}
              </Text>
              <Pressable
                onPress={() => setIsEditingName(true)}
                style={({ pressed }) => [
                  styles.nameEditButton,
                  pressed && styles.inlineActionPressed,
                ]}
              >
                <Ionicons name="pencil" size={15} color={colors.textInverse} />
              </Pressable>
            </View>

            <Text style={styles.email} numberOfLines={1}>
              {userEmail}
            </Text>

            <View style={styles.rolePill}>
              <Ionicons name="location-outline" size={13} color={colors.textInverse} />
              <Text style={styles.roleText}>{roleLabel} - Indonesia</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <StatsPanel stats={stats} />

          {errorMessage ? (
            <AppCard variant="muted" style={styles.errorCard}>
              <Ionicons name="warning" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </AppCard>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("profile.title.badges")}</Text>
            <View style={styles.badgeGrid}>
              <AchievementBadge
                label={t("profile.badge.activeReporter")}
                iconName="flame"
                active={stats.totalReports > 0}
                color={colors.danger}
              />
              <AchievementBadge
                label={t("profile.badge.quickResponder")}
                iconName="flash"
                active={stats.highSeverityReports > 0}
                color={colors.warning}
              />
              <AchievementBadge
                label={t("profile.badge.contributor")}
                iconName="ribbon"
                active={stats.points > 0}
                color={colors.success}
              />
              <AchievementBadge
                label={t("profile.badge.volunteer")}
                iconName="shield"
                active={stats.areas >= 3}
                color={colors.info}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("profile.title.settings")}</Text>
            <AppCard style={styles.settingsCard} padding="none">
              <SettingsRow
                iconName="notifications-outline"
                title={t("profile.settings.nearbyAlerts")}
                subtitle={t("profile.settings.nearbyAlertsDesc")}
                busy={checkingAlerts}
                onPress={handleNearbyAlerts}
              />
              <SettingsRow
                iconName="pulse-outline"
                title={t("profile.settings.bmkg")}
                subtitle={t("profile.settings.bmkgDesc")}
                busy={checkingBmkg}
                onPress={handleBmkgAlerts}
              />
              <SettingsRow
                iconName="book-outline"
                title={t("profile.settings.education")}
                subtitle={t("profile.settings.educationDesc")}
                onPress={() => router.push(EDUCATION_ROUTE)}
              />
              <SettingsRow
                iconName="document-text-outline"
                title={t("profile.settings.history")}
                subtitle={t("profile.settings.historyDesc")}
                onPress={() => router.push(ACTIVITY_ROUTE)}
              />
              <SettingsRow
                iconName="shield-checkmark-outline"
                title={t("profile.settings.moderation")}
                subtitle={
                  isModerator
                    ? t("profile.settings.moderationDesc.mod")
                    : t("profile.settings.moderationDesc.user")
                }
                onPress={handleModerationPress}
              />
              <View style={styles.languageRow}>
                <View style={styles.settingsIcon}>
                  <Ionicons name="language-outline" size={20} color={colors.primary} />
                </View>
                <View style={styles.settingsText}>
                  <Text style={styles.settingsTitle}>{t("profile.settings.language")}</Text>
                  <Text style={styles.settingsSubtitle}>{t("profile.settings.languageDesc")}</Text>
                </View>
                <View style={styles.languageSwitch}>
                  {languageOptions.map((item) => {
                    const active = language === item.code;
                    return (
                      <Pressable
                        key={item.code}
                        onPress={() => setLanguage(item.code)}
                        style={({ pressed }) => [
                          styles.languageOption,
                          active && styles.languageOptionActive,
                          pressed && styles.inlineActionPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.languageOptionText,
                            active && styles.languageOptionTextActive,
                          ]}
                        >
                          {item.code.toUpperCase()}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </AppCard>
          </View>

          <Pressable
            onPress={() => setLogoutModalVisible(true)}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.inlineActionPressed,
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.logoutButtonText}>{t("profile.action.logout")}</Text>
          </Pressable>
        </View>
      </AppScreen>

      <Modal
        visible={isEditingName}
        transparent
        animationType="fade"
        onRequestClose={cancelEditName}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("profile.modal.editName.title")}</Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              editable={!savingProfile}
              autoFocus
              placeholder={t("profile.modal.editName.placeholder")}
              placeholderTextColor={colors.textSoft}
              style={styles.nameInput}
            />
            <View style={styles.modalBtnRow}>
              <AppButton
                title={t("common.cancel")}
                variant="secondary"
                size="md"
                onPress={cancelEditName}
                style={styles.modalBtnCancel}
              />
              <AppButton
                title={t("common.save")}
                variant="primary"
                size="md"
                loading={savingProfile}
                disabled={draftName.trim().length < 2}
                onPress={submitName}
                style={styles.modalBtnLogout}
              />
            </View>
          </View>
        </View>
      </Modal>

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
            <Text style={styles.modalTitle}>{t("profile.modal.logout.title")}</Text>
            <Text style={styles.modalMessage}>
              {t("profile.modal.logout.message")}
            </Text>
            <View style={styles.modalBtnRow}>
              <AppButton
                title={t("common.cancel")}
                variant="secondary"
                size="md"
                onPress={() => setLogoutModalVisible(false)}
                style={styles.modalBtnCancel}
              />
              <AppButton
                title={t("profile.action.logout")}
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
    </>
  );
}

function StatsPanel({ stats }: { stats: ProfileStats }) {
  const { t } = useI18n();
  const items = [
    {
      label: t("profile.stats.reports"),
      value: stats.totalReports,
      iconName: "document-text-outline" as const,
    },
    {
      label: t("profile.stats.points"),
      value: stats.points,
      iconName: "star-outline" as const,
    },
    {
      label: t("profile.stats.areas"),
      value: stats.areas,
      iconName: "location-outline" as const,
    },
    {
      label: t("profile.stats.badges"),
      value: stats.badges,
      iconName: "ribbon-outline" as const,
    },
  ];

  return (
    <View style={styles.statsBox}>
      {items.map((item) => (
        <View key={item.label} style={styles.statItem}>
          <Ionicons name={item.iconName} size={19} color={colors.primary} />
          <Text style={styles.statValue}>{item.value.toLocaleString()}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function AchievementBadge({
  label,
  iconName,
  active,
  color,
}: {
  label: string;
  iconName: AppIconName;
  active: boolean;
  color: string;
}) {
  return (
    <View style={[styles.badgeItem, !active && styles.badgeItemMuted]}>
      <View style={[styles.badgeIcon, { backgroundColor: `${color}1A` }]}>
        <Ionicons name={iconName} size={22} color={active ? color : colors.textSoft} />
      </View>
      <Text style={styles.badgeLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function SettingsRow({
  iconName,
  title,
  subtitle,
  busy = false,
  onPress,
}: {
  iconName: AppIconName;
  title: string;
  subtitle: string;
  busy?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => [
        styles.settingsRow,
        pressed && styles.inlineActionPressed,
        busy && styles.settingsRowBusy,
      ]}
    >
      <View style={styles.settingsIcon}>
        {busy ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name={iconName} size={20} color={colors.primary} />
        )}
      </View>
      <View style={styles.settingsText}>
        <Text style={styles.settingsTitle}>{title}</Text>
        <Text style={styles.settingsSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.borderStrong} />
    </Pressable>
  );
}
