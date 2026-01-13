import { useRouter, useSegments } from "expo-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import { deleteSession, getCurrentUser, type User } from "../db";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLocked: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
  unlockApp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Initial session check
    const initAuth = async () => {
      try {
        const u = await getCurrentUser();
        if (u) {
          setUser(u);
          setIsLocked(true); // Always lock on cold start if user exists
        }
      } catch (e) {
        console.error("[AuthProvider] Init error:", e);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // background lock listener
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        if (user) setIsLocked(true);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup =
      segments.some((s) => s.includes("auth")) ||
      ["login", "register", "forgot", "splash"].includes(segments[0]);

    // Check if we are specifically on the unlock screen inside auth group
    const isUnlockScreen = (segments as string[]).some((s) => s === "unlock");

    if (!user && !inAuthGroup) {
      console.log("[AuthContext] Redirecting to login");
      router.replace("/(auth)/login");
    } else if (user) {
      if (isLocked) {
        if (!isUnlockScreen) {
          console.log("[AuthContext] App locked. Redirecting to unlock");
          router.replace("/(auth)/unlock" as any);
        }
      } else if (inAuthGroup) {
        console.log("[AuthContext] Redirecting to home");
        router.replace("/(tabs)/home");
      }
    }
  }, [user, loading, isLocked, segments, router]);

  const signIn = async (u: User) => {
    setUser(u);
    setIsLocked(false);
  };

  const unlockApp = () => {
    setIsLocked(false);
    router.replace("/(tabs)/home");
  };

  const signOut = async () => {
    await deleteSession();
    setUser(null);
    setIsLocked(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isLocked, signIn, signOut, unlockApp }}
    >
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
