"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";

type Category = {
  id: string;
  name: string;
};

type Book = {
  id?: string;
  title?: string;
  author?: string;
  isbn?: string | null;
  category_id?: string | null;
  total_copies?: number | null;
  available_copies?: number | null;
  description?: string | null;
  cover_image_url?: string | null;
  published_year?: number | null;
};

export default function BookForm({
  mode,
  categories,
  initialBook,
}: {
  mode: "create" | "edit";
  categories: Category[];
  initialBook?: Book;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(initialBook?.title || "");
  const [author, setAuthor] = useState(initialBook?.author || "");
  const [isbn, setIsbn] = useState(initialBook?.isbn || "");
  const [categoryId, setCategoryId] = useState(initialBook?.category_id || "");
  const [totalCopies, setTotalCopies] = useState(String(initialBook?.total_copies ?? 1));
  const [availableCopies, setAvailableCopies] = useState(
    String(initialBook?.available_copies ?? 1)
  );
  const [publishedYear, setPublishedYear] = useState(
    initialBook?.published_year ? String(initialBook.published_year) : ""
  );
  const [coverImageUrl, setCoverImageUrl] = useState(initialBook?.cover_image_url || "");
  const [description, setDescription] = useState(initialBook?.description || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const total = Number(totalCopies);
    const available = Number(availableCopies);

    if (!title.trim() || !author.trim()) {
      toast.error("Title and author are required.");
      return;
    }

    if (Number.isNaN(total) || total < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    if (Number.isNaN(available) || available < 0 || available > total) {
      toast.error("Available copies must be between 0 and total copies.");
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim() || null,
      category_id: categoryId || null,
      total_copies: total,
      available_copies: available,
      description: description.trim() || null,
      cover_image_url: coverImageUrl.trim() || null,
      published_year: publishedYear ? Number(publishedYear) : null,
    };

    if (mode === "create") {
      const { error } = await supabase.from("books").insert(payload);

      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }

      toast.success("Book added successfully.");
      router.push("/admin/books");
      router.refresh();
      return;
    }

    const { error } = await supabase
      .from("books")
      .update(payload)
      .eq("id", initialBook?.id);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Book updated successfully.");
    router.push("/admin/books");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card card-pad" style={{ display: "grid", gap: 16 }}>
      <div className="section-head">
        <div>
          <h2 className="section-title">{mode === "create" ? "Add Book" : "Edit Book"}</h2>
          <p className="section-subtitle">
            {mode === "create"
              ? "Add a new book to the library catalog."
              : "Update the selected book details."}
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="field-group">
          <label>Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>Author</label>
          <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
      </div>

      <div className="grid-3">
        <div className="field-group">
          <label>ISBN</label>
          <input className="input" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        </div>

        <div className="field-group">
          <label>Category</label>
          <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label>Published Year</label>
          <input
            className="input"
            type="number"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="field-group">
          <label>Total Copies</label>
          <input
            className="input"
            type="number"
            min="1"
            value={totalCopies}
            onChange={(e) => setTotalCopies(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label>Available Copies</label>
          <input
            className="input"
            type="number"
            min="0"
            value={availableCopies}
            onChange={(e) => setAvailableCopies(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field-group">
        <label>Cover Image URL</label>
        <input
          className="input"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="field-group">
        <label>Description</label>
        <textarea
          className="textarea"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Add Book" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}