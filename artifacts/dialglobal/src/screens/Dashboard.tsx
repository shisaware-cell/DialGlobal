import React, { useState } from "react";
import { Ic, DeleteSheet } from "../components/UI";
import { useApp, VirtualNumber } from "../context/AppContext";

function NumberRow({ num, index }: { num: VirtualNumber; index: number }) {
  const { navigate, setSelectedNumber, removeNumber } = useApp();
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const openDetail = () => { setSelectedNumber(num); navigate("numdetail"); };

  return (
    <div className="fade-up" style={{ animationDelay: `${index * 0.07}s`, position: "relative" }}>
      <div onClick={() => setOpen(o => !o)} className="row-hover"
        style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 20px", cursor: "pointer", background: "var(--bg-surface)", transition: "background 0.12s" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 13, background: "var(--bg-raised)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0, position: "relative"
        }}>
          {num.flag}
          <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: "var(--green)", border: "2px solid var(--bg-surface)" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.3px", fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {num.number}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{num.country}</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border-strong)", display: "inline-block" }} />
            <span style={{ fontSize: 10.5, fontWeight: 600, color: num.type === "permanent" ? "var(--accent)" : "var(--green)" }}>
              {num.type === "permanent" ? "Permanent" : `⏱ ${num.expiresIn}`}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{num.calls} calls</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{num.sms} msg</span>
            </div>
            {num.missedCalls > 0 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", animation: "pulse 1.5s ease infinite" }} />
                <span style={{ fontSize: 10.5, color: "var(--red)", fontWeight: 700 }}>{num.missedCalls} missed</span>
              </div>
            )}
          </div>
          <Ic d={open ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} size={15} color="var(--text-muted)" sw={2.2} />
        </div>
      </div>

      {open && (
        <div className="fade-up" style={{ background: "var(--bg-raised)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "10px 20px", display: "flex", gap: 8 }}>
          <button className="press" style={{
            flex: 1, height: 36, background: "var(--accent)", border: "none", borderRadius: "var(--r-sm)",
            color: "var(--bg-base)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 5, boxShadow: "0 2px 8px var(--accent-glow)", transition: "transform 0.1s", cursor: "pointer"
          }}>
            <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
              size={12} color="var(--bg-base)" sw={2.5} /> Call
          </button>
          <button className="press" onClick={() => navigate("inbox")} style={{
            flex: 1, height: 36, background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: "var(--r-sm)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "transform 0.1s", cursor: "pointer"
          }}>
            <Ic d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" size={12} color="var(--text-secondary)" /> Message
          </button>
          <button className="press" onClick={openDetail} style={{
            width: 36, height: 36, background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.1s", cursor: "pointer"
          }}>
            <Ic d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" size={13} color="var(--text-muted)" sw={2} />
          </button>
          <button className="press" onClick={() => setShowDelete(true)} style={{
            width: 36, height: 36, background: "var(--red-dim)", border: "1px solid rgba(220,38,38,0.15)",
            borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.1s", cursor: "pointer"
          }}>
            <Ic d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" size={13} color="var(--red)" sw={2} />
          </button>
        </div>
      )}

      <div style={{ height: 1, background: "var(--border)", margin: "0 20px" }} />

      {showDelete && (
        <DeleteSheet
          title="Release this number?"
          body={`${num.number} will be permanently deleted and returned to the pool. This cannot be undone.`}
          confirmLabel="Yes, release number"
          onClose={() => setShowDelete(false)}
          onConfirm={() => { removeNumber(num.id); setShowDelete(false); }}
        />
      )}
    </div>
  );
}

