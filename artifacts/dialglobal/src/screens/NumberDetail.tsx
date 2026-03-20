import React, { useState } from "react";
import { Ic, DeleteSheet } from "../components/UI";
import { useApp } from "../context/AppContext";

export default function NumberDetail() {
  const { goBack, selectedNumber, removeNumber, navigate } = useApp();
  const [showDelete, setShowDelete] = useState(false);
  const num = selectedNumber;

  if (!num) { goBack(); return null; }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-base)", overflow: "hidden" }}>
      <div style={{ background: "var(--bg-surface)", padding: "10px 18px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <button onClick={goBack} style={{ background: "none", border: "none", display: "flex", padding: 4, cursor: "pointer" }}>
            <Ic d="M15 18l-6-6 6-6" size={20} color="var(--text-primary)" sw={2.2} />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>Number Details</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--bg-raised)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative" }}>
            {num.flag}
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 11, height: 11, borderRadius: "50%", background: "var(--green)", border: "2px solid var(--bg-surface)" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>{num.number}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{num.country} · {num.type}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[
            { label: "Calls", value: num.calls, color: "var(--blue)" },
            { label: "Messages", value: num.sms, color: "var(--green)" },
            { label: "Missed", value: num.missedCalls, color: "var(--red)" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.4, padding: "14px 16px 0" }}>NUMBER INFO</div>
          {[
            { label: "NUMBER", value: num.number },
            { label: "COUNTRY", value: num.country },
            { label: "TYPE", value: num.type === "permanent" ? "Permanent" : `Temporary (${num.expiresIn})` },
            { label: "PLAN", value: num.plan },
            { label: "LAST ACTIVITY", value: num.lastActivity },
          ].map((r, i, arr) => (
            <div key={i} style={{ padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 0.6, marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: 13.5, color: "var(--text-primary)", fontFamily: r.label === "NUMBER" ? "var(--font-mono)" : "inherit" }}>{r.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <button className="press" onClick={() => navigate("inbox")} style={{ flex: 1, height: 48, background: "var(--accent)", border: "none", borderRadius: "var(--r-md)", color: "var(--bg-base)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 16px var(--accent-glow)", transition: "transform 0.1s", cursor: "pointer" }}>
            <Ic d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" size={14} color="var(--bg-base)" /> Message
          </button>
          <button className="press" style={{ flex: 1, height: 48, background: "var(--green-dim)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: "var(--r-md)", color: "var(--green)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "transform 0.1s", cursor: "pointer" }}>
            <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" size={14} color="var(--green)" /> Call
          </button>
        </div>

        <button onClick={() => setShowDelete(true)} style={{ width: "100%", height: 48, background: "var(--red-dim)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "var(--r-md)", color: "var(--red)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, cursor: "pointer" }}>
          <Ic d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" size={14} color="var(--red)" /> Release Number
        </button>
      </div>

      {showDelete && (
        <DeleteSheet
          title="Release this number?"
          body={`${num.number} will be permanently deleted and returned to the pool. This cannot be undone.`}
          confirmLabel="Yes, release number"
          onClose={() => setShowDelete(false)}
          onConfirm={() => { removeNumber(num.id); setShowDelete(false); navigate("home"); }}
        />
      )}
    </div>
  );
}
