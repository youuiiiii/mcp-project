import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator, Image
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function ReportScreen() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const disasterTypes = ['Gempa Bumi', 'Banjir', 'Tanah Longsor', 'Kebakaran', 'Tsunami'];

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Izin kamera diperlukan!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Izin galeri diperlukan!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!type || !description) {
      Alert.alert('Error', 'Mohon isi semua field!');
      return;
    }

    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Izin lokasi diperlukan!');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      await addDoc(collection(db, 'reports'), {
        type,
        description,
        photoUrl: photo || null,
        location: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        isVerified: false,
        confirmCount: 0,
        flagCount: 0,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Sukses', 'Laporan berhasil dikirim!');
      setType('');
      setDescription('');
      setPhoto(null);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim laporan!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🚨 Lapor Bencana</Text>
      <Text style={styles.subtitle}>Laporkan bencana di sekitar kamu</Text>

      <Text style={styles.label}>Jenis Bencana</Text>
      <View style={styles.typeContainer}>
        {disasterTypes.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeBtn, type === t && styles.typeBtnActive]}
            onPress={() => setType(t)}>
            <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Foto Kejadian</Text>
      <View style={styles.photoBtnRow}>
        <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
          <Text style={styles.photoIcon}>📷</Text>
          <Text style={styles.photoText}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoBtn} onPress={pickFromGallery}>
          <Text style={styles.photoIcon}>🖼️</Text>
          <Text style={styles.photoText}>Galeri</Text>
        </TouchableOpacity>
      </View>

      {photo && (
        <Image source={{ uri: photo }} style={styles.photoPreview} />
      )}

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={styles.input}
        placeholder="Ceritakan situasi bencana..."
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>Kirim Laporan</Text>
        )}
      </TouchableOpacity>
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C0392B',
  },
  typeBtnActive: {
    backgroundColor: '#C0392B',
  },
  typeBtnText: {
    color: '#C0392B',
    fontSize: 13,
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  photoBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  photoBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C0392B',
    borderStyle: 'dashed',
    elevation: 2,
  },
  photoIcon: {
    fontSize: 30,
    marginBottom: 6,
  },
  photoText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '600',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 20,
    elevation: 2,
  },
  submitBtn: {
    backgroundColor: '#C0392B',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});