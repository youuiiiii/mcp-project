import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 22,
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

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
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

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#0F766E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  userName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },

  userEmail: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  userRole: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  userRoleText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#047857",
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statIcon: {
    fontSize: 26,
    marginBottom: 10,
  },

  statValue: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    lineHeight: 17,
  },

  appCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  appRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  appRowLast: {
    borderBottomWidth: 0,
  },

  appIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  appIconText: {
    fontSize: 22,
  },

  appInfo: {
    flex: 1,
  },

  appLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748B",
  },

  appValue: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },

  warningCard: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 24,
    padding: 16,
  },

  warningTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#92400E",
  },

  warningText: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: "600",
    color: "#B45309",
    lineHeight: 20,
  },

  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  logoutButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },

  logoutButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#B91C1C",
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
});