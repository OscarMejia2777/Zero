import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
Button;

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  disabled,
  variant = "primary",
  style,
}: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        disabled && { opacity: 0.55 },
        pressed && !disabled && { transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: "#2F63FF" },
  secondary: { backgroundColor: "rgba(255,255,255,0.08)" },
  text: { color: "rgba(255,255,255,0.95)", fontSize: 18, fontWeight: "900" },
});
