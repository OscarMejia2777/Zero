import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { updateUserPassword, validateUser } from "../../db";

export default function SecurityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (newPass.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    if (!user?.email) return;

    setLoading(true);
    try {
      // 1. Validate old password
      const valid = await validateUser(user.email, currentPass);
      if (!valid) {
        Alert.alert("Error", "Current password is incorrect.");
        setLoading(false);
        return;
      }

      // 2. Update password
      const success = await updateUserPassword(user.id, newPass);
      if (success) {
        Alert.alert("Success", "Password updated successfully.");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update password. Try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>SECURITY</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.label}>CHANGE PASSWORD</Text>
        <Text style={styles.subLabel}>
          Enter your current password to set a new one.
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CURRENT PASSWORD</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="••••••"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={currentPass}
              onChangeText={setCurrentPass}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NEW PASSWORD</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="••••••"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={newPass}
              onChangeText={setNewPass}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="••••••"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={confirmPass}
              onChangeText={setConfirmPass}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              pressed && { opacity: 0.9 },
            ]}
            onPress={loading ? undefined : handleChangePassword}
          >
            {loading ? (
              <ActivityIndicator color="#0B0F10" />
            ) : (
              <Text style={styles.saveText}>UPDATE PASSWORD</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05070A" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  label: {
    color: "#C9FF00",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  subLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 20,
  },
  form: { gap: 24 },
  inputGroup: { gap: 10 },
  inputLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    color: "#FFF",
    fontSize: 16,
  },
  saveBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#C9FF00",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#0B0F10",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
