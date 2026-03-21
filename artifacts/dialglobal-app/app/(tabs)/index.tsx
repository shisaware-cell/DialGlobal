import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform, Switch,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp, VirtualNumber } from "@/context/AppContext";

function NumberRow({ num, onDelete }: { num: VirtualNumber; onDelete: () => void }) {
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

  const isPermanent = num.type === "permanent";

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
            <View style={[styles.typeBadge, { backgroundColor: isPermanent ? C.accentDim : C.greenDim }]}>
              <Text style={[styles.typeTxt, { color: isPermanent ? C.accent : C.green }]}>
                {isPermanent ? "Permanent" : "Temporary"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rowRight}>
          {(num.missed_count || 0) > 0 && (
            <View style={styles.missedBadge}>
              <View style={styles.missedDot} />
              <Text style={styles.missedTxt}>{num.missed_count} missed</Text>
            </View>
          )}
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
          <Pressable style={styles.releaseInline} onPress={onDelete}>
            <Feather name="trash-2" size={12} color={C.red} />
            <Text style={styles.releaseTxt}>Release Number</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.rowDivider} />
    </View>
  );
}

const QUICK_ACCESS = [
  { emoji: "📡", label: "eSIM Data",    sub: "Travel ready",      onPress: () => router.push("/esim")        },
  { emoji: "🛡️", label: "Spam Blocker", sub: "Block unwanted",    onPress: () => router.push("/spamblocker") },
  { emoji: "💬", label: "Auto-Reply",   sub: "Set away messages", onPress: () => router.push("/autoreply")   },
  { emoji: "👥", label: "Contacts",     sub: "Sync & manage",     onPress: () => router.push("/contacts")    },
] as const;

export default function NumbersScreen() {
  const insets = useSafeAreaInsets();
  const {
    numbers, messages, removeNumber, refreshNumbers,
    profile, simulateIncomingCall,
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
  const totalSms   = numbers.reduce((s, n) => s + (n.sms_count  || 0), 0);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "GOOD MORNING";
    if (h < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  })();
  const userName = profile?.name || profile?.email?.split("@")[0] || "User";

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarH + (insets.bottom > 0 ? insets.bottom : 16) + 32 }}
      >

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.headerTitle}>{userName} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.simCallBtn} onPress={simulateIncomingCall}>
              <Feather name="phone-incoming" size={16} color={C.green} />
              <View style={styles.simCallDot} />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTxt}>{userName.charAt(0).toUpperCase()}</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ── Stats strip ── */}
        <View style={styles.statsStrip}>
          <View style={[styles.statCard, { backgroundColor: C.raised }]}>
            <Text style={[styles.statVal, { color: C.accent }]}>{numbers.length}</Text>
            <Text style={styles.statLabel}>Numbers</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: C.greenDim }]}>
            <Text style={[styles.statVal, { color: C.green }]}>{totalSms}</Text>
            <Text style={[styles.statLabel, { color: C.green }]}>Messages</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: C.blueDim }]}>
            <Text style={[styles.statVal, { color: C.blue }]}>{totalCalls}</Text>
            <Text style={[styles.statLabel, { color: C.blue }]}>Calls</Text>
          </View>
        </View>

        {/* ── MY NUMBERS ── */}
        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeading}>MY NUMBERS</Text>
          </View>
          {numbers.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="hash" size={32} color={C.textMuted} />
              <Text style={styles.emptyTxt}>No virtual numbers yet</Text>
              <Text style={styles.emptySub}>Tap + to get your first number</Text>
            </View>
          ) : (
            numbers.map(n => (
              <NumberRow key={n.id} num={n} onDelete={() => handleDelete(n.id)} />
            ))
          )}
        </View>

        {/* ── QUICK ACCESS ── */}
        <View style={styles.qaSection}>
          <Text style={styles.qaHeading}>QUICK ACCESS</Text>
          <View style={styles.qaGrid}>
            {QUICK_ACCESS.map(q => (
              <Pressable
                key={q.label}
                style={({ pressed }) => [styles.qaCard, { opacity: pressed ? 0.75 : 1 }]}
                onPress={q.onPress}
              >
                <Text style={styles.qaEmoji}>{q.emoji}</Text>
                <Text style={styles.qaLabel}>{q.label}</Text>
                <Text style={styles.qaSub}>{q.sub}</Text>
              </Pressable>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 6, paddingBottom: 20,
    backgroundColor: C.surface,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  greeting: { fontSize: 10, fontFamily: "Inter_700Bold", color: C.textMuted, letterSpacing: 1.5 },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: C.text, letterSpacing: -0.5, marginTop: 3 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 9 },
  simCallBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: C.greenDim,
    borderWidth: 1, borderColor: "rgba(22,163,74,0.2)",
    alignItems: "center", justifyContent: "center", position: "relative",
  },
  simCallDot: {
    position: "absolute", top: 8, right: 8, width: 7, height: 7,
    borderRadius: 3.5, backgroundColor: C.green, borderWidth: 1.5, borderColor: C.surface,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: C.accent,
    alignItems: "center", justifyContent: "center",
  },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },

  statsStrip: {
    flexDirection: "row", gap: 8,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16,
    backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  statCard: {
    flex: 1, borderRadius: 14, padding: 13,
    borderWidth: 1, borderColor: C.border,
  },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: -0.5 },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.textMuted, marginTop: 2 },

  listCard: { backgroundColor: C.surface, marginTop: 12, borderRadius: 0 },
  listHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10,
  },
  listHeading: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.textMuted, letterSpacing: 1.4 },

  row: {
    flexDirection: "row", alignItems: "center", gap: 13,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  flagBox: {
    width: 44, height: 44, borderRadius: 13, backgroundColor: C.raised,
    alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0,
    borderWidth: 1, borderColor: C.border,
  },
  flagTxt: { fontSize: 22 },
  activeDot: {
    position: "absolute", bottom: 2, right: 2, width: 9, height: 9,
    borderRadius: 4.5, backgroundColor: C.green, borderWidth: 2, borderColor: C.surface,
  },
  numTxt: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text, letterSpacing: -0.3 },
  numMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  numCountry: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textSec },
  dot: { width: 3, height: 3, borderRadius: 99, backgroundColor: C.borderStrong },
  typeBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  typeTxt: { fontFamily: "Inter_600SemiBold", fontSize: 10 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 0 },
  missedBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  missedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.red },
  missedTxt: { fontFamily: "Inter_700Bold", fontSize: 10.5, color: C.red },
  rowDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 20 },

  expanded: {
    backgroundColor: C.raised, borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: C.border, paddingHorizontal: 16, paddingVertical: 12, gap: 10,
  },
  actionBtns: { flexDirection: "row", gap: 8 },
  actionBtn: {
    height: 36, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingHorizontal: 10,
  },
  actionTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.textSec },
  actionSquare: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center",
  },
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

  qaSection: { paddingHorizontal: 16, paddingTop: 20 },
  qaHeading: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.textMuted, letterSpacing: 1.4, marginBottom: 12 },
  qaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  qaCard: {
    width: "47%",
    backgroundColor: C.surface, borderRadius: 16,
    borderWidth: 1, borderColor: C.border,
    padding: 14, gap: 4,
  },
  qaEmoji: { fontSize: 24, marginBottom: 4 },
  qaLabel: { fontFamily: "Inter_700Bold", fontSize: 13, color: C.text },
  qaSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
});
