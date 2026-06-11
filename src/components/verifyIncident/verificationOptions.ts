import { colors } from "../../theme/colors";
import type { ConditionOption, VerificationOption } from "./types";

export const VERIFICATION_OPTIONS: VerificationOption[] = [
  {
    value: "valid",
    label: "Mengonfirmasi",
    description: "Saya melihat langsung bahwa kejadian ini nyata.",
    color: colors.success,
    icon: "checkmark-circle",
  },
  {
    value: "condition_update",
    label: "Perbarui Kondisi",
    description: "Kejadian ada, tapi kondisinya perlu diperbarui.",
    color: colors.warning,
    icon: "sync-circle",
  },
  {
    value: "invalid",
    label: "Tidak Akurat",
    description: "Saya tidak menemukan kejadian yang sesuai dengan laporan ini.",
    color: colors.danger,
    icon: "close-circle",
  },
];

export const CONDITION_OPTIONS: ConditionOption[] = [
  {
    value: "still_happening",
    label: "Masih Terjadi",
    description: "Kejadian masih berlangsung di lokasi.",
    color: colors.warning,
    icon: "radio",
  },
  {
    value: "getting_worse",
    label: "Semakin Parah",
    description: "Kondisi tampak semakin memburuk.",
    color: colors.danger,
    icon: "trending-up",
  },
  {
    value: "partially_resolved",
    label: "Membaik",
    description: "Kondisi mulai membaik, tapi belum sepenuhnya selesai.",
    color: colors.info,
    icon: "construct",
  },
  {
    value: "resolved_but_not_closed",
    label: "Tampak Selesai",
    description: "Kejadian tampak sudah selesai, namun masih perlu konfirmasi.",
    color: colors.success,
    icon: "checkmark-done",
  },
  {
    value: "not_found",
    label: "Tidak Ditemukan",
    description: "Tidak ada kejadian yang terlihat di sekitar lokasi.",
    color: colors.textMuted,
    icon: "search",
  },
];
