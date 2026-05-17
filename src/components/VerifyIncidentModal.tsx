import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import AppButton from "./ui/AppButton";
import AppCard from "./ui/AppCard";
import IconBadge from "./ui/IconBadge";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";
import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentPreviewCard from "../features/incident/components/IncidentPreviewCard";
import {
  VERIFICATION_DISTANCE_METERS,
} from "../constants/incident";
import { useAuth } from "../contexts/AuthContext";
import { uploadImageAsync } from "../services/cloudinaryService";
import { createIncidentVerification } from "../services/incidentService";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import {
  Coordinate,
  IncidentConditionStatus,
  IncidentReport,
  VerificationType,
} from "../types/incident";
import { formatDistance, getDistanceInMeters } from "../utils/geo";

type AppIconName = keyof typeof Ionicons.glyphMap;

type VerifyIncidentModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  userLocation: Coordinate | null;
  onClose: () => void;
  onSuccess?: () => void;
};

type VerificationOption = {
  value: VerificationType;
  label: string;
  description: string;
  color: string;
  icon: AppIconName;
};

type ConditionOption = {
  value: IncidentConditionStatus;
  label: string;
  description: string;
  color: string;
  icon: AppIconName;
};

const VERIFICATION_OPTIONS: VerificationOption[] = [
  {
    value: "valid",
    label: "Benar Terjadi",
    description: "Saya melihat kejadian ini benar terjadi.",
    color: colors.success,
    icon: "checkmark-circle",
  },
  {
    value: "condition_update",
    label: "Update Kondisi",
    description: "Kejadian ada, tetapi kondisinya perlu diperbarui.",
    color: colors.warning,
    icon: "sync-circle",
  },
  {
    value: "invalid",
    label: "Tidak Sesuai",
    description: "Saya tidak menemukan kejadian sesuai laporan.",
    color: colors.danger,
    icon: "close-circle",
  },
];

const CONDITION_OPTIONS: ConditionOption[] = [
  {
    value: "still_happening",
    label: "Masih Terjadi",
    description: "Kejadian masih berlangsung di lokasi.",
    color: colors.warning,
    icon: "radio",
  },
  {
    value: "getting_worse",
    label: "Semakin Parah",
    description: "Kondisi terlihat semakin memburuk.",
    color: colors.danger,
    icon: "trending-up",
  },
  {
    value: "partially_resolved",
    label: "Mulai Terkendali",
    description: "Kondisi mulai membaik, tetapi belum selesai.",
    color: colors.info,
    icon: "construct",
  },
  {
    value: "resolved_but_not_closed",
    label: "Tampak Selesai",
    description: "Kejadian tampak selesai, tetapi butuh konfirmasi lanjutan.",
    color: colors.success,
    icon: "checkmark-done",
  },
  {
    value: "not_found",
    label: "Tidak Ditemukan",
    description: "Kejadian tidak ditemukan di sekitar lokasi.",
    color: colors.textMuted,
    icon: "search",
  },
];

