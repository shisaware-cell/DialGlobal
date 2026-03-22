import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { PLANS } from "@/data/mockData";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { profile, numbers, currentPlan, signOut, updateProfile, isAuthed, isInTrial, trialExpired } = useApp();
  const plan = PLANS.find(p => p.id === currentPlan) ?? PLANS[0];
  const needsTrial = isAuthed && !isInTrial && !trialExpired && numbers.length === 0;
  const planBadgeLabel = needsTrial ? "Start Free Trial" : isInTrial ? `${plan.name} Trial` : `${plan.name} Plan`;

  const [name,    setName]    = useState(profile?.name  ?? "");
  const [email,   setEmail]   = useState(profile?.email ?? "");
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name  ?? "");
      setEmail(profile.email ?? "");
    }
  }, [profile]);

  const displayName = isAuthed ? (profile?.name || profile?.email?.split("@")[0] || "User") : "Guest";
  const initial = displayName.charAt(0).toUpperCase();

  const memberSince = profile
    ? new Date((profile as any).created_at ?? Date.now()).toLocaleDateString("en-US", {
        month: "short", year: "numeric",
      })
    : "—";

  const totalCalls = numbers.reduce((s, n) => s + (n.call_count ?? 0), 0);
  const totalSms   = numbers.reduce((s, n) => s + (n.sms_count  ?? 0), 0);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Could not save changes.");
    }
    setSaving(false);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => signOut() },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.headerTxt}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >

        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Feather name="user" size={38} color={C.onAccent} />
            <Pressable style={styles.editAvatar}>
              <Feather name="camera" size={13} color={C.textSec} />
            </Pressable>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{profile?.email || ""}</Text>
          <Pressable style={styles.planBadge} onPress={() => router.push("/paywall")}>
            <Ionicons name="star" size={11} color={needsTrial ? C.green : C.accent} />
            <Text style={[styles.planBadgeTxt, needsTrial && { color: C.green }]}>{planBadgeLabel}</Text>
          </Pressable>
        </View>

        {/* ── Stats 2×2 ── */}
        <View style={styles.statsGrid}>
          {[
            { label: "Numbers",     value: numbers.length.toString() },
            { label: "Total Calls", value: totalCalls.toString()     },
            { label: "SMS Sent",    value: totalSms.toString()       },
            { label: "Member Since",value: memberSince               },
          ].map((s, i) => (
            <View key={s.label} style={[styles.statCell, i % 2 === 0 && styles.statCellBorderRight]}>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Save confirmation banner ── */}
        {saved && (
          <View style={styles.savedBanner}>
            <Feather name="check-circle" size={15} color={C.green} />
            <Text style={styles.savedTxt}>Changes saved successfully</Text>
          </View>
        )}

        {/* ── Personal info ── */}
        <View style={styles.sec}>
          <Text style={styles.secTitle}>PERSONAL INFO</Text>
          <View style={styles.secCard}>
            <Field label="FULL NAME" value={name} onChangeText={setName} />
            <View style={styles.div} />
            <Field label="EMAIL ADDRESS" value={email} onChangeText={setEmail} editable={false} />
          </View>
        </View>

        {/* ── Subscription ── */}
        <View style={styles.sec}>
          <Text style={styles.secTitle}>SUBSCRIPTION</Text>
          <Pressable
            style={styles.planCard}
            onPress={() => { router.back(); setTimeout(() => router.push("/paywall"), 100); }}
          >
            <View style={styles.planIconWrap}>
              <Ionicons name="star" size={20} color={C.accent} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.planName}>{plan?.name ?? "Basic"} Plan</Text>
              <Text style={styles.planSub}>
                {numbers.length} / {plan?.numberLimit ?? 1} numbers · {plan?.countries ?? 10} countries
              </Text>
            </View>
            <View style={styles.upgBtn}>
              <Text style={styles.upgTxt}>
                {currentPlan === "business" ? "Active" : "Upgrade"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ── Save button ── */}
        <Pressable
          style={({ pressed }) => [styles.saveBtn, { opacity: pressed || saving ? 0.88 : 1 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={C.onAccent} />
            : <Text style={styles.saveTxt}>Save Changes</Text>
          }
        </Pressable>

        {/* ── Sign out ── */}
        <Pressable
          style={({ pressed }) => [styles.signOutBtn, { opacity: pressed ? 0.75 : 1 }]}
          onPress={handleSignOut}
        >
          <Feather name="log-out" size={15} color={C.red} />
          <Text style={styles.signOutTxt}>Sign Out</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

function Field({
  label, value, onChangeText, editable = true,
}: {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  editable?: boolean;
}) {
  return (
    <View style={f.field}>
      <Text style={f.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        style={[f.input, !editable && { color: C.textMuted }]}
        placeholderTextColor={C.textMuted}
      />
    </View>
  );
}

const f = StyleSheet.create({
  field: { gap: 6 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted, letterSpacing: 1 },
  input: {
    height: 50, backgroundColor: C.raised, borderRadius: 12, borderWidth: 1,
    borderColor: C.border, paddingHorizontal: 14, fontSize: 15, color: C.text,
    fontFamily: "Inter_400Regular",
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 16,
  },
  headerTxt: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },

  avatarSection: { alignItems: "center", paddingVertical: 24, gap: 6 },
  avatar: {
    width: 88, height: 88, borderRadius: 28, backgroundColor: C.accent,
    alignItems: "center", justifyContent: "center", position: "relative",
    shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 32, color: C.onAccent }, // kept for reference
  editAvatar: {
    position: "absolute", bottom: -6, right: -6, width: 28, height: 28,
    borderRadius: 8, backgroundColor: C.raised, alignItems: "center",
    justifyContent: "center", borderWidth: 2, borderColor: C.bg,
  },
  name: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text, letterSpacing: -0.4 },
  email: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted },
  planBadge: {
    flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2,
    backgroundColor: C.accentDim, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99,
  },
  planBadgeTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: C.accent },

  statsGrid: {
    flexDirection: "row", flexWrap: "wrap", marginHorizontal: 16, marginBottom: 20,
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border,
    overflow: "hidden",
  },
  statCell: { width: "50%", alignItems: "center", paddingVertical: 16, gap: 4 },
  statCellBorderRight: { borderRightWidth: 1, borderRightColor: C.border },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },

  savedBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginHorizontal: 16, marginBottom: 12, backgroundColor: C.greenDim,
    borderRadius: 12, padding: 12, borderWidth: 1, borderColor: C.green + "40",
  },
  savedTxt: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.green },

  sec: { marginHorizontal: 16, marginBottom: 20 },
  secTitle: {
    fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted,
    letterSpacing: 1, marginBottom: 8,
  },
  secCard: {
    backgroundColor: C.surface, borderRadius: 14, borderWidth: 1,
    borderColor: C.border, padding: 14, gap: 14,
  },
  div: { height: 1, backgroundColor: C.border },

  planCard: {
    backgroundColor: C.surface, borderRadius: 14, borderWidth: 1,
    borderColor: "rgba(232,160,32,0.25)", padding: 16,
    flexDirection: "row", alignItems: "center", gap: 12,
  },
  planIconWrap: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: C.accentDim,
    alignItems: "center", justifyContent: "center",
  },
  planName: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text },
  planSub: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textMuted },
  upgBtn: { backgroundColor: C.accent, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99 },
  upgTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.onAccent },

  saveBtn: {
    marginHorizontal: 16, height: 52, backgroundColor: C.accent, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 }, elevation: 6, marginBottom: 12,
  },
  saveTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },

  signOutBtn: {
    marginHorizontal: 16, height: 50, borderRadius: 14, borderWidth: 1.5,
    borderColor: C.red, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8, backgroundColor: C.redDim,
  },
  signOutTxt: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.red },
});
