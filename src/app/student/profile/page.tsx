import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/layout/LogoutButton";
import ProfileEditor from "@/components/shared/ProfileEditor";
import { requireStudent } from "@/lib/auth";

export default async function StudentProfilePage() {
  const profile = await requireStudent();

  return (
    <AppShell
      title="My Profile"
      subtitle={`Welcome, ${profile.full_name || profile.email}`}
      activeHref="/student/profile"
      navItems={[
        { href: "/student", label: "Dashboard" },
        { href: "/student/books", label: "Browse Books" },
        { href: "/student/borrows", label: "My Borrows" },
        { href: "/student/history", label: "History" },
        { href: "/student/profile", label: "Profile" },
      ]}
      rightSlot={<LogoutButton />}
    >
      <ProfileEditor profile={profile} />
    </AppShell>
  );
}