import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { PLANS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";

const PLAN_ICONS: Record<string, string> = {
  free: "🎯", starter: "⚡", pro: "🔥", global: "🌍",
};

const PLAN_COLORS: Record<string, { main: string; dim: string }> = {
  free:    { main: C.textSec,  dim: C.raised },
  starter: { main: C.accent,   dim: C.accentDim },
  pro:     { main: C.green,    dim: C.greenDim },
  global:  { main: C.purple,   dim: C.purpleDim },
};

const COMPARE_ROWS = [
  { feature: "Virtual numbers",  them: "1",         us: "Up to 15"   },
  { feature: "Countries",        them: "3–5",        us: "100+"        },
  { feature: "SMS & Calls",      them: "Limited",    us: "Unlimited"   },
  { feature: "Call recording",   them: "❌",         us: "✅"          },
  { feature: "Spam blocking",    them: "❌",         us: "✅"          },
  { feature: "Price",            them: "$7.99/mo",   us: "From free"   },
] as const;

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const { currentPlan, billing, upgradePlan } = useApp();
  const [cycle, setCycle]     = useState<"monthly" | "yearly">(billing);
  const [selected, setSelected] = useState(currentPlan === "free" ? "starter" : currentPlan);
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState<"plans" | "success">("plans");

  const activePlan = PLANS.find(p => p.id === selected) ?? PLANS[1];
  const price = cycle === "yearly" ? activePlan.yearlyPrice : activePlan.monthlyPrice;
  const annualSave = ((activePlan.monthlyPrice - activePlan.yearlyPrice) * 12).toFixed(2);

  const handleSubscribe = () => {
    if (selected === "free" || selected === currentPlan) {
      router.back();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      upgradePlan(selected, cycle);
      setLoading(false);
      setStep("success");
    }, 1200);
  };

  if (step === "success") {
    return (
      <View style={[styles.root, styles.successRoot, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>You're on {activePlan.name}!</Text>
        <Text style={styles.successSub}>
          Your plan is now active. Enjoy {activePlan.numberLimit} numbers in{" "}
          {typeof activePlan.countries === "string" ? activePlan.countries : "3"}+ countries.
        </Text>
        <Pressable style={styles.successBtn} onPress={() => { setStep("plans"); router.back(); }}>
          <Text style={styles.btnTxt}>Start Exploring →</Text>
        </Pressable>
      </View>
    );
  }

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

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.crown}>✨</Text>
          <Text style={styles.heroTitle}>Choose your plan</Text>
          <Text style={styles.heroSub}>Powered by Telnyx · Global coverage · Instant setup</Text>
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
                {c === "monthly" ? "Monthly" : "Annual"}
              </Text>
              {c === "yearly" && (
                <View style={styles.savePill}>
                  <Text style={styles.savePillTxt}>-20%</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* ── Plan cards ── */}
        {PLANS.map((plan, i) => {
          const col   = PLAN_COLORS[plan.id];
          const dp    = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const isSel = selected === plan.id;
          const isCur = currentPlan === plan.id;

          return (
            <Pressable
              key={plan.id}
              style={[
                styles.planCard,
                { borderColor: isSel ? col.main : C.border, backgroundColor: isSel ? col.dim : C.surface },
              ]}
              onPress={() => setSelected(plan.id)}
            >
              {/* Tag bar */}
              {plan.tag && (
                <View style={[styles.tagBar, { backgroundColor: plan.tagColor ?? C.accent }]}>
                  <Text style={styles.tagTxt}>{plan.tag}</Text>
                </View>
              )}

              <View style={{ padding: 14 }}>
                {/* Plan header */}
                <View style={styles.planHead}>
                  <View style={[styles.planIconBox, { backgroundColor: isSel ? col.dim : C.raised }]}>
                    <Text style={{ fontSize: 20 }}>{PLAN_ICONS[plan.id]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.planName, { color: col.main }]}>{plan.name}</Text>
                      {isCur && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentTxt}>CURRENT</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.priceRow}>
                      {dp === 0 ? (
                        <Text style={styles.freePrice}>Free forever</Text>
                      ) : (
                        <>
                          <Text style={styles.price}>${dp}</Text>
                          <Text style={styles.perMo}>/ mo</Text>
                          {cycle === "yearly" && (
                            <View style={styles.offBadge}><Text style={styles.offTxt}>20% OFF</Text></View>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                  <View style={[styles.radio, isSel && { borderColor: col.main, backgroundColor: col.main }]}>
                    {isSel && <View style={styles.radioDot} />}
                  </View>
                </View>

                {/* Feature list — shown when selected */}
                {isSel && (
                  <View style={styles.ftList}>
                    {plan.features.map(f => (
                      <View key={f} style={styles.ftRow}>
                        <Feather name="check" size={13} color={col.main} />
                        <Text style={styles.ftTxt}>{f}</Text>
                      </View>
                    ))}
                    {plan.notIncluded.length > 0 && (
                      <>
                        <View style={{ height: 8 }} />
                        {plan.notIncluded.map(f => (
                          <View key={f} style={styles.ftRow}>
                            <Feather name="x" size={13} color={C.textMuted} />
                            <Text style={[styles.ftTxt, { color: C.textMuted }]}>{f}</Text>
                          </View>
                        ))}
                      </>
                    )}
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}

        {/* ── How We Compare ── */}
        <View style={styles.compareSec}>
          <Text style={styles.compareTitle}>HOW WE COMPARE</Text>
          <View style={styles.compareCard}>
            <View style={styles.compareHeaderRow}>
              <View style={{ flex: 2 }} />
              <Text style={[styles.compareColHead, { flex: 1 }]}>Them</Text>
              <Text style={[styles.compareColHead, styles.compareUs, { flex: 1 }]}>Us</Text>
            </View>
            {COMPARE_ROWS.map((row, i) => (
              <View key={i} style={[styles.compareRow, i % 2 === 0 && { backgroundColor: C.raised }]}>
                <Text style={[styles.compareFeature, { flex: 2 }]}>{row.feature}</Text>
                <Text style={[styles.compareThem, { flex: 1 }]}>{row.them}</Text>
                <Text style={[styles.compareUsVal, { flex: 1 }]}>{row.us}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trial note */}
        <View style={styles.trialNote}>
          <Feather name="gift" size={14} color={C.accent} />
          <Text style={styles.trialTxt}>
            7-day free trial on all paid plans · Cancel anytime · No credit card required
          </Text>
        </View>

      </ScrollView>

      {/* ── Footer CTA ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        {cycle === "yearly" && selected !== "free" && Number(annualSave) > 0 && (
          <View style={styles.savingsBanner}>
            <Feather name="tag" size={13} color={C.green} />
            <Text style={styles.savingsTxt}>
              You save ${annualSave} per year
            </Text>
          </View>
        )}
        <Pressable
          style={({ pressed }) => [styles.btn, { opacity: pressed || loading ? 0.88 : 1 }]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          <Text style={styles.btnTxt}>
            {loading ? "Processing..." : selected === "free" ? "Continue with Free" : selected === currentPlan ? "Confirm Plan" : "Start Free Trial →"}
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
  successRoot: { alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 14 },
  successEmoji: { fontSize: 72 },
  successTitle: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text, textAlign: "center", letterSpacing: -0.5 },
  successSub: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textMuted, textAlign: "center", lineHeight: 22, marginBottom: 16 },
  successBtn: { width: "100%", height: 54, backgroundColor: C.accent, borderRadius: 16, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 } as any,

  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  closeBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center" },
  topTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },

  hero: { alignItems: "center", paddingTop: 8, paddingBottom: 20, gap: 6 },
  crown: { fontSize: 42 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text, letterSpacing: -0.5 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textMuted, textAlign: "center" },

  cycleRow: { flexDirection: "row", backgroundColor: C.raised, borderRadius: 12, padding: 4, gap: 4, marginBottom: 16 },
  cycleBtn: { flex: 1, height: 38, borderRadius: 9, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  cycleBtnOn: { backgroundColor: C.surface, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cycleTxt: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textMuted },
  cycleTxtOn: { color: C.text, fontFamily: "Inter_600SemiBold" },
  savePill: { backgroundColor: C.greenDim, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  savePillTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: C.green },

  planCard: { borderRadius: 18, borderWidth: 1.5, marginBottom: 10, overflow: "hidden" },
  tagBar: { height: 24, alignItems: "center", justifyContent: "center" },
  tagTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: "#fff", letterSpacing: 1.6 },
  planHead: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 4 },
  planIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  planName: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.2 },
  currentBadge: { backgroundColor: C.greenDim, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  currentTxt: { fontFamily: "Inter_700Bold", fontSize: 9, color: C.green, letterSpacing: 0.5 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 4, flexWrap: "wrap" },
  freePrice: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.textSec },
  price: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, letterSpacing: -1 },
  perMo: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted },
  offBadge: { backgroundColor: C.greenDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  offTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: C.green, letterSpacing: 0.5 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.borderStrong, alignItems: "center", justifyContent: "center", marginTop: 2, flexShrink: 0 },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#fff" },

  ftList: { gap: 9, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  ftRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  ftTxt: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSec, flex: 1 },

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

  compareSec: { marginTop: 8, marginBottom: 12 },
  compareTitle: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 10 },
  compareCard: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  compareHeaderRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  compareColHead: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.textMuted, textAlign: "center", letterSpacing: 0.5 },
  compareUs: { color: C.accent },
  compareRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 11 },
  compareFeature: { fontFamily: "Inter_500Medium", fontSize: 12.5, color: C.text },
  compareThem: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, textAlign: "center" },
  compareUsVal: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.accent, textAlign: "center" },
});
