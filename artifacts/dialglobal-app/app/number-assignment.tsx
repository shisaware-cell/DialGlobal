import React, { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { COUNTRIES, PLANS, TRIAL_LIMITS, genNumber } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";

const POPULAR = COUNTRIES.filter(c => c.popular);

type Step = "country" | "confirm" | "activating";

function StepDots({ current }: { current: number }) {
  const total = 2;
  return (
    <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{
          width: i < current ? 22 : 7, height: 7, borderRadius: 99,
          backgroundColor: i < current ? C.accent : C.border,
        }} />
      ))}
      <Text style={{ fontFamily: "Inter_700Bold", fontSize: 10, color: C.accent, marginLeft: 2 }}>
        {current}/{total}
      </Text>
    </View>
  );
}

export default function NumberAssignment() {
  const insets = useSafeAreaInsets();
  const { pendingPlan, upgradePlan, addNumber, addCredits, showToast } = useApp();

  const [step, setStep] = useState<Step>("country");
  const [country, setCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const [number, setNumber] = useState("");
  const [numberOptions, setNumberOptions] = useState<string[]>([]);
  const [numberOptionIdx, setNumberOptionIdx] = useState(0);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(0);
  const [activateSteps, setActivateSteps] = useState<string[]>([]);
  const [activateErr, setActivateErr] = useState("");

  const plan = PLANS.find(p => p.id === (pendingPlan || "professional")) ?? PLANS[1];

  const trialEnd = new Date(Date.now() + TRIAL_LIMITS.days * 86400000)
    .toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const dayFour = new Date(Date.now() + (TRIAL_LIMITS.days + 1) * 86400000)
    .toLocaleDateString("en-US", { month: "long", day: "numeric" });

  const filtered = search
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  const pickCountry = useCallback(async (c: typeof COUNTRIES[0]) => {
    setCountry(c);
    setNumberOptionIdx(0);
    setSearching(true);
    const fallback = genNumber(c.prefix);
    setNumber(fallback);
    try {
      const res = await api.searchNumbers(c.code, 6);
      const nums: string[] = (res.numbers || []).map((n: any) => n.number);
      if (nums.length > 0) {
        setNumberOptions(nums);
        setNumber(nums[0]);
      } else {
        setNumberOptions([fallback]);
      }
    } catch {
      setNumberOptions([fallback]);
    } finally {
      setSearching(false);
    }
  }, []);

  const refreshNumber = useCallback(() => {
    if (numberOptions.length === 0) return;
    const nextIdx = (numberOptionIdx + 1) % numberOptions.length;
    setNumberOptionIdx(nextIdx);
    setNumber(numberOptions[nextIdx]);
  }, [numberOptions, numberOptionIdx]);

  const handleActivate = async () => {
    if (!country) return;
    setStep("activating");
    setActivateErr("");
    const steps = [
      "Reserving your number…",
      "Setting up voicemail…",
      "Configuring SMS…",
      "Activating trial…",
    ];
    let idx = 0;
    setActivateSteps([steps[idx]]);
    let p = 0;

    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p > (idx + 1) * 25 && idx < steps.length - 1) {
        idx++;
        setActivateSteps(prev => [...prev, steps[idx]]);
      }
      if (p >= 90) {
        clearInterval(iv);
        setProgress(90);
      } else {
        setProgress(p);
      }
    }, 280);

    try {
      const result = await api.provisionNumber({
        phone_number: number,
        country: country.name,
        country_code: country.code,
        flag: country.flag,
      });

      clearInterval(iv);
      setProgress(100);
      setActivateSteps(steps);

      const provisionedNum = result.number;
      addNumber({
        id: provisionedNum?.id || String(Date.now()),
        phone_number: provisionedNum?.phone_number || number,
        country: provisionedNum?.country || country.name,
        country_code: provisionedNum?.country_code || country.code,
        flag: provisionedNum?.flag || country.flag,
        type: "trial",
        status: "active",
        call_count: 0,
        sms_count: 0,
        missed_count: 0,
        created_at: provisionedNum?.created_at || new Date().toISOString(),
      });
      addCredits(TRIAL_LIMITS.freeCredits);
      upgradePlan(pendingPlan || "professional", "monthly");

      setTimeout(() => {
        showToast("Trial activated! Welcome to DialGlobal 🎉", "success");
        router.replace("/(tabs)");
      }, 900);
    } catch (err: any) {
      clearInterval(iv);
      setActivateErr(err.message || "Failed to provision number. Please try again.");
      setStep("confirm");
      setProgress(0);
    }
  };

  /* ── ACTIVATING ── */
  if (step === "activating") {
    return (
      <View style={[act.root, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}>
        <View style={act.iconWrap}>
          {progress < 100 ? (
            <ActivityIndicator size="large" color={C.accent} />
          ) : (
            <Text style={{ fontSize: 52 }}>✅</Text>
          )}
        </View>

        <Text style={act.title}>
          {progress < 100 ? "Setting things up…" : "You're all set!"}
        </Text>
        <Text style={act.sub}>
          {progress < 100
            ? `Getting your ${country?.name} number ready`
            : `Your trial is active — enjoy ${TRIAL_LIMITS.callMinutes} mins & ${TRIAL_LIMITS.smsLimit} SMS`}
        </Text>

        {/* Progress bar */}
        <View style={act.barBg}>
          <View style={[act.barFill, { width: `${Math.min(progress, 100)}%` as any }]} />
        </View>

        {/* Steps */}
        <View style={act.stepsList}>
          {activateSteps.map((s, i) => (
            <View key={i} style={act.stepRow}>
              <Feather name="check-circle" size={14} color={C.green} />
              <Text style={act.stepTxt}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  /* ── CONFIRM ── */
  if (step === "confirm" && country) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => setStep("country")} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={C.text} />
          </Pressable>
          <StepDots current={2} />
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 120 }}
        >
          {/* Number hero */}
          <View style={cnf.hero}>
            <Text style={cnf.heroLabel}>YOUR TRIAL NUMBER</Text>
            <View style={cnf.flagWrap}>
              <Text style={cnf.flag}>{country.flag}</Text>
            </View>
            <Text style={cnf.numberTxt}>{number}</Text>
            <Text style={cnf.countryTxt}>{country.name}</Text>
            <Pressable onPress={refreshNumber} style={cnf.refreshBtn} disabled={searching || numberOptions.length <= 1}>
              <Feather name="refresh-cw" size={13} color={searching || numberOptions.length <= 1 ? C.textMuted : C.accent} />
              <Text style={[cnf.refreshTxt, (searching || numberOptions.length <= 1) && { color: C.textMuted }]}>Try a different number</Text>
            </Pressable>
          </View>

          {/* Amber trial banner */}
          <View style={cnf.trialBanner}>
            <Text style={cnf.trialBannerTitle}>🎁 3-Day Free Trial</Text>
            <Text style={cnf.trialBannerSub}>
              Full access ends {trialEnd}. No charge until then.
            </Text>
            <View style={cnf.limitGrid}>
              {[
                { icon: "📞", val: `${TRIAL_LIMITS.callMinutes} min`, lbl: "calls" },
                { icon: "💬", val: `${TRIAL_LIMITS.smsLimit} SMS`,  lbl: "messages" },
                { icon: "💳", val: `$${TRIAL_LIMITS.freeCredits}`,  lbl: "free credits" },
                { icon: "🌍", val: "1",                              lbl: "number" },
              ].map((it, i) => (
                <View key={i} style={cnf.limitItem}>
                  <Text style={cnf.limitIcon}>{it.icon}</Text>
                  <Text style={cnf.limitVal}>{it.val}</Text>
                  <Text style={cnf.limitLbl}>{it.lbl}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Plan activation card */}
          <View style={cnf.planCard}>
            <View style={cnf.planCardHeader}>
              <Text style={cnf.planCardEmoji}>{plan.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={cnf.planCardName}>{plan.name} plan activates on day 4</Text>
                <Text style={cnf.planCardDate}>Starting {dayFour} · ${plan.monthlyPrice}/month</Text>
              </View>
            </View>
            {plan.features.slice(0, 4).map(f => (
              <View key={f} style={cnf.planFtRow}>
                <Feather name="check" size={12} color={plan.color} />
                <Text style={cnf.planFtTxt}>{f}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Footer CTA */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          {activateErr ? (
            <Text style={styles.errTxt}>{activateErr}</Text>
          ) : (
            <Text style={styles.footerSub}>
              Requires card to activate — charged on day 4 if you don't cancel
            </Text>
          )}
          <Pressable
            style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.88 : 1 }]}
            onPress={handleActivate}
          >
            <Text style={styles.btnTxt}>Start My Free Trial →</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ── COUNTRY PICKER ── */
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/auth")} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </Pressable>
        <StepDots current={1} />
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Pick your country</Text>
        <Text style={styles.sub}>Choose where your trial number will be based</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={15} color={C.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search countries…"
          placeholderTextColor={C.textMuted}
          style={styles.searchInput}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} hitSlop={8}>
            <Feather name="x" size={14} color={C.textMuted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + (country ? 110 : 32) }}
      >
        {/* Popular chips */}
        {!search && (
          <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
            <Text style={styles.sectionLabel}>POPULAR</Text>
            <View style={styles.chipsRow}>
              {POPULAR.map(c => {
                const isSel = country?.code === c.code;
                return (
                  <Pressable
                    key={c.code}
                    style={[styles.chip, isSel && styles.chipSel]}
                    onPress={() => pickCountry(c)}
                  >
                    <Text style={styles.chipFlag}>{c.flag}</Text>
                    <Text style={[styles.chipTxt, isSel && { color: C.accent, fontFamily: "Inter_700Bold" }]}>
                      {c.name.split(" ")[0]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Full list */}
        <Text style={[styles.sectionLabel, { paddingHorizontal: 16, marginBottom: 0 }]}>
          {search ? "RESULTS" : "ALL COUNTRIES"}
        </Text>
        {filtered.map((c, i) => {
          const isSel = country?.code === c.code;
          return (
            <Pressable
              key={c.code}
              style={({ pressed }) => [
                styles.countryRow,
                isSel && { backgroundColor: C.accentDim },
                pressed && !isSel && { backgroundColor: C.raised },
                i === 0 && { marginTop: 4 },
              ]}
              onPress={() => pickCountry(c)}
            >
              <Text style={styles.countryFlag}>{c.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.countryName, isSel && { color: C.accent }]}>{c.name}</Text>
                <Text style={styles.countryCode}>{c.prefix}</Text>
              </View>
              {c.instant && (
                <View style={styles.instantBadge}>
                  <Text style={styles.instantTxt}>⚡ Instant</Text>
                </View>
              )}
              {isSel && <Feather name="check-circle" size={18} color={C.accent} />}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Selected number preview + CTA */}
      {country && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.numPreview}>
            <Text style={{ fontSize: 22 }}>{country.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.numPreviewCountry}>{country.name}</Text>
              {searching ? (
                <ActivityIndicator size="small" color={C.accent} style={{ alignSelf: "flex-start", marginTop: 2 }} />
              ) : (
                <Text style={styles.numPreviewNum}>{number}</Text>
              )}
            </View>
            <Pressable onPress={refreshNumber} hitSlop={8} disabled={searching || numberOptions.length <= 1}>
              <Text style={[styles.refreshLink, (searching || numberOptions.length <= 1) && { color: C.textMuted }]}>Refresh</Text>
            </Pressable>
          </View>
          <Pressable
            style={({ pressed }) => [styles.btn, { opacity: pressed || searching ? 0.7 : 1 }]}
            onPress={() => !searching && setStep("confirm")}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator color={C.onAccent} />
            ) : (
              <Text style={styles.btnTxt}>Use this number →</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 8, paddingTop: 8,
  },
  titleBlock: { paddingHorizontal: 16, marginBottom: 14 },
  title: { fontFamily: "Inter_700Bold", fontSize: 24, color: C.text, letterSpacing: -0.6, marginBottom: 4 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textSec },

  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.raised, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    marginHorizontal: 16, marginBottom: 14,
    borderWidth: 1, borderColor: C.border,
  },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14.5, color: C.text },

  sectionLabel: {
    fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted,
    letterSpacing: 1.4, marginBottom: 10,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: C.surface, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: C.border,
  },
  chipSel: { borderColor: C.accent, backgroundColor: C.accentDim },
  chipFlag: { fontSize: 16 },
  chipTxt: { fontFamily: "Inter_500Medium", fontSize: 12.5, color: C.textSec },

  countryRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  countryFlag: { fontSize: 26 },
  countryName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text, marginBottom: 2 },
  countryCode: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  instantBadge: { backgroundColor: C.accentDim, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
  instantTxt: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.accent },

  footer: {
    paddingHorizontal: 16, paddingTop: 10, gap: 10,
    borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg,
  },
  footerSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, textAlign: "center" },
  errTxt: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.red, textAlign: "center", backgroundColor: "rgba(220,38,38,0.08)", padding: 10, borderRadius: 10 },
  numPreview: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: C.raised, borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: C.border,
  },
  numPreviewCountry: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.text },
  numPreviewNum: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, letterSpacing: 0.3 },
  refreshLink: { fontFamily: "Inter_700Bold", fontSize: 12.5, color: C.accent },
  btn: {
    height: 56, backgroundColor: C.accent, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.onAccent },
});

const cnf = StyleSheet.create({
  hero: {
    alignItems: "center", paddingVertical: 24, marginBottom: 8,
    backgroundColor: C.surface, borderRadius: 20, marginHorizontal: 0, marginTop: 8,
    borderWidth: 1, borderColor: C.border,
  },
  heroLabel: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: C.textMuted, letterSpacing: 1.8, marginBottom: 14 },
  flagWrap: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: C.raised,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  flag: { fontSize: 40 },
  numberTxt: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text, letterSpacing: -0.5, marginBottom: 4 },
  countryTxt: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted, marginBottom: 12 },
  refreshBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  refreshTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12.5, color: C.accent },

  trialBanner: {
    backgroundColor: C.accentDim, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: C.accent + "30",
  },
  trialBannerTitle: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.accent, marginBottom: 4 },
  trialBannerSub: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.accent + "CC", marginBottom: 14, lineHeight: 18 },
  limitGrid: { flexDirection: "row", justifyContent: "space-between" },
  limitItem: { alignItems: "center", flex: 1 },
  limitIcon: { fontSize: 20, marginBottom: 4 },
  limitVal: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.accent, marginBottom: 2 },
  limitLbl: { fontFamily: "Inter_400Regular", fontSize: 10.5, color: C.accent + "AA", textAlign: "center" },

  planCard: {
    backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: C.border,
  },
  planCardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  planCardEmoji: { fontSize: 24 },
  planCardName: { fontFamily: "Inter_700Bold", fontSize: 13.5, color: C.text, marginBottom: 2 },
  planCardDate: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  planFtRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  planFtTxt: { fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textSec, flex: 1 },
});

const act = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: C.accentDim,
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text, textAlign: "center", letterSpacing: -0.5, marginBottom: 8 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textMuted, textAlign: "center", lineHeight: 20, marginBottom: 28 },
  barBg: { width: "100%", height: 6, backgroundColor: C.raised, borderRadius: 99, marginBottom: 24, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: C.accent, borderRadius: 99 },
  stepsList: { gap: 10, width: "100%", alignItems: "flex-start" },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepTxt: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSec },
});
