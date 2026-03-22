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
    phone?: string | null;
    avatar_url?: string | null;
    max_borrow_limit?: number | null;
  };
}) {
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
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
    <div className="dashboard-grid-balanced">
      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">My Profile</h2>
            <p className="section-subtitle">Update your profile details and photo.</p>
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
            <label>Phone Number</label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="field-group">
            <label>Profile Photo URL</label>
            <input
              className="input"
              placeholder="https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="glass-card card-pad">
        <div className="section-head">
          <div>
            <h2 className="section-title">Preview</h2>
            <p className="section-subtitle">How your profile will appear in the dashboard.</p>
          </div>
        </div>

        <div className="profile-summary-card">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName || "Profile"}
              style={{ width: 58, height: 58, borderRadius: 18, objectFit: "cover" }}
            />
          ) : (
            <div className="profile-avatar">
              {(fullName || profile.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="profile-summary-name">{fullName || "User"}</div>
            <div className="profile-summary-email">{profile.email}</div>
          </div>
        </div>

        <div className="info-grid" style={{ marginTop: 16 }}>
          <div className="info-item">
            <strong>Role</strong>
            <span>{profile.role}</span>
          </div>
          <div className="info-item">
            <strong>Phone</strong>
            <span>{phone || "-"}</span>
          </div>
          <div className="info-item">
            <strong>Borrow Limit</strong>
            <span>{profile.max_borrow_limit ?? 3}</span>
          </div>
          <div className="info-item">
            <strong>Status</strong>
            <span>Active</span>
          </div>
        </div>
      </section>
    </div>
  );
}