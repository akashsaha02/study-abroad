import { AccountProfileContent } from "@/components/profile/AccountProfileContent";
import { getUser } from "@/lib/auth/get-user";
import type { UserRole } from "@/types";

export default async function AccountProfilePage() {
  const user = await getUser();
  const role = (user?.profile?.role ?? "student") as UserRole;

  return <AccountProfileContent role={role} />;
}
