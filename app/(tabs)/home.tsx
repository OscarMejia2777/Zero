import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Payment = {
  id: string;
  title: string;
  store: string;
  amount: string;
  leftLabel: string;
  leftVariant: "lime" | "gray";
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

const PAYMENTS: Payment[] = [
  {
    id: "1",
    title: "MacBook Pro",
    store: "Apple Store",
    amount: "$150.00",
    leftLabel: "2 DAYS LEFT",
    leftVariant: "lime",
    icon: "laptop",
  },
  {
    id: "2",
    title: "Sportswear",
    store: "Nordstrom",
    amount: "$45.00",
    leftLabel: "3 DAYS LEFT",
    leftVariant: "lime",
    icon: "shopping-outline",
  },
  {
    id: "3",
    title: "Office Chair",
    store: "West Elm",
    amount: "$82.50",
    leftLabel: "6 DAYS LEFT",
    leftVariant: "gray",
    icon: "sofa-single-outline",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* subtle green glow at bottom like screenshot */}
      <View pointerEvents="none" style={styles.greenGlowWrap}>
        <LinearGradient
          colors={[
            "rgba(185,255,0,0)",
            "rgba(185,255,0,0.18)",
            "rgba(185,255,0,0)",
          ]}
          locations={[0, 0.55, 1]}
          style={styles.greenGlow}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </View>

      <FlatList
        data={PAYMENTS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.avatar}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=60",
                    }}
                    style={styles.avatarImg}
                  />
                </View>

                <View>
                  <Text style={styles.portfolio}>PORTFOLIO</Text>
                  <Text style={styles.name}>Alex</Text>
                </View>
              </View>

              <Pressable style={styles.iconCircle} onPress={() => {}}>
                <Ionicons
                  name="notifications"
                  size={20}
                  color="rgba(255,255,255,0.78)"
                />
              </Pressable>
            </View>

            {/* Summary card */}
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.10)",
                  "rgba(255,255,255,0.04)",
                  "rgba(255,255,255,0.02)",
                ]}
                locations={[0, 0.55, 1]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <LinearGradient
                colors={[
                  "rgba(185,255,0,0.00)",
                  "rgba(185,255,0,0.10)",
                  "rgba(47,99,255,0.10)",
                ]}
                locations={[0, 0.7, 1]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0.2 }}
                end={{ x: 1, y: 1 }}
              />

              <Text style={styles.cardLabel}>TOTAL MONTHLY PAYMENT</Text>

              <View style={styles.totalRow}>
                <Text style={styles.totalBig}>$1,240</Text>
                <Text style={styles.totalCents}>.00</Text>
              </View>

              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.cardSmallLabel}>ACTIVE PLANS</Text>
                  <Text style={styles.cardSmallValue}>8 Items</Text>
                </View>

                <Pressable
                  style={styles.detailsBtn}
                  onPress={() => router.push("/(tabs)/payments")}
                >
                  <Text style={styles.detailsText}>Details</Text>
                </Pressable>
              </View>
            </View>

            {/* Next payments header */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Next Payments</Text>
                <Text style={styles.sectionSub}>Upcoming 7 days window</Text>
              </View>

              <Pressable style={styles.sectionIconBtn} onPress={() => {}}>
                <MaterialCommunityIcons
                  name="swap-horizontal"
                  size={18}
                  color="rgba(255,255,255,0.55)"
                />
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }) => <PaymentRow item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListFooterComponent={
          <>
            <View style={{ height: 26 }} />

            {/* Linked cards */}
            <Text style={styles.sectionTitle}>Linked Cards</Text>

            <View style={{ height: 14 }} />

            <View style={styles.cardsRow}>
              <View style={styles.cardMock}>
                <LinearGradient
                  colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Text style={styles.cardMockTop}>VISA INFINITE</Text>

                <View style={styles.cardNumberRow}>
                  <Text style={styles.cardDots}>• • • •</Text>
                  <Text style={styles.cardLast}>4242</Text>
                </View>

                <Text style={styles.cardBank}>CHASE SAPPHIRE</Text>

                <View style={styles.aprRow}>
                  <View style={styles.aprDot} />
                  <Text style={styles.aprText}>0% APR Active</Text>
                </View>

                <Pressable
                  style={styles.editFab}
                  onPress={() => router.push("/(tabs)/cards/new")}
                >
                  <Ionicons
                    name="pencil"
                    size={16}
                    color="rgba(255,255,255,0.8)"
                  />
                </Pressable>
              </View>

              <View style={styles.cardGhost}>
                <View style={styles.dashBox} />
                <Text style={styles.ghostText}>NEW</Text>
              </View>
            </View>

            <View style={{ height: 18 }} />

            <Pressable
              onPress={() => router.push("/(tabs)/cards/new")}
              style={({ pressed }) => [
                styles.addPurchaseBtn,
                pressed && { transform: [{ scale: 0.99 }] },
              ]}
            >
              <View style={styles.plusCircle}>
                <Ionicons name="add" size={18} color="#0B0F10" />
              </View>
              <Text style={styles.addPurchaseText}>Add Purchase</Text>
            </Pressable>

            <View style={{ height: 24 }} />
          </>
        }
      />

      {/* Small floating action like screenshot */}
      <Pressable style={styles.floatBtn} onPress={() => {}}>
        <Ionicons name="stats-chart" size={18} color="rgba(255,255,255,0.9)" />
      </Pressable>
    </View>
  );
}

