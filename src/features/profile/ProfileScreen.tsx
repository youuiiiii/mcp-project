import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../theme/colors";
import {
  AccountRow,
  EditableNameRow,
  StatsStrip,
} from "./components/ProfileAccountRows";
import { useProfileScreen } from "./hooks/useProfileScreen";
import { profileStyles as styles } from "./profileStyles";

export default function ProfileScreen() {
  const {
    loading,
    savingProfile,
    errorMessage,
    displayName,
    userEmail,
    userInitial,
    photoURL,
    draftName,
    setDraftName,
    draftPhotoUri,
    stats,
    pickProfilePhoto,
    saveProfile,
    handleLogout,
  } = useProfileScreen();

  const router = useRouter();
  const { isModerator, roleLoading } = useAuth();
  const roleLabel = isModerator ? "Moderator" : "Community Reporter";
  const [isEditingName, setIsEditingName] = useState(false);
  const profileImageUri = draftPhotoUri ?? photoURL;
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const openModeration = () => {
    router.push("/moderation" as Href);
  };

  const cancelEditName = () => {
    setDraftName(displayName);
    setIsEditingName(false);
  };

  const submitName = async () => {
    if (draftName.trim() === displayName) {
      setIsEditingName(false);
      return;
    }

    if (draftName.trim().length < 2) {
      return;
    }

    await saveProfile();
    setIsEditingName(false);
  };

  if (loading || roleLoading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Loading profile..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppCard style={styles.headerCard}>
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
              <ActivityIndicator size="small" color={colors.textInverse} />
            ) : (
              <Ionicons name="camera" size={14} color={colors.textInverse} />
            )}
          </View>
        </Pressable>

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {userEmail}
          </Text>
          <View style={styles.rolePill}>
            <Ionicons
              name="shield-checkmark"
              size={14}
              color={colors.info}
            />
            <Text style={styles.roleText}>{roleLabel}</Text>
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
          title="Contributions"
          subtitle="Report summary for this account."
        />
        <StatsStrip stats={stats} />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Account"
          subtitle="Basic information and account settings."
        />
        <AppCard style={styles.accountCard}>
          <EditableNameRow
            value={displayName}
            draftValue={draftName}
            isEditing={isEditingName}
            saving={savingProfile}
            onChange={setDraftName}
            onEdit={() => setIsEditingName(true)}
            onCancel={cancelEditName}
            onSubmit={submitName}
          />

          <View style={styles.divider} />
          <AccountRow iconName="mail-outline" label="Email" value={userEmail} />
        </AppCard>
      </View>

    {isModerator ? (
      <View style={styles.section}>
        <SectionHeader
          title="Moderator"
          subtitle="Review content reports from the community."
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
