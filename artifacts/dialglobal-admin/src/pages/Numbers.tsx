import { useState } from "react";
import { Search, Hash, Globe, User } from "lucide-react";

const ALL_NUMBERS = [
  { id:"1",  number:"+1 (415) 823-4921", country:"🇺🇸 United States", user:"Marcus Webb",  plan:"Unlimited", type:"permanent", calls:89,  sms:214, status:"active",   since:"Jul 14, 2026" },
  { id:"2",  number:"+44 7700 123 456",  country:"🇬🇧 United Kingdom", user:"Priya Sharma", plan:"Global",    type:"permanent", calls:134, sms:567, status:"active",   since:"Jun 2, 2026"  },
  { id:"3",  number:"+61 4 1234 5678",   country:"🇦🇺 Australia",      user:"David Chen",   plan:"Basic",     type:"temporary", calls:12,  sms:43,  status:"expiring",  since:"Aug 1, 2026"  },
  { id:"4",  number:"+49 30 1234567",    country:"🇩🇪 Germany",         user:"Sarah Miller", plan:"Unlimited", type:"permanent", calls:56,  sms:123, status:"active",   since:"May 10, 2026" },
  { id:"5",  number:"+65 8123 4567",     country:"🇸🇬 Singapore",       user:"Leila Ahmadi", plan:"Global",    type:"permanent", calls:178, sms:389, status:"active",   since:"Apr 22, 2026" },
  { id:"6",  number:"+1 (917) 555-0134", country:"🇺🇸 United States",   user:"James Okafor", plan:"Basic",     type:"permanent", calls:8,   sms:19,  status:"active",   since:"Aug 8, 2026"  },
  { id:"7",  number:"+81 3-1234-5678",   country:"🇯🇵 Japan",           user:"Yuki Tanaka",  plan:"Basic",     type:"temporary", calls:3,   sms:7,   status:"suspended", since:"Aug 3, 2026"  },
];

const STATUS_STYLE: Record<string, string> = {
  active:    "bg-green-500/15 text-green-400",
  expiring:  "bg-yellow-500/15 text-yellow-400",
  suspended: "bg-red-500/15 text-red-400",
};

export default function Numbers() {
  const [search, setSearch] = useState("");
  const filtered = ALL_NUMBERS.filter(n =>
    n.number.includes(search) || n.user.toLowerCase().includes(search.toLowerCase()) || n.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search numbers…"
            className="w-full h-9 pl-8 pr-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-2">
        {[
          { label:"Total Numbers",  val: ALL_NUMBERS.length, Icon: Hash,  color:"text-primary",   bg:"bg-primary/10" },
          { label:"Countries",      val: 6,                  Icon: Globe, color:"text-blue-400",  bg:"bg-blue-500/10" },
          { label:"Active Users",   val: 5,                  Icon: User,  color:"text-green-400", bg:"bg-green-500/10" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}><s.Icon size={16} className={s.color} /></div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.val}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Number","Country","User","Plan","Type","Calls","SMS","Status","Since"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(n => (
              <tr key={n.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-xs font-mono font-semibold text-foreground">{n.number}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{n.country}</td>
                <td className="px-4 py-3 text-xs text-foreground">{n.user}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${n.plan === "Global" ? "bg-violet-500/15 text-violet-400" : n.plan === "Unlimited" ? "bg-primary/15 text-primary" : "bg-blue-500/15 text-blue-400"}`}>{n.plan}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{n.type}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{n.calls}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{n.sms}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[n.status]}`}>{n.status}</span></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{n.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
