import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  getCategoryBySubcategory,
  getIncidentMeta,
} from "../../src/constants/incident";
import { useAuth } from "../../src/contexts/AuthContext";
import { createIncidentReport } from "../../src/services/incidentService";
import {
  IncidentSeverity,
  IncidentSubcategory,
} from "../../src/types/incident";

const MAP_ROUTE = "/(tabs)/map" as Href;

const LOCATION_MAX_ACCURACY_METERS = 80;

type IncidentOption = {
  subcategory: IncidentSubcategory;
  description: string;
};

const INCIDENT_OPTIONS: IncidentOption[] = [
  {
    subcategory: "flood",
    description: "Banjir, genangan tinggi, atau arus air berbahaya.",
  },
  {
    subcategory: "earthquake",
    description: "Guncangan gempa atau dampak kerusakan sekitar.",
  },
  {
    subcategory: "fire",
    description: "Api, asap tebal, atau kebakaran di sekitar.",
  },
  {
    subcategory: "traffic_accident",
    description: "Kecelakaan lalu lintas atau kondisi jalan berbahaya.",
  },
  {
    subcategory: "fallen_tree",
    description: "Pohon tumbang yang menghalangi jalan atau area publik.",
  },
  {
    subcategory: "road_block",
    description: "Jalan tertutup, akses terhalang, atau kemacetan bahaya.",
  },
  {
    subcategory: "crime",
    description: "Kriminalitas, pencurian, atau kondisi keamanan berisiko.",
  },
  {
    subcategory: "medical",
    description: "Orang pingsan, darurat medis, atau butuh bantuan cepat.",
  },
  {
    subcategory: "public_disturbance",
    description: "Kerumunan berisiko, gangguan publik, atau situasi tidak aman.",
  },
];

const SEVERITY_OPTIONS: {
  value: IncidentSeverity;
  label: string;
  description: string;
  color: string;
  backgroundColor: string;
}[] = [
  {
    value: "low",
    label: "Low",
    description: "Perlu diketahui",
    color: "#16A34A",
    backgroundColor: "#DCFCE7",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Perlu diwaspadai",
    color: "#D97706",
    backgroundColor: "#FEF3C7",
  },
  {
    value: "high",
    label: "High",
    description: "Butuh perhatian cepat",
    color: "#DC2626",
    backgroundColor: "#FEE2E2",
  },
];

