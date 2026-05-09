import { StyleSheet } from "react-native";

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  map: {
    flex: 1,
  },

  topOverlay: {
    position: "absolute",
    top: 52,
    left: 16,
    right: 16,
    gap: 10,
  },

  headerCard: {
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
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 18,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },

  liveText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#16A34A",
  },

  filterWrapper: {
    marginHorizontal: -16,
  },

  bottomOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 28,
  },

  infoCard: {
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
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },

  infoDescription: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 18,
  },

  warningCard: {
    marginTop: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  warningTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#991B1B",
  },

  warningText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#B91C1C",
    lineHeight: 18,
  },

  errorBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  errorText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B91C1C",
    lineHeight: 18,
  },

  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  markerBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },

  markerIcon: {
    fontSize: 21,
  },

  markerPointer: {
    width: 10,
    height: 10,
    marginTop: -4,
    transform: [{ rotate: "45deg" }],
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#FFFFFF",
  },

  clusterMarker: {
    minWidth: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0F766E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    paddingHorizontal: 8,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },

  clusterText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  userMarker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#2563EB",
    borderWidth: 4,
    borderColor: "#DBEAFE",
  },

  draftMarker: {
    alignItems: "center",
    justifyContent: "center",
  },

  draftBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  draftIcon: {
    fontSize: 22,
  },

  sosWrapper: {
    position: "absolute",
    right: 18,
    bottom: 210,
    zIndex: 20,
  },
});