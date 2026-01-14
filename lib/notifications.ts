import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getAllPayments } from "../db";

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

/**
 * Recalculates and schedules all upcoming payment reminders.
 * Should be called whenever a purchase is added or a payment is marked as paid.
 */
export async function syncPaymentNotifications() {
  try {
    // Attempt permission request if not granted
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }

    // Clear all existing scheduled notifications to avoid duplicates/stale data
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Fetch pending payments
    const pending = getAllPayments("pending");
    const now = new Date();
    
    // Schedule notifications for payments due in the future
    // Following user request: 7 days before due date
    for (const p of pending) {
      const dueDate = new Date(p.due_date);
      
      // Calculate trigger time (7 days before due date, at 9:00 AM)
      const triggerDate = new Date(dueDate);
      triggerDate.setDate(triggerDate.getDate() - 7);
      triggerDate.setHours(9, 0, 0, 0); 

      // Only schedule if the trigger is in the future
      if (triggerDate > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Próximo Pago: Zero",
            body: `Recordatorio: Tienes un pago de $${p.amount.toFixed(2)} en ${p.store} que vence en 7 días (${p.card_name}).`,
            data: { paymentId: p.id },
            sound: true,
          },
          trigger: triggerDate as any,
        });
      }
    }
    
    console.log(`[Notifications] Synced reminders for ${pending.length} pending payments`);
  } catch (error) {
    console.error("[Notifications] Failed to sync notifications:", error);
  }
}

export async function scheduleTestIn10s() {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Zero",
      body: "Recordatorio de prueba en 10 segundos.",
    },
    trigger: { 
      seconds: 10,
    } as any, // Cast to any to bypass strict type check if needed
  });
}
