import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  CARD_COLORS,
  getActivePurchaseCount,
  getAllCards,
  getMonthlyTotal,
  getUpcomingPayments,
  type Card,
  type PaymentWithDetails,
} from "../../db";

export default function HomeScreen() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<PaymentWithDetails[]>([]);
  const [totalMonthly, setTotalMonthly] = useState<number>(0);
  const [activePlansCount, setActivePlansCount] = useState<number>(0);
  const [cards, setCards] = useState<Card[]>([]);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      const fetchData = async () => {
        try {
          const [upcomingData, total, count, cardsData] = await Promise.all([
            getUpcomingPayments(user.id, 7),
            getMonthlyTotal(user.id),
            getActivePurchaseCount(user.id),
            getAllCards(user.id),
          ]);
          setUpcoming(upcomingData);
          setTotalMonthly(total);
          setActivePlansCount(count);
          setCards(cardsData);
        } catch (error) {
          console.error("Error fetching home data:", error);
        }
      };
      fetchData();
    }, [user])
  );

  const totalStr = totalMonthly.toFixed(2);
  const parts = totalStr.split(".");
  const intPart = parseInt(parts[0]).toLocaleString();
  const centsPart = "." + parts[1];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

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
        data={upcoming}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
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
                  <Text style={styles.name}>
                    {user?.full_name?.split(" ")[0] || "User"}
                  </Text>
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
                <Text style={styles.totalBig}>${intPart}</Text>
                <Text style={styles.totalCents}>{centsPart}</Text>
              </View>

              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.cardSmallLabel}>ACTIVE PLANS</Text>
                  <Text style={styles.cardSmallValue}>
                    {activePlansCount} Items
                  </Text>
                </View>

                <Pressable
                  style={styles.detailsBtn}
                  onPress={() => router.push("/(tabs)/payments")}
                >
                  <Text style={styles.detailsText}>Details</Text>
                </Pressable>
              </View>
            </View>

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
        ListEmptyComponent={
          <View style={styles.emptyPayments}>
            <Text style={styles.emptySub}>
              No upcoming payments in the next 7 days.
            </Text>
          </View>
        }
        renderItem={({ item }) => <PaymentRow item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListFooterComponent={
          <>
            <View style={{ height: 26 }} />

            <Text style={styles.sectionTitle}>Linked Cards</Text>

            <View style={{ height: 14 }} />

            <FlatList
              horizontal
              data={cards}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(c) => c.id.toString()}
              contentContainerStyle={{ gap: 14, paddingRight: 40 }}
              renderItem={({ item }) => {
                const config =
                  CARD_COLORS.find((c) => c.value === item.color) ||
                  CARD_COLORS[2];
                return (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/cards/new",
                        params: { id: item.id },
                      })
                    }
                    style={[
                      styles.cardMock,
                      { borderColor: config.hex + "40" },
                    ]}
                  >
                    <LinearGradient
                      colors={[config.hex + "10", "transparent"]}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                    <Text
                      style={[styles.cardMockTop, { color: config.hex + "80" }]}
                    >
                      {item.bank_name.toUpperCase()}
                    </Text>

                    <View style={styles.cardNumberRow}>
                      <Text style={styles.cardDots}>• • • •</Text>
                      <Text style={styles.cardLast}>{item.last4}</Text>
                    </View>

                    <Text style={styles.cardBank}>{item.name}</Text>

                    <View style={styles.aprRow}>
                      <View
                        style={[styles.aprDot, { backgroundColor: config.hex }]}
                      />
                      <Text style={styles.aprText}>0% APR Active</Text>
                    </View>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View
                  style={{
                    width: 260,
                    height: 170,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "rgba(255,255,255,0.2)" }}>
                    No cards linked
                  </Text>
                </View>
              }
              ListFooterComponent={
                <Pressable
                  onPress={() => router.push("/cards/new")}
                  style={styles.cardGhost}
                >
                  <View style={styles.dashBox} />
                  <Text style={styles.ghostText}>ADD</Text>
                </Pressable>
              }
            />

            <View style={{ height: 18 }} />

            <Pressable
              onPress={() => router.push("/(tabs)/payments")}
              style={({ pressed }) => [
                styles.addPurchaseBtn,
                pressed && { transform: [{ scale: 0.99 }] },
              ]}
            >
              <View style={styles.plusCircle}>
                <Ionicons name="list" size={18} color="#0B0F10" />
              </View>
              <Text style={styles.addPurchaseText}>Manage Purchases</Text>
            </Pressable>

            <View style={{ height: 24 }} />
          </>
        }
      />

      <Pressable style={styles.floatBtn} onPress={() => {}}>
        <Ionicons name="stats-chart" size={18} color="rgba(255,255,255,0.9)" />
      </Pressable>
    </View>
  );
}

function PaymentRow({ item }: { item: PaymentWithDetails }) {
  const dueDate = new Date(item.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const leftLabel =
    diffDays === 0
      ? "TODAY"
      : diffDays === 1
      ? "TOMORROW"
      : `${diffDays} DAYS LEFT`;
  const isUrgent = diffDays <= 3;

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
          <Ionicons
            name="cart-outline"
            size={22}
            color={
              CARD_COLORS.find((c) => c.value === item.card_color)?.hex ||
              "rgba(255,255,255,0.75)"
            }
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.paymentTitle} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.paymentStore}>
            {item.store} • {item.card_name}
          </Text>
        </View>
      </View>

      <View style={styles.paymentRight}>
        <Text style={styles.paymentAmount}>${item.amount.toFixed(2)}</Text>
        <View
          style={[styles.pill, isUrgent ? styles.pillLime : styles.pillGray]}
        >
          <Text style={styles.pillText}>{leftLabel}</Text>
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
    minHeight: 180,
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
    width: 260,
    height: 170,
    borderRadius: 26,
    overflow: "hidden",
    padding: 18,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  cardMockTop: {
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
    marginTop: 18,
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
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
  },
  aprText: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 0,
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
    width: 120,
    height: 170,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderStyle: "dashed",
  },
  dashBox: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 26,
  },
  ghostText: {
    color: "rgba(255,255,255,0.18)",
    letterSpacing: 3,
    fontWeight: "900",
  },

  emptyPayments: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptySub: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 14,
    fontWeight: "600",
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
