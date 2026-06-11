const appJson = require("./app.json");

const googleMapsAndroidApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY?.trim();

const config = {
  ...appJson.expo,
  android: {
    ...appJson.expo.android,
  },
};

if (googleMapsAndroidApiKey) {
  config.android.config = {
    ...config.android.config,
    googleMaps: {
      ...config.android.config?.googleMaps,
      apiKey: googleMapsAndroidApiKey,
    },
  };
}

module.exports = config;
