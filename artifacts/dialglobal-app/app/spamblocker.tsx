import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function SpamBlocker() {
  const insets = useSafeAreaInsets();
  const { numbers, ghostMode, setGhostMode, dndNumbers, toggleDnd, spamEnabled, toggleSpam } = useApp();
  const [robocall, setRobocall]   = useState(true);
  const [unknown, setUnknown]     = useState(false);
  const [intl, setIntl]           = useState(false);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={C.textSec} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Privacy & Blocking</Text>
          <Text style={styles.headerSub}>Spam blocking, DND & Ghost Mode</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        {/* Ghost Mode */}
        <View style={[styles.ghostCard, ghostMode && styles.ghostCardOn]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.ghostTitle, ghostMode && { color: "#fff" }]}>
              👻 Ghost Mode{ghostMode && <Text style={styles.ghostBadge}>  ACTIVE</Text>}
            </Text>
            <Text style={[styles.ghostSub, ghostMode && { color: "rgba(255,255,255,0.5)" }]}>
              Silences all numbers, hides badges, shows no activity
            </Text>
          </View>
          <Switch
            value={ghostMode}
            onValueChange={setGhostMode}
            trackColor={{ false: C.raised, true: C.accent }}
            thumbColor="#fff"
          />
        </View>

        {/* Spam Blocking */}
        <Text style={styles.sectionLabel}>SPAM BLOCKING</Text>
        <View style={styles.card}>
          {[
            { label: "Robocall Blocker", sub: "Block automated & spam calls", value: robocall, set: setRobocall },
            { label: "Unknown Numbers", sub: "Block callers with no Caller ID", value: unknown, set: setUnknown },
            { label: "International Block", sub: "Block all international numbers", value: intl, set: setIntl },
          ].map((row, i, arr) => (
            <View key={i}>
              <View style={styles.switchRow}>
                <View style={styles.redIcon}>
                  <Feather name="x" size={15} color={C.red} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowSub}>{row.sub}</Text>
                </View>
                <Switch
                  value={row.value}
                  onValueChange={row.set}
                  trackColor={{ false: C.raised, true: C.accent }}
                  thumbColor="#fff"
                />
              </View>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Per-number DND */}
        {numbers.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>DO NOT DISTURB — PER NUMBER</Text>
            <View style={styles.card}>
              {numbers.map((num, i) => (
                <View key={num.id}>
                  <View style={styles.switchRow}>
                    <View style={styles.flagBox}><Text style={{ fontSize: 18 }}>{num.flag}</Text></View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={styles.rowLabel}>{num.phone_number}</Text>
                      <Text style={styles.rowSub}>{num.country}</Text>
                    </View>
                    <Switch
                      value={!!dndNumbers[num.id]}
                      onValueChange={() => toggleDnd(num.id)}
                      trackColor={{ false: C.raised, true: C.accent }}
                      thumbColor="#fff"
                    />
                  </View>
                  {i < numbers.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>SPAM FILTER — PER NUMBER</Text>
            <View style={styles.card}>
              {numbers.map((num, i) => (
                <View key={num.id}>
                  <View style={styles.switchRow}>
                    <View style={styles.flagBox}><Text style={{ fontSize: 18 }}>{num.flag}</Text></View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={styles.rowLabel}>{num.phone_number}</Text>
                      <Text style={styles.rowSub}>{num.country}</Text>
                    </View>
                    <Switch
                      value={!!spamEnabled[num.id]}
                      onValueChange={() => toggleSpam(num.id)}
                      trackColor={{ false: C.raised, true: C.accent }}
                      thumbColor="#fff"
                    />
                  </View>
                  {i < numbers.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </>
        )}

        {numbers.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40, gap: 10 }}>
            <Feather name="phone-off" size={36} color={C.textMuted} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted, textAlign: "center" }}>
              Add a virtual number to configure per-number settings
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface },
  backBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", marginTop: 2 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 1 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 8, marginTop: 4 },
  ghostCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 12 },
  ghostCardOn: { backgroundColor: "#1A1714", borderColor: "transparent" },
  ghostTitle: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text },
  ghostBadge: { fontFamily: "Inter_700Bold", fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 },
  ghostSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 3, lineHeight: 18 },
  card: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: "hidden", marginBottom: 20 },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 13, paddingHorizontal: 16 },
  redIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.redDim, alignItems: "center", justifyContent: "center" },
  flagBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.raised, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontFamily: "Inter_500Medium", fontSize: 13.5, color: C.text },
  rowSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  divider: { height: 1, backgroundColor: C.border },
});