export default function ReportScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [subcategory, setSubcategory] = useState<IncidentSubcategory | null>(
    null
  );
  const [severity, setSeverity] = useState<IncidentSeverity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedMeta = useMemo(() => {
    if (!subcategory) {
      return null;
    }

    return getIncidentMeta(subcategory);
  }, [subcategory]);

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

    if (!result.canceled) {
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
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setSubcategory(null);
    setSeverity("medium");
    setTitle("");
    setDescription("");
    setPhoto(null);
  };

  const handleSubmit = async () => {
    if (!subcategory) {
      Alert.alert("Kategori Belum Dipilih", "Pilih jenis kejadian dulu.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Judul Wajib Diisi", "Masukkan judul laporan.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Deskripsi Wajib Diisi", "Jelaskan kondisi kejadian.");
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

      const category = getCategoryBySubcategory(subcategory);

      await createIncidentReport({
        category,
        subcategory,
        title,
        description,
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>COMMUNITY REPORT</Text>
        </View>

        <Text style={styles.title}>Report Incident</Text>

        <Text style={styles.subtitle}>
          Laporkan kejadian sekitar dengan lokasi realtime dan bukti foto agar
          warga lain dapat ikut memantau.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. What happened?</Text>
        <Text style={styles.sectionSubtitle}>
          Pilih jenis kejadian yang paling sesuai.
        </Text>

        <View style={styles.incidentGrid}>
          {INCIDENT_OPTIONS.map((item) => {
            const meta = getIncidentMeta(item.subcategory);
            const active = subcategory === item.subcategory;

            return (
              <Pressable
                key={item.subcategory}
                onPress={() => setSubcategory(item.subcategory)}
                disabled={loading}
                style={({ pressed }) => [
                  styles.incidentCard,
                  active && {
                    borderColor: meta.color,
                    backgroundColor: `${meta.color}12`,
                  },
                  pressed && styles.cardPressed,
                ]}
              >
                <View
                  style={[
                    styles.incidentIconWrap,
                    {
                      backgroundColor: `${meta.color}18`,
                    },
                  ]}
                >
                  <Text style={styles.incidentIcon}>{meta.icon}</Text>
                </View>

                <Text style={styles.incidentLabel}>{meta.label}</Text>
                <Text style={styles.incidentDescription}>
                  {item.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Details</Text>

        <Text style={styles.label}>Judul laporan</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          editable={!loading}
          placeholder={
            selectedMeta
              ? `Contoh: ${selectedMeta.label} di dekat lokasi saya`
              : "Contoh: Kebakaran di dekat lokasi saya"
          }
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />

        <Text style={styles.label}>Deskripsi</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          editable={!loading}
          placeholder="Jelaskan situasi, kondisi sekitar, dan hal penting yang perlu diketahui."
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.textArea]}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Severity</Text>
        <Text style={styles.sectionSubtitle}>
          Pilih seberapa mendesak kondisi saat ini.
        </Text>

        <View style={styles.severityRow}>
          {SEVERITY_OPTIONS.map((item) => {
            const active = severity === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => setSeverity(item.value)}
                disabled={loading}
                style={({ pressed }) => [
                  styles.severityCard,
                  active && {
                    borderColor: item.color,
                    backgroundColor: item.backgroundColor,
                  },
                  pressed && styles.cardPressed,
                ]}
              >
                <Text
                  style={[
                    styles.severityLabel,
                    active && {
                      color: item.color,
                    },
                  ]}
                >
                  {item.label}
                </Text>

                <Text style={styles.severityDescription}>
                  {item.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Evidence</Text>
        <Text style={styles.sectionSubtitle}>
          Foto wajib untuk membantu validasi laporan.
        </Text>

        <View style={styles.photoRow}>
          <Pressable
            onPress={takePhoto}
            disabled={loading}
            style={({ pressed }) => [
              styles.photoButton,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.photoButtonIcon}>📷</Text>
            <Text style={styles.photoButtonText}>Camera</Text>
          </Pressable>

          <Pressable
            onPress={pickFromGallery}
            disabled={loading}
            style={({ pressed }) => [
              styles.photoButton,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.photoButtonIcon}>🖼️</Text>
            <Text style={styles.photoButtonText}>Gallery</Text>
          </Pressable>
        </View>

        {photo ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: photo }} style={styles.previewImage} />

            <Pressable
              onPress={() => setPhoto(null)}
              disabled={loading}
              style={styles.removePhotoButton}
            >
              <Text style={styles.removePhotoText}>Remove photo</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={styles.locationCard}>
        <View style={styles.locationIcon}>
          <Text style={styles.locationIconText}>📍</Text>
        </View>

        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>Realtime location</Text>
          <Text style={styles.locationText}>
            Lokasi akan diambil otomatis saat laporan dikirim. Pastikan kamu
            berada di sekitar lokasi kejadian.
          </Text>
        </View>
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.submitButtonPressed,
          loading && styles.submitButtonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#B91C1C",
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 12,
  },
  incidentGrid: {
    gap: 12,
  },
  incidentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  incidentIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  incidentIcon: {
    fontSize: 24,
  },
  incidentLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 5,
  },
  incidentDescription: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  textArea: {
    minHeight: 120,
  },
  severityRow: {
    flexDirection: "row",
    gap: 10,
  },
  severityCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4,
  },
  severityDescription: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    lineHeight: 16,
  },
  photoRow: {
    flexDirection: "row",
    gap: 12,
  },
  photoButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
  },
  photoButtonIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  previewWrap: {
    marginTop: 14,
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 22,
    resizeMode: "cover",
  },
  removePhotoButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  removePhotoText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#DC2626",
  },
  locationCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 20,
  },
  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  locationIconText: {
    fontSize: 22,
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
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
    lineHeight: 19,
  },
  submitButton: {
    backgroundColor: "#DC2626",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#991B1B",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  submitButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});