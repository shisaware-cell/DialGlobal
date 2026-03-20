import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import C from "@/constants/colors";
import { PLANS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";

const PLAN_COLORS: Record<string, { main: string; dim: string }> = {
  basic:     { main: C.textSec, dim: C.raised },
  unlimited: { main: C.accent, dim: C.accentDim },
  global:    { main: "#B794F4", dim: "rgba(183,148,244,0.12)" },
};

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const { currentPlan, billing, upgradePlan } = useApp();
  const [cycle, setCycle] = useState<"monthly" | "yearly">(billing);
  const [selected, setSelected] = useState(currentPlan);

  const handleSelect = () => {
    upgradePlan(selected, cycle);
    router.back();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.closeBtn}>
          <Feather name="x" size={20} color={C.textSec} />
        </Pressable>
        <Text style={styles.topTitle}>Choose Plan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 100 }}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="globe" size={32} color={C.onAccent} />
          </View>
          <Text style={styles.heroTitle}>DialGlobal</Text>
          <Text style={styles.heroSub}>Virtual phone numbers for every use case</Text>
        </View>

        <View style={styles.cycleRow}>
          {(["monthly", "yearly"] as const).map(c => (
            <Pressable key={c} style={[styles.cycleBtn, cycle === c && styles.cycleBtnOn]} onPress={() => setCycle(c)}>
              <Text style={[styles.cycleTxt, cycle === c && styles.cycleTxtOn]}>
                {c === "monthly" ? "Monthly" : "Yearly  · Save 20%"}
              </Text>
            </Pressable>
          ))}
        </View>

        {PLANS.map(plan => {
          const col = PLAN_COLORS[plan.id];
          const price = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const isOn = selected === plan.id;
          return (
            <Pressable
              key={plan.id}
              style={[styles.planCard, { borderColor: isOn ? col.main : C.border, backgroundColor: isOn ? col.dim : C.surface }]}
              onPress={() => setSelected(plan.id)}
            >
              <View style={styles.planHead}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[styles.planName, { color: col.main }]}>{plan.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>${price}</Text>
                    <Text style={styles.perMo}>/ mo</Text>
                    {cycle === "yearly" && <View style={styles.saveBadge}><Text style={styles.saveTxt}>20% OFF</Text></View>}
                  </View>
                </View>
                {isOn && <View style={[styles.check, { backgroundColor: col.main }]}><Feather name="check" size={14} color={C.onAccent} /></View>}
                {!isOn && plan.id === "unlimited" && <View style={styles.popularBadge}><Text style={styles.popularTxt}>POPULAR</Text></View>}
              </View>
              <View style={styles.ftList}>
                {plan.features.map(f => (
                  <View key={f} style={styles.ftRow}>
                    <Feather name="check" size={13} color={col.main} />
                    <Text style={styles.ftTxt}>{f}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.88 : 1 }]} onPress={handleSelect}>
          <Text style={styles.btnTxt}>{selected === currentPlan ? "Confirm Plan" : "Upgrade Now"}</Text>
        </Pressable>
        <Text style={styles.legal}>Cancel anytime · Billed {cycle} · Restores included</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  closeBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center" },
  topTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },
  hero: { alignItems: "center", paddingVertical: 24, gap: 8 },
  heroIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.45, shadowRadius: 20, shadowOffset: { width:0, height:6 }, elevation: 10 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 24, color: C.text, letterSpacing: -0.5 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textMuted, textAlign: "center" },
  cycleRow: { flexDirection: "row", backgroundColor: C.raised, borderRadius: 12, padding: 4, gap: 4, marginBottom: 16 },
  cycleBtn: { flex: 1, height: 36, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  cycleBtnOn: { backgroundColor: C.surface },
  cycleTxt: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textMuted },
  cycleTxtOn: { color: C.text, fontFamily: "Inter_600SemiBold" },
  planCard: { borderRadius: 18, borderWidth: 1.5, padding: 18, marginBottom: 12, gap: 14 },
  planHead: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  planName: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.3 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 4, flexWrap: "wrap" },
  price: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, letterSpacing: -1 },
  perMo: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted },
  saveBadge: { backgroundColor: C.greenDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, marginLeft: 6 },
  saveTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: C.green, letterSpacing: 0.5 },
  check: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  popularBadge: { backgroundColor: C.accentDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  popularTxt: { fontFamily: "Inter_700Bold", fontSize: 9, color: C.accent, letterSpacing: 0.8 },
  ftList: { gap: 8 },
  ftRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ftTxt: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textSec, flex: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 12, gap: 10, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg },
  btn: { height: 54, backgroundColor: C.accent, borderRadius: 16, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width:0, height:4 }, elevation: 8 },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.onAccent },
  legal: { textAlign: "center", fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
});
