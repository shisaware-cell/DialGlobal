import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { PLANS } from "@/data/mockData";
import type { Session, User } from "@supabase/supabase-js";

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

type AppCtx = {
  isAuthed: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  setAuthed: (v: boolean) => void;
  currentPlan: string;
  billing: "monthly" | "yearly";
  upgradePlan: (planId: string, cycle?: "monthly" | "yearly") => void;
  numbers: VirtualNumber[];
  messages: Message[];
  calls: Call[];
  addNumber: (n: VirtualNumber) => void;
  removeNumber: (id: string) => Promise<void>;
  refreshNumbers: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  refreshCalls: () => Promise<void>;
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
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthed, setAuthedState] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("basic");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setAuthedState(true);
        loadProfile(s.user.id);
        loadData();
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setAuthedState(true);
        loadProfile(s.user.id);
        loadData();
      } else {
        setAuthedState(false);
        setProfile(null);
        setNumbers([]);
        setMessages([]);
        setCalls([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile(data as Profile);
      setCurrentPlan(data.plan || "basic");
    }
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
    } catch (err) {
      console.log("Data load error:", err);
    }
  };

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

  const setAuthed = (v: boolean) => {
    setAuthedState(v);
    if (!v) {
      supabase.auth.signOut();
    }
  };

  const upgradePlan = (planId: string, cycle: "monthly" | "yearly" = "monthly") => {
    setCurrentPlan(planId);
    setBilling(cycle);
    if (user) {
      supabase.from("profiles").update({ plan: planId }).eq("id", user.id);
    }
  };

  const addNumber = (n: VirtualNumber) => setNumbers((prev) => [n, ...prev]);
  const removeNumber = async (id: string) => {
    setNumbers((prev) => prev.filter((n) => n.id !== id));
    try {
      await api.deleteNumber(id);
    } catch (e) {
      console.log("Delete number error:", e);
      refreshNumbers();
    }
  };

  const toggleDnd = (id: string) => setDndNumbers(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSpam = (id: string) => setSpamEnabled(prev => ({ ...prev, [id]: !prev[id] }));
  const setAutoReply = (id: string, text: string) => setAutoReplies(prev => ({ ...prev, [id]: text }));
  const importContacts = (newContacts: Contact[]) => setContacts(prev => [...prev, ...newContacts.filter(nc => !prev.some(c => c.phone === nc.phone))]);
  const addCredits = (amount: number) => setCredits(prev => prev + amount);

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthedState(false);
    setSession(null);
    setUser(null);
    setProfile(null);
    setNumbers([]);
    setMessages([]);
    setCalls([]);
    router.replace("/onboarding");
  };

  return (
    <Ctx.Provider
      value={{
        isAuthed,
        session,
        user,
        profile,
        setAuthed,
        currentPlan,
        billing,
        upgradePlan,
        numbers,
        messages,
        calls,
        addNumber,
        removeNumber,
        refreshNumbers,
        refreshMessages,
        refreshCalls,
        loading,
        signOut,
        ghostMode,
        setGhostMode,
        dndNumbers,
        toggleDnd,
        spamEnabled,
        toggleSpam,
        autoReplies,
        setAutoReply,
        contacts,
        importContacts,
        credits,
        addCredits,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}
