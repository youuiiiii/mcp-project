import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { BmkgEarthquake } from "../services/bmkgService";

type EarthquakeAlertModalProps = {
  visible: boolean;
  earthquake: BmkgEarthquake | null;
  onClose: () => void;
};

export default function EarthquakeAlertModal({
  visible,
  earthquake,
  onClose,
}: EarthquakeAlertModalProps) {
  if (!earthquake) return null;

  const magnitude = parseFloat(earthquake.Magnitude ?? "0");
  const isHighMagnitude = magnitude >= 6;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={[styles.header, isHighMagnitude ? styles.headerDanger : styles.headerWarning]}>
            <View style={styles.iconCircle}>
              <Ionicons name="warning" size={36} color={isHighMagnitude ? "#DC2626" : "#F59E0B"} />
            </View>
            <Text style={styles.headerTitle}>
              {isHighMagnitude ? "STRONG EARTHQUAKE" : "EARTHQUAKE ALERT"}
            </Text>
            <Text style={styles.headerSub}>
              Real-time data from BMKG
            </Text>
          </View>

          <View style={styles.body}>
            <View style={styles.magnitudeRow}>
              <Text style={styles.magnitudeLabel}>Magnitude</Text>
              <Text style={[
                styles.magnitudeValue,
                isHighMagnitude ? styles.magnitudeDanger : styles.magnitudeWarning
              ]}>
                M{earthquake.Magnitude}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#64748B" />
              <Text style={styles.infoText}>{earthquake.Wilayah}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#64748B" />
              <Text style={styles.infoText}>{earthquake.Jam} WIB · {earthquake.Tanggal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="analytics-outline" size={16} color="#64748B" />
              <Text style={styles.infoText}>Depth: {earthquake.Kedalaman}</Text>
            </View>

            {earthquake.Potensi ? (
              <View style={[styles.potensiBox, isHighMagnitude ? styles.potensiDanger : styles.potensiWarning]}>
                <Ionicons name="alert-circle" size={14} color={isHighMagnitude ? "#DC2626" : "#F59E0B"} />
                <Text style={[styles.potensiText, isHighMagnitude ? styles.potensiTextDanger : styles.potensiTextWarning]}>
                  {earthquake.Potensi}
                </Text>
              </View>
            ) : null}
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.closeBtnText}>I Understand</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  headerDanger: {
    backgroundColor: "#DC2626",
  },
  headerWarning: {
    backgroundColor: "#F59E0B",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.85,
  },
  body: {
    padding: 20,
    gap: 12,
  },
  magnitudeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 4,
  },
  magnitudeLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  magnitudeValue: {
    fontSize: 36,
    fontWeight: "900",
  },
  magnitudeDanger: {
    color: "#DC2626",
  },
  magnitudeWarning: {
    color: "#F59E0B",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  potensiBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  potensiDanger: {
    backgroundColor: "#FEF2F2",
  },
  potensiWarning: {
    backgroundColor: "#FFFBEB",
  },
  potensiText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  potensiTextDanger: {
    color: "#DC2626",
  },
  potensiTextWarning: {
    color: "#D97706",
  },
  closeBtn: {
    margin: 16,
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});