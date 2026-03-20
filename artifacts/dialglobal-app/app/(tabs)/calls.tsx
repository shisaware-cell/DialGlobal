import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { MOCK_CALLS } from "@/data/mockData";

const TYPE_META: Record<string, { color: string; bg: string; label: string }> = {
  incoming:  { color: C.green,   bg: C.greenDim, label: "Incoming" },
  outgoing:  { color: C.blue,    bg: C.blueDim,  label: "Outgoing" },
  missed:    { color: C.red,     bg: C.redDim,   label: "Missed" },
  voicemail: { color: C.textSec, bg: C.raised,   label: "Voicemail" },
};

export default function Calls() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Calls</Text>
      </View>
      <FlatList
        data={MOCK_CALLS}
        keyExtractor={c => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: (isWeb ? 84 : 66) + (insets.bottom > 0 ? insets.bottom : 16) }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => {
          const m = TYPE_META[item.type] ?? TYPE_META.outgoing;
          return (
            <Pressable style={({ pressed }) => [styles.row, { backgroundColor: pressed ? C.surface : C.bg }]}>
              <View style={[styles.iconWrap, { backgroundColor: m.bg }]}>
                <Feather name="phone" size={17} color={m.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, item.type === "missed" && { color: C.red }]}>{item.name}</Text>
                <Text style={styles.num}>{item.flag} {item.number}{item.duration ? ` · ${item.duration}` : ""}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 5 }}>
                <Text style={styles.time}>{item.time}</Text>
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
  headerWrap: { backgroundColor: C.surface, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.4 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 13, gap: 11 },
  iconWrap: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 13.5, color: C.text, marginBottom: 2 },
  num: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  time: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  typePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  typeTxt: { fontFamily: "Inter_700Bold", fontSize: 9 },
  sep: { height: 1, backgroundColor: C.border },
});
