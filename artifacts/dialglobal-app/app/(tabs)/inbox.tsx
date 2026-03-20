import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { MOCK_MESSAGES } from "@/data/mockData";

type Msg = typeof MOCK_MESSAGES[0];

function ConvoView({ item, onBack }: { item: Msg; onBack: () => void }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { id: "1", from: "them" as const, text: "Hey, are you free for a call tomorrow?" },
    { id: "2", from: "them" as const, text: "I wanted to discuss the project timeline" },
    { id: "3", from: "me" as const, text: "Sure! I'm free after 3pm" },
  ]);
  const insets = useSafeAreaInsets();

  const send = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { id: Date.now().toString(), from: "me", text: input }]);
    setInput("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={[cv.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </Pressable>
        <Text style={cv.flag}>{item.flag}</Text>
        <View style={{ flex: 1 }}>
          <Text style={cv.name}>{item.name}</Text>
          <Text style={cv.num}>{item.number}</Text>
        </View>
        <Pressable style={cv.callBtn}>
          <Feather name="phone" size={17} color={C.green} />
        </Pressable>
      </View>
      <FlatList
        data={msgs}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item: m }) => (
          <View style={{ alignItems: m.from === "me" ? "flex-end" : "flex-start" }}>
            <View style={[cv.bubble, m.from === "me" ? cv.mine : cv.theirs]}>
              <Text style={[cv.bubbleTxt, m.from === "me" && { color: "#0D0D0E" }]}>{m.text}</Text>
            </View>
          </View>
        )}
      />
      <View style={[cv.inputRow, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput value={input} onChangeText={setInput} placeholder="Message…" placeholderTextColor={C.textMuted}
          style={cv.msgInput} onSubmitEditing={send} returnKeyType="send" />
        <Pressable style={({ pressed }) => [cv.sendBtn, { opacity: pressed ? 0.8 : 1 }]} onPress={send}>
          <Feather name="send" size={16} color="#0D0D0E" />
        </Pressable>
      </View>
    </View>
  );
}

function MsgRow({ item, onPress }: { item: Msg; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.row, { backgroundColor: pressed ? C.raised : "transparent" }]} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: item.unread > 0 ? C.accentDim : C.raised }]}>
        <Text style={styles.flag}>{item.flag}</Text>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <View style={styles.rowTop}>
          <Text style={[styles.name, item.unread > 0 && { color: C.text, fontFamily: "Inter_700Bold" }]}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.rowBot}>
          <Text style={[styles.preview, item.type === "missed" && { color: C.red }]} numberOfLines={1}>
            {item.type === "missed" ? "Missed call" : item.preview}
          </Text>
          {item.unread > 0 && (
            <View style={styles.badge}><Text style={styles.badgeTxt}>{item.unread}</Text></View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function Inbox() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Msg | null>(null);
  const [search, setSearch] = useState("");
  const isWeb = Platform.OS === "web";

  if (selected) return <ConvoView item={selected} onBack={() => setSelected(null)} />;

  const filtered = MOCK_MESSAGES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      <Text style={styles.title}>Inbox</Text>
      <View style={styles.searchWrap}>
        <Feather name="search" size={15} color={C.textMuted} style={{ marginLeft: 12 }} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search messages…" placeholderTextColor={C.textMuted}
          style={styles.searchInput} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={m => m.id}
        renderItem={({ item }) => <MsgRow item={item} onPress={() => setSelected(item)} />}
        contentContainerStyle={{ paddingBottom: (isWeb ? 84 : 66) + (insets.bottom > 0 ? insets.bottom : 16) }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, paddingHorizontal: 20, paddingBottom: 14, letterSpacing: -0.8 },
  searchWrap: { marginHorizontal: 16, marginBottom: 8, flexDirection: "row", alignItems: "center", backgroundColor: C.raised, borderRadius: 12, borderWidth: 1, borderColor: C.border, height: 42 },
  searchInput: { flex: 1, height: "100%", paddingHorizontal: 10, fontSize: 14, color: C.text, fontFamily: "Inter_400Regular" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13, gap: 13 },
  avatar: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  flag: { fontSize: 22 },
  rowTop: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontFamily: "Inter_500Medium", fontSize: 14.5, color: C.textSec },
  time: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  rowBot: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  preview: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted, flex: 1 },
  badge: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.red, paddingHorizontal: 4, alignItems: "center", justifyContent: "center" },
  badgeTxt: { fontFamily: "Inter_700Bold", fontSize: 10, color: "#fff" },
  sep: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },
});

const cv = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface },
  flag: { fontSize: 24 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text },
  num: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  callBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.greenDim, alignItems: "center", justifyContent: "center" },
  bubble: { maxWidth: "78%", borderRadius: 16, padding: 12, paddingHorizontal: 14 },
  mine: { backgroundColor: C.accent, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: C.raised, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: C.border },
  bubbleTxt: { fontFamily: "Inter_400Regular", fontSize: 14.5, color: C.text, lineHeight: 22 },
  inputRow: { flexDirection: "row", padding: 12, gap: 10, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.surface, alignItems: "center" },
  msgInput: { flex: 1, height: 44, backgroundColor: C.raised, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, fontSize: 14.5, color: C.text, fontFamily: "Inter_400Regular" },
  sendBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
});
