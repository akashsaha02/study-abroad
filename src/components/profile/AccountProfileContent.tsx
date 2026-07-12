import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload";
import { BasicProfileForm } from "@/components/forms/BasicProfileForm";
import { StudentProfileForm } from "@/components/forms/StudentProfileForm";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { getUser } from "@/lib/auth/get-user";
import { getStudentByProfileId } from "@/lib/services/students";
import type { UserRole } from "@/types";
import { getTranslations } from "next-intl/server";

interface AccountProfileContentProps {
  role: UserRole;
}

export async function AccountProfileContent({ role }: AccountProfileContentProps) {
  const t = await getTranslations("dashboard");
  const user = await getUser();
  const student =
    role === "student" && user ? await getStudentByProfileId(user.id) : null;
  const displayName = user?.profile?.full_name ?? user?.email ?? "User";
  const isStudent = role === "student";

  return (
    <div className="space-y-6">
      <PageHeader title={t("profile")} description={t("profileDescription")} />

      {user && (
        <PanelCard title={t("avatarTitle")}>
          <p className="mb-4 text-sm text-muted-foreground">{t("avatarDesc")}</p>
          <ProfileAvatarUpload
            userId={user.id}
            name={displayName}
            avatarUrl={user.profile?.avatar_url ?? null}
          />
        </PanelCard>
      )}

      {isStudent ? (
        <StudentProfileForm profile={user?.profile ?? null} student={student} />
      ) : (
        <BasicProfileForm profile={user?.profile ?? null} />
      )}

      <PanelCard title={t("accountSection")}>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("emailLabel")}</dt>
            <dd className="font-medium">{user?.profile?.email ?? user?.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("roleLabel")}</dt>
            <dd className="font-medium capitalize">{user?.profile?.role?.replace("_", " ") ?? "—"}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">{t("passwordHint")}</p>
      </PanelCard>
    </div>
  );
}
