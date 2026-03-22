import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import IssueReturnManager from "@/components/admin/IssueReturnManager";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function AdminBorrowsPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const [{ data: books }, { data: students }, { data: activeBorrows }] = await Promise.all([
    supabase.from("books").select("id, title, available_copies").order("title"),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "student")
      .order("full_name"),
    supabase
      .from("borrows")
      .select(`
        id,
        student_id,
        book_id,
        due_date,
        fine_amount,
        books:book_id (title, author),
        profiles:student_id (full_name, email)
      `)
      .in("status", ["borrowed", "overdue"])
      .order("created_at", { ascending: false }),
  ]);

  return (
    <AppShell
      title="Issue / Return"
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/admin/borrows"
      navItems={[
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/books", label: "Books" },
        { href: "/admin/categories", label: "Categories" },
        { href: "/admin/students", label: "Students" },
        { href: "/admin/borrows", label: "Issue / Return" },
        { href: "/admin/profile", label: "Profile" }
      ]}
      rightSlot={<LogoutButton />}
    >
      <IssueReturnManager
        books={books || []}
        students={students || []}
        activeBorrows={activeBorrows || []}
      />
    </AppShell>
  );
}