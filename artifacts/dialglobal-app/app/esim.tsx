import React, { useState } from "react";
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
  ActivityIndicator, Alert, ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { ESIM_COUNTRIES, EsimCountry, EsimPlan } from "@/data/mockData";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";

type Step = "countries" | "plans" | "done";

const POPULAR = ESIM_COUNTRIES.filter(c => c.popular);
const REST    = ESIM_COUNTRIES.filter(c => !c.popular);

export default function ESim() {
  const insets = useSafeAreaInsets();
  const { isAuthed } = useApp();
  const [step, setStep]               = useState<Step>("countries");
  const [search, setSearch]           = useState("");
  const [country, setCountry]         = useState<EsimCountry | null>(null);
  const [plan, setPlan]               = useState<EsimPlan | null>(null);
  const [loading, setLoading]         = useState(false);
  const [activationCode, setActivCode] = useState<string | null>(null);
  const [orderId, setOrderId]         = useState<string | null>(null);

  const filtered = ESIM_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPopular = filtered.filter(c => c.popular);
  const filteredRest    = filtered.filter(c => !c.popular);

  const openCountry = (c: EsimCountry) => {
    setCountry(c);
    setPlan(c.plans.find(p => p.popular) ?? c.plans[0]);
    setStep("plans");
  };

  const buyEsim = async () => {
    if (!isAuthed) { router.push("/paywall"); return; }
    if (!country || !plan) return;
    setLoading(true);
    try {
      const res = await api.orderEsim({
        plan_id: plan.id,
        region: country.name,
        data_gb: plan.data,
        days: plan.days,
        price: plan.price,
      });
      setOrderId(res.order_id ?? null);
      setActivCode(res.activation_code ?? null);
      setStep("done");
    } catch (err: any) {
      Alert.alert("eSIM Order Failed", err.message || "Could not place order. Please top up your Telnyx account.");
    } finally {
      setLoading(false);
    }
  };

  // ── Done screen ──────────────────────────────────────────────
  if (step === "done") {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
        <ScrollView contentContainerStyle={{ padding: 24, alignItems: "center", paddingBottom: insets.bottom + 40 }}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>📶</Text>
          <Text style={styles.doneTitle}>eSIM Ordered!</Text>
          <Text style={styles.doneSub}>
            Your {country?.name} eSIM is being processed by Telnyx. Use the code below to activate.
          </Text>

          <View style={styles.doneCard}>
            <Text style={{ fontSize: 32, marginBottom: 6 }}>{country?.flag}</Text>
            <Text style={styles.doneCountry}>{country?.name}</Text>
            <Text style={styles.doneDetail}>{plan?.data} · {plan?.days} days · {plan?.speed}</Text>
            {orderId && <Text style={styles.doneMuted}>Order ID: {orderId}</Text>}
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activeTxt}>Processing</Text>
            </View>
          </View>

          {activationCode ? (
            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>ACTIVATION CODE</Text>
              <Text style={styles.codeTxt} selectable>{activationCode}</Text>
              <Text style={styles.codeHint}>Settings → Mobile Data → Add eSIM → Enter code manually</Text>
            </View>
          ) : (
            <View style={styles.codeCard}>
              <Feather name="mail" size={18} color={C.accent} />
              <Text style={styles.codeHint}>Your activation code will be emailed once confirmed by Telnyx (usually a few minutes).</Text>
            </View>
          )}

          <Pressable style={[styles.primaryBtn, { marginTop: 12, width: "100%" }]} onPress={() => { setStep("countries"); setCountry(null); setPlan(null); }}>
            <Text style={styles.primaryBtnTxt}>Buy Another eSIM</Text>
          </Pressable>
          <Pressable style={[styles.ghostBtn, { marginTop: 10, width: "100%" }]} onPress={() => router.back()}>
            <Text style={styles.ghostBtnTxt}>Done</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ── Plans screen ─────────────────────────────────────────────
  if (step === "plans" && country) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => setStep("countries")} hitSlop={14} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={C.textSec} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{country.flag}  {country.name}</Text>
            <Text style={styles.headerSub}>Select a data plan · {country.region}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        >
          <Text style={styles.sectionLabel}>AVAILABLE PLANS</Text>

          {country.plans.map(p => {
            const isSel = plan?.id === p.id;
            return (
              <Pressable
                key={p.id}
                style={[styles.planCard, isSel && styles.planCardSel]}
                onPress={() => setPlan(p)}
              >
                {p.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularTxt}>POPULAR</Text>
                  </View>
                )}
                <View style={{ flex: 1, gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={styles.dataBadge}>
                      <Text style={styles.dataValue}>{p.data}</Text>
                    </View>
                    <View style={{ gap: 3 }}>
                      <Text style={styles.planDays}>{p.days} days validity</Text>
                      <View style={styles.speedRow}>
                        <Feather name="zap" size={10} color={C.green} />
                        <Text style={styles.planSpeed}>{p.speed}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", gap: 16 }}>
                    <View style={styles.featureItem}>
                      <Feather name="globe" size={11} color={C.textMuted} />
                      <Text style={styles.featureTxt}>Hotspot</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Feather name="smartphone" size={11} color={C.textMuted} />
                      <Text style={styles.featureTxt}>Multi-device</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Feather name="refresh-cw" size={11} color={C.textMuted} />
                      <Text style={styles.featureTxt}>Auto-renew</Text>
                    </View>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <Text style={[styles.planPrice, isSel && { color: C.accent }]}>${p.price}</Text>
                  {isSel ? (
                    <View style={styles.checkCircle}>
                      <Feather name="check" size={10} color={C.onAccent} />
                    </View>
                  ) : (
                    <View style={styles.emptyCircle} />
                  )}
                </View>
              </Pressable>
            );
          })}

          <View style={styles.infoBox}>
            <Feather name="info" size={13} color={C.accent} />
            <Text style={styles.infoTxt}>
              Plans activate immediately after purchase. eSIM stays valid for the selected days from first use.
            </Text>
          </View>
        </ScrollView>

        {plan && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
            <View style={styles.footerRow}>
              <View style={{ gap: 2 }}>
                <Text style={styles.footerLabel}>{country.flag}  {plan.data} · {plan.days} days</Text>
                <Text style={styles.footerSub}>{plan.speed} · {country.name}</Text>
              </View>
              <Text style={styles.footerPrice}>${plan.price}</Text>
            </View>
            <Pressable style={[styles.primaryBtn, { opacity: loading ? 0.7 : 1 }]} onPress={buyEsim} disabled={loading}>
              {loading
                ? <><ActivityIndicator size="small" color={C.onAccent} /><Text style={styles.primaryBtnTxt}>Processing…</Text></>
                : <Text style={styles.primaryBtnTxt}>Buy eSIM → ${plan.price}</Text>}
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  // ── Country list ─────────────────────────────────────────────
  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="x" size={20} color={C.textSec} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>eSIM</Text>
          <Text style={styles.headerSub}>Mobile data in 160+ countries — no SIM swap needed</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <Feather name="search" size={15} color={C.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search country or region…"
          placeholderTextColor={C.textMuted}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={[
          ...(filteredPopular.length > 0 && !search
            ? [{ _type: "hdr" as const, title: "POPULAR DESTINATIONS", key: "hpop" }]
            : []),
          ...filteredPopular.map(c => ({ _type: "c" as const, ...c, key: c.code + "p" })),
          ...(filteredRest.length > 0
            ? [{ _type: "hdr" as const, title: search ? "RESULTS" : "ALL COUNTRIES", key: "hall" }]
            : []),
          ...filteredRest.map(c => ({ _type: "c" as const, ...c, key: c.code })),
        ]}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        renderItem={({ item }) => {
          if (item._type === "hdr") {
            return <Text style={styles.sectionLabel}>{item.title}</Text>;
          }
          const c = item as EsimCountry & { key: string; _type: "c" };
          const from = Math.min(...c.plans.map(p => p.price));
          return (
            <Pressable
              style={({ pressed }) => [styles.countryRow, { opacity: pressed ? 0.75 : 1 }]}
              onPress={() => openCountry(c)}
            >
              <Text style={styles.flag}>{c.flag}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.countryName}>{c.name}</Text>
                <Text style={styles.countryRegion}>{c.region} · {c.plans.length} plans</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <Text style={styles.fromPrice}>from ${from.toFixed(2)}</Text>
                <View style={styles.instantBadge}>
                  <Feather name="zap" size={9} color={C.green} />
                  <Text style={styles.instantTxt}>Instant</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={16} color={C.border} style={{ marginLeft: 4 }} />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, paddingBottom: 10, gap: 10 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", marginTop: 2 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.5 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 2 },

  searchWrap: { marginHorizontal: 16, marginBottom: 6, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.raised, borderRadius: 12, borderWidth: 1, borderColor: C.border, height: 44, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 14, color: C.text, fontFamily: "Inter_400Regular" },

  sectionLabel: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4 },

  countryRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13, gap: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  flag: { fontSize: 28 },
  countryName: { fontFamily: "Inter_600SemiBold", fontSize: 14.5, color: C.text },
  countryRegion: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  fromPrice: { fontFamily: "Inter_700Bold", fontSize: 13, color: C.accent },
  instantBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: C.greenDim, borderRadius: 99, paddingHorizontal: 6, paddingVertical: 2 },
  instantTxt: { fontFamily: "Inter_600SemiBold", fontSize: 9.5, color: C.green },

  planCard: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: 14, padding: 14, marginBottom: 10, position: "relative", flexDirection: "row", alignItems: "center", gap: 12 },
  planCardSel: { backgroundColor: C.accentDim, borderColor: "rgba(232,160,32,0.45)" },
  popularBadge: { position: "absolute", top: -1, right: 12, backgroundColor: C.accent, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
  popularTxt: { fontFamily: "Inter_700Bold", fontSize: 9, color: C.onAccent, letterSpacing: 0.8 },
  dataBadge: { width: 64, height: 64, borderRadius: 14, backgroundColor: C.raised, alignItems: "center", justifyContent: "center" },
  dataValue: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text, letterSpacing: -0.5 },
  planDays: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.text },
  speedRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  planSpeed: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.green },
  featureItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  featureTxt: { fontFamily: "Inter_400Regular", fontSize: 10.5, color: C.textMuted },
  planPrice: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  checkCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  emptyCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: C.border },

  infoBox: { flexDirection: "row", gap: 10, alignItems: "flex-start", backgroundColor: C.accentDim, borderRadius: 12, padding: 12, marginTop: 4 },
  infoTxt: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSec, lineHeight: 18 },

  footer: { backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, padding: 14, gap: 12 },
  footerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.raised, borderRadius: 12, padding: 12 },
  footerLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.text },
  footerSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  footerPrice: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.accent },

  primaryBtn: { width: "100%", height: 52, backgroundColor: C.accent, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  primaryBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 15.5, color: C.onAccent },
  ghostBtn: { width: "100%", height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: C.borderStrong },
  ghostBtnTxt: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.textSec },

  doneTitle: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text, letterSpacing: -0.5, textAlign: "center", marginBottom: 8 },
  doneSub: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textSec, textAlign: "center", lineHeight: 22, marginBottom: 20 },
  doneCard: { width: "100%", backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderStrong, borderRadius: 18, padding: 20, alignItems: "center", gap: 6, marginBottom: 16 },
  doneCountry: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  doneDetail: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSec },
  doneMuted: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 4 },
  activePill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.greenDim, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4, marginTop: 6 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.green },
  activeTxt: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.green },
  codeCard: { width: "100%", backgroundColor: C.raised, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, gap: 10, alignItems: "center", marginBottom: 8 },
  codeLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4 },
  codeTxt: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.text, textAlign: "center", lineHeight: 20 },
  codeHint: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, textAlign: "center", lineHeight: 18 },
});
