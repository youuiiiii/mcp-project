import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, StyleSheet, Text, View, Modal, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import AppButton from "../../components/ui/AppButton";
import AppScreen from "../../components/ui/AppScreen";
import { useI18n } from "../../i18n";
import { colors } from "../../theme/colors";
import { shadow, spacing, radius } from "../../theme/layout";
import { typography } from "../../theme/typography";
import ImpactQuestionSelector from "./components/ImpactQuestionSelector";
import IncidentKindSelector from "./components/IncidentKindSelector";
import IncidentLocationPickerModal from "./components/IncidentLocationPickerModal";
import ReportEvidenceSection from "./components/ReportEvidenceSection";
import ReportLocationNotice from "./components/ReportLocationNotice";
import { useReportForm } from "./hooks/useReportForm";
import { getReportKindOption, calculateIncidentUrgency, IMPACT_QUESTION_OPTIONS } from "../../constants/reportTaxonomy";

export default function ReportScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);

  const { kind: initialKind } = useLocalSearchParams<{ kind?: string }>();

  const form = useReportForm({
    onSuccess: () => {
      setShowSuccess(true);
    },
    initialKind,
  });

  const handleOpenLocationPicker = async () => {
    const nextLocation =
      form.incidentLocation ?? (await form.useCurrentLocationForIncident());

    if (!nextLocation) {
      Alert.alert(
        t("report.validation.locationPermission.title"),
        t("report.validation.locationPermission.message")
      );
      return;
    }

    setLocationPickerVisible(true);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!form.incidentLocation) {
        Alert.alert("Location Required", "Please set the incident location first.");
        return;
      }
      if (!form.kind) {
        Alert.alert("Incident Type Required", "Please select the incident type first.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const selectedKindOpt = form.kind ? getReportKindOption(form.kind) : null;
  const computedUrgency = form.kind
    ? calculateIncidentUrgency({ kind: form.kind, impactAnswers: form.impactAnswers })
    : null;

  const isHighSeverity = computedUrgency?.level === "high";

  return (
    <>
      <AppScreen keyboardAvoiding contentContainerStyle={styles.content}>
        {/* DISPATCH INTAKE HEADER */}
        <View style={styles.dispatchHeader}>
          <View style={styles.dispatchTitleRow}>
            <Ionicons name="radio" size={24} color={colors.danger} />
            <Text style={styles.dispatchTitle}>INCIDENT DISPATCH</Text>
          </View>
          <Text style={styles.dispatchSubtitle}>Step {step} of 3</Text>
        </View>

        {/* Step Content */}
        <View style={styles.stepContent}>
          {step === 1 && (
            <View style={styles.stepWrapper}>
              <ReportLocationNotice
                incidentLocation={form.incidentLocation}
                disabled={form.loading}
                loadingLocation={form.loadingLocation}
                onUseCurrentLocation={form.useCurrentLocationForIncident}
                onAdjustPin={handleOpenLocationPicker}
              />
              <IncidentKindSelector
                selectedKind={form.kind}
                disabled={form.loading}
                onSelectKind={form.setKind}
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepWrapper}>
              <ImpactQuestionSelector
                answers={form.impactAnswers}
                disabled={form.loading}
                onToggleAnswer={form.toggleImpactAnswer}
              />
              
              {/* Real-time Urgency Preview */}
              {computedUrgency && (
                <View style={[styles.urgencyPreviewCard, isHighSeverity && { borderColor: colors.danger, backgroundColor: colors.dangerSoft }]}>
                  <View style={styles.urgencyHeaderRow}>
                    <Text style={[styles.urgencyTitle, isHighSeverity && { color: colors.dangerDark }]}>COMPUTED URGENCY</Text>
                    <View style={[styles.urgencyBadge, isHighSeverity ? { backgroundColor: colors.danger } : { backgroundColor: colors.warning }]}>
                       <Text style={styles.urgencyBadgeText}>
                          {isHighSeverity ? "HIGH" : computedUrgency.level === "medium" ? "MEDIUM" : "LOW"}
                       </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepWrapper}>
              <ReportEvidenceSection
                photoUris={form.photoUris}
                disabled={form.loading}
                onTakePhoto={form.takePhoto}
                onPickFromGallery={form.pickFromGallery}
                onRemovePhoto={form.removePhoto}
              />

              {/* Summary Review Card */}
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>DISPATCH SUMMARY</Text>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>TYPE:</Text>
                  <Text style={styles.summaryValue}>{selectedKindOpt ? t(selectedKindOpt.labelKey).toUpperCase() : ""}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>LOCATION:</Text>
                  <Text style={styles.summaryValue}>
                    {form.incidentLocation?.source === "manual_pin" ? "MANUAL PIN" : "GPS COORDINATE"} 
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>SEVERITY:</Text>
                  <Text style={[styles.summaryValue, isHighSeverity && { color: colors.danger }]}>
                    {isHighSeverity ? "HIGH" : "STANDARD"}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Navigation Action Buttons */}
        <View style={styles.navigationRow}>
          {step > 1 && (
            <AppButton
              title="Back"
              variant="secondary"
              size="lg"
              disabled={form.loading}
              onPress={handlePrevStep}
              style={styles.backBtn}
              leftIcon={<Ionicons name="arrow-back" size={18} color={colors.text} />}
            />
          )}

          {step < 3 ? (
            <AppButton
              title="Continue"
              variant="primary"
              size="lg"
              onPress={handleNextStep}
              style={styles.nextBtn}
              rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
            />
          ) : (
            <AppButton
              title={form.loading ? "TRANSMITTING..." : "SUBMIT REPORT"}
              variant={isHighSeverity ? "danger" : "primary"}
              size="lg"
              loading={form.loading}
              disabled={!form.canSubmit}
              onPress={form.handleSubmit}
              style={[styles.nextBtn, { height: 60 }]}
              leftIcon={form.loading ? null : <Ionicons name="warning" size={20} color={colors.textInverse} />}
            />
          )}
        </View>
      </AppScreen>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={48} color={colors.textInverse} />
            </View>
            <Text style={styles.modalTitle}>REPORT RECEIVED</Text>
            <Text style={styles.modalMessage}>
              Incident successfully dispatched to the situation map.
            </Text>

            <View style={styles.modalActions}>
              <AppButton
                title="RETURN TO MAP"
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => {
                  form.resetForm();
                  setShowSuccess(false);
                  setStep(1);
                  router.push("/(tabs)" as any);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <IncidentLocationPickerModal
        visible={locationPickerVisible}
        incidentLocation={form.incidentLocation}
        onClose={() => setLocationPickerVisible(false)}
        onConfirm={form.updateManualIncidentLocation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing["3xl"],
  },
  dispatchHeader: {
    backgroundColor: colors.surfaceContainer,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dispatchTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dispatchTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 1,
  },
  dispatchSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  stepContent: {
    flex: 1,
  },
  stepWrapper: {
    gap: spacing.xl,
  },
  navigationRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  backBtn: {
    flex: 1,
    height: 56,
  },
  nextBtn: {
    flex: 2,
    height: 56,
  },
  urgencyPreviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.card,
  },
  urgencyHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urgencyTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  urgencyBadgeText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: "900",
  },
  summaryBox: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textSoft,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)", // darker for operational feel
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalContent: {
    width: "100%",
    backgroundColor: colors.surface,
    borderTopWidth: 4,
    borderTopColor: colors.success,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
    letterSpacing: 1,
  },
  modalMessage: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  modalActions: {
    width: "100%",
  },
});
