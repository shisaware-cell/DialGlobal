import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { router } from "expo-router";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as ExpoAV from "expo-av";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { PLANS } from "@/data/mockData";
import { telnyxService } from "@/services/TelnyxService";
import type { Session, User } from "@supabase/supabase-js";

const CREDITS_KEY = "@dialglobal_credits";

export type VirtualNumber = {
  id: string;
  phone_number: string;
  country: string;
  country_code: string;
  flag: string;
  type: string;
  status: string;
  call_count: number;
  sms_count: number;
  missed_count: number;
  created_at: string;
  expires_at?: string;
};

export type Message = {
  id: string;
  from_number: string;
  to_number: string;
  body: string;
  direction: string;
  status: string;
  read: boolean;
  created_at: string;
  number_id?: string;
};

export type Call = {
  id: string;
  from_number: string;
  to_number: string;
  direction: string;
  status: string;
  duration: number;
  created_at: string;
  number_id?: string;
};

type Profile = {
  id: string;
  email: string;
  name: string;
  plan: string;
  avatar_url?: string;
};

export type Contact = { name: string; phone: string; initials: string };

export type ToastType = "info" | "success" | "warning" | "error";
export type Toast = { message: string; type: ToastType } | null;
export type ActiveCall = { state: string; caller: string; number: string; callObj: any } | null;
export type IncomingCall = { caller: string; number: string; callObj: any } | null;

type AppCtx = {
  isAuthed: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  setAuthed: (v: boolean) => void;

  currentPlan: string;
  pendingPlan: string;
  selectPlan: (planId: string) => void;
  billing: "monthly" | "yearly";
  upgradePlan: (planId: string, cycle?: "monthly" | "yearly") => Promise<void>;

  isInTrial: boolean;
  trialEnds: Date | null;
  trialPlan: string | null;
  trialExpired: boolean;
  trialMinsUsed: number;
  trialSmsUsed: number;
  expireTrial: () => void;
  fullPlanActivate: () => void;

  numbers: VirtualNumber[];
  messages: Message[];
  calls: Call[];
  addNumber: (n: VirtualNumber) => void;
  removeNumber: (id: string) => Promise<void>;
  refreshNumbers: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  refreshCalls: () => Promise<void>;
  updateProfile: (fields: { name?: string }) => Promise<void>;
  loading: boolean;
  signOut: () => Promise<void>;

  ghostMode: boolean;
  setGhostMode: (v: boolean) => void;
  dndNumbers: Record<string, boolean>;
  toggleDnd: (id: string) => void;
  spamEnabled: Record<string, boolean>;
  toggleSpam: (id: string) => void;
  autoReplies: Record<string, string>;
  setAutoReply: (id: string, text: string) => void;
  contacts: Contact[];
  importContacts: (newContacts: Contact[]) => void;
  credits: number;
  addCredits: (amount: number) => void;
  recordings: Record<string, boolean>;
  toggleRecording: (id: string) => void;
  forwarding: Record<string, boolean>;
  toggleForwarding: (id: string) => void;
  forwardingNums: Record<string, string>;
  setForwardingNum: (id: string, num: string) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;

  toast: Toast;
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: () => void;
  telnyxReady: boolean;
  activeCall: ActiveCall;
  incomingCall: IncomingCall;
  callMuted: boolean;
  callOnHold: boolean;
  callSpeaker: boolean;
  startCall: (number: string) => Promise<void>;
  answerCall: () => Promise<void>;
  hangupCall: () => Promise<void>;
  muteCall: () => Promise<void>;
  unmuteCall: () => Promise<void>;
  holdCall: () => Promise<void>;
  unholdCall: () => Promise<void>;
  toggleSpeaker: (enabled: boolean) => Promise<void>;
  sendDTMF: (digit: string) => Promise<void>;
  dismissIncomingCall: () => void;
  activeEsim: string | null;
  activateEsim: (planId: string) => void;
};

