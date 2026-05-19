import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
  const [isEditingName, setIsEditingName] = useState(false);
  const isModerator = isModeratorEmail(userEmail);
  const profileImageUri = draftPhotoUri ?? photoURL;

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

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Memuat profil..." />
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
          title="Kontribusi"
          subtitle="Ringkasan laporan dari akun ini."
        />

        <StatsStrip stats={stats} />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Akun"
          subtitle="Informasi dasar dan pengaturan akun."
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

          <AccountRow
            iconName="mail-outline"
            label="Email"
            value={userEmail}
          />
        </AppCard>
      </View>

      {isModerator ? (
      <View style={styles.section}>
        <SectionHeader
          title="Moderator"
          subtitle="Tinjau laporan konten dari warga."
        />

        <AppCard style={styles.moderatorCard}>
          <View style={styles.moderatorIcon}>
            <Ionicons name="shield-checkmark" size={22} color={colors.info} />
          </View>

          <View style={styles.moderatorText}>
            <Text style={styles.moderatorTitle}>Moderation Queue</Text>
            <Text style={styles.moderatorDescription}>
              Review konten yang dilaporkan dan sembunyikan laporan bermasalah.
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

function StatsStrip({ stats }: { stats: ProfileStats }) {
  const items = [
    {
      label: "Total",
      value: stats.totalReports,
      iconName: "document-text-outline" as const,
      color: colors.info,
    },
    {
      label: "Aktif",
      value: stats.activeReports,
      iconName: "radio" as const,
      color: colors.danger,
    },
    {
      label: "Selesai",
      value: stats.resolvedReports,
      iconName: "checkmark-circle-outline" as const,
      color: colors.success,
    },
    {
      label: "Tinggi",
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

function EditableNameRow({
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
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: radius["2xl"],
    resizeMode: "cover",
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
  editNameButton: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  inlineActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inlineActionButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  inlineActionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
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
  avatarPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cameraBadge: {
    position: "absolute",
    right: -3,
    bottom: -3,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
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
  accountNameInput: {
    marginTop: 4,
    minHeight: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
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
});
