import { AlertTriangle, BookOpen, RotateCcw, Users } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import StatCard from "@/components/dashboard/StatCard";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function AdminPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const [
    { count: totalBooks },
    { count: totalStudents },
    { count: activeBorrows },
    { count: returnedBooks },
  ] = await Promise.all([
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("borrows").select("*", { count: "exact", head: true }).eq("status", "borrowed"),
    supabase.from("borrows").select("*", { count: "exact", head: true }).eq("status", "returned"),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  const { count: overdueBooks } = await supabase
    .from("borrows")
    .select("*", { count: "exact", head: true })
    .lt("due_date", today)
    .in("status", ["borrowed", "overdue"]);

  const { data: recentLogs } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <AppShell
      title="Admin Dashboard"
      subtitle={`Welcome, ${profile.full_name || profile.email || "Admin"}`}
      activeHref="/admin"
      navItems={[
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/books", label: "Books" },
        { href: "/admin/categories", label: "Categories" },
        { href: "/admin/students", label: "Students" },
        { href: "/admin/borrows", label: "Issue / Return" },
        { href: "/admin/profile", label: "Profile" },
      ]}
      rightSlot={<LogoutButton />}
    >
      <section className="stats-grid compact-top">
        <StatCard
          label="Total Books"
          value={totalBooks || 0}
          note="All titles in catalog"
          icon={BookOpen}
        />
        <StatCard
          label="Students"
          value={totalStudents || 0}
          note="Registered student accounts"
          icon={Users}
        />
        <StatCard
          label="Active Borrows"
          value={activeBorrows || 0}
          note="Currently issued books"
          icon={RotateCcw}
        />
        <StatCard
          label="Overdue Books"
          value={overdueBooks || 0}
          note="Need attention"
          icon={AlertTriangle}
        />
      </section>

      <section className="dashboard-grid-balanced">
        <div className="glass-card card-pad clean-panel">
          <div className="section-head">
            <div>
              <h2 className="section-title">Library Snapshot</h2>
              <p className="section-subtitle">Clean overview of the current library system.</p>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <strong>Returned Books</strong>
              <span>{returnedBooks || 0}</span>
            </div>
            <div className="info-item">
              <strong>Overdue Items</strong>
              <span>{overdueBooks || 0}</span>
            </div>
            <div className="info-item">
              <strong>Student Accounts</strong>
              <span>{totalStudents || 0}</span>
            </div>
            <div className="info-item">
              <strong>Catalog Size</strong>
              <span>{totalBooks || 0}</span>
            </div>
          </div>
        </div>

        <div className="glass-card card-pad clean-panel">
          <div className="section-head">
            <div>
              <h2 className="section-title">Admin Summary</h2>
              <p className="section-subtitle">Profile and control overview.</p>
            </div>
          </div>

          <div className="profile-summary-card">
            <div className="profile-avatar">
              {(profile.full_name || profile.email || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="profile-summary-name">
                {profile.full_name || "Admin User"}
              </div>
              <div className="profile-summary-email">{profile.email || "-"}</div>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <strong>Role</strong>
              <span>{profile.role || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Status</strong>
              <span>Active</span>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">Recent Activity</h2>
            <p className="section-subtitle">Latest actions performed in the system.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs?.length ? (
                recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.action}</td>
                    <td>{log.entity_type}</td>
                    <td>{log.details || "-"}</td>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">No activity yet.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}