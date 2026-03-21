import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform, Switch,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp, VirtualNumber } from "@/context/AppContext";
import { PLANS } from "@/data/mockData";

function NumberRow({ num, idx, onDelete }: { num: VirtualNumber; idx: number; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const { recordings, toggleRecording, forwarding, toggleForwarding, dndNumbers, toggleDnd, showToast } = useApp();

  const isRecording = recordings[num.id] ?? false;
  const isForwarding = forwarding[num.id] ?? false;
  const isDnd = dndNumbers[num.id] ?? false;

  const TOGGLES = [
    {
      label: "Call Recording",
      sub: "Auto-save all calls",
      icon: "mic" as const,
      value: isRecording,
      toggle: () => {
        toggleRecording(num.id);
        showToast(isRecording ? "Recording disabled" : "Recording enabled", isRecording ? "info" : "success");
      },
    },
    {
      label: "Call Forwarding",
      sub: "Route to another number",
      icon: "phone-forwarded" as const,
      value: isForwarding,
      toggle: () => {
        toggleForwarding(num.id);
        showToast(isForwarding ? "Forwarding disabled" : "Forwarding enabled", isForwarding ? "info" : "success");
      },
    },
    {
      label: "Do Not Disturb",
      sub: "Silence this number",
      icon: "moon" as const,
      value: isDnd,
      toggle: () => {
        toggleDnd(num.id);
        showToast(isDnd ? "DND disabled" : "DND enabled", isDnd ? "info" : "warning");
      },
    },
  ];

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
              {num.type === "permanent" ? "Permanent" : "⏱ Temporary"}
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
          {/* Quick actions */}
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

          {/* Inline feature toggles */}
          <View style={styles.toggleCard}>
            {TOGGLES.map((t, i) => (
              <View key={t.label}>
                {i > 0 && <View style={styles.toggleDivider} />}
                <View style={styles.toggleRow}>
                  <View style={styles.toggleIcon}>
                    <Feather name={t.icon} size={13} color={C.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleLabel}>{t.label}</Text>
                    <Text style={styles.toggleSub}>{t.sub}</Text>
                  </View>
                  <Switch
                    value={t.value}
                    onValueChange={t.toggle}
                    trackColor={{ false: C.raised, true: C.accent }}
                    thumbColor="#fff"
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Release button */}
          <Pressable
            style={styles.releaseInline}
            onPress={onDelete}
          >
            <Feather name="trash-2" size={12} color={C.red} />
            <Text style={styles.releaseTxt}>Release Number</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.rowDivider} />
    </View>
  );
}

export default function NumbersScreen() {
  const insets = useSafeAreaInsets();
  const {
    numbers, messages, removeNumber, refreshNumbers, profile, currentPlan,
    simulateIncomingCall,
  } = useApp();
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
  const plan = PLANS.find(p => p.id === currentPlan) ?? PLANS[0];
  const isFree = currentPlan === "free";

  const STATS = [
    { label: "Numbers",  value: numbers.length, iconName: "hash",          color: C.accent },
    { label: "Messages", value: totalSms,        iconName: "message-square", color: C.green },
    { label: "Calls",    value: totalCalls,      iconName: "phone",          color: C.blue },
  ] as const;

  const QUICK_ACCESS = [
    { emoji: "🌐", label: "eSIM",         onPress: () => router.push("/esim") },
    { emoji: "🛡️", label: "Spam Block",  onPress: () => router.push("/spamblocker") },
    { emoji: "💬", label: "Auto-Reply",   onPress: () => router.push("/autoreply") },
    { emoji: "👥", label: "Contacts",     onPress: () => router.push("/contacts") },
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
            {/* Simulate incoming call button */}
            <Pressable style={styles.simCallBtn} onPress={simulateIncomingCall}>
              <Feather name="phone-incoming" size={16} color={C.green} />
              <View style={styles.simCallDot} />
            </Pressable>
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
        {isFree ? (
          <Pressable style={styles.freeBanner} onPress={() => router.push("/paywall")}>
            <View style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(255,255,255,0.12)" }} pointerEvents="none" />
            <View style={styles.freeIcon}><Text style={{ fontSize: 20 }}>🚀</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.freeBannerTitle}>You're on Free</Text>
              <Text style={styles.freeBannerSub}>Upgrade to unlock 5 numbers & recording</Text>
            </View>
            <View style={styles.upgradeChip}><Text style={styles.upgradeChipTxt}>Upgrade →</Text></View>
          </Pressable>
        ) : (
          <Pressable style={styles.planBanner} onPress={() => router.push("/paywall")}>
            <View style={styles.planIconWrap}>
              <Ionicons name="star" size={18} color={C.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.planTitle}>{plan.name} Plan</Text>
              <Text style={styles.planSub}>
                {numbers.length} / {plan.numberLimit} numbers · {
                  typeof plan.countries === "string" ? plan.countries : (plan.countries as string[]).join(", ")
                } countries
              </Text>
            </View>
            <View style={styles.upgradePill}>
              <Text style={styles.upgradeTxt}>
                {currentPlan === "global" ? "Active" : "Upgrade"}
              </Text>
              {currentPlan !== "global" && <Feather name="chevron-right" size={12} color={C.onAccent} />}
            </View>
          </Pressable>
        )}

        {/* ── Quick Access grid ── */}
        <View style={styles.quickGrid}>
          {QUICK_ACCESS.map(q => (
            <Pressable key={q.label} style={({ pressed }) => [styles.quickItem, { opacity: pressed ? 0.75 : 1 }]} onPress={q.onPress}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{q.emoji}</Text>
              <Text style={styles.quickItemLbl}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Numbers list ── */}
        <View style={[styles.listCard, { marginTop: 10 }]}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeading}>MY NUMBERS</Text>
            <Pressable style={styles.addBtn} onPress={() => router.push("/picker")}>
              <Feather name="plus" size={13} color={C.accent} />
              <Text style={styles.addTxt}>Add Number</Text>
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
            <View style={{ position: "absolute", top: -16, right: -16, width: 70, height: 70, borderRadius: 35, backgroundColor: C.accentGlow, opacity: 0.6 }} pointerEvents="none" />
            <View style={styles.ctaIcon}><Text style={{ fontSize: 20 }}>🌍</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaTitle}>Add another country</Text>
              <Text style={styles.ctaSub}>100+ countries · from $2.99/month</Text>
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
  simCallBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.greenDim, borderWidth: 1, borderColor: "rgba(22,163,74,0.2)", alignItems: "center", justifyContent: "center", position: "relative" },
  simCallDot: { position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.green, borderWidth: 1.5, borderColor: C.surface },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },

  statsStrip: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  statCard: { flex: 1, backgroundColor: C.raised, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: C.border },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text, letterSpacing: -0.5 },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: C.textMuted, marginTop: 1 },

  freeBanner: {
    flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 16, marginTop: 16,
    backgroundColor: C.accent, borderRadius: 16, padding: 14, overflow: "hidden",
    shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  freeIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  freeBannerTitle: { fontFamily: "Inter_700Bold", fontSize: 13.5, color: "#fff", letterSpacing: -0.2 },
  freeBannerSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  upgradeChip: { backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5, flexShrink: 0 },
  upgradeChipTxt: { fontFamily: "Inter_700Bold", fontSize: 11.5, color: "#fff" },

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

  quickGrid: { flexDirection: "row", gap: 8, marginHorizontal: 16, marginTop: 14 },
  quickItem: { flex: 1, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 2 },
  quickItemLbl: { fontFamily: "Inter_600SemiBold", fontSize: 10.5, color: C.textSec },

  listCard: { backgroundColor: C.surface },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  listHeading: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.textMuted, letterSpacing: 1.4 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.accentDim, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  addTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.accent },

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

  expanded: { backgroundColor: C.raised, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border, paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  actionBtns: { flexDirection: "row", gap: 8 },
  actionBtn: { height: 36, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingHorizontal: 10 },
  actionTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.textSec },
  actionSquare: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },

  toggleCard: { backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  toggleDivider: { height: 1, backgroundColor: C.border },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  toggleIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  toggleLabel: { fontFamily: "Inter_600SemiBold", fontSize: 12.5, color: C.text },
  toggleSub: { fontFamily: "Inter_400Regular", fontSize: 10.5, color: C.textMuted, marginTop: 1 },

  releaseInline: {
    height: 36, borderRadius: 10, borderWidth: 1, borderColor: C.red,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: C.redDim,
  },
  releaseTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.red },

  empty: { paddingVertical: 48, alignItems: "center", gap: 8 },
  emptyTxt: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: C.textSec },
  emptySub: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted },

  ctaBanner: { backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.borderStrong, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, overflow: "hidden", marginBottom: 28 },
  ctaIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  ctaTitle: { fontFamily: "Inter_700Bold", fontSize: 13.5, color: C.text, letterSpacing: -0.2 },
  ctaSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSec, marginTop: 2 },

  fab: { position: "absolute", right: 20, width: 56, height: 56, borderRadius: 18, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
});
