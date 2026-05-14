import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";

import { INCIDENT_CATEGORY_OPTIONS } from "../../../constants/incident";
import { useAuth } from "../../../contexts/AuthContext";
import { uploadImageAsync } from "../../../services/cloudinaryService";
import { createIncidentReport } from "../../../services/incidentService";
import type {
  IncidentCategory,
  IncidentSeverity,
} from "../../../types/incident";

const MAP_ROUTE = "/(tabs)/map" as Href;
const LOCATION_MAX_ACCURACY_METERS = 80;

export const useReportForm = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [category, setCategory] = useState<IncidentCategory | null>(null);
  const [severity, setSeverity] = useState<IncidentSeverity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedCategoryMeta = useMemo(() => {
    if (!category) {
      return null;
    }

    return (
      INCIDENT_CATEGORY_OPTIONS.find((item) => item.value === category) ?? null
    );
  }, [category]);

  const canSubmit = Boolean(
    category &&
      title.trim().length >= 5 &&
      description.trim().length >= 10 &&
      photoUri &&
      !loading
  );

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Izin Kamera Dibutuhkan",
        "Aktifkan izin kamera untuk mengambil foto bukti."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    });

    const assetUri = result.assets?.[0]?.uri;

    if (!result.canceled && assetUri) {
      setPhotoUri(assetUri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Izin Galeri Dibutuhkan",
        "Aktifkan izin galeri untuk memilih foto bukti."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    const assetUri = result.assets?.[0]?.uri;

    if (!result.canceled && assetUri) {
      setPhotoUri(assetUri);
    }
  };

  const resetForm = () => {
    setCategory(null);
    setSeverity("medium");
    setTitle("");
    setDescription("");
    setPhotoUri(null);
  };

  const handleSubmit = async () => {
    if (!category) {
      Alert.alert("Kategori Belum Dipilih", "Pilih kategori kejadian dulu.");
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

    if (!photoUri) {
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

      const uploadedImageUrl = await uploadImageAsync(
        photoUri,
        "incident-images"
      );

      await createIncidentReport({
        category,
        subcategory: null,
        type: null,
        title: cleanTitle,
        description: cleanDescription,
        severity,
        imageUri: uploadedImageUrl,
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

  return {
    category,
    setCategory,
    severity,
    setSeverity,
    title,
    setTitle,
    description,
    setDescription,
    photoUri,
    setPhotoUri,
    loading,
    selectedCategoryMeta,
    canSubmit,
    takePhoto,
    pickFromGallery,
    handleSubmit,
  };
};