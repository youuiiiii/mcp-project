import { Ionicons } from "@expo/vector-icons";
import { Text, View , StyleSheet , TextInput } from "react-native";

import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentCard from "./IncidentCard";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { useResolveIncidentModal } from "./resolveIncident/useResolveIncidentModal";
import { resolveIncidentModalStyles as styles } from "./resolveIncident/resolveIncidentModalStyles";
import type { ResolveIncidentModalProps } from "./resolveIncident/types";
import AppButton from "./ui/AppButton";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";

export default function ResolveIncidentModal(props: ResolveIncidentModalProps) {
  const { visible, incident } = props;
  const {
    resolutionNote,
    setResolutionNote,
    imageUri,
    setImageUri,
    submitting,
    canSubmit,
    handleClose,
    handleTakePhoto,
    handlePickFromGallery,
    handleSubmit,
  } = useResolveIncidentModal(props);

  return (
    <IncidentModalShell
      visible={visible}
      title="Tandai Selesai"
      subtitle="Unggah bukti dan catatan sebelum menutup laporan ini."
      submitting={submitting}
      onClose={handleClose}
      footer={
        <>
          <AppButton
            title="Batal"
            variant="secondary"
            size="lg"
            disabled={submitting}
            onPress={handleClose}
            style={styles.footerCancelButton}
          />

          <AppButton
            title="Tandai Selesai"
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            leftIcon={
              <Ionicons
                name="checkmark-done"
                size={18}
                color={colors.textInverse}
              />
            }
            style={styles.footerSubmitButton}
          />
        </>
      }
    >
      {incident ? <IncidentCard incident={incident} compact /> : null}

      {/* Notice / validation warning */}
      <View style={localStyles.noticeCard}>
        <Ionicons name="information-circle" size={18} color={colors.warningDark} />
        <Text style={localStyles.noticeText}>
          Foto harus menunjukkan bahwa lokasi sudah aman, bersih, atau tidak lagi mengganggu aktivitas sekitar.
        </Text>
      </View>

      <EvidencePicker
        title="Foto Bukti Penyelesaian"
        subtitle="Unggah foto terbaru sebagai bukti bahwa insiden sudah selesai."
        emptyTitle="Belum ada foto"
        emptyMessage="Tambahkan foto sebagai bukti kondisi terkini di lokasi."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title="Catatan Penyelesaian"
          subtitle="Jelaskan mengapa laporan ini bisa ditandai selesai."
        />

        <TextInput
          value={resolutionNote}
          onChangeText={setResolutionNote}
          placeholder="Contoh: Jalan sudah dibersihkan dan kendaraan bisa melintas."
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={resolutionNote.trim().length >= 10 ? "Catatan sudah cukup" : "Minimal 10 karakter"}
          variant={resolutionNote.trim().length >= 10 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}

const localStyles = StyleSheet.create({
  noticeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: colors.warningDark,
  },
});
