import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const TYPE_META: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  completed: { color: C.green,    bg: C.greenDim, label: "Completed", icon: "phone-incoming" },
  initiated: { color: C.blue,     bg: C.blueDim,  label: "Dialing",   icon: "phone-outgoing" },
  ringing:   { color: C.blue,     bg: C.blueDim,  label: "Ringing",   icon: "phone" },
  missed:    { color: C.red,      bg: C.redDim,   label: "Missed",    icon: "phone-missed" },
  inbound:   { color: C.green,    bg: C.greenDim, label: "Incoming",  icon: "phone-incoming" },
  outbound:  { color: C.blue,     bg: C.blueDim,  label: "Outgoing",  icon: "phone-outgoing" },
  voicemail: { color: "#7C3AED",  bg: "rgba(124,58,237,0.09)", label: "Voicemail", icon: "voicemail" },
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

export default function Calls() {
  const insets = useSafeAreaInsets();
  const { calls, refreshCalls } = useApp();
  const [filter, setFilter] = useState("all");
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    refreshCalls();
  }, []);

  const filtered = calls.filter(c => {
    if (filter === "all") return true;
    if (filter === "missed") return c.status === "missed";
    if (filter === "inbound") return c.direction === "inbound";
    if (filter === "outbound") return c.direction === "outbound";
    if (filter === "voicemail") return c.status === "voicemail";
    return true;
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Calls</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingBottom: 2 }}>
          {FILTERS.map(f => (
            <Pressable
              key={f.id}
              style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
              onPress={() => setFilter(f.id)}
            >
              <Text style={[styles.filterTxt, filter === f.id && styles.filterTxtActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: (isWeb ? 84 : 66) + (insets.bottom > 0 ? insets.bottom : 16) }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 80 }}>
            <Feather name="phone" size={40} color={C.textMuted} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 17, color: C.textSec, marginTop: 12 }}>
              {filter === "all" ? "No calls yet" : `No ${filter} calls`}
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted, marginTop: 4 }}>
              {filter === "all" ? "Your call history will appear here" : "Try a different filter"}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusKey = item.status === "voicemail" ? "voicemail" : item.status === "missed" ? "missed" : item.direction;
          const m = TYPE_META[statusKey] ?? TYPE_META.completed;
          const contactNumber = item.direction === "inbound" ? item.from_number : item.to_number;
          const durationStr = item.duration > 0
            ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, "0")}`
            : "";
          return (
            <Pressable style={({ pressed }) => [styles.row, { backgroundColor: pressed ? C.surface : C.bg }]}>
              <View style={[styles.iconWrap, { backgroundColor: m.bg }]}>
                <Feather name={m.icon as any} size={17} color={m.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, item.status === "missed" && { color: C.red }]}>
                  {contactNumber}
                </Text>
                <Text style={styles.num}>
                  📱 {contactNumber}{durationStr ? ` · ${durationStr}` : ""}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 5 }}>
                <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
                <View style={[styles.typePill, { backgroundColor: m.bg }]}>
                  <Text style={[styles.typeTxt, { color: m.color }]}>{m.label}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  headerWrap: { backgroundColor: C.surface, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.4, marginBottom: 12 },
  filterChip: { height: 28, paddingHorizontal: 12, borderRadius: 99, borderWidth: 1.5, borderColor: C.border, alignItems: "center", justifyContent: "center" },
  filterChipActive: { borderColor: C.accent, backgroundColor: C.accentDim },
  filterTxt: { fontFamily: "Inter_600SemiBold", fontSize: 11.5, color: C.textMuted },
  filterTxtActive: { color: C.accent },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 13, gap: 11 },
  iconWrap: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 13.5, color: C.text, marginBottom: 2 },
  num: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  time: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  typePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  typeTxt: { fontFamily: "Inter_700Bold", fontSize: 9 },
  sep: { height: 1, backgroundColor: C.border },
});