const PLAN_MAP: Record<string, string> = {
  basic: "traveller",
  free: "traveller",
  starter: "professional",
  pro: "professional",
  unlimited: "professional",
  global: "business",
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthed, setAuthedState] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("traveller");
  const [pendingPlan, setPendingPlan] = useState("professional");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [isInTrial, setIsInTrial] = useState(false);
  const [trialEnds, setTrialEnds] = useState<Date | null>(null);
  const [trialPlan, setTrialPlan] = useState<string | null>(null);
  const [trialExpired, setTrialExpired] = useState(false);
  const [trialMinsUsed, setTrialMinsUsed] = useState(4);
  const [trialSmsUsed, setTrialSmsUsed] = useState(3);
  const [numbers, setNumbers] = useState<VirtualNumber[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [ghostMode, setGhostMode] = useState(false);
  const [dndNumbers, setDndNumbers] = useState<Record<string, boolean>>({});
  const [spamEnabled, setSpamEnabled] = useState<Record<string, boolean>>({});
  const [autoReplies, setAutoReplies] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [credits, setCredits] = useState(0);
  const [recordings, setRecordings] = useState<Record<string, boolean>>({});
  const [forwarding, setForwarding] = useState<Record<string, boolean>>({});
  const [forwardingNums, setForwardingNums] = useState<Record<string, string>>({});
  const [notifications, setNotificationsState] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  const [telnyxReady, setTelnyxReady] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall>(null);
  const [callMuted, setCallMuted] = useState(false);
  const [callOnHold, setCallOnHold] = useState(false);
  const [callSpeaker, setCallSpeaker] = useState(false);
  const [activeEsim, setActiveEsimState] = useState<string | null>(null);
  const incomingCallRef = useRef<IncomingCall>(null);

  useEffect(() => {
    incomingCallRef.current = incomingCall;
  }, [incomingCall]);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile(data as Profile);
      const rawPlan = data.plan || "traveller";
      const normalized = PLAN_MAP[rawPlan] ?? rawPlan;
      const validPlan = PLANS.find(p => p.id === normalized) ? normalized : "traveller";
      setCurrentPlan(validPlan);
    }
    try {
      const stored = await AsyncStorage.getItem(`${CREDITS_KEY}_${userId}`);
      if (stored !== null) setCredits(parseFloat(stored));
    } catch {}
  };

  const loadData = async () => {
    try {
      const [numsRes, msgsRes, callsRes] = await Promise.allSettled([
        api.getNumbers(),
        api.getMessages(),
        api.getCalls(),
      ]);
      if (numsRes.status === "fulfilled") setNumbers(numsRes.value.numbers || []);
      if (msgsRes.status === "fulfilled") setMessages(msgsRes.value.messages || []);
      if (callsRes.status === "fulfilled") setCalls(callsRes.value.calls || []);
    } catch {}
  };

  const updateProfile = useCallback(async (fields: { name?: string }) => {
    if (!user) return;
    await supabase.from("profiles").update(fields).eq("id", user.id);
    setProfile(prev => prev ? { ...prev, ...fields } : prev);
  }, [user]);

  const refreshNumbers = useCallback(async () => {
    try {
      const res = await api.getNumbers();
      setNumbers(res.numbers || []);
    } catch {}
  }, []);

  const refreshMessages = useCallback(async () => {
    try {
      const res = await api.getMessages();
      setMessages(res.messages || []);
    } catch {}
  }, []);

  const refreshCalls = useCallback(async () => {
    try {
      const res = await api.getCalls();
      setCalls(res.calls || []);
    } catch {}
  }, []);

  const setupRealtime = useCallback((userId: string) => {
    const channel = supabase
      .channel(`user-data-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "virtual_numbers", filter: `user_id=eq.${userId}` }, () => { refreshNumbers(); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `user_id=eq.${userId}` }, (payload) => {
        setMessages(prev => [payload.new as any, ...prev.filter(m => m.id !== (payload.new as any).id)]);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "calls", filter: `user_id=eq.${userId}` }, (payload) => {
        setCalls(prev => [payload.new as any, ...prev.filter(c => c.id !== (payload.new as any).id)]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refreshNumbers]);

  useEffect(() => {
    let realtimeCleanup: (() => void) | null = null;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setAuthedState(true);
        loadProfile(s.user.id);
        loadData();
        realtimeCleanup = setupRealtime(s.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setAuthedState(true);
        loadProfile(s.user.id);
        loadData();
        if (realtimeCleanup) realtimeCleanup();
        realtimeCleanup = setupRealtime(s.user.id);
      } else {
        setAuthedState(false);
        setProfile(null);
        setNumbers([]);
        setMessages([]);
        setCalls([]);
        if (realtimeCleanup) { realtimeCleanup(); realtimeCleanup = null; }
      }
    });

    return () => {
      subscription.unsubscribe();
      if (realtimeCleanup) realtimeCleanup();
    };
  }, [setupRealtime]);

  const setAuthed = (v: boolean) => {
    setAuthedState(v);
    if (!v) supabase.auth.signOut();
  };

  const selectPlan = useCallback((planId: string) => { setPendingPlan(planId); }, []);

  const upgradePlan = async (planId: string, cycle: "monthly" | "yearly" = "monthly") => {
    setCurrentPlan(planId);
    setTrialPlan(planId);
    setBilling(cycle);
    setIsInTrial(true);
    setTrialExpired(false);
    setTrialEnds(new Date(Date.now() + 3 * 86400000));
    if (user) await supabase.from("profiles").update({ plan: planId }).eq("id", user.id);
  };

  const expireTrial = useCallback(() => {
    setIsInTrial(false);
    setTrialExpired(true);
    setCurrentPlan("traveller");
  }, []);

  const fullPlanActivate = useCallback(() => {
    setIsInTrial(false);
    setTrialExpired(false);
  }, []);

  const addNumber = (n: VirtualNumber) => setNumbers((prev) => [n, ...prev]);
  const removeNumber = async (id: string) => {
    setNumbers((prev) => prev.filter((n) => n.id !== id));
    try { await api.deleteNumber(id); } catch { refreshNumbers(); }
  };

  const toggleDnd = (id: string) => setDndNumbers(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSpam = (id: string) => setSpamEnabled(prev => ({ ...prev, [id]: !prev[id] }));
  const setAutoReply = (id: string, text: string) => setAutoReplies(prev => ({ ...prev, [id]: text }));
  const importContacts = (newContacts: Contact[]) =>
    setContacts(prev => [...prev, ...newContacts.filter(nc => !prev.some(c => c.phone === nc.phone))]);
  const addCredits = (amount: number) => {
    setCredits(prev => {
      const next = parseFloat((prev + amount).toFixed(2));
      if (user) AsyncStorage.setItem(`${CREDITS_KEY}_${user.id}`, String(next)).catch(() => {});
      return next;
    });
  };
  const toggleRecording = (id: string) => setRecordings(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleForwarding = (id: string) => setForwarding(prev => ({ ...prev, [id]: !prev[id] }));
  const setForwardingNum = (id: string, num: string) => setForwardingNums(prev => ({ ...prev, [id]: num }));
  const setNotifications = (v: boolean) => setNotificationsState(v);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const resetCallState = useCallback(() => {
    setCallMuted(false);
    setCallOnHold(false);
    setCallSpeaker(false);
  }, []);

  useEffect(() => {
    let disposed = false;

    if (!isAuthed) {
      telnyxService.disconnect();
      setTelnyxReady(false);
      setActiveCall(null);
      setIncomingCall(null);
      resetCallState();
      return;
    }

    telnyxService.init({
      getLoginToken: async () => {
        const res = await api.getTelnyxToken();
        return res.login_token as string;
      },
      onClientReady: (ready) => {
        if (!disposed) setTelnyxReady(ready);
      },
      onIncomingCall: (incoming) => {
        if (disposed) return;
        setIncomingCall(incoming);
        setActiveCall({ state: "ringing", caller: incoming.caller, number: incoming.number, callObj: incoming.callObj });
        resetCallState();
      },
      onCallState: (payload) => {
        if (disposed) return;
        if (["hangup", "destroy", "ended", "done", "disconnected"].includes(String(payload.state).toLowerCase())) {
          setActiveCall(null);
          setIncomingCall(null);
          resetCallState();
          return;
        }
        setActiveCall({ state: payload.state, caller: payload.caller, number: payload.number, callObj: payload.callObj });
      },
      onError: (err) => {
        if (!disposed) showToast(err.message || "Telnyx connection failed", "error");
      },
    }).catch((err) => {
      if (!disposed) showToast(err.message || "Unable to initialize calling", "error");
    });

    return () => {
      disposed = true;
      telnyxService.disconnect();
    };
  }, [isAuthed, showToast, resetCallState]);

  useEffect(() => {
    let cancelled = false;
    let foregroundSub: Notifications.Subscription | null = null;
    let responseSub: Notifications.Subscription | null = null;
    let pushTokenSub: Notifications.Subscription | null = null;
    let voipRegisterHandler: ((token: string) => void) | null = null;
    let voipNotificationHandler: ((notification: any) => void) | null = null;
    let voipInstance: any = null;

    if (!isAuthed || !notifications) return;

    const upsertPushTokens = async (fields: { ios_voip_token?: string | null; android_fcm_token?: string | null }) => {
      if (!user?.id) return;
      await supabase.from("user_push_tokens").upsert(
        { user_id: user.id, ...fields, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      );
    };

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const registerPushHooks = async () => {
      try {
        const permission = await Notifications.requestPermissionsAsync();
        if (permission.status !== "granted") return;
        const deviceToken = await Notifications.getDevicePushTokenAsync();
        const tokenValue = String((deviceToken as any)?.data ?? "");
        if (tokenValue) {
          await upsertPushTokens({ android_fcm_token: tokenValue });
          await telnyxService.registerPushToken(tokenValue, "fcm");
        }
      } catch {}

      pushTokenSub = (Notifications as any).addPushTokenListener?.((event: any) => {
        const refreshed = String(event?.data ?? "");
        if (!refreshed) return;
        upsertPushTokens({ android_fcm_token: refreshed }).catch(() => {});
        telnyxService.registerPushToken(refreshed, "fcm").catch(() => {});
      }) ?? null;

      foregroundSub = Notifications.addNotificationReceivedListener((event) => {
        telnyxService.handlePushNotification(event?.request?.content?.data).catch(() => {});
      });

      responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
        telnyxService.handlePushNotification(response?.notification?.request?.content?.data).catch(() => {});
      });

      if (Platform.OS !== "ios") return;

      try { voipInstance = require("react-native-voip-push-notification").default; } catch { voipInstance = null; }
      if (!voipInstance) return;

      voipRegisterHandler = (token: string) => {
        upsertPushTokens({ ios_voip_token: token }).catch(() => {});
        telnyxService.registerPushToken(token, "voip").catch(() => {});
      };

      voipNotificationHandler = (notification: any) => {
        telnyxService.handlePushNotification(notification).catch(() => {});
        const complete = voipInstance?.onVoipNotificationCompleted;
        const uuid = notification?.uuid;
        if (typeof complete === "function" && uuid) complete(uuid);
      };

      voipInstance.addEventListener("register", voipRegisterHandler);
      voipInstance.addEventListener("notification", voipNotificationHandler);
      voipInstance.registerVoipToken?.();
    };

    registerPushHooks().catch(() => {
      if (!cancelled) showToast("Push hooks unavailable in current runtime", "warning");
    });

    return () => {
      cancelled = true;
      foregroundSub?.remove();
      responseSub?.remove();
      pushTokenSub?.remove();
      if (voipInstance && voipRegisterHandler) voipInstance.removeEventListener("register", voipRegisterHandler);
      if (voipInstance && voipNotificationHandler) voipInstance.removeEventListener("notification", voipNotificationHandler);
    };
  }, [isAuthed, notifications, showToast, user?.id]);

  const dismissToast = useCallback(() => setToast(null), []);

  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ExpoAV.Audio.requestPermissionsAsync();
      return status === "granted";
    } catch {
      return true;
    }
  }, []);

  const startCall = useCallback(async (number: string) => {
    const destination = number?.trim();
    if (!destination) throw new Error("Destination number is required");

    const hasMic = await requestMicPermission();
    if (!hasMic) throw new Error("Microphone permission is required to make calls");

    const callObj = await telnyxService.makeCall(destination, "DialGlobal");
    setIncomingCall(null);
    setActiveCall({ state: "calling", caller: "DialGlobal", number: destination, callObj });
    resetCallState();
  }, [requestMicPermission, resetCallState]);

  const answerCall = useCallback(async () => {
    const hasMic = await requestMicPermission();
    if (!hasMic) throw new Error("Microphone permission is required to answer calls");

    await telnyxService.answer();
    const incoming = incomingCallRef.current;
    if (incoming) {
      setActiveCall({ state: "connected", caller: incoming.caller, number: incoming.number, callObj: incoming.callObj });
    }
    setIncomingCall(null);
    resetCallState();
  }, [requestMicPermission, resetCallState]);

  const hangupCall = useCallback(async () => {
    await telnyxService.hangup();
    setActiveCall(null);
    setIncomingCall(null);
    resetCallState();
  }, [resetCallState]);

  const muteCall = useCallback(async () => {
    await telnyxService.muteAudio();
    setCallMuted(true);
  }, []);

  const unmuteCall = useCallback(async () => {
    await telnyxService.unmuteAudio();
    setCallMuted(false);
  }, []);

  const holdCall = useCallback(async () => {
    await telnyxService.hold();
    setCallOnHold(true);
  }, []);

  const unholdCall = useCallback(async () => {
    await telnyxService.unhold();
    setCallOnHold(false);
  }, []);

  const toggleSpeaker = useCallback(async (enabled: boolean) => {
    await telnyxService.toggleSpeaker(enabled);
    setCallSpeaker(enabled);
  }, []);

  const sendDTMF = useCallback(async (digit: string) => {
    await telnyxService.sendDTMF(digit);
  }, []);

  const dismissIncomingCall = useCallback(() => setIncomingCall(null), []);
  const activateEsim = useCallback((planId: string) => setActiveEsimState(planId), []);

  const signOut = async () => {
    if (user) AsyncStorage.removeItem(`${CREDITS_KEY}_${user.id}`).catch(() => {});
    await supabase.auth.signOut();
    setAuthedState(false);
    setSession(null);
    setUser(null);
    setProfile(null);
    setNumbers([]);
    setMessages([]);
    setCalls([]);
    setCredits(0);
    setIsInTrial(false);
    setTrialExpired(false);
    telnyxService.disconnect();
    setTelnyxReady(false);
    setActiveCall(null);
    setIncomingCall(null);
    resetCallState();
    router.replace("/onboarding");
  };

  return (
    <Ctx.Provider value={{
      isAuthed, session, user, profile, setAuthed,
      currentPlan, pendingPlan, selectPlan, billing, upgradePlan,
      isInTrial, trialEnds, trialPlan, trialExpired, trialMinsUsed, trialSmsUsed,
      expireTrial, fullPlanActivate,
      numbers, messages, calls, addNumber, removeNumber,
      refreshNumbers, refreshMessages, refreshCalls, updateProfile,
      loading, signOut,
      ghostMode, setGhostMode,
      dndNumbers, toggleDnd, spamEnabled, toggleSpam,
      autoReplies, setAutoReply, contacts, importContacts,
      credits, addCredits, recordings, toggleRecording,
      forwarding, toggleForwarding, forwardingNums, setForwardingNum,
      notifications, setNotifications,
      toast, showToast, dismissToast,
      telnyxReady, activeCall, incomingCall,
      callMuted, callOnHold, callSpeaker,
      startCall, answerCall, hangupCall,
      muteCall, unmuteCall, holdCall, unholdCall,
      toggleSpeaker, sendDTMF,
      dismissIncomingCall,
      activeEsim, activateEsim,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}
