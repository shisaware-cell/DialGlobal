import {
  Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";
import C from "@/constants/colors";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

function IncomingCallOverlay() {
  const { incomingCall, dismissIncomingCall, showToast } = useApp();
  if (!incomingCall) return null;

  const handleAccept = () => {
    dismissIncomingCall();
    showToast("Call connected", "success");
  };

  const handleDecline = () => {
    dismissIncomingCall();
    showToast("Call declined", "info");
  };

  return (
    <View style={ov.root}>
      <View style={ov.content}>
        <Text style={ov.label}>INCOMING CALL</Text>
        <View style={ov.avatarWrap}>
          <Text style={ov.avatarTxt}>{incomingCall.caller[0]}</Text>
        </View>
        <Text style={ov.caller}>{incomingCall.caller}</Text>
        <Text style={ov.number}>{incomingCall.number}</Text>
      </View>
      <View style={ov.actions}>
        <Pressable style={ov.declineBtn} onPress={handleDecline}>
          <Text style={ov.declineIc}>✕</Text>
        </Pressable>
        <Pressable style={ov.acceptBtn} onPress={handleAccept}>
          <Text style={ov.acceptIc}>📞</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ToastNotification() {
  const { toast, dismissToast } = useApp();
  if (!toast) return null;

  const colorMap: Record<string, string> = {
    info: C.blue, success: C.green, warning: C.accent, error: C.red,
  };
  const dotColor = colorMap[toast.type] ?? C.blue;

  return (
    <Pressable style={[ts.root]} onPress={dismissToast}>
      <View style={[ts.dot, { backgroundColor: dotColor }]} />
      <Text style={ts.msg} numberOfLines={2}>{toast.message}</Text>
      <Text style={ts.dismiss}>tap to dismiss</Text>
    </Pressable>
  );
}

function AppOverlays({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <ToastNotification />
      <IncomingCallOverlay />
    </View>
  );
}

function RootLayoutNav() {
  return (
    <AppOverlays>
      <Stack screenOptions={{ headerShown: false, animation: "ios_from_right", contentStyle: { backgroundColor: "#FAFAF9" } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="paywall" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
        <Stack.Screen name="picker" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
        <Stack.Screen name="profile" />
        <Stack.Screen name="number/[id]" />
        <Stack.Screen name="esim" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
        <Stack.Screen name="autoreply" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
        <Stack.Screen name="spamblocker" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
        <Stack.Screen name="contacts" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
        <Stack.Screen name="credits" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
        <Stack.Screen name="number-assignment" options={{ animation: "fade" }} />
        <Stack.Screen name="expired-paywall" options={{ animation: "fade", gestureEnabled: false }} />
      </Stack>
    </AppOverlays>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AppProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const ov = StyleSheet.create({
  root: {
    position: "absolute", inset: 0, zIndex: 200,
    backgroundColor: "#1A1A2E",
    alignItems: "center", justifyContent: "space-between",
    paddingTop: 80, paddingBottom: 60, paddingHorizontal: 32,
  } as any,
  content: { alignItems: "center", gap: 12 },
  label: {
    fontSize: 13, fontFamily: "Inter_700Bold", color: "rgba(255,255,255,0.5)",
    letterSpacing: 2, marginBottom: 8,
  },
  avatarWrap: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: C.accent,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 34, color: "#fff" },
  caller: { fontFamily: "Inter_700Bold", fontSize: 22, color: "#fff", letterSpacing: -0.3 },
  number: { fontFamily: "Inter_400Regular", fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 },
  actions: { flexDirection: "row", gap: 48, alignItems: "center" },
  declineBtn: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: C.red,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.red, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 10,
  },
  declineIc: { fontSize: 24, color: "#fff" },
  acceptBtn: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: C.green,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.green, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 10,
  },
  acceptIc: { fontSize: 24 },
});

const ts = StyleSheet.create({
  root: {
    position: "absolute", top: 52, left: 14, right: 14, zIndex: 150,
    backgroundColor: C.text, borderRadius: 16, padding: 14,
    flexDirection: "row", alignItems: "center", gap: 10,
    shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
    elevation: 20,
  },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  msg: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#fff", flex: 1 },
  dismiss: { fontFamily: "Inter_400Regular", fontSize: 10, color: "rgba(255,255,255,0.4)", flexShrink: 0 },
});
