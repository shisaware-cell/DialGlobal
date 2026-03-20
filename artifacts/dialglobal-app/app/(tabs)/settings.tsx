import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { PLANS } from "@/data/mockData";

function Row({ icon, label, sublabel, value, onToggle, onPress, danger = false }: {
  icon: string; label: string; sublabel?: string;
  value?: boolean; onToggle?: (v: boolean) => void;
  onPress?: () => void; danger?: boolean;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.row, { backgroundColor: pressed && onPress ? C.hover : "transparent" }]} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: danger ? C.redDim : C.raised }]}>
        <Feather name={icon as any} size={15} color={danger ? C.red : C.accent} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.rowLabel, danger && { color: C.red }]}>{label}</Text>
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
  const { currentPlan, billing, setAuthed } = useApp();
  const [notifs, setNotifs] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [forwarding, setForwarding] = useState(true);
  const isWeb = Platform.OS === "web";
  const plan = PLANS.find(p => p.id === currentPlan);
  const price = billing === "yearly" ? plan?.yearlyPrice : plan?.monthlyPrice;

  const signOut = () => {
    Alert.alert("Sign Out?", "You'll be logged out on this device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => { setAuthed(false); router.replace("/auth"); } },
    ]);
  };

  const deleteAccount = () => {
    Alert.alert("Delete Account?", "All your numbers and data will be permanently deleted. This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { setAuthed(false); router.replace("/auth"); } },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: (isWeb ? 84 : 66) + (insets.bottom > 0 ? insets.bottom : 16) }}>
        <Pressable style={styles.profileCard} onPress={() => router.push("/profile")}>
          <View style={styles.profileAvatar}><Text style={styles.avatarTxt}>V</Text></View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={styles.profileName}>Vusi Hal</Text>
            <Text style={styles.profileEmail}>vusi@dialglobal.io</Text>
            <View style={styles.planTag}>
              <Ionicons name="star" size={11} color={C.accent} />
              <Text style={styles.planTagTxt}>{plan?.name} Plan</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color={C.textMuted} />
        </Pressable>

        <Section title="PREFERENCES">
          <Row icon="bell" label="Notifications" sublabel="Calls, messages & alerts" value={notifs} onToggle={setNotifs} />
          <View style={styles.divider} />
          <Row icon="shield" label="Biometric Lock" sublabel="Face ID / Fingerprint" value={biometric} onToggle={setBiometric} />
          <View style={styles.divider} />
          <Row icon="phone-forwarded" label="Call Forwarding" sublabel="Route calls to another number" value={forwarding} onToggle={setForwarding} />
        </Section>

        <Section title="ACCOUNT">
          <Row icon="user" label="Personal Info" sublabel="Name, email, password" onPress={() => router.push("/profile")} />
          <View style={styles.divider} />
          <Row icon="credit-card" label="Billing & Plan" sublabel={`${plan?.name} · $${price}/mo`} onPress={() => router.push("/paywall")} />
          <View style={styles.divider} />
          <Row icon="bar-chart-2" label="Usage & Stats" sublabel="Calls, SMS this month" onPress={() => router.push("/profile")} />
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

        <Text style={styles.version}>DialGlobal v1.0.0 · Built with Telnyx</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, paddingHorizontal: 20, paddingBottom: 14, letterSpacing: -0.8 },
  profileCard: { marginHorizontal: 16, marginBottom: 24, backgroundColor: C.surface, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1, borderColor: C.border },
  profileAvatar: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#0D0D0E" },
  profileName: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text, letterSpacing: -0.3 },
  profileEmail: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textMuted },
  planTag: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  planTagTxt: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: C.accent },
  section: { marginHorizontal: 16, marginBottom: 20 },
  secTitle: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted, letterSpacing: 1.2, marginBottom: 8 },
  secCard: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  iconBox: { width: 34, height: 34, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.text },
  rowSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  divider: { height: 1, backgroundColor: C.border, marginLeft: 60 },
  version: { textAlign: "center", fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, paddingVertical: 16 },
});
