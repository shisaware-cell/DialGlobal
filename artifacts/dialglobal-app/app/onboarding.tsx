import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, Dimensions, Pressable, FlatList, Animated,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import C from "@/constants/colors";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    key: "1",
    icon: "globe-outline" as const,
    title: "Your number,\nanywhere.",
    sub: "Real local phone numbers in over 100 countries. Receive calls and texts like a local — from anywhere.",
    iconColor: C.accent,
    bg: "rgba(232,160,32,0.08)",
  },
  {
    key: "2",
    icon: "albums-outline" as const,
    title: "One app.\nEvery number.",
    sub: "Manage virtual numbers, calls, and messages in a single clean dashboard. No switching apps.",
    iconColor: C.green,
    bg: "rgba(34,197,94,0.08)",
  },
  {
    key: "3",
    icon: "shield-checkmark-outline" as const,
    title: "Private,\nsecure, yours.",
    sub: "Your real number stays hidden. Every call is encrypted. Identity verified on your terms.",
    iconColor: C.blue,
    bg: "rgba(59,130,246,0.08)",
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const ref = useRef<FlatList>(null);

  const next = () => {
    if (idx < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: idx + 1, animated: true });
    } else {
      router.replace("/auth");
    }
  };

  const sl = SLIDES[idx];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.skipRow}>
        <Pressable onPress={() => router.replace("/auth")} hitSlop={12}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={ref}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => i.key}
        style={{ flex: 1 }}
        onMomentumScrollEnd={e => setIdx(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon} size={56} color={item.iconColor} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{item.sub}</Text>
          </View>
        )}
      />

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === idx ? C.accent : C.border, width: i === idx ? 22 : 7 }]} />
          ))}
        </View>
        <Pressable style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.88 : 1 }]} onPress={next}>
          <Text style={styles.btnTxt}>{idx === SLIDES.length - 1 ? "Get Started" : "Continue"}</Text>
          <Feather name="arrow-right" size={18} color={C.onAccent} />
        </Pressable>
        {idx === 0 && (
          <Pressable onPress={() => router.replace("/auth")} hitSlop={10}>
            <Text style={styles.logIn}>Already have an account  ·  Log in</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  skipRow: { flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 24, paddingVertical: 12 },
  skip: { color: C.textMuted, fontFamily: "Inter_500Medium", fontSize: 14 },
  slide: { alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 24, flex: 1, minHeight: 400 },
  iconWrap: { width: 110, height: 110, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  title: { fontFamily: "Inter_700Bold", fontSize: 38, color: C.text, textAlign: "center", lineHeight: 46, letterSpacing: -1.2 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 16, color: C.textSec, textAlign: "center", lineHeight: 26 },
  bottom: { padding: 24, gap: 16 },
  dots: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 8 },
  dot: { height: 7, borderRadius: 99 },
  btn: {
    height: 56, backgroundColor: C.accent, borderRadius: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.onAccent },
  logIn: { fontFamily: "Inter_400Regular", fontSize: 13.5, color: C.textMuted, textAlign: "center" },
});
