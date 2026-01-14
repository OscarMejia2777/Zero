import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useEffect, useState } from "react";
import { AppState, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function UnlockScreen() {
  const { user, unlockApp, signOut } = useAuth();
  const [status, setStatus] = useState("Waiting for access...");
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  // Also retry when app comes to foreground if stuck
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        checkBiometrics();
      }
    });
    return () => sub.remove();
  }, []);

  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      setHasBiometrics(true);
      authenticate();
    } else {
      setHasBiometrics(false);
      // If no biometrics, we shouldn't really lock,
      // but if we are here, just let them in or ask for password?
      // For this MVP, if no biometrics, just unlock (or maybe we shouldn't have locked).
      // But let's assume secure device. If not secure, just button to enter.
      setStatus("Device not secure. Tap to unlock.");
    }
  };

  const authenticate = async () => {
    setStatus("Scanning...");
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Zero",
        fallbackLabel: "Log Out",
        disableDeviceFallback: false,
      });

      if (result.success) {
        unlockApp();
      } else {
        setStatus("Authentication failed. Try again.");
      }
    } catch (e) {
      console.log(e);
      setStatus("Error during authentication.");
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="finger-print" size={48} color="#C9FF00" />
        </View>

        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.username}>{user?.full_name || "User"}</Text>

        <View style={{ height: 40 }} />

        {hasBiometrics ? (
          <Pressable style={styles.scanBtn} onPress={authenticate}>
            <Text style={styles.scanText}>
              Tap to Scan FaceID / Fingerprint
            </Text>
          </Pressable>
        ) : (
          <Pressable style={styles.scanBtn} onPress={unlockApp}>
            <Text style={styles.scanText}>Enter App</Text>
          </Pressable>
        )}

        <Text style={styles.status}>{status}</Text>

        <View style={{ height: 60 }} />

        <Pressable onPress={signOut} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05070A",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { alignItems: "center", width: "100%", paddingHorizontal: 30 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(201, 255, 0, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(201, 255, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  welcome: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 16,
    marginBottom: 8,
  },
  username: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  scanBtn: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "#C9FF00",
    borderRadius: 999,
  },
  scanText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  status: {
    marginTop: 20,
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },
  logoutBtn: {
    padding: 12,
  },
  logoutText: {
    color: "#FF4D4D",
    fontSize: 15,
    fontWeight: "600",
  },
});
