import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Image,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function Auth() {
  const insets = useSafeAreaInsets();
  const { setAuthed } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);

  const submit = async () => {
    if (!email || !pass || (mode === "signup" && !name)) {
      setErr("Please fill in all fields.");
      return;
    }
    if (pass.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    setErr("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const result = await api.signup(email.trim().toLowerCase(), pass, name.trim());
        if (result.session) {
          await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          });
        }
        await new Promise(resolve => setTimeout(resolve, 300));
        setAuthed(true);
        router.replace("/number-assignment");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: pass,
        });
        if (error) throw error;
        await new Promise(resolve => setTimeout(resolve, 300));
        setAuthed(true);
        router.replace("/(tabs)");
      }
    } catch (e: any) {
      const msg = e.message || "Authentication failed";
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setErr("An account with this email already exists. Try logging in.");
      } else if (msg.includes("Invalid login credentials")) {
        setErr("Incorrect email or password.");
      } else {
        setErr(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={[styles.root, { paddingTop: insets.top }]}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.back}
          onPress={() => router.canGoBack() ? router.back() : router.replace("/onboarding")}
          hitSlop={12}
        >
          <Feather name="arrow-left" size={22} color={C.text} />
        </Pressable>

        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Ionicons name="globe" size={28} color={C.onAccent} />
          </View>
          <Text style={styles.logoTxt}>DialGlobal</Text>
          <Text style={styles.logoSub}>Virtual numbers for the world</Text>
        </View>

        <View style={styles.tabs}>
          {(["login", "signup"] as const).map(m => (
            <Pressable
              key={m}
              style={[styles.tab, mode === m && styles.tabOn]}
              onPress={() => { setMode(m); setErr(""); }}
            >
              <Text style={[styles.tabTxt, mode === m && styles.tabTxtOn]}>
                {m === "login" ? "Log In" : "Sign Up"}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.form}>
          {mode === "signup" && (
            <View style={styles.field}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={C.textMuted}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>
          )}
          <View style={styles.field}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={C.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.passWrap}>
              <TextInput
                value={pass}
                onChangeText={setPass}
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />
              <Pressable style={styles.eye} onPress={() => setShowPass(p => !p)} hitSlop={8}>
                <Feather name={showPass ? "eye-off" : "eye"} size={17} color={C.textMuted} />
              </Pressable>
            </View>
          </View>

          {err ? <Text style={styles.err}>{err}</Text> : null}

          <Pressable
            style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.88 : 1 }]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={C.onAccent} />
            ) : (
              <>
                <Text style={styles.btnTxt}>{mode === "login" ? "Log In" : "Create Account"}</Text>
                <Feather name="arrow-right" size={18} color={C.onAccent} />
              </>
            )}
          </Pressable>

          <View style={styles.divRow}>
            <View style={styles.div} />
            <Text style={styles.divTxt}>or</Text>
            <View style={styles.div} />
          </View>

          {["Google", "Apple"].map(s => (
            <Pressable key={s} style={({ pressed }) => [styles.social, { opacity: pressed ? 0.8 : 1 }]}>
              <Image
                source={s === "Google"
                  ? require("@/assets/images/google_icon.png")
                  : require("@/assets/images/apple_icon.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialTxt}>Continue with {s}</Text>
            </Pressable>
          ))}
          <Text style={styles.terms}>By continuing you agree to our Terms & Privacy Policy</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  back: { padding: 16, alignSelf: "flex-start" },
  logo: { alignItems: "center", paddingVertical: 24, gap: 8 },
  logoIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", marginBottom: 4, shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
  logoTxt: { fontFamily: "Inter_700Bold", fontSize: 24, color: C.text, letterSpacing: -0.5 },
  logoSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textMuted },
  tabs: { flexDirection: "row", backgroundColor: C.raised, borderRadius: 14, margin: 20, padding: 4 },
  tab: { flex: 1, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  tabOn: { backgroundColor: C.surface },
  tabTxt: { fontFamily: "Inter_500Medium", fontSize: 13.5, color: C.textMuted },
  tabTxtOn: { color: C.text, fontFamily: "Inter_600SemiBold" },
  form: { paddingHorizontal: 20, gap: 14 },
  field: { gap: 6 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 10.5, color: C.textMuted, letterSpacing: 0.8 },
  input: { height: 50, backgroundColor: C.input, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, fontSize: 15, color: C.text, fontFamily: "Inter_400Regular" },
  passWrap: { flexDirection: "row", alignItems: "center", backgroundColor: C.input, borderRadius: 12, borderWidth: 1.5, borderColor: C.border },
  eye: { padding: 14 },
  err: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.red, backgroundColor: C.redDim, padding: 12, borderRadius: 10 },
  btn: { height: 54, backgroundColor: C.accent, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  btnTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.onAccent },
  divRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  div: { flex: 1, height: 1, backgroundColor: C.border },
  divTxt: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  social: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.raised, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  socialIcon: { width: 22, height: 22, resizeMode: "contain" },
  socialTxt: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.textSec },
  terms: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, textAlign: "center", lineHeight: 18 },
});
