import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload";
import { Button } from "antd";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { StudentProfileForm } from "@/components/forms/StudentProfileForm";
import { signOut } from "@/lib/auth/actions";
import { getUser } from "@/lib/auth/get-user";
import { getStudentByProfileId } from "@/lib/services/students";
import { getTranslations } from "next-intl/server";

export default async function StudentProfilePage() {
  const t = await getTranslations("dashboard");
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;
  const displayName = user?.profile?.full_name ?? user?.email ?? "User";

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("profile")}
        description="Manage your personal and education information."
      />
      {user && (
        <PanelCard title={t("avatarTitle")}>
          <ProfileAvatarUpload
            userId={user.id}
            name={displayName}
            avatarUrl={user.profile?.avatar_url ?? null}
          />
        </PanelCard>
      )}
      <StudentProfileForm profile={user?.profile ?? null} student={student} />
      <PanelCard title="Account">
        <p className="text-sm text-muted-foreground">
          To change your password, use the forgot password flow from the login page.
        </p>
        <form action={signOut} className="mt-4">
          <Button htmlType="submit" danger>
            Sign out
          </Button>
        </form>
      </PanelCard>
    </div>
  );
}
