import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function configureAndroidChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
  });
}

export async function requestNotifPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === "granted") return current;

  return Notifications.requestPermissionsAsync();
}

export async function scheduleTestIn10s() {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Zero",
      body: "Recordatorio de prueba en 10 segundos.",
    },
    trigger: { seconds: 10 },
  });
}
