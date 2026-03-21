import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { PLANS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";

const PLAN_COLORS: Record<string, { main: string; dim: string }> = {
  basic:     { main: C.textSec,  dim: C.raised },
  unlimited: { main: C.accent,   dim: C.accentDim },
  global:    { main: "#B794F4",  dim: "rgba(183,148,244,0.12)" },
};

const CREDITS_BONUS: Record<string, { amount: string; label: string }> = {
  basic:     { amount: "+200 ⭐", label: "credits included" },
  unlimited: { amount: "+1,000 ⭐", label: "credits included" },
  global:    { amount: "+5,000 ⭐", label: "credits included" },
};

const BENEFITS = [
  { icon: "globe",          text: "Virtual number in 100+ countries"     },
  { icon: "message-square", text: "Unlimited texts & calls"               },
  { icon: "slash",          text: "Spam & robocall blocker built-in"      },
  { icon: "shield",         text: "Your real number always stays hidden"  },
  { icon: "zap",            text: "Instant number activation"             },
  { icon: "x-circle",       text: "No contracts, cancel anytime"          },
];

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const { currentPlan, billing, upgradePlan } = useApp();
  const [cycle,    setCycle]    = useState<"monthly" | "yearly">(billing);
  const [selected, setSelected] = useState(currentPlan);

  const handleSelect = () => {
    upgradePlan(selected, cycle);
    router.back();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>

      {/* ── Nav ── */}
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.closeBtn}>
          <Feather name="x" size={20} color={C.textSec} />
        </Pressable>
        <Text style={styles.topTitle}>Choose Plan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 110 }}
      >

        {/* ── Crown hero ── */}
        <View style={styles.hero}>
          <Text style={styles.crown}>👑</Text>
          <Text style={styles.heroTitle}>Go Premium</Text>
          <Text style={styles.heroSub}>Everything you need for a global presence</Text>
        </View>

        {/* ── Benefits checklist ── */}
        <View style={styles.benefitsCard}>
          {BENEFITS.map(b => (
            <View key={b.text} style={styles.benefitRow}>
              <View style={styles.benefitCheck}>
                <Feather name="check" size={12} color={C.onAccent} />
              </View>
              <Text style={styles.benefitTxt}>{b.text}</Text>
            </View>
          ))}
        </View>

        {/* ── Billing toggle ── */}
        <View style={styles.cycleRow}>
          {(["monthly", "yearly"] as const).map(c => (
            <Pressable
              key={c}
              style={[styles.cycleBtn, cycle === c && styles.cycleBtnOn]}
              onPress={() => setCycle(c)}
            >
              <Text style={[styles.cycleTxt, cycle === c && styles.cycleTxtOn]}>
                {c === "monthly" ? "Monthly" : "Yearly"}
              </Text>
              {c === "yearly" && (
                <View style={styles.savePill}>
                  <Text style={styles.savePillTxt}>Save 20%</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* ── Plan cards ── */}
        {PLANS.map(plan => {
          const col    = PLAN_COLORS[plan.id];
          const price  = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const isOn   = selected === plan.id;
          const credit = CREDITS_BONUS[plan.id];
          return (
            <Pressable
              key={plan.id}
              style={[
                styles.planCard,
                { borderColor: isOn ? col.main : C.border, backgroundColor: isOn ? col.dim : C.surface },
              ]}
              onPress={() => setSelected(plan.id)}
            >
              {/* Radio + name row */}
              <View style={styles.planHead}>
                <View style={[styles.radio, isOn && { borderColor: col.main, backgroundColor: col.main }]}>
                  {isOn && <View style={styles.radioDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.planName, { color: col.main }]}>{plan.name}</Text>
                    {!isOn && plan.id === "unlimited" && (
                      <View style={styles.popularBadge}><Text style={styles.popularTxt}>POPULAR</Text></View>
                    )}
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>${price}</Text>
                    <Text style={styles.perMo}>/ mo</Text>
                    {cycle === "yearly" && (
                      <View style={styles.offBadge}><Text style={styles.offTxt}>20% OFF</Text></View>
                    )}
                  </View>
                </View>
              </View>

              {/* Credits bonus */}
              {credit && (
                <View style={[styles.creditRow, { borderColor: col.main + "33" }]}>
                  <Text style={[styles.creditAmt, { color: col.main }]}>{credit.amount}</Text>
                  <Text style={styles.creditLbl}>{credit.label}</Text>
                </View>
              )}

              {/* Feature list — shown when selected */}
              {isOn && (
                <View style={styles.ftList}>
                  {plan.features.map(f => (
                    <View key={f} style={styles.ftRow}>
                      <Feather name="check" size={13} color={col.main} />
                      <Text style={styles.ftTxt}>{f}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Trial note */}
        <View style={styles.trialNote}>
          <Feather name="gift" size={14} color={C.accent} />
          <Text style={styles.trialTxt}>
            7-day free trial on all plans · Cancel anytime · No credit card required
          </Text>
        </View>

      </ScrollView>

      {/* ── Footer CTA ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        {cycle === "yearly" && (
          <View style={styles.savingsBanner}>
            <Feather name="tag" size={13} color={C.green} />
            <Text style={styles.savingsTxt}>
              You save ${((PLANS.find(p => p.id === selected)?.monthlyPrice ?? 0) * 12 * 0.2).toFixed(2)} per year
            </Text>
          </View>
        )}
        <Pressable
          style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.88 : 1 }]}
          onPress={handleSelect}
        >
          <Text style={styles.btnTxt}>
            {selected === currentPlan ? "Confirm Plan" : "Start Free Trial →"}
          </Text>
        </Pressable>
        <Text style={styles.legal}>
          Billed {cycle} · Restores purchases · Cancel anytime
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  closeBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center" },
  topTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },

  hero: { alignItems: "center", paddingTop: 8, paddingBottom: 20, gap: 6 },
  crown: { fontSize: 56 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text, letterSpacing: -0.5 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textMuted, textAlign: "center" },

  benefitsCard: {
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border,
    padding: 16, gap: 12, marginBottom: 18,
  },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  benefitCheck: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  benefitTxt: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.text, flex: 1 },

  cycleRow: { flexDirection: "row", backgroundColor: C.raised, borderRadius: 12, padding: 4, gap: 4, marginBottom: 16 },
  cycleBtn: { flex: 1, height: 38, borderRadius: 9, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  cycleBtnOn: { backgroundColor: C.surface, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cycleTxt: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textMuted },
  cycleTxtOn: { color: C.text, fontFamily: "Inter_600SemiBold" },
  savePill: { backgroundColor: C.greenDim, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  savePillTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: C.green },

  planCard: { borderRadius: 18, borderWidth: 1.5, padding: 16, marginBottom: 12, gap: 12 },
  planHead: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.borderStrong, alignItems: "center", justifyContent: "center", marginTop: 2, flexShrink: 0 },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#fff" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  planName: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.3 },
  popularBadge: { backgroundColor: C.accentDim, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 99 },
  popularTxt: { fontFamily: "Inter_700Bold", fontSize: 9, color: C.accent, letterSpacing: 0.8 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 4, flexWrap: "wrap" },
  price: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, letterSpacing: -1 },
  perMo: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted },
  offBadge: { backgroundColor: C.greenDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  offTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: C.green, letterSpacing: 0.5 },

  creditRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(0,0,0,0.03)", borderRadius: 10, padding: 10,
    borderWidth: 1,
  },
  creditAmt: { fontFamily: "Inter_700Bold", fontSize: 14 },
  creditLbl: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textMuted },

  ftList: { gap: 9 },
  ftRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  ftTxt: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textSec, flex: 1 },

  trialNote: {
    flexDirection: "row", alignItems: "flex-start", gap: 10, marginTop: 4, marginBottom: 8,
    backgroundColor: C.accentDim, borderRadius: 12, padding: 12,
  },
  trialTxt: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.accent, flex: 1, lineHeight: 18 },

  footer: { paddingHorizontal: 20, paddingTop: 12, gap: 10, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg },
  savingsBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.greenDim, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9,
    borderWidth: 1, borderColor: C.green + "30",
  },
  savingsTxt: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.green },
  btn: {
    height: 54, backgroundColor: C.accent, borderRadius: 16, alignItems: "center", justifyContent: "center",
    shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.onAccent },
  legal: { textAlign: "center", fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
});
