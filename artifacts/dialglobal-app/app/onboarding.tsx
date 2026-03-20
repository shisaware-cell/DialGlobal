import React, { useState } from "react";
import {
  View, Text, StyleSheet, Pressable, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";

/* ── Slide visuals ── */
function GlobeVisual() {
  const flags = [
    { flag: "🇺🇸", top: 5,  left: -5 },
    { flag: "🇬🇧", top: 0,  right: 0 },
    { flag: "🇯🇵", bottom: 40, left: 5 },
    { flag: "🇦🇺", bottom: 10, right: 10 },
  ];
  return (
    <View style={{ width: 250, height: 220, alignSelf: "center", position: "relative", alignItems: "center", justifyContent: "center" }}>
      {/* Globe ring */}
      <View style={vis.globe}>
        {[30, 50, 70].map((top, i) => (
          <View key={`h${i}`} style={[vis.gridLine, { top: `${top}%` as any, left: "10%", right: "10%", height: 1 }]} />
        ))}
        {[35, 55, 75].map((left, i) => (
          <View key={`v${i}`} style={[vis.gridLine, { left: `${left}%` as any, top: "10%", bottom: "10%", width: 1 }]} />
        ))}
      </View>
      {/* Flag chips */}
      {flags.map((f, i) => (
        <View key={i} style={[vis.flagChip, f as any]}>
          <Text style={{ fontSize: 18 }}>{f.flag}</Text>
        </View>
      ))}
    </View>
  );
}

function DashboardVisual() {
  const rows = [
    { n: "🇺🇸  +1 (415) 823-4921", active: true },
    { n: "🇬🇧  +44 7700 123 456",  active: false },
    { n: "🇦🇺  +61 4 1234 5678",   active: false },
  ];
  return (
    <View style={vis.dashCard}>
      <View style={vis.dashHeader}>
        <Text style={vis.dashHeaderTxt}>DIALGLOBAL</Text>
      </View>
      {rows.map((row, i) => (
        <View key={i} style={[vis.dashRow, row.active && vis.dashRowActive]}>
          <Text style={[vis.dashRowTxt, row.active && { color: C.accent }]}>{row.n}</Text>
        </View>
      ))}
      <View style={vis.dashStatus}>
        <View style={vis.dashPulse} />
        <Text style={vis.dashStatusTxt}>3 active numbers</Text>
      </View>
    </View>
  );
}

function PrivacyVisual() {
  const badges = [
    { txt: "🔒 Encrypted", color: C.accent,   top: 20,     left: 5 },
    { txt: "✓ Verified",   color: C.green,    top: 60,     right: 0 },
    { txt: "🚫 No spam",   color: C.red,      bottom: 36,  left: 10 },
    { txt: "👁 Private",   color: C.blue,     bottom: 10,  right: 10 },
  ];
  return (
    <View style={{ width: 220, height: 200, alignSelf: "center", position: "relative", alignItems: "center", justifyContent: "center" }}>
      <View style={vis.lockCircle}>
        <Feather name="lock" size={48} color={C.blue} strokeWidth={1.3} />
      </View>
      {badges.map((b, i) => (
        <View key={i} style={[vis.badge, b as any]}>
          <Text style={[vis.badgeTxt, { color: b.color }]}>{b.txt}</Text>
        </View>
      ))}
    </View>
  );
}

const SLIDES = [
  {
    key: "1",
    tag: "100+ COUNTRIES",
    title: "Your number,\nanywhere.",
    sub: "Real local phone numbers in over 100 countries. Receive calls and texts like a local.",
    bgColor: "#FDE9C0",
    Visual: GlobeVisual,
  },
  {
    key: "2",
    tag: "ALL IN ONE PLACE",
    title: "One app.\nEvery number.",
    sub: "Manage virtual numbers, calls, and messages in a single clean dashboard.",
    bgColor: "#C8EDD8",
    Visual: DashboardVisual,
  },
  {
    key: "3",
    tag: "PRIVACY FIRST",
    title: "Private,\nsecure, yours.",
    sub: "Your real number stays hidden. Every call encrypted. Identity verified on your terms.",
    bgColor: "#DDEAFC",
    Visual: PrivacyVisual,
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const sl = SLIDES[idx];

  const next = () => {
    if (idx < SLIDES.length - 1) setIdx(i => i + 1);
    else router.replace("/auth");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Gradient-like top with visual */}
      <View style={[styles.topArea, { backgroundColor: sl.bgColor }]}>
        {/* Skip */}
        {idx < SLIDES.length - 1 && (
          <Pressable style={styles.skipBtn} onPress={() => router.replace("/auth")}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        )}
        {/* Visual */}
        <View style={styles.visualWrap}>
          <sl.Visual />
        </View>
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 20 }]}>
        {/* Tag */}
        <View style={styles.tag}><Text style={styles.tagTxt}>{sl.tag}</Text></View>

        {/* Text */}
        <Text style={styles.title}>{sl.title}</Text>
        <Text style={styles.sub}>{sl.sub}</Text>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, {
              backgroundColor: i === idx ? C.accent : C.hover,
              width: i === idx ? 24 : 7,
            }]} />
          ))}
        </View>

        {/* CTA */}
        <Pressable style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.88 : 1 }]} onPress={next}>
          <Text style={styles.btnTxt}>
            {idx === SLIDES.length - 1 ? "Get Started — It's Free →" : "Continue →"}
          </Text>
        </Pressable>

        {idx === 0 && (
          <Pressable onPress={() => router.replace("/auth")} hitSlop={10}>
            <Text style={styles.logIn}>Already have an account · Log in</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  topArea: { flex: 1, position: "relative" },
  skipBtn: { position: "absolute", top: 0, right: 22, zIndex: 10, padding: 4 },
  skip: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textMuted },
  visualWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  bottomCard: { backgroundColor: C.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderTopColor: C.border, padding: 26 },
  tag: { alignSelf: "flex-start", backgroundColor: C.accentDim, borderRadius: 99, paddingHorizontal: 11, paddingVertical: 4, marginBottom: 14 },
  tagTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5, color: C.accent, letterSpacing: 1.6 },
  title: { fontFamily: "Inter_700Bold", fontSize: 30, color: C.text, lineHeight: 36, letterSpacing: -0.6, marginBottom: 10 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textSec, lineHeight: 22, marginBottom: 28 },
  dots: { flexDirection: "row", gap: 5, marginBottom: 20, alignItems: "center" },
  dot: { height: 3, borderRadius: 99 },
  btn: { height: 54, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },
  logIn: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 4 },
});

