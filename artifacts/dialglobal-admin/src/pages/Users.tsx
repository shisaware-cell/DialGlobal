import { useState } from "react";
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Trash2, Mail } from "lucide-react";

const ALL_USERS = [
  { id:"1",  name:"Marcus Webb",   email:"marcus@ex.com",  plan:"Unlimited", numbers:2, calls:89,  country:"🇺🇸 US", joined:"Aug 14, 2026", status:"active",    revenue:4.99 },
  { id:"2",  name:"Priya Sharma",  email:"priya@ex.com",   plan:"Global",    numbers:7, calls:214, country:"🇬🇧 UK", joined:"Aug 12, 2026", status:"active",    revenue:9.99 },
  { id:"3",  name:"David Chen",    email:"david@ex.com",   plan:"Basic",     numbers:1, calls:12,  country:"🇦🇺 AU", joined:"Aug 10, 2026", status:"active",    revenue:1.99 },
  { id:"4",  name:"Sarah Miller",  email:"sarah@ex.com",   plan:"Unlimited", numbers:3, calls:56,  country:"🇩🇪 DE", joined:"Aug 9, 2026",  status:"pending",   revenue:4.99 },
  { id:"5",  name:"James Okafor",  email:"james@ex.com",   plan:"Basic",     numbers:1, calls:8,   country:"🇳🇬 NG", joined:"Aug 8, 2026",  status:"active",    revenue:1.99 },
  { id:"6",  name:"Leila Ahmadi",  email:"leila@ex.com",   plan:"Global",    numbers:5, calls:178, country:"🇮🇷 IR", joined:"Aug 7, 2026",  status:"active",    revenue:9.99 },
  { id:"7",  name:"Finn Larsen",   email:"finn@ex.com",    plan:"Unlimited", numbers:2, calls:43,  country:"🇳🇴 NO", joined:"Aug 5, 2026",  status:"suspended", revenue:4.99 },
  { id:"8",  name:"Yuki Tanaka",   email:"yuki@ex.com",    plan:"Basic",     numbers:1, calls:3,   country:"🇯🇵 JP", joined:"Aug 3, 2026",  status:"active",    revenue:1.99 },
];

const STATUS_STYLE: Record<string, string> = {
  active:    "bg-green-500/15 text-green-400",
  pending:   "bg-yellow-500/15 text-yellow-400",
  suspended: "bg-red-500/15 text-red-400",
};

const PLAN_STYLE: Record<string, string> = {
  Basic:     "bg-blue-500/15 text-blue-400",
  Unlimited: "bg-primary/15 text-primary",
  Global:    "bg-violet-500/15 text-violet-400",
};

export default function Users() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  const filtered = ALL_USERS.filter(u =>
    (planFilter === "all" || u.plan === planFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
            className="w-full h-9 pl-8 pr-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex items-center gap-2">
          {["all","Basic","Unlimited","Global"].map(p => (
            <button key={p} onClick={() => setPlanFilter(p)}
              className={`h-9 px-3 rounded-lg text-xs font-medium transition-colors border ${planFilter === p ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              {p === "all" ? "All Plans" : p}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">{filtered.length} users</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["User","Plan","Numbers","Calls","Country","Joined","Status","Revenue",""].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{u.name[0]}</div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_STYLE[u.plan]}`}>{u.plan}</span></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.numbers}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.calls}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.country}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.joined}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[u.status]}`}>{u.status}</span></td>
                <td className="px-4 py-3 text-xs font-semibold text-foreground">${u.revenue}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="w-6 h-6 rounded-md hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Mail size={12} /></button>
                    <button className="w-6 h-6 rounded-md hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
