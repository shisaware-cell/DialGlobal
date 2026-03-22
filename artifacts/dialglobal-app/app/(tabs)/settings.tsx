import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { PLANS } from "@/data/mockData";

function Row({ icon, label, sublabel, value, onToggle, onPress, danger = false, badge }: {
  icon: string; label: string; sublabel?: string;
  value?: boolean; onToggle?: (v: boolean) => void;
  onPress?: () => void; danger?: boolean; badge?: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, { backgroundColor: pressed && onPress ? C.hover : "transparent" }]}
      onPress={onPress}
      disabled={!onPress && onToggle === undefined}
    >
      <View style={[styles.iconBox, { backgroundColor: danger ? C.redDim : C.raised }]}>
        <Feather name={icon as any} size={15} color={danger ? C.red : C.accent} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={[styles.rowLabel, danger && { color: C.red }]}>{label}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>{badge}</Text>
            </View>
          )}
        </View>
        {sublabel && <Text style={styles.rowSub}>{sublabel}</Text>}
      </View>
      {onToggle !== undefined ? (
        <Switch value={value} onValueChange={onToggle} trackColor={{ false: C.raised, true: C.accent }} thumbColor="#fff" />
      ) : onPress ? (
        <Feather name="chevron-right" size={16} color={C.textMuted} />
      ) : null}
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.secTitle}>{title}</Text>
      <View style={styles.secCard}>{children}</View>
    </View>
  );
}

export default function Settings() {
  const insets = useSafeAreaInsets();
  const {
    currentPlan, billing, profile, signOut: doSignOut,
    ghostMode, setGhostMode, credits, numbers, isInTrial, trialExpired, isAuthed,
  } = useApp();
  const [biometric, setBiometric] = useState(false);
  const isWeb = Platform.OS === "web";
  const plan = PLANS.find(p => p.id === currentPlan);
  const price = billing === "yearly" ? plan?.yearlyPrice : plan?.monthlyPrice;
  const needsTrialStart = isAuthed && numbers.length === 0 && !isInTrial && !trialExpired;

  const userName  = profile?.name  || profile?.email?.split("@")[0] || "User";
  const userEmail = profile?.email || "user@dialglobal.io";

  const signOut = () => {
    Alert.alert("Sign Out?", "You'll be logged out on this device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: async () => { await doSignOut(); router.replace("/auth"); } },
    ]);
  };

  const deleteAccount = () => {
    Alert.alert("Delete Account?", "All your numbers and data will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await doSignOut(); router.replace("/auth"); } },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: (isWeb ? 84 : 66) + (insets.bottom > 0 ? insets.bottom : 16) }}>

        {/* Profile header */}
        <Pressable style={styles.profileCard} onPress={() => router.push("/profile")}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarTxt}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
            <View style={styles.planTag}>
              <Ionicons name="star" size={11} color={C.accent} />
              <Text style={styles.planTagTxt}>{needsTrialStart ? "Start Free Trial" : `${plan?.name ?? "Free"} Plan`}</Text>
              {credits > 0 && <Text style={styles.creditsTag}>💳 ${credits.toFixed(2)}</Text>}
            </View>
          </View>
          <Feather name="chevron-right" size={16} color={C.textMuted} />
        </Pressable>

        <Section title="PREFERENCES">
          <Row
            icon="bell"
            label="Notifications"
            sublabel="Calls, messages, voicemail & alerts"
            onPress={() => router.push("/notifications-settings")}
          />
          <View style={styles.divider} />
          <Row icon="shield" label="Biometric Lock" sublabel="Face ID / Fingerprint" value={biometric} onToggle={setBiometric} />
          <View style={styles.divider} />
          <Row icon="eye-off" label="Ghost Mode" sublabel="Silence all numbers, hide badges" value={ghostMode} onToggle={setGhostMode} />
        </Section>

        <Section title="ACCOUNT">
          <Row icon="user" label="Personal Info" sublabel="Name, email, password" onPress={() => router.push("/profile")} />
          <View style={styles.divider} />
          <Row
            icon="credit-card"
            label="Billing & Plan"
            sublabel={needsTrialStart ? "Start Free Trial to activate your number" : (plan?.monthlyPrice === 0 ? "Free Plan · Upgrade to unlock more" : `${plan?.name} · $${price}/mo`)}
            onPress={() => router.push("/paywall")}
          />
          <View style={styles.divider} />
          <Row
            icon="star"
            label="Credits"
            sublabel={credits > 0 ? `$${credits.toFixed(2)} wallet balance` : "Top up for extra usage"}
            onPress={() => router.push("/credits")}
          />
        </Section>

        <Section title="SUPPORT">
          <Row icon="help-circle" label="Help & FAQ" onPress={() => {}} />
          <View style={styles.divider} />
          <Row icon="mail" label="Contact Support" sublabel="support@dialglobal.io" onPress={() => {}} />
        </Section>

        <Section title="DANGER ZONE">
          <Row icon="log-out" label="Sign Out" danger onPress={signOut} />
          <View style={styles.divider} />
          <Row icon="trash-2" label="Delete Account" sublabel="Cannot be undone" danger onPress={deleteAccount} />
        </Section>

        <Text style={styles.version}>DialGlobal v2.1.0 · Powered by Telnyx</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  profileCard: { backgroundColor: C.surface, padding: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", gap: 14, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 20 },
  profileAvatar: { width: 56, height: 56, borderRadius: 14, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.onAccent },
  profileName: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text, letterSpacing: -0.3 },
  profileEmail: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, marginTop: 2 },
  planTag: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6, flexWrap: "wrap" },
  planTagTxt: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.accent },
  creditsTag: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.accent, marginLeft: 4 },
  section: { marginHorizontal: 16, marginBottom: 20 },
  secTitle: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 8, paddingLeft: 4 },
  secCard: { backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  iconBox: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontFamily: "Inter_500Medium", fontSize: 13.5, color: C.text },
  rowSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  badge: { backgroundColor: C.red, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 99 },
  badgeTxt: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#fff" },
  divider: { height: 1, backgroundColor: C.border },
  version: { textAlign: "center", fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, paddingVertical: 4, paddingBottom: 20 },
});
