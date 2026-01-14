import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { db } from "./client";
import { SESSION_KEY, type User } from "./types";

/**
 * Hashes a password using SHA-256
 */
export async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
}

/**
 * Registers a new user
 */
export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  recoveryQuestion: string,
  recoveryAnswer: string
): Promise<User | null> {
  try {
    const hashedPassword = await hashPassword(password);
    const hashedAnswer = await hashPassword(recoveryAnswer.toLowerCase().trim());
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName.trim();

    console.log("[DB] Attempting to insert user:", cleanEmail);

    try {
      const result = await db.runAsync(
        "INSERT INTO users (email, password_hash, full_name, recovery_question, recovery_answer_hash) VALUES (?, ?, ?, ?, ?)",
        [cleanEmail, hashedPassword, cleanName, recoveryQuestion, hashedAnswer]
      );

      console.log("[DB] Insert result:", result);

      if (result.changes > 0) {
        const userId = result.lastInsertRowId;
        console.log("[DB] Selecting new user with ID:", userId);
        const user = await db.getFirstAsync<User>(
          "SELECT * FROM users WHERE id = ?",
          [userId]
        );
        return user;
      }
    } catch (dbError: any) {
      console.error("[DB] Detailed error during insert:", dbError);
      // Fallback for some web drivers that might fail on result.changes check
      if (dbError.message && dbError.message.includes("Error finalizing statement")) {
        console.log("[DB] Caught finalization error, attempting to check if user was created anyway...");
        const user = await db.getFirstAsync<User>(
          "SELECT * FROM users WHERE email = ?",
          [cleanEmail]
        );
        if (user) return user;
      }
      throw dbError;
    }
    return null;
  } catch (error: any) {
    console.error("[Auth] Register error details:", {
      message: error.message,
      stack: error.stack,
      error
    });
    throw error;
  }
}

/**
 * Validates credentials and returns user if correct
 */
export async function validateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await db.getFirstAsync<User>(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase().trim()]
    );

    if (!user) return null;

    const hashedPassword = await hashPassword(password);
    if (user.password_hash === hashedPassword) {
      return user;
    }
    return null;
  } catch (error) {
    console.error("[Auth] Validation error:", error);
    return null;
  }
}

/**
 * Stores the user session locally
 */
export async function saveSession(userId: number) {
  if (Platform.OS === "web") {
    localStorage.setItem(SESSION_KEY, userId.toString());
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, userId.toString());
  }
}

/**
 * Retrieves the stored user session
 */
export async function getSession(): Promise<number | null> {
  let userIdStr: string | null = null;
  if (Platform.OS === "web") {
    userIdStr = localStorage.getItem(SESSION_KEY);
  } else {
    userIdStr = await SecureStore.getItemAsync(SESSION_KEY);
  }
  return userIdStr ? parseInt(userIdStr) : null;
}

/**
 * Retrieves full user data from session
 */
export async function getCurrentUser(): Promise<User | null> {
  const userId = await getSession();
  if (!userId) return null;

  return await db.getFirstAsync<User>("SELECT * FROM users WHERE id = ?", [userId]);
}

/**
 * Clears the user session
 */
export async function deleteSession() {
  if (Platform.OS === "web") {
    localStorage.removeItem(SESSION_KEY);
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

/**
 * Gets the recovery question for an email
 */
export async function getRecoveryQuestion(email: string): Promise<string | null> {
  const user = await db.getFirstAsync<User>(
    "SELECT recovery_question FROM users WHERE email = ?",
    [email.toLowerCase().trim()]
  );
  return user?.recovery_question || null;
}

/**
 * Resets password using security answer
 */
export async function resetPassword(
  email: string,
  answer: string,
  newPassword: string
): Promise<boolean> {
  const user = await db.getFirstAsync<User>(
    "SELECT * FROM users WHERE email = ?",
    [email.toLowerCase().trim()]
  );

  if (!user) return false;

  const hashedAnswer = await hashPassword(answer.toLowerCase().trim());
  if (user.recovery_answer_hash === hashedAnswer) {
    const newHashedPassword = await hashPassword(newPassword);
    await db.runAsync(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [newHashedPassword, user.id]
    );
    return true;
  }
  return false;
}
