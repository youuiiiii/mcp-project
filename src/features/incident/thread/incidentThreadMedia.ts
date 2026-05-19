import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export async function pickReplyImageFromGallery(): Promise<string | null> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Gallery Permission Needed",
        "Enable gallery permission to add an image update."
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets?.[0]?.uri ?? null;
  } catch (error) {
    Alert.alert(
      "Could Not Open Gallery",
      error instanceof Error
        ? error.message
        : "Something went wrong while opening the gallery."
    );
    return null;
  }
}

export async function takeReplyImagePhoto(): Promise<string | null> {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Camera Permission Needed",
        "Enable camera permission to capture an image update."
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets?.[0]?.uri ?? null;
  } catch (error) {
    Alert.alert(
      "Could Not Open Camera",
      error instanceof Error
        ? error.message
        : "Something went wrong while opening the camera."
    );
    return null;
  }
}
