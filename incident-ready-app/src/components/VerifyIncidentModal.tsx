import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  VERIFICATION_DISTANCE_METERS,
  getIncidentMeta,
} from "../constants/incident";
import { useAuth } from "../contexts/AuthContext";
import { uploadImageAsync } from "../services/cloudinaryService";
import { createIncidentVerification } from "../services/incidentService";
import {
  Coordinate,
  IncidentReport,
  VerificationType,
} from "../types/incident";
import { formatDistance, getDistanceInMeters } from "../utils/geo";

type VerifyIncidentModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  userLocation: Coordinate | null;
  onClose: () => void;
  onSuccess?: () => void;
};

const VERIFICATION_OPTIONS: {
  value: VerificationType;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "valid",
    label: "Benar Terjadi",
    description: "Saya melihat kejadian ini benar terjadi.",
    color: "#16A34A",
  },
  {
    value: "condition_update",
    label: "Update Kondisi",
    description: "Kejadian ada, tetapi kondisinya sudah berubah.",
    color: "#F59E0B",
  },
  {
    value: "invalid",
    label: "Tidak Sesuai",
    description: "Saya tidak menemukan kejadian sesuai laporan.",
    color: "#DC2626",
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
  const [note, setNote] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const meta = incident ? getIncidentMeta(incident.type) : null;

  const actorKey = user?.email ?? user?.uid ?? null;

  const resetForm = () => {
    setVerificationType("valid");
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
      Alert.alert("Belum Login", "Silakan login untuk memverifikasi kejadian.");
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

    if (incident.reporterEmail === actorKey || incident.reportedBy === actorKey) {
      Alert.alert(
        "Tidak Bisa Verifikasi",
        "Anda tidak dapat memverifikasi laporan yang Anda buat sendiri."
      );
      return false;
    }

    if (
      incident.verifiedBy?.includes(actorKey) ||
      incident.disputedBy?.includes(actorKey)
    ) {
      Alert.alert(
        "Sudah Diverifikasi",
        "Anda sudah pernah memberi verifikasi untuk incident ini."
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
        `Anda hanya bisa memverifikasi incident jika berada maksimal ${VERIFICATION_DISTANCE_METERS} meter dari lokasi kejadian.\n\nJarak Anda saat ini sekitar ${formatDistance(
          distance
        )}.`
      );
      return false;
    }

    if (!imageUri) {
      Alert.alert(
        "Bukti Foto Wajib",
        "Verifikasi incident wajib menyertakan foto terbaru dari lokasi."
      );
      return false;
    }

    if (!note.trim()) {
      Alert.alert(
        "Catatan Wajib Diisi",
        "Tambahkan catatan singkat tentang kondisi incident."
      );
      return false;
    }

    if (note.trim().length < 8) {
      Alert.alert("Catatan Terlalu Pendek", "Catatan minimal 8 karakter.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm() || !incident || !userLocation || !imageUri || !actorKey) {
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
        note,
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
        "Verifikasi Terkirim",
        "Bukti verifikasi berhasil dikirim ke thread incident.",
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
        "Gagal Mengirim Verifikasi",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan verifikasi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Verifikasi Incident</Text>
                <Text style={styles.subtitle}>
                  Kirim bukti foto terbaru dan catatan kondisi di lokasi.
                </Text>
              </View>

              <Pressable
                disabled={submitting}
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              {incident && meta ? (
                <View style={styles.incidentBox}>
                  <View
                    style={[
                      styles.incidentIconBox,
                      {
                        backgroundColor: meta.lightColor,
                      },
                    ]}
                  >
                    <Text style={styles.incidentIcon}>{meta.icon}</Text>
                  </View>

                  <View style={styles.incidentInfo}>
                    <Text style={styles.incidentTitle}>{incident.title}</Text>
                    <Text style={styles.incidentType}>{meta.label}</Text>
                    <Text style={styles.incidentDescription} numberOfLines={3}>
                      {incident.description}
                    </Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Jenis Verifikasi</Text>

                <View style={styles.optionList}>
                  {VERIFICATION_OPTIONS.map((item) => {
                    const active = verificationType === item.value;

                    return (
                      <Pressable
                        key={item.value}
                        onPress={() => setVerificationType(item.value)}
                        style={({ pressed }) => [
                          styles.optionCard,
                          active && {
                            borderColor: item.color,
                            backgroundColor: "#F8FAFC",
                          },
                          pressed && styles.pressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.optionDot,
                            {
                              backgroundColor: item.color,
                            },
                          ]}
                        />

                        <View style={styles.optionContent}>
                          <Text style={styles.optionTitle}>{item.label}</Text>
                          <Text style={styles.optionDescription}>
                            {item.description}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Foto Bukti Verifikasi</Text>

                {imageUri ? (
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: imageUri }} style={styles.image} />

                    <Pressable
                      disabled={submitting}
                      onPress={() => setImageUri(null)}
                      style={styles.removeImageButton}
                    >
                      <Text style={styles.removeImageText}>Hapus Foto</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.photoEmptyBox}>
                    <Text style={styles.photoIcon}>📷</Text>
                    <Text style={styles.photoTitle}>Belum ada foto</Text>
                    <Text style={styles.photoSubtitle}>
                      Foto wajib untuk membuktikan kondisi incident terbaru.
                    </Text>
                  </View>
                )}

                <View style={styles.photoActions}>
                  <Pressable
                    disabled={submitting}
                    onPress={handleTakePhoto}
                    style={({ pressed }) => [
                      styles.photoButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.photoButtonText}>Ambil Foto</Text>
                  </Pressable>

                  <Pressable
                    disabled={submitting}
                    onPress={handlePickFromGallery}
                    style={({ pressed }) => [
                      styles.photoButtonSecondary,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.photoButtonSecondaryText}>
                      Pilih Galeri
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Catatan Kondisi</Text>

                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Contoh: Kejadian benar terjadi, jalan masih tertutup sebagian."
                  placeholderTextColor="#94A3B8"
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                  editable={!submitting}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                disabled={submitting}
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.pressed,
                  submitting && styles.disabled,
                ]}
              >
                <Text style={styles.cancelText}>Batal</Text>
              </Pressable>

              <Pressable
                disabled={submitting}
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.pressed,
                  submitting && styles.disabled,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitText}>Kirim Verifikasi</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "92%",
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 19,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  content: {
    padding: 20,
    paddingBottom: 28,
  },
  incidentBox: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 24,
    padding: 14,
    gap: 12,
  },
  incidentIconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  incidentIcon: {
    fontSize: 26,
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },
  incidentType: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },
  incidentDescription: {
    marginTop: 7,
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    lineHeight: 18,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  optionList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    padding: 14,
  },
  optionDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  optionDescription: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 17,
  },
  photoEmptyBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },
  photoIcon: {
    fontSize: 34,
  },
  photoTitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },
  photoSubtitle: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
  imageWrapper: {
    gap: 10,
  },
  image: {
    width: "100%",
    height: 210,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
  },
  removeImageButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  removeImageText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#B91C1C",
  },
  photoActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  photoButton: {
    flex: 1,
    backgroundColor: "#0F766E",
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  photoButtonSecondary: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
  },
  photoButtonSecondaryText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  textArea: {
    height: 110,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    flexDirection: "row",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#475569",
  },
  submitButton: {
    flex: 1.4,
    backgroundColor: "#0F766E",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
  },
  submitText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.6,
  },
});