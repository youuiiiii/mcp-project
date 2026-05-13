import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../src/components/ui/AppButton";
import AppCard from "../../src/components/ui/AppCard";
import AppScreen from "../../src/components/ui/AppScreen";
import IconBadge from "../../src/components/ui/IconBadge";
import LoadingState from "../../src/components/ui/LoadingState";
import SectionHeader from "../../src/components/ui/SectionHeader";
import StatusBadge from "../../src/components/ui/StatusBadge";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  subscribeToIncidents,
  subscribeToSOSLogs,
} from "../../src/services/incidentService";
import { colors } from "../../src/theme/colors";
import { radius, shadow, spacing } from "../../src/theme/layout";
import { typography } from "../../src/theme/typography";
import { IncidentReport, SOSLog } from "../../src/types/incident";

const LOGIN_ROUTE = "/login" as Href;

type AppIconName = keyof typeof Ionicons.glyphMap;

type StatItem = {
  label: string;
  value: number;
  icon: AppIconName;
  color: string;
  variant: "danger" | "success" | "warning" | "info";
};

type InfoItem = {
  icon: AppIconName;
  label: string;
  value: string;
};

const APP_INFO: InfoItem[] = [
  {
    icon: "phone-portrait",
    label: "Application",
    value: "Community Safety Monitoring",
  },
  {
    icon: "flash",
    label: "Realtime Database",
    value: "Firebase Firestore",
  },
  {
    icon: "map",
    label: "Core Feature",
    value: "Map-based Incident Reporting",
  },
  {
    icon: "pricetag",
    label: "Version",
    value: "1.0.0 Development",
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [sosLogs, setSosLogs] = useState<SOSLog[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingSOS, setLoadingSOS] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeReports = subscribeToIncidents(
      (items) => {
        setReports(items);
        setLoadingReports(false);
      },
      (error) => {
        console.error("Profile reports error:", error);
        setErrorMessage(error.message || "Gagal memuat data laporan.");
        setLoadingReports(false);
      }
    );

    const unsubscribeSOS = subscribeToSOSLogs(
      (items) => {
        setSosLogs(items);
        setLoadingSOS(false);
      },
      (error) => {
        console.error("Profile SOS error:", error);
        setErrorMessage(error.message || "Gagal memuat data SOS.");
        setLoadingSOS(false);
      }
    );

    return () => {
      unsubscribeReports();
      unsubscribeSOS();
    };
  }, []);

  const loading = loadingReports || loadingSOS;

  const displayName = useMemo(() => {
    return (
      user?.displayName || user?.email?.split("@")[0] || "Community Reporter"
    );
  }, [user]);

  const userEmail = user?.email || "-";

  const userInitial = useMemo(() => {
    return displayName
      .split(" ")
      .map((item) => item.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const resolvedReports = useMemo(() => {
    return reports.filter((report) => report.status === "resolved");
  }, [reports]);

  const highReports = useMemo(() => {
    return reports.filter((report) => report.severity === "high");
  }, [reports]);

  const stats = useMemo<StatItem[]>(() => {
    return [
      {
        label: "Total Reports",
        value: reports.length,
        icon: "location",
        color: colors.info,
        variant: "info",
      },
      {
        label: "Active",
        value: activeReports.length,
        icon: "radio",
        color: colors.danger,
        variant: "danger",
      },
      {
        label: "Resolved",
        value: resolvedReports.length,
        icon: "checkmark-circle",
        color: colors.success,
        variant: "success",
      },
      {
        label: "SOS Logs",
        value: sosLogs.length,
        icon: "alert-circle",
        color: colors.warningDark,
        variant: "warning",
      },
    ];
  }, [reports.length, activeReports.length, resolvedReports.length, sosLogs.length]);

  const handleLogout = () => {
    Alert.alert("Logout", "Keluar dari akun ini?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace(LOGIN_ROUTE);
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Logout Gagal", "Terjadi kesalahan saat logout.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Memuat profile..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen contentContainerStyle={styles.screenContent}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>

        <Text style={styles.email} numberOfLines={1}>
          {userEmail}
        </Text>

        <StatusBadge
          label="Community Reporter"
          variant="info"
          size="sm"
          style={styles.roleBadge}
          textStyle={styles.roleBadgeText}
        />
      </View>

      {errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Sebagian data gagal dimuat</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        </AppCard>
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          title="Contribution Summary"
          subtitle="Aktivitas komunitas realtime"
          style={styles.sectionHeader}
        />

        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <AppCard key={item.label} style={styles.statCard}>
              <IconBadge variant={item.variant} size="md" rounded={false}>
                <Ionicons name={item.icon} size={23} color={item.color} />
              </IconBadge>

              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </AppCard>
          ))}
        </View>
      </View>

      <AppCard variant="muted" style={styles.highSeverityCard}>
        <IconBadge variant="danger" size="md" rounded={false}>
          <Ionicons name="warning" size={22} color={colors.danger} />
        </IconBadge>

        <View style={styles.highSeverityContent}>
          <Text style={styles.highSeverityTitle}>High Severity Reports</Text>
          <Text style={styles.highSeverityText}>
            Ada {highReports.length} laporan high severity yang tercatat di
            sistem.
          </Text>
        </View>
      </AppCard>

      <View style={styles.section}>
        <SectionHeader
          title="App Information"
          subtitle="Status aplikasi dan data"
          style={styles.sectionHeader}
        />

        <AppCard style={styles.infoCard}>
          {APP_INFO.map((item, index) => (
            <View key={item.label}>
              <InfoRow item={item} />

              {index < APP_INFO.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </AppCard>
      </View>

      <AppCard variant="muted" style={styles.reminderCard}>
        <View style={styles.reminderHeader}>
          <IconBadge variant="info" size="sm">
            <Ionicons
              name="information-circle"
              size={18}
              color={colors.info}
            />
          </IconBadge>

          <Text style={styles.reminderTitle}>Emergency Reminder</Text>
        </View>

        <Text style={styles.reminderText}>
          Aplikasi ini membantu pelaporan dan pemantauan kejadian sekitar, tetapi
          tidak menggantikan layanan darurat resmi. Jika kondisi berbahaya,
          segera hubungi pihak berwenang.
        </Text>
      </AppCard>

      <AppButton
        title="Logout"
        variant="danger"
        size="lg"
        fullWidth
        onPress={handleLogout}
        leftIcon={
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.textInverse}
          />
        }
        style={styles.logoutButton}
      />
    </AppScreen>
  );
}

function InfoRow({ item }: { item: InfoItem }) {
  return (
    <View style={styles.infoRow}>
      <IconBadge variant="neutral" size="md" rounded={false}>
        <Ionicons name={item.icon} size={22} color={colors.text} />
      </IconBadge>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{item.label}</Text>
        <Text style={styles.infoValue}>{item.value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
  },
  screenContent: {
    gap: spacing["2xl"],
  },
  hero: {
    backgroundColor: colors.dark,
    borderRadius: radius["3xl"],
    padding: spacing["2xl"],
    alignItems: "center",
    ...shadow.floating,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },
  name: {
    maxWidth: "100%",
    fontSize: 24,
    fontWeight: "900",
    color: colors.textInverse,
    textAlign: "center",
  },
  email: {
    maxWidth: "100%",
    marginTop: 5,
    ...typography.caption,
    color: "#CBD5E1",
    textAlign: "center",
  },
  roleBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.darkSoft,
  },
  roleBadgeText: {
    color: colors.textInverse,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#991B1B",
    marginBottom: 4,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statCard: {
    width: "48%",
    minHeight: 132,
  },
  statValue: {
    marginTop: spacing.md,
    fontSize: 27,
    fontWeight: "900",
    color: colors.text,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  highSeverityCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  highSeverityContent: {
    flex: 1,
  },
  highSeverityTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#991B1B",
    marginBottom: 4,
  },
  highSeverityText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  infoCard: {
    paddingVertical: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  reminderCard: {
    backgroundColor: colors.infoSoft,
    borderColor: "#BFDBFE",
  },
  reminderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1E3A8A",
  },
  reminderText: {
    ...typography.caption,
    color: colors.info,
  },
  logoutButton: {
    ...shadow.floating,
    shadowColor: colors.primaryDark,
  },
});