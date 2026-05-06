import { StyleSheet, Text, View } from "react-native";

type EmptyStateProps = {
  icon?: string;
  title: string;
  message?: string;
};

export default function EmptyState({
  icon = "📍",
  title,
  message,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  icon: {
    fontSize: 36,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  message: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    lineHeight: 20,
    textAlign: "center",
  },
});