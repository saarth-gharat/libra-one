import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function StudentBorrowsPage() {
  const profile = await requireStudent();
  const supabase = await createClient();

  const { data: borrows } = await supabase
    .from("borrows")
    .select(`
      *,
      books:book_id (title, author, isbn)
    `)
    .eq("student_id", profile.id)
    .in("status", ["borrowed", "overdue"])
    .order("created_at", { ascending: false });

  return (
    <AppShell
      title="My Borrows"
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/student/borrows"
      navItems={[
        { href: "/student", label: "Dashboard" },
        { href: "/student/books", label: "Browse Books" },
        { href: "/student/borrows", label: "My Borrows" },
        { href: "/student/history", label: "History" },
        { href: "/student/profile", label: "Profile" },
      ]}
      rightSlot={<LogoutButton />}
    >
      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">Current Borrows</h2>
            <p className="section-subtitle">Books that are currently issued to you.</p>
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
              {borrows?.length ? (
                borrows.map((borrow) => (
                  <tr key={borrow.id}>
                    <td>{borrow.books?.title || "-"}</td>
                    <td>{borrow.books?.author || "-"}</td>
                    <td>{borrow.due_date}</td>
                    <td>
                      <span className={borrow.status === "overdue" ? "badge badge-red" : "badge badge-yellow"}>
                        {borrow.status}
                      </span>
                    </td>
                    <td>₹{Number(borrow.fine_amount || 0).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">No active borrowed books.</div>
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