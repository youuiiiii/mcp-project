import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getIncidentMeta } from "../constants/incident";
import { IncidentReport } from "../types/incident";

type IncidentCardProps = {
  incident: IncidentReport;
  onPress?: (incident: IncidentReport) => void;
  showImage?: boolean;
};

const formatDate = (date?: Date) => {
  if (!date) {
    return "Waktu tidak tersedia";
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSeverityLabel = (severity: IncidentReport["severity"]) => {
  if (severity === "high") {
    return "High";
  }

  if (severity === "medium") {
    return "Medium";
  }

  return "Low";
};

const getSeverityColor = (severity: IncidentReport["severity"]) => {
  if (severity === "high") {
    return "#DC2626";
  }

  if (severity === "medium") {
    return "#F59E0B";
  }

  return "#16A34A";
};

export default function IncidentCard({
  incident,
  onPress,
  showImage = true,
}: IncidentCardProps) {
  const meta = getIncidentMeta(incident.type);
  const severityColor = getSeverityColor(incident.severity);

  return (
    <Pressable
      onPress={() => onPress?.(incident)}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: meta.lightColor }]}>
          <Text style={styles.icon}>{meta.icon}</Text>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {incident.title}
          </Text>

          <Text style={styles.category} numberOfLines={1}>
            {meta.label}
          </Text>
        </View>

        <View
          style={[
            styles.statusPill,
            incident.status === "active"
              ? styles.activePill
              : styles.resolvedPill,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              incident.status === "active"
                ? styles.activeText
                : styles.resolvedText,
            ]}
          >
            {incident.status === "active" ? "Active" : "Resolved"}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {incident.description || "Tidak ada deskripsi."}
      </Text>

      {showImage && incident.imageUri ? (
        <Image source={{ uri: incident.imageUri }} style={styles.image} />
      ) : null}

      <View style={styles.footer}>
        <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
          <Text style={styles.severityText}>
            {getSeverityLabel(incident.severity)}
          </Text>
        </View>

        <Text style={styles.date}>{formatDate(incident.createdAt)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },
  category: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  activePill: {
    backgroundColor: "#FEE2E2",
  },
  resolvedPill: {
    backgroundColor: "#DCFCE7",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "900",
  },
  activeText: {
    color: "#DC2626",
  },
  resolvedText: {
    color: "#16A34A",
  },
  description: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "500",
    color: "#475569",
    lineHeight: 20,
  },
  image: {
    marginTop: 12,
    width: "100%",
    height: 150,
    borderRadius: 18,
    backgroundColor: "#E2E8F0",
  },
  footer: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  severityText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  date: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
  },
});