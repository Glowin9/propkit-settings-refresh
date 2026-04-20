import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Building2,
  Database,
  Settings as SettingsIcon,
  History,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/position-builder", label: "Position Builder", icon: Boxes },
  { to: "/prop-firms", label: "Prop Firms", icon: Building2 },
  { to: "/database", label: "Database", icon: Database },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/trade-history", label: "Trade History", icon: History },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="px-3.5 py-3.5 flex items-center gap-2 border-b border-sidebar-border">
          <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
            <span className="text-[11px] font-bold text-primary">TJ</span>
          </div>
          <div className="text-sm font-semibold tracking-tight">Trade Journal</div>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/60"
                )
              }
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border px-2 py-2">
          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            <Shield className="h-3.5 w-3.5" />
            Collapse
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

/** Compact top-right user/security cluster (replaces the loud "protected shell" block) */
export function TopUser() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="pk-chip pk-chip-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Protected
      </span>
      <button className="pk-btn-ghost">
        <Shield className="h-3 w-3" />
        Security
      </button>
      <button className="pk-btn-ghost">
        <LogOut className="h-3 w-3" />
        Logout
      </button>
    </div>
  );
}
