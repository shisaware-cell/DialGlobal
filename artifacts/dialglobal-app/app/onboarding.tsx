import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import C from "@/constants/colors";

const { width: SW } = Dimensions.get("window");

/* ── Slide visuals ── */
function GlobalVisual() {
  const FLAGS = [
    { e: "🇺🇸", top: 18,  left: 20  },
    { e: "🇬🇧", top: 10,  right: 18 },
    { e: "🇯🇵", top: 72,  left: 8   },
    { e: "🇧🇷", top: 64,  right: 10 },
    { e: "🇩🇪", bottom: 16, left: 38 },
    { e: "🇦🇺", bottom: 8,  right: 32 },
  ];
  return (
    <View style={vis.container}>
      <View style={vis.globe}>
        <Text style={vis.globeEmoji}>🌍</Text>
      </View>
      {FLAGS.map((f, i) => (
        <View key={i} style={[vis.chip, f as any]}>
          <Text style={vis.chipEmoji}>{f.e}</Text>
        </View>
      ))}
    </View>
  );
}

function InstantVisual() {
  const ROWS = [
    { flag: "🇺🇸", num: "+1 (415) 823-4921", active: true  },
    { flag: "🇬🇧", num: "+44 7700 123 456",  active: false },
    { flag: "🇦🇺", num: "+61 4 1234 5678",   active: false },
  ];
  return (
    <View style={vis.phoneWrap}>
      <View style={vis.phone}>
        <View style={vis.phoneHeader}>
          <Text style={vis.phoneHeaderTxt}>📱  DialGlobal</Text>
        </View>
        {ROWS.map((r, i) => (
          <View key={i} style={[vis.phoneRow, r.active && vis.phoneRowActive]}>
            <Text style={vis.phoneFlag}>{r.flag}</Text>
            <Text style={[vis.phoneNum, r.active && { color: C.accent }]} numberOfLines={1}>
              {r.num}
            </Text>
            {r.active && <View style={vis.activeDot} />}
          </View>
        ))}
        <View style={vis.phonePulse}>
          <View style={vis.phonePulseDot} />
          <Text style={vis.phonePulseTxt}>3 numbers active</Text>
        </View>
      </View>
      {/* floating badges */}
      <View style={[vis.floatBadge, { top: -8, right: -12, backgroundColor: "#D4F4E8" }]}>
        <Text style={[vis.floatTxt, { color: "#2D9966" }]}>✓ Verified</Text>
      </View>
      <View style={[vis.floatBadge, { bottom: 12, left: -14, backgroundColor: "#FFF3D4" }]}>
        <Text style={[vis.floatTxt, { color: C.accent }]}>⚡ Instant</Text>
      </View>
    </View>
  );
}

function PrivateVisual() {
  const BADGES = [
    { txt: "🔒 Encrypted",  bg: "#D4E8FF", clr: "#2D60C8", top: 8,     left: 12  },
    { txt: "✅ Verified",    bg: "#D4F4E8", clr: "#2D9966", top: 50,    right: 0  },
    { txt: "🚫 No Spam",    bg: "#FFD4D4", clr: "#C83030", bottom: 42, left: 0   },
    { txt: "👁 Private",    bg: "#E8D4FF", clr: "#7830C8", bottom: 4,  right: 8  },
  ];
  return (
    <View style={vis.container}>
      <View style={vis.crownWrap}>
        <Text style={vis.crownBig}>👑</Text>
        <Text style={vis.shieldEmoji}>🛡️</Text>
      </View>
      {BADGES.map((b, i) => (
        <View key={i} style={[vis.chip, b as any, { backgroundColor: b.bg }]}>
          <Text style={[vis.chipEmoji, { color: b.clr, fontSize: 11 }]}>{b.txt}</Text>
        </View>
      ))}
    </View>
  );
}

