import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, Pressable, Platform,
  ScrollView, Modal, FlatList,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { CharBored } from "@/components/Characters";

const KEYS = [
  { d: "1",   s: ""     },
  { d: "2",   s: "ABC"  },
  { d: "3",   s: "DEF"  },
  { d: "4",   s: "GHI"  },
  { d: "5",   s: "JKL"  },
  { d: "6",   s: "MNO"  },
  { d: "7",   s: "PQRS" },
  { d: "8",   s: "TUV"  },
  { d: "9",   s: "WXYZ" },
  { d: "*",   s: ""     },
  { d: "0",   s: "+"    },
  { d: "#",   s: ""     },
];

type CallState = "idle" | "calling" | "connected" | "ended";

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Dialer() {
  const insets = useSafeAreaInsets();
  const {
    numbers, showToast, refreshCalls,
    isAuthed, isInTrial, trialMinsUsed, trialSmsUsed,
    startCall, hangupCall, muteCall, activeCall, telnyxReady,
  } = useApp();
  const isWeb = Platform.OS === "web";
  const TRIAL_MIN_LIMIT = 15;

  const [digits, setDigits] = useState("");
  const [fromIdx, setFromIdx] = useState(0);
  const [callState, setCallState] = useState<CallState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [trialLimitModal, setTrialLimitModal] = useState<null | "minutes" | "sms">(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fromNumber = numbers[fromIdx] ?? null;

  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  useEffect(() => {
    if (!activeCall) {
      return;
    }

    const state = String(activeCall.state || "").toLowerCase();
    if (activeCall.number) setDigits(activeCall.number);

    if (["calling", "ringing", "new", "trying"].includes(state)) {
      setCallState("calling");
      return;
    }
    if (["connected", "active", "answered"].includes(state)) {
      setCallState("connected");
      return;
    }
    if (["hangup", "destroy", "ended", "done", "disconnected"].includes(state)) {
      setCallState("ended");
      return;
    }
  }, [activeCall]);

  const press = (d: string) => {
    if (callState !== "idle" && callState !== "ended") return;
    setDigits(prev => (prev + d).slice(0, 18));
  };

  const backspace = () => setDigits(prev => prev.slice(0, -1));

  const formatDisplay = (raw: string) => {
    if (!raw) return "";
    const clean = raw.replace(/\D/g, "");
    if (clean.length <= 3) return raw;
    if (clean.length <= 6) return `(${clean.slice(0,3)}) ${clean.slice(3)}`;
    if (clean.length <= 10) return `(${clean.slice(0,3)}) ${clean.slice(3,6)}-${clean.slice(6)}`;
    return `+${clean.slice(0,1)} (${clean.slice(1,4)}) ${clean.slice(4,7)}-${clean.slice(7,11)}`;
  };

  const handleCall = async () => {
    if (!isAuthed) {
      router.push("/paywall");
      return;
    }
    if (!digits || digits.length < 7) {
      showToast("Enter a valid phone number", "warning");
      return;
    }
    if (!fromNumber) {
      showToast("You need a virtual number to make calls", "warning");
      return;
    }
    if (isInTrial && trialMinsUsed >= TRIAL_MIN_LIMIT) {
      setTrialLimitModal("minutes");
      return;
    }

    setCallState("calling");
    const toNumber = digits.startsWith("+") ? digits : `+${digits.replace(/\D/g, "")}`;

    try {
      await startCall(toNumber);
      setCallState("connected");
      refreshCalls();
    } catch (err: any) {
      showToast(err.message || "Call failed", "error");
      setCallState("idle");
    }
  };

  const hangUp = async () => {
    await hangupCall();
    if (timerRef.current) clearInterval(timerRef.current);
    setCallState("ended");
    refreshCalls();
    setTimeout(() => {
      setCallState("idle");
      setElapsed(0);
      setMuted(false);
      setSpeaker(false);
      setShowKeypad(false);
    }, 1800);
  };

  const isInCall = callState === "connected" || callState === "calling";
  const paddingTop = insets.top + (isWeb ? 67 : 0) + 8;

  return (
    <View style={[s.root, { paddingTop }]}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={s.backBtn}>
          <Feather name="x" size={20} color={C.text} />
        </Pressable>
        <Text style={s.headerTitle}>New Call</Text>
        <Pressable hitSlop={12} style={s.backBtn}>
          <Feather name="book" size={19} color={C.textSec} />
        </Pressable>
      </View>

      {/* From number selector */}
      {numbers.length > 0 && (
        <Pressable style={s.fromRow} onPress={() => numbers.length > 1 && setShowFromPicker(true)}>
          <View style={s.fromLeft}>
            <Text style={s.fromLabel}>Calling from</Text>
            <View style={s.fromInfo}>
              <Text style={{ fontSize: 14 }}>{fromNumber?.flag ?? "📞"}</Text>
              <Text style={s.fromNum}>{fromNumber?.phone_number ?? "No number"}</Text>
            </View>
          </View>
          {numbers.length > 1 && (
            <Feather name="chevron-down" size={16} color={C.textMuted} />
          )}
        </Pressable>
      )}

      {numbers.length === 0 && (
        <View style={s.noNumBanner}>
          <Feather name="info" size={15} color={C.accent} />
          <Text style={s.noNumTxt}>Add a virtual number to make calls</Text>
          <Pressable onPress={() => router.push("/picker")} style={s.noNumBtn}>
            <Text style={s.noNumBtnTxt}>Add Number</Text>
          </Pressable>
        </View>
      )}

      {!telnyxReady && numbers.length > 0 && (
        <View style={s.noNumBanner}>
          <Feather name="loader" size={15} color={C.accent} />
          <Text style={s.noNumTxt}>Connecting secure voice service…</Text>
        </View>
      )}

      {/* Display */}
      <View style={s.display}>
        {callState === "idle" || callState === "ended" ? (
          <>
            <Text style={[s.digitsText, !digits && { color: C.textMuted }]} numberOfLines={1} adjustsFontSizeToFit>
              {digits ? formatDisplay(digits) : "Enter number"}
            </Text>
            {callState === "ended" && (
              <View style={s.endedPill}>
                <Text style={s.endedTxt}>Call ended · {fmtTime(elapsed)}</Text>
              </View>
            )}
          </>
        ) : (
          <View style={s.inCallDisplay}>
            <View style={[s.callAvatar, { backgroundColor: callState === "connected" ? C.greenDim : C.accentDim }]}>
              <Feather
                name={callState === "connected" ? "phone-call" : "phone"}
                size={32}
                color={callState === "connected" ? C.green : C.accent}
              />
            </View>
            <Text style={s.inCallNum}>{formatDisplay(digits)}</Text>
            <Text style={[s.callStatus, { color: callState === "connected" ? C.green : C.accent }]}>
              {callState === "calling" ? "Connecting…" : fmtTime(elapsed)}
            </Text>
          </View>
        )}
      </View>

      {/* Keypad — hide during active call unless user opens it */}
      {(callState === "idle" || callState === "ended" || showKeypad) && (
        <View style={s.keypad}>
          {KEYS.map((k) => (
            <Pressable
              key={k.d}
              style={({ pressed }) => [s.key, { opacity: pressed ? 0.6 : 1 }]}
              onPress={() => press(k.d)}
            >
              <Text style={s.keyDigit}>{k.d}</Text>
              {k.s ? <Text style={s.keySub}>{k.s}</Text> : null}
            </Pressable>
          ))}
        </View>
      )}

      {/* In-call controls */}
      {isInCall && !showKeypad && (
        <View style={s.inCallControls}>
          <View style={s.controlsRow}>
            <Pressable
              style={[s.ctrlBtn, muted && s.ctrlBtnActive]}
              onPress={async () => {
                try {
                  await muteCall();
                  setMuted(m => !m);
                } catch (err: any) {
                  showToast(err?.message || "Mute failed", "error");
                }
              }}
            >
              <Feather name={muted ? "mic-off" : "mic"} size={22} color={muted ? C.red : C.textSec} />
              <Text style={[s.ctrlLabel, muted && { color: C.red }]}>Mute</Text>
            </Pressable>
            <Pressable
              style={[s.ctrlBtn, speaker && s.ctrlBtnActive]}
              onPress={() => setSpeaker(sp => !sp)}
            >
              <Feather name="volume-2" size={22} color={speaker ? C.accent : C.textSec} />
              <Text style={[s.ctrlLabel, speaker && { color: C.accent }]}>Speaker</Text>
            </Pressable>
            <Pressable
              style={s.ctrlBtn}
              onPress={() => setShowKeypad(true)}
            >
              <Feather name="grid" size={22} color={C.textSec} />
              <Text style={s.ctrlLabel}>Keypad</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Bottom actions */}
      <View style={[s.bottom, { paddingBottom: insets.bottom + 24 }]}>
        {isInCall ? (
          <Pressable style={s.hangupBtn} onPress={hangUp}>
            <Feather name="phone-off" size={28} color="#fff" />
          </Pressable>
        ) : (
          <View style={s.callRow}>
            {digits.length > 0 && callState !== "ended" && (
              <Pressable style={s.backspaceBtn} onPress={backspace} onLongPress={() => setDigits("")} hitSlop={10}>
                <Feather name="delete" size={22} color={C.textSec} />
              </Pressable>
            )}
            <Pressable
              style={[s.callBtn, (!digits || digits.length < 2 || !fromNumber) && s.callBtnDisabled]}
              onPress={handleCall}
              disabled={!digits || digits.length < 2 || !fromNumber}
            >
              <Feather name="phone" size={30} color="#fff" />
            </Pressable>
            <View style={{ width: 52 }} />
          </View>
        )}
      </View>

      {/* From-number picker modal */}
      <Modal visible={showFromPicker} transparent animationType="slide">
        <Pressable style={s.modalOverlay} onPress={() => setShowFromPicker(false)} />
        <View style={[s.pickerSheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>Select outgoing number</Text>
          <FlatList
            data={numbers}
            keyExtractor={n => n.id}
            renderItem={({ item, index }) => (
              <Pressable
                style={[s.pickerRow, index === fromIdx && s.pickerRowActive]}
                onPress={() => { setFromIdx(index); setShowFromPicker(false); }}
              >
                <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.pickerNum}>{item.phone_number}</Text>
                  <Text style={s.pickerCountry}>{item.country}</Text>
                </View>
                {index === fromIdx && <Feather name="check" size={18} color={C.accent} />}
              </Pressable>
            )}
          />
        </View>
      </Modal>

      <Modal visible={trialLimitModal !== null} transparent animationType="fade" onRequestClose={() => setTrialLimitModal(null)}>
        <View style={s.limitOverlay}>
          <View style={s.limitCard}>
            <CharBored size={120} />
            <Text style={s.limitTitle}>{trialLimitModal === "minutes" ? "You are out of trial minutes" : "You are out of trial SMS"}</Text>
            <Text style={s.limitSub}>
              {trialLimitModal === "minutes"
                ? `You've used all ${TRIAL_MIN_LIMIT} trial call minutes.`
                : `You've used all ${trialSmsUsed} trial SMS.`}
            </Text>
            <Pressable
              style={s.limitUpgradeBtn}
              onPress={() => {
                setTrialLimitModal(null);
                router.push("/paywall");
              }}
            >
              <Text style={s.limitUpgradeTxt}>Upgrade Plan →</Text>
            </Pressable>
            <Pressable style={s.limitCloseBtn} onPress={() => setTrialLimitModal(null)}>
              <Text style={s.limitCloseTxt}>Not now</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 8,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text, letterSpacing: -0.3 },

  fromRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginHorizontal: 20, marginVertical: 8, backgroundColor: C.surface,
    borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 13,
  },
  fromLeft: { gap: 2 },
  fromLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  fromInfo: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 2 },
  fromNum: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },

  noNumBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginHorizontal: 20, marginVertical: 8, backgroundColor: C.accentDim,
    borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 12,
  },
  noNumTxt: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 12.5, color: C.textSec },
  noNumBtn: { backgroundColor: C.accent, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  noNumBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.onAccent },

  display: {
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 24, paddingVertical: 16, minHeight: 120,
  },
  digitsText: {
    fontFamily: "Inter_400Regular", fontSize: 44, letterSpacing: -1, color: C.text,
    textAlign: "center", maxWidth: "100%",
  },
  endedPill: {
    marginTop: 8, backgroundColor: C.raised, borderRadius: 99,
    paddingHorizontal: 14, paddingVertical: 4,
  },
  endedTxt: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textMuted },

  inCallDisplay: { alignItems: "center", gap: 12 },
  callAvatar: {
    width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  inCallNum: { fontFamily: "Inter_600SemiBold", fontSize: 22, color: C.text, letterSpacing: -0.5 },
  callStatus: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: 1 },

  keypad: {
    flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 28,
    justifyContent: "center", gap: 0, marginTop: 4,
  },
  key: {
    width: "33.33%", height: 72, alignItems: "center", justifyContent: "center", gap: 0,
  },
  keyDigit: {
    fontFamily: "Inter_300Light", fontSize: 32, color: C.text, letterSpacing: -0.5,
    lineHeight: 36,
  },
  keySub: {
    fontFamily: "Inter_700Bold", fontSize: 9, color: C.textMuted, letterSpacing: 2, lineHeight: 12,
  },

  inCallControls: { marginHorizontal: 24, marginTop: 12 },
  controlsRow: { flexDirection: "row", justifyContent: "space-around" },
  ctrlBtn: {
    alignItems: "center", gap: 6, width: 72, height: 76,
    justifyContent: "center", borderRadius: 18, backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border,
  },
  ctrlBtnActive: { backgroundColor: C.raised, borderColor: C.borderStrong },
  ctrlLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.textSec },

  bottom: {
    paddingHorizontal: 28, paddingTop: 12,
    alignItems: "center", justifyContent: "center",
    marginTop: "auto",
  },
  callRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    width: "100%", gap: 0,
  },
  backspaceBtn: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
  },
  callBtn: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: C.green, alignItems: "center", justifyContent: "center",
    shadowColor: C.green, shadowOpacity: 0.45, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 12,
    marginHorizontal: "auto",
    flex: 1, maxWidth: 72,
  },
  callBtnDisabled: { backgroundColor: C.raised, shadowOpacity: 0 },
  hangupBtn: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: C.red, alignItems: "center", justifyContent: "center",
    shadowColor: C.red, shadowOpacity: 0.45, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 12,
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)",
  },
  pickerSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: C.bg, borderTopLeftRadius: 26, borderTopRightRadius: 26,
    paddingTop: 12, maxHeight: "60%",
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: C.border,
    alignSelf: "center", marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: "Inter_700Bold", fontSize: 16, color: C.text,
    paddingHorizontal: 20, marginBottom: 10,
  },
  pickerRow: {
    flexDirection: "row", alignItems: "center", gap: 13,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  pickerRowActive: { backgroundColor: C.accentDim },
  pickerNum: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  pickerCountry: { fontFamily: "Inter_400Regular", fontSize: 11.5, color: C.textMuted, marginTop: 2 },

  limitOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  limitCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: C.surface,
    borderRadius: 22,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  limitTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: C.text,
    textAlign: "center",
    marginTop: 6,
  },
  limitSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textSec,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  limitUpgradeBtn: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: C.accent,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  limitUpgradeTxt: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.onAccent },
  limitCloseBtn: { paddingVertical: 9, paddingHorizontal: 10, marginTop: 8 },
  limitCloseTxt: { fontFamily: "Inter_500Medium", fontSize: 12.5, color: C.textMuted },
});
