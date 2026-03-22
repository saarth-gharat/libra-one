import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function AdminStudentsPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, max_borrow_limit, created_at")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  return (
    <AppShell
      title="Students"
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/admin/students"
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
      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">Student Accounts</h2>
            <p className="section-subtitle">View all registered student users.</p>
          </div>
        </div>

        {error ? (
          <div className="empty-state">Could not load students: {error.message}</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Borrow Limit</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {students?.length ? (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.full_name || "-"}</td>
                      <td>{student.email}</td>
                      <td>{student.role}</td>
                      <td>{student.max_borrow_limit ?? 3}</td>
                      <td>
                        {student.created_at
                          ? new Date(student.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">No students found.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}