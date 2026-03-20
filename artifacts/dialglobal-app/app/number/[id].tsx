import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function NumberDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { numbers, removeNumber } = useApp();
  const num = numbers.find(n => n.id === id);

  const [forwarding, setForwarding] = useState(false);
  const [voicemail, setVoicemail] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [callNotif, setCallNotif] = useState(true);

  if (!num) return (
    <View style={[styles.root, { justifyContent: "center", alignItems: "center" }]}>
      <Feather name="alert-circle" size={40} color={C.textMuted} />
      <Text style={{ color: C.textMuted, fontFamily: "Inter_400Regular", marginTop: 10 }}>Number not found</Text>
      <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ color: C.accent, fontFamily: "Inter_500Medium" }}>Go Back</Text>
      </Pressable>
    </View>
  );

  const handleDelete = () => {
    Alert.alert("Release Number?", `${num.number} will be permanently released.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Release", style: "destructive", onPress: () => { removeNumber(num.id); router.back(); } },
    ]);
  };

  function Row({ icon, label, val, onToggle, onPress }: { icon: string; label: string; val?: boolean; onToggle?: (v: boolean) => void; onPress?: () => void }) {
    return (
      <Pressable style={styles.row} onPress={onPress}>
        <Feather name={icon as any} size={15} color={C.accent} style={{ marginRight: 2 }} />
        <Text style={{ flex: 1, fontFamily: "Inter_500Medium", fontSize: 14, color: C.text }}>{label}</Text>
        {onToggle !== undefined ? (
          <Switch value={val} onValueChange={onToggle} trackColor={{ false: C.raised, true: C.accent }} thumbColor="#fff" />
        ) : <Feather name="chevron-right" size={16} color={C.textMuted} />}
      </Pressable>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.hdr}>
        <Pressable onPress={() => router.back()} hitSlop={12}><Feather name="arrow-left" size={22} color={C.text} /></Pressable>
        <Text style={styles.hdrTxt}>Number Detail</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <View style={styles.hero}>
          <Text style={styles.flagBig}>{num.flag}</Text>
          <Text style={styles.numTxt}>{num.number}</Text>
          <Text style={styles.numCountry}>{num.country}</Text>
          <View style={[styles.badge, { backgroundColor: num.type === "permanent" ? C.accentDim : C.greenDim }]}>
            <Text style={[styles.badgeTxt, { color: num.type === "permanent" ? C.accent : C.green }]}>
              {num.type === "permanent" ? "Permanent" : `Expires in ${num.expiresIn}`}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[{ v: num.calls, l: "Calls" }, { v: num.sms, l: "Messages" }, { v: num.missedCalls, l: "Missed" }].map(s => (
            <View key={s.l} style={styles.stat}>
              <Text style={styles.statVal}>{s.v}</Text>
              <Text style={styles.statLbl}>{s.l}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quickRow}>
          {[{ icon: "phone", label: "Call" }, { icon: "message-square", label: "Message" }, { icon: "copy", label: "Copy" }].map(q => (
            <Pressable key={q.label} style={styles.quickBtn}>
              <Feather name={q.icon as any} size={18} color={C.accent} />
              <Text style={styles.quickLbl}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.secTitle}>FEATURES</Text>
        <View style={styles.card}>
          <Row icon="phone-forwarded" label="Call Forwarding" val={forwarding} onToggle={setForwarding} />
          <View style={styles.div} />
          <Row icon="voicemail" label="Voicemail" val={voicemail} onToggle={setVoicemail} />
          <View style={styles.div} />
          <Row icon="message-circle" label="SMS Notifications" val={smsNotif} onToggle={setSmsNotif} />
          <View style={styles.div} />
          <Row icon="phone-call" label="Call Notifications" val={callNotif} onToggle={setCallNotif} />
        </View>

        <Text style={styles.secTitle}>MANAGE</Text>
        <View style={styles.card}>
          <Row icon="edit-3" label="Rename Number" onPress={() => {}} />
          <View style={styles.div} />
          <Row icon="clock" label="Auto-Reply Scheduler" onPress={() => {}} />
        </View>

        <Pressable style={({ pressed }) => [styles.releaseBtn, { opacity: pressed ? 0.8 : 1 }]} onPress={handleDelete}>
          <Feather name="trash-2" size={16} color={C.red} />
          <Text style={styles.releaseTxt}>Release this Number</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  hdr: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 16 },
  hdrTxt: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },
  hero: { alignItems: "center", paddingVertical: 28, gap: 6 },
  flagBig: { fontSize: 52 },
  numTxt: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text, letterSpacing: -0.5 },
  numCountry: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99, marginTop: 4 },
  badgeTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  statsRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 16, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  stat: { flex: 1, alignItems: "center", paddingVertical: 16, gap: 4 },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text },
  statLbl: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  quickRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 20, gap: 10 },
  quickBtn: { flex: 1, height: 60, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center", gap: 6 },
  quickLbl: { fontFamily: "Inter_500Medium", fontSize: 11.5, color: C.textSec },
  secTitle: { paddingHorizontal: 16, paddingBottom: 8, fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted, letterSpacing: 1 },
  card: { marginHorizontal: 16, marginBottom: 20, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 14, gap: 12 },
  div: { height: 1, backgroundColor: C.border, marginLeft: 42 },
  releaseBtn: { marginHorizontal: 16, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: C.red, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: C.redDim },
  releaseTxt: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.red },
});
