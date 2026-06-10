import { Href, Link, Redirect, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/theme/colors";
import { useI18n } from "@/i18n";
import { radius } from "@/theme/layout";

const HOME_ROUTE = "/(tabs)" as Href;
const LOGIN_ROUTE = "/login" as Href;

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { user, loading, register } = useAuth();

  // Navigation Steps:
  // 0: Onboarding intro slides
  // 1: Welcome/Landing Screen
  // 2: Form Data Diri (Name, Email, Birth Date, Phone Number)
  // 3: OTP Verification
  // 4: Create Password (with Strength Meter)
  // 5: Success Registration Page
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const onboardingSlides = useMemo(() => [
    {
      title: t("onboarding.slide0.title"),
      description: t("onboarding.slide0.desc"),
      icon: "map-outline" as const,
    },
    {
      title: t("onboarding.slide1.title"),
      description: t("onboarding.slide1.desc"),
      icon: "alert-circle-outline" as const,
    },
    {
      title: t("onboarding.slide2.title"),
      description: t("onboarding.slide2.desc"),
      icon: "calendar-outline" as const,
    },
  ], [t]);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  // Input Focus States
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [birthDateFocused, setBirthDateFocused] = useState(false);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Password Visibility Toggle
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification States
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  
  // Submit state
  const [submitting, setSubmitting] = useState(false);

  // Generate OTP simulation when entering Step 3
  const triggerOtpGeneration = (targetEmail: string) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpCode("");
    console.log(`[SIGAP OTP SIMULATION] Code sent to ${targetEmail}: ${code}`);
    
    // Show Alert with simulation OTP
    Alert.alert(
      "OTP Sent (Simulation)",
      `A 4-digit verification code has been simulated for:\n${targetEmail}\n\nCode: ${code}`,
      [{ text: "OK" }]
    );
  };

  // Validasi Step 2 (Data Diri)
  const handleValidateStep2 = () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanBirth = birthDate.trim();
    const cleanPhone = phoneNumber.trim();

    if (!cleanName) {
      Alert.alert("Name Required", "Enter your full name.");
      return;
    }
    if (cleanName.length < 3) {
      Alert.alert("Name Too Short", "Name must be at least 3 characters.");
      return;
    }
    if (!cleanEmail) {
      Alert.alert("Email Required", "Enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (!cleanBirth) {
      Alert.alert("Birth Date Required", "Enter your birth date.");
      return;
    }
    if (!cleanPhone) {
      Alert.alert("Phone Number Required", "Enter your phone number.");
      return;
    }

    // Go to OTP verification step
    setStep(3);
    triggerOtpGeneration(cleanEmail);
  };

  // Validasi Step 3 (OTP verification)
  const handleVerifyOtp = () => {
    if (otpCode === generatedOtp) {
      setStep(4);
    } else {
      Alert.alert("Verification Failed", "The 4-digit code is incorrect. Please check your simulated OTP.");
    }
  };

  // Password Strength Calculation (Step 4)
  const passwordCriteria = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    return {
      hasMinLength,
      hasNumber,
      hasSymbol,
    };
  }, [password]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (passwordCriteria.hasMinLength) score += 1;
    if (passwordCriteria.hasNumber) score += 1;
    if (passwordCriteria.hasSymbol) score += 1;

    return {
      score, // 0 to 3
      label: score === 3 ? "Strong" : score === 2 ? "Medium" : score === 1 ? "Weak" : "Too Short",
      color: score === 3 ? colors.success : score === 2 ? colors.warning : colors.danger,
    };
  }, [passwordCriteria]);

  // Redirect if logged in (only if not currently on step 5)
  if (!loading && user && step !== 5) {
    return <Redirect href={HOME_ROUTE} />;
  }

  // Submit Final Registration (Step 4 -> 5)
  const handleFinalSubmit = async () => {
    if (passwordStrength.score < 2) {
      Alert.alert("Password Weak", "Please create a stronger password (at least Medium strength) to protect your account.");
      return;
    }

    try {
      setSubmitting(true);
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();

      // Sign up inside Firebase Auth
      await register(cleanName, cleanEmail, password);
      
      // Move to step 5 (success page)
      setStep(5);
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error instanceof Error ? error.message : "Could not create an account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Navigasi masuk ke Home setelah Step 5 sukses
  const handleExploreApp = () => {
    router.replace(HOME_ROUTE);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Step 0: Onboarding Slides */}
        {step === 0 && (
          <View style={styles.onboardingContainer}>
            <View style={styles.logoHeader}>
              <View style={styles.brandIconWrapper}>
                <Ionicons name="shield-checkmark" size={32} color={colors.textInverse} />
              </View>
              <Text style={styles.logoText}>SIGAP</Text>
            </View>

            <View style={styles.onboardingCard}>
              <View style={styles.onboardingIconOuter}>
                <Ionicons
                  name={onboardingSlides[activeSlide].icon}
                  size={52}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.onboardingTitle}>
                {onboardingSlides[activeSlide].title}
              </Text>
              
              <Text style={styles.onboardingDesc}>
                {onboardingSlides[activeSlide].description}
              </Text>
            </View>

            <View style={styles.dotsRow}>
              {onboardingSlides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeSlide === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>

            <Pressable
              onPress={() => {
                if (activeSlide < 2) {
                  setActiveSlide(activeSlide + 1);
                } else {
                  setStep(1);
                }
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
                { marginHorizontal: 24, marginBottom: 16 }
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {activeSlide === 2 ? t("onboarding.getStarted") : t("onboarding.continue")}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Step 1: Welcome/Landing Page */}
        {step === 1 && (
          <View style={styles.welcomeContainer}>
            <View style={styles.logoHeader}>
              <View style={styles.brandIconWrapperLarge}>
                <Ionicons name="shield-checkmark" size={48} color={colors.textInverse} />
              </View>
              <Text style={styles.logoTextLarge}>SIGAP</Text>
              <Text style={styles.welcomeSubtitle}>INCIDENT READY APP</Text>
            </View>

            <View style={styles.welcomeBottom}>
              <Text style={styles.welcomeTextTitle}>{t("auth.welcomeTitle")}</Text>
              <Text style={styles.welcomeTextDesc}>
                {t("auth.welcomeDesc")}
              </Text>

              <Pressable
                onPress={() => setStep(2)}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>{t("auth.createAccount")}</Text>
              </Pressable>

              <View style={styles.welcomeFooter}>
                <Text style={styles.welcomeFooterText}>{t("auth.alreadyHaveAccount")}</Text>
                <Link href={LOGIN_ROUTE} asChild>
                  <Pressable>
                    <Text style={styles.welcomeFooterLink}> {t("auth.signIn")}</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        )}

        {/* Form Card for Step 2, 3, 4 */}
        {step >= 2 && step <= 4 && (
          <View style={styles.cardWrapper}>
            <View style={styles.logoHeader}>
              <View style={styles.brandIconWrapper}>
                <Ionicons name="shield-checkmark" size={32} color={colors.textInverse} />
              </View>
              <Text style={styles.logoText}>SIGAP</Text>
            </View>

            <View style={styles.formCard}>
              {/* Step 2: Data Diri Form */}
              {step === 2 && (
                <View>
                  <Text style={styles.title}>{t("auth.signUp")}</Text>
                  <Text style={styles.subtitle}>
                    {t("auth.signUpToSigap")}
                  </Text>

                  <View style={styles.form}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>{t("auth.fullName")}</Text>
                      <View style={[
                        styles.inputWrapper,
                        nameFocused && styles.inputFocused,
                      ]}>
                        <Ionicons name="person-outline" size={20} color={colors.textSoft} style={styles.inputIcon} />
                        <TextInput
                          value={name}
                          onChangeText={setName}
                          placeholder={t("auth.fullNamePlaceholder")}
                          placeholderTextColor={colors.textSoft}
                          style={styles.textInput}
                          onFocus={() => setNameFocused(true)}
                          onBlur={() => setNameFocused(false)}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>{t("auth.email")}</Text>
                      <View style={[
                        styles.inputWrapper,
                        emailFocused && styles.inputFocused,
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
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>{t("report.severity.title")}</Text>
                      <View style={[
                        styles.inputWrapper,
                        birthDateFocused && styles.inputFocused,
                      ]}>
                        <Ionicons name="calendar-outline" size={20} color={colors.textSoft} style={styles.inputIcon} />
                        <TextInput
                          value={birthDate}
                          onChangeText={setBirthDate}
                          placeholder="Example: 19/02/2000"
                          placeholderTextColor={colors.textSoft}
                          style={styles.textInput}
                          onFocus={() => setBirthDateFocused(true)}
                          onBlur={() => setBirthDateFocused(false)}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Phone Number</Text>
                      <View style={[
                        styles.inputWrapper,
                        phoneNumberFocused && styles.inputFocused,
                      ]}>
                        <Ionicons name="call-outline" size={20} color={colors.textSoft} style={styles.inputIcon} />
                        <TextInput
                          value={phoneNumber}
                          onChangeText={setPhoneNumber}
                          placeholder="Example: +62 812-XXXX-XXXX"
                          placeholderTextColor={colors.textSoft}
                          keyboardType="phone-pad"
                          style={styles.textInput}
                          onFocus={() => setPhoneNumberFocused(true)}
                          onBlur={() => setPhoneNumberFocused(false)}
                        />
                      </View>
                    </View>

                    <Pressable
                      onPress={handleValidateStep2}
                      style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <Text style={styles.primaryButtonText}>{t("auth.signUpBtn")}</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Step 3: Verification OTP */}
              {step === 3 && (
                <View>
                  <Text style={styles.title}>Verify your email</Text>
                  <Text style={styles.subtitle}>
                    We sent a 4-digit code to your email. Enter it below to continue.
                  </Text>

                  <View style={styles.form}>
                    <View style={styles.otpInputWrapper}>
                      <TextInput
                        value={otpCode}
                        onChangeText={setOtpCode}
                        placeholder="Code"
                        maxLength={4}
                        keyboardType="number-pad"
                        style={[styles.input, styles.otpInput]}
                        placeholderTextColor={colors.textSoft}
                      />
                    </View>

                    <Pressable
                      onPress={handleVerifyOtp}
                      style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.buttonPressed,
                        otpCode.length < 4 && styles.buttonDisabled,
                      ]}
                      disabled={otpCode.length < 4}
                    >
                      <Text style={styles.primaryButtonText}>Verify email</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setStep(2)}
                      style={styles.wrongEmailBtn}
                    >
                      <Text style={styles.wrongEmailText}>
                        Wrong email? Send to different email
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Step 4: Password Strength Meter & Finish */}
              {step === 4 && (
                <View>
                  <Text style={styles.title}>Bikin Password</Text>
                  <Text style={styles.subtitle}>
                    Set a secure password for accessing your account.
                  </Text>

                  <View style={styles.form}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>{t("auth.password")}</Text>
                      <View style={[
                        styles.inputWrapper,
                        passwordFocused && styles.inputFocused,
                      ]}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.textSoft} style={styles.inputIcon} />
                        <TextInput
                          value={password}
                          onChangeText={setPassword}
                          placeholder={t("auth.passwordPlaceholder")}
                          placeholderTextColor={colors.textSoft}
                          secureTextEntry={!showPassword}
                          style={styles.textInput}
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => setPasswordFocused(false)}
                          editable={!submitting}
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

                    {/* Progress Bar Strength */}
                    {password.length > 0 && (
                      <View style={styles.strengthBarContainer}>
                        <View
                          style={[
                            styles.strengthBarFill,
                            {
                              width: `${(passwordStrength.score / 3) * 100}%`,
                              backgroundColor: passwordStrength.color,
                            },
                          ]}
                        />
                        <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                          {passwordStrength.label}
                        </Text>
                      </View>
                    )}

                    {/* Criteria Checklist */}
                    <View style={styles.criteriaContainer}>
                      <View style={styles.criteriaRow}>
                        <Ionicons
                          name={passwordCriteria.hasMinLength ? "checkmark-circle" : "close-circle"}
                          size={16}
                          color={passwordCriteria.hasMinLength ? colors.success : colors.textSoft}
                        />
                        <Text style={[styles.criteriaText, passwordCriteria.hasMinLength && styles.criteriaTextActive]}>
                          8 characters minimum
                        </Text>
                      </View>

                      <View style={styles.criteriaRow}>
                        <Ionicons
                          name={passwordCriteria.hasNumber ? "checkmark-circle" : "close-circle"}
                          size={16}
                          color={passwordCriteria.hasNumber ? colors.success : colors.textSoft}
                        />
                        <Text style={[styles.criteriaText, passwordCriteria.hasNumber && styles.criteriaTextActive]}>
                          a number
                        </Text>
                      </View>

                      <View style={styles.criteriaRow}>
                        <Ionicons
                          name={passwordCriteria.hasSymbol ? "checkmark-circle" : "close-circle"}
                          size={16}
                          color={passwordCriteria.hasSymbol ? colors.success : colors.textSoft}
                        />
                        <Text style={[styles.criteriaText, passwordCriteria.hasSymbol && styles.criteriaTextActive]}>
                          a symbol
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={handleFinalSubmit}
                      style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.buttonPressed,
                        (submitting || passwordStrength.score < 2) && styles.buttonDisabled,
                      ]}
                      disabled={submitting || passwordStrength.score < 2}
                    >
                      {submitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.primaryButtonText}>{t("onboarding.continue")}</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Login option in forms steps */}
              <View style={styles.formFooter}>
                <Text style={styles.alreadyAccountText}>{t("auth.alreadyHaveAccount")}</Text>
                <Link href={LOGIN_ROUTE} asChild>
                  <Pressable>
                    <Text style={styles.formFooterLink}> {t("auth.signIn")}</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        )}

        {/* Step 5: Success Registration Page */}
        {step === 5 && (
          <View style={styles.successContainer}>
            <View style={styles.successIconWrapper}>
              <View style={styles.successIconOuter}>
                <Ionicons name="sparkles" size={54} color={colors.primary} />
              </View>
            </View>

            <Text style={styles.successTitle}>{t("auth.successTitle")}</Text>
            
            <Text style={styles.successSubtitle}>
              {t("auth.successDesc")}
            </Text>

            <Pressable
              onPress={handleExploreApp}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
                { width: "100%", paddingHorizontal: 40 }
              ]}
            >
              <Text style={styles.primaryButtonText}>{t("auth.signIn")}</Text>
            </Pressable>

            <Text style={styles.legalText}>
              {t("auth.legalText")}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Light neutral background matching Wecare
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  welcomeContainer: {
    flex: 1,
    padding: 30,
    justifyContent: "space-between",
    minHeight: 600,
    alignItems: "center",
  },
  logoHeader: {
    alignItems: "center",
    marginVertical: 32,
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
  brandIconWrapperLarge: {
    width: 96,
    height: 96,
    borderRadius: 24,                            // Rounded square large
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 64,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 2,
  },
  logoTextLarge: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 4,
    marginTop: 12,
  },
  welcomeSubtitle: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    letterSpacing: 2,
  },
  welcomeBottom: {
    marginBottom: 60,
    width: "100%",
    paddingHorizontal: 16,
  },
  welcomeTextTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeTextDesc: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 36,
    textAlign: "center",
  },
  welcomeFooter: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  welcomeFooterText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  welcomeFooterLink: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  cardWrapper: {
    padding: 24,
  },
  formCard: {
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
  input: {
    backgroundColor: colors.surfaceMuted,          // Warm cream input bg
    borderWidth: 0,                                // No border by default
    borderRadius: radius.md,                       // 12px
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
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
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  otpInputWrapper: {
    alignItems: "center",
    marginVertical: 16,
  },
  otpInput: {
    width: 150,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 8,
    paddingHorizontal: 0,
    borderWidth: 2,
    borderColor: "rgba(196, 200, 188, 0.3)",
  },
  wrongEmailBtn: {
    alignItems: "center",
    marginTop: 12,
  },
  wrongEmailText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    textDecorationLine: "underline",
  },
  eyeButton: {
    padding: 8,
  },
  strengthBarContainer: {
    gap: 6,
    marginTop: 4,
  },
  strengthBarFill: {
    height: 6,
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
  },
  criteriaContainer: {
    gap: 8,
    marginVertical: 8,
  },
  criteriaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  criteriaText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
  criteriaTextActive: {
    color: colors.text,
    fontWeight: "700",
  },
  formFooter: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(196, 200, 188, 0.3)",
    paddingTop: 16,
  },
  alreadyAccountText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  formFooterLink: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  successContainer: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 550,
    backgroundColor: colors.background, // Light background matching Wecare
  },
  successIconWrapper: {
    marginBottom: 32,
  },
  successIconOuter: {
    width: 100,
    height: 100,
    borderRadius: 24,                            // Rounded square
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    lineHeight: 30,
  },
  successSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  legalText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 32,
  },
  onboardingContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    minHeight: 580,
    alignItems: "center",
  },
  onboardingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Glass-card effect
    borderRadius: radius.xl,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
    width: "100%",
  },
  onboardingIconOuter: {
    width: 96,
    height: 96,
    borderRadius: 24,                            // Rounded square
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  onboardingDesc: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
});
