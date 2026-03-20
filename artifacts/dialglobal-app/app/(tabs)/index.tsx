import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList, Alert, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { PLANS, VirtualNumber } from "@/data/mockData";

function NumberCard({ num, onDelete }: { num: VirtualNumber; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.card}>
      <Pressable style={styles.cardMain} onPress={() => setExpanded(e => !e)}>
        <View style={styles.flagWrap}>
          <Text style={styles.flag}>{num.flag}</Text>
          <View style={styles.activeDot} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.numTxt}>{num.number}</Text>
          <View style={styles.numMeta}>
            <Text style={styles.numCountry}>{num.country}</Text>
            <View style={styles.dot} />
            <Text style={[styles.numType, { color: num.type === "permanent" ? C.accent : C.green }]}>
              {num.type === "permanent" ? "Permanent" : `${num.expiresIn} left`}
            </Text>
          </View>
        </View>
        <View style={styles.stats}>
          {num.missedCalls > 0 && (
            <View style={styles.missedBadge}><Text style={styles.missedTxt}>{num.missedCalls}</Text></View>
          )}
          <Feather name={expanded ? "chevron-up" : "chevron-down"} size={16} color={C.textMuted} />
        </View>
      </Pressable>
      {expanded && (
        <View style={styles.actions}>
          <View style={styles.statsRow}>
            {[{ label: "Calls", value: num.calls }, { label: "Messages", value: num.sms }].map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statVal}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.actionBtns}>
            <Pressable style={[styles.actionBtn, { backgroundColor: C.accent }]}>
              <Feather name="phone" size={15} color="#0D0D0E" />
              <Text style={[styles.actionTxt, { color: "#0D0D0E" }]}>Call</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => router.push("/inbox")}>
              <Feather name="message-square" size={15} color={C.textSec} />
              <Text style={styles.actionTxt}>Message</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => router.push({ pathname: "/number/[id]", params: { id: num.id } })}>
              <Feather name="settings" size={15} color={C.textSec} />
              <Text style={styles.actionTxt}>Manage</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, { backgroundColor: C.redDim }]} onPress={onDelete}>
              <Feather name="trash-2" size={15} color={C.red} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

export default function NumbersScreen() {
  const insets = useSafeAreaInsets();
  const { numbers, removeNumber, currentPlan } = useApp();
  const plan = PLANS.find(p => p.id === currentPlan);
  const isWeb = Platform.OS === "web";
  const tabBarH = isWeb ? 84 : 66;

  const handleDelete = (id: string) => {
    Alert.alert("Release Number?", "This number will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      { text: "Release", style: "destructive", onPress: () => removeNumber(id) },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + (isWeb ? 67 : 0) }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.headerTitle}>My Numbers</Text>
        </View>
        <Pressable style={styles.avatar} onPress={() => router.push("/profile")}>
          <Text style={styles.avatarTxt}>V</Text>
        </Pressable>
      </View>

      <Pressable style={styles.planBanner} onPress={() => router.push("/paywall")}>
        <View style={styles.planLeft}>
          <Ionicons name="star" size={14} color={C.accent} />
          <Text style={styles.planTxt}>{plan?.name} Plan</Text>
          {currentPlan !== "global" && <Text style={styles.planSub}>· Upgrade →</Text>}
        </View>
        <Text style={styles.planLimit}>{numbers.length} / {plan?.numberLimit} numbers</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabBarH + 90, gap: 10 }}>
        {numbers.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="hash" size={36} color={C.textMuted} />
            <Text style={styles.emptyTxt}>No virtual numbers yet</Text>
            <Text style={styles.emptySub}>Tap + to get your first number</Text>
          </View>
        ) : (
          numbers.map(n => <NumberCard key={n.id} num={n} onDelete={() => handleDelete(n.id)} />)
        )}
      </ScrollView>

      <Pressable style={[styles.fab, { bottom: tabBarH + (insets.bottom > 0 ? 12 : 20) }]} onPress={() => router.push("/picker")}>
        <Feather name="plus" size={22} color="#0D0D0E" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8 },
  greeting: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, letterSpacing: 0.5, textTransform: "uppercase" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, letterSpacing: -0.8, marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#0D0D0E" },
  planBanner: { marginHorizontal: 16, marginBottom: 14, backgroundColor: C.accentDim, borderRadius: 12, borderWidth: 1, borderColor: "rgba(232,160,32,0.2)", padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  planTxt: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.accent },
  planSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  planLimit: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textMuted },
  card: { backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  cardMain: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  flagWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", position: "relative" },
  flag: { fontSize: 22 },
  activeDot: { position: "absolute", bottom: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: C.green, borderWidth: 1.5, borderColor: C.surface },
  numTxt: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text, letterSpacing: -0.3 },
  numMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 },
  numCountry: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSec },
  dot: { width: 3, height: 3, borderRadius: 99, backgroundColor: C.textMuted },
  numType: { fontFamily: "Inter_500Medium", fontSize: 11.5 },
  stats: { flexDirection: "row", alignItems: "center", gap: 8 },
  missedBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.red, alignItems: "center", justifyContent: "center" },
  missedTxt: { fontFamily: "Inter_700Bold", fontSize: 10, color: "#fff" },
  actions: { borderTopWidth: 1, borderTopColor: C.border, padding: 14, gap: 12 },
  statsRow: { flexDirection: "row", gap: 20 },
  statItem: { alignItems: "center" },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 2 },
  actionBtns: { flexDirection: "row", gap: 8 },
  actionBtn: { flex: 1, height: 40, borderRadius: 10, backgroundColor: C.raised, borderWidth: 1, borderColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  actionTxt: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textSec },
  empty: { paddingVertical: 60, alignItems: "center", gap: 10 },
  emptyTxt: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: C.textSec },
  emptySub: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted },
  fab: { position: "absolute", right: 20, width: 56, height: 56, borderRadius: 18, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
});
