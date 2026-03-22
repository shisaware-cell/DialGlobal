import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { PLANS, TRIAL_LIMITS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";

function CheckIcon({ size = 11, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size + 4, height: size + 4, borderRadius: (size + 4) / 2, backgroundColor: color === "#fff" ? "rgba(255,255,255,0.2)" : color + "20", alignItems: "center", justifyContent: "center" }}>
      <Feather name="check" size={size} color={color} />
    </View>
  );
}

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const { selectPlan, pendingPlan, isAuthed, upgradePlan, currentPlan, isInTrial, trialEnds } = useApp();
  const [selected, setSelected] = useState(isAuthed ? currentPlan : (pendingPlan || "professional"));
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");

  const activePlan = PLANS.find(p => p.id === selected) ?? PLANS[1];
  const price = cycle === "yearly" ? activePlan.yearlyPrice : activePlan.monthlyPrice;
  const trialEnd = new Date(Date.now() + TRIAL_LIMITS.days * 86400000)
    .toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const trialDaysLeft = isAuthed && isInTrial && trialEnds
    ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / 86400000))
    : null;

  const handleContinue = () => {
    if (isAuthed) {
      upgradePlan(selected, cycle);
      router.back();
    } else {
      selectPlan(selected);
      router.replace("/auth");
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Gradient hero top ── */}
      <View style={styles.hero}>
        {/* Close button */}
        <Pressable
          style={styles.closeBtn}
          onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")}
          hitSlop={12}
        >
          <Feather name="x" size={20} color={C.textMuted} />
        </Pressable>

        {!isAuthed && (
          <View style={styles.heroPill}>
            <Text style={styles.heroPillTxt}>3-DAY FREE TRIAL</Text>
          </View>
        )}
        <Text style={styles.heroTitle}>
          {isAuthed ? "Choose a Plan" : "Try DialGlobal free"}
        </Text>
        <Text style={styles.heroSub}>
          {isAuthed
            ? "Upgrade or switch your plan at any time."
            : `Get a real number, make calls & send SMS.\nNo charge until ${trialEnd}.`}
        </Text>

        {/* Trial days remaining pill — shown when user is in trial */}
        {trialDaysLeft !== null && (
          <View style={[styles.trialRemainPill, { backgroundColor: activePlan.colorDim, borderColor: activePlan.color + "40" }]}>
            <Feather name="clock" size={12} color={activePlan.color} />
            <Text style={[styles.trialRemainTxt, { color: activePlan.color }]}>
              {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining on your free trial
            </Text>
          </View>
        )}

        {/* Billing toggle */}
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
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 120 }}
      >
        {/* ── Plan cards ── */}
        {PLANS.map((plan) => {
          const isSel = selected === plan.id;
          const dp = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <Pressable
              key={plan.id}
              style={[
                styles.planCard,
                { borderColor: isSel ? plan.color : C.border,
                  backgroundColor: isSel ? plan.colorDim : C.surface },
              ]}
              onPress={() => setSelected(plan.id)}
            >
              {plan.tag && (
                <View style={[styles.tagBar, { backgroundColor: plan.color }]}>
                  <Text style={styles.tagTxt}>{plan.tag}</Text>
                </View>
              )}

              <View style={styles.cardInner}>
                <View style={styles.planHead}>
                  <View style={[styles.planIconBox, { backgroundColor: plan.colorDim }]}>
                    <Text style={{ fontSize: 20 }}>{plan.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                    <Text style={styles.planPersona} numberOfLines={1}>{plan.persona}</Text>
                  </View>
                  <View style={[styles.radio, isSel && { borderColor: plan.color, backgroundColor: plan.color }]}>
                    {isSel && <View style={styles.radioDot} />}
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: isSel ? plan.color : C.text }]}>${dp}</Text>
                  <Text style={styles.perMo}>/mo</Text>
                  {cycle === "yearly" && (
                    <View style={[styles.offBadge, { backgroundColor: plan.colorDim }]}>
                      <Text style={[styles.offTxt, { color: plan.color }]}>20% OFF</Text>
                    </View>
                  )}
                </View>
                {cycle === "yearly" && (
                  <Text style={styles.billedAs}>Billed as ${plan.yearlyBilled}/year</Text>
                )}

                {isSel && (
                  <View style={styles.ftList}>
                    {plan.features.map(f => (
                      <View key={f} style={styles.ftRow}>
                        <CheckIcon color={plan.color} />
                        <Text style={styles.ftTxt}>{f}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}

        {/* Trial benefits strip — only shown during onboarding (not logged in) */}
        {!isAuthed && (
          <View style={styles.trialCard}>
            <View style={styles.trialHeader}>
              <Text style={styles.trialHeaderTxt}>🎁 What you get during your 3-day trial</Text>
            </View>
            {[
              { icon: "📞", label: `${TRIAL_LIMITS.callMinutes} minutes`, sub: "calls to any number worldwide" },
              { icon: "💬", label: `${TRIAL_LIMITS.smsLimit} SMS`,        sub: "send & receive globally" },
              { icon: "🌍", label: "1 virtual number",                     sub: "pick any country you want" },
              { icon: "💳", label: `$${TRIAL_LIMITS.freeCredits.toFixed(2)} free credits`, sub: "for extra calls & SMS" },
            ].map((r, i) => (
              <View key={i} style={[styles.trialRow, i > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}>
                <Text style={{ fontSize: 20 }}>{r.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.trialRowLabel}>{r.label}</Text>
                  <Text style={styles.trialRowSub}>{r.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── Footer CTA ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.legal}>
          {isAuthed
            ? `Cancel anytime · $${cycle === "yearly" ? activePlan.yearlyBilled + "/year" : activePlan.monthlyPrice.toFixed(2) + "/month"}`
            : `Cancel anytime · ${cycle === "yearly" ? `$${activePlan.yearlyBilled}/year after trial` : `$${activePlan.monthlyPrice.toFixed(2)}/month after trial`}`}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.88 : 1 }]}
          onPress={handleContinue}
        >
          <Text style={styles.btnTxt}>
            {isAuthed ? `Upgrade to ${activePlan.name} →` : `Continue with ${activePlan.name} →`}
          </Text>
        </Pressable>
        <View style={styles.legalLinks}>
          {["Terms", "Restore", "Privacy"].map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && <Text style={styles.legalSep}>|</Text>}
              <Pressable hitSlop={8}>
                <Text style={styles.legalLink}>{label}</Text>
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  hero: {
    paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10,
    background: "linear-gradient(160deg, #FFF0DC 0%, #F5F3EF 60%)" as any,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  closeBtn: {
    alignSelf: "flex-end", width: 34, height: 34, borderRadius: 17,
    backgroundColor: C.raised, alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  heroPill: {
    alignSelf: "flex-start", backgroundColor: C.accentDim,
    borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 10, marginTop: 4,
  },
  heroPillTxt: { fontFamily: "Inter_700Bold", fontSize: 10.5, color: C.accent, letterSpacing: 1.5 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text, letterSpacing: -0.7, marginBottom: 6 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textSec, lineHeight: 20, marginBottom: 16 },
  trialRemainPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start", borderRadius: 99, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16,
  },
  trialRemainTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12 },

  cycleRow: {
    flexDirection: "row", backgroundColor: C.raised,
    borderRadius: 12, padding: 3, gap: 3,
  },
  cycleBtn: { flex: 1, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  cycleBtnOn: { backgroundColor: C.surface, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cycleTxt: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textMuted },
  cycleTxtOn: { color: C.text, fontFamily: "Inter_600SemiBold" },
  savePill: { backgroundColor: C.greenDim, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  savePillTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: C.green },

  planCard: { borderRadius: 18, borderWidth: 1.5, marginBottom: 10, overflow: "hidden", marginTop: 12 },
  tagBar: { height: 24, alignItems: "center", justifyContent: "center" },
  tagTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: "#fff", letterSpacing: 1.6 },
  cardInner: { padding: 14 },

  planHead: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  planIconBox: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  planName: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.3 },
  planPersona: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.borderStrong, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#fff" },

  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 3, marginBottom: 2 },
  price: { fontFamily: "Inter_700Bold", fontSize: 32, letterSpacing: -1 },
  perMo: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted },
  offBadge: { marginLeft: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  offTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, letterSpacing: 0.5 },
  billedAs: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginBottom: 4 },

  ftList: { gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  ftRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  ftTxt: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSec, flex: 1 },

  trialCard: {
    marginTop: 16, backgroundColor: C.surface,
    borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: "hidden",
  },
  trialHeader: {
    backgroundColor: C.accentDim, paddingHorizontal: 16, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  trialHeaderTxt: { fontFamily: "Inter_700Bold", fontSize: 13, color: C.accent },
  trialRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 11 },
  trialRowLabel: { fontFamily: "Inter_700Bold", fontSize: 13.5, color: C.text },
  trialRowSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 1 },

  footer: {
    paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg,
    gap: 8,
  },
  legal: { textAlign: "center", fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  btn: {
    height: 56, backgroundColor: C.accent, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.onAccent },
  legalLinks: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  legalSep: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.borderStrong, paddingHorizontal: 6 },
  legalLink: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
});
