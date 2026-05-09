import * as Location from 'expo-location';
import { collection, deleteDoc, doc, getDocs, increment, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../src/services/firebase';

const ADMIN_EMAIL = 'admin@sigap.com';
const VERIFY_RADIUS_METERS = 10;

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ReportsScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = auth.currentUser?.email === ADMIN_EMAIL;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (report: any) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Izin lokasi diperlukan!');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const distance = getDistance(
        location.coords.latitude,
        location.coords.longitude,
        report.location.lat,
        report.location.lng
      );

      if (distance > VERIFY_RADIUS_METERS) {
        Alert.alert(
          'Terlalu Jauh',
          `Kamu harus berada dalam ${VERIFY_RADIUS_METERS} meter dari lokasi bencana untuk bisa konfirmasi. Jarak kamu sekarang: ${Math.round(distance)} meter.`
        );
        return;
      }

      await updateDoc(doc(db, 'reports', report.id), {
        confirmCount: increment(1),
        isVerified: report.confirmCount + 1 >= 3,
      });

      Alert.alert('Sukses', 'Laporan berhasil dikonfirmasi!');
      fetchReports();
    } catch (error) {
      Alert.alert('Error', 'Gagal mengkonfirmasi laporan!');
    }
  };

  const handleFlag = async (report: any) => {
    try {
      const newFlagCount = report.flagCount + 1;
      if (newFlagCount >= 3) {
        await deleteDoc(doc(db, 'reports', report.id));
        Alert.alert('Info', 'Laporan dihapus karena terlalu banyak dilaporkan sebagai palsu!');
      } else {
        await updateDoc(doc(db, 'reports', report.id), {
          flagCount: increment(1),
        });
        Alert.alert('Sukses', 'Laporan berhasil diflag!');
      }
      fetchReports();
    } catch (error) {
      Alert.alert('Error', 'Gagal memflag laporan!');
    }
  };

  const handleDelete = async (reportId: string) => {
    Alert.alert('Konfirmasi', 'Hapus laporan ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'reports', reportId));
          fetchReports();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Laporan Bencana</Text>
      <Text style={styles.subtitle}>
        {isAdmin ? '👮 Mode Admin' : 'Konfirmasi laporan di sekitar kamu'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={fetchReports}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>{item.type}</Text>
                <Text style={[styles.badge, item.isVerified ? styles.verified : styles.unverified]}>
                  {item.isVerified ? '✅ Terverifikasi' : '⏳ Belum Diverifikasi'}
                </Text>
              </View>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <Text style={styles.cardMeta}>
                👍 {item.confirmCount} konfirmasi · 🚩 {item.flagCount} flag
              </Text>

              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => handleConfirm(item)}>
                  <Text style={styles.btnText}>👍 Konfirmasi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.flagBtn}
                  onPress={() => handleFlag(item)}>
                  <Text style={styles.btnText}>🚩 Flag</Text>
                </TouchableOpacity>
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id)}>
                    <Text style={styles.btnText}>🗑️ Hapus</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
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
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#C0392B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardType: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  verified: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  unverified: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  cardDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#27AE60',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  flagBtn: {
    flex: 1,
    backgroundColor: '#E67E22',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#C0392B',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});