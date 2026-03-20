import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import C from "@/constants/colors";
import { COUNTRIES, PLANS, genNumber } from "@/data/mockData";
import { useApp } from "@/context/AppContext";

export default function Picker() {
  const insets = useSafeAreaInsets();
  const { addNumber, numbers, currentPlan } = useApp();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const plan = PLANS.find(p => p.id === currentPlan)!;

  const filtered = COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const popular = filtered.filter(c => c.popular);
  const rest = filtered.filter(c => !c.popular);

  const canAdd = numbers.length < plan.numberLimit;

  const handle = (code: string) => {
    if (!canAdd) {
      Alert.alert("Limit Reached", `Upgrade your plan to add more numbers.`, [
        { text: "Upgrade", onPress: () => { router.back(); setTimeout(() => router.push("/paywall"), 300); } },
        { text: "Cancel", style: "cancel" },
      ]);
      return;
    }
    const c = COUNTRIES.find(x => x.code === code)!;
    setLoading(code);
    setTimeout(() => {
      addNumber({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        number: genNumber(c.prefix),
        country: c.name, countryCode: c.code, flag: c.flag, type: "permanent" as const,
        calls: 0, sms: 0, plan: plan.name, missedCalls: 0, lastActivity: "Just now",
      });
      setLoading(null);
      router.back();
    }, 1600);
  };

  const CountryItem = ({ c }: { c: typeof COUNTRIES[0] }) => {
    const isOn = selected === c.code;
    const isLoading = loading === c.code;
    const allowed = plan.countries === "100+" || plan.countries === "45+" ||
      (Array.isArray(plan.countries) && plan.countries.includes(c.code));
    return (
      <Pressable
        style={({ pressed }) => [styles.item, isOn && styles.itemOn, { opacity: (!allowed || pressed) ? 0.6 : 1 }]}
        onPress={() => { if (!allowed) { Alert.alert("Not on this plan", "Upgrade to access this country."); return; } setSelected(c.code); handle(c.code); }}
      >
        <Text style={styles.flag}>{c.flag}</Text>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.name}>{c.name}</Text>
          <Text style={styles.prefix}>{c.prefix}{c.instant ? "  ·  Instant" : "  ·  24h setup"}</Text>
        </View>
        <Text style={styles.price}>${c.price}/mo</Text>
        {!allowed && <View style={styles.lock}><Feather name="lock" size={12} color={C.textMuted} /></View>}
        {isLoading && <ActivityIndicator size="small" color={C.accent} />}
      </Pressable>
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.closeBtn}>
          <Feather name="x" size={20} color={C.textSec} />
        </Pressable>
        <Text style={styles.topTitle}>Add a Number</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchWrap}>
        <Feather name="search" size={15} color={C.textMuted} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search countries…" placeholderTextColor={C.textMuted} style={styles.searchInput} />
      </View>

      <FlatList
        data={[
          ...(popular.length > 0 ? [{ type: "header" as const, title: "Popular", key: "hpop" }] : []),
          ...popular.map(c => ({ type: "country" as const, ...c, key: c.code + "p" })),
          ...(rest.length > 0 ? [{ type: "header" as const, title: "All Countries", key: "hall" }] : []),
          ...rest.map(c => ({ type: "country" as const, ...c, key: c.code })),
        ]}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        renderItem={({ item }) => {
          if (item.type === "header") return <Text style={styles.groupHeader}>{item.title}</Text>;
          return <CountryItem c={item as any} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  closeBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center" },
  topTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },
  searchWrap: { marginHorizontal: 16, marginBottom: 4, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.raised, borderRadius: 12, borderWidth: 1, borderColor: C.border, height: 44, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 14.5, color: C.text, fontFamily: "Inter_400Regular" },
  groupHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted, letterSpacing: 1 },
  item: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13, gap: 13 },
  itemOn: { backgroundColor: C.accentDim },
  flag: { fontSize: 26 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14.5, color: C.text },
  prefix: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  price: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.accent },
  lock: { width: 22, height: 22, borderRadius: 6, backgroundColor: C.raised, alignItems: "center", justifyContent: "center" },
});
