import { Href, Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";

const HOME_ROUTE = "/(tabs)" as Href;
const REGISTER_ROUTE = "/register" as Href;

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Redirect href={HOME_ROUTE} />;
  }

  const handleLogin = async () => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        Alert.alert("Email Required", "Enter your account email.");
        return;
      }

      if (!password) {
        Alert.alert("Password Required", "Enter your account password.");
        return;
      }

      setSubmitting(true);

      await login(cleanEmail, password);

      router.replace(HOME_ROUTE);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "The email or password is incorrect."
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>SIGAP</Text>
          <Text style={styles.headerSubtitle}>
            Disaster Early Warning System
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>INCIDENT READY APP</Text>
          </View>

          <Text style={styles.title}>Sign In</Text>

          <Text style={styles.subtitle}>
            Log in to report incidents, monitor the crisis map, and use SOS.
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
                placeholder="Enter your password"
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
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Do not have an account?</Text>

            <Link href={REGISTER_ROUTE} asChild>
              <Pressable disabled={submitting}>
                <Text style={styles.footerLink}> Create one</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0392B",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#FFE4E1",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#B91C1C",
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
    backgroundColor: "#C0392B",
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
    color: "#C0392B",
  },
});
