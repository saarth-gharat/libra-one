"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

type Book = {
  id: string;
  title: string;
  available_copies: number | null;
};

type Student = {
  id: string;
  full_name: string | null;
  email: string;
};

type Borrow = {
  id: string;
  student_id: string;
  book_id: string;
  due_date: string;
  fine_amount: number | null;
  books?: { title: string; author?: string | null } | null;
  profiles?: { full_name?: string | null; email?: string | null } | null;
};

export default function IssueReturnManager({
  books,
  students,
  activeBorrows,
}: {
  books: Book[];
  students: Student[];
  activeBorrows: Borrow[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [issuing, setIssuing] = useState(false);

  const availableBooks = useMemo(
    () => books.filter((book) => (book.available_copies ?? 0) > 0),
    [books]
  );

  async function issueBook(e: React.FormEvent) {
    e.preventDefault();

    if (!studentId || !bookId || !dueDate) {
      toast.error("Select student, book, and due date.");
      return;
    }

    setIssuing(true);

    const payload: Record<string, unknown> = {
      student_id: studentId,
      book_id: bookId,
      due_date: dueDate,
      status: "borrowed",
      fine_amount: 0,
    };

    const today = new Date().toISOString().slice(0, 10);
    payload.borrow_date = today;

    const { error: insertError } = await supabase.from("borrows").insert(payload);

    if (insertError) {
      setIssuing(false);
      toast.error(insertError.message);
      return;
    }

    const selectedBook = books.find((book) => book.id === bookId);
    const currentAvailable = selectedBook?.available_copies ?? 0;

    const { error: updateError } = await supabase
      .from("books")
      .update({
        available_copies: Math.max(0, currentAvailable - 1),
      })
      .eq("id", bookId);

    setIssuing(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    toast.success("Book issued successfully.");
    setStudentId("");
    setBookId("");
    setDueDate("");
    router.refresh();
  }

  async function returnBook(borrow: Borrow) {
    const today = new Date();
    const due = new Date(borrow.due_date);
    const diffMs = today.getTime() - due.getTime();
    const overdueDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const fine = overdueDays * 5;

    const { error: borrowError } = await supabase
      .from("borrows")
      .update({
        status: "returned",
        return_date: today.toISOString().slice(0, 10),
        fine_amount: fine,
      })
      .eq("id", borrow.id);

    if (borrowError) {
      toast.error(borrowError.message);
      return;
    }

    const selectedBook = books.find((book) => book.id === borrow.book_id);
    const currentAvailable = selectedBook?.available_copies ?? 0;

    const { error: bookError } = await supabase
      .from("books")
      .update({
        available_copies: currentAvailable + 1,
      })
      .eq("id", borrow.book_id);

    if (bookError) {
      toast.error(bookError.message);
      return;
    }

    toast.success(`Book returned${fine ? ` with ₹${fine} fine` : ""}.`);
    router.refresh();
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">Issue Book</h2>
            <p className="section-subtitle">Assign a book to a student in a clean, simple form.</p>
          </div>
        </div>

        <form onSubmit={issueBook} className="grid-3">
          <div className="field-group">
            <label>Student</label>
            <select className="select" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name || student.email}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>Book</label>
            <select className="select" value={bookId} onChange={(e) => setBookId(e.target.value)}>
              <option value="">Select book</option>
              {availableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} ({book.available_copies ?? 0} available)
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>Due Date</label>
            <input
              className="input"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <button className="btn btn-primary" disabled={issuing}>
              {issuing ? "Issuing..." : "Issue Book"}
            </button>
          </div>
        </form>
      </section>

      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">Active Borrows</h2>
            <p className="section-subtitle">Return books and track overdue records.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Due Date</th>
                <th>Fine</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeBorrows.length ? (
                activeBorrows.map((borrow) => (
                  <tr key={borrow.id}>
                    <td>{borrow.profiles?.full_name || borrow.profiles?.email || "-"}</td>
                    <td>{borrow.books?.title || "-"}</td>
                    <td>{borrow.due_date}</td>
                    <td>₹{Number(borrow.fine_amount || 0).toFixed(2)}</td>
                    <td>
                      <button type="button" className="btn btn-secondary" onClick={() => returnBook(borrow)}>
                        Return
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">No active borrows.</div>
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