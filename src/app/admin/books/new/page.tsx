import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import BookForm from "@/components/admin/BookForm";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function NewBookPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <AppShell
      title="Add New Book"
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/admin/books"
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
      <BookForm mode="create" categories={categories || []} />
    </AppShell>
  );
}