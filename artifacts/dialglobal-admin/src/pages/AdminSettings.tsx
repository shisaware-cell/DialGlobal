import { useState } from "react";
import { Globe, Shield, Bell, CreditCard, Database, Zap } from "lucide-react";

function Field({ label, val, type = "text", disabled = false }: { label: string; val: string; type?: string; disabled?: boolean }) {
  const [v, setV] = useState(val);
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <input value={v} onChange={e => setV(e.target.value)} type={type} disabled={disabled}
        className="w-full h-9 px-3 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40 disabled:cursor-not-allowed" />
    </div>
  );
}

function Toggle({ label, sub, on }: { label: string; sub?: string; on?: boolean }) {
  const [val, setVal] = useState(on ?? false);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <button onClick={() => setVal(v => !v)}
        className={`relative w-10 h-5.5 rounded-full transition-colors ${val ? "bg-primary" : "bg-muted border border-border"}`}>
        <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${val ? "translate-x-4.5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

const SECTIONS = [
  { id:"general",   label:"General",    Icon:Globe },
  { id:"security",  label:"Security",   Icon:Shield },
  { id:"notifs",    label:"Notifications",Icon:Bell },
  { id:"billing",   label:"Billing",    Icon:CreditCard },
  { id:"database",  label:"Database",   Icon:Database },
  { id:"api",       label:"API",        Icon:Zap },
];

export default function AdminSettings() {
  const [active, setActive] = useState("general");

  return (
    <div className="flex gap-6 h-full">
      <nav className="w-44 shrink-0 bg-card border border-border rounded-xl p-2 self-start space-y-0.5">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${active === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
            <s.Icon size={14} />
            {s.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 space-y-5">
        {active === "general" && (
          <>
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <p className="text-sm font-semibold text-foreground border-b border-border pb-3">Platform</p>
              <Field label="App Name" val="DialGlobal" />
              <Field label="Support Email" val="support@dialglobal.io" />
              <Field label="Terms of Service URL" val="https://dialglobal.io/terms" />
              <Field label="Privacy Policy URL" val="https://dialglobal.io/privacy" />
            </div>
            <div className="bg-card border border-border rounded-xl p-5 space-y-1 divide-y divide-border">
              <p className="text-sm font-semibold text-foreground pb-3">Features</p>
              <Toggle label="Maintenance Mode" sub="Prevents new user sign-ups" />
              <Toggle label="SMS Enabled" sub="Allow SMS sending globally" on />
              <Toggle label="Call Recording" sub="Allow users to record calls" />
              <Toggle label="Referral Program" sub="Enable referral rewards" on />
            </div>
          </>
        )}

        {active === "security" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-sm font-semibold text-foreground border-b border-border pb-3">Security</p>
            <Field label="JWT Secret" val="••••••••••••••••••••••••" type="password" />
            <Field label="Max Login Attempts" val="5" />
            <Field label="Session Timeout (hours)" val="24" />
            <div className="space-y-1 divide-y divide-border pt-2">
              <Toggle label="Two-Factor Auth" sub="Require 2FA for all admin accounts" on />
              <Toggle label="IP Whitelist" sub="Restrict admin access to allowed IPs" />
              <Toggle label="Audit Logging" sub="Log all admin actions" on />
            </div>
          </div>
        )}

        {active === "notifs" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-sm font-semibold text-foreground border-b border-border pb-3">Notification Settings</p>
            <Field label="SendGrid API Key" val="SG.••••••••••••" type="password" />
            <Field label="Admin Alert Email" val="admin@dialglobal.io" />
            <div className="space-y-1 divide-y divide-border pt-2">
              <Toggle label="New User Alerts" on />
              <Toggle label="Failed Payment Alerts" on />
              <Toggle label="High Traffic Alerts" />
              <Toggle label="Daily Revenue Digest" on />
            </div>
          </div>
        )}

        {active === "billing" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-sm font-semibold text-foreground border-b border-border pb-3">Billing & Plans</p>
            {[
              { label:"Basic Plan Price ($/mo)",     val:"1.99" },
              { label:"Unlimited Plan Price ($/mo)", val:"4.99" },
              { label:"Global Plan Price ($/mo)",    val:"9.99" },
              { label:"Stripe Publishable Key",      val:"pk_live_••••••••••••" },
              { label:"Stripe Secret Key",           val:"sk_live_••••••••••••", type:"password" as const },
            ].map(f => <Field key={f.label} {...f} />)}
            <div className="divide-y divide-border">
              <Toggle label="Yearly Discount (20%)" on />
              <Toggle label="Trial Period (7 days)" on />
            </div>
          </div>
        )}

        {active === "database" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-sm font-semibold text-foreground border-b border-border pb-3">Supabase / Database</p>
            <Field label="Supabase URL" val="https://••••.supabase.co" />
            <Field label="Supabase Anon Key" val="eyJ••••••••••••" type="password" />
            <Field label="Supabase Service Role Key" val="eyJ••••••••••••" type="password" />
            <div className="flex gap-2 mt-2">
              <button className="h-9 px-4 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity">Test Connection</button>
              <button className="h-9 px-4 border border-border text-xs font-medium rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground">View Schema</button>
            </div>
          </div>
        )}

        {active === "api" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-sm font-semibold text-foreground border-b border-border pb-3">API Configuration</p>
            <Field label="Telnyx API Key" val="KEY••••••••••••" type="password" />
            <Field label="Twilio Account SID" val="AC••••••••••••" type="password" disabled />
            <Field label="Twilio Auth Token" val="••••••••••••" type="password" disabled />
            <Field label="Webhook URL" val="https://dialglobal.io/api/webhook" />
            <div className="space-y-1 divide-y divide-border pt-2">
              <Toggle label="Webhook Verification" on />
              <Toggle label="Rate Limiting" on />
              <Toggle label="API Key Rotation (30d)" />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button className="h-9 px-4 border border-border text-xs font-medium rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground">Discard</button>
          <button className="h-9 px-4 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
