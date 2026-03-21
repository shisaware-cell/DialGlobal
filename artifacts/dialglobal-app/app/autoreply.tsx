import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, Switch,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const TEMPLATES = [
  "I'm currently unavailable. I'll get back to you soon.",
  "Hi! I'm in a meeting right now. I'll reply shortly.",
  "Travelling at the moment — will respond when I land!",
  "This number is for business hours only (Mon–Fri 9–5).",
  "Please send your enquiry to email instead.",
];

export default function AutoReply() {
  const insets = useSafeAreaInsets();
  const { numbers, autoReplies, setAutoReply } = useApp();
  const [activeNum, setActiveNum] = useState(numbers[0]?.id || "");
  const [text, setText]           = useState(autoReplies[numbers[0]?.id || ""] || "");
  const [enabled, setEnabled]     = useState(!!autoReplies[numbers[0]?.id || ""]);
  const [saved, setSaved]         = useState(false);

  const selectNum = (id: string) => {
    setActiveNum(id);
    setText(autoReplies[id] || "");
    setEnabled(!!autoReplies[id]);
    setSaved(false);
  };

  const save = () => {
    if (activeNum) setAutoReply(activeNum, enabled ? text : "");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={C.textSec} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Auto-Reply</Text>
          <Text style={styles.headerSub}>Send automatic replies when away</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        {numbers.length > 1 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionLabel}>SELECT NUMBER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              {numbers.map(n => (
                <Pressable
                  key={n.id}
                  style={[styles.numChip, activeNum === n.id && styles.numChipActive]}
                  onPress={() => selectNum(n.id)}
                >
                  <Text style={{ fontSize: 14 }}>{n.flag}</Text>
                  <Text style={[styles.numChipTxt, activeNum === n.id && { color: C.accent }]}>
                    {n.phone_number.slice(0, 8)}…
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.toggleCard}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.toggleLabel}>Enable Auto-Reply</Text>
            <Text style={styles.toggleSub}>Send when you're unavailable</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: C.raised, true: C.accent }}
            thumbColor="#fff"
          />
        </View>

        {enabled && (
          <>
            <Text style={styles.sectionLabel}>YOUR MESSAGE</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type your auto-reply message…"
              placeholderTextColor={C.textMuted}
              multiline
              numberOfLines={4}
              style={styles.textarea}
              maxLength={160}
            />
            <Text style={styles.charCount}>{text.length}/160</Text>

            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>QUICK TEMPLATES</Text>
            <View style={{ gap: 7 }}>
              {TEMPLATES.map((t, i) => (
                <Pressable key={i} style={({ pressed }) => [styles.template, pressed && { backgroundColor: C.raised }]} onPress={() => setText(t)}>
                  <Text style={styles.templateTxt}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 20 }} />

        {saved ? (
          <View style={styles.savedBanner}>
            <Feather name="check" size={16} color={C.green} />
            <Text style={styles.savedTxt}>Auto-reply saved!</Text>
          </View>
        ) : (
          <Pressable style={({ pressed }) => [styles.saveBtn, { opacity: pressed ? 0.88 : 1 }]} onPress={save}>
            <Text style={styles.saveBtnTxt}>Save Auto-Reply</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface },
  backBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", marginTop: 2 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 1 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 8 },
  numChip: { flexDirection: "row", alignItems: "center", gap: 6, height: 36, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surface },
  numChipActive: { borderColor: C.accent, backgroundColor: C.accentDim },
  numChipTxt: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: C.textSec },
  toggleCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 14, marginBottom: 20 },
  toggleLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  toggleSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  textarea: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 12, fontSize: 13.5, color: C.text, fontFamily: "Inter_400Regular", lineHeight: 22, minHeight: 100, textAlignVertical: "top" },
  charCount: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, textAlign: "right", marginTop: 4, marginBottom: 14 },
  template: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 12 },
  templateTxt: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textSec, lineHeight: 20 },
  savedBanner: { height: 52, backgroundColor: C.greenDim, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  savedTxt: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.green },
  saveBtn: { height: 52, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  saveBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },
});
