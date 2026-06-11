import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, StyleSheet, Text, View, Modal, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import AppButton from "../../components/ui/AppButton";
import AppScreen from "../../components/ui/AppScreen";
import { useI18n } from "../../i18n";
import { colors } from "../../theme/colors";
import { shadow, spacing, radius } from "../../theme/layout";
import ImpactQuestionSelector from "./components/ImpactQuestionSelector";
import IncidentKindSelector from "./components/IncidentKindSelector";
import IncidentLocationPickerModal from "./components/IncidentLocationPickerModal";
import ReportEvidenceSection from "./components/ReportEvidenceSection";
import ReportLocationNotice from "./components/ReportLocationNotice";
import { useReportForm } from "./hooks/useReportForm";
import { getReportKindOption, calculateIncidentUrgency } from "../../constants/reportTaxonomy";

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
        Alert.alert("Lokasi Diperlukan", "Tolong tentukan lokasi kejadian terlebih dahulu.");
        return;
      }
      if (!form.kind) {
        Alert.alert("Tipe Bencana Diperlukan", "Tolong pilih kategori bencana.");
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
        {/* SIGAP HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lapor Kejadian</Text>
          <View style={styles.stepIndicatorRow}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.stepDot,
                  step === s && styles.stepDotActive,
                  step > s && styles.stepDotCompleted,
                ]}
              />
            ))}
          </View>
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
                    <Text style={[styles.urgencyTitle, isHighSeverity && { color: colors.dangerDark }]}>Estimasi Tingkat Bahaya</Text>
                    <View style={[styles.urgencyBadge, isHighSeverity ? { backgroundColor: colors.danger } : { backgroundColor: colors.warning }]}>
                       <Text style={styles.urgencyBadgeText}>
                          {isHighSeverity ? "TINGGI" : computedUrgency.level === "medium" ? "SEDANG" : "RENDAH"}
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
                <Text style={styles.summaryTitle}>Ringkasan Laporan</Text>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Kategori:</Text>
                  <Text style={styles.summaryValue}>{selectedKindOpt ? t(selectedKindOpt.labelKey).toUpperCase() : ""}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Lokasi:</Text>
                  <Text style={styles.summaryValue}>
                    {form.incidentLocation?.source === "manual_pin" ? "Titik Manual" : "GPS"} 
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tingkat Keparahan:</Text>
                  <Text style={[styles.summaryValue, isHighSeverity && { color: colors.danger }]}>
                    {isHighSeverity ? "TINGGI" : "STANDAR"}
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
              title="Kembali"
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
              title="Lanjut"
              variant="primary"
              size="lg"
              onPress={handleNextStep}
              style={styles.nextBtn}
              rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
            />
          ) : (
            <AppButton
              title={form.loading ? "MENGIRIM..." : "KIRIM LAPORAN"}
              variant={isHighSeverity ? "danger" : "primary"}
              size="lg"
              loading={form.loading}
              disabled={!form.canSubmit}
              onPress={form.handleSubmit}
              style={[styles.nextBtn, { height: 56 }]}
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
            <Text style={styles.modalTitle}>Laporan Diterima</Text>
            <Text style={styles.modalMessage}>
              Terima kasih, laporan Anda telah masuk ke sistem kami dan akan segera ditinjau.
            </Text>

            <View style={styles.modalActions}>
              <AppButton
                title="KEMBALI KE BERANDA"
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
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing["3xl"],
  },
  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  stepIndicatorRow: {
    flexDirection: "row",
    gap: 8,
  },
  stepDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceContainer,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    width: 32,
  },
  stepDotCompleted: {
    backgroundColor: colors.primarySoft,
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
    ...shadow.sm,
  },
  urgencyHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urgencyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  urgencyBadgeText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: "800",
  },
  summaryBox: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderStrong,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSoft,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)", 
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalContent: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
    ...shadow.md,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.successSoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  modalActions: {
    width: "100%",
  },
});
