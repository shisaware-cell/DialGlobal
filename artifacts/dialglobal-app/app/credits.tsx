import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { CREDIT_RATES } from "@/data/mockData";
import { useApp } from "@/context/AppContext";

const PACKS = [
  { id: "c1", dollars: 5.00,  bonus: 0,    price: 4.99,  tag: null         },
  { id: "c2", dollars: 10.00, bonus: 1.00, price: 9.99,  tag: "POPULAR"    },
  { id: "c3", dollars: 25.00, bonus: 3.00, price: 24.99, tag: "BEST VALUE" },
  { id: "c4", dollars: 50.00, bonus: 8.00, price: 49.99, tag: "PRO"        },
];

const RATES = [
  { type: "Outbound call",          rate: `$${CREDIT_RATES.outboundCallPerMin.toFixed(3)}/min`, icon: "📞", free: false },
  { type: "Inbound call",           rate: `$${CREDIT_RATES.inboundCallPerMin.toFixed(3)}/min`,  icon: "📞", free: false },
  { type: "SMS sent",               rate: `$${CREDIT_RATES.smsOutbound.toFixed(3)}/msg`,        icon: "💬", free: false },
  { type: "SMS received",           rate: null,                                                  icon: "💬", free: true  },
  { type: "Call recording",         rate: `$${CREDIT_RATES.recordingPerMin.toFixed(3)}/min`,    icon: "🎤", free: false },
  { type: "Extra number",           rate: `$${CREDIT_RATES.extraNumberPerMonth.toFixed(2)}/mo`, icon: "📱", free: false },
];

export default function Credits() {
  const insets = useSafeAreaInsets();
  const { credits, addCredits } = useApp();
  const [selected, setSelected] = useState("c2");
  const [loading, setLoading]   = useState(false);
  const [showRates, setShowRates] = useState(false);

  const pack = PACKS.find(p => p.id === selected)!;

  const purchase = () => {
    setLoading(true);
    setTimeout(() => {
      addCredits(pack.dollars + pack.bonus);
      setLoading(false);
    }, 1600);
  };

  const totalAdded = pack.dollars + pack.bonus;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={C.textSec} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Credit Wallet</Text>
          <Text style={styles.headerSub}>Pay-as-you-go for calls & messages</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={{ fontSize: 36, marginBottom: 6 }}>💳</Text>
          <Text style={styles.balanceNum}>${credits.toFixed(2)}</Text>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          {credits > 0 && (
            <View style={styles.balanceMeta}>
              <Text style={styles.balanceMetaTxt}>
                ~{Math.floor(credits / CREDIT_RATES.outboundCallPerMin)} min calls  ·  ~{Math.floor(credits / CREDIT_RATES.smsOutbound)} SMS
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionLabel}>TOP UP WALLET</Text>

        {PACKS.map((p) => {
          const isSel = selected === p.id;
          const total = p.dollars + p.bonus;
          return (
            <Pressable
              key={p.id}
              style={[styles.packCard, isSel && styles.packCardSel]}
              onPress={() => setSelected(p.id)}
            >
              {p.tag && (
                <View style={styles.packTag}>
                  <Text style={styles.packTagTxt}>{p.tag}</Text>
                </View>
              )}
              <View style={[styles.radio, isSel && styles.radioSel]}>
                {isSel && <View style={styles.radioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <Text style={[styles.packAmount, isSel && { color: C.accent }]}>
                    ${total.toFixed(2)}
                  </Text>
                  {p.bonus > 0 && (
                    <View style={styles.bonusBadge}>
                      <Text style={styles.bonusTxt}>+${p.bonus.toFixed(2)} free</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.packMeta}>
                  ~{Math.floor(total / CREDIT_RATES.outboundCallPerMin)} min calls · ~{Math.floor(total / CREDIT_RATES.smsOutbound)} SMS
                </Text>
              </View>
              <Text style={[styles.packPrice, isSel && { color: C.accent }]}>${p.price.toFixed(2)}</Text>
            </Pressable>
          );
        })}

        {/* Rates toggle */}
        <Pressable style={styles.ratesToggle} onPress={() => setShowRates(s => !s)}>
          <Text style={styles.ratesTxt}>View usage rates</Text>
          <Feather name={showRates ? "chevron-up" : "chevron-down"} size={14} color={C.textMuted} />
        </Pressable>

        {showRates && (
          <View style={styles.ratesCard}>
            {RATES.map((r, i) => (
              <View key={i} style={[styles.rateRow, i < RATES.length - 1 && styles.rateDivider]}>
                <Text style={{ fontSize: 16, marginRight: 10 }}>{r.icon}</Text>
                <Text style={styles.rateType}>{r.type}</Text>
                {r.free ? (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeTxt}>FREE</Text>
                  </View>
                ) : (
                  <Text style={styles.rateCr}>{r.rate}</Text>
                )}
              </View>
            ))}
            <View style={styles.ratesNote}>
              <Text style={styles.ratesNoteTxt}>Included plan minutes & SMS are used first. Wallet balance covers overages.</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable
          style={[styles.buyBtn, loading && { opacity: 0.7 }]}
          onPress={purchase}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={C.onAccent} />
            : <Text style={styles.buyBtnTxt}>
                Add ${totalAdded.toFixed(2)} to Wallet — ${pack.price.toFixed(2)} →
              </Text>}
        </Pressable>
        <Text style={styles.footerNote}>Wallet balance never expires · Secure payment via Stripe</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface },
  backBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", marginTop: 2 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 1 },
  balanceCard: { borderRadius: 20, padding: 20, marginBottom: 20, alignItems: "center", backgroundColor: C.accent, shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
  balanceNum: { fontFamily: "Inter_700Bold", fontSize: 44, color: C.onAccent, letterSpacing: -1, lineHeight: 50 },
  balanceLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "rgba(26,23,20,0.65)", marginTop: 4 },
  balanceMeta: { marginTop: 10, backgroundColor: "rgba(26,23,20,0.12)", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  balanceMetaTxt: { fontFamily: "Inter_500Medium", fontSize: 11.5, color: C.onAccent },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 10 },
  packCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 8, overflow: "hidden" },
  packCardSel: { backgroundColor: C.accentDim, borderColor: C.accent },
  packTag: { position: "absolute", top: 0, right: 0, backgroundColor: C.accent, paddingHorizontal: 10, paddingVertical: 3, borderBottomLeftRadius: 8 },
  packTagTxt: { fontFamily: "Inter_700Bold", fontSize: 8.5, color: C.onAccent, letterSpacing: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.borderStrong, marginRight: 12, alignItems: "center", justifyContent: "center" },
  radioSel: { borderColor: C.accent },
  radioDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.accent },
  packAmount: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.5 },
  bonusBadge: { backgroundColor: C.greenDim, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  bonusTxt: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.green },
  packMeta: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  packPrice: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  ratesToggle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  ratesTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: C.textMuted },
  ratesCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, overflow: "hidden", marginBottom: 16 },
  rateRow: { flexDirection: "row", alignItems: "center", padding: 10, paddingHorizontal: 14 },
  rateDivider: { borderBottomWidth: 1, borderBottomColor: C.border },
  rateType: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textSec },
  freeBadge: { backgroundColor: C.greenDim, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  freeTxt: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.green },
  rateCr: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.accent },
  ratesNote: { padding: 12, paddingHorizontal: 14, backgroundColor: C.raised },
  ratesNoteTxt: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, lineHeight: 16 },
  footer: { backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, padding: 14 },
  buyBtn: { height: 52, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  buyBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },
  footerNote: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, textAlign: "center", marginTop: 8 },
});
