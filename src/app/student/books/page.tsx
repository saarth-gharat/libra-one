import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/supabase/server";

export default async function StudentBooksPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; availability?: string }>;
}) {
  await requireStudent();
  const supabase = await createClient();
  const params = (await searchParams) || {};

  const q = (params.q || "").trim();
  const category = (params.category || "").trim();
  const availability = (params.availability || "").trim();

  const { data: categories } = await supabase.from("categories").select("*").order("name");

  let booksQuery = supabase
    .from("books")
    .select(`
      *,
      categories:category_id (name)
    `)
    .order("title");

  if (q) {
    booksQuery = booksQuery.or(`title.ilike.%${q}%,author.ilike.%${q}%,isbn.ilike.%${q}%`);
  }

  if (category) {
    booksQuery = booksQuery.eq("category_id", category);
  }

  if (availability === "available") {
    booksQuery = booksQuery.gt("available_copies", 0);
  }

  if (availability === "unavailable") {
    booksQuery = booksQuery.eq("available_copies", 0);
  }

  const { data: books } = await booksQuery;

  return (
    <AppShell
      title="Browse Books"
      subtitle="Search and explore library books"
      activeHref="/student/books"
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
            <h2 className="section-title">Find your next book</h2>
            <p className="section-subtitle">Search by title, author, ISBN, category, or availability.</p>
          </div>
        </div>

        <form className="toolbar" method="GET">
          <input
            className="input"
            name="q"
            placeholder="Search title, author, or ISBN"
            defaultValue={q}
            style={{ minWidth: 240, flex: 1 }}
          />

          <select className="select" name="category" defaultValue={category} style={{ minWidth: 200 }}>
            <option value="">All categories</option>
            {categories?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select className="select" name="availability" defaultValue={availability} style={{ minWidth: 180 }}>
            <option value="">All availability</option>
            <option value="available">Available only</option>
            <option value="unavailable">Unavailable only</option>
          </select>

          <button className="btn btn-primary" type="submit">
            Apply
          </button>
        </form>
      </section>

      <section className="book-grid">
        {books?.length ? (
          books.map((book) => {
            const isAvailable = book.available_copies > 0;

            return (
              <article key={book.id} className="glass-card card-pad book-card">
                <div className="book-cover">
                  {book.cover_image_url ? (
                    <img src={book.cover_image_url} alt={book.title} />
                  ) : (
                    <span className="badge badge-blue">LIBRA.ONE</span>
                  )}
                </div>

                <div>
                  <div className="book-title">{book.title}</div>
                  <div className="book-sub">by {book.author}</div>
                  <div className="book-sub">{book.categories?.name || "Uncategorized"}</div>
                </div>

                {book.description ? <div className="book-sub">{book.description}</div> : null}

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className={isAvailable ? "badge badge-green" : "badge badge-red"}>
                    {isAvailable ? `${book.available_copies} available` : "Not available"}
                  </span>
                  {book.isbn ? <span className="badge badge-blue">ISBN: {book.isbn}</span> : null}
                </div>
              </article>
            );
          })
        ) : (
          <div className="glass-card card-pad" style={{ gridColumn: "1 / -1" }}>
            <div className="empty-state">No books matched your filters.</div>
          </div>
        )}
      </section>
    </AppShell>
  );
}