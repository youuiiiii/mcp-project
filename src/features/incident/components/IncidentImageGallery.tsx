import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useMemo, useState } from "react";

import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";

type IncidentImageGalleryVariant = "compact" | "detail";

type IncidentImageGalleryProps = {
  imageUri?: string | null;
  imageUris?: string[];
  variant?: IncidentImageGalleryVariant;
  style?: StyleProp<ViewStyle>;
};

export default function IncidentImageGallery({
  imageUri,
  imageUris,
  variant = "detail",
  style,
}: IncidentImageGalleryProps) {
  const images = useMemo(() => {
    return normalizeImages(imageUri, imageUris);
  }, [imageUri, imageUris]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  if (images.length === 0) {
    return null;
  }

  if (variant === "compact") {
    return (
      <>
        <Pressable
          onPress={() => setPreviewUri(images[0])}
          style={({ pressed }) => [
            styles.compactFrame,
            style,
            pressed && styles.pressed,
          ]}
        >
          <Image source={{ uri: images[0] }} style={styles.image} />

          {images.length > 1 ? (
            <View style={styles.countBadge}>
              <Ionicons name="images" size={13} color={colors.textInverse} />
              <Text style={styles.countText}>{images.length}</Text>
            </View>
          ) : null}
        </Pressable>

        <ImagePreviewModal
          imageUri={previewUri}
          images={images}
          onSelect={setPreviewUri}
          onClose={() => setPreviewUri(null)}
        />
      </>
    );
  }

  return (
    <>
      <View style={[styles.detailContainer, style]}>
        <Pressable
          onPress={() => setPreviewUri(images[0])}
          style={({ pressed }) => [
            styles.heroFrame,
            pressed && styles.pressed,
          ]}
        >
          <Image source={{ uri: images[0] }} style={styles.image} />
        </Pressable>

        {images.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailRow}
          >
            {images.map((item, index) => (
              <Pressable
                key={`${item}-${index}`}
                onPress={() => setPreviewUri(item)}
                style={({ pressed }) => [
                  styles.thumbnailFrame,
                  pressed && styles.pressed,
                ]}
              >
                <Image source={{ uri: item }} style={styles.image} />
                <View style={styles.thumbnailIndex}>
                  <Text style={styles.thumbnailIndexText}>{index + 1}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
      </View>

      <ImagePreviewModal
        imageUri={previewUri}
        images={images}
        onSelect={setPreviewUri}
        onClose={() => setPreviewUri(null)}
      />
    </>
  );
}

function normalizeImages(imageUri?: string | null, imageUris?: string[]) {
  return Array.from(
    new Set(
      [imageUri, ...(imageUris ?? [])]
        .map((item) => item?.trim())
        .filter((item): item is string => Boolean(item))
    )
  );
}

function ImagePreviewModal({
  imageUri,
  images,
  onSelect,
  onClose,
}: {
  imageUri: string | null;
  images: string[];
  onSelect: (imageUri: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={Boolean(imageUri)}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.previewBackdrop}>
        <Pressable style={styles.previewCloseArea} onPress={onClose} />

        <View style={styles.previewHeader}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.previewCloseButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="close" size={24} color={colors.textInverse} />
          </Pressable>
        </View>

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        ) : null}

        {images.length > 1 ? (
          <View style={styles.previewThumbRail}>
            {images.map((item, index) => {
              const active = item === imageUri;

              return (
                <Pressable
                  key={`${item}-${index}`}
                  onPress={() => onSelect(item)}
                  style={[
                    styles.previewThumb,
                    active && styles.previewThumbActive,
                  ]}
                >
                  <Image source={{ uri: item }} style={styles.image} />
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  compactFrame: {
    marginTop: spacing.md,
    width: "100%",
    height: 154,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  detailContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  heroFrame: {
    width: "100%",
    height: 230,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  countBadge: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radius.full,
    backgroundColor: "rgba(15, 23, 42, 0.78)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  countText: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.textInverse,
  },
  thumbnailRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  thumbnailFrame: {
    width: 78,
    height: 78,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  thumbnailIndex: {
    position: "absolute",
    left: 6,
    top: 6,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: "rgba(15, 23, 42, 0.74)",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailIndexText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.textInverse,
  },
  pressed: {
    opacity: 0.82,
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.94)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },
  previewHeader: {
    position: "absolute",
    top: 48,
    right: 18,
    zIndex: 2,
  },
  previewCloseButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "78%",
  },
  previewThumbRail: {
    position: "absolute",
    bottom: 34,
    flexDirection: "row",
    gap: spacing.sm,
  },
  previewThumb: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  previewThumbActive: {
    borderColor: colors.textInverse,
  },
});
