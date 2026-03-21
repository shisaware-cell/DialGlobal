import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { PLANS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";

function CheckIcon({ color = C.green }: { color?: string }) {
  return (
    <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: color + "20", alignItems: "center", justifyContent: "center" }}>
      <Feather name="check" size={11} color={color} />
    </View>
  );
}

export default function Upgrade() {
  const insets = useSafeAreaInsets();
  const { currentPlan, upgradePlan, profile, isInTrial } = useApp();
  const [selected, setSelected] = useState(() => {
    const higher = PLANS.find(p => p.id !== currentPlan && p.monthlyPrice > (PLANS.find(q => q.id === currentPlan)?.monthlyPrice ?? 0));
    return higher?.id ?? "professional";
  });
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);

  const activePlan = PLANS.find(p => p.id === selected) ?? PLANS[1];
  const currentPlanObj = PLANS.find(p => p.id === currentPlan);

  const handleUpgrade = async () => {
    if (selected === currentPlan) {
      Alert.alert("Already on this plan", "You are already subscribed to this plan.");
      return;
    }
    setLoading(true);
    try {
      await upgradePlan(selected, cycle);
      router.back();
      setTimeout(() => {
        Alert.alert(
          "Plan upgraded!",
          `You are now on the ${activePlan.name} plan. Enjoy your new features!`,
          [{ text: "Done" }]
        );
      }, 400);
    } catch {
      Alert.alert("Upgrade failed", "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const price = cycle === "yearly" ? activePlan.yearlyPrice : activePlan.monthlyPrice;
  const isDowngrade = (activePlan.monthlyPrice ?? 0) < (currentPlanObj?.monthlyPrice ?? 0);

  return (
    <View style={[s.root, { paddingTop: insets.top + 4 }]}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="x" size={20} color={C.text} />
        </Pressable>
        <Text style={s.headerTitle}>Upgrade Plan</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Current plan badge */}
      {currentPlanObj && (
        <View style={s.currentPlanRow}>
          <View style={s.currentPlanLeft}>
            <Text style={{ fontSize: 16 }}>{currentPlanObj.emoji}</Text>
            <View>
              <Text style={s.currentLabel}>Current plan</Text>
              <Text style={s.currentName}>{currentPlanObj.name}</Text>
            </View>
          </View>
          {isInTrial && (
            <View style={s.trialBadge}>
              <Text style={s.trialBadgeTxt}>TRIAL</Text>
            </View>
          )}
        </View>
      )}

      {/* Billing toggle */}
      <View style={s.cycleWrap}>
        <View style={s.cycleRow}>
          {(["monthly", "yearly"] as const).map(c => (
            <Pressable
              key={c}
              style={[s.cycleBtn, cycle === c && s.cycleBtnOn]}
              onPress={() => setCycle(c)}
            >
              <Text style={[s.cycleTxt, cycle === c && s.cycleTxtOn]}>
                {c === "monthly" ? "Monthly" : "Yearly"}
              </Text>
              {c === "yearly" && (
                <View style={s.savePill}>
                  <Text style={s.savePillTxt}>Save 20%</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 130 }}
      >
        {PLANS.map((plan) => {
          const isSel = selected === plan.id;
          const isCurrent = currentPlan === plan.id;
          const dp = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const isLower = plan.monthlyPrice < (currentPlanObj?.monthlyPrice ?? 0);

          return (
            <Pressable
              key={plan.id}
              style={[
                s.planCard,
                { borderColor: isCurrent ? C.border : isSel ? plan.color : C.border,
                  backgroundColor: isCurrent ? C.raised : isSel ? plan.colorDim : C.surface,
                  opacity: isCurrent ? 0.65 : 1 },
              ]}
              onPress={() => !isCurrent && setSelected(plan.id)}
              disabled={isCurrent}
            >
              {plan.tag && !isCurrent && (
                <View style={[s.tagBar, { backgroundColor: plan.color }]}>
                  <Text style={s.tagTxt}>{plan.tag}</Text>
                </View>
              )}
              {isCurrent && (
                <View style={[s.tagBar, { backgroundColor: C.borderStrong }]}>
                  <Text style={s.tagTxt}>CURRENT PLAN</Text>
                </View>
              )}

              <View style={s.cardInner}>
                <View style={s.planHead}>
                  <View style={[s.planIconBox, { backgroundColor: plan.colorDim }]}>
                    <Text style={{ fontSize: 20 }}>{plan.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.planName, { color: isCurrent ? C.textSec : plan.color }]}>{plan.name}</Text>
                    <Text style={s.planPersona} numberOfLines={1}>{plan.persona}</Text>
                  </View>
                  {!isCurrent && (
                    <View style={[s.radio, isSel && { borderColor: plan.color, backgroundColor: plan.color }]}>
                      {isSel && <View style={s.radioDot} />}
                    </View>
                  )}
                </View>

                <View style={s.priceRow}>
                  <Text style={[s.price, { color: isCurrent ? C.textMuted : isSel ? plan.color : C.text }]}>
                    ${dp}
                  </Text>
                  <Text style={s.perMo}>/mo</Text>
                  {cycle === "yearly" && !isCurrent && (
                    <View style={[s.offBadge, { backgroundColor: plan.colorDim }]}>
                      <Text style={[s.offTxt, { color: plan.color }]}>20% OFF</Text>
                    </View>
                  )}
                </View>

                {isSel && !isCurrent && (
                  <View style={s.ftList}>
                    {plan.features.map(f => (
                      <View key={f} style={s.ftRow}>
                        <CheckIcon color={plan.color} />
                        <Text style={s.ftTxt}>{f}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={s.legalTxt}>
          {cycle === "yearly"
            ? `$${activePlan.yearlyBilled}/year · Cancel anytime`
            : `$${activePlan.monthlyPrice.toFixed(2)}/month · Cancel anytime`}
        </Text>
        <Pressable
          style={({ pressed }) => [
            s.upgradeBtn,
            isDowngrade && s.upgradeBtnWarn,
            { opacity: pressed || loading ? 0.85 : 1 },
          ]}
          onPress={handleUpgrade}
          disabled={loading || selected === currentPlan}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={s.upgradeBtnTxt}>
              {isDowngrade
                ? `Downgrade to ${activePlan.name}`
                : `Upgrade to ${activePlan.name} — $${price}/mo`}
            </Text>
          )}
        </Pressable>
        <View style={s.legalLinks}>
          {["Terms", "Restore", "Privacy"].map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && <Text style={s.legalSep}>|</Text>}
              <Pressable hitSlop={8}>
                <Text style={s.legalLink}>{label}</Text>
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 12,
  },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text, letterSpacing: -0.3 },

  currentPlanRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginHorizontal: 16, marginBottom: 4,
    backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border,
    padding: 13,
  },
  currentPlanLeft: { flexDirection: "row", alignItems: "center", gap: 11 },
  currentLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  currentName: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text, marginTop: 2 },
  trialBadge: { backgroundColor: "rgba(124,58,237,0.12)", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  trialBadgeTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: "#7C3AED", letterSpacing: 1.4 },

  cycleWrap: { paddingHorizontal: 16, paddingVertical: 10 },
  cycleRow: { flexDirection: "row", backgroundColor: C.raised, borderRadius: 12, padding: 3, gap: 3 },
  cycleBtn: { flex: 1, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  cycleBtnOn: { backgroundColor: C.surface, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cycleTxt: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textMuted },
  cycleTxtOn: { color: C.text, fontFamily: "Inter_600SemiBold" },
  savePill: { backgroundColor: C.greenDim, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  savePillTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: C.green },

  planCard: { borderRadius: 18, borderWidth: 1.5, marginBottom: 10, overflow: "hidden" },
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
  ftList: { gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  ftRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  ftTxt: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSec, flex: 1 },

  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg, gap: 8 },
  legalTxt: { textAlign: "center", fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  upgradeBtn: {
    height: 56, backgroundColor: C.accent, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  upgradeBtnWarn: { backgroundColor: C.textSec },
  upgradeBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.onAccent },
  legalLinks: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  legalSep: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.borderStrong, paddingHorizontal: 6 },
  legalLink: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
});
