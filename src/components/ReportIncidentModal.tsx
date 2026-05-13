import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import AppButton from "./ui/AppButton";
import AppCard from "./ui/AppCard";
import IconBadge from "./ui/IconBadge";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";
import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import {
  INCIDENT_CATEGORY_OPTIONS,
  SEVERITY_OPTIONS,
} from "../constants/incident";
import { useAuth } from "../contexts/AuthContext";
import { uploadImageAsync } from "../services/cloudinaryService";
import { createIncidentReport } from "../services/incidentService";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import {
  Coordinate,
  IncidentCategory,
  IncidentSeverity,
} from "../types/incident";

type ReportIncidentModalProps = {
  visible: boolean;
  coordinate: Coordinate | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ReportIncidentModal({
  visible,
  coordinate,
  onClose,
  onSuccess,
}: ReportIncidentModalProps) {
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] =
    useState<IncidentCategory | null>(null);
  const [selectedSeverity, setSelectedSeverity] =
    useState<IncidentSeverity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    Boolean(
      user &&
        coordinate &&
        selectedCategory &&
        title.trim().length >= 5 &&
        description.trim().length >= 10 &&
        imageUri
    ) && !submitting;

  const resetForm = () => {
    setSelectedCategory(null);
    setSelectedSeverity("medium");
    setTitle("");
    setDescription("");
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
          "Aplikasi membutuhkan izin kamera untuk mengambil bukti kejadian."
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
          "Aplikasi membutuhkan izin galeri untuk memilih bukti foto."
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

    if (!coordinate) {
      Alert.alert("Lokasi Tidak Valid", "Silakan pilih lokasi kejadian di map.");
      return false;
    }

    if (!selectedCategory) {
      Alert.alert(
        "Kategori Wajib Dipilih",
        "Pilih tema kejadian yang paling sesuai."
      );
      return false;
    }

    if (title.trim().length < 5) {
      Alert.alert("Judul Terlalu Pendek", "Judul minimal 5 karakter.");
      return false;
    }

    if (description.trim().length < 10) {
      Alert.alert("Deskripsi Terlalu Pendek", "Deskripsi minimal 10 karakter.");
      return false;
    }

    if (!imageUri) {
      Alert.alert(
        "Bukti Foto Wajib",
        "Ambil atau pilih foto kejadian terlebih dahulu."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (
        !validateForm() ||
        !coordinate ||
        !selectedCategory ||
        !imageUri ||
        !user
      ) {
        return;
      }

      setSubmitting(true);

      const uploadedImageUrl = await uploadImageAsync(
        imageUri,
        "incident-images"
      );

      await createIncidentReport({
        category: selectedCategory,
        subcategory: null,
        type: null,
        title: title.trim(),
        description: description.trim(),
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        severity: selectedSeverity,
        imageUri: uploadedImageUrl,
        address: null,
        reportedBy: user.displayName ?? user.email ?? user.uid,
        reporterEmail: user.email ?? null,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {}
      );

      Alert.alert(
        "Laporan Berhasil",
        "Laporan kejadian berhasil dikirim dan akan tampil realtime di map.",
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
        "Gagal Mengirim Laporan",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan laporan."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IncidentModalShell
      visible={visible}
      title="Laporkan Kejadian"
      subtitle="Pilih tema kejadian, isi detail, dan sertakan bukti foto."
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
            title="Kirim Laporan"
            variant="danger"
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
      <AppCard variant="muted" style={styles.locationCard}>
        <IconBadge variant="info" size="md" rounded={false}>
          <Ionicons name="location" size={22} color={colors.info} />
        </IconBadge>

        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Lokasi kejadian</Text>
          <Text style={styles.locationValue}>
            {coordinate
              ? `${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`
              : "Belum ada lokasi"}
          </Text>
        </View>
      </AppCard>

      <View style={styles.section}>
        <SectionHeader
          title="Tema Kejadian"
          subtitle="Pilih kategori besar. Detail spesifik cukup ditulis di judul dan deskripsi."
        />

        <View style={styles.optionList}>
          {INCIDENT_CATEGORY_OPTIONS.map((item) => {
            const active = selectedCategory === item.value;

            return (
              <AppCard
                key={item.value}
                onPress={
                  submitting ? undefined : () => setSelectedCategory(item.value)
                }
                style={[
                  styles.categoryCard,
                  active && {
                    backgroundColor: item.lightColor,
                    borderColor: item.color,
                  },
                ]}
              >
                <IconBadge
                  variant="neutral"
                  size="lg"
                  rounded={false}
                  style={{
                    backgroundColor: active ? item.color : colors.surfaceMuted,
                  }}
                >
                  <Ionicons
                    name={item.iconName}
                    size={24}
                    color={active ? colors.textInverse : item.color}
                  />
                </IconBadge>

                <View style={styles.categoryContent}>
                  <Text
                    style={[
                      styles.categoryTitle,
                      active && {
                        color: item.color,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>

                  <Text style={styles.categoryDescription}>
                    {item.description}
                  </Text>
                </View>

                {active ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={item.color}
                  />
                ) : null}
              </AppCard>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Severity"
          subtitle="Tentukan seberapa mendesak kejadian ini."
        />

        <View style={styles.severityRow}>
          {SEVERITY_OPTIONS.map((item) => {
            const active = selectedSeverity === item.value;

            return (
              <AppCard
                key={item.value}
                onPress={
                  submitting ? undefined : () => setSelectedSeverity(item.value)
                }
                padding="sm"
                style={[
                  styles.severityCard,
                  active && {
                    backgroundColor: item.color,
                    borderColor: item.color,
                  },
                ]}
              >
                <Ionicons
                  name={item.iconName}
                  size={20}
                  color={active ? colors.textInverse : item.color}
                />

                <Text
                  style={[
                    styles.severityLabel,
                    active && styles.severityLabelActive,
                  ]}
                >
                  {item.label}
                </Text>

                <Text
                  style={[
                    styles.severityDescription,
                    active && styles.severityDescriptionActive,
                  ]}
                >
                  {item.description}
                </Text>
              </AppCard>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Judul"
          subtitle="Tulis ringkas kejadian yang kamu lihat."
        />

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Contoh: Pohon tumbang menutup jalan"
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          editable={!submitting}
        />

        <StatusBadge
          label={`${title.trim().length}/5 minimum karakter`}
          variant={title.trim().length >= 5 ? "success" : "neutral"}
          size="sm"
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Deskripsi"
          subtitle="Jelaskan kondisi, dampak, dan area yang terganggu."
        />

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Contoh: Pohon tumbang menutup sebagian jalan, kendaraan harus bergantian lewat."
          placeholderTextColor={colors.textSoft}
          style={[styles.input, styles.textArea]}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={`${description.trim().length}/10 minimum karakter`}
          variant={description.trim().length >= 10 ? "success" : "neutral"}
          size="sm"
        />
      </View>

      <EvidencePicker
        title="Bukti Foto"
        subtitle="Foto wajib untuk membantu warga lain memahami kondisi."
        emptyTitle="Belum ada foto"
        emptyMessage="Ambil atau pilih foto kejadian sebagai bukti laporan."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />
    </IncidentModalShell>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.infoSoft,
    borderColor: "#BFDBFE",
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    ...typography.label,
    color: colors.infoDark,
  },
  locationValue: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  section: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
  },
  optionList: {
    gap: spacing.sm,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  categoryDescription: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
  severityRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  severityCard: {
    flex: 1,
    minHeight: 112,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  severityLabel: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  severityLabelActive: {
    color: colors.textInverse,
  },
  severityDescription: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    lineHeight: 14,
  },
  severityDescriptionActive: {
    color: colors.textInverse,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  textArea: {
    minHeight: 112,
    lineHeight: 20,
  },
  footerCancelButton: {
    flex: 1,
  },
  footerSubmitButton: {
    flex: 1.45,
  },
});