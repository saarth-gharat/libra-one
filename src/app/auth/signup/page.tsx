"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signup successful. Please login.");
    router.push("/auth/login");
  }

  return (
    <main className="app-bg auth-shell">
      <section className="auth-left glass-card">
        <div className="auth-badge">LIBRA.ONE</div>
        <h1 className="auth-title">Create your account.</h1>
        <p className="auth-text">
          Start with a more polished and professional library platform for
          students and administrators.
        </p>
      </section>

      <section className="glass-card auth-card">
        <h2>Create account</h2>
        <p>Fill the details below to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label>Full name</label>
            <div style={{ position: "relative" }}>
              <User2
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgb(var(--muted))",
                }}
              />
              <input
                className="input"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="field-group">
            <label>Email</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgb(var(--muted))",
                }}
              />
              <input
                className="input"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="field-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgb(var(--muted))",
                }}
              />
              <input
                className="input"
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="field-group">
            <label>Role</label>
            <select
              className="select"
              value={role}
              onChange={(e) => setRole(e.target.value as "student" | "admin")}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link href="/auth/login" className="link-primary">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}