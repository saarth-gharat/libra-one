"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileEditor({
  profile,
}: {
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    role: string;
    max_borrow_limit?: number | null;
  };
}) {
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() || null })
      .eq("id", profile.id);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Profile updated.");
    router.refresh();
  }

  return (
    <div className="grid-2">
      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">My Profile</h2>
            <p className="section-subtitle">Update your profile details.</p>
          </div>
        </div>

        <form onSubmit={saveProfile} style={{ display: "grid", gap: 14 }}>
          <div className="field-group">
            <label>Full Name</label>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="field-group">
            <label>Email</label>
            <input className="input" value={profile.email} readOnly />
          </div>

          <div className="field-group">
            <label>Role</label>
            <input className="input" value={profile.role} readOnly />
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">Library Account</h2>
            <p className="section-subtitle">Overview of your borrowing access.</p>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <strong>Borrow Limit</strong>
            <span>{profile.max_borrow_limit ?? 3}</span>
          </div>
          <div className="info-item">
            <strong>Account Type</strong>
            <span>{profile.role}</span>
          </div>
        </div>
      </section>
    </div>
  );
}