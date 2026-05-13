import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";

import {
  INCIDENT_CATEGORY_OPTIONS,
  SEVERITY_OPTIONS,
} from "../../src/constants/incident";
import { useAuth } from "../../src/contexts/AuthContext";
import { createIncidentReport } from "../../src/services/incidentService";
import { colors } from "../../src/theme/colors";
import { radius, shadow, spacing } from "../../src/theme/layout";
import { typography } from "../../src/theme/typography";
import {
  IncidentCategory,
  IncidentSeverity,
} from "../../src/types/incident";

import AppButton from "../../src/components/ui/AppButton";
import AppCard from "../../src/components/ui/AppCard";
import AppScreen from "../../src/components/ui/AppScreen";
import IconBadge from "../../src/components/ui/IconBadge";
import SectionHeader from "../../src/components/ui/SectionHeader";
import StatusBadge from "../../src/components/ui/StatusBadge";

const MAP_ROUTE = "/(tabs)/map" as Href;

const LOCATION_MAX_ACCURACY_METERS = 80;

export default function ReportScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [category, setCategory] = useState<IncidentCategory | null>(null);
  const [severity, setSeverity] = useState<IncidentSeverity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedCategoryMeta = useMemo(() => {
    if (!category) {
      return null;
    }

    return INCIDENT_CATEGORY_OPTIONS.find((item) => item.value === category) ?? null;
  }, [category]);

  const canSubmit = Boolean(
    category &&
      title.trim().length >= 5 &&
      description.trim().length >= 10 &&
      photo &&
      !loading
  );

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Izin Kamera Dibutuhkan", "Aktifkan izin kamera dulu.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Izin Galeri Dibutuhkan", "Aktifkan izin galeri dulu.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhoto(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setCategory(null);
    setSeverity("medium");
    setTitle("");
    setDescription("");
    setPhoto(null);
  };

  const handleSubmit = async () => {
    if (!category) {
      Alert.alert("Kategori Belum Dipilih", "Pilih tema kejadian dulu.");
      return;
    }

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (cleanTitle.length < 5) {
      Alert.alert("Judul Terlalu Pendek", "Judul minimal 5 karakter.");
      return;
    }

    if (cleanDescription.length < 10) {
      Alert.alert("Deskripsi Terlalu Pendek", "Deskripsi minimal 10 karakter.");
      return;
    }

    if (!photo) {
      Alert.alert("Foto Wajib Ada", "Tambahkan foto bukti kejadian.");
      return;
    }

    try {
      setLoading(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Izin Lokasi Dibutuhkan",
          "Aktifkan izin lokasi agar laporan bisa dikirim."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const accuracy = location.coords.accuracy ?? 999;

      if (accuracy > LOCATION_MAX_ACCURACY_METERS) {
        Alert.alert(
          "Akurasi Lokasi Rendah",
          `Akurasi lokasi kamu sekitar ${Math.round(
            accuracy
          )} meter. Coba aktifkan GPS/high accuracy lalu kirim ulang.`
        );
        return;
      }

      await createIncidentReport({
        category,
        subcategory: null,
        type: null,
        title: cleanTitle,
        description: cleanDescription,
        severity,
        imageUri: photo,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: null,
        reportedBy: user?.displayName || user?.email || "Anonymous",
        reporterEmail: user?.email ?? null,
      });

      Alert.alert("Laporan Terkirim", "Laporan berhasil dikirim.", [
        {
          text: "Lihat Map",
          onPress: () => {
            resetForm();
            router.push(MAP_ROUTE);
          },
        },
        {
          text: "Buat Lagi",
          onPress: resetForm,
        },
      ]);
    } catch (error) {
      console.error("Create report error:", error);

      Alert.alert(
        "Gagal Mengirim Laporan",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim laporan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen keyboardAvoiding contentContainerStyle={styles.screenContent}>
      <View style={styles.header}>
        <StatusBadge
          label="Community Report"
          variant="danger"
          size="sm"
          style={styles.headerBadge}
        />

        <Text style={styles.title}>Report Incident</Text>

        <Text style={styles.subtitle}>
          Laporkan kejadian sekitar dengan lokasi realtime dan bukti foto agar
          warga lain dapat ikut memantau.
        </Text>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="1. Tema Kejadian"
          subtitle="Pilih kategori besar. Detail spesifik cukup ditulis di judul dan deskripsi."
          style={styles.sectionHeader}
        />

        <View style={styles.categoryList}>
          {INCIDENT_CATEGORY_OPTIONS.map((item) => {
            const active = category === item.value;

            return (
              <AppCard
                key={item.value}
                onPress={() => setCategory(item.value)}
                padding="md"
                style={[
                  styles.categoryCard,
                  active && {
                    borderColor: item.color,
                    backgroundColor: item.lightColor,
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

        {selectedCategoryMeta ? (
          <AppCard
            variant="muted"
            style={[
              styles.categoryInfoCard,
              {
                backgroundColor: selectedCategoryMeta.lightColor,
                borderColor: selectedCategoryMeta.color,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryInfoTitle,
                {
                  color: selectedCategoryMeta.color,
                },
              ]}
            >
              {selectedCategoryMeta.label}
            </Text>

            <Text style={styles.categoryInfoText}>
              Gunakan judul dan deskripsi untuk menjelaskan detail kejadian,
              misalnya banjir, gempa, pohon tumbang, pencurian, atau kondisi
              medis.
            </Text>
          </AppCard>
        ) : null}
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="2. Details"
          subtitle="Judul dan deskripsi adalah sumber detail utama laporan."
          style={styles.sectionHeader}
        />

        <Text style={styles.label}>Judul laporan</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          editable={!loading}
          placeholder="Contoh: Pohon tumbang menutup jalan utama"
          placeholderTextColor={colors.textSoft}
          style={styles.input}
        />

        <StatusBadge
          label={`${title.trim().length}/5 minimum karakter`}
          variant={title.trim().length >= 5 ? "success" : "neutral"}
          size="sm"
        />

        <Text style={styles.label}>Deskripsi</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          editable={!loading}
          placeholder="Jelaskan situasi, kondisi sekitar, dampak, dan hal penting yang perlu diketahui."
          placeholderTextColor={colors.textSoft}
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.textArea]}
        />

        <StatusBadge
          label={`${description.trim().length}/10 minimum karakter`}
          variant={description.trim().length >= 10 ? "success" : "neutral"}
          size="sm"
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="3. Severity"
          subtitle="Pilih seberapa mendesak kondisi saat ini."
          style={styles.sectionHeader}
        />

        <View style={styles.severityRow}>
          {SEVERITY_OPTIONS.map((item) => {
            const active = severity === item.value;

            return (
              <AppCard
                key={item.value}
                onPress={() => setSeverity(item.value)}
                padding="sm"
                style={[
                  styles.severityCard,
                  active && {
                    borderColor: item.color,
                    backgroundColor: item.color,
                  },
                ]}
              >
                <Ionicons
                  name={item.iconName}
                  size={22}
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
          title="4. Evidence"
          subtitle="Foto wajib untuk membantu validasi laporan."
          style={styles.sectionHeader}
        />

        <View style={styles.photoRow}>
          <AppCard
            onPress={takePhoto}
            padding="lg"
            variant="outlined"
            style={styles.photoButton}
          >
            <IconBadge variant="danger" size="md" rounded={false}>
              <Ionicons name="camera" size={22} color={colors.danger} />
            </IconBadge>

            <Text style={styles.photoButtonText}>Camera</Text>
          </AppCard>

          <AppCard
            onPress={pickFromGallery}
            padding="lg"
            variant="outlined"
            style={styles.photoButton}
          >
            <IconBadge variant="info" size="md" rounded={false}>
              <Ionicons name="image" size={22} color={colors.info} />
            </IconBadge>

            <Text style={styles.photoButtonText}>Gallery</Text>
          </AppCard>
        </View>

        {photo ? (
          <AppCard padding="none" style={styles.previewCard}>
            <Image source={{ uri: photo }} style={styles.previewImage} />

            <View style={styles.previewFooter}>
              <View style={styles.previewInfo}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.success}
                />
                <Text style={styles.previewText}>Foto bukti sudah dipilih</Text>
              </View>

              <AppButton
                title="Remove"
                variant="ghost"
                size="sm"
                disabled={loading}
                onPress={() => setPhoto(null)}
                textStyle={styles.removePhotoText}
              />
            </View>
          </AppCard>
        ) : null}
      </View>

      <AppCard variant="muted" style={styles.locationCard}>
        <IconBadge variant="info" size="md" rounded={false}>
          <Ionicons name="location" size={22} color={colors.info} />
        </IconBadge>

        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>Realtime location</Text>
          <Text style={styles.locationText}>
            Lokasi akan diambil otomatis saat laporan dikirim. Pastikan kamu
            berada di sekitar lokasi kejadian.
          </Text>
        </View>
      </AppCard>

      <AppButton
        title="Submit Report"
        variant="danger"
        size="lg"
        fullWidth
        loading={loading}
        disabled={!canSubmit}
        onPress={handleSubmit}
        leftIcon={
          <Ionicons name="send" size={18} color={colors.textInverse} />
        }
        style={styles.submitButton}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: spacing["2xl"],
  },
  header: {
    gap: spacing.sm,
  },
  headerBadge: {
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  categoryList: {
    gap: spacing.md,
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
  categoryInfoCard: {
    gap: spacing.xs,
  },
  categoryInfoTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  categoryInfoText: {
    ...typography.caption,
    color: "#475569",
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  textArea: {
    minHeight: 120,
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
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    marginTop: spacing.sm,
  },
  severityLabelActive: {
    color: colors.textInverse,
  },
  severityDescription: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    lineHeight: 14,
    marginTop: 4,
  },
  severityDescriptionActive: {
    color: colors.textInverse,
  },
  photoRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  photoButton: {
    flex: 1,
    alignItems: "center",
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    gap: spacing.sm,
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  previewCard: {
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  previewFooter: {
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  previewInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  previewText: {
    flex: 1,
    ...typography.caption,
    color: colors.textMuted,
  },
  removePhotoText: {
    color: colors.danger,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.infoSoft,
    borderColor: "#BFDBFE",
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  locationText: {
    ...typography.caption,
    color: colors.info,
  },
  submitButton: {
    ...shadow.floating,
    shadowColor: colors.primaryDark,
  },
});