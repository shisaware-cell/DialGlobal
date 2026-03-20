// src/components/TabBar.jsx
// FAB (+) is only rendered when screen === "home"
import React from "react";
import { Ic } from "./UI";
import { useApp } from "../context/AppContext";

export default function TabBar() {
  const { screen, navigate } = useApp();

  const tabs = [
    { id:"home",     label:"Numbers",  d:"M9 12h6M9 16h4M13 4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9zM13 4v5h5" },
    { id:"inbox",    label:"Inbox",    d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
    { id:"_fab",     label:"",         d:"" },
    { id:"calls",    label:"Calls",    d:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.4 1.14 2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z" },
    { id:"settings", label:"Settings", d:"M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
  ];

  const isHome = screen === "home";

  return (
    <div style={{height:80,background:"var(--bg-surface)",borderTop:"1px solid var(--border)",
      display:"flex",alignItems:"center",justifyContent:"space-around",
      padding:"0 4px 14px",flexShrink:0,position:"relative"}}>

      {/* FAB — only visible on home/Numbers screen */}
      {isHome && (
        <div style={{position:"absolute",top:-24,left:"50%",transform:"translateX(-50%)",zIndex:10}}>
          <div style={{position:"relative",width:52,height:52}}>
            <div className="fab-ring"/>
            <div className="fab-ring2"/>
            <button className="fab-btn" onClick={() => navigate("picker")} style={{
              width:52,height:52,borderRadius:"50%",background:"var(--accent)",
              border:"3px solid var(--bg-base)",display:"flex",alignItems:"center",
              justifyContent:"center",boxShadow:"0 4px 18px var(--accent-glow)",
              cursor:"pointer",position:"relative",zIndex:1}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="var(--bg-base)" strokeWidth="2.8" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {tabs.map(t => {
        if (t.id === "_fab") return <div key="_fab" style={{flex:1}}/>;
        const on = screen === t.id;
        return (
          <button key={t.id} onClick={() => navigate(t.id)} style={{
            flex:1,background:"none",border:"none",cursor:"pointer",
            display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 6px"}}>
            <Ic d={t.d} size={21} color={on ? "var(--accent)" : "var(--text-muted)"} sw={on ? 2 : 1.6}/>
            <span style={{fontSize:10,color:on?"var(--accent)":"var(--text-muted)",
              fontWeight:on?600:400,transition:"color 0.15s"}}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
