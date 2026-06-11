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
  const { language, languageOptions, setLanguage } = useI18n();
  const [isEditingName, setIsEditingName] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [checkingAlerts, setCheckingAlerts] = useState(false);
  const [checkingBmkg, setCheckingBmkg] = useState(false);

  const roleLabel = isModerator ? "Moderator" : "Community Member";
  const profileImageUri = draftPhotoUri;

  const submitName = async () => {
    if (draftName.trim() === displayName) {
      setIsEditingName(false);
      return;
    }

    if (draftName.trim().length < 2) {
      Alert.alert("Name too short", "Name must be at least 2 characters.");
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
      result.notified ? "Nearby alert sent" : "Nearby alerts checked",
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
        "Could not load BMKG",
        error instanceof Error
          ? error.message
          : "Could not fetch BMKG earthquake data."
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
      "Moderation is protected",
      "Fake-report moderation is available for moderator accounts. You can still report suspicious content from an incident detail."
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
            <Text style={styles.sectionTitle}>Achievement Badges</Text>
            <View style={styles.badgeGrid}>
              <AchievementBadge
                label="Active Reporter"
                iconName="flame"
                active={stats.totalReports > 0}
                color={colors.danger}
              />
              <AchievementBadge
                label="Quick Responder"
                iconName="flash"
                active={stats.highSeverityReports > 0}
                color={colors.warning}
              />
              <AchievementBadge
                label="Contributor"
                iconName="ribbon"
                active={stats.points > 0}
                color={colors.success}
              />
              <AchievementBadge
                label="Volunteer"
                iconName="shield"
                active={stats.areas >= 3}
                color={colors.info}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <AppCard style={styles.settingsCard} padding="none">
              <SettingsRow
                iconName="notifications-outline"
                title="Nearby Incident Alerts"
                subtitle="Check and notify incidents near you"
                busy={checkingAlerts}
                onPress={handleNearbyAlerts}
              />
              <SettingsRow
                iconName="pulse-outline"
                title="BMKG Integration"
                subtitle="Latest earthquake feed and alerts"
                busy={checkingBmkg}
                onPress={handleBmkgAlerts}
              />
              <SettingsRow
                iconName="book-outline"
                title="Safety Education"
                subtitle="Preparedness guide"
                onPress={() => router.push(EDUCATION_ROUTE)}
              />
              <SettingsRow
                iconName="document-text-outline"
                title="Report History"
                subtitle="Your previous reports"
                onPress={() => router.push(ACTIVITY_ROUTE)}
              />
              <SettingsRow
                iconName="shield-checkmark-outline"
                title="Fake Report Moderation"
                subtitle={
                  isModerator
                    ? "Review reported content"
                    : "Report suspicious content from incident detail"
                }
                onPress={handleModerationPress}
              />
              <View style={styles.languageRow}>
                <View style={styles.settingsIcon}>
                  <Ionicons name="language-outline" size={20} color={colors.primary} />
                </View>
                <View style={styles.settingsText}>
                  <Text style={styles.settingsTitle}>Language</Text>
                  <Text style={styles.settingsSubtitle}>English / Indonesian</Text>
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
            <Text style={styles.logoutButtonText}>Log Out</Text>
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
            <Text style={styles.modalTitle}>Edit Profile Name</Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              editable={!savingProfile}
              autoFocus
              placeholder="Enter your name"
              placeholderTextColor={colors.textSoft}
              style={styles.nameInput}
            />
            <View style={styles.modalBtnRow}>
              <AppButton
                title="Cancel"
                variant="secondary"
                size="md"
                onPress={cancelEditName}
                style={styles.modalBtnCancel}
              />
              <AppButton
                title="Save"
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
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to sign out of this account?
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
                title="Sign Out"
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
  const items = [
    {
      label: "Reports",
      value: stats.totalReports,
      iconName: "document-text-outline" as const,
    },
    {
      label: "Points",
      value: stats.points,
      iconName: "star-outline" as const,
    },
    {
      label: "Areas",
      value: stats.areas,
      iconName: "location-outline" as const,
    },
    {
      label: "Badges",
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
