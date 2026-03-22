import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { Profile } from "@/lib/types";

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) return existingProfile;

  // Self-heal missing profile row
  const fallbackProfile = {
    id: user.id,
    full_name: (user.user_metadata?.full_name as string) || "",
    email: user.email || "",
    role: ((user.user_metadata?.role as "admin" | "student") || "student"),
    max_borrow_limit: 3,
  };

  const { data: insertedProfile, error: insertError } = await supabase
    .from("profiles")
    .upsert(fallbackProfile, { onConflict: "id" })
    .select("*")
    .single();

  if (insertError) {
    console.error("Profile fetch/create failed:", profileError, insertError);
    return null;
  }

  return insertedProfile as Profile;
}

export async function requireAuth() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/auth/login");
  return profile;
}

export async function requireAdmin() {
  const profile = await requireAuth();
  if (profile.role !== "admin") redirect("/dashboard");
  return profile;
}

export async function requireStudent() {
  const profile = await requireAuth();
  if (profile.role !== "student") redirect("/dashboard");
  return profile;
}