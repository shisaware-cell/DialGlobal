import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";

const DND_OPTIONS = ["Off", "10 PM – 7 AM", "11 PM – 8 AM", "12 AM – 9 AM", "All day"];

export default function NotificationsSettings() {
  const insets = useSafeAreaInsets();

  const [incomingCalls, setIncomingCalls]   = useState(true);
  const [missedCalls, setMissedCalls]       = useState(true);
  const [newMessages, setNewMessages]       = useState(true);
  const [voicemail, setVoicemail]           = useState(true);
  const [billingAlerts, setBillingAlerts]   = useState(true);
  const [planUpdates, setPlanUpdates]       = useState(false);
  const [callRecording, setCallRecording]   = useState(true);
  const [dndIndex, setDndIndex]             = useState(0);
  const [emailNotifs, setEmailNotifs]       = useState(true);
  const [sound, setSound]                   = useState(true);
  const [vibration, setVibration]           = useState(true);

  const save = () => {
    Alert.alert("Saved", "Your notification preferences have been updated.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={C.textSec} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSub}>Manage how DialGlobal alerts you</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}>

        <Text style={styles.sectionLabel}>CALLS</Text>
        <View style={styles.card}>
          <Row icon="phone-incoming" label="Incoming Calls" sub="Alert when a call arrives" value={incomingCalls} onToggle={setIncomingCalls} />
          <Div />
          <Row icon="phone-missed" label="Missed Calls" sub="Notify when you miss a call" value={missedCalls} onToggle={setMissedCalls} iconColor={C.red} iconBg={C.redDim} />
          <Div />
          <Row icon="voicemail" label="Voicemail" sub="New voicemail notification" value={voicemail} onToggle={setVoicemail} iconColor={C.purple} iconBg={C.purpleDim} />
          <Div />
          <Row icon="mic" label="Recording Complete" sub="When a call recording is ready" value={callRecording} onToggle={setCallRecording} />
        </View>

        <Text style={styles.sectionLabel}>MESSAGES</Text>
        <View style={styles.card}>
          <Row icon="message-square" label="New Messages" sub="SMS & MMS notifications" value={newMessages} onToggle={setNewMessages} iconColor={C.blue} iconBg={C.blueDim} />
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.card}>
          <Row icon="credit-card" label="Billing Alerts" sub="Low balance and payment notices" value={billingAlerts} onToggle={setBillingAlerts} />
          <Div />
          <Row icon="star" label="Plan & Feature Updates" sub="New features and promotions" value={planUpdates} onToggle={setPlanUpdates} />
          <Div />
          <Row icon="mail" label="Email Notifications" sub="Summary and receipts via email" value={emailNotifs} onToggle={setEmailNotifs} />
        </View>

        <Text style={styles.sectionLabel}>SOUND & VIBRATION</Text>
        <View style={styles.card}>
          <Row icon="volume-2" label="Sound" sub="Play sound for notifications" value={sound} onToggle={setSound} iconColor={C.blue} iconBg={C.blueDim} />
          <Div />
          <Row icon="smartphone" label="Vibration" sub="Vibrate for calls and messages" value={vibration} onToggle={setVibration} />
        </View>

        <Text style={styles.sectionLabel}>DO NOT DISTURB</Text>
        <View style={styles.card}>
          {DND_OPTIONS.map((opt, i) => (
            <React.Fragment key={opt}>
              {i > 0 && <Div />}
              <Pressable style={styles.dndRow} onPress={() => setDndIndex(i)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{opt === "Off" ? "Do Not Disturb: Off" : opt}</Text>
                  {opt !== "Off" && <Text style={styles.rowSub}>Silence all notifications</Text>}
                </View>
                <View style={dndIndex === i ? styles.radioOn : styles.radioOff}>
                  {dndIndex === i && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            </React.Fragment>
          ))}
        </View>

        <Pressable style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveBtnTxt}>Save Preferences</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

function Row({ icon, label, sub, value, onToggle, iconColor, iconBg }: {
  icon: string; label: string; sub?: string;
  value: boolean; onToggle: (v: boolean) => void;
  iconColor?: string; iconBg?: string;
}) {
  return (
    <View style={styles.cardRow}>
      <View style={[styles.iconBox, { backgroundColor: iconBg ?? C.raised }]}>
        <Feather name={icon as any} size={15} color={iconColor ?? C.accent} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      <Switch value={value} onValueChange={onToggle} trackColor={{ false: C.raised, true: C.accent }} thumbColor="#fff" />
    </View>
  );
}

function Div() { return <View style={styles.divider} />; }

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", marginTop: 2 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.5 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 2 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 8, marginTop: 16, paddingLeft: 4 },
  card: { backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  cardRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  iconBox: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontFamily: "Inter_500Medium", fontSize: 13.5, color: C.text },
  rowSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },
  dndRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 14, gap: 12 },
  radioOn: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.accent, alignItems: "center", justifyContent: "center" },
  radioOff: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: C.accent },
  saveBtn: { marginTop: 24, height: 52, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  saveBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 15.5, color: C.onAccent },
});
