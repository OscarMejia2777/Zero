import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { registerUser, saveSession } from "../../db";

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [recoveryQuestion, setRecoveryQuestion] = useState("");
  const [recoveryAnswer, setRecoveryAnswer] = useState("");
  const [securePass, setSecurePass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const { signIn } = useAuth();

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length > 2 &&
      email.trim().includes("@") &&
      pass.length >= 6 &&
      confirm.length >= 6 &&
      pass === confirm &&
      recoveryQuestion.trim().length > 5 &&
      recoveryAnswer.trim().length > 1
    );
  }, [fullName, email, pass, confirm, recoveryQuestion, recoveryAnswer]);

  const handleRegister = async () => {
    if (!canSubmit) return;
    setLoading(true);

    try {
      setRegisterError(null);
      console.log("[Register] Starting registration for:", email);
      const user = await registerUser(
        email,
        pass,
        fullName,
        recoveryQuestion,
        recoveryAnswer
      );
      console.log("[Register] User result:", user ? "Success" : "Failed");

      if (user) {
        console.log("[Register] Saving session...");
        await saveSession(user.id);
        console.log("[Register] Session saved. Calling signIn...");
        signIn(user);
        // AuthProvider handles navigation
      } else {
        setRegisterError(
          "Could not create account. Email might be already in use."
        );
        Alert.alert(
          "Error",
          "Could not create account. Email might be already in use."
        );
      }
    } catch (err: any) {
      console.error("[Register] Error:", err);
      setRegisterError(
        err.message || "Something went wrong. Please try again."
      );
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button floating */}
          <View style={styles.topArea}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backCircle}
              hitSlop={12}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color="rgba(255,255,255,0.7)"
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Start tracking your 0% installments and{"\n"}save on fees today.
            </Text>

            <View style={{ height: 26 }} />

            <Text style={styles.label}>Full Name</Text>
            <InputPill
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              icon={
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="rgba(255,255,255,0.35)"
                />
              }
            />

            <View style={{ height: 18 }} />

            <Text style={styles.label}>Email Address</Text>
            <InputPill
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="rgba(255,255,255,0.35)"
                />
              }
            />

            <View style={{ height: 18 }} />

            <Text style={styles.label}>Password</Text>
            <InputPill
              value={pass}
              onChangeText={setPass}
              placeholder="••••••••"
              secureTextEntry={securePass}
              autoCapitalize="none"
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="rgba(255,255,255,0.35)"
                />
              }
              right={
                <Pressable
                  onPress={() => setSecurePass((s) => !s)}
                  hitSlop={10}
                  style={styles.rightBtn}
                >
                  <Ionicons
                    name={securePass ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color="rgba(255,255,255,0.45)"
                  />
                </Pressable>
              }
            />

            <View style={{ height: 18 }} />

            <Text style={styles.label}>Confirm Password</Text>
            <InputPill
              value={confirm}
              onChangeText={setConfirm}
              placeholder="••••••••"
              secureTextEntry={true}
              autoCapitalize="none"
              icon={
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={18}
                  color="rgba(255,255,255,0.35)"
                />
              }
            />

            <View style={{ height: 26 }} />
            <View
              style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
            />
            <View style={{ height: 26 }} />

            <Text style={styles.sectionTitle}>Account Recovery</Text>
            <Text style={styles.sectionSub}>
              In case you forget your password
            </Text>

            <View style={{ height: 16 }} />

            <Text style={styles.label}>Security Question</Text>
            <InputPill
              value={recoveryQuestion}
              onChangeText={setRecoveryQuestion}
              placeholder="e.g. name of your first pet?"
              icon={
                <Ionicons
                  name="help-circle-outline"
                  size={18}
                  color="rgba(255,255,255,0.35)"
                />
              }
            />

            <View style={{ height: 18 }} />

            <Text style={styles.label}>Security Answer</Text>
            <InputPill
              value={recoveryAnswer}
              onChangeText={setRecoveryAnswer}
              placeholder="Your answer..."
              secureTextEntry={true}
              autoCapitalize="none"
              icon={
                <Ionicons
                  name="key-outline"
                  size={18}
                  color="rgba(255,255,255,0.35)"
                />
              }
            />

            <View style={{ height: 28 }} />

            <Pressable
              disabled={!canSubmit || loading}
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.primaryBtn,
                (!canSubmit || loading) && { opacity: 0.55 },
                pressed &&
                  canSubmit &&
                  !loading && { transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text style={styles.primaryText}>
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </Pressable>

            {registerError && (
              <Text
                style={{
                  color: "#FF4D4D",
                  textAlign: "center",
                  marginTop: 12,
                  fontWeight: "600",
                }}
              >
                {registerError}
              </Text>
            )}

            <View style={{ height: 18 }} />

            <Text style={styles.legal}>
              By signing up, you agree to our{" "}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL("https://example.com/terms")}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL("https://example.com/privacy")}
              >
                Privacy Policy
              </Text>
            </Text>

            <View style={{ height: 34 }} />

            <View style={styles.bottomRow}>
              <Text style={styles.bottomMuted}>Already have an account? </Text>
              <Pressable onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.bottomLink}>Log In</Text>
              </Pressable>
            </View>
            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/** Input pill reutilizable */
function InputPill(props: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  right?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={styles.pill}>
      <View style={styles.leftIcon}>{props.icon}</View>

      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="rgba(255,255,255,0.18)"
        style={styles.pillInput}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        autoCapitalize={props.autoCapitalize}
        autoCorrect={false}
      />

      {props.right ? (
        <View style={styles.rightIcon}>{props.right}</View>
      ) : (
        <View style={styles.rightIcon} />
      )}
    </View>
  );
}

const BLUE = "#2F63FF";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05070A" },

  topArea: {
    paddingTop: Platform.OS === "ios" ? 54 : 22,
    paddingHorizontal: 18,
    paddingBottom: 6,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  sectionTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    marginBottom: 0,
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 10,
    color: "rgba(255,255,255,0.30)",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
  },

  label: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  pill: {
    height: 64,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  leftIcon: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  pillInput: {
    flex: 1,
    color: "rgba(255,255,255,0.86)",
    fontSize: 16,
    paddingVertical: 10,
  },
  rightIcon: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  rightBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtn: {
    height: 68,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BLUE,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
  primaryText: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 18,
    fontWeight: "900",
  },

  legal: {
    textAlign: "center",
    color: "rgba(255,255,255,0.22)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    paddingHorizontal: 12,
  },
  legalLink: {
    color: "rgba(47, 99, 255, 0.9)",
    fontWeight: "800",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomMuted: {
    color: "rgba(255,255,255,0.22)",
    fontSize: 18,
    fontWeight: "600",
  },
  bottomLink: {
    color: "rgba(47, 99, 255, 0.92)",
    fontSize: 18,
    fontWeight: "900",
  },
});
