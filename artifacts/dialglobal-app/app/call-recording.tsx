import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function CallRecording() {
  const insets = useSafeAreaInsets();
  const { numbers } = useApp();
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const [perNumber, setPerNumber] = useState<Record<string, boolean>>({});
  const [announceEnabled, setAnnounceEnabled] = useState(true);
  const [storeDays, setStoreDays] = useState<7 | 30 | 90>(30);

  const toggleNumber = (id: string, val: boolean) => {
    setPerNumber(prev => ({ ...prev, [id]: val }));
  };

  const handleGlobalToggle = (val: boolean) => {
    if (val) {
      Alert.alert(
        "Enable Call Recording",
        "By enabling call recording you confirm you have obtained consent from all parties as required by your local laws.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Enable", onPress: () => setGlobalEnabled(true) },
        ]
      );
    } else {
      setGlobalEnabled(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={C.textSec} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Call Recording</Text>
          <Text style={styles.headerSub}>Record inbound & outbound calls</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}>

        {/* Global toggle */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: C.accentDim }]}>
              <Feather name="mic" size={16} color={C.accent} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.rowLabel}>Enable Call Recording</Text>
              <Text style={styles.rowSub}>Record all calls on your numbers</Text>
            </View>
            <Switch
              value={globalEnabled}
              onValueChange={handleGlobalToggle}
              trackColor={{ false: C.raised, true: C.accent }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Legal notice */}
        <View style={styles.legalBox}>
          <Feather name="alert-circle" size={14} color={C.accent} />
          <Text style={styles.legalTxt}>
            Call recording laws vary by location. Some regions require all parties to consent. You are responsible for compliance with local laws.
          </Text>
        </View>

        {globalEnabled && (
          <>
            {/* Announcement */}
            <Text style={styles.sectionLabel}>RECORDING OPTIONS</Text>
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: C.blueDim }]}>
                  <Feather name="volume-2" size={16} color={C.blue} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.rowLabel}>Announce Recording</Text>
                  <Text style={styles.rowSub}>Play "this call is being recorded" message</Text>
                </View>
                <Switch
                  value={announceEnabled}
                  onValueChange={setAnnounceEnabled}
                  trackColor={{ false: C.raised, true: C.accent }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            {/* Storage duration */}
            <Text style={styles.sectionLabel}>STORAGE DURATION</Text>
            <View style={styles.card}>
              {([7, 30, 90] as const).map((days, i) => (
                <React.Fragment key={days}>
                  {i > 0 && <View style={styles.divider} />}
                  <Pressable style={styles.cardRow} onPress={() => setStoreDays(days)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowLabel}>{days} days</Text>
                      <Text style={styles.rowSub}>{days === 7 ? "Short-term" : days === 30 ? "Standard" : "Long-term archive"}</Text>
                    </View>
                    <View style={storeDays === days ? styles.radioOn : styles.radioOff}>
                      {storeDays === days && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                </React.Fragment>
              ))}
            </View>

            {/* Per-number */}
            {numbers.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>PER-NUMBER SETTINGS</Text>
                <View style={styles.card}>
                  {numbers.map((num, i) => (
                    <React.Fragment key={num.phone_number}>
                      {i > 0 && <View style={styles.divider} />}
                      <View style={styles.cardRow}>
                        <Text style={{ fontSize: 22, marginRight: 4 }}>{num.flag}</Text>
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={styles.rowLabel}>{num.phone_number}</Text>
                          <Text style={styles.rowSub}>{num.country}</Text>
                        </View>
                        <Switch
                          value={perNumber[num.phone_number] ?? true}
                          onValueChange={v => toggleNumber(num.phone_number, v)}
                          trackColor={{ false: C.raised, true: C.accent }}
                          thumbColor="#fff"
                        />
                      </View>
                    </React.Fragment>
                  ))}
                </View>
              </>
            )}

            <Pressable
              style={styles.saveBtn}
              onPress={() => {
                Alert.alert("Saved", "Call recording settings have been saved.", [{ text: "OK", onPress: () => router.back() }]);
              }}
            >
              <Text style={styles.saveBtnTxt}>Save Settings</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", marginTop: 2 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, letterSpacing: -0.5 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 2 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: C.textMuted, letterSpacing: 1.4, marginBottom: 8, marginTop: 16, paddingLeft: 4 },
  card: { backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  cardRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  iconBox: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.text },
  rowSub: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },
  legalBox: { flexDirection: "row", gap: 10, alignItems: "flex-start", backgroundColor: C.accentDim, borderRadius: 12, padding: 12, marginTop: 12 },
  legalTxt: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSec, lineHeight: 18 },
  radioOn: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.accent, alignItems: "center", justifyContent: "center" },
  radioOff: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: C.accent },
  saveBtn: { marginTop: 24, height: 52, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  saveBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 15.5, color: C.onAccent },
});
