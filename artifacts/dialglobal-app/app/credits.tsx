import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { CREDIT_PACKS, CREDIT_RATES } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { CharEmptyPockets } from "@/components/Characters";

const RATES = [
  { type: "Outbound calls",   rate: `$${CREDIT_RATES.outboundCallPerMin.toFixed(3)}/min`,  note: "Calls you make to any number" },
  { type: "Inbound calls",    rate: `$${CREDIT_RATES.inboundCallPerMin.toFixed(3)}/min`,   note: "Calls you receive" },
  { type: "SMS",              rate: `$${CREDIT_RATES.smsPerMessage.toFixed(3)}/message`,   note: "Send or receive" },
  { type: "Call recording",   rate: `$${CREDIT_RATES.recordingPerMin.toFixed(3)}/min`,     note: "Per minute of recorded call" },
  { type: "Extra numbers",    rate: `$${CREDIT_RATES.extraNumberPerMonth.toFixed(2)}/mo`,  note: "Beyond your plan's number limit" },
];

const DISCLOSURES = [
  "Credits are added to your wallet immediately upon purchase.",
  "Credits never expire while your subscription is active.",
  "Credits are non-refundable once used.",
  "Unused credits are forfeited if your subscription is cancelled.",
  "Purchases are processed by Apple and subject to their terms.",
];

