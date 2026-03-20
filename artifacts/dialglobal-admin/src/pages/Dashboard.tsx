import { Users, Hash, PhoneCall, DollarSign, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const STATS = [
  { label: "Total Users",    value: "14,832", delta: "+8.2%",  up: true,  Icon: Users,     color: "text-blue-400",   bg: "bg-blue-500/10" },
  { label: "Active Numbers", value: "9,214",  delta: "+12.4%", up: true,  Icon: Hash,      color: "text-primary",    bg: "bg-primary/10" },
  { label: "Calls Today",    value: "3,891",  delta: "-2.1%",  up: false, Icon: PhoneCall, color: "text-green-400",  bg: "bg-green-500/10" },
  { label: "MRR",            value: "$48,290",delta: "+18.7%", up: true,  Icon: DollarSign,color: "text-violet-400", bg: "bg-violet-500/10" },
];

const CHART_DATA = [
  { m:"Jan", users:8200, revenue:28000, calls:54000 },
  { m:"Feb", users:9100, revenue:31000, calls:61000 },
  { m:"Mar", users:9800, revenue:34500, calls:68000 },
  { m:"Apr", users:10400,revenue:37000, calls:72000 },
  { m:"May", users:11200,revenue:40200, calls:79000 },
  { m:"Jun", users:12100,revenue:43800, calls:84000 },
  { m:"Jul", users:13000,revenue:46200, calls:89000 },
  { m:"Aug", users:14832,revenue:48290, calls:95000 },
];

const RECENT_USERS = [
  { name:"Marcus Webb",   email:"marcus@ex.com",  plan:"Unlimited", country:"🇺🇸 US", joined:"2m ago",   status:"active" },
  { name:"Priya Sharma",  email:"priya@ex.com",   plan:"Global",    country:"🇬🇧 UK", joined:"14m ago",  status:"active" },
  { name:"David Chen",    email:"david@ex.com",   plan:"Basic",     country:"🇦🇺 AU", joined:"1h ago",   status:"active" },
  { name:"Sarah Miller",  email:"sarah@ex.com",   plan:"Unlimited", country:"🇩🇪 DE", joined:"3h ago",   status:"pending" },
  { name:"James Okafor",  email:"james@ex.com",   plan:"Basic",     country:"🇳🇬 NG", joined:"5h ago",   status:"active" },
];

const PLAN_DIST = [
  { name:"Basic",     count:5420, pct:36.6, color:"bg-blue-400" },
  { name:"Unlimited", count:6840, pct:46.1, color:"bg-primary" },
  { name:"Global",    count:2572, pct:17.3, color:"bg-violet-400" },
];

const TT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs font-semibold" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">Platform performance for August 2026</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.Icon size={14} className={s.color} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{s.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${s.up ? "text-green-400" : "text-red-400"}`}>
                {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {s.delta} vs last month
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Revenue Growth</p>
              <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8A020" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E8A020" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#E8A020" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-semibold text-foreground mb-1">Plan Distribution</p>
          <p className="text-xs text-muted-foreground mb-4">Active subscriptions by tier</p>
          <div className="space-y-3">
            {PLAN_DIST.map(p => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.count.toLocaleString()} · {p.pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full transition-all`} style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">Total active</p>
            <p className="text-xl font-bold text-foreground">14,832</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Recent Sign-Ups</p>
          <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowUpRight size={11} />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["User","Plan","Country","Joined","Status"].map(h => (
                <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_USERS.map((u, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{u.name[0]}</div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    u.plan === "Global" ? "bg-violet-500/15 text-violet-400" :
                    u.plan === "Unlimited" ? "bg-primary/15 text-primary" : "bg-blue-500/15 text-blue-400"}`}>{u.plan}</span>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{u.country}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{u.joined}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>{u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
