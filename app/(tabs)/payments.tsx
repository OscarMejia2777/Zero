import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  CARD_COLORS,
  getActivePurchaseCount,
  getAllPayments,
  getMonthlyTotal,
  markPaymentAsPaid,
  type PaymentWithDetails,
} from "../../db";
import { syncPaymentNotifications } from "../../lib/notifications";

type Filter = "All" | "Pending" | "Paid" | "Overdue";

export default function PaymentsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [activePlans, setActivePlans] = useState(0);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const filterArg =
        filter === "All" ? undefined : (filter.toLowerCase() as any);

      const [paymentsData, total, count] = await Promise.all([
        getAllPayments(user.id, filterArg),
        getMonthlyTotal(user.id),
        getActivePurchaseCount(user.id),
      ]);

      setPayments(paymentsData);
      setTotalMonthly(total);
      setActivePlans(count);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  }, [filter, user]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const sections = useMemo(() => {
    const overdue = payments.filter(
      (p) =>
        !p.is_paid &&
        new Date(p.due_date) < new Date(new Date().setHours(0, 0, 0, 0))
    );
    const pending = payments.filter(
      (p) =>
        !p.is_paid &&
        new Date(p.due_date) >= new Date(new Date().setHours(0, 0, 0, 0))
    );
    const paid = payments.filter((p) => p.is_paid);

    const result = [];
    if (overdue.length > 0) {
      result.push({
        title: "OVERDUE",
        rightLabel: "ACTION REQUIRED",
        data: overdue,
      });
    }
    if (pending.length > 0) {
      result.push({ title: "UPCOMING / PENDING", data: pending });
    }
    if (paid.length > 0) {
      result.push({ title: "PAID", data: paid });
    }
    return result;
  }, [payments]);

  const handleMarkPaid = (id: number, currentPaid: boolean) => {
    if (currentPaid) return;

    const perform = () => {
      markPaymentAsPaid(id);
      fetchData();
      syncPaymentNotifications();
    };

    if (Platform.OS === "web") {
      if (confirm("¿Marcar este pago como completado?")) perform();
    } else {
      Alert.alert(
        "Marcar como pagado",
        "¿Confirmas que ya realizaste este pago?",
        [
          { text: "No", style: "cancel" },
          { text: "Sí, pagado", onPress: perform },
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

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <>
            <View style={styles.topBar}>
              <Pressable
                onPress={() => router.back()}
                style={styles.iconHit}
                hitSlop={12}
              >
                <Ionicons
                  name="chevron-back"
                  size={26}
                  color="rgba(255,255,255,0.7)"
                />
              </Pressable>

              <View style={styles.topRight}>
                <Pressable
                  style={styles.iconHit}
                  onPress={() => router.push("/purchases/new")}
                  hitSlop={10}
                >
                  <Ionicons
                    name="add"
                    size={24}
                    color="rgba(255,255,255,0.65)"
                  />
                </Pressable>
              </View>
            </View>

            <Text style={styles.pageTitle}>Payments</Text>

            <View style={styles.summaryCard}>
              <LinearGradient
                colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.summaryTop}>
                <View>
                  <Text style={styles.summaryLabel}>MONTHLY TOTAL</Text>
                  <Text style={styles.summaryValue}>
                    ${totalMonthly.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.walletBox}>
                  <Ionicons
                    name="wallet-outline"
                    size={26}
                    color="rgba(255,255,255,0.35)"
                  />
                </View>
              </View>

              <View style={styles.summaryBottom}>
                <Text style={styles.activePlansText}>
                  {activePlans} active plans being monitored
                </Text>
              </View>
            </View>

            <View style={styles.filters}>
              <FilterPill
                label="All"
                active={filter === "All"}
                onPress={() => setFilter("All")}
              />
              <FilterPill
                label="Pending"
                active={filter === "Pending"}
                onPress={() => setFilter("Pending")}
              />
              <FilterPill
                label="Paid"
                active={filter === "Paid"}
                onPress={() => setFilter("Paid")}
              />
              <FilterPill
                label="Overdue"
                active={filter === "Overdue"}
                onPress={() => setFilter("Overdue")}
              />
            </View>

            <View style={{ height: 18 }} />
          </>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.rightLabel ? (
              <View style={styles.actionRequired}>
                <View style={styles.redDot} />
                <Text style={styles.actionText}>{section.rightLabel}</Text>
              </View>
            ) : null}
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleMarkPaid(item.id, item.is_paid)}>
            <PayRow item={item} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "rgba(255,255,255,0.2)", fontSize: 16 }}>
              No hay pagos que mostrar.
            </Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 30 }} />}
      />
    </View>
  );
}

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: Filter;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterPill,
        active ? styles.filterActive : styles.filterInactive,
      ]}
    >
      <Text style={[styles.filterText, active && { color: "#0B0F10" }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function PayRow({ item }: { item: PaymentWithDetails }) {
  const dueDate = new Date(item.due_date);
  const formattedDate = dueDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const statusText = item.is_paid
    ? "PAID"
    : diffDays < 0
    ? `${Math.abs(diffDays)}D OVERDUE`
    : diffDays === 0
    ? "TODAY"
    : diffDays === 1
    ? "TOMORROW"
    : `${diffDays} DAYS LEFT`;

  const accentColor =
    CARD_COLORS.find((c) => c.value === item.card_color)?.hex || "#fff";

  return (
    <View style={styles.rowCard}>
      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>
          {item.is_paid ? (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color="rgba(64,255,197,0.9)"
            />
          ) : (
            <MaterialCommunityIcons
              name="cart-outline"
              size={22}
              color={accentColor}
            />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.rowMeta}>
            {item.store} • {formattedDate}
          </Text>
        </View>
      </View>

      <View style={styles.rowRight}>
        <Text style={[styles.amount, item.is_paid && styles.amountStrike]}>
          ${item.amount.toFixed(2)}
        </Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: item.is_paid
                  ? "rgba(64,255,197,0.9)"
                  : diffDays < 0 || diffDays <= 3
                  ? "rgba(255,90,90,0.9)"
                  : "rgba(255,255,255,0.22)",
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: item.is_paid
                  ? "rgba(64,255,197,0.85)"
                  : diffDays < 0 || diffDays <= 3
                  ? "rgba(255,90,90,0.85)"
                  : "rgba(255,255,255,0.35)",
              },
            ]}
          >
            {statusText}
          </Text>
        </View>
      </View>
    </View>
  );
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
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconHit: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  pageTitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.92)",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  summaryCard: {
    marginTop: 16,
    borderRadius: 26,
    overflow: "hidden",
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.25)",
    letterSpacing: 3,
    fontSize: 11,
    fontWeight: "900",
  },
  summaryValue: {
    marginTop: 10,
    color: "rgba(255,255,255,0.92)",
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -1,
  },
  walletBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryBottom: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  activePlansText: {
    color: "rgba(255,255,255,0.30)",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },

  filters: {
    marginTop: 16,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterPill: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterActive: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  filterInactive: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.08)",
  },
  filterText: {
    color: "rgba(255,255,255,0.62)",
    fontWeight: "900",
    fontSize: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.20)",
    letterSpacing: 3,
    fontSize: 12,
    fontWeight: "900",
  },
  actionRequired: { flexDirection: "row", alignItems: "center", gap: 8 },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: "rgba(255,90,90,0.9)",
  },
  actionText: {
    color: "rgba(255,90,90,0.85)",
    letterSpacing: 1.2,
    fontWeight: "900",
    fontSize: 12,
  },

  rowCard: {
    height: 92,
    borderRadius: 22,
    overflow: "hidden",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(0,0,0,0)",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 18,
    fontWeight: "900",
  },
  rowMeta: {
    marginTop: 4,
    color: "rgba(255,255,255,0.26)",
    fontSize: 14,
    fontWeight: "600",
  },

  rowRight: { alignItems: "flex-end" },
  amount: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 18,
    fontWeight: "900",
  },
  amountStrike: {
    textDecorationLine: "line-through",
    color: "rgba(255,255,255,0.25)",
  },

  statusRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: { width: 8, height: 8, borderRadius: 99 },
  statusText: { fontWeight: "900", fontSize: 11, letterSpacing: 1.2 },
});
