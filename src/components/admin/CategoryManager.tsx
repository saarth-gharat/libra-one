"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("categories").insert({
      name: name.trim(),
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Category added.");
    setName("");
    router.refresh();
  }

  async function deleteCategory(id: string) {
    const ok = window.confirm("Delete this category?");
    if (!ok) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Category deleted.");
    router.refresh();
  }

  return (
    <div className="grid-2">
      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">Add Category</h2>
            <p className="section-subtitle">Create a new book category.</p>
          </div>
        </div>

        <form onSubmit={addCategory} style={{ display: "grid", gap: 14 }}>
          <div className="field-group">
            <label>Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </section>

      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">All Categories</h2>
            <p className="section-subtitle">Manage existing categories.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {initialCategories.length ? (
                initialCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => deleteCategory(category.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2}>
                    <div className="empty-state">No categories found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}