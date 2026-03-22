import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, Pressable, Platform, TextInput, KeyboardAvoidingView, Modal,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp, Message, Call } from "@/context/AppContext";
import { api } from "@/lib/api";
import { CharBored } from "@/components/Characters";

type ThreadItem = {
  id: string;
  name: string;
  number: string;
  preview: string;
  time: string;
  unread: number;
  flag: string;
  type: string;
};

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "Now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function ChatView({ item, onBack }: { item: ThreadItem; onBack: () => void }) {
  const { numbers, isInTrial, trialSmsUsed } = useApp();
  const TRIAL_SMS_LIMIT = 10;
  const [input, setInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [showTrialSmsModal, setShowTrialSmsModal] = useState(false);
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    api.getMessages().then(res => {
      const filtered = (res.messages || []).filter(
        (m: Message) => m.from_number === item.number || m.to_number === item.number
      );
      setChatMsgs(filtered.reverse());
    }).catch(() => {});
  }, [item.number]);

  const send = async () => {
    if (!input.trim() || !numbers[0]) return;
    if (isInTrial && trialSmsUsed >= TRIAL_SMS_LIMIT) {
      setShowTrialSmsModal(true);
      return;
    }
    setSending(true);
    try {
      const res = await api.sendMessage(numbers[0].phone_number, item.number, input);
      setChatMsgs(prev => [...prev, res.message]);
      setInput("");
    } catch (err: any) {
      console.log("Send error:", err.message);
    }
    setSending(false);
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
        data={chatMsgs}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 14, gap: 8 }}
        ListHeaderComponent={<Text style={cv.dateLabel}>Today</Text>}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 60 }}>
            <Feather name="message-circle" size={40} color={C.textMuted} />
            <Text style={{ fontFamily: "Inter_500Medium", color: C.textMuted, marginTop: 12 }}>No messages yet</Text>
            <Text style={{ fontFamily: "Inter_400Regular", color: C.textMuted, fontSize: 12, marginTop: 4 }}>Send a message to start the conversation</Text>
          </View>
        }
        renderItem={({ item: m }) => {
          const isMe = m.direction === "outbound";
          return (
            <View style={{ alignItems: isMe ? "flex-end" : "flex-start" }}>
              <View style={[cv.bubble, isMe ? cv.mine : cv.theirs]}>
                <Text style={[cv.bubbleTxt, isMe && { color: C.onAccent }]}>{m.body}</Text>
                <Text style={[cv.timeStamp, isMe && { color: "rgba(15,14,13,0.5)" }]}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={[cv.inputRow, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          value={input} onChangeText={setInput} placeholder="Message…"
          placeholderTextColor={C.textMuted} style={cv.msgInput}
          onSubmitEditing={send} returnKeyType="send"
        />
        <Pressable style={({ pressed }) => [cv.sendBtn, { opacity: pressed || sending ? 0.6 : 1 }]} onPress={send} disabled={sending}>
          <Feather name="send" size={16} color={C.onAccent} />
        </Pressable>
      </View>

      <Modal visible={showTrialSmsModal} transparent animationType="fade" onRequestClose={() => setShowTrialSmsModal(false)}>
        <View style={cv.limitOverlay}>
          <View style={cv.limitCard}>
            <CharBored size={120} />
            <Text style={cv.limitTitle}>You are out of trial SMS</Text>
            <Text style={cv.limitSub}>You have used all {TRIAL_SMS_LIMIT} trial messages. Upgrade to keep texting.</Text>
            <Pressable
              style={cv.limitUpgradeBtn}
              onPress={() => {
                setShowTrialSmsModal(false);
                router.push("/paywall");
              }}
            >
              <Text style={cv.limitUpgradeTxt}>Upgrade Plan →</Text>
            </Pressable>
            <Pressable style={cv.limitCloseBtn} onPress={() => setShowTrialSmsModal(false)}>
              <Text style={cv.limitCloseTxt}>Not now</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const CALL_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  missed:     { bg: C.redDim,   color: C.red,     label: "Missed" },
  completed:  { bg: C.greenDim, color: C.green,   label: "Completed" },
  initiated:  { bg: C.blueDim,  color: C.blue,    label: "Dialing" },
  ringing:    { bg: C.blueDim,  color: C.blue,    label: "Ringing" },
};

export default function Inbox() {
  const insets = useSafeAreaInsets();
  const { messages, calls, refreshMessages, refreshCalls, numbers } = useApp();
  const [tab, setTab] = useState<"messages" | "calls">("messages");
  const [selected, setSelected] = useState<ThreadItem | null>(null);
  const isWeb = Platform.OS === "web";
  const tabBarH = isWeb ? 84 : 66;

  useEffect(() => {
    refreshMessages();
    refreshCalls();
  }, []);

  const threads: ThreadItem[] = React.useMemo(() => {
    const map = new Map<string, ThreadItem>();
    for (const m of messages) {
      const contact = m.direction === "inbound" ? m.from_number : m.to_number;
      if (!map.has(contact)) {
        map.set(contact, {
          id: m.id,
          name: contact,
          number: contact,
          preview: m.body,
          time: timeAgo(m.created_at),
          unread: !m.read && m.direction === "inbound" ? 1 : 0,
          flag: "📱",
          type: "sms",
        });
      } else {
        const existing = map.get(contact)!;
        if (!m.read && m.direction === "inbound") existing.unread++;
      }
    }
    return Array.from(map.values());
  }, [messages]);

  const callItems = React.useMemo(() => {
    return calls.map(c => ({
      ...c,
      name: c.direction === "inbound" ? c.from_number : c.to_number,
      flag: "📱",
      type: c.status,
      time: timeAgo(c.created_at),
      durationStr: c.duration > 0 ? `${Math.floor(c.duration / 60)}:${(c.duration % 60).toString().padStart(2, "0")}` : "",
    }));
  }, [calls]);

  if (selected) return <ChatView item={selected} onBack={() => setSelected(null)} />;

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>

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

      {tab === "messages" ? (
        <FlatList
          data={threads}
          keyExtractor={m => m.id}
          contentContainerStyle={{ paddingBottom: tabBarH + (insets.bottom > 0 ? insets.bottom : 16) }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingTop: 80 }}>
              <Feather name="message-circle" size={40} color={C.textMuted} />
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 17, color: C.textSec, marginTop: 12 }}>No messages yet</Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted, marginTop: 4 }}>Messages will appear here</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.msgRow, { backgroundColor: pressed ? C.surface : C.bg }]}
              onPress={() => setSelected(item)}
            >
              <View style={[styles.msgAvatar, { backgroundColor: item.unread > 0 ? C.accentDim : C.raised }]}>
                <Text style={{ fontSize: 20 }}>{item.flag}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={styles.msgTop}>
                  <Text style={[styles.msgName, item.unread > 0 && { fontFamily: "Inter_700Bold", color: C.text }]}>
                    {item.name}
                  </Text>
                  <Text style={styles.msgTime}>{item.time}</Text>
                </View>
                <View style={styles.msgBot}>
                  <Text style={styles.msgPreview} numberOfLines={1}>{item.preview}</Text>
                  {item.unread > 0 && (
                    <View style={styles.badge}><Text style={styles.badgeTxt}>{item.unread}</Text></View>
                  )}
                </View>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      ) : (
        <FlatList
          data={callItems}
          keyExtractor={c => c.id}
          contentContainerStyle={{ paddingBottom: tabBarH + (insets.bottom > 0 ? insets.bottom : 16) }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingTop: 80 }}>
              <Feather name="phone" size={40} color={C.textMuted} />
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 17, color: C.textSec, marginTop: 12 }}>No calls yet</Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted, marginTop: 4 }}>Call history will appear here</Text>
            </View>
          }
          renderItem={({ item: cl }) => {
            const cv2 = CALL_COLORS[cl.status] ?? CALL_COLORS.completed;
            return (
              <Pressable style={({ pressed }) => [styles.msgRow, { backgroundColor: pressed ? C.surface : C.bg }]}>
                <View style={[styles.callIcon, { backgroundColor: cv2.bg }]}>
                  <Feather name="phone" size={17} color={cv2.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.msgName, cl.status === "missed" && { color: C.red }]}>{cl.name}</Text>
                  <Text style={styles.callNum}>{cl.flag} {cl.direction === "inbound" ? cl.from_number : cl.to_number}{cl.durationStr ? ` · ${cl.durationStr}` : ""}</Text>
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
  limitOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  limitCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: C.surface,
    borderRadius: 22,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  limitTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: C.text,
    textAlign: "center",
    marginTop: 6,
  },
  limitSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textSec,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  limitUpgradeBtn: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: C.accent,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  limitUpgradeTxt: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.onAccent },
  limitCloseBtn: { paddingVertical: 9, paddingHorizontal: 10, marginTop: 8 },
  limitCloseTxt: { fontFamily: "Inter_500Medium", fontSize: 12.5, color: C.textMuted },
});