export default function VerifyIncidentModal({
  visible,
  incident,
  userLocation,
  onClose,
  onSuccess,
}: VerifyIncidentModalProps) {
  const { user } = useAuth();

  const [verificationType, setVerificationType] =
    useState<VerificationType>("valid");
  const [conditionStatus, setConditionStatus] =
    useState<IncidentConditionStatus>("still_happening");
  const [note, setNote] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const actorKey = user?.email ?? user?.uid ?? null;

  const conditionOptions = useMemo(() => {
    if (verificationType === "invalid") {
      return CONDITION_OPTIONS.filter((item) => item.value === "not_found");
    }

    if (verificationType === "valid") {
      return CONDITION_OPTIONS.filter((item) =>
        ["still_happening", "getting_worse"].includes(item.value)
      );
    }

    return CONDITION_OPTIONS;
  }, [verificationType]);

  const canSubmit =
    Boolean(incident && user && actorKey && imageUri && note.trim().length >= 8) &&
    !submitting;

  useEffect(() => {
    if (verificationType === "invalid") {
      setConditionStatus("not_found");
      return;
    }

    setConditionStatus("still_happening");
  }, [verificationType]);

  const resetForm = () => {
    setVerificationType("valid");
    setConditionStatus("still_happening");
    setNote("");
    setImageUri(null);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Izin Kamera Ditolak",
          "Aplikasi membutuhkan izin kamera untuk mengambil bukti verifikasi."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3],
      });

      if (result.canceled) {
        return;
      }

      const uri = result.assets?.[0]?.uri;

      if (!uri) {
        Alert.alert("Foto Tidak Valid", "Gagal membaca hasil foto.");
        return;
      }

      setImageUri(uri);
      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      Alert.alert(
        "Gagal Membuka Kamera",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuka kamera."
      );
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Izin Galeri Ditolak",
          "Aplikasi membutuhkan izin galeri untuk memilih bukti verifikasi."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3],
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (result.canceled) {
        return;
      }

      const uri = result.assets?.[0]?.uri;

      if (!uri) {
        Alert.alert("Foto Tidak Valid", "Gagal membaca gambar dari galeri.");
        return;
      }

      setImageUri(uri);
      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      Alert.alert(
        "Gagal Membuka Galeri",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuka galeri."
      );
    }
  };

  const validateForm = () => {
    if (!user || !actorKey) {
      Alert.alert("Belum Login", "Silakan login untuk mengirim update.");
      return false;
    }

    if (!incident) {
      Alert.alert("Incident Tidak Valid", "Data incident tidak ditemukan.");
      return false;
    }

    if (!userLocation) {
      Alert.alert(
        "Lokasi Tidak Tersedia",
        "Aplikasi belum mendapatkan lokasi realtime Anda."
      );
      return false;
    }

    const distance = getDistanceInMeters(userLocation, {
      latitude: incident.latitude,
      longitude: incident.longitude,
    });

    if (distance > VERIFICATION_DISTANCE_METERS) {
      Alert.alert(
        "Terlalu Jauh dari Incident",
        `Anda hanya bisa mengirim verifikasi/update jika berada maksimal ${VERIFICATION_DISTANCE_METERS} meter dari lokasi kejadian.\n\nJarak Anda saat ini sekitar ${formatDistance(
          distance
        )}.`
      );
      return false;
    }

    const isOwnIncident =
      incident.reporterEmail === actorKey || incident.reportedBy === actorKey;

    const hasVerified =
      incident.verifiedBy?.includes(actorKey) ||
      incident.disputedBy?.includes(actorKey);

    if (verificationType !== "condition_update" && isOwnIncident) {
      Alert.alert(
        "Tidak Bisa Verifikasi",
        "Anda tidak dapat memverifikasi laporan yang Anda buat sendiri. Gunakan Update Kondisi jika ingin memperbarui kondisi."
      );
      return false;
    }

    if (verificationType !== "condition_update" && hasVerified) {
      Alert.alert(
        "Sudah Diverifikasi",
        "Anda sudah pernah memberi verifikasi valid/tidak sesuai. Gunakan Update Kondisi untuk memberi informasi terbaru."
      );
      return false;
    }

    if (!imageUri) {
      Alert.alert(
        "Bukti Foto Wajib",
        "Verifikasi atau update kondisi wajib menyertakan foto terbaru."
      );
      return false;
    }

    const cleanNote = note.trim();

    if (!cleanNote) {
      Alert.alert(
        "Catatan Wajib Diisi",
        "Tambahkan catatan singkat tentang kondisi incident."
      );
      return false;
    }

    if (cleanNote.length < 8) {
      Alert.alert("Catatan Terlalu Pendek", "Catatan minimal 8 karakter.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (
        !validateForm() ||
        !incident ||
        !userLocation ||
        !imageUri ||
        !actorKey
      ) {
        return;
      }

      setSubmitting(true);

      const uploadedImageUrl = await uploadImageAsync(
        imageUri,
        "incident-images"
      );

      await createIncidentVerification({
        reportId: incident.id,
        verificationType,
        conditionStatus,
        note: note.trim(),
        imageUri: uploadedImageUrl,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        userName: user?.displayName ?? user?.email ?? "Anonymous",
        userEmail: user?.email ?? null,
        actorKey,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {}
      );

      Alert.alert(
        "Update Terkirim",
        "Bukti foto dan catatan berhasil dikirim ke timeline incident.",
        [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              onSuccess?.();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Gagal Mengirim Update",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan update."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IncidentModalShell
      visible={visible}
      title="Verifikasi / Update Kondisi"
      subtitle="Kirim bukti foto terbaru dan catatan kondisi di lokasi."
      submitting={submitting}
      onClose={handleClose}
      footer={
        <>
          <AppButton
            title="Batal"
            variant="secondary"
            size="lg"
            disabled={submitting}
            onPress={handleClose}
            style={styles.footerCancelButton}
          />

          <AppButton
            title="Kirim ke Timeline"
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            leftIcon={
              <Ionicons name="send" size={18} color={colors.textInverse} />
            }
            style={styles.footerSubmitButton}
          />
        </>
      }
    >
      {incident ? <IncidentPreviewCard incident={incident} /> : null}

      <View style={styles.section}>
        <SectionHeader
          title="Jenis Kontribusi"
          subtitle="Pilih apakah kamu memverifikasi, membantah, atau memperbarui kondisi."
        />

        <View style={styles.optionList}>
          {VERIFICATION_OPTIONS.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={item.label}
              description={item.description}
              icon={item.icon}
              color={item.color}
              active={verificationType === item.value}
              disabled={submitting}
              onPress={() => setVerificationType(item.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Kondisi Terbaru"
          subtitle="Pilih kondisi yang paling sesuai di lokasi."
        />

        <View style={styles.optionList}>
          {conditionOptions.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={item.label}
              description={item.description}
              icon={item.icon}
              color={item.color}
              active={conditionStatus === item.value}
              disabled={submitting}
              onPress={() => setConditionStatus(item.value)}
            />
          ))}
        </View>
      </View>

      <EvidencePicker
        title="Foto Bukti Terbaru"
        subtitle="Foto wajib untuk membuktikan kondisi incident terbaru."
        emptyTitle="Belum ada foto"
        emptyMessage="Foto wajib untuk membuktikan kondisi incident terbaru."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title="Catatan Kondisi"
          subtitle="Tulis catatan singkat dan jelas berdasarkan kondisi lapangan."
        />

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Contoh: Kejadian masih terjadi, satu jalur sudah bisa dilewati."
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={`${Math.max(note.trim().length, 0)}/8 minimum karakter`}
          variant={note.trim().length >= 8 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}

function SelectableOptionCard({
  label,
  description,
  icon,
  color,
  active,
  disabled,
  onPress,
}: {
  label: string;
  description: string;
  icon: AppIconName;
  color: string;
  active: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <AppCard
      onPress={disabled ? undefined : onPress}
      style={[
        styles.optionCard,
        active && {
          borderColor: color,
          backgroundColor: withAlpha(color, "12"),
        },
      ]}
    >
      <IconBadge
        variant="neutral"
        size="md"
        rounded={false}
        style={{
          backgroundColor: active ? color : colors.surfaceMuted,
        }}
      >
        <Ionicons
          name={icon}
          size={22}
          color={active ? colors.textInverse : color}
        />
      </IconBadge>

      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionTitle,
            active && {
              color,
            },
          ]}
        >
          {label}
        </Text>

        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </AppCard>
  );
}

function withAlpha(hexColor: string, alpha: string) {
  if (!hexColor.startsWith("#") || hexColor.length !== 7) {
    return hexColor;
  }

  return `${hexColor}${alpha}`;
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
  },
  optionList: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  optionDescription: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  input: {
    minHeight: 112,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    lineHeight: 20,
  },
  footerCancelButton: {
    flex: 1,
  },
  footerSubmitButton: {
    flex: 1.45,
  },
});