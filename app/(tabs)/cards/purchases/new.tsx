import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Period = 3 | 6 | 12 | 24;

export default function AddPurchaseScreen() {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [amountText, setAmountText] = useState(""); // user typed
  const [period, setPeriod] = useState<Period>(12);

  // demo simple: método fijo
  const [paymentMethod, setPaymentMethod] = useState("Premium Card (....4421)");

  const amount = useMemo(() => {
    const n = Number(amountText.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [amountText]);

  const monthly = useMemo(() => {
    if (!amount || amount <= 0) return 0;
    return amount / period;
  }, [amount, period]);

  const canSubmit = useMemo(() => {
    return description.trim().length > 0 && amount > 0 && period > 0;
  }, [description, amount, period]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backBtn}
                hitSlop={12}
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color="rgba(60,150,255,0.95)"
                />
              </Pressable>

              <Text style={styles.headerTitle}>Add 0% Purchase</Text>

              <View style={{ width: 44 }} />
            </View>

            <View style={{ height: 18 }} />

            <Text style={styles.sectionLabel}>PURCHASE DETAILS</Text>

            <View style={{ height: 12 }} />

            {/* Description */}
            <View style={styles.pill}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Description (e.g. Laptop)"
                placeholderTextColor="rgba(255,255,255,0.18)"
                style={styles.input}
              />
            </View>

            <View style={{ height: 16 }} />

            {/* Total Amount row */}
            <View style={styles.pillRow}>
              <View style={styles.leftRow}>
                <View style={styles.moneyIcon}>
                  <MaterialCommunityIcons
                    name="cash"
                    size={18}
                    color="rgba(60,150,255,0.95)"
                  />
                </View>

                <TextInput
                  value={amountText}
                  onChangeText={setAmountText}
                  placeholder="Total Amount"
                  placeholderTextColor="rgba(255,255,255,0.18)"
                  keyboardType="numbers-and-punctuation"
                  style={[styles.input, { paddingVertical: 0 }]}
                />
              </View>

              <Text style={styles.usd}>USD</Text>
            </View>

            <View style={{ height: 22 }} />

            {/* Installment period */}
            <Text style={styles.sectionLabel}>INSTALLMENT PERIOD</Text>
            <View style={{ height: 12 }} />

            <View style={styles.segment}>
              <SegmentItem
                label="3m"
                active={period === 3}
                onPress={() => setPeriod(3)}
              />
              <SegmentItem
                label="6m"
                active={period === 6}
                onPress={() => setPeriod(6)}
              />
              <SegmentItem
                label="12m"
                active={period === 12}
                onPress={() => setPeriod(12)}
              />
              <SegmentItem
                label="24m"
                active={period === 24}
                onPress={() => setPeriod(24)}
              />
            </View>

            <View style={{ height: 22 }} />

            {/* Payment method */}
            <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
            <View style={{ height: 12 }} />

            <Pressable
              onPress={() => {
                // demo simple: alterna opciones
                setPaymentMethod((v) =>
                  v.includes("4421")
                    ? "Slate Digital (....9901)"
                    : "Premium Card (....4421)"
                );
              }}
              style={styles.pillRow}
            >
              <Text style={styles.pillValue}>{paymentMethod}</Text>
              <View style={styles.chevrons}>
                <Ionicons
                  name="chevron-up"
                  size={16}
                  color="rgba(255,255,255,0.55)"
                />
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color="rgba(255,255,255,0.55)"
                />
              </View>
            </Pressable>

            <View style={{ height: 20 }} />

            {/* Monthly payment card */}
            <View style={styles.monthlyCard}>
              <LinearGradient
                colors={[
                  "rgba(47,99,255,0.18)",
                  "rgba(255,255,255,0.06)",
                  "rgba(0,0,0,0)",
                ]}
                locations={[0, 0.55, 1]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.1, y: 0.0 }}
                end={{ x: 1, y: 1 }}
              />

              <Text style={styles.monthlyLabel}>MONTHLY PAYMENT</Text>
              <Text style={styles.monthlyAmount}>${monthly.toFixed(2)}</Text>

              <View style={styles.aprPill}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="rgba(60,150,255,0.95)"
                />
                <Text style={styles.aprText}>0% APR GUARANTEED</Text>
              </View>
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Bottom fixed button */}
          <View style={styles.bottom}>
            <Pressable
              disabled={!canSubmit}
              onPress={() => {
                // aquí luego guardarías en SQLite + generar el plan de pagos
                router.back();
              }}
              style={({ pressed }) => [
                styles.primaryBtn,
                !canSubmit && { opacity: 0.55 },
                pressed && canSubmit && { transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text style={styles.primaryText}>Add Purchase</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="rgba(255,255,255,0.95)"
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function SegmentItem({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segItem, active && styles.segActive]}
    >
      <Text style={[styles.segText, active && styles.segTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const BLUE = "#2F63FF";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05070A" },

  content: {
    paddingTop: Platform.OS === "ios" ? 54 : 22,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 18,
    fontWeight: "900",
  },

  sectionLabel: {
    color: "rgba(255,255,255,0.30)",
    letterSpacing: 2.5,
    fontSize: 12,
    fontWeight: "900",
  },

  pill: {
    height: 62,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  pillRow: {
    height: 62,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  moneyIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "rgba(47,99,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(47,99,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    color: "rgba(255,255,255,0.86)",
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: 14,
  },
  usd: {
    color: "rgba(255,255,255,0.65)",
    fontWeight: "900",
    letterSpacing: 1,
  },

  segment: {
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    padding: 6,
    gap: 8,
  },
  segItem: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  segActive: {
    backgroundColor: BLUE,
    shadowColor: BLUE,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  segText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 18,
    fontWeight: "900",
  },
  segTextActive: {
    color: "rgba(255,255,255,0.95)",
  },

  pillValue: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 18,
    fontWeight: "800",
  },
  chevrons: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  monthlyCard: {
    height: 170,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  monthlyLabel: {
    color: "rgba(60,150,255,0.55)",
    letterSpacing: 4,
    fontWeight: "900",
    fontSize: 12,
    marginBottom: 10,
  },
  monthlyAmount: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 56,
    fontWeight: "900",
    letterSpacing: -1,
  },
  aprPill: {
    marginTop: 14,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(47,99,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(47,99,255,0.22)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aprText: {
    color: "rgba(60,150,255,0.85)",
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 12,
  },

  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === "ios" ? 26 : 18,
    paddingTop: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  primaryBtn: {
    height: 70,
    borderRadius: 18,
    backgroundColor: "#2F63FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#2F63FF",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 14 },
  },
  primaryText: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 20,
    fontWeight: "900",
  },
});
