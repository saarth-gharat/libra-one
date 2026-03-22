"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";

export default function DeleteBookButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    const ok = window.confirm("Delete this book?");
    if (!ok) return;

    const { error } = await supabase.from("books").delete().eq("id", bookId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Book deleted.");
    router.refresh();
  }

  return (
    <button type="button" className="btn btn-danger" onClick={handleDelete}>
      Delete
    </button>
  );
}