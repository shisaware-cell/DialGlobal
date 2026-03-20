import React, { createContext, useContext, useState } from "react";
import { MOCK_NUMBERS } from "../data/mockData";

export type Screen =
  | "onboarding" | "auth" | "home" | "inbox" | "calls" | "settings"
  | "paywall" | "picker" | "profile" | "numdetail"
  | "settings_notifications" | "settings_biometric" | "settings_forwarding"
  | "settings_personal" | "settings_billing" | "settings_usage"
  | "settings_help" | "settings_support";

export type VirtualNumber = {
  id: number;
  number: string;
  country: string;
  flag: string;
  type: "permanent" | "temporary";
  calls: number;
  sms: number;
  plan: string;
  missedCalls: number;
  lastActivity: string;
  expiresIn?: string;
};

type AppContextType = {
  screen: Screen;
  prevScreen: Screen | null;
  navigate: (to: Screen) => void;
  goBack: () => void;
  currentPlan: string;
  billing: string;
  upgradePlan: (planId: string, billingCycle?: string) => void;
  numbers: VirtualNumber[];
  addNumber: (num: VirtualNumber) => void;
  removeNumber: (id: number) => void;
  selectedNumber: VirtualNumber | null;
  setSelectedNumber: (num: VirtualNumber | null) => void;
  paywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);
  const [currentPlan, setCurrentPlan] = useState("basic");
  const [billing, setBilling] = useState("monthly");
  const [numbers, setNumbers] = useState<VirtualNumber[]>(MOCK_NUMBERS as VirtualNumber[]);
  const [selectedNumber, setSelectedNumber] = useState<VirtualNumber | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  function navigate(to: Screen) {
    setPrevScreen(screen);
    setScreen(to);
  }

  function goBack() {
    if (prevScreen) {
      setScreen(prevScreen);
      setPrevScreen(null);
    } else {
      setScreen("home");
    }
  }

  function upgradePlan(planId: string, billingCycle = "monthly") {
    setCurrentPlan(planId);
    setBilling(billingCycle);
  }

  function addNumber(num: VirtualNumber) {
    setNumbers(prev => [...prev, num]);
  }

  function removeNumber(id: number) {
    setNumbers(prev => prev.filter(n => n.id !== id));
  }

  function openPaywall() {
    setPaywallOpen(true);
  }

  function closePaywall() {
    setPaywallOpen(false);
  }

  return (
    <AppContext.Provider value={{
      screen, prevScreen, navigate, goBack,
      currentPlan, billing, upgradePlan,
      numbers, addNumber, removeNumber,
      selectedNumber, setSelectedNumber,
      paywallOpen, openPaywall, closePaywall,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
