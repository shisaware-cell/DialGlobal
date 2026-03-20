import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOCK_NUMBERS, VirtualNumber, PLANS } from "@/data/mockData";

type AppCtx = {
  isAuthed: boolean;
  setAuthed: (v: boolean) => void;
  currentPlan: string;
  billing: "monthly" | "yearly";
  upgradePlan: (planId: string, cycle?: "monthly" | "yearly") => void;
  numbers: VirtualNumber[];
  addNumber: (n: VirtualNumber) => void;
  removeNumber: (id: string) => void;
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setAuthedState] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("basic");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [numbers, setNumbers] = useState<VirtualNumber[]>(MOCK_NUMBERS as VirtualNumber[]);

  useEffect(() => {
    AsyncStorage.getItem("dialglobal_auth").then(v => {
      if (v === "true") setAuthedState(true);
    });
    AsyncStorage.getItem("dialglobal_plan").then(v => {
      if (v) setCurrentPlan(v);
    });
  }, []);

  const setAuthed = (v: boolean) => {
    setAuthedState(v);
    AsyncStorage.setItem("dialglobal_auth", v ? "true" : "false");
  };

  const upgradePlan = (planId: string, cycle: "monthly" | "yearly" = "monthly") => {
    setCurrentPlan(planId);
    setBilling(cycle);
    AsyncStorage.setItem("dialglobal_plan", planId);
  };

  const addNumber = (n: VirtualNumber) => setNumbers(prev => [...prev, n]);
  const removeNumber = (id: string) => setNumbers(prev => prev.filter(n => n.id !== id));

  return (
    <Ctx.Provider value={{ isAuthed, setAuthed, currentPlan, billing, upgradePlan, numbers, addNumber, removeNumber }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}