function PaymentRow({ item }: { item: Payment }) {
  const pillStyle =
    item.leftVariant === "lime" ? styles.pillLime : styles.pillGray;

  return (
    <View style={styles.paymentCard}>
      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.paymentLeft}>
        <View style={styles.paymentIconBox}>
          <MaterialCommunityIcons
            name={item.icon}
            size={22}
            color="rgba(255,255,255,0.75)"
          />
        </View>

        <View>
          <Text style={styles.paymentTitle}>{item.title}</Text>
          <Text style={styles.paymentStore}>{item.store}</Text>
        </View>
      </View>

      <View style={styles.paymentRight}>
        <Text style={styles.paymentAmount}>{item.amount}</Text>
        <View style={[styles.pill, pillStyle]}>
          <Text style={styles.pillText}>{item.leftLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const LIME = "#C9FF00";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05070A" },

  listContent: {
    paddingTop: Platform.OS === "ios" ? 54 : 22,
    paddingHorizontal: 18,
    paddingBottom: 110,
  },

  greenGlowWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -40,
    height: 260,
  },
  greenGlow: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  avatarImg: { width: "100%", height: "100%" },

  portfolio: {
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "700",
  },
  name: {
    marginTop: 2,
    color: "rgba(255,255,255,0.92)",
    fontSize: 22,
    fontWeight: "900",
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryCard: {
    height: 170,
    borderRadius: 26,
    overflow: "hidden",
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardLabel: {
    color: "rgba(255,255,255,0.28)",
    letterSpacing: 3,
    fontSize: 11,
    fontWeight: "800",
  },
  totalRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 14 },
  totalBig: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 54,
    fontWeight: "900",
    letterSpacing: -1,
  },
  totalCents: {
    color: "rgba(255,255,255,0.22)",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  cardBottomRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardSmallLabel: {
    color: "rgba(255,255,255,0.25)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "800",
  },
  cardSmallValue: {
    marginTop: 6,
    color: "rgba(255,255,255,0.85)",
    fontSize: 18,
    fontWeight: "900",
  },
  detailsBtn: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsText: {
    color: "#0B0F10",
    fontWeight: "900",
    fontSize: 15,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  sectionSub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.26)",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },

  paymentCard: {
    height: 86,
    borderRadius: 22,
    overflow: "hidden",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  paymentIconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentTitle: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 18,
    fontWeight: "900",
  },
  paymentStore: {
    marginTop: 4,
    color: "rgba(255,255,255,0.26)",
    fontSize: 14,
    fontWeight: "600",
  },
  paymentRight: { alignItems: "flex-end" },
  paymentAmount: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 18,
    fontWeight: "900",
  },
  pill: {
    marginTop: 10,
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  pillLime: { backgroundColor: LIME },
  pillGray: { backgroundColor: "rgba(255,255,255,0.10)" },
  pillText: {
    color: "#0B0F10",
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 1.2,
  },

  cardsRow: {
    flexDirection: "row",
    gap: 14,
  },
  cardMock: {
    flex: 1,
    height: 170,
    borderRadius: 26,
    overflow: "hidden",
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardMockTop: {
    color: "rgba(255,255,255,0.22)",
    letterSpacing: 3,
    fontSize: 11,
    fontWeight: "900",
  },
  cardNumberRow: {
    marginTop: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardDots: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 18,
    fontWeight: "900",
  },
  cardLast: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 4,
  },
  cardBank: {
    marginTop: 24,
    color: "rgba(255,255,255,0.18)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "900",
  },
  aprRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aprDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: LIME,
  },
  aprText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontWeight: "800",
  },
  editFab: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardGhost: {
    width: 110,
    height: 170,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  dashBox: {
    position: "absolute",
    inset: 0,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.12)",
    borderStyle: "dashed",
  },
  ghostText: {
    color: "rgba(255,255,255,0.18)",
    letterSpacing: 3,
    fontWeight: "900",
  },

  addPurchaseBtn: {
    height: 64,
    borderRadius: 999,
    backgroundColor: LIME,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: LIME,
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
  },
  plusCircle: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  addPurchaseText: {
    color: "#0B0F10",
    fontSize: 18,
    fontWeight: "900",
  },

  floatBtn: {
    position: "absolute",
    right: 18,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
});
