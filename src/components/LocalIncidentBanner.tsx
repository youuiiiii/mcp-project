import { Pressable, StyleSheet, Text, View } from "react-native";
import { getIncidentDisplayMeta, getIncidentMeta } from "../constants/incident";
import { IncidentReport } from "../types/incident";
import { formatDistance } from "../utils/geo";
import { getIncidentTrustMeta } from "../utils/incidentTrust";
import { getIncidentUrgencyMeta } from "../utils/incidentUrgency";

type LocalIncidentBannerProps = {
  incident: IncidentReport | null;
  distance: number | null;
  visible: boolean;
  onOpen: (incident: IncidentReport) => void;
  onClose: () => void;
};

export default function LocalIncidentBanner({
  incident,
  distance,
  visible,
  onOpen,
  onClose,
}: LocalIncidentBannerProps) {
  if (!visible || !incident) {
    return null;
  }

  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });
  const trust = getIncidentTrustMeta(incident);
  const urgency = getIncidentUrgencyMeta(incident);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.card,
          {
            borderColor: urgency.color,
            backgroundColor: urgency.lightColor,
          },
        ]}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: meta.color,
              },
            ]}
          >
            <Text style={styles.icon}>{meta.icon}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Incident baru di sekitar Anda</Text>

            <Text style={styles.incidentTitle} numberOfLines={1}>
              {incident.title}
            </Text>

            <Text style={styles.description} numberOfLines={2}>
              {meta.label}
              {distance !== null ? ` • ${formatDistance(distance)} dari Anda` : ""}
            </Text>

            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: trust.color,
                  },
                ]}
              >
                <Text style={styles.badgeText}>{trust.shortLabel}</Text>
              </View>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: urgency.color,
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {urgency.shortLabel} {urgency.score}
                </Text>
              </View>
            </View>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={() => onOpen(incident)}
            style={({ pressed }) => [
              styles.openButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.openButtonText}>Buka Thread</Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.dismissButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.dismissButtonText}>Nanti</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 14,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F172A",
  },
  incidentTitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    lineHeight: 17,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
    flexWrap: "wrap",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(15, 23, 42, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  openButton: {
    flex: 1.4,
    backgroundColor: "#0F766E",
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: "center",
  },
  openButtonText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  dismissButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  dismissButtonText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#334155",
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});