import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, FlatList, Pressable, Platform, TextInput, KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { MOCK_MESSAGES, MOCK_CALLS } from "@/data/mockData";

type Msg = typeof MOCK_MESSAGES[0];

function ChatView({ item, onBack }: { item: Msg; onBack: () => void }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { id: "1", from: "them" as const, text: "Hey, are you free for a call tomorrow?",  time: "2:14 PM" },
    { id: "2", from: "them" as const, text: "I wanted to discuss the project timeline",  time: "2:15 PM" },
    { id: "3", from: "me"   as const, text: "Sure! I'm free after 3pm 👍",              time: "2:18 PM" },
  ]);
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const send = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { id: Date.now().toString(), from: "me", text: input, time: "Now" }]);
    setInput("");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[cv.header, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Feather name="arrow-left" size={20} color={C.text} strokeWidth={2.2} />
        </Pressable>
        <View style={cv.flagAvatar}><Text style={{ fontSize: 18 }}>{item.flag}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={cv.name}>{item.name}</Text>
          <Text style={cv.num}>{item.number}</Text>
        </View>
        <Pressable style={cv.callBtn}>
          <Feather name="phone" size={15} color={C.green} />
        </Pressable>
      </View>

      <FlatList
        data={msgs}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 14, gap: 8 }}
        ListHeaderComponent={<Text style={cv.dateLabel}>Today</Text>}
        renderItem={({ item: m }) => (
          <View style={{ alignItems: m.from === "me" ? "flex-end" : "flex-start" }}>
            <View style={[cv.bubble, m.from === "me" ? cv.mine : cv.theirs]}>
              <Text style={[cv.bubbleTxt, m.from === "me" && { color: C.onAccent }]}>{m.text}</Text>
              <Text style={[cv.timeStamp, m.from === "me" && { color: "rgba(15,14,13,0.5)" }]}>{m.time}</Text>
            </View>
          </View>
        )}
      />

      <View style={[cv.inputRow, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          value={input} onChangeText={setInput} placeholder="Message…"
          placeholderTextColor={C.textMuted} style={cv.msgInput}
          onSubmitEditing={send} returnKeyType="send"
        />
        <Pressable style={({ pressed }) => [cv.sendBtn, { opacity: pressed ? 0.8 : 1 }]} onPress={send}>
          <Feather name="send" size={16} color={C.onAccent} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const CALL_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  missed:   { bg: C.redDim,   color: C.red,      label: "Missed" },
  incoming: { bg: C.greenDim, color: C.green,    label: "Incoming" },
  outgoing: { bg: C.blueDim,  color: C.blue,     label: "Outgoing" },
  voicemail:{ bg: C.raised,   color: C.textSec,  label: "Voicemail" },
};

export default function Inbox() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"messages" | "calls">("messages");
  const [selected, setSelected] = useState<Msg | null>(null);
  const isWeb = Platform.OS === "web";
  const tabBarH = isWeb ? 84 : 66;

  if (selected) return <ChatView item={selected} onBack={() => setSelected(null)} />;

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>

      {/* ── Header ── */}
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Inbox</Text>
        <View style={styles.tabs}>
          {(["messages", "calls"] as const).map(t => (
            <Pressable key={t} style={[styles.tabBtn, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
                {t === "messages" ? "Messages" : "Call Log"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Content ── */}
      {tab === "messages" ? (
        <FlatList
          data={MOCK_MESSAGES}
          keyExtractor={m => m.id}
          contentContainerStyle={{ paddingBottom: tabBarH + (insets.bottom > 0 ? insets.bottom : 16) }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isMissed = item.type === "missed";
            const isVoicemail = item.type === "voicemail";
            return (
              <Pressable
                style={({ pressed }) => [styles.msgRow, { backgroundColor: pressed ? C.surface : C.bg }]}
                onPress={() => setSelected(item)}
              >
                <View style={[styles.msgAvatar, { backgroundColor: item.unread > 0 ? C.accentDim : C.raised }]}>
                  <Text style={{ fontSize: 20 }}>{item.flag}</Text>
                  {isMissed && (
                    <View style={styles.missedBadge}>
                      <Feather name="phone-missed" size={6} color="#fff" />
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.msgTop}>
                    <Text style={[styles.msgName, item.unread > 0 && { fontFamily: "Inter_700Bold", color: C.text }]}>
                      {item.name}
                    </Text>
                    <Text style={styles.msgTime}>{item.time}</Text>
                  </View>
                  <View style={styles.msgBot}>
                    <Text
                      style={[styles.msgPreview, isMissed && { color: C.red, fontFamily: "Inter_600SemiBold" }]}
                      numberOfLines={1}
                    >
                      {isMissed ? "Missed call" : isVoicemail ? `Voicemail · ${item.preview.split(": ")[1] || ""}` : item.preview}
                    </Text>
                    {item.unread > 0 && (
                      <View style={styles.badge}><Text style={styles.badgeTxt}>{item.unread}</Text></View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      ) : (
        <FlatList
          data={MOCK_CALLS}
          keyExtractor={c => c.id}
          contentContainerStyle={{ paddingBottom: tabBarH + (insets.bottom > 0 ? insets.bottom : 16) }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: cl }) => {
            const cv2 = CALL_COLORS[cl.type] ?? CALL_COLORS.outgoing;
            return (
              <Pressable style={({ pressed }) => [styles.msgRow, { backgroundColor: pressed ? C.surface : C.bg }]}>
                <View style={[styles.callIcon, { backgroundColor: cv2.bg }]}>
                  <Feather name="phone" size={17} color={cv2.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.msgName, cl.type === "missed" && { color: C.red }]}>{cl.name}</Text>
                  <Text style={styles.callNum}>{cl.flag} {cl.number}{cl.duration ? ` · ${cl.duration}` : ""}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 5 }}>
                  <Text style={styles.msgTime}>{cl.time}</Text>
                  <View style={[styles.callPill, { backgroundColor: cv2.bg }]}>
                    <Text style={[styles.callPillTxt, { color: cv2.color }]}>{cv2.label}</Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  headerWrap: { backgroundColor: C.surface, paddingHorizontal: 20, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.4, marginBottom: 14 },
  tabs: { flexDirection: "row" },
  tabBtn: { flex: 1, height: 36, alignItems: "center", justifyContent: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: C.accent },
  tabTxt: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textMuted },
  tabTxtActive: { fontFamily: "Inter_600SemiBold", color: C.accent },

  msgRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 13, gap: 11 },
  msgAvatar: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 },
  missedBadge: { position: "absolute", bottom: 0, right: 0, width: 15, height: 15, borderRadius: 7.5, backgroundColor: C.red, borderWidth: 2, borderColor: C.bg, alignItems: "center", justifyContent: "center" },
  msgTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 },
  msgName: { fontFamily: "Inter_500Medium", fontSize: 13.5, color: C.text },
  msgTime: { fontFamily: "Inter_400Regular", fontSize: 10.5, color: C.textMuted, flexShrink: 0 },
  msgBot: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  msgPreview: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textSec, flex: 1 },
  badge: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.red, paddingHorizontal: 4, alignItems: "center", justifyContent: "center", marginLeft: 6 },
  badgeTxt: { fontFamily: "Inter_700Bold", fontSize: 10, color: "#fff" },

  callIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  callNum: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 2 },
  callPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  callPillTxt: { fontFamily: "Inter_700Bold", fontSize: 9 },

  sep: { height: 1, backgroundColor: C.border },
});

const cv = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, gap: 11, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface },
  flagAvatar: { width: 38, height: 38, borderRadius: 8, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center" },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14.5, color: C.text },
  num: { fontFamily: "Inter_400Regular", fontSize: 10.5, color: C.textMuted },
  callBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.greenDim, alignItems: "center", justifyContent: "center" },
  dateLabel: { fontFamily: "Inter_500Medium", fontSize: 10.5, color: C.textMuted, textAlign: "center", marginBottom: 4 },
  bubble: { maxWidth: "76%", borderRadius: 18, paddingHorizontal: 13, paddingVertical: 10 },
  mine: { backgroundColor: C.accent, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderBottomLeftRadius: 4 },
  bubbleTxt: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.text, lineHeight: 20 },
  timeStamp: { fontFamily: "Inter_400Regular", fontSize: 9.5, color: C.textMuted, marginTop: 4, textAlign: "right" },
  inputRow: { flexDirection: "row", padding: 13, gap: 9, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.surface, alignItems: "center" },
  msgInput: { flex: 1, height: 42, backgroundColor: C.input, borderRadius: 99, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 16, fontSize: 13.5, color: C.text, fontFamily: "Inter_400Regular" },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", flexShrink: 0 },
});
