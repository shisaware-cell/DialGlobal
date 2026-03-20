import React, { useState, useRef } from "react";
import { Ic } from "../components/UI";
import { MOCK_MESSAGES, MOCK_CALLS } from "../data/mockData";

const CTYPES: Record<string, { bg: string; c: string; l: string }> = {
  missed: { bg: "var(--red-dim)", c: "var(--red)", l: "Missed" },
  incoming: { bg: "var(--green-dim)", c: "var(--green)", l: "Incoming" },
  outgoing: { bg: "var(--blue-dim)", c: "var(--blue)", l: "Outgoing" },
  voicemail: { bg: "var(--bg-raised)", c: "var(--text-secondary)", l: "Voicemail" },
};

type Convo = { id: number; name: string; number: string; flag: string; [key: string]: unknown };

function Conversation({ convo, onBack }: { convo: Convo; onBack: () => void }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { id: 1, from: "them", text: "Hey, are you free for a call tomorrow?", time: "2:14 PM" },
    { id: 2, from: "them", text: "I wanted to discuss the project timeline", time: "2:15 PM" },
    { id: 3, from: "me", text: "Sure! I'm free after 3pm 👍", time: "2:18 PM" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const send = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { id: Date.now(), from: "me", text: input, time: "Now" }]);
    setInput("");
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 40);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "var(--bg-surface)", padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 11, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", display: "flex", padding: 4, cursor: "pointer" }}>
          <Ic d="M15 18l-6-6 6-6" size={20} color="var(--text-primary)" sw={2.2} />
        </button>
        <div style={{ width: 38, height: 38, borderRadius: "var(--r-sm)", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{convo.flag}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text-primary)" }}>{convo.name}</div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{convo.number}</div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: "var(--r-sm)", background: "var(--green-dim)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" size={15} color="var(--green)" sw={2.2} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ textAlign: "center", fontSize: 10.5, color: "var(--text-muted)", marginBottom: 4, fontWeight: 500 }}>Today</div>
        {msgs.map(m => (
          <div key={m.id} className="fade-up" style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "76%", padding: "10px 13px",
              borderRadius: m.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.from === "me" ? "var(--accent)" : "var(--bg-surface)",
              color: m.from === "me" ? "var(--bg-base)" : "var(--text-primary)",
              fontSize: 13.5, lineHeight: 1.55,
              border: m.from === "me" ? "none" : "1px solid var(--border)",
              boxShadow: m.from === "me" ? "0 2px 10px var(--accent-glow)" : "none"
            }}>
              {m.text}
              <div style={{ fontSize: 9.5, marginTop: 4, textAlign: "right", color: m.from === "me" ? "rgba(0,0,0,0.35)" : "var(--text-muted)" }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", padding: "10px 13px", display: "flex", gap: 9, alignItems: "center", flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Message…" style={{ flex: 1, height: 42, borderRadius: 99, border: "1.5px solid var(--border)", background: "var(--bg-input)", padding: "0 16px", fontSize: 13.5, color: "var(--text-primary)", outline: "none" }} />
        <button className="press" onClick={send} style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--accent)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 12px var(--accent-glow)", transition: "transform 0.1s", cursor: "pointer" }}>
          <Ic d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" size={16} color="var(--bg-base)" sw={2.3} />
        </button>
      </div>
    </div>
  );
}

export default function Inbox({ defaultTab = "messages" }: { defaultTab?: string }) {
  const [tab, setTab] = useState(defaultTab);
  const [convo, setConvo] = useState<Convo | null>(null);
  if (convo) return <Conversation convo={convo} onBack={() => setConvo(null)} />;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "var(--bg-surface)", padding: "10px 20px 0", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 14px", letterSpacing: "-0.4px" }}>Inbox</h2>
        <div style={{ display: "flex" }}>
          {[{ id: "messages", l: "Messages" }, { id: "calls", l: "Call Log" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, height: 36, background: "none", border: "none",
              borderBottom: `2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`,
              color: tab === t.id ? "var(--accent)" : "var(--text-muted)",
              fontSize: 13.5, fontWeight: tab === t.id ? 600 : 400, transition: "all 0.15s", cursor: "pointer"
            }}>{t.l}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "messages" ? MOCK_MESSAGES.map(m => (
          <div key={m.id} onClick={() => setConvo(m as Convo)} className="row-hover"
            style={{ display: "flex", alignItems: "center", padding: "13px 18px", gap: 11, borderBottom: "1px solid var(--border)", background: "var(--bg-base)", cursor: "pointer", transition: "background 0.12s" }}>
            <div style={{ width: 46, height: 46, borderRadius: "var(--r-md)", background: m.unread > 0 ? "var(--accent-dim)" : "var(--bg-raised)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, position: "relative" }}>
              {m.flag}
              {m.type === "missed" && <div style={{ position: "absolute", bottom: 0, right: 0, width: 15, height: 15, borderRadius: "50%", background: "var(--red)", border: "2px solid var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" size={7} color="#fff" sw={3} />
              </div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 13.5, fontWeight: m.unread > 0 ? 700 : 500, color: "var(--text-primary)" }}>{m.name}</span>
                <span style={{ fontSize: 10.5, color: "var(--text-muted)", flexShrink: 0 }}>{m.time}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12.5, color: m.type === "missed" ? "var(--red)" : "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200, fontWeight: m.type === "missed" ? 600 : 400 }}>
                  {m.type === "missed" ? "Missed call" : m.type === "voicemail" ? `Voicemail · ${m.preview.split(": ")[1] || ""}` : m.preview}
                </span>
                {m.unread > 0 && <div style={{ minWidth: 18, height: 18, borderRadius: 99, padding: "0 4px", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", marginLeft: 6 }}>{m.unread}</div>}
              </div>
            </div>
          </div>
        )) : MOCK_CALLS.map(cl => {
          const cv = CTYPES[cl.type] || CTYPES.outgoing;
          return (
            <div key={cl.id} className="row-hover" style={{ display: "flex", alignItems: "center", padding: "13px 18px", gap: 11, borderBottom: "1px solid var(--border)", background: "var(--bg-base)", cursor: "pointer", transition: "background 0.12s" }}>
              <div style={{ width: 46, height: 46, borderRadius: "var(--r-md)", background: cv.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" size={17} color={cv.c} sw={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: cl.type === "missed" ? "var(--red)" : "var(--text-primary)", marginBottom: 3 }}>{cl.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)" }}>
                  <span>{cl.flag} {cl.number}</span>
                  {cl.duration && <><span>·</span><span>{cl.duration}</span></>}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{cl.time}</span>
                <div style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: cv.bg, color: cv.c }}>{cv.l}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