/* ── Slide data ── */
const SLIDES = [
  {
    key: "global",
    bigWord: "Global.",
    sub: "Real local phone numbers in 100+ countries. Receive calls and texts like a local.",
    bg: "#D4E6FF",
    Visual: GlobalVisual,
  },
  {
    key: "instant",
    bigWord: "Instant.",
    sub: "Get a number in seconds. Manage calls, texts, and voicemail from one clean dashboard.",
    bg: "#D4F0E4",
    Visual: InstantVisual,
  },
  {
    key: "private",
    bigWord: "Private.",
    sub: "Your real number stays hidden. Every call encrypted. Your identity, on your terms.",
    bg: "#EDD4FF",
    Visual: PrivateVisual,
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const sl = SLIDES[idx];

  const goTo = (next: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setIdx(next);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const next = () => {
    if (idx < SLIDES.length - 1) goTo(idx + 1);
    else router.replace("/paywall");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Coloured top area ── */}
      <Animated.View style={[styles.top, { backgroundColor: sl.bg, opacity: fadeAnim }]}>
        {idx < SLIDES.length - 1 && (
          <Pressable style={styles.skip} onPress={() => router.replace("/paywall")}>
            <Text style={styles.skipTxt}>Skip</Text>
          </Pressable>
        )}
        <sl.Visual />
      </Animated.View>

      {/* ── White bottom sheet ── */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>

        {/* Big single-word title */}
        <Animated.Text style={[styles.bigWord, { opacity: fadeAnim }]}>{sl.bigWord}</Animated.Text>
        <Animated.Text style={[styles.sub, { opacity: fadeAnim }]}>{sl.sub}</Animated.Text>

        {/* Pill progress dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => goTo(i)}>
              <View style={[styles.dot, { width: i === idx ? 28 : 8, backgroundColor: i === idx ? C.accent : C.border }]} />
            </Pressable>
          ))}
        </View>

        {/* Pill CTA button */}
        <Pressable
          style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.88 : 1 }]}
          onPress={next}
        >
          <Text style={styles.btnTxt}>
            {idx === SLIDES.length - 1 ? "Start for free →" : "Continue"}
          </Text>
        </Pressable>

        {idx === 0 && (
          <Pressable onPress={() => router.replace("/auth")} hitSlop={10} style={{ marginTop: 8 }}>
            <Text style={styles.logIn}>Already have an account · Log in</Text>
          </Pressable>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  top: { flex: 1, position: "relative", alignItems: "center", justifyContent: "center" },
  skip: { position: "absolute", top: 8, right: 22, padding: 4, zIndex: 10 },
  skipTxt: { fontFamily: "Inter_500Medium", fontSize: 13.5, color: "rgba(0,0,0,0.45)" },

  sheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 28, paddingTop: 28,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 }, elevation: 12,
  },
  bigWord: {
    fontFamily: "Inter_700Bold", fontSize: 40, color: C.text,
    letterSpacing: -1.2, marginBottom: 10,
  },
  sub: {
    fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSec,
    lineHeight: 22, marginBottom: 28,
  },
  dots: { flexDirection: "row", gap: 6, marginBottom: 22, alignItems: "center" },
  dot: { height: 8, borderRadius: 99 },

  btn: {
    height: 56, backgroundColor: C.accent, borderRadius: 99,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.accent, shadowOpacity: 0.38, shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.onAccent },
  logIn: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted, textAlign: "center" },
});

const vis = StyleSheet.create({
  container: { width: 260, height: 220, position: "relative", alignItems: "center", justifyContent: "center" },
  globe: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  globeEmoji: { fontSize: 72 },
  chip: {
    position: "absolute", backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6,
    shadowColor: "#000", shadowOpacity: 0.10, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  chipEmoji: { fontSize: 18, fontFamily: "Inter_600SemiBold" },

  phoneWrap: { position: "relative", alignItems: "center" },
  phone: {
    width: 200, backgroundColor: "#fff", borderRadius: 20, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.14, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 8,
    borderWidth: 1, borderColor: "rgba(0,0,0,0.06)",
  },
  phoneHeader: { backgroundColor: C.accent, paddingVertical: 10, paddingHorizontal: 14 },
  phoneHeaderTxt: { fontFamily: "Inter_700Bold", fontSize: 11, color: C.onAccent, letterSpacing: 0.5 },
  phoneRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 9, gap: 8 },
  phoneRowActive: { backgroundColor: "#FFF8EC", borderLeftWidth: 2.5, borderLeftColor: C.accent },
  phoneFlag: { fontSize: 16 },
  phoneNum: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.textSec, flex: 1 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.green },
  phonePulse: {
    flexDirection: "row", alignItems: "center", gap: 6,
    margin: 8, backgroundColor: "#D4F4E8", borderRadius: 8, paddingVertical: 7, paddingHorizontal: 10,
  },
  phonePulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  phonePulseTxt: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#2D9966" },
  floatBadge: {
    position: "absolute", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  floatTxt: { fontFamily: "Inter_700Bold", fontSize: 11 },

  crownWrap: { alignItems: "center", justifyContent: "center", gap: -8 },
  crownBig: { fontSize: 72 },
  shieldEmoji: { fontSize: 44, marginTop: -12 },
});
