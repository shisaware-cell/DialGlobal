import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform, Animated,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp, VirtualNumber } from "@/context/AppContext";
import { PLANS } from "@/data/mockData";

function NumberRow({ num, idx, onDelete }: { num: VirtualNumber; idx: number; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable
        style={({ pressed }) => [styles.row, { backgroundColor: pressed ? C.raised : C.surface }]}
        onPress={() => setOpen(o => !o)}
      >
        <View style={styles.flagBox}>
          <Text style={styles.flagTxt}>{num.flag}</Text>
          {num.status === "active" && <View style={styles.activeDot} />}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.numTxt} numberOfLines={1}>{num.phone_number}</Text>
          <View style={styles.numMeta}>
            <Text style={styles.numCountry}>{num.country}</Text>
            <View style={styles.dot} />
            <Text style={[styles.numType, { color: num.type === "permanent" ? C.accent : C.green }]}>
              {num.type === "permanent" ? "Permanent" : `⏱ Temporary`}
            </Text>
          </View>
        </View>
        <View style={styles.rowRight}>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.statsMini}>{num.call_count} calls · {num.sms_count} msg</Text>
            {(num.missed_count || 0) > 0 && (
              <View style={styles.missedRow}>
                <View style={styles.missedDot} />
                <Text style={styles.missedTxt}>{num.missed_count} missed</Text>
              </View>
            )}
          </View>
          <Feather name={open ? "chevron-up" : "chevron-down"} size={15} color={C.textMuted} />
        </View>
      </Pressable>

      {open && (
        <View style={styles.expanded}>
          <View style={styles.actionBtns}>
            <Pressable style={[styles.actionBtn, { backgroundColor: C.accent, flex: 1 }]}>
              <Feather name="phone" size={12} color={C.onAccent} />
              <Text style={[styles.actionTxt, { color: C.onAccent }]}>Call</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, { flex: 1 }]} onPress={() => router.push("/(tabs)/inbox")}>
              <Feather name="message-square" size={12} color={C.textSec} />
              <Text style={styles.actionTxt}>Message</Text>
            </Pressable>
            <Pressable style={styles.actionSquare} onPress={() => router.push({ pathname: "/number/[id]", params: { id: num.id } })}>
              <Feather name="edit-2" size={13} color={C.textMuted} />
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.rowDivider} />
    </View>
  );
}

