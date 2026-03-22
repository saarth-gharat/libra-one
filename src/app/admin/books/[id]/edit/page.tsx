import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import BookForm from "@/components/admin/BookForm";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireAdmin();
  const supabase = await createClient();

  const [{ data: categories }, { data: book }] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("books").select("*").eq("id", id).single(),
  ]);

  if (!book) {
    notFound();
  }

  return (
    <AppShell
      title="Edit Book"
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
      <BookForm mode="edit" categories={categories || []} initialBook={book} />
    </AppShell>
  );
}