import React, { useState } from "react";
import { StatusBar } from "../components/UI";
import { useApp } from "../context/AppContext";

const SLIDES = [
  {
    tag: "100+ COUNTRIES", title: "Your number,\nanywhere.",
    sub: "Real local phone numbers in over 100 countries. Receive calls and texts like a local — from anywhere.",
    bg: "radial-gradient(ellipse at 60% 30%, #FDE9C0 0%, var(--bg-base) 80%)",
  },
  {
    tag: "ALL IN ONE PLACE", title: "One app.\nEvery number.",
    sub: "Manage virtual numbers, calls, and messages in a single clean dashboard. No switching apps.",
    bg: "radial-gradient(ellipse at 40% 30%, #C8EDD8 0%, var(--bg-base) 80%)",
  },
  {
    tag: "PRIVACY FIRST", title: "Private,\nsecure, yours.",
    sub: "Your real number stays hidden. Every call is encrypted. Identity verified on your terms.",
    bg: "radial-gradient(ellipse at 50% 30%, #DDEAFC 0%, var(--bg-base) 80%)",
  },
];

function GlobeVisual() {
  return (
    <div style={{ position: "relative", width: 250, height: 220, margin: "0 auto" }}>
      <div style={{
        width: 160, height: 160, borderRadius: "50%",
        background: "conic-gradient(from 0deg,#e8a02018,#e8a02008,#e8a02020,#e8a0200a)",
        border: "1.5px solid #e8a02030", position: "absolute", top: 30, left: 45,
        boxShadow: "0 0 40px var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {[30, 50, 70].map((y, i) => <div key={i} style={{ position: "absolute", left: "10%", right: "10%", top: `${y}%`, height: 1, background: "#e8a02020" }} />)}
        {[35, 55, 75].map((x, i) => <div key={i} style={{ position: "absolute", top: "10%", bottom: "10%", left: `${x}%`, width: 1, background: "#e8a02020" }} />)}
      </div>
      {[
        { flag: "🇺🇸", s: { top: 5, left: -5 }, delay: "0s", dur: "2.2s" },
        { flag: "🇬🇧", s: { top: 0, right: 0 }, delay: "0.4s", dur: "2.6s" },
        { flag: "🇯🇵", s: { bottom: 40, left: 5 }, delay: "0.8s", dur: "2.4s" },
        { flag: "🇦🇺", s: { bottom: 10, right: 10 }, delay: "0.2s", dur: "2.8s" },
      ].map((f, i) => (
        <div key={i} style={{
          position: "absolute", ...f.s, background: "white",
          border: "1px solid var(--border-strong)", borderRadius: 16, padding: "5px 10px",
          fontSize: 18, animation: `float ${f.dur} ease-in-out infinite`,
          animationDelay: f.delay, boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
        }}>{f.flag}</div>
      ))}
    </div>
  );
}

function DashVisual() {
  return (
    <div style={{ width: 200, margin: "0 auto", background: "white", borderRadius: 20, border: "1px solid var(--border-strong)", overflow: "hidden" }}>
      <div style={{ height: 30, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "var(--bg-base)" }}>DIALGLOBAL</span>
      </div>
      {[{ n: "🇺🇸  +1 (415) 823-4921", a: true }, { n: "🇬🇧  +44 7700 123 456", a: false }, { n: "🇦🇺  +61 4 1234 5678", a: false }].map((item, i) => (
        <div key={i} style={{
          margin: "6px 10px", padding: "9px 10px",
          background: item.a ? "var(--accent-dim)" : "var(--bg-raised)",
          borderRadius: 9, fontSize: 9, fontWeight: 600,
          color: item.a ? "var(--accent)" : "var(--text-secondary)",
          borderLeft: `2.5px solid ${item.a ? "var(--accent)" : "transparent"}`
        }}>{item.n}</div>
      ))}
      <div style={{ margin: "8px 10px 10px", padding: "7px 10px", background: "var(--green-dim)", borderRadius: 9, display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 1.5s ease infinite" }} />
        <span style={{ fontSize: 8.5, fontWeight: 700, color: "var(--green)" }}>3 active numbers</span>
      </div>
    </div>
  );
}

function LockVisual() {
  return (
    <div style={{ position: "relative", width: 220, height: 200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 130, height: 130, borderRadius: "50%", background: "white",
        border: "1.5px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 40px var(--blue-dim)"
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.3" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>
      {[
        { txt: "🔒 Encrypted", c: "var(--accent)", s: { top: 20, left: 5 } },
        { txt: "✓ Verified", c: "var(--green)", s: { top: 60, right: 0 } },
        { txt: "🚫 No spam", c: "var(--red)", s: { bottom: 36, left: 10 } },
        { txt: "👁 Private", c: "var(--blue)", s: { bottom: 10, right: 10 } }
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute", ...b.s, background: "white", border: "1px solid var(--border-strong)",
          borderRadius: 14, padding: "5px 10px", fontSize: 9.5, fontWeight: 700, color: b.c,
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)", whiteSpace: "nowrap"
        }}>{b.txt}</div>
      ))}
    </div>
  );
}

const VISUALS = [GlobeVisual, DashVisual, LockVisual];

export default function Onboarding() {
  const { navigate } = useApp();
  const [step, setStep] = useState(0);
  const sl = SLIDES[step];
  const Visual = VISUALS[step];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: sl.bg, transition: "background 0.6s ease" }}>
      <StatusBar />
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 22px 4px" }}>
        {step < SLIDES.length - 1 && (
          <button onClick={() => navigate("auth")} style={{ background: "none", border: "none", fontSize: 13, color: "var(--text-muted)", fontWeight: 500, cursor: "pointer" }}>Skip</button>
        )}
      </div>
      <div key={`v${step}`} className="fade-up" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 24px" }}>
        <Visual />
      </div>
      <div style={{ background: "var(--bg-surface)", borderRadius: "28px 28px 0 0", padding: "28px 26px 36px", borderTop: "1px solid var(--border)" }}>
        <div key={`c${step}`} className="fade-up">
          <div style={{
            display: "inline-flex", alignItems: "center", background: "var(--accent-dim)",
            color: "var(--accent)", fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6,
            padding: "4px 11px", borderRadius: 99, marginBottom: 14
          }}>{sl.tag}</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.18, marginBottom: 10, letterSpacing: "-0.6px", whiteSpace: "pre-line" }}>{sl.title}</h1>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>{sl.sub}</p>
        </div>
        <div style={{ display: "flex", gap: 5, marginBottom: 20, alignItems: "center" }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{ height: 3, borderRadius: 99, background: i === step ? "var(--accent)" : "var(--bg-hover)", width: i === step ? 24 : 7, transition: "all 0.35s ease" }} />
          ))}
        </div>
        <button className="press" onClick={() => step < SLIDES.length - 1 ? setStep(s => s + 1) : navigate("auth")} style={{
          width: "100%", height: 54, background: "var(--accent)", border: "none", borderRadius: "var(--r-md)",
          color: "var(--bg-base)", fontSize: 15, fontWeight: 700, boxShadow: "0 6px 22px var(--accent-glow)",
          transition: "transform 0.1s", cursor: "pointer"
        }}>
          {step === SLIDES.length - 1 ? "Get Started — It's Free →" : "Continue →"}
        </button>
        {step === 0 && (
          <button onClick={() => navigate("auth")} style={{
            width: "100%", height: 40, background: "none", border: "none",
            color: "var(--text-muted)", fontSize: 13, marginTop: 4, cursor: "pointer"
          }}>
            Already have an account · Log in
          </button>
        )}
      </div>
    </div>
  );
}
