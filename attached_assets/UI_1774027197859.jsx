// src/components/UI.jsx
import React from "react";

export function Ic({ d, size=20, color="currentColor", sw=1.7, fill="none", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d}/>
    </svg>
  );
}

export function StatusBar() {
  return (
    <div style={{height:44,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 26px",flexShrink:0}}>
      <span style={{fontSize:14,fontWeight:600,color:"var(--text-primary)",letterSpacing:"-0.3px"}}>9:41</span>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <svg width="16" height="11" viewBox="0 0 17 12" fill="var(--text-secondary)">
          <rect x="0" y="5" width="3" height="7" rx="1" opacity=".3"/>
          <rect x="4.5" y="3" width="3" height="9" rx="1" opacity=".6"/>
          <rect x="9" y="1" width="3" height="11" rx="1"/>
          <rect x="13.5" y="1" width="3" height="11" rx="1" opacity=".25"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 16 12" fill="var(--text-secondary)">
          <path d="M8 2.4C10.8 2.4 13.3 3.6 15 5.6L16 4.4C14 2.1 11.2.8 8 .8S2 2.1 0 4.4l1 1.2C2.7 3.6 5.2 2.4 8 2.4z" opacity=".3"/>
          <path d="M8 5.2c1.9 0 3.6.8 4.8 2.1l1-1.2C12.3 4.3 10.3 3.6 8 3.6S3.7 4.3 2.2 6.1l1 1.2C4.4 6 6.1 5.2 8 5.2z" opacity=".65"/>
          <path d="M8 8c1 0 1.9.4 2.5 1.1L11.6 8C10.6 6.8 9.4 6.4 8 6.4S5.4 6.8 4.4 8l1.1 1.1C6.1 8.4 7 8 8 8z"/>
          <circle cx="8" cy="11" r="1"/>
        </svg>
        <div style={{width:22,height:11,border:"1.5px solid var(--text-secondary)",borderRadius:3,display:"flex",alignItems:"center",padding:"1.5px 1.5px"}}>
          <div style={{width:"72%",height:"100%",background:"var(--text-secondary)",borderRadius:1.5}}/>
        </div>
      </div>
    </div>
  );
}

export function DynamicIsland() {
  return (
    <div style={{position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",width:118,height:33,
      background:"#1A1714",borderRadius:24,zIndex:30,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
      <div style={{width:11,height:11,borderRadius:"50%",background:"#2a2420",border:"2.5px solid #322e28"}}/>
      <div style={{width:7,height:7,borderRadius:"50%",background:"#2a2420"}}/>
    </div>
  );
}

export function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{width:44,height:25,borderRadius:99,flexShrink:0,
      background:value?"var(--accent)":"var(--bg-hover)",border:"1px solid var(--border-strong)",
      cursor:"pointer",transition:"background 0.2s",position:"relative"}}>
      <div style={{position:"absolute",top:3,left:value?22:3,width:17,height:17,borderRadius:"50%",
        background:value?"var(--bg-base)":"var(--text-muted)",transition:"left 0.2s"}}/>
    </div>
  );
}

export function Pill({ label, color="var(--accent)", bg="var(--accent-dim)" }) {
  return (
    <span style={{fontSize:9.5,fontWeight:700,letterSpacing:0.4,padding:"3px 9px",
      borderRadius:99,background:bg,color}}>{label}</span>
  );
}

export function Spinner({ size=18, color="var(--accent)" }) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",border:`2px solid ${color}22`,
      borderTopColor:color,animation:"spin 0.7s linear infinite",flexShrink:0}}/>
  );
}

// Bottom sheet with overlay
export function BottomSheet({ children, onClose }) {
  return (
    <div className="sheet-overlay" onClick={onClose} style={{position:"absolute",inset:0,
      background:"rgba(0,0,0,0.45)",zIndex:100,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div className="bottom-sheet" onClick={e=>e.stopPropagation()} style={{background:"var(--bg-surface)",
        borderRadius:"24px 24px 0 0",padding:"0 0 32px",overflow:"hidden"}}>
        {/* Handle */}
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}>
          <div style={{width:36,height:4,borderRadius:99,background:"var(--border-strong)"}}/>
        </div>
        {children}
      </div>
    </div>
  );
}

// Upgrade prompt shown when a locked feature is tapped
export function UpgradeSheet({ onClose, onUpgrade, feature, requiredPlan="Unlimited" }) {
  return (
    <BottomSheet onClose={onClose}>
      <div style={{padding:"8px 24px 0",textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:12}}>⭐</div>
        <div style={{fontSize:18,fontWeight:700,color:"var(--text-primary)",marginBottom:8,letterSpacing:"-0.3px"}}>
          Upgrade to {requiredPlan}
        </div>
        <div style={{fontSize:13.5,color:"var(--text-secondary)",lineHeight:1.6,marginBottom:24}}>
          {feature} is available on the {requiredPlan} plan and above.
        </div>
        <button className="press" onClick={onUpgrade} style={{width:"100%",height:52,background:"var(--accent)",border:"none",
          borderRadius:"var(--r-md)",color:"var(--bg-base)",fontSize:15,fontWeight:700,
          boxShadow:"0 6px 22px var(--accent-glow)",marginBottom:10,transition:"transform 0.1s"}}>
          See Plans →
        </button>
        <button onClick={onClose} style={{width:"100%",height:44,background:"none",border:"none",
          color:"var(--text-muted)",fontSize:13}}>Not now</button>
      </div>
    </BottomSheet>
  );
}

// Delete / danger confirmation sheet
export function DeleteSheet({ title, body, confirmLabel="Delete", onClose, onConfirm }) {
  return (
    <BottomSheet onClose={onClose}>
      <div style={{padding:"8px 24px 0"}}>
        <div style={{width:48,height:48,borderRadius:16,background:"var(--red-dim)",
          display:"flex",alignItems:"center",justifyContent:"center",margin:"8px auto 16px"}}>
          <Ic d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" size={22} color="var(--red)" sw={2}/>
        </div>
        <div style={{fontSize:17,fontWeight:700,color:"var(--text-primary)",marginBottom:8,textAlign:"center"}}>{title}</div>
        <div style={{fontSize:13.5,color:"var(--text-secondary)",lineHeight:1.6,marginBottom:24,textAlign:"center"}}>{body}</div>
        <button className="press" onClick={onConfirm} style={{width:"100%",height:52,background:"var(--red)",border:"none",
          borderRadius:"var(--r-md)",color:"#fff",fontSize:15,fontWeight:700,marginBottom:10,transition:"transform 0.1s"}}>
          {confirmLabel}
        </button>
        <button onClick={onClose} style={{width:"100%",height:44,background:"none",border:"none",
          color:"var(--text-muted)",fontSize:13}}>Cancel</button>
      </div>
    </BottomSheet>
  );
}
