import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Filter = "All" | "Pending" | "Paid" | "Overdue";

type PayItem = {
  id: string;
  title: string;
  meta: string; // store • date
  amount: string;
  status: "action" | "left" | "paid";
  statusText: string; // e.g. "4 DAYS LEFT" or "PAID"
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

type Section = {
  title: string;
  rightLabel?: string; // e.g. ACTION REQUIRED
  data: PayItem[];
};

const DATA: Section[] = [
  {
    title: "NEXT 7 DAYS",
    rightLabel: "ACTION REQUIRED",
    data: [
      {
        id: "1",
        title: "iPhone 15 Pro Max",
        meta: "Apple Store • Oct 18",
        amount: "$83.33",
        status: "action",
        statusText: "4 DAYS LEFT",
        icon: "cellphone",
      },
      {
        id: "2",
        title: "AirPods Max",
        meta: "Best Buy • Oct 20",
        amount: "$45.00",
        status: "left",
        statusText: "6 DAYS LEFT",
        icon: "headphones",
      },
    ],
  },
  {
    title: "LATER THIS MONTH",
    data: [
      {
        id: "3",
        title: "MacBook Air M3",
        meta: "Apple Finance • Oct 24",
        amount: "$112.50",
        status: "paid",
        statusText: "PAID",
        icon: "check",
      },
      {
        id: "4",
        title: "Herman Miller",
        meta: "DWR • Oct 28",
        amount: "$155.00",
        status: "left",
        statusText: "14 DAYS LEFT",
        icon: "sofa-single-outline",
      },
    ],
  },
];

export default function PaymentsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");

  const sections = useMemo(() => {
    // demo: no filtra real, pero ya queda lista la estructura
    return DATA;
  }, [filter]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#07090D", "#06080B", "#05070A"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <>
            {/* Top bar */}
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
                  onPress={() => {}}
                  hitSlop={10}
                >
                  <Ionicons
                    name="search"
                    size={20}
                    color="rgba(255,255,255,0.65)"
                  />
                </Pressable>
                <Pressable
                  style={styles.iconHit}
                  onPress={() => {}}
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

            <Text style={styles.pageTitle}>Upcoming</Text>

            {/* Summary card */}
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
                  <Text style={styles.summaryValue}>$1,240.50</Text>
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
                <View style={styles.pager}>
                  <View style={styles.pagerDotActive}>
                    <Text style={styles.pagerTextActive}>1</Text>
                  </View>
                  <View style={styles.pagerDot}>
                    <Text style={styles.pagerText}>2</Text>
                  </View>
                </View>

                <Text style={styles.activePlansText}>
                  4 active installments
                </Text>

                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>
              </View>
            </View>

            {/* Filters */}
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
            ) : (
              <View />
            )}
          </View>
        )}
        renderItem={({ item }) => <PayRow item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
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

function PayRow({ item }: { item: PayItem }) {
  const right = (() => {
    if (item.status === "paid") {
      return (
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: "rgba(64,255,197,0.9)" },
            ]}
          />
          <Text style={[styles.statusText, { color: "rgba(64,255,197,0.85)" }]}>
            {item.statusText}
          </Text>
        </View>
      );
    }
    if (item.status === "action") {
      return (
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: "rgba(255,90,90,0.9)" },
            ]}
          />
          <Text style={[styles.statusText, { color: "rgba(255,90,90,0.85)" }]}>
            {item.statusText}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: "rgba(255,255,255,0.22)" },
          ]}
        />
        <Text style={[styles.statusText, { color: "rgba(255,255,255,0.35)" }]}>
          {item.statusText}
        </Text>
      </View>
    );
  })();

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
          {item.status === "paid" ? (
            <Ionicons name="checkmark" size={20} color="rgba(64,255,197,0.9)" />
          ) : (
            <MaterialCommunityIcons
              name={item.icon}
              size={22}
              color="rgba(255,255,255,0.75)"
            />
          )}
        </View>

        <View>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowMeta}>{item.meta}</Text>
        </View>
      </View>

      <View style={styles.rowRight}>
        <Text
          style={[styles.amount, item.status === "paid" && styles.amountStrike]}
        >
          {item.amount}
        </Text>
        {right}
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
  pager: { flexDirection: "row", alignItems: "center", gap: 6 },
  pagerDotActive: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(47,99,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  pagerDot: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  pagerTextActive: { color: "white", fontWeight: "900" },
  pagerText: { color: "rgba(255,255,255,0.75)", fontWeight: "900" },

  activePlansText: {
    color: "rgba(255,255,255,0.30)",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },

  progressTrack: {
    width: 88,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  progressFill: {
    width: "55%",
    height: "100%",
    backgroundColor: "rgba(47,99,255,0.95)",
  },

  filters: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  filterPill: {
    height: 44,
    paddingHorizontal: 18,
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
    fontSize: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
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
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
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
  statusText: { fontWeight: "900", fontSize: 12, letterSpacing: 1.2 },
});
