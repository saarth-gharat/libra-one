import Link from "next/link";
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
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/student"
      navItems={[
        { href: "/student", label: "Dashboard" },
        { href: "/student/books", label: "Browse Books" },
        { href: "/student/borrows", label: "My Borrows" },
        { href: "/student/history", label: "History" },
        { href: "/student/profile", label: "Profile" },
      ]}
      rightSlot={<LogoutButton />}
      sidebarActions={
        <>
          <Link href="/student/books" className="btn btn-primary sidebar-action-btn">
            Browse Books
          </Link>
          <Link href="/student/borrows" className="btn btn-secondary sidebar-action-btn">
            Current Borrows
          </Link>
          <Link href="/student/history" className="btn btn-secondary sidebar-action-btn">
            History
          </Link>
          <Link href="/student/profile" className="btn btn-secondary sidebar-action-btn">
            Profile
          </Link>
        </>
      }
    >
      <section className="stats-grid compact-top">
        <StatCard label="Borrowed Now" value={borrowedNow || 0} note="Books currently with you" icon={BookOpen} />
        <StatCard label="Returned" value={returnedCount || 0} note="Books returned so far" icon={RotateCcw} />
        <StatCard label="Overdue" value={overdueCount || 0} note="Books needing return" icon={AlertTriangle} />
        <StatCard label="Total Fine" value={`₹${totalFine.toFixed(2)}`} note="Outstanding fine" icon={CreditCard} />
      </section>

      <section className="grid-2">
        <div className="glass-card card-pad clean-panel">
          <div className="section-head">
            <div>
              <h2 className="section-title">Library Overview</h2>
              <p className="section-subtitle">A cleaner summary of your current student account.</p>
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
              <span>{profile.max_borrow_limit}</span>
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
              <h2 className="section-title">Account Status</h2>
              <p className="section-subtitle">Quick summary for your current library access.</p>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <strong>Profile Name</strong>
              <span>{profile.full_name || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Email</strong>
              <span>{profile.email}</span>
            </div>
            <div className="info-item">
              <strong>Role</strong>
              <span>{profile.role}</span>
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