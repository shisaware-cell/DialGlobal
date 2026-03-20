import React, { useState } from "react";
import { Ic, Spinner, UpgradeSheet } from "../components/UI";
import { COUNTRIES, genNumber, PLANS } from "../data/mockData";
import { useApp, VirtualNumber } from "../context/AppContext";

export default function Picker() {
  const { goBack, navigate, currentPlan, numbers, addNumber } = useApp();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<(typeof COUNTRIES)[0] | null>(null);
  const [type, setType] = useState<"permanent" | "temporary">("permanent");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [number, setNumber] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const plan = PLANS.find(p => p.id === currentPlan);
  const atLimit = numbers.length >= (plan?.numberLimit || 1);
  const allowedCodes = currentPlan === "basic" ? ["US", "GB", "CA"] : null;

  const list = COUNTRIES.filter(c => {
    const q = search.toLowerCase();
    const mq = c.name.toLowerCase().includes(q) || c.prefix.includes(q) || c.code.toLowerCase().includes(q);
    const mf = filter === "all" || (filter === "popular" && c.popular) || (filter === "instant" && c.instant);
    return mq && mf;
  });

  const provision = () => {
    if (!selected) return;
    if (allowedCodes && !allowedCodes.includes(selected.code)) { setShowUpgrade(true); return; }
    if (atLimit) { setShowUpgrade(true); return; }
    setLoading(true);
    setTimeout(() => {
      const newNum = genNumber(selected.prefix);
      setNumber(newNum);
      addNumber({
        id: Date.now(), number: newNum, country: selected.name,
        flag: selected.flag, type, calls: 0, sms: 0,
        plan: plan?.name || "Basic", missedCalls: 0, lastActivity: "just now",
        ...(type === "temporary" ? { expiresIn: "7 days" } : {}),
      } as VirtualNumber);
      setLoading(false);
      setDone(true);
    }, 2400);
  };

  if (done) return (
    <div className="scale-in" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-base)", padding: "0 32px" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--green-dim)", border: "1px solid rgba(22,163,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22, animation: "pop 0.5s ease" }}>
        <Ic d="M20 6L9 17l-5-5" size={30} color="var(--green)" sw={2.5} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: 8, letterSpacing: "-0.5px" }}>Number Activated 🎉</h2>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center", marginBottom: 28, lineHeight: 1.7 }}>Your new {selected?.name} number is live and ready.</p>
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-lg)", padding: "20px 24px", marginBottom: 28, textAlign: "center", width: "100%" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{selected?.flag}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 500, color: "var(--accent)", letterSpacing: "-0.3px" }}>{number}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, marginBottom: 10 }}>{selected?.name} · {type}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--green-dim)", borderRadius: 99, padding: "4px 12px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 1.5s ease infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)" }}>Active</span>
        </div>
      </div>
      <button className="press" onClick={() => { setDone(false); setSelected(null); setSearch(""); navigate("home"); }}
        style={{ width: "100%", height: 52, background: "var(--accent)", border: "none", borderRadius: "var(--r-md)", color: "var(--bg-base)", fontSize: 15, fontWeight: 700, boxShadow: "0 6px 20px var(--accent-glow)", transition: "transform 0.1s", cursor: "pointer" }}>Done</button>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-base)", position: "relative" }}>
      <div style={{ background: "var(--bg-surface)", padding: "8px 20px 0", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <button onClick={goBack} style={{ background: "none", border: "none", display: "flex", padding: 4, cursor: "pointer" }}>
            <Ic d="M15 18l-6-6 6-6" size={20} color="var(--text-primary)" sw={2.2} />
          </button>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>Get a Number</h2>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Pick a country — generated instantly</p>
          </div>
        </div>

        {atLimit && (
          <div onClick={() => navigate("paywall")} style={{ margin: "10px 0 8px", background: "var(--accent-dim)", border: "1px solid rgba(232,160,32,0.25)", borderRadius: "var(--r-sm)", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <span style={{ fontSize: 12 }}>⚠️</span>
            <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>You've reached your {plan?.name} limit ({plan?.numberLimit} numbers). Upgrade →</span>
          </div>
        )}

        <div style={{ position: "relative", margin: "10px 0 11px" }}>
          <Ic d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" size={14} color="var(--text-muted)" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search country or code…"
            style={{ width: "100%", height: 42, borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", background: "var(--bg-input)", paddingLeft: 36, paddingRight: 14, fontSize: 13.5, color: "var(--text-primary)", outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 7, paddingBottom: 13, overflowX: "auto" }}>
          {[{ id: "all", l: "All" }, { id: "popular", l: "⭐ Popular" }, { id: "instant", l: "⚡ Instant" }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flexShrink: 0, height: 28, padding: "0 13px", borderRadius: 99,
              border: `1.5px solid ${filter === f.id ? "var(--accent)" : "var(--border)"}`,
              background: filter === f.id ? "var(--accent-dim)" : "transparent",
              color: filter === f.id ? "var(--accent)" : "var(--text-muted)",
              fontSize: 11.5, fontWeight: 600, transition: "all 0.15s", cursor: "pointer"
            }}>{f.l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px" }}>
        {list.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13 }}>No countries found</div>}
        {list.map((c, i) => {
          const locked = allowedCodes && !allowedCodes.includes(c.code);
          return (
            <div key={c.code} onClick={() => setSelected(c)} className="fade-up" style={{
              display: "flex", alignItems: "center", padding: "11px 13px", borderRadius: "var(--r-md)", marginBottom: 6,
              background: selected?.code === c.code ? "var(--accent-dim)" : "var(--bg-surface)",
              border: `1.5px solid ${selected?.code === c.code ? "rgba(232,160,32,0.4)" : "var(--border)"}`,
              cursor: "pointer", transition: "all 0.15s", animationDelay: `${i * 0.02}s`,
              opacity: locked ? 0.5 : 1
            }}>
              <span style={{ fontSize: 22, marginRight: 11 }}>{c.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
                  {c.name}
                  {locked && <span style={{ fontSize: 9, fontWeight: 700, color: "var(--accent)", background: "var(--accent-dim)", padding: "2px 6px", borderRadius: 99 }}>UPGRADE</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1, fontFamily: "var(--font-mono)" }}>{c.prefix}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                  ${c.price}<span style={{ fontSize: 10, fontWeight: 400, color: "var(--text-muted)" }}>/mo</span>
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: c.instant ? "var(--green-dim)" : "var(--bg-raised)", color: c.instant ? "var(--green)" : "var(--text-muted)" }}>
                  {c.instant ? "⚡ Instant" : "📋 Docs req."}
                </div>
              </div>
              {selected?.code === c.code && (
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 10, animation: "pop 0.2s ease" }}>
                  <Ic d="M20 6L9 17l-5-5" size={10} color="var(--bg-base)" sw={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="slide-up" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", padding: "14px 18px 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
            {(["permanent", "temporary"] as const).map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                flex: 1, height: 37, borderRadius: "var(--r-sm)",
                border: `1.5px solid ${type === t ? "var(--accent)" : "var(--border)"}`,
                background: type === t ? "var(--accent-dim)" : "transparent",
                color: type === t ? "var(--accent)" : "var(--text-secondary)",
                fontSize: 12, fontWeight: 600, transition: "all 0.15s", cursor: "pointer"
              }}>
                {t === "permanent" ? "🔒 Permanent" : "⏱ 7-Day Temp"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "10px 12px", background: "var(--bg-raised)", borderRadius: "var(--r-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 20 }}>{selected.flag}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)" }}>{selected.name}</div>
                <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{selected.prefix} · {type}</div>
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 500, color: "var(--accent)" }}>
              ${type === "temporary" ? "0.99" : selected.price}<span style={{ fontSize: 10, color: "var(--text-muted)" }}>/mo</span>
            </div>
          </div>
          <button className="press" onClick={provision} disabled={loading} style={{
            width: "100%", height: 52,
            background: loading ? "var(--accent-dim)" : "var(--accent)",
            border: "none", borderRadius: "var(--r-md)",
            color: loading ? "var(--accent)" : "var(--bg-base)", fontSize: 14, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: loading ? "none" : "0 6px 20px var(--accent-glow)", transition: "transform 0.1s", cursor: "pointer"
          }}>
            {loading ? <><Spinner /> Generating your number…</> : `Get ${selected.name} Number →`}
          </button>
        </div>
      )}

      {showUpgrade && (
        <UpgradeSheet
          feature={atLimit ? `More than ${plan?.numberLimit} numbers` : "Numbers in this country"}
          requiredPlan="Unlimited"
          onClose={() => setShowUpgrade(false)}
          onUpgrade={() => { setShowUpgrade(false); navigate("paywall"); }}
        />
      )}
    </div>
  );
}
