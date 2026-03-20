import { DollarSign, TrendingUp, Users, CreditCard } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const MRR_DATA = [
  { m:"Jan", mrr:28000, new:4200, churn:800 },
  { m:"Feb", mrr:31000, new:4800, churn:700 },
  { m:"Mar", mrr:34500, new:5200, churn:600 },
  { m:"Apr", mrr:37000, new:4100, churn:500 },
  { m:"May", mrr:40200, new:5800, churn:450 },
  { m:"Jun", mrr:43800, new:6200, churn:380 },
  { m:"Jul", mrr:46200, new:5100, churn:420 },
  { m:"Aug", mrr:48290, new:4900, churn:310 },
];

const PIE_DATA = [
  { name:"Basic ($1.99)",     value:10790, color:"#3B82F6" },
  { name:"Unlimited ($4.99)", value:34148, color:"#E8A020" },
  { name:"Global ($9.99)",    value:25714, color:"#A855F7" },
];

const INVOICES = [
  { user:"Marcus Webb",   plan:"Unlimited", amount:4.99,  date:"Aug 14, 2026", status:"paid" },
  { user:"Priya Sharma",  plan:"Global",    amount:9.99,  date:"Aug 12, 2026", status:"paid" },
  { user:"David Chen",    plan:"Basic",     amount:1.99,  date:"Aug 10, 2026", status:"paid" },
  { user:"Sarah Miller",  plan:"Unlimited", amount:4.99,  date:"Aug 9, 2026",  status:"failed" },
  { user:"James Okafor",  plan:"Basic",     amount:1.99,  date:"Aug 8, 2026",  status:"paid" },
  { user:"Finn Larsen",   plan:"Unlimited", amount:4.99,  date:"Aug 5, 2026",  status:"refunded" },
];

const TT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} className="text-xs font-semibold" style={{ color: p.stroke || p.fill }}>{p.name}: ${p.value.toLocaleString()}</p>)}
    </div>
  );
};

export default function Revenue() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"MRR",      val:"$48,290", sub:"+18.7%", Icon:DollarSign,  color:"text-primary",   bg:"bg-primary/10" },
          { label:"ARR",      val:"$579,480",sub:"Projected",Icon:TrendingUp, color:"text-green-400", bg:"bg-green-500/10" },
          { label:"ARPU",     val:"$3.26",   sub:"Per user/mo",Icon:Users,   color:"text-blue-400",  bg:"bg-blue-500/10" },
          { label:"Churn",    val:"2.1%",    sub:"This month",Icon:CreditCard,color:"text-red-400",   bg:"bg-red-500/10" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.Icon size={14} className={s.color} /></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{s.val}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-semibold text-foreground mb-0.5">MRR Breakdown</p>
          <p className="text-xs text-muted-foreground mb-4">New vs churned revenue</p>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={MRR_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="mrr" name="MRR" stroke="#E8A020" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="new" name="New" stroke="#22C55E" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="churn" name="Churn" stroke="#EF4444" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-semibold text-foreground mb-0.5">Revenue by Plan</p>
          <p className="text-xs text-muted-foreground mb-3">This month</p>
          <PieChart width={180} height={140}>
            <Pie data={PIE_DATA} cx={90} cy={65} innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
              {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
          </PieChart>
          <div className="space-y-2 mt-2">
            {PIE_DATA.map(p => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-[10px] text-muted-foreground">{p.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-foreground">${p.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Recent Transactions</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["User","Plan","Amount","Date","Status"].map(h => (
                <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv, i) => (
              <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3 text-xs font-semibold text-foreground">{inv.user}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inv.plan === "Global" ? "bg-violet-500/15 text-violet-400" : inv.plan === "Unlimited" ? "bg-primary/15 text-primary" : "bg-blue-500/15 text-blue-400"}`}>{inv.plan}</span>
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-foreground">${inv.amount}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{inv.date}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${inv.status === "paid" ? "bg-green-500/15 text-green-400" : inv.status === "failed" ? "bg-red-500/15 text-red-400" : "bg-muted text-muted-foreground"}`}>{inv.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
