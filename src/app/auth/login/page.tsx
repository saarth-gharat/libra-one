"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    await supabase.auth.getSession();

    toast.success("Login successful");
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="app-bg auth-shell">
      <section className="auth-left glass-card">
        <div className="auth-badge">LIBRA.ONE</div>
        <h1 className="auth-title">Your digital library workspace.</h1>
        <p className="auth-text">
          Discover, borrow, and manage your reading journey with a cleaner and
          more modern library system interface.
        </p>
      </section>

      <section className="glass-card auth-card">
        <h2>Welcome back</h2>
        <p>Sign in to continue to your dashboard</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label>Email address</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgb(var(--muted))" }} />
              <input
                className="input"
                type="email"
                placeholder="Enter your email"
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
              <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgb(var(--muted))" }} />
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            <BookOpen size={18} />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/auth/signup" className="link-primary">Sign up</Link>
        </div>
      </section>
    </main>
  );
}