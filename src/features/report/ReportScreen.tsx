import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, StyleSheet, Text, View, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import AppButton from "../../components/ui/AppButton";
import AppScreen from "../../components/ui/AppScreen";
import AppCard from "../../components/ui/AppCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { useI18n } from "../../i18n";
import { colors } from "../../theme/colors";
import { shadow, spacing, radius } from "../../theme/layout";
import { typography } from "../../theme/typography";
import ImpactQuestionSelector from "./components/ImpactQuestionSelector";
import IncidentKindSelector from "./components/IncidentKindSelector";
import IncidentLocationPickerModal from "./components/IncidentLocationPickerModal";
import ReportDetailsFields from "./components/ReportDetailsFields";
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

  // Initialize form hook with a custom success callback
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
        Alert.alert("Lokasi Diperlukan", "Silakan tentukan lokasi kejadian terlebih dahulu.");
        return;
      }
      if (!form.kind) {
        Alert.alert("Jenis Kejadian Diperlukan", "Silakan pilih jenis kejadian terlebih dahulu.");
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

  return (
    <>
      <AppScreen keyboardAvoiding contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <StatusBadge
            label={t("report.header.badge")}
            variant="danger"
            size="sm"
          />
          <Text style={styles.title}>{t("report.header.title")}</Text>
          <Text style={styles.subtitle}>
            {step === 1 && "Tentukan lokasi kejadian dan pilih kategori insiden."}
            {step === 2 && "Berikan detail deskripsi serta laporkan dampak di sekitar lokasi."}
            {step === 3 && "Lampirkan bukti foto dan periksa kembali detail laporan Anda."}
          </Text>
        </View>

        {/* Stepper Progress Bar */}
        <View style={styles.stepperContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${((step - 1) / 2) * 100}%` }]} />
          </View>
          <View style={styles.stepNodesRow}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={styles.stepNodeContainer}>
                <View
                  style={[
                    styles.stepNode,
                    step === s
                      ? styles.stepNodeActive
                      : step > s
                      ? styles.stepNodeCompleted
                      : styles.stepNodeInactive,
                  ]}
                >
                  {step > s ? (
                    <Ionicons name="checkmark" size={16} color={colors.textInverse} />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        step === s ? styles.stepNumberActive : styles.stepNumberInactive,
                      ]}
                    >
                      {s}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepNodeLabel,
                    step === s ? styles.stepNodeLabelActive : styles.stepNodeLabelInactive,
                  ]}
                >
                  {s === 1 && "Lokasi & Jenis"}
                  {s === 2 && "Detail & Dampak"}
                  {s === 3 && "Bukti & Kirim"}
                </Text>
              </View>
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
              <View style={styles.divider} />
              <IncidentKindSelector
                selectedKind={form.kind}
                disabled={form.loading}
                onSelectKind={form.setKind}
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepWrapper}>
              <ReportDetailsFields
                description={form.description}
                disabled={form.loading}
                onChangeDescription={form.setDescription}
              />
              <View style={styles.divider} />
              <ImpactQuestionSelector
                answers={form.impactAnswers}
                disabled={form.loading}
                onToggleAnswer={form.toggleImpactAnswer}
              />
              
              {/* Real-time Urgency Preview */}
              {computedUrgency && (
                <View style={styles.urgencyPreviewCard}>
                  <View style={styles.urgencyHeaderRow}>
                    <Text style={styles.urgencyTitle}>Estimasi Tingkat Urgensi</Text>
                    <StatusBadge
                      label={
                        computedUrgency.level === "high"
                          ? "SIAGA TINGGI"
                          : computedUrgency.level === "medium"
                          ? "SIAGA SEDANG"
                          : "SIAGA RENDAH"
                      }
                      variant={
                        computedUrgency.level === "high"
                          ? "danger"
                          : computedUrgency.level === "medium"
                          ? "warning"
                          : "success"
                      }
                      size="sm"
                    />
                  </View>
                  <View style={styles.meterContainer}>
                    <View style={styles.meterTrack}>
                      <View
                        style={[
                          styles.meterFill,
                          {
                            width: `${computedUrgency.score}%`,
                            backgroundColor:
                              computedUrgency.level === "high"
                                ? colors.danger
                                : computedUrgency.level === "medium"
                                ? colors.warning
                                : colors.success,
                          },
                        ]}
                      />
                    </View>
                    {/* <Text style={styles.scoreText}>{computedUrgency.score}/100 Poin</Text> */}
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

              <View style={styles.divider} />

              {/* Summary Review Card to make the page feel packed and structured */}
              <Text style={styles.summarySectionHeader}>Ringkasan Laporan Anda</Text>
              <AppCard style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Kategori:</Text>
                  {selectedKindOpt && (
                    <View style={[styles.summaryCategoryBadge, { backgroundColor: selectedKindOpt.lightColor }]}>
                      <Ionicons name={selectedKindOpt.iconName} size={14} color={selectedKindOpt.color} />
                      <Text style={[styles.summaryCategoryText, { color: selectedKindOpt.color }]}>
                        {t(selectedKindOpt.labelKey)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Catatan Tambahan:</Text>
                  <Text style={styles.summaryValue}>{form.description || "Tidak ada catatan"}</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Lokasi:</Text>
                  <Text style={styles.summaryValue}>
                    {form.incidentLocation?.source === "manual_pin" ? "Pin Manual" : "Lokasi Perangkat"} 
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryVerticalGroup}>
                  <Text style={styles.summaryLabel}>Kondisi & Dampak:</Text>
                  <View style={styles.impactBadgeRow}>
                    {computedUrgency && Object.entries(form.impactAnswers).some(([_, val]) => val) ? (
                      IMPACT_QUESTION_OPTIONS.map((opt) => {
                        if (form.impactAnswers[opt.value]) {
                          return (
                            <View key={opt.value} style={styles.impactBadge}>
                              <Ionicons name={opt.iconName} size={12} color={colors.danger} />
                              <Text style={styles.impactBadgeText}>{t(opt.labelKey)}</Text>
                            </View>
                          );
                        }
                        return null;
                      })
                    ) : (
                      <Text style={styles.noImpactText}>Tidak ada dampak kritis terlaporkan</Text>
                    )}
                  </View>
                </View>
              </AppCard>
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
              title="Lanjutkan"
              variant="primary"
              size="lg"
              onPress={handleNextStep}
              style={styles.nextBtn}
              rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
            />
          ) : (
            <AppButton
              title={form.loading ? t("report.submit.loading") : t("report.submit.idle")}
              variant="danger"
              size="lg"
              loading={form.loading}
              disabled={!form.canSubmit}
              onPress={form.handleSubmit}
              style={styles.nextBtn}
              leftIcon={form.loading ? null : <Ionicons name="send" size={18} color={colors.textInverse} />}
            />
          )}
        </View>
      </AppScreen>

      {/* Custom Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Laporan Terkirim!</Text>
            <Text style={styles.modalMessage}>
              Terima kasih atas kontribusi Anda. Laporan Anda berhasil diunggah dan sekarang terlihat oleh warga lain serta tim evakuasi di peta.
            </Text>

            <View style={styles.modalActions}>
              <AppButton
                title="Lihat Peta Situasi"
                variant="primary"
                size="md"
                fullWidth
                onPress={() => {
                  form.resetForm();
                  setShowSuccess(false);
                  setStep(1);
                  router.push("/(tabs)/map");
                }}
                style={styles.modalButton}
              />
              <AppButton
                title="Buat Laporan Baru"
                variant="secondary"
                size="md"
                fullWidth
                onPress={() => {
                  form.resetForm();
                  setShowSuccess(false);
                  setStep(1);
                }}
                style={styles.modalButton}
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
  header: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  // Stepper styles
  stepperContainer: {
    position: "relative",
    height: 60,
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 2,
    position: "absolute",
    left: 40,
    right: 40,
    top: 22,
    zIndex: 1,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepNodesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  stepNodeContainer: {
    alignItems: "center",
    width: 90,
  },
  stepNode: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: colors.background,
  },
  stepNodeInactive: {
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  stepNodeActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  stepNodeCompleted: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "700",
  },
  stepNumberActive: {
    color: colors.textInverse,
  },
  stepNumberInactive: {
    color: colors.textSoft,
  },
  stepNodeLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },
  stepNodeLabelActive: {
    color: colors.primary,
  },
  stepNodeLabelInactive: {
    color: colors.textSoft,
  },
  stepContent: {
    flex: 1,
  },
  stepWrapper: {
    gap: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  navigationRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
  // Urgency Preview Card
  urgencyPreviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.card,
  },
  urgencyHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urgencyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  meterContainer: {
    gap: 6,
  },
  meterTrack: {
    height: 8,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 4,
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  // Summary Card Styles
  summarySectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: -4,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.card,
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
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    textAlign: "right",
    flex: 1,
    marginLeft: spacing.lg,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.surfaceContainer,
  },
  summaryCategoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  summaryCategoryText: {
    fontSize: 11,
    fontWeight: "700",
  },
  summaryVerticalGroup: {
    gap: 8,
  },
  impactBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  impactBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.md,
  },
  impactBadgeText: {
    fontSize: 11,
    color: colors.dangerDark,
    fontWeight: "700",
  },
  noImpactText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  // Custom Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalContent: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
    ...shadow.floating,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primarySoft,
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
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  modalActions: {
    width: "100%",
    gap: spacing.sm,
  },
  modalButton: {
    width: "100%",
  },
});
