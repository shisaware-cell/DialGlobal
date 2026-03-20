import React, { useState } from "react";
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
  ActivityIndicator, Alert, ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { COUNTRIES, PLANS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";

type Step = "countries" | "numbers";

export default function Picker() {
  const insets = useSafeAreaInsets();
  const { numbers, currentPlan, refreshNumbers } = useApp();
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<Step>("countries");
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [provisioning, setProvisioning] = useState<string | null>(null);

  const plan = PLANS.find(p => p.id === currentPlan)!;
  const canAdd = numbers.length < plan.numberLimit;

  const filtered = COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const popular = filtered.filter(c => c.popular);
  const rest = filtered.filter(c => !c.popular);

  const isAllowed = (code: string) =>
    plan.countries === "100+" || plan.countries === "45+" ||
    (Array.isArray(plan.countries) && plan.countries.includes(code));

  const handleCountrySelect = async (c: typeof COUNTRIES[0]) => {
    if (!canAdd) {
      Alert.alert("Limit Reached", "Upgrade your plan to add more numbers.", [
        { text: "Upgrade", onPress: () => { router.back(); setTimeout(() => router.push("/paywall"), 300); } },
        { text: "Cancel", style: "cancel" },
      ]);
      return;
    }
    if (!isAllowed(c.code)) {
      Alert.alert("Not on this plan", "Upgrade to access this country.");
      return;
    }
    setSelectedCountry(c);
    setStep("numbers");
    setSearching(true);
    setAvailableNumbers([]);
    try {
      const data = await api.searchNumbers(c.code, 6);
      setAvailableNumbers((data.numbers || []).map((n: any) => n.number));
    } catch (e: any) {
      Alert.alert("Error", "Could not find available numbers. Try again.");
      setStep("countries");
    } finally {
      setSearching(false);
    }
  };

  const handleProvision = async (phoneNumber: string) => {
    if (!selectedCountry) return;
    setProvisioning(phoneNumber);
    try {
      await api.provisionNumber({
        phone_number: phoneNumber,
        country: selectedCountry.name,
        country_code: selectedCountry.code,
        flag: selectedCountry.flag,
      });
      await refreshNumbers();
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to get this number. Please try again.");
    } finally {
      setProvisioning(null);
    }
  };

  const CountryItem = ({ c }: { c: typeof COUNTRIES[0] }) => {
    const allowed = isAllowed(c.code);
    return (
      <Pressable
        style={({ pressed }) => [styles.item, { opacity: (!allowed || pressed) ? 0.6 : 1 }]}
        onPress={() => handleCountrySelect(c)}
      >
        <Text style={styles.flag}>{c.flag}</Text>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.name}>{c.name}</Text>
          <Text style={styles.prefix}>{c.prefix}{c.instant ? "  ·  Instant" : "  ·  24h setup"}</Text>
        </View>
        <Text style={styles.price}>${c.price}/mo</Text>
        {!allowed && (
          <View style={styles.lock}>
            <Feather name="lock" size={12} color={C.textMuted} />
          </View>
        )}
        <Feather name="chevron-right" size={16} color={C.textMuted} />
      </Pressable>
    );
  };

  if (step === "numbers") {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
        <View style={styles.topRow}>
          <Pressable onPress={() => setStep("countries")} hitSlop={14} style={styles.closeBtn}>
            <Feather name="arrow-left" size={20} color={C.textSec} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.topTitle}>
              {selectedCountry?.flag} {selectedCountry?.name}
            </Text>
            <Text style={styles.topSub}>Choose your number</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {searching ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={C.accent} />
            <Text style={styles.searchingTxt}>Searching available numbers…</Text>
          </View>
        ) : availableNumbers.length === 0 ? (
          <View style={styles.centered}>
            <Feather name="phone-off" size={40} color={C.textMuted} />
            <Text style={styles.emptyTxt}>No numbers available{"\n"}in this country right now</Text>
            <Pressable style={styles.retryBtn} onPress={() => selectedCountry && handleCountrySelect(selectedCountry)}>
              <Text style={styles.retryTxt}>Try Again</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
            <Text style={styles.groupHeader}>AVAILABLE NUMBERS</Text>
            {availableNumbers.map(num => {
              const isLoading = provisioning === num;
              return (
                <Pressable
                  key={num}
                  style={({ pressed }) => [styles.numberItem, { opacity: pressed ? 0.8 : 1 }]}
                  onPress={() => handleProvision(num)}
                  disabled={provisioning !== null}
                >
                  <View style={styles.numberLeft}>
                    <Text style={styles.numberText}>{num}</Text>
                    <View style={styles.featureRow}>
                      <View style={styles.featureBadge}><Text style={styles.featureTxt}>Voice</Text></View>
                      <View style={styles.featureBadge}><Text style={styles.featureTxt}>SMS</Text></View>
                      <View style={styles.featureBadge}><Text style={styles.featureTxt}>MMS</Text></View>
                    </View>
                  </View>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={C.accent} />
                  ) : (
                    <View style={[styles.getBtn, provisioning !== null && { opacity: 0.5 }]}>
                      <Text style={styles.getBtnTxt}>Get</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  }

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
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search countries…"
          placeholderTextColor={C.textMuted}
          style={styles.searchInput}
        />
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
  topSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, marginTop: 2 },
  searchWrap: { marginHorizontal: 16, marginBottom: 4, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.raised, borderRadius: 12, borderWidth: 1, borderColor: C.border, height: 44, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 14.5, color: C.text, fontFamily: "Inter_400Regular" },
  groupHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted, letterSpacing: 1 },
  item: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13, gap: 13 },
  flag: { fontSize: 26 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14.5, color: C.text },
  prefix: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  price: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.accent },
  lock: { width: 22, height: 22, borderRadius: 6, backgroundColor: C.raised, alignItems: "center", justifyContent: "center" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 32 },
  searchingTxt: { fontFamily: "Inter_400Regular", fontSize: 15, color: C.textSec, textAlign: "center" },
  emptyTxt: { fontFamily: "Inter_400Regular", fontSize: 15, color: C.textSec, textAlign: "center", lineHeight: 24 },
  retryBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: C.accent, borderRadius: 12 },
  retryTxt: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.onAccent },
  numberItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border, gap: 12 },
  numberLeft: { flex: 1, gap: 8 },
  numberText: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: C.text, letterSpacing: 0.3 },
  featureRow: { flexDirection: "row", gap: 6 },
  featureBadge: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: C.raised, borderRadius: 6, borderWidth: 1, borderColor: C.border },
  featureTxt: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.textSec },
  getBtn: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: C.accent, borderRadius: 12 },
  getBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.onAccent },
});
