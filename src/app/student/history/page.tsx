import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function StudentHistoryPage() {
  const profile = await requireStudent();
  const supabase = await createClient();

  const { data: history } = await supabase
    .from("borrows")
    .select(`
      *,
      books:book_id (title, author, isbn)
    `)
    .eq("student_id", profile.id)
    .eq("status", "returned")
    .order("return_date", { ascending: false });

  return (
    <AppShell
      title="Borrow History"
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/student/history"
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
            <h2 className="section-title">Borrow History</h2>
            <p className="section-subtitle">Books you have returned earlier.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Borrowed</th>
                <th>Returned</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {history?.length ? (
                history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.books?.title || "-"}</td>
                    <td>{item.books?.author || "-"}</td>
                    <td>{item.borrow_date || "-"}</td>
                    <td>{item.return_date || "-"}</td>
                    <td>₹{Number(item.fine_amount || 0).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">No borrow history found.</div>
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