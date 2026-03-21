import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const PACKS = [
  { id: "c1", credits: 500,   price: 2.99,  bonus: null,         tag: null         },
  { id: "c2", credits: 1000,  price: 4.99,  bonus: "+100 free",  tag: "POPULAR"    },
  { id: "c3", credits: 2500,  price: 9.99,  bonus: "+500 free",  tag: "BEST VALUE" },
  { id: "c4", credits: 10000, price: 29.99, bonus: "+2000 free", tag: "PRO"        },
];

const RATES = [
  { type: "SMS outbound",           credits: 1, icon: "💬", free: false },
  { type: "SMS inbound",            credits: 0, icon: "💬", free: true },
  { type: "Call (per min)",         credits: 2, icon: "📞", free: false },
  { type: "MMS (send)",             credits: 3, icon: "📷", free: false },
  { type: "Voicemail transcription",credits: 5, icon: "🎤", free: false },
];

export default function Credits() {
  const insets = useSafeAreaInsets();
  const { credits, addCredits } = useApp();
  const [selected, setSelected]   = useState("c2");
  const [loading, setLoading]     = useState(false);
  const [showRates, setShowRates] = useState(false);

  const pack = PACKS.find(p => p.id === selected)!;

  const purchase = () => {
    setLoading(true);
    setTimeout(() => {
      const bonus = pack.bonus ? parseInt(pack.bonus) : 0;
      addCredits(pack.credits + bonus);
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
          <Text style={styles.headerTitle}>Credits</Text>
          <Text style={styles.headerSub}>Pay-as-you-go for calls & messages</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}>
        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={{ fontSize: 42, marginBottom: 4 }}>⭐</Text>
          <Text style={styles.balanceNum}>{credits.toLocaleString()}</Text>
          <Text style={styles.balanceLabel}>Available Credits</Text>
        </View>

        <Text style={styles.sectionLabel}>BUY CREDITS</Text>

        {PACKS.map((p, i) => {
          const isSel = selected === p.id;
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
                  <Text style={[styles.packCredits, isSel && { color: C.accent }]}>
                    {p.credits.toLocaleString()}
                  </Text>
                  <Text style={styles.packCreditsSub}>credits</Text>
                  {p.bonus && (
                    <View style={styles.bonusBadge}>
                      <Text style={styles.bonusTxt}>{p.bonus}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.packMeta}>
                  ~{Math.round(p.credits / 2)} min calls · {p.credits} SMS
                </Text>
              </View>
              <Text style={[styles.packPrice, isSel && { color: C.accent }]}>${p.price}</Text>
            </Pressable>
          );
        })}

        {/* Rates toggle */}
        <Pressable style={styles.ratesToggle} onPress={() => setShowRates(s => !s)}>
          <Text style={styles.ratesTxt}>View credit rates</Text>
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
                  <Text style={styles.rateCr}>{r.credits} cr</Text>
                )}
              </View>
            ))}
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
                Buy {pack.credits.toLocaleString()} Credits — ${pack.price} →
              </Text>}
        </Pressable>
        <Text style={styles.footerNote}>Credits never expire · Secure payment via Stripe</Text>
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
  balanceNum: { fontFamily: "Inter_700Bold", fontSize: 42, color: C.onAccent, letterSpacing: -1, lineHeight: 48 },
  balanceLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "rgba(26,23,20,0.65)", marginTop: 4 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 10 },
  packCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 8, overflow: "hidden" },
  packCardSel: { backgroundColor: C.accentDim, borderColor: C.accent },
  packTag: { position: "absolute", top: 0, right: 0, backgroundColor: C.accent, paddingHorizontal: 10, paddingVertical: 3, borderBottomLeftRadius: 8 },
  packTagTxt: { fontFamily: "Inter_700Bold", fontSize: 8.5, color: C.onAccent, letterSpacing: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.borderStrong, marginRight: 12, alignItems: "center", justifyContent: "center" },
  radioSel: { borderColor: C.accent },
  radioDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.accent },
  packCredits: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.5 },
  packCreditsSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSec },
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
  footer: { backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, padding: 14 },
  buyBtn: { height: 52, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  buyBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },
  footerNote: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, textAlign: "center", marginTop: 8 },
});
