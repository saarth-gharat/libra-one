export type UserRole = "admin" | "student";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  max_borrow_limit: number;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  category_id: string | null;
  description: string | null;
  total_copies: number;
  available_copies: number;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Borrow = {
  id: string;
  student_id: string;
  book_id: string;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: "borrowed" | "returned" | "overdue";
  fine_amount: number;
  created_at: string;
  updated_at: string;
};

export type ActivityLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: string | null;
  created_at: string;
};