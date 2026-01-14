import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { syncPaymentNotifications } from "../../lib/notifications";

export default function Profile() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const handleNotificationSetup = async () => {
    await syncPaymentNotifications();
    Alert.alert("Notifications", "System notifications synced.");
  };

  const handleSecurity = () => {
    Alert.alert("Security", "PIN management coming soon.");
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PROFILE</Text>
        </View>

        <View style={styles.userCard}>
          <LinearGradient
            colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.01)"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.avatar}>
            <LinearGradient
              colors={["#3E7BFF", "#2B56FF"]}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.full_name || "User"}
            </Text>
            <Text style={styles.userEmail} numberOfLines={2}>
              {user?.email}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>

          <Pressable style={styles.menuItem} onPress={handleSecurity}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="rgba(255,255,255,0.6)"
                />
              </View>
              <Text style={styles.menuText}>Security & PIN</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.2)"
            />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleNotificationSetup}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="rgba(255,255,255,0.6)"
                />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.2)"
            />
          </Pressable>
        </View>

        <View style={styles.spacer} />

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF4D4D" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.version}>Zero MVP v1.0.2</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05070A" },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 4,
    fontSize: 13,
    fontWeight: "700",
  },
  userCard: {
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
  },
  userInfo: {
    marginLeft: 20,
    flex: 1, // Allow text to take remaining space
  },
  userName: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 22,
    fontWeight: "800",
  },
  userEmail: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.2)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 16,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    flex: 1,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,77,77,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,77,77,0.15)",
    marginBottom: 20,
    gap: 10,
  },
  logoutText: {
    color: "#FF4D4D",
    fontSize: 16,
    fontWeight: "800",
  },
  version: {
    textAlign: "center",
    color: "rgba(255,255,255,0.15)",
    fontSize: 12,
    marginBottom: 30,
    fontWeight: "600",
  },
});
