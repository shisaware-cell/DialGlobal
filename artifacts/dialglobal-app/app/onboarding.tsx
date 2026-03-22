import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import C from "@/constants/colors";
import { CharGlobeHolder, CharMidCall, CharTraveller, CharCelebrating } from "@/components/Characters";

const { width: SW } = Dimensions.get("window");
const IS_SMALL = SW <= 390;
const SIDE_BADGE_W = IS_SMALL ? 92 : 108;

/* ── Slide 1 — GLOBAL  ─────────────────────────────────────────────────── */
const FLAG_EMOJIS = ["🇺🇸","🇬🇧","🇯🇵","🇩🇪","🇫🇷","🇦🇺","🇧🇷","🇮🇳","🇨🇦","🇿🇦"];
const BOX = Math.min(SW - 24, 332);
const C_XY = BOX / 2;
const ORBIT_R = BOX / 2 - 24;
const FLAGS_RING = FLAG_EMOJIS.map((flag, i) => {
  const angle = (i / FLAG_EMOJIS.length) * 2 * Math.PI - Math.PI / 2;
  return { flag, left: C_XY + ORBIT_R * Math.cos(angle) - 18, top: C_XY + ORBIT_R * Math.sin(angle) - 17 };
});

function GlobalVisual() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: BOX, height: BOX, alignItems: "center", justifyContent: "center" }}>
        {/* Dashed orbit ring */}
        <View style={[gv.ring, { width: ORBIT_R * 2 + 36, height: ORBIT_R * 2 + 36, borderRadius: ORBIT_R + 18 }]} />
        {/* Character */}
        <CharGlobeHolder size={170} />
        {/* Flags in tight circular orbit */}
        {FLAGS_RING.map((f, i) => (
          <View key={i} style={[gv.chip, { position: "absolute", left: f.left, top: f.top }]}>
            <Text style={gv.chipEmoji}>{f.flag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ── Slide 2 — LANDLINE  ───────────────────────────────────────────────── */
const LL_LEFT = [
  { icon: "📞", label: "HD Voice",      bg: "#D4E8FF", clr: "#2D60C8" },
  { icon: "🏢", label: "Fixed Address", bg: "#FFF0D4", clr: "#A06010" },
  { icon: "📠", label: "Fax Ready",     bg: "#F4D4FF", clr: "#7030B0" },
];
const LL_RIGHT = [
  { icon: "⭐", label: "Trusted",  bg: "#D4F4E8", clr: "#2D9966" },
  { icon: "🆘", label: "E911",     bg: "#FFD4D4", clr: "#C83030" },
  { icon: "💼", label: "Business", bg: "#D4E8FF", clr: "#2D60C8" },
];

function LandlineVisual() {
  return (
    <View style={{ flex: 1, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 12, gap: IS_SMALL ? 8 : 12 }}>
      <View style={{ gap: IS_SMALL ? 10 : 14, alignItems: "flex-end", width: SIDE_BADGE_W }}>
        {LL_LEFT.map(b => (
          <View key={b.label} style={[pv.badge, { backgroundColor: b.bg, width: SIDE_BADGE_W }]}> 
            <View style={pv.badgeRow}>
              <Text style={pv.badgeIcon}>{b.icon}</Text>
              <Text style={[pv.badgeTxt, { color: b.clr }]} numberOfLines={1}>{b.label}</Text>
            </View>
          </View>
        ))}
      </View>
      <CharCelebrating size={IS_SMALL ? 140 : 158} />
      <View style={{ gap: IS_SMALL ? 10 : 14, alignItems: "flex-start", width: SIDE_BADGE_W }}>
        {LL_RIGHT.map(b => (
          <View key={b.label} style={[pv.badge, { backgroundColor: b.bg, width: SIDE_BADGE_W }]}> 
            <View style={pv.badgeRow}>
              <Text style={pv.badgeIcon}>{b.icon}</Text>
              <Text style={[pv.badgeTxt, { color: b.clr }]} numberOfLines={1}>{b.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ── Slide 3 — INSTANT  ────────────────────────────────────────────────── */
const PHONE_ROWS = [
  { flag: "🇺🇸", num: "+1 (415) 823-4921", active: true  },
  { flag: "🇬🇧", num: "+44 7700 123 456",  active: false },
  { flag: "🇦🇺", num: "+61 4 1234 5678",   active: false },
];

function InstantVisual() {
  return (
    <View style={{ flex: 1, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 12, gap: 8 }}>
      {/* Character on the left */}
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <CharMidCall size={196} />
      </View>
      {/* Phone mockup on the right */}
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <View style={iv.card}>
          <View style={iv.cardHeader}>
            <Text style={iv.cardTitle}>📱  DialGlobal</Text>
          </View>
          {PHONE_ROWS.map((r, i) => (
            <View key={i} style={[iv.row, r.active && iv.rowActive]}>
              <Text style={iv.flag}>{r.flag}</Text>
              <Text style={[iv.num, r.active && { color: C.accent }]} numberOfLines={1}>
                {r.num}
              </Text>
              {r.active && <View style={iv.dot} />}
            </View>
          ))}
          <View style={iv.statusBar}>
            <View style={iv.statusDot} />
            <Text style={iv.statusTxt}>3 numbers active</Text>
          </View>
        </View>
        {/* Floating badges */}
        <View style={[iv.badge, { top: -10, right: 0, backgroundColor: "#D4F4E8" }]}>
          <Text style={[iv.badgeTxt, { color: "#2D9966" }]}>✓ Instant</Text>
        </View>
        <View style={[iv.badge, { bottom: 20, left: -8, backgroundColor: "#FFF3D4" }]}>
          <Text style={[iv.badgeTxt, { color: C.accent }]}>⚡ Real SMS</Text>
        </View>
      </View>
    </View>
  );
}

/* ── Slide 3 — PRIVATE  ────────────────────────────────────────────────── */
const LEFT_BADGES  = [
  { icon: "🔒", label: "Encrypted", bg: "#D4E8FF", clr: "#2D60C8" },
  { icon: "🚫", label: "No Spam",   bg: "#FFD4D4", clr: "#C83030" },
  { icon: "🛡", label: "Secure",    bg: "#FFF3D4", clr: "#C88020" },
];
const RIGHT_BADGES = [
  { icon: "✅", label: "Verified", bg: "#D4F4E8", clr: "#2D9966" },
  { icon: "👁", label: "Private",  bg: "#E8D4FF", clr: "#7830C8" },
  { icon: "🌍", label: "Global",   bg: "#D4F0E4", clr: "#1A7A50" },
];

function PrivateVisual() {
  return (
    <View style={{ flex: 1, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 12, gap: IS_SMALL ? 8 : 12 }}>
      {/* Left column */}
      <View style={{ gap: IS_SMALL ? 10 : 14, alignItems: "flex-end", width: SIDE_BADGE_W }}>
        {LEFT_BADGES.map(b => (
          <View key={b.label} style={[pv.badge, { backgroundColor: b.bg, width: SIDE_BADGE_W }]}> 
            <View style={pv.badgeRow}>
              <Text style={pv.badgeIcon}>{b.icon}</Text>
              <Text style={[pv.badgeTxt, { color: b.clr }]} numberOfLines={1}>{b.label}</Text>
            </View>
          </View>
        ))}
      </View>
      {/* Character centred */}
      <CharTraveller size={IS_SMALL ? 162 : 182} />
      {/* Right column */}
      <View style={{ gap: IS_SMALL ? 10 : 14, alignItems: "flex-start", width: SIDE_BADGE_W }}>
        {RIGHT_BADGES.map(b => (
          <View key={b.label} style={[pv.badge, { backgroundColor: b.bg, width: SIDE_BADGE_W }]}> 
            <View style={pv.badgeRow}>
              <Text style={pv.badgeIcon}>{b.icon}</Text>
              <Text style={[pv.badgeTxt, { color: b.clr }]} numberOfLines={1}>{b.label}</Text>
            </View>
          </View>
        ))}
      </View>
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
    key: "landline",
    bigWord: "Landline.",
    sub: "A real business phone number with HD voice, fax, and E911. Your office, anywhere.",
    bg: "#FFF4D4",
    Visual: LandlineVisual,
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

        <Animated.Text style={[styles.bigWord, { opacity: fadeAnim }]}>{sl.bigWord}</Animated.Text>
        <Animated.Text style={[styles.sub, { opacity: fadeAnim }]}>{sl.sub}</Animated.Text>

        {/* Progress dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => goTo(i)}>
              <View style={[styles.dot, { width: i === idx ? 28 : 8, backgroundColor: i === idx ? C.accent : C.border }]} />
            </Pressable>
          ))}
        </View>

        {/* CTA */}
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
  dot:  { height: 8, borderRadius: 99 },
  btn: {
    height: 56, backgroundColor: C.accent, borderRadius: 99,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.accent, shadowOpacity: 0.38, shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.onAccent },
  logIn: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted, textAlign: "center" },
});

/* Global visual styles */
const gv = StyleSheet.create({
  ring: {
    position: "absolute",
    borderWidth: 1.5, borderColor: "rgba(37,99,235,0.35)",
    borderStyle: "dashed",
  },
  chip: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 22, paddingHorizontal: 8, paddingVertical: 5,
    shadowColor: "#000", shadowOpacity: 0.10, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  chipEmoji: { fontSize: 20 },
});

/* Instant visual styles */
const iv = StyleSheet.create({
  card: {
    backgroundColor: "#fff", borderRadius: 18, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.14, shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
    borderWidth: 1, borderColor: "rgba(0,0,0,0.06)",
    width: 168, position: "relative",
  },
  cardHeader: { backgroundColor: C.accent, paddingVertical: 10, paddingHorizontal: 14 },
  cardTitle:  { fontFamily: "Inter_700Bold", fontSize: 11, color: C.onAccent, letterSpacing: 0.4 },
  row:        { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 9, gap: 7 },
  rowActive:  { backgroundColor: "#FFF8EC", borderLeftWidth: 2.5, borderLeftColor: C.accent },
  flag:       { fontSize: 15 },
  num:        { fontFamily: "Inter_500Medium", fontSize: 10, color: C.textSec, flex: 1 },
  dot:        { width: 7, height: 7, borderRadius: 4, backgroundColor: C.green },
  statusBar:  {
    flexDirection: "row", alignItems: "center", gap: 6,
    margin: 8, backgroundColor: "#D4F4E8", borderRadius: 8,
    paddingVertical: 7, paddingHorizontal: 10,
  },
  statusDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  statusTxt:  { fontFamily: "Inter_700Bold", fontSize: 9, color: "#2D9966" },
  badge: {
    position: "absolute", borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5,
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  badgeTxt: { fontFamily: "Inter_700Bold", fontSize: 10.5 },
});

/* Private visual styles */
const pv = StyleSheet.create({
  shield: {
    position: "absolute",
    backgroundColor: "rgba(124,58,237,0.08)",
    borderWidth: 1.5, borderColor: "rgba(124,58,237,0.2)",
  },
  badge: {
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 6,
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  badgeIcon: { fontSize: 12 },
  badgeTxt: { fontFamily: "Inter_700Bold", fontSize: 10.5, flexShrink: 1 },
});
