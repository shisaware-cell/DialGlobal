import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
  ActivityIndicator, Alert, ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { COUNTRIES, PLANS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";

const POPULAR = COUNTRIES.filter(c => c.popular);

type Country = typeof COUNTRIES[0];

export default function Picker() {
  const insets = useSafeAreaInsets();
  const { type: typeParam } = useLocalSearchParams<{ type?: string }>();
  const isLandline = typeParam === "landline";
  const { numbers, currentPlan, refreshNumbers, isAuthed } = useApp();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Country | null>(null);
  const [availableNums, setAvailableNums] = useState<{ number: string; monthly_cost: string }[]>([]);
  const [numIdx, setNumIdx] = useState(0);
  const [fetchingNums, setFetchingNums] = useState(false);
  const [provisioning, setProvisioning] = useState(false);

  const plan = PLANS.find(p => p.id === currentPlan) ?? PLANS[0];
  const canAdd = numbers.length < plan.numberLimit;

  const filtered = COUNTRIES.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.prefix.includes(search)
    );
  });
  const popularFiltered = filtered.filter(c => c.popular);
  const restFiltered = filtered.filter(c => !c.popular);

  const currentNumber = availableNums[numIdx]?.number ?? null;
  const currentPrice  = availableNums[numIdx]?.monthly_cost ?? null;

  const handleCountrySelect = async (c: Country) => {
    if (!canAdd) {
      Alert.alert("Limit Reached", `Your ${plan.name} plan allows ${plan.numberLimit} number${plan.numberLimit > 1 ? "s" : ""}. Upgrade to add more.`, [
        { text: "Upgrade Plan", onPress: () => { router.back(); setTimeout(() => router.push("/paywall"), 200); } },
        { text: "Cancel", style: "cancel" },
      ]);
      return;
    }
    setSelected(c);
    setAvailableNums([]);
    setNumIdx(0);
    setFetchingNums(true);
    try {
      const data = await api.searchNumbers(c.code, 6, isLandline ? "local" : undefined);
      const nums = (data.numbers || []).filter((n: any) => n.number);
      if (nums.length === 0) throw new Error("No numbers available");
      setAvailableNums(nums.map((n: any) => ({ number: n.number, monthly_cost: n.monthly_cost || "—" })));
      setNumIdx(0);
    } catch {
      Alert.alert("No Numbers Available", "Couldn't find available numbers for this country. Try another.", [
        { text: "OK", onPress: () => setSelected(null) },
      ]);
    } finally {
      setFetchingNums(false);
    }
  };

  const handleRefresh = () => {
    if (availableNums.length > 1) {
      setNumIdx(i => (i + 1) % availableNums.length);
    } else if (selected) {
      setFetchingNums(true);
      api.searchNumbers(selected.code, 6, isLandline ? "local" : undefined)
        .then(data => {
          const nums = (data.numbers || []).filter((n: any) => n.number);
          if (nums.length > 0) {
            setAvailableNums(nums.map((n: any) => ({ number: n.number, monthly_cost: n.monthly_cost || "—" })));
            setNumIdx(0);
          }
        })
        .catch(() => {})
        .finally(() => setFetchingNums(false));
    }
  };

  const handleProvision = async () => {
    if (!isAuthed) { router.push("/paywall"); return; }
    if (!selected || !currentNumber) return;
    setProvisioning(true);
    try {
      await api.provisionNumber({
        phone_number: currentNumber,
        country: selected.name,
        country_code: selected.code,
        flag: selected.flag,
        number_kind: isLandline ? "landline" : "mobile",
      });
      await refreshNumbers();
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to get this number. Please try again.");
    } finally {
      setProvisioning(false);
    }
  };

  const CountryRow = ({ c }: { c: Country }) => {
    const isSel = selected?.code === c.code;
    return (
      <Pressable
        style={({ pressed }) => [styles.item, isSel && styles.itemSel, { opacity: pressed ? 0.75 : 1 }]}
        onPress={() => handleCountrySelect(c)}
      >
        <Text style={styles.flag}>{c.flag}</Text>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[styles.name, isSel && { color: C.accent }]}>{c.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={styles.prefix}>{c.prefix}</Text>
            <View style={c.instant ? styles.instantBadge : styles.delayBadge}>
              <Text style={c.instant ? styles.instantTxt : styles.delayTxt}>
                {c.instant ? "⚡ Instant" : "1–2 days"}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.price}>~${c.price}/mo</Text>
        {isSel ? (
          <View style={styles.checkCircle}>
            <Feather name="check" size={12} color={C.onAccent} />
          </View>
        ) : (
          <Feather name="chevron-right" size={16} color={C.border} />
        )}
      </Pressable>
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="x" size={20} color={C.textSec} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{isLandline ? "Virtual Landline" : "Add a Number"}</Text>
          <Text style={styles.headerSub}>
            {isLandline ? "Business local numbers • HD Voice • E911 ready" : `${plan.numberLimit - numbers.length} of ${plan.numberLimit} remaining on ${plan.name}`}
          </Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={15} color={C.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search country or dial code (+44)…"
          placeholderTextColor={C.textMuted}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Country list */}
      <FlatList
        data={[
          ...(popularFiltered.length > 0 && !search
            ? [{ _type: "hdr" as const, title: "POPULAR", key: "hpop" }]
            : []),
          ...popularFiltered.map(c => ({ _type: "c" as const, ...c, key: c.code + "p" })),
          ...(restFiltered.length > 0
            ? [{ _type: "hdr" as const, title: search ? "RESULTS" : "ALL COUNTRIES", key: "hall" }]
            : []),
          ...restFiltered.map(c => ({ _type: "c" as const, ...c, key: c.code })),
        ]}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: selected ? 180 : insets.bottom + 24 }}
        renderItem={({ item }) => {
          if (item._type === "hdr") {
            return <Text style={styles.groupHeader}>{item.title}</Text>;
          }
          return <CountryRow c={item as any} />;
        }}
      />

      {/* Inline number preview + CTA — slides up when country selected */}
      {selected && (
        <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
          {fetchingNums ? (
            <View style={styles.numLoading}>
              <ActivityIndicator size="small" color={C.accent} />
              <Text style={styles.numLoadingTxt}>Finding available numbers…</Text>
            </View>
          ) : currentNumber ? (
            <View style={styles.numPreview}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>{selected.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.numPreviewNum}>{currentNumber}</Text>
                <Text style={styles.numPreviewSub}>
                  {selected.name} · {selected.prefix}
                  {currentPrice && currentPrice !== "—" ? ` · $${currentPrice}/mo` : ""}
                </Text>
                {/* Capabilities row */}
                <View style={{ flexDirection: "row", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
                  {[
                    { label: "📞 Voice", color: "#2D60C8", bg: "#D4E8FF" },
                    { label: "💬 SMS",   color: "#2D9966", bg: "#D4F4E8" },
                    { label: "🖼 MMS",   color: "#A06010", bg: "#FFF0D4" },
                    ...(isLandline ? [{ label: "📠 Fax", color: "#7030B0", bg: "#F4D4FF" }] : []),
                  ].map(cap => (
                    <View key={cap.label} style={{ backgroundColor: cap.bg, borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2 }}>
                      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 9.5, color: cap.color }}>{cap.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Pressable
                hitSlop={10}
                onPress={handleRefresh}
                disabled={fetchingNums}
                style={styles.refreshBtn}
              >
                <Feather name="refresh-cw" size={14} color={C.accent} />
                <Text style={styles.refreshTxt}>Refresh</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable
            style={[styles.getBtn, (provisioning || fetchingNums || !currentNumber) && { opacity: 0.6 }]}
            onPress={handleProvision}
            disabled={provisioning || fetchingNums || !currentNumber}
          >
            {provisioning ? (
              <>
                <ActivityIndicator size="small" color={C.onAccent} />
                <Text style={styles.getBtnTxt}>Provisioning…</Text>
              </>
            ) : (
              <Text style={styles.getBtnTxt}>{isLandline ? "Get Landline →" : `Get ${selected.name} Number →`}</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", marginTop: 2 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.5 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 2 },

  searchWrap: { marginHorizontal: 16, marginBottom: 6, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.raised, borderRadius: 12, borderWidth: 1, borderColor: C.border, height: 44, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 14, color: C.text, fontFamily: "Inter_400Regular" },

  groupHeader: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 7, fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4 },

  item: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13, gap: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  itemSel: { backgroundColor: C.accentDim },
  flag: { fontSize: 26 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14.5, color: C.text },
  prefix: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  instantBadge: { backgroundColor: "rgba(22,163,74,0.10)", borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2 },
  instantTxt: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.green },
  delayBadge: { backgroundColor: C.raised, borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2 },
  delayTxt: { fontFamily: "Inter_400Regular", fontSize: 10, color: C.textMuted },
  price: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.accent },
  checkCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },

  bottomSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border,
    paddingHorizontal: 16, paddingTop: 14,
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 }, elevation: 12,
  },
  numLoading: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12, paddingVertical: 6 },
  numLoadingTxt: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSec },
  numPreview: { flexDirection: "row", alignItems: "center", backgroundColor: C.raised, borderRadius: 12, padding: 12, marginBottom: 12 },
  numPreviewNum: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text, letterSpacing: 0.2 },
  numPreviewSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 2 },
  refreshBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingLeft: 10 },
  refreshTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.accent },

  getBtn: {
    height: 54, backgroundColor: C.accent, borderRadius: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  getBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.onAccent, letterSpacing: -0.2 },
});
