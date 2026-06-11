import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentCard from "./IncidentCard";
import { colors } from "../theme/colors";
import AppButton from "./ui/AppButton";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";
import { SelectableOptionCard } from "./verifyIncident/SelectableOptionCard";
import type { VerifyIncidentModalProps } from "./verifyIncident/types";
import { useVerifyIncidentModal } from "./verifyIncident/useVerifyIncidentModal";
import { verifyIncidentModalStyles as styles } from "./verifyIncident/verifyIncidentModalStyles";
import { VERIFICATION_OPTIONS } from "./verifyIncident/verificationOptions";

export default function VerifyIncidentModal(props: VerifyIncidentModalProps) {
  const { visible, incident } = props;
  const {
    verificationType,
    setVerificationType,
    conditionStatus,
    setConditionStatus,
    conditionOptions,
    note,
    setNote,
    imageUri,
    setImageUri,
    submitting,
    canSubmit,
    handleClose,
    handleTakePhoto,
    handlePickFromGallery,
    handleSubmit,
  } = useVerifyIncidentModal(props);

  return (
    <IncidentModalShell
      visible={visible}
      title="Konfirmasi Laporan"
      subtitle="Bantu komunitas dengan mengonfirmasi atau memperbarui kondisi laporan ini."
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
            title="Kirim Konfirmasi"
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            leftIcon={
              <Ionicons name="send" size={18} color={colors.textInverse} />
            }
            style={styles.footerSubmitButton}
          />
        </>
      }
    >
      {incident ? <IncidentCard incident={incident} compact /> : null}

      <View style={styles.section}>
        <SectionHeader
          title="Jenis Konfirmasi"
          subtitle="Pilih apakah kamu mengonfirmasi, membantah, atau memperbarui kondisi laporan."
        />

        <View style={styles.optionList}>
          {VERIFICATION_OPTIONS.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={item.label}
              description={item.description}
              icon={item.icon}
              color={item.color}
              active={verificationType === item.value}
              disabled={submitting}
              onPress={() => setVerificationType(item.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Kondisi Saat Ini"
          subtitle="Pilih kondisi yang paling sesuai dengan situasi di lokasi."
        />

        <View style={styles.optionList}>
          {conditionOptions.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={item.label}
              description={item.description}
              icon={item.icon}
              color={item.color}
              active={conditionStatus === item.value}
              disabled={submitting}
              onPress={() => setConditionStatus(item.value)}
            />
          ))}
        </View>
      </View>

      <EvidencePicker
        title="Foto Bukti Terbaru"
        subtitle="Foto diperlukan sebagai bukti kondisi terkini di lokasi."
        emptyTitle="Belum ada foto"
        emptyMessage="Tambahkan foto untuk memperkuat konfirmasimu."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title="Catatan Kondisi"
          subtitle="Tulis catatan singkat tentang kondisi yang kamu lihat di lokasi."
        />

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Contoh: Jalan masih terblokir, satu lajur bisa digunakan."
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={note.trim().length >= 8 ? "Catatan sudah cukup" : "Minimal 8 karakter"}
          variant={note.trim().length >= 8 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}
