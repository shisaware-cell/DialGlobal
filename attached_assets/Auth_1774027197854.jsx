// src/screens/Auth.jsx
import React, { useState } from "react";
import { Spinner } from "../components/UI";
import { useApp } from "../context/AppContext";

export default function Auth() {
  const { navigate } = useApp();
  const [mode, setMode]     = useState("login");
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [name, setName]     = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState("");

  const submit = () => {
    if (!email || !pass || (mode === "signup" && !name)) { setErr("Please fill in all fields."); return; }
    setErr(""); setLoading(true);
    // TODO: call login() or signup() from api.js
    setTimeout(() => { setLoading(false); navigate("home"); }, 1400);
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"var(--bg-base)",overflow:"hidden"}}>
      <div style={{height:180,background:"radial-gradient(ellipse at 50% 0%, #FDE9C0 0%, var(--bg-base) 80%)",
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <div style={{width:56,height:56,borderRadius:16,background:"var(--accent)",display:"flex",
          alignItems:"center",justifyContent:"center",marginBottom:10,boxShadow:"0 8px 28px var(--accent-glow)"}}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--bg-base)" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
        </div>
        <div style={{fontSize:20,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.4px"}}>DialGlobal</div>
        <div style={{fontSize:12,color:"var(--text-muted)",marginTop:3}}>Virtual numbers for the world</div>
      </div>

      <div style={{flex:1,background:"var(--bg-surface)",borderRadius:"28px 28px 0 0",
        padding:"24px 24px 36px",borderTop:"1px solid var(--border)",overflowY:"auto"}}>
        <div style={{display:"flex",background:"var(--bg-raised)",borderRadius:"var(--r-md)",padding:3,marginBottom:22}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,height:36,borderRadius:11,border:"none",
              background:mode===m?"var(--bg-surface)":"transparent",
              color:mode===m?"var(--text-primary)":"var(--text-muted)",
              fontSize:13,fontWeight:mode===m?600:400,transition:"all 0.2s",
              boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>
              {m==="login"?"Log In":"Sign Up"}
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="signup"&&(
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"var(--text-muted)",marginBottom:6,letterSpacing:0.5}}>FULL NAME</div>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"
                style={{width:"100%",height:48,borderRadius:"var(--r-md)",border:"1.5px solid var(--border)",
                  background:"var(--bg-input)",padding:"0 14px",fontSize:14,color:"var(--text-primary)",outline:"none"}}/>
            </div>
          )}
          <div>
            <div style={{fontSize:11,fontWeight:600,color:"var(--text-muted)",marginBottom:6,letterSpacing:0.5}}>EMAIL</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" type="email"
              style={{width:"100%",height:48,borderRadius:"var(--r-md)",border:"1.5px solid var(--border)",
                background:"var(--bg-input)",padding:"0 14px",fontSize:14,color:"var(--text-primary)",outline:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:"var(--text-muted)",marginBottom:6,letterSpacing:0.5}}>PASSWORD</div>
            <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" type="password"
              style={{width:"100%",height:48,borderRadius:"var(--r-md)",border:"1.5px solid var(--border)",
                background:"var(--bg-input)",padding:"0 14px",fontSize:14,color:"var(--text-primary)",outline:"none"}}/>
          </div>
        </div>

        {err && <div style={{marginTop:12,fontSize:12,color:"var(--red)",background:"var(--red-dim)",
          borderRadius:"var(--r-sm)",padding:"9px 13px"}}>{err}</div>}

        {mode==="login" && (
          <div style={{textAlign:"right",marginTop:8}}>
            <button style={{fontSize:12,color:"var(--accent)",background:"none",border:"none",fontWeight:500}}>
              Forgot password?
            </button>
          </div>
        )}

        <button className="press" onClick={submit} disabled={loading} style={{width:"100%",height:52,
          background:"var(--accent)",border:"none",borderRadius:"var(--r-md)",color:"var(--bg-base)",
          fontSize:15,fontWeight:700,marginTop:22,display:"flex",alignItems:"center",justifyContent:"center",gap:10,
          boxShadow:"0 6px 22px var(--accent-glow)",transition:"transform 0.1s"}}>
          {loading ? <><Spinner color="var(--bg-base)"/>{mode==="login"?"Signing in…":"Creating account…"}</> :
            mode==="login" ? "Log In →" : "Create Account →"}
        </button>

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0"}}>
          <div style={{flex:1,height:1,background:"var(--border)"}}/>
          <span style={{fontSize:11,color:"var(--text-muted)"}}>or continue with</span>
          <div style={{flex:1,height:1,background:"var(--border)"}}/>
        </div>

        <div style={{display:"flex",gap:10}}>
          {["Google","Apple"].map(s=>(
            <button key={s} className="press" style={{flex:1,height:46,background:"var(--bg-raised)",
              border:"1px solid var(--border)",borderRadius:"var(--r-md)",color:"var(--text-secondary)",
              fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              transition:"transform 0.1s"}}>
              {s}
            </button>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:18,fontSize:11,color:"var(--text-muted)"}}>
          By continuing you agree to our <span style={{color:"var(--accent)"}}>Terms</span> &amp; <span style={{color:"var(--accent)"}}>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}
