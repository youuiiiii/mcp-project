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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/services/firebase";
import { colors } from "@/theme/colors";
import { useI18n } from "@/i18n";
import { radius } from "@/theme/layout";

const HOME_ROUTE = "/(tabs)" as Href;
const REGISTER_ROUTE = "/register" as Href;

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { user, loading, login, loginWithGoogle } = useAuth();

  // Navigation Steps inside Login Screen
  // 1: Form Login
  // 2: Forgot Password Form
  // 3: Forgot Password Success Page
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Input Focus States
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [forgotEmailFocused, setForgotEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error/Submitting States
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  if (!loading && user) {
    return <Redirect href={HOME_ROUTE} />;
  }

  // Handle Login Flow
  const handleLogin = async () => {
    setLoginError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setLoginError("Email Address is required.");
      return;
    }
    if (!password) {
      setLoginError("Password is required.");
      return;
    }

    try {
      setSubmitting(true);
      await login(cleanEmail, password);
      router.replace(HOME_ROUTE);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError(
        error instanceof Error
          ? "Old Email or password incorrect to continue"
          : "An unexpected login error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google Login Flow
  const handleGoogleLogin = async () => {
    try {
      setLoginError(null);
      setSubmitting(true);
      await loginWithGoogle();
      router.replace(HOME_ROUTE);
    } catch (error: any) {
      console.error("Google Login failed:", error);
      
      // Ignore user-cancelled popup errors to prevent annoying banners
      if (error?.code !== "auth/popup-closed-by-user") {
        setLoginError(
          error instanceof Error ? error.message : "Could not sign in with Google."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Reset Password flow
  const handleSendResetEmail = async () => {
    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail) {
      Alert.alert("Email Required", "Please enter your email address to reset password.");
      return;
    }

    try {
      setSubmitting(true);
      await sendPasswordResetEmail(auth, cleanEmail);
      setStep(3); // Success page
    } catch (error) {
      Alert.alert(
        "Reset Failed",
        error instanceof Error ? error.message : "Could not send password reset email."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Terra Logo Header — forest green shield icon */}
        <View style={styles.logoHeader}>
          <View style={styles.brandIconWrapper}>
            <Ionicons name="shield-checkmark" size={32} color={colors.textInverse} />
          </View>
          <Text style={styles.logoText}>SIGAP</Text>
        </View>

        {/* Step 1: Login Form */}
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.title}>{t("auth.signInToSigap")}</Text>
            <Text style={styles.subtitle}>
              Enter your credentials to access your secure dashboard.
            </Text>

            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("auth.email")}</Text>
                <View style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputFocused,
                  loginError && !email.trim() && styles.inputError,
                ]}>
                  <Ionicons name="mail-outline" size={20} color={colors.textSoft} style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder={t("auth.emailPlaceholder")}
                    placeholderTextColor={colors.textSoft}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.textInput}
                    editable={!submitting}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.passwordLabelRow}>
                  <Text style={styles.label}>{t("auth.password")}</Text>
                  <Pressable onPress={() => setStep(2)}>
                    <Text style={styles.forgotLink}>{t("auth.forgotPassword")}</Text>
                  </Pressable>
                </View>
                <View style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputFocused,
                  loginError && !password && styles.inputError,
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textSoft} style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t("auth.passwordPlaceholder")}
                    placeholderTextColor={colors.textSoft}
                    secureTextEntry={!showPassword}
                    style={styles.textInput}
                    editable={!submitting}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.textSoft}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Remember Me */}
              <View style={styles.optionRow}>
                <Pressable
                  onPress={() => setRememberMe(!rememberMe)}
                  style={styles.checkboxWrapper}
                >
                  <Ionicons
                    name={rememberMe ? "checkbox" : "square-outline"}
                    size={20}
                    color={rememberMe ? colors.primary : colors.border}
                  />
                  <Text style={styles.checkboxText}>{t("auth.rememberMe")}</Text>
                </Pressable>
              </View>

              {/* Login Error Banner */}
              {loginError && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={16} color={colors.danger} />
                  <Text style={styles.errorText}>{loginError}</Text>
                </View>
              )}

              {/* Sign In CTA — Terra primary green */}
              <Pressable
                disabled={submitting}
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                  submitting && styles.buttonDisabled,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <View style={styles.primaryButtonContent}>
                    <Text style={styles.primaryButtonText}>{t("auth.signIn")}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons — Terra cream surface with outline */}
              <View style={styles.socialRow}>
                <Pressable
                  disabled={submitting}
                  onPress={handleGoogleLogin}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
                    submitting && styles.buttonDisabled,
                  ]}
                >
                  <Ionicons name="logo-google" size={18} color="#EA4335" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </Pressable>
              </View>

              {/* Register Link */}
              <View style={styles.registerRow}>
                <Text style={styles.registerText}>{t("auth.dontHaveAccount")}</Text>
                <Link href={REGISTER_ROUTE} asChild>
                  <Pressable>
                    <Text style={styles.registerLink}> {t("auth.signUp")}</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        )}

        {/* Step 2: Forgot Password Form */}
        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.title}>{t("auth.forgotPasswordTitle")}</Text>
            <Text style={styles.subtitle}>
              {t("auth.forgotPasswordDesc")}
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("auth.email")}</Text>
                <View style={[
                  styles.inputWrapper,
                  forgotEmailFocused && styles.inputFocused,
                ]}>
                  <Ionicons name="mail-outline" size={20} color={colors.textSoft} style={styles.inputIcon} />
                  <TextInput
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                    placeholder={t("auth.emailPlaceholder")}
                    placeholderTextColor={colors.textSoft}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.textInput}
                    editable={!submitting}
                    onFocus={() => setForgotEmailFocused(true)}
                    onBlur={() => setForgotEmailFocused(false)}
                  />
                </View>
              </View>

              <Pressable
                disabled={submitting}
                onPress={handleSendResetEmail}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                  submitting && styles.buttonDisabled,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>{t("auth.send")}</Text>
                )}
              </Pressable>

              <Pressable onPress={() => setStep(1)} style={styles.backButton}>
                <Text style={styles.backButtonText}>{t("auth.backToLogin")}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Step 3: Forgot Password Success Page */}
        {step === 3 && (
          <View style={styles.card}>
            <View style={styles.successEnvelopeWrapper}>
              <View style={styles.envelopeIconOuter}>
                <Ionicons name="mail-open-outline" size={48} color={colors.primary} />
              </View>
            </View>

            <Text style={[styles.title, styles.centerText]}>{t("auth.checkYourEmail")}</Text>
            <Text style={[styles.subtitle, styles.centerText]}>
              {t("auth.checkYourEmailDesc")}{"\n"}
              <Text style={styles.boldText}>{forgotEmail}</Text>
            </Text>

            <Pressable
              onPress={() => {
                setStep(1);
                setForgotEmail("");
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>{t("auth.backToLogin")}</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,         // Warm cream #FAF6F0
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  /* ---------- Logo Header ---------- */
  logoHeader: {
    alignItems: "center",
    marginVertical: 28,
    gap: 12,
  },
  brandIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,                            // Rounded square like Terra login
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 2,
  },

  /* ---------- Card ---------- */
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Glass-card effect
    borderRadius: radius.xl,                       // 16px
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",       // outline-variant at 30%
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 22,
    marginBottom: 24,
  },

  /* ---------- Form ---------- */
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    marginLeft: 2,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,          // Warm cream input bg
    borderWidth: 0,                                // No border by default
    borderRadius: radius.md,                       // 12px
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: "rgba(74, 124, 89, 0.3)",         // Green focus ring at 30%
    backgroundColor: colors.surfaceMuted,
  },
  inputError: {
    borderWidth: 2,
    borderColor: colors.danger,
  },
  eyeButton: {
    padding: 8,
  },

  /* ---------- Options Row ---------- */
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },

  /* ---------- Error Banner ---------- */
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: colors.dangerDark,
  },

  /* ---------- Primary CTA Button ---------- */
  primaryButton: {
    backgroundColor: colors.primary,               // Forest green
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* ---------- Divider ---------- */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(196, 200, 188, 0.3)",    // outline-variant at 30%
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSoft,
    letterSpacing: 1.5,
  },

  /* ---------- Social Buttons ---------- */
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",
    borderRadius: radius.md,
    paddingVertical: 12,
    backgroundColor: colors.surfaceContainer,        // Warm cream
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  /* ---------- Register Link ---------- */
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  registerText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },

  /* ---------- Common ---------- */
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
  },
  successEnvelopeWrapper: {
    alignItems: "center",
    marginVertical: 20,
  },
  envelopeIconOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primarySoft,             // Light green accent
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    textAlign: "center",
  },
  boldText: {
    fontWeight: "700",
    color: colors.text,
  },
});
