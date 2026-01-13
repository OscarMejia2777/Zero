import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { deleteSession, getCurrentUser, type User } from "../db";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Initial session check
    const initAuth = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch (e) {
        console.error("[AuthProvider] Init error:", e);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup =
      segments.some((s) => s.includes("auth")) ||
      ["login", "register", "splash"].includes(segments[0]);

    console.log(
      "[AuthContext] segments:",
      segments,
      "inAuthGroup:",
      inAuthGroup,
      "user:",
      user?.email
    );

    if (!user && !inAuthGroup) {
      console.log("[AuthContext] Redirecting to login");
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      console.log("[AuthContext] Redirecting to home");
      router.replace("/(tabs)/home");
    }
  }, [user, loading, segments, router]);

  const signIn = async (u: User) => {
    setUser(u);
  };

  const signOut = async () => {
    await deleteSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
