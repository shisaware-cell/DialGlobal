import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { PLANS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { CharLockedOut } from "@/components/Characters";

export default function ExpiredPaywall() {
  const insets = useSafeAreaInsets();
  const { upgradePlan, trialPlan, pendingPlan } = useApp();

  const [selected, setSelected] = useState(trialPlan || pendingPlan || "professional");
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const plan = PLANS.find(p => p.id === selected) ?? PLANS[1];
  const price = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  const handleSubscribe = () => {
    setLoading(true);
    setTimeout(() => {
      upgradePlan(selected, cycle);
      setLoading(false);
      router.replace("/(tabs)");
    }, 1800);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* Top — no back button */}
      <View style={styles.top}>
        <View style={styles.expiredPill}>
          <View style={styles.expiredDot} />
          <Text style={styles.expiredTxt}>Trial ended</Text>
        </View>
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <CharLockedOut size={180} />
        </View>
        <Text style={styles.title}>Subscribe to keep your number</Text>
        <Text style={styles.sub}>
          Your 3-day trial has ended. Subscribe now to reactivate your number and unlock all features.
        </Text>

        {/* Billing toggle */}
        <View style={styles.cycleRow}>
          {(["monthly", "yearly"] as const).map(b => (
            <Pressable
              key={b}
              style={[styles.cycleBtn, cycle === b && styles.cycleBtnOn]}
              onPress={() => setCycle(b)}
            >
              <Text style={[styles.cycleTxt, cycle === b && styles.cycleTxtOn]}>
                {b === "monthly" ? "Monthly" : "Yearly"}
              </Text>
              {b === "yearly" && (
                <View style={styles.savePill}>
                  <Text style={styles.savePillTxt}>Save 20%</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Plan list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14, paddingBottom: insets.bottom + 120 }}
      >
        {PLANS.map((p) => {
          const isSel = selected === p.id;
          const dp = cycle === "yearly" ? p.yearlyPrice : p.monthlyPrice;
          const wasTrial = trialPlan === p.id;

          return (
            <Pressable
              key={p.id}
              style={[
                styles.planCard,
                { borderColor: isSel ? p.color : C.border, backgroundColor: isSel ? p.colorDim : C.surface },
              ]}
              onPress={() => setSelected(p.id)}
            >
              {wasTrial && (
                <View style={[styles.tagBar, { backgroundColor: C.accent }]}>
                  <Text style={styles.tagTxt}>YOUR TRIAL PLAN</Text>
                </View>
              )}
              {p.tag && !wasTrial && (
                <View style={[styles.tagBar, { backgroundColor: p.color }]}>
                  <Text style={styles.tagTxt}>{p.tag}</Text>
                </View>
              )}

              <View style={styles.cardInner}>
                <View style={styles.planHead}>
                  <View style={[styles.planIconBox, { backgroundColor: p.colorDim }]}>
                    <Text style={{ fontSize: 20 }}>{p.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.planName, { color: p.color }]}>{p.name}</Text>
                    <Text style={styles.planPersona} numberOfLines={1}>{p.persona}</Text>
                  </View>
                  <View>
                    <Text style={[styles.price, { color: isSel ? p.color : C.text }]}>${dp}</Text>
                    <Text style={styles.perMo}>/month</Text>
                  </View>
                  <View style={[styles.radio, isSel && { borderColor: p.color, backgroundColor: p.color }]}>
                    {isSel && <View style={styles.radioDot} />}
                  </View>
                </View>

                {isSel && (
                  <View style={styles.ftList}>
                    {p.features.slice(0, 5).map(f => (
                      <View key={f} style={styles.ftRow}>
                        <Feather name="check" size={12} color={p.color} />
                        <Text style={styles.ftTxt}>{f}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}

        <Text style={styles.reassure}>
          Your number will be reinstated immediately upon subscribing. Same number you had during trial.
        </Text>
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.legal}>
          Cancel anytime ·{" "}
          {cycle === "yearly"
            ? `$${plan.yearlyBilled}/year billed annually`
            : `$${plan.monthlyPrice.toFixed(2)}/month`}{" "}
          · auto-renews
        </Text>
        <Pressable
          style={({ pressed }) => [styles.btn, { opacity: pressed || loading ? 0.88 : 1 }]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={C.onAccent} />
          ) : (
            <Text style={styles.btnTxt}>
              Subscribe — ${price.toFixed(2)}/{cycle === "yearly" ? "mo" : "month"} →
            </Text>
          )}
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

  top: {
    paddingHorizontal: 20, paddingBottom: 18,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  expiredPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.redDim, borderRadius: 99,
    paddingHorizontal: 12, paddingVertical: 5,
    alignSelf: "flex-start", marginBottom: 14, marginTop: 4,
  },
  expiredDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.red },
  expiredTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.red },

  title: { fontFamily: "Inter_700Bold", fontSize: 24, color: C.text, letterSpacing: -0.6, marginBottom: 8, lineHeight: 30 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textSec, lineHeight: 20, marginBottom: 16 },

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

  planHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  planIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  planName: { fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: -0.2 },
  planPersona: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 2 },
  price: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5, textAlign: "right" },
  perMo: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, textAlign: "right" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.borderStrong, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#fff" },

  ftList: { gap: 7, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  ftRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  ftTxt: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textSec, flex: 1 },

  reassure: {
    fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textMuted,
    textAlign: "center", lineHeight: 18, marginTop: 4, paddingHorizontal: 8,
  },

  footer: {
    paddingHorizontal: 20, paddingTop: 12, gap: 8,
    borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg,
  },
  legal: { textAlign: "center", fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  btn: {
    height: 56, backgroundColor: C.accent, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.onAccent },
  legalLinks: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  legalSep: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.borderStrong, paddingHorizontal: 8 },
  legalLink: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
});
