import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { CARD_COLORS, deleteCard, getAllCards, type Card } from "../../db";

export default function CardsScreen() {
  const router = useRouter();
  const [cards, setCards] = React.useState<Card[]>([]);

  const { user } = useAuth();

  const fetchCards = React.useCallback(async () => {
    if (!user) return;
    try {
      const fetched = await getAllCards(user.id);
      setCards(fetched);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCards();
    }, [fetchCards])
  );

  const handleDelete = (id: number) => {
    const performDelete = async () => {
      try {
        await deleteCard(id);
        await fetchCards();
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    };

    if (Platform.OS === "web") {
      if (confirm("¿Eliminar esta tarjeta? Se borrarán también sus compras.")) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Eliminar Tarjeta",
        "¿Estás seguro? Se borrarán todas las compras vinculadas.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: performDelete },
        ]
      );
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <FlatList
        data={cards}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        ListHeaderComponent={
          <>
            {/* Top bar */}
            <View style={styles.topBar}>
              <View style={{ width: 44 }} />
              <Text style={styles.title}>My Cards</Text>
              <Pressable
                onPress={() => router.push("/cards/new")}
                style={styles.addBtn}
                hitSlop={12}
              >
                <Ionicons name="add" size={28} color="#C9FF00" />
              </Pressable>
            </View>

            <View style={styles.divider} />
            <View style={{ height: 18 }} />
          </>
        }
        renderItem={({ item }) => (
          <CardVisual
            item={item}
            onDelete={() => handleDelete(item.id)}
            onPress={() =>
              router.push({
                pathname: "/cards/new",
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No has agregado tarjetas aún.</Text>
            <Pressable onPress={() => router.push("/cards/new")}>
              <Text style={styles.emptyLink}>Agregar mi primera tarjeta</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <>
            <View style={{ height: 18 }} />
            <InfoBox />
            <View style={{ height: 24 }} />
          </>
        }
      />
    </View>
  );
}

function CardVisual({
  item,
  onDelete,
  onPress,
}: {
  item: Card;
  onDelete: () => void;
  onPress: () => void;
}) {
  const accent = getAccent(item.color);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardWrap,
        { shadowColor: accent.glow },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {/* glow */}
      <View style={[styles.cardGlow, { backgroundColor: accent.glowSoft }]} />

      {/* card */}
      <View style={[styles.card, { borderColor: accent.border }]}>
        <LinearGradient
          colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.02)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={[accent.overlayA, "rgba(0,0,0,0)", accent.overlayB]}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.0, y: 0.15 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.cardTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTier, { color: accent.label }]}>
              {item.bank_name.toUpperCase()}
            </Text>
            <Text style={styles.cardName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>

          <Pressable onPress={onDelete} style={styles.deleteBtn}>
            <Ionicons
              name="trash-outline"
              size={20}
              color="rgba(255,100,100,0.6)"
            />
          </Pressable>
        </View>

        <View style={styles.cardMidRow}>
          <View style={styles.chip} />

          <View style={styles.numberBlock}>
            <Text style={styles.dots}>• • • •</Text>
            <Text style={styles.last4}>{item.last4}</Text>
          </View>

          <View style={styles.activeRow}>
            <View
              style={[styles.activeDot, { backgroundColor: accent.value }]}
            />
            <Text style={styles.activeText}>
              CIERRE: DÍA {item.cut_off_day}
            </Text>
          </View>
        </View>

        <View style={styles.cardBottomRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.limitLabel}>PAGO: DÍA {item.payment_day}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.limitLabel}>CREDIT LIMIT</Text>
            <Text style={[styles.limitValue, { color: accent.value }]}>
              ${item.credit_limit.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function InfoBox() {
  return (
    <View style={styles.infoBox}>
      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.infoLeft}>
        <View style={styles.shield}>
          <Ionicons
            name="shield-checkmark"
            size={18}
            color="rgba(64, 255, 197, 0.9)"
          />
        </View>
        <Text style={styles.infoText}>
          Your card details are encrypted and{"\n"}
          stored locally. Zero never shares{"\n"}
          your sensitive financial data with{"\n"}
          third parties.
        </Text>
      </View>
    </View>
  );
}

function getAccent(colorName: string) {
  const config =
    CARD_COLORS.find((c) => c.value === colorName) || CARD_COLORS[2]; // Default blue
  const hex = config.hex;

  return {
    label: hex + "A0",
    value: hex,
    border: hex + "30",
    glow: hex + "80",
    glowSoft: hex + "1A",
    overlayA: hex + "29",
    overlayB: hex + "0F",
  };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05070A" },

  content: {
    paddingTop: Platform.OS === "ios" ? 54 : 22,
    paddingHorizontal: 18,
    paddingBottom: 110,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  addBtn: {
    width: 44,
    height: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontWeight: "900",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  cardWrap: {
    borderRadius: 28,
    shadowOpacity: 0.35,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 18 },
  },
  cardGlow: {
    position: "absolute",
    left: -6,
    right: -6,
    top: -6,
    bottom: -6,
    borderRadius: 34,
  },

  card: {
    height: 210,
    borderRadius: 28,
    overflow: "hidden",
    padding: 18,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0)",
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTier: {
    letterSpacing: 3,
    fontSize: 12,
    fontWeight: "900",
  },
  cardName: {
    marginTop: 8,
    color: "rgba(255,255,255,0.92)",
    fontSize: 26,
    fontWeight: "900",
  },

  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,100,100,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.15)",
  },

  cardMidRow: {
    marginTop: 22,
    flex: 1,
    justifyContent: "flex-end",
  },

  chip: {
    width: 44,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(210,170,60,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  numberBlock: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dots: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
  },
  last4: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 6,
  },

  activeRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  activeText: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 10,
  },

  cardBottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 10,
  },
  limitLabel: {
    color: "rgba(255,255,255,0.22)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "900",
  },
  limitValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
  },

  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyLink: {
    marginTop: 12,
    color: "#40FFC5",
    fontSize: 16,
    fontWeight: "800",
  },

  infoBox: {
    height: 128,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  infoLeft: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  shield: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(64,255,197,0.10)",
    borderWidth: 1,
    borderColor: "rgba(64,255,197,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    color: "rgba(255,255,255,0.30)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});
