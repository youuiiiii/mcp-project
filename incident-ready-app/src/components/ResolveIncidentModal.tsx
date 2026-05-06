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
import { getIncidentMeta } from "../constants/incident";
import { useAuth } from "../contexts/AuthContext";
import { uploadImageAsync } from "../services/cloudinaryService";
import { resolveIncidentReport } from "../services/incidentService";
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

  const meta = incident ? getIncidentMeta(incident.type) : null;

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

    if (!resolutionNote.trim()) {
      Alert.alert(
        "Catatan Wajib Diisi",
        "Jelaskan kenapa laporan ini sudah bisa dinyatakan selesai."
      );
      return false;
    }

    if (resolutionNote.trim().length < 10) {
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
        resolutionNote,
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
                <Text style={styles.title}>Validasi Selesai</Text>
                <Text style={styles.subtitle}>
                  Upload gambar terbaru agar status selesai bisa dipercaya.
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

              <View style={styles.validationNotice}>
                <Text style={styles.validationTitle}>Validasi Wajib</Text>
                <Text style={styles.validationText}>
                  Foto harus sesuai dengan laporan di atas dan menunjukkan bahwa
                  lokasi sudah aman, sudah dibersihkan, atau kejadian sudah tidak
                  mengganggu aktivitas sekitar.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bukti Foto Selesai</Text>

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
                    <Text style={styles.photoIcon}>✅</Text>
                    <Text style={styles.photoTitle}>Belum ada bukti selesai</Text>
                    <Text style={styles.photoSubtitle}>
                      Upload foto terbaru sebagai bukti bahwa kejadian sudah
                      selesai.
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
                <Text style={styles.sectionTitle}>Catatan Penyelesaian</Text>

                <TextInput
                  value={resolutionNote}
                  onChangeText={setResolutionNote}
                  placeholder="Contoh: Jalan sudah dibersihkan dan kendaraan sudah bisa lewat."
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
                  <Text style={styles.submitText}>Tandai Selesai</Text>
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
  validationNotice: {
    marginTop: 14,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 22,
    padding: 14,
  },
  validationTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#92400E",
  },
  validationText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#B45309",
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
    backgroundColor: "#16A34A",
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