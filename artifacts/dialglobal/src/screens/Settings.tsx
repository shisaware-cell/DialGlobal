import React, { useState } from "react";
import { Ic, Toggle, Pill, DeleteSheet } from "../components/UI";
import { useApp } from "../context/AppContext";
import { PLANS } from "../data/mockData";

function SettingsRow({ iconD, label, sublabel, right, danger = false, onClick, last = false }: {
  iconD: string; label: string; sublabel?: string;
  right?: React.ReactNode; danger?: boolean;
  onClick?: () => void; last?: boolean;
}) {
  return (
    <div onClick={onClick} className={onClick ? "row-hover" : ""} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
      borderBottom: last ? "none" : "1px solid var(--border)",
      cursor: onClick ? "pointer" : "default", transition: "background 0.12s"
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "var(--r-sm)",
        background: danger ? "var(--red-dim)" : "var(--accent-dim)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Ic d={iconD} size={15} color={danger ? "var(--red)" : "var(--accent)"} sw={2} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: danger ? "var(--red)" : "var(--text-primary)" }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{sublabel}</div>}
      </div>
      {right}
      {onClick && !right && <Ic d="M9 18l6-6-6-6" size={14} color="var(--text-muted)" sw={2} />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.4, marginBottom: 8, paddingLeft: 4 }}>{title}</div>
      <div style={{ background: "var(--bg-surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>{children}</div>
    </div>
  );
}

export default function Settings() {
  const { navigate, currentPlan, billing } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [callForwarding, setCallForwarding] = useState(true);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const plan = PLANS.find(p => p.id === currentPlan);
  const price = billing === "yearly" ? plan?.yearlyPrice : plan?.monthlyPrice;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg-base)" }}>
      <div className="fade-up row-hover" onClick={() => navigate("profile")} style={{
        background: "var(--bg-surface)", borderBottom: "1px solid var(--border)",
        padding: "16px 20px 20px", display: "flex", alignItems: "center", gap: 14,
        marginBottom: 20, cursor: "pointer", transition: "background 0.12s"
      }}>
        <div style={{ width: 56, height: 56, borderRadius: "var(--r-md)", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "var(--bg-base)", boxShadow: "0 4px 14px var(--accent-glow)" }}>V</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>Vusi Hal</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>vusi@dialglobal.io</div>
          <div style={{ marginTop: 6 }}>
            <Pill label={`⭐ ${plan?.name || "Basic"} Plan`} />
          </div>
        </div>
        <Ic d="M9 18l6-6-6-6" size={16} color="var(--text-muted)" sw={2} />
      </div>

      <div style={{ padding: "0 16px" }}>
        <Section title="PREFERENCES">
          <SettingsRow
            iconD="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
            label="Notifications" sublabel="Calls, messages & missed alerts"
            right={<Toggle value={notifications} onChange={setNotifications} />} />
          <SettingsRow
            iconD="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            label="Biometric Lock" sublabel="Face ID / Fingerprint"
            right={<Toggle value={biometric} onChange={setBiometric} />} />
          <SettingsRow
            iconD="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
            label="Call Forwarding" sublabel="Route calls to another number"
            right={<Toggle value={callForwarding} onChange={setCallForwarding} />} last />
        </Section>

        <Section title="ACCOUNT">
          <SettingsRow
            iconD="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
            label="Personal Info" sublabel="Name, email, password"
            onClick={() => navigate("profile")} />
          <SettingsRow
            iconD="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            label="Billing & Plan"
            sublabel={`${plan?.name} · $${price}/mo`}
            onClick={() => navigate("paywall")} />
          <SettingsRow
            iconD="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            label="Usage & Stats" sublabel="Calls, SMS this month"
            onClick={() => navigate("profile")} last />
        </Section>

        <Section title="SUPPORT">
          <SettingsRow
            iconD="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            label="Help & FAQ"
            onClick={() => window.open("https://support.dialglobal.io", "_blank")} />
          <SettingsRow
            iconD="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            label="Contact Support" sublabel="support@dialglobal.io"
            onClick={() => window.open("mailto:support@dialglobal.io")} last />
        </Section>

        <Section title="DANGER ZONE">
          <SettingsRow
            iconD="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            label="Sign Out" danger onClick={() => setShowSignOut(true)} />
          <SettingsRow
            iconD="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            label="Delete Account" sublabel="This action cannot be undone" danger
            onClick={() => setShowDeleteAccount(true)} last />
        </Section>

        <div style={{ textAlign: "center", padding: "4px 0 28px", color: "var(--text-muted)", fontSize: 11 }}>
          DialGlobal v2.0.0 · Built with Telnyx
        </div>
      </div>

      {showSignOut && (
        <DeleteSheet
          title="Sign out?"
          body="You'll be logged out of your account on this device."
          confirmLabel="Sign Out"
          onClose={() => setShowSignOut(false)}
          onConfirm={() => { setShowSignOut(false); navigate("auth"); }}
        />
      )}

      {showDeleteAccount && (
        <DeleteSheet
          title="Delete account?"
          body="All your numbers, messages, and call history will be permanently deleted. This action cannot be undone."
          confirmLabel="Delete My Account"
          onClose={() => setShowDeleteAccount(false)}
          onConfirm={() => { setShowDeleteAccount(false); navigate("auth"); }}
        />
      )}
    </div>
  );
}
