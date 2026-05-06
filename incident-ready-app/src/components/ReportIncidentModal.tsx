import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
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
  INCIDENT_CATEGORY_OPTIONS,
  SEVERITY_OPTIONS,
  getIncidentCategoryMeta,
  getIncidentMeta,
  getSubcategoriesByCategory,
} from "../constants/incident";
import { useAuth } from "../contexts/AuthContext";
import { uploadImageAsync } from "../services/cloudinaryService";
import { createIncidentReport } from "../services/incidentService";
import {
  Coordinate,
  IncidentCategory,
  IncidentSeverity,
  IncidentSubcategory,
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
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<IncidentSubcategory | null>(null);
  const [selectedSeverity, setSelectedSeverity] =
    useState<IncidentSeverity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subcategoryOptions = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return getSubcategoriesByCategory(selectedCategory);
  }, [selectedCategory]);

  const selectedSubcategoryMeta = selectedSubcategory
    ? getIncidentMeta(selectedSubcategory)
    : null;

  const resetForm = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
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

  const handleSelectCategory = (category: IncidentCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
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
      Alert.alert("Kategori Wajib Dipilih", "Pilih kategori kejadian terlebih dahulu.");
      return false;
    }

    if (!selectedSubcategory) {
      Alert.alert(
        "Subkategori Wajib Dipilih",
        "Pilih subkategori kejadian terlebih dahulu."
      );
      return false;
    }

    if (!title.trim()) {
      Alert.alert("Judul Wajib Diisi", "Masukkan judul laporan kejadian.");
      return false;
    }

    if (title.trim().length < 5) {
      Alert.alert("Judul Terlalu Pendek", "Judul minimal 5 karakter.");
      return false;
    }

    if (!description.trim()) {
      Alert.alert("Deskripsi Wajib Diisi", "Jelaskan kondisi kejadian di lokasi.");
      return false;
    }

    if (description.trim().length < 10) {
      Alert.alert("Deskripsi Terlalu Pendek", "Deskripsi minimal 10 karakter.");
      return false;
    }

    if (!imageUri) {
      Alert.alert(
        "Bukti Foto Wajib",
        "Ambil foto kejadian terlebih dahulu sebagai validasi laporan."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      if (
        !coordinate ||
        !selectedCategory ||
        !selectedSubcategory ||
        !imageUri ||
        !user
      ) {
        Alert.alert(
          "Data Tidak Lengkap",
          "Pastikan kategori, subkategori, lokasi, foto, dan akun login tersedia."
        );
        return;
      }

      const currentUser = user;

      setSubmitting(true);

      const uploadedImageUrl = await uploadImageAsync(
        imageUri,
        "incident-images"
      );

      await createIncidentReport({
        category: selectedCategory,
        subcategory: selectedSubcategory,
        type: selectedSubcategory,
        title,
        description,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        severity: selectedSeverity,
        imageUri: uploadedImageUrl,
        address: null,
        reportedBy:
          currentUser.displayName ?? currentUser.email ?? currentUser.uid,
        reporterEmail: currentUser.email ?? null,
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
              <View>
                <Text style={styles.title}>Laporkan Kejadian</Text>
                <Text style={styles.subtitle}>
                  Pilih kategori, subkategori, isi detail, dan sertakan bukti foto.
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
              <View style={styles.locationBox}>
                <Text style={styles.locationLabel}>Lokasi kejadian</Text>
                <Text style={styles.locationValue}>
                  {coordinate
                    ? `${coordinate.latitude.toFixed(
                        6
                      )}, ${coordinate.longitude.toFixed(6)}`
                    : "Belum ada lokasi"}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Kategori Kejadian</Text>

                <View style={styles.categoryGrid}>
                  {INCIDENT_CATEGORY_OPTIONS.map((item) => {
                    const active = selectedCategory === item.value;

                    return (
                      <Pressable
                        key={item.value}
                        onPress={() => handleSelectCategory(item.value)}
                        style={({ pressed }) => [
                          styles.categoryButton,
                          active && {
                            backgroundColor: item.lightColor,
                            borderColor: item.color,
                          },
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text style={styles.categoryIcon}>{item.icon}</Text>
                        <Text
                          style={[
                            styles.categoryLabel,
                            active && { color: item.color },
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={styles.categoryDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {selectedCategory ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Subkategori {getIncidentCategoryMeta(selectedCategory).label}
                  </Text>

                  <View style={styles.typeGrid}>
                    {subcategoryOptions.map((item) => {
                      const active = selectedSubcategory === item.value;

                      return (
                        <Pressable
                          key={item.value}
                          onPress={() => setSelectedSubcategory(item.value)}
                          style={({ pressed }) => [
                            styles.typeButton,
                            active && {
                              backgroundColor: item.lightColor,
                              borderColor: item.color,
                            },
                            pressed && styles.pressed,
                          ]}
                        >
                          <Text style={styles.typeIcon}>{item.icon}</Text>
                          <Text
                            style={[
                              styles.typeLabel,
                              active && { color: item.color },
                            ]}
                            numberOfLines={2}
                          >
                            {item.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              {selectedSubcategoryMeta ? (
                <View
                  style={[
                    styles.selectedInfoBox,
                    {
                      backgroundColor: selectedSubcategoryMeta.lightColor,
                      borderColor: selectedSubcategoryMeta.color,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.selectedInfoTitle,
                      {
                        color: selectedSubcategoryMeta.color,
                      },
                    ]}
                  >
                    {selectedSubcategoryMeta.icon} {selectedSubcategoryMeta.label}
                  </Text>
                  <Text style={styles.selectedInfoText}>
                    Radius dampak visual sekitar {selectedSubcategoryMeta.radius} meter.
                  </Text>
                </View>
              ) : null}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Severity</Text>

                <View style={styles.severityRow}>
                  {SEVERITY_OPTIONS.map((item) => {
                    const active = selectedSeverity === item.value;

                    return (
                      <Pressable
                        key={item.value}
                        onPress={() => setSelectedSeverity(item.value)}
                        style={({ pressed }) => [
                          styles.severityButton,
                          active && {
                            backgroundColor: item.color,
                            borderColor: item.color,
                          },
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.severityText,
                            active && styles.severityTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Judul</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Contoh: Pohon tumbang menutup jalan"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  editable={!submitting}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Deskripsi</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Jelaskan kondisi, dampak, dan area yang terganggu..."
                  placeholderTextColor="#94A3B8"
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                  editable={!submitting}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bukti Foto</Text>

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
                      Foto wajib diisi untuk membantu validasi laporan.
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
                  <Text style={styles.submitText}>Kirim Laporan</Text>
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
    maxWidth: 270,
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
  locationBox: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 20,
    padding: 14,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#047857",
  },
  locationValue: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "700",
    color: "#064E3B",
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
  categoryGrid: {
    gap: 10,
  },
  categoryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    padding: 14,
  },
  categoryIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  categoryDescription: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 17,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  typeButton: {
    width: "48%",
    minHeight: 84,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    padding: 12,
    justifyContent: "center",
  },
  typeIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#475569",
    lineHeight: 16,
  },
  selectedInfoBox: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
  },
  selectedInfoTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  selectedInfoText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  severityRow: {
    flexDirection: "row",
    gap: 10,
  },
  severityButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  severityText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#475569",
  },
  severityTextActive: {
    color: "#FFFFFF",
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