import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import SectionHeader from "../../components/ui/SectionHeader";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

const EDUCATION_ITEMS = [
  {
    title: "Keselamatan saat melapor",
    description:
      "Laporkan kejadian dari jarak aman. Jangan mengambil foto saat berkendara atau mendekati area berbahaya.",
    iconName: "shield-checkmark-outline" as const,
  },
  {
    title: "Membaca laporan warga",
    description:
      "Laporan warga adalah informasi awal. Perhatikan status akurasi dan komentar terbaru sebelum mengambil keputusan.",
    iconName: "information-circle-outline" as const,
  },
  {
    title: "Saat melihat kecelakaan",
    description:
      "Utamakan keselamatan diri. Hindari kerumunan, beri ruang untuk petugas, dan laporkan jika aman.",
    iconName: "warning-outline" as const,
  },
  {
    title: "Saat terjadi kebakaran",
    description:
      "Jauhi sumber api, jangan menghirup asap, dan ikuti arahan petugas atau warga setempat.",
    iconName: "flame-outline" as const,
  },
];

export default function EducationScreen() {
  return (
    <AppScreen contentContainerStyle={styles.content}>
      <SectionHeader
        title="Education"
        subtitle="Panduan singkat keselamatan dan penggunaan laporan warga."
      />

      <View style={styles.list}>
        {EDUCATION_ITEMS.map((item) => (
          <AppCard key={item.title} style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name={item.iconName} size={22} color={colors.info} />
            </View>

            <View style={styles.textGroup}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </AppCard>
        ))}
      </View>

      <AppCard variant="muted" style={styles.noteCard}>
        <Ionicons name="construct-outline" size={22} color={colors.textMuted} />
        <View style={styles.textGroup}>
          <Text style={styles.noteTitle}>Konten masih bisa dikembangkan</Text>
          <Text style={styles.noteText}>
            Screen ini sudah dikembalikan ke UI supaya fitur Education bisa
            dilanjutkan tanpa mengganggu core flow.
          </Text>
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing["2xl"],
  },
  list: {
    gap: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.infoSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: colors.textMuted,
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  noteText: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
});