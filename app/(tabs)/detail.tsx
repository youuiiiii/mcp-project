import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DetailScreen() {
  const router = useRouter();
  const { magnitude, wilayah, jam, tanggal, kedalaman, lintang, bujur, potensi } =
    useLocalSearchParams();

  const getMagnitudeColor = (mag: string) => {
    const m = parseFloat(mag as string);
    if (m >= 7) return '#8B0000';
    if (m >= 5) return '#C0392B';
    if (m >= 3) return '#E67E22';
    return '#27AE60';
  };

  const getMagnitudeLabel = (mag: string) => {
    const m = parseFloat(mag as string);
    if (m >= 7) return '🔴 Sangat Kuat';
    if (m >= 5) return '🟠 Kuat';
    if (m >= 3) return '🟡 Sedang';
    return '🟢 Lemah';
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Kembali</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Detail Gempa Bumi</Text>

      <View style={[styles.magnitudeCard, { backgroundColor: getMagnitudeColor(magnitude as string) }]}>
        <Text style={styles.magnitudeLabel}>Magnitudo</Text>
        <Text style={styles.magnitudeValue}>{magnitude}</Text>
        <Text style={styles.magnitudeStatus}>{getMagnitudeLabel(magnitude as string)}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📍 Lokasi</Text>
        <Text style={styles.infoValue}>{wilayah}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🕐 Waktu</Text>
        <Text style={styles.infoValue}>{jam} WIB</Text>
        <Text style={styles.infoValue}>{tanggal}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📏 Kedalaman</Text>
        <Text style={styles.infoValue}>{kedalaman}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🌐 Koordinat</Text>
        <Text style={styles.infoValue}>Lintang: {lintang}</Text>
        <Text style={styles.infoValue}>Bujur: {bujur}</Text>
      </View>

      {potensi && (
        <View style={[styles.infoCard, styles.potensiCard]}>
          <Text style={styles.infoTitle}>⚠️ Potensi</Text>
          <Text style={styles.potensiValue}>{potensi}</Text>
        </View>
      )}

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>🛡️ Yang Harus Dilakukan</Text>
        <Text style={styles.tipItem}>• Tetap tenang dan jangan panik</Text>
        <Text style={styles.tipItem}>• Berlindung di bawah meja yang kuat</Text>
        <Text style={styles.tipItem}>• Jauhi jendela dan benda yang bisa jatuh</Text>
        <Text style={styles.tipItem}>• Setelah gempa, keluar dengan hati-hati</Text>
        <Text style={styles.tipItem}>• Waspada gempa susulan</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  backBtn: {
    marginBottom: 16,
  },
  backText: {
    color: '#C0392B',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  magnitudeCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  magnitudeLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  magnitudeValue: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 72,
  },
  magnitudeStatus: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#C0392B',
  },
  infoTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 6,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  potensiCard: {
    borderLeftColor: '#E67E22',
    backgroundColor: '#FFF9F0',
  },
  potensiValue: {
    fontSize: 15,
    color: '#E67E22',
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#C0392B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipItem: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 20,
  },
});