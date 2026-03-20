// src/screens/Paywall.jsx
import React, { useState } from "react";
import { Ic, Spinner } from "../components/UI";
import { useApp } from "../context/AppContext";
import { PLANS } from "../data/mockData";

export default function Paywall() {
  const { goBack, upgradePlan, currentPlan } = useApp();
  const [billing, setBilling]   = useState("monthly");
  const [selected, setSelected] = useState(currentPlan === "basic" ? "unlimited" : currentPlan);
  const [loading, setLoading]   = useState(false);

  const activePlan = PLANS.find(p => p.id === selected);
  const price = billing === "yearly" ? activePlan.yearlyPrice : activePlan.monthlyPrice;
  const yearSaving = ((activePlan.monthlyPrice - activePlan.yearlyPrice) * 12).toFixed(2);

  const handleSubscribe = () => {
    setLoading(true);
    // TODO: call createCheckout(selected, billing) from api.js
    // then redirect to Stripe checkout URL
    setTimeout(() => {
      upgradePlan(selected, billing);
      setLoading(false);
      goBack();
    }, 1600);
  };

  const PLAN_META = {
    basic:     { tag: null,          tagColor: null },
    unlimited: { tag: "MOST POPULAR", tagColor: "var(--accent)" },
    global:    { tag: "100+ COUNTRIES",tagColor: "var(--green)" },
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"var(--bg-base)",overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:"var(--bg-surface)",padding:"10px 20px 14px",
        borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <button onClick={goBack} style={{background:"none",border:"none",display:"flex",padding:4}}>
            <Ic d="M15 18l-6-6 6-6" size={20} color="var(--text-primary)" sw={2.2}/>
          </button>
          <div>
            <h2 style={{fontSize:18,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.4px"}}>Pick a plan</h2>
            <p style={{fontSize:11,color:"var(--text-muted)",marginTop:1}}>Cancel anytime · No hidden fees</p>
          </div>
        </div>
        <div style={{display:"flex",background:"var(--bg-raised)",borderRadius:"var(--r-md)",padding:3,marginTop:12}}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{flex:1,height:33,borderRadius:11,border:"none",
              background:billing===b?"var(--bg-surface)":"transparent",
              color:billing===b?"var(--text-primary)":"var(--text-muted)",
              fontSize:12.5,fontWeight:billing===b?600:400,transition:"all 0.2s",
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              boxShadow:billing===b?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>
              {b==="yearly"?"Annual":"Monthly"}
              {b==="yearly"&&<span style={{fontSize:9,fontWeight:700,background:"var(--green)",color:"#fff",padding:"2px 6px",borderRadius:99}}>Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{flex:1,overflowY:"auto",background:"var(--bg-surface)"}}>
        {PLANS.map((plan,i)=>{
          const isSel = selected === plan.id;
          const isCurrent = currentPlan === plan.id;
          const dp = billing==="yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const meta = PLAN_META[plan.id];
          return (
            <div key={plan.id} onClick={()=>setSelected(plan.id)} className="fade-up"
              style={{animationDelay:`${i*0.06}s`,borderBottom:"1px solid var(--border)",
                cursor:"pointer",transition:"background 0.12s",background:isSel?"var(--accent-dim)":"var(--bg-surface)"}}
              onMouseEnter={e=>!isSel&&(e.currentTarget.style.background="var(--bg-raised)")}
              onMouseLeave={e=>!isSel&&(e.currentTarget.style.background="var(--bg-surface)")}>
              {meta.tag && (
                <div style={{height:22,background:meta.tagColor,display:"flex",alignItems:"center",paddingLeft:16}}>
                  <span style={{fontSize:9,fontWeight:700,letterSpacing:1.5,
                    color:plan.id==="global"?"#fff":"var(--bg-base)"}}>{meta.tag}</span>
                </div>
              )}
              <div style={{padding:"14px 18px",display:"flex",alignItems:"flex-start",gap:14}}>
                <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,marginTop:2,
                  border:`2px solid ${isSel?"var(--accent)":"var(--border-strong)"}`,
                  background:isSel?"var(--accent)":"transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.18s"}}>
                  {isSel && <div style={{width:7,height:7,borderRadius:"50%",background:"var(--bg-base)"}}/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{fontSize:15,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.3px"}}>{plan.name}</div>
                        {isCurrent && <span style={{fontSize:9,fontWeight:700,color:"var(--green)",background:"var(--green-dim)",padding:"2px 7px",borderRadius:99}}>CURRENT</span>}
                      </div>
                      <div style={{fontSize:11.5,color:"var(--text-secondary)",marginTop:2}}>
                        {plan.numberLimit} {plan.numberLimit===10?"numbers (max)":"numbers"} · {typeof plan.countries==="string"?plan.countries+" countries":"US, UK, CA"}
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                      <div style={{fontSize:20,fontWeight:700,fontFamily:"var(--font-mono)",letterSpacing:"-0.4px",
                        color:isSel?"var(--accent)":"var(--text-primary)"}}>${dp}</div>
                      <div style={{fontSize:10,color:"var(--text-muted)"}}>/month</div>
                    </div>
                  </div>
                  {isSel && (
                    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:5,
                      marginTop:8,paddingTop:8,borderTop:"1px solid var(--border)"}}>
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

        {/* 7-day trial note */}
        <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:10}}>
          <Ic d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" size={14} color="var(--accent)" sw={2}/>
          <span style={{fontSize:12,color:"var(--text-muted)",lineHeight:1.5}}>
            Try free for <strong style={{color:"var(--text-primary)"}}>7 days</strong> — no charge until your trial ends.
          </span>
        </div>

        {/* Competitor comparison */}
        <div style={{margin:"0 16px 20px",background:"var(--bg-raised)",borderRadius:"var(--r-md)",padding:"12px 14px"}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:1.2,marginBottom:8}}>HOW WE COMPARE</div>
          {[
            {name:"Hushed",    price:"$4.99",note:"US/UK/CA only"},
            {name:"Burner",    price:"$9.99",note:"US & Canada only"},
            {name:"Grasshopper",price:"$26+",note:"Business only"},
            {name:"DialGlobal ✦",price:`$${billing==="yearly"?PLANS[1].yearlyPrice:PLANS[1].monthlyPrice}`,note:"100+ countries",us:true},
          ].map((c,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"5px 0",borderBottom:i<3?"1px solid var(--border)":"none"}}>
              <span style={{fontSize:12,fontWeight:c.us?700:400,color:c.us?"var(--text-primary)":"var(--text-secondary)"}}>{c.name}</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:"var(--text-muted)"}}>{c.note}</span>
                <span style={{fontSize:12,fontWeight:700,fontFamily:"var(--font-mono)",
                  color:c.us?"var(--accent)":"var(--text-secondary)"}}>{c.price}/mo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:"var(--bg-surface)",borderTop:"1px solid var(--border)",padding:"12px 18px 20px",flexShrink:0}}>
        {billing==="yearly" && parseFloat(yearSaving) > 0 && (
          <div style={{textAlign:"center",fontSize:11,color:"var(--green)",fontWeight:600,marginBottom:10}}>
            🎉 You save ${yearSaving} a year with annual billing
          </div>
        )}
        <button className="press" onClick={handleSubscribe} disabled={loading || currentPlan===selected} style={{
          width:"100%",height:52,
          background:currentPlan===selected?"var(--bg-raised)":"var(--accent)",
          border:currentPlan===selected?"1px solid var(--border)":"none",
          borderRadius:"var(--r-md)",
          color:currentPlan===selected?"var(--text-muted)":"var(--bg-base)",
          fontSize:15,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:10,
          boxShadow:currentPlan===selected?"none":"0 6px 22px var(--accent-glow)",transition:"transform 0.1s"}}>
          {loading ? <><Spinner color="var(--bg-base)"/>Processing…</> :
           currentPlan===selected ? "Current plan" :
           `Start ${activePlan.name} — $${price}/mo →`}
        </button>
        <div style={{textAlign:"center",marginTop:9,fontSize:11,color:"var(--text-muted)"}}>
          7-day free trial · Cancel anytime
        </div>
      </div>
    </div>
  );
}
