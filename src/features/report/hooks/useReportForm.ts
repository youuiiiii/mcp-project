import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../../contexts/AuthContext";
import { uploadImageAsync } from "../../../services/cloudinaryService";
import { createIncidentReport } from "../../../services/incidentService";
import type {
  IncidentCategory,
  IncidentSeverity,
  IncidentSubcategory,
} from "../../../types/incident";

const MAP_ROUTE = "/(tabs)/map" as Href;

const LOCATION_MAX_ACCURACY_METERS = 80;
const MAX_REPORT_PHOTOS = 4;

export const useReportForm = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [category, setCategory] = useState<IncidentCategory | null>(null);
  const [subcategory, setSubcategory] = useState<IncidentSubcategory | null>(null);
  const [severity, setSeverity] = useState<IncidentSeverity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  const canSubmit = Boolean(
    user &&
      category &&
      cleanTitle.length >= 5 &&
      cleanDescription.length >= 10 &&
      photoUris.length >= 1 &&
      photoUris.length <= MAX_REPORT_PHOTOS &&
      !loading
  );

  // Reset subcategory when category changes
  const handleSetCategory = (cat: IncidentCategory) => {
    setCategory(cat);
    setSubcategory(null);
  };

  const appendPhotos = (uris: string[]) => {
    setPhotoUris((current) => {
      const merged = Array.from(new Set([...current, ...uris]));
      return merged.slice(0, MAX_REPORT_PHOTOS);
    });
  };

  const takePhoto = async () => {
    if (loading) return;
    if (photoUris.length >= MAX_REPORT_PHOTOS) {
      Alert.alert("Maksimal Foto", "Maksimal 4 foto untuk satu laporan.");
      return;
    }
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Izin Kamera Dibutuhkan", "Aktifkan izin kamera untuk mengambil foto bukti.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.75,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (result.canceled) return;
      const assetUri = result.assets?.[0]?.uri;
      if (!assetUri) {
        Alert.alert("Foto Tidak Valid", "Gagal membaca hasil foto.");
        return;
      }
      appendPhotos([assetUri]);
    } catch (error) {
      Alert.alert("Gagal Membuka Kamera", error instanceof Error ? error.message : "Terjadi kesalahan saat membuka kamera.");
    }
  };

  const pickFromGallery = async () => {
    if (loading) return;
    if (photoUris.length >= MAX_REPORT_PHOTOS) {
      Alert.alert("Maksimal Foto", "Maksimal 4 foto untuk satu laporan.");
      return;
    }
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Izin Galeri Dibutuhkan", "Aktifkan izin galeri untuk memilih foto bukti.");
        return;
      }
      const remainingSlots = MAX_REPORT_PHOTOS - photoUris.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.75,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (result.canceled) return;
      const uris = result.assets.map((asset) => asset.uri).filter((uri): uri is string => Boolean(uri));
      if (uris.length === 0) {
        Alert.alert("Foto Tidak Valid", "Gagal membaca gambar dari galeri.");
        return;
      }
      appendPhotos(uris);
    } catch (error) {
      Alert.alert("Gagal Membuka Galeri", error instanceof Error ? error.message : "Terjadi kesalahan saat membuka galeri.");
    }
  };

  const removePhoto = (photoUri: string) => {
    setPhotoUris((current) => current.filter((item) => item !== photoUri));
  };

  const resetForm = () => {
    setCategory(null);
    setSubcategory(null);
    setSeverity("medium");
    setTitle("");
    setDescription("");
    setPhotoUris([]);
  };

  const validateForm = () => {
    if (!user) {
      Alert.alert("Belum Login", "Silakan login terlebih dahulu.");
      return false;
    }
    if (!category) {
      Alert.alert("Kategori Belum Dipilih", "Pilih kategori kejadian dulu.");
      return false;
    }
    if (cleanTitle.length < 5) {
      Alert.alert("Judul Terlalu Pendek", "Judul minimal 5 karakter.");
      return false;
    }
    if (cleanDescription.length < 10) {
      Alert.alert("Deskripsi Terlalu Pendek", "Deskripsi minimal 10 karakter.");
      return false;
    }
    if (photoUris.length < 1) {
      Alert.alert("Foto Wajib Ada", "Tambahkan minimal 1 foto kejadian.");
      return false;
    }
    if (photoUris.length > MAX_REPORT_PHOTOS) {
      Alert.alert("Maksimal Foto", "Maksimal 4 foto untuk satu laporan.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm() || !user || !category) return;
      setLoading(true);

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Izin Lokasi Dibutuhkan", "Aktifkan izin lokasi agar laporan bisa dikirim.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const accuracy = location.coords.accuracy ?? 999;

      if (accuracy > LOCATION_MAX_ACCURACY_METERS) {
        Alert.alert("Akurasi Lokasi Rendah", `Akurasi lokasi kamu sekitar ${Math.round(accuracy)} meter. Coba aktifkan GPS/high accuracy lalu kirim ulang.`);
        return;
      }

      const uploadedImageUrls = await Promise.all(
        photoUris.map((photoUri) => uploadImageAsync(photoUri, "incident-images"))
      );

      if (uploadedImageUrls.length < 1) {
        Alert.alert("Upload Gagal", "Minimal 1 foto bukti wajib berhasil diunggah.");
        return;
      }

      await createIncidentReport({
        category,
        subcategory: subcategory ?? null,
        type: subcategory ?? null,
        title: cleanTitle,
        description: cleanDescription,
        severity,
        imageUri: uploadedImageUrls[0],
        imageUris: uploadedImageUrls,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: null,
        reportedBy: user.displayName || user.email || "Anonymous",
        reporterEmail: user.email ?? null,
      });

      Alert.alert("Laporan Terkirim", "Laporan berhasil dikirim ke Map.", [
        { text: "Lihat Map", onPress: () => { resetForm(); router.push(MAP_ROUTE); } },
        { text: "Buat Lagi", onPress: resetForm },
      ]);
    } catch (error) {
      console.error("Create report error:", error);
      Alert.alert("Gagal Mengirim Laporan", error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim laporan.");
    } finally {
      setLoading(false);
    }
  };

  return {
    category,
    setCategory: handleSetCategory,
    subcategory,
    setSubcategory,
    severity,
    setSeverity,
    title,
    setTitle,
    description,
    setDescription,
    photoUris,
    setPhotoUris,
    loading,
    canSubmit,
    takePhoto,
    pickFromGallery,
    removePhoto,
    handleSubmit,
  };
};