import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import CategoryManager from "@/components/admin/CategoryManager";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function AdminCategoriesPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <AppShell
      title="Manage Categories"
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/admin/categories"
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
      <CategoryManager initialCategories={categories || []} />
    </AppShell>
  );
}