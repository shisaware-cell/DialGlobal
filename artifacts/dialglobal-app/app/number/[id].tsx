import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Clipboard, TextInput, Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function NumberDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const {
    numbers, removeNumber, calls,
    recordings, toggleRecording,
    forwarding, toggleForwarding,
    forwardingNums, setForwardingNum,
    showToast,
  } = useApp();
  const num = numbers.find(n => n.id === id);

  const [voicemail, setVoicemail] = useState(true);
  const [fwdInput, setFwdInput] = useState(forwardingNums[id ?? ""] ?? "");

  if (!num) {
    return (
      <View style={[styles.root, { justifyContent: "center", alignItems: "center" }]}>
        <Feather name="alert-circle" size={40} color={C.textMuted} />
        <Text style={{ color: C.textMuted, fontFamily: "Inter_400Regular", marginTop: 10 }}>
          Number not found
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: C.accent, fontFamily: "Inter_500Medium" }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const recentCalls = calls
    .filter(c => c.number_id === num.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const handleDelete = () => {
    Alert.alert("Release Number?", `${num.phone_number} will be permanently released.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Release",
        style: "destructive",
        onPress: () => { removeNumber(num.id); router.back(); },
      },
    ]);
  };

  const copyNumber = () => {
    Clipboard.setString(num.phone_number);
    showToast(`${num.phone_number} copied!`, "success");
  };

  function timeAgo(dateStr: string) {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60)    return "Just now";
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  const CALL_META: Record<string, { color: string; label: string; icon: string }> = {
    missed:    { color: C.red,   label: "Missed",    icon: "phone-missed"   },
    completed: { color: C.green, label: "Completed", icon: "phone-call"     },
    initiated: { color: C.blue,  label: "Outgoing",  icon: "phone-outgoing" },
    ringing:   { color: C.blue,  label: "Ringing",   icon: "phone-incoming" },
  };

  const typeLabel = num.type === "permanent" ? "Permanent" : "Temporary";
  const typeColor = num.type === "permanent" ? C.accent : C.green;
  const typeBg    = num.type === "permanent" ? C.accentDim : C.greenDim;

  const isRecording = recordings[num.id] ?? false;
  const isForwarding = forwarding[num.id] ?? false;

  const handleToggleRecording = (v: boolean) => {
    toggleRecording(num.id);
    showToast(v ? "Recording enabled" : "Recording disabled", v ? "success" : "info");
  };

  const handleToggleForwarding = (v: boolean) => {
    toggleForwarding(num.id);
    showToast(v ? "Forwarding enabled" : "Forwarding disabled", v ? "success" : "info");
  };

  const handleSaveFwdNum = () => {
    setForwardingNum(num.id, fwdInput);
    showToast("Forwarding number saved", "success");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>

      {/* ── Nav bar ── */}
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.navTxt}>Number Detail</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >

        {/* ── Hero header ── */}
        <View style={styles.hero}>
          <View style={styles.heroLeft}>
            <View style={styles.flagBox}>
              <Text style={styles.flagTxt}>{num.flag}</Text>
              {num.status === "active" && <View style={styles.activeDot} />}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.heroNumber} numberOfLines={1}>{num.phone_number}</Text>
              <Text style={styles.heroCountry}>{num.country}</Text>
            </View>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: typeBg }]}>
            <Text style={[styles.typeTxt, { color: typeColor }]}>{typeLabel}</Text>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          {[
            { v: num.call_count   ?? 0, l: "Calls"    },
            { v: num.sms_count    ?? 0, l: "Messages" },
            { v: num.missed_count ?? 0, l: "Missed"   },
          ].map((s, i) => (
            <React.Fragment key={s.l}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.stat}>
                <Text style={[styles.statVal, s.l === "Missed" && s.v > 0 && { color: C.red }]}>
                  {s.v}
                </Text>
                <Text style={styles.statLbl}>{s.l}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* ── Quick actions ── */}
        <View style={styles.quickRow}>
          {[
            { icon: "phone",          label: "Call",    onPress: () => {} },
            { icon: "message-square", label: "Message", onPress: () => router.push("/(tabs)/inbox") },
            { icon: "copy",           label: "Copy",    onPress: copyNumber },
          ].map(q => (
            <Pressable
              key={q.label}
              style={({ pressed }) => [styles.quickBtn, { opacity: pressed ? 0.75 : 1 }]}
              onPress={q.onPress}
            >
              <Feather name={q.icon as any} size={18} color={C.accent} />
              <Text style={styles.quickLbl}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Call Settings ── */}
        <Text style={styles.secTitle}>CALL SETTINGS</Text>
        <View style={styles.card}>
          <SettingRow
            icon="voicemail"
            label="Voicemail"
            sublabel="Receive voicemail when unavailable"
            val={voicemail}
            onToggle={setVoicemail}
          />
          <View style={styles.div} />
          <SettingRow
            icon="mic"
            label="Call Recording"
            sublabel="Auto-save all calls for this number"
            val={isRecording}
            onToggle={handleToggleRecording}
          />
          <View style={styles.div} />
          <SettingRow
            icon="phone-forwarded"
            label="Call Forwarding"
            sublabel="Route calls to another number"
            val={isForwarding}
            onToggle={handleToggleForwarding}
          />
          {isForwarding && (
            <View style={styles.fwdInputWrap}>
              <TextInput
                style={styles.fwdInput}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={C.textMuted}
                value={fwdInput}
                onChangeText={setFwdInput}
                keyboardType="phone-pad"
              />
              <Pressable style={styles.fwdSaveBtn} onPress={handleSaveFwdNum}>
                <Text style={styles.fwdSaveTxt}>Save</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ── Manage ── */}
        <Text style={styles.secTitle}>MANAGE</Text>
        <View style={styles.card}>
          <SettingRow icon="edit-3"         label="Rename Number"         onPress={() => {}} />
          <View style={styles.div} />
          <SettingRow icon="message-circle" label="Auto-Reply Scheduler"  onPress={() => router.push("/autoreply")} />
          <View style={styles.div} />
          <SettingRow icon="slash"          label="Spam Blocker"          onPress={() => router.push("/spamblocker")} />
        </View>

        {/* ── Recent calls ── */}
        {recentCalls.length > 0 && (
          <>
            <Text style={styles.secTitle}>RECENT CALLS</Text>
            <View style={styles.card}>
              {recentCalls.map((c, i) => {
                const meta = CALL_META[c.status] ?? CALL_META.completed;
                const party = c.direction === "inbound" ? c.from_number : c.to_number;
                const dur   = c.duration > 0
                  ? `${Math.floor(c.duration / 60)}:${(c.duration % 60).toString().padStart(2, "0")}`
                  : "";
                return (
                  <React.Fragment key={c.id}>
                    {i > 0 && <View style={styles.div} />}
                    <View style={styles.callRow}>
                      <View style={[styles.callIcon, { backgroundColor: meta.color + "18" }]}>
                        <Feather name={meta.icon as any} size={15} color={meta.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.callParty, c.status === "missed" && { color: C.red }]}>
                          {party}
                        </Text>
                        <Text style={styles.callSub}>
                          {meta.label}{dur ? ` · ${dur}` : ""}
                        </Text>
                      </View>
                      <Text style={styles.callTime}>{timeAgo(c.created_at)}</Text>
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          </>
        )}

        {/* ── Danger zone ── */}
        <Pressable
          style={({ pressed }) => [styles.releaseBtn, { opacity: pressed ? 0.8 : 1 }]}
          onPress={handleDelete}
        >
          <Feather name="trash-2" size={16} color={C.red} />
          <Text style={styles.releaseTxt}>Release this Number</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

function SettingRow({
  icon, label, sublabel, val, onToggle, onPress,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  val?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.settingRow} onPress={onPress} disabled={!onPress && onToggle !== undefined}>
      <View style={styles.settingIconBox}>
        <Feather name={icon as any} size={14} color={C.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sublabel && <Text style={styles.settingSub}>{sublabel}</Text>}
      </View>
      {onToggle !== undefined ? (
        <Switch
          value={val}
          onValueChange={onToggle}
          trackColor={{ false: C.raised, true: C.accent }}
          thumbColor="#fff"
        />
      ) : (
        <Feather name="chevron-right" size={16} color={C.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  nav: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 14,
  },
  navTxt: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },

  hero: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 18, gap: 12,
  },
  heroLeft: { flexDirection: "row", alignItems: "center", gap: 13, flex: 1, minWidth: 0 },
  flagBox: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: C.raised,
    alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0,
    borderWidth: 1, borderColor: C.border,
  },
  flagTxt: { fontSize: 26 },
  activeDot: {
    position: "absolute", bottom: 3, right: 3, width: 10, height: 10,
    borderRadius: 5, backgroundColor: C.green, borderWidth: 2, borderColor: C.bg,
  },
  heroNumber: {
    fontFamily: "Inter_700Bold", fontSize: 18, color: C.text, letterSpacing: -0.4,
  },
  heroCountry: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, marginTop: 3 },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99, flexShrink: 0 },
  typeTxt: { fontFamily: "Inter_600SemiBold", fontSize: 11.5 },

  statsRow: {
    flexDirection: "row", marginHorizontal: 16, marginBottom: 16,
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border,
  },
  stat: { flex: 1, alignItems: "center", paddingVertical: 16, gap: 4 },
  statDivider: { width: 1, backgroundColor: C.border, marginVertical: 14 },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text },
  statLbl: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },

  quickRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 22, gap: 10 },
  quickBtn: {
    flex: 1, height: 62, backgroundColor: C.surface, borderRadius: 14,
    borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center", gap: 7,
  },
  quickLbl: { fontFamily: "Inter_500Medium", fontSize: 11.5, color: C.textSec },

  secTitle: {
    paddingHorizontal: 16, paddingBottom: 8,
    fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted, letterSpacing: 1,
  },
  card: {
    marginHorizontal: 16, marginBottom: 20, backgroundColor: C.surface,
    borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: "hidden",
  },
  div: { height: 1, backgroundColor: C.border, marginLeft: 54 },

  settingRow: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12, gap: 12,
  },
  settingIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  settingLabel: { fontFamily: "Inter_500Medium", fontSize: 13.5, color: C.text },
  settingSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 1 },

  fwdInputWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginHorizontal: 14, marginBottom: 12, marginTop: 4,
  },
  fwdInput: {
    flex: 1, height: 44, backgroundColor: C.input, borderRadius: 10, borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 14, fontFamily: "Inter_400Regular", fontSize: 14, color: C.text,
  },
  fwdSaveBtn: {
    height: 44, paddingHorizontal: 18, backgroundColor: C.accent, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  fwdSaveTxt: { fontFamily: "Inter_700Bold", fontSize: 13, color: C.onAccent },

  callRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  callIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  callParty: { fontFamily: "Inter_500Medium", fontSize: 13.5, color: C.text },
  callSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 2 },
  callTime: { fontFamily: "Inter_400Regular", fontSize: 10.5, color: C.textMuted, flexShrink: 0 },

  releaseBtn: {
    marginHorizontal: 16, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: C.red,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.redDim, marginBottom: 8,
  },
  releaseTxt: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.red },
});
