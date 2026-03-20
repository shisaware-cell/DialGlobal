import { useState, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; font-family: 'Sora', system-ui, sans-serif; }

  :root {
    /* ── Warm light surfaces ── */
    --bg-base:    #F5F3EF;
    --bg-surface: #FFFFFF;
    --bg-raised:  #EEECE8;
    --bg-hover:   #E8E5E0;
    --bg-input:   #F0EDE8;
    --border:       rgba(0,0,0,0.08);
    --border-strong: rgba(0,0,0,0.14);

    /* ── Text ── */
    --text-primary:   #1A1714;
    --text-secondary: #6B6560;
    --text-muted:     #A09890;

    /* ── Amber-gold accent — unchanged ── */
    --accent:       #E8A020;
    --accent-dim:   rgba(232,160,32,0.13);
    --accent-glow:  rgba(232,160,32,0.28);

    /* ── Semantic ── */
    --green:       #16A34A;
    --green-dim:   rgba(22,163,74,0.1);
    --red:         #DC2626;
    --red-dim:     rgba(220,38,38,0.08);
    --blue:        #2563EB;
    --blue-dim:    rgba(37,99,235,0.09);

    --font-mono: 'Fira Code', monospace;
    --r-sm: 8px; --r-md: 14px; --r-lg: 20px;
  }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0}to{opacity:1} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)} }
  @keyframes slideUp  { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
  @keyframes float    { 0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1}50%{opacity:0.3} }
  @keyframes pop      { 0%{transform:scale(0.5);opacity:0}65%{transform:scale(1.1)}100%{transform:scale(1);opacity:1} }

  .press { transition: transform 0.1s ease; }
  .press:active { transform: scale(0.95) !important; }
  .fade-up  { animation: fadeUp  0.4s ease both; }
  .fade-in  { animation: fadeIn  0.3s ease both; }
  .scale-in { animation: scaleIn 0.3s ease both; }
  .slide-up { animation: slideUp 0.35s ease both; }