export default function Dashboard() {
  const { navigate, numbers, currentPlan } = useApp();
  const planLabels: Record<string, string> = { basic: "Basic", unlimited: "Unlimited", global: "Global" };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg-base)" }}>
      <div style={{ background: "var(--bg-surface)", padding: "6px 20px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.5, margin: 0 }}>GOOD MORNING</p>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", margin: "3px 0 0", letterSpacing: "-0.5px" }}>Vusi Hal 👋</h2>
          </div>
          <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
            <button style={{
              width: 40, height: 40, borderRadius: "var(--r-md)", background: "var(--bg-raised)",
              border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", cursor: "pointer"
            }}>
              <Ic d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" size={17} color="var(--text-secondary)" />
              <div style={{ position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: "50%", background: "var(--red)", border: "1.5px solid var(--bg-surface)" }} />
            </button>
            <button onClick={() => navigate("profile")} style={{
              width: 40, height: 40, borderRadius: "var(--r-md)", background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: "var(--bg-base)", border: "none", cursor: "pointer"
            }}>V</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Numbers", value: numbers.length, d: "M9 12h6M9 16h4M13 4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9zM13 4v5h5", color: "var(--accent)" },
            { label: "Messages", value: 55, d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", color: "var(--green)" },
            { label: "Calls", value: 15, d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z", color: "var(--blue)" },
          ].map((s, i) => (
            <div key={i} className="fade-up" style={{ flex: 1, background: "var(--bg-raised)", borderRadius: "var(--r-md)", padding: "12px 10px", border: "1px solid var(--border)", animationDelay: `${i * 0.06}s` }}>
              <Ic d={s.d} size={15} color={s.color} style={{ marginBottom: 7 }} />
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div onClick={() => navigate("paywall")} style={{
        margin: "10px 16px 0", background: "var(--accent-dim)",
        border: "1px solid rgba(232,160,32,0.25)", borderRadius: "var(--r-md)",
        padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer"
      }}>
        <span style={{ fontSize: 14 }}>⭐</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{planLabels[currentPlan]} Plan</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>
            {currentPlan === "basic" ? "Upgrade for more numbers & countries" : "Active"}
          </span>
        </div>
        {currentPlan !== "global" && (
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>Upgrade →</span>
        )}
      </div>

      <div style={{ background: "var(--bg-surface)", marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 10px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.1 }}>MY NUMBERS</h3>
          <button onClick={() => navigate("picker")} style={{
            fontSize: 12, color: "var(--accent)", fontWeight: 600, background: "none", border: "none",
            display: "flex", alignItems: "center", gap: 3, cursor: "pointer"
          }}>
            <Ic d="M12 5v14M5 12h14" size={13} color="var(--accent)" sw={2.5} /> Add
          </button>
        </div>
        {numbers.length === 0 ? (
          <div style={{ padding: "30px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📱</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>No numbers yet</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Add your first virtual number to get started</div>
            <button className="press" onClick={() => navigate("picker")} style={{
              padding: "10px 24px", background: "var(--accent)", border: "none", borderRadius: "var(--r-md)",
              color: "var(--bg-base)", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 14px var(--accent-glow)",
              transition: "transform 0.1s", cursor: "pointer"
            }}>
              Get a Number →
            </button>
          </div>
        ) : (
          numbers.map((num, i) => <NumberRow key={num.id} num={num} index={i} />)
        )}
      </div>

      <div style={{ padding: "10px 16px 28px" }}>
        <div className="press fade-up" onClick={() => navigate("picker")} style={{
          background: "var(--bg-surface)", border: "1px solid var(--border-strong)",
          borderRadius: "var(--r-lg)", padding: "16px 18px", marginTop: 10, cursor: "pointer",
          animationDelay: "0.25s", position: "relative", overflow: "hidden",
          transition: "transform 0.1s", display: "flex", alignItems: "center", gap: 14
        }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "var(--accent-glow)", filter: "blur(24px)", pointerEvents: "none" }} />
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>🌍</div>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.2px" }}>Add another country</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>100+ countries · from $1.99/month</div>
          </div>
          <Ic d="M9 18l6-6-6-6" size={16} color="var(--accent)" sw={2.5} />
        </div>
      </div>
    </div>
  );
}
