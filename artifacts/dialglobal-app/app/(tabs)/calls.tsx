import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform, ScrollView, Alert, Linking } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const TYPE_META: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  completed: { color: C.green,  bg: C.greenDim,  label: "Completed", icon: "phone-incoming" },
  initiated: { color: C.blue,   bg: C.blueDim,   label: "Dialing",   icon: "phone-outgoing" },
  ringing:   { color: C.blue,   bg: C.blueDim,   label: "Ringing",   icon: "phone"          },
  missed:    { color: C.red,    bg: C.redDim,    label: "Missed",    icon: "phone-missed"   },
  inbound:   { color: C.green,  bg: C.greenDim,  label: "Incoming",  icon: "phone-incoming" },
  outbound:  { color: C.blue,   bg: C.blueDim,   label: "Outgoing",  icon: "phone-outgoing" },
  incoming:  { color: C.green,  bg: C.greenDim,  label: "Incoming",  icon: "phone-incoming" },
  outgoing:  { color: C.blue,   bg: C.blueDim,   label: "Outgoing",  icon: "phone-outgoing" },
  voicemail: { color: C.purple, bg: C.purpleDim, label: "Voicemail", icon: "voicemail"      },
};

const FILTERS = [
  { id: "all",       label: "All" },
  { id: "missed",    label: "Missed" },
  { id: "inbound",   label: "Incoming" },
  { id: "outbound",  label: "Outgoing" },
  { id: "voicemail", label: "Voicemail" },
];

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "Now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

type CallItem = {
  id: string;
  name?: string;
  from_number?: string;
  to_number?: string;
  number?: string;
  direction?: string;
  status?: string;
  type?: string;
  duration?: number | string;
  time?: string;
  created_at?: string;
  flag?: string;
};

function CallRow({ item }: { item: CallItem }) {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const statusKey = item.type ?? (item.status === "voicemail" ? "voicemail" : item.status === "missed" ? "missed" : (item.direction ?? item.status ?? "completed"));
  const m = TYPE_META[statusKey] ?? TYPE_META.completed;
  const isVoicemail = statusKey === "voicemail";
  const isMissed = statusKey === "missed";

  const contactNumber = item.number ?? (item.direction === "inbound" ? item.from_number : item.to_number) ?? "";
  const displayName = item.name ?? contactNumber;

  const durationStr = typeof item.duration === "number"
    ? (item.duration > 0 ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, "0")}` : "")
    : (item.duration ?? "");

  const timeStr = item.time ?? (item.created_at ? timeAgo(item.created_at) : "");
  const flagStr = item.flag ?? "📞";

  const handleCallBack = () => {
    if (!contactNumber) return;
    Alert.alert(
      "Call Back",
      `Call ${displayName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => router.push({ pathname: "/dialer", params: { prefill: contactNumber } }) },
      ]
    );
  };

  const handleMessage = () => {
    if (!contactNumber) return;
    router.push({ pathname: "/(tabs)/inbox", params: { compose: contactNumber } });
  };

  const handleForward = () => {
    Alert.alert(
      "Forward Call",
      "Enter a number to forward incoming calls from this contact to:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Set Forward",
          onPress: () => {
            Alert.alert("Forwarding Set", `Calls from ${displayName} will be forwarded to your selected number.`);
          },
        },
      ]
    );
  };

  return (
    <View>
      <Pressable
        style={({ pressed }) => [styles.row, { backgroundColor: pressed ? C.raised : C.bg }]}
        onPress={() => setExpanded(e => !e)}
      >
        <View style={[styles.iconWrap, { backgroundColor: m.bg }]}>
          {item.flag ? (
            <Text style={{ fontSize: 20 }}>{flagStr}</Text>
          ) : (
            <Feather name={m.icon as any} size={17} color={m.color} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, isMissed && { color: C.red }]} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.num} numberOfLines={1}>
            {contactNumber}{durationStr ? ` · ${durationStr}` : ""}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 5 }}>
          <Text style={styles.time}>{timeStr}</Text>
          <View style={[styles.typePill, { backgroundColor: m.bg }]}>
            <Text style={[styles.typeTxt, { color: m.color }]}>{m.label}</Text>
          </View>
        </View>
      </Pressable>

      {expanded && (
        <View style={[styles.expandedRow, { backgroundColor: C.raised }]}>
          {isVoicemail ? (
            <View style={styles.voicemailRow}>
              <Pressable
                style={[styles.playBtn, { backgroundColor: C.purpleDim, borderColor: "rgba(124,58,237,0.2)" }]}
                onPress={() => setPlaying(p => !p)}
              >
                <Feather name={playing ? "pause" : "play"} size={13} color={C.purple} />
                <Text style={[styles.playTxt, { color: C.purple }]}>{playing ? "Pause" : "Play Voicemail"}</Text>
              </Pressable>
              {playing && (
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { backgroundColor: C.purple }]} />
                </View>
              )}
              {durationStr ? <Text style={styles.vmDuration}>{durationStr}</Text> : null}
            </View>
          ) : (
            <View style={styles.actionsRow}>
              <Pressable style={[styles.actionBtn, { backgroundColor: C.accent }]} onPress={handleCallBack}>
                <Feather name="phone" size={12} color={C.onAccent} />
                <Text style={[styles.actionTxt, { color: C.onAccent }]}>Call Back</Text>
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={handleMessage}>
                <Feather name="message-square" size={12} color={C.textSec} />
                <Text style={styles.actionTxt}>Message</Text>
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={handleForward}>
                <Feather name="share" size={12} color={C.textSec} />
                <Text style={styles.actionTxt}>Forward</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      <View style={styles.sep} />
    </View>
  );
}