`;

/* ─── DATA ───────────────────────────────────────────────────── */
const COUNTRIES = [
  {code:"US",name:"United States", flag:"🇺🇸",prefix:"+1", price:1.0,instant:true, popular:true},
  {code:"GB",name:"United Kingdom",flag:"🇬🇧",prefix:"+44",price:1.0,instant:true, popular:true},
  {code:"CA",name:"Canada",        flag:"🇨🇦",prefix:"+1", price:1.0,instant:true, popular:true},
  {code:"AU",name:"Australia",     flag:"🇦🇺",prefix:"+61",price:1.5,instant:true, popular:true},
  {code:"DE",name:"Germany",       flag:"🇩🇪",prefix:"+49",price:2.0,instant:true, popular:false},
  {code:"FR",name:"France",        flag:"🇫🇷",prefix:"+33",price:2.0,instant:true, popular:false},
  {code:"NL",name:"Netherlands",   flag:"🇳🇱",prefix:"+31",price:1.5,instant:true, popular:false},
  {code:"SG",name:"Singapore",     flag:"🇸🇬",prefix:"+65",price:2.5,instant:true, popular:false},
  {code:"JP",name:"Japan",         flag:"🇯🇵",prefix:"+81",price:3.0,instant:false,popular:false},
  {code:"ZA",name:"South Africa",  flag:"🇿🇦",prefix:"+27",price:2.0,instant:false,popular:false},
  {code:"SE",name:"Sweden",        flag:"🇸🇪",prefix:"+46",price:1.5,instant:true, popular:false},
  {code:"NZ",name:"New Zealand",   flag:"🇳🇿",prefix:"+64",price:2.0,instant:true, popular:false},
];
const NUMBERS = [
  {id:1,number:"+1 (415) 823-4921",country:"United States", flag:"🇺🇸",type:"permanent",calls:12,sms:47,plan:"Pro",    missedCalls:2,lastActivity:"2m ago"},
  {id:2,number:"+44 7700 123 456", country:"United Kingdom",flag:"🇬🇧",type:"temporary",calls:3, sms:8, plan:"Starter",missedCalls:0,lastActivity:"1h ago",expiresIn:"5 days"},
];
const MESSAGES = [
  {id:1,name:"Marcus Webb",  number:"+1 917 555 0134", preview:"Hey, are you free for a call tomorrow?",       time:"2m", unread:2,flag:"🇺🇸",type:"sms"},
  {id:2,name:"Priya Sharma", number:"+44 7900 112233", preview:"The contract has been sent to your email",      time:"14m",unread:0,flag:"🇬🇧",type:"sms"},
  {id:3,name:"Unknown",      number:"+1 650 555 7823", preview:"Missed call",                                   time:"1h", unread:1,flag:"🇺🇸",type:"missed"},
  {id:4,name:"David Chen",   number:"+61 4 1234 5678", preview:"Thanks for getting back to me!",               time:"3h", unread:0,flag:"🇦🇺",type:"sms"},
  {id:5,name:"Sarah Miller", number:"+49 30 1234567",  preview:"Voicemail: 0:42",                              time:"1d", unread:0,flag:"🇩🇪",type:"voicemail"},
];
const CALLS = [
  {id:1,name:"Marcus Webb",  number:"+1 917 555 0134", flag:"🇺🇸",type:"incoming", duration:"4:32", time:"2m ago"},
  {id:2,name:"Priya Sharma", number:"+44 7900 112233", flag:"🇬🇧",type:"outgoing", duration:"12:05",time:"1h ago"},
  {id:3,name:"Unknown",      number:"+1 650 555 7823", flag:"🇺🇸",type:"missed",   duration:"",     time:"2h ago"},
  {id:4,name:"David Chen",   number:"+61 4 1234 5678", flag:"🇦🇺",type:"outgoing", duration:"1:44", time:"Yesterday"},
  {id:5,name:"Sarah Miller", number:"+49 30 1234567",  flag:"🇩🇪",type:"voicemail",duration:"0:42", time:"Yesterday"},
];
function genNum(prefix){
  const a=Math.floor(Math.random()*900+100),b=Math.floor(Math.random()*900+100),c=Math.floor(Math.random()*9000+1000);
  if(prefix==="+1")  return `${prefix} (${a}) ${b}-${c}`;
  if(prefix==="+44") return `${prefix} 7${a} ${b} ${c}`;
  return `${prefix} ${a} ${b} ${c}`;
}

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
function Ic({d,size=20,color="currentColor",sw=1.7,fill="none",style}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}><path d={d}/></svg>);
}
function Spinner({size=18,color="var(--accent)"}){
  return <div style={{width:size,height:size,borderRadius:"50%",border:`2px solid ${color}22`,borderTopColor:color,animation:"spin 0.7s linear infinite",flexShrink:0}}/>;
}
function Toggle({value,onChange}){
  return(
    <div onClick={()=>onChange(!value)} style={{width:44,height:25,borderRadius:99,flexShrink:0,background:value?"var(--accent)":"var(--bg-hover)",border:"1px solid var(--border-strong)",cursor:"pointer",transition:"background 0.2s",position:"relative"}}>
      <div style={{position:"absolute",top:3,left:value?22:3,width:17,height:17,borderRadius:"50%",background:value?"var(--bg-base)":"var(--text-muted)",transition:"left 0.2s"}}/>
    </div>
  );
}
function Pill({label,color="var(--accent)",bg="var(--accent-dim)"}){
  return <span style={{fontSize:9.5,fontWeight:700,letterSpacing:0.4,padding:"3px 9px",borderRadius:99,background:bg,color}}>{label}</span>;
}
function SB(){
  return(
    <div style={{height:44,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 26px",flexShrink:0}}>
      <span style={{fontSize:14,fontWeight:600,color:"var(--text-primary)",letterSpacing:"-0.3px"}}>9:41</span>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <svg width="16" height="11" viewBox="0 0 17 12" fill="var(--text-secondary)"><rect x="0" y="5" width="3" height="7" rx="1" opacity=".3"/><rect x="4.5" y="3" width="3" height="9" rx="1" opacity=".6"/><rect x="9" y="1" width="3" height="11" rx="1"/><rect x="13.5" y="1" width="3" height="11" rx="1" opacity=".25"/></svg>
        <svg width="15" height="11" viewBox="0 0 16 12" fill="var(--text-secondary)"><path d="M8 2.4C10.8 2.4 13.3 3.6 15 5.6L16 4.4C14 2.1 11.2.8 8 .8S2 2.1 0 4.4l1 1.2C2.7 3.6 5.2 2.4 8 2.4z" opacity=".3"/><path d="M8 5.2c1.9 0 3.6.8 4.8 2.1l1-1.2C12.3 4.3 10.3 3.6 8 3.6S3.7 4.3 2.2 6.1l1 1.2C4.4 6 6.1 5.2 8 5.2z" opacity=".65"/><path d="M8 8c1 0 1.9.4 2.5 1.1L11.6 8C10.6 6.8 9.4 6.4 8 6.4S5.4 6.8 4.4 8l1.1 1.1C6.1 8.4 7 8 8 8z"/><circle cx="8" cy="11" r="1"/></svg>
        <div style={{width:22,height:11,border:"1.5px solid var(--text-secondary)",borderRadius:3,display:"flex",alignItems:"center",padding:"1.5px 1.5px"}}><div style={{width:"72%",height:"100%",background:"var(--text-secondary)",borderRadius:1.5}}/></div>
      </div>
    </div>
  );
}
function DI(){
  return <div style={{position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",width:118,height:33,background:"#1A1714",borderRadius:24,zIndex:30,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}><div style={{width:11,height:11,borderRadius:"50%",background:"#2a2420",border:"2.5px solid #322e28"}}/><div style={{width:7,height:7,borderRadius:"50%",background:"#2a2420"}}/></div>;
}
function TabBar({active,setScreen}){
  const tabs=[
    {id:"home",    label:"Numbers", d:"M9 12h6M9 16h4M13 4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9zM13 4v5h5"},
    {id:"inbox",   label:"Inbox",   d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"},
    {id:"_fab",    label:"",        d:""},
    {id:"calls",   label:"Calls",   d:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.4 1.14 2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"},
    {id:"settings",label:"Settings",d:"M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"},
  ];
  return(
    <div style={{height:80,background:"var(--bg-surface)",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-around",padding:"0 4px 14px",flexShrink:0,position:"relative"}}>
      <style>{`
        @keyframes fabRipple {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fabBounce {
          0%,100% { transform: translateY(0) scale(1); }
          30%      { transform: translateY(-4px) scale(1.06); }
          60%      { transform: translateY(-1px) scale(0.98); }
        }
        .fab-btn { animation: fabBounce 2.8s ease-in-out infinite; }
        .fab-btn:hover { animation: none !important; transform: scale(1.12) rotate(90deg) !important; transition: transform 0.22s cubic-bezier(.34,1.56,.64,1) !important; }
        .fab-btn:active { transform: scale(0.93) rotate(90deg) !important; }
        .fab-ring {
          position: absolute; inset: -6px; border-radius: 50%;
          border: 2px solid var(--accent);
          animation: fabRipple 2s ease-out infinite;
          pointer-events: none;
        }
        .fab-ring2 {
          position: absolute; inset: -6px; border-radius: 50%;
          border: 2px solid var(--accent);
          animation: fabRipple 2s ease-out 0.7s infinite;
          pointer-events: none;
        }
      `}</style>
      <div style={{position:"absolute",top:-24,left:"50%",transform:"translateX(-50%)",zIndex:10}}>
        <div style={{position:"relative",width:52,height:52}}>
          <div className="fab-ring"/>
          <div className="fab-ring2"/>
          <button className="fab-btn" onClick={()=>setScreen("picker")} style={{width:52,height:52,borderRadius:"50%",background:"var(--accent)",border:"3px solid var(--bg-base)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 18px var(--accent-glow)",cursor:"pointer",position:"relative",zIndex:1}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bg-base)" strokeWidth="2.8" strokeLinecap="round" style={{transition:"transform 0.22s cubic-bezier(.34,1.56,.64,1)"}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
      {tabs.map(t=>{
        if(t.id==="_fab") return <div key="_fab" style={{flex:1}}/>;
        const on=active===t.id;
        return(
          <button key={t.id} onClick={()=>setScreen(t.id)} style={{flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 6px",transition:"opacity 0.15s"}}>
            <Ic d={t.d} size={21} color={on?"var(--accent)":"var(--text-muted)"} sw={on?2:1.6}/>
            <span style={{fontSize:10,color:on?"var(--accent)":"var(--text-muted)",fontWeight:on?600:400,transition:"color 0.15s"}}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── ONBOARDING ─────────────────────────────────────────────── */
function Onboarding({onDone}){
  const [step,setStep]=useState(0);
  const slides=[
    {
      tag:"100+ COUNTRIES", title:"Your number,\nanywhere.",
      sub:"Real local phone numbers in over 100 countries. Receive calls and texts like a local.",
      bg:"radial-gradient(ellipse at 60% 30%, #FDE9C0 0%, var(--bg-base) 80%)",
      visual:(
        <div style={{position:"relative",width:250,height:220,margin:"0 auto"}}>
          <div style={{width:160,height:160,borderRadius:"50%",background:"conic-gradient(from 0deg,#e8a02018,#e8a02008,#e8a02020,#e8a0200a)",border:"1.5px solid #e8a02030",position:"absolute",top:30,left:45,boxShadow:"0 0 40px var(--accent-glow)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {[30,50,70].map((y,i)=><div key={i} style={{position:"absolute",left:"10%",right:"10%",top:`${y}%`,height:1,background:"#e8a02020"}}/>)}
            {[35,55,75].map((x,i)=><div key={i} style={{position:"absolute",top:"10%",bottom:"10%",left:`${x}%`,width:1,background:"#e8a02020"}}/>)}
          </div>
          {[{flag:"🇺🇸",s:{top:5,left:-5},  delay:"0s",  dur:"2.2s"},
            {flag:"🇬🇧",s:{top:0,right:0},  delay:"0.4s",dur:"2.6s"},
            {flag:"🇯🇵",s:{bottom:40,left:5},delay:"0.8s",dur:"2.4s"},
            {flag:"🇦🇺",s:{bottom:10,right:10},delay:"0.2s",dur:"2.8s"},
          ].map((f,i)=>(
            <div key={i} style={{position:"absolute",...f.s,background:"var(--bg-raised)",border:"1px solid var(--border-strong)",borderRadius:16,padding:"5px 10px",fontSize:18,animation:`float ${f.dur} ease-in-out infinite`,animationDelay:f.delay,boxShadow:"0 4px 16px rgba(0,0,0,0.4)"}}>{f.flag}</div>
          ))}
        </div>
      )
    },
    {
      tag:"ALL IN ONE PLACE", title:"One app.\nEvery number.",
      sub:"Manage virtual numbers, calls, and messages in a single clean dashboard.",
      bg:"radial-gradient(ellipse at 40% 30%, #C8EDD8 0%, var(--bg-base) 80%)",
      visual:(
        <div style={{width:200,margin:"0 auto",background:"var(--bg-surface)",borderRadius:20,border:"1px solid var(--border-strong)",overflow:"hidden"}}>
          <div style={{height:30,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:9,fontWeight:700,letterSpacing:2,color:"var(--bg-base)"}}>DIALGLOBAL</span>
          </div>
          {[{n:"🇺🇸  +1 (415) 823-4921",a:true},{n:"🇬🇧  +44 7700 123 456",a:false},{n:"🇦🇺  +61 4 1234 5678",a:false}].map((item,i)=>(
            <div key={i} style={{margin:"6px 10px",padding:"9px 10px",background:item.a?"var(--accent-dim)":"var(--bg-raised)",borderRadius:9,fontSize:9,fontWeight:600,color:item.a?"var(--accent)":"var(--text-secondary)",borderLeft:`2.5px solid ${item.a?"var(--accent)":"transparent"}`}}>{item.n}</div>
          ))}
          <div style={{margin:"8px 10px 10px",padding:"7px 10px",background:"var(--green-dim)",borderRadius:9,display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",animation:"pulse 1.5s ease infinite"}}/>
            <span style={{fontSize:8.5,fontWeight:700,color:"var(--green)"}}>3 active numbers</span>
          </div>
        </div>
      )
    },
    {
      tag:"PRIVACY FIRST", title:"Private,\nsecure, yours.",
      sub:"Your real number stays hidden. Every call encrypted. Identity verified on your terms.",
      bg:"radial-gradient(ellipse at 50% 30%, #DDEAFC 0%, var(--bg-base) 80%)",
      visual:(
        <div style={{position:"relative",width:220,height:200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:130,height:130,borderRadius:"50%",background:"var(--bg-surface)",border:"1.5px solid var(--border-strong)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 40px var(--blue-dim)"}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.3" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          {[{txt:"🔒 Encrypted",c:"var(--accent)",s:{top:20,left:5}},{txt:"✓ Verified",c:"var(--green)",s:{top:60,right:0}},{txt:"🚫 No spam",c:"var(--red)",s:{bottom:36,left:10}},{txt:"👁 Private",c:"var(--blue)",s:{bottom:10,right:10}}].map((b,i)=>(
            <div key={i} style={{position:"absolute",...b.s,background:"var(--bg-raised)",border:"1px solid var(--border-strong)",borderRadius:14,padding:"5px 10px",fontSize:9.5,fontWeight:700,color:b.c,boxShadow:"0 3px 12px rgba(0,0,0,0.3)",whiteSpace:"nowrap"}}>{b.txt}</div>
          ))}
        </div>
      )
    }
  ];
  const sl=slides[step];
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:sl.bg,transition:"background 0.6s ease"}}>
      <SB/>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"0 22px 4px"}}>
        {step<slides.length-1&&<button onClick={onDone} style={{background:"none",border:"none",fontSize:13,color:"var(--text-muted)",fontWeight:500}}>Skip</button>}
      </div>
      <div key={`v${step}`} className="fade-up" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"10px 24px"}}>{sl.visual}</div>
      <div style={{background:"var(--bg-surface)",borderRadius:"28px 28px 0 0",padding:"28px 26px 36px",borderTop:"1px solid var(--border)"}}>
        <div key={`c${step}`} className="fade-up">
          <div style={{display:"inline-flex",alignItems:"center",background:"var(--accent-dim)",color:"var(--accent)",fontSize:9.5,fontWeight:700,letterSpacing:1.6,padding:"4px 11px",borderRadius:99,marginBottom:14}}>{sl.tag}</div>
          <h1 style={{fontSize:30,fontWeight:700,color:"var(--text-primary)",lineHeight:1.18,marginBottom:10,letterSpacing:"-0.6px",whiteSpace:"pre-line"}}>{sl.title}</h1>
          <p style={{fontSize:13.5,color:"var(--text-secondary)",lineHeight:1.7,marginBottom:28}}>{sl.sub}</p>
        </div>
        <div style={{display:"flex",gap:5,marginBottom:20,alignItems:"center"}}>
          {slides.map((_,i)=><div key={i} style={{height:3,borderRadius:99,background:i===step?"var(--accent)":"var(--bg-hover)",width:i===step?24:7,transition:"all 0.35s ease"}}/>)}
        </div>
        <button className="press" onClick={()=>step<slides.length-1?setStep(s=>s+1):onDone()} style={{width:"100%",height:54,background:"var(--accent)",border:"none",borderRadius:"var(--r-md)",color:"var(--bg-base)",fontSize:15,fontWeight:700,boxShadow:"0 6px 22px var(--accent-glow)",transition:"transform 0.1s"}}>
          {step===slides.length-1?"Get Started — It's Free →":"Continue →"}
        </button>
        {step===0&&<button onClick={onDone} style={{width:"100%",height:40,background:"none",border:"none",color:"var(--text-muted)",fontSize:13,marginTop:4}}>Already have an account · Log in</button>}
      </div>
    </div>
  );
}

/* ─── NUMBER ROW (flat list, no cards) ───────────────────────── */
function NumberRow({num,i,setScreen}){
  const [open,setOpen]=useState(false);
  return(
    <div className="fade-up" style={{animationDelay:`${i*0.07}s`}}>
      {/* Main row */}
      <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:13,padding:"13px 20px",cursor:"pointer",background:"var(--bg-surface)",transition:"background 0.12s"}}
        onMouseEnter={e=>e.currentTarget.style.background="var(--bg-raised)"}
        onMouseLeave={e=>e.currentTarget.style.background="var(--bg-surface)"}>
        {/* Flag avatar */}
        <div style={{width:42,height:42,borderRadius:13,background:"var(--bg-raised)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0,position:"relative"}}>
          {num.flag}
          {/* Active pulse dot */}
          <div style={{position:"absolute",bottom:1,right:1,width:9,height:9,borderRadius:"50%",background:"var(--green)",border:"2px solid var(--bg-surface)"}}/>
        </div>
        {/* Number + country */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:600,color:"var(--text-primary)",letterSpacing:"-0.3px",fontFamily:"var(--font-mono)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{num.number}</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
            <span style={{fontSize:11,color:"var(--text-secondary)"}}>{num.country}</span>
            <span style={{width:3,height:3,borderRadius:"50%",background:"var(--border-strong)",flexShrink:0,display:"inline-block"}}/>
            <span style={{fontSize:10.5,color:num.type==="permanent"?"var(--accent)":"var(--green)",fontWeight:600}}>{num.type==="permanent"?"Permanent":`⏱ ${num.expiresIn}`}</span>
          </div>
        </div>
        {/* Right side: stats + chevron */}
        <div style={{display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
          <div style={{textAlign:"right"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:"var(--text-muted)"}}>{num.calls} calls</span>
              <span style={{fontSize:11,color:"var(--text-muted)"}}>{num.sms} msg</span>
            </div>
            {num.missedCalls>0&&(
              <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4,marginTop:2}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"var(--red)",animation:"pulse 1.5s ease infinite"}}/>
                <span style={{fontSize:10.5,color:"var(--red)",fontWeight:700}}>{num.missedCalls} missed</span>
              </div>
            )}
          </div>
          <Ic d={open?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"} size={15} color="var(--text-muted)" sw={2.2}/>
        </div>
      </div>

      {/* Expanded inline actions */}
      {open&&(
        <div className="fade-up" style={{background:"var(--bg-raised)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",padding:"12px 20px",display:"flex",gap:8}}>
          <button className="press" style={{flex:1,height:36,background:"var(--accent)",border:"none",borderRadius:"var(--r-sm)",color:"var(--bg-base)",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5,boxShadow:"0 2px 8px var(--accent-glow)",transition:"transform 0.1s"}}>
            <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" size={12} color="var(--bg-base)" sw={2.5}/> Call
          </button>
          <button className="press" onClick={()=>setScreen("inbox")} style={{flex:1,height:36,background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",color:"var(--text-secondary)",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"transform 0.1s"}}>
            <Ic d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" size={12} color="var(--text-secondary)"/> Message
          </button>
          <button className="press" onClick={()=>setScreen("numdetail")} style={{width:36,height:36,background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.1s"}}>
            <Ic d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" size={13} color="var(--text-muted)" sw={2}/>
          </button>
        </div>
      )}

      {/* Divider between rows */}
      <div style={{height:1,background:"var(--border)",margin:"0 20px"}}/>
    </div>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────── */
function Dashboard({setScreen}){
  return(
    <div style={{flex:1,overflowY:"auto",background:"var(--bg-base)"}}>
      {/* Header */}
      <div style={{background:"var(--bg-surface)",padding:"6px 20px 20px",borderBottom:"1px solid var(--border)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div>
            <p style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:1.5,margin:0}}>GOOD MORNING</p>
            <h2 style={{fontSize:24,fontWeight:700,color:"var(--text-primary)",margin:"3px 0 0",letterSpacing:"-0.5px"}}>Vusi Hal 👋</h2>
          </div>
          <div style={{display:"flex",gap:9,alignItems:"center"}}>
            <button style={{width:40,height:40,borderRadius:"var(--r-md)",background:"var(--bg-raised)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <Ic d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" size={17} color="var(--text-secondary)"/>
              <div style={{position:"absolute",top:7,right:7,width:8,height:8,borderRadius:"50%",background:"var(--red)",border:"1.5px solid var(--bg-surface)"}}/>
            </button>
            <div style={{width:40,height:40,borderRadius:"var(--r-md)",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"var(--bg-base)"}}>V</div>
          </div>
        </div>
        {/* Stats strip */}
        <div style={{display:"flex",gap:8}}>
          {[
            {label:"Numbers", value:NUMBERS.length,d:"M9 12h6M9 16h4M13 4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9zM13 4v5h5",color:"var(--accent)"},
            {label:"Messages",value:55,            d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",color:"var(--green)"},
            {label:"Calls",   value:15,            d:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",color:"var(--blue)"},
          ].map((s,i)=>(
            <div key={i} className="fade-up" style={{flex:1,background:"var(--bg-raised)",borderRadius:"var(--r-md)",padding:"12px 10px",border:"1px solid var(--border)",animationDelay:`${i*0.06}s`}}>
              <Ic d={s.d} size={15} color={s.color} style={{marginBottom:7}}/>
              <div style={{fontSize:22,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.5px"}}>{s.value}</div>
              <div style={{fontSize:10,color:"var(--text-muted)",fontWeight:500,marginTop:1}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Numbers list — flat, no padding wrapper */}
      <div style={{background:"var(--bg-surface)",marginTop:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px 10px"}}>
          <h3 style={{fontSize:13,fontWeight:700,color:"var(--text-muted)",letterSpacing:1.1}}>MY NUMBERS</h3>
          <button onClick={()=>setScreen("picker")} style={{fontSize:12,color:"var(--accent)",fontWeight:600,background:"none",border:"none",display:"flex",alignItems:"center",gap:3}}>
            <Ic d="M12 5v14M5 12h14" size={13} color="var(--accent)" sw={2.5}/> Add
          </button>
        </div>
        {NUMBERS.map((num,i)=><NumberRow key={num.id} num={num} i={i} setScreen={setScreen}/>)}
      </div>

      {/* Add number CTA */}
      <div style={{padding:"10px 16px 28px"}}>
        <div className="press fade-up" onClick={()=>setScreen("picker")} style={{background:"var(--bg-surface)",border:"1px solid var(--border-strong)",borderRadius:"var(--r-lg)",padding:"16px 18px",marginTop:10,cursor:"pointer",animationDelay:"0.25s",position:"relative",overflow:"hidden",transition:"transform 0.1s",display:"flex",alignItems:"center",gap:14}}>
          <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"var(--accent-glow)",filter:"blur(24px)",pointerEvents:"none"}}/>
          <div style={{width:40,height:40,borderRadius:12,background:"var(--accent-dim)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>🌍</div>
          <div style={{flex:1,position:"relative"}}>
            <div style={{fontSize:13.5,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.2px"}}>Add another country</div>
            <div style={{fontSize:12,color:"var(--text-secondary)",marginTop:2}}>100+ countries · from $1.99/month</div>
          </div>
          <Ic d="M9 18l6-6-6-6" size={16} color="var(--accent)" sw={2.5}/>
        </div>
      </div>
    </div>
  );
}

/* ─── PICKER ─────────────────────────────────────────────────── */
function Picker(){
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [type,setType]=useState("permanent");
  const [filter,setFilter]=useState("all");
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [number,setNumber]=useState("");
  const list=COUNTRIES.filter(c=>{
    const q=search.toLowerCase();
    return (c.name.toLowerCase().includes(q)||c.prefix.includes(q)||c.code.toLowerCase().includes(q))&&
           (filter==="all"||(filter==="popular"&&c.popular)||(filter==="instant"&&c.instant));
  });
  const provision=()=>{if(!selected)return;setLoading(true);setTimeout(()=>{setNumber(genNum(selected.prefix));setLoading(false);setDone(true);},2400);};
  if(done) return(
    <div className="scale-in" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"var(--bg-base)",padding:"0 32px"}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:"var(--green-dim)",border:"1px solid rgba(62,207,106,0.2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:22,animation:"pop 0.5s ease"}}>
        <Ic d="M20 6L9 17l-5-5" size={30} color="var(--green)" sw={2.5}/>
      </div>
      <h2 style={{fontSize:24,fontWeight:700,color:"var(--text-primary)",textAlign:"center",marginBottom:8,letterSpacing:"-0.5px"}}>Number Activated 🎉</h2>
      <p style={{fontSize:13,color:"var(--text-secondary)",textAlign:"center",marginBottom:28,lineHeight:1.7}}>Your new {selected.name} number is live and ready.</p>
      <div style={{background:"var(--bg-surface)",border:"1px solid var(--border-strong)",borderRadius:"var(--r-lg)",padding:"20px 24px",marginBottom:28,textAlign:"center",width:"100%"}}>
        <div style={{fontSize:32,marginBottom:8}}>{selected.flag}</div>
        <div style={{fontFamily:"var(--font-mono)",fontSize:20,fontWeight:500,color:"var(--accent)",letterSpacing:"-0.3px"}}>{number}</div>
        <div style={{fontSize:11,color:"var(--text-muted)",marginTop:6,marginBottom:12}}>{selected.name} · {type}</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"var(--green-dim)",borderRadius:99,padding:"4px 12px"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",animation:"pulse 1.5s ease infinite"}}/>
          <span style={{fontSize:11,fontWeight:700,color:"var(--green)"}}>Active</span>
        </div>
      </div>
      <button className="press" onClick={()=>{setDone(false);setSelected(null);setSearch("");}} style={{width:"100%",height:52,background:"var(--accent)",border:"none",borderRadius:"var(--r-md)",color:"var(--bg-base)",fontSize:15,fontWeight:700,boxShadow:"0 6px 20px var(--accent-glow)",transition:"transform 0.1s"}}>Done</button>
    </div>
  );
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--bg-base)"}}>
      <div style={{background:"var(--bg-surface)",padding:"8px 20px 0",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <h2 style={{fontSize:20,fontWeight:700,color:"var(--text-primary)",margin:"0 0 2px",letterSpacing:"-0.4px"}}>Get a Number</h2>
        <p style={{fontSize:12,color:"var(--text-muted)",margin:"0 0 14px"}}>Pick a country — generated instantly</p>
        <div style={{position:"relative",marginBottom:11}}>
          <Ic d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" size={14} color="var(--text-muted)" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search country or code…" style={{width:"100%",height:42,borderRadius:"var(--r-md)",border:"1.5px solid var(--border)",background:"var(--bg-input)",paddingLeft:36,paddingRight:14,fontSize:13.5,color:"var(--text-primary)",outline:"none"}}/>
        </div>
        <div style={{display:"flex",gap:7,paddingBottom:13,overflowX:"auto"}}>
          {[{id:"all",l:"All"},{id:"popular",l:"⭐ Popular"},{id:"instant",l:"⚡ Instant"}].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{flexShrink:0,height:28,padding:"0 13px",borderRadius:99,border:`1.5px solid ${filter===f.id?"var(--accent)":"var(--border)"}`,background:filter===f.id?"var(--accent-dim)":"transparent",color:filter===f.id?"var(--accent)":"var(--text-muted)",fontSize:11.5,fontWeight:600,transition:"all 0.15s"}}>{f.l}</button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 14px"}}>
        {list.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"var(--text-muted)",fontSize:13}}>No countries found</div>}
        {list.map((c,i)=>(
          <div key={c.code} onClick={()=>setSelected(c)} className="fade-up" style={{display:"flex",alignItems:"center",padding:"11px 13px",borderRadius:"var(--r-md)",marginBottom:6,background:selected?.code===c.code?"var(--accent-dim)":"var(--bg-surface)",border:`1.5px solid ${selected?.code===c.code?"rgba(232,160,32,0.4)":"var(--border)"}`,cursor:"pointer",transition:"all 0.15s",animationDelay:`${i*0.02}s`}}>
            <span style={{fontSize:22,marginRight:11}}>{c.flag}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13.5,fontWeight:600,color:"var(--text-primary)"}}>{c.name}</div>
              <div style={{fontSize:11,color:"var(--text-muted)",marginTop:1,fontFamily:"var(--font-mono)"}}>{c.prefix}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <div style={{fontSize:14,fontWeight:700,color:"var(--text-primary)",fontFamily:"var(--font-mono)"}}>${c.price}<span style={{fontSize:10,fontWeight:400,color:"var(--text-muted)"}}>/mo</span></div>
              <div style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:99,background:c.instant?"var(--green-dim)":"var(--bg-raised)",color:c.instant?"var(--green)":"var(--text-muted)"}}>{c.instant?"⚡ Instant":"📋 Docs req."}</div>
            </div>
            {selected?.code===c.code&&<div style={{width:18,height:18,borderRadius:"50%",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:10,animation:"pop 0.2s ease"}}><Ic d="M20 6L9 17l-5-5" size={10} color="var(--bg-base)" sw={3}/></div>}
          </div>
        ))}
      </div>
      {selected&&(
        <div className="slide-up" style={{background:"var(--bg-surface)",borderTop:"1px solid var(--border)",padding:"14px 18px 20px",flexShrink:0}}>
          <div style={{display:"flex",gap:7,marginBottom:12}}>
            {["permanent","temporary"].map(t=>(
              <button key={t} onClick={()=>setType(t)} style={{flex:1,height:37,borderRadius:"var(--r-sm)",border:`1.5px solid ${type===t?"var(--accent)":"var(--border)"}`,background:type===t?"var(--accent-dim)":"transparent",color:type===t?"var(--accent)":"var(--text-secondary)",fontSize:12,fontWeight:600,transition:"all 0.15s"}}>
                {t==="permanent"?"🔒 Permanent":"⏱ 7-Day Temp"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,padding:"10px 12px",background:"var(--bg-raised)",borderRadius:"var(--r-sm)"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <span style={{fontSize:20}}>{selected.flag}</span>
              <div>
                <div style={{fontSize:12.5,fontWeight:600,color:"var(--text-primary)"}}>{selected.name}</div>
                <div style={{fontSize:10.5,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>{selected.prefix} · {type}</div>
              </div>
            </div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:18,fontWeight:500,color:"var(--accent)"}}>${type==="temporary"?"0.99":selected.price}<span style={{fontSize:10,color:"var(--text-muted)"}}>/mo</span></div>
          </div>
          <button className="press" onClick={provision} disabled={loading} style={{width:"100%",height:52,background:loading?"var(--accent-dim)":"var(--accent)",border:"none",borderRadius:"var(--r-md)",color:loading?"var(--accent)":"var(--bg-base)",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:loading?"none":"0 6px 20px var(--accent-glow)",transition:"transform 0.1s"}}>
            {loading?<><Spinner/> Generating your number…</>:`Get ${selected.name} Number →`}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── INBOX ──────────────────────────────────────────────────── */
function ChatView({convo,onBack}){
  const [input,setInput]=useState("");
  const [msgs,setMsgs]=useState([
    {id:1,from:"them",text:"Hey, are you free for a call tomorrow?",time:"2:14 PM"},
    {id:2,from:"them",text:"I wanted to discuss the project timeline",time:"2:15 PM"},
    {id:3,from:"me",  text:"Sure! I'm free after 3pm 👍",           time:"2:18 PM"},
  ]);
  const endRef=useRef(null);
  const send=()=>{if(!input.trim())return;setMsgs(p=>[...p,{id:Date.now(),from:"me",text:input,time:"Now"}]);setInput("");setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),40);};
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:"var(--bg-surface)",padding:"12px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:11,flexShrink:0}}>
        <button onClick={onBack} style={{background:"none",border:"none",display:"flex",padding:4}}><Ic d="M15 18l-6-6 6-6" size={20} color="var(--text-primary)" sw={2.2}/></button>
        <div style={{width:38,height:38,borderRadius:"var(--r-sm)",background:"var(--accent-dim)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{convo.flag}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14.5,fontWeight:600,color:"var(--text-primary)"}}>{convo.name}</div>
          <div style={{fontSize:10.5,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>{convo.number}</div>
        </div>
        <button style={{width:36,height:36,borderRadius:"var(--r-sm)",background:"var(--green-dim)",border:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" size={15} color="var(--green)" sw={2.2}/>
        </button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:8}}>
        <div style={{textAlign:"center",fontSize:10.5,color:"var(--text-muted)",marginBottom:4,fontWeight:500}}>Today</div>
        {msgs.map(m=>(
          <div key={m.id} className="fade-up" style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"76%",padding:"10px 13px",borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.from==="me"?"var(--accent)":"var(--bg-surface)",color:m.from==="me"?"var(--bg-base)":"var(--text-primary)",fontSize:13.5,lineHeight:1.55,border:m.from==="me"?"none":"1px solid var(--border)",boxShadow:m.from==="me"?"0 2px 10px var(--accent-glow)":"none"}}>
              {m.text}
              <div style={{fontSize:9.5,marginTop:4,textAlign:"right",color:m.from==="me"?"rgba(15,14,13,0.5)":"var(--text-muted)"}}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <div style={{background:"var(--bg-surface)",borderTop:"1px solid var(--border)",padding:"10px 13px",display:"flex",gap:9,alignItems:"center",flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message…" style={{flex:1,height:42,borderRadius:99,border:"1.5px solid var(--border)",background:"var(--bg-input)",padding:"0 16px",fontSize:13.5,color:"var(--text-primary)",outline:"none"}}/>
        <button className="press" onClick={send} style={{width:42,height:42,borderRadius:"50%",background:"var(--accent)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 3px 12px var(--accent-glow)",transition:"transform 0.1s"}}>
          <Ic d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" size={16} color="var(--bg-base)" sw={2.3}/>
        </button>
      </div>
    </div>
  );
}
function Inbox({defaultTab="messages"}){
  const [tab,setTab]=useState(defaultTab);
  const [convo,setConvo]=useState(null);
  const CTYPES={missed:{bg:"var(--red-dim)",c:"var(--red)",l:"Missed"},incoming:{bg:"var(--green-dim)",c:"var(--green)",l:"Incoming"},outgoing:{bg:"var(--blue-dim)",c:"var(--blue)",l:"Outgoing"},voicemail:{bg:"var(--bg-raised)",c:"var(--text-secondary)",l:"Voicemail"}};
  if(convo) return <ChatView convo={convo} onBack={()=>setConvo(null)}/>;
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:"var(--bg-surface)",padding:"10px 20px 0",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <h2 style={{fontSize:20,fontWeight:700,color:"var(--text-primary)",margin:"0 0 14px",letterSpacing:"-0.4px"}}>Inbox</h2>
        <div style={{display:"flex"}}>
          {[{id:"messages",l:"Messages"},{id:"calls",l:"Call Log"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,height:36,background:"none",border:"none",borderBottom:`2px solid ${tab===t.id?"var(--accent)":"transparent"}`,color:tab===t.id?"var(--accent)":"var(--text-muted)",fontSize:13.5,fontWeight:tab===t.id?600:400,transition:"all 0.15s"}}>{t.l}</button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {tab==="messages"?MESSAGES.map(m=>(
          <div key={m.id} onClick={()=>setConvo(m)} style={{display:"flex",alignItems:"center",padding:"13px 18px",gap:11,borderBottom:"1px solid var(--border)",background:"var(--bg-base)",cursor:"pointer",transition:"background 0.12s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--bg-surface)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg-base)"}>
            <div style={{width:46,height:46,borderRadius:"var(--r-md)",background:m.unread>0?"var(--accent-dim)":"var(--bg-raised)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,position:"relative"}}>
              {m.flag}
              {m.type==="missed"&&<div style={{position:"absolute",bottom:0,right:0,width:15,height:15,borderRadius:"50%",background:"var(--red)",border:"2px solid var(--bg-base)",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" size={7} color="#fff" sw={3}/></div>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                <span style={{fontSize:13.5,fontWeight:m.unread>0?700:500,color:"var(--text-primary)"}}>{m.name}</span>
                <span style={{fontSize:10.5,color:"var(--text-muted)",flexShrink:0}}>{m.time}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12.5,color:m.type==="missed"?"var(--red)":"var(--text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200,fontWeight:m.type==="missed"?600:400}}>
                  {m.type==="missed"?"Missed call":m.type==="voicemail"?`Voicemail · ${m.preview.split(": ")[1]||""}`:m.preview}
                </span>
                {m.unread>0&&<div style={{minWidth:18,height:18,borderRadius:99,padding:"0 4px",background:"var(--red)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",marginLeft:6}}>{m.unread}</div>}
              </div>
            </div>
          </div>
        )):CALLS.map(cl=>{
          const cv=CTYPES[cl.type]||CTYPES.outgoing;
          return(
            <div key={cl.id} style={{display:"flex",alignItems:"center",padding:"13px 18px",gap:11,borderBottom:"1px solid var(--border)",background:"var(--bg-base)",cursor:"pointer",transition:"background 0.12s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--bg-surface)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg-base)"}>
              <div style={{width:46,height:46,borderRadius:"var(--r-md)",background:cv.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" size={17} color={cv.c} sw={2}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13.5,fontWeight:600,color:cl.type==="missed"?"var(--red)":"var(--text-primary)",marginBottom:3}}>{cl.name}</div>
                <div style={{fontSize:11.5,color:"var(--text-muted)",display:"flex",alignItems:"center",gap:4,fontFamily:"var(--font-mono)"}}><span>{cl.flag} {cl.number}</span>{cl.duration&&<><span>·</span><span>{cl.duration}</span></>}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
                <span style={{fontSize:11,color:"var(--text-muted)"}}>{cl.time}</span>
                <div style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:99,background:cv.bg,color:cv.c}}>{cv.l}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── SETTINGS ───────────────────────────────────────────────── */
function Settings({setScreen}){
  const [notif,setNotif]=useState(true);
  const [bio,setBio]=useState(false);
  const [fwd,setFwd]=useState(true);
  function Row({iconD,label,sublabel,right,danger,onClick,last}){
    return(
      <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:last?"none":"1px solid var(--border)",cursor:onClick?"pointer":"default",transition:"background 0.12s"}} onMouseEnter={e=>onClick&&(e.currentTarget.style.background="var(--bg-hover)")} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <div style={{width:34,height:34,borderRadius:"var(--r-sm)",background:danger?"var(--red-dim)":"var(--accent-dim)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={iconD} size={15} color={danger?"var(--red)":"var(--accent)"} sw={2}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:13.5,fontWeight:500,color:danger?"var(--red)":"var(--text-primary)"}}>{label}</div>
          {sublabel&&<div style={{fontSize:11,color:"var(--text-muted)",marginTop:1}}>{sublabel}</div>}
        </div>
        {right}
        {onClick&&!right&&<Ic d="M9 18l6-6-6-6" size={14} color="var(--text-muted)" sw={2}/>}
      </div>
    );
  }
  function Sec({title,children}){
    return(
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:1.4,marginBottom:8,paddingLeft:4}}>{title}</div>
        <div style={{background:"var(--bg-surface)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)",overflow:"hidden"}}>{children}</div>
      </div>
    );
  }
  return(
    <div style={{flex:1,overflowY:"auto",background:"var(--bg-base)"}}>
      <div className="fade-up" style={{background:"var(--bg-surface)",borderBottom:"1px solid var(--border)",padding:"16px 20px 20px",display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
        <div style={{width:56,height:56,borderRadius:"var(--r-md)",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"var(--bg-base)",boxShadow:"0 4px 14px var(--accent-glow)"}}>V</div>
        <div style={{flex:1}}>
          <div style={{fontSize:18,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.3px"}}>Vusi Hal</div>
          <div style={{fontSize:12,color:"var(--text-muted)",marginTop:2,fontFamily:"var(--font-mono)"}}>vusi@dialglobal.io</div>
          <div style={{marginTop:6}}><Pill label="⭐ Pro Plan"/></div>
        </div>
        <button style={{fontSize:12,fontWeight:600,color:"var(--accent)",background:"var(--accent-dim)",border:"none",padding:"7px 14px",borderRadius:"var(--r-sm)"}}>Edit</button>
      </div>
      <div style={{padding:"0 16px"}}>
        <Sec title="PREFERENCES">
          <Row iconD="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" label="Notifications" sublabel="Calls, messages & missed alerts" right={<Toggle value={notif} onChange={setNotif}/>}/>
          <Row iconD="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" label="Biometric Lock" sublabel="Face ID / Fingerprint" right={<Toggle value={bio} onChange={setBio}/>}/>
          <Row iconD="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" label="Call Forwarding" sublabel="Forward to personal number" right={<Toggle value={fwd} onChange={setFwd}/>} last/>
        </Sec>
        <Sec title="ACCOUNT">
          <Row iconD="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" label="Personal Info" sublabel="Name, email, password" onClick={()=>{}}/>
          <Row iconD="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" label="Billing & Plan" sublabel="Pro · $9.99/mo" onClick={()=>{}}/>
          <Row iconD="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" label="Usage & Stats" sublabel="Calls, SMS this month" onClick={()=>{}} last/>
        </Sec>
        <Sec title="SUPPORT">
          <Row iconD="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" label="Help & FAQ" onClick={()=>{}}/>
          <Row iconD="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" label="Contact Support" sublabel="support@dialglobal.io" onClick={()=>{}} last/>
        </Sec>
        <Sec title="DANGER ZONE">
          <Row iconD="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" label="Sign Out" danger onClick={()=>{}} last/>
        </Sec>
        <div style={{textAlign:"center",padding:"4px 0 28px",color:"var(--text-muted)",fontSize:11}}>DialGlobal v2.0.0 · Built with Telnyx</div>
      </div>
    </div>
  );
}

/* ─── LOGIN / SIGN UP ────────────────────────────────────────── */
function Auth({onDone}){
  const [mode,setMode]=useState("login"); // "login" | "signup"
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [name,setName]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  const submit=()=>{
    if(!email||!pass||(mode==="signup"&&!name)){setErr("Please fill in all fields.");return;}
    setErr("");setLoading(true);
    // In production: call login() or signup() from api.js
    setTimeout(()=>{setLoading(false);onDone();},1600);
  };

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"var(--bg-base)",overflow:"hidden"}}>
      {/* Top gradient splash */}
      <div style={{height:200,background:"radial-gradient(ellipse at 50% 0%, #FDE9C0 0%, var(--bg-base) 80%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
        <div style={{width:56,height:56,borderRadius:16,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,boxShadow:"0 8px 28px var(--accent-glow)"}}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--bg-base)" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
        </div>
        <div style={{fontSize:22,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.4px"}}>DialGlobal</div>
        <div style={{fontSize:12,color:"var(--text-muted)",marginTop:4}}>Virtual numbers for the world</div>
      </div>

      {/* Card */}
      <div style={{flex:1,background:"var(--bg-surface)",borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",borderTop:"1px solid var(--border)",overflowY:"auto"}}>
        {/* Tab toggle */}
        <div style={{display:"flex",background:"var(--bg-raised)",borderRadius:"var(--r-md)",padding:3,marginBottom:24}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,height:36,borderRadius:11,border:"none",background:mode===m?"var(--bg-surface)":"transparent",color:mode===m?"var(--text-primary)":"var(--text-muted)",fontSize:13,fontWeight:mode===m?600:400,transition:"all 0.2s",boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.3)":"none"}}>
              {m==="login"?"Log In":"Sign Up"}
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="signup"&&(
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"var(--text-muted)",marginBottom:6,letterSpacing:0.5}}>FULL NAME</div>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Vusi Hal"
                style={{width:"100%",height:48,borderRadius:"var(--r-md)",border:"1.5px solid var(--border)",background:"var(--bg-input)",padding:"0 14px",fontSize:14,color:"var(--text-primary)",outline:"none"}}/>
            </div>
          )}
          <div>
            <div style={{fontSize:11,fontWeight:600,color:"var(--text-muted)",marginBottom:6,letterSpacing:0.5}}>EMAIL</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" type="email"
              style={{width:"100%",height:48,borderRadius:"var(--r-md)",border:"1.5px solid var(--border)",background:"var(--bg-input)",padding:"0 14px",fontSize:14,color:"var(--text-primary)",outline:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:"var(--text-muted)",marginBottom:6,letterSpacing:0.5}}>PASSWORD</div>
            <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" type="password"
              style={{width:"100%",height:48,borderRadius:"var(--r-md)",border:"1.5px solid var(--border)",background:"var(--bg-input)",padding:"0 14px",fontSize:14,color:"var(--text-primary)",outline:"none"}}/>
          </div>
        </div>

        {err&&<div style={{marginTop:12,fontSize:12,color:"var(--red)",background:"var(--red-dim)",borderRadius:"var(--r-sm)",padding:"9px 13px"}}>{err}</div>}

        {mode==="login"&&(
          <div style={{textAlign:"right",marginTop:8}}>
            <button style={{fontSize:12,color:"var(--accent)",background:"none",border:"none",fontWeight:500}}>Forgot password?</button>
          </div>
        )}

        <button className="press" onClick={submit} disabled={loading} style={{width:"100%",height:52,background:"var(--accent)",border:"none",borderRadius:"var(--r-md)",color:"var(--bg-base)",fontSize:15,fontWeight:700,marginTop:24,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 6px 22px var(--accent-glow)",transition:"transform 0.1s"}}>
          {loading?<><Spinner color="var(--bg-base)"/>{mode==="login"?"Signing in…":"Creating account…"}</>:mode==="login"?"Log In →":"Create Account →"}
        </button>

        {/* Divider */}
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"22px 0"}}>
          <div style={{flex:1,height:1,background:"var(--border)"}}/>
          <span style={{fontSize:11,color:"var(--text-muted)"}}>or continue with</span>
          <div style={{flex:1,height:1,background:"var(--border)"}}/>
        </div>

        {/* Social buttons */}
        <div style={{display:"flex",gap:10}}>
          {[{label:"Google",icon:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"},{label:"Apple",icon:"M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"}].map(s=>(
            <button key={s.label} className="press" style={{flex:1,height:46,background:"var(--bg-raised)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",color:"var(--text-secondary)",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"transform 0.1s"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-secondary)"><path d={s.icon}/></svg>
              {s.label}
            </button>
          ))}
        </div>

        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:"var(--text-muted)"}}>
          By continuing, you agree to our <span style={{color:"var(--accent)"}}>Terms</span> & <span style={{color:"var(--accent)"}}>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

/* ─── PAYWALL / PRICING ──────────────────────────────────────── */
function Paywall({setScreen}){
  const [billing,setBilling]=useState("monthly");
  const [selected,setSelected]=useState("unlimited");

  // Pricing based on market research:
  // Hushed: $1.99 (7-day), $4.99/mo unlimited · Burner: $4.99-$9.99/mo
  // DialGlobal sits between personal (Hushed) and business (Grasshopper $26+)
  const plans=[
    {
      id:"basic",
      name:"Basic",
      tag:null,
      desc:"One number to keep things private",
      monthlyPrice:1.99,
      yearlyPrice:1.49,
      perMonth:true,
      features:[
        "1 virtual number",
        "US, UK or Canada only",
        "60 SMS / 30 min calls",
        "Custom voicemail",
        "7-day number history",
      ],
      locked:["Multiple numbers","100+ countries","Unlimited usage","Call recording"],
      cta:"Start Basic",
    },
    {
      id:"unlimited",
      name:"Unlimited",
      tag:"MOST POPULAR",
      tagColor:"var(--accent)",
      desc:"Unlimited calls & texts, any country",
      monthlyPrice:4.99,
      yearlyPrice:3.99,
      perMonth:true,
      features:[
        "3 virtual numbers",
        "45+ countries",
        "Unlimited SMS & calls",
        "Voicemail + transcription",
        "Auto-reply messages",
        "Call forwarding",
        "Priority support",
      ],
      locked:[],
      cta:"Start Unlimited",
    },
    {
      id:"global",
      name:"Global",
      tag:"100+ COUNTRIES",
      tagColor:"var(--green)",
      desc:"Full international coverage for power users",
      monthlyPrice:9.99,
      yearlyPrice:7.99,
      perMonth:true,
      features:[
        "10 virtual numbers",
        "100+ countries",
        "Unlimited SMS & calls",
        "Voicemail + transcription",
        "Call recording",
        "Custom caller ID",
        "API access",
        "Dedicated support",
      ],
      locked:[],
      cta:"Start Global",
    },
  ];

  const activePlan=plans.find(p=>p.id===selected);
  const price=billing==="yearly"?activePlan.yearlyPrice:activePlan.monthlyPrice;
  const yearSaving=((activePlan.monthlyPrice-activePlan.yearlyPrice)*12).toFixed(2);

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"var(--bg-base)",overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:"var(--bg-surface)",padding:"10px 20px 16px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",display:"flex",padding:4}}>
            <Ic d="M15 18l-6-6 6-6" size={20} color="var(--text-primary)" sw={2.2}/>
          </button>
          <div>
            <h2 style={{fontSize:18,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.4px"}}>Pick a plan</h2>
            <p style={{fontSize:11,color:"var(--text-muted)",marginTop:1}}>Cancel anytime · No hidden fees</p>
          </div>
        </div>

        {/* Billing toggle */}
        <div style={{display:"flex",background:"var(--bg-raised)",borderRadius:"var(--r-md)",padding:3,marginTop:12}}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{flex:1,height:33,borderRadius:11,border:"none",background:billing===b?"var(--bg-surface)":"transparent",color:billing===b?"var(--text-primary)":"var(--text-muted)",fontSize:12.5,fontWeight:billing===b?600:400,transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6,boxShadow:billing===b?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>
              {b==="yearly"?"Annual":"Monthly"}
              {b==="yearly"&&<span style={{fontSize:9,fontWeight:700,background:"var(--green)",color:"#fff",padding:"2px 6px",borderRadius:99}}>Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plan list — flat rows like iOS App Store */}
      <div style={{flex:1,overflowY:"auto",background:"var(--bg-surface)"}}>
        {plans.map((plan,i)=>{
          const isSel=selected===plan.id;
          const dp=billing==="yearly"?plan.yearlyPrice:plan.monthlyPrice;
          return(
            <div key={plan.id} onClick={()=>setSelected(plan.id)} className="fade-up" style={{animationDelay:`${i*0.06}s`,borderBottom:"1px solid var(--border)",cursor:"pointer",transition:"background 0.12s",background:isSel?"var(--accent-dim)":"var(--bg-surface)"}}
              onMouseEnter={e=>!isSel&&(e.currentTarget.style.background="var(--bg-raised)")}
              onMouseLeave={e=>!isSel&&(e.currentTarget.style.background="var(--bg-surface)")}>
              {/* Popular tag */}
              {plan.tag&&(
                <div style={{height:22,background:plan.tagColor,display:"flex",alignItems:"center",paddingLeft:16,gap:5}}>
                  <span style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:plan.id==="global"?"#fff":"var(--bg-base)"}}>{plan.tag}</span>
                </div>
              )}
              <div style={{padding:"14px 18px",display:"flex",alignItems:"flex-start",gap:14}}>
                {/* Radio */}
                <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${isSel?"var(--accent)":"var(--border-strong)"}`,background:isSel?"var(--accent)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,transition:"all 0.18s"}}>
                  {isSel&&<div style={{width:7,height:7,borderRadius:"50%",background:"var(--bg-base)"}}/>}
                </div>
                {/* Content */}
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.3px"}}>{plan.name}</div>
                      <div style={{fontSize:11.5,color:"var(--text-secondary)",marginTop:2}}>{plan.desc}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                      <div style={{fontSize:20,fontWeight:700,color:isSel?"var(--accent)":"var(--text-primary)",fontFamily:"var(--font-mono)",letterSpacing:"-0.4px"}}>${dp}</div>
                      <div style={{fontSize:10,color:"var(--text-muted)"}}>/month</div>
                    </div>
                  </div>
                  {/* Features — only show when selected */}
                  {isSel&&(
                    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:5,marginTop:8,paddingTop:8,borderTop:"1px solid var(--border)"}}>
                      {plan.features.map((f,fi)=>(
                        <div key={fi} style={{display:"flex",alignItems:"center",gap:7}}>
                          <Ic d="M20 6L9 17l-5-5" size={11} color="var(--green)" sw={2.5}/>
                          <span style={{fontSize:12,color:"var(--text-secondary)"}}>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Free trial note */}
        <div style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:10}}>
          <Ic d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" size={14} color="var(--accent)" sw={2}/>
          <span style={{fontSize:12,color:"var(--text-muted)",lineHeight:1.5}}>Try free for <strong style={{color:"var(--text-primary)"}}>7 days</strong> — no charge until your trial ends.</span>
        </div>

        {/* Competitor context */}
        <div style={{margin:"0 16px 20px",background:"var(--bg-raised)",borderRadius:"var(--r-md)",padding:"12px 14px"}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:1.2,marginBottom:8}}>HOW WE COMPARE</div>
          {[
            {name:"Hushed",    price:"$4.99",note:"US/UK/Canada only"},
            {name:"Burner",    price:"$9.99",note:"US & Canada only"},
            {name:"Grasshopper",price:"$26+",note:"Business only"},
            {name:"DialGlobal",price:`$${(billing==="yearly"?plans[1].yearlyPrice:plans[1].monthlyPrice)}`,note:"100+ countries",us:true},
          ].map((c,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 0",borderBottom:i<3?"1px solid var(--border)":"none"}}>
              <span style={{fontSize:12,fontWeight:c.us?700:400,color:c.us?"var(--text-primary)":"var(--text-secondary)"}}>{c.name}{c.us&&" ✦"}</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:"var(--text-muted)"}}>{c.note}</span>
                <span style={{fontSize:12,fontWeight:700,color:c.us?"var(--accent)":"var(--text-secondary)",fontFamily:"var(--font-mono)"}}>{c.price}/mo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{background:"var(--bg-surface)",borderTop:"1px solid var(--border)",padding:"12px 18px 20px",flexShrink:0}}>
        {billing==="yearly"&&(
          <div style={{textAlign:"center",fontSize:11,color:"var(--green)",fontWeight:600,marginBottom:10}}>
            🎉 You save ${yearSaving} a year with annual billing
          </div>
        )}
        <button className="press" onClick={()=>setScreen("home")} style={{width:"100%",height:52,background:"var(--accent)",border:"none",borderRadius:"var(--r-md)",color:"var(--bg-base)",fontSize:15,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 6px 22px var(--accent-glow)",transition:"transform 0.1s"}}>
          {activePlan.cta} — ${price}/mo →
        </button>
        <div style={{textAlign:"center",marginTop:9,fontSize:11,color:"var(--text-muted)"}}>
          7-day free trial · Cancel anytime
        </div>
      </div>
    </div>
  );
}