export default function NumbersScreen() {
  const insets = useSafeAreaInsets();
  const { numbers, messages, removeNumber, refreshNumbers, profile, currentPlan } = useApp();
  const isWeb = Platform.OS === "web";
  const tabBarH = isWeb ? 84 : 66;

  useEffect(() => {
    refreshNumbers();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert("Release Number?", "This number will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      { text: "Release", style: "destructive", onPress: () => removeNumber(id) },
    ]);
  };

  const totalCalls = numbers.reduce((s, n) => s + (n.call_count || 0), 0);
  const totalSms = numbers.reduce((s, n) => s + (n.sms_count || 0), 0);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "GOOD MORNING";
    if (h < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  })();
  const userName = profile?.name || profile?.email?.split("@")[0] || "User";

  const STATS = [
    { label: "Numbers",  value: numbers.length, iconName: "hash",         color: C.accent },
    { label: "Messages", value: totalSms,        iconName: "message-square", color: C.green },
    { label: "Calls",    value: totalCalls,      iconName: "phone",         color: C.blue },
  ] as const;

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBarH + 90 }}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.headerTitle}>{userName} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.bellWrap}>
              <Feather name="bell" size={17} color={C.textSec} />
              <View style={styles.bellDot} />
            </View>
            <Pressable onPress={() => router.push("/profile")}>
              <View style={styles.avatar}><Text style={styles.avatarTxt}>{userName.charAt(0).toUpperCase()}</Text></View>
            </Pressable>
          </View>
        </View>

        {/* ── Stats strip ── */}
        <View style={styles.statsStrip}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Feather name={s.iconName} size={15} color={s.color} style={{ marginBottom: 7 }} />
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Plan banner ── */}
        {(() => {
          const plan = PLANS.find(p => p.id === currentPlan) ?? PLANS[0];
          return (
            <Pressable
              style={styles.planBanner}
              onPress={() => router.push("/paywall")}
            >
              <View style={styles.planIconWrap}>
                <Ionicons name="star" size={18} color={C.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.planTitle}>{plan.name} Plan</Text>
                <Text style={styles.planSub}>
                  {numbers.length} / {plan.numberLimit} numbers · {plan.countries} countries
                </Text>
              </View>
              <View style={styles.upgradePill}>
                <Text style={styles.upgradeTxt}>
                  {currentPlan === "global" ? "Active" : "Upgrade"}
                </Text>
                {currentPlan !== "global" && <Feather name="chevron-right" size={12} color={C.onAccent} />}
              </View>
            </Pressable>
          );
        })()}

        {/* ── Numbers list ── */}
        <View style={[styles.listCard, { marginTop: 10 }]}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeading}>MY NUMBERS</Text>
            <Pressable style={styles.addBtn} onPress={() => router.push("/picker")}>
              <Feather name="plus" size={13} color={C.accent} />
              <Text style={styles.addTxt}>Add</Text>
            </Pressable>
          </View>
          {numbers.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="hash" size={32} color={C.textMuted} />
              <Text style={styles.emptyTxt}>No virtual numbers yet</Text>
              <Text style={styles.emptySub}>Tap + to get your first number</Text>
            </View>
          ) : (
            numbers.map((n, i) => (
              <NumberRow key={n.id} num={n} idx={i} onDelete={() => handleDelete(n.id)} />
            ))
          )}
        </View>

        {/* ── Add country CTA ── */}
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Pressable
            style={({ pressed }) => [styles.ctaBanner, { opacity: pressed ? 0.88 : 1 }]}
            onPress={() => router.push("/picker")}
          >
            <View style={{ position: "absolute", top: -16, right: -16, width: 70, height: 70, borderRadius: 35, backgroundColor: C.accentGlow, opacity: 0.6 }} />
            <View style={styles.ctaIcon}><Text style={{ fontSize: 20 }}>🌍</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaTitle}>Add another country</Text>
              <Text style={styles.ctaSub}>100+ countries · from $1.99/month</Text>
            </View>
            <Feather name="chevron-right" size={16} color={C.accent} />
          </Pressable>
        </View>

      </ScrollView>

      {/* ── FAB ── */}
      <Pressable
        style={[styles.fab, { bottom: tabBarH + (insets.bottom > 0 ? 12 : 20) }]}
        onPress={() => router.push("/picker")}
      >
        <Feather name="plus" size={22} color={C.onAccent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 6, paddingBottom: 20, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  greeting: { fontSize: 10, fontFamily: "Inter_700Bold", color: C.textMuted, letterSpacing: 1.5 },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: C.text, letterSpacing: -0.5, marginTop: 3 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 9 },
  bellWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.raised, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center", position: "relative" },
  bellDot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: C.red, borderWidth: 1.5, borderColor: C.surface },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },

  statsStrip: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  statCard: { flex: 1, backgroundColor: C.raised, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: C.border },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text, letterSpacing: -0.5 },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: C.textMuted, marginTop: 1 },

  listCard: { backgroundColor: C.surface },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  listHeading: { fontFamily: "Inter_700Bold", fontSize: 13, color: C.textMuted, letterSpacing: 1.1 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
  addTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: C.accent },

  row: { flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 20, paddingVertical: 13 },
  flagBox: { width: 42, height: 42, borderRadius: 13, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 },
  flagTxt: { fontSize: 21 },
  activeDot: { position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: 4.5, backgroundColor: C.green, borderWidth: 2, borderColor: C.surface },
  numTxt: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text, letterSpacing: -0.3 },
  numMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 },
  numCountry: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textSec },
  dot: { width: 3, height: 3, borderRadius: 99, backgroundColor: C.borderStrong },
  numType: { fontFamily: "Inter_600SemiBold", fontSize: 10.5 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 14, flexShrink: 0 },
  statsMini: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  missedRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  missedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.red },
  missedTxt: { fontFamily: "Inter_700Bold", fontSize: 10.5, color: C.red },
  rowDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 20 },

  expanded: { backgroundColor: C.raised, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border, paddingHorizontal: 20, paddingVertical: 12 },
  actionBtns: { flexDirection: "row", gap: 8 },
  actionBtn: { height: 36, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingHorizontal: 10 },
  actionTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.textSec },
  actionSquare: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },

  empty: { paddingVertical: 48, alignItems: "center", gap: 8 },
  emptyTxt: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: C.textSec },
  emptySub: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted },

  ctaBanner: { backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.borderStrong, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, overflow: "hidden", marginBottom: 28 },
  ctaIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  ctaTitle: { fontFamily: "Inter_700Bold", fontSize: 13.5, color: C.text, letterSpacing: -0.2 },
  ctaSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSec, marginTop: 2 },

  planBanner: {
    flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 16, marginTop: 16,
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1,
    borderColor: "rgba(232,160,32,0.25)", padding: 14, overflow: "hidden",
  },
  planIconWrap: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: C.accentDim,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  planTitle: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.text, letterSpacing: -0.2 },
  planSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 2 },
  upgradePill: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: C.accent, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99,
  },
  upgradeTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.onAccent },

  fab: { position: "absolute", right: 20, width: 56, height: 56, borderRadius: 18, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
});
