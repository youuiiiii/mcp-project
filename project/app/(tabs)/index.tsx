import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { requestNotificationPermission, checkAndNotifyNearbyDisaster } from '../services/notifications';

export default function HomeScreen() {
  const [disasters, setDisasters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    requestNotificationPermission();
    fetchBMKGData();
  }, []);

  const fetchBMKGData = async () => {
    try {
      const response = await fetch(
        'https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json'
      );
      const data = await response.json();
      const gempaList = data.Infogempa.gempa;
      setDisasters(gempaList);
      checkAndNotifyNearbyDisaster(gempaList);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚨 SIGAP</Text>
      <Text style={styles.subtitle}>Disaster Early Warning System</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={disasters}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({
                pathname: '/detail',
                params: {
                  magnitude: item.Magnitude,
                  wilayah: item.Wilayah,
                  jam: item.Jam,
                  tanggal: item.Tanggal,
                  kedalaman: item.Kedalaman,
                  lintang: item.Lintang,
                  bujur: item.Bujur,
                  potensi: item.Potensi,
                }
              })}>
              <Text style={styles.cardTitle}>🌍 Gempa Bumi</Text>
              <Text style={styles.cardText}>Magnitude: {item.Magnitude}</Text>
              <Text style={styles.cardText}>Lokasi: {item.Wilayah}</Text>
              <Text style={styles.cardText}>Waktu: {item.Jam}, {item.Tanggal}</Text>
              <Text style={styles.cardText}>Kedalaman: {item.Kedalaman}</Text>
              <Text style={styles.cardSeeMore}>Lihat detail →</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#C0392B',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  cardText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  cardSeeMore: {
    color: '#C0392B',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
});