export default function Calls() {
  const insets = useSafeAreaInsets();
  const { calls, refreshCalls } = useApp();
  const [filter, setFilter] = useState("all");
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    refreshCalls();
  }, []);

  const missedCount = calls.filter(c => c.status === "missed" || (c as any).direction === "missed").length;

  const filtered = calls.filter((c: any) => {
    if (filter === "all") return true;
    if (filter === "missed")   return c.status === "missed"    || c.direction === "missed";
    if (filter === "inbound")  return c.direction === "inbound"  || c.type === "incoming";
    if (filter === "outbound") return c.direction === "outbound" || c.type === "outgoing";
    if (filter === "voicemail") return c.status === "voicemail"  || c.type === "voicemail";
    return true;
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTopRow}>
          <Text style={styles.title}>Calls</Text>
          <Pressable style={styles.dialBtn} onPress={() => router.push("/dialer")}>
            <Feather name="phone-outgoing" size={14} color={C.onAccent} />
            <Text style={styles.dialBtnTxt}>New Call</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingBottom: 2 }}>
          {FILTERS.map(f => (
            <Pressable
              key={f.id}
              style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
              onPress={() => setFilter(f.id)}
            >
              <Text style={[styles.filterTxt, filter === f.id && styles.filterTxtActive]}>{f.label}</Text>
              {f.id === "missed" && missedCount > 0 && (
                <View style={styles.missedBadge}>
                  <Text style={styles.missedBadgeTxt}>{missedCount}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c, i) => (c as any).id ?? String(i)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: (isWeb ? 84 : 66) + (insets.bottom > 0 ? insets.bottom : 16) }}
        ListHeaderComponent={
          <Pressable style={styles.recordingNotice} onPress={() => router.push("/call-recording")}>
            <View style={styles.recordingIcon}>
              <Feather name="mic" size={14} color={C.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recordingTitle}>Call Recording Available</Text>
              <Text style={styles.recordingSub}>Tap to enable per-number recording</Text>
            </View>
            <Feather name="chevron-right" size={14} color={C.accent} />
          </Pressable>
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 80 }}>
            <Feather name="phone" size={40} color={C.textMuted} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 17, color: C.textSec, marginTop: 12 }}>
              {filter === "all" ? "No calls yet" : `No ${filter} calls`}
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted, marginTop: 4, textAlign: "center", paddingHorizontal: 40 }}>
              {filter === "all" ? "Your call history will appear here once you start making and receiving calls." : "Try a different filter"}
            </Text>
          </View>
        }
        renderItem={({ item }) => <CallRow item={item as CallItem} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  headerWrap: { backgroundColor: C.surface, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.4 },
  dialBtn: { flexDirection: "row", alignItems: "center", gap: 5, height: 32, paddingHorizontal: 13, backgroundColor: C.accent, borderRadius: 99 },
  dialBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.onAccent },

  filterChip: { height: 28, paddingHorizontal: 12, borderRadius: 99, borderWidth: 1.5, borderColor: C.border, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 },
  filterChipActive: { borderColor: C.accent, backgroundColor: C.accentDim },
  filterTxt: { fontFamily: "Inter_600SemiBold", fontSize: 11.5, color: C.textMuted },
  filterTxtActive: { color: C.accent },
  missedBadge: { width: 16, height: 16, borderRadius: 8, backgroundColor: C.red, alignItems: "center", justifyContent: "center" },
  missedBadgeTxt: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#fff" },

  recordingNotice: {
    flexDirection: "row", alignItems: "center", gap: 10,
    margin: 12, padding: 12, backgroundColor: C.accentDim,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(232,160,32,0.25)",
  },
  recordingIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(232,160,32,0.2)", alignItems: "center", justifyContent: "center" },
  recordingTitle: { fontFamily: "Inter_700Bold", fontSize: 12.5, color: C.accent },
  recordingSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textSec, marginTop: 1 },

  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 13, gap: 11 },
  iconWrap: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 13.5, color: C.text, marginBottom: 2 },
  num: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  time: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  typePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  typeTxt: { fontFamily: "Inter_700Bold", fontSize: 9 },
  sep: { height: 1, backgroundColor: C.border },

  expandedRow: { paddingHorizontal: 18, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border },
  voicemailRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  playBtn: { flexDirection: "row", alignItems: "center", gap: 7, height: 36, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1 },
  playTxt: { fontFamily: "Inter_700Bold", fontSize: 12.5 },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.raised, overflow: "hidden" },
  progressFill: { width: "35%", height: "100%", borderRadius: 2 },
  vmDuration: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },

  actionsRow: { flexDirection: "row", gap: 8 },
  actionBtn: {
    flex: 1, height: 36, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5,
  },
  actionTxt: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.textSec },
});
