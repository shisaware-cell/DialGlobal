import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  ActivityIndicator, Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { api } from "@/lib/api";

const ESIM_PLANS = [
  { id: "e1", region: "🌍 Africa & Middle East", data: "1 GB", days: 7,  price: 4.99 },
  { id: "e2", region: "🌎 Americas",             data: "3 GB", days: 14, price: 8.99 },
  { id: "e3", region: "🌏 Asia Pacific",         data: "2 GB", days: 10, price: 6.99 },
  { id: "e4", region: "🌍 Europe",               data: "5 GB", days: 30, price: 14.99 },
  { id: "e5", region: "🌐 Global (160 countries)", data: "2 GB", days: 15, price: 19.99 },
];

type Step = "plans" | "scan" | "manual" | "done";

export default function ESim() {
  const insets = useSafeAreaInsets();
  const [step, setStep]               = useState<Step>("plans");
  const [selected, setSelected]       = useState<typeof ESIM_PLANS[0] | null>(null);
  const [loading, setLoading]         = useState(false);
  const [qrInput, setQrInput]         = useState("");
  const [activationCode, setActivationCode] = useState<string | null>(null);
  const [orderId, setOrderId]         = useState<string | null>(null);

  const activate = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await api.orderEsim({
        plan_id: selected.id,
        region: selected.region,
        data_gb: selected.data,
        days: selected.days,
        price: selected.price,
      });
      setOrderId(res.order_id || null);
      setActivationCode(res.activation_code || null);
      setStep("done");
    } catch (err: any) {
      Alert.alert("eSIM Order Failed", err.message || "Could not place eSIM order. Please ensure your Telnyx account has sufficient credits.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
        <ScrollView contentContainerStyle={[styles.centered, { padding: 24, paddingBottom: insets.bottom + 40 }]}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>📶</Text>
          <Text style={styles.doneTitle}>eSIM Ordered!</Text>
          <Text style={styles.doneSub}>
            Your eSIM order is being processed. Install the activation code below on your device.
          </Text>
          <View style={styles.doneCard}>
            <Text style={styles.doneMuted}>Plan</Text>
            <Text style={styles.doneRegion}>{selected?.region}</Text>
            <Text style={styles.doneDetail}>{selected?.data} · {selected?.days} days</Text>
            {orderId && (
              <Text style={[styles.doneMuted, { marginTop: 8 }]}>Order ID: {orderId}</Text>
            )}
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activeTxt}>Processing</Text>
            </View>
          </View>

          {activationCode ? (
            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>ACTIVATION CODE</Text>
              <Text style={styles.codeTxt} selectable>{activationCode}</Text>
              <Text style={styles.codeHint}>
                Go to Settings → Mobile Data → Add eSIM → Enter code manually on your device.
              </Text>
            </View>
          ) : (
            <View style={styles.codeCard}>
              <Feather name="info" size={16} color={C.accent} />
              <Text style={styles.codeHint}>
                Your activation code will be emailed once the order is confirmed by Telnyx (usually within a few minutes).
              </Text>
            </View>
          )}

          <Pressable style={[styles.primaryBtn, { width: "100%", marginTop: 8 }]} onPress={() => router.back()}>
            <Text style={styles.primaryBtnTxt}>Done</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  if (step === "scan" || step === "manual") {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => setStep("plans")} hitSlop={14} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={C.textSec} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {step === "scan" ? "Scan QR Code" : "Enter Activation Code"}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.centered}>
          {step === "scan" ? (
            <>
              <View style={styles.qrBox}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>📷</Text>
                <Text style={styles.qrHint}>Camera permission required</Text>
              </View>
              <Text style={styles.scanSub}>
                Point your camera at the QR code provided by your eSIM carrier.
              </Text>
              <Pressable onPress={() => setStep("manual")}>
                <Text style={styles.manualLink}>Enter code manually instead →</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🔢</Text>
              <Text style={styles.scanSub}>Enter the activation code from your eSIM QR code</Text>
              <TextInput
                value={qrInput}
                onChangeText={setQrInput}
                placeholder="LPA:1$example.server.com$ABCDEF123456"
                placeholderTextColor={C.textMuted}
                style={styles.codeInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable
                style={[styles.primaryBtn, { width: "100%", opacity: !qrInput.trim() ? 0.5 : 1 }]}
                onPress={activate}
                disabled={loading || !qrInput.trim()}
              >
                {loading
                  ? <ActivityIndicator color={C.onAccent} />
                  : <Text style={styles.primaryBtnTxt}>Activate eSIM →</Text>}
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="x" size={20} color={C.textSec} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>eSIM</Text>
          <Text style={styles.headerSub}>Stay connected while travelling</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        <Pressable style={styles.activateRow} onPress={() => setStep("scan")}>
          <View style={styles.activateIcon}><Text style={{ fontSize: 20 }}>📲</Text></View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.activateTitle}>Activate existing eSIM</Text>
            <Text style={styles.activateSub}>Scan QR code or enter activation code</Text>
          </View>
          <Feather name="chevron-right" size={14} color={C.textMuted} />
        </Pressable>

        <Text style={styles.sectionLabel}>BUY A NEW eSIM</Text>

        {ESIM_PLANS.map(plan => {
          const isSel = selected?.id === plan.id;
          return (
            <Pressable
              key={plan.id}
              style={[styles.planCard, isSel && styles.planCardSel]}
              onPress={() => setSelected(plan)}
            >
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.planRegion}>{plan.region}</Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Text style={styles.planDetail}>📦 {plan.data}</Text>
                  <Text style={styles.planDetail}>📅 {plan.days} days</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <Text style={[styles.planPrice, isSel && { color: C.accent }]}>${plan.price}</Text>
                {isSel && (
                  <View style={styles.checkCircle}>
                    <Feather name="check" size={9} color={C.onAccent} strokeWidth={3} />
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {selected && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
          <View style={styles.footerSummary}>
            <View>
              <Text style={styles.footerRegion}>{selected.region}</Text>
              <Text style={styles.footerDetail}>{selected.data} · {selected.days} days</Text>
            </View>
            <Text style={styles.footerPrice}>${selected.price}</Text>
          </View>
          <Pressable style={[styles.primaryBtn, { opacity: loading ? 0.7 : 1 }]} onPress={activate} disabled={loading}>
            {loading
              ? <ActivityIndicator color={C.onAccent} />
              : <Text style={styles.primaryBtnTxt}>Buy & Activate eSIM →</Text>}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  doneTitle: { fontFamily: "Inter_700Bold", fontSize: 24, color: C.text, letterSpacing: -0.5, textAlign: "center" },
  doneSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSec, textAlign: "center", lineHeight: 22 },
  doneCard: { width: "100%", backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderStrong, borderRadius: 16, padding: 16, alignItems: "center", gap: 4 },
  doneMuted: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  doneRegion: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.text },
  doneDetail: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSec },
  activePill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.greenDim, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4, marginTop: 6 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  activeTxt: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.green },
  qrBox: { width: 220, height: 220, backgroundColor: C.raised, borderWidth: 2, borderColor: C.borderStrong, borderStyle: "dashed", borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 8 },
  qrHint: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  scanSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSec, textAlign: "center", lineHeight: 20 },
  manualLink: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.accent },
  codeInput: { width: "100%", height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.input, paddingHorizontal: 14, fontSize: 12, color: C.text, fontFamily: "Inter_400Regular" },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 10, marginTop: 8 },
  activateRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 14, marginBottom: 16 },
  activateIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center" },
  activateTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13.5, color: C.text },
  activateSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  planCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 13, marginBottom: 8 },
  planCardSel: { backgroundColor: C.accentDim, borderColor: "rgba(232,160,32,0.4)" },
  planRegion: { fontFamily: "Inter_600SemiBold", fontSize: 13.5, color: C.text },
  planDetail: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textSec },
  planPrice: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.text },
  checkCircle: { width: 16, height: 16, borderRadius: 8, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  footer: { backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, padding: 14 },
  footerSummary: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.raised, borderRadius: 10, padding: 12, marginBottom: 12 },
  footerRegion: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.text },
  footerDetail: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 2 },
  footerPrice: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.accent },
  primaryBtn: { width: "100%", height: 52, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  primaryBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },
  codeCard: {
    width: "100%", backgroundColor: C.raised, borderRadius: 14, borderWidth: 1,
    borderColor: C.border, padding: 16, gap: 8, alignItems: "center",
  },
  codeLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4 },
  codeTxt: {
    fontFamily: "Inter_400Regular", fontSize: 12, color: C.text,
    textAlign: "center", lineHeight: 18,
  },
  codeHint: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, textAlign: "center", lineHeight: 18 },
});
