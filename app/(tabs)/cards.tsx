import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CardItem = {
  id: string;
  tier: string;
  name: string;
  last4: string;
  owner?: string;
  exp?: string;
  limit: string;
  accent: "green" | "purple" | "blue";
  brandRightIcon?: React.ComponentProps<typeof Ionicons>["name"];
  chip?: boolean;
  activeDot?: boolean;
  subline?: string; // e.g. ACTIVE
};

const CARDS: CardItem[] = [
  {
    id: "1",
    tier: "PREMIUM CREDIT",
    name: "Carbon Prime",
    last4: "8824",
    owner: "ALEXANDER VAUGHN",
    limit: "$25,000",
    accent: "green",
    brandRightIcon: "moon",
    chip: true,
  },
  {
    id: "2",
    tier: "EXECUTIVE",
    name: "Obsidian Card",
    last4: "5102",
    exp: "09 / 28",
    limit: "$12,500",
    accent: "purple",
    brandRightIcon: "radio-button-on",
  },
  {
    id: "3",
    tier: "EVERYDAY",
    name: "Slate Digital",
    last4: "9901",
    limit: "$8,000",
    accent: "blue",
    activeDot: true,
    subline: "ACTIVE",
    brandRightIcon: "calculator",
  },
];

export default function CardsScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <FlatList
        data={CARDS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        ListHeaderComponent={
          <>
            {/* Top bar */}
            <View style={styles.topBar}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backCircle}
                hitSlop={12}
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color="rgba(255,255,255,0.7)"
                />
              </Pressable>

              <Text style={styles.title}>My Cards</Text>

              <Pressable
                onPress={() => router.push("/(tabs)/cards/new")}
                style={({ pressed }) => [
                  styles.addBtn,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color="rgba(64, 255, 197, 0.95)"
                />
                <Text style={styles.addText}>ADD</Text>
              </Pressable>
            </View>

            <View style={styles.divider} />
            <View style={{ height: 18 }} />
          </>
        }
        renderItem={({ item }) => <CardVisual item={item} />}
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

function CardVisual({ item }: { item: CardItem }) {
  const accent = getAccent(item.accent);

  return (
    <View style={[styles.cardWrap, { shadowColor: accent.glow }]}>
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
          <View>
            <Text style={[styles.cardTier, { color: accent.label }]}>
              {item.tier}
            </Text>
            <Text style={styles.cardName}>{item.name}</Text>
          </View>

          {item.brandRightIcon ? (
            <View style={styles.brandIcon}>
              <Ionicons
                name={item.brandRightIcon}
                size={18}
                color="rgba(255,255,255,0.65)"
              />
            </View>
          ) : (
            <View style={styles.brandIcon} />
          )}
        </View>

        <View style={styles.cardMidRow}>
          {item.chip ? (
            <View style={styles.chip} />
          ) : (
            <View style={{ width: 44, height: 34 }} />
          )}

          <View style={styles.numberBlock}>
            <Text style={styles.dots}>• • • •</Text>
            <Text style={styles.last4}>{item.last4}</Text>
          </View>

          {!!item.owner && <Text style={styles.owner}>{item.owner}</Text>}
          {!!item.exp && <Text style={styles.exp}>{item.exp}</Text>}

          {item.activeDot || item.subline ? (
            <View style={styles.activeRow}>
              {item.activeDot ? <View style={styles.activeDot} /> : null}
              {item.subline ? (
                <Text style={styles.activeText}>{item.subline}</Text>
              ) : null}
            </View>
          ) : null}
        </View>

        <View style={styles.cardBottomRow}>
          <View style={{ flex: 1 }} />

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.limitLabel}>CREDIT LIMIT</Text>
            <Text style={[styles.limitValue, { color: accent.value }]}>
              {item.limit}
            </Text>
          </View>
        </View>
      </View>
    </View>
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

function getAccent(kind: CardItem["accent"]) {
  if (kind === "green") {
    return {
      label: "rgba(64,255,197,0.65)",
      value: "rgba(64,255,197,0.95)",
      border: "rgba(64,255,197,0.18)",
      glow: "rgba(64,255,197,0.55)",
      glowSoft: "rgba(64,255,197,0.10)",
      overlayA: "rgba(64,255,197,0.16)",
      overlayB: "rgba(64,255,197,0.06)",
    };
  }
  if (kind === "purple") {
    return {
      label: "rgba(200,120,255,0.55)",
      value: "rgba(200,120,255,0.95)",
      border: "rgba(200,120,255,0.16)",
      glow: "rgba(200,120,255,0.45)",
      glowSoft: "rgba(200,120,255,0.10)",
      overlayA: "rgba(200,120,255,0.12)",
      overlayB: "rgba(200,120,255,0.06)",
    };
  }
  return {
    label: "rgba(80,160,255,0.55)",
    value: "rgba(80,160,255,0.95)",
    border: "rgba(80,160,255,0.16)",
    glow: "rgba(80,160,255,0.45)",
    glowSoft: "rgba(80,160,255,0.10)",
    overlayA: "rgba(80,160,255,0.12)",
    overlayB: "rgba(80,160,255,0.06)",
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

  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontWeight: "900",
  },

  addBtn: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(64,255,197,0.12)",
    borderWidth: 1,
    borderColor: "rgba(64,255,197,0.22)",
  },
  addText: {
    color: "rgba(64,255,197,0.92)",
    fontWeight: "900",
    letterSpacing: 1,
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
    inset: -6,
    borderRadius: 34,
  },

  card: {
    height: 210,
    borderRadius: 28,
    overflow: "hidden",
    padding: 18,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
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
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
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

  owner: {
    marginTop: 6,
    color: "rgba(255,255,255,0.70)",
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  exp: {
    marginTop: 6,
    color: "rgba(255,255,255,0.78)",
    fontWeight: "900",
    letterSpacing: 2,
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
    backgroundColor: "#5DB6FF",
  },
  activeText: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "900",
    letterSpacing: 2,
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
