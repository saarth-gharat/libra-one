import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/supabase/server";
import DeleteBookButton from "@/components/admin/DeleteBookButton";

export default async function AdminBooksPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const { data: books } = await supabase
    .from("books")
    .select(`
      *,
      categories:category_id (name)
    `)
    .order("created_at", { ascending: false });

  return (
    <AppShell
      title="Manage Books"
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/admin/books"
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
            <h2 className="section-title">Books Catalog</h2>
            <p className="section-subtitle">Add, edit, and remove books from the library.</p>
          </div>

          <Link href="/admin/books/new" className="btn btn-primary">
            Add Book
          </Link>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Total</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books?.length ? (
                books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.categories?.name || "-"}</td>
                    <td>{book.total_copies ?? 0}</td>
                    <td>{book.available_copies ?? 0}</td>
                    <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link href={`/admin/books/${book.id}/edit`} className="btn btn-secondary">
                        Edit
                      </Link>
                      <DeleteBookButton bookId={book.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">No books found.</div>
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
