import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import LoadingState from "../../../components/ui/LoadingState";
import SectionHeader from "../../../components/ui/SectionHeader";
import type { BmkgEarthquake } from "../../../services/bmkgService";
import { colors } from "../../../theme/colors";
import {
  FeaturedEarthquakeCard,
  MiniEarthquakeCard,
} from "./HomeEarthquakeCards";
import { homeEarthquakeStyles as styles } from "./homeEarthquakeStyles";

type HomeEarthquakeSectionProps = {
  mainEarthquake: BmkgEarthquake | null;
  latestEarthquakes: BmkgEarthquake[];
  loading: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  onOpenEarthquake: (item: BmkgEarthquake) => void;
};

export default function HomeEarthquakeSection({
  mainEarthquake,
  latestEarthquakes,
  loading,
  errorMessage,
  onRefresh,
  onOpenEarthquake,
}: HomeEarthquakeSectionProps) {
  return (
    <View style={styles.wrapper}>
      <SectionHeader
        title="BMKG Earthquake Updates"
        subtitle="Latest official earthquake data"
        style={styles.sectionHeader}
        right={
          <AppButton
            title="Refresh"
            variant="secondary"
            size="sm"
            loading={loading}
            disabled={loading}
            onPress={onRefresh}
            leftIcon={
              <Ionicons name="refresh" size={15} color={colors.text} />
            }
          />
        }
      />

      {loading ? (
        <AppCard style={styles.loadingCard}>
          <LoadingState message="Loading official BMKG data..." />
        </AppCard>
      ) : errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>BMKG unavailable</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        </AppCard>
      ) : !mainEarthquake ? (
        <AppCard style={styles.emptyCard}>
          <IconBadge variant="info" size="lg" rounded={false}>
            <Ionicons name="earth" size={30} color={colors.info} />
          </IconBadge>

          <Text style={styles.emptyTitle}>No earthquake updates yet</Text>
          <Text style={styles.emptyText}>
            Official earthquake updates will appear here when available.
          </Text>
        </AppCard>
      ) : (
        <>
          <FeaturedEarthquakeCard
            earthquake={mainEarthquake}
            onPress={() => onOpenEarthquake(mainEarthquake)}
          />

          {latestEarthquakes.length > 1 ? (
            <View style={styles.miniList}>
              {latestEarthquakes.slice(1).map((item, index) => (
                <MiniEarthquakeCard
                  key={`${item.DateTime ?? index}-${item.Magnitude ?? ""}`}
                  earthquake={item}
                  onPress={() => onOpenEarthquake(item)}
                />
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}
