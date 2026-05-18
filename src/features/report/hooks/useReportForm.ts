import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../../contexts/AuthContext";
import { uploadImageAsync } from "../../../services/cloudinaryService";
import {
  createIncidentReport,
  findNearbyActiveIncidentCandidates,
  type NearbyIncidentCandidate,
} from "../../../services/incidentService";
import type {
  IncidentCategory,
  IncidentSeverity,
  IncidentSubcategory,
} from "../../../types/incident";
import { formatDistance } from "../../../utils/geo";

const MAP_ROUTE = "/(tabs)/map" as Href;

const LOCATION_MAX_ACCURACY_METERS = 80;
const MAX_REPORT_PHOTOS = 4;
const DUPLICATE_CHECK_RADIUS_METERS = 150;

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
      Alert.alert("Photo Limit", "You can add up to 4 photos per report.");
      return;
    }
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Camera Permission Needed",
          "Enable camera permission to take evidence photos."
        );
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
        Alert.alert("Invalid Photo", "Could not read the captured photo.");
        return;
      }
      appendPhotos([assetUri]);
    } catch (error) {
      Alert.alert(
        "Could Not Open Camera",
        error instanceof Error
          ? error.message
          : "Something went wrong while opening the camera."
      );
    }
  };

  const pickFromGallery = async () => {
    if (loading) return;
    if (photoUris.length >= MAX_REPORT_PHOTOS) {
      Alert.alert("Photo Limit", "You can add up to 4 photos per report.");
      return;
    }
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Gallery Permission Needed",
          "Enable gallery permission to choose evidence photos."
        );
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
        Alert.alert("Invalid Photo", "Could not read the selected image.");
        return;
      }
      appendPhotos(uris);
    } catch (error) {
      Alert.alert(
        "Could Not Open Gallery",
        error instanceof Error
          ? error.message
          : "Something went wrong while opening the gallery."
      );
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
      Alert.alert("Login Required", "Please log in before sending a report.");
      return false;
    }
    if (!category) {
      Alert.alert("Category Required", "Choose the incident category first.");
      return false;
    }
    if (cleanTitle.length < 5) {
      Alert.alert("Title Too Short", "The title must be at least 5 characters.");
      return false;
    }
    if (cleanDescription.length < 10) {
      Alert.alert(
        "Description Too Short",
        "The description must be at least 10 characters."
      );
      return false;
    }
    if (photoUris.length < 1) {
      Alert.alert("Photo Required", "Add at least 1 incident photo.");
      return false;
    }
    if (photoUris.length > MAX_REPORT_PHOTOS) {
      Alert.alert("Photo Limit", "You can add up to 4 photos per report.");
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
        Alert.alert(
          "Location Permission Needed",
          "Enable location permission so this report can be placed on the map."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const accuracy = location.coords.accuracy ?? 999;

      if (accuracy > LOCATION_MAX_ACCURACY_METERS) {
        Alert.alert(
          "Low Location Accuracy",
          `Your location accuracy is about ${Math.round(
            accuracy
          )} meters. Turn on high accuracy/GPS and try again.`
        );
        return;
      }

      const nearbyCandidates = await findNearbyActiveIncidentCandidates({
        category,
        subcategory,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radiusMeters: DUPLICATE_CHECK_RADIUS_METERS,
      });

      if (nearbyCandidates.length > 0) {
        const shouldCreateNewReport = await confirmNewReportDespiteDuplicate(
          nearbyCandidates[0]
        );

        if (!shouldCreateNewReport) {
          router.push(MAP_ROUTE);
          return;
        }
      }

      const uploadedImageUrls = await Promise.all(
        photoUris.map((photoUri) => uploadImageAsync(photoUri, "incident-images"))
      );

      if (uploadedImageUrls.length < 1) {
        Alert.alert(
          "Upload Failed",
          "At least 1 evidence photo must upload successfully."
        );
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

      Alert.alert("Report Sent", "Your report has been added to the map.", [
        {
          text: "View Map",
          onPress: () => {
            resetForm();
            router.push(MAP_ROUTE);
          },
        },
        { text: "Create Another", onPress: resetForm },
      ]);
    } catch (error) {
      console.error("Create report error:", error);
      Alert.alert(
        "Could Not Send Report",
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the report."
      );
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

function confirmNewReportDespiteDuplicate(
  candidate: NearbyIncidentCandidate
): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "Similar Incident Nearby",
      `"${candidate.incident.title}" is about ${formatDistance(
        candidate.distanceMeters
      )} away. Updating the existing incident usually keeps the map cleaner.`,
      [
        {
          text: "Review Map",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Submit New",
          style: "destructive",
          onPress: () => resolve(true),
        },
      ]
    );
  });
}
