import Link from "next/link";
import {
  BookOpen,
  FolderKanban,
  History,
  LayoutDashboard,
  Library,
  Repeat,
  UserCircle2,
  Users,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

type NavItem = {
  href: string;
  label: string;
};

function getIcon(label: string) {
  const key = label.toLowerCase();

  if (key.includes("dashboard")) return LayoutDashboard;
  if (key.includes("book")) return BookOpen;
  if (key.includes("categor")) return FolderKanban;
  if (key.includes("student")) return Users;
  if (key.includes("borrow")) return Repeat;
  if (key.includes("history")) return History;
  if (key.includes("profile")) return UserCircle2;
  return Library;
}

export default function AppShell({
  title,
  subtitle,
  navItems,
  children,
  rightSlot,
  activeHref,
}: {
  title: string;
  subtitle: string;
  navItems: NavItem[];
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
  activeHref?: string;
}) {
  return (
    <div className="app-bg dashboard-shell">
      <aside className="sidebar">
        <div className="glass-card sidebar-card">
          <div className="brand-box">
            <div className="brand-title">LIBRA.ONE</div>
            <div className="brand-subtitle">Digital Library Workspace</div>
          </div>

          <nav className="nav-list">
            {navItems.map((item) => {
              const Icon = getIcon(item.label);
              const active = activeHref === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${active ? "active" : ""}`}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <Icon size={18} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <Link href="/dashboard" className="btn btn-secondary" style={{ width: "100%" }}>
              Home
            </Link>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <div className="topbar">
          <div className="glass-card topbar-inner">
            <div>
              <div className="topbar-title">{title}</div>
              <div className="topbar-subtitle">{subtitle}</div>
            </div>

            <div className="topbar-actions">
              <ThemeToggle />
              {rightSlot}
            </div>
          </div>
        </div>

        <div className="page-body">{children}</div>
      </main>
    </div>
  );
}