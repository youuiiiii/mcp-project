import { StyleSheet } from "react-native";

import AppScreen from "../../components/ui/AppScreen";
import { spacing } from "../../theme/layout";
import HomeEarthquakeSection from "./components/HomeEarthquakeSection";
import HomeHero from "./components/HomeHero";
import HomeLatestReportsSection from "./components/HomeLatestReportsSection";
import { useHomeScreen } from "./hooks/useHomeScreen";

export default function HomeScreen() {
  const {
    displayName,
    initials,
    routes,
    navigateTo,

    activeReports,
    highSeverityReports,
    latestReports,
    loadingReports,
    reportsErrorMessage,

    mainEarthquake,
    latestEarthquakes,
    loadingEarthquakes,
    earthquakeErrorMessage,
    refreshEarthquakes,
  } = useHomeScreen();

  return (
    <AppScreen contentContainerStyle={styles.screenContent}>
      <HomeHero
        displayName={displayName}
        initials={initials}
        activeCount={activeReports.length}
        highSeverityCount={highSeverityReports.length}
        onOpenProfile={() => navigateTo(routes.profile)}
        onOpenMap={() => navigateTo(routes.map)}
        onOpenReport={() => navigateTo(routes.report)}
      />

      <HomeLatestReportsSection
        reports={latestReports}
        loading={loadingReports}
        errorMessage={reportsErrorMessage}
        onOpenMap={() => navigateTo(routes.map)}
      />

      <HomeEarthquakeSection
            mainEarthquake={mainEarthquake}
            latestEarthquakes={latestEarthquakes}
            loading={loadingEarthquakes}
            errorMessage={earthquakeErrorMessage}
            onRefresh={refreshEarthquakes}
            onOpenEarthquake={(item) => {
                navigateTo({
                pathname: routes.earthquakeDetail,
                params: {
                    magnitude: item.Magnitude ?? "-",
                    wilayah: item.Wilayah ?? "-",
                    jam: item.Jam ?? "-",
                    tanggal: item.Tanggal ?? "-",
                    kedalaman: item.Kedalaman ?? "-",
                    lintang: item.Lintang ?? "-",
                    bujur: item.Bujur ?? "-",
                    potensi: item.Potensi ?? "-",
                },
                });
            }}
        />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: spacing["2xl"],
  },
});