/* ─── PROFILE / ACCOUNT ──────────────────────────────────────── */
function Profile({setScreen}){
  const [name,setName]=useState("Vusi Hal");
  const [email,setEmail]=useState("vusi@dialglobal.io");
  const [editing,setEditing]=useState(false);
  const [saved,setSaved]=useState(false);

  const save=()=>{
    setSaved(true);setEditing(false);
    setTimeout(()=>setSaved(false),2000);
  };

  const stats=[
    {label:"Numbers",    value:"2",    d:"M9 12h6M9 16h4M13 4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9zM13 4v5h5",color:"var(--accent)"},
    {label:"Total calls",value:"27",   d:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",color:"var(--green)"},
    {label:"SMS sent",   value:"55",   d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",color:"var(--blue)"},
    {label:"Member since",value:"Mar 25",d:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",color:"var(--text-secondary)"},
  ];

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"var(--bg-base)",overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:"var(--bg-surface)",padding:"10px 18px 0",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setScreen("settings")} style={{background:"none",border:"none",display:"flex",padding:4}}>
              <Ic d="M15 18l-6-6 6-6" size={20} color="var(--text-primary)" sw={2.2}/>
            </button>
            <h2 style={{fontSize:18,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.3px"}}>My Profile</h2>
          </div>
          <button onClick={()=>editing?save():setEditing(true)} style={{fontSize:12,fontWeight:600,color:"var(--accent)",background:"var(--accent-dim)",border:"none",padding:"7px 14px",borderRadius:"var(--r-sm)"}}>
            {editing?"Save":"Edit"}
          </button>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"0 16px 28px"}}>
        {/* Avatar + name block */}
        <div className="fade-up" style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 0 24px"}}>
          <div style={{width:80,height:80,borderRadius:24,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:700,color:"var(--bg-base)",boxShadow:"0 8px 28px var(--accent-glow)",marginBottom:14}}>V</div>
          <div style={{fontSize:20,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.4px"}}>{name}</div>
          <div style={{fontSize:12,color:"var(--text-muted)",marginTop:3,fontFamily:"var(--font-mono)"}}>{email}</div>
          <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6,background:"var(--accent-dim)",borderRadius:99,padding:"4px 12px"}}>
            <span style={{fontSize:12}}>⭐</span>
            <span style={{fontSize:11,fontWeight:700,color:"var(--accent)"}}>Pro Plan · Active</span>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {stats.map((s,i)=>(
            <div key={i} className="fade-up" style={{background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",padding:"13px 12px",animationDelay:`${i*0.06}s`}}>
              <Ic d={s.d} size={14} color={s.color} style={{marginBottom:7}}/>
              <div style={{fontSize:20,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.4px"}}>{s.value}</div>
              <div style={{fontSize:10,color:"var(--text-muted)",marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edit fields */}
        <div style={{background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",overflow:"hidden",marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:1.4,padding:"14px 16px 0"}}>PERSONAL INFO</div>
          {[{label:"Full Name",value:name,set:setName},{label:"Email",value:email,set:setEmail}].map((f,i)=>(
            <div key={i} style={{padding:"12px 16px",borderBottom:i===0?"1px solid var(--border)":"none"}}>
              <div style={{fontSize:10.5,fontWeight:600,color:"var(--text-muted)",marginBottom:5,letterSpacing:0.4}}>{f.label.toUpperCase()}</div>
              {editing?(
                <input value={f.value} onChange={e=>f.set(e.target.value)} style={{width:"100%",background:"var(--bg-input)",border:"1.5px solid var(--border)",borderRadius:"var(--r-sm)",padding:"8px 12px",fontSize:13.5,color:"var(--text-primary)",outline:"none"}}/>
              ):(
                <div style={{fontSize:13.5,color:"var(--text-primary)",fontFamily:i===1?"var(--font-mono)":"inherit"}}>{f.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Saved toast */}
        {saved&&(
          <div className="fade-up" style={{background:"var(--green-dim)",border:"1px solid rgba(62,207,106,0.2)",borderRadius:"var(--r-md)",padding:"11px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
            <Ic d="M20 6L9 17l-5-5" size={14} color="var(--green)" sw={2.5}/>
            <span style={{fontSize:13,color:"var(--green)",fontWeight:600}}>Profile saved successfully</span>
          </div>
        )}

        {/* Plan card */}
        <div style={{background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",overflow:"hidden",marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:1.4,padding:"14px 16px 0"}}>SUBSCRIPTION</div>
          <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13.5,fontWeight:600,color:"var(--text-primary)"}}>Pro Plan</div>
              <div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>Renews June 1, 2025</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:18,fontWeight:700,color:"var(--accent)",fontFamily:"var(--font-mono)"}}>$9.99</div>
              <div style={{fontSize:10,color:"var(--text-muted)"}}>/month</div>
            </div>
          </div>
          <div style={{borderTop:"1px solid var(--border)",padding:"10px 16px"}}>
            <button onClick={()=>setScreen("paywall")} style={{fontSize:12,fontWeight:600,color:"var(--accent)",background:"none",border:"none",display:"flex",alignItems:"center",gap:4}}>
              Upgrade to Business <Ic d="M9 18l6-6-6-6" size={12} color="var(--accent)" sw={2.5}/>
            </button>
          </div>
        </div>

        {/* Danger */}
        <div style={{background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",overflow:"hidden"}}>
          <button style={{width:"100%",padding:"14px 16px",background:"none",border:"none",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            <div style={{width:34,height:34,borderRadius:"var(--r-sm)",background:"var(--red-dim)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ic d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={15} color="var(--red)" sw={2}/>
            </div>
            <span style={{fontSize:13.5,fontWeight:500,color:"var(--red)"}}>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── NUMBER DETAIL ──────────────────────────────────────────── */
function NumberDetail({num,setScreen}){
  const [forwarding,setForwarding]=useState(false);
  const [fwdNumber,setFwdNumber]=useState("");
  const [voicemail,setVoicemail]=useState(true);
  const [recording,setRecording]=useState(false);

  if(!num) num=NUMBERS[0]; // fallback

  const recentCalls=CALLS.slice(0,3);
  const recentMsgs=MESSAGES.slice(0,2);

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"var(--bg-base)",overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:"var(--bg-surface)",padding:"10px 18px 16px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",display:"flex",padding:4}}>
            <Ic d="M15 18l-6-6 6-6" size={20} color="var(--text-primary)" sw={2.2}/>
          </button>
          <h2 style={{fontSize:18,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.3px"}}>Number Details</h2>
        </div>
        {/* Number hero */}
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:52,height:52,borderRadius:16,background:"var(--bg-raised)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{num.flag}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.4px",fontFamily:"var(--font-mono)"}}>{num.number}</div>
            <div style={{fontSize:12,color:"var(--text-secondary)",marginTop:2}}>{num.country}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
            <Pill label={num.type==="permanent"?"Permanent":`⏱ ${num.expiresIn}`} color={num.type==="permanent"?"var(--accent)":"var(--green)"} bg={num.type==="permanent"?"var(--accent-dim)":"var(--green-dim)"}/>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",animation:"pulse 2s ease infinite"}}/><span style={{fontSize:10,color:"var(--green)",fontWeight:600}}>Active</span></div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 16px 28px"}}>
        {/* Quick actions */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
          {[
            {label:"Call",     d:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",  accent:true},
            {label:"Message",  d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"},
            {label:"Share",    d:"M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"},
          ].map((a,i)=>(
            <button key={i} className="press" style={{height:62,background:a.accent?"var(--accent)":"var(--bg-surface)",border:a.accent?"none":"1px solid var(--border)",borderRadius:"var(--r-md)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,cursor:"pointer",transition:"transform 0.1s",boxShadow:a.accent?"0 4px 14px var(--accent-glow)":"none"}}>
              <Ic d={a.d} size={18} color={a.accent?"var(--bg-base)":"var(--text-secondary)"} sw={a.accent?2.5:2}/>
              <span style={{fontSize:11,fontWeight:600,color:a.accent?"var(--bg-base)":"var(--text-secondary)"}}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {[{label:"Calls",value:num.calls,color:"var(--accent)"},{label:"Messages",value:num.sms,color:"var(--green)"},{label:"Last active",value:num.lastActivity,color:"var(--blue)"}].map((s,i)=>(
            <div key={i} style={{flex:1,background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",padding:"11px 8px",textAlign:"center"}}>
              <div style={{fontSize:19,fontWeight:700,color:s.color,letterSpacing:"-0.4px",fontFamily:"var(--font-mono)"}}>{s.value}</div>
              <div style={{fontSize:9,color:"var(--text-muted)",marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div style={{background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",overflow:"hidden",marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:1.4,padding:"14px 16px 0"}}>NUMBER SETTINGS</div>
          {[
            {label:"Voicemail",         sublabel:"Record missed calls",                   value:voicemail,   set:setVoicemail},
            {label:"Call Recording",    sublabel:"Save all calls automatically",          value:recording,   set:setRecording},
            {label:"Call Forwarding",   sublabel:"Route calls to another number",         value:forwarding,  set:setForwarding},
          ].map((row,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderTop:"1px solid var(--border)"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13.5,fontWeight:500,color:"var(--text-primary)"}}>{row.label}</div>
                <div style={{fontSize:11,color:"var(--text-muted)",marginTop:1}}>{row.sublabel}</div>
              </div>
              <Toggle value={row.value} onChange={row.set}/>
            </div>
          ))}
          {forwarding&&(
            <div style={{padding:"0 16px 14px"}}>
              <input value={fwdNumber} onChange={e=>setFwdNumber(e.target.value)} placeholder="+1 (555) 000-0000"
                style={{width:"100%",height:42,borderRadius:"var(--r-sm)",border:"1.5px solid var(--border)",background:"var(--bg-input)",padding:"0 13px",fontSize:13,color:"var(--text-primary)",outline:"none",fontFamily:"var(--font-mono)"}}/>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:1.4,marginBottom:8}}>RECENT CALLS</div>
        <div style={{background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",overflow:"hidden",marginBottom:16}}>
          {recentCalls.map((cl,i)=>{
            const colors={missed:"var(--red)",incoming:"var(--green)",outgoing:"var(--blue)",voicemail:"var(--text-secondary)"};
            return(
              <div key={cl.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderBottom:i<recentCalls.length-1?"1px solid var(--border)":"none"}}>
                <div style={{width:36,height:36,borderRadius:11,background:cl.type==="missed"?"var(--red-dim)":cl.type==="incoming"?"var(--green-dim)":"var(--blue-dim)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-.4-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.93 6.93l1.51-1.51a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" size={14} color={colors[cl.type]||colors.outgoing} sw={2}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:cl.type==="missed"?"var(--red)":"var(--text-primary)"}}>{cl.name}</div>
                  <div style={{fontSize:10.5,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>{cl.number}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10.5,color:"var(--text-muted)"}}>{cl.time}</div>
                  {cl.duration&&<div style={{fontSize:10,color:"var(--text-secondary)",fontFamily:"var(--font-mono)"}}>{cl.duration}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Danger zone */}
        <div style={{background:"var(--red-dim)",border:"1px solid rgba(240,82,82,0.15)",borderRadius:"var(--r-lg)",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:13.5,fontWeight:600,color:"var(--red)"}}>Release Number</div>
            <div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>Permanently delete this number</div>
          </div>
          <button className="press" style={{height:34,padding:"0 14px",background:"var(--red)",border:"none",borderRadius:"var(--r-sm)",color:"white",fontSize:12,fontWeight:700,transition:"transform 0.1s"}}>Release</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
export default function App(){
  const [screen,setScreen]=useState("onboarding");
  const noChrome=["onboarding","auth"].includes(screen);
  const noTab=["onboarding","auth","paywall","profile","numdetail"].includes(screen);

  const renderScreen=()=>{
    switch(screen){
      case "onboarding": return <Onboarding onDone={()=>setScreen("auth")}/>;
      case "auth":       return <Auth onDone={()=>setScreen("home")}/>;
      case "home":       return <Dashboard setScreen={setScreen}/>;
      case "picker":     return <Picker/>;
      case "inbox":      return <Inbox defaultTab="messages"/>;
      case "calls":      return <Inbox defaultTab="calls"/>;
      case "settings":   return <Settings setScreen={setScreen}/>;
      case "paywall":    return <Paywall setScreen={setScreen}/>;
      case "profile":    return <Profile setScreen={setScreen}/>;
      case "numdetail":  return <NumberDetail num={NUMBERS[0]} setScreen={setScreen}/>;
      default:           return <Dashboard setScreen={setScreen}/>;
    }
  };

  const allScreens=[
    {id:"onboarding",l:"① Onboarding"},
    {id:"auth",      l:"② Login"},
    {id:"home",      l:"③ Dashboard"},
    {id:"picker",    l:"④ Get Number"},
    {id:"paywall",   l:"⑤ Pricing"},
    {id:"inbox",     l:"⑥ Inbox"},
    {id:"numdetail", l:"⑦ Number"},
    {id:"profile",   l:"⑧ Profile"},
    {id:"settings",  l:"⑨ Settings"},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#E8E4DC",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px 16px"}}>
      <style>{css}</style>

      {/* Wordmark */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{width:28,height:28,borderRadius:8,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bg-base)" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
        </div>
        <span style={{color:"var(--text-primary)",fontSize:17,fontWeight:700,letterSpacing:"-0.4px"}}>DialGlobal</span>
      </div>

      {/* Nav pills */}
      <div style={{display:"flex",gap:5,marginBottom:16,flexWrap:"wrap",justifyContent:"center",maxWidth:500}}>
        {allScreens.map(p=>(
          <button key={p.id} onClick={()=>setScreen(p.id)} style={{padding:"4px 11px",borderRadius:99,border:`1px solid ${screen===p.id?"var(--accent)":"var(--border)"}`,background:screen===p.id?"var(--accent-dim)":"transparent",color:screen===p.id?"var(--accent)":"var(--text-muted)",fontSize:11,fontWeight:screen===p.id?600:400,transition:"all 0.15s",whiteSpace:"nowrap"}}>{p.l}</button>
        ))}
      </div>

      {/* Phone shell */}
      <div style={{width:390,height:844,background:"var(--bg-base)",borderRadius:52,boxShadow:"0 40px 80px rgba(0,0,0,0.13), 0 0 0 10px #D6D2CB, 0 0 0 12px #C8C4BC, inset 0 0 0 1px rgba(0,0,0,0.06)",overflow:"hidden",display:"flex",flexDirection:"column",position:"relative"}}>
        <DI/>
        {!noChrome&&<SB/>}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>{renderScreen()}</div>
        {!noTab&&<TabBar active={screen} setScreen={setScreen}/>}
      </div>

      <p style={{color:"var(--text-muted)",fontSize:10.5,marginTop:16,textAlign:"center",letterSpacing:0.3}}>DialGlobal · Full UI Prototype · Vusi Hal · 2025</p>
    </div>
  );
}
