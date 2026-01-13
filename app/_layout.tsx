import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { initDatabase, migrate } from "../db";
import {
  configureAndroidChannel,
  syncPaymentNotifications,
} from "../lib/notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [dbReady, setDbReady] = React.useState(false);

  // Initialize database and notifications on app start
  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        await migrate();
        console.log("[App] Database initialized successfully");
        setDbReady(true);

        configureAndroidChannel();
        syncPaymentNotifications();
      } catch (error) {
        console.error("[App] Initialization failed:", error);
      }
    };
    setup();
  }, []);

  if (!dbReady) {
    return null; // Keep splash screen visible until DB is ready
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
