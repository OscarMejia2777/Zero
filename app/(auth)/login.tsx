import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0;
  }, [email, password]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color="rgba(255,255,255,0.75)"
          />
        </Pressable>

        <Text style={styles.headerTitle}>SECURE LOGIN</Text>

        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* App icon */}
        <View style={styles.appIcon}>
          <LinearGradient
            colors={["#3E7BFF", "#2B56FF", "#2C6BFF"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.1, y: 0.0 }}
            end={{ x: 0.9, y: 1 }}
          />
          <View style={styles.appIconInner}>
            <View style={styles.iconCard} />
            <View style={styles.iconDot} />
          </View>
        </View>

        <Text style={styles.title}>Welcome to Zero</Text>
        <Text style={styles.subtitle}>
          Manage your 0% installments and avoid{"\n"}hidden fees effortlessly.
        </Text>

        {/* Form */}
        <View style={{ height: 22 }} />

        <Text style={styles.label}>EMAIL ADDRESS</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            placeholderTextColor="rgba(255,255,255,0.20)"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>

        <View style={{ height: 18 }} />

        <View style={styles.passwordRow}>
          <Text style={styles.label}>PASSWORD</Text>
          <Pressable onPress={() => {}} hitSlop={10}>
            <Text style={styles.forgot}>Forgot?</Text>
          </Pressable>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.20)"
            secureTextEntry={secure}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <Pressable
            onPress={() => setSecure((s) => !s)}
            hitSlop={10}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={secure ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="rgba(255,255,255,0.45)"
            />
          </Pressable>
        </View>

        <View style={{ height: 22 }} />

        <Pressable
          onPress={() => {}}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.signInBtn,
            !canSubmit && { opacity: 0.55 },
            pressed && canSubmit && { transform: [{ scale: 0.99 }] },
          ]}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </Pressable>

        {/* Secure access */}
        <View style={{ height: 26 }} />

        <View style={styles.secureAccessRow}>
          <View style={styles.line} />
          <Text style={styles.secureAccessText}>SECURE ACCESS</Text>
          <View style={styles.line} />
        </View>

        <View style={{ height: 16 }} />

        <View style={styles.quickRow}>
          <Pressable style={styles.quickBtn} onPress={() => {}}>
            <MaterialCommunityIcons
              name="face-recognition"
              size={26}
              color="rgba(255,255,255,0.78)"
            />
          </Pressable>

          <Pressable style={styles.quickBtn} onPress={() => {}}>
            <Ionicons
              name="finger-print"
              size={26}
              color="rgba(255,255,255,0.78)"
            />
          </Pressable>
        </View>

        <View style={{ height: 20 }} />

        <View style={styles.createRow}>
          <Text style={styles.createMuted}>New to Zero? </Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.createLink}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const BLUE = "#2F63FF";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05070A" },

  header: {
    paddingTop: Platform.OS === "ios" ? 54 : 22,
    paddingHorizontal: 18,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    color: "rgba(255,255,255,0.38)",
    letterSpacing: 3,
    fontSize: 13,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
  },

  appIcon: {
    width: 86,
    height: 86,
    borderRadius: 24,
    alignSelf: "center",
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  appIconInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCard: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  iconDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: BLUE,
    transform: [{ translateX: 6 }, { translateY: 4 }],
  },

  title: {
    textAlign: "center",
    color: "rgba(255,255,255,0.92)",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "rgba(255,255,255,0.33)",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
  },

  label: {
    color: "rgba(255,255,255,0.42)",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },

  inputWrap: {
    height: 62,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  forgot: {
    color: "rgba(47, 99, 255, 0.9)",
    fontSize: 14,
    fontWeight: "700",
  },

  signInBtn: {
    height: 64,
    borderRadius: 20,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BLUE,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  signInText: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 18,
    fontWeight: "800",
  },

  secureAccessRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  secureAccessText: {
    color: "rgba(255,255,255,0.25)",
    letterSpacing: 3,
    fontSize: 12,
    fontWeight: "700",
  },

  quickRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  quickBtn: {
    width: 86,
    height: 72,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  createRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  createMuted: {
    color: "rgba(255,255,255,0.24)",
    fontSize: 16,
    fontWeight: "600",
  },
  createLink: {
    color: "rgba(47, 99, 255, 0.92)",
    fontSize: 18,
    fontWeight: "900",
  },
});
