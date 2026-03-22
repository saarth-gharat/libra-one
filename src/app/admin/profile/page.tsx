import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import ProfileEditor from "@/components/shared/ProfileEditor";
import { requireAdmin } from "@/lib/auth";

export default async function AdminProfilePage() {
  const profile = await requireAdmin();

  return (
    <AppShell
      title="Admin Profile"
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/admin/profile"
      navItems={[
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/books", label: "Books" },
        { href: "/admin/categories", label: "Categories" },
        { href: "/admin/students", label: "Students" },
        { href: "/admin/borrows", label: "Issue / Return" },
        { href: "/admin/profile", label: "Profile" },
      ]}
      rightSlot={<LogoutButton />}
    >
      <ProfileEditor profile={profile} />
    </AppShell>
  );
}