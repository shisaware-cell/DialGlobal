import React from "react";

export function Ic({ d, size = 20, color = "currentColor", sw = 1.7, fill = "none", style }: {
  d: string; size?: number; color?: string; sw?: number; fill?: string; style?: React.CSSProperties;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d} />
    </svg>
  );
}

export function StatusBar() {
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", flexShrink: 0 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="16" height="11" viewBox="0 0 17 12" fill="var(--text-secondary)">
          <rect x="0" y="5" width="3" height="7" rx="1" opacity=".3" />
          <rect x="4.5" y="3" width="3" height="9" rx="1" opacity=".6" />
          <rect x="9" y="1" width="3" height="11" rx="1" />
          <rect x="13.5" y="1" width="3" height="11" rx="1" opacity=".25" />
        </svg>
        <div style={{ width: 22, height: 11, border: "1.5px solid var(--text-secondary)", borderRadius: 3, display: "flex", alignItems: "center", padding: "1.5px 1.5px" }}>
          <div style={{ width: "72%", height: "100%", background: "var(--text-secondary)", borderRadius: 1.5 }} />
        </div>
      </div>
    </div>
  );
}

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 44, height: 25, borderRadius: 99, flexShrink: 0,
      background: value ? "var(--accent)" : "var(--bg-hover)",
      border: "1px solid var(--border-strong)",
      cursor: "pointer", transition: "background 0.2s", position: "relative"
    }}>
      <div style={{
        position: "absolute", top: 3, left: value ? 22 : 3, width: 17, height: 17,
        borderRadius: "50%", background: value ? "var(--bg-base)" : "var(--text-muted)",
        transition: "left 0.2s"
      }} />
    </div>
  );
}

export function Pill({ label, color = "var(--accent)", bg = "var(--accent-dim)" }: { label: string; color?: string; bg?: string }) {
  return (
    <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, padding: "3px 9px", borderRadius: 99, background: bg, color }}>{label}</span>
  );
}

export function Spinner({ size = 18, color = "var(--accent)" }: { size?: number; color?: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `2px solid ${color}22`, borderTopColor: color,
      animation: "spin 0.7s linear infinite", flexShrink: 0
    }} />
  );
}

export function BottomSheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="sheet-overlay" onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200,
      display: "flex", flexDirection: "column", justifyContent: "flex-end"
    }}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{
        background: "var(--bg-surface)", borderRadius: "24px 24px 0 0",
        padding: "0 0 32px", overflow: "hidden"
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "var(--border-strong)" }} />
        </div>
        {children}
      </div>
    </div>
  );
}

export function UpgradeSheet({ onClose, onUpgrade, feature, requiredPlan = "Unlimited" }: {
  onClose: () => void; onUpgrade: () => void; feature: string; requiredPlan?: string;
}) {
  return (
    <BottomSheet onClose={onClose}>
      <div style={{ padding: "8px 24px 0", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⭐</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.3px" }}>
          Upgrade to {requiredPlan}
        </div>
        <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
          {feature} is available on the {requiredPlan} plan and above.
        </div>
        <button className="press" onClick={onUpgrade} style={{
          width: "100%", height: 52, background: "var(--accent)", border: "none",
          borderRadius: "var(--r-md)", color: "var(--bg-base)", fontSize: 15, fontWeight: 700,
          boxShadow: "0 6px 22px var(--accent-glow)", marginBottom: 10, transition: "transform 0.1s", cursor: "pointer"
        }}>
          See Plans →
        </button>
        <button onClick={onClose} style={{
          width: "100%", height: 44, background: "none", border: "none",
          color: "var(--text-muted)", fontSize: 13, cursor: "pointer"
        }}>Not now</button>
      </div>
    </BottomSheet>
  );
}

export function DeleteSheet({ title, body, confirmLabel = "Delete", onClose, onConfirm, danger = true }: {
  title: string; body: string; confirmLabel?: string;
  onClose: () => void; onConfirm: () => void; danger?: boolean;
}) {
  return (
    <BottomSheet onClose={onClose}>
      <div style={{ padding: "8px 24px 0" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 16, background: danger ? "var(--red-dim)" : "var(--accent-dim)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "8px auto 16px"
        }}>
          <Ic d={danger
            ? "M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"
            : "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"}
            size={22} color={danger ? "var(--red)" : "var(--accent)"} sw={2} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, textAlign: "center" }}>{title}</div>
        <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24, textAlign: "center" }}>{body}</div>
        <button className="press" onClick={onConfirm} style={{
          width: "100%", height: 52, background: danger ? "var(--red)" : "var(--accent)",
          border: "none", borderRadius: "var(--r-md)", color: "#fff",
          fontSize: 15, fontWeight: 700, marginBottom: 10, transition: "transform 0.1s", cursor: "pointer"
        }}>
          {confirmLabel}
        </button>
        <button onClick={onClose} style={{
          width: "100%", height: 44, background: "none", border: "none",
          color: "var(--text-muted)", fontSize: 13, cursor: "pointer"
        }}>Cancel</button>
      </div>
    </BottomSheet>
  );
}
