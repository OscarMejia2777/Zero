import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
import { useAuth } from "../../context/AuthContext";
import {
  CARD_COLORS,
  createCard,
  getCardById,
  updateCard,
  type CardColor,
} from "../../db";

export default function AddNewCardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [cardName, setCardName] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [last4, setLast4] = useState<string>("");
  const [limit, setLimit] = useState<string>("");
  const [cutOffDay, setCutOffDay] = useState<string>("");
  const [paymentDay, setPaymentDay] = useState<string>("");
  const [color, setColor] = useState<CardColor>("blue");
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchCard = async () => {
        try {
          const card = await getCardById(parseInt(id as string));
          if (card) {
            setCardName(card.name);
            setBankName(card.bank_name);
            setLast4(card.last4);
            setLimit(card.credit_limit.toString());
            setCutOffDay(card.cut_off_day.toString());
            setPaymentDay(card.payment_day.toString());
            setColor(card.color);
          }
        } catch (error) {
          console.error("Error fetching card for edit:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCard();
    }
  }, [id, isEditing]);

  const limitNumber = useMemo(() => {
    const n = Number(limit.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [limit]);

  const canSubmit = useMemo(() => {
    const cutOff = parseInt(cutOffDay);
    const payDay = parseInt(paymentDay);
    return (
      cardName.trim().length > 0 &&
      bankName.trim().length > 0 &&
      last4.length === 4 &&
      limitNumber > 0 &&
      !isNaN(cutOff) &&
      cutOff >= 1 &&
      cutOff <= 31 &&
      !isNaN(payDay) &&
      payDay >= 1 &&
      payDay <= 31
    );
  }, [cardName, bankName, last4, limitNumber, cutOffDay, paymentDay]);

  const { user } = useAuth();

  const handleSave = async () => {
    if (!canSubmit || !user) return;

    try {
      if (isEditing) {
        await updateCard(parseInt(id as string), {
          name: cardName,
          bank_name: bankName,
          last4,
          credit_limit: limitNumber,
          cut_off_day: parseInt(cutOffDay),
          payment_day: parseInt(paymentDay),
          color,
        });
      } else {
        await createCard({
          user_id: user.id,
          name: cardName,
          bank_name: bankName,
          last4,
          credit_limit: limitNumber,
          cut_off_day: parseInt(cutOffDay),
          payment_day: parseInt(paymentDay),
          color,
        });
      }
      router.back();
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.root,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "white" }}>Loading card data...</Text>
      </View>
    );
  }

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
                size={20}
                color="rgba(60,150,255,0.95)"
              />
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            <Text style={styles.headerTitle}>
              {isEditing ? "Edit Card" : "Add New Card"}
            </Text>
            <View style={{ width: 70 }} />
          </View>

          <View style={{ height: 18 }} />

          <Text style={styles.pageTitle}>
            {isEditing ? "Edit Card" : "Card Details"}
          </Text>
          <Text style={styles.pageSub}>
            {isEditing
              ? "Update your card information below."
              : "Add your credit card info to monitor\ninstallments and stay fee-free."}
          </Text>

          <View style={{ height: 28 }} />

          <Text style={styles.label}>CARD NAME (E.G. PERSONAL VISA)</Text>
          <View style={styles.inputPill}>
            <TextInput
              value={cardName}
              onChangeText={setCardName}
              placeholder="My Primary Card"
              placeholderTextColor="rgba(255,255,255,0.18)"
              style={styles.textInput}
            />
          </View>

          <View style={{ height: 18 }} />

          <Text style={styles.label}>BANK NAME</Text>
          <View style={styles.inputPill}>
            <TextInput
              value={bankName}
              onChangeText={setBankName}
              placeholder="Chase, BBVA, etc."
              placeholderTextColor="rgba(255,255,255,0.18)"
              style={styles.textInput}
            />
          </View>

          <View style={{ height: 18 }} />

          <Text style={styles.label}>LAST 4 DIGITS</Text>
          <View style={styles.inputPill}>
            <TextInput
              value={last4}
              onChangeText={(t) =>
                setLast4(t.replace(/[^\d]/g, "").slice(0, 4))
              }
              placeholder="••••"
              placeholderTextColor="rgba(255,255,255,0.18)"
              keyboardType="number-pad"
              style={styles.textInput}
            />
          </View>

          <View style={{ height: 18 }} />

          <Text style={styles.label}>CREDIT LIMIT</Text>
          <View style={styles.inputPill}>
            <TextInput
              value={limit}
              onChangeText={setLimit}
              placeholder="$ 10,000"
              placeholderTextColor="rgba(255,255,255,0.18)"
              keyboardType="numeric"
              style={styles.textInput}
            />
          </View>

          <View style={{ height: 18 }} />

          <View style={{ flexDirection: "row", gap: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>CUT-OFF DAY</Text>
              <View style={styles.inputPill}>
                <TextInput
                  value={cutOffDay}
                  onChangeText={(t) =>
                    setCutOffDay(t.replace(/[^\d]/g, "").slice(0, 2))
                  }
                  placeholder="1-31"
                  placeholderTextColor="rgba(255,255,255,0.18)"
                  keyboardType="number-pad"
                  style={styles.textInput}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>PAYMENT DAY</Text>
              <View style={styles.inputPill}>
                <TextInput
                  value={paymentDay}
                  onChangeText={(t) =>
                    setPaymentDay(t.replace(/[^\d]/g, "").slice(0, 2))
                  }
                  placeholder="1-31"
                  placeholderTextColor="rgba(255,255,255,0.18)"
                  keyboardType="number-pad"
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>
          <Text style={styles.helper}>
            We&apos;ll alert you 7 days before the payment day.
          </Text>

          <View style={{ height: 22 }} />

          <Text style={styles.label}>CARD COLOR</Text>
          <View style={styles.colorRow}>
            {CARD_COLORS.map((c) => (
              <Pressable
                key={c.value}
                onPress={() => setColor(c.value)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c.hex },
                  color === c.value && styles.colorCircleActive,
                ]}
              />
            ))}
          </View>

          <View style={{ height: 28 }} />

          {/* Preview card */}
          <View
            style={[
              styles.previewWrap,
              {
                borderColor:
                  CARD_COLORS.find((c) => c.value === color)?.hex + "40",
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <LinearGradient
              colors={[
                (CARD_COLORS.find((c) => c.value === color)?.hex || "#40FFC5") +
                  "20",
                "rgba(0,0,0,0)",
              ]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            <View style={styles.previewTop}>
              <Text style={styles.previewLabel}>{bankName || "BANK NAME"}</Text>
              <View style={styles.previewWifi}>
                <Ionicons
                  name="wifi"
                  size={16}
                  color="rgba(255,255,255,0.45)"
                />
              </View>
            </View>

            <View style={styles.previewChipRow}>
              <View
                style={[
                  styles.chip,
                  {
                    backgroundColor: CARD_COLORS.find((c) => c.value === color)
                      ?.hex,
                  },
                ]}
              />
            </View>

            <Text style={styles.previewDots}>
              • • • • • • • • • • • • {last4 || "0000"}
            </Text>

            <View style={styles.previewBottom}>
              <View>
                <Text style={styles.previewSmall}>CARD NAME</Text>
                <Text style={styles.previewBig}>{cardName || "MY CARD"}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.previewSmall}>LIMIT</Text>
                <Text
                  style={[
                    styles.previewLimit,
                    { color: CARD_COLORS.find((c) => c.value === color)?.hex },
                  ]}
                >
                  ${limitNumber.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 22 }} />

          <Pressable
            disabled={!canSubmit}
            onPress={handleSave}
            style={({ pressed }) => [
              styles.primaryBtn,
              !canSubmit && { opacity: 0.55 },
              pressed && canSubmit && { transform: [{ scale: 0.99 }] },
              {
                backgroundColor: canSubmit
                  ? CARD_COLORS.find((c) => c.value === color)?.hex || "#0B78FF"
                  : "#333",
              },
            ]}
          >
            <Text
              style={[
                styles.primaryText,
                {
                  color:
                    color === "gold" || color === "green" ? "#000" : "#fff",
                },
              ]}
            >
              {isEditing ? "Save Changes" : "Add New Card"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={styles.cancelBtn}
            hitSlop={10}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05070A" },

  content: {
    paddingTop: Platform.OS === "ios" ? 54 : 22,
    paddingHorizontal: 18,
    paddingBottom: 34,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backText: {
    color: "rgba(60,150,255,0.95)",
    fontWeight: "800",
    fontSize: 16,
  },
  headerTitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 18,
    fontWeight: "900",
  },

  pageTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  pageSub: {
    marginTop: 10,
    color: "rgba(255,255,255,0.28)",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
  },

  label: {
    color: "rgba(255,255,255,0.30)",
    letterSpacing: 2.5,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
  },

  inputPill: {
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
  pillValue: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 16,
    fontWeight: "700",
  },
  textInput: {
    flex: 1,
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 10,
  },
  rightIcon: {
    width: 40,
    alignItems: "flex-end",
  },

  bankBadge: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "rgba(220,170,80,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 6,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleActive: {
    borderColor: "#fff",
  },

  helper: {
    marginTop: 10,
    color: "rgba(255,255,255,0.18)",
    fontSize: 13,
    fontWeight: "600",
    fontStyle: "italic",
  },

  previewWrap: {
    height: 190,
    borderRadius: 26,
    overflow: "hidden",
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  previewTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewLabel: {
    color: "rgba(255,255,255,0.22)",
    letterSpacing: 3,
    fontSize: 11,
    fontWeight: "900",
  },
  previewWifi: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewChipRow: {
    marginTop: 18,
  },
  chip: {
    width: 44,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(210,170,60,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  previewDots: {
    marginTop: 22,
    color: "rgba(255,255,255,0.55)",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 4,
  },
  previewBottom: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  previewSmall: {
    color: "rgba(255,255,255,0.18)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "900",
  },
  previewBig: {
    marginTop: 6,
    color: "rgba(255,255,255,0.86)",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
  previewLimit: {
    marginTop: 6,
    color: "rgba(60,150,255,0.95)",
    fontSize: 18,
    fontWeight: "900",
  },

  primaryBtn: {
    height: 68,
    borderRadius: 18,
    backgroundColor: "#0B78FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0B78FF",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 14 },
  },
  primaryText: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 18,
    fontWeight: "900",
  },

  cancelBtn: {
    marginTop: 18,
    alignItems: "center",
  },
  cancelText: {
    color: "rgba(255,255,255,0.30)",
    fontSize: 16,
    fontWeight: "700",
  },
});
