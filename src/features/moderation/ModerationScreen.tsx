import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { Text, View } from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { colors } from "../../theme/colors";
import { ModerationTicketCard } from "./components/ModerationTicketCard";
import { useModerationScreen } from "./hooks/useModerationScreen";
import { moderationStyles as styles } from "./moderationStyles";

const HOME_ROUTE = "/(tabs)" as Href;

export default function ModerationScreen() {
  const router = useRouter();
  const {
    user,
    isModerator,
    checkingAccess,
    loading,
    errorMessage,
    contentReports,
    incidentById,
    selectedTicketId,
    moderationReason,
    setModerationReason,
    handleDismiss,
    handleHide,
  } = useModerationScreen();

  if (checkingAccess) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.centerContent}>
        <LoadingState message="Checking moderator access..." />
      </AppScreen>
    );
  }

  if (!user || !isModerator) {
    return (
      <AppScreen contentContainerStyle={styles.content}>
        <AppCard style={styles.accessCard}>
          <Ionicons name="lock-closed" size={32} color={colors.danger} />

          <Text style={styles.accessTitle}>Moderator Access Required</Text>

          <Text style={styles.accessDescription}>
            This page is only for moderators who review community content.
          </Text>

          <AppButton
            title="Back to Home"
            variant="secondary"
            size="md"
            onPress={() => router.replace(HOME_ROUTE)}
          />
        </AppCard>
      </AppScreen>
    );
  }

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <StatusBadge label="Moderator" variant="info" size="sm" />

        <Text style={styles.title}>Moderation Queue</Text>

        <Text style={styles.subtitle}>
          Review community content reports. Hide only content that is clearly
          problematic.
        </Text>
      </View>

      {errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <Ionicons name="warning" size={18} color={colors.danger} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </AppCard>
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          title="Open Tickets"
          subtitle={`${contentReports.length} content reports need review.`}
        />

        {loading ? (
          <AppCard style={styles.loadingCard}>
            <LoadingState message="Loading moderation queue..." />
          </AppCard>
        ) : null}

        {!loading && contentReports.length === 0 ? (
          <EmptyState
            iconName="shield-checkmark-outline"
            title="Queue empty"
            message="No content reports need review right now."
          />
        ) : null}

        {!loading && contentReports.length > 0 ? (
          <View style={styles.ticketList}>
            {contentReports.map((ticket) => {
              const incident = incidentById[ticket.reportId];

              return (
                <ModerationTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  incident={incident}
                  busy={selectedTicketId === ticket.id}
                  reasonValue={moderationReason}
                  onChangeReason={setModerationReason}
                  onDismiss={() => handleDismiss(ticket)}
                  onHide={() => handleHide(ticket)}
                />
              );
            })}
          </View>
        ) : null}
      </View>
    </AppScreen>
  );
}