export default function Credits() {
  const insets = useSafeAreaInsets();
  const { credits, addCredits, isAuthed } = useApp();
  const [selected, setSelected]   = useState("c2");
  const [loading, setLoading]     = useState(false);
  const [showRates, setShowRates] = useState(false);

  const pack = CREDIT_PACKS.find(p => p.id === selected)!;

  const purchase = () => {
    if (!isAuthed) { router.push("/paywall"); return; }
    setLoading(true);
    setTimeout(() => {
      addCredits(pack.credits);
      setLoading(false);
    }, 1600);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={C.textSec} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Credit Wallet</Text>
          <Text style={styles.headerSub}>Top up to keep calling when your plan minutes run out</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 110 }}>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceOrb} />
          <Text style={styles.balanceLbl}>YOUR CREDIT BALANCE</Text>
          <Text style={styles.balanceNum}>${credits.toFixed(2)}</Text>
          {credits > 0 && (
            <View style={styles.balanceMeta}>
              <Text style={styles.balanceMetaTxt}>
                ~{Math.floor(credits / CREDIT_RATES.outboundCallPerMin)} min calls
              </Text>
              <Text style={[styles.balanceMetaTxt, { opacity: 0.5, marginHorizontal: 6 }]}>·</Text>
              <Text style={styles.balanceMetaTxt}>
                ~{Math.floor(credits / CREDIT_RATES.smsPerMessage)} SMS
              </Text>
            </View>
          )}
        </View>

        {credits <= 0 && (
          <View style={{ alignItems: "center", marginBottom: 16, marginTop: -4 }}>
            <CharEmptyPockets size={140} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.textSec, marginTop: 4 }}>
              Your wallet is empty
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              Top up to keep calling
            </Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>TOP UP WALLET</Text>

        {CREDIT_PACKS.map((p) => {
          const isSel = selected === p.id;
          return (
            <Pressable
              key={p.id}
              style={[styles.packCard, isSel && styles.packCardSel]}
              onPress={() => setSelected(p.id)}
            >
              {p.popular && (
                <View style={styles.packTag}>
                  <Text style={styles.packTagTxt}>POPULAR</Text>
                </View>
              )}
              <View style={[styles.radio, isSel && styles.radioSel]}>
                {isSel && <View style={styles.radioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <Text style={[styles.packLabel, isSel && { color: C.accent }]}>{p.label}</Text>
                  <Text style={[styles.packAmount, isSel && { color: C.accent }]}>
                    ${p.credits.toFixed(2)}
                  </Text>
                  {p.bonusLabel && (
                    <View style={styles.bonusBadge}>
                      <Text style={styles.bonusTxt}>{p.bonusLabel}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.packEquiv}>{p.equiv}</Text>
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
                <View style={{ flex: 1 }}>
                  <Text style={styles.rateType}>{r.type}</Text>
                  <Text style={styles.rateNote}>{r.note}</Text>
                </View>
                <Text style={styles.rateCr}>{r.rate}</Text>
              </View>
            ))}
            <View style={styles.ratesNote}>
              <Text style={styles.ratesNoteTxt}>Included plan minutes & SMS are used first. Wallet balance covers overages.</Text>
            </View>
          </View>
        )}

        {/* Apple-required disclosures */}
        <View style={styles.disclosureCard}>
          <Text style={styles.disclosureTitle}>IMPORTANT INFORMATION</Text>
          {DISCLOSURES.map((line, i) => (
            <View key={i} style={[styles.disclosureRow, i < DISCLOSURES.length - 1 && { marginBottom: 6 }]}>
              <View style={styles.disclosureDot} />
              <Text style={styles.disclosureTxt}>{line}</Text>
            </View>
          ))}
        </View>

        {/* Restore Purchases — Apple requires this */}
        <Pressable style={styles.restoreBtn}>
          <Feather name="refresh-cw" size={14} color={C.textSec} />
          <Text style={styles.restoreTxt}>Restore Purchases</Text>
        </Pressable>

        <Text style={styles.appleNote}>
          Payment charged to your Apple ID account at confirmation.{"\n"}
          Subscriptions managed in App Store settings.
        </Text>
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
                Add ${pack.credits.toFixed(2)} to Wallet — ${pack.price.toFixed(2)} →
              </Text>}
        </Pressable>
        <Text style={styles.footerNote}>Credits never expire · Secure payment via Apple</Text>
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

  balanceCard: { borderRadius: 20, padding: 20, marginBottom: 20, alignItems: "center", backgroundColor: C.accent, shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 10, overflow: "hidden", position: "relative" },
  balanceOrb: { position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.10)" },
  balanceLbl: { fontFamily: "Inter_700Bold", fontSize: 10, color: "rgba(255,255,255,0.65)", letterSpacing: 1.8, marginBottom: 6 },
  balanceNum: { fontFamily: "Inter_700Bold", fontSize: 46, color: C.onAccent, letterSpacing: -1.5, lineHeight: 52 },
  balanceMeta: { flexDirection: "row", alignItems: "center", marginTop: 10, backgroundColor: "rgba(26,23,20,0.12)", borderRadius: 99, paddingHorizontal: 14, paddingVertical: 5 },
  balanceMetaTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: C.onAccent },

  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 10 },

  packCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: 14, padding: 14, marginBottom: 8, overflow: "hidden" },
  packCardSel: { backgroundColor: C.accentDim, borderColor: C.accent },
  packTag: { position: "absolute", top: 0, right: 0, backgroundColor: C.accent, paddingHorizontal: 10, paddingVertical: 3, borderBottomLeftRadius: 8 },
  packTagTxt: { fontFamily: "Inter_700Bold", fontSize: 8.5, color: C.onAccent, letterSpacing: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.borderStrong, marginRight: 12, alignItems: "center", justifyContent: "center" },
  radioSel: { borderColor: C.accent },
  radioDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.accent },
  packLabel: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: C.textSec },
  packAmount: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.5 },
  bonusBadge: { backgroundColor: C.greenDim, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  bonusTxt: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.green },
  packEquiv: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  packPrice: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },

  ratesToggle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  ratesTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: C.textMuted },
  ratesCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, overflow: "hidden", marginBottom: 16 },
  rateRow: { flexDirection: "row", alignItems: "center", padding: 12, paddingHorizontal: 14 },
  rateDivider: { borderBottomWidth: 1, borderBottomColor: C.border },
  rateType: { fontFamily: "Inter_600SemiBold", fontSize: 12.5, color: C.text },
  rateNote: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 1 },
  rateCr: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.accent },
  ratesNote: { padding: 12, paddingHorizontal: 14, backgroundColor: C.raised },
  ratesNoteTxt: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, lineHeight: 16 },

  disclosureCard: { backgroundColor: C.raised, borderRadius: 12, padding: 14, marginBottom: 10 },
  disclosureTitle: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 10 },
  disclosureRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  disclosureDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.textMuted, marginTop: 6, flexShrink: 0 },
  disclosureTxt: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textSec, flex: 1, lineHeight: 17 },

  restoreBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 12, marginBottom: 10 },
  restoreTxt: { fontFamily: "Inter_600SemiBold", fontSize: 13.5, color: C.textSec },

  appleNote: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, textAlign: "center", lineHeight: 17, marginBottom: 8 },

  footer: { backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, padding: 14 },
  buyBtn: { height: 52, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  buyBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },
  footerNote: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, textAlign: "center", marginTop: 8 },
});
