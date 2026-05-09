import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  emptyContent: {
    flexGrow: 1,
  },

  header: {
    marginBottom: 20,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#CCFBF1",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 12,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F766E",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.8,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    lineHeight: 22,
  },

  section: {
    marginTop: 24,
  },

  sectionHeader: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
  },

  latestList: {
    gap: 12,
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#991B1B",
  },

  errorMessage: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#B91C1C",
    lineHeight: 18,
  },

  liveCard: {
    marginTop: 18,
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

  liveHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  liveTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },

  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16A34A",
  },

  liveText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#16A34A",
  },

  liveDescription: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    lineHeight: 20,
  },
});