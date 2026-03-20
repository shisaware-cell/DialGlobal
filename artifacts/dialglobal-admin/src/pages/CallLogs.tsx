import { useState } from "react";
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Voicemail, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CALLS_DATA = [
  { d:"Mon", incoming:420, outgoing:310, missed:48 },
  { d:"Tue", incoming:380, outgoing:290, missed:61 },
  { d:"Wed", incoming:510, outgoing:380, missed:39 },
  { d:"Thu", incoming:470, outgoing:350, missed:52 },
  { d:"Fri", incoming:620, outgoing:480, missed:33 },
  { d:"Sat", incoming:280, outgoing:190, missed:29 },
  { d:"Sun", incoming:210, outgoing:145, missed:22 },
];

const LOGS = [
  { id:"1", from:"+1 (415) 823-4921", to:"+1 917 555 0134",  type:"outgoing",  dur:"4:32",  time:"2m ago",  status:"completed" },
  { id:"2", from:"+44 7700 123 456",  to:"+44 20 7946 0958", type:"incoming",  dur:"12:05", time:"14m ago", status:"completed" },
  { id:"3", from:"+1 (415) 823-4921", to:"+1 650 555 7823",  type:"missed",    dur:"",      time:"1h ago",  status:"missed"    },
  { id:"4", from:"+61 4 1234 5678",   to:"+61 2 9374 4000",  type:"outgoing",  dur:"1:44",  time:"2h ago",  status:"completed" },
  { id:"5", from:"+49 30 1234567",    to:"+49 89 123456",    type:"voicemail", dur:"0:42",  time:"3h ago",  status:"voicemail" },
  { id:"6", from:"+1 (917) 555-0134", to:"+1 415 555 1234",  type:"incoming",  dur:"8:11",  time:"4h ago",  status:"completed" },
];

const TYPE_ICON: Record<string, React.ElementType> = { incoming: PhoneIncoming, outgoing: PhoneOutgoing, missed: PhoneMissed, voicemail: Voicemail };
const STATUS_STYLE: Record<string, string> = { completed:"bg-green-500/15 text-green-400", missed:"bg-red-500/15 text-red-400", voicemail:"bg-muted text-muted-foreground" };

const TT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} className="text-xs font-semibold" style={{ color: p.fill }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function CallLogs() {
  const [search, setSearch] = useState("");
  const filtered = LOGS.filter(l => l.from.includes(search) || l.to.includes(search));

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Call Volume</p>
            <p className="text-xs text-muted-foreground">Last 7 days by type</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={CALLS_DATA} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
            <Tooltip content={<TT />} />
            <Bar dataKey="incoming" name="Incoming" fill="#E8A020" radius={[3,3,0,0]} />
            <Bar dataKey="outgoing" name="Outgoing" fill="#3B82F6" radius={[3,3,0,0]} />
            <Bar dataKey="missed"   name="Missed"   fill="#EF4444" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by number…"
            className="w-full h-9 pl-8 pr-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Type","From","To","Duration","Time","Status"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => {
              const Icon = TYPE_ICON[l.type] || PhoneOutgoing;
              return (
                <tr key={l.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${l.type === "missed" ? "bg-red-500/10" : l.type === "incoming" ? "bg-primary/10" : "bg-blue-500/10"}`}>
                      <Icon size={13} className={l.type === "missed" ? "text-red-400" : l.type === "incoming" ? "text-primary" : "text-blue-400"} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-foreground">{l.from}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{l.to}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{l.dur || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{l.time}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[l.status]}`}>{l.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
