import React, { useState } from "react";
import { Ic, Pill, DeleteSheet } from "../components/UI";
import { useApp } from "../context/AppContext";
import { PLANS } from "../data/mockData";

export default function Profile() {
  const { goBack, navigate, currentPlan, billing, numbers } = useApp();
  const [name, setName] = useState("Vusi Hal");
  const [email, setEmail] = useState("vusi@dialglobal.io");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const plan = PLANS.find(p => p.id === currentPlan);
  const price = billing === "yearly" ? plan?.yearlyPrice : plan?.monthlyPrice;

  const save = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-base)", overflow: "hidden" }}>
      <div style={{ background: "var(--bg-surface)", padding: "10px 18px 0", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={goBack} style={{ background: "none", border: "none", display: "flex", padding: 4, cursor: "pointer" }}>
              <Ic d="M15 18l-6-6 6-6" size={20} color="var(--text-primary)" sw={2.2} />
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>My Profile</h2>
          </div>
          <button onClick={() => editing ? save() : setEditing(true)} style={{
            fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "var(--accent-dim)",
            border: "none", padding: "7px 14px", borderRadius: "var(--r-sm)", cursor: "pointer"
          }}>
            {editing ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 28px" }}>
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0 20px" }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "var(--bg-base)", boxShadow: "0 8px 28px var(--accent-glow)", marginBottom: 14 }}>V</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>{name}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, fontFamily: "var(--font-mono)" }}>{email}</div>
          <div style={{ marginTop: 8 }}>
            <Pill label={`⭐ ${plan?.name || "Basic"} Plan · Active`} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[
            { label: "Numbers", value: numbers.length, d: "M9 12h6M9 16h4M13 4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9zM13 4v5h5", color: "var(--accent)" },
            { label: "Total calls", value: 27, d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z", color: "var(--green)" },
            { label: "SMS sent", value: 55, d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", color: "var(--blue)" },
            { label: "Member since", value: "Mar '25", d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2", color: "var(--text-secondary)" },
          ].map((s, i) => (
            <div key={i} className="fade-up" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "13px 12px", animationDelay: `${i * 0.06}s` }}>
              <Ic d={s.d} size={14} color={s.color} style={{ marginBottom: 7 }} />
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.4, padding: "14px 16px 0" }}>PERSONAL INFO</div>
          {[{ label: "Full Name", value: name, set: setName }, { label: "Email", value: email, set: setEmail }].map((f, i) => (
            <div key={i} style={{ padding: "12px 16px", borderBottom: i === 0 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text-muted)", marginBottom: 5, letterSpacing: 0.4 }}>{f.label.toUpperCase()}</div>
              {editing ? (
                <input value={f.value} onChange={e => f.set(e.target.value)} style={{ width: "100%", background: "var(--bg-input)", border: "1.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "8px 12px", fontSize: 13.5, color: "var(--text-primary)", outline: "none" }} />
              ) : (
                <div style={{ fontSize: 13.5, color: "var(--text-primary)", fontFamily: i === 1 ? "var(--font-mono)" : "inherit" }}>{f.value}</div>
              )}
            </div>
          ))}
        </div>

        {saved && (
          <div className="fade-up" style={{ background: "var(--green-dim)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: "var(--r-md)", padding: "11px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Ic d="M20 6L9 17l-5-5" size={14} color="var(--green)" sw={2.5} />
            <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>Profile saved successfully</span>
          </div>
        )}

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.4, padding: "14px 16px 0" }}>SUBSCRIPTION</div>
          <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{plan?.name} Plan</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Renews June 1, 2026</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>${price}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>/month</div>
            </div>
          </div>
          {currentPlan !== "global" && (
            <div style={{ borderTop: "1px solid var(--border)", padding: "10px 16px" }}>
              <button onClick={() => navigate("paywall")} style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                Upgrade plan <Ic d="M9 18l6-6-6-6" size={12} color="var(--accent)" sw={2.5} />
              </button>
            </div>
          )}
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          <button onClick={() => setShowSignOut(true)} style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, borderRadius: "var(--r-sm)", background: "var(--red-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={15} color="var(--red)" sw={2} />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--red)" }}>Sign Out</span>
          </button>
        </div>
      </div>

      {showSignOut && (
        <DeleteSheet
          title="Sign out?"
          body="You'll be logged out on this device."
          confirmLabel="Sign Out"
          onClose={() => setShowSignOut(false)}
          onConfirm={() => { setShowSignOut(false); navigate("auth"); }}
        />
      )}
    </div>
  );
}
