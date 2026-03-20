import { Switch, Route, Router as WouterRouter, Link, useRoute } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Numbers from "@/pages/Numbers";
import CallLogs from "@/pages/CallLogs";
import Revenue from "@/pages/Revenue";
import AdminSettings from "@/pages/AdminSettings";
import NotFound from "@/pages/not-found";
import {
  LayoutDashboard, Users as UsersIcon, Hash, PhoneCall, CreditCard, Settings, Globe, ChevronRight, Bell, LogOut,
} from "lucide-react";

const queryClient = new QueryClient();

const NAV = [
  { path: "/", label: "Dashboard",  Icon: LayoutDashboard },
  { path: "/users",   label: "Users",      Icon: UsersIcon },
  { path: "/numbers", label: "Numbers",    Icon: Hash },
  { path: "/calls",   label: "Call Logs",  Icon: PhoneCall },
  { path: "/revenue", label: "Revenue",    Icon: CreditCard },
  { path: "/settings",label: "Settings",   Icon: Settings },
];

function NavItem({ path, label, Icon }: { path: string; label: string; Icon: React.ElementType }) {
  const [active] = useRoute(path === "/" ? "/" : path + "*");
  return (
    <Link href={path}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
        ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
      <Icon size={16} strokeWidth={active ? 2.5 : 2} />
      {label}
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <Globe size={16} className="text-primary-foreground" />
        </div>
        <div>
          <span className="text-sm font-bold text-foreground">DialGlobal</span>
          <span className="block text-[10px] text-muted-foreground leading-none mt-0.5">Admin Console</span>
        </div>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(n => <NavItem key={n.path} {...n} />)}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">Admin</p>
            <p className="text-[10px] text-muted-foreground truncate">admin@dialglobal.io</p>
          </div>
          <LogOut size={13} className="text-muted-foreground shrink-0" />
        </div>
      </div>
    </aside>
  );
}

function Header({ title }: { title?: string }) {
  return (
    <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        <button className="relative w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted/50 transition-colors">
          <Bell size={14} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">A</div>
      </div>
    </header>
  );
}

function Layout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout title="Dashboard"><Dashboard /></Layout>} />
      <Route path="/users" component={() => <Layout title="Users"><Users /></Layout>} />
      <Route path="/numbers" component={() => <Layout title="Virtual Numbers"><Numbers /></Layout>} />
      <Route path="/calls" component={() => <Layout title="Call Logs"><CallLogs /></Layout>} />
      <Route path="/revenue" component={() => <Layout title="Revenue"><Revenue /></Layout>} />
      <Route path="/settings" component={() => <Layout title="Settings"><AdminSettings /></Layout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
