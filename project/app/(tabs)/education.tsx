import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, FlatList
} from 'react-native';

const educationData = [
  {
    id: '1',
    type: 'Gempa Bumi',
    icon: '🌍',
    tips: [
      'Jangan panik, tetap tenang',
      'Berlindung di bawah meja yang kuat',
      'Jauhi jendela dan benda yang bisa jatuh',
      'Setelah gempa, keluar dengan hati-hati',
      'Waspada gempa susulan',
    ],
  },
  {
    id: '2',
    type: 'Banjir',
    icon: '🌊',
    tips: [
      'Segera pindah ke tempat yang lebih tinggi',
      'Hindari berjalan di air banjir',
      'Matikan listrik jika aman',
      'Siapkan tas darurat',
      'Ikuti arahan petugas evakuasi',
    ],
  },
  {
    id: '3',
    type: 'Tanah Longsor',
    icon: '⛰️',
    tips: [
      'Waspadai tanda-tanda longsor (retakan tanah)',
      'Segera evakuasi jika hujan deras',
      'Jauhi lereng yang curam',
      'Jangan kembali sebelum dinyatakan aman',
      'Hubungi BPBD setempat',
    ],
  },
  {
    id: '4',
    type: 'Kebakaran',
    icon: '🔥',
    tips: [
      'Segera hubungi pemadam kebakaran (113)',
      'Jangan panik, evakuasi dengan tertib',
      'Tutup hidung dengan kain basah',
      'Jangan gunakan lift',
      'Berkumpul di titik evakuasi',
    ],
  },
  {
    id: '5',
    type: 'Tsunami',
    icon: '🌏',
    tips: [
      'Jika ada gempa besar, segera menjauh dari pantai',
      'Lari ke tempat yang lebih tinggi',
      'Jangan kembali ke pantai sebelum aman',
      'Ikuti jalur evakuasi tsunami',
      'Waspada terhadap peringatan dini BMKG',
    ],
  },
];

export default function EducationScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedData = educationData.find((e) => e.id === selected);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📚 Edukasi Bencana</Text>
      <Text style={styles.subtitle}>Pelajari cara menghadapi bencana</Text>

      <View style={styles.typeContainer}>
        {educationData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.typeBtn, selected === item.id && styles.typeBtnActive]}
            onPress={() => setSelected(selected === item.id ? null : item.id)}>
            <Text style={styles.typeIcon}>{item.icon}</Text>
            <Text style={[styles.typeBtnText, selected === item.id && styles.typeBtnTextActive]}>
              {item.type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedData && (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>
            {selectedData.icon} Panduan {selectedData.type}
          </Text>
          {selectedData.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipNumber}>{index + 1}</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.emergency}>
        <Text style={styles.emergencyTitle}>📞 Nomor Darurat</Text>
        <Text style={styles.emergencyText}>BNPB: 117</Text>
        <Text style={styles.emergencyText}>Pemadam: 113</Text>
        <Text style={styles.emergencyText}>Ambulans: 118</Text>
        <Text style={styles.emergencyText}>Polisi: 110</Text>
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C0392B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C0392B',
    backgroundColor: '#fff',
  },
  typeBtnActive: {
    backgroundColor: '#C0392B',
  },
  typeIcon: {
    fontSize: 16,
  },
  typeBtnText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  tipNumber: {
    backgroundColor: '#C0392B',
    color: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  emergency: {
    backgroundColor: '#C0392B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
});