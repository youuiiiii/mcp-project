import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";

import { useAuth } from "../../contexts/AuthContext";
import { createSOSLog } from "../../services/sosService";
import { colors } from "../../theme/colors";
import { radius, shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

type SosSlideModalProps = {
  visible: boolean;
  onClose: () => void;
};

const SLIDER_WIDTH = Dimensions.get("window").width - spacing["2xl"] * 2 - spacing.md * 2;
const KNOB_SIZE = 56;
const MAX_SLIDE = SLIDER_WIDTH - KNOB_SIZE - 8;

export default function SosSlideModal({ visible, onClose }: SosSlideModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Reset slider when modal opens
  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      setLoading(false);
    }
  }, [visible, slideAnim]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const triggerSOS = async () => {
    try {
      setLoading(true);

      // 1. Call 112 (Emergency)
      Linking.openURL("tel:112");

      if (user) {
        // 2. Broadcast to community (requires location)
        const locationPermission = await Location.requestForegroundPermissionsAsync();
        if (locationPermission.status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          await createSOSLog({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            userId: user.uid,
            userName: user.displayName,
            userEmail: user.email,
          });
        }
      }

      Alert.alert(
        "SOS Triggered",
        "Your dialer has been opened. Please press 'Call'. Your location was broadcasted to nearby users.",
        [{ text: "OK", onPress: onClose }]
      );
    } catch (error) {
      console.error("SOS trigger error:", error);
      Alert.alert("Error", "Could not trigger SOS properly, but try dialing 112 directly.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > MAX_SLIDE) newX = MAX_SLIDE;
        slideAnim.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > MAX_SLIDE * 0.9) {
          // Triggered!
          Animated.timing(slideAnim, {
            toValue: MAX_SLIDE,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            triggerSOS();
          });
        } else {
          // Snap back
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressArea} onPress={handleClose} />

        <View style={styles.bottomSheet}>
          <View style={styles.dragIndicator} />

          <View style={styles.headerBox}>
            <Ionicons name="warning" size={32} color={colors.danger} />
            <Text style={styles.title}>Emergency SOS</Text>
          </View>

          <Text style={styles.description}>
            Sliding this will instantly open your {"phone's"} dialer to call National Emergency (112) and silently broadcast your location to nearby users.
          </Text>

          <View style={styles.sliderTrack}>
            <Text style={styles.sliderText}>SLIDE TO SOS</Text>
            
            <Animated.View
              style={[
                styles.sliderKnob,
                { transform: [{ translateX: slideAnim }] },
              ]}
              {...panResponder.panHandlers}
            >
              <Ionicons name="call" size={24} color={colors.danger} />
            </Animated.View>
          </View>

          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  backdropPressArea: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius["3xl"],
    borderTopRightRadius: radius["3xl"],
    padding: spacing["2xl"],
    alignItems: "center",
    ...shadow.floating,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.borderStrong,
    borderRadius: 2,
    marginBottom: spacing.xl,
  },
  headerBox: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  sliderTrack: {
    width: "100%",
    height: 64,
    backgroundColor: colors.dangerSoft,
    borderRadius: 32,
    justifyContent: "center",
    paddingHorizontal: 4,
    overflow: "hidden",
  },
  sliderText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: colors.dangerDark,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1,
    opacity: 0.7,
  },
  sliderKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: colors.textInverse,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.md,
    zIndex: 2,
  },
  cancelButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  cancelButtonPressed: {
    opacity: 0.5,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textSoft,
  },
});
