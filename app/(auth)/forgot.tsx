import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import { getRecoveryQuestion, resetPassword } from "../../db";

export default function ForgotScreen() {
  const router = useRouter();

  const [step, setStep] = useState<"EMAIL" | "ANSWER" | "NEW_PASS">("EMAIL");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckEmail = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      const q = await getRecoveryQuestion(email);
      if (q) {
        setQuestion(q);
        setStep("ANSWER");
      } else {
        Alert.alert("Error", "No account found with this email.");
      }
    } catch (e) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAnswer = async () => {
    if (answer.length < 2) return;
    // We can't verify answer in isolation easily without trying a reset,
    // or we'd need a specific DB function.
    // For simpler flow, let's just move to next step,
    // and verify everything at the final step (reset).
    setStep("NEW_PASS");
  };

  const handleReset = async () => {
    if (newPass.length < 6) return;
    setLoading(true);
    try {
      const success = await resetPassword(email, answer, newPass);
      if (success) {
        Alert.alert("Success", "Password updated! You can now login.", [
          { text: "OK", onPress: () => router.replace("/(auth)/login") },
        ]);
      } else {
        Alert.alert("Error", "Incorrect security answer.");
        setStep("ANSWER"); // Go back
      }
    } catch (e) {
      Alert.alert("Error", "Could not update password.");
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
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topArea}>
            <Pressable onPress={() => router.back()} style={styles.backCircle}>
              <Ionicons
                name="chevron-back"
                size={22}
                color="rgba(255,255,255,0.7)"
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Password Recovery</Text>
            <Text style={styles.subtitle}>
              {step === "EMAIL"
                ? "Enter your email to find your account."
                : step === "ANSWER"
                ? "Answer your security question."
                : "Create a new password."}
            </Text>

            <View style={{ height: 40 }} />

            {step === "EMAIL" && (
              <>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#666"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>

                <View style={{ height: 24 }} />
                <Pressable
                  onPress={handleCheckEmail}
                  disabled={loading}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryText}>
                    {loading ? "Checking..." : "Continue"}
                  </Text>
                </Pressable>
              </>
            )}

            {step === "ANSWER" && (
              <>
                <View style={styles.questionBox}>
                  <Ionicons name="help-circle" size={24} color="#C9FF00" />
                  <Text style={styles.questionText}>{question}</Text>
                </View>

                <View style={{ height: 24 }} />

                <Text style={styles.label}>Your Answer</Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color="#666"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="Type your answer..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    secureTextEntry
                    style={styles.input}
                  />
                </View>

                <View style={{ height: 24 }} />
                <Pressable
                  onPress={handleVerifyAnswer}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryText}>Verify Answer</Text>
                </Pressable>
              </>
            )}

            {step === "NEW_PASS" && (
              <>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.inputWrap}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color="#666"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    value={newPass}
                    onChangeText={setNewPass}
                    placeholder="Min 6 characters"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    secureTextEntry
                    style={styles.input}
                  />
                </View>

                <View style={{ height: 24 }} />
                <Pressable
                  onPress={handleReset}
                  disabled={loading}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryText}>
                    {loading ? "Updating..." : "Reset Password"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

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
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.5)",
    fontSize: 16,
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrap: {
    height: 56,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    height: "100%",
  },
  primaryBtn: {
    height: 56,
    backgroundColor: "#C9FF00",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  questionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(201, 255, 0, 0.1)",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(201, 255, 0, 0.3)",
  },
  questionText: {
    color: "#C9FF00",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
});
