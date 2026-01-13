import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import {
  configureAndroidChannel,
  requestNotifPermission,
  scheduleTestIn10s,
} from "../../lib/notifications";

export default function Notifications() {
  const router = useRouter();

  const handleEnableNotifications = async () => {
    await configureAndroidChannel();

    const perm = await requestNotifPermission();
    if (perm.status !== "granted") {
      Alert.alert("Permiso denegado", "Puedes activarlo después en Ajustes.");
      router.replace("/(tabs)/home");
      return;
    }

    // prueba local (no requiere backend)
    await scheduleTestIn10s();

    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleEnableNotifications} style={styles.primaryBtn}>
        <Text style={styles.primaryText}>Enable Notifications</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
