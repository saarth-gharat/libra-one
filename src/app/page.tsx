import Link from "next/link";
import { BookOpen, Library, ShieldCheck, Users } from "lucide-react";

export default function HomePage() {
  return (
    <main className="app-bg">
      <div className="container-page" style={{ minHeight: "100vh", display: "grid", alignItems: "center" }}>
        <div className="glass-card" style={{ padding: 34 }}>
          <div className="section-head">
            <div>
              <span className="badge badge-blue">Modern Library Platform</span>
              <h1
                style={{
                  margin: "18px 0 12px",
                  fontSize: "clamp(44px, 7vw, 76px)",
                  lineHeight: 1.02,
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                }}
              >
                LIBRA.ONE
              </h1>
              <p
                style={{
                  margin: 0,
                  maxWidth: 760,
                  fontSize: 18,
                  lineHeight: 1.75,
                  color: "rgb(var(--muted))",
                }}
              >
                A cleaner, calmer, modern library management system for books,
                students, issues, returns, fines, and role-based dashboards.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <Link href="/auth/login" className="btn btn-primary">
              Login
            </Link>
            <Link href="/auth/signup" className="btn btn-secondary">
              Create Account
            </Link>
          </div>

          <div className="grid-3" style={{ marginTop: 28 }}>
            <div className="soft-card card-pad">
              <Library size={22} />
              <h3 style={{ marginBottom: 8 }}>Admin Control</h3>
              <p style={{ margin: 0, color: "rgb(var(--muted))" }}>
                Manage books, categories, borrows, returns, and users.
              </p>
            </div>

            <div className="soft-card card-pad">
              <Users size={22} />
              <h3 style={{ marginBottom: 8 }}>Student Experience</h3>
              <p style={{ margin: 0, color: "rgb(var(--muted))" }}>
                Browse books, track due dates, history, and fines.
              </p>
            </div>

            <div className="soft-card card-pad">
              <ShieldCheck size={22} />
              <h3 style={{ marginBottom: 8 }}>Role-Based Access</h3>
              <p style={{ margin: 0, color: "rgb(var(--muted))" }}>
                Clean separate portals with a polished UI and theme toggle.
              </p>
            </div>
          </div>

          <div className="grid-3" style={{ marginTop: 16 }}>
            <div className="soft-card card-pad auth-stat">
              <strong>500+</strong>
              <span style={{ color: "rgb(var(--muted))" }}>Books</span>
            </div>
            <div className="soft-card card-pad auth-stat">
              <strong>200+</strong>
              <span style={{ color: "rgb(var(--muted))" }}>Students</span>
            </div>
            <div className="soft-card card-pad auth-stat">
              <strong>8</strong>
              <span style={{ color: "rgb(var(--muted))" }}>Categories</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}