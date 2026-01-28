import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { initDatabase, migrate } from "../db";
import {
  configureAndroidChannel,
  syncPaymentNotifications,
} from "../lib/notifications";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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

  const onLayoutRootView = useCallback(async () => {
    if (dbReady) {
      // This tells the native splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [dbReady]);

  if (!dbReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
