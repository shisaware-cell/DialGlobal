import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform, Switch, Image,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { CharBored } from "@/components/Characters";
import { useApp, VirtualNumber } from "@/context/AppContext";

function NumberRow({ num, onDelete }: { num: VirtualNumber; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const { recordings, toggleRecording, forwarding, toggleForwarding, dndNumbers, toggleDnd, showToast, isAuthed } = useApp();

  const isRecording = recordings[num.id] ?? false;
  const isForwarding = forwarding[num.id] ?? false;
  const isDnd = dndNumbers[num.id] ?? false;

  const guestGuard = (action: () => void) => {
    if (!isAuthed) { router.push("/paywall"); return; }
    action();
  };

  const TOGGLES = [
    {
      label: "Call Recording",
      sub: "Auto-save all calls",
      icon: "mic" as const,
      value: isRecording,
      toggle: () => guestGuard(() => {
        toggleRecording(num.id);
        showToast(isRecording ? "Recording disabled" : "Recording enabled", isRecording ? "info" : "success");
      }),
    },
    {
      label: "Call Forwarding",
      sub: "Route to another number",
      icon: "phone-forwarded" as const,
      value: isForwarding,
      toggle: () => guestGuard(() => {
        toggleForwarding(num.id);
        showToast(isForwarding ? "Forwarding disabled" : "Forwarding enabled", isForwarding ? "info" : "success");
      }),
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

  const isPermanent = num.type === "permanent" || num.type === "landline";
  const isLandline  = num.type === "landline" || num.type === "landline-trial";

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
            {/* Mobile vs Landline badge */}
            <View style={[styles.typeBadge, { backgroundColor: isLandline ? "#D4E8FF" : C.greenDim }]}>
              <Text style={[styles.typeTxt, { color: isLandline ? "#2D60C8" : C.green }]}>
                {isLandline ? "📞 Landline" : "📱 Mobile"}
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
            <Pressable style={[styles.actionBtn, { backgroundColor: C.accent, flex: 1 }]} onPress={() => guestGuard(() => router.push("/dialer"))}>
              <Feather name="phone" size={12} color={C.onAccent} />
              <Text style={[styles.actionTxt, { color: C.onAccent }]}>Call</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, { flex: 1 }]} onPress={() => guestGuard(() => router.push("/(tabs)/inbox"))}>
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

type QAItem = { image?: any; icon?: string; iconBg?: string; iconColor?: string; label: string; sub: string; route: string; gated: boolean };
const QUICK_ACCESS_DEF: QAItem[] = [
  { image: require("@/assets/images/esim.png"),         label: "eSIM Data",    sub: "Travel ready",      route: "/esim",                  gated: false },
  { image: require("@/assets/images/telephone.png"),    label: "Landline",     sub: "Business number",   route: "/picker?type=landline",  gated: false },
  { image: require("@/assets/images/spam_blocker.png"), label: "Spam Blocker", sub: "Block unwanted",    route: "/spamblocker",           gated: true  },
  { image: require("@/assets/images/auto-reply.png"),   label: "Auto-Reply",   sub: "Set away messages", route: "/autoreply",             gated: true  },
];

export default function NumbersScreen() {
  const insets = useSafeAreaInsets();
  const {
    numbers, messages, removeNumber, refreshNumbers,
    profile, isAuthed,
  } = useApp();

  const guestGuardQA = (gated: boolean, route: string) => {
    if (gated && !isAuthed) { router.push("/paywall"); return; }
    router.push(route as any);
  };
  const unreadCount = messages.filter(m => !m.read).length;
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
  const userName = profile?.name || profile?.email?.split("@")[0] || (isAuthed ? "" : "Guest");

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
            <Text style={styles.headerTitle}>{userName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable onPress={() => router.push("/profile")} style={{ position: "relative" }}>
              <View style={styles.avatar}>
                <Feather name="user" size={20} color={C.onAccent} />
              </View>
              {unreadCount > 0 && (
                <Pressable style={styles.notifBadge} onPress={() => router.push("/(tabs)/inbox")}>
                  <Text style={styles.notifBadgeTxt}>
                    {unreadCount > 99 ? "99+" : String(unreadCount)}
                  </Text>
                </Pressable>
              )}
            </Pressable>
          </View>
        </View>

        {/* ── Stat Tiles ── */}
        <View style={styles.tilesRow}>
          {/* Numbers tile */}
          <View style={[styles.tile, { backgroundColor: C.accentDim, borderColor: "rgba(232,160,32,0.22)" }]}>
            <View style={styles.tileTop}>
              <View style={[styles.tileIco, { backgroundColor: "rgba(232,160,32,0.22)" }]}>
                <Feather name="hash" size={11} color={C.accent} />
              </View>
              <View style={[styles.trendPill, { backgroundColor: "rgba(232,160,32,0.18)" }]}>
                <Feather name="arrow-up-right" size={8} color={C.accent} />
                <Text style={[styles.trendTxt, { color: C.accent }]}>Active</Text>
              </View>
            </View>
            <Text style={[styles.tileVal, { color: C.accent }]}>{numbers.length}</Text>
            <Text style={[styles.tileLbl, { color: C.accent }]}>Numbers</Text>
            <View style={styles.sparkline}>
              {[3, 5, 4, 6, 5, 7, numbers.length > 0 ? 7 : 3].map((h, i) => (
                <View key={i} style={[styles.sparkBar, {
                  height: Math.round(h * 1.2),
                  backgroundColor: i === 6 ? C.accent : "rgba(232,160,32,0.3)",
                }]} />
              ))}
            </View>
          </View>

          {/* Messages tile */}
          <View style={[styles.tile, { backgroundColor: C.greenDim, borderColor: "rgba(22,163,74,0.18)" }]}>
            <View style={styles.tileTop}>
              <View style={[styles.tileIco, { backgroundColor: "rgba(22,163,74,0.2)" }]}>
                <Feather name="message-square" size={11} color={C.green} />
              </View>
              <View style={[styles.trendPill, { backgroundColor: "rgba(22,163,74,0.15)" }]}>
                <Feather name="arrow-up-right" size={8} color={C.green} />
                <Text style={[styles.trendTxt, { color: C.green }]}>SMS</Text>
              </View>
            </View>
            <Text style={[styles.tileVal, { color: C.green }]}>{totalSms}</Text>
            <Text style={[styles.tileLbl, { color: C.green }]}>Messages</Text>
            <View style={styles.sparkline}>
              {[3, 4, 5, 4, 6, 5, 7].map((h, i) => (
                <View key={i} style={[styles.sparkBar, {
                  height: Math.round(h * 1.2),
                  backgroundColor: i === 6 ? C.green : "rgba(22,163,74,0.27)",
                }]} />
              ))}
            </View>
          </View>

          {/* Calls tile */}
          <View style={[styles.tile, { backgroundColor: C.blueDim, borderColor: "rgba(37,99,235,0.15)" }]}>
            <View style={styles.tileTop}>
              <View style={[styles.tileIco, { backgroundColor: "rgba(37,99,235,0.18)" }]}>
                <Feather name="phone" size={11} color={C.blue} />
              </View>
              <View style={[styles.trendPill, { backgroundColor: "rgba(37,99,235,0.12)" }]}>
                <Feather name="arrow-up-right" size={8} color={C.blue} />
                <Text style={[styles.trendTxt, { color: C.blue }]}>Total</Text>
              </View>
            </View>
            <Text style={[styles.tileVal, { color: C.blue }]}>{totalCalls}</Text>
            <Text style={[styles.tileLbl, { color: C.blue }]}>Calls</Text>
            <View style={styles.sparkline}>
              {[4, 3, 5, 4, 6, 5, 7].map((h, i) => (
                <View key={i} style={[styles.sparkBar, {
                  height: Math.round(h * 1.2),
                  backgroundColor: i === 6 ? C.blue : "rgba(37,99,235,0.22)",
                }]} />
              ))}
            </View>
          </View>
        </View>

        {/* ── MY NUMBERS ── */}
        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeading}>MY NUMBERS</Text>
          </View>
          {numbers.length === 0 ? (
            <View style={styles.empty}>
              <CharBored size={140} />
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
            {QUICK_ACCESS_DEF.map(q => (
              <Pressable
                key={q.label}
                style={({ pressed }) => [styles.qaCard, { opacity: pressed ? 0.75 : 1 }]}
                onPress={() => guestGuardQA(q.gated, q.route)}
              >
                {q.image ? (
                  <Image source={q.image} style={styles.qaIcon} />
                ) : (
                  <View style={[styles.qaIconBox, { backgroundColor: q.iconBg }]}>
                    <Feather name={q.icon as any} size={20} color={q.iconColor} />
                  </View>
                )}
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
  headerTitle: { fontSize: 12, fontFamily: "Inter_700Bold", color: C.text, letterSpacing: -0.1, marginTop: 3 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 9 },
  avatar: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: C.accent,
    alignItems: "center", justifyContent: "center",
  },
  notifBadge: {
    position: "absolute", top: -5, right: -5,
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: C.red, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 4, borderWidth: 2, borderColor: C.surface,
  },
  notifBadgeTxt: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#fff" },

  tilesRow: {
    flexDirection: "row", gap: 6,
    paddingHorizontal: 14, paddingTop: 8, paddingBottom: 8,
    backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  tile: {
    flex: 1, borderRadius: 12, padding: 8,
    borderWidth: 1.5, gap: 0,
  },
  tileTop: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2,
  },
  tileIco: {
    width: 20, height: 20, borderRadius: 6, alignItems: "center", justifyContent: "center",
  },
  trendPill: {
    flexDirection: "row", alignItems: "center", gap: 2,
    paddingHorizontal: 4, paddingVertical: 1, borderRadius: 99,
  },
  trendTxt: { fontFamily: "Inter_700Bold", fontSize: 8, letterSpacing: 0.3 },
  tileVal: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.8, lineHeight: 21 },
  tileLbl: { fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 0.4, marginBottom: 3 },
  sparkline: { flexDirection: "row", alignItems: "flex-end", gap: 2, height: 10 },
  sparkBar: { flex: 1, borderRadius: 2 },

  listCard: { backgroundColor: C.surface, marginTop: 6, borderRadius: 0 },
  listHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 7, paddingBottom: 4,
  },
  listHeading: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.textMuted, letterSpacing: 1.4 },

  row: {
    flexDirection: "row", alignItems: "center", gap: 11,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  flagBox: {
    width: 38, height: 38, borderRadius: 11, backgroundColor: C.raised,
    alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0,
    borderWidth: 1, borderColor: C.border,
  },
  flagTxt: { fontSize: 19 },
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
  qaIcon: { width: 36, height: 36, marginBottom: 4, resizeMode: "contain" },
  qaIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  qaLabel: { fontFamily: "Inter_700Bold", fontSize: 13, color: C.text },
  qaSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },

});
