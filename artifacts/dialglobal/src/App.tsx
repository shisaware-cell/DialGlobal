import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { StatusBar } from "./components/UI";
import TabBar from "./components/TabBar";
import Paywall from "./screens/Paywall";
import Onboarding from "./screens/Onboarding";
import Auth from "./screens/Auth";
import Dashboard from "./screens/Dashboard";
import Inbox from "./screens/Inbox";
import Settings from "./screens/Settings";
import Picker from "./screens/Picker";
import Profile from "./screens/Profile";
import NumberDetail from "./screens/NumberDetail";

function AppShell() {
  const { screen, paywallOpen, closePaywall } = useApp();
  const showStatusBar = ["home", "inbox", "calls", "settings"].includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case "onboarding": return <Onboarding />;
      case "auth": return <Auth />;
      case "home": return <Dashboard />;
      case "inbox": return <Inbox />;
      case "calls": return <Inbox defaultTab="calls" />;
      case "settings": return <Settings />;
      case "paywall": return <Paywall />;
      case "picker": return <Picker />;
      case "profile": return <Profile />;
      case "numdetail": return <NumberDetail />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: "#1a1a2e",
    }}>
      <div style={{
        width: "min(390px, 100vw)", height: "min(844px, 100vh)",
        background: "var(--bg-base)", borderRadius: "min(44px, 0px)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
        position: "relative"
      }}>
        {showStatusBar && <StatusBar />}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          {renderScreen()}
        </div>
        <TabBar />

        {paywallOpen && (
          <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
            <Paywall onClose={closePaywall} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
