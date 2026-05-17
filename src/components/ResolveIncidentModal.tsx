import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";

import AppButton from "./ui/AppButton";
import AppCard from "./ui/AppCard";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";
import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentPreviewCard from "../features/incident/components/IncidentPreviewCard";
import { useAuth } from "../contexts/AuthContext";
import { uploadImageAsync } from "../services/cloudinaryService";
import { resolveIncidentReport } from "../services/incidentService";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import { IncidentReport } from "../types/incident";

type ResolveIncidentModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ResolveIncidentModal({
  visible,
  incident,
  onClose,
  onSuccess,
}: ResolveIncidentModalProps) {
  const { user } = useAuth();

  const [resolutionNote, setResolutionNote] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    Boolean(incident && user && imageUri && resolutionNote.trim().length >= 10) &&
    !submitting;

  const resetForm = () => {
    setResolutionNote("");
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
          "Aplikasi membutuhkan izin kamera untuk mengambil bukti selesai."
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
          "Aplikasi membutuhkan izin galeri untuk memilih bukti selesai."
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
    if (!user) {
      Alert.alert("Belum Login", "Silakan login terlebih dahulu.");
      return false;
    }

    if (!incident) {
      Alert.alert("Laporan Tidak Valid", "Data laporan tidak ditemukan.");
      return false;
    }

    if (!imageUri) {
      Alert.alert(
        "Bukti Foto Wajib",
        "Anda wajib memasukkan foto terbaru yang menunjukkan kejadian sudah selesai."
      );
      return false;
    }

    const cleanNote = resolutionNote.trim();

    if (!cleanNote) {
      Alert.alert(
        "Catatan Wajib Diisi",
        "Jelaskan kenapa laporan ini sudah bisa dinyatakan selesai."
      );
      return false;
    }

    if (cleanNote.length < 10) {
      Alert.alert(
        "Catatan Terlalu Pendek",
        "Catatan penyelesaian minimal 10 karakter."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm() || !incident || !imageUri) {
        return;
      }

      setSubmitting(true);

      const uploadedImageUrl = await uploadImageAsync(
        imageUri,
        "resolution-images"
      );

      await resolveIncidentReport({
        reportId: incident.id,
        resolvedImageUri: uploadedImageUrl,
        resolutionNote: resolutionNote.trim(),
        resolvedBy: user?.displayName ?? user?.email ?? user?.uid,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {}
      );

      Alert.alert(
        "Laporan Ditandai Selesai",
        "Bukti penyelesaian berhasil disimpan. Status laporan sekarang menjadi resolved.",
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
        "Gagal Menyelesaikan Laporan",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan bukti selesai."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IncidentModalShell
      visible={visible}
      title="Validasi Selesai"
      subtitle="Upload gambar terbaru agar status selesai bisa dipercaya."
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
            title="Tandai Selesai"
            variant="danger"
            size="lg"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            leftIcon={
              <Ionicons
                name="checkmark-done"
                size={18}
                color={colors.textInverse}
              />
            }
            style={styles.footerSubmitButton}
          />
        </>
      }
    >
      {incident ? <IncidentPreviewCard incident={incident} /> : null}

      <AppCard variant="muted" style={styles.noticeCard}>
        <StatusBadge label="Validasi Wajib" variant="warning" size="sm" />

        <View style={styles.noticeTextGroup}>
          <Ionicons name="warning" size={20} color={colors.warningDark} />
          <TextInput
            editable={false}
            multiline
            value="Foto harus sesuai dengan laporan dan menunjukkan bahwa lokasi sudah aman, sudah dibersihkan, atau kejadian sudah tidak mengganggu aktivitas sekitar."
            style={styles.noticeText}
          />
        </View>
      </AppCard>

      <EvidencePicker
        title="Bukti Foto Selesai"
        subtitle="Upload foto terbaru sebagai bukti bahwa kejadian sudah selesai."
        emptyTitle="Belum ada bukti selesai"
        emptyMessage="Upload foto terbaru sebagai bukti bahwa kejadian sudah selesai."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title="Catatan Penyelesaian"
          subtitle="Jelaskan alasan laporan ini sudah bisa dinyatakan selesai."
        />

        <TextInput
          value={resolutionNote}
          onChangeText={setResolutionNote}
          placeholder="Contoh: Jalan sudah dibersihkan dan kendaraan sudah bisa lewat."
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={`${Math.max(
            resolutionNote.trim().length,
            0
          )}/10 minimum karakter`}
          variant={resolutionNote.trim().length >= 10 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}

const styles = StyleSheet.create({
  noticeCard: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
    backgroundColor: colors.warningSoft,
    borderColor: "#FDE68A",
  },
  noticeTextGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  noticeText: {
    flex: 1,
    padding: 0,
    margin: 0,
    ...typography.caption,
    color: "#92400E",
  },
  section: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
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