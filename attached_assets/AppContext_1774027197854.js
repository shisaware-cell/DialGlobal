// src/context/AppContext.js
// Global state: current plan, owned numbers, screen navigation.
import React, { createContext, useContext, useState } from "react";
import { MOCK_NUMBERS } from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [screen, setScreen]         = useState("onboarding");
  const [prevScreen, setPrevScreen] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("basic"); // "basic" | "unlimited" | "global"
  const [billing, setBilling]         = useState("monthly");
  const [numbers, setNumbers]         = useState(MOCK_NUMBERS);
  const [selectedNumber, setSelectedNumber] = useState(null); // for NumberDetail

  // Navigate with back-stack support
  function navigate(to) {
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

  function upgradePlan(planId, billingCycle = "monthly") {
    setCurrentPlan(planId);
    setBilling(billingCycle);
  }

  function addNumber(num) {
    setNumbers(prev => [...prev, num]);
  }

  function removeNumber(id) {
    setNumbers(prev => prev.filter(n => n.id !== id));
  }

  return (
    <AppContext.Provider value={{
      screen, navigate, goBack,
      currentPlan, billing, upgradePlan,
      numbers, addNumber, removeNumber,
      selectedNumber, setSelectedNumber,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
