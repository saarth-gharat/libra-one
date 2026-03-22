import { AlertTriangle, BookOpen, CreditCard, RotateCcw } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import StatCard from "@/components/dashboard/StatCard";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function StudentPage() {
  const profile = await requireStudent();
  const supabase = await createClient();

  const { count: borrowedNow } = await supabase
    .from("borrows")
    .select("*", { count: "exact", head: true })
    .eq("student_id", profile.id)
    .eq("status", "borrowed");

  const { count: returnedCount } = await supabase
    .from("borrows")
    .select("*", { count: "exact", head: true })
    .eq("student_id", profile.id)
    .eq("status", "returned");

  const today = new Date().toISOString().slice(0, 10);

  const { count: overdueCount } = await supabase
    .from("borrows")
    .select("*", { count: "exact", head: true })
    .eq("student_id", profile.id)
    .lt("due_date", today)
    .in("status", ["borrowed", "overdue"]);

  const { data: currentBorrows } = await supabase
    .from("borrows")
    .select(`
      *,
      books:book_id (title, author)
    `)
    .eq("student_id", profile.id)
    .in("status", ["borrowed", "overdue"])
    .order("created_at", { ascending: false });

  const totalFine = (currentBorrows || []).reduce(
    (sum, item) => sum + Number(item.fine_amount || 0),
    0
  );

  return (
    <AppShell
      title="Student Dashboard"
      subtitle={`Welcome, ${profile.full_name || profile.email || "Student"}`}
      activeHref="/student"
      navItems={[
        { href: "/student", label: "Dashboard" },
        { href: "/student/books", label: "Browse Books" },
        { href: "/student/borrows", label: "My Borrows" },
        { href: "/student/history", label: "History" },
        { href: "/student/profile", label: "Profile" },
      ]}
      rightSlot={<LogoutButton />}
    >
      <section className="stats-grid compact-top">
        <StatCard
          label="Borrowed Now"
          value={borrowedNow || 0}
          note="Books currently with you"
          icon={BookOpen}
        />
        <StatCard
          label="Returned"
          value={returnedCount || 0}
          note="Books returned so far"
          icon={RotateCcw}
        />
        <StatCard
          label="Overdue"
          value={overdueCount || 0}
          note="Books needing return"
          icon={AlertTriangle}
        />
        <StatCard
          label="Total Fine"
          value={`₹${totalFine.toFixed(2)}`}
          note="Outstanding fine"
          icon={CreditCard}
        />
      </section>

      <section className="dashboard-grid-balanced">
        <div className="glass-card card-pad clean-panel">
          <div className="section-head">
            <div>
              <h2 className="section-title">Library Overview</h2>
              <p className="section-subtitle">Your account and borrowing summary.</p>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <strong>Current Active</strong>
              <span>{borrowedNow || 0}</span>
            </div>
            <div className="info-item">
              <strong>Returned</strong>
              <span>{returnedCount || 0}</span>
            </div>
            <div className="info-item">
              <strong>Borrow Limit</strong>
              <span>{profile.max_borrow_limit ?? 3}</span>
            </div>
            <div className="info-item">
              <strong>Outstanding Fine</strong>
              <span>₹{totalFine.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="glass-card card-pad clean-panel">
          <div className="section-head">
            <div>
              <h2 className="section-title">Student Summary</h2>
              <p className="section-subtitle">Profile information and access status.</p>
            </div>
          </div>

          <div className="profile-summary-card">
            <div className="profile-avatar">
              {(profile.full_name || profile.email || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="profile-summary-name">
                {profile.full_name || "Student User"}
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
            <h2 className="section-title">Current Borrowed Books</h2>
            <p className="section-subtitle">Track due dates and active items clearly.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {currentBorrows?.length ? (
                currentBorrows.map((item) => {
                  const statusClass =
                    item.status === "overdue" ? "badge badge-red" : "badge badge-yellow";

                  return (
                    <tr key={item.id}>
                      <td>{item.books?.title || "-"}</td>
                      <td>{item.books?.author || "-"}</td>
                      <td>{item.due_date}</td>
                      <td>
                        <span className={statusClass}>{item.status}</span>
                      </td>
                      <td>₹{Number(item.fine_amount || 0).toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">No borrowed books right now.</div>
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