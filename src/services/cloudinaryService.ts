import { CLOUDINARY_CONFIG } from "../constants/cloudinaryConfig";

type CloudinaryFolder = "incident-images" | "resolution-images";

type CloudinaryResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

export const uploadImageAsync = async (
  uri: string,
  folder: CloudinaryFolder
): Promise<string> => {
  if (!uri) {
    throw new Error("Invalid image URI.");
  }

  if (
    !CLOUDINARY_CONFIG.cloudName ||
    CLOUDINARY_CONFIG.cloudName === "ISI_CLOUD_NAME_KAMU"
  ) {
    throw new Error("Cloudinary cloudName is not configured.");
  }

  if (
    !CLOUDINARY_CONFIG.uploadPreset ||
    CLOUDINARY_CONFIG.uploadPreset === "ISI_UPLOAD_PRESET_KAMU"
  ) {
    throw new Error("Cloudinary upload preset is not configured.");
  }

  const formData = new FormData();

  const file = {
    uri,
    type: "image/jpeg",
    name: `${folder}-${Date.now()}.jpg`,
  };

  formData.append("file", file as any);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = (await response.json()) as CloudinaryResponse;

  if (!response.ok || !data.secure_url) {
    throw new Error(
      data.error?.message || "Could not upload image to Cloudinary."
    );
  }

  return data.secure_url;
};
