import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { PLANS } from "@/data/mockData";

function Field({ label, value, editable = true }: { label: string; value: string; editable?: boolean }) {
  const [val, setVal] = useState(value);
  return (
    <View style={f.field}>
      <Text style={f.label}>{label}</Text>
      <TextInput value={val} onChangeText={setVal} editable={editable}
        style={[f.input, !editable && { color: C.textMuted }]}
        placeholderTextColor={C.textMuted} />
    </View>
  );
}

const f = StyleSheet.create({
  field: { gap: 6 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted, letterSpacing: 1 },
  input: { height: 50, backgroundColor: C.raised, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, fontSize: 15, color: C.text, fontFamily: "Inter_400Regular" },
});

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { currentPlan, numbers } = useApp();
  const plan = PLANS.find(p => p.id === currentPlan)!;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.headerTxt}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>V</Text>
            <Pressable style={styles.editAvatar}>
              <Feather name="camera" size={13} color={C.textSec} />
            </Pressable>
          </View>
          <Text style={styles.name}>Vusi Hal</Text>
          <Text style={styles.email}>vusi@dialglobal.io</Text>
        </View>

        <View style={styles.statRow}>
          {[
            { label: "Numbers", value: numbers.length },
            { label: "Plan", value: plan.name },
            { label: "Countries", value: plan.countries.toString() },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sec}>
          <Text style={styles.secTitle}>PERSONAL INFO</Text>
          <View style={styles.secCard}>
            <Field label="FULL NAME" value="Vusi Hal" />
            <View style={styles.div} />
            <Field label="EMAIL ADDRESS" value="vusi@dialglobal.io" />
            <View style={styles.div} />
            <Field label="PHONE NUMBER" value="+1 (415) 823-4921" editable={false} />
          </View>
        </View>

        <View style={styles.sec}>
          <Text style={styles.secTitle}>PLAN</Text>
          <Pressable style={styles.planCard} onPress={() => { router.back(); setTimeout(() => router.push("/paywall"), 100); }}>
            <Ionicons name="star" size={20} color={C.accent} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.planName}>{plan.name} Plan</Text>
              <Text style={styles.planSub}>{numbers.length} / {plan.numberLimit} numbers · {plan.countries} countries</Text>
            </View>
            <View style={styles.upgBtn}><Text style={styles.upgTxt}>{currentPlan === "global" ? "Max" : "Upgrade"}</Text></View>
          </Pressable>
        </View>

        <Pressable style={({ pressed }) => [styles.saveBtn, { opacity: pressed ? 0.88 : 1 }]}>
          <Text style={styles.saveTxt}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 16 },
  headerTxt: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },
  avatarSection: { alignItems: "center", paddingVertical: 24, gap: 8 },
  avatar: { width: 88, height: 88, borderRadius: 28, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", position: "relative", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width:0, height:6 }, elevation: 8 },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 32, color: C.onAccent },
  editAvatar: { position: "absolute", bottom: -6, right: -6, width: 28, height: 28, borderRadius: 8, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: C.bg },
  name: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text, letterSpacing: -0.4 },
  email: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted },
  statRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 24, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 16, gap: 4 },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  sec: { marginHorizontal: 16, marginBottom: 20 },
  secTitle: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted, letterSpacing: 1, marginBottom: 8 },
  secCard: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, gap: 14 },
  div: { height: 1, backgroundColor: C.border },
  planCard: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: "rgba(232,160,32,0.25)", padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  planName: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text },
  planSub: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textMuted },
  upgBtn: { backgroundColor: C.accent, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99 },
  upgTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.onAccent },
  saveBtn: { marginHorizontal: 16, height: 52, backgroundColor: C.accent, borderRadius: 16, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width:0, height:4 }, elevation: 6 },
  saveTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },
});