/* ── Visual sub-styles ── */
const vis = StyleSheet.create({
  globe: { width: 160, height: 160, borderRadius: 80, borderWidth: 1.5, borderColor: "rgba(232,160,32,0.3)", backgroundColor: "rgba(232,160,32,0.06)", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  gridLine: { position: "absolute", backgroundColor: "rgba(232,160,32,0.2)" },
  flagChip: { position: "absolute", backgroundColor: C.raised, borderWidth: 1, borderColor: C.borderStrong, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },

  dashCard: { width: 200, alignSelf: "center", backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.borderStrong, overflow: "hidden" },
  dashHeader: { height: 30, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  dashHeaderTxt: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 2, color: C.onAccent },
  dashRow: { margin: 6, marginBottom: 0, padding: 9, paddingHorizontal: 10, backgroundColor: C.raised, borderRadius: 9 },
  dashRowActive: { backgroundColor: C.accentDim, borderLeftWidth: 2.5, borderLeftColor: C.accent },
  dashRowTxt: { fontFamily: "Inter_600SemiBold", fontSize: 9, color: C.textSec },
  dashStatus: { margin: 8, marginTop: 6, padding: 7, paddingHorizontal: 10, backgroundColor: C.greenDim, borderRadius: 9, flexDirection: "row", alignItems: "center", gap: 5 },
  dashPulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  dashStatusTxt: { fontFamily: "Inter_700Bold", fontSize: 8.5, color: C.green },

  lockCircle: { width: 130, height: 130, borderRadius: 65, backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.borderStrong, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", backgroundColor: C.raised, borderWidth: 1, borderColor: C.borderStrong, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  badgeTxt: { fontFamily: "Inter_700Bold", fontSize: 9.5 },
});
