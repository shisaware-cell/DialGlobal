import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { MOCK_CALLS } from "@/data/mockData";

const TYPE_META: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  incoming:  { color: C.green, bg: C.greenDim, label: "Incoming",  icon: "phone-incoming" },
  outgoing:  { color: C.blue,  bg: C.blueDim,  label: "Outgoing",  icon: "phone-outgoing" },
  missed:    { color: C.red,   bg: C.redDim,   label: "Missed",    icon: "phone-missed" },
  voicemail: { color: C.textSec, bg: C.raised, label: "Voicemail", icon: "voicemail" },
};

export default function Calls() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      <Text style={styles.title}>Calls</Text>
      <FlatList
        data={MOCK_CALLS}
        keyExtractor={c => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: (isWeb ? 84 : 66) + (insets.bottom > 0 ? insets.bottom : 16) }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => {
          const m = TYPE_META[item.type] || TYPE_META.outgoing;
          return (
            <Pressable style={({ pressed }) => [styles.row, { backgroundColor: pressed ? C.raised : "transparent" }]}>
              <View style={[styles.iconWrap, { backgroundColor: m.bg }]}>
                <Feather name={m.icon as any} size={18} color={m.color} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={styles.rowTop}>
                  <Text style={[styles.name, item.type === "missed" && { color: C.red }]}>{item.name}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={styles.rowBot}>
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.num}>{item.number}</Text>
                  {item.duration ? (
                    <><View style={styles.dotSep} /><Text style={styles.dur}>{item.duration}</Text></>
                  ) : null}
                </View>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: m.bg }]}>
                <Text style={[styles.typeTxt, { color: m.color }]}>{m.label}</Text>
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
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, paddingHorizontal: 20, paddingBottom: 14, letterSpacing: -0.8 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13, gap: 13 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  rowTop: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14.5, color: C.text },
  time: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  rowBot: { flexDirection: "row", alignItems: "center", gap: 5 },
  flag: { fontSize: 13 },
  num: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textMuted, letterSpacing: -0.2 },
  dotSep: { width: 3, height: 3, borderRadius: 99, backgroundColor: C.textMuted },
  dur: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textMuted },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  typeTxt: { fontFamily: "Inter_600SemiBold", fontSize: 10.5 },
  sep: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },
});
