import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export default function SplashScreenZero() {
  const spin = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  const [progress, setProgress] = useState(0.32); // ~32% como la imagen

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(ring, {
      toValue: 1,
      duration: 1600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [spin, ring]);

  const spinInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const ringOpacity = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });

  const filledWidth = useMemo(
    () => Math.max(0, Math.min(1, progress)),
    [progress]
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#05070A", "#05070A", "#070C12"]}
        locations={[0, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.center}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          {/* Outer ring */}
          <Animated.View style={[styles.ring, { opacity: ringOpacity }]} />

          {/* Progress arc (simple "stroke" using a border segment) */}
          <View style={styles.arcWrap}>
            <View style={styles.arcBase} />
            <View style={styles.arcGlow} />
          </View>

          {/* Inner diamond + dot */}
          <View style={styles.inner}>
            <View style={styles.diamond} />
            <View style={styles.dot} />
          </View>
        </View>

        <Text style={styles.title}>Zero</Text>
        <Text style={styles.subtitle}>PREMIUM INSTALLMENT TRACKER</Text>
      </View>

      {/* Bottom loading */}
      <View style={styles.bottom}>
        <Animated.View
          style={[
            styles.spinner,
            {
              transform: [{ rotate: spinInterpolate }],
            },
          ]}
        />

        <Text style={styles.secText}>SECURING YOUR FINANCES</Text>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${filledWidth * 100}%` }]}
          />
        </View>
      </View>
    </View>
  );
}

const ACCENT = "#19E6F2";
const ACCENT_DIM = "rgba(25, 230, 242, 0.25)";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05070A",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logoWrap: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  ring: {
    position: "absolute",
    width: 138,
    height: 138,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.08)",
  },

  arcWrap: {
    position: "absolute",
    width: 138,
    height: 138,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  // arco “fake”: un borde que simula el segmento iluminado (arriba-izquierda)
  arcBase: {
    position: "absolute",
    width: 138,
    height: 138,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: ACCENT,
    borderLeftColor: ACCENT,
    transform: [{ rotate: "-25deg" }],
    opacity: 0.9,
  },
  arcGlow: {
    position: "absolute",
    width: 138,
    height: 138,
    borderRadius: 999,
    borderWidth: 10,
    borderColor: "transparent",
    borderTopColor: ACCENT_DIM,
    borderLeftColor: ACCENT_DIM,
    transform: [{ rotate: "-25deg" }],
  },

  inner: {
    width: 86,
    height: 86,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  diamond: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT,
    transform: [{ rotate: "45deg" }],
    shadowColor: ACCENT,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  dot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOpacity: 0.55,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },

  title: {
    fontSize: 46,
    letterSpacing: -0.5,
    color: "#EAF2F7",
    fontWeight: "700",
    marginTop: 2,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    letterSpacing: 6,
    color: "rgba(25, 230, 242, 0.65)",
    fontWeight: "600",
  },

  bottom: {
    paddingBottom: 34,
    paddingHorizontal: 28,
    alignItems: "center",
  },

  spinner: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    borderTopColor: ACCENT,
    marginBottom: 14,
  },

  secText: {
    fontSize: 11,
    letterSpacing: 4,
    color: "rgba(255,255,255,0.22)",
    marginBottom: 14,
  },

  progressTrack: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "rgba(25, 230, 242, 0.75)",
    borderRadius: 999,
  },
});
