import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

export default function ProfileSafetyReminder() {
  return (
    <AppCard variant="muted" style={styles.card}>
      <View style={styles.header}>
        <IconBadge variant="info" size="sm">
          <Ionicons
            name="information-circle"
            size={18}
            color={colors.info}
          />
        </IconBadge>

        <Text style={styles.title}>Pengingat Darurat</Text>
      </View>

      <Text style={styles.text}>
        Aplikasi ini membantu pelaporan dan pemantauan kejadian sekitar, tetapi
        tidak menggantikan layanan darurat resmi. Jika kondisi berbahaya, segera
        hubungi pihak berwenang.
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.infoSoft,
    borderColor: colors.info,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.infoDark,
  },
  text: {
    ...typography.caption,
    color: colors.info,
  },
});