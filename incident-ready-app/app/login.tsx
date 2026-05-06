import { Href, Link, Redirect } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../src/contexts/AuthContext";

const HOME_ROUTE = "/" as Href;
const REGISTER_ROUTE = "/register" as Href;

export default function LoginScreen() {
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Redirect href={HOME_ROUTE} />;
  }

  const handleLogin = async () => {
    try {
      if (!email.trim()) {
        Alert.alert("Email wajib diisi", "Masukkan email akun Anda.");
        return;
      }

      if (!password) {
        Alert.alert("Password wajib diisi", "Masukkan password akun Anda.");
        return;
      }

      setSubmitting(true);

      await login(email, password);
    } catch (error) {
      Alert.alert(
        "Login Gagal",
        error instanceof Error ? error.message : "Email atau password salah."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>INCIDENT READY APP</Text>
        </View>

        <Text style={styles.title}>Masuk Akun</Text>

        <Text style={styles.subtitle}>
          Login untuk melaporkan kejadian, memantau crisis map, dan memakai
          fitur SOS.
        </Text>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              editable={!submitting}
            />
          </View>

          <View>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Masukkan password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={styles.input}
              editable={!submitting}
            />
          </View>

          <Pressable
            disabled={submitting}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              submitting && styles.buttonDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Belum punya akun?</Text>

          <Link href={REGISTER_ROUTE} asChild>
            <Pressable>
              <Text style={styles.footerLink}> Daftar sekarang</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#CCFBF1",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F766E",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 22,
  },
  form: {
    marginTop: 24,
    gap: 14,
  },
  label: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#0F766E",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  footer: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F766E",
  },
});