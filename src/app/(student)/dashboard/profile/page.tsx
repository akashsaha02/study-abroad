import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { StudentProfileForm } from "@/components/forms/StudentProfileForm";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { getUser } from "@/lib/auth/get-user";
import { getStudentByProfileId } from "@/lib/services/students";

export default async function StudentProfilePage() {
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal and education information."
      />
      <StudentProfileForm profile={user?.profile ?? null} student={student} />
      <PanelCard title="Account">
        <p className="text-sm text-muted-foreground">
          To change your password, use the forgot password flow from the login page.
        </p>
        <form action={signOut} className="mt-4">
          <Button type="submit" variant="destructive">
            Sign out
          </Button>
        </form>
      </PanelCard>
    </div>
  );
}
